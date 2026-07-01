/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUG = 'therapeutic-rapport';

const COURSE = {
  title: "Building Therapeutic Rapport: The First Sessions",
  slug: SLUG,
  courseCode: "CR-104",
  description: "The therapeutic alliance is the most consistent predictor of positive outcomes across all therapeutic approaches. This practical 1-hour course focuses on the critical first sessions where rapport is established. Clinicians will learn Bordin's working alliance model, specific strategies for building trust while managing the intake process, and the Safran-Muran rupture-repair framework for recovering when early sessions go poorly. Emphasis is placed on measuring alliance quality and adapting rapport-building strategies across cultural contexts.",
  ceHours: 1,
  ceuHours: 1,
  ceuEligible: true,
  ceCategory: "Clinical",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  accessType: "free",
  price: 0,
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  level: "Introductory",
  deliveryMethod: "Asynchronous Online",
  objectives: [
    "Explain Bordin's working alliance model and the research linking alliance quality to treatment outcomes",
    "Implement specific strategies for building rapport in the first session while managing intake requirements",
    "Balance information gathering with relationship building during the intake process",
    "Identify withdrawal and confrontation ruptures using the Safran-Muran framework",
    "Utilize routine outcome monitoring to track alliance quality throughout treatment"
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Counselors-in-Training under supervision"
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia"
  },
  references: [
    { title: "Psychotherapy relationships that work (3rd ed.)", author: "Norcross, J. C., & Lambert, M. J. (Eds.)", year: 2019, source: "Oxford University Press" },
    { title: "Negotiating the therapeutic alliance: A relational treatment guide", author: "Safran, J. D., & Muran, J. C.", year: 2000, source: "Guilford Press" },
    { title: "The working alliance: Theory, research, and practice", author: "Bordin, E. S.", year: 1979, source: "Psychotherapy: Theory, Research and Practice, 16(3), 252-260" },
    { title: "The great psychotherapy debate (2nd ed.)", author: "Wampold, B. E., & Imel, Z. E.", year: 2015, source: "Routledge" },
    { title: "The relation between alliance and outcome: A meta-analysis", author: "Horvath, A. O., Del Re, A. C., Flückiger, C., & Symonds, D.", year: 2011, source: "Journal of Counseling Psychology, 58(1), 10-21" },
    { title: "On the client's side of the alliance", author: "Bachelor, A.", year: 2013, source: "Psychotherapy Research, 23(2), 150-164" }
  ],
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  sections: [
    // ─── SECTION 1 ──────────────────────────────────
    {
      title: "The Alliance Matters: Research and Theory",
      description: "Bordin's model, meta-analytic evidence, and why the relationship outperforms technique",
      module: "Module 1: The Alliance",
      order: 1,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Most Robust Finding in Psychotherapy Research</h2>
<p>If there is one finding in psychotherapy research that has been replicated with remarkable consistency across decades, orientations, settings, and populations, it is this: the quality of the therapeutic alliance is a reliable predictor of treatment outcome. Horvath, Del Re, Flückiger, and Symonds (2011) conducted a comprehensive meta-analysis of over 200 studies encompassing more than 14,000 treatment episodes and found a robust correlation (r = .275) between alliance and outcome. While this may seem modest in isolation, in the context of psychotherapy research—where many specific technique effects are small—it represents one of the largest and most consistent predictors of whether clients get better.</p>
<p>Wampold and Imel (2015), in their landmark analysis of the psychotherapy research literature, concluded that common factors—particularly the therapeutic relationship—account for substantially more outcome variance than specific techniques. Their contextual model of psychotherapy positions the alliance not as one ingredient among many, but as the foundation upon which all therapeutic work rests. Without a working alliance, even the most evidence-based intervention is unlikely to produce meaningful change.</p>
<h2>Bordin's Working Alliance Model</h2>
<p>Edward Bordin's (1979) tripartite model of the working alliance provides the most widely used conceptual framework for understanding the therapeutic relationship. Bordin proposed that the alliance consists of three interrelated components:</p>
<p><strong>Bond</strong> refers to the emotional quality of the relationship—the sense of trust, liking, respect, and caring between therapist and client. Bond is what most people think of when they hear the word "rapport." It involves the client's sense that the therapist understands them, respects them, and genuinely cares about their wellbeing. Bond is necessary but not sufficient—a warm, caring relationship without clinical direction is not therapy.</p>
<p><strong>Goals</strong> refer to the degree of agreement between therapist and client about what they are working toward. When goals are aligned, both parties are pulling in the same direction. When goals are misaligned—the therapist is working on insight while the client wants symptom relief, or the client wants to save the marriage while the therapist sees individual differentiation as the priority—the alliance is compromised regardless of how warm the relationship feels.</p>
<p><strong>Tasks</strong> refer to the agreement about the methods, activities, and responsibilities that constitute the therapy. Tasks include both in-session activities (talking about feelings, completing exposure exercises, practicing skills) and between-session assignments (homework, journaling, behavioral experiments). When the client understands and agrees with the tasks of therapy—when they make sense in relation to the agreed-upon goals—the alliance is strengthened.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Bordin's three components of the working alliance are:",
          options: [
            { text: "Empathy, genuineness, and unconditional positive regard", isCorrect: false },
            { text: "Bond, goals, and tasks", isCorrect: true },
            { text: "Assessment, treatment, and termination", isCorrect: false },
            { text: "Rapport, trust, and liking", isCorrect: false }
          ],
          explanation: "Bordin's tripartite model identifies bond (the emotional relationship quality), goals (agreement on therapeutic aims), and tasks (agreement on methods and activities). The first option describes Rogers' core conditions—related but distinct."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Client Perception vs. Therapist Perception</h2>
<p>One of the most clinically important findings in alliance research is that the <strong>client's</strong> perception of the alliance predicts outcomes significantly better than the <strong>therapist's</strong> perception. Bachelor (2013) demonstrated that clients and therapists often have quite different views of the alliance quality, and when they disagree, the client's view is the one that matters for predicting outcome. This has humbling implications: therapists who believe they have strong alliances with their clients may be mistaken, and without systematic measurement, they may never know.</p>
<p>Research by Norcross and Lambert (2019) also demonstrates that <strong>early alliance</strong>—measured as early as the third session—is a significant predictor of eventual treatment outcome. This means that what happens in the first few sessions has disproportionate influence on the entire course of therapy. A strong early alliance predicts better outcomes and lower dropout rates; a weak early alliance predicts premature termination and poorer outcomes. The clinical implication is clear: investing time and attention in building the alliance in the first sessions is not a preliminary step before the "real work" begins—it IS the work.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Research consistently shows that the best predictor of treatment outcome is:",
          options: [
            { text: "The therapist's perception of the alliance", isCorrect: false },
            { text: "The client's perception of the alliance", isCorrect: true },
            { text: "The length of treatment", isCorrect: false },
            { text: "The therapist's theoretical orientation", isCorrect: false }
          ],
          explanation: "The client's perception of alliance quality predicts outcomes significantly better than the therapist's perception. When client and therapist views disagree, the client's view determines outcomes—underscoring the need for routine alliance measurement."
        },
        {
          type: "accordion",
          order: 5,
          title: "Alliance Research: Key Findings",
          accordionItems: [
            {
              title: "Effect Size in Context",
              content: "The alliance-outcome correlation of r = .275 (Horvath et al., 2011) may seem modest, but context matters. In psychotherapy research, specific technique effects often produce correlations of .10-.15 or less. The alliance effect is approximately double the size of specific technique effects—making it the single most potent predictor of whether clients improve. As Wampold has argued, this suggests that HOW therapy is delivered (the relational context) may matter more than WHAT specific therapy is delivered."
            },
            {
              title: "Alliance Across Theoretical Orientations",
              content: "The alliance-outcome relationship holds across virtually every therapeutic approach studied—CBT, psychodynamic, humanistic, systemic, experiential. This trans-theoretical consistency is what makes the alliance a 'common factor': it operates regardless of the specific model being used. This does not mean that technique doesn't matter, but rather that technique works THROUGH the alliance, not independently of it."
            },
            {
              title: "Alliance and Dropout",
              content: "Weak early alliance is one of the strongest predictors of premature termination. Clients who do not feel heard, understood, or respected in the first sessions are far more likely to drop out—often without explicitly telling the therapist why. Since many dropouts never return or respond to outreach, the therapist may never know that the alliance failed. This invisible attrition represents the dark data of clinical practice."
            }
          ]
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each Bordin alliance component with its clinical example:",
          matchingPairs: [
            { term: "Bond", definition: "The client feels the therapist genuinely cares about them and understands their experience" },
            { term: "Goals", definition: "Therapist and client agree that reducing panic attacks is the primary treatment target" },
            { term: "Tasks", definition: "The client understands why exposure exercises are being assigned and finds them helpful" }
          ]
        },
        {
          type: "reflection",
          order: 7,
          question: "Think about a client who dropped out of treatment unexpectedly. Looking back, what were the early signs that the alliance might have been weaker than you realized? If you could return to those first sessions, what would you do differently?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The meta-analytic correlation between therapeutic alliance and outcome (Horvath et al., 2011) is approximately:",
          type: "multipleChoice",
          options: [
            { text: "r = .05", isCorrect: false },
            { text: "r = .275", isCorrect: true },
            { text: "r = .60", isCorrect: false },
            { text: "r = .90", isCorrect: false }
          ],
          explanation: "Horvath et al.'s meta-analysis found r = .275—approximately double the size of specific technique effects—making the alliance the single most potent predictor of treatment outcome across studies."
        },
        {
          question: "Early alliance (by session 3) predicts:",
          type: "multipleChoice",
          options: [
            { text: "Nothing about eventual outcome", isCorrect: false },
            { text: "Eventual treatment outcome and dropout risk", isCorrect: true },
            { text: "Only the client's diagnosis", isCorrect: false },
            { text: "Therapist satisfaction", isCorrect: false }
          ],
          explanation: "Research shows that alliance measured as early as session 3 significantly predicts eventual treatment outcome and dropout—making the first sessions disproportionately influential on the entire course of therapy."
        },
        {
          question: "Bordin's 'tasks' component refers to:",
          type: "multipleChoice",
          options: [
            { text: "Administrative paperwork the client must complete", isCorrect: false },
            { text: "Agreement on the methods, activities, and responsibilities of therapy", isCorrect: true },
            { text: "The therapist's clinical skills", isCorrect: false },
            { text: "The number of sessions required", isCorrect: false }
          ],
          explanation: "Tasks are the methods and activities that constitute therapy—both in-session (exposure exercises, skills practice) and between-session (homework). When clients understand and agree with these tasks, alliance is strengthened."
        },
        {
          question: "Wampold's contextual model suggests that:",
          type: "multipleChoice",
          options: [
            { text: "Specific techniques are the primary driver of change", isCorrect: false },
            { text: "Common factors including the relationship account for more outcome variance than specific techniques", isCorrect: true },
            { text: "Theoretical orientation determines outcome", isCorrect: false },
            { text: "The alliance is irrelevant to outcome", isCorrect: false }
          ],
          explanation: "Wampold's contextual model positions common factors—particularly the therapeutic relationship—as accounting for substantially more outcome variance than specific techniques, suggesting that HOW therapy is delivered matters more than WHAT therapy is delivered."
        },
        {
          question: "When therapist and client disagree about alliance quality:",
          type: "multipleChoice",
          options: [
            { text: "The therapist's perception is more accurate", isCorrect: false },
            { text: "Both perspectives are equally predictive", isCorrect: false },
            { text: "The client's perception is more predictive of outcome", isCorrect: true },
            { text: "Neither perception predicts outcome", isCorrect: false }
          ],
          explanation: "The client's perception of alliance quality consistently predicts outcomes better than the therapist's. Therapists who believe they have strong alliances may be mistaken, highlighting the need for systematic measurement."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 2 ──────────────────────────────────
    {
      title: "The First Session: Building Trust While Getting the Job Done",
      description: "Orienting clients, managing intake anxiety, collaborative goal-setting, and cultural considerations",
      module: "Module 2: First Sessions",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Before the First Word: Setting the Stage</h2>
<p>Alliance-building begins before the first therapeutic exchange. The physical environment, the greeting, the walk from the waiting room—these small moments establish the emotional tone. A warm, unhurried greeting communicates that the client is expected and valued. Offering water, explaining the physical space ("the restroom is down the hall"), and commenting briefly on the weather or parking creates a micro-transition from the outside world into the therapeutic space. These are not clinical interventions, but they are relationally significant: they communicate that the therapist is a human being, not just a clinical role.</p>
<p><strong>Orienting the client</strong> to the therapy process reduces anxiety and establishes collaboration from the start. Many clients arrive at their first session uncertain about what will happen, worried about being judged, and anxious about revealing personal information to a stranger. A brief orientation addresses these concerns directly: "Let me give you a sense of how today will go. I'll need to ask some questions to understand your situation—some of those questions might feel personal, and you should only share what you're comfortable with. I'll also want to hear what brought you here and what you're hoping to get from therapy. We'll have about 50 minutes, and at the end I'll share some initial thoughts. Does that sound okay?"</p>
<p>This simple orientation accomplishes several alliance-building functions simultaneously. It provides structure (reducing uncertainty anxiety), grants permission (you don't have to share everything), establishes collaboration (I'll want to hear YOUR perspective), normalizes the process (this is how it works), and invites feedback ("does that sound okay?"). The final question—which should be genuinely asked, not rhetorical—immediately positions the client as an active participant rather than a passive recipient.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Orienting a client at the start of the first session serves which alliance-building function?",
          options: [
            { text: "It demonstrates the therapist's authority", isCorrect: false },
            { text: "It reduces uncertainty, grants permission, and establishes collaboration", isCorrect: true },
            { text: "It is primarily a legal requirement", isCorrect: false },
            { text: "It saves time by skipping rapport-building", isCorrect: false }
          ],
          explanation: "Orientation reduces anxiety (by providing structure), grants permission (client controls disclosure), establishes collaboration (inviting the client's perspective), and normalizes the process—all building alliance from the very first minutes."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Balancing Assessment with Connection</h2>
<p>The first session presents a fundamental tension: the clinician needs to gather clinical information (presenting problem, history, risk assessment, diagnostic impressions) while simultaneously building the emotional connection that will sustain the work. Many clinicians err in one direction or the other—either conducting a thorough but relationally cold intake interview, or building wonderful rapport while gathering insufficient clinical information.</p>
<p>The key is <strong>weaving assessment and connection together</strong> rather than treating them as separate tasks. When asking about difficult history, acknowledge the emotional weight: "I'm going to ask about some things that might be hard to talk about. Take your time, and know that whatever you share, I'm not here to judge." When a client becomes emotional during history-taking, pause the assessment and attend to the emotion: "I can see this is bringing up a lot. Let's slow down for a moment." These micro-transitions between information-gathering and emotional attending signal that the therapist sees the person, not just the clinical data.</p>
<p><strong>Collaborative goal-setting</strong> is one of the most powerful alliance-building interventions available in the first session. Rather than the therapist determining treatment goals based on their assessment, invite the client's perspective: "If this therapy is going to be helpful to you, what would be different in your life? What would you notice?" This question accomplishes two things: it communicates that the client's values and priorities matter, and it provides clinical information about the client's motivation, insight, and expectations. When the client's goals and the therapist's clinical assessment diverge, this becomes an opportunity for transparent negotiation rather than unilateral decision-making.</p>`
        },
        {
          type: "accordion",
          order: 4,
          title: "First Session Strategies",
          accordionItems: [
            {
              title: "Informed Consent as Alliance-Building",
              content: "Many clinicians treat informed consent as a bureaucratic obligation—a form to sign before the real work begins. But informed consent, handled well, is an alliance-building opportunity. Explaining confidentiality and its limits communicates transparency and trustworthiness. Discussing the therapist's approach communicates competence and intentionality. Reviewing client rights communicates respect for autonomy. The key is to deliver this information conversationally rather than legalistically, and to genuinely invite questions: 'What questions do you have about how this works?'"
            },
            {
              title: "Managing Your Own First-Session Anxiety",
              content: "Therapists experience first-session anxiety too, particularly with new client populations, high-acuity cases, or when they feel pressure to impress. This anxiety can manifest as over-talking, rushing through the intake, asking too many questions too quickly, or performing the role of 'expert' rather than being genuinely present. Acknowledging your own nervousness (internally, not necessarily to the client) and intentionally slowing your pace can help. Remember: the client does not need you to be perfect. They need you to be present, warm, and genuine."
            },
            {
              title: "Cultural Considerations in First Sessions",
              content: "Cultural background shapes every aspect of the first session—the client's comfort with self-disclosure, their expectations about the therapist's role, their understanding of mental health and help-seeking, and what constitutes respect and connection. A client from a culture that values hierarchy may expect the therapist to take a directive role and may interpret collaborative goal-setting as incompetence. A client from a culture that stigmatizes mental health treatment may need more time to build trust before sharing personal information. The culturally responsive clinician adapts their approach to the client's cultural context rather than applying a one-size-fits-all model."
            },
            {
              title: "When the Client Doesn't Want to Be There",
              content: "Mandated, court-ordered, or partner-pressured clients present unique first-session challenges. The most important thing a clinician can do is acknowledge the reality directly: 'I understand you're here because [the court/your partner/your employer] said you needed to be. I respect that this may not be something you chose. Here's what I want you to know: I'm not here to judge you or force you to change. I'm here to have a conversation and see if there's anything useful we can do together.' This kind of transparency—naming the elephant in the room—often reduces defensiveness more effectively than pretending the mandate doesn't exist."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "When a client becomes emotional during intake history-taking, the clinician should:",
          options: [
            { text: "Continue with the assessment to stay on schedule", isCorrect: false },
            { text: "Pause the assessment and attend to the emotion before continuing", isCorrect: true },
            { text: "Redirect the client to avoid the emotional topic", isCorrect: false },
            { text: "End the session and reschedule", isCorrect: false }
          ],
          explanation: "Pausing to attend to emotion during assessment signals that the therapist sees the person, not just the data. These micro-transitions between information-gathering and emotional attending weave assessment and connection together."
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each first-session strategy with its alliance-building function:",
          matchingPairs: [
            { term: "Session orientation", definition: "Reduces uncertainty anxiety and establishes the client as an active participant" },
            { term: "Collaborative goal-setting", definition: "Communicates that the client's values and priorities drive the treatment direction" },
            { term: "Informed consent conversation", definition: "Demonstrates transparency, competence, and respect for client autonomy" },
            { term: "Acknowledging the mandate", definition: "Reduces defensiveness in court-ordered or involuntary clients by naming reality" }
          ]
        },
        {
          type: "reflection",
          order: 7,
          question: "How do you currently handle the tension between gathering intake information and building rapport? Do you lean more toward thorough assessment or emotional connection? What specific change could you make to better integrate both in your next first session?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The most effective approach to intake assessment and rapport-building is:",
          type: "multipleChoice",
          options: [
            { text: "Complete all assessment first, then build rapport", isCorrect: false },
            { text: "Weave assessment and emotional connection together throughout the session", isCorrect: true },
            { text: "Skip assessment entirely to prioritize rapport", isCorrect: false },
            { text: "Use a standardized questionnaire and avoid conversation", isCorrect: false }
          ],
          explanation: "The most effective approach integrates assessment and connection—acknowledging emotional weight when asking difficult questions and pausing to attend to emotion when it arises, rather than treating assessment and rapport as separate tasks."
        },
        {
          question: "Collaborative goal-setting strengthens the alliance by:",
          type: "multipleChoice",
          options: [
            { text: "Allowing the therapist to avoid responsibility for treatment direction", isCorrect: false },
            { text: "Communicating that the client's values and priorities matter and drive treatment", isCorrect: true },
            { text: "Reducing the number of sessions needed", isCorrect: false },
            { text: "Eliminating the need for clinical assessment", isCorrect: false }
          ],
          explanation: "Collaborative goal-setting aligns with Bordin's 'goals' component—it communicates that therapy will be guided by the client's priorities, not just the therapist's clinical agenda, strengthening the sense of partnership."
        },
        {
          question: "With a mandated client, the most effective first-session approach is to:",
          type: "multipleChoice",
          options: [
            { text: "Pretend the mandate doesn't exist", isCorrect: false },
            { text: "Acknowledge the mandate directly and express respect for the client's position", isCorrect: true },
            { text: "Immediately confront the client about their behavior", isCorrect: false },
            { text: "Focus exclusively on compliance requirements", isCorrect: false }
          ],
          explanation: "Directly acknowledging the mandate—naming the elephant in the room—reduces defensiveness more effectively than ignoring it. Expressing respect for the client's position opens space for genuine collaboration despite the involuntary context."
        },
        {
          question: "Informed consent serves as an alliance-building opportunity when:",
          type: "multipleChoice",
          options: [
            { text: "It is delivered quickly as a formality", isCorrect: false },
            { text: "It is presented conversationally with genuine invitation for questions", isCorrect: true },
            { text: "The client is asked to sign without discussion", isCorrect: false },
            { text: "It focuses exclusively on legal protections for the therapist", isCorrect: false }
          ],
          explanation: "When delivered conversationally rather than legalistically, informed consent communicates transparency, competence, and respect for autonomy—all alliance-building qualities. The key is genuinely inviting questions and discussion."
        },
        {
          question: "A client from a culture that values hierarchy may interpret collaborative goal-setting as:",
          type: "multipleChoice",
          options: [
            { text: "Respectful and empowering", isCorrect: false },
            { text: "A sign of therapist incompetence or uncertainty", isCorrect: true },
            { text: "Standard therapeutic practice", isCorrect: false },
            { text: "A refreshing change from authority figures", isCorrect: false }
          ],
          explanation: "Clients from cultures valuing hierarchy may expect the therapist to take a directive, expert role. Collaborative approaches that work well in individualistic contexts may need adaptation for clients who interpret them as indecisiveness or lack of expertise."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 3 ──────────────────────────────────
    {
      title: "When Rapport Falters: Ruptures, Repairs, and Routine Monitoring",
      description: "The Safran-Muran rupture-repair model, meta-communication, and using outcome measures",
      module: "Module 3: Rupture and Repair",
      order: 3,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Alliance Ruptures Are Inevitable</h2>
<p>Even the most skilled, well-intentioned therapist will experience alliance ruptures—moments when the therapeutic relationship is strained or damaged. Safran and Muran (2000) define a rupture as any deterioration in the quality of the therapeutic alliance, ranging from minor tensions to major breakdowns. Ruptures are not signs of therapist failure; they are inherent to the process of two humans navigating a complex, emotionally charged relationship. What distinguishes effective therapists from less effective ones is not the absence of ruptures, but the capacity to recognize and repair them.</p>
<p>Safran and Muran identify two primary types of ruptures: <strong>Withdrawal ruptures</strong> occur when the client moves away from the therapist or the therapeutic process. Signs include: becoming compliant or superficial, changing the subject when things get deep, missing or arriving late to sessions, giving brief answers, emotional withdrawal, and "going through the motions" without real engagement. Withdrawal ruptures are easily missed because the client appears cooperative on the surface.</p>
<p><strong>Confrontation ruptures</strong> occur when the client moves against the therapist. Signs include: expressing anger or frustration directly, challenging the therapist's competence, rejecting interventions, complaining about the therapy, making hostile comments, or controlling the session. Confrontation ruptures are more visible but can trigger therapist defensiveness, which typically escalates rather than resolves the rupture.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "A client who becomes increasingly compliant and superficial in sessions, giving brief answers and avoiding deeper topics, is most likely exhibiting:",
          options: [
            { text: "Therapeutic progress and symptom improvement", isCorrect: false },
            { text: "A withdrawal rupture—moving away from the therapist", isCorrect: true },
            { text: "A confrontation rupture—moving against the therapist", isCorrect: false },
            { text: "Normal resistance that should be ignored", isCorrect: false }
          ],
          explanation: "Withdrawal ruptures involve the client moving away from the therapist—becoming compliant, superficial, or emotionally disengaged. They are easily missed because the client appears cooperative on the surface."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>The Rupture-Repair Process</h2>
<p>The repair process begins with <strong>recognition</strong>—noticing that something has shifted in the alliance. This is harder than it sounds, particularly for withdrawal ruptures where the client's surface behavior remains cooperative. Clinicians can improve recognition by attending to their own internal experience: a vague sense that something is off, feeling bored or disconnected, noticing that the session feels rote or surface-level. These therapist experiences are often signals that a rupture has occurred.</p>
<p><strong>Meta-communication</strong>—talking about what is happening in the relationship right now—is the primary tool for rupture repair. Rather than ignoring the tension or trying to push through it, the therapist directly names their observation: "I notice something shifted between us just now. I'm not sure what happened, but I want to check in. How are you feeling about what we're doing?" or "I have a sense that what I said a moment ago didn't land well. Can we talk about that?"</p>
<p>Meta-communication requires courage because it involves the therapist acknowledging that something may have gone wrong—including the possibility that they contributed to the rupture. Many therapists avoid meta-communication because it feels risky: What if the client confirms that they're unhappy? What if the therapist has to acknowledge a mistake? But research consistently shows that ruptures that are successfully repaired actually <strong>strengthen</strong> the alliance beyond its pre-rupture level. The experience of having a relationship survive a conflict—having one's dissatisfaction heard and responded to—is itself therapeutic, particularly for clients whose relational histories are characterized by relationships that couldn't survive disagreement.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Research on successfully repaired alliance ruptures shows that:",
          options: [
            { text: "The alliance returns to but never exceeds its pre-rupture level", isCorrect: false },
            { text: "Repaired ruptures actually strengthen the alliance beyond its pre-rupture level", isCorrect: true },
            { text: "Repair is impossible once a rupture has occurred", isCorrect: false },
            { text: "Only confrontation ruptures can be repaired", isCorrect: false }
          ],
          explanation: "Successfully repaired ruptures strengthen the alliance beyond its original level. The experience of having a relationship survive conflict is itself therapeutic—particularly for clients whose relational histories involve relationships that couldn't survive disagreement."
        },
        {
          type: "accordion",
          order: 5,
          title: "Routine Outcome Monitoring: Catching What You'd Otherwise Miss",
          accordionItems: [
            {
              title: "The Session Rating Scale (SRS)",
              content: "The Session Rating Scale (Duncan et al., 2003) is a brief 4-item visual analog scale that clients complete at the end of each session. It measures the client's perception of the therapeutic relationship, goals and topics, approach or method, and overall experience. It takes less than a minute to complete and provides real-time feedback that therapists would otherwise lack. Research shows that therapists who use routine alliance measures have significantly better outcomes and lower dropout rates than those who rely on their own assessment alone."
            },
            {
              title: "The Outcome Rating Scale (ORS)",
              content: "The ORS (Miller & Duncan, 2000) measures client wellbeing across four domains: individual, interpersonal, social, and overall. Administered at the beginning of each session, it tracks whether the client is actually improving—not just whether they seem to be improving from the therapist's perspective. When ORS scores are stagnant or declining, this signals that something needs to change in the treatment approach."
            },
            {
              title: "Using Feedback to Prevent Dropout",
              content: "Research by Lambert and colleagues demonstrates that providing therapists with real-time feedback about client progress—particularly 'not on track' signals—significantly improves outcomes and reduces deterioration. When a client's ORS score drops, the therapist can address it directly: 'Your score suggests things haven't been going as well this week. Can we talk about what's happening?' This kind of transparent, data-informed check-in often surfaces alliance issues that the client would not have raised spontaneously."
            }
          ]
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each concept with its description:",
          matchingPairs: [
            { term: "Withdrawal rupture", definition: "Client moves away—becoming compliant, superficial, or disengaged" },
            { term: "Confrontation rupture", definition: "Client moves against—expressing anger, challenging competence, or rejecting interventions" },
            { term: "Meta-communication", definition: "Talking directly about what is happening in the therapeutic relationship right now" },
            { term: "Session Rating Scale", definition: "Brief end-of-session measure of client's perception of alliance quality" },
            { term: "Outcome Rating Scale", definition: "Brief start-of-session measure of client wellbeing across four domains" }
          ]
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "Therapists who use routine alliance measures compared to those who rely on their own assessment:",
          options: [
            { text: "Show no difference in outcomes", isCorrect: false },
            { text: "Have significantly better outcomes and lower dropout rates", isCorrect: true },
            { text: "Have higher client complaints", isCorrect: false },
            { text: "Take longer to complete treatment", isCorrect: false }
          ],
          explanation: "Research consistently demonstrates that systematic alliance measurement leads to better outcomes and lower dropout. Therapists' self-assessment of alliance quality is unreliable—routine measures catch issues that would otherwise be invisible."
        },
        {
          type: "reflection",
          order: 8,
          question: "Do you currently use any routine outcome measures in your practice? If not, what barriers have prevented you from implementing them? If yes, how has client feedback surprised you or changed your approach? Consider committing to implementing the SRS and ORS for one month with all clients."
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The two types of alliance ruptures identified by Safran and Muran are:",
          type: "multipleChoice",
          options: [
            { text: "Minor and major", isCorrect: false },
            { text: "Withdrawal and confrontation", isCorrect: true },
            { text: "Active and passive", isCorrect: false },
            { text: "Conscious and unconscious", isCorrect: false }
          ],
          explanation: "Safran and Muran identify withdrawal ruptures (client moves away—compliance, superficiality, disengagement) and confrontation ruptures (client moves against—anger, challenges, rejection of interventions)."
        },
        {
          question: "Meta-communication in the context of rupture repair involves:",
          type: "multipleChoice",
          options: [
            { text: "Communicating with the client's family about the rupture", isCorrect: false },
            { text: "Talking directly about what is happening in the therapeutic relationship right now", isCorrect: true },
            { text: "Using non-verbal communication only", isCorrect: false },
            { text: "Referring the client to another therapist", isCorrect: false }
          ],
          explanation: "Meta-communication means directly naming observations about the relationship in the here and now: 'I notice something shifted between us. How are you feeling about what we're doing?' It requires courage but is the primary tool for rupture repair."
        },
        {
          question: "Withdrawal ruptures are particularly dangerous because:",
          type: "multipleChoice",
          options: [
            { text: "They always lead to physical confrontation", isCorrect: false },
            { text: "They are easily missed since the client appears cooperative on the surface", isCorrect: true },
            { text: "They cannot be repaired", isCorrect: false },
            { text: "They only occur in long-term therapy", isCorrect: false }
          ],
          explanation: "Withdrawal ruptures are insidious because the client's surface compliance masks underlying disengagement. The therapist may not realize the alliance has deteriorated until the client drops out without explanation."
        },
        {
          question: "The Session Rating Scale (SRS) is administered:",
          type: "multipleChoice",
          options: [
            { text: "At intake only", isCorrect: false },
            { text: "At the end of each session to measure the client's perception of the alliance", isCorrect: true },
            { text: "Monthly to track long-term progress", isCorrect: false },
            { text: "Only when the therapist suspects a rupture", isCorrect: false }
          ],
          explanation: "The SRS is a brief 4-item measure administered at the end of every session, providing real-time feedback on alliance quality that therapists would otherwise lack—catching issues before they lead to dropout."
        },
        {
          question: "Therapist defensiveness in response to a confrontation rupture typically:",
          type: "multipleChoice",
          options: [
            { text: "Resolves the rupture quickly", isCorrect: false },
            { text: "Escalates rather than resolves the rupture", isCorrect: true },
            { text: "Has no effect on the alliance", isCorrect: false },
            { text: "Demonstrates professional boundaries", isCorrect: false }
          ],
          explanation: "When therapists respond defensively to confrontation ruptures—justifying their approach, minimizing the client's concern, or becoming argumentative—the rupture typically escalates. The repair path requires openness and willingness to explore the therapist's contribution."
        }
      ],
      quizPassThreshold: 0.8
    }
  ],

  assessment: {
    title: "Final Assessment",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "The meta-analytic alliance-outcome correlation is approximately:", type: "multipleChoice",
        options: [
          { text: "r = .05", isCorrect: false },
          { text: "r = .275", isCorrect: true },
          { text: "r = .50", isCorrect: false },
          { text: "r = .80", isCorrect: false }
        ],
        explanation: "Horvath et al.'s (2011) meta-analysis across 200+ studies found r = .275—making the alliance one of the most robust and consistent predictors of treatment outcome."
      },
      {
        question: "Bordin's working alliance model consists of:", type: "multipleChoice",
        options: [
          { text: "Bond, goals, and tasks", isCorrect: true },
          { text: "Empathy, warmth, and genuineness", isCorrect: false },
          { text: "Assessment, intervention, and termination", isCorrect: false },
          { text: "Trust, respect, and collaboration", isCorrect: false }
        ],
        explanation: "Bordin's tripartite model identifies bond (emotional connection), goals (agreement on aims), and tasks (agreement on methods). This framework applies across all therapeutic orientations."
      },
      {
        question: "Client perception of the alliance predicts outcomes:", type: "multipleChoice",
        options: [
          { text: "Less well than therapist perception", isCorrect: false },
          { text: "Better than therapist perception", isCorrect: true },
          { text: "Identically to therapist perception", isCorrect: false },
          { text: "Only for specific theoretical orientations", isCorrect: false }
        ],
        explanation: "Research consistently shows the client's perception of alliance quality is more predictive of outcome than the therapist's. This underscores the need for routine measurement rather than relying on therapist self-assessment."
      },
      {
        question: "Early alliance (by session 3) predicts:", type: "multipleChoice",
        options: [
          { text: "Nothing about long-term outcome", isCorrect: false },
          { text: "Eventual treatment outcome and dropout risk", isCorrect: true },
          { text: "Only the pace of therapy", isCorrect: false },
          { text: "Diagnostic accuracy", isCorrect: false }
        ],
        explanation: "Alliance measured as early as session 3 significantly predicts eventual outcome—making the first few sessions disproportionately influential on the entire course of treatment."
      },
      {
        question: "Orienting a client at the start of therapy serves to:", type: "multipleChoice",
        options: [
          { text: "Waste valuable session time", isCorrect: false },
          { text: "Reduce anxiety, establish collaboration, and position the client as active participant", isCorrect: true },
          { text: "Assert the therapist's authority", isCorrect: false },
          { text: "Replace the need for informed consent", isCorrect: false }
        ],
        explanation: "A brief session orientation reduces uncertainty anxiety, grants permission around disclosure, establishes a collaborative framework, normalizes the process, and invites the client to be an active participant—all building alliance from the first minutes."
      },
      {
        question: "The best approach to the intake tension between assessment and rapport is to:", type: "multipleChoice",
        options: [
          { text: "Prioritize assessment over connection", isCorrect: false },
          { text: "Weave assessment and emotional connection together throughout the session", isCorrect: true },
          { text: "Skip clinical assessment to build rapport", isCorrect: false },
          { text: "Complete assessment via questionnaire before the session", isCorrect: false }
        ],
        explanation: "Rather than treating assessment and connection as competing tasks, effective clinicians integrate them—acknowledging emotional weight when asking hard questions and pausing to attend to emotion when it arises."
      },
      {
        question: "A withdrawal rupture is characterized by:", type: "multipleChoice",
        options: [
          { text: "The client expressing anger at the therapist", isCorrect: false },
          { text: "The client becoming compliant, superficial, or disengaged", isCorrect: true },
          { text: "The client demanding a different approach", isCorrect: false },
          { text: "The client not showing up for sessions", isCorrect: false }
        ],
        explanation: "Withdrawal ruptures involve the client moving away from the therapist and process—becoming surface-level compliant, emotionally disengaged, or going through the motions. They are easily missed because cooperation masks disconnection."
      },
      {
        question: "Meta-communication is best described as:", type: "multipleChoice",
        options: [
          { text: "Non-verbal communication skills", isCorrect: false },
          { text: "Directly discussing what is happening in the therapeutic relationship in the moment", isCorrect: true },
          { text: "Communication about communication theory", isCorrect: false },
          { text: "Emailing the client between sessions", isCorrect: false }
        ],
        explanation: "Meta-communication involves directly naming observations about the here-and-now relationship: 'Something shifted between us just now. How are you feeling about what we're doing?' It is the primary tool for rupture repair."
      },
      {
        question: "Successfully repaired ruptures typically result in:", type: "multipleChoice",
        options: [
          { text: "A weakened alliance that never fully recovers", isCorrect: false },
          { text: "An alliance stronger than before the rupture", isCorrect: true },
          { text: "No change in alliance quality", isCorrect: false },
          { text: "Termination of treatment", isCorrect: false }
        ],
        explanation: "Research shows that repaired ruptures strengthen the alliance beyond pre-rupture levels. The experience of having a relationship survive conflict is itself therapeutic, especially for clients whose relationships have historically not survived disagreement."
      },
      {
        question: "Therapists who use routine outcome measures compared to those who don't:", type: "multipleChoice",
        options: [
          { text: "Show no difference in outcomes", isCorrect: false },
          { text: "Have significantly better outcomes and lower dropout", isCorrect: true },
          { text: "Have worse outcomes due to client burden", isCorrect: false },
          { text: "Take more sessions to complete treatment", isCorrect: false }
        ],
        explanation: "Routine outcome monitoring significantly improves outcomes and reduces dropout by providing therapists with feedback about alliance quality and client progress that they cannot reliably assess on their own."
      },
      {
        question: "When a mandated client arrives for a first session, the most effective approach is:", type: "multipleChoice",
        options: [
          { text: "Avoid mentioning the mandate to reduce tension", isCorrect: false },
          { text: "Acknowledge the mandate directly and express respect for the client's position", isCorrect: true },
          { text: "Immediately establish consequences for non-compliance", isCorrect: false },
          { text: "Treat them identically to voluntary clients", isCorrect: false }
        ],
        explanation: "Directly naming the mandate reduces defensiveness and creates space for collaboration. Pretending it doesn't exist or focusing on compliance undermines trust and makes alliance-building far more difficult."
      },
      {
        question: "The alliance-outcome relationship holds:", type: "multipleChoice",
        options: [
          { text: "Only in psychodynamic therapy", isCorrect: false },
          { text: "Across virtually all therapeutic orientations studied", isCorrect: true },
          { text: "Only in long-term therapy", isCorrect: false },
          { text: "Only with voluntary clients", isCorrect: false }
        ],
        explanation: "The alliance-outcome relationship is remarkably consistent across CBT, psychodynamic, humanistic, systemic, and other approaches—making it a trans-theoretical 'common factor' that operates regardless of the specific model being used."
      },
      {
        question: "The Session Rating Scale (SRS) measures:", type: "multipleChoice",
        options: [
          { text: "Client diagnosis", isCorrect: false },
          { text: "The client's perception of the therapeutic relationship quality at the end of each session", isCorrect: true },
          { text: "Therapist competence", isCorrect: false },
          { text: "Treatment duration", isCorrect: false }
        ],
        explanation: "The SRS is a brief 4-item visual analog scale measuring the client's real-time perception of the relationship, goals/topics, approach, and overall session experience—providing feedback therapists cannot reliably self-assess."
      },
      {
        question: "Therapist defensiveness in response to confrontation ruptures typically:", type: "multipleChoice",
        options: [
          { text: "Resolves the conflict effectively", isCorrect: false },
          { text: "Escalates the rupture rather than repairing it", isCorrect: true },
          { text: "Has no effect on the alliance", isCorrect: false },
          { text: "Demonstrates appropriate clinical boundaries", isCorrect: false }
        ],
        explanation: "Defensiveness—justifying, minimizing, arguing—escalates confrontation ruptures. Effective repair requires openness, willingness to explore one's contribution, and genuine invitation for the client's perspective."
      },
      {
        question: "Wampold's contextual model of psychotherapy suggests:", type: "multipleChoice",
        options: [
          { text: "Specific techniques are the primary driver of change", isCorrect: false },
          { text: "HOW therapy is delivered (relational context) matters more than WHAT specific therapy is delivered", isCorrect: true },
          { text: "Only one therapeutic approach is effective", isCorrect: false },
          { text: "The alliance is irrelevant to outcomes", isCorrect: false }
        ],
        explanation: "Wampold's analysis shows common factors—particularly the relationship—account for substantially more outcome variance than specific techniques, positioning the alliance as the foundation for all therapeutic work."
      }
    ]
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('interactivecourses').updateOne(
      { slug: SLUG },
      { $set: { ...COURSE, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(result.upsertedCount ? '✅ Created' : '♻️ Updated', SLUG);
    await mongoose.disconnect();
  } catch (err) { console.error('❌', err); process.exit(1); }
}

seed();
