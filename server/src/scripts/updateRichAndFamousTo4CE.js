// updateRichAndFamousTo4CE.js
// UPDATES the existing "Case Studies of the Rich and Famous" LiveSession (slug
// case-studies-rich-and-famous-sep25) from 3.5 CE to 4.0 CE with a rebuilt case
// lineup. This is an EDIT of the record createRichAndFamousLiveCourse.js inserted,
// not a new session — same _id, same slug, same title, same Sep 25 date, same
// pricing (includedInSubscription: 'any', price 115). Only these fields change:
//   ceuHours        3.5  -> 4.0
//   scheduledEnd    10:30pm -> 11:00pm ET  (scheduledStart unchanged, 6:30pm)
//   agenda          rebuilt, 15 rows -> 17 rows (240 instructional min, was 210)
//   breaks          recomputed for the new agenda (still two 15-min breaks)
//   description     rewritten for the new case lineup and objectives
// Untouched: title, slug, presenter, price, includedInSubscription, capacity,
// registrationCutoffDays, isPublished, status, timezone, scheduledStart,
// sessionType, category, nbccContentAreas, attendanceThresholdPct, recordingEnabled.
//
// WHY THIS REBUILD — Ke's actual ask was a 4-credit LIVE course built around a
// shortlist of figures (Taylor Swift, Billie Eilish, Kanye West, Beyoncé, Britney
// Spears, Simone Biles) — that shortlist is why so many names were on the table.
// The prior 3.5 CE version (createRichAndFamousLiveCourse.js) predates that
// shortlist and centered different cases (Osaka, Phelps, Lovato/Fisher, VIP
// syndrome). This script replaces that lineup with the shortlist, minus Kanye:
// he publicly retracted his bipolar diagnosis (Feb 2025 — now says autism, has
// stopped medication) and is currently most publicly associated with documented
// antisemitic statements. A course centering him as a mental-illness case risks
// teaching that mental illness explains bigotry, which is the opposite of this
// course's point. Same reasoning already given and accepted for the separate
// CR-PFM-101 self-paced course, which is unrelated and unaffected by this file.
//
// NEW CASE LINEUP (5 headline cases, same sourcing standard as before: the
// person's own public account, or sworn record, only)
//   Case A   Britney Spears — capacity, conservatorship, LRA. UNCHANGED from the
//            3.5 CE version; sworn open-court testimony, June 23, 2021.
//   Case B   Simone Biles (I) — protective withdrawal, Tokyo 2021 "twisties."
//            UNCHANGED core material, trimmed from 25 to 20 min; brief pointer to
//            Naomi Osaka's parallel disclosure-tax pattern kept (not a headline
//            case) because segment 9's breakout depends on the concept.
//   Case B2  Simone Biles (II) — abuse survivorship. NEW. Sworn testimony before
//            the U.S. Senate Judiciary Committee, September 15, 2021, on the
//            FBI's handling of the Larry Nassar investigation. Content advisory;
//            deliberately paced separately from the Tokyo material per this
//            course's own standard that abuse-survivor content isn't blended
//            with unrelated material about the same person.
//   Case C   Billie Eilish — Tourette syndrome and public stigma. NEW. Her own
//            account to David Letterman (Netflix, 2022) of living with tics and
//            of being laughed at because people assume she is joking.
//   Case D   Taylor Swift — eating disorder and body image under scrutiny. NEW.
//            Her own account in Miss Americana (2020) of the tabloid "pregnant
//            at 18" cover and the restriction pattern it triggered.
//   Case E   Beyoncé — occupational strain, sleep, and the "strong one" role.
//            NEW, and deliberately reframed from a diagnosis narrative. Her own
//            statements on insomnia across a touring career, on boundary-setting,
//            and on "generational trauma" are usable; a "diagnosed with anxiety,
//            depression, and PTSD" claim circulating online could not be traced
//            to anything she has said herself and is NOT used anywhere here.
//
// DROPPED from the 3.5 CE version: Naomi Osaka and Michael Phelps as headline
// cases (Osaka kept as a brief supporting mention only), Demi Lovato / Carrie
// Fisher "public recovery" case, and the VIP-syndrome/NDA segment. None of the
// clinical content is lost — Fisher's full bipolar/ECT material lives in its own
// 1.5 CE self-paced course (CR-PFM-101), unaffected by this file.
//
// CE MATH — 4.0 CE = 240 instructional min. Window grows from 240 min (3.5 CE)
// to 270 min: 6:30-11:00pm ET, same two 15-min breaks, 240 + 30 = 270. This is
// exactly the growth path createRichAndFamousLiveCourse.js's own header
// documented ("If 4.0 CE is wanted... the window has to grow to 270 min").
//
// SAFE BY DEFAULT: dry run prints a full before/after diff and writes nothing.
// Only --apply updates the record. Read-back verification after save.
//
//   node src/scripts/updateRichAndFamousTo4CE.js
//   node src/scripts/updateRichAndFamousTo4CE.js --apply
//
// AFTER --apply: the Whereby room's stored window still ends at the OLD 10:30pm.
// Re-run immediately:
//   node src/scripts/regenerateWherebyRoom.js --slugs case-studies-rich-and-famous-sep25 --apply
// liveRoomService.js's 6-hourly self-heal would eventually catch this too, but
// don't rely on that for a session this close — regenerate the room explicitly.
//
// Requires: MONGODB_URI

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

const APPLY = process.argv.includes('--apply');
const SLUG = 'case-studies-rich-and-famous-sep25';
const NEW_CEU_HOURS = 4.0;

const fmt = (d) => new Date(d).toLocaleString('en-US', {
  timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric',
  year: 'numeric', hour: 'numeric', minute: '2-digit'
}) + ' ET';
const clock = (d) => new Date(d).toLocaleTimeString('en-US', {
  timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit'
});
const sumMin = (a) => a.reduce((n, s) => n + (s.durationMin || 0), 0);

/* ── Run of show — 17 rows, 270 min (240 instructional + two 15-min breaks) ── */
const AGENDA = [
  {
    order: 0,
    type: 'lecture',
    title: 'Framing — the case we are not allowed to make',
    durationMin: 15,
    prompt: 'Why this course never diagnoses anyone, and why that constraint is the actual curriculum.',
    script: "Welcome in. Give people a second to land.\n\n[DO 30s - confirm audio, ask for a hello in the chat, wait for a few]\n\nI want to start by telling you what this course will not do, because that is the part worth the evening.\n\nWe are going to spend four hours on people whose names you know. And at no point tonight will I diagnose a single one of them. Not a working formulation, not a \"well, clinically that looks like,\" not a hedge with a diagnosis hiding inside it. Not once.\n\nHere is why that matters and where it comes from. The APA Goldwater Rule - Section 7, Annotation 3 - says it is unethical to offer a professional opinion about someone you have not examined and who has not authorized the statement. It was written in 1973, after a magazine polled psychiatrists about a presidential candidate and printed the answers. Our side of the house has the same rule in different words. ACA C.6.c governs what you say in media and public presentations. ACA E.5.d, refraining from diagnosis, is the one people forget exists. APA Standard 5.04 covers media presentations. The NBCC code reaches public statements and scope of competence.\n\n[SLIDE - the four provisions side by side. Leave it up while you make the next point.]\n\nNow here is the thing everybody misses. These rules do not say you cannot talk about public figures. They say you cannot render a professional opinion on someone you have not examined. That gap is enormous, and it is where this entire course lives.\n\nSo the standard for tonight, and I will hold us to it out loud: every case rests on one of exactly two sources. What the person said about their own experience, in public, in their own words. Or sworn court or congressional record. That is it. No unauthorized biography, no tabloid, no documentary voiceover, no anonymous source, no aggregator claim you cannot trace to the person themselves, and no clinical inference layered on top by me or by you.\n\n[NOTE - someone will push back that this makes the material thin. It does the opposite, and you should let them find that out rather than arguing it now. The self-disclosure record is richer than the speculation.]\n\nOne more ground rule. Some of tonight is disclosure material and some is abuse-survivor material. Take care of yourselves. We break at eight and again at quarter to ten, and I will flag anything heavy before it arrives."
  },
  {
    order: 1,
    type: 'discussion',
    title: 'Where the room stands',
    durationMin: 10,
    prompt: 'Two polls, then say the quiet part out loud.',
    script: "Before I teach anything, I want to know where this room actually is.\n\n[POLL - \"Have you ever formed a private clinical impression about a public figure you have never met? - Yes / No\" ANONYMOUS. Close it, then reveal.]\n\n[NOTE - it lands high, usually well past three quarters. Do not treat the yes as a confession and do not let the room treat it as one. The honest frame: this is what a trained pattern-recognition system does when it is handed a pattern. Noticing is not the violation. The rules govern what you do with it.]\n\nSecond one.\n\n[POLL - \"Have you ever said that impression out loud to someone outside your household? - Yes / No\" ANONYMOUS. Reveal.]\n\n[NOTE - this one drops, and the drop is the teaching moment. The distance between the two numbers is the professional line, and the room just drew it themselves.]\n\nSo hold onto that, because here is the uncomfortable version. Your client does the same thing you just did. They form impressions of famous people and they use them - as permission, as comparison, as evidence about what is possible for them.\n\n[DISCUSS 4 min - Has a client ever brought a celebrity into your room? Whose name, and what were they using that person to say about themselves? Take three or four, do not resolve them. We come back to every one of them tonight.]\n\n[NOTE - listen for whether the client used the figure to make hope credible or to make their own suffering illegitimate by comparison. That split shows up again tonight in Case B and in the Swift and Beyoncé material.]"
  },
  {
    order: 2,
    type: 'lecture',
    title: 'The sourcing standard: self-disclosure, sworn record, and everything else',
    durationMin: 15,
    prompt: 'What counts as a usable source, what does not, and why the boundary keeps moving.',
    script: "Let us make the sourcing standard operational, because in about twenty minutes you are going to have to apply it under time pressure.\n\n[SLIDE - three tiers]\n\nTier one, usable. First-person public account. The person, speaking about their own experience, on the record, on purpose. Billie Eilish telling David Letterman, on camera, what it is like to be laughed at for a tic. Taylor Swift, in her own documentary, describing exactly what a magazine cover did to her relationship with food. These are not leaks. These are people who chose the moment and the words.\n\nTier one also, usable. Sworn record. Britney Spears testifying in open court on June 23, 2021 is a transcript. Simone Biles testifying before the United States Senate Judiciary Committee on September 15, 2021 is a transcript. Neither is reporting about them. Both are them, under oath, on the record.\n\n[NOTE - say plainly why you separate these two even though both are tier one: self-disclosure is voluntary and sworn testimony frequently is not - it is compelled by the proceeding, even when the witness wants to be there. Same evidentiary quality, very different consent posture. That distinction returns in Case A and again in Case B.]\n\nTier two, contextual only. Verifiable public events with no interior claim attached. Biles withdrew from the team final in Tokyo on July 27, 2021, then from individual finals, then returned for beam. That sequence is fact. What it felt like is only knowable from what she said about it.\n\nTier three, unusable tonight. Everything else. Unauthorized biography. A documentary's framing when it is someone else's narration, not the person's own words. Anonymous sources. And - this is the one that catches people - an aggregator claim you cannot trace back to the person. \"She was diagnosed with anxiety, depression, and PTSD\" shows up on a dozen wellness blogs about a very famous woman we are not naming a case after tonight, and not one of those blogs links to her saying it. That is tier three. It does not become tier one by being repeated a thousand times.\n\n[SLIDE - the three-tier card. Tell them to screenshot it; this is the transferable tool.]\n\nAnd now the hard part, which is where clinicians actually get into trouble. Disclosure is not permanent and it is not static. A person can disclose something and later revise it. Demi Lovato talked publicly about being what they called California sober, and then in December of 2021 said publicly that sober sober was the only way to be. If you built a teaching case on the first statement and never updated it, you are now teaching something the person has explicitly retracted about their own life.\n\n[NOTE - this is the single most practical point in the segment. Your source is a living person with an evolving account. Anything you cite goes stale. Build in a re-check, or do not use the case. We will see this exact failure mode named tonight for a different reason - a case we are deliberately not running."
  },
  {
    order: 3,
    type: 'breakout',
    title: 'Sorting the record',
    durationMin: 15,
    prompt: 'Groups of three or four. Sort eight statements into the three tiers, then defend the two you disagreed on.',
    script: "[BREAKOUT 10 min, groups of 3-4. Put the eight statements on screen. They sort each into tier one usable, tier two contextual, or tier three unusable, and flag the two that split the group.]\n\n[SLIDE - the eight:\n1. \"These are things you would never notice if you're just having a conversation with me, but for me, they're exhausting.\" - Eilish, to David Letterman, on her own tics.\n2. A documentary's narrator explaining what an athlete was feeling during a competition.\n3. Spears' June 23, 2021 open-court testimony about the conservatorship.\n4. A former assistant's account of a client's home life, published in a memoir.\n5. Biles' September 15, 2021 sworn testimony to the Senate Judiciary Committee.\n6. The dated fact that a competitor withdrew from a final.\n7. A clinician on a podcast offering a probable diagnosis for a public figure.\n8. A wellness blog's claim that a musician \"was diagnosed with clinical anxiety, depression, and PTSD,\" with no source given.]\n\n[NOTE - the intended splits. Number 3 and number 5 are tier one on evidence and genuinely uncomfortable on consent - testimony is sworn but frequently compelled; if a group just files them and moves on, push them. Number 7 is the Goldwater violation and somebody will say they have heard exactly that on a podcast this month - let them say it. Number 8 is the one that should generate the most argument: it LOOKS sourced because it is repeated everywhere, and that is exactly the trap. Ask the group what would make it tier one - a link to the person's own statement, nothing else.]\n\n[DO - report out 5 min. Take numbers 5 and 8, not a walkthrough of all eight.]\n\n[NOTE - the finish line for this segment: a clinician can say a great deal about a public figure without ever violating the rule, and the constraint produces better teaching material than speculation does, because it is anchored to something a real person actually decided to say, under their own name, on purpose."
  },
  {
    order: 4,
    type: 'lecture',
    title: 'Case A - the conservatorship: capacity, autonomy, and the least restrictive alternative',
    durationMin: 25,
    prompt: 'Thirteen years, a court record, and the capacity questions that are sitting in your own caseload right now.',
    script: "Case A. This is the court-record case, and it is the one with the most direct transfer to your practice.\n\nThe facts, and only the facts. A conservatorship was established in 2008. It lasted until November 12, 2021. On June 23, 2021, the conservatee addressed the court directly and in open session. That testimony is a public transcript. She has since written about the period in her own memoir.\n\n[NOTE - do not characterize her mental state in 2008. You do not know it, the record does not establish it, and the moment you speculate you have modeled the exact failure the course is about. If someone in the room offers a retrospective diagnosis, stop and name it warmly. This is the live test of segment one.]\n\nWhat is teachable here is not her. It is the structure.\n\n[SLIDE - four structural questions]\n\nFirst. Capacity is decision-specific and time-specific. Not global, not permanent. Someone can lack capacity to manage a complex estate and retain full capacity to decide where to live, who to see, and whether to accept treatment. A finding is a snapshot of one decision at one time. Thirteen years is a very long time to go without re-taking the snapshot.\n\nSecond. Least restrictive alternative. This is an obligation, not a preference. If a narrower intervention meets the protective aim, the broader one is not justified - and the burden sits with the person arguing for the broader one, not the person subject to it.\n\nThird. Supported decision-making. There is a whole middle range between full autonomy and substituted judgment: supported decision-making agreements, limited conservatorships, representative payees, powers of attorney, advance directives for psychiatric care. Most clinicians know the two ends and almost none of the middle. That is a competence gap and it is fixable tonight.\n\nFourth, and this is the one that will actually touch your week. What is the clinician's role? You may be asked to write a letter. You may be asked to evaluate. You may be treating someone who is already under a protective arrangement. Those are three different jobs with three different sets of obligations, and the most common ethical failure is doing one while believing you are doing another.\n\n[DISCUSS 6 min - You get a call from an attorney asking for a letter about your client's capacity to manage their finances. You have been treating them for anxiety for eight months. What do you actually know, what would you have to assess that you have not assessed, and what does it do to the treatment relationship if you take the job?]\n\n[NOTE - drive toward the distinction between treating clinician and forensic evaluator. Dual-role conflict, scope of what treatment sessions can support, and the fact that a letter written from a treatment record can be read in court as an evaluation. Someone will say they would just write what they observed. Ask them how that letter reads to a judge who does not know the difference.]\n\nAnd the piece that gets overlooked. The testimony in that transcript describes wanting to be heard and not being. Whatever else is true, that is a documented experience of a protective structure, from inside it, in sworn words. If you work with anyone under guardianship, conservatorship, a rep payee, an IEP, a treatment mandate - you have a client who could say something similar. Have you asked them?\n\n[NOTE - land the turn here and let it sit before the discussion segment. The point of Case A is not the celebrity. It is the person on your caseload who is under somebody else's authority and has never been asked what that is like.]"
  },
  {
    order: 5,
    type: 'discussion',
    title: 'Least restrictive in your own caseload',
    durationMin: 10,
    prompt: 'Name one client operating under an arrangement someone else built for them. What would the narrower version look like?',
    script: "Straight into application, no preamble.\n\n[DO 3 min, individually and silently - bring to mind one client, current or recent, who is operating under an arrangement somebody else built for them. Conservatorship, guardianship, rep payee, mandated treatment, a probation condition, a school plan, a family agreement they did not really agree to. Write down two things: what the arrangement protects against, and what it costs them.]\n\n[DISCUSS 6 min - take four or five, no names, no identifying detail. For each one ask the same two questions: is there a narrower version that meets the same protective aim, and when was the arrangement last actually reviewed by anybody?]\n\n[NOTE - what tends to surface, and name it if the room does not: nobody has reviewed it. The arrangement was built during an acute period and simply persisted, because persisting requires no one's signature and unwinding requires several. That is the transfer from Case A - not that protective arrangements are wrong, but that they are sticky, and you may be the only person in the room who is positioned to ask whether this one still fits.]\n\n[NOTE - if someone says it is not their place to raise it, that is worth two minutes. Where does documenting a concern about fit sit relative to your obligation to the client's autonomy? You are not litigating it. You are noticing it in the record.]\n\nBreak is next. Fifteen minutes. When we come back we are in elite gymnastics, and we are going to spend real time there - two different cases about the same athlete, on purpose."
  },
  {
    order: 6,
    type: 'break',
    title: 'Break',
    durationMin: 15,
    prompt: 'Fifteen minute break — back at 8:15 ET. The attendance clock pauses; break time is excluded from the CE denominator.'
  },
  {
    order: 7,
    type: 'lecture',
    title: 'Case B - protective withdrawal: the twisties and the quitter narrative',
    durationMin: 20,
    prompt: 'Tokyo, July 27, 2021, and what the public did to someone who stopped mid-competition.',
    script: "Welcome back. Case B, part one.\n\nJuly 27, 2021, Tokyo. A gymnast withdraws from the team final, then from individual finals, and returns for the balance beam final. She says publicly that she has lost her air awareness - the twisties, in the sport's own language - and that continuing would be unsafe. She says the decision was about her mental health and about physical safety, and in that sport those are not two things.\n\n[NOTE - be precise about the twisties and do not psychologize it. It is a known, named phenomenon in gymnastics - a disruption of proprioceptive orientation mid-air. An athlete who cannot locate the floor while rotating is in physical danger, full stop. Clinicians reach for dissociation as an analogue and the analogy is instructive but it is an analogy. Say that out loud.]\n\nTwo clinical threads.\n\nOne. Protective withdrawal is a skill, and we teach it as a symptom. Stopping an activity that has become unsafe is exactly what we would want from any client. When an elite performer does it, a large portion of the public reads it as failure of character - the word \"quitter\" was everywhere that week. Watch your own reaction, because your clients are watching theirs.\n\nTwo, briefly, because it belongs here and we are not making it a full case tonight. The same summer, a tennis player took a very similar hit for a very similar reason - she declined a press obligation citing her mental health, was fined before she ever explained why, and disclosed her reasons only after the penalty was already public. The accommodation cost her the privacy. That exact structure - you may have this accommodation, but only after you hand over your diagnosis - is what the next breakout is built around. Keep her in the back of your mind; we are not naming her case, but the mechanism is the one you are about to practice with.\n\n[DISCUSS 4 min - who in your caseload has stopped something and been read as weak for it, when stopping was the competent choice?]\n\n[NOTE - and hold this thread for two segments from now. There is a second case about this same athlete, and it is a different kind of case entirely.]"
  },
  {
    order: 8,
    type: 'lecture',
    title: 'Case B, continued - abuse survivorship and institutional betrayal',
    durationMin: 15,
    prompt: 'The same athlete, sworn testimony, a different kind of case. Content advisory: sexual abuse.',
    script: "[NOTE - flag this explicitly before you start. This segment concerns sexual abuse and institutional failure. Say plainly that anyone who needs to step out should, and that there is no need to explain why.]\n\nCase B, part two, and I want to be direct about why this is a separate segment and not a continuation of the last one. The withdrawal in Tokyo and what I am about to cover happened to the same person. They are not the same story, and blending them would flatten both. The course's own standard is not to combine a person's unrelated disclosures into one narrative just because they share a name.\n\nOn September 15, 2021, Simone Biles testified before the United States Senate Judiciary Committee, alongside three other gymnasts, about the FBI's handling of the Larry Nassar investigation. This is sworn congressional testimony - a transcript, not reporting.\n\n[SLIDE - the exact language, on screen, read it as written]\n\nShe said: \"I am also a survivor of sexual abuse, and I believe without a doubt that the circumstances that led to my abuse, and allowed it to continue, are directly the result of the fact that the organizations created by Congress to oversee and protect me as an athlete - USA Gymnastics and the United States Olympic and Paralympic Committee - failed to do their jobs.\" She testified that it \"truly feels like the FBI turned a blind eye to us,\" and stated plainly: \"the impact of this man's abuse will never be over.\"\n\n[NOTE - do not summarize this in softer language than she used. She used precise words on purpose, under oath. Read them as written, then let the room sit with it before moving to the clinical point.]\n\nTwo concepts, and they are the reason this case belongs in a course for clinicians rather than a current-events segment.\n\nInstitutional betrayal - the term is Jennifer Freyd's, from the trauma literature - names harm caused not by the original abuse alone but by the institution's failure to prevent, respond to, or acknowledge it. Biles' testimony is naming exactly this: the abuse and the institutional failure as two distinguishable, both-real harms. Clients describe this constantly without the vocabulary for it - the assault, and separately, being disbelieved, delayed, or protected-around by the people whose job was to protect them. Both wounds need naming in treatment. Neither substitutes for the other.\n\nDelayed disclosure is not evidence against credibility. Nassar's abuse spanned decades before public accountability began in 2016. A clinician working with any survivor should expect and normalize a long gap between the event and the disclosure, and should never treat that gap as a reason for suspicion - in the client's account or in their own clinical judgment.\n\n[DISCUSS 5 min - a client discloses institutional betrayal alongside an assault - a school, a workplace, a family, a licensing board, a treatment program that looked away. How do you hold both harms in the treatment plan without letting one eclipse the other?]\n\n[NOTE - watch for clinicians who default to processing the assault and treating the institutional-failure anger as a distraction from the \"real\" work. Freyd's research says the reverse can be true: unaddressed institutional betrayal predicts worse outcomes independent of assault severity. Both are the real work."
  },
  {
    order: 9,
    type: 'breakout',
    title: 'The accommodation conversation',
    durationMin: 15,
    prompt: 'Groups. Your client needs an accommodation and does not want to disclose. Draft what you would actually say.',
    script: "[BREAKOUT 10 min, groups of 3-4.]\n\n[SLIDE - the scenario. Your client is a fifth-year associate at a firm. She has been in treatment with you for seven months. She needs to be off the trial team for one matter - it is the specific case, not the work in general, and she is clear about why. Her firm has a process: accommodation requests route through HR, and HR asks for documentation naming a condition and functional limitations. She tells you she would rather grind through the trial than have that document exist. She is probably right about what it would do to her partnership track. She is asking what you think she should do.]\n\n[SLIDE - the four questions:\n1. What can you write that is true, sufficient for the request, and discloses the least? Actually draft the sentence.\n2. She is asking for advice on a career decision, not a clinical one. Where is the line between supporting her decision-making and making the decision for her?\n3. If she chooses to grind through it and you believe that is the more harmful path - what do you do with that, and where does it go in the record?\n4. She asks you directly: \"What would you do?\" Answer it out loud, in the words you would actually use.]\n\n[NOTE - number 1 is the one with a real technical answer and most rooms undershoot it. Functional limitation language without diagnostic language is usually sufficient and is standard practice. \"Is currently under my care and would benefit from a temporary adjustment to caseload composition through such-and-such date\" carries no diagnosis. Many clinicians do not know they are permitted to write it that way, and their clients pay for that gap in privacy - the exact structure from the accommodation-tax pattern two segments back.\n\nNumber 3 is where values leak. Listen for anyone who would document their disagreement in a way that reads as building a defense rather than recording clinical reasoning. Name it gently - ACA A.4.b, avoiding the imposition of values, is in the room whether we invite it or not.\n\nNumber 4 will split the groups and should. There is no settled answer; say so.]\n\n[DO - report out 5 min. Ask two groups to read their actual drafted sentence from question 1 aloud. Compare the disclosure footprint of the two versions side by side. That comparison is the single most portable thing in this segment.]"
  },
  {
    order: 10,
    type: 'lecture',
    title: 'Case C - Tourette syndrome and public stigma',
    durationMin: 20,
    prompt: "A neurological disorder, disclosed on camera, and the specific way an audience gets it wrong.",
    script: "Case C. This is the case most of you have the least clinical background for walking in, which is exactly why it is here.\n\nIn a 2022 Netflix interview with David Letterman, Billie Eilish talked at length about living with Tourette syndrome, diagnosed when she was eleven. In her own words: \"These are things you would never notice if you're just having a conversation with me, but for me, they're exhausting.\" And on how people respond to her tics: \"It's really weird, I haven't talked about it at all. The most common way that people react is they laugh because they think I'm trying to be funny. They think I'm going [imitates tic] as a funny move. And so they go, 'Ha,' and I'm always left incredibly offended by that.\"\n\n[SLIDE - both quotes, full, on screen]\n\n[NOTE - sit with the second quote before moving on. She is describing the exact mechanism of stigma from inside it: a symptom, misread as performance, met with laughter, and the cost of that misreading landing on her every single time. Most stigma research describes this abstractly. She narrated it.]\n\nThree things a generalist clinician - meaning most of you, since almost none of you specialize in tic disorders - should walk away knowing.\n\nOne. Tics are involuntary, and they are frequently suppressible for short periods at real cost. A client who \"holds it together\" in your session and appears symptom-free may be spending significant effort doing so, then decompensating the moment they are alone. Ask directly whether what you are observing in the room matches what happens outside it.\n\nTwo. The differential that gets missed. A tic is a sudden, rapid, non-rhythmic movement or vocalization. It is easily confused, by non-specialists, with a compulsion - but compulsions are typically performed to reduce distress from an obsession, while tics are frequently preceded by a premonitory urge and are not tied to a specific feared outcome. Getting this wrong means offering ERP for something that is not OCD, or missing a genuine tic disorder entirely.\n\nThree, and this is Eilish's point exactly. The social response to a visible, involuntary symptom - being laughed at, assumed to be performing - is its own independent stressor, separate from the neurological condition itself. Treatment that addresses only the tics and never the client's relationship to being watched and misread is treating half the problem.\n\n[DISCUSS 5 min - has a client of yours managed a visible symptom - a tic, a stutter, a tremor, a limp - that other people routinely misread? What did that misreading cost them, separate from the symptom itself?]\n\n[NOTE - drive toward the distinction between the symptom burden and the social-response burden. They require different interventions. Psychoeducation for the client's own understanding of the condition is one track; work on the shame response to being misread by others is a separate, equally necessary track."
  },
  {
    order: 11,
    type: 'lecture',
    title: 'Case D - eating disorders and body image under public scrutiny',
    durationMin: 20,
    prompt: 'A magazine cover, a documentary confession, and a distorted baseline that read as normal.',
    script: "Case D.\n\nIn Miss Americana, the 2020 Netflix documentary, Taylor Swift described a specific triggering event and a specific behavioral response, both in her own words. At eighteen, a magazine ran a cover suggesting she might be pregnant, because of how a piece of clothing sat on her stomach in a photo. Her own account: \"It's not good for me to see pictures of myself every day... if I see a picture of myself and I feel like I looked to heavy... I just starve a little bit - just stop eating.\"\n\n[SLIDE - the quote in full]\n\nAnd this line, which is the clinical center of the case: \"I thought that I was supposed to feel like I was going to pass out at the end of a show, or in the middle of it. Now I realize, no, if you eat food, have energy, get stronger, you can do all these shows and not feel [enervated].\"\n\n[NOTE - read that second quote slowly. She is describing a normalized internal standard so distorted that near-fainting from restriction read, to her at the time, as the expected cost of doing her job. She did not experience it as a symptom. She experienced it as normal.]\n\nThis is the single most transferable diagnostic point in tonight's whole course, so slow down here.\n\nRestriction does not always present as a client naming restriction. It frequently presents as a client describing exhaustion, dizziness, or \"just how performance goes\" as an unremarkable fact about their job, their sport, their body, their industry - never once labeling it as a symptom, because to them it is not one. If your intake relies on a client volunteering \"I think I have an eating disorder,\" you will miss this exact presentation, every time.\n\nTwo mechanisms worth naming explicitly. Appearance-based triggering: an external image or comment - a magazine cover, a comment section, a costume fitting - functioning as a discrete trigger for a restriction episode, not a vague mood shift. And body-checking as an unexamined daily habit: \"seeing pictures of myself every day\" was, by her own account, itself the mechanism, not incidental to it.\n\n[DISCUSS 5 min - has a client described an exhausted or depleted state as simply \"how the job is\" or \"how touring is\" or \"how the industry is\" - normalizing something that, described plainly, sounds like restriction or overexertion? What question would have surfaced it sooner?]\n\n[NOTE - push toward specific screening language: not \"do you have an eating disorder\" but \"walk me through what you actually ate yesterday,\" and \"what happens after you see a photo of yourself you don't like.\" Behavioral specificity catches what self-labeling misses."
  },
  {
    order: 12,
    type: 'break',
    title: 'Break',
    durationMin: 15,
    prompt: 'Fifteen minute break — back at 10:00 ET. The attendance clock pauses; break time is excluded from the CE denominator.'
  },
  {
    order: 13,
    type: 'lecture',
    title: 'Case E - occupational strain, sleep, and the "strong one" role',
    durationMin: 20,
    prompt: 'What is usable, what is not, and why the difference matters more here than anywhere else tonight.',
    script: "Welcome back. Case E, and I want to open with a correction to something you will find everywhere online, because it is the clearest live example all night of tier three material disguised as tier one.\n\nSearch \"Beyoncé mental health\" and you will find dozens of wellness sites stating, as settled fact, that she \"was diagnosed with clinical anxiety, depression, and PTSD\" in 2018. None of them link to her saying this. I could not trace it to anything she has stated herself, in an interview, a documentary, or a public letter. Under tonight's standard, that sentence is not usable, no matter how many sites repeat it - and repetition is precisely what makes tier-three material feel like tier one. We are not going to use it, and if you have heard it before tonight, you should update what you know.\n\n[SLIDE - the aggregator claim, crossed out]\n\nHere is what she has actually said, in her own words, which is a different and genuinely useful case.\n\nOn insomnia across a touring career: she has described struggling with insomnia \"from touring for more than half of my life.\" On the cost of a specific role: \"I think, like many women, I have felt the pressure of being the backbone of my family and my company and didn't realize how much that takes a toll on my mental and physical well-being. I have not always made myself a priority.\" And, more simply: \"Mental health is self-care too.\"\n\n[SLIDE - the three real quotes]\n\nThree clinical threads, all supportable by what she actually said.\n\nOne. Chronic sleep disruption from occupational demands is a legitimate, underdiagnosed presenting concern in its own right - not merely a symptom of something else. A touring career, shift work, caregiving, on-call medicine: all produce a comparable pattern, and it deserves direct treatment, not a footnote while you look for the \"real\" diagnosis underneath it.\n\nTwo. The \"backbone\" role. A client who names themselves as the one who holds a family, a team, or a company together is describing a specific occupational and relational structure with its own burnout profile - one where the client's own distress signals get systematically deprioritized, by the client themselves, because attending to them feels like abandoning the role. \"I have not always made myself a priority\" is a sentence worth having a client say back to you.\n\nThree, and this is where tonight's opening lesson pays off directly. Everything usable in this case is thinner than a diagnosis - and that is fine. A course, or a clinical impression, does not need a diagnosis to be useful. Occupational strain, sleep disruption, and role-based self-neglect are real, treatable, well-evidenced concerns entirely on their own. The impulse to reach past what someone actually said toward something more clinically dramatic is precisely the impulse this whole evening has been training you to resist.\n\n[DISCUSS 5 min - where in your own caseload have you been tempted to reach for a bigger diagnosis than the material in front of you actually supports?]\n\n[NOTE - this is the most self-implicating discussion of the night. Let it be uncomfortable. The habit of reaching for drama is not unique to tabloid writers."
  },
  {
    order: 14,
    type: 'discussion',
    title: 'Five cases, one caseload — applying it',
    durationMin: 15,
    prompt: 'Which case from tonight maps onto someone you are treating right now?',
    script: "Quick integration before we close out the content.\n\n[DO 4 min, individually and silently - of the five cases tonight - capacity and least restrictive alternative, protective withdrawal, institutional betrayal, the misread visible symptom, restriction disguised as normal, occupational strain and the backbone role - which one is closest to a client you are treating right now? Write the client's presentation in one sentence, without identifying detail, next to the case it maps to.]\n\n[DISCUSS 8 min - take five or six, spread across different cases if the room allows it. For each, ask: what is one thing from tonight's segment on that case you would do differently in your next session with that client?]\n\n[NOTE - resist the pull to let this become a re-teaching of the content. The value here is entirely in the specificity of the transfer - a real client, a real next action - not in restating the lecture. If someone gives you a generality, ask them to make it a sentence they would actually say in session.]\n\n[NOTE - if institutional betrayal gets underrepresented in the discussion, ask directly: has a client ever described being failed by an institution - a school, a workplace, a licensing board, a treatment program - separately from whatever the original harm was? That case is the one clinicians are least trained to hear because it does not map onto a DSM code."
  },
  {
    order: 15,
    type: 'discussion',
    title: 'Werther, Papageno, and what happened after August 2014',
    durationMin: 15,
    prompt: 'The evidence that how a story is told changes who lives. Safe messaging, applied to your own words.',
    script: "This is the segment where the research is unambiguous, and I want to be careful with it because we are about to discuss a death.\n\n[NOTE - flag it before you say it. Some people in this room have lost someone. Give them the exit and mean it.]\n\nTwo named effects. The Werther effect - Phillips, 1974 - is the documented increase in suicides following certain kinds of media coverage of a suicide. The Papageno effect - Niederkrotenthaler and colleagues, 2010, in the British Journal of Psychiatry - is the opposite, and it is the one nobody knows: coverage that focuses on coping, on getting through the crisis, is associated with a protective effect.\n\nSo the finding is not that talking about it is dangerous. The finding is that how it is told changes the direction of the effect.\n\nThe hardest data point. Robin Williams died on August 11, 2014. Fink, Santaella-Tenorio and Keyes published an analysis in PLOS ONE in 2018 finding a roughly ten percent increase in US suicides over the following months above what models projected, concentrated in men aged thirty to forty-four, and with a marked increase in the specific method that had been widely reported.\n\n[NOTE - that last clause is the whole safe-messaging literature in one line. Method detail was reported, and method-specific deaths rose. Let the silence sit after you say it. Do not rush into the next sentence.]\n\n[DISCUSS 5 min - you are a clinician with a public-facing anything. A newsletter, a practice Instagram, a podcast, a comment to a reporter, a post the morning a famous person dies. What are your rules, written in advance, before you are the one with the trembling hands and the post half typed?]\n\n[NOTE - drive toward concrete rules, not sentiment: no method, no location, no simplified single cause, no framing that reads as inevitable, always resources, always the message that treatment works. Name the relevant provisions - ACA C.6.c media presentations, APA 5.04 - and then say the practical thing: the most common failure is not a clinician saying something reckless, it is a clinician saying something well-intentioned at 11pm about a person they never met.]\n\nNow the other half of this, which is the part that actually happens to you.\n\n[DISCUSS 5 min - it is the morning after. Three clients in a row bring it up, and one of them has a history you are worried about. What is your first sentence? Not your assessment - your first sentence.]\n\n[NOTE - what to surface: do not lead with the news, lead with them. Ask what they made of it before you offer anything. Screen, do not assume - for some clients this is a news event and treating it as a trigger creates one. And for the client you are worried about, the disclosure of concern is itself the intervention: name that you thought of them when you heard it.]\n\n[NOTE - close the segment on Papageno, not Werther. Safe messaging is not censorship. The coverage that helps is documented to exist. Say the helpful thing, on purpose, in the right shape.]"
  },
  {
    order: 16,
    type: 'discussion',
    title: 'Close - three sentences in the file',
    durationMin: 10,
    prompt: 'One change, written down, before you log off. Then certificate and evaluation logistics.',
    script: "Four hours, five cases, one constraint we held the whole way: we never diagnosed anybody, and when the aggregator internet handed us a ready-made diagnosis for tonight's last case, we said no to it out loud.\n\nAnd notice what saying no bought us instead. We got capacity and the least restrictive alternative. We got protective withdrawal and, in the very next segment, a separate and harder case about institutional betrayal in the same person - two different wounds that do not collapse into one story. We got a visible neurological symptom and the specific way an audience turns it into a joke. We got a distorted baseline so normalized it read as the ordinary cost of a job. And we got a case built entirely from three real sentences after we discarded the one sentence everyone else was using, and it was still clinically useful - more useful, because it stayed inside what was actually said.\n\nThat is the argument, all the way through. The rule was never the obstacle. Reaching for something more dramatic than the record supports is just the laziest available use of the material - and it is available to you too, not only to the blogs.\n\n[DO 3 min, individually - write one thing. Not a summary. One specific change, and when. The capacity conversation you have not had with the client under somebody else's authority. The institutional-betrayal question you will start asking survivors, separate from the assault itself. The screening language for restriction disguised as normal. The sentence you will use next time a client's exhaustion sounds like \"just how the job is.\" One. With a date.]\n\n[DO - report out 3 min, three or four out loud. Take the most specific ones, not the most impressive ones.]\n\n[NOTE - close on the through-line, not on logistics. Every case tonight was built from what a real person actually said or swore to, and nothing else. Some of your clients are deciding right now whether to say something true out loud to one person. What they have watched happen to the famous - misread, laughed at, aggregated into a diagnosis they never claimed - is part of that calculation. Knowing that is the clinical use of all of this.]\n\n[DO - last 2 min, logistics, brisk: the evaluation link, the attestation, and the attendance requirement - 90% of instructional minutes, breaks excluded. Certificates issue after attendance reconciles. Tell them where to look and who to email if theirs does not arrive.]"
  }
];

const NEW_DESCRIPTION = [
  'A live, case-based CE course built entirely on what well-known people have said about their own mental',
  'health in public - and on sworn record. No living person is diagnosed, formulated, or assessed in this',
  'course. That constraint is the curriculum: it is the working model for how a clinician engages public',
  'mental-health narrative without violating the APA Goldwater Rule (Section 7, Annotation 3), ACA C.6.c and',
  'E.5.d, APA Standard 5.04, or the NBCC provisions on public statements.',
  '',
  'Five cases carry the evening: a conservatorship and the capacity questions it raises; the same elite',
  'athlete\'s protective withdrawal from competition and, in a separate segment with its own content advisory,',
  'her sworn congressional testimony on abuse and institutional betrayal; a visible neurological symptom and',
  'the specific way an audience turns it into a joke; an eating-disorder presentation so normalized it read',
  'as the ordinary cost of a career; and a case built by deliberately rejecting an unsourced diagnostic claim',
  'in favor of only what the person actually said.',
  '',
  'Learning objectives. By the end of this course participants will be able to:',
  '1. Apply the Goldwater Rule and the corresponding ACA, APA, and NBCC provisions to distinguish permissible',
  '   public commentary from prohibited diagnosis of a person the clinician has not examined.',
  '2. Evaluate the sourcing of public mental-health claims using a three-tier standard (first-person disclosure,',
  '   sworn record, and everything else), and identify aggregator claims that mimic tier-one sourcing through',
  '   repetition alone.',
  '3. Analyze capacity as decision-specific and time-limited, and identify supported decision-making and other',
  '   less restrictive alternatives to substituted judgment for clients under protective arrangements.',
  '4. Differentiate institutional betrayal from the underlying trauma it compounds, and integrate both as',
  '   distinct treatment targets for survivors of abuse within an institutional setting.',
  '5. Distinguish tic disorders from compulsions in differential assessment, and address the social-response',
  '   burden of a visible involuntary symptom as a treatment target separate from the symptom itself.',
  '6. Identify behavioral presentations of restriction that a client has normalized rather than labeled as',
  '   symptomatic, and apply behaviorally specific screening language to surface them.',
  '',
  'Level: Intermediate. Format: live, synchronous, interactive (polls, breakouts, facilitated discussion).',
  'Attendance of at least 90% of instructional minutes is required for the CE certificate. The two declared',
  'breaks are excluded from the attendance denominator. Content includes discussion of sexual abuse,',
  'institutional betrayal, and eating disorders; the facilitator flags each before it arises.'
].join('\n');

/* ── Run ───────────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY (updating)' : 'DRY RUN (nothing written)'}\n` + '='.repeat(92));

  const existing = await LiveSession.findOne({ slug: SLUG });
  if (!existing) throw new Error(`No session found with slug "${SLUG}". Nothing to update.`);
  if (existing.sessionType !== 'live-course') throw new Error(`sessionType '${existing.sessionType}' — expected live-course. Refusing to touch.`);
  if (existing.status !== 'scheduled') throw new Error(`status '${existing.status}' — expected scheduled. Refusing to touch.`);

  // CE math, checked before anything else.
  const agendaMin = sumMin(AGENDA);
  const breakRows = AGENDA.filter(a => a.type === 'break');
  const breakMin = sumMin(breakRows);
  const instructionalMin = agendaMin - breakMin;
  if (instructionalMin !== NEW_CEU_HOURS * 60) {
    throw new Error(`Run of show is ${instructionalMin} instructional min; ceuHours ${NEW_CEU_HOURS} requires ${NEW_CEU_HOURS * 60}. Fix AGENDA.`);
  }
  if (breakRows.length !== 2) throw new Error(`Expected exactly 2 break rows, found ${breakRows.length}.`);
  AGENDA.forEach((a, i) => { if (a.order !== i) throw new Error(`Agenda order is not 0..n at index ${i} (order ${a.order}).`); });

  const start = new Date(existing.scheduledStart);   // UNCHANGED — 6:30pm ET stays 6:30pm ET
  const newEnd = new Date(start.getTime() + agendaMin * 60000);

  const newBreaks = AGENDA
    .filter(a => a.type === 'break')
    .map(a => ({
      label: a.title || 'Break',
      startsAt: new Date(start.getTime() + sumMin(AGENDA.slice(0, a.order)) * 60000),
      durationMin: a.durationMin
    }));

  // ── before/after diff ──────────────────────────────────────────────────
  const oldAgendaMin = sumMin(existing.agenda || []);
  const oldBreakMin = sumMin((existing.agenda || []).filter(a => a.type === 'break'));
  console.log(`\n"${existing.title}"  (slug: ${SLUG}, _id: ${existing._id})`);
  console.log('\n  FIELD              BEFORE                          AFTER');
  console.log(`  ceuHours           ${String(existing.ceuHours).padEnd(30)}  ${NEW_CEU_HOURS}`);
  console.log(`  scheduledStart     ${fmt(existing.scheduledStart).padEnd(30)}  ${fmt(start)}  (unchanged)`);
  console.log(`  scheduledEnd       ${fmt(existing.scheduledEnd).padEnd(30)}  ${fmt(newEnd)}`);
  console.log(`  window             ${(oldAgendaMin) + ' min (' + (oldAgendaMin-oldBreakMin) + ' instr)'.padEnd(14)}  ${agendaMin} min (${instructionalMin} instr)`);
  console.log(`  agenda rows        ${String((existing.agenda||[]).length).padEnd(30)}  ${AGENDA.length}`);
  console.log(`  breaks             ${String((existing.breaks||[]).length).padEnd(30)}  ${newBreaks.length}`);
  console.log(`  price (unchanged)  $${existing.price}`);
  console.log(`  includedInSubscription (unchanged)  ${existing.includedInSubscription}`);
  console.log(`  isPublished (unchanged)  ${existing.isPublished}`);

  console.log(`\n  New run of show — ${AGENDA.length} segments, ${AGENDA.filter(a => a.script).length} scripted\n`);
  for (const a of AGENDA) {
    const at = clock(new Date(start.getTime() + sumMin(AGENDA.slice(0, a.order)) * 60000));
    console.log(`   ${String(a.order).padStart(2)}  ${at.padStart(8)}  ${String(a.durationMin).padStart(3)}m  ${a.type.padEnd(10)} ${a.title}`);
  }

  // Apply the changes to an in-memory clone and run the model's own hard-locks
  // (validate) before ever touching the database.
  existing.ceuHours = NEW_CEU_HOURS;
  existing.scheduledEnd = newEnd;
  existing.agenda = AGENDA;
  existing.breaks = newBreaks;
  existing.description = NEW_DESCRIPTION;
  existing.markModified('agenda');
  existing.markModified('breaks');
  await existing.validate();
  console.log('\n  validate() OK');

  if (!APPLY) {
    console.log('\n' + '='.repeat(92));
    console.log('DRY RUN — nothing was written. Re-run with --apply to update.');
    await mongoose.disconnect();
    return;
  }

  await existing.save();

  const fresh = await LiveSession.findOne({ slug: SLUG }).lean();
  if (!fresh) throw new Error('Read-back FAILED: session not found after save.');
  const freshBreakMin = (fresh.breaks || []).reduce((n, b) => n + b.durationMin, 0);
  const freshWindow = Math.round((new Date(fresh.scheduledEnd) - new Date(fresh.scheduledStart)) / 60000);
  const scripted = (fresh.agenda || []).filter(a => a.script && a.script.length).length;

  console.log('\n' + '='.repeat(92));
  console.log(`UPDATED  _id ${fresh._id}  (same _id — this was an edit, not a new insert)`);
  console.log(`  read-back: title "${fresh.title}"  (unchanged)`);
  console.log(`  read-back: ${fresh.agenda.length} agenda rows, ${scripted} scripted, ${fresh.breaks.length} break(s)`);
  console.log(`  read-back: window ${freshWindow} min - ${freshBreakMin} break = ${freshWindow - freshBreakMin} instructional (need ${NEW_CEU_HOURS * 60})`);
  console.log(`  read-back: ceuHours ${fresh.ceuHours}, price $${fresh.price} (unchanged), includedInSubscription '${fresh.includedInSubscription}' (unchanged)`);
  if (freshWindow - freshBreakMin !== NEW_CEU_HOURS * 60) console.log('  WARNING: instructional minutes do not match ceuHours.');

  console.log('\nNEXT — DO NOT SKIP:');
  console.log(`  1. The Whereby room still ends at the OLD time. Regenerate it now:`);
  console.log(`       node src/scripts/regenerateWherebyRoom.js --slugs ${SLUG} --apply`);
  console.log(`  2. Re-review the run of show in the admin UI before it goes live to anyone.`);
  console.log(`  3. If any handouts or clips reference the old case lineup (Osaka/Phelps/Lovato/VIP-syndrome), update or remove them.`);

  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error(`\nFAILED: ${e.message}`);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
