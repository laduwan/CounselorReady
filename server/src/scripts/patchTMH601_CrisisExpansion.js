/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_CrisisExpansion.js
 * ──────────────────────────────
 * Stage 3 of the Mastering TeleMental Health (CR-TMH601) cleanup.
 * Expands §8 — Crisis Intervention and Safety Planning Across Distance —
 * to close the gaps surfaced in the crisis-coverage audit.
 *
 * What this adds to §8 (all insertions idempotent, marker-detected):
 *
 *   1. Crisis Hotlines: Know These Numbers          callout (info)
 *      988 Lifeline + Veterans + Trevor Project + Crisis Text Line + SAMHSA
 *
 *   2. HIPAA's Crisis Disclosure Exception           callout (ethics)
 *      45 CFR 164.512(j): what you can disclose, to whom, when, the
 *      good-faith standard, documentation
 *
 *   3. Critical: Four Things You Never Do            callout (donot)
 *      The non-obvious traps — wrong-jurisdiction 911, abandoning a client
 *      mid-crisis to dial, delayed documentation, panic-ending the session
 *
 *   4. Beyond Suicide: Other Crisis Presentations    text
 *      Homicidal ideation / Tarasoff in telehealth; acute psychosis or
 *      dissociation in session; substance intoxication; acute self-harm on
 *      camera; domestic-violence emergency; child-abuse disclosure;
 *      minor-client suicidality
 *
 *   5. Between-Session Crisis: Voicemail / Text /    text
 *      Email — response-time expectations, triage, documentation, what NOT
 *      to do over unsecured channels
 *
 *   6. Firearm Means Restriction: Practical Script   callout (protocol)
 *      The clinical script, voluntary surrender options, state red-flag
 *      laws (ERPOs), free gun-lock programs, refusal documentation
 *
 *   7. When a Client Dies: First 72 Hours of         text
 *      Postvention — records, supervisor/carrier notification, family
 *      communication under HIPAA, your grief response, returning to practice
 *
 *   8. "After Hours: The Voicemail"                  scenarioTree
 *      5-decision-point walkthrough of a between-session suicidal voicemail
 *
 *   9. Crisis Essentials — The 7 Non-Negotiables     keyTakeaway
 *      End-of-section reinforcement
 *
 *  10. + 2 new questions to course.assessment.questions
 *      988 + HIPAA 164.512(j)
 *
 * Run on Render shell:
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_CrisisExpansion.js              # dry run
 *   APPLY=1 node src/scripts/patchTMH601_CrisisExpansion.js      # write
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in env');
  process.exit(1);
}
const APPLY = process.env.APPLY === '1';

const TARGET_SLUGS = [
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
  'mastering-telemental-health',
];

// Idempotency markers — searched in JSON-stringified blocks. Use marker
// strings WITHOUT double quotes (JSON escapes them and breaks matching).
const M = {
  hotlines: 'Crisis Hotlines: Know These Numbers',
  hipaaDisclosure: 'Crisis Disclosure Exception',
  fourThings: 'Four Things You Never Do in a Telehealth Crisis',
  beyondSuicide: 'cr-marker-beyond-suicide',
  betweenSession: 'cr-marker-between-session-crisis',
  firearmScript: 'Firearm Means Restriction: Practical Script',
  postvention: 'cr-marker-postvention-72-hours',
  voicemailScenario: 'After Hours: The Voicemail',
  endOfSectionTakeaway: 'Crisis Essentials — The 7 Non-Negotiables',
  q988: 'national 988 Suicide & Crisis Lifeline',
  qHipaaCrisis: '45 CFR 164.512(j)',
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 1 — Crisis Hotlines (info callout)
// ════════════════════════════════════════════════════════════════════
const HOTLINES_CALLOUT = {
  type: 'callout',
  calloutType: 'info',
  title: 'Crisis Hotlines: Know These Numbers',
  content: `<p style="margin-bottom:10px">Every telehealth safety plan should include the national resources below. Memorize them, post them in your clinical workspace, and integrate them into your written safety-plan template. <strong>You will need them at speeds where searching is not an option.</strong></p>
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:0.9em">
  <thead>
    <tr style="background:#284157;color:#fff">
      <th style="padding:8px 10px;text-align:left;border:1px solid #284157">Resource</th>
      <th style="padding:8px 10px;text-align:left;border:1px solid #284157">How to Reach</th>
      <th style="padding:8px 10px;text-align:left;border:1px solid #284157">When to Direct a Client There</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">988 Suicide &amp; Crisis Lifeline</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Call 988, text 988, or chat at 988lifeline.org — 24/7</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">First-line national resource for any suicidal ideation or acute mental health crisis. Spanish, ASL, LGBTQ+ (press 3), Veterans (press 1) routing built in.</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">Veterans Crisis Line</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">988 → press 1, or text 838255</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Active duty, veterans, and family members — staffed by VA-trained responders.</td>
    </tr>
    <tr>
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">The Trevor Project</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">1-866-488-7386, text START to 678-678, chat at thetrevorproject.org</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">LGBTQ+ youth (ages 13–24) in crisis. Trained for identity-related distress.</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">Crisis Text Line</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Text HOME to 741741 — 24/7</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Clients who cannot or will not speak aloud (DV survivors in shared homes, late-night, hearing impaired without video access).</td>
    </tr>
    <tr>
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">SAMHSA National Helpline</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">1-800-662-HELP (4357) — 24/7</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Substance use treatment referrals — free, confidential, English &amp; Spanish.</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">Trans Lifeline</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">1-877-565-8860</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Peer support staffed by trans operators. Anti-suicidal-ideation focus; explicitly does not call emergency services without caller consent.</td>
    </tr>
    <tr>
      <td style="padding:7px 10px;border:1px solid #e5e5e5;font-weight:600">Georgia Crisis &amp; Access Line (GCAL)</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">1-800-715-4225 — 24/7</td>
      <td style="padding:7px 10px;border:1px solid #e5e5e5">Georgia-specific behavioral-health crisis dispatch, including mobile crisis teams.</td>
    </tr>
  </tbody>
</table>
<p style="margin-top:10px;font-size:0.88em"><strong>Direct a client to a hotline when:</strong> you are about to lose contact and they need a 24/7 resource; the client refuses ED transport but agrees to ongoing support; you finish a session and want a continuous bridge until the next contact; the client is in a between-session crisis where you cannot reach them but a family member can route them to a hotline.</p>`,
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 2 — HIPAA Crisis Disclosure Exception (ethics callout)
// ════════════════════════════════════════════════════════════════════
const HIPAA_DISCLOSURE_CALLOUT = {
  type: 'callout',
  calloutType: 'ethics',
  title: "HIPAA's Crisis Disclosure Exception — 45 CFR 164.512(j)",
  content: `<p>Clinicians who initiate emergency response during a telehealth crisis routinely worry: "Am I violating HIPAA by telling 911, the welfare-check officer, or the client's family member what's happening?" The federal rule is clear — and it favors action.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">The rule</h4>
<p>Under <strong>45 CFR 164.512(j)</strong>, a covered entity may disclose protected health information without client authorization when the clinician, in good faith, believes the disclosure is necessary to prevent or lessen a serious and imminent threat to the health or safety of the client or others <em>and</em> the disclosure is to a person or persons reasonably able to prevent or lessen that threat.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">What you can disclose — and to whom</h4>
<ul style="margin:6px 0 6px 22px">
  <li><strong>Emergency dispatchers and responding officers:</strong> identity, location, nature of the crisis, known risk factors (weapon access, substance use, history of violence), and recommendations (CIT-trained officer, soft entry, etc.)</li>
  <li><strong>Family or designated emergency contact:</strong> the fact of an immediate safety concern and what action is needed (e.g., "I need you to go check on Marcus right now and stay with him until paramedics arrive")</li>
  <li><strong>The client themselves:</strong> always permissible</li>
</ul>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">The minimum necessary standard still applies</h4>
<p>Disclose only what is required for the emergency response. The dispatcher needs the location, the nature of the threat, and known risk factors — not a diagnostic history or treatment-progress summary. The emergency contact needs the safety concern and the action requested — not the content of the clinical session.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">What "good faith" means</h4>
<p>You are not held to perfect accuracy in hindsight. The standard is reasonable clinical judgment at the moment of disclosure. Document the basis of your good-faith belief in the clinical record — the specific statements or observations that triggered the disclosure decision. If your judgment is later questioned, that contemporaneous documentation is your protection.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">Common misconception, corrected</h4>
<p style="background:#faf8f3;border-left:3px solid #4A7C59;padding:10px 14px;margin-top:8px"><em>"I can't disclose anything without consent."</em> Wrong in a crisis. The 164.512(j) exception exists precisely so that clinicians do not have to choose between client confidentiality and client safety in an acute threat-to-life situation. Refusing to disclose in good-faith crisis circumstances exposes you to liability, not the other way around.</p>

<p style="margin-top:12px;font-size:0.88em"><strong>Documentation tip:</strong> Note in the chart: "Disclosure made under 45 CFR 164.512(j) based on [specific risk indicators]. Disclosure limited to [recipient(s)] and [scope]. Minimum-necessary standard observed."</p>`,
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 3 — Four Things You Never Do (donot callout)
// ════════════════════════════════════════════════════════════════════
const FOUR_NEVERS_CALLOUT = {
  type: 'callout',
  calloutType: 'donot',
  title: 'Four Things You Never Do in a Telehealth Crisis',
  content: `<p style="margin-bottom:8px">These four rules are non-obvious enough that experienced clinicians break them under pressure. Burn them in.</p>`,
  calloutItems: [
    "NEVER call 911 from your own phone for a client in another jurisdiction. 911 routes to the caller's local dispatch — your call about a client in Ohio reaches Georgia dispatch. Use the pre-collected non-emergency dispatch number for the client's location instead.",
    "NEVER leave a client alone on the line while you call for help without telling them what you're doing. Silence in a crisis feels like abandonment. Narrate: 'I'm staying with you. I'm using my other line to get help to where you are. I'm not leaving.'",
    "NEVER document the crisis from memory days later. Contemporaneous notes are the standard — ideally within 60 minutes of the event resolving. If you couldn't document during the crisis, document immediately after, before sleeping, before the next client.",
    "NEVER end the session because you panic. Your steady, continued presence is the intervention. Until the client is safe with emergency responders, with a verified support person physically present, or you have made a clinically defensible determination of stability — you stay.",
  ],
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 4 — Beyond Suicide (text)
// ════════════════════════════════════════════════════════════════════
const BEYOND_SUICIDE_TEXT = {
  type: 'text',
  content: `<!--${M.beyondSuicide}-->
<h2>Beyond Suicide: Other Crisis Presentations in Telehealth</h2>
<p>The protocols above center on acute suicidal crisis because it is the most studied and most common acute presentation in mental health practice. But a telehealth crisis can take other forms, each with its own decision logic. Below are the major crisis types every telehealth clinician should be prepared to recognize and respond to.</p>

<h3>Homicidal Ideation and Tarasoff Duties in Telehealth</h3>
<p>When a client discloses an intent to harm an identified or identifiable third party, the clinician's legal obligations vary substantially by state. The original <em>Tarasoff v. Regents of the University of California</em> ruling established a duty to warn the intended victim in California; subsequent decisions and state statutes have evolved that into a duty to <em>protect</em>, a duty to <em>warn</em>, both, or in some jurisdictions, neither. Approximately 23 states impose a mandatory duty, 11 a permissive duty, and the remainder either reject the doctrine outright or remain silent.</p>
<p>In a telehealth context, the clinician must determine: (1) what state's law applies — typically the state where the client is physically located, since that is where the clinical service is being delivered; (2) what specific duty applies — to warn the intended victim, to notify law enforcement, or both; (3) whether the intended victim has been identified with sufficient specificity to trigger the duty; and (4) where the intended victim is located, which determines which law enforcement jurisdiction is contacted for protective action. The pre-crisis directory introduced earlier in this section should include each client's home-state Tarasoff posture so you are not researching the rule in real time.</p>
<p>Practical step in session: if a client discloses homicidal ideation toward an identifiable person, conduct a structured risk assessment focused on intent, means, opportunity, and history of violence. Document the specific statements verbatim where possible. If the disclosure meets the threshold for your client's jurisdiction's duty, take the steps required by that jurisdiction — and document the legal basis. Consult immediately with a colleague, your supervisor, or risk-management counsel; you are not expected to navigate this alone in real time.</p>

<h3>Acute Psychosis or Dissociation in Session</h3>
<p>A client who arrives at session oriented and engaged but who shifts mid-session into a psychotic or dissociative state presents one of the most under-discussed crisis scenarios in telehealth. Warning signs include sudden loss of orientation to time or place, response to apparent internal stimuli (looking at or speaking to no one visible), thought disorder that was not present at session start, paranoid ideation directed at the clinician or platform ("you're recording me," "they're listening through the camera"), or dissociative shifts (flat affect with rapid identity change, "going away" mid-sentence, child-state voice).</p>
<p>Immediate response: ground the client by name and location ("Marcus, you're at home in Decatur, you're talking to me on video, I'm Dr. Johnson, today is Tuesday"). Slow your voice and reduce stimulation — ask the client to lower or close the laptop screen so they can see you but not their own reflection. Avoid challenging delusional content directly; instead, anchor reality through sensory grounding ("can you tell me what you feel in your hands right now?"). If grounding does not restore engagement within 10–15 minutes, contact the emergency-contact person or initiate a welfare check in the client's jurisdiction. Do not end the session — psychotic clients especially benefit from continued presence until physical-world support arrives.</p>

<h3>Substance Intoxication Presenting in Session</h3>
<p>If a client appears intoxicated during a session, the clinician's response depends on severity. <strong>Mild intoxication</strong> (alcohol, cannabis, mildly disinhibited): note clinical observations, defer clinical content for the session, schedule a re-engagement at a sober time, document. <strong>Moderate intoxication</strong> (slurred speech, motor coordination affected, disinhibition is significant): conduct a brief safety screen — "Are you driving anywhere after this? Is anyone with you? Did you take this with any other substances?" — and document. Offer to reschedule and connect them with SAMHSA's helpline (1-800-662-HELP). <strong>Severe intoxication</strong> with signs of medical emergency (loss of consciousness, vomiting while supine, blue lips, slow breathing for opioids; severe disorientation, hypothermia, or vomiting for alcohol): treat as a medical emergency. Contact emergency services in the client's location immediately. If opioids are suspected and a witness is present, instruct them to administer naloxone if available and to roll the client into recovery position.</p>

<h3>Acute Self-Harm Visible on Camera</h3>
<p>A client who begins to self-harm in front of the camera — visible cutting, swallowing pills, or producing a weapon — requires a specific response. Do not break eye contact. Do not raise your voice. Speak the client's name slowly. Ask them, calmly, to put down the implement: "I need you to put that down so we can talk." If they comply, maintain video contact and conduct the standard suicide-risk protocol from earlier in this section. If they do not comply, or if they have already ingested or injured themselves, contact emergency services in their jurisdiction while keeping them visually engaged. Narrate what you are doing. Do not threaten consequences ("if you don't stop, I'll call the police"); state your intention ("I'm going to make sure someone gets to you to help, and I'm not going anywhere").</p>

<h3>Domestic Violence Emergency During a Session</h3>
<p>Clients in abusive relationships sometimes use telehealth sessions as their only opportunity to disclose abuse — and sometimes a partner walks in during a session, transforming the encounter from therapy to an immediate safety event. Watch for sudden topic changes from the client, fear in the eyes, head movements toward an off-camera doorway, the client suddenly inviting the partner into the session to "say hi," or a discrepancy between the client's words and their visible distress.</p>
<p>If the client has not pre-established a signal phrase, establish one at the next safe opportunity (e.g., "the weather is bad today" = I am not safe to talk). If you observe an active safety event in progress, do not press for clinical disclosure. Ask only what is necessary to ensure their safety and the safety of any children in the home. Document afterward, in detail. If the client gives you a signal that they cannot speak freely, ask only yes/no questions, end the session at the client's signal, and do not call back to the same number — that may put the client in greater danger. Use the National Domestic Violence Hotline (1-800-799-7233) as a referral resource and, if necessary, initiate a welfare check at the client's location without contacting the client first.</p>

<h3>Child Abuse or Neglect Disclosure During a Session</h3>
<p>Mandatory reporting requirements follow the state where the abuse occurred, which is typically the state where the child resides — not the state where the clinician is licensed. The reporting clinician must file a report with the child-welfare agency in the child's state. Each state maintains a 24/7 child-abuse reporting hotline; Childhelp (1-800-422-4453) provides routing to all 50 states' hotlines and is a useful single number to memorize. Tell the client about the report in advance when clinically appropriate, document the disclosure, the basis for the report, and the report's reference number from the receiving agency.</p>

<h3>Minor-Client Suicidality</h3>
<p>When the client is a minor, suicidality introduces additional consent and notification complexities. Most state confidentiality protections for minors yield to a parental notification right when imminent harm is involved. The clinician's tasks during a telehealth crisis with a minor: assess and intervene clinically (the protocols above still apply), notify a parent or legal guardian as required by state law, and — if the minor is in school during session hours — consider whether school personnel need to be contacted to keep the minor under supervision until a parent arrives. Document the consent framework that applies and the notifications made.</p>`,
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 5 — Between-Session Crisis (text)
// ════════════════════════════════════════════════════════════════════
const BETWEEN_SESSION_TEXT = {
  type: 'text',
  content: `<!--${M.betweenSession}-->
<h2>Between-Session Crisis: When Crisis Reaches You Through a Voicemail, Text, or Email</h2>
<p>The §8 protocols above address crisis that emerges during a live session. Statistically, between-session crisis contact is more common — and it is where many clinicians have the weakest protocol. A voicemail at 11 PM, a text saying "I don't think I can do this anymore" between appointments, an email at 4 AM with no clear acute statement but an unmistakable tone shift. Every clinician will face some version of this. The course material below builds the framework.</p>

<h3>Set Expectations in the Consent Document — Before the First Crisis</h3>
<p>Your informed consent should specify: (1) how clients can reach you between sessions (and through which channels), (2) what your typical response time is to non-urgent messages, (3) that crisis messages should not be sent through unsecured channels — clients in acute crisis should call 988 or go to the nearest emergency department immediately, (4) that secure-messaging features within the telehealth platform are checked during business hours only, and (5) the after-hours coverage plan if any (peer coverage, your voicemail's redirect to 988, etc.).</p>
<p>This is not legalistic boilerplate — it is a client protection. A client who reaches a voicemail at 2 AM and hears "I can't respond until tomorrow; if you are in crisis right now, please call 988 or go to your nearest emergency room" is being given the resource they actually need in that moment.</p>

<h3>Triage by Channel and Content</h3>
<p><strong>Voicemail with explicit suicidal content.</strong> Treat as a session-equivalent crisis event. Call back immediately. If you cannot reach the client, follow the graduated protocol from earlier in this section: phone → emergency contact → welfare check at the client's jurisdiction. Document the voicemail content verbatim, the time it was received, the time you became aware of it, the actions taken in response, and the outcome.</p>
<p><strong>Text message with crisis language.</strong> Standard SMS is not HIPAA-compliant for clinical discussion. Respond briefly with a non-clinical acknowledgment and direction to a secure channel: "I received your message. I'm calling you now — please pick up." Do not respond to the clinical content in text. Document the message contents and your response. If the client does not pick up, follow the graduated protocol.</p>
<p><strong>Email after hours.</strong> Email is also generally not HIPAA-compliant unless your platform offers encrypted email. For an email indicating acute crisis, treat as a voicemail-equivalent. For an email expressing distress without acute risk markers, respond with a brief acknowledgment that you have received it, that you will follow up at the next scheduled session, and that if anything escalates before then, the client should call 988 or go to an emergency department.</p>
<p><strong>Secure-platform messaging.</strong> If your platform's secure messaging carries a BAA and you have set expectations that it is checked during business hours, an after-hours crisis message can be triaged the next business morning unless the client has indicated escalating risk. For escalating risk, treat as voicemail-equivalent.</p>

<h3>The "I Hear You" Protocol for Between-Session Crisis</h3>
<p>When you make the callback or send the secure-message response, the structure of the contact matters. The protocol: (1) acknowledge the message — "I got your message and I want to make sure you're okay"; (2) assess current state — "Where are you right now? Are you alone? Are you safe in this moment?"; (3) move to a synchronous channel — schedule a same-day or next-day video session, or initiate one now if available; (4) document the contact contemporaneously; (5) follow up — even if the client says they are fine now, schedule a check-in within 24 hours.</p>

<h3>Never-Do List for Between-Session Crisis Contact</h3>
<ul style="margin:6px 0 10px 22px">
  <li>Never conduct clinical conversation over standard SMS or unencrypted email.</li>
  <li>Never delay responding to a clear suicidal voicemail. "I'll call tomorrow" is not acceptable practice.</li>
  <li>Never document the contact from memory days later. Document at the time of the contact or immediately after.</li>
  <li>Never assume "they said they were fine" closes the loop. Schedule the follow-up.</li>
  <li>Never check the client's social media to assess safety. That breaches several ethical principles at once.</li>
</ul>`,
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 6 — Firearm Means Restriction (protocol callout)
// ════════════════════════════════════════════════════════════════════
const FIREARM_SCRIPT_CALLOUT = {
  type: 'callout',
  calloutType: 'protocol',
  title: 'Firearm Means Restriction: Practical Script & Resources',
  content: `<p>Firearm access is the single largest modifiable risk factor in suicide. A clinician who treats means restriction as a check-box question ("Do you have access to a firearm?") leaves on the table the most effective intervention available. The script and resources below give you the tools to do it well — remotely.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">The clinical script (sample language)</h4>
<p style="background:#faf8f3;padding:10px 14px;border-left:3px solid #D4A855;font-style:italic">"Many people I've worked with who have been where you are right now have found it helpful to put some distance between themselves and the firearms in their home — temporarily, while we work through this. The research is clear that simply slowing down the moment of crisis saves lives. I'd like to talk through some options that might work for you. There's no single right answer — we'll find what fits your situation."</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">Voluntary storage options to walk through with the client</h4>
<ul style="margin:6px 0 10px 22px">
  <li><strong>Trusted family member or friend</strong> — most common; check that the recipient understands the safety frame and will return only when the client is no longer in crisis</li>
  <li><strong>Federally licensed firearm dealer (FFL)</strong> — many will hold firearms temporarily for nominal fees; this is legally clean</li>
  <li><strong>Local law-enforcement agency</strong> — most accept voluntary surrender for temporary safekeeping; policies vary, call first</li>
  <li><strong>Self-storage with restricted access</strong> — gun safe with combination held by a third party</li>
</ul>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">If voluntary storage isn't workable, in-home means restriction</h4>
<ul style="margin:6px 0 10px 22px">
  <li>Gun lock (cable or trigger) — free programs include Project ChildSafe (projectchildsafe.org), many local sheriff's offices, and SAFE Project nationwide</li>
  <li>Gun safe with combination held by a partner / sponsor</li>
  <li>Ammunition separated from the firearm and stored at a different location</li>
</ul>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">Red Flag Laws (Extreme Risk Protection Orders)</h4>
<p>As of 2024, 21 states and DC have ERPO statutes that allow a court to temporarily order the surrender of firearms from a person determined to be a risk to self or others. In most states, the petitioner is a family member or law enforcement officer, but several states (CA, CT, DC, HI, MA, MD, NJ, NY) allow medical or mental-health professionals to petition directly. Know your client's state. If your client's state has an ERPO statute and the voluntary route has failed, this is a legal tool you can invoke or recommend to a family member.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">Child Access Prevention (CAP) laws</h4>
<p>Sixteen states + DC have CAP laws that criminalize negligent firearm storage when a minor accesses the weapon. When a suicidal parent is in the home with minors, CAP-law states give you an additional legal lever — the parent has a statutory duty to secure the weapon regardless of their own safety choices.</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">When the client refuses means restriction</h4>
<p>Document the refusal verbatim, the offered options, and the clinical recommendation. Escalate the safety plan — increase session frequency, involve the emergency contact directly (with consent or under 164.512(j) if the threat is imminent), and consider whether the level of risk now meets the threshold for ED transport or involuntary evaluation. Refusal is information, not the end of the conversation.</p>

<p style="margin-top:14px;font-size:0.88em"><strong>Documentation:</strong> "Means restriction counseling provided per protocol. Options offered: [list]. Client elected: [option] / declined all options. Rationale for client's choice: [verbatim]. Plan: [follow-up specifics]."</p>`,
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 7 — Postvention (text)
// ════════════════════════════════════════════════════════════════════
const POSTVENTION_TEXT = {
  type: 'text',
  content: `<!--${M.postvention}-->
<h2>When a Client Dies by Suicide: The Clinician's First 72 Hours</h2>
<p>Approximately one in four mental-health professionals will experience a client suicide during their career. Despite the prevalence, training on what to do in the hours and days after is sparse. This subsection walks through the first 72 hours.</p>

<h3>Hour 0–6: Secure the Record</h3>
<p>The moment you learn of a client's death, your clinical record becomes a legal document under heightened scrutiny. Do not edit existing notes. Do not add notes "from memory" about prior sessions. Do not delete or move files. If you have draft notes that you have not yet finalized, finalize them dated to the original session, and then add a clearly dated and time-stamped post-death note that documents what you have just learned, from whom, and when. Print or back up the full record to a secured location.</p>

<h3>Hour 0–24: Notify the People Who Need to Know</h3>
<p><strong>Clinical supervisor or peer consultant.</strong> Call them within hours, not days. Their role is to listen, document, and help you stabilize — clinically and emotionally.</p>
<p><strong>Malpractice insurance carrier.</strong> Notify within 24 hours. Most policies require prompt notification, and many provide an attorney for these situations at no additional cost. Notification is not an admission of liability — it is the activation of a defense team you may or may not need.</p>
<p><strong>State licensing board.</strong> Unless your state requires self-reporting (most do not for a client death), a board notification is generally not required. Consult your carrier's attorney before any board contact.</p>
<p><strong>Other clients in the practice.</strong> If the deceased was part of a group or family in your practice, you may need to communicate the loss to surviving members. Coordinate with the carrier's attorney before any disclosure.</p>

<h3>Hour 6–72: Communication with the Family</h3>
<p>HIPAA's protections for a deceased client persist for 50 years. The clinician cannot share clinical content with the family without proper legal authorization (executor, court order, or a previously signed release). However, the clinician <em>can</em> offer condolences, express care for the client and the family, and acknowledge the loss as devastating — without admitting fault and without disclosing clinical content.</p>
<p>If the family asks for a meeting, consult your carrier's attorney before agreeing. A meeting is not legally precluded, but it requires careful preparation. If you do meet, you can listen, acknowledge their grief, and answer questions about general process — not about specific clinical content unless properly authorized.</p>
<p>Refer the family to grief resources for suicide loss survivors: the American Foundation for Suicide Prevention's Survivor Outreach Program (afsp.org), Alliance of Hope (allianceofhope.org), and local Survivors of Suicide (SOS) support groups.</p>

<h3>Hour 24–72: Your Own Response</h3>
<p>Clinicians who lose a client to suicide commonly experience symptoms that mirror PTSD: intrusive thoughts about the final session, guilt, sleep disruption, hyperarousal at certain clinical content, avoidance of similar cases. These responses are normal. They are not evidence of clinical failure.</p>
<p>In the first 72 hours: do not return to other client sessions until you are functionally stable; reschedule sessions if needed. Engage your own therapist or supervisor in processing. Do not isolate. Limit alcohol — the impulse to numb is strong and counterproductive. Sleep is medicinal; protect it.</p>
<p>In the weeks following: continue supervision or peer consultation focused on the case. Many clinicians find professional grief groups specifically for clinician suicide-loss survivors (such as those offered by the American Association of Suicidology) deeply helpful. Some take time away from acute-risk clinical work for a defined period and return graduated.</p>

<h3>Returning to Practice</h3>
<p>The return to telehealth practice after a client suicide deserves careful planning. Consider: a graduated return (fewer sessions per day initially), a review of your crisis protocol with fresh eyes, ongoing supervision for at least 90 days post-event, and an honest assessment of whether the deceased's case revealed any practice-level patterns worth changing.</p>
<p>Some clinicians find that the experience deepens their clinical capacity for high-acuity work. Others find they need to shift their practice mix. There is no single right answer. The work is to make the choice consciously rather than reactively.</p>

<p style="margin-top:14px;padding:10px 14px;background:#faf8f3;border-left:3px solid #6B1D34;font-size:0.92em"><strong>Resources for clinician suicide-loss survivors:</strong><br>
&bull; American Association of Suicidology Clinician Survivor Task Force — cliniciansurvivor.org<br>
&bull; American Foundation for Suicide Prevention — afsp.org<br>
&bull; Coalition of Clinician-Survivors (within AAS) — peer consultation<br>
&bull; SPRC (Suicide Prevention Resource Center) — postvention toolkits</p>`,
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 8 — After Hours: The Voicemail (scenarioTree)
// ════════════════════════════════════════════════════════════════════
const VOICEMAIL_SCENARIO = {
  type: 'scenarioTree',
  scenarioTitle: 'After Hours: The Voicemail',
  instructions:
    "It's 10:43 PM Friday. You check your phone before bed and see a voicemail from your client Marcus, left at 9:17 PM. You play it back. The intake-session emergency contact on file is Marcus's father, Robert, in the same town.",
  startNode: 'start',
  nodes: {
    start: {
      text: `<p style="background:#faf8f3;border-left:3px solid #D4A855;padding:10px 14px;margin-bottom:14px;font-style:italic">The voicemail, transcribed: "Hey, Dr. Johnson, it's Marcus. I just... I don't know. I've been thinking a lot today. I might not be around much longer. Anyway. Don't worry about calling back, I'm fine, sorry to bother you. Okay. Bye."</p><p><strong>Step 1 of 5.</strong> What do you do first?</p>`,
      choices: [
        {
          text: 'Wait until Monday morning — he said not to worry about calling back',
          next: 'vm_s1_wait',
        },
        {
          text: 'Text Marcus: "Got your message, are you okay?"',
          next: 'vm_s1_text',
        },
        {
          text: 'Call Marcus right now',
          next: 'vm_s1_call',
        },
      ],
    },
    vm_s1_wait: {
      text: `<p style="color:#a02828"><strong>Not safe.</strong> "Don't worry about calling back, I'm fine" said immediately after "I might not be around much longer" is one of the textbook ambivalence signatures of suicidal disclosure. The "don't worry" framing is a common protective dismissal that should heighten, not lower, your concern. Waiting until Monday is not defensible.</p>`,
      choices: [{ text: "What's the right first move?", next: 'vm_s1_call' }],
    },
    vm_s1_text: {
      text: `<p style="color:#a02828"><strong>Wrong channel.</strong> Standard SMS isn't HIPAA-compliant for clinical content, and a text leaves you waiting for a response that may not come — while Marcus may already be unable to respond. Move to a synchronous channel immediately.</p>`,
      choices: [{ text: 'Switch approach', next: 'vm_s1_call' }],
    },
    vm_s1_call: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Voicemail with explicit suicidal content is a session-equivalent crisis event. You call Marcus's number directly — three rings, four, voicemail. You try again — same result. You leave a brief message: "Marcus, it's Dr. Johnson. I just heard your voicemail. I'm calling to make sure you're okay. Please call me back as soon as you get this — anytime tonight, no matter what time. I'm here."</p><p style="margin-top:12px"><strong>Step 2 of 5.</strong> No response after both call attempts. What now?</p>`,
      choices: [
        {
          text: 'Hang up and try again in the morning',
          next: 'vm_s2_hang',
        },
        {
          text: 'Call Marcus\'s father Robert (emergency contact on file)',
          next: 'vm_s2_father',
        },
        {
          text: 'Call 911 in Marcus\'s town',
          next: 'vm_s2_911',
        },
      ],
    },
    vm_s2_hang: {
      text: `<p style="color:#a02828"><strong>No.</strong> The graduated protocol exists specifically for this moment — when the client cannot be reached and risk is elevated. Continue the escalation.</p>`,
      choices: [{ text: "Next step in the protocol", next: 'vm_s2_father' }],
    },
    vm_s2_911: {
      text: `<p style="color:#a08028"><strong>Premature.</strong> 911 is the right destination eventually if the graduated protocol fails, but you haven't tried the emergency contact yet. Also: 911 from your phone routes to your local dispatch, not Marcus's. Use the non-emergency dispatch number for his town if you need law enforcement. Try the emergency contact first.</p>`,
      choices: [{ text: 'Call the emergency contact', next: 'vm_s2_father' }],
    },
    vm_s2_father: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Robert answers on the second ring. You identify yourself, briefly: "Hi Robert, this is Dr. Johnson — I'm Marcus's counselor. I have a concern about Marcus's safety tonight and I need your help." This disclosure is permitted under 45 CFR 164.512(j) — good-faith belief, person reasonably able to lessen the threat, minimum necessary information. Robert says: "I haven't talked to Marcus today. Should I drive over?"</p><p style="margin-top:12px"><strong>Step 3 of 5.</strong> What do you ask Robert to do?</p>`,
      choices: [
        {
          text: '"Yes — please drive to Marcus\'s right now and stay with him. Keep this line open or call me back the moment you get there."',
          next: 'vm_s3_correct',
        },
        {
          text: '"Just call Marcus on his phone — he\'ll answer for you."',
          next: 'vm_s3_phone',
        },
        {
          text: '"Wait at home; I\'ll send the police to Marcus\'s and call you back after."',
          next: 'vm_s3_wait',
        },
      ],
    },
    vm_s3_phone: {
      text: `<p style="color:#a08028"><strong>Partial.</strong> Robert may be able to reach Marcus by phone, but in-person presence is the more reliable intervention. If Marcus is unable or unwilling to answer your call, he may also not answer Robert's. Direct Robert to go physically.</p>`,
      choices: [{ text: 'Redirect Robert', next: 'vm_s3_correct' }],
    },
    vm_s3_wait: {
      text: `<p style="color:#a08028"><strong>Loses time.</strong> If Robert is 10 minutes from Marcus and emergency services may be 20+ minutes for a non-active welfare check, sending Robert is the faster response. You can still call the non-emergency dispatch in parallel.</p>`,
      choices: [{ text: 'Restart with Robert going', next: 'vm_s3_correct' }],
    },
    vm_s3_correct: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Robert is on his way and agrees to call you when he arrives. You stay on standby. Eight minutes later, Robert calls back: "I'm here. Marcus is alive but he just told me he took a bunch of his pills about 25 minutes ago. He's awake but slurring."</p><p style="margin-top:12px"><strong>Step 4 of 5.</strong> What do you tell Robert?</p>`,
      choices: [
        {
          text: '"Call 911 right now from your phone — you\'re at the location, your call routes to Marcus\'s local dispatch. Tell them suspected overdose, awake but altered. Stay with Marcus."',
          next: 'vm_s4_correct',
        },
        {
          text: '"Drive him to the nearest ER — that\'s faster than waiting for paramedics."',
          next: 'vm_s4_drive',
        },
        {
          text: '"Make him throw up to clear the pills."',
          next: 'vm_s4_emetic',
        },
      ],
    },
    vm_s4_drive: {
      text: `<p style="color:#a02828"><strong>Don't do this.</strong> An overdose patient who is currently awake but slurring can lose consciousness en route. Paramedics carry naloxone, oxygen, monitoring, and the legal authority to transport directly to the appropriate emergency setting. Driving privately also bypasses the EMS chain of documentation. 911 from Robert's phone reaches local dispatch quickly.</p>`,
      choices: [{ text: 'Correct that instruction', next: 'vm_s4_correct' }],
    },
    vm_s4_emetic: {
      text: `<p style="color:#a02828"><strong>Outdated and unsafe.</strong> Forced emesis is no longer recommended in any overdose protocol — for certain substances it can cause aspiration and worsen outcomes. Defer to paramedics.</p>`,
      choices: [{ text: 'Correct that instruction', next: 'vm_s4_correct' }],
    },
    vm_s4_correct: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Robert calls 911. Paramedics arrive in 11 minutes. Marcus is transported to the local ED. Robert texts you 90 minutes later: "He's stable. They're admitting him to inpatient for 72-hour observation. Thank you."</p><p style="margin-top:12px"><strong>Step 5 of 5.</strong> It's now 11:58 PM. What do you do before sleeping?</p>`,
      choices: [
        {
          text: 'Document everything contemporaneously — voicemail content verbatim, all calls made with timestamps, all decisions and their bases, including the 45 CFR 164.512(j) disclosure to Robert',
          next: 'vm_s5_correct',
        },
        {
          text: 'Go to sleep — you can write it all up in the morning when you\'re rested',
          next: 'vm_s5_morning',
        },
        {
          text: 'Write a quick note "called emergency contact, all resolved" and document the full event next week',
          next: 'vm_s5_brief',
        },
      ],
    },
    vm_s5_morning: {
      text: `<p style="color:#a02828"><strong>Don't.</strong> Documentation written from memory after sleep loses the verbatim content, the precise timeline, and the clinical reasoning that was clear in the moment. Crisis documentation is legally and clinically protective only when contemporaneous. Document tonight.</p>`,
      choices: [{ text: 'Document now', next: 'vm_s5_correct' }],
    },
    vm_s5_brief: {
      text: `<p style="color:#a02828"><strong>Insufficient.</strong> A summary note without the verbatim voicemail, the timeline of attempts, the 164.512(j) disclosure rationale, and the specific clinical reasoning will not hold up if the case is reviewed. Full documentation, tonight.</p>`,
      choices: [{ text: 'Full documentation now', next: 'vm_s5_correct' }],
    },
    vm_s5_correct: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> You document for 45 minutes: voicemail transcript verbatim, call attempt timestamps, the call to Robert with the 164.512(j) rationale ("disclosure made based on explicit suicidal statement in voicemail + non-response to callback + good-faith belief in imminent threat; disclosure limited to emergency contact and to information necessary for the safety response"), Robert's update calls, the EMS dispatch, the inpatient admission. You email your peer-consultation partner and ask for a debrief call tomorrow. You set an alarm to follow up with Robert and the inpatient team Monday morning.</p>
<p style="margin-top:14px;padding:10px 14px;background:#faf8f3;border-radius:6px;border-left:3px solid #4A7C59"><strong>Six months later</strong>, Marcus thanks you for calling back. He tells you the voicemail was him trying to say goodbye without alarming anyone. The fact that you didn't wait until Monday is, in his words, "the reason I'm still here." You document the followup in the chart, including his retrospective consent to discuss the prior event going forward.</p>
<p style="margin-top:10px;padding:10px 14px;background:#fef6e7;border-radius:6px;border-left:3px solid #D4A855;font-size:0.92em"><strong>The five non-negotiables of between-session crisis response:</strong><br>
✓ Voicemail with suicidal content is a session-equivalent event — respond immediately, regardless of the hour<br>
✓ Move to synchronous channels — never conduct clinical conversation by SMS or unencrypted email<br>
✓ Use 45 CFR 164.512(j) — disclosure to a person reasonably able to lessen the threat is HIPAA-compliant<br>
✓ Direct emergency contacts to call 911 from the contact's location, not yours<br>
✓ Document contemporaneously — tonight, not Monday</p>`,
      isEnd: true,
    },
  },
  accessibility: {
    role: 'application',
    ariaLabel: 'Scenario: After-hours crisis voicemail walkthrough',
  },
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 9 — keyTakeaway
// ════════════════════════════════════════════════════════════════════
const CRISIS_KEYTAKEAWAY = {
  type: 'keyTakeaway',
  title: 'Crisis Essentials — The 7 Non-Negotiables',
  takeaways: [
    'Pre-crisis planning is the work — collect address, emergency contact, local non-emergency dispatch number, and nearest ED at intake; verify the location every session',
    "Maintain therapeutic presence above all else — your steady voice and continued attention are the intervention. Don't end a session because you panic",
    'Graduated reconnect protocol when contact drops: platform → phone → emergency contact → emergency services in the CLIENT\'s jurisdiction (never 911 from your own location for an out-of-state client)',
    'HIPAA 45 CFR 164.512(j) authorizes good-faith disclosure to avert serious and imminent threat — to persons reasonably able to lessen the threat, minimum necessary scope',
    'The crisis library you must memorize: 988 (Suicide & Crisis Lifeline), 988+1 (Veterans), 1-866-488-7386 (Trevor Project), text HOME to 741741 (Crisis Text Line), 1-800-422-4453 (Childhelp)',
    'Means restriction — especially firearm — is the single highest-impact safety-plan intervention; have a script, know the local resources, document refusals',
    'Postvention is part of the protocol — document, notify carrier, secure the record, engage your own support; clinicians lose 1 in 4 clients to suicide on average and need a plan',
  ],
};

// ════════════════════════════════════════════════════════════════════
// BLOCK 10 — Two new final-assessment questions
// ════════════════════════════════════════════════════════════════════
const NEW_ASSESSMENT_QUESTIONS = [
  {
    question:
      'The national 988 Suicide & Crisis Lifeline is reachable through which of the following channels?',
    type: 'multipleChoice',
    options: [
      { text: 'Voice call only (dial 988)', isCorrect: false },
      { text: 'Call 988, text 988, or chat via 988lifeline.org — 24/7, with specialized routing for Veterans (press 1), Spanish, and LGBTQ+ (press 3)', isCorrect: true },
      { text: 'Voice call (dial 988) plus a separate text line (text HOME to 741741)', isCorrect: false },
      { text: '988 is a regional pilot and is not yet available nationally', isCorrect: false },
    ],
    correctAnswer: 1,
    explanation:
      'Since July 2022, 988 functions as the national Suicide & Crisis Lifeline accessible by voice call, text, or web chat 24/7. Built-in routing options include Spanish, Veterans (press 1), and LGBTQ+ (press 3). The separately operated Crisis Text Line (HOME to 741741) is an additional resource but is not part of 988.',
  },
  {
    question:
      "Under HIPAA's emergency disclosure exception at 45 CFR 164.512(j), a clinician may disclose protected health information without the client's authorization when:",
    type: 'multipleChoice',
    options: [
      {
        text: 'A family member requests information about the client',
        isCorrect: false,
      },
      {
        text: 'The clinician, in good faith, believes the disclosure is necessary to prevent or lessen a serious and imminent threat to health or safety, and the disclosure is to a person reasonably able to prevent or lessen the threat — limited to the minimum necessary information',
        isCorrect: true,
      },
      {
        text: 'The clinician feels generally concerned about the client',
        isCorrect: false,
      },
      {
        text: 'HIPAA has no provision for disclosure without consent under any circumstances',
        isCorrect: false,
      },
    ],
    correctAnswer: 1,
    explanation:
      "45 CFR 164.512(j) permits disclosure without authorization when (a) the clinician's good-faith belief is that disclosure is necessary to avert a serious & imminent threat, (b) the disclosure is to a person reasonably able to prevent or lessen the threat (e.g., emergency dispatcher, family member acting on the safety event), and (c) only the minimum necessary information is disclosed. The basis for the good-faith belief should be documented contemporaneously.",
  },
];

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
function findCrisisSection(course) {
  return (course.sections || []).findIndex(
    s => typeof s.title === 'string' && /crisis/i.test(s.title)
  );
}

function sectionHasMarker(section, markerSubstring) {
  return (section.contentBlocks || []).some(b => {
    const haystack = JSON.stringify(b);
    return haystack.includes(markerSubstring);
  });
}

function insertAfterBlockWith(section, predicate, newBlock) {
  const idx = section.contentBlocks.findIndex(predicate);
  if (idx < 0) {
    section.contentBlocks.push(newBlock);
    return 'appended-end';
  }
  section.contentBlocks.splice(idx + 1, 0, newBlock);
  return `inserted-at-${idx + 1}`;
}

function insertBeforeBlockWith(section, predicate, newBlock) {
  const idx = section.contentBlocks.findIndex(predicate);
  if (idx < 0) {
    section.contentBlocks.push(newBlock);
    return 'appended-end';
  }
  section.contentBlocks.splice(idx, 0, newBlock);
  return `inserted-at-${idx}`;
}

function applyCrisisExpansion(course) {
  const changes = [];
  const sIdx = findCrisisSection(course);
  if (sIdx < 0) {
    changes.push({ kind: '⚠ skip', note: '§8 (Crisis) section not found by title match' });
    return { course, changes };
  }
  const section = course.sections[sIdx];
  const path = `sections[${sIdx}]`;

  // Insertion order is intentional — earlier inserts shift later block indices,
  // so we drive each one off a content-predicate, not a numeric index.

  // 1. 988 Hotlines — right after the section opener intro text
  if (sectionHasMarker(section, M.hotlines)) {
    changes.push({ kind: 'skip — already present', path, item: '988 Hotlines callout' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'text' && /Pre-Crisis Planning/.test(b.content || ''),
      HOTLINES_CALLOUT
    );
    changes.push({ kind: 'addition', path, where, item: '988 Hotlines callout' });
  }

  // 2. HIPAA Disclosure Exception — right after the 988 callout
  if (sectionHasMarker(section, M.hipaaDisclosure)) {
    changes.push({ kind: 'skip — already present', path, item: 'HIPAA 164.512(j) callout' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'callout' && b.title === HOTLINES_CALLOUT.title,
      HIPAA_DISCLOSURE_CALLOUT
    );
    changes.push({ kind: 'addition', path, where, item: 'HIPAA 164.512(j) callout' });
  }

  // 3. Four Things You Never Do — after the 5-step flashcardDeck
  if (sectionHasMarker(section, M.fourThings)) {
    changes.push({ kind: 'skip — already present', path, item: 'Four Nevers callout' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'flashcardDeck' && /Crisis Response Protocol/i.test(b.title || ''),
      FOUR_NEVERS_CALLOUT
    );
    changes.push({ kind: 'addition', path, where, item: 'Four Nevers callout' });
  }

  // 4. Beyond Suicide text — after the involuntary-commitment text
  if (sectionHasMarker(section, M.beyondSuicide)) {
    changes.push({ kind: 'skip — already present', path, item: 'Beyond Suicide text' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'text' && /Involuntary Commitment Across State Lines/.test(b.content || ''),
      BEYOND_SUICIDE_TEXT
    );
    changes.push({ kind: 'addition', path, where, item: 'Beyond Suicide text' });
  }

  // 5. Between-Session Crisis text — after Beyond Suicide
  if (sectionHasMarker(section, M.betweenSession)) {
    changes.push({ kind: 'skip — already present', path, item: 'Between-Session Crisis text' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'text' && (b.content || '').includes(M.beyondSuicide),
      BETWEEN_SESSION_TEXT
    );
    changes.push({ kind: 'addition', path, where, item: 'Between-Session Crisis text' });
  }

  // 6. Firearm Means Restriction — after Between-Session
  if (sectionHasMarker(section, M.firearmScript)) {
    changes.push({ kind: 'skip — already present', path, item: 'Firearm Means Restriction callout' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'text' && (b.content || '').includes(M.betweenSession),
      FIREARM_SCRIPT_CALLOUT
    );
    changes.push({ kind: 'addition', path, where, item: 'Firearm Means Restriction callout' });
  }

  // 7. Postvention — after Firearm
  if (sectionHasMarker(section, M.postvention)) {
    changes.push({ kind: 'skip — already present', path, item: 'Postvention 72-hour text' });
  } else {
    const where = insertAfterBlockWith(
      section,
      b => b.type === 'callout' && b.title === FIREARM_SCRIPT_CALLOUT.title,
      POSTVENTION_TEXT
    );
    changes.push({ kind: 'addition', path, where, item: 'Postvention 72-hour text' });
  }

  // 8. After Hours: The Voicemail scenarioTree — after the existing 2 scenarioTrees
  if (sectionHasMarker(section, M.voicemailScenario)) {
    changes.push({ kind: 'skip — already present', path, item: 'After Hours Voicemail scenarioTree' });
  } else {
    // Find LAST scenarioTree in section, insert after
    let lastSt = -1;
    section.contentBlocks.forEach((b, i) => {
      if (b.type === 'scenarioTree') lastSt = i;
    });
    if (lastSt >= 0) {
      section.contentBlocks.splice(lastSt + 1, 0, VOICEMAIL_SCENARIO);
      changes.push({
        kind: 'addition',
        path,
        where: `inserted-at-${lastSt + 1}`,
        item: 'After Hours Voicemail scenarioTree',
      });
    } else {
      section.contentBlocks.push(VOICEMAIL_SCENARIO);
      changes.push({ kind: 'addition', path, where: 'appended-end', item: 'After Hours Voicemail scenarioTree' });
    }
  }

  // 9. keyTakeaway — right before the first multipleChoice (or before reflection)
  if (sectionHasMarker(section, M.endOfSectionTakeaway)) {
    changes.push({ kind: 'skip — already present', path, item: 'Crisis Essentials keyTakeaway' });
  } else {
    const where = insertBeforeBlockWith(
      section,
      b => b.type === 'reflection' || b.type === 'multipleChoice',
      CRISIS_KEYTAKEAWAY
    );
    changes.push({ kind: 'addition', path, where, item: 'Crisis Essentials keyTakeaway' });
  }

  // 10. Two new assessment questions — append to course.assessment.questions
  if (!course.assessment) course.assessment = { questions: [], passingScore: 80, maxAttempts: 3 };
  if (!Array.isArray(course.assessment.questions)) course.assessment.questions = [];

  let asmtChanged = false;
  for (const newQ of NEW_ASSESSMENT_QUESTIONS) {
    const already = course.assessment.questions.some(q =>
      typeof q.question === 'string' &&
      (q.question.includes('988 Suicide & Crisis Lifeline') && newQ.question.includes('988') ||
        q.question.includes('45 CFR 164.512(j)') && newQ.question.includes('164.512(j)'))
    );
    if (already) {
      changes.push({
        kind: 'skip — already present',
        path: 'assessment.questions',
        item: `Q on ${newQ.question.includes('988') ? '988' : 'HIPAA 164.512(j)'}`,
      });
      continue;
    }
    course.assessment.questions.push(newQ);
    asmtChanged = true;
    changes.push({
      kind: 'addition',
      path: 'assessment.questions',
      where: `appended (now ${course.assessment.questions.length} total)`,
      item: `Q on ${newQ.question.includes('988') ? '988' : 'HIPAA 164.512(j)'}`,
    });
  }

  return { course, changes };
}

async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 Stage 3 — CRISIS COVERAGE EXPANSION (§8)');
  console.log('  Mode:', APPLY ? 'APPLY (writes)' : 'DRY RUN (no writes)');
  console.log('═'.repeat(64));

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  for (const slug of TARGET_SLUGS) {
    console.log(`\n── slug: ${slug}`);
    const course = await collection.findOne({ slug });
    if (!course) {
      console.log('  (not found — skipping)');
      continue;
    }
    console.log(`  Found: "${course.title}" (${course.sections?.length || 0} sections, ${course.assessment?.questions?.length || 0} Qs)`);

    const { course: patched, changes } = applyCrisisExpansion(course);

    const adds = changes.filter(c => c.kind === 'addition');
    const skips = changes.filter(c => String(c.kind).startsWith('skip'));
    const warns = changes.filter(c => String(c.kind).startsWith('⚠'));

    console.log(`  Additions: ${adds.length}  |  Skipped (idempotent): ${skips.length}  |  Warnings: ${warns.length}`);
    adds.forEach(c => console.log(`    [add]  ${c.path}  ${c.where}  — ${c.item}`));
    skips.forEach(c => console.log(`    [skip] ${c.path}  ${c.item}`));
    warns.forEach(c => console.log(`    [warn] ${c.note}`));

    if (adds.length === 0) {
      console.log('  ✓ Nothing to do — section already current.');
      continue;
    }

    if (!APPLY) {
      console.log('  (dry run — no write performed)');
      continue;
    }

    const result = await collection.updateOne(
      { slug },
      { $set: { sections: patched.sections, assessment: patched.assessment, updatedAt: new Date() } }
    );
    console.log(`  ✓ Written. matched=${result.matchedCount} modified=${result.modifiedCount}`);

    // Verify
    const verify = await collection.findOne({ slug }, { projection: { sections: 1, 'assessment.questions': 1 } });
    const s8 = (verify.sections || []).find(s => /crisis/i.test(s.title));
    const blockCount = s8?.contentBlocks?.length || 0;
    const asmtCount = verify.assessment?.questions?.length || 0;
    console.log(`  Verification: §8 now has ${blockCount} blocks, assessment has ${asmtCount} questions`);
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
