/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// CR-405 | Eternal Sunshine of the Reconnected Mind: The Neuroscience and Clinical Practice of Rebuilding Romantic Bonds
// 1 CE Hour | Movie-Themed (Clinical Skills) | ACEP Compliant | APA 7th Edition
// NBCC ACEP Provider #7760 | GAITP LLC
// Seed Script — ES Module format

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// ─── Schema ──────────────────────────────────────────────────────────────────
const questionSchema = new mongoose.Schema({
  question: String,
  type: { type: String, default: 'multiple_choice' },
  options: [String],
  correctAnswer: Number,
  explanation: String,
});

const lessonSchema = new mongoose.Schema({
  title: String,
  type: String,
  order: Number,
  content: String,
  isExam: Boolean,
  passingScore: Number,
  maxAttempts: Number,
  shuffleQuestions: Boolean,
  showExplanations: Boolean,
  questions: [questionSchema],
});

const moduleSchema = new mongoose.Schema({
  title: String,
  order: Number,
  lessons: [lessonSchema],
  contentBlocks: { type: Array, default: [] },
});

const referenceSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  source: String,
});

const courseSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String,
  subtitle: String,
  description: String,
  courseCode: String,
  instructor: String,
  ceHours: Number,
  ceCategory: String,
  ceuHours: Number,
  ceuEligible: Boolean,
  approvingBody: String,
  approvalNumber: String,
  accessType: String,
  price: Number,
  pricingTier: String,
  status: String,
  isPublished: Boolean,
  objectives: [String],
  modules: [moduleSchema],
  assessment: {
    questions: [questionSchema],
    passingScore: Number,
    maxAttempts: Number,
  },
  references: [referenceSchema],
  settings: {
    passingScore: Number,
    certificateEnabled: Boolean,
    requireEvaluation: Boolean,
    requireAttestation: Boolean,
  },
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

// ─── Course Data ──────────────────────────────────────────────────────────────
const examQuestions = [
  {
    question: "According to attachment theory, which neurochemical system is most directly responsible for the distress experienced during romantic separation?",
    type: "multiple_choice",
    options: [
      "The dopaminergic reward pathway",
      "The opioid and CRF stress systems",
      "The serotonergic mood regulation system",
      "The cholinergic memory consolidation system"
    ],
    correctAnswer: 1,
    explanation: "Fisher et al. (2016) and Panksepp (1998) identified that the opioid and corticotropin-releasing factor (CRF) stress systems mediate separation distress, not the dopamine reward pathway, which governs desire and pursuit."
  },
  {
    question: "The Gottman Institute's longitudinal research identifies which ratio of positive-to-negative interactions as a threshold predictor of relationship stability?",
    type: "multiple_choice",
    options: [
      "3:1 positive to negative interactions",
      "5:1 positive to negative interactions",
      "7:1 positive to negative interactions",
      "10:1 positive to negative interactions"
    ],
    correctAnswer: 1,
    explanation: "Gottman and Silver (2015) identified the 5:1 ratio — five positive interactions for every one negative — as the threshold below which relationships become vulnerable to dissolution."
  },
  {
    question: "In the context of Emotionally Focused Therapy (EFT), the term 'negative cycle' refers to which clinical phenomenon?",
    type: "multiple_choice",
    options: [
      "A pattern of cognitive distortions shared by both partners",
      "Recurring attachment-driven pursue-withdraw interaction patterns that escalate distress",
      "Negative self-talk that reduces a partner's self-efficacy in the relationship",
      "Chronic negative affect states that persist independently of partner behavior"
    ],
    correctAnswer: 1,
    explanation: "Johnson (2019) defined the negative cycle as the pursue-withdraw or withdraw-withdraw attachment-driven pattern that both partners enter when attachment needs feel threatened. Identifying and externalizing this cycle is the core of EFT Stage One."
  },
  {
    question: "Neuroplasticity research most directly supports which clinical intervention component for couples in conflict?",
    type: "multiple_choice",
    options: [
      "Insight-oriented catharsis about past relationship injuries",
      "Deliberate practice of new relational behaviors to form alternative neural pathways",
      "Pharmacological regulation of the HPA axis before couples therapy sessions",
      "Analysis of family-of-origin attachment schemas without behavioral rehearsal"
    ],
    correctAnswer: 1,
    explanation: "Doidge (2007) and Siegel (2010) both emphasize that neuroplasticity requires deliberate, repeated behavioral practice to consolidate new neural pathways. Insight alone does not create lasting change without behavioral rehearsal."
  },
  {
    question: "Which brain region is considered most central to the experience and regulation of romantic love, as identified through fMRI neuroimaging studies?",
    type: "multiple_choice",
    options: [
      "The prefrontal cortex and Broca's area",
      "The ventral tegmental area (VTA) and caudate nucleus",
      "The cerebellum and anterior cingulate cortex",
      "The hippocampus and parahippocampal gyrus"
    ],
    correctAnswer: 1,
    explanation: "Fisher et al. (2005) used fMRI to demonstrate that intense romantic love activates the VTA and caudate nucleus — core components of the brain's reward system — explaining the compulsive, goal-directed nature of romantic attachment."
  },
  {
    question: "The concept of 'Hold Me Tight' conversations in EFT is designed primarily to address which therapeutic goal?",
    type: "multiple_choice",
    options: [
      "Improving partners' conflict resolution and negotiation skills",
      "Creating new attachment bonding events that repair emotional disconnection",
      "Increasing partners' capacity for independent emotional regulation",
      "Reducing physiological arousal during arguments through cognitive reframing"
    ],
    correctAnswer: 1,
    explanation: "Johnson (2008) developed 'Hold Me Tight' conversations specifically to create corrective attachment experiences — bonding events that reestablish felt security and rewire the partners' attachment working models of each other."
  },
  {
    question: "Which of the following best describes the clinical phenomenon of 'flooding' as described by Gottman (1994) in couples research?",
    type: "multiple_choice",
    options: [
      "An overwhelming emotional response caused by unresolved grief in one partner",
      "Physiological arousal during conflict that exceeds 100 BPM and disrupts constructive communication",
      "Intrusive thoughts about past relationship trauma that interrupt present intimacy",
      "A cognitive state in which partners simultaneously experience emotional overwhelm"
    ],
    correctAnswer: 1,
    explanation: "Gottman (1994) defined flooding as the state in which a partner's heart rate exceeds approximately 100 BPM during conflict, activating the sympathetic nervous system in ways that make problem-solving and empathic listening physiologically impossible."
  },
  {
    question: "Oxytocin is most accurately described as contributing to romantic reconnection through which primary mechanism?",
    type: "multiple_choice",
    options: [
      "Reducing the subjective experience of physical pain during conflict",
      "Enhancing trust, affiliation, and felt social safety with an attachment figure",
      "Directly increasing libido and sexual motivation in both partners",
      "Blocking cortisol production during high-stress relational interactions"
    ],
    correctAnswer: 1,
    explanation: "Carter (1998) and subsequent research established that oxytocin's primary mechanism in romantic bonding is enhancing the experience of trust, social safety, and affiliation — not libido specifically. It reduces threat responses in the presence of attachment figures."
  },
  {
    question: "In the context of couples therapy, the term 'differentiation' as used by Bowen (1978) and later Murray (2002) refers to which capacity?",
    type: "multiple_choice",
    options: [
      "The ability to distinguish between healthy and unhealthy relationship patterns",
      "The capacity to maintain a defined sense of self while remaining emotionally connected to a partner",
      "The process of separating emotionally from family-of-origin relationships",
      "The therapeutic goal of creating individual identity outside the couple system"
    ],
    correctAnswer: 1,
    explanation: "Bowen's (1978) concept of differentiation describes the capacity to maintain a clear, stable sense of self while remaining in emotional contact with a partner — neither fusing (losing self) nor cutting off (emotional distance). This balance is central to sustainable intimacy."
  },
  {
    question: "Which of the following best describes the 'Four Horsemen' identified by Gottman (1994) as predictors of relationship dissolution?",
    type: "multiple_choice",
    options: [
      "Anger, sadness, fear, and avoidance",
      "Criticism, contempt, defensiveness, and stonewalling",
      "Jealousy, control, dishonesty, and emotional withdrawal",
      "Resentment, passivity, aggression, and projection"
    ],
    correctAnswer: 1,
    explanation: "Gottman (1994) identified criticism, contempt, defensiveness, and stonewalling as the Four Horsemen — communication patterns with the highest predictive validity for relationship dissolution. Contempt, characterized by moral superiority, was found to be the most corrosive."
  },
  {
    question: "Narrative therapy's contribution to couples work is best described as which therapeutic approach?",
    type: "multiple_choice",
    options: [
      "Helping partners rewrite their shared relationship story by identifying dominant problem-saturated narratives and building alternative accounts",
      "Using psychoeducation about narrative memory to explain why partners misremember conflict events",
      "Teaching couples to write detailed journals about their relational experiences to build insight",
      "Analyzing the cultural meta-narratives that shaped each partner's individual identity"
    ],
    correctAnswer: 0,
    explanation: "White and Epston (1990), applied to couples by Freedman and Combs (1996), describe narrative therapy as externalizing problem-saturated stories (e.g., 'our relationship is broken') and co-authoring alternative, preferred narratives. It is not primarily about memory accuracy or journaling."
  },
  {
    question: "A couple presents with chronic demand-withdraw patterns. According to EFT theory, which intervention is most clinically appropriate as a first step?",
    type: "multiple_choice",
    options: [
      "Teaching the demanding partner communication skills to reduce criticism intensity",
      "Helping the withdrawing partner develop distress tolerance for conflict conversations",
      "Identifying and de-escalating the negative cycle by naming it as the shared problem rather than attributing blame to either partner",
      "Assigning behavioral experiments in which partners practice reversed interaction roles"
    ],
    correctAnswer: 2,
    explanation: "Johnson (2019) is explicit that EFT Stage One requires de-escalation of the negative cycle before any restructuring of attachment interactions. The cycle itself — not either partner — is externalized as the common adversary. Skills-based interventions without this de-escalation are premature."
  },
  {
    question: "The concept of 'earned secure attachment' in adult relationships refers to which developmental outcome?",
    type: "multiple_choice",
    options: [
      "Security that develops through financial stability and practical life partnership",
      "The acquisition of secure attachment patterns in adulthood through corrective relational experiences, despite insecure early attachment",
      "Security achieved by completing individual psychotherapy before entering a romantic relationship",
      "The natural increase in attachment security that occurs through long-term cohabitation"
    ],
    correctAnswer: 1,
    explanation: "Siegel (2010) and Main (1991) describe earned security as the capacity for secure attachment functioning in adults who experienced insecure early attachment but subsequently encountered corrective relational experiences — in therapy, mentorship, or safe adult relationships — that revised their internal working models."
  },
  {
    question: "Which of the following interventions is most directly supported by neuroplasticity research for rebuilding romantic intimacy?",
    type: "multiple_choice",
    options: [
      "Extended discussion of past relationship grievances to achieve cathartic resolution",
      "Repetitive engagement in novel, positive shared activities that activate the dopaminergic reward system",
      "Pharmacological treatment of both partners' attachment anxiety before beginning couples therapy",
      "Psychoeducation about neuroplasticity without accompanying behavioral practice"
    ],
    correctAnswer: 1,
    explanation: "Aron et al. (2000) demonstrated that engaging in novel, self-expanding activities together reactivates the dopaminergic reward system associated with early romantic attraction. Novelty and behavioral repetition — not discussion or medication alone — drive neuroplastic change."
  },
  {
    question: "When working with couples who have experienced a relational betrayal, which sequencing of interventions reflects current evidence-based best practice?",
    type: "multiple_choice",
    options: [
      "Betrayal analysis → forgiveness work → rebuilding trust → communication skills",
      "Stabilization and crisis management → exploration of betrayal context → rebuilding attachment → forgiveness as a process",
      "Immediate forgiveness work → trauma processing → relapse prevention → skills building",
      "Individual therapy for the betrayed partner → couples therapy → forgiveness sessions → intimacy rebuilding"
    ],
    correctAnswer: 1,
    explanation: "Gordon and Baucom (1999) and Johnson's (2019) application of EFT to betrayal trauma both support beginning with stabilization, then moving to contextual understanding of the betrayal, then rebuilding attachment security. Forgiveness is a long-term process outcome, not an early intervention target."
  },
];

const courseData = {
  slug: 'eternal-sunshine-neuroscience-romantic-reconnection-cr405',
  title: 'Eternal Sunshine of the Reconnected Mind: Neuroscience and Clinical Practice of Rebuilding Romantic Bonds',
  subtitle: 'Neurological Foundations and Evidence-Based Approaches to Romantic Repair',
  description: 'Drawing on the haunting premise of Michel Gondry\'s Eternal Sunshine of the Spotless Mind — in which partners attempt to erase each other from memory, only to find their love rewiring itself along new neural pathways — this course examines what neuroscience tells us about why romantic bonds are so deeply encoded, why their disruption is so destabilizing, and what the most current evidence-based frameworks recommend for helping couples rebuild connection. Participants will explore the neurochemistry of attachment, the industry standard models for romantic repair, and practical clinical interventions grounded in neuroscience. This course is designed for licensed mental health professionals who work with couples or individuals navigating romantic relationship distress.',
  courseCode: 'CR-405',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',

  ceHours: 1,
  ceCategory: 'Clinical',
  ceuHours: 1,
  ceuEligible: true,
  approvingBody: 'NBCC',
  approvalNumber: '#7760',

  accessType: 'paid',
  price: 14.99,
  pricingTier: 'standard',

  status: 'draft',
  isPublished: false,

  objectives: [
    'Identify the primary neurochemical systems — including dopamine, oxytocin, cortisol, and endogenous opioids — involved in romantic attachment and explain their clinical relevance to relationship repair.',
    'Describe the empirical basis and core mechanisms of at least two evidence-based models for rebuilding romantic connections, including Emotionally Focused Therapy (EFT) and the Gottman Method.',
    'Apply neuroplasticity principles to clinical intervention planning with couples experiencing chronic disconnection or following a relational rupture.',
    'Recognize attachment-driven behavioral patterns — including demand-withdraw cycles, flooding, and stonewalling — and select appropriate stage-sequenced interventions.',
    'Evaluate the role of narrative, somatic, and behavioral approaches in supporting couples\' capacity to co-author a preferred relational story grounded in secure attachment.',
  ],

  modules: [
    // ─── MODULE 1 ──────────────────────────────────────────────────────────────
    {
      title: 'Module 1: The Wired Heart — Neurological Foundations of Romantic Attachment',
      order: 1,
      contentBlocks: [],
      lessons: [
        {
          title: 'The Neuroscience of Romantic Love and Attachment',
          type: 'text',
          order: 1,
          content: `
<h2>The Wired Heart: Neurological Foundations of Romantic Attachment</h2>

<h3>Introduction: When Memory Becomes Biology</h3>

<p>In Michel Gondry's 2004 film <em>Eternal Sunshine of the Spotless Mind</em>, the protagonist Joel Barish undergoes a procedure to have his former partner Clementine erased from his memory entirely — every conversation, every shared morning, every argument, every moment of tenderness surgically removed from his neural architecture. What unfolds is not relief, but a desperate, subconscious chase. Even as his memories are deleted, something deeper persists — an orientation, a pull, a sense of incompleteness that no procedure can fully excise. The film's central thesis, delivered not in dialogue but in the visceral experience of watching love resist erasure, is one that neuroscience has spent the last three decades trying to articulate empirically: romantic attachment is not a feeling. It is a biological state. It is encoded in the structure and chemistry of the brain in ways that rival, and in some cases exceed, other survival imperatives (Fisher, 2004).</p>

<p>This course begins where the film does — with the question of why romantic bonds are so deeply, sometimes agonizingly, wired into us — and proceeds to the clinical territory that follows: what happens when those bonds are disrupted, what the evidence tells us about repair, and how licensed clinicians can translate neuroscience into practical, stage-appropriate interventions for couples in distress. Understanding the neuroscience of romantic attachment is not merely academically interesting for clinicians; it is clinically necessary. When couples understand that their conflict patterns, their pain, and their longing all have neurological substrates, the shame and self-blame that often maintain their negative cycles begin to loosen (Johnson, 2019).</p>

<h3>The Brain in Love: Primary Neurochemical Systems</h3>

<p>Neuroimaging research has fundamentally transformed our understanding of romantic love. In a landmark series of fMRI studies, Fisher et al. (2005) compared brain activity in individuals who reported being intensely romantically in love with brain activity in control conditions. The results were striking: romantic love consistently activated the ventral tegmental area (VTA) and the caudate nucleus — core nodes of the brain's mesolimbic dopamine reward system. These are the same structures activated by cocaine, by food in a starving animal, and by the anticipation of a significant financial reward. This finding established that romantic love is not primarily a social or cultural construction. It is a motivational state — a goal-directed drive system whose neurological signature is indistinguishable from other primary drives for survival (Fisher, 2004).</p>

<p>The VTA produces dopamine and projects it throughout the brain, including to the caudate nucleus, which encodes goal-directed behaviors and the craving for reward. When a romantic partner is present, the system is satiated; when the partner is absent, estranged, or lost, the system is chronically activated in a state of unmet craving. This is why the early stages of romantic loss produce symptoms that clinically resemble opioid withdrawal — the restlessness, the intrusive thoughts, the compulsive focus on the absent partner, the inability to concentrate on anything else (Fisher, 2016). For clinicians working with individuals experiencing relationship ruptures, this neurological context reframes what might otherwise appear as excessive dependence or irrationality. The pain of romantic loss is physiologically real, not metaphorical.</p>

<p>Alongside the dopaminergic reward system, two additional neurochemical systems are central to the clinical picture of romantic attachment. Oxytocin, synthesized in the hypothalamus and released by the posterior pituitary, is the neurohormone most directly associated with bonding, trust, and felt social safety (Carter, 1998). Released during physical touch, eye contact, sexual intimacy, and moments of emotional vulnerability and attunement, oxytocin reduces threat responses in the amygdala, dampens cortisol production, and creates the neurochemical substrate of felt security — the experience of being safe with another person (Feldman, 2017). Vasopressin, closely related to oxytocin, appears to be particularly associated with partner-specific bonding and fidelity behaviors, especially in males, and has been linked to the formation of long-term pair bonds in both animal and human studies (Young &amp; Wang, 2004).</p>

<p>The endogenous opioid system adds a third dimension. Panksepp (1998) identified that the same opioid receptors engaged by morphine are activated by social connection and deactivated by social loss. This finding explains the analgesic quality of a partner's presence in times of physical pain — touch from an attachment figure literally reduces pain perception via the opioid system — and conversely, why relationship rupture produces a pain response in the dorsal anterior cingulate cortex (dACC) that is neurologically indistinguishable from physical pain (Eisenberger et al., 2003). The phrase "heartbreak" is not poetic license; it reflects a neurological reality that clinicians must take seriously.</p>

<h3>Attachment Theory Through a Neurological Lens</h3>

<p>John Bowlby's attachment theory (1969, 1973) was formulated decades before modern neuroimaging existed, yet its clinical observations have proven to be a remarkably accurate map of the brain's social architecture. Bowlby proposed that humans are biologically organized to form selective emotional bonds with specific caregivers — bonds that function as a safe haven (a source of comfort under threat) and a secure base (a platform for exploration and growth). When proximity to the attachment figure is threatened, an attachment behavioral system activates — the person protests, pursues, and attempts to reestablish contact. If contact is restored, the system deactivates and the person returns to baseline. If contact fails to be restored, the person may move through phases of despair and eventual detachment (Bowlby, 1973).</p>

<p>Adult romantic partnerships operate on precisely the same neurological architecture. Johnson and Whiffen (1999) demonstrated that adult romantic partners function as primary attachment figures for each other, activating the same proximity-seeking, safe-haven, and secure-base systems identified by Bowlby in infant-caregiver dyads. When a partner fails to respond to attachment bids — through emotional unavailability, withdrawal, contempt, or chronic conflict — the attachment behavioral system activates in both partners simultaneously but typically in inverse directions: one partner pursues and escalates, attempting to restore contact; the other withdraws, attempting to regulate the overwhelm of the attachment activation. This is the demand-withdraw cycle that Gottman (1994) identified as one of the most reliable predictors of long-term relationship dissatisfaction.</p>

<p>From a neurological perspective, this cycle is a collision of two dysregulated nervous systems, each organized around an unmet attachment need. The pursuing partner's sympathetic nervous system is in activation — the hyperarousal, urgency, and escalation of protest behavior. The withdrawing partner's nervous system has frequently moved through an initial sympathetic spike into a form of dorsal vagal shutdown — the numbing, disengagement, and emotional flatness of a system that has learned to manage overwhelm through disconnection (Porges, 2011). Neither partner is being intentionally hurtful. Both are, from a neurological standpoint, doing the only thing their nervous system knows how to do under attachment threat.</p>

<h3>The Stress Biology of Relational Conflict</h3>

<p>Chronic relational conflict does not merely create psychological distress; it produces measurable physiological dysregulation with long-term health consequences. Kiecolt-Glaser and Newton (2001) reviewed a substantial body of research linking marital conflict to immunosuppression, slower wound healing, elevated inflammatory markers, and increased vulnerability to cardiovascular disease. The mechanism is the hypothalamic-pituitary-adrenal (HPA) axis: under conditions of perceived threat — including the threat of attachment rupture — cortisol is released, preparing the body for fight-or-flight response. When this stress response is activated chronically by relational conflict, the prolonged cortisol exposure degrades physical health, cognitive functioning, and paradoxically, the capacity for the empathy and emotional attunement that relationship repair requires (Gottman, 1994).</p>

<p>Gottman's (1994) concept of <em>flooding</em> captures this physiological reality at the micro level. When a partner's heart rate during conflict exceeds approximately 100 beats per minute, their prefrontal cortex — the seat of executive function, perspective-taking, and emotional regulation — is effectively taken offline by sympathetic nervous system activation. At this point, no amount of communication skill or therapeutic insight can be accessed; the nervous system is in survival mode. Gottman's recommendation of deliberate physiological self-soothing — pausing the conversation for a minimum of 20 minutes before returning to it — is not merely a time-management strategy. It is a neurobiologically grounded intervention that allows cortisol levels to return to baseline, restoring the prefrontal cortex's capacity for constructive engagement (Gottman &amp; Silver, 2015).</p>

<p>Understanding this stress biology has direct clinical implications. Partners who appear "shut down," "cold," or "checked out" during couples sessions may be in dorsal vagal states rather than consciously choosing emotional disengagement. Partners who appear "irrational," "explosive," or "hysterical" may be flooded — their prefrontal cortex genuinely offline. Clinicians who can name this neurological reality without pathologizing either partner create a shared framework that depersonalizes the conflict and opens space for regulatory interventions before any attachment work can proceed.</p>

<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">Bowlby, J. (1969). <em>Attachment and loss: Vol. 1. Attachment</em>. Basic Books.</p>
  <p class="cr-reference">Bowlby, J. (1973). <em>Attachment and loss: Vol. 2. Separation: Anxiety and anger</em>. Basic Books.</p>
  <p class="cr-reference">Carter, C. S. (1998). Neuroendocrine perspectives on social attachment and love. <em>Psychoneuroendocrinology, 23</em>(8), 779–818. https://doi.org/10.1016/S0306-4530(98)00055-9</p>
  <p class="cr-reference">Eisenberger, N. I., Lieberman, M. D., &amp; Williams, K. D. (2003). Does rejection hurt? An fMRI study of social exclusion. <em>Science, 302</em>(5643), 290–292. https://doi.org/10.1126/science.1089134</p>
  <p class="cr-reference">Feldman, R. (2017). The neurobiology of human attachments. <em>Trends in Cognitive Sciences, 21</em>(2), 80–99. https://doi.org/10.1016/j.tics.2016.11.007</p>
  <p class="cr-reference">Fisher, H. E. (2004). <em>Why we love: The nature and chemistry of romantic love</em>. Henry Holt.</p>
  <p class="cr-reference">Fisher, H. E., Aron, A., &amp; Brown, L. L. (2005). Romantic love: An fMRI study of a neural mechanism for mate choice. <em>Journal of Comparative Neurology, 493</em>(1), 58–62. https://doi.org/10.1002/cne.20772</p>
  <p class="cr-reference">Fisher, H. E., Xu, X., Aron, A., &amp; Brown, L. L. (2016). Intense, passionate, romantic love: A natural addiction? How the fields that investigate romance and substance abuse can inform each other. <em>Frontiers in Psychology, 7</em>, 687. https://doi.org/10.3389/fpsyg.2016.00687</p>
  <p class="cr-reference">Gottman, J. M. (1994). <em>What predicts divorce? The relationship between marital processes and marital outcomes</em>. Lawrence Erlbaum Associates.</p>
  <p class="cr-reference">Gottman, J. M., &amp; Silver, N. (2015). <em>The seven principles for making marriage work</em> (Rev. ed.). Harmony Books.</p>
  <p class="cr-reference">Johnson, S. M., &amp; Whiffen, V. E. (1999). Made to measure: Adapting emotionally focused couple therapy to partners' attachment styles. <em>Clinical Psychology: Science and Practice, 6</em>(4), 366–381. https://doi.org/10.1093/clipsy/6.4.366</p>
  <p class="cr-reference">Kiecolt-Glaser, J. K., &amp; Newton, T. L. (2001). Marriage and health: His and hers. <em>Psychological Bulletin, 127</em>(4), 472–503. https://doi.org/10.1037/0033-2909.127.4.472</p>
  <p class="cr-reference">Panksepp, J. (1998). <em>Affective neuroscience: The foundations of human and animal emotions</em>. Oxford University Press.</p>
  <p class="cr-reference">Porges, S. W. (2011). <em>The polyvagal theory: Neurophysiological foundations of emotions, attachment, communication, and self-regulation</em>. W. W. Norton.</p>
  <p class="cr-reference">Young, L. J., &amp; Wang, Z. (2004). The neurobiology of pair bonding. <em>Nature Neuroscience, 7</em>(10), 1048–1054. https://doi.org/10.1038/nn1327</p>
</div>
          `,
        },
        {
          title: 'Knowledge Check: Neuroscience of Romantic Attachment',
          type: 'quiz',
          order: 2,
          isExam: false,
          showExplanations: true,
          shuffleQuestions: false,
          questions: [
            {
              question: "Fisher et al.'s (2005) fMRI research identified which brain structures as most active during intense romantic love?",
              type: "multiple_choice",
              options: [
                "The amygdala and hippocampus",
                "The ventral tegmental area (VTA) and caudate nucleus",
                "The prefrontal cortex and anterior cingulate cortex",
                "The insula and parietal lobe"
              ],
              correctAnswer: 1,
              explanation: "Fisher et al. (2005) found consistent activation of the VTA and caudate nucleus — core dopaminergic reward structures — during states of intense romantic love, establishing romantic attachment as a primary motivational drive system."
            },
            {
              question: "According to Porges' (2011) Polyvagal Theory, a withdrawing partner who appears 'shut down' during conflict may neurologically be in which state?",
              type: "multiple_choice",
              options: [
                "Sympathetic hyperarousal",
                "Parasympathetic ventral vagal engagement",
                "Dorsal vagal shutdown",
                "Prefrontal cortex dominance"
              ],
              correctAnswer: 2,
              explanation: "Porges (2011) describes dorsal vagal shutdown as the nervous system's response to overwhelming threat — a freeze/collapse state involving emotional numbing and disconnection, distinct from the ventral vagal social engagement system and sympathetic fight-or-flight activation."
            },
            {
              question: "Gottman's (1994) concept of 'flooding' during couples conflict refers primarily to which physiological threshold?",
              type: "multiple_choice",
              options: [
                "Cortisol levels exceeding normal diurnal variation",
                "Heart rate exceeding approximately 100 BPM, impairing prefrontal function",
                "Oxytocin depletion following extended emotional argument",
                "Sympathetic activation that persists for more than 45 minutes"
              ],
              correctAnswer: 1,
              explanation: "Gottman (1994) defined flooding as occurring when heart rate during conflict exceeds approximately 100 BPM, effectively disrupting the prefrontal cortex's capacity for empathy, problem-solving, and emotional regulation — making productive conversation physiologically impossible at that moment."
            },
          ],
        },
      ],
    },

    // ─── MODULE 2 ──────────────────────────────────────────────────────────────
    {
      title: 'Module 2: Industry Standards for Rebuilding Romantic Connections',
      order: 2,
      contentBlocks: [],
      lessons: [
        {
          title: 'Evidence-Based Models for Romantic Repair',
          type: 'text',
          order: 1,
          content: `
<h2>Industry Standards for Rebuilding Romantic Connections: Evidence-Based Approaches</h2>

<h3>The Clinical Landscape: From Insight to Intervention</h3>

<p>For much of the twentieth century, couples therapy occupied an uncertain scientific status — practiced widely but studied inconsistently, with outcome data that was methodologically difficult to interpret. That landscape has changed substantially since the 1990s, driven by the intersection of attachment science, neuroimaging research, and increasingly rigorous randomized clinical trial methodology. Today, three models command the strongest empirical support for rebuilding romantic connections in clinical contexts: Emotionally Focused Couples Therapy (EFT), the Gottman Method, and Integrative Behavioral Couples Therapy (IBCT). Each has distinct theoretical foundations and intervention sequences, but all share a commitment to the premise that what disrupts romantic bonds is fundamentally knowable, and that what repairs them is teachable (Lebow et al., 2012).</p>

<p>The film <em>Eternal Sunshine of the Spotless Mind</em> offers a useful clinical metaphor at this juncture. Joel and Clementine, having erased each other, are left not with emptiness but with an inexplicable gravitational pull toward each other — meeting again as strangers who nonetheless feel achingly familiar. What the film suggests, and what neuroplasticity research confirms, is that the neural traces of significant attachment relationships do not fully disappear. They may be suppressed, buried under new learning, or disconnected from conscious access, but the relational circuitry — the way one's nervous system has organized itself around and toward another person — persists. This is simultaneously a source of suffering and a source of clinical hope. The pathways are there. The work of therapy is to create the conditions in which new, more functional relational behaviors can be practiced until they themselves become the dominant circuitry (Doidge, 2007).</p>

<h3>Emotionally Focused Couples Therapy: The Attachment-Based Standard</h3>

<p>Emotionally Focused Therapy (EFT), developed by Susan Johnson and Leslie Greenberg in the 1980s and subsequently elaborated by Johnson (2004, 2019) into its current form, is the most extensively researched model for couples in relationship distress. EFT is built on three theoretical pillars: attachment theory, humanistic experiential therapy, and systems theory. Its central clinical hypothesis is that relational distress is fundamentally an attachment problem — not a communication problem, a personality mismatch, or an incompatibility issue — and that lasting relationship repair requires the creation of new bonding experiences that revise both partners' emotional experience of each other and their internal working models of the relationship (Johnson, 2004).</p>

<p>EFT proceeds through three stages and nine steps. Stage One — De-escalation — focuses on identifying, naming, and interrupting the negative cycle. The clinician works to help both partners recognize that the cycle itself (the pursue-withdraw, the attack-shutdown, the stonewalling-pursuit escalation) is the problem, rather than either partner's character or intentions. This externalization of the cycle is not merely a reframing technique; it is a neurologically significant intervention. Partners who are in an activated threat state toward each other — whose amygdalae are treating each other as sources of danger — cannot access the prefrontal capacity for perspective-taking and empathy that attachment repair requires. De-escalating the cycle is, at the neurological level, creating conditions for the prefrontal cortex to come back online (Siegel, 2010).</p>

<p>Stage Two — Restructuring Attachment — involves deepening access to the primary attachment emotions and needs underlying each partner's position in the cycle, and facilitating new attachment conversations in which previously hidden vulnerability is expressed and responded to with empathy and engagement. Johnson (2008) describes nine specific "Hold Me Tight" conversations designed to create what she calls <em>bonding events</em> — corrective emotional experiences within the therapy room that directly revise both partners' working models of each other. From a neuroplasticity standpoint, these bonding events function as experiential learning: they create new neural associations between the partner's presence and the experience of felt security, gradually replacing the existing association between the partner and threat (Doidge, 2007).</p>

<p>Stage Three — Consolidation — involves integrating the new relational patterns, developing a coherent narrative of the couple's journey, and anticipating future vulnerabilities. EFT has a randomized controlled trial evidence base showing 70–73% of couples moving from distress to recovery, with a 90% significant improvement rate and follow-up data indicating that gains are maintained or continue to grow at two-year follow-up (Johnson et al., 1999). It is particularly well-supported for populations including couples in which one partner meets criteria for depression, post-traumatic stress, or chronic illness (Johnson, 2019).</p>

<h3>The Gottman Method: From Longitudinal Science to Clinical Practice</h3>

<p>John Gottman's approach to couples therapy is unusual in clinical psychology in that it emerged not from a theoretical model but from decades of longitudinal observational research. Beginning in the 1970s, Gottman and colleagues observed couples in naturalistic conflict conversations, coding their interactions at the behavioral, physiological, and emotional levels, and then followed them over years and even decades. From this data, Gottman identified what he called the "Four Horsemen" of relationship dissolution: criticism (attacking a partner's character rather than addressing a behavior), contempt (moral superiority and disgust toward a partner), defensiveness (self-protection through counter-attack or self-victimization), and stonewalling (emotional withdrawal and shutdown) (Gottman, 1994).</p>

<p>Of the Four Horsemen, contempt was found to be the most toxic and the most predictive of dissolution. Physiologically, being treated with contempt activates an immune-suppressing stress response; longitudinal data showed that spouses in high-contempt marriages reported significantly more infectious illnesses than those in low-contempt marriages (Gottman, 1994). Contempt is, in neurological terms, a direct assault on an attachment figure's social value and worth — it activates the same threat systems as physical danger. The Gottman Method's first clinical target is therefore not communication skill, but the elimination of contempt through the cultivation of what Gottman calls a <em>culture of appreciation</em>: the deliberate practice of acknowledging, respecting, and expressing fondness for a partner (Gottman &amp; Silver, 2015).</p>

<p>The Gottman Sound Relationship House model conceptualizes the couple relationship as a seven-story structure, with each story representing a domain of relational functioning. The foundation consists of Love Maps (the depth of knowledge each partner has of the other's inner world), Fondness and Admiration (the culture of positive regard), and Turning Toward (the habit of responding to each other's bids for connection). These three foundational stories are collectively termed the Friendship System, and Gottman's data indicate that they account for the largest share of variance in long-term relationship satisfaction — more than conflict management, shared values, or sexual compatibility (Gottman &amp; Silver, 2015).</p>

<p>Rebuilding the Friendship System through the Gottman Method involves structured exercises to rebuild love maps (open-ended conversations about each partner's current inner life, dreams, worries, and joys), daily appreciation practices (specific, behaviorally grounded expressions of fondness rather than global positive statements), and turning-toward rituals (brief, repeated bids for connection throughout the day — a question asked, a hand touched, a text sent). These behavioral practices are not superficial; at the neurological level, they are accumulating positive valence associations with the partner, gradually restoring the dopaminergic reward signal that is depleted in chronically distressed couples and rebuilding the oxytocin-mediated trust that conflict has eroded (Gottman &amp; Silver, 2015).</p>

<h3>Integrative Behavioral Couples Therapy: Acceptance as the Precondition for Change</h3>

<p>Developed by Jacobson and Christensen (1996) and subsequently refined by Christensen et al. (2004, 2015), Integrative Behavioral Couples Therapy (IBCT) departs from traditional behavioral couples therapy (TBCT) in one significant respect: it identifies <em>acceptance</em> of a partner's enduring characteristics — not merely behavior change — as an equally important and often prior therapeutic target. IBCT's central theoretical claim is that many couples are locked in distress not because their problems are unsolvable but because their expectation that their partner should be fundamentally different from who they are creates a chronic state of failure and resentment.</p>

<p>IBCT distinguishes between "hard" problems — incompatibilities that reflect genuine, enduring differences in personality, values, or temperament — and "soft" problems — surface conflicts that mask underlying emotional pain and vulnerability. Hard problems, in IBCT's framework, require acceptance interventions (empathic joining, unified detachment, tolerance building). Soft problems, once the underlying emotional reality is accessed, often yield to traditional change-oriented interventions (behavior exchange, communication training). Christensen et al. (2010) conducted the largest randomized controlled trial of couples therapy to date, comparing IBCT with TBCT. Both modalities produced significant improvement in relationship satisfaction, but IBCT showed a small advantage in long-term maintenance, suggesting that the acceptance dimension provides greater stability of gains (Christensen et al., 2010).</p>

<h3>Neuroplasticity as the Unifying Clinical Framework</h3>

<p>Across EFT, the Gottman Method, and IBCT, a unifying neurological principle emerges: the brain changes through repeated, emotionally salient experience, and relationship repair is ultimately a project of guided neuroplastic change. Norman Doidge's (2007) synthesis of neuroplasticity research established that the brain remains malleable across the lifespan — that neurons that fire together wire together, and that the neural pathways encoding relational expectations, emotional responses, and behavioral patterns can be revised through new experience. This is why EFT's bonding events work: they are experiential, emotionally salient, and repeated enough to create alternative neural associations. It is why the Gottman Method's daily appreciation and turning-toward practices work: they are repetitive behavioral activations of the reward and bonding systems. It is why IBCT's acceptance work works: it creates a fundamentally different emotional experience of the partner's unchangeable qualities, revising the neural valence of those qualities from threat to (at minimum) neutral.</p>

<p>Aron et al.'s (2000) self-expansion research adds an important additional dimension to the neuroplasticity framework. In a series of experimental studies, Aron and colleagues found that engaging in novel, self-expanding activities together — activities that challenge both partners and involve learning something new — reactivated the dopaminergic reward system associated with early romantic attraction. This finding suggests that one practical pathway to romantic reconnection involves not only the therapeutic processing of negative cycles but the deliberate introduction of novelty and shared challenge into the couple's relational repertoire. Adventure, learning, and mild shared risk activate the same neural systems that made early romantic attraction so compelling, creating a biological substrate for re-romanticization that is independent of conflict resolution (Aron et al., 2000).</p>

<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">Aron, A., Norman, C. C., Aron, E. N., McKenna, C., &amp; Heyman, R. E. (2000). Couples' shared participation in novel and arousing activities and experienced relationship quality. <em>Journal of Personality and Social Psychology, 78</em>(2), 273–284. https://doi.org/10.1037/0022-3514.78.2.273</p>
  <p class="cr-reference">Christensen, A., Atkins, D. C., Baucom, B., &amp; Yi, J. (2010). Marital status and satisfaction five years following a randomized clinical trial comparing traditional versus integrative behavioral couple therapy. <em>Journal of Consulting and Clinical Psychology, 78</em>(2), 225–235. https://doi.org/10.1037/a0018132</p>
  <p class="cr-reference">Doidge, N. (2007). <em>The brain that changes itself: Stories of personal triumph from the frontiers of brain science</em>. Viking.</p>
  <p class="cr-reference">Gottman, J. M. (1994). <em>What predicts divorce? The relationship between marital processes and marital outcomes</em>. Lawrence Erlbaum Associates.</p>
  <p class="cr-reference">Gottman, J. M., &amp; Silver, N. (2015). <em>The seven principles for making marriage work</em> (Rev. ed.). Harmony Books.</p>
  <p class="cr-reference">Jacobson, N. S., &amp; Christensen, A. (1996). <em>Integrative couple therapy: Promoting acceptance and change</em>. W. W. Norton.</p>
  <p class="cr-reference">Johnson, S. M. (2004). <em>The practice of emotionally focused couple therapy: Creating connection</em> (2nd ed.). Brunner-Routledge.</p>
  <p class="cr-reference">Johnson, S. M. (2008). <em>Hold me tight: Seven conversations for a lifetime of love</em>. Little, Brown Spark.</p>
  <p class="cr-reference">Johnson, S. M. (2019). <em>Attachment theory in practice: Emotionally focused therapy with individuals, couples, and families</em>. Guilford Press.</p>
  <p class="cr-reference">Johnson, S. M., Hunsley, J., Greenberg, L., &amp; Schindler, D. (1999). Emotionally focused couples therapy: Status and challenges. <em>Clinical Psychology: Science and Practice, 6</em>(1), 67–79. https://doi.org/10.1093/clipsy/6.1.67</p>
  <p class="cr-reference">Lebow, J. L., Chambers, A. L., Christensen, A., &amp; Johnson, S. M. (2012). Research on the treatment of couple distress. <em>Journal of Marital and Family Therapy, 38</em>(1), 145–168. https://doi.org/10.1111/j.1752-0606.2011.00249.x</p>
  <p class="cr-reference">Siegel, D. J. (2010). <em>Mindsight: The new science of personal transformation</em>. Bantam Books.</p>
</div>
          `,
        },
        {
          title: 'Knowledge Check: Evidence-Based Models for Romantic Repair',
          type: 'quiz',
          order: 2,
          isExam: false,
          showExplanations: true,
          shuffleQuestions: false,
          questions: [
            {
              question: "EFT Stage One is primarily focused on which clinical task?",
              type: "multiple_choice",
              options: [
                "Teaching communication skills and 'I' statements",
                "De-escalating the negative cycle by externalizing it as the shared problem",
                "Exploring each partner's family-of-origin attachment history",
                "Creating bonding events through vulnerable emotional disclosure"
              ],
              correctAnswer: 1,
              explanation: "Johnson (2019) is explicit that EFT Stage One — De-escalation — focuses on identifying and interrupting the negative cycle, externalizing it as the shared enemy. Attachment restructuring (bonding events) belongs to Stage Two and cannot be effective without first de-escalating the cycle."
            },
            {
              question: "The Gottman Method's 'Sound Relationship House' identifies which foundational layer as accounting for the largest share of long-term relationship satisfaction?",
              type: "multiple_choice",
              options: [
                "Effective conflict management and repair attempts",
                "The Friendship System: Love Maps, Fondness and Admiration, and Turning Toward",
                "Shared values, life meaning, and couple culture",
                "Sexual compatibility and physical intimacy"
              ],
              correctAnswer: 1,
              explanation: "Gottman and Silver (2015) identify the three-story Friendship System (Love Maps, Fondness and Admiration, Turning Toward) as the foundational determinant of long-term satisfaction — accounting for more variance than conflict management or shared values."
            },
            {
              question: "Aron et al.'s (2000) self-expansion research suggests which practical intervention supports romantic reconnection through neuroplastic reactivation of the reward system?",
              type: "multiple_choice",
              options: [
                "Increasing frequency of deep conflict resolution conversations",
                "Engaging in novel, challenging activities together as a couple",
                "Practicing daily affirmations about the relationship's positive qualities",
                "Reducing relational novelty to restore predictability and felt security"
              ],
              correctAnswer: 1,
              explanation: "Aron et al. (2000) found that novel, self-expanding shared activities reactivate the dopaminergic reward system associated with early romantic attraction — providing a neuroplastic basis for re-romanticization distinct from conflict resolution processes."
            },
          ],
        },
      ],
    },

    // ─── MODULE 3 ──────────────────────────────────────────────────────────────
    {
      title: 'Module 3: Clinical Application — Translating Neuroscience Into Practice',
      order: 3,
      contentBlocks: [],
      lessons: [
        {
          title: 'Applying Neurological Insights in Couples Therapy',
          type: 'text',
          order: 1,
          content: `
<h2>Clinical Application: Translating Neuroscience Into Couples Practice</h2>

<h3>From Theory to Treatment Room: A Stage-Sensitive Framework</h3>

<p>The convergence of neuroimaging research, attachment science, and clinical outcomes data creates a coherent framework for practice that is more than the sum of its theoretical parts. Understanding that romantic distress is neurobiologically mediated does not reduce clinical work to medication management or brain scanning; it deepens the precision with which clinicians can select, sequence, and explain their interventions to couples who are often bewildered by the intensity of what they are experiencing. The film <em>Eternal Sunshine of the Spotless Mind</em> ends not with resolution but with a choice — Joel and Clementine, knowing their history, deciding to try again anyway. This is, from a neuroscience perspective, the most honest possible ending: recovery from romantic rupture is not erasure. It is the deliberate construction of new neural pathways alongside the old, until the new ones become dominant (Doidge, 2007). Clinicians do not erase the past; they help couples build toward a different future.</p>

<p>A neuroscience-informed, stage-sensitive framework for clinical practice requires attention to three sequential priorities: first, establishing physiological regulation as a precondition for relational work; second, creating conditions for attachment-level emotional processing; and third, consolidating new relational patterns through behavioral practice and shared narrative. Each stage has specific intervention targets, and attempting to work at a later stage before the earlier one is established is consistently associated with treatment failure (Johnson, 2019).</p>

<h3>Stage One: Physiological Regulation and Safety</h3>

<p>No attachment work can occur while either partner's nervous system is in a survival-oriented state. Before exploring the emotional architecture of the negative cycle, the clinician must establish two foundational conditions: the capacity for physiological self-regulation during heightened emotion, and a baseline level of felt safety within the therapeutic environment itself. Porges' (2011) polyvagal theory provides the clinical language for this: the ventral vagal social engagement system — the neurological substrate of the capacity for attunement, empathy, and collaborative communication — is accessible only when the threat detection system (the amygdala and sympathetic activation) is sufficiently quiescent.</p>

<p>Practically, this means that early sessions with highly reactive or recently ruptured couples often require explicit psychoeducation about the neurobiology of conflict, followed by the introduction of physiological regulation practices. Gottman and Silver (2015) recommend the practice of physiological self-soothing — identifying personal arousal signals early (jaw tension, narrowed attention, increased voice volume), taking deliberate breaks before flooding threshold is crossed, and engaging in 20–30 minutes of genuinely distracting activity before attempting to return to difficult conversations. This is not avoidance; it is nervous system first aid, and framing it as such reduces the shame that the withdrawing partner often experiences when they "shut down" and the frustration the pursuing partner experiences when conversation is interrupted (Gottman &amp; Silver, 2015).</p>

<p>Somatic interventions drawn from trauma-informed approaches are increasingly being integrated into couples work for pairs with significant trauma histories or particularly dysregulated nervous systems. Van der Kolk's (2014) body-based trauma work, applied to couples by Tatkin (2011) in the Psychobiological Approach to Couple Therapy (PACT), emphasizes that the body is the first site of relational experience and therefore a primary site of relational repair. Practices that ground partners in their physical experience — slow, deliberate breathing, mutual eye contact held briefly and safely, the deliberate co-regulation of two nervous systems through physical proximity — build the ventral vagal tone that makes the emotional work of later stages possible (Tatkin, 2011).</p>

<h3>Stage Two: Attachment Emotional Processing and Bonding Events</h3>

<p>Once physiological regulation is established as a shared skill and therapeutic safety is sufficient, the work can deepen into the attachment-level emotional processing that distinguishes surface-level behavior change from genuine relational transformation. Johnson's (2019) EFT framework is the most detailed clinical map of this territory. The clinician's task is to help each partner access, name, and express the primary attachment emotions and needs that lie beneath their secondary reactive positions in the cycle.</p>

<p>In clinical practice, this typically involves working with the withdrawing partner first — not because the pursuing partner's experience is less important, but because the pursuing partner's escalation is frequently a response to the withdrawing partner's inaccessibility. When the withdrawing partner can, with the clinician's support, make contact with and express their own underlying fear, vulnerability, or longing — and when the pursuing partner can receive this disclosure with empathy rather than skepticism — a micro-level bonding event occurs (Johnson, 2004). This moment is not merely emotionally meaningful; it is neurologically significant. The withdrawing partner's limbic system is associating the act of vulnerability with safety rather than danger. The pursuing partner's threat system is receiving new information: the partner's withdrawal was not indifference but overwhelm. Both partners' internal working models of each other are being updated in real time (Siegel, 2010).</p>

<p>These bonding events must be repeated and varied to create durable neural change. A single corrective experience shifts emotional state; repeated corrective experiences revise neural architecture (Doidge, 2007). EFT's nine conversation framework (Johnson, 2008) is, in this light, a structured curriculum for repeated bonding experiences across the range of attachment-relevant themes: acknowledging the negative cycle, finding the raw spots (attachment injuries that sensitize one or both partners), revisiting past relational injuries, engaging authentically, forgiving injuries, engaging in sex and touch from a place of security, and keeping the relationship alive. Each conversation targets a different attachment dimension, creating a comprehensive neuroplastic renovation of how both partners experience the relationship.</p>

<h3>Relational Trauma and the Betrayal Recovery Process</h3>

<p>A significant subset of couples presenting for romantic reconnection work have experienced what Johnson (2019) terms an "attachment injury" — a specific event of betrayal, abandonment, or failure in a moment of acute need that has fundamentally disrupted felt security in the relationship. This category encompasses but is not limited to sexual infidelity, emotional affairs, significant deception, failure to provide support during illness or loss, or abandonment during crisis. Attachment injuries are distinct from chronic relational distress in that they function as traumatic memories: they are encoded with the high emotional valence and intrusive quality of traumatic experience, and they are repeatedly accessed when current events trigger their neural associations (Makinen &amp; Johnson, 2006).</p>

<p>Gordon and Baucom's (1999) therapeutic framework for betrayal recovery identifies three non-negotiable stages: (1) impact assessment and stabilization — understanding the full scope of the betrayal and containing the acute crisis; (2) contextual meaning-making — understanding the conditions, vulnerabilities, and patterns that contributed to the betrayal without excusing it; and (3) relational rebuilding — gradually reconstructing trust, intimacy, and a shared future narrative. Forgiveness, in this framework, is not a prerequisite for Stage 3 but a potential outcome of it — and it is distinguished from condoning, forgetting, or the premature reconciliation that often results from the betrayed partner's attachment anxiety driving them toward false resolution (Gordon &amp; Baucom, 1999).</p>

<p>Neurologically, betrayal recovery involves the gradual development of what might be called <em>conditional trust</em> — a revised internal working model of the partner that neither returns to the pre-betrayal naivety nor remains frozen in the post-betrayal threat state. Makinen and Johnson's (2006) study of attachment injury resolution in EFT found that successful resolution — characterized by both partners being able to discuss the injury without the betrayed partner becoming flooded and without the offending partner becoming defensive — was associated with significant increases in relationship satisfaction and attachment security at follow-up. The key therapeutic mechanism was the offending partner's capacity to genuinely access and express remorse at an attachment level, not merely a behavioral one.</p>

<h3>Narrative and Meaning-Making in Romantic Reconnection</h3>

<p>The third pillar of neuroscience-informed romantic repair is the consolidation of new relational patterns through shared narrative. Siegel (2010) argues that the capacity to tell a coherent, integrated story about one's relational history — including its ruptures, repairs, and ongoing vulnerabilities — is itself a marker of secure attachment and a vehicle for its development. Couples who cannot construct a shared narrative of "how we got here and where we are going" remain vulnerable to the pull of old neural patterns, because those patterns are supported by an implicit, unspoken story about the relationship's fundamental nature (Johnson, 2008).</p>

<p>The narrative therapy tradition, applied to couples by Freedman and Combs (1996) following White and Epston's (1990) foundational framework, offers specific tools for this work. Externalizing conversations — in which the problem (the negative cycle, the contempt, the disconnection) is treated linguistically as separate from either partner's identity — reduce the shame and blame that maintain it. Unique outcomes work identifies moments when the couple successfully departed from their dominant problem-saturated story, building an evidence base for the preferred relational narrative. Re-authoring conversations invite the couple to explicitly articulate what values and commitments they want their relationship to embody, and to identify the small, concrete behaviors that would constitute living those commitments in daily life.</p>

<p>The film's ending — Joel and Clementine standing on a frozen beach, their recorded voices cataloguing their incompatibilities, choosing to proceed anyway — is, in narrative therapy terms, a re-authoring moment. They cannot erase the dominant story. They can, however, choose to begin writing a different one. This is the territory that Stage Three of evidence-based couples therapy inhabits: not the absence of a difficult history, but the development of a preferred narrative robust enough to orient the relationship forward (Johnson, 2004).</p>

<h3>Somatic and Behavioral Practices for Daily Relational Maintenance</h3>

<p>A significant gap in many couples' experience of therapy is the transition from the insights developed in the treatment room to sustainable behavioral change in daily life. Neuroplasticity research is clear that insight without repetitive behavioral practice does not produce lasting neural change (Doidge, 2007). For couples rebuilding romantic connection, this means that the therapeutic hour is not the primary site of change; it is the context in which couples learn what to practice in the other 167 hours of their week. Clinicians who fail to operationalize the emotional insights generated in sessions into specific, repeatable daily behaviors are inadvertently limiting the neuroplastic impact of their work.</p>

<p>Tatkin's (2011) Psychobiological Approach to Couple Therapy (PACT) provides one of the most concrete frameworks for translating neurobiological understanding into daily relational practice. Tatkin identifies the couple relationship as a two-person regulatory system — a dyadic unit in which each partner's nervous system is continually influencing the other's. From this premise, he derives specific daily practices designed to maintain the ventral vagal social engagement state between partners: greeting and departure rituals that involve sustained physical contact and eye contact (at minimum 20 seconds, which is the threshold for oxytocin release); a daily check-in conversation of five to ten minutes focused exclusively on the other partner's inner experience, without problem-solving; and deliberate repair attempts within 24 hours of any conflict that produces lingering negative affect in either partner (Tatkin, 2011).</p>

<p>These practices are neuroscientifically grounded. The 20-second contact threshold for oxytocin release has been supported by research demonstrating that brief physical contact does not reliably produce the oxytocin-mediated trust and safety effects that sustained touch does (Feldman, 2017). The daily check-in targets Love Maps — Gottman's (2015) term for the depth of each partner's knowledge of the other's current inner world — which longitudinal research identifies as one of the most reliable buffers against relational erosion during periods of external stress. The 24-hour repair window reflects neurological data on the half-life of cortisol and the window during which unrepaired conflict is most likely to consolidate into lasting resentment rather than being metabolized and released (Gottman &amp; Silver, 2015).</p>

<p>Mindfulness-based practices have also been integrated into couples work, with growing evidence of neurological benefit. Carson et al. (2004) conducted a randomized trial of a mindfulness-based relationship enhancement intervention with non-distressed couples and found significant improvements in relationship satisfaction, autonomy, relatedness, and closeness, as well as increases in partners' individual wellbeing. The proposed mechanisms include the mindfulness-trained capacity for non-reactive attention to present-moment experience — which, in a relational context, translates to the ability to observe a partner's behavior without immediately triggering threat-mediated reactivity — and the increased interoceptive awareness that allows partners to recognize their own physiological arousal states before they reach the flooding threshold (Carson et al., 2004).</p>

<p>For clinicians, the practical implication is that couples therapy should include explicit homework assignments calibrated to the couple's current stage of repair, with neurobiological rationale provided to increase compliance. Research on therapeutic homework completion consistently shows that rationale — specifically, understanding why a practice works — significantly improves adherence compared to instruction alone (Kazantzis et al., 2010). Telling a couple "touch for 20 seconds when you arrive home because that's the oxytocin threshold" is more effective than saying "try to be warmer with each other." The neuroscience is not simply academic; it is a clinical tool for increasing the probability that the behavioral changes that drive neuroplastic repair will actually occur.</p>

<h3>Ethical and Multicultural Considerations</h3>

<p>Clinicians working with couples seeking romantic reconnection carry ethical responsibilities that the neuroscience framing does not diminish. A neurological understanding of romantic bonds must not be used to pressure couples toward reconciliation when one or both partners' safety is at risk. Domestic violence, coercive control, and emotional abuse require safety assessment as the absolute first clinical priority, and couples therapy is contraindicated in the presence of ongoing violence or coercive control (American Association for Marriage and Family Therapy [AAMFT], 2015). The capacity of the attachment and neuroplasticity frameworks to explain why individuals remain in harmful relationships — the opioid system's literal activation in the presence of the abusive partner, the trauma-bonding that fear and intermittent reinforcement create — should deepen the clinician's compassion for these clients, not provide a rationale for couples therapy where individual safety work is indicated.</p>

<p>Cultural humility is equally non-negotiable in romantic repair work. The evidence-based models reviewed in this course were developed predominantly in North American, Western, individualistic cultural contexts, and their assumptions about the primacy of emotional expression, individual autonomy within partnership, and egalitarian communication styles may not align with the values and relational structures of clients from collectivist, interdependent, or non-Western cultural traditions (Falicov, 1995). Clinicians must continuously examine their own cultural assumptions about what a "healthy" romantic relationship looks like, and approach each couple's relational goals and definitions of connection with genuine curiosity and respect.</p>

<p>The neuroscience of romantic attachment, properly understood, supports this multicultural humility: the deep structures of attachment — the need for proximity, felt safety, and responsive attunement — appear to be cross-culturally universal (Mikulincer &amp; Shaver, 2016). The forms these needs take, and the culturally specific behaviors through which they are expressed and satisfied, are enormously varied. The clinician's task is to honor both the universality and the particularity.</p>

<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">Carson, J. W., Carson, K. M., Gil, K. M., &amp; Baucom, D. H. (2004). Mindfulness-based relationship enhancement. <em>Behavior Therapy, 35</em>(3), 471–494. https://doi.org/10.1016/S0005-7894(04)80028-5</p>
  <p class="cr-reference">Kazantzis, N., Whittington, C., &amp; Dattilio, F. (2010). Meta-analysis of homework effects in cognitive and behavioral therapy: A replication and extension. <em>Clinical Psychology: Science and Practice, 17</em>(2), 144–156. https://doi.org/10.1111/j.1468-2850.2010.01204.x</p>
  <p class="cr-reference">American Association for Marriage and Family Therapy. (2015). <em>AAMFT code of ethics</em>. https://www.aamft.org/Legal_Ethics/Code_of_Ethics.aspx</p>
  <p class="cr-reference">Doidge, N. (2007). <em>The brain that changes itself: Stories of personal triumph from the frontiers of brain science</em>. Viking.</p>
  <p class="cr-reference">Falicov, C. J. (1995). Training to think culturally: A multidimensional comparative framework. <em>Family Process, 34</em>(4), 373–388. https://doi.org/10.1111/j.1545-5300.1995.00373.x</p>
  <p class="cr-reference">Freedman, J., &amp; Combs, G. (1996). <em>Narrative therapy: The social construction of preferred realities</em>. W. W. Norton.</p>
  <p class="cr-reference">Gordon, K. C., &amp; Baucom, D. H. (1999). A multitheoretical intervention for promoting recovery from extramarital affairs. <em>Clinical Psychology: Science and Practice, 6</em>(4), 382–399. https://doi.org/10.1093/clipsy/6.4.382</p>
  <p class="cr-reference">Johnson, S. M. (2004). <em>The practice of emotionally focused couple therapy: Creating connection</em> (2nd ed.). Brunner-Routledge.</p>
  <p class="cr-reference">Johnson, S. M. (2008). <em>Hold me tight: Seven conversations for a lifetime of love</em>. Little, Brown Spark.</p>
  <p class="cr-reference">Johnson, S. M. (2019). <em>Attachment theory in practice: Emotionally focused therapy with individuals, couples, and families</em>. Guilford Press.</p>
  <p class="cr-reference">Makinen, J. A., &amp; Johnson, S. M. (2006). Resolving attachment injuries in couples using emotionally focused therapy: Steps toward forgiveness and reconciliation. <em>Journal of Consulting and Clinical Psychology, 74</em>(6), 1055–1064. https://doi.org/10.1037/0022-006X.74.6.1055</p>
  <p class="cr-reference">Mikulincer, M., &amp; Shaver, P. R. (2016). <em>Attachment in adulthood: Structure, dynamics, and change</em> (2nd ed.). Guilford Press.</p>
  <p class="cr-reference">Porges, S. W. (2011). <em>The polyvagal theory: Neurophysiological foundations of emotions, attachment, communication, and self-regulation</em>. W. W. Norton.</p>
  <p class="cr-reference">Siegel, D. J. (2010). <em>Mindsight: The new science of personal transformation</em>. Bantam Books.</p>
  <p class="cr-reference">Tatkin, S. (2011). <em>Wired for love: How understanding your partner's brain and attachment style can help you defuse conflict and build a secure relationship</em>. New Harbinger Publications.</p>
  <p class="cr-reference">van der Kolk, B. A. (2014). <em>The body keeps the score: Brain, mind, and body in the healing of trauma</em>. Viking.</p>
  <p class="cr-reference">White, M., &amp; Epston, D. (1990). <em>Narrative means to therapeutic ends</em>. W. W. Norton.</p>
</div>
          `,
        },
        {
          title: 'Final Examination: Eternal Sunshine — Neuroscience and Clinical Practice of Romantic Reconnection',
          type: 'quiz',
          order: 2,
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          shuffleQuestions: true,
          showExplanations: false,
          questions: examQuestions,
        },
      ],
    },
  ],

  assessment: {
    questions: examQuestions,
    passingScore: 80,
    maxAttempts: 3,
  },

  references: [
    { title: "Attachment and loss: Vol. 1. Attachment", author: "Bowlby, J.", year: 1969, source: "Basic Books" },
    { title: "Attachment and loss: Vol. 2. Separation: Anxiety and anger", author: "Bowlby, J.", year: 1973, source: "Basic Books" },
    { title: "Neuroendocrine perspectives on social attachment and love", author: "Carter, C. S.", year: 1998, source: "Psychoneuroendocrinology, 23(8), 779–818" },
    { title: "The brain that changes itself", author: "Doidge, N.", year: 2007, source: "Viking" },
    { title: "Does rejection hurt? An fMRI study of social exclusion", author: "Eisenberger, N. I., Lieberman, M. D., & Williams, K. D.", year: 2003, source: "Science, 302(5643), 290–292" },
    { title: "The neurobiology of human attachments", author: "Feldman, R.", year: 2017, source: "Trends in Cognitive Sciences, 21(2), 80–99" },
    { title: "Why we love: The nature and chemistry of romantic love", author: "Fisher, H. E.", year: 2004, source: "Henry Holt" },
    { title: "Romantic love: An fMRI study of a neural mechanism for mate choice", author: "Fisher, H. E., Aron, A., & Brown, L. L.", year: 2005, source: "Journal of Comparative Neurology, 493(1), 58–62" },
    { title: "Intense, passionate, romantic love: A natural addiction?", author: "Fisher, H. E., Xu, X., Aron, A., & Brown, L. L.", year: 2016, source: "Frontiers in Psychology, 7, 687" },
    { title: "Cultural sensitivity in couples therapy", author: "Falicov, C. J.", year: 1995, source: "Family Process, 34(4), 373–388" },
    { title: "Narrative therapy: The social construction of preferred realities", author: "Freedman, J., & Combs, G.", year: 1996, source: "W. W. Norton" },
    { title: "A multitheoretical intervention for promoting recovery from extramarital affairs", author: "Gordon, K. C., & Baucom, D. H.", year: 1999, source: "Clinical Psychology: Science and Practice, 6(4), 382–399" },
    { title: "What predicts divorce?", author: "Gottman, J. M.", year: 1994, source: "Lawrence Erlbaum Associates" },
    { title: "The seven principles for making marriage work", author: "Gottman, J. M., & Silver, N.", year: 2015, source: "Harmony Books" },
    { title: "Integrative couple therapy: Promoting acceptance and change", author: "Jacobson, N. S., & Christensen, A.", year: 1996, source: "W. W. Norton" },
    { title: "The practice of emotionally focused couple therapy: Creating connection", author: "Johnson, S. M.", year: 2004, source: "Brunner-Routledge" },
    { title: "Hold me tight: Seven conversations for a lifetime of love", author: "Johnson, S. M.", year: 2008, source: "Little, Brown Spark" },
    { title: "Attachment theory in practice", author: "Johnson, S. M.", year: 2019, source: "Guilford Press" },
    { title: "Emotionally focused couples therapy: Status and challenges", author: "Johnson, S. M., Hunsley, J., Greenberg, L., & Schindler, D.", year: 1999, source: "Clinical Psychology: Science and Practice, 6(1), 67–79" },
    { title: "Made to measure: Adapting EFT to partners' attachment styles", author: "Johnson, S. M., & Whiffen, V. E.", year: 1999, source: "Clinical Psychology: Science and Practice, 6(4), 366–381" },
    { title: "Marriage and health: His and hers", author: "Kiecolt-Glaser, J. K., & Newton, T. L.", year: 2001, source: "Psychological Bulletin, 127(4), 472–503" },
    { title: "Research on the treatment of couple distress", author: "Lebow, J. L., Chambers, A. L., Christensen, A., & Johnson, S. M.", year: 2012, source: "Journal of Marital and Family Therapy, 38(1), 145–168" },
    { title: "Resolving attachment injuries in couples using EFT", author: "Makinen, J. A., & Johnson, S. M.", year: 2006, source: "Journal of Consulting and Clinical Psychology, 74(6), 1055–1064" },
    { title: "Attachment in adulthood: Structure, dynamics, and change", author: "Mikulincer, M., & Shaver, P. R.", year: 2016, source: "Guilford Press" },
    { title: "Affective neuroscience: The foundations of human and animal emotions", author: "Panksepp, J.", year: 1998, source: "Oxford University Press" },
    { title: "The polyvagal theory", author: "Porges, S. W.", year: 2011, source: "W. W. Norton" },
    { title: "Mindsight: The new science of personal transformation", author: "Siegel, D. J.", year: 2010, source: "Bantam Books" },
    { title: "Wired for love", author: "Tatkin, S.", year: 2011, source: "New Harbinger Publications" },
    { title: "The body keeps the score", author: "van der Kolk, B. A.", year: 2014, source: "Viking" },
    { title: "The neurobiology of pair bonding", author: "Young, L. J., & Wang, Z.", year: 2004, source: "Nature Neuroscience, 7(10), 1048–1054" },
    { title: "Narrative means to therapeutic ends", author: "White, M., & Epston, D.", year: 1990, source: "W. W. Norton" },
    { title: "Couples' shared participation in novel and arousing activities and experienced relationship quality", author: "Aron, A., Norman, C. C., Aron, E. N., McKenna, C., & Heyman, R. E.", year: 2000, source: "Journal of Personality and Social Psychology, 78(2), 273–284" },
    { title: "Marital status and satisfaction five years following a randomized clinical trial comparing IBCT vs TBCT", author: "Christensen, A., Atkins, D. C., Baucom, B., & Yi, J.", year: 2010, source: "Journal of Consulting and Clinical Psychology, 78(2), 225–235" },
  ],

  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true,
  },
};

// ─── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await Course.findOne({ slug: courseData.slug });
  if (existing) {
    await Course.deleteOne({ slug: courseData.slug });
    console.log('Removed existing CR-405 document');
  }

  const course = new Course(courseData);
  await course.save();
  console.log(`✅ CR-405 seeded: ${course.title}`);
  console.log(`   Slug: ${course.slug}`);
  console.log(`   Modules: ${course.modules.length}`);
  console.log(`   Exam questions: ${examQuestions.length}`);
  console.log(`   References: ${course.references.length}`);
  console.log(`   Status: ${course.status}`);

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
