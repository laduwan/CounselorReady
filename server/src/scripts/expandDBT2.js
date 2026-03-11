/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected');

const col = mongoose.connection.db.collection('interactivecourses');
const course = await col.findOne({ slug: 'dbt-skills-training-comprehensive' });
if (!course) { console.error('Course not found'); process.exit(1); }

function sc(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}
function cbw(block) {
  if (!block) return 0;
  let w = 0;
  w += sc(block.content); w += sc(block.textContent);
  if (block.type === 'sectionDivider') { w += sc(block.title); w += sc(block.subtitle); }
  if (block.accordionItems) { block.accordionItems.forEach(a => { w += sc(a.title); w += sc(a.content); }); }
  w += sc(block.question); w += sc(block.explanation);
  if (block.options) { block.options.forEach(o => { w += sc(typeof o === 'string' ? o : o.text); }); }
  w += sc(block.matchingInstructions);
  if (block.matchingPairs) { block.matchingPairs.forEach(p => { w += sc(p.term); w += sc(p.definition); }); }
  if (block.resources) { block.resources.forEach(r => { w += sc(r.title); }); }
  return w;
}

const IMG = (label) => `https://via.placeholder.com/600x400/34495E/FFFFFF?text=${encodeURIComponent(label)}`;

// ─── Round 2 expansions ──────────────────────────────────────
// Target: +4,800 words to push from 31,405 → 36,200+

const expansions = {

// ═══ Structure of Comprehensive DBT (2,992 → ~3,800) +800 ═══
"The Structure of Comprehensive DBT": [
  {
    type: "text",
    content: `<h3>The Therapist Consultation Team: Therapy for the Therapist</h3>
<p>The fourth component of comprehensive DBT—the therapist consultation team—is perhaps the most distinctive and least understood element of the treatment model. Linehan conceptualized the consultation team not as an optional support group for therapists but as an essential, integral component of DBT without which the treatment cannot be delivered effectively. The consultation team meets weekly, typically for one to two hours, and follows a structured agenda that includes mindfulness practice, review of diary cards and target behaviors for each therapist's caseload, problem-solving around clinical dilemmas, and attention to the therapists' own emotional responses and potential burnout.</p>
<p>The theoretical rationale for the consultation team flows directly from the biosocial model. Just as clients develop emotional dysregulation through the transaction between biological vulnerability and an invalidating environment, therapists working with severely dysregulated clients are at risk of developing their own patterns of dysregulation in response to the intense emotional demands of the work. Therapist burnout, compassion fatigue, and the gradual erosion of therapeutic effectiveness are not signs of personal weakness—they are predictable consequences of sustained exposure to clients' pain, crisis, and sometimes death. The consultation team provides a validating, structured environment in which therapists can process their own emotional reactions, receive feedback on their clinical decisions, and maintain the dialectical balance between acceptance and change in their own therapeutic stance.</p>
<p>The consultation team operates according to specific agreements that all members endorse. These include the dialectical agreement (to accept a dialectical philosophy and work toward synthesizing opposing positions), the consultation-to-the-patient agreement (therapists agree to help clients navigate systems rather than telling other providers how to treat the client), the consistency agreement (therapists do not need to be consistent with each other—different therapists may have different limits and approaches, and clients are expected to manage these differences using interpersonal effectiveness skills), the observing-limits agreement (therapists agree to observe their own personal and professional limits rather than pushing beyond them until burnout occurs), the phenomenological empathy agreement (therapists agree to search for the most empathic interpretation of each other's behavior and the client's behavior), and the fallibility agreement (therapists acknowledge that they are fallible, that mistakes are inevitable, and that they are committed to learning from errors rather than defending against them).</p>
<p>These agreements create a team culture that mirrors the treatment philosophy applied to clients: team members are simultaneously supported and challenged, validated and pushed toward growth, accepted as they are and encouraged to do better. This parallel process between the treatment relationship and the consultation team relationship is intentional and reflects the fundamental DBT principle that the therapists need the same dialectical balance of acceptance and change that they provide to their clients.</p>`,
    accessibility: { role: "article", ariaLabel: "Therapist consultation team" }
  }
],

// ═══ Evidence Base (3,141 → ~3,850) +700 ═══
"Evidence Base, Limitations, and Clinical Integration": [
  {
    type: "text",
    content: `<h3>Critical Limitations and the Ongoing Evolution of DBT</h3>
<p>A balanced clinical education requires honest engagement with the limitations and criticisms of any treatment approach, and DBT is no exception. While the evidence base for DBT is substantial and growing, several significant limitations warrant careful consideration by clinicians who are integrating DBT-informed strategies into their practice.</p>
<p>The most frequently cited limitation is the resource intensity of comprehensive DBT. A full DBT program requires a minimum of two therapists (for skills group co-facilitation), weekly individual therapy sessions, weekly skills group sessions, between-session phone coaching availability, and weekly consultation team meetings. For many clinical settings—particularly solo practices, under-resourced community mental health centers, and rural areas with limited staffing—implementing comprehensive DBT is simply not feasible. This resource intensity raises important questions about access and equity: if the most effective version of DBT requires a team-based approach that is only available in well-funded urban settings, what are the implications for clients in less-resourced environments? The research on stand-alone DBT skills groups and DBT-informed individual therapy partially addresses this concern, but the evidence for these abbreviated models is less robust than for comprehensive DBT.</p>
<p>A second limitation concerns the cultural applicability of DBT. The treatment was developed primarily with white, female clients in the Pacific Northwest of the United States, and the research samples in most DBT studies have been predominantly white and female. While the theoretical framework of DBT—particularly the biosocial model and the emphasis on validation—appears to have cross-cultural relevance, the specific skills and their manner of presentation may require adaptation for clients from diverse cultural backgrounds. For example, the emphasis on direct emotional expression and assertive communication in the interpersonal effectiveness module may not align with the communication norms of collectivist cultures. Similarly, the concept of radical acceptance may resonate differently with individuals whose suffering is rooted in systemic oppression—accepting the reality of systemic injustice is fundamentally different from accepting the reality of a personal loss, and the clinical application of radical acceptance must be sensitive to this distinction.</p>
<p>A third limitation involves the risk of diagnostic stigma. DBT was originally developed for Borderline Personality Disorder, and the association between DBT and BPD remains strong in the professional community. Some clients may resist a referral for DBT because they associate it with a diagnosis they find stigmatizing, and some clinicians may inadvertently reinforce this stigma by referring only clients with personality disorder diagnoses for DBT services. The expanding evidence base for DBT across multiple diagnostic categories is gradually eroding this association, but it remains a practical barrier to treatment access in many settings.</p>
<p>Finally, the question of treatment duration and long-term outcomes deserves attention. Standard comprehensive DBT is designed as a one-year treatment, and most research studies evaluate outcomes at the end of this treatment period or at relatively short follow-up intervals. Less is known about the long-term durability of treatment gains, the optimal duration of treatment for different client populations, and whether some clients require ongoing or intermittent DBT to maintain their progress. Emerging research on DBT alumni groups and booster sessions is beginning to address these questions, but the field would benefit from more longitudinal research tracking client outcomes over years rather than months following treatment completion.</p>`,
    accessibility: { role: "article", ariaLabel: "Critical limitations and evolution of DBT" }
  }
],

// ═══ Mindfulness (3,545 → ~4,200) +650 ═══
"Core Skill Module: Mindfulness": [
  {
    type: "imageText",
    image: IMG("Wise+Mind+Access+Strategies"),
    imageAlt: "Illustration showing various pathways to accessing Wise Mind including contemplation, body awareness, and intuition",
    title: "Accessing Wise Mind: Practical Strategies",
    content: `<p>One of the most common questions clients ask about Wise Mind is: "How do I get there?" Unlike Reasonable Mind and Emotion Mind, which seem to arise spontaneously in response to situations, Wise Mind often requires deliberate cultivation. Linehan offers several strategies for accessing Wise Mind that therapists can teach and practice with clients.</p>
<p>The first strategy involves the stone flake on a lake visualization. The client imagines themselves as a small stone flake floating gently down through the water of a clear lake, slowly settling on the lake bed. The surface of the lake represents the turbulence of Emotion Mind and the rigidity of Reasonable Mind; the bottom of the lake represents the still, knowing place of Wise Mind. As the stone flake descends, the client breathes slowly and allows their awareness to settle below the surface agitation into a deeper place of knowing. This visualization is particularly effective for clients who are overwhelmed by the rapid cycling between emotional reactivity and desperate attempts at rational control.</p>
<p>The second strategy involves asking Wise Mind a question. The client formulates a question about a decision or dilemma they are facing, then sits quietly with the question—not trying to think their way to an answer, but allowing the answer to arise from the integration of thinking and feeling. The instruction is to "ask the question and then listen for the answer," treating the process more like listening than like thinking. Clients who struggle with this approach can be encouraged to notice what they feel in their body when they consider different options—a sense of expansion or opening may signal Wise Mind recognition, while a sense of constriction or tightness may signal that the option is not aligned with their deeper knowing.</p>
<p>The third strategy involves practicing Wise Mind in low-stakes situations before attempting it in high-stakes ones. Just as a musician practices scales before performing a concerto, clients can practice accessing Wise Mind when making small, relatively inconsequential decisions—what to eat for lunch, which route to take home, whether to accept a social invitation—before attempting to access Wise Mind during the emotionally charged situations where it is most needed. This graduated practice builds the neural pathways and experiential confidence that make Wise Mind more accessible when the stakes are higher.</p>`,
    imagePosition: "left",
    highlight: false,
    accessibility: { role: "article", ariaLabel: "Strategies for accessing Wise Mind" }
  }
],

// ═══ Distress Tolerance (3,418 → ~4,050) +630 ═══
"Core Skill Module: Distress Tolerance": [
  {
    type: "text",
    content: `<h3>Pros and Cons: A Decision-Making Tool for Crisis Moments</h3>
<p>One additional distress tolerance skill that merits detailed discussion is the Pros and Cons exercise—a structured decision-making tool that helps clients evaluate the consequences of acting on crisis urges versus using skills to tolerate the distress. Unlike the impulsive cost-benefit analysis that occurs automatically in Emotion Mind ("I feel terrible and cutting will make me feel better right now"), the Pros and Cons exercise requires the client to systematically consider four categories of consequences: the pros of acting on the crisis urge, the cons of acting on the crisis urge, the pros of tolerating the distress using skills, and the cons of tolerating the distress using skills.</p>
<p>The power of this exercise lies in its comprehensiveness and its timing. When completed in advance—during a period of relative emotional stability—the Pros and Cons worksheet forces the client to honestly confront the full range of consequences associated with their crisis behaviors, including consequences they typically avoid thinking about during acute episodes. A client who uses alcohol to manage emotional crises, for example, might list the pros of drinking (immediate relief from emotional pain, numbing of overwhelming sensations, temporary escape from problems) alongside the cons that are easy to ignore in the moment (hangover, shame, worsening of depression, damage to relationships, interference with medication, financial cost, risk of escalation, potential legal consequences). The client then lists the pros of using skills instead (maintaining self-respect, avoiding the consequences of drinking, building confidence in coping ability, preserving relationships) and the cons (skills are harder, slower, and less immediately effective than alcohol; the emotional pain must be felt rather than numbed).</p>
<p>The completed worksheet is then kept in an accessible location—a wallet, a phone, a refrigerator door—so that it can be reviewed during a crisis without requiring the cognitive effort of generating the analysis in real time. This is critically important because the cognitive resources needed for balanced decision-making are precisely the resources that are compromised during acute emotional crises. By completing the analysis in advance, the client is essentially lending their calm, rational self to their future distressed self, providing a pre-made argument against impulsive action at the exact moment when the capacity for generating such arguments is most impaired.</p>
<p>Therapists should help clients create individualized Pros and Cons worksheets for each of their primary crisis behaviors, and should update these worksheets regularly as the client's circumstances and self-awareness evolve. The exercise can also be adapted for non-crisis decisions that the client finds difficult, such as whether to confront a friend about a boundary violation, whether to disclose a personal struggle to a family member, or whether to make a significant life change. In each case, the structured format helps the client move from reactive, emotion-driven decision-making to deliberate, Wise Mind decision-making.</p>`,
    accessibility: { role: "article", ariaLabel: "Pros and Cons distress tolerance skill" }
  }
],

// ═══ Emotion Regulation (3,516 → ~4,150) +630 ═══
"Core Skill Module: Emotion Regulation": [
  {
    type: "text",
    content: `<h3>Building a Life Worth Living: The Ultimate Goal of Emotion Regulation</h3>
<p>While the specific skills of emotion regulation—Check the Facts, Opposite Action, Problem Solving, ABC PLEASE, the Wave Skill—provide concrete tools for managing emotional experiences, the overarching goal of the emotion regulation module extends beyond any single skill. Linehan frequently describes the ultimate objective of DBT as helping clients "build a life worth living"—a life that is sufficiently rich in meaning, connection, accomplishment, and pleasure that the client no longer needs self-destructive behaviors to cope with emotional pain because the pain itself has been reduced to manageable levels.</p>
<p>This phrase—building a life worth living—is both a clinical goal and a philosophical statement. It acknowledges that many clients who enter DBT treatment are not merely struggling with specific symptoms or behaviors; they are struggling with lives that feel fundamentally unlivable. Years of emotional dysregulation, self-destructive coping, damaged relationships, lost opportunities, and accumulated shame have created life circumstances that are genuinely painful—not just because the client perceives them through a distorted emotional lens, but because the objective circumstances are genuinely difficult. A client who has lost jobs due to emotional outbursts, ended relationships due to interpersonal conflict, accumulated debt due to impulsive spending, and isolated themselves due to shame is living a life that would be emotionally painful for anyone, regardless of their biological vulnerability.</p>
<p>The ABC PLEASE skills address this reality directly. Accumulating positive experiences is not a superficial instruction to "do fun things"—it is a systematic intervention to rebuild a life that generates positive emotional experiences through engagement in activities that are consistent with the client's values and goals. Building mastery is not merely about staying busy—it is about developing competencies that increase the client's sense of agency, self-efficacy, and confidence. Coping ahead is not just preparation for anticipated difficulties—it is the development of a proactive, forward-looking orientation that replaces the reactive, crisis-driven pattern that has characterized the client's life. And the PLEASE skills address the fundamental biological infrastructure that supports emotional resilience: physical health, adequate nutrition, freedom from mood-altering substances, restorative sleep, and regular physical activity.</p>
<p>When these proactive interventions are implemented consistently over time, the cumulative effect is a gradual but meaningful shift in the overall quality of the client's life. As positive experiences accumulate, as mastery experiences build confidence, as physical health improves, and as coping skills become more automatic, the frequency and intensity of emotional crises naturally decreases—not because the client is suppressing emotions or avoiding triggers, but because the baseline conditions of their life have genuinely improved. This is the deepest level of emotion regulation: not the management of individual emotional episodes, but the construction of a life in which overwhelming emotional crises occur less often because the life itself has become more stable, more connected, and more meaningful.</p>`,
    accessibility: { role: "article", ariaLabel: "Building a life worth living" }
  }
],

// ═══ Interpersonal Effectiveness (3,516 → ~4,150) +630 ═══
"Core Skill Module: Interpersonal Effectiveness": [
  {
    type: "text",
    content: `<h3>Applying Interpersonal Effectiveness in the Therapeutic Relationship</h3>
<p>An often-overlooked dimension of the interpersonal effectiveness module is that the therapeutic relationship itself serves as a laboratory for practicing interpersonal skills. The relationship between the DBT therapist and the client is not merely the context in which skills are taught—it is an active, real-time interpersonal interaction that provides constant opportunities for the application of DEAR MAN, GIVE, FAST, and Walking the Middle Path. The therapist models these skills in every interaction, and the client is encouraged to practice them within the safety of the therapeutic relationship before generalizing them to more challenging interpersonal contexts.</p>
<p>For example, when a client disagrees with the therapist's assessment of a situation, the client can practice using DEAR MAN to assert their perspective: describing what the therapist said, expressing their disagreement, asserting their own interpretation, and reinforcing the value of being heard accurately. The therapist validates this assertion using GIVE skills—demonstrating genuine interest in the client's perspective, validating the logic of their position, and maintaining a gentle, easy manner even when the disagreement is substantive. This exchange models a healthy interpersonal interaction in which disagreement is expressed directly, received respectfully, and resolved collaboratively—an experience that many clients with histories of invalidation have rarely if ever encountered.</p>
<p>The therapeutic relationship also provides opportunities to practice FAST skills in a supported environment. When a client apologizes excessively for expressing a need ("I'm sorry to bother you with this"), the therapist can gently point out the over-apologizing pattern and encourage the client to restate the request without unnecessary apologies. When a client compromises their values to please the therapist ("I'll do whatever you think is best"), the therapist can redirect by asking the client to identify and articulate their own preferences. When a client is tempted to be dishonest about their behavior (minimizing substance use, denying self-harm), the therapist can create an environment in which truthfulness is reinforced rather than punished, making it incrementally easier for the client to practice the T in FAST.</p>
<p>Perhaps most importantly, the therapeutic relationship provides a context for practicing the repair of interpersonal ruptures—moments when the connection between two people is strained by misunderstanding, hurt feelings, or conflicting needs. Ruptures are inevitable in any meaningful relationship, and the ability to repair them skillfully is one of the most important interpersonal competencies a person can develop. In DBT, the therapist intentionally addresses ruptures when they occur, modeling the combination of validation ("I understand why that felt hurtful to you"), accountability ("I could have communicated that differently"), and problem-solving ("Let's talk about how we can handle similar situations better in the future") that characterizes effective rupture repair. Over time, the client internalizes this repair process and becomes increasingly able to apply it in their relationships outside of therapy.</p>`,
    accessibility: { role: "article", ariaLabel: "Interpersonal effectiveness in the therapeutic relationship" }
  }
],

// ═══ Introduction (3,800 → ~4,300) +500 ═══
"Introduction and Course Overview": [
  {
    type: "text",
    content: `<h3>The Continuing Evolution of DBT: Where the Field Is Heading</h3>
<p>As you begin this course, it is worth noting that DBT is not a static treatment frozen in the form Linehan first described in 1993. The treatment continues to evolve in response to new research findings, clinical innovations, and the changing landscape of mental health care. Several developments are particularly noteworthy for practicing clinicians.</p>
<p>First, there is growing interest in the mechanisms of change in DBT—the specific processes through which the treatment produces its effects. Early research focused primarily on whether DBT works (efficacy trials), but the field is now increasingly asking how and why it works (mechanism research). Preliminary findings suggest that improvements in emotion regulation skills and reductions in experiential avoidance may be key mechanisms, but much work remains to be done. Understanding the mechanisms of change has practical implications for clinicians because it can help identify which components of DBT are most essential and which can be adapted or abbreviated without losing therapeutic effectiveness.</p>
<p>Second, technology-enhanced DBT is an active area of development. Mobile applications that prompt skills use, virtual skills training groups, online coaching platforms, and digital diary card systems are being developed and evaluated. These innovations have the potential to address some of the access barriers associated with comprehensive DBT by making skills training available to clients who cannot attend in-person groups, providing real-time coaching support between sessions, and facilitating more detailed monitoring of skill use and symptom patterns. The COVID-19 pandemic accelerated the adoption of telehealth-delivered DBT, and emerging research suggests that virtual delivery can be effective, though questions remain about whether certain components such as group skills training lose efficacy in a virtual format.</p>
<p>Third, the transdiagnostic application of DBT skills continues to expand. Rather than adapting DBT for specific diagnostic categories one at a time, some researchers and clinicians are advocating for a unified DBT skills approach that targets the underlying process of emotional dysregulation regardless of its diagnostic expression. This approach aligns with the broader movement in mental health toward transdiagnostic treatment models that focus on shared mechanisms rather than disorder-specific interventions. For the practicing clinician, this trend is encouraging because it suggests that a solid grounding in DBT skills—the grounding this course aims to provide—will be applicable across an increasingly wide range of clinical presentations.</p>`,
    accessibility: { role: "article", ariaLabel: "Continuing evolution of DBT" }
  }
],

// ═══ Biosocial Theory (3,831 → ~4,250) +420 ═══
"Biosocial Theory and the Dialectical Worldview": [
  {
    type: "text",
    content: `<h3>Dialectical Dilemmas: Common Behavioral Patterns in Emotional Dysregulation</h3>
<p>Linehan identified three specific dialectical dilemmas—pairs of opposing behavioral extremes—that are commonly observed in individuals with pervasive emotional dysregulation. These dilemmas represent the behavioral consequences of the biosocial transaction and provide the therapist with specific targets for dialectical intervention.</p>
<p>The first dilemma is emotional vulnerability versus self-invalidation. On one extreme, the individual is overwhelmed by the intensity of their emotional reactions and may externalize their distress through dramatic expressions of pain, demands for help, or crisis-generating behaviors. On the other extreme, the same individual may swing to self-invalidation—adopting the stance of the invalidating environment and judging their own emotions as excessive, irrational, or unacceptable. The dialectical synthesis involves acknowledging the genuine intensity of emotional experience while developing the capacity to regulate and modulate that experience without either surrendering to it or denying it.</p>
<p>The second dilemma is active passivity versus apparent competence. Active passivity describes the pattern of approaching problems helplessly—demanding that others solve one's problems rather than engaging in active problem-solving, and becoming passive or frozen when confronted with difficulties. Apparent competence is the opposite extreme—presenting a facade of capability and control that masks the internal experience of being overwhelmed. Individuals who display apparent competence may seem to function well in structured, low-stress environments but fall apart when demands increase or when the structure is removed. The dialectical synthesis involves developing genuine competence—the ability to identify when one needs help and ask for it effectively while simultaneously building one's own capacity for independent problem-solving.</p>
<p>The third dilemma is unrelenting crisis versus inhibited grieving. Unrelenting crisis describes the pattern of moving from one crisis to the next without respite—each crisis generating consequences that trigger the next crisis in an apparently endless cycle. Inhibited grieving is the opposite pattern—the systematic avoidance of painful emotional experiences, particularly grief, loss, and sadness, through distraction, dissociation, or behavioral avoidance. The dialectical synthesis involves developing the capacity to fully experience and process painful emotions (including grief) while also developing the skills to prevent unnecessary crises and to manage necessary ones without escalation.</p>
<p>These dialectical dilemmas are clinically valuable because they help the therapist identify the specific behavioral patterns that are maintaining the client's difficulties and they provide clear targets for intervention. When the therapist notices the client oscillating between emotional vulnerability and self-invalidation, for instance, they can name the pattern, validate both sides of the dilemma, and work with the client to develop a more integrated response that honors their emotional experience without being controlled by it.</p>`,
    accessibility: { role: "article", ariaLabel: "Dialectical dilemmas in emotional dysregulation" }
  }
],

// ═══ Glossary (3,646 → ~4,050) +400 ═══
"Glossary and Clinical Application Exercise": [
  {
    type: "text",
    content: `<h3>Putting It All Together: The Interconnection of DBT Skill Modules</h3>
<p>As you prepare to complete the final assessment, it is important to step back from the individual skill modules and appreciate the elegant interconnection of the DBT skills system as a whole. The four core modules are not four separate toolkits that happen to be packaged together—they are four interdependent dimensions of a single, integrated approach to building a life worth living. Mindfulness provides the foundational awareness that enables all other skills: you cannot regulate an emotion you have not noticed, tolerate distress you have not acknowledged, or communicate effectively in a relationship when you are not present. Distress tolerance provides the crisis survival capacity that keeps the client alive and in treatment during the acute episodes that are inevitable early in the treatment process, creating the stability necessary for the longer-term work of emotion regulation and interpersonal effectiveness. Emotion regulation addresses the chronic patterns of emotional suffering that generate the crises distress tolerance manages, while interpersonal effectiveness addresses the relational context in which emotions arise and the interpersonal consequences of emotional dysregulation.</p>
<p>This interconnection means that progress in any one skill module supports progress in all the others. A client who develops stronger mindfulness skills becomes better at recognizing the early signs of emotional escalation, which makes their emotion regulation interventions more timely and effective. A client who develops stronger distress tolerance skills feels more confident that they can survive intense emotional episodes, which paradoxically reduces the intensity of those episodes because the catastrophic fear of being overwhelmed is itself a significant amplifier of emotional distress. A client who develops stronger interpersonal effectiveness skills reduces the frequency of interpersonal conflicts that trigger emotional crises, which in turn reduces the demand on their distress tolerance capacity. The system is synergistic: the whole is considerably greater than the sum of its parts.</p>
<p>As you return to your clinical practice and begin applying what you have learned in this course, we encourage you to communicate this interconnection to your clients. Clients who understand that each skill they learn enhances the effectiveness of every other skill are more motivated to engage with the full curriculum rather than cherry-picking the skills that feel most immediately relevant. And clinicians who understand this interconnection are better positioned to make thoughtful decisions about which skills to prioritize for which clients at which points in treatment—decisions that reflect the strategic, Wise Mind thinking that DBT seeks to cultivate in both clients and therapists alike.</p>`,
    accessibility: { role: "article", ariaLabel: "Interconnection of DBT skill modules" }
  }
]

};

// ─── Apply expansions ────────────────────────────────────────
console.log('Expanding modules (round 2)...\n');

for (const mod of course.modules) {
  const newBlocks = expansions[mod.title];
  if (!newBlocks) {
    console.log('  ' + mod.title + ': no expansion');
    continue;
  }
  const blocks = mod.contentBlocks || [];
  const insertAt = Math.max(blocks.length - 1, 0);
  blocks.splice(insertAt, 0, ...newBlocks);
  mod.contentBlocks = blocks;

  let added = 0;
  for (const b of newBlocks) { added += cbw(b); }
  console.log('  ' + mod.title + ': +' + added + ' words');
}

// ─── Save ────────────────────────────────────────────────────
console.log('\nSaving...');
const result = await col.replaceOne(
  { slug: 'dbt-skills-training-comprehensive' },
  course
);
console.log('Updated: ' + result.modifiedCount);

// ─── Final count ─────────────────────────────────────────────
console.log('\nFinal word counts:');
let total = 0;
for (const m of course.modules) {
  let mw = 0;
  (m.contentBlocks || []).forEach(b => { mw += cbw(b); });
  (m.lessons || []).forEach(l => { mw += sc(l.content); });
  console.log('  ' + m.title + ': ' + mw);
  total += mw;
}
console.log('\n  TOTAL: ' + total + ' / 36000 (' + Math.round(total/36000*100) + '%)');
console.log('  Status: ' + (total >= 36000 ? 'PASS' : 'NEED ' + (36000-total) + ' MORE'));

await mongoose.disconnect();
console.log('Done');
