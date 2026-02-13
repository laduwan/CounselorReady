#!/usr/bin/env node
/**
 * addAssessments.js
 * 
 * Adds final assessment questions to 11 courses that are missing them.
 * Questions are based on actual course content.
 * 
 * Run: node src/scripts/addAssessments.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// ============================================================
// ASSESSMENT DATA FOR EACH COURSE
// ============================================================

const ASSESSMENTS = {

// ── 1. Walking on Eggshells: High-Conflict Clients (3CE) ──
"Walking on Eggshells": {
  matchTitle: "Walking on Eggshells",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "Which personality disorder is MOST commonly associated with high-conflict presentations in outpatient settings?", options: [{ text: "Avoidant Personality Disorder", isCorrect: false }, { text: "Borderline Personality Disorder", isCorrect: true }, { text: "Schizoid Personality Disorder", isCorrect: false }, { text: "Dependent Personality Disorder", isCorrect: false }] },
    { question: "The 'splitting' defense mechanism involves:", options: [{ text: "Separating from the therapist mid-session", isCorrect: false }, { text: "Viewing people and situations in all-or-nothing, black-and-white terms", isCorrect: true }, { text: "Dividing session time between multiple concerns", isCorrect: false }, { text: "Creating conflict between family members", isCorrect: false }] },
    { question: "When a high-conflict client becomes verbally aggressive during session, the FIRST therapeutic response should be:", options: [{ text: "Terminate the session immediately", isCorrect: false }, { text: "Match the client's intensity to show understanding", isCorrect: false }, { text: "Acknowledge the emotion while maintaining a calm, boundaried stance", isCorrect: true }, { text: "Redirect to a neutral topic", isCorrect: false }] },
    { question: "Countertransference reactions with high-conflict clients commonly include all EXCEPT:", options: [{ text: "Dreading upcoming sessions", isCorrect: false }, { text: "Rescue fantasies", isCorrect: false }, { text: "Feeling controlled or manipulated", isCorrect: false }, { text: "Complete emotional neutrality throughout treatment", isCorrect: true }] },
    { question: "The concept of a 'therapeutic window' in working with high-conflict clients refers to:", options: [{ text: "The optimal time of day for scheduling sessions", isCorrect: false }, { text: "The zone between too much arousal and too little engagement where productive work occurs", isCorrect: true }, { text: "A 30-day assessment period at intake", isCorrect: false }, { text: "The window of time before insurance coverage ends", isCorrect: false }] },
    { question: "Which approach is MOST effective for setting limits with high-conflict clients?", options: [{ text: "Avoid setting limits to prevent rupture", isCorrect: false }, { text: "Clear, consistent boundaries communicated with empathy and validation", isCorrect: true }, { text: "Rigid rules with consequences for violations", isCorrect: false }, { text: "Allowing the client to determine session structure", isCorrect: false }] },
    { question: "A client with high-conflict traits repeatedly contacts you between sessions with non-emergency issues. The BEST approach is to:", options: [{ text: "Never respond to maintain firm boundaries", isCorrect: false }, { text: "Respond immediately each time to reduce anxiety", isCorrect: false }, { text: "Revisit the between-session contact agreement collaboratively and problem-solve alternatives", isCorrect: true }, { text: "Refer the client to another provider", isCorrect: false }] },
    { question: "Validation in working with high-conflict clients means:", options: [{ text: "Agreeing with the client's perspective", isCorrect: false }, { text: "Acknowledging the client's emotional experience as understandable given their context", isCorrect: true }, { text: "Telling the client they are right", isCorrect: false }, { text: "Avoiding any challenge to the client's worldview", isCorrect: false }] },
    { question: "Which treatment modality has the STRONGEST evidence base for Borderline Personality Disorder?", options: [{ text: "Psychoanalysis", isCorrect: false }, { text: "Dialectical Behavior Therapy (DBT)", isCorrect: true }, { text: "Eye Movement Desensitization and Reprocessing", isCorrect: false }, { text: "Brief Solution-Focused Therapy", isCorrect: false }] },
    { question: "The term 'projective identification' describes:", options: [{ text: "A diagnostic assessment technique", isCorrect: false }, { text: "A process where the client unconsciously projects feelings onto the therapist who then begins to experience those feelings", isCorrect: true }, { text: "Identifying with a client's cultural background", isCorrect: false }, { text: "A structured group therapy exercise", isCorrect: false }] },
    { question: "Consultation and supervision when working with high-conflict clients is considered:", options: [{ text: "Optional but recommended", isCorrect: false }, { text: "An ethical necessity for managing countertransference and maintaining quality care", isCorrect: true }, { text: "Only necessary for pre-licensed clinicians", isCorrect: false }, { text: "A sign of clinical weakness", isCorrect: false }] },
    { question: "A therapeutic rupture with a high-conflict client should be viewed as:", options: [{ text: "Evidence of treatment failure", isCorrect: false }, { text: "An opportunity for relational repair that can strengthen the therapeutic alliance", isCorrect: true }, { text: "Grounds for immediate termination", isCorrect: false }, { text: "Something to avoid discussing directly", isCorrect: false }] },
  ]
},

// ── 2. It Takes a Village: Collaborative Care (3CE) ──
"It Takes a Village": {
  matchTitle: "It Takes a Village",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "The primary purpose of consultation in clinical practice is to:", options: [{ text: "Transfer responsibility for the client to another provider", isCorrect: false }, { text: "Obtain professional guidance while retaining responsibility for the client's care", isCorrect: true }, { text: "Fulfill continuing education requirements", isCorrect: false }, { text: "Document that the clinician sought a second opinion", isCorrect: false }] },
    { question: "According to the ACA Code of Ethics, counselors should make referrals when:", options: [{ text: "The client requests a different therapist", isCorrect: false }, { text: "The counselor lacks competence to address the client's needs", isCorrect: true }, { text: "Insurance changes occur", isCorrect: false }, { text: "The client has been in treatment for more than one year", isCorrect: false }] },
    { question: "Effective referral practice includes all of the following EXCEPT:", options: [{ text: "Providing the client with at least three referral options when possible", isCorrect: false }, { text: "Following up to confirm the client connected with the referral", isCorrect: false }, { text: "Abandoning the client once the referral is made", isCorrect: true }, { text: "Documenting the referral rationale in the clinical record", isCorrect: false }] },
    { question: "In collaborative care models, 'warm handoffs' refer to:", options: [{ text: "Transferring paper records between providers", isCorrect: false }, { text: "Real-time introductions between the client and the receiving provider", isCorrect: true }, { text: "Sending encrypted emails between clinicians", isCorrect: false }, { text: "Scheduling joint billing arrangements", isCorrect: false }] },
    { question: "A Release of Information (ROI) for collaborative care must include:", options: [{ text: "A general statement allowing all communication", isCorrect: false }, { text: "Specific identification of what information will be shared, with whom, and for what purpose", isCorrect: true }, { text: "Only the client's signature", isCorrect: false }, { text: "The referring clinician's diagnosis", isCorrect: false }] },
    { question: "When a psychiatrist and counselor disagree about a client's treatment plan, the BEST course of action is:", options: [{ text: "Defer entirely to the psychiatrist's medical authority", isCorrect: false }, { text: "Engage in respectful dialogue focused on the client's best interest and document the collaborative discussion", isCorrect: true }, { text: "Tell the client about the disagreement and let them decide", isCorrect: false }, { text: "Discontinue collaboration", isCorrect: false }] },
    { question: "Integrated behavioral health care is characterized by:", options: [{ text: "Mental health providers working in the same building as medical providers but independently", isCorrect: false }, { text: "Behavioral health services embedded within primary care with shared treatment planning", isCorrect: true }, { text: "Referral-only relationships between providers", isCorrect: false }, { text: "Separate electronic health records for each provider", isCorrect: false }] },
    { question: "Barriers to effective interdisciplinary collaboration include all EXCEPT:", options: [{ text: "Different professional languages and frameworks", isCorrect: false }, { text: "Shared commitment to client welfare", isCorrect: true }, { text: "Power hierarchies between disciplines", isCorrect: false }, { text: "Confidentiality concerns limiting information sharing", isCorrect: false }] },
    { question: "Documentation of consultation should include:", options: [{ text: "Only the final recommendation", isCorrect: false }, { text: "The clinical question, consultant's recommendations, and the clinician's decision about implementing those recommendations", isCorrect: true }, { text: "A copy of the consultant's license", isCorrect: false }, { text: "The consultant's entire case history with the client", isCorrect: false }] },
    { question: "The 'stepped care' model in collaborative treatment refers to:", options: [{ text: "Gradually increasing session frequency", isCorrect: false }, { text: "A system where treatment intensity is matched to client need, stepping up or down as indicated", isCorrect: true }, { text: "Walking clients through a series of self-help books", isCorrect: false }, { text: "A referral chain from primary care to specialist", isCorrect: false }] },
    { question: "Ethical considerations in collaborative care include:", options: [{ text: "Sharing all client information freely among team members", isCorrect: false }, { text: "Obtaining informed consent for each communication and maintaining minimum necessary disclosure", isCorrect: true }, { text: "Billing separately for consultation time without informing the client", isCorrect: false }, { text: "Avoiding documentation of team communications", isCorrect: false }] },
    { question: "When making a referral for a client with limited resources, the counselor should:", options: [{ text: "Only refer to private practice providers", isCorrect: false }, { text: "Identify community resources, sliding-scale options, and assist the client in navigating access barriers", isCorrect: true }, { text: "Discontinue treatment if the client cannot afford the referral", isCorrect: false }, { text: "Provide the services outside their scope rather than refer", isCorrect: false }] },
  ]
},

// ── 3. When It Rains, It Pours: Multiple Stressors (3CE) ──
"When It Rains It Pours": {
  matchTitle: "When It Rains, It Pours",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "The concept of 'allostatic load' refers to:", options: [{ text: "The maximum number of stressors a person can handle", isCorrect: false }, { text: "The cumulative wear and tear on the body from chronic stress and repeated adaptation", isCorrect: true }, { text: "The immediate fight-or-flight response to acute stress", isCorrect: false }, { text: "A diagnostic criterion for Adjustment Disorder", isCorrect: false }] },
    { question: "When treating a client with co-occurring depression and chronic pain, the MOST important initial step is:", options: [{ text: "Treat the depression first since it is the psychiatric condition", isCorrect: false }, { text: "Conduct a comprehensive assessment of how both conditions interact and affect functioning", isCorrect: true }, { text: "Refer to a pain specialist and wait for medical clearance", isCorrect: false }, { text: "Focus exclusively on pain management", isCorrect: false }] },
    { question: "The 'diathesis-stress model' explains that psychopathology results from:", options: [{ text: "Stress alone, regardless of individual vulnerability", isCorrect: false }, { text: "The interaction between pre-existing vulnerability and environmental stressors", isCorrect: true }, { text: "Genetic predisposition without environmental triggers", isCorrect: false }, { text: "Learned behavioral patterns from childhood", isCorrect: false }] },
    { question: "Treatment prioritization when a client presents with multiple stressors should be guided by:", options: [{ text: "The therapist's area of greatest expertise", isCorrect: false }, { text: "Safety concerns first, then functional impairment, then client preference", isCorrect: true }, { text: "Insurance authorization requirements", isCorrect: false }, { text: "Chronological order of symptom onset", isCorrect: false }] },
    { question: "Comorbidity between anxiety disorders and substance use disorders is BEST explained by:", options: [{ text: "Coincidental co-occurrence", isCorrect: false }, { text: "Self-medication hypotheses, shared neurobiological pathways, and bidirectional maintenance", isCorrect: true }, { text: "Diagnostic overlap in the DSM-5-TR", isCorrect: false }, { text: "Clinician bias in assessment", isCorrect: false }] },
    { question: "A transdiagnostic approach to treating multiple comorbidities focuses on:", options: [{ text: "Treating each disorder with its own evidence-based protocol sequentially", isCorrect: false }, { text: "Identifying and targeting shared underlying processes such as emotion dysregulation, avoidance, and cognitive distortions", isCorrect: true }, { text: "Using one medication to treat all symptoms", isCorrect: false }, { text: "Group therapy that addresses all conditions simultaneously", isCorrect: false }] },
    { question: "Social determinants of health that contribute to multiple stressors include all EXCEPT:", options: [{ text: "Housing instability", isCorrect: false }, { text: "Food insecurity", isCorrect: false }, { text: "Intrinsic personality traits", isCorrect: true }, { text: "Lack of transportation to services", isCorrect: false }] },
    { question: "Measurement-based care for clients with multiple presenting problems involves:", options: [{ text: "Using a single outcome measure for the primary diagnosis", isCorrect: false }, { text: "Regularly administering validated measures across multiple domains and using data to guide treatment decisions", isCorrect: true }, { text: "Measuring progress only at discharge", isCorrect: false }, { text: "Relying solely on clinician judgment", isCorrect: false }] },
    { question: "When a client experiences 'compassion fatigue' related to caregiving burden, the therapist should:", options: [{ text: "Focus exclusively on the client's mental health symptoms", isCorrect: false }, { text: "Validate the experience, assess for burnout indicators, and help develop sustainable self-care and resource-seeking strategies", isCorrect: true }, { text: "Recommend the client stop caregiving", isCorrect: false }, { text: "Prescribe anti-anxiety medication", isCorrect: false }] },
    { question: "The primary risk of treating multiple stressors without a coherent case conceptualization is:", options: [{ text: "The client feeling overwhelmed by too many interventions", isCorrect: false }, { text: "Fragmented treatment that fails to address interactions between problems and may inadvertently worsen some symptoms", isCorrect: true }, { text: "Exceeding the session time limit", isCorrect: false }, { text: "Insurance denial of claims", isCorrect: false }] },
    { question: "Resilience in the context of multiple stressors is BEST understood as:", options: [{ text: "An innate personality trait that cannot be developed", isCorrect: false }, { text: "The absence of negative emotional responses to stress", isCorrect: false }, { text: "A dynamic process involving adaptation in the face of adversity, influenced by protective factors", isCorrect: true }, { text: "A clinical diagnosis", isCorrect: false }] },
    { question: "Collaborative care is especially important for clients with multiple stressors because:", options: [{ text: "It reduces the therapist's liability", isCorrect: false }, { text: "Complex presentations often require expertise from multiple disciplines and coordination prevents contradictory interventions", isCorrect: true }, { text: "Insurance companies require it for authorization", isCorrect: false }, { text: "Clients prefer seeing multiple providers", isCorrect: false }] },
  ]
},

// ── 4. Ethics and Professional Boundaries (3CE) ──
"Ethics": {
  matchTitle: "Ethics and Professional Boundaries",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "The five foundational ethical principles in counseling are:", options: [{ text: "Autonomy, beneficence, nonmaleficence, justice, and fidelity", isCorrect: true }, { text: "Confidentiality, competence, consent, compliance, and care", isCorrect: false }, { text: "Honesty, loyalty, fairness, respect, and dignity", isCorrect: false }, { text: "Safety, effectiveness, efficiency, equity, and timeliness", isCorrect: false }] },
    { question: "A boundary VIOLATION differs from a boundary CROSSING in that a violation:", options: [{ text: "Is always sexual in nature", isCorrect: false }, { text: "Causes harm or has significant potential for harm to the client", isCorrect: true }, { text: "Is reported to the licensing board", isCorrect: false }, { text: "Only occurs with former clients", isCorrect: false }] },
    { question: "According to the ACA Code of Ethics, sexual or romantic relationships with former clients:", options: [{ text: "Are never permitted under any circumstances", isCorrect: false }, { text: "Are permitted after a 5-year waiting period with conditions demonstrating no exploitation", isCorrect: true }, { text: "Are permitted after termination of the therapeutic relationship", isCorrect: false }, { text: "Are permitted if the client initiates", isCorrect: false }] },
    { question: "The duty to warn/protect (Tarasoff) requires clinicians to:", options: [{ text: "Report all threats to law enforcement", isCorrect: false }, { text: "Take reasonable steps to protect identifiable potential victims when a client poses a serious threat of harm", isCorrect: true }, { text: "Warn everyone the client has mentioned in sessions", isCorrect: false }, { text: "Only document the threat in clinical notes", isCorrect: false }] },
    { question: "Informed consent in counseling must include:", options: [{ text: "Only the counselor's credentials and fee structure", isCorrect: false }, { text: "The nature and purpose of treatment, risks and benefits, alternatives, confidentiality limits, and client rights", isCorrect: true }, { text: "A guarantee of treatment outcomes", isCorrect: false }, { text: "The counselor's theoretical orientation only", isCorrect: false }] },
    { question: "When a counselor encounters an ethical dilemma, the FIRST step should be:", options: [{ text: "Report to the licensing board", isCorrect: false }, { text: "Identify the problem and relevant ethical codes, laws, and institutional policies", isCorrect: true }, { text: "Consult with the client about how to proceed", isCorrect: false }, { text: "Terminate the therapeutic relationship", isCorrect: false }] },
    { question: "Mandatory reporting of child abuse:", options: [{ text: "Overrides client confidentiality in all states", isCorrect: true }, { text: "Is optional depending on clinical judgment", isCorrect: false }, { text: "Only applies to licensed psychologists", isCorrect: false }, { text: "Requires the client's written consent before reporting", isCorrect: false }] },
    { question: "In rural or small-community practice, managing dual relationships is BEST addressed by:", options: [{ text: "Refusing to treat anyone in the community", isCorrect: false }, { text: "Openly discussing potential boundary issues, setting clear limits, documenting decisions, and seeking consultation", isCorrect: true }, { text: "Ignoring the dual relationship since it is unavoidable", isCorrect: false }, { text: "Moving to a larger community", isCorrect: false }] },
    { question: "The 'reasonable person' standard in ethical decision-making asks:", options: [{ text: "Would a reasonable client approve of this action?", isCorrect: false }, { text: "Would a reasonable professional with similar training make the same decision given the same circumstances?", isCorrect: true }, { text: "Would a reasonable judge dismiss the complaint?", isCorrect: false }, { text: "Would a reasonable person understand the clinical terminology?", isCorrect: false }] },
    { question: "Clinical supervision that includes evaluation of supervisee competence is governed by:", options: [{ text: "No specific ethical standards", isCorrect: false }, { text: "The same ethical standards as the therapeutic relationship, including informed consent, boundaries, and due process", isCorrect: true }, { text: "Only state licensing board regulations", isCorrect: false }, { text: "The supervisor's personal preferences", isCorrect: false }] },
    { question: "When a client requests access to their clinical records, the counselor should:", options: [{ text: "Refuse, as records are the counselor's property", isCorrect: false }, { text: "Provide access consistent with applicable laws and discuss any concerns about potential harm from viewing records", isCorrect: true }, { text: "Rewrite the records to remove clinical impressions", isCorrect: false }, { text: "Only provide records through an attorney", isCorrect: false }] },
    { question: "Documentation serves as a primary defense in ethical complaints because:", options: [{ text: "It proves the counselor is always right", isCorrect: false }, { text: "It provides a contemporaneous record of clinical decision-making, informed consent, and adherence to standard of care", isCorrect: true }, { text: "Licensing boards only review documentation", isCorrect: false }, { text: "It replaces the need for consultation", isCorrect: false }] },
    { question: "The principle of nonmaleficence obligates counselors to:", options: [{ text: "Actively promote client welfare", isCorrect: false }, { text: "Avoid actions that cause harm or have a high risk of causing harm", isCorrect: true }, { text: "Treat all clients equally regardless of presenting concern", isCorrect: false }, { text: "Maintain absolute confidentiality", isCorrect: false }] },
    { question: "Self-care for counselors is considered:", options: [{ text: "A personal choice unrelated to ethical practice", isCorrect: false }, { text: "An ethical obligation because impaired clinicians pose risks to client welfare", isCorrect: true }, { text: "Only important for new clinicians", isCorrect: false }, { text: "Required only by certain licensing boards", isCorrect: false }] },
    { question: "When cultural values conflict with ethical codes, the counselor should:", options: [{ text: "Always prioritize the ethical code over cultural considerations", isCorrect: false }, { text: "Apply an ethical decision-making model that considers cultural context, consult with colleagues, and document the process", isCorrect: true }, { text: "Defer to the client's cultural norms", isCorrect: false }, { text: "Avoid working with culturally diverse clients", isCorrect: false }] },
  ]
},

// ── 5. Suicide Risk Assessment (4CE) ──
"Suicide Risk": {
  matchTitle: "Suicide Risk Assessment",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "According to Joiner's Interpersonal-Psychological Theory of Suicide, the three factors required for lethal suicidal behavior are:", options: [{ text: "Depression, anxiety, and substance use", isCorrect: false }, { text: "Thwarted belongingness, perceived burdensomeness, and acquired capability for suicide", isCorrect: true }, { text: "Hopelessness, impulsivity, and access to means", isCorrect: false }, { text: "Social isolation, chronic pain, and genetic predisposition", isCorrect: false }] },
    { question: "The Columbia-Suicide Severity Rating Scale (C-SSRS) primarily assesses:", options: [{ text: "Depression severity", isCorrect: false }, { text: "Suicidal ideation severity and suicidal behavior", isCorrect: true }, { text: "Personality disorder traits", isCorrect: false }, { text: "Functional impairment", isCorrect: false }] },
    { question: "The Stanley-Brown Safety Planning Intervention includes all EXCEPT:", options: [{ text: "Identifying warning signs", isCorrect: false }, { text: "Listing internal coping strategies", isCorrect: false }, { text: "Restricting all means access permanently", isCorrect: true }, { text: "Identifying social contacts for support", isCorrect: false }] },
    { question: "Means restriction counseling is critical because:", options: [{ text: "It eliminates suicidal ideation", isCorrect: false }, { text: "Reducing access to lethal means during crisis significantly reduces suicide completion rates", isCorrect: true }, { text: "It is required by law in all states", isCorrect: false }, { text: "Clients will not attempt suicide without their preferred means", isCorrect: false }] },
    { question: "Which population has the HIGHEST rate of suicide completion?", options: [{ text: "Adolescent females", isCorrect: false }, { text: "Middle-aged and older White males", isCorrect: true }, { text: "Young adult college students", isCorrect: false }, { text: "Elderly females", isCorrect: false }] },
    { question: "When assessing suicide risk, 'protective factors' include all EXCEPT:", options: [{ text: "Strong social connections", isCorrect: false }, { text: "Access to mental health treatment", isCorrect: false }, { text: "Previous suicide attempts", isCorrect: true }, { text: "Reasons for living", isCorrect: false }] },
    { question: "The ethical principle MOST relevant to involuntary hospitalization for suicidal clients is:", options: [{ text: "Autonomy vs. beneficence", isCorrect: true }, { text: "Justice vs. fidelity", isCorrect: false }, { text: "Nonmaleficence vs. veracity", isCorrect: false }, { text: "Competence vs. confidentiality", isCorrect: false }] },
    { question: "Warning signs of imminent suicide risk include:", options: [{ text: "Talking about being a burden, increasing isolation, giving away possessions, and sudden calmness after depression", isCorrect: true }, { text: "Increased social activity and improved mood", isCorrect: false }, { text: "Making future plans and expressing hope", isCorrect: false }, { text: "Consistent attendance at therapy sessions", isCorrect: false }] },
    { question: "The CALM approach to means counseling stands for:", options: [{ text: "Counsel, Assess, Limit, Monitor", isCorrect: false }, { text: "Counseling on Access to Lethal Means", isCorrect: true }, { text: "Crisis Assessment and Lethality Management", isCorrect: false }, { text: "Clinical Assessment of Lethal Methods", isCorrect: false }] },
    { question: "Clinician self-care after a client suicide is important because:", options: [{ text: "It prevents licensing board complaints", isCorrect: false }, { text: "Client suicide can cause vicarious trauma, grief, and impairment that affects the clinician's practice and wellbeing", isCorrect: true }, { text: "It is required by insurance carriers", isCorrect: false }, { text: "It demonstrates competence", isCorrect: false }] },
    { question: "Cultural considerations in suicide assessment include:", options: [{ text: "Using the same assessment tools for all populations", isCorrect: false }, { text: "Recognizing that cultural factors influence how suicidal ideation is expressed, help-seeking behavior, and protective factors", isCorrect: true }, { text: "Avoiding direct questions about suicide with culturally diverse clients", isCorrect: false }, { text: "Assuming all cultures have the same risk factors", isCorrect: false }] },
    { question: "Documentation of suicide risk assessment should include:", options: [{ text: "Only the final risk level determination", isCorrect: false }, { text: "Risk factors, protective factors, clinical reasoning, safety plan, and disposition decision with rationale", isCorrect: true }, { text: "A signed contract for safety", isCorrect: false }, { text: "Only the standardized assessment score", isCorrect: false }] },
    { question: "A 'no-suicide contract' is considered:", options: [{ text: "The gold standard for safety planning", isCorrect: false }, { text: "Clinically insufficient and not a substitute for comprehensive safety planning", isCorrect: true }, { text: "Legally binding and protective", isCorrect: false }, { text: "Effective for all client populations", isCorrect: false }] },
    { question: "LGBTQ+ youth are at elevated suicide risk primarily due to:", options: [{ text: "Inherent psychopathology", isCorrect: false }, { text: "Minority stress, discrimination, family rejection, and lack of affirming supports", isCorrect: true }, { text: "Biological factors", isCorrect: false }, { text: "Overrepresentation in clinical samples", isCorrect: false }] },
    { question: "Following a suicide risk assessment that reveals moderate risk, the MOST appropriate next step is:", options: [{ text: "Immediate involuntary hospitalization", isCorrect: false }, { text: "Develop or update a safety plan, increase session frequency, restrict means, and coordinate care", isCorrect: true }, { text: "Discharge from treatment with referral resources", isCorrect: false }, { text: "No action needed at moderate level", isCorrect: false }] },
  ]
},

// ── 6. Beyond the Surface: Multicultural Competence (3CE) ──
"Beyond the Surface": {
  matchTitle: "Beyond the Surface",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "Sue's Tripartite Model of Multicultural Competence includes:", options: [{ text: "Knowledge, skills, and attitudes/beliefs", isCorrect: true }, { text: "Awareness, intervention, and evaluation", isCorrect: false }, { text: "Assessment, treatment, and referral", isCorrect: false }, { text: "Individual, family, and community", isCorrect: false }] },
    { question: "Cultural humility differs from cultural competence in that cultural humility:", options: [{ text: "Assumes mastery of specific cultural knowledge", isCorrect: false }, { text: "Emphasizes a lifelong stance of openness, self-reflection, and power-sharing with clients", isCorrect: true }, { text: "Requires completing specific diversity training courses", isCorrect: false }, { text: "Focuses solely on racial differences", isCorrect: false }] },
    { question: "Microaggressions are BEST defined as:", options: [{ text: "Intentional acts of discrimination", isCorrect: false }, { text: "Brief, commonplace exchanges that communicate hostile or derogatory slights, often unintentionally", isCorrect: true }, { text: "Physical acts of violence based on identity", isCorrect: false }, { text: "Conscious biases that counselors hold", isCorrect: false }] },
    { question: "The ADDRESSING framework (Hays) is used to:", options: [{ text: "Address client resistance in therapy", isCorrect: false }, { text: "Systematically consider multiple dimensions of cultural identity including Age, Disability, Religion, Ethnicity, Sexual orientation, etc.", isCorrect: true }, { text: "Structure treatment plans for diverse clients", isCorrect: false }, { text: "Diagnose culturally-specific disorders", isCorrect: false }] },
    { question: "When a client's cultural values conflict with the counselor's approach, the counselor should:", options: [{ text: "Prioritize the treatment model over cultural values", isCorrect: false }, { text: "Adapt the approach to honor cultural values while maintaining clinical effectiveness and ethical standards", isCorrect: true }, { text: "Refer the client to a counselor from the same cultural background", isCorrect: false }, { text: "Educate the client about Western psychological norms", isCorrect: false }] },
    { question: "Racial identity development models suggest that:", options: [{ text: "All individuals progress through identity stages at the same rate", isCorrect: false }, { text: "Identity development involves stages of awareness, exploration, and integration that influence the therapeutic relationship", isCorrect: true }, { text: "Only racial minorities experience identity development", isCorrect: false }, { text: "Identity development is complete by adulthood", isCorrect: false }] },
    { question: "The concept of 'intersectionality' acknowledges that:", options: [{ text: "All cultural groups experience the same discrimination", isCorrect: false }, { text: "Multiple identity dimensions interact to create unique experiences of privilege and marginalization", isCorrect: true }, { text: "Culture is the only factor affecting mental health", isCorrect: false }, { text: "Counselors should treat each identity dimension separately", isCorrect: false }] },
    { question: "Social determinants of health in multicultural counseling include:", options: [{ text: "Only race and ethnicity", isCorrect: false }, { text: "Socioeconomic status, education, neighborhood, employment, and access to healthcare", isCorrect: true }, { text: "Individual personality traits", isCorrect: false }, { text: "Diagnostic criteria from the DSM-5", isCorrect: false }] },
    { question: "Culturally responsive assessment requires:", options: [{ text: "Using only culture-specific assessment instruments", isCorrect: false }, { text: "Considering the cultural validity of instruments, using culturally appropriate norms, and interpreting results within cultural context", isCorrect: true }, { text: "Avoiding standardized assessment with diverse clients", isCorrect: false }, { text: "Translating instruments word-for-word into the client's language", isCorrect: false }] },
    { question: "Implicit bias in clinical practice can lead to:", options: [{ text: "More accurate diagnoses", isCorrect: false }, { text: "Differential diagnosis patterns, disparities in treatment recommendations, and impaired therapeutic alliance", isCorrect: true }, { text: "Improved cultural competence through awareness", isCorrect: false }, { text: "No measurable impact on clinical outcomes", isCorrect: false }] },
    { question: "Counselor self-awareness in multicultural practice involves:", options: [{ text: "Knowing everything about every culture", isCorrect: false }, { text: "Examining one's own cultural identity, biases, privileges, and how these affect the therapeutic relationship", isCorrect: true }, { text: "Treating all clients identically regardless of background", isCorrect: false }, { text: "Avoiding discussion of cultural differences", isCorrect: false }] },
    { question: "The concept of 'cultural encapsulation' refers to:", options: [{ text: "Immersing oneself in a client's culture", isCorrect: false }, { text: "Defining reality according to one's own cultural assumptions and failing to consider other worldviews", isCorrect: true }, { text: "Protecting cultural traditions from outside influence", isCorrect: false }, { text: "A therapeutic technique for cultural exploration", isCorrect: false }] },
  ]
},

// ── 7. A Beautiful Mind: Serious Mental Illness (1CE) ──
"A Beautiful Mind": {
  matchTitle: "A Beautiful Mind",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "Schizophrenia spectrum disorders are primarily characterized by:", options: [{ text: "Persistent low mood and anhedonia", isCorrect: false }, { text: "Disturbances in thought, perception, behavior, and affect including hallucinations and delusions", isCorrect: true }, { text: "Cycling between manic and depressive episodes", isCorrect: false }, { text: "Pervasive patterns of interpersonal instability", isCorrect: false }] },
    { question: "'Positive symptoms' of schizophrenia include:", options: [{ text: "Social withdrawal and flat affect", isCorrect: false }, { text: "Hallucinations, delusions, disorganized speech, and abnormal motor behavior", isCorrect: true }, { text: "Cognitive deficits in memory and attention", isCorrect: false }, { text: "Depressed mood and insomnia", isCorrect: false }] },
    { question: "'Negative symptoms' of schizophrenia include all EXCEPT:", options: [{ text: "Diminished emotional expression", isCorrect: false }, { text: "Avolition", isCorrect: false }, { text: "Auditory hallucinations", isCorrect: true }, { text: "Alogia", isCorrect: false }] },
    { question: "Cognitive Behavioral Therapy for Psychosis (CBTp) differs from standard CBT in that:", options: [{ text: "It does not use thought records", isCorrect: false }, { text: "It does not aim to eliminate symptoms but helps clients develop alternative interpretations and coping strategies", isCorrect: true }, { text: "It is only delivered in inpatient settings", isCorrect: false }, { text: "It focuses exclusively on medication compliance", isCorrect: false }] },
    { question: "Recovery-oriented care for serious mental illness emphasizes:", options: [{ text: "Symptom elimination as the primary goal", isCorrect: false }, { text: "Client autonomy, hope, meaningful life roles, and personal empowerment beyond symptom management", isCorrect: true }, { text: "Long-term institutional care", isCorrect: false }, { text: "Strict medication adherence above all else", isCorrect: false }] },
    { question: "The therapeutic alliance with clients experiencing psychosis requires:", options: [{ text: "Directly challenging delusional beliefs", isCorrect: false }, { text: "Validation of the client's subjective experience while gently exploring evidence and alternative perspectives", isCorrect: true }, { text: "Agreement with all of the client's perceptions", isCorrect: false }, { text: "Avoiding discussion of psychotic symptoms", isCorrect: false }] },
    { question: "Anosognosia in schizophrenia refers to:", options: [{ text: "A type of hallucination", isCorrect: false }, { text: "Lack of awareness or insight into one's own illness, which is neurologically based rather than denial", isCorrect: true }, { text: "Memory loss associated with psychosis", isCorrect: false }, { text: "Difficulty with social cognition", isCorrect: false }] },
    { question: "Cultural considerations in assessing psychosis include:", options: [{ text: "Applying the same diagnostic criteria universally without cultural context", isCorrect: false }, { text: "Recognizing that cultural and spiritual beliefs may resemble psychotic symptoms and require culturally informed assessment", isCorrect: true }, { text: "Diagnosing psychosis only in Western populations", isCorrect: false }, { text: "Ignoring cultural beliefs in favor of standardized assessment", isCorrect: false }] },
    { question: "Violence risk assessment in clients with serious mental illness should:", options: [{ text: "Assume all individuals with psychosis are dangerous", isCorrect: false }, { text: "Use structured professional judgment attending to specific risk factors without stereotyping based on diagnosis alone", isCorrect: true }, { text: "Only be conducted after a violent incident", isCorrect: false }, { text: "Be based solely on the client's diagnosis", isCorrect: false }] },
    { question: "Stigma reduction in clinical practice with serious mental illness involves:", options: [{ text: "Avoiding the diagnostic label entirely", isCorrect: false }, { text: "Using person-first language, examining personal biases, and advocating for clients within systems of care", isCorrect: true }, { text: "Referring clients with SMI to specialized settings only", isCorrect: false }, { text: "Focusing only on strengths and ignoring symptoms", isCorrect: false }] },
  ]
},

// ── 8. Black Swan: Perfectionism and Anxiety (1CE) ──
"Black Swan": {
  matchTitle: "Black Swan",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "Maladaptive perfectionism is distinguished from adaptive perfectionism by:", options: [{ text: "Higher performance standards", isCorrect: false }, { text: "Self-worth contingent on achievement, excessive self-criticism, and impairment in functioning", isCorrect: true }, { text: "Greater attention to detail", isCorrect: false }, { text: "Higher motivation levels", isCorrect: false }] },
    { question: "The Frost Multidimensional Perfectionism Scale assesses all EXCEPT:", options: [{ text: "Concern over mistakes", isCorrect: false }, { text: "Personal standards", isCorrect: false }, { text: "Therapeutic alliance quality", isCorrect: true }, { text: "Parental expectations", isCorrect: false }] },
    { question: "Perfectionism is considered 'transdiagnostic' because:", options: [{ text: "It only appears in anxiety disorders", isCorrect: false }, { text: "It cuts across multiple diagnostic categories including anxiety, depression, eating disorders, and OCD", isCorrect: true }, { text: "It is listed as a separate diagnosis in the DSM-5-TR", isCorrect: false }, { text: "It is caused by the same gene across all presentations", isCorrect: false }] },
    { question: "Cognitive restructuring for perfectionism primarily targets:", options: [{ text: "Behavioral avoidance patterns only", isCorrect: false }, { text: "All-or-nothing thinking, should statements, and catastrophizing about imperfect performance", isCorrect: true }, { text: "Early childhood memories", isCorrect: false }, { text: "Social skills deficits", isCorrect: false }] },
    { question: "Behavioral experiments in treating perfectionism involve:", options: [{ text: "Avoiding all mistakes", isCorrect: false }, { text: "Deliberately producing imperfect work to test catastrophic predictions about consequences", isCorrect: true }, { text: "Recording all errors in a journal", isCorrect: false }, { text: "Competing with others to achieve the highest standard", isCorrect: false }] },
    { question: "Perfectionism may complicate suicide risk assessment because:", options: [{ text: "Perfectionists never experience suicidal ideation", isCorrect: false }, { text: "Perfectionists may present as high-functioning while concealing distress, and perceived failure can trigger acute crisis", isCorrect: true }, { text: "Standardized assessment tools are invalid for perfectionists", isCorrect: false }, { text: "Perfectionism is protective against suicide", isCorrect: false }] },
    { question: "Self-compassion interventions for perfectionism are effective because:", options: [{ text: "They lower performance standards", isCorrect: false }, { text: "They provide an alternative to the harsh self-criticism that maintains the perfectionism cycle", isCorrect: true }, { text: "They eliminate anxiety completely", isCorrect: false }, { text: "They focus on ignoring mistakes", isCorrect: false }] },
    { question: "The relationship between perfectionism and procrastination is explained by:", options: [{ text: "Laziness masked as perfectionism", isCorrect: false }, { text: "Fear of imperfect performance leading to avoidance of the task entirely", isCorrect: true }, { text: "Lack of motivation", isCorrect: false }, { text: "Time management deficits", isCorrect: false }] },
    { question: "When perfectionism co-occurs with an eating disorder, clinical decision-making should prioritize:", options: [{ text: "Treating perfectionism first since it underlies the eating disorder", isCorrect: false }, { text: "Medical stability and nutritional rehabilitation while integrating perfectionism-focused interventions", isCorrect: true }, { text: "Ignoring the eating disorder until perfectionism resolves", isCorrect: false }, { text: "Focusing only on body image", isCorrect: false }] },
    { question: "Measurement-based care for perfectionism involves:", options: [{ text: "A single assessment at intake", isCorrect: false }, { text: "Regularly tracking perfectionism dimensions, related distress, and functional outcomes using validated measures", isCorrect: true }, { text: "Only clinician observation", isCorrect: false }, { text: "Client self-report without standardized tools", isCorrect: false }] },
  ]
},

// ── 9. Ordinary People: Family Systems and Grief (1CE) ──
"Ordinary People": {
  matchTitle: "Ordinary People",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "In family systems theory, 'differentiation of self' refers to:", options: [{ text: "Physical separation from the family of origin", isCorrect: false }, { text: "The ability to maintain one's sense of self while remaining emotionally connected to the family system", isCorrect: true }, { text: "Refusing to participate in family therapy", isCorrect: false }, { text: "Developing an independent career", isCorrect: false }] },
    { question: "Triangulation in family systems occurs when:", options: [{ text: "Three family members agree on a course of action", isCorrect: false }, { text: "A two-person relationship draws in a third person to manage tension or anxiety", isCorrect: true }, { text: "Family members form three distinct subgroups", isCorrect: false }, { text: "The therapist joins the family system", isCorrect: false }] },
    { question: "Family homeostasis in the context of grief means:", options: [{ text: "The family quickly returns to normal functioning", isCorrect: false }, { text: "The family system's tendency to maintain its existing patterns, which can resist the changes grief requires", isCorrect: true }, { text: "All family members grieve in the same way", isCorrect: false }, { text: "The family avoids discussing the loss", isCorrect: false }] },
    { question: "Prolonged Grief Disorder (DSM-5-TR) requires symptoms persisting beyond:", options: [{ text: "One month after the loss", isCorrect: false }, { text: "Twelve months in adults (six months in children)", isCorrect: true }, { text: "Six months in all populations", isCorrect: false }, { text: "Two years after the loss", isCorrect: false }] },
    { question: "When one family member's grief is 'disenfranchised,' it means:", options: [{ text: "They are not allowed to attend the funeral", isCorrect: false }, { text: "Their grief is not acknowledged, validated, or socially sanctioned by others", isCorrect: true }, { text: "They do not experience grief", isCorrect: false }, { text: "They grieve faster than other family members", isCorrect: false }] },
    { question: "The 'identified patient' in a grieving family often:", options: [{ text: "Is the healthiest member of the system", isCorrect: false }, { text: "Carries the family's unexpressed grief or dysfunction through symptom presentation", isCorrect: true }, { text: "Is always the person who is closest to the deceased", isCorrect: false }, { text: "Voluntarily takes on the grief of others", isCorrect: false }] },
    { question: "Attachment theory informs grief work by suggesting that:", options: [{ text: "Securely attached individuals do not grieve", isCorrect: false }, { text: "Attachment patterns influence how individuals process loss, with insecure attachment linked to complicated grief", isCorrect: true }, { text: "All grief reactions are attachment disorders", isCorrect: false }, { text: "Only avoidant individuals experience prolonged grief", isCorrect: false }] },
    { question: "Family-focused grief therapy (FFGT) addresses:", options: [{ text: "Only the individual most affected by the loss", isCorrect: false }, { text: "Family communication, cohesion, and conflict resolution in the context of shared loss", isCorrect: true }, { text: "Estate and financial planning after death", isCorrect: false }, { text: "Only children in the family system", isCorrect: false }] },
    { question: "When family members are at different stages of grief, the therapist should:", options: [{ text: "Push slower-grieving members to catch up", isCorrect: false }, { text: "Normalize different grief timelines, facilitate understanding, and help the family hold space for multiple grief experiences", isCorrect: true }, { text: "See each family member individually only", isCorrect: false }, { text: "Focus only on the most distressed member", isCorrect: false }] },
    { question: "Cultural considerations in family grief include:", options: [{ text: "Applying the same grief model to all families", isCorrect: false }, { text: "Recognizing that cultural norms shape mourning rituals, emotional expression, family roles in grief, and beliefs about death", isCorrect: true }, { text: "Avoiding discussion of cultural practices in therapy", isCorrect: false }, { text: "Assuming Western grief models are universal", isCorrect: false }] },
  ]
},

// ── 10. The Sixth Sense: Clinical Intuition (1CE) ──
"The Sixth Sense": {
  matchTitle: "The Sixth Sense",
  passThreshold: 0.80,
  maxAttempts: 3,
  questions: [
    { question: "Clinical intuition is BEST defined as:", options: [{ text: "A psychic ability some clinicians possess", isCorrect: false }, { text: "Rapid, non-conscious pattern recognition developed through clinical experience and deliberate practice", isCorrect: true }, { text: "The opposite of evidence-based practice", isCorrect: false }, { text: "A gut feeling that should override assessment data", isCorrect: false }] },
    { question: "Dual-process theory distinguishes between:", options: [{ text: "Inpatient and outpatient treatment", isCorrect: false }, { text: "System 1 (fast, intuitive) and System 2 (slow, deliberative) thinking processes", isCorrect: true }, { text: "Client and therapist perspectives", isCorrect: false }, { text: "Quantitative and qualitative assessment", isCorrect: false }] },
    { question: "Confirmation bias in clinical judgment refers to:", options: [{ text: "Confirming a client's diagnosis with collateral information", isCorrect: false }, { text: "The tendency to seek, interpret, and remember information that confirms pre-existing beliefs while ignoring contradictory evidence", isCorrect: true }, { text: "Asking clients to confirm their symptoms", isCorrect: false }, { text: "Using multiple assessment tools to confirm a diagnosis", isCorrect: false }] },
    { question: "The anchoring heuristic in clinical assessment leads clinicians to:", options: [{ text: "Use grounding techniques in session", isCorrect: false }, { text: "Over-rely on initial impressions or the first piece of information when making subsequent judgments", isCorrect: true }, { text: "Anchor treatment plans to evidence-based protocols", isCorrect: false }, { text: "Create stable therapeutic relationships", isCorrect: false }] },
    { question: "Structured clinical judgment combines:", options: [{ text: "Only actuarial data and algorithms", isCorrect: false }, { text: "Clinical experience and intuition with standardized assessment tools and empirical guidelines", isCorrect: true }, { text: "Client preference with insurance requirements", isCorrect: false }, { text: "Supervision feedback with peer consultation", isCorrect: false }] },
    { question: "Clinical intuition is MOST reliable when:", options: [{ text: "The clinician has strong personal opinions about the case", isCorrect: false }, { text: "It is developed through extensive experience, regular feedback, and reflective practice in a predictable clinical domain", isCorrect: true }, { text: "The clinician ignores contradictory data", isCorrect: false }, { text: "Time pressure requires rapid decisions", isCorrect: false }] },
    { question: "When intuition and systematic assessment conflict, the clinician should:", options: [{ text: "Always trust intuition over data", isCorrect: false }, { text: "Explore the discrepancy, seek additional data, consult colleagues, and document the decision-making process", isCorrect: true }, { text: "Always defer to the assessment tools", isCorrect: false }, { text: "Ignore both and seek a new assessment", isCorrect: false }] },
    { question: "Reflective practice supports clinical intuition development by:", options: [{ text: "Replacing the need for formal training", isCorrect: false }, { text: "Making implicit knowledge explicit, identifying patterns, and facilitating learning from both successes and errors", isCorrect: true }, { text: "Eliminating all cognitive biases", isCorrect: false }, { text: "Reducing caseload demands", isCorrect: false }] },
    { question: "Routine outcome monitoring (ROM) augments clinical intuition by:", options: [{ text: "Replacing clinical judgment entirely", isCorrect: false }, { text: "Providing objective data on client progress that can confirm or challenge clinical impressions", isCorrect: true }, { text: "Increasing session frequency", isCorrect: false }, { text: "Measuring only symptom severity", isCorrect: false }] },
    { question: "The availability heuristic leads clinicians to:", options: [{ text: "Overestimate the probability of events that are easily recalled, such as dramatic or recent cases", isCorrect: true }, { text: "Always make the most accurate clinical judgment", isCorrect: false }, { text: "Seek out diverse clinical experiences", isCorrect: false }, { text: "Use multiple data sources for assessment", isCorrect: false }] },
  ]
},

};

// ============================================================
// MAIN: Apply assessments to courses in DB
// ============================================================

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  ADD ASSESSMENTS TO COURSES');
  console.log('═'.repeat(60));
  
  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const Course = mongoose.connection.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

  let updated = 0, notFound = 0;

  for (const [name, data] of Object.entries(ASSESSMENTS)) {
    const regex = new RegExp(data.matchTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const existing = await Course.findOne({ title: regex });
    
    if (!existing) {
      console.log(`  ❌ Not found: "${data.matchTitle}"`);
      notFound++;
      continue;
    }

    const assessment = {
      questions: data.questions.map(q => ({
        ...q,
        type: 'multiple-choice'
      })),
      passThreshold: data.passThreshold,
      maxAttempts: data.maxAttempts
    };

    await Course.updateOne(
      { _id: existing._id },
      { $set: { assessment } }
    );

    console.log(`  ✅ ${existing.title.substring(0, 55)}`);
    console.log(`     ${data.questions.length} questions added\n`);
    updated++;
  }

  console.log('═'.repeat(60));
  console.log(`  Updated: ${updated} | Not found: ${notFound}`);
  console.log('═'.repeat(60));

  await mongoose.disconnect();
  console.log('\n✅ Done.\n');
}

main().catch(err => { console.error('❌', err); process.exit(1); });
