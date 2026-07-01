import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-cli-601-attachment-theory';

const COURSE = {
  courseCode: 'CR-CLI-601',
  title: 'Attachment Theory in Adult Psychotherapy: Assessment and Intervention',
  slug: SLUG,
  ceHours: 3,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  description: 'This course provides a comprehensive examination of attachment theory as applied to adult psychotherapy practice. Participants will explore John Bowlby\'s foundational concepts, the four adult attachment styles, evidence-based assessment tools, and attachment-informed clinical interventions including mentalization, emotion regulation, and using the therapeutic relationship as a corrective attachment experience.',
  isPublished: false,
  status: 'draft',
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
  approvals: [
    {
      body: 'NBCC',
      number: '#7760',
      hourBreakdown: [{ label: 'core', hours: 3 }]
    }
  ],

  sections: [
    // ─── SECTION 0: INTRODUCTION ─────────────────────────────────────────────
    {
      title: 'Introduction to Attachment Theory in Psychotherapy',
      sectionNumber: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Welcome to CR-CLI-601',
          subtitle: 'Attachment Theory in Adult Psychotherapy: Assessment and Intervention',
          sectionNumber: 0
        },
        {
          type: 'text',
          content: `<p>Attachment theory stands as one of the most empirically robust and clinically generative frameworks in the history of psychotherapy. Originally developed by British psychiatrist and psychoanalyst John Bowlby in the 1950s and 1960s, attachment theory began as a radical departure from the drive-theory models that dominated psychoanalysis at the time. Bowlby proposed that the human infant's tie to the caregiver was not merely a derivative of feeding or libidinal satisfaction, but a primary motivational system in its own right — shaped by millions of years of evolutionary pressure toward survival, proximity-seeking, and protection from threat.</p>

<p>What Bowlby could not have fully anticipated was how profoundly his framework would transform the landscape of adult psychotherapy. Today, decades after his foundational trilogy <em>Attachment</em>, <em>Separation</em>, and <em>Loss</em>, we understand that the attachment behavioral system does not simply switch off at adolescence. It remains active across the full lifespan, influencing how adults seek comfort, regulate distress, form intimate bonds, navigate conflict, and relate to therapists in the consulting room. The adult seeking psychotherapy is, among many other things, an attachment figure seeking safe harbor — and the clinician who understands this dynamic holds a powerful therapeutic lever.</p>

<p>This course is designed for licensed mental health professionals who want to move beyond surface familiarity with attachment concepts and develop a nuanced, clinically operational understanding of how attachment theory applies in everyday practice. Whether you work with individuals struggling with chronic relationship difficulties, complex trauma, borderline personality organization, anxious depression, or somatic complaints with no clear medical etiology, attachment theory offers both explanatory depth and intervention direction.</p>

<p>Over the next three sections, you will explore: the foundational building blocks of attachment theory and the adult attachment classification system; how attachment patterns show up in clinical presentations, intake assessment, and the therapeutic relationship; and concrete, evidence-based interventions derived from attachment theory, including mentalization-based treatment, emotion-focused approaches, and strategies for working with the most challenging clinical presentation — disorganized attachment. By the end of this course, you will have both the conceptual scaffolding and the practical tools to integrate attachment-informed practice into your clinical work with adults.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Overview: Attachment Theory and Adult Psychotherapy',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER',
          content: 'This introductory video provides a brief visual overview of attachment theory\'s journey from infant observation research to adult psychotherapy application. As you watch, notice how the core concepts of the safe haven, secure base, proximity-seeking, and protest/despair map onto adult therapeutic relationships.'
        },
        {
          type: 'reflection',
          question: 'Before we begin, take a moment to reflect on your current clinical practice. Think of a client with whom the therapeutic relationship has felt particularly difficult — perhaps characterized by excessive dependency, emotional distance, or unpredictable ruptures. Without yet using formal attachment language, what patterns do you notice? How does that client seek comfort or manage distress in sessions?'
        }
      ]
    },

    // ─── SECTION 1: FOUNDATIONS ──────────────────────────────────────────────
    {
      title: 'Foundations of Attachment Theory: Styles, Classification, and the Lifespan',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Section 1: Foundations of Attachment Theory',
          subtitle: 'Attachment Styles, Classification Systems, and the Concept of Earned Security',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>John Bowlby's theoretical architecture rests on a small number of interconnected concepts that, taken together, constitute a remarkably complete model of emotional development. Central to his framework is the concept of the <strong>attachment behavioral system</strong> — an innate, species-wide motivational system that becomes activated under conditions of threat, fatigue, illness, or perceived danger and drives the individual toward proximity with a preferred attachment figure. The system's goal state is not contact per se, but the subjective sense of security — what Bowlby called "felt security" — that comes from knowing the attachment figure is accessible and responsive.</p>

<p>The complementary concept of the <strong>caregiving system</strong> operates on the side of the attachment figure: a reciprocal motivational system that drives the caregiver toward responding to the attached individual's distress signals with comfort, protection, and reassurance. When both systems function well — when the infant signals distress and the caregiver responds consistently, sensitively, and in a timely manner — the child is able to use the caregiver as a <strong>safe haven</strong> in times of threat and as a <strong>secure base</strong> from which to explore the environment during periods of safety. These twin functions, safe haven and secure base, become internalized over time as an <strong>internal working model</strong> — a set of cognitive-affective schemas representing the self as worthy or unworthy of care, and the other as available or unavailable, trustworthy or threatening.</p>

<p>Mary Ainsworth's landmark Strange Situation studies, conducted at Johns Hopkins University in the late 1960s and early 1970s, provided the first empirical typology of infant attachment. By systematically observing how infants between 12 and 18 months responded to brief separations from and reunions with their caregivers, Ainsworth identified three distinct patterns: <strong>secure attachment</strong>, characterized by confident use of the caregiver as safe haven and secure base, mild protest at separation, and quick comfort at reunion; <strong>anxious-ambivalent (resistant) attachment</strong>, characterized by heightened distress at separation, difficulty being soothed at reunion, and a mixture of clinging and angry resistance; and <strong>avoidant attachment</strong>, characterized by apparent indifference to separation and reunion, with behavioral deactivation masking underlying physiological arousal.</p>

<p>Main and Solomon's subsequent research identified a fourth pattern — <strong>disorganized attachment</strong> — characterized by the breakdown of any consistent strategy for managing proximity to the caregiver. Disorganized infants, often those with frightening or frightened caregivers (as in maltreatment or unresolved caregiver trauma), show contradictory, disoriented, or apprehensive behaviors at reunion: approaching while looking away, freezing, rocking, or showing sudden behavioral collapse. This pattern, which occurs at rates of roughly 15-18% in normative samples and 50-80% in high-risk populations, carries the most significant long-term risk for psychopathology and will be treated in depth in Section 3.</p>

<p>The translation of infant attachment classifications into adult attachment representations was accomplished through Mary Main and colleagues' development of the Adult Attachment Interview (AAI) in the 1980s. The AAI is a semi-structured interview that asks adults to describe their childhood relationships with parents and to provide specific memories supporting their characterizations. What the AAI measures is not the content of the autobiography but rather its <strong>narrative coherence</strong> — the degree to which the speaker can reflect on childhood experiences in a thoughtful, balanced, and internally consistent manner. The AAI yields four primary classifications: <strong>Autonomous/Secure</strong> (coherent, balanced, valuing of attachment); <strong>Dismissing</strong> (minimizing, idealizing or derogating, insisting on lack of memory); <strong>Preoccupied</strong> (angry, passive, entangled, maximizing); and <strong>Unresolved/Disorganized</strong> (lapses in monitoring of reasoning or discourse when discussing loss or abuse).</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Earned Security: A Critical Clinical Concept',
          content: `<p><strong>Earned security</strong> refers to an autonomous/secure AAI classification achieved by adults who report histories of adverse, neglectful, or abusive childhood experiences. Unlike "continuous security" — autonomy rooted in a genuinely supportive early environment — earned security emerges through a process of meaning-making, integration, and grief work, often facilitated by a significant therapeutic or relational experience in adulthood.</p>

<p>Clinically, earned security is one of the most important attachment concepts because it demonstrates that attachment security is not destiny. Adults who have worked through difficult attachment histories — who can describe painful experiences with coherence, appropriate affect, and without idealizing or denigrating caregivers — show outcomes comparable to continuously secure individuals on key measures including parenting sensitivity, mental health, and relationship quality. The existence of earned security is an empirical argument for the transformative potential of psychotherapy, and the mechanism by which it develops (reflective processing, integration of affect and memory, grief) maps closely onto what happens in good attachment-informed clinical work.</p>`
        },
        {
          type: 'text',
          content: `<p>Self-report attachment measures represent the second major assessment tradition, developed largely independently of the AAI within social and personality psychology. Hazan and Shaver's 1987 conceptualization of romantic attachment in terms of Ainsworth's three infant categories launched a wave of adult self-report research. The most widely used dimensional self-report measure today is the <strong>Experiences in Close Relationships scale (ECR)</strong> and its revised version (ECR-R), developed by Brennan, Clark, and Shaver (1998). The ECR-R assesses attachment on two orthogonal dimensions: <strong>attachment anxiety</strong> (fear of abandonment, hypervigilance to rejection cues, intense desire for closeness) and <strong>attachment avoidance</strong> (discomfort with closeness, preference for self-reliance, deactivation of attachment needs).</p>

<p>These two dimensions yield a two-by-two typology that maps onto the interview-based system. Low anxiety and low avoidance constitute <strong>secure attachment</strong>. High anxiety and low avoidance constitute <strong>anxious-preoccupied attachment</strong> — the adult equivalent of Ainsworth's anxious-ambivalent infants, characterized by hyperactivating strategies that intensify distress signals to compel caregiver response. High avoidance and low anxiety constitute <strong>dismissing-avoidant attachment</strong> — the adult equivalent of avoidant infants, characterized by deactivating strategies that suppress attachment needs and maintain self-sufficiency as a defensive posture. High anxiety and high avoidance together constitute <strong>fearful-avoidant attachment</strong> — a category that maps most closely onto the disorganized infant pattern and is characterized by both the desperate desire for closeness and the terror of it.</p>

<p>Understanding the distinction between hyperactivating and deactivating regulatory strategies is clinically essential. <strong>Hyperactivating strategies</strong>, characteristic of anxious-preoccupied attachment, involve amplifying distress signals, narrowing attentional focus onto attachment-relevant threats, engaging in frequent reassurance-seeking, ruminating on relationship concerns, and maintaining hypervigilance for signs of rejection or abandonment. The strategic logic of hyperactivation is to keep the attachment figure engaged: if the caregiver has been intermittently responsive, escalating the signal increases the probability of a response. The cost is chronic emotional dysregulation, poor distress tolerance, and difficulty engaging in autonomous exploration.</p>

<p><strong>Deactivating strategies</strong>, characteristic of dismissing-avoidant attachment, involve inhibiting the expression of attachment needs, suppressing negative affect, deflecting attention away from distress, maintaining emotional distance, and emphasizing self-reliance. The strategic logic of deactivation is to avoid rejection from an attachment figure who has consistently rebuffed proximity-seeking: by appearing not to need comfort, the individual avoids the pain of repeated rejection. The cost is limited capacity for intimacy, difficulty accessing and processing emotions, and a brittle self-sufficiency that can collapse under extreme stress.</p>

<p>Research by Mikulincer, Shaver, and colleagues has documented that these strategies extend far beyond intimate relationships into how individuals process information, regulate affect, maintain self-esteem, and relate to out-groups — making them pervasive features of psychological functioning rather than relationship-specific tendencies. For the clinician, attachment strategies manifest in session in specific, recognizable ways that we will explore in detail in Section 2.</p>`
        },
        {
          type: 'accordion',
          title: 'The Four Adult Attachment Styles: Clinical Profiles',
          accordionItems: [
            {
              title: 'Secure Attachment (Low Anxiety, Low Avoidance)',
              content: `<p>Securely attached adults hold a positive model of self as worthy of care and a positive model of others as generally trustworthy and available. They are comfortable with intimacy and interdependence, can seek support when distressed without becoming overwhelmed, and can also function autonomously without feeling abandoned. In therapy, secure clients tend to form alliances readily, tolerate interpretation, repair ruptures with relative ease, and engage in the exploratory work of psychotherapy. They provide AAI narratives that are coherent, balanced, and appropriately emotionally textured. Bowlby estimated that roughly 55-60% of normative adult samples show secure attachment, though this varies by population and measurement method.</p>`
            },
            {
              title: 'Anxious-Preoccupied Attachment (High Anxiety, Low Avoidance)',
              content: `<p>Adults with anxious-preoccupied attachment hold a negative model of self (unworthy, deficient, fundamentally flawed) combined with a positive but anguished model of others (desirable and needed, but experienced as withholding or likely to abandon). Their hyperactivating regulatory strategy keeps them chronically oriented toward attachment figures at the cost of autonomous functioning. In clinical presentations, preoccupied adults often present with symptoms of anxiety, depression, dependent personality features, or relationship crises. In session, they may seek excessive reassurance from the therapist, escalate emotional expression when they fear the therapist is disengaged, struggle to tolerate session endings, and experience intense reactions to breaks or therapist absences. Their AAI narratives are typically characterized by angry, passive, or confused discourse about childhood caregivers — long, entangled descriptions that fail to resolve into a coherent perspective.</p>`
            },
            {
              title: 'Dismissing-Avoidant Attachment (Low Anxiety, High Avoidance)',
              content: `<p>Adults with dismissing-avoidant attachment hold a positive — often inflated — model of self (self-sufficient, competent, not needing others) combined with a negative or devalued model of others (unreliable, intrusive, or simply unnecessary). Their deactivating strategy keeps distress suppressed and attachment needs out of awareness. Clinically, dismissing adults often present with somatic complaints, work-related difficulties, or partner complaints about emotional unavailability. They may come to therapy reluctantly, minimize the significance of their difficulties, struggle to identify emotions, and maintain an intellectual distance from affect. In session, they may dismiss the importance of the therapeutic relationship, resist vulnerability, and leave therapy prematurely when they begin to feel dependent. Their AAI narratives are characterized by idealization of caregivers without supporting memories, insistence on poor recall, or normalization of clearly painful experiences ("it was fine, everyone goes through that").</p>`
            },
            {
              title: 'Fearful-Avoidant Attachment (High Anxiety, High Avoidance)',
              content: `<p>Fearful-avoidant adults hold negative models of both self and others — they desperately want closeness but are simultaneously terrified of it because they expect to be hurt, rejected, or overwhelmed. This approach-avoidance conflict produces the most dysregulated, fragmented presentations in clinical practice. The fearful-avoidant pattern maps most closely onto the disorganized infant classification and is strongly associated with histories of early abuse, neglect, or caregiver frightening behavior. Clinically, fearful-avoidant adults often present with features of BPD, complex PTSD, or severe affective instability. In therapy, they may oscillate rapidly between idealization and devaluation of the therapist, experience intense shame when they express need, and engage in self-destructive behaviors when closeness in the therapeutic relationship triggers intolerable anxiety. Working with fearful-avoidant clients requires the clinician to maintain extraordinary steadiness, predictability, and capacity to tolerate relational intensity without retaliation or withdrawal.</p>`
            },
            {
              title: 'Unresolved/Disorganized Attachment (AAI Classification)',
              content: `<p>In the AAI system, an Unresolved classification is assigned when an otherwise coherent narrative shows specific lapses in the monitoring of reasoning or discourse when the speaker discusses losses or experiences of abuse. These lapses — such as speaking of a dead parent in the present tense, believing oneself causally responsible for a death, extended silence, or sudden shifts to highly disorganized speech — indicate that the attachment-related trauma or loss has not been psychologically integrated. The Unresolved classification is superimposed on the primary classification (e.g., Unresolved/Preoccupied or Unresolved/Dismissing) and identifies adults whose parenting of their own children is at highest risk for transmitting disorganized attachment to the next generation. In clinical work, unresolved status typically requires trauma-focused treatment alongside the broader attachment-informed work.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Two-Dimensional Model of Adult Attachment',
          content: `<p>The Experiences in Close Relationships (ECR-R) framework organizes adult attachment into two continuous dimensions: attachment anxiety (vertical axis) and attachment avoidance (horizontal axis). Secure attachment occupies the low-anxiety/low-avoidance quadrant. Anxious-preoccupied attachment is characterized by high anxiety with low avoidance. Dismissing-avoidant attachment features high avoidance with low anxiety. Fearful-avoidant attachment — the most clinically complex pattern — is characterized by both high anxiety and high avoidance, reflecting the fundamental conflict between the desire for closeness and the terror of it.</p>
          <p>This dimensional model is valuable clinically because it reminds us that attachment is not categorical but continuous. A client may score in the mid-range on both dimensions, showing mixed features across styles. Treatment planning benefits from understanding where a client sits on each dimension independently rather than forcing a categorical diagnosis.</p>`,
          image: '',
          imageAlt: 'Two-dimensional grid showing adult attachment styles with anxiety on the vertical axis and avoidance on the horizontal axis. The four quadrants are labeled: Secure (low-low), Anxious-Preoccupied (high anxiety-low avoidance), Dismissing-Avoidant (low anxiety-high avoidance), and Fearful-Avoidant (high-high).',
          imagePosition: 'right'
        },
        {
          type: 'multipleChoice',
          question: 'According to the Adult Attachment Interview (AAI), what distinguishes "earned security" from "continuous security"?',
          options: [
            { text: 'Earned security is measured only by self-report instruments, while continuous security is measured by the AAI.', isCorrect: false },
            { text: 'Earned security reflects an autonomous/secure classification achieved by adults who describe adverse early attachment experiences but have integrated them coherently.', isCorrect: true },
            { text: 'Earned security refers to clients who have completed at least two years of psychotherapy, regardless of their narrative coherence.', isCorrect: false },
            { text: 'Earned security is a provisional classification assigned when interview data are insufficient to make a primary determination.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Earned security, as described by Main and colleagues, refers to adults who report histories of adverse, neglectful, or abusive childhood attachment relationships but who demonstrate autonomous/secure classification on the AAI due to their coherent, balanced, and emotionally integrated narrative. It differs from continuous security (secure attachment rooted in a genuinely supportive early environment) by the adversity in the history, but the outcome in terms of narrative coherence, reflective capacity, and relational functioning is comparable. This concept is clinically significant because it demonstrates that early attachment adversity is not destiny and validates the transformative potential of psychotherapy.'
        },
        {
          type: 'text',
          content: `<p>The concept of the internal working model deserves extended clinical attention because it is the primary mechanism through which early attachment experiences shape adult functioning. Bowlby borrowed the term "working model" from the philosopher Kenneth Craik, who proposed that the nervous system constructs small-scale models of reality that allow the organism to anticipate events and plan action. Bowlby proposed that infants construct working models of their primary attachment figures — models that encode not just the figure's physical characteristics but their emotional availability, responsiveness, and predictability — and a complementary model of the self as more or less worthy of care and capable of eliciting it.</p>

<p>These models are not static representations but dynamic, procedural structures — more like scripts or programs than photographs. They operate largely outside conscious awareness, shaping the individual's perceptual biases (what they notice and what they filter out in close relationships), emotional responses (what feelings are accessible and what are suppressed), behavioral tendencies (how they act when distressed), and interpersonal expectations (what they anticipate from others). A person with a working model of others as unreliable will systematically scan for signs of rejection, interpret ambiguous social cues as threatening, and behave in ways that, paradoxically, sometimes elicit the very rejection they fear — a process Bowlby described as "fear of loss leads to behavior which makes the feared loss more likely."</p>

<p>The clinical implications are significant. Internal working models tend toward stability and self-confirmation because they operate as perceptual filters: experience that confirms the model is processed fluently, while disconfirming experience is either distorted to fit the model or simply not encoded. This is why merely having positive relational experiences — including with a therapist — is insufficient to shift attachment organization. What is required is a process of noticing the model operating, creating sufficient distance from it to examine it reflectively, and gradually constructing an alternative model through repeated relational experience that is explicitly processed and metabolized. This is the core therapeutic mechanism in attachment-informed psychotherapy.</p>

<p>Research by Fraley and colleagues using longitudinal designs has shown that attachment security from infancy shows modest but statistically significant continuity across development — roughly r = .30 to .40 in studies that follow individuals from early childhood to adolescence or adulthood. This continuity reflects the self-stabilizing tendency of working models but also leaves substantial room for change, particularly following significant relational events, losses, therapeutic experiences, or the development of new intimate relationships with more secure partners. Understanding the conditions under which working models can be updated is central to the practice of attachment-informed psychotherapy.</p>`
        },
        {
          type: 'flashcardDeck',
          title: 'Attachment Theory: Core Concepts',
          flashcards: [
            {
              front: 'What is the attachment behavioral system?',
              back: 'An innate, evolutionarily shaped motivational system that becomes activated under conditions of threat or distress and drives the individual toward proximity with a preferred attachment figure. Its goal state is "felt security" — the subjective sense that the attachment figure is accessible and responsive.'
            },
            {
              front: 'What are the two functions of the attachment figure described by Bowlby?',
              back: 'The safe haven — a source of comfort, protection, and reassurance during times of threat or distress; and the secure base — a foundation from which the attached individual can confidently explore the world, knowing the attachment figure is available if needed.'
            },
            {
              front: 'What is an internal working model?',
              back: 'A set of cognitive-affective schemas, operating largely outside conscious awareness, that represent the self (as worthy or unworthy of care), the attachment figure (as available or unavailable), and the relationship between them. Working models shape perceptual biases, emotional responses, and behavioral patterns in close relationships.'
            },
            {
              front: 'What are hyperactivating strategies?',
              back: 'Regulatory strategies characteristic of anxious-preoccupied attachment that involve amplifying distress signals, narrowing attention onto attachment threats, intensifying reassurance-seeking, and maintaining hypervigilance for rejection cues. The strategic logic is to keep an intermittently responsive caregiver engaged by escalating the signal.'
            },
            {
              front: 'What are deactivating strategies?',
              back: 'Regulatory strategies characteristic of dismissing-avoidant attachment that involve inhibiting the expression of attachment needs, suppressing negative affect, deflecting attention away from distress, and emphasizing self-reliance. The strategic logic is to avoid rejection from a consistently unresponsive caregiver by appearing not to need comfort.'
            },
            {
              front: 'What distinguishes the AAI from self-report attachment measures?',
              back: 'The AAI (Adult Attachment Interview) measures the coherence and organization of attachment-related narrative — how an adult describes and reflects on childhood experiences — rather than explicit self-reported attitudes. The AAI captures procedural, largely implicit attachment representations; self-report measures (like the ECR-R) capture explicit, semantic attitudes about attachment in relationships.'
            },
            {
              front: 'What is the Strange Situation Procedure?',
              back: 'A standardized laboratory paradigm developed by Mary Ainsworth to assess infant attachment to a caregiver. The procedure involves a series of brief separations and reunions in an unfamiliar room with a stranger, and infant behavior at reunion is used to classify attachment as secure, anxious-ambivalent, or avoidant (with disorganized later added by Main and Solomon).'
            },
            {
              front: 'What defines disorganized attachment in infancy?',
              back: 'The absence or breakdown of any consistent behavioral strategy for managing proximity to the caregiver, observed during reunions in the Strange Situation. Disorganized behaviors include contradictory approach-avoidance movements, freezing, disoriented facial expressions, apprehension toward the caregiver, and sudden behavioral collapse. It occurs when the caregiver is simultaneously a source of fear and the only available haven of safety.'
            }
          ]
        },
        {
          type: 'multiSelect',
          question: 'Which of the following statements accurately describe deactivating attachment strategies in adult clients? (Select all that apply)',
          options: [
            { text: 'They involve the suppression of attachment needs and the minimization of distress to avoid the pain of rejection from an unavailable caregiver.', isCorrect: true },
            { text: 'They are most strongly associated with anxious-preoccupied attachment organization.', isCorrect: false },
            { text: 'In therapy, they may manifest as emotional intellectualization, minimizing the importance of the therapeutic relationship, and premature termination when intimacy increases.', isCorrect: true },
            { text: 'They reflect a regulatory strategy whose logic is to amplify distress signals to compel caregiver engagement.', isCorrect: false },
            { text: 'They are associated with dismissing-avoidant attachment and involve maintaining self-sufficiency as a defensive posture.', isCorrect: true }
          ],
          explanation: 'Deactivating strategies are associated with dismissing-avoidant attachment (not anxious-preoccupied). They involve suppressing attachment needs, minimizing distress, and emphasizing self-reliance — all of which develop as a response to caregivers who have consistently rebuffed proximity-seeking. In therapy, deactivating strategies manifest as emotional distance, intellectualization, dismissal of the therapeutic relationship\'s importance, and a tendency to leave treatment when dependency or intimacy begins to emerge. Hyperactivating strategies — amplifying distress to compel caregiver engagement — are characteristic of anxious-preoccupied, not dismissing-avoidant, attachment.'
        },
        {
          type: 'reflection',
          question: 'Consider the concept of internal working models. Think of a client whose relational patterns in therapy seem to confirm a negative expectation of others — perhaps they consistently interpret your neutral interventions as criticism, or seem unable to trust your positive regard even when you express it directly. What specific working model beliefs might be operating? How might you use this framework to understand (rather than personalize) that pattern?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'Bowlby\'s attachment theory is rooted in evolutionary biology: proximity to a protective caregiver is a primary survival strategy, and the attachment behavioral system — activating under threat and seeking felt security — remains active across the lifespan.',
            'The four adult attachment styles (secure, anxious-preoccupied, dismissing-avoidant, fearful-avoidant) are organized along two dimensions — anxiety and avoidance — and reflect distinct regulatory strategies (hyperactivating vs. deactivating) developed in response to caregiver behavior.',
            'The Adult Attachment Interview measures narrative coherence rather than biographical content, distinguishing autonomous/secure, dismissing, preoccupied, and unresolved classifications based on how adults reflect on and narrate childhood experiences.',
            'Internal working models are procedural, largely implicit schemas that operate as perceptual filters in close relationships, shaping what individuals notice, expect, and elicit from others — making them self-confirming and resistant to change through experience alone.',
            'Earned security demonstrates that attachment organization can change: adults who have coherently integrated adverse early attachment histories achieve outcomes comparable to continuously secure individuals, providing empirical support for attachment-informed psychotherapy.'
          ]
        }
      ]
    },

    // ─── SECTION 2: ATTACHMENT IN THERAPY ────────────────────────────────────
    {
      title: 'Attachment in the Therapy Room: Clinical Presentations, Alliance, and Assessment',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Section 2: Attachment in the Therapy Room',
          subtitle: 'Clinical Presentations, Therapeutic Alliance Ruptures, and Attachment-Informed Assessment',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>The psychotherapy relationship is, at its structural core, an attachment relationship. It involves one person in distress seeking help from a more knowledgeable, more powerful, and (ideally) reliably present and emotionally responsive other. This structural resemblance to the infant-caregiver dyad is not metaphorical — it activates the same motivational systems, elicits the same working model expectations, and produces many of the same behavioral patterns that characterized the client's early attachment relationships. Understanding this fundamental reality is the cornerstone of attachment-informed clinical practice.</p>

<p>When a new client walks through the therapist's door, they bring with them their entire attachment history — not as explicit narrative memory but as procedural expectation. The anxious-preoccupied client will begin monitoring, within the first few minutes of an initial session, for signs that the therapist might be bored, dismissive, or planning to reject them. The dismissing-avoidant client will experience the therapist's empathic attunement as vaguely threatening and will work to establish intellectual distance, reframe emotional symptoms as cognitive problems, or assert that they are "pretty much fine" and just need "a few tools." The fearful-avoidant client will oscillate: initially idealizing the therapist as the help they have always needed, then abruptly withdrawing when the closeness of the relationship triggers their terror of intimacy.</p>

<p>These are not pathological reactions to the specific therapist — they are the activation of attachment strategies honed over a lifetime and applied, automatically and without deliberate intention, to the new attachment figure. The clinician's task is not to take these patterns personally, not to feel flattered by idealization or wounded by devaluation, but to hold them with curious equanimity and use them as rich diagnostic information. In this sense, the therapy relationship is not merely the vehicle for change — it is the primary data source. The way the client relates to the therapist is the clearest window available into how the client relates to attachment figures generally.</p>

<p>Research by Dozier and colleagues, and by the group around Diana Diamond and Kenneth Levy, has documented systematic relationships between client attachment organization and early therapy behavior. Anxious-preoccupied clients tend to disclose extensively from the outset — sometimes overwhelmingly so — expressing strong emotion and high levels of distress. They form intense alliances quickly but are also highly sensitive to perceived therapist disengagement, and they are at elevated risk for crisis escalation around session boundaries, between-session contacts, and therapist absences. Dismissing-avoidant clients tend to be more guarded and limited in early self-disclosure, presenting emotional concerns in intellectualized terms, and showing less early therapeutic alliance development. They are at elevated risk for premature dropout precisely when the therapeutic relationship deepens enough to activate attachment anxiety. Understanding these trajectory differences allows the clinician to calibrate expectations and interventions appropriately.</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Therapeutic Alliance Ruptures and Attachment Strategies',
          content: `<p>Therapeutic alliance ruptures — moments when the collaborative bond between client and therapist is strained or broken — are universal in psychotherapy and among the most potent predictors of both treatment failure and, when repaired, treatment success. Attachment theory provides a framework for understanding why ruptures occur, what they mean, and how to repair them.</p>

<p><strong>For anxious-preoccupied clients</strong>, ruptures often take the form of <em>confrontation</em>: open expression of anger or disappointment toward the therapist, complaints about the pace or direction of treatment, or intensified demands for reassurance or contact. These ruptures reflect the hyperactivating strategy — escalating the signal when the attachment figure seems less engaged. The therapist who becomes defensive, distances, or responds with a boundary lecture rather than genuine acknowledgment risks confirming the client's working model that expressing need leads to rejection.</p>

<p><strong>For dismissing-avoidant clients</strong>, ruptures often take the form of <em>withdrawal</em>: sudden emotional flatness, missed appointments, intellectual deflection from emotionally charged topics, or abrupt announcements of termination. These ruptures reflect the deactivating strategy — suppressing the attachment system when closeness threatens. The therapist who pursues too aggressively or interprets withdrawal as resistance risks triggering defensive intensification; the therapist who fails to notice and gently name the withdrawal misses a critical clinical opportunity.</p>

<p>Rupture-repair sequences, when navigated well, are themselves corrective attachment experiences: the client learns, repeatedly and in real time, that distress and conflict in a relationship do not lead to abandonment, retaliation, or permanent disconnection — that the relationship can be disrupted and restored. This is the lived experience, not the cognitive belief, of relational safety.</p>`
        },
        {
          type: 'text',
          content: `<p>Integrating attachment assessment into clinical intake is a practice that can significantly enhance case conceptualization, treatment planning, and early clinical decision-making. While formal AAI administration requires specialized training and is not typically feasible in routine clinical practice, attachment-informed clinicians can gather rich assessment data through careful attention to the structure and content of intake interviews. The Adult Attachment Projective Picture System (AAP) offers an alternative to the AAI that requires somewhat less extensive training, and several self-report measures — the ECR-R, the Relationship Questionnaire, the Adult Attachment Scale — can be incorporated into standard intake batteries.</p>

<p>Beyond formal measures, there are several clinically accessible attachment markers that emerge in initial sessions. First, observe the client's <strong>narrative style</strong> when discussing close relationships. Do they speak in coherent, specific, balanced terms, with appropriate affect? (Suggests security.) Do they become entangled in long, emotionally flooded descriptions that lose their way? (Suggests preoccupied organization.) Do they give brief, idealized summaries with no specific memories to support them, or insist the past has no relevance? (Suggests dismissing organization.) Do they show sudden shifts in the quality of discourse — losing fluency, going silent, speaking in disoriented fragments — specifically when discussing losses or abusive experiences? (Suggests unresolved status.)</p>

<p>Second, observe how the client <strong>manages the initial relational contact</strong> with you. Does the new client settle comfortably into the interaction? (Secure tendency.) Do they present a crisis or high-intensity affect from the very first moments, perhaps including an implicit or explicit plea that you not abandon them as others have? (Preoccupied tendency.) Do they maintain a careful, somewhat studied emotional tone, expressing reluctance about therapy or about the emotional sharing it requires? (Dismissing tendency.) Do they oscillate — warm and eager one moment, suddenly guarded or apologetic the next? (Fearful-avoidant tendency.)</p>

<p>Third, assess the client's <strong>attachment history explicitly</strong> through a systematic developmental history. Key questions include: Who did you go to when you were upset as a child? What happened when you were hurt, sick, or frightened? How did your caregivers respond when you expressed negative emotions? Were there experiences of significant loss, separation, or abuse? How do you understand those experiences now? The <em>content</em> of the answers is informative, but the <em>coherence</em>, <em>affect regulation</em>, and <em>narrative organization</em> with which they are delivered is equally or more diagnostically significant.</p>

<p>The integration of attachment assessment information into the case formulation allows the clinician to anticipate likely patterns in the therapeutic relationship, identify the regulatory strategies the client will rely upon under stress, understand the working model beliefs likely to be activated in session, and plan interventions that are calibrated to the client's attachment organization. A formulation-driven approach to attachment — rather than a symptom-driven approach alone — positions the clinician to understand why standard techniques may not work with a particular client and what adaptations are necessary. For example, the standard cognitive-behavioral recommendation to monitor and challenge automatic thoughts may be easily adopted by a secure client, partially accessible to an anxious-preoccupied client (who can name affect but struggles to gain distance from it), and actively resisted by a dismissing client (who finds the suggestion that thoughts need monitoring a threat to their self-image as competent and clear-headed).</p>`
        },
        {
          type: 'accordion',
          title: 'Attachment Markers in Clinical Intake: A Practitioner\'s Guide',
          accordionItems: [
            {
              title: 'Assessing Narrative Coherence in Intake Interviews',
              content: `<p>Coherence in attachment narrative — the ability to give a clear, consistent, and emotionally appropriate account of close relationships — is the single most clinically meaningful indicator available in an intake interview. A coherent narrative is specific (the client offers actual memories, not just characterizations), consistent (the evidence matches the evaluative labels), relevant (the client stays on topic rather than drifting into unrelated content), and appropriately emotional (affect is present and regulated, not absent or flooding).</p>
              <p>Pay particular attention to evaluative-evidence mismatches: when a client describes their childhood as "wonderful" or "perfectly normal" but cannot provide a single specific supporting memory, or when they describe a parent as "always there for me" and then recounts incidents of chronic emotional neglect, the mismatch is itself diagnostic information pointing toward dismissing organization. Conversely, when a client begins a story about childhood and becomes progressively more animated, angry, or confused — losing the thread, contradicting themselves, or shifting into present-tense complaints about caregivers — this suggests preoccupied organization.</p>`
            },
            {
              title: 'Self-Report Attachment Measures: Clinical Use of the ECR-R',
              content: `<p>The Experiences in Close Relationships-Revised (ECR-R), developed by Fraley, Waller, and Brennan (2000), is a 36-item self-report measure assessing attachment anxiety and avoidance in close relationships. It is freely available for clinical and research use and can be administered in approximately 10 minutes. Subscale scores can be plotted on a two-dimensional grid to identify a client's position relative to the four attachment prototypes.</p>
              <p>Clinically, the ECR-R is most useful not as a categorical diagnosis but as a starting point for collaborative exploration. Sharing results with clients and discussing what resonates and what does not can itself be a productive clinical exercise that models the reflective stance you want to cultivate. However, clinicians should be aware of the instrument's limitations: self-report measures capture explicit, semantic self-knowledge about attachment tendencies, which may differ from the implicit, procedural working models captured by the AAI. Dismissing clients, in particular, may underreport insecurity because their defensive strategy involves maintaining a positive self-view and denying vulnerability.</p>`
            },
            {
              title: 'Developmental History Questions with Attachment Focus',
              content: `<p>Systematically incorporating attachment-focused questions into the developmental history section of intake interviews yields rich formulation data. The following questions, adapted from the AAI protocol, can be integrated into routine intake practice: "Who in your family were you closest to as a child, and what was that relationship like? When you were distressed as a child — sick, hurt, or frightened — what typically happened? Did you go to someone, and if so, who? What did they do? Can you think of a specific time that captures what that was like?" These questions not only reveal caregiving history but also activate the attachment system, making the client's regulatory strategies directly observable in the room.</p>
              <p>Document not just the content of responses but the affect with which they are delivered, the degree of specificity, and any signs of dysregulation or narrative collapse when particularly sensitive material arises. These observations become part of the formulation and inform early treatment decisions.</p>`
            },
            {
              title: 'Identifying Attachment Style in Presenting Problems',
              content: `<p>Common presenting problems often carry attachment signatures. Chronic relationship difficulties — cycling through intense relationships that end abruptly, inability to sustain intimacy, recurrent abandonment experiences — frequently reflect anxious-preoccupied or fearful-avoidant organization. Depression with prominent themes of loneliness, worthlessness, and rejection sensitivity often maps onto preoccupied attachment. Depression with prominent themes of loss of meaning, emptiness, and isolation that the client cannot quite name or explain often maps onto dismissing organization. Anxiety disorders in individuals who present as otherwise socially confident but report persistent relationship avoidance frequently reflect dismissing avoidance. PTSD presentations with prominent relational avoidance, emotional numbing, and dismissal of the need for support reflect the intersection of unresolved trauma and dismissing regulatory strategy.</p>`
            },
            {
              title: 'Countertransference as Attachment Information',
              content: `<p>The clinician's own affective and relational responses to clients provide important attachment information. Clinicians often report feeling pulled toward anxious-preoccupied clients — wanting to offer more reassurance, extend sessions, or respond to between-session contacts — reflecting the client's hyperactivating pull on the clinician's caregiving system. With dismissing clients, clinicians often notice a subtle flatness or tedium in sessions, a sense that something important is always being kept at arm's length, or a pull to work harder to generate emotional engagement. With fearful-avoidant clients, the countertransference is often more intense and oscillatory — rapid shifts between feeling deeply connected and suddenly pushed away, or worry about the client's safety alternating with frustration at the client's self-destructiveness.</p>
              <p>The use of countertransference as attachment information requires that the clinician have sufficient self-awareness and reflective capacity to recognize these pulls without acting on them automatically. Regular supervision and the clinician's own personal therapy are therefore components of ethical, attachment-informed practice — not optional add-ons but professional requirements.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Attachment-Alliance Interface: How Attachment Style Shapes Early Treatment',
          content: `<p>The therapeutic alliance — the collaborative bond between therapist and client, agreement on treatment goals, and shared sense of the therapeutic task — is the strongest predictor of psychotherapy outcome across all modalities. Attachment theory explains both why the alliance is so powerful and why it varies so dramatically across clients.</p>
          <p>Research by Mallinckrodt and colleagues demonstrates that clients' attachment styles systematically shape their alliance formation trajectories. Secure clients form alliances most readily and maintain them most stably. Anxious-preoccupied clients form intense early alliances but show greater volatility. Dismissing clients show slower and more limited alliance development, often requiring more time and specific relationship-building strategies before genuine collaborative work can occur. Fearful-avoidant clients show the most unpredictable alliance trajectories, often with dramatic early peaks followed by sudden ruptures.</p>
          <p>The clinical implication is that early treatment for insecure clients should prioritize alliance-building over technique delivery — that the relationship is itself the first and most important intervention.</p>`,
          image: '',
          imageAlt: 'Diagram showing four alliance development trajectories across time in treatment, with secure showing a stable moderate-to-high trajectory, anxious-preoccupied showing a high but volatile trajectory with more variation, dismissing-avoidant showing a lower and slower-rising trajectory, and fearful-avoidant showing a jagged trajectory with dramatic peaks and drops.',
          imagePosition: 'left'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following behaviors in a clinical intake session are consistent with a dismissing-avoidant attachment organization? (Select all that apply)',
          options: [
            { text: 'Providing idealized characterizations of caregivers ("My parents were great, very supportive") without specific corroborating memories.', isCorrect: true },
            { text: 'Becoming progressively more emotionally activated and entangled when discussing past relationship difficulties.', isCorrect: false },
            { text: 'Insisting that the past is irrelevant and that only practical, skill-based interventions are needed.', isCorrect: true },
            { text: 'Presenting with an immediate crisis and an implicit or explicit plea that the therapist not abandon them as others have.', isCorrect: false },
            { text: 'Expressing reluctance about emotional disclosure while simultaneously minimizing the significance of presenting concerns.', isCorrect: true }
          ],
          explanation: 'Dismissing-avoidant attachment organization is characterized by deactivating strategies: suppressing emotional needs, emphasizing self-reliance, and maintaining distance from attachment-relevant affect and experience. In intake, this manifests as idealization of caregivers without specific supporting memories, insistence that the past is irrelevant, preference for skill-based approaches that avoid relational engagement, and minimization of current concerns. Becoming emotionally activated and entangled (option B) reflects preoccupied organization, and presenting with crisis and abandonment fears (option D) reflects anxious-preoccupied or fearful-avoidant organization.'
        },
        {
          type: 'text',
          content: `<p>The matching between therapist attachment organization and client attachment needs is an emerging area of clinical research with important practical implications. Dozier and colleagues found in a landmark study that clients with dismissing attachment organization showed better outcomes when matched with therapists who were rated as secure on the AAI, particularly therapists who were willing to challenge the client's deactivating strategies by drawing attention to emotional experience even when the client resisted. Conversely, for clients with anxious-preoccupied organization, the most therapeutic therapist stance was one of relative containment and structure rather than mirroring the client's emotional intensity.</p>

<p>These findings suggest a principle sometimes called "complementarity-then-challenge": in early treatment, the clinician attunes to the client's regulatory strategy without triggering defensive intensification, but over time, the work involves gently expanding the client's emotional range beyond the strategy's limits. For dismissing clients, this means slowly, patiently, and without pressure bringing attention to the emotional subtext of ostensibly intellectual content. For preoccupied clients, it means providing structure, helping the client gain distance from flooding affect, and cultivating a capacity for mentalizing that can hold experience reflectively rather than being swept up in it.</p>

<p>The therapist's own attachment organization plays a significant role here. Research by Slade, Stovall-McClough, and colleagues has shown that therapist dismissing tendencies can inadvertently collude with dismissing clients' deactivating strategies by accepting the emotional avoidance at face value and failing to gently press toward affect. Therapist anxious-preoccupied tendencies can similarly collude with preoccupied clients by joining the emotional intensity rather than helping the client regulate it. For this reason, attachment-informed clinical training increasingly emphasizes the importance of clinician self-knowledge and personal therapy as professional practice requirements, not electives.</p>`
        },
        {
          type: 'scenarioTree',
          scenarioTitle: 'Navigating a Rupture with a Dismissing-Avoidant Client',
          startNode: 'start',
          nodes: {
            start: {
              text: 'Marcus, a 38-year-old software engineer referred by his primary care physician for "stress management," has been in therapy with you for six sessions. He presents with organized, intellectualized descriptions of work stress and marital difficulties, consistently reframing emotional questions in cognitive terms. In today\'s session — the session after you returned from a two-week vacation — he arrives 10 minutes late (for the first time), sits further from you than usual, and announces that he has been thinking and believes he has gotten what he came for. "I\'ve got some good tools now. I\'m not sure continuing makes sense." What is your first response?',
              choices: [
                { text: 'Accept his decision and provide a warm, supportive termination: "I\'m glad the work has been helpful. You know you can always return if you need to."', nextId: 'premature_term' },
                { text: 'Gently name what you notice without challenging his stated conclusion: "I notice this is the first session after I was away. I\'m curious whether the break had any impact for you."', nextId: 'attach_inquiry' },
                { text: 'Immediately interpret the pattern: "I wonder if announcing you\'re done is connected to feelings about my absence — perhaps a way of leaving before I leave again."', nextId: 'too_fast' }
              ]
            },
            premature_term: {
              text: 'Marcus agrees and thanks you for your work. He leaves. Two months later, his primary care physician contacts you because Marcus is now presenting with depression and somatic complaints. The premature termination, accepted without exploration, meant the work of disruption and repair — a core mechanism of change for dismissing clients — was bypassed. The deactivating strategy was reinforced.',
              isEnd: true
            },
            attach_inquiry: {
              text: 'Marcus pauses. "The break? No, that didn\'t really affect me. I\'m just — I think I\'m good." You notice a slight tightening around his eyes. You say: "I\'m glad you\'re feeling better. I also notice that you\'ve been working hard and that you arrived a bit later today, and you seem a little further away from me than usual. I don\'t want to put words in your mouth, but I\'m wondering if there\'s anything about today that feels different." What do you do next?',
              choices: [
                { text: 'Wait in silence, giving him space to reflect.', nextId: 'wait_silence' },
                { text: 'Offer a psychoeducational frame: "Sometimes when a therapist is away, it can stir up feelings about whether the relationship is reliable. That\'s worth exploring."', nextId: 'psychoed' }
              ]
            },
            too_fast: {
              text: 'Marcus looks uncomfortable and shifts in his seat. "I don\'t really think that\'s what\'s going on. I said I\'ve got what I came for." He now seems more certain about leaving. Moving to interpretation before sufficient relational safety was established has intensified his deactivating response. The intervention was clinically accurate but premature — timed in a way that made the work feel like a threat rather than a collaborative exploration.',
              isEnd: true
            },
            wait_silence: {
              text: 'After a pause, Marcus says, quietly, "I guess I did notice you were gone. I don\'t know why that would matter though." This is a significant opening — he is beginning to notice and name an attachment-relevant experience, which his deactivating strategy typically prevents. You respond: "That it mattered is worth paying attention to. Can we stay with that for a minute?" Marcus nods. The session continues productively, and the termination impulse recedes. The rupture becomes a repair experience.',
              isEnd: true
            },
            psychoed: {
              text: 'Marcus says: "I suppose I can see that. I mean, logically." He remains somewhat distant but has not left. Over the next several minutes, with careful pacing, you help him connect intellectually to the concept of the break mattering without requiring emotional expression he is not yet ready for. He agrees to continue for now. A modest but real therapeutic gain — the deactivating strategy was gently tested without triggering a flight response.',
              isEnd: true
            }
          }
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each attachment-related clinical presentation or behavior with the attachment style most likely to be associated with it.',
          matchingPairs: [
            { term: 'Client arrives for session in crisis, expresses fear that you will terminate treatment, floods with affect and has difficulty being regulated by standard empathic responses.', definition: 'Anxious-Preoccupied Attachment' },
            { term: 'Client gives a coherent, somewhat detached account of a recent relationship conflict, notes "it wasn\'t a big deal," and cannot recall any emotional response to the event.', definition: 'Dismissing-Avoidant Attachment' },
            { term: 'Client in the sixth session suddenly announces plans to end treatment, citing that they have "gotten what they needed," immediately following a session in which emotional closeness deepened.', definition: 'Dismissing-Avoidant Attachment' },
            { term: 'Client oscillates between expressing deep gratitude and idealization of the therapist in one session and expressing disappointment and devaluation in the next, with minimal apparent trigger.', definition: 'Fearful-Avoidant Attachment' },
            { term: 'Client describes difficult childhood experiences coherently, with appropriate sadness, without idealizing or denigrating caregivers, and uses the therapeutic relationship flexibly.', definition: 'Secure Attachment' },
            { term: 'Client becomes suddenly disorganized, silent, and mildly disoriented when discussing the death of a parent, before regaining composure and continuing with a markedly different quality of discourse.', definition: 'Unresolved/Disorganized Attachment' }
          ]
        },
        {
          type: 'reflection',
          question: 'Reflect on a client whose patterns in the therapeutic relationship have been most challenging for you personally — not clinically challenging, but personally activating. Consider: What attachment style might best describe this client\'s presentation? Now consider your own reactions — were you pulled toward over-accommodation, frustration, excessive reassurance-giving, or emotional distance? What does your countertransference tell you about both the client\'s attachment system and your own attachment-related tendencies as a clinician?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'The psychotherapy relationship structurally activates the attachment behavioral system: clients bring their entire working model history into the room and apply it, automatically and implicitly, to the therapist as a new attachment figure.',
            'Anxious-preoccupied clients use hyperactivating strategies (escalating emotional intensity, seeking reassurance) in sessions; dismissing-avoidant clients use deactivating strategies (minimizing, intellectualizing, withdrawing); and fearful-avoidant clients oscillate between both, reflecting their approach-avoidance conflict around intimacy.',
            'Alliance ruptures in insecure clients follow attachment-specific patterns: confrontation ruptures in preoccupied clients and withdrawal ruptures in dismissing clients. Effective rupture repair is itself a corrective attachment experience.',
            'Attachment-informed intake assessment uses not only formal measures (ECR-R, AAP) but also observation of narrative coherence, emotional regulation during history-taking, and the quality of initial relational engagement with the therapist.',
            'Clinician countertransference reactions — pulls toward over-reassurance, frustration, boredom, or worry — carry important attachment information about the client\'s regulatory strategy and the intersubjective field being created in the room.'
          ]
        }
      ]
    },

    // ─── SECTION 3: INTERVENTIONS ─────────────────────────────────────────────
    {
      title: 'Attachment-Informed Interventions: From Assessment to Clinical Action',
      sectionNumber: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Section 3: Attachment-Informed Interventions',
          subtitle: 'Corrective Attachment Experiences, Mentalization, Emotion Regulation, and Working with Disorganized Attachment',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>The translation of attachment theory from an explanatory framework into a set of clinical interventions has been one of the most productive developments in psychotherapy over the past three decades. Multiple evidence-based treatments have emerged from attachment theory as their theoretical foundation, including Emotionally Focused Therapy (EFT) for couples and individuals, developed by Susan Johnson; Mentalization-Based Treatment (MBT), developed by Peter Fonagy and Anthony Bateman; Attachment-Based Psychotherapy as articulated by David Wallin; and Circle of Security, a parent-child intervention with growing evidence base. Across these diverse approaches, a set of common mechanisms of change can be identified that constitute the clinical core of attachment-informed practice.</p>

<p>The most fundamental of these mechanisms is the use of the therapeutic relationship itself as a <strong>corrective attachment experience</strong>. This concept, while often attributed to Alexander and French (1946), receives its fullest clinical elaboration within attachment theory. A corrective attachment experience is not simply a positive relational experience, nor is it the therapist acting as a "better parent." It is a specific kind of relational sequence: the client activates their attachment system (through distress, vulnerability, or need), deploys their habitual regulatory strategy (hyperactivating, deactivating, or disorganizing), the therapist responds in a way that is fundamentally different from what the working model predicts, and this mismatch — when it is named, processed, and repeated enough times — gradually updates the internal working model.</p>

<p>For the anxious-preoccupied client, the corrective experience typically involves the therapist providing consistent, non-anxious presence — meeting the client's distress without amplifying it, and without withdrawing in the face of the emotional intensity that hyperactivating strategies produce. The therapist who can stay calm, empathically present, and unbothered by the client's intensity while gently helping the client develop capacity for self-regulation offers a relational experience that directly contradicts the working model: "I escalate, and the caregiver does not pull away — and I learn that escalation is not the only way to remain connected."</p>

<p>For the dismissing-avoidant client, the corrective experience involves the therapist patiently, persistently, and without shaming bringing attention to emotional experience — gently naming affect that the client cannot or will not name, noticing the emotional subtext of intellectualized accounts, and making the implicit relational content explicit. The therapist who persists in caring about the client's inner life, even when the client signals that such caring is unnecessary or intrusive, offers an experience that challenges the deactivating logic: "I push others away when I need them, but this person keeps caring about me anyway — perhaps needing others is not as dangerous as I have believed."</p>

<p>The concept of corrective attachment experience must be distinguished from what Wallin (2007) calls the "corrective emotional experience" trap — the therapist consciously trying to be the "good parent" the client never had, offering extra warmth, extended sessions, or relaxed boundaries to compensate for early deprivation. This approach, however well-intentioned, actually confirms the client's working model by suggesting that the normal therapeutic relationship is somehow insufficient, and it risks the multiple boundary violations that occur when therapists override professional limits out of an identification with the client's childhood pain. The corrective attachment experience is not a substitute for good parenting — it is a specifically relational therapeutic event within the professional frame.</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Working with Disorganized Attachment: Stabilization Before Processing',
          content: `<p>Clients with disorganized attachment organization present the most complex and potentially destabilizing clinical material in attachment-informed practice. Their fundamental developmental dilemma — that the caregiver was simultaneously the source of fear and the only available haven of safety, creating what Main and Hesse called "fright without solution" — leaves them without a coherent regulatory strategy. As adults, they often present with severe affect dysregulation, dissociative symptoms, trauma histories, and intense but unstable therapeutic alliances.</p>

<p>The most critical clinical principle with disorganized clients is <strong>stabilization before trauma processing</strong>. Prematurely moving to trauma reprocessing (whether through EMDR, prolonged exposure, or exploratory attachment work) before the client has sufficient affect regulation capacity and relational safety is contraindicated: it risks retraumatization, dissociative destabilization, and therapeutic rupture that can be irreparable. The clinical sequence should follow three phases: (1) <strong>Safety and stabilization</strong> — establishing predictable therapeutic structure, building affect regulation skills, developing the therapeutic alliance as a genuine safe haven; (2) <strong>Trauma processing</strong> — with explicit permission and pacing attention, beginning to approach traumatic attachment memories; (3) <strong>Integration and reconnection</strong> — consolidating new working model representations and expanding relational competence.</p>

<p>Additionally, clinicians working with disorganized clients must actively monitor for <strong>dissociative activation in session</strong>: the client who suddenly seems "not present," whose eyes go flat, who speaks in a disconnected or fragmented way, or who seems unaware of their surroundings. When dissociation occurs, the priority is grounding — returning the client to present-moment awareness through sensory anchoring, naming what is happening ("I notice you seem to have gone somewhere else — can you feel your feet on the floor?"), and regulating the therapist's own nervous system, which functions as a co-regulation resource for the client's dysregulated one.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Mentalization</strong> — the capacity to understand behavior in terms of underlying mental states (desires, beliefs, feelings, intentions) — is one of the most important attachment-derived concepts for clinical practice. Peter Fonagy and colleagues proposed that mentalizing capacity develops within the attachment relationship: when a caregiver consistently reflects back the infant's mental states in a way that is marked (not identical) and contingent (connected to what the infant expressed), the infant develops a sense that their inner life is real, nameable, and manageable. This "marked mirroring" gives rise to what Fonagy calls the <strong>epistemic trust</strong> — the fundamental sense that one's subjective experience can be recognized, validated, and communicated — that underlies psychological resilience and openness to learning from social experience.</p>

<p>Insecure and particularly disorganized attachment is associated with impaired mentalizing capacity. Anxious-preoccupied individuals tend toward <strong>hypermentalizing</strong> — excessive, often inaccurate attribution of mental states to others, particularly attribution of hostile or rejecting intent, fueled by hypervigilance and confirmation bias. Dismissing individuals tend toward <strong>hypo-mentalizing</strong> — minimal attention to mental states in self or others, over-reliance on behavioral and external explanations ("he was just in a bad mood" rather than "he felt hurt when I didn't acknowledge what he said"). Disorganized individuals may alternate between hypermentalizing and mentalizing collapse — particularly under relational stress, when the attachment system is activated and the capacity for reflective thought is overwhelmed.</p>

<p>Mentalization-Based Treatment (MBT), developed by Fonagy and Bateman for borderline personality disorder, explicitly targets mentalizing capacity through specific therapeutic techniques. Core MBT techniques include: <strong>stop and stand</strong> (the therapist slows the session down when affect escalates, saying "Let's stop for a moment — I want to make sure I understand what just happened"); <strong>empathic validation of the client's perspective</strong> without confirming distorted mentalizing; <strong>mentalizing the moment</strong> in the therapeutic relationship ("I notice you seem tense right now. I wonder what you're imagining I'm thinking?"); and the <strong>not-knowing stance</strong> (the therapist models genuine curiosity about mental states rather than confident pronouncements about what the client feels or means).</p>

<p>Emotion regulation is a closely related target in attachment-informed intervention, particularly for clients whose attachment insecurity manifests as affect dysregulation. Drawing on neuroscience research by Allan Schore and Daniel Siegel, attachment theory has been enriched by an understanding of how early relational experience literally shapes the development of affect regulatory neural systems — particularly the orbitofrontal cortex and the right hemisphere circuitry responsible for emotional processing and interpersonal attunement. Schore's regulatory theory proposes that early attuned caregiving provides the interactive context in which the infant's right-brain affective systems develop the capacity to self-regulate, and that early relational trauma or deprivation disrupts this developmental process at the level of neurobiological organization.</p>

<p>For clinical practice, this means that emotion regulation work with insecure clients is not merely psychoeducational ("here are five emotion regulation skills") but fundamentally relational — it occurs through the co-regulation of affective states in the therapeutic relationship, as the therapist's regulated nervous system functions as an external organizer for the client's dysregulated one. This is particularly visible in moments of dissociative activation or overwhelming affect, where what regulates the client is not the specific technique but the therapist's calm, grounded, physically present stance. The formal skills — mindfulness, distress tolerance, the window of tolerance concept from Ogden's sensorimotor psychotherapy — are tools that support this fundamentally relational regulatory process.</p>`
        },
        {
          type: 'accordion',
          title: 'Core Attachment-Informed Intervention Techniques',
          accordionItems: [
            {
              title: 'Working in the Here-and-Now of the Therapeutic Relationship',
              content: `<p>Attachment-informed practice prioritizes explicit attention to what is happening in the therapeutic relationship in the present moment — not as an analytic exercise in transference interpretation but as a direct opportunity to observe and work with the client's attachment system in real time. When the client's attachment strategy activates in session — when the preoccupied client escalates, when the dismissing client distances, when the fearful-avoidant client suddenly withdraws after a moment of connection — this is the moment of greatest therapeutic opportunity.</p>
              <p>The technique of "speaking to the relational process" involves the therapist naming what they observe happening between them: "I notice that right after you shared something quite personal, you immediately made a joke and moved away from it. I want to ask you about that." This metacommunicative stance — talking about the interaction rather than within it — invites the client to step back and reflectively observe their own attachment behavior, which is a key building block of earned security.</p>`
            },
            {
              title: 'Promoting Epistemic Trust Through Consistent Responsiveness',
              content: `<p>Fonagy's concept of epistemic trust — the capacity to receive, integrate, and learn from information from trusted social sources — provides a framework for understanding why some clients seem unable to benefit from apparently good interventions. When early caregiving has been systematically misattuned, neglectful, or confusing, the developing child learns to be epistemically hypervigilant: to discount or distrust communications from potential caregivers, because experience has taught that such communications cannot be relied upon. In adult therapy, epistemic mistrust manifests as the client who intellectually understands an interpretation but cannot assimilate it into their lived experience, or the client who seems unable to remember or use insights from session to session.</p>
              <p>Building epistemic trust is not accomplished through argument or repetition but through the consistent experience of being felt to be known — of having one's internal states recognized, named, and responded to in a way that feels accurate and non-threatening. This is why the quality of attunement in early therapy is more important than the content of the interventions. When the client experiences the therapist as genuinely curious about and attuned to their subjective experience, rather than fitting them into a predetermined framework, something shifts in the implicit relational knowing — the epistemic channel opens.</p>`
            },
            {
              title: 'The Window of Tolerance and Titrated Exposure',
              content: `<p>Dan Siegel's "window of tolerance" concept — the zone of arousal within which the brain can process experience most effectively, flanked by hyperarousal (overwhelming activation) and hypoarousal (dissociative shutdown) — is a practically essential framework for pacing attachment-informed work. Clients with insecure and particularly disorganized attachment frequently operate outside the window: chronically hyperaroused (preoccupied) or chronically hypoaroused (dismissing), or oscillating between the two (fearful-avoidant and disorganized).</p>
              <p>Titrated exposure in attachment terms means approaching attachment-relevant affect and memories at a pace that keeps the client within the window of tolerance. This requires the therapist to continuously monitor physiological arousal indicators — voice quality, breathing, eye contact, body posture — and to modulate the intensity of the work in response. Techniques include slowing the pace of the session when arousal climbs, using grounding interventions when hypoarousal or dissociation appears, and explicitly inviting the client to signal when they need a break or a shift in focus. The message — that the client has agency over their own regulatory state in the room — is itself a corrective experience for clients who were never allowed autonomy over their own emotional experience.</p>`
            },
            {
              title: 'Grief Work and the Integration of Early Attachment Loss',
              content: `<p>Earned security, as discussed in Section 1, is achieved through a process of integration that necessarily involves grief — mourning the caregiving that was needed and not received, the childhood that was not available, the developmental opportunities that were missed. Bowlby's third volume, <em>Loss</em>, outlines a model of grief that applies not only to bereavement but to the more diffuse and complex losses of insecure attachment: the loss of the idealized parent one never had, the loss of a childhood in which one was safe to be vulnerable and dependent, the loss of a self who never had to develop defensive strategies to survive.</p>
              <p>This grief work must be conducted carefully, particularly with clients who have defensive structures around idealization or derogation of caregivers. The goal is not to help the client conclude that their caregivers were bad people, nor to explain away legitimate pain through compassion for caregivers' own limitations. The goal is to help the client develop the full, complex truth of their early experience — holding both the love and the pain, both the caregiver's genuine positive qualities and the genuine insufficiency of what was provided — without needing to collapse into an idealized or derogating caricature. This balanced, complex narrative is, structurally, the autonomous/secure position — and the grief work is the path to it.</p>`
            },
            {
              title: 'Attachment-Informed Psychoeducation',
              content: `<p>Explicit psychoeducation about attachment theory can be a powerful therapeutic tool when used judiciously. For many clients, encountering the attachment framework for the first time produces a profound recognition experience — a sense that their relational patterns, which they have experienced as shameful character flaws, finally have an explanation that is neither blaming nor pathologizing. The preoccupied client who learns that their hypervigilance is a regulatory strategy that made sense given their relational history — not a personality defect — often experiences significant relief. The dismissing client who learns that their emotional self-sufficiency is a defensive adaptation, not evidence of superior functioning, may be more willing to question it.</p>
              <p>Psychoeducation should be offered tentatively, in collaboration with the client's own observations, rather than as the clinician's authoritative pronouncement. The format "I wonder if the framework of attachment styles resonates with you — here's what I notice in our work together, and here's how it might connect..." maintains the collaborative, mentalizing stance and invites the client into the conceptual exploration rather than positioning them as a subject to be classified.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Therapeutic Relationship as Corrective Attachment Experience: A Sequence Model',
          content: `<p>The corrective attachment experience unfolds as a specific relational sequence rather than a single event. First, the client's attachment system activates — through distress, vulnerability, or the ordinary intimacy of therapeutic work. Second, the client deploys their habitual regulatory strategy: hyperactivating (escalating, demanding), deactivating (withdrawing, intellectualizing), or disorganizing (fragmenting, dissociating). Third — and this is the pivot point — the therapist responds in a way that is fundamentally different from what the working model predicts: with non-anxious presence rather than abandonment (for preoccupied clients), with persistent attunement rather than rejection (for dismissing clients), or with grounded calm rather than either freezing or retaliating (for disorganized clients). Fourth, this mismatch between expectation and experience is named and processed explicitly: "I notice that when you pushed me away just now, I stayed. What was that like?" Fifth, this sequence is repeated enough times that the working model begins to update.</p>
          <p>This model underscores that the corrective experience is not in the therapist's response alone, but in the entire sequence including the client's perception of the mismatch and their reflective processing of it. Without the explicit metacommunication and processing steps, the new relational experience may not be encoded in a way that updates the working model.</p>`,
          image: '',
          imageAlt: 'Flowchart showing the five-step sequence of corrective attachment experience: (1) Attachment system activation, (2) Client deploys habitual strategy, (3) Therapist responds in unexpected way, (4) Mismatch is named and processed, (5) Working model begins to update through repetition.',
          imagePosition: 'right'
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each attachment-informed intervention technique with its primary clinical mechanism or target population.',
          matchingPairs: [
            { term: 'Stop and Stand technique (MBT)', definition: 'Slows the therapeutic pace when affect escalates to preserve mentalizing capacity; used when the client\'s reflective function is overwhelmed by emotional arousal.' },
            { term: 'Titrated exposure within the window of tolerance', definition: 'Approaches attachment-relevant affect at a pace calibrated to keep the client\'s nervous system regulated; particularly critical for disorganized attachment.' },
            { term: 'Metacommunication about the relational process', definition: 'Naming what is happening in the therapeutic relationship in the present moment, inviting reflective observation of the client\'s own attachment behavior.' },
            { term: 'Grief work and caregiver narrative integration', definition: 'Helping the client develop a balanced, complex account of early attachment relationships without idealizing or denigrating caregivers; the primary mechanism of earned security.' },
            { term: 'Not-knowing stance (MBT)', definition: 'Therapist models genuine curiosity about mental states rather than confident pronouncements; builds mentalizing capacity and epistemic trust in clients with preoccupied or disorganized attachment.' },
            { term: 'Stabilization before trauma processing', definition: 'With disorganized attachment clients, establishing affect regulation capacity and relational safety before approaching traumatic attachment memories to prevent retraumatization.' }
          ]
        },
        {
          type: 'text',
          content: `<p>Emotion-Focused Therapy (EFT), developed by Leslie Greenberg and Susan Johnson, represents another major evidence-based approach grounded in attachment theory. Johnson's adaptation of EFT for couples — Emotionally Focused Couple Therapy (EFCT) — is among the most empirically supported couple therapies available, with effect sizes consistently in the range of 0.86 to 1.42 and follow-up studies showing that gains are maintained and often extended after treatment ends. EFCT conceptualizes couple conflict through an attachment lens: the angry, pursuing partner (often hyperactivating) and the withdrawing, stonewalling partner (often deactivating) are understood as both engaged in attachment strategies that made sense developmentally but have become mutual reinforcers of insecurity in the current relationship.</p>

<p>The EFCT change process involves three stages. In Stage 1 (de-escalation), the therapist helps each partner identify their primary emotions underneath the presenting negative patterns — the fear and grief beneath the anger of the pursuer, the shame and inadequacy beneath the withdrawal of the avoider — and begins to reframe the cycle as their shared enemy rather than evidence of either partner's defectiveness. In Stage 2 (restructuring attachment interactions), the therapist guides the couple through enactments in which each partner accesses and expresses primary attachment needs and fears directly, in session, and the other partner responds in a way that constitutes a corrective attachment experience. In Stage 3 (consolidation), new interaction patterns are consolidated and the couple's narrative about themselves and their relationship is reauthored in secure attachment terms.</p>

<p>Even for clinicians who do not specialize in couples work, the EFCT framework illuminates the attachment dynamics in many individual clients' relationship difficulties. The client who describes their partner as "cold and unavailable" without recognizing how their own escalating demands contribute to the partner's withdrawal, or the client who describes their partner as "smothering and needy" without recognizing how their own emotional distance intensifies the partner's attachment anxiety — these are attachment system dynamics that become visible through the EFT lens and targetable through individual attachment-informed work.</p>

<p>Working with trauma and attachment requires integration of trauma-focused and attachment-informed frameworks. The intersection of complex trauma and insecure attachment is the clinical norm rather than the exception: abuse and neglect in childhood are simultaneously traumatic experiences and attachment disruptions, and their sequelae cannot be cleanly separated into "trauma symptoms" and "attachment problems." Contemporary trauma frameworks, including Herman's complex trauma model, van der Kolk's developmental trauma framework, and the structural dissociation model of Nijenhuis, Steele, and Van der Hart, all recognize the centrality of early attachment disruption in complex traumatic presentations.</p>

<p>For the clinician working at this intersection, the organizing principle remains: <em>relationship is both the medium and the message</em>. The therapeutic relationship functions as the safe haven within which traumatic material can be approached and the secure base from which exploratory trauma work can proceed. The skills of Phase 1 stabilization — affect regulation, grounding, window-of-tolerance monitoring — are both trauma-focused interventions and attachment-building activities, because they demonstrate, in direct experience, that the therapist can help contain overwhelming affect and that the client need not face dysregulation alone. This dual function of early-phase work is one of the reasons that good trauma treatment, even before explicit trauma processing begins, often produces meaningful improvements in attachment security as measured by post-treatment AAI or ECR-R administrations.</p>`
        },
        {
          type: 'cardSort',
          instructions: 'Sort each clinical description into the most appropriate attachment-informed intervention phase or approach.',
          categories: ['Phase 1: Safety and Stabilization', 'Phase 2: Attachment Processing and Change', 'Phase 3: Integration and Consolidation'],
          cards: [
            { id: '1', text: 'Therapist and client identify and practice specific grounding techniques the client can use when dissociative symptoms emerge in session.', correctCategory: 'Phase 1: Safety and Stabilization' },
            { id: '2', text: 'Client, with therapist support, revisits early childhood memories of caregiver unavailability and processes the grief associated with unmet attachment needs.', correctCategory: 'Phase 2: Attachment Processing and Change' },
            { id: '3', text: 'Client develops a coherent autobiographical narrative about their early attachment history that they can share with their current partner without becoming dysregulated.', correctCategory: 'Phase 3: Integration and Consolidation' },
            { id: '4', text: 'Therapist provides psychoeducation about the window of tolerance and helps client identify their personal early warning signs of hyperarousal and hypoarousal.', correctCategory: 'Phase 1: Safety and Stabilization' },
            { id: '5', text: 'Therapist and client explore a moment in session where the client withdrew after the therapist offered a warm, direct reflection — examining what triggered the withdrawal and what the client imagined the therapist was thinking.', correctCategory: 'Phase 2: Attachment Processing and Change' },
            { id: '6', text: 'Client reflects on how their current relationships have shifted over the course of treatment, noting an increased capacity to express vulnerability and tolerate the partner\'s imperfect responses without catastrophizing.', correctCategory: 'Phase 3: Integration and Consolidation' },
            { id: '7', text: 'Client and therapist collaboratively establish predictable session structure, including a consistent ritual for beginning and ending sessions, to build therapeutic frame safety.', correctCategory: 'Phase 1: Safety and Stabilization' },
            { id: '8', text: 'Therapist uses the not-knowing stance to slow down the client\'s confident interpretation of a partner\'s behavior and invites curiosity about alternative explanations.', correctCategory: 'Phase 2: Attachment Processing and Change' }
          ]
        },
        {
          type: 'fillInBlank',
          title: 'Attachment-Informed Intervention: Key Concepts',
          blanks: [
            {
              prompt: 'The concept of ________ refers to the therapist\'s regulated nervous system functioning as an external organizer for the client\'s dysregulated nervous system, particularly in moments of overwhelming affect or dissociation.',
              answer: 'co-regulation',
              acceptAlternates: ['affect co-regulation', 'dyadic regulation', 'interpersonal regulation']
            },
            {
              prompt: 'In Mentalization-Based Treatment, the ________ stance refers to the therapist modeling genuine curiosity about mental states rather than offering confident pronouncements about what the client feels or means.',
              answer: 'not-knowing',
              acceptAlternates: ['not knowing', 'epistemic humility']
            },
            {
              prompt: 'Fonagy\'s concept of ________ describes the capacity to receive, integrate, and learn from information from trusted social sources, which is impaired in clients with insecure or disorganized attachment due to early experiences of caregiving that could not be relied upon.',
              answer: 'epistemic trust',
              acceptAlternates: ['epistemic openness']
            },
            {
              prompt: 'The clinical principle of ________ before trauma processing is especially critical with disorganized attachment clients because premature trauma reprocessing risks retraumatization and dissociative destabilization before sufficient affect regulation capacity and relational safety are in place.',
              answer: 'stabilization',
              acceptAlternates: ['safety and stabilization', 'stabilization phase']
            },
            {
              prompt: 'The ________ concept, developed by Dan Siegel, describes the zone of arousal within which the brain can process experience most effectively — flanked by hyperarousal and hypoarousal — and is used in attachment-informed practice to pace the intensity of therapeutic work.',
              answer: 'window of tolerance',
              acceptAlternates: ['optimal arousal zone']
            }
          ]
        },
        {
          type: 'reflection',
          question: 'Think about your current caseload. Identify one client for whom an explicitly attachment-informed approach might shift how you conceptualize and intervene in their treatment. What is the client\'s likely attachment organization based on what you know? What has been your primary intervention focus? What might you do differently — or more deliberately — if you foregrounded attachment theory in your formulation of this case?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'The corrective attachment experience is a specific relational sequence — attachment activation, habitual strategy deployment, unexpected therapist response, explicit processing of the mismatch, and gradual working model update — not simply a positive relational event.',
            'Mentalization-Based Treatment (MBT) targets mentalizing capacity — the ability to understand behavior in terms of underlying mental states — through the not-knowing stance, stop-and-stand technique, and mentalizing the moment in the therapeutic relationship.',
            'Disorganized attachment requires a three-phase approach: safety and stabilization first (with active affect regulation work and window-of-tolerance monitoring), trauma processing second, and integration and consolidation third. Skipping Phase 1 risks retraumatization.',
            'Emotion regulation in attachment-informed practice is fundamentally relational — the therapist\'s regulated nervous system functions as a co-regulatory resource for the client\'s dysregulated one, and formal skills (grounding, mindfulness) support but do not replace this interpersonal process.',
            'Grief work — mourning the caregiving that was needed and not received — is the primary mechanism through which earned security is achieved in attachment-informed psychotherapy, requiring the client to develop a complex, balanced narrative about early caregivers without collapsing into idealization or derogation.'
          ]
        },
        {
          type: 'resources',
          title: 'Section 3 Resources: Attachment-Informed Clinical Practice',
          resources: [
            {
              title: 'Mentalization-Based Treatment — Anna Freud Centre',
              url: 'https://www.annafreud.org/training/mentalization-based-treatment/',
              type: 'website',
              description: 'Official training and clinical resources for Mentalization-Based Treatment (MBT) from the Anna Freud Centre, including MBT manuals, case examples, and training pathways for clinicians.'
            },
            {
              title: 'International Centre for Excellence in Emotionally Focused Therapy (ICEEFT)',
              url: 'https://iceeft.com/',
              type: 'website',
              description: 'Primary professional home of Emotionally Focused Therapy (EFT), offering training resources, clinician locator, research updates, and access to Susan Johnson\'s foundational clinical materials.'
            },
            {
              title: 'Attachment & Human Development Journal',
              url: 'https://www.tandfonline.com/toc/rahd20/current',
              type: 'website',
              description: 'Peer-reviewed journal publishing the latest empirical research on attachment across the lifespan, including adult attachment, clinical applications, and intervention research.'
            },
            {
              title: 'Circle of Security International — Professional Resources',
              url: 'https://www.circleofsecurityinternational.com/circle-of-security-research/',
              type: 'website',
              description: 'Attachment-based parenting program resources with clinical research evidence. Useful for clinicians working with parents whose own attachment insecurity affects their caregiving.'
            },
            {
              title: 'Wallin, D.J. (2007). Attachment in Psychotherapy. Guilford Press.',
              url: 'https://www.guilford.com/books/Attachment-in-Psychotherapy/David-Wallin/9781593854560',
              type: 'book',
              description: 'The clinical practitioner\'s guide to integrating attachment theory with psychotherapy practice. Wallin bridges theoretical foundations with practical, session-level techniques across all attachment styles.'
            },
            {
              title: 'National Child Traumatic Stress Network — Complex Trauma Resources',
              url: 'https://www.nctsn.org/what-is-child-trauma/trauma-types/complex-trauma',
              type: 'website',
              description: 'Clinical resources on complex trauma and its intersection with attachment disruption, including treatment guidelines, fact sheets, and links to evidence-based interventions.'
            },
            {
              title: 'Fonagy, P., & Bateman, A. (2006). Progress in the treatment of borderline personality disorder. British Journal of Psychiatry. https://doi.org/10.1192/bjp.188.1.1',
              url: 'https://doi.org/10.1192/bjp.188.1.1',
              type: 'pdf',
              description: 'Landmark paper by Fonagy and Bateman reporting the first RCT of Mentalization-Based Treatment for borderline personality disorder, establishing the evidence base for attachment-based BPD treatment.'
            },
            {
              title: 'Society for Psychotherapy Research — Attachment-Related Research Presentations',
              url: 'https://www.psychotherapyresearch.org/',
              type: 'website',
              description: 'International research society whose annual conferences frequently feature attachment-informed psychotherapy research. Member resources include access to Psychotherapy Research journal.'
            }
          ]
        }
      ]
    }
  ],

  // ─── ASSESSMENT ───────────────────────────────────────────────────────────
  assessment: {
    title: 'Final Assessment — CR-CLI-601: Attachment Theory in Adult Psychotherapy',
    passingScore: 80,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    questions: [
      // Section 1 questions
      {
        type: 'multipleChoice',
        question: 'John Bowlby proposed that the infant\'s tie to the caregiver is best understood as:',
        options: [
          { text: 'A derivative of feeding satisfaction and libidinal drive fulfillment, as classical psychoanalytic theory described.', isCorrect: false },
          { text: 'A primary motivational system in its own right, shaped by evolutionary pressures toward survival, proximity-seeking, and protection from threat.', isCorrect: true },
          { text: 'A conditioned behavioral response to the caregiver as a source of secondary reinforcement.', isCorrect: false },
          { text: 'A temporary developmental phase that resolves at approximately 18 months as object constancy is achieved.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Bowlby\'s central theoretical innovation was the proposal that the attachment behavioral system is a primary motivational system — not a derivative of feeding, libidinal drives, or conditioning — shaped by evolutionary selection for proximity to protective caregivers as a survival strategy. This represented a fundamental departure from both classical psychoanalysis and Skinnerian learning theory.'
      },
      {
        type: 'multipleChoice',
        question: 'In the two-dimensional model of adult attachment (ECR-R), which quadrant characterizes anxious-preoccupied attachment?',
        options: [
          { text: 'Low anxiety and low avoidance.', isCorrect: false },
          { text: 'High anxiety and high avoidance.', isCorrect: false },
          { text: 'High anxiety and low avoidance.', isCorrect: true },
          { text: 'Low anxiety and high avoidance.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Anxious-preoccupied attachment is characterized by high attachment anxiety (fear of abandonment, hypervigilance to rejection cues) combined with low avoidance (desire for closeness, not a reluctance to depend on others). The fearful-avoidant pattern combines high anxiety with high avoidance; dismissing-avoidant combines high avoidance with low anxiety; secure combines low anxiety with low avoidance.'
      },
      {
        type: 'multipleChoice',
        question: 'Mary Main and Solomon\'s disorganized attachment classification is distinguished from the other Ainsworth classifications primarily by:',
        options: [
          { text: 'The infant\'s use of excessive proximity-seeking that overwhelms the caregiver\'s regulatory capacity.', isCorrect: false },
          { text: 'The breakdown or absence of any consistent behavioral strategy for managing proximity to the caregiver.', isCorrect: true },
          { text: 'The infant\'s intense but quickly resolved distress at separation in the Strange Situation.', isCorrect: false },
          { text: 'The caregiver\'s failure to respond to the infant\'s attachment signals during separation episodes.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Disorganized attachment (Main & Solomon, 1986; 1990) is defined by the absence of any organized, consistent strategy for managing proximity to the caregiver. Disorganized infants show contradictory, apprehensive, or disoriented behaviors — approaching and simultaneously avoiding, freezing, or showing sudden collapse — reflecting the paradox that the caregiver is simultaneously the source of fear and the only available haven of safety ("fright without solution").'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following statements about the Adult Attachment Interview (AAI) are accurate? (Select all that apply)',
        options: [
          { text: 'The AAI classifies adults based on the coherence and organization of their attachment narrative, not primarily on the content of what they experienced in childhood.', isCorrect: true },
          { text: 'An Autonomous/Secure classification on the AAI requires a positive, non-traumatic childhood attachment history.', isCorrect: false },
          { text: 'The Unresolved classification is assigned when discourse shows specific lapses in monitoring of reasoning when discussing loss or abuse, and is superimposed on a primary classification.', isCorrect: true },
          { text: 'The Dismissing classification is characterized by angry, entangled, or passive discourse about childhood caregivers.', isCorrect: false },
          { text: 'Earned security refers to an Autonomous/Secure AAI classification achieved despite a history of adverse early attachment experiences.', isCorrect: true }
        ],
        explanation: 'The AAI measures narrative coherence, not historical content — meaning adults with adverse histories can achieve Autonomous/Secure classification (earned security) by demonstrating integrated, coherent narrative about those experiences. The Unresolved classification is superimposed on a primary one and requires specific lapses in monitoring when discussing loss or abuse. Angry, entangled, or passive discourse characterizes the Preoccupied (not Dismissing) classification; Dismissing is characterized by idealization, insistence on lack of memory, or normalization of clearly adverse experiences.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes the clinical concept of internal working models as originally developed by Bowlby?',
        options: [
          { text: 'Explicit autobiographical memories of early attachment experiences that the client can access and modify through cognitive restructuring.', isCorrect: false },
          { text: 'Cognitive-affective schemas, operating largely outside conscious awareness, that encode representations of self, attachment figures, and relationships — functioning as perceptual filters in close relationships.', isCorrect: true },
          { text: 'Learned behavioral scripts for seeking proximity to caregivers that are extinguished when new positive relational experiences occur.', isCorrect: false },
          { text: 'Neurological structures in the limbic system that encode fear responses to caregivers who were abusive or neglectful.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Internal working models, as Bowlby conceptualized them (borrowing from Kenneth Craik), are cognitive-affective schemas that operate largely outside conscious awareness, encoding representations of the self as worthy or unworthy of care, of attachment figures as available or unavailable, and of the relationship between them. They function as perceptual filters — shaping what individuals notice, expect, and elicit from others — making them self-confirming and resistant to change through simple positive relational experience alone.'
      },
      // Section 2 questions
      {
        type: 'multipleChoice',
        question: 'Research by Dozier and colleagues on therapist-client attachment matching found that clients with dismissing-avoidant attachment showed better outcomes when their therapist:',
        options: [
          { text: 'Mirrored the client\'s deactivating strategy by maintaining emotional distance and focusing on cognitive, skill-based interventions.', isCorrect: false },
          { text: 'Provided extra warmth and extended sessions to compensate for early attachment deprivation.', isCorrect: false },
          { text: 'Was rated as secure on the AAI and was willing to gently challenge deactivating strategies by drawing attention to emotional experience.', isCorrect: true },
          { text: 'Was themselves dismissing-avoidant, allowing for greater empathic attunement with the client\'s regulatory style.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Dozier\'s research found that the most therapeutically effective stance for dismissing clients involved secure therapists who did not collude with the client\'s deactivating strategy by accepting emotional avoidance at face value, but instead gently and persistently brought attention to emotional experience. This complementary-then-challenging approach gradually expands the client\'s emotional range beyond the limits of the deactivating strategy.'
      },
      {
        type: 'multipleChoice',
        question: 'Alliance ruptures in anxious-preoccupied clients most commonly take the form of:',
        options: [
          { text: 'Withdrawal ruptures — sudden emotional flatness, missed appointments, or abrupt announcements of termination.', isCorrect: false },
          { text: 'Confrontation ruptures — open expression of anger or disappointment toward the therapist, or intensified reassurance demands.', isCorrect: true },
          { text: 'Disorganization ruptures — sudden dissociative episodes or narrative collapse during sessions.', isCorrect: false },
          { text: 'Avoidant ruptures — persistent deflection of emotionally charged topics into intellectualized discussion.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Anxious-preoccupied clients\' hyperactivating regulatory strategy produces confrontation ruptures — direct expression of anger, disappointment, or escalated demands for reassurance. These ruptures reflect the hyperactivating logic: escalate the signal when the attachment figure seems less engaged. Withdrawal ruptures are characteristic of dismissing-avoidant clients, whose deactivating strategy involves suppressing attachment needs and creating emotional distance when intimacy threatens.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following behaviors at clinical intake are most consistent with anxious-preoccupied attachment organization? (Select all that apply)',
        options: [
          { text: 'Extensive early self-disclosure with high emotional intensity, sometimes including implicit or explicit fears of therapist abandonment.', isCorrect: true },
          { text: 'Entangled, emotionally flooded narratives about past relationships that lose their narrative thread and fail to reach resolution.', isCorrect: true },
          { text: 'Reluctance about emotional disclosure combined with minimization of the significance of current difficulties.', isCorrect: false },
          { text: 'Heightened sensitivity to perceived therapist disengagement, with rapid alliance formation followed by intense volatility.', isCorrect: true },
          { text: 'Insistence that only practical, skill-based intervention is needed and that discussing the past is irrelevant.', isCorrect: false }
        ],
        explanation: 'Anxious-preoccupied clients\' hyperactivating strategy produces extensive early self-disclosure, high emotional intensity, entangled narratives, rapid but volatile alliance formation, and heightened sensitivity to perceived therapist disengagement. Reluctance about emotional disclosure, minimization of concerns, and insistence on skill-based approaches reflect dismissing-avoidant deactivating strategies.'
      },
      {
        type: 'multipleChoice',
        question: 'A client consistently interprets your empathic reflections as criticism and responds with defensive justification or withdrawal. From an attachment theory perspective, this pattern most likely reflects:',
        options: [
          { text: 'A deliberate testing behavior designed to determine whether the therapist will abandon them.', isCorrect: false },
          { text: 'The operation of a working model encoding others as critical or rejecting, functioning as a perceptual filter that shapes how the client processes the therapist\'s communications.', isCorrect: true },
          { text: 'A passive-aggressive response indicating underlying hostility toward therapeutic authority.', isCorrect: false },
          { text: 'An ambivalent attachment pattern in which the client desires closeness but simultaneously fears it.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'From an attachment perspective, the client\'s consistent interpretation of empathic reflections as criticism reflects the operation of an internal working model encoding others as critical or rejecting. This working model functions as a perceptual filter — the client is not deliberately distorting the therapist\'s communications but is processing them through a schema that makes criticism the most expected and fluently processed interpretation. Understanding this helps the clinician respond with curiosity rather than defensiveness.'
      },
      {
        type: 'multipleChoice',
        question: 'The concept of epistemic hypervigilance, as developed by Fonagy and colleagues, refers to:',
        options: [
          { text: 'The therapist\'s active monitoring of their own countertransference reactions for attachment-relevant information.', isCorrect: false },
          { text: 'An impaired capacity to receive, integrate, and learn from social communications, developed when early caregiving was systematically misattuned, neglectful, or confusing.', isCorrect: true },
          { text: 'The client\'s heightened awareness of somatic signals indicating dissociative activation in sessions.', isCorrect: false },
          { text: 'A diagnostic feature of obsessive-compulsive presentations in which clients over-monitor their own thought content for signs of danger.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Epistemic hypervigilance, in Fonagy\'s framework, is the generalized distrust of social communications that develops when early caregiving has been consistently unreliable, confusing, or harmful. When caregivers cannot be trusted to accurately reflect or respond to the child\'s experience, the child learns to discount or distrust input from potential caregivers — a defensive posture that makes adaptive sense developmentally but impairs the capacity to learn from therapeutic interventions in adulthood.'
      },
      // Section 3 questions
      {
        type: 'multipleChoice',
        question: 'In Emotionally Focused Couple Therapy (EFCT), the pursuer-withdrawer cycle is reframed as:',
        options: [
          { text: 'Evidence of one partner\'s pathological attachment and the other\'s healthy self-sufficiency.', isCorrect: false },
          { text: 'A mutual reinforcement pattern in which both partners\' attachment strategies become locked into a cycle that confirms each other\'s working model fears.', isCorrect: true },
          { text: 'A power differential requiring the therapist to side with the withdrawing partner and set limits on the pursuing partner\'s demands.', isCorrect: false },
          { text: 'A communication deficit best addressed through Gottman-style conflict management skills training.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'EFCT reframes the pursuer-withdrawer cycle — the pursuing partner\'s escalating demands and the withdrawing partner\'s stonewalling — as a mutually reinforcing attachment dynamic in which both partners are understood as engaged in attachment strategies (hyperactivating and deactivating, respectively) that feed each other. The cycle is reframed as the couple\'s shared enemy, not evidence of either partner\'s pathology. This reframe is a key Stage 1 de-escalation intervention.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are core principles for working with disorganized attachment in adult psychotherapy? (Select all that apply)',
        options: [
          { text: 'Stabilization and affect regulation capacity must be established before trauma processing is initiated.', isCorrect: true },
          { text: 'Dissociative activation in session should be addressed immediately with interpretive depth to capitalize on the therapeutic moment.', isCorrect: false },
          { text: 'The therapeutic relationship must be predictable and structured, providing the safe haven experience that disorganized clients were denied in early development.', isCorrect: true },
          { text: 'Window-of-tolerance monitoring should guide the pacing of all trauma-adjacent work with disorganized clients.', isCorrect: true },
          { text: 'Disorganized clients benefit most from brief, structured, CBT-based interventions that bypass the relational dimension.', isCorrect: false }
        ],
        explanation: 'Disorganized attachment requires a careful, phased approach: stabilization and affect regulation must precede trauma processing to prevent retraumatization. The therapeutic relationship must be predictable and structured. Window-of-tolerance monitoring is essential for pacing. Dissociative activation should be met with grounding and present-moment orientation, not interpretive depth. Disorganized attachment is the presentation for which the relational dimension is most important — bypassing it is contraindicated.'
      },
      {
        type: 'multipleChoice',
        question: 'The "stop and stand" technique in Mentalization-Based Treatment (MBT) is used primarily when:',
        options: [
          { text: 'The client demonstrates secure attachment and is able to tolerate deeper exploratory work.', isCorrect: false },
          { text: 'The therapeutic alliance is newly formed and the therapist wants to avoid premature depth of emotional engagement.', isCorrect: false },
          { text: 'Affect escalates in session to the point where the client\'s mentalizing capacity is overwhelmed and reflective thinking is compromised.', isCorrect: true },
          { text: 'The client refuses to engage with the therapist\'s interpretation and the therapist needs to assert therapeutic authority.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The stop-and-stand technique is used when emotional arousal escalates in session to a point where mentalizing capacity — the ability to hold experience reflectively — is overwhelmed. The therapist slows the pace, explicitly names what is happening ("Let\'s stop here for a moment"), and helps the client return to a regulated state in which reflective thought is again possible. It is not a technique for asserting authority but for preserving the mentalizing space when emotional flooding threatens it.'
      },
      {
        type: 'multipleChoice',
        question: 'The corrective attachment experience in psychotherapy is best described as:',
        options: [
          { text: 'The therapist consciously acting as a "better parent," offering extra warmth, extended sessions, or relaxed boundaries to compensate for early deprivation.', isCorrect: false },
          { text: 'A specific relational sequence in which the client\'s habitual attachment strategy meets an unexpected therapist response that is then explicitly processed, gradually updating the working model.', isCorrect: true },
          { text: 'Any positive relational experience in therapy that provides the client with a model of healthy relationship functioning.', isCorrect: false },
          { text: 'A single breakthrough session in which the client accesses and processes the core early attachment trauma.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The corrective attachment experience is a specific relational sequence — not simply a positive experience or a substitute for good parenting. The sequence requires: attachment system activation, the client\'s habitual strategy deployment, an unexpected therapist response that violates the working model prediction, and explicit metacommunicative processing of the mismatch. Without the processing step, the new relational experience may not be encoded in a way that updates the working model. Single breakthrough sessions are insufficient; repetition is required.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are characteristics of hypermentalizing, as described by Fonagy and colleagues? (Select all that apply)',
        options: [
          { text: 'Excessive and often inaccurate attribution of mental states to others, particularly hostile or rejecting intent.', isCorrect: true },
          { text: 'Hypervigilance to social cues combined with a confirmation bias toward threatening interpretations.', isCorrect: true },
          { text: 'Minimal attention to mental states in self or others, with over-reliance on behavioral explanations.', isCorrect: false },
          { text: 'Most commonly associated with anxious-preoccupied attachment organization.', isCorrect: true },
          { text: 'A pattern of alternating between reflective insight and complete mentalizing collapse under relational stress.', isCorrect: false }
        ],
        explanation: 'Hypermentalizing involves excessive, often inaccurate attribution of mental states — particularly hostile or rejecting intent — fueled by hypervigilance and confirmation bias. It is most associated with anxious-preoccupied organization. Minimal attention to mental states with over-reliance on behavioral explanations describes hypo-mentalizing (associated with dismissing attachment). Alternating between insight and collapse under relational stress describes the mentalizing breakdown associated with disorganized/fearful-avoidant attachment, particularly in borderline presentations.'
      },
      {
        type: 'multipleChoice',
        question: 'According to Schore and Siegel\'s neuroscience research integrated with attachment theory, early attuned caregiving primarily supports which developmental process?',
        options: [
          { text: 'The development of language and declarative memory systems necessary for autobiographical narrative construction.', isCorrect: false },
          { text: 'The maturation of right-hemisphere and orbitofrontal neural systems underlying affect regulation and interpersonal attunement.', isCorrect: true },
          { text: 'The consolidation of object constancy and the capacity to tolerate ambivalence about caregivers.', isCorrect: false },
          { text: 'The development of cognitive schemas for social interaction that later become internal working models.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Schore\'s regulatory theory and Siegel\'s interpersonal neurobiology both identify early attuned caregiving as the developmental context in which right-hemisphere and orbitofrontal neural systems — responsible for emotional processing, affect regulation, and interpersonal attunement — develop their regulatory capacity. Early relational trauma or deprivation disrupts this neurodevelopmental process at the level of biological organization, which explains why affect dysregulation in insecure and traumatized clients is not merely a habit but a neurobiologically rooted pattern requiring relational — not just cognitive — intervention.'
      },
      {
        type: 'multipleChoice',
        question: 'A clinician notices that with their dismissing-avoidant client, sessions tend to feel intellectually engaged but emotionally flat — the clinician finds themselves working harder to generate emotional engagement and feels a subtle tedium. From an attachment perspective, this countertransference most likely reflects:',
        options: [
          { text: 'Clinician burnout unrelated to the client\'s attachment presentation.', isCorrect: false },
          { text: 'The client\'s deactivating strategy creating a relational field of emotional distance that the clinician experiences as flatness or tedium.', isCorrect: true },
          { text: 'A projective identification in which the client is externalizing their suppressed affect onto the clinician.', isCorrect: false },
          { text: 'An indication that the clinician is not yet skilled enough to form an alliance with dismissing clients and should refer out.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The subtle tedium and working harder that clinicians often experience with dismissing-avoidant clients is an attachment-relevant countertransference signal: the client\'s deactivating strategy — suppressing emotional needs, maintaining intellectual distance, keeping affect at arm\'s length — creates a relational field that the clinician experiences as emotional flatness. This is diagnostic information about the client\'s attachment organization, not a sign of clinician limitation. The clinician\'s task is to use this awareness to gently, persistently bring attention to the emotional subtext without triggering defensive intensification.'
      }
    ]
  },

  // ─── REFERENCES ───────────────────────────────────────────────────────────
  references: [
    'Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). <em>Patterns of attachment: A psychological study of the strange situation.</em> Lawrence Erlbaum. https://doi.org/10.4324/9780203763490',
    'Bateman, A., & Fonagy, P. (2009). Randomized controlled trial of outpatient mentalization-based treatment versus structured clinical management for borderline personality disorder. <em>American Journal of Psychiatry, 166</em>(12), 1355–1364. https://doi.org/10.1176/appi.ajp.2009.09040539',
    'Bowlby, J. (1969). <em>Attachment and loss: Vol. 1. Attachment.</em> Basic Books.',
    'Bowlby, J. (1973). <em>Attachment and loss: Vol. 2. Separation: Anxiety and anger.</em> Basic Books.',
    'Bowlby, J. (1980). <em>Attachment and loss: Vol. 3. Loss: Sadness and depression.</em> Basic Books.',
    'Brennan, K. A., Clark, C. L., & Shaver, P. R. (1998). Self-report measurement of adult attachment: An integrative overview. In J. A. Simpson & W. S. Rholes (Eds.), <em>Attachment theory and close relationships</em> (pp. 46–76). Guilford Press.',
    'Dozier, M., Cue, K. L., & Barnett, L. (1994). Clinicians as caregivers: Role of attachment organization in treatment. <em>Journal of Consulting and Clinical Psychology, 62</em>(4), 793–800. https://doi.org/10.1037/0022-006X.62.4.793',
    'Fonagy, P., Gergely, G., Jurist, E. L., & Target, M. (2002). <em>Affect regulation, mentalization, and the development of the self.</em> Other Press.',
    'Fonagy, P., & Bateman, A. W. (2006). Mechanisms of change in mentalization-based treatment of BPD. <em>Journal of Clinical Psychology, 62</em>(4), 411–430. https://doi.org/10.1002/jclp.20241',
    'Fraley, R. C., Waller, N. G., & Brennan, K. A. (2000). An item response theory analysis of self-report measures of adult attachment. <em>Journal of Personality and Social Psychology, 78</em>(2), 350–365. https://doi.org/10.1037/0022-3514.78.2.350',
    'Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. <em>Journal of Personality and Social Psychology, 52</em>(3), 511–524. https://doi.org/10.1037/0022-3514.52.3.511',
    'Johnson, S. M. (2004). <em>The practice of emotionally focused couple therapy: Creating connection</em> (2nd ed.). Brunner-Routledge.',
    'Main, M., & Hesse, E. (1990). Parents\' unresolved traumatic experiences are related to infant disorganized attachment status: Is frightened and/or frightening parental behavior the linking mechanism? In M. T. Greenberg, D. Cicchetti, & E. M. Cummings (Eds.), <em>Attachment in the preschool years</em> (pp. 161–182). University of Chicago Press.',
    'Main, M., & Solomon, J. (1990). Procedures for identifying infants as disorganized/disoriented during the Ainsworth Strange Situation. In M. T. Greenberg, D. Cicchetti, & E. M. Cummings (Eds.), <em>Attachment in the preschool years</em> (pp. 121–160). University of Chicago Press.',
    'Mikulincer, M., & Shaver, P. R. (2007). <em>Attachment in adulthood: Structure, dynamics, and change.</em> Guilford Press.',
    'Ogden, P., Minton, K., & Pain, C. (2006). <em>Trauma and the body: A sensorimotor approach to psychotherapy.</em> Norton.',
    'Schore, A. N. (2003). <em>Affect regulation and the repair of the self.</em> Norton.',
    'Siegel, D. J. (2012). <em>The developing mind: How relationships and the brain interact to shape who we are</em> (2nd ed.). Guilford Press.',
    'Wallin, D. J. (2007). <em>Attachment in psychotherapy.</em> Guilford Press.',
    'Van IJzendoorn, M. H. (1995). Adult attachment representations, parental responsiveness, and infant attachment: A meta-analysis on the predictive validity of the Adult Attachment Interview. <em>Psychological Bulletin, 117</em>(3), 387–403. https://doi.org/10.1037/0033-2909.117.3.387'
  ],

  // ─── TOP-LEVEL RESOURCES ─────────────────────────────────────────────────
  resources: [
    {
      title: 'Wallin, D.J. — Attachment in Psychotherapy (Guilford Press)',
      url: 'https://www.guilford.com/books/Attachment-in-Psychotherapy/David-Wallin/9781593854560',
      type: 'book',
      description: 'The definitive clinical guide to integrating attachment theory into adult psychotherapy. Wallin provides session-level techniques for working with all four attachment styles and bridges Bowlby\'s theory with neuroscience and contemporary relational practice.'
    },
    {
      title: 'Mikulincer & Shaver — Attachment in Adulthood (Guilford Press)',
      url: 'https://www.guilford.com/books/Attachment-in-Adulthood/Mikulincer-Shaver/9781462542758',
      type: 'book',
      description: 'The most comprehensive research synthesis on adult attachment, covering the two-dimensional model, regulatory strategies, and the extensive empirical literature on how attachment organization affects psychological functioning across domains.'
    },
    {
      title: 'ICEEFT — International Centre for Excellence in Emotionally Focused Therapy',
      url: 'https://iceeft.com/',
      type: 'website',
      description: 'Professional home of EFT with training pathways, research updates, and clinical resources for practitioners using Susan Johnson\'s attachment-based approach to individual and couple therapy.'
    },
    {
      title: 'Anna Freud Centre — Mentalization-Based Treatment Resources',
      url: 'https://www.annafreud.org/training/mentalization-based-treatment/',
      type: 'website',
      description: 'Official training, research, and clinical resources for Mentalization-Based Treatment (MBT), the evidence-based attachment-informed treatment for borderline personality disorder and complex presentations.'
    },
    {
      title: 'Main, M. — Adult Attachment Interview Protocol and Classification',
      url: 'https://psychology.berkeley.edu/people/mary-main',
      type: 'website',
      description: 'Mary Main\'s faculty page at UC Berkeley with information about AAI training, classification system updates, and links to her research on adult attachment representations and their transmission across generations.'
    },
    {
      title: 'Experiences in Close Relationships-Revised (ECR-R) Scale — Free Access',
      url: 'https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm',
      type: 'website',
      description: 'Fraley\'s laboratory page providing free access to the ECR-R scale, scoring instructions, and dimensional attachment style interpretation. Appropriate for clinical use as a self-report attachment assessment tool.'
    },
    {
      title: 'Circle of Security International — Professional Resources',
      url: 'https://www.circleofsecurityinternational.com/',
      type: 'website',
      description: 'Attachment-based parenting intervention with growing evidence base. Valuable for clinicians working with parents whose own attachment insecurity affects caregiving, and for understanding the intergenerational transmission of attachment patterns.'
    },
    {
      title: 'Attachment & Human Development Journal (Taylor & Francis)',
      url: 'https://www.tandfonline.com/toc/rahd20/current',
      type: 'website',
      description: 'Peer-reviewed journal publishing cutting-edge empirical research on attachment theory across the lifespan, including adult attachment, clinical applications, assessment research, and intervention outcomes.'
    }
  ]
};

// ─── WORD COUNT & VALIDATION ──────────────────────────────────────────────
function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.flashcards)(b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front).split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back).split(/\s+/).filter(Boolean).length;});
  if(b.nodes&&typeof b.nodes==='object'&&!Array.isArray(b.nodes))Object.values(b.nodes).forEach(n=>{t+=stripHTML(n.text||'').split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text||'').split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.blanks)b.blanks.forEach(bl=>{t+=stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;t+=stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;});
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.title||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
  if(b.cards)(b.cards||[]).forEach(c=>{t+=stripHTML(c.text||'').split(/\s+/).filter(Boolean).length;});
}return t;}

function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words');
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(t.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:activity`);
if(t.filter(x=>x==='callout').length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:callout_missing`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push('CRITICAL:flat_options');}
if((c.assessment?.questions?.length||0)<15)e.push('CRITICAL:exam<15');
if((c.references?.length||0)<15)e.push('CRITICAL:refs<15');
if((c.resources?.length||0)<3)e.push('CRITICAL:resources<3');
return{wc,e};}

async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode}|${wc}w/${COURSE.ceHours*6000}req|${COURSE.sections.length}sec|${COURSE.assessment?.questions?.length}exam|${COURSE.references?.length}refs|${COURSE.resources?.length}res|${(COURSE.sections||[]).reduce((n,s)=>n+(s.contentBlocks||[]).filter(b=>b.type==='callout').length,0)}callouts`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('⚠️',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated');}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted');}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
