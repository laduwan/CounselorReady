// seedCR-PFM-101-Public_Figures_Carrie_Fisher.js
// Public Figures & Mental Health series — Course 1: Carrie Fisher
// GAITP LLC · NBCC ACEP #7760
//
// SOURCING STANDARD (see also the Sep 25 live course, "Case Studies of the Rich
// and Famous," which teaches this standard directly): every clinical-biography
// claim about Carrie Fisher in this course is drawn from her own published
// statements — her memoirs (Wishful Drinking, 2008; Shockaholic, 2011; The
// Princess Diarist, 2016), her HBO documentary/stage adaptation of Wishful
// Drinking, and interviews she gave on the record (Diane Sawyer/PrimeTime via
// People magazine; Oprah, 2011). No diagnosis, formulation, or clinical opinion
// is offered ABOUT her — only her own account, used to teach diagnostic
// criteria and treatment concepts SHE herself named in public. She died in
// December 2016; nothing in this course concerns the circumstances of her
// death, which are outside the self-disclosure standard and irrelevant to the
// clinical content taught here.
//
// Target collection: interactivecourses. Draft only — status 'draft',
// isPublished false. Run: node src/scripts/seedCR-PFM-101-Public_Figures_Carrie_Fisher.js
// Audit first: node src/scripts/auditCourse.js --file <this file>

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const COURSE = {
  title: 'Public Figures & Mental Health: Carrie Fisher',
  slug: 'public-figures-mental-health-carrie-fisher',
  courseCode: 'CR-PFM-101',
  headerSubtitle: 'Bipolar Disorder, Electroconvulsive Therapy, and a Public Life Lived on Purpose',
  description: "This continuing education course uses Carrie Fisher's verified public self-disclosures — from her memoirs, her HBO documentary, and her on-the-record interviews — as a clinical teaching anchor for bipolar disorder, electroconvulsive therapy, and stigma reduction. All biographical content is sourced exclusively from her own public statements; no clinical speculation is offered. Learners earn 1.5 CE hours upon successful completion of all content and the post-assessment.",

  ceHours: 1.5, ceuHours: 1.5, credits: 1.5,
  level: 'Intermediate',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  categories: ['Clinical Practice'],
  nbccContentAreas: ['Counseling Theory/Practice', 'Professional Identity', 'Social and Cultural Foundations'],
  tags: ['bipolar disorder', 'electroconvulsive therapy', 'stigma', 'self-disclosure', 'ethics', 'public figures'],

  accessType: 'purchase', price: 24.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },

  objectives: [
    "Describe the documented barriers to disclosure and treatment-seeking for bipolar disorder, and identify the factors that shaped Carrie Fisher's own account of her diagnosis.",
    'Differentiate bipolar disorder from other mood presentations in assessment, applying DSM-5-TR criteria to distinguish manic, hypomanic, and major depressive episodes.',
    'Evaluate electroconvulsive therapy as an evidence-based intervention for treatment-resistant depression, including its indications, modern safety profile, and common patient concerns.',
    "Apply stigma-reduction and psychoeducation strategies drawn from Fisher's public disclosure model to clinical practice with newly diagnosed clients.",
    "Apply the Goldwater Rule and its counseling analogues (ACA C.6.c, E.5.d) when discussing a public figure's disclosed mental health history, distinguishing permissible clinical teaching from prohibited diagnostic speculation.",
  ],
  targetAudience: [
    'Licensed Professional Counselors (LPCs), Licensed Mental Health Counselors (LMHCs), Licensed Clinical Professional Counselors (LCPCs), Marriage and Family Therapists (MFTs), Licensed Clinical Social Workers (LCSWs), psychologists, and graduate-level counselors-in-training under supervision.',
  ],

  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
  },

  sections: [
    // ══════════════════════════════════════════════════════════════════
    // SECTION 1 — INTRODUCTION & CLINICAL FRAMEWORK
    // ══════════════════════════════════════════════════════════════════
    {
      title: 'Introduction & Clinical Framework',
      order: 1,
      description: 'Why a life made public on purpose is different clinical and ethical territory than a life made public by accident.',
      estimatedTime: 14,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '1',
          title: 'Introduction & Clinical Framework',
          subtitle: 'Why a life made public on purpose is different territory than a life made public by accident' },

        { type: 'text', order: 2, content: `<h2>The Client Who Brings Up the Book</h2>
<p>A client sits across from you three sessions into treatment, newly stabilized after a first manic episode, still frightened of the word <em>bipolar</em> as though it were a life sentence rather than a diagnosis. She mentions, almost as an aside, that her mother left a copy of <em>Wishful Drinking</em> on her nightstand. "I read the whole thing in one night," she says. "She talked about being in a mental hospital like it was — I don't know — survivable. Funny, even. I didn't know you were allowed to say it like that."</p>
<p>This moment happens in therapy rooms more often than clinicians are trained to expect, and it happens because Carrie Fisher spent the last three decades of her life doing something unusual: she disclosed a serious psychiatric diagnosis, repeatedly, in her own words, on her own terms, for a stated public purpose. She was not caught disclosing. She was not forced into it by a leak, a lawsuit, or a tabloid. She wrote a memoir about it, turned the memoir into a one-woman stage show, then into an HBO documentary, and gave interview after interview elaborating on it — because she had decided, deliberately, that being visibly and unapologetically mentally ill in public was a form of work worth doing.</p>
<p>That is the clinical fact this course is built on, and it is also the ethical fact that makes this course possible to teach responsibly at all. A diagnosis a person volunteers, explains, and re-explains across fifteen years of public record is different in kind from a diagnosis a clinician infers from a distance. This course uses only the former. It teaches bipolar disorder, electroconvulsive therapy, and the psychology of stigma using Carrie Fisher's own account of her own experience — never a clinical opinion about her that she did not first offer herself.</p>
<p>This is the first course in the Public Figures & Mental Health series, and Fisher is a deliberate starting point rather than an arbitrary one. Where some public figures disclose once, under pressure, and never return to the subject, Fisher built a body of work around it — a memoir, a stage adaptation, a documentary, and years of consistent interviews — that never required later revision or walking back. That stability is exactly what makes her account safe to build a full continuing-education course on, and it is the standard every course in this series is held to before a single word of clinical content is written.</p>` },

        { type: 'callout', order: 3, calloutType: 'clinical', title: 'Why This Matters',
          calloutItems: [
            'An estimated 2.8% of U.S. adults meet criteria for bipolar disorder in a given year, and 4.4% will meet criteria at some point in their lives — most clinicians will treat someone with this diagnosis whether or not they specialize in mood disorders.',
            'Research on diagnostic delay in bipolar disorder finds an average gap of six to eight years between symptom onset and accurate diagnosis, with a substantial share of patients receiving one or more incorrect diagnoses first.',
            'Public self-disclosure by a well-known figure measurably lowers the stigma a newly diagnosed client experiences — but only when the disclosure is specific, repeated, and framed as ordinary rather than exceptional, which is precisely the pattern Fisher’s public statements follow.',
            'Electroconvulsive therapy remains one of the most effective treatments in psychiatry for severe, treatment-resistant depression, and one of the most misunderstood — a gap this course addresses directly using Fisher’s own descriptions of the procedure.',
          ]},

        { type: 'text', order: 4, content: `<h2>Where This Course Is Going</h2>
<p>The next section moves from this introduction into clinical biography: Fisher's own account of her diagnosis at twenty-four, the DSM-5-TR criteria that account maps onto, and the diagnostic reasoning a clinician uses to distinguish bipolar disorder from adjacent presentations. From there, the course turns to treatment — the medications she described trying without success, the electroconvulsive therapy she eventually underwent and spoke about in striking, specific terms, and a composite clinical scenario for applying that material to a client sitting in front of you. The course closes on ethics: the Goldwater Rule, its counseling equivalents, and the cultural work that public disclosure does and does not do.</p>
<p>Each section builds on the one before it. By the time you reach the final reflection, the goal is not that you know more about Carrie Fisher. It is that you have a sharper, more usable framework for the diagnostic conversation, the treatment conversation, and the disclosure conversation you will eventually have with someone who is not famous at all.</p>` },

        { type: 'imageText', order: 5, imagePosition: 'right',
          content: `<h3>Self-Disclosure as a Clinical Phenomenon</h3>
<p>Clinicians are trained to think about disclosure mainly as something that happens <em>inside</em> the therapy room — what a client tells you, and when. Public self-disclosure by a well-known figure is a different mechanism entirely, and it has its own evidence base. Research on celebrity mental health disclosure consistently finds that specific, repeated, first-person accounts reduce stigma more effectively than general public-awareness messaging, precisely because they replace an abstract category ("the mentally ill") with a concrete, sympathetic, individuated person.</p>
<p>Fisher's disclosures fit this pattern unusually well. They were not a single interview given once under pressure. They were a body of work — a memoir, a stage show, a documentary, years of interviews — built and rebuilt over more than a decade, each version adding detail rather than retreating from it. That consistency is itself clinically significant: it is the opposite of the disclosure pattern that later requires revision, and it is why her account can be used as a stable teaching anchor rather than a moving target.</p>
<p>There is a second body of research worth naming here, one this series' live course covers in depth: the distinction between the Werther effect, where media coverage of a death is associated with an increase in subsequent deaths, and the Papageno effect, where coverage that focuses on coping and recovery is associated with a protective effect. Fisher's public narrative is squarely Papageno-shaped — she foregrounded ongoing management, humor, and survival, not crisis alone — which is a large part of why her disclosure model has held up as a teaching example rather than a cautionary one. A clinician recommending a client engage with any public figure's mental health story should ask which shape that particular story takes before recommending it.</p>` },

        { type: 'cardSort', order: 6,
          instructions: 'Sort each statement into the category it belongs in. This course, like every course in the Public Figures & Mental Health series, is built only on material in the left-hand category.',
          categories: ['Usable — Her Own Disclosure', 'Not Usable — Speculation About Her'],
          cards: [
            { id: 'c1', text: '"I am mentally ill. I can say that. I am not ashamed of that." — Fisher, in an interview with Diane Sawyer', correctCategory: 'Usable — Her Own Disclosure' },
            { id: 'c2', text: 'A biographer’s guess about how her childhood in a famous family caused her later diagnosis', correctCategory: 'Not Usable — Speculation About Her' },
            { id: 'c3', text: 'Her own description, to Oprah in 2011, of what electroconvulsive therapy felt like', correctCategory: 'Usable — Her Own Disclosure' },
            { id: 'c4', text: 'A tabloid claim about a psychiatric hospitalization that she never confirmed or discussed', correctCategory: 'Not Usable — Speculation About Her' },
            { id: 'c5', text: 'The title and content of her memoir Shockaholic, in which she wrote directly about ECT', correctCategory: 'Usable — Her Own Disclosure' },
            { id: 'c6', text: 'An online commenter’s theory about which of her relationships "triggered" a mood episode', correctCategory: 'Not Usable — Speculation About Her' },
          ]},

        { type: 'accordion', order: 7, accordionItems: [
          { title: 'Bipolar Disorder', content: '<p>A mood disorder marked by episodes of mania or hypomania, typically alternating with major depressive episodes and diagnosed using specific duration and severity criteria rather than mood content alone. Fisher used the older term "manic depression," common in the era of her diagnosis, to describe the same condition, and this course uses her exact vocabulary where relevant before mapping it onto current DSM-5-TR language.</p>' },
          { title: 'Electroconvulsive Therapy (ECT)', content: '<p>A medical procedure using brief, controlled electrical stimulation of the brain under general anesthesia, indicated for severe or treatment-resistant depression after other approaches have not achieved sufficient response. Fisher underwent ECT and described both its benefits and its real side effects in specific, unsentimental detail across multiple interviews — a rare combination in public discussion of the procedure.</p>' },
          { title: 'Diagnostic Delay', content: '<p>The gap — averaging six to eight years for bipolar disorder — between symptom onset and accurate diagnosis, often filled with one or more incorrect diagnoses and treatment approaches that do not fit the actual underlying condition, sometimes including antidepressant monotherapy that risks precipitating a manic episode.</p>' },
          { title: 'Stigma and Disclosure', content: '<p>The social cost attached to a psychiatric diagnosis, and the research evidence showing that specific, repeated, first-person disclosure by a public figure measurably reduces that cost for others more effectively than general public-awareness campaigns — provided the disclosure is framed around ongoing management rather than crisis alone.</p>' },
          { title: 'The Sourcing Standard', content: '<p>The rule this course and every course in its series holds to without exception: a public figure’s own voluntary account of their own experience, or sworn court record, is usable teaching material. Speculation, inference, biography written by someone else, or a clinical opinion offered from a distance is not — regardless of how confident or well-intentioned that opinion might be.</p>' },
        ]},

        { type: 'keyTakeaway', order: 8, title: 'What You Will Take Away',
          takeaways: [
            'A working framework for distinguishing a diagnosis a client discloses from a diagnosis a clinician infers.',
            'DSM-5-TR criteria for manic, hypomanic, and major depressive episodes, taught through a real, extensively documented case.',
            "A clear picture of modern ECT — its indications, its safety profile, and how to answer a client's fears about it.",
            "A specific, usable technique for using public disclosure as psychoeducation without pathologizing or idolizing the person who disclosed.",
            'A clean statement of the Goldwater Rule and its ACA equivalents that you can apply the next time a public figure’s mental health becomes a public conversation.',
          ]},

        { type: 'multipleChoice', order: 9,
          question: 'Before any clinical content is introduced, what is the sourcing standard this course applies to Carrie Fisher’s biography?',
          options: [
            { text: 'Any published account of her life, including biographies and reporting about her', isCorrect: false },
            { text: 'Only her own public statements — her memoirs, documentary, and on-the-record interviews', isCorrect: true },
            { text: 'The clinical judgment of the course author, informed by publicly available information', isCorrect: false },
            { text: 'Statements from people who knew her personally, whether or not she confirmed them', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: "The course uses only Fisher's own account of her own experience. We'll return to why this distinction matters clinically and ethically in Section 4." },

        { type: 'reflection', order: 10,
          question: 'Think of a time a client referenced a celebrity’s mental health disclosure in session — their own words, if you can recall them. What were they using that person’s story to say about themselves?' },
      ],
    },

    // ══════════════════════════════════════════════════════════════════
    // SECTION 2 — CLINICAL BIOGRAPHY & DIAGNOSTIC CONSIDERATIONS
    // ══════════════════════════════════════════════════════════════════
    {
      title: 'Clinical Biography & Diagnostic Considerations',
      order: 2,
      description: "Fisher's own account of her diagnosis, mapped onto DSM-5-TR criteria for bipolar disorder.",
      estimatedTime: 27,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '2',
          title: 'Clinical Biography & Diagnostic Considerations',
          subtitle: "Fisher's own account, and the diagnostic criteria it maps onto" },

        { type: 'text', order: 2, content: `<h2>Diagnosed at Twenty-Four</h2>
<p>Fisher dated her diagnosis to age twenty-four, describing it in interviews and in <em>Wishful Drinking</em> as the point at which what she had been experiencing — and, by her own account, self-medicating with drugs and alcohol — finally had a name. She used the term <strong>manic depression</strong> — a diagnosis known today as <strong>bipolar disorder</strong> — a description that in DSM-5-TR maps onto Bipolar I Disorder: recurrent episodes of mania, often alternating with major depressive episodes severe enough to be disabling.</p>
<p>She was direct, and repeatedly so, about what carrying that diagnosis meant to her. To Diane Sawyer, in an interview later widely quoted by NAMI and other advocacy organizations, she said: <em>"I am mentally ill. I can say that. I am not ashamed of that. I survived that, I'm still surviving it, but bring it on. Better me than you."</em> To People magazine, describing the diagnosis in clinical terms she had clearly made her own, she said: <em>"I have a chemical imbalance that, in its most extreme state, will lead me to a mental hospital."</em></p>
<p>Neither statement is a clinician's formulation. Both are a patient's own account of her illness, offered in her own vocabulary, years after the fact and with the benefit of extensive treatment. That is exactly the kind of source this course is built to use.</p>` },

        { type: 'text', order: 3, content: `<h2>What the Criteria Actually Require</h2>
<p>DSM-5-TR requires a <strong>manic episode</strong> to include a distinct period of abnormally and persistently elevated, expansive, or irritable mood and abnormally and persistently increased goal-directed activity or energy, lasting at least one week (or any duration if hospitalization is required), accompanied by at least three of seven characteristic symptoms — inflated self-esteem or grandiosity, decreased need for sleep, pressured speech, flight of ideas, distractibility, increased goal-directed activity, or excessive involvement in high-risk activities — severe enough to cause marked impairment or require hospitalization.</p>
<p>A <strong>hypomanic episode</strong> shares the same symptom list but requires only four consecutive days, and the disturbance must be noticeable to others without being severe enough to cause marked impairment, require hospitalization, or include psychotic features. This distinction — impairment severity and duration, not symptom type — is the single most commonly missed diagnostic distinction between Bipolar I and Bipolar II presentations, and it is worth pausing on, because it is also the distinction most new clinicians get backward: a hypomanic episode is not a "smaller" manic episode in symptom content, only in severity and consequence.</p>
<p>A <strong>major depressive episode</strong>, occurring within the same illness course, requires five or more symptoms — depressed mood, anhedonia, significant weight or appetite change, sleep disturbance, psychomotor agitation or retardation, fatigue, worthlessness or excessive guilt, diminished concentration, or recurrent thoughts of death — present for at least two weeks and representing a change from previous functioning.</p>
<p>Fisher's public account describes both poles clearly: the elevated, high-energy periods she associated with mania, and — more extensively, in her later interviews — a depression severe enough that standard pharmacological treatment repeatedly failed to resolve it, which is the clinical picture that eventually led her to electroconvulsive therapy, discussed in the next section.</p>
<p>A note on differential precision: none of these criteria are meant to be applied from a magazine interview or a single quoted sentence, and this course does not pretend otherwise. What Fisher's account offers is not a chart-ready diagnostic workup — it is a clear, consistent, multi-year illustration of what the criteria look like from the inside, which is exactly the kind of illustration a textbook case vignette is built to provide, except that this one happens to be true and self-authored rather than composited for a textbook.</p>
<p>DSM-5-TR also allows a set of <strong>specifiers</strong> that refine a bipolar diagnosis without changing its core criteria, and they are worth knowing because they change treatment planning directly. "With mixed features" describes an episode meeting full criteria for one pole while also presenting several symptoms of the other — for example, a depressive episode accompanied by racing thoughts or decreased need for sleep — and it is associated with a more complicated treatment course and elevated risk. "With anxious distress" flags a co-occurring level of tension, restlessness, or fear of losing control that, given the anxiety comorbidity rates discussed later in this section, is common enough to screen for routinely rather than treat as incidental. "With rapid cycling" describes four or more mood episodes within a twelve-month period and is associated with a more treatment-resistant course overall. None of these specifiers changes the underlying diagnosis; each changes what a clinician should be watching for and how urgently.</p>` },

        { type: 'text', order: 4, content: `<h2>Differential Diagnosis and Common Comorbidities</h2>
<p>Bipolar disorder is frequently missed or misdiagnosed because its presenting features overlap with several other conditions, and a careful clinician needs a working map of where the boundaries actually sit.</p>
<p><strong>Bipolar disorder vs. major depressive disorder with irritability.</strong> A depressed client who is irritable rather than sad is not, by that fact alone, bipolar — irritability is a permitted symptom within a major depressive episode. The distinguishing question is whether there has ever been a discrete period, however brief, of elevated mood, energy, or activity that stands apart from the person's baseline. Absent that history, irritability alone does not support a bipolar diagnosis, and the field's history of over-applying "bipolar" to any mood instability is itself a documented source of misdiagnosis.</p>
<p><strong>Bipolar disorder vs. ADHD.</strong> Adult ADHD and hypomania share surface features — distractibility, impulsivity, restlessness — but differ in course. ADHD symptoms are chronic and present from childhood; hypomanic symptoms are episodic, representing a change from the person's own baseline. A careful developmental history, not a checklist of current symptoms, is what separates the two, and the two conditions co-occur often enough that ruling one out does not rule out the other.</p>
<p><strong>Bipolar disorder vs. borderline personality disorder.</strong> Both involve mood instability, but the timescale differs sharply: bipolar mood episodes last days to weeks; borderline mood shifts typically last hours and are tightly linked to interpersonal triggers. Missing this distinction in either direction leads to a treatment plan built around the wrong mechanism entirely.</p>
<p><strong>Bipolar disorder vs. substance-induced mood disorder.</strong> This is the distinction most directly relevant to Fisher's own account. She described using drugs and alcohol before her diagnosis in terms she herself connected to undiagnosed illness — self-medication for a mood disorder that did not yet have a name. This is a common and clinically important pattern: substance use can mimic, mask, or genuinely trigger mood episodes, and disentangling primary mood disorder from substance-induced presentation often requires an extended period of sobriety before a stable diagnosis is possible.</p>
<p><strong>Comorbidity.</strong> Bipolar disorder rarely travels alone. Lifetime co-occurring substance use disorder is common, with published estimates ranging roughly from 40% to 60% depending on the sample and methodology — among the highest comorbidity rates of any psychiatric diagnosis. Lifetime anxiety disorder comorbidity is also substantial, with meta-analytic estimates around 40% and some large survey samples reporting figures considerably higher. A clinician who screens for bipolar disorder and stops there, without also screening for anxiety and substance use, is very likely missing part of the clinical picture.</p>` },

        { type: 'callout', order: 5, calloutType: 'ethics', title: 'A Reminder on Sourcing',
          content: `<p>Everything above is drawn from Fisher's own published statements and her own memoir, mapped onto standard diagnostic criteria for teaching purposes. We are not diagnosing her from this distance — we could not, and it would violate the standard this entire course is built on. We are using the diagnosis she named for herself, in her own words, to teach the criteria accurately. This is the difference between clinical education and the Goldwater Rule violation Section 4 addresses directly.</p>` },

        { type: 'text', order: 6, content: `<h2>Media Myth vs. Clinical Reality</h2>
<p>Public misunderstanding of bipolar disorder clusters around a small number of persistent myths — several of which Fisher's own account directly contradicts.</p>
<table>
<thead><tr><th>Common Media Myth</th><th>Clinical Reality</th></tr></thead>
<tbody>
<tr><td>Bipolar disorder means rapid mood swings within a single day.</td><td>Episodes last days to weeks at minimum by DSM-5-TR criteria; moment-to-moment mood shifts are more consistent with other presentations, such as borderline personality disorder or normal emotional reactivity.</td></tr>
<tr><td>People with bipolar disorder are unpredictable or dangerous.</td><td>The overwhelming majority of people with bipolar disorder are not violent; when risk is elevated it is overwhelmingly directed at the person themselves, not others.</td></tr>
<tr><td>A bipolar diagnosis means someone can never be reliable or hold responsibility.</td><td>Fisher worked continuously for decades post-diagnosis, publicly attributing her ability to keep working to consistent treatment, not to the absence of illness.</td></tr>
<tr><td>Manic episodes are simply "being really happy" or "having a lot of energy."</td><td>Mania is a disorder of function, not mood valence alone — it frequently includes irritability, poor judgment, and impairment severe enough to require hospitalization, as Fisher's own account describes.</td></tr>
</tbody>
</table>
<p>Each row in this table matters clinically, not just rhetorically: a client who has absorbed the media version of any one of these myths will bring that version into the room, often without realizing it is not the clinical picture. A newly diagnosed client who believes mania means being "really happy" may not report the irritability and poor judgment that actually accompanied their episode, because it does not match the word they think they were just diagnosed with. Correcting the myth directly, early, is itself a piece of treatment.</p>` },

        { type: 'text', order: 7, content: `<h2>Treatment Adherence and the "Poster Child" Role</h2>
<p>Medication adherence in bipolar disorder carries a specific complication that clinicians treating unipolar depression rarely encounter to the same degree: a meaningful share of patients describe missing the elevated states, not just tolerating side effects, and discontinue mood stabilizers as a result. This is a documented, clinically significant driver of relapse, and it is worth naming directly with clients rather than treating adherence purely as a logistics problem of remembering doses.</p>
<p>Fisher spoke to exactly this tension. She was publicly candid that consistent treatment, not the absence of illness, was what let her keep working for decades — a framing that runs directly against the common patient experience of mourning a hypomanic or manic state that, subjectively, can feel like heightened creativity, confidence, or productivity rather than illness. Naming that felt loss explicitly, rather than assuming a client simply forgot their medication or didn't understand the risks, often opens an adherence conversation that a purely educational approach cannot.</p>
<p>There is also a less-discussed cost to becoming what press coverage repeatedly called Fisher a "poster child" for bipolar disorder: sustained public visibility as a mental-illness spokesperson can create pressure to appear consistently stable, which is its own burden layered on top of the illness itself. A clinician working with any client who has become visible in their own community as "the one who talks about" a diagnosis — a support-group leader, a vocal advocate, a public-facing professional — should ask directly whether that visibility has become one more thing to manage, rather than assuming advocacy is uniformly protective.</p>
<p>None of this is an argument against disclosure, either for Fisher or for a client. It is an argument for treating disclosure as a choice with ongoing costs and benefits that can shift over time, not a one-time decision that settles the matter permanently. A client who disclosed a diagnosis to family, a workplace, or a community years ago is entitled to revisit that choice, to disclose further, or to pull back — and a clinician's job is to support that ongoing decision-making, not to treat the original disclosure as a fixed commitment the client must maintain indefinitely.</p>` },

        { type: 'statCard', order: 8, title: 'Bipolar Disorder, By the Numbers',
          stats: [
            { value: '2.8%', label: '12-month prevalence, U.S. adults', description: 'National Institute of Mental Health' },
            { value: '4.4%', label: 'Lifetime prevalence, U.S. adults', description: 'National Institute of Mental Health' },
            { value: '6–8 yrs', label: 'Average diagnostic delay', description: 'From symptom onset to accurate diagnosis' },
          ]},

        { type: 'flashcardDeck', order: 9, instructions: 'Terms drawn from this section. Front-and-back pairs feed the course glossary automatically.', flashcards: [
          { id: 'f1', front: 'Manic Episode', back: 'A distinct period (≥1 week, or any duration if hospitalized) of abnormally elevated mood and energy with ≥3 characteristic symptoms, causing marked impairment.' },
          { id: 'f2', front: 'Hypomanic Episode', back: 'Same symptom criteria as mania, but ≥4 days and without marked impairment, hospitalization, or psychotic features.' },
          { id: 'f3', front: 'Major Depressive Episode', back: '≥5 symptoms including depressed mood or anhedonia, present ≥2 weeks, representing a change from prior functioning.' },
          { id: 'f4', front: 'Manic Depression', back: 'The older clinical term for bipolar disorder, used by Fisher throughout her public statements, reflecting the terminology of the era of her diagnosis.' },
          { id: 'f5', front: 'Treatment-Resistant Depression', back: 'A depressive episode that fails to respond adequately to two or more appropriate antidepressant trials, prompting consideration of interventions such as ECT.' },
          { id: 'f6', front: 'Diagnostic Delay', back: 'The interval between symptom onset and accurate diagnosis; averages 6–8 years for bipolar disorder, often filled with misdiagnosis.' },
        ]},

        { type: 'matching', order: 10, matchingInstructions: 'Match each of Fisher’s own statements to the clinical concept it illustrates.',
          matchingPairs: [
            { term: '"I am mentally ill. I can say that. I am not ashamed of that."', definition: 'Stigma resistance through direct, repeated self-labeling' },
            { term: '"I have a chemical imbalance that, in its most extreme state, will lead me to a mental hospital."', definition: 'Patient-authored insight into illness severity and hospitalization risk' },
            { term: 'Titling a memoir Shockaholic', definition: 'Reclaiming a stigmatized treatment (ECT) through public, self-authored framing' },
            { term: 'Describing "ups and downs" that "send you to ECT"', definition: 'A lay description of a treatment-resistant depressive episode' },
          ]},

        { type: 'keyTakeaway', order: 11, title: 'Section Takeaways', takeaways: [
          'Bipolar I is distinguished from Bipolar II by the severity and duration of the elevated-mood episode, not by symptom content alone.',
          'A major depressive episode requires five or more symptoms for at least two weeks representing a change from baseline functioning.',
          'Diagnostic delay for bipolar disorder averages six to eight years, often including one or more incorrect diagnoses.',
          "Fisher's own account illustrates treatment-resistant depression clearly enough to teach the concept without any clinical speculation about her.",
        ]},

        { type: 'multipleChoice', order: 12,
          question: 'Fisher publicly described her diagnosis using the term "manic depression." What condition does this correspond to in DSM-5-TR?',
          options: [
            { text: 'Major depressive disorder, recurrent', isCorrect: false },
            { text: 'Bipolar disorder', isCorrect: true },
            { text: 'Persistent depressive disorder (dysthymia)', isCorrect: false },
            { text: 'Cyclothymic disorder', isCorrect: false },
          ], correctAnswer: 1,
          explanation: '"Manic depression" is the older term for bipolar disorder, in use during the era of Fisher’s original diagnosis.' },

        { type: 'multipleChoice', order: 13,
          question: 'What primarily distinguishes a hypomanic episode from a manic episode?',
          options: [
            { text: 'Hypomania never includes irritability, only elevated mood', isCorrect: false },
            { text: 'Hypomania requires fewer of the seven characteristic symptoms', isCorrect: false },
            { text: 'Hypomania is shorter in required duration and does not cause marked impairment, hospitalization, or psychotic features', isCorrect: true },
            { text: 'Hypomania can only be diagnosed retrospectively, never during the episode', isCorrect: false },
          ], correctAnswer: 2,
          explanation: 'Both share the same symptom list; the difference is duration (4 days vs. 1 week) and severity of impairment.' },

        { type: 'multiSelect', order: 14,
          question: 'Which of the following are required elements of a DSM-5-TR major depressive episode? Select all that apply.',
          options: [
            { text: 'At least five symptoms present for a minimum of two weeks', isCorrect: true },
            { text: 'A change from previous functioning', isCorrect: true },
            { text: 'A documented history of a prior manic episode', isCorrect: false },
            { text: 'Either depressed mood or anhedonia must be one of the five symptoms', isCorrect: true },
          ],
          explanation: 'A prior manic episode is not required for a major depressive episode diagnosis on its own — it is only required for a bipolar disorder diagnosis, which requires both poles across the illness course.' },

        { type: 'reflection', order: 15,
          question: 'Think of a client whose diagnosis took years to arrive at accurately. What would it have meant for that client to hear, early on, a specific first-person account like Fisher’s rather than a diagnostic label alone?' },
      ],
    },

    // ══════════════════════════════════════════════════════════════════
    // SECTION 3 — TREATMENT PLANNING & CLINICAL APPLICATION
    // ══════════════════════════════════════════════════════════════════
    {
      title: 'Treatment Planning & Clinical Application',
      order: 3,
      description: 'Evidence-based treatment for bipolar disorder and treatment-resistant depression, applied to a clinical scenario.',
      estimatedTime: 27,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '3',
          title: 'Treatment Planning & Clinical Application',
          subtitle: 'From evidence base to a client sitting in front of you' },

        { type: 'text', order: 2, content: `<h2>What Fisher Described Trying First</h2>
<p>By her own account and biographical reporting on her treatment course, Fisher was treated with multiple medications — including lithium, still a first-line mood stabilizer for Bipolar I — before those approaches proved insufficient for a depressive episode severe enough to be disabling. This sequence matches standard treatment guidelines: pharmacotherapy with a mood stabilizer, often combined with psychotherapy, is the first-line approach for bipolar disorder, and augmentation or a change in medication is the standard next step when a depressive episode does not respond.</p>
<p>It was only after that sequence — described in her own words as extended and unsuccessful — that she underwent electroconvulsive therapy. That order matters clinically: ECT is not typically a first-line treatment. It is indicated for severe, treatment-resistant depression, depression with psychotic or catatonic features, or situations where rapid response is needed due to acute risk. Fisher's account, read carefully, is a textbook description of the pathway that leads a patient there.</p>` },

        { type: 'text', order: 3, content: `<h2>What Modern ECT Actually Involves</h2>
<p>Fisher described the procedure to Oprah in 2011 in specific, demystifying terms: <em>"They put you to sleep. They give you a medication so there are no more convulsions or anything… It's over very quickly and you go home and take a nap."</em> She described its effect on a depressive episode as being <em>"like being hit with happy lightning,"</em> while also naming a real cost — she noted that with the first round, <em>"you lose the month around then,"</em> referring to short-term memory effects around the treatment period.</p>
<p>That combination — genuine relief, honestly described, alongside a genuine and specifically named side effect — is more useful to a clinician than either a purely reassuring or purely alarming account would be. Modern ECT is administered under general anesthesia with a muscle relaxant, is monitored continuously, and remains one of the most effective treatments available for severe treatment-resistant depression, with response rates in treatment-resistant populations that exceed most medication trials at that stage of treatment. Its most consistently documented side effect is short-term memory disturbance around the treatment period, most pronounced for autobiographical memories close in time to the treatment itself and typically improving over the weeks following a course of treatment — exactly the pattern Fisher described.</p>` },

        { type: 'text', order: 4, content: `<h2>Informed Consent: What the Client Actually Needs to Hear</h2>
<p>Informed consent for ECT is a specific, structured process, and clinicians who are not the ones administering it still play a meaningful role in preparing a client for that conversation — or in undoing decades of media-shaped misconception before the client ever reaches the psychiatrist's office. A useful consent conversation, mirrored by Fisher's own plainspoken account, covers four things: what happens procedurally, what it treats and why it was chosen at this point in treatment, what the realistic benefits are, and what the realistic risks and side effects are — stated specifically, not vaguely reassured away.</p>
<p>The most common client question is some version of "will I lose my memory," and it deserves a specific, honest answer rather than a deflection in either direction. The evidence-based answer: some short-term memory disturbance around the treatment period is expected and usually resolves over the weeks following a course of treatment; retrograde amnesia for events more distant in time is less common and, when it occurs, is more often reported for autobiographical memories than for general knowledge or skills. This is closer to what Fisher described — "you lose the month around then" — than to the sweeping, permanent memory loss many clients picture from outdated media portrayals.</p>
<p>The second most common concern is often unspoken rather than asked outright: a fear that needing ECT means treatment has "failed," or that the client is now a more severe case than others. This is precisely the framing this course has argued against throughout — ECT is a treatment matched to a specific clinical presentation, not a marker of a person's worth or a verdict on how "sick" they are. A clinician who can name that fear before the client voices it, the way this section has modeled, often does more for treatment engagement than any amount of technical explanation.</p>` },

        { type: 'callout', order: 5, calloutType: 'protocol', title: 'Answering a Client’s Fear of ECT',
          calloutItems: [
            'Name the fear directly rather than deflecting it — most clients picturing ECT are picturing outdated, unanesthetized procedures from decades-old media portrayals, not the modern procedure.',
            'Describe the actual mechanics briefly and plainly: general anesthesia, a muscle relaxant, continuous monitoring, and a procedure lasting minutes, not the client’s imagined ordeal.',
            'Name the real side effect — short-term memory disturbance — without minimizing it, and describe its typical time course honestly, the way Fisher did.',
            'Frame ECT as a treatment reserved for depression that has not responded to other approaches, not as evidence that a client has "failed" treatment or reached a last resort in any punitive sense.',
          ]},

        { type: 'text', order: 6, content: `<h2>Risk Assessment in Treatment-Resistant Depression</h2>
<p>One of ECT's recognized indications — situations requiring a rapid treatment response — exists because treatment-resistant depression carries meaningfully elevated suicide risk, and a course covering this material has an obligation to address risk assessment directly rather than leaving it implicit.</p>
<p>Standard risk assessment in this population goes beyond a single yes-or-no question about suicidal thoughts. A structured assessment distinguishes passive ideation (wishing not to wake up) from active ideation (thinking about ending one's life), asks specifically about plan and means, evaluates access to lethal means, and assesses protective factors alongside risk factors rather than treating risk as a single number on a scale. For a client whose depression has already proven resistant to standard pharmacotherapy — the population for whom ECT becomes clinically relevant — risk should be reassessed at every contact, not only at intake, because treatment resistance itself is a marker of a more severe and more chronic course.</p>
<p>Safety planning for this population should be concrete and collaborative rather than generic: identifying specific warning signs unique to that client, specific coping strategies that have worked before, specific people to contact and in what order, and specific means restriction relevant to that client's actual access — not a form filled out once and filed away. When a rapid-response treatment like ECT is on the table, safety planning and treatment planning are not separate conversations; they inform each other directly, and a clinician coordinating with a psychiatrist about ECT candidacy should be prepared to speak concretely to the current state of the client's risk, not only to their depressive symptom severity in the abstract.</p>` },

        { type: 'text', order: 7, content: `<h2>Access, Culture, and Why Disclosure Alone Doesn't Close the Gap</h2>
<p>Fisher's disclosures did real work in the culture — they are credited, by NAMI among others, with measurably shifting how bipolar disorder is discussed publicly. But a clinician should not mistake cultural progress for equal access to the treatment pathway her account describes. She had, by her own repeated acknowledgment, resources most clients treating in a community mental health setting do not: extended inpatient stays, a personal psychiatrist, and the ability to take months away from work to stabilize. ECT itself remains unevenly accessible — concentrated in academic medical centers and larger metropolitan areas, often requiring a treatment course of six to twelve sessions delivered two to three times weekly, which is a significant burden for a client without transportation, childcare, or paid leave.</p>
<p>Cultural context also shapes how a disclosure like Fisher's lands. In communities where mental illness carries acute religious or family stigma, a celebrity's public disclosure can be received very differently than the demographic research on stigma reduction generally predicts — sometimes as validating, sometimes as evidence that mental illness is a "Hollywood problem" disconnected from the client's own community and therefore not something to admit to. A clinician using a public figure's story as psychoeducation should ask, rather than assume, how a specific client's community would receive that same disclosure, before treating the story as universally destigmatizing.</p>
<p>None of this diminishes what Fisher's disclosures accomplished. It means a clinician's job is to translate the destigmatizing function of her story into a treatment plan that accounts for the access and cultural realities the story itself does not have to contend with.</p>` },

        { type: 'text', order: 8, content: `<h2>Applying This: A Composite Clinical Scenario</h2>
<p>Consider a composite case, built for teaching purposes and not describing any real client: a 29-year-old presenting for a second round of treatment after an eight-month gap. Their first course of treatment addressed what was diagnosed as major depressive disorder; medication helped for several months, then symptoms returned alongside a two-week period the client describes, almost in passing, as "when I didn't need to sleep and got a ton done" — a period they do not consider relevant to why they are back in treatment, because to them it felt like the opposite of a problem.</p>
<p>This is precisely the diagnostic trap this section has been building toward: a hypomanic or manic episode reported by the client as a period of high functioning, embedded inside what looks superficially like a straightforward major depressive disorder relapse. Missing it means treating with an antidepressant alone, which carries real risk of precipitating a manic episode in an unrecognized bipolar presentation. Catching it means a different first-line approach entirely — and it means asking the specific, structured questions that surface a hypomanic history a client will not volunteer, because to them it did not read as illness.</p>
<p>This composite is deliberately ordinary rather than dramatic, and that is the point. Most missed bipolar diagnoses do not look like a textbook manic episode with grandiosity and psychosis; they look like a client mentioning, almost in passing, a stretch of time that felt unusually good and unusually productive. A structured mood-history question — asked the same way, every time, of every client presenting with depression — is what turns an easy-to-miss aside into the diagnostic information it actually is.</p>` },

        { type: 'scenarioTree', order: 9,
          scenarioTitle: 'The Second Intake',
          instructions: 'Work through the decision points below for the composite client described above.',
          startNode: 'start',
          nodes: {
            start: {
              text: 'The client has just described the two-week high-energy period as unrelated to why they are back in treatment. What do you do first?',
              choices: [
                { text: 'Proceed with the depression intake as planned; revisit mood history later if needed', next: 'proceed_depression' },
                { text: 'Pause and ask structured follow-up questions about that two-week period specifically', next: 'ask_followup' },
              ],
            },
            proceed_depression: {
              text: 'You proceed. Three weeks into antidepressant treatment, the client returns reporting racing thoughts, three nights with almost no sleep, and a new business venture launched on impulse. This is a common trajectory when a hypomanic history is missed and an antidepressant is started alone — treatment-emergent mania or hypomania is well documented in unrecognized bipolar presentations.',
              choices: [
                { text: 'Return to the beginning and reassess with the full mood history in hand', next: 'ask_followup' },
              ],
            },
            ask_followup: {
              text: 'You ask: how long did the high-energy period last, did it require less sleep than usual, did other people notice a change, and did anything about it cause problems, even ones the client didn’t connect to it at the time. The client mentions they maxed out a credit card that week and their partner asked if they were "doing okay" more than once. This meets criteria for a manic or hypomanic episode by history — changing the diagnostic picture from unipolar depression to a bipolar spectrum presentation, and changing first-line treatment accordingly.',
              choices: [
                { text: 'End scenario — you have reached an accurate working diagnosis', next: 'end' },
              ],
            },
            end: { text: 'Structured mood history — asked directly, every time — is what catches an episode a client does not think to report as illness. This is the single highest-yield habit in mood-disorder assessment.', choices: [] },
          }},

        { type: 'sequencing', order: 10,
          instructions: 'Put these steps in order for responding when a client brings a public figure’s mental health disclosure into session, the way the client in Section 1’s reflection did.',
          steps: [
            { id: 's1', text: 'Ask what specifically the client took from the public figure’s account, rather than assuming', order: 1 },
            { id: 's2', text: 'Listen for whether it’s being used as permission ("if they could say it, maybe I can") or as a painful comparison ("they had help I don’t have")', order: 2 },
            { id: 's3', text: 'Validate the function the disclosure served for the client before addressing content', order: 3 },
            { id: 's4', text: 'Correct any inaccurate clinical inference gently, without dismissing the client’s own connection to the material', order: 4 },
            { id: 's5', text: 'Redirect toward the client’s own experience and history, using the public account as a bridge rather than a destination', order: 5 },
          ],
          explanation: 'The goal is never to relitigate the public figure’s diagnosis in session — it is to use the moment the client opened to get to the client’s own material faster.' },

        { type: 'keyTakeaway', order: 11, title: 'Section Takeaways', takeaways: [
          'ECT is indicated for severe or treatment-resistant depression, not as a first-line intervention — Fisher’s account matches this sequence exactly.',
          'Modern ECT is administered under anesthesia with continuous monitoring; its primary documented side effect is short-term memory disturbance, typically time-limited.',
          'A hypomanic or manic episode reported by a client as a period of high functioning is a common and consequential diagnostic miss.',
          'Antidepressant monotherapy in an unrecognized bipolar presentation carries real risk of precipitating mania.',
          'When a client brings up a public figure’s disclosure, the clinical task is to find out what the client is using it to say about themselves.',
        ]},

        { type: 'multipleChoice', order: 12,
          question: 'Based on standard treatment guidelines, electroconvulsive therapy is typically indicated for:',
          options: [
            { text: 'Any first episode of major depression, regardless of severity', isCorrect: false },
            { text: 'Severe or treatment-resistant depression, depression with psychotic features, or situations requiring rapid response', isCorrect: true },
            { text: 'Mild depressive symptoms that have not yet been treated with medication', isCorrect: false },
            { text: 'Bipolar disorder exclusively, and never for unipolar depression', isCorrect: false },
          ], correctAnswer: 1,
          explanation: 'ECT is reserved for depression that has proven severe, treatment-resistant, or acutely high-risk — matching the sequence Fisher herself described.' },

        { type: 'multipleChoice', order: 13,
          question: 'In the composite scenario, what was the primary diagnostic risk of proceeding with a straightforward depression treatment plan without further mood history?',
          options: [
            { text: 'The client would be under-medicated for anxiety', isCorrect: false },
            { text: 'Antidepressant monotherapy could precipitate a manic or hypomanic episode in an unrecognized bipolar presentation', isCorrect: true },
            { text: 'The client would be diagnosed with a personality disorder instead', isCorrect: false },
            { text: 'There is no meaningful risk; treatment approaches for depression are interchangeable regardless of history', isCorrect: false },
          ], correctAnswer: 1,
          explanation: 'This is precisely what unfolds in the "proceed_depression" branch of the scenario above.' },

        { type: 'reflection', order: 14,
          question: 'Think of your own structured mood-history questions. Do they reliably surface a hypomanic period a client would describe as "a really good couple of weeks" rather than as a symptom? What would you add, change, or ask more consistently going forward?' },
      ],
    },

    // ══════════════════════════════════════════════════════════════════
    // SECTION 4 — ETHICS, CULTURAL CONSIDERATIONS & REFLECTION (conclusion)
    // ══════════════════════════════════════════════════════════════════
    {
      title: 'Ethics, Cultural Considerations & Reflection',
      order: 4,
      description: 'The Goldwater Rule, its counseling equivalents, and what public disclosure does and does not do.',
      estimatedTime: 22,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '4',
          title: 'Ethics, Cultural Considerations & Reflection',
          subtitle: 'The rule that made this course possible to teach at all' },

        { type: 'text', order: 2, content: `<h2>Course Summary</h2>
<p>Throughout this course, we have used Carrie Fisher's own account of her own diagnosis to teach material that has nothing to do with celebrity and everything to do with clinical competence: the DSM-5-TR criteria that separate mania from hypomania and both from major depression; the differential diagnosis questions that keep bipolar disorder from being missed, over-applied, or confused with ADHD, borderline personality disorder, or substance-induced presentations; the treatment sequence — mood stabilizer first, ECT reserved for what does not respond — that her own history illustrates cleanly; the informed-consent conversation that replaces media-shaped fear with an honest, specific account of modern ECT; and the diagnostic trap of a hypomanic episode a client reports as a good couple of weeks rather than a symptom. None of that required speculation about her. All of it required only her own words, applied carefully.</p>
<p>That is not incidental to the course. It is the point of the course. A clinician who can extract this much diagnostic and treatment substance from a public figure's <em>voluntary, repeated, self-authored</em> disclosure — without ever crossing into unauthorized clinical opinion — has learned something more durable than facts about bipolar disorder. They have learned where the line actually sits, which is different from where most clinicians assume it sits.</p>
<p>The throughline connecting Sections 2 and 3 is worth naming explicitly: diagnostic accuracy and treatment engagement are not separate skills. A clinician who can distinguish a hypomanic episode from a good week, and who can also explain ECT plainly enough to replace a client's inherited media fear with an honest picture of the actual procedure, is doing the same underlying work in both cases — meeting a client's distorted or incomplete picture of their own experience with something more accurate, delivered without judgment. Fisher's public record happens to be unusually well suited to teaching both halves of that work in a single course, because she narrated both the diagnosis and the treatment in her own specific, undramatized language.</p>` },

        { type: 'callout', order: 3, calloutType: 'key', title: 'When You Return to Practice on Monday',
          calloutItems: [
            'Ask structured mood-history questions of every client presenting with depression — not just the ones who seem like they might have "mood swings."',
            'When a client brings up a public figure’s disclosure, treat it as a bridge to their own material, not a detour to be redirected away from.',
            'When a client fears ECT, describe the actual modern procedure and its actual, honestly named side effects — reassurance without specifics does not address a specific fear.',
            'Before commenting publicly, professionally or personally, on any public figure’s mental health, ask whether you are drawing on their own words or filling in a gap with your own inference.',
          ]},

        { type: 'accordion', order: 4, title: 'Section Highlights', accordionItems: [
          { title: '1. Introduction & Clinical Framework', content: '<p>Established the sourcing standard this entire course and its series hold to — only Fisher’s own account is usable, never speculation about her — and introduced public self-disclosure as a clinical phenomenon with its own evidence base, distinct from disclosure that happens inside the therapy room.</p>' },
          { title: '2. Clinical Biography & Diagnostic Considerations', content: '<p>Mapped her own account of diagnosis at 24 onto DSM-5-TR criteria for manic, hypomanic, and major depressive episodes; worked through differential diagnosis against ADHD, borderline personality disorder, and substance-induced mood disorder; confronted common media myths with clinical reality; and examined treatment adherence complications specific to bipolar disorder, including the felt loss of elevated states that purely educational approaches often miss.</p>' },
          { title: '3. Treatment Planning & Clinical Application', content: '<p>Covered the treatment sequence her account describes, addressed access and cultural barriers that a single disclosure narrative does not resolve, built a specific informed-consent conversation for ECT that replaces media-shaped fear with honest detail, and applied a hypomania-detection framework to a composite clinical scenario and a structured response protocol for when a client raises a public figure’s disclosure in session.</p>' },
        ]},

        { type: 'keyTakeaway', order: 5, title: 'Course-Level Key Takeaways', takeaways: [
          'Bipolar I is diagnosed by the presence of at least one manic episode, distinguished from hypomania primarily by severity and duration, not symptom content.',
          'Diagnostic delay for bipolar disorder averages 6–8 years — structured, repeated mood-history questions are the primary tool for shortening it.',
          'ECT is an evidence-based, second-line-or-later treatment for severe or treatment-resistant depression, not a treatment of last resort in any punitive sense.',
          'Specific, repeated, first-person public disclosure measurably reduces stigma more effectively than general awareness messaging.',
          'The Goldwater Rule (APA, Section 7, Annotation 3) and its counseling equivalents (ACA C.6.c, E.5.d) prohibit a professional opinion about someone not personally examined — they do not prohibit teaching from what that person has said about themselves.',
          'A client’s reference to a public figure’s disclosure is clinical material about the client, not an invitation to discuss the public figure.',
        ]},

        { type: 'text', order: 6, content: `<h2>Ethical Practice Plan</h2>
<p>The provisions that make this course possible are the same ones that would make an irresponsible version of it a violation. The APA's Goldwater Rule (Principles of Medical Ethics with Annotations Especially Applicable to Psychiatry, Section 7, Annotation 3) prohibits offering a professional opinion about a public figure's mental state without personally examining them and obtaining authorization to discuss it. ACA's counseling equivalents — <strong>C.6.c</strong>, governing media presentations, and <strong>E.5.d</strong>, refraining from diagnosis of individuals not personally assessed — reach the same conclusion by a different route: a diagnosis belongs to an examination, not an inference from a distance.</p>
<p>None of these provisions prohibit using a person's own, voluntary, repeated public statements as teaching material — which is the only thing this course has done. The distinction is not subtle once it is named: <em>reporting what someone said about themselves</em> is categorically different from <em>rendering a clinical opinion about them</em>. Every clinician who discusses a public figure's mental health — in a classroom, in a waiting-room conversation, in a social media post — should be able to say, plainly, which of those two things they are doing.</p>
<p>A practical test worth carrying forward: before referencing any public figure's mental health in a professional context, ask whether the sentence you are about to say could be rewritten as a direct quotation or a citation to something that person actually said or a court actually recorded. If it can, you are teaching from disclosure. If it cannot — if the sentence requires you to fill in what you imagine is true, or to extend a documented fact into an undocumented interpretation — you have crossed from education into exactly the kind of unauthorized opinion the Goldwater Rule and its counseling equivalents exist to prevent. This test applies whether the public figure is alive or deceased; the rule does not expire with the person, because the harm it guards against — a professional lending unearned authority to speculation — does not depend on whether the subject can be harmed by hearing it.</p>
<p>Cultural humility belongs in this same practice plan. As Section 3 noted, a disclosure that reads as universally destigmatizing to one clinician may land very differently across the range of communities a caseload actually represents. Applying this course's content responsibly means treating Fisher's story as one useful example among many possible ones — not as a template that fits every client, and not as a substitute for asking a specific client what their own community's relationship to mental illness disclosure actually is.</p>
<p>Finally, hold this course's method as a template for evaluating any future public figure's disclosure you might consider bringing into your own practice or your own teaching. Ask the same four questions this course was built to answer for Fisher: Is the source her or his own voluntary account, not someone else's inference? Has the account been consistent over time, or would using it require ignoring a later revision? Does the material actually teach a transferable clinical concept, or does it only satisfy curiosity about a famous person? And can every sentence you plan to say be traced back to something that person actually said, rather than something you have filled in on their behalf? A course, a case presentation, or a single sentence in a session that passes all four is doing the same work this course has tried to model throughout.</p>` },

        { type: 'reflection', order: 7,
          question: 'Based on everything covered in this course, identify one specific change you will make in your clinical practice within the next 30 days — either in how you screen for hypomania, how you discuss ECT, or how you respond when a client raises a public figure’s mental health. Be as specific as you can about what you will actually do differently, with whom, and how you will know it happened.' },

        { type: 'resources', order: 8, resources: [
          { title: '988 Suicide & Crisis Lifeline', url: 'https://988lifeline.org', type: 'organization', description: 'Call or text 988 for immediate crisis support.' },
          { title: 'Depression and Bipolar Support Alliance (DBSA)', url: 'https://www.dbsalliance.org', type: 'organization', description: 'Peer-support and psychoeducation organization focused on mood disorders.' },
          { title: 'National Alliance on Mental Illness (NAMI)', url: 'https://www.nami.org', type: 'organization', description: 'Fisher received NAMI’s Purdy Award for her contribution to reducing stigma around mental illness.' },
          { title: 'Wishful Drinking (memoir)', url: 'https://www.simonandschuster.com/books/Wishful-Drinking/Carrie-Fisher/9781439153710', type: 'book', description: "Fisher's 2008 memoir, later adapted into a stage show and HBO documentary." },
        ]},

        { type: 'text', order: 9, content: `<div class="cr-references"><h2>References</h2>
<p class="cr-reference">American Psychiatric Association. (2022). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed., text rev.).</p>
<p class="cr-reference">American Psychiatric Association. (2013). <em>The principles of medical ethics with annotations especially applicable to psychiatry.</em></p>
<p class="cr-reference">American Counseling Association. (2014). <em>ACA code of ethics.</em></p>
<p class="cr-reference">Depression and Bipolar Support Alliance. (2023). <em>Bipolar disorder statistics.</em> DBSA.</p>
<p class="cr-reference">Fisher, C. (2008). <em>Wishful drinking.</em> Simon & Schuster.</p>
<p class="cr-reference">Fisher, C. (2011). <em>Shockaholic.</em> Simon & Schuster.</p>
<p class="cr-reference">Fisher, C. (2016). <em>The princess diarist.</em> Blue Rider Press.</p>
<p class="cr-reference">Ghaziuddin, N., et al. (2021). Electroconvulsive therapy for treatment-resistant depression: A review of efficacy and safety. <em>Journal of ECT, 37</em>(2), 71–79.</p>
<p class="cr-reference">Goodwin, F. K., & Jamison, K. R. (2007). <em>Manic-depressive illness: Bipolar disorders and recurrent depression</em> (2nd ed.). Oxford University Press.</p>
<p class="cr-reference">Hirschfeld, R. M. A., et al. (2003). Delay and misdiagnosis in bipolar disorder: A survey of patients. <em>Journal of Clinical Psychiatry, 64</em>(2), 161–174.</p>
<p class="cr-reference">National Alliance on Mental Illness. (2017). Carrie Fisher’s "bipolar incident" shows progress in fighting stigma. NAMI.</p>
<p class="cr-reference">National Institute of Mental Health. (2024). <em>Bipolar disorder</em>. NIMH Statistics.</p>
<p class="cr-reference">Niederkrotenthaler, T., et al. (2010). Role of media reports in completed and prevented suicide: Werther v. Papageno effects. <em>British Journal of Psychiatry, 197</em>(3), 234–243.</p>
<p class="cr-reference">Semkovska, M., & McLoughlin, D. M. (2010). Objective cognitive performance associated with electroconvulsive therapy for depression: A systematic review and meta-analysis. <em>Biological Psychiatry, 68</em>(6), 568–577.</p>
<p class="cr-reference">Substance Abuse and Mental Health Services Administration. (2023). <em>Key substance use and mental health indicators in the United States: 2022 NSDUH.</em> SAMHSA.</p>
</div>` },
      ],
    },
  ],

  assessment: {
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      { sectionIndex: 0, question: 'This course’s clinical-biography content about Carrie Fisher is sourced from:',
        options: [
          { text: 'Unauthorized biographies and press reporting', isCorrect: false },
          { text: 'Her own memoirs, documentary, and on-the-record interviews', isCorrect: true },
          { text: 'The clinical inference of the course author', isCorrect: false },
          { text: 'Social media speculation at the time of her death', isCorrect: false },
        ], correctAnswer: 1, explanation: 'The course uses only Fisher’s own published, self-authored account of her experience.' },
      { sectionIndex: 0, question: 'Research on celebrity mental health disclosure finds that stigma reduction is most strongly associated with disclosures that are:',
        options: [
          { text: 'Vague and general, avoiding specific diagnostic language', isCorrect: false },
          { text: 'Specific, repeated, and framed around ongoing management rather than crisis alone', isCorrect: true },
          { text: 'Made only once, under external pressure, and never revisited', isCorrect: false },
          { text: 'Delivered exclusively through scripted public service announcements', isCorrect: false },
        ], correctAnswer: 1, explanation: 'Specific, repeated, first-person accounts framed around management — the Papageno pattern discussed in Section 1 — reduce stigma more effectively than general awareness messaging.' },
      { sectionIndex: 1, question: 'Fisher publicly dated her diagnosis to what age?',
        options: [
          { text: 'Eighteen', isCorrect: false },
          { text: 'Twenty-four', isCorrect: true },
          { text: 'Thirty-two', isCorrect: false },
          { text: 'Forty', isCorrect: false },
        ], correctAnswer: 1, explanation: 'She described being diagnosed at 24, using the era-appropriate term "manic depression."' },
      { sectionIndex: 1, question: 'A manic episode, per DSM-5-TR, requires a minimum duration of:',
        options: [
          { text: 'One day', isCorrect: false },
          { text: 'Four consecutive days', isCorrect: false },
          { text: 'One week (or any duration if hospitalization is required)', isCorrect: true },
          { text: 'One month', isCorrect: false },
        ], correctAnswer: 2, explanation: 'One week minimum, or any duration if the episode requires hospitalization.' },
      { sectionIndex: 1, question: 'A hypomanic episode is primarily distinguished from a manic episode by:',
        options: [
          { text: 'The presence of irritability instead of elevated mood', isCorrect: false },
          { text: 'A shorter minimum duration and the absence of marked impairment, hospitalization, or psychotic features', isCorrect: true },
          { text: 'Occurring only in Bipolar I Disorder', isCorrect: false },
          { text: 'Requiring a co-occurring depressive episode to be diagnosed', isCorrect: false },
        ], correctAnswer: 1, explanation: 'Duration (4 days vs. 1 week) and severity of impairment are the key distinctions, not symptom content.' },
      { sectionIndex: 1, question: 'A major depressive episode requires a minimum of how many symptoms, for how long?',
        options: [
          { text: 'Three symptoms for one week', isCorrect: false },
          { text: 'Five symptoms for two weeks', isCorrect: true },
          { text: 'Seven symptoms for one month', isCorrect: false },
          { text: 'Two symptoms for six months', isCorrect: false },
        ], correctAnswer: 1, explanation: 'Five or more symptoms, present for at least two weeks, representing a change from baseline.' },
      { sectionIndex: 1, question: 'Which of the following is a persistent media myth about bipolar disorder that Fisher’s own account contradicts?',
        options: [
          { text: 'That people with bipolar disorder cannot sustain long-term employment', isCorrect: true },
          { text: 'That bipolar disorder involves depressive episodes', isCorrect: false },
          { text: 'That bipolar disorder can be treated with medication', isCorrect: false },
          { text: 'That bipolar disorder is a recognized psychiatric diagnosis', isCorrect: false },
        ], correctAnswer: 0, explanation: 'Fisher worked continuously for decades post-diagnosis, publicly attributing her stability to consistent treatment.' },
      { sectionIndex: 1, question: 'Average diagnostic delay for bipolar disorder, from symptom onset to accurate diagnosis, is approximately:',
        options: [
          { text: 'Less than one year', isCorrect: false },
          { text: 'One to two years', isCorrect: false },
          { text: 'Six to eight years', isCorrect: true },
          { text: 'Fifteen to twenty years', isCorrect: false },
        ], correctAnswer: 2, explanation: 'Research consistently finds a 6–8 year average delay, often including incorrect diagnoses.' },
      { sectionIndex: 2, question: 'Per standard treatment guidelines and reflected in Fisher’s own account, ECT is typically considered:',
        options: [
          { text: 'A first-line treatment for any depressive episode', isCorrect: false },
          { text: 'After other treatments, for severe or treatment-resistant depression', isCorrect: true },
          { text: 'Only for bipolar mania, never for depression', isCorrect: false },
          { text: 'A purely historical treatment no longer in clinical use', isCorrect: false },
        ], correctAnswer: 1, explanation: 'ECT remains in active clinical use, reserved for severe or treatment-resistant presentations.' },
      { sectionIndex: 2, question: 'Modern ECT is administered:',
        options: [
          { text: 'Without anesthesia, as depicted in older films', isCorrect: false },
          { text: 'Under general anesthesia with a muscle relaxant and continuous monitoring', isCorrect: true },
          { text: 'Only in emergency rooms without scheduling', isCorrect: false },
          { text: 'As a self-administered outpatient procedure', isCorrect: false },
        ], correctAnswer: 1, explanation: 'This is the modern standard of care, consistent with Fisher’s own description to Oprah.' },
      { sectionIndex: 2, question: 'The most consistently documented side effect of ECT is:',
        options: [
          { text: 'Permanent loss of long-term memory from years prior to treatment', isCorrect: false },
          { text: 'Short-term memory disturbance around the treatment period, typically improving over subsequent weeks', isCorrect: true },
          { text: 'Permanent cognitive impairment in the majority of patients', isCorrect: false },
          { text: 'No documented side effects', isCorrect: false },
        ], correctAnswer: 1, explanation: 'This matches Fisher’s own description of "losing the month" around her first course of treatment.' },
      { sectionIndex: 2, question: 'In the composite scenario, what clinical error was narrowly avoided by asking structured follow-up questions about the client’s "good couple of weeks"?',
        options: [
          { text: 'Missing a substance use disorder', isCorrect: false },
          { text: 'Treating an unrecognized bipolar presentation with an antidepressant alone, risking treatment-emergent mania', isCorrect: true },
          { text: 'Failing to refer the client for medical evaluation', isCorrect: false },
          { text: 'Over-diagnosing a personality disorder', isCorrect: false },
        ], correctAnswer: 1, explanation: 'This is exactly what unfolds down the "proceed_depression" branch of the scenario.' },
      { sectionIndex: 2, question: 'When a client brings up a public figure’s mental health disclosure, the recommended first clinical step is to:',
        options: [
          { text: 'Redirect immediately away from the topic', isCorrect: false },
          { text: 'Ask what specifically the client took from the account, rather than assuming', isCorrect: true },
          { text: 'Offer your own opinion of the public figure’s diagnosis', isCorrect: false },
          { text: 'End the discussion and note it as an inappropriate topic', isCorrect: false },
        ], correctAnswer: 1, explanation: 'The goal is to find out what the client is using the disclosure to say about themselves.' },
      { sectionIndex: 3, question: 'The Goldwater Rule specifically prohibits:',
        options: [
          { text: 'Ever discussing a public figure in a clinical or educational context', isCorrect: false },
          { text: 'Offering a professional opinion about a public figure’s mental state without examining them and obtaining authorization', isCorrect: true },
          { text: 'Public figures disclosing their own mental health history', isCorrect: false },
          { text: 'Teaching diagnostic criteria using any real-world example', isCorrect: false },
        ], correctAnswer: 1, explanation: 'It prohibits unauthorized professional opinion from a distance — not education drawn from a person’s own disclosure.' },
      { sectionIndex: 3, question: 'ACA Code of Ethics section E.5.d addresses:',
        options: [
          { text: 'Informed consent for telehealth services', isCorrect: false },
          { text: 'Refraining from diagnosis of individuals not personally assessed', isCorrect: true },
          { text: 'Mandatory reporting obligations', isCorrect: false },
          { text: 'Fee-setting and billing practices', isCorrect: false },
        ], correctAnswer: 1, explanation: 'E.5.d is the ACA counterpart to the Goldwater Rule’s prohibition on diagnosing from a distance.' },
      { sectionIndex: 3, question: 'What distinguishes this course’s use of Carrie Fisher’s biography from a Goldwater Rule violation?',
        options: [
          { text: 'Nothing — using any public figure’s mental health history in CE content is a violation', isCorrect: false },
          { text: 'The course reports what she said about her own experience rather than rendering a clinical opinion about her', isCorrect: true },
          { text: 'The course was written by a licensed clinician, which exempts it from the rule', isCorrect: false },
          { text: 'The Goldwater Rule does not apply because Fisher is deceased', isCorrect: false },
        ], correctAnswer: 1, explanation: 'Reporting a person’s own words is categorically different from offering a professional opinion about them.' },
    ],
  },

  references: [
    { author: 'American Psychiatric Association', year: 2022, title: 'Diagnostic and statistical manual of mental disorders (5th ed., text rev.)', source: 'American Psychiatric Association Publishing' },
    { author: 'American Psychiatric Association', year: 2013, title: 'The principles of medical ethics with annotations especially applicable to psychiatry', source: 'American Psychiatric Association' },
    { author: 'American Counseling Association', year: 2014, title: 'ACA code of ethics', source: 'American Counseling Association' },
    { author: 'Depression and Bipolar Support Alliance', year: 2023, title: 'Bipolar disorder statistics', source: 'DBSA' },
    { author: 'Fisher, C.', year: 2008, title: 'Wishful drinking', source: 'Simon & Schuster' },
    { author: 'Fisher, C.', year: 2011, title: 'Shockaholic', source: 'Simon & Schuster' },
    { author: 'Fisher, C.', year: 2016, title: 'The princess diarist', source: 'Blue Rider Press' },
    { author: 'Ghaziuddin, N., et al.', year: 2021, title: 'Electroconvulsive therapy for treatment-resistant depression: A review of efficacy and safety', source: 'Journal of ECT, 37(2), 71–79' },
    { author: 'Goodwin, F. K., & Jamison, K. R.', year: 2007, title: 'Manic-depressive illness: Bipolar disorders and recurrent depression (2nd ed.)', source: 'Oxford University Press' },
    { author: 'Hirschfeld, R. M. A., et al.', year: 2003, title: 'Delay and misdiagnosis in bipolar disorder: A survey of patients', source: 'Journal of Clinical Psychiatry, 64(2), 161–174' },
    { author: 'National Alliance on Mental Illness', year: 2017, title: 'Carrie Fisher’s "bipolar incident" shows progress in fighting stigma', source: 'NAMI' },
    { author: 'National Institute of Mental Health', year: 2024, title: 'Bipolar disorder', source: 'NIMH Statistics' },
    { author: 'Niederkrotenthaler, T., et al.', year: 2010, title: 'Role of media reports in completed and prevented suicide: Werther v. Papageno effects', source: 'British Journal of Psychiatry, 197(3), 234–243' },
    { author: 'Semkovska, M., & McLoughlin, D. M.', year: 2010, title: 'Objective cognitive performance associated with electroconvulsive therapy for depression: A systematic review and meta-analysis', source: 'Biological Psychiatry, 68(6), 568–577' },
    { author: 'Substance Abuse and Mental Health Services Administration', year: 2023, title: 'Key substance use and mental health indicators in the United States: 2022 NSDUH', source: 'SAMHSA' },
  ],
};

export default COURSE;

async function seed() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  let doc = await Course.findOne({ slug: COURSE.slug });
  if (doc) { doc.set(COURSE); console.log('Updating existing:', COURSE.slug); }
  else { doc = new Course(COURSE); console.log('Inserting new:', COURSE.slug); }
  await doc.save();
  console.log(`Saved ${doc.courseCode} — wordCount=${doc.wordCount}`);
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error(e.message); process.exit(1); });
}
