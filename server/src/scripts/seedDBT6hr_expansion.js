/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * seedDBT6hr_expansion.js
 * ═══════════════════════════════════════════════════════════════
 * EXPANSION: Adds 6 new modules to the existing DBT course
 * 
 * Dialectical Behavior Therapy: Foundations, Clinical Applications,
 * and Evidence-Based Integration
 * 
 * 6 CE Hours | CR-DBT-001 | ACEP Provider #7760 | GAITP LLC
 * ═══════════════════════════════════════════════════════════════
 *
 * This script:
 *   1. Finds the existing course by slug
 *   2. Inserts 6 new modules (Intro, Biosocial, 4 Core Skills)
 *   3. Re-orders all 9 modules in correct sequence
 *   4. Validates total word count
 *   5. Updates course status
 *
 * Final module order:
 *   1. Introduction and Course Overview (NEW)
 *   2. Biosocial Theory and the Dialectical Worldview (NEW)
 *   3. Structure of Comprehensive DBT (EXISTING)
 *   4. Core Skill Module: Mindfulness (NEW)
 *   5. Core Skill Module: Distress Tolerance (NEW)
 *   6. Core Skill Module: Emotion Regulation (NEW)
 *   7. Core Skill Module: Interpersonal Effectiveness (NEW)
 *   8. Evidence Base, Limitations, and Integration (EXISTING)
 *   9. Glossary and Clinical Application Exercise (EXISTING)
 *
 * Run:      node src/scripts/seedDBT6hr_expansion.js
 * Requires: MONGODB_URI in environment
 * Schema:   interactivecourses collection
 * ═══════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

const db = mongoose.connection.db;
const collection = db.collection('interactivecourses');

// ─── Placeholder image base URL ──────────────────────────────
const IMG = (label) => `https://via.placeholder.com/600x400/34495E/FFFFFF?text=${encodeURIComponent(label)}`;


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 1: INTRODUCTION AND COURSE OVERVIEW
//  Target: ~4,200 words
//  Blocks: sectionDivider, text×5, imageText×2, accordion, 
//          multipleChoice×3, multiSelect×1, reflection, text (summary)
// ═══════════════════════════════════════════════════════════════

const mod1_Introduction = {
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
      content: `<h2>Welcome to the Course</h2>
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
      content: `<h2>Who Is This Course For?</h2>
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
      content: `<h2>DBT in the Contemporary Mental Health Landscape</h2>
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
      content: `<h2>Module Summary</h2>
<p>In this introductory module, you established the foundation for your study of Dialectical Behavior Therapy. You learned that DBT was developed by Marsha Linehan in the late 1980s and early 1990s to address the treatment of chronically suicidal individuals with Borderline Personality Disorder—a population for whom standard CBT approaches proved insufficient. You explored the core insight that effective treatment requires the simultaneous pursuit of both acceptance and change, held in dialectical tension. You learned that DBT integrates three intellectual traditions: cognitive-behavioral therapy, dialectical philosophy, and Zen Buddhist contemplative practices. You reviewed the course learning objectives, the nine-module structure, and the final assessment requirements. And you identified your personal learning goals for the course. In the next module, you will examine the theoretical foundations of DBT in depth, beginning with biosocial theory and the dialectical worldview.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 1 summary" }
    }
  ]
};


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 2: BIOSOCIAL THEORY AND THE DIALECTICAL WORLDVIEW
//  Target: ~4,500 words
//  Blocks: sectionDivider, text×5, imageText×2, accordion×2,
//          multipleChoice×3, multiSelect×1, matching, reflection, text (summary)
// ═══════════════════════════════════════════════════════════════

const mod2_Biosocial = {
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
      content: `<h2>Introduction to Biosocial Theory</h2>
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
      content: `<h2>The Social Component: The Invalidating Environment</h2>
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
      content: `<h2>The Dialectical Worldview</h2>
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
      content: `<h2>Module Summary</h2>
<p>In this module, you examined the two theoretical pillars that underpin all of Dialectical Behavior Therapy. You learned that biosocial theory explains the development of emotional dysregulation as the product of an ongoing transaction between biological emotional vulnerability—characterized by high sensitivity, high reactivity, and slow return to baseline—and an invalidating social environment that dismisses, minimizes, or punishes emotional experience. You explored how this theory provides a non-blaming framework for understanding clients' difficulties and directly informs therapeutic practice, including the critical role of validation. You then examined dialectical philosophy and its three core principles: the interconnectedness of reality, the presence of opposing forces within every truth, and the transformative potential of synthesis. You learned how the three primary dialectics of DBT—acceptance and change, flexibility and stability, nurturing and demanding—shape every aspect of therapeutic interaction. In the next module, you will explore the structural architecture of comprehensive DBT treatment, including the four components that make up a full DBT program.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 2 summary" }
    }
  ]
};


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 3 (Course Module 4): CORE SKILL — MINDFULNESS
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════

const mod4_Mindfulness = {
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
      content: `<h2>Mindfulness as the Foundation of DBT</h2>
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
      content: `<h2>The 'What' Skills: Observe, Describe, Participate</h2>
<p>DBT organizes mindfulness skills into two categories: "What" skills (what you do when practicing mindfulness) and "How" skills (how you do it). The three "What" skills are Observe, Describe, and Participate.</p>
<p><strong>Observe</strong> means to notice your experience without reacting to it. It is the skill of paying attention—to sensations in your body, to thoughts as they arise and pass, to emotions as they emerge, and to events in your environment. Observing is fundamentally different from thinking about your experience. When you observe, you step back and watch what is happening from a slight distance, the way you might watch clouds moving across the sky. You notice without grabbing hold, without pushing away, and without trying to change what you see. For individuals with high emotional vulnerability, the skill of observing is particularly valuable because it creates a microsecond of space between stimulus and response—a pause in which choice becomes possible. Instead of automatically reacting to an emotional trigger, the person who can observe notices: "I am having the thought that she rejected me. I notice a tightness in my chest. I notice an urge to withdraw." That moment of observation is the gateway to every other skill in DBT.</p>
<p><strong>Describe</strong> means to put words on your experience. After observing what is happening, you label it accurately and specifically. Instead of saying "I feel terrible," you describe: "I am feeling a combination of sadness and anxiety. The sadness seems connected to the conversation I had with my mother. The anxiety seems connected to my worry that I said the wrong thing." Describing uses language to organize and clarify internal experience. Research in affective neuroscience has demonstrated that the act of labeling emotions—sometimes called "affect labeling"—actually reduces amygdala activation and increases prefrontal cortex activity. In other words, putting words on feelings is not merely descriptive but is itself a form of emotion regulation. Effective describing uses observable, factual language rather than interpretive or judgmental language. The statement "I notice my heart racing and my hands sweating" is a description; the statement "I'm freaking out" is an interpretation.</p>
<p><strong>Participate</strong> means to throw yourself fully into the current activity without self-consciousness or internal commentary. Participating is the opposite of being a detached observer—it is complete engagement with the present moment. When you participate fully, you are not watching yourself from the outside, not evaluating your performance, not worrying about what will happen next. You are simply doing what you are doing with your whole attention. Athletes call this state "flow" or "being in the zone." Participation is the mindfulness skill that most directly connects to living a full, engaged, meaningful life. For many clients, the skill of participation is the bridge from mindfulness practice to mindfulness as a way of life.</p>`,
      accessibility: { role: "article", ariaLabel: "The What skills: Observe, Describe, Participate" }
    },
    {
      type: "text",
      content: `<h2>The 'How' Skills: Non-Judgmentally, One-Mindfully, Effectively</h2>
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
      content: `<h2>Module Summary</h2>
<p>In this module, you examined the Mindfulness skill module—the foundational skill set of Dialectical Behavior Therapy. You learned that mindfulness holds a unique structural position in DBT, taught first and revisited at the beginning of every skills training cycle, because all other DBT skills depend on the capacity for present-moment awareness and non-judgmental observation. You explored the three states of mind—Reasonable Mind, Emotion Mind, and Wise Mind—and understood Wise Mind as the dialectical synthesis that DBT seeks to cultivate. You learned the three "What" skills: Observe (notice without reacting), Describe (put words on experience), and Participate (engage fully in the present moment). You learned the three "How" skills: Non-Judgmentally (observe without evaluating), One-Mindfully (focus on one thing at a time), and Effectively (do what works in the situation). You practiced identifying these skills in clinical examples and in your own professional experience. In the next module, you will explore the Distress Tolerance skill module, which provides clients with strategies for surviving emotional crises without making them worse.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 4 summary" }
    }
  ]
};


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 4 (Course Module 5): CORE SKILL — DISTRESS TOLERANCE
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════

const mod5_DistressTolerance = {
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
      content: `<h2>The Purpose of Distress Tolerance</h2>
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
      content: `<h2>Reality Acceptance Skills: Radical Acceptance and Turning the Mind</h2>
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
      content: `<h2>Module Summary</h2>
<p>In this module, you examined the Distress Tolerance skill module, which addresses the management of emotional crises and the development of the capacity to bear pain without making it worse. You learned the fundamental premise that pain is inevitable but that the ability to tolerate distress without engaging in self-destructive behavior is a learnable skill. You explored the TIPP skills—Temperature, Intense Exercise, Paced Breathing, and Progressive Muscle Relaxation—as rapid physiological interventions for acute crisis. You learned the ACCEPTS distraction strategies and the IMPROVE the moment techniques for getting through crises when the emotional intensity is too high for problem-solving. You examined the reality acceptance skills—Radical Acceptance, Turning the Mind, Willingness and Willfulness—and understood how they address the deeper challenge of accepting painful realities that cannot be changed. You practiced matching these skills to clinical scenarios and reflected on how to apply them in your own clinical work. In the next module, you will explore the Emotion Regulation skill module, which aims to reduce the frequency and intensity of unwanted emotions over time.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 5 summary" }
    }
  ]
};


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 5 (Course Module 6): CORE SKILL — EMOTION REGULATION
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════

const mod6_EmotionRegulation = {
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
      content: `<h2>The Goals of Emotion Regulation</h2>
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
      content: `<h2>Core Emotion Regulation Skills</h2>
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
      content: `<h2>Module Summary</h2>
<p>In this module, you examined the Emotion Regulation skill module, which targets the understanding, management, and proactive reduction of unwanted emotional experiences. You learned that the goals of emotion regulation are to understand and name emotions, reduce emotional vulnerability, decrease the frequency of unwanted emotions, and decrease emotional suffering—without eliminating emotional experience itself. You explored the DBT model of emotions, which breaks the emotional cycle into prompting event, interpretation, emotional response, action urge, and behavior. You learned the core reactive skills: Check the Facts (examining whether interpretations are accurate), Opposite Action (acting opposite to unjustified emotions), and Problem Solving (addressing the real-world situations that generate justified emotions). You explored the proactive ABC PLEASE skills for building long-term emotional resilience, and the Wave Skill for mindfully observing emotions without being overwhelmed. In the next module, you will explore the Interpersonal Effectiveness skill module, which addresses the complex challenge of maintaining relationships while asserting needs and preserving self-respect.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 6 summary" }
    }
  ]
};


// ═══════════════════════════════════════════════════════════════
//  NEW MODULE 6 (Course Module 7): CORE SKILL — INTERPERSONAL EFFECTIVENESS
//  Target: ~4,500 words
// ═══════════════════════════════════════════════════════════════

const mod7_InterpersonalEffectiveness = {
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
      content: `<h2>The Challenge of Interpersonal Effectiveness</h2>
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
      content: `<h2>GIVE: Relationship Effectiveness</h2>
<p>The GIVE skills focus on relationship effectiveness—maintaining or improving the relationship during an interpersonal interaction, even when you are making a request or saying no. GIVE is particularly important in close relationships where the long-term quality of the connection matters at least as much as any specific outcome.</p>
<p><strong>G — Gentle:</strong> Be gentle in your approach. Do not attack, threaten, judge, or engage in contemptuous behavior. Avoid sarcasm, eye-rolling, and dismissive body language. Gentleness does not mean weakness—it means communicating with respect for the other person's dignity, even when you disagree or are upset.</p>
<p><strong>I — Interested:</strong> Show genuine interest in the other person's perspective. Listen actively. Ask questions. Demonstrate that you care about understanding their point of view, not just about winning the argument. Interest is both a skill and a stance—it communicates that you see the other person as a full human being whose experience matters.</p>
<p><strong>V — Validate:</strong> Validate the other person's feelings, thoughts, and experiences. Validation does not mean agreement—it means acknowledging that the other person's experience makes sense given their perspective and circumstances. "I can see why you'd feel overwhelmed given everything on your plate right now." Validation reduces defensiveness and creates the conditions for productive dialogue.</p>
<p><strong>E — Easy Manner:</strong> Use a light, easy manner when possible. Humor, warmth, and a relaxed tone can defuse tension and keep the interaction from escalating. An easy manner communicates that the relationship is strong enough to handle disagreement, which is itself reassuring to both parties.</p>

<h2>FAST: Self-Respect Effectiveness</h2>
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
      content: `<h2>Module Summary</h2>
<p>In this module, you examined the Interpersonal Effectiveness skill module, which addresses the complex challenge of navigating relationships while balancing the competing goals of getting what you need, maintaining relationships, and preserving self-respect. You learned the DEAR MAN framework for objective effectiveness—a structured approach to making requests and saying no that includes describing the situation, expressing feelings, asserting needs, reinforcing cooperation, staying mindful, appearing confident, and negotiating. You explored the GIVE skills for relationship effectiveness—being gentle, showing interest, validating the other person, and using an easy manner—and the FAST skills for self-respect effectiveness—being fair, not over-apologizing, sticking to values, and being truthful. You examined Walking the Middle Path as a dialectical approach to interpersonal differences, and you learned about the factors that can interfere with interpersonal effectiveness, including lack of skill, worry thoughts, emotional reactivity, environmental factors, and indecision about priorities. You practiced matching these concepts to clinical scenarios and reflected on their application in your own professional life. In the next module, you will examine the evidence base supporting DBT, its recognized limitations, and strategies for integrating DBT-informed practices into your existing clinical work.</p>`,
      accessibility: { role: "article", ariaLabel: "Module 7 summary" }
    }
  ]
};


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
    console.log('   Run seedDBT6hr_clean.js first to create the base course.');
    process.exit(1);
  }
  console.log(`✅ Found existing course: ${existing.title}`);
  console.log(`   Current modules: ${existing.modules.length}`);

  // 2. Build the complete 9-module array in correct order
  const existingModules = existing.modules;

  // Find existing modules by title pattern
  const modStructure = existingModules.find(m => m.title.includes('Structure'));
  const modEvidence = existingModules.find(m => m.title.includes('Evidence'));
  const modGlossary = existingModules.find(m => m.title.includes('Glossary'));

  if (!modStructure || !modEvidence || !modGlossary) {
    console.error('❌ Could not identify existing modules by title');
    console.error('   Found:', existingModules.map(m => m.title));
    process.exit(1);
  }

  const fullModules = [
    mod1_Introduction,                    // 1. Introduction (NEW)
    mod2_Biosocial,                       // 2. Biosocial Theory (NEW)
    modStructure,                         // 3. Structure of Comprehensive DBT (EXISTING)
    mod4_Mindfulness,                     // 4. Mindfulness (NEW)
    mod5_DistressTolerance,               // 5. Distress Tolerance (NEW)
    mod6_EmotionRegulation,               // 6. Emotion Regulation (NEW)
    mod7_InterpersonalEffectiveness,       // 7. Interpersonal Effectiveness (NEW)
    modEvidence,                          // 8. Evidence Base (EXISTING)
    modGlossary                           // 9. Glossary (EXISTING)
  ];

  console.log(`\n📋 Complete course structure (${fullModules.length} modules):`);
  fullModules.forEach((m, i) => {
    const isNew = [mod1_Introduction, mod2_Biosocial, mod4_Mindfulness, mod5_DistressTolerance, mod6_EmotionRegulation, mod7_InterpersonalEffectiveness].includes(m);
    console.log(`   ${i+1}. ${m.title} ${isNew ? '🆕' : '✅'}`);
  });

  // 3. Count words for each module
  console.log('\n📊 Word count by module:');
  let totalWords = 0;
  for (const mod of fullModules) {
    let modWords = 0;
    for (const block of (mod.contentBlocks || [])) {
      modWords += countBlockWords(block);
    }
    for (const lesson of (mod.lessons || [])) {
      modWords += stripAndCount(lesson.content);
    }
    totalWords += modWords;
    const pct = Math.round((modWords / 4000) * 100);
    const status = pct >= 70 ? '✅' : '🔴';
    console.log(`   ${status} ${mod.title}: ${modWords.toLocaleString()} words (${pct}% of 4K target)`);
  }

  const target = 36000;
  const overallPct = Math.round((totalWords / target) * 100);
  console.log(`\n   TOTAL: ${totalWords.toLocaleString()} / ${target.toLocaleString()} words (${overallPct}%)`);

  // 4. Count assessment words
  let assessmentWords = 0;
  if (existing.assessment?.questions) {
    for (const q of existing.assessment.questions) {
      assessmentWords += stripAndCount(q.question);
      assessmentWords += stripAndCount(q.explanation);
      if (q.options) {
        for (const opt of q.options) {
          assessmentWords += stripAndCount(typeof opt === 'string' ? opt : opt.text);
        }
      }
    }
  }
  console.log(`   Assessment: ${assessmentWords.toLocaleString()} additional words`);
  console.log(`   GRAND TOTAL: ${(totalWords + assessmentWords).toLocaleString()} words\n`);

  // 5. Update the course
  const result = await collection.updateOne(
    { slug: COURSE_SLUG },
    {
      $set: {
        modules: fullModules,
        updatedAt: new Date()
      }
    }
  );

  if (result.modifiedCount === 1) {
    console.log('✅ Course updated successfully');
    console.log(`   Modules: ${fullModules.length}`);
    console.log(`   Words: ${totalWords.toLocaleString()}`);
    
    if (overallPct >= 100) {
      console.log('\n🎉 Course meets ACEP word count target!');
      console.log('   Consider setting status: "published" and isPublished: true');
    } else {
      console.log(`\n⚠️  Course is at ${overallPct}% of target — ${(target - totalWords).toLocaleString()} words needed`);
    }
  } else {
    console.error('❌ Update failed — no documents modified');
  }

  await mongoose.disconnect();
  console.log('\n✅ Disconnected from MongoDB');
}

// ─── Word counting (matches validator) ───────────────────────
function stripAndCount(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}

function countBlockWords(block) {
  let words = 0;
  words += stripAndCount(block.content);
  words += stripAndCount(block.textContent);
  if (block.type === 'sectionDivider') { words += stripAndCount(block.title); words += stripAndCount(block.subtitle); }
  if (block.accordionItems) { for (const a of block.accordionItems) { words += stripAndCount(a.title); words += stripAndCount(a.content); } }
  words += stripAndCount(block.question);
  words += stripAndCount(block.explanation);
  if (block.options) { for (const o of block.options) { words += stripAndCount(typeof o === 'string' ? o : o.text); } }
  words += stripAndCount(block.matchingInstructions);
  if (block.matchingPairs) { for (const p of block.matchingPairs) { words += stripAndCount(p.term); words += stripAndCount(p.definition); } }
  if (block.resources) { for (const r of block.resources) { words += stripAndCount(r.title); } }
  return words;
}

main().catch(err => { console.error('Fatal error:', err.message); process.exit(1); });
