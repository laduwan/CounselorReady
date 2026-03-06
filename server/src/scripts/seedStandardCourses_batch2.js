/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// seedStandardCourses_batch2.js
// Run with: node src/data/seedStandardCourses_batch2.js
// Courses: Trauma Foundations, Suicide Assessment, Psychopharmacology for Counselors
// Full text-based content

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const courses = [
  // ============================================
  // COURSE: Trauma Foundations (3 CEU - Clinical)
  // ============================================
  {
    slug: 'trauma-informed-care-foundations',
    title: 'Foundations of Trauma-Informed Care: Assessment and Stabilization',
    subtitle: 'Learn trauma\'s impact on the brain, conduct sensitive assessments, and implement stabilization techniques',
    description: 'Trauma affects the majority of clients seeking mental health services. This comprehensive 3-hour course provides foundational knowledge for working with trauma survivors, including understanding trauma\'s impact on the brain and body, conducting sensitive assessments, establishing safety, and implementing stabilization techniques before any processing work begins.',
    thumbnail: '/images/courses/trauma-foundations.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Define trauma and differentiate between acute, chronic, and complex trauma',
      'Explain the neurobiological impact of trauma on the brain and nervous system',
      'Describe the window of tolerance and its clinical implications',
      'Conduct trauma-sensitive assessments that minimize retraumatization',
      'Apply SAMHSA\'s six principles of trauma-informed care',
      'Implement grounding and stabilization techniques with traumatized clients',
      'Recognize signs of dissociation and respond appropriately',
      'Establish safety and containment before trauma processing'
    ],
    modules: [
      {
        title: 'Understanding Trauma',
        order: 1,
        lessons: [
          {
            title: 'What is Trauma?',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>What is Trauma?</h2>

<p>Trauma is not defined by the event itself but by the individual's subjective experience of that event. The Substance Abuse and Mental Health Services Administration (SAMHSA) defines trauma as resulting from "an event, series of events, or set of circumstances that is experienced by an individual as physically or emotionally harmful or life threatening and that has lasting adverse effects on the individual's functioning and mental, physical, social, emotional, or spiritual well-being." This definition emphasizes several critical points: trauma is experiential (two people can experience the same event with vastly different outcomes), it involves perceived threat (the person believed they or someone else was in danger), and it has lasting effects (the impact persists beyond the event itself).</p>

<p>The distinction between a stressful event and a traumatic event lies in the nervous system's response. Stressful events activate the stress response, which resolves when the stressor ends. Traumatic events overwhelm the nervous system's capacity to process and integrate the experience, leaving the person stuck in a state of threat response even after the danger has passed. This is why trauma survivors may react to benign triggers as though they are still in danger — neurologically, their system has not registered that the threat is over.</p>

<h2>Types of Trauma</h2>

<p><strong>Acute trauma</strong> results from a single overwhelming event — a car accident, assault, natural disaster, or sudden loss. The event has a clear beginning and end, though its psychological effects may persist long afterward. Acute trauma is often what people picture when they hear the word "trauma," but it represents only one category of traumatic experience.</p>

<p><strong>Chronic trauma</strong> involves repeated or prolonged exposure to traumatic circumstances — ongoing domestic violence, extended combat deployment, living in a war zone, or chronic childhood abuse. The cumulative effect of repeated trauma often produces more severe and complex presentations than single-incident trauma. The nervous system never has the opportunity to return to baseline between events, leading to pervasive dysregulation.</p>

<p><strong>Complex trauma</strong> (sometimes called developmental trauma when it occurs in childhood) results from exposure to multiple traumatic events, typically of an interpersonal nature, often beginning early in life and occurring within caregiving relationships. A child who experiences ongoing abuse or neglect from a caregiver faces a devastating double bind: the person who should provide safety is the source of danger. Complex trauma profoundly affects identity development, attachment patterns, emotional regulation, and the capacity for relationships. It is associated with a broader and more treatment-resistant symptom picture than single-incident trauma.</p>

<p><strong>Secondary or vicarious trauma</strong> affects individuals who are exposed to others' traumatic material — therapists, first responders, medical personnel, journalists covering war or disaster, and family members of trauma survivors. The cumulative impact of bearing witness to others' trauma can produce symptoms similar to direct trauma exposure. Clinicians working with trauma populations must attend to their own secondary trauma exposure as a matter of professional sustainability and ethical practice.</p>

<h2>Prevalence and Clinical Implications</h2>

<p>Trauma is not rare. Population studies consistently find that the majority of adults have experienced at least one potentially traumatic event in their lifetime, with estimates ranging from 60% to 90% depending on how trauma is defined and measured. Adverse Childhood Experiences (ACE) research demonstrates that childhood trauma is particularly common: approximately two-thirds of adults report at least one ACE, and one in six report four or more. The ACE studies further demonstrate a dose-response relationship between childhood adversity and adult health outcomes — more ACEs predict higher rates of mental illness, substance use, chronic disease, and early death.</p>

<p>For clinicians, these prevalence rates carry an important implication: trauma-informed care is not a specialty but a foundational competency. Regardless of your clinical setting or identified specialty, you are almost certainly working with trauma survivors, whether or not trauma is the presenting problem. A client seeking treatment for depression may have an extensive trauma history that shapes their symptom presentation and treatment response. A client in substance use treatment may be using substances to manage unprocessed trauma. A client with relationship difficulties may be reenacting attachment wounds from childhood trauma. Trauma-informed practice means assuming the presence of trauma and adapting your approach accordingly, rather than waiting for trauma to be explicitly disclosed.</p>`
          }
        ]
      },
      {
        title: 'Neurobiology of Trauma',
        order: 2,
        lessons: [
          {
            title: 'How Trauma Affects the Brain and Body',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>How Trauma Affects the Brain and Body</h2>

<p>Understanding the neurobiology of trauma transforms clinical practice. When clinicians understand what is happening in the brain and nervous system of a traumatized client, behaviors that might otherwise seem baffling, frustrating, or even manipulative become comprehensible as predictable neurobiological responses to overwhelming stress. This understanding also guides intervention — we cannot talk someone out of a neurobiological state, but we can use body-based and relational interventions to shift the nervous system toward regulation.</p>

<h2>The Stress Response System</h2>

<p>The human stress response system evolved to protect us from danger. When the brain perceives a threat, the amygdala — a small, almond-shaped structure deep in the brain — initiates a cascade of neurochemical events that prepare the body for survival. The hypothalamic-pituitary-adrenal (HPA) axis releases stress hormones including cortisol and adrenaline. Heart rate increases, breathing becomes rapid and shallow, blood flow shifts from the digestive and reproductive systems to large muscle groups, and the immune system activates inflammatory responses. This is the fight-or-flight response that has allowed humans to survive predators, conflicts, and environmental dangers throughout our evolutionary history.</p>

<p>When the threat passes, the parasympathetic nervous system — specifically the vagus nerve — activates to restore equilibrium. Heart rate slows, breathing deepens, digestion resumes, and the body returns to a state of rest and repair. This return to baseline is called recovery, and it is essential for healthy functioning. The stress response is designed to be acute and time-limited, not chronic.</p>

<p>Trauma disrupts this natural recovery process. When an experience is overwhelming — when the threat is too intense, too prolonged, or occurs when the person is too young or helpless to respond effectively — the stress response becomes dysregulated. The nervous system may remain stuck in a state of chronic hyperarousal (as though the threat is ongoing) or may collapse into hypoarousal (shutdown). In either case, the natural oscillation between activation and recovery is disrupted.</p>

<h2>Brain Structures Affected by Trauma</h2>

<p>Neuroimaging research has identified consistent patterns of brain change in individuals with trauma histories. The <strong>prefrontal cortex</strong>, responsible for executive functions including reasoning, planning, impulse control, and emotional regulation, shows decreased activity in traumatized individuals. This helps explain why trauma survivors often struggle with decision-making, emotional control, and thinking clearly under stress — the brain region responsible for these functions is literally offline.</p>

<p>The <strong>amygdala</strong>, the brain's threat detection center, becomes hyperactive following trauma. It is constantly scanning for danger, generating false alarms, and triggering stress responses to stimuli that are not actually threatening. This hypervigilance is exhausting and makes it difficult for trauma survivors to relax, even in objectively safe environments.</p>

<p>The <strong>hippocampus</strong>, crucial for memory consolidation and contextualizing experiences in time and space, often shows reduced volume in trauma survivors. Impaired hippocampal function contributes to intrusive memories that feel as though they are happening now rather than being recalled from the past, difficulty distinguishing past from present, and fragmented, disorganized trauma narratives.</p>

<p>Broca's area, the brain region responsible for putting experiences into words, shows decreased activity during traumatic recall. This helps explain why trauma survivors often struggle to verbalize their experiences — the trauma is encoded in sensory, emotional, and somatic memory but not in narrative form. "Talk therapy" alone may be insufficient precisely because the trauma was never encoded in language-accessible memory.</p>

<h2>The Window of Tolerance</h2>

<p>Dan Siegel's concept of the "window of tolerance" provides a clinically useful framework for understanding trauma's impact on nervous system regulation. The window of tolerance is the zone of optimal arousal — the range within which a person can experience and integrate emotions without becoming overwhelmed or shutting down. Within this window, we can think clearly, relate to others, manage stress, and engage with life's challenges.</p>

<p>When arousal exceeds the upper boundary of the window, the person enters <strong>hyperarousal</strong> — the fight-or-flight zone characterized by anxiety, panic, hypervigilance, racing thoughts, anger, and agitation. The sympathetic nervous system is dominant, and the person may feel out of control, unable to calm down, or driven to act impulsively.</p>

<p>When arousal drops below the lower boundary, the person enters <strong>hypoarousal</strong> — the freeze or shutdown zone characterized by numbness, disconnection, depression, exhaustion, dissociation, and collapse. The dorsal vagal system is dominant, and the person may feel empty, disconnected from their body, or unable to engage with the world.</p>

<p>Trauma narrows the window of tolerance. Events that would be mildly stressful for someone with a wide window can push a trauma survivor into hyperarousal or hypoarousal. The narrowed window means the person spends less time in optimal functioning and more time in dysregulated states. A primary goal of trauma treatment is widening the window of tolerance so that the client can remain regulated across a broader range of experiences.</p>

<h2>Polyvagal Theory</h2>

<p>Stephen Porges's polyvagal theory provides additional neuroscience grounding for trauma work. Porges describes three hierarchically organized response systems mediated by the vagus nerve. The most recently evolved system — the ventral vagal or "social engagement" system — supports calm connection with others, clear thinking, and flexible responses. This is the system that operates when we feel safe.</p>

<p>When safety is compromised, the sympathetic nervous system activates for fight or flight. If fight or flight is not possible or does not resolve the threat, the most primitive system — the dorsal vagal system — activates, producing immobilization, collapse, and dissociation. This is the "freeze" response that many trauma survivors experienced during their original trauma and may re-experience when triggered.</p>

<p>Clinically, polyvagal theory emphasizes the primacy of safety — not cognitive understanding of safety, but the body's felt sense of safety, which Porges calls "neuroception." Trauma treatment must attend to this felt sense, creating conditions in which the client's nervous system can detect safety and shift out of defensive states. This is why the therapeutic relationship, the physical environment, and body-based interventions are at least as important as cognitive processing in trauma treatment.</p>`
          }
        ]
      },
      {
        title: 'Trauma-Sensitive Assessment',
        order: 3,
        lessons: [
          {
            title: 'Conducting Assessments That Minimize Retraumatization',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Conducting Assessments That Minimize Retraumatization</h2>

<p>Assessment is a necessary component of trauma treatment, but it carries risk. Asking about traumatic experiences can activate trauma responses, overwhelm clients who are not yet stabilized, or retraumatize through insensitive questioning. Trauma-sensitive assessment balances the need for clinical information with the imperative to do no harm. This requires careful attention to timing, pacing, framing, and the client's moment-to-moment responses.</p>

<h2>Principles of Trauma-Sensitive Assessment</h2>

<p><strong>Informed consent is essential.</strong> Before asking about trauma history, explain why you are asking, what you will do with the information, and that the client can decline to answer any question or stop at any time. This is not merely an ethical formality — it is a clinical intervention that establishes the client's control over their own narrative. Many trauma survivors have had their boundaries violated and their control taken away; beginning assessment by explicitly establishing their right to say no is itself therapeutic.</p>

<p><strong>Start broad, go narrow only as needed.</strong> Rather than beginning with detailed questions about specific traumatic events, start with broader questions that allow the client to disclose at their own pace. "Have you experienced any events in your life that were particularly difficult or overwhelming?" is less intrusive than "Were you sexually abused as a child?" The broader question lets the client decide what to share and how much detail to provide. More specific inquiry can follow if clinically indicated and the client is stable enough to tolerate it.</p>

<p><strong>Observe for signs of dysregulation.</strong> Throughout the assessment, monitor the client's nervous system state. Signs of hyperarousal include rapid breathing, restlessness, clenched muscles, raised voice, and visible anxiety. Signs of hypoarousal include slowed speech, flat affect, glazed eyes, slumped posture, and dissociative symptoms. If you observe dysregulation, slow down, use grounding techniques, and consider whether to continue or postpone further trauma inquiry. Pushing through dysregulation teaches the client that their signals will be ignored — the opposite of the safety you are trying to establish.</p>

<p><strong>Normalize without minimizing.</strong> When clients disclose trauma, acknowledge the significance of what they have shared without dramatic reactions that might feel overwhelming or shameful. "Thank you for trusting me with that. What you went through was serious, and I can see why it has affected you" validates the experience without sensationalizing it or implying that the client is damaged. Avoid responses that minimize ("At least you survived") or that inadvertently convey that the disclosure was too much for you to handle.</p>

<h2>Screening Tools</h2>

<p>Standardized screening tools can supplement clinical interview and ensure systematic assessment of trauma history and symptoms. The <strong>ACE (Adverse Childhood Experiences) questionnaire</strong> assesses 10 categories of childhood adversity including abuse, neglect, and household dysfunction. While not a diagnostic tool, ACE scores provide a quick indicator of developmental trauma exposure and correlate with adult health outcomes.</p>

<p>The <strong>Life Events Checklist (LEC-5)</strong> assesses exposure to 16 potentially traumatic events including natural disasters, accidents, combat, assault, and witnessed violence. It allows clients to indicate whether events happened to them, they witnessed them, or they learned about them happening to someone close. This provides a comprehensive trauma history without requiring detailed narration of each event.</p>

<p>The <strong>PTSD Checklist (PCL-5)</strong> assesses the 20 DSM-5 PTSD symptoms across four clusters: intrusion, avoidance, negative alterations in cognition and mood, and arousal/reactivity. It can be used for screening, provisional diagnosis, and tracking symptom change over treatment. A score of 31-33 is typically used as a cutoff for probable PTSD, though clinical judgment should always accompany screening results.</p>

<p>The <strong>Dissociative Experiences Scale (DES)</strong> screens for dissociative symptoms including amnesia, depersonalization, derealization, and absorption. High dissociation scores have implications for treatment planning, as highly dissociative clients may require specialized approaches and longer stabilization phases before trauma processing.</p>

<h2>Assessing Safety and Stabilization Needs</h2>

<p>Before any trauma processing can occur, the client must have adequate safety and stabilization. Assessment should include current safety: Is the client currently in danger? Are they in an abusive relationship, unstable housing, or other unsafe circumstances? Trauma processing with a client who is still being traumatized is contraindicated — the first priority is establishing safety in the present.</p>

<p>Assessment should also evaluate internal stabilization: Does the client have adequate coping skills to manage distress? Can they use grounding techniques? Do they have some capacity to self-soothe? Can they maintain daily functioning? Clients who are barely holding themselves together may decompensate if trauma processing activates overwhelming material before they have adequate resources to manage it.</p>

<p>Finally, assess external resources: Does the client have supportive relationships? Stable employment or financial resources? Access to healthcare? A client with robust external support can often tolerate more intensive treatment than one who is isolated and resource-poor. Treatment planning should match the intensity of intervention to the client's internal and external resources.</p>`
          }
        ]
      },
      {
        title: 'Principles of Trauma-Informed Care',
        order: 4,
        lessons: [
          {
            title: 'SAMHSA\'s Six Principles',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>SAMHSA's Six Principles of Trauma-Informed Care</h2>

<p>The Substance Abuse and Mental Health Services Administration (SAMHSA) has articulated six principles that guide trauma-informed approaches across settings. These principles apply not only to individual clinical encounters but to organizational culture, policies, and physical environments. Trauma-informed care is not a specific treatment modality but a framework that shapes how all services are delivered.</p>

<h2>Safety</h2>

<p>The first principle is safety — ensuring physical and emotional safety for clients and staff throughout the organization. For trauma survivors whose fundamental experience was that the world is dangerous and people cannot be trusted, establishing safety is the foundation upon which all other work depends. Safety includes the physical environment (Is the space welcoming? Are there private areas for conversation? Is the waiting room calm rather than chaotic?), interpersonal interactions (Do staff communicate respectfully? Are client concerns taken seriously?), and organizational practices (Are policies applied consistently? Are boundaries clear?).</p>

<p>Safety also means predictability. Trauma often involves experiences that were unpredictable and out of the survivor's control. Organizations can foster safety by being consistent, transparent, and reliable — following through on commitments, explaining what will happen before it happens, and avoiding surprises that might activate threat responses.</p>

<h2>Trustworthiness and Transparency</h2>

<p>The second principle emphasizes building trust through transparent operations and decision-making. Many trauma survivors have been betrayed by people or institutions that should have protected them. Trust is not assumed but earned through consistent, honest behavior over time. Transparency means explaining the reasons behind decisions, acknowledging mistakes openly, and providing clear information about what clients can expect.</p>

<p>In clinical settings, trustworthiness includes maintaining clear boundaries, honoring confidentiality, following through on commitments, and being honest even when the truth is uncomfortable. It also means acknowledging the limits of what you can offer rather than overpromising. A clinician who says "I'll try to find that resource for you" and then follows up — even if just to say "I couldn't find it" — builds more trust than one who promises and then forgets.</p>

<h2>Peer Support</h2>

<p>The third principle recognizes the value of peer support — connections with others who have lived experience of trauma and recovery. Peer support challenges the isolation that trauma often produces and provides models of recovery that professional relationships cannot offer. When a trauma survivor meets someone who has walked a similar path and emerged with a meaningful life, it communicates hope in a way that professional reassurance cannot match.</p>

<p>Organizations can integrate peer support through peer counselors, support groups, peer-led programming, and recovery communities. In clinical settings, referring clients to peer support resources complements professional treatment and helps build the social connections that are protective against trauma's long-term effects.</p>

<h2>Collaboration and Mutuality</h2>

<p>The fourth principle emphasizes partnership and shared decision-making, recognizing that healing happens in relationships and that power differentials between staff and clients should be minimized. Trauma often involves experiences of powerlessness; trauma-informed care deliberately redistributes power by involving clients in treatment planning, respecting their expertise on their own lives, and treating them as partners rather than passive recipients of services.</p>

<p>Collaboration extends to staff relationships as well. Organizations that practice trauma-informed care attend to how staff interact with each other, recognizing that hierarchical, punitive, or controlling organizational cultures are antithetical to trauma-informed principles — and that staff who are treated poorly will struggle to treat clients well.</p>

<h2>Empowerment, Voice, and Choice</h2>

<p>The fifth principle focuses on strengthening clients' autonomy and self-determination. Trauma often strips away a sense of control and agency; trauma-informed care intentionally restores it. This means offering choices wherever possible (even small choices like where to sit or when to schedule appointments), supporting client goals rather than imposing professional agendas, and recognizing and building on client strengths rather than focusing exclusively on deficits.</p>

<p>Empowerment also means creating opportunities for clients to develop skills and competencies that support their recovery. Rather than fostering dependence on services, trauma-informed organizations aim to build client capacity for self-determination. The question shifts from "What services does this client need?" to "What does this client need to build a life they value?"</p>

<h2>Cultural, Historical, and Gender Issues</h2>

<p>The sixth principle requires attention to cultural, historical, and gender-related factors that shape trauma exposure and response. Trauma does not occur in a vacuum — it is shaped by social context including race, ethnicity, gender, sexual orientation, immigration status, and historical experiences of group-based oppression. A Black client's response to police presence, a refugee's response to authority figures, a survivor of domestic violence's response to male providers — all are shaped by cultural and historical context that must be understood and respected.</p>

<p>This principle also requires organizations to examine their own practices for cultural biases and to adapt services to be culturally responsive. What feels safe and supportive differs across cultural contexts. Assumptions embedded in Western mental health models may not translate across cultures. Trauma-informed care requires cultural humility — the recognition that providers do not automatically know what is best for clients from different backgrounds and must be willing to learn.</p>`
          }
        ]
      },
      {
        title: 'Stabilization Techniques',
        order: 5,
        lessons: [
          {
            title: 'Grounding and Containment Skills',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Grounding and Containment Skills</h2>

<p>Stabilization is the essential first phase of trauma treatment. Before any processing of traumatic memories can occur safely, the client must have adequate capacity to regulate their nervous system, stay present in the current moment, and contain distressing material between sessions. Grounding and containment skills provide this foundation. These are not preliminary techniques to be discarded once "real" treatment begins — they are lifelong tools that support ongoing recovery and resilience.</p>

<h2>Grounding Techniques</h2>

<p>Grounding techniques anchor the client in the present moment and in their physical body, counteracting the dissociation, flashbacks, and time-confusion that characterize traumatic activation. When a client is triggered, their nervous system has essentially time-traveled back to the traumatic event — grounding brings them back to the present, where they are safe.</p>

<p><strong>The 5-4-3-2-1 technique</strong> engages all five senses to anchor attention in the present environment. The client identifies 5 things they can see, 4 things they can hear, 3 things they can touch, 2 things they can smell, and 1 thing they can taste. By systematically attending to sensory input from the current environment, the client's nervous system receives data that contradicts the traumatic memory's signal of danger. This technique is simple enough to teach in a single session and effective enough to become a go-to intervention for many trauma survivors.</p>

<p><strong>Physical grounding</strong> uses body awareness to anchor in the present. Techniques include pressing feet firmly into the floor, noticing the sensation of sitting in the chair, holding a cold object like an ice cube, splashing cold water on the face, or engaging in brief intense physical movement. These interventions work by activating interoceptive awareness — the felt sense of the body — which pulls attention out of traumatic memory and into present-moment physical experience.</p>

<p><strong>Cognitive grounding</strong> occupies the thinking mind with present-focused tasks. Examples include naming objects in the room by category (all the blue things, all the square things), counting backward from 100 by 7s, reciting lyrics to a familiar song, or describing the route from home to a familiar location. These techniques work by engaging the prefrontal cortex, which tends to be offline during traumatic activation. Cognitive engagement helps bring the thinking brain back online.</p>

<p><strong>Orientation statements</strong> explicitly remind the client of present-moment reality: "My name is [name]. I am [age] years old. I am sitting in my therapist's office. Today is [date]. The trauma happened in the past. I am safe right now." These statements counteract the time-confusion of flashbacks by asserting present-moment facts. They can be written on a card for the client to carry and read during moments of activation.</p>

<h2>Containment Techniques</h2>

<p>Containment techniques help clients manage intrusive traumatic material between sessions. Trauma processing often stirs up distressing memories and emotions that can feel overwhelming if they flood into daily life without boundaries. Containment provides a way to acknowledge the material while setting it aside until it can be addressed in the safety of the therapeutic relationship.</p>

<p><strong>The container exercise</strong> is a foundational containment technique. The client imagines a container — a safe, a vault, a locked chest, a box with a combination lock — that is strong enough to hold their traumatic material. In imagination, they place disturbing memories, images, or feelings into the container and secure it. The material is not being destroyed or denied; it is being stored safely until the client chooses to access it. The container can be opened in session when the client is ready to work with the material and closed again at session's end.</p>

<p><strong>The remote control exercise</strong> gives clients control over intrusive images. They imagine their traumatic memory playing on a television screen and themselves holding a remote control. They can pause the image, turn down the brightness, make it black-and-white, shrink it to a smaller screen, turn down the volume, or turn it off entirely. This exercise creates a sense of control over material that has felt uncontrollable.</p>

<p><strong>Safe place imagery</strong> provides a mental refuge when distress becomes overwhelming. The client develops a detailed imaginal representation of a place — real or imagined — where they feel completely safe. They engage all senses: what they see, hear, smell, feel, and perhaps taste in this safe place. The safe place becomes a resource they can access whenever they need to regulate, a mental shelter from the storm of traumatic activation.</p>

<h2>Building a Coping Toolkit</h2>

<p>Effective stabilization means helping each client develop a personalized repertoire of coping skills. What works varies by individual — some clients respond best to physical grounding, others to cognitive techniques, others to imagery. The therapist's role is to introduce a range of options and help the client identify which work best for them.</p>

<p>Skills should be practiced when the client is calm, not just deployed during crisis. A skill that has never been rehearsed is unlikely to be accessible during overwhelming distress. Regular practice — ideally daily — builds the neural pathways that make the skill available when it is most needed. Consider grounding and containment skills like athletic training: the time to practice is before the game, not during it.</p>

<p>A written coping plan is invaluable. When clients are dysregulated, their thinking brains are offline and they may not remember the skills they have learned. A card or phone note listing their specific coping strategies — "When I feel triggered, I will: 1) Press my feet into the floor, 2) Look around and name 5 things I see, 3) Text my support person, 4) Use the container to put the memory away" — provides external scaffolding when internal resources are depleted.</p>`
          }
        ]
      },
      {
        title: 'Working with Dissociation',
        order: 6,
        lessons: [
          {
            title: 'Recognizing and Responding to Dissociation',
            type: 'text',
            duration: 15,
            order: 1,
            content: `<h2>Recognizing and Responding to Dissociation</h2>

<p>Dissociation is a protective mechanism that allows the mind to escape overwhelming experiences when physical escape is impossible. During trauma, dissociation may have been lifesaving — the child who could mentally leave her body during abuse, the accident victim who felt like he was watching from outside himself. After trauma, dissociation often persists as an automatic response to stress, triggered by reminders of the original trauma or by any experience that approaches the threshold of tolerability. Understanding dissociation is essential for trauma clinicians because it affects how clients experience therapy and how treatment should be modified.</p>

<h2>Recognizing Dissociation</h2>

<p>Dissociation exists on a continuum from mild (daydreaming, highway hypnosis) to severe (dissociative identity disorder). In clinical settings, the signs of dissociative activation include:</p>

<p><strong>Changes in eye contact and gaze:</strong> The client's eyes may become unfocused, glazed, or seem to be looking through you rather than at you. They may stare fixedly or, conversely, avoid eye contact entirely.</p>

<p><strong>Changes in voice and speech:</strong> Speech may become slower, monotone, or have a distant quality. The client may seem to be speaking from far away or may become nonverbal entirely.</p>

<p><strong>Reduced responsiveness:</strong> The client may not respond to their name or to questions, or responses may be significantly delayed. They may appear not to hear what you are saying.</p>

<p><strong>Physical changes:</strong> Posture may become slumped or collapsed. The client may become very still, in contrast to the restlessness of hyperarousal. Facial expression may become blank or flat.</p>

<p><strong>Depersonalization and derealization:</strong> The client may report feeling like they are watching themselves from outside, like their body does not belong to them, or like their surroundings feel unreal or dreamlike.</p>

<p><strong>Memory gaps:</strong> After a dissociative episode, the client may have little or no memory of what occurred during the dissociated period.</p>

<h2>Responding to Dissociation in Session</h2>

<p>When you observe signs of dissociation, the first priority is helping the client return to present-moment awareness. This is done gently, without startle or alarm, using grounding techniques and relational connection.</p>

<p><strong>Use the client's name:</strong> "Sarah, I notice you seem far away right now. Can you hear my voice?" Speaking the client's name activates identity and personal connection.</p>

<p><strong>Engage the senses:</strong> "Can you feel your feet on the floor? Press them down firmly. Can you feel the chair supporting your back?" Sensory grounding brings attention back to the body in present space.</p>

<p><strong>Encourage eye contact:</strong> "Sarah, can you look at me? Look around the room and tell me something you see." Visual engagement with the current environment orients the client away from internal material.</p>

<p><strong>Use orienting statements:</strong> "You're in my office. It's Tuesday afternoon. You're safe here." These statements provide reality data that contradicts the dissociative experience of being elsewhere or elsewhen.</p>

<p><strong>Slow down:</strong> If discussion of traumatic material triggered the dissociation, shift to less activating topics or to present-focused conversation until the client is fully present again. Continuing to process trauma with a dissociated client is ineffective and potentially harmful — the processing cannot be integrated, and pushing forward can deepen dissociation or cause flooding.</p>

<h2>Modifying Treatment for Dissociative Clients</h2>

<p>Clients with significant dissociative symptoms often require longer stabilization phases before trauma processing. They need more extensive grounding skills, more robust containment strategies, and more gradual pacing of trauma work. Approaches that work well for non-dissociative trauma clients may overwhelm dissociative clients or trigger dissociative defenses that prevent integration.</p>

<p>Teaching clients to recognize their own dissociative cues — "I notice I'm starting to feel floaty" — supports their ability to use grounding proactively. Establishing signals for the client to communicate dissociation in session (a hand gesture if they cannot speak) allows for intervention before full dissociation occurs. Planning for dissociative episodes (What will we do if you dissociate in session? How will you ground yourself between sessions?) normalizes the experience and creates a roadmap for response.</p>

<p>Some trauma processing approaches have been specifically adapted for dissociative clients. EMDR, for example, includes protocols for working with high dissociation. Phase-oriented treatment models emphasize extensive stabilization before processing. Consultation with specialists in dissociation may be indicated for clients with severe dissociative symptoms or dissociative disorders.</p>`
          },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'According to SAMHSA, trauma is defined by:', type: 'multiple_choice', options: [{ text: 'The objective severity of the event', isCorrect: false }, { text: 'The individual\'s subjective experience and lasting effects', isCorrect: true }, { text: 'Whether PTSD criteria are met', isCorrect: false }, { text: 'The age at which it occurred', isCorrect: false }], explanation: 'SAMHSA defines trauma based on subjective experience and lasting effects, not objective event characteristics.' },
              { question: 'Complex trauma typically involves:', type: 'multiple_choice', options: [{ text: 'A single overwhelming event', isCorrect: false }, { text: 'Multiple events, often interpersonal and beginning early in life', isCorrect: true }, { text: 'Only combat exposure', isCorrect: false }, { text: 'Natural disasters', isCorrect: false }], explanation: 'Complex trauma involves multiple, often interpersonal traumatic experiences, typically beginning in childhood.' },
              { question: 'When the prefrontal cortex goes "offline" during trauma, what function is impaired?', type: 'multiple_choice', options: [{ text: 'Breathing', isCorrect: false }, { text: 'Heart rate', isCorrect: false }, { text: 'Executive function and emotional regulation', isCorrect: true }, { text: 'Digestion', isCorrect: false }], explanation: 'The prefrontal cortex is responsible for executive functions including reasoning, planning, and emotional regulation.' },
              { question: 'The "window of tolerance" refers to:', type: 'multiple_choice', options: [{ text: 'How much trauma a person can endure', isCorrect: false }, { text: 'The zone of optimal arousal for functioning', isCorrect: true }, { text: 'Tolerance for distressing memories', isCorrect: false }, { text: 'Time between therapy sessions', isCorrect: false }], explanation: 'The window of tolerance is the zone within which a person can experience emotions without becoming overwhelmed.' },
              { question: 'Hyperarousal is characterized by:', type: 'multiple_choice', options: [{ text: 'Numbness and disconnection', isCorrect: false }, { text: 'Anxiety, hypervigilance, and agitation', isCorrect: true }, { text: 'Sleepiness and fatigue', isCorrect: false }, { text: 'Clear thinking and calm', isCorrect: false }], explanation: 'Hyperarousal involves sympathetic nervous system dominance with anxiety, hypervigilance, and agitation.' },
              { question: 'According to polyvagal theory, the "social engagement" system is associated with:', type: 'multiple_choice', options: [{ text: 'Fight or flight', isCorrect: false }, { text: 'Freeze and collapse', isCorrect: false }, { text: 'Calm connection and flexible response', isCorrect: true }, { text: 'Dissociation', isCorrect: false }], explanation: 'The ventral vagal or social engagement system supports calm connection and flexible responses.' },
              { question: 'Trauma-sensitive assessment should include:', type: 'multiple_choice', options: [{ text: 'Detailed questioning about traumatic events in the first session', isCorrect: false }, { text: 'Informed consent and monitoring for dysregulation', isCorrect: true }, { text: 'Pushing through client distress for complete information', isCorrect: false }, { text: 'Avoiding any mention of trauma', isCorrect: false }], explanation: 'Trauma-sensitive assessment includes informed consent, pacing, and monitoring for signs of dysregulation.' },
              { question: 'The 5-4-3-2-1 technique is an example of:', type: 'multiple_choice', options: [{ text: 'Trauma processing', isCorrect: false }, { text: 'Grounding', isCorrect: true }, { text: 'Cognitive restructuring', isCorrect: false }, { text: 'Exposure therapy', isCorrect: false }], explanation: 'The 5-4-3-2-1 technique uses sensory awareness to ground clients in the present moment.' },
              { question: 'SAMHSA\'s six principles of trauma-informed care include all EXCEPT:', type: 'multiple_choice', options: [{ text: 'Safety', isCorrect: false }, { text: 'Confrontation', isCorrect: true }, { text: 'Peer support', isCorrect: false }, { text: 'Empowerment', isCorrect: false }], explanation: 'SAMHSA principles include safety, trustworthiness, peer support, collaboration, empowerment, and cultural issues — not confrontation.' },
              { question: 'Containment techniques are used to:', type: 'multiple_choice', options: [{ text: 'Process traumatic memories', isCorrect: false }, { text: 'Help clients manage intrusive material between sessions', isCorrect: true }, { text: 'Diagnose PTSD', isCorrect: false }, { text: 'Challenge cognitive distortions', isCorrect: false }], explanation: 'Containment helps clients store distressing material safely until they choose to address it in therapy.' },
              { question: 'Signs of dissociation in session include:', type: 'multiple_choice', options: [{ text: 'Increased eye contact and engagement', isCorrect: false }, { text: 'Rapid, pressured speech', isCorrect: false }, { text: 'Glazed eyes and reduced responsiveness', isCorrect: true }, { text: 'Expressions of anger', isCorrect: false }], explanation: 'Dissociation often presents with glazed eyes, reduced responsiveness, and emotional flatness.' },
              { question: 'When a client dissociates in session, the first response should be:', type: 'multiple_choice', options: [{ text: 'Continue with the trauma processing', isCorrect: false }, { text: 'Help them ground and return to the present', isCorrect: true }, { text: 'End the session immediately', isCorrect: false }, { text: 'Interpret the dissociation psychodynamically', isCorrect: false }], explanation: 'Helping the client ground and return to present awareness is the priority when dissociation occurs.' },
              { question: 'The hippocampus is involved in:', type: 'multiple_choice', options: [{ text: 'Threat detection', isCorrect: false }, { text: 'Memory consolidation and contextualizing experiences', isCorrect: true }, { text: 'Executive function', isCorrect: false }, { text: 'Producing stress hormones', isCorrect: false }], explanation: 'The hippocampus is crucial for memory consolidation and placing experiences in time and space.' },
              { question: 'ACE studies found that childhood trauma:', type: 'multiple_choice', options: [{ text: 'Rarely affects adult health', isCorrect: false }, { text: 'Has a dose-response relationship with adult health outcomes', isCorrect: true }, { text: 'Only affects mental health, not physical health', isCorrect: false }, { text: 'Is extremely rare', isCorrect: false }], explanation: 'ACE research shows a dose-response relationship: more ACEs predict higher rates of mental and physical health problems.' },
              { question: 'Safe place imagery is used for:', type: 'multiple_choice', options: [{ text: 'Processing traumatic memories', isCorrect: false }, { text: 'Providing a mental refuge for self-regulation', isCorrect: true }, { text: 'Challenging avoidance', isCorrect: false }, { text: 'Assessing dissociation', isCorrect: false }], explanation: 'Safe place imagery creates a mental resource clients can access for calming and self-regulation.' },
              { question: 'Stabilization should occur:', type: 'multiple_choice', options: [{ text: 'After trauma processing', isCorrect: false }, { text: 'Only if the client requests it', isCorrect: false }, { text: 'Before trauma processing begins', isCorrect: true }, { text: 'Simultaneously with intensive trauma work', isCorrect: false }], explanation: 'Stabilization must precede trauma processing to ensure the client can manage the distress involved.' },
              { question: 'Secondary trauma affects:', type: 'multiple_choice', options: [{ text: 'Only combat veterans', isCorrect: false }, { text: 'People who directly experienced trauma', isCorrect: false }, { text: 'Those exposed to others\' traumatic material', isCorrect: true }, { text: 'Only children', isCorrect: false }], explanation: 'Secondary or vicarious trauma affects people exposed to others\' trauma, including therapists and first responders.' },
              { question: 'Broca\'s area difficulty during trauma explains why:', type: 'multiple_choice', options: [{ text: 'Trauma survivors cannot walk', isCorrect: false }, { text: 'Trauma is often not encoded in verbal/narrative form', isCorrect: true }, { text: 'Trauma survivors cannot see', isCorrect: false }, { text: 'Trauma always causes aphasia', isCorrect: false }], explanation: 'Reduced Broca\'s area activity during trauma means experiences may not be encoded in language-accessible memory.' },
              { question: 'Trauma-informed care is:', type: 'multiple_choice', options: [{ text: 'A specific treatment for PTSD', isCorrect: false }, { text: 'A framework that shapes how all services are delivered', isCorrect: true }, { text: 'Only for trauma specialists', isCorrect: false }, { text: 'Unnecessary for most clients', isCorrect: false }], explanation: 'Trauma-informed care is a foundational framework for all services, not a specific treatment modality.' },
              { question: 'When grounding techniques should be practiced:', type: 'multiple_choice', options: [{ text: 'Only during crisis', isCorrect: false }, { text: 'Regularly when calm, to build the skill', isCorrect: true }, { text: 'Only in therapy sessions', isCorrect: false }, { text: 'Only when dissociating', isCorrect: false }], explanation: 'Skills should be practiced when calm so they are available during crisis — like athletic training.' }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'The body keeps the score', author: 'van der Kolk, B. A.', year: 2014, source: 'Viking' },
      { title: 'Trauma and recovery', author: 'Herman, J. L.', year: 2015, source: 'Basic Books' },
      { title: 'Waking the tiger: Healing trauma', author: 'Levine, P. A.', year: 1997, source: 'North Atlantic Books' },
      { title: 'SAMHSA\'s concept of trauma and guidance for a trauma-informed approach', author: 'SAMHSA', year: 2014, source: 'HHS Publication No. (SMA) 14-4884' },
      { title: 'The polyvagal theory', author: 'Porges, S. W.', year: 2011, source: 'Norton' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE: Suicide Assessment (3 CEU - Clinical)
  // ============================================
  {
    slug: 'suicide-assessment-safety-planning',
    title: 'Suicide Assessment and Safety Planning: Evidence-Based Approaches',
    subtitle: 'Develop competence in suicide risk assessment, safety planning, and crisis intervention',
    description: 'Suicide assessment is one of the most critical competencies for mental health professionals. This comprehensive 3-hour course provides evidence-based frameworks for assessing suicide risk, identifying warning signs and risk factors, conducting thorough clinical interviews, developing collaborative safety plans, and managing ongoing risk. Through clinical examples and practical tools, you will develop confidence in this essential area of practice.',
    thumbnail: '/images/courses/suicide-assessment.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Describe current suicide epidemiology and demographic patterns',
      'Differentiate between static risk factors and acute warning signs',
      'Identify protective factors that buffer against suicide risk',
      'Apply evidence-based screening instruments appropriately',
      'Conduct comprehensive suicide risk assessments through clinical interview',
      'Develop collaborative, individualized safety plans using the Stanley-Brown model',
      'Document suicide assessment and safety planning appropriately',
      'Implement ongoing risk monitoring and follow-up care'
    ],
    modules: [
      {
        title: 'Understanding Suicidality',
        order: 1,
        lessons: [
          {
            title: 'Epidemiology and Frameworks',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Epidemiology and Frameworks</h2>

<p>Suicide is a significant public health concern that affects every demographic group and touches virtually every clinician's practice. Understanding the scope of the problem, the populations most affected, and the conceptual frameworks that guide assessment and intervention is foundational knowledge for all mental health professionals. This module provides that foundation while acknowledging that statistics represent individual lives lost and families devastated — the human dimension must never be reduced to numbers alone.</p>

<h2>Current Epidemiology</h2>

<p>Suicide is the 10th leading cause of death in the United States, claiming approximately 48,000 lives annually — one death approximately every 11 minutes. For every completed suicide, there are approximately 25 suicide attempts. The suicide rate has increased significantly over the past two decades, rising approximately 35% between 1999 and 2020 before beginning to stabilize. This increase has affected most demographic groups but has been particularly pronounced in certain populations.</p>

<p>Demographic patterns reveal important assessment considerations. Men die by suicide at approximately four times the rate of women, though women attempt suicide approximately three times more often. This disparity is largely attributable to method lethality — men more often use firearms, which are highly lethal, while women more often use poisoning or overdose, which are more often survivable. Middle-aged adults (45-64) and older adults (over 75) have the highest suicide rates, though suicide among adolescents and young adults has increased dramatically in recent years.</p>

<p>Racial and ethnic patterns are complex. White and American Indian/Alaska Native populations have historically had higher suicide rates than Black, Hispanic, and Asian populations, though recent years have seen increasing rates among Black youth. LGBTQ+ individuals, particularly transgender persons, experience elevated suicide risk, with studies consistently showing attempt rates 2-4 times higher than the general population.</p>

<p>Veterans represent another elevated-risk population, dying by suicide at 1.5 times the rate of non-veteran adults. Firearms account for an even higher proportion of veteran suicides (approximately 70%) compared to the general population. Access to lethal means is a critical risk factor across populations.</p>

<h2>Conceptual Frameworks</h2>

<p>Several theoretical frameworks inform our understanding of suicide. Thomas Joiner's <strong>Interpersonal Theory of Suicide</strong> proposes that lethal suicidal behavior requires the intersection of three factors: thwarted belongingness (feeling disconnected from others), perceived burdensomeness (believing oneself to be a liability), and acquired capability (reduced fear of death and increased pain tolerance, often developed through repeated exposure to painful or provocative experiences). This framework explains why many people with suicidal ideation do not attempt — they may have the desire but lack the capability — and why capability, once acquired, persists as a risk factor.</p>

<p>The <strong>Three-Step Theory</strong> (Klonsky & May) suggests that suicide ideation develops when pain exceeds connectedness (Step 1), becomes serious when combined with hopelessness (Step 2), and progresses to attempt when capability is present (Step 3). This model emphasizes the central role of psychological pain and the protective function of connection.</p>

<p>The <strong>Fluid Vulnerability Theory</strong> (Rudd) describes suicide risk as fluctuating rather than static, with baseline vulnerability interacting with acute stressors to produce episodic elevations in risk. This framework underscores the importance of assessing both chronic risk factors and acute exacerbations, and of recognizing that risk level can change rapidly.</p>

<h2>Moving Beyond Prediction to Prevention</h2>

<p>A critical paradigm shift in contemporary suicidology is the movement from prediction to prevention. Research consistently demonstrates that clinicians cannot reliably predict which individuals will die by suicide — the base rate is too low and the risk factors too common for accurate individual prediction. This does not mean assessment is useless; it means that assessment should focus on identifying modifiable risk factors, implementing interventions to reduce risk, and developing safety plans to manage crises — rather than attempting to categorize patients into discrete risk levels.</p>

<p>This shift has practical implications. The question is not "Will this patient attempt suicide?" (which cannot be reliably answered) but rather "What factors are increasing this patient's risk, what factors are protecting them, and what can we do to tip the balance toward safety?" Assessment is in service of intervention, not classification.</p>`
          }
        ]
      },
      {
        title: 'Risk and Protective Factors',
        order: 2,
        lessons: [
          {
            title: 'Identifying Risk and Protective Factors',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Identifying Risk and Protective Factors</h2>

<p>Comprehensive suicide assessment requires understanding both the factors that increase risk and those that protect against it. Risk and protective factors interact dynamically — the same individual may have elevated risk due to certain factors while being buffered by others. Assessment aims to map this terrain for each individual client, identifying both vulnerabilities to address and strengths to leverage.</p>

<h2>Static Risk Factors</h2>

<p>Static risk factors are historical or demographic factors that cannot be changed. They represent baseline vulnerability that must be considered in assessment but cannot be directly targeted by intervention.</p>

<p><strong>Prior suicide attempt</strong> is the single strongest predictor of future suicide. The risk of eventual suicide death is 30-40 times higher among attempt survivors than in the general population, with the highest risk in the first year after an attempt. History of multiple attempts confers even greater risk. Every assessment should inquire about prior attempts, including method, medical severity, intent, and circumstances.</p>

<p><strong>Family history</strong> of suicide increases risk, likely through both genetic factors (heritability of mental illness, impulsivity) and exposure/modeling effects. A client whose parent died by suicide carries elevated risk that should be part of ongoing clinical awareness.</p>

<p><strong>Childhood trauma and adverse childhood experiences</strong> are associated with increased suicide risk across the lifespan. ACEs disrupt attachment, emotion regulation, and stress response systems in ways that create lasting vulnerability.</p>

<p><strong>History of psychiatric hospitalization</strong> represents both a marker of illness severity and a risk factor in itself — the period immediately following discharge is extremely high-risk, with studies showing suicide rates 100-200 times the population average in the first week post-discharge.</p>

<h2>Dynamic Risk Factors (Acute Warning Signs)</h2>

<p>Dynamic risk factors fluctuate over time and are often the focus of intervention because they can potentially be modified. Acute warning signs signal imminent elevation of risk.</p>

<p><strong>Suicidal ideation</strong> — thoughts about suicide — varies in frequency, intensity, duration, and specificity. Assessment should explore: How often do you have thoughts of suicide? How intense are they? How long do they last? Do you have a specific plan? Passive ideation ("I wish I were dead") is lower risk than active ideation with plan and intent, though any ideation warrants attention.</p>

<p><strong>Hopelessness</strong> — the expectation that things will not improve — is a stronger predictor of suicide than depression severity alone. A client may be severely depressed but maintain hope for improvement; another may be less symptomatic but profoundly hopeless. Targeting hopelessness directly through intervention is important.</p>

<p><strong>Agitation and anxiety</strong> are acute risk factors that may indicate suicide is imminent. The combination of severe anxiety, insomnia, and inner turmoil creates an unbearable state that suicide may feel like the only escape from. These states warrant urgent intervention.</p>

<p><strong>Intoxication</strong> dramatically increases acute risk through disinhibition and impaired judgment. Assessment should include substance use patterns and whether ideation increases with intoxication.</p>

<p><strong>Recent stressors</strong> often precipitate suicidal crises, including relationship losses, financial problems, job loss, legal difficulties, or health diagnoses. Identifying precipitants helps target intervention.</p>

<p><strong>Access to lethal means</strong> — particularly firearms — dramatically increases risk. Firearm access is associated with a 3-4 fold increase in suicide risk, and firearm suicides have a case fatality rate exceeding 80%, compared to approximately 5% for overdose. Means restriction counseling is one of the most effective suicide prevention interventions.</p>

<h2>Protective Factors</h2>

<p>Protective factors buffer against suicide risk and should be assessed and strengthened as part of comprehensive care. Identifying what keeps a client alive is as important as identifying what threatens their life.</p>

<p><strong>Reasons for living</strong> — whatever gives the client purpose, meaning, or connection — are powerful protectors. These vary by individual and should be explored: family relationships, children, pets, religious beliefs, future goals, hobbies, responsibilities. The Reasons for Living Inventory is a validated instrument for assessing this domain.</p>

<p><strong>Social connectedness</strong> provides belonging and practical support. Clients who have people who would notice their absence, who check on them, who they can call in crisis, are at lower risk than isolated individuals. Strengthening social connections is both protective and therapeutic.</p>

<p><strong>Access to mental health care</strong> is protective when treatment is effective and the therapeutic alliance is strong. Treatment engagement — showing up, participating, following the plan — indicates investment in living.</p>

<p><strong>Religious or spiritual beliefs</strong> that prohibit suicide or provide meaning and community are protective for some clients, though they should not be assumed to be present or to automatically confer protection.</p>

<p><strong>Restricted access to lethal means</strong> is protective because many suicidal crises are time-limited. If the person cannot act on the impulse when it peaks, they may survive until the crisis passes. Means restriction saves lives even when it does not address underlying ideation.</p>`
          }
        ]
      },
      {
        title: 'Screening and Assessment',
        order: 3,
        lessons: [
          {
            title: 'Screening Tools and Clinical Interview',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Screening Tools and Clinical Interview</h2>

<p>Effective suicide assessment combines standardized screening instruments with skilled clinical interviewing. Screening tools provide systematic coverage and documentation; clinical interview provides nuance, context, and therapeutic engagement. Neither alone is sufficient — they complement each other.</p>

<h2>Screening Instruments</h2>

<p>The <strong>Columbia-Suicide Severity Rating Scale (C-SSRS)</strong> is one of the most widely used and well-validated screening instruments. It assesses suicidal ideation on a 5-point scale from passive ideation ("wish you were dead") through active ideation with specific plan and intent. It also assesses suicidal behavior including actual attempts, interrupted attempts, aborted attempts, and preparatory behavior. The C-SSRS takes approximately 5-10 minutes to administer and provides a structured framework that ensures key areas are covered.</p>

<p>The <strong>PHQ-9 Item 9</strong> screens for suicidal ideation within the context of depression assessment. The question asks how often in the past two weeks the person has been "bothered by thoughts that you would be better off dead, or of hurting yourself in some way." Any positive response (more than "not at all") should trigger more detailed assessment. While not a comprehensive suicide assessment, the PHQ-9 Item 9 provides universal screening opportunity in settings where depression screening is routine.</p>

<p>The <strong>Ask Suicide-Screening Questions (ASQ)</strong> is a brief 4-question screening tool validated for emergency department and inpatient medical settings, particularly with pediatric and adolescent populations. Questions include: In the past few weeks, have you wished you were dead? Have you felt that you or your family would be better off if you were dead? Have you been having thoughts about killing yourself? Have you ever tried to kill yourself? A positive response to any question indicates the need for further assessment.</p>

<p>The <strong>Suicide Behaviors Questionnaire-Revised (SBQ-R)</strong> is a brief self-report measure that assesses lifetime ideation and attempts, past-year ideation, communication of intent, and self-reported likelihood of future attempt. It provides a total score that can be compared to clinical cutoffs, useful for tracking risk over time.</p>

<h2>The Clinical Interview</h2>

<p>Screening instruments identify that further assessment is needed; the clinical interview provides that assessment. The interview explores ideation, plan, intent, and capability in depth, while simultaneously building rapport and gathering clinical context.</p>

<p><strong>Opening the conversation:</strong> Many clinicians are uncomfortable asking about suicide, fearing they will "plant the idea" or upset the client. Research consistently shows that asking about suicide does not increase ideation or behavior — it often provides relief and opens the door to help. Direct, compassionate inquiry communicates that this is a topic that can be discussed safely.</p>

<p>Sample opening questions: "I ask all my clients about thoughts of suicide, because it's common and I want to make sure I understand what you're going through. Have you been having any thoughts about suicide or wanting to die?" Or, following up on a positive screen: "You mentioned having thoughts about being better off dead. Can you tell me more about those thoughts?"</p>

<p><strong>Assessing ideation:</strong> When ideation is present, explore its characteristics. Frequency: How often do these thoughts occur? (Many times a day? A few times a week?) Duration: When they come, how long do they stay? (Fleeting? Hours? Constant?) Intensity: How strong are they? (Background noise? Compelling?) Controllability: Can you push them away, or do they take over? Content: What exactly do the thoughts say?</p>

<p><strong>Assessing plan and method:</strong> A specific plan indicates higher risk than vague ideation. Questions include: Have you thought about how you would do it? Do you have access to [method]? Have you taken any steps to prepare? The level of detail and preparation indicates escalating risk.</p>

<p><strong>Assessing intent:</strong> Plan describes how; intent describes the commitment to act. Questions include: How close have you come to acting on these thoughts? What has stopped you? Do you intend to act on these thoughts? When? Intent may range from "I would never actually do it" to "I plan to do it tonight."</p>

<p><strong>Assessing capability:</strong> Joiner's model highlights acquired capability — reduced fear of death and increased pain tolerance — as a gateway to lethal behavior. Prior attempts are the strongest indicator. Other indicators include history of self-harm, exposure to others' suicide, violent experiences, and painful medical conditions.</p>

<p><strong>Assessing reasons for living:</strong> This is as important as assessing risk factors. "What has kept you alive so far?" "What would you miss?" "Who would be affected?" These questions identify protective factors to leverage and may themselves be therapeutic, reminding the client of connections and purposes that the suicidal state obscures.</p>`
          }
        ]
      },
      {
        title: 'Safety Planning',
        order: 4,
        lessons: [
          {
            title: 'The Stanley-Brown Safety Plan',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>The Stanley-Brown Safety Plan</h2>

<p>Safety planning is a collaborative intervention that provides clients with a personalized, written plan for managing suicidal crises. The Stanley-Brown Safety Planning Intervention, developed by Barbara Stanley and Gregory Brown, is the most widely used and well-validated approach. Research demonstrates that safety planning reduces suicide attempts and increases treatment engagement. Unlike "no-suicide contracts" (which have no evidence of effectiveness and create false reassurance), safety planning is an active, skill-based intervention.</p>

<h2>Principles of Safety Planning</h2>

<p>Safety plans should be developed <strong>collaboratively</strong> — the client is the expert on what will work for them, and a plan imposed by the clinician is unlikely to be used. The clinician guides the process, offers suggestions, and problem-solves barriers, but the client's voice is central.</p>

<p>Plans should be <strong>specific and concrete</strong>. "Call a friend" is less useful than "Call my sister Maria at [phone number]." "Go somewhere safe" is less useful than "Go to Starbucks on Main Street." Vague plans are hard to follow during crisis; specific plans provide a roadmap.</p>

<p>Plans should be <strong>prioritized in escalating order</strong>. The client first tries the least intensive strategies (internal coping), escalating to more intensive strategies (professional crisis services) only if earlier steps are insufficient. This builds client self-efficacy and reserves professional resources for when they are truly needed.</p>

<p>Plans should be <strong>accessible</strong> — physically present and easy to find during crisis. A plan stored in a file cabinet or saved to an obscure folder on a phone will not be used. The plan should be on the client's refrigerator, in their wallet, on their phone's home screen, or wherever they will see it when distressed.</p>

<h2>The Six Steps</h2>

<p><strong>Step 1: Warning signs.</strong> The client identifies personal cues that a crisis may be developing — thoughts, feelings, behaviors, or situations that indicate they should consult the safety plan. Examples: "Thinking about my ex for more than an hour," "Drinking alone," "Not getting out of bed," "Feeling like nothing matters." These warning signs are the trigger to pull out the plan and begin working through the steps.</p>

<p><strong>Step 2: Internal coping strategies.</strong> These are things the client can do on their own, without involving anyone else, to distract from or manage the crisis. Examples: "Take a walk around the block," "Take a cold shower," "Do the 5-4-3-2-1 grounding exercise," "Play guitar," "Watch funny videos." The goal is not to resolve the crisis entirely but to reduce intensity enough to prevent impulsive action. The clinician helps the client identify strategies that have worked before or that match their interests.</p>

<p><strong>Step 3: Social contacts for distraction.</strong> These are people the client can reach out to for social contact and distraction — not necessarily people they would tell about suicidal thoughts, but people whose presence or conversation can help them get through the crisis. Examples: "Call my brother to talk about sports," "Text my friend from work," "Go to the coffee shop where I know the baristas." The clinician helps the client identify specific people and plan what they would talk about.</p>

<p><strong>Step 4: People to ask for help.</strong> These are people the client trusts enough to tell about suicidal thoughts — family members, close friends, sponsors, clergy, or others who can provide support and monitoring during crisis. The clinician helps identify these individuals and may encourage the client to have a conversation with them in advance: "If I call and say I'm struggling, here's what I need from you."</p>

<p><strong>Step 5: Professional resources.</strong> These include the client's treatment providers (therapist, psychiatrist), crisis lines, and emergency services. The plan should include specific names and phone numbers, not just generic "call your doctor." The 988 Suicide and Crisis Lifeline (call or text 988), the Crisis Text Line (text HOME to 741741), and local crisis services should be included. The plan should specify when to use emergency services (911 or going to an emergency room) — typically when the client does not feel safe and other resources have been insufficient.</p>

<p><strong>Step 6: Making the environment safe.</strong> This step addresses means restriction — reducing access to lethal methods during crisis. If firearms are present, the plan might include giving them to a trusted person, storing them at a gun range, or using a lockbox with the combination held by someone else. Medications that could be used for overdose might be limited to small quantities or held by someone else. The clinician works collaboratively to identify feasible means restriction strategies that the client is willing to implement.</p>

<h2>Reviewing and Revising Safety Plans</h2>

<p>Safety plans are living documents that should be reviewed regularly and revised as circumstances change. Review the plan at each session: "Let's look at your safety plan. Have you had to use it? Did it work? Does anything need to be updated?" Strategies that did not work should be replaced. People who have become unavailable should be substituted. New strategies that the client has discovered should be added.</p>

<p>When a crisis occurs and the safety plan is used, debrief afterward: "Walk me through what happened. When did you notice the warning signs? What did you try? What worked? What didn't?" This debriefing both refines the plan and reinforces its use.</p>`
          }
        ]
      },
      {
        title: 'Documentation and Legal Considerations',
        order: 5,
        lessons: [
          {
            title: 'Documenting Suicide Assessment',
            type: 'text',
            duration: 15,
            order: 1,
            content: `<h2>Documenting Suicide Assessment</h2>

<p>Thorough documentation of suicide assessment serves multiple functions: it communicates important clinical information to other providers, supports continuity of care, demonstrates the clinician's reasoning process, and provides legal protection by showing that appropriate care was provided. Documentation should be completed as soon as possible after the assessment, while details are fresh, and should reflect the complexity of clinical decision-making.</p>

<h2>Elements of Documentation</h2>

<p><strong>Presenting concerns and context:</strong> Document the circumstances that prompted the assessment — presenting complaints, screening results, observed behavior, or collateral report. "Client presented reporting increased depression and passive suicidal ideation. PHQ-9 score 18, Item 9 positive (2 - 'more than half the days')."</p>

<p><strong>Risk factors identified:</strong> List both static and dynamic risk factors elicited through screening and interview. "Risk factors include: prior suicide attempt (2015, overdose); family history (father died by suicide); current major depressive episode; recent relationship breakup; access to firearms in home; increased alcohol use."</p>

<p><strong>Protective factors identified:</strong> Document what buffers risk. "Protective factors include: strong connection to two children; religious beliefs prohibiting suicide; engaged in treatment; no current intent; willing to use safety plan."</p>

<p><strong>Assessment details:</strong> Document the specifics of suicidal ideation, plan, and intent. "Client reports passive suicidal ideation ('I sometimes wish I wouldn't wake up') occurring several times per week, lasting minutes. Denies active ideation, plan, or intent. Denies preparatory behavior. Identifies reasons for living including children and 'wanting to see things get better.' Previous attempt was 8 years ago in context of prior relationship ending; client identifies current situation as different."</p>

<p><strong>Clinical impression and risk level:</strong> Document your assessment of overall risk, recognizing that this is clinical judgment rather than prediction. Rather than discrete categories ("high/medium/low"), consider describing the specific picture: "Overall, client presents with chronic moderate risk factors (prior attempt, family history) with current acute elevation (recent stressor, increased ideation) but significant protective factors (children, treatment engagement, no plan/intent). Risk is elevated but not imminent."</p>

<p><strong>Interventions provided:</strong> Document what you did. "Conducted comprehensive suicide risk assessment using C-SSRS. Collaboratively developed written safety plan (copy in chart, copy given to client). Discussed means restriction; client agreed to have husband secure firearms at his brother's home and will confirm at next session. Increased session frequency to twice weekly. Provided crisis line numbers. Discussed hospitalization as an option; client declined and I agreed that outpatient management is appropriate given current presentation."</p>

<p><strong>Plan and follow-up:</strong> Document the plan going forward. "Client will call if suicidal ideation increases or any intent develops. Return appointment scheduled for [date]. Will coordinate with psychiatrist regarding medication review. Will reassess at each session."</p>

<h2>Documentation Don'ts</h2>

<p><strong>Don't use reassuring language that oversimplifies.</strong> "Patient denies suicidal ideation" without further detail provides no clinical information and no protection. The absence of suicidal ideation at one moment does not mean absence of risk.</p>

<p><strong>Don't predict.</strong> "Patient is not at risk for suicide" is an indefensible statement. Risk can be described, not predicted.</p>

<p><strong>Don't rely solely on "no-suicide contracts."</strong> Documenting that a patient "contracted for safety" is meaningless and may suggest negligence if the patient subsequently attempts. Document actual assessment and intervention instead.</p>

<p><strong>Don't omit clinical reasoning.</strong> Document why you made the decisions you made. If you decided outpatient treatment was appropriate despite elevated risk, explain the reasoning: the protective factors present, the client's preferences, the interventions implemented, the plan for monitoring. If the chart shows what you thought, not just what you did, it demonstrates competent clinical judgment.</p>`
          },
          {
            title: 'Crisis Intervention and Ongoing Care',
            type: 'text',
            duration: 15,
            order: 2,
            content: `<h2>Crisis Intervention and Ongoing Care</h2>

<p>When assessment reveals acute, imminent risk — the client has active intent and plan, means are accessible, and they do not feel able to maintain safety — immediate intervention is required. Even when risk is not imminent, suicide assessment initiates an ongoing process of monitoring, intervention, and follow-up that extends throughout treatment.</p>

<h2>Acute Crisis Intervention</h2>

<p><strong>Do not leave the client alone</strong> until safety is established. If the client is in your office, they stay with you until the crisis is resolved or they are transferred to a higher level of care. If you learn of the crisis by phone, stay on the line while activating emergency response.</p>

<p><strong>Means restriction is urgent.</strong> If there are firearms in the home and the client is in crisis, those firearms need to be secured before the client goes home. This may involve calling a family member to remove them, calling police for a wellness check, or hospitalization if no other options are available.</p>

<p><strong>Involve support systems with client permission.</strong> Contact family members, friends, or others who can provide monitoring and support. Explain the situation, what to watch for, and when to seek emergency help. Having someone physically with the client during acute crisis significantly reduces risk.</p>

<p><strong>Hospitalization may be necessary.</strong> Psychiatric hospitalization provides a safe, controlled environment when outpatient management is insufficient. Criteria generally include imminent risk (plan, intent, and means), inability to contract for safety, insufficient support systems, or need for medication adjustment that cannot occur outpatient. Hospitalization should be collaborative when possible — many clients will agree to voluntary admission when the rationale is explained and their concerns are addressed. Involuntary hospitalization is reserved for situations where the client refuses necessary care and meets legal criteria for commitment.</p>

<p><strong>Warm handoffs to higher levels of care.</strong> If transferring to an emergency room or inpatient unit, provide direct communication to receiving providers rather than just sending paperwork. Accompany the client or stay on the line until they arrive if possible. Transition points are high-risk periods; continuity of care matters.</p>

<h2>Post-Hospitalization Care</h2>

<p>The period immediately following psychiatric hospitalization is extremely high-risk — suicide rates are 100-200 times population average in the first week post-discharge. Clinicians should:</p>

<p><strong>Schedule the first outpatient appointment within 24-72 hours of discharge.</strong> Do not allow gaps in care. If you cannot see the client immediately, ensure someone else does.</p>

<p><strong>Review and update the safety plan</strong> developed during hospitalization. The inpatient team may have created a plan; ensure the outpatient plan is current and the client has it physically accessible.</p>

<p><strong>Verify means restriction is in place.</strong> Firearms and medications should remain secured; do not assume the inpatient intervention persists without verification.</p>

<p><strong>Coordinate with prescribers</strong> about medication follow-up. Ensure the client has medications, can fill prescriptions, and has a plan for psychiatric follow-up.</p>

<h2>Ongoing Risk Monitoring</h2>

<p>Suicide assessment is not a one-time event but an ongoing process. At every session with a client with elevated risk:</p>

<p><strong>Reassess current ideation.</strong> "How have thoughts of suicide been since we last met?" Track frequency, intensity, and any changes. Use the same screening instrument at regular intervals to track trends.</p>

<p><strong>Review the safety plan.</strong> "Have you had to use your safety plan? Did it work? Does anything need to be updated?" Keep the plan current and reinforce its use.</p>

<p><strong>Monitor risk and protective factors.</strong> Has anything changed in the client's life that affects risk? New stressors? Changes in relationships? Medication changes? Substance use?</p>

<p><strong>Address drivers of suicidality in treatment.</strong> Safety planning is crisis management, not treatment. The underlying drivers — depression, trauma, relationship problems, substance use, pain — need to be addressed through appropriate evidence-based treatment. Reducing suicidal ideation requires treating what is causing the ideation, not just managing the risk it creates.</p>

<p><strong>Maintain therapeutic connection.</strong> The therapeutic relationship itself is protective. A client who feels connected to their therapist, who believes the therapist genuinely cares about them, who has someone who would notice if they did not show up — that client has a reason to stay alive that may matter more than any technique.</p>`
          },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 3,
            questions: [
              { question: 'The single strongest predictor of future suicide is:', type: 'multiple_choice', options: [{ text: 'Depression severity', isCorrect: false }, { text: 'Prior suicide attempt', isCorrect: true }, { text: 'Family history', isCorrect: false }, { text: 'Male gender', isCorrect: false }], explanation: 'Prior suicide attempt is the strongest predictor, conferring 30-40 times higher risk.' },
              { question: 'According to the Interpersonal Theory of Suicide, lethal behavior requires:', type: 'multiple_choice', options: [{ text: 'Depression alone', isCorrect: false }, { text: 'Thwarted belongingness, perceived burdensomeness, and acquired capability', isCorrect: true }, { text: 'Access to means', isCorrect: false }, { text: 'Psychosis', isCorrect: false }], explanation: 'Joiner\'s theory identifies the intersection of these three factors as necessary for lethal suicidal behavior.' },
              { question: 'Men die by suicide at approximately what rate compared to women?', type: 'multiple_choice', options: [{ text: 'Equal rate', isCorrect: false }, { text: 'Half the rate', isCorrect: false }, { text: 'Four times the rate', isCorrect: true }, { text: 'Ten times the rate', isCorrect: false }], explanation: 'Men die by suicide approximately four times more often than women, largely due to method lethality.' },
              { question: 'Research shows that asking about suicide:', type: 'multiple_choice', options: [{ text: 'Increases suicidal ideation', isCorrect: false }, { text: 'Has no effect on suicidal behavior', isCorrect: false }, { text: 'Does not increase risk and may provide relief', isCorrect: true }, { text: 'Should be avoided to prevent planting ideas', isCorrect: false }], explanation: 'Research consistently shows asking about suicide does not increase risk and often provides relief.' },
              { question: 'The Columbia-Suicide Severity Rating Scale (C-SSRS) assesses:', type: 'multiple_choice', options: [{ text: 'Only completed suicide attempts', isCorrect: false }, { text: 'Suicidal ideation on a scale plus suicidal behavior', isCorrect: true }, { text: 'Depression severity only', isCorrect: false }, { text: 'Personality disorders', isCorrect: false }], explanation: 'The C-SSRS assesses ideation on a 5-point scale and various categories of suicidal behavior.' },
              { question: 'A safety plan differs from a no-suicide contract in that:', type: 'multiple_choice', options: [{ text: 'There is no difference', isCorrect: false }, { text: 'Safety plans have evidence of effectiveness; no-suicide contracts do not', isCorrect: true }, { text: 'No-suicide contracts are more effective', isCorrect: false }, { text: 'Safety plans are only for hospitalized patients', isCorrect: false }], explanation: 'Safety plans are evidence-based interventions; no-suicide contracts lack evidence and provide false reassurance.' },
              { question: 'Step 2 of the Stanley-Brown Safety Plan involves:', type: 'multiple_choice', options: [{ text: 'Professional crisis services', isCorrect: false }, { text: 'Internal coping strategies', isCorrect: true }, { text: 'Means restriction', isCorrect: false }, { text: 'Warning signs', isCorrect: false }], explanation: 'Step 2 involves internal coping strategies the client can use on their own.' },
              { question: 'Means restriction counseling is most critical for which method?', type: 'multiple_choice', options: [{ text: 'Overdose', isCorrect: false }, { text: 'Cutting', isCorrect: false }, { text: 'Firearms', isCorrect: true }, { text: 'Carbon monoxide', isCorrect: false }], explanation: 'Firearms have the highest lethality (>80% case fatality) and are the most common method of suicide death.' },
              { question: 'The highest risk period following psychiatric hospitalization is:', type: 'multiple_choice', options: [{ text: 'Six months after discharge', isCorrect: false }, { text: 'The first week after discharge', isCorrect: true }, { text: 'The day before discharge', isCorrect: false }, { text: 'Risk returns to baseline immediately', isCorrect: false }], explanation: 'The first week post-discharge has suicide rates 100-200 times population average.' },
              { question: 'Hopelessness is clinically important because:', type: 'multiple_choice', options: [{ text: 'It is the same as depression', isCorrect: false }, { text: 'It is a stronger predictor of suicide than depression severity', isCorrect: true }, { text: 'It cannot be treated', isCorrect: false }, { text: 'It is rare in suicidal individuals', isCorrect: false }], explanation: 'Hopelessness about the future is a stronger suicide predictor than overall depression severity.' },
              { question: 'Which statement about suicide documentation is correct?', type: 'multiple_choice', options: [{ text: 'Stating "patient contracted for safety" is sufficient', isCorrect: false }, { text: 'Documentation should include clinical reasoning for decisions', isCorrect: true }, { text: 'Risk can be definitively predicted and documented', isCorrect: false }, { text: 'Only positive findings need to be documented', isCorrect: false }], explanation: 'Documentation should include the reasoning process, not just conclusions or contracts.' },
              { question: 'Protective factors that should be assessed include:', type: 'multiple_choice', options: [{ text: 'Only medication compliance', isCorrect: false }, { text: 'Reasons for living, social connectedness, and treatment engagement', isCorrect: true }, { text: 'Prior hospitalization history only', isCorrect: false }, { text: 'None; only risk factors matter', isCorrect: false }], explanation: 'Protective factors including reasons for living, connections, and engagement are crucial to assess.' },
              { question: 'Acute warning signs that elevate imminent risk include:', type: 'multiple_choice', options: [{ text: 'Stable mood', isCorrect: false }, { text: 'Agitation, severe anxiety, and insomnia', isCorrect: true }, { text: 'Engagement in hobbies', isCorrect: false }, { text: 'Strong appetite', isCorrect: false }], explanation: 'Agitation, anxiety, and insomnia create an unbearable state that acutely elevates risk.' },
              { question: 'The Fluid Vulnerability Theory emphasizes that suicide risk:', type: 'multiple_choice', options: [{ text: 'Is constant over time', isCorrect: false }, { text: 'Fluctuates between baseline and acute elevations', isCorrect: true }, { text: 'Only occurs during depressive episodes', isCorrect: false }, { text: 'Cannot be assessed', isCorrect: false }], explanation: 'Fluid Vulnerability Theory describes risk as fluctuating, with baseline vulnerability interacting with acute stressors.' },
              { question: 'When a client is in acute suicidal crisis in your office, you should:', type: 'multiple_choice', options: [{ text: 'End the session on time', isCorrect: false }, { text: 'Not leave them alone until safety is established', isCorrect: true }, { text: 'Refer them to a crisis line and end the session', isCorrect: false }, { text: 'Avoid discussing it to prevent escalation', isCorrect: false }], explanation: 'Do not leave a client in acute crisis alone until safety is established or higher-level care is arranged.' },
              { question: 'Step 6 of the safety plan addresses:', type: 'multiple_choice', options: [{ text: 'Warning signs', isCorrect: false }, { text: 'Professional resources', isCorrect: false }, { text: 'Making the environment safe (means restriction)', isCorrect: true }, { text: 'Internal coping', isCorrect: false }], explanation: 'Step 6 involves reducing access to lethal means during crisis.' },
              { question: 'The 988 number connects callers to:', type: 'multiple_choice', options: [{ text: 'Emergency medical services', isCorrect: false }, { text: 'The Suicide and Crisis Lifeline', isCorrect: true }, { text: 'Police dispatch', isCorrect: false }, { text: 'Poison control', isCorrect: false }], explanation: '988 is the Suicide and Crisis Lifeline, available by call or text.' },
              { question: 'Following a suicide attempt, outpatient follow-up should occur:', type: 'multiple_choice', options: [{ text: 'Within one month', isCorrect: false }, { text: 'Within 24-72 hours', isCorrect: true }, { text: 'When the client feels ready', isCorrect: false }, { text: 'Only if the client requests it', isCorrect: false }], explanation: 'First outpatient appointment should be within 24-72 hours given the extremely high post-discharge risk.' },
              { question: 'Acquired capability in Joiner\'s model refers to:', type: 'multiple_choice', options: [{ text: 'Learning about suicide methods', isCorrect: false }, { text: 'Reduced fear of death and increased pain tolerance', isCorrect: true }, { text: 'Having financial means', isCorrect: false }, { text: 'Capacity for treatment', isCorrect: false }], explanation: 'Acquired capability involves reduced fear of death, often from prior painful or provocative experiences.' },
              { question: 'Safety plans should be:', type: 'multiple_choice', options: [{ text: 'Kept confidential in the chart only', isCorrect: false }, { text: 'Developed by the clinician alone', isCorrect: false }, { text: 'Physically accessible to the client and regularly reviewed', isCorrect: true }, { text: 'Created once and never changed', isCorrect: false }], explanation: 'Plans should be accessible, collaboratively developed, and regularly reviewed and updated.' }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Managing suicidal risk: A collaborative approach (2nd ed.)', author: 'Jobes, D. A.', year: 2016, source: 'Guilford Press' },
      { title: 'Why people die by suicide', author: 'Joiner, T.', year: 2005, source: 'Harvard University Press' },
      { title: 'Brief interventions and brief therapies for substance abuse: TIP 34', author: 'SAMHSA', year: 2012, source: 'HHS Publication' },
      { title: 'Safety planning intervention: A brief intervention to mitigate suicide risk', author: 'Stanley, B., & Brown, G. K.', year: 2012, source: 'Cognitive and Behavioral Practice, 19(2), 256-264' },
      { title: 'Treating suicidal behavior: An effective, time-limited approach', author: 'Rudd, M. D., Joiner, T., & Rajab, M. H.', year: 2001, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE: Psychopharmacology for Counselors (3 CEU - Clinical)
  // ============================================
  {
    slug: 'psychopharmacology-for-counselors',
    title: 'Psychopharmacology for Counselors: Understanding Medications in Mental Health',
    subtitle: 'Build essential knowledge of psychiatric medications to enhance collaborative care and client outcomes',
    description: 'Non-prescribing mental health professionals increasingly work with clients who take psychiatric medications. This practical 3-hour course provides counselors with foundational knowledge of psychopharmacology, including major medication classes, mechanisms of action, common side effects, and implications for therapy. Learn to collaborate effectively with prescribers, recognize medication issues, and support clients through informed, integrated care.',
    thumbnail: '/images/courses/psychopharmacology.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Explain why counselors need psychopharmacology knowledge despite not prescribing',
      'Describe the major classes of psychiatric medications and their primary uses',
      'Identify common antidepressants and understand mechanisms of action',
      'Recognize anxiolytic medications and their appropriate use',
      'Understand mood stabilizers and their role in bipolar disorder treatment',
      'Describe antipsychotic medications for psychosis and augmentation',
      'Identify common side effects and recognize signs requiring medical attention',
      'Communicate effectively with prescribers and support medication adherence'
    ],
    modules: [
      {
        title: 'Why Counselors Need Psychopharmacology Knowledge',
        order: 1,
        lessons: [
          {
            title: 'The Role of Medication Knowledge in Counseling Practice',
            type: 'text',
            duration: 15,
            order: 1,
            content: `<h2>The Role of Medication Knowledge in Counseling Practice</h2>

<p>Counselors and other non-prescribing mental health professionals may wonder why they need to understand psychiatric medications. The answer is simple: the majority of clients seeking mental health treatment are taking psychotropic medications, and understanding these medications enhances every aspect of clinical care. Knowledge of psychopharmacology is not about expanding scope of practice or replacing prescribers — it is about being a more effective, integrated, and collaborative clinician.</p>

<h2>The Reality of Combined Treatment</h2>

<p>Research consistently demonstrates that for many conditions, combined treatment — psychotherapy plus medication — produces better outcomes than either alone. Depression, anxiety disorders, bipolar disorder, and psychotic disorders are commonly treated with medication, often in conjunction with therapy. As a counselor, you will regularly work with clients who take one or more psychiatric medications. Understanding what these medications do, how they work, and what side effects to expect makes you a better partner in their care.</p>

<p>Consider the clinical situations you may encounter: A client reports their antidepressant "isn't working" after one week. A client wants to stop their mood stabilizer because they feel "fine now." A client mentions a new symptom that could be a medication side effect or a worsening of their condition. A client asks you whether they should take the medication their doctor prescribed. Each of these situations requires medication knowledge to navigate effectively — not to prescribe or adjust medications, but to provide accurate information, identify issues requiring prescriber attention, and support informed client decision-making.</p>

<h2>Enhancing Therapeutic Alliance and Treatment</h2>

<p>Clients often have questions, concerns, and ambivalence about psychiatric medications. They may have experienced stigma, encountered negative media portrayals, or had previous bad experiences with medications. When counselors understand medications, they can address misconceptions, validate legitimate concerns, and provide balanced information that supports client autonomy without undermining medical treatment.</p>

<p>Understanding medications also helps counselors recognize when symptoms may be medication-related versus psychological. A client who develops anxiety may be experiencing a medication side effect, caffeine interaction, withdrawal from a recently discontinued medication, or an exacerbation of their underlying anxiety disorder — the therapeutic response differs depending on the cause. A counselor with medication knowledge can generate these hypotheses and facilitate appropriate medical consultation.</p>

<p>Medication knowledge also informs therapy itself. Understanding that antidepressants typically take 4-6 weeks to reach full effect helps counselors provide realistic expectations and support clients through the waiting period. Knowing that benzodiazepines can interfere with exposure therapy outcomes influences treatment planning. Understanding that lithium requires blood level monitoring explains why a client must have regular lab work. This knowledge shapes clinical decision-making in direct and practical ways.</p>

<h2>Scope of Practice Boundaries</h2>

<p>Understanding medications does not expand a counselor's scope of practice. Counselors should not recommend specific medications, suggest dosage changes, or advise clients to discontinue medications. These are prescriber decisions. However, counselors can and should: educate clients about general medication principles, help clients develop questions for their prescribers, identify concerning symptoms that require prescriber notification, support medication adherence through motivational and practical interventions, and collaborate with prescribers as part of the treatment team.</p>

<p>When clients ask direct prescribing questions ("Should I take this medication?"), an appropriate response is: "That's really a question for your prescriber, who knows your full medical history. But I can help you think through your concerns and develop questions to ask them. What specifically is worrying you about taking it?" This approach respects scope boundaries while providing therapeutic support.</p>`
          }
        ]
      },
      {
        title: 'Antidepressant Medications',
        order: 2,
        lessons: [
          {
            title: 'Understanding Antidepressants',
            type: 'text',
            duration: 25,
            order: 1,
            content: `<h2>Understanding Antidepressants</h2>

<p>Antidepressants are among the most commonly prescribed psychiatric medications, used not only for depression but also for anxiety disorders, OCD, chronic pain, insomnia, and other conditions. Understanding the major classes of antidepressants, their mechanisms, and their clinical characteristics helps counselors support clients through treatment and recognize issues requiring medical attention.</p>

<h2>SSRIs: Selective Serotonin Reuptake Inhibitors</h2>

<p>SSRIs are typically first-line medications for depression and anxiety due to their relatively favorable side effect profile and safety in overdose. Common SSRIs include fluoxetine (Prozac), sertraline (Zoloft), paroxetine (Paxil), citalopram (Celexa), escitalopram (Lexapro), and fluvoxamine (Luvox).</p>

<p><strong>Mechanism:</strong> SSRIs block the reuptake of serotonin in the synaptic cleft, increasing serotonin availability. The monoamine hypothesis suggests that depression involves deficient serotonin (and/or norepinephrine and dopamine), and increasing these neurotransmitters alleviates symptoms. While this model is oversimplified, it captures the basic pharmacological principle.</p>

<p><strong>Timeline:</strong> A critical clinical point is that SSRIs do not work immediately. Clients typically experience side effects before benefits — nausea, headache, and activation in the first week, with therapeutic effects emerging over 4-6 weeks. Full response may take 8-12 weeks. Counselors can help clients understand this timeline and persist through the initial adjustment period rather than discontinuing prematurely.</p>

<p><strong>Common side effects:</strong> Gastrointestinal symptoms (nausea, diarrhea), headache, sexual dysfunction (decreased libido, delayed orgasm), weight changes, sleep disturbance, and emotional blunting. Sexual side effects are particularly common and underreported — counselors should feel comfortable asking about them, as they significantly impact quality of life and medication adherence.</p>

<p><strong>Discontinuation syndrome:</strong> Stopping SSRIs abruptly (especially short half-life medications like paroxetine) can produce discontinuation symptoms: dizziness, "brain zaps," flu-like symptoms, irritability, and insomnia. This is not addiction — it is physiological adaptation. Medications should be tapered gradually under prescriber supervision.</p>

<h2>SNRIs: Serotonin-Norepinephrine Reuptake Inhibitors</h2>

<p>SNRIs block reuptake of both serotonin and norepinephrine. Common SNRIs include venlafaxine (Effexor), duloxetine (Cymbalta), desvenlafaxine (Pristiq), and levomilnacipran (Fetzima).</p>

<p><strong>Clinical uses:</strong> SNRIs are used for depression, generalized anxiety disorder, panic disorder, neuropathic pain, and fibromyalgia. The norepinephrine component may provide benefit for fatigue, concentration, and pain that pure SSRIs do not address. Duloxetine is particularly used for depression with comorbid pain conditions.</p>

<p><strong>Side effects:</strong> Similar to SSRIs plus potential for increased blood pressure (requires monitoring, especially at higher doses of venlafaxine), increased sweating, and more significant discontinuation symptoms. Venlafaxine XR has a short half-life and must be tapered carefully.</p>

<h2>Other Antidepressants</h2>

<p><strong>Bupropion (Wellbutrin):</strong> Works on dopamine and norepinephrine, with no serotonin activity. Unique among antidepressants for having no sexual side effects and sometimes improving sexual function. Also used for smoking cessation (as Zyban) and may help with attention and energy. Can lower seizure threshold — contraindicated in eating disorders and alcohol withdrawal. Activating; can worsen anxiety in some patients.</p>

<p><strong>Mirtazapine (Remeron):</strong> Works through complex receptor mechanisms, increasing norepinephrine and serotonin release. Sedating, especially at lower doses — often used when insomnia is prominent. Stimulates appetite and causes weight gain, which may be beneficial or problematic depending on the patient. Fewer sexual side effects than SSRIs.</p>

<p><strong>Trazodone:</strong> An older antidepressant primarily used now as a sleep aid due to its sedating properties. Rarely used at antidepressant doses because of sedation, but low doses at bedtime are commonly prescribed for insomnia. Can cause priapism (rare but serious).</p>

<p><strong>TCAs (Tricyclic Antidepressants):</strong> Older medications including amitriptyline, nortriptyline, and imipramine. Effective but have significant side effects (anticholinergic: dry mouth, constipation, urinary retention, blurred vision; cardiac effects; sedation; weight gain) and are dangerous in overdose. Now used mainly for treatment-resistant depression, chronic pain, and migraine prevention.</p>

<p><strong>MAOIs (Monoamine Oxidase Inhibitors):</strong> Older medications (phenelzine, tranylcypromine) that are very effective but require strict dietary restrictions to avoid dangerous hypertensive crisis — foods containing tyramine (aged cheese, cured meats, fermented foods) must be avoided. Reserved for treatment-resistant cases.</p>

<h2>Clinical Implications for Counselors</h2>

<p>When clients are starting antidepressants, counselors should help them understand the delayed onset of action and early side effects. Support them through the "it gets worse before it gets better" period. Watch for signs of activation or worsening (especially in the first few weeks — risk of suicidal behavior may increase before depression lifts). If a client reports a new medication "isn't working" after one week, educate about timeline and encourage patience while also validating their distress.</p>

<p>When clients want to stop their antidepressant because they "feel better," explore this collaboratively. Maintenance treatment reduces relapse risk. Decisions about discontinuation should be made with the prescriber, and if discontinuation is planned, it should be gradual to avoid discontinuation syndrome.</p>`
          }
        ]
      },
      {
        title: 'Anti-Anxiety Medications',
        order: 3,
        lessons: [
          {
            title: 'Anxiolytics and Their Use',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Anxiolytics and Their Use</h2>

<p>Anxiety disorders are the most common psychiatric conditions, and multiple medication classes are used in their treatment. Understanding the different approaches to medicating anxiety helps counselors support clients and recognize when medication may be helping or hindering their progress.</p>

<h2>Benzodiazepines</h2>

<p>Benzodiazepines — including alprazolam (Xanax), lorazepam (Ativan), clonazepam (Klonopin), and diazepam (Valium) — are rapid-acting anti-anxiety medications that work by enhancing the effect of GABA, the brain's primary inhibitory neurotransmitter. They produce immediate relief, which makes them both clinically valuable and potentially problematic.</p>

<p><strong>Clinical uses:</strong> Acute anxiety, panic attacks, insomnia, alcohol withdrawal, procedural sedation, and acute agitation. Their rapid onset makes them useful for as-needed relief of acute symptoms.</p>

<p><strong>Concerns:</strong> Benzodiazepines carry significant risks that counselors should understand. Dependence develops with regular use, producing both tolerance (need for higher doses) and withdrawal (anxiety, insomnia, and potentially seizures upon discontinuation). Cognitive impairment, sedation, and psychomotor slowing are common. Fall risk is elevated, especially in older adults. Benzodiazepines are dangerous when combined with alcohol or opioids — respiratory depression can be fatal.</p>

<p>Perhaps most relevant for counselors: benzodiazepines may interfere with exposure-based treatments for anxiety. The learning that occurs during exposure — that feared situations are survivable and anxiety decreases without avoidance — may not consolidate properly when benzodiazepines are on board. Some clinicians recommend tapering benzodiazepines before or during exposure therapy, though this is a prescriber decision that should be made on a case-by-case basis.</p>

<p><strong>Current prescribing trends:</strong> Due to these concerns, many prescribers are moving away from routine benzodiazepine use, particularly for long-term treatment. SSRIs and SNRIs are preferred for ongoing anxiety management. Benzodiazepines may be used short-term while waiting for antidepressants to take effect, for breakthrough symptoms, or in specific situations where their benefits outweigh risks.</p>

<h2>Buspirone</h2>

<p>Buspirone (BuSpar) is a non-benzodiazepine anxiolytic that works on serotonin receptors. Unlike benzodiazepines, it does not produce immediate relief — it requires 2-4 weeks of consistent use to become effective. It does not cause dependence, sedation, or cognitive impairment, and does not interact dangerously with alcohol.</p>

<p><strong>Clinical reality:</strong> Buspirone is often disappointing for patients who expect the immediate relief of benzodiazepines. It works best for patients who have never used benzodiazepines and who can wait for gradual onset of effect. For generalized anxiety disorder, it can be effective, but patient expectations must be managed.</p>

<h2>Antidepressants for Anxiety</h2>

<p>SSRIs and SNRIs are first-line medications for most anxiety disorders, including generalized anxiety disorder, social anxiety disorder, panic disorder, and OCD. They take 4-8 weeks to reach full effect but do not produce dependence and address the underlying neurobiological processes rather than just suppressing symptoms.</p>

<p>An important clinical nuance: SSRIs can initially increase anxiety ("activation") before reducing it. Starting at low doses and titrating slowly helps minimize this effect. Counselors should warn clients about this possibility and encourage them to persist through the initial adjustment.</p>

<h2>Other Medications Used for Anxiety</h2>

<p><strong>Hydroxyzine (Vistaril/Atarax):</strong> An antihistamine with anxiolytic effects. Non-addictive alternative to benzodiazepines. Causes sedation, which can be therapeutic for sleep but impairing during the day.</p>

<p><strong>Beta-blockers (propranolol):</strong> Block the physical symptoms of anxiety (rapid heartbeat, tremor, sweating) without affecting the psychological experience. Often used for performance anxiety — musicians, public speakers, test-takers. Does not address generalized anxiety but can be very helpful for situational physical symptoms.</p>

<p><strong>Gabapentin (Neurontin):</strong> Originally an anticonvulsant, now frequently used off-label for anxiety. Mechanism unclear. Has some abuse potential and produces dependence with regular use, though generally considered lower risk than benzodiazepines. Commonly prescribed when benzodiazepines are contraindicated.</p>

<p><strong>Pregabalin (Lyrica):</strong> Related to gabapentin, FDA-approved for generalized anxiety disorder in Europe (not the US). Controlled substance due to abuse potential. Sometimes used when other options have failed.</p>

<h2>Implications for Counseling Practice</h2>

<p>When clients are prescribed benzodiazepines for anxiety, counselors should monitor for signs of dependence and discuss the role of medications in the context of overall treatment. For clients undergoing exposure-based treatment, coordinate with prescribers about whether and how medication use might interact with therapy goals.</p>

<p>If clients want to discontinue benzodiazepines, this must be done gradually under medical supervision — abrupt discontinuation can cause dangerous withdrawal including seizures. Support clients through the tapering process, which may temporarily increase anxiety before it improves.</p>

<p>Help clients understand that medications for anxiety are most effective as part of a comprehensive approach that includes therapy, lifestyle factors (sleep, exercise, caffeine reduction), and coping skills development. Medication alone rarely resolves anxiety disorders — it manages symptoms while therapeutic work addresses underlying patterns.</p>`
          }
        ]
      },
      {
        title: 'Mood Stabilizers',
        order: 4,
        lessons: [
          {
            title: 'Medications for Bipolar Disorder',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Medications for Bipolar Disorder</h2>

<p>Bipolar disorder is primarily managed with medication — psychotherapy alone is not sufficient to prevent mood episodes, though therapy is an important adjunct for psychoeducation, medication adherence, and management of interpersonal and lifestyle factors. Mood stabilizers reduce the frequency and severity of manic, hypomanic, and depressive episodes. Understanding these medications helps counselors support clients through what is often a complex, long-term medication journey.</p>

<h2>Lithium</h2>

<p>Lithium has been the gold standard for bipolar disorder since the 1970s. It is effective for acute mania, maintenance treatment, and — importantly — has the strongest evidence for reducing suicide risk of any psychiatric medication. Despite the availability of newer medications, lithium remains a first-line option for many patients.</p>

<p><strong>Mechanism:</strong> Lithium's exact mechanism is not fully understood. It affects multiple neurotransmitter systems and intracellular signaling pathways. It is a salt (lithium carbonate) rather than a synthesized drug, which gives it unique pharmacological properties.</p>

<p><strong>Monitoring requirements:</strong> Lithium has a narrow therapeutic window — the difference between an effective dose and a toxic dose is small. Blood levels must be monitored regularly (every few months when stable, more frequently during initiation or dose changes). Kidney function and thyroid function must also be monitored, as lithium can impair both over time.</p>

<p><strong>Side effects:</strong> Tremor, weight gain, thirst, frequent urination, cognitive dulling, thyroid dysfunction, and kidney effects. Many patients describe feeling "flat" or "not themselves" on lithium. Toxicity (from dehydration, drug interactions, or overdose) is a medical emergency presenting with severe tremor, confusion, vomiting, and neurological symptoms.</p>

<p><strong>Clinical implications:</strong> Clients on lithium need consistent hydration and salt intake — dehydration or low sodium can cause lithium levels to rise dangerously. NSAIDs (ibuprofen, naproxen) and some blood pressure medications can increase lithium levels. Clients should be educated to contact their prescriber if they experience vomiting, diarrhea, or illness that might affect hydration.</p>

<h2>Anticonvulsants as Mood Stabilizers</h2>

<p>Several anticonvulsant medications have mood-stabilizing properties and are commonly used for bipolar disorder, either alone or in combination with lithium or other agents.</p>

<p><strong>Valproate (Depakote):</strong> Effective for acute mania and maintenance. Often used when lithium is not tolerated or in rapid-cycling bipolar disorder. Side effects include weight gain, tremor, hair loss, sedation, and liver effects (requires monitoring). Teratogenic — contraindicated in pregnancy due to neural tube defects and developmental effects.</p>

<p><strong>Carbamazepine (Tegretol):</strong> Effective for mania but complex drug interactions limit use. Induces liver enzymes, affecting levels of many other medications including birth control. Requires blood monitoring for rare but serious bone marrow and skin reactions.</p>

<p><strong>Lamotrigine (Lamictal):</strong> Particularly effective for bipolar depression and maintenance, with less efficacy for acute mania. Generally well-tolerated with minimal weight gain or cognitive effects. Critical concern: must be titrated very slowly because of risk of Stevens-Johnson syndrome, a potentially fatal skin reaction. Rash developing during lamotrigine initiation requires immediate medical evaluation.</p>

<h2>Atypical Antipsychotics</h2>

<p>Several atypical antipsychotics are FDA-approved for bipolar disorder, both for acute mania and for maintenance. These include quetiapine (Seroquel), olanzapine (Zyprexa), aripiprazole (Abilify), and risperidone (Risperdal). They may be used alone or as adjuncts to traditional mood stabilizers. The side effect profiles (discussed in the antipsychotics module) must be weighed against benefits.</p>

<h2>Medication Adherence in Bipolar Disorder</h2>

<p>Medication non-adherence is one of the greatest challenges in bipolar disorder treatment. Studies suggest that 30-50% of patients do not take medications as prescribed. Reasons include: side effects (particularly weight gain, cognitive dulling, and sexual effects), missing the highs of hypomania or mania, feeling "fine" and questioning the need for medication during stable periods, stigma about taking psychiatric medications, and denial about having a chronic illness.</p>

<p>Counselors can address adherence through psychoeducation about the illness and medication, exploring ambivalence using motivational interviewing techniques, problem-solving practical barriers, monitoring for side effects and facilitating communication with prescribers, and helping clients recognize early warning signs of relapse. The goal is collaborative medication management where the client makes informed choices, understands consequences, and works with the treatment team to find an acceptable regimen.</p>

<p>Special attention is needed when clients want to stop medication because they feel well. Discontinuing mood stabilizers typically leads to relapse — often within months. If a client is determined to try life without medication, they should work with their prescriber to taper safely and have a plan for monitoring warning signs. Counselors can help with relapse prevention planning while respecting client autonomy.</p>`
          }
        ]
      },
      {
        title: 'Antipsychotic Medications',
        order: 5,
        lessons: [
          {
            title: 'Understanding Antipsychotics',
            type: 'text',
            duration: 20,
            order: 1,
            content: `<h2>Understanding Antipsychotics</h2>

<p>Antipsychotic medications are used to treat psychotic symptoms (delusions, hallucinations, disorganized thinking) in conditions including schizophrenia, schizoaffective disorder, psychotic depression, and psychosis secondary to medical conditions or substances. They are also widely used for bipolar disorder, as adjuncts in treatment-resistant depression, for severe anxiety, for agitation in dementia, and in various off-label applications. Understanding both their benefits and their significant side effects is important for any clinician working with clients who take these medications.</p>

<h2>Typical (First-Generation) Antipsychotics</h2>

<p>First-generation antipsychotics (FGAs), developed in the 1950s, include medications like haloperidol (Haldol), chlorpromazine (Thorazine), and perphenazine (Trilafon). They work primarily by blocking dopamine D2 receptors.</p>

<p><strong>Clinical use:</strong> FGAs remain effective for positive symptoms of psychosis (hallucinations, delusions, disorganization). They are less expensive than newer agents. Long-acting injectable forms (haloperidol decanoate, fluphenazine decanoate) provide an option for patients who have difficulty with daily medication adherence.</p>

<p><strong>Side effects:</strong> The major concern with FGAs is extrapyramidal symptoms (EPS) — movement disorders resulting from dopamine blockade in motor pathways. These include akathisia (internal restlessness, inability to sit still — extremely distressing and associated with suicidality if untreated), dystonia (sudden muscle contractions, potentially affecting the neck, eyes, or throat), parkinsonism (tremor, rigidity, slowed movement), and tardive dyskinesia (involuntary movements, often of the face and tongue, potentially irreversible). Tardive dyskinesia risk increases with duration of use and may persist even after medication discontinuation.</p>

<h2>Atypical (Second-Generation) Antipsychotics</h2>

<p>Second-generation antipsychotics (SGAs), introduced in the 1990s, were developed with the hope of reducing EPS while maintaining efficacy. Common SGAs include risperidone (Risperdal), olanzapine (Zyprexa), quetiapine (Seroquel), aripiprazole (Abilify), ziprasidone (Geodon), lurasidone (Latuda), paliperidone (Invega), clozapine (Clozaril), and brexpiprazole (Rexulti).</p>

<p><strong>Reduced EPS, but...</strong> SGAs generally have lower rates of EPS than FGAs (though not zero — risperidone, for example, has dose-dependent EPS). However, they brought new concerns:</p>

<p><strong>Metabolic effects:</strong> Many SGAs cause significant weight gain, glucose dysregulation (including new-onset diabetes), and lipid abnormalities. Olanzapine and clozapine are the most problematic metabolically; ziprasidone and aripiprazole are more weight-neutral. These metabolic effects contribute to the markedly reduced life expectancy (15-20 years) seen in people with schizophrenia, primarily from cardiovascular disease.</p>

<p><strong>Sedation:</strong> Particularly with quetiapine, olanzapine, and clozapine. This can be beneficial for insomnia and agitation but impairing for daily functioning.</p>

<p><strong>Other effects:</strong> Prolactin elevation (risperidone, especially — can cause breast enlargement, lactation, sexual dysfunction, and bone density loss), QTc prolongation (cardiac risk with ziprasidone and others), and anticholinergic effects (dry mouth, constipation, urinary retention).</p>

<h2>Clozapine: A Special Case</h2>

<p>Clozapine (Clozaril) is the most effective antipsychotic, uniquely effective for treatment-resistant schizophrenia, and reduces suicide risk in schizophrenia patients. However, it carries a risk of agranulocytosis (dangerous drop in white blood cells) that requires mandatory weekly-to-monthly blood monitoring. It is reserved for patients who have not responded to other antipsychotics due to this monitoring burden and its metabolic effects.</p>

<h2>Clinical Implications for Counselors</h2>

<p><strong>Recognize side effects:</strong> Counselors may be the first to notice side effects that clients have not reported to prescribers. Akathisia presents as agitation and restlessness — not to be confused with anxiety or psychotic agitation. Weight gain occurs gradually and may not be mentioned unless asked. Sedation may be normalized by clients but may be contributing to functional impairment.</p>

<p><strong>Support adherence:</strong> Antipsychotic adherence is challenging. Side effects are burdensome, and psychotic illness itself impairs insight. Clients may stop medication when they feel better, not recognizing that feeling better is because of the medication. Long-acting injectable formulations can be helpful when adherence is problematic.</p>

<p><strong>Monitor metabolic health:</strong> Encourage clients on SGAs to have regular metabolic monitoring (weight, glucose, lipids) and to attend to diet and exercise. The "obesogenic" effects of some SGAs can be partially mitigated with lifestyle attention.</p>

<p><strong>Coordinate with prescribers:</strong> When you observe concerning symptoms — new-onset movement problems, significant sedation, rapid weight gain, or worsening of psychiatric symptoms — communicate with the prescribing team. Collaborative care improves outcomes.</p>`
          }
        ]
      },
      {
        title: 'Medications for ADHD and Sleep',
        order: 6,
        lessons: [
          {
            title: 'Stimulants, Non-Stimulants, and Sleep Medications',
            type: 'text',
            duration: 15,
            order: 1,
            content: `<h2>Stimulants, Non-Stimulants, and Sleep Medications</h2>

<p>ADHD and sleep disorders frequently co-occur with other mental health conditions and may themselves present for treatment. Understanding medications for these conditions helps counselors support comprehensive care.</p>

<h2>Stimulant Medications for ADHD</h2>

<p>Stimulants remain the most effective medications for ADHD, with response rates of approximately 70-80%. They include methylphenidate formulations (Ritalin, Concerta, Focalin, Daytrana) and amphetamine formulations (Adderall, Vyvanse, Dexedrine).</p>

<p><strong>Mechanism:</strong> Stimulants increase dopamine and norepinephrine in the prefrontal cortex, improving attention, impulse control, and executive function. Despite being "stimulants," they do not typically make ADHD patients hyperactive — they organize and focus cognitive resources.</p>

<p><strong>Side effects:</strong> Decreased appetite and weight loss, insomnia (especially if taken too late in the day), increased heart rate and blood pressure, headache, irritability, and rebound symptoms as medication wears off. Rare concerns include psychotic symptoms (especially in predisposed individuals) and cardiac events (screening for cardiac history is recommended).</p>

<p><strong>Abuse potential:</strong> Stimulants are Schedule II controlled substances with abuse potential. However, research suggests that treating ADHD with stimulants actually reduces risk of substance use disorders, likely by reducing the impulsivity and self-medication behaviors associated with untreated ADHD. Diversion (giving or selling medication to others) is a concern, particularly among college students.</p>

<h2>Non-Stimulant ADHD Medications</h2>

<p><strong>Atomoxetine (Strattera):</strong> A norepinephrine reuptake inhibitor that is not a controlled substance. Takes several weeks to reach full effect. May be preferred when stimulants are contraindicated, when there is substance use history, or when stimulant side effects are intolerable.</p>

<p><strong>Guanfacine and clonidine (extended-release):</strong> Alpha-2 agonists that can help with hyperactivity and impulsivity, often as adjuncts to stimulants. Also help with tic disorders. Can cause sedation and low blood pressure.</p>

<p><strong>Viloxazine (Qelbree):</strong> A newer non-stimulant option, also working on norepinephrine.</p>

<h2>Sleep Medications</h2>

<p>Sleep disturbance is common in mental health conditions and significantly impacts treatment outcomes. Multiple medication classes are used for insomnia:</p>

<p><strong>Benzodiazepines:</strong> Temazepam (Restoril) and others are effective hypnotics but carry dependence risk and next-day sedation. Generally avoided for long-term use.</p>

<p><strong>"Z-drugs":</strong> Zolpidem (Ambien), zaleplon (Sonata), and eszopiclone (Lunesta) target benzodiazepine receptors but are more selective for sleep. Associated with parasomnias (sleepwalking, sleep-eating, sleep-driving) and dependence with long-term use.</p>

<p><strong>Trazodone:</strong> Low-dose trazodone (25-100mg) is widely used as a sleep aid — sedating antidepressant effect without the side effects of higher antidepressant doses. Non-addictive. First-line for many prescribers.</p>

<p><strong>Melatonin agonists:</strong> Ramelteon (Rozerem) works on melatonin receptors. Non-controlled. Helps with sleep onset. Also available over-the-counter as melatonin supplements.</p>

<p><strong>Orexin antagonists:</strong> Suvorexant (Belsomra) and lemborexant (Dayvigo) are newer medications blocking orexin, a wakefulness-promoting neurotransmitter. Generally well-tolerated; controlled substances.</p>

<p><strong>Sedating antidepressants and antipsychotics:</strong> Mirtazapine and quetiapine are often prescribed off-label for sleep, particularly when depression or other conditions are comorbid. Important to consider whether the full side effect profile is warranted for sleep alone.</p>

<h2>Clinical Implications</h2>

<p>When clients report sleep problems, explore behavioral factors before assuming medication is needed. Sleep hygiene, cognitive techniques, and CBT-I (cognitive behavioral therapy for insomnia) are first-line treatments with no side effects and durable benefits. Medications are appropriate when behavioral approaches are insufficient, but they work best in conjunction with sleep hygiene attention.</p>

<p>For clients taking ADHD stimulants, timing is important — medications taken too late can cause insomnia. Afternoon doses of short-acting formulations may be adjusted. Decreased appetite means clients should be encouraged to eat substantial meals when appetite is present (often morning and evening).</p>`
          },
          {
            title: 'Collaborating with Prescribers',
            type: 'text',
            duration: 15,
            order: 2,
            content: `<h2>Collaborating with Prescribers</h2>

<p>Effective mental health care often requires collaboration between prescribers (psychiatrists, psychiatric nurse practitioners, primary care physicians) and non-prescribing clinicians (counselors, psychologists, social workers). This collaboration improves outcomes by ensuring comprehensive care, facilitating communication about symptoms and side effects, and presenting a unified treatment approach to clients.</p>

<h2>Communication Practices</h2>

<p><strong>Establish contact:</strong> At intake, identify who prescribes your client's psychiatric medications and obtain consent to communicate. A simple release of information opens the door to collaborative care. Not all prescribers are equally responsive, but attempting contact establishes you as part of the treatment team.</p>

<p><strong>Know what to communicate:</strong> Relevant information for prescribers includes observations about psychiatric symptoms (worsening depression, emerging mania, increased anxiety), potential side effects the client may not have reported, concerns about adherence, substance use that may interact with medications, and significant life stressors or crises. You do not need to communicate every session detail — focus on medication-relevant clinical developments.</p>

<p><strong>Use appropriate channels:</strong> For routine updates, secure messaging through patient portals or faxed clinical summaries are appropriate. For urgent concerns (acute suicidality, severe side effects, dangerous medication interactions), phone calls or emergency protocols are warranted.</p>

<p><strong>Be specific and clinical:</strong> Prescribers respond best to specific, behavioral descriptions rather than general impressions. "Client reports sleeping 3-4 hours nightly, has decreased appetite, and tearfulness increased this week — PHQ-9 score increased from 10 to 17" is more useful than "Client seems more depressed."</p>

<h2>Supporting Medication Adherence</h2>

<p>Adherence to psychiatric medication is notoriously poor, with estimates suggesting that 40-60% of patients do not take medications as prescribed. Counselors can support adherence through several approaches:</p>

<p><strong>Explore ambivalence:</strong> Clients often have mixed feelings about medications. Using motivational interviewing techniques, explore both the benefits they experience and the concerns they have. Validate concerns rather than dismissing them. Help clients weigh pros and cons to make informed decisions.</p>

<p><strong>Problem-solve barriers:</strong> Practical barriers (cost, side effects, complexity of regimen, forgetting) are often addressable. Assist with patient assistance programs for cost, coordinate with prescribers about side effect management, help set up reminder systems, and simplify regimens when possible.</p>

<p><strong>Psychoeducation:</strong> Clients who understand why they are taking medication and what to expect are more likely to persist through initial side effects and maintain long-term adherence. Explain that antidepressants take weeks to work, that mood stabilizers prevent future episodes even when current mood is stable, and that stopping abruptly can cause withdrawal or relapse.</p>

<p><strong>Address stigma:</strong> Some clients resist medication due to internalized stigma about psychiatric treatment. Normalize medication use as one tool among many, compare to medical treatments for other conditions, and respect client autonomy while providing accurate information.</p>

<h2>When Concerns Arise</h2>

<p>If you have concerns about a client's medication treatment — the medication does not seem to be helping, side effects seem excessive, or you suspect interactions with substance use — communicate these to the prescriber. Frame observations clinically and avoid language that could be perceived as criticizing the prescriber's decisions.</p>

<p>If a client reports that they have stopped taking medication against prescriber advice, document this and encourage them to communicate with their prescriber. You cannot force medication compliance, but you can help the client understand risks and make informed choices. Safety planning may be indicated if stopping medication increases risk.</p>

<p>If you suspect a prescriber is behaving inappropriately (prescribing dangerously, romantic involvement with patient, practicing outside competence), this becomes an ethical issue that may require reporting to licensing boards after consultation with supervisors or ethics consultants.</p>

<h2>Integrated Care Models</h2>

<p>Increasingly, mental health care occurs in integrated settings where prescribers and therapists work in the same clinic with shared electronic records and regular case conferences. This model facilitates collaboration and improves outcomes. Even in traditional settings with separate prescribers and therapists, adopting an integrated mindset — viewing yourself as part of a treatment team rather than an isolated provider — improves client care. Your role in monitoring symptoms, supporting adherence, and communicating with prescribers is essential to comprehensive treatment.</p>`
          },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 3,
            questions: [
              { question: 'SSRIs typically reach full therapeutic effect in:', type: 'multiple_choice', options: [{ text: '24-48 hours', isCorrect: false }, { text: '1 week', isCorrect: false }, { text: '4-6 weeks', isCorrect: true }, { text: '3-4 months', isCorrect: false }], explanation: 'SSRIs take 4-6 weeks to reach full effect; side effects often appear before benefits.' },
              { question: 'Which antidepressant is notable for NOT causing sexual side effects?', type: 'multiple_choice', options: [{ text: 'Sertraline', isCorrect: false }, { text: 'Paroxetine', isCorrect: false }, { text: 'Bupropion', isCorrect: true }, { text: 'Fluoxetine', isCorrect: false }], explanation: 'Bupropion (Wellbutrin) works on dopamine/norepinephrine and does not cause sexual side effects.' },
              { question: 'Benzodiazepines may interfere with therapy by:', type: 'multiple_choice', options: [{ text: 'Increasing motivation', isCorrect: false }, { text: 'Preventing consolidation of learning during exposure', isCorrect: true }, { text: 'Improving memory', isCorrect: false }, { text: 'Enhancing cognitive function', isCorrect: false }], explanation: 'Benzodiazepines may interfere with the learning and memory consolidation needed for exposure therapy to be effective.' },
              { question: 'Lithium requires blood monitoring because:', type: 'multiple_choice', options: [{ text: 'It is addictive', isCorrect: false }, { text: 'It has a narrow therapeutic window', isCorrect: true }, { text: 'It is a controlled substance', isCorrect: false }, { text: 'It causes immediate weight gain', isCorrect: false }], explanation: 'Lithium has a narrow window between therapeutic and toxic doses, requiring regular blood level monitoring.' },
              { question: 'Which medication has the strongest evidence for reducing suicide risk in bipolar disorder?', type: 'multiple_choice', options: [{ text: 'Valproate', isCorrect: false }, { text: 'Lamotrigine', isCorrect: false }, { text: 'Lithium', isCorrect: true }, { text: 'Quetiapine', isCorrect: false }], explanation: 'Lithium has the strongest evidence for reducing suicide risk of any psychiatric medication.' },
              { question: 'Tardive dyskinesia is a concern primarily with:', type: 'multiple_choice', options: [{ text: 'Antidepressants', isCorrect: false }, { text: 'Benzodiazepines', isCorrect: false }, { text: 'Antipsychotics', isCorrect: true }, { text: 'Mood stabilizers', isCorrect: false }], explanation: 'Tardive dyskinesia (involuntary movements) is a potentially irreversible side effect of antipsychotic medications.' },
              { question: 'Second-generation antipsychotics differ from first-generation primarily in:', type: 'multiple_choice', options: [{ text: 'Greater efficacy', isCorrect: false }, { text: 'Lower metabolic side effects', isCorrect: false }, { text: 'Reduced extrapyramidal symptoms', isCorrect: true }, { text: 'No need for monitoring', isCorrect: false }], explanation: 'Second-generation antipsychotics have lower rates of EPS but brought concerns about metabolic effects.' },
              { question: 'Lamotrigine must be titrated slowly because of risk of:', type: 'multiple_choice', options: [{ text: 'Sedation', isCorrect: false }, { text: 'Weight gain', isCorrect: false }, { text: 'Stevens-Johnson syndrome', isCorrect: true }, { text: 'Addiction', isCorrect: false }], explanation: 'Lamotrigine requires very slow titration due to risk of Stevens-Johnson syndrome, a potentially fatal skin reaction.' },
              { question: 'SSRI discontinuation syndrome can include:', type: 'multiple_choice', options: [{ text: 'Seizures', isCorrect: false }, { text: 'Brain zaps, dizziness, and flu-like symptoms', isCorrect: true }, { text: 'Psychosis', isCorrect: false }, { text: 'Mania', isCorrect: false }], explanation: 'SSRI discontinuation can cause dizziness, "brain zaps," flu-like symptoms, and irritability — not dangerous but uncomfortable.' },
              { question: 'When a client reports a new medication "isn\'t working" after one week, the counselor should:', type: 'multiple_choice', options: [{ text: 'Recommend they stop taking it', isCorrect: false }, { text: 'Educate about timeline and encourage patience', isCorrect: true }, { text: 'Call the prescriber to change medications', isCorrect: false }, { text: 'Suggest increasing the dose', isCorrect: false }], explanation: 'Most psychiatric medications require weeks to reach effect; education about timeline helps with persistence.' },
              { question: 'Buspirone differs from benzodiazepines in that it:', type: 'multiple_choice', options: [{ text: 'Works immediately', isCorrect: false }, { text: 'Does not cause dependence', isCorrect: true }, { text: 'Is more sedating', isCorrect: false }, { text: 'Is a controlled substance', isCorrect: false }], explanation: 'Buspirone is non-habit forming and does not cause dependence, but takes weeks to become effective.' },
              { question: 'Which statement about ADHD stimulant medications is true?', type: 'multiple_choice', options: [{ text: 'They increase substance abuse risk', isCorrect: false }, { text: 'Treating ADHD with stimulants reduces substance abuse risk', isCorrect: true }, { text: 'They are not effective', isCorrect: false }, { text: 'They have no abuse potential', isCorrect: false }], explanation: 'Research shows treating ADHD with stimulants reduces substance use risk by reducing impulsivity and self-medication.' },
              { question: 'Clozapine requires mandatory blood monitoring because of risk of:', type: 'multiple_choice', options: [{ text: 'Liver failure', isCorrect: false }, { text: 'Kidney failure', isCorrect: false }, { text: 'Agranulocytosis', isCorrect: true }, { text: 'Heart attack', isCorrect: false }], explanation: 'Clozapine carries risk of agranulocytosis (dangerous drop in white blood cells) requiring regular monitoring.' },
              { question: 'Akathisia is best described as:', type: 'multiple_choice', options: [{ text: 'Sedation', isCorrect: false }, { text: 'Internal restlessness and inability to sit still', isCorrect: true }, { text: 'Tremor', isCorrect: false }, { text: 'Memory loss', isCorrect: false }], explanation: 'Akathisia is an extremely distressing inner restlessness, a side effect of antipsychotics that requires prompt attention.' },
              { question: 'When collaborating with prescribers, counselors should communicate:', type: 'multiple_choice', options: [{ text: 'Every session detail', isCorrect: false }, { text: 'Specific, clinical observations relevant to medications', isCorrect: true }, { text: 'Only positive developments', isCorrect: false }, { text: 'Nothing — it violates confidentiality', isCorrect: false }], explanation: 'Communication should focus on medication-relevant observations: symptoms, side effects, adherence, and significant changes.' },
              { question: 'Medication adherence in psychiatric conditions is estimated at:', type: 'multiple_choice', options: [{ text: '95%', isCorrect: false }, { text: '75-80%', isCorrect: false }, { text: '40-60%', isCorrect: true }, { text: '10%', isCorrect: false }], explanation: 'Studies suggest 40-60% of patients do not take psychiatric medications as prescribed.' },
              { question: 'Trazodone at low doses is commonly used for:', type: 'multiple_choice', options: [{ text: 'Psychosis', isCorrect: false }, { text: 'ADHD', isCorrect: false }, { text: 'Sleep', isCorrect: true }, { text: 'Mania', isCorrect: false }], explanation: 'Low-dose trazodone (25-100mg) is widely used as a non-addictive sleep aid.' },
              { question: 'SNRIs differ from SSRIs by also affecting:', type: 'multiple_choice', options: [{ text: 'Dopamine only', isCorrect: false }, { text: 'Norepinephrine', isCorrect: true }, { text: 'GABA', isCorrect: false }, { text: 'Glutamate', isCorrect: false }], explanation: 'SNRIs block reuptake of both serotonin and norepinephrine, which may help with fatigue and pain.' },
              { question: 'MAOIs require dietary restrictions because of:', type: 'multiple_choice', options: [{ text: 'Weight gain risk', isCorrect: false }, { text: 'Tyramine interactions causing hypertensive crisis', isCorrect: true }, { text: 'Liver toxicity', isCorrect: false }, { text: 'Sedation', isCorrect: false }], explanation: 'MAOIs interact with tyramine in foods, potentially causing dangerous hypertensive crisis.' },
              { question: 'The most appropriate response when a client asks "Should I take this medication?" is:', type: 'multiple_choice', options: [{ text: '"Yes, definitely"', isCorrect: false }, { text: '"No, medications are harmful"', isCorrect: false }, { text: 'Help them develop questions for their prescriber', isCorrect: true }, { text: '"I don\'t know anything about medications"', isCorrect: false }], explanation: 'Prescribing decisions are outside counselor scope, but helping clients articulate concerns for prescribers is appropriate.' }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Stahl\'s essential psychopharmacology (5th ed.)', author: 'Stahl, S. M.', year: 2021, source: 'Cambridge University Press' },
      { title: 'The American Psychiatric Association Publishing textbook of psychopharmacology (5th ed.)', author: 'Schatzberg, A. F., & Nemeroff, C. B.', year: 2017, source: 'American Psychiatric Publishing' },
      { title: 'Psychopharmacology for mental health professionals', author: 'Sinacola, R. S., & Peters-Strickland, T.', year: 2018, source: 'Routledge' },
      { title: 'Clinical handbook of psychotropic drugs (23rd ed.)', author: 'Procyshyn, R. M., Bezchlibnyk-Butler, K. Z., & Jeffries, J. J.', year: 2019, source: 'Hogrefe Publishing' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  }
];

const seedBatch2 = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let created = 0;
    let updated = 0;

    for (const courseData of courses) {
      const existing = await Course.findOne({ slug: courseData.slug });
      if (existing) {
        await Course.findOneAndUpdate({ slug: courseData.slug }, courseData, { new: true });
        console.log(`  Updated: ${courseData.title}`);
        updated++;
      } else {
        await Course.create(courseData);
        console.log(`  Created: ${courseData.title}`);
        created++;
      }
    }

    console.log(`\nBatch 2 complete: ${created} created, ${updated} updated`);
    await mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

if (process.argv[1].includes('seedStandardCourses_batch2')) {
  seedBatch2();
}

export default seedBatch2;
