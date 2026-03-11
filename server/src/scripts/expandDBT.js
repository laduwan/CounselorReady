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

// ─── New content blocks for each module ───────────────────────
// Inserted BEFORE the last block (summary) in each module

const expansions = {

// ═══ MODULE 1: Introduction (+1,200 words) ═══
"Introduction and Course Overview": [
  {
    type: "text",
    content: `<h3>The Significance of DBT in Modern Mental Health Practice</h3>
<p>The impact of Dialectical Behavior Therapy on the field of mental health cannot be overstated. Before Linehan's pioneering work, clinicians working with chronically suicidal individuals and those diagnosed with Borderline Personality Disorder often experienced a profound sense of helplessness and frustration. Treatment dropout rates exceeded fifty percent in many settings, and the prevailing clinical culture frequently blamed clients for their own treatment failures—characterizing them as manipulative, attention-seeking, or fundamentally untreatable. This clinical nihilism had devastating consequences for both clients and therapists. Clients internalized the message that they were beyond help, reinforcing the very hopelessness that drove their suicidal behavior. Therapists burned out at alarming rates, with many abandoning work with this population entirely.</p>
<p>DBT fundamentally transformed this landscape by providing a structured, evidence-based framework that gave clinicians a clear roadmap for treatment and gave clients a tangible set of skills for managing their emotional pain. The treatment's emphasis on the dialectical balance between acceptance and change offered a philosophical resolution to the clinical impasse that had stymied the field for decades. By explicitly acknowledging that clients were doing the best they could while simultaneously insisting that they needed to do better, DBT created a therapeutic environment in which change became possible without the experience of invalidation that had undermined previous treatment approaches.</p>
<p>The ripple effects of DBT's success have extended far beyond the treatment of Borderline Personality Disorder. The skills-based approach that Linehan developed has influenced the broader field of psychotherapy in ways that continue to expand. Mindfulness-based interventions, which were relatively obscure in Western clinical practice before DBT brought them to mainstream attention, are now integrated into dozens of evidence-based treatments for conditions ranging from depression to chronic pain to substance use disorders. The concept of emotional validation as a clinical intervention—rather than merely a relational nicety—has permeated therapeutic training programs across orientations. And the structured approach to skills training that DBT pioneered has been adapted for use in schools, correctional facilities, primary care settings, and corporate wellness programs.</p>
<p>For the practicing clinician, understanding DBT is no longer optional—it is an essential component of clinical competence. Even if you never implement a comprehensive DBT program, the theoretical frameworks, clinical strategies, and specific skills that you will learn in this course will enhance your effectiveness with any client who presents with emotional dysregulation, interpersonal difficulties, or self-destructive behavioral patterns. These presentations are among the most common in clinical practice, cutting across diagnostic categories and appearing in virtually every treatment setting. The investment you are making in this continuing education course will pay dividends across your entire caseload and throughout your career.</p>`,
    accessibility: { role: "article", ariaLabel: "Significance of DBT in modern practice" }
  },
  {
    type: "accordion",
    accordionItems: [
      {
        title: "Key Terminology You Will Encounter in This Course",
        content: `<p>Before proceeding to the theoretical and clinical content, it is helpful to familiarize yourself with several key terms that will appear throughout the course:</p>
<p><strong>Dialectics:</strong> A philosophical framework holding that reality is composed of opposing forces whose synthesis produces growth and change. In DBT, the primary dialectic is between acceptance and change.</p>
<p><strong>Biosocial Theory:</strong> DBT's explanatory model for the development of emotional dysregulation, positing that it arises from the transaction between biological emotional vulnerability and an invalidating social environment.</p>
<p><strong>Emotional Dysregulation:</strong> A pattern of emotional responding characterized by heightened sensitivity to emotional stimuli, intense emotional reactions, and a slow return to emotional baseline, resulting in difficulty managing emotional experiences effectively.</p>
<p><strong>Validation:</strong> A therapeutic intervention in which the clinician communicates that the client's emotional experience is understandable and makes sense within its context—without necessarily agreeing with the client's interpretations or behaviors.</p>
<p><strong>Skills Training:</strong> The structured, educational component of DBT in which clients learn and practice specific behavioral skills organized into four modules: Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness.</p>
<p><strong>Chain Analysis:</strong> A detailed, step-by-step examination of the sequence of events, thoughts, emotions, and behaviors leading up to a problematic behavior, used to identify points of intervention and alternative responses.</p>
<p><strong>Wise Mind:</strong> The dialectical synthesis of emotional experience (Emotion Mind) and rational analysis (Reasonable Mind), representing an intuitive state of knowing that integrates both logic and feeling.</p>
<p><strong>Radical Acceptance:</strong> The practice of fully acknowledging reality as it is, without fighting, denying, or judging it—while remaining committed to working toward change where change is possible.</p>`
      },
      {
        title: "How This Course Differs from DBT Certification Training",
        content: `<p>It is important to set clear expectations about what this continuing education course provides and what it does not. This course is a comprehensive educational overview of Dialectical Behavior Therapy designed to earn you six continuing education credits toward the maintenance of your professional license. It will give you a thorough understanding of DBT's theoretical foundations, clinical strategies, skills modules, evidence base, and limitations.</p>
<p>This course does NOT constitute DBT-intensive training, nor does it qualify you for certification as a DBT therapist. Comprehensive DBT training typically involves a multi-day intensive workshop followed by an extended period of supervised practice and consultation, often spanning twelve to eighteen months. Certification through the DBT-Linehan Board of Certification (DBT-LBC) requires documented evidence of training, supervision, and adherence to specific practice standards.</p>
<p>What this course DOES provide is the foundational knowledge you need to begin integrating DBT-informed strategies into your existing practice, to make informed decisions about whether to pursue additional DBT training, and to better serve clients whose clinical presentations involve emotional dysregulation. Many clinicians find that even a solid educational overview of DBT significantly enhances their clinical effectiveness, particularly in the areas of validation skills, mindfulness-based interventions, and structured approaches to crisis management.</p>
<p>If you complete this course and wish to deepen your DBT skills, we recommend exploring training opportunities through Behavioral Tech, LLC (the organization founded by Marsha Linehan), the DBT-Linehan Board of Certification, or other training programs that adhere to the standards of adherent DBT practice. Your regional professional associations may also offer DBT-focused workshops and consultation groups.</p>`
      }
    ],
    accessibility: { role: "region", ariaLabel: "Key terminology and course scope accordion" }
  }
],

// ═══ MODULE 2: Biosocial Theory (+700 words) ═══
"Biosocial Theory and the Dialectical Worldview": [
  {
    type: "text",
    content: `<h3>Applying Biosocial Theory in Clinical Formulation</h3>
<p>Understanding biosocial theory at a conceptual level is essential, but the true clinical value of the model lies in its application to individualized case formulation. When a new client presents with patterns of emotional dysregulation, self-harm, or chronic interpersonal conflict, the DBT-informed clinician uses biosocial theory as a lens for understanding the client's specific history and current functioning. This process involves identifying the particular manifestations of biological vulnerability in this individual—for example, does the client show heightened sensitivity primarily to interpersonal cues, to perceived rejection, to situations involving performance evaluation, or to a broader range of emotional stimuli? The specificity of the vulnerability pattern informs which skills and interventions will be most relevant.</p>
<p>Equally important is the assessment of the specific forms of invalidation the client experienced and continues to experience. Was the invalidation primarily emotional dismissal within the family of origin? Was it related to cultural expectations about gender roles and emotional expression? Did it occur in the context of more severe experiences such as abuse or neglect? Is the client currently in an invalidating environment—a workplace that punishes emotional expression, a romantic relationship characterized by dismissal, a social context that stigmatizes mental health struggles? Understanding the specific texture of the invalidation experience helps the therapist tailor validation interventions to address the precise wounds the client carries.</p>
<p>The biosocial formulation also helps the therapist anticipate where the therapeutic relationship itself may become a site of unintentional invalidation. If the client's history includes repeated experiences of being told that their emotions are wrong or excessive, the therapist must be especially attuned to moments when standard therapeutic interventions—cognitive restructuring, behavioral homework assignments, even well-intentioned encouragement—might inadvertently replicate the invalidating pattern. The biosocial lens keeps the therapist alert to these dynamics and provides a framework for repairing ruptures when they inevitably occur.</p>
<p>Perhaps most importantly, sharing the biosocial formulation with the client is itself a therapeutic intervention of considerable power. When a therapist says to a client, "Based on what you've told me about your history, it sounds like you were born with a nervous system that experiences emotions more intensely than most people, and you grew up in an environment that didn't know how to respond to that intensity effectively. The combination of those two things explains a lot of what you're struggling with now—and it also means that your struggles are not your fault and that there are specific, learnable skills that can help," the client often experiences this as the first time anyone has made sense of their suffering without blaming them for it. This moment of felt understanding can be transformative and frequently marks the beginning of genuine therapeutic engagement.</p>`,
    accessibility: { role: "article", ariaLabel: "Applying biosocial theory in clinical formulation" }
  }
],

// ═══ MODULE 3: Structure of Comprehensive DBT (+1,900 words) ═══
"The Structure of Comprehensive DBT": [
  {
    type: "text",
    content: `<h3>The Treatment Target Hierarchy: Organizing Clinical Priorities</h3>
<p>One of the most distinctive and clinically valuable features of comprehensive DBT is its explicit treatment target hierarchy, which provides therapists with a clear framework for prioritizing clinical issues within and across sessions. In many therapeutic orientations, the question of what to focus on in a given session is left largely to clinical judgment, and clinicians working with complex, multi-problem clients can find themselves overwhelmed by the sheer number of issues competing for attention. The DBT target hierarchy resolves this problem by establishing a fixed order of priorities that applies to every session of individual therapy.</p>
<p>The hierarchy consists of four levels, arranged in descending order of urgency. The first and highest priority is always life-threatening behaviors. If the client has engaged in any suicidal behavior, self-harm, or homicidal behavior since the last session, this becomes the focus of the session regardless of what other issues may be present. The therapist conducts a detailed behavioral chain analysis of the life-threatening episode, identifies the factors that contributed to it, and works with the client to develop a plan for using skills differently the next time a similar situation arises. This unwavering prioritization communicates a clear message to the client: your life matters more than any other therapeutic goal, and we will not proceed to other topics until we have addressed threats to your safety.</p>
<p>The second level of the hierarchy is therapy-interfering behaviors—any behaviors by the client or the therapist that threaten the integrity or continuity of the treatment itself. For clients, therapy-interfering behaviors include missing sessions, arriving late, not completing homework assignments, dissociating during sessions, or engaging in behaviors that make it difficult for the therapist to provide effective treatment. For therapists, therapy-interfering behaviors include being unprepared for sessions, canceling appointments, failing to return phone calls within agreed-upon timeframes, or losing the balance between validation and change strategies. The inclusion of therapist behaviors in the hierarchy is a distinctive feature of DBT that reflects Linehan's recognition that treatment failure is never solely the client's responsibility.</p>
<p>The third level addresses quality of life interfering behaviors—patterns of behavior that do not threaten the client's life or the therapy itself but that significantly diminish the client's ability to function and experience well-being. These include substance abuse, eating disorder behaviors, financial mismanagement, housing instability, unemployment, dysfunctional relationship patterns, and untreated medical conditions. The fourth level focuses on increasing behavioral skills—systematically building the client's repertoire of effective coping strategies across all four skill modules.</p>`,
    accessibility: { role: "article", ariaLabel: "Treatment target hierarchy" }
  },
  {
    type: "text",
    content: `<h3>Behavioral Chain Analysis and Solution Analysis</h3>
<p>Behavioral chain analysis is the primary assessment and intervention tool used in DBT individual therapy. When a client reports engaging in a target behavior—particularly a life-threatening or therapy-interfering behavior—the therapist guides the client through a detailed, moment-by-moment reconstruction of the entire sequence of events that led to the behavior. This reconstruction begins with the identification of the prompting event (the external or internal event that initiated the behavioral chain) and proceeds through every link in the chain: the thoughts that arose, the emotions that were triggered, the physical sensations that accompanied those emotions, the action urges that developed, any skills that were attempted, and the ultimate behavior along with its immediate and delayed consequences.</p>
<p>The purpose of chain analysis is not to assign blame or to make the client feel guilty about their behavior. Rather, it serves three essential clinical functions. First, it helps both the therapist and the client understand the specific factors that contributed to the behavior in this particular instance. Emotional dysregulation rarely follows a simple, direct path from trigger to behavior; the chain typically reveals a complex sequence of escalating cognitive, emotional, and behavioral events, each of which influenced the next. By making this sequence explicit, chain analysis transforms a confusing and shame-inducing experience into a comprehensible process that can be analyzed and modified.</p>
<p>Second, chain analysis identifies multiple potential points of intervention along the chain. At any link in the sequence, the client could potentially have used a skill to interrupt the escalation and redirect toward a more effective response. Perhaps the client could have used Check the Facts when the initial interpretation of the prompting event set the chain in motion. Perhaps they could have used TIPP skills when physiological arousal began to escalate. Perhaps they could have used DEAR MAN when an interpersonal conflict intensified. By identifying these intervention points, the therapist and client can develop a specific, concrete plan for responding differently when similar chains begin to unfold in the future.</p>
<p>Third, chain analysis is followed by solution analysis, in which the therapist and client collaboratively generate and evaluate potential solutions for each link in the chain. Solutions may include skills training (teaching a specific skill the client lacked), cognitive modification (examining and restructuring problematic interpretations), exposure-based strategies (confronting avoided emotions or situations), contingency management (modifying the environmental reinforcement patterns that maintain the behavior), or environmental intervention (changing aspects of the client's situation that contribute to the problematic chain). The result is a detailed, individualized action plan that prepares the client for the next time they encounter a similar triggering event.</p>`,
    accessibility: { role: "article", ariaLabel: "Behavioral chain analysis and solution analysis" }
  }
],

// ═══ MODULE 4: Mindfulness (+1,300 words) ═══
"Core Skill Module: Mindfulness": [
  {
    type: "text",
    content: `<h3>Teaching Mindfulness to Clients: Practical Considerations</h3>
<p>While the conceptual framework of mindfulness skills may be straightforward—observe, describe, participate; non-judgmentally, one-mindfully, effectively—the actual process of teaching these skills to clients with severe emotional dysregulation requires considerable clinical skill and sensitivity. Many clients arrive in DBT with misconceptions about mindfulness that can create resistance before the teaching even begins. Some associate mindfulness with religious or spiritual practices and worry that it conflicts with their own beliefs. Others have heard that mindfulness is about "clearing the mind" and feel immediately discouraged because their minds are anything but clear. Still others have tried meditation apps or yoga classes and found that attempts at quiet contemplation actually increased their distress by bringing them into closer contact with painful thoughts and feelings they had been working hard to avoid.</p>
<p>The DBT therapist addresses these concerns directly and transparently. Mindfulness in DBT is explicitly secular—it is presented as a set of behavioral skills, not a spiritual practice. It does not require clearing the mind; it requires noticing what is already in the mind without adding layers of judgment and reactivity. And for clients who find that traditional meditation increases distress, DBT offers a wide range of mindfulness exercises that do not involve sitting still with eyes closed. Mindfulness can be practiced while walking, cooking, listening to music, petting an animal, washing dishes, or engaging in any activity that allows the person to bring deliberate, non-judgmental attention to their present-moment experience.</p>
<p>The therapist also calibrates the intensity and duration of mindfulness practice to the client's current capacity. For a client who has never practiced mindfulness and who becomes dysregulated when asked to sit quietly for even thirty seconds, the initial practice might be as brief as three conscious breaths—observing the physical sensation of air entering and leaving the body. For a client who already has some mindfulness experience, the practice might involve more extended exercises with greater emotional depth. The principle is always to stretch the client's capacity slightly beyond their current comfort zone without overwhelming them—building mastery incrementally, the way a physical therapist progressively increases the difficulty of exercises as the patient's strength improves.</p>
<p>Group skills training provides an ideal setting for mindfulness practice because it offers both the structure of guided instruction and the normalizing experience of practicing alongside peers. The standard DBT skills group begins each session with a brief mindfulness exercise, which serves the dual purpose of training the skill and creating a transition from the busyness of daily life into the focused, present-centered space of the group. Over the course of a treatment year, clients accumulate hundreds of brief mindfulness practice experiences, and the cumulative effect of this repeated practice is a gradually expanding capacity for present-moment awareness that begins to generalize beyond the group setting and into daily life.</p>`,
    accessibility: { role: "article", ariaLabel: "Teaching mindfulness to clients" }
  },
  {
    type: "accordion",
    accordionItems: [
      {
        title: "Common Obstacles in Mindfulness Practice",
        content: `<p>Several obstacles commonly arise during mindfulness practice that the DBT therapist should be prepared to address:</p>
<p><strong>Judgment About Judging:</strong> When clients begin practicing non-judgmental observation, they inevitably notice how frequently they judge. Many then judge themselves for judging: "I can't even do this without criticizing myself." The therapist normalizes this experience and explains that noticing judgment is itself a mindfulness skill—the very act of catching a judgment means the person was observing. The instruction is simply to notice the judgment, label it ("There's a judgment"), and return attention to the present moment without adding a second layer of judgment about having judged.</p>
<p><strong>Emotional Flooding:</strong> Some clients experience a surge of intense emotion when they slow down and pay attention to their internal experience. The feelings they have been avoiding through distraction, substances, or behavioral chaos rush in when the defenses come down. The therapist should anticipate this possibility and have a plan in place: the client can open their eyes, ground themselves by describing their physical surroundings, or shift to a more externally focused mindfulness exercise such as observing sounds or textures in the room.</p>
<p><strong>Dissociation:</strong> Clients with trauma histories may dissociate during mindfulness exercises, particularly those involving closing the eyes or focusing on body sensations. The therapist should offer the option of keeping eyes open with a soft downward gaze, and should use more active, movement-based mindfulness exercises for clients who are prone to dissociation. Mindful walking, mindful stretching, or even mindful hand-washing can be effective alternatives to seated meditation.</p>
<p><strong>Boredom and Restlessness:</strong> Clients may report that mindfulness practice is boring or that they cannot sit still long enough to practice. The therapist reframes boredom as an observable experience—"Notice boredom. Where do you feel it in your body? What does your mind want to do when it's bored?"—transforming the obstacle into the practice itself. Restlessness can be addressed by starting with very brief practices and gradually extending duration as the client's tolerance increases.</p>`
      }
    ],
    accessibility: { role: "region", ariaLabel: "Obstacles in mindfulness practice accordion" }
  }
],

// ═══ MODULE 5: Distress Tolerance (+1,300 words) ═══
"Core Skill Module: Distress Tolerance": [
  {
    type: "text",
    content: `<h3>Clinical Considerations for Teaching Distress Tolerance</h3>
<p>The distress tolerance skills present unique clinical challenges that distinguish them from the other DBT skill modules. Unlike emotion regulation skills, which aim to reduce emotional suffering over time, distress tolerance skills ask clients to do something that feels counterintuitive and even aversive: to accept and endure emotional pain without attempting to fix, escape, or numb it. For individuals who have spent years developing elaborate strategies for avoiding distress—strategies that may include substance use, self-harm, binge eating, dissociation, or compulsive behavioral patterns—the suggestion that they should instead tolerate the distress can feel not only unhelpful but actively threatening.</p>
<p>The DBT therapist approaches this challenge with both validation and strategic framing. The validation component acknowledges that the client's pain avoidance strategies make perfect sense given their history: "Of course you developed these ways of coping. When you were growing up, no one taught you any other way to manage the level of pain you were experiencing. You used what was available to you, and in many cases, those strategies kept you alive." The strategic framing component then introduces distress tolerance skills not as a replacement for the client's existing coping strategies but as additional options that carry fewer long-term costs: "I'm not asking you to give up the tools that have kept you alive. I'm asking you to add new tools to your toolbox—tools that work without creating additional problems."</p>
<p>Timing is also critical in the teaching of distress tolerance skills. These skills must be taught and practiced during periods of relative emotional stability, not during active crises. A client who is currently in acute emotional distress cannot effectively learn new skills—their cognitive resources are consumed by the crisis, and their emotional state makes new learning neurobiologically difficult. The skills training group provides a structured environment for learning and practicing distress tolerance skills when emotional intensity is manageable. The individual therapist then helps the client apply these previously practiced skills when crises arise. This sequence—learn during calm, apply during crisis—is essential to the effectiveness of distress tolerance training.</p>`,
    accessibility: { role: "article", ariaLabel: "Clinical considerations for distress tolerance" }
  },
  {
    type: "text",
    content: `<h3>The Relationship Between Distress Tolerance and Radical Acceptance</h3>
<p>Understanding the relationship between crisis survival skills and reality acceptance skills is important for both clinicians and clients. These two categories of distress tolerance skills operate at different levels and serve complementary functions. Crisis survival skills—TIPP, ACCEPTS, IMPROVE—are tactical interventions designed for the short term. They help the client get through the next hour, the next day, the next wave of intense emotion without engaging in self-destructive behavior. They are not meant to be used indefinitely; they are bridges that carry the client from the acute crisis to a place of sufficient emotional stability that higher-level coping becomes possible.</p>
<p>Reality acceptance skills—Radical Acceptance, Turning the Mind, Willingness—operate at a deeper, more strategic level. They address the client's relationship with painful realities that cannot be changed through any amount of crisis intervention. The death of a loved one, a chronic medical condition, a history of abuse, the end of a relationship, the consequences of past decisions—these are realities that no amount of TIPP skills or ACCEPTS distraction can alter. They require a fundamentally different kind of coping: the willingness to acknowledge what is true without adding the suffering of resistance and denial.</p>
<p>In clinical practice, clients often need to cycle between these two levels of distress tolerance. A client grieving a significant loss may use crisis survival skills to manage the acute waves of anguish that arise unpredictably throughout the day, while simultaneously working on the longer-term project of radically accepting the reality of the loss. Neither level of skill replaces the other; they work together as complementary layers of emotional resilience. The crisis survival skills provide immediate relief; the reality acceptance skills provide the foundation for long-term healing and adaptation.</p>
<p>Therapists should be attentive to clients who rely exclusively on one level while neglecting the other. A client who uses only crisis survival skills without developing reality acceptance may become trapped in an endless cycle of emotional fires that never fully resolve. A client who attempts to jump directly to radical acceptance without adequate crisis survival skills may become overwhelmed during acute episodes and revert to self-destructive coping. The most effective approach integrates both levels, with the balance shifting over time as the client's overall emotional resilience increases.</p>`,
    accessibility: { role: "article", ariaLabel: "Relationship between crisis survival and radical acceptance" }
  }
],

// ═══ MODULE 6: Emotion Regulation (+1,300 words) ═══
"Core Skill Module: Emotion Regulation": [
  {
    type: "text",
    content: `<h3>Understanding Emotions: Functions and Myths</h3>
<p>Before teaching specific emotion regulation skills, DBT devotes significant attention to psychoeducation about the nature and function of emotions. This educational component is clinically important because many clients with emotional dysregulation hold deeply ingrained beliefs about emotions that actively interfere with their ability to regulate effectively. These beliefs often originate in the invalidating environment described by biosocial theory and have been reinforced by years of experience in which emotional expression led to punishment, dismissal, or other negative consequences.</p>
<p>DBT identifies several common myths about emotions that clients frequently endorse and that the therapist must address directly. The first myth is that there is a right way to feel in every situation—that certain emotions are appropriate and others are not. This myth leads clients to judge their own emotional responses and to attempt to suppress emotions that they have been taught are unacceptable. The reality is that emotions are not right or wrong; they are signals that provide information about our relationship to our environment, and they can be more or less effective guides for action depending on whether they fit the current facts.</p>
<p>The second myth is that negative emotions are bad and destructive and should be eliminated. This myth drives the frantic efforts to escape emotional pain that characterize many of the problematic behaviors DBT seeks to address. The reality is that so-called negative emotions—anger, fear, sadness, shame, guilt—all serve important evolutionary functions. Anger signals that a boundary has been violated and motivates protective action. Fear signals danger and prepares the body to respond. Sadness signals loss and elicits support from the social environment. Shame signals that behavior has violated social norms and motivates repair. Even guilt, when proportional and accurate, serves the function of motivating reparative action after genuine wrongdoing. The goal of emotion regulation is not to eliminate these emotions but to ensure that they occur at appropriate intensities, in response to accurate assessments of the situation, and that they lead to effective rather than destructive behavioral responses.</p>
<p>The third myth is that letting others know that I am feeling bad is weakness. This myth is particularly prevalent in cultural contexts that value stoicism, self-sufficiency, or emotional restraint, and it can be especially damaging for male clients or clients from cultural backgrounds in which emotional expression is heavily stigmatized. The reality is that communicating emotional experience to others is a fundamental interpersonal skill that builds connection, elicits support, and allows for collaborative problem-solving. The skill lies not in whether to express emotion but in how to express it effectively—which is precisely what the interpersonal effectiveness module addresses.</p>`,
    accessibility: { role: "article", ariaLabel: "Understanding emotions: functions and myths" }
  },
  {
    type: "text",
    content: `<h3>The Importance of Emotional Awareness and Labeling</h3>
<p>A foundational skill within emotion regulation that bridges directly to the mindfulness module is the ability to accurately observe and describe emotional experiences. Many clients with emotional dysregulation have significant difficulty identifying what they are feeling at any given moment. Their emotional experience may present as an undifferentiated mass of distress—an overwhelming sense of "feeling bad" or "feeling terrible" that lacks the specificity needed for targeted intervention. This difficulty in emotional identification has been formally studied and is sometimes referred to as alexithymia, though in DBT it is understood not as a fixed trait but as a skill deficit that can be remediated through practice.</p>
<p>The clinical importance of emotional labeling cannot be overstated. Research by Matthew Lieberman and colleagues at UCLA has demonstrated that the simple act of putting a verbal label on an emotional experience—a process called affect labeling—produces measurable changes in brain activity. Specifically, affect labeling reduces activation in the amygdala (the brain's emotional alarm center) and increases activation in the right ventrolateral prefrontal cortex (a region associated with the processing of linguistic representations of emotion). In practical terms, naming your emotion literally makes it less intense. This finding provides a neurobiological mechanism for the clinical observation that clients who can accurately describe their emotional states are better able to regulate those states.</p>
<p>In DBT skills training, clients practice emotional identification using structured exercises that help them distinguish between related but distinct emotions. For example, clients learn to differentiate between anger and frustration, between sadness and disappointment, between fear and anxiety, between shame and guilt, and between jealousy and envy. Each of these emotional states has a different function, is triggered by different types of situations, produces different action urges, and calls for different regulatory strategies. A client who can identify that they are experiencing shame rather than guilt, for instance, can then apply the appropriate skill: if the shame does not fit the facts, Opposite Action involves sharing the experience rather than hiding; if guilt fits the facts, Problem Solving involves making reparation for the actual wrongdoing.</p>`,
    accessibility: { role: "article", ariaLabel: "Emotional awareness and labeling" }
  }
],

// ═══ MODULE 7: Interpersonal Effectiveness (+1,300 words) ═══
"Core Skill Module: Interpersonal Effectiveness": [
  {
    type: "text",
    content: `<h3>The Role of Validation in Interpersonal Effectiveness</h3>
<p>While validation appears as a component of the GIVE skills (the V in GIVE), its importance in interpersonal effectiveness extends far beyond any single acronym. Validation is one of the most powerful interpersonal tools available to human beings, and yet it is one of the least understood and least practiced. Linehan identifies six levels of validation, arranged in order of increasing depth and therapeutic impact, that clinicians can teach to clients as part of comprehensive interpersonal skills training.</p>
<p>The first level is being present—paying attention to the other person with your full awareness, demonstrating through your body language and engagement that you are genuinely here and listening. The second level is accurate reflection—restating or summarizing what the other person has communicated, without adding interpretation, to confirm that you have heard them correctly. The third level is mind-reading or articulating the unverbalized—putting into words what the other person seems to be feeling or experiencing but has not explicitly stated, based on contextual cues and empathic inference. The fourth level is validation in terms of past learning or biology—communicating that the person's response makes sense given their personal history, their temperament, or their current physiological state. The fifth level is validation in terms of present circumstances—acknowledging that the person's response is a normal and understandable reaction to their current situation, that most people would feel or react similarly given the same circumstances. The sixth and deepest level is radical genuineness—treating the other person as a competent, capable individual rather than as someone who is fragile, broken, or in need of special handling.</p>
<p>For clients, learning to validate others transforms their interpersonal interactions in profound ways. Many clients with histories of emotional dysregulation have internalized patterns of interpersonal engagement that are heavily weighted toward either aggressive pursuit of their own needs or passive abandonment of those needs in favor of maintaining the relationship at all costs. Validation provides a middle path: by communicating genuine understanding of the other person's perspective, the client creates a relational atmosphere in which both parties feel heard, which dramatically increases the likelihood that requests will be received favorably and conflicts will be resolved collaboratively rather than destructively.</p>
<p>Equally important is teaching clients to validate themselves. Self-validation—the practice of acknowledging and accepting one's own emotional experience without judgment or dismissal—is the internal counterpart of the validation that the DBT therapist provides in session. For individuals who grew up in invalidating environments, the internal voice is often harshly critical, dismissive of emotional experience, and relentlessly judgmental. Learning to replace this internal invalidation with self-validation is one of the most transformative outcomes of DBT treatment, though it is also one of the most challenging because the patterns of self-invalidation are deeply ingrained and often feel like the truth rather than a learned pattern.</p>`,
    accessibility: { role: "article", ariaLabel: "Role of validation in interpersonal effectiveness" }
  },
  {
    type: "text",
    content: `<h3>Interpersonal Effectiveness Across Cultural Contexts</h3>
<p>The interpersonal effectiveness skills as they are typically taught in DBT reflect certain assumptions about communication and relationships that are rooted in Western, individualistic cultural values. Assertiveness, direct communication, the explicit statement of personal needs, and the prioritization of individual boundaries are highly valued in many Western cultural contexts but may conflict with the communication norms of collectivist cultures, in which harmony, indirect communication, deference to authority, and the subordination of individual needs to group cohesion are prioritized. The culturally competent DBT therapist must be attentive to these differences and must adapt the teaching of interpersonal effectiveness skills accordingly.</p>
<p>This does not mean abandoning the skills altogether for clients from collectivist cultural backgrounds. Rather, it means helping clients apply the underlying principles—clarifying what you want, maintaining relationships, and preserving self-respect—within the communication framework that is appropriate to their cultural context. For example, a client from a culture in which direct assertiveness toward an elder would be considered deeply disrespectful might use DEAR MAN principles in a modified form: describing the situation indirectly through narrative rather than direct statement, expressing needs through implication rather than explicit assertion, and reinforcing the relationship through demonstrations of respect and filial devotion rather than through the direct statement of mutual benefit.</p>
<p>The skill of Effectiveness (from the mindfulness How skills) is particularly relevant here: doing what works in a given context, rather than rigidly adhering to a formula that was developed in a different cultural setting. The most effective interpersonal behavior is the behavior that achieves the client's goals within the constraints and norms of their actual social environment. Teaching clients to apply interpersonal effectiveness principles flexibly across different cultural and relational contexts is itself a valuable clinical skill that enhances the real-world utility of the training.</p>`,
    accessibility: { role: "article", ariaLabel: "Interpersonal effectiveness across cultural contexts" }
  }
],

// ═══ MODULE 8: Evidence Base (+2,100 words) ═══
"Evidence Base, Limitations, and Clinical Integration": [
  {
    type: "text",
    content: `<h3>Detailed Review of the Research Evidence</h3>
<p>The evidence base supporting Dialectical Behavior Therapy has grown substantially since Linehan published the first randomized controlled trial in 1991. That landmark study, which compared DBT to treatment as usual for chronically suicidal women with Borderline Personality Disorder, demonstrated that DBT significantly reduced the frequency and medical severity of parasuicidal acts, reduced psychiatric hospitalization days, improved treatment retention, and reduced emergency department visits compared to treatment as usual. This initial trial established DBT as the first psychotherapy to demonstrate efficacy for this notoriously difficult-to-treat population in a rigorous experimental design.</p>
<p>Subsequent replications and extensions of this initial finding have considerably strengthened the evidence base. Linehan and colleagues conducted a follow-up randomized controlled trial in 2006 comparing DBT to community treatment by experts—a much more rigorous comparison condition than treatment as usual, since it controlled for therapist expertise, treatment structure, and therapeutic attention. Even against this stringent comparison, DBT demonstrated superior outcomes in reducing suicide attempts and self-harm, reducing emergency department visits for suicidality, and reducing medical risk associated with self-injurious behavior. A component analysis published in 2015 further demonstrated that the full DBT treatment package was more effective than individual DBT sessions alone or DBT skills groups alone, supporting the theoretical rationale for comprehensive, multi-modal DBT.</p>
<p>Independent replications have been conducted by research groups with no direct affiliation with Linehan, strengthening the external validity of the findings. Verheul and colleagues in the Netherlands published a twelve-month randomized controlled trial demonstrating that DBT reduced self-harm, reduced treatment dropout, and was more effective than treatment as usual for women with BPD. McMain and colleagues in Canada conducted a large-scale randomized controlled trial comparing DBT to general psychiatric management and found both treatments to be equally effective across a range of outcomes, suggesting that structured, expert-delivered treatment may be the active ingredient rather than DBT-specific techniques alone. Feigenbaum and colleagues in the United Kingdom demonstrated that DBT was effective when implemented in a routine National Health Service clinical setting, providing evidence that the treatment can work outside the controlled conditions of a research trial.</p>`,
    accessibility: { role: "article", ariaLabel: "Detailed review of DBT research evidence" }
  },
  {
    type: "text",
    content: `<h3>Evidence for Non-BPD Applications</h3>
<p>While the evidence base for DBT in the treatment of Borderline Personality Disorder is robust, the application of DBT to other clinical populations represents a more heterogeneous and still-developing body of research. Several areas have accumulated promising evidence, though the strength of the findings varies considerably across populations and conditions.</p>
<p>In the treatment of eating disorders, Safer, Telch, and colleagues conducted randomized controlled trials demonstrating that DBT adapted for binge eating disorder and bulimia nervosa significantly reduced binge eating and purging episodes compared to wait-list control conditions. The theoretical rationale for DBT with eating disorders is compelling: many eating disorder behaviors function as emotion regulation strategies, and the skills taught in DBT—particularly distress tolerance and emotion regulation—directly target the emotional dysregulation that drives disordered eating. However, the evidence base for DBT with eating disorders remains smaller than for BPD, and more research is needed to establish whether DBT is superior to other evidence-based eating disorder treatments such as cognitive-behavioral therapy for eating disorders (CBT-E).</p>
<p>In the treatment of substance use disorders, Linehan and colleagues demonstrated that DBT adapted for individuals with BPD and co-occurring substance dependence reduced drug use and improved treatment retention compared to treatment as usual. Subsequent studies have explored DBT for substance use in the absence of BPD, with mixed but generally positive results. The emotion regulation and distress tolerance skills in DBT are theoretically well-suited to the treatment of addiction, as substance use often serves a distress tolerance function—a way of managing overwhelming emotions in the absence of more effective coping strategies.</p>
<p>Adaptations for adolescents (DBT-A) have shown particular promise. Rathus and Miller developed a modified version of DBT for suicidal adolescents that includes family involvement and a shortened treatment timeline, and preliminary studies have demonstrated reductions in suicidal ideation, self-harm, and psychiatric hospitalization. The addition of Walking the Middle Path as a fifth skill module in DBT-A addresses the dialectical tensions that are particularly salient in adolescent development and in parent-teen relationships. A large-scale randomized controlled trial published in 2014 by Mehlum and colleagues in Norway provided strong evidence for the efficacy of DBT-A, finding significant reductions in self-harm and suicidal ideation compared to enhanced usual care.</p>
<p>Other populations for which preliminary evidence exists include individuals with treatment-resistant depression (Feldman and colleagues found that a DBT-based skills group reduced depressive symptoms), post-traumatic stress disorder (Harned and colleagues developed a protocol integrating DBT with prolonged exposure for individuals with BPD and co-occurring PTSD), and older adults with personality disorders and chronic depression. A growing body of literature also examines the use of DBT skills as stand-alone interventions—skills groups offered without the full comprehensive DBT package—for transdiagnostic emotional dysregulation. Valentine and colleagues conducted a systematic review of stand-alone DBT skills training and found generally positive outcomes, though the authors noted significant variability in the quality of the research and the need for more rigorous controlled trials.</p>`,
    accessibility: { role: "article", ariaLabel: "Evidence for non-BPD applications of DBT" }
  },
  {
    type: "text",
    content: `<h3>Practical Strategies for Clinical Integration</h3>
<p>For clinicians who are not in a position to implement a full comprehensive DBT program—which is the reality for the majority of practicing therapists—the question of how to responsibly integrate DBT-informed strategies into existing practice is both practically important and ethically complex. The DBT community has engaged in considerable debate about the distinction between comprehensive DBT (adherent to the full treatment model as developed by Linehan) and DBT-informed practice (the selective use of DBT concepts and skills within a different therapeutic framework). Understanding this distinction is important for clinical integrity and for honest communication with clients about what you are offering.</p>
<p>If you are practicing DBT-informed therapy rather than comprehensive DBT, you should be transparent about this with your clients. Saying "I integrate some DBT skills into my work" is accurate and appropriate. Saying "I do DBT" when you are not providing all four modes of treatment (individual therapy, skills group, phone coaching, and consultation team) is misleading, even if unintentionally so. This distinction matters because clients who seek out DBT-specific treatment may have expectations about the structure and intensity of the treatment that a DBT-informed approach cannot meet.</p>
<p>That said, there are many ways to responsibly integrate DBT-informed strategies into diverse practice settings. Teaching specific DBT skills to individual clients—particularly mindfulness skills, distress tolerance skills, and the Check the Facts emotion regulation strategy—can be done within virtually any therapeutic framework. Using validation as a deliberate, structured therapeutic intervention (rather than simply as a component of empathic listening) can enhance the therapeutic alliance and reduce client dropout. Applying the dialectical framework to case conceptualization—holding the simultaneous truths of acceptance and change, understanding the client's behavior as both the problem and the client's best attempt at a solution—can deepen therapeutic understanding and guide intervention selection.</p>
<p>When integrating DBT skills into existing practice, consider focusing on the skills most relevant to your specific client population. If you work primarily with anxiety, the mindfulness and distress tolerance modules may be most immediately applicable. If your clients struggle with chronic interpersonal conflict, the interpersonal effectiveness skills may be the most valuable starting point. If emotion dysregulation is pervasive across your caseload, a thorough grounding in all four skill modules will serve you best. The key principle is that any integration of DBT-informed strategies should be grounded in a solid understanding of the theoretical rationale behind the skills, not merely a superficial adoption of techniques divorced from their conceptual context.</p>`,
    accessibility: { role: "article", ariaLabel: "Practical strategies for clinical integration" }
  }
],

// ═══ MODULE 9: Glossary (+1,400 words) ═══
"Glossary and Clinical Application Exercise": [
  {
    type: "text",
    content: `<h3>Clinical Application: Integrating Skills Across Modules</h3>
<p>One of the most important clinical competencies in DBT-informed practice is the ability to recognize which skill module and which specific skill within that module is most appropriate for a given clinical situation. In real-world clinical practice, client presentations rarely map neatly onto a single skill module. A client in crisis may need distress tolerance skills to get through the immediate moment, emotion regulation skills to address the underlying emotional pattern, interpersonal effectiveness skills to repair the relational damage caused by the crisis, and mindfulness skills to maintain awareness throughout the entire process. The skilled clinician must be able to assess the situation rapidly, determine which need is most pressing, and select the appropriate intervention—all while maintaining the dialectical balance between validation and change.</p>
<p>The clinical application exercise in this module is designed to develop exactly this competency. You will be presented with scenarios that require you to identify not just the relevant skill module but the specific skill within that module that best addresses the clinical need. In some cases, multiple skills from different modules may be appropriate, and you will need to consider which skill should be prioritized given the immediate circumstances.</p>
<p>As you work through the scenarios, consider the following decision framework: First, is the client in immediate crisis? If yes, distress tolerance skills (particularly TIPP for acute physiological distress and ACCEPTS or IMPROVE for managing the crisis period) take priority. Second, is the client safe but experiencing intense emotion? If yes, emotion regulation skills are indicated—beginning with Check the Facts to determine whether the emotion fits the situation, then moving to either Opposite Action or Problem Solving depending on the assessment. Third, is the client dealing with an interpersonal situation that requires effective communication? If yes, interpersonal effectiveness skills (DEAR MAN, GIVE, or FAST depending on the primary goal) are most relevant. And throughout all of these interventions, mindfulness skills provide the foundation—the capacity to observe, describe, and respond to the situation with awareness and intentionality rather than reactive automaticity.</p>`,
    accessibility: { role: "article", ariaLabel: "Clinical application: integrating skills across modules" }
  },
  {
    type: "accordion",
    accordionItems: [
      {
        title: "Advanced Clinical Decision-Making: When Skills Conflict",
        content: `<p>In complex clinical situations, different DBT skills may suggest different courses of action, and the clinician must use Wise Mind to determine which approach is most appropriate. Consider the following examples of skill conflicts and how they might be resolved:</p>
<p><strong>Radical Acceptance vs. Problem Solving:</strong> A client is in an emotionally abusive relationship. Should they radically accept the reality of the relationship as it is, or should they use Problem Solving to change the situation? The dialectical answer is both: the client can radically accept the current reality of the relationship (acknowledging what it actually is rather than what they wish it were) while simultaneously using Problem Solving to develop a plan for either improving the relationship or safely leaving it. Acceptance of the present moment does not preclude working toward a different future.</p>
<p><strong>DEAR MAN vs. GIVE:</strong> A client wants to confront their supervisor about an unfair work assignment (objective effectiveness) but fears that the confrontation will damage a relationship they value (relationship effectiveness). The resolution involves calibrating the intensity of assertion using the factors identified in the intensity scale, and potentially using DEAR MAN and GIVE skills simultaneously—being clear and assertive about the request while being gentle, interested, and validating in delivery.</p>
<p><strong>Opposite Action vs. Honoring the Emotion:</strong> A client feels intense anger after being disrespected by a colleague. Check the Facts suggests the anger fits the facts—the disrespect was real and significant. Does the client use Opposite Action (acting gently) or honor the anger through assertive Problem Solving? The answer depends on context: if expressing anger in this situation would be effective (the colleague is likely to respond to assertive feedback), Problem Solving is appropriate. If expressing anger would be counterproductive (the colleague is in a position of power and would retaliate), effectiveness suggests managing the anger internally while pursuing a more strategic approach.</p>
<p><strong>Distress Tolerance vs. Emotion Regulation:</strong> A client is experiencing intense sadness after a relationship breakup. Should they use distress tolerance skills to ride out the wave, or emotion regulation skills to change the emotion? In the acute phase, distress tolerance is primary—the goal is surviving the worst of the emotional storm without self-destructive behavior. As the acute phase subsides, emotion regulation skills become more relevant—using ABC PLEASE to maintain physical resilience, using Check the Facts to examine catastrophic interpretations about the future, and using the Wave Skill to observe the remaining sadness with acceptance rather than resistance.</p>`
      },
      {
        title: "Building a Personal DBT Skills Reference",
        content: `<p>As you complete this course and begin integrating DBT-informed strategies into your clinical practice, we recommend creating a personal skills reference that you can consult quickly during sessions. This reference should include:</p>
<p><strong>A one-page summary of each skill module</strong> with the key skills listed and brief descriptions of when each is most appropriate. Post this in your office where you can glance at it during sessions without it being visible to clients.</p>
<p><strong>A crisis protocol card</strong> that lists the steps for managing a client in acute crisis: (1) Assess safety, (2) Validate the pain, (3) Teach or prompt TIPP skills for immediate physiological regulation, (4) Use ACCEPTS or IMPROVE to get through the crisis period, (5) Once stable, conduct a brief chain analysis, (6) Develop a skills-based safety plan for the next crisis.</p>
<p><strong>A Check the Facts worksheet</strong> that you can walk through with clients when they present with intense emotional reactions: What is the prompting event? What are the observable facts? What are my interpretations? What is the evidence for and against my interpretation? What is the most accurate interpretation given all available evidence? Does my emotional response fit the facts?</p>
<p><strong>A list of validation responses</strong> at each of the six levels, with examples tailored to the types of clients you see most frequently. Having pre-prepared validation language available makes it easier to respond validatingly in the moment, particularly when you are tired, stressed, or caught off guard by a client's emotional intensity.</p>
<p><strong>A self-care and consultation reminder</strong> that reflects the DBT consultation team principle: "I am not the only person responsible for this client's progress. I need support, consultation, and ongoing professional development to do this work effectively. Seeking help is a strength, not a weakness."</p>`
      }
    ],
    accessibility: { role: "region", ariaLabel: "Advanced clinical decision-making accordion" }
  }
]

};

// ─── Apply expansions ────────────────────────────────────────
console.log('Expanding modules...\n');

for (const mod of course.modules) {
  const newBlocks = expansions[mod.title];
  if (!newBlocks) {
    console.log('  ' + mod.title + ': no expansion needed');
    continue;
  }

  // Insert new blocks BEFORE the last block (which is the summary)
  const blocks = mod.contentBlocks || [];
  const insertAt = Math.max(blocks.length - 1, 0);
  blocks.splice(insertAt, 0, ...newBlocks);
  mod.contentBlocks = blocks;

  // Count new words added
  let added = 0;
  for (const b of newBlocks) { added += cbw(b); }
  console.log('  ' + mod.title + ': +' + added + ' words (' + newBlocks.length + ' blocks)');
}

// ─── Save ────────────────────────────────────────────────────
console.log('\nSaving...');
const result = await col.replaceOne(
  { slug: 'dbt-skills-training-comprehensive' },
  course,
  { upsert: false }
);
console.log('Updated: ' + result.modifiedCount);

// ─── Final count ─────────────────────────────────────────────
console.log('\nFinal word counts:');
let total = 0;
for (const m of course.modules) {
  let mw = 0;
  (m.contentBlocks || []).forEach(b => { mw += cbw(b); });
  (m.lessons || []).forEach(l => { mw += sc(l.content); });
  console.log('  ' + m.title + ': ' + mw + ' words');
  total += mw;
}
console.log('\n  TOTAL: ' + total + ' / 36000 (' + Math.round(total/36000*100) + '%)');

await mongoose.disconnect();
console.log('Done');
