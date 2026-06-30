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
          type: 'text',
          title: 'Pharmacogenomics and the CYP450 Enzyme System: What Counselors Need to Know',
          body: '<p>One of the most clinically frustrating experiences in psychiatric treatment is watching a client fail multiple antidepressants in succession—side effects that are unbearable, therapeutic benefits that never materialize, or responses that are wildly different from what the prescriber expected. Increasingly, pharmacogenomic testing is revealing that a significant portion of this variability is not random: it is genetically determined. For counselors, understanding the basic concept of pharmacogenomics—and knowing when to mention it to clients or prescribers—is becoming a meaningful part of medication-informed clinical practice.</p><p><strong>Pharmacogenomics</strong> is the study of how genetic variation affects an individual\'s response to medications. In psychiatry, the most clinically relevant genetic variations are those affecting the cytochrome P450 (CYP450) enzyme system—the family of liver enzymes primarily responsible for metabolizing most psychiatric medications. Different individuals carry different genetic variants of these enzymes, which means the same medication dose can produce wildly different blood levels in different people. Some individuals metabolize a drug so rapidly that standard doses never reach therapeutic concentrations—these are called "ultra-rapid metabolizers." Others metabolize so slowly that standard doses accumulate to toxic levels—"poor metabolizers." Most people fall somewhere between these extremes, but the variation is clinically significant far more often than is commonly recognized.</p><p>The most important CYP enzymes for psychiatric medications are <strong>CYP2D6</strong>, <strong>CYP2C19</strong>, <strong>CYP3A4</strong>, and <strong>CYP1A2</strong>. CYP2D6 metabolizes a large proportion of antidepressants (fluoxetine, paroxetine, duloxetine, venlafaxine, amitriptyline, nortriptyline) and many antipsychotics (risperidone, haloperidol, aripiprazole). Approximately 7–10% of people of European descent are CYP2D6 poor metabolizers, meaning they cannot efficiently metabolize these medications; they are at much higher risk of side effects and toxicity at standard doses. Conversely, CYP2D6 ultra-rapid metabolizers (a genetic variant more common in North African and Middle Eastern populations) may fail seemingly adequate trials of antidepressants because the drugs are cleared before ever reaching therapeutic levels. CYP2C19 metabolizes citalopram, escitalopram, sertraline, and several other commonly used agents. CYP2C19 poor metabolizers (common in Asian populations—up to 20% of East Asians compared to 2–5% of Europeans) may have significantly elevated blood levels of these medications at standard doses, explaining unexpected side effects or overresponse. Proton pump inhibitors (omeprazole, pantoprazole) commonly prescribed for GI issues inhibit CYP2C19, which can raise blood levels of psychiatric medications co-administered.</p><p>For counselors, the practical relevance of the CYP450 system is not memorizing enzyme charts—it is understanding that when a client says "I\'ve tried six antidepressants and nothing works" or "every medication I try gives me terrible side effects," this pattern may reflect pharmacogenomic factors rather than treatment resistance or hypochondria. Pharmacogenomic testing (commercially available through companies like GeneSight, Genomind, and CNSDose) can identify CYP450 genotype and provide prescribers with medication selection guidance personalized to the client\'s genetic profile. Counselors can raise this as a topic for clients to discuss with their prescribers when the history of medication trials suggests possible metabolizer abnormalities. Framing it as "there may be a genetic reason medications affect you differently, and your prescriber might consider testing for this" is both accurate and empowering for clients who have experienced repeated treatment failures.</p><p>Several specific CYP450 drug interactions are worth knowing because they are clinically common and can produce dangerous consequences. <strong>Fluoxetine and paroxetine are potent CYP2D6 inhibitors</strong>—meaning they block the enzyme that metabolizes them and many other drugs. Adding fluoxetine to a tricyclic antidepressant regimen can double or triple TCA blood levels, potentially causing TCA toxicity even at doses that were previously well-tolerated. This is a serious, well-documented interaction that counselors should be aware of; if a client on a TCA begins fluoxetine, increased vigilance for TCA side effects and toxicity signs is warranted. <strong>Fluvoxamine</strong> is a potent inhibitor of multiple CYP enzymes (1A2, 2C9, 2C19, 3A4) and interacts with an enormous range of medications—from caffeine to clozapine to benzodiazepines—making it one of the most interaction-prone antidepressants. <strong>Carbamazepine</strong> is a potent CYP inducer, meaning it dramatically speeds up the metabolism of many other medications, reducing their blood levels. Clients on carbamazepine and another psychiatric medication may need substantially higher doses of the second medication to achieve therapeutic effect. The same dose that was adequate before carbamazepine was added may be subtherapeutic after. This also affects hormonal contraceptives—carbamazepine reduces their blood levels, potentially rendering them ineffective, which has reproductive health implications counselors should know about.</p><p>The counselor\'s role in all of this is not to perform pharmacokinetic calculations. It is to recognize patterns that suggest CYP450-related issues and bring them to prescriber attention: a client who consistently experiences medication side effects at doses others tolerate well, a client who seems to need unusually high doses to get therapeutic benefit, a client of Asian descent who has a history of multiple SSRI failures. Naming the possibility and communicating it to the prescriber is an appropriate and valuable clinical contribution.</p>'
        },
        {
          type: 'text',
          title: 'Black Box Warnings: Antidepressants, Pediatric Suicidality, and the Counselor\'s Monitoring Role',
          body: '<p>Black box warnings are the FDA\'s strongest form of drug warning, required on the label of a medication when there is a reasonable evidence of serious risk—risk serious enough that healthcare providers and patients need to be explicitly warned before initiating treatment. For counselors, understanding the black box warnings relevant to psychiatric medications is essential clinical knowledge: these are the risks that require heightened monitoring, informed consent conversations with clients, and proactive communication with prescribers when concerning signs emerge.</p><p>The most widely known black box warning in psychiatry is the <strong>antidepressant suicidality warning for children, adolescents, and young adults</strong>, added to all antidepressant labeling in 2004 and extended in 2006. The warning states that antidepressants increase the risk of suicidal thinking and behavior in children, adolescents, and young adults (ages 18–24) in the first one to two months of treatment. This is not a warning that antidepressants cause completed suicide—in fact, the relationship between antidepressant treatment and completed suicide is complex and the evidence suggests that adequate treatment of depression reduces completed suicide risk. The concern is specifically about suicidal ideation and behaviors during the activation phase of early antidepressant treatment, when energy and motivation may increase before mood fully stabilizes—and in vulnerable younger clients, this can translate to increased suicidal thinking or impulsive behavior.</p><p>For counselors, this warning has direct clinical implications. Any client under age 25 who is starting an antidepressant should be seen with increased frequency in the early weeks of treatment. Clinical guidelines recommend weekly contact for the first four weeks, then biweekly for the following four weeks. For many counselors, this is already within normal practice—but it is worth explicitly framing the purpose: not just therapeutic support, but monitoring for emergent suicidality, activation, agitation, or behavioral change that may signal need for prescriber contact. Specific questions counselors should ask in these early sessions include: Has the client noticed any increase in agitation or irritability? Are they sleeping worse than before? Have they had any new or increased thoughts of self-harm or suicide? Any change in behavior that family or friends have noticed? These questions should be documented. If a client endorses new or worsening suicidal ideation within the first two months of starting an antidepressant, the prescriber must be notified promptly—not at the next scheduled appointment, but that day.</p><p>A second critical black box warning relevant to counselors involves <strong>antipsychotics and elderly patients with dementia-related psychosis</strong>. Atypical antipsychotics carry a black box warning that their use in elderly patients with dementia-related psychosis is associated with increased mortality—primarily from cardiovascular events (stroke, heart attack) and infections (particularly pneumonia). Despite this warning, off-label use of antipsychotics in nursing home settings for behavioral management of dementia remains common. Counselors working in geriatric settings, memory care facilities, or with older adults may encounter clients or family members navigating decisions about antipsychotic use for agitation, aggression, or psychotic symptoms in the context of dementia. The counselor\'s role is not to advise for or against this prescribing decision, but to ensure that informed consent conversations have occurred and that family members or guardians understand the risk. Counselors can also advocate for non-pharmacological behavioral interventions—structured activity, environmental modification, caregiver training—as first-line approaches to dementia-related behavioral disturbance before pharmacological escalation. If a counselor is working in a geriatric setting and observes changes in an elderly client\'s health status (sudden confusion, respiratory symptoms) in the context of antipsychotic use, promptly communicating with the prescribing team is appropriate.</p><p>Other black box warnings counselors should be aware of include atomoxetine\'s warning for increased suicidal ideation in children and adolescents (addressed in Section 3), the tricyclic antidepressant lethality concern in overdose (discussed previously), and clozapine\'s warnings for agranulocytosis, seizures, myocarditis, and orthostatic hypotension (discussed in the antipsychotic section). The common clinical thread across all these warnings is that they identify populations and timeframes that require heightened vigilance—and counselors, as the providers with the most frequent contact with clients, are often the most strategically positioned to provide that vigilance.</p>'
        },
        {
          type: 'text',
          title: 'Polypharmacy in Mental Health Clients: Drug-Drug Interactions Counselors Should Know',
          body: '<p>Polypharmacy—the concurrent use of multiple medications—is the rule rather than the exception in mental health populations. A client with bipolar disorder with comorbid ADHD, anxiety, and chronic pain may be taking a mood stabilizer, an atypical antipsychotic, a stimulant, an anxiolytic, and a pain medication simultaneously. Clients with schizophrenia often receive multiple antipsychotics plus mood stabilizers plus sleep aids. Clients with complex trauma histories may be on combinations of antidepressants, mood stabilizers, prazosin for nightmares, and benzodiazepines. This polypharmacy creates a landscape where drug-drug interactions are not a theoretical concern—they are a clinical reality that counselors will regularly encounter in their clients\' medication profiles.</p><p>Drug-drug interactions in psychiatry occur through several mechanisms. <strong>Pharmacokinetic interactions</strong> alter the absorption, distribution, metabolism, or excretion of a drug—the CYP450 enzyme interactions discussed above are the most clinically significant example. When one drug inhibits an enzyme that metabolizes another drug, blood levels of the second drug rise, potentially into toxic territory. When one drug induces an enzyme, blood levels of co-administered drugs fall, potentially below therapeutic threshold. Counselors do not need to track all of these interactions in detail, but knowing that they exist and that clients on multiple medications should have their prescriber or pharmacist review new additions for interactions is an important clinical skill.</p><p><strong>Pharmacodynamic interactions</strong> occur when two drugs that act on the same biological system produce additive or synergistic (more than additive) effects. The most clinically dangerous example in psychiatry is <strong>serotonin syndrome</strong>—a potentially life-threatening condition resulting from excessive serotonergic activity, most commonly caused by combining two or more serotonergic agents. Classic combinations that cause serotonin syndrome include MAOIs combined with any serotonergic antidepressant (the combination can be immediately dangerous and require a washout period before switching), SSRIs combined with tramadol (an opioid with serotonergic properties), SSRIs combined with triptans (used for migraine), linezolid (an antibiotic with MAOI properties) combined with SSRIs, and combining multiple serotonergic antidepressants. Serotonin syndrome presents with a classic triad: altered mental status (agitation, confusion), autonomic instability (elevated temperature, tachycardia, diaphoresis, labile blood pressure), and neuromuscular abnormalities (tremor, myoclonus, hyperreflexia, clonus). Severe cases can produce hyperthermia above 41°C and be fatal. Counselors should recognize this triad and treat it as a medical emergency. It differs from NMS in its typically more rapid onset (often within hours of a new drug addition) and its specific neuromuscular features.</p><p>CNS depression is another area of dangerous pharmacodynamic polypharmacy. Benzodiazepines, opioids, and alcohol all depress CNS function—combining them multiplies respiratory depression risk substantially beyond the additive contribution of each. The opioid epidemic has made this interaction particularly deadly: benzodiazepine-opioid co-prescription is associated with a dramatically increased risk of overdose death. Counselors working with clients who are prescribed opioids (for pain) and benzodiazepines (for anxiety or sleep) simultaneously should ensure the prescribing team is aware of this risk, that the client has access to naloxone, and that the client understands the danger of adding alcohol to this combination. This is a conversation counselors can have within their scope of practice as a harm reduction and safety measure.</p><p>Anticholinergic burden is another polypharmacy concern of particular relevance when working with older adults. Multiple medications can each contribute modest anticholinergic effects that individually seem minor but cumulatively produce significant cognitive impairment, confusion, constipation, urinary retention, and increased fall risk. Anticholinergic contributors commonly found in mental health medication regimens include: first-generation antipsychotics, TCAs, diphenhydramine (Benadryl, also found in many OTC sleep aids), certain antiparkinson agents prescribed to manage EPS (benztropine, trihexyphenidyl), and oxybutynin (for bladder control). If a counselor is working with an older adult who appears more cognitively impaired than expected, or who has experienced unexplained confusion, delirium, falls, or urinary difficulties, raising the possibility of anticholinergic burden with the prescribing provider is both clinically appropriate and potentially very helpful. A simple medication review identifying and eliminating unnecessary anticholinergic agents can produce meaningful cognitive improvement in older adults.</p><p>The practical counselor takeaway on polypharmacy and drug interactions is straightforward: when a client starts a new medication—or begins using a new supplement, herbal product, or over-the-counter medication—directing them to tell their prescribing provider and their pharmacist is a simple, high-value clinical action. Pharmacists are specifically trained in drug interaction surveillance and are an underutilized resource. Counselors should normalize the idea that the pharmacist is a member of the healthcare team, not just a dispensing technician, and that consulting a pharmacist about new additions to a medication regimen is standard good practice.</p>'
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
          type: 'text',
          title: 'Medication Adherence Barriers and the Counselor\'s Role in Supporting Adherence',
          body: '<p>Medication non-adherence is one of the most clinically significant problems in psychiatric treatment. Estimates consistently find that 40–60% of people with mental health conditions do not take their medications as prescribed, with rates even higher for certain conditions like bipolar disorder and schizophrenia. Non-adherence is not a character flaw or simple willpower failure—it reflects a complex interaction of clinical, psychological, social, economic, and systems-level factors. Counselors, with their therapeutic relationship and frequent contact with clients, are uniquely positioned to identify adherence barriers and intervene in evidence-based ways. This is one of the most concrete pharmacology-related contributions counselors can make to client outcomes.</p><p>Understanding why clients do not take medications as prescribed requires exploring the specific barriers operating for each individual. <strong>Side effects</strong> are among the most common adherence barriers across all medication classes. As discussed throughout this course, weight gain from antipsychotics, sexual dysfunction from SSRIs, sedation from mood stabilizers, and GI effects from many agents can profoundly affect quality of life and motivation to continue treatment. The critical clinical point is that clients frequently do not disclose side effects to their prescribers—they may feel embarrassed (sexual dysfunction), fear being taken off a medication they need, assume the side effect cannot be changed, or not see their prescriber frequently enough to raise the concern. Counselors can serve as a bridge: creating space in sessions to explicitly explore side effect experiences, normalizing the difficulty of side effects, and actively facilitating prescriber communication when side effects are identified. Motivational Interviewing (MI) techniques are particularly well-suited to this—exploring ambivalence about medication, eliciting change talk around adherence, and supporting the client\'s autonomy while ensuring they have accurate information.</p><p><strong>Stigma</strong> operates at multiple levels as an adherence barrier. External stigma—messages from family, community, or culture that psychiatric medication represents weakness, is spiritually problematic, or indicates a character flaw—can significantly undermine a client\'s willingness to take medication consistently. Internal stigma—the client\'s own shame or identity conflict around having a psychiatric diagnosis and needing medication—is particularly powerful. Research consistently finds that clients who strongly internalize the stigma associated with psychiatric illness are less adherent to medication and have worse outcomes. Counselors can address both layers: exploring cultural and family messages about psychiatric medication in sessions, helping clients examine and challenge internalized stigma, and supporting clients in developing a relationship with their medication that feels consistent with their values and identity rather than threatening to it.</p><p><strong>Cognitive impairment</strong>—whether from the psychiatric condition itself, medication side effects, or co-occurring neurodevelopmental conditions—presents a practical adherence barrier. Clients with serious mental illness, ADHD, or significant depression often struggle with the organizational demands of medication-taking: remembering to take medications at the right time and dose, refilling prescriptions before running out, and keeping track of multiple medications. Counselors can help by exploring concrete adherence strategies: pill organizers sorted weekly, phone alarms timed to daily routines, pairing medication with habitual activities (medication with morning coffee, for example), and using the pharmacy\'s blister packaging or medication synchronization programs that align all refills on the same date. For clients with significant cognitive impairment, involving a trusted family member or caregiver in medication management—with appropriate consent—may be appropriate to explore.</p><p><strong>Cost and access barriers</strong> are a significant and often underaddressed adherence issue. Psychiatric medications can be expensive, and clients who face insurance gaps, high copays, or formulary restrictions may ration medications, skip doses, or stop altogether without telling their provider. Counselors should inquire about cost as part of adherence discussions and know about available resources: manufacturer patient assistance programs (most pharmaceutical companies have programs for income-eligible patients), GoodRx and similar discount programs that can dramatically reduce pharmacy costs, generic substitution options (most psychiatric medications have low-cost generics that prescribers can specify), and state pharmacy assistance programs. Directing a client toward the right resource when cost is the barrier can prevent an otherwise avoidable treatment interruption.</p><p><strong>Lack of perceived benefit</strong> is particularly relevant in conditions where improvement is gradual and subjective. A client with bipolar disorder who has been stable for a year on their mood stabilizer may genuinely not feel the medication is doing anything—because they have not experienced an episode while on it. They may reason: "I feel fine, so I don\'t need the medication." This reasoning misses the mechanism of mood stabilizers entirely (their value is episode prevention, not symptomatic treatment). Counselors can provide targeted psychoeducation about preventive versus symptomatic medications, help clients recognize the connection between their current stability and their medication, and explore the client\'s understanding of their condition and what relapse actually looks like for them—making the stakes of non-adherence personally meaningful rather than abstract.</p><p><strong>Specific adherence support strategies for sleep and diet-related side effects</strong> are an area where counselors can provide particularly concrete help. For clients on <strong>sedating medications</strong> (antipsychotics, mirtazapine, some mood stabilizers) who report daytime sedation: explore with the client whether taking the medication at bedtime rather than in the morning might be tolerable (often is, and shifts sedation to a useful time). Reinforce good sleep hygiene practices—consistent sleep-wake times, limiting caffeine after noon, avoiding screens before bed, creating a dark and quiet sleep environment. For clients experiencing <strong>insomnia</strong> from activating medications (SSRIs, SNRIs, stimulants): explore whether dose timing can be adjusted earlier in the day (again, a prescriber conversation), and apply CBT-I techniques for sleep as a complement to medication. For clients on <strong>MAOIs</strong> who find the dietary restrictions overwhelming: systematic meal planning support, wallet cards listing safe and restricted foods, and problem-solving about social eating situations (restaurants, family gatherings) can meaningfully support adherence. For clients on <strong>lithium</strong> who need to maintain stable hydration: connecting lithium\'s narrow therapeutic index to concrete self-care behaviors—always carrying a water bottle, identifying hydration strategies for exercise and hot weather, understanding why febrile illness requires prescriber contact—transforms abstract medical knowledge into actionable self-management. This is counselor-appropriate psychoeducation that directly supports medication safety.</p>'
        },
        {
          type: 'text',
          title: 'When to Refer Urgently for Medication Evaluation: Detailed Clinical Criteria',
          body: '<p>One of the most important pharmacology-related clinical skills for counselors is knowing when something they are observing in a client requires urgent prescriber contact—not at the next scheduled appointment, not in a note that may be read next week, but within hours. The following clinical scenarios represent situations where delay has the potential to cause serious harm, and counselors who recognize and act on them are functioning at the highest level of collaborative care.</p><p><strong>Serotonin Syndrome Presentation</strong>: Any client on serotonergic medications (SSRIs, SNRIs, MAOIs, tramadol, certain triptans, linezolid) who presents with the combination of agitation or confusion, autonomic signs (elevated temperature, rapid heart rate, sweating, labile blood pressure), and neuromuscular abnormalities (tremor, myoclonus, hyperreflexia) requires immediate emergency referral. Serotonin syndrome can deteriorate rapidly and becomes life-threatening when hyperthermia is severe. If these symptoms are present in session, call 911. If the client calls you describing these symptoms, direct them to emergency services immediately and notify the prescriber.</p><p><strong>Lithium Toxicity Indicators</strong>: As discussed in this section, a client on lithium who presents with or reports tremor, ataxia (stumbling, unsteady gait), confusion, slurred speech, or muscle twitching—especially following any period of reduced fluid intake, GI illness, hot weather, or new medication (NSAIDs, ACE inhibitors, thiazide diuretics)—needs urgent prescriber contact and likely emergency evaluation. Do not schedule this for next week. Same-day contact is required.</p><p><strong>Emerging Suicidality in Context of New Medication</strong>: A client in the first two months of antidepressant treatment (especially under age 25) or a client who has just started atomoxetine (any age child/adolescent) who reports new or worsening suicidal ideation, significant agitation, or behavioral change requires immediate risk assessment and same-day prescriber contact. The prescriber needs to know this is emerging in the context of the medication timeline, not just as a background psychiatric symptom.</p><p><strong>Signs of Agranulocytosis in Clozapine-Treated Clients</strong>: Fever, sore throat, or other signs of infection in a client on clozapine require urgent medical evaluation the same day, regardless of severity. Agranulocytosis can develop rapidly; early detection is potentially life-saving. Do not reassure a clozapine-treated client that their fever is "probably just a cold" and monitor it.</p><p><strong>Neuroleptic Malignant Syndrome (NMS)</strong>: A client on antipsychotics with high fever, severe muscle rigidity ("lead pipe" stiffness), altered mental status (confusion, delirium), and autonomic instability requires emergency medical services immediately. Do not wait for the prescriber to respond. Call 911.</p><p><strong>Signs of Valproate or TCA Toxicity</strong>: A client on valproate with confusion, extreme sedation, or respiratory changes, especially in the context of recent dose changes; a client on a TCA with cardiac symptoms (irregular heartbeat, severe palpitations), confusion, or extreme sedation—these are potential overdose or toxicity presentations requiring emergency assessment. TCA overdose in particular can be rapidly fatal due to cardiac effects.</p><p><strong>Acute Dystonia</strong>: A client on antipsychotics who suddenly develops severe muscle contraction—neck twisted to one side, eyes rolling upward (oculogyric crisis), jaw clenching—is experiencing acute dystonia, a medical emergency requiring immediate prescriber contact or emergency care. This is extremely distressing for clients and requires prompt treatment with anticholinergic medication (benztropine or diphenhydramine IM).</p><p><strong>Signs of Stevens-Johnson Syndrome</strong>: A client on lamotrigine who reports or presents with a spreading rash—especially one involving any mucous membranes (inner mouth, lips, genital area, eyes)—requires emergency medical evaluation immediately. Do not advise watchful waiting with any rash in a lamotrigine-treated client. The rash of SJS can progress extremely rapidly and be disfiguring or fatal if not treated promptly.</p><p><strong>Communicating the Urgency Effectively</strong>: When contacting a prescriber urgently, counselors should be organized and specific. Use the SBAR format (Situation, Background, Assessment, Recommendation) as a structure: "Situation: I\'m calling because my client [name] is presenting with symptoms that concern me for a possible medication emergency. Background: Client is on lithium 900mg/day and has been ill with gastroenteritis for four days. Assessment: Client is presenting with tremor, confusion, and unsteady gait in our session today. Recommendation: I believe this warrants same-day medical evaluation for possible lithium toxicity." This format is used in medical settings for urgent communication and conveys professionalism, specificity, and urgency simultaneously. If the prescriber is unavailable and the presentation is severe, emergency services are always the appropriate fallback—not waiting for a callback.</p>'
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
          type: 'text',
          title: 'MAT in Depth: Buprenorphine Mechanics, Naltrexone, and Reducing Stigma in Practice',
          body: '<p>Medication-Assisted Treatment for opioid use disorder is one of the most evidence-dense areas of all medicine—and one of the most stigmatized. Understanding the pharmacological mechanisms of the primary MAT agents in depth equips counselors to provide accurate psychoeducation, counter misinformation, and support clients in navigating treatment decisions with their prescribers. This section provides the deeper mechanistic understanding that supports effective clinical practice.</p><p><strong>Buprenorphine: Pharmacological Mechanism in Detail</strong></p><p>Buprenorphine is a <em>partial agonist</em> at the mu-opioid receptor—the receptor responsible for both the pain-relieving and euphorigenic effects of opioids. Being a partial agonist means that buprenorphine activates the mu receptor, but with a ceiling on the maximum effect it can produce. Even at very high doses, buprenorphine cannot produce the same degree of respiratory depression as full agonists like heroin, oxycodone, or methadone. This ceiling effect is the pharmacological basis for buprenorphine\'s significantly improved safety margin in overdose: unlike full agonist opioids, a massive buprenorphine dose does not proportionally increase respiratory depression into life-threatening territory (though this protection can be compromised when combined with CNS depressants like benzodiazepines or alcohol).</p><p>Buprenorphine also has <em>high receptor binding affinity</em>—it binds to the mu-opioid receptor more tightly than most full agonist opioids. This property is clinically important for two reasons: first, it means that if a client takes buprenorphine while other opioids are in their system, buprenorphine can displace those opioids from the receptor and, because it is only a partial agonist, can actually precipitate withdrawal. This is why "precipitated withdrawal" is a risk in buprenorphine induction—clients must typically wait until they are in at least mild withdrawal before receiving their first dose, ensuring other opioids have dissociated from the receptor. Precipitated withdrawal is extremely uncomfortable and can be a major barrier to treatment entry; understanding this mechanism allows counselors to explain why clients are asked to wait before their first dose, preventing the experience from being misinterpreted as negligence or a punishment. Second, high receptor affinity means that buprenorphine blocks the euphoric effects of other opioids taken on top of it—a client on an adequate dose of buprenorphine who uses heroin will experience little to no euphoria, because buprenorphine is occupying the receptor sites. This "blocking effect" is one of the mechanisms through which buprenorphine reduces illicit opioid use.</p><p>Suboxone (buprenorphine/naloxone) combines buprenorphine with naloxone in a 4:1 ratio. The naloxone is included specifically as a deterrent to injection misuse. When Suboxone is taken as intended—sublingually or via buccal film—the naloxone is minimally absorbed through the oral mucosa and has negligible pharmacological effect. The buprenorphine is what is active. However, if someone attempts to inject Suboxone to achieve faster or stronger effect, the naloxone enters the bloodstream directly, rapidly occupies opioid receptors, and precipitates severe acute withdrawal. This formulation therefore reduces (though cannot eliminate) injection misuse. Sublocade is a monthly injectable buprenorphine formulation that eliminates the adherence demands of daily sublingual dosing and removes concerns about diversion—an important option for clients whose treatment setting or life circumstances make daily dosing challenging.</p><p><strong>Naltrexone: Mechanism and Clinical Considerations</strong></p><p>Naltrexone is a pure opioid antagonist—it binds to mu, kappa, and delta opioid receptors with high affinity and blocks them completely, preventing any opioid from producing its effects. Unlike buprenorphine, naltrexone has no agonist activity whatsoever. For OUD treatment, the practical implication is that a client on naltrexone who takes opioids will experience no euphoria and no pain relief—the reinforcing effects of opioid use are entirely blocked. The monthly injectable form (Vivitrol) is preferred because it eliminates the daily adherence decision that oral naltrexone requires: a client who is ambivalent about their recovery may simply stop taking oral naltrexone one day before planning to use, whereas an injection that is already in the body cannot be selectively discontinued. Vivitrol therefore acts as a "commitment device" that extends the behavioral commitment to abstinence for one full month. This is particularly valuable in the early recovery period when cravings are intense and relapse risk is highest.</p><p>The critical clinical requirement for naltrexone induction is that the client must be fully opioid-free for 7–10 days before the first dose (longer for clients who have been on methadone, which has a very long half-life). If any opioids are present in the system when naltrexone is given, it will precipitate immediate severe withdrawal. For clients transitioning from buprenorphine to naltrexone, a carefully managed bridging period is required. Counselors can support this transition by maintaining close contact with clients during the bridging period, providing emotional support for the withdrawal symptoms that may occur, and helping clients stay connected to their treatment motivation during what can be a particularly difficult few days.</p><p>Naltrexone for alcohol use disorder operates through a different mechanism than the opioid blocking effect. The reward from alcohol involves partial mediation through the endogenous opioid system—alcohol consumption triggers release of endogenous opioids (endorphins and enkephalins) that activate mu receptors and contribute to the pleasurable effects of drinking. By blocking mu receptors, naltrexone blunts the rewarding properties of alcohol, reducing the drive to continue drinking once started. This is the basis of the Sinclair Method, a naltrexone-based approach to alcohol use disorder in which clients take naltrexone before drinking specifically to extinguish the conditioned association between drinking and reward. While not all prescribers use this approach, counselors may encounter clients using it and should understand the rationale.</p><p><strong>Addressing MAT Stigma: A Clinical and Ethical Imperative</strong></p><p>Research on provider attitudes toward MAT reveals that counselors and other mental health professionals sometimes hold more stigmatizing views toward MAT than physicians—reflecting the influence of 12-step philosophies, abstinence-only frameworks, and misconceptions about the nature of addiction. The most common stigmatizing belief is the "trading one addiction for another" narrative about buprenorphine and methadone. This belief is pharmacologically inaccurate and clinically harmful. Opioid use disorder is a chronic neurobiological condition characterized by altered reward circuitry, impaired impulse control, and neuroadaptations that persist for years after cessation of use. MAT does not "solve" these underlying changes by creating a new substance dependence—rather, it stabilizes the most dangerous aspects of the condition (overdose risk, withdrawal-driven compulsive use) while allowing the client to engage in the recovery work—counseling, relationship repair, rebuilding life structure, developing coping skills—that addresses the psychological and social dimensions of the disorder.</p><p>Physical dependence on buprenorphine or methadone is a side effect of treatment, just as physical dependence on insulin is a side effect of diabetes treatment. A client who is physically dependent on buprenorphine but is stable, employed, reconnected with family, and not using illicit opioids is succeeding in recovery—not failing it. The goal of MAT is not medication-free existence as a prerequisite for recovery recognition; it is quality of life, functional capacity, and reduction of harm. Some clients will eventually taper off MAT; many will remain on it indefinitely. Both outcomes are valid. Counselors who convey—even subtly, through their language, their enthusiasm when clients mention wanting to stop their medication, or their silence when clients describe MAT stigma from family—that medication-free recovery is the "real" goal undermine client confidence in evidence-based treatment and may contribute to premature, high-risk discontinuation.</p>'
        },
        {
          type: 'text',
          title: 'Psychiatric Medications in Pregnancy and Cultural Factors in Medication Acceptance',
          body: '<p>Two areas of psychopharmacology that counselors frequently encounter but are less commonly trained in are medication use during pregnancy and the influence of cultural factors on medication acceptance and adherence. Both require counselors to maintain a framework of cultural humility, client autonomy, and close collaboration with prescribing providers.</p><p><strong>Psychiatric Medications in Pregnancy: The Counselor\'s Role</strong></p><p>The question of whether to continue, modify, or discontinue psychiatric medication during pregnancy is among the most complex in clinical medicine, and counselors are often the first person a pregnant client turns to when this question arises. The counselor\'s role is not to provide an answer—that determination belongs to the prescribing provider and the client, ideally in collaboration with an obstetric provider with expertise in perinatal psychiatry. The counselor\'s role is to support the client through the decision-making process, ensure the conversation with the prescriber happens (and happens soon), and help the client process the emotional weight of a decision that often carries significant moral and personal complexity.</p><p>The general framework counselors should understand is this: psychiatric medications carry varying levels of evidence for fetal risk, and in virtually all cases, untreated severe psychiatric illness during pregnancy also carries significant risks—to the mother (relapse, functional deterioration, suicidality) and to the fetus (stress hormone exposure, impaired prenatal care, preterm birth risk, nutritional deficits). The decision is never simply "medication vs. no risk"—it is almost always "medication risk vs. untreated illness risk." A woman with severe treatment-resistant depression who has a history of postpartum psychosis faces very different risk calculus than a woman with mild anxiety who manages well with therapy alone. These nuanced, individualized determinations require perinatal psychiatry expertise.</p><p>Key medications with known pregnancy risks that counselors should be familiar with: <strong>Valproate</strong> is teratogenic at a level that leads to strong FDA guidance against its use in women of childbearing potential unless no alternatives exist, due to high rates of neural tube defects (spina bifida), cardiac defects, and neurodevelopmental effects including lower IQ and autism spectrum disorder risk. Counselors working with women of childbearing age on valproate should ensure that family planning has been explicitly addressed with the prescribing provider. <strong>Lithium</strong> was historically associated with a specific cardiac defect (Ebstein\'s anomaly) at rates higher than background; more recent data suggests the absolute risk is much lower than originally thought, but lithium is still approached cautiously in pregnancy—typically requiring individualized risk assessment and potentially dose adjustment to maintain stable blood levels given the dramatic fluid volume changes of pregnancy. <strong>Benzodiazepines</strong> cross the placenta and accumulate in fetal tissue; exposure near delivery can cause neonatal withdrawal syndrome. <strong>SSRIs and SNRIs</strong> are among the most studied medications in pregnancy, with a large body of data suggesting that the absolute risks to the fetus are generally modest for most agents and must be weighed against the substantial risks of untreated maternal depression or anxiety. Paroxetine has historically been associated with a slightly higher rate of cardiac septal defects, making it generally less preferred in pregnancy compared to other SSRIs.</p><p>For counselors, the most important clinical actions around perinatal medication are: (1) asking explicitly about pregnancy status and pregnancy planning in female clients of reproductive age who are on psychiatric medications; (2) ensuring that clients who become pregnant are aware that they should contact their prescribing provider promptly to discuss the implications for their medication; (3) providing emotional support for the anxiety and guilt that pregnant clients often experience around the medication decision, countering catastrophizing while remaining honest about uncertainty; and (4) never advising a pregnant client to stop or continue a psychiatric medication—defer these decisions entirely to the prescribing provider.</p><p><strong>Cultural Factors in Medication Acceptance and Adherence</strong></p><p>Medication acceptance, adherence, and the meaning clients assign to taking psychiatric medication are profoundly shaped by cultural background, family systems, community norms, religious frameworks, and historical experiences with healthcare systems. Counselors practicing from a culturally humble framework recognize that their own assumptions about medication are themselves culturally shaped, and that effective medication-informed counseling requires genuine curiosity about each client\'s cultural context rather than a universal prescription for how clients "should" relate to their medication.</p><p>Several cultural dimensions are particularly relevant. <strong>Explanatory models of illness</strong>—the frameworks through which people understand the cause of their distress—vary significantly across cultures and often do not map onto biomedical or neuroscientific explanations. A client who understands their depression as a spiritual imbalance, a consequence of community rupture, an expression of ancestral trauma, or a reflection of divine testing may experience a purely neurobiological framing of psychiatric medication as incompatible with their understanding of their own suffering. This does not mean they will refuse medication—many clients hold multiple explanatory models simultaneously—but it does mean that counselors who acknowledge and engage with the client\'s own model, rather than simply offering the biomedical one, will build better alliance and support more authentic medication decision-making. Asking "What do you think is causing the problems you\'ve been experiencing?" and listening deeply to the answer is a powerful clinical starting point.</p><p><strong>Stigma expressions vary by culture</strong>. In some communities, the stigma of psychiatric diagnosis is so profound that accepting medication is experienced as an identity threat—publicly identifying oneself as "mentally ill" by picking up a prescription feels too dangerous. In others, stigma is expressed through the mechanism of somatic symptoms—depression presenting as chronic physical pain or fatigue—and medication prescribed for mood disorder is experienced as invalidating ("the doctor thinks I\'m making up my pain"). In communities with historical trauma related to healthcare systems—Black communities in the United States who have experienced medical experimentation and forced psychiatric treatment, Indigenous communities with histories of institutionalization, immigrant communities with experiences of healthcare denial—medication may be experienced with distrust that has legitimate historical roots and deserves to be acknowledged rather than simply reassured away. Counselors working across diverse populations must understand that culturally specific barriers to medication acceptance are often not irrational—they reflect real history and real community wisdom that deserves respect.</p><p><strong>Family involvement in medication decisions</strong> differs significantly across cultures. In many collectivist cultural frameworks, medication decisions are not individual choices—they are family decisions, subject to family input, permission, and sometimes family-level stigma management. A client whose family does not know about their psychiatric diagnosis, or whose family actively opposes psychiatric medication, faces adherence challenges that are fundamentally relational. Counselors can explore whether and how to involve family members supportively, help clients navigate family systems around their treatment, and—where appropriate and consented—engage family members directly in psychoeducation about medication to reduce family-level barriers to adherence. This may include conversations about religious frameworks, cultural healing traditions, and how psychiatric medication can be understood as compatible (or in need of negotiation) with family and community values.</p><p><strong>Language and health literacy</strong> are concrete practical factors. Medication instructions that clients cannot fully read or understand are not followed accurately. Mental health terminology that does not translate meaningfully into a client\'s primary language creates barriers to informed consent. Counselors should not assume that because a client receives their care in English, they fully comprehend their treatment—particularly around complex pharmacological concepts. Asking "Tell me in your own words what you understand about why you\'re taking this medication" is a health literacy check that can reveal critical misunderstandings before they become adherence failures.</p>'
        },
        {
          type: 'text',
          title: 'Communicating with Prescribers: The SBAR Framework and Practical Strategies',
          body: '<p>Effective communication between counselors and prescribers is one of the highest-leverage clinical skills a counselor can develop in the pharmacology domain. The prescribing provider, whether a psychiatrist, primary care physician, nurse practitioner, or physician assistant, depends on reports from those who see the client most frequently to make well-informed medication decisions. In many integrated care settings, counselors see clients weekly or more; prescribers may see them monthly or less. The clinical picture the prescriber holds is substantially shaped by what counselors observe and communicate. Learning to communicate that clinical picture precisely, efficiently, and in a format prescribers can act on is a professional skill that directly improves client outcomes.</p><p><strong>The SBAR Framework for Clinical Communication</strong></p><p>SBAR (Situation, Background, Assessment, Recommendation) is a structured communication framework developed in healthcare settings specifically to improve the clarity and efficiency of clinical handoffs and urgent communications. It has been widely adopted in nursing, medicine, and now behavioral health as a way to convey the essential information needed for clinical decision-making in a logical, organized format. Counselors who learn to use SBAR when communicating with prescribers will find that their communication is taken more seriously, acted on more promptly, and received as more professionally credible.</p><p><strong>Situation</strong>: State the current clinical concern concisely. "I\'m calling about my client, [first name, last initial], who is on your panel. I\'m seeing a change in her presentation that I believe warrants prescriber attention." This orients the prescriber immediately to the purpose of the communication.</p><p><strong>Background</strong>: Provide the relevant clinical context. Current medications and how long they have been at the current dose. Recent changes in medication, dosing, or other health conditions. Relevant history (e.g., recent alcohol use, medical illness, major stressor). The time frame of the change you are observing. "She has been on sertraline 100mg since January and had been doing well. About three weeks ago she lost her housing, and over the past two sessions I have observed increasing tearfulness, significant sleep disruption, decreased appetite, and she reported to me yesterday that she has been having passive thoughts of death—not active suicidal ideation, but thoughts that she wouldn\'t mind not being here."</p><p><strong>Assessment</strong>: Share your clinical observation in behavioral, specific, descriptive terms. Avoid diagnostic language (that belongs to the prescriber) but be precise about what you are observing. "My observation is that her depressive symptoms appear significantly worse than they were six weeks ago, despite being on what was an adequate medication dose. She is engaging in therapy but the severity of her current presentation exceeds what therapy alone seems adequate for."</p><p><strong>Recommendation</strong>: Make a specific request. What do you need from the prescriber? "I\'m hoping she can be seen sooner than her next scheduled appointment. I wanted to flag my observations so you have this clinical picture. If there is anything specific you would like me to monitor or document in the next session, I\'m happy to do that."</p><p>Written SBAR communications—via fax, secure message, or shared electronic health record—should follow the same structure and should always include your contact information and availability for follow-up questions. Include client identifying information (name, date of birth, or other identifier per your setting\'s protocol) and obtain the client\'s written consent for communication with their prescribing provider if not already covered under a general release.</p><p><strong>What Information to Share with Prescribers</strong></p><p>Beyond urgent communications, ongoing prescriber communication should include: medication adherence—whether the client is taking medications as prescribed, any doses skipped, any self-adjustment of dosing; clinical response—specific behavioral observations related to the target symptoms the medication is treating (e.g., "client reports sleep has improved from 3 hours to 6 hours per night since starting mirtazapine"); side effects the client has reported to you but may not have disclosed to the prescriber; substance use, including alcohol, cannabis, and over-the-counter or illicit drug use that may interact with medications; significant life stressors that may explain changes in psychiatric status and help the prescriber contextualize whether a symptom worsening reflects medication inadequacy or psychosocial factors; and treatment engagement—whether the client is attending sessions, engaging in therapeutic work, and using skills learned in counseling. This information is not available to prescribers from brief medication management appointments and significantly improves the clinical picture from which prescribers make decisions.</p><p><strong>When Prescribers Are Not Responding</strong></p><p>A common clinical frustration is difficulty reaching prescribers, particularly in understaffed or high-volume settings. When a prescriber is unresponsive and the situation is urgent, counselors should document all attempts to contact the prescribing provider (time, method, reason) in the clinical record. If the situation is emergent—active suicidal ideation, signs of toxicity, potential psychiatric emergency—escalate immediately: 911, crisis services, or direct instruction to the client to go to the emergency department. Do not wait for a prescriber callback in an emergency. For non-emergent but clinically significant concerns, multiple contact attempts through different channels (phone, fax, secure message via shared EHR, contact through the prescriber\'s clinical staff) are appropriate. If a prescriber is consistently unresponsive to clinically important communications, this is a systems issue that may warrant supervisory consultation about how to advocate for the client\'s coordinated care needs.</p>'
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
