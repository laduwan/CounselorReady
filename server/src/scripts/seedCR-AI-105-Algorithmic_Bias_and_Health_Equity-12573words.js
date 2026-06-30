import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && !process.env.DRY_RUN) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'algorithmic-bias-and-health-equity-in-mental-health-ai';

const COURSE = {
  title: 'Algorithmic Bias and Health Equity in Mental Health AI',
  slug: SLUG, courseCode: 'CR-AI-105',
  subtitle: 'Recognizing, Auditing, and Mitigating Inequity in Clinical Algorithms',
  description: 'A 2-hour intermediate CE course for licensed mental health professionals examining how bias enters clinical artificial-intelligence systems, the documented disparities these systems can produce in mental-health care, and the equity frameworks and clinician responsibilities required to use such tools justly. Grounded in peer-reviewed scholarship including Obermeyer et al. (2019), Gianfrancesco et al. (2018), and Char et al. (2018). 12,573 words.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'Cultural', ceCategory: 'Cultural', contentArea: 'Social and Cultural Foundations',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Social and Cultural Foundations'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with expertise in multicultural counseling and health equity.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychologists) committed to culturally responsive, equitable use of AI in clinical care.'],
  tags: ['algorithmic bias','health equity','social justice','artificial intelligence','cultural competence'],
  objectives: [
    'Describe at least five distinct mechanisms by which bias enters clinical artificial-intelligence systems, and differentiate systematic bias from random noise.',
    'Analyze documented cases of inequity in healthcare and mental-health algorithms, including the Obermeyer et al. (2019) cost-as-proxy study and electronic-health-record bias.',
    'Compare competing definitions of algorithmic fairness and explain why several fairness criteria cannot be satisfied simultaneously.',
    'Apply bias-auditing tools — including model cards, datasheets for datasets, and participatory design — to the appraisal of a mental-health AI tool.',
    'Implement the clinician responsibilities of informed skepticism, documentation of overrides, advocacy, and cultural humility when integrating AI into clinical decision-making.',
  ],

  sections: [
    {
      title: 'How Bias Enters AI Systems',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '1', title: 'How Bias Enters AI Systems', subtitle: 'Training-data bias, label bias, sampling and measurement bias, deployment bias, and the difference between bias and noise', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Where Algorithmic Bias Comes From</h2>
<p>Artificial-intelligence systems in mental health are frequently described, in marketing and even in some scholarly writing, as "objective" alternatives to fallible human judgment. The premise is intuitively appealing: a model does not get tired, does not have a bad day, and does not consciously prefer one patient over another. Yet the premise is mistaken in an important way. A machine-learning model is not a neutral observer of the world; it is a compressed statistical summary of the data it was trained on. If the data encode the inequities of the health system that produced them — and health data almost always do — then the model will reproduce, and frequently amplify, those inequities while wearing the appearance of objectivity. Understanding exactly how bias enters these systems is the necessary first step for any clinician who will rely on their output.</p>
<p>It is useful to begin with a definition. In the machine-learning literature, <strong>bias</strong> refers to a systematic error: an error that is patterned, repeatable, and tied to some feature of the data or the modeling process, rather than scattered randomly. When a model is systematically less accurate for one demographic group than another, that is algorithmic bias. When a model systematically under-predicts the severity of a condition for patients who historically received less care, that is algorithmic bias. The key word is <em>systematic</em>. A model that is equally and randomly wrong across all groups is merely imprecise; a model that is reliably more wrong for some groups than others is biased, and that pattern of differential error is where the equity harm lives.</p>
<p>Bias does not enter through a single door. It accumulates across the entire lifecycle of a model — from how the underlying records were generated, to how the target variable was chosen, to how the training sample was assembled, to how the finished tool is deployed in a real clinical workflow. Mehrabi and colleagues (2021), in their widely cited survey of bias and fairness in machine learning, catalog more than twenty distinct bias sources arising at different stages of this pipeline. For the practicing clinician, it is not necessary to memorize every category, but it is essential to recognize the major mechanisms, because each one calls for a different kind of skepticism when you are appraising a tool.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Historical Inequity Encoded in the Records</h2>
<p>The most fundamental source of bias is that the data themselves are a record of an unequal world. Health records do not document need in some pure, unmediated form; they document care that was actually delivered, decisions that were actually made, and diagnoses that were actually assigned — all of which were shaped by access barriers, clinician judgment, insurance status, and structural racism. When a Black patient historically received fewer referrals, fewer specialist visits, and less aggressive pain management than a comparable white patient, the record of that patient contains fewer encounters, fewer procedures, and lower documented "utilization," even though the underlying clinical need may have been identical or greater. A model trained on those records learns the pattern of unequal treatment as if it were a pattern of unequal need.</p>
<p>This is the deepest trap in clinical AI, and it is easy to miss because it requires no malice and no error in the modeling itself. The algorithm can be statistically flawless at predicting the target it was given; the problem is that the historical data defined the target in a way that already embedded inequity. Char, Shah, and Magnus (2018), in their <em>New England Journal of Medicine</em> analysis of the ethics of machine learning in healthcare, warn precisely about this: a system trained to replicate clinician decisions will replicate clinician biases, and a system trained on outcomes shaped by unequal access will treat unequal access as ground truth. The model is not inventing the disparity. It is faithfully learning a disparity that the health system already produced, and then projecting it forward onto new patients at scale.</p>
<p>In mental health specifically, the historical record is shaped by well-documented diagnostic disparities. Schizophrenia and other psychotic-spectrum disorders have historically been over-diagnosed in Black patients, while mood disorders have been under-diagnosed; conversely, certain internalizing conditions have been under-recognized in populations whose distress is read by clinicians as something other than a treatable disorder. A model that learns from these labeled records inherits the diagnostic lens of the clinicians who created them, with all of its cultural and racial distortions intact.</p>`,
        },
        {
          type: 'imageText', order: 4,
          title: 'The Pipeline Is the Problem',
          content: `<p>It is tempting to locate "the bias" in a single place — a bad dataset, a careless modeler, a flawed algorithm. In reality, bias is distributed across the entire pipeline: data generation, target selection, sampling, measurement, model training, and deployment. A tool can be biased even when every individual step looks defensible in isolation, because the harms compound. This is why responsible appraisal asks about the whole lifecycle, not just the accuracy number printed on the marketing sheet.</p>`,
          image: '', imageAlt: 'Diagram of a machine-learning pipeline showing bias entering at the data, label, sampling, measurement, and deployment stages', imagePosition: 'right',
        },
        {
          type: 'text', order: 5,
          content: `<h2>Label Bias, Sampling Bias, and Measurement Bias</h2>
<p><strong>Label bias</strong> arises from how the thing the model is asked to predict — the "label" or target variable — is defined and recorded. Suppose a developer wants to build a model that flags patients at high risk of a mental-health crisis. There is no clean, objective "crisis" variable sitting in the record; the developer must operationalize it, perhaps as "had a psychiatric emergency-department visit" or "was placed on an involuntary hold." But emergency-department use and involuntary holds are themselves shaped by who has access to outpatient care, who is perceived by responders as dangerous, and which communities are policed more heavily. The label is a proxy, and the proxy carries its own bias. The model becomes excellent at predicting the proxy and is mistakenly treated as if it predicts the underlying clinical reality.</p>
<p><strong>Sampling and representation bias</strong> arises when the population in the training data does not match the population the tool will be used on. If a depression-screening model was developed and validated largely on data from well-insured, English-speaking, urban patients, its performance on rural patients, on patients who use interpreters, or on patients from communities that were underrepresented in the sample is simply unknown — and "unknown" frequently turns out to mean "worse." A model cannot learn patterns it never saw. When a group is sparse in the training data, the model's estimates for that group rest on less evidence and are correspondingly less reliable, even though the tool returns its predictions for everyone with the same confident interface.</p>
<p><strong>Measurement bias</strong> arises when the features the model uses are measured differently, or mean different things, across groups. A pulse-oximetry reading, a wearable's heart-rate-variability estimate, or a sentiment score derived from a patient's written words can all be systematically less accurate for some populations because of the physics of the sensor, the demographics of the device's calibration data, or the linguistic and cultural assumptions baked into the text model. When an input is mismeasured for a group, every downstream prediction built on that input inherits the error.</p>`,
        },
        {
          type: 'text', order: 6,
          content: `<h2>Deployment Bias and the Difference Between Bias and Noise</h2>
<p><strong>Deployment bias</strong> occurs when a tool that was reasonable in the abstract is used in a context, or for a purpose, that its design never anticipated. A risk score built to help allocate extra outpatient support — a benign, additive use — becomes something very different if a system instead uses it to decide who is "too high-risk" to enroll, or who should be subjected to closer surveillance. The same number, deployed differently, shifts from a tool of help to a tool of exclusion. Deployment bias also includes <em>automation bias</em>: the well-documented human tendency to over-trust a computer's recommendation and to under-weight one's own contradicting judgment, which can convert a merely-flawed model into a harmful one by removing the human check that was supposed to catch its errors.</p>
<p>Finally, clinicians must be able to distinguish <strong>bias</strong> from <strong>noise</strong>, because the two demand different responses. Noise is random, unpatterned error — the scatter you get when a measurement is imprecise but not skewed in any particular direction. Averaged over many cases, noise tends to cancel out, and it does not, by itself, advantage or disadvantage any group. Bias is systematic, directional error that does not cancel out — it pushes predictions consistently in one direction for an identifiable group. A model can be both noisy and biased at once. The crucial point for equity is that you cannot fix bias by collecting more data of the same kind: more data reduces noise, but a biased data-generating process produces more biased data. Telling the two apart is a core skill of informed appraisal, and the rest of this course builds on it.</p>`,
        },
        {
          type: 'text', order: 6.5,
          content: `<h2>Aggregation Bias and the Myth of the Average Patient</h2>
<p>One further mechanism deserves explicit attention because it is so easy to overlook: <strong>aggregation bias</strong>. Aggregation bias occurs when a single model is trained on a pooled, heterogeneous population under the assumption that one set of relationships holds for everyone, even though the true relationships differ across subgroups. The classic illustration in general medicine is diabetes management, where the relationship between a common blood marker and average glucose differs across ethnic groups; a single model that ignores this difference is systematically wrong for the groups whose physiology departs from the pooled average. The model is optimized for an "average patient" who, in a diverse population, may not correspond to any real person at all.</p>
<p>In mental health, aggregation bias is pervasive because the meaning of symptoms, the idioms of distress, and the relationship between observable signs and underlying conditions vary substantially across cultures and communities. A model that learns a single mapping from words, behaviors, or physiological signals to a diagnosis will fit best the group that dominated its training data and fit progressively worse the further a patient departs from that center of gravity. The harm is quiet precisely because the model performs well on the aggregate metric the developer reports; the subgroups for whom the single model is a poor fit are invisible in that number. Addressing aggregation bias may require subgroup-specific models, explicit interaction terms, or, at minimum, rigorous subgroup evaluation — none of which happens unless someone insists on it.</p>
<p>Two practical lessons follow. First, the question "does this model work?" is incomplete; the only meaningful question is "does this model work for the specific patient in front of me, given what is known about its performance for people like them?" Second, a model that has never been evaluated separately for the subgroups a clinician serves should be presumed to carry unknown subgroup risk, because the absence of subgroup evaluation is not evidence of subgroup safety. These two lessons — particularize the question, and treat undocumented subgroup performance as a red flag — recur throughout the rest of this course and form the backbone of responsible appraisal.</p>
<p>It is worth pausing on why these failures are so persistent despite good intentions. Development teams are frequently homogeneous, deadlines reward optimizing a single headline metric, and the populations most affected by bias are often those least represented in the rooms where design decisions are made. None of this requires bad actors; ordinary incentives, left unexamined, reliably produce inequitable tools. That is exactly why the corrective cannot be left to good intentions alone and must instead be built into documentation, auditing, and the habits of the clinicians who deploy these systems at the point of care.</p>`,
        },
        {
          type: 'callout', order: 7, calloutType: 'key', title: 'Five Mechanisms of Algorithmic Bias',
          content: '<ol><li><strong>Historical bias</strong> — the data faithfully record an unequal world, so the model learns inequity as if it were need.</li><li><strong>Label/target bias</strong> — the variable the model predicts is a proxy (cost, ED visits, holds) that carries its own inequities.</li><li><strong>Sampling/representation bias</strong> — underrepresented groups are predicted less reliably because the model saw fewer of them.</li><li><strong>Measurement bias</strong> — inputs (sensors, text, scores) are systematically less accurate for some groups.</li><li><strong>Deployment bias</strong> — a tool is used in a context, or with a degree of trust, its design never justified.</li></ol>',
        },
        {
          type: 'accordion', order: 8, title: 'Common Misconceptions About AI Objectivity',
          accordionItems: [
            { title: '"The model is objective because it is math."', content: '<p>Mathematics is applied to data that humans selected, labeled, and generated within a biased system. The objectivity of the arithmetic does not transfer to the fairness of the inputs. A precise calculation on a biased dataset yields a precise, biased answer.</p>' },
            { title: '"If we just remove race from the model, it will be fair."', content: '<p>Removing the explicit race variable rarely removes racial bias, because many other features — ZIP code, insurance type, prior utilization, language — act as correlated proxies for race. A model can reconstruct the protected attribute from these proxies and continue to discriminate. Sometimes including the attribute is necessary precisely so that bias can be measured and corrected.</p>' },
            { title: '"More data will fix the bias."', content: '<p>More data reduces random noise, but if the data-generating process is biased, more of it simply produces more biased data. Scaling a biased pipeline scales the harm. Bias is addressed by changing what is measured and how the target is defined, not merely by collecting larger samples.</p>' },
            { title: '"The vendor validated it, so it works for my patients."', content: '<p>Validation is population-specific. A tool validated on one population may perform very differently on yours. Always ask which population the validation sample reflected, and whether your patients resemble it on the dimensions — race, language, insurance, geography — that drive performance.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'A model is trained to predict mental-health "need" using historical utilization data. Black patients in those records received fewer services for the same clinical severity. What kind of bias is most directly at work?',
          options: [
            { text: 'Random measurement noise that will cancel out across a large sample', isCorrect: false },
            { text: 'Historical bias — the data encode unequal treatment, which the model learns as unequal need', isCorrect: true },
            { text: 'Deployment bias introduced only when the tool is used in the clinic', isCorrect: false },
            { text: 'A purely technical error in the model\'s optimization algorithm', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'When utilization stands in for need, historical under-treatment of a group is encoded as lower predicted need. The algorithm faithfully learns a disparity the health system already produced — this is historical bias operating through a biased proxy.',
        },
        {
          type: 'multiSelect', order: 10,
          question: 'Which of the following are genuine sources of bias in a clinical machine-learning system? (Select all that apply)',
          options: [
            { text: 'The target variable is a proxy (e.g., ED visits) shaped by access and policing patterns', isCorrect: true },
            { text: 'Underrepresented groups appear sparsely in the training sample', isCorrect: true },
            { text: 'A sensor or text model measures an input less accurately for some groups', isCorrect: true },
            { text: 'The model uses floating-point arithmetic instead of integers', isCorrect: false },
            { text: 'Clinicians over-trust the tool and stop applying their own judgment', isCorrect: true },
          ],
          explanation: 'Label/target bias, sampling bias, measurement bias, and deployment bias (including automation bias) are all real mechanisms. The numeric representation used internally is not a source of demographic bias.',
        },
        {
          type: 'fillInBlank', order: 11, title: 'Bias Versus Noise',
          blanks: [
            { prompt: 'Error that is patterned, repeatable, and tied to a group is called systematic error, or ____.', answer: 'bias', acceptAlternates: ['algorithmic bias'] },
            { prompt: 'Error that is random and unpatterned, tending to cancel out across cases, is called ____.', answer: 'noise', acceptAlternates: ['random noise'] },
            { prompt: 'Collecting more data of the same kind reduces noise but does NOT fix ____.', answer: 'bias', acceptAlternates: ['systematic bias'] },
          ],
        },
        {
          type: 'cardSort', order: 12,
          instructions: 'Sort each example into the bias mechanism it best illustrates.',
          categories: ['Data/Historical', 'Deployment'],
          cards: [
            { id: 'c1', text: 'Records show a group received fewer referrals for equal severity, and the model learns this as lower need.', correctCategory: 'Data/Historical' },
            { id: 'c2', text: 'A diagnostic label was historically over-assigned to one racial group by clinicians.', correctCategory: 'Data/Historical' },
            { id: 'c3', text: 'A clinician accepts the AI\'s recommendation without review because "the computer is usually right."', correctCategory: 'Deployment' },
            { id: 'c4', text: 'A support-allocation score is repurposed to exclude high-risk patients from a program.', correctCategory: 'Deployment' },
            { id: 'c5', text: 'Past insurance-driven care decisions are baked into the training labels.', correctCategory: 'Data/Historical' },
            { id: 'c6', text: 'A tool validated for outpatient triage is used to justify involuntary holds.', correctCategory: 'Deployment' },
          ],
        },
        {
          type: 'videoEmbed', order: 13,
          videoTitle: 'How Bias Gets Into Algorithms',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aibias',
          description: 'A short overview of the points in a machine-learning pipeline where bias enters, and why "objective" systems can produce systematically unequal outputs.',
        },
        { type: 'reflection', order: 14, question: 'Think of one AI-assisted or algorithmic tool you have encountered in your own clinical setting (a risk flag, a screening score, a documentation aid, a scheduling or triage system). Which of the five bias mechanisms described here is it most vulnerable to, and what would you need to know about its training data to judge whether it is safe for your patients?' },
        { type: 'keyTakeaway', order: 15, title: 'Key Takeaways', takeaways: [
          'Machine-learning models are statistical summaries of biased health data, not neutral observers; "objective" is a marketing claim, not a property of the math.',
          'Bias is systematic, group-linked error; noise is random, unpatterned error. Only the former creates equity harm, and more data fixes only the latter.',
          'Bias enters across the whole pipeline: historical data, the chosen label, the sampled population, the measured inputs, and the deployment context.',
          'Removing the race variable does not remove racial bias, because proxies like ZIP code and insurance reconstruct it; deployment and automation bias can turn a flawed tool into a harmful one.',
        ] },
      ],
    },

    {
      title: 'Documented Disparities in Mental Health AI',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '2', title: 'Documented Disparities in Mental Health AI', subtitle: 'The Obermeyer cost-as-proxy study, diagnostic disparities, NLP and speech gaps, sensor and affect-sensing failures, and why mental health is high-stakes', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>The Obermeyer Study: Cost as a Proxy for Need</h2>
<p>The single most instructive documented case of algorithmic bias in health care is the study by Obermeyer, Powers, Vogeli, and Mullainathan, published in <em>Science</em> in 2019. The researchers examined a commercial risk-prediction algorithm — one used at scale by health systems to identify patients with complex needs who should receive extra care-management resources. The algorithm was not designed to be racist, and it did not use race as an input. Yet the researchers found that, at any given risk score, Black patients were considerably sicker than white patients. Put differently, a Black patient and a white patient flagged as equally "high-risk" by the algorithm were not equally sick at all; the Black patient typically had more chronic conditions and worse measured physiology. The algorithm was systematically underestimating the needs of Black patients.</p>
<p>The mechanism is a near-perfect illustration of label bias. The developers had used <strong>future healthcare cost</strong> as a proxy for healthcare need — a choice that seems reasonable on its face, because sicker patients usually generate more cost. But cost is generated by care that is actually delivered, and Black patients, because of access barriers, discrimination, and lower trust born of historical mistreatment, generated less cost at every level of illness. The algorithm learned, accurately, that Black patients cost less. It then translated "costs less" into "needs less," and steered care-management resources away from them. Obermeyer and colleagues estimated that correcting the bias would have more than doubled the percentage of Black patients automatically identified for extra help, from roughly 18% to about 47%.</p>
<p>The study is important precisely because nothing was obviously wrong. The data were not falsified, the math was not broken, and no one intended harm. The bias lived entirely in the choice of target variable — a choice that quietly imported decades of unequal access into a tool that then perpetuated it at the scale of millions of patients. For mental-health clinicians, the lesson generalizes directly: whenever an AI tool predicts a proxy (cost, utilization, ED visits, holds, no-shows), ask what unequal process generated that proxy before trusting the score.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Diagnostic Disparities Encoded in the Electronic Health Record</h2>
<p>Gianfrancesco, Tamang, Yazdany, and Schmajuk (2018), writing in <em>JAMA Internal Medicine</em>, examined the potential for bias when machine-learning models are trained on electronic health record (EHR) data. They identified several routes by which EHR-based models can systematically disadvantage vulnerable populations. Patients with limited access to care have sparser records — fewer visits, fewer labs, fewer notes — so the model has less information about them and tends to perform worse, while a longer record can itself reflect either sicker patients or simply better-resourced ones. Missing data are not missing at random; they are missing in patterns that track socioeconomic status, language, and race. When a model treats a missing value as "normal" or imputes it from the majority population, it can erase exactly the signal that mattered for an underserved patient.</p>
<p>In mental health, these EHR distortions compound long-standing diagnostic disparities. The over-diagnosis of schizophrenia in Black men and the under-diagnosis of mood and anxiety disorders in several minority populations are documented in the clinical literature spanning decades. When a model learns from diagnosis codes, it inherits the clinician's diagnostic lens — including its racial and cultural distortions — and may then propagate those distortions forward, lending them the false authority of an algorithm. A predictive model trained on biased labels does not merely repeat the bias; it can launder it, converting a contestable human judgment into a number that looks settled and scientific.</p>
<p>Gianfrancesco and colleagues also caution about <strong>feedback loops</strong>. If a biased model influences which patients are flagged, monitored, or treated, it changes the future data that the next generation of models will learn from. A model that under-serves a group generates records showing that group received less care, which a future model again reads as lower need. Without deliberate intervention, the system can spiral, each generation of model entrenching the inequity of the last.</p>`,
        },
        {
          type: 'imageText', order: 4,
          title: 'Why Mental Health Is High-Stakes',
          content: `<p>Algorithmic errors in mental-health contexts carry distinctive risks. A biased risk flag can influence involuntary holds, custody and competency evaluations, eligibility for scarce programs, or the level of surveillance a patient is subjected to. These are liberty- and dignity-affecting decisions, not merely clinical conveniences. The combination of stigmatized conditions, life-altering consequences, and historically inequitable systems makes mental health one of the highest-stakes domains for clinical AI — and one where uncritical adoption can do the most harm.</p>`,
          image: '', imageAlt: 'Illustration contrasting low-stakes and high-stakes algorithmic decisions in mental-health care', imagePosition: 'left',
        },
        {
          type: 'text', order: 5,
          content: `<h2>Language, Speech, and the Limits of NLP</h2>
<p>A growing class of mental-health tools relies on natural-language processing (NLP) — analyzing the words patients write or speak to estimate mood, risk, or diagnosis. These systems inherit the biases of the large language and speech models they are built on. Speech-recognition systems have been shown in published research to transcribe the speech of Black speakers far less accurately than the speech of white speakers, with one widely cited study reporting word-error rates roughly twice as high. If a downstream mental-health tool depends on an accurate transcript, that transcription gap becomes a measurement bias that degrades every prediction for the affected speakers.</p>
<p>Text-based sentiment and risk models carry analogous problems. Models trained predominantly on majority-dialect, majority-culture text may misread African American English, code-switching, regional idiom, or culturally specific expressions of distress. A statement that signals resilience or ordinary venting in one community may be scored as elevated risk by a model that learned its associations elsewhere, producing both false alarms and missed signals along demographic lines. Because language is the very medium of psychotherapy, NLP bias is not a peripheral concern in mental health; it strikes at the core of what these tools claim to measure.</p>
<p>There is also a privacy and consent dimension. Linguistic markers can reveal protected attributes the patient never disclosed — likely race, gender, sexual orientation, or national origin — which a model could then use, intentionally or not, as a basis for differential treatment. The opacity of these systems means a patient often cannot know what the model inferred about them, let alone contest it.</p>`,
        },
        {
          type: 'text', order: 6,
          content: `<h2>Sensors, Skin Tone, and Affect Sensing</h2>
<p>A final, fast-growing category is "affective computing" — tools that claim to infer emotional state, engagement, or risk from facial expression, voice prosody, or physiological signals captured by cameras and wearables. These systems are vulnerable to measurement bias rooted in the physics of the sensors and the demographics of their calibration. Optical heart-rate and oxygenation sensors, which work by shining light through the skin, can be less accurate on darker skin tones; a body of clinical research on pulse oximetry has documented systematically inflated readings for patients with darker skin, with real consequences for whether their hypoxia is detected. Wearable-derived signals built on the same optical principles inherit this disparity, and any mental-health inference built on top of them inherits it again.</p>
<p>Facial-analysis and "emotion recognition" systems raise even deeper concerns. Landmark audits of commercial facial-analysis products found error rates far higher for darker-skinned women than for lighter-skinned men, and the scientific consensus is that the mapping from facial movement to internal emotion is neither universal nor reliable across cultures. An affect-sensing tool that reads a patient's face as "disengaged" or "agitated" may simply be misreading culturally variable expression — and then attaching a clinical or risk meaning to its own error. The American Psychological Association and the World Health Organization have both urged caution about deploying such tools in care settings without rigorous, population-specific evidence of validity and equity.</p>
<p>Taken together, these documented cases share a structure. In each, a tool that performed acceptably "on average" concealed a pattern of differential failure that fell along lines of race, language, skin tone, or socioeconomic access — exactly the lines along which health inequity already runs. Average performance is not equity; a single accuracy number can hide a disparity large enough to change who gets care.</p>`,
        },
        {
          type: 'text', order: 6.5,
          content: `<h2>Why These Disparities Cluster Along the Same Fault Lines</h2>
<p>A striking feature of the documented cases is that they do not fail randomly. Across very different technologies — a cost-prediction algorithm, an EHR-trained risk model, a speech recognizer, a pulse oximeter, a facial-analysis system — the failures concentrate on the same populations: Black patients, patients who speak non-dominant dialects, patients with darker skin, patients with limited access to care. This is not a coincidence. Each technology is built on data and design choices that reflect a world already organized by inequity, so each one independently rediscovers and re-encodes the same fault lines. Understanding this convergence is clinically important because it means that a clinician serving a marginalized population should expect bias as the default hypothesis for any new tool, rather than treating it as a rare exception that has to be proven.</p>
<p>Consider how the mechanisms stack. A patient from an underserved community may have a sparser EHR (sampling bias), may have been historically under-diagnosed for mood disorders and over-diagnosed for psychotic disorders (label bias), may speak in a dialect the NLP layer transcribes poorly (measurement bias), and may be monitored by a wearable whose optical sensor reads their skin less accurately (measurement bias again) — all feeding a single risk score that is then deployed in a workflow that over-trusts it (deployment bias). The biases do not merely coexist; they compound, and the patient at the intersection of several disadvantaged groups absorbs the multiplied error. This is the algorithmic analogue of intersectionality: the harm to someone who is, say, a Black non-native English speaker is not the sum of two separate problems but a distinct and larger one.</p>
<p>The clinical implication is sobering but actionable. Because the harms cluster, the patients most likely to be misjudged by a biased tool are frequently the same patients who already face the steepest barriers to care and who have the least power to contest an adverse decision. The justice stakes are therefore highest exactly where the tools are least trustworthy. A clinician who internalizes this pattern will calibrate their skepticism accordingly: the more vulnerable the patient and the higher the stakes of the decision, the more documentation and evidence a tool must earn before it is allowed to influence the outcome. That calibration — more scrutiny where more harm is possible — is not bias against technology; it is the ordinary logic of patient safety applied honestly.</p>
<p>It also reframes what counts as a "good" tool. A model that performs superbly for the majority and poorly for the marginalized may actually <em>widen</em> existing disparities even while raising the average quality of care, because it adds the most value for those who already had the most and the least for those who had the least. Genuinely equitable AI must be judged not only by whether it improves average outcomes but by whether it narrows the gap between the best- and worst-served groups. A tool that lifts the floor for the most disadvantaged is worth more, from a justice standpoint, than one that merely raises an already-high ceiling.</p>`,
        },
        {
          type: 'callout', order: 7, calloutType: 'warning', title: 'Average Accuracy Hides Disparity',
          content: '<p>A model advertised as "92% accurate" can be 96% accurate for the majority group and 78% accurate for a minority group. The headline number is true and useless for equity. Always ask for performance <em>disaggregated</em> by race, ethnicity, language, sex, age, and other relevant subgroups. If a vendor cannot or will not provide subgroup performance, treat that absence as a finding, not a neutral gap.</p>',
        },
        {
          type: 'accordion', order: 8, title: 'A Closer Look at Four Documented Cases',
          accordionItems: [
            { title: 'Cost-as-proxy risk scoring (Obermeyer et al., 2019)', content: '<p>A widely used commercial algorithm under-identified Black patients for extra care because it predicted cost, not need. At equal risk scores, Black patients were sicker. Correcting the proxy roughly tripled the share of Black patients flagged for help. The bias lived in the choice of target variable, not in the math.</p>' },
            { title: 'EHR-based prediction (Gianfrancesco et al., 2018)', content: '<p>Sparse records for low-access patients, non-random missingness, biased diagnosis labels, and feedback loops can all cause EHR-trained models to systematically disadvantage vulnerable groups. Missing data tracks socioeconomic status; biased labels launder clinician bias into algorithmic authority.</p>' },
            { title: 'Speech and NLP performance gaps', content: '<p>Automated speech recognition has shown roughly double the word-error rate for Black speakers in published research, and text models can misread dialect and culturally specific expressions of distress. Because language is the medium of mental-health assessment, these gaps directly degrade tool validity for the affected groups.</p>' },
            { title: 'Sensors and affect sensing', content: '<p>Optical sensors (pulse oximetry, wearable heart-rate) can misread on darker skin; facial-analysis systems show much higher error for darker-skinned women; and the face-to-emotion mapping is culturally variable. Affect-sensing tools can attach clinical meaning to their own measurement errors.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'In the Obermeyer et al. (2019) study, why did the algorithm systematically underestimate the needs of Black patients?',
          options: [
            { text: 'It used race as an explicit input and weighted it negatively', isCorrect: false },
            { text: 'It predicted future healthcare cost as a proxy for need, and Black patients generated less cost at equal illness due to access barriers', isCorrect: true },
            { text: 'The training sample contained no Black patients at all', isCorrect: false },
            { text: 'The model\'s arithmetic contained a rounding error', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The algorithm used cost as a proxy for need. Because unequal access produced lower cost for equally-ill Black patients, the model translated "costs less" into "needs less" — a textbook label-bias failure.',
        },
        {
          type: 'matching', order: 10,
          matchingInstructions: 'Match each documented disparity to the primary bias mechanism it illustrates.',
          matchingPairs: [
            { term: 'Cost-as-proxy risk scoring (Obermeyer)', definition: 'Label/target bias — an inequitable proxy stands in for true need' },
            { term: 'Sparse, non-random missing EHR data', definition: 'Sampling/representation and measurement bias for low-access patients' },
            { term: 'Speech recognition with higher word-error rates for some speakers', definition: 'Measurement bias degrading every downstream NLP prediction' },
            { term: 'Pulse oximetry inaccurate on darker skin', definition: 'Sensor-level measurement bias inherited by affect-sensing tools' },
          ],
        },
        {
          type: 'scenarioTree', order: 11,
          scenarioTitle: 'A Risk Flag You Did Not Expect',
          instructions: 'Work through a clinical decision involving an AI risk flag whose validity for your patient is uncertain.',
          startNode: 'start',
          nodes: {
            start: { text: 'Your agency adopts an NLP tool that scores intake notes for "elevated crisis risk." It flags a Black adolescent client whose presentation, in your clinical judgment, is ordinary adjustment distress expressed in vernacular language. What do you do first?', choices: [
              { text: 'Defer to the flag and initiate the high-risk protocol', nextId: 'defer' },
              { text: 'Pause and ask what data and language the model was validated on', nextId: 'inquire' },
            ] },
            defer: { text: 'You escalate to the high-risk protocol based largely on the score. This is automation bias: you weighted the algorithm above your own assessment without checking its validity for this population. The client may be subjected to disproportionate surveillance, and a misread of dialect may have driven the flag. Reconsider.', choices: [ { text: 'Go back and investigate the tool instead', nextId: 'inquire' } ] },
            inquire: { text: 'You ask the vendor for subgroup performance and discover the model was validated mostly on majority-dialect adult text. You document your clinical override, note the limitation, and treat the flag as one weak input among many. You also raise the validity gap with your clinical director.', choices: [ { text: 'See the outcome', nextId: 'end1' } ] },
            end1: { text: 'By applying informed skepticism, documenting your override, and advocating internally, you protected the client from a likely false-positive harm and started an organizational accountability conversation. This is cultural humility applied to AI.', isEnd: true },
          },
        },
        {
          type: 'imageText', order: 12,
          title: 'Disaggregate Before You Trust',
          content: `<p>The recurring lesson of these cases is that equity questions are invisible at the level of average performance. Before relying on any tool, insist on performance broken down by the subgroups you actually serve. A model that is excellent on average and poor for your patients is, for your purposes, a poor model.</p>`,
          image: '', imageAlt: 'Bar chart contrasting high average accuracy with low minority-subgroup accuracy', imagePosition: 'right',
        },
        { type: 'reflection', order: 13, question: 'Consider the high-stakes mental-health decisions your setting makes (holds, level-of-care, program eligibility, custody or competency input). If a biased algorithm influenced one of these, who would bear the harm, and how would you even detect that the harm was occurring? What would have to be in place for you to notice?' },
        { type: 'keyTakeaway', order: 14, title: 'Key Takeaways', takeaways: [
          'Obermeyer et al. (2019) showed a non-race-using algorithm under-served Black patients because it predicted cost — an inequitable proxy — instead of need.',
          'EHR-trained models (Gianfrancesco et al., 2018) inherit sparse records, non-random missingness, biased diagnosis labels, and self-reinforcing feedback loops.',
          'NLP, speech, sensor, and affect-sensing tools carry measurement bias along lines of dialect, skin tone, and culture — striking at the core of mental-health assessment.',
          'Average accuracy conceals subgroup disparity; equity requires disaggregated performance, and mental-health stakes (liberty, custody, surveillance) make uncritical adoption especially dangerous.',
        ] },
      ],
    },

    {
      title: 'Equity Frameworks, Fairness, and Auditing',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '3', title: 'Equity Frameworks, Fairness, and Auditing', subtitle: 'Definitions of algorithmic fairness, the impossibility of satisfying all metrics, model cards and datasheets, bias auditing, and participatory design', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>What "Fairness" Actually Means</h2>
<p>Once a clinician accepts that algorithms can be biased, the natural question is how to make them fair. The difficulty is that "fair" is not a single, agreed-upon thing — it is a family of competing mathematical definitions, each encoding a different moral intuition, and several of them cannot all be satisfied at once. Understanding the major definitions is essential, because vendors and researchers often claim a tool is "fair" without specifying which definition they mean, and the unspecified definition may not be the one that protects your patients.</p>
<p>A first family of definitions concerns <strong>group fairness</strong>. <em>Demographic parity</em> (also called statistical parity) requires that the proportion of people receiving a positive prediction be equal across groups — for example, that the same share of Black and white patients be flagged for extra services. <em>Equalized odds</em> requires that the model's error rates — its false-positive and false-negative rates — be equal across groups, so that being missed or being falsely flagged is equally likely regardless of group. <em>Equal opportunity</em> is a relaxed version requiring only that the true-positive rate (the rate at which truly high-need patients are correctly identified) be equal across groups. <em>Calibration</em> requires that a given risk score mean the same thing across groups — that a "70% risk" label correspond to the same actual probability whether the patient is Black or white.</p>
<p>A second family concerns <strong>individual fairness</strong>, captured by the principle that similar individuals should be treated similarly. This is intuitively appealing but practically hard, because it requires a defensible, non-circular definition of "similar" that does not simply re-import the very biases at issue. A third lens, <strong>counterfactual fairness</strong>, asks whether a decision would have been the same had the individual belonged to a different demographic group, holding everything causally downstream of that group membership constant.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>The Impossibility Result: You Cannot Have It All</h2>
<p>The most consequential finding in the fairness literature is that several of these reasonable-sounding criteria are mathematically incompatible. A series of results — associated with work by Kleinberg and colleagues and by Chouldechova, among others — established that when the underlying base rates of an outcome differ between groups, a model generally cannot simultaneously satisfy calibration and equalized odds (equal false-positive and false-negative rates). If you tune a model to be perfectly calibrated, you will, except in degenerate cases, end up with unequal error rates; if you force the error rates to be equal, you sacrifice calibration. This is not a flaw to be engineered away. It is a theorem. There is no technical configuration that satisfies every fairness definition at once whenever base rates differ.</p>
<p>The implication is profound and is frequently misunderstood. It means that <strong>fairness is not a purely technical problem with a single correct answer; it is a value choice</strong>. Choosing which fairness criterion to prioritize is choosing whose errors matter most. Prioritizing equal false-negative rates says "no group should be disproportionately missed when they truly need help." Prioritizing calibration says "a score should mean the same thing for everyone." Both are defensible, and they conflict. Someone must decide — and that someone should not be, by default, a vendor optimizing a number the buyer never examined. Mehrabi and colleagues (2021) emphasize that the choice of fairness metric must be made deliberately and transparently, in light of the specific harms a given application can cause.</p>
<p>For a clinician, the practical takeaway is liberating rather than paralyzing. You do not need to resolve an unsolvable mathematics problem. You need to ask which fairness definition a tool was optimized for, whether that choice fits the harms most relevant to your patients, and who made the choice. A tool that is "fair" by demographic parity but badly miscalibrated for your population may be worse for your patients than one that made the opposite trade-off honestly.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Documentation: Model Cards and Datasheets</h2>
<p>If the choice of fairness criterion must be transparent, then documentation is the vehicle of that transparency. Two documentation standards have become widely adopted. <strong>Model cards</strong>, proposed by Mitchell and colleagues (2019), are short documents that accompany a trained model and report its intended use, its out-of-scope uses, and — crucially — its performance disaggregated across relevant subgroups, along with the metrics chosen and their justification. A well-constructed model card tells a clinician at a glance whether the tool was evaluated on patients like theirs and how it performed for each group, rather than hiding behind a single average.</p>
<p><strong>Datasheets for datasets</strong>, proposed by Gebru and colleagues (2021), apply the same philosophy one step earlier in the pipeline. A datasheet documents how a dataset was collected, who is represented in it, what the labels mean, what preprocessing was done, and what the known limitations are. Because so much bias originates in the data, a datasheet is often more revealing than any statistic about the model: it tells you whether the population that generated the data resembles the population you serve, and whether the labels were defined in a way that could import historical inequity.</p>
<p>The clinical use of these documents is simple but powerful. When appraising a tool, ask for its model card and the datasheet for its training data. If neither exists, that absence is itself diagnostic — it usually means the developer either did not examine the equity properties of the tool or does not wish to disclose them. In a high-stakes domain like mental health, a refusal to document is a reason for caution, not a neutral administrative gap.</p>`,
        },
        {
          type: 'imageText', order: 5,
          title: 'A Model Card Is a Patient-Safety Document',
          content: `<p>Clinicians already insist on a drug's label before prescribing: its indications, contraindications, and the populations in which it was studied. A model card serves the same function for an algorithm. Reading it before adopting a tool is not a technical luxury; it is the equivalent of reading the package insert, and the same standard of diligence applies.</p>`,
          image: '', imageAlt: 'A model card laid out like a medication package insert with subgroup performance sections highlighted', imagePosition: 'left',
        },
        {
          type: 'text', order: 6,
          content: `<h2>Bias Auditing and Participatory Design</h2>
<p><strong>Bias auditing</strong> is the practice of systematically testing a deployed or candidate model for disparate performance and disparate impact across groups, ideally by independent parties. An audit disaggregates accuracy, error rates, and calibration by subgroup; it probes the model with realistic cases; and it examines downstream impact — not just whether predictions differ, but whether the decisions they drive distribute benefit and burden unequally. The most influential audits in this field, such as the facial-analysis audits that revealed large accuracy gaps by skin tone and gender, demonstrated that independent scrutiny can surface harms that internal validation missed entirely. Auditing works best when it is ongoing rather than one-time, because deployment bias and feedback loops mean a tool that was equitable at launch can drift.</p>
<p><strong>Participatory design</strong> addresses bias upstream of any audit by including the affected communities in the design of the tool itself. The premise, echoed in the Algorithmic Justice League's advocacy and in WHO and APA equity guidance, is that the people most likely to be harmed by a system are often best positioned to anticipate its failure modes — failures that homogeneous development teams systematically overlook. Participatory approaches bring patients, community members, and frontline clinicians into decisions about what the tool should predict, what counts as a harm, and which fairness trade-offs are acceptable. This reframes equity from a property to be tested after the fact into a requirement built in from the start, and it directly counters the historical pattern in which marginalized communities are studied and surveilled by systems they had no voice in shaping.</p>
<p>None of these mechanisms — fairness metrics, model cards, datasheets, audits, participatory design — is sufficient alone, and none removes the underlying value choices. Together, however, they convert "trust us, it's fair" into a set of concrete questions a clinician can ask and a developer must answer. That shift, from opaque assurance to documented accountability, is the practical heart of equity in clinical AI.</p>`,
        },
        {
          type: 'text', order: 6.5,
          content: `<h2>Transparency, Explainability, and Their Limits</h2>
<p>Alongside fairness metrics and documentation, a great deal of contemporary discussion concerns <strong>explainability</strong> — the ability to say why a model produced a particular output. Explainability matters for equity because an opaque system cannot be meaningfully contested: if neither clinician nor patient can know what drove a decision, neither can identify when that decision rested on a biased proxy. Techniques exist to approximate explanations for complex models, highlighting which inputs most influenced a prediction. These tools are genuinely useful, but they carry a danger of their own. A plausible-sounding explanation can create false confidence, persuading a clinician that a model is trustworthy when the explanation is itself only an approximation that may obscure as much as it reveals. Explainability is a means to scrutiny, not a substitute for it; an explanation that no one uses to actually question the model adds reassurance without adding safety.</p>
<p>There is also an important distinction between <strong>transparency about the model</strong> and <strong>transparency to the patient</strong>. A vendor may publish a detailed technical report that satisfies a data scientist while remaining wholly inaccessible to the patient whose care it affects. Equity requires both: documentation rich enough for technical appraisal, and explanation plain enough that an ordinary patient can understand that an algorithm is involved, roughly what it does, and how they might question a result. The two audiences need different things, and serving only the technical one leaves the patient — usually the person with the least power and the most at stake — in the dark.</p>
<p>Finally, transparency and auditing are necessary but not sufficient without <strong>governance</strong>: the organizational structures that decide which tools are adopted, who is accountable when they fail, how complaints are handled, and when a tool is retired. Frameworks such as the WHO's guidance on AI for health and the NIST AI Risk Management Framework emphasize that equity is sustained not by any single document or test but by a continuous, accountable process with named owners. A model card with no one responsible for acting on it, or an audit whose findings go unaddressed, provides the appearance of accountability without its substance. The clinician's role within such governance is concrete: to insist that these structures exist, to participate in them where possible, and to refuse to let documentation become a ritual that licenses inaction.</p>
<p>None of this requires the clinician to master the underlying mathematics. It requires a stance: that an algorithm affecting a patient's care must be inspectable, explicable, and governed, and that the burden of demonstrating fairness lies with the tool and its makers, not with the patient who is asked to trust it. That stance, applied consistently, turns the abstract machinery of fairness metrics and audits into a practical standard a working clinician can hold any vendor to.</p>`,
        },
        {
          type: 'callout', order: 7, calloutType: 'protocol', title: 'Five Questions to Ask Before Adopting a Tool',
          content: '<ol><li>Which fairness definition was the model optimized for, and who chose it?</li><li>Where is the model card, and does it report performance for the subgroups I serve?</li><li>Where is the datasheet, and does the training population resemble my patients?</li><li>Has an independent bias audit been conducted, and is auditing ongoing?</li><li>Were affected communities and frontline clinicians involved in the design?</li></ol>',
        },
        {
          type: 'accordion', order: 8, title: 'Fairness Definitions at a Glance',
          accordionItems: [
            { title: 'Demographic (statistical) parity', content: '<p>Equal proportion of positive predictions across groups. Intuitive, but can require treating dissimilar cases alike and can mask differences in true base rates. Often the wrong target when groups genuinely differ in outcome prevalence.</p>' },
            { title: 'Equalized odds / equal opportunity', content: '<p>Equal error rates (false positives and false negatives) across groups, or, in the relaxed form, equal true-positive rates. Protects against being disproportionately missed or falsely flagged. Cannot generally coexist with calibration when base rates differ.</p>' },
            { title: 'Calibration', content: '<p>A given score means the same actual probability across groups. Clinically appealing because clinicians interpret scores directly. But enforcing calibration generally forces unequal error rates across groups — the impossibility result in action.</p>' },
            { title: 'Individual and counterfactual fairness', content: '<p>Similar individuals treated similarly (individual), or a decision unchanged had the person belonged to another group (counterfactual). Conceptually strong, practically demanding, and dependent on contestable definitions of similarity and causal structure.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'The "impossibility result" in algorithmic fairness establishes that:',
          options: [
            { text: 'No algorithm can ever be more accurate than a human clinician', isCorrect: false },
            { text: 'When base rates differ between groups, a model generally cannot satisfy calibration and equalized odds simultaneously', isCorrect: true },
            { text: 'Removing the race variable always makes a model fair', isCorrect: false },
            { text: 'Fairness can always be achieved with a large enough dataset', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'When base rates differ, calibration and equal error rates are mathematically incompatible except in degenerate cases. Fairness therefore requires a value choice about which criterion to prioritize — it is not a single solvable technical target.',
        },
        {
          type: 'multiSelect', order: 10,
          question: 'Which documents or practices increase the equity transparency of a clinical AI tool? (Select all that apply)',
          options: [
            { text: 'A model card reporting subgroup performance and intended use', isCorrect: true },
            { text: 'A datasheet describing how the training data were collected and who is represented', isCorrect: true },
            { text: 'An independent, ongoing bias audit', isCorrect: true },
            { text: 'Participatory design involving affected communities', isCorrect: true },
            { text: 'A single advertised average-accuracy figure', isCorrect: false },
          ],
          explanation: 'Model cards, datasheets, independent audits, and participatory design all expose equity properties. A lone average-accuracy figure conceals exactly the subgroup disparities that matter.',
        },
        {
          type: 'sequencing', order: 11,
          instructions: 'Arrange the steps of a responsible equity appraisal of a candidate AI tool in a logical order.',
          steps: [
            { id: 's1', text: 'Define the population you serve and the specific harms the tool could cause them.', order: 1 },
            { id: 's2', text: 'Obtain the datasheet and confirm the training population resembles your patients.', order: 2 },
            { id: 's3', text: 'Obtain the model card and review disaggregated subgroup performance.', order: 3 },
            { id: 's4', text: 'Identify which fairness criterion was optimized and whether it fits your harms.', order: 4 },
            { id: 's5', text: 'Review any independent audit and plan for ongoing monitoring after deployment.', order: 5 },
          ],
          explanation: 'Responsible appraisal starts from the population and the harms, moves to the data, then to model performance and fairness choices, and finishes with audit evidence and a monitoring plan — equity is assessed across the whole lifecycle.',
        },
        {
          type: 'videoEmbed', order: 12,
          videoTitle: 'Why You Cannot Satisfy Every Fairness Metric',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aibias',
          description: 'An explainer on competing fairness definitions and the impossibility result, framed for clinical decision-makers appraising AI tools.',
        },
        { type: 'reflection', order: 12.5, question: 'Of the fairness definitions described — demographic parity, equalized odds, equal opportunity, and calibration — which one best matches the harm you would most want to prevent for the patients you serve, and why? What would you be implicitly trading away by prioritizing it?' },
        {
          type: 'text', order: 12.75,
          content: `<h2>Putting the Frameworks Together</h2>
<p>It is tempting, faced with competing fairness definitions and an impossibility theorem, to conclude that the whole enterprise is hopeless — that since perfect fairness is unattainable, no choice is better than any other. That conclusion is mistaken and dangerous. The impossibility result does not say that all configurations are equally fair; it says that no single configuration is fair by every definition simultaneously. Within that constraint, some choices are far better than others for a given purpose, and many tools fail not because they made a hard trade-off well but because they made no deliberate choice at all and let an unexamined default stand. The practical task is therefore not to achieve the impossible but to make the unavoidable trade-off consciously, transparently, and in light of the specific harms that matter most for a specific population.</p>
<p>This is where the frameworks of this section connect into a single workflow. The fairness definitions name the choices; the impossibility result explains why a choice cannot be evaded; model cards and datasheets make the choice and its consequences inspectable; bias auditing checks whether the choice held up in practice and across time; and participatory design ensures that the people who bear the harm have a voice in which choice is made. No single piece is sufficient, but together they form a chain of accountability that runs from the data, through the model, to the deployed decision, and back to the affected community. A clinician appraising a tool can walk this chain link by link, and a break at any link is a finding.</p>
<p>Equally important is recognizing what these frameworks cannot do. They cannot convert a value-laden decision into a value-free one, they cannot guarantee an equitable outcome in an inequitable system, and they cannot substitute for human judgment at the point of care. Their function is more modest and more achievable: to make the value choices visible, to assign responsibility for them, and to give clinicians and communities the standing to question them. Used that way, they are powerful. Mistaken for a guarantee of fairness, they become a new source of false confidence — the very thing equity work exists to dismantle. The clinician who holds these tools at their true value, neither dismissing nor over-trusting them, is equipped to use AI as one accountable input within a fundamentally human, justice-centered practice.</p>`,
        },
        { type: 'keyTakeaway', order: 13, title: 'Key Takeaways', takeaways: [
          'Fairness is a family of competing definitions (parity, equalized odds, equal opportunity, calibration, individual, counterfactual), each encoding a different value.',
          'The impossibility result proves that, when base rates differ, calibration and equal error rates cannot both hold — so fairness is a value choice, not a single technical answer.',
          'Model cards and datasheets make a tool\'s intended use, training population, and subgroup performance inspectable; their absence is itself a warning sign.',
          'Bias auditing (independent and ongoing) and participatory design move equity from after-the-fact testing to a built-in requirement co-owned by affected communities.',
        ] },
      ],
    },

    {
      title: "The Clinician's Responsibilities",
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '4', title: "The Clinician's Responsibilities", subtitle: 'Appraising tools for equity, informed skepticism, advocacy, documenting overrides, cultural humility applied to AI, and the justice principle', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Informed Skepticism, Not Reflexive Rejection</h2>
<p>The appropriate clinical stance toward mental-health AI is neither uncritical adoption nor blanket refusal. It is <strong>informed skepticism</strong>: a disposition to use these tools where they genuinely help, while holding their outputs to the same evidentiary standards a clinician would apply to any other clinical instrument, and remaining alert to the specific ways they fail along lines of equity. Informed skepticism rejects two errors at once. The first error is automation bias — the documented human tendency to over-trust a confident computer and to suppress one's own contradicting judgment. The second error is reflexive technophobia that discards tools capable of extending access and catching signals a busy clinician might miss. Both errors substitute a posture for a judgment; informed skepticism insists on judgment.</p>
<p>Concretely, informed skepticism means treating an algorithmic output as <em>one input among many</em>, weighted according to how much you actually know about its validity for the patient in front of you. A risk flag from a tool with a transparent model card, validated on a population resembling your patient, audited independently, and used within its intended scope, earns more weight. A flag from an opaque tool of unknown provenance, used off-label on a patient unlike its validation sample, earns very little — and certainly not enough to override your own clinical assessment. The clinician remains the accountable decision-maker; the tool is an instrument, never the author of the decision.</p>
<p>This stance is also an ethical obligation, not merely a best practice. Professional codes require clinicians to practice within the bounds of competence and to base decisions on sound evidence. Deferring a consequential decision to an algorithm whose equity properties you have not examined is a failure of that obligation, dressed up as efficiency.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Appraising Tools for Equity in Real Practice</h2>
<p>Most clinicians do not procure their own software; tools arrive through agencies, health systems, or EHR vendors. This does not relieve the clinician of an appraisal role — it relocates it. Even a frontline clinician can and should ask the equity questions developed in this course: What population was this validated on? Where is the model card and the subgroup performance? Has it been audited? Within what scope was it intended to be used, and are we using it within that scope? Raising these questions in team meetings, supervision, and procurement conversations is a concrete exercise of professional responsibility, and it is often the only point at which equity concerns enter an organizational decision at all.</p>
<p>Appraisal also includes attending to the patient's experience of the tool. Does the patient know an algorithm is involved in a decision that affects them? Can they understand, in plain terms, what it does and what its limits are? Can they decline, or contest a result they believe is wrong? Informed consent does not evaporate because a computation is involved; if anything, the opacity of these systems raises the bar for explanation. A clinician who cannot explain to a patient, in ordinary language, what an AI tool is doing and why is not yet in a position to use it on that patient.</p>
<p>Finally, appraisal is ongoing, not a one-time gate. Models drift, populations change, and feedback loops can degrade a tool that was equitable at launch. The clinician's role includes noticing when a tool's outputs stop matching clinical reality for a particular group, and treating that mismatch as a signal worth surfacing rather than a quirk to be ignored.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Documenting Overrides and Advocating for Change</h2>
<p>When a clinician's judgment diverges from an algorithm's recommendation, the divergence should be <strong>documented</strong>. Recording an override — what the tool recommended, what you decided, and the clinical reasoning for the difference — serves several purposes at once. It protects the patient, by ensuring the human judgment is preserved in the record rather than silently overwritten by the machine. It protects the clinician, by demonstrating deliberate, reasoned practice rather than negligent deviation. And it protects future patients, because a pattern of documented overrides for a particular group is exactly the kind of signal that can trigger an audit and expose a biased tool. Overrides are not failures to be hidden; they are clinical data and, in aggregate, an early-warning system.</p>
<p>Beyond the individual case, the clinician has a role in <strong>advocacy</strong>. Char and colleagues (2018) and the WHO's guidance on AI ethics both stress that the responsible use of clinical AI is not only an individual matter but an institutional and systemic one. Clinicians can advocate for procurement standards that require model cards and audits, for the inclusion of equity criteria in tool selection, for participatory processes that bring patient voices into design, and for the right of patients to understand and contest algorithmic decisions. This is the institutional-accountability dimension of equity work: individual diligence within an unaccountable system is necessary but insufficient. The clinician who only protects their own caseload, without working to change the system that procured a biased tool, leaves every other patient exposed.</p>
<p>Advocacy also includes a willingness to say no. When a tool's equity properties are undocumented and the stakes are high, the responsible position may be to decline to use it, or to use it only with explicit caveats, until the necessary evidence is provided. The pressure to adopt new technology is real, but it does not override the duty of nonmaleficence.</p>`,
        },
        {
          type: 'imageText', order: 5,
          title: 'Cultural Humility Applied to AI',
          content: `<p>Cultural humility — lifelong self-examination, attention to power, and institutional accountability — maps directly onto responsible AI use. Self-examination becomes the question "what do I not know about how this tool performs for my patients?" Power analysis becomes "who built this, on whose data, and who bears the risk of its errors?" Institutional accountability becomes advocacy for documentation, auditing, and patient rights. The same humility that resists the fantasy of cultural mastery resists the fantasy of algorithmic objectivity.</p>`,
          image: '', imageAlt: 'Diagram linking the three commitments of cultural humility to corresponding responsibilities in AI use', imagePosition: 'right',
        },
        {
          type: 'text', order: 6,
          content: `<h2>The Justice Principle and the Clinician as Steward</h2>
<p>Underlying all of these responsibilities is the bioethical principle of <strong>justice</strong>: the fair distribution of benefits and burdens across populations. Beneficence asks that a tool help; nonmaleficence asks that it not harm; autonomy asks that patients understand and consent; but justice asks the distinctly equity-centered question of <em>for whom</em> the help and harm fall. An AI tool can be beneficent on average while violating justice by concentrating its benefits on the already-advantaged and its harms on the already-marginalized. The Obermeyer case is precisely such a violation: a tool that helped allocate care, on average, while systematically diverting it away from Black patients. Justice is the principle that makes algorithmic bias an ethical problem and not merely a technical one.</p>
<p>The clinician's ultimate role, then, is that of a <strong>steward</strong> standing between an imperfect technology and a vulnerable patient. Stewardship means using the tool's genuine strengths, refusing its unexamined authority, documenting where human judgment must override it, advocating for the accountability structures that make it safer, and keeping the patient — not the algorithm, not the vendor, not the workflow — at the center of the decision. The APA's guidance on the ethical use of technology and the WHO's principles for AI in health converge on this point: technology in care must remain a tool in the service of equitable human judgment, never its replacement. The clinician who internalizes that stance can adopt these tools where they help and resist them where they harm, which is exactly the discernment this domain demands.</p>
<p>This is demanding work, and it will not always be welcomed by institutions eager to deploy new systems quickly. But it is continuous with the oldest obligations of the helping professions: to do no harm, to attend to the most vulnerable, and to refuse the comfort of an authority — whether a textbook, a tradition, or an algorithm — that has not earned the patient's trust.</p>`,
        },
        {
          type: 'text', order: 6.5,
          content: `<h2>Competence, Consent, and the Boundaries of Delegation</h2>
<p>The responsible integration of AI into mental-health practice raises pointed questions about professional <strong>competence</strong> and the limits of what a clinician may delegate to a machine. Codes of ethics across the helping professions require practitioners to work within the boundaries of their competence and to base clinical decisions on adequate evidence. When a clinician relies on an AI tool, the competence obligation does not transfer to the tool; it expands to include a new duty — the duty to understand, at least at the level of informed appraisal, what the tool does, where it is valid, and how it can fail. A clinician who cannot articulate why a tool is appropriate for a given patient has not met the competence standard simply by virtue of the tool being available. The convenience of the technology does not lower the bar; if anything, the opacity of these systems raises it.</p>
<p>Delegation has limits that the clinician must police. Certain judgments — particularly those affecting a patient's liberty, custody, or access to scarce care — carry consequences too grave to be ceded to an instrument whose reasoning the clinician cannot examine. An algorithm may legitimately inform such decisions; it may not legitimately make them. The line between informing and deciding is exactly where automation bias does its damage, because a tool that was meant only to advise can, through deference and workflow design, quietly become the de facto decision-maker. Guarding that line is a core professional responsibility, and it requires the clinician to remain willing to disagree with the machine and to bear the accountability for doing so.</p>
<p>Consent deserves the same rigor. Genuine informed consent in the age of clinical AI means a patient understands that an algorithm is contributing to a decision about their care, has a plain-language account of what it does and its known limits, and retains a meaningful ability to question or refuse its use. Consent that buries algorithmic involvement in dense paperwork, or that offers no real option to decline, is consent in form only. For populations with well-founded historical mistrust of medical and behavioral-health institutions, transparent consent is not merely an ethical nicety; it is a precondition for the trust on which any therapeutic relationship depends. A tool deployed without the patient's understanding can corrode that trust even when it is technically accurate.</p>
<p>These obligations — expanded competence, bounded delegation, and substantive consent — are not new inventions. They are the field's existing ethical commitments, applied faithfully to a new class of instrument. The clinician who treats AI as just another tool subject to the same duties they already owe their patients will, in most cases, arrive at the right stance: use what genuinely helps, understand it well enough to appraise it, never let it make the decisions that are theirs to make, and keep the patient informed and empowered throughout. The technology is new; the ethics are not.</p>`,
        },
        {
          type: 'callout', order: 7, calloutType: 'ethics', title: 'The Justice Principle in One Sentence',
          content: '<p>A tool that is helpful on average but harmful to the marginalized violates the principle of justice — and "helpful on average" is precisely the disguise under which inequitable algorithms are sold. The clinician\'s job is to ask not only whether a tool works, but <em>for whom</em> it works and <em>at whose expense</em>.</p>',
        },
        {
          type: 'accordion', order: 8, title: 'Operationalizing the Clinician\'s Responsibilities',
          accordionItems: [
            { title: 'Informed skepticism', content: '<p>Treat algorithmic output as one weighted input, not a verdict. Weight it by what you actually know about its validity for this patient. Reject both automation bias and reflexive refusal.</p>' },
            { title: 'Documentation of overrides', content: '<p>Record what the tool recommended, what you decided, and why. Overrides protect the patient and the clinician, and in aggregate they become an early-warning system that can expose a biased tool.</p>' },
            { title: 'Advocacy and institutional accountability', content: '<p>Push for procurement standards requiring model cards, datasheets, and audits; for equity criteria in selection; and for patients\' right to understand and contest algorithmic decisions. Be willing to decline an undocumented high-stakes tool.</p>' },
            { title: 'Cultural humility and consent', content: '<p>Ask what you do not know about a tool\'s subgroup performance; analyze who built it and who bears its risks; ensure patients can understand, in plain language, what the tool does and can decline or contest it.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'A clinician disagrees with an AI risk score and proceeds on their own clinical judgment. What is the most responsible next step?',
          options: [
            { text: 'Quietly proceed and leave no record of the disagreement', isCorrect: false },
            { text: 'Document the override — what the tool recommended, the decision made, and the clinical reasoning', isCorrect: true },
            { text: 'Always defer to the algorithm to avoid liability', isCorrect: false },
            { text: 'Delete the algorithm\'s recommendation from the record', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Documenting the override protects the patient and clinician and, in aggregate, creates a signal that can surface a biased tool. Hiding or deleting the disagreement, or reflexively deferring, all fail the patient.',
        },
        {
          type: 'fillInBlank', order: 10, title: 'Principles and Stances',
          blanks: [
            { prompt: 'The bioethical principle concerned with the fair distribution of benefits and burdens across populations is ____.', answer: 'justice', acceptAlternates: [] },
            { prompt: 'Holding AI output to the same evidentiary standard as any clinical instrument, while remaining alert to equity failures, is called informed ____.', answer: 'skepticism', acceptAlternates: [] },
            { prompt: 'The tendency to over-trust a confident computer recommendation is called ____ bias.', answer: 'automation', acceptAlternates: [] },
          ],
        },
        {
          type: 'flashcardDeck', order: 11,
          instructions: 'Review the core clinician responsibilities for equitable AI use.',
          flashcards: [
            { id: 'f1', front: 'Informed skepticism', back: 'Using AI where it genuinely helps while holding its output to the same evidentiary standard as any clinical instrument and staying alert to equity failures. Rejects both automation bias and reflexive technophobia; treats the output as one weighted input, never a verdict.' },
            { id: 'f2', front: 'Documenting overrides', back: 'Recording what a tool recommended, what was decided, and why. Protects the patient (judgment preserved), the clinician (reasoned practice shown), and future patients (aggregated overrides can expose a biased tool).' },
            { id: 'f3', front: 'Advocacy / institutional accountability', back: 'Pushing for procurement standards requiring model cards, datasheets, and audits; equity criteria in selection; participatory design; and patients\' right to understand and contest decisions. Individual diligence within an unaccountable system is necessary but insufficient.' },
            { id: 'f4', front: 'Cultural humility applied to AI', back: 'Self-examination ("what don\'t I know about this tool\'s performance for my patients?"), power analysis ("who built it, on whose data, who bears the risk?"), and institutional accountability. The humility that resists cultural mastery resists algorithmic objectivity.' },
            { id: 'f5', front: 'Justice principle', back: 'Fair distribution of benefits and burdens across populations. A tool helpful on average can still violate justice by concentrating benefit on the advantaged and harm on the marginalized — as in the Obermeyer cost-as-proxy case.' },
          ],
        },
        { type: 'reflection', order: 12, question: 'Imagine your agency is about to adopt a new AI tool whose equity documentation is incomplete and whose stakes for patients are high. What specific questions would you raise, to whom, and at what point in the process? What would have to be true for you to decline to use it, and how would you justify that refusal professionally?' },
        { type: 'keyTakeaway', order: 13, title: 'Key Takeaways', takeaways: [
          'Informed skepticism treats AI output as one weighted input held to clinical evidentiary standards, rejecting both automation bias and reflexive refusal.',
          'Even clinicians who do not procure tools can and must ask the equity questions in supervision, procurement, and team decisions, and must keep consent meaningful.',
          'Document overrides; in aggregate they protect patients and serve as an early-warning system for biased tools, and advocacy extends responsibility to the institutional level.',
          'Cultural humility maps onto AND the justice principle anchors equitable AI use: ask not only whether a tool works but for whom, and at whose expense.',
        ] },
      ],
    },

    {
      title: 'Summary, Resources, and Commitments',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '5', title: 'Summary, Resources, and Commitments', subtitle: 'Synthesizing the course, locating authoritative equity resources, and translating learning into concrete clinical commitments', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Synthesis: From Awareness to Accountability</h2>
<p>This course began with a deceptively simple claim — that mental-health AI systems are not objective — and traced its consequences through four domains. In the first, we saw how bias enters across the entire machine-learning pipeline: through historical data that record an unequal world, through labels that substitute biased proxies for true need, through samples that underrepresent the vulnerable, through measurements that fail along lines of skin tone and dialect, and through deployment contexts that misuse a tool or over-trust it. We drew the crucial distinction between bias, which is systematic and group-linked, and noise, which is random and cancels out — a distinction that determines whether more data helps or merely scales the harm.</p>
<p>In the second domain, we examined documented disparities. The Obermeyer et al. (2019) study showed an algorithm under-serving Black patients because it predicted cost rather than need. Gianfrancesco et al. (2018) showed how EHR-trained models inherit sparse records, biased labels, and self-reinforcing feedback loops. Speech, NLP, sensor, and affect-sensing tools were shown to carry measurement bias that strikes at the core of mental-health assessment, where language and observation are the medium of care. Throughout, the recurring lesson was that average accuracy conceals subgroup disparity, and that mental health's high stakes — liberty, custody, surveillance, access to scarce care — make uncritical adoption uniquely dangerous.</p>
<p>In the third domain, we confronted the impossibility result: when base rates differ, no model can satisfy every fairness criterion at once, which means fairness is a value choice rather than a technical solution. We surveyed the tools that make those choices inspectable — model cards, datasheets, bias auditing, and participatory design — and reframed equity from an after-the-fact test into a built-in, co-owned requirement. In the fourth, we translated all of this into the clinician's responsibilities: informed skepticism, equity appraisal, documentation of overrides, advocacy, cultural humility applied to AI, and the justice principle that asks not only whether a tool helps but for whom and at whose expense.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>What Competent Practice Looks Like Now</h2>
<p>The clinician who has internalized this material does not need to become a data scientist. What changes is the set of questions they ask and the posture they bring. Before a tool touches a patient, they ask where it was validated, what its model card and datasheet reveal, which fairness criterion it optimized, whether it has been audited, and whether their patient resembles the population it was built for. While using a tool, they hold its output as one weighted input rather than a verdict, they keep the patient informed and able to contest, and they document the reasoning whenever their judgment diverges. Beyond any single case, they advocate within their institution for procurement standards, equity criteria, and patient rights, and they are willing to decline an undocumented, high-stakes tool.</p>
<p>This is not anti-technology. The same scrutiny that exposes a biased tool also identifies a genuinely useful one and uses it well. AI can extend access for underserved communities, surface signals a stretched clinician might miss, and reduce certain kinds of human inconsistency — but only when its equity properties are examined rather than assumed. The goal is not to reject these systems but to ensure that, as they enter mental-health care, they narrow rather than widen the disparities that already define the field. That outcome is not automatic; it depends on clinicians who refuse the comfort of unexamined authority and keep the most vulnerable patient at the center of every decision.</p>`,
        },
        {
          type: 'callout', order: 4, calloutType: 'tip', title: 'The One-Question Filter',
          content: '<p>If you remember only one question from this course, make it this: <strong>"For whom does this tool work, and at whose expense?"</strong> It collapses the entire equity analysis into a single habit of mind. A tool that cannot answer it — because no one disaggregated its performance — has told you something important by its silence.</p>',
        },
        {
          type: 'resources', order: 5, title: 'Health Equity & Fairness Resources',
          resources: [
            { title: 'AHRQ — Agency for Healthcare Research and Quality', url: 'https://www.ahrq.gov/', type: 'link', description: 'Federal agency producing the National Healthcare Quality and Disparities Reports and tools for measuring and reducing healthcare inequity.' },
            { title: 'NIMHD — National Institute on Minority Health and Health Disparities', url: 'https://www.nimhd.nih.gov/', type: 'link', description: 'NIH institute funding and disseminating research on the causes of and remedies for health disparities, including in digital and algorithmic health.' },
            { title: 'American Psychological Association', url: 'https://www.apa.org/', type: 'link', description: 'Professional-association guidance on the ethical use of technology and artificial intelligence in psychological practice and on multicultural, equity-centered care.' },
            { title: 'Algorithmic Justice League', url: 'https://www.ajl.org/', type: 'link', description: 'Research-and-advocacy organization documenting bias in AI systems (including facial-analysis audits) and advancing accountable, participatory algorithmic governance.' },
            { title: 'ONC — Office of the National Coordinator for Health IT', url: 'https://www.healthit.gov/', type: 'link', description: 'Federal office overseeing health-IT standards, including transparency and algorithm-disclosure requirements relevant to clinical decision-support tools.' },
            { title: 'WHO — Ethics and Governance of AI for Health', url: 'https://www.who.int/publications/i/item/9789240029200', type: 'link', description: 'World Health Organization guidance establishing equity, transparency, and accountability principles for the use of artificial intelligence in health.' },
            { title: 'NIST — AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', type: 'link', description: 'U.S. standards framework for identifying and managing AI risks, including bias and harm to specific populations.' },
            { title: 'CMS Office of Minority Health', url: 'https://www.cms.gov/about-cms/agency-information/omh', type: 'link', description: 'Resources and data on advancing health equity across Medicare and Medicaid populations, including disparities measurement.' },
          ],
        },
        {
          type: 'text', order: 5.5,
          content: `<h2>How to Use the Resources Above</h2>
<p>The resources gathered in this course are not interchangeable, and knowing which to reach for in a given situation is part of putting this material to work. When the question is whether a disparity exists in your own setting, the data-oriented bodies are the place to start: the Agency for Healthcare Research and Quality publishes the National Healthcare Quality and Disparities Reports, and the Centers for Medicare and Medicaid Services Office of Minority Health offers disparities measurement across large public populations. These sources help a clinician move from anecdote to evidence, establishing whether a pattern they suspect in a tool's behavior reflects a broader, documented inequity.</p>
<p>When the question is governance — how a tool should be evaluated, what a responsible adoption process looks like, or what a vendor should be required to disclose — the standards bodies are the relevant authorities. The World Health Organization's guidance on the ethics and governance of artificial intelligence for health lays out equity, transparency, and accountability principles in language usable by clinicians and administrators alike, and the National Institute of Standards and Technology's AI Risk Management Framework provides a structured vocabulary for identifying and managing bias and harm. These documents are especially useful when a clinician wants to influence a procurement decision, because they translate ethical commitments into concrete, citable requirements that an organization can be asked to meet.</p>
<p>When the question concerns the broader social and historical context — why these harms recur, who is affected, and what accountable governance has looked like in practice — the advocacy and research organizations are indispensable. The Algorithmic Justice League documents real-world audits and frames the issue in terms of power and participation, while the American Psychological Association connects algorithmic equity to the profession's existing commitments to multicultural, justice-centered care. Read together, these resources prevent the work from collapsing into a narrow technical exercise and keep it anchored in the lived realities of the patients the field exists to serve. The National Institute on Minority Health and Health Disparities and the Office of the National Coordinator for Health Information Technology round out the set with research funding priorities and health-IT transparency standards, respectively.</p>
<p>A practical habit is to bookmark two or three of these sources that fit your role and to return to them when a specific decision arises, rather than attempting to absorb everything at once. The clinician who consults the WHO guidance before a procurement meeting, or pulls an AHRQ disparities figure into a case discussion, has converted a static list of links into an active instrument of equity practice. That conversion — from resource to routine — is the small, repeatable behavior through which a single continuing-education course actually changes what happens at the point of care.</p>`,
        },
        {
          type: 'text', order: 6,
          content: `<h2>From Learning to Commitment</h2>
<p>Continuing education changes practice only when it converts into specific, repeatable behaviors. The commitments below are offered as a starting template; the goal is not to adopt them verbatim but to translate the principles of this course into the concrete realities of your own setting, caseload, and institutional role. Each commitment is paired with the section of the course that grounds it, so that the reasoning remains visible and the behavior does not harden into an unexamined rule of its own.</p>
<p>The deepest commitment is also the simplest: to extend to algorithms the same disciplined humility that culturally responsive practice already demands of us toward people. We are taught not to assume mastery over a client's cultural world, not to mistake our averages for their particulars, and not to let an authority we have not examined make decisions for the vulnerable. Those same disciplines, turned toward the tools now entering our field, are the whole of what equitable AI practice requires.</p>`,
        },
        {
          type: 'callout', order: 7, calloutType: 'key', title: 'Three Commitments',
          content: '<ol><li><strong>I will appraise before I trust.</strong> Before relying on any AI tool with a patient, I will ask for its validation population, model card, fairness choice, and audit status, and I will treat the absence of that documentation as a warning rather than a neutral gap.</li><li><strong>I will document my overrides.</strong> When my clinical judgment diverges from an algorithm, I will record the recommendation, my decision, and my reasoning — protecting the patient and contributing to the signal that can expose a biased tool.</li><li><strong>I will advocate and, when necessary, decline.</strong> I will raise equity questions in procurement and team decisions, push for documentation and auditing and patient rights, and be willing to refuse an undocumented, high-stakes tool.</li></ol>',
        },
        {
          type: 'multipleChoice', order: 8,
          question: 'Which statement best captures the central thesis of this course?',
          options: [
            { text: 'Mental-health clinicians should refuse all AI tools because they are inherently biased', isCorrect: false },
            { text: 'AI tools are objective and therefore safer than human clinical judgment', isCorrect: false },
            { text: 'AI tools reproduce the inequities of the data and systems that built them, so clinicians must appraise them for equity, hold their output to evidentiary standards, and keep justice at the center', isCorrect: true },
            { text: 'Algorithmic fairness is a solved technical problem requiring only larger datasets', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'The course argues neither for rejection nor for uncritical adoption. AI inherits the inequities of its data and systems; the clinician\'s task is informed appraisal, evidentiary skepticism, documentation, advocacy, and a justice-centered focus on for whom a tool works.',
        },
        {
          type: 'matching', order: 9,
          matchingInstructions: 'Match each course concept to its best one-line description.',
          matchingPairs: [
            { term: 'Bias vs. noise', definition: 'Systematic group-linked error vs. random error that cancels out' },
            { term: 'Obermeyer (2019)', definition: 'Cost-as-proxy algorithm that under-served Black patients' },
            { term: 'Impossibility result', definition: 'Calibration and equal error rates cannot both hold when base rates differ' },
            { term: 'Justice principle', definition: 'Fair distribution of benefits and burdens — "for whom, at whose expense?"' },
          ],
        },
        { type: 'reflection', order: 10, question: 'Write your own version of the three commitments, phrased for your specific role and setting. For each, name one concrete action you could take within the next month and one obstacle you anticipate. How will you know, six months from now, whether your practice has actually changed?' },
        { type: 'keyTakeaway', order: 11, title: 'Key Takeaways', takeaways: [
          'AI inherits the inequities of its data and systems; the clinician\'s task is appraisal, evidentiary skepticism, documentation, and advocacy — not rejection or uncritical trust.',
          'Authoritative equity resources (AHRQ, NIMHD, APA, Algorithmic Justice League, ONC, WHO, NIST, CMS) provide standards, data, and frameworks to support this work.',
          'The one-question filter — "for whom does this work, and at whose expense?" — collapses the equity analysis into a durable habit of mind.',
          'Equitable AI practice is cultural humility turned toward tools: refuse unexamined authority, keep the most vulnerable patient at the center, and convert learning into specific commitments.',
        ] },
      ],
    },
  ],

  assessment: {
    passingScore: 80, passThreshold: 0.8, maxAttempts: 3,
    questions: [
      { question: 'In machine learning, "bias" refers specifically to:', options: [{ text: 'Any error a model makes, regardless of pattern', isCorrect: false }, { text: 'Systematic, patterned error that is tied to a group or feature and does not cancel out', isCorrect: true }, { text: 'Random scatter that averages away across many cases', isCorrect: false }, { text: 'A deliberate, conscious preference programmed by the developer', isCorrect: false }], correctAnswer: 1, explanation: 'Bias is systematic, directional error tied to a group or feature. It is distinct from noise (random error that cancels out) and need not be intentional.' },
      { question: 'Why does collecting more data of the same kind fail to fix algorithmic bias?', options: [{ text: 'Because larger datasets always overfit', isCorrect: false }, { text: 'Because more data reduces random noise, but a biased data-generating process simply produces more biased data', isCorrect: true }, { text: 'Because bias only exists in small datasets', isCorrect: false }, { text: 'Because more data makes models slower, not fairer', isCorrect: false }], correctAnswer: 1, explanation: 'More data reduces noise but scales bias when the underlying process is biased. Fixing bias requires changing what is measured and how the target is defined, not merely enlarging the sample.' },
      { question: 'In the Obermeyer et al. (2019) study, the algorithm under-served Black patients because it:', options: [{ text: 'Explicitly used race as a negative weight', isCorrect: false }, { text: 'Predicted future healthcare cost as a proxy for need, and unequal access made Black patients cost less at equal illness', isCorrect: true }, { text: 'Was trained only on white patients', isCorrect: false }, { text: 'Contained a software bug in its optimizer', isCorrect: false }], correctAnswer: 1, explanation: 'Cost was used as a proxy for need. Because of access barriers, equally-ill Black patients generated less cost, so the algorithm read "costs less" as "needs less" — a label-bias failure.' },
      { question: 'According to Gianfrancesco et al. (2018), a key risk of training models on EHR data is that:', options: [{ text: 'EHR data are always perfectly complete', isCorrect: false }, { text: 'Missing data are non-random and track socioeconomic status, language, and race, so vulnerable patients are systematically disadvantaged', isCorrect: true }, { text: 'EHR data eliminate clinician bias entirely', isCorrect: false }, { text: 'EHR-trained models cannot be deployed in mental health', isCorrect: false }], correctAnswer: 1, explanation: 'EHR records are sparser for low-access patients and missing in patterned, non-random ways. Models that ignore or impute these gaps can erase exactly the signal that mattered for underserved patients.' },
      { question: 'A feedback loop in clinical AI refers to:', options: [{ text: 'A model that retrains itself every night automatically', isCorrect: false }, { text: 'A biased model influencing care decisions, which then shape the future data the next model learns from, entrenching the inequity', isCorrect: true }, { text: 'A user interface that requests feedback from clinicians', isCorrect: false }, { text: 'A redundant network connection in the EHR', isCorrect: false }], correctAnswer: 1, explanation: 'When a biased model changes who is treated, it changes future records, which a future model again reads as lower need — a self-reinforcing spiral unless deliberately interrupted.' },
      { question: 'Speech-recognition and NLP tools are an equity concern in mental health primarily because:', options: [{ text: 'They are too expensive for most agencies', isCorrect: false }, { text: 'They can transcribe and interpret some dialects far less accurately, and language is the core medium of mental-health assessment', isCorrect: true }, { text: 'They never make errors', isCorrect: false }, { text: 'They only work in English-speaking countries', isCorrect: false }], correctAnswer: 1, explanation: 'Higher word-error rates for some speakers and misreadings of dialect and culturally specific expression introduce measurement bias that strikes at the heart of language-based assessment.' },
      { question: 'Pulse-oximetry and optical wearable sensors illustrate which bias mechanism?', options: [{ text: 'Deployment bias only', isCorrect: false }, { text: 'Measurement bias rooted in sensor physics and calibration, which can be less accurate on darker skin', isCorrect: true }, { text: 'Label bias only', isCorrect: false }, { text: 'No bias, since sensors are purely physical', isCorrect: false }], correctAnswer: 1, explanation: 'Optical sensors can systematically misread on darker skin tones, a measurement bias that any mental-health inference built on those signals inherits.' },
      { question: 'Why is a single advertised "average accuracy" figure inadequate for judging a tool\'s equity?', options: [{ text: 'Because accuracy is never a useful metric', isCorrect: false }, { text: 'Because high average accuracy can conceal a large performance gap for a minority subgroup', isCorrect: true }, { text: 'Because accuracy and fairness are identical concepts', isCorrect: false }, { text: 'Because averages are always falsified by vendors', isCorrect: false }], correctAnswer: 1, explanation: 'A 92% average can hide 96% for the majority and 78% for a minority. Equity requires performance disaggregated by the subgroups actually served.' },
      { question: 'Demographic parity as a fairness criterion requires that:', options: [{ text: 'Error rates be equal across groups', isCorrect: false }, { text: 'The proportion of positive predictions be equal across groups', isCorrect: true }, { text: 'A given score mean the same probability across groups', isCorrect: false }, { text: 'Similar individuals be treated similarly', isCorrect: false }], correctAnswer: 1, explanation: 'Demographic (statistical) parity equalizes the rate of positive predictions across groups. It differs from equalized odds (equal error rates) and calibration (equal score meaning).' },
      { question: 'The "impossibility result" in fairness research establishes that:', options: [{ text: 'Fairness is impossible to define', isCorrect: false }, { text: 'When base rates differ between groups, a model generally cannot satisfy calibration and equalized odds at the same time', isCorrect: true }, { text: 'AI can never outperform clinicians', isCorrect: false }, { text: 'Bias auditing is mathematically impossible', isCorrect: false }], correctAnswer: 1, explanation: 'It is a theorem: when base rates differ, calibration and equal error rates cannot both hold except in degenerate cases. Fairness therefore demands a value choice about which criterion to prioritize.' },
      { question: 'Because fairness criteria conflict, the choice of which to prioritize is best understood as:', options: [{ text: 'A purely technical decision with one correct answer', isCorrect: false }, { text: 'A value choice about whose errors matter most, which should be made transparently and not left to the vendor by default', isCorrect: true }, { text: 'An irrelevant detail clinicians can ignore', isCorrect: false }, { text: 'A choice that disappears with enough data', isCorrect: false }], correctAnswer: 1, explanation: 'Selecting a fairness criterion is choosing whose errors matter most — a value judgment that should be deliberate and transparent rather than an unexamined vendor default.' },
      { question: 'A "model card" (Mitchell et al., 2019) primarily provides:', options: [{ text: 'The source code of the model', isCorrect: false }, { text: 'The model\'s intended and out-of-scope uses and its performance disaggregated across relevant subgroups', isCorrect: true }, { text: 'A marketing summary of average accuracy only', isCorrect: false }, { text: 'The pricing tiers for the software', isCorrect: false }], correctAnswer: 1, explanation: 'A model card documents intended use, out-of-scope use, and subgroup-disaggregated performance — functioning like a medication package insert for an algorithm.' },
      { question: 'A "datasheet for datasets" (Gebru et al., 2021) is most useful for revealing:', options: [{ text: 'The model\'s final accuracy number', isCorrect: false }, { text: 'How the training data were collected, who is represented, what labels mean, and known limitations', isCorrect: true }, { text: 'The clinician\'s licensing requirements', isCorrect: false }, { text: 'The software\'s user-interface design', isCorrect: false }], correctAnswer: 1, explanation: 'Because so much bias originates in data, a datasheet exposing the population, labels, and limitations is often more revealing than any model statistic.' },
      { question: 'Participatory design contributes to equity primarily by:', options: [{ text: 'Reducing the cost of model training', isCorrect: false }, { text: 'Including affected communities and frontline clinicians in decisions about what to predict, what counts as harm, and which trade-offs are acceptable', isCorrect: true }, { text: 'Eliminating the need for any auditing', isCorrect: false }, { text: 'Guaranteeing perfect mathematical fairness', isCorrect: false }], correctAnswer: 1, explanation: 'Participatory design builds equity in from the start by bringing those most likely to be harmed into the design process, countering the blind spots of homogeneous teams.' },
      { question: '"Informed skepticism" toward AI means:', options: [{ text: 'Refusing all AI tools on principle', isCorrect: false }, { text: 'Using AI where it genuinely helps while holding its output to clinical evidentiary standards and staying alert to equity failures', isCorrect: true }, { text: 'Always deferring to the algorithm to reduce liability', isCorrect: false }, { text: 'Trusting any tool that advertises high accuracy', isCorrect: false }], correctAnswer: 1, explanation: 'Informed skepticism rejects both automation bias and reflexive refusal, treating algorithmic output as one weighted input held to the same evidentiary standard as any clinical instrument.' },
      { question: 'Documenting a clinical override of an AI recommendation is valuable because it:', options: [{ text: 'Hides the disagreement from auditors', isCorrect: false }, { text: 'Protects the patient and clinician and, in aggregate, can serve as an early-warning signal of a biased tool', isCorrect: true }, { text: 'Transfers all liability to the vendor', isCorrect: false }, { text: 'Is required only when the algorithm is correct', isCorrect: false }], correctAnswer: 1, explanation: 'Overrides preserve human judgment in the record, demonstrate reasoned practice, and in aggregate can reveal a pattern that triggers an audit of a biased tool.' },
      { question: 'The bioethical principle of justice, as applied to clinical AI, asks:', options: [{ text: 'Whether the tool is profitable for the vendor', isCorrect: false }, { text: 'For whom the benefits and harms of a tool fall — not merely whether it helps on average', isCorrect: true }, { text: 'Whether the model uses the fastest algorithm available', isCorrect: false }, { text: 'Only whether patients consented to treatment', isCorrect: false }], correctAnswer: 1, explanation: 'Justice concerns the fair distribution of benefits and burdens. A tool helpful on average can still violate justice by concentrating harm on the marginalized — the question is "for whom, and at whose expense?"' },
      { question: 'Removing the explicit "race" variable from a model usually fails to remove racial bias because:', options: [{ text: 'Race is the only variable that matters', isCorrect: false }, { text: 'Correlated proxies such as ZIP code, insurance type, and prior utilization allow the model to reconstruct and act on race', isCorrect: true }, { text: 'Models cannot process categorical variables', isCorrect: false }, { text: 'It always improves fairness instantly', isCorrect: false }], correctAnswer: 1, explanation: 'Proxies correlated with race let a model reconstruct the protected attribute and keep discriminating; sometimes including the attribute is necessary to measure and correct bias.' },
    ],
  },

  references: [
    'Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. Science, 366(6464), 447–453.',
    'Gianfrancesco, M. A., Tamang, S., Yazdany, J., & Schmajuk, G. (2018). Potential biases in machine learning algorithms using electronic health record data. JAMA Internal Medicine, 178(11), 1544–1547.',
    'Char, D. S., Shah, N. H., & Magnus, D. (2018). Implementing machine learning in health care — Addressing ethical challenges. New England Journal of Medicine, 378(11), 981–983.',
    'Mehrabi, N., Morstatter, F., Saxena, N., Lerman, K., & Galstyan, A. (2021). A survey on bias and fairness in machine learning. ACM Computing Surveys, 54(6), 1–35.',
    'Mitchell, M., Wu, S., Zaldivar, A., Barnes, P., Vasserman, L., Hutchinson, B., Spitzer, E., Raji, I. D., & Gebru, T. (2019). Model cards for model reporting. Proceedings of the Conference on Fairness, Accountability, and Transparency, 220–229.',
    'Gebru, T., Morgenstern, J., Vecchione, B., Vaughan, J. W., Wallach, H., Daumé III, H., & Crawford, K. (2021). Datasheets for datasets. Communications of the ACM, 64(12), 86–92.',
    'Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 1–15.',
    'Chouldechova, A. (2017). Fair prediction with disparate impact: A study of bias in recidivism prediction instruments. Big Data, 5(2), 153–163.',
    'Kleinberg, J., Mullainathan, S., & Raghavan, M. (2017). Inherent trade-offs in the fair determination of risk scores. Proceedings of Innovations in Theoretical Computer Science (ITCS).',
    'Koenecke, A., Nam, A., Lake, E., Nudell, J., Quartey, M., Mengesha, Z., Toups, C., Rickford, J. R., Jurafsky, D., & Goel, S. (2020). Racial disparities in automated speech recognition. Proceedings of the National Academy of Sciences, 117(14), 7684–7689.',
    'Sjoding, M. W., Dickson, R. P., Iwashyna, T. J., Gay, S. E., & Valley, T. S. (2020). Racial bias in pulse oximetry measurement. New England Journal of Medicine, 383(25), 2477–2478.',
    'Rajkomar, A., Hardt, M., Howell, M. D., Corrado, G., & Chin, M. H. (2018). Ensuring fairness in machine learning to advance health equity. Annals of Internal Medicine, 169(12), 866–872.',
    'World Health Organization. (2021). Ethics and governance of artificial intelligence for health: WHO guidance. World Health Organization.',
    'American Psychological Association. (2017). Multicultural guidelines: An ecological approach to context, identity, and intersectionality. American Psychological Association.',
    'Benjamin, R. (2019). Race after technology: Abolitionist tools for the new Jim Code. Polity Press.',
    'Char, D. S., Abràmoff, M. D., & Feudtner, C. (2020). Identifying ethical considerations for machine learning healthcare applications. American Journal of Bioethics, 20(11), 7–17.',
    'National Institute of Standards and Technology. (2023). Artificial intelligence risk management framework (AI RMF 1.0). U.S. Department of Commerce.',
  ],

  resources: [
    { title: 'WHO — Ethics and Governance of AI for Health', url: 'https://www.who.int/publications/i/item/9789240029200', type: 'pdf', description: 'WHO guidance establishing equity, transparency, and accountability principles for AI in health.' },
    { title: 'Algorithmic Justice League', url: 'https://www.ajl.org/', type: 'link', description: 'Advocacy and research on AI bias, audits, and accountable algorithmic governance.' },
    { title: 'AHRQ — Healthcare Quality and Disparities', url: 'https://www.ahrq.gov/', type: 'link', description: 'Federal data and tools for measuring and reducing healthcare inequity.' },
    { title: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', type: 'link', description: 'Standards framework for identifying and managing AI risks, including bias.' },
  ],
};

function stripHtml(h){return(h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(s){return stripHtml(s).split(/\s+/).filter(Boolean).length;}
function validate(course){
  const errors=[],warnings=[];
  let total=0;
  (course.sections||[]).forEach(s=>{(s.contentBlocks||[]).forEach(b=>{
    total+=countWords(b.content||'')+countWords(b.question||'')+countWords(b.explanation||'')+countWords(b.subtitle||'')+countWords(b.title||'')+countWords(b.instructions||'')+countWords(b.matchingInstructions||'');
    (b.accordionItems||[]).forEach(a=>{total+=countWords(a.title)+countWords(a.content);});
    (b.flashcards||[]).forEach(f=>{total+=countWords(f.front)+countWords(f.back);});
    (b.matchingPairs||[]).forEach(p=>{total+=countWords(p.term)+countWords(p.definition);});
    (b.options||[]).forEach(o=>{total+=countWords(typeof o==='object'?o.text:o);});
    (b.cards||[]).forEach(c=>{total+=countWords(c.text);});
    (b.takeaways||[]).forEach(t=>{total+=countWords(t);});
    (b.steps||[]).forEach(st=>{total+=countWords(st.text);});
    (b.blanks||[]).forEach(bl=>{total+=countWords(bl.prompt)+countWords(bl.answer);});
    if(b.nodes){const nv=Array.isArray(b.nodes)?b.nodes:Object.values(b.nodes);nv.forEach(n=>{total+=countWords(n.text||'');(n.choices||[]).forEach(ch=>total+=countWords(ch.text||''));});}
  });});
  const req=course.ceHours*6000;
  if(total<req) errors.push(`Word count ${total} < ${req}`);
  else console.log(`✅ Words: ${total.toLocaleString()}/${req.toLocaleString()}`);
  (course.sections||[]).forEach((s,i)=>{
    const b=s.contentBlocks||[];
    if(!b[0]||b[0].type!=='sectionDivider') errors.push(`Sec ${i+1} no sectionDivider first`);
    if(b[0]&&(!b[0].title||!b[0].subtitle)) errors.push(`Sec ${i+1} divider missing title/subtitle`);
    b.forEach((blk,bi)=>{if(blk.type==='multipleChoice'||blk.type==='multiSelect'){if(!Array.isArray(blk.options)||typeof blk.options[0]!=='object') errors.push(`Sec ${i+1} blk ${bi+1}: flat options`);}});
  });
  if((course.assessment?.questions||[]).length<15) errors.push(`Assessment <15 Qs`);
  if(course.assessment?.passingScore!==80) errors.push('passingScore≠80');
  if(course.maxAttempts!==3) errors.push('maxAttempts≠3');
  if((course.references||[]).length<15) errors.push(`Refs: ${(course.references||[]).length}<15`);
  else console.log(`✅ Refs: ${course.references.length}`);
  return{errors,warnings,total};
}
async function main(){
  const{errors,warnings,total}=validate(COURSE);
  COURSE.wordCount=total;
  warnings.forEach(w=>console.warn('⚠️',w));
  if(errors.length){errors.forEach(e=>console.error('❌',e));process.exit(1);}
  if(process.env.DRY_RUN){console.log('✅ DRY_RUN validation passed —',SLUG);process.exit(0);}
  await mongoose.connect(MONGODB_URI);
  const col=mongoose.connection.db.collection('interactivecourses');
  const existing=await col.findOne({slug:SLUG});
  if(existing){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated:',SLUG);}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted:',SLUG);}
  const saved=await col.findOne({slug:SLUG});
  const blocks=(saved.sections||[]).reduce((n,s)=>n+(s.contentBlocks?.length||0),0);
  console.log(`Sections:${saved.sections?.length}|Blocks:${blocks}|Qs:${saved.assessment?.questions?.length}|Refs:${saved.references?.length}|isPublished:${saved.isPublished}`);
  await mongoose.disconnect();process.exit(0);
}
main().catch(e=>{console.error(e.message);process.exit(1);});
