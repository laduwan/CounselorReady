import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

const db = mongoose.connection.db;
const collection = db.collection('interactivecourses');

const IMG = (label) => `https://via.placeholder.com/600x400/34495E/FFFFFF?text=${encodeURIComponent(label)}`;

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
  status: "published",
  isPublished: true,
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

  modules: [
{
  title: "Introduction and Course Overview",
  lessons: [
    {
      title: "Introduction and Course Overview",
      content: "This introductory module provides a comprehensive overview of Dialectical Behavior Therapy, its origins, its place within the broader landscape of evidence-based psychotherapies, and the structure of this continuing education course. You will explore the historical context that gave rise to DBT, understand who created it and why, and preview the clinical competencies you will develop across all nine modules."
    }
  ],
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 1,
      title: "Introduction and Course Overview",
      subtitle: "Understanding the Origins, Purpose, and Scope of Dialectical Behavior Therapy",
      accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 1: Introduction and Course Overview" }
    },
    {
      type: "text",
      content: `<h3>Welcome to the Course</h3>
<p>Dialectical Behavior Therapy (DBT) has become one of the most widely researched and implemented psychotherapeutic treatments in the mental health field. Originally developed by Marsha M. Linehan in the late 1980s and early 1990s at the University of Washington, DBT was created to address a clinical problem that had long frustrated therapists: the treatment of chronically suicidal individuals, particularly those diagnosed with Borderline Personality Disorder (BPD). What emerged from that effort was not simply a new set of therapeutic techniques, but an entirely new framework for understanding emotional suffering and for balancing the seemingly contradictory therapeutic goals of acceptance and change.</p>
<p>This six-hour continuing education course is designed for licensed mental health professionals who wish to develop a thorough, clinically grounded understanding of DBT. Whether you are encountering DBT for the first time or deepening knowledge you have acquired through previous training, this course will provide you with the theoretical foundations, practical skills, and evidence-based context you need to integrate DBT-informed strategies into your clinical practice. The course has been developed in accordance with the standards of the National Board for Certified Counselors (NBCC) Approved Continuing Education Provider (ACEP) program, and successful completion will earn you six continuing education credits.</p>
<p>Throughout this course, you will engage with interactive content including clinical vignettes, decision-point exercises, accordion panels with detailed explanations, knowledge check questions with rationales, matching exercises, and reflective prompts. These elements are designed not merely to transmit information but to facilitate the kind of active, applied learning that translates into improved clinical practice. Research in adult learning consistently demonstrates that interactive engagement with material produces superior retention and transfer compared to passive reading alone. Accordingly, you are encouraged to take your time with each module, expand every accordion panel, consider each reflection prompt carefully, and attempt all knowledge checks before reviewing the explanations provided.</p>`,
      accessibility: { role: "article", ariaLabel: "Welcome to the course" }
    },
    {
      type: "imageText",
      image: IMG("DBT+Origins+Marsha+Linehan"),
      imageAlt: "Conceptual illustration representing the origins of Dialectical Behavior Therapy and its development at the University of Washington",
      title: "The Historical Context of DBT",
      content: `<p>To fully appreciate DBT, it is essential to understand the clinical problem it was designed to solve. In the 1970s and 1980s, individuals with Borderline Personality Disorder were widely regarded as among the most difficult clients to treat. Standard cognitive-behavioral interventions frequently proved insufficient, and many therapists found themselves caught in a painful cycle: pushing for behavioral change triggered emotional crises in clients, while focusing solely on validation and acceptance failed to produce meaningful progress. Dropout rates were extraordinarily high, therapist burnout was endemic, and the therapeutic relationship itself often became a source of distress for both parties.</p>
<p>Marsha Linehan, then a young researcher at the University of Washington, began experimenting with standard CBT approaches for chronically suicidal women. She quickly discovered that a purely change-oriented approach was experienced by clients as invalidating—as if the therapist were saying that the client's pain was not real or not important. But when Linehan shifted to a purely acceptance-oriented approach, clients felt validated but made no behavioral progress. The core insight that would eventually define DBT emerged from this clinical impasse: effective treatment required both acceptance AND change, held simultaneously in dialectical tension.</p>
<p>This insight drew Linehan to the philosophical tradition of dialectics—the idea that reality is composed of opposing forces that can be synthesized into a higher truth—and to the contemplative practices of Zen Buddhism, which emphasize radical acceptance of the present moment. By integrating these perspectives with the empirical rigor of cognitive-behavioral therapy, Linehan created a treatment that could validate a client's experience of unbearable suffering while simultaneously teaching them the skills to build a life worth living.</p>`,
      imagePosition: "left",
      highlight: false,
      accessibility: { role: "article", ariaLabel: "Historical context of DBT development" }
    },
    {
      type: "text",
      content: `<h3>Who Is This Course For?</h3>
<p>This course is designed for a broad audience of mental health professionals, including Licensed Professional Counselors (LPCs), Licensed Clinical Social Workers (LCSWs), Licensed Marriage and Family Therapists (LMFTs), Psychologists, Psychiatric Nurse Practitioners, and counselors-in-training under supervision. You do not need prior DBT training to benefit from this course, though professionals with some exposure to DBT concepts may find that the course deepens and contextualizes their existing knowledge in valuable ways.</p>
<p>The clinical skills and conceptual frameworks presented in this course are applicable across a wide range of practice settings. Whether you work in an outpatient private practice, a community mental health center, an intensive outpatient program, an inpatient psychiatric unit, a residential treatment facility, or a school-based counseling setting, the principles and techniques of DBT can enhance your therapeutic effectiveness. DBT-informed strategies are particularly relevant for clinicians who work with clients presenting with emotional dysregulation, chronic suicidality, self-harm behaviors, substance use disorders, eating disorders, treatment-resistant depression, and complex trauma.</p>
<p>It is important to note that this course provides a comprehensive overview of DBT and equips you with foundational knowledge and DBT-informed clinical strategies. It does not constitute DBT-intensive training or certification. Clinicians who wish to identify themselves as DBT therapists or to implement a comprehensive DBT program should pursue additional training through organizations such as Behavioral Tech, LLC, or seek certification through the DBT-Linehan Board of Certification (DBT-LBC). This course will, however, provide you with the knowledge base to make informed decisions about whether and how to pursue that additional training.</p>`,
      accessibility: { role: "article", ariaLabel: "Target audience for this course" }
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Course Learning Objectives",
          content: `<p>Upon successful completion of this course, you will be able to:</p>
<p><strong>1. Articulate the Theoretical Foundations of DBT:</strong> You will understand biosocial theory, dialectical philosophy, and the transaction model of emotion dysregulation. You will be able to explain how these theoretical pillars inform every aspect of DBT treatment, from the therapeutic stance to the specific skills taught.</p>
<p><strong>2. Identify and Describe the Four Core Skill Modules:</strong> You will have a thorough understanding of Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness. For each module, you will know the key skills, their clinical applications, and how they interrelate.</p>
<p><strong>3. Differentiate DBT from Standard CBT:</strong> You will understand the specific structural and philosophical differences between DBT and standard cognitive-behavioral therapy, and you will be able to identify clinical presentations where DBT is indicated over other approaches.</p>
<p><strong>4. Describe the Components of Comprehensive DBT:</strong> You will understand the four modes of comprehensive DBT—individual therapy, group skills training, phone coaching, and the therapist consultation team—and the specific function each serves.</p>
<p><strong>5. Apply DBT Techniques to Clinical Scenarios:</strong> You will practice matching specific DBT skills and strategies to realistic clinical presentations through interactive exercises and decision-point activities.</p>
<p><strong>6. Evaluate the Empirical Evidence Base:</strong> You will be able to discuss the research evidence supporting DBT for various populations and conditions, and you will understand where the evidence is strongest and where it is more preliminary.</p>
<p><strong>7. Analyze Limitations and Cultural Considerations:</strong> You will critically evaluate the limitations, criticisms, and cultural considerations related to DBT implementation, positioning you to use DBT responsibly and thoughtfully in diverse practice contexts.</p>`
        },
        {
          title: "Course Structure and Navigation",
          content: `<p>This course consists of nine modules organized in a progressive sequence that builds knowledge from foundational theory to applied clinical skills to critical evaluation:</p>
<p><strong>Module 1 (current):</strong> Introduction and Course Overview — Provides historical context, course objectives, and navigation guidance.</p>
<p><strong>Module 2:</strong> Biosocial Theory and the Dialectical Worldview — Examines the theoretical pillars of DBT including biosocial theory, dialectical philosophy, and the transaction model of emotion dysregulation.</p>
<p><strong>Module 3:</strong> The Structure of Comprehensive DBT — Explores the four components of comprehensive DBT treatment: individual therapy, group skills training, phone coaching, and the consultation team.</p>
<p><strong>Modules 4-7:</strong> The Four Core Skill Modules — Dedicated modules for Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness, each with detailed skill instruction and clinical application exercises.</p>
<p><strong>Module 8:</strong> Evidence Base, Limitations, and Integration — Evaluates the empirical research supporting DBT, examines criticisms and limitations, and provides practical strategies for integration into existing practice.</p>
<p><strong>Module 9:</strong> Glossary and Clinical Application Exercise — A comprehensive 35-term DBT glossary and a 12-scenario clinical application exercise to consolidate your learning.</p>
<p>After completing all nine modules, you will take a 20-question final assessment. A score of 80% or higher is required to pass, and you have up to three attempts. Upon passing, you will complete a course evaluation and attestation before receiving your certificate of completion for six continuing education hours.</p>`
        },
        {
          title: "How to Get the Most from This Course",
          content: `<p><strong>Expand Every Panel:</strong> Accordion panels contain essential content that contributes to your learning. Do not skip them. The course tracking system monitors your engagement with all interactive elements.</p>
<p><strong>Attempt Knowledge Checks Before Reading Explanations:</strong> Each module contains knowledge check questions designed to reinforce key concepts. Try to answer each question based on your understanding before reading the explanation. This retrieval practice strengthens memory encoding and helps you identify areas where you may need to review.</p>
<p><strong>Engage with Reflection Prompts:</strong> Reflection prompts ask you to connect course content to your own clinical practice. Taking even two or three minutes to genuinely consider each prompt will significantly enhance your ability to transfer what you learn to your work with clients.</p>
<p><strong>Complete the Matching Exercises:</strong> Scenario-based matching exercises help you practice the applied skill of selecting appropriate DBT interventions for specific clinical presentations. This is the kind of decision-making you will engage in regularly when using DBT-informed strategies with clients.</p>
<p><strong>Take Notes:</strong> Research on learning consistently shows that the act of taking notes—particularly notes written in your own words—enhances retention and understanding. Consider keeping a notebook or digital document alongside this course where you can record key insights, questions, and ideas for how to apply what you are learning.</p>
<p><strong>Plan Your Time:</strong> This is a six-hour course. While you can complete it at your own pace, we recommend completing no more than two to three modules per sitting to allow adequate time for processing and reflection. Many learners find it helpful to spread the course over two or three sessions.</p>`
        }
      ],
      accessibility: { role: "region", ariaLabel: "Course objectives and structure accordion" }
    },
    {
      type: "multipleChoice",
      question: "What clinical problem was DBT originally developed to address?",
      options: [
        { text: "Generalized anxiety disorder in adolescents", isCorrect: false },
        { text: "Chronically suicidal individuals, particularly those with Borderline Personality Disorder", isCorrect: true },
        { text: "Treatment-resistant major depressive disorder in older adults", isCorrect: false },
        { text: "Substance use disorders in outpatient community mental health settings", isCorrect: false }
      ],
      explanation: "DBT was originally developed by Marsha Linehan at the University of Washington to treat chronically suicidal individuals, most of whom met criteria for Borderline Personality Disorder. The treatment emerged from the clinical observation that standard CBT alone was insufficient for this population because a purely change-oriented approach was experienced as invalidating.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: DBT origins" }
    },
    {
      type: "imageText",
      image: IMG("Acceptance+AND+Change+Dialectic"),
      imageAlt: "Illustration of the dialectical balance between acceptance and change in DBT",
      title: "The Core Dialectic: Acceptance and Change",
      content: `<p>The single most important concept in DBT—the idea that unifies every aspect of the treatment—is the dialectical tension between acceptance and change. This is not merely a therapeutic technique; it is a fundamental philosophical stance that shapes how the DBT therapist understands human suffering, constructs the therapeutic relationship, and delivers every intervention.</p>
<p>In standard CBT, the emphasis is primarily on change: identifying maladaptive cognitions, challenging distorted thinking, modifying dysfunctional behaviors, and building new skills. While these change-oriented strategies are powerful and well-supported by research, Linehan discovered that for individuals with severe emotional dysregulation, change-focused interventions alone could be experienced as deeply invalidating. When a therapist says, in effect, "Let's change the way you think about this," the client may hear, "The way you think about this is wrong," which can trigger shame, emotional escalation, and withdrawal from treatment.</p>
<p>Conversely, acceptance-oriented approaches—such as those found in person-centered therapy or in certain applications of mindfulness—validate the client's experience and communicate that their pain is real and understandable. However, acceptance alone does not help the client develop the concrete skills they need to manage crises, regulate emotions, and build a life that feels worth living. A therapist who only validates may inadvertently communicate that there is nothing the client can do to improve their situation.</p>
<p>DBT resolves this tension not by choosing one side over the other, but by holding both simultaneously. The DBT therapist communicates: "Your pain is real and makes sense given your history AND you need to learn new skills to manage that pain more effectively." This dialectical synthesis—the "and" rather than "but"—is what distinguishes DBT from both standard CBT and purely acceptance-based approaches. It permeates every aspect of the treatment, from the individual therapy session to the skills training group to the phone coaching call.</p>`,
      imagePosition: "right",
      highlight: true,
      accessibility: { role: "article", ariaLabel: "Core dialectic of acceptance and change" }
    },
    {
      type: "multipleChoice",
      question: "Which three intellectual traditions does DBT integrate?",
      options: [
        { text: "Psychoanalysis, humanistic psychology, and behaviorism", isCorrect: false },
        { text: "Cognitive-behavioral therapy, dialectical philosophy, and Zen Buddhist contemplative practices", isCorrect: true },
        { text: "Attachment theory, systems theory, and motivational interviewing", isCorrect: false },
        { text: "Existential philosophy, Gestalt therapy, and neuroscience", isCorrect: false }
      ],
      explanation: "DBT uniquely integrates three intellectual traditions: (1) cognitive-behavioral therapy, which provides the empirical framework and change-oriented strategies; (2) dialectical philosophy, which provides the overarching framework for synthesizing opposites—particularly acceptance and change; and (3) Zen Buddhist contemplative practices, which inform the mindfulness skills and the stance of radical acceptance.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: DBT intellectual traditions" }
    },
    {
      type: "text",
      content: `<h3>DBT in the Contemporary Mental Health Landscape</h3>
<p>Since its initial development in the early 1990s, DBT has grown from a specialized treatment for a single disorder into one of the most widely practiced evidence-based psychotherapies in the world. The treatment has been adapted for use with adolescents, older adults, forensic populations, individuals with intellectual disabilities, and clients presenting with a wide range of conditions beyond BPD, including eating disorders, substance use disorders, treatment-resistant depression, and post-traumatic stress disorder. DBT programs now operate in virtually every type of clinical setting, from private practices to state psychiatric hospitals, from university counseling centers to veterans' affairs medical centers, and from community mental health agencies to correctional facilities.</p>
<p>The growth of DBT has been accompanied by the development of a robust training infrastructure. Organizations such as Behavioral Tech, LLC (founded by Linehan herself) and the DBT-Linehan Board of Certification (DBT-LBC) provide training, consultation, and certification programs that help ensure treatment fidelity. At the same time, research on DBT continues to expand, with new studies exploring adaptations for diverse populations, mechanisms of change, optimal treatment duration, and the comparative effectiveness of full comprehensive DBT versus specific DBT components used in isolation or in combination with other treatments.</p>
<p>For practicing clinicians, this expanding landscape presents both opportunities and challenges. The opportunities are clear: DBT offers a powerful set of tools for working with some of the most distressed and difficult-to-treat clients in mental health care. The challenges include the resource intensity of comprehensive DBT, the need for ongoing training and consultation, and the importance of distinguishing between evidence-based DBT and the many informal or incomplete adaptations that sometimes carry the DBT label without meeting the standards of the treatment as it was designed and researched. This course will help you navigate these challenges by providing a thorough understanding of what DBT actually is, what the evidence supports, and how you can most responsibly integrate DBT-informed strategies into your own practice.</p>`,
      accessibility: { role: "article", ariaLabel: "DBT in contemporary mental health" }
    },
    {
      type: "multipleChoice",
      question: "This course provides which of the following?",
      options: [
        { text: "Certification as a DBT therapist through the DBT-Linehan Board of Certification", isCorrect: false },
        { text: "A comprehensive overview of DBT foundations with six continuing education credits", isCorrect: true },
        { text: "Supervised clinical practice in delivering DBT skills groups", isCorrect: false },
        { text: "Authorization to market yourself as a certified DBT practitioner", isCorrect: false }
      ],
      explanation: "This course provides a comprehensive overview of DBT and earns six continuing education credits upon successful completion. It does not constitute DBT-intensive training or certification. Clinicians wishing to identify as DBT therapists should pursue additional training through Behavioral Tech, LLC, or certification through the DBT-Linehan Board of Certification.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: course scope" }
    },
    {
      type: "multiSelect",
      question: "Which of the following clinical populations can benefit from DBT-informed interventions? Select all that apply.",
      options: [
        { text: "Individuals with Borderline Personality Disorder", isCorrect: true },
        { text: "Clients with eating disorders such as bulimia nervosa and binge eating disorder", isCorrect: true },
        { text: "Adolescents with self-harm behaviors and emotional dysregulation", isCorrect: true },
        { text: "Individuals with substance use disorders and co-occurring emotional dysregulation", isCorrect: true }
      ],
      explanation: "All four populations can benefit from DBT-informed interventions. While DBT was originally developed for adults with BPD, it has been successfully adapted for adolescents, individuals with eating disorders, substance use disorders, and many other conditions characterized by emotional dysregulation and behavioral dysfunction.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: DBT populations" }
    },
    {
      type: "reflection",
      question: "Consider your current caseload and clinical setting. Which client presentations do you encounter that involve significant emotional dysregulation? As you begin this course, what specific knowledge or skills are you hoping to develop that would enhance your effectiveness with these clients? Take a moment to identify two or three specific learning goals that you can revisit as you progress through the modules.",
      accessibility: { role: "note", ariaLabel: "Reflection: personal learning goals" }
    },
    {
      type: "text",
      content: `<h3>Module Summary</h3>
<p>In this introductory module, you established the foundation for your study of Dialectical Behavior Therapy. You learned that DBT was developed by Marsha Linehan in the late 1980s and early 1990s to address the treatment of chronically suicidal individuals with Borderline Personality Disorder—a population for whom standard CBT approaches proved insufficient. You explored the core insight that effective treatment requires the simultaneous pursuit of both acceptance and change, held in dialectical tension. You learned that DBT integrates three intellectual traditions: cognitive-behavioral therapy, dialectical philosophy, and Zen Buddhist contemplative practices. You reviewed the course learning objectives, the nine-module structure, and the final assessment requirements. And you identified your personal learning goals for the course. In the next module, you will examine the theoretical foundations of DBT in depth, beginning with biosocial theory and the dialectical worldview.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 1 summary" }
    }
  ]
},


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 2: BIOSOCIAL THEORY AND THE DIALECTICAL WORLDVIEW
//  Target: ~4,500 words
//  Blocks: sectionDivider, text×5, imageText×2, accordion×2,
//          multipleChoice×3, multiSelect×1, matching, reflection, text (summary)
// ═══════════════════════════════════════════════════════════════
{
  title: "Biosocial Theory and the Dialectical Worldview",
  lessons: [
    {
      title: "Biosocial Theory and the Dialectical Worldview",
      content: "This module examines the two theoretical pillars that provide the intellectual foundation for every aspect of DBT: biosocial theory, which explains how emotional dysregulation develops through the transaction between biological vulnerability and environmental invalidation, and dialectical philosophy, which provides the framework for integrating acceptance and change in the therapeutic process."
    }
  ],
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 2,
      title: "Biosocial Theory and the Dialectical Worldview",
      subtitle: "Understanding the Transaction Model of Emotional Dysregulation and the Philosophy of Dialectics",
      accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 2: Biosocial Theory and the Dialectical Worldview" }
    },
    {
      type: "text",
      content: `<h3>Introduction to Biosocial Theory</h3>
<p>Biosocial theory is the cornerstone of DBT's understanding of how emotional dysregulation develops and persists. The theory is deceptively simple in its core claim: emotional dysregulation arises from the transaction between a biological predisposition toward emotional vulnerability and an invalidating social environment. Neither factor alone is sufficient to produce the pervasive patterns of emotional, behavioral, cognitive, and interpersonal dysregulation that characterize conditions like Borderline Personality Disorder. It is the ongoing interaction—the transaction—between these two factors that creates and maintains the clinical picture.</p>
<p>Understanding biosocial theory is not merely an academic exercise. It directly informs how DBT therapists conceptualize their clients' difficulties, how they communicate with clients about the origins of their suffering, and how they structure treatment. When a DBT therapist explains biosocial theory to a client, the explanation itself serves a powerful validating function: it communicates that the client's emotional pain is not their fault, that it has identifiable causes, and that those causes can be addressed through the development of specific skills. This stands in marked contrast to conceptualizations that locate the problem entirely within the individual—as a personality defect, a character flaw, or a failure of willpower—which are experienced as invalidating and often reinforce the very patterns the treatment seeks to change.</p>`,
      accessibility: { role: "article", ariaLabel: "Introduction to biosocial theory" }
    },
    {
      type: "imageText",
      image: IMG("Biosocial+Transaction+Model"),
      imageAlt: "Diagram illustrating the transaction model showing biological vulnerability interacting with invalidating environment",
      title: "The Biological Component: Emotional Vulnerability",
      content: `<p>The biological side of biosocial theory refers to a constitutional predisposition toward emotional vulnerability. Linehan identifies three defining characteristics of emotional vulnerability, each of which has been supported by subsequent neurobiological research:</p>
<p><strong>High Sensitivity to Emotional Stimuli:</strong> Emotionally vulnerable individuals detect and react to emotional cues at lower thresholds than others. They notice subtle shifts in tone of voice, facial expression, and interpersonal dynamics that others might miss entirely. In neurobiological terms, this reflects heightened amygdala reactivity—the brain's threat detection system fires more readily and intensely. What feels like a minor interpersonal slight to one person may register as a profound rejection to someone with high emotional sensitivity.</p>
<p><strong>High Reactivity:</strong> Once an emotional response is triggered, it occurs with greater intensity than would be expected given the precipitating event. The emotional reaction is not proportional to the stimulus as an outside observer might judge it, but it is entirely proportional to the person's subjective experience of the stimulus. This distinction is crucial: the intensity of the emotional response is not evidence of pathology or irrationality—it is the natural consequence of a nervous system that is biologically calibrated to produce strong emotional signals.</p>
<p><strong>Slow Return to Emotional Baseline:</strong> After an intense emotional response, the emotionally vulnerable individual takes significantly longer to return to their baseline emotional state. Where another person might recover from a hurtful comment within minutes or hours, the emotionally vulnerable person may remain activated for hours or days. This slow return to baseline means that new emotional provocations are often layered on top of still-active prior emotional responses, creating a cumulative emotional burden that can feel overwhelming and unmanageable.</p>`,
      imagePosition: "left",
      highlight: false,
      accessibility: { role: "article", ariaLabel: "Biological component of biosocial theory" }
    },
    {
      type: "text",
      content: `<h3>The Social Component: The Invalidating Environment</h3>
<p>The second element of biosocial theory is the invalidating environment. An invalidating environment is one in which the individual's private experiences—their emotions, thoughts, sensations, and beliefs—are persistently dismissed, minimized, punished, or responded to erratically. Invalidation can take many forms, ranging from overt abuse and neglect to subtler patterns of emotional dismissal that may occur even in well-intentioned families.</p>
<p>Linehan identifies several specific patterns of invalidation that are particularly damaging when they interact with biological emotional vulnerability. The first is the direct dismissal of emotional experience: telling a child who is crying that they have nothing to cry about, that they are overreacting, or that they need to toughen up. The second is the intermittent reinforcement of extreme emotional expression: ignoring moderate expressions of distress while responding only to escalated or crisis-level behavior, which teaches the individual that only extreme emotional displays are taken seriously. The third is the oversimplification of problem-solving: communicating that emotional problems are easy to solve and that the individual's inability to solve them reflects a personal deficiency rather than a genuine difficulty.</p>
<p>It is essential to understand that the concept of the invalidating environment does not assign blame to families or caregivers. Many invalidating environments arise from caregivers who are doing their best with limited resources, limited understanding of emotional sensitivity, or their own histories of invalidation. A well-meaning parent who tells an emotionally sensitive child to "just calm down" is not intentionally causing harm—they may genuinely believe that this instruction is helpful. But for the biologically vulnerable child, the repeated experience of having their emotional reality denied or minimized has cumulative and profound effects on their developing capacity for emotion regulation, self-understanding, and interpersonal trust.</p>
<p>Furthermore, cultural context plays a significant role in what constitutes invalidation. Cultural norms around emotional expression, gender expectations, stoicism, and family communication patterns can all create invalidating dynamics for emotionally vulnerable individuals, even in the absence of any intent to cause harm. A DBT therapist must understand these cultural dimensions to avoid the trap of applying a narrowly Western, middle-class framework to the assessment of invalidation across diverse populations.</p>`,
      accessibility: { role: "article", ariaLabel: "The invalidating environment" }
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "The Transaction: How Biology and Environment Interact",
          content: `<p>The critical insight of biosocial theory is that emotional dysregulation is not caused by either biological vulnerability or environmental invalidation alone. It is the ongoing transaction between the two that creates the problem. This transaction operates as a feedback loop that intensifies over time.</p>
<p>Consider a child born with high emotional sensitivity who grows up in a family that values emotional stoicism. The child experiences emotions intensely and expresses them freely. The family, uncomfortable with this emotional intensity, responds with messages like "You are too sensitive," "Stop making such a big deal out of everything," or "Why can't you just be normal?" The child learns three destructive lessons: (1) my emotional experiences are wrong or abnormal, (2) I cannot trust my own internal signals, and (3) the only way to get my needs met is to escalate my emotional expression until someone pays attention. These lessons, learned implicitly through thousands of interactions, produce the very patterns of emotional dysregulation that DBT is designed to treat.</p>
<p>As the child grows, the transaction continues and often intensifies. The individual's increasingly dysregulated behavior provokes more invalidation from the environment, which produces more dysregulation, which provokes more invalidation—a vicious cycle that can persist into adulthood and across relationships, workplaces, and therapeutic settings.</p>`
        },
        {
          title: "Implications for Treatment: Why Biosocial Theory Matters Clinically",
          content: `<p>Biosocial theory has direct implications for how DBT therapists approach treatment. First, it provides a non-blaming framework for understanding the client's difficulties. The therapist communicates: "Your emotional pain is the product of a specific transaction between your biology and your environment. It is not your fault, and it is not evidence that something is fundamentally wrong with you as a person." This is profoundly validating for clients who have spent years being told—or telling themselves—that they are too sensitive, too emotional, too dramatic, or too damaged.</p>
<p>Second, biosocial theory identifies the specific targets of treatment. Because dysregulation arises from the transaction between vulnerability and invalidation, treatment must address both sides of the equation. DBT teaches skills to manage biological vulnerability (emotion regulation, distress tolerance, mindfulness) while simultaneously creating a validating therapeutic environment that models and teaches effective emotional communication. The therapist becomes the validating environment that the client may never have had.</p>
<p>Third, biosocial theory explains why invalidation—even well-intentioned invalidation—can be therapeutically harmful. When a therapist dismisses a client's emotional reaction as "cognitive distortion" without first validating the emotional experience, the therapist inadvertently replicates the invalidating environment. This is why validation is not merely a "nice" therapeutic technique in DBT—it is a theoretically grounded, clinically necessary intervention that directly addresses the social side of the biosocial equation.</p>`
        },
        {
          title: "The Role of Neuroscience",
          content: `<p>Since Linehan first articulated biosocial theory, neuroimaging and neurobiological research have provided substantial support for its claims. Studies using functional magnetic resonance imaging (fMRI) have demonstrated that individuals with BPD show heightened amygdala activation in response to emotional stimuli, reduced prefrontal cortex modulation of emotional responses, and altered connectivity between limbic and cortical brain regions. These findings are consistent with the biosocial model's description of heightened emotional sensitivity and reduced capacity for top-down emotion regulation.</p>
<p>Research on the neurobiological effects of childhood maltreatment and chronic invalidation has further supported the model. Studies have shown that early adverse experiences can alter the development of stress response systems, including the hypothalamic-pituitary-adrenal (HPA) axis, and can affect the structural development of brain regions involved in emotion regulation. These findings suggest that the "social" side of the biosocial equation does not merely interact with biology in a metaphorical sense—it literally shapes the brain's development and functioning.</p>
<p>Importantly, neuroplasticity research suggests that the brain remains capable of change throughout the lifespan, which provides a neurobiological basis for the effectiveness of skills-based treatments like DBT. When clients learn and practice new skills for emotion regulation and distress tolerance, they are not simply learning behavioral tricks—they are literally rewiring neural pathways and strengthening the brain circuits involved in emotional modulation.</p>`
        }
      ],
      accessibility: { role: "region", ariaLabel: "Biosocial theory details accordion" }
    },
    {
      type: "multipleChoice",
      question: "According to biosocial theory, emotional dysregulation results from which of the following?",
      options: [
        { text: "A genetic defect in the serotonin transport system that produces chronic mood instability", isCorrect: false },
        { text: "Poor parenting practices that fail to teach appropriate emotional expression", isCorrect: false },
        { text: "The ongoing transaction between biological emotional vulnerability and an invalidating environment", isCorrect: true },
        { text: "Traumatic experiences during critical developmental periods that permanently alter brain structure", isCorrect: false }
      ],
      explanation: "Biosocial theory holds that emotional dysregulation arises from the transaction—the ongoing interaction—between a biological predisposition toward emotional vulnerability (high sensitivity, high reactivity, slow return to baseline) and an invalidating social environment that dismisses, minimizes, or punishes the individual's emotional experiences. Neither factor alone is sufficient; it is their interaction over time that produces pervasive dysregulation.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: biosocial theory core claim" }
    },
    {
      type: "text",
      content: `<h3>The Dialectical Worldview</h3>
<p>The second theoretical pillar of DBT is dialectical philosophy. While biosocial theory explains the origins of emotional dysregulation, dialectics provides the overarching philosophical framework that shapes every aspect of how DBT is delivered. The word "dialectical" in Dialectical Behavior Therapy is not decorative—it refers to a specific philosophical tradition with roots in Western philosophy (from Hegel and Marx) and Eastern philosophy (particularly Zen Buddhism) that has direct, practical implications for clinical work.</p>
<p>At its most basic level, dialectics rests on three core principles. The first principle is that reality is interconnected and whole. Nothing exists in isolation; everything is part of a larger system, and changes in any part of the system affect every other part. In clinical terms, this means that the client's behavior cannot be understood outside the context of their relationships, environment, biology, and history. A behavior that appears irrational or self-destructive when viewed in isolation may be perfectly understandable—and in some sense functional—when viewed within its full context.</p>
<p>The second principle is that reality is composed of opposing forces. Every truth contains its opposite, and every position exists in tension with its counterpart. The therapeutic relationship involves simultaneous warmth and firmness. The client is doing the best they can AND they need to do better. The client's behavior is both the problem and a creative attempt to solve the problem. These are not contradictions to be resolved—they are tensions to be held, understood, and synthesized.</p>
<p>The third principle is that the synthesis of opposing forces produces change. When a thesis (e.g., "I need to accept myself as I am") encounters its antithesis (e.g., "I need to change my destructive behaviors"), the resulting tension creates the potential for a synthesis: "I can accept myself as a whole person while actively working to change the specific behaviors that are causing me suffering." This synthesis then becomes a new thesis that will eventually encounter its own antithesis, producing ongoing growth and transformation. Change, in the dialectical view, is not a destination but a continuous process.</p>`,
      accessibility: { role: "article", ariaLabel: "The dialectical worldview" }
    },
    {
      type: "imageText",
      image: IMG("Dialectical+Thinking+Spectrum"),
      imageAlt: "Visual representation of dialectical thinking showing how thesis and antithesis synthesize into a new understanding",
      title: "Dialectical Thinking in Clinical Practice",
      content: `<p>For the practicing clinician, dialectical thinking is not merely an abstract philosophical exercise—it is a practical clinical tool that directly shapes therapeutic communication and decision-making. The dialectical therapist constantly monitors for polarization in the therapeutic relationship and in the client's thinking, and actively works to synthesize opposing positions rather than choosing sides.</p>
<p>Consider a common clinical scenario: a client in crisis tells their therapist, "I can't take this anymore. Nothing is ever going to change." A non-dialectical response might be either purely validating ("I understand how painful this is for you") or purely change-oriented ("Let's look at the evidence for and against that belief"). A dialectical response synthesizes both: "I hear how much pain you're in right now, and I believe you when you say it feels unbearable. AND the fact that you're here, talking to me, telling me about your pain, is itself evidence that some part of you is still reaching for change. Both of those things are true at the same time."</p>
<p>Dialectical thinking also helps therapists avoid the trap of rigid adherence to any single therapeutic stance. Sometimes the client needs more validation; sometimes they need more direct challenge. Sometimes the session needs structure; sometimes it needs space. The dialectical therapist reads the moment and responds flexibly, always seeking the synthesis that will be most therapeutic for this client at this point in treatment. This flexibility is not indecisiveness—it is a disciplined practice of holding multiple truths simultaneously and responding to the full complexity of the therapeutic situation.</p>`,
      imagePosition: "right",
      highlight: true,
      accessibility: { role: "article", ariaLabel: "Dialectical thinking in practice" }
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "The Three Primary Dialectics in DBT",
          content: `<p>While the principle of dialectics applies throughout DBT treatment, Linehan identifies three specific dialectical tensions that are particularly central to the therapy:</p>
<p><strong>1. Acceptance and Change:</strong> This is the overarching dialectic of DBT, already discussed in Module 1. The therapist communicates unconditional acceptance of the client's experience while simultaneously pushing for meaningful behavioral change. Acceptance strategies include validation, mindfulness, and distress tolerance skills. Change strategies include behavioral analysis, cognitive modification, and skills training. The synthesis is that genuine acceptance creates the conditions in which change becomes possible.</p>
<p><strong>2. Flexibility and Stability:</strong> The therapist must maintain a consistent therapeutic framework and structure (stability) while remaining responsive to the client's shifting emotional states and changing clinical needs (flexibility). Too much rigidity makes the therapy brittle and unresponsive; too much flexibility makes it chaotic and unpredictable. The synthesis is a treatment that is reliably structured yet dynamically responsive.</p>
<p><strong>3. Nurturing and Demanding:</strong> The therapist must nurture the client—providing warmth, empathy, care, and validation—while also demanding that the client do the hard work of behavior change. Too much nurturing can inadvertently reinforce avoidance and dependence; too much demanding can replicate the invalidating environment and drive the client out of treatment. The synthesis is a therapeutic relationship in which the client feels genuinely cared for AND genuinely challenged to grow.</p>`
        },
        {
          title: "Common Dialectical Failures and How to Recognize Them",
          content: `<p>Understanding dialectics also means recognizing when dialectical balance has been lost—both in the therapeutic relationship and in the client's daily life. Common dialectical failures include:</p>
<p><strong>Black-and-White Thinking:</strong> The client (or therapist) becomes stuck in all-or-nothing positions: "I'm either completely recovered or a total failure," "This relationship is either perfect or I need to end it," "If I can't do this perfectly, there's no point in trying." Dialectical thinking encourages movement toward "both/and" rather than "either/or."</p>
<p><strong>Emotional Reasoning:</strong> When intense emotions arise, the client treats the emotion as evidence of fact: "I feel worthless, therefore I am worthless," "I feel afraid, therefore the situation is dangerous." Dialectical thinking acknowledges that the emotion is real and valid while recognizing that emotions are not always accurate reflections of external reality.</p>
<p><strong>Rigidity in the Therapeutic Relationship:</strong> The therapist becomes locked into one mode—either always validating or always pushing for change—rather than fluidly moving between modes based on what the clinical moment requires. This represents a loss of the dialectical balance that makes DBT effective.</p>
<p><strong>Idealization and Devaluation:</strong> The client alternates between viewing the therapist (or the therapy, or themselves) as all-good or all-bad, without the capacity to hold a more nuanced, integrated view. Dialectical thinking helps both therapist and client recognize that people and relationships are complex, containing both strengths and limitations simultaneously.</p>`
        }
      ],
      accessibility: { role: "region", ariaLabel: "Dialectics in DBT accordion" }
    },
    {
      type: "multipleChoice",
      question: "Which of the following best illustrates a dialectical therapeutic response to a client who says, 'Nothing I do matters—I'll never get better'?",
      options: [
        { text: "Challenging the cognitive distortion by asking for evidence of progress the client has made", isCorrect: false },
        { text: "Validating the client's hopelessness while simultaneously highlighting evidence of their continued engagement in treatment", isCorrect: true },
        { text: "Redirecting the conversation to a structured skills practice exercise to avoid reinforcing hopelessness", isCorrect: false },
        { text: "Expressing empathy and sitting with the client's pain without offering any alternative perspective", isCorrect: false }
      ],
      explanation: "A dialectical response synthesizes validation and change rather than choosing one over the other. Validating the client's hopelessness (acceptance) while highlighting evidence of continued engagement (change) communicates: 'Your pain is real AND you are still fighting.' This reflects the core dialectical principle that opposing truths can coexist and that their synthesis creates movement toward healing.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: dialectical response" }
    },
    {
      type: "multiSelect",
      question: "Which of the following are characteristics of biological emotional vulnerability according to biosocial theory? Select all that apply.",
      options: [
        { text: "High sensitivity to emotional stimuli, with reactions triggered at lower thresholds", isCorrect: true },
        { text: "High reactivity, with emotions experienced at greater intensity than expected", isCorrect: true },
        { text: "Slow return to emotional baseline after an intense emotional response", isCorrect: true },
        { text: "Persistent cognitive distortions that misinterpret neutral stimuli as threatening", isCorrect: false }
      ],
      explanation: "Biosocial theory identifies three characteristics of biological emotional vulnerability: high sensitivity (lower thresholds for emotional activation), high reactivity (intense emotional responses), and slow return to baseline (prolonged emotional activation). While cognitive distortions may co-occur with emotional vulnerability, they are not part of the biosocial model's description of the biological component.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: emotional vulnerability characteristics" }
    },
    {
      type: "matching",
      matchingInstructions: "Match each dialectical concept with its correct description.",
      matchingPairs: [
        { term: "Thesis", definition: "An initial position, belief, or truth that represents one side of a tension" },
        { term: "Antithesis", definition: "The opposing position that stands in tension with the initial truth" },
        { term: "Synthesis", definition: "The integration of opposing positions into a new, more comprehensive understanding" },
        { term: "Dialectical tension", definition: "The productive discomfort of holding two seemingly contradictory truths simultaneously" },
        { term: "Transaction model", definition: "The ongoing interaction between biological vulnerability and environmental invalidation" },
        { term: "Invalidating environment", definition: "A social context in which private experiences are persistently dismissed, minimized, or punished" }
      ],
      accessibility: { role: "form", ariaLabel: "Matching exercise: dialectical concepts" }
    },
    {
      type: "multipleChoice",
      question: "Which of the following statements about the invalidating environment is most consistent with biosocial theory?",
      options: [
        { text: "Invalidation is always the result of intentional emotional abuse by caregivers", isCorrect: false },
        { text: "Invalidation occurs only in families with clinically diagnosable mental health conditions", isCorrect: false },
        { text: "Invalidation can arise even from well-intentioned caregivers and is shaped by cultural norms around emotional expression", isCorrect: true },
        { text: "Invalidation has the same effect regardless of the individual's level of biological emotional vulnerability", isCorrect: false }
      ],
      explanation: "Biosocial theory explicitly acknowledges that invalidation can arise from well-intentioned caregivers who are doing their best with limited resources or understanding. Cultural norms around emotional expression, gender roles, and communication patterns also contribute to invalidating dynamics. The theory is non-blaming and emphasizes the transaction—the interaction between biology and environment—rather than assigning fault to any party.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: invalidating environment" }
    },
    {
      type: "reflection",
      question: "Consider a client you have worked with (or a hypothetical client) who exhibits significant emotional dysregulation. Using the biosocial model, how would you conceptualize their difficulties? Can you identify aspects of both biological vulnerability (high sensitivity, high reactivity, slow return to baseline) and environmental invalidation (dismissal, minimization, intermittent reinforcement of extreme emotion) in their history? How might sharing this conceptualization with the client serve a therapeutic function?",
      accessibility: { role: "note", ariaLabel: "Reflection: applying biosocial theory" }
    },
    {
      type: "text",
      content: `<h3>Module Summary</h3>
<p>In this module, you examined the two theoretical pillars that underpin all of Dialectical Behavior Therapy. You learned that biosocial theory explains the development of emotional dysregulation as the product of an ongoing transaction between biological emotional vulnerability—characterized by high sensitivity, high reactivity, and slow return to baseline—and an invalidating social environment that dismisses, minimizes, or punishes emotional experience. You explored how this theory provides a non-blaming framework for understanding clients' difficulties and directly informs therapeutic practice, including the critical role of validation. You then examined dialectical philosophy and its three core principles: the interconnectedness of reality, the presence of opposing forces within every truth, and the transformative potential of synthesis. You learned how the three primary dialectics of DBT—acceptance and change, flexibility and stability, nurturing and demanding—shape every aspect of therapeutic interaction. In the next module, you will explore the structural architecture of comprehensive DBT treatment, including the four components that make up a full DBT program.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 2 summary" }
    }
  ]
},


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 3 (Course Module 4): CORE SKILL — MINDFULNESS
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════
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
{
  title: "Core Skill Module: Mindfulness",
  lessons: [
    {
      title: "Core Skill Module: Mindfulness",
      content: "This module provides an in-depth examination of the Mindfulness skill module, the foundational skill set of DBT. You will learn the three states of mind, the three 'What' skills, the three 'How' skills, and the concept of Wise Mind. Clinical applications and practice strategies are integrated throughout."
    }
  ],
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 4,
      title: "Core Skill Module: Mindfulness",
      subtitle: "The Foundational Practice of Awareness, Observation, and Wise Mind",
      accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 4: Core Skill Module — Mindfulness" }
    },
    {
      type: "text",
      content: `<h3>Mindfulness as the Foundation of DBT</h3>
<p>Mindfulness holds a unique position among the four core skill modules of Dialectical Behavior Therapy. It is the first skill module taught in every skills training cycle, and it is revisited at the beginning of every subsequent module rotation. This structural prominence reflects a fundamental clinical conviction: mindfulness is not merely one skill among many—it is the foundation upon which all other DBT skills rest. Without the capacity for present-moment awareness and non-judgmental observation, clients cannot effectively deploy the distress tolerance techniques that require noticing when they are in crisis, the emotion regulation strategies that depend on accurately identifying and labeling emotional states, or the interpersonal effectiveness skills that demand attention to both internal and external cues in social interactions.</p>
<p>Linehan's conceptualization of mindfulness in DBT draws heavily from Zen Buddhist contemplative traditions, but it is thoroughly secularized and operationalized for clinical use. In DBT, mindfulness is not a spiritual practice or a relaxation technique—it is a set of clearly defined behavioral skills that can be taught, practiced, measured, and refined. This distinction is important because it means that mindfulness skills are accessible to clients regardless of their spiritual beliefs, cultural background, or prior experience with meditation. A client who has never sat on a meditation cushion can learn to observe their breath, describe their emotional experience without judgment, and participate fully in the present moment—these are behavioral skills, not mystical states.</p>`,
      accessibility: { role: "article", ariaLabel: "Mindfulness as foundation of DBT" }
    },
    {
      type: "imageText",
      image: IMG("Three+States+of+Mind+DBT"),
      imageAlt: "Venn diagram showing Reasonable Mind, Emotion Mind, and their overlap forming Wise Mind",
      title: "The Three States of Mind",
      content: `<p>DBT organizes mindfulness around a central conceptual model: the three states of mind. Understanding these states provides clients with a framework for recognizing where they are at any given moment and for understanding where they want to be.</p>
<p><strong>Reasonable Mind</strong> is the state governed by logic, facts, evidence, and rational analysis. When you are in Reasonable Mind, you approach situations intellectually, weighing pros and cons, analyzing data, and making decisions based on factual information. Reasonable Mind is task-oriented and analytical. It is the state that allows you to balance a checkbook, follow a recipe, or analyze a research study. The limitation of Reasonable Mind is that it can be disconnected from emotional experience, leading to decisions that are logical but fail to account for the emotional realities of a situation.</p>
<p><strong>Emotion Mind</strong> is the state governed by feelings, moods, and emotional impulses. When you are in Emotion Mind, your thinking and behavior are controlled by your current emotional state. Emotions feel like facts—if you feel rejected, the relationship must be over; if you feel anxious, the situation must be dangerous. Emotion Mind is passionate, creative, and deeply connected to personal values and desires. Its limitation is that it can lead to impulsive, poorly considered actions that create additional problems.</p>
<p><strong>Wise Mind</strong> is the synthesis of Reasonable Mind and Emotion Mind—the dialectical integration of logic and emotion. Wise Mind is the state in which a person can access both their rational understanding and their emotional experience, honoring both without being dominated by either. Linehan describes Wise Mind as the "still, calm place" within each person that knows what is true and what is needed. It is not a passive state but an active integration—a way of knowing that draws on the full range of human experience. In clinical terms, Wise Mind is the state from which effective, values-consistent decisions are made.</p>`,
      imagePosition: "left",
      highlight: true,
      accessibility: { role: "article", ariaLabel: "Three states of mind in DBT mindfulness" }
    },
    {
      type: "multipleChoice",
      question: "A client arrives at session furious about a conflict with their partner and says, 'I'm done. I'm going to pack my bags tonight.' Which state of mind is the client most likely operating from?",
      options: [
        { text: "Reasonable Mind — they have carefully analyzed the relationship and concluded it should end", isCorrect: false },
        { text: "Emotion Mind — their current emotional state is driving their thinking and decision-making", isCorrect: true },
        { text: "Wise Mind — they have integrated both emotional and rational perspectives on the situation", isCorrect: false },
        { text: "A combination of Reasonable Mind and Emotion Mind without synthesis", isCorrect: false }
      ],
      explanation: "The client is in Emotion Mind: their immediate emotional reaction (fury) is controlling their thinking and driving an impulsive decision (packing bags tonight). In Emotion Mind, emotions feel like facts and behaviors are driven by the current emotional state rather than by an integration of logic and feeling. A Wise Mind response would involve acknowledging the genuine hurt and anger while also considering the fuller context of the relationship before making a major decision.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: states of mind" }
    },
    {
      type: "text",
      content: `<h3>The 'What' Skills: Observe, Describe, Participate</h3>
<p>DBT organizes mindfulness skills into two categories: "What" skills (what you do when practicing mindfulness) and "How" skills (how you do it). The three "What" skills are Observe, Describe, and Participate.</p>
<p><strong>Observe</strong> means to notice your experience without reacting to it. It is the skill of paying attention—to sensations in your body, to thoughts as they arise and pass, to emotions as they emerge, and to events in your environment. Observing is fundamentally different from thinking about your experience. When you observe, you step back and watch what is happening from a slight distance, the way you might watch clouds moving across the sky. You notice without grabbing hold, without pushing away, and without trying to change what you see. For individuals with high emotional vulnerability, the skill of observing is particularly valuable because it creates a microsecond of space between stimulus and response—a pause in which choice becomes possible. Instead of automatically reacting to an emotional trigger, the person who can observe notices: "I am having the thought that she rejected me. I notice a tightness in my chest. I notice an urge to withdraw." That moment of observation is the gateway to every other skill in DBT.</p>
<p><strong>Describe</strong> means to put words on your experience. After observing what is happening, you label it accurately and specifically. Instead of saying "I feel terrible," you describe: "I am feeling a combination of sadness and anxiety. The sadness seems connected to the conversation I had with my mother. The anxiety seems connected to my worry that I said the wrong thing." Describing uses language to organize and clarify internal experience. Research in affective neuroscience has demonstrated that the act of labeling emotions—sometimes called "affect labeling"—actually reduces amygdala activation and increases prefrontal cortex activity. In other words, putting words on feelings is not merely descriptive but is itself a form of emotion regulation. Effective describing uses observable, factual language rather than interpretive or judgmental language. The statement "I notice my heart racing and my hands sweating" is a description; the statement "I'm freaking out" is an interpretation.</p>
<p><strong>Participate</strong> means to throw yourself fully into the current activity without self-consciousness or internal commentary. Participating is the opposite of being a detached observer—it is complete engagement with the present moment. When you participate fully, you are not watching yourself from the outside, not evaluating your performance, not worrying about what will happen next. You are simply doing what you are doing with your whole attention. Athletes call this state "flow" or "being in the zone." Participation is the mindfulness skill that most directly connects to living a full, engaged, meaningful life. For many clients, the skill of participation is the bridge from mindfulness practice to mindfulness as a way of life.</p>`,
      accessibility: { role: "article", ariaLabel: "The What skills: Observe, Describe, Participate" }
    },
    {
      type: "text",
      content: `<h3>The 'How' Skills: Non-Judgmentally, One-Mindfully, Effectively</h3>
<p>The "How" skills describe the manner in which the "What" skills are practiced. They are not separate activities but qualities of attention that are applied to observing, describing, and participating.</p>
<p><strong>Non-Judgmentally</strong> means to observe, describe, and participate without evaluating experience as good or bad, right or wrong, fair or unfair. The non-judgmental stance does not mean approving of everything or abandoning personal values. It means stepping back from the habit of automatically labeling experience and instead sticking to the observable facts. Instead of thinking, "It's terrible that I'm anxious again—I'm such a failure," the non-judgmental approach would be: "I notice anxiety. My heart rate is elevated. I am having thoughts about failure." Judgments add a layer of suffering on top of the original experience: not only do you feel anxious, but now you feel bad about feeling anxious. By practicing non-judgment, clients can reduce this secondary layer of suffering and address the primary emotional experience more effectively.</p>
<p>The skill of non-judgment is one of the most challenging in the entire DBT curriculum, because judging is deeply habitual and often feels automatic and involuntary. Linehan acknowledges this difficulty and teaches clients to treat the practice of non-judgment as a skill to be developed over time, not a state to be achieved perfectly. When you notice that you are judging, you do not judge the judging—you simply notice it, describe it, and gently return to the non-judgmental stance. This recursive quality is what makes non-judgment a true practice rather than a one-time achievement.</p>
<p><strong>One-Mindfully</strong> means to focus on one thing at a time, with complete attention. In a culture that valorizes multitasking and constant connectivity, one-mindfulness is a radical act. It means that when you are washing dishes, you are washing dishes—not planning tomorrow's meeting, not replaying yesterday's argument, not scrolling through your phone. When you are in session with a client, you are fully present with that client—not thinking about your next client, not worrying about your documentation, not mentally composing an email. One-mindfulness is the antidote to the fragmented attention that characterizes modern life and that is particularly problematic for individuals who are already emotionally overwhelmed.</p>
<p><strong>Effectively</strong> means to do what works in a given situation, rather than what feels "right" or "fair" or "principled." This is often the most provocative of the How skills because it can feel like it asks clients to abandon their values. In fact, it asks them to be strategic about how they pursue their values. Consider a client who is in a custody dispute with an ex-partner who is being provocative and hostile. Acting "effectively" might mean remaining calm and measured during the custody hearing, even though the client's emotional experience is one of rage and injustice. The client is not abandoning their value of fairness—they are recognizing that in this particular situation, the most effective way to secure a fair outcome for their children is to present themselves as composed and reasonable. Effectiveness is the mindfulness skill that most directly challenges the rigid, black-and-white thinking that characterizes emotional dysregulation.</p>`,
      accessibility: { role: "article", ariaLabel: "The How skills: Non-Judgmentally, One-Mindfully, Effectively" }
    },
    {
      type: "imageText",
      image: IMG("Mindfulness+Skills+Grid+What+How"),
      imageAlt: "Grid showing the intersection of What skills (Observe, Describe, Participate) and How skills (Non-Judgmentally, One-Mindfully, Effectively)",
      title: "Integrating What and How Skills",
      content: `<p>The What and How skills are designed to be used in combination, creating a matrix of mindful awareness. For example, you can observe non-judgmentally (notice your emotional response without labeling it as bad), describe one-mindfully (put words on your current experience while giving it your full attention), or participate effectively (throw yourself fully into an interpersonal interaction while doing what works rather than what feels right in the moment).</p>
<p>In clinical practice, therapists help clients identify which specific mindfulness skill is most needed in a given situation. A client who is overwhelmed by emotional intensity may need to start with observing—simply noticing what is happening internally before trying to act. A client who is confused about what they are feeling may benefit most from describing—using specific, observable language to label their internal state. A client who is stuck in rumination and self-analysis may need to practice participating—shifting from observing their life to actually living it. And across all these applications, the How skills ensure that the practice is conducted with awareness, acceptance, and pragmatism.</p>
<p>For therapists who are new to DBT, the mindfulness module is often the most immediately useful in clinical practice. The skills of observing, describing, and adopting a non-judgmental stance can be integrated into virtually any therapeutic orientation and applied to virtually any clinical presentation. Even before learning the more specialized skills of distress tolerance, emotion regulation, and interpersonal effectiveness, a therapist who can teach and model mindfulness skills is already offering their clients something of substantial clinical value.</p>`,
      imagePosition: "right",
      highlight: false,
      accessibility: { role: "article", ariaLabel: "Integrating What and How mindfulness skills" }
    },
    {
      type: "multipleChoice",
      question: "A client tells their therapist: 'I noticed my jaw clenching when my coworker started talking about the deadline. I felt heat rising in my chest and I had the urge to interrupt.' Which 'What' skill is the client demonstrating?",
      options: [
        { text: "Observe — the client is noticing physical sensations, emotions, and urges without reacting", isCorrect: true },
        { text: "Describe — the client is putting verbal labels on their internal experience", isCorrect: false },
        { text: "Participate — the client is fully engaged in the interaction with their coworker", isCorrect: false },
        { text: "The client is demonstrating all three What skills simultaneously", isCorrect: false }
      ],
      explanation: "The client is primarily demonstrating the Observe skill by noticing physical sensations (jaw clenching, heat in chest) and urges (urge to interrupt) without acting on them. While the client is verbally reporting these observations to the therapist (which involves describing), the primary skill being demonstrated is observation—the capacity to notice internal experience as it occurs, creating space between stimulus and response.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: What skills identification" }
    },
    {
      type: "multipleChoice",
      question: "Which 'How' skill involves doing what works in a situation rather than doing what feels fair or principled?",
      options: [
        { text: "Non-Judgmentally — releasing evaluations of right and wrong", isCorrect: false },
        { text: "One-Mindfully — giving complete attention to the current moment", isCorrect: false },
        { text: "Effectively — focusing on what achieves the desired outcome in this specific context", isCorrect: true },
        { text: "Participate — fully engaging without self-consciousness", isCorrect: false }
      ],
      explanation: "Effectively is the How skill that involves focusing on what works rather than what feels right. It asks clients to be strategic about pursuing their goals and values, recognizing that the most effective approach in a given situation may not be the most emotionally satisfying one. This skill directly challenges the black-and-white thinking that often accompanies emotional dysregulation.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: How skills" }
    },
    {
      type: "matching",
      matchingInstructions: "Match each mindfulness skill with the correct example of its use in daily life.",
      matchingPairs: [
        { term: "Observe", definition: "Noticing the physical sensation of warmth from sunlight on your skin without labeling it or reacting" },
        { term: "Describe", definition: "Saying to yourself, 'I am feeling anxious—I notice tightness in my stomach and rapid thoughts'" },
        { term: "Participate", definition: "Becoming fully absorbed in playing music, losing awareness of everything except the notes and rhythm" },
        { term: "Non-Judgmentally", definition: "Noticing the thought 'I should have handled that differently' and letting it pass without labeling yourself as a failure" },
        { term: "One-Mindfully", definition: "Eating lunch with full attention to taste and texture, without checking your phone or thinking about work" },
        { term: "Effectively", definition: "Choosing to remain calm during a difficult conversation to achieve the best possible outcome for your family" }
      ],
      accessibility: { role: "form", ariaLabel: "Matching exercise: mindfulness skills and daily life examples" }
    },
    {
      type: "multiSelect",
      question: "Which of the following describe Wise Mind? Select all that apply.",
      options: [
        { text: "The synthesis of Reasonable Mind and Emotion Mind", isCorrect: true },
        { text: "A state of pure rational analysis free from emotional influence", isCorrect: false },
        { text: "An active integration of logic and emotion that draws on the full range of human experience", isCorrect: true },
        { text: "The state from which values-consistent, effective decisions are most likely to be made", isCorrect: true }
      ],
      explanation: "Wise Mind is the dialectical synthesis of Reasonable Mind and Emotion Mind—an active integration that draws on both logic and emotion. It is not pure rationality (which would be Reasonable Mind alone) but a state in which a person can access both their intellectual understanding and their emotional experience, honoring both without being dominated by either. Wise Mind is the state from which effective, values-consistent decisions are most likely.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: Wise Mind" }
    },
    {
      type: "reflection",
      question: "Think about a recent decision you made in your clinical practice—perhaps a decision about how to respond to a difficult moment in session, whether to adjust a treatment plan, or how to handle a boundary issue. Were you operating from Reasonable Mind, Emotion Mind, or Wise Mind? What would have changed if you had approached the situation from a different state of mind? How might you use the three states of mind framework to help clients understand their own decision-making patterns?",
      accessibility: { role: "note", ariaLabel: "Reflection: states of mind in your practice" }
    },
    {
      type: "text",
      content: `<h3>Module Summary</h3>
<p>In this module, you examined the Mindfulness skill module—the foundational skill set of Dialectical Behavior Therapy. You learned that mindfulness holds a unique structural position in DBT, taught first and revisited at the beginning of every skills training cycle, because all other DBT skills depend on the capacity for present-moment awareness and non-judgmental observation. You explored the three states of mind—Reasonable Mind, Emotion Mind, and Wise Mind—and understood Wise Mind as the dialectical synthesis that DBT seeks to cultivate. You learned the three "What" skills: Observe (notice without reacting), Describe (put words on experience), and Participate (engage fully in the present moment). You learned the three "How" skills: Non-Judgmentally (observe without evaluating), One-Mindfully (focus on one thing at a time), and Effectively (do what works in the situation). You practiced identifying these skills in clinical examples and in your own professional experience. In the next module, you will explore the Distress Tolerance skill module, which provides clients with strategies for surviving emotional crises without making them worse.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 4 summary" }
    }
  ]
},


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 4 (Course Module 5): CORE SKILL — DISTRESS TOLERANCE
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════
{
  title: "Core Skill Module: Distress Tolerance",
  lessons: [
    {
      title: "Core Skill Module: Distress Tolerance",
      content: "This module provides a comprehensive examination of the Distress Tolerance skill module, which equips clients with strategies for surviving emotional crises without resorting to self-destructive behaviors. You will learn crisis survival skills including TIPP, ACCEPTS, and IMPROVE, as well as reality acceptance skills including Radical Acceptance and Turning the Mind."
    }
  ],
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 5,
      title: "Core Skill Module: Distress Tolerance",
      subtitle: "Crisis Survival, Reality Acceptance, and the Skill of Bearing Pain Without Making It Worse",
      accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 5: Core Skill Module — Distress Tolerance" }
    },
    {
      type: "text",
      content: `<h3>The Purpose of Distress Tolerance</h3>
<p>Distress tolerance is the DBT skill module most directly concerned with the management of emotional crises. While emotion regulation skills (Module 6) aim to reduce the frequency and intensity of unwanted emotions over time, distress tolerance skills are designed for the immediate, acute moments when emotional pain feels unbearable and the risk of self-destructive behavior is highest. The fundamental premise of distress tolerance is that pain is an inevitable part of life, that not all painful situations can be immediately changed or resolved, and that the ability to tolerate distress without making it worse is a critically important skill that can be taught and learned.</p>
<p>For individuals with emotional dysregulation, the experience of intense emotional pain often triggers a frantic search for immediate relief. This search can lead to impulsive behaviors that provide short-term relief but create long-term problems: substance use, self-harm, binge eating, reckless spending, impulsive relationship decisions, verbal aggression, and other crisis-driven actions. Distress tolerance skills provide an alternative pathway—a set of strategies that acknowledge the reality of the pain while preventing the escalation of the crisis into a catastrophe.</p>
<p>It is important to understand that distress tolerance is not about eliminating pain, achieving serenity, or learning to enjoy suffering. It is about developing the capacity to experience intense emotional pain without engaging in behaviors that will make the situation worse. This is a pragmatic, achievable goal that can be taught even to clients who have spent years relying on maladaptive coping strategies. The skills do not require the client to feel better—they require the client to not make things worse while the emotional storm passes.</p>`,
      accessibility: { role: "article", ariaLabel: "Purpose of distress tolerance" }
    },
    {
      type: "imageText",
      image: IMG("TIPP+Skills+DBT+Crisis"),
      imageAlt: "Infographic showing the four TIPP skills: Temperature, Intense Exercise, Paced Breathing, and Progressive Muscle Relaxation",
      title: "TIPP Skills: Rapid Physiological Crisis Intervention",
      content: `<p>The TIPP skills are the fastest-acting crisis survival strategies in the DBT toolkit. They work by directly altering the body's physiological state, which in turn reduces the intensity of the emotional experience. TIPP is particularly valuable in acute crises because the skills can produce measurable physiological changes within seconds to minutes, providing enough relief for the client to access higher-level coping strategies.</p>
<p><strong>Temperature:</strong> Applying cold to the face—particularly submerging the face in cold water or holding a cold pack against the eyes and cheeks for 30 seconds—activates the mammalian dive reflex, which triggers an automatic parasympathetic nervous system response. Heart rate slows, blood pressure adjusts, and the intensity of emotional arousal decreases. This is not a metaphorical calming technique—it is a hardwired physiological response that works reliably across individuals.</p>
<p><strong>Intense Exercise:</strong> Engaging in brief, vigorous physical activity (running, jumping jacks, fast walking up stairs) for 10 to 20 minutes metabolizes the stress hormones (cortisol, adrenaline) that are fueling the emotional crisis. The exercise must be intense enough to significantly elevate heart rate. This skill is particularly effective when the emotional crisis involves anger or agitation, as it provides a physical outlet for the energy generated by the fight-or-flight response.</p>
<p><strong>Paced Breathing:</strong> Deliberately slowing the breath to approximately five to six breath cycles per minute (inhaling for about four seconds, exhaling for about six to eight seconds) activates the parasympathetic nervous system and reduces physiological arousal. The emphasis on extending the exhalation is key, as the vagus nerve is primarily stimulated during exhalation. Paced breathing can be practiced anywhere, at any time, without anyone else knowing you are doing it.</p>
<p><strong>Progressive Muscle Relaxation (or Paired Muscle Relaxation):</strong> Systematically tensing and then releasing muscle groups throughout the body produces a physiological relaxation response that is incompatible with the tension and arousal of emotional crisis. The practice also redirects attention from distressing thoughts to physical sensations, providing a grounding effect.</p>`,
      imagePosition: "left",
      highlight: false,
      accessibility: { role: "article", ariaLabel: "TIPP crisis survival skills" }
    },
    {
      type: "multipleChoice",
      question: "Which physiological mechanism makes the Temperature skill in TIPP effective for rapidly reducing emotional arousal?",
      options: [
        { text: "The distraction effect of unexpected cold sensations redirects attention from emotional pain", isCorrect: false },
        { text: "The mammalian dive reflex, which triggers an automatic parasympathetic nervous system response", isCorrect: true },
        { text: "Cold exposure increases serotonin production, which stabilizes mood within minutes", isCorrect: false },
        { text: "The shock of cold water interrupts rumination by activating the prefrontal cortex", isCorrect: false }
      ],
      explanation: "The Temperature skill works by activating the mammalian dive reflex—a hardwired physiological response triggered by cold applied to the face, particularly around the eyes and cheeks. This reflex automatically engages the parasympathetic nervous system, slowing heart rate and reducing the intensity of physiological arousal. It is one of the fastest-acting crisis intervention techniques available because it bypasses cognitive processing entirely.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: TIPP Temperature mechanism" }
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "ACCEPTS: Distraction Strategies for Crisis Survival",
          content: `<p>The ACCEPTS acronym provides seven distraction strategies that help clients get through acute emotional crises by temporarily shifting attention away from the source of distress. Unlike avoidance, which is a long-term pattern of refusing to address problems, distraction in the ACCEPTS framework is a deliberate, time-limited strategy used when emotional intensity is too high for problem-solving to be effective.</p>
<p><strong>Activities:</strong> Engaging in activities that demand attention and involvement—cleaning, cooking, exercising, working on a project, playing a game. The activity must be absorbing enough to compete with the emotional distress for attentional resources.</p>
<p><strong>Contributing:</strong> Doing something for someone else—volunteering, helping a friend, performing a kind act. Contributing shifts focus from internal pain to external purpose and can activate a sense of meaning and connection.</p>
<p><strong>Comparisons:</strong> Comparing your current situation to times when you were coping less effectively, or to the challenges others face. This is not about minimizing your pain but about gaining perspective that can make the current distress feel more manageable.</p>
<p><strong>Emotions (opposite):</strong> Deliberately generating emotions that are incompatible with the current distressing emotion—watching a comedy when feeling sad, listening to calming music when feeling agitated, looking at beautiful images when feeling overwhelmed.</p>
<p><strong>Pushing away:</strong> Mentally setting aside the distressing situation temporarily—imagining putting the problem in a box and placing it on a shelf, agreeing with yourself to return to it at a specific time when you are more resourced.</p>
<p><strong>Thoughts:</strong> Occupying the mind with demanding cognitive activities—counting backward by sevens, reciting song lyrics, naming all the states, doing mental math. These activities compete with ruminative thinking for cognitive resources.</p>
<p><strong>Sensations:</strong> Using strong, safe physical sensations to ground yourself in the present moment—holding an ice cube, snapping a rubber band on the wrist (used carefully and with clinical judgment), squeezing a stress ball, smelling something strong like peppermint oil, tasting something intensely sour or spicy.</p>`
        },
        {
          title: "IMPROVE the Moment: Enhancing Current Coping",
          content: `<p>The IMPROVE acronym provides strategies for making the current moment more tolerable when you cannot change the situation itself.</p>
<p><strong>Imagery:</strong> Creating a mental image of a safe, peaceful place; imagining yourself coping effectively with the current situation; visualizing the crisis passing and yourself on the other side of it.</p>
<p><strong>Meaning:</strong> Finding or creating meaning in the current suffering—connecting the pain to a larger purpose, a value, or a narrative of growth. "This experience is teaching me something about my own resilience."</p>
<p><strong>Prayer/Spiritual Practice:</strong> Engaging with whatever spiritual or philosophical framework provides comfort and perspective—prayer, meditation, reading meaningful texts, connecting with a sense of something larger than yourself.</p>
<p><strong>Relaxation:</strong> Using deliberate relaxation techniques such as progressive muscle relaxation, deep breathing, guided imagery, or gentle stretching to reduce physical tension and promote a calmer physiological state.</p>
<p><strong>One Thing in the Moment:</strong> Focusing all of your attention on just the current moment—the breath you are taking right now, the step you are taking right now, the word you are reading right now. This is a direct application of the one-mindfulness skill from the mindfulness module.</p>
<p><strong>Vacation (Brief):</strong> Taking a short mental or physical break from the situation—going for a brief walk, taking a warm bath, sitting in a park for ten minutes, reading a few pages of a novel. The vacation must be brief and deliberate, not an extended escape from responsibilities.</p>
<p><strong>Encouragement:</strong> Coaching yourself with supportive, realistic self-talk: "I can get through this. I have survived difficult things before. This feeling will not last forever. I am doing the best I can right now."</p>`
        }
      ],
      accessibility: { role: "region", ariaLabel: "ACCEPTS and IMPROVE skills accordion" }
    },
    {
      type: "text",
      content: `<h3>Reality Acceptance Skills: Radical Acceptance and Turning the Mind</h3>
<p>While crisis survival skills address the acute, short-term management of emotional distress, the reality acceptance skills address a deeper and more challenging dimension of distress tolerance: the capacity to accept painful realities that cannot be changed. This is the dimension of distress tolerance that most clearly reflects the acceptance side of DBT's core dialectic.</p>
<p><strong>Radical Acceptance</strong> is the practice of fully accepting reality as it is in this moment, without fighting it, without denying it, and without judging it as something that should not be. The word "radical" means "at the root"—radical acceptance goes all the way to the root of reality, leaving no part of the truth unacknowledged. It is important to understand what radical acceptance is NOT: it is not approval, endorsement, or passivity. Accepting that something has happened does not mean agreeing that it should have happened or giving up on working to change future circumstances. A person who radically accepts a cancer diagnosis is not saying, "This is fine and I don't care." They are saying, "This is the reality I face, and I will respond to it from a place of clarity rather than denial."</p>
<p>For many clients, radical acceptance is the single most difficult skill in the entire DBT curriculum. The idea of accepting a painful reality—an abusive childhood, a devastating loss, a chronic illness, an act of injustice—can feel morally repugnant, as if acceptance equates to condoning what happened. The DBT therapist must carefully and repeatedly clarify that acceptance is not agreement. Refusing to accept reality does not change reality; it only adds a layer of suffering—the suffering of fighting against what has already occurred. Linehan expresses this principle concisely: "Pain plus non-acceptance equals suffering."</p>
<p><strong>Turning the Mind</strong> is the bridge between non-acceptance and radical acceptance. It acknowledges that acceptance is not a one-time decision but an ongoing, repeated choice that must be made again and again, often many times in a single day. Turning the Mind means choosing, in this moment, to orient yourself toward acceptance rather than away from it. It does not mean you have achieved acceptance—it means you are choosing the direction of acceptance. When you find yourself back in non-acceptance (which is inevitable), you simply turn the mind again. And again. And again. Each time you turn the mind, you strengthen the neural and behavioral pathways associated with acceptance, making it slightly more accessible the next time.</p>`,
      accessibility: { role: "article", ariaLabel: "Radical acceptance and turning the mind" }
    },
    {
      type: "multipleChoice",
      question: "Which of the following best describes the concept of Radical Acceptance in DBT?",
      options: [
        { text: "Approving of a painful situation and agreeing that it was acceptable or justified", isCorrect: false },
        { text: "Giving up on efforts to change future circumstances because the past cannot be undone", isCorrect: false },
        { text: "Fully acknowledging reality as it is without fighting, denying, or judging it, while remaining committed to future change", isCorrect: true },
        { text: "Achieving a permanent state of peace and serenity about all painful life experiences", isCorrect: false }
      ],
      explanation: "Radical Acceptance means fully acknowledging reality as it is—at the root, without any part of the truth left unacknowledged. It does not mean approval, endorsement, passivity, or giving up. A person can radically accept a painful reality while still working to change future circumstances. The key insight is that refusing to accept what has already happened does not change it—it only adds the suffering of fighting against reality. Linehan's principle: 'Pain plus non-acceptance equals suffering.'",
      accessibility: { role: "form", ariaLabel: "Knowledge check: radical acceptance" }
    },
    {
      type: "imageText",
      image: IMG("Willingness+vs+Willfulness+Scale"),
      imageAlt: "Illustration contrasting willingness (open, accepting stance) with willfulness (closed, resistant stance) in distress tolerance",
      title: "Willingness and Willfulness",
      content: `<p>Linehan introduces two additional concepts that are essential to understanding distress tolerance: willingness and willfulness.</p>
<p><strong>Willingness</strong> is the stance of openness to experience—a readiness to do what is needed in the current moment, to respond to situations as they are rather than as you wish they were, and to participate fully in life even when life is painful. Willingness is the behavioral expression of radical acceptance. It means showing up, doing the next thing that needs to be done, and allowing yourself to be effective even when you would rather shut down, withdraw, or fight against reality.</p>
<p><strong>Willfulness</strong> is the opposite stance—the refusal to tolerate the moment, the insistence that reality should be different from what it is, and the impulse to either give up entirely or try to control the uncontrollable. Willfulness manifests as sitting down in the middle of the road and refusing to move, metaphorically speaking. It appears as the client who says, "I shouldn't have to deal with this," "It's not fair," or "I give up." While these reactions are understandable and valid expressions of pain, they are willful in the sense that they refuse to engage with reality as it is.</p>
<p>The dialectical relationship between willingness and willfulness is important: everyone moves between these stances multiple times in a day. The goal is not to eliminate willfulness—which is a natural human response to pain—but to notice when you have become willful and to gently redirect yourself toward willingness. This is closely related to the skill of Turning the Mind: when you notice willfulness, you can choose to turn toward willingness, even if only for this moment, even if you know you will have to make that choice again in five minutes.</p>`,
      imagePosition: "right",
      highlight: true,
      accessibility: { role: "article", ariaLabel: "Willingness versus willfulness" }
    },
    {
      type: "matching",
      matchingInstructions: "Match each distress tolerance skill with the correct application.",
      matchingPairs: [
        { term: "TIPP — Temperature", definition: "Applying cold water or ice pack to the face to activate the dive reflex and rapidly lower arousal" },
        { term: "ACCEPTS — Contributing", definition: "Helping a neighbor or volunteering to shift focus from internal pain to external purpose" },
        { term: "IMPROVE — Meaning", definition: "Connecting current suffering to personal growth or a larger life narrative" },
        { term: "Radical Acceptance", definition: "Fully acknowledging the reality of a chronic illness diagnosis without fighting or denying it" },
        { term: "Turning the Mind", definition: "Repeatedly choosing to orient toward acceptance each time you notice yourself back in non-acceptance" },
        { term: "Willingness", definition: "Showing up and doing what needs to be done even when you would rather shut down or withdraw" }
      ],
      accessibility: { role: "form", ariaLabel: "Matching exercise: distress tolerance skills" }
    },
    {
      type: "multiSelect",
      question: "A client in acute emotional crisis has been engaging in self-harm when overwhelmed. Which of the following distress tolerance strategies would be most appropriate to teach first for immediate crisis management? Select all that apply.",
      options: [
        { text: "TIPP skills to rapidly reduce physiological arousal", isCorrect: true },
        { text: "Radical Acceptance to fully accept the emotional pain they are experiencing", isCorrect: false },
        { text: "ACCEPTS distraction strategies to redirect attention from the crisis", isCorrect: true },
        { text: "IMPROVE the moment with self-encouragement and grounding techniques", isCorrect: true }
      ],
      explanation: "For a client in acute crisis with a history of self-harm, the immediate priority is crisis survival—getting through the moment without self-destructive behavior. TIPP skills (rapid physiological intervention), ACCEPTS (distraction), and IMPROVE (making the moment more tolerable) are all crisis survival skills designed for this purpose. Radical Acceptance, while vitally important, addresses longer-term patterns of fighting against painful realities and is not typically the first-line intervention in an acute crisis.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: crisis intervention skills" }
    },
    {
      type: "reflection",
      question: "Think about a client you have worked with who struggled with crisis-driven impulsive behaviors. Which distress tolerance skills from this module might have been most helpful for that client? Consider both the crisis survival skills (TIPP, ACCEPTS, IMPROVE) and the reality acceptance skills (Radical Acceptance, Turning the Mind, Willingness). How would you sequence the introduction of these skills in treatment, and what barriers might the client face in learning to use them?",
      accessibility: { role: "note", ariaLabel: "Reflection: distress tolerance in practice" }
    },
    {
      type: "text",
      content: `<h3>Module Summary</h3>
<p>In this module, you examined the Distress Tolerance skill module, which addresses the management of emotional crises and the development of the capacity to bear pain without making it worse. You learned the fundamental premise that pain is inevitable but that the ability to tolerate distress without engaging in self-destructive behavior is a learnable skill. You explored the TIPP skills—Temperature, Intense Exercise, Paced Breathing, and Progressive Muscle Relaxation—as rapid physiological interventions for acute crisis. You learned the ACCEPTS distraction strategies and the IMPROVE the moment techniques for getting through crises when the emotional intensity is too high for problem-solving. You examined the reality acceptance skills—Radical Acceptance, Turning the Mind, Willingness and Willfulness—and understood how they address the deeper challenge of accepting painful realities that cannot be changed. You practiced matching these skills to clinical scenarios and reflected on how to apply them in your own clinical work. In the next module, you will explore the Emotion Regulation skill module, which aims to reduce the frequency and intensity of unwanted emotions over time.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 5 summary" }
    }
  ]
},


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 5 (Course Module 6): CORE SKILL — EMOTION REGULATION
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════
{
  title: "Core Skill Module: Emotion Regulation",
  lessons: [
    {
      title: "Core Skill Module: Emotion Regulation",
      content: "This module provides a thorough examination of the Emotion Regulation skill module, which targets the understanding, management, and proactive reduction of unwanted emotional experiences. You will learn the model of emotions, Check the Facts, Opposite Action, Problem Solving, ABC PLEASE, and the Wave Skill."
    }
  ],
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 6,
      title: "Core Skill Module: Emotion Regulation",
      subtitle: "Understanding, Managing, and Reducing the Frequency of Unwanted Emotions",
      accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 6: Core Skill Module — Emotion Regulation" }
    },
    {
      type: "text",
      content: `<h3>The Goals of Emotion Regulation</h3>
<p>The Emotion Regulation module operates at a fundamentally different level than Distress Tolerance. While distress tolerance focuses on surviving acute emotional crises—getting through the moment without making things worse—emotion regulation aims to change the emotional experience itself. The goals of the emotion regulation module are to understand emotions and their function, reduce emotional vulnerability, decrease the frequency of unwanted emotions, and decrease emotional suffering. These are ambitious goals, but they are achievable through the systematic application of specific, learnable skills.</p>
<p>A critical starting point for emotion regulation is understanding that emotions are not the enemy. Emotions have evolved to serve essential functions: fear protects us from danger, anger motivates us to address injustice, sadness signals loss and elicits support from others, joy reinforces behaviors that promote wellbeing. The problem is not that emotionally dysregulated individuals have emotions—it is that their emotions are experienced with such intensity, frequency, and duration that they overwhelm the individual's capacity to function effectively. Emotion regulation skills do not aim to eliminate emotions; they aim to bring the emotional system back into balance so that emotions serve their intended functions without dominating and derailing the person's life.</p>
<p>This distinction between healthy emotional experience and emotional dysregulation is clinically important because many clients have been told—directly or indirectly—that their emotions are the problem. They may have internalized the message that they are "too emotional," "too sensitive," or "too much." The emotion regulation module begins by validating the legitimacy of emotional experience and educating clients about the adaptive functions of every emotion. From this foundation of understanding, the specific regulation skills are introduced not as tools for suppressing emotion but as tools for gaining greater choice over how emotions are experienced and expressed.</p>`,
      accessibility: { role: "article", ariaLabel: "Goals of emotion regulation" }
    },
    {
      type: "imageText",
      image: IMG("DBT+Model+of+Emotions+Cycle"),
      imageAlt: "Flow diagram showing the DBT model of emotions: prompting event, interpretation, emotional response, urge to action, and behavior",
      title: "The DBT Model of Emotions",
      content: `<p>DBT teaches a specific model for understanding how emotions work. This model breaks the emotional experience into identifiable components, each of which represents a potential point of intervention:</p>
<p><strong>Prompting Event:</strong> Something happens in the environment (or internally, such as a thought or memory) that sets the emotional process in motion. The prompting event can be external ("My partner criticized my cooking") or internal ("I remembered the argument we had last week").</p>
<p><strong>Interpretation:</strong> The person assigns meaning to the prompting event based on their beliefs, assumptions, past experiences, and current emotional state. The same event can generate very different emotions depending on how it is interpreted. "My partner criticized my cooking" could be interpreted as "They think I'm incompetent" (shame), "They're being controlling" (anger), or "They're trying to help me improve" (mild annoyance or even gratitude).</p>
<p><strong>Emotional Response:</strong> The emotion arises as a complex package that includes a subjective feeling state ("I feel ashamed"), physiological changes (face flushing, stomach tightening), cognitive changes (thoughts about inadequacy), and an action urge (wanting to hide or withdraw). The emotion is not just a feeling—it is a full-body, full-mind experience.</p>
<p><strong>Action Urge:</strong> Every emotion comes with a built-in urge to act in a specific way. Fear generates the urge to flee or avoid. Anger generates the urge to attack or confront. Shame generates the urge to hide or withdraw. Sadness generates the urge to isolate or seek comfort. These urges are not the same as actions—a person can feel the urge to flee without actually fleeing. The gap between urge and action is where emotional regulation skills have their greatest impact.</p>
<p><strong>Behavior and Consequences:</strong> The person either acts on the urge, modifies their response, or uses a skill to respond differently. The behavior then produces consequences that feed back into the system, potentially becoming the prompting event for a new emotional cycle.</p>`,
      imagePosition: "left",
      highlight: false,
      accessibility: { role: "article", ariaLabel: "DBT model of emotions" }
    },
    {
      type: "multipleChoice",
      question: "In the DBT model of emotions, at which point does the skill of 'Check the Facts' intervene in the emotional cycle?",
      options: [
        { text: "At the prompting event, by teaching clients to avoid triggering situations", isCorrect: false },
        { text: "At the interpretation stage, by evaluating whether the assessment of the situation is accurate", isCorrect: true },
        { text: "At the action urge stage, by redirecting the urge toward a more adaptive behavior", isCorrect: false },
        { text: "At the consequences stage, by analyzing the outcomes of previous emotional responses", isCorrect: false }
      ],
      explanation: "Check the Facts intervenes at the interpretation stage of the emotional cycle. It asks the client to examine whether their assessment of the prompting event is accurate and complete: What are the facts? What are my assumptions? Is there evidence that supports my interpretation? Could there be another explanation? If the interpretation is inaccurate or incomplete, correcting it can change the emotional response entirely.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: Check the Facts" }
    },
    {
      type: "text",
      content: `<h3>Core Emotion Regulation Skills</h3>
<p><strong>Check the Facts:</strong> This skill targets the interpretation component of the emotional model. When an intense emotion arises, the client is taught to pause and systematically examine whether their interpretation of the situation is accurate. The questions include: What event triggered the emotion? What are the facts of the situation (observable, verifiable facts, not interpretations)? What am I assuming or interpreting? Is there an alternative explanation? What is the most likely interpretation given all available evidence? If the emotional response is based on an inaccurate interpretation, correcting the interpretation can change the emotion. If the interpretation is accurate, the emotion is likely justified, and other skills (such as Problem Solving or Opposite Action) may be more appropriate.</p>
<p><strong>Opposite Action:</strong> When an emotion is unjustified—meaning the interpretation does not fit the facts, or the intensity of the emotion is disproportionate to the situation—Opposite Action is the skill of choice. Opposite Action involves acting in a way that is opposite to the urge generated by the emotion. If fear is unjustified, the opposite action is to approach what you are avoiding rather than flee. If anger is unjustified, the opposite action is to be gentle and take a step back rather than attack. If shame is unjustified, the opposite action is to share the experience with others rather than hide. If sadness is unjustified, the opposite action is to engage in activities and social connection rather than isolate. The mechanism of Opposite Action is well-supported by research on exposure therapy and behavioral activation: when you repeatedly act opposite to an unjustified emotion, the emotion's intensity diminishes over time because the feared consequences do not materialize.</p>
<p><strong>Problem Solving:</strong> When an emotion is justified—meaning the interpretation accurately reflects a real problem that needs to be addressed—the appropriate skill is Problem Solving rather than Opposite Action. Problem Solving involves identifying the problem, generating potential solutions, evaluating each solution, selecting the best option, implementing it, and evaluating the outcome. This is a structured, step-by-step approach to addressing the real-world situations that are generating justified emotional distress. The critical clinical judgment involved in emotion regulation is distinguishing between situations that call for Opposite Action (emotion does not fit the facts) and situations that call for Problem Solving (emotion fits the facts and the situation needs to change).</p>`,
      accessibility: { role: "article", ariaLabel: "Core emotion regulation skills" }
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "ABC PLEASE: Building Emotional Resilience",
          content: `<p>ABC PLEASE is a set of proactive strategies designed to reduce emotional vulnerability over time by building a lifestyle foundation that supports emotional balance. Unlike Check the Facts, Opposite Action, and Problem Solving—which are reactive strategies used when emotions have already arisen—ABC PLEASE is a preventive approach that aims to reduce the frequency and intensity of emotional episodes before they occur.</p>
<p><strong>A — Accumulate Positive Experiences:</strong> Deliberately building pleasant events into daily life, both short-term (daily activities that bring enjoyment, mastery, or connection) and long-term (working toward goals that align with personal values). Research on behavioral activation consistently shows that increasing engagement in pleasant, meaningful activities has a direct positive effect on mood and emotional stability.</p>
<p><strong>B — Build Mastery:</strong> Engaging in activities that produce a sense of competence, achievement, and self-efficacy. Building mastery means doing things that are challenging enough to produce a sense of accomplishment but not so challenging that they produce frustration and failure. Over time, repeated experiences of mastery strengthen the individual's belief in their own capacity to cope with difficulties.</p>
<p><strong>C — Cope Ahead:</strong> Anticipating difficult situations and mentally rehearsing how to use skills effectively in those situations. Coping ahead involves imagining the situation in detail, identifying potential emotional triggers, selecting appropriate skills, and mentally practicing using those skills until the rehearsal feels natural and automatic. This is similar to what elite athletes call "mental rehearsal" or "visualization."</p>
<p><strong>PLEASE — Treat Physical Illness, Eat Balanced Meals, Avoid Mood-Altering Substances, Sleep Well, Exercise Regularly:</strong> The PLEASE skills address the biological vulnerability side of the biosocial equation by ensuring that the body is in the best possible condition to support emotional regulation. Sleep deprivation, poor nutrition, substance use, untreated medical conditions, and sedentary lifestyle all increase emotional vulnerability. By attending to these physical foundations, clients reduce their baseline vulnerability and make it easier for their other emotion regulation skills to be effective.</p>`
        },
        {
          title: "The Wave Skill: Riding the Emotion",
          content: `<p>The Wave Skill (also called "observing and describing emotions" or "mindfulness of current emotion") is the emotion regulation skill that most directly applies the mindfulness skills from Module 4. The Wave Skill involves treating the current emotion as a wave in the ocean—observing it as it builds, crests, and subsides, without fighting it, feeding it, or trying to make it stop.</p>
<p>The practice involves several steps: First, observe the emotion with curiosity rather than judgment. Notice where you feel it in your body. Notice its intensity on a scale of 0 to 10. Notice the thoughts that accompany it. Second, describe the emotion accurately—name it, characterize its quality, note its physical expression. Third, allow the emotion to be present without trying to push it away or hold onto it. Emotions, like waves, naturally rise and fall if they are not artificially sustained by rumination, avoidance, or behavioral escalation. Fourth, remember that you are not your emotion. The emotion is an experience you are having, not a definition of who you are. You can observe the wave without being drowned by it.</p>
<p>The Wave Skill is particularly important because it directly addresses one of the core fears of emotionally dysregulated individuals: the belief that if they allow themselves to fully experience an intense emotion, they will be overwhelmed, destroyed, or unable to function. By repeatedly practicing the experience of observing intense emotions rise and fall without catastrophic consequences, clients develop experiential evidence that emotions—even very intense ones—are survivable and temporary.</p>`
        }
      ],
      accessibility: { role: "region", ariaLabel: "ABC PLEASE and Wave Skill accordion" }
    },
    {
      type: "imageText",
      image: IMG("Opposite+Action+vs+Problem+Solving"),
      imageAlt: "Decision flowchart showing when to use Opposite Action versus Problem Solving based on whether the emotion fits the facts",
      title: "The Clinical Decision Point: Opposite Action or Problem Solving?",
      content: `<p>One of the most important clinical judgment calls in the Emotion Regulation module is determining whether a client's emotional response fits the facts of the situation. This determination drives the choice between two fundamentally different skill pathways, and getting it wrong can be therapeutically counterproductive.</p>
<p>When the emotion does NOT fit the facts—meaning the interpretation is inaccurate, the intensity is disproportionate, or the emotion is being maintained by rumination rather than current reality—the appropriate intervention is Opposite Action. The client acts opposite to the emotion's action urge, which over time reduces the emotion's intensity and frequency through a mechanism similar to exposure. For example, a client who feels intense shame about a minor social awkwardness would use Opposite Action by deliberately sharing the experience with trusted others rather than hiding, thereby learning experientially that the feared social catastrophe does not occur.</p>
<p>When the emotion DOES fit the facts—meaning the interpretation is accurate and the emotion is signaling a genuine problem that needs to be addressed—the appropriate intervention is Problem Solving. Using Opposite Action when the emotion is justified can be invalidating and therapeutically harmful. If a client feels anger because they are being treated unfairly at work, teaching them to "act gently" (Opposite Action for anger) would be dismissing a legitimate emotional signal. Instead, Problem Solving helps the client channel the energy of justified anger into effective action: identifying options, evaluating consequences, and implementing a plan to address the actual problem.</p>
<p>Teaching clients to make this distinction is itself a form of emotional education. Many clients with histories of invalidation have been taught to distrust all of their emotional responses. The Check the Facts skill, followed by the deliberate choice between Opposite Action and Problem Solving, communicates a profoundly validating message: sometimes your emotions are accurate and important, and when they are, the appropriate response is to listen to them and act on the information they provide. This is a radical departure from the implicit message many clients have received throughout their lives: that their emotions are always wrong, always too much, and always something to be suppressed or ignored.</p>`,
      imagePosition: "right",
      highlight: true,
      accessibility: { role: "article", ariaLabel: "Decision point between Opposite Action and Problem Solving" }
    },
    {
      type: "multipleChoice",
      question: "A client feels intense anger after their manager publicly criticized their work in a team meeting. After using Check the Facts, the client determines that the criticism was factually inaccurate and professionally inappropriate. Which emotion regulation skill is most appropriate next?",
      options: [
        { text: "Opposite Action — act gently and let the anger go, since expressing anger is always counterproductive", isCorrect: false },
        { text: "The Wave Skill — simply observe the anger rising and falling without taking any action", isCorrect: false },
        { text: "Problem Solving — address the real problem by planning a professional response to the inaccurate criticism", isCorrect: true },
        { text: "ABC PLEASE — build mastery by working harder to ensure the criticism cannot be repeated", isCorrect: false }
      ],
      explanation: "When Check the Facts confirms that the emotion fits the facts—in this case, the criticism was factually inaccurate and professionally inappropriate, making anger a justified response—the appropriate skill is Problem Solving rather than Opposite Action. The client's anger is signaling a real problem that needs to be addressed. Problem Solving would involve identifying options (speaking with the manager privately, documenting the incident, involving HR if appropriate) and selecting the most effective response.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: choosing between Opposite Action and Problem Solving" }
    },
    {
      type: "multiSelect",
      question: "Which of the following are components of the ABC PLEASE skills? Select all that apply.",
      options: [
        { text: "Accumulate Positive Experiences by building pleasant events into daily life", isCorrect: true },
        { text: "Analyze Behavioral Consequences by tracking the outcomes of emotional responses", isCorrect: false },
        { text: "Build Mastery by engaging in activities that produce a sense of competence", isCorrect: true },
        { text: "Practice good sleep hygiene, balanced nutrition, and regular exercise", isCorrect: true }
      ],
      explanation: "ABC PLEASE includes Accumulate Positive Experiences (A), Build Mastery (B), Cope Ahead (C), and PLEASE skills (treating Physical illness, balanced eating, avoiding mood-altering substances, good Sleep hygiene, and regular Exercise). These proactive strategies reduce emotional vulnerability over time by building a lifestyle foundation that supports emotional balance.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: ABC PLEASE components" }
    },
    {
      type: "matching",
      matchingInstructions: "Match each emotion regulation skill with the situation where it is most appropriately applied.",
      matchingPairs: [
        { term: "Check the Facts", definition: "You feel intense jealousy after seeing your partner talking to an attractive stranger at a party" },
        { term: "Opposite Action", definition: "You feel shame about a mistake, but the shame is disproportionate — the mistake was minor and human" },
        { term: "Problem Solving", definition: "You feel justified anger about a billing error that is costing you money each month" },
        { term: "ABC PLEASE — Build Mastery", definition: "You want to reduce your overall emotional vulnerability by developing new competencies at work" },
        { term: "ABC PLEASE — Cope Ahead", definition: "You have a difficult conversation with a family member scheduled for next week" },
        { term: "Wave Skill", definition: "You are experiencing a wave of grief on the anniversary of a loved one's death" }
      ],
      accessibility: { role: "form", ariaLabel: "Matching exercise: emotion regulation skills application" }
    },
    {
      type: "reflection",
      question: "Consider the distinction between Opposite Action (for unjustified emotions) and Problem Solving (for justified emotions). Think about a client who experiences intense emotional reactions in interpersonal situations. How would you help this client develop the skill of distinguishing between situations where their emotional response fits the facts and situations where it does not? What challenges might arise in making this distinction, and how would you use the therapeutic relationship to navigate those challenges?",
      accessibility: { role: "note", ariaLabel: "Reflection: clinical application of emotion regulation" }
    },
    {
      type: "text",
      content: `<h3>Module Summary</h3>
<p>In this module, you examined the Emotion Regulation skill module, which targets the understanding, management, and proactive reduction of unwanted emotional experiences. You learned that the goals of emotion regulation are to understand and name emotions, reduce emotional vulnerability, decrease the frequency of unwanted emotions, and decrease emotional suffering—without eliminating emotional experience itself. You explored the DBT model of emotions, which breaks the emotional cycle into prompting event, interpretation, emotional response, action urge, and behavior. You learned the core reactive skills: Check the Facts (examining whether interpretations are accurate), Opposite Action (acting opposite to unjustified emotions), and Problem Solving (addressing the real-world situations that generate justified emotions). You explored the proactive ABC PLEASE skills for building long-term emotional resilience, and the Wave Skill for mindfully observing emotions without being overwhelmed. In the next module, you will explore the Interpersonal Effectiveness skill module, which addresses the complex challenge of maintaining relationships while asserting needs and preserving self-respect.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 6 summary" }
    }
  ]
},


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 6 (Course Module 7): CORE SKILL — INTERPERSONAL EFFECTIVENESS
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════
{
  title: "Core Skill Module: Interpersonal Effectiveness",
  lessons: [
    {
      title: "Core Skill Module: Interpersonal Effectiveness",
      content: "This module provides a comprehensive examination of the Interpersonal Effectiveness skill module, which addresses three types of effectiveness in relationships: getting what you need (DEAR MAN), maintaining relationships (GIVE), and preserving self-respect (FAST). You will also explore Walking the Middle Path and the factors that interfere with interpersonal effectiveness."
    }
  ],
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 7,
      title: "Core Skill Module: Interpersonal Effectiveness",
      subtitle: "Navigating Relationships with DEAR MAN, GIVE, FAST, and Walking the Middle Path",
      accessibility: { role: "heading", ariaLevel: 2, ariaLabel: "Module 7: Core Skill Module — Interpersonal Effectiveness" }
    },
    {
      type: "text",
      content: `<h3>The Challenge of Interpersonal Effectiveness</h3>
<p>For individuals with emotional dysregulation, interpersonal relationships are often simultaneously the greatest source of meaning and the greatest source of suffering. The intense emotional sensitivity that characterizes biological vulnerability in the biosocial model means that interpersonal cues—a change in tone of voice, a delayed text message response, a perceived slight in a meeting—can trigger emotional reactions of an intensity that others find confusing or overwhelming. The history of invalidation that constitutes the social side of the biosocial equation means that many of these individuals never learned effective strategies for communicating their needs, resolving conflicts, setting boundaries, or managing the complex give-and-take of close relationships.</p>
<p>The Interpersonal Effectiveness module addresses these challenges directly by teaching specific, structured communication skills that help clients pursue three distinct types of interpersonal goals. The module recognizes that any interpersonal interaction involves a complex balancing act: the person wants to get their needs met (objective effectiveness), they want to maintain or improve the relationship (relationship effectiveness), and they want to preserve their self-respect (self-respect effectiveness). These goals sometimes align, but they often pull in different directions, requiring the individual to make deliberate, Wise Mind decisions about which priority is most important in a given interaction.</p>
<p>This framework is liberating for many clients because it makes explicit what is often implicit and confusing: you cannot always maximize all three goals simultaneously, and choosing to prioritize one goal over another in a specific situation is not a failure—it is a skill. A client who decides to let a minor boundary violation go in order to preserve a valued relationship is not being weak; they are making a strategic interpersonal decision. A client who asserts a firm boundary knowing it may damage a relationship is not being aggressive; they are prioritizing self-respect in a situation that demands it.</p>`,
      accessibility: { role: "article", ariaLabel: "Challenge of interpersonal effectiveness" }
    },
    {
      type: "imageText",
      image: IMG("DEAR+MAN+GIVE+FAST+Framework"),
      imageAlt: "Visual overview of the three interpersonal effectiveness frameworks: DEAR MAN for objectives, GIVE for relationships, FAST for self-respect",
      title: "DEAR MAN: Objective Effectiveness",
      content: `<p>DEAR MAN is the primary skill set for objective effectiveness—getting what you want or need from an interpersonal interaction. The acronym provides a structured sequence for making requests or saying no effectively:</p>
<p><strong>D — Describe:</strong> Describe the current situation factually, without judgment or interpretation. Stick to observable facts: "We agreed that you would handle the dishes on weekdays, and they have been in the sink for three days."</p>
<p><strong>E — Express:</strong> Express your feelings and opinions about the situation using "I" statements. "I feel frustrated when the dishes pile up because it makes the kitchen feel chaotic and stressful for me."</p>
<p><strong>A — Assert:</strong> Assert what you want or need clearly and specifically. Do not hint, imply, or expect the other person to read your mind. "I would like you to do the dishes by the end of each evening, as we agreed."</p>
<p><strong>R — Reinforce:</strong> Reinforce the other person for cooperating by explaining the positive consequences. "If we can get this working, I think we'll both feel better about how the house runs, and I'll have more energy for the things we enjoy doing together."</p>
<p><strong>M — Mindful:</strong> Stay mindful of your objective throughout the interaction. Do not get derailed by tangential topics, past grievances, or emotional escalation. If the other person tries to change the subject or counterattack, calmly return to your request like a "broken record."</p>
<p><strong>A — Appear Confident:</strong> Use a confident tone of voice, make appropriate eye contact, and maintain an upright posture. Appearing confident communicates that you take your own request seriously and expect it to be taken seriously by the other person.</p>
<p><strong>N — Negotiate:</strong> Be willing to negotiate and find a mutually acceptable solution. Offer alternative solutions and ask the other person for their ideas. "Is there something that would make this easier for you? Could we adjust the arrangement so it works better for both of us?"</p>`,
      imagePosition: "left",
      highlight: false,
      accessibility: { role: "article", ariaLabel: "DEAR MAN objective effectiveness" }
    },
    {
      type: "multipleChoice",
      question: "A client needs to ask their supervisor for a schedule change to accommodate therapy appointments. They feel anxious about the request and worried about being perceived as difficult. Which interpersonal effectiveness framework should they primarily use?",
      options: [
        { text: "GIVE — focusing on maintaining the relationship with their supervisor", isCorrect: false },
        { text: "FAST — focusing on maintaining their self-respect during the conversation", isCorrect: false },
        { text: "DEAR MAN — structuring the request clearly to achieve their objective", isCorrect: true },
        { text: "Walking the Middle Path — finding a dialectical balance between work and therapy needs", isCorrect: false }
      ],
      explanation: "DEAR MAN is the primary framework for objective effectiveness—getting what you need from an interaction. The client's primary goal is to secure the schedule change, so DEAR MAN provides the structure for making that request effectively. In practice, the client would likely integrate GIVE and FAST elements as well, but DEAR MAN is the primary framework because the objective (schedule change) is the main goal.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: DEAR MAN application" }
    },
    {
      type: "text",
      content: `<h3>GIVE: Relationship Effectiveness</h3>
<p>The GIVE skills focus on relationship effectiveness—maintaining or improving the relationship during an interpersonal interaction, even when you are making a request or saying no. GIVE is particularly important in close relationships where the long-term quality of the connection matters at least as much as any specific outcome.</p>
<p><strong>G — Gentle:</strong> Be gentle in your approach. Do not attack, threaten, judge, or engage in contemptuous behavior. Avoid sarcasm, eye-rolling, and dismissive body language. Gentleness does not mean weakness—it means communicating with respect for the other person's dignity, even when you disagree or are upset.</p>
<p><strong>I — Interested:</strong> Show genuine interest in the other person's perspective. Listen actively. Ask questions. Demonstrate that you care about understanding their point of view, not just about winning the argument. Interest is both a skill and a stance—it communicates that you see the other person as a full human being whose experience matters.</p>
<p><strong>V — Validate:</strong> Validate the other person's feelings, thoughts, and experiences. Validation does not mean agreement—it means acknowledging that the other person's experience makes sense given their perspective and circumstances. "I can see why you'd feel overwhelmed given everything on your plate right now." Validation reduces defensiveness and creates the conditions for productive dialogue.</p>
<p><strong>E — Easy Manner:</strong> Use a light, easy manner when possible. Humor, warmth, and a relaxed tone can defuse tension and keep the interaction from escalating. An easy manner communicates that the relationship is strong enough to handle disagreement, which is itself reassuring to both parties.</p>

<h3>FAST: Self-Respect Effectiveness</h3>
<p>The FAST skills focus on self-respect effectiveness—maintaining your own self-respect and values during interpersonal interactions. FAST is the counterbalance to GIVE: while GIVE focuses on honoring the relationship, FAST focuses on honoring yourself.</p>
<p><strong>F — Fair:</strong> Be fair to both yourself and the other person. Do not sacrifice your own needs entirely to please someone else, and do not dismiss the other person's needs to get what you want. Fairness is a dialectical skill—it requires holding your needs and the other person's needs simultaneously.</p>
<p><strong>A — (no) Apologies:</strong> Do not over-apologize or apologize for existing, having needs, or making reasonable requests. Excessive apologizing communicates that your needs are not legitimate and undermines your credibility. Apologize when you have genuinely wronged someone, but do not apologize for having boundaries, needs, or opinions.</p>
<p><strong>S — Stick to Values:</strong> Do not compromise your core values to please someone else or to avoid conflict. Know what you believe, what you stand for, and what you are unwilling to do, and maintain those positions even under interpersonal pressure. This does not mean being rigid—it means being clear about where your genuine boundaries lie.</p>
<p><strong>T — Truthful:</strong> Be honest. Do not lie, exaggerate, or manipulate to get what you want. Truthfulness builds trust and self-respect over time, even when it is uncomfortable in the moment. A truthful person can look at themselves in the mirror without shame, which is a form of emotional regulation in itself.</p>`,
      accessibility: { role: "article", ariaLabel: "GIVE and FAST skills" }
    },
    {
      type: "imageText",
      image: IMG("Walking+the+Middle+Path"),
      imageAlt: "Balance scale illustration representing Walking the Middle Path between acceptance and change in relationships",
      title: "Walking the Middle Path",
      content: `<p>Walking the Middle Path is an interpersonal effectiveness skill set originally developed for the adolescent adaptation of DBT (DBT-A) but now widely integrated into standard adult DBT programs. It addresses the dialectical challenge of navigating interpersonal differences without falling into the extremes of either demanding that the other person change entirely or abandoning your own position completely.</p>
<p>Walking the Middle Path involves three core practices. The first is <strong>dialectical thinking in relationships</strong>—moving from "either/or" to "both/and" in how you understand interpersonal conflicts. Instead of "Either my partner respects my boundaries or they don't care about me," the dialectical alternative is: "My partner can genuinely care about me AND still struggle with respecting this particular boundary. Both things are true." This shift in thinking reduces the intensity of interpersonal conflicts by acknowledging complexity rather than forcing every interaction into a binary judgment.</p>
<p>The second practice is <strong>validation of others</strong>—actively looking for the kernel of truth or understandable logic in the other person's position, even when you disagree. Validation does not require agreement; it requires the willingness to see the situation through the other person's eyes and to acknowledge that their experience makes sense from their perspective. Validation is one of the most powerful interpersonal tools available because it immediately reduces defensiveness and opens space for genuine dialogue.</p>
<p>The third practice is <strong>behavioral change strategies</strong>—using reinforcement, shaping, and other behavioral principles to encourage desired behaviors in others rather than relying solely on punishment, criticism, or withdrawal. Catching people doing things right and reinforcing those behaviors is typically far more effective than punishing them for doing things wrong, yet many individuals default to criticism because it feels more natural when they are emotionally activated.</p>`,
      imagePosition: "right",
      highlight: true,
      accessibility: { role: "article", ariaLabel: "Walking the Middle Path" }
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Factors That Reduce Interpersonal Effectiveness",
          content: `<p>DBT identifies several categories of factors that can interfere with interpersonal effectiveness, even when the person knows the skills:</p>
<p><strong>Lack of Skill:</strong> The person may never have learned effective interpersonal skills. If they grew up in an invalidating environment, they may not have had models for assertive communication, negotiation, or conflict resolution. Skills training directly addresses this factor.</p>
<p><strong>Worry Thoughts:</strong> Anxiety about the interaction can undermine effectiveness. Common worry thoughts include: "They'll think I'm selfish," "I'll make things worse," "They'll leave me if I push this," "I don't have the right to ask for this." These thoughts often reflect internalized invalidation and can be addressed through mindfulness (observing the thoughts without being controlled by them) and cognitive strategies (checking the facts about whether the worry thoughts are accurate).</p>
<p><strong>Emotional Reactivity:</strong> Intense emotions—particularly anger, fear, and shame—can overwhelm the capacity to use skills effectively. A person who knows DEAR MAN perfectly in a calm moment may be unable to access the skill when flooded with anger during a conflict. This is why distress tolerance and emotion regulation skills must be developed alongside interpersonal effectiveness skills.</p>
<p><strong>Environmental Factors:</strong> Sometimes the environment genuinely does not support interpersonal effectiveness. The other person may be unwilling to negotiate, the power dynamics may be severely imbalanced, or the social or cultural context may penalize assertiveness. In these situations, effectiveness (doing what works) may require modifying or abandoning the standard skill approach.</p>
<p><strong>Indecision About Priorities:</strong> When the person is unclear about whether to prioritize objectives, the relationship, or self-respect, they may become paralyzed or oscillate between conflicting approaches. Helping clients clarify their priorities before entering a difficult interaction is an important therapeutic task.</p>`
        },
        {
          title: "Intensity Scale: How Hard to Push",
          content: `<p>One of the most practical tools in the Interpersonal Effectiveness module is the intensity scale—a framework for deciding how assertive to be in a given interaction. The intensity of assertion should be calibrated to the specific factors of the situation, including:</p>
<p><strong>Factors that increase intensity (push harder):</strong> Your request is clearly reasonable; you have the right and authority to make this request; the relationship can withstand the tension; the potential consequences of not getting what you want are significant; asking fits your values; your self-respect requires that you assert yourself; you have a clear plan for what you need.</p>
<p><strong>Factors that decrease intensity (pull back):</strong> The request might be unreasonable given the circumstances; the other person's needs are at least as pressing as yours; the relationship is fragile and may not survive a confrontation; the consequences of not getting what you want are manageable; the timing is poor; the other person is in crisis themselves.</p>
<p>This framework directly counters the all-or-nothing thinking that characterizes emotional dysregulation. Instead of either being completely passive or explosively aggressive, the client learns to modulate their assertiveness on a continuum, matching their approach to the specific demands of each situation. This is the interpersonal application of the mindfulness skill of Effectiveness—doing what works rather than doing what feels right.</p>`
        }
      ],
      accessibility: { role: "region", ariaLabel: "Interpersonal effectiveness barriers and intensity accordion" }
    },
    {
      type: "multipleChoice",
      question: "A client has a tendency to over-apologize when making reasonable requests of their family members. Which FAST skill specifically addresses this pattern?",
      options: [
        { text: "Fair — being fair to both yourself and the other person", isCorrect: false },
        { text: "(No) Apologies — not apologizing for having legitimate needs or making reasonable requests", isCorrect: true },
        { text: "Stick to Values — maintaining core values under interpersonal pressure", isCorrect: false },
        { text: "Truthful — being honest about your needs without exaggeration", isCorrect: false }
      ],
      explanation: "The (No) Apologies skill in FAST specifically addresses the pattern of over-apologizing. It teaches clients to distinguish between appropriate apologies (when they have genuinely wronged someone) and inappropriate apologies (apologizing for existing, having needs, or making reasonable requests). Excessive apologizing communicates that the person's needs are not legitimate, undermines their credibility, and erodes self-respect.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: FAST skills" }
    },
    {
      type: "matching",
      matchingInstructions: "Match each interpersonal effectiveness concept with the correct scenario.",
      matchingPairs: [
        { term: "DEAR MAN", definition: "Asking your landlord to address a maintenance issue by describing the problem, expressing concern, and making a specific request" },
        { term: "GIVE — Validate", definition: "During a disagreement, saying: 'I understand why you see it that way — given your experience, that makes complete sense'" },
        { term: "FAST — Stick to Values", definition: "Declining a coworker's request to falsify a report, even though refusing creates workplace tension" },
        { term: "Walking the Middle Path", definition: "Recognizing that your teenager is both struggling with real challenges AND capable of taking more responsibility" },
        { term: "Intensity Scale", definition: "Deciding to be mildly assertive about a restaurant overcharge rather than escalating to manager-level confrontation" },
        { term: "Worry Thoughts", definition: "'If I ask for what I need, they'll think I'm selfish and leave me'" }
      ],
      accessibility: { role: "form", ariaLabel: "Matching exercise: interpersonal effectiveness scenarios" }
    },
    {
      type: "multiSelect",
      question: "Which of the following factors should increase the intensity of a client's assertion, according to the interpersonal effectiveness intensity scale? Select all that apply.",
      options: [
        { text: "The request is clearly reasonable and within the client's rights", isCorrect: true },
        { text: "The other person is currently in an emotional crisis of their own", isCorrect: false },
        { text: "The consequences of not getting the desired outcome are significant", isCorrect: true },
        { text: "The client's self-respect requires that they assert themselves in this situation", isCorrect: true }
      ],
      explanation: "A client should push harder when: the request is reasonable, the consequences of not asserting are significant, and self-respect is at stake. They should pull back when the other person is in crisis, the relationship is fragile, or the timing is poor. The intensity scale teaches clients to calibrate their assertiveness to the specific situation rather than defaulting to all-or-nothing patterns.",
      accessibility: { role: "form", ariaLabel: "Knowledge check: intensity scale" }
    },
    {
      type: "reflection",
      question: "Consider a situation in your own professional life where you needed to balance competing interpersonal goals—for example, asserting a professional boundary (FAST) while maintaining a collegial relationship (GIVE) and achieving a specific work objective (DEAR MAN). Which priority took precedence, and why? How might the DBT interpersonal effectiveness framework have helped you navigate the situation more deliberately? As a clinician, how would you help a client develop the skill of consciously choosing among these competing priorities rather than reacting impulsively?",
      accessibility: { role: "note", ariaLabel: "Reflection: interpersonal effectiveness in professional life" }
    },
    {
      type: "text",
      content: `<h3>Module Summary</h3>
<p>In this module, you examined the Interpersonal Effectiveness skill module, which addresses the complex challenge of navigating relationships while balancing the competing goals of getting what you need, maintaining relationships, and preserving self-respect. You learned the DEAR MAN framework for objective effectiveness—a structured approach to making requests and saying no that includes describing the situation, expressing feelings, asserting needs, reinforcing cooperation, staying mindful, appearing confident, and negotiating. You explored the GIVE skills for relationship effectiveness—being gentle, showing interest, validating the other person, and using an easy manner—and the FAST skills for self-respect effectiveness—being fair, not over-apologizing, sticking to values, and being truthful. You examined Walking the Middle Path as a dialectical approach to interpersonal differences, and you learned about the factors that can interfere with interpersonal effectiveness, including lack of skill, worry thoughts, emotional reactivity, environmental factors, and indecision about priorities. You practiced matching these concepts to clinical scenarios and reflected on their application in your own professional life. In the next module, you will examine the evidence base supporting DBT, its recognized limitations, and strategies for integrating DBT-informed practices into your existing clinical work.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 7 summary" }
    }
  ]
},


// ═══════════════════════════════════════════════════════════════
//  INSERTION LOGIC
// ═══════════════════════════════════════════════════════════════

const COURSE_SLUG = 'dbt-skills-training-comprehensive';

async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  DBT 6hr Course — Module Expansion');
  console.log('═══════════════════════════════════════════════════\n');

  // 1. Find the existing course
  const existing = await collection.findOne({ slug: COURSE_SLUG });
  if (!existing) {
    console.error('❌ Course not found:', COURSE_SLUG);
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

  updatedAt: new Date(),
  createdAt: new Date()
};

// --- UPSERT ---
async function main() {
  console.log('Upserting DBT course...');
  
  const result = await collection.replaceOne(
    { slug: 'dbt-skills-training-comprehensive' },
    courseData,
    { upsert: true }
  );

  if (result.upsertedCount) {
    console.log('Inserted new course');
  } else {
    console.log('Replaced existing course');
  }

  // Word count
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

  let total = 0;
  for (const m of courseData.modules) {
    let mw = 0;
    (m.contentBlocks || []).forEach(b => { mw += cbw(b); });
    (m.lessons || []).forEach(l => { mw += sc(l.content); });
    console.log('  ' + m.title + ': ' + mw + ' words');
    total += mw;
  }
  console.log('\n  TOTAL: ' + total + ' / 36000 (' + Math.round(total/36000*100) + '%)');
  console.log('  Modules: ' + courseData.modules.length);
  console.log('  Assessment questions: ' + (courseData.assessment?.questions || []).length);
  console.log('  References: ' + (courseData.references || []).length);

  await mongoose.disconnect();
  console.log('Done');
}

main().catch(err => { console.error(err.message); process.exit(1); });
