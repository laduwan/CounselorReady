// Seed: CR-FILM-101 — A Beautiful Mind (Gold-Standard rebuild)
// Converted from legacy seedMovieCourses.js (modules/lessons) to sections/contentBlocks.
// Prose preserved verbatim; dividers, activities, references, and 5 exam questions added.
// Target collection: interactivecourses. Run: node src/scripts/seedCR-FILM-101.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/counselorready";

const COURSE_DATA = {
  courseCode: "CR-FILM-101",
  slug: "beautiful-mind",
  title: "A Beautiful Mind: Understanding and Treating Serious Mental Illness",
  subtitle: "Clinical concepts through the lens of cinema",
  description: "A 1-CE hour course using the film A Beautiful Mind as a launching point to explore the clinical realities of schizophrenia spectrum and serious mental illness: symptom recognition, evidence-based treatment, therapeutic alliance, and the ethics of capacity and autonomy.",
  ceHours: 1,
  category: "Clinical Practice",
  nbccContentAreas: ["Counseling Theory/Practice", "Assessment", "Social and Cultural Foundations"],
  tags: ["schizophrenia", "psychosis", "serious mental illness", "ethics", "capacity", "therapeutic alliance", "film"],
  status: "draft",
  isPublished: false,
  references: [
    { title: "Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.)", author: "American Psychiatric Association", year: 2022, source: "American Psychiatric Association Publishing" },
    { title: "Key Substance Use and Mental Health Indicators in the United States: 2022 NSDUH", author: "Substance Abuse and Mental Health Services Administration", year: 2023, source: "SAMHSA" },
    { title: "Schizophrenia", author: "Owen, M. J., Sawa, A., & Mortensen, P. B.", year: 2016, source: "The Lancet, 388(10039), 86–97" },
    { title: "The American Psychiatric Association Practice Guideline for the Treatment of Patients With Schizophrenia (3rd ed.)", author: "American Psychiatric Association", year: 2021, source: "American Psychiatric Association Publishing" },
    { title: "Assertive community treatment for people with severe mental illness", author: "Bond, G. R., & Drake, R. E.", year: 2015, source: "Clinical Practice & Epidemiology in Mental Health, 11, 117–122" },
    { title: "Cognitive behavior therapy for psychosis: A meta-analysis", author: "Wykes, T., Steel, C., Everitt, B., & Tarrier, N.", year: 2008, source: "Schizophrenia Bulletin, 34(3), 523–537" },
    { title: "Insight in schizophrenia: A review", author: "Amador, X. F., & David, A. S.", year: 2004, source: "Insight and Psychosis (2nd ed.), Oxford University Press" },
    { title: "Shared decision making in mental health care", author: "Drake, R. E., Cimpean, D., & Torrey, W. C.", year: 2009, source: "Dialogues in Clinical Neuroscience, 11(4), 455–463" },
    { title: "The MacArthur Treatment Competence Study", author: "Grisso, T., & Appelbaum, P. S.", year: 1995, source: "Law and Human Behavior, 19(2)" },
    { title: "Assessing competence to consent to treatment: A guide for physicians and other health professionals", author: "Grisso, T., & Appelbaum, P. S.", year: 1998, source: "Oxford University Press" },
    { title: "Stigma and its impact on help-seeking for mental disorders", author: "Clement, S., et al.", year: 2015, source: "Psychological Medicine, 45(1), 11–27" },
    { title: "Recovery in serious mental illness: A concept analysis", author: "Jacobson, N., & Greenley, D.", year: 2001, source: "Psychiatric Services, 52(4), 482–485" },
    { title: "Excess mortality in persons with severe mental disorders", author: "Walker, E. R., McGee, R. E., & Druss, B. G.", year: 2015, source: "JAMA Psychiatry, 72(4), 334–341" },
    { title: "Family psychoeducation for schizophrenia", author: "McFarlane, W. R.", year: 2016, source: "World Psychiatry, 15(2), 154–161" },
    { title: "Person-centered care for people with serious mental illness", author: "Tondora, J., Miller, R., Slade, M., & Davidson, L.", year: 2014, source: "American Psychological Association" }
  ],
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    questions: [
    {
      question: "Schizophrenia spectrum disorders are primarily characterized by:",
      type: "multipleChoice",
      options: [
              { text: "Persistent low mood and anhedonia", isCorrect: false },
              { text: "Disturbances in thought, perception, behavior, and affect including hallucinations and delusions", isCorrect: true },
              { text: "Cycling between manic and depressive episodes", isCorrect: false },
              { text: "Pervasive patterns of interpersonal instability", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "'Positive symptoms' of schizophrenia include:",
      type: "multipleChoice",
      options: [
              { text: "Social withdrawal and flat affect", isCorrect: false },
              { text: "Hallucinations, delusions, disorganized speech, and abnormal motor behavior", isCorrect: true },
              { text: "Cognitive deficits in memory and attention", isCorrect: false },
              { text: "Depressed mood and insomnia", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "'Negative symptoms' of schizophrenia include all EXCEPT:",
      type: "multipleChoice",
      options: [
              { text: "Diminished emotional expression", isCorrect: false },
              { text: "Avolition", isCorrect: false },
              { text: "Auditory hallucinations", isCorrect: true },
              { text: "Alogia", isCorrect: false }
            ], correctAnswer: 2
    },
    {
      question: "CBTp differs from standard CBT in that:",
      type: "multipleChoice",
      options: [
              { text: "It does not use thought records", isCorrect: false },
              { text: "It does not aim to eliminate symptoms but helps clients develop alternative interpretations and coping strategies", isCorrect: true },
              { text: "It is only delivered in inpatient settings", isCorrect: false },
              { text: "It focuses exclusively on medication compliance", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "Recovery-oriented care for serious mental illness emphasizes:",
      type: "multipleChoice",
      options: [
              { text: "Symptom elimination as the primary goal", isCorrect: false },
              { text: "Client autonomy, hope, meaningful life roles, and personal empowerment beyond symptom management", isCorrect: true },
              { text: "Long-term institutional care", isCorrect: false },
              { text: "Strict medication adherence above all else", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "The therapeutic alliance with clients experiencing psychosis requires:",
      type: "multipleChoice",
      options: [
        { text: "Directly challenging delusional beliefs", isCorrect: false },
        { text: "Validation of the client's experience while gently exploring alternative perspectives", isCorrect: true },
        { text: "Avoidance of any discussion that might reinforce delusions", isCorrect: false },
        { text: "Avoiding discussion of psychotic symptoms", isCorrect: false }
      ], correctAnswer: 1
    },
    {
      question: "Anosognosia in schizophrenia refers to:",
      type: "multipleChoice",
      options: [
        { text: "A type of hallucination", isCorrect: false },
        { text: "Lack of awareness or insight into one's own illness, distinct from denial", isCorrect: true },
        { text: "A side effect of antipsychotic medication", isCorrect: false },
        { text: "Difficulty with expressive language", isCorrect: false }
      ], correctAnswer: 1
    },
    {
      question: "Cultural considerations in assessing psychosis include:",
      type: "multipleChoice",
      options: [
              { text: "Applying the same diagnostic criteria universally", isCorrect: false },
              { text: "Recognizing that cultural and spiritual beliefs may resemble psychotic symptoms and require culturally informed assessment", isCorrect: true },
              { text: "Diagnosing psychosis only in Western populations", isCorrect: false },
              { text: "Ignoring cultural beliefs in favor of standardized assessment", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "Violence risk assessment with SMI should:",
      type: "multipleChoice",
      options: [
        { text: "Assume all individuals with psychosis are dangerous", isCorrect: false },
        { text: "Use structured professional judgment without stereotyping based on diagnosis alone", isCorrect: true },
        { text: "Only be conducted after a violent incident", isCorrect: false },
        { text: "Be based solely on the client's self-report", isCorrect: false }
      ], correctAnswer: 1
    },
    {
      question: "Stigma reduction in clinical practice involves:",
      type: "multipleChoice",
      options: [
              { text: "Avoiding the diagnostic label entirely", isCorrect: false },
              { text: "Using person-first language, examining personal biases, and advocating for clients", isCorrect: true },
              { text: "Referring clients with SMI to specialized settings only", isCorrect: false },
              { text: "Focusing only on strengths and ignoring symptoms", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "A clinician notices a new client with schizophrenia minimizes medication side effects to avoid being told to continue a drug they dislike. The most therapeutic initial response is to:",
      type: "multipleChoice",
      options: [
        { text: "Insist on adherence for the client's safety", isCorrect: false },
        { text: "Explore ambivalence, validate the client's experience and collaborate on the treatment decision", isCorrect: true },
        { text: "Document non-adherence and notify the prescriber only", isCorrect: false },
        { text: "Reduce session frequency until adherence improves", isCorrect: false }
      ], correctAnswer: 1
    },
    {
      question: "Negative symptoms of schizophrenia are best described as:",
      type: "multipleChoice",
      options: [
              { text: "Experiences added to normal functioning, such as hallucinations", isCorrect: false },
              { text: "Capacities diminished or absent, such as avolition and flat affect", isCorrect: true },
              { text: "Temporary mood elevations", isCorrect: false },
              { text: "Cognitive distortions unique to anxiety", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "Decisional capacity is best understood as:",
      type: "multipleChoice",
      options: [
              { text: "A permanent, global trait a person either has or lacks", isCorrect: false },
              { text: "Specific to a particular decision and able to fluctuate", isCorrect: true },
              { text: "Identical to the legal concept of competency", isCorrect: false },
              { text: "Determined solely by diagnosis", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "Which is an evidence-based psychosocial intervention for serious mental illness?",
      type: "multipleChoice",
      options: [
              { text: "Confrontational reality-testing", isCorrect: false },
              { text: "Assertive Community Treatment (ACT)", isCorrect: true },
              { text: "Indefinite inpatient observation", isCorrect: false },
              { text: "Avoiding discussion of symptoms", isCorrect: false }
            ], correctAnswer: 1
    },
    {
      question: "The film A Beautiful Mind is clinically notable in part because it:",
      type: "multipleChoice",
      options: [
              { text: "Accurately depicts the typical course of all psychotic disorders", isCorrect: false },
              { text: "Portrays visual hallucinations though Nash primarily experienced auditory ones", isCorrect: true },
              { text: "Demonstrates that medication is rarely necessary", isCorrect: false },
              { text: "Shows that insight is always intact in schizophrenia", isCorrect: false }
            ], correctAnswer: 1
    }
    ]
  },
  sections: [
    {
      title: "Introduction",
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "Introduction", subtitle: "Clinical concepts through the lens of A Beautiful Mind" },
        { type: "text", content: `<h2>Introduction: The Clinical Reality Behind the Silver Screen</h2>
<p>The 2001 Academy Award-winning film A Beautiful Mind brought the experience of schizophrenia into public consciousness through its portrayal of mathematician John Nash's struggles with the disorder. While the film took creative liberties with Nash's actual experiences—notably depicting visual hallucinations when Nash primarily experienced auditory ones—it nonetheless provided audiences with a visceral glimpse into the confusion, terror, and profound disruption that psychotic experiences can bring to an individual's life. For mental health clinicians, the film serves as a launching point for deeper exploration of serious mental illness—not as Hollywood portrays it, but as we encounter it in clinical practice.</p>
<p>Serious mental illness (SMI) is defined by the Substance Abuse and Mental Health Services Administration (SAMHSA) as a mental, behavioral, or emotional disorder resulting in serious functional impairment that substantially interferes with or limits one or more major life activities. The category includes schizophrenia spectrum disorders, bipolar disorder, and major depressive disorder with psychotic features, among others. According to SAMHSA's 2022 National Survey on Drug Use and Health, approximately 14.1 million adults in the United States—roughly 5.5% of the adult population—lived with SMI in the past year.</p>
<p>The economic and social burden of serious mental illness extends far beyond the individual. SMI is associated with reduced life expectancy of 10-25 years compared to the general population, largely due to cardiovascular disease, metabolic conditions, and suicide. Employment rates among individuals with schizophrenia remain below 20% in most studies, despite many individuals expressing desire to work. Housing instability and homelessness disproportionately affect this population. The World Health Organization ranks schizophrenia among the top ten causes of disability worldwide. Understanding and effectively treating serious mental illness is thus not only a clinical imperative but a matter of social justice and public health priority.</p>
<p>This course will provide clinicians with comprehensive knowledge about psychotic disorders, evidence-based treatment approaches, and practical strategies for building therapeutic relationships with individuals whose reality testing is impaired. Throughout our exploration, we will return to themes illuminated by A Beautiful Mind: the intersection of brilliance and illness, the importance of supportive relationships, and the possibility of meaningful recovery even in the face of severe psychiatric symptoms.</p>
` },
        { type: "callout", calloutType: "tip", title: "How to use this course", content: "<p>Each section pairs a clinical concept with its portrayal in film — and the ways film diverges from clinical reality. Use the reflection prompts to connect the material to your own practice.</p>" },
        { type: "reflection", prompt: "Before beginning: what assumptions about schizophrenia have you absorbed from media portrayals? Note them now and revisit at the end." }
      ]
    },
    {
      title: "Understanding Psychosis and Schizophrenia Spectrum Disorders",
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Understanding Psychosis and Schizophrenia Spectrum Disorders", subtitle: "Defining psychosis, positive and negative symptoms, and the clinical reality behind the film" },
        { type: "text", content: `<h2>Defining Psychosis</h2>
<p>Psychosis refers to a cluster of symptoms characterized by a loss of contact with external reality. The term encompasses experiences including hallucinations, delusions, disorganized thinking, and grossly disorganized or abnormal motor behavior. It is crucial to understand that psychosis is a symptom presentation rather than a diagnosis itself—psychotic symptoms can occur across numerous psychiatric conditions, medical illnesses, and substance-induced states. This distinction has important implications for assessment and treatment planning.</p>
<p>Hallucinations are perceptual experiences that occur in the absence of external stimuli. While auditory hallucinations—particularly hearing voices—are most commonly associated with schizophrenia, occurring in approximately 60-80% of individuals with the disorder, hallucinations can occur in any sensory modality. Auditory hallucinations in schizophrenia typically involve hearing voices that comment on behavior, converse with each other, or issue commands. The voices may be recognized or unfamiliar, perceived as coming from inside or outside the head, and experienced as distressing or neutral.</p>
<p>Visual hallucinations, while less common in primary psychotic disorders, should prompt consideration of medical etiology, substance use, or delirium. Visual hallucinations are more characteristic of delirium, Lewy body dementia, and substance intoxication or withdrawal than of schizophrenia. When visual hallucinations do occur in schizophrenia, they are often accompanied by auditory hallucinations. Tactile hallucinations, such as the sensation of insects crawling on or under the skin (formication), are often associated with substance use, particularly stimulants. Olfactory and gustatory hallucinations, while rare, may occur in temporal lobe epilepsy or certain psychotic presentations.</p>
<p>The phenomenology of auditory hallucinations varies considerably across individuals and has important clinical implications. Some hear a single voice, others hear multiple voices that may converse with each other or comment on the person's behavior. Command hallucinations—voices directing the person to take specific actions—require careful assessment due to their potential association with dangerous behavior, though research suggests that most individuals with command hallucinations do not act on them. Factors increasing risk of acting on command hallucinations include concurrent substance use, history of violence, commands that are congruent with existing delusions, and commands to harm specific identified targets.</p>
<p>Delusions are fixed, false beliefs that persist despite contradictory evidence and are not shared by others in the individual's cultural or religious community. The distinction between a delusion and a strongly held belief can be challenging and requires cultural sensitivity. Delusions are categorized by their content: persecutory delusions involve beliefs about being targeted, watched, or conspired against and are the most common type in schizophrenia; grandiose delusions center on inflated beliefs about one's importance, power, or abilities; referential delusions involve beliefs that neutral events or objects have special personal significance; erotomanic delusions involve the belief that another person, often of higher status, is in love with the individual; and somatic delusions involve beliefs about one's body, such as infestation or decay.</p>
<p>The bizarreness of delusions has historically been considered diagnostically significant. Bizarre delusions—those that are clearly implausible and not understandable based on ordinary life experiences, such as beliefs about thought insertion, thought withdrawal, or external control of one's actions—were once considered pathognomonic for schizophrenia. Current diagnostic criteria have moved away from emphasizing bizarreness, recognizing that the distinction between bizarre and non-bizarre delusions is often unreliable and culturally influenced.</p>
<p>In A Beautiful Mind, John Nash experiences elaborate delusions involving his recruitment by a government agent named Parcher to decode Soviet messages hidden in newspapers and magazines. This portrayal demonstrates how delusions can be internally consistent and compelling, creating an alternative reality that feels absolutely real to the person experiencing it. Nash's delusional system incorporated real elements of his life—his mathematical abilities, the Cold War context—into a coherent narrative that explained his experiences and gave him a sense of purpose.</p>
<p>Disorganized thinking, also called formal thought disorder, manifests as disorganized speech that is difficult to follow. Loosening of associations involves shifting between topics with little or no logical connection. Tangentiality refers to responses that are only obliquely related to questions asked. Circumstantiality involves excessive detail before eventually reaching the point. Word salad represents severe disorganization where speech becomes nearly incomprehensible. These symptoms reflect disruption in the organization and expression of thought.</p>
<h2>Schizophrenia Spectrum Disorders</h2>
<p>The DSM-5-TR organizes psychotic disorders along a spectrum based on duration, symptom presentation, and functional impact. Understanding this spectrum is essential for accurate diagnosis and appropriate treatment planning.</p>
<p>Schizophrenia is characterized by the presence of two or more of the following symptoms, each present for a significant portion of time during a one-month period, with at least one being delusions, hallucinations, or disorganized speech: delusions, hallucinations, disorganized speech (such as frequent derailment or incoherence), grossly disorganized or catatonic behavior, and negative symptoms. Continuous signs of disturbance must persist for at least six months, including at least one month of active-phase symptoms. The disturbance must cause marked impairment in one or more major areas of functioning such as work, interpersonal relations, or self-care.</p>
<p>The course of schizophrenia is highly variable and less uniformly poor than once believed. Some individuals experience a single episode with good recovery, while others follow a chronic deteriorating course. Research suggests that approximately 20-25% of individuals with schizophrenia achieve good outcomes with sustained remission and functional recovery. Another 25% experience significant improvement with residual symptoms. About 25% show moderate impairment with periodic exacerbations, while 25% have a chronic course with persistent symptoms and significant disability.</p>
<p>The first few years following illness onset—sometimes called the critical period—appear to be particularly important for long-term trajectory. Aggressive treatment during this period, including both pharmacological and psychosocial interventions, may improve outcomes. This understanding has driven the development of early intervention services and first-episode psychosis programs that provide intensive, comprehensive care during the initial years of illness.</p>
<p>Schizoaffective disorder requires the presence of a major mood episode (depressive or manic) concurrent with criterion A symptoms of schizophrenia, with delusions or hallucinations present for at least two weeks in the absence of a major mood episode during the lifetime duration of the illness. The mood symptoms must be present for the majority of the total duration of illness. This diagnosis can be challenging to make and may require longitudinal observation over time.</p>
<p>Schizophreniform disorder uses the same diagnostic criteria as schizophrenia but applies when the total duration of illness is at least one month but less than six months. This diagnosis is often provisional, as many individuals meeting criteria for schizophreniform disorder will ultimately meet criteria for schizophrenia if symptoms persist.</p>
<p>Brief psychotic disorder involves the presence of delusions, hallucinations, disorganized speech, or grossly disorganized or catatonic behavior lasting at least one day but less than one month, with eventual full return to premorbid functioning. This condition often occurs in response to extreme stress and may have a more favorable prognosis than other psychotic disorders.</p>
<p>Delusional disorder is characterized by the presence of one or more delusions with a duration of one month or longer, without meeting the full criteria for schizophrenia. Functioning is not markedly impaired, and behavior is not obviously bizarre or odd apart from the impact of the delusion.</p>
<h2>Positive and Negative Symptoms</h2>
<p>Understanding the distinction between positive and negative symptoms is fundamental to comprehensive assessment and treatment planning in schizophrenia spectrum disorders. This distinction, introduced by researcher Tim Crow in the 1980s, has proven clinically useful for understanding symptom patterns, predicting treatment response, and planning interventions.</p>
<p>Positive symptoms represent additions to normal experience—phenomena that should not be present. These include hallucinations across all sensory modalities, delusions of various types, formal thought disorder manifesting as disorganized speech, and bizarre or disorganized behavior. Positive symptoms are typically more responsive to antipsychotic medications and are often the most dramatic and recognizable aspects of psychotic illness.</p>
<p>Negative symptoms represent a diminution or absence of normal experiences and behaviors. These include affective flattening or blunting (reduced range and intensity of emotional expression), alogia or poverty of speech (reduced verbal output, brief replies), avolition (decreased motivation and drive), anhedonia (reduced capacity to experience pleasure), and asociality (decreased interest in social interactions).</p>
<p>Negative symptoms are often more subtle than positive symptoms but may be equally or more impairing in terms of functional outcomes. Unlike positive symptoms, negative symptoms respond poorly to traditional antipsychotic medications and require targeted psychosocial interventions. Negative symptoms are strong predictors of functional outcomes including employment, independent living, and social relationships. Clinicians must be careful to distinguish primary negative symptoms from secondary causes such as depression, medication side effects, or social deprivation.</p>
<h2>Cognitive Symptoms</h2>
<p>In addition to positive and negative symptoms, cognitive impairment represents a third symptom domain in schizophrenia that significantly impacts functioning. Cognitive symptoms include deficits in attention and concentration, working memory impairment, processing speed reduction, and executive function difficulties including planning, problem-solving, and cognitive flexibility.</p>
<p>Cognitive symptoms often predate the onset of positive symptoms and may persist even when positive and negative symptoms are well-controlled. They are among the strongest predictors of functional outcomes, affecting the ability to work, live independently, and engage in social relationships. Unlike positive symptoms, cognitive symptoms do not respond well to antipsychotic medications. Cognitive remediation therapy, a structured intervention targeting cognitive skills through practice and compensatory strategies, shows modest but significant effects on cognitive functioning.</p>
<p>In A Beautiful Mind, Nash's cognitive abilities—his mathematical brilliance—coexist with his psychotic symptoms, illustrating that serious mental illness affects individuals across the spectrum of intellectual functioning. The film also shows how Nash's cognitive functioning fluctuated over time and how he learned to compensate for difficulties by developing strategies to test reality, such as asking others whether they could see the people he perceived.</p>
<p>Assessment of cognitive symptoms should be part of comprehensive evaluation in schizophrenia. Brief cognitive screening instruments can identify areas of impairment that may benefit from targeted intervention. Understanding a client's cognitive profile helps in treatment planning—for example, simplifying instructions, providing written reminders, or breaking tasks into smaller steps for those with working memory or executive function difficulties.</p>
` },
        { type: "callout", calloutType: "clinical", title: "Clinical pearl", content: "<p>Positive symptoms tend to respond to antipsychotics and draw the most attention — but <strong>negative and cognitive symptoms</strong> are the stronger predictors of long-term functioning. When a client is &ldquo;stable&rdquo; on medication yet not recovering, look here.</p>" },
        { type: "multipleChoice", question: "Auditory hallucinations are an example of a:", options: [
              { text: "Negative symptom", isCorrect: false },
              { text: "Positive symptom", isCorrect: true },
              { text: "Cognitive symptom", isCorrect: false },
              { text: "Mood symptom", isCorrect: false }
            ], correctAnswer: 1, explanation: "Hallucinations are positive symptoms — experiences added to normal functioning." }
      ]
    },
    {
      title: "Evidence-Based Treatment Approaches",
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 3, title: "Evidence-Based Treatment Approaches", subtitle: "Medication, psychosocial interventions, and integrated care for serious mental illness" },
        { type: "text", content: `<h2>The Role of Medication</h2>
<p>Antipsychotic medications remain the cornerstone of treatment for schizophrenia and other psychotic disorders. These medications are generally effective at reducing positive symptoms, with response rates of 60-70% for first-generation and second-generation antipsychotics. However, they are less effective for negative symptoms and cognitive impairment, which may require additional psychosocial interventions.</p>
<p>First-generation (typical) antipsychotics, such as haloperidol and chlorpromazine, primarily work by blocking dopamine D2 receptors. While effective for positive symptoms, they carry significant risk of extrapyramidal side effects including dystonia, akathisia, parkinsonism, and tardive dyskinesia. Second-generation (atypical) antipsychotics, including risperidone, olanzapine, quetiapine, and clozapine, affect both dopamine and serotonin systems and generally have lower risk of extrapyramidal effects but carry their own side effect profiles including metabolic syndrome, weight gain, and diabetes risk.</p>
<p>Clozapine deserves special mention as the only antipsychotic with demonstrated superiority for treatment-resistant schizophrenia. Approximately 30% of individuals with schizophrenia do not respond adequately to standard antipsychotics; clozapine can be effective in many of these cases. Clozapine also appears to reduce suicide risk in schizophrenia. However, the requirement for regular blood monitoring due to risk of agranulocytosis limits its use.</p>
<p>For counselors and other non-prescribing clinicians, understanding medication is important for several reasons: supporting medication adherence through psychoeducation and addressing ambivalence; recognizing side effects that may affect engagement and functioning; collaborating effectively with prescribers as part of treatment teams; and understanding how medication effects interact with psychosocial interventions.</p>
<h2>Cognitive Behavioral Therapy for Psychosis (CBTp)</h2>
<p>Cognitive Behavioral Therapy for Psychosis (CBTp) is an evidence-based psychosocial intervention with demonstrated efficacy for reducing positive symptoms, improving functioning, and enhancing quality of life in individuals with schizophrenia and related disorders. CBTp adapts standard CBT principles for the unique challenges of working with psychotic symptoms.</p>
<p>CBTp does not aim to convince clients that their experiences are not real—a strategy unlikely to succeed and likely to damage the therapeutic alliance. Instead, CBTp helps clients develop alternative ways of understanding and responding to their experiences that reduce distress and improve functioning. Key strategies include developing a shared understanding of the client's experiences, examining evidence for and against beliefs, generating alternative explanations, and behavioral experiments to test beliefs.</p>
<p>For hallucinations, CBTp interventions may include normalizing voice-hearing experiences (noting that voice-hearing occurs on a spectrum and is not always associated with mental illness), developing coping strategies for managing voices (such as distraction, reality testing, or engaging with voices differently), examining and modifying beliefs about voices (such as beliefs about their power or omniscience), and reducing behavioral responses to voices that maintain distress.</p>
<p>For delusions, interventions focus on gentle examination of evidence, developing alternative explanations, and reducing the impact of delusional beliefs on behavior and wellbeing. The therapist does not directly challenge delusions but instead uses collaborative empiricism to explore the client's experiences and beliefs with curiosity and openness.</p>
<p>Evidence supports CBTp as an effective adjunctive treatment alongside medication. Meta-analyses indicate small to moderate effects on positive symptoms, with effects maintained at follow-up. CBTp also shows benefits for depression, social functioning, and quality of life. While CBTp does not replace medication for most individuals with schizophrenia, it provides valuable additional benefit and may be particularly important for those who cannot or choose not to take medication.</p>
<p>The structure and pacing of CBTp differs from standard CBT. Sessions may need to be shorter or more flexible to accommodate cognitive difficulties and fluctuating symptoms. The therapy typically proceeds more slowly, with extensive time devoted to engagement and assessment. Therapists must be comfortable with uncertainty and with therapeutic relationships that develop gradually over extended periods.</p>
<h2>Family Psychoeducation</h2>
<p>Family involvement is one of the most powerful predictors of positive outcomes in schizophrenia treatment. Family psychoeducation programs provide education about the illness, teach communication and problem-solving skills, and reduce expressed emotion—the critical, hostile, or emotionally overinvolved attitudes that predict relapse. Meta-analyses consistently demonstrate that family psychoeducation reduces relapse rates by approximately 50% compared to standard treatment.</p>
<p>Effective family psychoeducation programs typically include education about the nature of schizophrenia, its causes, course, and treatment; training in communication skills that reduce criticism and conflict; problem-solving training; crisis intervention planning; and ongoing support. Programs may be delivered in single-family or multi-family formats, with multi-family groups offering additional benefits of peer support and reduced isolation.</p>
<p>The concept of expressed emotion (EE) has been particularly influential in understanding family factors in schizophrenia. High EE environments—characterized by criticism, hostility, or emotional overinvolvement—are associated with significantly higher relapse rates. Family interventions that reduce EE show corresponding reductions in relapse. However, it is important to approach this research with sensitivity, avoiding blame of families who are themselves struggling with the impact of their loved one's illness.</p>
<p>Clinicians should be prepared to work with families who are exhausted, grieving, frustrated, or traumatized by their experiences. Many families have been through multiple crises, hospitalizations, and interactions with mental health systems that left them feeling unheard or blamed. Building alliance with families requires acknowledging their experiences, validating their concerns, and partnering with them rather than positioning as an authority.</p>
<p>In A Beautiful Mind, Alicia Nash exemplifies the profound impact that family support can have on recovery. Her commitment to her husband, her willingness to learn about his illness, and her belief in his capacity for meaningful life—even when he doubted himself—contributed significantly to his eventual stability. While not all families can or should provide this level of support, the film illustrates the potential power of family involvement in recovery.</p>
<h2>Supported Employment and Psychosocial Rehabilitation</h2>
<p>Many individuals with serious mental illness want to work but face significant barriers to employment. Traditional vocational rehabilitation approaches—which emphasized extensive pre-employment training before job placement—have proven less effective than supported employment approaches that place individuals in competitive jobs quickly and provide ongoing support.</p>
<p>Individual Placement and Support (IPS) is an evidence-based supported employment model with strong research support. Core principles include competitive employment as the goal rather than sheltered work; rapid job search rather than extensive prevocational training; attention to client preferences in job selection; integration of employment and mental health services; and ongoing support after job placement. IPS programs consistently achieve employment rates of 50-60%, compared to 20-25% for traditional vocational services.</p>
<p>Employment provides benefits beyond income for individuals with serious mental illness. Work contributes to identity and self-esteem, provides structure and routine, increases social contact, and may improve symptoms and functioning. Many individuals with schizophrenia identify employment as a key recovery goal. Supporting this goal, even when it requires accommodation and flexibility, is an important aspect of recovery-oriented care.</p>
<p>Other psychosocial rehabilitation interventions include social skills training, which uses behavioral techniques to improve interpersonal functioning; cognitive remediation, which targets cognitive deficits through structured exercises; and illness management and recovery programs, which help individuals develop strategies for managing symptoms and pursuing recovery goals. These interventions address the multiple domains of impairment that may affect individuals with serious mental illness.</p>
<h2>Early Intervention Programs</h2>
<p>Recognition of the critical period following illness onset has led to the development of specialized early intervention programs for first-episode psychosis. These programs provide intensive, comprehensive services during the first 2-5 years of illness, with the goal of improving long-term trajectory. Key components include rapid access to treatment, low-dose antipsychotic medication, individual and family therapy, supported education and employment, and peer support.</p>
<p>Research demonstrates that early intervention programs improve outcomes compared to standard care, including reduced symptoms, improved functioning, higher rates of employment and education, and reduced hospitalization. The effects appear to persist even after transition to standard services, suggesting that the early intervention period represents a window of opportunity for influencing long-term course.</p>
<p>The RAISE (Recovery After an Initial Schizophrenia Episode) study, a large NIMH-funded trial, demonstrated the effectiveness of coordinated specialty care for first-episode psychosis in U.S. community mental health settings. Following this research, SAMHSA now supports first-episode psychosis programs across the country. Clinicians working with young people experiencing first-episode psychosis should be aware of these specialized services and facilitate appropriate referrals.</p>
` },
        { type: "flashcardDeck", instructions: "Tap each card to reveal the answer.", flashcards: [
          { front: "First-line pharmacological treatment for schizophrenia?", back: "Antipsychotic medication; second-generation (atypical) agents are common first-line choices." },
          { front: "Name a key psychosocial intervention.", back: "Assertive Community Treatment, supported employment, CBT for psychosis, or family psychoeducation." },
          { front: "Approximate relapse reduction from family psychoeducation?", back: "About 50% compared to standard treatment." },
          { front: "IPS supported-employment outcome vs. traditional vocational services?", back: "50–60% competitive employment vs. ~20–25%." }
        ] },
        { type: "reflection", prompt: "How do you balance medication adherence concerns with respect for a client's autonomy and lived experience of side effects?" }
      ]
    },
    {
      title: "Building Therapeutic Alliance with Individuals Experiencing Psychosis",
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 4, title: "Building Therapeutic Alliance with Individuals Experiencing Psychosis", subtitle: "Engagement, trust, and working with reduced insight" },
        { type: "text", content: `<h2>Challenges to Alliance Building</h2>
<p>Developing therapeutic alliance with individuals experiencing psychosis presents unique challenges. Reality testing impairment may lead clients to incorporate the therapist into delusional systems—viewing them with suspicion or attributing special powers to them. Negative symptoms including asociality and affective flattening may make it difficult to establish emotional connection. Cognitive impairment may affect the client's ability to engage in talk therapy. And medication side effects may contribute to low energy and reduced engagement.</p>
<p>Despite these challenges, therapeutic alliance is possible and important. Research demonstrates that alliance with individuals with schizophrenia predicts treatment outcomes including symptom reduction, functioning, and quality of life. Alliance may be particularly important when other predictors of engagement (such as insight) are limited.</p>
<h2>Strategies for Building Alliance</h2>
<p>Effective alliance building with individuals experiencing psychosis requires both standard therapeutic skills and specific adaptations. Validation and acceptance of the person's subjective experience is essential—even when you cannot agree that their experiences reflect external reality, you can acknowledge that these experiences are real and distressing to them. Collaboration and respect for autonomy helps counter the disempowerment many individuals with serious mental illness experience in treatment systems.</p>
<p>Practical assistance with concrete needs—housing, benefits, medication side effects—demonstrates care and competence. Consistency and reliability build trust over time, particularly important given that many individuals with serious mental illness have experienced multiple treatment relationships and system failures. Pacing and patience allow the relationship to develop without pressure that may increase suspicion or withdrawal.</p>
<p>Recovery-oriented language emphasizes hope, strengths, and the possibility of meaningful life. Rather than focusing solely on symptom reduction, recovery-oriented care attends to what the person wants their life to be and how treatment can support those goals. This approach is exemplified in A Beautiful Mind by Alicia Nash's unwavering belief in her husband's capacity for meaningful life despite his illness.</p>
<p>Working with ambivalence about treatment is often necessary. Many individuals with psychosis have mixed feelings about medication, therapy, or the mental health system in general. Motivational interviewing techniques can help explore ambivalence without confrontation. The goal is to understand the client's perspective, validate their concerns, and support their autonomy in making decisions about their care.</p>
` },
        { type: "multipleChoice", question: "When a client has limited insight into their illness, the clinician should first prioritize:", options: [
              { text: "Confronting the delusion directly to correct it", isCorrect: false },
              { text: "Building rapport and trust before challenging beliefs", isCorrect: true },
              { text: "Immediately recommending hospitalization", isCorrect: false },
              { text: "Withholding the diagnosis indefinitely", isCorrect: false }
            ], correctAnswer: 1, explanation: "Alliance and trust generally precede any productive exploration of fixed beliefs; insight often follows engagement." }
      ]
    },
    {
      title: "Ethical Considerations and Special Topics",
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 5, title: "Ethical Considerations and Special Topics", subtitle: "Capacity, autonomy, involuntary treatment, and stigma" },
        { type: "text", content: `<h2>Capacity and Autonomy</h2>
<p>Working with individuals whose reality testing is impaired raises complex questions about capacity and autonomy. When does psychosis impair capacity to make treatment decisions? How do we balance respect for autonomy with protection from harm? How do we collaborate with clients who refuse recommended treatment?</p>
<p>Capacity is decision-specific and can fluctuate over time. An individual experiencing acute psychosis may lack capacity for certain decisions but retain capacity for others. Capacity assessments evaluate the ability to understand relevant information, appreciate how it applies to one's situation, reason about options, and express a choice. Even when capacity is impaired, involving the individual in decisions to the greatest extent possible respects their dignity and may improve outcomes.</p>
<p>The tension between autonomy and protection is particularly acute when individuals refuse medication that could reduce their suffering and improve their functioning. Coercive interventions such as involuntary hospitalization or court-ordered treatment carry significant costs including trauma, loss of trust, and damage to the therapeutic relationship. Such interventions may be necessary in situations of imminent danger but should be used sparingly and thoughtfully.</p>
<p>Psychiatric advance directives offer one way to honor autonomy while planning for periods of impaired capacity. These documents, completed when the individual has capacity, specify treatment preferences and designate surrogate decision-makers for times when capacity is compromised. Advance directives can improve the individual's sense of control and guide treatment during crises.</p>
<h2>Addressing Stigma</h2>
<p>Stigma surrounding serious mental illness remains a significant barrier to treatment seeking, recovery, and quality of life. Public stigma—negative attitudes held by others—leads to discrimination in housing, employment, and social relationships. Self-stigma—internalized negative beliefs about oneself based on having a mental illness—erodes self-esteem and may contribute to hopelessness and treatment disengagement.</p>
<p>Clinicians can address stigma through their own attitudes and language, through psychoeducation that challenges myths about serious mental illness, and through supporting clients in developing narratives about their experiences that maintain dignity and hope. Peer support services, which employ individuals with lived experience of mental illness, provide powerful counter-examples to stigmatizing assumptions.</p>
<p>Language matters in combating stigma. Person-first language ('person with schizophrenia' rather than 'schizophrenic') emphasizes personhood over diagnosis. Avoiding terms like 'crazy' or 'psycho' models respectful communication. Emphasizing recovery and possibility challenges assumptions about inevitable decline.</p>
<h2>Violence Risk Assessment</h2>
<p>Media portrayals often reinforce the misconception that individuals with schizophrenia are dangerous. In reality, while there is a small statistical elevation in violence risk associated with schizophrenia—particularly when complicated by substance use or treatment nonadherence—the vast majority of individuals with psychotic disorders are not violent and are far more likely to be victims than perpetrators of violence.</p>
<p>Research indicates that the attributable risk of violence from schizophrenia—the proportion of violence that can be attributed to the diagnosis itself—is quite small, accounting for approximately 3-5% of violent crimes. Substance use, history of violence, and other factors are far stronger predictors of violence than diagnosis alone. Individuals with schizophrenia are 14 times more likely to be victims of violence than perpetrators.</p>
<p>Clinicians should conduct appropriate violence risk assessment, attending to specific risk factors including command hallucinations to harm, threat/control override symptoms (delusions that one is being threatened or that outside forces are controlling one's actions), substance use, and history of violence. Assessment should be balanced against the danger of over-predicting violence and contributing to stigma. Risk management strategies emphasize engagement in treatment, substance use treatment, and collaborative safety planning.</p>
<p>When violence risk is elevated, clinicians must balance duties to protect potential victims with therapeutic obligations to the client. This balance requires careful clinical judgment, consultation when available, and documentation of decision-making. Warning and protection duties vary by jurisdiction, and clinicians should be familiar with legal requirements in their practice settings.</p>
<h2>Trauma-Informed Care</h2>
<p>Trauma exposure is highly prevalent among individuals with serious mental illness. Research suggests that 70-90% of individuals with SMI have experienced significant trauma, and trauma may contribute to the development of psychotic symptoms in vulnerable individuals. Trauma-informed care recognizes the impact of trauma on current functioning and ensures that treatment does not retraumatize.</p>
<p>Key principles of trauma-informed care include safety (creating physically and emotionally safe environments), trustworthiness (being transparent and maintaining appropriate boundaries), choice (maximizing control and autonomy), collaboration (partnering with clients in treatment decisions), and empowerment (building on strengths and supporting recovery). These principles align naturally with recovery-oriented approaches to serious mental illness.</p>
<h2>Psychopharmacology Considerations for Counselors</h2>
<p>While counselors do not prescribe medications, understanding psychopharmacology is essential for effective collaboration with prescribers and for supporting clients through the medication management process. Antipsychotic medications remain the cornerstone of pharmacological treatment for schizophrenia and related psychotic disorders, and counselors who understand their mechanisms, benefits, and limitations are better equipped to support clients in making informed decisions about their care.</p>
<p>First-generation antipsychotics (FGAs), also known as typical antipsychotics, primarily block dopamine D2 receptors. Medications in this class include haloperidol, chlorpromazine, and fluphenazine. While effective for positive symptoms, FGAs carry significant risk for extrapyramidal symptoms (EPS) including akathisia, dystonia, parkinsonism, and tardive dyskinesia. These side effects often contribute to medication nonadherence and should be monitored in clinical sessions through observation and direct inquiry.</p>
<p>Second-generation antipsychotics (SGAs), or atypical antipsychotics, include risperidone, olanzapine, quetiapine, aripiprazole, clozapine, and lurasidone. SGAs affect both dopamine and serotonin systems and generally carry lower EPS risk but higher metabolic risk, including weight gain, diabetes, and dyslipidemia. Clozapine remains the gold standard for treatment-resistant schizophrenia, with efficacy in approximately 30-60% of individuals who have not responded to two adequate trials of other antipsychotics, though it requires regular blood monitoring due to the risk of agranulocytosis.</p>
<p>Long-acting injectable (LAI) antipsychotics represent an important option for individuals who struggle with daily oral medication adherence. Available formulations include paliperidone palmitate (monthly or every three months), aripiprazole lauroxil (monthly or every two months), and risperidone microspheres (biweekly). LAIs remove the daily decision-making burden of medication adherence and provide consistent blood levels, which can reduce relapse rates. Counselors can play an important role in discussing LAI options with clients who express difficulty maintaining consistent oral medication use.</p>
<p>Counselors should be attuned to medication side effects that clients may be reluctant to disclose, including sexual dysfunction, cognitive dulling, sedation, and metabolic changes. These side effects significantly impact quality of life and are among the most common reasons for medication discontinuation. Creating a therapeutic space where clients can openly discuss medication experiences without fear of judgment supports adherence and enables the counselor to advocate for medication adjustments when appropriate.</p>
<h2>Cultural Considerations in Psychosis Treatment</h2>
<p>Cultural context profoundly influences how psychotic experiences are interpreted, expressed, and treated. Research consistently demonstrates significant disparities in the diagnosis and treatment of psychotic disorders across racial and ethnic groups. African Americans are diagnosed with schizophrenia at rates approximately three to four times higher than European Americans, even when controlling for symptom presentation. Latino and immigrant populations may present with cultural expressions of distress that are misidentified as psychotic symptoms by clinicians unfamiliar with cultural norms.</p>
<p>The DSM-5-TR acknowledges the importance of cultural context in evaluating psychotic symptoms through the Cultural Formulation Interview (CFI), a structured tool that helps clinicians explore the cultural dimensions of a client's presentation. The CFI assesses the client's cultural definition of the problem, cultural perceptions of cause, cultural factors affecting help-seeking, and the relationship between cultural identity and the current problem. Incorporating the CFI into assessment of psychotic symptoms can reduce diagnostic error and improve treatment planning.</p>
<p>Clinicians must also consider how cultural factors influence the therapeutic relationship. Mistrust of mental health systems is well-documented among communities that have historically experienced coercive treatment, involuntary hospitalization, and overdiagnosis. Building trust requires acknowledging these historical realities, demonstrating cultural humility, and involving community and family supports that the client identifies as meaningful. Recovery-oriented care must be defined in culturally relevant terms, recognizing that concepts of wellness, autonomy, and community participation may carry different meanings across cultural contexts.</p>
<h2>Clinical Vignette: Applying Course Concepts</h2>
<p>Marcus, a 24-year-old African American man, is referred for counseling following his second psychiatric hospitalization for psychotic symptoms. He was first hospitalized at age 21 after calling the police to report that his college roommate was poisoning his food. He was stabilized on risperidone and discharged but stopped taking medication after a few months because he felt it made him foggy. His recent hospitalization occurred after his mother found him awake for several days, pacing and talking rapidly about messages he was receiving through the television.</p>
<p>Marcus is currently taking olanzapine and reports that his symptoms are under control. He expresses ambivalence about continuing medication, stating that he does not want to need drugs for the rest of his life. He describes himself as not a crazy person and attributes his hospitalizations to stress rather than mental illness. He has not returned to college and is currently living with his mother, who is highly involved and frequently calls the treatment team with concerns.</p>
<p>Working with Marcus involves multiple considerations explored in this course. His presentation is consistent with schizophrenia, though the differential includes other psychotic disorders and substance use should be assessed. His medication ambivalence is common and understandable and should be explored collaboratively rather than confrontationally. His denial of illness reflects poor insight, which can be addressed gradually through psychoeducation and cognitive approaches without direct confrontation. The relationship with his mother illustrates the importance of family work—her involvement is a strength, but high expressed emotion could increase relapse risk if not addressed.</p>
<p>Building alliance with Marcus requires meeting him where he is regarding his illness understanding while maintaining honesty about diagnoses and prognosis. A recovery-oriented approach would focus on his strengths and goals—returning to college, being independent—while providing the support needed to achieve them. Throughout, the clinician must attend to cultural factors, including the well-documented disparities in diagnosis and treatment of psychotic disorders among African Americans.</p>
<h2>Summary</h2>
<p>Serious mental illness, including schizophrenia spectrum disorders, affects millions of individuals and their families. While these conditions can be profoundly disabling, contemporary treatment offers real hope for recovery. Evidence-based approaches including antipsychotic medications, Cognitive Behavioral Therapy for Psychosis, family psychoeducation, and psychosocial rehabilitation can significantly reduce symptoms, improve functioning, and support individuals in building meaningful lives.</p>
<p>The therapeutic relationship is central to effective treatment. Clinicians must develop skills in building alliance despite reality testing impairment, implementing recovery-oriented care that respects autonomy and promotes hope, and navigating complex ethical terrain involving capacity, confidentiality, and risk management.</p>
<p>A Beautiful Mind reminds us that behind every diagnosis is a human being with hopes, talents, and the potential for recovery. John Nash's story illustrates both the devastation that psychosis can bring and the possibility of meaningful life in its wake. As clinicians, we have the privilege of walking alongside individuals on their own recovery journeys, offering evidence-based treatment, genuine relationship, and unwavering hope.</p>
<h2>References</h2>
<p>American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.).</p>
<p>Correll, C. U., &amp; Schooler, N. R. (2020). Negative symptoms in schizophrenia: A review and clinical guide. Neuropsychiatric Disease and Treatment, 16, 519-534.</p>
<p>Dixon, L. B., Dickerson, F., Bellack, A. S., et al. (2010). The 2009 schizophrenia PORT psychosocial treatment recommendations. Schizophrenia Bulletin, 36(1), 48-70.</p>
<p>Howes, O. D., &amp; Murray, R. M. (2014). Schizophrenia: An integrated sociodevelopmental-cognitive model. The Lancet, 383(9929), 1677-1687.</p>
<p>Leucht, S., et al. (2013). Comparative efficacy and tolerability of 15 antipsychotic drugs in schizophrenia. The Lancet, 382(9896), 951-962.</p>
<p>Morrison, A. P., et al. (2014). Cognitive therapy for people with schizophrenia spectrum disorders not taking antipsychotic drugs. The Lancet, 383(9926), 1395-1403.</p>
<p>National Alliance on Mental Illness. (2023). Schizophrenia. https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Schizophrenia</p>
<p>SAMHSA. (2023). Key substance use and mental health indicators in the United States: Results from the 2022 NSDUH.</p>
<p>van Os, J., &amp; Kapur, S. (2009). Schizophrenia. The Lancet, 374(9690), 635-645.</p>
<p>Wykes, T., et al. (2011). A meta-analysis of cognitive remediation for schizophrenia. American Journal of Psychiatry, 168(5), 472-485.</p>
<h2>Schizophrenia Spectrum: Key Diagnostic Features (DSM-5-TR)</h2>
<p>Schizophrenia: 2+ symptoms for 6+ months (delusions, hallucinations, disorganized speech, disorganized/catatonic behavior, negative symptoms); at least one must be delusions, hallucinations, or disorganized speech.</p>
<p>Schizoaffective Disorder: Meets schizophrenia criteria AND concurrent major mood episode; delusions/hallucinations present for 2+ weeks without mood symptoms.</p>
<p>Brief Psychotic Disorder: 1+ psychotic symptoms lasting 1 day to 1 month with full return to premorbid functioning.</p>
<p>Schizophreniform Disorder: Meets schizophrenia criteria but duration is 1-6 months.</p>
<p>Delusional Disorder: 1+ delusions for 1+ month; functioning not markedly impaired apart from delusion impact.</p>
<h2>Symptom Categories and Treatment Response</h2>
<p>POSITIVE SYMPTOMS (hallucinations, delusions, thought disorder): Best response to antipsychotic medication; amenable to CBTp.</p>
<p>NEGATIVE SYMPTOMS (flat affect, alogia, avolition, anhedonia, asociality): Poor medication response; social skills training and behavioral activation may help.</p>
<p>COGNITIVE SYMPTOMS (attention, memory, executive function deficits): Strongest predictors of functional outcome; cognitive remediation shows moderate effects.</p>
<h2>Evidence-Based Psychosocial Interventions</h2>
<p>CBTp: Collaborative empiricism, normalizing, behavioral experiments. Effect size d=0.33-0.44 for positive symptoms.</p>
<p>Family Psychoeducation: Reduces relapse by ~50%. Involves illness education, communication skills, problem-solving.</p>
<p>Individual Placement and Support (IPS): Competitive employment model. 50-60% employment rates vs. 20% for traditional vocational services.</p>
<p>Cognitive Remediation: Computer-based exercises targeting attention, memory, executive function. Best when combined with other rehabilitation.</p>
<p>Social Skills Training: Structured behavioral rehearsal of interpersonal skills. Improves social functioning and assertiveness.</p>
<h2>Red Flags Requiring Immediate Attention</h2>
<p>Command hallucinations directing self-harm or harm to others</p>
<p>Acute onset of psychotic symptoms (rule out medical etiology—delirium, substance intoxication, autoimmune encephalitis)</p>
<p>Suicidal ideation (lifetime risk of suicide in schizophrenia: ~5%; 20-40% attempt)</p>
<p>Neuroleptic malignant syndrome (fever, rigidity, altered consciousness, autonomic instability)</p>
<p>Sudden medication discontinuation (risk of withdrawal psychosis and rebound symptoms)</p>
<p>This handout is designed as a take-home resource for clients diagnosed with serious mental illness and their family members. It provides accessible, destigmatizing information about psychotic disorders and recovery.</p>
<h2>What Is Psychosis?</h2>
<p>Psychosis is a medical condition that affects how your brain processes information. It can cause experiences like hearing voices that others don't hear, having strong beliefs that others don't share, or finding it hard to think clearly. Psychosis is not a character flaw or a sign of weakness. It is a brain-based condition that affects roughly 3 in 100 people at some point in their lives. With proper treatment and support, many people with psychotic disorders lead meaningful, fulfilling lives.</p>
<h2>What Helps Recovery?</h2>
<p>Recovery looks different for everyone, but research shows several things that help. Medication can reduce the most distressing symptoms—work with your prescriber to find the right medication and dose for you. Therapy, especially a type called CBT for psychosis, helps you understand your experiences and develop coping strategies. Social connections matter enormously—isolation makes symptoms worse, while supportive relationships promote recovery. Meaningful activity, whether work, volunteering, or creative pursuits, gives structure and purpose to your days. Taking care of your physical health through sleep, nutrition, and exercise also supports your mental health.</p>
<h2>Tips for Family Members</h2>
<p>Supporting a loved one with serious mental illness can be challenging. Learn about the condition—understanding what your family member is experiencing reduces fear and increases empathy. Communicate calmly and clearly—avoid arguing about delusions or hallucinations, but don't pretend to share experiences you don't have. Set realistic expectations—recovery is a process, not an event. Take care of yourself—join a support group like NAMI Family-to-Family, maintain your own relationships and interests, and seek professional support if you need it. Remember that your loved one's illness is not your fault, and their recovery is not solely your responsibility.</p>
<h2>Crisis Resources</h2>
<p>988 Suicide and Crisis Lifeline: Call or text 988 (24/7)
Crisis Text Line: Text HOME to 741741
NAMI Helpline: 1-800-950-NAMI (6264)
SAMHSA National Helpline: 1-800-662-4357</p>
<h2>Exploring Countertransference</h2>
<p>• What feelings arise when working with clients experiencing psychosis? How do these feelings influence your clinical decisions?</p>
<p>• Have you noticed any avoidance patterns in your work with this population (e.g., avoiding certain topics, shortening sessions, reducing frequency of contact)?</p>
<p>• How do your own beliefs about mental illness and recovery shape your expectations for clients with SMI?</p>
<h2>Clinical Skill Development</h2>
<p>• How do you balance validating a client's subjective experience with maintaining honesty about reality? Share an example where this was challenging.</p>
<p>• What strategies have you used for building alliance when a client has limited insight? What worked and what didn't?</p>
<p>• How do you assess capacity for informed consent in clients with fluctuating reality testing?</p>
<h2>Systems and Advocacy</h2>
<p>• How do you navigate disagreements with prescribers or treatment team members about a client's care?</p>
<p>• What systemic barriers have you encountered in connecting clients with SMI to appropriate services? How have you addressed them?</p>
<p>• How do you address cultural factors and potential diagnostic bias in your work with this population?</p>
<h2>Self-Care and Professional Sustainability</h2>
<p>• What impact does working with clients with SMI have on your own mental health and wellbeing?</p>
<p>• What boundaries help you sustain this work long-term? Are there boundaries you struggle to maintain?</p>
<p>• How do you process the grief and loss that can accompany this work (e.g., client hospitalizations, deterioration, or death)?</p>
` },
        { type: "callout", calloutType: "ethics", title: "Holding the tension", content: "<p>Capacity is <strong>decision-specific and can fluctuate</strong>; autonomy <strong>endures</strong> even when capacity for one decision is impaired. The clinical task is rarely &ldquo;capable or not&rdquo; — it is to involve the person to the fullest extent their current capacity allows, and to plan ahead (e.g., psychiatric advance directives) for the times it dips.</p>" },
        { type: "reflection", prompt: "Recall a case involving involuntary treatment or capacity questions. What tension between beneficence and autonomy did you navigate?" }
      ]
    },
    {
      title: "Conclusion & Key Takeaways",
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 6, title: "Conclusion & Key Takeaways", subtitle: "Bringing the clinical lens back to practice" },
        { type: "text", content: `<h2>Key Takeaways</h2><p>Serious mental illness, and schizophrenia in particular, is far more nuanced than its cinematic portrayals. Effective clinical work rests on accurate understanding of positive and negative symptoms, evidence-based pharmacological and psychosocial treatment, a patiently built therapeutic alliance that respects reduced insight, and careful ethical navigation of capacity, autonomy, and stigma. The film A Beautiful Mind offers a cultural touchstone — but the clinician's task is to see past the dramatization to the person.</p>` },
        { type: "callout", calloutType: "key", title: "Carry this into practice", calloutItems: [
          "Distinguish positive from negative symptoms when assessing and planning treatment.",
          "Pair medication with psychosocial supports; treat adherence as a collaborative, not coercive, goal.",
          "Build alliance before challenging beliefs; insight often follows trust.",
          "Treat capacity as decision-specific and autonomy as enduring."
        ] },
        { type: "reflection", prompt: "Return to the assumptions you noted at the start. Which have shifted? What will you do differently with your next client experiencing psychosis?" }
      ]
    }
  ]
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  const collection = mongoose.connection.db.collection("interactivecourses");
  const existing = await collection.findOne({ slug: COURSE_DATA.slug });
  if (existing) {
    await collection.updateOne({ slug: COURSE_DATA.slug }, { $set: COURSE_DATA });
    console.log("Updated:", COURSE_DATA.title);
  } else {
    COURSE_DATA.createdAt = new Date();
    COURSE_DATA.updatedAt = new Date();
    await collection.insertOne(COURSE_DATA);
    console.log("Created:", COURSE_DATA.title);
  }
  let words = 0, blocks = 0, kcs = 0;
  for (const s of COURSE_DATA.sections) for (const b of s.contentBlocks) {
    blocks++;
    if (b.type === "text" || b.type === "imageText") words += (b.content||"").replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length;
    if (b.type === "multipleChoice") kcs++;
  }
  console.log("\n=== CR-FILM-101 STATS ===");
  console.log("Sections:", COURSE_DATA.sections.length, "| Blocks:", blocks, "| KCs:", kcs);
  console.log("Exam questions:", COURSE_DATA.assessment.questions.length, "| References:", COURSE_DATA.references.length);
  console.log("Words:", words, "| CE requirement:", COURSE_DATA.ceHours*6000, "|", words >= COURSE_DATA.ceHours*6000 ? "PASS" : "BELOW MINIMUM");
  await mongoose.disconnect();
  console.log("Done.");
}
main().catch(e => { console.error(e.message); process.exit(1); });
