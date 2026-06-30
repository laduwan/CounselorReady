import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = 'cr-cli-607-group-therapy-design-facilitation';

const COURSE = {
  title: 'Group Therapy: Design, Facilitation, and Common Pitfalls',
  slug: SLUG,
  courseCode: 'CR-CLI-607',
  description: 'This course provides licensed mental health professionals with a comprehensive foundation in group therapy — from theoretical underpinnings and group design through facilitation skills, ethical considerations, and common clinical pitfalls. Drawing on decades of group psychotherapy research and Yalom\'s foundational therapeutic factors model, clinicians will develop practical skills for leading effective therapy groups across a variety of settings and populations.',
  shortDescription: 'Master group therapy design, facilitation skills, Yalom\'s therapeutic factors, and how to navigate common group pitfalls in clinical practice.',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  prerequisites: 'Basic counseling skills and experience working with individual clients. Some prior group work experience helpful but not required.',
  learningObjectives: [
    'Describe Yalom\'s eleven therapeutic factors and how they operate in group therapy',
    'Design an effective therapy group including purpose, composition, structure, and setting',
    'Identify facilitation skills essential to effective group leadership',
    'Recognize and intervene with common group dynamics including scapegoating, monopolizing, and resistance',
    'Apply ethical principles to group therapy including confidentiality, informed consent, and boundary management',
    'Distinguish between different group formats (process, psychoeducational, support) and their appropriate indications'
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
      title: 'Introduction: The Power and Complexity of Group Therapy',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Group Therapy: Design, Facilitation, and Common Pitfalls',
          subtitle: 'From Yalom\'s therapeutic factors to practical group leadership'
        },
        {
          type: 'text',
          content: `<h2>Why Group Therapy?</h2>
<p>Group therapy is one of the most powerful and underutilized modalities in mental health treatment. Meta-analyses consistently demonstrate that group therapy produces outcomes equivalent to individual therapy across a wide range of presenting concerns — including depression, anxiety, substance use disorders, personality pathology, trauma, and bereavement — while providing treatment to multiple clients simultaneously and at lower per-client cost.</p>
<p>Beyond efficiency, group therapy offers something individual therapy cannot: a real-time social laboratory. In group, clients don't just talk about their interpersonal difficulties — they enact them, observe them, and work through them in the presence of others who can provide genuine feedback and authentic human connection. The group itself becomes a therapeutic instrument.</p>
<p>Despite this, most training programs provide comparatively little group therapy preparation, and many licensed clinicians feel underprepared to lead groups. This course addresses that gap with practical, applied training in group design, facilitation, dynamics management, and ethics — anchored in the research that actually supports what works in group therapy.</p>`
        },
        {
          type: 'text',
          content: `<h2>Yalom's Therapeutic Factors: The Core of Group Therapy</h2>
<p>Irvin Yalom's model of therapeutic factors — also called curative factors — remains the foundational theoretical framework for understanding how and why group therapy works. Yalom identified eleven factors, active to varying degrees in different groups and at different stages, that contribute to client change. Understanding each factor at a clinical level — not just as a label but as a dynamic you can recognize and actively cultivate — is essential for effective group leadership.</p>

<h3>1. Instillation of Hope</h3>
<p>Observing that other group members have improved — or are improving — generates hope that change is possible. For clients who feel stuck, hopeless, or uniquely broken, watching peers progress is powerfully therapeutic. The leader cultivates hope explicitly: "Many people who have sat where you're sitting have told me that by the end of our time together, they felt very differently."</p>
<p><strong>Clinical depth:</strong> Hope instillation is most active in the early group stage when members are most skeptical. A skilled group leader leverages testimonials from returning members in open groups ("Would anyone like to share where you were when you started?"), or early disclosures of progress in closed groups. Hope is not cheerleading — it is the clinical act of pointing to evidence. When a client is mired in despair, having three other people in the room who are further along in the same struggle is more convincing than any therapeutic interpretation. Leaders who underestimate hope instillation often fail to include members at different stages in open groups, losing one of the most powerful early interventions available. Watch for: a new member arriving deeply demoralized — the appropriate first intervention may not be reflection or Socratic questioning but the deliberate facilitation of hope-generating exchange with more advanced group members.</p>

<h3>2. Universality</h3>
<p>"I thought I was the only one." The discovery that others share similar struggles, shameful thoughts, or painful experiences reduces isolation and self-condemnation. This is often cited as the most immediately impactful early-group factor. Groups that create safety for authentic self-disclosure amplify universality.</p>
<p><strong>Clinical depth:</strong> Universality is particularly powerful around shame-laden experiences — intrusive thoughts, violent ideation, sexual concerns, self-loathing, the wish to give up. These are the very contents that clients are least likely to disclose in individual therapy, where the asymmetric relationship can feel evaluative. In group, when one member takes the risk of naming something shameful and three others say "me too," the therapeutic impact is immediate and often irreversible. The leader cultivates universality by creating an atmosphere of psychological safety before any disclosure is attempted, by responding to early disclosures without shock or excessive curiosity, and by gently inviting others to connect: "Has anyone else had an experience that resonates with what Maria just described?" Universal nods, sounds of recognition, and shared language all signal that universality is working. Failure of universality — when a member shares and others respond with silence or subtle distancing — is clinically significant and must be addressed directly by the leader.</p>

<h3>3. Imparting Information</h3>
<p>Psychoeducation from the leader, and information shared by peers ("When I tried that, here's what happened"). Psychoeducational groups emphasize this factor most explicitly, but it operates in all groups.</p>
<p><strong>Clinical depth:</strong> Information in groups travels differently than information from an individual therapist. Peer-delivered information carries a kind of credibility that expert-delivered information cannot fully replicate — it comes from someone who has been where the listener is, who has no professional authority and no incentive to say "it gets better" if it doesn't. Psychoeducational group formats (DBT skills groups, MBSR, anger management protocols, anxiety management groups) are deliberately structured to maximize information imparting. In process groups, the leader's role in information imparting is more limited — excessive leader teaching can actually undermine the group's development toward member-to-member interaction. Even in process groups, however, psychoeducation about group process itself ("what you're experiencing right now — the anxiety about being seen — is one of the most common early group experiences") can normalize and facilitate engagement.</p>

<h3>4. Altruism</h3>
<p>The experience of contributing meaningfully to others' wellbeing. Group members who feel ineffectual, low in self-esteem, or burdensome discover that they have something to offer. Being helpful is itself therapeutic — and group therapy uniquely provides this opportunity.</p>
<p><strong>Clinical depth:</strong> Many clients who present for mental health treatment carry deep convictions that they are useless, burdensome, or have nothing of value to contribute. Altruism directly challenges this schema in a way that no amount of therapeutic persuasion can match — because the evidence is experiential and witnessed by others. A client who listens carefully to a peer in distress and says exactly the right thing, and sees that peer's face change, has evidence of their own value that is hard to disconfirm. Leaders who monopolize the helper role — by always being the first to respond, by providing the insight before the group can — inadvertently deprive members of the altruism experience. Deliberately holding back, creating space for members to help each other, and explicitly reflecting on moments of peer helpfulness ("Did anyone notice what just happened? Marcus said something that clearly landed — Marcus, what was it like to see that impact you had?") cultivates altruism as a therapeutic tool.</p>

<h3>5. Corrective Recapitulation of the Primary Family Group</h3>
<p>Many clients enter groups with patterns developed in their families of origin. The group, with its authority figure (leader) and peers (siblings), recreates family-like dynamics — but with the opportunity to work them through differently. The leader's role here is to notice when clients are enacting family patterns and facilitate productive exploration.</p>
<p><strong>Clinical depth:</strong> This is one of the most complex therapeutic factors because it operates largely outside conscious awareness. The client who consistently plays the peacemaker in the group may be recreating their role in a high-conflict family. The member who is furious at the leader for "favoring" another member may be working through sibling rivalry. The member who only speaks when directly invited may be recreating the experience of being invisible in their family. The therapeutic opportunity lies in recognizing these patterns and creating conditions in which the client can experiment with a different response — not through interpretation alone, but through corrective experience. When the leader responds to a client's conflict-avoiding behavior differently than their parent did (not with anger, not with abandonment, not with praise, but with genuine curiosity), the client has a new data point about what's possible. "You braced for something — what did you expect when you disagreed with me just now? What actually happened?"</p>

<h3>6. Development of Socializing Techniques</h3>
<p>Group therapy is social skills training by another name. Feedback from peers, practice with interpersonal risk-taking, and observation of others' social behavior all build interpersonal competence.</p>
<p><strong>Clinical depth:</strong> This factor is most explicit in structured social skills training groups — groups for people with autism spectrum disorder, social anxiety, or significant personality pathology. But it operates in all groups, often implicitly. A member who has never learned how to disagree without catastrophizing practices doing it in group. A member who has never experienced being genuinely listened to discovers what that feels like when peers attend carefully to their words. Group therapy provides repeated, low-stakes practice in the fundamental skills of human connection — listening, disclosing, receiving feedback, navigating conflict, repairing ruptures. These skills are not taught didactically (though psychoeducational groups may supplement with explicit teaching) but practiced experientially in real interactions with real consequences.</p>

<h3>7. Imitative Behavior</h3>
<p>Members learn from observing each other — how a peer handles confrontation, how they express vulnerability, how they respond to feedback. This observational learning is often more powerful than explicit instruction.</p>
<p><strong>Clinical depth:</strong> Bandura's social learning theory finds one of its purest clinical applications in group therapy. When a member watches a peer take the risk of expressing anger directly and non-destructively — and observes that the sky does not fall, that the relationship repairs — they gain vicarious permission to try the same. When they watch a peer receive difficult feedback with grace and curiosity rather than collapse or defensiveness, they have a new template. The leader facilitates imitative behavior by acknowledging moments of skillful member behavior explicitly: "I want to name what just happened. David received some really hard feedback, and instead of getting defensive or shutting down, he stayed curious. What was that like to watch?" This creates a feedback loop where adaptive behavior is witnessed, named, and learned from — rather than passing unnoticed in the flow of conversation.</p>

<h3>8. Interpersonal Learning</h3>
<p>The most complex and arguably most powerful therapeutic factor. Members learn about their interpersonal style through real-time feedback and through the group's response to them. "The way you just responded made me want to pull away — is that what happens in your relationships outside?" This can only happen in group.</p>
<p><strong>Clinical depth:</strong> Interpersonal learning is the therapeutic factor most specific to group — it is what group therapy uniquely offers that individual therapy cannot replicate. The mechanism is the social microcosm: clients inevitably bring their characteristic interpersonal patterns into the group. The person who dominates at work will dominate in group. The person who is self-effacing with authority will shrink toward the leader. The person who drives people away with excessive need will do it in group too. And because it happens in real time, in front of witnesses who are also experiencing it, the feedback is immediate, multi-sourced, and hard to explain away. "When three people independently tell me they feel pushed away when I talk about my problems, I can't dismiss all three as wrong." The leader's task is to help the group understand that what happens between members in the room is the same thing that happens in members' outside lives — and that the group is therefore a live laboratory for change. Techniques include: "How is what's happening between you and Sara right now like patterns you recognize in your outside life?" "What do you imagine people typically experience when they're around you?" "What would you want someone to know about being in a relationship with you?"</p>

<h3>9. Group Cohesiveness</h3>
<p>The group equivalent of therapeutic alliance — the bond members feel with each other and with the group as an entity. Cohesiveness is both a therapeutic outcome and a precondition for deeper work: members who feel genuinely connected are more willing to take risks, give honest feedback, and engage with difficult material.</p>
<p><strong>Clinical depth:</strong> Cohesiveness is the single most researched process variable in group therapy, and the research is consistent: higher cohesiveness predicts better outcomes. Cohesiveness develops through shared experience, genuine disclosure, effective conflict resolution, and the accumulation of sessions. The leader cultivates cohesiveness by: structuring early sessions to generate shared experience and disclosure; facilitating moments of genuine connection between members; modeling interest in and care for each member; intervening on dynamics (scapegoating, subgrouping, dropouts) that threaten cohesion; and creating rituals and traditions that give the group a sense of identity. Cohesiveness is easily damaged — by a member dropout, by a leader absence, by an unresolved conflict, by a boundary violation. Leaders should monitor cohesion as actively as they monitor individual member progress, using check-ins, member feedback, and their own relational sense of the room.</p>

<h3>10. Catharsis</h3>
<p>Emotional expression — crying, expressing anger, naming pain — in the presence of others who witness and accept that expression. Unlike private catharsis, group catharsis occurs in a relational context that can transform it from mere discharge into integration.</p>
<p><strong>Clinical depth:</strong> The research on catharsis is more nuanced than the popular "it's good to express feelings" narrative. Emotional expression alone — venting without reflection — is not reliably therapeutic and can be retraumatizing in some contexts. What makes catharsis therapeutic in group is the relational container: when a member expresses grief or rage or terror and the group sits with them — bears witness without flinching, without fixing, without shrinking — the experience is not just discharge but integration. "I was so afraid I would fall apart and destroy everything, but I cried in front of all of you and nothing terrible happened — and you're still here." The leader's role is to protect the cathartic experience (preventing premature intellectualization or rescuing), to facilitate the group's witnessing response, and to help the member integrate the experience before the session ends. Catharsis that is uncontained or unwitnessed can leave members worse off; catharsis that is metabolized in community can produce lasting change.</p>

<h3>11. Existential Factors</h3>
<p>Confronting existential realities — death, freedom, isolation, meaninglessness — within the group. This factor is often underemphasized but is particularly central in bereavement, illness, or end-of-life groups. The group provides a context for facing these realities together rather than alone.</p>
<p><strong>Clinical depth:</strong> Existential factors are most active in groups where mortality is a present reality — oncology support groups, bereavement groups, groups for older adults, HIV/AIDS groups. But existential material surfaces in all groups: the recognition that we are ultimately responsible for our own lives, that we must choose even when we don't want to, that connection never fully extinguishes isolation, that meaning must be found rather than given. When a group member grapples with one of these realities, the group's response — not therapizing it, not rushing to solutions, but staying present with the enormity — can be profoundly healing. The leader who is comfortable with existential material (having done their own work on mortality, meaning, and isolation) creates space for it to be held. The leader who is anxious about these themes will subtly steer the group away, depriving members of one of the deepest levels of group work.</p>

<h3>How to Cultivate Therapeutic Factors Intentionally</h3>
<p>Skilled group leaders don't passively hope these factors emerge — they actively cultivate them based on the group's current stage and clinical needs. A useful framework:</p>
<ul>
<li><strong>Early group (Sessions 1–4):</strong> Prioritize hope, universality, and imparting information. Safety-building precedes depth. Structure is an ally. Every intervention should move toward "you're not alone, and change is possible here."</li>
<li><strong>Middle group (Sessions 5–15):</strong> Cultivate cohesiveness, interpersonal learning, altruism, and corrective family recapitulation. This is when process work becomes primary. Facilitator moves back; member-to-member work moves forward. The social microcosm is most active.</li>
<li><strong>Late group and termination (Final 3–5 sessions):</strong> Catharsis, existential factors, and the integration of interpersonal learning. Members are processing what they've gained and what they're losing. Termination is itself a therapeutic event that recapitulates attachment, loss, and growth.</li>
</ul>
<p>Research by Kivlighan and Goldfine (1991) confirmed that members emphasize different therapeutic factors at different stages — hope and universality early, interpersonal learning and existential factors later — underscoring that the leader must calibrate interventions to stage of development, not simply apply a uniform approach throughout the group's life.</p>`
        },
        {
          type: 'text',
          content: `<h2>Group Formats: Not All Groups Are the Same</h2>
<p>Before designing a group, clinicians must understand the differences between group formats and choose the right one for their population, setting, and purpose. Format selection is not a minor administrative decision — it determines the therapeutic mechanisms that will be active, the skills the leader needs, the appropriate population, and what outcomes can realistically be achieved.</p>

<h3>Process / Interpersonal Groups</h3>
<p>Process or interpersonal groups focus on the here-and-now interpersonal experience within the group itself. Members explore how they interact with each other in real time, with the group relationship as the primary vehicle of change. These are closest to Yalom's model and activate the full range of therapeutic factors — particularly interpersonal learning, cohesiveness, corrective family recapitulation, and catharsis. They require the highest level of group therapy training to facilitate.</p>
<p><strong>Evidence base:</strong> Process groups have the strongest evidence base for personality pathology (particularly borderline, dependent, and avoidant presentations), relational concerns, social anxiety, and generalized distress. Meta-analyses show outcomes equivalent to individual CBT for depression and anxiety, with particular advantages for interpersonal functioning.</p>
<p><strong>Best suited for:</strong> Outpatient settings; clients with relational concerns; personality pathology; clients with the motivation and ego strength for interpersonal work; clients seeking deeper character change rather than symptom reduction alone.</p>
<p><strong>Leader skills required:</strong> Comfort with ambiguity and unstructured process; ability to track multiple simultaneous relationships; process commentary; here-and-now facilitation; tolerance for conflict.</p>

<h3>Psychoeducational Groups</h3>
<p>Psychoeducational groups deliver a structured curriculum to multiple clients simultaneously. They are leader-directed; members receive information, learn skills, and practice together. The therapist functions more as educator and facilitator than as group process leader. Therapeutic factors most active: imparting information, instillation of hope, universality, development of socializing techniques.</p>
<p><strong>Evidence base:</strong> Psychoeducational groups have strong evidence for specific conditions when using manualized protocols. DBT skills groups (Linehan, 1993) are the gold standard intervention for borderline personality disorder. MBSR groups have robust evidence for chronic pain, anxiety, and depression relapse prevention. Psychoeducational groups for bipolar disorder improve medication adherence and reduce relapse. Anger management groups produce significant reductions in aggressive behavior.</p>
<p><strong>Best suited for:</strong> Community mental health; high-caseload settings; clients with specific skill deficits; short-term treatment; settings where insurance reimbursement requires structured, diagnosable-to-treatment interventions; clients who are not ready for interpersonal process work.</p>
<p><strong>Leader skills required:</strong> Knowledge of the specific curriculum; didactic teaching skills; ability to manage group learning dynamics; time management within structured sessions.</p>

<h3>Cognitive-Behavioral Groups (CBT Groups)</h3>
<p>CBT groups are structured, protocol-driven groups delivering cognitive-behavioral interventions to clients with specific conditions. They differ from psychoeducational groups in that they apply cognitive restructuring, behavioral experiments, and exposure-based techniques to members' live clinical material — not just teach skills abstractly.</p>
<p><strong>Evidence base:</strong> CBT groups have the most robust evidence of any group format for specific diagnostic presentations. Randomized controlled trials support CBT groups for: social anxiety disorder (equivalent to individual CBT, with group exposure having unique advantages), depression, OCD, panic disorder, health anxiety, and PTSD. Group CBT for social anxiety is particularly powerful because the group itself provides a real-time social exposure situation.</p>
<p><strong>Best suited for:</strong> Clients with specific disorders (depression, anxiety, OCD, phobias); time-limited settings; insurance-funded services requiring structured treatment; clients who prefer a directive, skills-focused approach over relational exploration.</p>
<p><strong>Unique advantages over individual CBT:</strong> Observational learning (watching peers challenge distortions reduces vicarious anxiety); group as social exposure opportunity; peer accountability for behavioral experiments; universality of cognitive patterns reduces stigma.</p>

<h3>Support Groups</h3>
<p>Support groups focus on mutual support, universality, and shared experience around a specific life circumstance, identity, or challenge. Professionally-led support groups differ meaningfully from peer-led ones (such as AA, NAMI Family Support) in terms of clinical oversight, crisis management capacity, and the leader's ability to address psychological dynamics that emerge.</p>
<p><strong>Evidence base:</strong> Support groups have good evidence for: bereavement outcomes (reducing complicated grief), cancer-related distress (Spiegel's landmark work on survival, though more recent replications are mixed), caregiver burnout, and chronic illness adjustment. Mutual support among people with shared experience is itself therapeutic, independent of formal therapeutic intervention.</p>
<p><strong>Best suited for:</strong> Bereavement; chronic illness; addiction recovery support; LGBTQ+ identity-related concerns; caregiver support; trauma survivors who need community before they can engage in deeper process work.</p>
<p><strong>Important distinction:</strong> Professionally-led support groups require group therapy competencies even when they are "supportive" in orientation. Crisis presentations, member conflict, scapegoating, and complicated grief all require clinical skill to manage. A social worker who believes running a "support group" doesn't require training is underestimating the complexity.</p>

<h3>Skills-Based Groups</h3>
<p>Skills-based groups focus on developing specific competencies through structured practice. They overlap with psychoeducational and CBT groups but may be more behavioral in focus. Examples include: social skills training groups for adolescents with ASD; parenting skills groups; assertiveness training groups; emotional regulation skills groups; communication skills groups for couples (though these are technically dyadic).</p>
<p><strong>Evidence base:</strong> Social skills training groups have strong evidence for ASD, social anxiety, and schizophrenia-spectrum presentations. Parenting skills groups (Triple P, PCIT group adaptations) have the strongest evidence base in child mental health. The structure of behavioral practice in group settings — with real-time feedback and modeling — produces skill acquisition more efficiently than dyadic instruction for many clients.</p>

<h3>Open vs. Closed Groups: A Clinical Decision</h3>
<p><strong>Closed groups</strong> begin and end with the same members; they go through developmental stages together, develop deep cohesion, and can do progressively deeper work. The developmental trajectory is predictable. Loss of a member is experienced as a group rupture. Best for: outpatient process groups; CBT groups with sequential curriculum; populations with capacity for sustained commitment.</p>
<p><strong>Open groups</strong> allow members to join and leave at any time; they sacrifice developmental cohesion for accessibility. The group never fully completes the "storming" stage; there is less interpersonal depth. However, open groups have significant clinical advantages: new members are continuously exposed to members at more advanced stages (hope instillation); members can access treatment when they are ready rather than waiting for the next cohort; the group is more resilient to dropout. Best for: community mental health; inpatient or partial hospital settings; support groups where the shared experience rather than interpersonal development is primary.</p>
<p>The right choice depends on setting, population, and therapeutic goals — and should be made deliberately, not defaulted into based on administrative convenience.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Group Therapy Foundations',
          takeaways: [
            'Group therapy produces outcomes equivalent to individual therapy across most presenting concerns — while treating multiple clients simultaneously',
            'Yalom\'s 11 therapeutic factors describe HOW group therapy works: hope, universality, altruism, cohesiveness, interpersonal learning, and others',
            'Interpersonal learning — real-time feedback about one\'s relational patterns — is the factor uniquely available only in group, not individual therapy',
            'Group cohesiveness is both an outcome and a prerequisite for deeper therapeutic work',
            'Group format selection (process, psychoeducational, support, CBT) should match the population, setting, and therapeutic goals',
            'Open groups offer accessibility but sacrifice the developmental cohesion of closed groups'
          ]
        },
        {
          type: 'multipleChoice',
          question: 'According to Yalom, which therapeutic factor uniquely occurs only in group therapy and cannot be replicated in individual treatment?',
          options: [
            { text: 'Catharsis', isCorrect: false },
            { text: 'Instillation of hope', isCorrect: false },
            { text: 'Interpersonal learning through real-time feedback', isCorrect: true },
            { text: 'Imparting information', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Interpersonal learning — receiving authentic, real-time feedback about one\'s interpersonal style from peers who have direct experience of it — is uniquely available in group therapy. The leader can tell a client about their relational patterns, but hearing it from multiple peers who are directly experiencing it carries a different and often more powerful impact.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are among Yalom\'s eleven therapeutic factors? Select all that apply.',
          options: [
            { text: 'Universality', isCorrect: true },
            { text: 'Transference interpretation', isCorrect: false },
            { text: 'Altruism', isCorrect: true },
            { text: 'Group cohesiveness', isCorrect: true },
            { text: 'Systematic desensitization', isCorrect: false }
          ],
          explanation: 'Universality, altruism, and group cohesiveness are among Yalom\'s eleven therapeutic factors. Transference interpretation is a psychodynamic technique, not a Yalom therapeutic factor. Systematic desensitization is a behavioral technique. Yalom\'s factors describe the relational and experiential mechanisms of change in group therapy.'
        }
      ]
    },
    {
      title: 'Group Design and Facilitation Skills',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Designing and Leading Effective Groups',
          subtitle: 'Pre-group preparation, facilitation skills, and managing difficult dynamics'
        },
        {
          type: 'text',
          content: `<h2>Designing a Group: Pre-Group Preparation</h2>
<p>The most important group therapy work happens before the first session. Thoughtful group design — purpose, composition, structure, and setting — is the single most powerful predictor of group success. Groups that are poorly designed tend to fail in predictable ways: members dropout, conflict becomes unmanageable, or the group never achieves cohesion. Clinicians who invest time in careful pre-group work find that the group runs with noticeably less intervention and achieves significantly better outcomes.</p>

<h3>1. Defining Purpose and Selecting a Format</h3>
<p>What is this group for? The answer should be specific: "A closed-format 12-week process group for adults with chronic depression in an outpatient setting" is a clear purpose. "A group for people having a hard time" is not. Purpose drives every subsequent design decision — composition, structure, norms, and facilitation style.</p>
<p>Ask yourself: What change mechanism am I trying to activate? If interpersonal learning is the primary mechanism, a process format is indicated. If skill acquisition is the goal, a psychoeducational or CBT group format is indicated. If shared experience and community are primary, a support group format is indicated. The therapeutic factors most active in each format differ significantly (see Section 1), and your facilitation style, session structure, and composition decisions should all align with the format you select.</p>

<h3>2. The Pre-Group Screening Interview</h3>
<p>Pre-group individual screening — meeting with each prospective member before the group begins — is the most evidence-supported preparation practice in group therapy. Studies consistently show that prepared members have significantly lower dropout rates, develop therapeutic alliances more quickly, and engage in meaningful disclosure earlier in the group's life. Despite this evidence, many clinicians skip this step due to time constraints, treating it as a luxury. It is not optional for interpersonal process groups.</p>
<p><strong>What the pre-group interview accomplishes:</strong></p>
<ul>
<li><strong>Clinical assessment:</strong> Determine whether this client is appropriate for this group at this time. Assess crisis stability, interpersonal capacity, cognitive ability, and motivation. This is not rejection — it is appropriate level-of-care matching. A client who is not ready for group may be an excellent candidate in three months after stabilization in individual therapy.</li>
<li><strong>Psychoeducation:</strong> Explain what group therapy is and is not. Many clients have misconceptions ("Am I going to have to talk about my childhood in front of strangers?" "Will people judge me?"). Accurate expectations reduce anxiety and dropout. Describe the format, session structure, expectations for attendance and participation, and what happens if they miss a session.</li>
<li><strong>Goal setting:</strong> Identify what the client wants to get from the group experience. What interpersonal patterns do they recognize? What do they want to be different in their relationships? Goals formed before the group provide benchmarks for progress and give the client a sense of direction.</li>
<li><strong>Beginning the therapeutic relationship:</strong> The pre-group meeting is the first contact with the leader. This relationship matters — members with stronger leader alliance early in the group tend to develop stronger group cohesion. Begin it thoughtfully.</li>
<li><strong>Answering informed consent questions:</strong> The pre-group meeting is the appropriate time to review informed consent in detail, including confidentiality limits, attendance expectations, financial policies, and the nature of group therapy.</li>
</ul>
<p><strong>Inclusion criteria for most outpatient process groups:</strong></p>
<ul>
<li>Presenting concern is appropriate for the group's format and goals</li>
<li>Sufficient verbal, cognitive, and social capacity to participate in group interaction</li>
<li>Crisis stability: not actively suicidal, psychotic, or so destabilized that they need higher-level care before engaging in group</li>
<li>Willingness to attend regularly and engage with other members, not just the leader</li>
<li>Some capacity for self-reflection and the ability to consider one's impact on others</li>
</ul>
<p><strong>Absolute exclusion criteria for most outpatient process groups:</strong></p>
<ul>
<li>Active psychosis, mania, or severe dissociation — these require higher-level care and would be unsafe or untherapeutic in an outpatient group setting</li>
<li>Active suicidal intent requiring intensive intervention — the group setting cannot provide the level of monitoring and support needed; stabilize in individual or intensive outpatient first</li>
<li>Severe cognitive impairment affecting comprehension of group interaction</li>
<li>Sociopathic or predatory traits that would render the group unsafe for other members</li>
<li>Relationship with another group member that would create a disruptive dual relationship within the group (e.g., a couple, close friends, or an employer/employee dyad)</li>
</ul>
<p><strong>Relative exclusion criteria</strong> (requiring careful clinical judgment):</p>
<ul>
<li>Active substance use that is not being managed — intoxication in group sessions is not manageable and undermines the group; sobriety requirements should be specified in advance</li>
<li>Recent acute trauma — some clients in the acute phase of trauma are better served by stabilization before joining an interpersonal group where trauma material may surface without adequate containment</li>
<li>Extreme social anxiety that makes group participation impossible without individual preparation and possibly concurrent individual treatment</li>
</ul>

<h3>3. Informed Consent for Group Therapy</h3>
<p>Informed consent for group therapy has both standard and group-specific elements. Written informed consent should be supplemented by a verbal discussion in the pre-group meeting. Group-specific informed consent elements include:</p>
<ul>
<li><strong>Confidentiality limits:</strong> The leader maintains their own confidentiality obligations, but cannot legally enforce confidentiality among members. Members may disclose outside the group what they hear, and the leader cannot prevent this. This limitation must be disclosed clearly, and the leader should establish explicit group norms around confidentiality as a supplement to (not replacement for) this disclosure.</li>
<li><strong>Attendance expectations:</strong> Regular attendance is a clinical necessity in closed groups, not just a preference. Missing sessions disrupts other members' sense of safety and the group's developmental continuity. Clients should understand that consistent attendance is expected and that repeated absences may result in a referral to individual therapy.</li>
<li><strong>No outside relationships:</strong> Many leaders establish explicit norms against romantic or sexual involvement among group members during the course of treatment, and specify norms around outside contact (e.g., no text message exchanges that remain private from the group). These expectations should be disclosed before the group begins.</li>
<li><strong>What happens if someone joins or leaves (for open groups):</strong> Members of open groups should understand that new members will join and others will leave, and what the process will look like when transitions occur.</li>
<li><strong>The leader's role and theoretical orientation:</strong> Clients have a right to understand the type of therapy they are receiving, including the leader's theoretical orientation, the structure of sessions, and what they can expect the leader to do and not do.</li>
<li><strong>Fee structure and cancellation policy:</strong> Including whether individual sessions will be charged separately if the client is also in individual therapy with the same provider.</li>
</ul>

<h3>4. Group Composition Decisions</h3>
<p>Research on group composition yields an important and counterintuitive finding: homogeneity in problem area or diagnosis combined with heterogeneity in coping style and interpersonal style produces the most productive process groups. Members who all have depression but cope and relate differently from each other will generate more interpersonal learning than a group that is homogeneous in every dimension.</p>
<p>The clinical logic is straightforward: if everyone in the group copes the same way (for example, all members are avoidant), there is no one to offer an alternative model. Heterogeneity in coping style means members encounter approaches to problems they haven't considered, and interact with people whose relational style differs from their habitual environment — which is exactly the learning opportunity the group is designed to provide.</p>
<p>Composition considerations beyond diagnosis:</p>
<ul>
<li><strong>Developmental stage and age:</strong> Grouping members too far apart in developmental stage (e.g., a 25-year-old navigating first relationships with a 65-year-old in retirement) can reduce universality and create engagement difficulties. This matters more in some groups than others — grief groups may span wide age ranges productively; young adult groups may be specifically age-limited.</li>
<li><strong>Trauma history:</strong> In general-purpose outpatient groups, it is wise to screen for active PTSD presentations that might be easily destabilized by others' trauma material and respond with dissociation or flooding that disrupts the group.</li>
<li><strong>Interpersonal dominance:</strong> A group in which two members have high dominance/control tendencies may spend most of its energy managing their rivalry rather than doing therapeutic work. One dominant member is workable; more requires compositional adjustment.</li>
<li><strong>Cultural and identity diversity:</strong> Deliberate attention to cultural composition acknowledges that race, ethnicity, gender, sexual orientation, religion, and class are clinical variables, not demographic footnotes. A group with only one member of a particular race or gender may inadvertently put that person in the position of representing their entire demographic group — which is burdensome and limits their therapeutic work.</li>
</ul>

<h3>5. Group Size, Duration, and Frequency</h3>
<p>The optimal size for interpersonal process groups is 7–8 members. Smaller groups (below 5) can't generate adequate interpersonal complexity; there aren't enough perspectives or relational dynamics. Larger groups (above 10) make it difficult for every member to participate meaningfully in 90 minutes — some members will consistently disengage while others dominate. Psychoeducational groups can be larger (12–15) because the format is less relational and the leader is more directive.</p>
<p>For closed outpatient groups, 12–20 sessions is the most common range. Brief groups (8–12 sessions) are appropriate for focused psychoeducational or CBT interventions. Longer-term groups (20+ sessions, or ongoing open groups) are appropriate for interpersonal process work with personality pathology or chronic presentations. The research literature on "dose" of group therapy generally supports this range: significant gains are achievable in 12–16 sessions for focused interventions; personality and character change typically require longer treatment.</p>
<p>Weekly 90-minute sessions are the standard for interpersonal process groups. The 90-minute duration is not arbitrary: it allows sufficient time to establish context through opening (15–20 minutes), move through multiple member interactions and process commentary (50–60 minutes), and return to a stable place before ending (10–15 minutes). Sessions shorter than 75 minutes frequently end before members have had time to do meaningful work. Sessions longer than 120 minutes can become exhausting and produce material that the group cannot adequately process before the end.</p>

<h3>6. Establishing Group Norms and Group Agreements</h3>
<p>Group norms — the implicit and explicit rules that govern member behavior — are established in the first two sessions and persist, often with remarkable tenacity, throughout the group's life. The leader who understands this will invest significant attention in norm-setting early, because norms established inadvertently are much harder to change than norms established deliberately.</p>
<p><strong>The group agreement:</strong> Many leaders develop a written or verbal group agreement reviewed in Session 1 that covers:</p>
<ul>
<li>Confidentiality expectations and their limits</li>
<li>Attendance commitment (what to do if you cannot attend; how many sessions can be missed before the group needs to discuss your membership)</li>
<li>How feedback is given (from the first-person perspective; focus on behavior rather than character; both positive and challenging feedback are expected)</li>
<li>Norms around outside contact between members (some leaders prohibit it entirely during treatment; others ask that outside interactions be brought back into the group)</li>
<li>Norms around substance use (arriving to group under the influence is grounds for not participating in that session)</li>
<li>What happens at the end of the group (how will termination be handled)</li>
</ul>
<p><strong>Norms the leader models:</strong> Beyond explicit agreements, leaders communicate norms through their own behavior. A leader who begins sessions on time signals that time is valued. A leader who maintains a non-anxious, curious stance in the face of conflict signals that conflict is safe here. A leader who responds to a member's disclosure with genuine interest (not with a pivot to problem-solving) signals that vulnerability will be received with care. The leader's behavior in the first two sessions creates the normative template the group will follow for its entire life.</p>
<p><strong>Process norms vs. content norms:</strong> In process groups, one of the most important norms to establish is the expectation of process-level communication — speaking in the first person about one's experience of others, rather than talking about external events and relationships. "Tell us what's happening for you right now, in this room, with these people" is a norm that must be established early and returned to consistently, because clients will naturally default to outside-content focus unless the leader actively redirects to the here-and-now.</p>`
        },
        {
          type: 'text',
          content: `<h2>Group Stages: What to Expect Over Time</h2>
<p>Groups, like individuals, develop over time. Recognizing the stage of a group's development allows the clinician to calibrate their facilitation appropriately — what works in Stage 1 can derail Stage 3 work, and vice versa.</p>
<p><strong>Stage 1: Formation and Engagement (early group)</strong><br>Members are orienting: Is this safe? Do I belong here? Will these people understand me? The leader is central, structure is helpful, and member-to-leader interaction is prominent. Universal themes surface quickly (universality factor). The leader's primary tasks: create safety, establish norms, facilitate initial disclosure, and help members identify connections to each other.</p>
<p><strong>Stage 2: Conflict and Challenge (storming)</strong><br>Often emerging around sessions 3–6, this stage involves increased conflict — between members, and sometimes with the leader. Members test norms, challenge the leader's authority, and assert individuality. This is normal and necessary. Groups that skip this stage (through over-control by the leader) often stall at superficial cohesion. The leader's task: stay non-anxious, model handling conflict productively, and use conflict as material.</p>
<p><strong>Stage 3: Cohesion and Working Through (norming and performing)</strong><br>Genuine cohesion develops. Members take more interpersonal risks, give more authentic feedback, and engage with deeper material. The leader steps back from center; member-to-member interaction increases. Interpersonal learning is most active here.</p>
<p><strong>Stage 4: Termination</strong><br>Groups end, and the ending is itself therapeutic — or can be, when handled well. Themes of loss, gratitude, pride, and review emerge. The leader facilitates explicit processing of the ending, celebration of growth, and transition. Members who minimize termination often have avoidant patterns that the ending illuminates.</p>`
        },
        {
          type: 'text',
          content: `<h2>Core Facilitation Skills</h2>
<p>Effective group facilitation requires a specific skill set distinct from individual therapy. Many skilled individual therapists initially struggle in group because their habitual responses — forming a dyadic relationship, providing extensive individual reflection — work against the group's development.</p>
<p><strong>Activating member-to-member interaction:</strong> The leader's primary facilitation goal in process groups is to increase direct member-to-member interaction rather than channeling everything through themselves. Techniques:</p>
<ul>
<li>"Who in the group can respond to what Sarah just shared?"</li>
<li>"Does anyone have a reaction to what just happened between Marcus and Diane?"</li>
<li>[Silence] — allowing members to take up space rather than filling silence with leader commentary</li>
</ul>
<p><strong>Process commentary:</strong> Group process refers to the how of what's happening — the relational and emotional dynamics beneath the content. "We've been talking for 20 minutes about jobs and it feels like we're all working very hard to stay on safe ground. I wonder what's here that feels unsafe to approach?" Process commentary invites the group to look at itself — which is often where the richest work happens.</p>
<p><strong>Protecting members while maintaining safety:</strong> A member who is being piled on by the group, or who is being shamed, needs the leader to intervene. "Wait — I want to slow down here. I'm noticing several people coming at Marcus from the same direction. Let's check in with Marcus about how he's experiencing this."</p>
<p><strong>Managing self-disclosure:</strong> Leader self-disclosure in group is a calibrated tool, not a norm. Transparent sharing of immediate reactions ("I notice I'm feeling something protective when this topic comes up — I wonder if others are too") can be powerful. Personal narrative disclosure is rarely appropriate.</p>
<p><strong>Linking:</strong> Explicitly connecting themes across members and across sessions. "What just happened between you and Diane reminds me of what you described with your sister last week." Linking builds cohesion, deepens meaning, and helps members see their patterns across contexts.</p>`
        },
        {
          type: 'cardSort',
          title: 'Therapeutic Factors Sorting Activity',
          instructions: 'Sort each example into the Yalom therapeutic factor it best illustrates.',
          cards: [
            { text: 'A client says: "I thought I was the only one who felt this way. Hearing everyone else say the same thing changed everything."', category: 'Universality' },
            { text: 'A client who had felt burdensome realizes she helped another member significantly and says "I actually had something to offer."', category: 'Altruism' },
            { text: 'A member watches how a peer handles being challenged and thinks "I want to respond to confrontation the way she just did."', category: 'Imitative Behavior' },
            { text: 'Three members independently tell one client his humor seems to push people away — this is the same feedback he gets in his marriage.', category: 'Interpersonal Learning' },
            { text: 'A client, seeing others who were where she was six months ago, begins to believe her depression can actually get better.', category: 'Instillation of Hope' },
            { text: 'A usually guarded client cries openly about her grief for the first time, and the group sits with her in silence rather than trying to fix it.', category: 'Catharsis' }
          ],
          categories: ['Universality', 'Altruism', 'Imitative Behavior', 'Interpersonal Learning', 'Instillation of Hope', 'Catharsis'],
          explanation: 'Yalom\'s therapeutic factors describe the distinct pathways through which group therapy produces change. Each factor is active to varying degrees depending on the group\'s stage, format, and the specific interactions occurring. Skilled group leaders recognize which factors are active and how to cultivate them intentionally.'
        },
        {
          type: 'text',
          content: `<h2>Common Group Dynamics and How to Intervene</h2>
<p>Group therapy involves complex dynamics that can either be harnessed for therapeutic work or, if unaddressed, undermine the group entirely. Recognizing these dynamics — and intervening skillfully — is the most challenging aspect of group facilitation.</p>
<p><strong>The Monopolizer:</strong> A member who dominates airtime, often anxiously, in ways that frustrate other members and reduce their engagement. The monopolizer often has significant anxiety about silence or about others seeing their "real" self — the talk is protective. Interventions:</p>
<ul>
<li>Gently interrupt: "I want to make sure we have time to hear from everyone today — let's open this to the group."</li>
<li>Address the process privately in the session: "I notice you often take up a lot of the early group time. I'm curious what it's like for you when you're not talking?"</li>
<li>Invite the group to address it: "I want to check in with the group about something I've been noticing."</li>
</ul>
<p><strong>The Scapegoat:</strong> One member who absorbs the group's displaced anger, anxiety, or shame. Scapegoating often targets someone who is "different" in some way — who expresses what others are afraid to. This is one of the most dangerous group dynamics: scapegoated members are at highest dropout and harm risk. The leader must intervene actively, often by naming the pattern and exploring what the group is avoiding through the scapegoat.</p>
<p><strong>Subgrouping:</strong> Two or more members forming an alliance that operates outside the group — through shared glances, pre-session conversations, or romantic involvement. Subgroups fragment group cohesion and introduce material the full group can't access. The intervention is to bring the subgroup into the full group: "I notice there seem to be some side conversations happening. What's alive between the two of you that the group could benefit from hearing?"</p>
<p><strong>Resistance and avoidance:</strong> The group collectively avoiding difficult material — through humor, topic-changing, intellectualizing, or sustained focus on outside content. "I notice we've been talking about work situations for 30 minutes. I'm wondering if we're avoiding something that feels more personally risky to bring up here." Naming avoidance is usually more productive than pushing through it.</p>
<p><strong>The silent member:</strong> Some silence is processing; some is avoidance; some is social anxiety; some is contempt. The distinction matters for intervention. Gently inviting silent members without putting them on the spot: "James, I notice you've been listening carefully to this. What's your experience been?"</p>`
        },
        {
          type: 'multipleChoice',
          question: 'During Stage 2 of group development, the leader should primarily:',
          options: [
            { text: 'Increase structure and directive leadership to contain the conflict', isCorrect: false },
            { text: 'Remain non-anxious and use the conflict as therapeutic material', isCorrect: true },
            { text: 'Identify the member responsible for the conflict and address it privately', isCorrect: false },
            { text: 'Restructure the group composition to reduce interpersonal tension', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Stage 2 conflict is normal, expected, and necessary for group development. The leader\'s task is to remain non-anxious (modeling conflict tolerance), use the conflict as material for interpersonal learning, and help the group work through rather than around the tension. Over-controlling or avoiding Stage 2 typically produces groups that stall at superficial cohesion.'
        },
        {
          type: 'multipleChoice',
          question: 'Which of the following represents an example of "process commentary" in group facilitation?',
          options: [
            { text: '"Let\'s talk about the cognitive distortions that came up in your week."', isCorrect: false },
            { text: '"We\'ve spent 20 minutes on work situations. I notice we seem to be working hard to stay on safe ground — I wonder what feels risky to approach here."', isCorrect: true },
            { text: '"Today I want us to review the handout from last session."', isCorrect: false },
            { text: '"Tell me more about what happened at work on Tuesday."', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Process commentary addresses the HOW of what\'s happening in the group — the relational and emotional dynamics beneath the content. Noting that the group has stayed on safe topics and inviting examination of what feels risky is a process comment. The other options focus on content (what) rather than process (how).'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are appropriate absolute exclusion criteria for most outpatient interpersonal process groups? Select all that apply.',
          options: [
            { text: 'Active psychosis', isCorrect: true },
            { text: 'History of depression', isCorrect: false },
            { text: 'Active suicidal intent requiring intensive intervention', isCorrect: true },
            { text: 'Difficulty with interpersonal relationships', isCorrect: false },
            { text: 'Severe cognitive impairment affecting comprehension', isCorrect: true }
          ],
          explanation: 'Active psychosis, active suicidal intent requiring intensive intervention, and severe cognitive impairment are appropriate exclusions for outpatient interpersonal process groups — these conditions require different levels of care or different modalities. History of depression and interpersonal difficulties are not exclusion criteria — in fact, they are often appropriate indications for group therapy.'
        }
      ]
    },
    {
      title: 'Ethics, Special Populations, and Getting Started',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Group Ethics, Special Populations, and Implementation',
          subtitle: 'Confidentiality, boundaries, cultural considerations, and practical starting points'
        },
        {
          type: 'text',
          content: `<h2>Ethical Principles in Group Therapy</h2>
<p>Group therapy raises unique ethical considerations not encountered in individual practice. These deserve explicit training and ongoing attention.</p>
<p><strong>Confidentiality in group:</strong> The therapeutic privilege of confidentiality cannot be legally enforced among group members — the leader can maintain confidentiality, but they cannot control members' behavior outside the group. This creates a fundamental ethical and clinical challenge. Best practices:</p>
<ul>
<li>Include explicit confidentiality agreements in written informed consent</li>
<li>Discuss confidentiality norms explicitly in the first session and revisit them</li>
<li>Frame confidentiality as a group value and collective responsibility, not just a rule</li>
<li>Identify what will happen if confidentiality is breached (member may be asked to leave the group)</li>
<li>Be transparent with clients that absolute confidentiality cannot be guaranteed</li>
</ul>
<p><strong>Informed consent:</strong> Group therapy informed consent should include: the group format and goals, confidentiality limitations, expectations for attendance and participation, what happens if a member joins or leaves (for open groups), the leader's theoretical orientation and approach, and fee structure. This is best delivered both verbally (in pre-group individual meeting) and in writing.</p>
<p><strong>Dual relationships:</strong> Adding a current individual therapy client to a group you lead creates a dual relationship with unique complexities. The client now has access to your behavior with others; other group members may perceive them as "favorites"; the therapeutic material in group may affect the individual work. This is not automatically contraindicated, but it requires careful clinical and ethical consideration and should be disclosed in informed consent.</p>
<p><strong>Boundaries between group members:</strong> Sexual or romantic involvement between group members is ethically complex and clinically risky. It typically needs to be addressed in group when it occurs (subgrouping dynamic) and may require the leader to set explicit norms against outside relationships during treatment, particularly in closed groups where such involvement could fragment the group.</p>
<p><strong>Mandatory reporting in group:</strong> If a disclosure is made in group that triggers a mandatory reporting obligation, the leader must fulfill that obligation — which will affect group confidentiality. The leader should be transparent with the group (without identifying the specific reportable information beyond what is necessary) about what happened and why.</p>`
        },
        {
          type: 'text',
          content: `<h2>Co-Leadership: Benefits, Challenges, and Best Practices</h2>
<p>Co-led groups — facilitated by two therapists simultaneously — have significant advantages and introduce specific challenges that require explicit management.</p>
<p><strong>Advantages of co-leadership:</strong></p>
<ul>
<li>Two perspectives on complex dynamics; co-leaders catch what one might miss</li>
<li>Continuity when one leader is absent</li>
<li>Models healthy adult relationships and conflict resolution</li>
<li>Provides training opportunities (experienced leader + trainee)</li>
<li>Reduces leader burnout in intense groups (trauma, grief, personality disorder)</li>
<li>Gender diversity in leadership can be therapeutically powerful</li>
</ul>
<p><strong>Challenges of co-leadership:</strong></p>
<ul>
<li>Leader disagreements enacted in session can be confusing or destabilizing</li>
<li>Power differentials (seniority, gender, race) between co-leaders model dynamics the group will enact</li>
<li>Inconsistent theoretical orientations between leaders create mixed messages</li>
</ul>
<p><strong>Co-leadership best practices:</strong></p>
<ul>
<li>Regular (weekly) co-leader meetings before and after sessions to process dynamics</li>
<li>Clear agreements about how to handle disagreements in session</li>
<li>Explicit commitment to raising interpersonal issues between leaders in supervision, not through the group</li>
<li>Awareness of the parallel process: how leaders relate to each other will be mirrored in how members relate to each other</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>Group Therapy with Diverse Populations</h2>
<p>Group composition always includes dimensions of difference — race, ethnicity, gender, sexual orientation, age, ability, and socioeconomic status — and these dimensions profoundly affect group dynamics. Clinicians who don't address this explicitly tend to reproduce societal power dynamics within the group.</p>
<p><strong>Racially and ethnically diverse groups:</strong></p>
<ul>
<li>White leaders facilitating racially diverse groups carry the responsibility of understanding how race shapes the room — trust, vulnerability, and who gets heard</li>
<li>Microaggressions between members (or from leaders toward members) require immediate, direct intervention</li>
<li>Leaders should not rely on members of marginalized groups to educate the group about their experience</li>
<li>Homogeneous cultural groups (e.g., a group specifically for Black women) can offer unique therapeutic advantages in universality and safety</li>
</ul>
<p><strong>LGBTQ+ members in groups:</strong></p>
<ul>
<li>Assess group safety before placing LGBTQ+ clients in mixed groups — heteronormative assumptions by leaders or members can be harmful</li>
<li>LGBTQ+-specific groups offer a context where identity-related universality is immediate and powerful</li>
<li>Leaders should use inclusive language from the first session and intervene directly on heteronormative comments</li>
</ul>
<p><strong>Groups in community mental health with economic marginalization:</strong></p>
<ul>
<li>Concrete barriers (transportation, childcare, work schedules) affect attendance in ways that can be misattributed to resistance</li>
<li>Group norms designed for middle-class clients (consistent attendance, weekly time commitment) may be unrealistic — adapt accordingly</li>
<li>Trust in institutional services may be low — earning it requires consistency, transparency, and cultural humility</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>Telehealth and Online Groups</h2>
<p>The COVID-19 pandemic forced a rapid transition to telehealth group therapy, which generated substantial research and clinical experience. What have we learned?</p>
<p><strong>Online groups work.</strong> Studies of online group therapy — for depression, anxiety, PTSD, cancer-related distress, and other conditions — demonstrate outcomes comparable to in-person groups. Dropout rates are similar. Therapeutic alliance develops online, though it may develop more slowly.</p>
<p><strong>What changes in online groups:</strong></p>
<ul>
<li>Nonverbal communication is reduced — the leader must be more explicit about inviting members to share reactions</li>
<li>Video fatigue is real — 90-minute sessions online may feel longer; breaks or shorter sessions may be needed</li>
<li>Members joining from different physical spaces can reduce the sense of shared "container" — the leader may need to be more explicit about creating group identity and boundaries</li>
<li>Technical difficulties require explicit protocols (what happens if a member gets dropped)</li>
<li>Privacy at home is not guaranteed — some members may not have private spaces for group participation</li>
</ul>
<p><strong>Online group best practices:</strong></p>
<ul>
<li>Use video, not audio-only, whenever possible to preserve nonverbal information</li>
<li>Establish explicit norms for online participation (cameras on, no driving, private space)</li>
<li>Consider shorter sessions (75 minutes) to mitigate screen fatigue</li>
<li>Continue pre-group individual preparation via telehealth for new members</li></p>`
        },
        {
          type: 'text',
          content: `<h2>Common Pitfalls in Group Leadership</h2>
<p>Even experienced group therapists make characteristic errors. Awareness of these patterns is the first step toward avoiding them.</p>
<p><strong>Over-structuring:</strong> Using excessive structure to manage anxiety — about conflict, about silence, about losing control. Structure is appropriate in early sessions and in psychoeducational formats; in later-stage process groups, excessive structure prevents the interpersonal work the group needs to do.</p>
<p><strong>Under-structuring:</strong> The opposite error — insufficient structure produces unsafe, chaotic groups that members leave. Early groups need more structure than most leaders provide.</p>
<p><strong>Rescuing:</strong> Intervening too quickly when members are in distress, before the group has had a chance to respond. "John, that sounds really painful" — followed by looking immediately at John rather than at the group — short-circuits the most powerful available intervention (the group's response).</p>
<p><strong>The "hot seat" error:</strong> Focusing intensely on one member for extended periods while others disengage. Every member should have some airtime in every session.</p>
<p><strong>Failing to address process:</strong> Staying at the content level — what members say they're struggling with — rather than the process level — how they're relating to each other right now. Content-only groups often feel productive but produce limited lasting change.</p>
<p><strong>Not addressing resistance directly:</strong> Letting the group chronically avoid difficult material, or letting problematic dynamics (monopolizing, scapegoating) continue without intervention, erodes trust and cohesion over time.</p>
<p><strong>Neglecting termination:</strong> Treating the final session as just another session rather than using it therapeutically. Ending well requires preparation — often dedicating the last 2–3 sessions to explicit consolidation and processing of the ending.</p>`
        },
        {
          type: 'flashcardDeck',
          title: 'Group Therapy Key Terms',
          instructions: 'Review essential group therapy terminology.',
          flashcards: [
            { front: 'Process Commentary', back: 'Leader observation about the HOW of group dynamics — the relational and emotional currents beneath the content — used to invite the group to examine itself' },
            { front: 'Cohesiveness', back: 'The bond members feel with each other and with the group; the group equivalent of therapeutic alliance; prerequisite for deeper work' },
            { front: 'Scapegoating', back: 'A group dynamic where one member absorbs displaced group anxiety or anger; one of the most dangerous group dynamics requiring active leader intervention' },
            { front: 'Subgrouping', back: 'Two or more members forming an alliance that operates outside the full group; fragments cohesion and introduces inaccessible material' },
            { front: 'Linking', back: 'Facilitation technique explicitly connecting themes across members or sessions; builds cohesion and helps members see patterns' },
            { front: 'Pre-group Preparation', back: 'Individual meetings with prospective members before the group begins; reduces dropout and accelerates engagement; essential for process groups' },
            { front: 'Closed Group', back: 'A group that begins and ends with the same members; allows deeper developmental stages but limits accessibility' },
            { front: 'Open Group', back: 'A group where members join and leave at any time; increases accessibility but reduces cohesion and developmental depth' }
          ]
        },
        {
          type: 'text',
          content: `<h2>Getting Started: Practical Steps for Implementing Group Therapy</h2>
<p>For clinicians ready to start offering group therapy, these practical steps reduce the most common implementation barriers:</p>
<p><strong>Start with what you know:</strong> Your first group should leverage existing clinical strengths. If you're strong in CBT, start with a CBT skills group. If you have trauma training, consider a trauma-informed support group. Don't start with the most complex format (open-ended interpersonal process groups) before building foundational skills.</p>
<p><strong>Get supervision or consultation:</strong> Group therapy should not be conducted without access to supervision or consultation, particularly for the first several groups. ASGPP (American Society of Group Psychotherapy and Psychodrama) and AGPA (American Group Psychotherapy Association) offer training, consultation matching, and standards for group practice.</p>
<p><strong>Build in pre-group preparation:</strong> Even if your setting limits the pre-group meeting to 30 minutes, do it. The evidence that pre-group preparation reduces dropout and increases engagement is substantial and consistent.</p>
<p><strong>Establish group norms explicitly in Session 1:</strong> Don't assume members know how to behave in group. Explicitly introduce: confidentiality and its limits, attendance expectations, how members should give feedback to each other, how conflict will be handled, and the focus of the group. Writing these down as a group agreement is useful.</p>
<p><strong>Attend to group composition carefully:</strong> The most common cause of early dropout is poor group fit — a member who is too different from the group, or too destabilized to use group effectively. Screening is not rejection; it's appropriate level-of-care matching.</p>
<p><strong>Use process, not just content:</strong> The most common feedback in group therapy supervision is "stay in the room" — meaning, keep returning to what's happening between members right now rather than extended discussions of outside events.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Ethics and Implementation',
          takeaways: [
            'Confidentiality in group cannot be legally enforced among members — be transparent about this limit and establish explicit group norms',
            'Pre-group individual preparation is the most evidence-supported step for reducing dropout and accelerating group engagement',
            'Common facilitation pitfalls include over-structuring, rescuing, the hot-seat error, and neglecting to address process',
            'Online groups produce outcomes comparable to in-person groups, but require adaptation for reduced nonverbal information and screen fatigue',
            'Diverse group compositions require culturally responsive leadership — microaggressions, power dynamics, and identity-related material need active facilitation',
            'Effective termination requires 2–3 sessions of explicit consolidation, not a single closing session'
          ]
        },
        {
          type: 'reflection',
          question: 'Think about a group you have led or observed. Which of Yalom\'s therapeutic factors seemed most active? Which dynamics (scapegoating, monopolizing, subgrouping, resistance) emerged? Looking back, what facilitation intervention do you wish had been made — or would you make differently now?'
        },
        {
          type: 'multipleChoice',
          question: 'A group member discloses information in session that triggers your mandatory reporting obligation. Which is the most ethically appropriate course of action?',
          options: [
            { text: 'Delay reporting until after the session to avoid disrupting the group', isCorrect: false },
            { text: 'Fulfill the reporting obligation and be transparent with the group about what happened and why, without sharing identifying details unnecessarily', isCorrect: true },
            { text: 'Address the disclosure with the member privately without informing the group', isCorrect: false },
            { text: 'Ask the member\'s consent before filing the report', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Mandatory reporting obligations supersede group confidentiality — the leader must fulfill them regardless of setting. Transparency with the group (without unnecessary identifying details) preserves trust, models ethical behavior, and allows the group to process what has occurred. Delaying reporting or seeking member consent before reporting is not ethically appropriate.'
        },
        {
          type: 'multipleChoice',
          question: 'Which of the following best describes the "rescuing" error in group facilitation?',
          options: [
            { text: 'Intervening too quickly when a member is distressed, before the group has had a chance to respond', isCorrect: true },
            { text: 'Protecting a scapegoated member by directly addressing the group\'s behavior toward them', isCorrect: false },
            { text: 'Providing psychoeducation to members who are confused about therapy goals', isCorrect: false },
            { text: 'Using structure to contain conflict during Stage 2', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Rescuing occurs when the leader intervenes too quickly — before the group has had a chance to respond to a distressed member. By rushing to comfort or explain, the leader short-circuits the most powerful available intervention: the group\'s authentic response to their peer. Good facilitation holds the space for the group to respond first.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are best practices for co-led therapy groups? Select all that apply.',
          options: [
            { text: 'Regular pre- and post-session meetings between co-leaders', isCorrect: true },
            { text: 'Clear agreement on handling in-session disagreements', isCorrect: true },
            { text: 'Working out interpersonal issues between leaders through the group process', isCorrect: false },
            { text: 'Awareness that the co-leader relationship will be mirrored in member dynamics', isCorrect: true },
            { text: 'Co-leaders should never have different theoretical orientations', isCorrect: false }
          ],
          explanation: 'Co-leadership best practices include regular meetings, clear agreements about in-session disagreement handling, and awareness of the parallel process between leaders and members. Processing leader interpersonal issues through the group is inappropriate — that belongs in supervision. Co-leaders can have complementary (though not contradictory) theoretical orientations.'
        },
        {
          type: 'resources',
          title: 'Additional Resources',
          resources: [
            { name: 'American Group Psychotherapy Association (AGPA)', url: 'https://www.agpa.org', description: 'Standards, training, consultation, and group therapy certification resources' },
            { name: 'Yalom, I.D., & Leszcz, M. (2020). The Theory and Practice of Group Psychotherapy (6th ed.). Basic Books.', url: '', description: 'The foundational text in group psychotherapy; comprehensive coverage of therapeutic factors, dynamics, and facilitation' },
            { name: 'Association for Specialists in Group Work (ASGW)', url: 'https://www.asgw.org', description: 'Division of ACA focused on group work training, standards, and professional development' },
            { name: 'Burlingame, G.M., Strauss, B., & Joyce, A.S. (2013). Change mechanisms and effectiveness of small group treatments. In M.J. Lambert (Ed.), Bergin and Garfield\'s Handbook of Psychotherapy and Behavior Change', url: '', description: 'Comprehensive meta-analytic review of group therapy evidence base' }
          ]
        }
      ]
    }
  ],
  assessment: {
    questions: [
      {
        question: 'According to Yalom, which therapeutic factor involves clients learning about their interpersonal style through real-time feedback from group members?',
        options: ['Universality', 'Interpersonal learning', 'Imitative behavior', 'Catharsis'],
        correctAnswer: 1,
        explanation: 'Interpersonal learning is the process by which members receive genuine feedback about their relational patterns from others who are directly experiencing those patterns. This is the therapeutic factor uniquely available only in group, not in individual therapy.'
      },
      {
        question: 'A group member who has felt like a burden discovers they have significantly helped another member. Which Yalom therapeutic factor is most active?',
        options: ['Instillation of hope', 'Universality', 'Altruism', 'Cohesiveness'],
        correctAnswer: 2,
        explanation: 'Altruism is the therapeutic factor describing the benefit of contributing meaningfully to others\' wellbeing. Group members who feel ineffectual or burdensome discover their capacity to help, which is itself therapeutic and directly challenges their self-perception.'
      },
      {
        question: 'What is the optimal group size for an outpatient interpersonal process group?',
        options: ['3–4 members', '5–6 members', '7–8 members', '12–15 members'],
        correctAnswer: 2,
        explanation: '7–8 members is the research-supported optimal size for interpersonal process groups. Smaller groups lack sufficient interpersonal complexity; larger groups make it difficult for every member to participate meaningfully. Psychoeducational groups can be larger (12–15).'
      },
      {
        question: 'Which stage of group development is characterized by increased conflict between members and challenges to the leader\'s authority?',
        options: ['Stage 1: Formation', 'Stage 2: Conflict', 'Stage 3: Cohesion', 'Stage 4: Termination'],
        correctAnswer: 1,
        explanation: 'Stage 2 (often called "storming") involves increased conflict, member assertion of individuality, and challenges to the leader. This is normal and necessary — groups that skip this stage often stall at superficial cohesion. The leader\'s task is to stay non-anxious and use the conflict therapeutically.'
      },
      {
        question: 'Which group composition principle does research most support for effective interpersonal process groups?',
        options: ['Homogeneity in all dimensions to maximize universality', 'Homogeneity in problem area with heterogeneity in coping and interpersonal style', 'Heterogeneity in all dimensions to maximize diversity', 'Random composition with no attention to member characteristics'],
        correctAnswer: 1,
        explanation: 'Research supports homogeneity in presenting concern (shared enough to create universality) combined with heterogeneity in coping and interpersonal style (different enough to generate meaningful interpersonal learning and diverse perspectives).'
      },
      {
        question: 'Absolute exclusion criteria for most outpatient interpersonal process groups include:',
        options: ['Active depression', 'Interpersonal difficulties', 'Active psychosis', 'History of trauma'],
        correctAnswer: 2,
        explanation: 'Active psychosis is a standard absolute exclusion for outpatient process groups — it requires a higher level of care and a different modality. Depression, interpersonal difficulties, and trauma history are often appropriate indications for group therapy rather than exclusion criteria.'
      },
      {
        question: 'Which facilitation technique explicitly connects themes across group members or across sessions?',
        options: ['Process commentary', 'Linking', 'Bridging', 'Subgrouping'],
        correctAnswer: 1,
        explanation: 'Linking is the facilitation technique that explicitly connects what\'s happening between different members, or between current and past sessions. It builds cohesion, helps members see patterns across contexts, and deepens meaning-making.'
      },
      {
        question: 'A group leader notices that one member is being collectively criticized by multiple other members in ways that feel piling-on and potentially harmful. This dynamic is called:',
        options: ['Altruism', 'Subgrouping', 'Scapegoating', 'Resistance'],
        correctAnswer: 2,
        explanation: 'Scapegoating occurs when one member absorbs the group\'s displaced anger, anxiety, or shame. It is one of the most dangerous group dynamics, placing the scapegoated member at highest dropout and harm risk. The leader must intervene actively.'
      },
      {
        question: 'Which of the following is a limitation of confidentiality that must be disclosed in group therapy informed consent?',
        options: ['The leader may share group content with colleagues without client permission', 'Member-to-member confidentiality cannot be legally enforced by the leader', 'Group content may be shared with insurance companies automatically', 'The leader cannot maintain confidentiality because multiple people are present'],
        correctAnswer: 1,
        explanation: 'Unlike individual therapy, the leader in group therapy cannot legally control what other members share outside the group. This limitation must be disclosed in informed consent. The leader maintains their own confidentiality obligations, but cannot enforce confidentiality on other members.'
      },
      {
        question: 'The "process" in "process commentary" refers to:',
        options: ['The treatment plan and therapeutic goals', 'The steps the leader takes to facilitate group exercises', 'The relational and emotional dynamics occurring beneath the content', 'The administrative procedures for group documentation'],
        correctAnswer: 2,
        explanation: 'In group therapy, "process" refers to the HOW — the relational and emotional dynamics occurring between members and with the leader, beneath the surface content. Process commentary invites the group to examine itself: "I notice we\'ve been avoiding something — what feels risky to approach?"'
      },
      {
        question: 'Which facilitation error involves focusing extensively on one member for a long period while others disengage?',
        options: ['Rescuing', 'Over-structuring', 'The hot-seat error', 'Subgrouping'],
        correctAnswer: 2,
        explanation: 'The "hot seat" error involves the leader (or group) directing sustained, intense attention on one member at the expense of others\' participation. It reduces engagement, can feel persecutory to the focused member, and prevents the distributed, member-to-member work that produces the most lasting change.'
      },
      {
        question: 'Pre-group individual preparation meetings are recommended because:',
        options: ['They are legally required for group therapy billing', 'Research shows they reduce dropout rates and accelerate engagement', 'They allow the leader to set group agenda in advance', 'They eliminate the need for group norms discussion in Session 1'],
        correctAnswer: 1,
        explanation: 'Pre-group individual preparation is the most evidence-supported practice for improving group outcomes. Research consistently shows that members who receive preparation have lower dropout rates, engage more quickly, and develop group cohesion faster than unprepared members.'
      },
      {
        question: 'Online group therapy research demonstrates:',
        options: ['Online groups are significantly less effective than in-person groups', 'Online groups produce outcomes comparable to in-person groups', 'Online groups are only appropriate for psychoeducational formats', 'Online group therapy should be avoided due to confidentiality concerns'],
        correctAnswer: 1,
        explanation: 'Research on online group therapy demonstrates outcomes comparable to in-person groups across multiple conditions. Dropout rates are similar. Therapeutic alliance develops online, though it may develop more slowly. Online groups require adaptation but are not less effective.'
      },
      {
        question: 'A co-leader has an unresolved interpersonal conflict with their co-leader partner. According to best practices, this should be addressed:',
        options: ['Through the group process to model transparency', 'In their weekly pre/post-session co-leader meetings or in supervision', 'By temporarily suspending the co-leadership relationship', 'After the group ends to avoid disrupting treatment'],
        correctAnswer: 1,
        explanation: 'Co-leader interpersonal issues should be processed in regular co-leader meetings or supervision — not through the group. Using the group to process leader dynamics is inappropriate and harmful; it blurs role boundaries and uses members to serve leader needs.'
      },
      {
        question: 'The Yalom therapeutic factor that directly counters clients\' sense that they are uniquely broken or isolated is:',
        options: ['Catharsis', 'Universality', 'Instillation of hope', 'Existential factors'],
        correctAnswer: 1,
        explanation: 'Universality — the discovery that others share similar struggles, shameful thoughts, or painful experiences — directly counters the isolation and self-condemnation of "I thought I was the only one." It is often cited as one of the most immediately impactful early-group therapeutic factors.'
      },
      {
        question: 'Effective group termination is best handled by:',
        options: ['Treating the final session as another regular working session', 'Dedicating 2–3 sessions to consolidation, review, and processing the ending', 'Ending abruptly to simulate real-world loss', 'Allowing members to decide how to use the final session without leader guidance'],
        correctAnswer: 1,
        explanation: 'Group termination is itself a therapeutic event that requires preparation and explicit attention. Dedicating 2–3 sessions to consolidation, celebration of growth, and processing the ending allows members to engage with themes of loss, gratitude, and transition that often reflect their broader relational patterns.'
      }
    ]
  },
  references: [
    { citation: 'Yalom, I.D., & Leszcz, M. (2020). The theory and practice of group psychotherapy (6th ed.). Basic Books.' },
    { citation: 'Burlingame, G.M., Strauss, B., & Joyce, A.S. (2013). Change mechanisms and effectiveness of small group treatments. In M.J. Lambert (Ed.), Bergin and Garfield\'s handbook of psychotherapy and behavior change (6th ed., pp. 640–689). Wiley.' },
    { citation: 'Fuhriman, A., & Burlingame, G.M. (1994). Group psychotherapy: Research and practice. In A. Fuhriman & G.M. Burlingame (Eds.), Handbook of group psychotherapy (pp. 3–40). Wiley.' },
    { citation: 'Kivlighan, D.M., & Goldfine, D.C. (1991). Endorsement of therapeutic factors as a function of stage of group development and participant interpersonal attitudes. Journal of Counseling Psychology, 38(2), 150–158.' },
    { citation: 'MacNair-Semands, R.R., & Lese, K.P. (2000). Interpersonal problems and the perception of therapeutic factors in group therapy. Small Group Research, 31(2), 158–174.' },
    { citation: 'Norcross, J.C., & Lambert, M.J. (2019). Psychotherapy relationships that work (3rd ed.). Oxford University Press.' },
    { citation: 'Association for Specialists in Group Work. (2008). ASGW best practice guidelines. Journal for Specialists in Group Work, 33(2), 111–117.' },
    { citation: 'Corey, M.S., Corey, G., & Corey, C. (2018). Groups: Process and practice (10th ed.). Cengage Learning.' },
    { citation: 'Brabender, V., Fallon, A., & Smolar, A. (2004). Essentials of group therapy. Wiley.' },
    { citation: 'Johnson, J.E., Burlingame, G.M., Olsen, J.A., Davies, D.R., & Gleave, R.L. (2005). Group climate, cohesion, alliance, and empathy in group psychotherapy: Multilevel structural equation models. Journal of Counseling Psychology, 52(3), 310–321.' },
    { citation: 'Kaklauskas, F.J., & Greene, L.R. (Eds.). (2020). Core principles of group psychotherapy: A training manual for theory, research, and practice. Routledge.' },
    { citation: 'Barlow, S.H. (2013). Specialty competencies in group psychology. Oxford University Press.' },
    { citation: 'Burlingame, G.M., & Baldwin, S. (2011). Group therapy. In J.C. Norcross, G.R. VandenBos, & D.K. Freedheim (Eds.), History of psychotherapy: Continuity and change (2nd ed., pp. 505–515). APA.' },
    { citation: 'Tasca, G.A., & Lampard, A.M. (2012). Reciprocal influence of alliance to the group and outcome in day treatment for eating disorders. Journal of Counseling Psychology, 59(4), 507–517.' },
    { citation: 'Tschuschke, V., & Dies, R.R. (1994). Intensive analysis of therapeutic factors and outcome in long-term inpatient groups. Journal of Consulting and Clinical Psychology, 62(5), 1013–1021.' },
    { citation: 'Strauss, B., Burlingame, G.M., & Bormann, B. (2008). Using the CORE-R battery in group psychotherapy. Journal of Clinical Psychology, 64(11), 1225–1237.' }
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
