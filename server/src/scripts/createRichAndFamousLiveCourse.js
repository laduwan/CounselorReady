// createRichAndFamousLiveCourse.js
// Creates ONE live-course LiveSession: "Case Studies of the Rich and Famous" (3.5 CE).
//
// WHAT THIS IS
// A synchronous, Whereby-backed CE course that uses the PUBLIC SELF-DISCLOSURES of
// well-known people as teaching cases: what they said about their own experience, what
// the public did with it, and what a clinician takes back into the room on Monday.
//
// ETHICS FRAME — THIS IS THE SPINE OF THE COURSE, NOT A DISCLAIMER
// No named living person is diagnosed, formulated, or assessed anywhere in this course.
// Every case rests on one of two sources only:
//   (1) the person's own public account of their own experience, or
//   (2) sworn court record.
// That constraint is itself the teaching content. The governing provisions named in the
// scripts are the APA Goldwater Rule (Principles of Medical Ethics with Annotations
// Especially Applicable to Psychiatry, Section 7, Annotation 3), ACA Code of Ethics
// (2014) C.6.c Media Presentations and E.5.d Refraining From Diagnosis, APA Ethical
// Principles Standard 5.04 Media Presentations, and the NBCC Code of Ethics provisions
// on public statements and scope of competence.
//
// SOURCES THE FACILITATOR SCRIPTS DRAW ON (all public record)
//   Biles      Tokyo 2020 (2021) withdrawals; her own press statements on "the twisties"
//   Osaka      May 2021 Roland-Garros press withdrawal; her own statement disclosing
//              depression since the 2018 US Open and social anxiety around press
//   Phelps     his own public accounts of post-Games depression and suicidal ideation;
//              "The Weight of Gold" (HBO, 2020)
//   Love       "Everyone Is Going Through Something," The Players' Tribune, March 2018
//   DeRozan    February 2018 public statements on depression
//   Lovato     their own disclosures of a bipolar diagnosis, an eating disorder, and the
//              2018 overdose; "Dancing with the Devil" (2021); their December 2021 public
//              revision of the "California sober" position
//   Fisher     decades of her own public writing and interviews on bipolar disorder
//   Spears     the 2008-2021 conservatorship and her June 23, 2021 open-court testimony
//   Johnson    his own public accounts of depressive episodes
//   Gomez      her own 2020 disclosure of a bipolar diagnosis; "My Mind & Me" (2022)
//   Research   Phillips (1974) Werther effect; Niederkrotenthaler et al. (2010) Papageno
//              effect; Fink, Santaella-Tenorio & Keyes (2018, PLOS ONE) on the change in
//              US suicide rates after August 2014; Weintraub (1964) "The VIP syndrome"
//
// CE MATH (NBCC)
//   instructionalMinutes() = scheduled duration - declared breaks. The 6:30-10:30pm ET
//   window is 240 min; two declared 15-min breaks leave 210 instructional min = 3.5 CE.
//   The agenda totals 240 (break rows count), which is what addSessionBreak.js and
//   sessionCopyService.js check the window against.
//   If 4.0 CE is wanted instead, the window has to grow to 270 min (6:30-11:00pm) —
//   240 instructional + the same two breaks. Do not get there by deleting a break.
//
// PRICING — free to EVERY current subscriber, $115 to everyone else
//   includedInSubscription: 'any' (LiveSession field, default 'vip'). On this session any
//   paying plan — starter, professional, vip, annual_vip, lifetime — registers free as long
//   as subscription.status is 'active' or 'lifetime'. Everyone else, free-plan accounts and
//   the general public alike, goes to Stripe Checkout at $115.
//   Trials do NOT ride the subscription: status 'trial', 'past_due', 'paused', 'canceled'
//   and 'expired' all pay. Otherwise a trial account could take a 3.5 CE course and cancel.
//   The rule is per-session on purpose. Every other live session keeps the historical
//   VIP-only default, so nothing that already exists changed.
//
// NO WHEREBY ROOM IS PROVISIONED HERE. Only the admin POST route calls createMeeting().
// After --apply, mint the room:  node src/scripts/regenerateWherebyRoom.js --slugs <slug> --apply
// (or let jobs/liveSessionSelfHeal.js pick it up within 6h; /join also calls ensureRoom).
//
// SHIPS UNPUBLISHED. status 'scheduled', isPublished false. Publish from the admin UI
// after review. Recording is off: this session discusses named real people, and a
// redistributable recording is a different risk decision than a live room. Ke's call.
//
// REGISTRATION CUTOFF is the 7-day default, so sign-ups close Sept 18 for a Sept 25
// session. Pass --cutoff 0 for no cutoff, or a smaller number, if that runway is tight.
//
// SAFE BY DEFAULT: dry run prints the whole run of show and the CE math and writes
// nothing. Only --apply inserts.
//
//   node src/scripts/createRichAndFamousLiveCourse.js
//   node src/scripts/createRichAndFamousLiveCourse.js --apply
//   Optional: --start 2026-09-25T18:30  --price 115  --slug <slug>
//             --capacity <1-200>  --cutoff <0-30>
//
//   --start is Eastern wall-clock (YYYY-MM-DDTHH:mm) unless it carries an explicit
//   offset or Z, in which case it is used as given. The end time is always derived
//   from the run of show, never passed in.
//
// Requires: MONGODB_URI

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

const APPLY = process.argv.includes('--apply');
function arg(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }

const DEFAULT_START = '2026-09-25T18:30';   // Fri Sep 25, 6:30pm ET
const DEFAULT_PRICE = 115;                  // $0 for active VIP subscribers (register route)
const CEU_HOURS = 3.5;                      // 210 instructional min

/* ── Eastern wall-clock -> Date ────────────────────────────────────────────
   'America/New_York' so a start typed as 18:30 is 6:30pm ET in September AND in
   January. Two passes so the DST boundary resolves. */
function etOffsetMs(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)])
  );
  const asIfUTC = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour % 24, parts.minute, parts.second);
  return date.getTime() - asIfUTC;
}
function parseStart(raw) {
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d)) throw new Error(`--start "${raw}" is not a valid date.`);
    return d;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(raw);
  if (!m) throw new Error(`--start "${raw}" must be YYYY-MM-DDTHH:mm (Eastern) or carry an explicit offset.`);
  const [, Y, Mo, D, H, Mi] = m.map(Number);
  const naive = Date.UTC(Y, Mo - 1, D, H, Mi);
  let ts = naive + etOffsetMs(new Date(naive));
  ts = naive + etOffsetMs(new Date(ts));
  return new Date(ts);
}

const fmt = (d) => new Date(d).toLocaleString('en-US', {
  timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric',
  year: 'numeric', hour: 'numeric', minute: '2-digit'
}) + ' ET';
const clock = (d) => new Date(d).toLocaleTimeString('en-US', {
  timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit'
});
const sumMin = (a) => a.reduce((n, s) => n + (s.durationMin || 0), 0);

/* ── Run of show — 15 rows, 240 min (210 instructional + two 15 min breaks) ──
   `script` is the host-only teleprompter (live-host.html). Attendees never see it;
   they see `prompt` on the NOW card. Bracketed markers are stage directions and are
   never read aloud: [DO] [SLIDE] [POLL] [DISCUSS] [BREAKOUT] [NOTE]. */
const AGENDA = [
  {
    order: 0,
    type: 'lecture',
    title: 'Framing — the case we are not allowed to make',
    durationMin: 15,
    prompt: 'Why this course never diagnoses anyone, and why that constraint is the actual curriculum.',
    script: "Welcome in. Give people a second to land.\n\n[DO 30s - confirm audio, ask for a hello in the chat, wait for a few]\n\nI want to start by telling you what this course will not do, because that is the part worth the evening.\n\nWe are going to spend four hours on people whose names you know. And at no point tonight will I diagnose a single one of them. Not a working formulation, not a \"well, clinically that looks like,\" not a hedge with a diagnosis hiding inside it. Not once.\n\nHere is why that matters and where it comes from. The APA Goldwater Rule - Section 7, Annotation 3 - says it is unethical to offer a professional opinion about someone you have not examined and who has not authorized the statement. It was written in 1973, after a magazine polled psychiatrists about a presidential candidate and printed the answers. Our side of the house has the same rule in different words. ACA C.6.c governs what you say in media and public presentations. ACA E.5.d, refraining from diagnosis, is the one people forget exists. APA Standard 5.04 covers media presentations. The NBCC code reaches public statements and scope of competence.\n\n[SLIDE - the four provisions side by side. Leave it up while you make the next point.]\n\nNow here is the thing everybody misses. These rules do not say you cannot talk about public figures. They say you cannot render a professional opinion on someone you have not examined. That gap is enormous, and it is where this entire course lives.\n\nSo the standard for tonight, and I will hold us to it out loud: every case rests on one of exactly two sources. What the person said about their own experience, in public, in their own words. Or sworn court record. That is it. No unauthorized biography, no tabloid, no documentary voiceover, no anonymous source, and no clinical inference layered on top by me or by you.\n\n[NOTE - someone will push back that this makes the material thin. It does the opposite, and you should let them find that out rather than arguing it now. The self-disclosure record is richer than the speculation.]\n\nOne more ground rule. Some of tonight is recovery material and some is loss material. Take care of yourselves. We break at eight and again at nine thirty, and I will flag anything heavy before it arrives."
  },
  {
    order: 1,
    type: 'discussion',
    title: 'Where the room stands',
    durationMin: 10,
    prompt: 'Two polls, then say the quiet part out loud.',
    script: "Before I teach anything, I want to know where this room actually is.\n\n[POLL - \"Have you ever formed a private clinical impression about a public figure you have never met? - Yes / No\" ANONYMOUS. Close it, then reveal.]\n\n[NOTE - it lands high, usually well past three quarters. Do not treat the yes as a confession and do not let the room treat it as one. The honest frame: this is what a trained pattern-recognition system does when it is handed a pattern. Noticing is not the violation. The rules govern what you do with it.]\n\nSecond one.\n\n[POLL - \"Have you ever said that impression out loud to someone outside your household? - Yes / No\" ANONYMOUS. Reveal.]\n\n[NOTE - this one drops, and the drop is the teaching moment. The distance between the two numbers is the professional line, and the room just drew it themselves.]\n\nSo hold onto that, because here is the uncomfortable version. Your client does the same thing you just did. They form impressions of famous people and they use them - as permission, as comparison, as evidence about what is possible for them.\n\n[DISCUSS 4 min - Has a client ever brought a celebrity into your room? Whose name, and what were they using that person to say about themselves? Take three or four, do not resolve them. We come back to every one of them tonight.]\n\n[NOTE - listen for whether the client used the figure to make hope credible or to make their own suffering illegitimate by comparison. That split is Case B and Case C.]"
  },
  {
    order: 2,
    type: 'lecture',
    title: 'The sourcing standard: self-disclosure, court record, and everything else',
    durationMin: 15,
    prompt: 'What counts as a usable source, what does not, and why the boundary keeps moving.',
    script: "Let us make the sourcing standard operational, because in about twenty minutes you are going to have to apply it under time pressure.\n\n[SLIDE - three tiers]\n\nTier one, usable. First-person public account. The person, speaking about their own experience, on the record, on purpose. Kevin Love writing in The Players' Tribune in March of 2018 about the panic attack he had during a game. Naomi Osaka's own May 2021 statement that she had dealt with long bouts of depression since the 2018 US Open and struggled with anxiety around press. Michael Phelps describing, repeatedly and deliberately, the depression and the suicidal ideation that followed the Games. These are not leaks. These are people who chose the moment and the words.\n\nTier one also, usable. Sworn court record. Britney Spears testifying in open court on June 23, 2021 is a transcript. It is not reporting about her, it is her, under oath, on the record.\n\n[NOTE - say plainly why you separate these two even though both are tier one: self-disclosure is voluntary and court testimony frequently is not. Same evidentiary quality, very different consent posture. That distinction returns in Case A.]\n\nTier two, contextual only. Verifiable public events with no interior claim attached. Biles withdrew from the team final in Tokyo on July 27, 2021, then from individual finals, then returned for beam. That sequence is fact. What it felt like is only knowable from what she said about it.\n\nTier three, unusable tonight. Everything else. Unauthorized biography. A documentary's framing. Anonymous sources. Anyone's inference, mine included.\n\n[SLIDE - the three-tier card. Tell them to screenshot it; this is the transferable tool.]\n\nAnd now the hard part, which is where clinicians actually get into trouble. Disclosure is not permanent and it is not static. A person can disclose something and later revise it. Demi Lovato talked publicly about being what they called California sober, and then in December of 2021 said publicly that sober sober was the only way to be. If you built a teaching case on the first statement and never updated it, you are now teaching something the person has explicitly retracted about their own life.\n\n[NOTE - this is the single most practical point in the hour. Your source is a living person with an evolving account. Anything you cite goes stale. Build in a re-check, or do not use the case.]\n\nCarrie Fisher is the other end of that spectrum - decades of talking about bipolar disorder on purpose, in her own writing, as a deliberate public project. That is a different kind of consent than a single interview, and it is worth naming the difference."
  },
  {
    order: 3,
    type: 'breakout',
    title: 'Sorting the record',
    durationMin: 15,
    prompt: 'Groups of three or four. Sort eight statements into the three tiers, then defend the two you disagreed on.',
    script: "[BREAKOUT 10 min, groups of 3-4. Put the eight statements on screen. They sort each into tier one usable, tier two contextual, or tier three unusable, and flag the two that split the group.]\n\n[SLIDE - the eight:\n1. \"I have suffered long bouts of depression since the US Open in 2018.\" - Osaka, her own statement, May 2021.\n2. A documentary's narrator explaining what an athlete was feeling during a competition.\n3. Spears' June 23, 2021 open-court testimony about the conservatorship.\n4. A former assistant's account of a client's home life, published in a memoir.\n5. Love's own description of the onset of a panic attack during a game, Players' Tribune, March 2018.\n6. The dated fact that a competitor withdrew from a final.\n7. A clinician on a podcast offering a probable diagnosis for a public figure.\n8. An artist's own 2020 statement disclosing a bipolar diagnosis, followed by their 2022 documentary about it.]\n\n[NOTE - the intended splits. Number 3 is tier one on evidence and genuinely uncomfortable on consent; if a group just files it and moves on, push them. Number 8 is tier one twice over, and is the cleanest example of a person choosing the frame. Number 7 is the Goldwater violation and somebody will say they have heard exactly that on a podcast this month - let them say it.]\n\n[DO - report out 5 min. Take the two flagged splits, not a walkthrough of all eight.]\n\n[NOTE - the finish line for this segment: a clinician can say a great deal about a public figure without ever violating the rule, and the constraint produces better teaching material than speculation does, because it is anchored to something a real person actually decided to say.]"
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
    script: "Straight into application, no preamble.\n\n[DO 3 min, individually and silently - bring to mind one client, current or recent, who is operating under an arrangement somebody else built for them. Conservatorship, guardianship, rep payee, mandated treatment, a probation condition, a school plan, a family agreement they did not really agree to. Write down two things: what the arrangement protects against, and what it costs them.]\n\n[DISCUSS 6 min - take four or five, no names, no identifying detail. For each one ask the same two questions: is there a narrower version that meets the same protective aim, and when was the arrangement last actually reviewed by anybody?]\n\n[NOTE - what tends to surface, and name it if the room does not: nobody has reviewed it. The arrangement was built during an acute period and simply persisted, because persisting requires no one's signature and unwinding requires several. That is the transfer from Case A - not that protective arrangements are wrong, but that they are sticky, and you may be the only person in the room who is positioned to ask whether this one still fits.]\n\n[NOTE - if someone says it is not their place to raise it, that is worth two minutes. Where does documenting a concern about fit sit relative to your obligation to the client's autonomy? You are not litigating it. You are noticing it in the record.]\n\nBreak is next. Fifteen minutes. When we come back we are in elite sport, and the question changes from who decides for you to what happens when you decide for yourself in front of everybody."
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
    title: 'Case B - elite performance: protective withdrawal and the quitter narrative',
    durationMin: 25,
    prompt: 'Tokyo 2021, Roland-Garros 2021, and what the public did to two people who stopped.',
    script: "Welcome back. Case B, and this is the one your clients have already formed an opinion about.\n\nTwo events, close together, both in 2021.\n\nJuly 27, 2021, Tokyo. A gymnast withdraws from the team final, then from individual finals, and returns for the balance beam final. She says publicly that she has lost her air awareness - the twisties, in the sport's own language - and that continuing would be unsafe. She says the decision was about her mental health and about physical safety, and in that sport those are not two things.\n\n[NOTE - be precise about the twisties and do not psychologize it. It is a known, named phenomenon in gymnastics - a disruption of proprioceptive orientation mid-air. An athlete who cannot locate the floor while rotating is in physical danger, full stop. Clinicians reach for dissociation as an analogue and the analogy is instructive but it is an analogy. Say that out loud.]\n\nMay 2021, Roland-Garros. A tennis player announces she will not do press, citing her mental health. She is fined fifteen thousand dollars and the four Grand Slams issue a joint statement warning of further sanction. She withdraws from the tournament and discloses that she has dealt with long bouts of depression since the 2018 US Open and experiences anxiety around press.\n\n[SLIDE - the two timelines side by side. Note the sequencing in the second one: the sanction came first, the disclosure came after. That order is the whole point.]\n\nThree clinical threads.\n\nOne. Protective withdrawal is a skill, and we teach it as a symptom. Stopping an activity that has become unsafe is exactly what we would want from any client. When an elite performer does it, a large portion of the public reads it as failure of character. Watch your own reaction, because your clients are watching theirs.\n\nTwo. The disclosure tax. In the tennis case, the athlete tried to protect herself with a boundary and no explanation - I am not doing press - and was penalized. The disclosure came after the penalty. So the structure said: you may have this accommodation, but only if you hand over your diagnosis first. Sit with that. Your clients live it - at work, at school, with family. The accommodation costs the privacy.\n\n[NOTE - the transfer is FMLA paperwork, a 504 plan, a leave request, a supervisor asking why. Same structure. Get one example from the room if there is time.]\n\nThree. Post-achievement depression. Michael Phelps has spoken at length and on purpose about the depression and the suicidal ideation that followed the Games. Not the losses - the wins. The organizing structure ends, the identity that the structure supported has nothing to attach to, and the machinery of support that surrounded the athlete evaporates on schedule. If you treat anyone whose identity is welded to a role - athletes, surgeons, military, founders, clergy, and by the way, therapists - this is your case.\n\n[DISCUSS 4 min - who in your caseload is one ending away from this?]\n\n[NOTE - and the part clinicians miss in their own profession. We are trained to notice this pattern in everybody but ourselves. Let it land; do not soften it.]"
  },
  {
    order: 8,
    type: 'breakout',
    title: 'The accommodation conversation',
    durationMin: 15,
    prompt: 'Groups. Your client needs an accommodation and does not want to disclose. Draft what you would actually say.',
    script: "[BREAKOUT 10 min, groups of 3-4.]\n\n[SLIDE - the scenario. Your client is a fifth-year associate at a firm. She has been in treatment with you for seven months. She needs to be off the trial team for one matter - it is the specific case, not the work in general, and she is clear about why. Her firm has a process: accommodation requests route through HR, and HR asks for documentation naming a condition and functional limitations. She tells you she would rather grind through the trial than have that document exist. She is probably right about what it would do to her partnership track. She is asking what you think she should do.]\n\n[SLIDE - the four questions:\n1. What can you write that is true, sufficient for the request, and discloses the least? Actually draft the sentence.\n2. She is asking for advice on a career decision, not a clinical one. Where is the line between supporting her decision-making and making the decision for her?\n3. If she chooses to grind through it and you believe that is the more harmful path - what do you do with that, and where does it go in the record?\n4. She asks you directly: \"What would you do?\" Answer it out loud, in the words you would actually use.]\n\n[NOTE - number 1 is the one with a real technical answer and most rooms undershoot it. Functional limitation language without diagnostic language is usually sufficient and is standard practice. \"Is currently under my care and would benefit from a temporary adjustment to caseload composition through such-and-such date\" carries no diagnosis. Many clinicians do not know they are permitted to write it that way, and their clients pay for that gap in privacy.\n\nNumber 3 is where values leak. Listen for anyone who would document their disagreement in a way that reads as building a defense rather than recording clinical reasoning. Name it gently - ACA A.4.b, avoiding the imposition of values, is in the room whether we invite it or not.\n\nNumber 4 will split the groups and should. There is no settled answer; say so.]\n\n[DO - report out 5 min. Ask two groups to read their actual drafted sentence from question 1 aloud. Compare the disclosure footprint of the two versions side by side. That comparison is the single most portable thing in this segment.]"
  },
  {
    order: 9,
    type: 'lecture',
    title: 'Case C - public recovery: relapse, revision, and the figurehead problem',
    durationMin: 20,
    prompt: 'What it costs to recover in public, and what your client is doing with the story.',
    script: "Case C. Public recovery.\n\nThe pattern first, then the people. Someone discloses. The disclosure is received as courageous - and it is. They become, whether or not they asked to be, a figurehead. And then recovery does what recovery does, which is not proceed in a straight line. Now the non-linearity is public too, and it is read as the story failing rather than as the way the thing actually works.\n\nDemi Lovato has disclosed, in their own words, a bipolar diagnosis, an eating disorder, and the 2018 overdose. They made a documentary about it in 2021. They also, in December 2021, publicly revised a position they had previously stated publicly about their own recovery approach. That revision is the most clinically useful moment in the whole record, and it is the one that gets the least attention.\n\n[NOTE - do not evaluate either position. That is not the point and it is outside the sourcing standard. The point is that a person in recovery updated their own account of their own recovery in public, which is both completely ordinary and, for a figurehead, extraordinarily costly.]\n\nCarrie Fisher is the counterexample and the reason this segment is not only cautionary. Decades of talking about bipolar disorder and addiction on her own terms, in her own writing, with humor as the delivery mechanism rather than the avoidance. She was not made into a figurehead - she took the job. That is a materially different consent posture and it produced a materially different outcome.\n\n[SLIDE - three things public recovery narratives do to your clients]\n\nOne, permission. This is real and it is the good news. A famous person's disclosure lowers the cost of the first sentence in your office. When Kevin Love published his essay in March 2018 and DeMar DeRozan spoke publicly that February, something moved in a population - men in a high-status, high-masculinity workplace - that we had spent decades failing to reach. Peer disclosure did what psychoeducation could not.\n\nTwo, the comparison trap. \"She has a whole team and she still could not stay well, so what chance do I have.\" Or the inverse and more common one: \"He got through it in eighteen months, so what is wrong with me.\" Your client is running a comparison against a public narrative that has been compressed, edited, and stripped of the resources that made it possible.\n\nThree, the collapse. When the figurehead relapses, some clients read it as proof the whole enterprise is fraudulent. That is a clinical event in your room with an external trigger you did not see coming. Be ready for it.\n\n[DISCUSS 5 min - has a public relapse ever landed in one of your sessions? What did your client do with it?]\n\n[NOTE - the takeaway to name: your client is not tracking these people for entertainment. They are running a feasibility study on their own recovery, using the only longitudinal data they have access to. Treat it as data they are using, because they are.]"
  },
  {
    order: 10,
    type: 'discussion',
    title: 'Werther, Papageno, and what happened after August 2014',
    durationMin: 15,
    prompt: 'The evidence that how a story is told changes who lives. Safe messaging, applied to your own words.',
    script: "This is the segment where the research is unambiguous, and I want to be careful with it because we are about to discuss a death.\n\n[NOTE - flag it before you say it. Some people in this room have lost someone. Give them the exit and mean it.]\n\nTwo named effects. The Werther effect - Phillips, 1974 - is the documented increase in suicides following certain kinds of media coverage of a suicide. The Papageno effect - Niederkrotenthaler and colleagues, 2010, in the British Journal of Psychiatry - is the opposite, and it is the one nobody knows: coverage that focuses on coping, on getting through the crisis, is associated with a protective effect.\n\nSo the finding is not that talking about it is dangerous. The finding is that how it is told changes the direction of the effect.\n\nThe hardest data point. Robin Williams died on August 11, 2014. Fink, Santaella-Tenorio and Keyes published an analysis in PLOS ONE in 2018 finding a roughly ten percent increase in US suicides over the following months above what models projected, concentrated in men aged thirty to forty-four, and with a marked increase in the specific method that had been widely reported.\n\n[NOTE - that last clause is the whole safe-messaging literature in one line. Method detail was reported, and method-specific deaths rose. Let the silence sit after you say it. Do not rush into the next sentence.]\n\n[DISCUSS 5 min - you are a clinician with a public-facing anything. A newsletter, a practice Instagram, a podcast, a comment to a reporter, a post the morning a famous person dies. What are your rules, written in advance, before you are the one with the trembling hands and the post half typed?]\n\n[NOTE - drive toward concrete rules, not sentiment: no method, no location, no simplified single cause, no framing that reads as inevitable, always resources, always the message that treatment works. Name the relevant provisions - ACA C.6.c media presentations, APA 5.04 - and then say the practical thing: the most common failure is not a clinician saying something reckless, it is a clinician saying something well-intentioned at 11pm about a person they never met.]\n\nNow the other half of this, which is the part that actually happens to you.\n\n[DISCUSS 5 min - it is the morning after. Three clients in a row bring it up, and one of them has a history you are worried about. What is your first sentence? Not your assessment - your first sentence.]\n\n[NOTE - what to surface: do not lead with the news, lead with them. Ask what they made of it before you offer anything. Screen, do not assume - for some clients this is a news event and treating it as a trigger creates one. And for the client you are worried about, the disclosure of concern is itself the intervention: name that you thought of them when you heard it.]\n\n[NOTE - close the segment on Papageno, not Werther. Safe messaging is not censorship. The coverage that helps is documented to exist. Say the helpful thing, on purpose, in the right shape.]"
  },
  {
    order: 11,
    type: 'break',
    title: 'Break',
    durationMin: 15,
    prompt: 'Fifteen minute break — back at 9:45 ET. The attendance clock pauses; break time is excluded from the CE denominator.'
  },
  {
    order: 12,
    type: 'lecture',
    title: 'Treating the famous: VIP syndrome, NDAs, and the entourage',
    durationMin: 20,
    prompt: 'If a high-profile client walked into your practice next month, what would break first?',
    script: "Welcome back. Last piece of content, and it flips the frame. Everything so far has been about famous people as material. This is about famous people as clients - yours, possibly, and sooner than you think, because high-profile is local. A school board member, a megachurch pastor, a college coach, the doctor everybody in town uses, someone with four hundred thousand followers in a niche you have never heard of. Same dynamics, smaller stage.\n\n[SLIDE - VIP syndrome, Weintraub 1964]\n\nThe term is sixty years old and comes out of hospital psychiatry. Weintraub described what happens to a treatment team when the patient is important: the routine gets suspended. Rules bend. Access changes. Documentation gets thinner because someone might read it. And here is the finding that matters - the special treatment produces worse care, not better. The deviations are what harm the patient.\n\nThat is the whole warning. When you are tempted to make an exception for a high-profile client, the exception is the risk.\n\n[SLIDE - four pressures]\n\nOne. Schedule and access. The after-hours request, the text thread, the session that moves for a shoot. Some flexibility is legitimate accommodation of a genuinely irregular life. The tell is whether the frame is being adapted or dissolved - and whether you would offer the same adaptation to a client who works a rotating hospital shift.\n\nTwo. Documentation. The instinct is to write less because of who might subpoena it. That instinct is backwards. A thin record is what fails you in a proceeding, and a client whose care is under-documented is receiving worse care. Write the same note you would write for anybody.\n\nThree. NDAs and confidentiality. You are already bound; an NDA adds nothing to your obligation and can add terms that conflict with it. If their attorney sends one, it goes to yours, and you never sign anything that restricts your mandatory reporting, your consultation, or your ability to respond to a board inquiry. Watch for the clause that quietly does exactly that.\n\n[NOTE - this is the single most practical thing in the segment. Say the sentence slowly. Clinicians sign these.]\n\nFour. The entourage. Manager, publicist, agent, assistant, parent. Somebody may be paying. Somebody will call you. Somebody will want a debrief. Get the informed consent architecture right at intake, in writing - who the client is, who may be contacted, what may be said, and what happens to the clinical relationship if the person paying is not the person in the chair.\n\n[SLIDE - and two that nobody warns you about]\n\nThe fee drift. A high-profile client can pay more, and there is a pull to charge more because they can. Know what your fee is and what would actually justify changing it, before the question arrives.\n\nAnd the small-community problem, which is the version most of you will actually face. In a small town or a tight professional community, the high-profile client is somebody you will see at the grocery store, whose spouse is on your kid's PTA, whose name comes up at every dinner party. Manage that at intake, out loud, with a plan you both agreed to - not in the aisle at Kroger when it is already happening.\n\n[NOTE - and the countertransference nobody volunteers: the pull of being the one they trust. Weintraub's paper is substantially about clinicians enjoying proximity to importance and calling it clinical judgment. Say it plainly and let the discomfort do the work.]"
  },
  {
    order: 13,
    type: 'breakout',
    title: 'Pre-deciding the four pressures',
    durationMin: 15,
    prompt: 'Groups. Take one pressure and write the actual policy sentence — the one you would read aloud at intake.',
    script: "The point of this one is that you leave with words, not principles. Principles do not survive the moment. A sentence you have already written does.\n\n[BREAKOUT 10 min, groups of 3-4. Assign each group ONE pressure - schedule and access, documentation, NDAs and third-party contracts, or the entourage and who may contact you. Two groups can share a pressure in a big room.]\n\n[SLIDE - what each group produces, in writing:\n1. The policy sentence, as you would actually say it at intake, out loud, to a real person. Plain words. No jargon.\n2. The exception you WOULD make, and the reason it is an accommodation rather than a deviation.\n3. The exception you would NOT make, no matter who asked.\n4. Where the decision gets documented, and in what words.]\n\n[NOTE - drive them past the abstraction. \"I maintain firm boundaries\" is not a sentence, it is a posture. \"I return messages within one business day, and anything urgent goes to the crisis line, which is on the card in front of you\" is a sentence. Push any group that produces a value statement instead of a script.\n\nThe NDA group tends to be the most unsettled, and they should be. Their answer to number 3 should include, verbatim, the categories that never get contracted away: mandatory reporting, consultation and supervision, and responding to a licensing board. If they do not get there, give it to them.\n\nThe entourage group will discover that number 4 is the hardest, because the documentation has to make clear who the client is at a moment when three other people are acting like they are.]\n\n[DO - report out 5 min. One sentence per group, read aloud exactly as written. No commentary from the group, no workshopping from the room. Just hear four sentences that did not exist an hour ago.]\n\n[NOTE - if a sentence is weak, do not fix it in front of everybody. Note it and tell them the fix is the same for all four: read it out loud to a person who is not a clinician and see whether they know what you just agreed to.]"
  },
  {
    order: 14,
    type: 'discussion',
    title: 'Close - three sentences in the file',
    durationMin: 10,
    prompt: 'One change, written down, before you log off. Then certificate and evaluation logistics.',
    script: "Three and a half hours, five cases, one constraint we held the whole way: we never diagnosed anybody.\n\nAnd notice what that bought us. We got capacity and the least restrictive alternative. We got protective withdrawal and the disclosure tax. We got the comparison trap and the figurehead problem. We got Werther and Papageno and the reason the shape of a sentence changes who lives. We got VIP syndrome and the NDA you do not sign, and four sentences you did not have when you logged on. None of that required a single professional opinion about a person I have never examined.\n\nThat is the argument. The rule was never the obstacle. Speculation is just the laziest available use of the material.\n\n[DO 3 min, individually - write one thing. Not a summary. One specific change, and when. The capacity conversation you have not had with the client under somebody else's authority. The accommodation letter language you are going to draft before you need it. The rules for what you post the next time somebody famous dies. The intake paragraph about who may contact you. One. With a date.]\n\n[DO - report out 3 min, three or four out loud. Take the most specific ones, not the most impressive ones.]\n\n[NOTE - close on the through-line, not on logistics. Every case tonight was a person who said something true about themselves in public and then had to live with what the public did with it. Some of your clients are deciding right now whether to say something true out loud to one person. What they have watched happen to the famous is part of that calculation. Knowing that is the clinical use of all of this.]\n\n[DO - last 2 min, logistics, brisk: the evaluation link, the attestation, and the attendance requirement - 90% of instructional minutes, breaks excluded. Certificates issue after attendance reconciles. Tell them where to look and who to email if theirs does not arrive.]"
  }
];

/* ── Session metadata ──────────────────────────────────────────────────── */
function buildSession({ slug, start, end, price, capacity, cutoffDays }) {
  return {
    title: 'Case Studies of the Rich and Famous',
    slug,
    description: [
      'A live, case-based CE course built entirely on what well-known people have said about their own mental',
      'health in public - and on sworn court record. No living person is diagnosed, formulated, or assessed in',
      'this course. That constraint is the curriculum: it is the working model for how a clinician engages public',
      'mental-health narrative without violating the APA Goldwater Rule (Section 7, Annotation 3), ACA C.6.c and',
      'E.5.d, APA Standard 5.04, or the NBCC provisions on public statements.',
      '',
      'Five cases carry the evening: a conservatorship and the capacity questions it raises; two elite athletes who',
      'stopped competing and what the public did with that; public recovery and the figurehead problem; the safe-',
      'messaging evidence on how a story is told; and what happens to a practice when the client is the famous one.',
      '',
      'Learning objectives. By the end of this course participants will be able to:',
      '1. Apply the Goldwater Rule and the corresponding ACA, APA, and NBCC provisions to distinguish permissible',
      '   public commentary from prohibited diagnosis of a person the clinician has not examined.',
      '2. Evaluate the sourcing of public mental-health claims using a three-tier standard (first-person disclosure,',
      '   sworn record, and everything else) and explain why a disclosure-based case requires periodic re-verification.',
      '3. Analyze capacity as decision-specific and time-limited, and identify supported decision-making and other',
      '   less restrictive alternatives to substituted judgment for clients under protective arrangements.',
      '4. Describe the disclosure tax imposed on clients who seek accommodation, and draft accommodation language',
      '   that meets a third party\'s requirement while minimizing the client\'s diagnostic disclosure.',
      '5. Apply safe-messaging principles, including the Werther and Papageno effects, to their own public-facing',
      '   communication and to the session after a public death.',
      '6. Pre-decide their response to the four practice pressures associated with VIP syndrome, including the',
      '   confidentiality terms a clinician should never agree to by contract.',
      '',
      'Level: Intermediate. Format: live, synchronous, interactive (polls, breakouts, facilitated discussion).',
      'Attendance of at least 90% of instructional minutes is required for the CE certificate. The two declared',
      'breaks are excluded from the attendance denominator. Content includes discussion of suicide, overdose, and',
      'eating disorders; the facilitator flags each before it arises.'
    ].join('\n'),

    presenter: {
      name: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
      credentials: 'LPC009587 (Georgia) | NCC | CPCS | BC-TMH'
    },

    sessionType: 'live-course',
    ceuHours: CEU_HOURS,
    nbccContentAreas: ['Professional Identity'],
    category: 'Ethics & Professional Practice',

    scheduledStart: start,
    scheduledEnd: end,
    timezone: 'America/New_York',

    capacity,
    registrationCutoffDays: cutoffDays,
    // Any current subscriber on any paying plan registers free; everyone else pays this
    // through Stripe Checkout. Both paths are in routes/liveSessions.js POST /:id/register,
    // which reads includedInSubscription to decide who rides the subscription.
    price,
    includedInSubscription: 'any',
    isPublished: false,
    status: 'scheduled',

    attendanceThresholdPct: 90,
    // Off on purpose: a recording of a session that names real people is a separate
    // redistribution decision. Turn on from the admin UI only if that is intended.
    recordingEnabled: false,

    agenda: AGENDA,
    breaks: []   // filled in run() once scheduledStart is known
  };
}

/* ── Run ───────────────────────────────────────────────────────────────── */
async function run() {
  const rawStart = arg('--start') || DEFAULT_START;
  const rawPrice = arg('--price');
  const price = rawPrice === null ? DEFAULT_PRICE : Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) { console.error(`--price "${rawPrice}" must be a number >= 0.`); process.exit(1); }
  const capacity = Number(arg('--capacity') || 50);
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 200) { console.error('--capacity must be an integer 1-200.'); process.exit(1); }
  const cutoffDays = Number(arg('--cutoff') ?? 7);
  if (!Number.isInteger(cutoffDays) || cutoffDays < 0 || cutoffDays > 30) { console.error('--cutoff must be an integer 0-30.'); process.exit(1); }

  const start = parseStart(rawStart);

  // CE math, checked before anything else touches the database.
  const agendaMin = sumMin(AGENDA);
  const breakRows = AGENDA.filter(a => a.type === 'break');
  const breakMin = sumMin(breakRows);
  const instructionalMin = agendaMin - breakMin;
  if (instructionalMin !== CEU_HOURS * 60) {
    throw new Error(`Run of show is ${instructionalMin} instructional min; ceuHours ${CEU_HOURS} requires ${CEU_HOURS * 60}. Fix AGENDA.`);
  }
  AGENDA.forEach((a, i) => { if (a.order !== i) throw new Error(`Agenda order is not 0..n at index ${i} (order ${a.order}).`); });

  const end = new Date(start.getTime() + agendaMin * 60000);

  // Each break window: scheduledStart + the minutes of every segment ahead of it.
  const breaks = AGENDA
    .filter(a => a.type === 'break')
    .map(a => ({
      label: a.title || 'Break',
      startsAt: new Date(start.getTime() + sumMin(AGENDA.slice(0, a.order)) * 60000),
      durationMin: a.durationMin
    }));

  const monDay = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric' })
    .format(start).toLowerCase().replace(/\s+/g, '');
  const slug = (arg('--slug') || `case-studies-rich-and-famous-${monDay}`).trim().toLowerCase();

  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY (inserting)' : 'DRY RUN (nothing written)'}\n` + '='.repeat(92));

  if (await LiveSession.exists({ slug })) {
    throw new Error(`Slug "${slug}" already exists. Pass a different --slug.`);
  }

  const doc = buildSession({ slug, start, end, price, capacity, cutoffDays });
  doc.breaks = breaks;

  const cutoffDate = cutoffDays > 0 ? new Date(start.getTime() - cutoffDays * 86400000) : null;

  console.log(`\n"${doc.title}"`);
  console.log(`  slug        ${slug}`);
  console.log(`  window      ${fmt(start)}  ->  ${clock(end)} ET   (${agendaMin} min)`);
  console.log(`  CE          ${CEU_HOURS} hr  =  ${instructionalMin} instructional min  (${agendaMin} scheduled - ${breakMin} break)`);
  breaks.forEach(b => console.log(`  break       ${clock(b.startsAt)} ET for ${b.durationMin} min`));
  console.log(`  price       $${price.toFixed(2)} via Stripe Checkout; $0 for any current subscriber`);
  console.log(`  included    includedInSubscription '${doc.includedInSubscription}' — any paying plan with status active/lifetime (no trials)`);
  console.log(`  capacity    ${capacity}    attendance threshold ${doc.attendanceThresholdPct}% of instructional min`);
  console.log(`  cutoff      ${cutoffDays} day(s)${cutoffDate ? ` — registration closes ${fmt(cutoffDate)}` : ' — no cutoff'}`);
  console.log(`  published   ${doc.isPublished}   recording ${doc.recordingEnabled}   status ${doc.status}`);
  console.log(`\n  Run of show — ${AGENDA.length} segments, ${AGENDA.filter(a => a.script).length} scripted\n`);
  for (const a of AGENDA) {
    const at = clock(new Date(start.getTime() + sumMin(AGENDA.slice(0, a.order)) * 60000));
    console.log(`   ${String(a.order).padStart(2)}  ${at.padStart(8)}  ${String(a.durationMin).padStart(3)}m  ${a.type.padEnd(10)} ${a.title}`);
    console.log(`                          ${a.script ? `script ${a.script.length} chars` : 'no script'}`);
  }

  const session = new LiveSession(doc);
  await session.validate();   // hard-lock invariants + enums, before any write
  console.log('\n  validate() OK');

  if (!APPLY) {
    console.log('\n' + '='.repeat(92));
    console.log('DRY RUN — nothing was written. Re-run with --apply to insert.');
    await mongoose.disconnect();
    return;
  }

  await session.save();

  // Read back — never report a write we have not re-read.
  const fresh = await LiveSession.findOne({ slug }).lean();
  if (!fresh) throw new Error('Read-back FAILED: session not found after save.');
  const freshBreakMin = (fresh.breaks || []).reduce((n, b) => n + b.durationMin, 0);
  const freshWindow = Math.round((new Date(fresh.scheduledEnd) - new Date(fresh.scheduledStart)) / 60000);
  const scripted = (fresh.agenda || []).filter(a => a.script && a.script.length).length;

  console.log('\n' + '='.repeat(92));
  console.log(`INSERTED  _id ${fresh._id}`);
  console.log(`  read-back: ${fresh.agenda.length} agenda rows, ${scripted} scripted, ${fresh.breaks.length} break(s)`);
  console.log(`  read-back: window ${freshWindow} min - ${freshBreakMin} break = ${freshWindow - freshBreakMin} instructional (need ${CEU_HOURS * 60})`);
  console.log(`  read-back: ceuHours ${fresh.ceuHours}, price $${fresh.price}, isPublished ${fresh.isPublished}`);
  console.log(`  read-back: includedInSubscription '${fresh.includedInSubscription}'`);
  if (fresh.includedInSubscription !== 'any') console.log("  WARNING: includedInSubscription is not 'any' — subscribers will be charged.");
  if (freshWindow - freshBreakMin !== CEU_HOURS * 60) console.log('  WARNING: instructional minutes do not match ceuHours.');
  if (scripted !== AGENDA.filter(a => a.script).length) console.log('  WARNING: scripted segment count changed on save.');

  console.log('\nNEXT:');
  console.log(`  1. Mint the Whereby room — no room is provisioned by this script:`);
  console.log(`       node src/scripts/regenerateWherebyRoom.js --slugs ${slug} --apply`);
  console.log(`  2. Review the run of show in the admin UI, then flip isPublished to true there.`);
  console.log(`  3. Do NOT run addSessionBreak.js on this session — both breaks are already declared.`);

  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error(`\nFAILED: ${e.message}`);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
