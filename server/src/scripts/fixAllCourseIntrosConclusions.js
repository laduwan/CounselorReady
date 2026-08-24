/**
 * fixAllCourseIntrosConclusions.js
 *
 * Comprehensive patch for all 55 courses flagged by auditIntrosConclusions.js:
 *   - description too short / equals title
 *   - intro:0w (no text block in first section)
 *   - conclusion:0w (no text block in last section)
 *
 * Bullet-heavy courses (CR-418, CR-419, CR-406) are flagged but content
 * restructuring is handled in a separate pass.
 *
 * Uses raw updateOne/$set — never .save()
 *
 * Usage:
 *   node src/scripts/fixAllCourseIntrosConclusions.js          # dry-run
 *   node src/scripts/fixAllCourseIntrosConclusions.js --apply  # write
 *
 * Run from: ~/project/src/server (Render shell)
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

function stripHtml(h) { return (h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function wordCount(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
function isWeakDesc(d, t) {
  const dc = (d||'').trim(); const tc = (t||'').trim();
  return !dc || dc.toLowerCase() === tc.toLowerCase() || wordCount(stripHtml(dc)) < 60;
}

// ── PATCH CATALOGUE ─────────────────────────────────────────────────────────
// Each entry: { slug, description?, intro?, conclusion? }
// intro/conclusion are HTML strings inserted as text blocks.
// Omit a key to leave that field untouched.

const PATCHES = [

  // ── PUBLISHED: description = title ───────────────────────────────────────

  {
    slug: 'walking-on-eggshells-high-conflict-clients',
    description: `High-conflict and emotionally dysregulated clients test every skill a clinician has developed — and expose the limits of every technique they were trained on. This 3-hour continuing education course prepares licensed mental health professionals to work effectively with clients who present with chronic emotional dysregulation, interpersonal conflict, splitting, and rage responses that destabilize the therapeutic relationship. Drawing on DBT principles, attachment theory, and neuroscience of emotional dysregulation, you will learn to maintain therapeutic presence under relational pressure, use validation without reinforcing destructive patterns, manage rupture and repair cycles productively, and set limits that are both clinically sound and relationally grounded. The course addresses the clinician's own countertransference responses to high-conflict presentations — often the deciding factor in whether treatment continues or collapses.`,
    intro: `<h2>When the Room Feels Like a War Zone</h2><p>Every clinician carries a handful of cases that changed how they understand the work — and most of them involve clients who were, at some point, described as "difficult." The client who threatened to file a complaint after you set a limit. The one who left a session screaming and called back an hour later in crisis. The one who idealized you for three months and then turned on you without warning. These presentations are not failures of clinical skill. They are the clinical challenge that demands the most from everything you know.</p><p>This course is built for those moments. It will give you frameworks for understanding what is actually happening neurobiologically and relationally when a client dysregulates in session, language for staying regulated yourself when the emotional temperature rises, and specific tools for working with the patterns — splitting, push-pull, emotional flooding, interpersonal aggression — that define high-conflict presentations. The goal is not to manage these clients from a safe distance but to be present with them in a way that is genuinely therapeutic.</p>`,
  },

  {
    slug: 'the-elephant-in-the-room-navigating-difficult-conversations-in-therapy',
    description: `The conversations that matter most in therapy are often the ones clinicians avoid the most — confronting a client's self-destructive pattern, naming a rupture in the therapeutic relationship, addressing cultural or identity differences that are shaping the work, delivering difficult feedback about a client's progress, or raising concerns about safety. This 3-hour continuing education course provides a structured, evidence-based framework for approaching the conversations that define clinical competence. You will learn to identify your own avoidance patterns, use skillful directness without damaging the alliance, navigate rupture-repair cycles as therapeutic opportunities, and address the high-stakes conversations — suicide risk, substance use, trauma disclosure, therapeutic impasse — that require both courage and precision. Applicable across treatment modalities and client populations.`,
    intro: `<h2>The Conversation You've Been Avoiding</h2><p>There is a conversation happening in almost every therapy session that nobody is talking about directly. The client who keeps canceling and both of you pretend it isn't a pattern. The rupture from three sessions ago that smoothed over but never actually healed. The self-destructive behavior that the clinician has documented in every progress note but never named in the room. The difference in cultural background or life experience that is quietly shaping every exchange but has never been acknowledged. These are the elephants.</p><p>This course is about learning to see them, name them, and work with them — because the avoided conversation is almost always the most important one. The evidence on therapeutic outcomes is clear: clinicians who can initiate and sustain difficult conversations produce better outcomes, stronger alliances, and more durable change. The skill is learnable. What gets in the way is rarely ignorance of technique — it is the clinician's own discomfort with conflict, difference, or the risk of getting it wrong.</p>`,
  },

  {
    slug: 'inside-out-neurobiology-of-trauma',
    description: `When clinicians understand what trauma does to the brain, they stop fighting the symptom and start working with the biology. This 3-hour continuing education course translates contemporary trauma neuroscience into direct clinical application — covering the neurobiological mechanisms of traumatic memory encoding, the role of the amygdala, hippocampus, and prefrontal cortex in trauma responses, polyvagal theory and its implications for safety and connection, the window of tolerance framework, and why traditional talk therapy alone is often insufficient for trauma resolution. You will leave with a neuroscience-informed understanding of why trauma presentations look the way they do, why standard cognitive interventions often fail with highly traumatized clients, and what evidence-based approaches — somatic, relational, and cognitive — align with the brain's actual healing mechanisms.`,
  },

  {
    slug: 'trauma-informed-care-ptsd',
    description: `Trauma is the most common presenting concern across virtually every clinical population, yet most clinicians received limited training in evidence-based trauma treatment during their graduate preparation. This 3-hour continuing education course provides a rigorous foundation in trauma-informed care and PTSD treatment — covering diagnostic criteria and presentation, the neurobiology of traumatic stress, evidence-based treatment modalities including CPT, PE, and EMDR, trauma-informed assessment approaches, working with complex PTSD and developmental trauma, and the specific adaptations required for trauma treatment across diverse populations. You will also examine the therapeutic relationship as a healing mechanism in trauma work, vicarious traumatization and its prevention, and the integration of trauma-informed principles into your existing clinical practice regardless of your theoretical orientation.`,
  },

  {
    slug: 'elephant-in-the-room-difficult-conversations',
    description: `The therapeutic relationship is built in the ordinary moments of clinical work — and tested in the difficult ones. This 3-hour continuing education course equips licensed mental health professionals with the skills and frameworks to navigate the conversations that most clinicians find themselves avoiding: addressing therapeutic ruptures, raising concerns about client safety, naming cultural differences that are affecting the work, confronting patterns of avoidance or resistance, delivering honest feedback, and initiating conversations about therapeutic progress and goals. Drawing on research in alliance rupture and repair, motivational interviewing, and relational psychotherapy, the course provides both theoretical grounding and practical language for the high-stakes exchanges that separate adequate therapy from genuinely transformative care.`,
    intro: `<h2>Saying What Needs to Be Said</h2><p>Clinical training prepares counselors for the work of therapy — building rapport, assessing clients, formulating cases, delivering interventions. What it prepares them less well for is the meta-level of the work: the moments when the therapeutic relationship itself becomes the clinical problem that needs addressing. When the client has been making a decision the clinician believes is harmful and neither of them has named it. When something shifted three sessions ago and the work has felt slightly off ever since. When the demographic or cultural difference between clinician and client is visibly shaping the conversation but no one has acknowledged it.</p><p>These are the conversations that determine whether therapy works. Research on therapeutic alliance consistently shows that the ability to address ruptures — not the absence of ruptures — is what predicts outcome. This course builds the skill of turning toward the difficult conversation rather than away from it, with the clinical precision and relational care the moment requires.</p>`,
    conclusion: `<h2>Taking This Into Every Session</h2><p>The skill you leave this course with is not a technique — it is a stance. The willingness to stay curious when a client becomes defensive, to name what you observe without condemning what you see, to hold a rupture long enough for it to become a repair rather than collapsing it prematurely into reassurance. These are the moments that define clinical work at its most meaningful.</p><p>Your own discomfort is your most reliable signal. When you notice the impulse to change the subject, soften the observation, or wait until next session — that is precisely when the conversation needs to happen. The clients who challenge you most are often the ones most in need of a clinician who will not flinch. That steadiness, practiced deliberately, becomes one of the most powerful therapeutic tools you carry.</p>`,
  },

  {
    slug: 'it-takes-a-village-collaborative-care',
    intro: `<h2>No Clinician Is an Island</h2><p>The solo practitioner model — one clinician, one client, a sealed room — has never matched the clinical reality of the clients most in need of care. Complex presentations involving trauma, substance use, chronic medical conditions, housing instability, involvement with the legal system, or co-occurring mental health conditions require coordinated responses that no single provider can deliver. Yet most graduate training focuses almost entirely on the dyadic relationship and provides minimal preparation for the collaborative, systems-level thinking that effective care requires.</p><p>This course corrects that gap. It builds the frameworks, skills, and ethical grounding for consultation, referral, and collaborative care that allow clinicians to serve as effective members of care teams — and as effective advocates for clients navigating fragmented systems. The goal is not to minimize the importance of the individual therapeutic relationship but to extend its reach into the larger web of resources, providers, and systems that shape your clients' lives.</p>`,
  },

  {
    slug: 'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities',
    intro: `<h2>Complexity Is the Rule, Not the Exception</h2><p>The client who presents with a single, uncomplicated problem — one diagnosis, one stressor, no complicating history, full social support, good insight, and sufficient resources — is the exception in clinical practice, not the rule. The actual caseloads of working clinicians are filled with complexity: depression that is also grief that is also trauma that is also chronic pain. Anxiety that lives in a context of housing instability, domestic conflict, and a childhood that made the present dangerous. Substance use that is both the problem and the solution to a problem the client hasn't named yet.</p><p>This course teaches clinicians to work with complexity rather than trying to reduce it. It builds a clinical framework for case conceptualization that holds multiple stressors, multiple diagnoses, and multiple treatment needs simultaneously — without losing sight of the person at the center of all of it.</p>`,
  },

  // ── PUBLISHED: description < 60 words ─────────────────────────────────────

  {
    slug: 'neurobiology-of-trauma',
    description: `Trauma does not live only in memory — it lives in the body, the nervous system, and the brain structures that regulate safety, emotion, and meaning. This 4-hour continuing education course provides an in-depth examination of the neurobiological mechanisms underlying traumatic stress, covering the polyvagal theory, the role of the amygdala and hippocampus in traumatic memory, stress response systems, developmental trauma and its impact on brain architecture, and the neuroscience of trauma recovery. Clinical application is woven throughout: you will understand why hypervigilance persists long after the threat is gone, why cognitive approaches alone are often insufficient, and what the evidence tells us about which interventions align with the brain's actual healing pathways. Essential preparation for any clinician working with trauma-exposed populations.`,
  },

  {
    slug: 'mindfulness-introduction',
    description: `Mindfulness has moved from the meditation cushion into the clinical office — and the research supporting its integration into mental health treatment is now substantial. This 1-hour continuing education course provides licensed mental health professionals with a rigorous, evidence-based foundation in mindfulness as a clinical tool: what it is, what the research demonstrates, how it applies across presenting concerns including anxiety, depression, trauma, and chronic pain, and how to introduce it skillfully with diverse clients. You will learn the core practices — breath awareness, body scan, open monitoring — and their specific clinical mechanisms, as well as how to address common barriers clients raise and how to adapt mindfulness instruction for clients with trauma histories. Practical from start to finish.`,
  },

  {
    slug: 'psychiatric-medications-basics',
    description: `Mental health professionals who understand psychopharmacology collaborate more effectively with prescribers, support clients in making informed treatment decisions, and recognize medication-related clinical presentations that require coordination or referral. This 2-hour continuing education course provides non-prescribing clinicians with a working knowledge of psychiatric medications — covering the major classes of psychotropic drugs (antidepressants, anxiolytics, antipsychotics, mood stabilizers, stimulants), their mechanisms of action, clinical indications, side effect profiles, and common clinical concerns including discontinuation syndromes and medication interactions. The course emphasizes practical application: what clinicians need to know to have productive conversations with clients about their medications, when to initiate contact with prescribers, and how to document medication-related clinical observations.`,
  },

  {
    slug: 'cultural-humility-clinical-practice',
    description: `Cultural competence has long been the standard framework for multicultural training in counseling, but the research on effective cross-cultural practice increasingly points to a different construct: cultural humility — an ongoing orientation of curiosity, self-reflection, and openness to learning from clients about their own cultural experience. This 3-hour continuing education course examines the distinction between competence and humility, the evidence base for culturally humble practice, and the specific skills and dispositions that characterize clinicians who work effectively across cultural difference. You will explore implicit bias and its clinical effects, power dynamics in the therapeutic relationship, culturally adapted treatment approaches, and the practice of cultural self-examination — understanding how your own cultural background shapes your clinical assumptions and blind spots.`,
  },

  {
    slug: 'small-warriors-big-battles-parental-incarceration',
    description: `An estimated 2.7 million American children have a parent who is currently incarcerated — a population whose psychological needs are largely invisible to the systems designed to serve them. This 2-hour continuing education course prepares mental health professionals to provide informed, evidence-based care to children navigating the complex experience of parental incarceration: the ambiguous loss of a parent who is alive but absent, the attachment disruptions that accompany family separation, the developmental impacts across childhood stages, and the evidence-based interventions — Child-Parent Psychotherapy, trauma-informed school approaches, caregiver support — that make a measurable difference. Clinical considerations for working with incarcerated parents, caregiving relatives, and child welfare systems are addressed throughout.`,
  },

  {
    slug: 'beyond-the-uniform-first-responder-families',
    description: `First responders — law enforcement, firefighters, emergency medical personnel, military — face occupational stressors that create distinctive mental health profiles in both the individual and the family system. This 2-hour continuing education course prepares mental health professionals to provide culturally responsive care to first responder families: understanding the occupational culture and its barriers to help-seeking, the specific psychological impacts of shift work, hypervigilance spillover, cumulative exposure to trauma and death, moral injury, and the relational patterns that emerge in families organized around high-risk work. Treatment adaptations, assessment approaches tailored to this population, and strategies for building trust with clients who are often deeply skeptical of mental health services are covered in clinical depth.`,
  },

  {
    slug: 'cultural-competence-ethics-risk-reduction-cr601',
    description: `The intersection of cultural competence and ethical practice is not incidental — it is where the most consequential clinical decisions are made. This 3-hour continuing education course provides a rigorous examination of the ethical obligations that govern cross-cultural practice, the risk management implications of cultural competence failures, and the practical skills for providing ethical, culturally grounded care to diverse client populations. Drawing on the ACA Code of Ethics, NBCC standards, and the growing research base on cultural adaptation of evidence-based treatments, you will develop fluency in identifying cultural factors that affect diagnosis, treatment planning, informed consent, and the therapeutic relationship — and in managing the ethical complexities that arise when cultural values and professional standards intersect.`,
  },

  {
    slug: 'trauma-informed-care-foundations',
    description: `Trauma is not a specialty — it is a context that shapes every clinical encounter. This 3-hour continuing education course provides licensed mental health professionals with a rigorous foundation in trauma-informed care: the neurobiology of traumatic stress, the prevalence and impact of adverse childhood experiences, the six principles of trauma-informed care (safety, trustworthiness, peer support, collaboration, empowerment, cultural sensitivity), trauma-informed assessment approaches, and the specific clinical adaptations that transform standard interventions into genuinely trauma-responsive care. The course addresses the difference between trauma-specific treatment and trauma-informed practice — and why every clinician working in mental health, regardless of specialty, needs both. Includes attention to secondary traumatic stress and organizational trauma-informed systems.`,
  },

  {
    slug: 'beautiful-mind',
    description: `Serious mental illness — schizophrenia, schizoaffective disorder, bipolar disorder with psychotic features — affects an estimated 13 million Americans and remains one of the most undertreated and misunderstood presentations in mental health practice. This 1-hour continuing education course examines the clinical realities of serious mental illness beyond diagnostic labels: the neurobiological foundations of psychotic disorders, evidence-based treatment approaches including coordinated specialty care and supported employment, the clinician's role in a collaborative treatment team, the therapeutic relationship with clients who may have limited insight into their illness, and the ethical dimensions of working with clients who face significant stigma and systemic barriers to care. Essential context for any clinician who encounters serious mental illness in their practice.`,
  },

  {
    slug: 'black-swan',
    description: `Perfectionism and clinical anxiety exist on a spectrum from adaptive striving to a level of rigidity that is genuinely disabling — and clinicians who cannot distinguish between them miss the treatment target. This 1-hour continuing education course provides a clinical examination of perfectionism as a transdiagnostic process underlying anxiety disorders, OCD spectrum presentations, eating disorders, and depression. You will learn to assess perfectionism dimensionally, understand its developmental roots and maintenance mechanisms, and apply evidence-based interventions — cognitive restructuring, behavioral experiments, self-compassion approaches — that address the specific cognitive and behavioral patterns driving perfectionist anxiety. The film Black Swan provides a compelling clinical illustration throughout.`,
    intro: `<h2>The Pursuit That Never Arrives</h2><p>Perfectionism wears many clinical masks. It appears as the client who can't submit the project because it isn't finished yet — and won't ever be. As the student who studies twenty hours for an exam and still fears failure. As the executive who has built a successful career and lives in daily terror of being exposed as a fraud. As the athlete whose performance anxiety has become so severe that the sport that once brought joy now brings only dread. What these presentations share is a cognitive and motivational structure in which standards are set impossibly high, failure is experienced as catastrophic, and success provides only momentary relief before the bar rises again.</p><p>This course builds the clinical framework for understanding that structure, assessing it accurately, and intervening effectively — with attention to the specific presentations where perfectionism is most likely to drive the clinical picture.</p>`,
  },

  {
    slug: 'ordinary-people',
    description: `Grief and family systems interact in ways that are often invisible until the pressure becomes unbearable — and understanding that interaction is essential for effective clinical work with bereaved families. This 1-hour continuing education course uses the Jarrett family's story in the film Ordinary People as a clinical lens for examining how grief disrupts family homeostasis, activates attachment systems, generates conflict where there was previously cohesion, and demands adaptive responses that families are often not equipped to make. You will apply Bowen family systems theory, attachment-based approaches to grief, and current research on complicated grief and family resilience to a rich, clinically instructive case study. Applicable for clinicians working with individuals, couples, and families navigating loss.`,
  },

  {
    slug: 'sixth-sense',
    description: `Clinical intuition is real, it is research-supported, and it is trainable — yet most clinicians neither understand its mechanisms nor use it deliberately. This 1-hour continuing education course examines the neuroscience and psychology of clinical intuition: how pattern recognition, somatic awareness, and implicit learning combine to produce the clinical hunches that experienced practitioners rely on, when to trust them, when they are contaminated by bias, and how to develop them more deliberately through reflective practice and supervised experience. The course uses the film The Sixth Sense as a frame for exploring the clinical themes of hidden perception, unspoken communication, and the revelation that changes the meaning of everything that came before — a resonant metaphor for the moments of clinical insight that transform a case.`,
  },

  {
    slug: 'sexual-health-across-the-lifespan',
    description: `Sexual health is a dimension of wellbeing that clients rarely raise spontaneously — and that clinicians rarely ask about, despite its profound impact on relationships, identity, self-concept, and overall mental health. This 3-hour continuing education course prepares mental health professionals to integrate sexual health assessment and psychoeducation into clinical practice across the lifespan: understanding sexual development from childhood through late adulthood, conducting respectful and trauma-informed sexual health histories, addressing common sexual concerns presenting in a mental health context, and providing evidenced-based psychoeducation about sexual functioning, consent, and healthy sexuality. The course addresses cultural, religious, and gender dimensions of sexuality and provides frameworks for working with sexual health concerns in diverse client populations.`,
  },

  {
    slug: 'sexuality-identity-mental-health-lgbtq',
    description: `LGBTQ+ clients enter the therapy room carrying the psychological weight of minority stress — chronic exposure to stigma, discrimination, rejection, and the ongoing labor of navigating a world that did not design itself around their existence. This 3-hour continuing education course prepares mental health professionals to provide affirming, evidence-based care to LGBTQ+ clients: understanding minority stress theory and its mental health implications, the specific clinical presentations common in LGBTQ+ populations, affirming therapeutic frameworks that support rather than pathologize sexual and gender identity, cultural considerations across LGBTQ+ sub-communities, and the intersection of sexual orientation and gender identity with race, religion, family systems, and developmental stage. Applicable for clinicians across treatment settings and client populations.`,
  },

  {
    slug: 'sexual-trauma-assessment-treatment',
    description: `Sexual trauma affects approximately one in six women and one in thirty-three men in the United States — making it one of the most prevalent trauma histories in any clinical caseload. This 3-hour continuing education course provides mental health professionals with a comprehensive clinical foundation in sexual trauma: understanding the spectrum of sexual violence and its psychological impact, conducting trauma-informed sexual trauma assessments, evidence-based treatment approaches including CPT, PE, and trauma-focused CBT adapted for sexual trauma, working with shame and self-blame that are nearly universal in this population, managing disclosure and mandatory reporting obligations, and addressing the specific treatment adaptations required for clients with complex trauma histories. Includes attention to male survivors, LGBTQ+ survivors, and survivors from culturally diverse backgrounds.`,
  },

  {
    slug: 'sex-therapy-foundations',
    description: `Sexual concerns are among the most common presenting problems in couples counseling and are frequently disclosed — or deliberately not disclosed — in individual therapy. Yet most mental health professionals receive minimal training in sexual health clinical practice during graduate preparation. This 3-hour continuing education course provides a rigorous foundation in sex therapy: the major models of sexual functioning and dysfunction, evidence-based assessment of sexual concerns, the most common sexual dysfunctions encountered in clinical practice and their evidence-based treatments, the intersection of sexual health with mental health and relationship functioning, and the ethical and professional boundaries that govern sexual health counseling. Designed for mental health professionals who want to be more clinically effective with the sexual concerns their clients are already bringing — or not bringing — to session.`,
  },

  {
    slug: 'moral-injury-counselors',
    description: `Moral injury — the psychological damage that results from perpetrating, witnessing, or failing to prevent events that violate one's deeply held moral beliefs — is increasingly recognized as a distinct clinical entity that requires targeted assessment and treatment. This 2-hour continuing education course prepares mental health professionals to identify and treat moral injury across the populations where it most commonly presents: military veterans and active-duty personnel, healthcare workers, first responders, correction officers, social workers, and mental health professionals themselves. You will learn to distinguish moral injury from PTSD, conduct moral injury-informed clinical assessments, and apply evidence-based interventions including Adaptive Disclosure Therapy, ACT-based approaches, and forgiveness-based frameworks. The course also addresses the ethical obligations and self-care strategies relevant to clinicians experiencing moral injury in their own professional lives.`,
    intro: `<h2>The Wound That Doesn't Fit the Diagnosis</h2><p>Mental health professionals frequently encounter clients who describe a particular kind of suffering that resists standard diagnostic categories. The combat veteran whose actions were lawful but who cannot stop replaying a moment that felt deeply wrong. The ICU nurse who made a medically defensible triage decision during a crisis and has not forgiven herself since. The school counselor constrained by institutional policy from protecting a child she believed was in danger. The corrections officer who followed orders he found morally intolerable and now cannot recognize himself.</p><p>What these clients share is not primarily a fear response or the hyperarousal and avoidance of PTSD. It is something older and in many ways more existentially destabilizing: a wound to the moral self. They have experienced events that violated their deepest convictions about right and wrong, about who they are and who the world is supposed to be. This is moral injury — and it requires a clinical response that PTSD frameworks alone cannot provide.</p>`,
    conclusion: `<h2>Carrying This Forward</h2><p>The clients who present with moral injury are often among the most isolated in any caseload — isolated because the injury involves something they did or failed to do, because shame closes the space for disclosure, and because the people closest to them often cannot understand why they cannot move past an event that looks, from the outside, like it should be manageable. What they need from a clinician is not absolution — it is witness. The willingness to sit with the full weight of what happened without collapsing it into either reassurance or condemnation.</p><p>The therapeutic approaches you have learned in this course work because they take the moral dimension seriously. Adaptive Disclosure Therapy does not treat moral injury as a cognitive distortion to be corrected but as a genuine ethical experience to be processed. ACT-based approaches create space for the full complexity of what the client is carrying. Forgiveness-based frameworks distinguish between forgiving oneself and excusing what happened — a distinction that is often the first breath of relief a moral injury client has taken in years.</p><p>Bring this work to consultation. Moral injury presentations carry their own vicarious impact for the clinician — the weight of the moral complexity the client is carrying is real, and it needs somewhere to go. Supervision and peer consultation are not luxuries in this work; they are clinical necessities.</p>`,
  },

  {
    slug: 'racial-trauma-affirming-practice',
    description: `Race-based traumatic stress — the psychological injury that results from experiences of racism, discrimination, and racial violence — is a clinical reality for millions of clients in every mental health practice. This 2-hour continuing education course prepares mental health professionals to provide affirming, evidence-based care to clients experiencing racial trauma: understanding the spectrum of racial stressors from microaggressions to acute racial violence, the psychological mechanisms through which racism causes harm, validated assessment approaches, evidence-based and culturally adapted treatment frameworks, and the therapeutic relationship considerations that arise in cross-racial clinical work. The course addresses the historical and systemic dimensions of racial trauma, the specific presentations common in racially marginalized populations, and the self-reflective work clinicians must do to provide care that does not inadvertently replicate the invalidation clients have experienced elsewhere.`,
    intro: `<h2>Racism as Clinical Presenting Concern</h2><p>For many clients, racism is not a background condition or a political abstraction — it is a clinical presenting concern that shapes their symptoms, their relationship with help-seeking, their trust in a mental health system with a history of pathologizing marginalized people, and their daily experience of a world that communicates, in ways large and small, that they do not fully belong. The mental health impact of chronic race-based stress is well-documented and clinically significant: elevated rates of depression, anxiety, PTSD, hypertension, and other stress-related outcomes in communities facing ongoing discrimination.</p><p>This course builds the clinical vocabulary and framework for working with these realities directly — not as politically sensitive territory to navigate carefully, but as clinical content that requires the same precision and evidence-based grounding as any other presenting concern.</p>`,
    conclusion: `<h2>Showing Up for These Clients</h2><p>The clinician who completes this course carries something different into the room with clients of color than they had before: a framework that names racial stress as a legitimate and serious clinical concern, validated tools for assessing its impact, and therapeutic approaches that affirm rather than minimize what clients are experiencing. This is not a small thing — for clients who have been told by previous providers that their experiences of racism were exaggerated, misattributed, or simply not relevant to their mental health, having a clinician who understands the clinical reality of racial trauma can be the difference between staying and leaving.</p><p>The work does not stop at the end of this course. Culturally affirming practice requires ongoing self-examination — interrogating your own assumptions, biases, and blind spots, and staying curious about how your clients' experience of race may be shaping what they bring to you and what they leave out. Consultation with colleagues who have expertise in racial trauma and culturally adapted treatment is an ongoing professional responsibility, not a one-time training requirement.</p>`,
  },

  {
    slug: 'ai-ethics-mental-health',
    description: `Artificial intelligence tools are entering clinical mental health practice faster than the ethical frameworks for their use have been developed — creating real risks for clients, clinicians, and the profession. This 2-hour continuing education course examines the ethical dimensions of AI in mental health practice: informed consent and disclosure obligations when AI tools are used in clinical work, confidentiality and HIPAA implications of AI-assisted documentation and analysis, algorithmic bias and its disproportionate impact on marginalized populations, the boundary between AI support and AI replacement of clinical judgment, and the professional responsibility to evaluate AI tools critically rather than adopting them uncritically. Aligned with ACA ethics code provisions on technology and competence.`,
    intro: `<h2>Ethics That Haven't Caught Up to the Technology</h2><p>Mental health professionals are navigating a genuinely novel professional landscape. Tools that can generate clinical documentation, analyze client language patterns, provide diagnostic suggestions, and conduct psychoeducational conversations with clients are being marketed to practices and agencies before the ethical frameworks for their responsible use have been developed. The ACA Code of Ethics, NBCC standards, and state licensing board regulations were written for a world that did not yet include large language model AI — which means clinicians are currently making consequential decisions in a regulatory vacuum.</p><p>This course provides the ethical grounding to navigate that vacuum responsibly: understanding what the existing frameworks do and do not address, identifying the specific risks that AI tools create in clinical contexts, and developing your own principled approach to AI adoption that centers client welfare, informed consent, and professional accountability.</p>`,
    conclusion: `<h2>A Profession That Stays Accountable to Its Values</h2><p>The mental health field has navigated major technological transitions before — the introduction of electronic health records, telehealth platforms, online therapy tools — and each transition produced the same dynamic: technology adoption outpaced ethical guidance, and clinicians who stayed grounded in core professional values navigated more successfully than those who followed adoption trends uncritically. AI is a more powerful transition than any of these, and it requires a more deliberate ethical stance.</p><p>The questions this course has raised — about consent, transparency, bias, competence, and the boundary between tool use and clinical judgment — do not have final answers. They require ongoing engagement, and that engagement is a professional responsibility. Join the conversations happening in your professional associations, your supervision groups, and your workplace. Bring the ethical lens this course has sharpened into every decision you make about AI in your clinical work. Your clients are counting on you to think about this more carefully than the technology vendors who are marketing to you.</p>`,
  },

  {
    slug: 'clinician-burnout-sustainable-practice',
    description: `Burnout among mental health professionals is not a weakness of character or a failure of self-care practice — it is a predictable outcome of work that is emotionally demanding, often under-resourced, and inadequately supported by the systems in which it is performed. This 2-hour continuing education course examines clinician burnout through both individual and systemic lenses: the three-dimension model of burnout (exhaustion, depersonalization, efficacy), the occupational factors that drive it in mental health settings, the research-supported strategies that protect against it, the intersection with vicarious traumatization and compassion fatigue, and the ethical obligations clinicians carry to their clients when their own functioning is compromised. Practical, evidence-based, and attentive to the real conditions of clinical practice.`,
    intro: `<h2>The Clinician Who Forgot to Count Themselves</h2><p>Mental health training prepares clinicians to be present, attentive, empathic, and other-directed — and it prepares them very little for what happens when the cumulative weight of that orientation becomes unsustainable. Burnout in the mental health field is not a sign of insufficient commitment to the work. It is, in many ways, a consequence of it: the inverse of the empathy and engagement that make a clinician effective is the emotional depletion that follows when those resources are given without sufficient replenishment.</p><p>This course is not a self-care course in the sense of recommendations to get more sleep and take more vacations. It is a clinical and ethical examination of burnout — what it is, how it develops, what the evidence shows about preventing and recovering from it, and what professional obligations clinicians carry to their clients and to themselves when their functioning is compromised. The goal is a practice that is not just sustainable in the sense of lasting a long time, but sustainable in the sense of remaining genuinely good.</p>`,
    conclusion: `<h2>Building a Practice That Can Last</h2><p>The clinicians who sustain effective practice over careers of twenty, thirty, forty years share something beyond technique: they have developed a relationship with the work that is honest about its costs and intentional about what replenishes them. They have supervision they actually use, colleagues they actually talk to, and a clear-eyed understanding of the organizational and systemic conditions that either support or undermine clinician wellbeing — and they advocate for better conditions rather than simply adapting to inadequate ones.</p><p>The self-care framing of burnout prevention is incomplete because it locates the problem and the solution in the individual clinician. The fuller picture includes the caseload sizes, administrative burdens, inadequate supervision, and organizational cultures that make burnout a structural outcome as much as a personal one. The most sustainable action you can take after completing this course is to bring this fuller picture into your workplace conversations and your professional advocacy — for yourself, for your colleagues, and ultimately for the clients whose care depends on clinicians who are well enough to give it.</p>`,
  },

  {
    slug: 'neurodivergent-affirming-practice',
    description: `Neurodiversity — the natural variation in human brain functioning that includes autism spectrum conditions, ADHD, dyslexia, dyscalculia, and other cognitive profiles — is increasingly understood not as pathology to be treated but as human variation to be accommodated. This 2-hour continuing education course prepares mental health professionals to provide genuinely affirming care to neurodivergent clients: understanding the neurodiversity paradigm and its clinical implications, the specific presentations and mental health co-occurrences common in neurodivergent populations, the harms of masking and the clinical importance of authentic self-expression, communication and sensory adaptations for neurodivergent-affirming therapy, and the intersection of neurodivergence with gender, race, and other identity dimensions. The course challenges diagnostic deficit frameworks and builds a strengths-based clinical approach.`,
    intro: `<h2>Rethinking What Typical Means</h2><p>Mental health frameworks have historically evaluated human cognition against a standard defined by the majority — and labeled deviation from that standard as disorder. Neurodivergent clients know this history in their bodies: in the years of being told they were trying hard enough, in the assessments that catalogued what they couldn't do, in the therapy that attempted to normalize them rather than understand them. Many arrive in clinical settings having already internalized a deficit narrative about themselves that the mental health system has reinforced rather than challenged.</p><p>This course offers a different starting point. Neurodivergent-affirming practice begins with the recognition that ADHD, autism, dyslexia, and related profiles represent genuine differences in how brains are organized — not damage to a standard brain — and that effective clinical work starts by understanding those differences with curiosity rather than trying to remediate them toward a norm. That shift changes everything about how you conduct assessment, build rapport, structure sessions, and understand what therapeutic success looks like for each individual client.</p>`,
    conclusion: `<h2>Affirming Practice as Ongoing Commitment</h2><p>Neurodivergent-affirming practice is not a set of techniques you acquire once and apply mechanically — it is an ongoing orientation of curiosity, humility, and genuine interest in how each individual client experiences their world. The neurodivergent clients in your practice are experts on their own experience in ways that no clinician training can replicate, and the most affirming thing you can do is treat them as such: asking rather than assuming, following their lead on what support looks like, and being willing to revise your understanding as you learn more about how they work.</p><p>Stay current with the evolving landscape of neurodiversity-affirming practice. The field is moving rapidly, driven in significant part by neurodivergent clinicians, researchers, and advocates who are reshaping how the profession understands cognitive difference. Engaging with those voices — in journals, podcasts, community spaces, and supervision — is the best continuing education you can do to serve neurodivergent clients well.</p>`,
  },

  {
    slug: 'long-goodbye-dementia-grief-family-systems',
    description: `Dementia caregiving is one of the most prolonged and emotionally complex experiences a family can navigate — and the clients affected by it appear in every clinical caseload, often without identifying dementia as the presenting concern. This 3-hour continuing education course prepares mental health professionals to provide effective clinical support to older adults with dementia and their family systems: understanding the dementias (Alzheimer's, vascular, Lewy body, frontotemporal) and their clinical presentations, the grief of watching someone disappear incrementally while still present, the family systems disruption that dementia caregiving produces, evidence-based therapeutic approaches for late-stage grief and ambiguous loss, caregiver burden and its clinical assessment, and end-of-life planning conversations in the context of cognitive decline. Clinically rigorous and deeply humane.`,
  },

  {
    slug: 'seasoned-struggling-substance-use-disorders-older-adults',
    description: `Substance use disorders in older adults are frequently undetected, underdiagnosed, and undertreated — partly because the clinical presentation differs from younger populations, and partly because clinicians do not always look. This 2-hour continuing education course prepares mental health professionals to identify and treat substance use disorders in clients over 60: understanding the epidemiology and trends in older adult substance use, the physiological changes that alter how older adults respond to alcohol and drugs, the interaction between substance use and the common mental health presentations of late life (depression, grief, isolation, chronic pain, cognitive decline), evidence-based assessment tools validated for older populations, and treatment approaches that accommodate the developmental, relational, and medical context of aging. Essential for any clinician working with older adult populations.`,
  },

  {
    slug: 'instructional-design-for-mental-health-professionals',
    description: `Mental health professionals who develop training, supervision curricula, CE courses, or psychoeducational programs bring deep clinical expertise to content development — but often lack the instructional design knowledge that transforms good content into effective learning. This 3-hour continuing education course provides the foundational frameworks and practical skills of instructional design as applied to mental health education: learning objectives that drive design decisions, Bloom's taxonomy applied to clinical training, evidence-based adult learning principles, backward design methodology, assessment design that measures actual learning rather than exposure, and the specific adaptations required when designing for continuing education, CEU compliance, and ACEP standards. Applicable for those developing CE courses, group training curricula, onboarding programs, or clinical supervision structures.`,
  },

  {
    slug: 'what-the-chicken-dance-got-right-satc-attachment',
    description: `Attachment theory has moved from the developmental psychology laboratory into the clinical mainstream — and understanding it transforms how clinicians conceptualize relationship patterns, therapeutic ruptures, and the conditions under which lasting change becomes possible. This 2-hour continuing education course uses the lens of romantic relationship research and popular culture to examine adult attachment theory: the four attachment styles and their behavioral signatures in romantic relationships and in therapy, the neurobiological underpinnings of attachment security and insecurity, earned security and what the research says about the therapeutic relationship as an attachment relationship, and clinical applications across couples work, individual therapy, and group treatment. Engaging, evidence-based, and directly applicable.`,
  },

  {
    slug: 'cultural-humility-in-counseling-practice',
    description: `Cultural humility — the ongoing practice of self-reflection, openness, and learning in cross-cultural clinical relationships — is increasingly recognized as a more accurate and effective framework than cultural competence for the complexity of real clinical work. This 1.5-hour continuing education course examines the foundations of cultural humility: what distinguishes it from competence, how it develops through reflective practice rather than knowledge acquisition alone, the research connecting cultural humility to therapeutic alliance and treatment outcomes, and the specific skills of culturally humble engagement — asking rather than assuming, acknowledging limitations, addressing power differentials, and remaining genuinely curious about each client's unique cultural experience. Applicable across treatment settings and client populations.`,
  },

  // ── DRAFT COURSES: description < 60 words ─────────────────────────────────

  {
    slug: 'cr-crs-301-suicide-safety-planning',
    description: `Safety planning is not paperwork — it is a clinical intervention that extends the therapeutic relationship into the hours and days when a clinician is not present. This 3-hour continuing education course provides a comprehensive, evidence-based foundation in suicide safety planning: the research base supporting collaborative safety planning as an effective suicide prevention strategy, the Stanley-Brown Safety Planning Intervention model and its clinical implementation, lethal means counseling and the evidence for means restriction, safety planning with specific populations (adolescents, older adults, LGBTQ+ clients, veteran populations), and the integration of safety planning into standard clinical workflow. You will leave with specific language, practical tools, and confidence to create safety plans that function as genuine clinical resources for clients in crisis.`,
  },

  {
    slug: 'cr-crs-302-crisis-deescalation',
    description: `De-escalation is a learnable clinical skill — and in the moments when a client is in acute crisis, it may be the most important one a clinician has. This 2-hour continuing education course provides outpatient mental health professionals with a practical, evidence-based framework for crisis de-escalation: understanding the neurobiology of acute crisis states and what they mean for clinical intervention, the core de-escalation principles supported by research across healthcare and public safety settings, verbal and nonverbal de-escalation techniques adapted for outpatient clinical contexts, safety assessment integrated into de-escalation workflow, and the clinician's own physiological regulation as a de-escalation tool. Includes practice scenarios across common outpatient crisis presentations: suicidal crisis, acute psychosis, domestic violence disclosure, and severe panic.`,
  },

  {
    slug: 'cr-crs-303-threat-assessment',
    description: `Duty to warn and protect obligations require clinicians to make high-stakes judgments about risk under conditions of significant uncertainty — and the legal and ethical framework governing those judgments varies across jurisdictions in ways that directly affect clinical decision-making. This 3-hour continuing education course prepares mental health professionals to conduct structured threat assessment in clinical settings: understanding the legal foundations of duty to warn and protect from Tarasoff through current state law, empirically validated approaches to violence risk assessment, structured professional judgment frameworks (HCR-20, B-SAFE), threat assessment in outpatient settings, documentation standards for duty-to-protect situations, and the clinical and ethical complexities of working with clients who express violent ideation. Clinically rigorous and directly applicable to practice.`,
  },

  {
    slug: 'cr-trm-503-trauma-informed-assessment',
    description: `Trauma-informed assessment is not a single tool — it is a clinical orientation that changes how information is gathered, how it is interpreted, and how it is shared with clients. This 2-hour continuing education course moves beyond the ACE score to provide a comprehensive framework for trauma-informed assessment in mental health settings: understanding the limitations and appropriate uses of the ACE study, structured trauma assessment instruments (CAPS-5, LEC-5, PCL-5, TSI-2), trauma-informed diagnostic formulation that distinguishes trauma responses from primary psychiatric disorders, the clinical integration of trauma history gathering into initial assessment without retraumatization, and the specific assessment adaptations required for diverse populations including children, older adults, and individuals with cognitive or developmental differences.`,
  },

  {
    slug: 'technology-assisted-services-tx-681-140',
    description: `Texas Rule 681.140 establishes specific requirements for the provision of technology-assisted counseling services — and mental health professionals practicing or supervising in Texas need fluency in those requirements to remain compliant. This 2-hour continuing education course provides a comprehensive examination of Texas administrative rules governing telehealth mental health practice: the specific requirements of Rule 681.140, informed consent standards for technology-assisted services, documentation requirements, confidentiality protections in digital clinical environments, platform selection and HIPAA compliance, emergency management protocols for telehealth sessions, and the specific accommodations and limitations that apply to technology-assisted services across different licensure categories. Directly applicable for Texas-licensed counselors, social workers, and marriage and family therapists.`,
  },

  {
    slug: 'telehealth-fl-456-47-64b4',
    description: `Florida's telehealth regulatory framework creates specific obligations for mental health professionals providing services via technology — and those obligations continue to evolve as the regulatory landscape responds to telehealth's rapid expansion. This 3-hour continuing education course provides a comprehensive examination of Florida telehealth law and professional standards as applied to mental health practice: the requirements of Florida Statute §456.47 and Rule 64B4, informed consent and disclosure obligations, documentation standards, the interstate compact and cross-state practice considerations, platform selection and data security requirements, emergency management protocols, and the specific licensure requirements affecting telehealth practice for licensed counselors, social workers, and marriage and family therapists practicing in or into Florida.`,
  },

  {
    slug: 'cr-cli-601-attachment-theory',
    description: `Attachment theory provides one of the most clinically powerful frameworks for understanding adult relationships, therapeutic dynamics, and the conditions under which lasting psychological change becomes possible. This 3-hour continuing education course translates attachment research into direct clinical application: the four adult attachment patterns and their behavioral and relational signatures, the neurobiological substrates of attachment security and insecurity, the therapeutic relationship as an attachment relationship and its implications for treatment, evidence-based assessment approaches including the AAI and clinical interview strategies, and the specific therapeutic interventions that support movement toward earned security. Applicable for individual therapy, couples work, and any clinical population where early relational experiences shape present functioning.`,
    intro: `<h2>The Original Template</h2><p>Every adult who walks into a therapy office carries with them a working model of relationships — a set of largely implicit expectations about whether others can be trusted, whether closeness is safe, whether they are worthy of care. That model was built in the earliest years of life through thousands of interactions with caregivers who were present or absent, responsive or unpredictable, safe or frightening. It has been modified by subsequent experience, but its influence on how people form relationships, regulate emotion, and experience themselves in connection with others is profound and pervasive.</p><p>Understanding attachment theory is not an academic exercise. It is one of the most useful lenses a clinician can develop, because it explains so much of what happens in the therapy room — including what happens between the clinician and the client. This course builds that understanding from its theoretical foundation through its direct clinical applications.</p>`,
  },

  {
    slug: 'cr-cli-602-acceptance-commitment-therapy',
    description: `Acceptance and Commitment Therapy represents a fundamental shift in how the therapeutic relationship with psychological suffering is framed: not as something to be reduced or eliminated, but as something to be related to differently. This 2-hour continuing education course provides a comprehensive clinical introduction to ACT: the six core processes (acceptance, defusion, present-moment awareness, self-as-context, values, committed action), the psychological flexibility model, ACT-consistent metaphors and experiential exercises that bring the model to life in session, the evidence base across anxiety disorders, depression, chronic pain, and other presenting concerns, and the practical integration of ACT principles into an existing clinical practice regardless of theoretical background. Accessible for ACT beginners; substantive for clinicians with prior exposure.`,
  },

  {
    slug: 'cr-cli-606-psychopharmacology',
    description: `Non-prescribing mental health professionals occupy a critical position in medication management — as collaborators with prescribers, as sources of information for clients navigating treatment decisions, and as clinicians who observe medication effects in ways that prescribers, seeing clients for fifteen minutes every six weeks, often cannot. This 3-hour continuing education course provides the pharmacological literacy that non-prescribers need to fill that role effectively: the major classes of psychiatric medications, their mechanisms of action, clinical indications, side effect profiles, and the clinical observations that should trigger communication with prescribers. The course addresses medication interactions, discontinuation syndromes, polypharmacy concerns in older adults, and the specific adaptations relevant to pediatric and geriatric populations. Evidence-based, non-prescriber focused, and directly applicable across clinical settings.`,
  },

  {
    slug: 'active-listening-skills',
    intro: `<h2>Before the First Word Is Spoken</h2><p>Before a clinician chooses an intervention, formulates a case conceptualization, or delivers a reflection, they are already communicating something — through the quality of their attention, the organization of their physical presence, the degree to which the client feels genuinely received. Research on therapeutic outcome consistently shows that clients' experience of being heard and understood is among the strongest predictors of treatment success, across diagnosis, modality, and theoretical orientation. The mechanism of change in any therapy begins with this: a person feeling known by another person.</p><p>Active listening is not a passive skill. It requires ongoing effort, self-regulation, cultural attunement, and the deliberate management of the internal noise — countertransference, cognitive load, confirmation bias — that compromises presence when it goes unexamined. This course builds the foundation and the discipline of therapeutic listening, from attending through reflecting through the advanced empathic skills that reach the depth of a client's experience. It is the most fundamental clinical training a counselor can pursue, at any stage of career.</p>`,
    conclusion: `<h2>The Practice That Never Finishes</h2><p>Experienced clinicians return to their listening skills not because those skills have faded but because clinical listening deepens with return. The reflections that once required deliberate construction become natural, and that naturalness creates space for attending to the subtler dimensions of a client's communication — the word chosen over its synonym, the pause that precedes the difficult disclosure, the way a client's posture changes when the conversation approaches something that matters. These are the signals that are only available to a clinician who has made listening a practice rather than a technique.</p><p>Every clinical skill built on listening — rapport, empathy, assessment accuracy, intervention timing, therapeutic rupture identification — is only as good as the listening underneath it. Returning to that foundation deliberately, through recorded session review, supervision, and self-reflection, is the ongoing work of a clinician committed to the actual quality of their practice. The clients you see deserve that commitment. So does the work.</p>`,
  },

  {
    slug: 'cr-tmh-601-mastering-telemental-health',
    intro: `<h2>The Practice Has Changed. The Standard Hasn't.</h2><p>Telehealth transformed from an accommodation to an expectation in the span of a single year — and the regulatory, ethical, and clinical frameworks for virtual practice have been playing catch-up ever since. Mental health professionals who moved their practices online during the COVID-19 pandemic found that the technical logistics of telehealth were more manageable than anticipated, but that the clinical and compliance dimensions were more complex: informed consent in a virtual environment, managing crisis at a distance, maintaining therapeutic presence through a screen, navigating interstate practice, and ensuring that the technology itself didn't become a liability for confidentiality or connection.</p><p>This course provides the comprehensive foundation that telehealth practice requires — not just the legal and regulatory framework, but the clinical skills and professional judgment that make virtual care genuinely effective. Whether you are new to telehealth or have been practicing virtually for years, the material here will deepen your competence and strengthen your compliance.</p>`,
  },

  {
    slug: 'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
    intro: `<h2>The Practice Has Changed. The Standard Hasn't.</h2><p>Telehealth transformed from an accommodation to an expectation in the span of a single year — and the regulatory, ethical, and clinical frameworks for virtual practice have been playing catch-up ever since. Mental health professionals who moved their practices online during the COVID-19 pandemic found that the technical logistics of telehealth were more manageable than anticipated, but that the clinical and compliance dimensions were more complex: informed consent in a virtual environment, managing crisis at a distance, maintaining therapeutic presence through a screen, navigating interstate practice, and ensuring that the technology itself didn't become a liability for confidentiality or connection.</p><p>This course provides the comprehensive foundation that telehealth practice requires — not just the legal and regulatory framework, but the clinical skills and professional judgment that make virtual care genuinely effective. Whether you are new to telehealth or have been practicing virtually for years, the material here will deepen your competence and strengthen your compliance.</p>`,
  },

  {
    slug: 'motivational-interviewing-from-ambivalence-to-action',
    intro: `<h2>Meeting Ambivalence Where It Lives</h2><p>The client who says "I know I need to change, but..." is not being resistant. They are telling you the precise truth about their experience: they hold two genuine truths simultaneously — the reasons for change and the reasons things stay the same — and neither set of reasons is dishonest or pathological. Ambivalence is not the enemy of change. It is where change lives, in the space between what people want and what they know how to do, between who they are and who they want to become.</p><p>Motivational Interviewing was developed specifically for that space. It is not a technique for overcoming ambivalence from the outside — for talking clients into change, presenting evidence until they comply, or mining for the correct motivation that will unlock action. It is a clinical conversation designed to help clients explore and resolve their own ambivalence in the direction of their own values. The change, when it comes, is theirs. This course builds the skills to facilitate that process with precision and with genuine respect for client autonomy.</p>`,
  },

  {
    slug: 'suicide-risk-assessment-crisis-intervention',
    intro: `<h2>The Work That Cannot Wait</h2><p>Every mental health professional will work with suicidal clients. Most already have — often without knowing the full extent of what those clients were carrying. Suicide is the second leading cause of death among Americans aged 10 to 34, and the mental health professionals in those clients' lives are often the only trained individuals who have the opportunity to intervene. That opportunity depends on clinical skill — not intuition, not natural empathy, but specific, learnable, evidence-based competencies in assessment, formulation, and intervention.</p><p>This course is built for the reality of clinical practice with suicidal clients: the complexity of conducting a risk assessment with a client who minimizes, the weight of translating clinical data into an actionable formulation, the challenge of creating a safety plan that actually functions as a resource in crisis, and the relational dimension of this work — the therapeutic presence that communicates to a client that their life is worth fighting for, even when they cannot yet believe it themselves.</p>`,
  },

  {
    slug: 'dbt-skills-training-comprehensive',
    intro: `<h2>A Treatment Built for the Clients Who Challenge Most</h2><p>Dialectical Behavior Therapy was not built for uncomplicated presentations. It was developed by Marsha Linehan for individuals who had failed in previous treatments, who were chronically suicidal, who self-harmed, and who had been labeled by the mental health system as treatment-resistant, manipulative, or simply too difficult. The dialectical frame at the heart of DBT holds two truths simultaneously: that clients are doing the best they can, and that they need to do better. That paradox is not a therapeutic trick — it is an accurate description of the situation these clients are in, and holding it is what makes genuine therapeutic progress possible.</p><p>This course provides the foundational and clinical depth required to work competently within a DBT framework: the biosocial theory, the treatment modes and their functions, the four skill modules and their clinical applications, and the specific adaptations that extend DBT to populations beyond the original research base. Whether you are building DBT competency from the ground up or deepening an existing practice, this course provides the clinical substance the work requires.</p>`,
  },

  {
    slug: 'psychopharmacology-for-counselors',
    intro: `<h2>What Clinicians Owe Clients About Medication</h2><p>A client asks whether the medication their prescriber recommended is the right choice. Another asks what the difference is between the two antidepressants their doctor mentioned. A third stops taking their mood stabilizer because they don't understand why they need it when they feel fine — and the clinician, who sees them weekly while the prescriber sees them every two months, is the only mental health professional with the relationship to address it. Non-prescribing clinicians are on the front lines of medication adherence, medication education, and the coordination between mental health and medical care — and most graduate programs provide minimal preparation for that role.</p><p>This course builds the pharmacological literacy that non-prescribing clinicians need to serve their clients well: not to prescribe, not to override prescribers, but to be genuinely useful when clients bring questions, concerns, and confusions about their medications into the room where they feel safest raising them.</p>`,
  },

  {
    slug: 'foundations-of-trauma-informed-care-assessment-and-stabilization',
    intro: `<h2>Trauma-Informed Is Not a Specialty — It Is a Standard</h2><p>The statistics on trauma prevalence are striking: epidemiological studies consistently find that the majority of adults seeking mental health services have experienced at least one traumatic event, and a substantial proportion have experienced multiple, complex, or developmental trauma. For most clinical populations — not just those presenting explicitly with PTSD — trauma is context, not exception. Working in mental health without a trauma-informed framework is like working with clients who speak a different language without a translator: the meaning of what they are communicating is systematically missed.</p><p>Trauma-informed care is not a set of trauma-specific interventions. It is a clinical orientation — an understanding of how trauma shapes perception, regulation, relationship, and behavior that changes how you conduct assessment, build rapport, structure sessions, and respond to moments of apparent resistance or dysregulation. This course builds that orientation from its research foundations through its direct clinical applications.</p>`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function isWeakDescription(desc, title) {
  const d = (desc||'').trim();
  const t = (title||'').trim();
  if (!d) return true;
  if (d.toLowerCase() === t.toLowerCase()) return true;
  return wordCount(stripHtml(d)) < 60;
}

function isWeakIntro(content) {
  return wordCount(stripHtml(content||'')) < 80;
}

function isWeakConclusion(content) {
  const text = stripHtml(content||'');
  if (wordCount(text) < 80) return true;
  if (/this course has provided a comprehensive examination/i.test(text)) return true;
  if (/as you apply these concepts.*continue to seek/i.test(text)) return true;
  return false;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n' + '='.repeat(72));
  console.log('fixAllCourseIntrosConclusions — ' + (DRY ? 'DRY RUN' : 'APPLYING WRITES'));
  console.log(`${PATCHES.length} courses in patch catalogue`);
  console.log('='.repeat(72) + '\n');

  let found = 0, patched = 0, notfound = 0, skipped = 0;

  for (const patch of PATCHES) {
    const course = await col.findOne({ slug: patch.slug });
    if (!course) {
      // Try the duplicate TMH601 slug
      notfound++;
      console.log(`NOT FOUND: ${patch.slug}`);
      continue;
    }
    found++;

    const sections = course.sections || [];
    const firstSec = sections[0];
    const lastSec  = sections[sections.length - 1];
    const setPayload = {};
    const actions = [];

    // 1. Description
    if (patch.description && isWeakDescription(course.description, course.title)) {
      setPayload.description = patch.description;
      actions.push(`desc: ${wordCount(stripHtml(course.description||''))}w → ${wordCount(stripHtml(patch.description))}w`);
    }

    // 2. Intro — add/replace first text block in section 0
    if (patch.intro && firstSec) {
      const blocks = firstSec.contentBlocks || [];
      const firstTextBlock = blocks.find(b => b.type === 'text');
      const needsIntro = !firstTextBlock || isWeakIntro(firstTextBlock.content);
      if (needsIntro) {
        let patchedBlocks;
        if (!firstTextBlock) {
          // Insert after sectionDivider (order 1) at order 1.5 — will be renumbered
          const newBlock = { type: 'text', order: 1.5, content: patch.intro };
          patchedBlocks = [...blocks, newBlock].sort((a,b)=>(a.order||0)-(b.order||0));
        } else {
          patchedBlocks = blocks.map(b => b === firstTextBlock ? { ...b, content: patch.intro } : b);
        }
        // Resequence orders
        patchedBlocks.forEach((b, i) => { b.order = i + 1; });
        const patchedSections = sections.map((s, i) => i === 0 ? { ...s, contentBlocks: patchedBlocks } : s);
        setPayload.sections = patchedSections;
        actions.push(`intro: ${firstTextBlock ? wordCount(stripHtml(firstTextBlock.content||''))+'w' : '0w'} → ${wordCount(stripHtml(patch.intro))}w`);
      }
    }

    // 3. Conclusion — add/replace last text block in last section
    if (patch.conclusion && lastSec && lastSec !== firstSec) {
      const blocks = lastSec.contentBlocks || [];
      const textBlocks = blocks.filter(b => b.type === 'text');
      const lastTextBlock = textBlocks[textBlocks.length - 1];
      const needsConclusion = !lastTextBlock || isWeakConclusion(lastTextBlock.content);
      if (needsConclusion) {
        let patchedBlocks;
        if (!lastTextBlock) {
          const maxOrder = blocks.reduce((m, b) => Math.max(m, b.order||0), 0);
          const newBlock = { type: 'text', order: maxOrder + 1, content: patch.conclusion };
          patchedBlocks = [...blocks, newBlock];
        } else {
          patchedBlocks = blocks.map(b => b === lastTextBlock ? { ...b, content: patch.conclusion } : b);
        }
        patchedBlocks.forEach((b, i) => { b.order = i + 1; });
        const lastSecIdx = sections.length - 1;
        const patchedSections = (setPayload.sections || sections).map((s, i) =>
          i === lastSecIdx ? { ...s, contentBlocks: patchedBlocks } : s
        );
        setPayload.sections = patchedSections;
        actions.push(`conclusion: ${lastTextBlock ? wordCount(stripHtml(lastTextBlock.content||''))+'w' : '0w'} → ${wordCount(stripHtml(patch.conclusion))}w`);
      }
    }

    if (actions.length === 0) {
      skipped++;
      console.log(`SKIP (already OK): ${course.courseCode||'?'} ${course.title.slice(0,50)}`);
      continue;
    }

    console.log(`PATCH: ${(course.courseCode||'?').padEnd(14)} ${course.title.slice(0,45).padEnd(46)} | ${actions.join(' | ')}`);

    if (!DRY) {
      setPayload.updatedAt = new Date();
      const result = await col.updateOne({ _id: course._id }, { $set: setPayload });
      if (result.modifiedCount === 1) {
        patched++;
      } else {
        console.error(`  WRITE FAILED: ${course.slug}`);
      }
    } else {
      patched++;
    }
  }

  console.log('\n' + '='.repeat(72));
  console.log('SUMMARY');
  console.log(`  Found:    ${found}`);
  console.log(`  Patched:  ${patched}`);
  console.log(`  Skipped:  ${skipped} (already OK)`);
  console.log(`  Missing:  ${notfound}`);
  if (DRY) console.log('\n  Re-run with --apply to write.');
  else     console.log('\n  Done. Re-run auditIntrosConclusions.js to verify.');
  console.log('='.repeat(72) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
