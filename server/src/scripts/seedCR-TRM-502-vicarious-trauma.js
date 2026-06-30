import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-trm-502-vicarious-trauma';

const COURSE = {
  courseCode: 'CR-TRM-502',
  title: 'Vicarious Trauma and Compassion Fatigue in Clinical Practice',
  slug: SLUG,
  description: 'This course helps mental health professionals recognize, assess, and address the occupational hazards of trauma work, including vicarious trauma, secondary traumatic stress, compassion fatigue, moral injury, and burnout. Using evidence-based frameworks including the Professional Quality of Life Scale (ProQOL) and constructivist self-development theory, clinicians will build concrete self-assessment and self-care strategies alongside understanding of systemic and organizational factors that influence practitioner wellness.',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  estimatedTime: 120,
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
    hourBreakdown: [{ label: 'core', hours: 2 }]
  }],
  isPublished: false,
  status: 'draft',
  sections: [
    {
      title: 'Introduction: The Cost of Caring',
      sectionNumber: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Vicarious Trauma and Compassion Fatigue in Clinical Practice',
          subtitle: 'Recognizing, assessing, and responding to the occupational hazards of trauma work',
          sectionNumber: 0
        },
        {
          type: 'text',
          content: `<p>Trauma work changes clinicians. This is not a sign of weakness or insufficient self-care — it is a natural consequence of sustained empathic engagement with human suffering. The mental health field has developed increasingly precise language for describing how this change manifests: vicarious trauma, secondary traumatic stress, compassion fatigue, burnout, and moral injury are overlapping but distinct constructs, each illuminating a different facet of what happens when clinicians are repeatedly exposed to the traumatic material and suffering of their clients.</p>
<p>Understanding these constructs is not merely an academic exercise. Clinicians who do not recognize the signs of occupational trauma in themselves are at risk of impaired practice, ethical violations, deteriorating relationships, and serious harm to their own mental and physical health. The ACA Code of Ethics (C.2.g) explicitly states that counselors must monitor themselves for signs of impairment and take action to address it. This is not optional professional courtesy — it is an ethics obligation.</p>
<p>This course will equip you with a conceptual framework for distinguishing among the major occupational hazard constructs, validated self-assessment tools, evidence-based individual and organizational strategies for prevention and recovery, and an understanding of the ethical and clinical implications of practitioner impairment. By the end of this course, you will be able to: (1) Distinguish vicarious trauma, secondary traumatic stress, compassion fatigue, burnout, and moral injury; (2) Use the ProQOL scale to assess your own wellness; (3) Identify evidence-based individual and organizational protective factors; (4) Apply the ACA ethics obligations regarding self-monitoring for impairment.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Understanding the Cost of Caring: An Introduction to Vicarious Trauma',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_vicarious_trauma_intro',
          description: 'An overview of how empathic engagement with traumatic material affects clinicians and why this is a recognized occupational hazard across helping professions.'
        },
        {
          type: 'imageText',
          title: 'The Compassion Fatigue Continuum',
          content: `<p>Occupational hazards in mental health practice exist on a continuum from normal empathic strain to serious clinical impairment. At one end, <strong>empathic strain</strong> is the temporary emotional cost of caring — the weight that settles after a particularly difficult session and lifts after rest, consultation, or exercise. In the middle of the continuum sit <strong>compassion fatigue</strong> and <strong>secondary traumatic stress</strong> — more persistent states characterized by emotional exhaustion, reduced empathy, and intrusive symptoms resembling PTSD. At the far end sits <strong>vicarious trauma</strong> — a deeper, schema-level shift in how the clinician understands the world, safety, trust, and human nature.</p>
<p>Recognizing where you are on this continuum at any given time — and having strategies for moving back toward health — is a core competency of sustainable clinical practice.</p>`,
          image: '',
          imageAlt: 'Continuum diagram showing empathic strain through compassion fatigue to vicarious trauma',
          imagePosition: 'left'
        }
      ]
    },
    {
      title: 'Defining the Constructs: From Burnout to Vicarious Trauma',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Defining the Constructs: From Burnout to Vicarious Trauma',
          subtitle: 'Distinguishing the major occupational hazard frameworks and their clinical implications',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>The proliferation of terms in this field — burnout, compassion fatigue, secondary traumatic stress, vicarious trauma, moral injury — reflects a genuine evolution in understanding how trauma work affects practitioners. These constructs overlap significantly in their symptom profiles, but they differ in etiology, mechanism, and in some cases the interventions most likely to be effective. Precise language matters clinically because it guides both self-assessment and treatment.</p>
<p><strong>Burnout.</strong> Burnout was first conceptualized by Freudenberger (1974) and later comprehensively studied by Maslach and Jackson (1981). Maslach's burnout model describes three dimensions: (1) Emotional exhaustion — feeling depleted, having nothing left to give; (2) Depersonalization — emotional numbing and detachment from clients, treating them as objects rather than persons; (3) Reduced personal accomplishment — feeling ineffective, doubting one's own competence and contribution. Critically, burnout is not trauma-specific. It can develop from chronic work stress in any field — administration, retail, medicine — and is primarily related to workload, organizational factors, and the absence of professional autonomy or reward. It is not caused specifically by exposure to traumatic content.</p>
<p><strong>Secondary Traumatic Stress (STS).</strong> Secondary traumatic stress — also called secondary traumatization or secondary PTSD — was described by Charles Figley (1993, 1995) as the emotional duress that results from hearing about a traumatizing event experienced by a significant other or from helping or wanting to help a traumatized person. Unlike burnout, STS is trauma-specific: it results directly from vicarious exposure to traumatic material. Its symptoms parallel DSM-5 PTSD criteria: intrusive symptoms (flashbacks, nightmares, intrusive thoughts about clients' trauma), avoidance (of clients, trauma-related topics, or work altogether), negative alterations in cognition and mood, and hyperarousal. The mechanism is empathic engagement — the same empathy that makes a clinician effective also opens pathways for traumatic material to be transmitted emotionally from client to clinician.</p>
<p><strong>Compassion Fatigue.</strong> Compassion fatigue, as used by Figley (1995) and Stamm (2010), is a broader clinical syndrome that encompasses both the cost of caring (empathic strain) and the exhaustion that follows sustained empathic engagement with suffering. Stamm's Professional Quality of Life (ProQOL) model distinguishes compassion satisfaction — the positive dimensions of helping work, the rewards of client growth and professional connection — from compassion fatigue, which includes both burnout and secondary traumatic stress as subscales. High compassion fatigue with low compassion satisfaction represents the highest risk state. Compassion fatigue is often the term most recognizable to practitioners who are experiencing it, because it describes the phenomenological experience — the emptiness where care used to be.</p>
<p><strong>Vicarious Trauma.</strong> Vicarious trauma, a term coined by McCann and Pearlman (1990) and elaborated in Pearlman and Saakvitne's (1995) seminal work, describes a specific and potentially permanent transformation in the clinician's inner world that results from empathic engagement with clients' traumatic material. Where STS focuses on symptoms, vicarious trauma focuses on schemas — deep-seated cognitive structures that organize our understanding of self, others, and the world. McCann and Pearlman drew on Constructivist Self-Development Theory (CSDT) to identify specific cognitive schemas most affected by trauma work: <em>frame of reference</em> (world view, identity, spirituality), <em>safety</em> (of self and others), <em>trust/dependency</em> (in self and others), <em>esteem</em> (of self and others), <em>intimacy</em> (with self and others), and <em>control</em> (over self and others). Cumulative exposure to traumatic content disrupts these schemas — a clinician who has worked for years with sexual abuse survivors may find their schemas about safety, trust, and human nature permanently altered.</p>
<p>The clinical implications are significant: a clinician experiencing vicarious trauma may become hypervigilant about their children's safety, may lose the capacity for intimacy, may develop a cynical worldview about human nature, or may find spiritual meaning disrupted. These are not mere symptoms to manage — they are changes to the clinician's self that require deliberate reconstruction through professional support, supervision, and sometimes personal therapy.</p>
<p><strong>Moral Injury.</strong> Moral injury is a more recently articulated construct, borrowed from military psychology (Litz et al., 2009), that describes the psychological distress arising from perpetrating, failing to prevent, bearing witness to, or learning about acts that transgress deeply held moral beliefs. In mental health practice, moral injury can arise when clinicians are required by their employing system to provide inadequate care — too few sessions, premature discharge, inadequate resources — when their professional and ethical obligations demand more. A clinician who must discharge a suicidal client because their insurance authorization was denied may experience moral injury, not merely stress. The emerging literature suggests moral injury requires different interventions than STS or burnout — specifically, it requires addressing the ethical breach and rebuilding moral agency, not simply managing symptoms.</p>`
        },
        {
          type: 'callout',
          title: 'ACA Ethics Standard C.2.g — Impairment',
          calloutType: 'clinical',
          content: `<p>ACA Code of Ethics Standard C.2.g states: "Counselors monitor themselves for signs of impairment from their own physical, mental, or emotional problems and refrain from offering or providing professional services when such impairment is likely to harm a client or others. They seek assistance for problems that reach the level of professional impairment, and, if necessary, they limit, suspend, or terminate their professional responsibilities until such time it is determined that they may safely resume their work." This standard creates an affirmative ethical obligation — not just a recommendation — for clinicians to monitor themselves, seek help, and modify practice when impairment is present. Vicarious trauma, compassion fatigue, and secondary traumatic stress all qualify as potential sources of impairment under this standard.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Risk Factors for Vicarious Trauma and Compassion Fatigue.</strong> While all mental health clinicians working with trauma are at some risk, certain factors increase or decrease that risk. Understanding these factors allows clinicians and organizations to make strategic protective investments.</p>
<p><em>Individual risk factors</em> include: personal trauma history (particularly unresolved trauma that resonates with client material); coping style (avoidant or suppressive coping increases risk); degree of empathic engagement (highly empathic clinicians are at both greater therapeutic effectiveness and greater VT risk); insufficient self-care practices; lack of support systems; and novice status (new clinicians often lack the professional identity stability that moderates VT impact). Notably, the research does not support the idea that experienced clinicians are immune — cumulative exposure over a career creates its own vulnerabilities, and burnout rates are high among senior clinicians.</p>
<p><em>Organizational risk factors</em> include: high trauma caseloads with insufficient non-trauma balance; inadequate or absent clinical supervision; organizational cultures that stigmatize distress; insufficient administrative support; high administrative burden that reduces clinical efficacy; poor physical working environments; and lack of peer support structures. The evidence is clear that VT is not primarily an individual problem requiring individual solutions — it is significantly influenced by organizational conditions, and organizations bear meaningful responsibility for practitioner wellness.</p>
<p><em>Protective factors</em> include: peer consultation and collegial support; regular clinical supervision with space for processing countertransference and VT; a balanced caseload that mixes trauma and non-trauma clients; personal therapy; strong social and family support outside of work; spiritual or meaning-making practices; physical health practices (exercise, sleep, nutrition); and a robust professional identity that extends beyond any particular client or case.</p>
<p><strong>The Professional Quality of Life Scale (ProQOL).</strong> The ProQOL, developed by Stamm (2010), is the most widely used self-assessment tool for compassion satisfaction and compassion fatigue in helping professionals. It consists of 30 items measured on a Likert scale and yields three subscale scores: Compassion Satisfaction (CS), Burnout, and Secondary Traumatic Stress. The tool is freely available for professional use and takes approximately 10 minutes to complete. High CS scores with low burnout and STS scores represent the most sustainable professional state. Low CS with high burnout and/or STS warrants attention — ideally consultation with a supervisor or therapist. The ProQOL is not a clinical diagnosis — it is a self-monitoring tool, and clinicians should not self-pathologize based on a single administration. Trend data across multiple administrations over time is more informative than any single score.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'How is vicarious trauma different from secondary traumatic stress?',
              content: `<p>Secondary traumatic stress (STS) describes symptom-level effects that parallel PTSD: intrusive images from client sessions, nightmares about client material, hypervigilance, emotional numbing, and avoidance of trauma-related work. It is acute and symptoms-based. Vicarious trauma (VT) describes a deeper, schema-level transformation in how the clinician views the world, human nature, safety, trust, and intimacy. VT is cumulative and cognitive-structural rather than symptomatic. A clinician with STS has traumatic symptoms; a clinician with VT has changed worldviews. Both can occur simultaneously, and the distinction is not always clinically clean. The differentiation matters because STS responds relatively well to symptom management (rest, grounding, trauma processing), while VT requires deeper schema-level reconstruction work, often including personal therapy focused on meaning-making and identity.</p>`
            },
            {
              title: 'What does compassion satisfaction look like, and why is it protective?',
              content: `<p>Compassion satisfaction is the positive pleasure and fulfillment derived from effective helping work — the sense of purpose that comes from client growth, the professional pride of an accurate case conceptualization, the reward of a therapeutic relationship that produces genuine change. Stamm's (2010) research identifies compassion satisfaction as the most powerful protective factor against compassion fatigue and secondary traumatic stress. Clinicians with high CS can sustain higher trauma caseloads without equivalent VT accumulation. CS is not the same as job satisfaction (which is more organizational) — it is a personal experience of finding meaning and reward in the clinical work itself. Practices that sustain CS include: celebrating client successes, case consultation where good outcomes are acknowledged, peer supervision that recognizes clinician competence, and personal meaning-making practices that connect clinical work to larger professional values.</p>`
            },
            {
              title: 'What is the relationship between personal trauma history and VT risk?',
              content: `<p>Clinicians with their own personal trauma histories — and there are many, given that surveys suggest a significant proportion of mental health clinicians entered the field partly in response to personal experience — are not disqualified from trauma work. However, personal trauma that has not been adequately processed creates "unfinished business" that can be activated by client material. When a clinician who experienced childhood sexual abuse works with a survivor of the same, the empathic resonance operates through the clinician's own trauma networks, not just through professional empathy — this intensifies both the therapeutic potential and the VT risk. Clinicians with personal trauma histories benefit particularly from personal therapy (ideally trauma-focused), regular supervision with a supervisor aware of their history, and deliberate monitoring of personal resonance with specific client presentations.</p>`
            },
            {
              title: 'What is moral injury, and how is it addressed differently than burnout or VT?',
              content: `<p>Moral injury describes the distress that arises when clinicians are placed in situations where their ethical obligations conflict with systemic constraints — being required to discharge a suicidal client prematurely, being unable to provide the level of care a client needs due to insurance restrictions, witnessing organizational practices that harm clients. Unlike burnout (which is about exhaustion) or VT (which is about schema change), moral injury involves a specific sense of ethical failure, guilt, shame, and betrayal. Addressing moral injury requires attending to the ethical dimension: processing the breach of professional values, rebuilding a sense of moral agency, and in some cases taking systemic advocacy action. Evidence-based approaches include meaning-making therapy, adaptive disclosure therapy, peer support groups, and organizational advocacy. Simply increasing self-care practices is insufficient for moral injury — the ethical wound must be directly addressed.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Warning Signs of Vicarious Trauma and Compassion Fatigue',
          content: `<p>Clinicians often recognize VT and CF in their colleagues before they recognize it in themselves. Warning signs span four domains. <strong>Cognitive:</strong> cynicism about clients, hopelessness about the change process, intrusive client imagery, hypervigilance, difficulty concentrating, negative worldview changes. <strong>Emotional:</strong> emotional numbing, loss of empathy, irritability, profound sadness, anxiety, feeling nothing during sessions that previously moved you. <strong>Behavioral:</strong> avoidance of specific clients or trauma topics, increasing absenteeism, over-involvement (boundary erosion with clients), substance use to cope, isolation from colleagues. <strong>Somatic:</strong> fatigue unrelieved by rest, sleep disruption, chronic physical complaints, lowered immune function. The earlier these signs are recognized and addressed, the lower the cumulative impact.</p>`,
          image: '',
          imageAlt: 'Diagram showing warning signs of vicarious trauma across cognitive, emotional, behavioral, and somatic domains',
          imagePosition: 'right'
        },
        {
          type: 'multipleChoice',
          question: 'A clinician who works primarily with survivors of domestic violence notices that she has become unable to go to sleep without checking that all the doors and windows in her home are locked, has started avoiding social situations because she no longer trusts that people are safe, and has lost her former sense that the world is a fundamentally benign place. This pattern most closely aligns with which construct?',
          options: [
            { text: 'Burnout, because it reflects emotional exhaustion from sustained work demands', isCorrect: false },
            { text: 'Secondary traumatic stress, because it involves symptom-level disturbance from trauma exposure', isCorrect: false },
            { text: 'Vicarious trauma, because it reflects schema-level changes in safety, trust, and worldview', isCorrect: true },
            { text: 'Moral injury, because it involves an ethical breach related to client care', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'The changes described — altered schemas about safety, trust in others, and worldview — are characteristic of vicarious trauma as defined by McCann and Pearlman\'s Constructivist Self-Development Theory. These are not mere symptoms (which would suggest STS) but deep changes in how the clinician understands the world. Burnout does not involve safety/trust schema changes. Moral injury involves guilt about an ethical breach, not worldview transformation from trauma exposure.'
        },
        {
          type: 'text',
          content: `<p><strong>Prevalence and Population Risk.</strong> Research on the prevalence of vicarious trauma, secondary traumatic stress, and compassion fatigue in mental health professionals reveals significant burden across the profession. Studies suggest that between 20-50% of clinicians who work with trauma-exposed populations score in the moderate-to-high range for secondary traumatic stress at any given time, with rates varying by specialty, caseload composition, and access to supervision and support.</p>
<p>Specialties at particularly high risk include: crisis counselors and first-responder mental health providers; child protective services workers; rape crisis and domestic violence counselors; oncology social workers and hospice counselors; refugee mental health providers; veterans services clinicians; and child trauma specialists. New therapists — in their first one to three years of practice — show elevated VT risk due to limited professional identity consolidation, less experience with self-monitoring, and often less access to quality supervision. Solo practitioners who lack natural peer consultation may accumulate VT without recognizing it simply due to isolation. The COVID-19 pandemic created a period of heightened risk across the profession as clinicians managed their own pandemic distress while absorbing the amplified distress of clients who were simultaneously exposed to a collective trauma.</p>
<p>Vicarious resilience — the positive counterpart to vicarious trauma — is also real. Clinicians can experience genuine growth from trauma work: deepened appreciation for human resilience, strengthened meaning-making, increased spiritual awareness, and expanded perspective. The research of Hernández and colleagues on vicarious resilience suggests that client growth and survival in the face of adversity can be a source of transformation and strength for clinicians who approach their work with openness. Self-care that maximizes compassion satisfaction and cultivates vicarious resilience is qualitatively different from self-care oriented merely toward symptom reduction.</p>`
        },
        {
          type: 'flashcardDeck',
          instructions: 'Review these key concepts about occupational hazards in trauma work. Click each card to flip.',
          flashcards: [
            { front: 'Constructivist Self-Development Theory (CSDT)', back: 'McCann & Pearlman\'s framework for understanding VT. Identifies how trauma work affects five schema domains: frame of reference, safety, trust/dependency, esteem, intimacy, and control.' },
            { front: 'ProQOL Scale', back: 'Professional Quality of Life Scale (Stamm, 2010). 30-item self-report measuring Compassion Satisfaction, Burnout, and Secondary Traumatic Stress. Free to use, takes ~10 min. Best interpreted as trend data over time.' },
            { front: 'Compassion Satisfaction', back: 'The positive reward of effective helping work — meaning, pleasure, and professional fulfillment. The strongest single protective factor against compassion fatigue and STS. Not the same as job satisfaction.' },
            { front: 'Burnout (Maslach)', back: 'Three dimensions: emotional exhaustion, depersonalization (detachment from clients), and reduced personal accomplishment. Not trauma-specific — driven primarily by workload and organizational factors.' },
            { front: 'Secondary Traumatic Stress', back: 'Symptom-level trauma response from vicarious exposure to client trauma: intrusions, avoidance, hyperarousal, negative cognitions — paralleling DSM-5 PTSD. Mechanism is empathic engagement.' },
            { front: 'Moral Injury', back: 'Distress arising from perpetrating, failing to prevent, or witnessing acts that violate professional moral values. Common in clinicians constrained by system inadequacies. Requires ethical repair, not just symptom management.' },
            { front: 'Vicarious Resilience', back: 'The positive transformation clinicians can experience from client growth and survival — deepened appreciation for human strength, expanded perspective. The counterpart to vicarious trauma.' },
            { front: 'ACA C.2.g — Impairment', back: 'Ethics standard requiring counselors to monitor for impairment, refrain from practice when impaired, seek help, and limit/suspend practice as needed. An affirmative obligation, not a recommendation.' },
            { front: 'Organizational Risk Factors for VT', back: 'High trauma caseloads, inadequate supervision, cultures that stigmatize distress, high administrative burden, poor physical environment, lack of peer support. VT is not just an individual problem.' }
          ]
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are organizational — rather than individual — risk factors for vicarious trauma and compassion fatigue? Select all that apply.',
          options: [
            { text: 'High trauma caseloads without balancing non-trauma clients', isCorrect: true },
            { text: 'Organizational culture that stigmatizes or punishes expressions of distress', isCorrect: true },
            { text: 'Personal trauma history that has not been adequately processed', isCorrect: false },
            { text: 'Inadequate or absent clinical supervision', isCorrect: true },
            { text: 'Avoidant coping style', isCorrect: false },
            { text: 'Insufficient administrative support and high paperwork burden', isCorrect: true }
          ],
          explanation: 'Organizational risk factors include caseload composition, supervision quality, organizational culture around distress, and administrative burden — all factors that require organizational solutions. Personal trauma history and coping style are individual risk factors. Effective VT prevention requires both individual and organizational interventions; treating VT as purely an individual responsibility mislocates the problem.'
        },
        {
          type: 'reflection',
          question: 'Complete the following: In the past three months of clinical practice, I have noticed the following changes in myself that may signal compassion fatigue or vicarious trauma (consider cognitive, emotional, behavioral, and somatic domains). The area where I most need to take action is _____, and the one concrete step I will take this week is _____.'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Defining the Constructs',
          takeaways: [
            'Burnout (exhaustion, depersonalization, reduced accomplishment) is driven primarily by organizational factors — not trauma exposure specifically.',
            'Secondary traumatic stress produces PTSD-like symptoms from empathic exposure to client trauma; vicarious trauma produces deeper, schema-level worldview changes.',
            'Compassion satisfaction — the positive reward of helping work — is the strongest protective factor against compassion fatigue and must be actively cultivated.',
            'Moral injury, distinct from burnout and VT, requires addressing the ethical dimension of practice — not just symptom management.',
            'ACA C.2.g creates an affirmative ethics obligation for clinicians to self-monitor for impairment and take corrective action when needed.'
          ]
        }
      ]
    },
    {
      title: 'Evidence-Based Strategies for Prevention and Recovery',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Evidence-Based Strategies for Prevention and Recovery',
          subtitle: 'Individual, relational, and organizational approaches to sustaining practice over a career',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>Self-care has become a cliché in the mental health profession — invoked so routinely that it has lost some of its meaning and urgency. "Take care of yourself" is advice that clinicians give their clients and receive from their supervisors, yet the research literature reveals that most clinicians do not engage in self-care practices systematically or with adequate intentionality. Understanding the evidence base for what actually protects against vicarious trauma and compassion fatigue — versus what feels like self-care without meaningful protective effect — is essential for sustainable practice.</p>
<p><strong>What the Research Says Works.</strong> A comprehensive review by Norcross and VandenBos (2018) and related literature identifies several categories of evidence-supported protective practices. <em>Clinical supervision and consultation</em> consistently emerge as the strongest professional protective factor. Supervision that includes explicit space for processing countertransference, secondary trauma, and the emotional impact of clinical work — not just case management and skill development — is most protective. Many clinicians receive supervision that focuses almost exclusively on clinical technique and administrative compliance, leaving the emotional dimension of the work unaddressed. Advocating for emotionally attuned supervision is itself a protective act.</p>
<p><em>Personal therapy</em> is among the most evidence-supported individual protective practices for clinicians, particularly those who work with trauma populations. Surveys consistently find that clinicians who have undergone personal therapy report higher levels of professional functioning, greater capacity for empathy without over-identification, and better self-awareness of countertransference. Despite this, many clinicians do not seek their own therapy due to stigma, financial barriers, or the belief that they "should be able to handle it." Normalizing personal therapy as a professional competence — not a sign of weakness — is a cultural shift the field needs to continue making.</p>
<p><em>Peer consultation and support</em> — structured case consultation groups, informal peer relationships with colleagues, and professional communities of practice — provide normalization (others have these experiences too), practical support (how do you handle this?), and the social buffering that reduces VT risk. Solo practitioners are particularly at risk because they lack natural peer contact; creating intentional peer consultation structures is a critical self-care priority for this population.</p>
<p><em>Caseload management</em> — the intentional balancing of trauma and non-trauma clients, varied client populations and presenting concerns, and protection of caseload size — is an organizational and individual responsibility. Research suggests that exceeding approximately 30-40% trauma clients in a caseload without compensatory supports increases VT risk significantly. Where clinicians have agency over caseload composition, they should use it. Where they do not, advocating organizationally for caseload balance is appropriate.</p>
<p><em>Physical health practices.</em> The body bears the burden of vicarious trauma — hyperarousal, somatic complaints, sleep disruption, immune dysregulation are all documented consequences of sustained trauma work. Physical exercise has the strongest evidence base as a VT and STS protective factor among physical health practices, with research suggesting that regular aerobic exercise produces measurable reductions in STS symptoms. Sleep hygiene, nutrition, and stress reduction practices (yoga, tai chi, qigong) also have supporting evidence. These are not luxuries — they are clinical tools for maintaining practice capacity.</p>
<p><em>Meaning-making and spirituality.</em> McCann and Pearlman's CSDT framework identified spirituality — the clinician's frame of reference, including existential meaning — as one of the schema domains most affected by vicarious trauma. Practices that sustain or rebuild the clinician's sense of meaning, purpose, and connection to something larger than individual sessions and cases are particularly protective against the worldview-level effects of VT. This may take the form of formal religious practice, mindfulness or meditation, nature connection, creative expression, or community involvement. The specific form matters less than the deliberateness with which meaning is cultivated and protected.</p>`
        },
        {
          type: 'callout',
          title: 'Tip: The Structured Self-Care Plan — Beyond the Checklist',
          calloutType: 'tip',
          content: `<p>Many clinicians approach self-care as a reactive, unstructured activity — they rest when they are exhausted and seek peer support when they are in crisis. The evidence supports a different approach: a proactive, written, scheduled self-care plan that functions as a clinical tool for sustaining practice capacity. A useful self-care plan includes: regular ProQOL self-assessments (at minimum quarterly); named practices across multiple domains (physical, relational, meaning-making, professional); scheduled commitments that are treated as non-negotiable as client appointments; designated peer consultation partners with agreed meeting frequency; criteria for seeking personal therapy and a therapist identified in advance; and organizational advocacy actions to address systemic contributors to VT. Writing the plan, reviewing it with a supervisor, and revisiting it annually elevates self-care from aspiration to professional practice.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Distinguishing Effective from Ineffective Self-Care.</strong> Not all self-care practices are equally protective, and some practices commonly labeled as "self-care" may actually maintain patterns that increase VT risk. Research by Grafanaki and colleagues and clinical observation suggest the following distinctions:</p>
<p><em>Effective self-care</em> involves practices that process emotional material, restore regulation, build meaning, and connect the clinician to sources of satisfaction and support. Personal therapy, peer consultation, exercise, creative engagement, mindfulness, and spiritual practice all meet this description. They work not by eliminating the impact of trauma work but by building the clinician's capacity to absorb and metabolize it without accumulation.</p>
<p><em>Surface-level or avoidance-based self-care</em> provides temporary relief without genuine restoration: binge-watching television to numb out, excessive alcohol or substance use, overworking to avoid feeling, scrolling social media, or isolation. These practices interrupt distress in the short term but do not build capacity, and some (alcohol, isolation) actively impair resilience over time. The clinical field's promotion of "whatever works for you" as a self-care philosophy can inadvertently normalize practices that are avoidant rather than restorative.</p>
<p><strong>The Ethics of Continuing to Practice When Impaired.</strong> Perhaps the most difficult dimension of vicarious trauma for clinicians is the ethics of practice continuation when impaired. ACA C.2.g creates an obligation to monitor and act, but clinicians routinely underestimate their own impairment levels. Research on self-assessment in healthcare consistently finds that self-rated and externally-rated performance diverge most under high stress — precisely the conditions when VT and CF are most likely to be present. This means that when a clinician most needs accurate self-assessment, they are least likely to have it.</p>
<p>Practical implications: (1) Use structured tools (ProQOL) rather than subjective self-evaluation alone; (2) Invite trusted colleagues to provide observations — peer monitoring is more reliable than self-monitoring under stress; (3) Know your early warning signs and establish a standing agreement with a trusted peer to tell you when they see them; (4) Know in advance at what point you will seek personal therapy, take reduced caseload, or take leave — deciding in advance when you are well is far more reliable than deciding in the moment of crisis.</p>
<p><strong>Organizational Change as Ethical Obligation.</strong> The research literature is unambiguous: individual self-care cannot compensate for organizational conditions that create sustained excessive VT risk. Clinicians who work in organizations with high trauma caseloads, inadequate supervision, and cultures that penalize expressions of distress cannot self-care their way to wellness. The field's focus on individual self-care — while necessary — has been critiqued as inadvertently deflecting attention from systemic causes.</p>
<p>Advocacy at the organizational level — for adequate supervision, balanced caseloads, peer consultation structures, physical workspace quality, and cultures of psychological safety — is not separate from clinical ethics. It is continuous with the commitment to client welfare, because clinicians who are well are better able to provide ethical, effective care. For clinicians in systems that are not changing, the difficult ethical question becomes: at what point does organizational failure to address systemic VT risk become a reason to leave?</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'What are evidence-based self-care practices for clinicians working with trauma populations?',
              content: `<p>The strongest evidence supports: (1) Regular clinical supervision that includes emotional processing — not just case management; (2) Personal therapy, particularly for clinicians with their own trauma history or high trauma caseloads; (3) Peer consultation with colleagues who can provide normalization and support; (4) Regular aerobic exercise (strongest physical health evidence for STS reduction); (5) Mindfulness-based practices, which improve affect regulation and reduce hyperarousal; (6) Meaning-making practices — spiritual, creative, community — that sustain the clinician\'s sense of purpose; (7) Caseload management that balances trauma with non-trauma clients. Surface-level practices (TV, passive rest) provide temporary relief but do not build resilience. The most evidence-supported approach combines practices across multiple domains rather than relying on any single self-care strategy.</p>`
            },
            {
              title: 'How often should clinicians use the ProQOL to assess themselves?',
              content: `<p>Stamm (2010) recommends quarterly self-assessment for clinicians working in high-risk settings (trauma specialties, crisis work, high-acuity populations). Annual assessment is a minimum baseline for all mental health practitioners. The ProQOL is most useful as trend data over time — a single elevated score is less informative than a pattern showing increasing STS or decreasing CS across multiple administrations. After major life events (personal trauma, pandemic, job change), more frequent assessment is warranted. Many agencies and training programs now build ProQOL administration into annual performance reviews or supervision cycles. The tool is freely available at proqol.org and takes approximately 10 minutes.</p>`
            },
            {
              title: 'What can solo practitioners do to address the isolation risk for VT?',
              content: `<p>Solo practitioners face heightened VT risk due to professional isolation — no natural peer contact, no built-in supervision structures, and often limited accountability for self-care. Evidence-supported strategies include: joining or forming a peer consultation group with other solo practitioners (even monthly meetings provide significant buffering); establishing a paid supervision or consultation relationship with a senior clinician; joining professional associations with active peer networking components; participating in peer supervision via telehealth (which has expanded access for isolated practitioners); and using listservs, online professional communities, or communities of practice to maintain connection with colleagues. The investment of time and sometimes money in peer consultation is not optional for solo practitioners working with trauma — it is a clinical and ethical necessity.</p>`
            },
            {
              title: 'When is it appropriate to take a clinical leave of absence due to vicarious trauma?',
              content: `<p>Leave of absence decisions are intensely personal and context-dependent, but several evidence-based indicators suggest that leave may be warranted: (1) Consistent inability to provide competent care — missed clinical cues, inability to formulate, passive sessions; (2) Persistent intrusive symptoms from client material that do not resolve with rest and consultation; (3) Pattern of boundary erosion with multiple clients; (4) Substance use to cope with clinical distress; (5) Active personal psychiatric symptoms — depression, PTSD, panic disorder — at a severity that impairs functioning. Many clinicians attempt to continue working through these states, partly for financial reasons and partly because they feel responsible to their clients. A brief leave with appropriate transitional support to clients is ethically preferable to months of impaired practice. Planning for leave in advance — having a therapist identified, knowing the organization\'s leave policy, having a plan for client transitions — reduces the barrier to seeking help when it is needed.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Building a Sustainable Self-Care Architecture',
          content: `<p>Sustainable self-care is less a list of activities than an architecture — an intentional structure of practices across multiple life domains that collectively maintain the clinician\'s capacity to engage empathically with suffering without accumulating permanent damage. Effective architecture includes: <strong>Professional supports</strong> (supervision, peer consultation, personal therapy); <strong>Physical restoration</strong> (exercise, sleep, nutrition — the foundations of nervous system regulation); <strong>Relational sustenance</strong> (relationships outside the therapeutic context that are mutual and nourishing, not one-directionally supportive); <strong>Meaning and transcendence</strong> (practices that connect clinical work to larger purpose and sustain spiritual or philosophical frameworks that organize suffering into meaning); and <strong>Creative and playful engagement</strong> (activities valued for their intrinsic pleasure, not their productivity — a dimension consistently underemphasized in self-care literature). Together, these elements address the full scope of what vicarious trauma affects.</p>`,
          image: '',
          imageAlt: 'Architecture diagram showing professional, physical, relational, meaning, and creative domains of sustainable self-care',
          imagePosition: 'left'
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each self-care concept or tool with its most accurate description.',
          matchingPairs: [
            { term: 'ProQOL — Compassion Satisfaction subscale', definition: 'Measures the positive reward derived from helping work; the strongest protective factor against CF and STS' },
            { term: 'ProQOL — Secondary Traumatic Stress subscale', definition: 'Measures PTSD-like intrusion, avoidance, and arousal symptoms arising from vicarious trauma exposure' },
            { term: 'Peer consultation group', definition: 'Structured colleague support that provides normalization, vicarious resilience, and accountability — particularly protective for solo practitioners' },
            { term: 'Caseload balance', definition: 'Intentional management of the ratio of trauma to non-trauma clients to reduce cumulative VT exposure' },
            { term: 'Meaning-making practice', definition: 'Spiritual, creative, or philosophical activities that maintain the clinician\'s existential framework and sense of purpose' },
            { term: 'ACA Standard C.2.g', definition: 'Requires clinicians to monitor for impairment and limit or suspend practice when impaired — an affirmative ethics obligation' }
          ]
        },
        {
          type: 'text',
          content: `<p><strong>Special Considerations: Countertransference in Trauma Work.</strong> Countertransference — the therapist's emotional reactions to the client — takes on particular significance in trauma work because trauma material is among the most emotionally activating clinical content. Pearlman and Saakvitne (1995) describe several forms of countertransference specific to trauma work: over-identification with the client's victimization (leading to loss of therapeutic neutrality and possible boundary erosion); horror and disgust responses (which if unacknowledged can impair empathy or lead to avoidance); rescue fantasies (particularly with clients who are in danger, leading to overextension of the therapeutic role); and helplessness and despair (as cumulative exposure to suffering erodes the clinician's sense of efficacy).</p>
<p>Countertransference in trauma work does not indicate pathology — it indicates humanity. The goal is not to eliminate countertransference but to increase the clinician's awareness of it so it can be used therapeutically rather than unconsciously enacted. Regular supervision that explicitly examines countertransference — particularly with specific client presentations that consistently activate strong reactions — is the primary clinical management tool. Maintaining personal therapy as a space to process countertransference material that is not appropriate for supervision is an additional resource.</p>`
        },
        {
          type: 'cardSort',
          instructions: 'Sort each self-care or coping strategy into the category that best describes its function and evidence base. Tap a card, then tap a category to sort it.',
          categories: ['Evidence-Based Protection', 'Surface-Level Relief', 'Avoidance-Based Coping'],
          cards: [
            { text: 'Weekly peer consultation group with a structured case discussion format', category: 'Evidence-Based Protection' },
            { text: 'Regular aerobic exercise three or more times per week', category: 'Evidence-Based Protection' },
            { text: 'Personal therapy with a trauma-informed therapist', category: 'Evidence-Based Protection' },
            { text: 'Quarterly ProQOL self-assessment with a trusted peer reviewer', category: 'Evidence-Based Protection' },
            { text: 'Watching several hours of television to "switch off" after difficult sessions', category: 'Surface-Level Relief' },
            { text: 'Taking a relaxing bath or walk after a hard clinical day', category: 'Surface-Level Relief' },
            { text: 'Scheduling regular non-work social activities with friends', category: 'Evidence-Based Protection' },
            { text: 'Avoiding any professional reading or continuing education about trauma', category: 'Avoidance-Based Coping' },
            { text: 'Increasing alcohol consumption on evenings after difficult sessions', category: 'Avoidance-Based Coping' },
            { text: 'Declining trauma referrals without developing alternative coping strategies', category: 'Avoidance-Based Coping' },
            { text: 'Mindfulness-based stress reduction practice (MBSR)', category: 'Evidence-Based Protection' },
            { text: 'Spiritual or religious practice that provides existential grounding', category: 'Evidence-Based Protection' }
          ],
          explanation: 'Evidence-based protective practices build capacity — they process emotional material, restore regulation, build meaning, and provide social buffering. Surface-level relief provides temporary restoration without lasting capacity building. Avoidance-based coping provides short-term distress reduction while maintaining or worsening underlying vulnerabilities over time. Distinguishing among these is essential for creating a genuinely protective self-care plan.'
        },
        {
          type: 'fillInBlank',
          title: 'Key Concepts in Vicarious Trauma and Self-Care',
          blanks: [
            { prompt: 'The ProQOL scale measures three dimensions: Compassion Satisfaction, Burnout, and _____.', answer: 'Secondary Traumatic Stress', acceptAlternates: ['secondary traumatic stress', 'STS'] },
            { prompt: 'McCann and Pearlman\'s theory of how VT alters deep belief structures is called _____ Self-Development Theory.', answer: 'Constructivist', acceptAlternates: ['constructivist'] },
            { prompt: 'ACA ethics standard _____ requires counselors to monitor for signs of impairment and refrain from offering services when impaired.', answer: 'C.2.g', acceptAlternates: ['C.2.g', 'C2g'] },
            { prompt: 'The positive transformation that clinicians can experience through exposure to clients\' survival and growth is called vicarious _____.', answer: 'resilience', acceptAlternates: ['Resilience'] }
          ]
        },
        {
          type: 'reflection',
          question: 'Identify one area of your current clinical practice where you are most vulnerable to vicarious trauma or compassion fatigue (specific client population, case type, or work setting). What one evidence-based change — to your supervision, peer consultation, caseload, or personal practices — would most meaningfully address that vulnerability? What is preventing you from making that change, and what would it take to overcome that barrier?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Evidence-Based Strategies for Sustainable Practice',
          takeaways: [
            'The strongest evidence-based protective factors are: clinical supervision with emotional processing space, personal therapy, and peer consultation — not individualized relaxation practices alone.',
            'Effective self-care builds capacity; surface-level self-care provides relief; avoidance-based coping maintains vulnerability. The distinction matters clinically.',
            'Solo practitioners face amplified VT risk due to isolation and must create intentional peer consultation structures rather than relying on the natural collegial contact available in group settings.',
            'The field\'s focus on individual self-care has been critiqued for deflecting attention from organizational contributors to VT — advocacy for systemic change is also an ethical act.',
            'Planning in advance for impairment thresholds — knowing when you will seek therapy, reduce caseload, or take leave — is more reliable than deciding in the moment of crisis.'
          ]
        },
        {
          type: 'resources',
          title: 'Resources and Further Reading',
          resources: [
            { name: 'ProQOL Scale — Beth Hudnall Stamm', description: 'Free validated self-assessment tool measuring compassion satisfaction, burnout, and secondary traumatic stress. Available in multiple languages.', url: 'https://proqol.org' },
            { name: 'Pearlman, L.A. & Saakvitne, K.W. (1995). Trauma and the Therapist — Summary Resources', description: 'Foundational text on vicarious trauma and constructivist self-development theory. Publisher and academic library resource.', url: 'https://www.nortonbooks.com' },
            { name: 'SAMHSA — Secondary Traumatic Stress: A Fact Sheet for Child-Serving Professionals', description: 'Practical guidance on recognizing and addressing STS in the workforce, with broad applicability across helping professions.', url: 'https://www.samhsa.gov/dtac/secondary-traumatic-stress' },
            { name: 'ACA Ethics Code Standard C.2.g — Professional Impairment', description: 'The full ethics standard governing clinician self-monitoring and impairment response obligations.', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf' },
            { name: 'The Green Cross Academy of Traumatology — Compassion Fatigue Resources', description: 'Professional organization focused on compassion fatigue education, training, and certification for trauma workers.', url: 'https://greencross.org' },
            { name: 'Figley Institute — Compassion Fatigue and Trauma Training', description: 'Educational resources and training programs on compassion fatigue from Charles Figley\'s research institute.', url: 'https://figleyinstitute.com' },
            { name: 'Norcross, J.C. & VandenBos, G.R. (2018). Leaving It at the Office: A Guide to Psychotherapist Self-Care', description: 'Comprehensive evidence-based guide to self-care practices for mental health professionals, with specific VT/CF interventions.', url: 'https://www.guilford.com/books/Leaving-It-at-the-Office/Norcross-VandenBos/9781462533404' }
          ]
        }
      ]
    }
  ],
  assessment: {
    title: 'Final Assessment — CR-TRM-502: Vicarious Trauma and Compassion Fatigue in Clinical Practice',
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'Which theoretical framework specifically identifies disruptions to cognitive schemas about safety, trust, esteem, intimacy, and control as the defining characteristic of vicarious trauma?',
        options: [
          { text: 'Maslach\'s Burnout Model', isCorrect: false },
          { text: 'Figley\'s Secondary Traumatic Stress Model', isCorrect: false },
          { text: 'McCann and Pearlman\'s Constructivist Self-Development Theory (CSDT)', isCorrect: true },
          { text: 'Stamm\'s Professional Quality of Life Model', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'CSDT (McCann & Pearlman, 1990) specifically identifies VT as a schema-level transformation affecting the clinician\'s cognitive structures about safety, trust, esteem, intimacy, and control. This distinguishes VT from burnout (organizational exhaustion), STS (symptom-level trauma), and the ProQOL (which measures all three domains but does not theorize their mechanism).'
      },
      {
        type: 'multipleChoice',
        question: 'On the ProQOL scale, which subscale score represents the most powerful protective factor against compassion fatigue and secondary traumatic stress?',
        options: [
          { text: 'Low Burnout score', isCorrect: false },
          { text: 'High Compassion Satisfaction score', isCorrect: true },
          { text: 'Low Secondary Traumatic Stress score', isCorrect: false },
          { text: 'High total ProQOL score', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Stamm\'s research consistently identifies compassion satisfaction — the positive reward and meaning derived from helping work — as the strongest single protective factor. High CS predicts resilience against CF and STS even when other risk factors are present. Absence of burnout or STS is a desired outcome, not a protective factor in itself.'
      },
      {
        type: 'multipleChoice',
        question: 'A social worker at a domestic violence agency feels that her agency\'s policy of mandatory 12-session limits causes her to discharge clients who are not yet safe. She experiences guilt, anger, and a sense of professional betrayal that does not resolve with rest or peer support. This pattern most closely represents:',
        options: [
          { text: 'Burnout from high caseload demands', isCorrect: false },
          { text: 'Secondary traumatic stress from vicarious exposure to client danger', isCorrect: false },
          { text: 'Moral injury from practicing in a system that violates her professional values', isCorrect: true },
          { text: 'Vicarious trauma from cumulative schema disruption', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Moral injury arises when clinicians are required to act in ways that violate their professional and ethical values — particularly when constrained by systems inadequacies. The guilt, anger, and sense of betrayal that do not resolve with rest are characteristic. Burnout is about exhaustion; STS is about symptomatic trauma; VT is about schema change. Moral injury specifically involves a perceived ethical breach and requires addressing the moral dimension, not just symptom management.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is characterized as a professional — rather than personal — protective factor against vicarious trauma according to the evidence base?',
        options: [
          { text: 'Regular exercise and adequate sleep', isCorrect: false },
          { text: 'Strong family and social support networks', isCorrect: false },
          { text: 'Regular clinical supervision that includes emotional processing', isCorrect: true },
          { text: 'Spiritual or religious practice', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Clinical supervision that provides space for processing countertransference and emotional impact — not just case management — is consistently identified as the strongest professional protective factor in the VT literature. Exercise, social support, and spiritual practice are all individual protective factors. Each domain (professional, individual/physical, relational, meaning-making) contributes to a comprehensive protective architecture.'
      },
      {
        type: 'multipleChoice',
        question: 'ACA Code of Ethics Standard C.2.g creates which of the following obligations for clinicians experiencing vicarious trauma symptoms?',
        options: [
          { text: 'A recommendation to consider seeking peer support', isCorrect: false },
          { text: 'An affirmative obligation to monitor for impairment, seek help, and limit practice when impaired', isCorrect: true },
          { text: 'A requirement to disclose VT symptoms to all current clients', isCorrect: false },
          { text: 'A mandate to complete a mental health evaluation before each annual license renewal', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'C.2.g is an affirmative ethics obligation — not merely guidance — requiring clinicians to actively monitor for impairment, seek assistance, and limit or suspend practice when impairment is likely to harm clients. It is a professional responsibility, not an optional self-care suggestion. Disclosing to clients is not required and could be clinically harmful. License renewal mental health evaluations are a separate issue from C.2.g obligations.'
      },
      {
        type: 'multipleChoice',
        question: 'Which self-care practice has the strongest evidence base for reducing secondary traumatic stress symptoms specifically?',
        options: [
          { text: 'Watching television to decompress after sessions', isCorrect: false },
          { text: 'Regular aerobic exercise', isCorrect: true },
          { text: 'Taking extended vacations annually', isCorrect: false },
          { text: 'Reducing caseload to 10 clients per week', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Regular aerobic exercise has the strongest evidence among physical health practices for measurably reducing STS symptoms, including intrusive symptoms, hyperarousal, and avoidance. Television viewing is surface-level relief without capacity building. Annual vacations provide temporary restoration but don\'t address cumulative VT. Caseload reduction alone, without compensatory supportive practices, may reduce exposure without building resilience.'
      },
      {
        type: 'multipleChoice',
        question: 'The positive transformation some clinicians experience through witnessing client growth and survival — including deepened appreciation for human resilience — is called:',
        options: [
          { text: 'Post-traumatic growth', isCorrect: false },
          { text: 'Vicarious resilience', isCorrect: true },
          { text: 'Compassion satisfaction', isCorrect: false },
          { text: 'Secondary traumatic enrichment', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Vicarious resilience (Hernández et al.) is the positive counterpart to vicarious trauma — the clinician\'s transformation through exposure to client strength, survival, and growth. It is distinct from compassion satisfaction (which is the positive reward of helping work generally) and post-traumatic growth (which describes the client\'s own growth following trauma). Vicarious resilience specifically arises from witnessing client resilience.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following populations is at HIGHEST risk for vicarious trauma accumulation, according to prevalence research?',
        options: [
          { text: 'Clinicians in private practice with primarily couples and family cases', isCorrect: false },
          { text: 'Crisis counselors, child trauma specialists, and domestic violence counselors with high trauma caseloads', isCorrect: true },
          { text: 'Clinicians who have completed at least 5 years of supervised post-licensure experience', isCorrect: false },
          { text: 'Clinicians who work in large group practices with regular team meetings', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Crisis workers, child trauma specialists, and domestic violence counselors consistently show the highest VT prevalence in research surveys due to high concentration of traumatic content, often without compensatory non-trauma cases. Experience level does not provide immunity — cumulative exposure over careers creates its own risk profile. Group practice team meetings are protective (peer support), but structural supports alone do not eliminate risk from high trauma caseloads.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following accurately distinguish secondary traumatic stress (STS) from vicarious trauma (VT)? Select all that apply.',
        options: [
          { text: 'STS produces PTSD-like symptoms; VT produces schema-level worldview changes', isCorrect: true },
          { text: 'STS can develop rapidly after a single exposure; VT typically develops through cumulative exposure', isCorrect: true },
          { text: 'STS is specific to trauma work; VT can develop in any stressful human services job', isCorrect: false },
          { text: 'VT affects cognitive schemas about safety, trust, and esteem; STS affects symptom domains', isCorrect: true },
          { text: 'Both STS and VT require identical treatment approaches', isCorrect: false }
        ],
        explanation: 'STS is symptom-based (intrusions, avoidance, hyperarousal) and can develop relatively quickly; VT is schema-based (worldview changes, trust disruption) and typically develops cumulatively. Both are specific to trauma-related content (though VT accumulation can be intensified in non-trauma work by general empathic strain). Their treatment differs: STS responds better to symptom management; VT requires schema reconstruction, often through personal therapy focused on meaning-making.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are ORGANIZATIONAL — rather than individual — risk factors for vicarious trauma and compassion fatigue? Select all that apply.',
        options: [
          { text: 'Caseloads exceeding 40% trauma clients without compensatory supports', isCorrect: true },
          { text: 'Absence of structured peer consultation or supervision', isCorrect: true },
          { text: 'Personal trauma history that has not been processed in therapy', isCorrect: false },
          { text: 'Organizational culture that stigmatizes expressions of distress', isCorrect: true },
          { text: 'High administrative burden that reduces sense of clinical efficacy', isCorrect: true },
          { text: 'Avoidant coping style as a general personality trait', isCorrect: false }
        ],
        explanation: 'Organizational risk factors require organizational solutions: caseload composition, supervision quality, organizational culture, and administrative burden. Personal trauma history and coping style are individual factors. Treating VT as purely an individual responsibility — requiring only individual self-care solutions — mislocates the problem and fails to address significant systemic contributors.'
      },
      {
        type: 'multiSelect',
        question: 'According to the evidence base, which of the following self-care practices are most likely to build genuine resilience against vicarious trauma over time? Select all that apply.',
        options: [
          { text: 'Regular clinical supervision with space for emotional processing', isCorrect: true },
          { text: 'Personal therapy for clinicians with high trauma caseloads or personal trauma history', isCorrect: true },
          { text: 'Watching television or streaming content to "switch off" after sessions', isCorrect: false },
          { text: 'Regular aerobic exercise', isCorrect: true },
          { text: 'Peer consultation groups that provide normalization and collegial support', isCorrect: true },
          { text: 'Avoiding professional development activities related to trauma to reduce exposure', isCorrect: false }
        ],
        explanation: 'Evidence-based VT resilience practices build capacity through emotional processing, nervous system regulation, and meaning-making. Television viewing provides surface-level relief without capacity building. Avoiding trauma-related professional development may reduce awareness of warning signs and protective strategies — the opposite of what is needed.'
      },
      {
        type: 'multipleChoice',
        question: 'When Stamm\'s ProQOL is used as a monitoring tool, which administration frequency is recommended for clinicians in high-risk trauma specialties?',
        options: [
          { text: 'Once upon initial hire', isCorrect: false },
          { text: 'Annually at license renewal', isCorrect: false },
          { text: 'Quarterly', isCorrect: true },
          { text: 'Weekly during periods of high caseload', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Stamm recommends quarterly self-assessment for clinicians in high-risk settings. Annual assessment is a minimum for all practitioners. Trend data over multiple administrations is more informative than any single score, which is why regular administration — especially in high-risk settings — is recommended. Weekly administration in most settings would be excessive and potentially counterproductive.'
      },
      {
        type: 'multipleChoice',
        question: 'A solo practitioner notices she has become increasingly cynical about clients\' capacity for change, feels detached during sessions that used to move her, and has been avoiding scheduling new trauma referrals for three months. According to ACA C.2.g, what is her ethical obligation?',
        options: [
          { text: 'To continue practicing while monitoring symptoms and seeking peer support informally', isCorrect: false },
          { text: 'To acknowledge the situation privately and plan to seek help at her annual supervision appointment', isCorrect: false },
          { text: 'To actively monitor her impairment level, seek professional help, and consider limiting practice if impairment is likely to harm clients', isCorrect: true },
          { text: 'To immediately disclose these symptoms to all current clients', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'C.2.g creates an affirmative obligation: monitor for impairment, seek assistance, and limit or suspend practice when impairment is likely to harm clients. The pattern described (cynicism, detachment, avoidance) constitutes impairment warning signs that require active response — not passive monitoring. Informal peer support alone is not sufficient. Immediate client disclosure is not required and could be clinically counterproductive.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes "vicarious resilience" in the context of trauma work?',
        options: [
          { text: 'A clinician\'s personal resistance to developing VT due to prior positive life experiences', isCorrect: false },
          { text: 'A clinician\'s transformation through witnessing client survival and growth, deepening appreciation for human resilience', isCorrect: true },
          { text: 'The capacity to continue working with trauma clients without needing personal therapy', isCorrect: false },
          { text: 'The recovery of a clinician who previously developed VT and returned to healthy functioning', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Vicarious resilience (Hernández et al.) is the positive counterpart to VT — a transformation in the clinician\'s worldview through empathic exposure to client strength, survival, and growth. It is not simply resistance to VT, nor is it the same as personal resilience. It specifically arises from the therapeutic relationship itself and can be a genuine source of professional and personal growth.'
      },
      {
        type: 'multipleChoice',
        question: 'What distinguishes moral injury from burnout in mental health practitioners?',
        options: [
          { text: 'Moral injury is more severe than burnout but responds to the same interventions', isCorrect: false },
          { text: 'Moral injury specifically involves guilt and shame about an ethical breach, whereas burnout involves emotional exhaustion from work demands', isCorrect: true },
          { text: 'Burnout affects professional function while moral injury affects personal relationships only', isCorrect: false },
          { text: 'Moral injury requires medication while burnout can be managed with self-care alone', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The distinguishing feature of moral injury is the ethical dimension — guilt, shame, and betrayal arising from having violated or been forced to violate professional moral values. Burnout is fundamentally about emotional exhaustion, depersonalization, and reduced efficacy — driven primarily by workload and organizational factors. Burnout does not require moral transgression; moral injury does. They require different interventions: burnout responds to workload management and organizational change; moral injury requires ethical repair and rebuilding moral agency.'
      }
    ]
  },
  references: [
    {
      citation: 'Figley, C. R. (Ed.). (1995). Compassion fatigue: Coping with secondary traumatic stress disorder in those who treat the traumatized. Brunner/Mazel.',
      url: ''
    },
    {
      citation: 'Pearlman, L. A., & Saakvitne, K. W. (1995). Trauma and the therapist: Countertransference and vicarious traumatization in psychotherapy with incest survivors. Norton.',
      url: ''
    },
    {
      citation: 'McCann, I. L., & Pearlman, L. A. (1990). Vicarious traumatization: A framework for understanding the psychological effects of working with victims. Journal of Traumatic Stress, 3(1), 131–149.',
      url: 'https://doi.org/10.1007/BF00975140'
    },
    {
      citation: 'Stamm, B. H. (2010). The concise ProQOL manual (2nd ed.). ProQOL.org.',
      url: 'https://proqol.org'
    },
    {
      citation: 'Maslach, C., & Jackson, S. E. (1981). The measurement of experienced burnout. Journal of Occupational Behavior, 2(2), 99–113.',
      url: 'https://doi.org/10.1002/job.4030020205'
    },
    {
      citation: 'Litz, B. T., Stein, N., Delaney, E., Lebowitz, L., Nash, W. P., Silva, C., & Maguen, S. (2009). Moral injury and moral repair in war veterans: A preliminary model and intervention strategy. Clinical Psychology Review, 29(8), 695–706.',
      url: 'https://doi.org/10.1016/j.cpr.2009.07.003'
    },
    {
      citation: 'Hernández, P., Gangsei, D., & Engstrom, D. (2007). Vicarious resilience: A new concept in work with those who survive trauma. Family Process, 46(2), 229–241.',
      url: 'https://doi.org/10.1111/j.1545-5300.2007.00206.x'
    },
    {
      citation: 'Norcross, J. C., & VandenBos, G. R. (2018). Leaving it at the office: A guide to psychotherapist self-care (2nd ed.). Guilford Press.',
      url: ''
    },
    {
      citation: 'Bride, B. E., Robinson, M. M., Yegidis, B., & Figley, C. R. (2004). Development and validation of the Secondary Traumatic Stress Scale. Research on Social Work Practice, 14(1), 27–35.',
      url: 'https://doi.org/10.1177/1049731503254106'
    },
    {
      citation: 'Canfield, J. (2005). Secondary traumatization, burnout, and vicarious traumatization: A review of the literature as it relates to therapists who treat trauma. Smith College Studies in Social Work, 75(2), 81–101.',
      url: 'https://doi.org/10.1300/J497v75n02_06'
    },
    {
      citation: 'van Dernoot Lipsky, L., & Burk, C. (2009). Trauma stewardship: An everyday guide to caring for self while caring for others. Berrett-Koehler.',
      url: ''
    },
    {
      citation: 'Bober, T., & Regehr, C. (2006). Strategies for reducing secondary or vicarious trauma: Do they work? Brief Treatment and Crisis Intervention, 6(1), 1–9.',
      url: 'https://doi.org/10.1093/brief-treatment/mhj001'
    },
    {
      citation: 'Newell, J. M., & MacNeil, G. A. (2010). Professional burnout, vicarious trauma, secondary traumatic stress, and compassion fatigue: A review of theoretical terms, risk factors, and preventive methods for clinicians and researchers. Best Practice in Mental Health, 6(2), 57–68.',
      url: ''
    },
    {
      citation: 'Meadors, P., & Lamson, A. (2008). Compassion fatigue and secondary traumatization: Provider self care on intensive care units for children. Journal of Pediatric Health Care, 22(1), 24–34.',
      url: 'https://doi.org/10.1016/j.pedhc.2007.01.006'
    },
    {
      citation: 'American Counseling Association. (2014). ACA code of ethics. Author.',
      url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf'
    }
  ]
};

function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.cards||b.flashcards)(b.cards||b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front).split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back).split(/\s+/).filter(Boolean).length;});
  if(b.nodes)b.nodes.forEach(n=>{t+=stripHTML(n.text).split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text).split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.blanks)b.blanks.forEach(bl=>{t+=stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;t+=stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;});
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.name||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
  if(b.categories)b.categories.forEach&&b.categories.forEach(cat=>t+=stripHTML(cat).split(/\s+/).filter(Boolean).length);
  if(b.cards&&b.cards[0]&&b.cards[0].text)b.cards.forEach(card=>{t+=stripHTML(card.text).split(/\s+/).filter(Boolean).length;});
}return t;}

function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words '+wc+'<'+(c.ceHours*6000));
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(i>0&&t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(t.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:activity`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push('CRITICAL:flat_options');}
if((c.assessment?.questions?.length||0)<15)e.push('CRITICAL:exam<15');
if((c.references?.length||0)<15)e.push('CRITICAL:refs<15');return{wc,e};}

async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode}|${wc}w/${COURSE.ceHours*6000}req|${COURSE.sections.length}sec|${COURSE.assessment?.questions?.length}exam|${COURSE.references?.length}refs`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('⚠️',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated');}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted');}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
