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
<p>This course addresses clinical assessment and diagnostic interviewing from an evidence-based perspective. We focus on what actually improves diagnostic accuracy: structured and semi-structured interviewing approaches, validated screening tools, awareness of cultural context, and strategies for reducing cognitive biases that distort clinical reasoning.</p>
<h2>The Biopsychosocial Model in Depth</h2>
<p>George Engel introduced the biopsychosocial model in a 1977 <em>Science</em> article as a direct challenge to the dominant biomedical model, which conceptualized illness as purely biological in origin. Engel argued — and decades of subsequent research have confirmed — that health and mental health are simultaneously shaped by biological factors, psychological factors, and the social contexts within which people live. For clinicians conducting intake assessments, the biopsychosocial model is not an abstract theory; it is a practical framework that ensures no clinically relevant domain is omitted.</p>
<p><strong>Biological domain:</strong> The biological domain encompasses neurobiological factors, genetic vulnerabilities, medical comorbidities, medication effects, and the physiological substrates of psychiatric symptoms. When assessing the biological domain, skilled clinicians ask systematically about:</p>
<ul>
<li>First-degree family psychiatric and medical history — genetic loading for mood disorders, psychosis, anxiety, and substance use disorders substantially elevates individual risk</li>
<li>Personal medical history, including thyroid function, autoimmune conditions, neurological history, head injuries, and seizure disorders — all of which can cause or mimic psychiatric presentations</li>
<li>Current and recent medications — many medications (corticosteroids, beta-blockers, isotretinoin, interferon, stimulants, opioids, benzodiazepines) have psychiatric side effects that can cause or amplify symptoms</li>
<li>Sleep history, appetite, energy, and vegetative symptoms — these biological markers of depression and mania often reveal themselves before the client conceptualizes their distress as emotional</li>
<li>Substance use — alcohol, cannabis, stimulants, sedatives, and opioids all have direct neurobiological effects that can cause, mask, or exacerbate psychiatric conditions</li>
</ul>
<p>Key biological assessment questions include: "Has a doctor ever told you that you have any medical conditions that might affect your mood or energy?" "Are you currently taking any medications, supplements, or herbal preparations?" "Has anyone in your biological family ever been diagnosed with a psychiatric condition, taken psychiatric medications, or been hospitalized for mental health reasons?" "How has your sleep been? Do you feel rested when you wake up?"</p>
<p><strong>Psychological domain:</strong> The psychological domain encompasses cognitive patterns, personality organization, coping styles, attachment history, trauma history, identity development, and the subjective meaning the client makes of their experience. This domain is often the most extensive in clinical assessment and the most personally sensitive:</p>
<ul>
<li>Cognitive patterns — core beliefs about self, world, and future; automatic thoughts that accompany emotional distress; cognitive distortions (catastrophizing, dichotomous thinking, personalization, mind-reading)</li>
<li>Personality features — temperament, characteristic interpersonal patterns, affect regulation capacity, identity consolidation, ego functioning</li>
<li>Coping strategies — adaptive (problem-solving, social support, emotional processing) and maladaptive (avoidance, dissociation, substance use, self-harm, compulsive behaviors)</li>
<li>Trauma history — adverse childhood experiences, interpersonal violence, community violence, medical trauma, and complex developmental trauma; the age at which trauma occurred and its relational context shape its psychological impact</li>
<li>Attachment history — early caregiving experiences that established internal working models of relationships, which carry forward into adult interpersonal functioning and the therapeutic relationship itself</li>
</ul>
<p>Psychological assessment questions include: "When you're going through a hard time, what do you usually do to cope?" "How would you describe yourself as a person — what are some words that feel like 'you'?" "Have you experienced any significant traumatic events in your life, including childhood experiences?" "How were things in your home growing up? What was your relationship like with your caregivers?"</p>
<p><strong>Social and contextual domain:</strong> The social domain examines the external conditions within which a person's life and distress are embedded. Clinicians sometimes underweight this domain, treating psychiatric symptoms as internal phenomena when they are, in fact, responses to external circumstances that have clinical, ethical, and treatment implications:</p>
<ul>
<li>Current living situation — stable housing, unsafe housing, or homelessness; roommates, partners, family members; whether the home environment is safe</li>
<li>Economic stability — employment status, financial stressors, food security, access to transportation; poverty is itself a powerful predictor of psychiatric symptoms and a barrier to treatment engagement</li>
<li>Social support — quality and quantity of supportive relationships; social isolation is a robust risk factor for depression, anxiety, and suicidality and a significant perpetuating factor in virtually every psychiatric condition</li>
<li>Cultural identity and context — race, ethnicity, immigration status, language, religious and spiritual beliefs, sexual orientation, gender identity; membership in marginalized groups involves chronic exposure to discrimination and microaggressions that constitute real psychological stressors</li>
<li>Legal and justice involvement — current legal charges, probation, incarceration history; these significantly constrain treatment options and create unique stressors</li>
<li>Recent life events and transitions — moves, job loss, divorce, bereavement, retirement, parenting changes; the timing of psychiatric symptoms in relation to external events is diagnostically and therapeutically informative</li>
</ul>
<p>Social assessment questions include: "What's your living situation like right now?" "Are there financial stressors that are affecting you?" "Do you have people you feel you can really rely on?" "What is your cultural or spiritual background, and how does that shape your understanding of what you're going through?"</p>
<p>The biopsychosocial model also organizes treatment planning: biological vulnerabilities suggest pharmacotherapy or medical consultation; psychological patterns suggest specific therapy modalities; social stressors suggest case management, systems advocacy, or community referrals. A formulation that leaves any domain unaddressed represents an incomplete clinical picture.</p>`
        },
        {
          type: 'text',
          content: `<h2>History of Present Illness: Structured Techniques</h2>
<p>The History of Present Illness (HPI) is the narrative core of any intake assessment. It describes the onset, trajectory, character, and context of the presenting symptoms in sufficient depth to anchor differential diagnosis, inform treatment planning, and establish a baseline for measuring progress. Unstructured HPI collection is a major source of diagnostic error — clinicians who follow the client's narrative without guiding it toward diagnostically relevant information routinely miss key data points that would change their clinical conclusions.</p>
<p><strong>The OLDCARTS mnemonic</strong> is borrowed from medical history-taking but applies directly to psychiatric symptom assessment. Each letter represents a clinically essential dimension:</p>
<ul>
<li><strong>O — Onset:</strong> When did this begin? Was the onset gradual or sudden? A sudden onset of depressive symptoms in a 55-year-old with no prior psychiatric history is a red flag for medical etiology (hypothyroidism, early dementia, occult malignancy). A gradual onset over months or years in a younger adult more typically reflects primary psychiatric illness or psychological stress accumulation.</li>
<li><strong>L — Location:</strong> Where is it experienced? For psychiatric presentations, location refers to the primary domain of distress — is the suffering primarily cognitive (intrusive thoughts, rumination, poor concentration), somatic (fatigue, pain, sleep disruption), emotional (sadness, fear, irritability), behavioral (avoidance, substance use, aggression), or relational (interpersonal conflict, withdrawal, abandonment fears)? Different primary locations suggest different diagnoses and treatment targets.</li>
<li><strong>D — Duration:</strong> How long have symptoms been present? DSM-5-TR criteria specify minimum durations for most diagnoses: MDD requires two weeks; GAD requires six months; PTSD requires one month post-trauma. A client who describes recurrent brief depressive episodes lasting days may have a depressive disorder, but they may also have PMDD, cyclothymia, or dysphoric states in the context of borderline personality features.</li>
<li><strong>C — Character:</strong> What is the quality of the experience? For depression: is it characterized by sadness, emptiness, irritability, or anhedonia? For anxiety: is it worry, panic, social fear, or obsessional content? Characterizing the phenomenology precisely moves the clinician from syndrome-level description toward meaningful differential diagnosis.</li>
<li><strong>A — Aggravating factors:</strong> What makes it worse? Stress, interpersonal conflict, sleep deprivation, certain substances, specific environmental triggers, time of day or month? Aggravating factors reveal maintaining mechanisms and suggest modifiable treatment targets. A client whose depression reliably worsens in October and improves in March has a seasonal pattern specifier. A client whose anxiety consistently worsens after cannabis use may have a substance-related contribution to the presentation.</li>
<li><strong>R — Relieving factors:</strong> What makes it better? Exercise, sleep, social contact, distraction, substances, work, creative activity? Relieving factors reveal coping strengths and can directly inform behavioral activation, harm reduction, and skills-building components of treatment.</li>
<li><strong>T — Time course and trajectory:</strong> Is the problem getting better, worse, or staying the same? Has it fluctuated? Are there periods of remission? Cyclical or episodic patterns suggest mood disorders or PTSD; chronic unremitting symptoms suggest characterological or persistent psychiatric conditions; a deteriorating course without treatment suggests increased urgency. Construct a timeline: "Let's map this out — when were things at their worst? When were things better? What was happening in your life during those periods?"</li>
<li><strong>S — Severity:</strong> How impaired is functioning? DSM-5-TR requires clinically significant distress or impairment as a threshold criterion for virtually every diagnosis. Assess severity across occupational functioning (work attendance, performance, concentration), social functioning (relationship quality, social engagement, isolation), and self-care (sleep, nutrition, hygiene, health maintenance). Validated severity scales (PHQ-9, GAD-7, PCL-5) provide standardized severity anchors that supplement clinical impression.</li>
</ul>
<p><strong>Timeline construction:</strong> One of the most diagnostically powerful and underused HPI techniques is explicit timeline construction with the client. Ask the client to identify the time when they first noticed anything was different — even before they would have labeled it a problem. Then work forward: "And then what happened? Was there a time it got better? What was going on in your life then? When did it get worse again?" Mapping the symptom timeline against life events reveals precipitating stressors, perpetuating factors, and patterns that the client may not have consciously connected. Clients routinely make meaning-making discoveries during timeline construction: "I never realized that every time I've gotten depressed, I'd just gotten out of a relationship."</p>
<p><strong>Onset clarification:</strong> Onset is both the most important and most unreliable component of the HPI. Memory for when symptoms began is systematically biased by the current emotional state, by the client's explanatory model for their distress, and by what appears relevant to them in retrospect. Strategies for onset clarification include:</p>
<ul>
<li>Ask about a time when things were last "fine" and work forward from there rather than asking when things "started"</li>
<li>Use anchor events — birthdays, holidays, job changes, moves, relationship transitions — to locate the onset temporally: "Were you feeling this way before or after you started this job?"</li>
<li>Ask separately about symptom onset and about the client first noticing or labeling distress — these are often different points: "When do you think something was actually different, even if you weren't thinking of it as a problem yet?"</li>
<li>Gather collateral information when possible — family members, previous treatment records, prior assessments may provide earlier or more accurate onset data</li>
</ul>`
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
          content: `<h2>The Mental Status Examination: Comprehensive Domain-by-Domain Assessment</h2>
<p>The Mental Status Examination (MSE) is the clinical equivalent of the physical examination — a systematic observation of current psychological functioning. Unlike the history (which is retrospective), the MSE documents what is directly observable in the interview at a specific moment in time. It is both a clinical tool and a legal document: the MSE establishes the baseline from which progress is measured and provides contemporaneous documentation of clinical state in the event of adverse outcomes. Each domain contributes unique diagnostic information.</p>
<p><strong>Appearance:</strong> Appearance encompasses everything observable before the client speaks: estimated age relative to stated age (appearing older than stated age can suggest chronic stress, poor self-care, or substance use), dress and grooming (disheveled, poorly maintained, inappropriately formal, or culturally distinctive), hygiene (odor, dental hygiene, skin condition), physical health markers (weight changes, tremor, bruising), and level of comfort in the clinical setting (relaxed, guarded, frightened, hostile). Specific descriptors matter: "appeared unkempt, with unwashed hair and clothing that was visibly soiled" is clinically useful; "appeared poorly kempt" is too vague. Document carefully: avoid descriptors that conflate cultural or economic differences with pathology. A client who wears culturally traditional dress is not "oddly dressed"; a client who is visibly thin may have medical illness or anorexia — document what is observed, not an interpretation.</p>
<p><strong>Behavior and psychomotor activity:</strong> Behavior encompasses the client's observable actions throughout the interview: psychomotor agitation (restlessness, fidgeting, pacing, inability to remain seated — seen in anxiety, ADHD, mania, akathisia from antipsychotics, substance intoxication or withdrawal) or psychomotor retardation (slowed movement, slowed response latency, decreased spontaneous activity — seen in severe depression, hypothyroidism, sedating medications). Document eye contact quality (sustained, intermittent, poor, or gaze avoidance — noting that cultural norms for eye contact vary significantly). Note notable behaviors: repetitive movements, self-stimulating behaviors, picking at skin, compulsive checking, overt hostility or aggression, or excessive tearfulness.</p>
<p><strong>Speech:</strong> Speech parameters provide direct windows into thought process and neurological state. Assess:</p>
<ul>
<li><em>Rate:</em> Normal, rapid/pressured (mania, anxiety, stimulant intoxication), slowed (depression, sedation, cognitive impairment)</li>
<li><em>Volume:</em> Normal, loud (mania, hearing impairment, anxiety), soft (depression, fear, shame, cognitive impairment)</li>
<li><em>Rhythm and prosody:</em> Normal melodic quality, monotone (depression, autism spectrum, flat affect), staccato, or dysrhythmic</li>
<li><em>Fluency:</em> Normal, halting (anxiety, thought blocking, word-finding difficulty in cognitive impairment), or dysarthric (cerebellar pathology, intoxication)</li>
<li><em>Spontaneity:</em> Spontaneous elaboration versus one-word responses requiring extensive prompting (depression, suspiciousness, social anxiety)</li>
</ul>
<p><strong>Mood versus affect — the essential distinction:</strong> Mood and affect are the two most commonly confused and most diagnostically important MSE domains. <em>Mood</em> is the client's subjective, reported inner emotional state — what the client says when asked "How have you been feeling lately?" Document mood in the client's own words: "depressed," "anxious," "empty," "fine," "angry," "numb," "on edge." Do not paraphrase: if the client says "I feel like I'm underwater," document that phrase, which carries phenomenological meaning that clinical synonyms obscure.</p>
<p><em>Affect</em> is the clinician's objective observation of the client's emotional expression as it manifests during the interview. Affect is assessed across four dimensions:</p>
<ul>
<li><em>Range:</em> Broad (normal range of emotional expression), restricted (narrower than expected), blunted (significantly diminished — typical of depression or negative symptoms of psychosis), or flat (near-absent emotional expression — severe depression, schizophrenia, severe dissociation)</li>
<li><em>Intensity:</em> Normal, heightened (exaggerated emotional reactivity — mania, BPD, anxiety), or diminished (blunted/flat as above)</li>
<li><em>Congruence:</em> Is the affect consistent with the stated mood and the content being discussed? Incongruence is diagnostically significant: a client who laughs while describing a traumatic experience may be demonstrating dissociation, la belle indifférence, inappropriate affect, or cultural expression. Do not assume pathology — inquire. Incongruence is documented when present, with an exploratory note: "Affect was incongruent with stated mood and content; client smiled while describing her mother's death, which she identified as her presenting concern."</li>
<li><em>Lability:</em> Rapid shifts in affect that may not track with external stimuli — seen in mania, BPD, TBI, some dementias, and certain medication side effects</li>
</ul>
<p><strong>Thought process versus thought content — a critical distinction:</strong> These are two distinct MSE domains that clinicians frequently conflate. <em>Thought process</em> refers to <em>how</em> the client thinks — the organization, logic, and coherence of their thinking. <em>Thought content</em> refers to <em>what</em> the client is thinking about. Both must be assessed separately.</p>
<p>Thought process descriptors include:</p>
<ul>
<li><em>Linear and goal-directed:</em> The normal baseline — thoughts progress logically toward a communicative goal</li>
<li><em>Circumstantial:</em> Excessive detail and tangential elaboration that eventually reaches the point — common in anxiety, obsessive features, and some personality disorders</li>
<li><em>Tangential:</em> Drifts away from the original point and does not return — suggests more significant thought disorder or flight of ideas</li>
<li><em>Flight of ideas:</em> Rapid, loosely connected thoughts that shift quickly, often with rhyming, punning, or word association connections — pathognomonic of mania</li>
<li><em>Loose associations (derailment):</em> Thought connections that are difficult or impossible to follow logically — strongly suggests psychotic thought disorder</li>
<li><em>Thought blocking:</em> Abrupt cessation of thought mid-sentence, followed by confusion or an inability to recall what was being said — seen in psychosis</li>
<li><em>Perseveration:</em> Repetitive return to the same word, phrase, or topic despite redirection — seen in cognitive impairment and psychotic disorders</li>
</ul>
<p>Thought content assessment includes:</p>
<ul>
<li><em>Delusions:</em> Fixed, false beliefs held with certainty that are not consistent with the client's cultural background. Document the specific type and content — grandiose ("I have been chosen to deliver an important message to humanity"), persecutory ("My neighbors are surveilling me and reporting to the government"), referential ("The news anchor is speaking directly to me"), somatic ("My organs are rotting"), nihilistic ("The world has ended and I am already dead"), or jealous. Always distinguish between culturally held beliefs (which may be faith-based or culturally normative) and idiosyncratic false beliefs.</li>
<li><em>Obsessions:</em> Intrusive, unwanted, anxiety-provoking thoughts recognized by the client as irrational — characteristic of OCD; distinguish from rumination (repetitive self-referential negative thinking in depression) and overvalued ideas (strongly held but not technically delusional beliefs)</li>
<li><em>Preoccupations:</em> Recurrent themes that dominate thinking without rising to the level of obsessions or delusions</li>
<li><em>Suicidal and homicidal ideation:</em> Always assessed directly and documented specifically (see risk assessment section)</li>
</ul>
<p><strong>Perceptual disturbances:</strong> Perceptual disturbances are experiences of perception without corresponding external stimuli (hallucinations) or misperceptions of actual stimuli (illusions). When assessing hallucinations:</p>
<ul>
<li>Ask across all sensory modalities: auditory (most common in psychotic disorders), visual (more common in substance-induced psychosis, delirium, and neurological conditions), tactile (formication — the sensation of insects crawling on skin — in stimulant intoxication and withdrawal), olfactory (often associated with temporal lobe involvement), and gustatory</li>
<li>Assess the client's relationship to the experience: do they believe the voice is real? Do they recognize it as coming from inside their own mind? The degree of insight into hallucinations (ego-dystonic versus ego-syntonic) affects risk assessment and treatment planning</li>
<li>For command hallucinations specifically: assess whether the voice issues commands, whether the client has followed commands in the past, and whether there are current commands to self-harm or harm others</li>
<li>Assess frequency, duration, content, and triggering context — nocturnal auditory hallucinations in a client with severe insomnia may reflect hypnagogic phenomena rather than primary psychosis</li>
</ul>
<p><strong>Cognition — brief cognitive assessment techniques:</strong> The cognitive domain of the MSE assesses gross orientation, attention, memory, and abstraction. When cognitive impairment is not the primary presenting concern, a brief screen during the interview is sufficient. When impairment is suspected (older adults, history of TBI, neurological history, or clinical observations suggesting memory or executive difficulties), formal brief cognitive assessment is indicated.</p>
<ul>
<li><em>Orientation:</em> Person (own name, identity), place (where they are), time (date, month, year, day of week). Disorientation to time is the earliest and most sensitive indicator of acute confusion (delirium) or progressive cognitive impairment.</li>
<li><em>Attention:</em> Sustained and selective attention can be briefly assessed by digit span (forward: normal 5–9 digits; backward: normal 4–7 digits), serial subtraction (100 minus 7, repeated five times), or spelling "WORLD" backward. Poor attention with preserved orientation suggests inattentive ADHD, anxiety, or depression. Poor attention with disorientation suggests delirium or severe cognitive decline.</li>
<li><em>Memory:</em> Immediate recall (three-word registration), short-term recall (three words after five minutes with intervening tasks), and remote memory (historical personal facts, public events). The Montreal Cognitive Assessment (MoCA) provides standardized assessment of immediate and delayed recall with validated cut scores. A score below 26/30 warrants further neuropsychological evaluation.</li>
<li><em>Abstraction:</em> The capacity to identify the conceptual similarity between two concrete items (proverb interpretation, similarities) — impaired in delirium, dementia, intellectual disability, and some psychotic disorders. Ask: "How are an apple and an orange alike?" (both fruit) or "What does 'a rolling stone gathers no moss' mean?"</li>
<li><em>Executive function:</em> Briefly assessed through the MoCA's trail-making (alternating letter-number sequence), clock drawing, and verbal fluency tasks. Executive dysfunction is characteristic of frontal lobe pathology, ADHD, and early Alzheimer's disease, where it may precede obvious memory impairment.</li>
</ul>
<p><strong>Insight and judgment:</strong> Insight and judgment are distinct constructs that both affect safety assessment and treatment planning. <em>Insight</em> refers to the client's awareness that they have a mental health condition and that their symptoms are symptoms of illness rather than reality. Insight exists on a continuum: full insight ("I know I have bipolar disorder and that what I'm experiencing is an episode") to partial insight ("I know something is wrong but I don't think it's really a psychiatric problem") to absent insight ("There is nothing wrong with me; other people are the problem"). Absent insight is one of the strongest predictors of treatment non-adherence and is particularly associated with psychotic disorders and mania. Document insight specifically: not just "insight intact" but "client demonstrated full insight, acknowledging that her anxiety is a treatable condition and expressing motivation for treatment."</p>
<p><em>Judgment</em> refers to the client's capacity to make reasonable decisions and consider consequences of actions. Assess through specific questions: "What would you do if you smelled smoke in a movie theater?" "If you found a stamped addressed envelope on the sidewalk, what would you do?" More clinically relevant: how is the client making decisions about their safety, their relationships, their finances, and their treatment? Document examples rather than conclusions: "Client demonstrated impaired judgment — despite active suicidal ideation and access to a firearm in the home, client refused to allow spouse to secure the firearm, stating 'I would never actually use it.'"</p>`
        },
        {
          type: 'text',
          content: `<h2>Suicide and Self-Harm Assessment in the Intake: Columbia Protocol Overview</h2>
<p>Suicide risk assessment is a core component of every intake evaluation and must be systematically conducted rather than completed only when the client spontaneously mentions suicidal thoughts. Research consistently demonstrates that direct, compassionate questioning about suicidal ideation does not increase risk — and may in fact reduce it by communicating that the clinician takes the client's safety seriously.</p>
<p><strong>Structured versus unstructured suicide risk assessment:</strong> Unstructured suicide risk assessment — the clinician's impressionistic judgment about risk level based on their overall impression of the client — is unreliable. Structured approaches that systematically assess identified risk factors, protective factors, ideation intensity, plan specificity, and access to means produce more consistent and documentable risk determinations. The structured professional judgment (SPJ) model, now the standard of care in suicide risk assessment, combines the systematic coverage of structured assessment with the integration of clinical reasoning to produce a risk determination and a level-of-care decision.</p>
<p><strong>The Columbia Suicide Severity Rating Scale (C-SSRS) in clinical practice:</strong> The C-SSRS, developed at Columbia University by Posner and colleagues, is the most widely adopted structured suicide risk assessment tool in clinical practice. It is free for clinical use, available in over twenty languages, and has been validated across clinical, community, and research settings. Its core contribution is the distinction between five levels of suicidal ideation, allowing clinicians to precisely characterize the nature and severity of ideation rather than treating suicidal thoughts as a binary present/absent variable:</p>
<ul>
<li><em>Level 1 — Passive ideation:</em> Wishes to be dead or not exist, without active thoughts of killing oneself ("I wish I could go to sleep and not wake up")</li>
<li><em>Level 2 — Active ideation without method:</em> Thoughts of killing oneself without specific plan or method</li>
<li><em>Level 3 — Active ideation with method, no plan or intent:</em> Thoughts of killing oneself with a specific method identified, but no plan for when, where, or how, and no intent to act</li>
<li><em>Level 4 — Active ideation with some intent to act, no specific plan:</em> Thoughts of killing oneself with some intent to act, though not yet a full plan</li>
<li><em>Level 5 — Active ideation with plan and intent:</em> Specific plan, access to means, and intent to act — the highest acute risk presentation</li>
</ul>
<p>The C-SSRS also separately assesses suicidal behavior (actual attempts, interrupted attempts, aborted attempts, and preparatory actions), which provides critical information about escalating risk. A client who has made preparatory actions (giving away possessions, researching methods, obtaining means) represents elevated acute risk even if their stated ideation level is relatively low.</p>
<p><strong>Means restriction counseling:</strong> Assessment of access to lethal means is a mandatory component of suicide risk assessment. Firearms are involved in more than half of all suicide deaths in the United States and represent by far the highest lethality method. When firearms are present in the home of a client with suicidal ideation, clinicians should directly discuss means restriction — whether temporarily removing the firearm from the home, storing it outside the home, or implementing a gun lock — as part of the safety plan. Counseling on means restriction is an evidence-based suicide prevention intervention that should be offered routinely and documented.</p>
<p><strong>Safety planning versus no-harm contracts:</strong> The contemporary standard of care for suicide risk management includes collaborative safety planning — developing a personalized plan with the client that identifies warning signs, internal coping strategies, social distractions, people to contact for support, professionals to contact, and steps for reducing access to means. Safety plans differ meaningfully from "no-harm contracts" (also called "no-suicide contracts"), which the evidence does not support as effective risk reduction tools and which may create false reassurance in both the clinician and the client. A completed, documented safety plan — co-developed with the client, not imposed — represents best practice and should be reviewed and updated at each subsequent session during periods of elevated risk. The Stanley-Brown Safety Planning Intervention (SPI) is the most empirically studied safety planning protocol and provides a structured template for clinicians developing individualized safety plans with clients in both outpatient and acute care settings.</p>`
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
<p><strong>Systematic symptom review</strong> — a clinical approach using a structured checklist to systematically cover all major diagnostic domains — is a practical middle ground accessible to all clinicians without formal structured interview training. It ensures that depression, mania, anxiety, psychosis, trauma, substance use, and other domains are covered in every intake, regardless of the presenting complaint.</p>
<h2>Structured Clinical Interviews: SCID-5, MINI, and CIDI in Depth</h2>
<p>The three most clinically significant structured and semi-structured diagnostic interviews are the SCID-5, the MINI, and the CIDI. Each has a distinct design philosophy, resource requirement, and clinical niche.</p>
<p><strong>The SCID-5 (Structured Clinical Interview for DSM-5):</strong> The SCID-5 is the gold-standard semi-structured diagnostic interview for DSM-5 disorders and the reference against which other diagnostic procedures are often validated. Developed by Michael First and colleagues at Columbia University, it is organized by module, with each module corresponding to a diagnostic category: mood episodes, psychotic symptoms, psychotic disorders, mood disorders, substance use disorders, anxiety disorders, OCD and related disorders, trauma- and stressor-related disorders, somatic symptom disorders, eating disorders, and ADHD. Within each module, the SCID-5 provides mandatory open-ended probe questions, specific follow-up queries, decision trees, and threshold criteria aligned with DSM-5 diagnostic criteria.</p>
<p>The SCID-5 exists in three versions: the Clinician Version (SCID-5-CV), which covers the most commonly encountered diagnoses in clinical practice; the Research Version (SCID-5-RV), which includes the full diagnostic range and additional specifiers; and the Personality Disorders Version (SCID-5-PD), which provides systematic assessment of all DSM-5 personality disorders. Administration time for the CV ranges from 45 to 90 minutes depending on the complexity of the presentation. Training in the SCID-5 typically involves reading the manual, practice interviews with supervision, and reliability calibration — a meaningful investment that yields substantial improvements in diagnostic accuracy.</p>
<p>In clinical practice, the SCID-5-CV is most appropriate in settings where comprehensive diagnostic evaluation is the primary service (inpatient, residential, forensic evaluation, disability assessment, research participation). It is less feasible in high-volume outpatient settings where intake appointments are brief. Even without administering the full SCID-5, clinicians can use its module structure as a template for their own systematic symptom review, ensuring equivalent coverage without equivalent time investment.</p>
<p><strong>The MINI (Mini International Neuropsychiatric Interview):</strong> The MINI was developed specifically to address the time constraints of community mental health and primary care settings while retaining psychometrically acceptable reliability. The current version (MINI 7.0, aligned with DSM-5) covers 23 diagnoses in approximately 15–30 minutes through yes/no branching questions with minimal open-ended probing. Its brevity comes at a cost in nuance — the MINI's yes/no format cannot capture the clinical complexity that semi-structured follow-up questions reveal — but its coverage, efficiency, and validated reliability (demonstrated in multiple international samples) make it the most practical structured assessment tool for busy outpatient settings.</p>
<p>The MINI's branching structure means that certain modules are only entered if gateway questions are positive. This efficiency reduces administration time but means that a negative gateway response (e.g., denying depressed mood and anhedonia) will result in the entire mood disorder module being skipped, even if the client has subsyndromal symptoms or presents their depression in atypical terms. Clinicians using the MINI should be alert to this limitation and probe beyond the instrument when clinical presentation warrants.</p>
<p><strong>The CIDI (Composite International Diagnostic Interview):</strong> The CIDI is a fully structured interview developed by the World Health Organization specifically for epidemiological research and cross-cultural comparisons. Unlike the SCID-5 and MINI, the CIDI requires no clinical training to administer — it is designed to be administered by trained lay interviewers following a scripted protocol. It generates DSM-5 and ICD-10 diagnoses across a comprehensive range of conditions and has been used in major epidemiological studies including the National Comorbidity Survey. While the CIDI is not typically used in clinical practice, clinicians in research-adjacent settings or working on community health projects should be familiar with it. Its existence and validity demonstrate that careful structure improves diagnostic reliability even without clinical inference, which is an important argument for incorporating structured elements into routine clinical practice.</p>
<h2>The DSM-5-TR Diagnostic Framework: Criteria, Differential Diagnosis, and Specifiers</h2>
<p>The DSM-5-TR (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision, 2022) is the primary diagnostic reference for mental health practice in the United States. Understanding its organizational structure and the clinical rationale behind its criteria hierarchies substantially improves diagnostic accuracy.</p>
<p><strong>Criteria hierarchy:</strong> Every DSM-5-TR diagnosis is structured around a hierarchy of criteria, typically labeled A through F or beyond:</p>
<ul>
<li><em>Criterion A</em> specifies the core symptom threshold — the minimum number and type of symptoms required. For MDD, five of nine symptoms including depressed mood or anhedonia. For GAD, excessive worry plus three of six somatic symptoms.</li>
<li><em>Criterion B</em> typically specifies duration or course — two weeks for MDD, six months for GAD, one month for PTSD.</li>
<li><em>Criterion C</em> specifies functional impairment or clinically significant distress — this threshold criterion separates diagnosable disorders from normal variation. Subclinical symptoms that do not cause significant distress or impairment do not meet diagnostic criteria, regardless of symptom count.</li>
<li><em>Exclusion criteria</em> (typically D and E) require ruling out medical causes, substance effects, and other psychiatric disorders that better explain the presentation. These criteria are not optional footnotes — they are core requirements for diagnosis.</li>
</ul>
<p>Clinicians who diagnose by symptom gestalt (rather than systematically applying each criterion) routinely miss exclusion criteria and misapply duration thresholds, leading to both over-diagnosis and under-diagnosis. Using a diagnostic checklist or structured instrument ensures full criteria application.</p>
<p><strong>The differential diagnosis process in practice:</strong> Generating and working through a differential requires moving through a logical sequence:</p>
<p><em>First, rule out organic causes.</em> "Could this be a medical condition presenting psychiatrically?" Depressive symptoms → hypothyroidism, anemia, vitamin D deficiency, sleep apnea, Addison's disease, malignancy. Anxiety symptoms → hyperthyroidism, pheochromocytoma, cardiac arrhythmia, pulmonary disease, caffeine excess. Psychotic symptoms → delirium, encephalitis, temporal lobe epilepsy, CNS mass, B12 deficiency. When in doubt, refer for medical evaluation before finalizing a primary psychiatric diagnosis.</p>
<p><em>Second, rule out substance-induced conditions.</em> Substances can cause and mimic every DSM-5-TR category. Alcohol causes depression and anxiety during use and intensified anxiety during withdrawal. Stimulants cause paranoia, grandiosity, and pressure of speech mimicking mania. Cannabis can induce psychotic symptoms. Benzodiazepine withdrawal can cause severe anxiety and seizure. A thorough substance use history — with specific quantity and frequency data — is diagnostically essential, not optional.</p>
<p><em>Third, consider the full differential within the appropriate diagnostic class.</em> For a presentation with depressed mood: MDD, bipolar depression (current depressive episode in bipolar I or II disorder), persistent depressive disorder, adjustment disorder with depressive mood, PTSD (emotional numbing and anhedonia), grief, PMDD, substance-induced depressive disorder, depressive disorder due to a medical condition. Each possibility must be systematically considered, not summarily dismissed.</p>
<p><strong>Specifiers and their clinical significance:</strong> DSM-5-TR specifiers are not administrative footnotes — they carry direct treatment implications. Clinicians who do not apply specifiers are missing clinically and therapeutically essential information:</p>
<ul>
<li><em>With anxious distress (MDD):</em> Clients with MDD plus anxious distress have a different risk profile (higher suicidality), different treatment response (may benefit from augmentation strategies), and require different pacing in therapy</li>
<li><em>With mixed features (MDD or bipolar):</em> The presence of mixed features (subthreshold manic symptoms during a depressive episode) is a critical specifier — antidepressant monotherapy in mixed presentations may worsen instability; mood stabilizers are typically preferred</li>
<li><em>With seasonal pattern (MDD or bipolar):</em> A seasonal pattern specifier opens evidence-based treatment options including light therapy and specific timing of pharmacotherapy</li>
<li><em>With peripartum onset (MDD):</em> Affects risk assessment (postpartum psychosis risk, infant safety), treatment selection (medication safety during breastfeeding), and the need for rapid response</li>
<li><em>Severity specifiers (mild/moderate/severe):</em> Determine level of care — severe episodes with psychotic features typically require higher-intensity intervention than mild episodes</li>
</ul>
<h2>Difficult Differential Diagnoses: Key Distinguishing Features</h2>
<p>Several diagnostic pairs present particular challenges in clinical assessment because they share overlapping symptom profiles. Mastery of these differential diagnoses is a hallmark of skilled clinical assessment.</p>
<p><strong>MDD versus Bipolar II Depression:</strong> This is among the most clinically consequential differential diagnoses in psychiatry. A client in a bipolar II depressive episode may be phenomenologically identical to a client with MDD — the depressive episode itself is not distinguishable at symptom level. The differential depends on lifetime history. Key distinguishing features of bipolar II that must be actively screened for include:</p>
<ul>
<li>History of hypomanic episodes (elevated or irritable mood with decreased need for sleep, increased goal-directed activity, impulsivity, or decreased inhibition for at least four consecutive days, at a level noticeable to others but not requiring hospitalization)</li>
<li>Earlier age of onset (bipolar disorder typically presents before age 25; first MDD episodes more commonly present in the 30s)</li>
<li>Higher number of prior depressive episodes (three or more prior episodes increases bipolar probability)</li>
<li>Family history of bipolar disorder</li>
<li>Seasonal pattern or postpartum onset</li>
<li>Antidepressant-induced hypomania or rapid cycling history</li>
<li>Hypersomnia and leaden paralysis (atypical depressive features more common in bipolar depression)</li>
</ul>
<p>The clinical stakes are high: misdiagnosis of bipolar II as MDD and antidepressant monotherapy may induce mixed states, rapid cycling, or hypomania, worsening the overall course of illness. Clinicians should routinely screen every depressed client for lifetime hypomanic symptoms using specific probe questions: "Have you ever had periods — even brief periods — when you needed much less sleep than usual but still felt energized? When you were unusually productive, creative, or social? When you took risks or spent money in ways that were out of character for you?"</p>
<p><strong>PTSD versus Borderline Personality Disorder:</strong> PTSD and BPD share a striking symptom overlap: emotional dysregulation, impulsivity, interpersonal sensitivity, dissociation, self-harm behaviors, and trauma history. The clinical distinction matters for case conceptualization, treatment selection, and prognostication — but is less clear-cut than many training programs suggest. Several clinical realities must be held simultaneously:</p>
<ul>
<li>BPD and PTSD co-occur in approximately 25–30% of BPD cases — a dual diagnosis is common and clinically accurate for many presentations</li>
<li>BPD is a developmental disorder characterized by pervasive identity diffusion, chronic emptiness, frantic efforts to avoid abandonment, and splitting defenses — features that are generally ego-syntonic and longstanding, not episodic</li>
<li>PTSD is a trauma-response syndrome characterized by intrusion symptoms (flashbacks, nightmares), avoidance, negative alterations in cognition and mood, and hyperarousal — symptoms that are generally ego-dystonic, trauma-linked, and episodically intensified by triggers</li>
<li>Key distinguishing questions: Is the emotional dysregulation primarily triggered by trauma-related cues, or is it pervasive across contexts? Is there a stable sense of core identity, even if it feels painful, or is there profound identity confusion? Is the self-harm primarily self-soothing or emotion-regulation (more BPD-typical) or primarily intrusive and unwanted (more PTSD-typical)? Is there a clear developmental history of identity disruption from early childhood onward (BPD) or a documented change in functioning following identifiable traumatic events (PTSD)?</li>
</ul>
<p><strong>ADHD versus Anxiety Disorders:</strong> Both ADHD and anxiety disorders cause difficulty concentrating, restlessness, sleep disturbance, and functional impairment. The differential is further complicated by high comorbidity rates — ADHD and anxiety co-occur in approximately 50% of adult ADHD cases. Key distinguishing features:</p>
<ul>
<li>In ADHD, concentration difficulties are pervasive and present even in the absence of worry — the client cannot sustain attention even on enjoyable, low-demand tasks. In anxiety, concentration difficulties are secondary to preoccupation — the client has sufficient attentional capacity when worry is controlled.</li>
<li>ADHD is developmental — onset before age 12 is required by DSM-5-TR, and symptoms should be documentable in multiple settings from childhood onward. Anxiety disorders can emerge at any age, often precipitated by identifiable stressors.</li>
<li>In ADHD, restlessness is motorically driven (fidgeting, need to move, difficulty sitting still). In anxiety, restlessness is psychologically driven (inner tension, inability to relax mentally).</li>
<li>Collect collateral history from family members or review school records when ADHD is suspected — adult self-report of childhood ADHD symptoms has poor accuracy without corroboration.</li>
</ul>
<p><strong>Substance-Induced versus Primary Psychiatric Disorders:</strong> DSM-5-TR requires distinguishing substance-induced psychiatric conditions (which arise directly from substance use or withdrawal and resolve with abstinence) from primary psychiatric disorders (which exist independently of substance use, though may be worsened by it). The distinction is clinically important because the treatment paths diverge. Key assessment strategies:</p>
<ul>
<li>Ask about the temporal relationship: "Did you notice the depression/anxiety/psychotic symptoms first, or did the substance use come first?" "Do your symptoms persist for significant periods when you are not using?"</li>
<li>Assess symptom pattern during sustained abstinence: If symptoms persist for four or more weeks after substance cessation, primary psychiatric diagnosis becomes increasingly likely</li>
<li>Consider the pharmacology: Stimulant use causes anxiety and paranoia; alcohol causes dysphoria; opioid withdrawal causes severe anxiety; benzodiazepine withdrawal causes seizures and acute anxiety. Know which symptoms a given substance produces to assess plausibility</li>
<li>When uncertainty persists, use a provisional diagnosis with temporal qualification: "Depressive disorder, unspecified — rule out substance-induced depressive disorder" — and reassess after a period of monitored abstinence</li>
</ul>
<h2>Documenting Diagnosis Ethically and Accurately</h2>
<p>Ethical diagnosis documentation requires honoring clinical uncertainty while meeting professional and legal obligations. Several documentation practices are essential to accurate and ethical clinical assessment records:</p>
<p><strong>Provisional diagnosis:</strong> When diagnostic criteria are met by current information but more information is needed to confirm (e.g., first episode with no prior history, insufficient collateral, or diagnostic ambiguity between two conditions), documenting a provisional diagnosis with the qualifier "provisional" is appropriate and more accurate than either refusing to diagnose or asserting certainty prematurely. Example: "Major Depressive Disorder, moderate severity, provisional — rule out Bipolar II Depression." A provisional diagnosis creates a clinical obligation to continue gathering information, not permission to stop assessing.</p>
<p><strong>Rule-out diagnoses:</strong> When a diagnosis is being actively considered but insufficient evidence exists to confirm or exclude it, "rule out [diagnosis]" notation is appropriate. This signals to subsequent treaters that the condition requires monitoring and further assessment and protects against premature closure.</p>
<p><strong>Z-codes:</strong> The DSM-5-TR Z-codes (derived from ICD-10-CM) document clinically relevant psychosocial and contextual factors that are not mental disorders but affect diagnosis, treatment, and prognosis. Z-codes are chronically underutilized and represent significant documentation opportunities: Z55 (educational problems), Z56 (work-related problems), Z59 (housing instability, homelessness), Z60 (social environment problems), Z62 (upbringing issues), Z63 (family relationship problems), Z65 (legal system involvement). Documenting Z-codes acknowledges the social determinants of mental health and creates a complete clinical picture.</p>
<p><strong>Biopsychosocial summary in the assessment report:</strong> Best-practice intake documentation includes a biopsychosocial summary that moves beyond diagnosis to explain the clinical formulation: why this presentation, for this person, at this time. A complete biopsychosocial summary documents predisposing vulnerabilities, precipitating events, perpetuating factors, and protective factors — the information that will directly shape the treatment plan.</p>
<h2>Trauma Screening in the Assessment Context</h2>
<p>Trauma-informed care begins at the assessment stage. Trauma screening should be universal — incorporated into every intake, regardless of presenting complaint — because many clients with trauma histories do not spontaneously disclose trauma, do not identify their symptoms as trauma-related, or present with somatic or behavioral complaints that mask underlying post-traumatic symptoms.</p>
<p><strong>Why universal trauma screening matters:</strong> Research consistently documents that trauma history is common in clinical populations (prevalence estimates of 70–80% in mental health settings), that clinicians frequently fail to ask about trauma without structured prompting, and that unidentified trauma histories lead to ineffective or contraindicated treatment approaches. A client with unidentified PTSD who is treated with supportive-exploratory psychotherapy without trauma processing may experience symptom escalation; a client with combat-related PTSD treated with CBT alone without exposure-based work may not achieve recovery.</p>
<p><strong>Trauma screening tools:</strong></p>
<ul>
<li>The <em>PC-PTSD-5 (Primary Care PTSD Screen for DSM-5)</em> begins with a single trauma exposure question, then asks five yes/no questions about PTSD symptoms. Three or more positive responses indicate a positive screen warranting clinical follow-up. Appropriate for initial screening in all adult clinical populations.</li>
<li>The <em>Trauma History Screen (THS)</em> is a 14-item measure assessing lifetime exposure to 13 types of traumatic events, making it useful for comprehensive trauma history documentation rather than brief screening.</li>
<li>The <em>Life Events Checklist for DSM-5 (LEC-5)</em>, used as part of the PCL-5 administration, assesses 17 types of potentially traumatic events with three response options (happened to me, witnessed it, learned about it happening to someone close to me).</li>
</ul>
<p><strong>Asking about trauma sensitively:</strong> How trauma questions are asked matters as much as whether they are asked. Best practices include:</p>
<ul>
<li>Normalize before asking: "As part of our standard intake, I ask everyone about past difficult or traumatic experiences, because they often affect mental health in ways that are important to understand."</li>
<li>Use behaviorally specific questions rather than the word "trauma" or "abuse," which some clients may not apply to their own experiences: "Has anyone ever hurt you physically or sexually?" "Have you ever witnessed something violent or frightening?" "Have you experienced any events that felt life-threatening?"</li>
<li>Separate disclosure from processing: The intake trauma screen is not a trauma processing session. Gather enough information to inform the assessment and indicate that you're glad they shared. Processing happens in the course of treatment, not the intake.</li>
<li>Assess the client's readiness and current coping capacity before inquiring into traumatic details. If the client appears destabilized by trauma questions, pause, offer grounding, and note that the topic can be revisited when they feel more prepared.</li>
</ul>
<p><strong>Integrating trauma history into the diagnostic formulation:</strong> Trauma history informs nearly every diagnostic category. Complex developmental trauma (repeated interpersonal trauma beginning in childhood) produces a constellation of symptoms across multiple DSM categories — dissociation, affect dysregulation, negative self-concept, interpersonal difficulties — that may lead to multiple diagnoses (PTSD, MDD, BPD) without a unifying conceptualization. Recognizing complex trauma as a developmental disruption helps clinicians understand the client's full presentation as coherent rather than as a collection of comorbid categorical diagnoses, which has direct implications for treatment sequencing and approach.</p>`
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
          content: `<h2>The Cultural Formulation Interview: Modules and Clinical Application</h2>
<p>The DSM-5-TR Cultural Formulation Interview (CFI) was developed through WHO field trials and validated across sixteen countries as a practical clinical tool for eliciting culturally relevant information during psychiatric and mental health assessment. Its 16 core items are organized across four domains — cultural definition of the problem, cultural perceptions of cause and context, cultural factors affecting self-coping and past help-seeking, and cultural factors affecting current help-seeking — and can be administered in approximately 15–20 minutes with most clients.</p>
<p><strong>Domain 1 — Cultural definition of the problem:</strong> The CFI opens by asking the client to describe their problem in their own words, then explores how their family, community, or cultural background understands what is happening. Questions probe whether there are cultural terms or phrases that best capture the experience, and what the client believes is most distressing about the situation. This domain serves a dual function: it elicits the client's explanatory model of their distress (which informs engagement, psychoeducation, and treatment collaboration) and it identifies whether the client's presentation involves cultural idioms of distress that may not map to DSM categories.</p>
<p><strong>Domain 2 — Cultural perceptions of cause, context, and support:</strong> The CFI explores what the client and their community believe has caused the problem — whether they attribute it to stress, spiritual causes, family conflict, life circumstances, personal weakness, or illness. This domain also explores cultural sources of support: who in the client's community do they turn to? What has been helpful or unhelpful in the past? Cultural strengths and community resources that may not be visible to the clinician are surfaced here and can be directly incorporated into the treatment plan.</p>
<p><strong>Domain 3 — Cultural factors affecting self-coping and past help-seeking:</strong> This domain explores what the client has already tried — self-care practices, traditional or complementary healing, religious resources, family counsel, prior professional treatment — and how cultural background has shaped their approach to seeking help and their expectations of mental health care. Clinicians learn about barriers the client anticipates (stigma in their community, confidentiality concerns, distrust of mental health systems based on historical or personal experience with discrimination) and can address these proactively.</p>
<p><strong>Domain 4 — Cultural factors affecting current help-seeking and the therapeutic relationship:</strong> The final domain examines the client's preferences, concerns, and expectations regarding the current treatment relationship, and whether cultural or ethnic differences between client and clinician might affect trust, disclosure, or communication. The CFI normalizes this conversation in a way that many clinicians find uncomfortable to initiate without a structured prompt, and opens space for clients to express cultural preferences (e.g., preference for a clinician of the same background, concerns about cultural misunderstanding, or previous negative experiences with mental health providers).</p>
<p><strong>Supplementary modules:</strong> The DSM-5-TR CFI includes twelve supplementary modules for more in-depth assessment in specific domains: explanatory models, level of functioning, social network, psychosocial stressors, spirituality/religion/moral traditions, cultural identity, coping and help-seeking, patient-clinician relationship, school-age children and adolescents, older adults, immigrants and refugees, and caregivers. The supplementary modules are administered selectively based on clinical relevance — a refugee client may warrant the immigrants and refugees module; an older adult client with cognitive complaints may warrant the older adults module.</p>
<p><strong>How to incorporate the CFI without making it feel scripted:</strong> The CFI is most effective when integrated into the intake conversationally rather than administered as a separate questionnaire battery. Introduce it with normalization: "As part of our intake, I always want to understand how you and the people close to you see what's been happening — sometimes that gives me important information I wouldn't get otherwise." Then use CFI items as prompts that guide follow-up questioning rather than as checklist items to be read verbatim. The goal is cultural depth and therapeutic alliance, not procedural compliance.</p>`
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
