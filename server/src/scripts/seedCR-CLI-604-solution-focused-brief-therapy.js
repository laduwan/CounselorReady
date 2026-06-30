import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = 'cr-cli-604-solution-focused-brief-therapy';

const COURSE = {
  title: 'Solution-Focused Brief Therapy in Community Mental Health',
  slug: SLUG,
  courseCode: 'CR-CLI-604',
  description: 'This course provides licensed mental health professionals with a practical foundation in Solution-Focused Brief Therapy (SFBT), one of the most widely researched and implemented brief therapy models in community mental health settings. Clinicians will learn core SFBT techniques, the theoretical framework underpinning strengths-based practice, and strategies for adapting SFBT to complex, high-demand caseloads.',
  shortDescription: 'Master Solution-Focused Brief Therapy techniques for community mental health — goals, exceptions, scaling questions, and the miracle question.',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  prerequisites: 'Basic counseling skills; familiarity with cognitive-behavioral frameworks helpful but not required.',
  learningObjectives: [
    'Describe the theoretical roots and core assumptions of Solution-Focused Brief Therapy',
    'Apply SFBT techniques including the miracle question, scaling questions, exception-finding, and compliments',
    'Formulate well-formed goals using SFBT principles in community mental health contexts',
    'Identify client strengths and resources to amplify solution-building',
    'Adapt SFBT for high-caseload settings, involuntary clients, and co-occurring presentations',
    'Distinguish SFBT from problem-focused approaches and integrate it ethically into practice'
  ],
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
      title: 'Introduction: The Solution-Focused Shift',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Welcome to Solution-Focused Brief Therapy',
          subtitle: 'From problem exploration to solution construction'
        },
        {
          type: 'text',
          content: `<h2>Why SFBT Matters in Community Mental Health</h2>
<p>Community mental health settings face persistent challenges: high caseloads, limited session availability, diverse client presentations, and mounting pressure to demonstrate measurable outcomes. In this environment, therapists need approaches that produce meaningful change efficiently — without sacrificing clinical depth or therapeutic alliance.</p>
<p>Solution-Focused Brief Therapy (SFBT) was developed precisely for contexts like these. Born in the 1970s and 1980s at the Brief Family Therapy Center in Milwaukee, SFBT offered a radical departure from dominant problem-focused paradigms. Rather than exploring the origins, maintenance, and function of symptoms, SFBT therapists ask: <em>What is already working? What does the client want instead? How can we amplify what's going well?</em></p>
<p>The evidence base for SFBT has grown substantially over four decades. Meta-analyses consistently demonstrate moderate-to-large effect sizes across depression, anxiety, substance use, relationship distress, and child/adolescent behavioral concerns. Importantly, these outcomes are achieved in fewer sessions — an average of 3–5 — making SFBT a compelling fit for time-limited services, managed care contexts, and community mental health.</p>
<p>This course provides practical, applicable training in SFBT core techniques, theoretical foundations, and implementation strategies. We focus especially on real-world adaptation: how do you use SFBT with mandated clients, complex presentations, or when your clients have never been asked what they want?</p>`
        },
        {
          type: 'text',
          content: `<h2>Historical Context: Where SFBT Came From</h2>
<p>Steve de Shazer, Insoo Kim Berg, and their colleagues at the Brief Family Therapy Center developed SFBT through direct observation of what actually helped clients change. They noticed that therapists spent enormous time exploring problems — their history, their meaning, their function — while clients spent comparatively little time imagining or planning for life without the problem.</p>
<p>Their observation: clients who described times when the problem was absent or less severe, and who elaborated on what they were doing differently in those moments, tended to progress faster. This insight became the cornerstone of SFBT: <em>exceptions to problems are the seeds of solutions.</em></p>
<p>SFBT was also shaped by the social constructionist turn in psychotherapy. Language, the model argues, does not merely describe reality — it constitutes it. When therapists ask problem-saturated questions ("When did this start? What makes it worse?"), they co-construct a problem-focused identity with the client. When therapists ask solution-focused questions ("What's a little bit better? When do you feel even slightly more like yourself?"), they begin co-constructing a different narrative — one in which the client has agency, resources, and a future.</p>
<p>This is not naive optimism. SFBT does not ignore client suffering or minimize the reality of mental health challenges. Rather, it strategically redirects attention toward the client's existing strengths, toward futures they desire, and toward the small, concrete steps that close the gap between where they are and where they want to be.</p>`
        },
        {
          type: 'text',
          content: `<h2>Core Assumptions of SFBT</h2>
<p>Understanding SFBT requires grasping its foundational assumptions, which differ markedly from most psychotherapy traditions:</p>
<p><strong>1. The client is the expert on their own life.</strong> SFBT therapists are curious, collaborative, and genuinely uncertain — they do not position themselves as knowing more about what the client needs than the client does. The therapist's expertise lies in facilitating solution construction, not in diagnosing or prescribing.</p>
<p><strong>2. Change is constant and inevitable.</strong> Nothing stays exactly the same. Problems fluctuate. SFBT helps clients notice and amplify naturally occurring positive fluctuations rather than treating the problem as a fixed, monolithic entity.</p>
<p><strong>3. If it's not broken, don't fix it.</strong> Clinicians should resist the urge to expand treatment scope unnecessarily. If a client has a well-functioning support system, stable employment, and healthy coping in one area, those don't need to become treatment targets.</p>
<p><strong>4. If something is working, do more of it.</strong> Amplify exceptions. Build on existing strengths. The client already knows things that work — help them identify and intentionally replicate those things.</p>
<p><strong>5. If something isn't working, do something different.</strong> SFBT therapists are flexible and pragmatic. If an approach isn't producing change, they don't persist — they pivot.</p>
<p><strong>6. Small changes lead to bigger changes.</strong> SFBT focuses on identifying the smallest possible step in the right direction. Even a 1-point movement on a 10-point scale represents meaningful progress and often has ripple effects across other areas.</p>
<p><strong>7. Problems are not pathology.</strong> SFBT avoids the implicit medicalization that frames client struggles as deficits or disorders to be corrected. Clients are viewed as competent people facing hard circumstances, not as broken people who need fixing.</p>`
        },
        {
          type: 'text',
          content: `<h2>Social Constructionism and the Language of Solutions</h2>
<p>To fully appreciate why SFBT works the way it does, clinicians need to understand the social constructionist philosophy that underpins it. Social constructionism, developed by theorists including Kenneth Gergen, Peter Berger, and Thomas Luckmann, holds that human beings do not simply discover reality — they actively construct it through language, relationship, and shared meaning-making. This is not idealism or denial; rather, it is a claim about how human experience is organized and communicated.</p>
<p>In the therapeutic context, social constructionism has a profound implication: the questions we ask shape the realities we help construct. A therapist who asks, "What symptoms have you been experiencing this week?" is co-constructing a world in which the client is a symptom-bearer. A therapist who asks, "What has been even a little bit better this week?" is co-constructing a world in which the client is a capable agent who experiences variation, progress, and possibility.</p>
<p>De Shazer was particularly influenced by the later work of philosopher Ludwig Wittgenstein, who argued that the meaning of language is determined by its use in social contexts — not by some fixed correspondence to an external reality. De Shazer applied this to therapy: if problems are constituted through problem-saturated language, they can equally be dissolved by shifting to solution-saturated language. The therapeutic conversation is not a neutral information-gathering exercise; it is a meaning-making process that either perpetuates the problem or opens pathways out of it.</p>
<p>This insight led de Shazer to coin the phrase "solution-determined system." He observed that when therapist and client together began organizing their conversation around solutions — exceptions, preferred futures, small improvements — a new kind of system emerged. The therapy system itself became solution-organized, and clients responded by discovering resources and possibilities they had not previously considered accessible. The system didn't just talk about solutions; it was organized by and toward solutions at every level.</p>
<p>For community mental health practitioners, this philosophical grounding has practical value. When a clinician understands that their language choices constitute — not merely reflect — the therapeutic reality, they become more intentional about every question they ask. "What brought you in today?" and "What would you like to be different?" are not equivalent questions. The first opens toward problem narration; the second opens toward desired change. Neither is wrong in every context, but the difference matters enormously for the kind of therapy that follows.</p>
<p><strong>Narrative and de-storying:</strong> SFBT overlaps significantly with narrative therapy in its attention to the stories clients tell about themselves. A client who has been describing themselves as "a depressed person" or "someone who never follows through" is narrating a problem-saturated identity. SFBT does not directly challenge this narrative — it offers a different kind of inquiry: "Tell me about a time you did follow through, even with something small. What was that like?" This exception-based inquiry begins to introduce alternative plotlines, alternative characterizations of the self, without confrontation or argument.</p>`
        },
        {
          type: 'text',
          content: `<h2>The Development of SFBT at the Brief Family Therapy Center</h2>
<p>The history of SFBT is inseparable from the history of the Brief Family Therapy Center (BFTC) in Milwaukee, Wisconsin, where de Shazer, Berg, and a rotating team of clinicians and researchers developed the model through the late 1970s and 1980s. Understanding how SFBT was developed — empirically, through direct observation of therapeutic sessions — helps clinicians appreciate why the model looks the way it does.</p>
<p>De Shazer and Berg came to Milwaukee with backgrounds in strategic family therapy (de Shazer had trained with John Weakland and the Mental Research Institute group in Palo Alto) and in Milton Erickson's hypnotherapeutic approach. The MRI group had already made an important contribution: they demonstrated that brief intervention could produce lasting change, and that understanding the etiology of a problem was not necessary to solving it. What was needed was to interrupt the "attempted solution" that was maintaining the problem — the client's habitual, ineffective response to the difficulty.</p>
<p>De Shazer took this premise further. He noticed that MRI's brief therapy still focused heavily on the problem: what maintains it, what keeps it in place, how to disrupt its patterns. Working at BFTC with one-way mirrors and team observation, he and his colleagues began systematically tracking not just what happened when the problem was present, but what happened when it was absent. They discovered that exceptions — times when the problem didn't occur or was less severe — were common but routinely ignored in both the client's own narrative and in therapists' assessment questions.</p>
<p>This shift — from studying what maintains problems to studying what precedes their absence — was the decisive theoretical move that created SFBT. The team began developing and testing questions specifically designed to elicit exception information. They noticed that when clients were asked detailed questions about what was different during exception periods, they often spontaneously began doing more of those things. The therapeutic conversation itself was producing change, without needing to identify causes, assign diagnoses, or complete elaborate treatment plans.</p>
<p>The miracle question emerged from this same empirical process. Team members began noticing that some clients, when asked to imagine life without the problem in specific, concrete terms, would begin to articulate goals with a clarity and behavioral specificity that made therapeutic progress easier to target. The question evolved through iteration — different phrasings, different contexts, different client populations — until de Shazer and Berg arrived at the formulation that remains largely unchanged in use today.</p>
<p>By the mid-1980s, BFTC had begun publishing outcome research on the model. Their data showed that across a wide range of presenting concerns, clients achieved meaningful improvement in an average of fewer than six sessions. These findings were striking in an era when most theoretical models assumed that change required months or years of intensive therapeutic work. SFBT offered an empirically grounded alternative that was both theoretically coherent and practically efficient.</p>
<p>Insoo Kim Berg's contributions to the model deserve particular attention. While de Shazer provided much of the theoretical architecture, Berg's genius was clinical — she had an extraordinary ability to implement the stance of genuine curiosity and "not knowing" in ways that clients experienced as profoundly respectful. Her work with families, with substance users, with involuntary clients, and with children demonstrated the model's flexibility across populations that many clinicians assumed required more directive, confrontational approaches. Berg's influence on how SFBT is actually practiced — warm, collaborative, genuinely curious — is as important as the written theory.</p>`
        },
        {
          type: 'text',
          content: `<h2>The Evidence Base for SFBT</h2>
<p>SFBT has accumulated a substantial evidence base over four decades, making it one of the more empirically supported brief psychotherapy models. Clinicians working in managed care environments, evidence-based practice settings, or accredited programs need to understand what the research shows and where the evidence is stronger versus more limited.</p>
<p><strong>Meta-analytic findings:</strong> A landmark meta-analysis by Kim (2008) examined 22 controlled outcome studies and found an overall effect size of 0.13 to 0.26 (depending on the comparison condition), with SFBT outperforming control conditions across a range of presenting concerns. A more recent systematic review by Gingerich and Peterson (2013) examined 43 controlled studies and classified the evidence as "moderately positive," noting that methodological quality varied considerably across studies but that SFBT consistently outperformed no-treatment controls and performed comparably to established treatments in head-to-head comparisons.</p>
<p><strong>Depression and anxiety:</strong> Multiple RCTs have demonstrated SFBT's effectiveness for depressive disorders. Particularly notable is a series of studies from Taiwan and South Korea examining SFBT with depressed adults in primary care settings, finding significant reductions in depressive symptoms maintained at follow-up. For anxiety disorders, the evidence is less extensive but includes positive outcomes for generalized anxiety, social anxiety, and panic in adult outpatient samples.</p>
<p><strong>Substance use disorders:</strong> Insoo Kim Berg's application of SFBT to substance use, developed with Scott Miller and documented in their 1992 text, generated substantial clinical interest. SFBT's non-confrontational, client-expert stance contrasted sharply with the confrontational approaches common in substance use treatment at the time. Research has since shown that SFBT-based motivational approaches produce comparable outcomes to more directive models with considerably less therapeutic resistance.</p>
<p><strong>Children and adolescents:</strong> SFBT's evidence base with young people is among its strongest. School-based SFBT has been studied extensively, with positive effects on academic performance, behavioral concerns, and social-emotional functioning. Murphy's work in school counseling and LaFountain and Garner's studies of group SFBT with adolescents demonstrate meaningful improvements in relatively few sessions, making the model well-suited to school counseling contexts where caseloads are high and session availability is limited.</p>
<p><strong>Family and relationship concerns:</strong> SFBT has a well-documented evidence base in couples and family contexts, reflecting its origins as a family therapy model. Studies show effectiveness for relationship satisfaction, communication, parenting stress, and family functioning in brief treatment windows.</p>
<p><strong>Community mental health contexts:</strong> Several studies have specifically examined SFBT in community mental health settings with high-complexity, diverse populations — precisely the context of this course. These studies consistently find that SFBT produces meaningful outcomes in fewer sessions than traditional outpatient approaches, reduces treatment dropout (partly due to the collaborative, client-expert stance), and is feasible to implement even under high caseload conditions.</p>
<p><strong>Where evidence is more limited:</strong> SFBT has weaker evidence for severe trauma with active PTSD (as a standalone model), for active psychosis, and for severe personality disorders requiring long-term relational repair. Clinicians should understand these limitations and consider SFBT as one tool in an integrated approach rather than a universal solution.</p>`
        },
        {
          type: 'text',
          content: `<h2>SFBT Compared to Other Brief Therapy Models</h2>
<p>Community mental health practitioners are often trained in multiple brief therapy approaches and need to know when SFBT is the best choice versus when an alternative model is indicated. Understanding SFBT in relation to comparable approaches clarifies its distinctive contribution.</p>
<p><strong>SFBT vs. Problem-Solving Therapy (PST):</strong> PST, developed by D'Zurilla and Goldfried, also aims to improve client functioning efficiently. However, PST focuses on enhancing the client's ability to identify and solve problems through a structured, skills-based approach. SFBT explicitly avoids problem analysis — it is not about helping clients become better problem-solvers, but about helping them recognize that they already have solutions. PST is more directive and structured; SFBT is more collaborative and exploratory. PST tends to be better suited for clients who respond well to structured skill-building; SFBT may be more effective with clients who resist being taught or instructed.</p>
<p><strong>SFBT vs. Motivational Interviewing (MI):</strong> MI, developed by Miller and Rollnick, shares SFBT's non-confrontational, client-expert stance and collaborative spirit. Both models elicit client language about change rather than imposing it. The key difference is focus: MI is specifically designed to address ambivalence and enhance motivation for change, making it ideal for pre-contemplation and contemplation stages. SFBT assumes a readiness to construct solutions and works best when some degree of motivation exists. The two models are highly compatible in sequence — MI can address ambivalence and prepare a client, while SFBT then builds solutions. Many community mental health clinicians integrate both fluidly.</p>
<p><strong>SFBT vs. Cognitive-Behavioral Therapy (CBT):</strong> CBT and SFBT share a present and future orientation and a relatively brief treatment frame, but their mechanisms differ substantially. CBT focuses on identifying and modifying maladaptive cognitions and behaviors through structured techniques including cognitive restructuring, behavioral activation, and exposure. SFBT does not directly target cognitions; it focuses on constructing preferred futures and amplifying exceptions. CBT requires homework and structured practice; SFBT's between-session tasks are typically observation-based rather than skill-practice-based. For clients who respond well to structure and psychoeducation, CBT may be preferred; for clients who feel pathologized or over-managed by structured protocols, SFBT's collaborative stance may generate better engagement.</p>
<p><strong>SFBT vs. Acceptance and Commitment Therapy (ACT):</strong> ACT, like SFBT, is values-oriented and non-pathologizing. Both encourage clients to clarify what matters and move toward it. ACT explicitly addresses the client's relationship to difficult internal experiences (thoughts, feelings, sensations) through acceptance, defusion, and mindfulness. SFBT is largely silent on internal experience — it redirects to observable behavior and preferred future. The two models can be integrated: ACT's values clarification and psychological flexibility work can complement SFBT's solution-building, particularly for clients whose avoidance of difficult internal states prevents them from taking action.</p>
<p><strong>When to choose SFBT:</strong> SFBT tends to be most indicated when: the client has identifiable strengths and coping capacities; when a brief treatment frame is needed or preferred; when the client has a clear (if vague) sense of wanting something different; when engagement with problem-focused approaches has been poor; or when cultural or personal values favor a collaborative, non-expert-driven approach. SFBT may be less indicated as a standalone model when trauma processing, psychoeducation, symptom management skills, or long-term relational repair are the primary clinical needs.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: SFBT Foundations',
          takeaways: [
            'SFBT was developed at the Brief Family Therapy Center by Steve de Shazer and Insoo Kim Berg in the 1970s–80s',
            'The model shifts focus from problem exploration to solution construction and strength amplification',
            'Meta-analyses show moderate-to-large effect sizes in 3–5 sessions — strong fit for community mental health',
            'Social constructionist roots: language co-constructs reality; solution-focused questions build different narratives',
            'Core assumption: exceptions to problems already exist — the clinician\'s job is to find and amplify them',
            'Small, concrete changes create ripple effects across multiple life domains'
          ]
        },
        {
          type: 'multipleChoice',
          question: 'Which statement best reflects a core assumption of Solution-Focused Brief Therapy?',
          options: [
            { text: 'Understanding the historical origins of a problem is essential to resolving it', isCorrect: false },
            { text: 'Exceptions to the problem already exist and can be amplified to build solutions', isCorrect: true },
            { text: 'The therapist must identify the root cause of symptoms before setting goals', isCorrect: false },
            { text: 'Pathological patterns require extended exploration before change is possible', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'SFBT is built on the principle that exceptions — times when the problem is absent or less severe — already exist in the client\'s life. Rather than exploring problem origins, SFBT therapists help clients identify, examine, and replicate these exceptions to build toward their desired future.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are core assumptions of SFBT? Select all that apply.',
          options: [
            { text: 'The client is the expert on their own life', isCorrect: true },
            { text: 'Change requires insight into unconscious processes', isCorrect: false },
            { text: 'Small changes lead to bigger changes', isCorrect: true },
            { text: 'If something is working, do more of it', isCorrect: true },
            { text: 'Problems must be thoroughly assessed before goal-setting begins', isCorrect: false }
          ],
          explanation: 'SFBT assumes clients are the experts, that small changes cascade into larger ones, and that amplifying what\'s already working is more efficient than extensive problem exploration. It deliberately minimizes problem analysis in favor of solution construction.'
        }
      ]
    },
    {
      title: 'Core SFBT Techniques and Application',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Core SFBT Techniques',
          subtitle: 'Miracle question, scaling, exceptions, and the therapeutic conversation'
        },
        {
          type: 'text',
          content: `<h2>The SFBT Therapeutic Stance</h2>
<p>Before exploring specific techniques, it's essential to understand the therapeutic stance that makes SFBT work. SFBT is not a set of techniques applied to a client — it is a way of being with a client. Without the underlying stance, the techniques become mechanical and lose their power.</p>
<p><strong>Not knowing:</strong> SFBT therapists adopt a posture of genuine curiosity and "not knowing." They ask questions to understand the client's unique experience rather than to confirm a hypothesis. When a client says they've been "depressed," an SFBT therapist doesn't fill in the meaning — they ask: "What does depressed look like for you? How do you know when you're more depressed versus less so?"</p>
<p><strong>Leading from one step behind:</strong> The therapist follows the client's lead, uses the client's language, and amplifies what the client identifies as important. The therapist doesn't introduce new goals or redirect toward clinically-determined priorities.</p>
<p><strong>Complimenting genuinely:</strong> SFBT uses compliments strategically — not as social lubrication, but as genuine recognition of client strengths, resilience, and accomplishments. "It sounds like even on the hardest days, you've been making sure your kids get to school. How have you done that?"</p>
<p><strong>Future orientation:</strong> SFBT keeps the therapeutic conversation anchored in the future the client desires. The past is consulted only to mine for exceptions and resources, not to explain or analyze.</p>`
        },
        {
          type: 'text',
          content: `<h2>The Miracle Question: Full Technique Guide</h2>
<p>The miracle question is SFBT's signature technique — and one of the most frequently misunderstood. It is not about wishful thinking or fantasy. It is a precision tool for helping clients construct a detailed, concrete, behavioral description of their preferred future. Properly deployed, it generates some of the most clinically useful information in the entire therapeutic process: what the client's life would actually look like if the problem were resolved.</p>
<p>The classic formulation, developed by de Shazer and Berg:</p>
<blockquote><em>"Suppose tonight, while you're sleeping, a miracle happens and the problem that brought you here is solved. But because you were asleep, you don't know the miracle happened. When you wake up tomorrow morning, what would be the first thing you'd notice that would tell you something was different?"</em></blockquote>
<p>The power of this question lies in what follows: the therapist pursues concrete, observable, behavioral detail. Not "I'd feel better" but "What would feeling better look like? What would you be doing differently? Who would notice first? What would they see?"</p>
<p><strong>Full scripted follow-up sequence for the miracle question:</strong></p>
<p>After the client gives an initial answer, the therapist uses a structured set of follow-up probes to build out the preferred-future picture in three dimensions: behavioral, relational, and affective.</p>
<p><em>Behavioral probes:</em> "What would you be doing differently in the morning? What time would you wake up? What would be the first thing you'd do after getting out of bed? Walk me through your day — what would be different at breakfast, at work, in the afternoon?"</p>
<p><em>Relational probes:</em> "Who would be the first person to notice that something was different about you? What would they notice? What would they say to you? How would you respond? What would your partner/parent/coworker see that was different? How would that affect them?"</p>
<p><em>Affective probes:</em> "How would you feel during this miracle day? What would that feeling be like in your body? When during the day would you feel it most strongly?"</p>
<p><em>Self-observation probes:</em> "When you noticed all these differences, what would that tell you about yourself? What would the miracle reveal about who you are when things are going well?"</p>
<p><strong>Handling "I don't know" responses:</strong> This is the most common challenge therapists face with the miracle question. Clients who are severely depressed, traumatized, or have been in problem-saturated lives for many years may genuinely struggle to access a preferred-future image. Several strategies are useful:</p>
<ul>
<li><em>Normalize and wait:</em> "Take your time. There's no rush. What's the very first thing — even something tiny — you might notice?"</li>
<li><em>Scale down the miracle:</em> "Maybe not a full miracle — but if things were even 10% better, what would that 10% look like?"</li>
<li><em>Use another person's perspective:</em> "What do you think your mom would notice that was different about you if things were a little better?"</li>
<li><em>Use past exceptions as a bridge:</em> "Think back to a time when things were going okay — not perfect, but okay. What was different then? What were you doing?"</li>
<li><em>Invite imagination explicitly:</em> "I know this might seem like an odd question. We're not trying to be realistic right now — just imagine. Even if it feels far away, what would you want to be different?"</li>
</ul>
<p><strong>Adaptations for community mental health populations:</strong> The standard miracle question doesn't always work with every client presentation. Alternative framings include:</p>
<ul>
<li><em>For clients with psychosis or concrete thinking:</em> "If things were going better in six months, what would be different about your typical day?"</li>
<li><em>For children:</em> "If you had a magic wand and you could change one thing about your life, what would it be? And what would be different after you used it?"</li>
<li><em>For adolescents who resist hypothetical framing:</em> "What would a good week look like for you? Not amazing, just... good?"</li>
<li><em>For clients in acute crisis:</em> Defer the miracle question. Use coping questions first to establish safety and basic stabilization, then introduce preferred-future work in subsequent sessions.</li>
<li><em>For mandated clients resistant to the process:</em> "I know this isn't where you'd choose to be. But hypothetically — if this situation were handled and you were done with all of this, what would your life look like?"</li>
</ul>
<p><strong>Common therapist errors with the miracle question:</strong></p>
<ul>
<li>Accepting vague responses ("I'd feel happy," "I'd be less stressed") without drilling into behavioral specifics</li>
<li>Moving too quickly past the client's initial answer — the elaboration is where the value lies</li>
<li>Introducing the question before sufficient rapport is established — the question requires trust</li>
<li>Treating the miracle as the therapeutic goal rather than as a map for solution-building</li>
<li>Failing to scale back when the client is overwhelmed by the full miracle frame</li>
<li>Not connecting the miracle picture back to exceptions: "When you described getting up earlier and feeling motivated — have there been times recently where you've had even a little bit of that?"</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>Scaling Questions: Multiple Applications and Advanced Technique</h2>
<p>Scaling questions are among the most versatile tools in the SFBT toolkit. They allow clients to self-assess their current position, identify what's already working, and specify what a small improvement would look like. Because they externalize and quantify subjective experience, scaling questions create a shared reference point between therapist and client that makes progress visible and discussable.</p>
<p>The basic scaling question: "On a scale of 0–10, where 10 is the miracle you described and 0 is the worst things have ever been, where would you put things right now?"</p>
<p><strong>The follow-up questions are what generate therapeutic movement:</strong></p>
<ul>
<li><strong>What puts you at a [X] and not lower?</strong> — This question surfaces existing strengths, resources, and coping strategies the client may be undervaluing. A client who answers "3" is often surprised to discover they can identify several things keeping them from being at "0" — and those things are clinically important.</li>
<li><strong>What would it look like to be at a [X+1]?</strong> — This generates a specific, behavioral description of the next small step. The goal is not the top of the scale but one point higher — an achievable, concrete target.</li>
<li><strong>What have you done in the past to go from [X-1] to [X]?</strong> — This mines exception history and amplifies client competence. "So you've moved yourself from a 2 to a 3 before. What did you do to make that happen?"</li>
<li><strong>Who would notice first if you were at a [X+1]? What would they see?</strong> — This recruits the relational context and makes the change more concrete. It also subtly involves important others in the change process.</li>
<li><strong>What number would be good enough?</strong> — This prevents the therapeutic trap of perfection-seeking. Not every client needs to reach 10; many are genuinely satisfied at 6 or 7, and knowing this shapes realistic goal-setting.</li>
</ul>
<p><strong>Scaling for different therapeutic purposes:</strong></p>
<p><em>Goal scaling:</em> "On a scale of 1–10, how close are you to where you want to be in terms of [specific goal]?" Used to establish baseline and track progress across sessions. Recording scaling scores in session notes provides measurable documentation of therapeutic movement.</p>
<p><em>Confidence scaling:</em> "How confident are you — on a scale of 1–10 — that you'll be able to make this change?" When confidence is low (below 5), the therapist explores what would increase confidence before setting behavioral tasks. Assigning homework to a client with confidence of 2/10 is a recipe for failure and shame.</p>
<p><em>Motivation scaling:</em> "On a scale of 1–10, how motivated are you to work on this right now?" Low motivation scores are diagnostic — they may indicate a visitor or complainant stance, ambivalence requiring MI work before SFBT, or simply that the stated goal isn't genuinely the client's priority.</p>
<p><em>Safety scaling:</em> "On a scale of 1–10, how safe do you feel right now?" followed by "What would it take to feel one point safer?" Used in crisis presentations, safety planning, and suicide risk work. The safety scaling question is solution-focused even within a safety assessment frame — it helps clients identify what resources and actions would increase their safety rather than only cataloguing risk factors.</p>
<p><em>Relationship scaling:</em> In couples or family work, each member rates the same dimension separately, then the therapist explores the differences: "You rated your communication at a 4 and your partner rated it at a 6. What do you think explains the difference? What might your partner be noticing that would lead them to score it higher?"</p>
<p><em>Progress-between-sessions scaling:</em> Beginning each session with "Where are things on the scale this week compared to last week?" provides a quick, reliable progress measure. Even a 0.5-point improvement over a week is clinically meaningful in SFBT — the therapist amplifies it rather than waiting for larger gains.</p>
<p><strong>A common therapist error:</strong> Treating the scaling number as static data to be recorded and moved on from. The number itself matters less than what the client says about what got them there and what would move them higher. The scale is a conversation-starter, not a measurement endpoint.</p>
<p><strong>With children:</strong> Numerical scaling can be adapted to visual formats — a thermometer, a ladder, a pie chart, a drawing of a face with varying expressions. The goal is the same: externalize the internal state in a way that makes it discussable and allows for fine-grained tracking of progress.</p>`
        },
        {
          type: 'text',
          content: `<h2>Exception-Finding: Clinical Depth and Application</h2>
<p>Exception-finding questions explore times when the problem is absent, less intense, or the client is coping better. These questions directly operationalize the SFBT assumption that no problem occurs 100% of the time and that exceptions contain the seeds of solutions. Exception-finding is arguably the most fundamental SFBT skill — the other techniques (miracle question, scaling) often serve primarily to create a context in which exceptions can be identified and amplified.</p>
<p><strong>Types of exceptions:</strong></p>
<p><em>Deliberate exceptions:</em> Times when the client did something intentionally that made a difference. These are the most therapeutically useful exceptions because they reveal what the client is already doing that works. "What did you do differently on Thursday when you got through the whole day without feeling overwhelmed?" The therapist's goal is to help the client recognize their own agency in creating better moments — even if those moments felt accidental at the time.</p>
<p><em>Random exceptions:</em> Times when things were better but the client doesn't know why. These become the focus of collaborative detective work: "Even though you're not sure why Thursday was different, if you had to guess — what do you think made even a small difference?" This "as if" framing allows clients to speculate about causation without requiring certainty. Often, the speculation itself reveals awareness the client didn't know they had.</p>
<p><em>Pre-treatment exceptions:</em> A powerful and often overlooked category. Between the time a client calls for an appointment and the first session, life continues — and sometimes things improve. The SFBT therapist always asks: "Tell me — from when you called to make this appointment until today, have there been any changes, even small ones, in what brought you in?" Clients who report pre-treatment improvement demonstrate their own capacity for change before therapy formally begins. Amplifying these exceptions communicates immediately that the therapist sees the client as capable and resourceful.</p>
<p><strong>Exception exploration sequence:</strong></p>
<ol>
<li><em>Identify:</em> "Tell me about a recent time when this problem was a little less of a problem — even just slightly." If the client struggles: "When was the last time you had even an okay day? A morning that started reasonably well?"</li>
<li><em>Amplify:</em> "What was different about that time? What were you doing? Who was there? Where were you? What time of day was it?" The therapist pursues behavioral and contextual specificity relentlessly — not to complete a worksheet, but because the specific details contain the therapeutic information.</li>
<li><em>Attribute:</em> "What do you think you did that contributed to that being a better time? What does this tell you about yourself?" Attribution is crucial. Without it, the exception remains something that happened to the client; with it, the client becomes the agent who made it happen. "So when you noticed yourself starting to spiral, you called your sister. That was you doing something that worked. What kind of person does something like that?"</li>
<li><em>Predict:</em> "Given that you know what worked before, what would it take to create more moments like that? Could you see yourself doing that again this week?" The predictive step converts the exception from a historical observation to a future resource.</li>
</ol>
<p><strong>When clients say there are no exceptions:</strong> Severely depressed, traumatized, or exhausted clients sometimes insist that there are no better times — that the problem is constant and unrelenting. Several strategies are helpful:</p>
<ul>
<li><em>Scale down the question:</em> "Not a good time — just a slightly less bad time. Even a moment." This acknowledges the reality of chronic difficulty while still searching for variation.</li>
<li><em>Search distant history:</em> "Think back further — when was the last time things were even a little bit like how you'd want them to be?" Sometimes exceptions are only accessible in the more distant past, and that is still clinically useful.</li>
<li><em>Look at different domains:</em> A client who experiences constant depression in relationships may have genuine moments of competence and satisfaction at work. Exceptions in one domain are still exceptions and can be amplified.</li>
<li><em>Switch to coping questions:</em> If exceptions genuinely cannot be accessed, shift to "How have you managed to keep going despite how hard things have been?" This surfaces resilience through a different route.</li>
</ul>
<p><strong>Clinical examples of exception-finding in community mental health:</strong></p>
<p><em>Case 1: A client with major depressive disorder</em> reports feeling depressed "every day, all day." The therapist asks: "When during the day is it even slightly less heavy?" The client pauses and says: "Actually, sometimes in the morning right after I wake up, before I've started thinking, it's okay for a few minutes." The therapist amplifies: "What's happening in those few minutes? What are you doing? What does your body feel like?" This single exception — a few minutes of relative ease before conscious thought activates — becomes the foundation for exploring what conditions support better moments.</p>
<p><em>Case 2: A parent involved with child welfare</em> insists the parenting has "never worked." The therapist asks: "Tell me about a time recently when things with your child went even a little bit okay — a moment where you felt like a decent parent." After hesitation, the parent describes a bedtime routine last week where the child fell asleep without conflict. The therapist amplifies: "What were you doing that night that made that possible? What was different about how you approached bedtime?" The parent begins identifying specific behaviors — less phone use, a consistent routine, a calmer voice — that they had discounted as accidental.</p>
<p><strong>Exception-finding is not toxic positivity.</strong> The therapist is not saying "things aren't that bad" or "focus on the positive." They are saying: "Your experience varies. In the moments when things are a little better, something is different — and we can learn from that." This is an empirical approach to change, not a philosophical commitment to optimism.</p>`
        },
        {
          type: 'text',
          content: `<h2>Coping Questions and Presuppositional Language</h2>
<p><strong>Coping questions</strong> are used when clients are in severe distress and exceptions are hard to access. Rather than asking "When things were better," the therapist asks how the client has managed to keep going despite the severity of the problem: "Given everything you're dealing with, how have you managed to get yourself here today?" "What has kept you going even when things have felt this bad?"</p>
<p>Coping questions acknowledge genuine suffering while simultaneously surfacing strength and resilience. They are particularly useful with:</p>
<ul>
<li>Clients presenting in acute crisis</li>
<li>Clients with chronic, severe mental illness</li>
<li>Clients who've experienced significant trauma</li>
<li>Clients whose lives contain few objectively positive exceptions</li>
</ul>
<p><strong>Presuppositional language</strong> is a subtle but powerful SFBT tool. The therapist uses language that presupposes change, progress, and client competence. Instead of "If things get better," the therapist says "When things get better." Instead of "If you decide to work on this," they say "As you make changes." Instead of "Do you think you could do this?", they say "How will you do this in a way that works for you?"</p>
<p>This is not manipulation — it is deliberate language choice that co-constructs a narrative in which change is expected, normal, and within the client's reach. Research on language and cognition supports the therapeutic impact of presuppositional framing.</p>`
        },
        {
          type: 'text',
          content: `<h2>Goal Formulation in SFBT</h2>
<p>Goal-setting in SFBT follows specific principles that distinguish it from typical treatment planning. SFBT goals are collaboratively constructed, client-driven, and structured to be achievable.</p>
<p><strong>Well-formed goals in SFBT are:</strong></p>
<ul>
<li><strong>Stated positively (presence of something, not absence of a problem):</strong> "I want to feel calm in social situations" rather than "I want to stop having panic attacks"</li>
<li><strong>Small and specific:</strong> "I want to be able to make eye contact with my boss during meetings" rather than "I want to be more confident"</li>
<li><strong>Interpersonally constructed:</strong> Goals include a relational dimension — who will notice, what they'll observe</li>
<li><strong>The client's goal, not the therapist's:</strong> SFBT therapists resist substituting clinical goals for client-identified priorities</li>
<li><strong>In the beginning (process) rather than the end (outcome):</strong> "I'll start waking up 30 minutes earlier" rather than "I'll have a full daily routine"</li>
</ul>
<p><strong>The three-session contract:</strong> In many community mental health settings, SFBT therapists begin with a defined brief contract (often 3–6 sessions) rather than open-ended treatment. This structure is not punitive — it is therapeutically intentional. Limited sessions create productive urgency, focus the therapeutic conversation, and align with the SFBT assumption that clients can make meaningful change quickly when helped effectively.</p>
<p><strong>Documentation alignment:</strong> SFBT goals can be translated directly into measurable treatment plan objectives. "Client will identify two coping strategies for use during anxiety episodes (rated ≥7/10 on distress scale) and report use at next session" captures the SFBT precision while meeting documentation requirements.</p>`
        },
        {
          type: 'text',
          content: `<h2>The First Session Formula Task and Between-Session Assignments</h2>
<p>One of SFBT's most distinctive and research-supported features is its use of between-session tasks — specific observations or actions assigned at the end of each session to maintain therapeutic momentum between meetings. These tasks are not the structured homework of CBT; they are observational assignments that keep the client attuned to exceptions, changes, and resources in their daily life.</p>
<p><strong>The First Session Formula Task (FSFT)</strong> was developed by de Shazer and colleagues based on an observation from their outcome research: when clients were asked to pay attention to what was happening in their lives that they wanted to continue, they returned to the second session reporting meaningful positive changes — regardless of the presenting problem, the therapist's theoretical orientation, or the interventions used in session. The task turned out to be powerfully generic.</p>
<p>The standard FSFT: <em>"Between now and when we meet next time, I'd like you to notice what is happening in your life — with [the presenting concern], in your relationships, at work, or anywhere — that you want to have continue happening. Don't try to change anything. Just notice. We'll talk about what you observed when we meet next."</em></p>
<p>This task works for several reasons: it directs attention toward the positive without requiring the client to do anything differently (low demand, high compliance), it frames the client as the observer of their own life rather than a passive recipient of intervention, and it implicitly communicates that good things are happening and worth attending to — which is itself a meaningful therapeutic message for clients whose attention has been captured entirely by what's going wrong.</p>
<p><strong>Common between-session task types in SFBT:</strong></p>
<p><em>Observation tasks:</em> "Notice what's a little better this week, even if just slightly." Ideal for clients in early stages, clients with low motivation, or as the universal first-session assignment. Observation tasks ask nothing of the client except attention — an extremely low barrier to compliance.</p>
<p><em>Exception amplification tasks:</em> "We talked about Thursday being a better day. Do more of what you were doing on Thursday, and notice what happens." This translates an identified exception into a deliberate behavioral experiment. The client is not being told what to do — they are being invited to intentionally repeat something that already worked.</p>
<p><em>Prediction tasks:</em> "Before you go to sleep tonight and each night this week, predict whether tomorrow will be a better day — a little better than today. Then the next evening, notice what made the difference between your prediction and what actually happened." Prediction tasks engage clients in prospective attention to change rather than retrospective problem analysis. Research shows they increase clients' sense of efficacy and predictability even when the outcome doesn't match the prediction.</p>
<p><em>Scaling progress tasks:</em> "Rate yourself on the scale each morning this week. Notice what's different on the days where you rate yourself higher." This extends the scaling work into daily life and generates rich between-session data without requiring complex self-monitoring.</p>
<p><strong>Principles for effective SFBT task assignment:</strong></p>
<ul>
<li>Tasks should emerge naturally from the session content — they are distillations of what the client has identified as important, not clinician-imposed directives</li>
<li>Begin with complimenting: "I've been really struck by [specific observation about the client's strengths]. Given that, I'd like to suggest..."</li>
<li>Make tasks manageable: an overly demanding task will fail and may shame the client. A simple observation task is better than an elaborate behavioral program that won't get done</li>
<li>Always check back at the beginning of the next session: "Last time we talked about you noticing what was a little better. What did you observe?" This validates the task and signals that the client's between-session experience matters</li>
<li>Normalize non-completion: "Sometimes life gets in the way of these observations. Did you happen to notice anything at all, even if you weren't actively trying?" This prevents shame and maintains therapeutic alliance even when tasks aren't completed</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>Cultural Considerations in SFBT Practice</h2>
<p>SFBT's emphasis on client expertise, collaborative goal-setting, and non-pathologizing stance makes it theoretically well-suited to cross-cultural practice. However, clinicians must understand both the model's cultural assumptions and the adaptations required for diverse populations in community mental health settings.</p>
<p><strong>Individualism vs. collectivism:</strong> SFBT's standard goal-formulation questions — "What do YOU want?" "What would YOUR life look like?" — embed an individualistic framework. For clients from collectivist backgrounds (many Asian, Latino, African, and Indigenous cultures), goals are inherently relational and communal. The "what do you want?" question may genuinely confuse a client whose identity and decision-making are organized around family welfare, elder wishes, or community harmony.</p>
<p>The culturally responsive adaptation: reframe goal questions relationally. "What would your family want to be different?" "If things were better for you, how would that help your family?" "What would bring more harmony to your household?" These formulations achieve the same SFBT goal — identifying a preferred future — while honoring collectivist values rather than requiring the client to adopt an individualistic framing.</p>
<p><strong>Language and metaphor:</strong> SFBT's miracle question relies on a specific cultural metaphor — miracle implies supernatural intervention within a framework that many clients will recognize, but not all. For clients whose cultural or religious framework uses different metaphorical registers, adaptations are needed. "If your ancestors could see your life going the way it's meant to go, what would they see?" or "If you woke up tomorrow and the spirits had lifted this burden, what would be different?" These adaptations honor the miracle-question structure while using metaphors that are culturally resonant.</p>
<p>Similarly, the language of "exceptions" and "solutions" is drawn from a Western problem-solving tradition that may not translate smoothly. For some clients, speaking about "times when things were better" or "what keeps you going" may be more accessible than the clinical vocabulary of exceptions and solutions.</p>
<p><strong>Help-seeking and stigma:</strong> Community mental health settings serve populations for whom mental health help-seeking carries significant cultural stigma. African American, Latino, and many Asian communities have documented patterns of delayed help-seeking related to stigma, historical mistrust of mental health systems, and cultural emphasis on handling problems within the family. SFBT's non-pathologizing stance, client-expertise position, and brief format may reduce some of these barriers — but clinicians should not assume that the model's stance is sufficient to overcome decades of structural racism and institutional mistrust. Relationship-building and cultural humility precede any technique.</p>
<p><strong>Religious and spiritual frameworks:</strong> Many clients in community mental health settings hold strong religious or spiritual beliefs that are central to their coping and identity. SFBT's exception-finding and coping questions naturally intersect with spiritual resources: "How has your faith helped you get through this?" "What does your spiritual community provide that helps you keep going?" Incorporating these into SFBT exception work honors the client's resources rather than marginalizing them as non-clinical.</p>
<p><strong>Mandated and involuntary clients from marginalized communities:</strong> Many community mental health clients who are mandated or involved with child welfare or justice systems are people of color who have experienced the mental health and legal system as coercive and disrespectful. SFBT's joining stance and client-expertise position can begin to rebuild trust — but clinicians must be honest about the reporting and monitoring obligations that exist alongside the therapeutic relationship. Trying to maintain a purely SFBT "not knowing" stance while holding significant institutional power is inauthentic and clients often sense it. Transparency about the dual role is more consistent with SFBT values than pretending the power differential doesn't exist.</p>
<p><strong>Oral versus written traditions:</strong> SFBT's reliance on verbal therapeutic exchange is broadly adaptable, but the between-session observation tasks assume literacy and a particular relationship to self-monitoring that may not be universal. For clients who prefer oral processing, narrative storytelling, or communal meaning-making, tasks should be adapted accordingly. "Talk to your mother or grandmother about a time when someone in your family went through something hard and came through. Notice what they tell you." This version of an exception-finding task honors oral cultural transmission rather than requiring individual written self-monitoring.</p>`
        },
        {
          type: 'cardSort',
          title: 'SFBT Technique Sorting Activity',
          instructions: 'Sort each description into the correct SFBT technique category.',
          cards: [
            { text: '"On a scale of 1–10, where are things right now, and what would a 1-point improvement look like?"', category: 'Scaling Question' },
            { text: '"Suppose tonight while you sleep, a miracle happens and your problem is solved — what would you notice first?"', category: 'Miracle Question' },
            { text: '"Tell me about a recent time when this wasn\'t as much of a problem for you."', category: 'Exception Finding' },
            { text: '"Given everything you\'ve been through, how have you managed to keep going?"', category: 'Coping Question' },
            { text: '"When things are going better, what will you be doing differently?"', category: 'Presuppositional Language' },
            { text: '"What do you want to have instead of this problem?"', category: 'Goal Formulation' },
            { text: '"I\'m curious — even when things are hard, you\'ve been getting your kids to school every day. That takes real commitment."', category: 'Complimenting' },
            { text: '"What\'s a little better since last week, even if just slightly?"', category: 'Exception Finding' }
          ],
          categories: ['Miracle Question', 'Scaling Question', 'Exception Finding', 'Coping Question', 'Presuppositional Language', 'Goal Formulation', 'Complimenting'],
          explanation: 'Each SFBT technique serves a distinct function in solution construction. Scaling questions quantify progress and generate behavioral specificity. Exception-finding mines existing client competence. The miracle question builds a vivid preferred future. Complimenting acknowledges and amplifies strengths. All techniques work together within the solution-focused therapeutic stance.'
        },
        {
          type: 'text',
          content: `<h2>The SFBT Session Structure</h2>
<p>While SFBT is flexible, sessions generally follow a recognizable arc that maximizes solution-building time:</p>
<p><strong>Opening (5–10 min):</strong> "What's been a little better since last time?" (or "What brings you in today?" for first sessions). This question immediately anchors the session in change and signals the therapeutic frame.</p>
<p><strong>Goal clarification (10–15 min):</strong> What does the client want from today's session specifically? From therapy overall? This is revisited each session — client goals evolve.</p>
<p><strong>Solution exploration (20–30 min):</strong> Exception-finding, scaling, miracle question, coping questions — the therapist selects and sequences techniques based on what emerges.</p>
<p><strong>Break (5 min):</strong> In classic SFBT, the therapist takes a brief break to compose a compliment and task. In individual community practice, this may be internalized rather than literal.</p>
<p><strong>Message and task (5–10 min):</strong> The session closes with a genuine compliment (noticing what the client is doing well), a bridging statement, and a between-session task.</p>
<p><strong>SFBT between-session tasks:</strong></p>
<ul>
<li><em>Observation tasks:</em> "Notice what's a little better this week, even if just slightly."</li>
<li><em>Do more of what works:</em> "Do more of what you did on the good days."</li>
<li><em>Prediction tasks:</em> "Before you go to sleep, predict whether tomorrow will be a better day. Then notice what made the difference."</li>
</ul>`
        },
        {
          type: 'multipleChoice',
          question: 'A client rates themselves a 5/10 on the scaling question. Which follow-up question best reflects SFBT technique?',
          options: [
            { text: '"That\'s lower than last week — what do you think caused the drop?"', isCorrect: false },
            { text: '"What\'s keeping you at a 5 and not lower, and what would a 6 look like?"', isCorrect: true },
            { text: '"Let\'s explore what\'s contributing to the problems that are keeping you from being higher."', isCorrect: false },
            { text: '"What would need to happen in your past for you to feel better?"', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The SFBT follow-up to a scaling answer focuses first on what\'s already working ("what keeps you at 5 and not lower") — surfacing existing strengths — and then on what the next small step looks like ("what would a 6 look like"). This maintains a future and strength orientation rather than problem analysis.'
        },
        {
          type: 'multipleChoice',
          question: 'Which of the following best represents a "well-formed goal" in SFBT?',
          options: [
            { text: '"I want to stop feeling depressed all the time"', isCorrect: false },
            { text: '"I want to understand why I keep sabotaging my relationships"', isCorrect: false },
            { text: '"I want to have one conversation per week where I feel heard by my partner"', isCorrect: true },
            { text: '"I want my anxiety to be completely gone within three months"', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'A well-formed SFBT goal is stated positively (presence of something desired), small and specific, and interpersonal. "One conversation per week where I feel heard by my partner" is positive (not "stop fighting"), concrete and measurable, relationally grounded, and achievable in the near term — all hallmarks of a well-formed SFBT goal.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are characteristics of well-formed goals in SFBT? Select all that apply.',
          options: [
            { text: 'Stated as the presence of something positive, not the absence of a problem', isCorrect: true },
            { text: 'Determined collaboratively by client and therapist', isCorrect: true },
            { text: 'Rooted in insight about underlying causes', isCorrect: false },
            { text: 'Small and specific enough to be achieved in the near term', isCorrect: true },
            { text: 'Include a relational dimension (who will notice, what they will see)', isCorrect: true }
          ],
          explanation: 'SFBT well-formed goals are positive (not problem-focused), collaborative, small and specific, and include a relational dimension. They do not require insight into causation — SFBT is explicitly non-interpretive and non-analytic in its goal-setting process.'
        }
      ]
    },
    {
      title: 'SFBT in Practice: Complex Presentations and Special Populations',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'SFBT in Practice',
          subtitle: 'Adapting SFBT for complex presentations, mandated clients, and high-caseload settings'
        },
        {
          type: 'text',
          content: `<h2>SFBT with Mandated and Involuntary Clients</h2>
<p>Community mental health clinicians frequently work with clients who did not choose to be in therapy: court-ordered clients, individuals attending as a condition of child welfare involvement, or those whose family members have insisted on treatment. SFBT has well-documented utility with mandated populations, partly because its stance — respecting client expertise and avoiding the therapist-as-expert-on-your-life dynamic — reduces the power differential that mandated clients often resent.</p>
<p><strong>The SFBT client type framework:</strong> De Shazer and Berg distinguished three client postures:</p>
<ul>
<li><em>Visitors:</em> Don't see a problem or want to be in therapy. "My probation officer sent me." With visitors, the therapist avoids trying to convince the client they have a problem. Instead, they explore what the client wants (perhaps to get through probation successfully) and work toward that goal.</li>
<li><em>Complainants:</em> See a problem but don't see themselves as part of the solution — often pointing to someone else who needs to change. "My wife is the problem." The therapist validates the difficulty while gently exploring what the client can do differently.</li>
<li><em>Customers:</em> Ready to work on their own behavior. SFBT techniques flow most naturally here.</li>
</ul>
<p>The goal with visitors and complainants is not to challenge or confront — it is to find what the client actually wants and work toward that. Even a mandated client who wants to complete probation without incident is a workable client goal. SFBT joins where the client is.</p>
<p><strong>Adaptation strategies for mandated clients:</strong></p>
<ul>
<li>Acknowledge the coercive context directly and without judgment: "It sounds like you're here because you have to be. That makes sense. What would make this useful to you, given that you're here?"</li>
<li>Explore what the client's life would look like if they met the requirements: "If you completed this program successfully, what would be different about your life?"</li>
<li>Look for the smallest possible agreed-upon goal that the client genuinely wants</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>SFBT with Depression and Suicidal Ideation</h2>
<p>A common clinician concern: Is SFBT appropriate when clients are severely depressed or suicidal? The research says yes — with important adaptations.</p>
<p>For clients presenting with depression, SFBT's exception-finding, coping questions, and scaling are particularly valuable precisely because depression distorts perception of the past and future. Depression tells clients "nothing has ever worked, nothing will ever work." SFBT's structured exploration of exceptions directly challenges this cognitive distortion through experience rather than argument.</p>
<p><strong>With suicidal ideation:</strong> Safety assessment remains the clinical priority — SFBT does not replace suicide risk assessment protocols. However, once immediate safety is established, SFBT questions can be powerfully therapeutic:</p>
<ul>
<li>The <em>reasons for living</em> question (adapted from motivational interviewing): "What has kept you here even during the hardest times?"</li>
<li>Future-oriented questions: "If things were better enough that you wanted to stay — what would be different?"</li>
<li>Scaling safety: "On a scale of 1–10, how safe do you feel right now?" followed by "What would it take to feel one point safer?"</li>
</ul>
<p>Research by John Henden and others has documented SFBT adaptations specifically for suicidality, including the "Signs of Safety" framework used widely in child welfare. The key principle: even in crisis, the client has reasons for living, moments of hope, and resources — and identifying these is therapeutically active, not wishful thinking.</p>`
        },
        {
          type: 'text',
          content: `<h2>SFBT with Trauma Presentations</h2>
<p>SFBT is not a trauma processing model in the same way as EMDR or CPT — it does not include exposure or reprocessing components. However, it is appropriate and valuable as part of a trauma-informed approach, particularly in:</p>
<ul>
<li>Stabilization phases before trauma-focused processing begins</li>
<li>Settings where trauma processing is not feasible (high-volume community settings, crisis services)</li>
<li>As a complementary approach alongside trauma-specific modalities</li>
<li>With clients who do not want to directly discuss trauma content</li>
</ul>
<p><strong>Trauma-informed SFBT principles:</strong></p>
<ul>
<li>Honor client control over the therapeutic process — SFBT's non-directive stance is inherently trauma-sensitive</li>
<li>Explore post-traumatic growth: "What have you learned about yourself from how you've survived this?"</li>
<li>Do not press exception-finding in ways that could feel minimizing of genuine traumatic impact</li>
<li>Use coping questions when clients are in survival mode: "How have you kept yourself going through this?"</li>
<li>Frame resilience not as "getting over" trauma but as existing alongside it: "What helps you carry this and still show up for your life?"</li>
</ul>
<p>The therapist should be aware that overly enthusiastic strengths-identification can feel invalidating to trauma survivors. "You're so resilient!" can land as "so what are you complaining about?" SFBT complimenting must be genuine, specific, and attuned to what the client is ready to receive.</p>`
        },
        {
          type: 'text',
          content: `<h2>SFBT with Children, Adolescents, and Families</h2>
<p>SFBT has one of its strongest evidence bases with children and adolescents. The approach's emphasis on client expertise, non-pathologizing stance, and concrete goal-setting aligns well with developmental considerations and school-based settings.</p>
<p><strong>Child-adapted techniques:</strong></p>
<ul>
<li><em>The magic wand question:</em> "If you had a magic wand and could change one thing about your life, what would it be?" — More accessible for young children than the miracle question</li>
<li><em>Thermometer scaling:</em> Visual scaling tools make the abstract concrete for children who struggle with numerical scales</li>
<li><em>Exceptions as "good days":</em> "Tell me about a day at school that was a good day. What made it good?"</li>
<li><em>Future projection:</em> "When you're older and things are going well, what will you be doing?"</li>
</ul>
<p><strong>Family work:</strong> SFBT's family adaptation explores relational exceptions and invites each family member to articulate what they want (not just complaints about others). The therapist might ask parents: "When your child had a better day this week, what did you notice? What were you doing differently those times?" This invites parents into collaborative solution-building rather than positioning them as reporters of their child's pathology.</p>`
        },
        {
          type: 'text',
          content: `<h2>Integrating SFBT with Other Approaches</h2>
<p>SFBT was developed as a standalone model, but many community mental health clinicians use it as a core framework while integrating compatible techniques from other approaches.</p>
<p><strong>SFBT + Motivational Interviewing:</strong> These models share significant overlap — both are strengths-based, collaborative, and non-confrontational. MI's decisional balance and change-talk elicitation complement SFBT's exception-finding. A client ambivalent about change might benefit from MI before SFBT goal-setting begins.</p>
<p><strong>SFBT + CBT:</strong> SFBT's future-oriented questions can help clients generate behavioral experiments to test. "What would you do differently on a good day?" identifies behaviors that can become CBT homework. The approaches are compatible as long as the therapist maintains SFBT's non-interpretive, non-diagnostic stance during the SFBT components.</p>
<p><strong>SFBT + DBT skills:</strong> For clients working on emotional regulation, SFBT can help identify times when DBT skills were effective: "Tell me about a time when you used DEAR MAN or Wise Mind successfully. What was different then?" This exception-finding amplifies skill use rather than exploring skill deficits.</p>
<p><strong>Integration cautions:</strong></p>
<ul>
<li>Don't import problem-focused techniques into SFBT sessions — it creates cognitive dissonance for both therapist and client</li>
<li>Be intentional about model shifts: let the client know when you're shifting frameworks</li>
<li>Maintain the SFBT stance even when using non-SFBT techniques — the stance is more fundamental than any individual technique</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>SFBT in High-Caseload Community Settings</h2>
<p>Community mental health reality: therapists often carry 40–60 active cases, see clients for 45–50 minutes, and face administrative documentation burdens. SFBT is not just theoretically compatible with this environment — it was designed for it.</p>
<p><strong>Practical implementation strategies:</strong></p>
<p><em>Single-session SFBT:</em> Research shows that the most common number of sessions clients attend in community mental health is one. SFBT is uniquely suited to single-session work because each session is structured to be complete in itself. Clinicians trained in SFBT treat each session as if it might be the last — extracting maximum therapeutic value from every contact.</p>
<p><em>Group SFBT:</em> SFBT principles translate powerfully to group settings. SFBT groups focus on members sharing exceptions and identifying solutions, with group members serving as resources for each other rather than processing problems collectively. This format allows treatment of more clients in less time.</p>
<p><em>Walk-in services:</em> Several Canadian community mental health centers have implemented SFBT-based walk-in counseling, demonstrating that same-day, one-session SFBT is effective for a significant portion of presenting concerns. This model increases access dramatically.</p>
<p><em>Between-session contact:</em> Brief check-in calls or text-based tools (in compliant, HIPAA-appropriate systems) can extend SFBT between sessions: "What's one thing that was a little better this week?" This low-burden touch maintains therapeutic momentum.</p>
<p><strong>Documentation and billing alignment:</strong> SFBT goals, scaling scores, and exception findings translate directly into measurable treatment plan objectives and session progress notes. The model's specificity ("client identified 3 exceptions this week; scaled progress from 4 to 5") generates meaningful documentation without excessive narrative burden.</p>`
        },
        {
          type: 'flashcardDeck',
          title: 'SFBT Terminology Flashcards',
          instructions: 'Review key SFBT terms and their definitions.',
          flashcards: [
            { front: 'Exception', back: 'A time when the presenting problem was absent or less severe; used to identify what the client is already doing that works' },
            { front: 'Miracle Question', back: 'A technique asking the client to describe their life in detail as if the problem were solved overnight; generates a concrete preferred future' },
            { front: 'Scaling Question', back: 'A 0–10 self-assessment tool used to measure progress, confidence, motivation, or any client-defined dimension; follow-ups explore what\'s working and what a small improvement looks like' },
            { front: 'Visitor', back: 'A client who does not acknowledge having a problem and doesn\'t seek change; often mandated. The therapist finds what the client does want' },
            { front: 'Complainant', back: 'A client who sees a problem but sees others as needing to change. The therapist validates and explores what the client can do differently' },
            { front: 'Customer', back: 'A client who acknowledges the problem and is ready to work on their own behavior — the most straightforward SFBT client stance' },
            { front: 'Coping Question', back: 'A question exploring how the client has managed to function despite significant hardship: "How have you kept going?" Used when exceptions are hard to access' },
            { front: 'Presuppositional Language', back: 'Language that assumes change is occurring or will occur: "When things get better" (not "if"); used to co-construct a change-expectant narrative' }
          ]
        },
        {
          type: 'text',
          content: `<h2>Ethical Considerations in SFBT</h2>
<p>SFBT's strengths-focus raises several ethical considerations that community mental health clinicians should navigate thoughtfully.</p>
<p><strong>The risk of minimization:</strong> SFBT's positivity can be misused to avoid discussing real suffering, structural oppression, or genuine trauma impact. Ethical SFBT acknowledges difficulty fully before pivoting to strengths. The model is not "positive thinking" — it is strategic redirection after thorough validation.</p>
<p><strong>Cultural responsiveness:</strong> SFBT's individualistic goal-orientation can conflict with collectivist cultural values. For clients whose goals are defined relationally ("my family's wellbeing") or communally, the therapist should work within that framework rather than pressing for individually-defined goals. SFBT's adaptability is one of its strengths — but only if clinicians actually adapt.</p>
<p><strong>Scope of practice and safety:</strong> SFBT does not replace clinical assessment for suicidality, child abuse, domestic violence, or acute psychiatric crisis. SFBT is a therapeutic orientation, not a crisis protocol. Community mental health clinicians must know when to step outside the SFBT frame to address safety directly.</p>
<p><strong>Managed care pressures:</strong> SFBT's brevity makes it commercially attractive to insurance systems that want short-term treatment. Clinicians must resist pressure to apply SFBT in ways that prematurely terminate treatment for clients who need ongoing support. The model is brief by design — but the indication for briefer treatment should be clinical, not financial.</p>
<p><strong>Transparency and informed consent:</strong> Clients should understand the approach being used, including its brief orientation and solution focus. Some clients want and expect problem exploration — they should know what they're getting and have the option to discuss preferences.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: SFBT in Practice',
          takeaways: [
            'SFBT identifies three client postures (visitor, complainant, customer) and adapts technique accordingly — joining where the client actually is',
            'With mandated clients, SFBT finds the client\'s own goal (e.g., completing probation) and works toward that authentically',
            'SFBT is trauma-informed through its non-directive stance and client-led pacing — not as a trauma processing model but as a stabilization approach',
            'The strongest evidence base for SFBT includes depression, anxiety, relationship concerns, and child/adolescent behavioral issues',
            'SFBT is exceptionally suited to high-caseload community settings through single-session structure, group formats, and walk-in models',
            'Ethical SFBT avoids minimization, adapts to cultural values, maintains safety protocols, and upholds informed consent'
          ]
        },
        {
          type: 'reflection',
          question: 'Think about a current client you work with in a community mental health setting. How might SFBT\'s exception-finding or scaling questions shift the therapeutic conversation in a potentially useful direction? What adaptations might you need to make based on that client\'s presentation, cultural background, or current mandated status?'
        },
        {
          type: 'multipleChoice',
          question: 'A court-mandated client tells you: "I don\'t have a problem. My lawyer sent me here." According to SFBT, which response best reflects the appropriate therapeutic stance?',
          options: [
            { text: 'Challenge the client\'s denial and help them recognize the problem that led to their referral', isCorrect: false },
            { text: 'Accept the referral and use psychoeducation to help the client understand why they need treatment', isCorrect: false },
            { text: 'Explore what the client does want — perhaps completing requirements or improving their legal situation — and work toward that goal', isCorrect: true },
            { text: 'Document non-compliance and refer the client back to probation for motivational work first', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'SFBT frames this as a "visitor" — a client who doesn\'t see a problem but has something they do want. The therapeutic strategy is not confrontation or motivation enhancement but finding what the client genuinely wants (completing requirements, maintaining freedom, satisfying family members) and working toward that authentic goal. This approach reduces resistance and creates workable therapeutic goals even with mandated clients.'
        },
        {
          type: 'multipleChoice',
          question: 'Which SFBT adaptation is most appropriate when a client is in acute distress and exceptions to the problem are difficult to identify?',
          options: [
            { text: 'The miracle question, to redirect toward a positive future', isCorrect: false },
            { text: 'Exception-finding, to identify times when things were better', isCorrect: false },
            { text: 'Coping questions, to surface how the client has managed to keep going', isCorrect: true },
            { text: 'Goal formulation, to clarify what the client wants', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Coping questions ("How have you managed to keep going despite everything?") are the SFBT adaptation for clients in severe distress or crisis, when exceptions are genuinely hard to access. They acknowledge the reality of the client\'s struggle while surfacing resilience and resources — without minimizing or pivoting to positivity before the client is ready.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are ethical considerations specific to SFBT practice? Select all that apply.',
          options: [
            { text: 'Risk of minimizing client suffering through premature strengths-focus', isCorrect: true },
            { text: 'Cultural responsiveness — adapting individually-focused goals for collectivist clients', isCorrect: true },
            { text: 'SFBT replaces comprehensive suicide risk assessment in community settings', isCorrect: false },
            { text: 'Transparency and informed consent about the brief, solution-focused approach', isCorrect: true },
            { text: 'Resisting managed care pressure to terminate treatment prematurely', isCorrect: true }
          ],
          explanation: 'SFBT raises specific ethical considerations: the risk of minimizing through positivity, the need to culturally adapt goal-orientation, the obligation to be transparent with clients about the approach, and the need to resist using SFBT\'s brevity to justify premature termination for clinical reasons. SFBT does NOT replace safety assessment — that remains a non-negotiable clinical obligation.'
        },
        {
          type: 'resources',
          title: 'Additional Resources',
          resources: [
            { name: 'Solution-Focused Brief Therapy Association (SFBTA)', url: 'https://www.sfbta.org', description: 'Professional organization for SFBT practitioners; training, certification, and research resources' },
            { name: 'Berg, I.K., & de Shazer, S. (1993). Making numbers talk: Language in therapy', url: '', description: 'Foundational text on scaling questions and presuppositional language in SFBT' },
            { name: 'Franklin, C., Trepper, T., Gingerich, W., & McCollum, E. (Eds.) (2012). Solution-Focused Brief Therapy: A Handbook of Evidence-Based Practice', url: '', description: 'Comprehensive evidence-based practice guide from Oxford University Press' },
            { name: 'Macdonald, A. (2011). Solution-Focused Therapy: Theory, Research & Practice', url: '', description: 'UK-based research synthesis and clinical practice guide' }
          ]
        }
      ]
    }
  ],
  assessment: {
    questions: [
      {
        question: 'SFBT was developed at which institution?',
        options: ['Beck Institute for Cognitive Behavior Therapy', 'Brief Family Therapy Center in Milwaukee', 'Menninger Clinic', 'Stanford University Counseling Center'],
        correctAnswer: 1,
        explanation: 'SFBT was developed by Steve de Shazer, Insoo Kim Berg, and colleagues at the Brief Family Therapy Center in Milwaukee in the 1970s and 1980s.'
      },
      {
        question: 'Which theoretical tradition most directly influenced the development of SFBT?',
        options: ['Psychoanalytic object relations theory', 'Behavioral learning theory', 'Social constructionism', 'Humanistic-existential philosophy'],
        correctAnswer: 2,
        explanation: 'Social constructionism — the idea that language co-constructs reality — is a primary theoretical influence on SFBT. The model holds that solution-focused questions build different narratives and different realities than problem-focused questions.'
      },
      {
        question: 'In SFBT, an "exception" refers to:',
        options: ['A case where standard protocols should not apply', 'A time when the presenting problem was absent or less severe', 'A client who does not meet diagnostic criteria', 'An unusual therapeutic technique outside mainstream practice'],
        correctAnswer: 1,
        explanation: 'In SFBT, an exception is a time when the problem is absent or less severe. Exceptions are viewed as evidence that the client already has resources and capacities that can be amplified to build solutions.'
      },
      {
        question: 'What is the primary purpose of the miracle question in SFBT?',
        options: ['To assess for magical thinking or psychosis', 'To build rapport through imaginative engagement', 'To generate a concrete, behavioral description of the client\'s preferred future', 'To assess the client\'s level of motivation for treatment'],
        correctAnswer: 2,
        explanation: 'The miracle question is designed to help clients construct a vivid, detailed, behavioral picture of their preferred future — not as a fantasy, but as a concrete guide for goal-setting and solution-building.'
      },
      {
        question: 'A scaling question follow-up asking "What keeps you at a 4 and not lower?" primarily serves to:',
        options: ['Assess symptom severity', 'Surface existing client strengths, resources, and coping strategies', 'Identify barriers to progress', 'Determine the frequency and intensity of the presenting problem'],
        correctAnswer: 1,
        explanation: 'The "what keeps you at X and not lower" follow-up is designed to surface what\'s already working — existing strengths, resources, and coping strategies. This is a strengths-amplification question, not a symptom assessment.'
      },
      {
        question: 'Which SFBT client posture describes someone who sees a problem but sees others (not themselves) as the one who needs to change?',
        options: ['Visitor', 'Complainant', 'Customer', 'Observer'],
        correctAnswer: 1,
        explanation: 'In SFBT, a "complainant" sees a problem but locates the need for change in someone else ("my wife needs to change," "my boss is the problem"). The therapist validates the difficulty while gently exploring what the client can do differently.'
      },
      {
        question: 'Presuppositional language in SFBT uses which grammatical construction?',
        options: ['"If things improve, what will that look like?"', '"When things improve, what will that look like?"', '"Do you think things can improve?"', '"Have things been better at any point?"'],
        correctAnswer: 1,
        explanation: 'Presuppositional language assumes change is occurring or will occur. "When things improve" (not "if") co-constructs a narrative in which change is expected and normal, not hypothetical or uncertain.'
      },
      {
        question: 'SFBT between-session tasks often include which of the following?',
        options: ['Journaling about the origins of the presenting problem', 'Noticing what is a little better, even if slightly', 'Practicing cognitive restructuring techniques', 'Completing a thought record for automatic negative thoughts'],
        correctAnswer: 1,
        explanation: 'SFBT between-session tasks typically include observation assignments like "notice what\'s a little better this week" or "do more of what was working." These tasks maintain a change-focused, exception-building orientation between sessions.'
      },
      {
        question: 'Which of the following clinical populations does SFBT have one of its strongest evidence bases with?',
        options: ['Adults with severe personality disorders requiring long-term treatment', 'Children and adolescents with behavioral and emotional concerns', 'Individuals with active psychosis requiring psychoeducation', 'Clients in early-stage dementia needing memory support'],
        correctAnswer: 1,
        explanation: 'SFBT has a well-documented evidence base with children and adolescents, including in school-based settings. The non-pathologizing stance, concrete goal-setting, and visual scaling adaptations make it developmentally appropriate and effective.'
      },
      {
        question: 'A client in acute suicidal crisis arrives for a session. According to SFBT principles and ethical standards, the first priority is:',
        options: ['Applying the miracle question to build a preferred-future narrative', 'Completing suicide risk assessment per standard protocols', 'Finding exceptions to times when the client didn\'t feel suicidal', 'Using scaling questions to assess the client\'s level of hope'],
        correctAnswer: 1,
        explanation: 'Safety assessment remains the clinical and ethical priority regardless of therapeutic model. SFBT does not replace suicide risk assessment. Once immediate safety is established, SFBT techniques (reasons-for-living questions, safety scaling) can be valuable adjuncts.'
      },
      {
        question: 'Coping questions in SFBT are most useful when:',
        options: ['The client is highly motivated and ready for change', 'Exceptions to the problem are difficult to identify because the client is in severe distress', 'The client needs help identifying the historical origins of their problem', 'Goal-setting has already been completed and the client needs next steps'],
        correctAnswer: 1,
        explanation: 'Coping questions ("How have you managed to keep going?") are designed for clients in severe distress when exception-finding would be premature or minimizing. They acknowledge genuine hardship while surfacing resilience.'
      },
      {
        question: 'According to SFBT, what is the most useful response when a current approach is not producing change?',
        options: ['Deepen exploration of the problem to find underlying causes', 'Persist with the current approach and allow more time', 'Do something different — SFBT therapists are flexible and pragmatic', 'Increase session frequency to accelerate the therapeutic process'],
        correctAnswer: 2,
        explanation: 'SFBT\'s core assumption is: "If something isn\'t working, do something different." The model is explicitly pragmatic — if a technique or approach isn\'t generating progress, the therapist shifts rather than persisting.'
      },
      {
        question: 'How does SFBT typically approach goal-setting with mandated clients who deny having a problem?',
        options: ['Use motivational interviewing to build readiness before setting goals', 'Help the client recognize the problem through psychoeducation and reflective listening', 'Find what the client does want — such as completing requirements or improving their situation — and work toward that', 'Document the client\'s resistance and defer goal-setting until they demonstrate readiness'],
        correctAnswer: 2,
        explanation: 'SFBT adapts to visitors by finding what the client genuinely wants. Even a mandated client who wants to complete probation successfully, maintain custody, or satisfy family members has a workable goal. SFBT joins where the client is rather than pressing for problem acknowledgment.'
      },
      {
        question: 'Which ethical concern is specifically relevant to applying SFBT with clients from collectivist cultural backgrounds?',
        options: ['SFBT\'s use of scaling questions may be unfamiliar to non-Western clients', 'SFBT\'s individually-focused goal-orientation may conflict with relational or communal values', 'SFBT\'s brevity is culturally inappropriate for clients who prefer long-term relationships', 'SFBT does not incorporate culturally specific healing practices'],
        correctAnswer: 1,
        explanation: 'SFBT\'s default toward individually-defined goals ("what do YOU want") can conflict with collectivist values where individual goals are embedded in family or community welfare. Culturally responsive SFBT adapts goal formulation to work within the client\'s relational framework.'
      },
      {
        question: 'In SFBT\'s session structure, the "break" before the closing message serves what purpose?',
        options: ['To allow the client to process emotions before the session ends', 'To give the therapist time to compose a genuine compliment and between-session task', 'To complete documentation before the session closes', 'To allow the client to review their progress on session goals'],
        correctAnswer: 1,
        explanation: 'The classic SFBT break is a brief pause before the closing in which the therapist composes a genuine compliment acknowledging client strengths and a between-session task. In community practice, this may be an internalized reflection rather than a literal break.'
      },
      {
        question: 'SFBT is best described as:',
        options: ['A technique applied to clients from a position of clinical expertise', 'A strengths-amplifying, collaborative approach in which the client is the expert on their own life', 'A symptom-reduction framework compatible primarily with cognitive-behavioral theory', 'A crisis intervention model for acute mental health presentations'],
        correctAnswer: 1,
        explanation: 'SFBT is fundamentally a collaborative, strengths-amplifying approach in which the client is positioned as the expert on their own life and the therapist as a facilitator of solution construction — not as a clinical authority who knows what the client needs.'
      }
    ]
  },
  references: [
    { citation: 'de Shazer, S. (1985). Keys to solution in brief therapy. W.W. Norton.' },
    { citation: 'de Shazer, S. (1988). Clues: Investigating solutions in brief therapy. W.W. Norton.' },
    { citation: 'Berg, I.K., & Miller, S.D. (1992). Working with the problem drinker: A solution-focused approach. W.W. Norton.' },
    { citation: 'Berg, I.K. (1994). Family based services: A solution-focused approach. W.W. Norton.' },
    { citation: 'Franklin, C., Trepper, T., Gingerich, W., & McCollum, E. (Eds.) (2012). Solution-focused brief therapy: A handbook of evidence-based practice. Oxford University Press.' },
    { citation: 'Gingerich, W.J., & Peterson, L.T. (2013). Effectiveness of solution-focused brief therapy: A systematic qualitative review of controlled outcome studies. Research on Social Work Practice, 23(3), 266–283.' },
    { citation: 'Kim, J.S. (2008). Examining the effectiveness of solution-focused brief therapy: A meta-analysis. Research on Social Work Practice, 18(2), 107–116.' },
    { citation: 'Macdonald, A. (2011). Solution-focused therapy: Theory, research & practice (2nd ed.). SAGE Publications.' },
    { citation: 'Trepper, T.S., Dolan, Y., McCollum, E.E., & Nelson, T. (2006). Steve de Shazer and the future of solution-focused therapy. Journal of Marital and Family Therapy, 32(2), 133–139.' },
    { citation: 'Stams, G.J., Dekovic, M., Buist, K., & De Vries, L. (2006). Effectiviteit van oplossingsgerichte korte therapie: Een meta-analyse [Efficacy of solution focused brief therapy]. Gedragstherapie, 39, 81–95.' },
    { citation: 'Henden, J. (2008). Preventing suicide: The solution focused approach. John Wiley & Sons.' },
    { citation: 'Lipchik, E. (2002). Beyond technique in solution-focused therapy: Working with emotions and the therapeutic relationship. Guilford Press.' },
    { citation: 'O\'Connell, B. (2005). Solution-focused therapy (2nd ed.). SAGE Publications.' },
    { citation: 'Murphy, J.J. (2015). Solution-focused counseling in schools (3rd ed.). American Counseling Association.' },
    { citation: 'Ratner, H., George, E., & Iveson, C. (2012). Solution focused brief therapy: 100 key points and techniques. Routledge.' },
    { citation: 'Bannink, F. (2010). 1001 solution-focused questions: Handbook for solution-focused interviewing (2nd ed.). W.W. Norton.' }
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
}return t;}
function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words');
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
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
