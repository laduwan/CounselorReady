/**
 * seedCR440-The_Quiet_Crisis_Rural_Mental_Health-2CE.js
 * CR-440 | The Quiet Crisis: Identifying and Addressing Mental Health Needs
 * in Rural Communities | 2.0 CE Hours
 *
 * Source: CR-SP-203_The_Quiet_Crisis_2CE.docx (project files)
 * Run from ~/project/src/server:
 *   node src/scripts/seedCR440-The_Quiet_Crisis_Rural_Mental_Health-2CE.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = 'the-quiet-crisis-rural-mental-health';

const COURSE = {
  title: "The Quiet Crisis: Identifying and Addressing Mental Health Needs in Rural Communities",
  slug: SLUG,
  courseCode: "CR-440",
  subtitle: "Evidence-based strategies for reaching and serving rural populations",
  description: "Approximately 60 million Americans live in rural areas where access to mental health services ranges from severely limited to virtually nonexistent. This 2-hour continuing education course equips mental health professionals with knowledge, skills, and practical strategies to understand, reach, and effectively serve rural populations — including culturally responsive approaches, telehealth implementation, ethical navigation of dual relationships, and community-based service delivery models.",
  ceHours: 2,
  ceuHours: 2,
  ceuEligible: true,
  credits: 2,
  ceCategory: "Cultural Practice",
  category: "Clinical Practice",
  contentArea: "Social and Cultural Foundations; Professional Practice and Ethics",
  level: "Intermediate",
  deliveryMethod: "Asynchronous Online",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  acepNumber: "7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  accessType: "subscription",
  status: "draft",
  isPublished: false,
  maxAttempts: 3,
  objectives: [
    "Identify at least five unique barriers to mental health access in rural populations — including geographic, economic, cultural, workforce, and systemic factors — and analyze how these barriers interact to create compounding disadvantage.",
    "Apply telehealth and hybrid service delivery models appropriate for resource-limited settings, including assessment of technological readiness, clinical adaptation strategies, and management of emergencies in remote service delivery.",
    "Evaluate ethical considerations related to dual relationships, confidentiality challenges, scope of practice boundaries, and cultural competence that are distinctive to rural clinical practice, and develop strategies for navigating these dilemmas in accordance with the ACA Code of Ethics.",
    "Recognize the strengths and resilience assets of rural communities and integrate culturally responsive, strengths-based approaches into clinical work with rural populations."
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Mental Health Counselors (LMHC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "National Certified Counselors (NCC)",
    "Community Mental Health Center Clinicians",
    "Graduate-level counseling students under supervision"
  ],

  // ── SECTIONS ──────────────────────────────────────────────────────────────
  sections: [

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 1 — Miles from Help
    // ══════════════════════════════════════════════════════════════════════
    {
      title: "Miles from Help: Barriers, Disparities, and the Rural Mental Health Landscape",
      order: 1,
      contentBlocks: [

        // 1.1 DIVIDER
        {
          type: "sectionDivider",
          title: "Miles from Help",
          subtitle: "Barriers, disparities, and the rural mental health landscape",
          sectionNumber: "1",
          order: 1
        },

        // 1.2 INTRO TEXT — defining rural
        {
          type: "text",
          order: 2,
          content: `<h2>Defining Rural: Context, Culture, and Complexity</h2>
<p>The term <em>rural</em> encompasses enormous diversity, and clinicians seeking to serve rural populations must first recognize that there is no single rural experience. Rural communities vary dramatically in their geographic characteristics — from Appalachian hollows to Great Plains farming communities to remote Alaskan villages — their economic bases (agriculture, mining, timber, tourism, military installations), their demographic compositions, their proximity to urban centers, and their cultural traditions.</p>
<p>Despite this diversity, several defining characteristics of rural life have direct implications for mental health practice. Geographic isolation is the most fundamental: rural residents live in areas where distances between people, services, and institutions are substantially greater than in urban or suburban settings. This geographic reality affects every aspect of life, from social connection to economic opportunity to service access. A farmer in western Kansas may live 30 miles from the nearest town and 100 miles from the nearest mental health provider. A family in rural Appalachia may lack reliable transportation to reach services even when they exist within a theoretically reasonable distance.</p>
<p>Economic characteristics of rural communities create both direct and indirect barriers to mental health care. Rural areas generally have lower median incomes, higher poverty rates, and fewer employment opportunities than urban areas. Economic instability creates chronic stress that contributes to mental health problems while simultaneously limiting the resources available to address those problems. Many rural residents lack employer-sponsored health insurance, and even those with insurance may find that their plans have limited mental health coverage or that no in-network providers are available in their area.</p>
<p>Cultural factors in rural communities create a complex landscape that clinicians must navigate with both sensitivity and honesty. Rural culture, while diverse across regions and communities, often emphasizes values of self-reliance, independence, stoicism, privacy, family loyalty, religious faith, and connection to the land. These values are genuine strengths that contribute to resilience, community cohesion, and a strong sense of identity. However, these same values can create barriers to mental health help-seeking when self-reliance is interpreted as meaning that one should handle problems without outside help, when stoicism discourages emotional expression and disclosure of distress, or when privacy concerns make individuals reluctant to visit a mental health office in a small town where everyone knows everyone's business.</p>
<p>Stigma around mental illness operates with particular intensity in rural communities, where social visibility is high and anonymity is limited. In a small town, a person's vehicle parked outside the counselor's office may be noticed and commented upon. The counselor at the local mental health center may also be a fellow church member, the parent of a child's classmate, or a neighbor. The social cost of being identified as someone who "needs help" can be substantial in communities where social reputation is a form of currency. Research consistently identifies stigma as one of the most significant barriers to rural mental health service utilization.</p>`
        },

        // 1.3 CALLOUT — Key Statistics
        {
          type: "callout",
          order: 3,
          calloutType: "info",
          title: "Key Statistics: The Rural Mental Health Gap",
          content: `<ul>
<li>Over <strong>60 million Americans</strong> live in rural areas</li>
<li><strong>65% of rural counties</strong> have no psychiatrist</li>
<li>The rural suicide rate is <strong>1.8 times higher</strong> than in urban areas</li>
<li>Rural residents are more likely to report <strong>unmet mental health needs</strong></li>
<li>Average distance to nearest mental health provider in frontier areas: <strong>60+ miles</strong></li>
<li>Rural communities have <strong>6.4 psychologists per 100,000</strong> population vs. 33.4 in urban areas</li>
</ul>`
        },

        // 1.4 WORKFORCE CRISIS
        {
          type: "text",
          order: 4,
          content: `<h2>The Workforce Crisis: Provider Shortages and Their Consequences</h2>
<p>The mental health workforce shortage in rural America is severe, persistent, and multifactorial. According to the Health Resources and Services Administration, approximately 65% of rural counties in the United States have no psychiatrist, 47% have no psychologist, and many have no licensed mental health professionals of any discipline. The ratio of mental health providers to population in rural areas is a fraction of what exists in urban areas — rural communities have approximately 6.4 psychologists per 100,000 population compared to 33.4 per 100,000 in metropolitan areas.</p>
<p>Multiple factors contribute to this workforce shortage. Training programs for mental health professionals are overwhelmingly located in urban areas, and clinical training experiences that shape professional identity and practice preferences occur primarily in urban settings. Graduates who have trained exclusively in urban environments may feel unprepared for the unique demands of rural practice, unfamiliar with rural culture, and unattracted to rural living. Compensation in rural settings is often lower than in urban areas, and the professional isolation of being one of few or the only mental health provider in a community can be daunting.</p>
<p>Professional isolation is one of the most underappreciated challenges of rural mental health practice. In urban settings, clinicians typically work within agencies, group practices, or professional communities that provide informal consultation, peer support, continuing education, and intellectual stimulation. Rural clinicians, by contrast, may be the only mental health professional within a 50-mile radius, making it difficult to consult on complex cases, process the emotional demands of the work, or simply have a colleague who understands the unique pressures of their role. This isolation can contribute to burnout, ethical drift, clinical stagnation, and the gradual erosion of professional identity.</p>
<p>The consequences of provider shortages extend beyond simple access problems. When mental health providers are scarce, primary care physicians bear the burden of managing psychiatric conditions with limited training and support. Emergency departments become de facto mental health crisis centers. Schools become the default mental health service system for children. Law enforcement officers become first responders to psychiatric crises, a role for which they have limited training and which places both officers and individuals in crisis at risk.</p>`
        },

        // 1.5 ACCORDION — Rural populations
        {
          type: "accordion",
          order: 5,
          accordionItems: [
            {
              title: "Rural Youth Mental Health",
              content: `<p>Rural children and adolescents face mental health challenges that reflect the intersection of developmental vulnerabilities with the structural realities of rural life. Geographic isolation limits access to specialized child and adolescent mental health services and diverse social environments that support healthy development. Rural LGBTQ+ youth face compounded marginalization at the intersection of geographic isolation and minority identity — rural communities are on average more socially conservative, and LGBTQ+ youth may lack access to affirming peers, role models, and support groups.</p>`
            },
            {
              title: "Native American and Indigenous Communities",
              content: `<p>Native American and Alaska Native communities — many of which are located in rural and frontier areas — experience mental health disparities that reflect the ongoing consequences of historical trauma, systemic racism, forced assimilation policies, and the erosion of cultural practices and traditional healing systems. Suicide rates among Native American populations are among the highest of any demographic group in the United States. Culturally responsive mental health practice with Native American communities requires incorporating traditional healing practices, respecting tribal sovereignty, and addressing historical and intergenerational trauma as foundational context.</p>`
            },
            {
              title: "The Opioid Crisis in Rural America",
              content: `<p>The opioid epidemic has devastated rural communities with particular ferocity. Rural areas were disproportionately targeted by pharmaceutical marketing of prescription opioids, and as prescription opioid access was restricted, many rural residents transitioned to heroin and illicitly manufactured fentanyl. Rural overdose death rates now exceed urban rates in many states. Treatment infrastructure for opioid use disorder in rural areas remains woefully inadequate — medication-assisted treatment is limited by a shortage of waivered prescribers, and methadone must be dispensed only through certified opioid treatment programs, of which there are few in rural communities.</p>`
            },
            {
              title: "Agricultural Stress and Farmer Mental Health",
              content: `<p>Agricultural stress constitutes a unique mental health concern in farming and ranching communities. Farmers face financial uncertainty driven by commodity prices, weather events, and trade policies they cannot control; physical demands of labor-intensive work; social isolation inherent in operating large acreages; grief associated with the loss of family farms passed down through generations; and the existential stress of stewarding land in an increasingly volatile climate. Research has consistently documented elevated rates of depression, anxiety, and suicide among farmers.</p>`
            },
            {
              title: "Rural Elderly Populations",
              content: `<p>Older adults in rural communities face a convergence of factors that elevate mental health risk and limit service access. Geographic isolation intensifies with aging as driving ability declines, social networks shrink, and mobility limitations make travel increasingly difficult. Depression among rural elderly is both prevalent and underrecognized — older rural adults are less likely to identify symptoms as depression, more likely to present with somatic complaints, and more likely to view depression as a normal part of aging. Clinicians working with rural elderly populations should be skilled in geriatric assessment and comfortable with home-based service delivery.</p>`
            },
            {
              title: "Rural Veterans",
              content: `<p>Approximately 4.7 million veterans live in rural areas, and they experience higher rates of PTSD, traumatic brain injury, depression, and suicide than both their urban veteran counterparts and the rural civilian population. The Department of Veterans Affairs has historically concentrated facilities in urban areas, requiring rural veterans to travel long distances for specialty mental health care. The VA's expansion of telehealth services has helped address this gap, but barriers remain for veterans who lack reliable internet access or who prefer in-person care.</p>`
            }
          ]
        },

        // 1.6 CLINICAL VIGNETTE
        {
          type: "text",
          order: 6,
          content: `<h2>Rural Culture as Both Barrier and Strength</h2>
<p>Effective rural mental health practice requires a balanced understanding of rural culture that avoids both romanticization and pathologization. Rural communities possess genuine strengths that clinicians can leverage in service of therapeutic goals.</p>
<p>Community cohesion and social connectedness are significant strengths in many rural communities. Despite geographic distances, rural communities often maintain strong social networks based on family ties, church membership, school affiliation, shared agricultural cooperation, and long-standing neighborhood relationships. These social networks can serve as informal mental health supports. Clinicians can leverage these networks by incorporating natural helpers — such as clergy, school staff, agricultural extension agents, and respected community elders — into service delivery systems.</p>
<p>Spiritual and religious resources represent important assets in many rural communities. Churches and faith communities often serve as the primary social institutions, providing not only spiritual guidance but also social connection, practical support, community identity, and in some cases, formal counseling and crisis response. Clinicians who approach religious involvement with respect and curiosity rather than dismissal can develop collaborative relationships with clergy that enhance service delivery.</p>
<p>Connection to the land, to nature, and to the cycles of agricultural life provides many rural residents with a source of meaning, purpose, and psychological grounding that urban mental health frameworks may not adequately recognize. Clinicians who understand this connection can develop metaphors and interventions that resonate with the lived experience of rural clients, such as framing therapeutic work in terms of tending, cultivating, and weathering storms that parallel the agricultural cycle.</p>
<blockquote><strong>Clinical Vignette: The Dawson Family</strong><br>Dr. Elena Martinez has recently relocated from Phoenix, Arizona, to accept a position as the sole licensed professional counselor in a rural community mental health center serving a three-county area in southeastern Montana. Her catchment area covers approximately 8,000 square miles with a combined population of 12,000 people. The nearest psychiatrist is 180 miles away. On her third day, she receives a call from the local high school principal about Jake Dawson, age 16, whose grades have dropped dramatically, who has been getting into fights, and who told a friend he "doesn't see the point of anything anymore." Jake's father, Tom, is a third-generation cattle rancher facing potential foreclosure after two consecutive years of drought. When Elena calls to schedule an appointment, Jake's mother hesitates: "If Tom finds out I'm bringing Jake to a counselor, he'll be furious. He thinks counselors are for people who can't handle their own problems. And honestly, in a town this small, everyone will know Jake is coming to see you."</blockquote>`
        },

        // 1.7 CALLOUT — Myth vs Fact
        {
          type: "callout",
          order: 7,
          calloutType: "clinical",
          title: "Myth vs. Fact: Rural Help-Seeking",
          content: `<p><strong>MYTH:</strong> Rural people are resistant to mental health treatment because they are uneducated or unsophisticated.</p>
<p><strong>FACT:</strong> Rural resistance to treatment primarily reflects rational responses to structural barriers (distance, cost, lack of providers), legitimate privacy concerns in high-visibility communities, and cultural values that emphasize self-reliance. When culturally responsive services are made accessible, rural residents utilize them at rates comparable to urban populations.</p>`
        },

        // 1.8 REFLECTION
        {
          type: "reflection",
          order: 8,
          question: "Consider the multiple barriers facing the Dawson family: geographic distance, cultural values around self-reliance, stigma in a small community, the father's resistance, and Jake's potential suicidal ideation. What would be your first three priorities in this case? How might you address Linda's confidentiality concerns in a small-town context? What creative approaches might you consider to reach Tom, who is unlikely to come to your office voluntarily?"
        },

        // 1.9 FLASHCARD — Rural MH Terminology
        {
          type: "flashcardDeck",
          order: 9,
          instructions: "Review these key concepts from the rural mental health landscape before continuing.",
          flashcards: [
            { front: "Mental Health Professional Shortage Area (HPSA)", back: "A designation by HRSA for geographic areas, populations, or facilities with a shortage of mental health professionals. Over 6,000 HPSAs exist in the U.S., the majority in rural communities." },
            { front: "Digital Divide", back: "The gap in access to reliable broadband internet service that disproportionately affects rural communities. Approximately 21% of rural Americans lack broadband access sufficient for video-based telehealth (FCC data)." },
            { front: "Solastalgia", back: "Distress caused by environmental change in one's home environment — coined by philosopher Glenn Albrecht. Relevant to farmers and ranchers who witness the degradation of landscapes and ways of life that have defined their communities for generations." },
            { front: "Natural Helpers", back: "Trusted community members — clergy, school staff, agricultural extension agents, community elders — who can serve as informal mental health supports and referral bridges. Key partners in rural service delivery." },
            { front: "Grow-Your-Own Programs", back: "Workforce development strategies that identify rural residents with aptitude and interest in mental health careers, support them through education and training, and expect them to return to serve their home communities." },
            { front: "Hub and Spoke Model", back: "A rural service delivery framework where a central hub facility houses intensive services (crisis stabilization, psychiatric evaluation) while distributed spoke sites provide outpatient counseling and telehealth access closer to where people live." }
          ]
        },

        // 1.10 KC 1
        {
          type: "multipleChoice",
          order: 10,
          question: "Approximately what percentage of rural counties in the United States have no psychiatrist?",
          options: [
            { text: "25%", isCorrect: false },
            { text: "45%", isCorrect: false },
            { text: "65%", isCorrect: true },
            { text: "85%", isCorrect: false }
          ],
          explanation: "HRSA data indicates that approximately 65% of rural counties lack a psychiatrist, reflecting the severe mental health workforce shortage in rural areas. This shortage has been persistent despite decades of policy attention.",
          correctAnswer: 2
        },

        // 1.11 KC 2
        {
          type: "multipleChoice",
          order: 11,
          question: "The rural suicide rate compared to the urban suicide rate is approximately:",
          options: [
            { text: "The same as the urban rate", isCorrect: false },
            { text: "1.8 times higher than the urban rate", isCorrect: true },
            { text: "Half the urban rate", isCorrect: false },
            { text: "3 times higher than the urban rate", isCorrect: false }
          ],
          explanation: "Rural suicide rates are approximately 1.8 times higher than urban rates, a disparity driven by firearm access, social isolation, limited treatment availability, and cultural factors that discourage help-seeking.",
          correctAnswer: 1
        },

        // 1.12 KC 3
        {
          type: "multipleChoice",
          order: 12,
          question: "Which of the following BEST describes the relationship between rural culture and mental health help-seeking?",
          options: [
            { text: "Rural culture is entirely opposed to mental health treatment and cannot be reconciled with clinical services", isCorrect: false },
            { text: "Rural cultural values including self-reliance and stoicism can create barriers to help-seeking, but these same values also represent genuine strengths that can be leveraged in culturally responsive treatment", isCorrect: true },
            { text: "Rural residents uniformly prefer medication over therapy", isCorrect: false },
            { text: "Cultural factors are irrelevant to treatment engagement in rural populations", isCorrect: false }
          ],
          explanation: "Effective rural practice recognizes cultural values as both potential barriers and genuine strengths. Adapting services to honor rural identity — rather than expecting rural residents to abandon their cultural values — is the hallmark of culturally responsive rural practice.",
          correctAnswer: 1
        }

      ] // end Section 1 contentBlocks
    }, // end Section 1

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 2 — Bridging the Gap
    // ══════════════════════════════════════════════════════════════════════
    {
      title: "Bridging the Gap: Telehealth, Ethical Navigation, and Community-Based Innovation",
      order: 2,
      contentBlocks: [

        // 2.1 DIVIDER
        {
          type: "sectionDivider",
          title: "Bridging the Gap",
          subtitle: "Telehealth, ethical navigation, and community-based innovation",
          sectionNumber: "2",
          order: 1
        },

        // 2.2 TELEHEALTH TEXT
        {
          type: "text",
          order: 2,
          content: `<h2>Telehealth as a Lifeline: Implementation and Adaptation</h2>
<p>Telehealth has emerged as the single most impactful innovation for expanding mental health access in rural communities, and the COVID-19 pandemic dramatically accelerated both the adoption of telehealth services and the regulatory changes that facilitate their delivery. For rural populations, telehealth addresses the most fundamental barrier to care — geographic distance — by bringing mental health services directly to clients in their homes, workplaces, or local community settings.</p>
<p>The evidence base for telehealth in rural mental health is strong and growing. Multiple systematic reviews and meta-analyses have demonstrated that mental health services delivered via telehealth produce clinical outcomes comparable to in-person services for a wide range of conditions including depression, anxiety, PTSD, and substance use disorders (Hilty et al., 2013). Client satisfaction with telehealth mental health services is generally high, and dropout rates are often lower than for in-person services, likely because telehealth eliminates the transportation and time barriers that contribute to missed appointments in rural settings. Research also indicates that therapeutic alliance can be established and maintained effectively through video-based sessions.</p>
<p>However, telehealth implementation in rural areas faces several challenges. The digital divide — the gap in access to reliable broadband internet service — remains a significant barrier in many rural communities. According to the Federal Communications Commission, approximately 21% of rural Americans lack access to broadband internet at speeds sufficient for video-based telehealth. Even when broadband infrastructure exists, individual households may not be able to afford internet service, and older clients may struggle with the platforms and devices required for telehealth participation.</p>
<p>Privacy considerations take on unique dimensions in rural telehealth practice. A client participating in a telehealth session from their home may lack a private space in which to speak freely, particularly in households with multiple generations or limited square footage. Agricultural workers may need to take calls from their vehicles, barns, or fields, creating both privacy and technical challenges. Clinicians should discuss privacy planning with clients at the outset of telehealth treatment, helping them identify the most private and reliable location for sessions.</p>
<p>Emergency planning is a critical component of telehealth practice with rural populations. When a client in crisis is located hours from the nearest emergency department or inpatient facility, the clinician's ability to ensure safety requires advance planning that may be more extensive than in urban telehealth practice. Clinicians should establish emergency protocols that include the client's physical location during sessions, identification of local emergency contacts, safety planning that accounts for extended response times, and agreements about circumstances under which the clinician would contact local resources without the client's immediate consent.</p>
<p>Regulatory considerations for telehealth practice across state lines have been evolving rapidly. The Psychology Interjurisdictional Compact (PSYPACT) and the Counseling Compact are interstate agreements that facilitate cross-border telehealth practice. These compacts have the potential to dramatically expand the pool of providers available to rural communities by allowing clinicians licensed in one participating state to provide services to clients in other participating states.</p>`
        },

        // 2.3 CALLOUT — Telehealth Best Practices
        {
          type: "callout",
          order: 3,
          calloutType: "tip",
          title: "Telehealth Best Practices for Rural Settings",
          content: `<ul>
<li>Conduct a <strong>technology assessment</strong> during intake: internet speed, device availability, client comfort level</li>
<li>Offer a <strong>practice session</strong> before the first clinical session</li>
<li>Have a <strong>phone backup plan</strong> for every session in case video fails</li>
<li>Discuss <strong>privacy planning</strong> explicitly — where will they take the session?</li>
<li>Establish a <strong>crisis protocol</strong> that includes local emergency resources with addresses and travel times</li>
<li>Consider <strong>asynchronous tools</strong> (secure messaging, self-guided modules) to supplement live sessions</li>
<li>Bill appropriately using <strong>telehealth-specific codes</strong></li>
</ul>`
        },

        // 2.4 INNOVATIVE MODELS TEXT
        {
          type: "text",
          order: 4,
          content: `<h2>Innovative Service Delivery Models</h2>
<p>Beyond traditional telehealth, several innovative service delivery models have emerged to address the unique challenges of rural mental health care. These models share a common principle: rather than requiring rural residents to adapt to service delivery systems designed for urban populations, they redesign service delivery to fit the realities of rural life.</p>
<p><strong>Integrated behavioral health care</strong>, in which mental health services are co-located within primary care settings, has demonstrated particular promise in rural communities. The Collaborative Care Model, developed at the University of Washington, embeds behavioral health care managers within primary care practices and provides psychiatric consultation via telehealth. This model addresses multiple rural barriers simultaneously: it eliminates the separate trip to a mental health office, reduces stigma by embedding services within the more culturally acceptable context of medical care, and extends the reach of limited psychiatric expertise. Research has consistently demonstrated that Collaborative Care produces better outcomes for depression and anxiety than usual primary care.</p>
<p><strong>School-based mental health services</strong> represent another critical access point for rural children and families. In communities where the school is the primary institutional presence, embedding mental health services within the school setting eliminates transportation barriers, reduces stigma by normalizing services as part of the school's support structure, and reaches children who might not otherwise access care. Effective school-based programs in rural areas often involve universal prevention programming for all students, targeted interventions for at-risk students, and individual and family therapy services.</p>
<p><strong>Community health worker and peer support models</strong> extend the reach of professional mental health services by training community members to provide basic mental health education, screening, support, and referral. In rural communities, these natural helpers may include farm bureau leaders, cooperative extension agents, faith community members, and other trusted individuals. Programs such as the Farm and Ranch Stress Assistance Network and Rural Mental Health First Aid train these community members to recognize signs of mental health distress and connect individuals with professional services.</p>
<p><strong>Telepsychiatry and medication management</strong> addresses the severe shortage of psychiatrists in rural areas by connecting rural clients with psychiatrists via video consultation. Research demonstrates that telepsychiatry produces clinical outcomes and patient satisfaction comparable to in-person psychiatric care, and several studies have found superior outcomes for telepsychiatry in rural settings, possibly because it eliminates the access barriers that lead to medication gaps and inconsistent follow-up.</p>
<p><strong>Faith-community partnerships</strong> leverage the central role of churches and faith communities in many rural areas. At the most basic level, faith leaders can be trained to recognize signs of mental health distress and make appropriate referrals. At a more integrated level, counselors can provide consultation to pastoral counselors, offer mental health education through church-sponsored events, or provide clinical services in church-affiliated spaces that carry less stigma than identified mental health offices.</p>`
        },

        // 2.5 CARD SORT — Service Delivery Models
        {
          type: "cardSort",
          order: 5,
          instructions: "Sort each service delivery model into the category that best describes its primary mechanism for expanding rural mental health access.",
          categories: ["Reduces Geographic Barriers", "Reduces Stigma Barriers", "Expands Workforce Capacity"],
          cards: [
            { id: "cs1", text: "Video-based telehealth delivered to a client's home", correctCategory: "Reduces Geographic Barriers" },
            { id: "cs2", text: "Collaborative Care Model embedding behavioral health in primary care", correctCategory: "Reduces Stigma Barriers" },
            { id: "cs3", text: "Grow-your-own programs supporting rural residents through mental health training", correctCategory: "Expands Workforce Capacity" },
            { id: "cs4", text: "Mobile mental health services traveling to underserved communities", correctCategory: "Reduces Geographic Barriers" },
            { id: "cs5", text: "Providing counseling sessions in a church facility rather than a labeled mental health office", correctCategory: "Reduces Stigma Barriers" },
            { id: "cs6", text: "Interstate licensure compacts allowing cross-state telehealth practice", correctCategory: "Expands Workforce Capacity" },
            { id: "cs7", text: "Telephone-based asynchronous counseling between scheduled sessions", correctCategory: "Reduces Geographic Barriers" },
            { id: "cs8", text: "Loan repayment programs for clinicians who practice in shortage areas", correctCategory: "Expands Workforce Capacity" }
          ],
          explanation: "Each of these models addresses rural mental health access from a different angle. The most effective rural systems combine all three approaches — using technology to bridge distance, embedding services in familiar settings to reduce stigma, and building pipeline programs to grow the rural workforce over time."
        },

        // 2.6 ETHICAL NAVIGATION TEXT
        {
          type: "text",
          order: 6,
          content: `<h2>Ethical Navigation in Rural Practice</h2>
<p>Rural clinical practice presents ethical challenges that are qualitatively different from those encountered in urban settings. The ACA Code of Ethics provides the framework for ethical decision-making, but the application of ethical principles to rural practice requires nuanced judgment that accounts for the realities of small-community life. Clinicians who approach rural ethics with rigid, urban-derived rules will find themselves unable to function effectively, while clinicians who abandon ethical principles in the name of rural pragmatism will compromise the quality and safety of their services. The goal is principled flexibility: maintaining the spirit and intent of ethical guidelines while adapting their application to the rural context.</p>
<p><strong>Dual relationships</strong> are virtually unavoidable in rural practice and represent the most frequently cited ethical challenge among rural clinicians. In a small community, the clinician's dentist may also be a client's spouse, the clinician's child may be on the same Little League team as a client's child, and the clinician may encounter clients at the only grocery store in town. The ACA Code of Ethics recognizes that some dual relationships are unavoidable and distinguishes between dual relationships that are exploitative or harmful and those that are benign or even beneficial. The key ethical obligations include informed consent that explicitly addresses the likelihood of community encounters, proactive discussion of how encounters outside the therapeutic setting will be handled, ongoing monitoring for power differentials and boundary violations, and documentation of ethical reasoning in clinical records.</p>
<p><strong>Confidentiality</strong> operates differently in rural settings where anonymity is limited and information travels rapidly through social networks. A client who is seen entering or leaving the counseling office in a small town may be subject to community speculation. And the clinician who hears community gossip about a client faces the challenge of managing information that was not disclosed in session and that may or may not be accurate. Proactive confidentiality management in rural settings includes discussing these realities openly with clients, developing specific agreements about what will happen when community encounters occur, and helping clients develop their own strategies for managing the visibility of their treatment engagement.</p>
<p><strong>Scope of practice</strong> considerations are amplified in rural settings where the clinician may be the only mental health provider available. A rural counselor may be called upon to provide services that would typically be handled by a specialist: conducting psychological assessments, providing substance use disorder treatment, managing cases across the lifespan. The ethical obligation to practice within one's scope of competence must be balanced against the reality that if the clinician does not provide these services, they may not be available at all. Ethical responses to this tension include pursuing additional training and supervision in areas of expanded practice, developing telehealth consultation relationships with specialists, and being transparent with clients about the limits of one's expertise.</p>
<p><strong>Self-care and sustainability</strong> are ethical imperatives for rural clinicians who may be the sole mental health provider serving an entire community. The demands of rural practice create conditions ripe for burnout. Ethical practice requires the clinician to maintain their own mental health and professional functioning, which may mean setting boundaries around availability, seeking supervision or peer consultation via telehealth, taking regular vacation despite the guilt of leaving a community without services, and advocating for organizational support including manageable caseload sizes and continuing education funding.</p>`
        },

        // 2.7 CALLOUT — Ethical Decision-Making Tool
        {
          type: "callout",
          order: 7,
          calloutType: "ethics",
          title: "Ethical Decision-Making Tool for Rural Practice",
          content: `<p>When facing an ethical dilemma in rural practice, work through these seven questions:</p>
<ol>
<li>What does the <strong>ACA Code of Ethics</strong> say about this situation?</li>
<li>How does the <strong>rural context</strong> modify the application of this principle?</li>
<li>What are the potential <strong>harms and benefits</strong> of each course of action for the client, the therapeutic relationship, and the community?</li>
<li>What would a <strong>reasonable, experienced rural practitioner</strong> do in this situation?</li>
<li>Have I <strong>consulted</strong> with a colleague, supervisor, or ethics committee?</li>
<li>Am I <strong>documenting</strong> my reasoning?</li>
<li>Am I acting in the <strong>client's best interest</strong> rather than my own convenience?</li>
</ol>`
        },

        // 2.8 MATCHING — Ethical Principles
        {
          type: "matching",
          order: 8,
          matchingInstructions: "Match each rural ethical challenge to the primary ACA Code of Ethics principle it implicates.",
          matchingPairs: [
            { term: "A rural clinician encounters a current client at the town's only grocery store", definition: "Managing dual relationships and community encounters — ACA A.6" },
            { term: "A client's neighbor calls the clinician to ask if they're treating her son", definition: "Confidentiality in a small-community context — ACA B.1" },
            { term: "A rural counselor is asked to conduct a psychological evaluation outside their training", definition: "Scope of practice boundaries — ACA C.2.a" },
            { term: "The sole rural clinician is showing signs of burnout and compassion fatigue", definition: "Counselor impairment and self-care as ethical obligation — ACA C.2.g" },
            { term: "A telehealth client participates from a shared office where others can hear", definition: "Confidentiality in technology-mediated contexts — ACA H.2.b" }
          ]
        },

        // 2.8b EMERGENCY RESPONSE & SUSTAINABLE PRACTICE TEXT
        {
          type: "text",
          order: 8,
          content: `<h2>Rural Emergency Response and Ethical Edge Cases</h2>
<p>The ethics of rural emergency response and involuntary commitment present challenges that urban practitioners rarely encounter. When a rural client presents with acute suicidal ideation and the nearest psychiatric emergency facility is three hours away, the clinician must navigate a complex decision tree that involves local law enforcement who may or may not have crisis intervention training, emergency medical services with extended response times, and hospital emergency departments that may lack psychiatric consultation. The time delays inherent in rural emergency response mean that the clinician may need to provide extended crisis intervention far beyond what would be typical in urban settings — potentially remaining with the client for hours until emergency services arrive, or arranging for trusted community members to provide safety monitoring. These situations underscore the importance of comprehensive safety planning that accounts for rural response realities, pre-established relationships with local emergency services, and advance directives that document the client's preferences for crisis intervention.</p>
<p>Boundary management around bartering and alternative payment arrangements raises ethical questions specific to rural practice. In communities where cash is scarce and the informal economy of exchange and mutual aid is deeply embedded in social fabric, clients may offer to pay for services through goods such as farm produce, meat, or firewood, or through services such as vehicle repair, home maintenance, or childcare. The ACA Code of Ethics does not categorically prohibit bartering but notes that it should be considered only if the relationship is not exploitative, the client requests it, and such arrangements are an accepted practice among professionals in the community. Rural clinicians must evaluate each bartering proposal individually, considering power dynamics, fair value determination, the potential for the arrangement to complicate the therapeutic relationship, and the cultural context in which the proposal is made. Documentation of the clinical rationale is essential for ethical accountability.</p>
<h2>Building a Sustainable Rural Practice</h2>
<p>For clinicians committed to rural practice, building a sustainable career requires intentional strategies that address the unique challenges and leverage the unique rewards of this work. Sustainability encompasses financial viability, professional development, emotional wellbeing, and community integration — all of which must be actively managed over the course of a career.</p>
<p>Community integration is both a clinical asset and a professional necessity in rural practice. Clinicians who are perceived as part of the community rather than outsiders will be more effective at building trust, generating referrals, and maintaining therapeutic relationships. Community integration strategies include participating in local events and organizations, shopping locally, attending community celebrations, and investing in relationships with key community stakeholders including primary care providers, school administrators, clergy, agricultural extension agents, and local government officials. The challenge is maintaining professional boundaries while being genuinely engaged in community life — a balance that requires ongoing reflection and intentionality.</p>
<p>Professional development in rural practice requires creative approaches to overcome geographic isolation from training opportunities. Telehealth-based supervision and consultation groups connect rural clinicians with peers and mentors across distances, providing the clinical support and intellectual stimulation that sustain professional growth. Online continuing education, while not a substitute for the relational learning of face-to-face training, expands access to specialized content that would otherwise require costly travel. Professional organizations including the National Association for Rural Mental Health provide community, advocacy, and resources specifically designed for rural practitioners.</p>
<p>Financial sustainability in rural practice may require a diversified revenue model that combines clinical services with other income streams. Rural clinicians may provide consultation to schools, primary care practices, law enforcement agencies, and agricultural organizations, supplementing clinical income with these professional activities. Grant funding from SAMHSA and HRSA supports rural mental health programs and can fund positions, training, and infrastructure. Creative billing practices — including appropriate use of telehealth billing codes, integrated care billing, and sliding scale arrangements — are essential skills for the rural practitioner who must make services financially accessible while maintaining practice viability.</p>`
        },

        // 2.9 KC 4
        {
          type: "multipleChoice",
          order: 9,
          question: "Which of the following is the most significant technological barrier to telehealth implementation in rural communities?",
          options: [
            { text: "Most rural residents refuse to use technology", isCorrect: false },
            { text: "The digital divide, with approximately 21% of rural Americans lacking broadband internet access sufficient for video-based telehealth", isCorrect: true },
            { text: "Telehealth platforms are not HIPAA-compliant for rural use", isCorrect: false },
            { text: "Rural cellular networks are incompatible with telehealth software", isCorrect: false }
          ],
          explanation: "The digital divide remains the most significant technological barrier, affecting approximately 21% of rural Americans according to FCC data. Clinicians must assess technological readiness during intake and be prepared to offer alternatives including telephone-based sessions and hybrid models.",
          correctAnswer: 1
        },

        // 2.10 KC 5
        {
          type: "multipleChoice",
          order: 10,
          question: "Dual relationships in rural practice are BEST managed by:",
          options: [
            { text: "Avoiding all social contact with current and potential clients", isCorrect: false },
            { text: "Recognizing that some dual relationships are unavoidable and managing them through informed consent, proactive planning, ongoing monitoring, and consultation", isCorrect: true },
            { text: "Referring all clients who are community acquaintances to urban providers", isCorrect: false },
            { text: "Ignoring dual relationship concerns because rural communities are different", isCorrect: false }
          ],
          explanation: "The ACA Code recognizes that some dual relationships are unavoidable; the ethical obligation is to manage them carefully through informed consent, planning, monitoring, and consultation. Rigid avoidance in rural settings is often impossible and may deny clients access to the only available provider.",
          correctAnswer: 1
        },

        // 2.11 KC 6
        {
          type: "multipleChoice",
          order: 11,
          question: "The Collaborative Care Model is particularly promising for rural mental health because it:",
          options: [
            { text: "Replaces the need for licensed mental health professionals entirely", isCorrect: false },
            { text: "Embeds behavioral health within primary care, reducing stigma, eliminating transportation barriers, and extending psychiatric expertise through telehealth consultation", isCorrect: true },
            { text: "Requires patients to travel to urban medical centers for treatment", isCorrect: false },
            { text: "Focuses exclusively on medication management without therapy", isCorrect: false }
          ],
          explanation: "The Collaborative Care Model addresses multiple rural barriers simultaneously by integrating mental health into primary care settings. Research consistently demonstrates better outcomes for depression and anxiety compared to usual primary care, with cost-effectiveness analyses supporting its value in resource-limited settings.",
          correctAnswer: 1
        }

      ] // end Section 2 contentBlocks
    }, // end Section 2

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 3 — Sustainable Rural Practice (Conclusion)
    // ══════════════════════════════════════════════════════════════════════
    {
      title: "Toward Sustainable Rural Practice: Integration, Advocacy, and the Path Forward",
      order: 3,
      contentBlocks: [

        // 3.1 DIVIDER
        {
          type: "sectionDivider",
          title: "Toward Sustainable Rural Practice",
          subtitle: "Integration, advocacy, and the path forward",
          sectionNumber: "3",
          order: 1
        },

        // 3.2 KEY TAKEAWAYS
        {
          type: "keyTakeaway",
          order: 2,
          title: "Course Key Takeaways",
          takeaways: [
            "Rural communities are not monolithic — geographic, economic, cultural, and demographic diversity within rural America requires regionally and culturally tailored approaches.",
            "The rural mental health workforce shortage is severe and multifactorial, requiring simultaneous strategies including loan repayment, grow-your-own programs, interstate licensure compacts, and expanded scope of practice.",
            "Telehealth is the most impactful tool for expanding rural access, but requires proactive assessment of technological readiness, privacy planning, and emergency protocols adapted for extended response times.",
            "Rural cultural values including self-reliance, stoicism, and connection to community are genuine strengths — culturally responsive practice leverages these strengths rather than pathologizing them.",
            "Dual relationships, confidentiality challenges, and scope of practice tensions are inherent in rural practice. The ethical standard is principled flexibility: maintaining the spirit of the ACA Code while adapting its application to rural realities.",
            "Self-care is an ethical imperative for rural clinicians who may be the sole provider serving an entire community. Burnout has community-level consequences for access to care.",
            "Advocacy is an integral component of sustainable rural practice — clinicians are uniquely positioned to advance policy changes that address workforce shortages, broadband gaps, and regulatory obstacles."
          ]
        },

        // 3.3b CLIMATE AND DISASTER MENTAL HEALTH
        {
          type: "callout",
          order: 4,
          calloutType: "clinical",
          title: "Emerging Challenge: Climate Change and Rural Mental Health",
          content: `<p>Agricultural communities face growing psychological consequences of extreme weather events, shifting growing seasons, water scarcity, and the economic uncertainty created by climate-related disruptions to farming and ranching operations. The concept of <strong>solastalgia</strong> — coined by philosopher Glenn Albrecht — describes the distress caused by environmental change in one's home environment. Farmers who have stewarded the same land for decades may experience profound grief when drought, flooding, or pest infestations destroy crops and threaten the viability of their operations. Ranchers may face existential uncertainty as water resources diminish and wildfire risk increases.</p>
<p>Clinicians practicing in rural areas should be prepared to address climate-related grief and anxiety as part of their clinical competency, integrating knowledge of ecological stressors into case conceptualization and treatment planning. Rural communities are also disproportionately affected by natural disasters — floods, droughts, wildfires, tornadoes — and the mental health consequences of these events compound the existing challenges of rural life. Building disaster mental health preparedness into rural practice involves pre-establishing relationships with emergency management agencies, training community members in psychological first aid, and integrating mental health assessment into post-disaster recovery processes already familiar to rural communities such as agricultural extension services and faith-based relief organizations.</p>`
        },

        // 3.3 INTEGRATIVE FRAMEWORK TEXT
        {
          type: "text",
          order: 3,
          content: `<h2>An Integrative Rural Practice Framework</h2>
<p>Effective rural mental health practice requires an integrative framework that weaves together cultural competence, clinical skill, ethical awareness, technological proficiency, and community engagement. The clinician who thrives in rural practice is not merely a therapist who happens to work in a rural area but a community mental health professional who understands the ecological context of their work, adapts evidence-based practices to local realities, builds partnerships across systems, advocates for systemic change, and maintains their own wellbeing in the face of demanding and often isolating work conditions.</p>
<p>The integrated rural practice model rests on several core principles. First, accessibility must be maximized through multiple channels including in-person services, telehealth, school-based programs, integrated primary care, community outreach, and partnerships with natural helpers. No single delivery modality will reach all rural residents, and a diversified service array increases the likelihood that each individual can find a pathway to care that fits their needs, preferences, and circumstances. Second, cultural responsiveness must go beyond surface-level awareness to encompass genuine understanding of and respect for rural values, strengths, and ways of living. Third, ethical practice must be principled but flexible, applying the spirit of ethical guidelines to the unique realities of small-community practice. Fourth, sustainability must be intentionally cultivated through self-care, professional development, community integration, diversified revenue, and advocacy for systemic change.</p>
<p>Technology-enhanced approaches show continued promise for rural mental health practice. Asynchronous telehealth, including secure messaging platforms, can provide continuity of support for rural clients who may face weeks between scheduled appointments. Mobile health applications that deliver evidence-based interventions such as CBT skills, mindfulness exercises, and mood tracking can supplement clinical services. However, all technology-enhanced approaches must be evaluated through the lens of rural accessibility — solutions that require high-bandwidth internet or advanced technical literacy may inadvertently widen rather than narrow the access gap.</p>
<p>Advocacy is an integral component of sustainable rural practice because the systemic barriers to rural mental health care will not be resolved through clinical work alone. Rural clinicians are uniquely positioned to advocate for policy changes at the local, state, and federal levels because they have firsthand knowledge of the gaps, the needs, and the innovative solutions that are working in their communities. Participating in legislative advocacy, contributing to workforce development initiatives, serving on advisory boards, and sharing stories of rural mental health challenges with policymakers are all ways that clinicians can contribute to systemic change while sustaining their own sense of purpose and agency.</p>
<p>The rewards of rural mental health practice, while different from those of urban practice, are substantial and deeply meaningful. Rural clinicians have the opportunity to make a visible, measurable difference in communities where their presence and services fill a genuine void. They develop broad clinical competence through the diverse presentations they encounter. They build deep, lasting relationships with clients and communities. For clinicians who are drawn to this work, the challenges of rural practice are matched by rewards that sustain a meaningful and impactful career in service to populations that desperately need and richly deserve access to quality mental health care.</p>`
        },

        // 3.4 REFLECTION — Final
        {
          type: "reflection",
          order: 5,
          question: "Reflect on your own clinical practice or anticipated practice setting. What is one concrete change you could make — in how you approach intake, deliver services, manage dual relationships, or engage with your community — to better serve rural clients or clients with rural backgrounds? What support would you need to make this change?"
        },

        // 3.5 REFERENCES (HTML block in conclusion section)
        {
          type: "text",
          order: 6,
          content: `<h2>References</h2>
<div class="cr-references">
<p class="cr-reference">Bird, D. C., Dempsey, P., &amp; Hartley, D. (2001). Addressing mental health workforce needs in underserved rural areas: Accomplishments and challenges. <em>Maine Rural Health Research Center.</em></p>
<p class="cr-reference">Eberhardt, M. S., &amp; Pamuk, E. R. (2004). The importance of place of residence: Examining health in rural and nonrural areas. <em>American Journal of Public Health, 94</em>(10), 1682–1686.</p>
<p class="cr-reference">Federal Communications Commission. (2020). <em>Broadband deployment report.</em> FCC.</p>
<p class="cr-reference">Hilty, D. M., Ferrer, D. C., Parish, M. B., Johnston, B., Callahan, E. J., &amp; Yellowlees, P. M. (2013). The effectiveness of telemental health: A 2013 review. <em>Telemedicine and e-Health, 19</em>(6), 444–454.</p>
<p class="cr-reference">Human, J., &amp; Wasem, C. (1991). Rural mental health in America. <em>American Psychologist, 46</em>(3), 232–239.</p>
<p class="cr-reference">Ivey-Stephenson, A. Z., Crosby, A. E., Jack, S. P., Haileyesus, T., &amp; Kresnow-Sedacca, M. J. (2017). Suicide trends among and within urbanization levels by sex, race/ethnicity, age group, and mechanism of death. <em>Morbidity and Mortality Weekly Report Surveillance Summaries, 66</em>(18), 1–16.</p>
<p class="cr-reference">Mohatt, D. F., Bradley, M. M., Adams, S. J., &amp; Morris, C. D. (2006). <em>Mental health and rural America: 1994–2005.</em> U.S. Department of Health and Human Services.</p>
<p class="cr-reference">National Advisory Committee on Rural Health and Human Services. (2017). <em>Understanding the impact of suicide in rural America.</em> NACRHHS.</p>
<p class="cr-reference">Nicholson, L. A. (2008). Rural mental health. <em>Advances in Psychiatric Treatment, 14</em>(4), 302–311.</p>
<p class="cr-reference">Rural Health Information Hub. (2023). Rural mental health. https://www.ruralhealthinfo.org/topics/mental-health</p>
<p class="cr-reference">Substance Abuse and Mental Health Services Administration. (2022). <em>National Survey on Drug Use and Health.</em> SAMHSA.</p>
<p class="cr-reference">Thomas, D., MacDowell, M., &amp; Glasser, M. (2012). Rural mental health workforce needs assessment. <em>Southern Illinois University School of Medicine.</em></p>
<p class="cr-reference">Werth, J. L., Hastings, S. L., &amp; Riding-Malon, R. (2010). Ethical challenges of practicing in rural areas. <em>Journal of Clinical Psychology, 66</em>(5), 537–548.</p>
<p class="cr-reference">American Counseling Association. (2014). <em>ACA code of ethics.</em> ACA.</p>
<p class="cr-reference">Fortney, J. C., Pyne, J. M., Mouden, S. B., Mittal, D., Hudson, T. J., Schroeder, G. W., &amp; Rost, K. M. (2013). Practice-based versus telemedicine-based collaborative care for depression in rural federally qualified health centers: A pragmatic randomized comparative effectiveness trial. <em>American Journal of Psychiatry, 170</em>(4), 414–425.</p>
<p class="cr-reference">Spence, R. A., Henderson-Smith, M., &amp; Hamm, J. (2021). Telehealth in rural settings: A systematic review of the literature. <em>Telemedicine and e-Health, 27</em>(3), 241–252.</p>
</div>`
        }

      ] // end Section 3 contentBlocks
    } // end Section 3

  ], // end sections

  // ── ASSESSMENT ─────────────────────────────────────────────────────────────
  assessment: {
    passThreshold: 0.8,
    passingScore: 80,
    questions: [
      {
        question: "According to HRSA data, approximately what percentage of Mental Health Professional Shortage Areas are located in rural communities?",
        options: [
          { text: "25%", isCorrect: false },
          { text: "50%", isCorrect: false },
          { text: "The majority (over 60%)", isCorrect: true },
          { text: "10%", isCorrect: false }
        ],
        explanation: "The majority of designated Mental Health Professional Shortage Areas are in rural communities, reflecting the persistent and severe geographic maldistribution of mental health services.",
        correctAnswer: 2
      },
      {
        question: "The rural suicide rate compared to the urban suicide rate has been:",
        options: [
          { text: "Decreasing over the past two decades", isCorrect: false },
          { text: "Remaining stable", isCorrect: false },
          { text: "Widening, with the rural rate approximately 1.8 times the urban rate", isCorrect: true },
          { text: "Equalizing as urban rates have increased", isCorrect: false }
        ],
        explanation: "The rural-urban suicide disparity has been widening, with rural rates approximately 1.8 times higher. Multiple factors contribute including firearm access, social isolation, limited treatment availability, and cultural norms that discourage help-seeking.",
        correctAnswer: 2
      },
      {
        question: "A primary care physician in a rural community asks you to provide psychiatric medication management because no psychiatrist is available. The MOST ethical response is:",
        options: [
          { text: "Agree to prescribe medications since no one else is available", isCorrect: false },
          { text: "Refuse and tell the physician the community needs to recruit a psychiatrist", isCorrect: false },
          { text: "Develop a telepsychiatry consultation relationship and provide collaborative support within your scope of practice", isCorrect: true },
          { text: "Report the physician for attempting to delegate prescribing authority", isCorrect: false }
        ],
        explanation: "Collaborative models that extend specialist expertise through telehealth consultation address scope concerns while meeting community needs. This approach maintains ethical integrity while maximizing access to care in a resource-limited setting.",
        correctAnswer: 2
      },
      {
        question: "Research on therapeutic alliance in telehealth mental health services indicates that:",
        options: [
          { text: "Alliance cannot be established via telehealth and outcomes are significantly worse", isCorrect: false },
          { text: "Alliance can be established and maintained effectively, with clinical outcomes comparable to in-person services", isCorrect: true },
          { text: "Only clients under age 30 can form alliance via telehealth", isCorrect: false },
          { text: "Alliance formation requires at least 10 in-person sessions before transitioning to telehealth", isCorrect: false }
        ],
        explanation: "Multiple meta-analyses demonstrate comparable alliance formation and clinical outcomes between telehealth and in-person mental health services. Clinicians may need to attend more intentionally to nonverbal cues and relational warmth in video-based sessions.",
        correctAnswer: 1
      },
      {
        question: "When a rural clinician encounters a client at the only grocery store in town, the MOST appropriate approach is:",
        options: [
          { text: "Pretend not to recognize the client under all circumstances", isCorrect: false },
          { text: "Follow the pre-established agreement about community encounters that was discussed during informed consent", isCorrect: true },
          { text: "Greet the client warmly and introduce them to your family", isCorrect: false },
          { text: "Immediately discuss the client's treatment progress since they brought up a concern last session", isCorrect: false }
        ],
        explanation: "Proactive planning through informed consent, including specific agreements about community encounters, is the gold standard for managing dual relationships in rural practice. This approach respects confidentiality while acknowledging the reality of small-community life.",
        correctAnswer: 1
      },
      {
        question: "The concept of the digital divide refers to:",
        options: [
          { text: "The disagreement among clinicians about whether telehealth is effective", isCorrect: false },
          { text: "The gap in access to reliable broadband internet service that disproportionately affects rural communities", isCorrect: true },
          { text: "The difference between younger and older clinicians' technology skills", isCorrect: false },
          { text: "The distinction between synchronous and asynchronous telehealth", isCorrect: false }
        ],
        explanation: "The digital divide refers specifically to disparities in broadband internet access that create barriers to telehealth utilization. Approximately 21% of rural Americans lack broadband access sufficient for video-based telehealth according to FCC data.",
        correctAnswer: 1
      },
      {
        question: "Which innovative service delivery model embeds mental health services within medical settings to reduce stigma and transportation barriers?",
        options: [
          { text: "Mobile crisis units", isCorrect: false },
          { text: "School-based mental health programs", isCorrect: false },
          { text: "The Collaborative Care Model / Integrated Behavioral Health", isCorrect: true },
          { text: "Consumer-operated peer support programs", isCorrect: false }
        ],
        explanation: "The Collaborative Care Model integrates behavioral health within primary care, addressing multiple rural barriers simultaneously. It reduces stigma by embedding services within the culturally acceptable context of medical care and eliminates the separate trip to a mental health office.",
        correctAnswer: 2
      },
      {
        question: "Agricultural stress among farmers is associated with all of the following EXCEPT:",
        options: [
          { text: "Elevated suicide rates", isCorrect: false },
          { text: "Financial uncertainty driven by commodity prices and weather", isCorrect: false },
          { text: "Lower rates of depression compared to the general population", isCorrect: true },
          { text: "Social isolation inherent in operating large acreages", isCorrect: false }
        ],
        explanation: "Research consistently documents HIGHER rates of depression among farmers, not lower rates. Agricultural stress encompasses financial uncertainty, physical demands, social isolation, grief associated with loss of family farms, and existential stress in an increasingly volatile climate.",
        correctAnswer: 2
      },
      {
        question: "A rural client expresses concern that people will see their car at your office and know they are in therapy. The BEST clinical response is to:",
        options: [
          { text: "Tell the client they are being paranoid and no one will notice", isCorrect: false },
          { text: "Acknowledge the legitimacy of this concern, discuss confidentiality protections, and explore creative solutions such as telehealth, scheduling during low-traffic times, or using a non-identified office entrance", isCorrect: true },
          { text: "Suggest the client park down the street and walk to the office", isCorrect: false },
          { text: "Discontinue treatment since the client is clearly not ready", isCorrect: false }
        ],
        explanation: "Acknowledging privacy concerns as legitimate in small communities and collaboratively problem-solving demonstrates cultural responsiveness. Privacy concerns in rural settings are not paranoia — they are rational responses to the reality of high social visibility.",
        correctAnswer: 1
      },
      {
        question: "Self-care for rural clinicians is considered an ethical imperative primarily because:",
        options: [
          { text: "State licensing boards require documentation of self-care activities", isCorrect: false },
          { text: "Rural clinicians may be the sole provider, making their sustained functioning essential to the community's access to care", isCorrect: true },
          { text: "Self-care activities generate continuing education credits", isCorrect: false },
          { text: "It reduces the need for clinical supervision", isCorrect: false }
        ],
        explanation: "When a clinician is the sole provider, their burnout or impairment has community-level consequences for access to care. The ACA Code explicitly identifies self-care as a professional obligation — it is not merely personal health maintenance but an ethical responsibility.",
        correctAnswer: 1
      },
      {
        question: "Which of the following BEST describes culturally responsive practice with rural populations?",
        options: [
          { text: "Avoiding evidence-based interventions since they were developed for urban populations", isCorrect: false },
          { text: "Adapting evidence-based interventions to fit rural cultural values and structural realities while maintaining clinical integrity", isCorrect: true },
          { text: "Using exclusively informal, non-clinical approaches since rural clients reject formal therapy", isCorrect: false },
          { text: "Applying urban clinical protocols without modification", isCorrect: false }
        ],
        explanation: "Culturally responsive rural practice adapts evidence-based approaches to honor rural values — framing therapeutic work in terms that resonate with rural identity (self-reliance, strength, resilience) and delivering services in settings and modalities that fit rural life.",
        correctAnswer: 1
      },
      {
        question: "The Hub and Spoke model for rural mental health service delivery involves:",
        options: [
          { text: "A single large clinic serving all rural residents within a 200-mile radius", isCorrect: false },
          { text: "A central hub facility with intensive services supported by distributed spoke sites closer to where people live", isCorrect: true },
          { text: "Online-only services with no in-person component", isCorrect: false },
          { text: "Primary care providers delivering all mental health services without specialist support", isCorrect: false }
        ],
        explanation: "The Hub and Spoke model balances the efficiency of centralized resources with the accessibility of distributed services. The hub provides intensive services, supervision, and backup coverage; spoke sites provide local access and telehealth access points.",
        correctAnswer: 1
      },
      {
        question: "Under the ACA Code of Ethics, dual relationships in rural practice are:",
        options: [
          { text: "Absolutely prohibited regardless of rural context", isCorrect: false },
          { text: "Recognized as sometimes unavoidable; the ethical obligation is careful management through informed consent and monitoring", isCorrect: true },
          { text: "Permissible without documentation in rural settings", isCorrect: false },
          { text: "Always harmful and should trigger automatic termination of the therapeutic relationship", isCorrect: false }
        ],
        explanation: "The ACA Code distinguishes between dual relationships that are exploitative or harmful and those that are benign or even beneficial. Rigid avoidance in rural settings is often impossible; principled flexibility guided by the spirit of the Code is the ethical standard.",
        correctAnswer: 1
      },
      {
        question: "Which of the following is a 'grow-your-own' workforce development strategy?",
        options: [
          { text: "Recruiting urban clinicians with financial bonuses to relocate to rural areas", isCorrect: false },
          { text: "Identifying rural residents with aptitude for mental health careers and supporting them through training with expectation of returning to serve their home communities", isCorrect: true },
          { text: "Importing licensed providers from other countries", isCorrect: false },
          { text: "Using AI chatbots to supplement the limited rural workforce", isCorrect: false }
        ],
        explanation: "Grow-your-own programs leverage the cultural competence and community connections that locally raised clinicians bring to their practice, addressing both workforce quantity and quality. These programs require long-term investment in pipeline development but produce clinicians who understand and are committed to their communities.",
        correctAnswer: 1
      },
      {
        question: "Emergency planning in rural telehealth practice differs from urban telehealth because:",
        options: [
          { text: "Rural clients are less likely to experience psychiatric emergencies", isCorrect: false },
          { text: "Extended emergency response times require more extensive advance safety planning, including the client's physical location, local emergency contacts, and crisis protocols that account for hours-long transport times", isCorrect: true },
          { text: "Telehealth is not permitted when clients have safety concerns", isCorrect: false },
          { text: "Rural emergency departments are better equipped to handle psychiatric emergencies", isCorrect: false }
        ],
        explanation: "When a client in crisis is located hours from the nearest emergency department or inpatient facility, the clinician's ability to ensure safety requires advance planning that is qualitatively more extensive than in urban telehealth. Pre-established emergency protocols are essential for every rural telehealth client.",
        correctAnswer: 1
      }
    ]
  },

  // ── REFERENCES ─────────────────────────────────────────────────────────────
  references: [
    { author: "Bird, D. C., Dempsey, P., & Hartley, D.", year: 2001, title: "Addressing mental health workforce needs in underserved rural areas: Accomplishments and challenges", source: "Maine Rural Health Research Center" },
    { author: "Eberhardt, M. S., & Pamuk, E. R.", year: 2004, title: "The importance of place of residence: Examining health in rural and nonrural areas", source: "American Journal of Public Health, 94(10), 1682–1686" },
    { author: "Federal Communications Commission", year: 2020, title: "Broadband deployment report", source: "FCC" },
    { author: "Hilty, D. M., Ferrer, D. C., Parish, M. B., Johnston, B., Callahan, E. J., & Yellowlees, P. M.", year: 2013, title: "The effectiveness of telemental health: A 2013 review", source: "Telemedicine and e-Health, 19(6), 444–454" },
    { author: "Human, J., & Wasem, C.", year: 1991, title: "Rural mental health in America", source: "American Psychologist, 46(3), 232–239" },
    { author: "Ivey-Stephenson, A. Z., Crosby, A. E., Jack, S. P., Haileyesus, T., & Kresnow-Sedacca, M. J.", year: 2017, title: "Suicide trends among and within urbanization levels by sex, race/ethnicity, age group, and mechanism of death", source: "Morbidity and Mortality Weekly Report Surveillance Summaries, 66(18), 1–16" },
    { author: "Mohatt, D. F., Bradley, M. M., Adams, S. J., & Morris, C. D.", year: 2006, title: "Mental health and rural America: 1994–2005", source: "U.S. Department of Health and Human Services" },
    { author: "National Advisory Committee on Rural Health and Human Services", year: 2017, title: "Understanding the impact of suicide in rural America", source: "NACRHHS" },
    { author: "Nicholson, L. A.", year: 2008, title: "Rural mental health", source: "Advances in Psychiatric Treatment, 14(4), 302–311" },
    { author: "Rural Health Information Hub", year: 2023, title: "Rural mental health", source: "https://www.ruralhealthinfo.org/topics/mental-health" },
    { author: "Substance Abuse and Mental Health Services Administration", year: 2022, title: "National Survey on Drug Use and Health", source: "SAMHSA" },
    { author: "Thomas, D., MacDowell, M., & Glasser, M.", year: 2012, title: "Rural mental health workforce needs assessment", source: "Southern Illinois University School of Medicine" },
    { author: "Werth, J. L., Hastings, S. L., & Riding-Malon, R.", year: 2010, title: "Ethical challenges of practicing in rural areas", source: "Journal of Clinical Psychology, 66(5), 537–548" },
    { author: "American Counseling Association", year: 2014, title: "ACA code of ethics", source: "ACA" },
    { author: "Fortney, J. C., Pyne, J. M., Mouden, S. B., Mittal, D., Hudson, T. J., Schroeder, G. W., & Rost, K. M.", year: 2013, title: "Practice-based versus telemedicine-based collaborative care for depression in rural federally qualified health centers", source: "American Journal of Psychiatry, 170(4), 414–425" },
    { author: "Spence, R. A., Henderson-Smith, M., & Hamm, J.", year: 2021, title: "Telehealth in rural settings: A systematic review of the literature", source: "Telemedicine and e-Health, 27(3), 241–252" }
  ],

  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  }
};

// ── SEED ──────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  // Word count validation
  let words = 0;
  for (const section of COURSE.sections) {
    for (const block of section.contentBlocks) {
      const countField = (str) => {
        if (!str) return 0;
        return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
      };
      if (block.content) words += countField(block.content);
      if (block.question) words += countField(block.question);
      if (block.explanation) words += countField(block.explanation);
      if (block.title) words += countField(block.title);
      if (block.subtitle) words += countField(block.subtitle);
      if (block.accordionItems) block.accordionItems.forEach(i => { words += countField(i.title); words += countField(i.content); });
      if (block.flashcards) block.flashcards.forEach(f => { words += countField(f.front); words += countField(f.back); });
      if (block.matchingPairs) block.matchingPairs.forEach(p => { words += countField(p.term); words += countField(p.definition); });
      if (block.options) block.options.forEach(o => { words += countField(o.text || o); });
      if (block.takeaways) block.takeaways.forEach(t => words += countField(t));
      if (block.calloutItems) block.calloutItems.forEach(i => words += countField(i));
      if (block.cards) block.cards.forEach(c => words += countField(c.text));
    }
  }
  const required = COURSE.ceHours * 6000;
  console.log(`\nWord count: ${words} / required: ${required} — ${words >= required ? '✅ PASS' : '❌ FAIL — below minimum'}`);
  if (words < required) {
    console.error('Refusing to save: word count below minimum.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Assessment validation
  const qCount = COURSE.assessment.questions.length;
  if (qCount < 15) {
    console.error(`Assessment has only ${qCount} questions — minimum 15 required.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // Options shape validation
  for (const section of COURSE.sections) {
    for (const block of section.contentBlocks) {
      if ((block.type === 'multipleChoice' || block.type === 'multiSelect') && block.options) {
        for (const opt of block.options) {
          if (typeof opt !== 'object' || !('text' in opt) || !('isCorrect' in opt)) {
            console.error(`Bad option shape in section "${section.title}", block order ${block.order}`);
            await mongoose.disconnect();
            process.exit(1);
          }
        }
      }
    }
  }

  const existing = await col.findOne({ slug: SLUG });
  if (existing) {
    await col.updateOne({ slug: SLUG }, { $set: { ...COURSE, updatedAt: new Date() } });
    console.log('Updated:', COURSE.title);
  } else {
    await col.insertOne({ ...COURSE, createdAt: new Date(), updatedAt: new Date() });
    console.log('Inserted:', COURSE.title);
  }

  const saved = await col.findOne({ slug: SLUG });
  const totalBlocks = (saved.sections || []).reduce((s, x) => s + (x.contentBlocks?.length || 0), 0);
  console.log(`\n✅ CR-440 seeded`);
  console.log(`   Sections:   ${saved.sections?.length}`);
  console.log(`   Blocks:     ${totalBlocks}`);
  console.log(`   Assessment: ${saved.assessment?.questions?.length} questions`);
  console.log(`   References: ${saved.references?.length}`);
  console.log(`   Status:     ${saved.status} / isPublished: ${saved.isPublished}`);
  console.log(`   Words:      ${words}`);

  await mongoose.disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
