// convert-videos-to-text.js
// Run with: node src/scripts/convert-videos-to-text.js
// This converts all video lessons to text lessons with professional CE content

const mongoose = require('mongoose');
require('dotenv').config();

// Educational content for each video lesson (keyed by lesson title)
const lessonContent = {
  // ===== SELF-CARE FOR CLINICIANS =====
  'Burnout vs Compassion Fatigue': `
<h2>Understanding the Difference</h2>
<p>While burnout and compassion fatigue are often used interchangeably, they represent distinct occupational hazards that require different interventions. Understanding these differences is essential for accurate self-assessment and effective prevention strategies.</p>

<h3>Burnout: The Erosion of Engagement</h3>
<p><strong>Burnout</strong> develops gradually from chronic workplace stress and is characterized by three core dimensions identified by Maslach and Leiter (2016):</p>
<ul>
  <li><strong>Emotional Exhaustion:</strong> Feeling drained, depleted, and overwhelmed by work demands</li>
  <li><strong>Depersonalization:</strong> Developing cynical attitudes toward clients, colleagues, or the work itself</li>
  <li><strong>Reduced Personal Accomplishment:</strong> Feeling ineffective and questioning the value of your work</li>
</ul>
<p>Burnout is not unique to helping professions—it can occur in any demanding work environment with insufficient resources, unclear expectations, or lack of autonomy.</p>

<h3>Compassion Fatigue: The Cost of Caring</h3>
<p><strong>Compassion fatigue</strong> (also called secondary traumatic stress) is specifically related to the emotional labor of caring for others who are suffering. Figley (2002) defined it as "a state of tension and preoccupation with the traumatized patients by re-experiencing the traumatic events, avoidance/numbing of reminders, and persistent arousal."</p>
<p>Key characteristics include:</p>
<ul>
  <li>Intrusive thoughts about clients' trauma</li>
  <li>Emotional numbing or decreased empathy</li>
  <li>Hypervigilance and difficulty sleeping</li>
  <li>Somatic symptoms (headaches, GI issues)</li>
  <li>Feeling helpless or hopeless about clients' situations</li>
</ul>

<h3>Critical Distinction</h3>
<p>The key difference: <strong>Burnout</strong> comes from the <em>work environment</em> (caseload, paperwork, organizational issues), while <strong>compassion fatigue</strong> comes from the <em>nature of the work itself</em> (absorbing clients' pain and trauma).</p>
<p>A clinician can experience one, both, or neither. Effective self-care requires identifying which you're experiencing to implement appropriate interventions.</p>
`,

  'Vicarious Trauma for Therapists': `
<h2>Understanding Vicarious Trauma</h2>
<p>Vicarious trauma (VT), also known as secondary traumatic stress, refers to the cumulative transformative effect on helpers who work with trauma survivors. Unlike compassion fatigue, which primarily involves emotional exhaustion, vicarious trauma involves profound shifts in worldview, beliefs, and sense of safety.</p>

<h3>The Mechanism of Vicarious Trauma</h3>
<p>Pearlman and Saakvitne (1995) described vicarious trauma as occurring through empathic engagement with clients' trauma material. When we deeply attune to clients' experiences of violation, terror, and loss, we may begin to internalize aspects of their traumatic worldview.</p>

<h3>Signs of Vicarious Trauma</h3>
<p><strong>Cognitive disruptions:</strong></p>
<ul>
  <li>Altered beliefs about safety ("The world is dangerous")</li>
  <li>Difficulty trusting others or institutions</li>
  <li>Questioning meaning and purpose</li>
  <li>Intrusive imagery from clients' trauma narratives</li>
</ul>

<p><strong>Emotional changes:</strong></p>
<ul>
  <li>Chronic sadness or despair</li>
  <li>Increased anxiety, especially about loved ones</li>
  <li>Emotional numbing or disconnection</li>
  <li>Irritability and anger</li>
</ul>

<p><strong>Behavioral manifestations:</strong></p>
<ul>
  <li>Social withdrawal and isolation</li>
  <li>Overprotective behaviors with family</li>
  <li>Difficulty maintaining boundaries</li>
  <li>Changes in intimacy and relationships</li>
</ul>

<h3>Risk Factors</h3>
<p>Research indicates several factors increase vulnerability to vicarious trauma:</p>
<ul>
  <li>Personal trauma history</li>
  <li>High caseload of trauma clients</li>
  <li>Limited supervision and peer support</li>
  <li>Newer clinicians with less training</li>
  <li>Working in isolation</li>
</ul>

<h3>Prevention and Mitigation</h3>
<p>The good news: vicarious trauma is both preventable and treatable. Key strategies include maintaining diverse caseloads, regular supervision, personal therapy, and deliberate cultivation of experiences that affirm positive aspects of humanity.</p>
`,

  'Evidence-Based Self-Care': `
<h2>Moving Beyond Bubble Baths: Evidence-Based Self-Care</h2>
<p>Effective self-care for clinicians goes far beyond occasional relaxation activities. Research points to systematic, intentional practices that address physical, emotional, professional, and relational domains.</p>

<h3>The Evidence Base</h3>
<p>Skovholt and Trotter-Mathison (2016) emphasize that sustainable practice requires attending to the "caring cycle"—the rhythm of giving and replenishing. Without intentional replenishment, depletion is inevitable.</p>

<h3>Physical Self-Care</h3>
<p>Research consistently supports these foundational practices:</p>
<ul>
  <li><strong>Sleep hygiene:</strong> 7-9 hours of quality sleep significantly impacts emotional regulation and cognitive function</li>
  <li><strong>Regular exercise:</strong> Even 20-30 minutes of moderate activity 3x/week reduces stress hormones</li>
  <li><strong>Nutrition:</strong> Stable blood sugar supports mood regulation</li>
  <li><strong>Mindfulness practice:</strong> Even brief daily practice (5-10 minutes) reduces reactivity</li>
</ul>

<h3>Professional Self-Care</h3>
<ul>
  <li><strong>Caseload management:</strong> Balance high-intensity cases with lower-acuity clients</li>
  <li><strong>Transition rituals:</strong> Develop practices to separate work from personal life</li>
  <li><strong>Continuing education:</strong> Learning new skills combats stagnation</li>
  <li><strong>Supervision and consultation:</strong> Regular professional support is essential, not optional</li>
</ul>

<h3>Relational Self-Care</h3>
<ul>
  <li>Maintain relationships outside of the profession</li>
  <li>Connect with colleagues who understand the work</li>
  <li>Nurture intimate relationships with intention</li>
</ul>

<h3>Creating a Personal Self-Care Plan</h3>
<p>Effective self-care is:</p>
<ul>
  <li><strong>Proactive</strong> (not reactive)</li>
  <li><strong>Regular</strong> (not occasional)</li>
  <li><strong>Specific</strong> (scheduled, not vague intentions)</li>
  <li><strong>Multidimensional</strong> (addressing multiple life domains)</li>
</ul>
<p>Consider: What are your early warning signs? What works for you? What barriers exist, and how will you address them?</p>
`,

  // ===== ACTIVE LISTENING =====
  'Active Listening Skills': `
<h2>SOLER: The Foundation of Attending</h2>
<p>Gerard Egan's SOLER model provides a memorable framework for the nonverbal components of active listening. These behaviors communicate presence and attention, creating the conditions for therapeutic connection.</p>

<h3>S - Squarely Face the Client</h3>
<p>Position yourself to face the client directly, which communicates involvement and attention. This doesn't require rigid positioning—a slight angle can feel less confrontational while maintaining engagement.</p>

<h3>O - Open Posture</h3>
<p>An open posture (uncrossed arms and legs) signals receptivity and accessibility. Crossed arms can unconsciously communicate defensiveness or judgment, even when unintended.</p>

<h3>L - Lean Forward</h3>
<p>A slight forward lean communicates interest and engagement. Leaning back can signal disinterest or detachment. The key is a natural, comfortable position that conveys attentiveness.</p>

<h3>E - Eye Contact</h3>
<p>Appropriate eye contact is culturally informed but generally signals attention and respect. The goal is natural, comfortable eye contact—not an unblinking stare. Breaking eye contact periodically is normal and reduces intensity.</p>

<h3>R - Relaxed</h3>
<p>While attending to the other elements, maintain a relaxed presence. Tension in the therapist can be felt by clients and interferes with the sense of safety needed for disclosure.</p>

<h3>Beyond SOLER: Vocal Qualities</h3>
<p>Active listening also involves:</p>
<ul>
  <li><strong>Tone:</strong> Warm, interested, matching the emotional content</li>
  <li><strong>Pace:</strong> Allowing pauses, not rushing to fill silence</li>
  <li><strong>Minimal encouragers:</strong> "Mm-hmm," "Yes," "I see"</li>
</ul>

<h3>Cultural Considerations</h3>
<p>These guidelines emerged from Western contexts. Always consider cultural variations in eye contact, physical distance, and appropriate nonverbal communication. When uncertain, ask clients about their preferences.</p>
`,

  'Reflection of Feeling': `
<h2>Reflecting Content, Feeling, and Meaning</h2>
<p>Reflection is a foundational counseling skill that communicates understanding and helps clients deepen their self-awareness. Carl Rogers identified three levels of reflection, each serving different therapeutic purposes.</p>

<h3>Reflection of Content (Paraphrasing)</h3>
<p>At its simplest level, reflection involves restating the factual content of what the client has said, using different words. This demonstrates that you've heard the information accurately.</p>
<p><strong>Example:</strong><br>
Client: "I've been applying for jobs for three months and haven't gotten a single interview."<br>
Therapist: "So you've been job searching for quite a while without any callbacks."</p>

<h3>Reflection of Feeling</h3>
<p>Moving deeper, reflection of feeling captures the emotional experience underlying the client's words. This requires attending to tone, body language, and the emotional context of what's being shared.</p>
<p><strong>Example:</strong><br>
Client: "I've been applying for jobs for three months and haven't gotten a single interview."<br>
Therapist: "That sounds really discouraging—three months of effort without any positive response."</p>

<h3>Reflection of Meaning</h3>
<p>The deepest level connects feelings to personal values, beliefs, or identity. This type of reflection often uses a formula: "You feel ___ because ___."</p>
<p><strong>Example:</strong><br>
Client: "I've been applying for jobs for three months and haven't gotten a single interview."<br>
Therapist: "You're feeling defeated because this makes you question whether your skills are valued in the job market."</p>

<h3>Tips for Effective Reflection</h3>
<ul>
  <li>Use tentative language ("It sounds like..." "I'm sensing...")</li>
  <li>Expand the client's feeling vocabulary</li>
  <li>Match the intensity of the emotion</li>
  <li>Welcome correction—it deepens understanding</li>
</ul>
`,

  'Summarizing in Counseling': `
<h2>Clarification and Summarization Skills</h2>
<p>While reflection captures moment-to-moment content, clarification and summarization help organize and synthesize larger chunks of information, promoting client insight and ensuring mutual understanding.</p>

<h3>Clarification</h3>
<p>Clarification requests help when something is unclear, ambiguous, or potentially contradictory. Effective clarification:</p>
<ul>
  <li>Is genuinely curious, not challenging</li>
  <li>Uses open-ended questions</li>
  <li>Invites elaboration</li>
</ul>

<p><strong>Examples:</strong></p>
<ul>
  <li>"Help me understand what you mean by 'disconnected'..."</li>
  <li>"When you say he 'doesn't listen,' what does that look like?"</li>
  <li>"I want to make sure I'm following—can you tell me more about that?"</li>
</ul>

<h3>Summarization</h3>
<p>Summaries pull together themes, highlight patterns, and create coherence from complex material. They serve multiple purposes:</p>
<ul>
  <li><strong>Beginning of session:</strong> "Last time we talked about..."</li>
  <li><strong>Transitioning:</strong> "So we've covered X, and now you're bringing up Y..."</li>
  <li><strong>End of session:</strong> "To pull together what we discussed today..."</li>
  <li><strong>Highlighting themes:</strong> "I'm noticing a pattern—several times you've mentioned..."</li>
</ul>

<h3>Elements of Effective Summary</h3>
<ul>
  <li>Include both content and feeling</li>
  <li>Identify recurring themes</li>
  <li>Note connections the client may not have made</li>
  <li>Use the client's language when possible</li>
  <li>End with an open door: "Did I capture that accurately?"</li>
</ul>

<h3>When to Use Each Skill</h3>
<p><strong>Clarify</strong> when: confused, sensing a contradiction, client uses vague language.<br>
<strong>Summarize</strong> when: transitioning topics, ending sessions, highlighting patterns, client seems lost in details.</p>
`,

  // ===== MINDFULNESS =====
  'What is Mindfulness?': `
<h2>Foundations of Mindfulness</h2>
<p>Mindfulness has become a ubiquitous term in mental health, yet its meaning is often misunderstood. Jon Kabat-Zinn, who pioneered the integration of mindfulness into Western medicine, offers a clear definition:</p>

<blockquote><p><strong>"Mindfulness is awareness that arises through paying attention, on purpose, in the present moment, non-judgmentally."</strong> — Jon Kabat-Zinn (2013)</p></blockquote>

<h3>Key Components</h3>
<p><strong>Paying attention:</strong> Mindfulness involves deliberately directing attention rather than operating on autopilot. We spend much of our lives lost in thought about the past or future.</p>

<p><strong>On purpose:</strong> This is intentional awareness, not accidental. We choose to notice our present experience rather than being swept away by mental activity.</p>

<p><strong>Present moment:</strong> The focus is on what's happening now—not ruminating about the past or worrying about the future.</p>

<p><strong>Non-judgmentally:</strong> Perhaps most challenging, mindfulness involves observing experience without labeling it as good or bad. We notice thoughts, feelings, and sensations as they are.</p>

<h3>What Mindfulness Is NOT</h3>
<ul>
  <li>Not about emptying the mind of thoughts</li>
  <li>Not relaxation (though it may result in relaxation)</li>
  <li>Not escapism or avoidance</li>
  <li>Not a religious practice (though it has Buddhist roots)</li>
  <li>Not about achieving a special state</li>
</ul>

<h3>The Two Main Components</h3>
<p>Bishop et al. (2004) proposed a two-component model:</p>
<ol>
  <li><strong>Self-regulation of attention:</strong> Maintaining focus on immediate experience</li>
  <li><strong>Orientation to experience:</strong> Approaching present experience with curiosity, openness, and acceptance</li>
</ol>

<h3>Clinical Relevance</h3>
<p>Mindfulness is not just a technique but a way of relating to experience. For clients, it offers a alternative to automatic reactivity—creating space between stimulus and response.</p>
`,

  'Mindfulness for Anxiety and Depression': `
<h2>The Evidence Base for Mindfulness</h2>
<p>Mindfulness-based interventions have accumulated substantial research support over the past four decades. Understanding this evidence helps clinicians make informed recommendations and set appropriate expectations.</p>

<h3>Key Research Findings</h3>

<p><strong>Mindfulness-Based Stress Reduction (MBSR):</strong></p>
<ul>
  <li>Meta-analyses show moderate effect sizes for anxiety (d = 0.63) and depression (d = 0.59)</li>
  <li>Effective for chronic pain management</li>
  <li>Reduces psychological distress in medical populations</li>
</ul>

<p><strong>Mindfulness-Based Cognitive Therapy (MBCT):</strong></p>
<ul>
  <li>Significantly reduces relapse rates in recurrent depression (Segal et al., 2013)</li>
  <li>NICE guidelines recommend MBCT for preventing depressive relapse</li>
  <li>Particularly effective for those with 3+ previous episodes</li>
</ul>

<h3>Proposed Mechanisms of Change</h3>
<p>How does mindfulness produce therapeutic effects? Research suggests several pathways:</p>

<ul>
  <li><strong>Decentering:</strong> Ability to observe thoughts as mental events rather than facts</li>
  <li><strong>Exposure:</strong> Learning to tolerate uncomfortable experiences without avoidance</li>
  <li><strong>Reduced rumination:</strong> Breaking cycles of repetitive negative thinking</li>
  <li><strong>Improved attention regulation:</strong> Greater ability to direct and sustain attention</li>
  <li><strong>Self-compassion:</strong> Relating to oneself with kindness rather than criticism</li>
</ul>

<h3>Neurobiological Correlates</h3>
<p>Imaging studies show mindfulness practice is associated with:</p>
<ul>
  <li>Increased gray matter in prefrontal cortex and hippocampus</li>
  <li>Reduced amygdala reactivity</li>
  <li>Improved prefrontal-amygdala connectivity</li>
</ul>

<h3>Clinical Considerations</h3>
<p>Mindfulness is not a panacea. It may be contraindicated or require adaptation for clients with active trauma, psychosis, or severe dissociation. Always assess appropriateness for individual clients.</p>
`,

  'Simple Mindfulness Exercises': `
<h2>Practical Mindfulness Techniques for Clinical Use</h2>
<p>The following exercises can be taught to clients or used by clinicians for their own self-care. Start with brief practices and gradually increase duration as comfort develops.</p>

<h3>Three-Minute Breathing Space</h3>
<p>This MBCT exercise provides a brief mindfulness reset that can be used anywhere:</p>
<ol>
  <li><strong>Awareness (1 minute):</strong> "What's happening right now? What thoughts are here? What feelings? What body sensations?"</li>
  <li><strong>Gathering (1 minute):</strong> Narrow attention to the breath. Notice the physical sensations of breathing.</li>
  <li><strong>Expanding (1 minute):</strong> Widen attention to include the whole body. Carry this awareness into the next activity.</li>
</ol>

<h3>STOP Practice</h3>
<p>A quick mindfulness interruption for stressful moments:</p>
<ul>
  <li><strong>S</strong> – Stop what you're doing</li>
  <li><strong>T</strong> – Take a breath</li>
  <li><strong>O</strong> – Observe your experience (thoughts, feelings, body)</li>
  <li><strong>P</strong> – Proceed with awareness</li>
</ul>

<h3>Body Scan (Abbreviated)</h3>
<p>Guide attention systematically through the body:</p>
<ul>
  <li>Start with feet—notice sensations without trying to change anything</li>
  <li>Move slowly upward: legs, hips, abdomen, chest, arms, shoulders, neck, face</li>
  <li>Notice areas of tension, comfort, or neutrality</li>
  <li>If the mind wanders, gently return to the body region</li>
</ul>

<h3>Mindful Grounding (5-4-3-2-1)</h3>
<p>Particularly useful for anxiety, this engages the senses:</p>
<ul>
  <li>5 things you can see</li>
  <li>4 things you can hear</li>
  <li>3 things you can touch/feel</li>
  <li>2 things you can smell</li>
  <li>1 thing you can taste</li>
</ul>

<h3>Integration Tips</h3>
<ul>
  <li>Practice yourself before teaching clients</li>
  <li>Start with brief exercises (1-3 minutes)</li>
  <li>Normalize wandering minds—that's part of the practice</li>
  <li>Link to specific triggers or times of day</li>
</ul>
`,

  // ===== THERAPEUTIC RAPPORT =====
  'The Therapeutic Alliance': `
<h2>The Therapeutic Alliance: What Research Tells Us</h2>
<p>The therapeutic alliance is consistently one of the strongest predictors of treatment outcome across all theoretical orientations. Understanding its components helps clinicians intentionally cultivate this essential factor.</p>

<h3>Bordin's Working Alliance Model</h3>
<p>Edward Bordin (1979) proposed three interrelated components:</p>

<p><strong>1. Goals:</strong> Agreement between therapist and client on the targets of treatment. Are you working toward the same outcomes?</p>

<p><strong>2. Tasks:</strong> Agreement on what activities will be used to achieve those goals. Does the client see the value in what you're asking them to do?</p>

<p><strong>3. Bond:</strong> The quality of the interpersonal relationship—trust, warmth, and mutual regard.</p>

<h3>Research Findings</h3>
<p>The alliance-outcome relationship is remarkably robust:</p>
<ul>
  <li>Meta-analyses consistently find r = 0.28 correlation with outcome (Norcross & Lambert, 2018)</li>
  <li>This effect holds across theoretical orientations</li>
  <li>Early alliance (sessions 1-3) predicts outcome</li>
  <li>The client's perception of alliance matters more than the therapist's</li>
</ul>

<h3>What Makes Alliance Therapeutic?</h3>
<p>A strong alliance may work by:</p>
<ul>
  <li>Providing a corrective emotional experience</li>
  <li>Increasing hope and expectancy</li>
  <li>Enhancing motivation and engagement</li>
  <li>Creating safety for difficult emotional work</li>
</ul>

<h3>Therapist Variables That Enhance Alliance</h3>
<p>Research identifies these therapist qualities as alliance-enhancing:</p>
<ul>
  <li>Empathy and warmth</li>
  <li>Genuineness and authenticity</li>
  <li>Flexibility in approach</li>
  <li>Ability to repair ruptures</li>
  <li>Collaboration versus authoritarianism</li>
</ul>

<h3>Common Alliance Threats</h3>
<ul>
  <li>Goal disagreement (often unspoken)</li>
  <li>Perceived judgment or lack of understanding</li>
  <li>Technical interventions without sufficient bond</li>
  <li>Cultural misattunement</li>
</ul>
`,

  'First Session Tips': `
<h2>Building Rapport from the First Moments</h2>
<p>The first session sets the tone for the entire therapeutic relationship. Research suggests that early alliance formation predicts treatment outcomes, making intentional attention to rapport from the very beginning essential.</p>

<h3>Before the Session</h3>
<ul>
  <li>Review intake information thoroughly</li>
  <li>Prepare the physical space (comfortable seating, tissues, clock placement)</li>
  <li>Center yourself—your own state affects the client</li>
  <li>Consider cultural factors that may influence engagement</li>
</ul>

<h3>The First Moments</h3>
<p>First impressions form quickly. Consider:</p>
<ul>
  <li>Greet warmly but not effusively</li>
  <li>Use the name the client prefers</li>
  <li>Attend to comfort (seating choice, temperature)</li>
  <li>Notice and address apparent anxiety</li>
</ul>

<h3>Structuring the First Session</h3>
<p>Balance information gathering with relationship building:</p>

<p><strong>1. Orient the client:</strong> Explain what will happen in the session. Uncertainty increases anxiety.</p>

<p><strong>2. Understand their perspective:</strong> "What brings you in?" invites their narrative. Listen before assessing.</p>

<p><strong>3. Collaborative goal-setting:</strong> "What would you like to be different?" validates their agency.</p>

<p><strong>4. Instill realistic hope:</strong> "These are the kinds of issues I work with regularly" reduces shame and isolation.</p>

<p><strong>5. Discuss practical matters:</strong> Confidentiality, fees, cancellation policy, between-session contact.</p>

<h3>Red Flags to Address</h3>
<ul>
  <li>Mandated clients may need acknowledgment of ambivalence</li>
  <li>Previous negative therapy experiences warrant discussion</li>
  <li>Significant others who "made them come" signal motivation issues</li>
</ul>

<h3>Ending the First Session</h3>
<ul>
  <li>Summarize what you heard</li>
  <li>Provide preliminary formulation (if appropriate)</li>
  <li>Explain proposed treatment approach</li>
  <li>Schedule next session and discuss homework</li>
  <li>Check in: "How was this session for you?"</li>
</ul>
`,

  'Repairing Alliance Ruptures': `
<h2>Alliance Ruptures and Repair</h2>
<p>Even the best therapeutic relationships experience strains and ruptures. Research by Safran and Muran (2000) demonstrates that successfully repaired ruptures can actually strengthen the alliance and become therapeutic in themselves.</p>

<h3>What is a Rupture?</h3>
<p>A rupture is a tension or breakdown in the collaborative relationship. Ruptures range from minor misunderstandings to major breaches of trust.</p>

<h3>Two Types of Ruptures</h3>
<p><strong>Withdrawal ruptures:</strong> The client disengages, becomes compliant but disconnected, or avoids certain topics. Signs include:</p>
<ul>
  <li>Shortened responses</li>
  <li>Averted eye contact</li>
  <li>Topic changes</li>
  <li>Excessive agreement</li>
</ul>

<p><strong>Confrontation ruptures:</strong> The client expresses dissatisfaction, criticism, or hostility. Signs include:</p>
<ul>
  <li>Direct complaints about therapy</li>
  <li>Challenges to therapist competence</li>
  <li>Expressions of anger</li>
  <li>Attempts to control the session</li>
</ul>

<h3>Recognizing Ruptures</h3>
<p>Rupture markers to notice:</p>
<ul>
  <li>Sudden topic changes</li>
  <li>Disagreement about goals or tasks</li>
  <li>Subtle negativity or sarcasm</li>
  <li>Your own feelings of defensiveness or confusion</li>
</ul>

<h3>The Repair Process</h3>
<p><strong>1. Notice and attend:</strong> Don't ignore or dismiss the rupture. Name what you're observing.</p>

<p><strong>2. Take responsibility:</strong> Acknowledge your contribution without excessive apology.</p>

<p><strong>3. Explore the client's experience:</strong> "Help me understand what happened for you when I said..."</p>

<p><strong>4. Validate their reaction:</strong> Their response makes sense from their perspective.</p>

<p><strong>5. Negotiate:</strong> Adjust approach based on what you learn.</p>

<h3>Why Repair Matters</h3>
<p>Successful rupture repair can provide a corrective emotional experience—the client learns that relationships can survive conflict and that their needs can be heard and accommodated.</p>
`,

  // ===== PSYCHIATRIC MEDICATIONS =====
  'Antidepressants Explained': `
<h2>Antidepressants: A Non-Prescriber's Guide</h2>
<p>While counselors don't prescribe medications, understanding common antidepressants helps us support clients, recognize side effects, and collaborate effectively with prescribers.</p>

<h3>SSRIs (Selective Serotonin Reuptake Inhibitors)</h3>
<p>The most commonly prescribed antidepressants. They work by increasing serotonin availability in the brain.</p>
<p><strong>Common SSRIs:</strong> fluoxetine (Prozac), sertraline (Zoloft), escitalopram (Lexapro), paroxetine (Paxil), citalopram (Celexa)</p>
<p><strong>Common side effects:</strong></p>
<ul>
  <li>GI upset (usually temporary)</li>
  <li>Sexual dysfunction</li>
  <li>Sleep changes</li>
  <li>Initial anxiety increase (first 1-2 weeks)</li>
</ul>
<p><strong>Timeline:</strong> Full effects typically take 4-6 weeks. Clients often notice side effects before benefits.</p>

<h3>SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)</h3>
<p>Work on both serotonin and norepinephrine systems.</p>
<p><strong>Common SNRIs:</strong> venlafaxine (Effexor), duloxetine (Cymbalta), desvenlafaxine (Pristiq)</p>
<p><strong>Often used for:</strong> Depression with fatigue, chronic pain conditions, anxiety disorders</p>
<p><strong>Note:</strong> Discontinuation syndrome can be more pronounced than SSRIs</p>

<h3>Other Antidepressants</h3>
<p><strong>Bupropion (Wellbutrin):</strong> Works on dopamine and norepinephrine. Notable for minimal sexual side effects and potential appetite suppression. Can increase anxiety initially.</p>
<p><strong>Mirtazapine (Remeron):</strong> Often helps with sleep and appetite. Can cause sedation and weight gain.</p>
<p><strong>Trazodone:</strong> Often prescribed off-label for sleep at lower doses.</p>

<h3>What Clients Should Know</h3>
<ul>
  <li>Medications work gradually—don't expect immediate results</li>
  <li>Side effects often diminish after 2-4 weeks</li>
  <li>Don't stop abruptly—taper under medical supervision</li>
  <li>Medications work best combined with therapy</li>
</ul>
`,

  'Anxiety Medications Overview': `
<h2>Medications for Anxiety and Related Conditions</h2>
<p>This overview covers medications commonly prescribed for anxiety, bipolar disorder, and psychotic symptoms—knowledge that helps counselors understand clients' medication regimens and collaborate with prescribers.</p>

<h3>Benzodiazepines</h3>
<p>Fast-acting anti-anxiety medications that enhance GABA activity.</p>
<p><strong>Common examples:</strong> alprazolam (Xanax), lorazepam (Ativan), clonazepam (Klonopin), diazepam (Valium)</p>
<p><strong>Used for:</strong> Acute anxiety, panic attacks, short-term anxiety management</p>
<p><strong>Concerns:</strong></p>
<ul>
  <li>Dependence potential with prolonged use</li>
  <li>Cognitive impairment</li>
  <li>Withdrawal can be serious/dangerous</li>
  <li>May interfere with exposure therapy effectiveness</li>
</ul>

<h3>Buspirone (Buspar)</h3>
<p>Non-addictive anti-anxiety medication. Takes 2-4 weeks to work. Often used for generalized anxiety when benzodiazepine risks are a concern.</p>

<h3>Mood Stabilizers</h3>
<p>Used primarily for bipolar disorder.</p>
<p><strong>Lithium:</strong> The gold standard for bipolar. Requires blood level monitoring. Signs of toxicity: tremor, confusion, GI upset.</p>
<p><strong>Anticonvulsants:</strong> valproate (Depakote), lamotrigine (Lamictal), carbamazepine (Tegretol)</p>

<h3>Antipsychotics</h3>
<p><strong>Typical (first-generation):</strong> haloperidol (Haldol), chlorpromazine (Thorazine). More extrapyramidal side effects.</p>
<p><strong>Atypical (second-generation):</strong> risperidone (Risperdal), quetiapine (Seroquel), aripiprazole (Abilify), olanzapine (Zyprexa)</p>
<p><strong>Common uses:</strong> Schizophrenia, bipolar disorder, augmentation for depression, severe anxiety</p>
<p><strong>Side effects to watch:</strong> Metabolic changes, movement disorders, sedation</p>

<h3>Clinical Implications</h3>
<ul>
  <li>Know what medications your clients take</li>
  <li>Recognize side effects that may affect therapy</li>
  <li>Encourage medication compliance as part of treatment</li>
  <li>Communicate concerns to prescribers (with consent)</li>
</ul>
`,

  'Working with Prescribers': `
<h2>Collaborating with Prescribers: Scope and Communication</h2>
<p>Effective collaboration between counselors and prescribers improves client outcomes. This requires understanding scope boundaries while maintaining open communication.</p>

<h3>Understanding Scope of Practice</h3>
<p>Counselors should NEVER:</p>
<ul>
  <li>Recommend specific medications</li>
  <li>Suggest dosage changes</li>
  <li>Advise stopping medications</li>
  <li>Undermine the prescriber's recommendations</li>
</ul>

<p>Counselors CAN:</p>
<ul>
  <li>Educate clients about medication classes generally</li>
  <li>Encourage questions for their prescriber</li>
  <li>Support medication compliance</li>
  <li>Observe and report symptoms or side effects</li>
  <li>Communicate clinical observations to prescribers</li>
</ul>

<h3>When to Communicate with Prescribers</h3>
<ul>
  <li>Significant symptom changes (improvement or worsening)</li>
  <li>Suspected side effects</li>
  <li>Medication non-compliance</li>
  <li>Suicidal ideation</li>
  <li>Substance use affecting treatment</li>
</ul>

<h3>Effective Communication</h3>
<p><strong>Getting consent:</strong> Always obtain written release before contacting prescribers.</p>
<p><strong>What to include in communication:</strong></p>
<ul>
  <li>Current symptoms and functioning</li>
  <li>Changes you've observed</li>
  <li>Specific behaviors (not diagnoses)</li>
  <li>Questions or concerns</li>
</ul>

<h3>Supporting Medication Decisions</h3>
<p>When clients are ambivalent about medications:</p>
<ul>
  <li>Explore concerns without judgment</li>
  <li>Provide accurate general information</li>
  <li>Encourage conversation with prescriber</li>
  <li>Respect client autonomy</li>
  <li>Address stigma if present</li>
</ul>

<h3>Building Referral Relationships</h3>
<p>Develop relationships with local psychiatrists and nurse practitioners. Good working relationships improve communication and client care.</p>
`,

  // ===== CBT TOOLBOX =====
  'Understanding the ABC Model': `
<h2>The ABC Model: Foundation of Cognitive Therapy</h2>
<p>The ABC model, originally developed by Albert Ellis and refined by Aaron Beck, provides a framework for understanding how thoughts influence emotional and behavioral responses to events.</p>

<h3>The Three Components</h3>

<p><strong>A - Activating Event:</strong> The situation or trigger that occurred. This is the objective event, stripped of interpretation.</p>

<p><strong>B - Beliefs:</strong> The thoughts, interpretations, and meaning we assign to the event. This includes automatic thoughts, assumptions, and core beliefs.</p>

<p><strong>C - Consequences:</strong> The emotional, behavioral, and physiological responses that result from our beliefs about the event.</p>

<h3>The Key Insight</h3>
<p>It's not the event itself (A) that directly causes our emotional responses (C). Rather, our beliefs and interpretations (B) about the event determine our reactions.</p>
<p><strong>This means:</strong> By changing how we think about events, we can change how we feel and respond.</p>

<h3>Clinical Example</h3>
<p><strong>Situation:</strong> Friend doesn't return text message</p>
<table border="1" cellpadding="8">
  <tr><th>Thought (B)</th><th>Feeling (C)</th></tr>
  <tr><td>"She's angry at me"</td><td>Anxiety, worry</td></tr>
  <tr><td>"She's probably just busy"</td><td>Neutral, mild curiosity</td></tr>
  <tr><td>"Nobody cares about me"</td><td>Sadness, loneliness</td></tr>
</table>

<h3>Teaching the ABC Model</h3>
<ol>
  <li>Start with a recent emotional experience</li>
  <li>Identify the Consequence (emotion) first—it's most salient</li>
  <li>Work backward to the Activating event</li>
  <li>Discover the Beliefs connecting them</li>
  <li>Help client see the thought-feeling connection</li>
</ol>

<h3>Expanding to ABCDE</h3>
<p>Ellis added two more components for intervention:</p>
<p><strong>D - Disputation:</strong> Challenging and examining the beliefs</p>
<p><strong>E - New Effect:</strong> The new emotional and behavioral consequences</p>
`,

  'The 12 Major Cognitive Distortions': `
<h2>Cognitive Distortions: Patterns of Problematic Thinking</h2>
<p>Cognitive distortions are systematic errors in thinking that maintain negative emotions and problematic behaviors. Learning to identify these patterns is a core CBT skill.</p>

<h3>1. All-or-Nothing Thinking</h3>
<p>Seeing things in black-and-white categories with no middle ground. "If I'm not perfect, I'm a total failure."</p>

<h3>2. Catastrophizing</h3>
<p>Expecting the worst possible outcome. "If I make a mistake in this presentation, my career is over."</p>

<h3>3. Mind Reading</h3>
<p>Assuming you know what others are thinking without evidence. "Everyone at the party thought I was boring."</p>

<h3>4. Fortune Telling</h3>
<p>Predicting negative future outcomes as if they're certain. "This relationship will definitely fail."</p>

<h3>5. Emotional Reasoning</h3>
<p>Using feelings as evidence of truth. "I feel like a failure, therefore I am one."</p>

<h3>6. Should Statements</h3>
<p>Rigid rules about how things must be. "I should always be able to handle everything on my own."</p>

<h3>7. Labeling</h3>
<p>Attaching a negative label to self or others based on one event. "I made a mistake; I'm an idiot."</p>

<h3>8. Discounting the Positive</h3>
<p>Dismissing positive experiences or qualities. "That compliment doesn't count—they were just being nice."</p>

<h3>9. Mental Filter</h3>
<p>Focusing exclusively on negative details while ignoring positives. One criticism overshadows ten compliments.</p>

<h3>10. Overgeneralization</h3>
<p>Drawing broad conclusions from single events. "This date went badly. I'll never find anyone."</p>

<h3>11. Personalization</h3>
<p>Taking excessive responsibility for external events. "My friend is in a bad mood—it must be something I did."</p>

<h3>12. Magnification/Minimization</h3>
<p>Exaggerating negatives and shrinking positives. Blowing mistakes out of proportion while minimizing successes.</p>

<h3>Using This Information</h3>
<p>Help clients identify their "favorites"—most people tend toward certain patterns. Recognition is the first step toward change.</p>
`,

  'The Art of Guided Discovery': `
<h2>Socratic Questioning: The Art of Guided Discovery</h2>
<p>Socratic questioning is a cornerstone of CBT that helps clients examine their thoughts through collaborative inquiry rather than direct confrontation. The goal is for clients to discover new perspectives themselves.</p>

<h3>Core Principles</h3>
<ul>
  <li><strong>Curiosity over confrontation:</strong> Questions come from genuine interest, not challenging</li>
  <li><strong>Client as expert:</strong> You're helping them access their own wisdom</li>
  <li><strong>Collaborative empiricism:</strong> Together examining evidence</li>
  <li><strong>Discovery over instruction:</strong> Insights are more powerful when self-generated</li>
</ul>

<h3>Types of Socratic Questions</h3>

<p><strong>Evidence-Gathering Questions:</strong></p>
<ul>
  <li>"What evidence supports this thought?"</li>
  <li>"What evidence might go against it?"</li>
  <li>"Have there been times when this wasn't true?"</li>
</ul>

<p><strong>Alternative Perspective Questions:</strong></p>
<ul>
  <li>"Is there another way to look at this?"</li>
  <li>"What might someone else think in this situation?"</li>
  <li>"What would you tell a friend who had this thought?"</li>
</ul>

<p><strong>Implication Questions:</strong></p>
<ul>
  <li>"If this thought is true, what does that mean to you?"</li>
  <li>"What's the worst that could happen? How would you cope?"</li>
  <li>"What's the best that could happen?"</li>
</ul>

<p><strong>Utility Questions:</strong></p>
<ul>
  <li>"How is this thought helping you?"</li>
  <li>"What's the effect of thinking this way?"</li>
  <li>"Does believing this help you reach your goals?"</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
  <li>Leading questions with obvious "right" answers</li>
  <li>Too many questions too fast</li>
  <li>Abandoning inquiry and lecturing instead</li>
  <li>Asking questions that feel like cross-examination</li>
</ul>

<h3>The Art</h3>
<p>Effective Socratic questioning requires attunement—knowing when to press and when to hold back, and following the client's discovery process rather than pushing toward your predetermined conclusion.</p>
`,

  'Behavioral Activation for Depression': `
<h2>Behavioral Activation: Breaking the Depression Cycle</h2>
<p>Behavioral Activation (BA) is a highly effective treatment for depression that focuses on increasing engagement with meaningful, valued activities to interrupt the cycle of withdrawal and avoidance that maintains depression.</p>

<h3>The Depression Spiral</h3>
<p>Depression creates a self-perpetuating cycle:</p>
<ol>
  <li>Low mood → withdrawal from activities</li>
  <li>Withdrawal → loss of positive reinforcement</li>
  <li>Loss of reinforcement → worsening mood</li>
  <li>Worsening mood → more withdrawal</li>
</ol>

<h3>The BA Approach</h3>
<p>Rather than waiting to "feel like it," BA encourages action first—understanding that mood often follows behavior rather than preceding it.</p>
<p><strong>Key principle:</strong> "Action before motivation"</p>

<h3>Core Components</h3>

<p><strong>1. Activity Monitoring:</strong> Track current activities and their connection to mood. What are you doing? How do you feel during and after?</p>

<p><strong>2. Values Assessment:</strong> Identify what matters to the client. Activities should connect to values, not just obligations.</p>

<p><strong>3. Activity Scheduling:</strong> Plan specific activities in advance. Include:</p>
<ul>
  <li>Pleasurable activities (enjoyment)</li>
  <li>Mastery activities (accomplishment)</li>
  <li>Values-based activities (meaning)</li>
</ul>

<p><strong>4. Gradual Steps:</strong> Start small. A depressed person won't go from staying in bed to running a marathon. Break activities into manageable steps.</p>

<h3>Addressing Barriers</h3>
<p>Common barriers and responses:</p>
<ul>
  <li><em>"I won't enjoy it"</em> → Rate predicted vs. actual pleasure</li>
  <li><em>"I'm too tired"</em> → Activity often increases energy</li>
  <li><em>"I'll do it when I feel better"</em> → Mood follows action</li>
</ul>

<h3>Evidence Base</h3>
<p>BA is as effective as full CBT for depression and may be easier to implement. It's particularly useful when cognitive work is difficult due to severity of depression.</p>
`,

  'Exposure Therapy Principles': `
<h2>Exposure Therapy: Principles and Practice</h2>
<p>Exposure therapy is among the most effective treatments for anxiety disorders, phobias, OCD, and PTSD. Understanding its mechanisms and implementation is essential for treating anxiety.</p>

<h3>The Theory: Why Exposure Works</h3>

<p><strong>Habituation:</strong> With repeated, prolonged exposure, the fear response naturally decreases. Anxiety cannot maintain peak intensity indefinitely.</p>

<p><strong>Inhibitory Learning:</strong> More recent theory emphasizes that exposure creates new learning that inhibits (but doesn't erase) the fear memory. Clients learn "I can handle this" and "Nothing terrible happens."</p>

<p><strong>Self-Efficacy:</strong> Successful exposure builds confidence in ability to cope with feared situations.</p>

<h3>Building a Fear Hierarchy</h3>
<ol>
  <li>Identify all feared situations related to the target fear</li>
  <li>Rate each on a Subjective Units of Distress Scale (SUDS: 0-100)</li>
  <li>Order from least to most distressing</li>
  <li>Ensure gradual steps—no more than 10-15 SUDS between items</li>
</ol>

<h3>Conducting Effective Exposures</h3>
<ul>
  <li><strong>Duration:</strong> Long enough for fear to decrease (usually 30-60+ minutes)</li>
  <li><strong>Repetition:</strong> Repeat until the item no longer provokes significant anxiety</li>
  <li><strong>No safety behaviors:</strong> Eliminate subtle avoidances that prevent full learning</li>
  <li><strong>Expectancy violation:</strong> Focus on what was learned ("What did you expect vs. what happened?")</li>
</ul>

<h3>Types of Exposure</h3>
<ul>
  <li><strong>In vivo:</strong> Real-life exposure to feared situations</li>
  <li><strong>Imaginal:</strong> Vividly imagining feared scenarios</li>
  <li><strong>Interoceptive:</strong> Exposure to feared bodily sensations</li>
  <li><strong>Virtual reality:</strong> Technology-assisted exposure</li>
</ul>

<h3>Critical Don'ts</h3>
<ul>
  <li>Don't escape during peak anxiety—complete the exposure</li>
  <li>Don't use distraction during exposure</li>
  <li>Don't reassure repeatedly—it becomes a safety behavior</li>
  <li>Don't move too fast and overwhelm the client</li>
</ul>
`,

  'The Thought Record': `
<h2>The Thought Record: Systematic Cognitive Restructuring</h2>
<p>The thought record is CBT's signature tool for examining and modifying unhelpful thoughts. The 7-column version provides comprehensive structure for cognitive restructuring.</p>

<h3>The Seven Columns</h3>

<p><strong>1. Situation:</strong> What happened? Where? When? Who was there? Describe objectively without interpretation.</p>

<p><strong>2. Automatic Thoughts:</strong> What went through your mind? What images? What does this mean about you, others, the future?</p>

<p><strong>3. Emotions:</strong> What did you feel? Rate intensity 0-100%. Include physical sensations.</p>

<p><strong>4. Evidence Supporting the Thought:</strong> What facts support this thought? Not feelings or interpretations—observable evidence.</p>

<p><strong>5. Evidence Against the Thought:</strong> What facts contradict this thought? What would others say? Have there been exceptions?</p>

<p><strong>6. Alternative/Balanced Thought:</strong> Based on all evidence, what's a more balanced way to see this? Not positive thinking—realistic thinking.</p>

<p><strong>7. Outcome:</strong> Re-rate emotions. What will you do differently?</p>

<h3>Teaching the Thought Record</h3>
<ol>
  <li>Start with recent, mildly distressing situations</li>
  <li>Complete first few records collaboratively in session</li>
  <li>Model the process with your own example</li>
  <li>Focus on identifying hot thoughts (highest emotion connection)</li>
  <li>Emphasize evidence-gathering, not positive thinking</li>
</ol>

<h3>Common Pitfalls</h3>
<ul>
  <li>Confusing thoughts and feelings (teach the difference)</li>
  <li>Not identifying the hot thought</li>
  <li>Going through motions without genuine examination</li>
  <li>Creating overly positive alternatives that don't feel believable</li>
</ul>

<h3>When to Use</h3>
<p>Thought records work best for clear, identifiable negative thoughts. They may be less useful for rumination, worry, or vague emotional states where other interventions (behavioral activation, mindfulness) may be more appropriate.</p>
`,

  'Session Structure and Key Principles': `
<h2>Structuring Effective CBT Sessions</h2>
<p>CBT sessions follow a consistent structure that maximizes efficiency, maintains focus, and reinforces learning. This structure supports both the therapeutic relationship and technical interventions.</p>

<h3>Standard Session Structure</h3>

<p><strong>1. Check-in and Mood Review (5 min)</strong></p>
<ul>
  <li>Brief symptom assessment</li>
  <li>Review of mood monitoring</li>
  <li>Notable events since last session</li>
</ul>

<p><strong>2. Bridge from Previous Session (5 min)</strong></p>
<ul>
  <li>Review key points from last session</li>
  <li>Connection to today's work</li>
</ul>

<p><strong>3. Homework Review (10 min)</strong></p>
<ul>
  <li>Review completed assignments</li>
  <li>Troubleshoot difficulties</li>
  <li>Reinforce effort and learning</li>
  <li>If not completed—explore barriers collaboratively</li>
</ul>

<p><strong>4. Set Agenda (5 min)</strong></p>
<ul>
  <li>Client input: "What's most important to focus on today?"</li>
  <li>Therapist input: Based on treatment plan</li>
  <li>Prioritize if too many items</li>
  <li>Estimate time for each item</li>
</ul>

<p><strong>5. Main Content (20-25 min)</strong></p>
<ul>
  <li>Work on agenda items</li>
  <li>Teach skills, apply to specific situations</li>
  <li>Use Socratic questioning</li>
  <li>Summarize learning periodically</li>
</ul>

<p><strong>6. Assign Homework (5 min)</strong></p>
<ul>
  <li>Collaborative planning</li>
  <li>Written down clearly</li>
  <li>Connected to session content</li>
  <li>Anticipate and problem-solve barriers</li>
</ul>

<p><strong>7. Session Summary and Feedback (5 min)</strong></p>
<ul>
  <li>"What was most helpful/important today?"</li>
  <li>Summarize key takeaways</li>
  <li>Check for questions or concerns</li>
  <li>Brief feedback: "How was the session for you?"</li>
</ul>

<h3>Key Principles</h3>
<ul>
  <li><strong>Collaboration:</strong> Never impose—always negotiate</li>
  <li><strong>Empiricism:</strong> Test beliefs like hypotheses</li>
  <li><strong>Present focus:</strong> Here-and-now problems with future orientation</li>
  <li><strong>Active:</strong> Both therapist and client are actively engaged</li>
</ul>
`,

  // ===== DBT =====
  'What is DBT?': `
<h2>Introduction to Dialectical Behavior Therapy</h2>
<p>Dialectical Behavior Therapy (DBT) was developed by Marsha Linehan in the 1980s originally for chronically suicidal individuals with borderline personality disorder. It has since been adapted for numerous populations and problems.</p>

<h3>The Biosocial Model</h3>
<p>DBT proposes that emotional dysregulation develops through the transaction between:</p>
<p><strong>Biology:</strong> Innate emotional sensitivity and reactivity. Some people are born with nervous systems that are more reactive to emotional stimuli and slower to return to baseline.</p>
<p><strong>Environment:</strong> Invalidating environments that communicate that one's emotional responses are wrong, inappropriate, or should be changed. This can include abuse, neglect, or simply poor fit between temperament and caregiving environment.</p>
<p>The result: A person who experiences emotions intensely but never learned skills to manage them effectively.</p>

<h3>Dialectical Philosophy</h3>
<p>The "dialectical" in DBT refers to the synthesis of opposites:</p>
<ul>
  <li><strong>Acceptance AND Change:</strong> Accepting yourself as you are while also working to change</li>
  <li><strong>Validation AND Problem-Solving:</strong> Both are necessary</li>
  <li><strong>Doing your best AND doing better:</strong> These are not contradictory</li>
</ul>
<p>The core dialectic: "You are doing the best you can, AND you need to try harder and do better."</p>

<h3>Standard DBT Components</h3>
<ol>
  <li><strong>Individual therapy:</strong> Weekly sessions focusing on behavioral targets</li>
  <li><strong>Skills training group:</strong> Usually weekly, teaching the four skill modules</li>
  <li><strong>Phone coaching:</strong> Between-session support for applying skills</li>
  <li><strong>Consultation team:</strong> Therapists meeting to support each other</li>
</ol>

<h3>The Four Skill Modules</h3>
<ul>
  <li>Mindfulness</li>
  <li>Distress Tolerance</li>
  <li>Emotion Regulation</li>
  <li>Interpersonal Effectiveness</li>
</ul>
`,

  'DBT Mindfulness Skills': `
<h2>DBT Mindfulness: The Foundation</h2>
<p>Mindfulness is considered the core skill in DBT, underlying all other modules. DBT breaks mindfulness into concrete, teachable skills: the "What" skills and the "How" skills.</p>

<h3>Wise Mind</h3>
<p>DBT proposes three states of mind:</p>
<p><strong>Reasonable Mind:</strong> Intellectual, rational, task-focused. Cool, logical thinking without attention to emotions.</p>
<p><strong>Emotion Mind:</strong> Thinking controlled by emotional state. Logic and facts are distorted by how we feel.</p>
<p><strong>Wise Mind:</strong> The synthesis—accessing intuitive knowing that integrates both emotion and reason. Often accessed through stillness, breath, or focusing inward.</p>

<h3>The "What" Skills: What You Do</h3>

<p><strong>Observe:</strong> Notice your experience without words. Just notice sensations, thoughts, emotions—like watching clouds pass. Don't push away or hold on.</p>

<p><strong>Describe:</strong> Put words on your experience. "I'm having the thought that..." "I notice tension in my shoulders." Label without judgment.</p>

<p><strong>Participate:</strong> Fully engage in the current activity. Throw yourself completely into what you're doing. Be present without self-consciousness.</p>

<h3>The "How" Skills: How You Do It</h3>

<p><strong>Non-judgmentally:</strong> Describe facts, not evaluations. Instead of "good" or "bad," use "effective" or "ineffective." Notice judging and let it go.</p>

<p><strong>One-mindfully:</strong> Do one thing at a time. When eating, just eat. When walking, just walk. When your attention wanders, gently return.</p>

<p><strong>Effectively:</strong> Do what works. Focus on your goals. Let go of "should" and act skillfully in the current situation. Play by the rules that work.</p>

<h3>Practice Points</h3>
<ul>
  <li>Mindfulness is a practice, not a state to achieve</li>
  <li>Start with brief, frequent practice</li>
  <li>Apply to everyday activities (mindful eating, walking)</li>
  <li>Use to prepare for difficult skills or situations</li>
</ul>
`,

  'TIPP Skills for Crisis': `
<h2>TIPP: Changing Body Chemistry Fast</h2>
<p>When emotions are extremely intense (SUDS 70+), cognitive strategies often don't work because the thinking brain is offline. TIPP skills use physiological mechanisms to quickly reduce emotional intensity.</p>

<h3>T - Temperature</h3>
<p>Cold activates the "dive reflex," which slows heart rate and redirects blood flow. Options:</p>
<ul>
  <li>Hold ice cubes or ice pack</li>
  <li>Splash cold water on face</li>
  <li>Submerge face in cold water (most effective)</li>
</ul>
<p><strong>Caution:</strong> Avoid with heart conditions. Don't use water that's too cold for too long.</p>

<h3>I - Intense Exercise</h3>
<p>Brief, intense aerobic exercise (10-20 minutes) burns off stress hormones and shifts physiology. Options:</p>
<ul>
  <li>Running in place</li>
  <li>Jumping jacks</li>
  <li>Fast walking up stairs</li>
  <li>Any activity that gets heart rate up</li>
</ul>

<h3>P - Paced Breathing</h3>
<p>Slow, deep breathing activates the parasympathetic nervous system. Key:</p>
<ul>
  <li>Exhale longer than inhale (e.g., 4 counts in, 6-8 counts out)</li>
  <li>Breathe from diaphragm</li>
  <li>Slow pace (5-6 breaths per minute)</li>
</ul>

<h3>P - Paired Muscle Relaxation</h3>
<p>Combines muscle tension-release with breathing:</p>
<ol>
  <li>While breathing in, tense muscles (not to the point of pain)</li>
  <li>Notice the tension</li>
  <li>While breathing out, say "relax" and release all tension</li>
  <li>Notice the difference between tension and relaxation</li>
</ol>

<h3>When to Use TIPP</h3>
<ul>
  <li>Emotions are overwhelming (high intensity)</li>
  <li>Risk of impulsive behavior</li>
  <li>Can't think clearly enough for other skills</li>
  <li>Need to bring emotional temperature down quickly</li>
</ul>
`,

  'Crisis Survival Skills': `
<h2>DBT Crisis Survival Skills</h2>
<p>Crisis survival skills are designed for moments when you cannot solve the problem and must get through without making things worse. These are short-term strategies, not long-term solutions.</p>

<h3>ACCEPTS: Distraction Skills</h3>
<p><strong>A</strong> - Activities: Engage in absorbing activities (hobbies, exercise, cleaning)</p>
<p><strong>C</strong> - Contributing: Do something for someone else (volunteer, help a neighbor)</p>
<p><strong>C</strong> - Comparisons: Compare to times you felt worse, or to others less fortunate</p>
<p><strong>E</strong> - Emotions: Generate different emotions (funny movie, upbeat music)</p>
<p><strong>P</strong> - Pushing away: Mentally push the situation away temporarily</p>
<p><strong>T</strong> - Thoughts: Fill your mind with other thoughts (counting, puzzles)</p>
<p><strong>S</strong> - Sensations: Intense sensations that grab attention (ice, spicy food)</p>

<h3>Self-Soothing with the Five Senses</h3>
<p>Comfort yourself through sensory experience:</p>
<ul>
  <li><strong>Vision:</strong> Nature, art, photos of loved ones</li>
  <li><strong>Hearing:</strong> Music, nature sounds, silence</li>
  <li><strong>Smell:</strong> Candles, fresh air, favorite scents</li>
  <li><strong>Taste:</strong> Comfort food, tea, favorite flavors</li>
  <li><strong>Touch:</strong> Soft textures, warm bath, massage</li>
</ul>

<h3>IMPROVE the Moment</h3>
<p><strong>I</strong> - Imagery: Imagine a peaceful scene or coping well</p>
<p><strong>M</strong> - Meaning: Find or create meaning in the situation</p>
<p><strong>P</strong> - Prayer: Connect with something greater (doesn't require religion)</p>
<p><strong>R</strong> - Relaxation: Muscle relaxation, breathing, yoga</p>
<p><strong>O</strong> - One thing in the moment: Focus only on present task</p>
<p><strong>V</strong> - Vacation: Brief mental or physical vacation from the situation</p>
<p><strong>E</strong> - Encouragement: Coach yourself with coping statements</p>

<h3>Radical Acceptance</h3>
<p>Accepting reality as it is, not as you wish it were. Radical acceptance is not approval or giving up—it's acknowledging what IS so you can respond effectively.</p>
`,

  'Emotion Regulation Strategies': `
<h2>DBT Emotion Regulation Skills</h2>
<p>Emotion regulation skills help reduce vulnerability to negative emotions and change unwanted emotions when they occur.</p>

<h3>ABC PLEASE: Reducing Vulnerability</h3>

<p><strong>A</strong> - Accumulate positives: Increase pleasant events, build a life worth living</p>
<p><strong>B</strong> - Build mastery: Do things that create a sense of competence</p>
<p><strong>C</strong> - Cope ahead: Plan in advance for difficult situations</p>

<p><strong>P</strong>hysical i<strong>L</strong>lness: Treat physical problems<br>
<strong>E</strong>ating: Eat balanced meals<br>
<strong>A</strong>void mood-altering substances<br>
<strong>S</strong>leep: Get adequate sleep<br>
<strong>E</strong>xercise: Move your body daily</p>

<h3>Check the Facts</h3>
<p>Before acting on an emotion, examine whether it fits the facts:</p>
<ol>
  <li>What event triggered the emotion?</li>
  <li>What are my interpretations/assumptions?</li>
  <li>Am I assuming a threat? What's the actual probability?</li>
  <li>What's the catastrophe? Would I cope?</li>
  <li>Does the emotion (and its intensity) fit the facts?</li>
</ol>

<h3>Opposite Action</h3>
<p>When an emotion doesn't fit the facts OR acting on it isn't effective, do the opposite of the action urge:</p>
<table border="1" cellpadding="8">
  <tr><th>Emotion</th><th>Action Urge</th><th>Opposite Action</th></tr>
  <tr><td>Fear</td><td>Avoid</td><td>Approach</td></tr>
  <tr><td>Anger</td><td>Attack</td><td>Gently avoid, be kind</td></tr>
  <tr><td>Sadness</td><td>Withdraw</td><td>Get active, approach</td></tr>
  <tr><td>Shame</td><td>Hide</td><td>Disclose (if appropriate)</td></tr>
  <tr><td>Guilt</td><td>Apologize, avoid</td><td>If unjustified: opposite; if justified: repair</td></tr>
</table>

<h3>Key Points</h3>
<ul>
  <li>All emotions have a function—even painful ones</li>
  <li>Change emotions by changing thoughts, body chemistry, or actions</li>
  <li>Sometimes acceptance is more appropriate than change</li>
</ul>
`,

  'DEAR MAN Skills': `
<h2>DEAR MAN: Interpersonal Effectiveness</h2>
<p>DEAR MAN is a DBT skill for making requests or saying no while maintaining relationships and self-respect. It provides a structure for assertive communication.</p>

<h3>DEAR MAN Explained</h3>

<p><strong>D - Describe</strong><br>
Describe the situation factually, without judgment. Stick to observable facts.<br>
<em>"When you said you'd call and didn't..."</em></p>

<p><strong>E - Express</strong><br>
Express your feelings and opinions. Use "I" statements.<br>
<em>"I felt worried and disappointed..."</em></p>

<p><strong>A - Assert</strong><br>
Assert your wants or needs clearly. Don't expect others to read your mind.<br>
<em>"I would like you to text me if your plans change..."</em></p>

<p><strong>R - Reinforce</strong><br>
Reinforce by explaining positive consequences or mutual benefit.<br>
<em>"That would help me feel more secure in our relationship..."</em></p>

<p><strong>M - Mindful</strong><br>
Stay focused on your objective. Don't get distracted by other topics. Repeat your request if needed (broken record).</p>

<p><strong>A - Appear Confident</strong><br>
Use a confident tone and body language, even if you don't feel confident. No apologizing for making a reasonable request.</p>

<p><strong>N - Negotiate</strong><br>
Be willing to give to get. Ask for alternative solutions. What can you offer?</p>

<h3>Balancing Three Goals</h3>
<p>In any interpersonal interaction, consider three goals:</p>
<ol>
  <li><strong>Objective effectiveness:</strong> Getting what you want (DEAR MAN)</li>
  <li><strong>Relationship effectiveness:</strong> Maintaining the relationship (GIVE)</li>
  <li><strong>Self-respect effectiveness:</strong> Maintaining self-respect (FAST)</li>
</ol>
<p>Sometimes you prioritize one over others. Decide which matters most in each situation.</p>

<h3>Common Challenges</h3>
<ul>
  <li>Too aggressive: Prioritizing objective over relationship</li>
  <li>Too passive: Sacrificing objective for relationship or fear of conflict</li>
  <li>Unclear requests: Expecting mind-reading</li>
</ul>
`,

  // ===== MOTIVATIONAL INTERVIEWING =====
  'What is Motivational Interviewing?': `
<h2>The Spirit and Principles of Motivational Interviewing</h2>
<p>Motivational Interviewing (MI) is a collaborative, person-centered approach for strengthening motivation and commitment to change. Developed by William Miller and Stephen Rollnick, MI was originally designed for addiction but is now used across many behavior change contexts.</p>

<h3>The Spirit of MI</h3>
<p>More than techniques, MI is defined by its spirit—the underlying mindset and way of being with clients:</p>

<p><strong>Partnership:</strong> MI is done "with" and "for" clients, never "to" or "on" them. The counselor is not the expert on the client's life.</p>

<p><strong>Acceptance:</strong> Includes accurate empathy, autonomy support, affirmation, and absolute worth. Acceptance does not mean approval of all behaviors.</p>

<p><strong>Compassion:</strong> Actively promoting the client's welfare and giving priority to their needs.</p>

<p><strong>Evocation:</strong> The resources and motivation for change already exist within the client. The counselor's role is to draw them out, not install them.</p>

<h3>The Righting Reflex</h3>
<p>Humans have a natural tendency to want to fix problems and tell people what to do—the "righting reflex." In MI, this is counterproductive because:</p>
<ul>
  <li>It puts the client in a passive role</li>
  <li>It often evokes resistance and "sustain talk"</li>
  <li>The client argues against change instead of for it</li>
</ul>

<h3>Ambivalence is Normal</h3>
<p>MI recognizes that ambivalence about change is normal, not pathological. Most people considering change have reasons for changing AND reasons for staying the same. The counselor's task is to help resolve this ambivalence in the direction of change.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Change talk:</strong> Client statements favoring change</li>
  <li><strong>Sustain talk:</strong> Client statements favoring status quo</li>
  <li><strong>Discord:</strong> Ruptures in the working relationship</li>
</ul>
`,

  'MI Good Example': `
<h2>The Four Processes of Motivational Interviewing</h2>
<p>MI unfolds through four overlapping processes. While they often occur in this order, they are not rigid stages—the counselor may move back and forth as needed.</p>

<h3>1. Engaging</h3>
<p>Establishing a helpful connection and working relationship. Without engagement, the other processes cannot occur effectively.</p>
<p><strong>Key elements:</strong></p>
<ul>
  <li>Using OARS skills (Open questions, Affirmations, Reflections, Summaries)</li>
  <li>Understanding the client's perspective</li>
  <li>Building rapport and trust</li>
  <li>Demonstrating respect and genuine interest</li>
</ul>

<h3>2. Focusing</h3>
<p>Developing and maintaining a specific direction in the conversation toward change.</p>
<p><strong>Key elements:</strong></p>
<ul>
  <li>Identifying clear change goal(s)</li>
  <li>Negotiating agenda when multiple concerns exist</li>
  <li>Maintaining direction without being directive</li>
  <li>Collaborative goal clarification</li>
</ul>

<h3>3. Evoking</h3>
<p>Eliciting the client's own motivations for change. This is the heart of MI.</p>
<p><strong>Key elements:</strong></p>
<ul>
  <li>Recognizing change talk</li>
  <li>Responding to strengthen change talk</li>
  <li>Strategically asking evocative questions</li>
  <li>Exploring importance, confidence, and readiness</li>
</ul>

<h3>4. Planning</h3>
<p>Developing commitment to change and formulating a concrete plan of action. Occurs when the client is ready.</p>
<p><strong>Signs of readiness:</strong></p>
<ul>
  <li>Increased change talk, decreased sustain talk</li>
  <li>Resolve—client seems ready</li>
  <li>Questions about change</li>
  <li>Envisioning the future</li>
</ul>
<p><strong>Key elements:</strong></p>
<ul>
  <li>Summarizing change talk</li>
  <li>Asking key questions ("What's next?")</li>
  <li>Developing a change plan collaboratively</li>
  <li>Supporting commitment</li>
</ul>
`,

  'OARS Skills in MI': `
<h2>OARS: The Core Skills of Motivational Interviewing</h2>
<p>OARS represents the fundamental communication skills used throughout MI. These skills support engagement and help elicit and strengthen change talk.</p>

<h3>O - Open Questions</h3>
<p>Questions that cannot be answered with yes/no and invite elaboration, reflection, and exploration.</p>
<p><strong>Examples:</strong></p>
<ul>
  <li>"What brings you in today?"</li>
  <li>"How has this affected your life?"</li>
  <li>"What would you like to be different?"</li>
  <li>"What concerns do you have about your drinking?"</li>
</ul>
<p><strong>Avoid:</strong> Questions starting with "why" (can feel judgmental) and multiple questions at once.</p>

<h3>A - Affirmations</h3>
<p>Statements recognizing client strengths, efforts, and values. Genuine, not patronizing.</p>
<p><strong>Examples:</strong></p>
<ul>
  <li>"You've shown real courage in facing this."</li>
  <li>"Despite everything, you keep showing up."</li>
  <li>"Your children clearly matter a lot to you."</li>
</ul>
<p><strong>Note:</strong> Affirm character and effort, not just outcomes. Avoid empty praise.</p>

<h3>R - Reflections</h3>
<p>The primary skill in MI. Reflective statements (not questions) that convey understanding and invite continued exploration.</p>
<p><strong>Types of reflections:</strong></p>
<ul>
  <li><strong>Simple:</strong> Repeating or rephrasing what client said</li>
  <li><strong>Complex:</strong> Adding meaning, feeling, or continuing the thought</li>
  <li><strong>Amplified:</strong> Slightly overstating (to evoke correction)</li>
  <li><strong>Double-sided:</strong> Reflecting both sides of ambivalence</li>
</ul>
<p><strong>Key:</strong> Aim for at least 2 reflections for every question (2:1 ratio minimum).</p>

<h3>S - Summaries</h3>
<p>Longer reflections that collect and link what the client has said. Three types:</p>
<ul>
  <li><strong>Collecting:</strong> Gathering related content ("Let me see if I've got this...")</li>
  <li><strong>Linking:</strong> Connecting present statements to earlier material</li>
  <li><strong>Transitioning:</strong> Summarizing before moving to a new topic or planning</li>
</ul>
<p><strong>Strategic summaries:</strong> When summarizing ambivalence, end with change talk to leave it lingering.</p>
`,

  'Recognizing and Responding to Change Talk': `
<h2>Change Talk and Sustain Talk</h2>
<p>In MI, the counselor's task is to recognize, evoke, and strengthen change talk while softening sustain talk. Change talk predicts behavior change—the more a person talks themselves into change, the more likely they are to change.</p>

<h3>DARN-CAT: Types of Change Talk</h3>
<p><strong>Preparatory change talk (DARN):</strong></p>
<ul>
  <li><strong>D</strong>esire: "I want to..." "I wish I could..."</li>
  <li><strong>A</strong>bility: "I could..." "I might be able to..."</li>
  <li><strong>R</strong>easons: "I would feel better if..." "It would help me..."</li>
  <li><strong>N</strong>eed: "I have to..." "I must..." "I need to..."</li>
</ul>

<p><strong>Mobilizing change talk (CAT):</strong></p>
<ul>
  <li><strong>C</strong>ommitment: "I will..." "I'm going to..."</li>
  <li><strong>A</strong>ctivation: "I'm willing to..." "I'm ready to..."</li>
  <li><strong>T</strong>aking steps: "I started..." "I already..."</li>
</ul>

<h3>Responding to Change Talk</h3>
<p>When you hear change talk, use EARS:</p>
<ul>
  <li><strong>E</strong>laborate: Ask for more detail ("Tell me more about that")</li>
  <li><strong>A</strong>ffirm: Recognize the statement ("That took insight to recognize")</li>
  <li><strong>R</strong>eflect: Mirror it back, perhaps with emphasis</li>
  <li><strong>S</strong>ummarize: Collect change talk and offer it back</li>
</ul>

<h3>Sustain Talk</h3>
<p>Arguments for maintaining the status quo. Not "resistance"—it's normal in ambivalence.</p>
<p><strong>Examples:</strong> "But I like drinking" "I can't imagine life without cigarettes" "It's not that bad"</p>
<p><strong>Responding to sustain talk:</strong></p>
<ul>
  <li>Simple reflection (acknowledge without amplifying)</li>
  <li>Double-sided reflection (reflect sustain, then change talk)</li>
  <li>Come alongside ("This is really hard")</li>
  <li>Emphasize autonomy ("Only you can decide")</li>
</ul>

<h3>Key Principle</h3>
<p>What you pay attention to grows. Respond generously to change talk; respond minimally to sustain talk.</p>
`,

  'MI with a Resistant Client': `
<h2>Rolling with Discord</h2>
<p>In MI, "resistance" is reframed as "discord"—a signal that something in the interaction needs attention. Discord is about the relationship, not the client's character.</p>

<h3>Signs of Discord</h3>
<ul>
  <li>Arguing, challenging, dismissing</li>
  <li>Interrupting the counselor</li>
  <li>Disengagement, inattention</li>
  <li>Ignoring or discounting</li>
</ul>

<h3>Sources of Discord</h3>
<p>Discord often signals:</p>
<ul>
  <li>Counselor is pushing too hard or too fast</li>
  <li>Client doesn't feel understood</li>
  <li>Goals are misaligned</li>
  <li>Client's autonomy feels threatened</li>
  <li>The righting reflex has been triggered</li>
</ul>

<h3>Strategies for Responding to Discord</h3>

<p><strong>Reflect:</strong> Simply acknowledge what the client is saying without defensiveness.</p>

<p><strong>Apologize:</strong> If you've pushed too hard: "I'm sorry, I got ahead of you there."</p>

<p><strong>Emphasize autonomy:</strong> "You're the only one who can decide this." "No one can make you change."</p>

<p><strong>Shift focus:</strong> Move away from the stuck point to something else.</p>

<p><strong>Reframe:</strong> Offer a new perspective on what they've said.</p>

<p><strong>Come alongside:</strong> Join with the resistance: "You're right—this is hard, and nobody can make you do it."</p>

<p><strong>Agree with a twist:</strong> Agree, then add a perspective.</p>

<h3>Prevention</h3>
<p>The best strategy is prevention:</p>
<ul>
  <li>Avoid the righting reflex</li>
  <li>Ask permission before giving information</li>
  <li>Honor autonomy throughout</li>
  <li>Stay curious rather than challenging</li>
</ul>

<h3>Key Mindset</h3>
<p>Discord is feedback, not opposition. It tells you to try something different, not try harder with the same approach.</p>
`,

  'MI Full Session Demo': `
<h2>Integrating MI: A Practical Framework</h2>
<p>This lesson synthesizes the MI concepts into a practical framework for conducting MI conversations from beginning to end.</p>

<h3>Opening the Conversation</h3>
<p>Start with open questions and reflective listening:</p>
<ul>
  <li>"What brings you in today?"</li>
  <li>"Tell me what's been going on."</li>
  <li>Follow with reflections, not more questions</li>
  <li>Build understanding before agenda-setting</li>
</ul>

<h3>Exploring Ambivalence</h3>
<p>Use the decisional balance to explore both sides:</p>
<ul>
  <li>"What do you like about [the behavior]?"</li>
  <li>"What concerns do you have?"</li>
  <li>"How does this fit with what matters to you?"</li>
</ul>
<p>Reflect both sides, ending with change talk when possible.</p>

<h3>Assessing Importance and Confidence</h3>
<p>Use scaling questions:</p>
<ul>
  <li>"On a scale of 0-10, how important is it for you to make this change?"</li>
  <li>"On a scale of 0-10, how confident are you that you could make this change?"</li>
  <li>Follow-up: "Why are you at a [X] and not a lower number?"</li>
</ul>

<h3>Evoking Change Talk</h3>
<p>When ready, strategically evoke change talk:</p>
<ul>
  <li>"What would be the good things about making this change?"</li>
  <li>"What would you like your life to look like?"</li>
  <li>"If you decided to change, how would you do it?"</li>
</ul>

<h3>Moving Toward Planning</h3>
<p>When change talk is strong and sustain talk has diminished:</p>
<ul>
  <li>Summarize the change talk you've heard</li>
  <li>Ask a key question: "So what's next for you?"</li>
  <li>Develop a change plan collaboratively</li>
  <li>Anticipate barriers and problem-solve</li>
</ul>

<h3>Common Integration Challenges</h3>
<ul>
  <li>Rushing to planning before readiness</li>
  <li>Forgetting the spirit (partnership, autonomy)</li>
  <li>Too many questions, not enough reflections</li>
  <li>Providing solutions instead of evoking them</li>
</ul>
`,

  // ===== TRAUMA =====
  'What is Trauma?': `
<h2>Understanding Trauma: Definition and Types</h2>
<p>Trauma is not defined by the event itself, but by the individual's response to an overwhelming experience. Understanding this distinction is essential for trauma-informed practice.</p>

<h3>Defining Trauma</h3>
<p>Trauma occurs when an experience overwhelms a person's capacity to cope, leaving them feeling helpless, terrified, or out of control. The Substance Abuse and Mental Health Services Administration (SAMHSA) defines it as:</p>
<blockquote>"An event, series of events, or set of circumstances experienced by an individual as physically or emotionally harmful or threatening and that has lasting adverse effects on the individual's functioning and well-being."</blockquote>

<h3>Types of Trauma</h3>

<p><strong>Single-incident trauma:</strong> A one-time overwhelming event (accident, assault, natural disaster)</p>

<p><strong>Complex/developmental trauma:</strong> Repeated, chronic trauma, often in childhood and within caregiving relationships. Results in broader impact on development, attachment, and identity.</p>

<p><strong>Intergenerational trauma:</strong> Trauma effects transmitted across generations through parenting, genetics, and family/cultural patterns.</p>

<p><strong>Collective/historical trauma:</strong> Shared traumatic experiences affecting communities or cultural groups (genocide, slavery, colonization).</p>

<h3>Why Responses Vary</h3>
<p>The same event affects different people differently based on:</p>
<ul>
  <li>Prior trauma history</li>
  <li>Age and developmental stage</li>
  <li>Presence of supportive relationships</li>
  <li>Duration and severity of exposure</li>
  <li>Degree of betrayal involved</li>
  <li>Biological factors and temperament</li>
  <li>Cultural factors and meaning-making</li>
</ul>

<h3>Clinical Implications</h3>
<ul>
  <li>Don't assume what is or isn't traumatic—ask</li>
  <li>Focus on impact, not just events</li>
  <li>Recognize that trauma is common (most adults report at least one traumatic experience)</li>
  <li>Understand that responses to trauma are adaptive, not pathological</li>
</ul>
`,

  'How Trauma Gets Stuck in the Body': `
<h2>The Neurobiology of Trauma</h2>
<p>Understanding how trauma affects the brain and body helps explain symptoms and guides treatment. This knowledge also helps clients make sense of their experiences and reduce shame.</p>

<h3>Key Brain Structures</h3>

<p><strong>Amygdala:</strong> The brain's "alarm system" that detects threat and initiates the stress response. In trauma survivors, the amygdala is often hyperactive, triggering fear responses even to non-threatening stimuli.</p>

<p><strong>Prefrontal Cortex:</strong> The "thinking brain" responsible for reasoning, planning, and regulating emotions. During extreme stress, prefrontal function decreases—explaining why people can't "think their way" out of a trauma response.</p>

<p><strong>Hippocampus:</strong> Critical for memory consolidation and providing context. Trauma can impair hippocampal function, leading to fragmented memories without clear time/place context. This explains why trauma memories can feel like they're happening NOW.</p>

<h3>The Stress Response</h3>
<p>When threat is detected, the sympathetic nervous system activates:</p>
<ul>
  <li><strong>Fight:</strong> Mobilizing to confront the threat (anger, aggression)</li>
  <li><strong>Flight:</strong> Mobilizing to escape (anxiety, running)</li>
  <li><strong>Freeze:</strong> When fight/flight isn't possible—immobility, dissociation</li>
</ul>

<h3>Why Trauma Gets "Stuck"</h3>
<p>In normal stress, the threat passes and the nervous system returns to baseline. In trauma:</p>
<ul>
  <li>The nervous system remains activated</li>
  <li>Memories aren't fully processed</li>
  <li>The body continues to respond as if danger is present</li>
  <li>Triggers activate the same survival responses</li>
</ul>
<p>As Bessel van der Kolk famously wrote: "The body keeps the score."</p>

<h3>Implications for Treatment</h3>
<ul>
  <li>Cognitive approaches alone may be insufficient</li>
  <li>Body-based interventions have important role</li>
  <li>Stabilization must precede processing</li>
  <li>Psychoeducation helps normalize responses</li>
</ul>
`,

  'The Window of Tolerance': `
<h2>The Window of Tolerance</h2>
<p>The "window of tolerance" concept, developed by Dan Siegel, describes the optimal zone of arousal in which a person can function effectively. Understanding this framework is essential for trauma treatment.</p>

<h3>The Three Zones</h3>

<p><strong>Hyperarousal (above the window):</strong></p>
<ul>
  <li>Fight/flight activation</li>
  <li>Racing thoughts, anxiety, panic</li>
  <li>Hypervigilance, irritability</li>
  <li>Difficulty concentrating</li>
  <li>Physical symptoms: rapid heart rate, tension, sweating</li>
</ul>

<p><strong>Window of Tolerance (optimal zone):</strong></p>
<ul>
  <li>Able to think and feel simultaneously</li>
  <li>Can process information effectively</li>
  <li>Can tolerate and respond to emotions</li>
  <li>Can engage in relationships and daily tasks</li>
</ul>

<p><strong>Hypoarousal (below the window):</strong></p>
<ul>
  <li>Freeze/shutdown response</li>
  <li>Numbness, flatness, disconnection</li>
  <li>Difficulty thinking, foggy</li>
  <li>Fatigue, collapse, dissociation</li>
  <li>Physical symptoms: low energy, slow heart rate</li>
</ul>

<h3>Trauma's Effect on the Window</h3>
<p>Trauma often narrows the window of tolerance, making it:</p>
<ul>
  <li>Easier to be triggered into dysregulation</li>
  <li>Harder to return to baseline</li>
  <li>More time spent outside the optimal zone</li>
</ul>

<h3>Clinical Applications</h3>
<ol>
  <li><strong>Psychoeducation:</strong> Help clients understand their responses</li>
  <li><strong>Self-monitoring:</strong> Build awareness of current arousal state</li>
  <li><strong>Regulation skills:</strong> Practice returning to the window</li>
  <li><strong>Gradual expansion:</strong> Slowly widen the window through titrated exposure</li>
</ol>

<h3>Treatment Guideline</h3>
<p>Effective trauma processing requires staying within the window. If the client is outside the window, return to stabilization before continuing processing work.</p>
`,

  'Complex PTSD Overview': `
<h2>PTSD vs. Complex PTSD</h2>
<p>While PTSD is well-established, Complex PTSD (C-PTSD) recognizes the broader impact of prolonged, repeated trauma, especially when it occurs in the context of relationships.</p>

<h3>Standard PTSD Symptoms</h3>
<p>PTSD is characterized by four symptom clusters:</p>
<ol>
  <li><strong>Intrusion:</strong> Unwanted memories, flashbacks, nightmares</li>
  <li><strong>Avoidance:</strong> Avoiding reminders of the trauma</li>
  <li><strong>Negative cognitions/mood:</strong> Negative beliefs about self/world, emotional numbing</li>
  <li><strong>Hyperarousal:</strong> Startle response, hypervigilance, sleep difficulties</li>
</ol>

<h3>Additional Features in Complex PTSD</h3>
<p>C-PTSD includes the above plus:</p>

<p><strong>Disturbances in self-organization (DSO):</strong></p>
<ul>
  <li><strong>Affect dysregulation:</strong> Difficulty modulating emotions; explosive anger or emotional numbing</li>
  <li><strong>Negative self-concept:</strong> Pervasive shame, worthlessness, feeling permanently damaged</li>
  <li><strong>Interpersonal difficulties:</strong> Trouble maintaining relationships, feeling disconnected from others</li>
</ul>

<h3>Presentations That May Mask Trauma</h3>
<p>C-PTSD can present as:</p>
<ul>
  <li>Borderline personality disorder</li>
  <li>Treatment-resistant depression or anxiety</li>
  <li>Somatic complaints</li>
  <li>Dissociative disorders</li>
  <li>Substance use disorders</li>
  <li>Attachment difficulties</li>
</ul>

<h3>Trauma-Informed Assessment</h3>
<p>Always assess for trauma history, recognizing that:</p>
<ul>
  <li>Clients may not spontaneously disclose</li>
  <li>They may not identify experiences as "trauma"</li>
  <li>Shame may prevent disclosure</li>
  <li>Memories may be fragmented or unavailable</li>
</ul>

<h3>Treatment Implications</h3>
<p>C-PTSD typically requires:</p>
<ul>
  <li>Longer treatment</li>
  <li>Greater emphasis on safety and stabilization</li>
  <li>Focus on affect regulation and interpersonal skills</li>
  <li>Attention to the therapeutic relationship as a corrective experience</li>
</ul>
`,

  'Grounding Techniques for PTSD': `
<h2>Grounding Techniques for Trauma</h2>
<p>Grounding techniques help clients orient to the present moment when experiencing dissociation, flashbacks, or overwhelming emotions. They create safety by anchoring awareness in the here and now.</p>

<h3>5-4-3-2-1 Sensory Grounding</h3>
<p>Engage the five senses systematically:</p>
<ul>
  <li><strong>5</strong> things you can SEE (name them aloud)</li>
  <li><strong>4</strong> things you can HEAR</li>
  <li><strong>3</strong> things you can TOUCH (and feel the textures)</li>
  <li><strong>2</strong> things you can SMELL</li>
  <li><strong>1</strong> thing you can TASTE</li>
</ul>
<p>This engages the sensory cortex and orients the brain to present reality.</p>

<h3>Body-Based Grounding</h3>
<ul>
  <li><strong>Feet on floor:</strong> Press feet firmly into the ground; notice the contact</li>
  <li><strong>Hand awareness:</strong> Press hands together firmly; notice temperature, pressure</li>
  <li><strong>Body scan:</strong> Systematically notice each body part from feet to head</li>
  <li><strong>Cold water:</strong> Hold ice or splash cold water on face/wrists</li>
</ul>

<h3>Orientation to Present</h3>
<p>Verbal reminders of present safety:</p>
<ul>
  <li>"Where are you right now? What room?"</li>
  <li>"What is today's date?"</li>
  <li>"Name three things you see in this room"</li>
  <li>"That was then. This is now. You are safe."</li>
</ul>

<h3>Cognitive Grounding</h3>
<ul>
  <li>Count backward from 100 by 7s</li>
  <li>Name categories (states, animals, colors)</li>
  <li>Describe an everyday task in detail</li>
  <li>Recite something memorized (poem, lyrics, prayer)</li>
</ul>

<h3>Teaching Grounding to Clients</h3>
<ol>
  <li>Explain the purpose (present-moment orientation)</li>
  <li>Practice together when client is calm</li>
  <li>Identify which techniques resonate</li>
  <li>Create a personal "grounding menu"</li>
  <li>Practice regularly, not just in crisis</li>
</ol>
`,

  'Safe Place Visualization': `
<h2>Building Internal Resources: Safe Place Visualization</h2>
<p>Safe place (or calm place) visualization helps clients develop an internal resource for self-soothing and stabilization. This is a foundational skill in many trauma treatment approaches, including EMDR.</p>

<h3>Purpose</h3>
<ul>
  <li>Create an internal refuge from distress</li>
  <li>Build capacity for self-regulation</li>
  <li>Provide a "container" during trauma processing</li>
  <li>Establish positive associative networks</li>
</ul>

<h3>Guiding the Visualization</h3>

<p><strong>1. Introduction:</strong> "We're going to create an internal place of safety and calm that you can visit whenever you need to feel more settled."</p>

<p><strong>2. Invite imagery:</strong> "Think of a place—real or imagined—where you feel completely safe, peaceful, and calm. It might be a place you've been, somewhere you've seen, or a place you create entirely in your imagination."</p>

<p><strong>3. Engage the senses:</strong></p>
<ul>
  <li>"What do you see in this place?"</li>
  <li>"What sounds do you hear?"</li>
  <li>"What can you smell?"</li>
  <li>"What's the temperature? What do you feel on your skin?"</li>
  <li>"Notice how your body feels in this place."</li>
</ul>

<p><strong>4. Enhance positive affect:</strong> "Notice the feelings of peace and safety. Where do you feel that in your body? Let those feelings grow and spread."</p>

<p><strong>5. Create a cue word:</strong> "Is there a word that captures this feeling? [pause] When you say that word, you can return to this place."</p>

<p><strong>6. Practice accessing:</strong> Have the client practice bringing up the image and noticing the shift in body state.</p>

<h3>Important Considerations</h3>
<ul>
  <li>Some trauma survivors cannot imagine a safe place—adapt to "calm" or "peaceful"</li>
  <li>Avoid places associated with trauma</li>
  <li>It's okay if people appear in the visualization, but assess for safety</li>
  <li>Practice regularly to strengthen the resource</li>
</ul>
`,

  'Phases of Trauma Treatment': `
<h2>Phases of Trauma Treatment and Pacing</h2>
<p>Effective trauma treatment follows a phase-based approach. Moving through phases at the client's pace—neither too fast nor too slow—is essential for safe and effective treatment.</p>

<h3>The Three-Phase Model</h3>
<p>Based on the work of Judith Herman and others:</p>

<p><strong>Phase 1: Safety and Stabilization</strong></p>
<ul>
  <li>Establish physical safety</li>
  <li>Build the therapeutic relationship</li>
  <li>Develop affect regulation skills</li>
  <li>Create internal resources</li>
  <li>Address current crises and self-harm</li>
  <li>Psychoeducation about trauma</li>
</ul>

<p><strong>Phase 2: Trauma Processing</strong></p>
<ul>
  <li>Process traumatic memories</li>
  <li>Integrate fragmented experiences</li>
  <li>Work with meaning and beliefs</li>
  <li>Various approaches: EMDR, CPT, PE, etc.</li>
</ul>

<p><strong>Phase 3: Reconnection and Integration</strong></p>
<ul>
  <li>Reconnect with life, others, purpose</li>
  <li>Build or rebuild relationships</li>
  <li>Develop new identity beyond trauma</li>
  <li>Post-traumatic growth</li>
</ul>

<h3>Signs of Readiness for Processing (Phase 2)</h3>
<ul>
  <li>Adequate stabilization and coping skills</li>
  <li>Strong therapeutic alliance</li>
  <li>Relative life stability</li>
  <li>No active self-harm or suicidality</li>
  <li>Ability to tolerate distress without dissociating</li>
  <li>Client desire and consent to proceed</li>
</ul>

<h3>Signs of Moving Too Fast</h3>
<ul>
  <li>Increased symptoms between sessions</li>
  <li>Dissociation during or after sessions</li>
  <li>Regression in functioning</li>
  <li>Avoidance of therapy</li>
  <li>Increased substance use or self-harm</li>
</ul>

<h3>The Art of Pacing</h3>
<p>Effective pacing means:</p>
<ul>
  <li>Titrating exposure to trauma material</li>
  <li>Pendulating between activation and regulation</li>
  <li>Returning to stabilization when needed</li>
  <li>Following the client's window of tolerance</li>
</ul>
`,

  // ===== ANXIETY TREATMENT =====
  'Anxiety Disorders Overview': `
<h2>Anxiety Disorders: Types and Presentations</h2>
<p>Anxiety disorders are the most common mental health conditions, affecting approximately 30% of adults at some point. Understanding the distinct presentations helps guide assessment and treatment.</p>

<h3>Generalized Anxiety Disorder (GAD)</h3>
<p>Characterized by excessive worry about multiple areas of life for at least 6 months.</p>
<ul>
  <li>Worry is difficult to control</li>
  <li>Physical symptoms: restlessness, fatigue, muscle tension, sleep problems</li>
  <li>"What-if" thinking across many domains</li>
</ul>

<h3>Panic Disorder</h3>
<p>Recurrent, unexpected panic attacks with fear of future attacks.</p>
<ul>
  <li>Sudden onset of intense fear</li>
  <li>Physical symptoms: heart pounding, sweating, trembling, shortness of breath</li>
  <li>Fear of dying, losing control, or "going crazy"</li>
  <li>Often develops into agoraphobia</li>
</ul>

<h3>Social Anxiety Disorder</h3>
<p>Marked fear of social situations where one might be judged or embarrassed.</p>
<ul>
  <li>Fear of negative evaluation</li>
  <li>Avoidance of social or performance situations</li>
  <li>Physical symptoms in social settings</li>
</ul>

<h3>Specific Phobias</h3>
<p>Intense fear of specific objects or situations.</p>
<ul>
  <li>Common: animals, heights, flying, blood/injection, enclosed spaces</li>
  <li>Avoidance or endurance with extreme distress</li>
  <li>Recognition that fear is excessive</li>
</ul>

<h3>Obsessive-Compulsive Disorder (OCD)</h3>
<p>Now in its own diagnostic category, characterized by:</p>
<ul>
  <li>Obsessions: intrusive, unwanted thoughts causing distress</li>
  <li>Compulsions: repetitive behaviors aimed at reducing distress</li>
  <li>Common themes: contamination, harm, symmetry, religious/moral concerns</li>
</ul>

<h3>Key Assessment Points</h3>
<ul>
  <li>Distinguish from normal worry/fear (interference, distress level)</li>
  <li>Assess avoidance patterns</li>
  <li>Identify safety behaviors</li>
  <li>Screen for comorbidities (depression, substance use)</li>
  <li>Consider medical causes</li>
</ul>
`,

  'How Anxiety Maintains Itself': `
<h2>The Anxiety Maintenance Cycle</h2>
<p>Understanding how anxiety perpetuates itself is essential for treatment planning. Anxiety is maintained not by the presence of triggers, but by the behaviors we use to manage it.</p>

<h3>The Core Cycle</h3>
<ol>
  <li><strong>Trigger:</strong> Situation or thought perceived as threatening</li>
  <li><strong>Anxiety response:</strong> Physical, cognitive, and emotional distress</li>
  <li><strong>Avoidance or safety behavior:</strong> Escape, avoid, or use safety strategies</li>
  <li><strong>Temporary relief:</strong> Anxiety decreases in the short term</li>
  <li><strong>Negative reinforcement:</strong> Behavior is strengthened by relief</li>
  <li><strong>Maintained anxiety:</strong> No learning occurs; anxiety persists</li>
</ol>

<h3>Avoidance</h3>
<p>The obvious maintenance factor. When we avoid what we fear:</p>
<ul>
  <li>We never learn the feared outcome doesn't happen (or is manageable)</li>
  <li>The world of feared situations often expands</li>
  <li>Life becomes increasingly restricted</li>
</ul>

<h3>Safety Behaviors</h3>
<p>More subtle than avoidance—these are what we do to "get through" feared situations while protecting ourselves from feared outcomes.</p>
<p><strong>Examples:</strong></p>
<ul>
  <li>Carrying "emergency" medication (even if never used)</li>
  <li>Only going places with a "safe person"</li>
  <li>Over-preparing for presentations</li>
  <li>Sitting near exits</li>
  <li>Avoiding eye contact in social situations</li>
</ul>
<p><strong>Problem:</strong> Safety behaviors prevent disconfirmation. The person credits the behavior, not their own coping capacity.</p>

<h3>Cognitive Factors</h3>
<ul>
  <li><strong>Overestimation of threat:</strong> "It will definitely happen"</li>
  <li><strong>Catastrophizing:</strong> "It will be unbearable"</li>
  <li><strong>Underestimation of coping:</strong> "I won't be able to handle it"</li>
  <li><strong>Selective attention:</strong> Scanning for threat confirms it's everywhere</li>
</ul>

<h3>Treatment Implication</h3>
<p>Effective anxiety treatment targets the maintenance cycle by eliminating avoidance and safety behaviors through exposure.</p>
`,

  'CBT for Anxiety - Cognitive Restructuring': `
<h2>Cognitive Restructuring for Anxiety</h2>
<p>Cognitive restructuring helps clients identify, evaluate, and modify the anxious thoughts that drive anxiety. The goal is not positive thinking, but more accurate, balanced thinking.</p>

<h3>Common Anxious Thinking Patterns</h3>
<ul>
  <li><strong>Probability overestimation:</strong> "It will definitely happen"</li>
  <li><strong>Catastrophizing:</strong> "It would be awful/unbearable"</li>
  <li><strong>Mind reading:</strong> "Everyone will notice I'm anxious"</li>
  <li><strong>Fortune telling:</strong> "I know I'll fail"</li>
</ul>

<h3>The Two Key Questions</h3>
<p>For any anxious thought, explore:</p>
<ol>
  <li><strong>"How likely is it?"</strong> (Probability estimate)
    <ul>
      <li>What's the evidence for and against?</li>
      <li>What has happened in similar situations?</li>
      <li>What would a friend say about this prediction?</li>
    </ul>
  </li>
  <li><strong>"How bad would it really be?"</strong> (Decatastrophizing)
    <ul>
      <li>What's the worst, best, and most likely outcome?</li>
      <li>Could I cope? How?</li>
      <li>Would it still matter in a week/month/year?</li>
    </ul>
  </li>
</ol>

<h3>Socratic Questions for Anxious Thoughts</h3>
<ul>
  <li>"What evidence supports this worry?"</li>
  <li>"What evidence contradicts it?"</li>
  <li>"How many times have you predicted this, and how often did it happen?"</li>
  <li>"If it did happen, what would you do?"</li>
  <li>"What's the most realistic outcome?"</li>
  <li>"What would you tell a friend who had this thought?"</li>
</ul>

<h3>Creating Coping Statements</h3>
<p>Develop realistic alternatives:</p>
<ul>
  <li>"Anxiety is uncomfortable but not dangerous."</li>
  <li>"I've handled this before; I can handle it again."</li>
  <li>"This feeling will pass."</li>
  <li>"I don't have to be perfect to be okay."</li>
</ul>

<h3>Integration with Exposure</h3>
<p>Cognitive work alone is often insufficient. Use restructuring to prepare for exposure, then let exposure provide the experiential learning that truly shifts beliefs.</p>
`,

  'Progressive Muscle Relaxation': `
<h2>Progressive Muscle Relaxation (PMR)</h2>
<p>PMR is an evidence-based technique that reduces physical tension associated with anxiety by systematically tensing and releasing muscle groups. It was developed by Edmund Jacobson in the 1930s.</p>

<h3>How PMR Works</h3>
<ul>
  <li>Teaches discrimination between tension and relaxation</li>
  <li>Activates the parasympathetic nervous system</li>
  <li>Incompatible with the anxiety response</li>
  <li>Provides a sense of control over physical state</li>
</ul>

<h3>Important Distinction</h3>
<p>PMR is a <strong>skill to build</strong>, not an avoidance strategy. The goal is to:</p>
<ul>
  <li>Increase body awareness</li>
  <li>Develop the ability to release tension at will</li>
  <li>Use as preparation for exposure, not escape from anxiety</li>
</ul>

<h3>Basic PMR Procedure</h3>
<p>For each muscle group:</p>
<ol>
  <li>Tense muscles for 5-7 seconds (not to the point of pain)</li>
  <li>Notice the tension</li>
  <li>Release quickly and completely</li>
  <li>Notice the relaxation for 15-20 seconds</li>
  <li>Note the contrast between tension and relaxation</li>
</ol>

<h3>Muscle Group Sequence</h3>
<ol>
  <li>Dominant hand and forearm (make a fist)</li>
  <li>Dominant bicep</li>
  <li>Non-dominant hand and forearm</li>
  <li>Non-dominant bicep</li>
  <li>Forehead (raise eyebrows)</li>
  <li>Eyes and cheeks (squeeze eyes shut)</li>
  <li>Mouth and jaw (clench teeth, press lips)</li>
  <li>Neck (press chin to chest)</li>
  <li>Shoulders (shrug up toward ears)</li>
  <li>Chest (take deep breath, hold)</li>
  <li>Abdomen (tighten stomach muscles)</li>
  <li>Thighs (press legs together)</li>
  <li>Calves (point toes)</li>
  <li>Feet (curl toes)</li>
</ol>

<h3>Teaching Tips</h3>
<ul>
  <li>Practice in session first</li>
  <li>Full sequence takes 15-20 minutes initially</li>
  <li>Can be shortened with practice</li>
  <li>Daily practice builds the skill</li>
  <li>Contraindicated with some medical conditions (check first)</li>
</ul>
`,

  'Diaphragmatic Breathing': `
<h2>Diaphragmatic Breathing for Anxiety</h2>
<p>Slow, diaphragmatic breathing activates the parasympathetic nervous system and can reduce anxiety symptoms. Like PMR, it should be taught as a skill, not an escape from anxiety.</p>

<h3>Why Breathing Matters</h3>
<p>During anxiety:</p>
<ul>
  <li>Breathing becomes rapid and shallow (chest breathing)</li>
  <li>This can trigger or worsen physical symptoms</li>
  <li>May lead to hyperventilation</li>
  <li>Maintains the fight-or-flight response</li>
</ul>

<p>Slow diaphragmatic breathing:</p>
<ul>
  <li>Stimulates the vagus nerve</li>
  <li>Activates the parasympathetic response</li>
  <li>Reduces heart rate and blood pressure</li>
  <li>Signals safety to the brain</li>
</ul>

<h3>Teaching Diaphragmatic Breathing</h3>
<p><strong>Position:</strong> Seated or lying down comfortably</p>
<p><strong>Hand placement:</strong> One hand on chest, one on abdomen</p>
<p><strong>Goal:</strong> Belly hand rises; chest hand stays relatively still</p>

<p><strong>Basic technique:</strong></p>
<ol>
  <li>Inhale slowly through nose for 4 counts</li>
  <li>Feel abdomen expand (like inflating a balloon)</li>
  <li>Pause briefly</li>
  <li>Exhale slowly through mouth for 6 counts</li>
  <li>Feel abdomen fall</li>
</ol>

<h3>Key Principles</h3>
<ul>
  <li><strong>Exhale longer than inhale:</strong> This activates the calming response</li>
  <li><strong>Slow pace:</strong> Aim for about 5-6 breaths per minute</li>
  <li><strong>Gentle:</strong> Don't force or overinflate</li>
  <li><strong>Regular practice:</strong> Build the skill when calm</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
  <li>Breathing too fast</li>
  <li>Chest breathing instead of belly</li>
  <li>Using only during panic (too late to be effective)</li>
  <li>Expecting immediate results</li>
</ul>

<h3>Integration</h3>
<p>Use diaphragmatic breathing:</p>
<ul>
  <li>As regular practice (daily, multiple times)</li>
  <li>Before potentially anxious situations</li>
  <li>During exposure to help stay in the window of tolerance</li>
  <li>NOT as escape from anxiety or avoidance of exposure</li>
</ul>
`,

  'How to Do Exposure Therapy': `
<h2>Conducting Exposure Therapy</h2>
<p>This lesson provides a practical guide to implementing exposure therapy for anxiety disorders.</p>

<h3>Step 1: Build the Hierarchy</h3>
<ul>
  <li>List all situations/stimuli related to the fear</li>
  <li>Rate each on a 0-100 SUDS scale</li>
  <li>Ensure items span the range (low, medium, high)</li>
  <li>Create gradual steps between items</li>
</ul>

<h3>Step 2: Prepare the Client</h3>
<ul>
  <li>Provide rationale (avoidance maintains anxiety)</li>
  <li>Explain what to expect (anxiety will rise then fall)</li>
  <li>Identify safety behaviors to eliminate</li>
  <li>Obtain informed consent</li>
</ul>

<h3>Step 3: Conduct Exposures</h3>
<p><strong>During each exposure:</strong></p>
<ul>
  <li>Start with lower-hierarchy items</li>
  <li>Stay in the situation (no escape)</li>
  <li>Drop safety behaviors</li>
  <li>Focus on the feared stimulus (no distraction)</li>
  <li>Continue until anxiety decreases (often 30-45+ minutes)</li>
  <li>Rate SUDS periodically (every 5-10 minutes)</li>
</ul>

<p><strong>Post-exposure processing:</strong></p>
<ul>
  <li>"What did you expect to happen?"</li>
  <li>"What actually happened?"</li>
  <li>"What did you learn?"</li>
</ul>

<h3>Step 4: Homework</h3>
<ul>
  <li>Assign daily exposure practice</li>
  <li>Repetition is key (same exposure multiple times)</li>
  <li>Move up hierarchy only when current item is low anxiety</li>
  <li>Vary contexts to enhance generalization</li>
</ul>

<h3>Common Challenges</h3>

<p><strong>Client wants to escape:</strong> Encourage staying; remind them anxiety will pass</p>

<p><strong>Anxiety doesn't decrease:</strong> Extend duration; check for subtle safety behaviors</p>

<p><strong>Client refuses exposure:</strong> Go slower; use imaginal first; explore barriers</p>

<p><strong>Initial increase in symptoms:</strong> Normal in early treatment; prepare client for this</p>

<h3>Key Success Factors</h3>
<ul>
  <li>Sufficient duration (long enough for habituation)</li>
  <li>Repetition (multiple trials)</li>
  <li>No safety behaviors</li>
  <li>Variability (different contexts)</li>
  <li>Expectancy violation (focusing on what was learned)</li>
</ul>
`
};

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const coursesCollection = mongoose.connection.db.collection('courses');
    const courses = await coursesCollection.find({}).toArray();
    
    let totalUpdated = 0;
    let notFound = [];
    
    for (const course of courses) {
      if (!course.modules) continue;
      
      let courseModified = false;
      
      for (let i = 0; i < course.modules.length; i++) {
        const module = course.modules[i];
        if (!module.lessons) continue;
        
        for (let j = 0; j < module.lessons.length; j++) {
          const lesson = module.lessons[j];
          
          if (lesson.type === 'video' && lesson.videoUrl) {
            const content = lessonContent[lesson.title];
            
            if (content) {
              // Update lesson type and content
              course.modules[i].lessons[j].type = 'text';
              course.modules[i].lessons[j].content = content.trim();
              delete course.modules[i].lessons[j].videoUrl;
              
              console.log(`✅ Updated: "${lesson.title}" in "${course.title}"`);
              totalUpdated++;
              courseModified = true;
            } else {
              notFound.push(`"${lesson.title}" in "${course.title}"`);
            }
          }
        }
      }
      
      // Save the course if modified
      if (courseModified) {
        await coursesCollection.updateOne(
          { _id: course._id },
          { $set: { modules: course.modules } }
        );
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total lessons converted: ${totalUpdated}`);
    
    if (notFound.length > 0) {
      console.log(`\nLessons without content (${notFound.length}):`);
      notFound.forEach(item => console.log(`  - ${item}`));
    }
    
    console.log('\nDone!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
