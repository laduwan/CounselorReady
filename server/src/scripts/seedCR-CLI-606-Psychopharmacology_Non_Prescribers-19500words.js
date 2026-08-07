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
  description: 'This course equips licensed mental health counselors with a clinically grounded understanding of psychopharmacology — how psychiatric medications work, what clients commonly experience on them, and how counselors can ethically support medication adherence, recognize side effects, and collaborate with prescribers — all within the appropriate scope of non-prescriber practice.',
  ceHours: 3,
  nbccContentArea: 'counseling',
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
  approvals: [{
    body: 'NBCC',
    number: '#7760',
    hourBreakdown: [{ label: 'core', hours: 3 }]
  }],
  isPublished: false,
  status: 'draft',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  learningObjectives: [
    'Explain fundamental neurotransmitter systems (dopamine, serotonin, norepinephrine, GABA, glutamate) and how psychiatric medications modulate them',
    'Identify the major classes of psychiatric medications — antidepressants, antipsychotics, mood stabilizers, anxiolytics, stimulants, and sleep aids — and their primary clinical indications',
    'Recognize common and clinically significant side effects of SSRIs, SNRIs, antipsychotics, mood stabilizers, and benzodiazepines, including discontinuation syndrome, EPS, tardive dyskinesia, lithium toxicity, and serotonin syndrome',
    'Apply scope-of-practice principles when supporting clients with medication questions, including when and how to consult with prescribers',
    'Incorporate cultural humility and psychoeducation strategies that support medication adherence within the therapeutic relationship'
  ],
  sections: [
    // ─── SECTION 1: INTRODUCTION ─────────────────────────────────────────────
    {
      title: 'Introduction: Why Psychopharmacology Belongs in Counselor Education',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction: Why Psychopharmacology Belongs in Counselor Education',
          subtitle: 'Establishing the counselor\'s role in a collaborative, medication-informed practice',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>Psychiatric medications are a central part of mental health care in the United States. Approximately one in six American adults takes a psychiatric medication, with antidepressants representing the most commonly prescribed drug class in primary care — not psychiatry. Anxiolytics, mood stabilizers, antipsychotics, and stimulants together constitute a pharmacological landscape that virtually every licensed counselor will encounter, because the clients sitting across from us are, in large numbers, taking these medications. They are taking them correctly and incorrectly. They are stopping them abruptly and without telling us. They are combining them with alcohol, cannabis, and over-the-counter supplements in ways that can have serious clinical consequences. And they are frequently asking us — the people they talk to most regularly and most openly — what to do.</p>
<p>The challenge for non-prescribing clinicians has never been whether to know about medications. The challenge is knowing enough to be genuinely useful without crossing the line into prescribing authority that we do not hold. That line exists — and it matters — but the area between "knowing nothing" and "prescribing" is wide, and counselors who operate in that space serve their clients significantly better than those who reflexively say "ask your doctor" whenever a medication question arises. Psychopharmacology literacy is not prescribing. It is clinical competence.</p>
<p>This course is organized around three content sections that build progressively from mechanism to application. Section 2 introduces the biological foundations of psychiatric medications: how neurotransmitters function, what pharmacokinetics means for everyday clinical reasoning, and how major drug classes are categorized. Section 3 explores the major drug classes in clinical detail — the side effects clients actually experience, the syndromes that require urgent response, and the specific monitoring issues that matter for counselors tracking client wellbeing. Section 4 translates this knowledge into clinical action: how to support medication adherence within the therapeutic relationship, how to conduct psychoeducation about side effects, how to recognize drug interactions that may involve substances clients use, when and how to contact prescribers, and how to navigate scope of practice with both clarity and humility.</p>
<p>Throughout, the emphasis is on integration. The most effective mental health treatment for conditions like major depression, bipolar disorder, schizophrenia, OCD, and ADHD consistently involves both medication and therapy — not because either alone is inadequate, but because they address different dimensions of the same underlying problem through different mechanisms. A client who understands why their SSRI makes them more anxious for the first two weeks is more likely to stay on it long enough to experience therapeutic benefit. A client whose therapist recognized early signs of lithium toxicity and recommended they call their psychiatrist avoided a hospitalization. A client who felt their cultural hesitation about medication was heard and not dismissed was more likely to engage honestly with their entire treatment team. That is what psychopharmacology literacy makes possible.</p>`
        },
        {
          type: 'text',
          content: `<p>Few clinical moments carry more ethical weight, and more potential for either overreach or unhelpful retreat, than the moment a client turns to a counselor and asks some version of the question: "Do you think I should take medication?" The counselor's ethical obligation in that moment is defined by two boundaries operating simultaneously. The first is the scope-of-practice boundary already established in this course: non-prescribing counselors do not diagnose for the purpose of medication selection, do not recommend specific agents or doses, and do not advise clients to start, stop, or change a psychiatric medication. The second boundary is equally real but far less discussed in graduate training: the ethical obligation <em>not</em> to abandon the client's question by reflexively redirecting it elsewhere. The ACA Code of Ethics (2014) requires counselors to practice within the boundaries of their competence (Standard C.2.a) while also requiring that counselors provide clients with accurate, comprehensible information necessary to give informed consent about all aspects of their treatment (Standard A.2.b). A counselor who says only "that's a question for your doctor" and offers nothing further has technically respected the first boundary while quietly failing the second. The client leaves the room with the same uncertainty they walked in with, now compounded by the sense that their therapist either did not know the answer or did not want to engage with it.</p>
<p>The more useful ethical stance treats the question itself as clinical material rather than as a request for a referral. When a client asks "should I take medication," the most important immediate move is not to answer the literal question but to understand what is underneath it. Is the client asking because a family member is pressuring them toward or away from medication? Because they are exhausted by symptoms and looking for anything that might help faster than therapy has helped so far? Because they have absorbed a cultural or personal narrative that medication means weakness, or conversely that therapy alone means they are not taking their condition seriously? Because a previous prescriber dismissed their concerns and they are looking for a second opinion from someone they trust more? Each of these underlying concerns calls for a different clinical response, and none of them are answered by a yes-or-no verdict on medication — which the counselor is not positioned to give in any case, since medication decisions require a psychiatric evaluation, a review of the client's full medical history, and prescriber-level clinical judgment that falls outside a counselor's training and legal authority.</p>
<p>Motivational interviewing offers the most coherent clinical stance for this exact situation, because MI was built for exactly the kind of ambivalence clients bring to medication questions (Miller &amp; Rollnick, 2013). The MI stance begins by assuming that ambivalence is normal, not pathological — a client who feels two ways about medication is not being difficult or resistant, they are responding rationally to a decision that carries real costs and real benefits in both directions. The counselor's task is not to resolve that ambivalence in a particular direction but to help the client explore it fully enough that whatever decision they reach is genuinely their own. Open-ended questions do most of the work here: "What would taking medication mean to you?" "What are you hoping would be different?" "What worries you most about it?" "What worries you most about <em>not</em> trying it?" Reflective listening — mirroring back both the pull toward medication and the pull away from it — helps the client hear their own ambivalence articulated clearly, often for the first time, rather than experienced as a confusing knot of conflicting feelings. Affirmations that validate the difficulty of the decision, rather than praise for choosing correctly, keep the stance neutral. Summarizing both sides of the ambivalence at the end of the conversation, in the client's own language, closes the loop without tipping the scale.</p>
<p>Critically, the MI stance requires the counselor to resist what Miller and Rollnick term the "righting reflex" — the instinctive urge, especially strong in helping professionals, to fix the client's uncertainty by supplying an answer. A counselor who has strong personal opinions about psychiatric medication, in either direction, has to hold those opinions consciously in check during this conversation. This is not moral relativism about whether medication works; it is recognition that the counselor's job in this specific conversation is to support the client's autonomous decision-making process, not to be one more voice pushing them toward a predetermined outcome. If the counselor has a genuine clinical concern — for example, that the client's symptoms sound severe enough that any further delay in evaluation carries real risk — that concern should be named directly and honestly, framed as the counselor's own observation rather than smuggled in as a "neutral" question. "I want to be honest with you: given how much your sleep and concentration have deteriorated over the past month, I think it would be worth getting evaluated soon, even if you decide not to start anything right away" is transparent, ethical, and squarely within scope. It communicates urgency without prescribing.</p>
<p>Once the exploratory conversation has happened, the counselor's practical next step is almost always the same regardless of which way the client is leaning: support them in bringing their fully articulated concerns, questions, and preferences to an appointment with a prescriber, and — with the client's consent — offer to coordinate directly with that prescriber if useful. Concretely, this might mean helping the client write down the specific questions they want to ask, rehearsing how to describe symptoms they have struggled to put into words, or clarifying what information the client wants the counselor to communicate on their behalf via a signed release. This kind of preparation dramatically increases the value of the eventual prescriber appointment, particularly for clients who find medical settings intimidating, who have had dismissive experiences with providers in the past, or who process information more easily through conversation and reflection with a trusted person than in the compressed time of a fifteen-minute intake appointment.</p>
<p>Documentation deserves specific, deliberate attention in these conversations, both because it protects the client and because it protects the counselor's practice within an ethically and legally defensible scope. The clinical record should reflect what actually happened: the client raised the topic of medication, the counselor explored the client's concerns and ambivalence using specific clinical techniques, relevant psychoeducation was provided (and what, specifically, was provided), and the client was encouraged to discuss the decision with their prescriber or was referred for evaluation. What the record should never reflect is language suggesting the counselor made a clinical medication recommendation. A progress note reading "discussed client's ambivalence about starting sertraline; explored fears about side effects and family stigma using MI techniques; encouraged client to bring specific questions to their psychiatric evaluation next week; provided psychoeducation on typical SSRI onset timeline" is precise, defensible, and clearly within scope. A note reading "advised client that sertraline would likely help their anxiety" documents an ethics violation in the counselor's own handwriting. This distinction matters enormously in the rare but real event of a licensing board complaint, a subpoenaed record, or a sentinel event review — the documentation is often the only evidence of what was actually said in the room, and vague or careless notes leave counselors exposed to interpretations they never intended.</p>
<p>A related documentation practice worth building into standard workflow is recording informed consent conversations about the counselor's role regarding medication from the very beginning of treatment — not waiting until a medication question arises organically. Many counselors now include a brief statement in their intake paperwork or verbal informed consent process explaining that they are not prescribers, that they can discuss medications and provide general education, and that any decisions about starting, stopping, or changing medication belong to the client and their prescriber. Establishing this frame early prevents the awkwardness of introducing scope limitations reactively, in the middle of a charged conversation, where it can feel to the client like a sudden withdrawal of support rather than a stable and pre-existing boundary.</p>
<p>Finally, it is worth naming directly that ethical navigation of medication conversations is not primarily a risk-management exercise, even though it has risk-management benefits. Done well, this work strengthens the therapeutic alliance rather than threatening it. Clients consistently report — in both clinical experience and the adherence literature — that they want their counselor to be knowledgeable, curious, and honest about medication, not silent or evasive (Julius, Novitsky, &amp; Dubin, 2009). A counselor who can sit comfortably with a client's ambivalence, ask good questions, provide accurate information, and clearly name the boundary of their own role communicates competence and trustworthiness simultaneously. That combination — genuine engagement plus honest limitation — is precisely what an ethical, scope-appropriate response to "should I take medication" looks like in practice, and it is a skill that can be deliberately built rather than left to instinct or anxiety in the moment.</p>
<p>A related and frequently uncomfortable variant of this question arises when a client, rather than asking for exploration, directly presses the counselor for a personal verdict: "I don't want to think about it anymore, just tell me what you would do." This request deserves a warm but firm boundary, because complying with it, even informally, even as a passing comment, crosses from psychoeducation into a de facto medication recommendation, regardless of how it is framed or how reluctant the counselor was to give it. A useful response acknowledges the exhaustion behind the request without granting it: "I hear how tired you are of carrying this decision alone, and I want to help you carry it, but if I tell you what to do, I'm making a call that isn't mine to make, and it takes the decision further out of your hands, not closer. Let's figure out together what information would actually make this decision feel less impossible." This kind of response validates the client's fatigue, explains the boundary in terms of the client's own autonomy rather than an abstract rule, and redirects toward genuinely useful next steps, a pattern that tends to land as caring rather than withholding when clients understand the reasoning behind it.</p>
<p>It is also worth acknowledging, honestly, that counselors are not neutral machines and will sometimes have real personal reactions to a client's medication situation: concern that a client is undertreated and suffering unnecessarily, concern that a client is on a regimen that seems disproportionate to their presentation, or simply uncertainty about what the right answer looks like for a particular case. These reactions do not need to be suppressed entirely, but they need to be metabolized before they enter the room, and when they do enter the room, they should be disclosed as the counselor's own subjective concern rather than presented as clinical fact. Peer consultation and clinical supervision are the appropriate outlet for a counselor to process strong personal reactions to a client's medication situation before those reactions shape how a session is conducted. A counselor who notices they are becoming unusually invested in a client's medication decision, pushing harder than the exploratory stance calls for, feeling frustrated when the client does not move in the direction the counselor privately favors, should treat that as a signal to bring the case to supervision, not as license to advocate more forcefully in session.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'How Psychiatric Medications Work: A Conceptual Overview',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER',
          content: 'An accessible introduction to how psychiatric medications interact with neurotransmitter systems in the brain, designed for non-prescribing mental health professionals.'
        },
        {
          type: 'imageText',
          title: 'The Collaborative Treatment Model',
          content: `<p>Modern psychiatric care is most effective when it integrates pharmacological and psychological interventions delivered by a coordinated treatment team. For licensed counselors, this means understanding enough about the medications their clients take to participate meaningfully in collaborative care — identifying emerging side effects, supporting adherence, providing psychoeducation, and communicating effectively with prescribers. This is not a peripheral role; it is a clinically central one that often determines whether clients remain in treatment at all.</p>`,
          image: '',
          imageAlt: 'Diagram showing collaborative mental health treatment model with prescriber, counselor, and client',
          imagePosition: 'right'
        }
      ]
    },

    // ─── SECTION 2: NEUROTRANSMITTER BASICS & PHARMACOKINETICS ─────────────
    {
      title: 'How Medications Work: Neurotransmitters, Pharmacokinetics, and Drug Classes',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'How Medications Work: Neurotransmitters, Pharmacokinetics, and Drug Classes',
          subtitle: 'From synaptic mechanism to clinical drug classification — the biological foundation of psychopharmacology',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>To understand how psychiatric medications work, it is necessary to begin where they work: at the synapse. The synapse is the junction between two neurons — the presynaptic neuron that releases a chemical signal and the postsynaptic neuron that receives it. That chemical signal is a neurotransmitter, and virtually every psychiatric medication in current use produces its effects by altering some aspect of neurotransmitter signaling: increasing or decreasing release, blocking or activating receptors, preventing reuptake into the presynaptic neuron, or inhibiting the enzymes that break neurotransmitters down.</p>
<p>The five neurotransmitter systems most relevant to psychiatric medications are serotonin, dopamine, norepinephrine, GABA, and glutamate. <strong>Serotonin</strong> (5-hydroxytryptamine, or 5-HT) is synthesized from the amino acid tryptophan and is produced primarily in the raphe nuclei of the brainstem, from which serotonergic projections reach virtually the entire brain. Serotonin regulates mood, appetite, sleep, impulse control, and social behavior. Low serotonergic activity is associated with depression, anxiety, OCD, and impulsivity — though this is an oversimplification of what are complex, bidirectional relationships. SSRIs (selective serotonin reuptake inhibitors) increase serotonergic activity by blocking the serotonin transporter protein (SERT), which normally pumps serotonin from the synapse back into the presynaptic neuron. By blocking this reuptake pump, SSRIs increase the concentration of serotonin in the synaptic cleft, making it more available to activate postsynaptic receptors.</p>
<p><strong>Dopamine</strong> is produced in several distinct pathways that serve very different functions. The mesolimbic pathway, from the ventral tegmental area to the nucleus accumbens, mediates reward, motivation, and reinforcement — this is the pathway dysregulated in addiction. The mesocortical pathway, from the VTA to the prefrontal cortex, modulates executive function, working memory, and goal-directed behavior — this is the pathway implicated in the negative symptoms of schizophrenia and in ADHD. The nigrostriatal pathway, from the substantia nigra to the striatum, controls movement — this is the pathway whose disruption produces the extrapyramidal side effects of antipsychotic medications. The tuberoinfundibular pathway regulates prolactin secretion — this is the pathway responsible for medication-induced hyperprolactinemia and the associated sexual side effects and menstrual irregularities. Understanding that "dopamine" is not a single system but four distinct pathways helps explain why antipsychotic medications that block dopamine receptors across all four pathways simultaneously produce therapeutic effects (via the mesolimbic pathway) and movement side effects (via the nigrostriatal pathway) and hormonal disruptions (via the tuberoinfundibular pathway) in the same client.</p>
<p><strong>Norepinephrine</strong> (noradrenaline) is produced primarily in the locus coeruleus of the brainstem and projects throughout the cortex, limbic system, and spinal cord. It governs arousal, alertness, attention, and the fight-or-flight stress response. Norepinephrine dysregulation is implicated in PTSD, ADHD, depression, and anxiety disorders. SNRIs (serotonin-norepinephrine reuptake inhibitors) such as venlafaxine (Effexor), duloxetine (Cymbalta), and desvenlafaxine (Pristiq) inhibit reuptake of both serotonin and norepinephrine, producing effects across both systems. Alpha-2 adrenergic agonists like guanfacine (Intuniv) and clonidine (Kapvay) reduce norepinephrine signaling and are used in ADHD and PTSD-related hyperarousal.</p>
<p><strong>GABA</strong> (gamma-aminobutyric acid) is the primary inhibitory neurotransmitter in the central nervous system. GABAergic signaling slows neuronal firing and is involved in reducing anxiety, promoting sleep, preventing seizures, and regulating muscle tone. Benzodiazepines (such as diazepam/Valium, lorazepam/Ativan, clonazepam/Klonopin, and alprazolam/Xanax) enhance GABA's effects at GABA-A receptors, producing rapid anxiolytic and sedative effects. Alcohol also works primarily via GABA enhancement — this explains why combining alcohol with benzodiazepines is extremely dangerous and can be fatal. The barbiturate class, now largely replaced by benzodiazepines, operated via similar GABA mechanisms. Non-benzodiazepine sleep medications (the "Z-drugs": zolpidem/Ambien, eszopiclone/Lunesta, zaleplon/Sonata) also target GABA-A receptors but with somewhat different receptor subunit specificity.</p>
<p><strong>Glutamate</strong> is the primary excitatory neurotransmitter in the CNS and is the most abundant neurotransmitter in the brain. Its relationship to psychiatric disorders is complex and still being elucidated, but glutamate dysregulation — particularly at NMDA (N-methyl-D-aspartate) receptors — is implicated in psychosis, depression, and the dissociative symptoms of PTSD. Ketamine and esketamine (Spravato), which block NMDA receptors, have emerged as rapidly acting antidepressants for treatment-resistant depression. Memantine (Namenda), an NMDA antagonist, is used in Alzheimer's disease. The glutamate system's role in psychiatric medication development is an active area of research that will likely produce significant new drug classes in coming decades.</p>`
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Why SSRIs Often Worsen Anxiety Before Helping It — and How to Prepare Clients',
          content: `<p>One of the most clinically important — and frequently mishandled — aspects of SSRI therapy is the phenomenon of <strong>activation syndrome</strong> in early treatment. When a client begins an SSRI or SNRI, serotonin activity in the synapse increases relatively quickly. But the full antidepressant and anxiolytic effect requires downstream neuroadaptation that takes 2–6 weeks: autoreceptor desensitization, changes in receptor density, and alterations in gene expression and neuroplasticity. In this lag period, especially in the first 1–2 weeks, increased serotonergic tone can produce increased anxiety, agitation, restlessness (akathisia), insomnia, and in rare cases, increased suicidal ideation — particularly in children, adolescents, and young adults (hence the FDA black box warning for patients under 25).</p>
<p>Clients who are not warned about this phenomenon frequently stop their medication in the first week, concluding that it is "making things worse." This early dropout is one of the most common reasons SSRI therapy fails — not pharmacological non-response, but premature discontinuation driven by uninformed expectations. The counselor's role here is concrete and evidence-supported: before a client starts an SSRI, discuss the 2–6 week lag and the possible initial anxiety increase. Normalize it as a known pharmacological effect. Problem-solve what they will do if anxiety spikes — who to call, whether to reach out to you, how to use coping skills in the interim. This psychoeducation has measurable effects on adherence and treatment outcomes, and it falls squarely within counselor scope of practice.</p>`
        },
        {
          type: 'text',
          content: `<p>Pharmacokinetics describes what the body does to a drug — how it moves through the body from administration to elimination. Understanding basic pharmacokinetic principles helps counselors reason about why different medications have different clinical profiles, why dose timing matters, and what happens when a client suddenly stops taking their medication.</p>
<p><strong>Absorption</strong> refers to how the drug enters the systemic circulation after administration. Most psychiatric medications are taken orally, absorbed through the gastrointestinal tract, and enter the bloodstream. Food, GI disorders, and other medications can affect absorption rate and extent. Extended-release formulations (e.g., Effexor XR, Wellbutrin XL) are designed to slow absorption and produce more stable plasma levels with once-daily dosing. Injectable long-acting antipsychotics (such as aripiprazole lauroxil/Aristada or paliperidone palmitate/Invega Sustenna) bypass oral absorption entirely — a significant advantage for clients with adherence challenges.</p>
<p><strong>Distribution</strong> refers to how the drug is distributed through body tissues after reaching circulation. Most psychiatric medications are highly lipophilic (fat-soluble) and distribute broadly throughout the body, including the brain. Distribution is affected by body composition, age, and protein binding. Many medications bind to plasma proteins (particularly albumin); only the unbound fraction is pharmacologically active. Drug interactions can occur at this level when one medication displaces another from protein binding sites.</p>
<p><strong>Metabolism</strong> is where psychiatric pharmacokinetics becomes most clinically relevant for counselors. Most psychiatric medications are metabolized in the liver by cytochrome P450 (CYP) enzymes — particularly CYP1A2, CYP2C19, CYP2D6, and CYP3A4. Drug-drug and drug-substance interactions occur primarily at this level: one substance inhibits or induces a CYP enzyme, changing the plasma level of another substance metabolized by that same enzyme. Fluoxetine (Prozac) is a potent inhibitor of CYP2D6; adding it to a regimen that includes a tricyclic antidepressant or an opioid metabolized by 2D6 can significantly increase plasma levels of the second drug. Carbamazepine (Tegretol) is a powerful inducer of CYP3A4; it accelerates the metabolism of dozens of medications, potentially reducing their efficacy. Cannabis smoke induces CYP1A2, affecting the metabolism of clozapine and other antipsychotics — a clinically significant interaction that many clients do not report unless directly asked. Genetic variation in CYP enzyme activity (pharmacogenomics) explains why some clients seem to metabolize medications unusually slowly or rapidly.</p>
<p><strong>Elimination</strong> refers to how the drug and its metabolites are removed from the body, primarily through renal excretion. Half-life (t½) — the time it takes for plasma concentration to fall by 50% — is the key pharmacokinetic parameter for elimination. A drug requires approximately 5 half-lives to be fully cleared from the body. Fluoxetine has an exceptionally long half-life (1–4 days, with its active metabolite norfluoxetine extending to 4–16 days), which is why fluoxetine can be tapered more gradually than shorter-acting SSRIs and why switching from fluoxetine to an MAOI requires a washout period of at least 5 weeks. Paroxetine (Paxil), by contrast, has a short half-life with no active metabolites, which is why it has the highest risk of discontinuation syndrome among the SSRIs. These pharmacokinetic differences have direct clinical implications for how counselors support clients through medication transitions, missed doses, and planned discontinuation.</p>
<p>Major drug classes organize psychiatric medications by mechanism and primary indication. <strong>Antidepressants</strong> encompass SSRIs, SNRIs, tricyclic antidepressants (TCAs), monoamine oxidase inhibitors (MAOIs), and atypical antidepressants (bupropion/Wellbutrin, mirtazapine/Remeron, trazodone). <strong>Anxiolytics</strong> include benzodiazepines, buspirone (Buspar — a non-addictive alternative that takes 2–4 weeks to work), and hydroxyzine (an antihistamine with anxiolytic properties). <strong>Antipsychotics</strong> divide into first-generation (typical) and second-generation (atypical) agents, with the newer third-generation agents (aripiprazole/Abilify, brexpiprazole/Rexulti) representing partial dopamine agonists. <strong>Mood stabilizers</strong> include lithium, valproate (Depakote), lamotrigine (Lamictal), and carbamazepine (Tegretol). <strong>Stimulants</strong> used in ADHD include amphetamine salts (Adderall), methylphenidate (Ritalin, Concerta), and lisdexamfetamine (Vyvanse). <strong>Sleep aids</strong> range from Z-drugs and benzodiazepines to low-dose doxepin (Silenor), melatonin receptor agonists (ramelteon/Rozerem), and orexin antagonists (suvorexant/Belsomra).</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'SSRIs: The Most Commonly Prescribed Antidepressants',
              content: `<p>Selective serotonin reuptake inhibitors block the serotonin transporter (SERT), preventing reuptake of serotonin from the synapse. Approved members include fluoxetine (Prozac), sertraline (Zoloft), paroxetine (Paxil), citalopram (Celexa), escitalopram (Lexapro), and fluvoxamine (Luvox). They are first-line treatments for major depressive disorder, generalized anxiety disorder, panic disorder, social anxiety disorder, OCD, PTSD, and premenstrual dysphoric disorder. Common side effects include nausea (particularly in the first 1–2 weeks), headache, sexual dysfunction (decreased libido, delayed orgasm, anorgasmia — reported in 30–40% of patients), insomnia or sedation, and weight changes with long-term use. They generally have favorable safety profiles in overdose compared to older antidepressants.</p>`
            },
            {
              title: 'SNRIs: Dual-Action Reuptake Inhibition',
              content: `<p>Serotonin-norepinephrine reuptake inhibitors (venlafaxine/Effexor, duloxetine/Cymbalta, desvenlafaxine/Pristiq, levomilnacipran/Fetzima) inhibit reuptake of both serotonin and norepinephrine. The norepinephrine component gives them particular utility for pain syndromes (duloxetine is FDA-approved for fibromyalgia, diabetic neuropathy, and chronic musculoskeletal pain), ADHD-like attention symptoms, and some cases of treatment-resistant depression. Venlafaxine has dose-dependent norepinephrine activity — at low doses (37.5–75 mg), it functions similarly to an SSRI; norepinephrine effects become clinically significant at higher doses (150+ mg). SNRIs carry a risk of elevated blood pressure at higher doses and may have a somewhat worse discontinuation syndrome profile than SSRIs.</p>`
            },
            {
              title: 'TCAs and MAOIs: Older Antidepressants with Specific Clinical Uses',
              content: `<p>Tricyclic antidepressants (amitriptyline/Elavil, nortriptyline/Pamelor, imipramine/Tofranil, clomipramine/Anafranil) inhibit reuptake of serotonin and norepinephrine but also block histamine, acetylcholine, and alpha-adrenergic receptors — producing side effects including anticholinergic effects (dry mouth, constipation, urinary retention, cognitive blunting), sedation, and orthostatic hypotension. They are highly lethal in overdose (cardiac arrhythmia), making them a significant risk factor in clients with suicidal ideation. Clomipramine remains among the most effective treatments for OCD. MAOIs (phenelzine/Nardil, tranylcypromine/Parnate, selegiline/Emsam patch) inhibit monoamine oxidase enzymes that break down serotonin, dopamine, and norepinephrine. They require a strict low-tyramine diet to prevent hypertensive crisis and carry extensive drug interaction risks. They are effective for atypical depression and treatment-resistant cases but are rarely first-line due to safety constraints.</p>`
            },
            {
              title: 'Mood Stabilizers: Lithium, Valproate, and Lamotrigine',
              content: `<p>Lithium (lithium carbonate/Eskalith, Lithobid) remains the gold-standard mood stabilizer for bipolar I disorder and has uniquely demonstrated antisuicidal properties. It has a narrow therapeutic index (therapeutic range 0.6–1.2 mEq/L; toxicity begins near 1.5 mEq/L) and requires regular blood level monitoring. Valproate (Depakote) is effective for acute mania, bipolar I maintenance, and as an augmentation strategy; it carries teratogenic risk (neural tube defects) and should be discussed carefully with clients of childbearing potential. Lamotrigine (Lamictal) is particularly effective for bipolar depression and has a more favorable side-effect profile, but carries a small risk of Stevens-Johnson syndrome (a life-threatening rash) — particularly with rapid dose titration — requiring that dose escalation protocols be followed carefully.</p>`
            },
            {
              title: 'Antipsychotics: First- and Second-Generation Agents',
              content: `<p>First-generation (typical) antipsychotics (haloperidol/Haldol, chlorpromazine/Thorazine, perphenazine/Trilafon, fluphenazine) block D2 dopamine receptors and are effective for positive symptoms of psychosis (hallucinations, delusions) but carry significant risk of extrapyramidal side effects (EPS: akathisia, dystonia, pseudoparkinsonism) and tardive dyskinesia (TD). Second-generation (atypical) antipsychotics (risperidone/Risperdal, olanzapine/Zyprexa, quetiapine/Seroquel, ziprasidone/Geodon, aripiprazole/Abilify, clozapine/Clozaril, lurasidone/Latuda, asenapine/Saphris) block both D2 and 5-HT2A receptors, with generally lower EPS risk but higher metabolic risk (weight gain, dyslipidemia, glucose dysregulation). Clozapine is uniquely effective for treatment-resistant schizophrenia but requires mandatory monitoring via the Clozapine Risk Evaluation and Mitigation Strategy (REMS) due to risk of agranulocytosis.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'From Synapse to Symptom: The Pharmacological Chain',
          content: `<p>Psychiatric medications do not work by directly adding or removing mental experiences. They work by altering the chemical environment at synapses — changing what neurotransmitters are available, for how long, and at which receptors. Those synaptic changes trigger downstream neuroadaptation: receptor density changes, gene expression shifts, neuroplasticity increases in key circuits. The clinical effects we observe — reduced depression, decreased psychotic symptoms, improved attention — emerge from this cascade of biological changes over time. This delayed timeline is not a flaw; it is the mechanism. Helping clients understand this helps them maintain treatment through the lag period before benefit is experienced.</p>`,
          image: '',
          imageAlt: 'Illustration of synaptic neurotransmission showing reuptake pump and receptor activation',
          imagePosition: 'left'
        },
        {
          type: 'multipleChoice',
          question: 'Which neurotransmitter pathway is primarily responsible for the extrapyramidal side effects (EPS) of antipsychotic medications?',
          options: [
            { text: 'Mesolimbic dopamine pathway', isCorrect: false },
            { text: 'Nigrostriatal dopamine pathway', isCorrect: true },
            { text: 'Tuberoinfundibular dopamine pathway', isCorrect: false },
            { text: 'Serotonin raphe-cortical pathway', isCorrect: false }
          ],
          explanation: 'The nigrostriatal pathway, running from the substantia nigra to the striatum, controls movement. Antipsychotic medications that block D2 receptors in this pathway disrupt normal motor control, producing extrapyramidal side effects including akathisia, pseudoparkinsonism, and dystonia. The mesolimbic pathway is responsible for the antipsychotic\'s therapeutic effects on positive symptoms; the tuberoinfundibular pathway governs prolactin secretion.'
        },
        {
          type: 'text',
          content: `<p>The clinical relevance of pharmacokinetics extends beyond the technical. When a counselor understands half-life, they can reason about why a client who ran out of paroxetine over the weekend is experiencing dizziness and "brain zaps" on Monday — classic discontinuation syndrome from an SSRI with a short half-life — while a client who ran out of fluoxetine over the same weekend feels fine, because fluoxetine's long half-life provides a built-in taper. When a counselor understands hepatic metabolism and CYP enzyme interactions, they can recognize that a client who started taking St. John's Wort "for energy" might be inadvertently inducing CYP3A4, reducing plasma levels of their prescribed medication, and thereby precipitating a partial relapse that looks like treatment failure but is actually a drug-supplement interaction.</p>
<p>These are not exotic pharmacology questions. They are the everyday clinical realities of working with medicated clients. Understanding them does not require prescribing authority; it requires education — specifically the kind of applied pharmacological literacy this course aims to build. The goal is not for counselors to manage medications. It is for counselors to recognize, question, and appropriately escalate the pharmacological dimensions of their clients' clinical presentations, while supporting the therapeutic relationship that research consistently identifies as among the strongest predictors of treatment adherence and outcome.</p>
<p>Consider also the role of pharmacogenomics — the study of how genetic variation affects drug response. Approximately 25% of the population are poor metabolizers of CYP2D6, meaning they process medications more slowly and may accumulate higher-than-expected plasma levels at standard doses, leading to exaggerated side effects. Another fraction are ultrarapid metabolizers who clear medications so quickly that standard doses produce subtherapeutic plasma levels, leading to apparent treatment non-response. When a client reports that an SSRI "didn't work" or that they "can't tolerate" medications, pharmacogenomic factors deserve consideration — and pharmacogenomic testing is increasingly available through prescribers. Counselors who understand this possibility can encourage clients to discuss it with their prescribers rather than concluding prematurely that they are simply medication-resistant or medication-intolerant.</p>`
        },
        {
          type: 'text',
          content: `<p>One of the most clinically disorienting experiences for both clients and clinicians is watching two people with what looks like the same diagnosis, prescribed what looks like the same medication at what looks like the same dose, have wildly different outcomes. One client on sertraline 100 mg reports feeling like a different person within six weeks. Another, on the identical medication and dose, reports no benefit at all, or reports side effects so severe they cannot tolerate the medication long enough to find out whether it would have worked. Counselors who do not understand why this happens are left with only two unsatisfying explanations to offer a frustrated client: that the medication simply "doesn't work for everyone," which is true but unhelpfully vague, or that something about the client's engagement or adherence must be the problem, which is frequently untrue and can feel like blame. Pharmacogenomics — the study of how an individual's genetic makeup influences their response to medications — provides a third, far more clinically useful explanation, and understanding its basics equips counselors to normalize a client's difficult medication experience without either minimizing it or misattributing it to something the client did wrong.</p>
<p>The foundation of pharmacogenomic variation in psychiatric medication lies primarily in the cytochrome P450 (CYP) enzyme system, a family of liver enzymes responsible for metabolizing the majority of psychiatric drugs. The genes that code for these enzymes are highly polymorphic, meaning they vary substantially from person to person, and that variation produces measurably different enzyme activity. For clinical purposes, it is useful to think of people as falling along a spectrum for each relevant CYP enzyme, from <strong>poor metabolizers</strong> (individuals whose enzyme activity is significantly reduced or absent, who break medications down slowly and can accumulate higher-than-expected plasma concentrations at standard doses) to <strong>intermediate metabolizers</strong>, to <strong>normal (extensive) metabolizers</strong> (the population baseline the standard dosing guidelines are built around), to <strong>rapid metabolizers</strong>, and finally to <strong>ultrarapid metabolizers</strong> (individuals whose enzyme activity is significantly elevated, often due to having extra copies of the relevant gene, who clear medications so quickly that standard doses may never reach a therapeutic plasma level). The same starting dose of the same medication can therefore produce a toxic-range plasma concentration in one client and a subtherapeutic one in another, purely as a function of inherited enzyme activity, with no difference whatsoever in how faithfully either client took their medication.</p>
<p>CYP2D6 is the single most clinically significant enzyme in this system for psychiatric practice, because it metabolizes a very large proportion of commonly prescribed psychiatric medications, including many SSRIs, most tricyclic antidepressants, several antipsychotics, and numerous opioids. CYP2D6 activity varies dramatically across the population: research consistently finds that poor metabolizers make up roughly 5–10% of people of European descent, with meaningfully different frequencies in other ancestral populations, while a smaller but clinically important percentage are ultrarapid metabolizers (Ingelman-Sundberg, 2004). CYP2C19, another key enzyme, plays a major role in metabolizing several SSRIs (including citalopram and escitalopram) and some anticonvulsant mood stabilizers, and its poor-metabolizer frequency is notably higher in some East Asian and Pacific Islander populations than in European-descended populations — a genuinely biological, not merely correlational, population difference that has direct dosing implications and is part of why "one dose fits all" psychiatric prescribing produces such variable outcomes. CYP3A4, the most abundant CYP enzyme overall, metabolizes a huge range of medications and is also the enzyme most frequently affected by drug-drug and drug-supplement interactions, since it is easily induced (sped up) or inhibited (slowed down) by other substances a client may be taking, including grapefruit juice, St. John's Wort, and many non-psychiatric medications.</p>
<p>Clinical pharmacogenomic testing, now commercially available and increasingly used by psychiatric prescribers, analyzes a client's genetic variants across these key CYP enzymes (along with a handful of other pharmacologically relevant genes) and generates a report predicting how the client is likely to metabolize specific medications. The Clinical Pharmacogenetics Implementation Consortium has published evidence-based prescribing guidelines that translate these genetic findings into concrete dosing recommendations for prescribers (Hicks et al., 2015). It is important for counselors to understand both the promise and the current limits of this technology: pharmacogenomic testing can meaningfully explain why a client has had an unusual reaction to a medication and can help a prescriber choose a more likely-to-succeed starting dose or agent, but it does not yet reliably predict which specific medication will work best for a given client's <em>symptoms</em> — the genetic testing speaks primarily to metabolism and side-effect risk, not to which drug class will be most effective for that individual's particular presentation (Perlis, 2016). Counselors should be cautious about overselling pharmacogenomic testing to clients as a definitive answer to "which medication is right for me," while still recognizing it as a legitimately useful tool worth discussing with a prescriber, particularly for clients who have had multiple unsuccessful medication trials or unusually severe side effects.</p>
<p>For a working counselor, the practical value of understanding pharmacogenomics is not in interpreting genetic test results — that remains squarely within the prescriber's domain — but in reframing how clients understand their own difficult or disappointing medication experiences. A client who has tried three different antidepressants without benefit, and who has quietly concluded that they are simply "not a person medication works for" or, worse, that their depression is untreatable, benefits enormously from understanding that individual metabolic variation is a well-established biological phenomenon, not a reflection of the severity or "realness" of their illness. This reframe does real clinical work: it reduces shame, it counters therapeutic nihilism, and it can motivate a client toward requesting pharmacogenomic testing or trying an augmentation or switch strategy with renewed hope rather than resignation, rather than giving up on pharmacological treatment altogether. Conversely, a client who experienced severe, frightening side effects on a first medication trial — and who has understandably become fearful of trying anything else — benefits from understanding that their reaction may reflect genuinely different metabolism, not a fragile constitution or a psychosomatic overreaction, and that a different agent, or a much lower starting dose with slower titration, may be tolerated far better.</p>
<p>Polypharmacy — the use of multiple medications simultaneously, a near-universal reality for clients with complex psychiatric presentations, co-occurring medical conditions, or long treatment histories — compounds pharmacogenomic variability considerably. Each additional medication a client takes introduces the possibility of a CYP-mediated interaction, in which one drug inhibits or induces the enzyme responsible for metabolizing another, shifting that second drug's plasma concentration in ways neither drug alone would produce. A client's own genetically determined metabolic profile interacts with this pharmacological complexity in ways that are difficult even for prescribers to fully anticipate without careful review, which is precisely why medication reconciliation — a full, current list of every medication, supplement, and substance a client is using — is so clinically important, and why counselors are frequently in a uniquely good position to gather that information. Clients often disclose supplement use, occasional substance use, or borrowed medications to their counselor in a way they do not think to mention, or feel comfortable mentioning, to a prescriber they see for fifteen minutes every few months. A counselor who routinely and non-judgmentally asks "what are you currently taking, including anything over-the-counter or herbal" at intake and periodically thereafter is performing a genuinely important clinical safety function, one directly connected to the pharmacogenomic and polypharmacy realities described here.</p>
<p>For counselors working with medically and psychiatrically complex clients — older adults on five or more medications, clients with co-occurring substance use disorders, clients managing chronic pain alongside psychiatric symptoms, or clients who have cycled through numerous unsuccessful medication trials — this body of knowledge translates into a specific set of clinically useful behaviors. First, maintain genuine curiosity rather than premature conclusions when a client reports an atypical medication response; "that's unusual" is often a more accurate and more useful internal reaction than "that shouldn't happen." Second, normalize the possibility of individual biological variation explicitly with clients, in plain, non-technical language, as part of ordinary psychoeducation rather than as an exotic caveat. Third, encourage clients with a pattern of unusual reactions or repeated treatment failures to raise the possibility of pharmacogenomic testing with their prescriber, framing it as one additional tool available to the treatment team rather than a guaranteed solution. And fourth, maintain the same rigorous medication and supplement inventory habit described above, understanding that this simple, repeatable clinical task is one of the most concrete and valuable contributions a counselor can make to the safety of a client managing a complex medication regimen.</p>
<p>A final consideration concerns direct-to-consumer pharmacogenomic testing, which has grown substantially in availability and marketing reach in recent years. Clients increasingly arrive at sessions having already purchased a commercial genetic testing kit and received a report with color-coded recommendations about which medications they should supposedly avoid or favor. Counselors should approach these reports with informed caution rather than either dismissal or uncritical endorsement. Some direct-to-consumer panels are built on reasonably solid pharmacogenomic evidence for the CYP enzymes discussed above; others extend well beyond the current evidence base, generating confident-sounding recommendations for genes and medication combinations where the supporting research is thin, preliminary, or contested. A client who has been told by a commercial report that a particular medication class is "not compatible with their genetics" may arrive at a prescriber appointment, or at a counseling session, with a firm and sometimes anxious conviction that forecloses options a prescriber might otherwise have recommended. The appropriate counselor response is neither to validate the report as clinical gospel nor to dismiss it outright, but to encourage the client to bring the report directly to their prescriber for interpretation in the context of their full clinical picture, while gently noting that consumer genetic testing varies considerably in scientific rigor and that a prescriber's clinical judgment, informed by but not dictated by such a report, remains central to any medication decision.</p>`
        },
        {
          type: 'flashcardDeck',
          title: 'Neurotransmitter Systems and Clinical Relevance',
          flashcards: [
            { front: 'Serotonin (5-HT) — Primary functions', back: 'Mood regulation, sleep, appetite, impulse control, social behavior. Produced in raphe nuclei. Low activity associated with depression, anxiety, OCD. Targeted by SSRIs (block SERT reuptake pump).' },
            { front: 'Dopamine — Mesolimbic pathway', back: 'VTA → nucleus accumbens. Mediates reward, motivation, reinforcement. Dysregulated in addiction. Antipsychotics reduce activity here for therapeutic effect on positive psychotic symptoms.' },
            { front: 'Dopamine — Nigrostriatal pathway', back: 'Substantia nigra → striatum. Controls movement. D2 blockade here by antipsychotics = extrapyramidal side effects (EPS): akathisia, pseudoparkinsonism, dystonia, tardive dyskinesia.' },
            { front: 'Norepinephrine — Clinical relevance', back: 'Produced in locus coeruleus. Governs arousal, alertness, attention, stress response. Implicated in PTSD hyperarousal, ADHD, depression. Targeted by SNRIs, TCAs, alpha-2 agonists (guanfacine, clonidine).' },
            { front: 'GABA — Clinical relevance', back: 'Primary inhibitory neurotransmitter. GABA-A receptor enhanced by benzodiazepines and alcohol (explaining lethality of combination). Z-drugs (zolpidem, eszopiclone) also target GABA-A for sleep.' },
            { front: 'Half-life (t½) — Clinical meaning', back: 'Time for plasma concentration to fall 50%. Drug requires ~5 half-lives for full clearance. Fluoxetine: 1–4 days (low discontinuation risk). Paroxetine: 21 hours (high discontinuation syndrome risk). Determines taper needs and washout periods.' },
            { front: 'CYP2D6 — Drug interaction significance', back: 'Liver enzyme metabolizing many psychiatric drugs including TCAs and opioids. Fluoxetine and paroxetine are potent 2D6 inhibitors — adding to a 2D6-metabolized drug raises its plasma level. Poor metabolizers (25% of population) may have exaggerated side effects at standard doses.' },
            { front: 'Activation syndrome — SSRIs/SNRIs', back: 'Increased anxiety, agitation, restlessness, insomnia in first 1–2 weeks of SSRI/SNRI therapy. Due to acute serotonin increase before downstream neuroadaptation. FDA black box warning for increased suicidal ideation in patients under 25. Key counselor role: psychoeducation before client starts medication.' }
          ]
        },
        {
          type: 'multiSelect',
          question: 'Which of the following statements about SSRI pharmacology are accurate? (Select all that apply)',
          options: [
            { text: 'SSRIs increase synaptic serotonin concentration by blocking the SERT reuptake pump', isCorrect: true },
            { text: 'The full antidepressant effect typically occurs within 24–48 hours of starting treatment', isCorrect: false },
            { text: 'Fluoxetine has the longest half-life among commonly prescribed SSRIs', isCorrect: true },
            { text: 'Sexual dysfunction is a rare side effect occurring in fewer than 5% of SSRI users', isCorrect: false },
            { text: 'SSRI-related activation syndrome may include increased anxiety and agitation in early treatment', isCorrect: true }
          ],
          explanation: 'SSRIs block SERT, increasing synaptic serotonin. Full antidepressant effects take 2–6 weeks (not 24–48 hours) due to the time needed for downstream neuroadaptation. Fluoxetine has the longest half-life (1–4 days, plus norfluoxetine metabolite at 4–16 days). Sexual dysfunction affects approximately 30–40% of SSRI users, not fewer than 5%. Activation syndrome — increased anxiety, agitation, and restlessness — is a recognized early phenomenon, particularly in the first 1–2 weeks.'
        },
        {
          type: 'reflection',
          question: 'A client you have been seeing for 3 months mentions that their psychiatrist just started them on sertraline (Zoloft) for depression. Two weeks later they tell you they want to stop taking it because it "made everything worse" — they feel more anxious and are sleeping poorly. Using what you have learned about SSRI pharmacology, what would you say to this client? What do you want them to understand about what is happening in their brain? How would this conversation be different if you had introduced this information before they started the medication?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 2',
          takeaways: [
            'The five neurotransmitter systems most relevant to psychiatric medications are serotonin, dopamine, norepinephrine, GABA, and glutamate — each with distinct pathways and clinical implications.',
            'Dopamine has four major CNS pathways; understanding that antipsychotics block D2 receptors across all of them explains why a single medication produces therapeutic effects (mesolimbic), movement side effects (nigrostriatal), and hormonal effects (tuberoinfundibular) simultaneously.',
            'Pharmacokinetics — absorption, distribution, metabolism, elimination — determines how medications behave in the body. Half-life governs discontinuation syndrome risk and taper requirements; CYP enzyme interactions explain many drug-drug and drug-substance interactions.',
            'SSRI activation syndrome (increased anxiety, agitation, restlessness in the first 1–2 weeks) is a major driver of early medication dropout. Counselor psychoeducation before a client starts an SSRI is evidence-supported and falls clearly within non-prescriber scope of practice.',
            'The major drug classes — antidepressants (SSRIs, SNRIs, TCAs, MAOIs), anxiolytics, antipsychotics, mood stabilizers, stimulants, and sleep aids — have distinct mechanisms, indications, and side effect profiles that counselors should know at a clinically functional level.'
          ]
        }
      ]
    },

    // ─── SECTION 3: MAJOR DRUG CLASSES IN CLINICAL DETAIL ──────────────────
    {
      title: 'Major Drug Classes in Clinical Detail: Side Effects, Syndromes, and Monitoring',
      sectionNumber: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Major Drug Classes in Clinical Detail: Side Effects, Syndromes, and Monitoring',
          subtitle: 'What counselors need to recognize — from discontinuation syndrome to clozapine monitoring',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>Clinical pharmacology knowledge becomes most valuable when it is specific. Generic awareness that "antidepressants have side effects" is less useful than knowing that paroxetine discontinuation produces a recognizable syndrome within 24–72 hours of a missed dose, that lithium toxicity can present with symptoms that initially resemble depression or anxiety rather than physical illness, or that quetiapine at low doses is frequently used off-label as a sleep aid in clients who have been told they are on an "antipsychotic" — a label that can produce significant distress if not properly contextualized. This section moves through the major drug classes with that level of clinical specificity.</p>
<p><strong>SSRIs and SNRIs — discontinuation syndrome</strong>: Discontinuation syndrome occurs when SSRIs or SNRIs are stopped abruptly or doses are significantly reduced. The mnemonic FINISH captures the core symptoms: Flu-like symptoms, Insomnia, Nausea, Imbalance (dizziness, vertigo), Sensory disturbances (particularly "brain zaps" — brief electrical shock sensations, often described as lightning bolts through the head), and Hyperarousal. The syndrome typically begins within 1–4 days of stopping the medication and resolves within 1–2 weeks, though paroxetine and venlafaxine discontinuation can produce more prolonged and severe syndromes. Discontinuation syndrome is not the same as addiction or dependence in the clinical sense — it reflects the brain's adjustment to the change in serotonergic tone, not drug-seeking behavior — though clients (and sometimes clinicians) may confuse the two. The clinical response is to restart the medication at the previous dose and taper more gradually, and to explicitly distinguish discontinuation syndrome from drug dependence to avoid unnecessary stigma.</p>
<p><strong>Serotonin syndrome</strong> is a potentially life-threatening drug-drug interaction that results from excessive serotonergic stimulation. It is most commonly caused by combining two serotonergic agents — for example, an SSRI plus a triptan (sumatriptan), an SSRI plus tramadol (an opioid with serotonergic properties), or an SSRI plus an MAOI (the combination most likely to produce severe or fatal serotonin syndrome). The clinical triad is: neuromuscular abnormalities (clonus — rhythmic muscle contractions, particularly in the lower extremities — tremor, hyperreflexia, ataxia), autonomic instability (hyperthermia, tachycardia, diaphoresis, hypertension, diarrhea), and altered mental status (agitation, confusion, and in severe cases, delirium). Mild cases may resemble anxiety or stimulant intoxication. Severe cases can progress to hyperthermia above 41°C, rhabdomyolysis, respiratory failure, and death. Counselors should know that serotonin syndrome requires emergency medical evaluation. If a client reports starting a new medication and within hours develops tremor, myoclonic jerks, rapid heart rate, high fever, and confusion, that is a medical emergency, not a therapy question.</p>
<p><strong>Antidepressant augmentation and combination strategies</strong>: In clinical practice, clients are frequently prescribed more than one psychiatric medication. Common combinations include an SSRI plus a mood stabilizer (for bipolar depression), an SSRI plus an atypical antipsychotic (for treatment-resistant depression — aripiprazole and quetiapine have FDA approval as SSRI augmentation agents), an SSRI plus a benzodiazepine (for short-term anxiety management while the SSRI takes effect), and a stimulant plus a non-stimulant ADHD medication. Counselors working with clients on complex medication regimens should document what medications the client is taking, ask about supplements and OTC medications at each session, and be attuned to reports of new or unusual symptoms that could reflect interactions between agents.</p>
<p><strong>Bupropion (Wellbutrin)</strong> deserves specific attention because it works differently from SSRIs and SNRIs: it inhibits reuptake of dopamine and norepinephrine (not serotonin) and acts on nicotinic acetylcholine receptors. It is FDA-approved for major depression and seasonal affective disorder, and under the brand name Zyban, for smoking cessation. Unlike SSRIs, it is not associated with sexual dysfunction and may actually improve sexual function — making it a frequent choice for clients in whom SSRI-induced sexual dysfunction is a significant problem. Its dopaminergic activity makes it potentially activating and carries a dose-dependent seizure risk — it should be used cautiously or avoided in clients with eating disorders (particularly bulimia with purging) because electrolyte disturbances lower seizure threshold, and it is contraindicated in clients with active seizure disorders. It is also used off-label in ADHD. Counselors should know bupropion well because it comes up frequently, is often misidentified by clients as an SSRI, and has clinical properties — particularly its activating quality and smoking cessation indication — that may be relevant to ongoing counseling goals.</p>`
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Serotonin Syndrome: When to Recognize and Act Immediately',
          content: `<p>Serotonin syndrome is a drug-induced clinical emergency caused by excessive serotonergic activity in the CNS and peripheral nervous system. It is most commonly seen with combinations of two or more serotonergic agents, and it can occur at therapeutic doses — clients do not have to overdose for this to happen. The classic combination that produces severe serotonin syndrome is an SSRI or SNRI plus an MAOI (including linezolid, an antibiotic with MAOI properties, or methylene blue, used in some procedures). Other precipitating combinations include SSRI plus tramadol, SSRI plus fentanyl (in pain management contexts), SSRI plus St. John's Wort, SSRI plus MDMA ("ecstasy"), and SSRI plus dextromethorphan (in high doses of OTC cough syrup).</p>
<p><strong>The clinical triad to recognize:</strong></p>
<ul>
<li><strong>Neuromuscular</strong>: clonus (spontaneous rhythmic muscle jerking, especially ankles), tremor, hyperreflexia, myoclonus, incoordination</li>
<li><strong>Autonomic</strong>: fever (can become extreme), tachycardia, diaphoresis, hypertension, diarrhea</li>
<li><strong>Mental status</strong>: agitation, anxiety, confusion, restlessness; in severe cases, delirium</li>
</ul>
<p><strong>Your role as counselor:</strong> If a client reports starting a new medication or supplement within the past 24–48 hours and now presents with these symptoms — especially clonus, high fever, and mental status changes — this is a medical emergency. Direct the client to emergency services immediately. Do not conduct a therapy session. Document your response. Follow up with the prescriber. Early identification saves lives.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Antipsychotics — extrapyramidal side effects (EPS) and tardive dyskinesia (TD)</strong>: Extrapyramidal side effects are movement disorders caused by D2 receptor blockade in the nigrostriatal dopamine pathway. They occur more commonly with first-generation antipsychotics (particularly high-potency agents like haloperidol and fluphenazine) but can occur with any antipsychotic, including atypicals. The four main EPS presentations are: (1) <em>Acute dystonia</em> — sudden, sustained, involuntary muscle contractions, often affecting the face, neck, or back (oculogyric crisis is an acute dystonic reaction involving involuntary upward eye deviation); occurs within hours to days of starting or increasing an antipsychotic and responds rapidly to anticholinergic medications such as benztropine or diphenhydramine. (2) <em>Akathisia</em> — subjective experience of inner restlessness with compulsive need to move; often described by clients as feeling like they cannot sit still, "crawling out of my skin," or feeling compelled to pace; frequently misidentified as anxiety or agitation and inappropriately treated with dose increases that worsen the symptom. Counselors who recognize akathisia and distinguish it from anxiety worsening provide a critical clinical observation. (3) <em>Pseudoparkinsonism</em> — rigidity, tremor, masked facies (reduced facial expression), shuffling gait, bradykinesia; resembles idiopathic Parkinson's disease and may persist as long as the antipsychotic is taken. (4) <em>Tardive dyskinesia (TD)</em> — a late-onset movement disorder characterized by repetitive, involuntary movements typically affecting the orofacial region (lip smacking, tongue writhing, jaw movements), trunk, and extremities. TD develops after months to years of antipsychotic exposure, is associated with cumulative D2 receptor blockade, and may be permanent even after the antipsychotic is discontinued. The abnormal involuntary movement scale (AIMS) is the standard monitoring tool. Two FDA-approved treatments for TD now exist: valbenazine (Ingrezza) and deutetrabenazine (Austedo), both vesicular monoamine transporter 2 (VMAT2) inhibitors.</p>
<p><strong>Metabolic effects of atypical antipsychotics</strong>: Second-generation antipsychotics — particularly olanzapine (Zyprexa), clozapine, and quetiapine — carry significant risk of metabolic adverse effects: substantial weight gain (olanzapine averages 4–5 kg at 10 weeks), dyslipidemia (elevated triglycerides and LDL), glucose dysregulation (new-onset type 2 diabetes), and elevated blood pressure. These metabolic effects significantly increase cardiovascular risk in clients already at elevated risk due to the sedentary behavior, poor diet, and smoking rates associated with serious mental illness. The FDA requires metabolic monitoring (weight, fasting glucose, fasting lipids) at baseline and regular intervals for patients on these medications. Counselors can support metabolic health by helping clients who take olanzapine or clozapine set concrete goals around physical activity, diet, and smoking cessation — recognizing that the antipsychotic itself is working against them metabolically, which affects motivation and should be acknowledged, not minimized.</p>
<p><strong>Clozapine (Clozaril)</strong> is the most effective antipsychotic for treatment-resistant schizophrenia and has a unique antisuicidal effect (FDA approval for reducing suicidal behavior in schizophrenia and schizoaffective disorder). It is also the most dangerous: it carries a 1–2% risk of agranulocytosis (dangerous reduction in white blood cells, leaving the client severely immunocompromised), requiring mandatory enrollment in the Clozapine Risk Evaluation and Mitigation Strategy (REMS) program with regular CBC monitoring (weekly for the first 6 months, biweekly for the next 6 months, then monthly thereafter). It also carries risk of fatal myocarditis (inflammation of the heart muscle) in the first month of treatment, requiring vigilance for chest pain, palpitations, and fatigue. Clients taking clozapine have to be highly engaged with the monitoring system to remain on the medication — missed blood tests result in mandatory holds. Counselors working with clients on clozapine can provide crucial adherence support by helping clients understand why the monitoring exists, problem-solving barriers to blood test access, and recognizing that clozapine's side effect burden (sedation, hypersalivation, constipation, weight gain) creates strong pressure toward discontinuation in the very clients most likely to benefit from it.</p>
<p><strong>Mood stabilizers — lithium toxicity</strong>: Lithium has a narrow therapeutic index; the difference between a therapeutic and a toxic plasma level is small. Early signs of lithium toxicity — which typically begin at levels above 1.5 mEq/L — include fine hand tremor (worsening to coarse tremor), nausea and vomiting, diarrhea, drowsiness, muscle weakness, and confusion. Moderate toxicity (levels above 2.0 mEq/L) produces ataxia (loss of coordination), slurred speech, and increasingly severe neurological symptoms. Severe toxicity can produce seizures, arrhythmias, encephalopathy, coma, and death. Importantly, dehydration — from heat, illness, vomiting, diarrhea, excessive sweating, or reduced fluid intake — significantly raises lithium levels by reducing renal clearance. NSAIDs (ibuprofen, naproxen) and ACE inhibitors also raise lithium levels through renal mechanisms. Clients on lithium should be counseled to stay well-hydrated, avoid NSAIDs for pain management, and seek evaluation if they develop any neurological symptoms after illness, dehydration, or starting a new medication. A counselor who hears a client report that they have been "really sick with the stomach flu for three days" and is treating them with ibuprofen should recognize that this client may be at risk for lithium toxicity and warrants a prompt check-in with their prescriber.</p>
<p><strong>Benzodiazepines — tolerance, dependence, and withdrawal risk</strong>: Benzodiazepines (diazepam/Valium, lorazepam/Ativan, clonazepam/Klonopin, alprazolam/Xanax, temazepam/Restoril) are among the most prescribed and most misused psychoactive medications in the United States. Their anxiolytic and sedative effects are rapid — onset within 30–60 minutes for most agents — making them highly effective for short-term management of acute anxiety. However, tolerance develops to the sedative and anxiolytic effects within weeks, and physical dependence develops with regular use at therapeutic doses. Benzodiazepine withdrawal is potentially life-threatening — it can produce seizures, delirium, hyperthermia, and death, similar to alcohol withdrawal, and for the same reason (both work via GABA). Benzodiazepine discontinuation must be gradual and medically supervised. Clients who have been using benzodiazepines chronically (daily use for months to years) should never be advised to stop abruptly, even if a counselor is concerned about misuse. The clinical priority is a medically supervised taper. Long-term benzodiazepine use is also associated with cognitive impairment, falls and fractures in older adults, and blunted emotional processing that may interfere with trauma therapy (clients prescribed benzodiazepines while doing exposure-based trauma treatment may not consolidate fear extinction as effectively).</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Recognizing Antipsychotic Akathisia vs. Anxiety Worsening',
              content: `<p>Akathisia is one of the most commonly misidentified antipsychotic side effects — and the misidentification has serious consequences. When a client on an antipsychotic reports feeling "more anxious" or "like they can't sit still," the instinctive response may be to assume psychological anxiety worsening and adjust the psychotherapy approach or escalate to the prescriber for an anxiety medication. But if the symptom is akathisia — a subjective sense of inner restlessness driven by dopamine receptor blockade in the basal ganglia — adding an anxiolytic may provide temporary relief but does not address the cause. True akathisia is treated by reducing the antipsychotic dose (if clinically feasible), switching to a lower-D2-blocking agent, or adding a beta-blocker (propranolol) or benzodiazepine. The diagnostic clue is that the restlessness is specifically motor — clients feel compelled to move, pace, shift positions — and it is temporally linked to starting or increasing the antipsychotic. Clients are often embarrassed or confused about this symptom and do not spontaneously name it as a medication side effect.</p>`
            },
            {
              title: 'Valproate (Depakote) — Teratogenicity and Clinical Monitoring',
              content: `<p>Valproate (valproic acid, divalproex sodium/Depakote) is a highly effective mood stabilizer and anticonvulsant but carries significant risks that require attention in clinical settings. Most critically, valproate is teratogenic: neural tube defects occur in approximately 1–2% of pregnancies exposed during the first trimester, a rate approximately 10–20 times higher than background risk. Spina bifida, cognitive teratogenicity (reduced IQ in exposed children), and physical malformations are documented. The FDA requires enrollment in the Valproate REMS program for women of childbearing potential, requiring documented counseling about contraception and the risks. Counselors working with clients of reproductive age on valproate should not assume this conversation has happened — in many clinical settings it has not — and should gently inquire about family planning goals and refer back to the prescriber for explicit discussion. Valproate also requires monitoring of liver function tests and CBC, carries a risk of acute hepatotoxicity (particularly in children under 2), and can cause pancreatitis.</p>`
            },
            {
              title: 'Lamotrigine (Lamictal) Rash — Stevens-Johnson Syndrome',
              content: `<p>Lamotrigine is generally well-tolerated and is among the safest mood stabilizers in terms of metabolic and cognitive side effects. However, it carries a risk of serious dermatological reactions — benign maculopapular rash (which occurs in approximately 10% of patients) and, rarely but potentially life-threateningly, Stevens-Johnson syndrome (SJS) or toxic epidermal necrolysis (TEN). SJS begins as a rash but progresses to painful blistering and sloughing of the mucous membranes (mouth, eyes, genitals) and skin — a dermatological emergency with significant mortality. The risk is highest with rapid dose titration, with concurrent valproate (which raises lamotrigine plasma levels by inhibiting its metabolism), and in younger patients. All patients starting lamotrigine are warned that any new rash should prompt immediate contact with their prescriber. Counselors should take a client's report of "a rash" seriously in this context — it is not an allergic overreaction, it is a clinically meaningful signal that requires prompt medical evaluation.</p>`
            },
            {
              title: 'Stimulant Medications — Cardiovascular and Psychiatric Monitoring',
              content: `<p>Amphetamine salts (Adderall, Adderall XR), methylphenidate (Ritalin, Concerta, Daytrana), lisdexamfetamine (Vyvanse), and dexmethylphenidate (Focalin) are dopamine and norepinephrine reuptake inhibitors used for ADHD. They are effective and widely used — prescription rates for ADHD medications have increased substantially over the past decade, particularly in adults. Common side effects include decreased appetite, insomnia (particularly if taken late in the day), dry mouth, headache, irritability or mood changes as the medication wears off ("rebound"), and elevated heart rate and blood pressure. Cardiovascular contraindications include structural cardiac abnormalities and certain arrhythmias — clients should have a cardiovascular history taken before starting stimulants. Psychiatric contraindications include active psychosis (stimulants can exacerbate psychotic symptoms) and bipolar disorder without adequate mood stabilization (stimulants can precipitate mania). Stimulants have abuse potential — counselors should be alert to clients who request escalating doses, report repeatedly losing or forgetting their medication, or seem to be using stimulants in ways inconsistent with a prescription (e.g., intranasal administration).</p>`
            },
            {
              title: 'Sleep Medications — Z-Drugs, Orexin Antagonists, and Off-Label Use',
              content: `<p>Sleep aids constitute a heterogeneous group. Z-drugs (zolpidem/Ambien, eszopiclone/Lunesta, zaleplon/Sonata) target GABA-A receptors similarly to benzodiazepines but with more sedative selectivity. Zolpidem is associated with complex sleep behaviors (sleep-driving, sleep-eating, and other automatic behaviors while technically asleep but behaviorally active) — clients should not drink alcohol with zolpidem and should be in a safe environment when taking it. Orexin antagonists (suvorexant/Belsomra, lemborexant/Dayvigo) block the wake-promoting orexin system — a mechanistically distinct approach with lower abuse potential. Low-dose trazodone (25–100 mg at bedtime) is widely used off-label for insomnia; its histamine and serotonin receptor antagonism produces sedation. Low-dose doxepin (Silenor, 3–6 mg) is FDA-approved for sleep maintenance insomnia. Melatonin receptor agonist ramelteon (Rozerem) is non-scheduled and appropriate for clients with substance use histories. Quetiapine (Seroquel) at 25–50 mg is frequently prescribed off-label as a sleep aid — counselors should know that clients on this dose for sleep are still on an antipsychotic with all associated monitoring considerations, even though the indication is insomnia.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Monitoring Calendar: What Requires Regular Lab Work',
          content: `<p>Several psychiatric medications require regular laboratory monitoring to ensure safety. Lithium requires blood level monitoring every 3–6 months at steady state (more frequently when dosing changes, during illness, or in dehydration). Clozapine requires absolute neutrophil count (ANC) weekly for 6 months, biweekly for months 7–12, then monthly. Valproate requires periodic liver function tests and CBC. Atypical antipsychotics require metabolic panel monitoring (fasting glucose, fasting lipids) at baseline, 12 weeks, and annually. Clients who understand why this monitoring exists are more adherent to it — and counselors who understand the monitoring rationale can reinforce it in session.</p>`,
          image: '',
          imageAlt: 'Chart showing laboratory monitoring requirements for common psychiatric medications',
          imagePosition: 'right'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following statements about benzodiazepine discontinuation are accurate? (Select all that apply)',
          options: [
            { text: 'Abrupt discontinuation of long-term benzodiazepines can cause life-threatening seizures', isCorrect: true },
            { text: 'Benzodiazepine withdrawal is similar to alcohol withdrawal because both work via GABA mechanisms', isCorrect: true },
            { text: 'Clients who have been taking benzodiazepines for anxiety have not developed physical dependence if they never abused their prescription', isCorrect: false },
            { text: 'Chronic benzodiazepine use may interfere with fear extinction in exposure-based trauma therapy', isCorrect: true },
            { text: 'Benzodiazepine tolerance typically takes years to develop with prescribed doses', isCorrect: false }
          ],
          explanation: 'Abrupt benzodiazepine discontinuation in physically dependent individuals can cause seizures and delirium — a life-threatening withdrawal syndrome. Like alcohol, benzodiazepines work via GABA-A receptor enhancement, which is why withdrawal from both can be fatal. Physical dependence develops with regular therapeutic-dose use over weeks — it is not limited to clients who misuse or abuse their prescription. Research suggests that benzodiazepines may blunt fear extinction, potentially interfering with exposure-based trauma treatments. Tolerance to sedative and anxiolytic effects typically develops within weeks, not years.'
        },
        {
          type: 'text',
          content: `<p>The syndrome of lithium toxicity deserves additional clinical emphasis because it presents in ways that may initially appear psychological. Early-to-moderate lithium toxicity — plasma levels in the 1.5–2.0 mEq/L range — can produce confusion, drowsiness, irritability, difficulty concentrating, and emotional lability that in a client with bipolar disorder might initially be attributed to mood episode worsening. A counselor who is aware of this clinical picture and asks the right questions — "Have you been sick lately? Have you been drinking enough water? Did you recently start any new medications, including ibuprofen or naproxen?" — may identify lithium toxicity before it progresses to a more dangerous level. Documenting the recommendation to contact the prescriber is equally important. The goal is not to manage lithium levels — that is the prescriber's role — but to identify a clinical signal and act appropriately on it.</p>
<p>Similar clinical vigilance applies to valproate. A client on valproate who reports unusual fatigue, jaundice, right-sided abdominal pain, or severely increased seizure frequency may be experiencing hepatotoxicity — a rare but serious adverse effect requiring immediate medical evaluation. Counselors do not need to be pharmacists to recognize that "my skin looks yellow and my stomach has been hurting since I started that medication" is a sentence that warrants calling the prescriber the same day, not waiting for the next scheduled appointment. This is not practicing medicine; it is practicing competent, medication-informed counseling.</p>
<p>The clinical picture for clozapine requires special attention to the signs of agranulocytosis: fever, sore throat, and flu-like symptoms that occur within the first 3–18 weeks of treatment (and can occur at any time). Because clozapine is used precisely for clients with treatment-resistant schizophrenia — clients who may have limited illness insight, disorganized communication, or impaired help-seeking — counselors working with this population play a critical safety role in asking about symptoms and monitoring compliance with the mandatory blood testing schedule. A client who has missed more than two consecutive weeks of blood tests will typically be required to discontinue clozapine by the REMS program. Supporting continuity of that monitoring, without being alarmist, is a specific and important counselor function.</p>`
        },
        {
          type: 'text',
          content: `<p>Psychiatric medication decisions do not occur in a vacuum; they occur in the context of a client's whole body, whole life stage, and whole cultural world. Four populations require particular clinical sensitivity from counselors: clients who are pregnant or lactating, older adults, adolescents, and clients whose cultural context shapes their relationship to medication in ways that generic psychoeducation does not address. None of these populations require a counselor to make medication decisions on their behalf — that remains the prescriber's role — but each requires the counselor to understand enough of the clinical landscape to provide genuinely informed support rather than generic reassurance or generic alarm.</p>
<p><strong>Pregnancy and lactation</strong> present some of the most emotionally fraught medication decisions a client will ever navigate, precisely because every option carries risk, including the option of stopping medication. Untreated psychiatric illness during pregnancy is not a neutral or "safe" default; untreated depression, anxiety, and bipolar disorder during pregnancy are independently associated with poor obstetric outcomes, impaired prenatal care engagement, postpartum complications, and risks to the developing fetus and later child development, in addition to the direct suffering of the pregnant person (Yonkers et al., 2009). At the same time, specific medications carry their own documented risks during specific windows of pregnancy — for example, valproate's well-established risk of neural tube defects during first-trimester exposure, discussed earlier in this course — and lactation introduces a separate question of how much of a given medication transfers into breast milk and what that means for a nursing infant. The clinical reality is that these are highly individualized risk-benefit calculations that belong to the pregnant or postpartum client and their prescriber, ideally in consultation with the client's obstetric provider, weighing the specific medication, the specific trimester or stage of lactation, the severity and history of the client's psychiatric illness, and the client's own values. The counselor's role is not to weigh in on this calculation but to support the client in feeling genuinely informed and genuinely heard as they navigate it — normalizing the difficulty of the decision, countering the common and unhelpful cultural message that a "good mother" simply tolerates untreated psychiatric suffering for the sake of the pregnancy, helping the client organize questions for a maternal-fetal medicine consultation or reproductive psychiatry appointment, and explicitly avoiding language that implies any option is obviously correct. A client who is agonizing over whether to continue an antidepressant through pregnancy needs a counselor who can hold the complexity of that decision alongside them, not a counselor who either reflexively reassures ("I'm sure it's fine") or reflexively alarms ("you might want to think hard about that") — both responses substitute the counselor's incomplete opinion for the specialized risk-benefit consultation the client actually needs, and both can leave a vulnerable client feeling more alone with the decision, not less.</p>
<p><strong>Older adults</strong> require a distinct set of clinical sensitivities rooted in age-related changes in pharmacokinetics and pharmacodynamics. Renal and hepatic clearance both decline with age, meaning medications and their metabolites remain in an older adult's system longer than they would in a younger adult at the same dose, which is part of why prescribers typically follow a "start low, go slow" approach to psychiatric medication in geriatric patients. Older adults are also disproportionately affected by polypharmacy, frequently taking numerous medications for co-occurring medical conditions alongside any psychiatric medication, which multiplies the potential for CYP-mediated drug interactions discussed elsewhere in this course. Two specific risk domains deserve counselor attention. First, <strong>falls risk</strong>: sedating medications, including benzodiazepines, some antidepressants, and many antipsychotics, meaningfully increase fall risk in older adults through sedation, orthostatic hypotension, and impaired balance and reaction time — and falls in older adults carry disproportionate consequences, including hip fractures and their well-documented association with subsequent functional decline and mortality. The American Geriatrics Society's Beers Criteria explicitly flag several classes of psychiatric medication, benzodiazepines prominently among them, as potentially inappropriate for many older adults precisely because of this risk profile (American Geriatrics Society Beers Criteria Update Expert Panel, 2019). Second, <strong>cognitive effects</strong>: anticholinergic medications, including many older tricyclic antidepressants and some antipsychotics, carry a documented association with cognitive impairment in older adults, and clinicians must carefully distinguish medication-related cognitive symptoms from an emerging or progressing dementia process — a distinction with major implications for how a client's presentation is understood and treated going forward. Counselors working with older clients should ask directly about falls, dizziness, and new cognitive changes as part of ordinary clinical monitoring, and should feel comfortable raising these observations with a prescriber even when the client themselves has not connected a fall or a memory lapse to a recent medication change.</p>
<p><strong>Adolescents</strong> occupy a uniquely monitored category in psychiatric prescribing because of the FDA's black box warning, present on all antidepressants, regarding increased risk of suicidal thinking and behavior in children, adolescents, and young adults up to age 24 during the early weeks of treatment (Bridge et al., 2007). This warning does not mean antidepressants are contraindicated in this age group — untreated depression carries its own substantial suicide risk, and antidepressants remain an evidence-based, frequently life-saving treatment for adolescent depression and anxiety — but it does mean that close monitoring during the first several weeks of treatment, and after any dose change, is a documented clinical standard, not an optional precaution. Counselors working with adolescent clients on newly started or recently adjusted antidepressants carry real monitoring responsibility: regular, direct assessment of suicidal ideation should not be treated as a one-time intake question but as an ongoing part of every session during this higher-risk window, and any escalation in risk should trigger prompt communication with the prescriber and, where clinically indicated, with parents or guardians, consistent with the client's age, developmental stage, and the counselor's informed consent and confidentiality agreements with the family. Counselors should also be alert to activation syndrome specifically in this population, since the line between expected early activation and a genuine increase in risk can be difficult to distinguish and requires careful, session-by-session clinical judgment rather than a single checklist assessment.</p>
<p><strong>Cultural factors in medication adherence</strong>, introduced earlier in this course in relation to specific communities, deserve one further layer of attention here: the intersection of culture with the populations just discussed. A pregnant client from a cultural or religious background that holds strong beliefs about medication use during pregnancy may experience family or community pressure that compounds an already difficult decision. An older adult from a generation or cultural background with strong stigma toward psychiatric treatment may minimize side effects or cognitive changes rather than report them, out of a learned reluctance to appear as a "complainer" about a treatment they were hesitant to start in the first place. An adolescent navigating a first psychiatric medication trial within a family that holds skeptical or fearful beliefs about psychiatric medication may face a genuine loyalty conflict between following prescriber guidance and honoring family values — a conflict a counselor can help name and navigate without taking a side. In each of these intersections, the guiding clinical principle remains the same: cultural context shapes how a client experiences, discloses, and makes decisions about medication, and a counselor who explores that context with genuine curiosity, rather than either dismissing it as an obstacle to "compliance" or avoiding it out of discomfort, provides meaningfully better support than one who treats every client's medication decision as a generic, culturally neutral cost-benefit calculation.</p>
<p>A concrete illustration helps clarify the counselor's role in the perinatal context specifically. Consider a client, six weeks postpartum, on sertraline for postpartum depression, who is breastfeeding and has been told by a well-meaning relative that "real breast milk shouldn't have medication in it." She arrives at session distressed, questioning whether to stop the medication abruptly despite worsening depressive symptoms. The counselor's appropriate response is not to reassure her that sertraline is definitely safe in lactation, nor to validate the relative's framing, but to explore what is driving the distress, normalize that this is a genuinely hard and common dilemma for postpartum clients, provide accurate general information that essentially all medications transfer into breast milk to some degree and that prescribers weigh infant exposure against the documented risks of untreated maternal depression on infant attachment and development, and strongly encourage a prompt conversation with her prescriber or a reproductive psychiatry consultation rather than a unilateral decision made under family pressure in between appointments. This response respects scope, respects the client's autonomy, and actively reduces the risk of an abrupt, unsupervised discontinuation that could destabilize both her mental health and the infant's early caregiving environment.</p>
<p>Counselors should also be aware that reproductive-age clients, not only those who are currently pregnant, benefit from proactive rather than reactive conversation about medication and family planning. A client stable on valproate or another teratogenic mood stabilizer who becomes unexpectedly pregnant before that conversation has happened faces a considerably more complicated clinical situation than one who has already discussed contraception and reproductive planning with her prescriber. Counselors are often better positioned than a prescriber seen quarterly to notice when a client's life circumstances, a new relationship, a stated desire to start a family, a missed period, make this conversation newly relevant, and to gently prompt the client to raise it at her next prescriber visit rather than waiting for it to become an urgent, after-the-fact conversation.</p>
<p>Finally, cultural humility in this context means resisting the temptation to resolve a client's cultural or generational ambivalence about medication with a purely biomedical counterargument. When a client's grandmother insists that "our family doesn't need pills, we pray," the clinically skilled response is not to marshal evidence-based arguments against this belief but to hold both realities simultaneously: the client's genuine, evidence-supported psychiatric need, and the client's genuine, meaningful connection to a family and spiritual framework that has offered real support and resilience across generations. Counselors who can sit with clients in that tension, rather than resolving it prematurely in either direction, help clients arrive at decisions that are sustainable precisely because they were not made in opposition to the client's whole identity and support system.</p>`
        },
        {
          type: 'cardSort',
          instructions: 'Sort each side effect or clinical finding into the correct medication category.',
          categories: ['SSRI/SNRI', 'Antipsychotic (Typical/Atypical)', 'Lithium', 'Benzodiazepine'],
          cards: [
            { id: '1', text: 'Brain zaps and dizziness after missing a dose', correctCategory: 'SSRI/SNRI' },
            { id: '2', text: 'Involuntary repetitive lip-smacking movements after 2 years of treatment', correctCategory: 'Antipsychotic (Typical/Atypical)' },
            { id: '3', text: 'Coarse tremor, confusion, and vomiting after stomach flu', correctCategory: 'Lithium' },
            { id: '4', text: 'Seizure risk with abrupt discontinuation', correctCategory: 'Benzodiazepine' },
            { id: '5', text: 'Sexual dysfunction in 30–40% of users', correctCategory: 'SSRI/SNRI' },
            { id: '6', text: 'Metabolic syndrome: weight gain, dyslipidemia, glucose dysregulation', correctCategory: 'Antipsychotic (Typical/Atypical)' },
            { id: '7', text: 'Requires dehydration precautions and NSAID avoidance', correctCategory: 'Lithium' },
            { id: '8', text: 'Tolerance to anxiolytic effects develops within weeks', correctCategory: 'Benzodiazepine' },
            { id: '9', text: 'Akathisia — inner restlessness often mistaken for anxiety worsening', correctCategory: 'Antipsychotic (Typical/Atypical)' },
            { id: '10', text: 'Activation syndrome: increased anxiety and insomnia in first 1–2 weeks', correctCategory: 'SSRI/SNRI' }
          ],
          explanation: 'Each of these side effects is linked to a specific medication class by mechanism. Discontinuation syndrome (brain zaps) is characteristic of short-half-life SSRIs/SNRIs. Tardive dyskinesia is caused by chronic D2 receptor blockade by antipsychotics. Lithium toxicity is precipitated by dehydration or NSAIDs. Benzodiazepine withdrawal is uniquely dangerous due to GABA mechanism.'
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each psychiatric medication or drug class to its primary clinical monitoring concern.',
          matchingPairs: [
            { term: 'Clozapine (Clozaril)', definition: 'Weekly ANC (absolute neutrophil count) monitoring via mandatory REMS program due to agranulocytosis risk' },
            { term: 'Lithium carbonate', definition: 'Regular blood level monitoring; dehydration and NSAIDs can cause toxicity' },
            { term: 'Valproate (Depakote)', definition: 'Liver function tests; teratogenicity requiring REMS for women of childbearing potential' },
            { term: 'Lamotrigine (Lamictal)', definition: 'New rash requires immediate evaluation — risk of Stevens-Johnson syndrome' },
            { term: 'Olanzapine (Zyprexa)', definition: 'Metabolic monitoring: fasting glucose, fasting lipids, weight at baseline and regular intervals' }
          ]
        },
        {
          type: 'reflection',
          question: 'A client with schizophrenia who has been stable on clozapine for 18 months tells you they are thinking about stopping the medication because they feel like they are "always at the doctor" for blood tests and they are tired of the side effects (sedation and drooling). They feel much better than they did before clozapine and are wondering if they even still need it. How would you approach this conversation? What do you understand about clozapine that is clinically relevant here? How does scope of practice shape what you say, and what do you do after this session?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 3',
          takeaways: [
            'SSRI and SNRI discontinuation syndrome (FINISH mnemonic: Flu-like symptoms, Insomnia, Nausea, Imbalance, Sensory disturbances, Hyperarousal) is caused by abrupt stopping or dose reduction, not dependence in the addiction sense. Paroxetine and venlafaxine carry the highest discontinuation syndrome risk.',
            'Serotonin syndrome — the clinical triad of neuromuscular abnormalities, autonomic instability, and altered mental status — is a medical emergency. It is most commonly precipitated by combining two serotonergic agents, including SSRI plus MAOI, SSRI plus tramadol, or SSRI plus MDMA.',
            'Antipsychotic EPS includes acute dystonia, akathisia (frequently misidentified as anxiety), pseudoparkinsonism, and tardive dyskinesia (late-onset, potentially irreversible orofacial movements). Clozapine requires mandatory REMS monitoring due to agranulocytosis risk.',
            'Lithium toxicity is precipitated by dehydration, NSAIDs, and ACE inhibitors, and can present with initially subtle neurological and psychiatric symptoms. Clients experiencing GI illness while on lithium need prompt prescriber contact.',
            'Benzodiazepine physical dependence develops with regular therapeutic-dose use within weeks. Abrupt discontinuation can be fatal. Long-term use may interfere with exposure-based trauma therapy by blunting fear extinction.',
            'Atypical antipsychotics — particularly olanzapine, clozapine, and quetiapine — carry significant metabolic risks requiring monitoring. Counselors can support metabolic health through behavioral goal-setting within their scope.'
          ]
        }
      ]
    },

    // ─── SECTION 4: COUNSELOR'S ROLE IN MEDICATION MANAGEMENT ─────────────
    {
      title: 'The Counselor\'s Role: Adherence, Psychoeducation, and Scope of Practice',
      sectionNumber: 4,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'The Counselor\'s Role: Adherence, Psychoeducation, and Scope of Practice',
          subtitle: 'From medication adherence support to cultural humility and scope of practice ethics for non-prescribers',
          sectionNumber: 4
        },
        {
          type: 'text',
          content: `<p>The therapeutic relationship is the most powerful leverage point counselors have for supporting medication adherence. Research on medication adherence consistently demonstrates that the quality of the client-provider relationship predicts adherence better than most clinical and demographic variables. Clients who feel heard, respected, and understood in their ambivalence about medication are significantly more likely to take it as prescribed, report side effects honestly, and engage with medication adjustments collaboratively. Counselors, who typically see clients weekly and develop long-term therapeutic relationships that prescribers rarely have time to build, are uniquely positioned to serve this function — not as medication monitors or compliance enforcers, but as curious, non-judgmental collaborators in the client's medication experience.</p>
<p>Medication non-adherence is common and clinically significant. Studies suggest that approximately 50% of clients with major depression stop their antidepressant within the first 3 months, and adherence rates for antipsychotics in schizophrenia are consistently below 60% in community settings. The reasons for non-adherence are varied and deserve clinical exploration rather than assumption: side effects (particularly sexual dysfunction, weight gain, sedation, and cognitive dulling), stigma and identity concerns (particularly the belief that needing medication means being "crazy" or having a chronic illness), practical barriers (cost, transportation, pharmacy access), lack of perceived efficacy ("it isn't working" — which may reflect the 2–6 week onset lag, a subtherapeutic dose, the wrong medication, or genuine pharmacological non-response), cultural beliefs about mental health and medication, and ambivalence about recovery itself.</p>
<p>The counselor's approach to medication adherence begins with curiosity, not persuasion. Asking "How are you feeling about the medication?" as a regular check-in — not only when a problem arises — creates space for clients to voice concerns before they have already decided to stop. Motivational interviewing techniques are directly applicable: exploring ambivalence, eliciting change talk about the medication's role in the client's goals, and respecting autonomy while providing accurate information. When clients express the desire to reduce or stop a medication, the counselor's role is not to immediately defer or immediately advocate — it is to explore the concerns, provide relevant psychoeducation, encourage the client to discuss the decision with their prescriber, and support the client's agency while ensuring they understand the risks of abrupt discontinuation. This is a skilled clinical function, not a neutral hand-off.</p>
<p>Psychoeducation about side effects is a concrete, evidence-supported intervention within counselor scope of practice. Clients who receive advance information about expected side effects — including the onset timeline, typical duration, and management strategies — have better adherence and better outcomes. Specific psychoeducation that counselors can provide includes: explaining that SSRIs typically take 2–6 weeks to produce therapeutic effect and that initial anxiety or insomnia is expected and temporary; explaining that antipsychotic medications work best when taken consistently and that missing doses can produce rapid rebound; explaining that lithium requires hydration and NSAID avoidance; explaining that benzodiazepines should not be combined with alcohol; explaining that valproate requires contraception discussion with the prescriber for clients of reproductive age; and explaining that stimulants taken after 2:00 PM are likely to disrupt sleep. None of this requires prescribing authority. It requires pharmacological knowledge applied within a therapeutic relationship, which is exactly what this course provides.</p>
<p>Drug-drug and drug-substance interactions represent one of the most important areas of pharmacological awareness for counselors, because counselors are often the first clinicians to learn that a client is using substances or supplements alongside their prescribed medications. Cannabis (both THC and CBD) has clinically significant interactions with psychiatric medications: CBD inhibits CYP2C19 and CYP3A4, potentially raising plasma levels of medications metabolized by these enzymes; cannabis smoke induces CYP1A2, accelerating metabolism of clozapine and olanzapine; and THC's psychoactive effects can exacerbate psychotic symptoms in clients with schizophrenia or bipolar disorder and can trigger anxiety and paranoia that are indistinguishable from medication side effects. Alcohol combined with benzodiazepines or Z-drugs (zolpidem, etc.) produces synergistic CNS and respiratory depression — a combination that contributes to overdose deaths. Alcohol combined with MAOIs requires specific caution: some alcoholic beverages (particularly red wine and beer) contain tyramine, which — in the presence of an MAOI — can precipitate a hypertensive crisis. St. John's Wort (a popular OTC herbal supplement for depression) is a CYP3A4 inducer that reduces plasma levels of numerous medications and is a serotonin-augmenting agent that can precipitate serotonin syndrome when combined with SSRIs.</p>`
        },
        {
          type: 'callout',
          calloutType: 'ethics',
          title: 'The Counselor\'s Ethical Role When a Client Asks "Should I Stop My Medication?"',
          content: `<p>Few questions create more clinical anxiety for non-prescribing counselors than a client asking whether they should stop their medication. The anxiety often reflects an overcorrection: either the counselor immediately defers ("You need to ask your doctor, not me") in a way that leaves the client feeling unheard and clinically abandoned, or the counselor goes beyond scope in expressing strong opinions about medication management decisions that belong to the prescriber-client relationship.</p>
<p>The ethical path is neither deference nor overreach. It is a structured, curious, therapeutic exploration that includes:</p>
<ul>
<li><strong>Exploring the concern</strong>: What specifically is prompting this question? A specific side effect? Feeling better and wondering if they still need it? Financial burden? Stigma from a family member? Each concern has a different appropriate therapeutic response.</li>
<li><strong>Providing relevant psychoeducation</strong>: If the client is considering stopping an antidepressant because they feel better, it is appropriate to explain that feeling better is often the medication working, and that early discontinuation significantly increases relapse risk — without telling them what to decide. If they are experiencing a side effect, it is appropriate to discuss that side effects can often be managed through dose adjustment or medication switch.</li>
<li><strong>Supporting prescriber communication</strong>: Help the client articulate their concerns in a way they can bring to the prescriber. Consider whether a collaborative care meeting is appropriate. Document the conversation.</li>
<li><strong>Never recommending discontinuation</strong>: Regardless of your clinical instincts, recommending that a client stop a psychiatric medication is outside counselor scope of practice. This is true even if you believe the medication is unnecessary or harmful. Surface your clinical concern to the prescriber through appropriate channels.</li>
</ul>
<p>The NBCC and most state licensing boards are clear that counselors may discuss medications, provide psychoeducation, and support adherence — but may not prescribe, recommend specific medications, or advise clients to discontinue medications. Understanding the difference is an ethical competency, not a bureaucratic technicality.</p>`
        },
        {
          type: 'text',
          content: `<p>Cultural factors in medication acceptance are clinically central and frequently underaddressed in psychopharmacology education. Cultural beliefs about mental illness, medication, and the relationship between psychological and somatic experience shape whether clients are willing to take psychiatric medications, whether they take them as prescribed, whether they disclose non-adherence, and how they interpret and report side effects. These factors operate across cultural dimensions — racial and ethnic identity, religious and spiritual belief systems, family cultural norms, immigration history, and socioeconomic context — and they do not reduce to stereotypes. The individual client's specific experience of their cultural context is always more clinically relevant than demographic generalizations.</p>
<p>Several cultural themes appear consistently in the psychopharmacology adherence literature and deserve specific clinical attention. Among some African American communities, concerns about overmedication, historically informed medical mistrust (rooted in documented research abuses such as the Tuskegee syphilis study and ongoing disparities in pain management), and beliefs that mental illness should be addressed through community, family, and spiritual resources rather than pharmaceutical intervention create barriers to medication engagement that require culturally sensitive exploration — not dismissal. Among some Latinx communities, <em>familismo</em> (the central role of family in health decisions) means that a client's adherence may depend significantly on family attitudes toward medication; including family in psychoeducation, when appropriate and with the client's consent, can meaningfully improve outcomes. Among some Asian communities, stigma concerns related to psychiatric diagnosis and medication may lead clients to minimize or conceal medication use even from counselors, requiring a non-judgmental and curious inquiry approach.</p>
<p>Religious and spiritual beliefs about medication deserve exploration rather than challenge. Clients who believe that psychiatric illness is spiritual in nature, or that accepting medication indicates insufficient faith, experience a real cognitive and spiritual conflict in taking psychiatric medication — a conflict that cannot be resolved by simply citing the evidence base. The counselor's role is to hold space for that conflict, explore its dimensions, and help the client integrate their spiritual and clinical realities in a way that supports their wellbeing. For some clients, framing medication as a tool that supports the brain's functioning — analogous to insulin for diabetes — resonates. For others, exploring how their faith tradition's understanding of healing and medicine intersects with psychiatric treatment is the necessary work. The goal is not to convince clients to take medications — that is ultimately not the counselor's decision to make — but to ensure that decisions about medication are made from an informed, autonomous, and clinically supported place rather than from avoidance or stigma.</p>
<p>Scope of practice for non-prescribing mental health counselors is defined by exclusion as much as by inclusion. Counselors may not prescribe medications, may not recommend specific medications, may not recommend dosage changes, and may not advise clients to discontinue medications. Within these limits, there is substantial — and often underutilized — clinical space. Counselors may provide psychoeducation about how psychiatric medications work, their common side effects, and the importance of adherence. They may assess medication response and side effects as part of ongoing clinical monitoring. They may help clients formulate and communicate concerns to their prescribers. They may coordinate care with prescribers through appropriate releases of information. They may support adherence by exploring and addressing barriers. They may recognize potential medication-related clinical emergencies (serotonin syndrome, lithium toxicity, agranulocytosis signs) and act appropriately. And they may, when clinically concerned about a client's medication regimen, raise that concern with the prescribing clinician through appropriate professional channels — not with the client in a way that undermines prescriber authority, but through professional communication that serves the client's wellbeing.</p>
<p>Effective prescriber communication is a clinical skill that deserves deliberate development. When contacting a prescriber about a client, counselors should be organized, specific, and solution-oriented: describe the observed clinical change (not a medication recommendation), provide the temporal context (when did this start, what has changed), and communicate urgency appropriately. "I am concerned that [client's] anxiety has significantly increased since starting sertraline 10 days ago and they are considering stopping the medication — I wanted to flag this before their next appointment with you" is both clinically appropriate and genuinely useful to the prescriber. "I think you should switch them to a different medication" is outside scope. The difference is in who is making the clinical decision — the prescriber, informed by information the counselor provides.</p>`
        },
        {
          type: 'text',
          content: `<p>A significant portion of clients on psychiatric medication do not experience the clean trajectory implied by a typical treatment timeline: start medication, wait several weeks, feel substantially better. For many clients, the actual path involves a first medication that helps only partially or not at all, a dose adjustment that helps somewhat more, a switch to a different agent, an added second medication, and, for a meaningful subset of clients, months or years of this iterative process without ever reaching full symptom remission. Counselors who understand the basic landscape of what happens when medications "aren't working," including the vocabulary prescribers use to describe it, the general categories of next steps a prescriber might consider, and the ways counselors can support clients through this frequently demoralizing process, provide substantially more useful support than counselors who can only respond to a client's frustration with generic encouragement to "stay hopeful."</p>
<p><strong>Treatment-resistant depression</strong> is the clinical term most commonly used when a client's major depressive episode has not adequately responded to an adequate trial, typically meaning an adequate dose for an adequate duration, of two or more different antidepressant medications. The landmark STAR*D trial, one of the largest real-world antidepressant effectiveness studies ever conducted, found that remission rates declined with each successive treatment step: roughly a third of participants remitted on their first medication trial, and cumulative remission rates continued to rise with additional treatment steps, but at a diminishing rate, while relapse risk correspondingly rose for those who required more steps to reach remission (Rush et al., 2006). This research finding carries an important clinical message that counselors can responsibly share with struggling clients: needing a second, third, or fourth medication trial is common, not a sign of an unusually severe or untreatable illness, and remission remains a realistic goal even after earlier trials have failed. At the same time, counselors should not minimize how genuinely difficult and demoralizing repeated treatment failure is for clients living through it, particularly when each unsuccessful trial takes six to eight weeks to fairly evaluate, meaning months can pass between initial treatment-seeking and a workable medication regimen.</p>
<p><strong>Augmentation strategies</strong> represent one common next step when a first-line antidepressant provides partial but insufficient benefit. Rather than discontinuing the partially effective medication and starting over, a prescriber may add a second agent specifically to boost or complement the first medication's effect. Common augmentation strategies include adding a low dose of an atypical antipsychotic such as aripiprazole or quetiapine to an antidepressant (both are FDA-approved specifically for this augmentation indication), adding lithium at a lower dose than used for bipolar disorder (a strategy with a long clinical track record, sometimes called lithium augmentation), adding a second antidepressant from a different class to target complementary neurotransmitter systems, adding a thyroid hormone (typically T3/liothyronine) even in clients with normal thyroid function, based on evidence that it can potentiate antidepressant response through mechanisms still not fully understood, or adding a psychostimulant in select cases where fatigue and cognitive slowing are prominent. It is important for counselors to understand augmentation at this conceptual level, what it is and why a prescriber might pursue it, without venturing into recommending it; a client who mentions their prescriber suggested "adding something to the Zoloft" benefits from a counselor who can normalize this as a well-established, evidence-based clinical strategy rather than something that sounds alarming or experimental (Fava, 2003).</p>
<p>Beyond augmentation, prescribers also consider <strong>switching strategies</strong> (moving from one medication to a different one, sometimes within the same class and sometimes to a mechanistically different class entirely), <strong>combination strategies</strong> (using two full-dose antidepressants simultaneously rather than one primary agent plus a lower-dose augmenting agent), and, for genuinely treatment-resistant cases, more intensive interventions including electroconvulsive therapy, transcranial magnetic stimulation, and ketamine or esketamine treatment, the glutamatergic mechanism introduced earlier in this course, now established as a rapidly acting option specifically for treatment-resistant depression. Counselors do not need comprehensive expertise in any of these interventions, but a basic working familiarity allows a counselor to respond to a client who has just been told they may be a candidate for TMS or ketamine treatment with informed, calm psychoeducation rather than visible surprise or uncertainty, an important difference for a client who is often already anxious about what it means that "regular" treatment has not worked.</p>
<p>Counselors play a genuinely important role in supporting clients through medication changes themselves, independent of which specific strategy a prescriber has chosen. Any medication switch or addition reintroduces uncertainty, a new onset-of-action waiting period, potentially new side effects to adjust to, and often a renewed sense of disappointment or grief that the previous medication did not work as hoped. Normalizing this emotional experience, rather than treating a medication change as a purely logistical event, is genuinely clinical work. It can help to explicitly name the grief involved: clients frequently describe feeling like they are "starting over" after investing weeks or months of hope in a medication trial that ultimately did not deliver, and acknowledging that experience as a real loss, rather than rushing past it toward practical next steps, supports the therapeutic relationship and the client's continued engagement with treatment. Counselors can also help clients track and articulate their response to a new medication or dose in a way that produces genuinely useful information for the prescriber, since prescribers typically have only the client's own retrospective report from a brief appointment to go on; a client who has kept even an informal record, discussed collaboratively in counseling sessions, of mood, sleep, side effects, and functioning across the weeks of a medication trial can provide their prescriber with considerably richer information than a client relying on memory alone.</p>
<p><strong>Discontinuation syndrome</strong>, covered in clinical detail earlier in this course, deserves a final word in this context because it is frequently confused with treatment failure or relapse, sometimes by clients and, occasionally, by clinicians without pharmacological training. A client who abruptly stops or significantly reduces an antidepressant, whether because they ran out, because they decided unilaterally to stop, or because a prescriber tapered them too quickly, may develop the FINISH-pattern symptoms already described: dizziness, flu-like malaise, sensory disturbances, sleep disruption, and heightened emotional reactivity. When this happens during a period when a client and prescriber are actively adjusting medications, precisely the period discussed throughout this section, it becomes especially important to distinguish discontinuation symptoms of the medication just stopped from a genuine return of depressive or anxiety symptoms, from a lack of efficacy of a newly started medication, and from an entirely new problem. Counselors who understand this distinction can ask clarifying questions that genuinely help sort out what is happening: When exactly did the new symptoms start relative to the medication change? Do they resemble the client's usual depression or anxiety symptoms, or do they have a distinct, more physical, more acute quality? Are there sensory symptoms like the "brain zap" sensation specifically associated with discontinuation rather than relapse? These questions, asked with genuine clinical curiosity rather than diagnostic certainty, help both the client and, when relayed appropriately, the prescriber understand what is actually happening during a vulnerable and confusing transitional period, and they exemplify precisely the kind of pharmacologically informed, scope-appropriate support this course has aimed to build throughout.</p>
<p>Before a prescriber concludes that a client has genuinely treatment-resistant depression, clinical guidelines emphasize ruling out what is sometimes called <strong>pseudo-resistance</strong>, situations in which a medication trial appeared unsuccessful for reasons other than true pharmacological non-response. Common contributors to pseudo-resistance include inadequate dose (a trial stopped or evaluated before reaching a genuinely therapeutic dose), inadequate duration (concluding a medication "didn't work" at three weeks, before the typical four-to-six-week window needed for a fair trial), inconsistent adherence that was never disclosed to the prescriber, an unrecognized substance use issue actively undermining treatment response, an unaddressed medical condition such as untreated hypothyroidism or a vitamin deficiency that can mimic or worsen depressive symptoms, or a misdiagnosis, for example an underlying bipolar disorder treated as unipolar depression, in which standard antidepressant monotherapy is unlikely to produce durable improvement and can occasionally destabilize mood. Counselors are frequently the clinician best positioned to notice several of these contributors, since ongoing weekly contact reveals patterns a prescriber seeing a client quarterly may never observe directly: a client who quietly stopped taking their medication three weeks ago but did not mention it at their last prescriber visit, a client whose reported "depression not improving" actually looks, on closer clinical observation, like escalating cannabis use, or a client whose mood history includes distinct hypomanic periods never previously disclosed to a prescriber who has only ever seen them depressed. Raising these observations with the client, and encouraging the client to share them with their prescriber, or sharing them directly with appropriate releases in place, can meaningfully redirect a treatment course that might otherwise be mislabeled as resistant when the underlying issue is something else entirely.</p>
<p>Throughout this entire process, perhaps the single most valuable thing a counselor offers a client navigating a difficult, iterative medication journey is simply continuity: a consistent, informed, non-judgmental presence across a process that can otherwise feel fragmented, discouraging, and lonely. Prescriber appointments are often brief and spaced weeks or months apart; a client cycling through multiple medication trials may see several different prescribers if insurance coverage or provider availability changes; and the emotional weight of repeated disappointment can erode a client's motivation to continue seeking treatment at all. A counselor who tracks this journey alongside the client, who remembers what was tried before and how the client responded, who can gently distinguish discouragement from genuine hopelessness requiring a safety conversation, and who consistently reinforces that treatment-resistant does not mean untreatable, provides a form of support that no single prescriber appointment can replicate. This is, in the end, the clearest illustration of why psychopharmacology literacy belongs in counselor training: not to turn counselors into prescribers, but to ensure that the clinician who sees a struggling client most often is equipped to understand, normalize, and meaningfully support the full arc of that client's pharmacological treatment, from first prescription through however many steps it ultimately takes to find what works.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Supporting Medication Adherence Through Motivational Interviewing',
              content: `<p>Motivational interviewing (MI) is the most empirically supported counseling approach for addressing ambivalence about medication adherence. MI approaches medication ambivalence as expected and clinically meaningful — not a compliance failure but a signal about the client's experience of the medication, its side effects, its meaning, and their sense of autonomy. Reflective listening, affirmation, and open questions create space for the client to voice concerns they may be reluctant to raise with their prescriber. Decisional balancing — explicitly exploring both the benefits and costs of medication — helps clients clarify their own values rather than responding to external pressure. Change talk elicited through "What would be different if the medication was helping the way you hoped?" or "What has been better since you started the medication, even if there are also things that are harder?" invites clients to name their own reasons for continued engagement. Avoid arguing for medication compliance — the MI evidence consistently demonstrates that this produces reactance and reduces adherence.</p>`
            },
            {
              title: 'When to Contact the Prescriber: A Decision Framework',
              content: `<p>Counselors should contact the client's prescriber — after obtaining appropriate releases of information — when: (1) the client reports significant new or worsening symptoms that may be medication-related (e.g., new tremor, new cognitive changes, severe new anxiety, new mood destabilization); (2) the client discloses plans to discontinue medication abruptly or has already done so; (3) the counselor observes clinical changes inconsistent with the stated medication indication (e.g., significant worsening in a client whose medication is documented as effective); (4) the client reports combining their psychiatric medication with substances that carry known interaction risks; (5) the counselor is concerned about a potential medical emergency such as serotonin syndrome or lithium toxicity; (6) treatment is plateauing and the counselor wants to coordinate a comprehensive review. Contact should be timely, professional, and information-sharing rather than directive. Document all prescriber contacts and their outcomes in the clinical record.</p>`
            },
            {
              title: 'Common Supplements with Psychiatric Medication Interactions',
              content: `<p>Clients frequently do not mention supplements because they do not think of them as "medications." Several supplements have clinically significant interactions: St. John's Wort (Hypericum perforatum) induces CYP3A4 (reducing plasma levels of many drugs) and increases serotonin activity (serotonin syndrome risk with SSRIs/MAOIs); Omega-3 fatty acids at high doses (>3 g/day) increase bleeding risk when combined with blood thinners or antiplatelet agents; Ginkgo biloba increases bleeding risk; Valerian root enhances GABA activity and can produce additive sedation with benzodiazepines, Z-drugs, or alcohol; Melatonin at high doses can interact with antidepressants; Kava has sedative properties and hepatotoxicity risk when combined with other hepatically metabolized medications. A systematic question at intake and periodically thereafter — "Are you taking any vitamins, minerals, herbal supplements, or OTC medications?" — is a clinical best practice.</p>`
            },
            {
              title: 'Medication-Assisted Treatment (MAT) for Substance Use Disorders',
              content: `<p>Medications for substance use disorders — buprenorphine/naloxone (Suboxone), methadone, and naltrexone (Vivitrol) for opioid use disorder; naltrexone, acamprosate (Campral), and disulfiram (Antabuse) for alcohol use disorder; varenicline (Chantix) and bupropion (Zyban) for tobacco use disorder — are evidence-based treatments that counselors increasingly encounter in integrated care settings. MAT significantly reduces mortality in opioid use disorder. Counselors should understand that buprenorphine is a partial mu-opioid receptor agonist and that clients on buprenorphine are in active, evidence-based treatment, not simply substituting one addiction for another — a framing that is clinically inaccurate and stigmatizing. Naltrexone blocks opioid and alcohol craving and is an appropriate choice for clients motivated to abstain; it must not be given to clients who have opioid dependence without full opioid detoxification first, as it will precipitate immediate severe withdrawal. Disulfiram (Antabuse) produces an aversive reaction to alcohol — flushing, nausea, vomiting, tachycardia — and requires that clients be fully informed and consenting, as inadvertent alcohol exposure (in cough syrup, cooking wine, mouthwash) can trigger a reaction.</p>`
            },
            {
              title: 'Documentation Best Practices for Medication-Informed Counseling',
              content: `<p>Clinical documentation should reflect the counselor's medication-informed clinical observations without exceeding scope. Appropriate documentation includes: the medications the client reports taking, any reported side effects or adherence challenges, psychoeducation provided during the session, referrals or recommendations to contact the prescriber, prescriber contacts made and their outcomes, and clinical rationale for flagging medication concerns. Avoid documentation that implies prescribing authority or clinical medication management (e.g., "client's sertraline dose appears inadequate" — instead: "client reports no improvement in depressive symptoms after 8 weeks of sertraline at 50 mg; referred to prescriber for medication review"). Documentation of medication-related conversations provides legal protection and demonstrates the standard of care for medication-informed counseling practice.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Therapeutic Alliance as Adherence Infrastructure',
          content: `<p>The single strongest predictor of medication adherence across psychiatric diagnoses is not the severity of the disorder, not the side effect profile of the medication, and not the client's insight into their diagnosis. It is the quality of the relationship with the treating clinician. For many clients, that relationship is strongest with their counselor, who they see weekly over months or years. This makes the counselor's role in medication adherence not peripheral but central — not because the counselor manages the medication, but because the counselor manages the relationship that determines whether the client stays engaged with treatment at all.</p>`,
          image: '',
          imageAlt: 'Illustration of counselor and client in therapeutic conversation with medication as shared topic',
          imagePosition: 'left'
        },
        {
          type: 'fillInBlank',
          title: 'Scope of Practice — Complete the Statement',
          blanks: [
            {
              before: 'A licensed counselor who is NOT a prescriber may appropriately provide',
              answer: 'psychoeducation',
              after: 'about common side effects of psychiatric medications to support client understanding and adherence.'
            },
            {
              before: 'When a client reports combining their SSRI with St. John\'s Wort, the counselor should recognize the risk of',
              answer: 'serotonin syndrome',
              after: 'and encourage the client to discuss this combination with their prescriber.'
            },
            {
              before: 'The FINISH mnemonic stands for Flu-like symptoms, Insomnia, Nausea, Imbalance,',
              answer: 'Sensory disturbances',
              after: '(particularly brain zaps), and Hyperarousal — the core symptoms of SSRI/SNRI discontinuation syndrome.'
            },
            {
              before: 'Cultural factors such as medical mistrust, religious beliefs about healing, and family attitudes toward medication affect medication',
              answer: 'adherence',
              after: 'and require a culturally humble, individualized exploration rather than stereotyped assumptions.'
            }
          ]
        },
        {
          type: 'reflection',
          question: 'Think about a current or past client who was prescribed a psychiatric medication during your work together. What did you know at the time about that medication — its mechanism, common side effects, adherence considerations? What do you know now that you wish you had known then? How might that additional knowledge have changed a specific conversation or clinical decision? What will you do differently in your practice going forward?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 4',
          takeaways: [
            'Medication non-adherence — affecting approximately 50% of antidepressant users within 3 months — is driven by side effects, stigma, cost, cultural beliefs, lack of perceived efficacy, and ambivalence about recovery. Exploration and collaborative problem-solving outperform compliance enforcement.',
            'Counselors\' scope of practice permits psychoeducation, adherence support, clinical monitoring of medication effects, prescriber consultation, and recognizing potential emergencies. It does not include prescribing, recommending specific medications or doses, or advising discontinuation.',
            'Cultural factors — including medical mistrust, spiritual frameworks, familismo, and stigma — are central determinants of medication acceptance and adherence. Cultural humility and individualized exploration are required; demographic stereotyping is not sufficient.',
            'Several OTC supplements — particularly St. John\'s Wort (serotonin augmentation + CYP3A4 induction), valerian (additive GABA sedation), and ginkgo biloba (bleeding risk) — have clinically significant interactions with psychiatric medications that clients frequently do not disclose without direct inquiry.',
            'Effective prescriber communication is a clinical skill: specific, timely, information-sharing rather than directive. Counselors who communicate observed clinical changes — not medication recommendations — to prescribers serve their clients while maintaining appropriate scope boundaries.',
            'The therapeutic relationship is the strongest predictor of medication adherence. Counselors, through sustained weekly relationships, have unparalleled leverage to support the medication engagement decisions that determine whether pharmacological treatment succeeds.'
          ]
        },
        {
          type: 'resources',
          title: 'Resources and Further Reading',
          resources: [
            {
              title: 'Stahl\'s Essential Psychopharmacology Online (Cambridge University Press)',
              url: 'https://stahlonline.cambridge.org',
              type: 'website',
              description: 'The digital companion to Stephen Stahl\'s Essential Psychopharmacology — includes drug prescriber\'s guides, neuroscience illustrations, and self-assessments. The most comprehensive online psychopharmacology reference for mental health professionals.'
            },
            {
              title: 'SAMHSA — Medications for Mental Health',
              url: 'https://www.samhsa.gov/mental-health/mental-health-care/medications',
              type: 'website',
              description: 'SAMHSA\'s consumer and clinician resource on psychiatric medications, including patient guides for depression, bipolar disorder, PTSD, and schizophrenia. Free, accessible, appropriate for client psychoeducation.'
            },
            {
              title: 'Prescriber\'s Digital Reference (PDR) — Online Drug Information',
              url: 'https://www.pdr.net',
              type: 'website',
              description: 'Comprehensive prescribing information, drug interaction checker, and clinical monographs. Useful for counselors to look up specific medications clients are taking and verify interaction concerns before consulting with prescribers.'
            },
            {
              title: 'NBCC — Counseling Supervision and Psychopharmacology (Position Statement)',
              url: 'https://www.nbcc.org/Assets/Ethics/internet.pdf',
              type: 'website',
              description: 'NBCC ethics documents and position statements relevant to the counselor\'s role in medication-related clinical situations. Essential reading for scope of practice clarification.'
            },
            {
              title: 'Clozapine REMS Program — Clinician and Patient Resources',
              url: 'https://www.clozapinerems.com',
              type: 'website',
              description: 'Official REMS program site for clozapine. Includes monitoring requirements, patient enrollment, and safety information. Counselors working with clients on clozapine should be familiar with the monitoring requirements.'
            },
            {
              title: 'Epocrates Drug Reference App (Doximity)',
              url: 'https://www.epocrates.com',
              type: 'website',
              description: 'Mobile drug reference app with drug interaction checker. Widely used by clinical professionals. The free version includes drug monographs and interaction checking — useful for counselors preparing for sessions with medicated clients.'
            },
            {
              title: 'CredibleMeds — Drug-Induced Arrhythmia Risk',
              url: 'https://crediblemeds.org',
              type: 'website',
              description: 'Database of drugs with known or suspected risk of causing QT interval prolongation and torsades de pointes arrhythmia. Several psychiatric medications are on this list. Relevant for counselors whose clients take multiple medications.'
            }
          ]
        }
      ]
    }
  ],

  // ─── ASSESSMENT ────────────────────────────────────────────────────────────
  assessment: {
    questions: [
      {
        type: 'multipleChoice',
        question: 'Which neurotransmitter pathway is primarily responsible for the antipsychotic therapeutic effect on positive symptoms of schizophrenia?',
        options: [
          { text: 'Nigrostriatal dopamine pathway', isCorrect: false },
          { text: 'Mesolimbic dopamine pathway', isCorrect: true },
          { text: 'Tuberoinfundibular dopamine pathway', isCorrect: false },
          { text: 'Mesocortical dopamine pathway', isCorrect: false }
        ],
        explanation: 'The mesolimbic pathway (VTA to nucleus accumbens) mediates reward and reinforcement — and its dysregulation is associated with positive psychotic symptoms (hallucinations, delusions). D2 receptor blockade here produces the antipsychotic therapeutic effect. The nigrostriatal pathway blockade produces EPS; the tuberoinfundibular pathway blockade produces hyperprolactinemia.'
      },
      {
        type: 'multipleChoice',
        question: 'A client reports that they have been taking their prescribed paroxetine (Paxil) for 6 months but ran out 3 days ago and cannot refill until tomorrow. They are experiencing dizziness, nausea, and what they describe as "electric shocks in my head." The counselor\'s most appropriate clinical response is to:',
        options: [
          { text: 'Advise the client to start taking another SSRI from a previous prescription to avoid withdrawal', isCorrect: false },
          { text: 'Recognize this as likely SSRI discontinuation syndrome and advise the client to contact their prescriber about an emergency refill', isCorrect: true },
          { text: 'Diagnose the client with medication-induced anxiety disorder', isCorrect: false },
          { text: 'Reassure the client that these symptoms indicate the medication is no longer needed', isCorrect: false }
        ],
        explanation: 'Dizziness, nausea, and "brain zaps" (electrical shock sensations) appearing 2–3 days after stopping paroxetine are classic presentations of SSRI discontinuation syndrome — described by the FINISH mnemonic. Paroxetine has one of the highest discontinuation syndrome risks among SSRIs due to its short half-life and potent SERT affinity. The appropriate response is to recognize the clinical picture and facilitate prescriber contact for an emergency refill, not to prescribe, diagnose, or misinterpret the symptom.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following BEST describes the pharmacological basis for the dangerous interaction between benzodiazepines and alcohol?',
        options: [
          { text: 'Both substances block dopamine D2 receptors, producing additive extrapyramidal effects', isCorrect: false },
          { text: 'Both substances enhance GABA-A receptor activity, producing synergistic CNS and respiratory depression', isCorrect: true },
          { text: 'Alcohol inhibits CYP3A4, raising benzodiazepine plasma levels', isCorrect: false },
          { text: 'Both substances inhibit serotonin reuptake, producing serotonin syndrome', isCorrect: false }
        ],
        explanation: 'Benzodiazepines and alcohol both enhance GABA-A receptor activity — producing synergistic (multiplicative, not merely additive) CNS depression and respiratory depression. The combination can suppress the respiratory drive sufficiently to cause respiratory arrest and death, particularly at higher doses or in clients with compromised respiratory function. This is the pharmacological basis for the clinical prohibition on mixing these substances.'
      },
      {
        type: 'multipleChoice',
        question: 'A client with bipolar I disorder who has been stable on lithium for two years reports they have had severe diarrhea and vomiting for three days. Today in session they are unusually confused and have a noticeable tremor. The counselor\'s most appropriate immediate response is:',
        options: [
          { text: 'Document the report and address it at the client\'s next scheduled appointment in one week', isCorrect: false },
          { text: 'Reassure the client that these symptoms are likely related to the GI illness and encourage fluid intake', isCorrect: false },
          { text: 'Recognize possible lithium toxicity and facilitate immediate prescriber contact or emergency evaluation', isCorrect: true },
          { text: 'Recommend the client stop lithium until the GI illness resolves to allow the body to recover', isCorrect: false }
        ],
        explanation: 'Confusion and tremor following three days of GI illness in a lithium-maintained client is a presentation consistent with lithium toxicity. Dehydration from vomiting and diarrhea reduces renal clearance of lithium, causing plasma levels to rise — sometimes into the toxic range. This is a medical urgency requiring immediate prescriber contact or emergency evaluation. Counselors should not recommend stopping lithium (outside scope) nor should they reassure the client without raising this clinical concern with the prescriber.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following represents the MOST accurate description of tardive dyskinesia (TD)?',
        options: [
          { text: 'An acute dystonic reaction occurring within hours of starting an antipsychotic, characterized by involuntary eye deviation and neck stiffness', isCorrect: false },
          { text: 'A late-onset movement disorder characterized by repetitive involuntary movements, typically orofacial, occurring after months to years of antipsychotic exposure and potentially irreversible', isCorrect: true },
          { text: 'Subjective inner restlessness and compulsive need to move, frequently misidentified as anxiety worsening', isCorrect: false },
          { text: 'Antipsychotic-induced symptoms that resemble Parkinson\'s disease, including rigidity, tremor, and masked facies', isCorrect: false }
        ],
        explanation: 'Tardive dyskinesia is a late-onset (months to years) movement disorder associated with chronic D2 receptor blockade. It is characterized by repetitive, involuntary movements — classically orofacial (lip smacking, tongue movements, jaw movements) but also affecting the trunk and extremities. Crucially, TD may persist or be permanent even after the antipsychotic is discontinued. The other options describe acute dystonia (option A), akathisia (option C), and pseudoparkinsonism (option D).'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following drug combinations carries the highest risk of precipitating serotonin syndrome?',
        options: [
          { text: 'Lithium + valproate', isCorrect: false },
          { text: 'SSRI + MAOI', isCorrect: true },
          { text: 'Benzodiazepine + SSRI', isCorrect: false },
          { text: 'Stimulant + mood stabilizer', isCorrect: false }
        ],
        explanation: 'The combination of an SSRI and an MAOI (monoamine oxidase inhibitor) is the combination most likely to produce severe or fatal serotonin syndrome. SSRIs block SERT reuptake (increasing synaptic serotonin), while MAOIs block the enzyme that breaks down serotonin (further increasing serotonin). The combined effect produces extreme serotonergic excess. Standard practice requires a washout period of at least 14 days when switching between these classes (5 weeks when switching FROM fluoxetine, due to its long half-life).'
      },
      {
        type: 'multipleChoice',
        question: 'Clozapine (Clozaril) requires mandatory enrollment in a Risk Evaluation and Mitigation Strategy (REMS) program. The primary safety concern driving this requirement is:',
        options: [
          { text: 'High risk of tardive dyskinesia compared to other antipsychotics', isCorrect: false },
          { text: 'Risk of agranulocytosis — a potentially fatal reduction in white blood cells requiring regular ANC monitoring', isCorrect: true },
          { text: 'Extremely high risk of lithium-like toxicity requiring blood level monitoring', isCorrect: false },
          { text: 'Risk of Stevens-Johnson syndrome requiring rash monitoring', isCorrect: false }
        ],
        explanation: 'Clozapine carries a 1–2% risk of agranulocytosis — a dangerous suppression of white blood cell production that leaves clients severely immunocompromised. The Clozapine REMS program mandates regular absolute neutrophil count (ANC) monitoring: weekly for the first 6 months, biweekly for months 7–12, then monthly thereafter. Clozapine actually has LOWER EPS and TD risk than typical antipsychotics — a key clinical advantage. Clozapine does not have a lithium-like narrow therapeutic index issue, and Stevens-Johnson syndrome is associated with lamotrigine, not clozapine.'
      },
      {
        type: 'multipleChoice',
        question: 'A client on sertraline (Zoloft) 100mg tells you they have been taking St. John\'s Wort for the past two weeks because they read it was "natural" and would help with depression. The counselor\'s appropriate clinical response includes:',
        options: [
          { text: 'Reassuring the client that herbal supplements are safe because they are natural and not pharmaceuticals', isCorrect: false },
          { text: 'Instructing the client to stop both sertraline and St. John\'s Wort immediately', isCorrect: false },
          { text: 'Educating the client that this combination can increase serotonin activity and create risk of serotonin syndrome, and encouraging prescriber contact', isCorrect: true },
          { text: 'Providing written documentation of the interaction to the client and closing the case', isCorrect: false }
        ],
        explanation: 'St. John\'s Wort augments serotonin activity through multiple mechanisms and, when combined with an SSRI like sertraline, creates excess serotonergic stimulation and risk of serotonin syndrome. The counselor should provide psychoeducation about this specific interaction, advise against continuing the combination, and facilitate prescriber contact — but should not instruct abrupt discontinuation of the prescription medication (outside scope) or minimize the risk with reassurance. Documenting and following up appropriately is part of the clinical response.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is WITHIN the appropriate scope of practice for a licensed counselor who is NOT a prescriber?',
        options: [
          { text: 'Recommending that a client increase their antidepressant dose because treatment is not working', isCorrect: false },
          { text: 'Advising a client to stop their benzodiazepine because counseling alone should be sufficient', isCorrect: false },
          { text: 'Providing psychoeducation about SSRI activation syndrome before a client starts a newly prescribed SSRI', isCorrect: true },
          { text: 'Prescribing buspirone as an alternative to the client\'s current alprazolam prescription', isCorrect: false }
        ],
        explanation: 'Providing psychoeducation about medication effects — including explaining activation syndrome and what to expect in the first weeks of SSRI treatment — is explicitly within counselor scope of practice and is an evidence-supported intervention that improves medication adherence and outcomes. Recommending dose changes, advising discontinuation, and prescribing are all outside non-prescriber scope of practice.'
      },
      {
        type: 'multipleChoice',
        question: 'Cannabis smoke (combusted, inhaled THC) induces which CYP enzyme, and what is the clinical significance for a client taking clozapine?',
        options: [
          { text: 'Inhibits CYP2D6, potentially raising clozapine plasma levels to toxic range', isCorrect: false },
          { text: 'Induces CYP1A2, accelerating clozapine metabolism and potentially reducing its plasma level', isCorrect: true },
          { text: 'Inhibits CYP3A4, blocking clozapine elimination and producing toxicity', isCorrect: false },
          { text: 'Induces CYP2C19, reducing the efficacy of concurrent SSRI medications', isCorrect: false }
        ],
        explanation: 'Cannabis smoke (not oral cannabis/edibles, but smoked/combusted cannabis) is a CYP1A2 inducer. Clozapine is primarily metabolized by CYP1A2. Clients who smoke cannabis heavily while taking clozapine may have significantly reduced clozapine plasma levels — potentially below therapeutic range — because the induced enzyme accelerates clozapine metabolism. Clients who abruptly stop smoking cannabis (e.g., while hospitalized) may experience a spike in clozapine plasma levels as the CYP1A2 induction fades. Counselors working with clients on clozapine who use cannabis should ensure the prescriber is aware of cannabis use patterns.'
      },
      {
        type: 'multipleChoice',
        question: 'Which mood stabilizer is specifically contraindicated in clients with a seizure disorder — and why?',
        options: [
          { text: 'Lithium — because its narrow therapeutic index makes seizure monitoring impossible', isCorrect: false },
          { text: 'Valproate — because it reduces seizure threshold through GABA modulation', isCorrect: false },
          { text: 'Bupropion — because it has dose-dependent seizure risk, particularly in clients with predisposing conditions', isCorrect: true },
          { text: 'Lamotrigine — because it is only FDA-approved for mood stabilization, not seizure disorders', isCorrect: false }
        ],
        explanation: 'Bupropion (Wellbutrin) carries a dose-dependent risk of seizures. It is contraindicated in clients with a known seizure disorder and in clients with bulimia or anorexia (because electrolyte imbalances from purging lower seizure threshold). Importantly, valproate and lamotrigine are both FDA-approved anticonvulsants — they reduce seizure risk rather than increasing it. Lithium does not have a specific seizure contraindication in the same category.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following BEST describes the mechanism by which fluoxetine (Prozac) can raise the plasma levels of concurrently prescribed tricyclic antidepressants (TCAs)?',
        options: [
          { text: 'Fluoxetine induces CYP1A2, accelerating TCA production in the liver', isCorrect: false },
          { text: 'Fluoxetine inhibits CYP2D6, reducing TCA metabolism and allowing plasma TCA levels to accumulate', isCorrect: true },
          { text: 'Fluoxetine binds to plasma albumin and displaces TCAs, increasing unbound TCA concentration', isCorrect: false },
          { text: 'Fluoxetine alkalinizes renal pH, reducing TCA renal clearance', isCorrect: false }
        ],
        explanation: 'Fluoxetine (and paroxetine) are potent inhibitors of CYP2D6 — the cytochrome P450 enzyme responsible for metabolizing many TCAs. When CYP2D6 is inhibited by fluoxetine, TCA metabolism slows, and plasma TCA levels accumulate — potentially reaching toxic ranges. TCAs have cardiac toxicity risk in overdose, so this interaction can be clinically dangerous. This is a pharmacokinetic drug-drug interaction at the level of hepatic metabolism.'
      },
      {
        type: 'multipleChoice',
        question: 'A counselor working with a client who has treatment-resistant schizophrenia notices that the client has not attended their REMS blood testing for the past three weeks and their clozapine was accordingly placed on hold. The MOST clinically appropriate counselor action is to:',
        options: [
          { text: 'Reassure the client that the REMS monitoring is excessive bureaucracy and help them advocate with the prescriber for exemption', isCorrect: false },
          { text: 'Explore barriers to blood test attendance and problem-solve access issues, while reinforcing why the monitoring protects their safety', isCorrect: true },
          { text: 'Recommend that the client switch to a different antipsychotic without the monitoring burden', isCorrect: false },
          { text: 'Contact the prescriber to request that monitoring be extended to every 6 months for this client', isCorrect: false }
        ],
        explanation: 'The REMS monitoring for clozapine is mandatory and cannot be exempted — it exists because agranulocytosis risk is real and potentially fatal. The counselor\'s appropriate role is to explore and problem-solve the practical barriers to accessing blood testing (transportation, cost, scheduling, health literacy about why it matters) and reinforce the protective rationale in a non-alarmist but honest way. Recommending a medication switch or contacting the prescriber to reduce monitoring frequency are outside scope and clinically inappropriate.'
      },
      {
        type: 'multipleChoice',
        question: 'A client with opioid use disorder who is stable on buprenorphine/naloxone (Suboxone) says their family is pressuring them to stop Suboxone because "it is just trading one drug for another." The counselor\'s most therapeutically appropriate response is to:',
        options: [
          { text: 'Agree with the family\'s concern and help the client plan a buprenorphine taper', isCorrect: false },
          { text: 'Avoid the topic to preserve the therapeutic relationship', isCorrect: false },
          { text: 'Validate the family\'s concern while providing accurate psychoeducation that buprenorphine is a partial opioid agonist that is evidence-based treatment reducing mortality, not a substitution addiction', isCorrect: true },
          { text: 'Refer the client to a different treatment program that does not use MAT', isCorrect: false }
        ],
        explanation: 'Buprenorphine/naloxone is a partial mu-opioid receptor agonist that reduces cravings, prevents withdrawal, and significantly reduces mortality in opioid use disorder. The "trading one drug for another" framing reflects common stigma, not clinical accuracy. The counselor\'s role is to gently provide accurate psychoeducation — that MAT is an evidence-based medical treatment comparable to insulin for diabetes — while validating that the family\'s concern comes from care. The counselor should not agree with clinically inaccurate stigmatizing framing, should not avoid the topic, and should not facilitate unnecessary discontinuation of effective treatment.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is NOT an expected component of SSRI discontinuation syndrome (FINISH)?',
        options: [
          { text: 'Brain zaps (brief electrical shock sensations in the head)', isCorrect: false },
          { text: 'Flu-like symptoms and nausea', isCorrect: false },
          { text: 'Drug craving and compulsive medication-seeking behavior', isCorrect: true },
          { text: 'Dizziness and balance disturbance', isCorrect: false }
        ],
        explanation: 'SSRI discontinuation syndrome includes Flu-like symptoms, Insomnia, Nausea, Imbalance (dizziness/vertigo), Sensory disturbances (brain zaps), and Hyperarousal. Drug craving and compulsive medication-seeking behavior — the hallmarks of addiction — are NOT part of discontinuation syndrome. This distinction is clinically important: discontinuation syndrome reflects the brain\'s neuroadaptation to changed serotonergic tone, not psychological addiction or dependence. Confusing the two contributes to both stigma and clinical mismanagement.'
      }
    ],
    passingScore: 80
  },

  // ─── REFERENCES ────────────────────────────────────────────────────────────
  references: [
    'Preston, J. D., O\'Neal, J. H., & Talaga, M. C. (2021). <em>Handbook of clinical psychopharmacology for therapists</em> (9th ed.). New Harbinger Publications.',
    'Stahl, S. M. (2021). <em>Stahl\'s essential psychopharmacology: Neuroscientific basis and practical applications</em> (5th ed.). Cambridge University Press.',
    'Julien, R. M., Advokat, C. D., & Comaty, J. E. (2011). <em>A primer of drug action: A comprehensive guide to the actions, uses, and side effects of psychoactive drugs</em> (12th ed.). Worth Publishers.',
    'Sadock, B. J., Sadock, V. A., & Ruiz, P. (2017). <em>Kaplan & Sadock\'s comprehensive textbook of psychiatry</em> (10th ed.). Wolters Kluwer.',
    'Advokat, C. D., Comaty, J. E., & Julien, R. M. (2019). <em>Julien\'s primer of drug action</em> (14th ed.). Worth Publishers.',
    'American Psychiatric Association. (2013). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed.). American Psychiatric Publishing.',
    'Bezchlibnyk-Butler, K. Z., & Jeffries, J. J. (2020). <em>Clinical handbook of psychotropic drugs</em> (24th ed.). Hogrefe Publishing.',
    'Meyer, J. S., & Quenzer, L. F. (2018). <em>Psychopharmacology: Drugs, the brain, and behavior</em> (3rd ed.). Sinauer Associates.',
    'National Alliance on Mental Illness. (2023). <em>Mental health medications: An overview</em>. NAMI. https://www.nami.org/About-Mental-Illness/Treatments/Mental-Health-Medications',
    'Carvalho, A. F., Sharma, M. S., Brunoni, A. R., Vieta, E., & Fava, G. A. (2016). The safety, tolerability and risks associated with the use of newer generation antidepressant drugs: A critical review of the literature. <em>Psychotherapy and Psychosomatics, 85</em>(5), 270–288. https://doi.org/10.1159/000447034',
    'Howes, O. D., & Kapur, S. (2009). The dopamine hypothesis of schizophrenia: Version III — the final common pathway. <em>Schizophrenia Bulletin, 35</em>(3), 549–562. https://doi.org/10.1093/schbul/sbp006',
    'Rosenbaum, J. F., Zajecka, J., & Fava, M. (1998). Discontinuation symptoms after abrupt cessation of antidepressant therapy. <em>Journal of Clinical Psychiatry, 59</em>(Suppl. 15), 3–10.',
    'Boyer, E. W., & Shannon, M. (2005). The serotonin syndrome. <em>New England Journal of Medicine, 352</em>(11), 1112–1120. https://doi.org/10.1056/NEJMra041867',
    'Patel, K. R., Cherian, J., Gohil, K., & Atkinson, D. (2014). Schizophrenia: Overview and treatment options. <em>Pharmacy and Therapeutics, 39</em>(9), 638–645.',
    'Mitchell, A. J., & Selmes, T. (2007). Why don\'t patients take their medicine? Reasons and solutions in psychiatry. <em>Advances in Psychiatric Treatment, 13</em>(5), 336–346. https://doi.org/10.1192/apt.bp.106.003194',
    'Alvarez-Jimenez, M., Priede, A., Hetrick, S. E., Bendall, S., Killackey, E., Parker, A. G., McGorry, P. D., & Gleeson, J. F. (2012). Risk factors for relapse following treatment for first episode psychosis: A systematic review and meta-analysis of longitudinal studies. <em>Schizophrenia Research, 139</em>(1–3), 116–128. https://doi.org/10.1016/j.schres.2012.05.007',
    'Bhugra, D., & Bhui, K. (2018). Textbook of cultural psychiatry (2nd ed.). Cambridge University Press.',
    'National Institute of Mental Health. (2022). <em>Mental health medications</em>. NIMH. https://www.nimh.nih.gov/health/topics/mental-health-medications'
  ]
};

// ─── WORD COUNT UTILITY ────────────────────────────────────────────────────────
function countWords(obj) {
  let text = '';
  function extract(v) {
    if (typeof v === 'string') {
      text += ' ' + v.replace(/<[^>]+>/g, ' ');
    } else if (Array.isArray(v)) {
      v.forEach(extract);
    } else if (v && typeof v === 'object') {
      Object.values(v).forEach(extract);
    }
  }
  extract(obj);
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── VALIDATION ────────────────────────────────────────────────────────────────
function validate(course) {
  const errors = [];
  if (!course.courseCode) errors.push('Missing courseCode');
  if (!course.slug) errors.push('Missing slug');
  if (!course.title) errors.push('Missing title');
  if (!course.ceHours) errors.push('Missing ceHours');
  if (!course.sections || course.sections.length < 2) errors.push('Must have at least 2 sections');

  const VALID_BLOCK_TYPES = new Set([
    'accordion', 'callout', 'cardSort', 'clinicalVignette', 'deliverables',
    'fillInBlank', 'flashcardDeck', 'hotspot', 'image', 'imageText',
    'keyTakeaway', 'knowledgeCheck', 'matching', 'multiSelect', 'multipleChoice',
    'quiz', 'references', 'reflection', 'resources', 'scenarioTree',
    'sectionDivider', 'sequencing', 'text', 'timeline', 'video', 'videoEmbed'
  ]);

  course.sections.forEach((section, si) => {
    if (!section.title) errors.push(`Section ${si + 1} missing title`);
    if (!section.contentBlocks || section.contentBlocks.length === 0) {
      errors.push(`Section ${si + 1} has no content blocks`);
      return;
    }
    section.contentBlocks.forEach((block, bi) => {
      if (!block.type) errors.push(`Section ${si + 1}, block ${bi + 1}: missing type`);
      else if (!VALID_BLOCK_TYPES.has(block.type)) errors.push(`Section ${si + 1}, block ${bi + 1}: unknown type "${block.type}"`);

      if (block.type === 'multipleChoice' || block.type === 'multiSelect') {
        if (!block.options || !Array.isArray(block.options)) {
          errors.push(`Section ${si + 1}, block ${bi + 1} (${block.type}): missing options array`);
        } else {
          block.options.forEach((opt, oi) => {
            if (typeof opt.isCorrect !== 'boolean') {
              errors.push(`Section ${si + 1}, block ${bi + 1}, option ${oi + 1}: isCorrect must be boolean`);
            }
          });
        }
      }

      if (block.type === 'reflection' && !block.question) {
        errors.push(`Section ${si + 1}, block ${bi + 1}: reflection missing question field`);
      }

      if (block.type === 'keyTakeaway' && (!block.takeaways || !Array.isArray(block.takeaways))) {
        errors.push(`Section ${si + 1}, block ${bi + 1}: keyTakeaway missing takeaways array`);
      }

      if (block.type === 'flashcardDeck' && (!block.flashcards || !Array.isArray(block.flashcards))) {
        errors.push(`Section ${si + 1}, block ${bi + 1}: flashcardDeck missing flashcards array`);
      }

      if (block.type === 'matching' && !block.matchingPairs) {
        errors.push(`Section ${si + 1}, block ${bi + 1}: matching missing matchingPairs`);
      }

      if (block.type === 'cardSort') {
        if (!block.cards) errors.push(`Section ${si + 1}, block ${bi + 1}: cardSort missing cards`);
        if (!block.categories) errors.push(`Section ${si + 1}, block ${bi + 1}: cardSort missing categories`);
      }

      if (block.type === 'fillInBlank' && (!block.blanks || !Array.isArray(block.blanks))) {
        errors.push(`Section ${si + 1}, block ${bi + 1}: fillInBlank missing blanks array`);
      }
    });
  });

  if (!course.assessment || !course.assessment.questions || course.assessment.questions.length < 15) {
    errors.push('Assessment must have at least 15 questions');
  }

  if (!course.references || course.references.length < 15) {
    errors.push('Must have at least 15 references');
  }

  const wordCount = countWords(course);
  if (wordCount < 18000) {
    errors.push(`Word count ${wordCount} is below minimum 18,000`);
  }

  return errors;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const wordCount = countWords(COURSE);
  console.log(`\nCourse: ${COURSE.title}`);
  console.log(`Slug:   ${COURSE.slug}`);
  console.log(`Words:  ${wordCount.toLocaleString()}`);
  console.log(`CE hrs: ${COURSE.ceHours}`);
  console.log(`Sections: ${COURSE.sections.length}`);
  console.log(`Assessment questions: ${COURSE.assessment.questions.length}`);
  console.log(`References: ${COURSE.references.length}`);

  const errors = validate(COURSE);
  if (errors.length > 0) {
    console.error('\n❌ Validation errors:');
    errors.forEach(e => console.error('  •', e));
    process.exit(1);
  }
  console.log('\n✓ Validation passed');

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  const InteractiveCourse = mongoose.model('InteractiveCourse', new mongoose.Schema({}, { strict: false, collection: 'interactivecourses' }));

  const existing = await InteractiveCourse.findOne({ slug: SLUG });
  if (existing) {
    await InteractiveCourse.deleteOne({ _id: existing._id });
    console.log(`✓ Removed existing course: ${SLUG}`);
  }

  const doc = new InteractiveCourse(COURSE);
  await doc.save();
  console.log(`✓ Seeded: ${COURSE.title} (${SLUG})`);
  console.log(`  _id: ${doc._id}`);

  await mongoose.disconnect();
  console.log('✓ Done\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
