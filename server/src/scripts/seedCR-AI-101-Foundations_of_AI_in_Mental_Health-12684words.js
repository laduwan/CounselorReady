import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && !process.env.DRY_RUN) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'foundations-of-ai-in-mental-health-practice';

const COURSE = {
  title: 'Foundations of Artificial Intelligence in Mental Health Practice',
  slug: SLUG, courseCode: 'CR-AI-101',
  subtitle: 'Concepts, Capabilities, and Clinical Cautions for the Practicing Counselor',
  description: 'A 2-hour intermediate CE course providing licensed mental health professionals with foundational, vendor-neutral literacy in artificial intelligence as it applies to clinical practice. Covers core technical concepts, the landscape of behavioral-health AI tools, the evidence gap between marketing and peer-reviewed science, and the clinician\'s responsible-adoption role under HIPAA, professional ethics, and FDA oversight. 12,684 words.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'Technology & Ethics', ceCategory: 'Technology & Ethics', contentArea: 'Professional Identity',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Professional Identity'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with expertise in telebehavioral health and technology-informed clinical practice.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychologists, and psychiatric NPs) seeking foundational literacy in artificial intelligence as it applies to clinical practice.'],
  tags: ['artificial intelligence', 'machine learning', 'technology', 'digital mental health', 'professional ethics'],
  objectives: [
    'Define artificial intelligence, machine learning, deep learning, natural language processing, and large language models, and differentiate supervised from unsupervised learning.',
    'Describe the major categories of artificial-intelligence tools currently marketed in behavioral health, including documentation scribes, conversational agents, predictive analytics, and clinical decision support.',
    'Differentiate peer-reviewed evidence of clinical benefit from unsubstantiated marketing claims when evaluating an artificial-intelligence product.',
    'Identify the principal limitations and failure modes of clinical artificial-intelligence systems, including hallucination, algorithmic bias, automation bias, and the black-box problem.',
    'Apply a human-in-the-loop, ethics-grounded framework to decisions about whether and how to adopt an artificial-intelligence tool in clinical practice.',
  ],

  sections: [
    {
      title: 'What Artificial Intelligence Actually Is',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '1', title: 'What Artificial Intelligence Actually Is', subtitle: 'Definitions, distinctions, and demystification for clinicians who need conceptual literacy, not engineering training', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Why Clinicians Need Conceptual Literacy</h2>
<p>Artificial intelligence has moved from the periphery of behavioral health to the center of vendor marketing, electronic health record roadmaps, and everyday clinical conversation. Counselors are now asked to evaluate documentation tools that "listen" to sessions, chatbots that "deliver therapy," and dashboards that "predict" which clients will deteriorate. Yet most graduate training programs offer no instruction in what these systems actually are, how they work, or where they fail. The result is a literacy gap that leaves well-meaning clinicians vulnerable to two opposite errors: uncritical enthusiasm, in which a tool is adopted because it sounds advanced, and reflexive rejection, in which a potentially useful tool is dismissed out of unfamiliarity. Both errors share a root cause, which is the absence of a working conceptual vocabulary.</p>
<p>The purpose of this course is not to make counselors into data scientists. It is to give clinicians enough accurate conceptual understanding to ask good questions, read product claims skeptically, protect client welfare, and remain compliant with professional and legal obligations. Topol (2019) argued in <em>Deep Medicine</em> that the central promise of artificial intelligence in health care is not the replacement of clinicians but the restoration of time and attention to the human relationship at the heart of care. Whether that promise is realized depends substantially on whether front-line clinicians understand the tools well enough to govern them rather than be governed by them.</p>
<p>Conceptual literacy also matters for professional identity. A counselor's professional identity rests on accountability for clinical judgment, on a defined scope of competence, and on a fiduciary duty to clients. Each of those pillars is tested when a tool offers to perform part of the clinical work. A clinician who does not understand the difference between a system that retrieves information and a system that generates plausible-sounding text cannot reasonably supervise that system, and a clinician who cannot supervise a tool cannot ethically delegate clinical tasks to it.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Defining the Core Terms</h2>
<p><strong>Artificial intelligence</strong> is a broad umbrella term for computer systems that perform tasks that ordinarily require human intelligence, such as recognizing patterns, understanding language, or making predictions. It is not a single technology but a family of approaches, and most of what is marketed today as "AI" is one specific branch called machine learning.</p>
<p><strong>Machine learning</strong> is the dominant contemporary approach in which a system improves its performance on a task by being exposed to data rather than by being explicitly programmed with rules. Instead of a programmer writing "if the client mentions hopelessness and sleep disturbance, flag depression," a machine-learning system is shown thousands of labeled examples and statistically infers the patterns that distinguish one category from another. The system does not understand depression; it identifies correlations in data.</p>
<p>Within machine learning, the distinction between <strong>supervised</strong> and <strong>unsupervised learning</strong> is foundational. In supervised learning, the system is trained on data that has been labeled by humans, such as session transcripts tagged "high risk" or "low risk," and it learns to predict the label for new, unlabeled cases. The quality of supervised learning depends entirely on the quality and representativeness of those human labels. In unsupervised learning, the system receives no labels and instead discovers structure on its own, for example clustering clients into groups that share features without any predefined definition of what those groups mean. Unsupervised methods are useful for exploration but require careful interpretation, because the patterns they surface may be clinically meaningless or may reflect artifacts of the data.</p>
<p><strong>Deep learning</strong> is a subfield of machine learning that uses <strong>neural networks</strong> with many layers. A neural network is a mathematical structure loosely inspired by the brain, composed of interconnected nodes that pass weighted signals forward. The word "deep" simply refers to the number of layers between input and output. Deep learning has driven most of the recent advances in image recognition and language processing, but the brain metaphor is loose and should not be taken literally; these systems do not think, feel, or understand in any human sense.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Language Models and Generative AI</h2>
<p><strong>Natural language processing</strong>, or NLP, is the branch of artificial intelligence concerned with enabling computers to work with human language, including tasks such as transcription, translation, summarization, and sentiment analysis. NLP is what allows a documentation tool to convert spoken words into text and to draft a note from a conversation. It is also what allows a screening system to scan free-text intake forms for words associated with risk.</p>
<p><strong>Large language models</strong>, or LLMs, are a particular kind of deep-learning system trained on enormous quantities of text to predict the next word in a sequence. Through that simple objective, repeated across billions of examples, these models acquire a remarkable facility for producing fluent, contextually appropriate language. Lee, Goldberg, and Kohane (2023), in <em>The AI Revolution in Medicine</em>, documented both the impressive capabilities and the unsettling failure modes of these systems when applied to clinical scenarios. The crucial conceptual point for clinicians is that a language model produces text that is statistically likely, not text that is verified to be true. Fluency is not accuracy, and confidence of tone is not evidence of correctness.</p>
<p><strong>Generative AI</strong> is the broad category of systems, including large language models and image generators, that produce new content rather than merely classifying or predicting from fixed options. When a tool drafts a treatment plan, writes a progress note, or composes a chatbot reply, it is generating content. Generation is powerful but introduces a distinctive risk: the system can produce material that is coherent, plausible, and entirely fabricated. This phenomenon, often called hallucination, is examined in depth in Section 3.</p>
<h3>Hype Versus Reality</h3>
<p>Public discourse frequently conflates today's narrow, task-specific systems with hypothetical artificial general intelligence, a system with human-level flexible reasoning that does not exist. Every clinical tool a counselor will encounter is narrow artificial intelligence built for a specific task, however broad its marketing language. Recognizing this distinction inoculates clinicians against the marketing claim that a product "thinks like a clinician" or "understands the client." It does neither. It computes.</p>`,
        },
        {
          type: 'text', order: 4.5,
          content: `<h2>How a Model Comes to Exist</h2>
<p>It helps clinicians to hold a concrete, non-technical picture of how a machine-learning model is actually built, because the building process is where most clinical risks originate. The lifecycle has four broad stages, and a failure at any stage propagates into the clinic. The first stage is <strong>data collection</strong>. Engineers assemble a body of examples, perhaps millions of clinical notes, transcripts, images, or outcome records, that will teach the system. The composition of this data is the most consequential decision in the entire process. If the data overrepresent some populations and underrepresent others, the resulting model will be more accurate for the former and less accurate for the latter, regardless of how sophisticated the algorithm is. Data are not a neutral substrate; they are a record of who was measured, how, and under what historical conditions.</p>
<p>The second stage is <strong>training</strong>, in which the system repeatedly adjusts its internal parameters to reduce the difference between its predictions and the known answers in the data. Training is an optimization process, a relentless search for the parameter values that minimize error on the examples provided. Crucially, the system optimizes for the objective it is given, not for the objective a clinician might assume. If the objective is "predict cost," the model will faithfully predict cost even when the clinician needs it to predict need. The objective is chosen by humans, and a poorly chosen objective produces a technically excellent solution to the wrong problem.</p>
<p>The third stage is <strong>validation and testing</strong>, in which the model is evaluated on data it did not see during training to estimate how it will perform on new cases. A model that performs well on its training data but poorly on new data is said to be <strong>overfit</strong>, meaning it has memorized noise rather than learning generalizable patterns. Overfitting is a central reason that impressive laboratory results frequently fail to reproduce in real clinical settings. The fourth stage is <strong>deployment and monitoring</strong>, in which the model meets the messy reality of actual practice. Patient populations shift, documentation styles change, and a model that was accurate at launch can quietly degrade over time, a phenomenon called <strong>model drift</strong>. A responsible deployment includes ongoing monitoring; a careless one assumes the model remains valid forever. For the clinician, the practical takeaway is that a model is a perishable product built from a particular dataset for a particular objective, validated under particular conditions, and that none of those particulars are guaranteed to match the client in the room.</p>`,
        },
        {
          type: 'callout', order: 5, calloutType: 'key', title: 'The Conceptual Hierarchy at a Glance',
          content: '<ul><li><strong>Artificial intelligence</strong> is the broad umbrella: machines performing tasks that ordinarily require human intelligence.</li><li><strong>Machine learning</strong> is the dominant branch: systems that learn patterns from data rather than from hand-coded rules.</li><li><strong>Deep learning</strong> is a subset of machine learning that uses multi-layered neural networks.</li><li><strong>Natural language processing</strong> applies these methods to human language.</li><li><strong>Large language models</strong> are deep-learning systems that predict likely text; <strong>generative AI</strong> is the broader family of content-producing systems.</li><li>All clinical tools you will meet are <strong>narrow</strong> AI built for specific tasks; general human-level intelligence does not exist in any product.</li></ul>',
        },
        {
          type: 'accordion', order: 6, title: 'Plain-Language Definitions Clinicians Can Reuse',
          accordionItems: [
            { title: 'What is a "model"?', content: '<p>A model is the trained mathematical object that results from a machine-learning process. After training on data, the model is the thing that takes a new input and produces an output, such as a predicted risk score or a generated sentence. When a vendor says their tool "uses a model," they mean a statistical function tuned on data, not a reasoning mind. The model has no awareness of clients, ethics, or consequences.</p>' },
            { title: 'What are "training data"?', content: '<p>Training data are the examples a system learns from. Their quality, quantity, and representativeness determine almost everything about how a model behaves. A model trained mostly on data from one demographic group will tend to perform worse for groups underrepresented in that data. When evaluating any tool, asking what data it was trained on is one of the single most informative questions a clinician can pose.</p>' },
            { title: 'What is a "parameter"?', content: '<p>Parameters are the internal numerical values a model adjusts during training. Large language models have billions of them. The number of parameters is often cited as a marketing proxy for capability, but more parameters do not guarantee clinical accuracy, safety, or appropriateness. Scale and validity are different things.</p>' },
            { title: 'What does "fine-tuning" mean?', content: '<p>Fine-tuning is additional training applied to an existing general model to specialize it for a narrower task, such as clinical documentation. Fine-tuning can improve relevance but cannot guarantee that a model has eliminated its underlying tendencies toward error or bias. A fine-tuned clinical model is still a statistical text generator at its core.</p>' },
            { title: 'Why is the "brain" metaphor misleading?', content: '<p>Neural networks borrow the word "neuron" from biology, but the resemblance is superficial. Artificial neurons are simple weighted sums passed through a mathematical function. They do not carry meaning, intention, or understanding. Treating a neural network as a small brain leads to overestimating its judgment and underestimating the clinician\'s irreplaceable role.</p>' },
          ],
        },
        {
          type: 'text', order: 6.5,
          content: `<h2>Hype Versus Reality: A Closer Look</h2>
<p>Because so much of a clinician's exposure to artificial intelligence arrives through marketing and media, it is worth examining the specific gap between how these systems are described and how they actually work. Marketing frequently borrows the language of human cognition, telling clinicians that a tool "understands," "thinks," "learns about your client," or "reasons like an expert." Each of these verbs imports a false picture. A large language model does not understand; it predicts likely text. It does not think; it computes. It does not learn about an individual client in any meaningful sense during a conversation; it pattern-matches against its training. And it does not reason like an expert; it produces output that statistically resembles expert language, which is a fundamentally different thing. Holding the accurate, deflationary description in mind is a clinical protection, because it keeps the clinician from granting the tool an authority it has not earned.</p>
<p>A second source of confusion is the conflation of today's narrow systems with science-fiction artificial general intelligence. Narrow artificial intelligence is built for a specific task and cannot transfer its competence outside that task; a documentation model cannot triage a crisis, and a risk model cannot write a treatment plan, regardless of how broadly either is marketed. Artificial general intelligence, a system with flexible, human-level reasoning across domains, does not exist and is not what any clinical product delivers. When a vendor implies that its tool possesses general intelligence, the implication is false, and recognizing it as false is part of basic literacy. The clinician who keeps the narrow-versus-general distinction firmly in mind will not be seduced by claims of comprehensive clinical capability.</p>
<p>A third reality check concerns confidence and tone. These systems are engineered to produce fluent, assured, well-organized output, and human readers are predisposed to equate confidence with competence. In a clinical context, this is precisely backward: a confidently stated falsehood is more dangerous than an obviously uncertain one, because it is more likely to be believed. The well-formatted note, the assured recommendation, and the articulate chatbot reply all carry a rhetorical authority that has nothing to do with accuracy. A literate clinician learns to discount tone entirely and to evaluate substance, asking not "how confident does this sound" but "what is the evidence that this is correct." This deflationary, evidence-anchored stance is the throughline of the entire course, and it begins with refusing to mistake the polished surface of these tools for the clinical judgment they cannot provide.</p>`,
        },
        {
          type: 'imageText', order: 7, title: 'From Rules to Patterns',
          content: '<p>Traditional software follows explicit rules a programmer writes by hand. Machine learning inverts this: humans supply examples, and the system infers the rules statistically. This inversion is the source of both the power and the unpredictability of modern artificial intelligence. Because the rules are learned rather than written, no human can fully inspect or anticipate every behavior of a complex model, which is precisely why human oversight in clinical settings is non-negotiable.</p>',
          image: '', imageAlt: 'Conceptual diagram contrasting rule-based programming with data-driven machine learning', imagePosition: 'right',
        },
        {
          type: 'videoEmbed', order: 8, videoTitle: 'Machine Learning in Plain Language',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aiconcept',
          description: 'A short conceptual primer distinguishing artificial intelligence, machine learning, deep learning, and large language models for a clinical audience. Use it to anchor the vocabulary introduced in this section before proceeding.',
        },
        {
          type: 'flashcardDeck', order: 9,
          instructions: 'Review the foundational vocabulary until each term is clear. These definitions recur throughout the course.',
          flashcards: [
            { id: 'f1', front: 'Machine learning', back: 'A branch of artificial intelligence in which a system improves at a task by learning statistical patterns from data rather than from explicitly programmed rules. Its performance depends heavily on the quality and representativeness of its training data.' },
            { id: 'f2', front: 'Supervised vs. unsupervised learning', back: 'Supervised learning trains on human-labeled examples to predict labels for new cases; unsupervised learning finds structure in unlabeled data, such as clusters, without predefined categories. Supervised learning is only as good as its labels.' },
            { id: 'f3', front: 'Deep learning and neural networks', back: 'Deep learning uses multi-layered neural networks, mathematical structures loosely inspired by the brain. The brain metaphor is superficial; these systems compute weighted sums and do not understand meaning.' },
            { id: 'f4', front: 'Large language model (LLM)', back: 'A deep-learning system trained on vast text to predict likely next words. It produces fluent, statistically probable language, which is not the same as verified, accurate, or true information.' },
            { id: 'f5', front: 'Generative AI', back: 'Systems that produce new content (text, images) rather than only classifying or predicting from fixed options. Generation introduces the risk of plausible but fabricated output, known as hallucination.' },
          ],
        },
        {
          type: 'multipleChoice', order: 10,
          question: 'A vendor states that its documentation tool "understands your clinical reasoning and thinks like an experienced therapist." The most accurate clinical interpretation is that the tool:',
          options: [
            { text: 'Possesses genuine clinical reasoning equivalent to a licensed clinician', isCorrect: false },
            { text: 'Is a narrow, task-specific statistical system that generates plausible text and does not understand or reason in a human sense', isCorrect: true },
            { text: 'Has achieved artificial general intelligence and can be trusted with autonomous decisions', isCorrect: false },
            { text: 'Replaces the clinician\'s scope of competence for documentation tasks', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Every clinical product currently available is narrow artificial intelligence built for a specific task. Claims of understanding or thinking like a clinician are marketing language; the underlying system computes statistical patterns and generates likely text without comprehension.',
        },
        {
          type: 'multiSelect', order: 11,
          question: 'Which of the following statements about large language models are accurate? (Select all that apply)',
          options: [
            { text: 'They generate text that is statistically likely rather than verified to be true', isCorrect: true },
            { text: 'Fluent, confident output is reliable evidence that the content is factually correct', isCorrect: false },
            { text: 'They are trained primarily by predicting likely sequences of words from large text corpora', isCorrect: true },
            { text: 'They can produce coherent but entirely fabricated content', isCorrect: true },
            { text: 'They possess conscious understanding of the clients they describe', isCorrect: false },
          ],
          explanation: 'Large language models predict probable text from training corpora; their fluency reflects statistical likelihood, not truth. They can fabricate plausible content and have no conscious understanding. Confidence of tone is never evidence of accuracy.',
        },
        {
          type: 'reflection', order: 12, question: 'Think of one artificial-intelligence tool you have already encountered in your practice, your agency, or your electronic health record. Before this course, what did you assume it could do? Having reviewed the core definitions, what would you now want to verify about how it actually works before relying on it with a client?' },
        {
          type: 'keyTakeaway', order: 13, title: 'Key Takeaways',
          takeaways: [
            'Artificial intelligence is an umbrella term; most clinical tools are machine-learning systems that learn statistical patterns from data.',
            'Supervised learning depends on the quality of human labels; unsupervised learning finds structure that still requires careful clinical interpretation.',
            'Large language models generate statistically likely text, which is not the same as accurate or true content.',
            'All clinical products are narrow artificial intelligence; human-level general intelligence does not exist in any tool you will use.',
            'Conceptual literacy lets clinicians ask good questions and supervise tools rather than be governed by them.',
          ],
        },
      ],
    },
    {
      title: 'The Landscape of AI in Behavioral Health',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '2', title: 'The Landscape of AI in Behavioral Health', subtitle: 'The major categories of tools clinicians are encountering, and where adoption actually stands today', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Mapping the Tool Categories</h2>
<p>The phrase "AI in mental health" describes a sprawling and uneven field. To evaluate any single product, a clinician must first know which category it belongs to, because the benefits, risks, and regulatory questions differ sharply by category. Six categories cover most of what counselors will encounter. None of the named products in this section are endorsed; they are cited only to make the categories concrete and to illustrate the diversity within each.</p>
<p>The first category is <strong>ambient documentation and AI scribes</strong>. These tools use natural language processing to capture the audio of a session, transcribe it, and draft a clinical note, often a structured progress note or treatment summary. Nuance DAX and similar ambient systems have driven much of the recent enthusiasm because documentation burden is a leading contributor to clinician burnout. The clinical appeal is the return of attention to the client rather than the keyboard. The clinical risk is that a drafted note may contain transcription errors, fabricated detail, or a polished narrative that does not match what actually occurred, which the clinician remains fully responsible for reviewing and correcting.</p>
<p>The second category is <strong>conversational agents and chatbots</strong>, which range from simple scripted symptom-trackers to large-language-model-driven systems that converse in open-ended language. Woebot and Wysa are frequently cited examples that deliver structured, manual-based content such as cognitive behavioral exercises. These tools raise the sharpest questions in the field: when a system converses with a person in distress, who is responsible for safety, what happens at moments of crisis, and is the interaction therapy or something else? D'Alfonso (2020) and Torous and colleagues have repeatedly emphasized that conversational engagement is not equivalent to clinical efficacy, and that crisis escalation pathways are a non-negotiable safety feature.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Prediction, Decision Support, and Measurement</h2>
<p>The third category is <strong>predictive analytics and risk flagging</strong>. These systems analyze structured and unstructured data, such as appointment patterns, symptom scores, or note text, to estimate the likelihood of an outcome such as suicide attempt, hospitalization, or dropout. Predictive risk models have generated significant research interest and significant controversy. A model can surface patterns invisible to a single clinician, but it can also generate false alarms that consume resources, miss cases that do not match historical patterns, and embed the biases of the population it was trained on. A risk flag is a hypothesis to be evaluated by a clinician, never a verdict.</p>
<p>The fourth category is <strong>clinical decision support</strong>, in which a system offers suggestions intended to inform clinical choices, such as proposing a differential, recommending a measure, or surfacing a relevant guideline. Decision support sits at the boundary of regulated medical-device territory, a boundary the United States Food and Drug Administration has worked to clarify. The defining design question for decision support is whether the clinician retains genuine, informed authority over the decision or whether the tool's suggestion exerts undue influence, a problem known as automation bias.</p>
<p>The fifth category is <strong>measurement-based-care analytics</strong>, which aggregates standardized outcome measures, such as the PHQ-9 or GAD-7, to track client progress, detect non-response, and inform treatment adjustment. This is among the more evidence-supported applications, because it amplifies a practice, routine outcome monitoring, that already has a strong research base. The artificial-intelligence layer here is often modest, summarizing and visualizing data the clinician already collects.</p>
<p>The sixth category is <strong>administrative automation</strong>: scheduling, billing, insurance verification, intake routing, and other operational tasks. These applications are often the least clinically risky and the most immediately useful, because errors are typically operational rather than clinical, and because they free clinician time without touching clinical judgment. They are not, however, free of risk; an automated intake system that misroutes a high-acuity client, or a billing tool that mishandles protected health information, can cause real harm.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Where Adoption Actually Stands</h2>
<p>Marketing implies that artificial intelligence is already woven through behavioral health care. The reality is more uneven. Adoption is most advanced in administrative automation and documentation, where the value proposition is clear and the clinical risk is contained. Adoption of conversational agents has grown rapidly in direct-to-consumer and employer-sponsored wellness contexts, frequently outside the regulated clinical system and outside the supervision of any licensed clinician, which is itself a source of risk. Predictive analytics and clinical decision support remain comparatively early, concentrated in large integrated health systems with the data infrastructure and informatics staff to deploy and monitor them.</p>
<p>Several forces shape this landscape. The World Health Organization (2021), in its guidance on the ethics and governance of artificial intelligence for health, warned that hype can outpace evidence and that low-resource settings risk receiving inadequately validated tools. Within the United States, the Office of the National Coordinator for Health Information Technology has advanced transparency requirements for predictive algorithms embedded in certified health record systems, reflecting a regulatory recognition that clinicians cannot oversee what they cannot see. The net effect is a field moving quickly in some corners and cautiously in others, with the clinician frequently positioned as the last and most important safeguard.</p>
<p>For the practicing counselor, the practical implication is that "Is this AI good?" is the wrong question. The better questions are: Which category is this tool? What clinical task does it touch? Who is accountable when it errs? And what evidence, beyond the vendor's claims, supports its use for my population? Section 3 examines that evidence directly.</p>`,
        },
        {
          type: 'text', order: 4.5,
          content: `<h2>How the Categories Behave in Real Workflows</h2>
<p>Categories are clarifying, but in practice a single product often spans several of them, which is where clinical confusion begins. An electronic health record vendor may bundle an ambient scribe, a measurement-based-care dashboard, and an embedded predictive risk model into one interface, presenting them as a unified "AI suite." The clinician experiences a seamless screen, but the underlying tools carry very different risk profiles and very different accountability questions. The scribe error is a documentation error the clinician must catch; the risk-model error is a clinical-judgment error that can misdirect care; the dashboard error is a measurement error that can distort the picture of progress. Treating a bundled suite as a single trustworthy entity obscures these distinctions. A literate clinician mentally disaggregates the suite back into its component categories and evaluates each on its own terms.</p>
<p>Workflow placement also shapes risk. A documentation scribe that drafts a note for end-of-day review sits in a low-pressure position where the clinician has time to correct it. The same scribe configured to auto-populate and auto-sign notes between back-to-back sessions sits in a high-pressure position that all but guarantees unreviewed errors will reach the record. The technology is identical; the workflow is the variable that determines safety. This is why responsible adoption is never only about the tool. It is about the tool plus the workflow plus the clinician plus the population, considered together.</p>
<p>Consider conversational agents specifically, because they generate the most public excitement and the most clinical concern. A scripted agent that walks a motivated client through a structured breathing exercise between sessions occupies a different risk tier than an open-ended, large-language-model-driven agent marketed as a stand-alone "therapist" to people in acute distress, with no licensed clinician supervising and no validated crisis-escalation pathway. The first is a homework aid; the second makes implicit clinical claims it may be unequipped to honor. Fiske, Henningsen, and Buyx (2019) examined precisely these ethical implications and underscored that the absence of a human safety net is not a minor feature gap but a central ethical problem when a tool engages vulnerable people. Categorizing a tool, then, is not an academic exercise. It is the first step in deciding how much trust, how much oversight, and how much caution a given product warrants.</p>`,
        },
        {
          type: 'imageText', order: 5, title: 'A Spectrum of Clinical Proximity',
          content: '<p>The six categories can be arranged along a spectrum of clinical proximity. Administrative automation sits farthest from clinical judgment and carries the most contained risk. Documentation and measurement analytics sit closer, touching the clinical record but leaving judgment to the clinician. Conversational agents, predictive risk models, and clinical decision support sit closest to clinical judgment and therefore demand the most rigorous evaluation, the strongest human oversight, and the clearest lines of accountability.</p>',
          image: '', imageAlt: 'Spectrum graphic arranging six AI tool categories by proximity to clinical judgment', imagePosition: 'left',
        },
        {
          type: 'callout', order: 6, calloutType: 'clinical', title: 'A Risk Flag Is a Hypothesis, Not a Verdict',
          content: '<p>When a predictive system flags a client as high risk, that flag is a starting point for clinical assessment, never a substitute for it. The clinician must independently evaluate the client, weigh the flag against direct observation and clinical history, and document the reasoning. Conversely, the absence of a flag does not clear a clinician of the duty to assess. Treating a model output as a clinical conclusion, in either direction, abdicates the professional judgment for which the clinician, not the vendor, remains legally and ethically responsible.</p>',
        },
        {
          type: 'accordion', order: 7, title: 'The Six Categories in Depth',
          accordionItems: [
            { title: 'Ambient documentation and AI scribes', content: '<p>Capture audio, transcribe, and draft notes. Reduce documentation burden but can introduce transcription errors and fabricated detail. The clinician must review and correct every note and remains the author of record.</p>' },
            { title: 'Conversational agents and chatbots', content: '<p>Range from scripted symptom trackers to open-ended language systems. Deliver structured content such as CBT exercises. Raise the sharpest safety questions, especially crisis escalation, accountability, and whether the interaction constitutes treatment.</p>' },
            { title: 'Predictive analytics and risk flagging', content: '<p>Estimate the likelihood of outcomes such as crisis, hospitalization, or dropout from clinical data. Can surface hidden patterns but also generate false alarms, miss atypical cases, and embed population bias. Outputs are hypotheses for clinician evaluation.</p>' },
            { title: 'Clinical decision support', content: '<p>Offers suggestions to inform clinical choices. Sits near regulated medical-device territory. The defining question is whether the clinician retains genuine informed authority or is unduly swayed by automation bias.</p>' },
            { title: 'Measurement-based-care analytics', content: '<p>Aggregates standardized measures such as the PHQ-9 and GAD-7 to track progress and detect non-response. Among the more evidence-supported applications because it amplifies routine outcome monitoring, which already has a strong research base.</p>' },
            { title: 'Administrative automation', content: '<p>Handles scheduling, billing, insurance verification, and intake routing. Typically the least clinically risky and most immediately useful, though errors in misrouting acute clients or mishandling protected health information can still cause harm.</p>' },
          ],
        },
        {
          type: 'text', order: 7.5,
          content: `<h2>Adoption Trends and the Forces Behind Them</h2>
<p>Understanding why adoption is uneven across categories equips clinicians to interpret the pressures they will encounter. Documentation and administrative tools have spread fastest because their value proposition is immediate and legible: they reduce a burden every clinician feels, and their errors are mostly contained to operational or correctable territory. Health systems can justify the investment without resolving deep questions about clinical efficacy, so procurement moves quickly. Conversational agents have spread fastest in the consumer and employer-wellness markets, outside the regulated clinical system, precisely because that market faces fewer validation requirements and can scale a product to millions of users before rigorous clinical evidence exists. This is why a counselor's clients may arrive already using a mental-health chatbot the counselor has never evaluated, and why the clinician's literacy must extend to tools they did not choose.</p>
<p>Predictive analytics and clinical decision support have spread slowest in routine practice, and for instructive reasons. These tools require substantial, well-structured data, informatics staff to deploy and monitor them, and governance to manage their errors, resources concentrated in large integrated systems. They also sit closest to clinical judgment and nearest the regulated medical-device boundary, which raises the stakes of every deployment. The result is a two-speed field: rapid, low-friction adoption where risk is contained, and cautious, infrastructure-heavy adoption where risk is high, with a large and lightly governed consumer market running alongside both.</p>
<p>Several forces will continue to shape these trends. Reimbursement policy determines which tools are financially viable; regulatory clarity from bodies like the Food and Drug Administration and transparency requirements from the Office of the National Coordinator for Health Information Technology shape what can be deployed and what must be disclosed; and workforce shortages create persistent pressure to adopt anything that promises to extend capacity. The World Health Organization's 2021 guidance warned specifically that this pressure, combined with hype, can lead to the deployment of inadequately validated tools, especially in under-resourced settings that can least absorb the consequences of failure. For the individual clinician, the practical lesson is that adoption trends reflect market and policy forces as much as clinical merit. A tool's popularity is evidence of its commercial appeal, not of its clinical value, and the two must never be confused.</p>`,
        },
        {
          type: 'cardSort', order: 8,
          instructions: 'Sort each described tool into the category that best fits its primary clinical function.',
          categories: ['Documentation / Measurement', 'Conversational / Predictive / Decision Support'],
          cards: [
            { id: 'cs1', text: 'A system that listens to a session, transcribes it, and drafts a progress note for clinician review', correctCategory: 'Documentation / Measurement' },
            { id: 'cs2', text: 'An app that converses with a person in distress and delivers cognitive behavioral exercises', correctCategory: 'Conversational / Predictive / Decision Support' },
            { id: 'cs3', text: 'A dashboard that charts PHQ-9 scores over time and flags non-response to a measure', correctCategory: 'Documentation / Measurement' },
            { id: 'cs4', text: 'A model that estimates the probability that a client will be hospitalized in the next 30 days', correctCategory: 'Conversational / Predictive / Decision Support' },
            { id: 'cs5', text: 'A tool that summarizes routine outcome measures collected at each visit into a progress report', correctCategory: 'Documentation / Measurement' },
            { id: 'cs6', text: 'A system that suggests a differential and recommends a guideline at the point of care', correctCategory: 'Conversational / Predictive / Decision Support' },
          ],
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'Across the current behavioral-health landscape, adoption of artificial intelligence is generally MOST advanced in which category?',
          options: [
            { text: 'Autonomous clinical decision support that replaces clinician judgment', isCorrect: false },
            { text: 'Administrative automation and documentation, where the value is clear and clinical risk is contained', isCorrect: true },
            { text: 'Fully validated predictive suicide-risk models deployed universally across small practices', isCorrect: false },
            { text: 'Chatbots that have been proven equivalent to licensed psychotherapy in head-to-head trials', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Adoption is most mature in administrative automation and documentation, where benefits are concrete and clinical risk is contained. Predictive analytics and decision support remain comparatively early and concentrated in large systems with informatics infrastructure.',
        },
        {
          type: 'matching', order: 10,
          matchingInstructions: 'Match each tool category to its defining clinical consideration.',
          matchingPairs: [
            { term: 'Ambient documentation scribe', definition: 'Reduces documentation burden but can fabricate or misstate detail; clinician must review and remains author of record' },
            { term: 'Conversational agent / chatbot', definition: 'Raises crisis-safety and accountability questions; engagement is not equivalent to clinical efficacy' },
            { term: 'Predictive risk flagging', definition: 'Outputs are hypotheses for clinician evaluation and can embed the biases of the training population' },
            { term: 'Measurement-based-care analytics', definition: 'Among the more evidence-supported uses because it amplifies routine outcome monitoring' },
          ],
        },
        {
          type: 'reflection', order: 11, question: 'Consider the tools already present in your clinical setting or being marketed to your agency. Which of the six categories do they fall into? For the one closest to clinical judgment, who in your setting is accountable when it produces an error, and is that line of accountability written down anywhere?' },
        {
          type: 'keyTakeaway', order: 12, title: 'Key Takeaways',
          takeaways: [
            'Six categories cover most behavioral-health tools: documentation scribes, conversational agents, predictive analytics, clinical decision support, measurement-based-care analytics, and administrative automation.',
            'Benefits, risks, and regulatory questions differ sharply by category; identify the category before evaluating any product.',
            'Adoption is most mature in administrative automation and documentation and earliest in predictive analytics and decision support.',
            'Conversational agents often operate outside the regulated clinical system and outside licensed supervision, which is itself a risk.',
            'The useful questions are which category, which clinical task, who is accountable, and what independent evidence supports use.',
          ],
        },
      ],
    },
    {
      title: 'Benefits, Limitations, and the Evidence Gap',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '3', title: 'Benefits, Limitations, and the Evidence Gap', subtitle: 'Separating real promise from real failure modes, and marketing claims from peer-reviewed evidence', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>The Genuine Potential Benefits</h2>
<p>An honest appraisal of artificial intelligence in behavioral health must begin by acknowledging real potential, because dismissing the field wholesale is as much an error as embracing it uncritically. Three benefit domains are most plausibly supported. The first is <strong>access</strong>. The shortage of mental health professionals is severe and worsening, and many people in need never reach a clinician. Scalable digital tools, including conversational agents and self-guided programs, can extend some forms of support to populations that would otherwise receive nothing, particularly low-intensity, structured interventions such as psychoeducation and guided cognitive behavioral exercises. Torous and colleagues have argued that the relevant comparison for many digital tools is not "tool versus expert therapist" but "tool versus no care at all," a framing that changes the ethical calculus while not erasing the safety obligations.</p>
<p>The second benefit domain is <strong>efficiency</strong>. Documentation, scheduling, and administrative tasks consume time that could be spent in direct care, and they are a leading driver of clinician burnout. Tools that reliably reduce this burden can, in principle, return clinician attention to clients, which is the human core of care that Topol (2019) identified as the deepest promise of medical artificial intelligence. The third domain is <strong>screening and detection</strong>. Pattern-recognition systems may help surface signals, such as deterioration in outcome measures or risk indicators in routinely collected data, that a busy clinician might miss, functioning as a second set of eyes that prompts, rather than replaces, clinical assessment.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>The Real Limitations and Failure Modes</h2>
<p>Against these benefits stand limitations that are not incidental but intrinsic to how these systems work. <strong>Hallucination</strong> is the tendency of generative systems, especially large language models, to produce fluent, confident, and entirely fabricated content, such as a citation to a study that does not exist, a symptom the client never reported, or a treatment recommendation with no basis. Because the output is coherent, hallucinations are dangerous precisely when the clinician is rushed or inclined to trust the tool. In documentation, an unreviewed hallucinated note becomes a permanent, legally consequential error in the clinical record.</p>
<p><strong>Algorithmic bias</strong> arises when a system performs unequally across groups, typically because its training data underrepresented or misrepresented some populations, or because the labels it learned from encoded human bias. Obermeyer and colleagues (2019), in a widely cited study published in <em>Science</em>, demonstrated that a widely used health-care risk algorithm systematically underestimated the needs of Black patients because it used health-care cost as a proxy for health-care need, and cost reflected unequal access rather than equal illness. The lesson generalizes: a model can be technically accurate on its own terms and still produce inequitable, harmful results in practice.</p>
<p><strong>Validation gaps</strong> are pervasive. Many marketed tools have little or no peer-reviewed evidence of clinical effectiveness for the populations and settings in which they are sold. A study showing that an app increased "engagement," or that users "liked" it, is not evidence that it improved a clinical outcome. The <strong>black-box problem</strong> compounds this: many deep-learning systems cannot explain why they produced a given output in terms a clinician can scrutinize, which makes it difficult to know when to trust a result and impossible to fully audit a decision after the fact.</p>
<p>Finally, <strong>automation bias</strong> is the human tendency to over-trust automated outputs, deferring to the machine even when one's own judgment or the available evidence should prompt doubt. Automation bias is a clinician-side failure mode, not a tool-side one, which means it cannot be engineered away by the vendor; it must be managed through training, workflow design, and a culture that treats tool outputs as inputs to judgment rather than substitutes for it.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Distinguishing Marketing From Evidence</h2>
<p>The single most valuable clinical skill in this domain is the ability to separate a marketing claim from a peer-reviewed finding. Marketing language is engineered to imply efficacy without asserting anything falsifiable. Phrases such as "clinically validated," "AI-powered," "evidence-based," and "proven to help" frequently appear without citation, without specification of the population studied, and without disclosure of who funded the research. A clinician evaluating a product should ask a disciplined series of questions: What specific clinical outcome was measured, and by whom? Was the study peer-reviewed and independent of the vendor, or was it internal? What population was studied, and does it resemble my clients? What were the comparison condition and the effect size? Were harms and dropouts reported, or only benefits?</p>
<p>The hierarchy of evidence that clinicians already apply to any intervention applies here without modification. A randomized controlled trial published in a peer-reviewed journal, ideally replicated and independent of the manufacturer, sits at the top. Vendor white papers, testimonials, engagement metrics, and press releases sit at the bottom and should carry little weight in a clinical decision. D'Alfonso (2020) and the broader digital-psychiatry literature have repeatedly cautioned that the volume of available products vastly exceeds the volume of rigorous evidence, and that the gap is widening as commercial incentives outpace scientific validation. Uncertainty is therefore the honest default. A clinician who cannot find independent peer-reviewed evidence for a tool's clinical benefit should treat that absence as meaningful and should not assume that confident marketing implies established science.</p>`,
        },
        {
          type: 'text', order: 4.5,
          content: `<h2>Why the Evidence Gap Persists</h2>
<p>The gap between the volume of marketed tools and the volume of rigorous evidence is not an accident, and understanding its causes helps clinicians anticipate it. The first cause is the mismatch between commercial and scientific timelines. Building and launching a product takes months; conducting, peer-reviewing, and replicating a clinical trial takes years. Commercial incentives reward speed to market, while scientific validation rewards patience and skepticism. A company can therefore sell a product for years before any independent trial exists, and by the time evidence arrives, the product may already have been updated into something the trial no longer describes. This is the moving-target problem: the artificial-intelligence tool a study evaluated in 2022 may bear little resemblance to the 2025 version a clinician is asked to adopt, even though it carries the same name.</p>
<p>The second cause is the difference between surrogate endpoints and clinical outcomes. It is far cheaper and faster to measure whether users open an app, complete modules, or report satisfaction than to measure whether their depression remits, their functioning improves, or their risk declines. Vendors therefore gravitate toward surrogate metrics, and unwary clinicians can mistake a strong engagement number for a strong clinical result. Engagement may be necessary for benefit, but it is not sufficient; a tool can be highly engaging and clinically inert, or even harmful. The third cause is publication and funding bias. Studies funded by a product's maker, or conducted by its developers, are more likely to report favorable results and less likely to publish disappointing ones. Independent replication is the antidote, and its scarcity in this field is itself a warning sign.</p>
<p>The fourth cause is the generalizability problem. A tool validated in a well-resourced academic medical center with a particular patient mix may perform very differently in a community clinic serving a different population. Bias and validation gaps interact here: a model can show good aggregate performance in a trial while performing poorly for the specific subgroups a given clinician serves. The disciplined response to all four causes is the same. Anchor on independent, peer-reviewed evidence of a genuine clinical outcome in a population resembling your own, weight the absence of such evidence heavily, and remain alert to the possibility that the version you are evaluating is not the version that was studied. Skepticism here is not cynicism; it is the ordinary scientific caution that competent clinical practice already demands of every intervention.</p>`,
        },
        {
          type: 'callout', order: 5, calloutType: 'warning', title: 'Hallucination in the Clinical Record',
          content: '<p>A generative documentation tool can insert a plausible but false statement into a note, such as a denied symptom, an unstated plan, or an event that never occurred. Once signed, that note is a legal and clinical record that the clinician authored and is accountable for. Never sign an artificial-intelligence-drafted note without reading it in full against your own memory of the session. Fluency is not accuracy, and a confident, well-formatted note can be confidently, well-formattedly wrong.</p>',
        },
        {
          type: 'accordion', order: 6, title: 'The Core Failure Modes, Defined',
          accordionItems: [
            { title: 'Hallucination', content: '<p>Fluent, confident, fabricated output, such as fake citations, invented symptoms, or unsupported recommendations. Most dangerous when the clinician is rushed or predisposed to trust the tool. Requires full human review of all generated clinical content.</p>' },
            { title: 'Algorithmic bias', content: '<p>Unequal performance across groups, usually traceable to unrepresentative training data or biased labels. A model can be accurate on its own metrics yet produce inequitable, harmful results, as Obermeyer et al. (2019) demonstrated with a cost-based risk algorithm.</p>' },
            { title: 'Validation gap', content: '<p>The absence of independent peer-reviewed evidence that a tool improves a clinical outcome for the relevant population. Engagement metrics and user satisfaction are not clinical outcomes. Absence of evidence should be treated as meaningful.</p>' },
            { title: 'The black-box problem', content: '<p>Many deep-learning systems cannot explain their outputs in clinician-auditable terms, making it hard to know when to trust a result and impossible to fully reconstruct a decision afterward. Explainability is a genuine clinical and ethical concern, not a technicality.</p>' },
            { title: 'Automation bias', content: '<p>The human tendency to over-defer to automated outputs even against better judgment. A clinician-side failure mode managed through training, workflow, and culture, not eliminable by the vendor. Tool outputs are inputs to judgment, never substitutes for it.</p>' },
          ],
        },
        {
          type: 'videoEmbed', order: 7, videoTitle: 'Bias and the Limits of Clinical Algorithms',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aibias',
          description: 'An overview of how algorithmic bias and the black-box problem arise in clinical systems, using the proxy-variable failure described by Obermeyer and colleagues as a concrete example. Reinforces the evidence-evaluation skills introduced in this section.',
        },
        {
          type: 'text', order: 7.5,
          content: `<h2>Bias, Equity, and the Populations Counselors Serve</h2>
<p>Algorithmic bias deserves extended treatment because counselors disproportionately serve populations most likely to be harmed by it. Bias enters a model through several doors. The most common is unrepresentative training data: if a model learned primarily from one demographic, it will be less accurate for others, and the groups most often underrepresented in clinical datasets are precisely those already underserved by the health system. A second door is biased labels. Because supervised learning imitates the human judgments encoded in its training labels, any systematic bias in those original human decisions, such as historical under-diagnosis or over-diagnosis of particular groups, is learned and then reproduced at scale, often with a veneer of objectivity that makes it harder to challenge. A third door is proxy variables, the failure Obermeyer and colleagues (2019) made famous, in which a model optimizes a measurable stand-in, such as cost, that correlates with the true target unequally across groups.</p>
<p>The clinical consequences are concrete. A risk model that underestimates need for a marginalized group may route its members to less intensive care. A screening tool trained on one linguistic or cultural population may misread the presentations of another, generating false negatives that leave real distress undetected or false positives that pathologize ordinary cultural expression. A documentation tool may transcribe some accents or dialects less accurately, degrading the record for the very clients whose care is already most fragile. Because these failures are statistical and often invisible at the level of any single case, they require deliberate attention to detect. A clinician who never asks how a tool performs across the groups they serve will not discover its biases until they have already shaped care.</p>
<p>Equity is therefore not a separate topic appended to artificial-intelligence literacy; it is woven through every part of it. Evaluating a tool means asking what population it was validated in and how it performs for one's own clients. Using a tool responsibly means watching for systematically different outcomes across groups and being willing to override or abandon a tool that fails them. Advocating within an organization means pressing for representative validation data and for monitoring that disaggregates performance by population rather than reporting only flattering aggregates. The counselor's commitment to non-discrimination and to client welfare, already central to professional ethics, extends naturally to the tools that increasingly mediate care. A tool that worsens inequity is not a neutral instrument that happens to underperform; it is a clinical and ethical liability that a literate clinician is obligated to recognize and resist.</p>`,
        },
        {
          type: 'sequencing', order: 8,
          instructions: 'Arrange the steps of a disciplined evidence appraisal in the order a clinician should follow when evaluating a vendor\'s efficacy claim.',
          steps: [
            { id: 's1', text: 'Identify the specific clinical outcome the vendor claims to improve, in measurable terms', order: 1 },
            { id: 's2', text: 'Locate the supporting study and determine whether it is peer-reviewed and independent of the vendor', order: 2 },
            { id: 's3', text: 'Examine the studied population and judge whether it resembles your own clients and setting', order: 3 },
            { id: 's4', text: 'Check the comparison condition, the effect size, and whether harms and dropouts were reported', order: 4 },
            { id: 's5', text: 'Weigh the finding against the evidence hierarchy and treat absence of independent evidence as meaningful', order: 5 },
          ],
          explanation: 'A rigorous appraisal moves from the claimed outcome, to the quality and independence of the evidence, to applicability to your population, to the completeness of reporting, and finally to a judgment that respects the evidence hierarchy and the honest default of uncertainty.',
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'A counselor reads that an app is "clinically validated and AI-powered" but can find only an internal vendor report measuring user engagement. The most defensible conclusion is that:',
          options: [
            { text: 'The engagement data establish that the app improves clinical outcomes', isCorrect: false },
            { text: 'Independent peer-reviewed evidence of clinical benefit is absent, and that absence should be treated as meaningful', isCorrect: true },
            { text: 'Marketing language reliably substitutes for peer-reviewed evidence', isCorrect: false },
            { text: 'User satisfaction is the appropriate top of the clinical evidence hierarchy', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Engagement and satisfaction are not clinical outcomes. Marketing phrases like "clinically validated" are not evidence. When independent, peer-reviewed efficacy data are absent, the honest default is uncertainty, and the clinician should weight that absence heavily.',
        },
        {
          type: 'fillInBlank', order: 10, title: 'Name the Failure Mode',
          blanks: [
            { prompt: 'The tendency of a generative system to produce fluent but fabricated content, such as a fake citation or an invented symptom, is called ____.', answer: 'hallucination', acceptAlternates: ['a hallucination'] },
            { prompt: 'The human tendency to over-trust an automated output even against one\'s own better judgment is called ____ bias.', answer: 'automation', acceptAlternates: [] },
            { prompt: 'When a system performs unequally across groups because of unrepresentative training data or biased labels, it exhibits algorithmic ____.', answer: 'bias', acceptAlternates: [] },
            { prompt: 'The inability of many deep-learning systems to explain their outputs in clinician-auditable terms is known as the ____ problem.', answer: 'black-box', acceptAlternates: ['black box', 'blackbox'] },
          ],
        },
        {
          type: 'reflection', order: 11, question: 'Recall a time you encountered a product, clinical or otherwise, described as "evidence-based" or "AI-powered." What questions did you ask before trusting it, and what questions, after this section, do you now wish you had asked? How will you apply the evidence-appraisal sequence to the next tool marketed to you?' },
        {
          type: 'keyTakeaway', order: 12, title: 'Key Takeaways',
          takeaways: [
            'Genuine benefits cluster in access, efficiency, and screening, but each comes with safety obligations that do not disappear.',
            'Hallucination, algorithmic bias, validation gaps, the black-box problem, and automation bias are intrinsic limitations, not incidental bugs.',
            'A model can be accurate on its own metrics and still produce inequitable, harmful outcomes, as Obermeyer et al. (2019) showed.',
            'Engagement metrics and user satisfaction are not clinical outcomes; the standard evidence hierarchy applies to artificial-intelligence tools unchanged.',
            'When independent peer-reviewed evidence is absent, uncertainty is the honest default, and confident marketing is not a substitute for science.',
          ],
        },
      ],
    },
    {
      title: 'The Clinician\'s Role and Responsible Adoption',
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '4', title: 'The Clinician\'s Role and Responsible Adoption', subtitle: 'Human-in-the-loop practice, scope of competence, the irreplaceable relationship, and the ethical and regulatory frame', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Human-in-the-Loop as the Organizing Principle</h2>
<p>The organizing principle for responsible adoption is the human-in-the-loop model, in which an artificial-intelligence system informs but never autonomously executes a clinical decision, and a qualified clinician retains genuine, informed authority over every clinically consequential output. Human-in-the-loop is not a slogan; it is a design and workflow commitment with concrete requirements. The clinician must be able to review the tool's output, must have the time and information needed to evaluate it meaningfully, and must retain the practical authority to override it without penalty. A workflow that nominally keeps a human in the loop but pressures the clinician to rubber-stamp outputs has, in practice, removed the human from the loop while preserving the appearance of oversight.</p>
<p>This principle directly counters automation bias. Tools should be configured and used so that their outputs arrive as suggestions requiring active clinician engagement, not as defaults that proceed unless the clinician intervenes. The difference between "the tool proposes, the clinician disposes" and "the tool acts unless stopped" is the difference between augmentation and abdication. Topol (2019) framed the ideal as artificial intelligence that hands time and attention back to the clinician for the human work of care; that ideal is realized only when the human remains genuinely in command of the clinical judgment.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Scope of Competence and the Irreplaceable Relationship</h2>
<p>Adopting a tool does not expand a clinician's scope of competence, and it does not transfer accountability to the vendor. A counselor remains responsible for clinical judgments informed by a tool to exactly the same degree as for judgments made without one. This has a practical corollary: a clinician should not deploy a tool whose outputs they cannot meaningfully evaluate. Using a risk-prediction model without understanding what it does, what it was trained on, and how it fails is not within a clinician's scope simply because the software is available. Competence to use a tool includes competence to question it.</p>
<p>The most important boundary in the entire field is that the therapeutic relationship is not automatable. The working alliance, the experience of being genuinely understood by another person, the attuned response to nonverbal distress, the ethical presence of a clinician who bears responsibility for the client, these are the active ingredients that decades of psychotherapy research identify as central to outcome, and they are constituted by human relationship. A conversational agent can deliver structured content and can, for some people and some problems, provide real benefit, but it cannot be a person, cannot hold fiduciary responsibility, and cannot bear the moral weight of care. Conflating engagement with a chatbot and a therapeutic relationship is a category error with safety consequences, most acutely at moments of crisis, when a human clinician's judgment and duty are irreplaceable.</p>
<p>This is also where professional identity is most directly engaged. The counselor's identity rests on relationship, accountability, and ethical commitment to client welfare. Technology that supports those commitments strengthens professional identity; technology used to displace them erodes it. Responsible adoption therefore begins with a clear view of what must remain human and proceeds to ask only then where a tool might help.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>The Ethical and Regulatory Frame</h2>
<p>Three layers of obligation govern artificial-intelligence use in clinical practice. The first is <strong>privacy and security under HIPAA</strong>. Any tool that touches protected health information, including ambient scribes that record sessions, cloud-based documentation tools, and conversational systems integrated with records, must be handled under HIPAA. This typically requires a Business Associate Agreement with the vendor, attention to where and how data are stored and whether they are used to train the vendor's models, and informed client consent appropriate to the tool's data practices. A free consumer tool that processes session content without a Business Associate Agreement may place a clinician in violation regardless of how useful it is.</p>
<p>The second layer is <strong>professional ethics</strong>. The American Counseling Association Code of Ethics and the National Board for Certified Counselors require competence, informed consent, confidentiality, and avoidance of harm, and these obligations apply to technology-mediated practice without exception. Informed consent, in particular, extends to disclosing the use of artificial-intelligence tools that materially affect the client's care or data. The American Psychological Association and allied bodies have similarly emphasized that emerging technologies do not create an ethics-free zone; existing principles govern, and the burden is on the clinician to apply them.</p>
<p>The third layer is <strong>regulatory oversight</strong>, principally the United States Food and Drug Administration's framework for software as a medical device. Some clinical artificial-intelligence tools, particularly certain decision-support and diagnostic systems, meet the definition of a regulated medical device and require clearance; many wellness and administrative tools do not. The regulatory status of a product is a material fact a clinician should ascertain, because it signals the level of pre-market scrutiny the tool has received. The World Health Organization (2021) articulated complementary ethical principles, including human oversight, transparency, accountability, equity, and responsiveness, that provide a useful checklist even where binding regulation is absent.</p>
<h3>Questions to Ask Before Adopting Any Tool</h3>
<p>Before adopting a tool, a clinician should be able to answer: What clinical or administrative task does it perform, and which category does it belong to? What independent peer-reviewed evidence supports its use for my population? How does it handle protected health information, and is a Business Associate Agreement in place? Who is accountable when it errs, and can I override it? What does informed consent require me to disclose to clients? And does its regulatory status match the clinical weight I am placing on it? A tool that cannot survive these questions should not survive into the clinical workflow.</p>`,
        },
        {
          type: 'text', order: 4.5,
          content: `<h2>Informed Consent and Documentation in an Artificial-Intelligence-Assisted Practice</h2>
<p>Two practical obligations deserve their own treatment because they are where responsible adoption most often breaks down in day-to-day work: informed consent and documentation integrity. Informed consent in technology-mediated practice extends beyond the standard disclosures about confidentiality limits and treatment risks. When an artificial-intelligence tool materially affects a client's care or handles their protected health information, clients have a reasonable interest in knowing. A client may reasonably want to know that their session is being recorded and transcribed by an ambient scribe, that their data may be processed by a third-party vendor, and that a recommendation in their care was informed by a predictive algorithm. The appropriate depth of disclosure scales with the tool's clinical weight and its data practices: an administrative scheduling tool requires little, while a recording scribe or a recommendation-shaping decision-support tool requires meaningful, understandable disclosure and a genuine opportunity to decline. Consent that is buried in a dense intake packet, or that offers no real alternative, is consent in name only.</p>
<p>Documentation integrity is the second obligation, and it follows directly from the clinician's status as author of record. When a generative tool drafts a note, the clinician who signs it adopts every word as their own professional statement. This has several implications. The clinician must read the entire draft against their own memory of the session, must correct any fabrication, omission, or distortion, and should be cautious about the polished narrative voice these tools produce, which can lend false confidence to inaccurate content. Some clinicians and organizations choose to document, in policy if not in each note, that artificial-intelligence assistance was used in drafting, which supports transparency and accountability. What a clinician must never do is treat the tool's output as a finished record requiring only a signature. The signature is an attestation of accuracy, and attesting to the accuracy of content one has not verified is both an ethical and a legal hazard.</p>
<p>These obligations connect to professional identity in a direct way. Informed consent honors client autonomy; documentation integrity honors the clinician's accountability; both honor the fiduciary relationship that distinguishes a profession from a service industry. Tools that are configured and used in ways that support these obligations strengthen practice. Tools that pressure clinicians to skip disclosure or to sign unverified content erode the very commitments that define competent, ethical care. The clinician's task is to bend the tool to these obligations, never to bend the obligations to the tool.</p>`,
        },
        {
          type: 'callout', order: 5, calloutType: 'ethics', title: 'HIPAA, Consent, and the Business Associate Agreement',
          content: '<p>If a tool processes protected health information, a Business Associate Agreement with the vendor is typically required, and the clinician must understand whether session data are stored, shared, or used to train the vendor\'s models. Informed consent should disclose the use of artificial-intelligence tools that materially affect a client\'s care or data. Convenience never overrides these obligations; a tool\'s usefulness does not exempt it from HIPAA, the applicable code of ethics, or the clinician\'s duty of confidentiality.</p>',
        },
        {
          type: 'accordion', order: 6, title: 'The Three Layers of Obligation',
          accordionItems: [
            { title: 'Privacy and security (HIPAA)', content: '<p>Tools touching protected health information require HIPAA-compliant handling, typically a Business Associate Agreement, clarity on data storage and model-training use, and appropriate informed consent. Free consumer tools processing session content without a BAA can create violations.</p>' },
            { title: 'Professional ethics (ACA, NBCC, APA)', content: '<p>Competence, informed consent, confidentiality, and non-maleficence apply fully to technology-mediated practice. Informed consent extends to disclosing artificial-intelligence use that materially affects care or data. Emerging technology is not an ethics-free zone.</p>' },
            { title: 'Regulatory oversight (FDA)', content: '<p>Some decision-support and diagnostic tools meet the definition of software as a medical device and require clearance; many wellness and administrative tools do not. A product\'s regulatory status signals its level of pre-market scrutiny and is a material fact to verify.</p>' },
            { title: 'Human oversight (WHO principles)', content: '<p>The World Health Organization\'s 2021 guidance emphasizes human oversight, transparency, accountability, equity, and responsiveness. These principles offer a practical checklist even where binding regulation is absent or still developing.</p>' },
          ],
        },
        {
          type: 'text', order: 6.5,
          content: `<h2>Building an Adoption Workflow Your Practice Can Sustain</h2>
<p>Responsible adoption becomes durable only when it is built into a repeatable process rather than improvised tool by tool. A practical workflow has three phases: evaluation before adoption, governance during use, and review over time. In the <strong>evaluation phase</strong>, the clinician or organization applies the pre-adoption questions systematically: identify the tool's category and the clinical task it touches; locate independent, peer-reviewed evidence for its use in a comparable population; determine how it handles protected health information and whether a Business Associate Agreement is in place; clarify who is accountable when it errs and whether the clinician can meaningfully override it; specify what informed consent requires; and verify its regulatory status against the clinical weight being placed on it. A tool that cannot answer these questions should not advance to use. Documenting this evaluation, even briefly, creates an accountability trail and forces the implicit assumptions of an adoption decision into the open.</p>
<p>In the <strong>governance phase</strong>, the tool is configured and used so that human oversight is genuine rather than nominal. Workflows should give clinicians the time and information to review outputs, not pressure them to rubber-stamp. Generated documentation should be reviewed in full before signing. Predictive outputs should be treated as hypotheses that prompt assessment, not verdicts that replace it. Consent processes should reflect the tool's actual data practices. Where feasible, the organization should monitor the tool's performance, including across the subgroups it serves, to catch bias and drift. Clear lines of accountability, written down rather than assumed, ensure that when something goes wrong, responsibility is locatable and remediation is possible.</p>
<p>In the <strong>review phase</strong>, adopted tools are periodically reassessed rather than treated as permanent fixtures. Because models drift, vendors update, evidence accumulates, and regulations change, a scheduled re-evaluation keeps the workflow honest and current. A tool that has degraded, that has been superseded by stronger evidence elsewhere, or that no longer fits the population should be adjusted or retired. This three-phase workflow scales from a solo practitioner's informal checklist to a large organization's formal technology-governance committee, and its underlying logic is the same at every scale: the clinician, not the vendor, governs the tool, and governance is a continuing responsibility rather than a one-time decision. Embedding this process protects clients, supports compliance, and preserves the professional judgment and relationship that define competent care.</p>`,
        },
        {
          type: 'scenarioTree', order: 7,
          scenarioTitle: 'A New Documentation Tool Arrives',
          instructions: 'Your agency offers a free, popular AI documentation app that records sessions and drafts notes. Work through the decision.',
          startNode: 'start',
          nodes: {
            start: { text: 'The app is convenient and colleagues love it. It records the session audio to draft your note. What is your first step before using it with clients?', choices: [{ text: 'Start using it immediately because colleagues recommend it', nextId: 'rush' }, { text: 'Verify HIPAA handling and whether a Business Associate Agreement is in place', nextId: 'baa' }] },
            rush: { text: 'Adopting a tool that processes protected health information without verifying HIPAA compliance can create a violation regardless of its usefulness or popularity. Return and address compliance first.', isEnd: true },
            baa: { text: 'Good. You learn there is no Business Associate Agreement and the vendor may use audio to train its models. What now?', choices: [{ text: 'Use it anyway since the notes are high quality', nextId: 'rush' }, { text: 'Decline until a BAA and data terms are in place, and ensure informed consent would cover the tool', nextId: 'good' }] },
            good: { text: 'Correct. You protected confidentiality, honored HIPAA, and preserved informed consent. If a compliant version becomes available, you would still review every drafted note in full before signing, keeping yourself genuinely in the loop.', isEnd: true },
          },
        },
        {
          type: 'multipleChoice', order: 8,
          question: 'The human-in-the-loop principle is genuinely preserved only when:',
          options: [
            { text: 'A clinician\'s name appears on the output, regardless of whether they had time to evaluate it', isCorrect: false },
            { text: 'The clinician has the information, time, and practical authority to meaningfully review and override the tool\'s output', isCorrect: true },
            { text: 'The tool proceeds automatically unless the clinician actively intervenes', isCorrect: false },
            { text: 'The vendor assumes accountability for any clinical decision informed by the tool', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'A loop that pressures clinicians to rubber-stamp outputs removes the human in practice while preserving the appearance of oversight. Genuine human-in-the-loop requires the information, time, and authority to evaluate and override, and accountability remains with the clinician.',
        },
        {
          type: 'multiSelect', order: 9,
          question: 'Before adopting an artificial-intelligence tool that touches client care or data, a clinician should be able to answer which of the following? (Select all that apply)',
          options: [
            { text: 'What independent peer-reviewed evidence supports its use for my population', isCorrect: true },
            { text: 'How the tool handles protected health information and whether a Business Associate Agreement is in place', isCorrect: true },
            { text: 'Who is accountable when it errs and whether I can override it', isCorrect: true },
            { text: 'Whether the marketing describes it as advanced and popular among colleagues', isCorrect: false },
            { text: 'What informed consent requires me to disclose to clients about its use', isCorrect: true },
          ],
          explanation: 'Responsible adoption turns on evidence, privacy and HIPAA handling, accountability and override authority, and informed-consent obligations. Marketing language and colleague popularity are not adequate bases for a clinical adoption decision.',
        },
        {
          type: 'reflection', order: 10, question: 'Identify one artificial-intelligence tool you are using or considering. Walk it through the adoption questions: category, independent evidence, HIPAA handling and consent, accountability and override, and regulatory status. Where does the tool fall short, and what specifically would you require before relying on it with a client?' },
        {
          type: 'keyTakeaway', order: 11, title: 'Key Takeaways',
          takeaways: [
            'Human-in-the-loop means the clinician retains real information, time, and authority to review and override; a rubber-stamp workflow defeats it.',
            'Adopting a tool never expands scope of competence or transfers accountability to the vendor; competence to use a tool includes competence to question it.',
            'The therapeutic relationship is the irreplaceable, non-automatable core of care, most critically at moments of crisis.',
            'HIPAA, professional ethics, and FDA oversight form three layers of obligation that emerging technology does not suspend.',
            'A disciplined set of pre-adoption questions, covering category, evidence, privacy, accountability, consent, and regulatory status, should gate every tool.',
          ],
        },
      ],
    },
    {
      title: 'Course Summary, Resources, and Practice Commitments',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '5', title: 'Course Summary, Resources, and Practice Commitments', subtitle: 'Synthesis of the foundations, curated professional resources, and three behavioral commitments', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Synthesis: Literacy in Service of Client Welfare</h2>
<p>This course set out to give clinicians conceptual literacy rather than engineering training, and the through-line of every section has been the same: understanding artificial intelligence well enough to govern it in service of client welfare. Section 1 established the vocabulary, distinguishing artificial intelligence, machine learning, deep learning, neural networks, natural language processing, large language models, and generative artificial intelligence, and clarifying that every clinical tool is narrow, task-specific software that computes statistical patterns rather than a mind that understands. Section 2 mapped the landscape into six categories, from administrative automation at the periphery of clinical judgment to conversational agents, predictive analytics, and decision support at its center, and located current adoption honestly: mature where risk is contained, early where stakes are high.</p>
<p>Section 3 weighed genuine benefits in access, efficiency, and screening against intrinsic limitations, hallucination, algorithmic bias, validation gaps, the black-box problem, and automation bias, and established the single most valuable skill in the domain: distinguishing peer-reviewed evidence from marketing language, with uncertainty as the honest default when independent evidence is absent. Section 4 brought these threads together under responsible adoption, organized by the human-in-the-loop principle, anchored by scope of competence and the irreplaceable therapeutic relationship, and bounded by the three layers of obligation under HIPAA, professional ethics, and FDA oversight.</p>
<p>The unifying message is that artificial intelligence does not change what counseling is. The client is still a person, the relationship is still the active ingredient, and the clinician is still accountable for clinical judgment. What changes is that clinicians now share their workflow with tools that are powerful, fallible, and frequently oversold. Literacy is what allows a counselor to accept genuine help from these tools while refusing to surrender the judgment, relationship, and accountability that define the profession.</p>`,
        },
        {
          type: 'text', order: 2.3,
          content: `<h2>Common Misconceptions, Corrected</h2>
<p>A useful way to consolidate learning is to name the misconceptions this course is designed to dislodge, because each one, left uncorrected, leads to a predictable clinical error. The first misconception is that artificial intelligence "understands" clients. It does not. Even the most fluent large language model computes statistical patterns over text; it has no comprehension, no clinical judgment, and no stake in the client's welfare. The clinical error this misconception produces is over-delegation, in which a clinician hands a tool a judgment the tool cannot actually make and then trusts the result. The correction is to remember that fluency is a property of language production, not of understanding, and that the appearance of insight is not insight.</p>
<p>The second misconception is that "AI-powered" or "evidence-based" labels carry the weight of validation. They frequently do not. These phrases are marketing language unless backed by independent, peer-reviewed evidence of a clinical outcome in a relevant population. The clinical error this produces is premature adoption based on branding rather than data. The correction is the evidence-appraisal discipline established in Section 3: ask what outcome, studied by whom, in which population, with what comparison and effect size, and treat the absence of independent evidence as meaningful. The third misconception is that a chatbot conversation is a therapeutic relationship. It is not. Engagement is not alliance, and a conversational agent cannot hold fiduciary responsibility or bear the moral weight of care, most acutely in crisis. The clinical error here is the most dangerous of all, because it can place a vulnerable person in the care of a system with no capacity to recognize or respond to danger. The correction is to keep the therapeutic relationship firmly in the category of the irreplaceable.</p>
<p>The fourth misconception is that adopting a tool transfers accountability to its maker. It does not. A clinician remains responsible for every clinical judgment a tool informs, exactly as if no tool were involved. The error is moral hazard, the false comfort that "the algorithm decided." The correction is to internalize that competence to use a tool includes competence to question it, and that the signature, the note, and the decision belong to the clinician. The fifth and final misconception is that newer or larger automatically means better or safer. More parameters, more features, and a more recent release do not guarantee accuracy, equity, or appropriateness for a given client. The error is conflating scale with validity. The correction is to evaluate each tool against its evidence and its fit to your population, not against its specifications. Naming these five misconceptions, and the errors each produces, gives clinicians a compact mental checklist they can carry into every encounter with a new product.</p>`,
        },
        {
          type: 'text', order: 2.6,
          content: `<h2>Sustaining Literacy Over Time</h2>
<p>Artificial intelligence in behavioral health is a moving field, and the literacy this course provides is a foundation to be maintained, not a credential to be filed away. Several practices help clinicians keep their understanding current without becoming technologists. The first is to follow the guidance of professional and public bodies rather than vendor marketing. Organizations such as the American Psychological Association, the American Counseling Association, the National Board for Certified Counselors, the National Institute of Mental Health, the Substance Abuse and Mental Health Services Administration, the World Health Organization, the Office of the National Coordinator for Health Information Technology, and the Food and Drug Administration publish vendor-neutral guidance whose interests are aligned with client welfare and professional integrity rather than with sales. These sources, several of which are linked in this section's resources block, are the appropriate anchors for ongoing learning.</p>
<p>The second sustaining practice is to cultivate a habit of disciplined skepticism that is neither cynicism nor credulity. The skeptical clinician neither dismisses every tool as hype nor accepts every claim as fact; they ask for evidence proportional to the clinical stakes and adjust their trust accordingly. This is the same posture competent clinicians already bring to any new intervention, medication, or assessment instrument. The third practice is to use supervision and consultation as infrastructure for technology decisions, just as for any other complex clinical matter. A clinician uncertain whether a tool meets HIPAA requirements, whether its evidence is adequate, or whether its outputs can be safely relied upon should consult a supervisor, an ethics body, or an informatics colleague before adopting it. Seeking consultation is a marker of competence, not a deficit of it.</p>
<p>The fourth practice is to revisit adopted tools periodically rather than assuming permanence. Because models drift, vendors update, evidence accumulates, and regulations evolve, a tool that was appropriate a year ago may no longer be, and a tool that lacked evidence then may have earned it since. A brief, scheduled re-evaluation of the tools in one's workflow keeps adoption decisions honest. Taken together, these practices ensure that the conceptual literacy gained here continues to serve client welfare as the field changes. The destination is not mastery of a static body of facts but the durable capacity to ask good questions, demand real evidence, protect clients, and keep the human relationship and human judgment at the center of care no matter how the technology evolves.</p>`,
        },
        {
          type: 'accordion', order: 3, title: 'Course Highlights by Section',
          accordionItems: [
            { title: 'Section 1: What AI Actually Is', content: '<p>Artificial intelligence is an umbrella; machine learning, which learns patterns from data, dominates. Deep learning uses neural networks; natural language processing handles language; large language models generate statistically likely text. All clinical tools are narrow, and fluency is never proof of truth.</p>' },
            { title: 'Section 2: The Landscape', content: '<p>Six categories: documentation scribes, conversational agents, predictive analytics, clinical decision support, measurement-based-care analytics, and administrative automation. Benefits and risks differ by category; adoption is most mature where clinical risk is contained.</p>' },
            { title: 'Section 3: Benefits, Limits, Evidence Gap', content: '<p>Real benefits in access, efficiency, and screening sit beside intrinsic limits: hallucination, bias, validation gaps, the black-box problem, and automation bias. Marketing is not evidence; the standard evidence hierarchy applies, and absence of evidence is meaningful.</p>' },
            { title: 'Section 4: Responsible Adoption', content: '<p>Human-in-the-loop, scope of competence, and the irreplaceable relationship, bounded by HIPAA, professional ethics, and FDA oversight. A disciplined set of pre-adoption questions should gate every tool before it enters the clinical workflow.</p>' },
          ],
        },
        {
          type: 'callout', order: 4, calloutType: 'protocol', title: 'A Portable Five-Question Adoption Filter',
          content: '<ol><li><strong>Category and task:</strong> Which of the six categories is this, and what clinical or administrative task does it touch?</li><li><strong>Evidence:</strong> What independent, peer-reviewed evidence supports its use for my population, and is any absent?</li><li><strong>Privacy:</strong> How does it handle protected health information, is a Business Associate Agreement in place, and what must I disclose for informed consent?</li><li><strong>Accountability:</strong> Who is responsible when it errs, and can I meaningfully review and override its output?</li><li><strong>Regulatory status:</strong> Does its FDA status match the clinical weight I am placing on it?</li></ol>',
        },
        {
          type: 'text', order: 4.5,
          content: `<h2>The Clinician as Steward of Technology</h2>
<p>If a single image can capture the stance this course recommends, it is the clinician as steward rather than as either enthusiast or skeptic. A steward neither rejects useful tools out of fear nor adopts them out of fascination; a steward accepts responsibility for the appropriate, accountable, client-centered use of whatever tools enter the work. Stewardship reframes the clinician's relationship to technology from passive consumer to active governor. The passive consumer asks only "does this tool work for me?" The steward asks "is this tool safe, evidence-supported, compliant, and equitable for the people I serve, and am I prepared to oversee it?" That shift in question is the practical essence of literacy.</p>
<p>Stewardship also clarifies where the clinician's irreplaceable value lies. As routine documentation, screening, and administrative tasks become increasingly automatable, the distinctly human contributions of the clinician become more, not less, important. The capacity to form a genuine therapeutic relationship, to read and respond to nonverbal distress, to exercise judgment under uncertainty, to bear fiduciary responsibility, and to make ethical decisions in the gray areas no algorithm can resolve, these are the heart of the profession and the part no tool can assume. Topol's (2019) vision of technology returning time and attention to the human relationship is realized only when clinicians use the time that tools free up to deepen exactly these human contributions rather than to see more clients faster.</p>
<p>Finally, stewardship is a collective as well as an individual responsibility. Individual clinicians applying good judgment within poorly governed organizations can only do so much; the broader work of demanding representative validation data, transparent algorithms, equitable performance, and genuine human oversight is shared across the profession, its credentialing bodies, its institutions, and its regulators. Every counselor who asks a vendor a hard question, who declines a non-compliant tool, who discloses artificial-intelligence use honestly to clients, and who advocates for better governance contributes to a field in which these tools serve clients rather than the reverse. That is the ultimate aim of this course: not to make counselors into technologists, but to equip them to remain the accountable, relational, ethical center of care as the technology around them continues to change.</p>`,
        },
        {
          type: 'matching', order: 5,
          matchingInstructions: 'Match each course concept to its one-line clinical meaning for quick review.',
          matchingPairs: [
            { term: 'Hallucination', definition: 'Fluent but fabricated output that must be caught by full human review before it enters the record' },
            { term: 'Automation bias', definition: 'Clinician-side over-trust of automated outputs, managed by workflow and culture rather than engineered away' },
            { term: 'Human-in-the-loop', definition: 'The clinician retains genuine information, time, and authority to review and override every consequential output' },
            { term: 'Scope of competence', definition: 'Using a tool requires the competence to question it; accountability never transfers to the vendor' },
          ],
        },
        {
          type: 'resources', order: 6, title: 'Further Learning & Professional Resources',
          resources: [
            { title: 'American Psychological Association — Technology and Artificial Intelligence', url: 'https://www.apa.org/practice/artificial-intelligence', type: 'link', description: 'APA guidance and resources on the ethical use of technology and artificial intelligence in psychological practice.' },
            { title: 'American Counseling Association — Code of Ethics', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf', type: 'link', description: 'The ACA Code of Ethics, including standards on competence, informed consent, confidentiality, and technology-assisted services.' },
            { title: 'National Board for Certified Counselors (NBCC)', url: 'https://www.nbcc.org/', type: 'link', description: 'The NBCC, the credentialing and standards body whose ethical requirements govern certified counselors\' use of technology.' },
            { title: 'SAMHSA — Substance Abuse and Mental Health Services Administration', url: 'https://www.samhsa.gov/', type: 'link', description: 'Federal resources on behavioral health practice, including guidance relevant to technology-assisted and digital interventions.' },
            { title: 'National Institute of Mental Health (NIMH) — Technology and the Future of Mental Health Treatment', url: 'https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment', type: 'link', description: 'NIMH overview of digital and technology-based approaches to mental health treatment and their evidence base.' },
            { title: 'World Health Organization — Ethics and Governance of Artificial Intelligence for Health', url: 'https://www.who.int/publications/i/item/9789240029200', type: 'link', description: 'The WHO\'s 2021 guidance articulating core ethical principles, including human oversight, transparency, accountability, and equity.' },
            { title: 'ONC / HealthIT.gov — Health IT and Predictive Decision Support', url: 'https://www.healthit.gov/', type: 'link', description: 'Office of the National Coordinator resources on health information technology, transparency, and predictive decision-support algorithms.' },
            { title: 'U.S. FDA — Artificial Intelligence and Machine Learning in Software as a Medical Device', url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device', type: 'link', description: 'FDA framework describing when artificial-intelligence software qualifies as a regulated medical device requiring clearance.' },
          ],
        },
        {
          type: 'text', order: 7,
          content: `<h2>Putting Literacy Into Practice</h2>
<p>Knowledge that does not change behavior has limited value in continuing education. The counselor who completes this course with new vocabulary has begun the work; the counselor who leaves with specific, behavioral commitments is doing it. The three commitments below are designed to translate the course's conceptual content into concrete, accountable action within your own practice, on a realistic timeline, and in a form you can verify completion of. Treat them as you would treat a treatment plan: specific, measurable, and tied to a date.</p>
<h3>Three Behavioral Commitments</h3>
<ol>
<li><strong>Audit one tool.</strong> Within 30 days, select one artificial-intelligence tool already present in your practice or being marketed to your agency and run it through the five-question adoption filter, documenting in writing its category, the independent evidence for it, its HIPAA handling and Business Associate Agreement status, its accountability and override design, and its regulatory status.</li>
<li><strong>Verify before you trust.</strong> Beginning with your next use of any generative documentation or content tool, commit to reading every artificial-intelligence-drafted note or output in full against your own memory of the session before signing or relying on it, and never sign an unreviewed generated note.</li>
<li><strong>Disclose and consult.</strong> Within 60 days, review your informed-consent process and, where an artificial-intelligence tool materially affects client care or data, add appropriate disclosure; if you are uncertain about a tool's compliance or evidence, consult a supervisor, your ethics body, or an informatics colleague before adopting it.</li>
</ol>`,
        },
        {
          type: 'keyTakeaway', order: 8, title: 'Key Takeaways',
          takeaways: [
            'Artificial intelligence does not change what counseling is: the client is a person, the relationship is the active ingredient, and the clinician remains accountable.',
            'Conceptual literacy lets clinicians accept genuine help from tools while refusing to surrender judgment, relationship, and accountability.',
            'A portable five-question filter, covering category, evidence, privacy, accountability, and regulatory status, can gate any tool.',
            'The curated resources from APA, ACA, NBCC, SAMHSA, NIMH, WHO, ONC, and FDA support continued, vendor-neutral learning.',
            'Three behavioral commitments translate literacy into action: audit one tool, verify before you trust, and disclose and consult.',
          ],
        },
        {
          type: 'reflection', order: 9, question: 'Write your three specific commitments for the next 60 days. Make each one behavioral and verifiable: exactly what will you do, with which tool or process, by what date, and how will you know you have completed it? Identify one colleague, supervisor, or peer with whom you will share these commitments for accountability.' },
      ],
    },
  ],

  assessment: {
    passingScore: 80, passThreshold: 0.8, maxAttempts: 3,
    questions: [
      { question: 'Which statement best describes the relationship among the core terms?', options: [{ text: 'Machine learning is broader than artificial intelligence, which is a subset of deep learning', isCorrect: false }, { text: 'Artificial intelligence is the umbrella; machine learning is a major branch; deep learning is a subset of machine learning using neural networks', isCorrect: true }, { text: 'Deep learning and artificial intelligence are identical and unrelated to machine learning', isCorrect: false }, { text: 'Natural language processing is broader than artificial intelligence', isCorrect: false }], correctAnswer: 1, explanation: 'Artificial intelligence is the broad umbrella, machine learning is its dominant branch, and deep learning is a subset of machine learning that uses multi-layered neural networks. Natural language processing applies these methods to human language.' },
      { question: 'Supervised learning differs from unsupervised learning in that supervised learning:', options: [{ text: 'Requires no data and relies on hand-coded rules', isCorrect: false }, { text: 'Trains on human-labeled examples to predict labels for new cases, making it only as good as its labels', isCorrect: true }, { text: 'Always outperforms unsupervised learning in every clinical task', isCorrect: false }, { text: 'Discovers clusters in data without any human labels', isCorrect: false }], correctAnswer: 1, explanation: 'Supervised learning trains on human-labeled examples and predicts labels for new cases; its quality depends on the quality and representativeness of those labels. Unsupervised learning finds structure in unlabeled data.' },
      { question: 'A large language model produces fluent, confident text. The clinically accurate interpretation of that fluency is that it:', options: [{ text: 'Guarantees the content is factually accurate', isCorrect: false }, { text: 'Reflects statistically likely language, which is not the same as verified truth', isCorrect: true }, { text: 'Demonstrates conscious understanding of the client', isCorrect: false }, { text: 'Eliminates the need for clinician review', isCorrect: false }], correctAnswer: 1, explanation: 'Large language models predict statistically likely text. Fluency and confidence reflect probability, not accuracy. Confident, well-formatted output can be confidently wrong, which is why review is essential.' },
      { question: 'Which behavioral-health tool category currently shows the MOST mature adoption?', options: [{ text: 'Autonomous predictive suicide-risk models in small private practices', isCorrect: false }, { text: 'Administrative automation and documentation, where value is clear and clinical risk is contained', isCorrect: true }, { text: 'Chatbots proven equivalent to licensed psychotherapy', isCorrect: false }, { text: 'Fully validated diagnostic decision support replacing clinician judgment', isCorrect: false }], correctAnswer: 1, explanation: 'Adoption is most mature in administrative automation and documentation. Predictive analytics and decision support remain comparatively early and concentrated in large systems with informatics infrastructure.' },
      { question: 'A predictive risk model flags a client as high risk. The appropriate clinical response is to treat the flag as:', options: [{ text: 'A definitive verdict that determines the level of care', isCorrect: false }, { text: 'A hypothesis that prompts, but does not replace, independent clinical assessment', isCorrect: true }, { text: 'Clearance to forgo direct assessment of the client', isCorrect: false }, { text: 'Proof that the model is unbiased for this population', isCorrect: false }], correctAnswer: 1, explanation: 'A risk flag is a hypothesis for the clinician to evaluate, never a verdict. The clinician must independently assess and document reasoning, and the absence of a flag does not remove the duty to assess.' },
      { question: 'Hallucination in a generative documentation tool is dangerous primarily because:', options: [{ text: 'It produces obviously garbled text that is easy to detect', isCorrect: false }, { text: 'It produces fluent, plausible, fabricated content that can enter the permanent clinical record if unreviewed', isCorrect: true }, { text: 'It only affects administrative tasks with no clinical consequences', isCorrect: false }, { text: 'It improves the accuracy of clinical notes', isCorrect: false }], correctAnswer: 1, explanation: 'Hallucinated content is coherent and plausible, making it dangerous precisely when a clinician is rushed or trusting. An unreviewed hallucinated note becomes a permanent, legally consequential error.' },
      { question: 'Obermeyer et al. (2019) demonstrated that a widely used health-care risk algorithm was biased because it:', options: [{ text: 'Used too few parameters to be accurate', isCorrect: false }, { text: 'Used health-care cost as a proxy for health-care need, and cost reflected unequal access rather than equal illness', isCorrect: true }, { text: 'Was trained only on synthetic data', isCorrect: false }, { text: 'Lacked any peer review or publication', isCorrect: false }], correctAnswer: 1, explanation: 'The algorithm used cost as a proxy for need; because cost reflected unequal access, the model underestimated the needs of Black patients. A model can be accurate on its own terms yet produce inequitable, harmful results.' },
      { question: 'The "black-box problem" in clinical artificial intelligence refers to:', options: [{ text: 'The physical enclosure housing the server hardware', isCorrect: false }, { text: 'The inability of many deep-learning systems to explain their outputs in clinician-auditable terms', isCorrect: true }, { text: 'A tool that operates without electricity', isCorrect: false }, { text: 'A guarantee that the system is fully transparent', isCorrect: false }], correctAnswer: 1, explanation: 'Many deep-learning systems cannot explain why they produced a given output in terms a clinician can scrutinize, making it hard to know when to trust a result and impossible to fully audit a decision afterward.' },
      { question: 'Automation bias is best understood as:', options: [{ text: 'A flaw in the software that the vendor can patch', isCorrect: false }, { text: 'The human tendency to over-trust automated outputs even against one\'s own better judgment', isCorrect: true }, { text: 'The system\'s preference for one demographic group', isCorrect: false }, { text: 'A benefit that improves clinical decision-making', isCorrect: false }], correctAnswer: 1, explanation: 'Automation bias is a clinician-side failure mode: over-deferring to automated outputs even when judgment should prompt doubt. It is managed through training, workflow, and culture, not eliminated by the vendor.' },
      { question: 'When evaluating a vendor\'s claim that a tool is "clinically validated," a clinician should treat user-engagement metrics as:', options: [{ text: 'Equivalent to a randomized controlled trial', isCorrect: false }, { text: 'Not a clinical outcome and therefore weak evidence of clinical benefit', isCorrect: true }, { text: 'The top of the evidence hierarchy', isCorrect: false }, { text: 'Sufficient proof to adopt the tool', isCorrect: false }], correctAnswer: 1, explanation: 'Engagement and satisfaction are not clinical outcomes. The standard evidence hierarchy applies; independent peer-reviewed efficacy data sit at the top, and marketing language and engagement metrics sit near the bottom.' },
      { question: 'Genuine human-in-the-loop oversight requires that the clinician:', options: [{ text: 'Simply have their name appear on the output', isCorrect: false }, { text: 'Have the information, time, and practical authority to meaningfully review and override the tool\'s output', isCorrect: true }, { text: 'Allow the tool to proceed automatically unless actively stopped', isCorrect: false }, { text: 'Transfer accountability for the decision to the vendor', isCorrect: false }], correctAnswer: 1, explanation: 'A workflow that pressures clinicians to rubber-stamp outputs removes the human in practice. Genuine oversight requires real information, time, and override authority, and accountability remains with the clinician.' },
      { question: 'Adopting an artificial-intelligence tool affects a clinician\'s scope of competence by:', options: [{ text: 'Automatically expanding their scope to include the tool\'s function', isCorrect: false }, { text: 'Not expanding it; using a tool responsibly requires the competence to evaluate and question it', isCorrect: true }, { text: 'Transferring accountability for clinical judgments to the vendor', isCorrect: false }, { text: 'Removing the need to understand how the tool works', isCorrect: false }], correctAnswer: 1, explanation: 'A tool does not expand scope or transfer accountability. A clinician should not deploy a tool whose outputs they cannot meaningfully evaluate; competence to use includes competence to question.' },
      { question: 'Why is the therapeutic relationship described as non-automatable?', options: [{ text: 'Because chatbots are too slow to converse in real time', isCorrect: false }, { text: 'Because the alliance, attuned human presence, and fiduciary responsibility central to outcome are constituted by human relationship', isCorrect: true }, { text: 'Because regulations forbid any technology in therapy', isCorrect: false }, { text: 'Because conversational agents provide no benefit to anyone', isCorrect: false }], correctAnswer: 1, explanation: 'Decades of research identify the working alliance and attuned human presence as central to outcome. A conversational agent can deliver structured content but cannot be a person, hold fiduciary responsibility, or bear the moral weight of care, especially in crisis.' },
      { question: 'Under HIPAA, a free consumer documentation app that records sessions and processes protected health information:', options: [{ text: 'Is exempt from HIPAA because it is free', isCorrect: false }, { text: 'Generally requires a Business Associate Agreement and attention to data storage and model-training use before clinical use', isCorrect: true }, { text: 'May be used freely as long as the notes are high quality', isCorrect: false }, { text: 'Eliminates the need for informed consent', isCorrect: false }], correctAnswer: 1, explanation: 'Tools touching protected health information typically require a Business Associate Agreement and clarity on data handling, including whether data are used to train the vendor\'s models. Usefulness does not exempt a tool from HIPAA or informed-consent obligations.' },
      { question: 'Regarding FDA oversight of clinical artificial-intelligence tools, which statement is accurate?', options: [{ text: 'All artificial-intelligence tools are regulated identically as medical devices', isCorrect: false }, { text: 'Some decision-support and diagnostic tools meet the software-as-a-medical-device definition and require clearance, while many wellness and administrative tools do not', isCorrect: true }, { text: 'No artificial-intelligence tool is ever subject to FDA regulation', isCorrect: false }, { text: 'Regulatory status is irrelevant to clinical adoption decisions', isCorrect: false }], correctAnswer: 1, explanation: 'Some clinical tools qualify as software as a medical device and require FDA clearance; many wellness and administrative tools do not. A product\'s regulatory status signals its level of pre-market scrutiny and is a material fact to verify.' },
      { question: 'The World Health Organization\'s 2021 guidance on artificial intelligence for health emphasizes core principles including:', options: [{ text: 'Maximizing engagement metrics above all else', isCorrect: false }, { text: 'Human oversight, transparency, accountability, and equity', isCorrect: true }, { text: 'Eliminating clinician involvement to reduce costs', isCorrect: false }, { text: 'Deploying tools fastest in low-resource settings regardless of validation', isCorrect: false }], correctAnswer: 1, explanation: 'WHO 2021 guidance articulates principles including human oversight, transparency, accountability, equity, and responsiveness, providing a practical ethical checklist even where binding regulation is absent.' },
      { question: 'Which of the following is the single most valuable skill for a clinician evaluating an artificial-intelligence product?', options: [{ text: 'Memorizing the number of parameters in the underlying model', isCorrect: false }, { text: 'Distinguishing peer-reviewed evidence of clinical benefit from unsubstantiated marketing claims', isCorrect: true }, { text: 'Identifying the programming language used to build the tool', isCorrect: false }, { text: 'Counting the number of features the tool advertises', isCorrect: false }], correctAnswer: 1, explanation: 'The most valuable skill is separating peer-reviewed evidence from marketing language. Parameter counts and feature lists are not evidence of clinical benefit, and absence of independent evidence should be treated as meaningful.' },
      { question: 'A counselor considering a new conversational agent for clients should recognize that engagement with a chatbot and a therapeutic relationship are:', options: [{ text: 'Interchangeable, so the chatbot can replace the clinician', isCorrect: false }, { text: 'Distinct; conflating them is a category error with safety consequences, most acutely in crisis', isCorrect: true }, { text: 'Identical in every clinically meaningful respect', isCorrect: false }, { text: 'Unrelated to client safety in any situation', isCorrect: false }], correctAnswer: 1, explanation: 'Conversational engagement is not a therapeutic relationship. Treating them as equivalent is a category error with real safety consequences, especially at moments of crisis when human clinical judgment and duty are irreplaceable.' },
    ],
  },

  references: [
    'Topol, E. (2019). Deep medicine: How artificial intelligence can make healthcare human again. Basic Books.',
    'Lee, P., Goldberg, C., & Kohane, I. (2023). The AI revolution in medicine: GPT-4 and beyond. Pearson.',
    'Torous, J., Bucci, S., Bell, I. H., Kessing, L. V., Faurholt-Jepsen, M., Whelan, P., Carvalho, A. F., & Firth, J. (2021). The growing field of digital psychiatry: Current evidence and the future of apps, social media, chatbots, and artificial intelligence. World Psychiatry, 20(3), 318–335.',
    'D\'Alfonso, S. (2020). AI in mental health. Current Opinion in Psychology, 36, 112–117.',
    'Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. Science, 366(6464), 447–453.',
    'World Health Organization. (2021). Ethics and governance of artificial intelligence for health: WHO guidance. World Health Organization.',
    'Fiske, A., Henningsen, P., & Buyx, A. (2019). Your robot therapist will see you now: Ethical implications of embodied artificial intelligence in psychiatry, psychology, and psychotherapy. Journal of Medical Internet Research, 21(5), e13216.',
    'Luxton, D. D. (2014). Artificial intelligence in psychological practice: Current and future applications and implications. Professional Psychology: Research and Practice, 45(5), 332–339.',
    'Graham, S., Depp, C., Lee, E. E., Nebeker, C., Tu, X., Kim, H. C., & Jeste, D. V. (2019). Artificial intelligence for mental health and mental illnesses: An overview. Current Psychiatry Reports, 21(11), 116.',
    'Rajkomar, A., Dean, J., & Kohane, I. (2019). Machine learning in medicine. New England Journal of Medicine, 380(14), 1347–1358.',
    'Char, D. S., Shah, N. H., & Magnus, D. (2018). Implementing machine learning in health care: Addressing ethical challenges. New England Journal of Medicine, 378(11), 981–983.',
    'American Psychological Association. (2017). Ethical principles of psychologists and code of conduct (2002, amended effective June 1, 2010, and January 1, 2017). American Psychological Association.',
    'American Counseling Association. (2014). ACA code of ethics. American Counseling Association.',
    'U.S. Food and Drug Administration. (2021). Artificial intelligence/machine learning (AI/ML)-based software as a medical device (SaMD) action plan. U.S. Food and Drug Administration.',
    'Office of the National Coordinator for Health Information Technology. (2024). Health data, technology, and interoperability: Certification program updates, algorithm transparency, and information sharing (HTI-1 final rule). U.S. Department of Health and Human Services.',
    'Shatte, A. B. R., Hutchinson, D. M., & Teague, S. J. (2019). Machine learning in mental health: A scoping review of methods and applications. Psychological Medicine, 49(9), 1426–1448.',
  ],

  resources: [
    { title: 'WHO — Ethics and Governance of Artificial Intelligence for Health (2021)', url: 'https://www.who.int/publications/i/item/9789240029200', type: 'pdf', description: 'Core ethical principles for AI in health, including human oversight, transparency, accountability, and equity.' },
    { title: 'NIMH — Technology and the Future of Mental Health Treatment', url: 'https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment', type: 'link', description: 'Federal overview of digital and technology-based mental health approaches and their evidence base.' },
    { title: 'FDA — AI/ML in Software as a Medical Device', url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device', type: 'link', description: 'FDA framework for when artificial-intelligence software is regulated as a medical device.' },
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
