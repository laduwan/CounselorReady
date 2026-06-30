import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = 'cr-cli-608-clinical-assessment-diagnosis-structured-interviewing';

const COURSE = {
  title: 'Clinical Assessment and Diagnosis: Structured Interviewing Skills',
  slug: SLUG,
  courseCode: 'CR-CLI-608',
  description: 'This course provides licensed mental health professionals with evidence-based training in clinical assessment and diagnostic interviewing. Participants will learn structured and semi-structured interviewing approaches, validated screening tools, and the skills needed to formulate accurate diagnoses using the DSM-5-TR. Special attention is paid to cultural considerations in assessment, differential diagnosis, and common errors in clinical judgment that affect diagnostic accuracy.',
  shortDescription: 'Develop structured interviewing skills, evidence-based screening tools, and diagnostic accuracy for DSM-5-TR clinical assessment in mental health practice.',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  prerequisites: 'Graduate-level training in psychopathology. Working knowledge of DSM-5 diagnostic criteria helpful.',
  learningObjectives: [
    'Describe the components of a comprehensive clinical assessment and their functions',
    'Apply structured and semi-structured interviewing techniques to improve diagnostic accuracy',
    'Select and interpret validated screening tools appropriate to common clinical presentations',
    'Demonstrate awareness of cultural and contextual factors that affect clinical assessment',
    'Identify common diagnostic errors and apply strategies to mitigate cognitive biases in clinical reasoning',
    'Formulate a differential diagnosis using DSM-5-TR criteria for common presenting concerns'
  ],
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC'
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC'
  },
  approvals: [{
    body: 'NBCC',
    number: '#7760',
    hourBreakdown: [{ label: 'core', hours: 2 }]
  }],
  isPublished: false,
  status: 'draft',
  sections: [
    {
      title: 'Introduction: Foundations of Clinical Assessment',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Clinical Assessment and Diagnosis',
          subtitle: 'Structured interviewing skills for accurate, culturally responsive clinical evaluation'
        },
        {
          type: 'text',
          content: `<h2>Why Assessment Matters</h2>
<p>Clinical assessment is the foundation of all effective mental health treatment. Accurate assessment shapes diagnosis, which shapes treatment selection; and the quality of the initial assessment shapes the therapeutic relationship, the treatment plan, and ultimately the client's outcomes. Yet clinical assessment training is often among the most inconsistently delivered components of graduate preparation — and once in practice, clinicians rarely receive direct feedback on assessment accuracy.</p>
<p>The consequences of poor assessment are real and significant: missed diagnoses mean clients don't receive effective treatments; over-diagnoses or misdiagnoses lead to inappropriate treatment and possible harm; inadequate assessment of risk may contribute to adverse outcomes; and assessment that is culturally uninformed may systematically disadvantage clients from marginalized communities.</p>
<p>This course addresses clinical assessment and diagnostic interviewing from an evidence-based perspective. We focus on what actually improves diagnostic accuracy: structured and semi-structured interviewing approaches, validated screening tools, awareness of cultural context, and strategies for reducing cognitive biases that distort clinical reasoning.</p>`
        },
        {
          type: 'text',
          content: `<h2>Components of a Comprehensive Clinical Assessment</h2>
<p>A comprehensive clinical assessment integrates multiple sources of information into a coherent clinical picture. The components vary by setting and purpose, but a thorough intake assessment typically includes:</p>
<p><strong>1. Chief complaint and presenting concern:</strong> In the client's own words — what brings them here, what they're experiencing, and what they hope to gain from treatment. The language clients use to describe their distress often carries important cultural, contextual, and meaning-related information that structured questioning can miss.</p>
<p><strong>2. History of the present illness (HPI):</strong> Onset, duration, frequency, severity, and trajectory of the presenting symptoms. What makes it better? Worse? What has the client already tried? The HPI establishes the temporal course that informs differential diagnosis — a sudden onset of depression in a 50-year-old with no prior psychiatric history, for example, has a very different differential than a third depressive episode in a 30-year-old with childhood-onset symptoms.</p>
<p><strong>3. Psychiatric history:</strong> Prior diagnoses, hospitalizations, treatments (pharmacological and psychotherapeutic), and their outcomes. Prior treatment response is one of the strongest predictors of future treatment response.</p>
<p><strong>4. Medical history:</strong> Physical health conditions that may cause, mimic, or complicate psychiatric presentations. Hypothyroidism can cause depression; hyperthyroidism can mimic anxiety; neurological conditions may present with psychiatric symptoms. The DSM-5-TR requires ruling out medical causes as a prerequisite for primary psychiatric diagnosis.</p>
<p><strong>5. Substance use history:</strong> Past and current use of alcohol, illicit substances, cannabis, and prescribed medications with abuse potential. Substance use can cause, exacerbate, or mimic virtually every psychiatric condition. Duration, quantity, frequency, and impact on functioning should be systematically assessed.</p>
<p><strong>6. Family history:</strong> First-degree relatives' psychiatric and medical history. Family history is the strongest single predictor of psychiatric illness and influences differential diagnosis, risk assessment, and psychoeducation.</p>
<p><strong>7. Social history and current functioning:</strong> Developmental history, trauma history, educational and occupational history, relationships and social support, cultural identity and context, financial stability, legal history, and current daily functioning. The social history contextualizes symptoms within a person's full life.</p>
<p><strong>8. Mental status examination (MSE):</strong> A structured clinical observation of the client's current psychological functioning across multiple domains (appearance, behavior, speech, mood, affect, thought process and content, cognition, insight, and judgment). The MSE documents what the clinician directly observes in the interview, not what the client reports.</p>
<p><strong>9. Risk assessment:</strong> Systematic evaluation of suicidal ideation, homicidal ideation, history of self-harm, and current risk factors. Risk assessment is a professional obligation, not optional — and it should be documented regardless of the outcome.</p>`
        },
        {
          type: 'text',
          content: `<h2>The Mental Status Examination: What to Assess and Why</h2>
<p>The Mental Status Examination (MSE) is the clinical equivalent of the physical examination — a systematic observation of current psychological functioning. Unlike the history (which is retrospective), the MSE documents what is directly observable in the interview. Each domain contributes to the clinical picture:</p>
<p><strong>Appearance and behavior:</strong> How does the client look? How do they carry themselves? Dress, grooming, eye contact, psychomotor activity (agitation or retardation), gait. An unkempt appearance in a previously well-groomed client may signal depression, substance use, or cognitive decline.</p>
<p><strong>Speech:</strong> Rate, volume, rhythm, fluency. Pressured speech suggests mania or anxiety; poverty of speech suggests depression or psychosis; tangential or circumstantial speech suggests thought disorder.</p>
<p><strong>Mood:</strong> The client's subjective report of their internal emotional state. "How are you feeling?" "How has your mood been?" Document in the client's own words: "depressed," "anxious," "numb."</p>
<p><strong>Affect:</strong> The clinician's objective observation of the client's emotional expression — range (broad to flat), intensity (appropriate to blunted), congruence with stated mood, and lability. A client who reports feeling fine but shows flat affect and restricted range demonstrates affective incongruence worth noting.</p>
<p><strong>Thought process:</strong> How the client thinks — logic, organization, and coherence of thought. Is the client linear and goal-directed? Tangential? Circumstantial? Loosely associated? Flight of ideas? Blocking?</p>
<p><strong>Thought content:</strong> What the client thinks about — preoccupations, obsessions, delusions, suicidal or homicidal ideation. Delusions should be documented specifically (grandiose, persecutory, referential, somatic) and must be distinguished from culturally-specific beliefs.</p>
<p><strong>Perceptual disturbances:</strong> Hallucinations (auditory, visual, tactile, olfactory) and illusions. Document the specific nature, frequency, and the client's relationship to them (do they believe the voices are real?).</p>
<p><strong>Cognition:</strong> Gross assessment of orientation, attention, memory, and abstraction. Brief cognitive screening (MMSE, MoCA) may be indicated when cognitive impairment is suspected.</p>
<p><strong>Insight:</strong> Does the client understand they have a mental health condition? Do they recognize that their symptoms are symptoms? Insight exists on a continuum and affects treatment planning and prognosis.</p>
<p><strong>Judgment:</strong> How does the client make decisions? Do they consider consequences? Can they weigh alternatives? Impaired judgment significantly affects safety risk and treatment planning.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Assessment Foundations',
          takeaways: [
            'Comprehensive assessment integrates presenting concern, HPI, psychiatric/medical/substance use history, family history, social history, MSE, and risk assessment',
            'The MSE documents what the clinician directly observes (not what the client reports) across appearance, speech, mood, affect, thought process/content, perception, cognition, insight, and judgment',
            'Mood is what the client reports; affect is what the clinician observes — they may differ significantly',
            'Thought process (how) and thought content (what) are distinct MSE domains requiring separate assessment',
            'Family psychiatric history is the strongest single predictor of psychiatric illness and shapes differential diagnosis',
            'The DSM-5-TR requires ruling out medical causes before primary psychiatric diagnosis — medical history is not optional'
          ]
        },
        {
          type: 'multipleChoice',
          question: 'In the Mental Status Examination, which domain represents the clinician\'s objective observation of the client\'s emotional expression (as opposed to the client\'s subjective report)?',
          options: [
            { text: 'Mood', isCorrect: false },
            { text: 'Affect', isCorrect: true },
            { text: 'Thought content', isCorrect: false },
            { text: 'Insight', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Affect is the clinician\'s objective observation of the client\'s emotional expression — range, intensity, congruence, and lability. Mood is the client\'s subjective report ("I\'ve been depressed"). They may differ significantly (a client may report feeling fine but show flat, restricted affect).'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are components of a comprehensive clinical assessment? Select all that apply.',
          options: [
            { text: 'History of the present illness (HPI)', isCorrect: true },
            { text: 'Mental Status Examination (MSE)', isCorrect: true },
            { text: 'Treatment outcome prediction score', isCorrect: false },
            { text: 'Risk assessment', isCorrect: true },
            { text: 'Substance use history', isCorrect: true }
          ],
          explanation: 'A comprehensive clinical assessment includes the HPI, MSE, risk assessment, substance use history, psychiatric history, medical history, family history, and social history. There is no standard "treatment outcome prediction score" as a routine component of clinical assessment.'
        }
      ]
    },
    {
      title: 'Structured Interviewing and Validated Tools',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Structured Interviewing and Screening Tools',
          subtitle: 'Evidence-based approaches to improving diagnostic accuracy'
        },
        {
          type: 'text',
          content: `<h2>Why Structure Matters: Unstructured vs. Structured Interviews</h2>
<p>The unstructured clinical interview — driven entirely by the clinician's intuition and judgment about what to ask — has significant reliability and validity limitations. Research consistently shows that without structure, clinicians:</p>
<ul>
<li>Inconsistently cover diagnostic domains (one clinician may ask about mania, another may not)</li>
<li>Ask leading questions that shape client responses</li>
<li>Reach diagnostic conclusions too early (anchoring bias) and fail to consider alternatives</li>
<li>Underassess conditions they're less familiar or comfortable with</li>
<li>Overweight information that is vivid, recent, or emotionally salient</li>
</ul>
<p>Structured and semi-structured interviews improve diagnostic reliability — the likelihood that two clinicians evaluating the same client will reach the same diagnosis — and validity — the likelihood that the diagnosis accurately reflects the client's condition.</p>
<p><strong>Fully structured interviews</strong> (e.g., CIDI — Composite International Diagnostic Interview; DISC — Diagnostic Interview Schedule for Children) specify exact questions and a scripted format. They are high in reliability and are the gold standard for research, but are time-intensive and require specific training. Their highly scripted nature can feel mechanical in clinical settings.</p>
<p><strong>Semi-structured interviews</strong> (e.g., SCID-5 — Structured Clinical Interview for DSM-5; K-SADS; MINI) provide specific probe questions and decision trees but allow clinician flexibility in follow-up questioning. They represent the best balance of reliability and clinical applicability and are the most used in clinical practice and research.</p>
<p><strong>Systematic symptom review</strong> — a clinical approach using a structured checklist to systematically cover all major diagnostic domains — is a practical middle ground accessible to all clinicians without formal structured interview training. It ensures that depression, mania, anxiety, psychosis, trauma, substance use, and other domains are covered in every intake, regardless of the presenting complaint.</p>`
        },
        {
          type: 'text',
          content: `<h2>Validated Screening Tools: The Essential Toolkit</h2>
<p>Validated screening tools — brief, psychometrically tested instruments — extend clinical assessment efficiency and accuracy. They are not diagnostic instruments (a positive screen requires follow-up clinical evaluation, not an automatic diagnosis), but they are invaluable for systematic symptom detection.</p>
<p><strong>Depression:</strong></p>
<ul>
<li><em>PHQ-9 (Patient Health Questionnaire-9):</em> 9-item, self-report; maps to DSM-5 MDD criteria; ≥10 = moderate depression. Widely used, free, validated across many populations. The most commonly used depression screen in primary care and mental health settings.</li>
<li><em>PHQ-2:</em> 2-item ultra-brief version; sensitivity 0.83, specificity 0.92 for MDD at a cut of ≥3. Excellent for initial screening; positives should proceed to PHQ-9.</li>
<li><em>Edinburgh Postnatal Depression Scale (EPDS):</em> Validated specifically for perinatal populations; includes anxiety items; preferred over PHQ-9 in obstetric settings.</li>
</ul>
<p><strong>Anxiety:</strong></p>
<ul>
<li><em>GAD-7 (Generalized Anxiety Disorder-7):</em> 7-item self-report; ≥10 = moderate anxiety. Validated for GAD but also performs well as a general anxiety screen. Often paired with PHQ-9 for brief mental health screening.</li>
<li><em>GAD-2:</em> 2-item version; ≥3 = positive screen.</li>
<li><em>PDSS (Panic Disorder Severity Scale):</em> Specific to panic disorder.</li>
</ul>
<p><strong>PTSD:</strong></p>
<ul>
<li><em>PCL-5 (PTSD Checklist for DSM-5):</em> 20-item self-report; maps to DSM-5 PTSD criteria. Used both for screening (score ≥31–33) and for session-by-session progress monitoring in CPT and PE.</li>
<li><em>Primary Care PTSD Screen for DSM-5 (PC-PTSD-5):</em> 5-item ultra-brief; first item (trauma exposure) gates the rest; ≥3 = positive screen.</li>
</ul>
<p><strong>Alcohol and substance use:</strong></p>
<ul>
<li><em>AUDIT (Alcohol Use Disorders Identification Test):</em> 10-item; AUDIT-C (3 items) for brief screening. WHO-recommended; validated across populations.</li>
<li><em>CAGE:</em> 4 questions; ≥2 positives = significant risk. Less sensitive than AUDIT for hazardous use but quick and memorable.</li>
<li><em>DAST-10 (Drug Abuse Screening Test):</em> 10-item; ≥3 = problematic use.</li>
</ul>
<p><strong>Psychosis:</strong></p>
<ul>
<li><em>PRIME Screen / Prodromal Questionnaire (PQ-B):</em> For at-risk populations; screens for prodromal/attenuated psychosis symptoms.</li>
</ul>
<p><strong>Cognitive screening:</strong></p>
<ul>
<li><em>MoCA (Montreal Cognitive Assessment):</em> 10-minute; max 30 points; <26 = mild cognitive impairment. More sensitive than MMSE for early dementia and MCI. Free for clinical use (registration required).</li>
<li><em>MMSE (Mini-Mental State Examination):</em> Widely used but proprietary; less sensitive than MoCA for early impairment.</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>Differential Diagnosis: The Clinical Reasoning Process</h2>
<p>Differential diagnosis is the systematic process of identifying and weighing all possible diagnoses that could explain a client's presentation, then narrowing to the most likely and ruling out the most dangerous.</p>
<p><strong>The differential diagnosis framework:</strong></p>
<p><em>Step 1: Generate a comprehensive differential.</em> Resist the pull toward the first diagnosis that fits. What else could this be? Clinicians routinely generate inadequate differentials — research shows that the correct diagnosis is on the initial differential list in only about 85% of cases, and the final diagnostic error rate in medicine is 10–15%.</p>
<p><em>Step 2: Rule out medical causes first.</em> The DSM-5-TR requires excluding medical etiologies before making primary psychiatric diagnoses. Hypothyroidism, Vitamin B12 deficiency, anemia, sleep apnea, neurological conditions, and many medications can cause or mimic psychiatric symptoms.</p>
<p><em>Step 3: Rule out substance-induced conditions.</em> Substances and withdrawal can cause virtually every psychiatric presentation. A new-onset psychotic episode in a 22-year-old requires substance screen before primary psychotic disorder diagnosis.</p>
<p><em>Step 4: Apply diagnostic criteria systematically.</em> Use the DSM-5-TR criteria, not rough symptom gestalt. Criterion A (symptoms), Criterion B (duration), Criterion C (impairment), exclusion criteria — each must be addressed for each condition on the differential.</p>
<p><em>Step 5: Weight the evidence.</em> Which diagnosis best explains all the available information? Which is most consistent with the client's history, MSE, and collateral information? What would change your mind?</p>
<p><em>Step 6: Consider co-occurring conditions.</em> Psychiatric conditions commonly co-occur. The presence of one diagnosis does not exclude others. Depression and anxiety co-occur in 50% of cases; PTSD and SUD co-occur in 50–80% of veteran populations; personality disorders co-occur with Axis I conditions in 30–60% of cases.</p>
<p><em>Step 7: Diagnose the least severe condition that explains the presentation.</em> Occam's razor applies to clinical diagnosis: don't multiply diagnoses unnecessarily, and don't assign more severe diagnoses when less severe ones adequately explain the presentation.</p>`
        },
        {
          type: 'sequencing',
          instructions: 'Place the following steps of the differential diagnosis process in the correct order from first to last.',
          steps: [
            { text: 'Generate a comprehensive differential — list all possible explanations for the presentation', order: 1 },
            { text: 'Rule out medical causes for the presenting symptoms', order: 2 },
            { text: 'Rule out substance-induced or substance-withdrawal causes', order: 3 },
            { text: 'Apply DSM-5-TR diagnostic criteria systematically to remaining possibilities', order: 4 },
            { text: 'Consider co-occurring conditions alongside the primary diagnosis', order: 5 },
            { text: 'Diagnose the least severe condition that adequately explains the full presentation', order: 6 }
          ],
          explanation: 'The differential diagnosis process moves systematically from broad to specific: first generate all possibilities, then rule out medical and substance causes (as DSM-5-TR requires), then apply formal diagnostic criteria, consider co-occurrence, and apply the parsimony principle to arrive at the most accurate, least severe explanation.'
        },
        {
          type: 'text',
          content: `<h2>Common Clinical Assessment Errors</h2>
<p>Clinical reasoning is vulnerable to well-documented cognitive biases that reduce diagnostic accuracy. Awareness of these biases is the first step toward mitigating them.</p>
<p><strong>Anchoring bias:</strong> Locking onto the first diagnosis that fits and failing to adequately consider alternatives. A client who presents with depression may have bipolar disorder; a client who seems anxious may have ADHD; a client who presents with "relationship problems" may have undiagnosed PTSD. Anchoring is counteracted by generating a comprehensive differential before committing to a diagnosis.</p>
<p><strong>Confirmation bias:</strong> Seeking information that confirms the initial hypothesis while ignoring disconfirming evidence. Once the clinician suspects bipolar disorder, they attend to mood episodes and minimize the PTSD history that might better explain the presentation.</p>
<p><strong>Availability heuristic:</strong> Overweighting diagnoses that are most familiar or most recently encountered. A clinician who just attended a training on borderline personality disorder may see BPD in every client with emotional dysregulation for the next month.</p>
<p><strong>Premature closure:</strong> Stopping the diagnostic process as soon as a plausible diagnosis is found, without adequately examining the full differential. Common in high-caseload settings where time pressure discourages thorough assessment.</p>
<p><strong>Framing effects:</strong> The way a referral or record is framed influences what the clinician attends to. A client referred as "treatment-resistant depression" may not receive adequate assessment for bipolar disorder, ADHD, or undiagnosed SUD — conditions that could explain "treatment resistance" better than chronicity of depression.</p>
<p><strong>Countertransference-driven diagnostic errors:</strong> A clinician who finds a client particularly sympathetic may underdiagnose concerning personality features; a clinician who finds a client irritating may overdiagnose personality pathology. Supervision and peer consultation are the primary safeguards against this type of error.</p>
<p><strong>Neglecting base rates:</strong> Rare diagnoses should not be diagnosed without compelling evidence, regardless of clinical salience. Bipolar I disorder affects 1% of the population; MDD affects 7–10%. A client with emotional instability is more likely to have anxiety or PTSD than bipolar disorder or BPD.</p>`
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each validated screening tool to the condition or domain it is primarily designed to assess.',
          matchingPairs: [
            { term: 'PHQ-9', definition: 'Depression — maps to DSM-5 MDD criteria; ≥10 = moderate depression' },
            { term: 'GAD-7', definition: 'Generalized anxiety — ≥10 = moderate anxiety; also useful as general anxiety screen' },
            { term: 'PCL-5', definition: 'PTSD — maps to DSM-5 criteria; used for screening and treatment progress monitoring' },
            { term: 'AUDIT', definition: 'Alcohol use disorders — WHO-recommended; 10-item; AUDIT-C is brief 3-item version' },
            { term: 'MoCA', definition: 'Cognitive impairment screening — more sensitive than MMSE for mild impairment' },
            { term: 'CAGE', definition: 'Alcohol use — 4 questions; ≥2 positive responses suggests significant alcohol risk' }
          ]
        },
        {
          type: 'multipleChoice',
          question: 'A clinician refers to their intake assessment notes and diagnoses the new client with "major depressive disorder" based on the referring counselor\'s previous notes before completing the full assessment. This error is best described as:',
          options: [
            { text: 'Availability heuristic', isCorrect: false },
            { text: 'Anchoring bias driven by framing effects', isCorrect: true },
            { text: 'Countertransference-driven diagnostic error', isCorrect: false },
            { text: 'Premature closure without adequate assessment', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'This scenario combines two related biases: anchoring (committing to the prior diagnosis before completing assessment) and framing effects (the previous diagnosis frames what the clinician attends to). Together, they lead to under-consideration of alternative explanations before full assessment is complete.'
        },
        {
          type: 'multipleChoice',
          question: 'A clinician assesses a client who presents with depression and finds elevated PHQ-9 scores. Before diagnosing MDD, which condition must be ruled out according to DSM-5-TR requirements?',
          options: [
            { text: 'Bipolar disorder', isCorrect: false },
            { text: 'Persistent depressive disorder (dysthymia)', isCorrect: false },
            { text: 'Medical conditions that could cause depressive symptoms', isCorrect: true },
            { text: 'Grief reaction to recent loss', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'DSM-5-TR requires ruling out that a psychiatric presentation is better explained by medical conditions or substance effects before assigning a primary psychiatric diagnosis. Hypothyroidism, anemia, vitamin deficiencies, and many medications can cause depressive symptoms indistinguishable from MDD without medical workup.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following represent cognitive biases that reduce diagnostic accuracy in clinical assessment? Select all that apply.',
          options: [
            { text: 'Anchoring bias', isCorrect: true },
            { text: 'Structured interviewing', isCorrect: false },
            { text: 'Confirmation bias', isCorrect: true },
            { text: 'Premature closure', isCorrect: true },
            { text: 'Systematic symptom review', isCorrect: false }
          ],
          explanation: 'Anchoring bias, confirmation bias, and premature closure are all cognitive biases that reduce diagnostic accuracy. Structured interviewing and systematic symptom review are evidence-based practices that counteract these biases rather than contributing to them.'
        }
      ]
    },
    {
      title: 'Cultural Considerations, Risk Assessment, and Putting It Together',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Cultural Assessment, Risk Evaluation, and Diagnostic Formulation',
          subtitle: 'Culturally responsive practice, suicide risk, and integrating assessment into treatment'
        },
        {
          type: 'text',
          content: `<h2>Cultural Considerations in Clinical Assessment</h2>
<p>Cultural context profoundly affects how symptoms are experienced, expressed, and reported — and how clinical assessment is received. Clinicians who do not actively incorporate cultural considerations into assessment systematically disadvantage clients from non-dominant cultural backgrounds and risk diagnostic error.</p>
<p><strong>The DSM-5-TR Cultural Formulation Interview (CFI):</strong> The DSM-5-TR includes a validated, 16-item Cultural Formulation Interview designed to elicit cultural information relevant to assessment. It explores:</p>
<ul>
<li>Cultural definition of the problem (how the client and their community understand what's happening)</li>
<li>Cultural perceptions of cause, context, and support</li>
<li>Cultural factors affecting self-coping and help-seeking</li>
<li>Cultural elements of the clinician-client relationship</li>
</ul>
<p>The CFI is not a replacement for the full assessment — it is a supplement that enriches it. It should be used flexibly, not scripted robotically.</p>
<p><strong>Cultural idioms of distress:</strong> The DSM-5-TR Glossary of Cultural Concepts of Distress documents culture-specific expressions of distress that may not map neatly onto DSM categories. Examples include:</p>
<ul>
<li><em>Ataque de nervios:</em> Common in Latin American and Caribbean populations; involves intense emotional expression including shouting, crying, trembling, and dissociative experiences; may co-occur with mood, anxiety, or dissociative disorders but is not equivalent to any</li>
<li><em>Khyal cap (wind attacks):</em> Common in Cambodian populations; involves dizziness, palpitations, and neck soreness attributed to wind; may present similarly to panic disorder</li>
<li><em>Taijin kyofusho:</em> Japanese cultural syndrome involving fear of offending others through one's appearance or behavior; may present similarly to social anxiety disorder but with a distinctly other-oriented focus</li>
</ul>
<p>Knowledge of cultural idioms prevents misdiagnosis and improves therapeutic alliance by demonstrating cultural respect and fluency.</p>`
        },
        {
          type: 'text',
          content: `<h2>Cultural Biases in Diagnosis: Known Disparities</h2>
<p>Research consistently documents racial and ethnic disparities in diagnostic practice that reflect systemic biases rather than true differences in prevalence:</p>
<p><strong>Overdiagnosis of schizophrenia in Black Americans:</strong> Black Americans are 3–4 times more likely to receive a schizophrenia diagnosis than white Americans with equivalent symptom presentations. This disparity persists even after controlling for socioeconomic factors and reflects both clinician bias and misinterpretation of cultural expression as pathological. Clinicians should be alert to confirming this pattern.</p>
<p><strong>Underdiagnosis of bipolar disorder in Black and Latino populations:</strong> Cultural expression of mania (perceived as aggression or acting out rather than elevated mood) may contribute to underdiagnosis. Clinicians should apply standardized criteria carefully across all populations.</p>
<p><strong>Underdiagnosis of ADHD in girls and women:</strong> ADHD presentations in girls and women more commonly involve inattentive (rather than hyperactive-impulsive) features, which are less behaviorally visible and less likely to prompt referral or evaluation. Clinicians serving adult women should maintain a low threshold for ADHD assessment.</p>
<p><strong>Overdiagnosis of antisocial personality disorder in justice-involved populations:</strong> Behaviors developed as adaptive responses to hostile or oppressive environments may be misattributed to personality pathology. Context and trauma history are essential to accurate personality assessment.</p>
<p><strong>What reduces bias:</strong> Structured diagnostic criteria applied uniformly, cultural consultation, supervision, peer review, and ongoing self-examination of diagnostic patterns. Clinicians should periodically audit their diagnostic distribution for patterns that might reflect bias rather than case characteristics.</p>`
        },
        {
          type: 'text',
          content: `<h2>Suicide Risk Assessment: Structured Approaches</h2>
<p>Suicide risk assessment is a component of every intake and periodic reassessment. It is not a prediction instrument — no assessment tool accurately predicts individual suicidal behavior. It is a clinical process of identifying risk factors, protective factors, and current ideation in order to make clinical decisions about level of care, safety planning, and treatment intensity.</p>
<p><strong>Structured Professional Judgment (SPJ):</strong> The recommended approach combines structured risk factor assessment with clinical judgment. It avoids both extremes: the actuarial approach (applying statistical weights to produce a numerical risk score) and the purely intuitive approach (relying on gut feelings without systematic assessment).</p>
<p><strong>Key risk domains to assess:</strong></p>
<ul>
<li><em>Suicidal ideation:</em> Frequency, intensity, duration, controllability</li>
<li><em>Plan:</em> Does the client have a specific plan? How detailed? How lethal?</li>
<li><em>Intent:</em> Does the client intend to act on their plan?</li>
<li><em>Access to means:</em> Especially firearms — access to lethal means significantly elevates risk</li>
<li><em>History of attempts:</em> Prior attempts are the strongest predictor of future suicidal behavior</li>
<li><em>Precipitants:</em> Recent loss, humiliation, relationship rupture, legal trouble</li>
<li><em>Protective factors:</em> Reasons for living, social support, religious beliefs, children at home, future orientation</li>
<li><em>Capacity for safety planning:</em> Can the client identify warning signs, coping strategies, and people to contact?</li>
</ul>
<p><strong>Validated tools for suicide risk assessment:</strong></p>
<ul>
<li><em>Columbia Suicide Severity Rating Scale (C-SSRS):</em> Widely used; structured interview format; distinguishes passive ideation from active ideation with plan and intent; free for clinical use</li>
<li><em>PHQ-9 Item 9:</em> "How often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?" — a brief screen but not a full risk assessment</li>
<li><em>SAD PERSONS:</em> Mnemonic-based checklist; not empirically validated for prediction but useful as a structured reminder of key risk factors</li>
</ul>
<p>Documentation should reflect the assessment conducted, the risk level determined, and the clinical rationale for the level-of-care decision made. "Denies suicidal ideation" is insufficient documentation — document what was assessed and how.</p>`
        },
        {
          type: 'text',
          content: `<h2>Integrating Assessment into the Clinical Formulation</h2>
<p>Assessment data becomes clinically useful only when integrated into a coherent clinical formulation — a narrative that explains not just what the client has (diagnosis) but why, how it developed, what maintains it, and what would help it change.</p>
<p><strong>The biopsychosocial formulation:</strong> The most widely used framework organizes contributing factors across three domains:</p>
<ul>
<li><em>Biological:</em> Genetic vulnerabilities, medical conditions, neurobiological factors, medication effects</li>
<li><em>Psychological:</em> Cognitive patterns, personality features, coping styles, attachment history, prior trauma</li>
<li><em>Social/contextual:</em> Family system, cultural context, socioeconomic factors, social support, life stressors</li>
</ul>
<p><strong>The 4 P's formulation:</strong> A clinical teaching tool that organizes contributing factors temporally:</p>
<ul>
<li><em>Predisposing:</em> Factors that increased vulnerability (family history, early trauma, attachment disruption)</li>
<li><em>Precipitating:</em> Factors that triggered the current episode (recent loss, acute stressor)</li>
<li><em>Perpetuating:</em> Factors maintaining the problem (avoidance, secondary gain, lack of support)</li>
<li><em>Protective:</em> Factors that reduce risk or promote resilience (social support, insight, motivation, strengths)</li>
</ul>
<p>A good clinical formulation moves the therapeutic conversation from "what's wrong" to "why now, for this person, in this context" — which is where treatment planning begins. It is also a shared document: the best formulations are developed collaboratively with the client, who often has unique insight into what precipitated, maintains, and protects against their struggles.</p>
<p><strong>From formulation to treatment planning:</strong> Each element of the formulation suggests intervention targets. Predisposing biological vulnerability → consider pharmacotherapy consultation. Precipitating acute stressor → crisis support and stabilization. Perpetuating cognitive patterns → CBT or CPT. Perpetuating avoidance → behavioral activation or exposure-based work. Protective social support → amplify and recruit. The treatment plan should follow logically from the formulation — if it doesn't, the formulation is incomplete.</p>`
        },
        {
          type: 'text',
          content: `<h2>Documentation in Clinical Assessment</h2>
<p>Clinical assessment documentation serves multiple functions: clinical continuity, legal protection, communication with other providers, and reimbursement. Good documentation is complete, accurate, and specific — not a recitation of everything the client said, but a clinical summary that captures the key information needed for the listed functions.</p>
<p><strong>Standards for assessment documentation:</strong></p>
<ul>
<li>Document the date, length, and format of the assessment (in-person, telehealth)</li>
<li>Document all components of the assessment conducted (not just what was found to be abnormal)</li>
<li>Use specific, behavioral language rather than clinical jargon without referents: "Client reported difficulty falling asleep 5 of 7 nights per week, lying awake 1–2 hours after initially falling asleep" rather than "insomnia present"</li>
<li>Document the MSE comprehensively — all domains, including those that are within normal limits</li>
<li>Document risk assessment specifically: what was asked, what was disclosed, what risk factors are present, what protective factors are present, and the clinical rationale for the level-of-care decision</li>
<li>Document collateral contacts, records reviewed, and screening tools administered (including scores)</li>
<li>Document diagnostic formulation and clinical reasoning — not just the final diagnosis</li>
</ul>
<p><strong>Common documentation errors:</strong></p>
<ul>
<li>"Patient denies SI" — not a sufficient risk assessment; document what was assessed</li>
<li>Copying and pasting previous assessment without updating — constitutes falsification</li>
<li>Diagnosis without documented criteria — "MDD" without documenting which criteria were met</li>
<li>Documentation that is so general it could apply to any client — lacks individualized specificity</li>
</ul>`
        },
        {
          type: 'flashcardDeck',
          title: 'Clinical Assessment Key Terms',
          instructions: 'Review essential clinical assessment terminology.',
          flashcards: [
            { front: 'Mental Status Examination (MSE)', back: 'A structured clinical observation documenting current psychological functioning across appearance, speech, mood, affect, thought process/content, perception, cognition, insight, and judgment' },
            { front: 'Affect vs. Mood', back: 'Mood = client\'s subjective emotional report; Affect = clinician\'s objective observation of emotional expression. They may differ significantly and both should be documented.' },
            { front: 'Anchoring Bias', back: 'Locking onto the first plausible diagnosis and failing to adequately consider alternatives; counteracted by generating a comprehensive differential before committing' },
            { front: 'Cultural Formulation Interview (CFI)', back: 'DSM-5-TR validated 16-item structured interview eliciting cultural information relevant to assessment — how the client and community understand the problem, causes, support, and help-seeking' },
            { front: 'PHQ-9', back: '9-item self-report depression screen mapping to DSM-5 MDD criteria; ≥10 = moderate depression; most widely used depression screen in mental health and primary care' },
            { front: 'C-SSRS', back: 'Columbia Suicide Severity Rating Scale — structured suicide risk interview distinguishing passive from active ideation with plan and intent; free for clinical use' },
            { front: '4 P\'s Formulation', back: 'Predisposing (vulnerability factors) + Precipitating (triggers) + Perpetuating (maintenance factors) + Protective (resilience factors) — organizes clinical data into a treatment-relevant narrative' },
            { front: 'Structured Professional Judgment (SPJ)', back: 'Recommended suicide risk assessment approach combining systematic risk factor assessment with clinical judgment — avoids purely actuarial or purely intuitive approaches' }
          ]
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Cultural Assessment and Risk',
          takeaways: [
            'The DSM-5-TR Cultural Formulation Interview (CFI) provides a structured approach to eliciting cultural context relevant to assessment and diagnosis',
            'Known racial/ethnic disparities in diagnosis include overdiagnosis of schizophrenia in Black Americans and underdiagnosis of bipolar disorder in Black and Latino populations',
            'Suicide risk assessment uses Structured Professional Judgment (SPJ) — combining systematic risk factor assessment with clinical reasoning, not prediction formulas',
            'Prior suicide attempts are the strongest single predictor of future suicidal behavior; access to firearms significantly elevates risk',
            'Clinical formulation — biopsychosocial or 4 P\'s — integrates assessment data into a treatment-guiding narrative explaining why this presentation, for this person, at this time',
            'Documentation should reflect specific behavioral language, all assessment components, MSE domains, and clinical reasoning — not just final diagnoses'
          ]
        },
        {
          type: 'reflection',
          question: 'Consider your current assessment practice. Which cognitive bias (anchoring, confirmation bias, premature closure, framing effects) do you think most commonly affects your diagnostic reasoning? What specific practice change — such as systematic symptom review, generating comprehensive differentials, or increasing cultural consultation — would most directly address that bias?'
        },
        {
          type: 'multipleChoice',
          question: 'The DSM-5-TR Cultural Formulation Interview (CFI) is best described as:',
          options: [
            { text: 'A diagnostic instrument that assigns DSM diagnoses based on cultural context', isCorrect: false },
            { text: 'A supplement to standard assessment that elicits cultural context relevant to the presenting concern', isCorrect: true },
            { text: 'A replacement for the standard clinical intake interview with culturally diverse clients', isCorrect: false },
            { text: 'A brief screening tool for identifying cultural idioms of distress', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The CFI is a validated supplement to standard clinical assessment, not a replacement. It elicits cultural information about how the client and their community understand the problem, its causes, and appropriate responses — enriching the assessment without replacing diagnostic evaluation.'
        },
        {
          type: 'multipleChoice',
          question: 'According to suicide risk assessment research, which factor is the strongest single predictor of future suicidal behavior?',
          options: [
            { text: 'Current passive suicidal ideation', isCorrect: false },
            { text: 'Diagnosis of major depressive disorder', isCorrect: false },
            { text: 'History of prior suicide attempts', isCorrect: true },
            { text: 'Access to firearms', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Prior suicide attempts are the strongest empirically supported predictor of future suicidal behavior. This does not mean other factors (ideation severity, means access, recent precipitants) are unimportant — they are critical components of risk assessment — but history of attempts carries the strongest predictive weight.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are components of the 4 P\'s clinical formulation framework? Select all that apply.',
          options: [
            { text: 'Predisposing factors', isCorrect: true },
            { text: 'Precipitating factors', isCorrect: true },
            { text: 'Prognosis factors', isCorrect: false },
            { text: 'Perpetuating factors', isCorrect: true },
            { text: 'Protective factors', isCorrect: true }
          ],
          explanation: 'The 4 P\'s are Predisposing (vulnerability), Precipitating (triggers), Perpetuating (maintenance factors), and Protective (resilience). Prognosis is not one of the P\'s — although the formulation informs prognosis, it is not a designated component of the framework.'
        },
        {
          type: 'resources',
          title: 'Additional Resources',
          resources: [
            { name: 'DSM-5-TR Cultural Formulation Interview (CFI)', url: 'https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures', description: 'Free DSM-5-TR assessment tools including the CFI, Level 1 cross-cutting symptom measures, and condition-specific severity scales' },
            { name: 'Columbia Suicide Severity Rating Scale (C-SSRS)', url: 'https://cssrs.columbia.edu', description: 'Free download of C-SSRS clinical and research versions, training materials, and translation resources' },
            { name: 'PHQ, GAD-7, and other Pfizer/Kroenke validated tools', url: 'https://www.phqscreeners.com', description: 'Free download portal for PHQ-9, PHQ-2, GAD-7, and related screening tools with validated scoring instructions' },
            { name: 'MoCA (Montreal Cognitive Assessment)', url: 'https://www.mocatest.org', description: 'Free MoCA for clinical use (registration required); training and scoring resources available' }
          ]
        }
      ]
    }
  ],
  assessment: {
    questions: [
      {
        question: 'Which component of the Mental Status Examination reflects the CLINICIAN\'S objective observation of the client\'s emotional expression?',
        options: ['Mood', 'Affect', 'Thought content', 'Judgment'],
        correctAnswer: 1,
        explanation: 'Affect is the clinician\'s objective observation of the client\'s emotional expression — including range, intensity, congruence with reported mood, and lability. Mood is the client\'s own report of their subjective emotional state.'
      },
      {
        question: 'A clinician assesses a new client who was referred with a note saying "known treatment-resistant depression." Before completing the full assessment, they diagnose the client with MDD. This error is best described as:',
        options: ['Availability heuristic', 'Anchoring bias combined with framing effects', 'Countertransference', 'Emotional reasoning'],
        correctAnswer: 1,
        explanation: 'Anchoring bias (committing to the referring diagnosis before completing assessment) combined with framing effects (the referral note framing the clinician\'s attention) leads to premature diagnostic closure and under-consideration of alternative diagnoses.'
      },
      {
        question: 'The PHQ-9 is primarily validated as a screening tool for:',
        options: ['Generalized anxiety disorder', 'PTSD', 'Major depressive disorder', 'Bipolar disorder'],
        correctAnswer: 2,
        explanation: 'The PHQ-9 (Patient Health Questionnaire-9) maps directly to DSM-5 MDD diagnostic criteria and is the most widely used depression screening tool in mental health and primary care settings. A score of ≥10 indicates moderate depression.'
      },
      {
        question: 'The DSM-5-TR requires which step before assigning a primary psychiatric diagnosis such as MDD?',
        options: ['Completing a structured clinical interview', 'Ruling out medical conditions as a cause of the symptoms', 'Administering at least two validated screening tools', 'Consulting with a psychiatrist'],
        correctAnswer: 1,
        explanation: 'DSM-5-TR diagnostic criteria for all primary psychiatric conditions include exclusion criteria requiring that the presentation is not better explained by a medical condition or substance. Medical history and appropriate medical evaluation are prerequisites for primary psychiatric diagnosis.'
      },
      {
        question: 'Which cultural syndrome involves intense emotional expression including crying, shouting, and trembling, and is common in Latin American and Caribbean populations?',
        options: ['Taijin kyofusho', 'Ataque de nervios', 'Khyal cap', 'Dhat syndrome'],
        correctAnswer: 1,
        explanation: 'Ataque de nervios is documented in the DSM-5-TR Glossary of Cultural Concepts of Distress as a common Latin American and Caribbean expression of intense emotional distress involving emotional outpouring, which may include shouting, crying, trembling, and dissociative experiences. It may co-occur with mood, anxiety, or dissociative disorders but is not equivalent to any.'
      },
      {
        question: 'Research consistently documents which diagnostic disparity involving Black Americans?',
        options: ['Underdiagnosis of schizophrenia', 'Overdiagnosis of major depressive disorder', 'Overdiagnosis of schizophrenia (3-4x the rate of white Americans with equivalent presentations)', 'Underdiagnosis of anxiety disorders'],
        correctAnswer: 2,
        explanation: 'Black Americans are diagnosed with schizophrenia at 3–4 times the rate of white Americans with equivalent presentations. This disparity reflects both clinician bias and the misinterpretation of cultural expression as pathological, persisting even after controlling for socioeconomic factors.'
      },
      {
        question: 'The Columbia Suicide Severity Rating Scale (C-SSRS) is specifically designed to:',
        options: ['Predict the probability of a future suicide attempt', 'Distinguish passive suicidal ideation from active ideation with plan and intent', 'Screen for suicidal behavior using a single yes/no question', 'Replace clinical judgment in suicide risk assessment'],
        correctAnswer: 1,
        explanation: 'The C-SSRS is a structured clinical interview that distinguishes between types of suicidal ideation — passive (wish to be dead) versus active ideation with and without plan, intent, and preparatory actions. This distinction is clinically and legally significant. It does not predict future attempts and does not replace clinical judgment.'
      },
      {
        question: 'Semi-structured diagnostic interviews (such as the SCID-5) are preferred in clinical settings over fully structured interviews because:',
        options: ['They are faster and require less training', 'They are legally required for reimbursement purposes', 'They balance reliability with clinical flexibility for follow-up questioning', 'They eliminate the need for clinical formulation'],
        correctAnswer: 2,
        explanation: 'Semi-structured interviews provide specific probe questions and decision trees (ensuring coverage) while allowing clinician flexibility for follow-up questioning (maintaining clinical responsiveness). This balance makes them more practical than fully scripted structured interviews for most clinical settings.'
      },
      {
        question: 'In the 4 P\'s clinical formulation framework, "perpetuating factors" refers to:',
        options: ['Genetic and biological vulnerabilities that predispose to illness', 'Recent events that triggered the current episode', 'Factors that maintain the problem and prevent natural recovery', 'Client strengths and resilience that protect against worsening'],
        correctAnswer: 2,
        explanation: 'Perpetuating factors are what maintains the problem and prevents natural recovery — avoidance, secondary gain, cognitive patterns, lack of support, reinforcing environments. They are the primary targets of most psychotherapy interventions.'
      },
      {
        question: 'Which of the following is the strongest single predictor of future suicidal behavior?',
        options: ['Current passive suicidal ideation', 'Diagnosis of major depressive disorder', 'Recent interpersonal loss', 'History of prior suicide attempts'],
        correctAnswer: 3,
        explanation: 'Prior suicide attempts are the strongest empirically supported predictor of future suicidal behavior. This is a consistent finding across suicide research and is incorporated into all major suicide risk assessment frameworks.'
      },
      {
        question: 'What is the primary purpose of the DSM-5-TR Cultural Formulation Interview (CFI)?',
        options: ['To determine if a client requires a different diagnostic system than the DSM-5-TR', 'To elicit cultural information about how the client and community understand the presenting concern', 'To assign culture-specific diagnostic codes', 'To screen for cultural idioms of distress using validated scaling'],
        correctAnswer: 1,
        explanation: 'The CFI\'s primary purpose is to elicit cultural context — how the client and their community understand the problem, its causes, available support, and help-seeking. It enriches the standard assessment by surfacing culturally-relevant factors that might otherwise be missed.'
      },
      {
        question: 'A clinician tends to diagnose borderline personality disorder more frequently in the month following a BPD training. This is an example of:',
        options: ['Anchoring bias', 'Availability heuristic', 'Premature closure', 'Framing effects'],
        correctAnswer: 1,
        explanation: 'The availability heuristic involves overweighting diagnoses that are most recently or vividly encountered. A clinician who just completed BPD training will have BPD at heightened availability in their diagnostic reasoning, increasing the likelihood of diagnosing it even in cases where it may not be the best fit.'
      },
      {
        question: 'The GAD-7 at a score of ≥10 indicates:',
        options: ['Minimal anxiety — no intervention needed', 'Mild anxiety — monitor and reassess', 'Moderate anxiety — follow-up clinical evaluation indicated', 'Severe anxiety — immediate psychiatric referral required'],
        correctAnswer: 2,
        explanation: 'A GAD-7 score of ≥10 indicates moderate anxiety and warrants follow-up clinical evaluation. A positive screen is not a diagnosis; it indicates elevated symptom burden that requires clinical assessment to determine etiology and appropriate intervention.'
      },
      {
        question: 'Which documentation statement best reflects appropriate suicide risk assessment documentation?',
        options: ['"Patient denies suicidal ideation."', '"No SI present."', '"Patient reported no current suicidal thoughts or plans when directly asked; identified children as primary reason for living; agreed to safety plan; assessed as low acute risk."', '"Risk assessment completed; patient is safe."'],
        correctAnswer: 2,
        explanation: 'Adequate suicide risk assessment documentation is specific and behavioral: it records what was directly asked, what was disclosed, which risk factors and protective factors were assessed, and the clinical rationale for the risk determination and level-of-care decision. "Denies SI" and similar brief statements are legally and clinically inadequate.'
      },
      {
        question: 'Underdiagnosis of ADHD in girls and women is often attributed to:',
        options: ['Women having lower rates of ADHD than men', 'More frequent inattentive presentations that are less visible than hyperactive-impulsive symptoms', 'Different diagnostic criteria for women in the DSM-5-TR', 'Better adaptive coping skills that mask symptoms in clinical interviews'],
        correctAnswer: 1,
        explanation: 'ADHD in girls and women more commonly presents with inattentive (rather than hyperactive-impulsive) features, which are less behaviorally visible, less likely to prompt teacher referral in childhood, and less likely to emerge prominently in adult clinical presentation without direct inquiry. This contributes to systematic underdiagnosis in this population.'
      },
      {
        question: 'The biopsychosocial formulation organizes contributing factors across which three domains?',
        options: ['Behavioral, cognitive, and social', 'Biological, psychological, and social/contextual', 'Biological, psychiatric, and socioeconomic', 'Neurological, psychological, and cultural'],
        correctAnswer: 1,
        explanation: 'The biopsychosocial model organizes contributing factors into three domains: Biological (genetic vulnerabilities, medical conditions, neurobiological factors), Psychological (cognitive patterns, personality, coping, trauma), and Social/Contextual (family system, culture, socioeconomic factors, life stressors). Together they constitute a comprehensive clinical formulation framework.'
      }
    ]
  },
  references: [
    { citation: 'American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text revision). American Psychiatric Association Publishing.' },
    { citation: 'First, M.B., Williams, J.B.W., Karg, R.S., & Spitzer, R.L. (2016). Structured clinical interview for DSM-5 disorders — Clinician version (SCID-5-CV). American Psychiatric Association Publishing.' },
    { citation: 'Kroenke, K., Spitzer, R.L., & Williams, J.B.W. (2001). The PHQ-9: Validity of a brief depression severity measure. Journal of General Internal Medicine, 16(9), 606–613.' },
    { citation: 'Spitzer, R.L., Kroenke, K., Williams, J.B.W., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: The GAD-7. Archives of Internal Medicine, 166(10), 1092–1097.' },
    { citation: 'Weathers, F.W., Litz, B.T., Keane, T.M., Palmieri, P.A., Marx, B.P., & Schnurr, P.P. (2013). The PTSD Checklist for DSM-5 (PCL-5). National Center for PTSD. Retrieved from www.ptsd.va.gov.' },
    { citation: 'Posner, K., Brown, G.K., Stanley, B., Brent, D.A., Yershova, K.V., Oquendo, M.A., ... & Mann, J.J. (2011). The Columbia–Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults. American Journal of Psychiatry, 168(12), 1266–1277.' },
    { citation: 'Nasreddine, Z.S., Phillips, N.A., Bédirian, V., Charbonneau, S., Whitehead, V., Collin, I., ... & Chertkow, H. (2005). The Montreal Cognitive Assessment, MoCA: A brief screening tool for mild cognitive impairment. Journal of the American Geriatrics Society, 53(4), 695–699.' },
    { citation: 'Lewis-Fernández, R., Aggarwal, N.K., Bäärnhielm, S., Rohlof, H., Kirmayer, L.J., Weiss, M.G., ... & Lu, F. (2014). Culture and psychiatric evaluation: Operationalizing cultural formulation for DSM-5. Psychiatry: Interpersonal and Biological Processes, 77(2), 130–154.' },
    { citation: 'Neighbors, H.W., Trierweiler, S.J., Ford, B.C., & Muroff, J.R. (2003). Racial differences in DSM diagnosis using a semi-structured instrument: The importance of clinical judgment in the diagnosis of African Americans. Journal of Health and Social Behavior, 44(3), 237–256.' },
    { citation: 'Nolen-Hoeksema, S., & Hilt, L.M. (2009). Handbook of depression in adolescents. Routledge.' },
    { citation: 'Graber, M.L. (2013). The incidence of diagnostic error in medicine. BMJ Quality & Safety, 22(Suppl 2), ii21–ii27.' },
    { citation: 'Kirmayer, L.J., & Bhugra, D. (2009). Culture and mental illness: Social context, phenomenology and anthropological perspectives. In M.G. Gelder, N.C. Andreasen, J.J. Lopez-Ibor, & J.R. Geddes (Eds.), New Oxford textbook of psychiatry (pp. 34–42). Oxford University Press.' },
    { citation: 'Engel, G.L. (1977). The need for a new medical model: A challenge for biomedicine. Science, 196(4286), 129–136.' },
    { citation: 'Sadock, B.J., Sadock, V.A., & Ruiz, P. (2017). Kaplan and Sadock\'s comprehensive textbook of psychiatry (10th ed.). Wolters Kluwer.' },
    { citation: 'Beck, A.T., Rush, A.J., Shaw, B.F., & Emery, G. (1979). Cognitive therapy of depression. Guilford Press.' },
    { citation: 'Seligman, L., & Reichenberg, L.W. (2014). Selecting effective treatments: A comprehensive, systematic guide to treating mental disorders (4th ed.). Wiley.' }
  ]
};

function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.cards||b.flashcards)(b.cards||b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front).split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back).split(/\s+/).filter(Boolean).length;});
  if(b.nodes)b.nodes.forEach(n=>{t+=stripHTML(n.text).split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text).split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.blanks)b.blanks.forEach(bl=>{t+=stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;t+=stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;});
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.name||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
}return t;}
function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words');
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(t.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:activity`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push('CRITICAL:flat_options');}
if((c.assessment?.questions?.length||0)<15)e.push('CRITICAL:exam<15');
if((c.references?.length||0)<15)e.push('CRITICAL:refs<15');return{wc,e};}
async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode}|${wc}w/${COURSE.ceHours*6000}req|${COURSE.sections.length}sec|${COURSE.assessment?.questions?.length}exam|${COURSE.references?.length}refs`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('⚠️',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated');}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted');}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
