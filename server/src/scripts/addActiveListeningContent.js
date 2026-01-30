/**
 * ADD CONTENT - Expanded lessons for Active Listening
 * Target: 6000+ words total for 1 CE ACEP compliance
 * Current: ~2094 words | Need: ~4000 more
 * 
 * Run: node src/scripts/addActiveListeningContent.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const lessonDefaults = {
  type: 'text',
  isFree: false,
  allowMultipleOpen: true,
  matchingInstructions: "Drag each term to its matching definition",
  imagePosition: "left",
  highlight: false,
  shuffleQuestions: false,
  shuffleOptions: false,
  showExplanations: true,
  passThreshold: 0.8,
  resources: [],
  accordionItems: [],
  matchingPairs: [],
  questions: [],
  options: []
};

// LESSON 1: Cultural Considerations (~1400 words)
const culturalLesson = {
  ...lessonDefaults,
  title: 'Cultural Considerations in Active Listening',
  order: 2,
  content: `# Cultural Considerations in Active Listening

Effective active listening requires cultural humility and awareness. What communicates presence and engagement in one cultural context may convey disrespect or discomfort in another. This lesson explores key cultural considerations for clinicians working with diverse populations.

## The Foundation of Cultural Humility

Cultural humility differs from cultural competence. While competence implies mastery, humility acknowledges that we can never fully understand another person's cultural experience. Cultural humility involves lifelong learning and self-reflection, recognizing power imbalances in the therapeutic relationship, understanding how systems perpetuate cultural bias, and positioning the client as the expert on their own cultural experience.

Every clinician brings cultural assumptions about what constitutes good communication. These assumptions are often invisible because they feel natural and universal. However, our communication norms are culturally constructed, and imposing them on clients from different backgrounds can damage the therapeutic relationship before it begins.

## Eye Contact Across Cultures

The SOLER framework emphasizes eye contact, but direct gaze carries vastly different meanings across cultures.

Western European and mainstream American contexts often interpret direct eye contact as confidence, honesty, and engagement. Lack of eye contact may be misread as evasiveness, disinterest, or even deception. Clinicians trained in these contexts may unconsciously evaluate clients negatively based on these culturally specific norms.

Many Asian cultures consider prolonged direct eye contact with authority figures or elders to be disrespectful or challenging. A Chinese, Japanese, Korean, or Vietnamese client may avert their gaze as a sign of respect for your expertise, not as resistance or disengagement. In some contexts, looking down while being spoken to demonstrates attentiveness and deference. Pushing for more eye contact could feel invasive or shaming to these clients.

Some Indigenous and First Nations communities view direct eye contact as aggressive or intrusive, particularly with strangers or in initial meetings. Extended eye contact may be reserved for intimate relationships or may carry spiritual significance. For many Native American clients, listening happens through presence and attention, not through locked gazes.

Many African and Caribbean cultures have nuanced rules about eye contact based on age, gender, and social status. Younger people may avoid eye contact with elders out of respect. Gender dynamics may also influence appropriate gaze behavior in complex ways that vary by specific cultural background.

Middle Eastern cultures vary significantly, but many maintain strong eye contact in conversation as a sign of sincerity and trustworthiness. However, gender dynamics may limit cross-gender eye contact, particularly in more traditional communities.

Clinical Implication: Rather than assuming a client who averts their gaze is resistant, dissociating, or being dishonest, approach with curiosity. You might say, "I want to make sure you're comfortable. Some people prefer more or less eye contact—what works best for you?" This communicates respect while gathering important information about the client's preferences.

## Silence and Pause Across Cultures

Western therapeutic models often interpret silence as resistance, discomfort, or therapeutic stuck points requiring intervention. Many clinicians feel compelled to fill silence quickly. However, silence holds profoundly different meanings across cultures.

Many Native American and Indigenous traditions value silence as a sign of respect and thoughtfulness. Silence allows for deep consideration of what has been said. Words are considered powerful and not to be used carelessly. Rushing to fill silence may communicate disrespect, impatience, or superficiality. Some traditions consider silence sacred—a space where healing can occur.

Some Asian cultures use silence to process information thoroughly before responding. Quick responses may be seen as superficial, disrespectful, or indicative of not taking the matter seriously. In Japanese culture, the concept of ma refers to meaningful pause or negative space—silence that is full rather than empty. Clients from these backgrounds may need significantly more time than you expect before speaking.

Certain African cultures incorporate contemplative silence as part of meaningful conversation. Silence may indicate the weight and importance of what is being discussed, not disengagement from it.

Finnish and some Scandinavian cultures are comfortable with extended silences in conversation, viewing constant talk as unnecessary or even superficial. What feels like awkward silence to an American clinician may feel perfectly natural to a Finnish client.

Clinical Implication: Extend your tolerance for silence when working cross-culturally. Practice sitting with silence for longer than feels comfortable. If uncertain, you might gently inquire: "I notice we've been quiet for a moment. I want to give you whatever time you need—is this silence helpful for you, or would you like me to say something?"

## Emotional Expression and Display Rules

Active listening involves attending to emotional cues, but cultures have dramatically different display rules governing emotional expression.

Individualistic cultures, common in Western contexts and particularly the United States, often encourage open emotional expression as healthy, authentic, and necessary for psychological well-being. Therapy in these contexts may push for emotional catharsis and view emotional restraint as unhealthy repression requiring intervention.

Collectivistic cultures, common in Asia, Latin America, Africa, and the Middle East, may value emotional restraint, particularly regarding negative emotions, to maintain group harmony, protect family honor, and avoid burdening others. What Western clinicians might label as restricted affect or emotional avoidance may actually reflect deeply held cultural values around composure, dignity, and consideration for others.

Gender expectations around emotional expression vary significantly across cultures and interact with ethnic background in complex ways. Men in many cultures face stronger prohibitions against expressing vulnerability, sadness, or fear. Women may face expectations to suppress anger or direct assertiveness. These cultural expectations shape what clients feel permission to express in therapy.

Specific emotions carry different cultural meanings. In some cultures, expressing anger directly is acceptable and even expected; in others, it represents a serious loss of face or threatens social harmony. Grief may be expressed through wailing and public display in some cultures and through stoic silence in others—both representing genuine, deep mourning.

Clinical Implication: Avoid pathologizing emotional restraint or assuming that cathartic emotional expression is universally therapeutic. A client who presents with flat affect may be adhering to deeply held cultural values rather than experiencing depression, dissociation, or disconnection. Ask about cultural expectations: "In your family or community, how do people typically express feelings like this?"

## Physical Space, Touch, and Proximity

Attending behaviors include physical positioning, but comfort with proximity and touch varies dramatically across cultural contexts.

Latin American, Middle Eastern, and Southern European cultures often prefer closer conversational distances than Northern European or mainstream American norms. What feels comfortable, warm, and connected to a Colombian or Italian client might feel invasive to a Swedish or Japanese client—and vice versa.

Many Asian cultures maintain larger personal space bubbles, particularly with strangers, authority figures, or in professional contexts. The standard therapy room setup may need adjustment for these clients.

Touch norms vary enormously across cultures. A supportive hand on the shoulder may be welcomed in some cultures and considered an inappropriate boundary violation in others. Touch between clinician and client of different genders is prohibited or highly restricted in some cultural and religious contexts. Even handshakes may be unwelcome.

Clinical Implication: Be attentive to clients' nonverbal cues about space. If they lean back, angle away, or seem tense when you move closer, they likely need more distance. Some clients may feel more comfortable with a desk or table between you. When in doubt, ask directly about preferences rather than assuming.

## High-Context and Low-Context Communication

Anthropologist Edward Hall distinguished between high-context and low-context communication styles, which profoundly affect how active listening must be adapted.

High-context cultures, common in Asia, the Middle East, Latin America, and Africa, rely heavily on implicit communication, nonverbal cues, shared understanding, and contextual factors. Meaning is embedded in the relationship and situation, not just the words spoken. Indirect communication may be preferred to avoid confrontation or preserve face. What is not said may be as important as what is said.

Low-context cultures, common in Northern Europe, mainstream America, and Australia, favor explicit, direct verbal communication. Meaning is primarily in the words themselves. Say what you mean is valued, and circumlocution may be viewed negatively.

A high-context communicator may find direct questions intrusive, simplistic, or rude. They may communicate important information through implication, metaphor, or story rather than direct statement. A low-context listener may miss these cues entirely and push for explicitness that feels uncomfortable or disrespectful.

A low-context communicator may find indirect communication frustrating, evasive, or confusing. They may interpret circumlocution as resistance or avoidance when it is actually culturally appropriate communication.

Clinical Implication: With high-context communicators, pay extra attention to what is not being said, to metaphors and stories, to shifts in tone or topic. Do not push for explicit statements that may feel inappropriate. With low-context communicators, do not assume hidden meanings—ask directly if something is unclear. Adapt your own communication style to match the client's preferences.

## Developing Cultural Humility in Practice

Cultural competence is not a destination but an ongoing practice requiring continuous attention.

First, recognize your own cultural lens. Your assumptions about good communication are culturally shaped. What feels natural to you may feel foreign or even offensive to clients from different backgrounds.

Second, avoid stereotyping. Culture influences but does not determine individual preferences. Not all members of any group conform to cultural generalizations. Treat each client as an individual whose cultural background is one factor among many.

Third, ask rather than assume. Clients are the experts on their own experience. Questions like "What is important for me to understand about your background?" or "How do people in your family typically handle situations like this?" demonstrate respect and gather crucial information.

Fourth, seek ongoing education. Attend trainings, read literature on multicultural counseling, consult with colleagues from diverse backgrounds, and learn from your clients themselves.

Fifth, repair ruptures. When you make cultural missteps—and you will—acknowledge them directly, apologize genuinely, and demonstrate learning: "I think I may have made an assumption that did not fit for you. Can you help me understand better?"

The goal is not to memorize rules for every culture but to approach each client with curiosity, humility, and genuine willingness to adapt your style to their needs.`
};

// LESSON 2: Clinical Case Studies (~1500 words)
const caseStudiesLesson = {
  ...lessonDefaults,
  title: 'Clinical Case Studies in Active Listening',
  order: 3,
  content: `# Clinical Case Studies in Active Listening

These case studies illustrate active listening principles in action across various clinical scenarios. As you read each case, consider what the clinician did well, what alternatives might also have been effective, and how you might handle similar situations in your own practice.

## Case Study 1: The Reluctant Mandated Client

Background: Marcus, a 34-year-old man, was mandated to counseling after a DUI. This is his first session. He sits with arms crossed, giving one-word answers, avoiding eye contact.

Session Dialogue:

Clinician: "I notice you don't seem particularly excited to be here."

Marcus: "Would you be? I have to be here or I go to jail."

Clinician: (Leaning back slightly, speaking calmly) "That sounds frustrating—being forced to do something you did not choose."

Marcus: (Slight pause) "Yeah. Everyone keeps telling me I have a problem. I made one mistake."

Clinician: "One mistake, and suddenly everyone is an expert on your life. That would make me want to shut down too."

Marcus: (Uncrosses arms slightly) "Exactly. My wife acts like I am some alcoholic. I go out with the guys once a week."

Clinician: "It sounds like you are feeling judged by people close to you—labeled in a way that does not fit how you see yourself."

Marcus: "I mean... yeah. She will not even look at me the same anymore."

Clinician: "That distance from your wife, on top of the legal situation... there is a lot weighing on you right now."

Marcus: (Makes eye contact for the first time) "Nobody asked me how I felt about any of this."

Analysis: The clinician demonstrated several key active listening skills. First, they used reflection of feeling throughout, naming emotions like frustration, feeling judged, and the weight Marcus is carrying. Second, they validated Marcus's experience without agreeing or disagreeing about whether he has a problem. Third, they matched Marcus's energy by leaning back rather than leaning in aggressively, communicating safety.

Notice what the clinician did not do. They did not defend the mandate or explain why it is for his own good. They did not challenge his minimization of the DUI or educate him about alcoholism. They did not push an assessment agenda or ask diagnostic questions.

By not pushing an agenda, the clinician created space for Marcus to begin opening up. The resistance decreased as Marcus felt heard rather than judged. The therapeutic relationship established through this listening will create the foundation for later exploration of his drinking patterns—but that exploration would have been impossible without first establishing that Marcus is heard.

Key Skills Demonstrated: Reflection of feeling, validation without agreement, matching client energy, patience

## Case Study 2: The Verbose Tangential Client

Background: Patricia, 58, fills every moment with detailed stories about her week, her family, her neighbors—rarely pausing for breath. She has been in therapy for three months with minimal progress, and previous clinicians have noted difficulty redirecting her.

Session Dialogue:

Patricia: "...and then my sister called, and you know how she is, she always has something to complain about, her husband this, her kids that, and I told her, I said, Linda, you need to stop focusing on everyone else's problems, but does she listen? No, because she has always been like that, ever since we were kids, and Mom used to say Linda was the dramatic one and I was the responsible one, and speaking of our mother, her birthday is coming up next month and I do not know what to get her, she is impossible to shop for—"

Clinician: (Gently interrupting) "Patricia, let me pause you for a moment. I am hearing a lot about Linda and your mother. I am curious—what is it like for you when Linda calls with these complaints?"

Patricia: (Stops, looks confused) "What do you mean?"

Clinician: "When the phone rings and you see it is Linda—what happens in your body? What do you notice before you even answer?"

Patricia: (Long pause—perhaps the first of the session) "Honestly? My stomach tightens. I love her, but... I feel drained. Like she sucks the energy right out of me."

Clinician: "Drained. Like there is nothing left for you after these calls."

Patricia: (Quietly, with tears forming) "Nobody ever asks about me. It is always about them."

Clinician: "You have spent your whole life being the responsible one who listens to everyone else. And somewhere along the way, you stopped getting listened to yourself."

Patricia: (Crying softly) "I do not even know what I would say if someone asked."

Analysis: The clinician redirected from external storytelling to internal experience using several techniques.

First, they used a gentle interruption with explicit rationale, saying let me pause you rather than simply interrupting. This respects Patricia while creating necessary structure.

Second, they used a somatic question asking what happens in your body, which bypasses intellectualization and accesses emotional experience more directly.

Third, they stayed with Patricia's experience rather than her sister's or mother's, consistently reflecting Patricia's feelings.

Patricia's verbosity likely serves a defensive function—keeping the focus on others to avoid her own pain. The clinician's intervention opened a door to deeper material that had never been accessed despite months of therapy.

Key Skills Demonstrated: Purposeful interruption, somatic questioning, summarizing to redirect, reflection of feeling, staying with client's experience

## Case Study 3: The Highly Emotional Client

Background: David, 42, sought therapy after his father's death three weeks ago. He has been stoic throughout the session, discussing funeral arrangements matter-of-factly, when suddenly his composure breaks.

Session Dialogue:

David: (Voice cracking, tears beginning) "I am sorry, I do not know why I am crying. We were not even that close."

Clinician: (Speaking softly, leaning forward slightly) "There is nothing to apologize for. Grief does not follow rules."

David: (Crying harder) "I keep thinking about all the things I never said. All those years we did not talk."

Clinician: (Remains silent, hands David tissues without comment, maintains soft eye contact, breathes slowly and steadily)

Two full minutes pass with David crying. The clinician stays present, breathing steadily, not looking away, not speaking.

David: (Breathing beginning to slow) "I never told him I forgave him. For leaving when I was a kid."

Clinician: "You carry regret along with the grief. So much left unfinished."

David: (Nods slowly) "I thought I had more time. Everyone thinks they have more time."

Clinician: "And now you are sitting with the weight of words that never got said, time that ran out."

Analysis: The clinician demonstrated several critical skills for working with intense emotion.

They normalized the tears without trying to stop them by saying grief does not follow rules rather than it is okay or do not cry.

They offered practical support by passing tissues without commentary that would interrupt the emotional flow.

They tolerated extended silence—two full minutes—while David cried, communicating that this space can hold his pain.

They maintained regulated presence through steady breathing and soft eye contact, providing co-regulation for David's activated nervous system.

They waited for David to speak first after the tears subsided rather than rushing to fill the space.

They reflected both content and affect in their eventual responses.

Notice what the clinician did not do. They did not rush to soothe with statements like he knew you loved him. They did not offer reassurance about the afterlife or closure. They did not fill the silence with questions. They did not become visibly distressed alongside David. They did not redirect to something less painful.

Key Skills Demonstrated: Therapeutic silence, normalizing emotion, co-regulation, nonverbal presence, restraint

## Case Study 4: When Active Listening Fails

Background: Sarah, 29, is describing ongoing conflict with her highly critical mother.

Problematic Dialogue:

Sarah: "She just criticizes everything I do. My apartment, my job, my boyfriend—nothing is ever good enough."

Clinician: "Have you tried setting boundaries with her?"

Sarah: "I mean, I guess, but—"

Clinician: "Boundaries are really important in relationships like this. Maybe you could try telling her how her criticism affects you using I-statements."

Sarah: (Flat tone) "Yeah. Maybe."

Clinician: "Would you like to practice what you might say to her?"

Sarah: "Sure, I guess."

Analysis: The clinician jumped immediately to problem-solving before Sarah felt fully heard. The advice about boundaries and I-statements, while potentially useful, was premature and generic. Sarah's flat responses—yeah maybe and sure I guess—signal disengagement. She did not feel understood, so she is going through the motions. She may now be less likely to share openly.

Improved Dialogue:

Sarah: "She just criticizes everything I do. My apartment, my job, my boyfriend—nothing is ever good enough."

Clinician: "Criticism from all directions—your home, your work, your relationship. That must be exhausting."

Sarah: "It is exhausting. Nothing I do is good enough for her. It has been like this my whole life."

Clinician: "Your whole life. You have been waiting a long time for approval that does not come."

Sarah: (Tears forming) "I just want her to be proud of me. Just once."

Clinician: "There is such longing in that. And such pain when it is not met."

Analysis of Improved Version: By staying with Sarah's experience before offering solutions, the clinician uncovered deeper material—the lifelong pattern of seeking maternal approval, the exhaustion of never being good enough, the profound longing and grief underneath the surface complaint. This material is far more therapeutically rich than a discussion of boundary-setting techniques would have been.

Key Lesson: Understanding before intervention. The urge to help can interfere with helping.

## Reflection Questions

As you consider these cases, reflect on your own practice:

Which scenario most resembles clients you find challenging? What pulls you away from active listening with those clients?

What is your default response when clients become emotional? Do you tend to soothe, analyze, or stay present?

How do you manage your impulse to give advice or solve problems?

Think of a time you felt truly heard by someone. What specifically did they do?

When has advice-giving interfered with connection in your clinical work?`
};

// LESSON 3: Self-Assessment (~1100 words)
const selfAssessmentLesson = {
  ...lessonDefaults,
  title: 'Self-Assessment and Professional Development',
  order: 4,
  content: `# Self-Assessment and Professional Development

Active listening is a skill that requires ongoing cultivation throughout your career. Even experienced clinicians can develop blind spots, fall into habitual patterns, or find their skills eroding under the pressures of heavy caseloads and demanding work. This lesson provides tools for honest self-assessment and structured professional development.

## Active Listening Self-Assessment Inventory

Rate yourself honestly on each item using the following scale: 1 equals rarely or never, 2 equals occasionally, 3 equals sometimes, 4 equals often, and 5 equals consistently.

Section A covers Attending Behaviors. Rate yourself on maintaining appropriate eye contact adapted to each client's comfort level and cultural context. Rate yourself on communicating openness and engagement through your body posture throughout sessions. Rate yourself on minimizing environmental distractions including silencing your phone, closing your door, and putting away your computer. Rate yourself on noticing when your attention wanders and consciously redirecting it back to the client. Rate yourself on adapting your physical positioning based on client cues and cultural considerations.

Section B covers Verbal Listening Skills. Rate yourself on using minimal encouragers naturally without overusing them. Rate yourself on paraphrasing in ways that capture the essence of meaning without simply repeating the client's words. Rate yourself on reflecting feelings, not just content. Rate yourself on asking open-ended questions that invite exploration rather than closed questions that limit responses. Rate yourself on summarizing periodically to help clients see patterns and to check your understanding.

Section C covers Advanced Skills. Rate yourself on tolerating extended silence without rushing to fill it. Rate yourself on remaining grounded when clients become highly emotional. Rate yourself on noticing and managing your own reactions when clients trigger your personal history. Rate yourself on adapting your listening approach for different cultural contexts. Rate yourself on recognizing when your impulse to help is actually interfering with helping.

Section D covers Professional Habits. Rate yourself on actively seeking feedback on your listening skills in supervision. Rate yourself on continuing to learn about active listening through reading, training, or consultation. Rate yourself on practicing self-care to maintain the energy required for deep listening. Rate yourself on reflecting on your sessions to identify patterns and areas for improvement. Rate yourself on repairing ruptures when you recognize your listening has failed a client.

To interpret your score, add up your total across all twenty items. A score of 80 to 100 indicates strong active listening skills. Focus on refinement, teaching others, and handling the most complex clinical situations. A score of 60 to 79 indicates a solid foundation with room for growth. Identify two or three specific areas for focused improvement over the next six months. A score of 40 to 59 indicates developing skills that need consistent attention. Consider additional training, more frequent supervision focused on skills, and possibly recording sessions for review. A score below 40 indicates significant growth opportunity. Prioritize skill development through intensive training, weekly supervision focused specifically on listening skills, and personal therapy to address any barriers to presence.

## Creating a Focused Development Plan

Based on your self-assessment, create a structured plan for growth that will actually produce change.

Step one is to choose your focus. Select one or two specific skills to develop rather than trying to improve everything at once. Focused practice builds mastery while scattered effort builds frustration. If you scored low on reflecting feelings, make that your focus. If you struggle with silence, practice extending your tolerance deliberately.

Step two is to set observable goals. Vague goals like be a better listener do not create change. Instead, set specific, observable goals such as: I will use reflection of feeling at least three times in each session, or I will wait a full three seconds before responding to any client statement, or I will summarize every ten to fifteen minutes in session.

Step three is to create accountability structures. Change requires support and accountability. Share your goal with your supervisor and ask them to observe for it. Ask a trusted colleague to sit in on a session and provide specific feedback. Record sessions with proper consent for self-review. Keep a brief journal after sessions noting moments of success and struggle. Set calendar reminders to check in with yourself on progress.

Step four is to review and adjust. Every month, honestly assess your progress. Ask yourself what is improving, what is still difficult, whether the goal needs adjustment, and what support you need that you are not getting.

## The Role of Personal Therapy

Many training programs require personal therapy for trainees, and there are compelling reasons to continue or return to therapy throughout your career.

Personal therapy provides lived experience of what it is like to be the client—to be listened to well, and to notice acutely when you are not being heard. This experiential learning cannot be replicated through reading or training alone.

Personal therapy surfaces your own material so you can recognize when personal triggers, unresolved issues, or emotional reactions are interfering with your ability to listen openly. You cannot fully attend to a client's pain about parental rejection if your own parental wounds are actively bleeding.

Your therapist models skills that you can learn from—both effective techniques to emulate and less effective approaches to avoid. You experience the impact of interventions from the client's side.

Personal therapy supports your well-being so you have the emotional capacity to be present with clients' suffering without depleting yourself. Compassion fatigue erodes listening capacity, while self-care restores it.

If you are not currently in personal therapy, consider whether engaging in your own treatment might support your professional development at this stage of your career.

## Supervision as a Listening Laboratory

Supervision is not just case consultation—it is an opportunity to develop foundational skills including active listening.

Bring recordings when possible. If your setting allows with proper consent and security, recording sessions provides invaluable material for supervision. Your supervisor can observe your actual listening behaviors rather than relying on your self-report, which is inevitably biased.

Role-play challenging moments. When you describe a difficult interaction, ask your supervisor to role-play the client so you can practice alternative responses in real time.

Discuss your internal reactions. What were you thinking and feeling during key moments? These reactions are data for understanding your patterns and growing as a clinician.

Ask for specific feedback. Do not just ask how am I doing. Ask targeted questions such as did you notice me jumping to solutions, or how was my reflection of feeling in that segment.

Notice how your supervisor listens to you. Good supervision models good listening. Pay attention to what your supervisor does that helps you feel heard—and apply it with your own clients.

## Signs of Growth

How do you know your active listening is improving? Client indicators include clients opening up more readily with less prompting, clients going deeper into emotional material, clients correcting you less often when you paraphrase because your understanding is more accurate, clients explicitly expressing feeling understood, and therapeutic alliance strengthening as measured by client report or formal assessment.

Self indicators include feeling more present and less distracted during sessions, noticing more nuance in client communication such as tone shifts, hesitations, and contradictions, feeling less anxious about silence or intense emotion, catching yourself before falling into habitual patterns like premature advice-giving, and sessions feeling more collaborative and less like you are working hard alone.

## A Career-Long Commitment

Active listening is not a skill you master once and then possess forever. It requires continual attention, practice, and refinement throughout your career. The pressures of practice—heavy caseloads, administrative burden, vicarious trauma, life stressors—can erode even well-developed skills over time.

The best clinicians remain students of listening throughout their careers, always curious about how they can more fully understand the human beings who trust them with their stories. They seek feedback, engage in ongoing training, reflect on their practice, and recognize that mastery is a direction, not a destination.

Your commitment to completing this course reflects your dedication to professional excellence. Carry that commitment forward into daily practice, and return to these principles whenever you find yourself losing your way. The foundation of all effective therapy is a client who feels heard. Your ongoing development of active listening skills is perhaps the most important investment you can make in your clinical effectiveness and in the wellbeing of the people you serve.`
};

async function addContent() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database\n');

  const db = mongoose.connection.db;
  const coursesCollection = db.collection('courses');

  const course = await coursesCollection.findOne({ slug: 'active-listening-skills' });
  if (!course) {
    console.log('ERROR: Course not found!');
    process.exit(1);
  }

  console.log('Found:', course.title);
  
  // Count current words
  let currentWords = 0;
  course.modules.forEach(m => {
    m.lessons.forEach(l => {
      currentWords += l.content ? l.content.split(/\s+/).length : 0;
    });
  });
  console.log('Current word count:', currentWords);

  // Calculate new words
  const lesson1Words = culturalLesson.content.split(/\s+/).length;
  const lesson2Words = caseStudiesLesson.content.split(/\s+/).length;
  const lesson3Words = selfAssessmentLesson.content.split(/\s+/).length;
  const totalNew = lesson1Words + lesson2Words + lesson3Words;
  const projected = currentWords + totalNew;
  
  console.log('\nNew content:');
  console.log('  Cultural Considerations:', lesson1Words, 'words');
  console.log('  Case Studies:', lesson2Words, 'words');
  console.log('  Self-Assessment:', lesson3Words, 'words');
  console.log('  TOTAL NEW:', totalNew, 'words');
  console.log('\nProjected total:', projected, 'words');
  console.log('ACEP minimum (6000):', projected >= 6000 ? '✅ MET' : '❌ SHORT BY ' + (6000 - projected));

  // Update
  const result = await coursesCollection.updateOne(
    { slug: 'active-listening-skills' },
    {
      $push: {
        'modules.1.lessons': {
          $each: [culturalLesson, caseStudiesLesson, selfAssessmentLesson]
        }
      },
      $set: { totalContentBlocks: 7 }
    }
  );

  console.log('\n✅ UPDATE:', result.modifiedCount ? 'SUCCESS' : 'NO CHANGE');

  // Verify
  const updated = await coursesCollection.findOne({ slug: 'active-listening-skills' });
  let finalWords = 0;
  let lessonCount = 0;
  updated.modules.forEach((m, i) => {
    console.log('\nModule', i + 1, ':', m.title);
    m.lessons.forEach((l, j) => {
      const w = l.content ? l.content.split(/\s+/).length : 0;
      console.log('  Lesson', j + 1, ':', l.title, '-', w, 'words');
      finalWords += w;
      lessonCount++;
    });
  });
  
  console.log('\n========================================');
  console.log('FINAL:', finalWords, 'words across', lessonCount, 'lessons');
  console.log('ACEP 6000 minimum:', finalWords >= 6000 ? '✅ COMPLIANT' : '❌ NON-COMPLIANT');
  console.log('========================================');

  await mongoose.disconnect();
}

addContent().catch(console.error);
