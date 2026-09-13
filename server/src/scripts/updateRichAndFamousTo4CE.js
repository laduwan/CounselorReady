// updateRichAndFamousTo4CE.js
// UPDATES the existing "Case Studies of the Rich and Famous" LiveSession (slug
// case-studies-rich-and-famous-sep25) from 3.5 CE to 4.0 CE with a rebuilt case
// lineup. This is an EDIT of the record createRichAndFamousLiveCourse.js inserted,
// not a new session — same _id, same slug, same title, same Sep 25 date, same
// pricing (includedInSubscription: 'any', price 115). Only these fields change:
//   ceuHours        3.5  -> 4.0
//   scheduledEnd    10:30pm -> 10:45pm ET  (scheduledStart unchanged, 6:30pm)
//   agenda          rebuilt, 15 rows -> 17 rows (240 instructional min, was 210)
//   breaks          recomputed for the new agenda (one 15-min break, not two)
//   description     rewritten for the new case lineup and objectives
// Untouched: title, slug, presenter, price, includedInSubscription, capacity,
// registrationCutoffDays, isPublished, status, timezone, scheduledStart,
// sessionType, category, nbccContentAreas, attendanceThresholdPct, recordingEnabled.
//
// BREAKS — ONE, not two. The compliance rule is a 15-min break per 2 hours of
// continuous instruction. 240 instructional min = exactly two 2-hour blocks,
// so a single break at the 120-min mark satisfies it; a second break at the
// end of the second block would just be the course ending, not a requirement.
// An earlier draft of this script shipped two breaks (matching the 3.5 CE
// version's spacing) before this was caught — see the run-of-show comment
// below for exactly how both halves land on the 120-min boundary.
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
//            Core material unchanged, trimmed from 25 to 15 min (5 min more than
//            first planned, to land the break exactly on the 2-hour compliance
//            boundary — see BREAKS note above). Brief pointer to Naomi Osaka's
//            parallel disclosure-tax pattern kept (not a headline case) because
//            the accommodation breakout later depends on the concept.
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
// to 255 min: 6:30-10:45pm ET, ONE 15-min break, 240 + 15 = 255.
// createRichAndFamousLiveCourse.js's own header, written for the 3.5 CE
// version, said the window would need to grow to 270 min for 4.0 CE — that
// was written assuming the same two-break spacing carried forward. It
// doesn't: one break, correctly placed, covers a 240-min course under the
// 2-hour rule, so the window only needs to grow by 15 min, not 30.
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

/* ── Run of show — 16 rows, 255 min (240 instructional + ONE 15-min break) ──
   Break math: the compliance rule is one 15-min break per 2 hours of continuous
   instruction, not per session. 240 instructional min = exactly two 2-hour
   blocks, so ONE break at the 120-min mark covers it — a second break is not
   required, since nothing runs past the second 2-hour block before the course
   ends. The break sits right after Case B2 (Nassar), by design: hard content
   followed immediately by a recovery break is the correct facilitation order,
   not incidental to where the math landed. First half = 120 min exactly
   (0+10+15+15+25+10+15+15... see durations below); second half = 120 min
   exactly. Case B-Tokyo trimmed 20->15 and the integration discussion
   extended 15->20 to make both halves land on the 120-min boundary precisely,
   not approximately. */
const AGENDA = [
  {
    order: 0,
    type: 'lecture',
    title: 'Framing — the case we are not allowed to make',
    durationMin: 15,
    prompt: 'Why this course never diagnoses anyone, and why that constraint is the actual curriculum.',
    script: "Welcome in. Give people a second to land.\n\n[DO 30s - confirm audio, ask for a hello in the chat, wait for a few]\n\nBefore we get into anybody's story, I want to tell you what I'm not going to do tonight, because it's the reason any of this is legal to teach.\n\nFour hours, a lot of names you'll recognize, and I am not going to diagnose one of them. Not a formulation, not a \"clinically speaking,\" not a diagnosis wearing a hedge as a disguise.\n\nHere's where that comes from. The APA's Goldwater Rule - Section 7, Annotation 3 - says a psychiatrist shouldn't offer a professional opinion on someone they haven't examined, unless that person authorized it. It dates to 1973, after a magazine ran a survey asking psychiatrists to weigh in on a presidential candidate's mental state and printed the results. Counseling has its own versions: ACA C.6.c on media presentations, ACA E.5.d on refraining from diagnosis - people forget that one exists - APA Standard 5.04, and NBCC's language on public statements and scope of competence.\n\n[SLIDE - the four provisions side by side. Leave it up while you make the next point.]\n\nHere's the part people get wrong, though. None of those rules say you can't discuss a public figure. They say you can't render a professional opinion on someone you haven't examined. There's a lot of room in that gap, and that's where we're spending the evening.\n\nSo here's the standard, and I'll hold myself to it same as you: every case tonight comes from one of two places. The person's own account of their own experience, in their own words, given in public. Or sworn court or congressional testimony. Nothing else counts - not an unauthorized biography, not a tabloid, not a documentary's narration if it's someone else talking, not an anonymous source, and not my own inference dressed up as fact.\n\n[NOTE - someone will push back that this makes the material thin. Let them find out otherwise rather than arguing the point now - the self-disclosure record turns out to be richer than the speculation ever was.]\n\nOne more thing before we start. Some of what's ahead is disclosure material, some of it is abuse-survivor material. Take care of yourselves through it. We'll break once, about two hours in, right after the heaviest part of the night, and I'll tell you exactly when it's coming."
  },
  {
    order: 1,
    type: 'discussion',
    title: 'Where the room stands',
    durationMin: 10,
    prompt: 'Two polls, then say the quiet part out loud.',
    script: "Before I teach anything, let's see where this room actually stands.\n\n[POLL - \"Have you ever formed a private clinical impression about a public figure you have never met? - Yes / No\" ANONYMOUS. Close it, then reveal.]\n\n[NOTE - it usually lands well past three quarters. Don't treat a yes as a confession, and don't let the room treat it that way either - a trained clinician noticing a pattern isn't the violation. What you do with the noticing is what the rules actually govern.]\n\nSecond poll.\n\n[POLL - \"Have you ever said that impression out loud to someone outside your household? - Yes / No\" ANONYMOUS. Reveal.]\n\n[NOTE - this number drops, usually a lot, and that's the teaching moment right there - the gap between the two answers is the professional line, and the room just drew it for you.]\n\nHold onto that, because your clients do the exact same thing. They form impressions of famous people and use them - as permission, as comparison, sometimes as proof of what's possible for their own lives.\n\n[DISCUSS 4 min - Has a client ever brought a celebrity into your room? Whose name, and what were they using that person to say about themselves? Take three or four, don't resolve any of them yet - we'll come back to this tonight.]\n\n[NOTE - listen for whether the client used the figure to make hope feel credible, or to make their own suffering feel illegitimate by comparison. Both patterns come back later tonight, in Case B and again with Swift and Beyoncé.]"
  },
  {
    order: 2,
    type: 'lecture',
    title: 'The sourcing standard: self-disclosure, sworn record, and everything else',
    durationMin: 15,
    prompt: 'What counts as a usable source, what does not, and why the boundary keeps moving.',
    script: "Let's turn the sourcing standard into something you can actually use, because in about twenty minutes you'll need to apply it under time pressure.\n\n[SLIDE - three tiers]\n\nTier one, usable: a first-person public account. The person talking about their own experience, on the record, because they chose to. Billie Eilish telling David Letterman, on camera, what it's like to be laughed at for a tic. Taylor Swift, in her own documentary, describing what a magazine cover did to her relationship with food. Neither of those is a leak. Both women picked the moment and picked the words.\n\nAlso tier one: sworn record. Britney Spears testifying in open court on June 23, 2021 is a transcript. Simone Biles testifying before the U.S. Senate Judiciary Committee on September 15, 2021 is a transcript. Neither is somebody reporting on them - it's them, under oath.\n\n[NOTE - it's worth saying plainly why these two count as the same tier despite being different: self-disclosure is voluntary, and testimony often isn't - a witness can want to be there and still be legally compelled. Same evidentiary weight, very different relationship to consent. You'll see that distinction again in Case A, and again in Case B.]\n\nTier two, contextual only: a verifiable public event with no interior claim attached to it. Biles withdrew from the team final in Tokyo on July 27, 2021, then from the individual finals, then came back for beam. That sequence is fact. What it felt like is only knowable from what she herself said about it.\n\nTier three, and we're not using any of it tonight: everything else. An unauthorized biography. A documentary's own narration, when it isn't the subject's words. An anonymous source. And - this is the one that trips people up - a claim that's repeated everywhere but traces back to nobody. \"She was diagnosed with anxiety, depression, and PTSD\" shows up on a dozen wellness sites about a musician we are deliberately not naming a case after tonight, and not one of those sites links to her actually saying it. Repeating a claim a thousand times doesn't move it up a tier.\n\n[SLIDE - the three-tier card. Tell them to screenshot it; this is the transferable tool.]\n\nNow the part where clinicians actually get themselves in trouble. A disclosure isn't permanent. People revise what they've said. Demi Lovato talked publicly about being what they called \"California sober,\" then in December 2021 said publicly that sober sober was the only way for them. Build a teaching case on the first statement and never check back, and you're now teaching something the person has already taken back about their own life.\n\n[NOTE - this is the single most useful thing in the segment, so slow down here. Your source is a living person whose account can change. Anything you cite has an expiration date - build in a recheck, or don't use the case. We'll name this exact failure mode again tonight, for a case we are deliberately not running."
  },
  {
    order: 3,
    type: 'breakout',
    title: 'Sorting the record',
    durationMin: 15,
    prompt: 'Groups of three or four. Sort eight statements into the three tiers, then defend the two you disagreed on.',
    script: "[BREAKOUT 10 min, groups of 3-4. Put the eight statements on screen. They sort each into tier one usable, tier two contextual, or tier three unusable, and flag the two that split the group.]\n\n[SLIDE - the eight:\n1. \"These are things you would never notice if you're just having a conversation with me, but for me, they're exhausting.\" - Eilish, to David Letterman, on her own tics.\n2. A documentary's narrator explaining what an athlete was feeling during a competition.\n3. Spears' June 23, 2021 open-court testimony about the conservatorship.\n4. A former assistant's account of a client's home life, published in a memoir.\n5. Biles' September 15, 2021 sworn testimony to the Senate Judiciary Committee.\n6. The dated fact that a competitor withdrew from a final.\n7. A clinician on a podcast offering a probable diagnosis for a public figure.\n8. A wellness blog's claim that a musician \"was diagnosed with clinical anxiety, depression, and PTSD,\" with no source given.]\n\n[NOTE - the intended splits. Numbers 3 and 5 are tier one on evidence but genuinely uncomfortable on consent - testimony is sworn, but it's often compelled. If a group files them away without wrestling with that, push them. Number 7 is the straightforward Goldwater violation, and somebody will mention hearing exactly that on a podcast recently - let them say it. Number 8 should generate the most argument: it feels sourced because everyone's heard it, and that's precisely the mechanism to watch for. Ask what would actually move it to tier one - a link to the person saying it herself, nothing short of that.]\n\n[DO - report out 5 min. Take numbers 5 and 8; skip walking through all eight.]\n\n[NOTE - what this segment should leave them with: a clinician can say a great deal about a public figure without ever crossing the line, and the constraint tends to produce better material than speculation would - because it's anchored to something a real person chose to say, in their own name."
  },
  {
    order: 4,
    type: 'lecture',
    title: 'Case A - the conservatorship: capacity, autonomy, and the least restrictive alternative',
    durationMin: 25,
    prompt: 'Thirteen years, a court record, and the capacity questions that are sitting in your own caseload right now.',
    script: "Case A - the court-record case, and the one with the most direct line into your own practice.\n\nJust the facts first. A conservatorship was established in 2008 and lasted until November 12, 2021. On June 23, 2021, the conservatee addressed the court directly, in open session - that testimony is a public transcript. She's since written about the period herself, in her own memoir.\n\n[NOTE - don't characterize her mental state back in 2008. You don't know it, the record doesn't establish it, and speculating here would be modeling the exact failure this course exists to avoid. If someone in the room offers a retrospective diagnosis anyway, stop and name it - kindly, but stop it. This is where segment one gets tested for real.]\n\nWhat's teachable here isn't her - it's the structure underneath the case.\n\n[SLIDE - four structural questions]\n\nStart with capacity, because clinicians tend to treat it as global when it's actually decision-specific and time-specific. Someone can lack capacity to manage a complex estate and still have full capacity to decide where they live, who they see, whether they accept treatment. A capacity finding is a snapshot of one decision at one moment - and thirteen years without ever retaking that snapshot is a long time to be operating on an old picture.\n\nThen there's the least restrictive alternative, which is an obligation rather than a nice-to-have. If a narrower intervention would meet the same protective goal, the broader one isn't justified - and the burden of proof sits with whoever's arguing for the broader arrangement, not the person living under it.\n\nBetween those two ends - full autonomy and substituted judgment - sits a whole middle range most clinicians never learn: supported decision-making agreements, limited conservatorships, representative payees, powers of attorney, psychiatric advance directives. Most of you know the two extremes and almost nothing in between. That's a real competence gap, and it's fixable tonight.\n\nAnd here's the one most likely to actually show up in your week: what's the clinician's role, exactly? You might get asked to write a letter. You might get asked to evaluate. You might be treating someone already under a protective arrangement. Those are three different jobs carrying three different obligations, and the most common ethical failure is doing one of them while believing you're doing another.\n\n[DISCUSS 6 min - An attorney calls asking for a letter about your client's capacity to manage their finances. You've treated them for anxiety for eight months. What do you actually know? What would you need to assess that you haven't? And what does taking the job do to the treatment relationship?]\n\n[NOTE - push toward the distinction between treating clinician and forensic evaluator - the dual-role conflict, the limits of what a treatment record can support, and the fact that a letter written from that record can still be read in court as an evaluation. Someone will say they'd just write what they observed. Ask them how that letter reads to a judge who has no idea there's a difference.]\n\nOne more thing, easy to miss. That transcript describes wanting to be heard and not being heard - whatever else is true, that's a documented experience of what a protective structure feels like from inside it, in the person's own sworn words. Anyone on your caseload under a guardianship, a conservatorship, a rep payee, an IEP, a treatment mandate could tell you something similar. Have you ever asked them?\n\n[NOTE - let that land before moving into the discussion. Case A was never really about the celebrity. It's about the person on your own caseload living under someone else's authority, who nobody has thought to ask about it.]"
  },
  {
    order: 5,
    type: 'discussion',
    title: 'Least restrictive in your own caseload',
    durationMin: 10,
    prompt: 'Name one client operating under an arrangement someone else built for them. What would the narrower version look like?',
    script: "Straight into application, no preamble.\n\n[DO 3 min, individually and silently - bring to mind one client, current or recent, operating under an arrangement someone else built for them. Conservatorship, guardianship, rep payee, mandated treatment, a probation condition, a school plan, a family agreement they didn't really agree to. Write down two things: what the arrangement protects against, and what it costs them.]\n\n[DISCUSS 6 min - take four or five, no names, no identifying detail. Ask the same two questions each time: is there a narrower version that meets the same protective goal, and when was this arrangement last actually reviewed by anybody?]\n\n[NOTE - what usually surfaces, and name it if the room doesn't get there: nobody's reviewed it. It got built during an acute period and just persisted, because persisting takes no one's signature and unwinding takes several. That's the real transfer from Case A - not that protective arrangements are wrong, but that they're sticky, and you might be the only person positioned to ask whether this one still fits.]\n\n[NOTE - if someone says it isn't their place to raise it, that's worth sitting with for a minute. Where does noticing a concern about fit sit relative to your obligation to the client's autonomy? You're not litigating anything. You're noticing it in the record.]\n\nThat's Case A. Case B is next, and we're staying in elite gymnastics - two different cases about the same athlete. No break until we're through both of them; this is the heaviest stretch of the night, so let's get into it."
  },
  {
    order: 6,
    type: 'lecture',
    title: 'Case B - protective withdrawal: the twisties and the quitter narrative',
    durationMin: 15,
    prompt: 'Tokyo, July 27, 2021, and what the public did to someone who stopped mid-competition.',
    script: "Case B, part one.\n\nJuly 27, 2021, Tokyo. A gymnast withdraws from the team final, then from the individual finals, then comes back for the balance beam final. She says publicly that she'd lost her air awareness - the twisties, in the sport's own vocabulary - and that continuing would have been unsafe. In her account, the decision was about her mental health and her physical safety at the same time, because in that sport, those two things aren't separable.\n\n[NOTE - be precise about the twisties and don't psychologize it. It's a known, named phenomenon in gymnastics - a disruption of proprioceptive orientation mid-air. An athlete who can't locate the floor while rotating is in real physical danger. Clinicians tend to reach for dissociation as an analogy, and it's a useful one, but say out loud that it is only an analogy.]\n\nTwo things worth pulling out clinically.\n\nStopping an unsafe activity is exactly what we'd want from any client - and yet protective withdrawal from an elite performer got read, that week, as failure of character. \"Quitter\" was everywhere in the coverage. Watch your own reaction to that word, because your clients are watching theirs the same way.\n\nAnd briefly, since it belongs here without becoming its own case tonight: that same summer, a tennis player took a nearly identical hit for a nearly identical reason. She declined a press obligation, citing her mental health, was fined before she'd explained anything, and only disclosed why after the penalty was already public. The accommodation cost her the privacy. That structure - you can have this accommodation, but only once you've handed over your diagnosis - is exactly what the next breakout is built around. Keep her in mind; we won't name her case, but you'll be practicing with her exact mechanism.\n\n[DISCUSS 4 min - who in your caseload has stopped something and been read as weak for it, when stopping was actually the competent choice?]\n\n[NOTE - hold onto this thread. There's a second case about this same athlete coming up, and it's a completely different kind of case.]"
  },
  {
    order: 7,
    type: 'lecture',
    title: 'Case B, continued - abuse survivorship and institutional betrayal',
    durationMin: 15,
    prompt: 'The same athlete, sworn testimony, a different kind of case. Content advisory: sexual abuse.',
    script: "[NOTE - flag this explicitly before you start. This segment concerns sexual abuse and institutional failure. Say plainly that anyone who needs to step out should, and that they don't owe anyone an explanation for it.]\n\nCase B, part two. I want to be direct about why this is its own segment and not a continuation of the last one. The Tokyo withdrawal and what's coming both happened to the same person, but they're not the same story - blending them would flatten both, and this course's whole standard is not to fuse someone's unrelated disclosures into a single narrative just because they share a name.\n\nOn September 15, 2021, Simone Biles testified before the U.S. Senate Judiciary Committee, alongside three other gymnasts, on the FBI's handling of the Larry Nassar investigation. That's sworn congressional testimony - a transcript, not reporting about her.\n\n[SLIDE - the exact language, on screen, read it as written]\n\nHer words: \"I am also a survivor of sexual abuse, and I believe without a doubt that the circumstances that led to my abuse, and allowed it to continue, are directly the result of the fact that the organizations created by Congress to oversee and protect me as an athlete - USA Gymnastics and the United States Olympic and Paralympic Committee - failed to do their jobs.\" She testified that it \"truly feels like the FBI turned a blind eye to us,\" and said plainly: \"the impact of this man's abuse will never be over.\"\n\n[NOTE - don't soften this into gentler language than she used. She chose precise words, under oath. Read them as written, and let the room actually sit with it before moving into the clinical material.]\n\nTwo concepts belong here, and they're the reason this is a case for clinicians and not just a news recap.\n\nInstitutional betrayal - the term comes from Jennifer Freyd's trauma research - names the harm caused not by the abuse itself but by an institution's failure to prevent it, respond to it, or even acknowledge it happened. That's exactly what Biles' testimony is doing: naming the abuse and the institutional failure as two separate, equally real harms. Clients describe this constantly without having the words for it - the assault itself, and then, separately, being disbelieved, delayed, or shielded-around by the people whose job was protecting them. Both wounds need their own place in treatment. Neither one stands in for the other.\n\nAnd delayed disclosure isn't evidence against credibility. Nassar's abuse ran for decades before any public accountability began in 2016. Expect and normalize a long gap between an event and a survivor's disclosure of it - and don't let that gap read as suspicious, either in what the client tells you or in your own clinical judgment.\n\n[DISCUSS 5 min - a client discloses institutional betrayal alongside an assault - a school, a workplace, a family, a licensing board, a treatment program that looked away. How do you hold both harms in the treatment plan without letting one eclipse the other?]\n\n[NOTE - watch for clinicians defaulting to the assault and treating anger at the institution as a distraction from the \"real\" work. Freyd's research suggests the opposite can be true - unaddressed institutional betrayal predicts worse outcomes on its own, independent of how severe the assault was. Both pieces are the real work.]\n\nThat's the heaviest material of the night, and it's behind us now. Fifteen minutes - take it."
  },
  {
    order: 8,
    type: 'break',
    title: 'Break',
    durationMin: 15,
    prompt: 'Fifteen minute break — back at 8:45 ET. The attendance clock pauses; break time is excluded from the CE denominator. This is the only break tonight, placed at the two-hour mark on purpose, right after the hardest material.'
  },
  {
    order: 9,
    type: 'breakout',
    title: 'The accommodation conversation',
    durationMin: 15,
    prompt: 'Groups. Your client needs an accommodation and does not want to disclose. Draft what you would actually say.',
    script: "[BREAKOUT 10 min, groups of 3-4.]\n\n[SLIDE - the scenario. Your client is a fifth-year associate at a firm. She has been in treatment with you for seven months. She needs to be off the trial team for one matter - it is the specific case, not the work in general, and she is clear about why. Her firm has a process: accommodation requests route through HR, and HR asks for documentation naming a condition and functional limitations. She tells you she would rather grind through the trial than have that document exist. She is probably right about what it would do to her partnership track. She is asking what you think she should do.]\n\n[SLIDE - the four questions:\n1. What can you write that is true, sufficient for the request, and discloses the least? Actually draft the sentence.\n2. She is asking for advice on a career decision, not a clinical one. Where is the line between supporting her decision-making and making the decision for her?\n3. If she chooses to grind through it and you believe that is the more harmful path - what do you do with that, and where does it go in the record?\n4. She asks you directly: \"What would you do?\" Answer it out loud, in the words you would actually use.]\n\n[NOTE - question 1 has a real technical answer, and most rooms undershoot it. Functional-limitation language, without diagnostic language, is usually enough and is standard practice. \"Is currently under my care and would benefit from a temporary adjustment to caseload composition through such-and-such date\" discloses no diagnosis at all. A lot of clinicians don't realize they're allowed to write it that way, and their clients are the ones who pay for that gap in privacy - it's the same accommodation-tax structure from before the break, in Case B.\n\nQuestion 3 is where values tend to leak in. Listen for anyone who'd document their disagreement in a way that reads more like building a defense than recording clinical reasoning. Name it gently - ACA A.4.b, on avoiding the imposition of values, is sitting in the room whether we bring it up or not.\n\nQuestion 4 should split the groups, and that's fine - there's no settled answer here, so say so.]\n\n[DO - report out 5 min. Ask two groups to read their actual drafted sentence from question 1 aloud. Compare the disclosure footprint of the two versions side by side. That comparison is the single most portable thing in this segment.]"
  },
  {
    order: 10,
    type: 'lecture',
    title: 'Case C - Tourette syndrome and public stigma',
    durationMin: 20,
    prompt: "A neurological disorder, disclosed on camera, and the specific way an audience gets it wrong.",
    script: "Case C, and this is probably the case most of you have the thinnest clinical background walking into - which is exactly the reason it's here.\n\nIn a 2022 Netflix interview with David Letterman, Billie Eilish talked at length about living with Tourette syndrome, diagnosed when she was eleven. Her words: \"These are things you would never notice if you're just having a conversation with me, but for me, they're exhausting.\" And on how people react to her tics: \"It's really weird, I haven't talked about it at all. The most common way that people react is they laugh because they think I'm trying to be funny. They think I'm going [imitates tic] as a funny move. And so they go, 'Ha,' and I'm always left incredibly offended by that.\"\n\n[SLIDE - both quotes, full, on screen]\n\n[NOTE - let that second quote sit for a second before moving on. She's describing the actual mechanism of stigma from the inside - a symptom that gets misread as a bit, met with laughter, and the cost of that landing on her over and over. Stigma research usually describes this from the outside, in the abstract. She just told you what it's like to live inside it.]\n\nA few things worth knowing here, since almost nobody in a general practice specializes in tic disorders.\n\nTics are involuntary, but they're often suppressible for short stretches, at real cost. A client who holds it together for the length of your session and looks symptom-free might be spending real effort doing that, then decompensating the second they're alone. Worth asking directly whether what you're seeing in the room matches what happens outside it.\n\nThere's a differential that gets missed constantly. A tic is a sudden, rapid, non-rhythmic movement or sound. Non-specialists confuse it with a compulsion, but compulsions typically discharge distress from an obsession, while tics are usually preceded by a premonitory urge with no specific feared outcome attached. Get this wrong and you're offering ERP for something that isn't OCD - or missing a genuine tic disorder altogether.\n\nAnd here's Eilish's point, stated plainly: the social response to a visible involuntary symptom - the laughing, the assumption she's performing - is its own stressor, entirely separate from the neurological condition underneath it. Treat only the tics and never the client's relationship to being watched and misread, and you've treated half the problem.\n\n[DISCUSS 5 min - has a client of yours carried a visible symptom - a tic, a stutter, a tremor, a limp - that other people routinely misread? What did that misreading cost them, apart from the symptom itself?]\n\n[NOTE - draw out the difference between the symptom burden and the social-response burden. They need different interventions - psychoeducation on the condition itself is one track, and working through the shame of being misread by others is a separate track, equally necessary."
  },
  {
    order: 11,
    type: 'lecture',
    title: 'Case D - eating disorders and body image under public scrutiny',
    durationMin: 20,
    prompt: 'A magazine cover, a documentary confession, and a distorted baseline that read as normal.',
    script: "Case D.\n\nIn Miss Americana, her 2020 Netflix documentary, Taylor Swift described a specific trigger and a specific behavioral response, both in her own words. At eighteen, a magazine ran a cover suggesting she might be pregnant, based on how a piece of clothing sat on her stomach in a photo. Her account: \"It's not good for me to see pictures of myself every day... if I see a picture of myself and I feel like I looked to heavy... I just starve a little bit - just stop eating.\"\n\n[SLIDE - the quote in full]\n\nAnd the line that's really the center of this case: \"I thought that I was supposed to feel like I was going to pass out at the end of a show, or in the middle of it. Now I realize, no, if you eat food, have energy, get stronger, you can do all these shows and not feel [enervated].\"\n\n[NOTE - sit with that second quote for a moment. She's describing an internal standard so distorted that near-fainting from restriction read, at the time, as the expected cost of doing her job. Not a symptom - just normal.]\n\nThat's worth slowing all the way down for, because it's a genuinely transferable diagnostic point.\n\nRestriction rarely announces itself as restriction. It shows up as a client describing exhaustion, dizziness, or \"just how the job is\" - an unremarkable fact about their industry, their sport, their body - never labeled a symptom, because to them it isn't one. An intake that waits for a client to say \"I think I have an eating disorder\" will miss this presentation every single time.\n\nTwo mechanisms worth naming directly. Appearance-based triggering - an external image or comment, a magazine cover, a comment section, a costume fitting - functioning as a discrete trigger for a restriction episode rather than a vague shift in mood. And body-checking as an unexamined daily habit: \"seeing pictures of myself every day\" wasn't incidental to what she described. By her own account, it was the mechanism.\n\n[DISCUSS 5 min - has a client described an exhausted or depleted state as simply \"how the job is\" or \"how touring is\" or \"how the industry is\" - normalizing something that, said plainly, sounds like restriction or overexertion? What question would have caught it sooner?]\n\n[NOTE - push toward specific screening language: not \"do you have an eating disorder\" but \"walk me through what you actually ate yesterday,\" and \"what happens after you see a photo of yourself you don't like.\" Specificity catches what self-labeling misses.]\n\nNo break before the next one - we're already past the two-hour mark and the pacing holds fine running straight through to the close. One more case, then we pull it together."
  },
  {
    order: 12,
    type: 'lecture',
    title: 'Case E - occupational strain, sleep, and the "strong one" role',
    durationMin: 20,
    prompt: 'What is usable, what is not, and why the difference matters more here than anywhere else tonight.',
    script: "Case E, and I want to start by correcting something you'll find all over the internet - it's the clearest example all night of tier-three material passing itself off as tier one.\n\nSearch \"Beyoncé mental health\" and you'll find dozens of wellness sites stating, flatly, that she \"was diagnosed with clinical anxiety, depression, and PTSD\" in 2018. None of them link to her saying it. I went looking and couldn't trace it to anything she's stated herself - not an interview, not a documentary, not a public letter. By tonight's standard, that sentence isn't usable, no matter how many sites repeat it. Repetition is exactly what makes tier-three material feel like tier one. We're not using it, and if you'd heard it before tonight, now you know better.\n\n[SLIDE - the aggregator claim, crossed out]\n\nHere's what she's actually said, in her own words - a different case, and a genuinely useful one.\n\nOn insomnia across a touring career: she's described struggling with it \"from touring for more than half of my life.\" On the cost of a particular role: \"I think, like many women, I have felt the pressure of being the backbone of my family and my company and didn't realize how much that takes a toll on my mental and physical well-being. I have not always made myself a priority.\" And, simply: \"Mental health is self-care too.\"\n\n[SLIDE - the three real quotes]\n\nEverything clinically useful here traces back to those three lines.\n\nStart with the sleep. Chronic sleep disruption from occupational demands is a legitimate presenting concern on its own, not just a symptom pointing at something else. Touring, shift work, caregiving, on-call medicine all produce a similar pattern, and it deserves direct treatment rather than a footnote while you go hunting for a \"real\" diagnosis underneath it.\n\nThen there's the backbone role itself. A client who describes themselves as the one holding a family, a team, or a company together is naming a specific structure with its own burnout profile - one where their own distress signals get quietly deprioritized, by the client themselves, because attending to them feels like abandoning the role. \"I have not always made myself a priority\" is worth having a client say back to you in their own words.\n\nAnd this is where tonight's opening argument actually pays off. Everything usable in this case is thinner than a diagnosis, and that's fine - a clinical impression doesn't need a diagnosis attached to be useful. Occupational strain, sleep disruption, role-based self-neglect are real and treatable entirely on their own terms. The pull toward something more clinically dramatic than what she actually said is the exact pull this whole evening has been training you to resist.\n\n[DISCUSS 5 min - where in your own caseload have you been tempted to reach for a bigger diagnosis than what the material in front of you actually supports?]\n\n[NOTE - this is the most self-implicating discussion of the night, and it should feel a little uncomfortable. Reaching for drama isn't a habit unique to tabloid writers."
  },
  {
    order: 13,
    type: 'discussion',
    title: 'Five cases, one caseload — applying it',
    durationMin: 20,
    prompt: 'Which case from tonight maps onto someone you are treating right now?',
    script: "Quick integration before we close out the content. We've got a little extra room here, so let's actually use it instead of rushing through.\n\n[DO 4 min, individually and silently - of tonight's cases - capacity and least restrictive alternative, protective withdrawal, institutional betrayal, the misread visible symptom, restriction disguised as normal, occupational strain and the backbone role - which one is closest to a client you're treating right now? Write their presentation in one sentence, no identifying detail, next to the case it maps to.]\n\n[DISCUSS 13 min - take six or seven, spread across different cases if the room lets you. For each: what's one thing from tonight's segment on that case you'd do differently in your next session with that client?]\n\n[NOTE - resist letting this turn into a re-teaching of the content. The value here is entirely in how specific the transfer is - a real client, a real next action - not in restating the lecture. If someone answers in generalities, push them toward an actual sentence they'd say in session.]\n\n[NOTE - if institutional betrayal barely comes up, ask directly: has a client ever described being failed by an institution - a school, a workplace, a licensing board, a treatment program - separately from whatever the original harm was? That's the case clinicians are least trained to hear, because it doesn't map onto a DSM code.]\n\n[NOTE - with the extra time, if the room's got energy for it, run a second round: of the cases nobody picked, why not? Sometimes that answer is clinically interesting in its own right - worth naming even when a case doesn't match anyone's caseload."
  },
  {
    order: 14,
    type: 'discussion',
    title: 'Werther, Papageno, and what happened after August 2014',
    durationMin: 15,
    prompt: 'The evidence that how a story is told changes who lives. Safe messaging, applied to your own words.',
    script: "This is the segment where the research is unambiguous, and I want to be careful with it because we are about to discuss a death.\n\n[NOTE - flag it before you say it. Some people in this room have lost someone. Give them the exit and mean it.]\n\nTwo named effects. The Werther effect - Phillips, 1974 - is the documented increase in suicides following certain kinds of media coverage of a suicide. The Papageno effect - Niederkrotenthaler and colleagues, 2010, in the British Journal of Psychiatry - is the opposite, and it is the one nobody knows: coverage that focuses on coping, on getting through the crisis, is associated with a protective effect.\n\nSo it's not that talking about it is dangerous - it's that how it's told determines which direction the effect runs.\n\nThe hardest data point. Robin Williams died on August 11, 2014. Fink, Santaella-Tenorio and Keyes published an analysis in PLOS ONE in 2018 finding a roughly ten percent increase in US suicides over the following months above what models projected, concentrated in men aged thirty to forty-four, and with a marked increase in the specific method that had been widely reported.\n\n[NOTE - that last clause is the whole safe-messaging literature in one line. Method detail was reported, and method-specific deaths rose. Let the silence sit after you say it. Do not rush into the next sentence.]\n\n[DISCUSS 5 min - you are a clinician with a public-facing anything. A newsletter, a practice Instagram, a podcast, a comment to a reporter, a post the morning a famous person dies. What are your rules, written in advance, before you are the one with the trembling hands and the post half typed?]\n\n[NOTE - drive toward concrete rules, not sentiment: no method, no location, no simplified single cause, no framing that reads as inevitable, always resources, always the message that treatment works. Name the relevant provisions - ACA C.6.c media presentations, APA 5.04 - and then say the practical thing: the most common failure is not a clinician saying something reckless, it is a clinician saying something well-intentioned at 11pm about a person they never met.]\n\nNow the other half of this, which is the part that actually happens to you.\n\n[DISCUSS 5 min - it is the morning after. Three clients in a row bring it up, and one of them has a history you are worried about. What is your first sentence? Not your assessment - your first sentence.]\n\n[NOTE - what to surface: do not lead with the news, lead with them. Ask what they made of it before you offer anything. Screen, do not assume - for some clients this is a news event and treating it as a trigger creates one. And for the client you are worried about, the disclosure of concern is itself the intervention: name that you thought of them when you heard it.]\n\n[NOTE - close on Papageno, not Werther. Safe messaging isn't censorship - the coverage that actually helps is documented and real. Say the helpful thing, deliberately, in the shape that's been shown to work.]"
  },
  {
    order: 15,
    type: 'discussion',
    title: 'Close - three sentences in the file',
    durationMin: 10,
    prompt: 'One change, written down, before you log off. Then certificate and evaluation logistics.',
    script: "Four hours, five cases, and we held one rule the whole way through: nobody got diagnosed. When the internet handed us a ready-made diagnosis for tonight's last case, we turned it down, out loud, in front of everybody.\n\nLook at what saying no actually got us. Capacity and the least restrictive alternative. Protective withdrawal, and then, right after it, a harder and completely separate case about institutional betrayal in the same person - two wounds that refused to collapse into one tidy story. A visible neurological symptom and the exact way an audience turns it into a punchline. A baseline so distorted it read, to the person living it, as just the ordinary cost of the job. And a case built out of three real sentences, once we'd thrown out the one sentence everybody else was using - and it held up fine. Better than fine, because it never had to leave the ground of what she'd actually said.\n\nThat's the whole argument, really. The rule was never what stood in the way. Reaching for something more dramatic than the record supports is just the easy way out - and it's sitting there for you too, not only for whoever writes those blogs.\n\n[DO 3 min, individually - write one thing. Not a summary, one specific change, and when you'll make it. The capacity conversation you haven't had with a client living under someone else's authority. The institutional-betrayal question you'll start asking survivors, apart from the assault itself. The screening language for restriction that's been passing as normal. The sentence you'll use next time exhaustion gets waved off as \"just how the job is.\" Pick one. Put a date on it.]\n\n[DO - report out 3 min, three or four out loud. Go for the most specific answers, not the most impressive-sounding ones.]\n\n[NOTE - close on the through-line, not the logistics. Every case tonight came from what a real person said, or swore to, and nothing beyond that. Somewhere right now, one of your own clients is deciding whether to say something true out loud to one other person. What they've watched happen to famous people - misread, laughed at, folded into a diagnosis they never claimed - is quietly part of that calculation. That's the actual clinical use of everything we covered tonight.]\n\n[DO - last 2 min, logistics, brisk: the evaluation link, the attestation, and the attendance requirement - 90% of instructional minutes, the break excluded. Certificates go out once attendance reconciles. Tell them where to check and who to email if theirs doesn't show up.]"
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
  'Attendance of at least 90% of instructional minutes is required for the CE certificate. The declared',
  'break is excluded from the attendance denominator. Content includes discussion of sexual abuse,',
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
  if (breakRows.length !== 1) throw new Error(`Expected exactly 1 break row (one 15-min break per 2 hours; 240 min = one break), found ${breakRows.length}.`);
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
