/**
 * CounselorReady Movie Course Seed Script (ES Module)
 * 
 * USAGE:
 *   1. Copy to your server/src/scripts/ folder
 *   2. Run: node seedMovieCourses.js
 * 
 * Requires MONGODB_URI in .env
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment');
  process.exit(1);
}

// Minimal Course schema (matches your existing model)
const courseSchema = new mongoose.Schema({
  title: String,
  code: { type: String, unique: true },
  description: String,
  ceHours: Number,
  category: String,
  price: Number,
  status: String,
  level: String,
  targetAudience: String,
  learningObjectives: [String],
  modules: [{ title: String, order: Number, contentBlocks: [mongoose.Schema.Types.Mixed] }],
  assessment: { passingScore: Number, questions: [mongoose.Schema.Types.Mixed] }
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

const courses = [
  {
    title: "A Beautiful Mind: Understanding and Treating Serious Mental Illness",
    code: "CR-ABM-001",
    ceHours: 1,
    category: "Core",
    price: 0,
    status: "draft",
    level: "Intermediate",
    targetAudience: "LPCs, LCSWs, LMFTs, Psychologists",
    description: "Examines serious mental illness through the film A Beautiful Mind, covering psychotic disorders, evidence-based treatments, and recovery-oriented care.",
    learningObjectives: [
      "Differentiate between psychotic disorders including schizophrenia spectrum disorders",
      "Identify positive, negative, and cognitive symptoms of schizophrenia",
      "Describe evidence-based interventions including CBTp and family psychoeducation",
      "Apply recovery-oriented principles to therapeutic alliance building",
      "Evaluate ethical considerations including capacity and risk assessment"
    ],
    modules: [
      { title: "Understanding Psychosis and Schizophrenia", order: 1, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "Understanding Psychosis", subtitle: "Hallucinations, delusions, and diagnostic criteria" },
        { type: "reflection", question: "What has been your clinical experience with clients experiencing psychotic symptoms?" },
        { type: "text", content: "<p>Psychosis refers to symptoms including hallucinations, delusions, and disorganized thinking. Auditory hallucinations occur in 60-80% of schizophrenia cases. Visual hallucinations suggest medical etiology.</p><p>DSM-5-TR requires two or more symptoms for 6+ months, with at least one being delusions, hallucinations, or disorganized speech. 20-25% achieve good outcomes.</p>" },
        { type: "multipleChoice", question: "Which hallucination type suggests medical etiology?", options: [{ text: "Auditory", isCorrect: false }, { text: "Command", isCorrect: false }, { text: "Visual", isCorrect: true }, { text: "Nocturnal", isCorrect: false }], explanation: "Visual hallucinations are more characteristic of delirium and medical conditions." },
        { type: "accordion", accordionItems: [{ title: "Positive Symptoms", content: "Hallucinations, delusions, thought disorder. Respond to antipsychotics." }, { title: "Negative Symptoms", content: "Flat affect, alogia, avolition, anhedonia. Poor medication response." }, { title: "Cognitive Symptoms", content: "Attention, memory, executive function deficits. Strongest outcome predictors." }] },
        { type: "multipleChoice", question: "Negative symptoms include all EXCEPT:", options: [{ text: "Flat affect", isCorrect: false }, { text: "Avolition", isCorrect: false }, { text: "Persecutory delusions", isCorrect: true }, { text: "Alogia", isCorrect: false }], explanation: "Delusions are positive symptoms." }
      ]},
      { title: "Evidence-Based Treatment", order: 2, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Evidence-Based Treatment", subtitle: "CBTp, family psychoeducation, IPS" },
        { type: "text", content: "<p>Antipsychotics achieve 60-70% response for positive symptoms. CBTp uses collaborative empiricism to explore experiences. Family psychoeducation reduces relapse by 50%. IPS achieves 50-60% employment rates.</p>" },
        { type: "multipleChoice", question: "CBTp is characterized by:", options: [{ text: "Challenging delusions directly", isCorrect: false }, { text: "Collaborative empiricism", isCorrect: true }, { text: "Medication focus", isCorrect: false }, { text: "Exposure therapy", isCorrect: false }], explanation: "CBTp uses collaborative empiricism, not direct challenging." },
        { type: "multipleChoice", question: "Family psychoeducation reduces relapse by:", options: [{ text: "10%", isCorrect: false }, { text: "25%", isCorrect: false }, { text: "50%", isCorrect: true }, { text: "75%", isCorrect: false }], explanation: "Meta-analyses show 50% reduction." }
      ]},
      { title: "Therapeutic Alliance", order: 3, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 3, title: "Therapeutic Alliance", subtitle: "Building connection with psychosis clients" },
        { type: "accordion", accordionItems: [{ title: "Validation", content: "Acknowledge experiences as real and distressing." }, { title: "Collaboration", content: "Counter disempowerment in treatment systems." }, { title: "Practical Help", content: "Assist with housing, benefits, side effects." }, { title: "Recovery Language", content: "Emphasize hope and meaningful life." }] },
        { type: "reflection", question: "How do you communicate hope to clients with SMI?" }
      ]},
      { title: "Ethical Considerations", order: 4, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 4, title: "Ethics", subtitle: "Capacity, violence risk, trauma" },
        { type: "text", content: "<p>Capacity is decision-specific and fluctuates. Most with schizophrenia are NOT violent—14x more likely to be victims. 70-90% have trauma history.</p>" },
        { type: "multipleChoice", question: "Violence risk in schizophrenia:", options: [{ text: "Most are violent", isCorrect: false }, { text: "More likely victims than perpetrators", isCorrect: true }, { text: "Unrelated to substances", isCorrect: false }, { text: "Command hallucinations always cause violence", isCorrect: false }], explanation: "14x more likely to be victims." },
        { type: "multipleChoice", question: "Capacity is:", options: [{ text: "Permanently impaired", isCorrect: false }, { text: "Decision-specific and fluctuating", isCorrect: true }, { text: "Only assessed after remission", isCorrect: false }, { text: "Irrelevant", isCorrect: false }], explanation: "Capacity is decision-specific." }
      ]}
    ],
    assessment: { passingScore: 80, questions: [
      { question: "DSM-5-TR schizophrenia requires:", options: [{ text: "3-month symptoms", isCorrect: false }, { text: "At least one core symptom (delusions/hallucinations/disorganized speech)", isCorrect: true }, { text: "Visual hallucinations", isCorrect: false }, { text: "No mood symptoms", isCorrect: false }], explanation: "At least one core symptom required." },
      { question: "Good outcome rate:", options: [{ text: "5-10%", isCorrect: false }, { text: "20-25%", isCorrect: true }, { text: "50-60%", isCorrect: false }, { text: "75%", isCorrect: false }], explanation: "20-25% achieve good outcomes." },
      { question: "High EE includes:", options: [{ text: "Open communication", isCorrect: false }, { text: "Criticism/hostility/overinvolvement", isCorrect: true }, { text: "Support", isCorrect: false }, { text: "Clear boundaries", isCorrect: false }], explanation: "High EE = criticism, hostility, overinvolvement." },
      { question: "IPS employment rate:", options: [{ text: "10-15%", isCorrect: false }, { text: "20-25%", isCorrect: false }, { text: "50-60%", isCorrect: true }, { text: "80%", isCorrect: false }], explanation: "IPS achieves 50-60%." }
    ]}
  },
  {
    title: "Black Swan: Perfectionism and Anxiety Disorders",
    code: "CR-BSW-001",
    ceHours: 1,
    category: "Core",
    price: 0,
    status: "draft",
    level: "Intermediate",
    targetAudience: "LPCs, LCSWs, LMFTs, Psychologists",
    description: "Examines perfectionism as multidimensional transdiagnostic factor with assessment and treatment approaches.",
    learningObjectives: [
      "Define perfectionism using Hewitt-Flett and Frost frameworks",
      "Identify perfectionism manifestations across disorders",
      "Apply assessment strategies including standardized measures",
      "Implement CBT and self-compassion interventions",
      "Analyze perfectionism co-occurrence decisions"
    ],
    modules: [
      { title: "Understanding Perfectionism", order: 1, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "Understanding Perfectionism", subtitle: "Dimensions and development" },
        { type: "reflection", question: "Where do you notice perfectionist tendencies in your own life?" },
        { type: "text", content: "<p>Hewitt-Flett: Self-oriented (self-demands), Other-oriented (demands on others), Socially prescribed (believing others expect perfection). Frost: Concern over mistakes, Doubts, Personal standards, Parental expectations/criticism, Organization.</p>" },
        { type: "multipleChoice", question: "Socially prescribed perfectionism involves:", options: [{ text: "Self-standards", isCorrect: false }, { text: "Demanding from others", isCorrect: false }, { text: "Believing others expect perfection", isCorrect: true }, { text: "Organization", isCorrect: false }], explanation: "Perceiving others demand perfection." },
        { type: "accordion", accordionItems: [{ title: "Adaptive vs Maladaptive", content: "Adaptive: flexible high standards. Maladaptive: rigid, harsh self-criticism, worth tied to achievement." }, { title: "Development", content: "Temperament, critical parenting, conditional acceptance." }] },
        { type: "multipleChoice", question: "Adaptive vs maladaptive distinction:", options: [{ text: "Standard height", isCorrect: false }, { text: "Work vs personal", isCorrect: false }, { text: "Emotional/cognitive patterns", isCorrect: true }, { text: "Parental origin", isCorrect: false }], explanation: "Patterns, not standard height." }
      ]},
      { title: "Perfectionism and Psychopathology", order: 2, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Transdiagnostic Role", subtitle: "Across anxiety, depression, eating disorders" },
        { type: "text", content: "<p>Perfectionism is transdiagnostic—increases risk for multiple disorders. Socially prescribed perfectionism strongly linked to suicide risk.</p>" },
        { type: "multipleChoice", question: "Transdiagnostic means:", options: [{ text: "Only anxiety", isCorrect: false }, { text: "Increases risk for multiple disorders", isCorrect: true }, { text: "DSM diagnosis", isCorrect: false }, { text: "Untreatable", isCorrect: false }], explanation: "Affects multiple disorders." },
        { type: "multipleChoice", question: "Strongest suicide association:", options: [{ text: "Self-oriented", isCorrect: false }, { text: "Other-oriented", isCorrect: false }, { text: "Socially prescribed", isCorrect: true }, { text: "Organization", isCorrect: false }], explanation: "Socially prescribed strongest." }
      ]},
      { title: "Assessment", order: 3, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 3, title: "Assessment", subtitle: "Measures and interviews" },
        { type: "accordion", accordionItems: [{ title: "FMPS", content: "35-item Frost measure." }, { title: "HMPS", content: "45-item Hewitt-Flett measure." }, { title: "CPQ", content: "12-item clinical perfectionism." }, { title: "APS-R", content: "Adaptive/maladaptive distinction." }] },
        { type: "multipleChoice", question: "CPQ is useful because:", options: [{ text: "100 items", isCorrect: false }, { text: "12-item maladaptive focus", isCorrect: true }, { text: "Adaptive only", isCorrect: false }, { text: "Psychiatrist required", isCorrect: false }], explanation: "Brief 12-item clinical measure." },
        { type: "reflection", question: "What questions would assess perfectionism in work burnout?" }
      ]},
      { title: "Treatment", order: 4, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 4, title: "Treatment", subtitle: "CBT and self-compassion" },
        { type: "text", content: "<p>Cognitive: Socratic questioning, continuum work, decatastrophizing. Behavioral: experiments, exposure to imperfection. Self-compassion: self-kindness, common humanity, mindfulness.</p>" },
        { type: "multipleChoice", question: "Behavioral experiments:", options: [{ text: "Prove standards wrong", isCorrect: false }, { text: "Test predictions empirically", isCorrect: true }, { text: "Eliminate standards", isCorrect: false }, { text: "Replace with low motivation", isCorrect: false }], explanation: "Test predictions empirically." },
        { type: "multipleChoice", question: "Self-compassion includes all EXCEPT:", options: [{ text: "Self-kindness", isCorrect: false }, { text: "Common humanity", isCorrect: false }, { text: "Self-criticism for growth", isCorrect: true }, { text: "Mindfulness", isCorrect: false }], explanation: "Counters, not uses, self-criticism." },
        { type: "reflection", question: "What would you say to a friend who made a mistake you made?" },
        { type: "multipleChoice", question: "Perfectionism with depression:", options: [{ text: "Treat after depression", isCorrect: false }, { text: "Address if interferes with treatment", isCorrect: true }, { text: "Unrelated", isCorrect: false }, { text: "Medication only", isCorrect: false }], explanation: "May need attention if interfering." }
      ]}
    ],
    assessment: { passingScore: 80, questions: [
      { question: "Frost's concern over mistakes:", options: [{ text: "Personal standards", isCorrect: false }, { text: "Negative reactions to errors", isCorrect: true }, { text: "Organization", isCorrect: false }, { text: "Doubts", isCorrect: false }], explanation: "Concern over mistakes = negative reactions." },
      { question: "Cannot start projects due to imperfection fear:", options: [{ text: "Adaptive", isCorrect: false }, { text: "Procrastination as perfectionism", isCorrect: true }, { text: "Healthy balance", isCorrect: false }, { text: "Unrelated", isCorrect: false }], explanation: "Procrastination protects from imperfection." }
    ]}
  },
  {
    title: "Ordinary People: Family Systems and Grief",
    code: "CR-ORP-001",
    ceHours: 1,
    category: "Core",
    price: 0,
    status: "draft",
    level: "Intermediate",
    targetAudience: "LPCs, LCSWs, LMFTs, Psychologists",
    description: "Examines grief through family systems lens with evidence-based approaches.",
    learningObjectives: [
      "Apply family systems concepts to grieving families",
      "Identify how family dynamics influence grief",
      "Describe family grief therapy techniques",
      "Analyze attachment and communication in bereavement",
      "Evaluate complicated grief decisions"
    ],
    modules: [
      { title: "Family Systems and Grief", order: 1, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "Family Systems", subtitle: "Differentiation, triangulation, homeostasis" },
        { type: "reflection", question: "How has your family handled loss?" },
        { type: "text", content: "<p>Differentiation: maintain self while connected. Triangulation: third party stabilizes anxious dyad (Conrad in Ordinary People). Homeostasis: resist change even when dysfunctional.</p>" },
        { type: "multipleChoice", question: "Differentiation:", options: [{ text: "Physical separation", isCorrect: false }, { text: "Solid self while connected", isCorrect: true }, { text: "Reject values", isCorrect: false }, { text: "Identified patient", isCorrect: false }], explanation: "Solid self while connected." },
        { type: "multipleChoice", question: "Triangulation:", options: [{ text: "Three agree", isCorrect: false }, { text: "Third party stabilizes dyad", isCorrect: true }, { text: "Direct communication", isCorrect: false }, { text: "Clear boundaries", isCorrect: false }], explanation: "Third party stabilizes anxious dyad." },
        { type: "multipleChoice", question: "Homeostasis:", options: [{ text: "Healthy function", isCorrect: false }, { text: "Maintain stability, resist change", isCorrect: true }, { text: "Open communication", isCorrect: false }, { text: "Flexible roles", isCorrect: false }], explanation: "Resist change even when dysfunctional." }
      ]},
      { title: "Contemporary Grief Theory", order: 2, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Grief Theory", subtitle: "Dual process, continuing bonds, PGD" },
        { type: "text", content: "<p>Dual Process: oscillate between loss-oriented and restoration-oriented coping. Continuing Bonds: ongoing internal relationship is normative. PGD affects 7-10%.</p>" },
        { type: "multipleChoice", question: "Dual process model:", options: [{ text: "Constant loss focus", isCorrect: false }, { text: "Complete avoidance", isCorrect: false }, { text: "Oscillation between loss and restoration", isCorrect: true }, { text: "Linear stages", isCorrect: false }], explanation: "Oscillation between both." },
        { type: "multipleChoice", question: "Continuing bonds:", options: [{ text: "Sever attachment", isCorrect: false }, { text: "Ongoing internal relationship OK", isCorrect: true }, { text: "Complete in 6 months", isCorrect: false }, { text: "Don't discuss deceased", isCorrect: false }], explanation: "Ongoing relationship is normative." },
        { type: "multipleChoice", question: "PGD affects:", options: [{ text: "1-2%", isCorrect: false }, { text: "7-10%", isCorrect: true }, { text: "25-30%", isCorrect: false }, { text: "50%", isCorrect: false }], explanation: "7-10% develop PGD." }
      ]},
      { title: "Family Dynamics", order: 3, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 3, title: "Family Dynamics", subtitle: "Differential responses, role reorganization" },
        { type: "text", content: "<p>Instrumental grievers: activity/problem-solving. Intuitive: emotional expression. Neither superior. Sibling grief often overlooked—survivor guilt common.</p>" },
        { type: "multipleChoice", question: "Instrumental grievers:", options: [{ text: "Crying/expression", isCorrect: false }, { text: "Activity/problem-solving", isCorrect: true }, { text: "Withdrawal", isCorrect: false }, { text: "Denial", isCorrect: false }], explanation: "Process through activity." },
        { type: "reflection", question: "How did a family you worked with grieve differently?" }
      ]},
      { title: "Clinical Approaches", order: 4, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 4, title: "Clinical Approaches", subtitle: "FFGT and cultural considerations" },
        { type: "text", content: "<p>FFGT (Kissane): communication, cohesion, conflict resolution. 4-8 sessions. Cultural sensitivity essential—grief is culturally shaped.</p>" },
        { type: "multipleChoice", question: "FFGT targets:", options: [{ text: "Individual insight", isCorrect: false }, { text: "Communication, cohesion, conflict resolution", isCorrect: true }, { text: "Medication", isCorrect: false }, { text: "Pre-loss functioning", isCorrect: false }], explanation: "Communication, cohesion, conflict resolution." },
        { type: "multipleChoice", question: "Conrad illustrates:", options: [{ text: "Differentiation", isCorrect: false }, { text: "Triangulation", isCorrect: true }, { text: "Homeostasis", isCorrect: false }, { text: "Enmeshment", isCorrect: false }], explanation: "Triangulated between parents." },
        { type: "multipleChoice", question: "Cultural diversity:", options: [{ text: "Same model for all", isCorrect: false }, { text: "Avoid differences", isCorrect: false }, { text: "Grief is culturally shaped, adapt", isCorrect: true }, { text: "Individual only", isCorrect: false }], explanation: "Adapt to cultural shaping." }
      ]}
    ],
    assessment: { passingScore: 80, questions: [
      { question: "Child death and parents:", options: [{ text: "Marriage strengthens", isCorrect: false }, { text: "Dissolution rates increase", isCorrect: true }, { text: "Siblings don't grieve", isCorrect: false }, { text: "Family therapy contraindicated", isCorrect: false }], explanation: "Dissolution rates increase." }
    ]}
  },
  {
    title: "The Sixth Sense: Clinical Intuition and Assessment",
    code: "CR-TSS-001",
    ceHours: 1,
    category: "Core",
    price: 0,
    status: "draft",
    level: "Intermediate",
    targetAudience: "LPCs, LCSWs, LMFTs, Psychologists",
    description: "Explores clinical intuition: cognitive foundations, deliberate practice, biases, and systematic assessment integration.",
    learningObjectives: [
      "Define clinical intuition within dual-process theory",
      "Identify sources: pattern recognition, emotional attunement",
      "Analyze cognitive biases in clinical judgment",
      "Apply deliberate practice strategies",
      "Integrate intuitive and systematic approaches"
    ],
    modules: [
      { title: "Nature of Clinical Intuition", order: 1, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "Clinical Intuition", subtitle: "Dual-process theory" },
        { type: "reflection", question: "Recall a clinical moment of strong intuitive awareness." },
        { type: "text", content: "<p>System 1: fast, automatic, unconscious. System 2: slow, deliberate, conscious. Clinical intuition = System 1 applied clinically. Novice vs expert intuitions differ qualitatively.</p>" },
        { type: "multipleChoice", question: "Clinical intuition is:", options: [{ text: "Mysterious gift", isCorrect: false }, { text: "Opposite of evidence-based", isCorrect: false }, { text: "Implicit knowledge become automatic", isCorrect: true }, { text: "Unreliable", isCorrect: false }], explanation: "Implicit knowledge become automatic." },
        { type: "multipleChoice", question: "System 1:", options: [{ text: "Slow/deliberate", isCorrect: false }, { text: "Fast/automatic/unconscious", isCorrect: true }, { text: "Rule-following", isCorrect: false }, { text: "High load", isCorrect: false }], explanation: "Fast, automatic, unconscious." }
      ]},
      { title: "Sources of Intuition", order: 2, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Sources", subtitle: "Pattern recognition, attunement, implicit learning" },
        { type: "text", content: "<p>Pattern recognition: diagnostic, personality, crisis patterns. Accuracy depends on experience quality.</p>" },
        { type: "accordion", accordionItems: [{ title: "Emotional Attunement", content: "Perceiving via expressions, tone, posture. Countertransference provides info." }, { title: "Implicit Learning", content: "Expertise acquired implicitly. Experts can't always articulate why." }] },
        { type: "multipleChoice", question: "Expert intuition develops where:", options: [{ text: "Delayed feedback", isCorrect: false }, { text: "Reliable immediate feedback", isCorrect: true }, { text: "Strong opinions", isCorrect: false }, { text: "Complex cases", isCorrect: false }], explanation: "Reliable immediate feedback." },
        { type: "multipleChoice", question: "Diagnostic countertransference:", options: [{ text: "Therapist's issues", isCorrect: false }, { text: "Client-elicited responses providing info", isCorrect: true }, { text: "Diagnostic errors", isCorrect: false }, { text: "Negative feelings", isCorrect: false }], explanation: "Client-elicited responses providing info." }
      ]},
      { title: "Cognitive Biases", order: 3, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 3, title: "Biases", subtitle: "Recognition and mitigation" },
        { type: "text", content: "<p>Confirmation: seek confirming, ignore contradicting. Anchoring: over-rely on initial impressions. Also: availability, attribution error, hindsight, affect heuristic, overconfidence.</p>" },
        { type: "multipleChoice", question: "Confirmation bias:", options: [{ text: "Seek confirming, ignore contradicting", isCorrect: true }, { text: "Standardized measures", isCorrect: false }, { text: "Second opinions", isCorrect: false }, { text: "Structured interviews", isCorrect: false }], explanation: "Seek confirming, ignore contradicting." },
        { type: "multipleChoice", question: "Anchoring:", options: [{ text: "Ground clients", isCorrect: false }, { text: "Over-rely on initial impressions", isCorrect: true }, { text: "Evidence-based", isCorrect: false }, { text: "Boundaries", isCorrect: false }], explanation: "Over-rely on initial impressions." },
        { type: "accordion", accordionItems: [{ title: "Mitigation", content: "Consider alternatives. Structured tools. Disconfirming evidence. Consultation. Slow down. Accountability." }] },
        { type: "multipleChoice", question: "Best bias mitigation:", options: [{ text: "Trust gut", isCorrect: false }, { text: "Consider alternatives", isCorrect: true }, { text: "Avoid consultation", isCorrect: false }, { text: "Quick decisions", isCorrect: false }], explanation: "Deliberately consider alternatives." }
      ]},
      { title: "Developing Intuition", order: 4, contentBlocks: [
        { type: "sectionDivider", sectionNumber: 4, title: "Development", subtitle: "Deliberate practice, reflection, integration" },
        { type: "text", content: "<p>Deliberate practice: video review, role-play, outcome tracking, supervision. Years alone don't guarantee expertise. Reflective practice makes implicit explicit. Integration: intuition for patterns, analysis for unfamiliar/high-stakes.</p>" },
        { type: "multipleChoice", question: "Deliberate practice includes all EXCEPT:", options: [{ text: "Video review", isCorrect: false }, { text: "Outcome tracking", isCorrect: false }, { text: "Simply accumulating years", isCorrect: true }, { text: "Role-play", isCorrect: false }], explanation: "Years alone don't suffice." },
        { type: "multipleChoice", question: "Intuition vs data conflict:", options: [{ text: "Trust intuition", isCorrect: false }, { text: "Trust data", isCorrect: false }, { text: "Further inquiry", isCorrect: true }, { text: "Ignore both", isCorrect: false }], explanation: "Further inquiry to understand." },
        { type: "text", content: "<p>Cultural considerations: intuitions may not generalize across contexts.</p>" },
        { type: "multipleChoice", question: "Cultural considerations matter because:", options: [{ text: "May not generalize", isCorrect: true }, { text: "Same across cultures", isCorrect: false }, { text: "Culture irrelevant", isCorrect: false }, { text: "Only own culture", isCorrect: false }], explanation: "Intuitions are culturally situated." },
        { type: "reflection", question: "Where are your intuitions most/least reliable?" }
      ]}
    ],
    assessment: { passingScore: 80, questions: [
      { question: "Expertise development parallels:", options: [{ text: "Freud's stages", isCorrect: false }, { text: "Benner's novice-to-expert", isCorrect: true }, { text: "Piaget's stages", isCorrect: false }, { text: "Kohlberg's stages", isCorrect: false }], explanation: "Benner's novice-to-expert model." },
      { question: "Hindsight bias:", options: [{ text: "Learning from mistakes", isCorrect: false }, { text: "Past seems more predictable after outcomes", isCorrect: true }, { text: "Historical info", isCorrect: false }, { text: "Reviewing notes", isCorrect: false }], explanation: "Past seems predictable after outcomes." }
    ]}
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!\n');

    for (const c of courses) {
      const exists = await Course.findOne({ code: c.code });
      if (exists) {
        await Course.findOneAndUpdate({ code: c.code }, { ...c, updatedAt: new Date() });
        console.log(`Updated: ${c.code}`);
      } else {
        await Course.create(c);
        console.log(`Created: ${c.code}`);
      }
    }

    console.log('\n✅ Done! 4 courses seeded.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
