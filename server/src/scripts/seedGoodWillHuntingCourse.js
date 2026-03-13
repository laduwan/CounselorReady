/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * CounselorReady CE Course Seed File
 * Course: Good Will Hunting - Trauma, Attachment, and the Therapeutic Alliance
 * CE Hours: 1.0
 * NBCC ACEP Provider #7760
 * 
 * Run: node src/scripts/seedGoodWillHuntingCourse.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const courseData = {
  title: "Good Will Hunting: Trauma, Attachment, and the Therapeutic Alliance",
  slug: "good-will-hunting-trauma-attachment",
  description: "This continuing education course uses the critically acclaimed film 'Good Will Hunting' as a clinical teaching tool to explore complex trauma, attachment disruption, and the healing power of the therapeutic relationship. Through detailed analysis of Will Hunting's presentation and Dr. Sean Maguire's therapeutic approach, clinicians will develop enhanced skills in recognizing attachment patterns, implementing trauma-informed interventions, and building effective therapeutic alliances with resistant clients.",
  shortDescription: "Explore trauma, attachment patterns, and therapeutic alliance through clinical analysis of the film Good Will Hunting.",
  ceHours: 1,
  credits: 1,
  category: "Clinical Practice",
  level: "Intermediate",
  contentArea: "Trauma & Attachment",
  targetAudience: [
    "Licensed Professional Counselors (LPCs)",
    "Licensed Mental Health Counselors (LMHCs)",
    "Licensed Clinical Social Workers (LCSWs)",
    "Licensed Marriage and Family Therapists (LMFTs)",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Counselors-in-Training under supervision"
  ],
  objectives: [
    "Identify at least four attachment patterns and their behavioral manifestations in adult clients as demonstrated through Will Hunting's character",
    "Analyze the therapeutic techniques employed by Sean Maguire and evaluate their alignment with contemporary evidence-based practices for trauma treatment",
    "Apply trauma-informed care principles to clinical vignettes involving clients with histories of childhood abuse and neglect",
    "Differentiate between avoidant, anxious, disorganized, and secure attachment styles and their implications for therapeutic intervention",
    "Demonstrate understanding of therapeutic alliance components (goals, tasks, bond) and their role in treatment outcomes"
  ],
  presenter: {
    name: "CounselorReady Clinical Education Team",
    credentials: "LPC, NCC",
    degree: "Master's in Clinical Mental Health Counseling",
    licenseNumber: "LPC-012345",
    licenseState: "GA",
    qualificationStatement: "The CounselorReady Clinical Education Team consists of licensed mental health professionals with extensive experience in trauma treatment, attachment-based therapies, and clinical supervision. Team members hold advanced degrees in counseling and psychology with specialized training in evidence-based trauma interventions."
  },
  deliveryMethod: "online",
  status: "published",
  isPublished: true,
  acepProvider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    number: "7760"
  },
  commercialSupport: {
    hasCommercialSupport: false,
    statement: "This continuing education program has been developed and presented without commercial support or sponsorship."
  },
  conflictOfInterest: {
    hasConflict: false,
    statement: "The course developers and presenters have no relevant financial relationships or conflicts of interest to disclose."
  },
  accessibility: {
    wcagLevel: "AA",
    screenReaderOptimized: true,
    keyboardNavigable: true,
    colorContrastCompliant: true,
    altTextProvided: true
  },
  references: [
    {
      citation: "Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of attachment: A psychological study of the strange situation. Lawrence Erlbaum Associates.",
      type: "book"
    },
    {
      citation: "Bordin, E. S. (1979). The generalizability of the psychoanalytic concept of the working alliance. Psychotherapy: Theory, Research & Practice, 16(3), 252-260. https://doi.org/10.1037/h0085885",
      type: "journal"
    },
    {
      citation: "Bowlby, J. (1969). Attachment and loss: Vol. 1. Attachment. Basic Books.",
      type: "book"
    },
    {
      citation: "Bowlby, J. (1988). A secure base: Parent-child attachment and healthy human development. Basic Books.",
      type: "book"
    },
    {
      citation: "Briere, J., & Scott, C. (2015). Principles of trauma therapy: A guide to symptoms, evaluation, and treatment (2nd ed.). Sage Publications.",
      type: "book"
    },
    {
      citation: "Courtois, C. A., & Ford, J. D. (Eds.). (2009). Treating complex traumatic stress disorders: An evidence-based guide. Guilford Press.",
      type: "book"
    },
    {
      citation: "Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P., & Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245-258. https://doi.org/10.1016/S0749-3797(98)00017-8",
      type: "journal"
    },
    {
      citation: "Herman, J. L. (1992). Trauma and recovery: The aftermath of violence—from domestic abuse to political terror. Basic Books.",
      type: "book"
    },
    {
      citation: "Horvath, A. O., & Bedi, R. P. (2002). The alliance. In J. C. Norcross (Ed.), Psychotherapy relationships that work: Therapist contributions and responsiveness to patients (pp. 37-69). Oxford University Press.",
      type: "chapter"
    },
    {
      citation: "Main, M., & Solomon, J. (1990). Procedures for identifying infants as disorganized/disoriented during the Ainsworth Strange Situation. In M. T. Greenberg, D. Cicchetti, & E. M. Cummings (Eds.), Attachment in the preschool years: Theory, research, and intervention (pp. 121-160). University of Chicago Press.",
      type: "chapter"
    },
    {
      citation: "Mikulincer, M., & Shaver, P. R. (2007). Attachment in adulthood: Structure, dynamics, and change. Guilford Press.",
      type: "book"
    },
    {
      citation: "Norcross, J. C., & Lambert, M. J. (2018). Psychotherapy relationships that work III. Psychotherapy, 55(4), 303-315. https://doi.org/10.1037/pst0000193",
      type: "journal"
    },
    {
      citation: "Schore, A. N. (2003). Affect dysregulation and disorders of the self. W. W. Norton & Company.",
      type: "book"
    },
    {
      citation: "Siegel, D. J. (2012). The developing mind: How relationships and the brain interact to shape who we are (2nd ed.). Guilford Press.",
      type: "book"
    },
    {
      citation: "van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking.",
      type: "book"
    },
    {
      citation: "Wallin, D. J. (2007). Attachment in psychotherapy. Guilford Press.",
      type: "book"
    }
  ],

  modules: [
    // ============================================================
    // MODULE 1: Introduction and Film Overview
    // ============================================================
    {
      title: "Introduction: Clinical Teaching Through Film",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Introduction: Clinical Teaching Through Film",
          subtitle: "Using Good Will Hunting as a Vehicle for Clinical Learning",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p><strong>Good Will Hunting</strong> (1997), directed by Gus Van Sant and written by Matt Damon and Ben Affleck, presents one of cinema's most compelling portrayals of psychotherapy with a trauma survivor. The film follows Will Hunting, a young man of extraordinary intellectual gifts who works as a janitor at the Massachusetts Institute of Technology while hiding his mathematical genius from the world. When Will's violent behavior lands him in legal trouble, a mathematics professor arranges for him to receive therapy from Dr. Sean Maguire, a community college psychology instructor who becomes the catalyst for Will's eventual healing.</p>

<p>This continuing education course uses the therapeutic relationship depicted in the film as a teaching tool for understanding complex trauma, attachment disruption, and the healing power of authentic therapeutic connection. While Hollywood representations of therapy require critical analysis—and we will examine both the clinically sound and potentially problematic elements of Sean's approach—the film offers rich material for exploring how attachment patterns manifest in adult relationships and how the therapeutic alliance can provide corrective emotional experiences for trauma survivors.</p>

<p>Throughout this course, we will analyze specific scenes and interactions through the lens of contemporary trauma theory, attachment research, and evidence-based practice. Our goal is not to idealize the therapy depicted in the film, but rather to use it as a springboard for deeper clinical reflection and skill development. By examining what works, what raises questions, and what might be done differently, clinicians can enhance their own capacity to work effectively with clients who present with similar histories of abuse, neglect, and relational trauma.</p>

<h2>The Clinical Relevance of Will Hunting's Presentation</h2>

<p>Will Hunting presents with a constellation of features that will be familiar to any clinician who works with adult survivors of childhood maltreatment. His history includes severe physical abuse in multiple foster placements, emotional neglect, abandonment by biological parents, and chronic instability in caregiving relationships. These experiences occurred during critical developmental windows for attachment formation, identity development, and emotional regulation capacity.</p>

<p>The behavioral manifestations of this history are equally recognizable. Will pushes people away before they can abandon him—a protective strategy that made perfect sense in his childhood environment but now prevents him from experiencing the connection he desperately needs. Specific indicators include:</p>

<ul>
<li>Explosive anger that emerges suddenly and disproportionately</li>
<li>A pattern of sabotaging relationships when they become too intimate</li>
<li>Defensive intellectualization that keeps others at arm's length</li>
<li>Hypervigilance to potential threat or betrayal</li>
<li>A deep conviction of his own unworthiness despite evidence to the contrary</li>
</ul>

<h3>Intelligence in Service of Avoidance</h3>

<p>What makes Will's case particularly instructive is the contrast between his extraordinary cognitive abilities and his profound emotional wounds. His intellectual gifts have allowed him to construct elaborate defenses, to outmaneuver previous therapists, and to maintain a sense of control and superiority that protects his vulnerable core.</p>

<p>Yet these same defenses prevent him from accessing the healing relationships and experiences that could transform his life. This dynamic—intelligence in service of avoidance—is common among high-functioning trauma survivors and presents particular challenges for therapeutic engagement.</p>`
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Learning Objectives for This Course",
              content: "Upon completion of this course, participants will be able to: (1) Identify at least four attachment patterns and their behavioral manifestations in adult clients; (2) Analyze therapeutic techniques and evaluate their alignment with evidence-based trauma treatment; (3) Apply trauma-informed care principles to clinical scenarios involving childhood abuse survivors; (4) Differentiate between attachment styles and their implications for intervention; (5) Demonstrate understanding of therapeutic alliance components and their role in treatment outcomes."
            },
            {
              title: "How to Use Film in Clinical Education",
              content: "Cinematic portrayals of therapy offer unique advantages for clinical training: they allow repeated viewing and analysis of specific interactions, they provide a shared reference point for discussion, and they engage learners emotionally in ways that didactic instruction cannot. However, critical analysis is essential. Films compress time, dramatize interactions, and sometimes prioritize narrative over clinical accuracy. Throughout this course, we will note where the film aligns with best practices and where it takes creative liberties that clinicians should not emulate."
            },
            {
              title: "Content Warning and Self-Care",
              content: "This course discusses childhood abuse, neglect, and their psychological consequences. Some clinicians may find this material activating, particularly those with personal histories of trauma or those currently working intensively with trauma survivors. Please attend to your own self-care needs throughout this course. If you find yourself becoming overwhelmed, it is appropriate to take breaks and return when you feel resourced."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Course introduction accordion" }
        },
        {
          type: "text",
          content: `<h2>The Therapeutic Frame: Context for Analysis</h2>

<p>Before diving into clinical analysis, it is important to establish the context in which the therapy occurs. Will is mandated to treatment as a condition of avoiding incarceration for assault. He has already been through multiple therapists, each of whom he has "defeated" through various combinations of manipulation, intimidation, and intellectual dominance. His mathematics professor, Gerald Lambeau, brings in his former college roommate Sean Maguire as something of a last resort—not because Sean is a renowned trauma specialist, but because Lambeau believes Sean's own life experiences might equip him to reach Will in ways others have not.</p>

<p>This setup creates both opportunities and complications. The mandated nature of treatment means Will has no intrinsic motivation for change; he is present only to fulfill a legal obligation. The referral through a personal connection blurs boundaries in ways that would typically be avoided. Sean himself is grieving the death of his wife and has his own unresolved issues that become activated in the therapeutic relationship. None of this is ideal from a clinical standpoint, yet these imperfect conditions become the crucible in which genuine healing occurs.</p>

<p>Understanding this context helps us appreciate both the achievements and limitations of what unfolds. The therapy depicted is not a model of technical precision or adherence to manualized protocols. Rather, it is a portrayal of how authentic human connection—offered with consistency, patience, and genuine care—can penetrate defenses that have resisted more conventional approaches. The question for clinicians is how to harness the healing power of relationship while maintaining appropriate boundaries and clinical rigor.</p>

<h2>Overview of Course Structure</h2>

<p>This course is organized into four modules, each focusing on a different aspect of the clinical material presented in the film. Module 1 (which you are currently reading) provides context and introduces the key themes we will explore. Module 2 examines Will's attachment pattern and trauma presentation through the lens of attachment theory and complex trauma research. Module 3 analyzes Sean Maguire's therapeutic approach, identifying both effective interventions and areas requiring critical examination. Module 4 synthesizes the material through clinical vignettes and case applications, allowing participants to practice applying these concepts to their own clinical work.</p>

<p>Each module includes knowledge checks to assess comprehension and reflection questions to promote deeper integration. A comprehensive final assessment follows Module 4, requiring 80% accuracy for successful completion and CE credit.</p>`
        },
        {
          type: "multipleChoice",
          question: "According to the course introduction, what makes Will Hunting's case particularly instructive for clinicians?",
          options: [
            { text: "His case is simple and straightforward, making it easy to understand", isCorrect: false },
            { text: "The contrast between his extraordinary cognitive abilities and profound emotional wounds illustrates how intelligence can serve avoidance", isCorrect: true },
            { text: "He represents a typical therapy client without unusual features", isCorrect: false },
            { text: "His complete openness to therapy from the beginning provides a model case", isCorrect: false }
          ],
          explanation: "Will's case is instructive precisely because of the contrast between his intellectual brilliance and his emotional wounds. His cognitive gifts allow him to construct elaborate defenses and outmaneuver therapists, yet these same abilities prevent him from accessing the healing relationships he needs. This 'intelligence in service of avoidance' is common among high-functioning trauma survivors.",
          accessibility: { ariaLabel: "Knowledge check about case instructiveness", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: "What is the recommended approach to using film in clinical education, as described in this course?",
          options: [
            { text: "Accept all depicted therapeutic techniques as best practices to emulate", isCorrect: false },
            { text: "Reject film entirely as clinically inaccurate and unhelpful", isCorrect: false },
            { text: "Use critical analysis to note both clinically sound elements and creative liberties", isCorrect: true },
            { text: "Focus only on the entertainment value without clinical analysis", isCorrect: false }
          ],
          explanation: "The course emphasizes critical analysis of film portrayals. While cinema offers unique advantages for clinical training—including repeated viewing, shared reference points, and emotional engagement—films also compress time and sometimes prioritize narrative over clinical accuracy. Clinicians should note where films align with best practices and where they take liberties.",
          accessibility: { ariaLabel: "Knowledge check about film in education", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Before proceeding, take a moment to reflect: What draws you to this course? Have you worked with clients whose presentations remind you of Will Hunting—high intellectual functioning paired with significant relational wounds? What challenges have you encountered with such clients, and what questions do you hope this course will address?",
          minLength: 100,
          accessibility: { role: "textbox", ariaLabel: "Pre-course reflection" }
        }
      ]
    },

    // ============================================================
    // MODULE 2: Attachment and Trauma
    // ============================================================
    {
      title: "Understanding Will's Attachment Pattern and Trauma Presentation",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Understanding Will's Attachment Pattern and Trauma Presentation",
          subtitle: "Applying Attachment Theory and Complex Trauma Frameworks",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>To understand Will Hunting clinically, we must examine his presentation through the interconnected lenses of attachment theory and complex trauma. These frameworks help explain not only why Will behaves as he does, but also what he needs from therapy to heal. In this module, we will analyze Will's attachment pattern, explore the developmental impact of his trauma history, and consider the implications for therapeutic intervention.</p>

<h2>Attachment Theory: A Brief Review</h2>

<p>Attachment theory, originally developed by John Bowlby and empirically validated through Mary Ainsworth's research, posits that early experiences with caregivers create internal working models—mental templates that shape how individuals approach relationships throughout life. These working models contain expectations about whether others will be available and responsive, and whether the self is worthy of care and protection.</p>

<p>Ainsworth's Strange Situation research identified three primary attachment patterns in infants: secure, anxious-ambivalent (or anxious-preoccupied), and avoidant (or dismissive). Later research by Mary Main and colleagues identified a fourth pattern: disorganized attachment, which occurs when the caregiver is simultaneously the source of fear and the potential source of comfort, creating an irresolvable paradox for the child.</p>

<p>While attachment patterns are established in infancy, they persist into adulthood and significantly influence romantic relationships, friendships, and the therapeutic relationship. Adult attachment research has identified corresponding adult patterns: secure, preoccupied (anxious), dismissive (avoidant), and fearful-avoidant (disorganized). Understanding a client's attachment pattern provides crucial information for tailoring therapeutic approach and anticipating challenges in the therapeutic relationship.</p>

<h2>Will Hunting's Attachment Pattern</h2>

<p>Will demonstrates a predominantly <strong>dismissive-avoidant attachment pattern</strong> with elements of disorganization. This pattern is characterized by defensive self-sufficiency, emotional distance, devaluation of attachment needs, and difficulty accessing and expressing vulnerability. Individuals with dismissive attachment have learned that relying on others leads to disappointment or harm, so they protect themselves by minimizing the importance of close relationships and maintaining rigid emotional independence.</p>

<p>The behavioral indicators of Will's dismissive attachment are pervasive throughout the film. Consider the following manifestations:</p>

<h3>Intellectualization as Defense</h3>

<p>Will uses his exceptional cognitive abilities to maintain emotional distance. When therapists or others attempt to connect with him emotionally, he redirects to intellectual discourse, demonstrates his superior knowledge, or engages in verbal sparring that keeps the interaction in the realm of ideas rather than feelings.</p>

<p>This intellectualization serves a protective function—it allows him to feel in control and avoids the vulnerability that emotional engagement would require.</p>

<h3>Preemptive Rejection</h3>

<p>Will consistently pushes people away before they can abandon him. His sabotage of the relationship with Skylar is the clearest example: as their connection deepens and she invites him to California, he picks a devastating fight and drives her away.</p>

<p>From Will's internal logic, this preemptive rejection is self-protective—it hurts less to reject than to be rejected. But this strategy, developed in response to actual abandonment and abuse, now prevents him from experiencing the consistent, loving relationships that could disconfirm his negative expectations.</p>

<h3>Testing Behavior</h3>

<p>Will repeatedly tests others to confirm his expectation that they will ultimately fail him. With therapists, he does this by attempting to manipulate, shock, or outmaneuver them. With Sean, he researches Sean's personal life and makes cruel comments designed to provoke rejection.</p>

<p>With Skylar, he tests whether she will leave when confronted with his wounds. These tests are simultaneously attempts to confirm negative expectations and unconscious hopes that someone will prove those expectations wrong.</p>

<h3>Denial of Attachment Needs</h3>

<p>Will explicitly denies needing others, asserting his independence and self-sufficiency. His statement that he doesn't need therapy, doesn't need help, and is "doing fine" despite clear evidence to the contrary reflects the dismissive pattern's characteristic minimization of attachment needs.</p>

<p>Yet his anger, his violence, and his self-sabotaging behavior reveal the unmet attachment needs that lie beneath the defensive surface.</p>`
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Secure Attachment in Adults",
              content: "Adults with secure attachment have internalized working models that reflect trust in others' availability and positive views of self. They are comfortable with intimacy and autonomy, can effectively regulate emotions, and approach relationships with flexibility. In therapy, securely attached clients generally form therapeutic alliance more easily, can tolerate the vulnerability of self-exploration, and are more likely to engage productively in treatment. Approximately 55-60% of the general population demonstrates secure attachment."
            },
            {
              title: "Anxious-Preoccupied Attachment in Adults",
              content: "Adults with anxious-preoccupied attachment have working models characterized by negative views of self and positive (or idealized) views of others. They demonstrate hyperactivation of the attachment system—seeking excessive closeness, worrying about abandonment, and requiring frequent reassurance. In therapy, preoccupied clients may idealize the therapist, become highly dependent on the therapeutic relationship, and experience intense distress around separations (vacations, termination). Approximately 15-20% of the population demonstrates preoccupied attachment."
            },
            {
              title: "Dismissive-Avoidant Attachment in Adults",
              content: "Adults with dismissive attachment have working models characterized by positive views of self (often inflated or defensive) and negative views of others as unavailable or unreliable. They demonstrate deactivation of the attachment system—minimizing emotional expression, maintaining distance in relationships, and valuing independence over intimacy. In therapy, dismissive clients may be resistant to emotional exploration, intellectualize rather than feel, and minimize the importance of the therapeutic relationship. Approximately 20-25% of the population demonstrates dismissive attachment. This is Will Hunting's predominant pattern."
            },
            {
              title: "Fearful-Avoidant (Disorganized) Attachment in Adults",
              content: "Adults with fearful-avoidant attachment have working models characterized by negative views of both self and others. They desire close relationships but fear the vulnerability intimacy requires. This pattern often results from frightening or traumatic caregiving experiences where the attachment figure was also the source of threat. In therapy, fearful-avoidant clients may show contradictory behaviors—approaching then withdrawing—and may have difficulty regulating emotions within the therapeutic relationship. This pattern is associated with the highest levels of psychological distress and is common in trauma survivors."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Adult attachment patterns accordion" }
        },
        {
          type: "text",
          content: `<h2>Complex Trauma and Developmental Impact</h2>

<p>Will's attachment disruption did not occur in isolation—it developed in the context of severe and repeated trauma during critical developmental periods. The concept of <strong>complex trauma</strong> (sometimes called developmental trauma or Type II trauma) refers to prolonged, repeated traumatic experiences that typically occur within the caregiving system during childhood. Unlike single-incident trauma, complex trauma occurs when the child is dependent on the very individuals who are causing harm, creating profound disruptions in multiple domains of development.</p>

<p>Judith Herman's seminal work on complex trauma identified a constellation of features that go beyond the symptoms of PTSD as traditionally defined. These include:</p>

<h3>Alterations in Regulation of Affect and Impulses</h3>

<p>Complex trauma survivors often struggle with emotional dysregulation, including difficulty identifying feelings, managing intense emotions, and modulating impulses. Will's explosive anger—which emerges suddenly and disproportionately—reflects this regulatory difficulty. His violence is not calculated or controlled; it erupts when emotional intensity exceeds his capacity to contain it.</p>

<h3>Alterations in Attention or Consciousness</h3>

<p>Dissociative symptoms, including depersonalization, derealization, and amnesia, are common in complex trauma. While the film does not emphasize dissociative features, Will's capacity to compartmentalize his genius from his emotional life, and his apparent disconnection from the full impact of his abuse history, may reflect dissociative processes.</p>

<h3>Alterations in Self-Perception</h3>

<p>Complex trauma profoundly impacts identity and self-concept. Survivors often carry chronic shame, a sense of being permanently damaged, beliefs that they are fundamentally different from others, and deep convictions of unworthiness.</p>

<p>Will's statement "I don't owe it to myself. Owe it to myself? What the fuck does that even mean?" reflects his inability to value himself or believe he deserves good things. His insistence that he belongs in South Boston working construction—despite his mathematical genius—stems from a self-concept shaped by abuse.</p>

<h3>Alterations in Perception of the Perpetrator</h3>

<p>Survivors may show preoccupation with the perpetrator, idealization of the perpetrator, or paradoxical gratitude toward abusers. Will's complex feelings about his foster parents, his reluctance to fully condemn them, and his minimization of abuse ("The fuckin' bastards stuck a knife in me. They were tough guys, you know?") reflect this complicated relationship with perpetrators.</p>

<h3>Alterations in Relations with Others</h3>

<p>Difficulty with trust, intimacy, and appropriate boundaries characterizes complex trauma survivors. Will's relational difficulties—pushing away those who care for him, testing others constantly, expecting betrayal—reflect these alterations. His isolation and limited social connections stem from his trauma-based difficulty forming and maintaining close relationships.</p>

<h3>Alterations in Systems of Meaning</h3>

<p>Complex trauma often shatters assumptions about the world's benevolence, the self's worthiness, and life's meaningfulness. Will's cynicism, his dismissal of opportunity, and his apparent lack of future orientation reflect the existential impact of his early experiences.</p>`
        },
        {
          type: "matching",
          matchingInstructions: "Match each attachment pattern with its characteristic features in adult relationships and therapy.",
          matchingPairs: [
            { term: "Secure Attachment", definition: "Comfortable with intimacy and autonomy; forms therapeutic alliance readily; can tolerate vulnerability" },
            { term: "Anxious-Preoccupied", definition: "Hyperactivates attachment system; seeks excessive closeness; may idealize and become dependent on therapist" },
            { term: "Dismissive-Avoidant", definition: "Deactivates attachment system; intellectualizes; minimizes need for relationships; maintains emotional distance" },
            { term: "Fearful-Avoidant", definition: "Desires closeness but fears vulnerability; approach-avoid pattern; associated with traumatic caregiving" }
          ],
          accessibility: { ariaLabel: "Matching exercise for attachment patterns", role: "application" }
        },
        {
          type: "text",
          content: `<h2>The Neurobiology of Early Trauma</h2>

<p>Contemporary neuroscience has illuminated the biological mechanisms through which early trauma shapes brain development and stress response systems. Understanding these mechanisms helps clinicians appreciate why trauma survivors respond as they do and informs appropriate intervention strategies.</p>

<p>The developing brain is experience-dependent—it is shaped by the environments it encounters during critical periods of development. When those environments include chronic stress, fear, and unpredictability, the brain adapts in ways that prioritize survival.</p>

<p>Key neurobiological impacts include:</p>

<ul>
<li>The stress response system (hypothalamic-pituitary-adrenal axis) may become chronically activated or dysregulated.</li>
<li>Brain regions involved in emotional regulation, such as the prefrontal cortex, may develop differently.</li>
<li>The threat-detection system, centered in the amygdala, may become hypervigilant.</li>
</ul>

<p>Allan Schore's work on affect regulation and the developing brain emphasizes the critical role of early attachment relationships in developing the capacity to regulate emotional states. When caregivers provide consistent, attuned responses to an infant's distress, the child develops internal representations of how emotions can be managed and soothed. When caregiving is frightening, inconsistent, or absent, these regulatory capacities do not fully develop, leaving the individual vulnerable to emotional dysregulation throughout life.</p>

<p>Will's explosive anger, his difficulty tolerating emotional intensity, and his reliance on avoidance and intellectualization as regulatory strategies all reflect the impact of developmental trauma on regulatory capacity. His nervous system learned to respond to potential threat with hypervigilance and to overwhelming emotion with shutdown or explosive release. These patterns, wired into his neurobiology through years of adaptation to a dangerous environment, do not simply disappear because the environment has changed.</p>

<h2>Implications for Therapeutic Intervention</h2>

<p>Understanding Will's attachment pattern and trauma presentation has direct implications for therapeutic intervention. Effective treatment must address both the attachment disruption and the trauma sequelae, recognizing that these are interconnected rather than separate issues.</p>

<p>For clients with dismissive attachment like Will, the therapeutic relationship itself becomes the primary vehicle for change. The therapist must offer a relationship that disconfirms the client's expectations—one that remains consistent despite testing, that survives the client's attempts at distancing, and that gradually demonstrates that vulnerability does not lead inevitably to harm. This is precisely what Sean Maguire offers Will, though his methods are sometimes unorthodox.</p>

<p>The pacing of intervention must respect the client's regulatory capacity. Pushing too quickly toward emotional material can overwhelm defenses and retraumatize. Moving too slowly may collude with avoidance. The skilled clinician learns to work at the edge of the client's window of tolerance, gently expanding capacity over time.</p>

<p>Finally, the therapist must recognize that the defensive strategies that now cause problems—the intellectualization, the pushing away, the denial of needs—originally developed as adaptations to an impossible situation. These defenses deserve respect even as they are gradually rendered unnecessary by new experiences. Will's armor kept him alive in circumstances that might otherwise have destroyed him. The task of therapy is not to tear away the armor but to help him discover that he no longer needs it.</p>`
        },
        {
          type: "multipleChoice",
          question: "Which of the following best describes Will Hunting's predominant attachment pattern?",
          options: [
            { text: "Secure attachment with minor anxious features", isCorrect: false },
            { text: "Anxious-preoccupied attachment with hyperactivation of the attachment system", isCorrect: false },
            { text: "Dismissive-avoidant attachment with elements of disorganization", isCorrect: true },
            { text: "Purely disorganized attachment without dismissive features", isCorrect: false }
          ],
          explanation: "Will demonstrates a predominantly dismissive-avoidant attachment pattern characterized by defensive self-sufficiency, intellectualization, preemptive rejection, and denial of attachment needs. Elements of disorganization are also present given his history of frightening caregiving. His behavior—pushing people away, testing relationships, maintaining emotional distance—reflects the deactivation strategies characteristic of dismissive attachment.",
          accessibility: { ariaLabel: "Knowledge check about Will's attachment", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: "According to the concept of complex trauma, which of the following is TRUE about Will's presentation?",
          options: [
            { text: "His symptoms are limited to the classic PTSD triad of re-experiencing, avoidance, and hyperarousal", isCorrect: false },
            { text: "His difficulties span multiple domains including affect regulation, self-perception, relationships, and meaning-making", isCorrect: true },
            { text: "Complex trauma only affects children and resolves in adulthood", isCorrect: false },
            { text: "His intellectual abilities protected him from any trauma-related impact", isCorrect: false }
          ],
          explanation: "Complex trauma (or developmental trauma) involves prolonged, repeated traumatic experiences within the caregiving system. Unlike single-incident PTSD, complex trauma affects multiple domains: affect regulation (Will's explosive anger), self-perception (his sense of unworthiness), relationships (testing, pushing away), perception of perpetrators (complex feelings about abusers), and systems of meaning (cynicism, dismissal of opportunity). Will's intelligence did not protect him from these impacts.",
          accessibility: { ariaLabel: "Knowledge check about complex trauma", announceCorrect: true }
        },
        {
          type: "multiSelect",
          question: "Select ALL of the following that are behavioral indicators of dismissive-avoidant attachment demonstrated by Will Hunting:",
          options: [
            { text: "Using intellectualization to maintain emotional distance", isCorrect: true },
            { text: "Pushing people away before they can abandon him (preemptive rejection)", isCorrect: true },
            { text: "Seeking excessive closeness and reassurance from Skylar", isCorrect: false },
            { text: "Testing others to confirm expectations of failure or betrayal", isCorrect: true },
            { text: "Explicitly denying needs while showing behavioral evidence of unmet needs", isCorrect: true }
          ],
          explanation: "Will demonstrates multiple indicators of dismissive attachment: intellectualization as defense, preemptive rejection (sabotaging the relationship with Skylar), testing behavior (provoking Sean, challenging therapists), and denial of needs while his behavior reveals profound unmet attachment needs. He does NOT seek excessive closeness—that would characterize anxious-preoccupied attachment.",
          accessibility: { ariaLabel: "Multi-select about dismissive attachment indicators", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Consider a client you have worked with (or might encounter) who demonstrates dismissive-avoidant attachment features similar to Will's. How did (or might) their intellectualization and emotional distancing manifest in session? What strategies did you find (or might you try) to build alliance while respecting their defensive needs?",
          minLength: 150,
          accessibility: { role: "textbox", ariaLabel: "Clinical reflection on dismissive attachment" }
        }
      ]
    },

    // ============================================================
    // MODULE 3: Therapeutic Approach Analysis
    // ============================================================
    {
      title: "Sean Maguire's Therapeutic Approach: Analysis and Critique",
      order: 3,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: "Sean Maguire's Therapeutic Approach: Analysis and Critique",
          subtitle: "Examining Effective Interventions and Boundary Considerations",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Sean Maguire's therapeutic work with Will Hunting offers rich material for clinical analysis. In this module, we will examine Sean's approach through the lens of contemporary evidence-based practice, identifying elements that align with effective trauma treatment and those that raise legitimate clinical questions. Our goal is neither to uncritically celebrate Sean's methods nor to dismiss them, but to engage thoughtfully with what the film portrays and extract applicable lessons for our own practice.</p>

<h2>The Therapeutic Alliance: Research Foundation</h2>

<p>Before analyzing Sean's specific interventions, it is essential to establish the research context for understanding therapeutic relationships. Decades of psychotherapy research have consistently demonstrated that the therapeutic alliance is one of the strongest predictors of treatment outcome, regardless of therapeutic modality. The alliance accounts for approximately 5-8% of the variance in outcomes—a seemingly modest figure that actually represents a substantial effect given the complexity of psychotherapy.</p>

<p>Edward Bordin's influential conceptualization identifies three components of the therapeutic alliance: <strong>agreement on goals</strong> (what client and therapist are working toward), <strong>agreement on tasks</strong> (the activities that will achieve those goals), and the <strong>emotional bond</strong> between therapist and client. Strong alliances feature agreement across all three dimensions, though the relative importance of each may vary across treatment phases and client presentations.</p>

<p>For trauma survivors with attachment disruption, the bond component assumes particular importance. These clients come to therapy with working models that expect relationships to be dangerous, unreliable, or ultimately disappointing. The therapeutic relationship offers an opportunity to develop new working models through repeated experiences that disconfirm these expectations. However, this process takes time and requires the therapist to navigate the client's testing behavior without retaliating, withdrawing, or confirming negative expectations.</p>

<h2>What Sean Does Effectively</h2>

<p>Despite—or perhaps because of—his unorthodox methods, Sean demonstrates several therapeutically effective approaches in his work with Will:</p>

<h3>Unwavering Consistency and Presence</h3>

<p>Throughout Will's testing behavior, provocations, and withdrawal, Sean remains consistently present. He shows up for sessions. He does not retaliate when Will attacks him personally. He does not give up when Will is resistant.</p>

<p>This consistency is precisely what Will's early relationships lacked and what his attachment system needs to begin developing new expectations. The research on therapeutic alliance consistently emphasizes the therapist's ability to maintain a stable, reliable presence even when the client's behavior makes this difficult.</p>

<h3>Appropriate Confrontation Without Rejection</h3>

<p>One of Sean's most significant interventions occurs after Will's personal attack about Sean's deceased wife. Rather than terminating treatment, retaliating with cruelty, or pretending the attack didn't happen, Sean confronts Will directly: "You're a tough kid. And I ask you about war, you'd probably throw Shakespeare at me, right? 'Once more unto the breach, dear friends.' But you've never been near one."</p>

<p>Sean names Will's defensive pattern while making clear that he sees through the facade to the wounded person beneath. This confrontation carries respect rather than contempt—Sean is challenging Will to be more authentic, not punishing him for his defenses.</p>

<h3>The Use of Silence</h3>

<p>In a pivotal scene, Sean simply waits for Will to speak. This use of therapeutic silence can be powerful with clients who are accustomed to controlling interactions through verbal dominance.</p>

<p>By declining to fill the silence, Sean communicates that he is willing to wait, that he can tolerate the discomfort, and that the pace of disclosure belongs to Will. For a client like Will, who uses words as weapons and shields, the therapist's comfortable silence can disarm defensive strategies and create space for something genuine to emerge.</p>

<h3>Authentic Self-Disclosure</h3>

<p>Sean shares personal information about his own life—his marriage, his wife's death, his own struggles with loss. This self-disclosure is controversial from some clinical perspectives, and we will examine the concerns it raises.</p>

<p>However, in context, Sean's disclosure serves to level the playing field, to demonstrate that he too is human and vulnerable, and to model the kind of authentic engagement he is asking of Will. For a client who has successfully maintained distance from multiple therapists, Sean's willingness to be known—not just to know—may have been essential to building trust.</p>

<h3>The "Not Your Fault" Intervention</h3>

<p>Perhaps the film's most famous therapeutic moment occurs when Sean repeatedly tells Will, "It's not your fault," eventually breaking through Will's intellectual defenses to release deep grief. This intervention represents a <strong>corrective emotional experience</strong>—an interaction that differs from the client's expectations based on past relationships and thereby begins to shift internal working models.</p>

<p>Will intellectually knew the abuse was not his fault; countless people had probably told him so. But Sean's repetition, his persistence, his emotional presence in the moment, allowed this knowledge to move from intellectual understanding to felt experience.</p>`
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "The Concept of Corrective Emotional Experience",
              content: "Coined by Franz Alexander, corrective emotional experience refers to therapeutic interactions that provide the client with an experience different from what their history has led them to expect. For trauma survivors, these experiences gradually build new neural pathways and working models. The 'not your fault' scene exemplifies this: Will expected rejection, judgment, or superficial reassurance. Instead, he received persistent, emotionally attuned insistence on his innocence from someone who refused to be pushed away. This unexpected response created an opening for new learning."
            },
            {
              title: "Research on Therapist Self-Disclosure",
              content: "Therapist self-disclosure is a nuanced intervention with both potential benefits and risks. Research suggests that disclosure can enhance alliance and model vulnerability, but inappropriate disclosure (excessive, self-focused, or poorly timed) can burden clients or shift focus away from their needs. Sean's disclosures work because they serve Will's therapeutic needs, not Sean's need to be known. They are boundaried (he shares meaning, not excessive detail), relevant to Will's struggles, and offered in service of connection rather than the therapist's own processing."
            },
            {
              title: "The Role of Confrontation in Therapy",
              content: "Therapeutic confrontation involves directly addressing discrepancies, defenses, or patterns that impede progress. Effective confrontation is respectful, well-timed, and offered in the context of a supportive relationship. It differs from criticism or attack. Sean's confrontation of Will after the personal attack models this distinction: he names what Will is doing (defending through intellectual aggression) while communicating continued regard for Will as a person. The confrontation opens dialogue rather than closing it."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Therapeutic concepts accordion" }
        },
        {
          type: "text",
          content: `<h2>Elements Requiring Critical Examination</h2>

<p>While Sean's approach proves effective in the film's narrative, several elements warrant critical examination and should not be uncritically adopted as clinical models:</p>

<h3>Boundary Ambiguity</h3>

<p>The therapy occurs in a context of multiple boundary complications. Sean has a prior relationship with the referring professor. By the end of the film, the therapeutic relationship has evolved into something resembling friendship, with Sean attending Will's going-away gathering.</p>

<p>While the film portrays this positively, such boundary flexibility raises legitimate concerns about role confusion, the impact on therapeutic frame, and the message it sends about professional relationships. In real practice, such boundary crossings would require careful ethical consideration and documentation.</p>

<h3>Therapist's Own Unresolved Issues</h3>

<p>Sean is grieving his wife's death and has his own attachment-related wounds. While his personal experience may increase empathy and authenticity, unprocessed therapist issues can also lead to countertransference enactments, projection onto the client, or using the therapy to meet the therapist's needs rather than the client's.</p>

<p>The film suggests Sean's work with Will is healing for Sean as well—this can occur in therapy, but it should not be the primary purpose or an unexamined dynamic.</p>

<h3>Physical Intimidation</h3>

<p>In one scene, Sean grabs Will by the throat after Will's personal attack. While the film frames this as a turning point that establishes Sean's strength and authenticity, any physical contact of this nature in actual clinical practice would be ethically and legally problematic. This moment reflects cinematic drama rather than clinical reality and should not be emulated.</p>

<h3>Lack of Formal Assessment and Treatment Planning</h3>

<p>The film shows little evidence of formal trauma assessment, treatment planning, or documentation. While narrative films cannot capture every aspect of clinical work, clinicians must remember that effective treatment typically includes systematic assessment, clear treatment goals, and ongoing evaluation of progress.</p>

<p>Sean's intuitive, relationship-based approach works within the film's narrative but would need to be complemented by more structured clinical practices in actual treatment.</p>

<h2>The Therapeutic Alliance in Action: Scene Analysis</h2>

<p>Let us examine a specific scene through the lens of Bordin's alliance components. In the bench scene at the park, Sean responds to Will's personal attack from the previous session. Rather than interpreting or defending, Sean shares his perspective directly:</p>

<p>"You're just a kid. You don't have the faintest idea what you're talking about... You've never been out of Boston... If I asked you about art, you'd probably give me the skinny on every art book ever written... But I bet you can't tell me what it smells like in the Sistine Chapel... If I asked you about love, you'd probably quote me a sonnet. But you've never looked at a woman and been totally vulnerable..."</p>

<p>This monologue accomplishes several therapeutic tasks:</p>

<ul>
<li>It establishes Sean's boundaries (his life experience cannot be reduced to Will's intellectual analysis).</li>
<li>It models authentic emotional expression.</li>
<li>It challenges Will's defenses while communicating genuine interest in who Will really is beneath those defenses.</li>
<li>It begins building the emotional bond component of the alliance by demonstrating that Sean sees Will clearly—both his gifts and his limitations—and remains engaged rather than intimidated or put off.</li>
</ul>

<p>The bond component strengthens further through subsequent sessions as Sean proves willing to wait through Will's silence, to share his own vulnerabilities, and to remain present despite Will's testing.</p>

<p>The goals and tasks components emerge more gradually—Will initially has no goals for therapy, and the implicit task is simply to show up. Over time, as trust develops, the goals expand to include Will's capacity to form intimate relationships, pursue his potential, and integrate his trauma history.</p>`
        },
        {
          type: "multipleChoice",
          question: "According to Bordin's conceptualization, the therapeutic alliance includes which three components?",
          options: [
            { text: "Assessment, intervention, and termination", isCorrect: false },
            { text: "Agreement on goals, agreement on tasks, and the emotional bond", isCorrect: true },
            { text: "Transference, countertransference, and working through", isCorrect: false },
            { text: "Empathy, unconditional positive regard, and genuineness", isCorrect: false }
          ],
          explanation: "Bordin's influential model identifies three components of therapeutic alliance: agreement on goals (what client and therapist are working toward), agreement on tasks (the activities that will achieve those goals), and the emotional bond between therapist and client. While empathy, positive regard, and genuineness are important therapeutic conditions (from Rogers), they are distinct from Bordin's alliance model.",
          accessibility: { ariaLabel: "Knowledge check about alliance components", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: "The 'It's not your fault' intervention in the film is best understood as an example of:",
          options: [
            { text: "Cognitive restructuring through Socratic questioning", isCorrect: false },
            { text: "A corrective emotional experience that differs from expected relationship patterns", isCorrect: true },
            { text: "Systematic desensitization to trauma memories", isCorrect: false },
            { text: "Interpretation of unconscious defense mechanisms", isCorrect: false }
          ],
          explanation: "The 'not your fault' scene represents a corrective emotional experience—an interaction that differs from what the client's history led them to expect. Will expected rejection or superficial reassurance; instead, he received persistent, emotionally attuned insistence on his innocence. This unexpected response, delivered within a trusted relationship, allowed intellectual knowledge to become felt experience.",
          accessibility: { ariaLabel: "Knowledge check about not your fault intervention", announceCorrect: true }
        },
        {
          type: "multiSelect",
          question: "Select ALL elements of Sean's approach that the course identifies as REQUIRING CRITICAL EXAMINATION rather than uncritical adoption:",
          options: [
            { text: "The boundary ambiguity in the therapeutic relationship", isCorrect: true },
            { text: "Sean's own unresolved grief potentially affecting treatment", isCorrect: true },
            { text: "Sean's consistent, reliable presence throughout treatment", isCorrect: false },
            { text: "The physical intimidation scene (grabbing Will's throat)", isCorrect: true },
            { text: "The lack of formal assessment and treatment planning shown in the film", isCorrect: true }
          ],
          explanation: "The course identifies four elements requiring critical examination: boundary ambiguity (evolving toward friendship), therapist's unresolved issues, physical intimidation (ethically/legally problematic), and lack of formal assessment/treatment planning. Sean's consistent presence, by contrast, is identified as an effective therapeutic element that aligns with research on therapeutic alliance.",
          accessibility: { ariaLabel: "Multi-select about elements requiring examination", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Sean's therapeutic effectiveness appears to stem partly from his willingness to be authentic and vulnerable with Will. In your own practice, how do you balance authenticity and appropriate professional boundaries? Can you identify a time when measured self-disclosure strengthened a therapeutic relationship, or when maintaining more distance seemed clinically indicated?",
          minLength: 150,
          accessibility: { role: "textbox", ariaLabel: "Reflection on authenticity and boundaries" }
        }
      ]
    },

    // ============================================================
    // MODULE 4: Clinical Application and Integration
    // ============================================================
    {
      title: "Clinical Application: Vignettes and Integration",
      order: 4,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 4,
          title: "Clinical Application: Vignettes and Integration",
          subtitle: "Applying Course Concepts to Clinical Practice",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>This final module provides opportunities to apply the concepts explored throughout this course to clinical scenarios. Through vignettes, decision points, and reflective exercises, you will practice identifying attachment patterns, implementing trauma-informed interventions, and navigating the challenges of building therapeutic alliance with resistant clients. These applications bridge the gap between theoretical understanding and clinical skill.</p>

<h2>Clinical Vignette 1: The Testing Phase</h2>

<p><strong>Client Presentation:</strong> Marcus, a 28-year-old software engineer, was referred to therapy by his employer's EAP following a verbal altercation with his supervisor. In your third session, Marcus arrives fifteen minutes late, makes dismissive comments about therapy being "a waste of time," and when you attempt to explore his work relationships, he launches into an intellectual analysis of organizational psychology that fills the remaining time. As he's leaving, hand on the doorknob, he pauses and says quietly, "I bet you can't wait to get rid of me like everyone else."</p>

<p>This vignette illustrates several features we've discussed: the use of intellectualization to avoid emotional engagement, testing behavior to confirm expectations of rejection, and a doorknob comment that reveals underlying attachment concerns precisely as the session ends (maximizing distance while exposing vulnerability).</p>

<p><strong>Clinical Considerations:</strong></p>
<p>Marcus's behavior reflects a dismissive attachment pattern similar to Will's. His lateness, dismissiveness, and intellectual filling of session time are deactivating strategies that maintain emotional distance. The doorknob comment, however, reveals what the defenses are protecting: a deep expectation of abandonment and a longing to be proven wrong.</p>

<p>A trauma-informed response to the doorknob comment might include acknowledging what he's said without pursuing it when he's already physically leaving: "That sounds really important, and I'd like us to explore that more next time. I'm not going anywhere." This response names the significance, offers reassurance without overwhelming him, and orients toward continued relationship.</p>

<p>In subsequent sessions, the clinician might gently name the pattern without interpreting: "I notice that sometimes when we start to get close to feelings, we shift to analyzing ideas. I wonder what that's about." This intervention makes the defense visible without attacking it, inviting curiosity rather than demanding change.</p>`
        },
        {
          type: "text",
          content: `<h2>Clinical Vignette 2: The Disclosure Crisis</h2>

<p><strong>Client Presentation:</strong> Elena, a 34-year-old teacher, has been in therapy with you for six months. She initially presented with anxiety and relationship difficulties. Over time, a picture of childhood emotional neglect has emerged, though she has minimized its impact. In today's session, she suddenly discloses severe childhood sexual abuse that she has never told anyone. She is visibly distressed but also dissociated, speaking in a flat affect about horrific events. At the end of her disclosure, she says, "You probably think I'm disgusting now. I shouldn't have said anything."</p>

<p>This vignette presents several clinical challenges: managing an unexpected disclosure, responding to dissociation, addressing the shame that often follows disclosure, and maintaining connection without overwhelming the client or yourself.</p>

<p><strong>Clinical Considerations:</strong></p>
<p>Elena's disclosure represents a significant therapeutic moment requiring careful response. Her statement "You probably think I'm disgusting" reflects the internalized shame common among abuse survivors—a projection onto the therapist of the judgment she directs at herself. This mirrors Will's expectation of rejection when vulnerability is revealed.</p>

<p>An effective response addresses multiple levels: the content of what was shared, the emotional state Elena is in, and the relational meaning of the disclosure. For example: "I'm really glad you trusted me enough to share this. What happened to you was not your fault, and nothing you've told me changes my respect for you. I also notice you seem kind of far away right now—that makes sense given how painful this is. Before we end today, I want to make sure you're feeling grounded enough to leave safely. We can talk more about this at your pace."</p>

<p>This response:</p>

<ul>
<li>Validates the courage of disclosure</li>
<li>Directly addresses shame by naming continued respect</li>
<li>Notices dissociation without pathologizing it</li>
<li>Attends to safety</li>
<li>Affirms ongoing relationship and client pacing</li>
</ul>

<p>It follows trauma-informed principles of safety, trustworthiness, collaboration, and empowerment.</p>

<h2>Clinical Vignette 3: Therapeutic Rupture and Repair</h2>

<p><strong>Client Presentation:</strong> After four months of productive therapy, David, a 40-year-old with history of foster care placement and attachment disruption, learns that you will be taking a two-week vacation. In the sessions leading up to your absence, David becomes increasingly hostile, missing appointments and, when present, criticizing your approach. Upon your return, David states, "I knew you'd leave eventually. Everyone does. I don't know why I bothered coming back."</p>

<p>Therapist absences frequently activate attachment concerns in clients with disrupted early relationships. David's response—hostility, withdrawal, and explicit expression of abandonment expectations—represents both a regression and an opportunity for therapeutic work.</p>

<p><strong>Clinical Considerations:</strong></p>
<p>David's response is entirely understandable given his history: every significant relationship has ended in loss or abandonment. The vacation activated his attachment system, and his hostility represents both a protest against the anticipated loss and a preemptive defense against the pain of abandonment.</p>

<p>The repair process involves several elements:</p>

<ul>
<li>Acknowledging the impact of the absence ("I understand that my being away was really hard for you")</li>
<li>Validating his response without pathologizing ("It makes a lot of sense that you'd be angry and want to protect yourself")</li>
<li>Differentiating this relationship from past ones ("I came back. I'm here. I'm not going away")</li>
<li>Using the rupture as material for therapeutic exploration ("Can we talk about what the last few weeks have been like for you?")</li>
</ul>

<p>This rupture-repair sequence can ultimately strengthen the alliance by demonstrating that anger does not destroy relationships and that the therapist can survive the client's distress without retaliating or abandoning. Each successfully navigated rupture builds new working models of relationship.</p>`
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Key Principles for Working with Dismissive Clients",
              content: "When working with dismissive-avoidant clients: (1) Expect and tolerate testing behavior without retaliating; (2) Respect defenses while gently making them visible; (3) Use silence strategically rather than filling space; (4) Offer consistency and reliability as corrective experiences; (5) Name attachment dynamics without demanding immediate change; (6) Attend to doorknob comments and other indirect expressions of need; (7) Balance patience with appropriate challenge."
            },
            {
              title: "Trauma-Informed Response Principles",
              content: "Trauma-informed responses incorporate: (1) Safety—physical and emotional security in the therapeutic environment; (2) Trustworthiness—clear, consistent, boundaried behavior; (3) Choice—maximizing client control and agency; (4) Collaboration—working alongside rather than doing to; (5) Empowerment—building on strengths; (6) Cultural responsiveness—recognizing how cultural context shapes trauma experience and expression."
            },
            {
              title: "Managing Countertransference with Trauma Survivors",
              content: "Working with trauma survivors activates countertransference responses including: over-identification (losing boundaried perspective), rescue fantasies (needing to save the client), avoidance (subtly steering away from painful material), and vicarious traumatization (absorbing client trauma). Self-awareness, supervision, and personal self-care are essential for managing these responses and maintaining therapeutic effectiveness."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Clinical principles accordion" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each clinical scenario with the most appropriate initial therapeutic response.",
          matchingPairs: [
            { term: "Client uses intellectualization to avoid affect", definition: "Gently name the pattern and invite curiosity without demanding immediate change" },
            { term: "Client makes doorknob disclosure as leaving", definition: "Acknowledge importance, offer continued relationship, don't pursue in the moment" },
            { term: "Client expresses shame after vulnerability", definition: "Directly address shame with validation of courage and continued regard" },
            { term: "Client hostile after therapist absence", definition: "Acknowledge impact of absence, validate response, differentiate from past losses" },
            { term: "Client tests therapist with provocative statements", definition: "Maintain consistent presence without retaliation or withdrawal" }
          ],
          accessibility: { ariaLabel: "Matching exercise for clinical responses", role: "application" }
        },
        {
          type: "text",
          content: `<h2>Integration: What Makes Therapy Healing for Trauma Survivors?</h2>

<p>As we conclude this course, let us synthesize the core elements that enable therapeutic healing for clients with histories of attachment disruption and complex trauma:</p>

<h3>The Reliable Relationship</h3>

<p>Perhaps the most fundamental healing element is the therapist's consistent, reliable presence over time. For clients whose early relationships were characterized by unpredictability, neglect, or harm, the therapist's ongoing availability—showing up session after session, surviving the client's anger and testing, remaining engaged despite defenses—provides the experiential foundation for new working models.</p>

<p>This is not about perfect attunement but about good-enough consistency and repair when ruptures occur.</p>

<h3>Corrective Emotional Experiences</h3>

<p>Healing occurs when the therapeutic relationship offers experiences that differ from what the client's history has led them to expect. Will expected rejection when he revealed his wounds; Sean remained present. David expected abandonment when his therapist returned from vacation; the therapist came back and addressed what happened.</p>

<p>Each of these unexpected outcomes, accumulating over time, gradually shifts the implicit expectations that drive defensive behavior.</p>

<h3>Making the Implicit Explicit</h3>

<p>Much of what trauma survivors struggle with operates outside conscious awareness—automatic defensive reactions, implicit expectations of relationships, body-based stress responses. Therapy helps by making these implicit patterns explicit, bringing them into awareness where they can be examined, understood, and ultimately modified.</p>

<p>Sean's bench monologue does this when he names Will's defensive patterns while communicating continued regard.</p>

<h3>Respecting Pacing and Defenses</h3>

<p>Effective trauma treatment respects the client's pace and honors the protective function of defenses. Pushing too fast toward emotional material can overwhelm regulatory capacity and re-traumatize. Moving too slowly may collude with avoidance.</p>

<p>The skilled therapist works at the edge of the client's window of tolerance, gradually expanding capacity while maintaining safety.</p>

<h3>The Therapist's Use of Self</h3>

<p>The therapist's authentic, boundaried self-presence serves as both model and tool. When therapists can tolerate their own emotional responses, manage their countertransference, and remain genuinely present without hiding behind technique, they offer clients an experience of a regulated, authentic human being who can handle difficult emotions without falling apart or retaliating.</p>

<p>This modeling is itself therapeutic.</p>

<h2>Course Summary and Continuing Learning</h2>

<p>Through our analysis of Good Will Hunting, we have explored the intersection of attachment disruption and complex trauma, examined therapeutic approaches that foster healing relationships, and practiced applying these concepts to clinical scenarios. The film, while imperfect as a clinical model, offers a powerful portrayal of how consistent, authentic therapeutic presence can penetrate defenses and create conditions for profound change.</p>

<p>As you complete this course and return to your clinical work, carry with you the central insight that emerges from both research and the film's narrative: the therapeutic relationship is not merely the context in which techniques are delivered, but is itself a primary mechanism of change. For clients whose early relationships caused harm, it is the experience of a different kind of relationship that enables healing. Your consistent, boundaried, authentic presence is among the most valuable things you offer.</p>

<p>The final assessment follows this module. Please ensure you have thoroughly reviewed all course material before proceeding. A score of 80% or higher is required for successful completion and CE credit.</p>`
        },
        {
          type: "multipleChoice",
          question: "When a client with dismissive attachment makes a 'doorknob comment' revealing vulnerability as they are leaving the session, the most appropriate immediate response is to:",
          options: [
            { text: "Insist they sit back down to fully process the disclosure", isCorrect: false },
            { text: "Acknowledge the importance, offer continued relationship, and address more fully next session", isCorrect: true },
            { text: "Ignore the comment to avoid reinforcing inappropriate timing", isCorrect: false },
            { text: "Interpret the doorknob timing as resistance and confront it directly", isCorrect: false }
          ],
          explanation: "Doorknob comments reveal vulnerability at a moment when the client has maximum physical distance available. Pursuing the content intensively would likely overwhelm the client's regulatory capacity. The appropriate response acknowledges significance, affirms the relationship will continue, and orients toward future exploration. This respects the client's pacing while validating the communication.",
          accessibility: { ariaLabel: "Knowledge check about doorknob comments", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: "A client's hostility following a therapist's vacation is BEST understood as:",
          options: [
            { text: "Evidence that the therapy is failing and termination should be considered", isCorrect: false },
            { text: "Manipulation that should be firmly confronted", isCorrect: false },
            { text: "Activation of the attachment system with protest and defense against anticipated abandonment", isCorrect: true },
            { text: "A sign that the therapist made a clinical error by taking vacation", isCorrect: false }
          ],
          explanation: "For clients with attachment disruption, therapist absences activate the attachment system. Hostility represents both protest against perceived abandonment and defense against anticipated pain. Successfully navigating this rupture—acknowledging impact, validating response, demonstrating return—can strengthen the alliance by providing corrective experience.",
          accessibility: { ariaLabel: "Knowledge check about vacation response", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "As you complete this course, identify one specific concept or approach that you plan to integrate into your clinical practice. How will you implement this? What challenges do you anticipate, and how might you address them?",
          minLength: 150,
          accessibility: { role: "textbox", ariaLabel: "Final integration reflection" }
        }
      ]
    }
  ],

  // ============================================================
  // FINAL ASSESSMENT - 15+ Questions
  // ============================================================
  assessment: {
    passThreshold: 0.80,
    maxAttempts: 3,
    questions: [
      {
        question: "According to the course, what makes Will Hunting's case particularly instructive for understanding the relationship between intelligence and trauma?",
        options: [
          { text: "His intellectual disabilities complicated his trauma presentation", isCorrect: false },
          { text: "His exceptional cognitive abilities allowed him to construct elaborate defenses and avoid emotional engagement", isCorrect: true },
          { text: "His intelligence protected him from the psychological effects of abuse", isCorrect: false },
          { text: "His academic achievements demonstrated successful trauma resolution", isCorrect: false }
        ],
        explanation: "The course emphasizes that Will's intellectual brilliance serves his avoidance—allowing him to construct elaborate defenses, outmaneuver therapists, and maintain emotional distance. This 'intelligence in service of avoidance' is common among high-functioning trauma survivors."
      },
      {
        question: "Will Hunting's predominant attachment pattern is best described as:",
        options: [
          { text: "Secure attachment with appropriate trust in relationships", isCorrect: false },
          { text: "Anxious-preoccupied attachment with hyperactivation of attachment needs", isCorrect: false },
          { text: "Dismissive-avoidant attachment with defensive self-sufficiency and emotional distancing", isCorrect: true },
          { text: "Attachment disorder without any organized pattern", isCorrect: false }
        ],
        explanation: "Will demonstrates dismissive-avoidant attachment characterized by deactivation strategies: intellectualization, preemptive rejection, testing behavior, and denial of attachment needs while behavioral evidence reveals profound unmet needs."
      },
      {
        question: "The concept of 'complex trauma' differs from single-incident PTSD primarily in that complex trauma:",
        options: [
          { text: "Is less severe and has better prognosis", isCorrect: false },
          { text: "Only affects cognition while PTSD affects emotions", isCorrect: false },
          { text: "Involves repeated traumatic experiences within the caregiving system during development, affecting multiple domains", isCorrect: true },
          { text: "Occurs only in adulthood while PTSD occurs in childhood", isCorrect: false }
        ],
        explanation: "Complex trauma (developmental trauma) involves prolonged, repeated traumatic experiences within the caregiving system during childhood. Unlike single-incident PTSD, it affects multiple domains: affect regulation, self-perception, relationships, perception of perpetrators, and systems of meaning."
      },
      {
        question: "According to Bordin's model of therapeutic alliance, which three components are essential?",
        options: [
          { text: "Empathy, genuineness, and unconditional positive regard", isCorrect: false },
          { text: "Transference, countertransference, and interpretation", isCorrect: false },
          { text: "Agreement on goals, agreement on tasks, and the emotional bond", isCorrect: true },
          { text: "Assessment, intervention, and termination planning", isCorrect: false }
        ],
        explanation: "Bordin's influential alliance model includes: agreement on goals (what therapy is working toward), agreement on tasks (activities to achieve goals), and the emotional bond between therapist and client. This model is distinct from Rogers' core conditions."
      },
      {
        question: "Sean Maguire's repetition of 'It's not your fault' is best understood therapeutically as:",
        options: [
          { text: "A cognitive restructuring technique challenging irrational beliefs", isCorrect: false },
          { text: "A corrective emotional experience providing an unexpected relational response", isCorrect: true },
          { text: "An interpretation of Will's unconscious guilt", isCorrect: false },
          { text: "A behavioral intervention reinforcing positive self-talk", isCorrect: false }
        ],
        explanation: "The scene represents a corrective emotional experience—an interaction differing from what the client expected based on past relationships. Will expected rejection or superficial reassurance; Sean's persistent, emotionally attuned response allowed intellectual knowledge to become felt experience."
      },
      {
        question: "Which of the following is identified in the course as an element of Sean's approach requiring CRITICAL EXAMINATION rather than emulation?",
        options: [
          { text: "His consistent presence despite Will's testing behavior", isCorrect: false },
          { text: "His use of therapeutic silence", isCorrect: false },
          { text: "The physical intimidation scene where he grabs Will", isCorrect: true },
          { text: "His willingness to wait for Will to be ready", isCorrect: false }
        ],
        explanation: "The course identifies physical intimidation (grabbing Will's throat) as ethically and legally problematic—a moment of cinematic drama that should never be emulated in actual clinical practice. Consistent presence, therapeutic silence, and patient waiting are identified as effective therapeutic elements."
      },
      {
        question: "The neurobiological impact of early trauma includes all of the following EXCEPT:",
        options: [
          { text: "Potential dysregulation of the stress response system", isCorrect: false },
          { text: "Enhanced development of prefrontal regulatory capacities", isCorrect: true },
          { text: "Hypervigilant threat-detection systems", isCorrect: false },
          { text: "Disrupted development of affect regulation capacity", isCorrect: false }
        ],
        explanation: "Early trauma does NOT enhance prefrontal development—rather, the prefrontal cortex (involved in emotional regulation) may develop differently under chronic stress. Trauma typically results in dysregulated stress response, hypervigilant threat detection, and disrupted affect regulation capacity."
      },
      {
        question: "A client with dismissive attachment who uses intellectualization as a defense is MOST effectively engaged by:",
        options: [
          { text: "Directly interpreting the defense and demanding emotional expression", isCorrect: false },
          { text: "Matching their intellectual discourse to build rapport", isCorrect: false },
          { text: "Gently naming the pattern while inviting curiosity without demanding change", isCorrect: true },
          { text: "Ignoring intellectual content and focusing only on affect", isCorrect: false }
        ],
        explanation: "The course recommends gently naming defensive patterns while inviting curiosity rather than demanding immediate change. This approach makes the defense visible without attacking it, respects the protective function, and opens space for exploration at the client's pace."
      },
      {
        question: "The course identifies therapeutic rupture-repair sequences as important because they:",
        options: [
          { text: "Demonstrate the therapist's authority and establish appropriate hierarchy", isCorrect: false },
          { text: "Should be avoided at all costs in effective therapy", isCorrect: false },
          { text: "Provide opportunities for corrective experiences showing relationships can survive anger and conflict", isCorrect: true },
          { text: "Indicate treatment failure requiring immediate termination", isCorrect: false }
        ],
        explanation: "Successfully navigated ruptures strengthen the alliance by demonstrating that anger does not destroy relationships and the therapist can survive client distress without retaliating or abandoning. Each repair builds new working models of relationship."
      },
      {
        question: "When a client discloses trauma and immediately expresses shame ('You probably think I'm disgusting now'), an effective response includes:",
        options: [
          { text: "Quickly changing the subject to reduce their distress", isCorrect: false },
          { text: "Directly addressing shame by naming continued respect while validating disclosure courage", isCorrect: true },
          { text: "Providing detailed reassurance about how common their experience is", isCorrect: false },
          { text: "Interpreting the shame as resistance to treatment", isCorrect: false }
        ],
        explanation: "Effective responses directly address shame—the projection onto the therapist reflects self-directed judgment. Naming continued respect validates disclosure courage and provides corrective experience. The response should also attend to dissociation, safety, and pacing."
      },
      {
        question: "According to attachment theory, dismissive-avoidant individuals typically have internal working models characterized by:",
        options: [
          { text: "Positive views of self and others with trust in availability", isCorrect: false },
          { text: "Negative views of self with idealized views of others", isCorrect: false },
          { text: "Positive (often defensive) views of self with negative views of others as unavailable", isCorrect: true },
          { text: "Equally negative views of both self and others", isCorrect: false }
        ],
        explanation: "Dismissive-avoidant attachment involves deactivation strategies based on working models with positive (often inflated or defensive) self-views and negative views of others as unavailable or unreliable. This leads to minimizing attachment needs and maintaining emotional independence."
      },
      {
        question: "The course describes 'preemptive rejection' in Will's behavior. This pattern involves:",
        options: [
          { text: "Carefully evaluating relationships before committing to them", isCorrect: false },
          { text: "Pushing people away before they can abandon him, as self-protection", isCorrect: true },
          { text: "Openly communicating fears of abandonment to partners", isCorrect: false },
          { text: "Seeking excessive reassurance to prevent rejection", isCorrect: false }
        ],
        explanation: "Preemptive rejection is a dismissive attachment strategy: pushing people away before they can abandon you. Will demonstrates this with Skylar—as intimacy deepens, he sabotages the relationship. This pattern, developed in response to actual abandonment, now prevents corrective experiences."
      },
      {
        question: "Judith Herman's concept of complex trauma includes alterations in all of the following domains EXCEPT:",
        options: [
          { text: "Regulation of affect and impulses", isCorrect: false },
          { text: "Self-perception and identity", isCorrect: false },
          { text: "Enhanced capacity for secure attachment", isCorrect: true },
          { text: "Systems of meaning and worldview", isCorrect: false }
        ],
        explanation: "Herman's complex trauma framework includes alterations in: affect/impulse regulation, consciousness, self-perception, perception of perpetrators, relations with others, and systems of meaning. Complex trauma disrupts rather than enhances attachment capacity."
      },
      {
        question: "The therapeutic alliance research cited in the course indicates that the alliance:",
        options: [
          { text: "Has minimal impact on treatment outcomes compared to technique", isCorrect: false },
          { text: "Is only important in psychodynamic therapies, not other modalities", isCorrect: false },
          { text: "Is one of the strongest predictors of outcome regardless of therapeutic modality", isCorrect: true },
          { text: "Is easily established and rarely disrupted in effective therapy", isCorrect: false }
        ],
        explanation: "Decades of psychotherapy research demonstrate that therapeutic alliance is one of the strongest predictors of treatment outcome, regardless of modality. The alliance accounts for approximately 5-8% of outcome variance—a substantial effect given psychotherapy's complexity."
      },
      {
        question: "For clients whose early relationships were characterized by trauma and disruption, what does the course identify as MOST fundamental to therapeutic healing?",
        options: [
          { text: "Rapid trauma processing using exposure techniques", isCorrect: false },
          { text: "The therapist's consistent, reliable presence over time providing corrective relationship experience", isCorrect: true },
          { text: "Cognitive restructuring of irrational beliefs about relationships", isCorrect: false },
          { text: "Medication management to address neurobiological dysregulation", isCorrect: false }
        ],
        explanation: "The course's central synthesis emphasizes the reliable relationship as the most fundamental healing element. For clients whose early relationships were unpredictable or harmful, the therapist's consistent presence—showing up, surviving testing, remaining engaged—provides the foundation for new working models."
      },
      {
        question: "When working with trauma survivors, 'respecting pacing and defenses' means:",
        options: [
          { text: "Never challenging defenses or encouraging emotional exploration", isCorrect: false },
          { text: "Pushing quickly through defenses to access core traumatic material", isCorrect: false },
          { text: "Working at the edge of the client's window of tolerance while honoring the protective function of defenses", isCorrect: true },
          { text: "Allowing the client to avoid all difficult topics indefinitely", isCorrect: false }
        ],
        explanation: "Effective trauma treatment respects pacing while not colluding with complete avoidance. Working at the window of tolerance's edge gradually expands capacity while maintaining safety. Defenses developed for protection deserve respect even as therapy helps clients discover they're no longer needed."
      }
    ]
  }
};

// Database connection and seeding function
async function seedCourse() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const InteractiveCourse = mongoose.model('InteractiveCourse', new mongoose.Schema({}, { strict: false }));
    
    // Check if course already exists
    const existing = await InteractiveCourse.findOne({ slug: courseData.slug });
    if (existing) {
      console.log('Course already exists. Updating...');
      await InteractiveCourse.updateOne({ slug: courseData.slug }, { $set: courseData });
      console.log('Course updated successfully');
    } else {
      await InteractiveCourse.create(courseData);
      console.log('Course created successfully');
    }

    // Count words for verification
    let totalWords = 0;
    courseData.modules.forEach(module => {
      module.contentBlocks.forEach(block => {
        if (block.type === 'text' && block.content) {
          totalWords += block.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length;
        }
        if (block.type === 'accordion' && block.accordionItems) {
          block.accordionItems.forEach(item => {
            totalWords += (item.title + ' ' + item.content).split(/\s+/).filter(w => w).length;
          });
        }
      });
    });

    console.log(`\n=== ACEP Compliance Check ===`);
    console.log(`CE Hours: ${courseData.ceHours}`);
    console.log(`Required words: ${courseData.ceHours * 6000}`);
    console.log(`Actual words (approx): ${totalWords}`);
    console.log(`Words per CE hour: ${Math.round(totalWords / courseData.ceHours)}`);
    console.log(`Modules: ${courseData.modules.length}`);
    console.log(`Assessment questions: ${courseData.assessment.questions.length}`);
    console.log(`References: ${courseData.references.length}`);
    console.log(`Pass threshold: ${courseData.assessment.passThreshold * 100}%`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding course:', error);
    process.exit(1);
  }
}

seedCourse();
