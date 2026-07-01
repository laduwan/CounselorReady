import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cultural-humility-in-counseling-practice';

const COURSE = {
  title: 'Cultural Humility in Counseling Practice',
  slug: SLUG, courseCode: 'CR-CC-101',
  subtitle: 'Moving Beyond Cultural Competence to Ongoing Self-Reflection and Equity',
  description: 'A 2-hour CE course for licensed mental health professionals introducing the cultural humility framework as a practice orientation that complements and extends cultural competence. Covers self-reflection, power analysis, microaggressions, CFI/SOGIE assessment, and institutional accountability. 12,037 words.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'Cultural', ceCategory: 'Cultural', contentArea: 'Social and Cultural Foundations',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  accessType: 'paid', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  objectives: [
    'Distinguish cultural humility from cultural competence and describe the three core commitments of the Tervalon and Murray-García framework.',
    'Apply intersectionality theory (Crenshaw) to clinical case conceptualization across multiple identity dimensions.',
    'Recognize and respond constructively to therapeutic ruptures caused by microaggressions and cultural misattunement.',
    'Implement the Cultural Formulation Interview (CFI) and SOGIE assessment as affirming clinical tools.',
    'Analyze power dynamics within the therapeutic relationship and apply strategies to reduce hierarchical barriers.',
    'Identify institutional accountability commitments that extend cultural humility beyond the individual clinical encounter.',
  ],
  targetAudience: ['Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, NCCs, and psychiatric NPs seeking to deepen culturally responsive clinical practice.'],

  sections: [
    {
      title: 'From Cultural Competence to Cultural Humility',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '1', title: 'From Cultural Competence to Cultural Humility', subtitle: 'The Tervalon & Murray-García framework and what changes when we shift our orientation', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Why Cultural Competence Is Not Enough</h2>
<p>Cultural competence — the acquisition of knowledge, skills, and attitudes enabling effective practice across cultural groups — has been the dominant framework in mental health training for three decades. Its limitations, however, are increasingly documented: the competence framework implies mastery is achievable; that once you learn about a group, you know how to work with its members; and that cultural knowledge is primarily a cognitive acquisition task rather than a relational and ethical orientation.</p>
<p>Cultural humility, introduced by Tervalon and Murray-García (1998), proposes three core commitments that reframe culturally responsive practice as an ongoing process rather than an endpoint: (1) <strong>lifelong learning and critical self-reflection</strong> — the recognition that the work of cultural responsiveness is never complete; (2) <strong>recognition and redress of power imbalances</strong> — an explicit analysis of how power dynamics between clinician and client affect the therapeutic relationship; and (3) <strong>institutional accountability</strong> — commitment to advocacy and organizational change beyond the individual clinical encounter.</p>
<p>This shift matters clinically: a clinician operating from a cultural competence framework who has "completed" diversity training may be more resistant to recognizing their own cultural blind spots than a clinician operating from a cultural humility framework who actively expects to have blind spots and seeks to discover them. Under {{callout:aca-code}} Standard C.2 (professional competence), cultural responsiveness is an ongoing obligation — not a training checkbox.</p>`,
          callouts: { 'aca-code': { label: 'ACA Code C.2', body: 'ACA Code C.2 requires counselors to continually monitor their effectiveness and take steps to improve their practice. Cultural responsiveness is an ongoing competence obligation, not a training milestone.', type: 'ethics' } },
        },
        {
          type: 'callout', order: 3, calloutType: 'key', title: 'The Three Commitments of Cultural Humility',
          content: '<ol><li><strong>Lifelong self-evaluation and self-critique</strong> — Actively examine how your own cultural background, biases, and privilege shape your clinical perceptions, interpretations, and responses</li><li><strong>Recognition and redress of power imbalances</strong> — Explicitly analyze and address the power differential between clinician and client, including systemic power differences connected to race, class, gender, and other identity dimensions</li><li><strong>Institutional accountability</strong> — Advocate for organizational and systemic changes that address structural inequity beyond the individual clinical relationship</li></ol>',
        },
        {
          type: 'accordion', order: 4, title: 'Cultural Humility vs. Cultural Competence: Key Distinctions',
          accordionItems: [
            { title: 'Process vs. endpoint', content: '<p>Cultural competence implies expertise is achievable — once trained, you are competent. Cultural humility treats cultural responsiveness as a lifelong developmental process with no final destination. The clinician who claims full competence is, paradoxically, demonstrating cultural incompetence by claiming mastery over domains that require perpetual re-examination.</p>' },
            { title: 'Self-knowledge emphasis', content: '<p>Cultural competence focuses primarily on learning about clients\' cultures. Cultural humility emphasizes the clinician\'s obligation to examine their own cultural assumptions, biases, and privilege as the first and ongoing work. The clinician\'s cultural identity is always in the room; the question is whether it is examined or unexamined.</p>' },
            { title: 'Power analysis', content: '<p>Cultural competence frameworks largely bracket power analysis. Cultural humility explicitly engages power: who has authority in the therapeutic relationship? Whose cultural framework is treated as the norm? How do systemic power differences (racial, economic, gender) show up in the room? These are clinical questions, not political ones.</p>' },
            { title: 'Institutional dimension', content: '<p>Cultural competence is primarily individual. Cultural humility includes institutional accountability: advocacy within organizations to address structural inequity, participation in policy change, and recognition that individual clinical relationships occur within systems that either support or undermine equity.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 5,
          question: 'According to Tervalon and Murray-García (1998), cultural humility differs from cultural competence primarily in:',
          options: [
            { text: 'Requiring greater cultural knowledge acquisition before clinical practice', isCorrect: false },
            { text: 'Framing culturally responsive practice as a lifelong process of self-examination and power analysis rather than an achievable endpoint', isCorrect: true },
            { text: 'Applying exclusively to clinicians from majority cultural backgrounds', isCorrect: false },
            { text: 'Replacing the need for specific cultural knowledge about client populations', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Tervalon and Murray-García\'s central reframe is from competence-as-mastery to humility-as-orientation: the work is ongoing, self-directed, and power-conscious rather than a knowledge-acquisition task that can be completed.',
        },
        {
          type: 'multiSelect', order: 6,
          question: 'The three core commitments of cultural humility include which of the following? (Select all that apply)',
          options: [
            { text: 'Lifelong self-evaluation and critical self-reflection', isCorrect: true },
            { text: 'Achieving mastery in at least five cultural groups before practicing', isCorrect: false },
            { text: 'Recognition and redress of power imbalances in the therapeutic relationship', isCorrect: true },
            { text: 'Institutional accountability and advocacy for systemic equity', isCorrect: true },
          ],
          explanation: 'Tervalon and Murray-García\'s three commitments are: (1) lifelong self-evaluation, (2) recognition and redress of power imbalances, and (3) institutional accountability. Cultural humility explicitly rejects the notion of achievable mastery.',
        },
        { type: 'reflection', order: 7, question: 'Identify one specific assumption you hold about a cultural group you commonly work with that you have never explicitly examined. Where did that assumption come from? How might it influence your clinical interpretations and responses? What would examining it require?' },
      ],
    },
    {
      title: 'Intersectionality, Power, and Clinical Formulation',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '2', title: 'Intersectionality, Power, and Clinical Formulation', subtitle: 'Crenshaw\'s intersectionality framework in clinical case conceptualization', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Intersectionality as a Clinical Lens</h2>
<p>Crenshaw's intersectionality framework (1989, 1991) holds that multiple social identities — race, gender, class, sexuality, disability, religion, and others — intersect to produce experiences of privilege and oppression that cannot be understood by examining any single identity dimension in isolation. A Black woman does not experience racism as a Black person and sexism as a woman — she experiences the intersection as a distinct social location with specific consequences that neither framework alone can capture.</p>
<p>In clinical practice, intersectionality requires formulations that consider how multiple identity dimensions simultaneously shape the client's presenting concerns, their relationship to mental health treatment, and the specific forms of stress and resilience they carry. The clinician who conceptualizes depression in a Latina immigrant woman through a generic depression framework, without attending to the intersecting effects of racial minority stress, immigrant acculturation stress, gender role expectations in her specific cultural context, and socioeconomic stressors, is producing an incomplete formulation with limited treatment implications.</p>
<p>Applying an intersectional lens does not require asking clients to self-diagnose their own oppression or to educate their clinician. It requires that the clinician bring their own analysis of how social structures produce differential stress exposure and differential access to resilience resources, and that they build this into clinical conceptualization as a standard dimension rather than an optional cultural supplement.</p>`,
        },
        {
          type: 'callout', order: 3, calloutType: 'ethics', title: 'Power in the Therapeutic Relationship',
          content: '<p>The therapeutic relationship is never power-neutral. The clinician holds diagnostic authority, treatment framing power, and the cultural capital that professional credentialing represents. When the clinician and client hold different social positions — race, class, gender, disability status — systemic power differences enter the room alongside the individual relationship. Cultural humility requires explicit awareness of these dimensions, not their pretense to nonexistence. Pretending the therapeutic relationship is an equal partnership between two parties without social positions is itself a form of power exercise that centers the clinician\'s comfort over the client\'s reality.</p>',
        },
        {
          type: 'flashcardDeck', order: 4,
          instructions: 'Review key intersectionality and power concepts for clinical application:',
          flashcards: [
            { id: 'f1', front: 'Intersectionality (Crenshaw)', back: 'Multiple social identities (race, gender, class, sexuality, disability) intersect to produce distinct experiences of privilege and oppression that cannot be understood by examining any single dimension. Clinical formulation must account for these intersections, not treat identity categories as additive and separate.' },
            { id: 'f2', front: 'Minority stress (Meyer, 2003)', back: 'Excess stress exposure produced by stigmatization and discrimination associated with minority status. Operates at distal (external events) and proximal (internalized stigma, concealment demands) levels. Accumulates across identity dimensions — a queer person of color carries minority stress from both dimensions simultaneously.' },
            { id: 'f3', front: 'White clinician self-examination', back: 'White clinicians bear a specific obligation to examine how white racial identity and white privilege shape their clinical assumptions, interpretations, and blind spots. Color-blindness ("I don\'t see race") is not culturally humble — it makes the clinician\'s whiteness invisible while leaving its effects operational.' },
            { id: 'f4', front: 'Cultural countertransference', back: 'Emotional and cognitive responses to clients that are shaped by the clinician\'s own cultural identities, biases, and unexamined assumptions. Cultural countertransference is not a sign of failure — it is inevitable and clinically workable when examined in supervision. It becomes harmful when it is unacknowledged and drives clinical decisions.' },
            { id: 'f5', front: 'Solidarity vs. saviorism', back: 'Saviorism positions the clinician as rescuer of culturally marginalized clients — centering the clinician\'s benevolence rather than the client\'s agency. Solidarity positions the clinician as an ally in the client\'s own determined path. Cultural humility requires solidarity orientation, not saviorism.' },
          ],
        },
        {
          type: 'multipleChoice', order: 5,
          question: 'Crenshaw\'s intersectionality framework is clinically relevant because:',
          options: [
            { text: 'It establishes a hierarchy of oppression determining which identity dimensions matter most', isCorrect: false },
            { text: 'Multiple identity dimensions intersect to produce distinct clinical presentations that single-axis frameworks cannot adequately describe or treat', isCorrect: true },
            { text: 'It applies exclusively to Black women and does not extend to other intersecting identities', isCorrect: false },
            { text: 'It replaces the need for individual case formulation with group-based cultural knowledge', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Intersectionality is clinically essential because the intersection of multiple identities produces distinct experiences — not additive combinations. A clinician who understands racial minority stress and gender stress separately may still fail to understand their specific intersection in an individual client\'s life.',
        },
        {
          type: 'matching', order: 6,
          matchingInstructions: 'Match each concept to its correct clinical implication:',
          matchingPairs: [
            { term: 'Cultural countertransference', definition: 'Clinician\'s culturally-shaped emotional responses to clients — inevitable, workable in supervision, harmful when unexamined' },
            { term: 'Minority stress (Meyer)', definition: 'Excess stress produced by stigma and discrimination — accumulates across identity dimensions and is a primary driver of health disparities' },
            { term: 'Power-neutral therapeutic frame', definition: 'A fiction that privileges clinician comfort over client reality — cultural humility rejects it' },
            { term: 'Intersectionality (Crenshaw)', definition: 'Multiple identities intersect to produce distinct experiences requiring multi-dimensional clinical formulation' },
          ],
        },
        { type: 'reflection', order: 7, question: 'Identify a current client whose presenting concerns you have formulated primarily through a single identity dimension (e.g., diagnosis, race, or gender alone). What other identity intersections — class, sexuality, immigration status, disability, religion — might be shaping their presentation in ways your current formulation doesn\'t capture? How would attending to intersectionality change your treatment approach?' },
      ],
    },
    {
      title: 'Microaggressions, Therapeutic Ruptures, and the CFI',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '3', title: 'Microaggressions, Therapeutic Ruptures, and the CFI', subtitle: 'Recognizing and repairing microaggressive ruptures; the Cultural Formulation Interview', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Microaggressions in Clinical Practice</h2>
<p>Microaggressions — the brief, everyday exchanges that communicate negative messages to members of marginalized groups, often outside the conscious awareness of the perpetrator (Sue et al., 2007) — occur in clinical settings with documented frequency and produce measurable effects on therapeutic alliance, treatment engagement, and outcomes for clients from marginalized groups. The concept of microaggression does not imply malicious intent — microaggressions are, by definition, often produced by well-meaning clinicians operating from unexamined cultural assumptions.</p>
<p>Three forms are clinically relevant: <strong>microinsults</strong> (communications that convey rudeness or insensitivity about a person's cultural identity — "You speak so well for someone from that area"); <strong>microinvalidations</strong> (communications that exclude, negate, or nullify the psychological thoughts, feelings, or experiential reality of marginalized groups — "I don't see you as Black/gay/disabled"); and <strong>microassaults</strong> (more conscious, deliberate, discriminatory acts that communicate hostility toward a group).</p>
<p>{{callout:nbcc-standard}} requires that counselors maintain cultural responsiveness. When microaggressions occur in clinical sessions — whether from clinician to client or in reported client interactions — they provide clinical material requiring attention. Ignoring a client's report of racial microaggression because it is uncomfortable territory for the clinician is itself a clinical failure.</p>`,
          callouts: { 'nbcc-standard': { label: 'NBCC Standard', body: 'NBCC ethical standards require culturally competent counseling practice. ACA Code C.5 explicitly prohibits discrimination and requires culturally responsive practice across all client populations.', type: 'ethics' } },
        },
        {
          type: 'callout', order: 3, calloutType: 'clinical', title: 'Repairing Microaggressive Ruptures',
          content: `<p>When a clinician recognizes they have committed a microaggression — or when a client names one — the repair process requires four steps:</p>
<ol>
<li><strong>Acknowledge</strong> — Name what happened without defensiveness: "I realize what I said was insensitive to your experience."</li>
<li><strong>Apologize</strong> — Offer genuine apology without centering your own discomfort: "I'm sorry for that."</li>
<li><strong>Understand</strong> — Invite the client to explain the impact: "I'd like to understand how that landed for you if you're willing to share."</li>
<li><strong>Repair</strong> — Use the rupture as clinical material about the cultural dynamics in the relationship and in the client's world.</li>
</ol>
<p>The rupture-repair sequence is not a failure — it is clinical material that, when handled well, deepens the therapeutic alliance and models the kind of accountability that cultural humility requires.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>The Cultural Formulation Interview (CFI)</h2>
<p>The DSM-5 Cultural Formulation Interview (CFI) provides a structured, 16-item interview framework for systematically gathering cultural information relevant to clinical understanding and treatment planning. The CFI covers four domains: (1) the client's cultural definition of the problem; (2) cultural perceptions of cause, context, and support; (3) cultural factors affecting self-coping and past help-seeking; and (4) cultural elements of the clinician-client relationship including cultural dimensions of power, communication, and treatment expectations.</p>
<p>The CFI is not a cultural checklist — it is an invitation to collaborative exploration of how culture shapes the client's experience of their presenting concerns. Used well, the CFI positions the client as the expert on their own cultural experience rather than the clinician as the cultural authority who categorizes the client based on group membership.</p>
<p>SOGIE assessment — asking about Sexual Orientation, Gender Identity, and Expression as routine intake demographics — functions as a specific cultural formulation tool for LGBTQ+ clients that reduces the heteronormative assumption of default heterosexuality and cisgender identity. Routine SOGIE collection normalizes LGBTQ+ identity disclosure rather than treating it as an exceptional or special topic requiring justification.</p>`,
        },
        {
          type: 'cardSort', order: 5,
          instructions: 'Sort each clinician statement as demonstrating "Cultural Humility" or "Cultural Impasse (needs repair)":',
          categories: ['Cultural Humility', 'Cultural Impasse (needs repair)'],
          cards: [
            { id: 'cs1', text: '"Help me understand what this problem means in your family and community — you\'re the expert on your own experience."', correctCategory: 'Cultural Humility' },
            { id: 'cs2', text: '"I don\'t see you as having a race — to me you\'re just a person."', correctCategory: 'Cultural Impasse (needs repair)' },
            { id: 'cs3', text: '"I notice I made an assumption just then that may not fit your experience — can you help me understand?"', correctCategory: 'Cultural Humility' },
            { id: 'cs4', text: '"All my clients are treated the same — I don\'t adjust my approach based on culture."', correctCategory: 'Cultural Impasse (needs repair)' },
            { id: 'cs5', text: '"I want to make sure I\'m understanding the context your experience happens in — would you tell me more about your community?"', correctCategory: 'Cultural Humility' },
            { id: 'cs6', text: '"You\'re doing so well for someone from that background."', correctCategory: 'Cultural Impasse (needs repair)' },
          ],
        },
        {
          type: 'multipleChoice', order: 6,
          question: 'Microinvalidations are clinically harmful primarily because:',
          options: [
            { text: 'They constitute deliberate discriminatory acts meeting the threshold for ethics complaints', isCorrect: false },
            { text: 'They negate or nullify clients\' cultural realities in ways that damage alliance and reinforce the experience of not being truly seen by helpers', isCorrect: true },
            { text: 'They exclusively affect clients of racial minority backgrounds and do not impact other marginalized groups', isCorrect: false },
            { text: 'They are always consciously intended and therefore reflect deliberate bias', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Microinvalidations — "I don\'t see you as Black," "You\'re being overly sensitive about that" — negate clients\' experiential realities in ways that compound the very invalidation that brings many marginalized clients to treatment. They damage therapeutic alliance even when (especially when) well-intentioned.',
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'The Cultural Formulation Interview (CFI) positions the client as:',
          options: [
            { text: 'A representative of their cultural group whose responses generalize to others from the same background', isCorrect: false },
            { text: 'The expert on their own cultural experience, while the clinician assumes a learner stance', isCorrect: true },
            { text: 'A subject of cultural assessment whose responses confirm or disconfirm the clinician\'s cultural knowledge', isCorrect: false },
            { text: 'A passive recipient of culturally adapted treatment protocols developed by the clinician', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The CFI\'s core stance is that the client is the expert on their own cultural experience. The clinician uses the CFI to learn how culture shapes this specific person\'s experience — not to apply pre-formed cultural knowledge about their group membership.',
        },
        { type: 'reflection', order: 8, question: 'Recall a clinical moment when you realized in retrospect that you had communicated a microaggression, an assumption, or a cultural blind spot to a client. What happened? How did you respond in the moment? How would you handle it differently now using the four-step rupture repair process?' },
      ],
    },
    {
      title: 'Institutional Accountability and Ongoing Practice Development',
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '4', title: 'Institutional Accountability and Ongoing Practice Development', subtitle: 'Extending cultural humility from the clinical relationship to the organization and profession', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Beyond the Individual Encounter</h2>
<p>The third commitment of cultural humility — institutional accountability — recognizes that individual clinical relationships occur within organizations, systems, and structures that either support or undermine equitable care. A culturally humble individual clinician practicing within an organization whose intake processes, documentation systems, staffing, and referral networks systematically disadvantage clients from marginalized groups is swimming against a structural current. Individual excellence is necessary but insufficient.</p>
<p>Institutional accountability in clinical practice includes: advocating for inclusive intake forms that do not assume heterosexuality or binary gender; pushing for SOGIE data collection in electronic health records; examining whether the workforce reflects the diversity of the populations served; questioning referral patterns that systematically direct clients of color to less experienced clinicians; and participating in organizational diversity, equity, and inclusion efforts with genuine professional commitment rather than compliance theater.</p>
<p>Professional advocacy beyond the organization — participating in ACA diversity-related policy work, advocating for equitable insurance reimbursement that does not effectively exclude clients with lower incomes, and supporting legislative initiatives that improve access to mental health care for marginalized populations — extends institutional accountability to the systemic level at which the deepest determinants of mental health disparities operate.</p>`,
        },
        {
          type: 'callout', order: 3, calloutType: 'tip', title: 'Practical Institutional Accountability Actions',
          content: `<ul>
<li>Audit your organization\'s intake forms: Do they include nonbinary gender options? Do they ask about preferred pronouns?</li>
<li>Examine who is assigned to which clients in your setting: Are clients of color systematically assigned to less experienced or less well-compensated clinicians?</li>
<li>Assess whether your organization\'s visual environment communicates welcome to diverse populations</li>
<li>Advocate for race, ethnicity, and SOGIE data collection as standard demographics in EHR systems</li>
<li>Participate in staff training on cultural humility rather than treating it as an individual learning task</li>
<li>Review your referral network for diversity of provider representation</li>
</ul>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Sustaining the Practice: Supervision, Consultation, and Self-Care</h2>
<p>Cultural humility work generates specific forms of professional stress that require deliberate support structures. White clinicians and clinicians from majority group backgrounds engaging genuine power analysis and bias examination may experience shame, guilt, or defensiveness that supervision must address. Clinicians from marginalized backgrounds may experience specific forms of emotional labor in navigating predominantly white institutional structures while holding the cultural awareness that the structure may deny. Both dynamics require clinical supervision attention, not tolerance.</p>
<p>Cultural consultation — seeking guidance from colleagues with specific cultural expertise, community members, or cultural liaison programs — is a professional practice that cultural humility requires. No training program produces expertise in every cultural group a clinician will serve. Seeking consultation is not a sign of incompetence; refusing it is. The clinician who has completed this course and who encounters a client from a cultural background significantly different from their own should be more likely to seek consultation, not less — because cultural humility explicitly predicts the existence of blind spots that require external perspective to identify.</p>`,
        },
        {
          type: 'keyTakeaway', order: 5,
          title: 'Module 4 Key Takeaways',
          takeaways: [
            'Individual cultural humility is necessary but insufficient — institutional accountability is the third commitment of the framework.',
            'Intake processes, EHR systems, staffing patterns, and referral networks can systematically disadvantage clients from marginalized groups regardless of individual clinician commitment.',
            'Cultural consultation — seeking guidance from culturally knowledgeable colleagues or community members — is a professional obligation, not a sign of incompetence.',
            'Supervision specifically addressing cultural countertransference and cultural blind spots is essential for sustaining culturally humble practice.',
            'Professional advocacy extending to policy and systemic equity is part of the institutional accountability commitment.',
          ],
        },
        {
          type: 'multipleChoice', order: 6,
          question: 'Institutional accountability in cultural humility requires clinicians to:',
          options: [
            { text: 'Achieve personal cultural competence before engaging in organizational advocacy', isCorrect: false },
            { text: 'Advocate for organizational changes — inclusive intake, EHR standards, equitable staffing — that extend cultural responsiveness beyond the individual clinical encounter', isCorrect: true },
            { text: 'Limit cultural responsiveness work to the individual therapeutic relationship', isCorrect: false },
            { text: 'Defer institutional advocacy to organizational leadership and focus exclusively on clinical skill development', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Institutional accountability is the third core commitment of cultural humility — it explicitly extends the work beyond individual clinical skill to organizational and systemic advocacy. Individual excellence within inequitable systems is insufficient.',
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'Seeking cultural consultation when working with a client from an unfamiliar cultural background reflects:',
          options: [
            { text: 'Professional incompetence that should be addressed through additional training before accepting such clients', isCorrect: false },
            { text: 'Cultural humility — the recognition that blind spots exist and external perspective is necessary to identify them', isCorrect: true },
            { text: 'Appropriate scope of practice limits that require client transfer to a culturally matched provider', isCorrect: false },
            { text: 'An optional professional development activity unrelated to ethical obligations', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Cultural humility explicitly predicts blind spots and endorses seeking consultation to identify them. Consultation-seeking is a professional obligation of cultural humility, not a sign of incompetence. Refusing to seek consultation is a far greater concern.',
        },
        { type: 'reflection', order: 8, question: 'Identify one specific institutional accountability action you could take in your current work setting in the next 30 days. What specific change would you advocate for, what barriers might you encounter, and who could be your allies in this advocacy?' },
      ],
    },
    {
      title: 'Course Summary and Practice Commitments',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '5', title: 'Course Summary and Practice Commitments', subtitle: 'Review frameworks and identify three personal cultural humility commitments', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Cultural Humility as Professional Orientation</h2>
<p>Cultural humility is not a training outcome — it is a professional orientation that requires ongoing practice, reflection, supervision, and advocacy. The three commitments introduced by Tervalon and Murray-García (1998) provide the architecture: lifelong self-examination, power analysis, and institutional accountability. The frameworks introduced in this course — intersectionality, microaggressions and repair, the CFI, SOGIE assessment — provide specific clinical tools for operationalizing this orientation in practice.</p>
<p>The clinician who leaves this course with increased knowledge is beginning the work. The clinician who leaves with specific behavioral commitments — to examine a specific bias in supervision, to advocate for a specific organizational change, to seek consultation on a specific case, to implement the CFI with the next appropriate client — is doing the work. Cultural humility is measured in actions, not in knowledge acquisition.</p>
<h3>Three Commitments for Continued Practice</h3>
<ol>
<li>Schedule a supervisory conversation specifically focused on cultural countertransference in one active case within the next 30 days</li>
<li>Implement the CFI or SOGIE assessment routinely with all new clients beginning with your next intake</li>
<li>Identify one institutional accountability action — an intake form change, an EHR advocacy, a referral network diversity audit — and take a concrete first step within 60 days</li>
</ol>`,
        },
        {
          type: 'accordion', order: 3, title: 'Module Highlights',
          accordionItems: [
            { title: 'Module 1: Framework', content: '<p>Cultural humility reframes cultural responsiveness from competence-as-endpoint to humility-as-ongoing-orientation. Three commitments: lifelong self-evaluation, power analysis, institutional accountability. The clinician who claims cultural competence may be more resistant to growth than the clinician who assumes ongoing blind spots.</p>' },
            { title: 'Module 2: Intersectionality & Power', content: '<p>Crenshaw\'s intersectionality requires multi-dimensional formulation — no single identity dimension can fully account for presenting concerns. Power analysis in the therapeutic relationship is a clinical skill, not a political add-on. Cultural countertransference is inevitable and clinically workable.</p>' },
            { title: 'Module 3: Microaggressions & CFI', content: '<p>Microaggressions occur in clinical settings with well-meaning clinicians. The four-step rupture repair sequence transforms these moments into alliance-deepening clinical material. The CFI positions clients as experts on their own cultural experience. SOGIE assessment is a specific cultural formulation tool for LGBTQ+ clients.</p>' },
            { title: 'Module 4: Institutional Accountability', content: '<p>Individual excellence is insufficient within inequitable systems. Institutional accountability requires organizational advocacy beyond clinical skill development. Cultural consultation is a professional obligation. Supervision specifically addressing cultural dimensions is essential infrastructure for sustained culturally humble practice.</p>' },
          ],
        },
        {
          type: 'text', order: 4,
          content: `<div class="cr-references">
<h2>References</h2>
<p class="cr-reference">Crenshaw, K. (1989). Demarginalizing the intersection of race and sex. <em>University of Chicago Legal Forum, 139</em>, 139–167.</p>
<p class="cr-reference">Crenshaw, K. (1991). Mapping the margins: Intersectionality, identity politics, and violence against women of color. <em>Stanford Law Review, 43</em>(6), 1241–1299.</p>
<p class="cr-reference">Hook, J. N., Davis, D. E., Owen, J., Worthington, E. L., Jr., &amp; Utsey, S. O. (2013). Cultural humility: Measuring openness to culturally diverse clients. <em>Journal of Counseling Psychology, 60</em>(3), 353–366.</p>
<p class="cr-reference">Meyer, I. H. (2003). Prejudice, social stress, and mental health in lesbian, gay, and bisexual populations. <em>Psychological Bulletin, 129</em>(5), 674–697.</p>
<p class="cr-reference">National Alliance on Mental Illness. (2017). <em>Cultural competency: Mental health resources for minorities</em>. NAMI.</p>
<p class="cr-reference">Sue, D. W., Capodilupo, C. M., Torino, G. C., Bucceri, J. M., Holder, A. M. B., Nadal, K. L., &amp; Esquilin, M. (2007). Racial microaggressions in everyday life. <em>American Psychologist, 62</em>(4), 271–286.</p>
<p class="cr-reference">Tervalon, M., &amp; Murray-García, J. (1998). Cultural humility versus cultural competence. <em>Journal of Health Care for the Poor and Underserved, 9</em>(2), 117–125.</p>
<p class="cr-reference">American Psychological Association. (2017). <em>Multicultural guidelines: An ecological approach to context, identity, and intersectionality</em>. APA.</p>
<p class="cr-reference">Helms, J. E. (1990). <em>Black and white racial identity: Theory, research, and practice</em>. Greenwood Press.</p>
<p class="cr-reference">Ratts, M. J., Singh, A. A., Nassar-McMillan, S., Butler, S. K., &amp; McCullough, J. R. (2016). Multicultural and social justice counseling competencies. <em>Journal of Multicultural Counseling and Development, 44</em>(1), 28–48.</p>
<p class="cr-reference">American Psychiatric Association. (2022). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed., text rev.). APA.</p>
<p class="cr-reference">Owen, J., Tao, K. W., Imel, Z. E., Wampold, B. E., &amp; Rodolfa, E. (2014). Addressing racial and ethnic microaggressions in therapy. <em>Professional Psychology: Research and Practice, 45</em>(4), 283–290.</p>
<p class="cr-reference">Shelton, K., &amp; Delgado-Romero, E. A. (2011). Sexual orientation microaggressions: The experience of lesbian, gay, bisexual, and queer clients in psychotherapy. <em>Journal of Counseling Psychology, 58</em>(2), 210–221.</p>
</div>`,
        },
        { type: 'reflection', order: 5, question: 'Write your three specific cultural humility commitments for the next 60 days. Make each commitment behavioral and measurable: What exactly will you do? By when? How will you know you have done it? Share this commitment with a supervisor or colleague for accountability.' },
      ],
    },
  ],

  assessment: {
    passingScore: 80, passThreshold: 0.8, maxAttempts: 3,
    questions: [
      { question: 'Tervalon and Murray-García\'s cultural humility framework reframes culturally responsive practice by:', options: [{ text: 'Requiring mastery of five or more cultural groups before independent practice', isCorrect: false }, { text: 'Treating it as a lifelong process of self-examination and power analysis rather than an achievable endpoint', isCorrect: true }, { text: 'Replacing cultural knowledge acquisition with client-directed therapy', isCorrect: false }, { text: 'Applying exclusively to clinicians from majority cultural backgrounds', isCorrect: false }], correctAnswer: 1, explanation: 'The core reframe of cultural humility is from competence-as-endpoint to humility-as-ongoing-orientation: the work never ends, is self-directed toward examining one\'s own assumptions, and explicitly includes power analysis.' },
      { question: 'The three commitments of cultural humility include:', options: [{ text: 'Lifelong self-evaluation, recognition and redress of power imbalances, and institutional accountability', isCorrect: true }, { text: 'Cultural knowledge acquisition, skill development, and attitude formation', isCorrect: false }, { text: 'Race awareness, gender sensitivity, and socioeconomic awareness', isCorrect: false }, { text: 'Client matching, cultural assessment, and treatment adaptation', isCorrect: false }], correctAnswer: 0, explanation: 'Tervalon and Murray-García\'s three commitments: (1) lifelong self-evaluation, (2) recognition and redress of power imbalances, and (3) institutional accountability. This framework is fundamentally different from the knowledge-skill-attitude model of cultural competence.' },
      { question: 'Crenshaw\'s intersectionality framework is clinically necessary because:', options: [{ text: 'It establishes which identity dimensions are most important in clinical formulation', isCorrect: false }, { text: 'Multiple identity dimensions intersect to produce distinct experiences that single-axis frameworks cannot adequately describe', isCorrect: true }, { text: 'It applies exclusively to women of color and does not generalize to other populations', isCorrect: false }, { text: 'It replaces individual case formulation with group-based cultural templates', isCorrect: false }], correctAnswer: 1, explanation: 'Intersectionality is clinically essential because the intersection of race, gender, class, sexuality and other identities produces distinct experiences — not additive combinations. A clinician who understands individual axes separately may still miss their specific intersection in a client\'s life.' },
      { question: 'Microinvalidations are clinically harmful primarily because:', options: [{ text: 'They constitute intentional discrimination that violates ACA ethical standards', isCorrect: false }, { text: 'They negate or nullify clients\' experiential realities in ways that damage alliance and reinforce the experience of not being genuinely seen', isCorrect: true }, { text: 'They exclusively affect clients from racial minority backgrounds', isCorrect: false }, { text: 'They are always consciously produced and reflect deliberate bias', isCorrect: false }], correctAnswer: 1, explanation: 'Microinvalidations — "I don\'t see you as Black," "You\'re being overly sensitive" — negate clients\' realities in ways that compound the very invalidation that brings many marginalized clients to treatment, even when (especially when) well-intentioned.' },
      { question: 'The four steps of microaggressive rupture repair are:', options: [{ text: 'Minimize, explain, redirect, document', isCorrect: false }, { text: 'Acknowledge, apologize, understand the impact, use as clinical material', isCorrect: true }, { text: 'Report to supervisor, refer to specialist, document, follow up', isCorrect: false }, { text: 'Deny intent, explain context, offer alternative interpretation, move forward', isCorrect: false }], correctAnswer: 1, explanation: 'The four-step repair: (1) Acknowledge what happened without defensiveness, (2) Apologize genuinely, (3) Invite the client to explain the impact, (4) Use the rupture as clinical material. Well-handled ruptures can deepen alliance rather than damage it permanently.' },
      { question: 'The Cultural Formulation Interview (CFI) positions the client as:', options: [{ text: 'A representative of their cultural group whose responses generalize to others', isCorrect: false }, { text: 'The expert on their own cultural experience, with the clinician adopting a learner stance', isCorrect: true }, { text: 'A subject of cultural assessment confirming or disconfirming the clinician\'s cultural knowledge', isCorrect: false }, { text: 'A passive recipient of culturally adapted treatment protocols', isCorrect: false }], correctAnswer: 1, explanation: 'The CFI\'s core stance is that the client is the expert on their own cultural experience. The clinician learns about this specific person\'s cultural context — not applies pre-formed group knowledge.' },
      { question: 'SOGIE assessment as a routine intake practice is an application of cultural humility because:', options: [{ text: 'It reserves LGBTQ+-affirming questions for clients who appear visibly LGBTQ+', isCorrect: false }, { text: 'It normalizes LGBTQ+ identity disclosure by treating it as expected rather than exceptional demographic information', isCorrect: true }, { text: 'It applies exclusively to mental health settings specializing in LGBTQ+ populations', isCorrect: false }, { text: 'It replaces all other cultural formulation tools when working with LGBTQ+ clients', isCorrect: false }], correctAnswer: 1, explanation: 'Routine SOGIE assessment with all clients normalizes LGBTQ+ identity disclosure, communicates that these identities are expected and welcome, and provides population-level data for equitable care planning — all consistent with cultural humility principles.' },
      { question: 'Power analysis in the therapeutic relationship requires clinicians to:', options: [{ text: 'Pretend the therapeutic relationship is a partnership of equals to reduce client anxiety', isCorrect: false }, { text: 'Acknowledge and examine how diagnostic authority, cultural capital, and systemic power differences shape the therapeutic encounter', isCorrect: true }, { text: 'Transfer all power to clients by eliminating clinical decision-making', isCorrect: false }, { text: 'Address power only when clients directly raise it as a concern', isCorrect: false }], correctAnswer: 1, explanation: 'Pretending the therapeutic relationship is power-neutral is itself an exercise of power that centers clinician comfort over client reality. Cultural humility requires explicit acknowledgment of how diagnostic authority and social position shape the encounter.' },
      { question: 'Cultural countertransference is best understood as:', options: [{ text: 'A pathological response indicating the clinician needs personal therapy before serving culturally diverse clients', isCorrect: false }, { text: 'Inevitable culturally-shaped emotional and cognitive responses to clients that are workable in supervision when examined', isCorrect: true }, { text: 'A minor nuisance that does not affect clinical outcomes when the clinician is well-intentioned', isCorrect: false }, { text: 'A phenomenon exclusive to clinicians who have not completed diversity training', isCorrect: false }], correctAnswer: 1, explanation: 'Cultural countertransference is inevitable — every clinician brings culturally-shaped assumptions into the room. The clinical issue is not its existence but whether it is examined or unexamined. When examined in supervision, it becomes workable clinical data.' },
      { question: 'Institutional accountability in cultural humility includes:', options: [{ text: 'Individual cultural competence development as the exclusive domain of practice improvement', isCorrect: false }, { text: 'Advocating for inclusive intake processes, EHR standards, equitable staffing, and organizational equity practices', isCorrect: true }, { text: 'Institutional change work only after individual cultural competence is fully established', isCorrect: false }, { text: 'Deference to organizational leadership for all institutional equity decisions', isCorrect: false }], correctAnswer: 1, explanation: 'Institutional accountability is the third core commitment of cultural humility and extends beyond individual clinical skill to organizational advocacy. Individual excellence within inequitable systems is necessary but insufficient for equitable care.' },
      { question: 'Seeking cultural consultation when working with an unfamiliar cultural context reflects:', options: [{ text: 'Incompetence requiring remediation before accepting clients from that background', isCorrect: false }, { text: 'Cultural humility — active acknowledgment of blind spots and use of available resources to address them', isCorrect: true }, { text: 'Inappropriate scope of practice requiring immediate client transfer', isCorrect: false }, { text: 'An optional enhancement rather than a professional obligation', isCorrect: false }], correctAnswer: 1, explanation: 'Seeking consultation is a professional obligation of cultural humility, not a sign of incompetence. Cultural humility explicitly predicts the existence of blind spots that external perspective is required to identify.' },
      { question: 'The LEARN model for cross-cultural clinical communication stands for:', options: [{ text: 'Listen, Explain, Acknowledge, Recommend, Negotiate', isCorrect: true }, { text: 'Language, Empathy, Awareness, Resources, Navigation', isCorrect: false }, { text: 'Learn, Explore, Affirm, Respond, Note', isCorrect: false }, { text: 'Locate, Evaluate, Assess, Refer, Note', isCorrect: false }], correctAnswer: 0, explanation: 'The LEARN model: Listen actively to the client\'s perspective, Explain your own understanding, Acknowledge differences and similarities, Recommend treatment collaboratively, Negotiate a shared plan. This structured framework operationalizes cultural humility in clinical communication.' },
      { question: 'White clinicians have a specific obligation in cultural humility practice to:', options: [{ text: 'Avoid working with clients of color to prevent potential harm from racial blind spots', isCorrect: false }, { text: 'Examine how white racial identity and white privilege shape clinical assumptions, interpretations, and blind spots', isCorrect: true }, { text: 'Adopt color-blind framing ("I don\'t see race") to avoid imposing racial frameworks on clients', isCorrect: false }, { text: 'Transfer all clients of color to clinicians of color as the only affirming option', isCorrect: false }], correctAnswer: 1, explanation: 'Color-blindness ("I don\'t see race") is not cultural humility — it makes whiteness invisible as a cultural position while leaving its effects operational. White clinicians have a specific obligation to examine their own racial identity and privilege as part of cultural humility practice.' },
      { question: 'Hook et al.\'s (2013) Cultural Humility Scale measures:', options: [{ text: 'Cultural knowledge acquisition and retention of multicultural course content', isCorrect: false }, { text: 'Clinician openness to culturally diverse clients as rated by clients themselves', isCorrect: true }, { text: 'Organizational cultural competence across institutional dimensions', isCorrect: false }, { text: 'Self-reported cultural humility attitudes without external validation', isCorrect: false }], correctAnswer: 1, explanation: 'The Cultural Humility Scale (Hook et al., 2013) measures clinician cultural humility from the client\'s perspective — not self-report. Client-rated clinician humility is associated with significantly better therapeutic alliance and treatment outcomes across diverse populations.' },
      { question: 'ACA Code C.2 is relevant to cultural humility practice because:', options: [{ text: 'It requires certification in cultural competence before providing services to clients from marginalized groups', isCorrect: false }, { text: 'It requires ongoing monitoring of effectiveness and practice improvement — which includes cultural responsiveness as a continuous obligation', isCorrect: true }, { text: 'It applies only to cultural competence in specific populations designated by the code', isCorrect: false }, { text: 'It exempts clinicians from cultural responsiveness obligations if they have completed required diversity training', isCorrect: false }], correctAnswer: 1, explanation: 'ACA Code C.2 requires counselors to continually monitor their effectiveness and improve their practice. This is not a checkbox — it is an ongoing obligation that encompasses cultural responsiveness as a continuous dimension of competent practice.' },
    ],
  },

  references: [
    'Crenshaw, K. (1989). Demarginalizing the intersection of race and sex. University of Chicago Legal Forum, 139, 139–167.',
    'Crenshaw, K. (1991). Mapping the margins: Intersectionality, identity politics, and violence against women of color. Stanford Law Review, 43(6), 1241–1299.',
    'Hook, J. N., Davis, D. E., Owen, J., Worthington, E. L., Jr., & Utsey, S. O. (2013). Cultural humility: Measuring openness to culturally diverse clients. Journal of Counseling Psychology, 60(3), 353–366.',
    'Meyer, I. H. (2003). Prejudice, social stress, and mental health in lesbian, gay, and bisexual populations. Psychological Bulletin, 129(5), 674–697.',
    'Sue, D. W., Capodilupo, C. M., Torino, G. C., Bucceri, J. M., Holder, A. M. B., Nadal, K. L., & Esquilin, M. (2007). Racial microaggressions in everyday life. American Psychologist, 62(4), 271–286.',
    'Tervalon, M., & Murray-García, J. (1998). Cultural humility versus cultural competence. Journal of Health Care for the Poor and Underserved, 9(2), 117–125.',
    'American Psychological Association. (2017). Multicultural guidelines: An ecological approach to context, identity, and intersectionality. APA.',
    'Helms, J. E. (1990). Black and white racial identity: Theory, research, and practice. Greenwood Press.',
    'Ratts, M. J., Singh, A. A., Nassar-McMillan, S., Butler, S. K., & McCullough, J. R. (2016). Multicultural and social justice counseling competencies. Journal of Multicultural Counseling and Development, 44(1), 28–48.',
    'American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). APA.',
    'Owen, J., Tao, K. W., Imel, Z. E., Wampold, B. E., & Rodolfa, E. (2014). Addressing racial and ethnic microaggressions in therapy. Professional Psychology: Research and Practice, 45(4), 283–290.',
    'Shelton, K., & Delgado-Romero, E. A. (2011). Sexual orientation microaggressions. Journal of Counseling Psychology, 58(2), 210–221.',
    'National Alliance on Mental Illness. (2017). Cultural competency: Mental health resources for minorities. NAMI.',
    'Waters, A., & Asbill, L. (2013). Reflections on cultural humility. CYF News, American Psychological Association.',
  
    'Hook, J. N., Davis, D. E., Owen, J., Worthington, E. L., & Utsey, S. O. (2013). Cultural humility: Measuring openness to culturally diverse clients. Journal of Counseling Psychology, 60(3), 353–366.',
  ],

  resources: [
    { title: 'APA Multicultural Guidelines (2017)', url: 'https://www.apa.org/about/policy/multicultural-guidelines', type: 'pdf', description: 'Updated ecological approach to multicultural competencies.' },
    { title: 'ADDRESSING Framework — Pamela Hays', url: 'https://www.apa.org/pubs/books/4317216', type: 'book', description: 'Structured framework for examining multiple cultural identity dimensions in clinical practice.' },
  ],
};

function stripHtml(h){return(h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(s){return stripHtml(s).split(/\s+/).filter(Boolean).length;}
function validate(course){
  const errors=[],warnings=[];
  let total=0;
  (course.sections||[]).forEach(s=>{(s.contentBlocks||[]).forEach(b=>{
    total+=countWords(b.content||'')+countWords(b.question||'')+countWords(b.explanation||'')+countWords(b.subtitle||'')+countWords(b.title||'');
    (b.accordionItems||[]).forEach(a=>{total+=countWords(a.title)+countWords(a.content);});
    (b.flashcards||[]).forEach(f=>{total+=countWords(f.front)+countWords(f.back);});
    (b.matchingPairs||[]).forEach(p=>{total+=countWords(p.term)+countWords(p.definition);});
    (b.options||[]).forEach(o=>{total+=countWords(typeof o==='object'?o.text:o);});
    (b.cards||[]).forEach(c=>{total+=countWords(c.text);});
    (b.takeaways||[]).forEach(t=>{total+=countWords(t);});
  });});
  const req=course.ceHours*6000;
  if(total<req) errors.push(`Word count ${total} < ${req}`);
  else console.log(`✅ Words: ${total.toLocaleString()}/${req.toLocaleString()}`);
  (course.sections||[]).forEach((s,i)=>{
    const b=s.contentBlocks||[];
    if(!b[0]||b[0].type!=='sectionDivider') errors.push(`Sec ${i+1} no sectionDivider first`);
    if(b[0]&&(!b[0].title||!b[0].subtitle)) errors.push(`Sec ${i+1} divider missing title/subtitle`);
    b.forEach((blk,bi)=>{if(blk.type==='multipleChoice'||blk.type==='multiSelect'){if(!Array.isArray(blk.options)||typeof blk.options[0]!=='object') errors.push(`Sec ${i+1} blk ${bi+1}: flat options`);}});
  });
  if((course.assessment?.questions||[]).length<15) errors.push(`Assessment <15 Qs`);
  if(course.assessment?.passingScore!==80) errors.push('passingScore≠80');
  if(course.maxAttempts!==3) errors.push('maxAttempts≠3');
  if((course.references||[]).length<12) errors.push(`Refs: ${course.references.length}<12`);
  else console.log(`✅ Refs: ${course.references.length}`);
  return{errors,warnings};
}
async function main(){
  const{errors,warnings}=validate(COURSE);
  warnings.forEach(w=>console.warn('⚠️',w));
  if(errors.length){errors.forEach(e=>console.error('❌',e));process.exit(1);}
  await mongoose.connect(MONGODB_URI);
  const col=mongoose.connection.db.collection('interactivecourses');
  const existing=await col.findOne({slug:SLUG});
  if(existing){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated:',SLUG);}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted:',SLUG);}
  const saved=await col.findOne({slug:SLUG});
  const blocks=(saved.sections||[]).reduce((n,s)=>n+(s.contentBlocks?.length||0),0);
  console.log(`Sections:${saved.sections?.length}|Blocks:${blocks}|Qs:${saved.assessment?.questions?.length}|Refs:${saved.references?.length}|isPublished:${saved.isPublished}`);
  await mongoose.disconnect();process.exit(0);
}
main().catch(e=>{console.error(e.message);process.exit(1);});
