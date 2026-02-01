// convert-videos-to-text.cjs
// Run with: node src/server/src/scripts/convert-videos-to-text.cjs
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
<p>The deepest level connects feelings to underlying values, beliefs, or significance. This helps clients explore what their experiences mean to them.</p>
<p><strong>Example:</strong><br>
Client: "I've been applying for jobs for three months and haven't gotten a single interview."<br>
Therapist: "It sounds like this job search is starting to shake your confidence in yourself professionally."</p>

<h3>Skills for Effective Reflection</h3>
<ul>
  <li><strong>Use tentative language:</strong> "It sounds like..." "I'm hearing that..." "It seems as though..."</li>
  <li><strong>Match intensity:</strong> Don't over- or under-state the emotion</li>
  <li><strong>Vary your vocabulary:</strong> Expand beyond "frustrated" and "angry"</li>
  <li><strong>Check accuracy:</strong> Allow space for clients to correct your reflection</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
  <li>Parroting exact words instead of paraphrasing</li>
  <li>Adding interpretation or advice</li>
  <li>Reflecting too frequently (feels mechanical)</li>
  <li>Missing the emotional tone entirely</li>
</ul>
`,

  'Open vs Closed Questions': `
<h2>Strategic Use of Questions in Therapy</h2>
<p>Questions are powerful therapeutic tools—but their impact depends on how they're crafted and when they're used. Understanding the distinction between open and closed questions allows for more intentional, effective inquiry.</p>

<h3>Closed Questions</h3>
<p>Closed questions can be answered with a single word or short phrase, typically "yes," "no," or a specific fact.</p>
<p><strong>Examples:</strong></p>
<ul>
  <li>"Did you take your medication today?"</li>
  <li>"How old were you when that happened?"</li>
  <li>"Are you feeling anxious right now?"</li>
</ul>
<p><strong>When to use:</strong></p>
<ul>
  <li>Gathering specific information quickly</li>
  <li>Clarifying details</li>
  <li>Risk assessment ("Are you having thoughts of suicide?")</li>
  <li>When client is overwhelmed and needs structure</li>
</ul>

<h3>Open Questions</h3>
<p>Open questions invite elaboration and cannot be answered with a single word. They typically begin with "what," "how," "tell me about," or "describe."</p>
<p><strong>Examples:</strong></p>
<ul>
  <li>"What was that experience like for you?"</li>
  <li>"How did you respond when that happened?"</li>
  <li>"Tell me more about your relationship with your mother."</li>
</ul>
<p><strong>When to use:</strong></p>
<ul>
  <li>Exploring experiences in depth</li>
  <li>Understanding the client's perspective</li>
  <li>Building rapport and inviting disclosure</li>
  <li>Encouraging reflection</li>
</ul>

<h3>The "Why" Question Caution</h3>
<p>"Why" questions can feel accusatory or put clients on the defensive ("Why did you do that?"). Consider alternatives:</p>
<ul>
  <li>Instead of "Why did you skip your appointment?" try "What got in the way of making it to your appointment?"</li>
  <li>Instead of "Why do you feel that way?" try "What contributes to that feeling?"</li>
</ul>

<h3>Balancing Question Types</h3>
<p>Effective therapy uses both types strategically. Too many closed questions creates an interrogation feel; too many open questions can feel unfocused. Match your questions to the therapeutic moment.</p>
`,

  'Summarization Techniques': `
<h2>The Art of Therapeutic Summarization</h2>
<p>Summarization is more than a recap—it's a powerful intervention that organizes information, highlights themes, and helps clients see their experiences from a new perspective.</p>

<h3>Types of Summaries</h3>

<p><strong>Collecting summary:</strong> Gathers information shared over the past few minutes</p>
<p>"Let me make sure I'm tracking with you. You've described feeling overwhelmed at work, tensions with your partner about finances, and your sleep has been suffering. Did I capture that accurately?"</p>

<p><strong>Linking summary:</strong> Connects themes across the session or across time</p>
<p>"I'm noticing a pattern—both the situation with your boss and the conflict with your sister seem to involve times when you didn't speak up for yourself, and then felt resentful afterward."</p>

<p><strong>Transitional summary:</strong> Closes one topic and opens another</p>
<p>"We've spent some time exploring your childhood experiences. Before we shift to talking about current relationships, is there anything else about that period you want to add?"</p>

<p><strong>Closing summary:</strong> Wraps up a session</p>
<p>"Today we talked about your progress with the anxiety techniques, worked through that disagreement with your roommate, and identified some goals for the week ahead."</p>

<h3>Functions of Summarization</h3>
<ul>
  <li>Demonstrates active listening</li>
  <li>Allows clients to hear their own story reflected back</li>
  <li>Identifies patterns and themes</li>
  <li>Provides natural transition points</li>
  <li>Ensures mutual understanding</li>
  <li>Helps clients organize fragmented experiences</li>
</ul>

<h3>Tips for Effective Summaries</h3>
<ul>
  <li>Be concise—capture essence, not every detail</li>
  <li>Use the client's own key words and phrases</li>
  <li>Invite correction: "Did I get that right?"</li>
  <li>Include both content and feeling</li>
  <li>Look for what the client might not have stated explicitly</li>
</ul>
`,

  // ===== COGNITIVE BEHAVIORAL THERAPY =====
  'CBT Overview': `
<h2>Foundations of Cognitive Behavioral Therapy</h2>
<p>Cognitive Behavioral Therapy (CBT) is one of the most extensively researched and empirically supported psychotherapeutic approaches. Understanding its theoretical foundations is essential for effective implementation.</p>

<h3>The Cognitive Model</h3>
<p>Aaron Beck's cognitive model proposes that our emotional and behavioral responses are not caused directly by events, but by our interpretations of those events. The pathway is:</p>
<p><strong>Situation → Thoughts → Emotions → Behaviors</strong></p>
<p>This means that two people can experience the same event but have entirely different emotional responses based on how they interpret it.</p>

<h3>Core Concepts</h3>
<p><strong>Automatic Thoughts:</strong> Rapid, spontaneous cognitions that occur in response to situations. Often negative, distorted, and accepted as true without examination.</p>
<p><strong>Cognitive Distortions:</strong> Systematic errors in thinking that maintain negative beliefs (e.g., all-or-nothing thinking, catastrophizing, mind reading).</p>
<p><strong>Core Beliefs:</strong> Deep, fundamental beliefs about self, others, and the world that develop early in life and filter our experiences.</p>
<p><strong>Intermediate Beliefs:</strong> Rules, attitudes, and assumptions that connect core beliefs to automatic thoughts ("If I make a mistake, people will reject me").</p>

<h3>The CBT Triangle</h3>
<p>Thoughts, emotions, and behaviors are interconnected—changes in one affect the others. CBT intervenes at all three points:</p>
<ul>
  <li><strong>Cognitive interventions:</strong> Identifying and restructuring unhelpful thoughts</li>
  <li><strong>Behavioral interventions:</strong> Changing behaviors to generate new experiences and data</li>
  <li><strong>Emotional interventions:</strong> Developing awareness and tolerance of emotions</li>
</ul>

<h3>Structure of CBT</h3>
<p>CBT is typically:</p>
<ul>
  <li>Time-limited (12-20 sessions for many conditions)</li>
  <li>Structured (agenda-setting, homework)</li>
  <li>Collaborative (therapist and client work together)</li>
  <li>Present-focused (while understanding historical origins)</li>
  <li>Psychoeducational (teaching skills for independent use)</li>
</ul>
`,

  'Identifying Automatic Thoughts': `
<h2>Catching Automatic Thoughts</h2>
<p>Automatic thoughts are the running commentary in our minds—rapid, habitual interpretations of events that often go unnoticed yet powerfully influence our emotions. Learning to identify them is a foundational CBT skill.</p>

<h3>Characteristics of Automatic Thoughts</h3>
<ul>
  <li><strong>Automatic:</strong> They pop up without effort or intention</li>
  <li><strong>Rapid:</strong> They occur quickly, often in shorthand</li>
  <li><strong>Believable:</strong> They feel true in the moment</li>
  <li><strong>Often distorted:</strong> They frequently contain cognitive errors</li>
  <li><strong>Habitual:</strong> The same thought patterns repeat across situations</li>
</ul>

<h3>How to Identify Automatic Thoughts</h3>
<p><strong>Notice emotional shifts:</strong> Strong emotions are cues that an automatic thought just occurred. Ask: "What just went through my mind?"</p>
<p><strong>Use the downward arrow:</strong> When you identify a thought, ask "If that were true, what would it mean?" to uncover deeper thoughts.</p>
<p><strong>Imagery:</strong> Sometimes thoughts come as images rather than words. Ask about mental pictures.</p>

<h3>Questions to Elicit Automatic Thoughts</h3>
<ul>
  <li>"What was going through your mind just then?"</li>
  <li>"What were you thinking when you started feeling anxious?"</li>
  <li>"Did you have any images or memories pop up?"</li>
  <li>"What's the worst part of this situation for you?"</li>
  <li>"What does this situation mean to you?"</li>
</ul>

<h3>Common Forms of Automatic Thoughts</h3>
<ul>
  <li>Words or sentences ("I'm such an idiot")</li>
  <li>Images (seeing yourself failing)</li>
  <li>Memories (flashback to past failure)</li>
  <li>Meanings ("This proves I can't handle anything")</li>
</ul>

<h3>The Thought Record</h3>
<p>A structured tool for capturing automatic thoughts includes:</p>
<ol>
  <li>Situation: What happened?</li>
  <li>Emotions: What did you feel? (0-100 intensity)</li>
  <li>Automatic thoughts: What went through your mind?</li>
  <li>Evidence for/against the thought</li>
  <li>Alternative thought</li>
  <li>Outcome: New emotion rating</li>
</ol>
`,

  'Cognitive Restructuring': `
<h2>Cognitive Restructuring Techniques</h2>
<p>Cognitive restructuring is the process of identifying, evaluating, and modifying unhelpful thoughts. It's not about positive thinking—it's about accurate, balanced thinking.</p>

<h3>The Process</h3>
<ol>
  <li><strong>Identify</strong> the automatic thought</li>
  <li><strong>Evaluate</strong> the evidence for and against</li>
  <li><strong>Generate</strong> alternative perspectives</li>
  <li><strong>Re-rate</strong> emotions after restructuring</li>
</ol>

<h3>Socratic Questioning</h3>
<p>Rather than telling clients their thoughts are wrong, use questions to guide discovery:</p>
<ul>
  <li>"What's the evidence for this thought?"</li>
  <li>"What's the evidence against it?"</li>
  <li>"Is there another way to look at this?"</li>
  <li>"What would you tell a friend in this situation?"</li>
  <li>"What's the most realistic outcome?"</li>
  <li>"If the worst happened, how would you cope?"</li>
</ul>

<h3>Common Cognitive Distortions</h3>
<ul>
  <li><strong>All-or-nothing thinking:</strong> Seeing things in black-and-white categories</li>
  <li><strong>Catastrophizing:</strong> Expecting the worst possible outcome</li>
  <li><strong>Mind reading:</strong> Assuming you know what others think</li>
  <li><strong>Fortune telling:</strong> Predicting negative outcomes</li>
  <li><strong>Emotional reasoning:</strong> "I feel it, so it must be true"</li>
  <li><strong>Should statements:</strong> Rigid rules about how things must be</li>
  <li><strong>Personalization:</strong> Taking excessive responsibility for external events</li>
  <li><strong>Discounting the positive:</strong> Dismissing positive experiences</li>
</ul>

<h3>Important Considerations</h3>
<ul>
  <li>Some negative thoughts are accurate—validate when appropriate</li>
  <li>The goal is flexibility, not forced positivity</li>
  <li>Behavioral experiments often work better than verbal restructuring alone</li>
  <li>Meet clients where they are—don't push restructuring prematurely</li>
</ul>
`,

  'Behavioral Activation': `
<h2>Behavioral Activation for Depression</h2>
<p>Behavioral Activation (BA) is an evidence-based treatment for depression that focuses on increasing engagement with rewarding activities. It's based on the understanding that depression involves a cycle of withdrawal and reduced positive reinforcement.</p>

<h3>The Depression Cycle</h3>
<p>Depression creates a self-reinforcing pattern:</p>
<ol>
  <li>Low mood leads to withdrawal from activities</li>
  <li>Withdrawal reduces opportunities for pleasure and mastery</li>
  <li>Reduced reinforcement deepens depression</li>
  <li>Deeper depression increases withdrawal</li>
</ol>
<p>Behavioral activation breaks this cycle by reintroducing activity regardless of mood.</p>

<h3>Key Principles</h3>
<p><strong>Action before motivation:</strong> Don't wait to "feel like" doing something. Action often precedes motivation, not the other way around.</p>
<p><strong>Outside-in approach:</strong> Change behavior first; mood follows. This contrasts with the cognitive approach of changing thoughts first.</p>
<p><strong>Focus on values:</strong> Activities should connect to what matters to the client, not just be "pleasant."</p>

<h3>Implementation Steps</h3>
<ol>
  <li><strong>Activity monitoring:</strong> Track current activities and mood</li>
  <li><strong>Values assessment:</strong> Identify what matters to the client</li>
  <li><strong>Activity scheduling:</strong> Plan specific activities in advance</li>
  <li><strong>Graded task assignment:</strong> Break large tasks into manageable steps</li>
  <li><strong>Problem-solving barriers:</strong> Address obstacles to activation</li>
</ol>

<h3>Types of Activities</h3>
<ul>
  <li><strong>Pleasure:</strong> Activities that are enjoyable</li>
  <li><strong>Mastery:</strong> Activities that provide accomplishment</li>
  <li><strong>Values-based:</strong> Activities aligned with personal values</li>
</ul>

<h3>Common Challenges</h3>
<ul>
  <li>"I don't enjoy anything anymore" → Start small; enjoyment may follow</li>
  <li>"I don't have energy" → Schedule rest AND activity; build gradually</li>
  <li>"What's the point?" → Connect activities to values and meaning</li>
</ul>
`,

  // ===== EXPOSURE THERAPY FOR ANXIETY =====
  'Understanding Anxiety Disorders': `
<h2>Foundations of Anxiety Disorders</h2>
<p>Effective treatment of anxiety disorders requires understanding their common mechanisms. While presentations vary, anxiety disorders share core features that inform evidence-based intervention.</p>

<h3>The Nature of Anxiety</h3>
<p>Anxiety is a normal, adaptive response to perceived threat. It becomes a disorder when:</p>
<ul>
  <li>The fear is disproportionate to actual danger</li>
  <li>It persists beyond developmentally appropriate periods</li>
  <li>It causes significant distress or impairment</li>
</ul>

<h3>The Anxiety Equation</h3>
<p><strong>Anxiety = Overestimation of threat × Underestimation of coping</strong></p>
<p>Anxious individuals tend to:</p>
<ul>
  <li>Overestimate the probability of negative outcomes</li>
  <li>Overestimate the severity of negative outcomes</li>
  <li>Underestimate their ability to cope</li>
  <li>Underestimate available resources and support</li>
</ul>

<h3>The Role of Avoidance</h3>
<p>Avoidance is the central maintaining factor in anxiety disorders:</p>
<ul>
  <li>Provides immediate relief (negative reinforcement)</li>
  <li>Prevents disconfirmation of feared outcomes</li>
  <li>Maintains or strengthens fear associations</li>
  <li>Generalizes over time to more situations</li>
  <li>Erodes confidence in ability to cope</li>
</ul>

<h3>Safety Behaviors</h3>
<p>Subtle avoidance within feared situations:</p>
<ul>
  <li>Carrying medications "just in case"</li>
  <li>Sitting near exits</li>
  <li>Avoiding eye contact</li>
  <li>Excessive preparation or reassurance-seeking</li>
</ul>
<p>Safety behaviors prevent full exposure and maintain the belief that catastrophe was narrowly avoided.</p>

<h3>Common Anxiety Disorders</h3>
<ul>
  <li>Generalized Anxiety Disorder (GAD)</li>
  <li>Social Anxiety Disorder</li>
  <li>Panic Disorder with/without Agoraphobia</li>
  <li>Specific Phobias</li>
  <li>Obsessive-Compulsive Disorder (OCD)</li>
  <li>Post-Traumatic Stress Disorder (PTSD)</li>
</ul>
`,

  'Exposure Therapy Principles': `
<h2>The Science of Exposure</h2>
<p>Exposure therapy is the gold-standard treatment for anxiety disorders, with decades of research supporting its efficacy. Understanding its mechanisms helps clinicians implement it effectively.</p>

<h3>How Exposure Works</h3>
<p>Traditional models emphasized habituation—anxiety naturally decreases with prolonged exposure. Current understanding emphasizes <strong>inhibitory learning</strong>:</p>
<ul>
  <li>Exposure creates new learning that inhibits (but doesn't erase) the original fear</li>
  <li>The client learns that feared outcomes don't occur OR that they can cope</li>
  <li>This new learning competes with the original fear association</li>
</ul>

<h3>Key Principles</h3>
<p><strong>Expectancy violation:</strong> The most important element is violating what the client expected to happen.</p>
<p><strong>Variability:</strong> Vary the conditions of exposure (different times, places, states) to enhance generalization.</p>
<p><strong>Removal of safety behaviors:</strong> Safety behaviors prevent full learning; they must be eliminated.</p>
<p><strong>Deepened extinction:</strong> Combine multiple feared stimuli for enhanced learning.</p>

<h3>Types of Exposure</h3>
<ul>
  <li><strong>In vivo:</strong> Real-life exposure to feared situations</li>
  <li><strong>Imaginal:</strong> Vividly imagining feared scenarios</li>
  <li><strong>Interoceptive:</strong> Exposure to feared bodily sensations (e.g., for panic)</li>
  <li><strong>Virtual reality:</strong> Technology-assisted exposure</li>
</ul>

<h3>The Exposure Hierarchy</h3>
<p>A list of feared situations ranked from least to most anxiety-provoking (using SUDS: Subjective Units of Distress Scale, 0-100).</p>
<p>Begin with items that provoke moderate anxiety (SUDS 40-50), ensuring early success while still providing meaningful exposure.</p>

<h3>Dosing Exposure</h3>
<ul>
  <li><strong>Duration:</strong> Long enough for learning (typically 30-45+ minutes)</li>
  <li><strong>Frequency:</strong> More frequent = better outcomes (massed > spaced)</li>
  <li><strong>Intensity:</strong> Start moderate, progress upward</li>
</ul>
`,

  'Diaphragmatic Breathing': `
<h2>Diaphragmatic Breathing for Anxiety</h2>
<p>Diaphragmatic breathing activates the parasympathetic nervous system, counteracting the fight-or-flight response. It's a foundational skill for anxiety management—but must be used correctly.</p>

<h3>The Physiology</h3>
<p>Slow, deep breathing stimulates the vagus nerve, which:</p>
<ul>
  <li>Decreases heart rate</li>
  <li>Lowers blood pressure</li>
  <li>Reduces cortisol levels</li>
  <li>Activates the relaxation response</li>
</ul>

<h3>Teaching Diaphragmatic Breathing</h3>
<p><strong>Position:</strong> Sitting or lying comfortably</p>
<p><strong>Hand placement:</strong> One hand on chest, one on belly</p>
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

<h3>Important Caution</h3>
<p>Breathing techniques should NOT be used as avoidance or escape from anxiety during exposure therapy. They are a coping tool for general stress management, not a safety behavior during exposures.</p>
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
  <li>Sufficient duration (long enough for learning)</li>
  <li>Repetition (multiple trials)</li>
  <li>No safety behaviors</li>
  <li>Variability (different contexts)</li>
  <li>Expectancy violation (focusing on what was learned)</li>
</ul>
`,

  // ===== SUICIDE ASSESSMENT AND SAFETY PLANNING =====
  'Suicide: Facts and Myths': `
<h2>Understanding Suicide: Separating Fact from Fiction</h2>
<p>Effective suicide assessment begins with accurate knowledge. Many widely held beliefs about suicide are myths that can interfere with identification and intervention.</p>

<h3>Common Myths vs. Facts</h3>

<p><strong>Myth:</strong> Asking about suicide plants the idea or increases risk.<br>
<strong>Fact:</strong> Research consistently shows that asking about suicide does NOT increase risk. In fact, asking directly can provide relief and open the door to help-seeking.</p>

<p><strong>Myth:</strong> People who talk about suicide are just seeking attention.<br>
<strong>Fact:</strong> Most people who die by suicide have communicated their intent in some way. All suicide talk should be taken seriously.</p>

<p><strong>Myth:</strong> Suicide happens without warning.<br>
<strong>Fact:</strong> Most suicidal individuals give warning signs. The challenge is recognizing and responding to them.</p>

<p><strong>Myth:</strong> Once someone is suicidal, they will always be suicidal.<br>
<strong>Fact:</strong> Suicidal crises are often time-limited. With appropriate intervention, most people recover and do not go on to die by suicide.</p>

<p><strong>Myth:</strong> Only people with mental illness die by suicide.<br>
<strong>Fact:</strong> While mental illness is a risk factor, not everyone who dies by suicide has a diagnosable condition. Life circumstances, access to means, and acute stressors all play roles.</p>

<h3>Key Statistics</h3>
<ul>
  <li>Suicide is the 10th leading cause of death in the United States</li>
  <li>For every suicide death, there are approximately 25 attempts</li>
  <li>90% of people who survive a suicide attempt do not go on to die by suicide</li>
  <li>Access to lethal means is a critical risk factor</li>
</ul>

<h3>The Importance of Accurate Knowledge</h3>
<p>Clinicians who hold myths about suicide may fail to ask about it, minimize disclosures, or miss opportunities for intervention. Evidence-based practice requires replacing myths with facts.</p>
`,

  'How to Ask About Suicide': `
<h2>Directly Asking About Suicide</h2>
<p>Asking about suicide is a core clinical skill. Research shows that direct, compassionate inquiry is safe and necessary for accurate assessment.</p>

<h3>When to Ask</h3>
<p>Consider asking about suicide when clients present with:</p>
<ul>
  <li>Depression or hopelessness</li>
  <li>Recent significant losses</li>
  <li>Substance use problems</li>
  <li>History of trauma</li>
  <li>Previous suicide attempts</li>
  <li>Statements about being a burden or wanting to escape</li>
  <li>Giving away possessions</li>
  <li>Sudden calmness after a period of depression</li>
</ul>

<h3>How to Ask: A Graduated Approach</h3>
<p><strong>Step 1: Normalize and transition</strong></p>
<p>"When people are feeling as overwhelmed as you've described, they sometimes have thoughts of suicide. Has that been happening for you?"</p>

<p><strong>Step 2: Ask directly</strong></p>
<p>"Are you having thoughts of suicide?" or "Are you thinking about killing yourself?"</p>
<p>Use clear, direct language. Avoid euphemisms like "hurt yourself" which can be misunderstood.</p>

<p><strong>Step 3: Explore the thoughts</strong></p>
<ul>
  <li>Frequency: "How often do these thoughts come?"</li>
  <li>Intensity: "How strong are these thoughts?"</li>
  <li>Duration: "How long do they last?"</li>
  <li>Plan: "Have you thought about how you would do it?"</li>
  <li>Access: "Do you have access to [method]?"</li>
  <li>Intent: "Do you intend to act on these thoughts?"</li>
</ul>

<h3>Responding to Disclosure</h3>
<ul>
  <li>Stay calm and maintain connection</li>
  <li>Thank them for trusting you with this information</li>
  <li>Express concern without panic</li>
  <li>Move into collaborative safety planning</li>
</ul>

<h3>What NOT to Do</h3>
<ul>
  <li>Don't promise unconditional confidentiality</li>
  <li>Don't express shock or judgment</li>
  <li>Don't minimize ("You have so much to live for")</li>
  <li>Don't debate whether suicide is right or wrong</li>
</ul>
`,

  'Columbia Protocol (C-SSRS)': `
<h2>The Columbia Suicide Severity Rating Scale</h2>
<p>The Columbia Protocol (C-SSRS) is an evidence-based tool for assessing suicide risk. It is widely used in clinical, research, and community settings and is recommended by the FDA, CDC, and numerous professional organizations.</p>

<h3>Structure of the C-SSRS</h3>
<p>The C-SSRS assesses two main domains:</p>

<p><strong>1. Suicidal Ideation (5 types, increasing severity):</strong></p>
<ol>
  <li>Wish to be dead</li>
  <li>Non-specific active suicidal thoughts</li>
  <li>Active suicidal ideation with any methods (not plan) without intent to act</li>
  <li>Active suicidal ideation with some intent to act, without specific plan</li>
  <li>Active suicidal ideation with specific plan and intent</li>
</ol>

<p><strong>2. Suicidal Behavior (4 types):</strong></p>
<ul>
  <li>Actual attempt</li>
  <li>Interrupted attempt</li>
  <li>Aborted attempt</li>
  <li>Preparatory acts or behavior</li>
</ul>

<h3>Intensity of Ideation</h3>
<p>For the most severe ideation endorsed, assess:</p>
<ul>
  <li>Frequency</li>
  <li>Duration</li>
  <li>Controllability</li>
  <li>Deterrents</li>
  <li>Reasons for ideation</li>
</ul>

<h3>Using the C-SSRS in Practice</h3>
<ul>
  <li>Available in multiple versions (screening, baseline, since last visit)</li>
  <li>Can be administered by trained non-clinicians</li>
  <li>Takes approximately 5-10 minutes</li>
  <li>Free to use with training</li>
</ul>

<h3>Interpreting Results</h3>
<p>Higher scores on ideation and any suicidal behavior indicate higher risk. However, the C-SSRS is a tool to inform clinical judgment, not replace it. Consider results alongside other risk and protective factors.</p>

<h3>Training Requirements</h3>
<p>Free training is available at cssrs.columbia.edu. Training covers administration, scoring, and integration into clinical workflows.</p>
`,

  'Stanley-Brown Safety Planning Intervention': `
<h2>The Stanley-Brown Safety Planning Intervention</h2>
<p>The Safety Planning Intervention (SPI), developed by Barbara Stanley and Gregory Brown, is a brief, evidence-based intervention that has been shown to reduce suicide attempts and increase treatment engagement.</p>

<h3>What Is a Safety Plan?</h3>
<p>A safety plan is a prioritized, written list of coping strategies and resources that individuals can use during a suicidal crisis. It is developed collaboratively between the clinician and client.</p>

<h3>The Six Steps</h3>

<p><strong>Step 1: Warning Signs</strong></p>
<p>Identify personal warning signs that a crisis may be developing (thoughts, feelings, behaviors, situations). Example: "Isolating myself, thinking I'm a burden, drinking alone."</p>

<p><strong>Step 2: Internal Coping Strategies</strong></p>
<p>Things the person can do alone to distract from suicidal thoughts without contacting others. Example: "Go for a walk, play guitar, take a shower."</p>

<p><strong>Step 3: Social Contacts for Distraction</strong></p>
<p>People and social settings that provide distraction (not necessarily disclosing the crisis). Example: "Call my brother, go to the coffee shop."</p>

<p><strong>Step 4: People to Ask for Help</strong></p>
<p>Specific people the individual can tell they are in crisis and ask for help. Include contact information.</p>

<p><strong>Step 5: Professionals and Agencies</strong></p>
<p>Professional resources including therapist, crisis lines (988), emergency services. Include specific names and numbers.</p>

<p><strong>Step 6: Making the Environment Safe</strong></p>
<p>Reducing access to lethal means, especially the identified method. This is critical and often overlooked.</p>

<h3>Implementation Tips</h3>
<ul>
  <li>Complete collaboratively, not prescribed</li>
  <li>Be specific (names, numbers, concrete strategies)</li>
  <li>Keep it brief (fits on a wallet card)</li>
  <li>Review and update regularly</li>
  <li>Client keeps a copy; clinician documents</li>
</ul>
`,

  'Reducing Access to Lethal Means': `
<h2>Lethal Means Counseling</h2>
<p>Reducing access to lethal means is one of the most effective suicide prevention strategies. Research consistently shows that limiting access to a suicidal person's intended method saves lives.</p>

<h3>Why Means Restriction Works</h3>
<ul>
  <li>Suicidal crises are often brief and impulsive</li>
  <li>Many suicide attempts occur within minutes of the decision</li>
  <li>If the chosen method is unavailable, most people do not substitute another method</li>
  <li>90% of attempt survivors do not go on to die by suicide</li>
</ul>

<h3>The CALM Approach</h3>
<p>Counseling on Access to Lethal Means (CALM) provides a framework:</p>

<p><strong>C - Consider whether to ask about access</strong></p>
<p>Ask about means access for anyone with suicidal ideation or risk factors.</p>

<p><strong>A - Ask about access</strong></p>
<p>"Do you have access to firearms/medications/other means?" Be specific to methods they've mentioned or that are common.</p>

<p><strong>L - Listen and respond</strong></p>
<p>Understand their relationship to the means. For firearms, recognize cultural and personal significance.</p>

<p><strong>M - Make a plan to reduce access</strong></p>
<p>Collaborate on temporary restriction during the crisis period.</p>

<h3>Methods of Means Restriction</h3>

<p><strong>Firearms:</strong></p>
<ul>
  <li>Voluntary, temporary off-site storage (friend, family, gun shop, police)</li>
  <li>Gun safes with combination held by trusted person</li>
  <li>Trigger locks, cable locks</li>
  <li>Separate storage of ammunition</li>
</ul>

<p><strong>Medications:</strong></p>
<ul>
  <li>Limit quantities prescribed</li>
  <li>Trusted person holds medications</li>
  <li>Locked medication boxes</li>
  <li>Safe disposal of unused medications</li>
</ul>

<h3>Having the Conversation</h3>
<p>Approach with curiosity, not judgment. Frame as temporary, collaborative, and part of safety planning. Document the conversation and plan.</p>
`,

  'Managing Suicidal Clients': `
<h2>Ongoing Management of Suicidal Clients</h2>
<p>Managing suicidal clients extends beyond crisis intervention. Effective ongoing care requires systematic approaches, clear documentation, and attention to clinician well-being.</p>

<h3>Treatment Framework</h3>

<p><strong>Phase 1: Acute Crisis</strong></p>
<ul>
  <li>Ensure immediate safety</li>
  <li>Complete safety plan</li>
  <li>Means restriction</li>
  <li>Increase session frequency</li>
  <li>Coordinate with supports</li>
</ul>

<p><strong>Phase 2: Active Treatment</strong></p>
<ul>
  <li>Address underlying conditions (depression, trauma, substance use)</li>
  <li>Build reasons for living</li>
  <li>Develop distress tolerance skills</li>
  <li>Regular safety plan review</li>
  <li>Monitor warning signs</li>
</ul>

<p><strong>Phase 3: Maintenance</strong></p>
<ul>
  <li>Relapse prevention</li>
  <li>Update safety plans for new circumstances</li>
  <li>Gradual reduction in session frequency</li>
  <li>Clear re-entry pathway if crisis recurs</li>
</ul>

<h3>Documentation Best Practices</h3>
<ul>
  <li>Document all suicide assessments, including negative screens</li>
  <li>Record risk factors, protective factors, and clinical reasoning</li>
  <li>Note safety plan completion and updates</li>
  <li>Document means restriction conversations</li>
  <li>Record consultation with colleagues</li>
</ul>

<h3>When to Consult or Refer</h3>
<ul>
  <li>Uncertainty about level of care needed</li>
  <li>Client not improving or escalating</li>
  <li>Need for medication evaluation</li>
  <li>Countertransference interfering with care</li>
</ul>

<h3>Clinician Self-Care</h3>
<p>Working with suicidal clients takes a toll. Essential practices include regular supervision, peer support, personal therapy, and realistic expectations about outcomes.</p>
`,

  // ===== CULTURAL HUMILITY =====
  'What is Cultural Humility?': `
<h2>Cultural Humility: A Lifelong Commitment</h2>
<p>Cultural humility represents a shift from the concept of cultural competence. While competence implies a destination that can be reached, humility recognizes that learning about diverse cultures is a lifelong process.</p>

<h3>Defining Cultural Humility</h3>
<p>Tervalon and Murray-Garcia (1998) introduced cultural humility as encompassing three key dimensions:</p>
<ul>
  <li><strong>Lifelong learning and self-reflection:</strong> Continuously examining one's own cultural background and biases</li>
  <li><strong>Recognizing power imbalances:</strong> Acknowledging the inherent power differential in clinical relationships</li>
  <li><strong>Institutional accountability:</strong> Working to address systemic inequities</li>
</ul>

<h3>Cultural Humility vs. Cultural Competence</h3>
<ul>
  <li><strong>Cultural Competence:</strong> Destination / Expert stance / Knowledge acquisition / Learning about "them"</li>
  <li><strong>Cultural Humility:</strong> Journey / Learner stance / Self-reflection / Examining ourselves</li>
</ul>

<h3>The Three Pillars</h3>

<p><strong>1. Self-Awareness</strong></p>
<p>Understanding your own cultural identity, privileges, biases, and blind spots. This is ongoing work, not a one-time achievement.</p>

<p><strong>2. Respectful Partnerships</strong></p>
<p>Approaching clients as experts on their own experience. The client is the teacher about their culture; you are the learner.</p>

<p><strong>3. Systemic Advocacy</strong></p>
<p>Working to change systems that perpetuate inequity, not just individual interactions.</p>

<h3>Why Cultural Humility Matters</h3>
<p>Mental health disparities persist across racial, ethnic, and cultural groups. Cultural humility improves therapeutic alliance, treatment engagement, and outcomes for diverse populations.</p>
`,

  'Understanding Implicit Bias': `
<h2>Implicit Bias in Clinical Practice</h2>
<p>Implicit biases are unconscious attitudes or stereotypes that affect our understanding, actions, and decisions. All humans have them—the question is how we respond to that reality.</p>

<h3>What Is Implicit Bias?</h3>
<p>Implicit biases are:</p>
<ul>
  <li>Unconscious and automatic</li>
  <li>Different from explicit beliefs we consciously hold</li>
  <li>Shaped by cultural exposure and lived experience</li>
  <li>Measurable (e.g., Implicit Association Test)</li>
  <li>Changeable with awareness and effort</li>
</ul>

<h3>How Implicit Bias Affects Clinical Work</h3>
<p>Research shows implicit bias can influence:</p>
<ul>
  <li>Diagnostic decisions</li>
  <li>Treatment recommendations</li>
  <li>Pain assessment and management</li>
  <li>Perception of client credibility</li>
  <li>Therapeutic alliance quality</li>
  <li>Session dynamics and engagement</li>
</ul>

<h3>Common Examples in Mental Health</h3>
<ul>
  <li>Underdiagnosing depression in Black men</li>
  <li>Overdiagnosing psychotic disorders in people of color</li>
  <li>Attributing symptoms to culture rather than pathology (or vice versa)</li>
  <li>Assumptions about family dynamics based on ethnicity</li>
</ul>

<h3>Strategies for Addressing Implicit Bias</h3>

<p><strong>Awareness:</strong> Take the Implicit Association Test (IAT) to understand your biases</p>

<p><strong>Slow down:</strong> Implicit bias is more influential under time pressure</p>

<p><strong>Individuation:</strong> Focus on the individual, not group membership</p>

<p><strong>Counter-stereotyping:</strong> Actively seek examples that counter stereotypes</p>

<p><strong>Perspective-taking:</strong> Imagine experiences from the client's perspective</p>

<p><strong>Accountability:</strong> Seek feedback, consultation, and supervision</p>
`,

  'Intersectionality and Mental Health': `
<h2>Intersectionality in Clinical Practice</h2>
<p>Intersectionality, a term coined by Kimberlé Crenshaw, describes how multiple social identities (race, gender, class, sexuality, disability, etc.) intersect to create unique experiences of privilege and oppression.</p>

<h3>Understanding Intersectionality</h3>
<p>Key principles:</p>
<ul>
  <li>Identities do not exist in isolation—they interact and compound</li>
  <li>A Black woman's experience is not simply "Black + woman" but something unique</li>
  <li>Systems of oppression (racism, sexism, classism) are interconnected</li>
  <li>Both privilege and marginalization can coexist in one person</li>
</ul>

<h3>Clinical Relevance</h3>
<p>Intersectionality affects:</p>
<ul>
  <li><strong>Access to care:</strong> Multiple barriers compound (cost, transportation, stigma)</li>
  <li><strong>Help-seeking:</strong> Cultural messages about mental health vary</li>
  <li><strong>Presentation:</strong> Symptoms are expressed through cultural frameworks</li>
  <li><strong>Stressors:</strong> Discrimination at multiple intersections compounds stress</li>
  <li><strong>Protective factors:</strong> Community support may vary by identity</li>
</ul>

<h3>Application in Therapy</h3>

<p><strong>Assessment:</strong> Explore multiple dimensions of identity and their interactions</p>

<p><strong>Case conceptualization:</strong> Consider how intersecting identities shape the presenting problem</p>

<p><strong>Treatment planning:</strong> Address stressors related to marginalization while building on culturally-specific strengths</p>

<p><strong>Therapeutic relationship:</strong> Acknowledge identity differences and similarities between you and the client</p>

<h3>Avoiding Pitfalls</h3>
<ul>
  <li>Don't assume which identity is most salient—ask</li>
  <li>Avoid reducing clients to their identities</li>
  <li>Recognize within-group diversity</li>
  <li>Hold space for the complexity of lived experience</li>
</ul>
`,

  'Microaggressions in Therapy': `
<h2>Understanding and Addressing Microaggressions</h2>
<p>Microaggressions are brief, commonplace exchanges that communicate hostile, derogatory, or negative messages to members of marginalized groups. They can occur in therapy—including from the therapist.</p>

<h3>Types of Microaggressions</h3>

<p><strong>Microassaults:</strong> Explicit, intentional discrimination (less common in therapy settings)</p>

<p><strong>Microinsults:</strong> Subtle communications that demean a person's identity</p>
<ul>
  <li>"You're so articulate" (implying surprise)</li>
  <li>"Where are you really from?"</li>
  <li>Assuming a client's partner's gender</li>
</ul>

<p><strong>Microinvalidations:</strong> Communications that exclude or dismiss</p>
<ul>
  <li>"I don't see color"</li>
  <li>"Everyone struggles; it's not about race"</li>
  <li>Assuming a presenting problem is unrelated to discrimination</li>
</ul>

<h3>Impact on Clients</h3>
<p>Research shows microaggressions:</p>
<ul>
  <li>Damage therapeutic alliance</li>
  <li>Increase dropout from therapy</li>
  <li>Cause cumulative psychological harm</li>
  <li>Recreate dynamics from the client's broader life</li>
</ul>

<h3>When You Commit a Microaggression</h3>
<ol>
  <li>Notice (client's response, your own words)</li>
  <li>Pause and take responsibility</li>
  <li>Apologize genuinely (not defensively)</li>
  <li>Learn and change behavior</li>
  <li>Process in supervision</li>
</ol>

<h3>When Clients Report Microaggressions</h3>
<ul>
  <li>Validate the experience</li>
  <li>Explore impact without minimizing</li>
  <li>Avoid "devil's advocate" responses</li>
  <li>Support the client's response and coping</li>
  <li>Connect to systemic context when appropriate</li>
</ul>
`,

  'Culturally Responsive Therapy': `
<h2>Culturally Responsive Therapy</h2>
<p>Culturally responsive therapy adapts evidence-based practices to honor clients' cultural contexts while maintaining therapeutic effectiveness.</p>

<h3>Core Elements</h3>

<p><strong>1. Therapist Cultural Self-Awareness</strong></p>
<p>Know your own cultural background, values, and biases. Recognize how your identity affects the therapeutic relationship.</p>

<p><strong>2. Knowledge of Client's Cultural Context</strong></p>
<p>Learn about—but don't stereotype—cultural backgrounds. The client is the expert on their own experience.</p>

<p><strong>3. Culturally Appropriate Skills</strong></p>
<p>Adapt interventions, communication styles, and treatment goals to fit cultural values.</p>

<h3>Adapting Evidence-Based Practices</h3>
<p>Cultural adaptation involves modifying:</p>
<ul>
  <li><strong>Language:</strong> Translation, idioms, metaphors</li>
  <li><strong>Content:</strong> Culturally relevant examples and scenarios</li>
  <li><strong>Concepts:</strong> Frame interventions in culturally resonant terms</li>
  <li><strong>Goals:</strong> Align with cultural values (e.g., collectivism vs. individualism)</li>
  <li><strong>Methods:</strong> Include culturally appropriate practices (e.g., family involvement, spiritual resources)</li>
</ul>

<h3>Assessment Considerations</h3>
<ul>
  <li>Use culturally validated assessment tools when available</li>
  <li>Consider cultural context when interpreting results</li>
  <li>Assess cultural explanatory models of illness</li>
  <li>Evaluate acculturation and cultural identity</li>
</ul>

<h3>Building Culturally Responsive Alliance</h3>
<ul>
  <li>Address culture early and explicitly</li>
  <li>Ask about cultural identity and its importance</li>
  <li>Invite feedback about cultural fit of treatment</li>
  <li>Be willing to adapt your approach</li>
</ul>
`,

  'Working with Interpreters': `
<h2>Effective Use of Interpreters in Therapy</h2>
<p>When working with clients whose primary language differs from yours, interpreters can bridge communication gaps—but this triad relationship requires specific skills.</p>

<h3>Types of Interpretation</h3>

<p><strong>Simultaneous:</strong> Interpreter speaks at same time as speaker (used in conferences)</p>

<p><strong>Consecutive:</strong> Speaker pauses for interpretation (preferred in therapy)</p>

<p><strong>Sight translation:</strong> Written documents translated verbally</p>

<h3>Choosing an Interpreter</h3>

<p><strong>Professional interpreters (preferred):</strong></p>
<ul>
  <li>Trained in mental health terminology</li>
  <li>Bound by confidentiality</li>
  <li>Understand role boundaries</li>
</ul>

<p><strong>Avoid using:</strong></p>
<ul>
  <li>Children (role reversal, inappropriate content exposure)</li>
  <li>Family members (dual relationships, confidentiality issues)</li>
  <li>Untrained bilingual staff (accuracy and boundary concerns)</li>
</ul>

<h3>Pre-Session Briefing</h3>
<p>Before seeing the client, meet with the interpreter to discuss:</p>
<ul>
  <li>General nature of the session</li>
  <li>Your expectations for their role</li>
  <li>How to handle emotional content</li>
  <li>Confidentiality requirements</li>
  <li>Positioning in the room</li>
</ul>

<h3>During the Session</h3>
<ul>
  <li>Speak directly to the client, not the interpreter</li>
  <li>Use first person ("How are you feeling?" not "Ask her how she's feeling")</li>
  <li>Keep statements brief for accurate interpretation</li>
  <li>Avoid jargon and idioms</li>
  <li>Allow time for interpretation</li>
  <li>Watch client's nonverbal responses</li>
</ul>

<h3>Post-Session Debriefing</h3>
<p>Check in with the interpreter about cultural observations, emotional impact, and any concerns about accuracy or the process.</p>
`,

  // ===== CLINICAL DOCUMENTATION =====
  'Why Documentation Matters': `
<h2>The Importance of Clinical Documentation</h2>
<p>Documentation is often viewed as a burden, but effective documentation serves critical functions that protect clients, clinicians, and the integrity of treatment.</p>

<h3>Purposes of Documentation</h3>

<p><strong>Clinical continuity:</strong></p>
<ul>
  <li>Tracks client progress over time</li>
  <li>Informs treatment planning</li>
  <li>Facilitates care coordination</li>
  <li>Enables covering clinicians to provide appropriate care</li>
</ul>

<p><strong>Legal protection:</strong></p>
<ul>
  <li>Demonstrates standard of care</li>
  <li>Documents clinical decision-making</li>
  <li>Provides evidence if care is questioned</li>
  <li>"If it isn't documented, it didn't happen"</li>
</ul>

<p><strong>Communication:</strong></p>
<ul>
  <li>Between treatment team members</li>
  <li>To referral sources</li>
  <li>For utilization review</li>
  <li>In response to records requests</li>
</ul>

<p><strong>Reimbursement:</strong></p>
<ul>
  <li>Supports medical necessity</li>
  <li>Justifies level of care</li>
  <li>Required for insurance payment</li>
</ul>

<h3>Principles of Good Documentation</h3>
<ul>
  <li><strong>Timely:</strong> Complete notes promptly while details are fresh</li>
  <li><strong>Accurate:</strong> Reflect what actually occurred</li>
  <li><strong>Objective:</strong> Focus on observable behaviors, use client quotes</li>
  <li><strong>Relevant:</strong> Include clinically significant information</li>
  <li><strong>Concise:</strong> Avoid unnecessary detail</li>
  <li><strong>Professional:</strong> Write as if anyone might read it</li>
</ul>

<h3>The Documentation Mindset</h3>
<p>Think of documentation not as paperwork but as a clinical tool. Good notes help you think about the case and track the work over time.</p>
`,

  'Writing Progress Notes - SOAP Format': `
<h2>The SOAP Format for Progress Notes</h2>
<p>SOAP notes provide a structured format that organizes clinical information consistently and comprehensively.</p>

<h3>S - Subjective</h3>
<p>What the client reports—their perspective, symptoms, concerns.</p>
<ul>
  <li>Chief complaint or focus of session</li>
  <li>Client's reported symptoms, mood, experiences</li>
  <li>Direct quotes when illustrative</li>
  <li>Progress on homework or between-session events</li>
</ul>
<p><em>Example: "Client reports feeling 'more hopeful' this week. States she used coping skills during a conflict with her mother and 'it actually worked.' Denies SI/HI."</em></p>

<h3>O - Objective</h3>
<p>What you observe—factual, behavioral, measurable.</p>
<ul>
  <li>Appearance, behavior, affect</li>
  <li>Mental status observations</li>
  <li>Assessment scores if administered</li>
  <li>Interventions used in session</li>
</ul>
<p><em>Example: "Client was casually dressed and well-groomed. Affect was brighter than previous sessions, with congruent mood. Engaged actively in cognitive restructuring exercise."</em></p>

<h3>A - Assessment</h3>
<p>Your clinical interpretation and judgment.</p>
<ul>
  <li>Progress toward treatment goals</li>
  <li>Current functioning and risk level</li>
  <li>Clinical impressions</li>
  <li>Changes to diagnosis if applicable</li>
</ul>
<p><em>Example: "Client demonstrates improved distress tolerance and is meeting treatment goals. Risk remains low. Depression symptoms decreasing."</em></p>

<h3>P - Plan</h3>
<p>What happens next.</p>
<ul>
  <li>Next session date/frequency</li>
  <li>Homework assignments</li>
  <li>Treatment plan updates</li>
  <li>Referrals or coordination needed</li>
</ul>
<p><em>Example: "Continue weekly sessions. Client will practice STOPP technique daily. Will reassess PHQ-9 next session. Continue current treatment plan."</em></p>
`,

  'Effective Treatment Planning': `
<h2>Creating Effective Treatment Plans</h2>
<p>A treatment plan is a roadmap for therapy—documenting what you're treating, how you're treating it, and how you'll know when you're done.</p>

<h3>Components of a Treatment Plan</h3>

<p><strong>1. Problem List</strong></p>
<p>Specific, behaviorally-defined problems that will be addressed in treatment. Link to diagnosis when applicable.</p>
<p><em>Example: "Depressed mood with associated sleep disturbance, anhedonia, and difficulty concentrating, impacting work performance."</em></p>

<p><strong>2. Goals</strong></p>
<p>Broad statements of desired outcomes. Should reflect client's priorities.</p>
<p><em>Example: "Reduce depression symptoms and improve daily functioning."</em></p>

<p><strong>3. Objectives</strong></p>
<p>SMART objectives: Specific, Measurable, Achievable, Relevant, Time-bound</p>
<p><em>Example: "Client will report PHQ-9 score below 10 within 12 weeks."</em></p>
<p><em>"Client will return to sleeping 7 hours/night within 8 weeks."</em></p>

<p><strong>4. Interventions</strong></p>
<p>Specific therapeutic techniques you will use.</p>
<p><em>Example: "Cognitive restructuring for negative automatic thoughts. Behavioral activation to increase pleasant activities. Sleep hygiene psychoeducation."</em></p>

<h3>Best Practices</h3>
<ul>
  <li>Develop collaboratively with the client</li>
  <li>Use the client's language when possible</li>
  <li>Review and update regularly (typically every 90 days)</li>
  <li>Document progress toward objectives in session notes</li>
  <li>Adjust when goals are met or treatment needs change</li>
</ul>

<h3>Common Pitfalls</h3>
<ul>
  <li>Vague goals ("Feel better")</li>
  <li>Unmeasurable objectives</li>
  <li>Plans that don't match what you actually do in sessions</li>
  <li>Failing to update when circumstances change</li>
</ul>
`,

  'Documenting Suicidal Ideation': `
<h2>Documentation for Suicidal Clients</h2>
<p>When working with suicidal clients, documentation is especially critical. Thorough records protect clients by ensuring continuity of care and protect clinicians by demonstrating sound clinical decision-making.</p>

<h3>What to Document</h3>

<p><strong>Risk Assessment:</strong></p>
<ul>
  <li>Method of assessment (interview, standardized tool)</li>
  <li>Specific risk factors present</li>
  <li>Protective factors identified</li>
  <li>Ideation (frequency, intensity, duration, plan, intent, access to means)</li>
  <li>History of attempts</li>
  <li>Current stressors</li>
</ul>

<p><strong>Clinical Decision-Making:</strong></p>
<ul>
  <li>Your assessment of risk level (low, moderate, high)</li>
  <li>Rationale for your conclusions</li>
  <li>Consultation obtained (with whom, their input)</li>
  <li>Options considered and why chosen/rejected</li>
</ul>

<p><strong>Interventions:</strong></p>
<ul>
  <li>Safety plan completed (include copy in record)</li>
  <li>Means restriction discussion and outcome</li>
  <li>Crisis resources provided</li>
  <li>Contacts made (family, supports, other providers)</li>
  <li>Level of care decisions and rationale</li>
</ul>

<h3>Sample Documentation Language</h3>
<p><em>"Conducted suicide risk assessment. Client endorsed passive SI without plan or intent. Denied history of attempts. Protective factors include supportive spouse, religious beliefs against suicide, and future-oriented thinking regarding daughter's graduation. C-SSRS score indicates low-moderate risk. Collaboratively developed safety plan (copy in chart). Discussed means restriction; client agreed to have spouse secure medications. Client contracted to use safety plan if thoughts intensify and to attend scheduled session Thursday. No hospitalization indicated at this time. Will reassess at next session. Consulted with Dr. Smith who concurred with outpatient management."</em></p>

<h3>Key Principles</h3>
<ul>
  <li>Document every contact with a suicidal client</li>
  <li>Show your clinical reasoning, not just conclusions</li>
  <li>Document even when client denies SI ("denies SI/HI")</li>
  <li>Update safety plans in writing</li>
</ul>
`,

  'Reducing Documentation Burden': `
<h2>Efficient Documentation Strategies</h2>
<p>Documentation burden is a leading cause of clinician burnout. Developing efficient practices preserves clinical quality while reducing time spent on paperwork.</p>

<h3>Time Management Strategies</h3>

<p><strong>Write notes immediately:</strong></p>
<ul>
  <li>Complete notes between sessions when possible</li>
  <li>Details fade quickly—waiting increases time needed</li>
  <li>Build in 10 minutes between sessions for documentation</li>
</ul>

<p><strong>Use templates wisely:</strong></p>
<ul>
  <li>Create templates for common note types</li>
  <li>Customize for each client rather than starting blank</li>
  <li>But avoid cookie-cutter notes that don't reflect the individual</li>
</ul>

<p><strong>Dictation and voice-to-text:</strong></p>
<ul>
  <li>Speaking is faster than typing for many clinicians</li>
  <li>Review for accuracy before signing</li>
</ul>

<h3>Writing Efficiently</h3>

<p><strong>Focus on what matters:</strong></p>
<ul>
  <li>Include clinically significant information</li>
  <li>Skip redundant details</li>
  <li>Reference rather than repeat (e.g., "Safety plan reviewed—no changes")</li>
</ul>

<p><strong>Use concise language:</strong></p>
<ul>
  <li>Avoid filler phrases</li>
  <li>Use standard abbreviations appropriately</li>
  <li>Write in phrases, not complete sentences when appropriate</li>
</ul>

<p><strong>Know your requirements:</strong></p>
<ul>
  <li>Understand what payers and regulators actually require</li>
  <li>Don't over-document beyond what's needed</li>
  <li>Different note types have different requirements</li>
</ul>

<h3>Batch Processing</h3>
<p>If notes must be completed later, dedicate protected time blocks rather than fragmenting documentation throughout the day.</p>

<h3>Signs of Problem Documentation Practices</h3>
<ul>
  <li>Regularly completing notes days later</li>
  <li>Copy-forwarding without meaningful updates</li>
  <li>Spending more than 10-15 minutes per progress note</li>
  <li>Dreading documentation</li>
</ul>
`,

  'Psychotherapy Notes Under HIPAA': `
<h2>Psychotherapy Notes: Special Protections Under HIPAA</h2>
<p>HIPAA provides special protection for "psychotherapy notes"—but this term has a specific legal meaning that is often misunderstood.</p>

<h3>What ARE Psychotherapy Notes?</h3>
<p>Under HIPAA, psychotherapy notes are defined as notes that:</p>
<ul>
  <li>Document or analyze the contents of conversation during counseling sessions</li>
  <li>Are separated from the rest of the medical record</li>
  <li>Are kept by the clinician for their own use</li>
</ul>

<p>They typically include:</p>
<ul>
  <li>Therapist's impressions, hypotheses, and observations</li>
  <li>Process notes about the therapeutic relationship</li>
  <li>Details of therapeutic conversations</li>
</ul>

<h3>What are NOT Psychotherapy Notes?</h3>
<p>These are part of the regular medical record (not specially protected):</p>
<ul>
  <li>Medication management and prescription records</li>
  <li>Session start/stop times</li>
  <li>Treatment modalities and frequencies</li>
  <li>Results of clinical tests</li>
  <li>Diagnosis, functional status, treatment plan</li>
  <li>Symptoms, prognosis, progress</li>
  <li>Standard progress notes (including SOAP notes)</li>
</ul>

<h3>Special Protections</h3>
<p>Psychotherapy notes (properly defined) require separate authorization for release and cannot be disclosed:</p>
<ul>
  <li>For treatment purposes without authorization</li>
  <li>For payment or healthcare operations without authorization</li>
  <li>Most other HIPAA exceptions don't apply</li>
</ul>

<h3>Practical Implications</h3>
<ul>
  <li>If you keep psychotherapy notes, store them separately</li>
  <li>Your regular progress notes are NOT psychotherapy notes under HIPAA</li>
  <li>Most clinicians don't keep separate psychotherapy notes</li>
  <li>When records are subpoenaed, psychotherapy notes may be protectable</li>
</ul>

<h3>State Laws May Differ</h3>
<p>Some states have additional protections for mental health records beyond HIPAA. Know your state's requirements.</p>
`,

  // ===== NAVIGATING ETHICAL DILEMMAS =====
  'Ethics vs. Law in Therapy': `
<h2>When Ethics and Law Diverge</h2>
<p>Ethical practice and legal compliance usually align, but not always. Understanding the relationship between ethics and law helps clinicians navigate complex situations.</p>

<h3>The Relationship Between Ethics and Law</h3>

<p><strong>Four possible scenarios:</strong></p>
<ol>
  <li><strong>Ethical AND Legal:</strong> Most clinical situations (treat competently, maintain confidentiality)</li>
  <li><strong>Ethical but Illegal:</strong> Rare, but possible (e.g., civil disobedience situations)</li>
  <li><strong>Legal but Unethical:</strong> Law permits but ethics prohibit (e.g., some dual relationships)</li>
  <li><strong>Unethical AND Illegal:</strong> Clear violations (e.g., sexual contact with clients)</li>
</ol>

<h3>Key Distinctions</h3>

<p><strong>Laws:</strong></p>
<ul>
  <li>Set minimum standards</li>
  <li>Enforced by government</li>
  <li>Consequences include fines, imprisonment</li>
  <li>Vary by jurisdiction</li>
</ul>

<p><strong>Ethics:</strong></p>
<ul>
  <li>Often exceed legal requirements</li>
  <li>Enforced by professional bodies</li>
  <li>Consequences include sanctions, license revocation</li>
  <li>Vary by profession</li>
</ul>

<h3>When They Conflict</h3>
<p>General guidance when ethics and law conflict:</p>
<ul>
  <li>Ethics codes acknowledge conflicts may occur</li>
  <li>Make known your commitment to ethics</li>
  <li>Work to resolve the conflict responsibly</li>
  <li>Document your reasoning and actions</li>
  <li>Consult with colleagues, ethics boards, attorneys</li>
</ul>

<h3>Aspirational vs. Mandatory Standards</h3>
<p>Ethics codes contain both:</p>
<ul>
  <li><strong>Mandatory standards:</strong> Minimum requirements ("Counselors shall...")</li>
  <li><strong>Aspirational principles:</strong> Ideals to strive for ("Counselors aspire to...")</li>
</ul>
<p>When facing dilemmas, both inform decision-making.</p>
`,

  'Systematic Decision-Making': `
<h2>Ethical Decision-Making Models</h2>
<p>When facing ethical dilemmas, systematic approaches lead to better outcomes than intuition alone. Multiple models exist; the key is using a consistent process.</p>

<h3>A Practical Decision-Making Framework</h3>

<p><strong>Step 1: Identify the problem</strong></p>
<ul>
  <li>What is the ethical question or dilemma?</li>
  <li>Who are the stakeholders affected?</li>
  <li>What values or principles are in tension?</li>
</ul>

<p><strong>Step 2: Consult resources</strong></p>
<ul>
  <li>Professional ethics codes (ACA, APA, NASW, AAMFT)</li>
  <li>State licensing board regulations</li>
  <li>Relevant laws (HIPAA, state statutes)</li>
  <li>Agency policies</li>
  <li>Professional literature</li>
</ul>

<p><strong>Step 3: Consider possible courses of action</strong></p>
<ul>
  <li>Generate multiple options, not just two</li>
  <li>Include "do nothing" as an option to evaluate</li>
  <li>Be creative—there may be solutions you haven't considered</li>
</ul>

<p><strong>Step 4: Evaluate options</strong></p>
<p>For each option, consider:</p>
<ul>
  <li>Consequences for all stakeholders</li>
  <li>Consistency with ethical principles</li>
  <li>Legal implications</li>
  <li>Would you be comfortable if this decision were public?</li>
</ul>

<p><strong>Step 5: Consult</strong></p>
<ul>
  <li>Supervisors, colleagues, ethics committees</li>
  <li>Professional liability insurance carrier</li>
  <li>Document consultation obtained</li>
</ul>

<p><strong>Step 6: Decide and act</strong></p>
<p>Choose the best course of action based on your analysis.</p>

<p><strong>Step 7: Document and evaluate</strong></p>
<p>Record your reasoning and the outcome. Reflect on what you learned.</p>
`,

  'Confidentiality and Its Limits': `
<h2>Confidentiality: Foundations and Exceptions</h2>
<p>Confidentiality is foundational to therapeutic work—but it is not absolute. Understanding both the rule and its exceptions is essential for ethical practice.</p>

<h3>Why Confidentiality Matters</h3>
<ul>
  <li>Creates safety for disclosure</li>
  <li>Essential for therapeutic alliance</li>
  <li>Protects client dignity and autonomy</li>
  <li>Required by ethics codes and law</li>
</ul>

<h3>Legal Protections</h3>
<ul>
  <li><strong>HIPAA:</strong> Federal floor for privacy protection</li>
  <li><strong>State laws:</strong> May provide additional protections</li>
  <li><strong>Privileged communication:</strong> Protection in legal proceedings (varies by state and profession)</li>
</ul>

<h3>Exceptions to Confidentiality</h3>

<p><strong>Mandated reporting:</strong></p>
<ul>
  <li>Child abuse/neglect (all states)</li>
  <li>Elder/vulnerable adult abuse (most states)</li>
  <li>Requirements vary by state—know yours</li>
</ul>

<p><strong>Duty to warn/protect:</strong></p>
<ul>
  <li>When client poses imminent danger to identifiable third party</li>
  <li>Varies significantly by state (duty vs. permission)</li>
  <li>May include duty to warn, duty to protect, or both</li>
</ul>

<p><strong>Client consent:</strong></p>
<ul>
  <li>Properly authorized releases</li>
  <li>Must be informed, voluntary, competent</li>
</ul>

<p><strong>Court orders:</strong></p>
<ul>
  <li>Valid subpoenas (consult before complying)</li>
  <li>Court-ordered evaluations</li>
</ul>

<p><strong>Other exceptions:</strong></p>
<ul>
  <li>Billing/insurance (minimum necessary)</li>
  <li>Supervision and consultation</li>
  <li>Emergencies</li>
</ul>

<h3>Informed Consent About Confidentiality</h3>
<p>At the outset of treatment, explain both the protection and its limits. Documentation should reflect this discussion.</p>
`,

  'Managing Boundaries in Therapy': `
<h2>Professional Boundaries in Clinical Practice</h2>
<p>Boundaries define the frame of the therapeutic relationship—protecting both clients and clinicians while creating conditions for effective treatment.</p>

<h3>Types of Boundaries</h3>

<p><strong>Role boundaries:</strong> Maintaining the therapist role vs. friend, advisor, rescuer</p>

<p><strong>Time boundaries:</strong> Session length, availability, punctuality</p>

<p><strong>Location boundaries:</strong> Where therapy occurs</p>

<p><strong>Physical boundaries:</strong> Touch, personal space</p>

<p><strong>Self-disclosure boundaries:</strong> What personal information to share</p>

<p><strong>Financial boundaries:</strong> Fees, gifts, bartering</p>

<p><strong>Digital boundaries:</strong> Social media, email, texting</p>

<h3>Boundary Crossings vs. Violations</h3>

<p><strong>Boundary crossing:</strong> A departure from standard practice that may or may not be harmful. May be therapeutic in some contexts.</p>

<p><strong>Boundary violation:</strong> A departure that harms or exploits the client. Always unethical.</p>

<p><em>Example: Attending a client's graduation (crossing) vs. dating a client (violation)</em></p>

<h3>Slippery Slope</h3>
<p>Boundary violations rarely happen suddenly. Watch for progressive erosion:</p>
<ul>
  <li>Small crossings become routine</li>
  <li>Special treatment for certain clients</li>
  <li>Keeping secrets from supervisors</li>
  <li>Increased self-disclosure</li>
  <li>Extending sessions without clinical rationale</li>
</ul>

<h3>Dual Relationships</h3>
<p>When clinician has another relationship with client (teacher, friend, business partner):</p>
<ul>
  <li>Some are always prohibited (sexual, exploitative)</li>
  <li>Some are unavoidable (small communities, specialized populations)</li>
  <li>Key: Will it impair objectivity or harm the client?</li>
</ul>

<h3>Navigating Boundary Decisions</h3>
<ul>
  <li>Whose needs are being met?</li>
  <li>Would I do this with all clients?</li>
  <li>How would I feel if a colleague knew?</li>
  <li>What would happen if this became known publicly?</li>
</ul>
`,

  'Navigating Conflicts': `
<h2>Managing Ethical Conflicts and Complaints</h2>
<p>Even careful clinicians encounter conflicts, disagreements, and occasionally complaints. Handling these situations well protects clients and careers.</p>

<h3>Types of Conflicts</h3>

<p><strong>With clients:</strong></p>
<ul>
  <li>Disagreements about treatment approach</li>
  <li>Ruptures in therapeutic alliance</li>
  <li>Boundary issues raised by client</li>
  <li>Fee disputes</li>
</ul>

<p><strong>With colleagues:</strong></p>
<ul>
  <li>Disagreements about client care</li>
  <li>Concerns about colleague's ethics</li>
  <li>Turf issues and referrals</li>
</ul>

<p><strong>With systems:</strong></p>
<ul>
  <li>Insurance company denials</li>
  <li>Agency policies that conflict with ethics</li>
  <li>Court or legal system demands</li>
</ul>

<h3>When You Observe Colleague Misconduct</h3>
<p>Ethics codes require action when colleague conduct harms clients:</p>
<ol>
  <li>First, try informal resolution when appropriate</li>
  <li>If unresolved or serious, report to licensing board or ethics committee</li>
  <li>Document your observations and actions</li>
  <li>Do not ignore serious violations</li>
</ol>

<h3>Responding to Complaints Against You</h3>
<ul>
  <li>Notify your malpractice carrier immediately</li>
  <li>Do not contact the complainant</li>
  <li>Do not alter records</li>
  <li>Gather documentation</li>
  <li>Respond thoughtfully and thoroughly</li>
  <li>Cooperate with the investigation</li>
  <li>Seek support—complaints are stressful</li>
</ul>

<h3>Prevention</h3>
<ul>
  <li>Clear informed consent</li>
  <li>Thorough documentation</li>
  <li>Regular consultation</li>
  <li>Attention to boundaries</li>
  <li>Address ruptures when they occur</li>
  <li>Professional liability insurance</li>
</ul>
`,

  'Self-Care as Ethical Obligation': `
<h2>Self-Care: An Ethical Imperative</h2>
<p>Self-care isn't just good advice—it's an ethical obligation. Impaired clinicians cannot provide competent care, making attention to our own wellbeing essential to ethical practice.</p>

<h3>The Ethics Code Mandate</h3>
<p>The ACA Code of Ethics states clinicians must "monitor themselves for signs of impairment" and "refrain from offering or providing professional services when their physical, mental, or emotional problems are likely to harm a client or others."</p>

<h3>Impairment vs. Distress</h3>
<p><strong>Distress:</strong> Normal response to challenging work; manageable; doesn't significantly impair function</p>
<p><strong>Impairment:</strong> Functioning is significantly compromised; affects quality of care; requires intervention</p>

<h3>Warning Signs of Impairment</h3>
<ul>
  <li>Chronic fatigue or exhaustion</li>
  <li>Boundary violations or near-misses</li>
  <li>Increased errors, missed appointments</li>
  <li>Cynicism about clients or the work</li>
  <li>Isolation from colleagues</li>
  <li>Substance use changes</li>
  <li>Personal relationships deteriorating</li>
  <li>Physical health problems ignored</li>
</ul>

<h3>Self-Care Domains</h3>

<p><strong>Physical:</strong> Sleep, exercise, nutrition, medical care</p>
<p><strong>Emotional:</strong> Personal therapy, support systems, processing difficult work</p>
<p><strong>Professional:</strong> Supervision, consultation, continuing education, manageable caseload</p>
<p><strong>Relational:</strong> Meaningful connections outside work</p>
<p><strong>Spiritual/Meaning:</strong> Connection to purpose, values, larger meaning</p>

<h3>When Impairment Occurs</h3>
<ul>
  <li>Acknowledge the problem</li>
  <li>Seek appropriate help (therapy, treatment programs)</li>
  <li>Reduce caseload or take leave if needed</li>
  <li>Consult with colleagues or licensing board</li>
  <li>Most boards have diversion programs to support recovery</li>
</ul>

<h3>Building Sustainable Practice</h3>
<p>Self-care isn't something to do after burnout—it's how you prevent it. Build sustainable practices from the beginning of your career.</p>
`,

  // ===== TELEHEALTH BEST PRACTICES =====
  'Introduction to Telehealth Therapy': `
<h2>Foundations of Telehealth Practice</h2>
<p>Telehealth has transformed from an occasional alternative to a mainstream modality. Understanding its foundations prepares clinicians for effective virtual practice.</p>

<h3>Defining Telehealth</h3>
<p>Telehealth encompasses:</p>
<ul>
  <li><strong>Synchronous:</strong> Real-time video sessions (most common for therapy)</li>
  <li><strong>Asynchronous:</strong> Store-and-forward communications (messaging, email)</li>
  <li><strong>Remote monitoring:</strong> Apps, wearables tracking symptoms</li>
  <li><strong>Mobile health (mHealth):</strong> Health apps and tools</li>
</ul>

<h3>Benefits of Telehealth</h3>
<ul>
  <li>Increased access (rural, mobility-limited, busy schedules)</li>
  <li>Reduced barriers (transportation, childcare, stigma)</li>
  <li>Continuity during disruptions (weather, illness, travel)</li>
  <li>Comfort of home environment for some clients</li>
  <li>Observation of client's natural environment</li>
</ul>

<h3>Limitations and Considerations</h3>
<ul>
  <li>Technology barriers for some populations</li>
  <li>Privacy concerns in shared living spaces</li>
  <li>Reduced nonverbal cues</li>
  <li>Crisis management complexity</li>
  <li>Not appropriate for all clients or conditions</li>
</ul>

<h3>Research Support</h3>
<p>Evidence supports telehealth effectiveness for:</p>
<ul>
  <li>Depression and anxiety (comparable to in-person)</li>
  <li>PTSD (including evidence-based treatments like CPT, PE)</li>
  <li>Substance use disorders</li>
  <li>Many other conditions</li>
</ul>
<p>Therapeutic alliance can be established effectively via video.</p>

<h3>Professional Competence</h3>
<p>Telehealth requires specific competencies beyond clinical skill:</p>
<ul>
  <li>Technology proficiency</li>
  <li>Adapted clinical skills for virtual environment</li>
  <li>Knowledge of relevant laws and ethics</li>
  <li>Crisis protocols for remote situations</li>
</ul>
`,

  'Setting Up for Telehealth Sessions': `
<h2>Technical and Environmental Setup</h2>
<p>Professional telehealth requires attention to technology, environment, and backup plans. Proper setup enables smooth sessions and models professionalism.</p>

<h3>Technology Requirements</h3>

<p><strong>Platform:</strong></p>
<ul>
  <li>HIPAA-compliant with Business Associate Agreement (BAA)</li>
  <li>Encrypted, secure connection</li>
  <li>Features: waiting room, screen share, virtual backgrounds</li>
  <li>Common options: Doxy.me, SimplePractice, Zoom for Healthcare, Thera-LINK</li>
</ul>

<p><strong>Hardware:</strong></p>
<ul>
  <li>Computer with camera (laptop or external webcam)</li>
  <li>Quality microphone (built-in may be sufficient; external improves quality)</li>
  <li>Reliable internet (minimum 10 Mbps; wired connection preferred)</li>
  <li>Phone as backup communication method</li>
</ul>

<h3>Environment Setup</h3>

<p><strong>Lighting:</strong></p>
<ul>
  <li>Light source in front of you, not behind</li>
  <li>Avoid harsh shadows or backlighting</li>
  <li>Natural light is ideal; ring lights work well</li>
</ul>

<p><strong>Background:</strong></p>
<ul>
  <li>Professional, uncluttered space</li>
  <li>Neutral or appropriate virtual background</li>
  <li>Remove distracting or unprofessional items</li>
</ul>

<p><strong>Audio:</strong></p>
<ul>
  <li>Quiet, private space</li>
  <li>Sound machine outside door if needed</li>
  <li>Close windows, silence phones</li>
</ul>

<p><strong>Camera position:</strong></p>
<ul>
  <li>Eye level (use books to raise laptop if needed)</li>
  <li>Framing: head and shoulders visible</li>
  <li>Close enough to see facial expressions</li>
</ul>

<h3>Client Preparation</h3>
<p>Send clients instructions covering:</p>
<ul>
  <li>How to access the platform</li>
  <li>Technical requirements</li>
  <li>Environmental recommendations (private space, charged device)</li>
  <li>What to do if connection fails</li>
</ul>
`,

  'Building Rapport Online': `
<h2>Establishing Therapeutic Alliance Virtually</h2>
<p>Building rapport through a screen requires intentional adaptation of in-person skills. Research shows strong alliance is achievable in telehealth with deliberate attention.</p>

<h3>Adapting Nonverbal Communication</h3>

<p><strong>Eye contact:</strong></p>
<ul>
  <li>Look at the camera, not the screen, for "eye contact"</li>
  <li>This feels unnatural—practice helps</li>
  <li>Balance camera gaze with observing the client</li>
</ul>

<p><strong>Facial expressions:</strong></p>
<ul>
  <li>May need to be slightly exaggerated for the camera</li>
  <li>Nod and smile more visibly</li>
  <li>Your face is what the client sees most</li>
</ul>

<p><strong>Gestures:</strong></p>
<ul>
  <li>Stay in frame when gesturing</li>
  <li>Hand gestures can emphasize warmth</li>
</ul>

<h3>Verbal Adaptations</h3>

<p><strong>Increased verbal feedback:</strong></p>
<ul>
  <li>More "mm-hmm," "yes," "I see"</li>
  <li>Summarize and reflect more frequently</li>
  <li>Compensate for reduced nonverbal cues</li>
</ul>

<p><strong>Pace:</strong></p>
<ul>
  <li>Slightly slower to account for lag</li>
  <li>Pause before responding</li>
  <li>Check for understanding more often</li>
</ul>

<h3>Addressing the Medium Directly</h3>
<ul>
  <li>Acknowledge the virtual format</li>
  <li>"How is it to meet this way?"</li>
  <li>Normalize any awkwardness</li>
  <li>Invite feedback about the experience</li>
</ul>

<h3>Managing Technology Disruptions</h3>
<p>When glitches occur:</p>
<ul>
  <li>Stay calm and model patience</li>
  <li>Have a clear protocol ("If we disconnect, I'll call you")</li>
  <li>Process the disruption therapeutically if relevant</li>
</ul>

<h3>Creating Connection</h3>
<ul>
  <li>Begin with brief check-in about the technology/environment</li>
  <li>End with clear plan for next session</li>
  <li>Consider "warm" touches (commenting on background, asking about their space)</li>
</ul>
`,

  'Adapting Therapy for Telehealth': `
<h2>Clinical Adaptations for Virtual Practice</h2>
<p>Evidence-based therapies can be effectively delivered via telehealth with appropriate adaptations. The core therapeutic elements remain; the delivery methods adjust.</p>

<h3>Assessment Considerations</h3>
<ul>
  <li>Standard assessment tools work in telehealth</li>
  <li>Can use screen share for visual materials</li>
  <li>Mental status exam requires verbal inquiry about what you can't observe</li>
  <li>Note environmental observations (client's space, who else is present)</li>
</ul>

<h3>Adapting Common Modalities</h3>

<p><strong>CBT:</strong></p>
<ul>
  <li>Screen share for thought records, worksheets</li>
  <li>Collaborative document editing</li>
  <li>Assign digital homework via patient portal</li>
  <li>Virtual whiteboard for diagrams</li>
</ul>

<p><strong>Exposure therapy:</strong></p>
<ul>
  <li>In-vivo exposure can happen in client's environment</li>
  <li>Virtual reality exposure options</li>
  <li>Imaginal exposure works well via video</li>
  <li>Some exposures easier to coach remotely</li>
</ul>

<p><strong>Mindfulness/relaxation:</strong></p>
<ul>
  <li>Guide practices with client in comfortable home setting</li>
  <li>Client may feel safer practicing at home</li>
  <li>Can incorporate client's environment (grounding with objects at hand)</li>
</ul>

<h3>Working with Children and Families</h3>
<ul>
  <li>Shorter sessions may be needed</li>
  <li>Engage parents in setup and support</li>
  <li>Interactive tools, games, drawing apps</li>
  <li>Movement breaks built into session</li>
</ul>

<h3>Group Therapy Adaptations</h3>
<ul>
  <li>Establish clear norms for virtual participation</li>
  <li>Gallery view to see all participants</li>
  <li>Use chat, reactions, breakout rooms</li>
  <li>Structured turn-taking may be helpful</li>
</ul>

<h3>Documentation</h3>
<ul>
  <li>Note modality (telehealth, video)</li>
  <li>Document client location each session</li>
  <li>Note anyone else present in client's space</li>
  <li>Record any technical issues</li>
</ul>
`,

  'Crisis Management in Telehealth': `
<h2>Managing Crises in Virtual Sessions</h2>
<p>Crisis situations require additional planning in telehealth because you cannot physically intervene. Preparation and clear protocols are essential.</p>

<h3>Pre-Session Preparation</h3>

<p><strong>Every session, confirm:</strong></p>
<ul>
  <li>Client's physical location (address)</li>
  <li>Local emergency resources for that location</li>
  <li>Emergency contact information</li>
  <li>Phone number to reach client if disconnected</li>
</ul>

<p><strong>In your files, maintain:</strong></p>
<ul>
  <li>Emergency protocol document</li>
  <li>Local crisis line numbers for client's area</li>
  <li>Nearest emergency room to client</li>
  <li>Contact information for client's supports</li>
</ul>

<h3>Warning Signs in Telehealth</h3>
<p>Watch for:</p>
<ul>
  <li>Client appears intoxicated or altered</li>
  <li>Visible weapons or dangerous items</li>
  <li>Signs of self-harm on camera</li>
  <li>Statements of intent to harm self or others</li>
  <li>Third party enters who appears threatening</li>
  <li>Client becomes unresponsive</li>
</ul>

<h3>During a Crisis</h3>
<ol>
  <li>Stay calm; your presence is stabilizing</li>
  <li>Assess safety using standard protocols</li>
  <li>Keep the video connection if possible</li>
  <li>If needed, call emergency services to client's location</li>
  <li>Stay on the line until help arrives if possible</li>
  <li>Contact emergency contact as appropriate</li>
</ol>

<h3>When to Decline Telehealth</h3>
<p>Consider in-person or higher level of care when:</p>
<ul>
  <li>Active suicidality with plan/intent/access</li>
  <li>Acute psychosis or severe dissociation</li>
  <li>Unable to establish safe environment</li>
  <li>Technology barriers prevent reliable connection</li>
  <li>Crisis services in client's area are inadequate</li>
</ul>

<h3>Post-Crisis Documentation</h3>
<p>Document thoroughly: what occurred, your assessment, interventions, outcome, and follow-up plan.</p>
`,

  'Legal and Ethical Issues in Telehealth': `
<h2>Legal and Ethical Considerations</h2>
<p>Telehealth introduces specific legal and ethical considerations that extend beyond in-person practice. Staying current with evolving regulations is essential.</p>

<h3>Licensure and Jurisdiction</h3>

<p><strong>The fundamental rule:</strong> You must be licensed where the CLIENT is located, not where you are.</p>

<ul>
  <li>Verify client's location each session</li>
  <li>Understand requirements for each state where clients reside</li>
  <li>Interstate compacts (PSYPACT, ASWB Mobility) may allow practice across states</li>
  <li>Some states have temporary practice provisions</li>
</ul>

<h3>Informed Consent for Telehealth</h3>
<p>Telehealth-specific consent should address:</p>
<ul>
  <li>Description of telehealth and how it differs from in-person</li>
  <li>Potential benefits and risks of telehealth</li>
  <li>Confidentiality in the digital environment</li>
  <li>Technology requirements and responsibilities</li>
  <li>Emergency procedures when not in the same location</li>
  <li>Policies for technical failure</li>
  <li>Recording policy (if any)</li>
  <li>Alternatives to telehealth</li>
</ul>

<h3>HIPAA and Technology</h3>
<ul>
  <li>Use only HIPAA-compliant platforms with BAA</li>
  <li>Ensure encrypted connections</li>
  <li>Avoid consumer-grade tools (regular Zoom, FaceTime, Skype) for clinical sessions</li>
  <li>Secure your own network and devices</li>
  <li>Have policies for data security, device loss</li>
</ul>

<h3>Documentation Requirements</h3>
<p>In addition to standard documentation:</p>
<ul>
  <li>Modality used (video, phone)</li>
  <li>Client location at time of session</li>
  <li>Verification of identity (especially initial sessions)</li>
  <li>Anyone else present in client's space</li>
  <li>Technical issues that occurred</li>
</ul>

<h3>Staying Current</h3>
<p>Telehealth regulations continue to evolve. Monitor:</p>
<ul>
  <li>Your state licensing board</li>
  <li>Professional associations</li>
  <li>CMS/Medicare rules if applicable</li>
  <li>Payer-specific requirements</li>
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
