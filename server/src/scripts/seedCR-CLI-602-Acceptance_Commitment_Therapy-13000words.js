import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-cli-602-acceptance-commitment-therapy';

const COURSE = {
  courseCode: 'CR-CLI-602',
  slug: SLUG,
  title: 'Acceptance and Commitment Therapy: Core Processes for Clinicians',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
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
      hourBreakdown: [{ label: 'core', hours: 2 }]
    }
  ],

  sections: [
    // ─────────────────────────────────────────────────────────────
    // SECTION 0 — INTRODUCTION
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Introduction to Acceptance and Commitment Therapy',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: 0,
          title: 'Welcome: Acceptance and Commitment Therapy for Clinicians',
          subtitle: 'A two-hour CE course exploring the theoretical foundations, core processes, and clinical applications of ACT across counseling and psychotherapy settings.'
        },
        {
          type: 'text',
          content: `<p>Acceptance and Commitment Therapy (ACT) has emerged over the past three decades as one of the most empirically supported and conceptually distinct approaches in contemporary psychotherapy. Developed primarily by Steven C. Hayes and colleagues in the late 1980s and refined continuously since, ACT represents both a clinical framework and a philosophical orientation rooted in functional contextualism and a behavioral science called Relational Frame Theory (RFT). Unlike many therapeutic approaches that position symptom reduction as the primary goal of treatment, ACT takes a fundamentally different stance: psychological suffering is not the enemy to be vanquished, but rather an inevitable feature of human language and cognition that can be related to differently through a shift in psychological stance.</p>

<p>For clinicians trained primarily in cognitive-behavioral traditions, ACT often initially appears to be a modest extension of CBT — an "add acceptance skills here" upgrade to an existing toolkit. This impression is understandable but misleading. While ACT shares CBT's commitment to empiricism and behavioral change, its theoretical underpinnings diverge substantially at the level of what constitutes psychopathology and what the mechanism of therapeutic change actually is. CBT classically aims to modify the content of cognition — to replace distorted thoughts with more accurate or adaptive ones. ACT, by contrast, is largely indifferent to the truth value of a thought. What matters is not whether a thought is accurate, but whether relating to that thought in a particular way is workable — whether it enables the person to move toward what matters to them.</p>

<p>This course is designed for licensed mental health professionals who are familiar with evidence-based practice but may be encountering ACT at a serious clinical level for the first time, or who have learned ACT elements in isolation and wish to understand the full theoretical architecture that gives those elements their meaning. We will move through the hexaflex model — ACT's map of the six core psychological processes — with attention to how each process relates to the others and how the model as a whole explains both psychological suffering and psychological flexibility. We will then turn to clinical application, examining specific ACT techniques, common implementation challenges, and the populations and presenting problems for which ACT has the most robust evidence base.</p>

<p>Throughout this course, we will emphasize that ACT is not a collection of techniques to be applied like a toolbox. It is a coherent therapeutic stance grounded in a specific theory of mind and language. Clinicians who understand the theory are far better positioned to work flexibly and creatively with individual clients than those who have memorized a set of exercises without grasping why those exercises work. The metaphors, the mindfulness practices, the values work — all of it flows from a single core insight about the nature of human suffering and the conditions under which people can choose to live differently.</p>

<p>By the end of this two-hour course, participants will be able to articulate the six core ACT processes and their interrelationships, distinguish ACT's model of psychopathology from CBT's, apply core ACT techniques within their clinical work, and recognize and manage common clinician errors in ACT delivery. This course meets NBCC CE requirements and is appropriate for counselors at all licensure levels who are working with adult populations in outpatient, community mental health, integrated care, or private practice settings.</p>`
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 1 — THE ACT HEXAFLEX
    // ─────────────────────────────────────────────────────────────
    {
      title: 'The ACT Hexaflex: Psychological Flexibility and Its Six Core Processes',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: 1,
          title: 'Section 1: The ACT Hexaflex and the Architecture of Psychological Flexibility',
          subtitle: 'Exploring relational frame theory, the six core processes of psychological flexibility, and the role of experiential avoidance in the development and maintenance of psychopathology.'
        },
        {
          type: 'text',
          content: `<p>The conceptual foundation of Acceptance and Commitment Therapy rests on a behavioral account of human language and cognition called Relational Frame Theory, or RFT. To understand why ACT works the way it does — why it uses metaphor rather than disputation, why it targets the relationship to thought rather than thought content — clinicians need at least a working grasp of RFT's central claims. RFT proposes that human language involves the learned ability to relate events to one another in arbitrary, bidirectional ways that are not determined by the physical properties of those events. When we learn that the word "apple" refers to a particular fruit, we do not have to be separately taught that the fruit can also be called "apple" — the relation is bidirectional by virtue of the arbitrary relational framing that human language allows. More importantly, the psychological functions of stimuli can be transferred through these networks of relations in ways that have profound clinical implications.</p>

<p>Consider a client who experienced a panic attack while driving on a highway. Through conditioning, the highway becomes associated with panic. But through relational framing, any stimulus that the client relates to highways — other multi-lane roads, the sound of traffic, the thought of driving, the sensation of speed — can acquire similar fear-eliciting functions, even without direct exposure. This is why avoidance generalizes so rapidly in anxiety disorders: language and relational framing allow the feared stimulus network to expand far beyond what direct conditioning alone could account for. It also explains why verbal interventions that merely challenge thought content often fail — you can construct a perfectly logical rebuttal to a fear-evoking thought, and that rebuttal itself can become incorporated into the fear network, acquiring fear-eliciting functions through its association with the feared content.</p>

<p>ACT's response to the inherent "stickiness" of language and thought is not to try to eliminate problematic thoughts or to replace them with better ones, but to change the context in which thoughts occur — to shift the functional relationship between the person and their thought processes. This is the domain of cognitive defusion, one of the six core ACT processes. But defusion cannot be understood in isolation. All six processes of the ACT hexaflex are interrelated and mutually supporting, and the overall goal they serve is what ACT calls psychological flexibility: the ability to contact the present moment fully, as a conscious human being, and to change or persist in behavior when doing so serves valued ends.</p>

<p>The hexaflex model depicts psychological flexibility as the intersection of six processes arranged in a hexagonal shape: Acceptance, Defusion, Contact with the Present Moment, Self-as-Context, Values, and Committed Action. These six processes can be grouped into three pairs that address three fundamental dimensions of psychological functioning. The first pair — Acceptance and Defusion — addresses the relationship to inner experience, moving from experiential avoidance and cognitive fusion toward openness. The second pair — Contact with the Present Moment and Self-as-Context — addresses the relationship to self and time, moving from conceptualized self and temporal rigidity toward a flexible, transcendent sense of self. The third pair — Values and Committed Action — addresses the relationship to behavior, moving from avoidance-driven and impulsive action toward values-consistent, flexible action. The center of the hexaflex, where all six processes converge, is psychological flexibility itself — the capacity to act effectively in the service of what matters, even in the presence of difficult thoughts and feelings.</p>

<p>It is essential for clinicians to understand that these six processes are not stages to be completed sequentially, nor are they independent skills to be taught one at a time. They are facets of a unified capacity, and work on any one process tends to support and reinforce the others. A client who develops greater contact with the present moment through mindfulness practice typically finds it somewhat easier to defuse from thoughts, because mindfulness naturally shifts attention from the content of thought to the process of thinking. Similarly, clarity about values tends to increase willingness to experience discomfort, because the client can see what they are tolerating difficulty in service of. The hexaflex is not a checklist; it is a map of interdependent processes that together constitute the ability to live a flexible, meaningful human life.</p>

<p>Psychological inflexibility — the opposite of psychological flexibility — is ACT's account of the common factor underlying most forms of psychopathology. Rather than proposing separate mechanisms for depression, anxiety, chronic pain, substance use, and so on, ACT proposes that these diverse presentations share a common process: the narrowing of behavioral repertoires through experiential avoidance and cognitive fusion, which keeps people trapped in patterns that are driven by avoidance of inner experience rather than movement toward what they value. This is a bold theoretical claim, and it is also the reason ACT has shown transdiagnostic efficacy: addressing psychological flexibility mechanisms helps across disorders rather than requiring entirely different interventions for each diagnosis.</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Experiential Avoidance: The Engine of Psychological Inflexibility',
          content: `<p>Experiential avoidance is ACT's term for the tendency to suppress, escape from, or otherwise avoid unwanted private experiences — thoughts, feelings, memories, bodily sensations — even when doing so causes significant behavioral harm or constrains valued living. ACT theory proposes that experiential avoidance is the most common pathway through which psychological inflexibility develops and is maintained.</p>

<p>Importantly, experiential avoidance is not simply "avoiding feelings." It is any behavioral pattern — including cognitive strategies like rumination, distraction, reassurance-seeking, worry, and suppression — whose function is to reduce contact with unwanted inner experience. The client who stays home from work to avoid the anxiety of social evaluation is engaging in experiential avoidance. So is the client who spends hours mentally rehearsing difficult conversations in order to feel more prepared and less anxious. The function, not the topography, defines experiential avoidance.</p>

<p>The clinical paradox of experiential avoidance is well-documented in the psychological literature: attempts to suppress or avoid unwanted internal experience often increase its frequency and intensity (the "white bear" suppression effect documented by Wegner), while reducing behavioral flexibility and narrowing the life the person can live. ACT does not try to eliminate the urge to avoid — it works to change the client's relationship to that urge, and to increase the capacity for willingness as an alternative to avoidance when avoidance is costly.</p>

<p><strong>Clinical note:</strong> When assessing for experiential avoidance, ask not just "what do you avoid doing?" but "what are you trying not to feel when you do that?" This functional assessment shifts the conversation from behavior topography to behavior function, which is the level at which ACT intervenes.</p>`
        },
        {
          type: 'text',
          content: `<p>The first process of the hexaflex, Acceptance, is perhaps the most frequently misunderstood term in the ACT framework — both by clients and by clinicians who are new to the model. Acceptance in ACT does not mean resignation, tolerance, or making peace with a situation that should be changed. It means something far more specific and active: willingness to have private experiences — thoughts, feelings, memories, sensations — as they are, without unnecessary defense, and without allowing the effort to reduce or eliminate those experiences to determine behavior. Acceptance is the active, flexible posture of an observer who allows experience to arise and pass without trying to reshape it or make it go away.</p>

<p>The second process, Cognitive Defusion, targets the way human beings naturally become fused with their thoughts — treating thoughts as literal truths about reality, as commands that must be obeyed, or as threats that must be neutralized. Fusion with a thought like "I am fundamentally broken" does not merely cause distress in the moment; it narrows behavior toward that thought's content, leading to avoidance, withdrawal, and self-defeating action as if the thought were a fact about the world. Defusion techniques work by changing the context in which thoughts are held, helping clients observe thoughts as thoughts — passing events in a stream of mental activity — rather than as direct representations of reality to be acted upon. Classic defusion techniques include thanking the mind for the thought, labeling thoughts as thoughts ("I notice I'm having the thought that…"), repeating a word until it loses its semantic load, or visualizing thoughts as leaves floating on a stream.</p>

<p>The third process, Contact with the Present Moment, addresses the tendency of the human mind to be pulled into the past (rumination, regret, grief) or the future (worry, anticipatory anxiety, planning) at the expense of flexible engagement with what is actually happening now. Present-moment awareness in ACT is not passive contemplation; it is the active deployment of attention to current experience — internal and external — with curiosity and openness. This process overlaps substantially with mindfulness as taught in other traditions, and ACT draws freely on mindfulness-based techniques as vehicles for present-moment contact. The clinical utility of present-moment awareness is substantial: clients who can contact the present moment are better able to notice when avoidance is occurring, more responsive to defusion techniques, and more available to perceive the actual consequences of their behavior rather than the feared consequences their minds generate.</p>

<p>The fourth process, Self-as-Context — sometimes called the Observing Self or Transcendent Self — addresses the problem of over-identification with a conceptualized self. Most clients, especially those with significant trauma history or depression, carry a story about who they are that has become rigid and limiting: "I am an anxious person," "I am the one who was abused," "I am not capable of real connection." ACT does not try to replace these self-narratives with more positive ones, because replacing the content of the story leaves the underlying fusion with the story intact. Instead, ACT helps clients discover a perspective-taking self that is distinct from any content — a self that has thoughts and feelings and histories but is not defined by them. The classic ACT metaphor is the chessboard: the pieces on the board (thoughts, feelings, memories) can be dark or light, and the game can go any number of ways, but the board itself is always just the board — stable, consistent, and not threatened by any particular move.</p>

<p>The fifth and sixth processes — Values and Committed Action — address the behavioral dimension of psychological flexibility. Values in ACT are defined as chosen life directions: the qualities of ongoing action that are intrinsically meaningful to the person, independent of whether specific outcomes are achieved. Committed Action refers to the development of broader and broader patterns of behavior in the service of those values, even in the presence of barriers including difficult thoughts and feelings. Together, these two processes constitute the action arm of ACT — they are what transforms increased openness and awareness into an actually different life.</p>`
        },
        {
          type: 'accordion',
          title: 'The Six Core ACT Processes: Clinical Definitions',
          accordionItems: [
            {
              title: 'Acceptance',
              content: `<p><strong>Definition:</strong> Active willingness to have private experiences (thoughts, emotions, sensations, memories) as they are, without unnecessary defense or suppression, even when those experiences are painful or unwanted.</p>
<p><strong>Opposite:</strong> Experiential avoidance — any pattern of behavior whose function is to reduce, escape, or suppress contact with unwanted internal experience.</p>
<p><strong>Key clinical point:</strong> Acceptance is not a feeling of being okay with something; it is a behavioral posture of willingness. Clients often resist acceptance because they hear it as "giving up." Clinicians should consistently reframe acceptance as a choice to stop fighting inner experience in order to free up energy for valued action.</p>
<p><strong>Common technique:</strong> The "Passengers on the Bus" metaphor — the client is the bus driver; difficult thoughts and feelings are passengers who make noise and issue demands, but they don't actually drive the bus. The client can keep driving toward their destination while the passengers ride along.</p>`
            },
            {
              title: 'Cognitive Defusion',
              content: `<p><strong>Definition:</strong> The process of changing the context in which thoughts occur so that they are experienced as passing mental events rather than as literal truths, direct commands, or threats requiring response.</p>
<p><strong>Opposite:</strong> Cognitive fusion — entanglement with thoughts such that they directly regulate behavior, regardless of whether acting on them serves valued ends.</p>
<p><strong>Key clinical point:</strong> Defusion does not aim to make thoughts go away, feel more comfortable, or become more positive. The goal is to reduce the automatic, unquestioned influence of thoughts on behavior. A thought that is defused can still be distressing, but it no longer dictates action.</p>
<p><strong>Common technique:</strong> "I am having the thought that…" — inserting this prefix before a problematic thought (e.g., "I am having the thought that I am a failure") creates cognitive distance without disputing the thought's content. The Leaves on a Stream visualization is another widely-used defusion practice.</p>`
            },
            {
              title: 'Contact with the Present Moment',
              content: `<p><strong>Definition:</strong> The deliberate, flexible deployment of attention to current experience — internal and external — with openness, curiosity, and non-evaluation.</p>
<p><strong>Opposite:</strong> Temporal rigidity — habitual dwelling in past-oriented rumination or future-oriented worry at the expense of present-moment awareness and flexible responding.</p>
<p><strong>Key clinical point:</strong> Present-moment awareness is both a standalone practice and the foundation for all other ACT processes. Clients cannot notice when they are fused with thoughts or engaging in avoidance if they are not attending to present-moment experience. Many ACT sessions begin with a brief mindfulness exercise that anchors the client in present-moment contact before moving to other work.</p>
<p><strong>Common technique:</strong> Five-senses grounding exercises, the Body Scan, and informal mindfulness practices embedded in the client's daily routine. ACT does not require a formal meditation practice; present-moment awareness can be cultivated through any activity done with deliberate attention.</p>`
            },
            {
              title: 'Self-as-Context (The Observing Self)',
              content: `<p><strong>Definition:</strong> The experience of oneself as a stable, consistent perspective-taking center — the "I" that has thoughts and feelings but is not equivalent to any particular thought or feeling, story, or role.</p>
<p><strong>Opposite:</strong> Over-identification with the conceptualized self — fusion with a story about who one is that rigidly limits behavioral possibilities (e.g., "I am my depression," "I am a trauma survivor," "I am not the kind of person who can do that").</p>
<p><strong>Key clinical point:</strong> Self-as-context is particularly important for clients with significant trauma history, personality pathology, or severe depression, all of which tend to produce rigid, totalizing self-narratives. When a client can observe their experience from the position of the observing self, they gain a stable vantage point from which even very painful content can be held without being overwhelmed.</p>
<p><strong>Common technique:</strong> The Chessboard Metaphor, perspective-taking exercises ("What were you aware of before you started being aware of that thought?"), and the Observer Exercise — a guided meditation that walks the client through noticing the continuity of the observing perspective across changing experiences.</p>`
            },
            {
              title: 'Values and Committed Action',
              content: `<p><strong>Values definition:</strong> Freely chosen, verbally constructed qualities of ongoing action that give life meaning and direction — not goals, outcomes, or moral injunctions, but the "how" and "why" that orient behavior across time and context.</p>
<p><strong>Committed Action definition:</strong> The development of broader, more flexible patterns of behavior in the service of chosen values, including making and keeping commitments, building behavioral momentum, and working through barriers.</p>
<p><strong>Key clinical point:</strong> Values work is not about helping clients identify what they "should" value or what others value. It is about clarifying what genuinely matters to the individual — what gives their life meaning from the inside. When values are clear, clients often show increased willingness to accept difficult experience, because they can see what the difficulty is in service of. Committed action in ACT is not about perfection; setbacks are expected and are met with compassion and renewed commitment rather than self-criticism.</p>
<p><strong>Common technique:</strong> The Valued Living Questionnaire, the "Tombstone" or "Eulogy" exercises (what do you want people to say about you?), and the Ski Slope metaphor for committed action (values are the direction downhill; committed action is keeping moving even when you fall).</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The ACT Hexaflex: Visualizing Psychological Flexibility',
          content: `<p>The hexaflex diagram is the central visual representation of ACT's theoretical model. At the heart of the hexagon sits psychological flexibility — the ultimate goal of ACT treatment. The six processes radiating outward form three complementary pairs that together constitute the capacity for flexible, values-driven living. The open (acceptance) processes on the left side of the model — Acceptance and Defusion — work together to change the relationship to private experience. The centered (aware) processes at the top and bottom — Contact with the Present Moment and Self-as-Context — work together to establish a stable, flexible observing stance. The engaged (action) processes on the right — Values and Committed Action — translate psychological flexibility into meaningful behavioral change.</p>

<p>Clinicians often find it helpful to think of the hexaflex as a diagnostic map as well as a treatment map. When a client presents with difficulties, it is possible to locate those difficulties on the hexaflex and identify which processes are most implicated. A client dominated by worry and mental time-travel may need significant work in present-moment awareness. A client with a rigid "I am broken" self-narrative may need extended work with self-as-context. A client who is clear about what they value but struggles to take action may need committed action work. This diagnostic use of the hexaflex prevents the common error of applying ACT techniques in a rote, non-individualized way.</p>`,
          image: '',
          imageAlt: 'The ACT Hexaflex diagram showing psychological flexibility at the center surrounded by six core processes: Acceptance, Defusion, Contact with the Present Moment, Self-as-Context, Values, and Committed Action arranged in a hexagonal pattern with arrows indicating their interconnection',
          imagePosition: 'right'
        },
        {
          type: 'multipleChoice',
          question: 'According to Relational Frame Theory, why do fear and avoidance generalize so rapidly in anxiety disorders, beyond what direct conditioning alone would predict?',
          options: [
            { text: 'The amygdala creates hardwired pathways that connect all related stimuli directly through neurological association', isCorrect: false },
            { text: 'Verbal and relational framing allows the psychological functions of stimuli to transfer through arbitrary networks of relations constructed by language', isCorrect: true },
            { text: 'Classical conditioning automatically produces second-order conditioning that extends to all associated neutral stimuli', isCorrect: false },
            { text: 'Clients learn avoidance behaviors by observing others react fearfully to related situations', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'RFT proposes that human language involves learned, bidirectional, arbitrary relational framing. Once a feared stimulus is embedded in a relational network through language (e.g., any stimulus related to highways), other members of that network can acquire similar fear-eliciting functions without direct conditioning. This is why avoidance networks expand far beyond direct conditioning, and why simply challenging thought content often fails — the rebuttal itself can join the fear network.'
        },
        {
          type: 'text',
          content: `<p>Understanding experiential avoidance is arguably the most important conceptual shift for clinicians coming to ACT from cognitive-behavioral or psychodynamic traditions. In most established approaches, the natural clinical response to client avoidance is to gently encourage greater approach — to help clients tolerate what they have been avoiding. ACT shares this orientation, but deepens it considerably by asking a prior question: what is the client trying to not feel, and how has the attempt to not feel it been working? This "workability" question is central to the ACT approach and reflects its underlying philosophy of functional contextualism, which evaluates all behaviors — including avoidance — by their consequences in context rather than by their form or by abstract criteria of rationality.</p>

<p>The workability question reframes the clinical conversation in a way that clients often find surprisingly non-confrontational. Rather than arguing that the client's coping strategies are maladaptive, irrational, or problematic, the ACT clinician invites the client to evaluate those strategies on their own terms: "Has this worked? Has worrying about it made the uncertainty go away? Has avoiding the situation made you feel permanently safer, or has it made the situation feel more threatening?" This empirical, curious stance avoids the adversarial dynamic that can arise when a clinician directly challenges a client's defenses, and it draws on the client's own experience as the data source for the assessment.</p>

<p>The creative hopelessness intervention — a classic ACT strategy used early in treatment — takes this workability inquiry further. The clinician systematically explores all the strategies the client has tried to get rid of or reduce their distress, validating the effort and intelligence that went into those strategies while helping the client recognize that they have not produced the relief that was hoped for. The goal is not to demoralize the client but to create an opening for a genuinely different approach. If the strategies they have been trying haven't worked — not because they did them wrong, but because the approach itself is fundamentally limited — perhaps there is a different way of relating to suffering that is worth exploring. This opening is the entry point for acceptance work.</p>

<p>Clinicians sometimes confuse creative hopelessness with pessimism or with undermining the client's coping. The distinction is crucial: creative hopelessness targets the unworkable agenda (eliminate internal distress), not the client's competence or character. It explicitly acknowledges that the client's avoidance strategies made complete sense given the problem as they understood it — control and eliminate unwanted experience — while opening space for questioning whether that is actually the right problem to be solving. The "right problem," in ACT's view, is not how to feel better but how to live better, including how to live well in the presence of the difficult thoughts and feelings that are an inescapable part of human existence.</p>

<p>This reorientation from symptom reduction to valued living is the philosophical heart of ACT and the source of both its power and the resistance it sometimes provokes. Clients who have organized their lives around reducing anxiety or avoiding depression may find it disorienting — even threatening — to hear that the goal of therapy is not to eliminate those experiences. Clinicians need to hold this stance with considerable warmth and flexibility, making clear that ACT does not demand that clients embrace suffering for its own sake, but that it offers a route to a life in which suffering loses its power to dictate behavior. The suffering may or may not decrease; what changes is its grip.</p>`
        },
        {
          type: 'flashcardDeck',
          title: 'ACT Hexaflex: Core Concepts and Clinical Definitions',
          flashcards: [
            {
              front: 'What is psychological flexibility in ACT?',
              back: 'The ability to contact the present moment fully and without unnecessary defense, as a conscious human being, and to change or persist in behavior when doing so serves chosen values. It is the overarching goal of ACT treatment.'
            },
            {
              front: 'What is cognitive fusion?',
              back: 'The tendency to become entangled with the literal content of thoughts, treating them as direct representations of reality, commands to be obeyed, or threats requiring immediate response. Fusion reduces behavioral flexibility by making thought content the primary determinant of action.'
            },
            {
              front: 'What distinguishes experiential avoidance from ordinary avoidance?',
              back: 'Experiential avoidance is defined by its function: the behavior is maintained by reduction of unwanted private experience (thoughts, feelings, sensations). Any behavior — including cognitive strategies like rumination or planning — that functions to reduce contact with unwanted inner experience counts as experiential avoidance, regardless of its topography.'
            },
            {
              front: 'What is the "workability" question in ACT?',
              back: 'A functional evaluation question that asks: "Is this behavior serving you? Is it moving you toward the life you want, or away from it?" Workability is assessed in context and over time — a strategy may reduce distress momentarily while being deeply unworkable in terms of the client\'s long-term functioning and valued living.'
            },
            {
              front: 'What is Self-as-Context, and how does it differ from self-esteem work?',
              back: 'Self-as-context (the Observing Self) is the experience of oneself as a stable perspective-taking center that is not equivalent to any thought, feeling, story, or role. Unlike self-esteem work, it does not try to replace negative self-narratives with positive ones — it helps clients discover that they are the observer of the content, not the content itself.'
            },
            {
              front: 'What is creative hopelessness, and when is it used?',
              back: 'An early ACT intervention that systematically explores the client\'s history of attempts to eliminate or reduce distress, helping them recognize that the "control the internal experience" agenda has not produced lasting relief. Its goal is to open space for a different approach (acceptance and values-based living), not to demoralize the client.'
            },
            {
              front: 'How does RFT explain why thought suppression often backfires?',
              back: 'RFT proposes that thoughts and the effort to suppress them exist in the same relational network. Attempting to suppress a thought strengthens the relational connection between the thought and the suppression effort, increasing the thought\'s salience. This is consistent with Wegner\'s ironic process theory (the "white bear" effect).'
            },
            {
              front: 'What is the difference between the three process pairs of the hexaflex?',
              back: 'Open processes (Acceptance + Defusion) change the relationship to private experience. Centered processes (Present Moment + Self-as-Context) establish a flexible observing stance toward self and time. Engaged processes (Values + Committed Action) translate psychological flexibility into meaningful behavioral change.'
            }
          ]
        },
        {
          type: 'multiSelect',
          question: 'Which of the following accurately describe the relationship between the six ACT processes? (Select all that apply)',
          options: [
            { text: 'The six processes are mutually reinforcing — work on any one process tends to support progress in the others', isCorrect: true },
            { text: 'The processes are designed to be delivered in a fixed sequence, with acceptance always taught before defusion', isCorrect: false },
            { text: 'Clarity about values often increases a client\'s willingness to accept difficult experience, because they can see what the difficulty is in service of', isCorrect: true },
            { text: 'Present-moment awareness supports defusion by shifting attention from thought content to the process of thinking', isCorrect: true },
            { text: 'Self-as-context work is only relevant for clients with trauma history or personality disorders', isCorrect: false }
          ],
          explanation: 'The six ACT processes are not stages in a sequence — they are interdependent facets of a unified capacity called psychological flexibility. Work on any process tends to support the others: values clarity increases acceptance willingness; present-moment awareness supports defusion; defusion makes self-as-context work more accessible. Self-as-context is relevant for any client who is fused with a limiting self-narrative, regardless of diagnosis.'
        },
        {
          type: 'reflection',
          question: 'Think about a client you are currently working with who struggles with a pattern of avoidance. Using the hexaflex as a diagnostic map, which of the six processes seem most implicated in maintaining that pattern? What would it look like to address that process clinically, and what barriers — in the client or in yourself as a clinician — might arise?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 1',
          takeaways: [
            'Relational Frame Theory explains how human language allows psychological suffering to generalize rapidly through networks of arbitrary relations — and why targeting thought content alone is often insufficient.',
            'The ACT hexaflex maps six mutually reinforcing processes — Acceptance, Defusion, Present Moment, Self-as-Context, Values, Committed Action — whose convergence produces psychological flexibility.',
            'Experiential avoidance (the attempt to eliminate or reduce unwanted private experience) is ACT\'s transdiagnostic account of the common factor in most psychopathology; its costs are assessed through the "workability" question.',
            'Creative hopelessness is an early-treatment intervention that targets the unworkable "control your inner experience" agenda, creating space for a fundamentally different approach to suffering.',
            'The hexaflex functions as both a treatment map and a diagnostic tool — locating a client\'s difficulties on the hexaflex guides which processes to prioritize in treatment.'
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 2 — ACT IN CLINICAL PRACTICE
    // ─────────────────────────────────────────────────────────────
    {
      title: 'ACT in Clinical Practice: Techniques, Applications, and Common Clinician Challenges',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: 2,
          title: 'Section 2: ACT in Clinical Practice',
          subtitle: 'Defusion and acceptance techniques, values clarification, committed action, evidence-based applications for anxiety, depression, and chronic pain, and common clinician errors in ACT delivery.'
        },
        {
          type: 'text',
          content: `<p>Moving from the theoretical architecture of the ACT hexaflex to actual clinical practice requires a translation that is not always straightforward. ACT techniques can appear deceptively simple — repeating a word until it sounds meaningless, inviting a client to imagine their thoughts as leaves on a stream, asking "what do you want your life to be about?" — and clinicians who encounter these techniques without understanding their theoretical grounding sometimes implement them in ways that are technically correct but functionally inert. The difference between an ACT technique that catalyzes real change and one that falls flat often lies not in the technique itself but in the spirit in which it is delivered: ACT is conducted from a stance of compassionate empiricism, collaborative inquiry, and genuine curiosity about the client's inner life, not from a position of instructing the client to feel or think differently.</p>

<p>Defusion techniques are typically the most clinically visible element of ACT, and they come in a wide variety of forms. The unifying principle across all defusion techniques is that they work by changing the context in which thoughts are held — adding distance, perspective, or flexibility to the relationship between the client and their mental content. Language-based defusion techniques include adding the prefix "I am having the thought that…" before troubling cognitions; thanking the mind ("Thank you, Mind, for the thought that I'll fail"); naming the process ("There goes my inner critic"); or singing a feared thought to the tune of Happy Birthday. Each of these techniques shifts the thought from being something the client is (fused with) to something the client has (observes from a distance). The goal is not to make the thought seem less true or feel less distressing, but to create a perceptual separation between the observer and the observed.</p>

<p>Mindfulness-based techniques serve both defusion and present-moment contact functions in ACT. The Leaves on a Stream exercise, for example, asks clients to sit quietly and imagine a gently flowing stream with leaves on the surface. As thoughts arise — any thought, including thoughts about the exercise itself — the client practices placing each thought on a leaf and watching it float downstream. The exercise is not about emptying the mind (a common misunderstanding) but about practicing the stance of observing thoughts as passing events rather than realities to engage. When a client reports that the stream "stops" during the exercise, this is typically a moment of fusion — the client has been grabbed by a thought and pulled off the observer bank and into the stream. Gently noting this and returning to the observer stance is the practice.</p>

<p>Acceptance and willingness exercises often use the metaphor of "opening up" to difficult experience rather than "coping with" it. The clinician might invite the client to locate where in their body a particular feeling lives, to notice its qualities (size, shape, texture, temperature) with curiosity rather than evaluation, and to practice breathing into it or around it — not to make it go away but to allow it to be there without fighting it. This body-oriented acceptance work can be particularly powerful for clients with high levels of anxiety or somatic complaints, because it moves acceptance from an intellectual understanding ("I know I should accept my anxiety") to a lived, embodied experience. The shift from "I must reduce this feeling" to "I can have this feeling and still move" is often experienced as genuinely revelatory when it occurs in session.</p>

<p>Values clarification is the ACT process that most consistently surprises clients with its emotional weight. Many clients, particularly those who have been organized around symptom management or avoidance for years, have lost touch with what genuinely matters to them. Values clarification exercises help them recover or discover this. The Valued Living Questionnaire asks clients to rate the importance and their current activity level across ten domains (family relationships, intimate relationships, parenting, friendships, work, education, recreation, spirituality, community, health). The discrepancy between importance and current activity in each domain is often a direct product of experiential avoidance: the client values connection but avoids social situations to avoid anxiety; they value career achievement but avoid pursuing opportunities to avoid the possibility of failure.</p>

<p>The Eulogy exercise is a powerful values clarification tool that invites clients to imagine their own memorial service and ask what they would want the people in attendance to say about them — not about their accomplishments, but about the kind of person they were, the way they showed up in relationships, what they stood for. This exercise consistently bypasses the intellectualized responses that clients often give when asked directly about their values, and accesses something deeper: the client's genuine sense of what a meaningful life looks like for them. Clinicians should approach the Eulogy exercise with warmth and unhurried attention, and should follow it with exploration rather than immediately pivoting to goals or action planning. The emotional material the exercise surfaces is itself clinically rich.</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Values Are Not Goals: A Clinically Critical Distinction',
          content: `<p>One of the most practically important distinctions in the ACT framework — and one that clients most commonly confuse — is the difference between values and goals. ACT defines values as chosen qualities of ongoing action: the "how" and "why" that give direction to behavior across time. Values are never achieved or completed; they are the direction one travels, not the destination. Goals, by contrast, are specific, achievable outcomes that exist along the path of valued living — they can be completed, checked off, and replaced by new goals.</p>

<p>Consider a client who identifies "being a good parent" as important to them. "Being a good parent" is a value — an ongoing direction that can be expressed through countless actions across many years, never fully achieved and never finished. A goal in service of that value might be "attend my child's soccer games this season" or "put my phone away during dinner." The goal can be accomplished; the value is what generates new goals once old ones are met.</p>

<p>This distinction matters clinically for several reasons. First, values provide a source of direction and meaning that is immune to the contingencies that make goal-pursuit vulnerable to experiential avoidance. A client can avoid pursuing a goal to avoid the anxiety of possible failure; they cannot "complete" a value and therefore cannot avoid it in the same way — they can only live it more or less fully. Second, when a client fails to achieve a goal, the value that generated it remains intact and can generate a new goal. This reframes setbacks not as failures of character but as opportunities for values-consistent recommitment.</p>

<p>Third, and perhaps most importantly, goals without underlying values are behavioral shells: they can be pursued and achieved while producing little sense of meaning, because the "why" is missing. ACT consistently finds that when clients act from values rather than from goals alone, their motivation is more robust, their behavior is more flexible, and their subjective experience of living is more meaningful — even in the presence of significant difficulty.</p>

<p><strong>Clinical technique:</strong> When a client states a goal (e.g., "I want to get a promotion"), ask "And if you got that promotion, what would that open up for you? What would it mean?" This recursive questioning typically reveals the underlying value (competence, contribution, financial security for family) and shifts the focus from outcome to direction.</p>`
        },
        {
          type: 'text',
          content: `<p>The empirical literature supporting ACT has grown substantially since the early 2000s, with randomized controlled trials across a diverse range of clinical presentations. ACT has demonstrated efficacy for anxiety disorders including generalized anxiety disorder, social anxiety disorder, and panic disorder, with effect sizes comparable to traditional CBT and with particular advantages in reducing experiential avoidance as a transdiagnostic mechanism. For depression, ACT has shown efficacy both as a primary treatment and as a component of stepped-care models, with studies demonstrating that ACT works partly by reducing rumination and cognitive fusion with depressive content rather than by modifying depressive cognition content.</p>

<p>One of ACT's most robust evidence bases is in chronic pain management, where its transdiagnostic mechanisms are particularly well-suited to the problem. Chronic pain is uniquely positioned to illustrate the costs of experiential avoidance: pain itself cannot be made to go away through psychological intervention, but the catastrophizing, avoidance, and behavioral withdrawal that typically accompany it can be substantially reduced. ACT for chronic pain focuses on increasing pain acceptance (willingness to have pain as a feature of one's experience rather than a problem requiring solution), reducing pain-related cognitive fusion (catastrophic thoughts about pain's implications), and re-engaging with values-consistent activity that the client has abandoned in the service of pain avoidance. Studies consistently show that ACT for chronic pain improves functioning, quality of life, and subjective wellbeing even when pain intensity itself does not decrease.</p>

<p>ACT has also shown promise in substance use disorder treatment, where experiential avoidance is a clearly operative mechanism — clients use substances, at least in part, to avoid or reduce difficult inner experience. ACT-based treatment for substance use addresses this directly: rather than focusing primarily on coping skills for cravings, it works to reduce the fusion and avoidance that make cravings overwhelming, to clarify values that substance use is working against, and to build committed action toward those values as an alternative motivational structure. Several RCTs support ACT's efficacy for alcohol use disorder, cannabis use disorder, and polysubstance use, and some evidence suggests ACT may be particularly effective for clients with high experiential avoidance as a baseline characteristic.</p>

<p>Committed action in clinical ACT is often less philosophically vivid than values work but is equally important. Committed action involves helping clients identify specific behavioral steps in the service of their values, make explicit commitments to those steps, and build behavioral momentum through successful engagement — even with small, manageable actions. ACT explicitly expects that committed action will sometimes fail: the client will make a commitment and then not keep it, will be derailed by avoidance, or will encounter barriers that were not anticipated. The response to these setbacks in ACT is not to problem-solve more aggressively or to challenge the client's motivation; it is to approach the setback with compassion and curiosity, notice what got in the way (typically fusion or avoidance), and return to the values that generated the commitment in the first place.</p>

<p>Behavioral flexibility — the ability to change or persist in behavior based on what the situation actually calls for — is the behavioral manifestation of psychological flexibility, and it is the ultimate clinical outcome ACT seeks to produce. A client who has developed genuine behavioral flexibility can choose to engage with a difficult feeling rather than avoid it when avoidance would cost them something important; can act consistently with their values even when their thoughts are telling them they can't; and can adjust their behavior based on the actual consequences that show up rather than the anticipated consequences that their minds generate. This flexibility is what distinguishes a psychologically healthy person from someone whose behavioral repertoire has been narrowed by avoidance: not the absence of difficult thoughts and feelings, but the ability to move in the presence of them.</p>`
        },
        {
          type: 'accordion',
          title: 'Common Clinician Errors in ACT Delivery',
          accordionItems: [
            {
              title: 'Error 1: Using ACT Techniques as Distress Reduction Tools',
              content: `<p>Perhaps the most common clinician error in ACT is implementing defusion and acceptance techniques with an implicit goal of symptom reduction — teaching the client to defuse from anxious thoughts in order to feel less anxious, or practicing acceptance in order to make feelings pass more quickly. When techniques are deployed with this agenda, they function as sophisticated avoidance: the client is "accepting" in order to get rid of the experience, which is structurally identical to suppression.</p>
<p>The correct stance is to use techniques in service of increasing behavioral flexibility and values-consistent action, regardless of what happens to the level of distress. If a defusion technique reduces anxiety as a side effect, that is fine — but it cannot be the explicit goal of the intervention without corrupting the ACT model. Clinicians should regularly examine their own motivations: am I offering this exercise because I am uncomfortable watching the client suffer, or because it genuinely serves the client's valued living?</p>`
            },
            {
              title: 'Error 2: Pushing Acceptance Too Hard or Too Fast',
              content: `<p>Acceptance in ACT is a choice that must be genuinely autonomous — it cannot be successfully coerced or argued into being. Clinicians who enthusiastically instruct clients to "just accept it" or who reframe every resistance to acceptance as avoidance are making a category error: they are treating acceptance as a technique to be applied rather than as a posture that emerges from genuine contact with the costs of avoidance and the availability of valued alternatives.</p>
<p>Creative hopelessness work takes time and must be done thoroughly before the door to acceptance is opened. If a client has not yet had the genuine experience of recognizing that their control strategies haven't worked, pushing acceptance will feel like invalidation: "You're just telling me to give up." The clinician's role is to hold the space open, not to push the client through it. When resistance to acceptance arises, the appropriate response is curiosity: "What does it feel like to consider just letting that be there?"</p>`
            },
            {
              title: 'Error 3: Fusion with Client Outcomes',
              content: `<p>Clinician fusion with treatment outcomes — becoming invested in whether the client "gets it," makes progress, or starts feeling better — is one of the most insidious errors in ACT delivery, precisely because it is so understandable. When clinicians are fused with their clients' outcomes, they begin making choices based on their own discomfort with the client's pain rather than based on what genuinely serves the client's values-based living.</p>
<p>ACT supervisors often observe that clinician fusion with outcomes produces premature pivoting to problem-solving, reassurance-giving, or technique-delivering when what the moment calls for is simply being present with the client's experience. The antidote is for the clinician to practice the same psychological flexibility they are trying to cultivate in the client: to notice their own fusion, their own discomfort with the client's suffering, and to choose their clinical actions from values (the client's wellbeing and growth) rather than from their own experiential avoidance.</p>`
            },
            {
              title: 'Error 4: Treating Values Clarification as Goal Setting',
              content: `<p>Values clarification exercises are often inadvertently transformed into goal-setting exercises when clinicians move too quickly from "What matters to you?" to "What are you going to do about it?" This transition, while natural from a behavioral activation perspective, can short-circuit the depth of the values work if done prematurely.</p>
<p>True values work requires dwelling in the domain of meaning — what kind of person do you want to be, what do you want to stand for, what gives your life weight and significance — before moving to the behavioral level of action planning. When clinicians rush to goals, clients often select goals that look values-consistent but are actually driven by avoidance (e.g., "I want to be less anxious so I can be a better parent" — anxiety reduction as the implicit driver, rather than the relationship with the child). Slowing down and returning to the question of what genuinely matters, at the level of the person rather than the outcome, is almost always time well spent.</p>`
            },
            {
              title: 'Error 5: Delivering Metaphors Without Experiential Grounding',
              content: `<p>ACT uses metaphor extensively and for good theoretical reasons: metaphors shift the context of experience and can produce defusion effects that direct verbal instruction cannot. But metaphors delivered too quickly, too abstractly, or without connection to the client's actual experience often produce intellectual agreement without genuine impact: "Yes, that's a nice image" followed by no change in the client's relationship to their experience.</p>
<p>Effective ACT metaphor use requires several conditions: the metaphor should be introduced after the relevant experiential context has been established; the clinician should invite the client to inhabit the metaphor rather than simply understand it; and the clinician should check whether the metaphor is actually landing ("What does that feel like to notice? Does the image connect to what you've been experiencing?"). A metaphor that evokes "yes, and…" is more valuable than one that evokes "I guess so." When a metaphor doesn't land, therapists should drop it without attachment and try a different one — or, better, invite the client to generate their own.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'ACT Across Presenting Problems: A Transdiagnostic Model in Action',
          content: `<p>One of ACT's distinctive features is its ability to address a wide range of presenting problems through the same theoretical lens and overlapping clinical processes. Rather than maintaining separate treatment protocols for each disorder, ACT applies the hexaflex framework transdiagnostically — identifying which psychological inflexibility processes are most operative in a given client's presentation and tailoring intervention accordingly.</p>

<p>For anxiety presentations, defusion and acceptance are typically the most salient processes: the client is fused with threat-related cognitions and engaged in extensive experiential avoidance of anxiety itself. For depression, self-as-context and values work are often most important: the client is deeply fused with a conceptualized self ("I am worthless, broken, a burden") and has lost contact with what genuinely matters to them. For chronic pain, acceptance and committed action are central: the client's pain cannot be eliminated, but their relationship to it and their willingness to engage in values-consistent activity despite it can be transformed. This diagnostic flexibility is a genuine strength of the ACT model and reduces the training burden for clinicians who work with diverse client populations.</p>`,
          image: '',
          imageAlt: 'A clinical diagram showing three presenting problems — anxiety, depression, and chronic pain — mapped to different ACT hexaflex processes, with arrows indicating which processes are most salient for each presentation and how the transdiagnostic framework applies across different clinical contexts',
          imagePosition: 'left'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are accurate statements about ACT\'s evidence base and clinical applications? (Select all that apply)',
          options: [
            { text: 'ACT has demonstrated efficacy for anxiety disorders, with particular advantages in reducing experiential avoidance as a transdiagnostic mechanism', isCorrect: true },
            { text: 'ACT for chronic pain focuses primarily on teaching clients to manage and reduce pain intensity through psychological techniques', isCorrect: false },
            { text: 'ACT\'s evidence base for substance use disorder includes addressing experiential avoidance as a primary driver of substance use behavior', isCorrect: true },
            { text: 'ACT for depression works partly by reducing rumination and cognitive fusion with depressive content, rather than by modifying the content of depressive cognitions', isCorrect: true },
            { text: 'ACT requires clients to achieve a high level of mindfulness skill before values clarification and committed action work can begin', isCorrect: false }
          ],
          explanation: 'ACT for chronic pain improves functioning and quality of life primarily by increasing pain acceptance and re-engaging values-consistent activity, not by reducing pain intensity itself. ACT does not require sequential mastery of processes — all six hexaflex processes can be worked simultaneously and are interrelated. The other three statements accurately reflect ACT\'s evidence base: its transdiagnostic mechanisms in anxiety, its addressing of experiential avoidance in substance use, and its mechanism of action in depression via reduced rumination and fusion rather than changed thought content.'
        },
        {
          type: 'sequencing',
          instructions: 'Place the following steps of an ACT values clarification and committed action sequence in their correct clinical order, from earliest to latest in the therapeutic process.',
          steps: [
            { text: 'Conduct creative hopelessness work: explore the client\'s history of attempts to eliminate distress and whether those strategies have produced lasting relief', order: 1 },
            { text: 'Introduce the distinction between experiential avoidance and psychological flexibility; establish the therapeutic metaphor framework', order: 2 },
            { text: 'Use the Valued Living Questionnaire or the Eulogy exercise to help the client identify what genuinely matters to them across life domains', order: 3 },
            { text: 'Distinguish values from goals: help the client see that their values are ongoing directions, not achievable endpoints', order: 4 },
            { text: 'Identify specific committed actions in service of clarified values, including barriers (fusion or avoidance) that might arise', order: 5 },
            { text: 'Review setbacks with compassion and curiosity, reconnect with underlying values, and generate new committed action steps', order: 6 }
          ],
          explanation: 'Effective ACT delivery follows a rough clinical arc: establishing the unworkability of control strategies (creative hopelessness) before introducing alternative frameworks; building the conceptual foundation before conducting values work; and moving from values clarification to goal-setting to committed action and the iterative process of addressing setbacks. This sequence is not rigid — ACT is not manualized in the same way as some CBT protocols — but this arc reflects the theoretical logic of the model.'
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each ACT technique or exercise to the primary hexaflex process it is designed to cultivate.',
          matchingPairs: [
            { term: 'Leaves on a Stream visualization', definition: 'Defusion — practicing the observer stance toward thoughts as passing mental events' },
            { term: 'The Eulogy exercise', definition: 'Values clarification — identifying what genuinely matters at the level of the person rather than the outcome' },
            { term: 'Chessboard metaphor', definition: 'Self-as-context — discovering a stable observing perspective that is not equivalent to any thought, feeling, or self-narrative' },
            { term: 'Body scan with curious attention to difficult feelings', definition: 'Acceptance — moving from "I must eliminate this feeling" to "I can have this feeling and still move"' },
            { term: 'Five-senses grounding practice', definition: 'Contact with the present moment — deploying flexible attention to current experience rather than past or future' },
            { term: 'Identifying specific behavioral steps and making explicit commitments', definition: 'Committed action — building broader patterns of behavior in service of chosen values despite barriers' }
          ]
        },
        {
          type: 'reflection',
          question: 'Consider your own relationship to the values/goals distinction in your clinical work. When you think about what you want your practice to stand for — not the credentials you hope to earn or the outcomes you hope to achieve, but the qualities you want to bring to every clinical encounter — what comes up? How does this reflection connect to the ACT framework you\'ve been studying, and what does it suggest about where you might want to develop as a clinician?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 2',
          takeaways: [
            'Defusion techniques work by changing the context in which thoughts are held — adding perceptual distance between the observer and the thought — rather than by challenging the thought\'s content or making it feel less distressing.',
            'Acceptance is an active, embodied posture of willingness to have difficult experience, not a passive tolerance or resignation; it is most powerfully cultivated through experiential exercises rather than intellectual instruction.',
            'Values are ongoing directions, not achievable endpoints; the clinically critical distinction between values and goals allows committed action to persist through setbacks and reframes failures as opportunities for recommitment.',
            'ACT\'s transdiagnostic model applies the hexaflex framework across presentations by identifying which psychological inflexibility processes are most operative and tailoring intervention accordingly.',
            'Common clinician errors — including using ACT techniques as distress reduction tools, pushing acceptance prematurely, and becoming fused with client outcomes — all share the feature of allowing the clinician\'s own experiential avoidance to drive clinical decision-making.',
            'The spirit of ACT delivery — compassionate empiricism, collaborative inquiry, and genuine present-moment contact with the client — is as important as technical adherence to the model\'s techniques and structures.'
          ]
        },
        {
          type: 'resources',
          title: 'Clinical Resources and Further Reading',
          resources: [
            {
              title: 'Association for Contextual Behavioral Science (ACBS)',
              url: 'https://contextualscience.org',
              type: 'website',
              description: 'The professional home of ACT and RFT research and practice. Includes a searchable database of ACT-relevant research, clinician training resources, therapist finder, and access to validated ACT measures including the Acceptance and Action Questionnaire (AAQ-II).'
            },
            {
              title: 'ACT Advisor: Free Clinical Support App',
              url: 'https://contextualscience.org/act_advisor',
              type: 'website',
              description: 'A free web-based tool from ACBS that helps clinicians identify which ACT processes to target based on client presentation, with links to relevant techniques and measures for each process.'
            },
            {
              title: 'Contextual Change: ACT Worksheets and Clinical Tools',
              url: 'https://www.actmindfully.com.au/free-stuff/free-worksheets-handouts/',
              type: 'website',
              description: 'Free ACT worksheets and clinical handouts from Russ Harris, author of The Happiness Trap and ACT Made Simple. Includes the Valued Living Questionnaire, defusion worksheets, and committed action planning tools suitable for client use.'
            },
            {
              title: 'The Happiness Trap Online — Russ Harris',
              url: 'https://thehappinesstrap.com',
              type: 'website',
              description: 'The companion website to Russ Harris\'s widely-used ACT self-help book, which many clinicians recommend to clients as between-session reading. Includes video explanations of core ACT concepts suitable for client psychoeducation.'
            },
            {
              title: 'ACT for Anxiety Disorders: Protocol and Clinical Guide',
              url: 'https://www.newharbinger.com/9781572244269/acceptance-and-commitment-therapy-for-anxiety-disorders/',
              type: 'website',
              description: 'New Harbinger\'s ACT protocol for anxiety disorders, authored by Georg Eifert and John Forsyth. A session-by-session clinical guide with detailed protocols for generalized anxiety, panic disorder, social anxiety, and specific phobia.'
            },
            {
              title: 'ACBS World Conference Recordings — Continuing Education',
              url: 'https://contextualscience.org/world_conference',
              type: 'website',
              description: 'Annual ACBS World Conference presentations, many available for free or at low cost. Includes workshops by leading ACT researchers and clinicians covering advanced clinical applications, RFT, and specialized populations.'
            },
            {
              title: 'Acceptance and Commitment Therapy: The Process and Practice of Mindful Change (2nd Ed.) — Hayes, Strosahl, Wilson',
              url: 'https://www.guilford.com/books/Acceptance-and-Commitment-Therapy/Hayes-Strosahl-Wilson/9781462528943',
              type: 'website',
              description: 'The definitive clinical and theoretical text on ACT, authored by the primary developers of the model. Essential reading for any clinician who intends to practice ACT with fidelity. The second edition includes updated coverage of the evidence base and expanded clinical guidance.'
            },
            {
              title: 'Psychological Flexibility Scale and ACT Measures Repository',
              url: 'https://contextualscience.org/state_of_the_act_evidence',
              type: 'website',
              description: 'ACBS repository of validated ACT-relevant assessment measures, including the AAQ-II (experiential avoidance), CFQ (cognitive fusion), VLQ (valued living), and CPAQ (chronic pain acceptance). All measures are freely available for clinical use.'
            }
          ]
        }
      ]
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // ASSESSMENT
  // ─────────────────────────────────────────────────────────────
  assessment: {
    passingScore: 75,
    questions: [
      {
        question: 'Relational Frame Theory (RFT) proposes that human language involves which type of learned relational responding that has particular relevance for understanding the generalization of fear networks?',
        options: [
          { text: 'Unidirectional, physical-property-determined stimulus equivalence', isCorrect: false },
          { text: 'Bidirectional, arbitrary relational framing that allows psychological functions to transfer through networks of relations', isCorrect: true },
          { text: 'Hierarchical stimulus control governed by evolutionary preparedness', isCorrect: false },
          { text: 'Associative conditioning through contiguous pairing of neutral and unconditioned stimuli', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'RFT proposes that human language involves learned, bidirectional, arbitrary relational framing — relating events to one another in ways not determined by their physical properties. This explains why fear and avoidance generalize far beyond what direct conditioning would predict: any stimulus related to a feared event through language can acquire similar fear-eliciting functions.'
      },
      {
        question: 'In the ACT model, psychological flexibility is best defined as:',
        options: [
          { text: 'The ability to consistently reduce distress levels through the use of evidence-based coping strategies', isCorrect: false },
          { text: 'The absence of cognitive distortions and irrational beliefs that interfere with adaptive functioning', isCorrect: false },
          { text: 'The ability to contact the present moment fully as a conscious human being, and to change or persist in behavior when doing so serves chosen values', isCorrect: true },
          { text: 'The capacity to regulate emotions effectively through cognitive reappraisal and suppression techniques', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Psychological flexibility is ACT\'s central goal: the ability to contact the present moment fully, as a conscious human being, and to change or persist in behavior when doing so serves valued ends. It is not defined by the absence of distress or the presence of specific coping strategies, but by the relationship between inner experience and behavior in the service of values.'
      },
      {
        question: 'Which of the following most accurately describes experiential avoidance as ACT defines it?',
        options: [
          { text: 'The behavioral tendency to avoid specific external situations associated with feared stimuli', isCorrect: false },
          { text: 'Any pattern of behavior whose function is to reduce, escape from, or suppress unwanted private experiences, regardless of the behavior\'s topography', isCorrect: true },
          { text: 'The cognitive strategy of redirecting attention away from distressing thoughts toward neutral content', isCorrect: false },
          { text: 'A personality trait characterized by high neuroticism and low emotional tolerance', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Experiential avoidance is defined by its function, not its form. Any behavior — including cognitive strategies like rumination, worry, planning, or suppression — counts as experiential avoidance if its function is to reduce contact with unwanted private experience. This functional definition is essential for accurate clinical assessment and distinguishes ACT\'s account from behavioral descriptions focused on topography.'
      },
      {
        question: 'The three process pairs of the ACT hexaflex can be organized into which functional groupings?',
        options: [
          { text: 'Past-oriented, present-oriented, and future-oriented processes', isCorrect: false },
          { text: 'Cognitive, emotional, and behavioral processes', isCorrect: false },
          { text: 'Open processes (Acceptance + Defusion), Centered processes (Present Moment + Self-as-Context), and Engaged processes (Values + Committed Action)', isCorrect: true },
          { text: 'Awareness, regulation, and action processes', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The ACT hexaflex organizes its six processes into three functional pairs: Open processes (Acceptance and Defusion) change the relationship to private experience; Centered processes (Present Moment and Self-as-Context) establish a flexible observing stance; and Engaged processes (Values and Committed Action) translate psychological flexibility into meaningful behavioral change.'
      },
      {
        question: 'Creative hopelessness in ACT is an intervention designed to:',
        options: [
          { text: 'Help clients accept that their condition is permanent and cannot be improved through psychological intervention', isCorrect: false },
          { text: 'Challenge the client\'s cognitive distortions about the hopelessness of their situation using Socratic questioning', isCorrect: false },
          { text: 'Explore the unworkability of the "control and eliminate internal experience" agenda, creating openness to a fundamentally different approach', isCorrect: true },
          { text: 'Motivate clients by highlighting the gap between their current functioning and their desired outcomes', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Creative hopelessness targets the agenda of controlling internal experience — not the client\'s capabilities or the treatability of their condition. By systematically exploring the history of control strategies and their ultimate unworkability, the intervention creates genuine openness to acceptance and values-based living as an alternative orientation. It is not pessimistic but rather preparatory for a different kind of hope.'
      },
      {
        question: 'Cognitive defusion techniques in ACT work primarily by:',
        options: [
          { text: 'Replacing distorted cognitions with more accurate, balanced, or positive alternative thoughts', isCorrect: false },
          { text: 'Changing the context in which thoughts are held so they are experienced as passing mental events rather than literal truths', isCorrect: true },
          { text: 'Reducing the frequency of intrusive thoughts through systematic exposure and habituation', isCorrect: false },
          { text: 'Strengthening the client\'s rational analysis capacity to evaluate the evidence for and against distressing beliefs', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Defusion works by changing the context of thought rather than the content. Techniques like "I am having the thought that…" or the Leaves on a Stream visualization create perceptual distance between the observer and the thought, reducing the thought\'s automatic influence on behavior. Defusion does not aim to make thoughts feel less distressing or disappear — it aims to change the client\'s functional relationship to their thought processes.'
      },
      {
        question: 'In ACT, Self-as-Context is distinguished from self-esteem enhancement approaches primarily because:',
        options: [
          { text: 'It targets the frequency of self-critical thoughts rather than their content or accuracy', isCorrect: false },
          { text: 'It helps clients discover a stable, perspective-taking self that is not equivalent to any thought, feeling, or self-narrative, rather than replacing negative stories with positive ones', isCorrect: true },
          { text: 'It focuses on identifying the early childhood experiences that created a fragile sense of self', isCorrect: false },
          { text: 'It uses cognitive restructuring to build a more positive self-concept through evidence-gathering', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Self-as-context helps clients discover that they are the observer of mental content — not the content itself. Unlike self-esteem work, it does not try to replace negative self-narratives with positive ones, because this leaves the underlying fusion with the story intact. The Observing Self is a stable perspective that can hold any content — positive or negative — without being defined or threatened by it.'
      },
      {
        question: 'Which of the following accurately describes why ACT\'s approach to values differs fundamentally from goal-setting?',
        options: [
          { text: 'Values are imposed by cultural and social expectations, while goals are self-generated by the individual client', isCorrect: false },
          { text: 'Values are achievable outcomes that motivate behavior, while goals are the internal qualities that orient the direction of that behavior', isCorrect: false },
          { text: 'Values are freely chosen ongoing directions of action that can never be completed, while goals are specific achievable outcomes that serve as steps along those directions', isCorrect: true },
          { text: 'Values apply only to long-term life planning, while goals address immediate session-level behavioral targets', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'In ACT, values are ongoing directions — they cannot be achieved, completed, or checked off. Goals are specific outcomes that can be accomplished in service of a value. This distinction is clinically important because values provide a source of direction that is immune to the contingencies of goal achievement, reframe setbacks as opportunities for re-commitment, and generate intrinsic motivation that is more robust than outcome-based motivation alone.'
      },
      {
        question: 'For which of the following presenting problems has ACT demonstrated particularly strong evidence, partly because the model\'s transdiagnostic mechanisms are especially well-aligned with the clinical problem?',
        options: [
          { text: 'Bipolar disorder type I, where ACT\'s acceptance processes help manage manic episodes', isCorrect: false },
          { text: 'Chronic pain, where acceptance of pain and values-consistent re-engagement with activity improve functioning even without reduction in pain intensity', isCorrect: true },
          { text: 'Psychotic disorders, where defusion techniques effectively reduce the intensity of hallucinations and delusions', isCorrect: false },
          { text: 'Acute grief, where ACT\'s non-pathologizing stance reduces the duration of the grief process', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Chronic pain is among ACT\'s most robust evidence bases because the model\'s transdiagnostic mechanisms align exceptionally well with the problem: pain cannot be eliminated psychologically, but pain acceptance, reduced catastrophizing and avoidance, and re-engagement with values-consistent activity can substantially improve quality of life and functioning even when pain intensity is unchanged. This reflects ACT\'s core shift from symptom reduction to values-based living.'
      },
      {
        question: 'When a clinician uses ACT defusion and acceptance techniques with the implicit goal of helping the client feel less anxious, they are committing which error?',
        options: [
          { text: 'Using CBT techniques inappropriately within an ACT framework', isCorrect: false },
          { text: 'Implementing ACT techniques as sophisticated avoidance, corrupting the model by using acceptance in service of a control agenda', isCorrect: true },
          { text: 'Moving too quickly to committed action before adequate defusion work has occurred', isCorrect: false },
          { text: 'Applying ACT to a presenting problem for which it has no evidence base', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Using ACT techniques to reduce distress replicates the same control-and-eliminate agenda that ACT targets as the source of psychological inflexibility. The correct use of defusion and acceptance techniques is in service of increasing behavioral flexibility and values-consistent action — not symptom reduction. When symptoms decrease as a side effect, that is acceptable, but it cannot be the explicit goal without structurally corrupting the ACT model.'
      },
      {
        question: 'The "Passengers on the Bus" metaphor in ACT is most directly designed to cultivate which process?',
        options: [
          { text: 'Values clarification — helping the client identify the destination they want to drive toward', isCorrect: false },
          { text: 'Acceptance — illustrating that the client can keep moving toward valued ends while allowing difficult thoughts and feelings to be present without fighting them', isCorrect: true },
          { text: 'Self-as-context — helping the client identify with the bus (stable self) rather than the passengers (thoughts and feelings)', isCorrect: false },
          { text: 'Committed action — establishing that the client is responsible for driving the bus toward their chosen goals', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The Passengers on the Bus metaphor primarily targets acceptance: the client is the driver; difficult thoughts and feelings are passengers who may demand, argue, and threaten, but they do not actually operate the bus. The client can allow the passengers to be there without engaging in ongoing battles to expel them, and can keep driving toward their valued destination. While values and self-as-context elements are present in the metaphor, acceptance and willingness are its primary targets.'
      },
      {
        question: 'Which of the following is an accurate statement about the relationship between the six ACT processes?',
        options: [
          { text: 'The processes are hierarchically ordered, with acceptance being a prerequisite for all other processes', isCorrect: false },
          { text: 'The processes are independent and target separate psychological functions; each must be addressed in isolation for maximal effect', isCorrect: false },
          { text: 'The processes are mutually reinforcing facets of a unified capacity; work on any one process tends to support and facilitate the others', isCorrect: true },
          { text: 'The open processes (acceptance and defusion) must be fully established before the engaged processes (values and committed action) can be introduced', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The six ACT processes are interdependent — they are not stages or independent modules. Work on any process tends to support the others: values clarity increases acceptance willingness; present-moment awareness supports defusion; self-as-context work makes acceptance more accessible; and committed action generates present-moment contact opportunities. This interdependence means that ACT can be entered at any process and the work will naturally expand to encompass the others.'
      },
      {
        question: 'What is the primary mechanism by which ACT is proposed to work for depression, according to the empirical literature?',
        options: [
          { text: 'By increasing behavioral activation and pleasant activity scheduling in the context of the five-factor model', isCorrect: false },
          { text: 'By challenging and modifying the content of depressive cognitions, replacing negative thoughts with more realistic alternatives', isCorrect: false },
          { text: 'By reducing rumination and cognitive fusion with depressive content, increasing contact with the present moment and values-consistent action', isCorrect: true },
          { text: 'By processing the unresolved grief and loss experiences that underlie depressive episodes', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'ACT for depression works primarily by reducing rumination (a form of experiential avoidance and fusion) and cognitive fusion with depressive content — not by modifying the content of depressive thoughts. Research consistently shows that ACT\'s mechanisms of change in depression include reduced experiential avoidance, increased psychological flexibility, and re-engagement with values-consistent activity, rather than changes in the accuracy or frequency of negative cognitions.'
      },
      {
        question: 'When a client reports that the Leaves on a Stream exercise "stopped" because they were grabbed by a thought and pulled in, what is the most clinically appropriate ACT response?',
        options: [
          { text: 'Suggest that the client try a different mindfulness technique better suited to their level of distress', isCorrect: false },
          { text: 'Note that this experience illustrates fusion in action, gently guide the client back to the observer stance, and treat it as practice material rather than failure', isCorrect: true },
          { text: 'Explore the content of the thought that interrupted the exercise to assess for underlying schema or core belief', isCorrect: false },
          { text: 'Extend the exercise duration to give the client more practice before processing the interruption', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'When the stream "stops" in the Leaves on a Stream exercise, the client has been fused — grabbed by a thought and pulled from the observer stance into the content of experience. This is not a failure; it is the practice. The clinically appropriate response is to note this with curiosity and warmth, identify it as an example of fusion in action, and gently guide the client back to the observer stance. The interruption is itself clinical material that illustrates why defusion practice matters.'
      },
      {
        question: 'The "workability" question in ACT evaluates client behaviors according to which criterion?',
        options: [
          { text: 'Whether the behavior is consistent with DSM diagnostic criteria for adaptive functioning', isCorrect: false },
          { text: 'Whether the behavior produces immediate relief from distressing emotions and physiological arousal', isCorrect: false },
          { text: 'Whether the behavior, over time and in context, serves the client\'s valued living and enables movement toward what matters', isCorrect: true },
          { text: 'Whether the behavior is consistent with the client\'s stated goals for treatment as documented in the treatment plan', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The workability question reflects ACT\'s underlying philosophy of functional contextualism: behaviors are evaluated not by their form, rationality, or diagnostic classification, but by their consequences in context over time. A behavior is "workable" if it moves the client toward valued living; it is "unworkable" if it produces short-term relief at the cost of long-term functioning, behavioral narrowing, or distance from what genuinely matters.'
      },
      {
        question: 'Which of the following accurately describes the role of committed action in ACT when clients experience setbacks or fail to keep commitments?',
        options: [
          { text: 'Setbacks indicate that the client has not yet completed sufficient acceptance and defusion work, and the clinician should return to earlier processes before reattempting committed action', isCorrect: false },
          { text: 'Setbacks are expected, met with compassion and curiosity, explored for the fusion or avoidance that arose as a barrier, and met with recommitment grounded in underlying values', isCorrect: true },
          { text: 'Setbacks require problem-solving to identify the practical barriers that prevented follow-through and develop more achievable action steps', isCorrect: false },
          { text: 'Setbacks should be minimized in ACT treatment by only making small, highly achievable commitments that the client is unlikely to break', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'ACT explicitly expects committed action to involve setbacks — not because clients are poorly motivated, but because the barriers to valued living (fusion and avoidance) are persistent features of human psychology. The correct ACT response to a setback is compassion (self-compassion for the client, communicated by the clinician\'s stance), curiosity about what got in the way, and renewed recommitment to the underlying values that generated the commitment in the first place.'
      },
      {
        question: 'A clinician who notices they are increasingly uncomfortable watching a client sit with distress and begins offering solutions, reassurance, or quick technique delivery is most likely engaging in which clinician-level error in ACT delivery?',
        options: [
          { text: 'Insufficient grounding in the ACT protocol, leading to technique selection errors', isCorrect: false },
          { text: 'Premature values clarification before adequate defusion work has been established', isCorrect: false },
          { text: 'Clinician fusion with client outcomes — allowing the clinician\'s own experiential avoidance to drive clinical decision-making', isCorrect: true },
          { text: 'Boundary violations resulting from excessive therapist self-disclosure about their own relationship to suffering', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'When clinicians become fused with their clients\' distress levels and use clinical interventions to reduce their own discomfort with the client\'s pain, they are engaging in clinician-level experiential avoidance — precisely the process ACT targets in clients. The antidote is for the clinician to practice the same psychological flexibility they are cultivating in clients: noticing their own fusion and avoidance, and choosing clinical actions from values (the client\'s growth and wellbeing) rather than from their own discomfort.'
      },
      {
        question: 'Which assessment tool is most commonly used in ACT to measure experiential avoidance as a treatment outcome variable and is freely available through the ACBS?',
        options: [
          { text: 'The Beck Anxiety Inventory (BAI)', isCorrect: false },
          { text: 'The Acceptance and Action Questionnaire-II (AAQ-II)', isCorrect: true },
          { text: 'The Cognitive Fusion Questionnaire (CFQ-7)', isCorrect: false },
          { text: 'The Valued Living Questionnaire (VLQ)', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The Acceptance and Action Questionnaire-II (AAQ-II) is the most widely used measure of experiential avoidance and psychological flexibility in ACT research and clinical practice. It is available for free through the ACBS measures repository and has been validated across multiple populations and clinical presentations. While the CFQ-7 measures cognitive fusion specifically and the VLQ assesses values engagement, the AAQ-II is the primary transdiagnostic process measure for ACT treatment evaluation.'
      },
      {
        question: 'ACT\'s transdiagnostic model holds that diverse presentations (anxiety, depression, substance use, chronic pain) share which common process as a key factor in the development and maintenance of psychopathology?',
        options: [
          { text: 'Dysregulation of the HPA axis leading to elevated cortisol and compromised executive functioning', isCorrect: false },
          { text: 'Insecure attachment patterns that create vulnerability to emotional dysregulation in interpersonal contexts', isCorrect: false },
          { text: 'Psychological inflexibility — the narrowing of behavioral repertoires through experiential avoidance and cognitive fusion', isCorrect: true },
          { text: 'Distorted automatic thoughts whose content varies by diagnosis but whose pattern is maintained by negative reinforcement', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'ACT proposes psychological inflexibility — the narrowing of behavioral repertoires through experiential avoidance and cognitive fusion — as the common transdiagnostic process underlying most forms of psychopathology. This theoretical claim drives ACT\'s transdiagnostic efficacy: addressing psychological flexibility mechanisms helps across presentations without requiring entirely different interventions for each diagnosis, representing a significant clinical efficiency and a theoretically parsimonious account of human suffering.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // REFERENCES
  // ─────────────────────────────────────────────────────────────
  references: [
    {
      authors: 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G.',
      year: '2012',
      title: 'Acceptance and commitment therapy: The process and practice of mindful change (2nd ed.)',
      source: 'Guilford Press'
    },
    {
      authors: 'Hayes, S. C., Wilson, K. G., Gifford, E. V., Follette, V. M., & Strosahl, K.',
      year: '1996',
      title: 'Experiential avoidance and behavioral disorders: A functional dimensional approach to diagnosis and treatment',
      source: 'Journal of Consulting and Clinical Psychology, 64(6), 1152–1168',
      doi: 'https://doi.org/10.1037/0022-006X.64.6.1152'
    },
    {
      authors: 'Luoma, J. B., Hayes, S. C., & Walser, R. D.',
      year: '2017',
      title: 'Learning ACT: An acceptance and commitment therapy skills-training manual for therapists (2nd ed.)',
      source: 'Context Press'
    },
    {
      authors: 'A-Tjak, J. G. L., Davis, M. L., Morina, N., Powers, M. B., Smits, J. A. J., & Emmelkamp, P. M. G.',
      year: '2015',
      title: 'A meta-analysis of the efficacy of acceptance and commitment therapy for clinically relevant mental and physical health problems',
      source: 'Psychotherapy and Psychosomatics, 84(1), 30–36',
      doi: 'https://doi.org/10.1159/000365764'
    },
    {
      authors: 'Twohig, M. P., & Levin, M. E.',
      year: '2017',
      title: 'Acceptance and commitment therapy as a treatment for anxiety and depression: A review',
      source: 'Psychiatric Clinics of North America, 40(4), 751–770',
      doi: 'https://doi.org/10.1016/j.psc.2017.08.009'
    },
    {
      authors: 'Hayes, S. C., Luoma, J. B., Bond, F. W., Masuda, A., & Lillis, J.',
      year: '2006',
      title: 'Acceptance and commitment therapy: Model, processes and outcomes',
      source: 'Behaviour Research and Therapy, 44(1), 1–25',
      doi: 'https://doi.org/10.1016/j.brat.2005.06.006'
    },
    {
      authors: 'Vowles, K. E., & McCracken, L. M.',
      year: '2008',
      title: 'Acceptance and values-based action in chronic pain: A study of treatment effectiveness and process',
      source: 'Journal of Consulting and Clinical Psychology, 76(3), 397–407',
      doi: 'https://doi.org/10.1037/0022-006X.76.3.397'
    },
    {
      authors: 'McCracken, L. M., Vowles, K. E., & Eccleston, C.',
      year: '2004',
      title: 'Acceptance of chronic pain: Component analysis and a revised assessment method',
      source: 'Pain, 107(1–2), 159–166',
      doi: 'https://doi.org/10.1016/j.pain.2003.10.012'
    },
    {
      authors: 'Ruiz, F. J.',
      year: '2012',
      title: 'Acceptance and commitment therapy versus traditional cognitive behavioral therapy: A systematic review and meta-analysis of current empirical evidence',
      source: 'International Journal of Psychology and Psychological Therapy, 12(3), 333–358'
    },
    {
      authors: 'Bond, F. W., Hayes, S. C., Baer, R. A., Carpenter, K. M., Guenole, N., Orcutt, H. K., Waltz, T., & Zettle, R. D.',
      year: '2011',
      title: 'Preliminary psychometric properties of the Acceptance and Action Questionnaire–II: A revised measure of psychological inflexibility and experiential avoidance',
      source: 'Behavior Therapy, 42(4), 676–688',
      doi: 'https://doi.org/10.1016/j.beth.2011.03.007'
    },
    {
      authors: 'Levin, M. E., Hildebrandt, M. J., Lillis, J., & Hayes, S. C.',
      year: '2012',
      title: 'The impact of treatment components suggested by psychological flexibility theory: A meta-analysis of laboratory-based component studies',
      source: 'Behavior Therapy, 43(4), 741–756',
      doi: 'https://doi.org/10.1016/j.beth.2012.05.003'
    },
    {
      authors: 'Wegner, D. M., Schneider, D. J., Carter, S. R., & White, T. L.',
      year: '1987',
      title: 'Paradoxical effects of thought suppression',
      source: 'Journal of Personality and Social Psychology, 53(1), 5–13',
      doi: 'https://doi.org/10.1037/0022-3514.53.1.5'
    },
    {
      authors: 'Hayes, S. C., Barnes-Holmes, D., & Roche, B. (Eds.)',
      year: '2001',
      title: 'Relational frame theory: A post-Skinnerian account of human language and cognition',
      source: 'Kluwer Academic/Plenum Publishers'
    },
    {
      authors: 'Gifford, E. V., Kohlenberg, B. S., Hayes, S. C., Antonuccio, D. O., Piasecki, M. M., Rasmussen-Hall, M. L., & Palm, K. M.',
      year: '2004',
      title: 'Acceptance-based treatment for smoking cessation',
      source: 'Behavior Therapy, 35(4), 689–705',
      doi: 'https://doi.org/10.1016/S0005-7894(04)80015-7'
    },
    {
      authors: 'Flaxman, P. E., & Bond, F. W.',
      year: '2010',
      title: 'A randomised worksite comparison of acceptance and commitment therapy and stress inoculation training',
      source: 'Behaviour Research and Therapy, 48(8), 816–820',
      doi: 'https://doi.org/10.1016/j.brat.2010.05.004'
    },
    {
      authors: 'Harris, R.',
      year: '2009',
      title: 'ACT made simple: An easy-to-read primer on acceptance and commitment therapy',
      source: 'New Harbinger Publications'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // RESOURCES
  // ─────────────────────────────────────────────────────────────
  resources: [
    {
      title: 'Association for Contextual Behavioral Science (ACBS) — ACT Resources',
      url: 'https://contextualscience.org',
      type: 'website',
      description: 'The primary professional organization for ACT and RFT research. Includes free validated measures (AAQ-II, CFQ, VLQ, CPAQ), therapist training resources, research database, and the annual World Conference on ACT.'
    },
    {
      title: 'ACT Made Simple — Free Worksheets by Russ Harris',
      url: 'https://www.actmindfully.com.au/free-stuff/free-worksheets-handouts/',
      type: 'website',
      description: 'Comprehensive collection of free ACT clinical worksheets including the Valued Living Questionnaire, defusion worksheets, committed action planning tools, and acceptance exercises suitable for client use between sessions.'
    },
    {
      title: 'ACBS State of the ACT Evidence — Research Summary',
      url: 'https://contextualscience.org/state_of_the_act_evidence',
      type: 'website',
      description: 'Up-to-date summary of ACT randomized controlled trials organized by clinical population and presentation. Essential resource for clinicians who wish to cite evidence when obtaining training supervision hours or implementing ACT in structured settings.'
    },
    {
      title: 'The Happiness Trap — ACT Self-Help for Clients',
      url: 'https://thehappinesstrap.com',
      type: 'website',
      description: 'Russ Harris\'s widely recommended ACT-based self-help resource, with video explanations of core concepts suitable for client psychoeducation. Many ACT clinicians recommend this as a between-session resource for clients beginning ACT treatment.'
    },
    {
      title: 'ACT for Anxiety Disorders — New Harbinger Clinical Guide',
      url: 'https://www.newharbinger.com/9781572244269/acceptance-and-commitment-therapy-for-anxiety-disorders/',
      type: 'website',
      description: 'Eifert and Forsyth\'s session-by-session ACT protocol for anxiety disorders. Includes protocols for GAD, panic disorder, social anxiety, and specific phobia with detailed session guides and client handouts.'
    },
    {
      title: 'ACBS Therapist Training Resources',
      url: 'https://contextualscience.org/act_training_opportunities',
      type: 'website',
      description: 'Directory of ACT training workshops, intensives, and peer consultation opportunities. Includes information on Peer-Reviewed ACT Trainer status for clinicians seeking advanced training recognition.'
    },
    {
      title: 'ACTProfessional — Online ACT Training',
      url: 'https://actprofessional.com',
      type: 'website',
      description: 'Online training platform with structured ACT learning paths for clinicians at all levels, from foundational training to advanced applications in specific populations including trauma, chronic pain, and substance use.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION & WORD COUNT
// ─────────────────────────────────────────────────────────────────────────────
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
