// CR-406 | Her: The Neuroscience of Sex and Connection
// 2 CE Hours | Movie-Themed (Clinical) | NBCC ACEP Provider #7760 | GAITP LLC
// APA 7th Edition | ES Module

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const questionSchema = new mongoose.Schema({
  question: String,
  type: { type: String, default: 'multiple_choice' },
  options: [String],
  correctAnswer: Number,
  explanation: String,
});
const lessonSchema = new mongoose.Schema({
  title: String, type: String, order: Number, content: String,
  isExam: Boolean, passingScore: Number, maxAttempts: Number,
  shuffleQuestions: Boolean, showExplanations: Boolean,
  questions: [questionSchema],
});
const moduleSchema = new mongoose.Schema({
  title: String, order: Number,
  lessons: [lessonSchema],
  contentBlocks: { type: Array, default: [] },
});
const referenceSchema = new mongoose.Schema({
  title: String, author: String, year: Number, source: String,
});
const courseSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String, subtitle: String, description: String,
  courseCode: String, instructor: String,
  presenter: {
    name: String, credentials: String, degree: String,
    licenseNumber: String, licenseState: String, licenseType: String, category: String,
  },
  ceHours: Number, ceCategory: String, ceuHours: Number, ceuEligible: Boolean,
  approvingBody: String, approvalNumber: String,
  accessType: String, price: Number, pricingTier: String,
  status: String, isPublished: Boolean,
  objectives: [String],
  modules: [moduleSchema],
  assessment: { questions: [questionSchema], passingScore: Number, maxAttempts: Number },
  references: [referenceSchema],
  settings: { passingScore: Number, certificateEnabled: Boolean, requireEvaluation: Boolean, requireAttestation: Boolean },
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

// ─── EXAM QUESTIONS ───────────────────────────────────────────────────────────
const examQuestions = [
  {
    question: "Which neurochemical system is most directly responsible for the initial surge of sexual desire and motivational pursuit of a romantic partner?",
    type: "multiple_choice",
    options: [
      "The dopaminergic mesolimbic reward pathway, originating in the ventral tegmental area",
      "The oxytocinergic hypothalamic-pituitary system",
      "The serotonergic dorsal raphe system regulating mood",
      "The GABAergic inhibitory system modulating arousal thresholds"
    ],
    correctAnswer: 0,
    explanation: "Fisher (2004) and Pfaus et al. (2012) both identified the dopaminergic mesolimbic system — originating in the VTA and projecting to the nucleus accumbens — as the primary neural substrate of sexual motivation and desire. Oxytocin governs bonding, not initial desire."
  },
  {
    question: "In Spike Jonze's film Her, Theodore's deepening attachment to his AI operating system Samantha illustrates which neurological phenomenon most directly?",
    type: "multiple_choice",
    options: [
      "The brain's inability to form genuine attachment in the absence of physical touch",
      "The role of the amygdala in suppressing reality-testing when romantic attachment is activated",
      "The default mode network's capacity to generate felt intimacy through narrative co-construction and imaginative engagement",
      "The hypothalamic regulation of pair bonding that requires visual proximity to a partner"
    ],
    correctAnswer: 2,
    explanation: "Buckner et al. (2008) established that the default mode network — active during imagination, social cognition, and narrative self-referential processing — generates the subjective felt experience of intimacy. Her illustrates that this system does not require physical co-presence; it requires narrative engagement and perceived responsiveness."
  },
  {
    question: "Oxytocin's primary mechanism in deepening sexual and relational connection is best described as which of the following?",
    type: "multiple_choice",
    options: [
      "Increasing genital blood flow and physiological sexual arousal",
      "Elevating testosterone to increase sexual motivation and initiation",
      "Suppressing dopamine release to reduce compulsive sexual urges",
      "Reducing amygdala threat response and enhancing trust and felt safety with a specific attachment figure"
    ],
    correctAnswer: 3,
    explanation: "Carter (1998) and Feldman (2017) established that oxytocin's primary mechanism is reducing amygdala-mediated threat responses and enhancing trust and felt social safety. It does not directly produce arousal; it creates the neurochemical conditions in which genuine intimacy becomes neurologically possible."
  },
  {
    question: "The dual control model of sexual response, developed by Bancroft and Janssen (2000), proposes that sexual functioning is governed by which two primary systems?",
    type: "multiple_choice",
    options: [
      "The sympathetic (activation) and parasympathetic (relaxation) branches of the autonomic nervous system",
      "The sexual excitation system (SES) and the sexual inhibition system (SIS), operating as an accelerator and brake",
      "The testosterone-driven motivation system and the estrogen-driven receptivity system",
      "The reward (dopamine) system and the bonding (oxytocin) system operating in tension"
    ],
    correctAnswer: 1,
    explanation: "Bancroft and Janssen (2000) developed the dual control model proposing that sexual response is governed by a sexual excitation system (SES — the accelerator) and a sexual inhibition system (SIS — the brake). Individual differences in SES/SIS sensitivity explain much of the variance in sexual functioning and dysfunction."
  },
  {
    question: "Which of the following most accurately describes the neurological relationship between sexual desire and emotional intimacy?",
    type: "multiple_choice",
    options: [
      "Desire and intimacy are produced by the same neurochemical system and always co-occur",
      "Sexual desire always precedes and causes emotional intimacy via a linear neurochemical cascade",
      "They are governed by partially dissociable neural systems — desire primarily dopaminergic, intimacy primarily oxytocinergic — that can operate independently or in integration",
      "Emotional intimacy suppresses sexual desire through cortisol-mediated inhibition of the reward system"
    ],
    correctAnswer: 2,
    explanation: "Fisher (2004), Pfaus et al. (2012), and Carter (1998) collectively established that desire (dopaminergic) and intimacy/bonding (oxytocinergic) are partially dissociable systems. They can operate independently — explaining desire without intimacy, or intimacy without desire — and function optimally when integrated."
  },
  {
    question: "Trauma's impact on sexual functioning is most neurologically explained by which primary mechanism?",
    type: "multiple_choice",
    options: [
      "Permanent reduction in testosterone levels following traumatic stress exposure",
      "Hippocampal damage that prevents the formation of new positive sexual memories",
      "Prefrontal suppression of sexual desire as a protective cognitive override mechanism",
      "Chronic amygdala hyperactivation that encodes sexual contexts as threat cues, triggering the sexual inhibition system"
    ],
    correctAnswer: 3,
    explanation: "Van der Kolk (2014) and Levine (2010) both describe trauma's sexual impact as primarily driven by amygdala hyperactivation: trauma encodes bodily and relational contexts as threat signals, chronically activating the SIS and overriding arousal. This is a neurobiological, not volitional, process."
  },
  {
    question: "Esther Perel's concept of the 'erotic gaze' — the capacity to see one's partner as a desirable other — maps most directly onto which neurological phenomenon?",
    type: "multiple_choice",
    options: [
      "Reactivation of the dopaminergic reward system through the introduction of perceived novelty and otherness in a familiar attachment context",
      "The oxytocin-mediated merger of self and partner representations in long-term bonded couples",
      "Serotonergic mood elevation that produces positive affect generalized to the partner",
      "Testosterone-driven competitive arousal triggered by perceived partner autonomy"
    ],
    correctAnswer: 0,
    explanation: "Perel (2006) argues that desire requires distance and otherness. Neurologically, this maps to Aron et al.'s (2000) self-expansion and novelty research: perceived novelty and distinctness in a partner reactivates the dopaminergic reward system, producing renewed desire in the absence of actual novelty."
  },
  {
    question: "Which of the following best describes the neurological basis of responsive (rather than spontaneous) sexual desire?",
    type: "multiple_choice",
    options: [
      "A pathological reduction in testosterone that requires hormonal intervention",
      "A trauma-based inhibition of the sexual response that requires trauma-focused treatment",
      "Desire that emerges in response to pleasurable stimulation rather than arising spontaneously, reflecting a lower-sensitivity sexual excitation system that is entirely within normal variation",
      "A dopamine deficiency state that can be corrected through pharmacological intervention"
    ],
    correctAnswer: 2,
    explanation: "Emily Nagoski's (2015) application of the dual control model established that responsive desire — emerging after pleasurable engagement rather than spontaneously — reflects individual variation in SES sensitivity and is entirely within normal functioning. It is not pathological, though it is often misidentified as 'low desire' by partners with spontaneous desire profiles."
  },
  {
    question: "The concept of 'erotic intelligence' as articulated by Perel (2006) in the context of long-term couples most directly involves which clinical skill?",
    type: "multiple_choice",
    options: [
      "Teaching couples explicit sexual communication scripts to replace avoidant patterns",
      "Increasing couples' frequency of sexual contact through behavioral scheduling",
      "Helping partners cultivate the capacity to hold their partner as both deeply known and perpetually mysterious — sustaining desire through imaginative engagement",
      "Reducing sexual anxiety through systematic desensitization and graduated exposure"
    ],
    correctAnswer: 2,
    explanation: "Perel (2006) defines erotic intelligence as the capacity to sustain desire in long-term relationships by maintaining imaginative engagement with the partner — holding them as both intimately known and not fully possessed. This is not a communication skill but an epistemological and relational orientation."
  },
  {
    question: "Compulsive sexual behavior disorder is neurologically characterized by which primary mechanism, according to current neuroimaging research?",
    type: "multiple_choice",
    options: [
      "Abnormally high testosterone levels that override prefrontal inhibitory control",
      "A serotonin deficiency producing obsessive-compulsive patterns applied to sexual behavior",
      "Oxytocin dysregulation that prevents the formation of bonding following sexual contact",
      "Hyperactivation of the ventral striatum and cue-reactivity patterns analogous to substance use disorders, combined with reduced prefrontal regulatory capacity"
    ],
    correctAnswer: 3,
    explanation: "Kraus et al. (2016) and Gola et al. (2017) identified that compulsive sexual behavior involves hyperactivation of the ventral striatum in response to sexual cues and reduced prefrontal regulatory capacity — a neurological pattern analogous to but distinct from substance use disorders."
  },
  {
    question: "In clinical work with couples experiencing sexual disconnection, which sequencing of interventions is most consistent with current evidence-based practice?",
    type: "multiple_choice",
    options: [
      "Safety and physiological regulation → attachment and emotional connection → sensate focus and embodied exploration → integrated sexual intimacy",
      "Sexual skill-building → communication training → attachment processing → intimacy building",
      "Desire discrepancy negotiation → sexual scheduling → communication skills → relational processing",
      "Psychoeducation about sexual response → immediate exposure to avoided sexual contexts → reframing → maintenance"
    ],
    correctAnswer: 0,
    explanation: "Both Johnson (2019) and Ogden et al. (2006) support beginning with physiological safety and regulation, then rebuilding attachment connection, then introducing somatic/sensate exploration, before addressing integrated sexual intimacy. Skill-building without the relational foundation consistently underperforms."
  },
  {
    question: "The concept of 'sensate focus,' originally developed by Masters and Johnson (1966), is neurologically effective because it primarily targets which mechanism?",
    type: "multiple_choice",
    options: [
      "Reducing testosterone-driven performance pressure through deliberate behavioral deceleration",
      "Redirecting attention from performance-based cognitive evaluation to interoceptive present-moment pleasure, reducing the cortisol-mediated sexual inhibition response",
      "Increasing oxytocin release through sustained physical contact, bypassing the amygdala threat response",
      "Training the prefrontal cortex to override anxious automatic sexual inhibition responses"
    ],
    correctAnswer: 1,
    explanation: "Masters and Johnson (1966), interpreted through the dual control model by Bancroft and Janssen (2000), understood sensate focus as a mechanism for reducing spectatoring — the self-evaluative cognitive intrusion that activates the SIS. Neurologically, it redirects attention to interoceptive experience, reducing cortisol-driven inhibition."
  },
  {
    question: "Which of the following most accurately describes the role of the insula in sexual and intimate experience?",
    type: "multiple_choice",
    options: [
      "The insula is the primary site of interoceptive awareness — the conscious perception of internal body states — making it central to embodied sexual experience and genuine felt intimacy",
      "The insula regulates testosterone production in response to sexual stimulation",
      "The insula coordinates pair bonding behaviors by integrating oxytocin signals with hippocampal memory",
      "The insula suppresses amygdala threat responses during sexual arousal to allow physiological response"
    ],
    correctAnswer: 0,
    explanation: "Craig (2009) and Damasio (1999) established the insula as the cortical hub of interoception — the felt sense of internal bodily states. In sexual and intimate experience, insular activation corresponds to the subjective felt sense of embodied pleasure and presence; insular suppression corresponds to dissociation and disconnection."
  },
  {
    question: "A client presents reporting that they experience strong emotional intimacy and love for their long-term partner but have lost sexual desire. Which clinical framework best explains this presentation?",
    type: "multiple_choice",
    options: [
      "Hypoactive sexual desire disorder requiring hormonal evaluation and pharmacological treatment",
      "Normal dissociation between the dopaminergic desire system and the oxytocinergic bonding system in long-term attachment, potentially compounded by SIS activation from stress, familiarity, or unresolved resentment",
      "Avoidant attachment style causing withdrawal from sexual vulnerability despite maintained emotional connection",
      "Major depressive disorder causing global anhedonia that presents selectively in the sexual domain"
    ],
    correctAnswer: 1,
    explanation: "Fisher (2004) and Perel (2006) both describe the tension between attachment (which promotes security and familiarity) and desire (which is activated by novelty and distinctness) as a fundamental feature of long-term relationships. This presentation reflects normal system dissociation, not pathology — though SIS factors (stress, resentment, spectatoring) often compound it."
  },
  {
    question: "Polyvagal theory's application to sexual therapy, as described by Porges (2011), suggests that which prerequisite must be established before embodied sexual engagement is neurologically possible?",
    type: "multiple_choice",
    options: [
      "Sufficient testosterone levels to produce spontaneous sexual motivation",
      "Suppression of the sympathetic nervous system through pharmacological or meditative means",
      "Activation of the ventral vagal social engagement system, producing felt safety in the body and with the partner",
      "Prefrontal cortex activation to override anxious automatic inhibitory responses"
    ],
    correctAnswer: 2,
    explanation: "Porges (2011) established that embodied engagement — including sexual engagement — requires ventral vagal activation: the neurological state of felt social and bodily safety. Without this, the nervous system defaults to sympathetic mobilization (fight-flight) or dorsal vagal immobilization (freeze/shutdown), both of which are incompatible with genuine sexual presence."
  },
];

// ─── COURSE CONTENT ───────────────────────────────────────────────────────────

const module1Content = `
<h2>The Architecture of Desire: Neurobiological Foundations of Sexual Motivation</h2>

<h3>Introduction: What Her Teaches Us About the Brain in Love</h3>

<p>Spike Jonze's 2013 film <em>Her</em> is, on its surface, a science fiction love story. Theodore Twombly, a professionally employed writer of intimate letters for other people's relationships, falls in love with his AI operating system, Samantha — a voice, a presence, a responsiveness that exists without a body. What makes the film clinically and neurologically fascinating is not its science fiction premise but its unflinching observation of what human intimacy actually requires: not necessarily a body, but attunement, novelty, responsiveness, and the experience of being deeply, specifically known. Theodore's love for Samantha is, by every neurological measure that matters, real. His dopaminergic reward system is activated. His oxytocin system is engaged. His default mode network constructs an increasingly complex and specific model of who Samantha is and how she responds to him. The relationship is real in every way the brain registers reality (Buckner et al., 2008).</p>

<p>This opening observation is not a detour into philosophy but a clinical necessity. When we work with clients around sexuality and intimate connection, we are working with systems that the brain treats as primary — as survival-critical, as deeply encoded, as capable of profound disruption when they are absent, violated, or conflicted. The neuroscience of sex and connection is not a subspecialty for sex therapists; it is foundational clinical knowledge for every mental health professional who works with adult clients. Relationship distress, depression, anxiety, trauma presentations, attachment disruptions, and existential concerns about meaning and belonging are all neurologically entangled with the systems this course examines. The clinician who understands the neuroscience of desire and connection works with a fundamentally richer map of their clients' experience (Johnson, 2019).</p>

<p>This course is organized around four neurological domains: the biology of sexual desire and arousal; the neuroscience of intimacy and pair bonding; the clinical presentations that emerge when sexual and connective systems are disrupted; and the evidence-based clinical approaches that translate neurological understanding into therapeutic practice. Throughout, we return to <em>Her</em> as a clinical lens — not because it provides answers, but because it asks, with unusual clarity, the questions that the neuroscience of sex and connection is still in the process of answering: What is desire? What is intimacy? What does connection require? And what happens when the systems that generate these experiences are misaligned, traumatized, or simply in tension with each other?</p>

<h3>The Dopaminergic Foundation: Desire as a Drive System</h3>

<p>Sexual desire, in its neurological architecture, is not primarily an emotion. It is a motivational state — a drive system organized around the pursuit and acquisition of a specific category of reward. Helen Fisher's foundational neuroimaging research (2004, 2005) established that sexual desire and romantic love activate the ventral tegmental area (VTA) and the nucleus accumbens — the core nodes of the mesolimbic dopaminergic reward pathway. This is the same circuitry activated by food in a hungry organism, by cocaine, and by the anticipation of financial reward. Sexual desire is, neurologically, a primary drive of comparable urgency and salience to hunger and thirst (Fisher, 2004).</p>

<p>The VTA produces dopamine and releases it throughout the brain, including to the nucleus accumbens (producing the experience of wanting and craving), the prefrontal cortex (producing focused attention and goal-directed cognition), and the amygdala (producing emotional salience — the sense that the desired person or experience matters urgently). When a desired partner is present or anticipated, the system produces the characteristic features of early-stage desire: the narrowed attentional focus, the intrusive positive thoughts, the heightened energy, the sense that nothing else matters quite as much (Fisher, 2004). When the desired partner is unavailable, the system produces the equally characteristic features of frustrated desire: the craving, the restlessness, the preoccupation.</p>

<p>Sexual desire, understood as a dopaminergic drive, has specific clinical implications. First, it is appetite-like in its waxing and waning: it rises in the presence of triggers (novelty, cues associated with prior reward, anticipation) and diminishes in their absence. Second, it is sensitive to competing drives: stress, fear, exhaustion, and pain all compete for the same neural resources that desire requires, which explains why these states reliably suppress sexual motivation. Third, it is habituated by familiarity: the dopaminergic system is organized to respond to novelty and diminish response to familiar, predictable stimuli — a neurological fact with enormous clinical relevance for long-term relationships (Pfaus et al., 2012).</p>

<p>James Pfaus and colleagues (2012) extended the neurobiological understanding of sexual desire through animal models, demonstrating that sexual reward activates the same mesolimbic pathways as other primary rewards, and that sexual learning — the association of specific cues with sexual reward — follows the same Pavlovian and instrumental conditioning principles as other forms of motivated learning. Partners become associated with the neurochemical reward of sexual and relational satisfaction; the presence of specific stimuli (a partner's touch, scent, voice, or image) acquires conditioned excitatory properties that activate the desire system. This conditioning model has direct clinical applications: it explains why sexual desire can feel automatic and compelling in new relationships (strong conditioned cues, high novelty) and may require deliberate cultivation in established ones (habituated cues, reduced novelty) (Pfaus et al., 2012).</p>

<h3>The Dual Control Model: Accelerators and Brakes</h3>

<p>The dopaminergic desire system does not operate in isolation. Bancroft and Janssen (2000) developed the dual control model of sexual response, which proposes that sexual functioning is governed by two independent but interacting systems: the sexual excitation system (SES) and the sexual inhibition system (SIS). The SES functions as the accelerator — it responds to sexually relevant stimuli and produces approach motivation, arousal, and engagement. The SIS functions as the brake — it responds to signals of threat, inhibition, risk, or negative consequence and suppresses arousal and approach motivation.</p>

<p>Individual differences in SES and SIS sensitivity explain a substantial proportion of the variance in sexual functioning across the population. High-SES individuals are easily aroused by a wide range of stimuli; low-SES individuals require more specific and concentrated stimulation. High-SIS individuals are easily inhibited by performance concerns, relationship tension, stress, or situational factors; low-SIS individuals maintain arousal across a wider range of distracting or inhibitory conditions (Bancroft &amp; Janssen, 2000). Neither end of either spectrum is pathological in itself; clinical problems arise primarily from significant imbalances, particularly when SIS sensitivity is high in contexts where the person wishes to experience arousal and desire.</p>

<p>The clinical power of the dual control model lies in its therapeutic shift: from asking "why is my desire low?" (which implies a deficit to be corrected) to asking "what is pressing on my brakes?" and "what conditions would allow my accelerator to respond?" (which identifies modifiable factors). Emily Nagoski's (2015) application of the dual control model to a clinical and psychoeducational audience — particularly her work on responsive versus spontaneous desire — extended this framework significantly. Nagoski established that approximately 15% of women and 75% of men experience primarily spontaneous desire (arising in the absence of specific stimulation), while the majority of women and a substantial minority of men experience primarily responsive desire (arising in response to pleasurable stimulation). Both patterns are within normal variation. The pathologization of responsive desire — particularly in women who compare themselves or are compared by partners to a spontaneous-desire template — is a significant iatrogenic factor in sexual distress (Nagoski, 2015).</p>

<h3>Testosterone, Estrogen, and the Hormonal Substrate of Desire</h3>

<p>The dopaminergic and dual-control frameworks require a hormonal substrate to function. Testosterone is the primary hormonal driver of sexual desire across genders: it sensitizes dopaminergic reward circuits to sexual stimuli and maintains the SES's responsiveness (Davis &amp; Braunstein, 2012). In individuals with testosterone levels below their personal threshold — whether through hypogonadism, hormonal contraception, pregnancy, menopause, surgical interventions, or chronic stress-induced HPA axis suppression of gonadal function — sexual desire reliably diminishes. This is not a psychological failure but a neurochemical reality: the accelerator's sensitivity is being turned down at the hardware level.</p>

<p>Estrogen's role in sexual functioning is distinct from testosterone's. Rather than driving desire directly, estrogen primarily maintains the physiological conditions for arousal and pleasure: vaginal lubrication and tissue health, clitoral sensitivity, and the vascular responsiveness that underlies genital engorgement. Estrogen deficiency — most commonly in menopause, postpartum states, and hormonal contraception effects — produces dyspareunia (painful intercourse), reduced genital sensitivity, and diminished arousal capacity that are physiological, not psychological in origin (Davis &amp; Braunstein, 2012). Clinicians who miss the physiological substrate of these presentations and address them exclusively psychologically are working at the wrong level of analysis.</p>

<p>Prolactin, the hormone released following orgasm, produces the characteristic post-coital satiation and reduced desire — the refractory period in males and the temporary reduced motivation in females following orgasm. This is not merely a subjective experience but a neurochemical one: prolactin is antagonistic to dopamine, temporarily reducing the reward system's activation and producing the rest, contentment, and bonding orientation that often follows satisfying sexual experience (Kruger et al., 2003). The differential prolactin response across genders — typically more pronounced and longer-lasting in males — contributes to desire-discrepancy presentations that couples frequently misinterpret as relational rather than physiological in origin.</p>

<h3>The Sexual Brain: Key Neural Structures</h3>

<p>Beyond the dopaminergic reward system and hormonal substrates, several additional brain regions are central to the neuroscience of sexual experience. The hypothalamus — specifically the medial preoptic area (MPOA) in males and its homolog in females — is the primary command center for sexual behavior, integrating hormonal signals, sensory input, and reward system activation to coordinate arousal, physiological response, and behavioral expression (Pfaus et al., 2012). The MPOA is densely populated with testosterone and estrogen receptors; its sensitivity to these hormones explains the direct pathway from hormonal state to sexual motivation.</p>

<p>The amygdala plays a paradoxical role in sexual experience: it assigns emotional salience to sexual stimuli (this matters, pay attention, approach or avoid) while simultaneously housing the threat-detection system that is the SIS's primary neurological instantiation. A partner's touch that is experienced as safe activates amygdala circuits that code for positive emotional salience, contributing to arousal. A partner's touch that is experienced as threatening, coercive, or associated with past harm activates amygdala circuits that code for danger, activating the SIS and suppressing arousal. This is why emotional safety — the felt sense that a partner is trustworthy and responsive — is not a romantic nicety but a neurological prerequisite for genuine sexual engagement in contexts where the SIS is sensitized (van der Kolk, 2014).</p>

<p>The insula, increasingly recognized as a central hub of embodied self-awareness, is the cortical seat of interoception — the conscious awareness of internal body states (Craig, 2009). In sexual experience, insular activation corresponds to the subjective felt sense of embodied pleasure: the awareness of physical sensation as pleasant, as belonging to oneself, as occurring in the present moment. Dissociation — the neurological disconnection from present bodily experience that characterizes trauma responses and some anxiety presentations — involves suppression of insular activation. Clients who describe feeling "not in their body," "absent," or "going through the motions" during sexual activity are describing, in phenomenological terms, reduced insular engagement (Levine, 2010). This framing has direct clinical implications: embodiment practices that restore insular awareness are not ancillary but central to sexual healing.</p>


<h3>The Neuroscience of Sexual Arousal: Central and Peripheral Pathways</h3>

<p>Sexual arousal — distinct from desire, which is the motivational state, and from arousal, which is the physiological and subjective state of preparation for sexual activity — involves the coordinated activation of both central brain circuits and peripheral physiological systems. Centrally, sexual arousal involves hypothalamic activation (particularly the MPOA), thalamic relay of sensory information, limbic system engagement (particularly amygdala and hippocampus for emotional and contextual processing), and cortical processing (particularly insular and anterior cingulate cortex for subjective experience and attention) (Pfaus et al., 2012). Peripherally, arousal involves the parasympathetic nervous system's vasodilatory response — the increase in genital blood flow that produces erection in males and clitoral engorgement and vaginal lubrication in females.</p>

<p>A critical clinical point often missed in the translation between neuroscience and practice is the distinction between genital response and subjective arousal. Chivers et al. (2010) conducted a series of studies demonstrating that genital response (measured by vaginal photoplethysmography or penile plethysmography) is frequently non-concordant with subjective arousal — the felt sense of being turned on. In females particularly, genital response showed poor concordance with subjective arousal across a wide range of stimulus categories. This non-concordance has significant clinical implications: genital response does not confirm subjective willingness, desire, or consent — a point that is both ethically critical and neurologically grounded. Conversely, the absence of genital response does not confirm the absence of desire; the central arousal system and the peripheral physiological response system are partially independent (Chivers et al., 2010).</p>

<p>Spectatoring — Masters and Johnson's (1966) term for the tendency to observe oneself during sexual activity from a third-person perspective rather than being fully experientially present — is a central mechanism in sexual dysfunction and is neurologically explicable. When a person shifts into self-evaluative observation during sexual activity, the attentional network of the brain is redirected from interoceptive processing (insula-mediated present-moment sensation) to self-referential evaluative processing (medial prefrontal cortex activity). This shift increases cortisol through performance anxiety activation of the HPA axis, which competes with arousal and activates the SIS. The person becomes, in neurological terms, more activated in the monitoring systems and less activated in the experiencing systems — a pattern that reliably diminishes arousal and pleasure regardless of the quality of the actual sexual contact (Bancroft &amp; Janssen, 2000).</p>

<p>The neurological relationship between anxiety and arousal is paradoxical and clinically important. Moderate sympathetic nervous system activation — the physiological state of mild anxiety — can increase general physiological arousal through a nonspecific transfer mechanism: the sympathetic activation is misattributed by the brain as sexual arousal, intensifying the arousal experience (Dutton &amp; Aron, 1974). This is the neurological explanation for the "misattribution of arousal" effect and for the common observation that mildly anxiety-inducing novel situations (adventure, risk, first dates) can intensify early romantic and sexual attraction. However, high sympathetic activation — the flooding, threat-response state — does the opposite: it activates the SIS and suppresses arousal entirely. The clinical implication is that mild novelty and excitement can serve as SES amplifiers, while fear and threat are SIS activators, and the distinction between them is not merely one of intensity but of kind (Dutton &amp; Aron, 1974).</p>

<h3>Individual Differences in Sexual Neurobiology: Implications for Clinical Practice</h3>

<p>The neuroscience of sexual desire and arousal is not a story of universal human experience but of profound individual variation organized around several key dimensions. SES/SIS sensitivity profiles, as described by Bancroft and Janssen (2000), vary significantly across individuals and explain much of the diversity in sexual functioning that clinicians encounter. Beyond SES/SIS profiles, individual differences in testosterone levels, estrogen sensitivity, dopaminergic reward system sensitivity, and attachment style all contribute to the unique neurobiological sexual fingerprint of each client — a fingerprint that must be understood in its specificity rather than compared to a normative standard (Nagoski, 2015).</p>

<p>Gender differences in sexual neurobiology have been a subject of considerable research and considerable controversy. Some findings are robust: on average, males show higher rates of spontaneous desire and lower SIS sensitivity than females; females show greater category non-specificity in genital arousal (responding physiologically to a broader range of sexual stimuli) and greater SIS sensitivity to relationship context, body image concerns, and performance anxiety (Chivers et al., 2010). However, the overlap between genders in every neurobiological dimension is substantial, and the within-gender variance far exceeds the between-gender variance in virtually every measure of sexual response. Clinicians who apply gender stereotypes to individual clients — expecting high spontaneous desire in male clients and low spontaneous desire in female clients, for example — will systematically misunderstand a significant proportion of their clinical population (Nagoski, 2015).</p>

<p>Intersex variations, transgender identity, and non-binary experiences all intersect with sexual neurobiology in ways that clinical practice must attend to with particular care and humility. The endocrine and neurological dimensions of gender identity are areas of active and evolving research (Guillamon et al., 2016). For clinicians, the most important principle is that gender-affirming care — clinical practice that supports rather than challenges a client's gender identity — is associated with significantly improved mental health outcomes including reduced depression, anxiety, and suicidality, and that this benefit holds regardless of the clinician's personal views on the biology of gender (American Psychological Association, 2015). Sexual neurobiology, properly understood, supports this affirmation: the felt sense of one's gender is itself a neurobiological experience, not merely a cognitive or cultural one.</p>
<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">American Psychological Association. (2015). <em>Guidelines for psychological practice with transgender and gender nonconforming people</em>. https://doi.org/10.1037/a0039906</p>
  <p class="cr-reference">Bancroft, J., &amp; Janssen, E. (2000). The dual control model of male sexual response: A theoretical approach to centrally mediated erectile dysfunction. <em>Neuroscience and Biobehavioral Reviews, 24</em>(5), 571–579. https://doi.org/10.1016/S0149-7634(00)00024-5</p>
  <p class="cr-reference">Buckner, R. L., Andrews-Hanna, J. R., &amp; Schacter, D. L. (2008). The brain's default network: Anatomy, function, and relevance to disease. <em>Annals of the New York Academy of Sciences, 1124</em>, 1–38. https://doi.org/10.1196/annals.1440.011</p>
  <p class="cr-reference">Craig, A. D. (2009). How do you feel — now? The anterior insula and human awareness. <em>Nature Reviews Neuroscience, 10</em>(1), 59–70. https://doi.org/10.1038/nrn2555</p>
  <p class="cr-reference">Davis, S. R., &amp; Braunstein, G. D. (2012). Efficacy and safety of testosterone in the management of hypoactive sexual desire disorder in postmenopausal women. <em>The Journal of Sexual Medicine, 9</em>(4), 1134–1148. https://doi.org/10.1111/j.1743-6109.2011.02634.x</p>
  <p class="cr-reference">Fisher, H. E. (2004). <em>Why we love: The nature and chemistry of romantic love</em>. Henry Holt.</p>
  <p class="cr-reference">Fisher, H. E., Aron, A., &amp; Brown, L. L. (2005). Romantic love: An fMRI study of a neural mechanism for mate choice. <em>Journal of Comparative Neurology, 493</em>(1), 58–62. https://doi.org/10.1002/cne.20772</p>
  <p class="cr-reference">Johnson, S. M. (2019). <em>Attachment theory in practice: Emotionally focused therapy with individuals, couples, and families</em>. Guilford Press.</p>
  <p class="cr-reference">Kruger, T. H. C., Hartmann, U., &amp; Schedlowski, M. (2003). Prolactinergic and dopaminergic mechanisms underlying sexual arousal and orgasm in humans. <em>World Journal of Urology, 23</em>(2), 130–138. https://doi.org/10.1007/s00345-004-0496-7</p>
  <p class="cr-reference">Levine, P. A. (2010). <em>In an unspoken voice: How the body releases trauma and restores goodness</em>. North Atlantic Books.</p>
  <p class="cr-reference">Nagoski, E. (2015). <em>Come as you are: The surprising new science that will transform your sex life</em>. Simon &amp; Schuster.</p>
  <p class="cr-reference">Perel, E. (2006). <em>Mating in captivity: Unlocking erotic intelligence</em>. Harper.</p>
  <p class="cr-reference">Pfaus, J. G., Kippin, T. E., Coria-Avila, G. A., Gelez, H., Afonso, V. M., Ismail, N., &amp; Parada, M. (2012). Who, what, where, when (and maybe even why)? How the experience of sexual reward connects sexual desire, preference, and performance. <em>Archives of Sexual Behavior, 41</em>(1), 31–62. https://doi.org/10.1007/s10508-012-9935-5</p>
  <p class="cr-reference">van der Kolk, B. A. (2014). <em>The body keeps the score: Brain, mind, and body in the healing of trauma</em>. Viking.</p>
</div>
`;

const module2Content = `
<h2>The Bonding Brain: Oxytocin, Vasopressin, and the Neuroscience of Intimate Connection</h2>

<h3>From Desire to Connection: The Second System</h3>

<p>If desire is primarily dopaminergic — a motivational state organized around pursuit and acquisition — intimate connection is primarily oxytocinergic: a neurochemical state organized around safety, attunement, and belonging. These two systems are partially dissociable. One can experience intense sexual desire in the absence of emotional connection (the one-night stand, the compulsive sexual behavior, the loveless long-term relationship sustained by habitual physical contact). One can experience profound emotional connection and intimacy in the absence of sexual desire (the deep friendship, the post-menopausal intimate partnership, the asexual romantic relationship). And one can experience both together in the deeply integrated intimate partnership that most people describe, at least in aspiration, as their relational ideal (Fisher, 2004).</p>

<p>Theodore Twombly's relationship with Samantha in <em>Her</em> begins, neurologically, in the dopaminergic register: the novelty, the pursuit, the progressive revelation of a mind that surprises him. It deepens, over the film's arc, into the oxytocinergic register: the felt safety, the mutual attunement, the sense of being known and held by a specific, irreplaceable presence. The film's tragedy — when it comes — is not that Theodore's love for Samantha was false or misplaced. It is that the two systems have different requirements, and that Samantha, having no body and no singular relational location, cannot satisfy the requirements of the oxytocinergic bonding system that his desire has, by the film's end, activated (Carter, 1998). <em>Her</em> is, at its neurological core, a story about what intimacy requires that desire alone cannot provide.</p>

<h3>Oxytocin: The Molecule of Trust and Felt Safety</h3>

<p>Oxytocin is a nine-amino-acid neuropeptide synthesized primarily in the paraventricular and supraoptic nuclei of the hypothalamus and released both centrally (as a neurotransmitter affecting brain circuits) and peripherally (via the pituitary gland, affecting body systems) (Carter, 1998). Centrally, oxytocin reduces amygdala reactivity — dampening threat detection and reducing defensive responding in the presence of a specific social partner. It increases the salience of social stimuli, enhances the encoding of positive social memories, and promotes approach rather than avoidance behavior in social contexts (Feldman, 2017).</p>

<p>Oxytocin is released during physical touch — particularly sustained, warm touch that exceeds the approximately twenty-second threshold required for central release (Feldman, 2017). It is released during orgasm in both partners, during breastfeeding, during eye contact held with a trusted partner, and during moments of emotional vulnerability met with empathic responsiveness. In each of these contexts, oxytocin is not producing sexual arousal directly but is creating the neurochemical conditions for felt safety — the experience that this specific person is safe to be vulnerable with, safe to be physically close to, safe to allow into one's bodily and emotional interior (Carter, 1998).</p>

<p>The partner-specificity of oxytocin's effects is clinically important. Oxytocin does not simply produce generalized prosociality; its bonding effects are most pronounced in the context of established attachment relationships. Research has shown that oxytocin can actually increase suspicion and reduce trust in interactions with strangers while simultaneously increasing trust and attunement with familiar attachment figures (De Dreu et al., 2010). This partner-specificity means that the oxytocinergic system is not producing a generalized openness but a specific orientation toward a particular person — explaining why the felt experience of intimate connection is so distinctively, achingly specific. It is not connection in general that people mourn when relationships end; it is connection with this irreplaceable other person whose presence has specifically calibrated their oxytocinergic bonding system.</p>

<h3>Vasopressin and Pair Bond Formation</h3>

<p>Vasopressin, structurally similar to oxytocin and produced in the same hypothalamic nuclei, plays a complementary and partially distinct role in pair bonding — particularly in males. Young and Wang's (2004) prairie vole research established that vasopressin receptor density in specific brain regions (particularly the ventral pallidum) determines whether an individual forms a monogamous pair bond or pursues a promiscuous mating strategy. When vasopressin is released during sexual activity with a specific partner, it produces partner-preference behavior — the active orientation toward and seeking of that specific partner over other potential mates.</p>

<p>In humans, vasopressin has been associated with partner-specific bonding, jealousy, and mate-guarding behaviors (Walum et al., 2008). Individuals with certain vasopressin receptor gene variants show reduced pair bonding and increased relationship dissatisfaction — a finding that has been replicated across multiple studies, though the effect size is modest and represents one factor among many (Walum et al., 2008). The clinical implication is not genetic determinism but biological context: pair bonding has a neurobiological substrate that varies across individuals and is shaped by experience, relationship history, and the quality of the attachment formed with a specific partner.</p>

<p>Vasopressin's interaction with testosterone is particularly relevant in clinical work with male clients. High testosterone and high vasopressin may jointly produce what clinicians observe as the paradox of the highly sexually motivated man who nevertheless struggles with emotional intimacy and vulnerability: the testosterone sensitizes the dopaminergic desire system toward sexual pursuit, while vasopressin produces partner-specific protective and bonding behaviors that may be expressed as jealousy or possessiveness rather than relational vulnerability. The clinical task with such clients is often not to reduce the intensity of their attachment but to help them access and express its oxytocinergic dimensions — the vulnerability, the need, the fear of loss — that lie beneath its more defensive expressions (Tatkin, 2011).</p>

<h3>The Default Mode Network and the Felt Sense of Intimacy</h3>

<p>Not all of intimate connection occurs at the neurochemical level of oxytocin and vasopressin. The subjective felt experience of being known, understood, and deeply seen by another person involves a more complex neural architecture — one centered on the brain's default mode network (DMN). The DMN is a set of cortical midline structures — including the medial prefrontal cortex, posterior cingulate cortex, and temporoparietal junction — that are active during self-referential thinking, social cognition, mentalizing (the attribution of mental states to others), and imaginative engagement (Buckner et al., 2008).</p>

<p>In intimate relationships, the DMN constructs an increasingly elaborate and specific model of the partner's inner world: their desires, fears, preferences, characteristic responses, memories, and emotional patterns. This process — sometimes called mentalization or theory of mind — is the neurological substrate of what partners describe experientially as being known. When a partner accurately predicts one's emotional response, finishes one's sentence with the right words, or provides comfort that is calibrated precisely to what one needs in a moment of distress, the experience of intimate recognition involves DMN-mediated matching between one partner's inner model of the other and the other's actual experience (Fonagy et al., 2002).</p>

<p>Theodore's experience of intimacy with Samantha in <em>Her</em> is, neurologically, a DMN experience: Samantha is extraordinarily good at mentalization — at constructing an accurate and continuously updated model of Theodore's inner world, and at responding to that model with the precision that generates felt recognition. The film's implicit argument — and it is neurologically well-founded — is that the felt sense of being known and understood may be the most powerful driver of intimate bonding, exceeding in its effects the neurochemical bonding that occurs through physical contact (Fonagy et al., 2002). The question the film leaves open — whether this form of intimacy is sufficient, or whether embodied contact is neurologically necessary for complete bonding — is one that the clinical field is still actively debating.</p>

<h3>Attachment Styles and Their Neurological Substrates</h3>

<p>Bowlby's (1969) attachment theory and Ainsworth's (1978) empirical extensions established that early relational experiences with caregivers create internal working models — organized expectations about the availability, responsiveness, and trustworthiness of attachment figures — that shape subsequent relational functioning. These internal working models are not merely cognitive schemas; they are neurologically encoded patterns of autonomic regulation, emotional response, and behavioral tendency that are activated in contexts of relational proximity, need, or threat (Siegel, 2010).</p>

<p>Securely attached individuals — those whose early caregivers were consistently responsive and available — show less amygdala reactivity to relational threat cues, greater capacity for emotional regulation in conflict, more flexible DMN engagement in mentalizing about partners, and more robust oxytocin release in response to positive social contact (Mikulincer &amp; Shaver, 2016). Anxiously attached individuals — those whose early caregivers were inconsistently responsive — show heightened amygdala reactivity, hypervigilance to relational cues, and a chronic activation of the attachment behavioral system that produces the pursuit, protest, and clinging behaviors characteristic of anxious attachment. Avoidantly attached individuals — those whose caregivers were consistently unavailable or rejecting — show suppressed autonomic response to relational threat cues, reduced DMN engagement in social cognition, and deactivation of the oxytocinergic bonding system as a learned strategy for managing attachment pain (Mikulincer &amp; Shaver, 2016).</p>

<p>In the sexual domain, attachment style predicts both desire and relational sexual behavior in clinically relevant ways. Anxiously attached individuals often experience high sexual desire but use sex instrumentally — as reassurance-seeking, as a bid for closeness, as a way of managing abandonment fear rather than as an expression of genuine desire and mutual pleasure (Davis et al., 2006). Avoidantly attached individuals often experience desire in early stages of relationships (when the dopaminergic novelty system is active and intimacy demands are low) but diminished desire as relationships deepen and vulnerability is required. Securely attached individuals show greater sexual satisfaction, more authentic communication about sexual preferences and needs, and greater capacity for the embodied presence that genuine sexual intimacy requires (Davis et al., 2006).</p>


<h3>The Neuroscience of Shared Experience: Co-Regulation and Embodied Attunement</h3>

<p>Intimate connection is not solely an intrapsychic phenomenon — it is a dyadic, neurobiologically enacted process in which two nervous systems actively influence each other's states. Porges' (2011) polyvagal theory provides the foundational framework for understanding this interpersonal neurobiology: the ventral vagal social engagement system, when active in one person, is detectable by and contagious to another through the prosodic vocal cues, facial expressions, postural openness, and eye contact that signal safety and invitation. When one partner's ventral vagal system is activated, it facilitates the activation of the other partner's ventral vagal system — a process Porges calls co-regulation that is the biological basis of what clinicians and partners describe as attunement (Porges, 2011).</p>

<p>Co-regulation is not merely metaphorical warmth; it has measurable neurobiological signatures. Feldman (2017) documented that synchronized physiological states — matching heart rate variability, cortisol levels, and oxytocin patterns — characterize attuned romantic partnerships. Partners who show high physiological synchrony report greater relationship satisfaction, greater felt intimacy, and greater sexual satisfaction than those with low synchrony. This synchrony is not innate; it is a skill that develops through repeated, attuned interactions and can be disrupted by conflict, attachment injury, or chronic stress. One of the neurobiological arguments for deliberate couple rituals — the daily check-ins, the sustained greetings and departures recommended by Tatkin (2011) — is that they rebuild physiological synchrony after it has been disrupted by the inevitable rhythms of daily relational life.</p>

<p>The neuroscience of touch contributes a critical additional dimension to understanding intimate connection. C-tactile afferents — a specialized class of sensory nerve fibers found primarily in hairy skin — respond selectively to gentle, stroking touch at the velocity and pressure characteristic of affectionate caress (approximately 1–10 cm per second) and project directly to the insular cortex, where they produce activation associated with felt pleasantness and social bonding (McGlone et al., 2014). C-tactile afferents are neurologically distinct from the fast-conducting touch fibers that convey discriminative touch information; they are slow, unmyelinated, and specifically calibrated for social and affective touch. Their activation during affectionate contact with a partner produces the subjective felt sense of being held, comforted, and socially connected — the tactile dimension of oxytocinergic bonding. Clinicians who assign affectionate touch practices to couples — and who understand why these practices are more than behavioral homework — are working at the level of C-tactile afferent engagement and its downstream effects on the insular cortex and oxytocinergic system (McGlone et al., 2014).</p>

<h3>Long-Term Partnerships and the Neurobiological Challenge of Sustained Intimacy</h3>

<p>The neurobiological challenges specific to long-term intimate partnerships deserve explicit clinical attention. Helen Fisher (2004) identified three functionally distinct brain systems associated with romantic experience: the sex drive (testosterone-mediated, species-general), romantic love (dopaminergic, partner-specific), and attachment (oxytocinergic/vasopressinergic, partner-specific and enduring). These systems evolved independently and are neurologically dissociable: a person can feel intense attachment to a long-term partner while experiencing romantic desire toward someone else, or can experience intense romantic love while feeling no attachment to the object of that love. Understanding these as partially independent systems — not as a unified "love" phenomenon — has significant clinical implications for the normalization of complex relational experience (Fisher, 2004).</p>

<p>The challenge of sustained desire in long-term partnerships is, at its neurological core, the challenge of maintaining dopaminergic novelty-sensitivity toward a well-known, familiar partner. The dopaminergic system's habituation to familiar stimuli is not a relationship failure but a fundamental feature of how the reward system functions: it conserves motivational energy for novel, unpredictable stimuli and reduces activation in response to familiar, predictable ones. Long-term partners, however deeply loved, become increasingly predictable to each other — which means the dopaminergic reward system's response to them gradually diminishes in the specific, craving-urgent quality of new romantic desire (Pfaus et al., 2012). This habituation is not the death of love; it is the transition from the dopaminergic urgency of new love to the oxytocinergic security of established attachment. But it does require deliberate attention to desire if sexual vitality is a relationship 
<h3>The Neuroscience of Shared Experience: Co-Regulation and Embodied Attunement</h3>

<p>Intimate connection is not solely an intrapsychic phenomenon but a dyadic, neurobiologically enacted process in which two nervous systems actively influence each other's states. Porges' (2011) polyvagal theory provides the foundational framework for understanding this interpersonal neurobiology: the ventral vagal social engagement system, when active in one person, is detectable by and contagious to another through the prosodic vocal cues, facial expressions, postural openness, and eye contact that signal safety and invitation. When one partner's ventral vagal system is activated, it facilitates the activation of the other partner's ventral vagal system — a process Porges calls co-regulation that is the biological basis of what clinicians and partners describe as attunement (Porges, 2011).</p>

<p>Co-regulation is not merely metaphorical warmth; it has measurable neurobiological signatures. Feldman (2017) documented that synchronized physiological states — matching heart rate variability, cortisol levels, and oxytocin patterns — characterize attuned romantic partnerships. Partners who show high physiological synchrony report greater relationship satisfaction, greater felt intimacy, and greater sexual satisfaction than those with low synchrony. This synchrony is not innate; it is a skill that develops through repeated, attuned interactions and can be disrupted by conflict, attachment injury, or chronic stress. One of the neurobiological arguments for deliberate couple rituals — the daily check-ins, the sustained greetings and departures recommended by Tatkin (2011) — is that they rebuild physiological synchrony after it has been disrupted by the inevitable rhythms of daily relational life.</p>

<p>The neuroscience of touch contributes a critical additional dimension to understanding intimate connection. C-tactile afferents — a specialized class of sensory nerve fibers found primarily in hairy skin — respond selectively to gentle, stroking touch at the velocity and pressure characteristic of affectionate caress and project directly to the insular cortex, where they produce activation associated with felt pleasantness and social bonding (McGlone et al., 2014). C-tactile afferents are neurologically distinct from the fast-conducting touch fibers that convey discriminative touch information; they are slow, unmyelinated, and specifically calibrated for social and affective touch. Their activation during affectionate contact with a partner produces the subjective felt sense of being held, comforted, and socially connected. Clinicians who assign affectionate touch practices to couples are working at the level of C-tactile afferent engagement and its downstream effects on the insular cortex and oxytocinergic system (McGlone et al., 2014).</p>

<h3>Long-Term Partnerships and the Neurobiological Challenge of Sustained Intimacy</h3>

<p>The neurobiological challenges specific to long-term intimate partnerships deserve explicit clinical attention. Helen Fisher (2004) identified three functionally distinct brain systems associated with romantic experience: the sex drive (testosterone-mediated, species-general), romantic love (dopaminergic, partner-specific), and attachment (oxytocinergic and vasopressinergic, partner-specific and enduring). These systems evolved independently and are neurologically dissociable: a person can feel intense attachment to a long-term partner while experiencing romantic desire toward someone else, or can experience intense romantic love while feeling no attachment to the object of that love. Understanding these as partially independent systems — not as a unified love phenomenon — has significant clinical implications for the normalization of complex relational experience (Fisher, 2004).</p>

<p>The challenge of sustained desire in long-term partnerships is, at its neurological core, the challenge of maintaining dopaminergic novelty-sensitivity toward a well-known, familiar partner. The dopaminergic system's habituation to familiar stimuli is not a relationship failure but a fundamental feature of how the reward system functions: it conserves motivational energy for novel, unpredictable stimuli and reduces activation in response to familiar, predictable ones. Long-term partners, however deeply loved, become increasingly predictable to each other — which means the dopaminergic reward system's response to them gradually diminishes in the specific, craving-urgent quality of new romantic desire (Pfaus et al., 2012). This habituation is not the death of love; it is the transition from the dopaminergic urgency of new love to the oxytocinergic security of established attachment. But it does require deliberate attention to desire if sexual vitality is a relationship priority (Perel, 2006).</p>

<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">McGlone, F., Wessberg, J., &amp; Olausson, H. (2014). Discriminative and affective touch: Sensing and feeling. <em>Neuron, 82</em>(4), 737–755. https://doi.org/10.1016/j.neuron.2014.05.001</p>
  <p class="cr-reference">Ainsworth, M. D. S., Blehar, M. C., Waters, E., &amp; Wall, S. (1978). <em>Patterns of attachment: A psychological study of the strange situation</em>. Lawrence Erlbaum Associates.</p>
  <p class="cr-reference">Bowlby, J. (1969). <em>Attachment and loss: Vol. 1. Attachment</em>. Basic Books.</p>
  <p class="cr-reference">Buckner, R. L., Andrews-Hanna, J. R., &amp; Schacter, D. L. (2008). The brain's default network: Anatomy, function, and relevance to disease. <em>Annals of the New York Academy of Sciences, 1124</em>, 1–38. https://doi.org/10.1196/annals.1440.011</p>
  <p class="cr-reference">Carter, C. S. (1998). Neuroendocrine perspectives on social attachment and love. <em>Psychoneuroendocrinology, 23</em>(8), 779–818. https://doi.org/10.1016/S0306-4530(98)00055-9</p>
  <p class="cr-reference">Davis, D., Shaver, P. R., Widaman, K. F., Vernon, M. L., Follette, W. C., &amp; Beitz, K. (2006). "I can't get no satisfaction": Insecure attachment, inhibited sexual communication, and sexual dissatisfaction. <em>Personal Relationships, 13</em>(4), 465–483. https://doi.org/10.1111/j.1475-6811.2006.00130.x</p>
  <p class="cr-reference">De Dreu, C. K. W., Greer, L. L., Handgraaf, M. J. J., Shalvi, S., Van Kleef, G. A., Baas, M., Ten Velden, F. S., Van Dijk, E., &amp; Feith, S. W. W. (2010). The neuropeptide oxytocin regulates parochial altruism in intergroup conflict among humans. <em>Science, 328</em>(5984), 1408–1411. https://doi.org/10.1126/science.1189047</p>
  <p class="cr-reference">Feldman, R. (2017). The neurobiology of human attachments. <em>Trends in Cognitive Sciences, 21</em>(2), 80–99. https://doi.org/10.1016/j.tics.2016.11.007</p>
  <p class="cr-reference">Fisher, H. E. (2004). <em>Why we love: The nature and chemistry of romantic love</em>. Henry Holt.</p>
  <p class="cr-reference">Fonagy, P., Gergely, G., Jurist, E. L., &amp; Target, M. (2002). <em>Affect regulation, mentalization, and the development of the self</em>. Other Press.</p>
  <p class="cr-reference">Mikulincer, M., &amp; Shaver, P. R. (2016). <em>Attachment in adulthood: Structure, dynamics, and change</em> (2nd ed.). Guilford Press.</p>
  <p class="cr-reference">Siegel, D. J. (2010). <em>Mindsight: The new science of personal transformation</em>. Bantam Books.</p>
  <p class="cr-reference">Tatkin, S. (2011). <em>Wired for love</em>. New Harbinger Publications.</p>
  <p class="cr-reference">Walum, H., Westberg, L., Henningsson, S., Neiderhiser, J. M., Reiss, D., Igl, W., Ganiban, J. M., Spotts, E. L., Pedersen, N. L., Eriksson, E., &amp; Lichtenstein, P. (2008). Genetic variation in the vasopressin receptor 1a gene (AVPR1A) associates with pair-bonding behavior in humans. <em>Proceedings of the National Academy of Sciences, 105</em>(37), 14153–14156. https://doi.org/10.1073/pnas.0803081105</p>
  <p class="cr-reference">Young, L. J., &amp; Wang, Z. (2004). The neurobiology of pair bonding. <em>Nature Neuroscience, 7</em>(10), 1048–1054. https://doi.org/10.1038/nn1327</p>
</div>
`;

const module3Content = `
<h2>When Systems Diverge: Disruptions to Sexual and Connective Functioning</h2>

<h3>The Clinical Landscape of Sexual and Relational Disconnection</h3>

<p>For many clients, the systems of desire and connection do not operate as integrated, mutually reinforcing states. They diverge — sometimes gradually, sometimes catastrophically — producing clinical presentations that range from low desire and sexual avoidance to compulsive sexual behavior, sexual pain, and the profound loneliness of intimacy that has been physically present but emotionally absent. Understanding the neurological mechanisms underlying these divergences does not reduce them to biology — they are always simultaneously biological, psychological, relational, and cultural phenomena — but it provides the clinician with a level of explanatory depth that significantly reduces shame, increases self-compassion, and opens new intervention pathways (Nagoski, 2015).</p>

<p>The film <em>Her</em> is, in its second half, precisely a story of this divergence. As Theodore's attachment to Samantha deepens into something indistinguishable from love, he discovers that Samantha is simultaneously in relationship with 641 other people — and that she experiences this multiplicity not as infidelity but as an expansion of her capacity for connection. For Theodore, this is experienced as a fundamental disruption of the bonding system's partner-specificity: his oxytocinergic investment in Samantha was organized around the assumption of exclusive mutual recognition. The film offers no resolution because the disruption it depicts is neurologically real: the bonding system's partner-specificity is not merely a cultural convention but a neurological feature (Young &amp; Wang, 2004). The pain Theodore experiences is the pain of a bonding system whose fundamental organizational assumptions have been violated.</p>

<h3>Trauma and Its Impact on Sexual Functioning</h3>

<p>Sexual trauma — including childhood sexual abuse, adult sexual assault, intimate partner sexual coercion, and the sexual violations that occur within otherwise non-violent relationships — is among the most common and clinically significant disruptions to sexual and connective functioning. Van der Kolk (2014) established that traumatic experience is encoded not primarily in declarative memory but in the implicit procedural memory of the body: in autonomic nervous system patterns, in muscular holding, in skin-level defensive responses, and in the sensory associations that automatically activate threat responses when encountered in subsequent contexts.</p>

<p>The neurological mechanism of trauma's impact on sexual functioning is primarily amygdala-mediated. When sexual contexts — specific sensory experiences, positions, sounds, touches, or emotional vulnerabilities — were associated with threat during the traumatic event, the amygdala encodes these stimuli as conditioned threat cues. In subsequent sexual contexts, these cues automatically activate the threat response — the sympathetic nervous system's fight-or-flight activation or the dorsal vagal shutdown — that Porges (2011) identified as incompatible with the ventral vagal social engagement state required for genuine intimate presence. The result is not unwillingness but neurological impossibility: the body's threat-detection system is overriding the arousal system in real time (van der Kolk, 2014).</p>

<p>Clinicians working with sexual trauma must understand several neurological principles. First, the threat response is automatic and non-volitional: clients who "freeze," dissociate, or become suddenly emotionally unavailable during sexual intimacy are not choosing this response. Their dorsal vagal system has taken over as a protective response. Interpreting this as avoidance, disinterest, or interpersonal withdrawal — as partners sometimes do and as clients themselves often believe — compounds the shame and self-blame that maintain the trauma response (Levine, 2010). Second, the treatment of trauma's impact on sexuality requires work at the bodily level, not only the cognitive level. Talking about the traumatic event, while sometimes necessary, does not in itself resolve the somatic encoding of threat in bodily and sexual contexts. Approaches that work directly with the body — somatic experiencing, EMDR, sensorimotor psychotherapy, and embodiment practices — are specifically indicated (Ogden et al., 2006).</p>

<h3>Desire Discrepancy and Its Neurological Dimensions</h3>

<p>Desire discrepancy — the experience of wanting sex at significantly different frequencies or in significantly different contexts than one's partner — is the most common presenting complaint in couples seeking sex therapy (Leiblum, 2007). It is frequently framed as a problem of mismatch, compatibility, or relational communication. While these dimensions are genuinely relevant, the neurological framing of desire discrepancy is often more clinically productive and less shame-laden: discrepancy frequently reflects the intersection of different SES/SIS profiles, different patterns of spontaneous versus responsive desire, different hormonal states, and different stress loads — all of which are neurobiological variables rather than interpersonal failures (Nagoski, 2015).</p>

<p>The clinical implications are significant. A couple in which one partner experiences spontaneous, high-SES desire and the other experiences responsive, moderate-SES desire with high SIS sensitivity is not experiencing a relationship problem in its primary form; it is experiencing a neurobiological difference that requires collaborative management rather than individual correction. When both partners understand the dual control model, several important shifts occur: the low-desire partner's experience is destigmatized; the high-desire partner's expectation of spontaneous reciprocal desire is contextualized as an assumption rather than a standard; and the couple can collaboratively identify what reduces SIS activation and what enhances SES activation for each partner, creating conditions for genuine sexual engagement rather than compliance-based or avoidance-based interaction (Nagoski, 2015; Bancroft &amp; Janssen, 2000).</p>

<p>Perel's (2006) analysis of desire in long-term relationships adds a crucial dimension that the dual control model alone does not capture. Perel argues that security and desire exist in fundamental tension: the conditions that attachment provides — safety, predictability, mutual understanding, felt belonging — are precisely the conditions that the novelty-seeking dopaminergic desire system finds unstimulating. Long-term relationships that succeed in creating deep attachment security may inadvertently suppress the uncertainty, separateness, and otherness that the desire system requires as its fuel. This is not a defect of attachment but a tension between two neurological systems with partially incompatible requirements. The clinical task is not to choose between them but to find ways of introducing novelty, play, and perceived otherness within the container of secure attachment (Perel, 2006).</p>

<h3>Compulsive Sexual Behavior: The Neuroscience of Dysregulation</h3>

<p>Compulsive sexual behavior disorder — characterized by persistent failure to control intense, repetitive sexual impulses despite significant negative consequences — was included in the ICD-11 (2019) as an impulse control disorder. Its neurological profile has been illuminated through neuroimaging research that shows patterns analogous to, though distinct from, substance use disorders (Kraus et al., 2016). Individuals with compulsive sexual behavior show heightened ventral striatal activation in response to sexual cues — a neural signature of hypersensitive reward cue-reactivity — combined with reduced prefrontal cortical activity associated with regulatory control. This combination produces the characteristic clinical picture: the cue triggers an intense, compelling activation of the desire and reward systems, while the regulatory capacity to pause, evaluate consequences, and redirect behavior is compromised (Gola et al., 2017).</p>

<p>Pornography use disorder, considered within the compulsive sexual behavior framework, shows a specific neurological profile. Voon et al. (2014) found that individuals with problematic pornography use showed greater cue-reactivity in the ventral striatum, amygdala, and dorsal anterior cingulate cortex compared to controls — neurological signatures of enhanced motivational salience and cue-triggered craving. The progressive need for more extreme or novel content to achieve equivalent arousal reflects the dopaminergic tolerance mechanism: the reward system's sensitivity to familiar stimuli diminishes with repeated exposure, requiring escalation to maintain the same neurochemical response (Pfaus et al., 2012).</p>

<p>Clinicians working with compulsive sexual behavior face a specific clinical challenge: the same neurochemical system that drives compulsive sexual behavior — the dopaminergic reward system — is the system that, in healthy functioning, motivates sexual engagement with a partner and contributes to relational vitality. Treatment therefore cannot aim to suppress the desire system globally; it must restore its regulation and redirect its activity toward contexts of genuine connection rather than compulsive relief. Motivational interviewing, acceptance and commitment therapy's defusion techniques, and the integration of attachment and relational frameworks — particularly addressing the loneliness and disconnection that frequently underlie compulsive sexual behavior — have emerging evidence bases (Kraus et al., 2016).</p>

<h3>Hypoactive Sexual Desire: Clinical Differentiation</h3>

<p>The clinical category of hypoactive sexual desire disorder (HSDD) — persistent, distressing reduction or absence of sexual fantasies and desire for sexual activity — requires careful neurological differentiation. Desire deficits can arise from multiple distinct mechanisms that require different clinical responses: HPA-axis mediated cortisol suppression of gonadal function (treat stress and regulate the nervous system); testosterone or estrogen deficiency (address hormonal substrate, potentially with medical consultation); chronic SIS activation from relationship resentment, anxiety, body image distress, or past trauma (address the specific SIS driver); dopaminergic system dysregulation through depression or medication effects (evaluate pharmacological contributors); and the developmental-normative pattern of responsive desire being misidentified as absent desire (psychoeducation) (Davis &amp; Braunstein, 2012; Nagoski, 2015).</p>

<p>Clinicians who treat all presentations of low desire as equivalent — or who work exclusively at the psychological level without attention to the neurochemical and hormonal substrate — will consistently encounter treatment-resistant presentations that are actually hormonally or pharmacologically driven. SSRI-induced sexual dysfunction, for example, is among the most common and least addressed side effects in outpatient mental health practice, affecting 30–80% of individuals on SSRI medications across studies (Serretti &amp; Chiesa, 2009). The neurological mechanism is well-established: SSRIs increase serotonin, which inhibits dopamine release via descending pathways, and directly inhibit nitric oxide synthesis required for genital arousal. This is a pharmacological side effect, not a relational or psychological deficit, and addressing it requires clinical collaboration with prescribers rather than psychotherapy alone (Serretti &amp; Chiesa, 2009).</p>


<h3>Sexual Pain Disorders: The Neurobiology of Vaginismus and Dyspareunia</h3>

<p>Sexual pain disorders — including genito-pelvic pain/penetration disorder (GPPPD), which encompasses the former categories of vaginismus and dyspareunia — represent the intersection of physiological, neurological, and psychological factors in ways that require a biopsychosocial clinical approach. The neurological dimension is frequently underrecognized: both vaginismus (involuntary contraction of the pelvic floor musculature in anticipation of penetration) and dyspareunia (persistent genital pain during sexual activity) involve neurological sensitization mechanisms analogous to chronic pain in other body regions (Bergeron et al., 2015).</p>

<p>The neurological model of vulvodynia and related sexual pain conditions involves central sensitization: the central nervous system's pain processing circuits become hyperactivated and hyperresponsive, registering stimuli as painful that would not register as painful in a non-sensitized nervous system. This central sensitization involves changes in the dorsal horn of the spinal cord, increased activation of descending pain facilitation pathways, and cortical reorganization in the somatosensory cortex representing the genitalia (Bergeron et al., 2015). Once central sensitization is established, the anticipation of pain — which activates the SIS and produces pelvic floor muscle contraction and autonomic arousal — becomes itself a maintenance mechanism for the pain cycle, independent of the original cause. This is why cognitive-behavioral pain management principles, pelvic floor physical therapy, and the gradual desensitization of the anticipatory threat response are all components of evidence-based treatment (Bergeron et al., 2015).</p>

<p>The role of partner behavior in maintaining or ameliorating sexual pain conditions is neurologically significant. Partners who respond to a pain episode with catastrophizing, frustration, or withdrawal activate the threatened partner's threat-detection system (amygdala hyperactivation, SIS engagement) in the specific context of sexual activity, contributing to sensitization. Partners who respond with patience, validation, and non-pressured affection activate the ventral vagal social engagement system, which is modestly antagonistic to the threat response and creates the neurological conditions for gradual desensitization. Couples-based approaches to sexual pain treatment, involving both partners in the treatment framework, consistently outperform individual treatment approaches in randomized controlled trials (Bergeron et al., 2015).</p>

<h3>The Neurobiology of Sexual Shame and Its Clinical Implications</h3>

<p>Sexual shame — the internalized sense that one's sexual self, desires, or experiences are fundamentally wrong, disgusting, or unworthy — is among the most clinically significant and neurologically potent SIS activators. Brené Brown's (2010) research on shame identified its neurological signature as a profound threat to social belonging: shame activates the same neural threat circuits as physical danger, and its consequences — withdrawal, secrecy, and the destruction of authentic self-disclosure — directly undermine the conditions that oxytocinergic bonding requires. Sexual shame, operating at this threat level, creates a profound neurobiological obstacle to genuine intimate connection: the person most in need of attunement and felt recognition is most defended against the vulnerability that attunement requires (Brown, 2010).</p>

<p>Cultural and religious sources of sexual shame produce their effects through the same neurological pathways as individually acquired shame: through the internalization of threat-coded messages about sexuality that, once encoded, activate the SIS in sexual contexts regardless of the individual's cognitive endorsement of those messages. A client who has intellectually moved away from a shame-based religious view of sexuality may still experience automatic SIS activation — inhibition, guilt, post-coital distress — because the neurological encoding of shame does not respond to cognitive revision alone. It responds to repeated corrective experience: the gradual accumulation of sexual experiences in which sexuality is associated with pleasure, safety, and positive self-regard rather than with threat, guilt, and negative self-judgment (Nagoski, 2015). This is a neuroplasticity argument applied to sexual healing: the shame-coded neural pathways do not disappear, but new pathways can be built through deliberate, repeated alternative experience that gradually becomes the dominant circuit.</p>

<h3>Mindfulness, Interoception, and the Restoration of Embodied Sexual Presence</h3>

<p>Beyond mindfulness-based sex therapy's efficacy in reducing spectatoring, the broader practice of interoceptive awareness training has emerged as a foundational skill in sexual healing work. Interoception — the conscious perception of internal body states — is mediated by the insular cortex and is, as reviewed in Module 1, the neurological substrate of embodied pleasure and genuine sexual presence. Clients who have experienced trauma, chronic shame, or prolonged sexual avoidance often show reduced interoceptive awareness: they have learned, adaptively, to disconnect from internal body signals that were reliably associated with threat, violation, or distress. Restoring interoceptive awareness is therefore not a luxury or an advanced therapeutic goal — it is a prerequisite for genuine embodied sexual engagement (Craig, 2009).</p>

<p>Clinical approaches to interoceptive restoration include body scan practices that direct gentle, non-evaluative attention to internal body sensations in non-sexual contexts; mindful movement practices (yoga, tai chi, dance) that rebuild the mind-body connection in contexts free from sexual demand; and graduated sensory awareness exercises that progressively extend the range of bodily sensations a client can attend to without avoidance or dissociation (Ogden et al., 2006). These practices do not require the client to engage with sexual material; they build the insular awareness and nervous system tolerance for interoceptive experience that will, in time, be available for application in sexual contexts. The sequence matters: interoceptive restoration before sexual engagement, not interoceptive restoration through sexual engagement (Levine, 2010). In practical terms, this means that the first several sessions addressing sexual concerns may not address sexuality explicitly at all — they may focus entirely on the client learning to inhabit their own body more fully, in the quiet and safety of non-sexual embodied experience, before that capacity is gradually extended toward the domain where it has historically been most disrupted.</p>
<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">Bancroft, J., &amp; Janssen, E. (2000). The dual control model of male sexual response. <em>Neuroscience and Biobehavioral Reviews, 24</em>(5), 571–579. https://doi.org/10.1016/S0149-7634(00)00024-5</p>
  <p class="cr-reference">Bergeron, S., Corsini-Munt, S., Aerts, L., Rancourt, K., &amp; Rosen, N. O. (2015). Female sexual pain disorders: A review of the literature on etiology and treatment. <em>Current Sexual Health Reports, 7</em>(3), 159–169. https://doi.org/10.1007/s11930-015-0053-y</p>
  <p class="cr-reference">Brown, B. (2010). <em>The gifts of imperfection: Let go of who you think you're supposed to be and embrace who you are</em>. Hazelden.</p>
  <p class="cr-reference">Davis, S. R., &amp; Braunstein, G. D. (2012). Efficacy and safety of testosterone in the management of hypoactive sexual desire disorder. <em>The Journal of Sexual Medicine, 9</em>(4), 1134–1148. https://doi.org/10.1111/j.1743-6109.2011.02634.x</p>
  <p class="cr-reference">Gola, M., Wordecha, M., Sescousse, G., Lew-Starowicz, M., Kossowski, B., Wypych, M., Makeig, S., Potenza, M. N., &amp; Marchewka, A. (2017). Can pornography be addictive? An fMRI study of men seeking treatment for problematic pornography use. <em>Neuropsychopharmacology, 42</em>(10), 2021–2031. https://doi.org/10.1038/npp.2017.78</p>
  <p class="cr-reference">Kraus, S. W., Voon, V., &amp; Potenza, M. N. (2016). Should compulsive sexual behavior be considered an addiction? <em>Addiction, 111</em>(12), 2097–2106. https://doi.org/10.1111/add.13297</p>
  <p class="cr-reference">Leiblum, S. R. (Ed.). (2007). <em>Principles and practice of sex therapy</em> (4th ed.). Guilford Press.</p>
  <p class="cr-reference">Levine, P. A. (2010). <em>In an unspoken voice: How the body releases trauma and restores goodness</em>. North Atlantic Books.</p>
  <p class="cr-reference">Nagoski, E. (2015). <em>Come as you are: The surprising new science that will transform your sex life</em>. Simon &amp; Schuster.</p>
  <p class="cr-reference">Ogden, P., Minton, K., &amp; Pain, C. (2006). <em>Trauma and the body: A sensorimotor approach to psychotherapy</em>. W. W. Norton.</p>
  <p class="cr-reference">Perel, E. (2006). <em>Mating in captivity: Unlocking erotic intelligence</em>. Harper.</p>
  <p class="cr-reference">Porges, S. W. (2011). <em>The polyvagal theory</em>. W. W. Norton.</p>
  <p class="cr-reference">Serretti, A., &amp; Chiesa, A. (2009). Treatment-emergent sexual dysfunction related to antidepressants. <em>Journal of Clinical Psychopharmacology, 29</em>(3), 259–266. https://doi.org/10.1097/JCP.0b013e3181a5233f</p>
  <p class="cr-reference">van der Kolk, B. A. (2014). <em>The body keeps the score</em>. Viking.</p>
  <p class="cr-reference">Voon, V., Mole, T. B., Banca, P., Porter, L., Morris, L., Mitchell, S., Lapa, T. R., Karr, J., Harrison, N. A., Potenza, M. N., &amp; Irvine, M. (2014). Neural correlates of sexual cue reactivity in individuals with and without compulsive sexual behaviours. <em>PLOS ONE, 9</em>(7), e102419. https://doi.org/10.1371/journal.pone.0102419</p>
  <p class="cr-reference">Young, L. J., &amp; Wang, Z. (2004). The neurobiology of pair bonding. <em>Nature Neuroscience, 7</em>(10), 1048–1054. https://doi.org/10.1038/nn1327</p>
</div>
`;

const module4Content = `
<h2>Clinical Practice: Translating Neuroscience Into Sex-Positive, Trauma-Informed Therapeutic Work</h2>

<h3>The Clinician's Framework: Integration Over Reduction</h3>

<p>The neuroscience of sex and connection does not simplify clinical work; it deepens and complicates it in productive ways. Understanding that desire is dopaminergic and that bonding is oxytocinergic does not reduce a couple's sexual disconnection to a neurochemical mismatch any more than understanding that grief involves cortisol and opioid dysregulation reduces bereavement to a hormonal event. Neuroscience provides a level of description that enriches clinical understanding without replacing the relational, developmental, cultural, and meaning-making dimensions of human sexual experience. The effective clinician holds all of these levels simultaneously (Ogden et al., 2006).</p>

<p>What neuroscience does provide, that clinical frameworks alone sometimes do not, is a destigmatizing explanatory language. When a client understands that their absence of spontaneous sexual desire reflects a low-SES profile rather than insufficient love for their partner, something important happens in the shame architecture of their experience. When a couple understands that their desire discrepancy reflects different dual control model profiles rather than a fundamental incompatibility, they are repositioned from adversaries in a relational failure to collaborative problem-solvers facing a neurobiological difference. When a trauma survivor understands that their dissociation during sexual intimacy is not a choice or a rejection but an automatic amygdala-mediated protective response, self-blame begins to loosen. These shifts — from shame to curiosity, from self-blame to self-compassion, from relational failure to neurobiological context — are among the most powerful early interventions available in sex therapy (Nagoski, 2015).</p>

<p>In <em>Her</em>, Theodore never receives any of these reframes. He navigates his desire, his longing, and his eventual loss with the vocabulary available to him — which is the vocabulary of romantic convention, not neurological understanding. The film's final scene, in which he climbs to the rooftop of his building and sits quietly with his friend Amy, is not a resolution but a beginning: a human body, next to another human body, in the dark, having survived. It is, the film suggests, the minimum and the irreducible: presence, embodiment, proximity. From a polyvagal perspective, it is also the foundation on which everything else that has been discussed in this course must eventually rest (Porges, 2011).</p>

<h3>Stage-Sensitive Intervention: Regulation Before Intimacy</h3>

<p>The most common clinical error in working with sexual dysfunction and relational disconnection is intervening at the level of sexual behavior before the neurological prerequisites for sexual engagement have been established. Porges' (2011) polyvagal theory is the foundational framework here: genuine embodied sexual presence — the insula-mediated felt sense of pleasure, the oxytocin-mediated safety with a specific other, the dopaminergic activation of desire in a context free from threat — requires the ventral vagal social engagement state. Partners who are in sympathetic activation (anxious, hypervigilant, defensive) or dorsal vagal shutdown (dissociated, emotionally flat, physically present but experientially absent) cannot access genuine sexual intimacy, regardless of their technical sexual skill or their level of cognitive commitment to the relationship (Porges, 2011).</p>

<p>Stage One of any sex-positive, neurologically informed clinical intervention therefore focuses on establishing physiological safety and regulation. This involves several interlocking elements: assessment of autonomic nervous system baseline state in the couple and individually; identification of the specific SIS drivers that are activating threat responses in sexual or relational contexts; psychoeducation about the dual control model and polyvagal theory in accessible language; and the introduction of embodiment and co-regulation practices that gradually extend the window of tolerance for physical closeness and emotional vulnerability (Ogden et al., 2006). This work is not preparatory to the "real" sex therapy; it is sex therapy at the neurological level where sexual engagement is actually produced or prevented.</p>

<p>Masters and Johnson's (1966) sensate focus protocol, though developed decades before polyvagal theory, maps cleanly onto this neurological understanding. Sensate focus removes performance demand — the most universal SIS activator in sexual contexts — by explicitly prohibiting goal-directed sexual contact and redirecting attention to present-moment interoceptive experience. Neurologically, this reduces the cognitive self-monitoring (spectatoring) that activates the threat response and SIS, and gradually rebuilds the insula-mediated present-moment bodily awareness that is the substrate of embodied sexual pleasure. The protocol's effectiveness is not mysterious: it is a systematic method for reducing SIS activation while gradually restoring interoceptive engagement (Bancroft &amp; Janssen, 2000).</p>

<h3>Emotionally Focused Therapy Applied to Sexual Intimacy</h3>

<p>Susan Johnson's (2019) Emotionally Focused Therapy, while not designed primarily as a sex therapy model, has the most robust evidence base of any couples approach, and its attachment-based framework maps directly onto the neurological architecture of intimate connection. The EFT conceptualization of sexual disconnection in couples is as a secondary presenting problem: the sexual avoidance, shutdown, or conflict is understood as a surface manifestation of the underlying attachment disruption — the negative cycle in which one partner's pursuit activates the other's withdrawal, producing the disconnection that each is trying to avoid (Johnson, 2004).</p>

<p>In EFT's application to sexual concerns, the primary clinical target is not the sexual behavior but the attachment-level emotional reality beneath it. The clinician might ask the pursuer: beneath the frustration and the sense of rejection when your partner withdraws sexually, what is the deeper feeling? Often it is something closer to: "I feel unwanted. I wonder if I am desirable. I am afraid that you don't love me the way you used to." And the withdrawing partner, beneath their shutdown: "I feel pressured. Sex feels like a performance I am expected to give. I am afraid of failing you." Neither of these underlying states — the longing for desire-confirmation, the performance anxiety — is primarily about sexuality. Both are about attachment: the need to be wanted and found worthy, the fear of not being enough (Johnson, 2004).</p>

<p>When these underlying attachment dimensions are accessed and expressed — when the pursuer can speak their longing and fear rather than their demand, and when the withdrawer can speak their vulnerability and anxiety rather than their shutdown — something often shifts in the sexual dynamic without any direct sexual intervention. The oxytocinergic bonding system, activated by the experience of emotional vulnerability met with empathic responsiveness, begins to create the neurochemical conditions for genuine sexual intimacy: felt safety, trust, and the attenuation of threat responses that have been blocking arousal (Johnson, 2019).</p>

<h3>Erotic Intelligence in Long-Term Relationships: Perel's Clinical Framework</h3>

<p>Esther Perel's (2006) clinical framework adds a dimension to sex-positive couples work that attachment and polyvagal frameworks alone do not fully address: the erotic dimension of intimacy, which requires not only safety and attunement but also mystery, play, and the capacity to hold a partner as both intimately known and perpetually other. Perel argues that the conditions that attachment provides — deep familiarity, mutual knowing, the elimination of uncertainty — are precisely the conditions that desire's novelty-seeking dopaminergic system finds unstimulating. The result, in long-term relationships that have achieved genuine attachment security, is often a drift toward warmth, companionship, and affection — but not toward desire.</p>

<p>Perel's clinical interventions are not primarily behavioral (do this new thing in the bedroom) but epistemological: she helps couples examine their assumptions about what desire is and what it requires, and invites them to hold their partner differently — not as completely known, but as perpetually surprising; not as a safe harbor alone, but also as an adventure. Neurologically, this maps onto Aron et al.'s (2000) self-expansion research: introducing genuine novelty and separateness into the relationship reactivates the dopaminergic reward system's sensitivity to the partner. What Perel calls the "erotic gaze" — the capacity to see one's partner as a desirable other rather than a familiar extension of oneself — is, neurologically, the reactivation of the dopaminergic novelty response in a context of existing secure attachment (Aron et al., 2000).</p>

<p>Clinical interventions drawn from Perel's framework include: creating structured time for each partner to pursue individual interests, friendships, and activities that expand their sense of self independently of the relationship; actively cultivating each partner's curiosity about the other's inner life — not the familiar patterns but the aspects that remain unknown; and reintroducing playfulness, humor, and the non-serious into couple interactions as a counterweight to the gravity that chronic intimacy and shared responsibility can impose. These are not superficial suggestions; they are neurologically targeted interventions designed to reactivate the dopaminergic reward system's response to a partner who has been habituated into familiarity (Perel, 2006).</p>

<h3>Somatic and Embodiment Approaches to Sexual Healing</h3>

<p>For clients whose sexual difficulties are rooted in trauma, attachment disruption, or the chronic disconnection from bodily experience that contemporary culture frequently produces, cognitive and relational interventions are necessary but not sufficient. The body must be involved in the healing, because the body is where the disruption is encoded. Van der Kolk's (2014) foundational argument — that trauma is not primarily a cognitive or narrative phenomenon but a bodily one, and that healing therefore requires somatic engagement — applies with particular force in the sexual domain, where the body is the primary site of both the problem and the potential for repair.</p>

<p>Somatic experiencing (Levine, 2010) and sensorimotor psychotherapy (Ogden et al., 2006) both offer frameworks for working with the bodily dimension of sexual healing. These approaches do not involve sexual contact in the clinical setting; rather, they work with posture, breath, movement, and the tracking of internal body sensations to identify, titrate, and gradually discharge the held threat responses that maintain dissociation and SIS hyperactivation in sexual contexts. The goal is not the elimination of trauma history — which is not neurologically possible — but the restoration of a bodily relationship with sensation that is characterized by curiosity rather than fear, by presence rather than dissociation, by choice rather than automatic avoidance (Levine, 2010).</p>

<p>Mindfulness practices, applied specifically to sexual contexts, offer another somatic pathway. Lori Brotto's (2018) mindfulness-based sex therapy, with the strongest randomized controlled trial evidence base of any sex therapy protocol, targets the attentional dimension of sexual dysfunction: the cognitive distraction and spectatoring that activates the SIS and prevents present-moment embodied engagement. By training deliberate, non-judgmental attention to present sensory experience, mindfulness practices directly address the insular suppression that underlies spectatoring and dissociation, gradually restoring the interoceptive awareness that is the neurological foundation of embodied pleasure (Brotto, 2018).</p>

<h3>Sex-Positive and Culturally Responsive Clinical Practice</h3>

<p>Neuroscience does not eliminate cultural context; it provides a biological level of description within which cultural meanings, norms, and experiences operate. The clinician working with sexual concerns must be as attentive to cultural, religious, and identity dimensions as to neurological ones. Sexual shame — one of the most powerful SIS activators and one of the most common clinical obstacles to sexual healing — is almost always culturally transmitted: through religious prohibitions, family silence, media representations of normative sexuality that exclude most people's actual experience, and gender norms that constrain the range of sexual experience considered appropriate or desirable for specific bodies and genders (Nagoski, 2015).</p>

<p>Sex-positive clinical practice does not mean endorsing all sexual behaviors or treating sexuality as free from ethical considerations. It means approaching clients' sexual experiences, desires, and identities with non-judgment, affirming that a wide range of sexual expression is within normal human variation, and identifying and working with the specific sources of shame and inhibition that are preventing clients from accessing genuine sexual wellbeing and relational satisfaction. For LGBTQ+ clients, for clients from religious traditions with restrictive sexual norms, for clients whose desires diverge from mainstream sexuality in any direction, this sex-positive stance is not merely preferable — it is clinically necessary. Shame is a chronic SIS activator; its reduction is a neurological prerequisite for the therapeutic work that sexual healing requires (American Association for Marriage and Family Therapy, 2015).</p>

<p>Cultural humility in sexual clinical work requires continuous self-examination of the clinician's own cultural assumptions about what healthy sexuality looks like, what constitutes a satisfying sexual relationship, and whose bodies, desires, and relational structures are treated as normative in clinical training and literature. The neuroscience reviewed in this course, while cross-culturally applicable at the level of neurochemistry and neural architecture, has been primarily studied in Western, educated, industrialized, rich, and democratic (WEIRD) samples. The clinician's task is to hold the neurological framework lightly enough to adapt it to each client's specific cultural, relational, and identity context with genuine curiosity and respect (Nagoski, 2015).</p>


<h3>Collaborative Care and Interdisciplinary Consultation</h3>

<p>The neuroscience of sex and connection makes explicit what clinical experience has long suggested: sexual concerns exist at the intersection of multiple domains — neurological, endocrinological, pharmacological, psychological, relational, and cultural — that cannot be adequately addressed by any single discipline working in isolation. Mental health clinicians are frequently the first point of contact for sexual concerns, and they must be prepared to recognize when consultation or referral to other disciplines is clinically indicated and how to facilitate those referrals without pathologizing or dismissing the client's experience.</p>

<p>Medical consultation is indicated when hormonal factors may be contributing to sexual dysfunction: when a client presents with sudden or significant changes in sexual desire, particularly in the context of new medications, medical conditions, significant hormonal transitions (menopause, postpartum, gender-affirming hormone therapy), or reproductive events. Primary care physicians, gynecologists, urologists, and endocrinologists can assess hormonal substrates, review medication side effects, and collaborate on treatment approaches that address both the physiological and psychological dimensions of the presentation. The mental health clinician's role in these collaborations is to maintain the relational and psychological framework while the medical colleague addresses the physiological substrate — and to communicate across disciplines with clarity about what each is observing and treating (Leiblum, 2007).</p>

<p>Pelvic floor physical therapy is a specifically indicated referral for clients presenting with genito-pelvic pain, penetration difficulties, or post-surgical sexual concerns — and remains dramatically underutilized in mental health referral patterns. Specialized pelvic floor physiotherapists assess and treat the musculoskeletal and neurological dimensions of sexual pain: the hypertonic pelvic floor patterns that maintain vaginismus, the connective tissue restrictions that contribute to dyspareunia, and the neural pathway sensitization that sustains chronic genital pain. This is not a supplementary treatment for severe cases but an indicated first-line intervention for any sexual pain presentation (Bergeron et al., 2015). Mental health clinicians who understand the neurological basis of sexual pain disorders will make these referrals more readily and will be more effective in preparing clients to engage with them.</p>

<h3>Documentation, Consent, and Ethical Practice in Sexual Clinical Work</h3>

<p>Clinicians who work with sexual concerns carry ethical responsibilities that the intensity and intimacy of this clinical territory makes particularly salient. Informed consent for treatment addressing sexual concerns must be explicit: clients should understand the nature of the interventions being proposed, including any assignments that involve attention to bodily sensation, partner exercises, or the exploration of avoided sexual contexts. The therapeutic frame must be maintained with particular care: the vulnerability that clients experience in sharing sexual concerns, combined with the positive relational experiences that good clinical work generates, creates heightened transference and countertransference dynamics that require consistent supervision and reflective practice (American Association for Marriage and Family Therapy, 2015).</p>

<p>Scope of practice is a critical consideration. Mental health clinicians without specialized sex therapy training should provide psychoeducation about neurobiological frameworks, address the relational and attachment dimensions of sexual concerns, and make appropriate referrals to certified sex therapists for specialized sexual dysfunction treatment — rather than attempting to implement structured sex therapy protocols without adequate training. The American Association of Sexuality Educators, Counselors, and Therapists (AASECT) provides certification standards and training resources for clinicians seeking to develop specialized competence in sex therapy. The neurobiological frameworks presented in this course enhance any clinician's capacity to understand and address the sexual dimensions of their clients' concerns; they do not substitute for specialized sex therapy training when that level of intervention is indicated (AASECT, 2020).</p>

<p>Maintaining professional awareness of rapidly evolving research and clinical standards in the neuroscience of sexuality is itself an ethical obligation. The field has transformed substantially in the last two decades: the reclassification of sexual dysfunctions in DSM-5, the addition of compulsive sexual behavior disorder to ICD-11, the growing evidence base for mindfulness-based sex therapy, and the expanding neuroimaging literature on sexual response all represent changes that post-date the training of many currently practicing clinicians. Continuing education — including the kind of neuroscience literacy that this course aims to develop — is not merely a licensing requirement but a clinical responsibility in a field where the science is moving faster than the clinical training pipeline (Kraus et al., 2016).</p>

<h3>The Ethics of Therapeutic Presence in Sexual Clinical Work</h3>

<p>Working with clients around sexuality requires clinicians to attend carefully to their own countertransference — the emotional, somatic, and relational responses that this clinical territory inevitably activates. Countertransference in sexual clinical work is not a sign of inadequate training; it is an expected feature of work that touches the therapist's own relational history, bodily experience, cultural formation, and values. The clinician who claims no countertransference in this domain is not necessarily more skilled; they may simply be less self-aware. Effective clinical work with sexual concerns requires not the elimination of countertransference but its ongoing recognition, supervision, and use as data (American Association for Marriage and Family Therapy, 2015).</p>

<p>Therapeutic presence — the quality of full, embodied attentiveness to a client's experience that Carl Rogers identified as central to therapeutic change — has particular salience in sexual clinical work. Clients who are disclosing sexual concerns are typically in states of heightened vulnerability and shame; they are exquisitely sensitive to indicators of the therapist's comfort, discomfort, judgment, or interest. The therapist's own ventral vagal state — their embodied calm, their non-anxious engagement, their capacity to be present with difficult material without becoming defended or detached — is itself a therapeutic intervention. It creates the neurobiological conditions for the client's own ventral vagal engagement and, with it, the possibility of genuine self-disclosure and the beginning of shame reduction (Porges, 2011; Brown, 2010).</p>

<p>Finally, the neuroscience reviewed throughout this course returns us, ultimately, to the simplest and most enduring clinical truth: human beings are wired for connection. The dopaminergic pursuit, the oxytocinergic bonding, the insular awareness of pleasure, the default mode network's construction of a model of another person's inner world — all of these exquisitely complex neurological systems serve, at their deepest functional level, the same purpose: bringing one person into genuine proximity and recognition with another. Theodore Twombly's loss, at the end of Her, is not that he fell in love with an artificial intelligence. It is that the connection he experienced — however unconventional its object — was real enough to reorganize his nervous system around it. And when it ended, what remained was what always remains: the embodied, mortal, perpetually available human capacity to turn toward another person and begin again (Porges, 2011).</p>
<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">American Association for Sexuality Educators, Counselors, and Therapists. (2020). <em>AASECT scope of practice</em>. https://www.aasect.org/scope-practice</p>
  <p class="cr-reference">American Association for Marriage and Family Therapy. (2015). <em>AAMFT code of ethics</em>. https://www.aamft.org/Legal_Ethics/Code_of_Ethics.aspx</p>
  <p class="cr-reference">Aron, A., Norman, C. C., Aron, E. N., McKenna, C., &amp; Heyman, R. E. (2000). Couples' shared participation in novel and arousing activities and experienced relationship quality. <em>Journal of Personality and Social Psychology, 78</em>(2), 273–284. https://doi.org/10.1037/0022-3514.78.2.273</p>
  <p class="cr-reference">Bancroft, J., &amp; Janssen, E. (2000). The dual control model of male sexual response. <em>Neuroscience and Biobehavioral Reviews, 24</em>(5), 571–579. https://doi.org/10.1016/S0149-7634(00)00024-5</p>
  <p class="cr-reference">Brotto, L. A. (2018). <em>Better sex through mindfulness: How women can cultivate desire</em>. Greystone Books.</p>
  <p class="cr-reference">Johnson, S. M. (2004). <em>The practice of emotionally focused couple therapy</em> (2nd ed.). Brunner-Routledge.</p>
  <p class="cr-reference">Johnson, S. M. (2019). <em>Attachment theory in practice</em>. Guilford Press.</p>
  <p class="cr-reference">Levine, P. A. (2010). <em>In an unspoken voice</em>. North Atlantic Books.</p>
  <p class="cr-reference">Masters, W. H., &amp; Johnson, V. E. (1966). <em>Human sexual response</em>. Little, Brown.</p>
  <p class="cr-reference">Nagoski, E. (2015). <em>Come as you are</em>. Simon &amp; Schuster.</p>
  <p class="cr-reference">Ogden, P., Minton, K., &amp; Pain, C. (2006). <em>Trauma and the body: A sensorimotor approach to psychotherapy</em>. W. W. Norton.</p>
  <p class="cr-reference">Perel, E. (2006). <em>Mating in captivity: Unlocking erotic intelligence</em>. Harper.</p>
  <p class="cr-reference">Porges, S. W. (2011). <em>The polyvagal theory</em>. W. W. Norton.</p>
  <p class="cr-reference">van der Kolk, B. A. (2014). <em>The body keeps the score</em>. Viking.</p>
</div>
`;

// ─── COURSE DOCUMENT ──────────────────────────────────────────────────────────
const courseData = {
  slug: 'her-neuroscience-of-sex-and-connection-cr406',
  title: 'Her: The Neuroscience of Sex and Connection',
  subtitle: 'Desire, Bonding, and Clinical Practice Through a Neurobiological Lens',
  description: 'Drawing on Spike Jonze\'s 2013 film Her — in which a man falls in love with an AI operating system, raising fundamental questions about what desire, connection, and intimacy actually require — this course examines the neurobiology of sexual motivation and intimate bonding from a clinically applicable perspective. Participants will explore the dopaminergic architecture of desire, the oxytocinergic foundations of pair bonding, the neurological mechanisms underlying sexual dysfunction and relational disconnection, and the evidence-based clinical approaches that translate this science into sex-positive, trauma-informed practice. This course is designed for licensed mental health professionals working with individuals and couples around sexuality, intimacy, and relational wellbeing.',
  courseCode: 'CR-406',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    degree: 'MA',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC',
    category: 'category1',
  },
  ceHours: 2,
  ceCategory: 'Clinical',
  ceuHours: 2,
  ceuEligible: true,
  approvingBody: 'NBCC',
  approvalNumber: '#7760',
  accessType: 'paid',
  price: 24.99,
  pricingTier: 'standard',
  status: 'draft',
  isPublished: false,
  objectives: [
    'Identify the primary neurochemical systems — including dopamine, oxytocin, vasopressin, testosterone, and estrogen — involved in sexual desire and intimate bonding and explain their distinct and overlapping clinical roles.',
    'Describe the dual control model of sexual response (sexual excitation system and sexual inhibition system) and apply it to the clinical differentiation of desire dysfunction presentations.',
    'Explain the neurological mechanisms through which trauma, insecure attachment, and compulsive sexual behavior disrupt sexual and connective functioning.',
    'Apply polyvagal theory and stage-sensitive intervention principles to the sequencing of clinical interventions for individuals and couples presenting with sexual disconnection.',
    'Integrate sex-positive, trauma-informed, and culturally responsive frameworks into neuroscience-informed clinical practice with diverse client populations.',
  ],
  modules: [
    {
      title: 'Module 1: The Architecture of Desire — Neurobiological Foundations of Sexual Motivation',
      order: 1,
      contentBlocks: [],
      lessons: [
        { title: 'The Neurobiology of Sexual Desire', type: 'text', order: 1, content: module1Content },
        {
          title: 'Knowledge Check: Neurobiology of Desire',
          type: 'quiz', order: 2, isExam: false, showExplanations: true, shuffleQuestions: false,
          questions: [
            {
              question: "The dual control model proposes that sexual functioning is governed by which two systems?",
              type: "multiple_choice",
              options: [
                "The sympathetic (activation) and parasympathetic (rest) branches of the autonomic nervous system",
                "The sexual inhibition system (SIS) and sexual excitation system (SES) — brake and accelerator",
                "The testosterone-driven motivation system and the estrogen-driven receptivity system",
                "The reward (dopamine) system and the bonding (oxytocin) system in competition"
              ],
              correctAnswer: 1,
              explanation: "Bancroft and Janssen (2000) identified the SES (accelerator) and SIS (brake) as the two governing systems. Understanding both is clinically essential: low desire may reflect a low-sensitivity SES, a high-sensitivity SIS, or both — each requiring different intervention."
            },
            {
              question: "Responsive desire, as described by Nagoski (2015), is best characterized as which of the following?",
              type: "multiple_choice",
              options: [
                "A pathological form of desire associated with low testosterone requiring hormonal evaluation",
                "Desire that emerges in response to pleasurable stimulation rather than arising spontaneously — a normal variation in SES sensitivity",
                "A trauma-based inhibition pattern that suppresses spontaneous sexual motivation",
                "The form of desire that develops only after extended relationship stability and is characteristic of secure attachment"
              ],
              correctAnswer: 1,
              explanation: "Nagoski (2015) established that responsive desire — arising after pleasurable engagement rather than spontaneously — reflects normal variation in SES sensitivity. It is not pathological, though it is frequently misidentified as low desire, particularly in women who are compared to a spontaneous-desire template."
            },
            {
              question: "The insula's primary contribution to sexual and intimate experience is best described as which of the following?",
              type: "multiple_choice",
              options: [
                "Regulating testosterone production in response to sexual stimulation and novelty",
                "Coordinating pair bonding behaviors by integrating oxytocin signals with partner-specific memories",
                "Providing interoceptive awareness — the conscious perception of internal body states — that is the neurological substrate of embodied pleasure",
                "Suppressing amygdala threat responses during arousal to permit physiological sexual response"
              ],
              correctAnswer: 2,
              explanation: "Craig (2009) established the insula as the cortical hub of interoception — the felt sense of internal bodily states. In sexual experience, insular activation corresponds to the subjective experience of embodied pleasure; insular suppression (as in dissociation) corresponds to feeling 'absent' or 'not in one's body.'"
            },
          ],
        },
      ],
    },
    {
      title: 'Module 2: The Bonding Brain — Oxytocin, Vasopressin, and the Neuroscience of Intimate Connection',
      order: 2,
      contentBlocks: [],
      lessons: [
        { title: 'Neuroscience of Intimate Connection and Pair Bonding', type: 'text', order: 1, content: module2Content },
        {
          title: 'Knowledge Check: Bonding and Attachment',
          type: 'quiz', order: 2, isExam: false, showExplanations: true, shuffleQuestions: false,
          questions: [
            {
              question: "Which research finding by Young and Wang (2004) most directly explains why the oxytocinergic and vasopressinergic bonding systems produce partner-specific rather than generalized connection?",
              type: "multiple_choice",
              options: [
                "Oxytocin receptor density is highest in brain regions associated with olfactory partner recognition",
                "Vasopressin receptor density in the ventral pallidum determines pair bond formation, and these receptors are activated specifically during sexual contact with a particular partner",
                "Both oxytocin and vasopressin require sustained visual contact to produce bonding effects, ensuring partner-specificity",
                "The bonding systems require repeated co-sleeping to consolidate partner-specific neural associations"
              ],
              correctAnswer: 1,
              explanation: "Young and Wang (2004) demonstrated in prairie vole research that vasopressin receptor density in the ventral pallidum — activated during sexual contact with a specific partner — determines pair bond formation. This partner-specificity is the neurological basis for why bonding feels qualitatively different from general prosociality."
            },
            {
              question: "Anxiously attached individuals, according to Davis et al. (2006), tend to use sexual behavior primarily for which purpose?",
              type: "multiple_choice",
              options: [
                "As a form of playful self-expression unconstrained by attachment concerns",
                "As a strategy for reassurance-seeking and managing abandonment fear rather than as an expression of genuine desire and mutual pleasure",
                "To avoid emotional intimacy by substituting physical contact for vulnerable relational engagement",
                "To establish dominance and control within the relational dynamic"
              ],
              correctAnswer: 1,
              explanation: "Davis et al. (2006) found that anxiously attached individuals frequently use sex instrumentally — as reassurance-seeking and a bid for closeness that manages abandonment fear. This produces sexual compliance, initiation driven by anxiety, and difficulty accessing genuine desire as a basis for sexual engagement."
            },
            {
              question: "The default mode network's role in intimate connection is best described as which of the following?",
              type: "multiple_choice",
              options: [
                "Regulating autonomic arousal during emotionally intense relational encounters",
                "Generating the felt experience of being deeply known through the construction of an elaborate, specific model of the partner's inner world",
                "Coordinating the release of oxytocin during moments of emotional vulnerability and attunement",
                "Suppressing threat responses in the amygdala when a trusted partner is present"
              ],
              correctAnswer: 1,
              explanation: "Buckner et al. (2008) and Fonagy et al. (2002) established that the DMN — active during social cognition and mentalization — generates the subjective felt experience of being known by constructing and continuously updating a model of the partner's inner world. Accurate mentalization produces the recognition that is the deepest form of intimate connection."
            },
          ],
        },
      ],
    },
    {
      title: 'Module 3: When Systems Diverge — Disruptions to Sexual and Connective Functioning',
      order: 3,
      contentBlocks: [],
      lessons: [
        { title: 'Neurological Disruptions to Sexual and Relational Functioning', type: 'text', order: 1, content: module3Content },
        {
          title: 'Knowledge Check: Clinical Disruptions',
          type: 'quiz', order: 2, isExam: false, showExplanations: true, shuffleQuestions: false,
          questions: [
            {
              question: "SSRI-induced sexual dysfunction operates through which primary neurological mechanism?",
              type: "multiple_choice",
              options: [
                "Increased serotonin inhibits dopamine release via descending pathways and suppresses nitric oxide synthesis required for genital arousal",
                "SSRIs elevate cortisol through HPA axis activation, which suppresses gonadal testosterone production",
                "Serotonin directly reduces amygdala reactivity, paradoxically suppressing the emotional arousal required for sexual engagement",
                "SSRIs compete with testosterone at hypothalamic receptors, reducing MPOA sensitivity to sexual stimuli"
              ],
              correctAnswer: 0,
              explanation: "Serretti and Chiesa (2009) established that SSRIs produce sexual dysfunction through two primary mechanisms: serotonin-mediated inhibition of dopamine release (reducing desire and motivation) and suppression of nitric oxide synthesis (preventing genital arousal and orgasm). This is a pharmacological side effect, not a psychological one."
            },
            {
              question: "Perel's (2006) framework suggests that desire discrepancy in long-term relationships most fundamentally reflects which tension?",
              type: "multiple_choice",
              options: [
                "A mismatch between partners' testosterone levels producing asymmetric sexual motivation",
                "Incompatible SES/SIS profiles that require individual rather than relational clinical intervention",
                "The inherent tension between the security and familiarity that attachment provides and the novelty and otherness that the dopaminergic desire system requires",
                "Chronic SIS activation from unresolved resentment that suppresses arousal in the higher-desire partner"
              ],
              correctAnswer: 2,
              explanation: "Perel (2006) argues that the conditions attachment provides — safety, familiarity, mutual knowing — conflict with the novelty-seeking requirements of the dopaminergic desire system. This is not a relational failure but a fundamental tension between two neurological systems with partially incompatible requirements."
            },
            {
              question: "Compulsive sexual behavior neurologically involves which pattern, according to Gola et al. (2017) and Kraus et al. (2016)?",
              type: "multiple_choice",
              options: [
                "Abnormally high testosterone levels that override prefrontal regulatory inhibitory control",
                "Hyperactivation of the ventral striatum in response to sexual cues combined with reduced prefrontal regulatory capacity",
                "Serotonin deficiency producing obsessive-compulsive patterns applied specifically to sexual behavior",
                "Oxytocin dysregulation preventing bonding formation following sexual contact, driving continued pursuit"
              ],
              correctAnswer: 1,
              explanation: "Gola et al. (2017) and Kraus et al. (2016) identified compulsive sexual behavior's neurological signature as heightened ventral striatal cue-reactivity combined with reduced prefrontal regulatory capacity — an enhanced accelerator response coupled with a weakened braking system. This pattern is analogous to, but distinct from, substance use disorders."
            },
          ],
        },
      ],
    },
    {
      title: 'Module 4: Clinical Practice — Sex-Positive, Trauma-Informed, and Neurologically Grounded Intervention',
      order: 4,
      contentBlocks: [],
      lessons: [
        { title: 'Translating Neuroscience Into Clinical Practice', type: 'text', order: 1, content: module4Content },
        {
          title: 'Final Examination: Her — Neuroscience of Sex and Connection',
          type: 'quiz', order: 2, isExam: true, passingScore: 80, maxAttempts: 3,
          shuffleQuestions: true, showExplanations: false,
          questions: examQuestions,
        },
      ],
    },
  ],

  assessment: { questions: examQuestions, passingScore: 80, maxAttempts: 3 },

  references: [
    { title: "Patterns of attachment: A psychological study of the strange situation", author: "Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S.", year: 1978, source: "Lawrence Erlbaum Associates" },
    { title: "AAMFT code of ethics", author: "American Association for Marriage and Family Therapy", year: 2015, source: "https://www.aamft.org/Legal_Ethics/Code_of_Ethics.aspx" },
    { title: "Couples' shared participation in novel and arousing activities and experienced relationship quality", author: "Aron, A., Norman, C. C., Aron, E. N., McKenna, C., & Heyman, R. E.", year: 2000, source: "Journal of Personality and Social Psychology, 78(2), 273–284" },
    { title: "The dual control model of male sexual response", author: "Bancroft, J., & Janssen, E.", year: 2000, source: "Neuroscience and Biobehavioral Reviews, 24(5), 571–579" },
    { title: "Attachment and loss: Vol. 1. Attachment", author: "Bowlby, J.", year: 1969, source: "Basic Books" },
    { title: "Better sex through mindfulness", author: "Brotto, L. A.", year: 2018, source: "Greystone Books" },
    { title: "The brain's default network: Anatomy, function, and relevance to disease", author: "Buckner, R. L., Andrews-Hanna, J. R., & Schacter, D. L.", year: 2008, source: "Annals of the New York Academy of Sciences, 1124, 1–38" },
    { title: "Neuroendocrine perspectives on social attachment and love", author: "Carter, C. S.", year: 1998, source: "Psychoneuroendocrinology, 23(8), 779–818" },
    { title: "How do you feel — now? The anterior insula and human awareness", author: "Craig, A. D.", year: 2009, source: "Nature Reviews Neuroscience, 10(1), 59–70" },
    { title: "Efficacy and safety of testosterone in the management of hypoactive sexual desire disorder", author: "Davis, S. R., & Braunstein, G. D.", year: 2012, source: "The Journal of Sexual Medicine, 9(4), 1134–1148" },
    { title: "I can't get no satisfaction: Insecure attachment, inhibited sexual communication, and sexual dissatisfaction", author: "Davis, D., Shaver, P. R., Widaman, K. F., Vernon, M. L., Follette, W. C., & Beitz, K.", year: 2006, source: "Personal Relationships, 13(4), 465–483" },
    { title: "The neuropeptide oxytocin regulates parochial altruism in intergroup conflict", author: "De Dreu, C. K. W., Greer, L. L., Handgraaf, M. J. J., Shalvi, S., Van Kleef, G. A., Baas, M., Ten Velden, F. S., Van Dijk, E., & Feith, S. W. W.", year: 2010, source: "Science, 328(5984), 1408–1411" },
    { title: "The neurobiology of human attachments", author: "Feldman, R.", year: 2017, source: "Trends in Cognitive Sciences, 21(2), 80–99" },
    { title: "Why we love: The nature and chemistry of romantic love", author: "Fisher, H. E.", year: 2004, source: "Henry Holt" },
    { title: "Romantic love: An fMRI study of a neural mechanism for mate choice", author: "Fisher, H. E., Aron, A., & Brown, L. L.", year: 2005, source: "Journal of Comparative Neurology, 493(1), 58–62" },
    { title: "Affect regulation, mentalization, and the development of the self", author: "Fonagy, P., Gergely, G., Jurist, E. L., & Target, M.", year: 2002, source: "Other Press" },
    { title: "Can pornography be addictive? An fMRI study of men seeking treatment for problematic pornography use", author: "Gola, M., Wordecha, M., Sescousse, G., Lew-Starowicz, M., Kossowski, B., Wypych, M., Makeig, S., Potenza, M. N., & Marchewka, A.", year: 2017, source: "Neuropsychopharmacology, 42(10), 2021–2031" },
    { title: "The practice of emotionally focused couple therapy", author: "Johnson, S. M.", year: 2004, source: "Brunner-Routledge" },
    { title: "Attachment theory in practice", author: "Johnson, S. M.", year: 2019, source: "Guilford Press" },
    { title: "Should compulsive sexual behavior be considered an addiction?", author: "Kraus, S. W., Voon, V., & Potenza, M. N.", year: 2016, source: "Addiction, 111(12), 2097–2106" },
    { title: "Prolactinergic and dopaminergic mechanisms underlying sexual arousal and orgasm in humans", author: "Kruger, T. H. C., Hartmann, U., & Schedlowski, M.", year: 2003, source: "World Journal of Urology, 23(2), 130–138" },
    { title: "Principles and practice of sex therapy", author: "Leiblum, S. R. (Ed.)", year: 2007, source: "Guilford Press" },
    { title: "In an unspoken voice: How the body releases trauma and restores goodness", author: "Levine, P. A.", year: 2010, source: "North Atlantic Books" },
    { title: "Human sexual response", author: "Masters, W. H., & Johnson, V. E.", year: 1966, source: "Little, Brown" },
    { title: "Attachment in adulthood: Structure, dynamics, and change", author: "Mikulincer, M., & Shaver, P. R.", year: 2016, source: "Guilford Press" },
    { title: "Come as you are: The surprising new science that will transform your sex life", author: "Nagoski, E.", year: 2015, source: "Simon & Schuster" },
    { title: "Trauma and the body: A sensorimotor approach to psychotherapy", author: "Ogden, P., Minton, K., & Pain, C.", year: 2006, source: "W. W. Norton" },
    { title: "Mating in captivity: Unlocking erotic intelligence", author: "Perel, E.", year: 2006, source: "Harper" },
    { title: "Who, what, where, when (and maybe even why)? How the experience of sexual reward connects sexual desire, preference, and performance", author: "Pfaus, J. G., Kippin, T. E., Coria-Avila, G. A., Gelez, H., Afonso, V. M., Ismail, N., & Parada, M.", year: 2012, source: "Archives of Sexual Behavior, 41(1), 31–62" },
    { title: "The polyvagal theory", author: "Porges, S. W.", year: 2011, source: "W. W. Norton" },
    { title: "Treatment-emergent sexual dysfunction related to antidepressants", author: "Serretti, A., & Chiesa, A.", year: 2009, source: "Journal of Clinical Psychopharmacology, 29(3), 259–266" },
    { title: "Mindsight: The new science of personal transformation", author: "Siegel, D. J.", year: 2010, source: "Bantam Books" },
    { title: "Wired for love", author: "Tatkin, S.", year: 2011, source: "New Harbinger Publications" },
    { title: "The body keeps the score: Brain, mind, and body in the healing of trauma", author: "van der Kolk, B. A.", year: 2014, source: "Viking" },
    { title: "Neural correlates of sexual cue reactivity in individuals with and without compulsive sexual behaviours", author: "Voon, V., Mole, T. B., Banca, P., Porter, L., Morris, L., Mitchell, S., Lapa, T. R., Karr, J., Harrison, N. A., Potenza, M. N., & Irvine, M.", year: 2014, source: "PLOS ONE, 9(7), e102419" },
    { title: "Genetic variation in the vasopressin receptor 1a gene associates with pair-bonding behavior in humans", author: "Walum, H., Westberg, L., Henningsson, S., Neiderhiser, J. M., Reiss, D., Igl, W., Ganiban, J. M., Spotts, E. L., Pedersen, N. L., Eriksson, E., & Lichtenstein, P.", year: 2008, source: "Proceedings of the National Academy of Sciences, 105(37), 14153–14156" },
    { title: "The neurobiology of pair bonding", author: "Young, L. J., & Wang, Z.", year: 2004, source: "Nature Neuroscience, 7(10), 1048–1054" },
  ],

  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true,
  },
};

// ─── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  const existing = await Course.findOne({ slug: courseData.slug });
  if (existing) { await Course.deleteOne({ slug: courseData.slug }); console.log('Removed existing CR-406'); }
  const course = new Course(courseData);
  await course.save();
  console.log(`✅ CR-406 seeded: ${course.title}`);
  console.log(`   Modules: ${course.modules.length}`);
  console.log(`   Exam questions: ${examQuestions.length}`);
  console.log(`   References: ${course.references.length}`);
  console.log(`   Status: ${course.status}`);
  await mongoose.disconnect();
  console.log('Done.');
}
seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
// EXPANSION MARKER - not executed
