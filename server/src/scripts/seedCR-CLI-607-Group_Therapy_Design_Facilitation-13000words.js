import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && !process.env.DRY_RUN) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-cli-607-group-therapy';

const COURSE = {
  title: 'Group Therapy: Design, Facilitation, and Common Pitfalls',
  slug: SLUG, courseCode: 'CR-CLI-607',
  subtitle: 'From Selection to Storming to Termination: A Clinical Framework for Effective Group Work',
  description: 'A 2-hour intermediate CE course providing licensed mental health professionals with a comprehensive clinical framework for designing, launching, and facilitating therapy groups. Covers group types, Yalom\'s therapeutic factors, screening criteria, stages of group development, facilitation roles, management of common group disruptions, co-facilitation dynamics, cultural considerations, and ethics unique to the group format. 13,000+ words.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'clinical', ceCategory: 'Clinical Practice', contentArea: 'Counseling Theory',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Counseling Theory'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', licenseType: 'LPC', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with extensive experience in group therapy facilitation, clinical training, and telebehavioral health.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  difficulty: 'intermediate',
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)'],
  tags: ['group therapy', 'group facilitation', 'Yalom', 'group dynamics', 'clinical practice', 'group design'],
  objectives: [
    'Differentiate the major types of therapy groups—psychoeducational, process/interpersonal, CBT/skill-building, support, and psychodynamic—and identify the clinical populations and goals best matched to each.',
    'Articulate Yalom\'s eleven therapeutic factors and explain how facilitator technique activates or suppresses each factor across the life of a group.',
    'Apply evidence-based screening and selection criteria to determine client readiness for group therapy and to compose a therapeutically cohesive group.',
    'Distinguish open from closed group formats and select the appropriate format based on treatment setting, population, and clinical goals.',
    'Identify the stages of group development using Yalom\'s developmental model and Tuckman\'s framework, and describe the facilitator\'s role-appropriate interventions at each stage.',
    'Implement specific facilitation strategies for managing monopolizers, silent members, scapegoating, subgrouping, and premature termination without destabilizing the group.',
    'Analyze the ethical obligations unique to the group format—including the modified confidentiality standard, dual-relationship risks, and informed consent requirements—and apply them to clinical decision-making.',
  ],

  sections: [
    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 0: INTRO
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Introduction: Why Group Therapy Demands Its Own Clinical Framework',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider', sectionNumber: '0',
          title: 'Introduction: Why Group Therapy Demands Its Own Clinical Framework',
          subtitle: 'The distinct logic, power, and complexity of therapeutic work in the plural',
          order: 1,
        },
        {
          type: 'text', order: 2,
          content: `<h2>The Group Is Not a Bigger Dyad</h2>
<p>A common error among clinicians new to group work is approaching a therapy group as if it were simply individual therapy conducted with an audience. The temptation is understandable: the skills that make a counselor effective in a dyadic relationship—empathy, reflection, Socratic questioning, psychoeducation—are genuinely transferable to the group room. But they are not sufficient for it, and if they are deployed without understanding the distinct logic of group dynamics, they can inadvertently harm the people the clinician intends to help.</p>
<p>The group room is a social microcosm. Every defensive pattern, relational fear, attachment wound, and interpersonal habit a client carries into life will eventually appear in the group. A client who defers to authority will defer to the leader. A client who fears abandonment will panic when another member drops out. A client who has spent a lifetime being invisible will find new and creative ways to remain invisible even in a room explicitly designed for connection. This is not a bug in the group format—it is the feature. The group provides something individual therapy structurally cannot: a live social laboratory in which interpersonal patterns can be observed in real time, named collaboratively, and practiced differently before the session ends.</p>
<p>Yalom and Leszcz (2020) described this principle as the primary here-and-now focus of interpersonal group therapy, the idea that the most therapeutically potent material is not the client's history as reported but the client's relational behavior as enacted in the room right now. The facilitator who understands this can use a seemingly mundane exchange between two members—a subtle interruption, a deflecting joke, an unexpected moment of genuine contact—as a window into the interpersonal world each member carries everywhere.</p>
<p>This introductory section sets the frame for the two content sections that follow. Section 1 covers the design side of group work: the typology of group formats, the evidence base for group therapy's effectiveness, Yalom's eleven therapeutic factors and how to intentionally activate them, and the clinical and logistical decisions a counselor makes before the first session. Section 2 covers facilitation and the common pitfalls that derail groups that were well-designed on paper: the stages of group development and the facilitator's stage-specific role, the management of disruptive dynamics, co-facilitation, cultural considerations, and the ethics that are unique to the group format.</p>
<h2>The Evidence Base for Group Therapy</h2>
<p>Before examining the specifics of design and facilitation, it is worth grounding the discussion in the outcome literature. A clinician who understands why groups work is better positioned to facilitate the conditions that produce that working. The evidence base for group therapy is substantial and spans decades. Burlingame, Strauss, and Joyce (2013) reviewed more than 700 controlled studies and found that group therapy produced outcomes equivalent to individual therapy for a wide range of presenting concerns, including depression, anxiety, trauma, substance use disorders, eating disorders, and personality pathology. This is not a niche or emerging finding; it is one of the most replicated results in psychotherapy research.</p>
<p>Critically, the evidence suggests that the group's effects are not merely the sum of its individual therapist-client interactions. The group itself does something. Members do not only receive help from the leader; they receive it from one another, and they provide it to one another, and the experience of both receiving and giving has independent therapeutic value. This observation is at the heart of what Yalom called the therapeutic factors, a taxonomy of the specific mechanisms through which group membership produces change. Understanding those factors—and understanding how a facilitator's choices amplify or suppress each of them—is foundational to effective group work.</p>`,
        },
        {
          type: 'videoEmbed', order: 3,
          title: 'Introduction to Group Therapy: Core Principles',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER',
          content: 'This introductory video provides an overview of the history and evidence base for group therapy and positions it within contemporary clinical practice. As you watch, consider how the group format might address clinical needs that individual therapy cannot.',
        },
        {
          type: 'reflection', order: 4,
          question: 'Before continuing, take a moment to reflect on your own experience with group settings—as a clinician, a trainee, or a participant. What assumptions or hesitations do you carry about group therapy? How might those shape the way you facilitate? Write a few sentences for yourself before proceeding.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 1: GROUP THERAPY DESIGN
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Section 1: Designing the Group — Types, Therapeutic Factors, and Pre-Group Decisions',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider', sectionNumber: '1',
          title: 'Section 1: Designing the Group',
          subtitle: 'Types of groups, Yalom\'s therapeutic factors, selection criteria, and the structural decisions that determine whether a group succeeds before it begins',
          order: 1,
        },
        {
          type: 'text', order: 2,
          content: `<h2>Types of Therapy Groups: Matching Format to Function</h2>
<p>Not all therapy groups are the same, and treating them as interchangeable is one of the most common design errors a clinician can make. The format of a group—its theoretical orientation, its degree of structure, its selection criteria, and its session focus—should follow directly from a clear articulation of what it is designed to accomplish and for whom. Corey (2016) described group work as existing on a continuum from highly structured psychoeducational formats to open-ended process-oriented formats, with many models occupying the middle range. Understanding this continuum allows clinicians to make intentional design choices rather than defaulting to whatever format they encountered in training.</p>
<p><strong>Psychoeducational groups</strong> occupy the most structured end of the continuum. Their primary purpose is the provision of information and the development of specific knowledge or skills, and their format reflects that purpose. Sessions are leader-centered, content is typically organized around a curriculum, and the group's cohesion serves primarily to support learning rather than to serve as the change agent itself. Psychoeducational groups are well-suited to topics such as grief and loss education, psychopharmacology literacy, parenting skills, and medication adherence. They are not appropriate as a primary treatment modality for severe personality pathology, active psychosis, or presentations that require intensive individualized clinical attention. The strength of the psychoeducational format is accessibility and efficiency; its limitation is that it does not create the conditions for the kind of interpersonal learning that produces lasting personality-level change.</p>
<p><strong>Process or interpersonal groups</strong> occupy the opposite end of the continuum. Here, the group's interpersonal dynamics are not the backdrop for treatment but the primary vehicle of it. Drawing most directly on Yalom's model, these groups use the here-and-now interactions among members—the conflicts, the connections, the transferences, the moments of surprise and recognition—as the primary material for therapeutic exploration. The leader's role is not to teach but to illuminate: to draw members' attention to what is happening between them and to facilitate the kind of reflection that allows that material to be metabolically processed rather than enacted. Process groups require more sophisticated facilitation skills than psychoeducational groups and more rigorous screening, because the interpersonal intensity is high and members who are too fragile for that intensity can be harmed rather than helped.</p>
<p><strong>Cognitive-behavioral and skill-building groups</strong> occupy the center of the continuum and are among the most extensively researched group formats in the literature. These groups combine structured skill instruction with peer practice and feedback, allowing members to learn a coping strategy, apply it in session, and receive corrective input in real time. CBT group formats have been validated for depression (Lewinsohn et al., 1984), social anxiety (Heimberg, 1991), PTSD (Resick et al., 2008), eating disorders (Wilfley et al., 2002), and substance use (Carroll, 1998), among many others. Dialectical Behavior Therapy skills groups, formalized by Linehan (1993), are a prominent example in which the skills-training group is one component of a comprehensive treatment package. The key facilitation challenge in skill-building groups is preventing psychoeducational drift—the tendency for the group to become a lecture rather than a practice environment—by consistently returning to member experience and peer feedback.</p>
<p><strong>Support groups</strong> differ from therapy groups in that their primary mechanism of change is mutual aid rather than professional facilitation of therapeutic process. While a clinician may convene and structure a support group, the goal is to foster peer connection and normalization rather than to deliver clinical intervention. Support groups are appropriate for chronic illness management, bereavement, caregiver stress, and other circumstances where the primary need is for sustained community rather than intensive symptom-focused treatment. Clinicians who facilitate support groups should be clear in their own minds—and explicit with members—about what the group is and is not. Treating a support group as a therapy group risks overstepping and creates confusion about the nature of the clinical relationship.</p>
<p><strong>Psychodynamic groups</strong> attend to the unconscious relational patterns that members enact in the group, drawing on object relations, self psychology, and attachment theory to understand the transferences that emerge between members and between members and the leader. The facilitator of a psychodynamic group holds a more interpretive role than in other formats, offering reflections that connect current group behavior to early relational templates. MacKenzie (1997) emphasized that the psychodynamic group creates a unique container for the re-experience and reworking of attachment injuries in a social context, which individual therapy cannot replicate. These groups require the most advanced facilitation training and the most careful screening, because the level of regressive pull can be high.</p>

<h2>Yalom's Therapeutic Factors: The Engine Under the Hood</h2>
<p>Irvin Yalom's taxonomy of therapeutic factors, first elaborated in <em>The Theory and Practice of Group Psychotherapy</em> (Yalom & Leszcz, 2020) and now in its sixth edition, remains the most influential empirical and theoretical framework for understanding how group therapy works. Yalom identified eleven factors through which group membership produces therapeutic change. These factors are not merely descriptive; they are actionable. A facilitator who understands them can make deliberate choices—about what to reflect, what to name, what to allow to develop, and what to interrupt—that either activate or suppress each factor.</p>
<p><strong>Instillation of hope</strong> is the factor that makes all others possible. Clients enter group therapy, particularly if they have experienced failure in other treatments, with significant demoralization. The group's value as a setting for hope is that members at different points in their recovery serve as living evidence that change is possible. The facilitator activates this factor by intentionally structuring early sessions so that members who have made progress share their experience and by commenting explicitly on the group's capacity for change. Hope is not optimism; it is grounded expectation, and it requires a realistic portrayal of the work involved.</p>
<p><strong>Universality</strong> is the recognition, often experienced as viscerally relieving, that one is not alone in one's suffering, shame, or confusion. Many clients enter therapy believing that their particular combination of symptoms, history, and relational damage is uniquely awful and uniquely isolating. The group delivers a corrective: in a room with seven other human beings, shared experience is almost always discoverable if the facilitator creates conditions of safety sufficient for honest disclosure. Facilitators activate universality by drawing connections among member experiences and by resisting the pull to reassure members of their uniqueness when what they actually need is the comfort of recognition.</p>
<p><strong>Imparting information</strong> is the explicit transmission of knowledge—psychoeducation, direct advice, or practical guidance—either by the leader or by members who have relevant experience. This factor is primary in psychoeducational groups but present to some degree in all groups. Facilitators should be thoughtful about the source of information sharing: advice from peers often carries more weight than the same content delivered by a professional, both because it is perceived as less authoritative and because it simultaneously enacts the altruism factor.</p>
<p><strong>Altruism</strong> is the therapeutic experience of being genuinely helpful to another person. Many clients who enter therapy carry deep convictions about their own worthlessness or burdensomeness. The group offers a structural challenge to that conviction: members are regularly in a position to offer something of real value—recognition, perspective, support, confrontation—to another human being in pain. When a client who has never believed himself worthy of care finds himself providing exactly the right words to a struggling peer, the experience cannot be fully processed in the dyad and does not arise there. It is a group-specific therapeutic event.</p>
<p><strong>The corrective recapitulation of the primary family group</strong> is the mechanism by which the group evokes and then reworks the relational dynamics of the family of origin. Members unconsciously assign family-of-origin roles to one another and to the leader, and the group's interpersonal field becomes a living replay of early family dynamics. What makes this corrective rather than merely repetitive is the presence of a skilled facilitator who can name the pattern, interrupt it, and create conditions for a different relational outcome. This factor is most active in process-oriented and psychodynamic groups, where the interpersonal field is explicitly examined.</p>
<p><strong>Development of socializing techniques</strong> refers to the explicit and implicit learning of interpersonal skills—assertiveness, boundary-setting, conflict resolution, empathic listening—that occurs through group participation. The group is not merely a context for talking about interpersonal skills; it is a live practice environment. A client who has never learned to express disagreement without either capitulating or exploding will have the opportunity to practice exactly that skill in a session, with real feedback, in a lower-stakes environment than life outside the group.</p>
<p><strong>Imitative behavior</strong> is the learning that occurs through observation of other members and the facilitator. Clients expand their behavioral repertoire by watching how others manage conflict, express vulnerability, set limits, and repair ruptures. This factor is often underutilized by facilitators who focus exclusively on explicit verbal process and neglect the powerful implicit modeling that occurs through the group's enacted relational life.</p>
<p><strong>Interpersonal learning</strong> is, for Yalom, the most complex and arguably the most potent of the therapeutic factors. It operates through a two-part mechanism. In the first part, the group functions as a social microcosm in which each member's characteristic interpersonal style is replicated in miniature. In the second part, the here-and-now focus of the group—supported by the facilitator's active attention to the relational field—allows those patterns to be observed, named, and examined rather than merely enacted. The insight that emerges is not the abstract insight of self-report ("I know I am avoidant") but the experiential insight of live enactment ("I just did the thing right now, and I saw it, and I felt it, and something became possible that wasn't before").</p>
<p><strong>Group cohesion</strong> is the factor that creates the conditions for all others. Burlingame, McClendon, and Yang (2018) reviewed evidence across more than 60 years of group research and concluded that cohesion is the most consistently predictive alliance variable for group outcome, analogous in importance to the therapeutic alliance in individual therapy. Cohesion is not the same as liking or harmony; a group can be highly cohesive and regularly engaged in difficult conflict. What cohesion provides is the safety that makes authentic engagement possible. Facilitators build cohesion through consistent attention to the relational field, through transparent processing of ruptures, and through the active management of dynamics—like scapegoating or chronic subgrouping—that fracture it.</p>
<p><strong>Catharsis</strong> in the group context refers to the relief that accompanies strong emotional expression within a supportive and containing environment. Catharsis without cognitive and relational processing is not therapeutic—the discharge alone accomplishes little—but catharsis within a group that receives and metabolizes the expressed affect creates a qualitatively different experience than is possible in the dyad. The group literally witnesses and holds the member's emotional expression, and that collective holding is itself the intervention.</p>
<p><strong>Existential factors</strong> refer to the existential confrontations that group membership inevitably provokes: recognition of the ultimate responsibility for one's own life, confrontation with mortality when a member discusses serious illness or death, the encounter with the irreducible aloneness of experience even in connection, and the discovery that meaning must be constructed rather than found. These factors are often left implicit in groups not explicitly oriented toward existential concerns, but they are always operating and a sophisticated facilitator knows when to name them.`,
        },
        {
          type: 'callout', order: 3, calloutType: 'ethics',
          title: 'Confidentiality in Group Therapy: The Standard Is Different and Weaker Than in Individual Therapy',
          content: `<p>In individual therapy, the confidentiality of session content is controlled by two parties: the client and the clinician. In group therapy, that control is shared among every member of the group, and the professional standards governing the clinician's conduct cannot govern the members' conduct. The American Counseling Association Code of Ethics (2014) and the ASGW Best Practice Guidelines (2008) require clinicians to clearly explain this limitation at the outset of every group, in language that is concrete and not minimized.</p>
<p>The standard disclosure should include three elements: (1) a direct statement that the clinician cannot guarantee the confidentiality of information shared in group because the clinician cannot legally bind the other members; (2) a group agreement—established collaboratively in the first session and revisited after every membership change—in which members commit to confidentiality as an ethical expectation even though it is not legally enforceable; and (3) an explicit discussion of the specific exceptions to confidentiality that apply in group as in individual therapy (duty to warn, mandatory reporting, court order) plus the group-specific issue of what happens if a member discloses another member's participation in the group outside the group room.</p>
<p>Clinicians who gloss over this disclosure—offering a vague "what's said here stays here"—are not merely providing incomplete informed consent; they are creating a false expectation that can seriously harm members who disclose sensitive material in reliance on a confidentiality standard that does not exist. This is an area where the group format imposes a distinctive ethical burden, and it deserves deliberate, non-rushed attention in the pre-group screening process and in the group's opening session.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Screening, Selection, and the Pre-Group Interview</h2>
<p>The composition of the group is one of the most consequential decisions a facilitator makes, and it is made before any therapy occurs. Yalom and Leszcz (2020) argued that adequate preparation of group members—including a structured pre-group interview—is one of the most empirically supported practices in the group therapy literature, yet it remains among the most commonly skipped. The failure to screen adequately is a leading cause of early dropout, group disruption, and member harm.</p>
<p>The pre-group interview serves four functions. First, it allows the clinician to assess whether the prospective member meets the clinical inclusion criteria for this specific group—criteria that differ across group types and should be specified in advance, not improvised during the interview. Second, it allows the clinician to assess for active exclusion criteria: conditions that contraindicate group participation at this time regardless of the group's orientation. Third, it prepares the member for what to expect—reducing anticipatory anxiety, correcting misconceptions, and increasing the likelihood that the member will engage productively in early sessions rather than dropping out due to unmet expectations. Fourth, it establishes the beginning of a working relationship between the clinician and the prospective member before that member enters the group room.</p>
<p>Inclusion criteria vary by group type. A CBT group for social anxiety disorder appropriately requires that members have a primary diagnosis consistent with the group's focus, sufficient cognitive flexibility to engage with the model, and absence of active suicidality or psychosis that would require a higher level of care. A process group for adults with relationship difficulties appropriately requires interpersonal motivation—a genuine desire to understand and change one's relational patterns, not merely symptom relief—and sufficient ego strength to tolerate the anxiety of interpersonal exposure without decompensating. A support group for bereaved parents appropriately requires shared experience of the specific loss the group addresses, sufficient emotional regulation to engage without disrupting others, and absence of complex grief requiring specialized treatment beyond the group's scope.</p>
<p>Common exclusion criteria across group types include: active psychosis or mania that would prevent the member from tracking group process; severe personality pathology in which the member's interpersonal style would consistently disrupt the group's functioning without therapeutic benefit (though it is worth noting that group therapy, when structured appropriately, is in fact highly effective for personality disorders—the exclusion is from a group not designed for that population, not from group therapy per se); active substance intoxication as a recurring pattern; and acute suicidality requiring a more intensive level of care. The decision to exclude is not a rejection of the person; it is a clinical judgment about the fit between this person's needs and this group's design, and it should always be accompanied by a clear referral to an appropriate alternative.</p>
<h2>Open Versus Closed Groups: Structural Implications</h2>
<p>The choice between an open group (in which members can join and exit at different times, with the composition continuously shifting) and a closed group (in which membership is fixed at the outset and no new members are added after the group begins) is a structural decision with far-reaching clinical implications that is too often made on the basis of administrative convenience rather than clinical rationale.</p>
<p>Closed groups create conditions for deeper cohesion and more complex interpersonal work. Because the membership is stable, members develop progressively more nuanced and authentic relationships with one another over time. The group accrues a shared history—shared language, shared references, shared memories of pivotal moments—that gives it a cultural specificity no open group can match. Closed groups are better suited to longer-term process-oriented and psychodynamic work, where the deepening of the relational field over time is itself the therapeutic mechanism. Their practical limitation is that attrition reduces the group size and cannot be corrected, which means they require careful initial composition to include enough members that normal dropout does not leave the group too small to function (most process groups need a minimum of five to six members in active attendance to maintain the interpersonal complexity that makes them useful).</p>
<p>Open groups are better suited to clinical settings where membership stability is structurally impossible—acute care, partial hospitalization, residential treatment—or where the treatment goal is stage-specific rather than longitudinal. A grief support group that meets weekly and allows new members to join as needed serves a different clinical function than a closed twelve-session interpersonal group: it provides an ongoing community container for people at different points in bereavement, rather than a structured relational journey from beginning to end. The facilitation challenge in open groups is maintaining the group's normative culture—its agreements, its way of being together—across membership changes, and re-integrating new members without disrupting the group's current developmental stage.</p>
<h2>Group Size, Frequency, and Informed Consent</h2>
<p>Practical structure matters more than it may initially appear. Research on group therapy consistently finds that groups of five to eight members produce optimal outcomes for process-oriented work (Yalom & Leszcz, 2020). Groups smaller than five lose the interpersonal variety that makes here-and-now work rich; they begin to feel like co-therapy rather than group therapy. Groups larger than ten make it structurally impossible for every member to receive adequate airtime, tend to produce subgroup formation as a quasi-natural adaptive response, and impair the facilitator's ability to attend to individual member dynamics while also managing the group's relational field.</p>
<p>Session frequency and length similarly affect therapeutic factor activation. Weekly ninety-minute sessions are the most common format for outpatient groups, and they have an empirical base. Twice-weekly meetings accelerate cohesion development and are appropriate for higher-acuity populations or intensive outpatient programs. Biweekly meetings are generally insufficient to maintain the relational continuity that allows interpersonal learning to deepen; they are more appropriate for support groups than for process-oriented clinical groups.</p>
<p>Informed consent for group therapy requires explicit attention beyond the standard elements of individual therapy consent. The elements that are specific to the group format and must be clearly communicated include: the modified confidentiality standard described above; the nature of group participation and the expectation that members will engage with one another, not only with the facilitator; the member's right to decline to speak on any topic without leaving the group; the potential for discomfort and conflict as part of the therapeutic process; the specific group agreements (punctuality, attendance, between-session contact policy if any); and the consequences for the group—not just for the individual—of premature, unannounced dropout. Corey, Corey, and Corey (2018) provide a detailed informed consent template for group work that can serve as a clinical resource.`,
        },
        {
          type: 'accordion', order: 5,
          accordionItems: [
            {
              title: 'Yalom\'s 11 Therapeutic Factors at a Glance',
              content: `<p>Each factor represents a distinct mechanism through which group membership produces change. A well-facilitated group activates multiple factors simultaneously:</p>
<ol>
<li><strong>Instillation of Hope</strong> — Members witness others' progress; demoralization decreases.</li>
<li><strong>Universality</strong> — Members discover their suffering and shame are shared, not unique.</li>
<li><strong>Imparting Information</strong> — Educational content from leader or experienced peers.</li>
<li><strong>Altruism</strong> — The experience of being genuinely helpful to others challenges self-worthlessness.</li>
<li><strong>Corrective Recapitulation of the Primary Family Group</strong> — Early family dynamics are re-evoked and reworked.</li>
<li><strong>Development of Socializing Techniques</strong> — Interpersonal skills practiced in a live, feedback-rich environment.</li>
<li><strong>Imitative Behavior</strong> — Members expand their repertoire by observing others.</li>
<li><strong>Interpersonal Learning</strong> — The social microcosm reveals and allows reworking of relational patterns.</li>
<li><strong>Group Cohesion</strong> — The group alliance that makes authentic engagement possible.</li>
<li><strong>Catharsis</strong> — Emotional expression within a containing, witnessing environment.</li>
<li><strong>Existential Factors</strong> — Confrontations with responsibility, mortality, aloneness, and meaning.</li>
</ol>`,
            },
            {
              title: 'Comparing Group Types: A Clinical Decision Matrix',
              content: `<p>Use this comparison to match group format to clinical need:</p>
<table style="width:100%;border-collapse:collapse">
<tr><th style="border:1px solid #ccc;padding:6px">Format</th><th style="border:1px solid #ccc;padding:6px">Primary Change Mechanism</th><th style="border:1px solid #ccc;padding:6px">Best Suited For</th><th style="border:1px solid #ccc;padding:6px">Facilitator Role</th></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Psychoeducational</td><td style="border:1px solid #ccc;padding:6px">Information transmission</td><td style="border:1px solid #ccc;padding:6px">Skill acquisition, illness literacy</td><td style="border:1px solid #ccc;padding:6px">Teacher/presenter</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Process/Interpersonal</td><td style="border:1px solid #ccc;padding:6px">Here-and-now interpersonal learning</td><td style="border:1px solid #ccc;padding:6px">Relational patterns, personality-level change</td><td style="border:1px solid #ccc;padding:6px">Process illuminator</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">CBT/Skill-Building</td><td style="border:1px solid #ccc;padding:6px">Skill practice + peer feedback</td><td style="border:1px solid #ccc;padding:6px">Depression, anxiety, PTSD, SUD</td><td style="border:1px solid #ccc;padding:6px">Coach/trainer</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Support</td><td style="border:1px solid #ccc;padding:6px">Mutual aid and community</td><td style="border:1px solid #ccc;padding:6px">Chronic illness, bereavement, caregiver stress</td><td style="border:1px solid #ccc;padding:6px">Convener/facilitator</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Psychodynamic</td><td style="border:1px solid #ccc;padding:6px">Unconscious pattern interpretation</td><td style="border:1px solid #ccc;padding:6px">Attachment injuries, character-level work</td><td style="border:1px solid #ccc;padding:6px">Interpreter</td></tr>
</table>`,
            },
            {
              title: 'Pre-Group Interview: Core Assessment Areas',
              content: `<p>A thorough pre-group interview assesses the following domains:</p>
<ul>
<li><strong>Presenting concern and treatment history:</strong> Is this person's primary need consistent with this group's focus? Has group therapy been attempted before, and if so, what happened?</li>
<li><strong>Interpersonal motivation:</strong> Does the client express genuine curiosity about their relational patterns, or are they motivated purely by symptom relief? Process groups in particular require interpersonal motivation.</li>
<li><strong>Ego strength and affect regulation:</strong> Can the client tolerate the anxiety of interpersonal exposure and the discomfort of conflict without decompensating or requiring individual sessions after every group?</li>
<li><strong>Active exclusion criteria:</strong> Assess for active psychosis, mania, severe dissociation, and patterns of interpersonal behavior (predatory, paranoid, or severely disrupting) that would harm other members.</li>
<li><strong>Expectations and misconceptions:</strong> What does the client think will happen in the group? Correct unrealistic expectations before the first session.</li>
<li><strong>Logistical commitment:</strong> Can the client commit to the attendance requirements? Inconsistent attendance harms the group, not just the individual member.</li>
</ul>`,
            },
            {
              title: 'Closed Group Size and Composition Guidelines',
              content: `<p>Evidence-based guidelines for closed outpatient process groups:</p>
<ul>
<li><strong>Optimal size:</strong> 7–8 members. Minimum functional size: 5 active members. Maximum for process work: 10 members.</li>
<li><strong>Compositional diversity:</strong> Heterogeneous composition (varied age, gender, presentation) enriches the social microcosm. Homogeneous composition (shared diagnosis, shared experience) accelerates cohesion in focused groups.</li>
<li><strong>Developmental readiness:</strong> Members should be at roughly comparable developmental levels for the work the group requires—not identical presentations, but similar readiness for interpersonal engagement.</li>
<li><strong>The "1-2" principle:</strong> No member should be the only representative of a significant identity category (e.g., the only man, the only person of color, the only person under 30). Isolation within a group intended to reduce isolation is counterproductive and potentially harmful.</li>
</ul>`,
            },
            {
              title: 'Group Agreements: What Every First Session Must Establish',
              content: `<p>The group's normative culture is established in the opening session. Core agreements to establish explicitly include:</p>
<ul>
<li><strong>Confidentiality agreement:</strong> Named, discussed, and acknowledged as an ethical expectation that is not legally enforceable against members. Revisited after every membership change in open groups.</li>
<li><strong>Attendance and punctuality:</strong> Members commit to consistent attendance and arrival on time. The rationale (absences affect the whole group, not just the individual) should be explained.</li>
<li><strong>Between-session contact policy:</strong> The group decides explicitly whether members may contact each other outside of sessions—and if they do, the agreement is to bring that content back to the group. Secret subgroup relationships fracture cohesion.</li>
<li><strong>Right to pass:</strong> Members may decline to speak on a topic at any time without leaving the group. This protection is especially important in early sessions.</li>
<li><strong>Feedback norms:</strong> The group establishes how it wants to give and receive difficult feedback. Modeling "I" statements and checking before advising builds safer norms.</li>
</ul>`,
            },
          ],
        },
        {
          type: 'imageText', order: 6,
          content: `<h3>Yalom's Therapeutic Factors in Practice</h3>
<p>The diagram illustrates how the eleven therapeutic factors interact in a well-functioning group. Cohesion is at the center because it is the precondition for all other factors. Hope and universality are activated earliest and serve to retain members through the difficult early sessions. Interpersonal learning and the corrective recapitulation of the family group are activated most fully in the middle phase, when sufficient cohesion has developed to support the vulnerability required. Existential factors often surface most explicitly in the termination phase as the group itself approaches ending.</p>
<p>Facilitators can use this model as a diagnostic tool: if interpersonal learning is not occurring in what should be a mid-phase process group, the likely explanation is insufficient cohesion, which in turn points to unexamined ruptures, subgrouping, or premature confrontation in early sessions that foreclosed the safety necessary for authentic engagement.</p>`,
          image: '', imageAlt: 'Diagram of Yalom\'s eleven therapeutic factors arranged with cohesion at center and surrounding factors showing stage-based activation', imagePosition: 'right',
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'A clinician is designing an outpatient group for adults with a primary diagnosis of social anxiety disorder. Which group format is most directly supported by the evidence base for this population?',
          options: [
            { text: 'An open-ended psychodynamic group focused on early relational templates', isCorrect: false },
            { text: 'A structured CBT or skills-based group incorporating exposure-based peer practice and systematic feedback', isCorrect: true },
            { text: 'A support group emphasizing mutual aid and shared experience without clinical structure', isCorrect: false },
            { text: 'A closed process group using Yalom\'s here-and-now interpersonal focus as the primary modality', isCorrect: false },
          ],
          explanation: 'CBT-based group formats (e.g., Heimberg\'s cognitive-behavioral group therapy for social anxiety) have the strongest empirical base for social anxiety disorder, combining psychoeducation, cognitive restructuring, and systematic in-session exposures with peer feedback—mechanisms that specifically target the avoidance, cognitive distortions, and safety behaviors central to SAD. Process groups can be effective for some clients with social anxiety but are not the first-line evidence-based format.',
        },
        {
          type: 'text', order: 8,
          content: `<h2>Screening Criteria in Depth: Who Benefits and Who Is Harmed</h2>
<p>The question of who should be in a group is inseparable from the question of what the group is designed to do. Clinicians sometimes operate with a generic list of group exclusion criteria that functions as a universal screening tool across all group types—a practice that is both clinically imprecise and potentially discriminatory. A client who would be appropriately excluded from a short-term psychoeducational group for medication adherence might be an excellent candidate for a longer-term DBT skills group or a specialized trauma-focused group. The exclusion criterion is always format-specific and population-specific, never categorical.</p>
<p>With that caveat, the literature identifies several clinical presentations that consistently predict poor outcomes in most group formats if placed without adequate preparation. Clients with prominent narcissistic features who are unable to tolerate being a peer rather than the center of the clinical relationship often disrupt process groups by monopolizing, devaluing other members' disclosures, and responding to therapeutic confrontation with escalating rage. This does not mean narcissistic pathology is a universal contraindication for group therapy—research by Piper and Joyce (2001) demonstrated that patients with narcissistic features can benefit significantly from group therapy when placed in groups specifically designed for that population with facilitators trained in managing the dynamics that arise. The contraindication is placement in a general-population group without preparation or facilitation structure adequate to contain the disruption.</p>
<p>Clients with severe dissociation present a different challenge. Dissociative episodes during group sessions can be frightening for other members, can disrupt the group's process at critical moments, and may indicate that the client requires individual stabilization work before group participation is appropriate. The ASGW Best Practice Guidelines (2008) recommend that clients with complex dissociative presentations receive stabilization-focused individual therapy concurrently with or prior to group participation, and that the group leader have training adequate to manage dissociative responses in session.</p>
<p>Clients who are actively suicidal present a more nuanced clinical picture. Active suicidality is sometimes listed as a blanket contraindication for group therapy, but this is too broad. A client with passive suicidal ideation who is otherwise stable and motivated can benefit significantly from group therapy, particularly from the universality, altruism, and interpersonal learning factors. A client in an acute suicidal crisis requiring safety planning requires a higher level of care and is not appropriate for outpatient group participation until that crisis has stabilized. The key distinction is between chronic suicidal ideation managed within a treatment plan and acute suicidal crisis that requires immediate intensive intervention.</p>
<p>Clients in a pre-contemplative stage regarding change—those who are being sent to group by an employer, a court, or a family system and who have no intrinsic motivation for the work—present a facilitation challenge but not necessarily a contraindication. Motivational enhancement strategies can be incorporated into group work, and the group itself sometimes activates motivation that individual interventions could not. The facilitator should be explicit with pre-contemplative members about the expectations and should assess, session by session, whether the member's resistance is disrupting the group's functioning for other members. In an outpatient voluntary group, a member who is persistently resistant to all group engagement may need to be asked to reconsider participation until they are ready—not as a punishment, but as a clinical judgment that their presence is not serving them or the group.</p>
<h2>Gender, Culture, and Composition Decisions</h2>
<p>Composition decisions are not merely clinical—they are deeply cultural. The choice of who is in a room together and how the room is structured sends powerful messages about who belongs, whose experience is normative, and whose difference will require explanation. Bernard et al. (2008) and Singh and Salazar (2010) wrote extensively about the ways that inattention to cultural composition in groups can replicate the marginalization that many clients experience outside the therapy room. A woman of color who is the only person of color in an otherwise white group may spend significant therapeutic energy managing her visibility and difference rather than engaging with the work for which she sought help.</p>
<p>The "1-2 principle"—the recommendation that no member should be the sole representative of a significant identity category—is not merely a sensitivity guideline; it is a clinical recommendation backed by group dynamics research. Isolation within the group compounds the very isolation that group therapy is designed to address. Facilitators building groups should explicitly attend to representation across gender, race and ethnicity, age, sexual orientation, and disability status. When a fully representative composition is not possible—as may be the case in rural settings or highly specialized groups—the facilitator should acknowledge the reality of the group's composition transparently and attend with particular care to the experience of members who are underrepresented.`,
        },
        {
          type: 'text',
          order: 8.1,
          callouts: { 'corrective-recap': { label: 'Corrective Recapitulation', type: 'clinical', body: "The Yalom therapeutic factor by which a group evokes and reworks members' family-of-origin relational dynamics, made corrective by a facilitator who can name and interrupt the pattern rather than let it simply repeat." } },
          content: `<h2>Yalom's Therapeutic Factors as Observable Clinical Events</h2>
<p>Instructors introducing Yalom's eleven therapeutic factors often present them as a taxonomy to be memorized, but their real clinical utility lies elsewhere: each factor corresponds to a class of observable events in the group room, and a facilitator who can recognize the event as it happens is positioned to reinforce, extend, or gently redirect it in real time. This section revisits the eleven factors specifically through that observational lens, describing the behavioral signature of each factor rather than restating its definition, so that the facilitator has a practical field guide rather than an abstract list.</p>
<p><strong>Instillation of hope</strong> shows up concretely as a shift in a member's posture or tone when another member describes measurable improvement. A facilitator who watches for it will notice the moment a newer member, previously slumped and disengaged, sits forward and asks a follow-up question of a member further along in treatment. That question is the clinical event; the factor is not "present" in the abstract, it is present in that specific exchange, and the facilitator's task is to slow the moment down rather than move past it—"Say more about what you just heard that felt useful to you"—so the group registers what has happened.</p>
<p><strong>Universality is recognizable</strong> as a distinctive shift in the room's physiological tone: shoulders drop, eye contact increases, and a member who has just disclosed something shameful visibly relaxes when a second member says some version of "I thought I was the only one." The facilitator's role is not to manufacture this moment but to create enough silence after a vulnerable disclosure that other members have room to offer it, rather than filling the silence themselves with premature reassurance that forecloses a peer's opportunity to voice recognition.</p>
<p><strong>Imparting information is easiest</strong> to spot when it goes wrong: a member asks a direct factual question and the facilitator, out of habit, answers it immediately rather than turning it back to the group. The corrected version of this event looks like a brief pause and a redirect—"Has anyone else navigated something like this?"—which both imparts the information through a peer channel and simultaneously activates altruism in whichever member responds.</p>
<p><strong>Altruism has a recognizable</strong> behavioral marker: a member who has spent much of the group's history describing themselves as a burden visibly straightens, sometimes verbally noting surprise, after offering another member a piece of feedback that lands well. Facilitators who are listening for this factor will name it directly when it occurs—"I want to point out what just happened. You told us three weeks ago you didn't think you had anything useful to offer this group. Look at what you just gave Denise."</p>
<p>{{callout:corrective-recap}} is visible in the assignment of roles that members did not consciously choose: one member becomes the group's designated peacemaker, interrupting every conflict before it develops; another becomes the group's designated challenger, voicing the disagreement everyone else is avoiding. These roles are frequently isomorphic with the member's position in their family of origin. The facilitator who has tracked a member's family history in intake can name the parallel directly when the pattern repeats in session, which converts an unconscious repetition into conscious, examinable material.</p>
<p><strong>Development of socializing techniques</strong> is visible in incremental behavioral change across sessions rather than in any single moment: a member who initially could only express disagreement through withdrawal or sarcasm begins, by session eight or ten, to say a direct sentence like "I disagree with that, and here is why." Facilitators should track this developmental arc explicitly and name it at appropriate intervals, because members rarely notice their own incremental change without external reflection.</p>
<p><strong>Imitative behavior is visible</strong> when a member adopts, often without conscious awareness, a specific phrase or approach modeled by another member or the facilitator in an earlier session. A member who watched another member successfully set a boundary with a difficult family member two sessions earlier may use strikingly similar language when setting their own boundary in group. Naming the borrowing—"That sounds like something like what Michael did a couple weeks ago"—reinforces both members and makes the imitative mechanism conscious and available for further use.</p>
<p><strong>Interpersonal learning is the factor</strong> most dependent on facilitator skill to make visible, because it requires connecting an in-session behavior to the member's characteristic interpersonal pattern outside the group. The behavioral marker is a moment of enactment—a member interrupts, withdraws, over-explains, or seeks reassurance in a manner that mirrors a pattern they have described from their outside relationships. The facilitator's task is to catch the enactment as it happens, rather than waiting for the member to self-report it afterward, and to ask the question that converts enactment into insight: "You just did the thing you told us your partner complains about. What was happening for you right before that?"</p>
<p><strong>Group cohesion is measurable</strong> through indirect markers more than direct ones: attendance consistency, the amount of spontaneous member-to-member communication (as opposed to communication routed exclusively through the facilitator), the willingness of members to express disagreement with each other without fear the group will fracture, and the frequency with which members reference material from previous sessions unprompted. A facilitator tracking cohesion across time is looking for the trend line in these markers, not a single session's data point.</p>
<p><strong>Catharsis is recognizable</strong> through affective release accompanied by physiological signs of relief rather than escalation—tears that soften a member's posture rather than tears that build toward dysregulation. The facilitator's differential task is distinguishing catharsis that is being metabolized by the group (other members visibly attending, offering presence, the room staying regulated) from catharsis that is overwhelming the group's containing capacity, which requires the facilitator to actively slow the process and add structure rather than allow it to continue unchecked.</p>
<p><strong>Existential factors surface</strong> unpredictably and are easy to miss if the facilitator is oriented only toward symptom-focused content. The behavioral marker is often a single sentence dropped into an unrelated discussion—a member mentions, almost in passing, that they have started thinking about how much time they have left, or that a parent's recent diagnosis has made them reconsider what they are doing with their own life. These moments are frequently followed by an immediate topic change, either by the disclosing member or by the group, because existential material is often more anxiety-provoking than symptom material. The facilitator who notices the topic change and gently returns to what was dropped—"I want to go back to what you said a minute ago, before we moved on"—creates space for existential material that would otherwise be lost.</p>
<h2>Tuckman's Stages as a Facilitation Framework</h2>
<p>Bruce Tuckman's (1965) developmental model, though originally derived from research on small task groups rather than therapy groups specifically, has become one of the most widely applied frameworks in group psychotherapy training because its five stages—forming, storming, norming, performing, and adjourning—map cleanly onto observable shifts in a therapy group's relational structure. The framework's clinical value is not that it predicts a fixed timeline (some groups reach performing by session six; others remain in norming for the group's entire duration), but that it gives the facilitator a vocabulary for naming what kind of developmental work the group is doing at a given point and for calibrating intervention accordingly.</p>
<p>A facilitator using Tuckman's model clinically is not asking "what session number are we on" but "what is the group's current developmental task." In forming, the developmental task is establishing enough basic safety and structure that members are willing to be present and minimally disclosing. In storming, the developmental task is surviving differentiation and conflict without the group collapsing or without the facilitator over-functioning to prevent the conflict from occurring. In norming, the developmental task is consolidating a shared culture and identity robust enough to tolerate future conflict without threatening the group's existence. In performing, the developmental task is sustained, low-scaffolding therapeutic work. In adjourning, the developmental task is metabolizing loss and integrating what was learned.</p>`
        },
        {
          type: 'text',
          order: 8.11,
          content: `<p>A critical clinical error is assuming that stages proceed in a strictly linear fashion and do not recur. In practice, membership changes in open or semi-open groups routinely trigger a partial return to forming-stage dynamics, even in groups that have previously reached performing. The addition of a new member to an established closed group similarly triggers a mini-forming process, as both the new member and the established members renegotiate norms and roles. External stressors—a member's crisis, a facilitator's absence, a rupture between members—can also trigger a temporary regression to storming even in a group that has been stably performing for months. Facilitators who expect linear, one-directional progress are frequently confused or alarmed by these regressions; facilitators who understand the model as cyclical read them as predictable developmental events requiring a return to earlier-stage interventions (more structure, more explicit safety-building) rather than as evidence of clinical failure.</p>
<h2>Diagnosing Stage From Behavior: A Facilitator's Field Guide</h2>
<p>Because stage identification drives intervention choice, facilitators benefit from a concrete set of behavioral markers rather than a purely conceptual understanding of the model. The following markers, drawn from group process research and clinical consensus (MacKenzie, 1997; Corey, 2016), can be observed within a single session and do not require the facilitator to track material across multiple sessions.</p>
<p>A group in the <strong>forming stage shows a communication</strong> pattern that is disproportionately leader-directed: members make eye contact with the facilitator more than with each other, phrase disclosures as answers to implicit or explicit facilitator questions, and rarely respond directly to another member's statement without the facilitator first inviting them to do so. Self-disclosure is present but shallow and carefully selected; members test the waters with material that carries relatively low emotional risk before offering anything more vulnerable. Silence in the forming stage tends to feel uncomfortable and is often broken quickly, frequently by the same one or two members, because the group has not yet developed tolerance for unstructured space.</p>
<p>A group in the <strong>storming stage shows visible tension</strong> in seating and body language—members who previously sat near each other may reposition, arms may cross, and eye contact between specific dyads may noticeably decrease. Verbally, storming is marked by an increase in challenging statements directed either at the facilitator ("I don't think this is helping anyone") or at other members, and by a corresponding increase in defensive responses. Attendance often becomes less consistent during storming, as conflict-avoidant members find reasons to miss sessions. A facilitator can also observe storming indirectly through their own countertransference: many facilitators report a period of dread or anxiety before sessions during a group's storming phase, which is itself diagnostic information about the group's current developmental position.</p>
<p>A group in the <strong>norming stage shows a marked increase</strong> in spontaneous member-to-member communication that does not route through the facilitator, along with more frequent use of collective language—members referring to "our group" or "what we've talked about" rather than exclusively individual framing. Humor becomes more common and is typically inclusive rather than deflecting. Members begin referencing earlier sessions unprompted, indicating that the group has developed a shared narrative history that functions as a cohesive resource. Conflict does not disappear in norming, but it is handled with noticeably less anxiety than in storming, and repairs happen more quickly.</p>
<p>A group in the <strong>performing stage tolerates facilitator silence</strong> without visible anxiety; members initiate topics and process without waiting for facilitator prompting, and the group demonstrates the capacity to name and repair its own ruptures with minimal facilitator scaffolding. Confrontation, when it occurs, is typically direct, specific, and followed relatively quickly by relational repair rather than prolonged rupture. This is the stage in which interpersonal learning happens most efficiently, because the group's cohesion is sufficient to hold the vulnerability that genuine feedback requires.</p>
<p>A group entering the <strong>adjourning stage shows behavioral markers</strong> distinct from all prior stages: increased references to the group's ending, a tendency for some members to emotionally withdraw in advance of the actual termination (a defensive anticipation of the loss), and, in some members, a paradoxical intensification of engagement as they attempt to extract maximum value from the remaining sessions. Facilitators should expect and normalize both withdrawal and intensified engagement as reasonable responses to an approaching ending rather than treating either as a problem to be corrected. Naming the ending explicitly and repeatedly—rather than allowing it to remain an unspoken background fact—gives the group's existential material room to surface before the group actually ends.</p>`
        },
        {
          type: 'text',
          order: 8.2,
          content: `<h2>Homogeneous Versus Heterogeneous Group Composition</h2>
<p>The decision to compose a group homogeneously (members share a defining characteristic—diagnosis, life experience, identity, or presenting concern) or heterogeneously (members differ substantially across these dimensions) is a design choice with direct clinical consequences, and the choice should follow from the group's therapeutic goals rather than from administrative convenience or an unexamined default toward one approach or the other.</p>
<p><strong>Homogeneous composition accelerates</strong> early cohesion because members immediately recognize shared ground, which shortens the forming stage and reduces the anticipatory anxiety that often accompanies the first several sessions. A group of parents grieving the loss of a child, a group of combat veterans processing moral injury, or a group of clients newly diagnosed with a chronic illness will typically reach universality faster than a heterogeneous group, because the specific content of the shared experience does not require extensive translation or explanation among members. Homogeneous groups are particularly well-suited to focused, time-limited interventions where the clinical goal is addressing a specific, shared concern efficiently—psychoeducational groups, many support groups, and condition-specific CBT groups (for example, a group exclusively for clients with panic disorder) generally benefit from homogeneous composition.</p>
<p>The clinical cost of homogeneous composition is a narrower range of interpersonal styles and reduced opportunity for the kind of social-microcosm work that depends on diversity of relational patterns. A group composed entirely of members who share a conflict-avoidant interpersonal style, for example, may struggle to generate the storming-stage differentiation that produces deep interpersonal learning, because there is no member whose style reliably surfaces the underlying tension. Yalom and Leszcz (2020) note that interpersonal learning groups specifically benefit from heterogeneity of interpersonal style—even when members share a diagnostic category—because the range of relational patterns in the room is what generates the here-and-now material the model depends on.</p>
<p><strong>Heterogeneous composition, by contrast</strong>, produces a richer and more representative <strong>social microcosm</strong> and creates more opportunities for members to encounter relational styles genuinely different from their own, which is often precisely the exposure that produces change. The cost is a longer and more effortful forming stage, because members must do more active work to discover common ground, and a higher risk that a member whose presentation is significantly different from the rest of the group experiences isolation rather than the intended benefit of exposure to difference. This is where the "1-2 principle" described earlier in this section becomes operationally important: heterogeneity is therapeutic when it is genuinely distributed across the group, and becomes harmful when it collapses into a single member carrying a difference alone.</p>
<p>In practice, many clinically effective groups combine both principles by holding one dimension homogeneous (diagnosis, developmental stage, treatment setting) while allowing heterogeneity on other dimensions (age within a reasonable range, gender, cultural background, specific life circumstances). A process group for adults in early recovery from substance use disorder might hold "early recovery" as the homogeneous anchor while intentionally composing heterogeneity of age, gender, and recovery pathway, producing both the rapid universality that shared recovery status provides and the interpersonal richness that comes from genuine difference in how members are navigating that recovery.</p>
<h2>Cultural Factors in Group Process</h2>
<p>Cultural background shapes group process at a structural level that goes well beyond individual member preference, and facilitators who treat culture as a peripheral consideration rather than a central determinant of group dynamics will consistently misread what is happening in the room. Three domains deserve particular attention: collectivist versus individualist value orientations, self-disclosure norms, and power dynamics.</p>
<p><strong>Collectivist cultural frameworks</strong>—prevalent in many Asian, Latino/Hispanic, African, Middle Eastern, and Indigenous communities, though never uniformly so within any group—tend to organize identity around relational and familial context rather than individual autonomy, and tend to prioritize group harmony over individual self-expression when the two are in tension. A member from a strongly collectivist background may experience the individualist assumption embedded in much Western group therapy theory—that direct, individually-owned self-disclosure is inherently therapeutic—as a genuine mismatch with their values rather than as a personal resistance to be worked through. Singh and Salazar (2010) argue that facilitators should distinguish between resistance rooted in individual psychological defense and behavior that reflects a coherent, values-consistent cultural orientation; conflating the two risks pathologizing culturally appropriate behavior as a clinical symptom.</p>
<p><strong>Self-disclosure norms vary</strong> considerably across cultural contexts, and a facilitator who assumes a single universal norm for "appropriate" disclosure will misjudge members whose norms differ. In some cultural contexts, disclosing family conflict or mental health struggles to non-family members carries significant stigma or is understood as a betrayal of family privacy, independent of any individual pathology in the member who is reluctant to disclose. In other cultural contexts, direct emotional expression that would read as appropriately open in a Western clinical frame may be experienced by a member as excessive or inappropriately intense. Facilitators should build groups that make room for a range of disclosure styles and should be cautious about interpreting lower disclosure as lower engagement or lower motivation for change; it is frequently neither.</p>
<p><strong>Power dynamics related to race</strong>, gender, immigration status, socioeconomic class, and other axes of social positioning do not stay outside the group room—they are imported directly into it, and they shape who speaks, whose contributions receive uptake from the group, and whose disclosures are met with curiosity versus subtle dismissal. A facilitator who does not actively attend to these dynamics is not creating a neutral space; the existing power arrangement simply operates unexamined, typically to the advantage of members whose identities carry more social power outside the room. Bernard et al. (2008) recommend that facilitators develop the capacity to name power dynamics directly when they surface in session—for example, noticing aloud when a member's contribution is consistently talked over or minimized in ways that appear to track along an identity dimension—rather than allowing the pattern to continue under the assumption that naming it would be divisive.</p>
<h2>Involuntary and Mandated Members</h2>
<p>Groups composed partly or entirely of members who are attending due to external mandate—court order, employer requirement, child welfare stipulation, or licensing board sanction—present a distinct composition and facilitation challenge that differs qualitatively from voluntary group work. The clinical literature on mandated treatment (drawing substantially from the substance use and domestic violence intervention fields) consistently finds that mandated status alone does not predict poor outcome, but that facilitation approaches designed for voluntary, intrinsically motivated members frequently fail with mandated populations if applied without adaptation.</p>
<p><strong>Motivational interviewing principles</strong>, adapted for group format, are particularly relevant with mandated members: rolling with resistance rather than confronting it directly, eliciting the member's own reasons for change rather than supplying reasons on their behalf, and being transparent about the external requirement without either minimizing it or allowing it to dominate every session's content. A facilitator who pretends the mandate does not exist, hoping to build rapport by avoiding the topic, typically loses credibility with mandated members, who are acutely attuned to whether the facilitator is being honest about the coercive context of their presence.</p>
<p>Composition decisions matter significantly with mandated members: a group composed entirely of members who share mandated status can develop a collective, mutually reinforcing resistance to the treatment frame, sometimes described informally as a "group conspiracy" against the ostensible purpose of the group. A group that mixes mandated and voluntary members can produce useful modeling, as voluntary members demonstrate genuine engagement that mandated members observe, though this composition also requires careful facilitation to prevent voluntary members from being recruited into a caretaking or persuading role toward mandated peers, which is not their function in the group. There is no single correct composition rule here; the facilitator's task is to make the composition decision deliberately, with the specific population and setting in mind, rather than by default.</p>
<h2>Structured Versus Open (Rolling Admission) Groups</h2>
<p>The choice between a structured, closed-enrollment group and an open, rolling-admission group in which membership changes on an ongoing basis has composition implications distinct from the open/closed distinction addressed elsewhere in this course, because rolling admission specifically affects how new members are integrated and how the group's developmental stage is protected across those integrations.</p>`
        },
        {
          type: 'text',
          order: 8.21,
          content: `<p><strong>Rolling-admission groups are standard</strong> in many higher-acuity settings—inpatient units, partial hospitalization programs, intensive outpatient programs—where client length of stay varies and a closed cohort model is often not administratively feasible. In these settings, the facilitator's task shifts from managing a single developmental arc to managing repeated micro-integrations, each of which briefly perturbs the group's current stage. Effective facilitation of rolling-admission groups typically relies on strong, explicit, repeatable structure—consistent opening rituals, explicit restatement of group norms at the start of each session, and a facilitation style that does not depend on members' familiarity with each other's full history—because that history cannot be assumed to be shared.</p>
<p><strong>Structured closed groups, by contrast</strong>, can develop the kind of deep, cumulative relational history that supports the most complex interpersonal work, precisely because composition stability is protected. The tradeoff is reduced flexibility: a structured closed group cannot accommodate a client who needs group treatment mid-cycle, and clinical settings that serve populations with unpredictable timelines for readiness often find the closed model administratively difficult to sustain, whatever its clinical advantages. Many clinics resolve this tension by running parallel tracks—an open, rolling-admission group for stabilization-phase work and a closed, structured group for members who have completed stabilization and are ready for more intensive process work—allowing the composition model to match the clinical phase of treatment rather than forcing a single model to serve incompatible purposes.</p>
<p>Regardless of which structural model a setting adopts, composition decisions should be revisited on a fixed schedule rather than left to drift. A closed group that loses two members to attrition in its first six sessions should prompt an explicit clinical conversation about whether the remaining composition still supports the group's original therapeutic goals, not a passive assumption that the group will simply continue functioning at reduced size. Similarly, a rolling-admission group that has, through the ordinary churn of intake and discharge, become disproportionately weighted toward one presentation, one demographic, or one level of acuity should prompt the same deliberate review. Composition is not a decision made once at the group's inception; it is a standing clinical responsibility that persists for as long as the group exists, and facilitators who build a habitual practice of periodic composition review are better positioned to catch drift before it compromises the group's ability to do the work it was designed to do.</p>`
        },
        {
          type: 'cardSort', order: 9,
          instructions: 'Sort each item into the group type it BEST describes. Each item belongs to exactly one category.',
          categories: ['Psychoeducational', 'Process/Interpersonal', 'CBT/Skill-Building', 'Support', 'Psychodynamic'],
          cards: [
            { id: '1', text: 'Sessions follow a curriculum; the facilitator presents content on stress physiology and coping strategies.', correctCategory: 'Psychoeducational' },
            { id: '2', text: 'The primary change mechanism is the here-and-now examination of interpersonal patterns enacted in the group.', correctCategory: 'Process/Interpersonal' },
            { id: '3', text: 'Members practice cognitive restructuring and behavioral experiments with peer feedback each session.', correctCategory: 'CBT/Skill-Building' },
            { id: '4', text: 'Bereaved parents meet weekly to share experience and provide mutual aid; professional facilitation structures but does not direct the content.', correctCategory: 'Support' },
            { id: '5', text: 'The facilitator interprets transferences between members as re-enactments of early object relationships.', correctCategory: 'Psychodynamic' },
            { id: '6', text: 'A group addressing medication adherence for clients with bipolar disorder; the facilitator provides information and invites questions.', correctCategory: 'Psychoeducational' },
            { id: '7', text: 'Members use the group room as a live social laboratory; the facilitator\'s primary tool is naming what is happening relationally right now.', correctCategory: 'Process/Interpersonal' },
            { id: '8', text: 'DBT skills training group: mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness modules.', correctCategory: 'CBT/Skill-Building' },
          ],
        },
        {
          type: 'matching', order: 10,
          matchingInstructions: 'Match each therapeutic factor to its most accurate clinical description.',
          matchingPairs: [
            { term: 'Universality', definition: 'The relief of discovering that one\'s suffering is shared, not unique—a viscerally corrective experience for isolated clients.' },
            { term: 'Altruism', definition: 'The therapeutic experience of being genuinely helpful to another person, directly challenging self-worthlessness.' },
            { term: 'Interpersonal Learning', definition: 'The group functions as a social microcosm; here-and-now relational patterns are observed, named, and reworked.' },
            { term: 'Group Cohesion', definition: 'The group\'s alliance variable—the precondition for all other therapeutic factors and the strongest predictor of outcome.' },
            { term: 'Corrective Recapitulation', definition: 'Early family dynamics are re-evoked in the group and given a different, reparative outcome through facilitation.' },
            { term: 'Instillation of Hope', definition: 'Witnessing other members\' progress reduces demoralization and grounds expectation that change is possible.' },
          ],
        },
        {
          type: 'reflection', order: 11,
          question: 'Consider a clinical population you currently work with or plan to work with. Which type of group format would be most appropriate for that population, and which of Yalom\'s therapeutic factors would you most intentionally activate in the first three sessions? What specific facilitation moves would you use to activate them?',
        },
        {
          type: 'keyTakeaway', order: 12,
          title: 'Key Takeaways: Group Design',
          takeaways: [
            'Group format (psychoeducational, process, CBT, support, psychodynamic) must be matched to the clinical population and goals—format is not interchangeable.',
            'Yalom\'s eleven therapeutic factors are actionable, not merely descriptive: skilled facilitation deliberately activates or suppresses each factor across the group\'s life.',
            'Group cohesion is the strongest predictor of group outcome, analogous to the therapeutic alliance in individual therapy; it must be built deliberately and protected actively.',
            'The pre-group interview is one of the most empirically supported practices in group therapy and one of the most commonly skipped—skip it at the group\'s peril.',
            'Confidentiality in group therapy is a different and weaker standard than in individual therapy; informed consent must address this explicitly, concretely, and without minimizing.',
            'The "1-2 principle" is a clinical guideline: no member should be the sole representative of a significant identity category. Isolation within the group compounds the isolation group therapy is meant to address.',
            'Open groups require active management of normative culture across membership changes; closed groups require initial composition large enough to absorb normal attrition.',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 2: FACILITATION & COMMON PITFALLS
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Section 2: Facilitation, Group Development, and the Pitfalls That Derail Well-Designed Groups',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider', sectionNumber: '2',
          title: 'Section 2: Facilitation, Group Development, and Common Pitfalls',
          subtitle: 'Stages of group development, facilitator roles, managing disruption, co-facilitation, cultural humility, and the ethics unique to the group format',
          order: 1,
        },
        {
          type: 'text', order: 2,
          content: `<h2>Stages of Group Development: The Group Has a Life Arc</h2>
<p>Understanding the stage-based developmental arc of a therapy group is not merely theoretical—it is operationally necessary. A facilitator who responds to storming-phase conflict as if it were norming-phase work will intervene too quickly and deprive the group of a necessary developmental experience. A facilitator who treats the instability of a new group as pathological rather than as the predictable anxiety of the forming stage will mislabel normal group process as clinical failure. Stage-sensitive facilitation requires that the clinician can accurately identify where a group is in its development and adjust the balance of task-focused and process-focused interventions accordingly.</p>
<p>Tuckman's (1965) model—forming, storming, norming, performing, adjourning—remains the most widely cited developmental framework in the group work literature, and it has been extensively cross-validated with therapy groups (MacKenzie, 1997). Yalom and Leszcz (2020) offer a parallel framework with somewhat different terminology but similar developmental logic. These models should be understood as heuristics rather than rigid sequences; groups cycle through stages, revisit earlier phases in response to membership changes or external stressors, and may arrest at a particular stage if facilitation does not support continued development.</p>
<p><strong>The forming stage</strong> is characterized by orientation, dependency, and the search for structure. Members arrive with significant anxiety about what the group will be, whether they will fit, and whether the leader can be trusted to provide safety. Behavior in the forming stage is heavily leader-focused: members direct most communication to the leader rather than to each other, present carefully managed self-disclosures, and look to the leader for permission and structure. The therapeutic factor most active at this stage is instillation of hope, as members begin to assess whether change is possible and whether this group might produce it.</p>
<p>The facilitator's task in the forming stage is to create safety sufficient for authentic engagement without prematurely pushing for the depth that the group cannot yet sustain. This means structuring early sessions enough to reduce chaos while resisting the pull to over-control—to give so much structure that the group becomes dependent on the leader and never develops its own regulatory capacity. Practically, this involves establishing norms collaboratively rather than announcing them, redirecting communication between members (rather than through the leader), and naming the group's anxiety explicitly: "I'm noticing that most of the questions in this session have come to me. What would it be like to ask someone in this room instead?"</p>
<p><strong>The storming stage</strong> is the developmental phase that most reliably frightens new group facilitators and most commonly causes premature termination among members who have not been adequately prepared. Storming is characterized by interpersonal conflict, challenges to the leader's authority, and the emergence of competitive or aggressive dynamics as members differentiate from one another and from the leader. It is developmentally necessary—groups that skip storming because the leader intervenes too quickly to smooth conflict never develop the authentic relational culture that makes deep work possible. Cohesion forged through navigated conflict is qualitatively more robust than cohesion produced by enforced harmony.</p>
<p>The facilitator's task during storming is to maintain a non-anxious presence while also ensuring that conflict does not become destructive. This requires a fine calibration: too much intervention prevents the group from developing its own conflict resolution capacity; too little allows conflict to escalate into genuine harm. Specific facilitation moves that support productive storming include: naming the conflict explicitly rather than managing it silently ("I notice there's real tension between what Marcus just said and what DeShawn said earlier—can we slow that down and look at it?"); connecting the in-group conflict to the interpersonal themes members bring from outside the group; and modeling that disagreement and repair are possible in a relationship, which is itself a therapeutic experience for many members.</p>
<p><strong>The norming stage</strong> is characterized by the development of cohesion, the establishment of shared norms and group identity, and the movement toward greater self-disclosure and mutual vulnerability. Members begin to direct more communication to each other and less exclusively to the leader; there is increased willingness to acknowledge both positive feelings of connection and painful material that was guarded during forming. The therapeutic factors most active at this stage are universality, cohesion, and the beginning of interpersonal learning.</p>
<p>The facilitator's task in norming is to reinforce and deepen the developing cohesion without allowing it to calcify into a culture of superficial niceness—a phenomenon Yalom called "flight into health" in which the group avoids difficult material by performing wellness and harmony. Practically, this means celebrating genuine moments of connection while also gently tracking whether the group is avoiding necessary tension. It also means attending to the group's developing informal norms and naming those that will impede the work—for example, the norm of always speaking to the whole group rather than directly to the individual one is actually addressing.</p>
<p><strong>The performing stage</strong> is the mature working phase of the group, characterized by high cohesion, productive use of conflict, authentic self-disclosure, and active engagement with the therapeutic factors most associated with personality-level change: interpersonal learning, the corrective recapitulation of the primary family group, and catharsis within a containing environment. The facilitator's role shifts in this phase: less structure is required, less facilitation of basic process, more willingness to sit with silence and to allow the group to find its own way. The marker of a group in the performing stage is that it can tolerate the leader being less active without becoming anxious or collapsing into chaos.</p>
<p><strong>The adjourning stage</strong> (also called termination) is the ending of the group, which in a closed group occurs at a predetermined date and in an open group occurs for each member individually at their point of clinical completion. The termination phase activates existential factors—confrontation with loss, with the impermanence of connection, with the necessity of integrating what was learned without the continued presence of the group as a container. Many clients experience anticipatory grief about the group ending that mirrors other loss experiences in their history. A well-facilitated termination provides time for this material to surface, is explicit about the ending rather than minimizing it, and facilitates direct member-to-member expressions of what the group has meant.</p>`,
        },
        {
          type: 'callout', order: 3, calloutType: 'clinical',
          title: 'When a Group Member Monopolizes: The Facilitation Steps That Preserve Both the Individual and the Group',
          content: `<p>The monopolizing member is one of the most challenging dynamics in group facilitation and one of the most commonly mishandled. Monopolization—consistently consuming disproportionate airtime, redirecting every discussion to one's own experience, or preventing other members from speaking—harms the group in two distinct ways: it deprives other members of their time, and it ultimately deprives the monopolizing member of the interpersonal feedback that is the group's most potent therapeutic offering.</p>
<p><strong>Step 1: Recognize the function of the behavior before intervening.</strong> Monopolization is almost always anxiety-driven, not malicious. The member who cannot stop talking is usually a member who is terrified of silence, of being unseen, or of what might surface if they stopped filling the space. Understanding this reframes the intervention from management to clinical response.</p>
<p><strong>Step 2: Use the group, not just the leader, as the intervention agent.</strong> Rather than cutting the monopolizing member off directly (which is experienced as a shaming rejection by a person whose behavior already reflects insecure attachment), redirect to the group: "I'm aware we've been with Marcus's material for most of the session—I'm wondering what others in the room are noticing, or what's been coming up for you as you've been listening." This both makes space for other members and implicitly surfaces the group's reaction to the monopolizing without the facilitator carrying it alone.</p>
<p><strong>Step 3: Name the dynamic in the group, not just the individual.</strong> "I'm noticing a pattern over the last few sessions—we tend to settle into one person's material and stay there for most of the time. I'm curious what we make of that as a group." This shifts the dynamic from a facilitator-member confrontation to a group-level exploration of what the group is collectively doing and what function it might be serving.</p>
<p><strong>Step 4: In individual pre-group or between-session contact, raise the pattern directly with the monopolizing member.</strong> A brief individual check-in—not a formal session, but a brief conversation—allows the facilitator to name what is being observed, express genuine care for the member's experience, and collaboratively explore what the monopolization might be about. This is not punishment; it is clinical care extended to a person whose behavior is protecting them from something the group could help them face.</p>
<p><strong>What not to do:</strong> Do not allow the monopolization to continue session after session without intervention, hoping the group will regulate itself. It rarely does. Do not publicly shame or abruptly cut off the monopolizing member. Do not address only the individual while ignoring the group's role in allowing and enabling the pattern.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>The Facilitator's Roles: Task and Process</h2>
<p>Group facilitation theory distinguishes between two primary facilitator orientations that must be held in dynamic balance throughout the group's life. The <strong>task orientation</strong> attends to the group's stated work—the content of discussions, the goals members are pursuing, the psychoeducational or skill-based agenda when one exists. The <strong>process orientation</strong> attends to how the group is functioning relationally—the quality of member interactions, the dynamics emerging in the interpersonal field, the group's developmental stage, and the therapeutic factors being activated or suppressed. Neither orientation is dispensable; the question is always one of calibration—which is needed more right now, and what is the cost of attending to one while temporarily releasing the other.</p>
<p>In the early stages of most groups, the task orientation provides the structure that reduces forming-stage anxiety. Members need to know what they are doing here, what is expected of them, and what the group's work looks like concretely. A facilitator who abandons task entirely in pursuit of process leaves early-stage members adrift in unstructured relational space they are not yet equipped to navigate. As the group develops, the process orientation becomes progressively more central. In a mature process group, the facilitator's primary tool is attention to the relational field, and any task content that arises is examined for its process meaning rather than processed purely at face value.</p>
<p>Bernard (1997) described the facilitator's core competencies as including three distinct roles that shift in emphasis across stages: the <strong>meaning-maker</strong> who names what is happening in the group and contextualizes it within a therapeutic framework; the <strong>executive</strong> who manages the group's structure, time, and safety; and the <strong>emotional stimulator</strong> who actively introduces emotionally charged material when the group is avoiding necessary affect. The risk of over-reliance on any one role is significant: a facilitator who functions primarily as meaning-maker can produce insight-heavy, action-poor groups that talk about change without enacting it; a facilitator who functions primarily as executive can produce safe but sterile groups that follow the rules without taking risks; a facilitator who functions primarily as emotional stimulator can produce groups that cycle through cathartic moments without integrating what surfaces.</p>
<h2>Managing Common Group Disruptions</h2>
<p>Even well-designed groups encounter the disruptive dynamics that group therapy literature has described and studied for decades. The value of familiarity with these dynamics is not that they can be prevented—in most cases, they cannot—but that the facilitator who recognizes them immediately can respond with clinical intentionality rather than reactive anxiety.</p>
<p><strong>Silent members</strong> present the mirror-image challenge to monopolizers. The member who consistently says very little in group is not necessarily disengaged; they may be processing intensely, observing carefully, or managing a high level of anxiety about interpersonal exposure. Before intervening, the facilitator should assess what the silence represents. Is this a member who is visibly uncomfortable and clearly wanting to speak but being talked over? Is this a member who appears deeply absorbed in what is happening? Is this a member who has been consistently absent from the group's emotional life in ways that suggest emotional disconnection rather than reflective engagement?</p>
<p>Interventions for silent members should be graduated and non-shaming. A simple group-level invitation—"I'd like to make sure everyone who wants to has a chance to add something"—opens the door without forcing it. A slightly more targeted approach—"I've noticed DeShawn has been very quiet this session—I'm wondering what's been happening for you as you listen"—extends a direct invitation without demanding a response. What does not work, and what replicates the shame that many silent members are managing, is directly calling out the silence in a way that places the member in the center of the group's spotlight against their will.</p>
<p><strong>Scapegoating</strong> is among the most dangerous group dynamics and the one that, when unaddressed, most directly harms individual members. Scapegoating occurs when the group unconsciously selects one member to carry the group's disowned affect, typically negative emotions—anger, shame, inadequacy, or deviance—that the group as a whole cannot own. The scapegoated member is then systematically targeted, criticized, or excluded by the group, often in ways that each individual act seems mild but that accumulate into a pattern of sustained marginalization.</p>
<p>The facilitation response to scapegoating must happen at the group level, not at the individual level. Intervening by defending the scapegoated member against the group reinforces the unconscious dynamic—the member remains the identified problem, and the facilitator merely takes their side. The effective intervention names the group-level pattern: "I'm noticing that over the last several sessions, a lot of the group's frustration seems to land on Marcus. I want to slow that down and look at it. What is it that Marcus represents for this group—what might he be carrying for us?" This reframing asks the group to own what it has projected, which is the only way the dynamic can be resolved rather than merely managed.</p>
<p><strong>Subgrouping</strong> refers to the formation of coalitions within the group—members who align privately, who sit together, who communicate with each other outside of sessions in ways that create a group-within-the-group. Some degree of natural affinity and connection among members is healthy and is related to the development of cohesion. Subgrouping becomes clinically problematic when it creates a two-tiered group structure in which some members are more inside than others, when it produces between-session alliances that are kept secret from the group, or when it results in in-group collusion that suppresses necessary conflict.</p>
<p>The standard facilitation response to problematic subgrouping is the group agreement that all significant between-session contact should be brought back into the room. When two members tell the facilitator that they have been texting and have "a lot to discuss," the facilitator's response is not curiosity about the content but a request that it be brought into the group: "That sounds like important material—can you bring that here?" The group norm is not that members cannot have relationships outside of sessions; it is that those relationships are part of the group's relational life and belong in the group's awareness.</p>
<p><strong>Premature termination</strong>—a member leaving the group before clinical completion—is a predictable event in any group's life and a developmentally charged one. Every premature departure activates members' attachment-related fears about abandonment, rejection, and the fragility of connection. The departing member's reasons for leaving—whether they have been scapegoated, have become overwhelmed, have experienced an external life change, or are acting out an avoidance of the specific therapeutic work the group is approaching—are clinically meaningful and deserve explicit processing in the group.</p>
<p>The APA guidelines for group psychotherapy recommend that facilitators establish a group norm at the outset: members who are considering leaving should bring that consideration to the group before they leave, so that the leaving can be processed collectively rather than experienced as a sudden abandonment. This norm rarely prevents every premature departure—people leave for reasons they are not yet ready to name—but it reduces the shock of unannounced departures and creates a frame within which the group can process the loss productively.</p>
<h2>Co-Facilitation: The Relationship Behind the Group</h2>
<p>Co-facilitation—the use of two facilitators in a single group—is widely practiced and widely recommended, particularly for long-term process groups and for groups with high clinical acuity. The theoretical rationale is straightforward: two facilitators can attend simultaneously to individual member dynamics and group-level process, can model direct relational engagement (including conflict and repair), and can provide different relational targets for the transferences that emerge. The practical reality is that co-facilitation is only as good as the co-facilitation relationship itself, and a poorly managed co-facilitation relationship introduces dynamics into the group that are more harmful than the absence of a co-facilitator.</p>
<p>Okech and Kline (2006) studied the experience of group co-facilitators and identified several predictable areas of tension: differences in theoretical orientation, power differentials related to experience or professional rank, unresolved interpersonal conflict between co-facilitators that plays out in the group room, and competition for leadership that members observe and triangulate into. Each of these dynamics is avoidable if co-facilitators invest adequate time in their pre-group and between-session consultation. The minimum recommended practice is a structured debrief after every session—not merely a check-in, but a systematic review of what each facilitator observed, what each felt during the session, and whether there are any tensions in the co-facilitation relationship that need to be named and addressed before the next session.</p>`,
        },
        {
          type: 'accordion', order: 5,
          accordionItems: [
            {
              title: 'Tuckman\'s Stages and Yalom\'s Model: A Side-by-Side Comparison',
              content: `<p>Both models describe the same developmental arc with somewhat different language. Using both enriches clinical observation:</p>
<table style="width:100%;border-collapse:collapse">
<tr><th style="border:1px solid #ccc;padding:6px">Tuckman</th><th style="border:1px solid #ccc;padding:6px">Yalom/Leszcz</th><th style="border:1px solid #ccc;padding:6px">Primary Therapeutic Factors</th><th style="border:1px solid #ccc;padding:6px">Facilitator Priority</th></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Forming</td><td style="border:1px solid #ccc;padding:6px">Orientation/Hesitant Participation</td><td style="border:1px solid #ccc;padding:6px">Hope, Universality</td><td style="border:1px solid #ccc;padding:6px">Safety creation, norm establishment</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Storming</td><td style="border:1px solid #ccc;padding:6px">Conflict/Dominance</td><td style="border:1px solid #ccc;padding:6px">Cohesion (forged through conflict)</td><td style="border:1px solid #ccc;padding:6px">Non-anxious presence; prevent destructive escalation</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Norming</td><td style="border:1px solid #ccc;padding:6px">Cohesion Development</td><td style="border:1px solid #ccc;padding:6px">Cohesion, Universality, beginning Interpersonal Learning</td><td style="border:1px solid #ccc;padding:6px">Deepen cohesion; watch for avoidance of necessary tension</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Performing</td><td style="border:1px solid #ccc;padding:6px">Working Phase</td><td style="border:1px solid #ccc;padding:6px">Interpersonal Learning, Corrective Recapitulation, Catharsis</td><td style="border:1px solid #ccc;padding:6px">Reduced structure; tolerate silence; trust the group</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Adjourning</td><td style="border:1px solid #ccc;padding:6px">Termination</td><td style="border:1px solid #ccc;padding:6px">Existential Factors</td><td style="border:1px solid #ccc;padding:6px">Explicit processing of ending; facilitate direct expression of meaning</td></tr>
</table>`,
            },
            {
              title: 'Facilitator Responses to Scapegoating: Step by Step',
              content: `<p>Scapegoating requires group-level intervention, not individual-level defense. The protocol:</p>
<ol>
<li><strong>Detect early.</strong> Scapegoating rarely announces itself. Watch for recurring patterns: one member whose contributions are regularly minimized, challenged, or ignored; one member who receives disproportionate "constructive feedback"; one member whose absences are met with quiet relief rather than concern.</li>
<li><strong>Name the pattern at the group level.</strong> "I've been noticing over the last few sessions that a lot of the group's intensity tends to land on [Name]. I want to stop and look at that together."</li>
<li><strong>Invite the group to explore what the scapegoated member represents.</strong> "What is it about what [Name] brings that seems to call up so much reaction? What might they be carrying for the rest of us?"</li>
<li><strong>Protect the scapegoated member without rescuing them.</strong> Defending the member directly reinforces the identified-patient dynamic. Name the group's responsibility for the pattern rather than positioning the scapegoated member as a victim needing the leader's protection.</li>
<li><strong>Monitor for recurrence.</strong> Scapegoating dynamics are deeply unconscious and rarely resolved in a single intervention. Track whether the pattern shifts or simply finds a new target.</li>
</ol>`,
            },
            {
              title: 'Co-Facilitation Best Practices',
              content: `<ul>
<li><strong>Align on orientation before the group begins.</strong> Co-facilitators who have different theoretical models for what the group is trying to accomplish will model confusion and incoherence to members. Alignment on orientation does not require identical approaches; it requires a shared framework for the group's goals and a clear agreement about how differences will be handled in session.</li>
<li><strong>Establish a primary-secondary structure for early sessions.</strong> In the forming stage, having one facilitator take a slightly more active role reduces confusion for members. This does not have to be permanent and should shift as the group develops.</li>
<li><strong>Address power differentials explicitly.</strong> If one co-facilitator is more experienced, higher-credentialed, or belongs to the majority culture in the group, those differentials will be perceived by members. Name them rather than pretending they don't exist.</li>
<li><strong>Never undermine each other in session.</strong> Disagreements between co-facilitators should be taken to the between-session debrief, not enacted in the group room. If a co-facilitator makes an intervention the other views as unhelpful, the response is not a contradicting intervention but a gently expanding one: "I want to add to what [Co-facilitator] said…"</li>
<li><strong>Debrief after every session.</strong> This is not optional. The co-facilitation relationship IS a clinical relationship and requires the same attention as any other.</li>
</ul>`,
            },
            {
              title: 'Cultural Considerations in Group Facilitation',
              content: `<p>Cultural variables affect every dimension of group process: who speaks, who is silent, how conflict is expressed and managed, what counts as intimacy, and whose experience is centered. Key facilitation considerations:</p>
<ul>
<li><strong>Individualism vs. collectivism:</strong> Many Western group therapy models assume that direct self-disclosure, assertive self-advocacy, and explicit conflict are normative. Clients from collectivist cultural backgrounds may experience these norms as disrespectful or inappropriate. Facilitators should make room for different relational styles without pathologizing cultural difference.</li>
<li><strong>Power dynamics related to race, gender, and class:</strong> These dynamics will replicate themselves in the group room. The facilitator who ignores them is not neutral—they are colluding with the power arrangements that members carry in from the world. Cultural humility requires active attention to when these dynamics are shaping who speaks and whose voice is heard.</li>
<li><strong>Language and linguistic access:</strong> Groups in multilingual communities require deliberate attention to who can fully participate. "English-preferred" should not become a default that excludes; simultaneous interpretation or language-specific groups may be more equitable.</li>
<li><strong>Spiritual and religious frameworks:</strong> Many clients experience their distress and their healing within a spiritual framework that secular group therapy models have historically ignored. Creating space for that framework—without pathologizing it or endorsing it—is part of cultural competence in the group setting.</li>
</ul>`,
            },
            {
              title: 'Ethics in Group Work: Dual Relationships, Boundaries, and Between-Session Contact',
              content: `<p>The group format creates ethical obligations that are distinct from and additional to those in individual therapy:</p>
<ul>
<li><strong>Dual relationships between members:</strong> Group members may work together, share a neighborhood, attend the same faith community, or have family connections. Pre-group screening should assess for pre-existing relationships between prospective members. If pre-existing relationships are discovered, the clinician must assess whether they create sufficient conflicts to preclude co-membership. The ACA Code of Ethics does not permit ignoring known dual relationships and hoping they won't matter.</li>
<li><strong>Dual relationships between facilitator and members:</strong> A facilitator who is in an individual therapy relationship with a group member occupies a dual relationship that warrants careful attention to role clarity and to the ways that the individual relationship may create explicit or implicit favoritism in the group. Consultation or supervision is indicated whenever this arrangement exists.</li>
<li><strong>Between-session member contact:</strong> The group agreement should address between-session contact explicitly. Secret between-session alliances—members sharing group content with each other outside of sessions without bringing it back to the group—are a form of subgrouping and undermine group cohesion. The norm is transparency: outside contact is not prohibited, but it is brought back into the group room.</li>
<li><strong>Social media and digital communication:</strong> Group members who connect on social media outside of sessions are engaging in a form of outside contact with the potential to create subgroups, share group content digitally, and blur the boundaries of the group frame. Groups formed in the current era require an explicit social media agreement.</li>
</ul>`,
            },
          ],
        },
        {
          type: 'imageText', order: 6,
          content: `<h3>The Facilitator's Field of Attention</h3>
<p>The image illustrates the multi-level attention that effective group facilitation requires. At any given moment, the facilitator is attending simultaneously to the individual member's verbal and nonverbal communication, to the dyadic dynamics emerging between specific members, to the group-level dynamics (the group's mood, its developmental stage, which therapeutic factors are active), and to their own internal experience as a data source about the group's unconscious climate.</p>
<p>This multi-level attention is not merely a cognitive skill—it is a practiced clinical capacity that develops over time and requires regular supervision and peer consultation to refine. Facilitators who attend only to the individual-member level miss the group dynamics that are often carrying the most clinically significant material. Facilitators who attend only to the group level miss the specific member experiences that require direct clinical attention. Holding both simultaneously, and knowing when to shift the focus of intervention, is the core competency that distinguishes advanced group facilitation from basic group management.</p>`,
          image: '', imageAlt: 'Concentric circle diagram showing the facilitator\'s simultaneous field of attention: individual member, dyadic dynamics, group-level process, and facilitator self-awareness at center', imagePosition: 'left',
        },
        {
          type: 'multiSelect', order: 7,
          question: 'Which of the following are clinically accurate statements about the storming stage of group development? Select ALL that apply.',
          options: [
            { text: 'Storming is a developmentally necessary phase that, when navigated successfully, produces a qualitatively more robust cohesion than avoidance of conflict would.', isCorrect: true },
            { text: 'The facilitator\'s primary goal during storming is to eliminate conflict as quickly as possible to prevent member dropout.', isCorrect: false },
            { text: 'Groups that skip storming through premature intervention by the facilitator typically fail to develop the authentic relational culture necessary for deep interpersonal work.', isCorrect: true },
            { text: 'Challenges to the facilitator\'s authority during storming are best addressed by reasserting the facilitator\'s clinical expertise to reestablish group safety.', isCorrect: false },
            { text: 'Storming often involves the emergence of interpersonal conflict, competition among members, and differentiation from the leader—all of which serve developmental functions.', isCorrect: true },
            { text: 'Conflict during storming is always a sign that the group was composed incorrectly and should be reconstituted.', isCorrect: false },
          ],
          explanation: 'Storming is developmentally necessary. Groups that are over-managed by facilitators who avoid conflict often never develop genuine cohesion. Challenges to authority are part of differentiation, not pathology. Conflict during storming typically reflects healthy development, not composition error. The facilitator\'s role is to maintain non-anxious presence and prevent destructive escalation—not to eliminate the conflict.',
        },
        {
          type: 'text', order: 8,
          content: `<h2>Cultural Humility in the Group Room</h2>
<p>Cultural humility, as described by Tervalon and Murray-García (1998) and expanded into clinical practice by Hook et al. (2013), is not a skill set acquired once and thereafter possessed—it is an ongoing relational stance characterized by self-reflection about the limits of one's cultural knowledge, openness to being taught by clients, and active redress of power imbalances in the therapeutic relationship. In the group setting, the relevance of cultural humility is amplified rather than diluted, because cultural dynamics are enacted not only in the facilitator-member relationship but in the member-member relationships that constitute the group's relational field.</p>
<p>When a group includes members from significantly different cultural backgrounds, the facilitator's cultural humility includes responsibility for the group's cultural climate—for whether the group's norms, its implicit expectations, and its way of processing material are accessible and equitable for all members. A group whose norms are built entirely on middle-class, white, individualist assumptions about self-disclosure, emotional expression, and interpersonal directness is not a culturally neutral space; it is a culturally specific space that requires some members to translate themselves in order to participate while allowing others to participate without translation. The facilitator who does not name this does not escape the dynamic—they allow it to shape the group's accessibility without accountability.</p>
<p>Practical applications of cultural humility in group facilitation include explicit attention to who is speaking and who is silent; willingness to examine the group's norms when they may be excluding; the use of culturally specific examples in psychoeducational content; and the creation of space for members to name their cultural experience of the group rather than only their individual psychological experience. When a member says "I don't know if this is relevant, but in my family, you never talk about these things with people you don't know very well," the culturally humble facilitator does not rush past that disclosure to return to the task. They stop, receive it, and invite the group to sit with what it means—for that member, for the group's norms, and for the question of what "talking about these things" actually costs different members differently.</p>
<h2>Ethics of Dual Relationships in the Group Setting</h2>
<p>The ethics of dual relationships in individual therapy are well-documented in the ACA Code of Ethics (2014) and the NASW Code of Ethics (2021). In the group setting, the ethical landscape is more complex because dual relationships can exist between the facilitator and a member, between two members, or, in some cases, between the facilitator and multiple members in a variety of configurations. The group format does not relax ethical standards—it multiplies the relational configurations to which ethical standards must be applied.</p>
<p>The most common dual-relationship scenario in outpatient group practice is the situation in which a facilitator is providing both individual and group therapy to the same client. This arrangement is common and, when managed thoughtfully, is not inherently harmful. The research on combined individual and group therapy (Piper, 1994) generally shows additive benefit rather than role confusion when the arrangement is explicitly structured and the clinician is clear with the client about how information from each modality will or will not be shared in the other. What creates ethical problems is unacknowledged favoritism—the individual-therapy client receiving more facilitation time, more interpretive depth, or more protective intervention in the group than other members receive—or the reverse, excessive withholding in the group to protect the individual therapy frame in ways that harm the member's group experience.</p>
<p>Pre-existing social relationships between group members—co-workers, friends, family members—present a more categorical ethical concern. When two members of a group have a pre-existing relationship outside of the group, the confidentiality of every other member's disclosure is compromised. The two co-workers who attend the same group will inevitably encounter each other's disclosures in their shared social world, and the inability of the facilitator to enforce confidentiality in that external relationship is not merely a risk—it is a structural reality. Facilitators should screen for pre-existing relationships between prospective members during the pre-group interview and should have a clear clinical policy—not an improvisational one—for managing the rare situations in which such relationships are discovered after a group has begun.</p>
<p>The emerging domain of social media ethics in group work is one where professional guidance is still developing, but the clinical logic is clear: social media connections between group members create uncontrolled conduits for the transmission of group content outside the group frame, can generate subgroups that operate entirely outside the facilitator's awareness, and can expose members' group participation to individuals who have no clinical relationship and no confidentiality obligation. The group agreement should address social media explicitly, including a request that members not connect on social media platforms during the course of the group without bringing that decision to the group for discussion.</p>`,
        },
        {
          type: 'text',
          order: 8.1,
          content: `<h2>Confidentiality in Groups: What Members Owe Each Other Versus What the Clinician Can Guarantee</h2>
<p>The distinction between the clinician's confidentiality obligation and the members' confidentiality obligation is foundational to ethical group practice, and it is a distinction many clients—and, occasionally, less experienced clinicians—collapse without realizing it. The clinician's obligation to protect client confidentiality is a licensure-based, legally enforceable duty grounded in state law, professional codes of ethics, and, where applicable, federal regulations. That obligation applies to the clinician's own conduct: the clinician cannot disclose what a group member shares, cannot discuss one member's material with another member outside the group context, and cannot document in a way that unnecessarily exposes one member's disclosures to review by another.</p>
<p>Group members, by contrast, are not bound by any of these professional or legal structures. A member who discloses another member's participation in the group, repeats another member's disclosed material outside the group, or otherwise breaches the group's confidentiality agreement is not violating a licensure standard or a legally enforceable duty—they are violating an ethical agreement the group established collaboratively, and the consequence for that violation is relational and clinical (loss of trust, potential group-level processing, in serious cases removal from the group), not legal or regulatory. This is precisely why the ACA Code of Ethics (2014) and the ASGW Best Practice Guidelines (2008) require clinicians to state this distinction explicitly and concretely during informed consent, rather than allowing members to assume that a group functions with the same confidentiality protection as individual therapy.</p>
<p>A clinically useful way to explain the distinction to prospective members during the pre-group interview is to separate the phrase "confidential" into two different promises: "I promise that I, as your clinician, am bound by law and by my professional ethics not to disclose what you share here, except in the specific situations I'm about to describe. I cannot make that same promise on behalf of the other members of this group, because I have no legal authority over them. What I can do is ask every member to agree to protect each other's privacy as a condition of being in this group, and I will address it directly if that agreement is broken." This framing gives prospective members an accurate basis for the disclosure decisions they will make in the group, which is the actual purpose of informed consent.</p>
<h2>HIPAA Considerations in Group Treatment Settings</h2>
<p>The Health Insurance Portability and Accountability Act (HIPAA, 1996) and its associated <strong>Privacy Rule</strong> apply to protected health information generated in group treatment in the same way they apply to individual treatment, but the group context introduces practical complications that individual treatment does not present. Group sign-in sheets are a common and often overlooked HIPAA exposure: a paper or digital sign-in sheet that lists every group member's name in a shared, visible format effectively discloses each member's participation in mental health treatment to every other member who signs the same sheet. Practices should use sign-in procedures that do not create a shared visible record of attendance, or should treat the sign-in sheet itself as protected health information requiring the same safeguards as any clinical document.</p>
<p>Billing and scheduling systems present a related exposure. A shared appointment calendar visible to front-desk staff that lists "Group Therapy—[Diagnosis]" alongside member names discloses more protected information than is clinically necessary for scheduling purposes; best practice is to schedule group appointments using de-identified or minimally identifying labels wherever the practice management system allows it. Telehealth group delivery introduces additional considerations: waiting rooms in telehealth platforms can inadvertently reveal member identities to each other before a session begins if the platform does not adequately screen participants into a private waiting state, and screen-sharing or recording features must be disabled or tightly controlled to prevent one member's video feed, environment, or informally shared information from being captured and retained outside the clinical record.</p>
<p>Clinicians should also apply HIPAA's <strong>minimum necessary standard</strong> when responding to a group member's request for their own records. A member has a right to their own protected health information, including relevant documentation of their own participation and progress, but that right does not extend to information specifically about other members' disclosures, diagnoses, or clinical presentations that may be referenced in shared session notes. This creates a direct link between HIPAA compliance and the note-writing practices addressed in the next section: notes that are structured member-by-member, rather than as an undifferentiated narrative of "what happened in group today," make it substantially easier to honor a records request from one member without inappropriately disclosing another member's protected information.</p>
<h2>Writing Group Notes Without Violating Co-Members' Privacy</h2>
<p>Group progress notes present a structural documentation challenge that individual therapy notes do not: a single group session generates clinically relevant material about multiple clients simultaneously, and each client's chart should reflect that client's participation, presentation, and progress without becoming a de facto record of every other member's clinical material. The most reliable structural solution is to write a separate note for each member for each session, focused specifically on that member's presentation, engagement, and relevant clinical observations, rather than writing a single narrative group note and copying it into every member's chart.</p>
<p>When a member-specific note needs to reference group interaction—which is often clinically necessary, since a member's interpersonal behavior in the group is frequently the most relevant clinical data available—the standard practice is to describe the member's own behavior and response without using other members' identifying information. Rather than writing "Client became tearful after Marcus confronted her about interrupting," a compliant note describes the clinically relevant material about the client being documented: "Client became tearful in response to peer feedback regarding interpersonal patterns; explored connection to family-of-origin dynamics. Client demonstrated capacity to remain present with difficult affect rather than withdrawing, a shift from earlier sessions." The clinical substance is preserved; the co-member's identity is not embedded in a chart they have no access to and did not consent to being named in.</p>
<p>This same principle governs treatment plan updates, discharge summaries, and any documentation that might later be subject to a records request, subpoena, or third-party review (such as an insurance audit). Clinicians should develop and follow a consistent internal convention—referring to other members by role or relative description ("another group member," "a peer in the group") rather than by name or identifying detail—so that member-specific documentation habitually protects co-member privacy rather than relying on the clinician remembering to redact identifying details after the fact.</p>
<h2>Mandatory Reporting When the Reportable Content Concerns Someone Other Than the Discloser</h2>
<p>Mandatory reporting obligations in group therapy present a specific complication that does not arise in individual treatment: a member may disclose reportable content—child abuse, elder abuse, or information that triggers a {{callout:duty-to-warn}}—that concerns a third party who is not the disclosing member and, in some cases, is not even a client of the practice. {{alert:mandatory}} The clinician's mandatory reporting obligation is triggered by the content of the disclosure, not by whose case file it happens to appear in, so the fact that the concerning content was disclosed by Member A about Member A's own child, spouse, or associate does not change the clinician's duty; the report must still be made according to the jurisdiction's mandatory reporting statute.</p>
<p>The more clinically complex scenario arises when one member discloses reportable content about another member of the same group—for example, Member A states in session that Member B, also present in the group, described physically disciplining a child in a manner that meets the jurisdiction's threshold for a reportable concern. This scenario requires the clinician to determine the reporting obligation independent of who made the original disclosure: if the content meets the statutory threshold for mandatory reporting regardless of its source, the clinician's duty to report is triggered by hearing the content, not solely by receiving it directly from the person it concerns. Clinicians facilitating groups should have clear internal protocols, developed in consultation with legal counsel or a clinical supervisor, for exactly this scenario, because the group format multiplies the pathways through which reportable content can surface and increases the likelihood that a clinician will need to act on secondhand disclosure.</p>`
        },
        {
          type: 'text',
          order: 8.11,
          content: `<p>These situations also carry a distinct clinical management dimension beyond the legal reporting obligation: the group's relational fabric is affected when members become aware that a report has been made based on group disclosure, even when the clinician has followed every legal and ethical requirement correctly. Facilitators should be prepared to address, at the group level and without violating anyone's legal protections, the impact of a report on group trust and cohesion, and should have thought through in advance how much process time such an event may require.</p>
<h2>Handling Subgrouping and Out-of-Session Contact Between Members</h2>
<p>Documentation and ethical practice around subgrouping deserve explicit attention distinct from the clinical facilitation guidance addressed elsewhere in this course, because subgrouping and out-of-session contact create both a clinical dynamic to manage and a documentation question to resolve. When two members disclose in session that they have been in contact outside of group, that disclosure itself becomes part of the clinical record for both members, and the clinician's documentation should reflect the group agreement's application—that the contact was disclosed, discussed, and brought into the group's shared awareness as required by the group's established norms—rather than omitting it as an uncomfortable detail.</p>
<p>When subgrouping is discovered rather than voluntarily disclosed—for example, the clinician learns through an indirect route that two members have been in ongoing contact that was not brought to the group—the documentation and clinical response should distinguish between the fact of the contact (which is not, by itself, an ethical violation; adult clients are free to have relationships outside of a therapy group) and the breach of the specific group agreement regarding transparency about that contact. The clinical intervention addresses the breach of the transparency agreement and its impact on group trust; it should not pathologize the underlying relationship or treat adult clients' outside connections as inherently a clinical problem.</p>
<p>Persistent, secretive subgrouping that a clinician has addressed directly and that continues despite intervention raises a different clinical and ethical question: whether continued co-membership in the group remains appropriate for the members involved. This determination should be documented with the same rigor as any other significant clinical decision—the pattern observed, the interventions attempted, the clinical rationale for the final decision, and the plan for the affected members going forward, whether that plan involves continued group participation with renewed agreements or referral to alternative treatment.</p>
<p>Supervision and consultation play a distinct role across all of these documentation and ethics domains. A facilitator who encounters an ambiguous mandatory reporting scenario, an unresolved dual-relationship question, or a persistent subgrouping pattern that intervention has not resolved should treat consultation with a clinical supervisor or peer consultation group as a standard part of ethical practice rather than a sign of deficiency. Group work generates precisely the kind of multi-party ethical complexity that benefits from a second clinical perspective, and documenting that consultation occurred—who was consulted, what was discussed, and what clinical rationale resulted—provides an additional layer of protection for both the clinician and the members of the group.</p>`
        },
        {
          type: 'callout',
          calloutType: 'ethics',
          title: 'The Two Confidentiality Promises',
          content: `<p>During informed consent, separate what you can promise from what you cannot: "I am bound by law and professional ethics not to disclose what you share. I cannot make that same promise on behalf of the other members — but I will ask every member to agree to protect each other's privacy, and I will address it directly if that agreement is broken."</p>`
        },
        {
          type: 'scenarioTree', order: 9,
          scenarioTitle: 'Navigating a Storming-Phase Conflict in a Process Group',
          startNode: 'start',
          nodes: {
            start: {
              text: 'You are facilitating a closed process group in its fourth session. Two members—Terrence and Aniyah—have been in a low-grade conflict for two sessions. Today, Terrence says directly to Aniyah: "You always shut down whatever I say. You make it impossible for anyone to finish a thought." The room goes quiet. What is your first response?',
              choices: [
                { text: 'Intervene immediately to de-escalate and redirect: "Let\'s take a breath. Who else wants to share something today?"', nextId: 'redirect' },
                { text: 'Slow the moment down and bring the group in: "I want to stop here. Let\'s all sit with what just happened for a moment. What\'s the room noticing?"', nextId: 'slowdown' },
                { text: 'Address Terrence directly: "Terrence, it sounds like you\'re frustrated. Can you say more about that?"', nextId: 'terrence_only' },
              ],
            },
            redirect: {
              text: 'The conflict is avoided, but Terrence looks shut down, Aniyah looks vindicated, and the rest of the group visibly relaxes—which is a warning sign, not a success. You\'ve managed the moment but missed the therapeutic opportunity. The same dynamic re-appears next session, more intense.',
              choices: [
                { text: 'In the next session, name the pattern: "I\'m aware we moved past something significant last week. I want to return to it."', nextId: 'return_pattern' },
              ],
            },
            terrence_only: {
              text: 'Terrence shares more about his frustration. Aniyah remains silent and increasingly withdrawn. The group watches the facilitator manage the conflict as a therapist-to-client exchange. Other members never enter. The here-and-now moment passes without group-level processing.',
              choices: [
                { text: 'After Terrence finishes, bring the group in: "I want to ask the rest of you—what has it been like to witness this exchange?"', nextId: 'bring_group_late' },
              ],
            },
            slowdown: {
              text: 'By slowing down and bringing the group in, you create space for other members to name what they witnessed. Two members note that they\'ve felt the same tension but hadn\'t said anything. One member says: "I think Terrence said something a lot of us have been thinking." What next?',
              choices: [
                { text: 'Ask Aniyah directly: "Aniyah, you\'ve heard Terrence and now heard others. What\'s happening for you right now?"', nextId: 'aniyah_direct' },
                { text: 'Ask the group: "What do we make of the fact that this has been present for a few sessions but hasn\'t been named until now? What kept it underground?"', nextId: 'group_process' },
              ],
            },
            aniyah_direct: {
              text: 'Aniyah becomes tearful and shares that she\'s felt judged by the group for several sessions and has been managing that by becoming quieter. The conflict opens into a productive exploration of the group\'s dynamic with difference and disagreement. This is storming-stage work. You have facilitated it rather than prevented it.',
              isEnd: true,
            },
            group_process: {
              text: 'The group explores why the tension remained underground. Members begin to name their own contributions to the silence—one member says she didn\'t want to "cause drama," another says he assumed the facilitator would handle it. The group\'s norms around conflict become explicitly visible and available for examination. Cohesion deepens through the navigated conflict.',
              isEnd: true,
            },
            return_pattern: {
              text: 'Naming the avoided moment is better than never naming it. The group can return to the material, though the immediacy of the original moment is lost. Storming-phase conflict is most therapeutically potent when processed in the moment it occurs, not in retrospect. This is a recovery intervention, not an optimal one.',
              isEnd: true,
            },
            bring_group_late: {
              text: 'Bringing the group in after the dyadic exchange has concluded allows other members to reflect on what they witnessed. This is better than maintaining the dyadic frame throughout, but the richest therapeutic material was the live enactment itself—the group watching in silence while two members fought through the facilitator. A group-level intervention earlier would have been more potent.',
              isEnd: true,
            },
          },
        },
        {
          type: 'fillInBlank', order: 10,
          question: 'Complete each statement with the correct term from the facilitation and group development literature.',
          blanks: [
            {
              sentence: 'The group dynamics stage characterized by interpersonal conflict, challenges to the leader\'s authority, and member differentiation is called the _____ stage.',
              answer: 'storming',
              acceptableAnswers: ['storming', 'Storming'],
            },
            {
              sentence: '_____ occurs when the group unconsciously selects one member to carry its disowned negative affect, resulting in systematic targeting or exclusion of that member.',
              answer: 'Scapegoating',
              acceptableAnswers: ['Scapegoating', 'scapegoating'],
            },
            {
              sentence: 'The formation of within-group alliances—particularly when they involve secret between-session communication—is called _____ and can fracture group cohesion.',
              answer: 'subgrouping',
              acceptableAnswers: ['subgrouping', 'Subgrouping'],
            },
            {
              sentence: 'Yalom\'s therapeutic factor in which members discover their suffering and shame are not unique but shared is called _____.',
              answer: 'universality',
              acceptableAnswers: ['universality', 'Universality'],
            },
            {
              sentence: 'In co-facilitation, the _____ after each session is described as a minimum practice for maintaining co-facilitation relationship health and preventing co-facilitator conflicts from entering the group room.',
              answer: 'debrief',
              acceptableAnswers: ['debrief', 'structured debrief', 'post-session debrief'],
            },
          ],
        },
        {
          type: 'reflection', order: 11,
          question: 'Think of a group you have facilitated, observed, or participated in. Which disruptive dynamic—monopolization, silence, scapegoating, subgrouping, or premature termination—have you witnessed, and how was it handled? In retrospect, what would a group-level rather than individual-level intervention have looked like? If you have not yet facilitated a group, describe how you would prepare yourself clinically for the possibility of scapegoating in a group you plan to run.',
        },
        {
          type: 'keyTakeaway', order: 12,
          title: 'Key Takeaways: Group Facilitation and Common Pitfalls',
          takeaways: [
            'Tuckman\'s forming-storming-norming-performing-adjourning model and Yalom\'s parallel framework are clinical heuristics, not rigid sequences—groups cycle back, arrest, and respond to membership changes dynamically.',
            'Storming is developmentally necessary. Premature intervention to smooth conflict prevents the development of the authentic cohesion that makes deep group work possible.',
            'The facilitator must balance task and process orientations—early sessions require more structure; mature groups require more process focus. Neither can be abandoned.',
            'Monopolization, silent members, scapegoating, subgrouping, and premature termination each require specific clinical responses. Scapegoating always requires group-level intervention, not individual-level defense.',
            'Co-facilitation is only as effective as the co-facilitation relationship. A structured between-session debrief after every group meeting is the minimum requirement for maintaining that relationship.',
            'Cultural humility in group facilitation means actively attending to whose cultural norms shape the group\'s implicit expectations—and explicitly creating access for members whose cultural frameworks differ.',
            'Dual relationships in group therapy—between facilitator and member, or between members—require explicit management grounded in the ACA Code of Ethics, not ad hoc problem-solving.',
          ],
        },
        {
          type: 'resources', order: 13,
          title: 'Resources for Group Therapy Practice',
          resources: [
            {
              title: 'Association for Specialists in Group Work (ASGW)',
              url: 'https://www.asgw.org',
              type: 'website',
              description: 'The primary professional organization for group work practitioners. Provides the ASGW Best Practice Guidelines, Principles for Diversity-Competent Group Workers, and professional development resources including training standards and supervision guidelines.',
            },
            {
              title: 'ASGW Best Practice Guidelines (2008)',
              url: 'https://www.asgw.org/resources/best-practice-guidelines',
              type: 'website',
              description: 'The foundational ethical and practice guidelines for group work clinicians, covering planning, performing, and processing phases. Required reading for any clinician beginning group facilitation.',
            },
            {
              title: 'APA Division 49: Group Psychology and Group Psychotherapy',
              url: 'https://www.apa.org/about/division/div49',
              type: 'website',
              description: 'APA\'s division dedicated to group therapy research and practice. Resources include practice guidelines, research publications, and links to evidence-based group treatment manuals.',
            },
            {
              title: 'Yalom, I. D., & Leszcz, M. (2020). The Theory and Practice of Group Psychotherapy (6th ed.)',
              url: 'https://www.basicbooks.com/titles/irvin-d-yalom/the-theory-and-practice-of-group-psychotherapy/9781541617575/',
              type: 'book',
              description: 'The definitive clinical and theoretical text on group psychotherapy. The sixth edition updates Yalom\'s therapeutic factors framework with current research and expands coverage of diversity and cultural competence in group work.',
            },
            {
              title: 'Corey, M. S., Corey, G., & Corey, C. (2018). Groups: Process and Practice (10th ed.)',
              url: 'https://www.cengage.com/c/groups-process-and-practice-10e-corey/',
              type: 'book',
              description: 'A comprehensive and accessible text covering all phases and types of group work, with strong coverage of informed consent, ethical issues, and diversity considerations. Frequently used in counseling training programs.',
            },
            {
              title: 'Burlingame, G. M., McClendon, D. T., & Yang, C. (2018). Cohesion in group therapy: A meta-analysis. Psychotherapy, 55(4), 384–398.',
              url: 'https://doi.org/10.1037/pst0000173',
              type: 'article',
              description: 'A meta-analytic review of 60+ years of cohesion research in group therapy confirming cohesion as the most consistently predictive alliance variable for group outcomes. Essential reading for evidence-based group practice.',
            },
            {
              title: 'American Counseling Association — Group Work Resources',
              url: 'https://www.counseling.org/knowledge-center/mental-health-resources/group-work',
              type: 'website',
              description: 'ACA\'s group work resource hub, including links to the ACA Code of Ethics provisions most relevant to group practice, fact sheets on group therapy ethics, and continuing education resources.',
            },
          ],
        },
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────
  // ASSESSMENT
  // ───────────────────────────────────────────────────────────────
  assessment: {
    title: 'Group Therapy: Design, Facilitation, and Common Pitfalls — Knowledge Assessment',
    instructions: 'Select the best answer for each question. A score of 80% or higher is required to receive CE credit. You may attempt this assessment up to three times.',
    passingScore: 80,
    questions: [
      {
        type: 'multipleChoice',
        question: 'Which of the following most accurately describes the primary mechanism of change in a process/interpersonal group therapy format?',
        options: [
          { text: 'Transmission of psychoeducational content by the facilitator to group members', isCorrect: false },
          { text: 'Structured practice of evidence-based cognitive-behavioral techniques with peer feedback', isCorrect: false },
          { text: 'Here-and-now examination and reworking of interpersonal patterns enacted in the group relational field', isCorrect: true },
          { text: 'Mutual aid and normalization among members sharing a common life experience', isCorrect: false },
        ],
        explanation: 'Process/interpersonal groups use the live relational field of the group as the primary vehicle of change. The here-and-now focus—attending to what members are doing with each other in the room right now—is the defining feature of this format and distinguishes it from psychoeducational, CBT, and support formats.',
      },
      {
        type: 'multipleChoice',
        question: 'Yalom\'s therapeutic factor called "altruism" refers specifically to:',
        options: [
          { text: 'The reduction of shame through the discovery that one\'s experience is shared by others in the group', isCorrect: false },
          { text: 'The therapeutic value of being genuinely helpful to another group member, directly challenging self-worthlessness', isCorrect: true },
          { text: 'The learning that occurs through observation of other group members\' behavior and problem-solving', isCorrect: false },
          { text: 'The cathartic release of strong emotion within a containing group environment', isCorrect: false },
        ],
        explanation: 'Altruism is the therapeutic experience of being genuinely helpful to another person. Many clients who enter therapy carry deep convictions about their own worthlessness or burdensomeness. The group provides structural opportunities to challenge those convictions through the lived experience of offering something of real value to another member.',
      },
      {
        type: 'multipleChoice',
        question: 'A clinician is preparing informed consent for a new therapy group. Which element of informed consent is specifically required by the group format and NOT typically required in individual therapy?',
        options: [
          { text: 'Disclosure of the clinician\'s theoretical orientation and training background', isCorrect: false },
          { text: 'An explicit statement that the clinician cannot guarantee confidentiality because other members are not legally bound', isCorrect: true },
          { text: 'Description of mandatory reporting obligations under state law', isCorrect: false },
          { text: 'Information about the clinician\'s fee schedule and cancellation policy', isCorrect: false },
        ],
        explanation: 'The modified confidentiality standard is a group-specific informed consent requirement. In individual therapy, confidentiality is controlled by the clinician and client. In group, the clinician cannot legally bind other members to confidentiality. This must be disclosed explicitly—not minimized with a vague "what\'s said here stays here."',
      },
      {
        type: 'multipleChoice',
        question: 'Research consistently identifies the optimal size for an outpatient process-oriented therapy group as:',
        options: [
          { text: '3–4 members, to ensure each member receives adequate individual attention', isCorrect: false },
          { text: '5–8 members, to maintain interpersonal variety while ensuring adequate airtime for each member', isCorrect: true },
          { text: '10–15 members, to maximize exposure to diverse perspectives', isCorrect: false },
          { text: 'Size is clinically irrelevant and should be determined by administrative capacity', isCorrect: false },
        ],
        explanation: 'Groups of 5–8 members produce optimal outcomes for process-oriented work (Yalom & Leszcz, 2020). Fewer than 5 members lose the interpersonal variety that makes here-and-now work rich; more than 10 prevents adequate airtime and promotes subgroup formation.',
      },
      {
        type: 'multipleChoice',
        question: 'According to Tuckman\'s model, which stage of group development is characterized by interpersonal conflict, challenges to the leader\'s authority, and member differentiation?',
        options: [
          { text: 'Forming', isCorrect: false },
          { text: 'Norming', isCorrect: false },
          { text: 'Storming', isCorrect: true },
          { text: 'Performing', isCorrect: false },
        ],
        explanation: 'Storming is the stage of conflict, differentiation, and challenges to leadership. It is developmentally necessary—groups that skip storming because the facilitator intervenes too quickly to smooth conflict typically fail to develop the authentic cohesion that makes deep interpersonal work possible.',
      },
      {
        type: 'multipleChoice',
        question: 'A group facilitator notices that over three consecutive sessions, one member\'s contributions have been consistently minimized, challenged, or ignored by the rest of the group. The most clinically accurate interpretation of this pattern is:',
        options: [
          { text: 'The targeted member is providing insufficient self-disclosure and should be coached to contribute more meaningfully', isCorrect: false },
          { text: 'The group is engaging in scapegoating—the unconscious selection of one member to carry the group\'s disowned negative affect', isCorrect: true },
          { text: 'The targeted member should be removed from the group to protect their wellbeing', isCorrect: false },
          { text: 'The group has developed appropriate norms for confronting members whose behavior is disruptive', isCorrect: false },
        ],
        explanation: 'Scapegoating occurs when the group unconsciously selects one member to carry disowned negative affect. The pattern is group-level, not individual—and the intervention must be at the group level, naming what the group is collectively doing rather than defending the targeted member against the group.',
      },
      {
        type: 'multipleChoice',
        question: 'The "1-2 principle" in group composition refers to:',
        options: [
          { text: 'The recommendation that groups have a 1:2 ratio of facilitators to members for optimal safety', isCorrect: false },
          { text: 'The guideline that no more than 1-2 sessions per month should focus on individual member crises', isCorrect: false },
          { text: 'The clinical recommendation that no member should be the sole representative of a significant identity category in the group', isCorrect: true },
          { text: 'The requirement that groups run for a minimum of 1-2 years to achieve therapeutic depth', isCorrect: false },
        ],
        explanation: 'The 1-2 principle is a composition guideline: no member should be the only person of a significant identity category (e.g., the only person of color, the only man, the only person under 30). Isolation within a group intended to reduce isolation is counterproductive and potentially harmful.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following most accurately describes the facilitator\'s optimal response to a monopolizing group member?',
        options: [
          { text: 'Cut the member off directly after they have exceeded a reasonable time limit to protect other members\' access to airtime', isCorrect: false },
          { text: 'Redirect to the group to create space without shaming the monopolizing member, and explore what function the behavior serves clinically', isCorrect: true },
          { text: 'Remove the member from the group if the behavior persists for more than two sessions', isCorrect: false },
          { text: 'Increase psychoeducational content to provide structure that limits the opportunity for monopolization', isCorrect: false },
        ],
        explanation: 'Monopolization is almost always anxiety-driven. The most effective intervention uses the group rather than direct leader confrontation, creates space for other voices, and explores what function the monopolizing behavior serves. Shame-based interventions replicate the attachment dynamics the member is already managing.',
      },
      {
        type: 'multipleChoice',
        question: 'In the context of co-facilitation, which of the following is identified as the minimum practice for maintaining the co-facilitation relationship?',
        options: [
          { text: 'A weekly individual supervision session with a senior clinician', isCorrect: false },
          { text: 'A structured between-session debrief after every group meeting', isCorrect: true },
          { text: 'An annual consultation with the group\'s referring clinicians', isCorrect: false },
          { text: 'A monthly peer consultation with other group facilitators', isCorrect: false },
        ],
        explanation: 'Okech and Kline (2006) identified the between-session debrief as the minimum required practice for maintaining co-facilitation relationship health. Without it, unprocessed tensions between co-facilitators enter the group room and create dynamics members observe and triangulate into.',
      },
      {
        type: 'multipleChoice',
        question: 'The ethical standard for between-session member contact in a therapy group, according to best practice guidelines, is:',
        options: [
          { text: 'Members are prohibited from any contact with each other outside of group sessions', isCorrect: false },
          { text: 'Between-session contact is allowed but should be brought back into the group room for collective awareness', isCorrect: true },
          { text: 'Between-session contact is permitted without any reporting requirement as long as group content is not discussed', isCorrect: false },
          { text: 'The facilitator should be present as a mediator for any between-session member contact', isCorrect: false },
        ],
        explanation: 'The group norm is not prohibition of outside contact but transparency: between-session contact is brought back into the group room. Secret subgroup relationships fracture cohesion and undermine the group\'s therapeutic work.',
      },
      {
        type: 'multipleChoice',
        question: 'Which Yalom therapeutic factor is described as the most consistently predictive variable for group therapy outcome—analogous in importance to the therapeutic alliance in individual therapy?',
        options: [
          { text: 'Instillation of hope', isCorrect: false },
          { text: 'Interpersonal learning', isCorrect: false },
          { text: 'Group cohesion', isCorrect: true },
          { text: 'Universality', isCorrect: false },
        ],
        explanation: 'Burlingame, McClendon, and Yang (2018) reviewed 60+ years of group research and found cohesion to be the most consistently predictive alliance variable for group outcome. Without adequate cohesion, no other therapeutic factor can operate at full potency.',
      },
      {
        type: 'multipleChoice',
        question: 'A pre-contemplative group member—one who is attending group because of external pressure, not intrinsic motivation—is best managed by:',
        options: [
          { text: 'Immediate removal from the group to protect the therapeutic frame for other members', isCorrect: false },
          { text: 'Ignoring the resistance and trusting that group exposure will eventually shift motivation', isCorrect: false },
          { text: 'Incorporating motivational enhancement strategies while assessing whether persistent resistance disrupts the group\'s functioning for other members', isCorrect: true },
          { text: 'Matching the member with an individual therapist and discontinuing group participation permanently', isCorrect: false },
        ],
        explanation: 'Pre-contemplative members present a facilitation challenge but not necessarily a contraindication. The group itself sometimes activates motivation. The clinical assessment is whether the member\'s resistance is disrupting others\' work—if so, a conversation about readiness to participate is warranted.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes the clinical concern specific to pre-existing social relationships between group members?',
        options: [
          { text: 'Members who know each other socially will form subgroups that exclude other members', isCorrect: false },
          { text: 'Pre-existing relationships compromise the confidentiality of every other member\'s disclosures because they create uncontrolled channels for information sharing outside the group frame', isCorrect: true },
          { text: 'Social familiarity increases cohesion prematurely, preventing the group from undergoing necessary storming', isCorrect: false },
          { text: 'Members who know each other will collude to provide overly positive feedback that prevents authentic confrontation', isCorrect: false },
        ],
        explanation: 'The core ethical problem with pre-existing member relationships is confidentiality: two members who are co-workers, neighbors, or friends will encounter each other\'s disclosures in their shared social world. The facilitator cannot enforce confidentiality in that external relationship. This requires screening at the pre-group interview stage.',
      },
      {
        type: 'multipleChoice',
        question: 'Cultural humility in group facilitation, as described by Tervalon and Murray-García (1998), is best understood as:',
        options: [
          { text: 'A skill set acquired through cultural competency training that, once mastered, does not require ongoing development', isCorrect: false },
          { text: 'The practice of treating all group members identically regardless of cultural background to avoid the appearance of favoritism', isCorrect: false },
          { text: 'An ongoing relational stance of self-reflection about the limits of one\'s cultural knowledge, openness to being taught by clients, and active attention to power imbalances', isCorrect: true },
          { text: 'The use of culturally specific therapeutic techniques drawn from the client\'s culture of origin', isCorrect: false },
        ],
        explanation: 'Cultural humility is not a static competency but an ongoing relational stance. In groups, it requires active attention to whether the group\'s norms and implicit expectations are accessible and equitable for all members, or whether some members must translate themselves to participate while others do not.',
      },
      {
        type: 'multipleChoice',
        question: 'When a therapy group member announces their intention to leave the group prematurely, the best practice guideline is:',
        options: [
          { text: 'Accept the member\'s decision immediately and without discussion to preserve autonomy', isCorrect: false },
          { text: 'Refer the member back to individual therapy and discourage any further group participation', isCorrect: false },
          { text: 'Honor a pre-established group norm that members considering leaving bring that consideration to the group before departing, so the decision can be processed collectively', isCorrect: true },
          { text: 'Require the member to attend two additional sessions before being permitted to leave', isCorrect: false },
        ],
        explanation: 'The APA guidelines for group psychotherapy recommend establishing a norm at the outset: members bring consideration of leaving to the group before they leave. This reduces the shock of unannounced departures and allows the leaving—and the feelings it evokes in remaining members—to be processed therapeutically.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following group formats has the most extensive evidence base for the treatment of social anxiety disorder specifically?',
        options: [
          { text: 'Open-ended psychodynamic group using transference interpretation as the primary modality', isCorrect: false },
          { text: 'Cognitive-behavioral group therapy incorporating psychoeducation, cognitive restructuring, and in-session peer exposures', isCorrect: true },
          { text: 'Yalom-model interpersonal process group focused on here-and-now member interactions', isCorrect: false },
          { text: 'Psychoeducational group providing information about the neurobiology of anxiety', isCorrect: false },
        ],
        explanation: 'Heimberg\'s cognitive-behavioral group therapy for social anxiety disorder is the most extensively validated format for this population, combining psychoeducation, cognitive restructuring, and systematic in-session exposures with peer feedback. This format directly targets the avoidance, cognitive distortions, and safety behaviors central to SAD.',
      },
      {
        type: 'multipleChoice',
        question: 'The facilitator\'s role in the adjourning/termination stage of group development primarily involves:',
        options: [
          { text: 'Introducing new members to prevent the loss of momentum as the group ends', isCorrect: false },
          { text: 'Reducing the frequency of sessions to help members gradually adjust to the ending', isCorrect: false },
          { text: 'Explicitly processing the group\'s ending and facilitating direct member-to-member expression of meaning and loss', isCorrect: true },
          { text: 'Transitioning to a psychoeducational format to provide members with tools for post-group maintenance', isCorrect: false },
        ],
        explanation: 'The termination phase activates existential factors—confrontation with loss, impermanence, and the necessity of integrating what was learned without the continued presence of the group. A well-facilitated termination is explicit, allows grief to surface, and provides time for direct member-to-member expressions of what the group has meant.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is the most clinically accurate statement about subgrouping in therapy groups?',
        options: [
          { text: 'All forms of outside member contact constitute harmful subgrouping and should be prohibited in the group agreement', isCorrect: false },
          { text: 'Subgrouping becomes clinically problematic when it creates secret within-group alliances that operate outside the facilitator\'s awareness and fracture group cohesion', isCorrect: true },
          { text: 'Subgrouping is a sign of successful cohesion development and should be encouraged as a marker of genuine group connection', isCorrect: false },
          { text: 'Subgrouping only occurs in open groups and can be prevented by converting to a closed group format', isCorrect: false },
        ],
        explanation: 'Some degree of natural affinity is healthy. Subgrouping becomes clinically problematic when it creates secret alliances outside the group frame that fracture cohesion, produce a two-tiered group structure, or generate in-group collusion that suppresses necessary conflict.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────
  // REFERENCES
  // ───────────────────────────────────────────────────────────────
  references: [
    {
      citation: 'American Counseling Association. (2014). ACA code of ethics. Author.',
      order: 1,
    },
    {
      citation: 'Association for Specialists in Group Work. (2008). ASGW best practice guidelines. Journal for Specialists in Group Work, 33(2), 111–117. https://doi.org/10.1080/01933920801971184',
      order: 2,
    },
    {
      citation: 'Bernard, H. S. (1997). The combined use of individual therapy and group therapy. In H. Bernard & R. R. MacKenzie (Eds.), Basics of group psychotherapy (pp. 167–198). Guilford Press.',
      order: 3,
    },
    {
      citation: 'Bernard, H. S., Burlingame, G., Flores, P., Greene, L., Joyce, A., Kobos, J. C., Leszcz, M., MacNair-Semands, R. R., Piper, W. E., Slocum McEneaney, A. M., & Feirman, D. (2008). Clinical practice guidelines for group psychotherapy. International Journal of Group Psychotherapy, 58(4), 455–542. https://doi.org/10.1521/ijgp.2008.58.4.455',
      order: 4,
    },
    {
      citation: 'Burlingame, G. M., McClendon, D. T., & Yang, C. (2018). Cohesion in group therapy: A meta-analysis. Psychotherapy, 55(4), 384–398. https://doi.org/10.1037/pst0000173',
      order: 5,
    },
    {
      citation: 'Burlingame, G. M., Strauss, B., & Joyce, A. S. (2013). Change mechanisms and effectiveness of small group treatments. In M. J. Lambert (Ed.), Bergin and Garfield\'s handbook of psychotherapy and behavior change (6th ed., pp. 640–689). Wiley.',
      order: 6,
    },
    {
      citation: 'Carroll, K. M. (1998). A cognitive-behavioral approach: Treating cocaine addiction (NIH Publication No. 98-4308). National Institute on Drug Abuse.',
      order: 7,
    },
    {
      citation: 'Corey, G. (2016). Theory and practice of group counseling (9th ed.). Cengage Learning.',
      order: 8,
    },
    {
      citation: 'Corey, M. S., Corey, G., & Corey, C. (2018). Groups: Process and practice (10th ed.). Cengage Learning.',
      order: 9,
    },
    {
      citation: 'Heimberg, R. G. (1991). A manual for conducting cognitive-behavioral group therapy for social phobia (2nd ed.). Unpublished manuscript. State University of New York at Albany.',
      order: 10,
    },
    {
      citation: 'Hook, J. N., Davis, D. E., Owen, J., Worthington, E. L., Jr., & Utsey, S. O. (2013). Cultural humility: Measuring openness to culturally diverse clients. Journal of Counseling Psychology, 60(3), 353–366. https://doi.org/10.1037/a0032595',
      order: 11,
    },
    {
      citation: 'Lewinsohn, P. M., Antonuccio, D. O., Steinmetz, J. L., & Teri, L. (1984). The Coping with Depression Course: A psychoeducational intervention for unipolar depression. Castalia Publishing.',
      order: 12,
    },
    {
      citation: 'Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press.',
      order: 13,
    },
    {
      citation: 'MacKenzie, K. R. (1997). Time-managed group psychotherapy: Effective clinical applications. American Psychiatric Press.',
      order: 14,
    },
    {
      citation: 'Okech, J. E. A., & Kline, W. B. (2006). Competency concerns in group co-leader relationships. Journal for Specialists in Group Work, 31(2), 165–180. https://doi.org/10.1080/01933920500493829',
      order: 15,
    },
    {
      citation: 'Piper, W. E. (1994). Client variables. In A. Fuhriman & G. M. Burlingame (Eds.), Handbook of group psychotherapy: An empirical and clinical synthesis (pp. 83–113). Wiley.',
      order: 16,
    },
    {
      citation: 'Piper, W. E., & Joyce, A. S. (2001). Psychosocial treatment outcome. In W. J. Livesley (Ed.), Handbook of personality disorders: Theory, research, and treatment (pp. 323–343). Guilford Press.',
      order: 17,
    },
    {
      citation: 'Resick, P. A., Monson, C. M., & Chard, K. M. (2008). Cognitive processing therapy: Veteran/military version. Department of Veterans Affairs.',
      order: 18,
    },
    {
      citation: 'Singh, A. A., & Salazar, C. F. (2010). Six considerations for social justice group work. Journal for Specialists in Group Work, 35(3), 308–319. https://doi.org/10.1080/01933922.2010.492908',
      order: 19,
    },
    {
      citation: 'Tervalon, M., & Murray-García, J. (1998). Cultural humility versus cultural competence: A critical distinction in defining physician training outcomes in multicultural education. Journal of Health Care for the Poor and Underserved, 9(2), 117–125. https://doi.org/10.1353/hpu.2010.0233',
      order: 20,
    },
    {
      citation: 'Tuckman, B. W. (1965). Developmental sequence in small groups. Psychological Bulletin, 63(6), 384–399. https://doi.org/10.1037/h0022100',
      order: 21,
    },
    {
      citation: 'Wilfley, D. E., Welch, R. R., Stein, R. I., Spurrell, E. B., Cohen, L. R., Saelens, B. E., Dounchis, J. Z., Frank, M. A., Wiseman, C. V., & Matt, G. E. (2002). A randomized comparison of group cognitive-behavioral therapy and group interpersonal psychotherapy for the treatment of overweight individuals with binge-eating disorder. Archives of General Psychiatry, 59(8), 713–721. https://doi.org/10.1001/archpsych.59.8.713',
      order: 22,
    },
    {
      citation: 'Yalom, I. D., & Leszcz, M. (2020). The theory and practice of group psychotherapy (6th ed.). Basic Books.',
      order: 23,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION & UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function countWords(html) {
  if (!html) return 0;
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

function validate(course) {
  const errors = [];

  // Check resources block exists
  let hasResources = false;
  for (const section of course.sections) {
    for (const block of section.contentBlocks) {
      if (block.type === 'resources') { hasResources = true; break; }
    }
    if (hasResources) break;
  }
  if (!hasResources) errors.push('MISSING: resources block');

  // Check references count
  if (!course.references || course.references.length < 15) {
    errors.push(`INSUFFICIENT REFERENCES: ${course.references?.length ?? 0} (need ≥15)`);
  }

  // Check assessment question count
  const qCount = course.assessment?.questions?.length ?? 0;
  if (qCount < 15) errors.push(`INSUFFICIENT ASSESSMENT QUESTIONS: ${qCount} (need 15-20)`);

  // Count total words across text blocks
  let totalWords = 0;
  for (const section of course.sections) {
    for (const block of section.contentBlocks) {
      if (block.type === 'text') totalWords += countWords(block.content);
      if (block.type === 'callout') totalWords += countWords(block.content);
    }
  }
  console.log(`  Word count (text + callout blocks): ~${totalWords}`);
  if (totalWords < 12000) errors.push(`INSUFFICIENT WORDS: ${totalWords} (need ≥12,000)`);

  // Check required section count
  const contentSections = course.sections.filter(s => s.order > 0);
  if (contentSections.length < 2) errors.push('INSUFFICIENT CONTENT SECTIONS: need ≥2');

  // Check objectives
  if (!course.objectives || course.objectives.length < 5) errors.push('INSUFFICIENT OBJECTIVES');

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== CounselorReady Seed: CR-CLI-607 Group Therapy ===\n');

  // Run validation before any DB work
  console.log('Running pre-seed validation...');
  const errors = validate(COURSE);
  if (errors.length > 0) {
    console.error('\nVALIDATION FAILED:');
    errors.forEach(e => console.error('  ✗', e));
    process.exit(1);
  }
  console.log('  ✓ Validation passed\n');

  if (process.env.DRY_RUN) {
    console.log('DRY_RUN mode — skipping database write.');
    console.log('Course title:', COURSE.title);
    console.log('Sections:', COURSE.sections.length);
    console.log('Assessment questions:', COURSE.assessment.questions.length);
    console.log('References:', COURSE.references.length);
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Dynamically load the model to avoid re-registration errors
  let InteractiveCourse;
  try {
    InteractiveCourse = mongoose.model('InteractiveCourse');
  } catch {
    const { default: model } = await import('../models/InteractiveCourse.js');
    InteractiveCourse = model;
  }

  const existing = await InteractiveCourse.findOne({ slug: SLUG });
  if (existing) {
    console.log(`Found existing course with slug "${SLUG}" — updating...`);
    await InteractiveCourse.findOneAndUpdate({ slug: SLUG }, COURSE, { new: true, runValidators: true });
    console.log('Course updated successfully.');
  } else {
    console.log(`No existing course found — creating new course...`);
    await InteractiveCourse.create(COURSE);
    console.log('Course created successfully.');
  }

  await mongoose.disconnect();
  console.log('\n=== Seed complete ===\n');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
