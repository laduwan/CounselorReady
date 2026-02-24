#!/usr/bin/env node
/**
 * seedDBT6hr_clean.js
 * ═══════════════════════════════════════════════════════════════
 * Dialectical Behavior Therapy: Foundations, Clinical Applications,
 * and Evidence-Based Integration
 * 
 * 6 CE Hours | CR-DBT-001 | ACEP Provider #7760 | GAITP LLC
 * ═══════════════════════════════════════════════════════════════
 *
 * CATALOG STATUS: ❌ FAIL
 * ─────────────────────────────────────────────────────────────
 *   Target:     36,000 words (6 CE × 6,000 words/CE)
 *   Current:    ~8,330 words (23%)
 *   Passing:    3 of 9 modules (modules at ≥70% of per-module target)
 *   Remaining:  6 modules require full content development
 *
 *   ✅ Module 1: Structure of Comprehensive DBT ............. 71%
 *   ✅ Module 2: Evidence Base, Limitations & Integration ... 77%
 *   ✅ Module 3: Glossary & Clinical Application Exercise ... 83%
 *   ─── REMOVED (below 70% threshold) ───
 *   🔴 Introduction and Course Overview .................... 14%  → needs full build
 *   🔴 Biosocial Theory and the Dialectical Worldview ...... 55%  → needs expansion
 *   🔴 Core Skill Module: Mindfulness ...................... stub → needs full build
 *   🔴 Core Skill Module: Distress Tolerance ............... 62%  → needs expansion
 *   🔴 Core Skill Module: Emotion Regulation ............... 69%  → needs expansion
 *   🔴 Core Skill Module: Interpersonal Effectiveness ...... 66%  → needs expansion
 *
 * WHAT THIS FILE SEEDS:
 *   - 3 production-ready modules with full interactive content
 *   - 20-question final assessment (80% pass, 3 attempts)
 *   - 31 APA references
 *   - Proper accessibility markup (WCAG AA)
 *   - Correct schema: modules[] → contentBlocks[] + lessons[]
 *
 * WHAT STILL NEEDS DEVELOPMENT:
 *   - 6 additional modules to reach 36,000-word ACEP target
 *   - Course introduction module
 *   - 4 core skill modules (Mindfulness, DT, ER, IE)
 *   - Biosocial theory module
 *   - Module ordering will shift when full course is assembled
 *
 * Run:      node src/scripts/seedDBT6hr_clean.js
 * Requires: MONGODB_URI in environment
 * Schema:   interactivecourses collection
 * ═══════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ─── Connection ──────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

const db = mongoose.connection.db;
const collection = db.collection('interactivecourses');


// ═══════════════════════════════════════════════════════════════
//  COURSE METADATA
// ═══════════════════════════════════════════════════════════════

const courseData = {
  title: "Dialectical Behavior Therapy: Foundations, Clinical Applications, and Evidence-Based Integration",
  slug: "dbt-skills-training-comprehensive",
  code: "CR-DBT-001",
  description: "This comprehensive 6-hour continuing education course provides mental health professionals with a thorough understanding of Dialectical Behavior Therapy (DBT). From its theoretical foundations in biosocial theory and dialectical philosophy to practical applications of the four core skill modules—Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness—this course equips clinicians with evidence-based strategies for working with clients who experience emotional dysregulation, self-destructive behaviors, and interpersonal difficulties.",
  ceHours: 6,
  credits: 6,
  category: "Clinical Practice",
  level: "Intermediate",
  contentArea: "Evidence-Based Treatment",
  targetAudience: [
    "Licensed Professional Counselors",
    "Licensed Clinical Social Workers",
    "Licensed Marriage and Family Therapists",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Counselors-in-Training"
  ],
  objectives: [
    "Articulate the theoretical foundations of DBT, including biosocial theory, dialectical philosophy, and the transaction model of emotion dysregulation",
    "Identify and describe the four core DBT skill modules—Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness",
    "Differentiate DBT from standard Cognitive Behavioral Therapy and identify clinical presentations where DBT is indicated",
    "Describe the four components of comprehensive DBT—individual therapy, group skills training, phone coaching, and consultation team",
    "Apply specific DBT techniques to common clinical scenarios in outpatient practice",
    "Evaluate the empirical evidence supporting DBT across multiple diagnostic categories",
    "Analyze limitations, criticisms, and cultural considerations related to DBT implementation"
  ],
  deliveryMethod: "online",
  status: "draft",
  isPublished: false,
  acepProvider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    number: "7760"
  },
  accessibility: {
    wcagLevel: "AA",
    screenReaderOptimized: true,
    keyboardNavigable: true,
    colorContrastCompliant: true,
    altTextProvided: true
  },


  // ═══════════════════════════════════════════════════════════
  //  MODULE 1: THE STRUCTURE OF COMPREHENSIVE DBT
  //  Word count: ~2,561 | 71% of per-module target
  //  11 interactive content blocks
  // ═══════════════════════════════════════════════════════════

  modules: [
    {
      title: "The Structure of Comprehensive DBT",
      order: 1,
      lessons: [
        {
          title: "A Multi-Modal Treatment System",
          content: "This module examines the four components of comprehensive DBT: individual therapy, group skills training, phone coaching, and the therapist consultation team. You will learn the treatment target hierarchy, the function of diary cards and behavioral chain analysis, and the key structural differences between DBT and standard CBT.",
          order: 1
        }
      ],
      contentBlocks: [

        // ─── Section Divider ───────────────────────────────
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "The Structure of Comprehensive DBT",
          subtitle: "Four Components Working Together to Create a Complete Treatment System",
          accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 1: The Structure of Comprehensive DBT" }
        },

        // ─── Text: Overview ────────────────────────────────
        {
          type: "text",
          content: `<h3>A Multi-Modal Treatment System</h3>
<p>Comprehensive DBT is not a single intervention; it is an integrated treatment system composed of four distinct but interdependent components. Each component serves a specific therapeutic function, and the model was designed so that the components work together synergistically to address the complex needs of clients with pervasive emotion dysregulation. Understanding the role of each component is essential even for clinicians who plan to implement only DBT-informed interventions, because it illuminates the therapeutic logic behind the full model and helps clinicians identify which elements may be most beneficial for their specific practice contexts.</p>
<p>Standard comprehensive DBT was originally designed as a one-year outpatient treatment program, though the duration may be extended based on clinical need. During this year, clients typically attend weekly individual therapy sessions (approximately 50–60 minutes), weekly group skills training sessions (approximately 2–2.5 hours), and have access to between-session phone coaching with their individual therapist. Simultaneously, therapists participate in a weekly consultation team meeting. This level of treatment intensity reflects Linehan's recognition that clients with severe emotion dysregulation need more than a single weekly therapy hour to acquire, practice, and generalize new behavioral skills.</p>`,
          accessibility: { role: "article", ariaLabel: "Overview of comprehensive DBT structure" }
        },

        // ─── Text: Component 1 — Individual Therapy ────────
        {
          type: "text",
          content: `<h3>Component 1: Individual Therapy</h3>
<p>Individual therapy is the primary arena for applying DBT skills to the specific problems in a client's life. Unlike some therapeutic approaches where the content of sessions is driven primarily by what the client wants to discuss, DBT individual therapy follows a structured hierarchy of treatment targets. This hierarchy ensures that the most dangerous and life-threatening behaviors are addressed first, followed by therapy-interfering behaviors, followed by quality-of-life-interfering behaviors, and finally by the acquisition of behavioral skills.</p>
<p>The treatment target hierarchy in standard DBT is organized as follows. The first priority is always life-threatening behaviors, including suicidal ideation, suicide attempts, self-harm, and homicidal ideation or behavior. If a client has engaged in or is at imminent risk of life-threatening behavior, this becomes the focus of the session regardless of what other issues the client or therapist might prefer to discuss. The second priority is therapy-interfering behaviors—actions by either the client or the therapist that undermine the therapeutic process. For the client, this might include missing sessions, coming late, not completing homework assignments, or behaving in ways that push the therapist toward burnout. For the therapist, this might include being late, being unprepared, or failing to return phone calls. The third priority is quality-of-life-interfering behaviors, such as substance use, financial mismanagement, unsafe sexual behavior, housing instability, or other patterns that prevent the client from building a life worth living. The fourth priority is increasing behavioral skills—helping the client apply the skills learned in group training to their daily life.</p>
<p>Within each session, the DBT individual therapist uses a structured tool called the diary card to identify which treatment targets are active. The diary card is a daily self-monitoring form that clients complete between sessions, tracking emotions, urges (including urges to self-harm or use substances), specific target behaviors, and use of DBT skills. Reviewing the diary card at the beginning of each session allows the therapist and client to quickly identify the highest-priority targets and ensures that treatment stays focused and goal-directed rather than drifting into less critical material.</p>
<p>A core skill of the DBT individual therapist is behavioral chain analysis—a detailed, step-by-step examination of the sequence of events, thoughts, emotions, and behaviors that led to a specific problem behavior. Chain analysis is not interrogation; it is a collaborative investigation conducted with validation and curiosity. The therapist and client trace the chain from the prompting event through vulnerability factors, links in the chain, the problem behavior itself, and the consequences. The goal is to identify points in the chain where a different skill or behavioral response could have changed the outcome.</p>`,
          accessibility: { role: "article", ariaLabel: "Component 1: Individual Therapy in DBT" }
        },

        // ─── Text: Component 2 — Group Skills Training ─────
        {
          type: "text",
          content: `<h3>Component 2: Group Skills Training</h3>
<p>Group skills training is the educational component of DBT. It functions more like a class than traditional group therapy. The skills training group is typically led by two co-facilitators and meets weekly for approximately 2 to 2.5 hours. Over the course of the treatment year, the group cycles through the four core skill modules: Mindfulness (taught at the beginning of each module cycle), Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness.</p>
<p>The distinction between skills training and group therapy is important. In traditional group therapy, members process emotions, share experiences, provide feedback to one another, and develop interpersonal insight through group dynamics. In DBT skills training, the primary focus is on teaching specific behavioral skills through instruction, modeling, role-play, and homework assignments. While group leaders certainly create a validating and supportive atmosphere, the group is not designed as a space for extensive processing of individual members' personal crises. If a group member is in crisis, the group leaders will briefly validate and redirect, encouraging the member to address the crisis with their individual therapist.</p>
<p>Each skill module is structured with clear learning objectives, practice exercises, and between-session homework assignments. Homework is a critical component of skills training because behavioral skills cannot be learned through instruction alone—they must be practiced in real-world contexts. Group members are expected to practice assigned skills between sessions and report on their practice at the beginning of the next group meeting.</p>`,
          accessibility: { role: "article", ariaLabel: "Component 2: Group Skills Training" }
        },

        // ─── Text: Components 3 & 4 ───────────────────────
        {
          type: "text",
          content: `<h3>Component 3: Phone Coaching</h3>
<p>Phone coaching is perhaps the most misunderstood component of comprehensive DBT. It is not crisis counseling, and it is not between-session therapy. Phone coaching is a brief, focused intervention designed to help clients apply DBT skills in the moment when they need them most—during real-life situations that trigger urges toward self-destructive behavior or emotional overwhelm.</p>
<p>The purpose of phone coaching is skills generalization. A typical phone coaching call lasts 5 to 15 minutes and follows a structured format: the client describes the situation, the therapist helps the client identify which skill to use, the client practices or commits to practicing the skill, and the call ends.</p>
<p>An important clinical rule in DBT phone coaching is the 24-hour rule: if a client has engaged in self-harm or other target behaviors, they must wait 24 hours before contacting the therapist for phone coaching. This rule exists to avoid inadvertently reinforcing self-destructive behavior with therapeutic attention. The rule does not apply to genuine suicidal crises, which always warrant immediate contact.</p>
<h3>Component 4: Therapist Consultation Team</h3>
<p>The therapist consultation team is often the least discussed but arguably the most innovative component of comprehensive DBT. It is the component that treats the therapist, not the client. Linehan recognized early in her work that treating chronically suicidal, emotionally intense, and interpersonally demanding clients takes an enormous toll on therapists. Without systematic support, clinicians working with this population are at high risk for burnout, compassion fatigue, loss of therapeutic effectiveness, and ultimately dropping out of the work altogether.</p>
<p>The consultation team meets weekly, typically for one to two hours, and consists of all therapists within a DBT program. It provides clinical case consultation, emotional support, fidelity monitoring, and burnout prevention. The team operates under agreements that mirror the dialectical stance: accept a dialectical philosophy, maintain a nonjudgmental stance, adopt the agreement that all members are doing the best they can and simultaneously need to do better, and search for the grain of truth in each perspective.</p>`,
          accessibility: { role: "article", ariaLabel: "Components 3 and 4: Phone Coaching and Consultation Team" }
        },

        // ─── Accordion: DBT vs. CBT ───────────────────────
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Philosophical Foundation",
              content: "CBT is grounded in the cognitive model, which proposes that distorted or maladaptive thinking patterns are the primary driver of emotional distress and problematic behavior. The therapeutic focus is on identifying, challenging, and restructuring these cognitive distortions. DBT incorporates cognitive-behavioral techniques but is additionally grounded in dialectical philosophy and Zen Buddhist practices (particularly mindfulness). The addition of dialectics means that DBT explicitly balances change strategies (from CBT) with acceptance strategies (validation, mindfulness, radical acceptance), creating a more nuanced therapeutic stance for clients who feel alienated by a purely change-focused approach."
            },
            {
              title: "Treatment Structure",
              content: "Standard CBT is typically conducted in individual sessions, often following a structured protocol over a time-limited course (12–20 sessions for many presentations). DBT is a multi-modal treatment requiring four concurrent components: individual therapy, group skills training, phone coaching, and a therapist consultation team. Comprehensive DBT typically lasts one year, reflecting the complexity of the presentations it targets. This structural difference makes DBT more resource-intensive to implement but also more comprehensive in addressing the multiple domains of dysfunction that characterize severe emotion dysregulation."
            },
            {
              title: "Therapeutic Relationship",
              content: "While CBT values the therapeutic alliance, it is generally viewed as a vehicle for delivering cognitive and behavioral interventions. In DBT, the therapeutic relationship itself is considered a primary mechanism of change. DBT therapists are trained to use the relationship strategically—balancing validation with challenge, using reciprocal self-disclosure judiciously, and managing the reinforcement contingencies within the relationship (such as the 24-hour rule). The therapist functions as an ally and coach, not a detached expert."
            },
            {
              title: "Between-Session Contact",
              content: "CBT does not typically include between-session phone coaching. If clients contact their CBT therapist between sessions, the interaction is usually brief and administrative. In DBT, phone coaching is a built-in, expected component of treatment with explicit guidelines for its use. This availability reflects DBT's recognition that clients with severe dysregulation need in-the-moment support to apply skills during real-life crises—not just weekly retrospective analysis of what happened."
            },
            {
              title: "Therapist Support",
              content: "CBT does not mandate a therapist consultation team. Clinicians may seek supervision or peer consultation individually, but it is not a structural requirement of the treatment model. In DBT, the consultation team is a non-negotiable component. The team is considered therapy for the therapist, providing ongoing support, accountability, and skill development. This structural commitment to therapist welfare is one of DBT's most distinctive features."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable comparison: DBT versus CBT" }
        },

        // ─── Knowledge Check 1 ─────────────────────────────
        {
          type: "multipleChoice",
          question: "What is the primary purpose of phone coaching in comprehensive DBT?",
          options: [
            { text: "To provide between-session crisis counseling and emotional processing", isCorrect: false },
            { text: "To help clients apply DBT skills in real-time during situations that trigger urges toward self-destructive behavior", isCorrect: true },
            { text: "To allow the therapist to monitor the client's safety between weekly sessions", isCorrect: false },
            { text: "To replace group skills training for clients who cannot attend groups", isCorrect: false }
          ],
          explanation: "Phone coaching serves the specific function of skills generalization—helping clients apply skills they have learned in group training to real-life situations in the moment they need them. It is not crisis counseling, between-session therapy, or a substitute for any other component. Calls are typically brief (5–15 minutes) and focused on identifying and implementing a specific skill.",
          accessibility: { role: "group", ariaLabel: "Knowledge check: Phone coaching purpose" }
        },

        // ─── Knowledge Check 2 ─────────────────────────────
        {
          type: "multipleChoice",
          question: "In the DBT treatment target hierarchy, what is always the first priority in individual therapy sessions?",
          options: [
            { text: "Increasing behavioral skills", isCorrect: false },
            { text: "Quality-of-life-interfering behaviors", isCorrect: false },
            { text: "Life-threatening behaviors", isCorrect: true },
            { text: "Therapy-interfering behaviors", isCorrect: false }
          ],
          explanation: "The treatment target hierarchy in DBT is: (1) life-threatening behaviors, (2) therapy-interfering behaviors, (3) quality-of-life-interfering behaviors, and (4) increasing behavioral skills. Life-threatening behaviors always take priority regardless of other concerns.",
          accessibility: { role: "group", ariaLabel: "Knowledge check: Treatment target hierarchy" }
        },

        // ─── Knowledge Check 3 ─────────────────────────────
        {
          type: "multipleChoice",
          question: "What is the primary function of the therapist consultation team in DBT?",
          options: [
            { text: "To review client records and ensure documentation compliance", isCorrect: false },
            { text: "To assign new clients to appropriate therapists within the program", isCorrect: false },
            { text: "To support therapist effectiveness, prevent burnout, and maintain treatment fidelity through clinical consultation and mutual accountability", isCorrect: true },
            { text: "To evaluate client progress and make decisions about discharge readiness", isCorrect: false }
          ],
          explanation: "The consultation team is 'therapy for the therapist.' Its primary functions are to provide clinical case consultation, offer emotional support, maintain model fidelity, and prevent therapist burnout. Working with chronically suicidal and emotionally intense clients is demanding, and the consultation team ensures therapists have systematic professional support.",
          accessibility: { role: "group", ariaLabel: "Knowledge check: Consultation team function" }
        },

        // ─── Matching: Components → Functions ──────────────
        {
          type: "matching",
          matchingInstructions: "Match each DBT component with its primary therapeutic function.",
          matchingPairs: [
            { term: "Individual Therapy", definition: "Applying skills to specific problems using a structured treatment target hierarchy" },
            { term: "Group Skills Training", definition: "Teaching the four core skill modules through instruction, modeling, and practice" },
            { term: "Phone Coaching", definition: "Brief real-time support to help clients use skills during actual crises" },
            { term: "Therapist Consultation Team", definition: "Supporting therapist effectiveness, preventing burnout, and maintaining model fidelity" }
          ],
          accessibility: { role: "group", ariaLabel: "Matching exercise: DBT components and their functions" }
        },

        // ─── Reflection ────────────────────────────────────
        {
          type: "reflection",
          question: "Consider your current practice setting. Which of the four components of comprehensive DBT would be most feasible for you to implement? Which would face the greatest barriers? If you could only integrate one component into your existing practice, which would you choose and why? Think about how you might adapt DBT principles to work within your current professional constraints while still honoring the therapeutic logic of the model.",
          minLength: 50,
          accessibility: { role: "textbox", ariaLabel: "Reflection: DBT components in your practice" }
        },

        // ─── Section Summary ───────────────────────────────
        {
          type: "text",
          content: `<h3>Module Summary</h3>
<p>In this module, you examined the four components of comprehensive DBT and the specific therapeutic function each one serves. Individual therapy provides a structured, hierarchy-driven space for applying skills to personal targets. Group skills training teaches the four core skill modules through an educational format. Phone coaching bridges the gap between learning skills and applying them in real-world crises. The therapist consultation team sustains the effectiveness and well-being of the professionals delivering treatment. You also explored key differences between DBT and standard CBT, deepening your understanding of when and why a DBT-informed approach may be clinically indicated.</p>`,
          accessibility: { role: "article", ariaLabel: "Module 1 summary" }
        }
      ]
    },


    // ═══════════════════════════════════════════════════════════
    //  MODULE 2: EVIDENCE BASE, LIMITATIONS, AND INTEGRATION
    //  Word count: ~2,767 | 77% of per-module target
    //  9 interactive content blocks
    // ═══════════════════════════════════════════════════════════

    {
      title: "Evidence Base, Limitations, and Clinical Integration",
      order: 2,
      lessons: [
        {
          title: "Research Evidence and Clinical Practice",
          content: "This module evaluates the empirical evidence supporting DBT across multiple diagnostic categories, examines seven recognized limitations and criticisms, and provides practical strategies for integrating DBT-informed skills into existing practice.",
          order: 1
        }
      ],
      contentBlocks: [

        // ─── Section Divider ───────────────────────────────
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Evidence Base, Limitations, and Clinical Integration",
          subtitle: "A Balanced, Evidence-Informed Perspective on DBT in Contemporary Practice",
          accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 2: Evidence Base, Limitations, and Clinical Integration" }
        },

        // ─── Text: Evidence Base ───────────────────────────
        {
          type: "text",
          content: `<h3>The Evidence Base for DBT</h3>
<p>DBT is among the most extensively researched psychotherapeutic approaches in the mental health field. Over three decades of research have produced a substantial body of evidence supporting its efficacy across multiple clinical populations and treatment settings. As clinicians committed to evidence-based practice, it is essential to understand both the strengths and the boundaries of this evidence.</p>
<p>The strongest evidence for DBT exists in the treatment of Borderline Personality Disorder. Multiple randomized controlled trials (RCTs) have demonstrated that DBT, compared to treatment as usual, significantly reduces the frequency and severity of self-harm and suicide attempts, decreases psychiatric hospitalizations, reduces treatment dropout rates, decreases depression and hopelessness, and improves overall social and global functioning. Linehan's original 1991 RCT, along with subsequent replications by independent research groups (Verheul et al., 2003; Linehan et al., 2006; McMain et al., 2009), established DBT as the gold standard treatment for BPD with chronic suicidality.</p>
<p>Beyond BPD, DBT has accumulated promising evidence for the treatment of several other conditions. DBT has been adapted for eating disorders (DBT-ED), with research showing reductions in binge eating, purging, and restrictive eating behaviors. Adaptations for substance use disorders (DBT-SUD) have demonstrated reductions in substance use when combined with standard substance abuse treatment. Research on DBT for depression, including treatment-resistant depression, has shown improvements in depressive symptoms and emotion regulation capacity. Studies on DBT for PTSD have been conducted, often integrating prolonged exposure within the DBT framework (DBT-PE). Preliminary evidence also supports DBT adaptations for adolescents (DBT-A), older adults, individuals with ADHD, and clients with intellectual disabilities.</p>
<p>The evidence is more mixed, however, when examining whether the full comprehensive DBT model is necessary or whether individual components can produce comparable outcomes. A significant study by Linehan and colleagues (2015) found that DBT skills training without individual DBT therapy produced comparable reductions in suicidal ideation, depression, and anxiety compared to full DBT, though full DBT was superior in reducing self-harm. This finding suggests that skills training may be the most active ingredient in DBT and that full comprehensive DBT may not be necessary for all clinical presentations.</p>`,
          accessibility: { role: "article", ariaLabel: "The evidence base for DBT" }
        },

        // ─── Accordion: Limitations ────────────────────────
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Resource Intensity and Access Barriers",
              content: "Perhaps the most significant practical limitation of DBT is its resource intensity. Comprehensive DBT requires individual therapy, group skills training, phone coaching, and a weekly consultation team—a level of commitment that demands significant time, staffing, and organizational infrastructure. Many community mental health centers, rural practices, and under-resourced settings simply cannot provide full comprehensive DBT. The training required to deliver DBT with fidelity is extensive and expensive; Behavioral Tech, LLC offers intensive training programs that can cost thousands of dollars per clinician. This creates a significant equity issue: clients who most need DBT are often served by the systems least able to afford implementation."
            },
            {
              title: "Cultural Limitations and Diversity Concerns",
              content: "DBT was developed primarily within a Western, predominantly White cultural context, and some of its core concepts may require thoughtful adaptation for clients from diverse cultural backgrounds. The concept of radical acceptance, for example, may be experienced very differently by a middle-class White client dealing with a personal loss than by a client of color navigating systemic racism. For the latter, telling them to 'radically accept' their circumstances without addressing the systemic injustice can feel invalidating. Similarly, the DEAR MAN assertiveness framework presupposes a cultural context where direct communication is valued, which may conflict with cultural norms that prioritize indirect communication, collective harmony, or deference to authority."
            },
            {
              title: "Research Sample Diversity",
              content: "The majority of DBT research has been conducted with predominantly White, middle-class, cisgender female participants. While some studies have included more diverse samples, the overall evidence base does not yet adequately represent the full range of racial, ethnic, socioeconomic, gender, and cultural diversity present in clinical populations. This limits the generalizability of findings and raises legitimate questions about whether adaptations are needed for populations underrepresented in the research."
            },
            {
              title: "Evidence Beyond BPD",
              content: "While DBT adaptations for eating disorders, substance use, depression, and PTSD show promise, the evidence base for these applications is substantially less mature than for BPD. Many studies involve small samples, lack active control conditions, or have been conducted primarily by researchers with significant ties to the DBT model. Clinicians should be cautious about overstating the evidence when using DBT with populations other than BPD, particularly when other evidence-based treatments with stronger empirical support exist for those conditions."
            },
            {
              title: "Fidelity Drift and the 'DBT-Informed' Label",
              content: "The term 'DBT-informed' has become so broad as to be nearly meaningless. Clinicians may use this label while implementing only occasional mindfulness exercises or teaching one or two distress tolerance skills, without the structured components, target hierarchy, diary cards, or behavioral chain analysis that define the model. This fidelity drift creates confusion for clients, referral sources, and researchers, and may undermine the reputation of DBT as an evidence-based treatment."
            },
            {
              title: "Diagnostic Stigma",
              content: "Because DBT is most strongly associated with BPD—a diagnosis that carries significant stigma—referring a client for DBT can itself be experienced as a form of labeling. Some clinicians report that clients resist DBT referrals because they associate the treatment with a diagnosis they find stigmatizing. This is particularly problematic given the growing evidence that DBT skills are effective transdiagnostically."
            },
            {
              title: "Client Burden and Therapist Sustainability",
              content: "Comprehensive DBT asks a great deal of clients: weekly individual therapy, weekly group, daily diary cards, between-session homework, and the expectation of calling for phone coaching. For clients whose lives are already chaotic—which describes many of the clients DBT is designed to serve—these demands can become another source of failure and shame. On the therapist side, the expectation of phone coaching availability raises boundaries and sustainability concerns, particularly for therapists in solo or small practices."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable panels: Limitations and criticisms of DBT" }
        },

        // ─── Text: Integration Strategies ──────────────────
        {
          type: "text",
          content: `<h3>Integrating DBT-Informed Strategies Into Your Practice</h3>
<p>Given the limitations described above, many clinicians will choose to integrate specific DBT strategies into their existing practice rather than implementing the full comprehensive model. This is a legitimate and often appropriate clinical decision, provided it is done thoughtfully, transparently, and with awareness of the distinction between comprehensive DBT and DBT-informed practice.</p>
<p>When integrating DBT-informed strategies, consider focusing on the skills most relevant to your client population. If you work primarily with anxiety, the mindfulness and distress tolerance modules may be most immediately applicable. If your clients struggle with chronic interpersonal conflict, the interpersonal effectiveness skills may be the most valuable starting point. If emotion dysregulation is pervasive, a thorough grounding in all four modules will serve you best.</p>
<p>Practical steps for integration include: incorporating diary cards or simplified mood tracking tools into your practice; teaching TIPP skills as a first-line intervention for clients in acute distress; using the Check the Facts and Opposite Action framework to enhance cognitive-behavioral work; introducing radical acceptance language for clients struggling with grief, loss, or unchangeable circumstances; using DEAR MAN role-plays to prepare clients for difficult interpersonal conversations; and adopting the dialectical stance of balancing validation with change in all therapeutic interactions.</p>
<p>Remember that the dialectical stance is perhaps the most universally applicable element of DBT. Regardless of your primary therapeutic orientation, the practice of simultaneously validating your client's experience while encouraging meaningful change is a clinical skill that enhances the effectiveness of any therapeutic approach.</p>`,
          accessibility: { role: "article", ariaLabel: "Integration strategies for DBT-informed practice" }
        },

        // ─── Knowledge Check 1 ─────────────────────────────
        {
          type: "multipleChoice",
          question: "Which criticism addresses the concern that DBT's concept of radical acceptance may be problematic for individuals facing systemic oppression?",
          options: [
            { text: "Resource intensity and access barriers", isCorrect: false },
            { text: "Cultural limitations, specifically that radical acceptance may unintentionally pathologize righteous anger or dismiss legitimate grievances against structural injustice", isCorrect: true },
            { text: "Fidelity drift in clinical practice", isCorrect: false },
            { text: "The burden placed on clients by comprehensive DBT's schedule demands", isCorrect: false }
          ],
          explanation: "This is a cultural limitation of DBT. The concept of radical acceptance, while therapeutically powerful, has been criticized for potentially being experienced differently by individuals from marginalized communities facing systemic racism, poverty, or structural violence. Culturally responsive DBT practice requires nuanced application that distinguishes between unchangeable personal circumstances and changeable systemic conditions.",
          accessibility: { role: "group", ariaLabel: "Knowledge check: Cultural limitation of DBT" }
        },

        // ─── Knowledge Check 2 ─────────────────────────────
        {
          type: "multipleChoice",
          question: "A clinician describes their practice as 'DBT-informed' but only occasionally teaches mindfulness skills and does not use diary cards, behavioral chain analysis, or group skills training. What limitation does this example illustrate?",
          options: [
            { text: "Therapist burden and sustainability", isCorrect: false },
            { text: "Fidelity drift and the ambiguity of the 'DBT-informed' label", isCorrect: true },
            { text: "Client burden from comprehensive DBT demands", isCorrect: false },
            { text: "Overreliance on BPD as the primary evidence base", isCorrect: false }
          ],
          explanation: "This example illustrates fidelity drift—the tendency for clinicians to use the DBT label while omitting core components. The 'DBT-informed' label has no standardized definition, allowing widely varying practices to be marketed under the same name. Clinicians have an ethical obligation to be transparent about what they are actually providing.",
          accessibility: { role: "group", ariaLabel: "Knowledge check: Fidelity drift" }
        },

        // ─── Knowledge Check 3 (Multi-Select) ─────────────
        {
          type: "multiSelect",
          question: "Which of the following are recognized limitations or criticisms of DBT? (Select all that apply)",
          options: [
            { text: "The resource intensity of comprehensive DBT creates access barriers, particularly for under-resourced settings", isCorrect: true },
            { text: "DBT has no evidence supporting its use with any clinical population", isCorrect: false },
            { text: "The majority of DBT research has been conducted with predominantly White, middle-class, female participants", isCorrect: true },
            { text: "Evidence for DBT in conditions beyond BPD is less mature than commonly perceived", isCorrect: true },
            { text: "The demands of comprehensive DBT can function as access barriers for clients with chaotic lives", isCorrect: true },
            { text: "DBT's mindfulness component has been definitively proven ineffective", isCorrect: false }
          ],
          explanation: "All four correct options represent recognized limitations that the field has identified. DBT does have strong evidence for BPD (not 'no evidence'), and its mindfulness component has not been proven ineffective. Responsible clinical practice requires understanding both the strengths and the limitations of the approaches we use.",
          accessibility: { role: "group", ariaLabel: "Knowledge check: Recognized limitations of DBT" }
        },

        // ─── Reflection ────────────────────────────────────
        {
          type: "reflection",
          question: "Having reviewed the evidence base and limitations of DBT, develop a preliminary plan for how you will integrate DBT-informed strategies into your current clinical practice. Identify specific DBT skills or principles you plan to use, the client population or presenting concerns they will be most relevant for, any modifications you may need to make for your specific setting or cultural context, and how you will be transparent with clients about the level of DBT you are providing. What is one concrete step you will take within the next two weeks to begin this integration?",
          minLength: 75,
          accessibility: { role: "textbox", ariaLabel: "Reflection: Your DBT integration plan" }
        },

        // ─── Resources ─────────────────────────────────────
        {
          type: "resources",
          resources: [
            { title: "DBT Skills Training Manual, Second Edition (Linehan, 2015)", url: "#", type: "reference" },
            { title: "Cognitive-Behavioral Treatment of Borderline Personality Disorder (Linehan, 1993)", url: "#", type: "reference" },
            { title: "Dialectical Behavior Therapy: Current Indications and Unique Elements (Chapman, 2006)", url: "#", type: "reference" },
            { title: "Behavioral Tech, LLC — Official DBT Training Organization", url: "https://behavioraltech.org", type: "website" },
            { title: "DBT-Linehan Board of Certification", url: "https://dbt-lbc.org", type: "website" }
          ],
          accessibility: { role: "list", ariaLabel: "Additional resources for further study" }
        },

        // ─── Module Summary ────────────────────────────────
        {
          type: "text",
          content: `<h3>Module Summary and Course Conclusion</h3>
<p>In this module, you examined the evidence base supporting DBT across multiple clinical populations, with particular attention to the distinction between robust evidence for BPD and more preliminary evidence for other conditions. You engaged with seven specific limitations and criticisms of DBT, including resource intensity, cultural limitations, sample diversity concerns, fidelity drift, diagnostic stigma, client burden, and therapist sustainability. You also explored practical strategies for integrating DBT-informed skills into your existing practice.</p>
<p>As you move forward, remember that the most fundamental contribution of DBT to the mental health field may not be any single technique or skill module, but rather the dialectical stance itself: the simultaneous embrace of acceptance and change, the refusal to choose between validating your client's pain and pushing for meaningful behavioral progress.</p>
<p>You are now prepared to proceed to the final assessment. The assessment consists of 20 questions covering material from all course modules. A score of 80% or higher is required to pass, and you have up to 3 attempts. Upon passing, you will complete the required course evaluation and attestation before receiving your certificate of completion.</p>`,
          accessibility: { role: "article", ariaLabel: "Module 2 summary and course conclusion" }
        }
      ]
    },


    // ═══════════════════════════════════════════════════════════
    //  MODULE 3: GLOSSARY AND CLINICAL APPLICATION EXERCISE
    //  Word count: ~3,002 | 83% of per-module target
    //  9 interactive content blocks (including 35-term glossary
    //  and 12 scenario-based matching exercises)
    // ═══════════════════════════════════════════════════════════

    {
      title: "Glossary and Clinical Application Exercise",
      order: 3,
      lessons: [
        {
          title: "Key Terms and Scenario-Based Skill Matching",
          content: "This module provides a comprehensive 35-term DBT glossary and a 12-scenario clinical application exercise. Review all key terms and match DBT skills to real-world clinical presentations across all four skill modules.",
          order: 1
        }
      ],
      contentBlocks: [

        // ─── Section Divider ───────────────────────────────
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: "Glossary and Clinical Application Exercise",
          subtitle: "Key Terms and Scenario-Based Skill Matching",
          accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 3: Glossary and Clinical Application Exercise" }
        },

        // ─── Intro Text ───────────────────────────────────
        {
          type: "text",
          content: `<h3>DBT Glossary of Key Terms</h3>
<p>The following glossary contains 35 essential DBT terms organized alphabetically. Expand each panel to review the definition. You must expand all panels to complete this section. Following the glossary, you will complete a scenario-based matching exercise that tests your ability to apply the correct DBT skill to clinical situations across all four modules.</p>`,
          accessibility: { role: "article", ariaLabel: "Glossary introduction" }
        },

        // ─── Accordion: Glossary A–D (13 terms) ───────────
        {
          type: "accordion",
          accordionItems: [
            {
              title: "ABC PLEASE Skills",
              content: "A set of emotion regulation skills designed to reduce vulnerability to Emotion Mind. ABC stands for Accumulate Positive Experiences (building pleasant events and long-term goals aligned with values), Build Mastery (engaging in activities that create a sense of competence), and Cope Ahead (planning in advance for emotionally challenging situations). PLEASE addresses physical self-care: treating Physical illness, balanced Eating, avoiding mood-Altering substances, balanced Sleep, and Exercise. These skills work proactively to raise the threshold for emotional reactivity."
            },
            {
              title: "ACCEPTS",
              content: "A distress tolerance acronym for distraction-based crisis survival strategies: Activities, Contributing, Comparisons, Emotions (generating opposite emotions), Pushing Away (mentally shelving the crisis temporarily), Thoughts (occupying the mind with cognitive tasks), and Sensations (using intense physical sensations to redirect attention). ACCEPTS is a temporary strategy for surviving acute crises, not a permanent coping solution."
            },
            {
              title: "Behavioral Chain Analysis",
              content: "A detailed, step-by-step examination of the sequence of events, thoughts, emotions, body sensations, and behaviors that led to a specific problem behavior. Chain analysis traces the sequence from the prompting event through vulnerability factors, each link in the chain, the problem behavior itself, and short-term and long-term consequences. The goal is to identify intervention points where a different skill or response could have changed the outcome."
            },
            {
              title: "Biosocial Theory",
              content: "DBT's foundational theoretical model explaining the development of emotion dysregulation through the transaction between biological vulnerability (heightened emotional sensitivity, reactivity, and slow return to baseline) and environmental invalidation. Neither factor alone is sufficient; it is their ongoing interaction over development that creates pervasive emotion dysregulation."
            },
            {
              title: "Borderline Personality Disorder (BPD)",
              content: "A pattern of instability in interpersonal relationships, self-image, and affects, along with marked impulsivity. BPD was the original target population for DBT. Key features include frantic efforts to avoid abandonment, unstable relationships, identity disturbance, impulsivity, recurrent suicidal behavior, affective instability, chronic emptiness, inappropriate anger, and transient paranoid ideation or dissociation."
            },
            {
              title: "Check the Facts",
              content: "An emotion regulation skill that helps clients evaluate whether their emotional response is proportionate to the actual facts of the situation. Involves examining the prompting event, identifying interpretations and assumptions, distinguishing thoughts from facts, and assessing whether the emotion's intensity and duration match reality. If the emotion does not fit the facts, Opposite Action is indicated."
            },
            {
              title: "Consultation Team (Therapist)",
              content: "The fourth component of comprehensive DBT, often described as 'therapy for the therapist.' A weekly meeting of all therapists within a DBT program that provides clinical case consultation, emotional support, fidelity monitoring, and burnout prevention. The team operates under agreements including dialectical philosophy, nonjudgmental stance, and mutual accountability."
            },
            {
              title: "Cope Ahead",
              content: "A component of the ABC PLEASE skills in emotion regulation. Involves planning in advance for situations likely to trigger emotional distress by identifying the situation, imagining it vividly, mentally rehearsing which DBT skills to use, and practicing the coping response in imagination. Reduces vulnerability by ensuring the client has a plan before entering the triggering situation."
            },
            {
              title: "Crisis Survival Skills",
              content: "A category of distress tolerance skills designed for getting through acute, time-limited crises without engaging in behaviors that make the situation worse. Includes TIPP, ACCEPTS, IMPROVE the Moment, and Pros and Cons. Distinguished from reality acceptance skills, which address chronic pain rather than acute crises."
            },
            {
              title: "DEAR MAN",
              content: "The primary interpersonal effectiveness skill set for objective effectiveness—getting what you want or saying no. Describe the situation factually, Express feelings using 'I' statements, Assert what you want clearly, Reinforce by explaining positive consequences, stay Mindful of your objective, Appear confident, and Negotiate when appropriate."
            },
            {
              title: "Describe (Mindfulness Skill)",
              content: "One of the three 'What' skills in DBT mindfulness. Involves putting words to observations using factual, non-evaluative language. Distinguishes between describing thoughts ('I'm having the thought that...') and believing them as facts. Research on affect labeling supports this skill's ability to reduce amygdala activation."
            },
            {
              title: "Dialectics",
              content: "A philosophical approach involving the synthesis of opposing forces. In DBT, the fundamental dialectic is between acceptance and change. Dialectical thinking rejects rigid either/or categorization in favor of both/and perspectives, seeking the kernel of truth in every position and recognizing that reality is complex, multifaceted, and often contains truths that appear contradictory."
            },
            {
              title: "Diary Card",
              content: "A daily self-monitoring form that clients complete between sessions, tracking emotions, urges (including self-harm and substance use urges), specific target behaviors, and use of DBT skills. Reviewed at the beginning of each individual therapy session to identify active treatment targets and guide session focus according to the treatment target hierarchy."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Glossary terms A through D" }
        },

        // ─── Accordion: Glossary E–W (22 terms) ───────────
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Effectively (Mindfulness Skill)",
              content: "One of the three 'How' skills in DBT mindfulness. Involves doing what works to achieve one's goals rather than what feels fair, right, or justified. Requires Wise Mind integration and is particularly useful for clients who sacrifice their goals to make a point or prove they are right."
            },
            {
              title: "Emotion Mind",
              content: "One of three states of mind in DBT. In Emotion Mind, thinking and behavior are controlled by the current emotional state. Facts, logic, and consequences are distorted or ignored. Decisions made in Emotion Mind often feel urgent and right in the moment but lead to regret. Not inherently bad—Emotion Mind provides important information—but insufficient for balanced decision-making."
            },
            {
              title: "Emotion Regulation Skills",
              content: "The third core DBT skill module. Targets the understanding and management of intense emotions through understanding and naming emotions, Check the Facts, Opposite Action, Problem Solving, ABC PLEASE, and the Wave Skill. Emotion regulation works at a different level than distress tolerance: while distress tolerance helps survive crises, emotion regulation helps reduce the frequency and intensity of unwanted emotions proactively."
            },
            {
              title: "FAST",
              content: "An interpersonal effectiveness skill set for self-respect effectiveness—maintaining self-respect during interactions. Fair (be fair to yourself and others), no Apologies (don't apologize for making a request, having an opinion, or disagreeing), Stick to values (don't abandon your values to gain approval), and Truthful (don't lie, exaggerate, or act helpless)."
            },
            {
              title: "GIVE",
              content: "An interpersonal effectiveness skill set for relationship effectiveness—maintaining or strengthening the relationship during interactions. Gentle (no attacks, threats, or judgments), Interested (listen and appear interested), Validate (acknowledge the other person's feelings and perspectives), and Easy manner (use humor, be light-handed)."
            },
            {
              title: "IMPROVE the Moment",
              content: "A distress tolerance crisis survival strategy: Imagery (visualizing a safe or peaceful scene), Meaning (finding purpose or meaning in the pain), Prayer (connecting with a higher power or one's own Wise Mind), Relaxation (progressive muscle relaxation, deep breathing), One thing in the moment (focusing entirely on the present task), Vacation (brief mental break from the crisis), and Encouragement (self-coaching with compassionate statements)."
            },
            {
              title: "Interpersonal Effectiveness Skills",
              content: "The fourth core DBT skill module. Addresses three types of effectiveness in relationships: objective effectiveness (getting what you want — DEAR MAN), relationship effectiveness (maintaining the relationship — GIVE), and self-respect effectiveness (preserving self-respect — FAST). Also includes Walking the Middle Path."
            },
            {
              title: "Invalidating Environment",
              content: "An environment that persistently communicates that the individual's internal experiences—emotions, thoughts, desires, needs—are wrong, inaccurate, inappropriate, or not to be taken seriously. Key forms include telling someone their feelings are wrong, oversimplifying problems, and intermittently reinforcing emotional escalation. A core component of biosocial theory."
            },
            {
              title: "Mindfulness Skills",
              content: "The first and foundational core DBT skill module, taught at the beginning of every skill rotation. Includes three 'What' skills (Observe, Describe, Participate) and three 'How' skills (Non-Judgmentally, One-Mindfully, Effectively). Organized around three states of mind (Reasonable Mind, Emotion Mind, Wise Mind). Adapted from Zen Buddhist contemplative practices."
            },
            {
              title: "Non-Judgmentally (Mindfulness Skill)",
              content: "One of the three 'How' skills. Involves observing and describing without adding evaluative labels of good/bad, right/wrong, fair/unfair. Does not mean approval or agreement—it means seeing clearly without the distortion added by judgment. Particularly difficult for clients accustomed to harsh self-evaluation."
            },
            {
              title: "Observe (Mindfulness Skill)",
              content: "The first of the three 'What' skills. Involves noticing internal and external experiences (sensations, emotions, thoughts, sounds, sights) without attempting to change, suppress, or prolong them. Pure awareness without action—the foundation for all subsequent mindfulness skills."
            },
            {
              title: "One-Mindfully (Mindfulness Skill)",
              content: "One of the three 'How' skills. Involves doing one thing at a time with full attention, rather than splitting attention across multiple activities. The antidote to chronic multitasking and the scattered attention that prevents full engagement with the present moment."
            },
            {
              title: "Opposite Action",
              content: "A core emotion regulation skill based on the principle that each emotion has a characteristic action urge, and that acting opposite to the urge—when the emotion does not fit the facts—will reduce the emotion. Fear: approach instead of avoid. Anger: be gentle instead of aggressive. Sadness: activate instead of withdraw. Shame: make the behavior public instead of hiding (when the behavior is not actually harmful). Must be practiced 'all the way.'"
            },
            {
              title: "Participate (Mindfulness Skill)",
              content: "The third 'What' skill. Involves throwing oneself completely into an activity without self-consciousness. Provides an alternative to the chronic self-monitoring and self-evaluation that prevents full engagement with the present moment."
            },
            {
              title: "Phone Coaching",
              content: "The third component of comprehensive DBT. Brief (5–15 minute), focused, between-session contacts designed to help clients apply DBT skills in real-time. Not crisis counseling or between-session therapy. Subject to the 24-hour rule: clients must wait 24 hours after engaging in target behaviors before requesting coaching (does not apply to genuine suicidal crises)."
            },
            {
              title: "Pros and Cons",
              content: "A distress tolerance skill involving structured analysis of the advantages and disadvantages of tolerating distress versus not tolerating it (engaging in the crisis behavior). Best completed in advance of a crisis and kept accessible for reference during acute emotional episodes."
            },
            {
              title: "Radical Acceptance",
              content: "The complete and total acceptance of reality exactly as it is, from the depths of one's being. Not approval, agreement, endorsement, or passivity. Linehan's formula: Pain + Non-Acceptance = Suffering. Radical acceptance removes the non-acceptance, leaving pain alone—which is more manageable than pain plus the exhausting battle against reality. A practice, not a one-time event."
            },
            {
              title: "Reasonable Mind",
              content: "One of three states of mind in DBT. In Reasonable Mind, thinking is governed by logic, facts, data, and rational analysis. Emotions are largely excluded from decision-making. Effective for purely analytical tasks but insufficient for situations that require emotional awareness or interpersonal sensitivity. Synthesized with Emotion Mind in Wise Mind."
            },
            {
              title: "TIPP Skills",
              content: "Crisis survival skills that alter body chemistry to reduce extreme emotional arousal. Temperature (cold water on face to activate dive reflex), Intense exercise (vigorous activity for ~20 minutes), Paced breathing (slow breathing with extended exhales), and Progressive/Paired muscle relaxation. Effective because they work physiologically rather than cognitively, making them accessible during extreme arousal."
            },
            {
              title: "Treatment Target Hierarchy",
              content: "The structured priority system guiding DBT individual therapy sessions: (1) life-threatening behaviors (always first priority), (2) therapy-interfering behaviors (by client or therapist), (3) quality-of-life-interfering behaviors, and (4) increasing behavioral skills. Ensures the most dangerous behaviors are addressed before less critical concerns."
            },
            {
              title: "Turning the Mind",
              content: "A distress tolerance skill that serves as the bridge between non-acceptance and radical acceptance. Involves making a conscious, deliberate choice to accept reality—standing at a fork in the road and choosing the path of acceptance. Not a one-time decision; may need to be repeated many times."
            },
            {
              title: "Validation",
              content: "The communication that an individual's responses make sense and are understandable within their current context. In DBT, validation is a core therapeutic strategy that balances change-oriented interventions. Linehan identified six levels of validation, ranging from attentive listening to radical genuineness. Validation does not mean agreement."
            },
            {
              title: "Walking the Middle Path",
              content: "Interpersonal effectiveness skills applying dialectical thinking to relationships. Includes finding the kernel of truth in both sides of a conflict, validating others, and using reinforcement rather than punishment to shape behavior. Helps clients move beyond black-and-white relational patterns."
            },
            {
              title: "Wave Skill (Riding the Emotion)",
              content: "A mindfulness-based emotion regulation strategy involving experiencing an emotion fully without suppressing, amplifying, or acting on it. Based on the metaphor that emotions, like waves, rise, peak, and naturally fall. Helps clients discover experientially that even intense emotions are temporary."
            },
            {
              title: "Willingness vs. Willfulness",
              content: "Willingness is meeting life on its own terms—participating in the demands of the present moment even when unpleasant. Willfulness is refusing to accept reality, giving up entirely, or trying to impose one's will on uncontrollable circumstances. Willingness does not mean wanting to do something; it means being open to doing what the situation requires."
            },
            {
              title: "Wise Mind",
              content: "The dialectical synthesis of Reasonable Mind and Emotion Mind. Integrates logical analysis with emotional experience to produce balanced, effective decision-making. A central concept in DBT accessed through mindfulness practice, visualization exercises, and the consistent question: 'Is this Wise Mind?'"
            }
          ],
          accessibility: { role: "region", ariaLabel: "Glossary terms E through W" }
        },

        // ─── Text: Matching Exercise Intro ─────────────────
        {
          type: "text",
          content: `<h3>"Which Skill Would You Use?"</h3>
<p>This exercise presents 12 clinical scenarios and asks you to identify the most appropriate DBT skill or skill set for each situation. Each scenario draws from real-world clinical presentations. Read each scenario carefully, consider the client's specific needs in that moment, and select the best-fit skill from the options provided.</p>`,
          accessibility: { role: "article", ariaLabel: "Clinical matching exercise introduction" }
        },

        // ─── Matching 1: Crisis & Acute ────────────────────
        {
          type: "matching",
          matchingInstructions: "Match each crisis scenario with the most appropriate DBT skill.",
          matchingPairs: [
            {
              term: "Client in extreme distress, heart racing, can't speak, urges to self-harm, feels 'whole body on fire'",
              definition: "TIPP Skills (Temperature — physiological intervention for extreme arousal)"
            },
            {
              term: "Client received terminal diagnosis for family member, repeating 'This can't be happening,' consumed by unfairness",
              definition: "Radical Acceptance (unchangeable situation requiring acceptance of painful reality)"
            },
            {
              term: "Client had strong urge to drink after spousal fight, didn't drink but couldn't sleep, catastrophized all night",
              definition: "ACCEPTS / Distress Tolerance (crisis survival skills for acute urge period)"
            },
            {
              term: "Client paralyzed by anxiety before job interview, knows anxiety is disproportionate, urge to flee overwhelming",
              definition: "Opposite Action (emotion doesn't fit facts — approach instead of avoid)"
            }
          ],
          accessibility: { role: "group", ariaLabel: "Matching exercise: Crisis and acute situations" }
        },

        // ─── Matching 2: Emotion Regulation ────────────────
        {
          type: "matching",
          matchingInstructions: "Match each emotion-focused scenario with the most appropriate DBT skill.",
          matchingPairs: [
            {
              term: "Client with chronic winter depression — stops exercising, stays up late, skips meals, isolates every year",
              definition: "ABC PLEASE (proactive vulnerability reduction — address physical health and build mastery)"
            },
            {
              term: "Client furious at coworker for 'stealing idea' — wants aggressive confrontation, but idea was shared in group brainstorm",
              definition: "Check the Facts / Opposite Action (anger based on misinterpretation — emotion doesn't fit facts)"
            },
            {
              term: "Client describes feeling 'bad' constantly but can't specify sad, anxious, ashamed, or angry — leads to impulsive coping",
              definition: "Understanding and Naming Emotions (foundational deficit in emotional granularity)"
            },
            {
              term: "Client's landlord ignores broken heater in January — anger is justified, lease is being violated, client asks 'Should I just accept this?'",
              definition: "Problem Solving (emotion IS justified, situation IS changeable — not everything requires acceptance)"
            }
          ],
          accessibility: { role: "group", ariaLabel: "Matching exercise: Emotion regulation situations" }
        },

        // ─── Matching 3: Interpersonal ─────────────────────
        {
          type: "matching",
          matchingInstructions: "Match each interpersonal scenario with the most appropriate DBT skill set.",
          matchingPairs: [
            {
              term: "Client needs to ask employer for mental health day — terrified of judgment, wants a concrete plan for the request",
              definition: "DEAR MAN (objective effectiveness — structured approach to making a specific request)"
            },
            {
              term: "Client arguing with teenage daughter about curfew — getting angry, on verge of saying something hurtful and damaging",
              definition: "GIVE (relationship effectiveness — prioritize preserving the relationship in high-emotion moment)"
            },
            {
              term: "Client's friend keeps asking to borrow money (never repaid) — afraid to say no, lends money she can't afford, then feels resentful",
              definition: "FAST (self-respect effectiveness — stop apologizing for legitimate needs, stick to values)"
            },
            {
              term: "Client describes partner in exclusively negative terms but also describes genuine warmth — unable to hold both realities",
              definition: "Walking the Middle Path (dialectical thinking — move beyond all-or-nothing relational patterns)"
            }
          ],
          accessibility: { role: "group", ariaLabel: "Matching exercise: Interpersonal situations" }
        },

        // ─── Reflection ────────────────────────────────────
        {
          type: "reflection",
          question: "Think about a recent clinical session where a client presented with a challenge that could have been addressed using a specific DBT skill or skill combination. Which scenario above most closely resembles that clinical situation? Which DBT skill(s) would you have recommended, and how would you have introduced the skill to the client in language that felt accessible and non-clinical?",
          minLength: 50,
          accessibility: { role: "textbox", ariaLabel: "Reflection: Applying DBT skills to your clinical work" }
        }
      ]
    }
  ],


  // ═══════════════════════════════════════════════════════════════
  //  FINAL ASSESSMENT — 20 Questions | 80% Pass | 3 Attempts
  // ═══════════════════════════════════════════════════════════════

  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        question: "DBT was originally developed to treat which clinical population?",
        options: [
          { text: "Individuals with Generalized Anxiety Disorder", isCorrect: false },
          { text: "Individuals with Major Depressive Disorder", isCorrect: false },
          { text: "Chronically suicidal individuals diagnosed with Borderline Personality Disorder", isCorrect: true },
          { text: "Adolescents with Conduct Disorder", isCorrect: false }
        ],
        explanation: "Dr. Marsha Linehan developed DBT specifically to treat chronically suicidal individuals with BPD who were not responding to existing treatments."
      },
      {
        question: "According to biosocial theory, which three characteristics define biological vulnerability?",
        options: [
          { text: "Low self-esteem, insecure attachment, and learned helplessness", isCorrect: false },
          { text: "Heightened emotional sensitivity, heightened emotional reactivity, and slow return to emotional baseline", isCorrect: true },
          { text: "Genetic predisposition, traumatic brain injury, and hormonal imbalance", isCorrect: false },
          { text: "Cognitive rigidity, poor executive functioning, and impaired working memory", isCorrect: false }
        ],
        explanation: "Biosocial theory identifies heightened sensitivity, heightened reactivity, and slow return to baseline as the three biological vulnerabilities."
      },
      {
        question: "Which best describes an invalidating environment?",
        options: [
          { text: "An environment providing excessive praise and protection from negative experiences", isCorrect: false },
          { text: "An environment that persistently communicates that the individual\u2019s internal experiences are wrong, inaccurate, or inappropriate", isCorrect: true },
          { text: "An environment characterized exclusively by physical abuse and neglect", isCorrect: false },
          { text: "An environment encouraging emotional expression but lacking structure", isCorrect: false }
        ],
        explanation: "Invalidating environments pervasively communicate that emotions, thoughts, and needs are inaccurate or unwarranted\u2014not limited to abuse."
      },
      {
        question: "In the DBT treatment target hierarchy, what comes immediately AFTER life-threatening behaviors?",
        options: [
          { text: "Increasing behavioral skills", isCorrect: false },
          { text: "Quality-of-life-interfering behaviors", isCorrect: false },
          { text: "Therapy-interfering behaviors", isCorrect: true },
          { text: "Processing traumatic memories", isCorrect: false }
        ],
        explanation: "The hierarchy is: (1) life-threatening, (2) therapy-interfering, (3) quality-of-life-interfering, (4) increasing skills."
      },
      {
        question: "The 24-hour rule in phone coaching exists to:",
        options: [
          { text: "Ensure therapists get adequate rest", isCorrect: false },
          { text: "Allow time for medication adjustments", isCorrect: false },
          { text: "Avoid inadvertently reinforcing self-destructive behavior with therapeutic attention", isCorrect: true },
          { text: "Give clients time to practice skills independently", isCorrect: false }
        ],
        explanation: "The 24-hour rule prevents reinforcing self-harm with immediate therapeutic attention. Exception: genuine suicidal crises."
      },
      {
        question: "A client says, \u201cI\u2019m having the thought that my partner doesn\u2019t love me.\u201d This demonstrates which mindfulness skill?",
        options: [
          { text: "Observe", isCorrect: false },
          { text: "Describe", isCorrect: true },
          { text: "Participate", isCorrect: false },
          { text: "Effectively", isCorrect: false }
        ],
        explanation: "Labeling a thought as a thought (\u201cI\u2019m having the thought that...\u201d) rather than stating it as fact is the Describe skill."
      },
      {
        question: "The \u201cEffectively\u201d mindfulness skill teaches clients to:",
        options: [
          { text: "Focus on deep breathing for at least 10 minutes daily", isCorrect: false },
          { text: "Evaluate all experiences as positive or negative", isCorrect: false },
          { text: "Do what works to achieve their goals rather than what feels fair or right", isCorrect: true },
          { text: "Eliminate all emotional responses before making decisions", isCorrect: false }
        ],
        explanation: "Effectively is about pragmatic action\u2014choosing behaviors most likely to achieve goals, even when uncomfortable."
      },
      {
        question: "Pain + Non-Acceptance = Suffering illustrates which concept?",
        options: [
          { text: "The biosocial model", isCorrect: false },
          { text: "The treatment target hierarchy", isCorrect: false },
          { text: "Radical Acceptance", isCorrect: true },
          { text: "Opposite Action", isCorrect: false }
        ],
        explanation: "This formula is central to Radical Acceptance: pain is inevitable; suffering from fighting reality is optional."
      },
      {
        question: "The TIPP skill using cold water on the face activates:",
        options: [
          { text: "Intense Exercise response", isCorrect: false },
          { text: "Paced Breathing reflex", isCorrect: false },
          { text: "The mammalian dive reflex (Temperature)", isCorrect: true },
          { text: "Progressive Muscle Relaxation", isCorrect: false }
        ],
        explanation: "Temperature uses cold applied to the face to trigger the dive reflex, rapidly slowing heart rate."
      },
      {
        question: "\u201cTurning the Mind\u201d refers to:",
        options: [
          { text: "Cognitive restructuring of negative thoughts", isCorrect: false },
          { text: "Deliberately choosing the path of acceptance, knowing you may need to choose repeatedly", isCorrect: true },
          { text: "Using distraction techniques to avoid thinking about crisis", isCorrect: false },
          { text: "Rotating through different skills until one works", isCorrect: false }
        ],
        explanation: "Turning the Mind is choosing acceptance at a fork in the road\u2014a moment-by-moment commitment, not permanent."
      },
      {
        question: "Check the Facts reveals anger is based on misinterpretation. Next step:",
        options: [
          { text: "Radical Acceptance", isCorrect: false },
          { text: "TIPP skills", isCorrect: false },
          { text: "Opposite Action for unjustified anger", isCorrect: true },
          { text: "DEAR MAN to confront the person", isCorrect: false }
        ],
        explanation: "When the emotion doesn\u2019t fit the facts, Opposite Action is indicated. For anger: gentle avoidance, kindness, relaxation."
      },
      {
        question: "The ABC in ABC PLEASE stands for:",
        options: [
          { text: "Awareness, Boundaries, Communication", isCorrect: false },
          { text: "Accumulate Positive Experiences, Build Mastery, Cope Ahead", isCorrect: true },
          { text: "Accept, Balance, Change", isCorrect: false },
          { text: "Attend, Breathe, Center", isCorrect: false }
        ],
        explanation: "ABC = Accumulate Positive Experiences, Build Mastery, Cope Ahead\u2014proactive vulnerability reduction."
      },
      {
        question: "The capacity to differentiate between specific emotional states is called:",
        options: [
          { text: "Emotional intelligence", isCorrect: false },
          { text: "Affect regulation", isCorrect: false },
          { text: "Emotional granularity", isCorrect: true },
          { text: "Metacognitive awareness", isCorrect: false }
        ],
        explanation: "Emotional granularity\u2014making fine-grained distinctions between emotions\u2014is associated with better regulation."
      },
      {
        question: "In DEAR MAN, \u201cReinforce\u201d means:",
        options: [
          { text: "Repeating your request until compliance", isCorrect: false },
          { text: "Explaining the positive consequences of granting your request", isCorrect: true },
          { text: "Reminding of past favors", isCorrect: false },
          { text: "Requesting written confirmation", isCorrect: false }
        ],
        explanation: "Reinforce = communicating how honoring the request benefits both parties or the relationship."
      },
      {
        question: "A client who compromises values and apologizes compulsively to maintain relationships needs:",
        options: [
          { text: "DEAR MAN", isCorrect: false },
          { text: "GIVE", isCorrect: false },
          { text: "FAST", isCorrect: true },
          { text: "TIPP", isCorrect: false }
        ],
        explanation: "FAST (Fair, no Apologies, Stick to values, Truthful) addresses self-respect erosion."
      },
      {
        question: "Which DBT component is \u201ctherapy for the therapist\u201d?",
        options: [
          { text: "Individual therapy", isCorrect: false },
          { text: "Group skills training", isCorrect: false },
          { text: "Phone coaching", isCorrect: false },
          { text: "Therapist consultation team", isCorrect: true }
        ],
        explanation: "The consultation team provides clinical consultation, emotional support, fidelity monitoring, and burnout prevention."
      },
      {
        question: "A recognized cultural limitation of DBT is:",
        options: [
          { text: "Mindfulness is incompatible with non-Buddhist traditions", isCorrect: false },
          { text: "DEAR MAN assertiveness may conflict with cultural norms around indirect communication and authority", isCorrect: true },
          { text: "DBT can only be delivered in English", isCorrect: false },
          { text: "Evidence has been replicated exclusively in European populations", isCorrect: false }
        ],
        explanation: "DEAR MAN assertiveness may conflict with cultures valuing indirect communication or deference to authority."
      },
      {
        question: "Linehan et al. (2015) found that:",
        options: [
          { text: "DBT is ineffective for anything other than BPD", isCorrect: false },
          { text: "Phone coaching is the most important component", isCorrect: false },
          { text: "DBT skills training alone produced comparable reductions in suicidal ideation and depression; full DBT was superior for reducing self-harm", isCorrect: true },
          { text: "Individual therapy without skills training is sufficient", isCorrect: false }
        ],
        explanation: "This landmark component analysis found skills training may be the most active ingredient, though full DBT was superior for self-harm reduction specifically."
      },
      {
        question: "A client making decisions based entirely on how they feel, ignoring facts and consequences, is in:",
        options: [
          { text: "Reasonable Mind", isCorrect: false },
          { text: "Emotion Mind", isCorrect: true },
          { text: "Wise Mind", isCorrect: false },
          { text: "Observing Mind", isCorrect: false }
        ],
        explanation: "Emotion Mind = thinking governed by current feelings with facts and consequences distorted or ignored."
      },
      {
        question: "When integrating DBT-informed strategies, clinicians must:",
        options: [
          { text: "Complete full certification before using any techniques", isCorrect: false },
          { text: "Only use DBT with formal BPD diagnoses", isCorrect: false },
          { text: "Be transparent about whether they provide comprehensive DBT, structured skills-only, or loosely DBT-informed practice", isCorrect: true },
          { text: "Avoid discussing limitations to maintain client confidence", isCorrect: false }
        ],
        explanation: "Transparency about what you actually provide is an ethical obligation. Fidelity drift undermines clinical integrity."
      }
    ]
  },


  // ═══════════════════════════════════════════════════════════════
  //  REFERENCES (31 APA-formatted citations)
  // ═══════════════════════════════════════════════════════════════

  references: [
    "Behavioral Tech, LLC. (n.d.). What is DBT? https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    "Bohus, M., et al. (2004). Effectiveness of inpatient dialectical behavioral therapy for borderline personality disorder. Behaviour Research and Therapy, 42(5), 487\u2013499.",
    "Chapman, A. L. (2006). Dialectical behavior therapy: Current indications and unique elements. Psychiatry (Edgmont), 3(9), 62\u201368.",
    "Comtois, K. A., et al. (2007). Effectiveness of dialectical behavior therapy in a community mental health center. Cognitive and Behavioral Practice, 14(4), 406\u2013414.",
    "Crowell, S. E., Beauchaine, T. P., & Linehan, M. M. (2009). A biosocial developmental model of borderline personality. Psychological Bulletin, 135(3), 495\u2013510.",
    "DeCou, C. R., Comtois, K. A., & Landes, S. J. (2019). Dialectical behavior therapy is effective for the treatment of suicidal behavior: A meta-analysis. Behavior Therapy, 50(1), 60\u201372.",
    "Dimeff, L. A., & Linehan, M. M. (2001). Dialectical behavior therapy in a nutshell. The California Psychologist, 34(3), 10\u201313.",
    "Feigenbaum, J. D., et al. (2012). A real-world study of the effectiveness of DBT in the UK National Health Service. British Journal of Clinical Psychology, 51(2), 121\u2013141.",
    "Feldman, G., et al. (2009). Change in emotional processing during a dialectical behavior therapy-based skills group for major depressive disorder. Behaviour Research and Therapy, 47(4), 316\u2013321.",
    "Harned, M. S., Korslund, K. E., & Linehan, M. M. (2014). A pilot randomized controlled trial of dialectical behavior therapy with and without the DBT prolonged exposure protocol. Behaviour Research and Therapy, 55, 7\u201317.",
    "Koons, C. R., et al. (2001). Efficacy of dialectical behavior therapy in women veterans with borderline personality disorder. Behavior Therapy, 32(2), 371\u2013390.",
    "Lieberman, M. D., et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421\u2013428.",
    "Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press.",
    "Linehan, M. M. (1993). Skills training manual for treating borderline personality disorder. Guilford Press.",
    "Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press.",
    "Linehan, M. M., et al. (1991). Cognitive-behavioral treatment of chronically parasuicidal borderline patients. Archives of General Psychiatry, 48(12), 1060\u20131064.",
    "Linehan, M. M., et al. (2006). Two-year randomized controlled trial and follow-up of DBT vs therapy by experts for suicidal behaviors and BPD. Archives of General Psychiatry, 63(7), 757\u2013766.",
    "Linehan, M. M., et al. (2015). Dialectical behavior therapy for high suicide risk in individuals with BPD: A randomized clinical trial and component analysis. JAMA Psychiatry, 72(5), 475\u2013482.",
    "McMain, S. F., et al. (2009). A randomized trial of dialectical behavior therapy versus general psychiatric management for BPD. American Journal of Psychiatry, 166(12), 1365\u20131374.",
    "Miller, A. L., Rathus, J. H., & Linehan, M. M. (2007). Dialectical behavior therapy with suicidal adolescents. Guilford Press.",
    "Neacsiu, A. D., et al. (2014). Dialectical behavior therapy skills for transdiagnostic emotion dysregulation: A pilot RCT. Behaviour Research and Therapy, 59, 40\u201351.",
    "Panos, P. T., et al. (2014). Meta-analysis and systematic review assessing the efficacy of DBT. Research on Social Work Practice, 24(2), 213\u2013223.",
    "Rathus, J. H., & Miller, A. L. (2002). Dialectical behavior therapy adapted for suicidal adolescents. Suicide and Life-Threatening Behavior, 32(2), 146\u2013157.",
    "Ritschel, L. A., Lim, N. E., & Stewart, L. M. (2015). Transdiagnostic applications of DBT. American Journal of Psychotherapy, 69(2), 225\u2013245.",
    "Safer, D. L., Telch, C. F., & Agras, W. S. (2001). Dialectical behavior therapy for bulimia nervosa. American Journal of Psychiatry, 158(4), 632\u2013634.",
    "Safer, D. L., Robinson, A. H., & Jo, B. (2010). Outcome from a randomized controlled trial of group therapy for binge eating disorder. Behavior Therapy, 41(1), 106\u2013120.",
    "Substance Abuse and Mental Health Services Administration. (2024). Dialectical behavior therapy. National Registry of Evidence-Based Programs and Practices. https://www.samhsa.gov",
    "Telch, C. F., Agras, W. S., & Linehan, M. M. (2001). Dialectical behavior therapy for binge eating disorder. Journal of Consulting and Clinical Psychology, 69(6), 1061\u20131065.",
    "Valentine, S. E., et al. (2015). The use of DBT skills training as stand-alone treatment: A systematic review. Journal of Clinical Psychology, 71(1), 1\u201320.",
    "Verheul, R., et al. (2003). Dialectical behaviour therapy for women with BPD: 12-month, randomised clinical trial in The Netherlands. British Journal of Psychiatry, 182(2), 135\u2013140.",
    "Wisniewski, L., & Ben-Porath, D. D. (2015). Dialectical behavior therapy and eating disorders. American Journal of Psychotherapy, 69(2), 129\u2013140."
  ],


  // ═══════════════════════════════════════════════════════════════
  //  ACEP PROVIDER ATTRIBUTION
  // ═══════════════════════════════════════════════════════════════

  providerAttribution: "CounselorReady \u2022 GAITP LLC \u2022 NBCC ACEP No. 7760"
};


// ═══════════════════════════════════════════════════════════════
//  WORD COUNT UTILITY
// ═══════════════════════════════════════════════════════════════

function countWords(modules) {
  let total = 0;
  for (const mod of modules) {
    for (const block of (mod.contentBlocks || [])) {
      const text = (block.content || '') + ' ' + (block.textContent || '');
      total += text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

      if (block.accordionItems) {
        for (const item of block.accordionItems) {
          total += (item.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
        }
      }

      if (block.question) total += block.question.split(/\s+/).filter(w => w.length > 0).length;
      if (block.explanation) total += block.explanation.split(/\s+/).filter(w => w.length > 0).length;
      if (block.options) {
        for (const opt of block.options) total += (opt.text || '').split(/\s+/).filter(w => w.length > 0).length;
      }
      if (block.matchingPairs) {
        for (const pair of block.matchingPairs) {
          total += ((pair.term || '') + ' ' + (pair.definition || '')).split(/\s+/).filter(w => w.length > 0).length;
        }
      }
    }
  }
  return total;
}


// ═══════════════════════════════════════════════════════════════
//  EXECUTE SEED
// ═══════════════════════════════════════════════════════════════

const wordCount = countWords(courseData.modules);
const TARGET = 36000;
const pct = Math.round((wordCount / TARGET) * 100);

console.log('\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log('  DBT COURSE SEED \u2014 CLEANED VERSION');
console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log(`  Catalog:     \u274C FAIL`);
console.log(`  Modules:     ${courseData.modules.length} of 9 (passing only)`);
console.log(`  Words:       ${wordCount.toLocaleString()} / ${TARGET.toLocaleString()} (${pct}%)`);
console.log(`  Assessment:  ${courseData.assessment.questions.length} questions`);
console.log(`  References:  ${courseData.references.length}`);
console.log(`  Status:      draft | isPublished: false`);
console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');

// Per-module breakdown
const perModuleTarget = Math.round(TARGET / 9); // Still measured against full 9-module target
for (const mod of courseData.modules) {
  const modWords = countWords([mod]);
  const modPct = Math.round((modWords / perModuleTarget) * 100);
  const blocks = mod.contentBlocks.length;
  console.log(`  \u2705 ${mod.title}`);
  console.log(`     ${modWords.toLocaleString()} words | ${blocks} blocks | ${modPct}% of per-module target`);
}

console.log('\n  \uD83D\uDD34 6 modules still needed:');
console.log('     Introduction and Course Overview');
console.log('     Biosocial Theory and the Dialectical Worldview');
console.log('     Core Skill Module: Mindfulness');
console.log('     Core Skill Module: Distress Tolerance');
console.log('     Core Skill Module: Emotion Regulation');
console.log('     Core Skill Module: Interpersonal Effectiveness');
console.log('');

// Upsert into database
courseData.wordCount = wordCount;
courseData.updatedAt = new Date();

const result = await collection.findOneAndUpdate(
  { slug: courseData.slug },
  { $set: courseData },
  { upsert: true, returnDocument: 'after' }
);

const totalBlocks = result.modules.reduce((sum, mod) => sum + mod.contentBlocks.length, 0);
console.log(`\u2705 Saved: ${result.modules.length} modules, ${totalBlocks} blocks, ${wordCount} words`);
console.log(`   ID:     ${result._id}`);
console.log(`   Slug:   ${result.slug}`);
console.log(`   Status: ${result.status} | Published: ${result.isPublished}`);

await mongoose.disconnect();
console.log('\u2705 Done\n');
