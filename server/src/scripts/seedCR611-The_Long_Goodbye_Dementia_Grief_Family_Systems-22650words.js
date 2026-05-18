/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * CR-611: "The Long Goodbye" — Counseling Clients with Dementia & Their Families
 * CE Hours: 3.0 | NBCC ACEP #7760
 */
import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedCR611-The_Long_Goodbye_Dementia_Grief_Family_Systems-22650words.js
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

const COURSE = {
  title: "The Long Goodbye: Clinical Practice with Dementia, Grief, and Family Systems",
  slug: "the-long-goodbye-dementia-grief-family-systems",
  courseCode: "CR-611",
  description: "Think of a house where, room by room, the lights are slowly going out. The person is still there — in the kitchen, by the window, in a beloved chair — but you can no longer visit every room together. This course uses this metaphor of a dimming house to help clinicians conceptualize, assess, and respond to the clinical realities of working with dementia — not only with the person experiencing cognitive decline, but with the family members who grieve them while they are still alive. You will gain competency in dementia assessment, evidence-based communication strategies, grief work with caregivers, and the ethical navigation of capacity, end-of-life planning, and the complex relational terrain of a family living with progressive loss.",
  ceHours: 3,
  ceuHours: 3,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  category: "Clinical",
  ceCategory: "Clinical",
  contentArea: "Geriatric Mental Health",
  level: "Intermediate",
  accessType: "paid",
  price: 54.99,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  targetAudience: ["Licensed Professional Counselors (LPC/LPCC)", "Licensed Clinical Social Workers (LCSW)", "Licensed Marriage and Family Therapists (LMFT)", "Licensed Mental Health Counselors (LMHC)", "Psychologists", "Psychiatric Nurse Practitioners", "Clinicians in geriatric, hospital, memory care, and community mental health settings"],
  objectives: [
    "Identify the major types of neurocognitive disorders (dementia) — including Alzheimer's disease, vascular dementia, Lewy body dementia, and frontotemporal dementia — and differentiate their clinical presentations, trajectories, and assessment implications",
    "Apply at least two evidence-based communication frameworks for clinical work with clients experiencing cognitive decline, adapting therapeutic approach to stage of illness",
    "Assess and address ambiguous grief, caregiver burden, and complicated mourning in family members of clients with dementia using targeted therapeutic interventions",
    "Navigate the ethical complexities of decision-making capacity, advance care planning, and confidentiality in clinical practice with cognitively impaired older adults and their families",
    "Develop culturally responsive, family-informed treatment plans that address the systemic dimensions of living with a loved one's progressive cognitive decline"
  ],
  tags: ["dementia", "Alzheimer's disease", "neurocognitive disorders", "caregiver grief", "ambiguous loss", "family therapy", "cognitive decline", "advance care planning"],
  references: [
    { title: "The 36-Hour Day: A Family Guide to Caring for People Who Have Alzheimer Disease", author: "Mace, N. L., & Rabins, P. V.", year: 2017, source: "Johns Hopkins University Press" },
    { title: "Ambiguous Loss: Learning to Live with Unresolved Grief", author: "Boss, P.", year: 1999, source: "Harvard University Press" },
    { title: "Validation therapy for dementia", author: "Neal, M., & Barton Wright, P.", year: 2003, source: "Cochrane Database of Systematic Reviews" },
    { title: "Dementia caregiver burden: A research update and critical analysis", author: "Etters, L., Goodall, D., & Harrison, B. E.", year: 2008, source: "Current Opinion in Nursing Research, 20(5), 362–376" },
    { title: "Clinical practice guideline: Assessment and management of dementia", author: "American Psychological Association", year: 2021, source: "American Psychological Association" },
    { title: "Alzheimer's disease facts and figures", author: "Alzheimer's Association", year: 2023, source: "Alzheimer's & Dementia, 19(4)" },
    { title: "Decision making capacity in dementia: A review", author: "Moye, J., & Marson, D. C.", year: 2007, source: "Journal of Gerontology: Psychological Sciences, 62B(1), 3–11" },
    { title: "Grief and the loss of a loved one with dementia", author: "Meichsner, F., Schinköthe, D., & Wilz, G.", year: 2016, source: "Dementia, 15(6), 1418–1432" }
  ],
  assessment: { passingScore: 80, maxAttempts: 3 },
  modules: [
    {
      title: "Module 1: The Rooms That Are Still Lit — Understanding Dementia Across Its Spectrum",
      order: 1,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "The Rooms That Are Still Lit", subtitle: "Understanding Dementia Across Its Spectrum" },
        {
          type: "text",
          content: `<h2>The Dimming House: A Framework for Clinical Understanding</h2>
<p>Consider what it means to live in a house as the lights slowly go out, room by room. The kitchen stays bright for a long time — you can still make coffee, still find your way to the table. The living room dims next, then a back bedroom, then the study. The person you love is still in the house. They still respond to warmth, still reach for a familiar hand, still light up at a favorite piece of music. But you can no longer visit every room together. Some of what you shared — the elaborate dinner party stories, the ability to discuss a recent book, the recollection of a grandchild's name — exists now only in the rooms that have gone dark, accessible to only one of you.</p>

<p>This is the clinical terrain of working with dementia. It is a terrain populated not only by the person experiencing cognitive decline, but by every family member who loves them — who grieves them while they are still present, who must continuously renegotiate what relationship looks like when the partner, parent, or sibling they knew is simultaneously here and not here. The clinician who enters this territory without sufficient preparation risks both clinical ineffectiveness and significant personal distress. This course is designed to equip you for the full complexity of this work.</p>

<h2>The Epidemiology of Neurocognitive Disorders</h2>
<p>The term "dementia" has been replaced in DSM-5 by the diagnostic category of Major Neurocognitive Disorder (Major NCD), though the term dementia remains in widespread clinical and colloquial use. Major NCD is defined by significant cognitive decline from a previous level of performance in one or more cognitive domains — including complex attention, executive function, learning and memory, language, perceptual-motor ability, and social cognition — that is severe enough to interfere with independent everyday activities.</p>

<p>Approximately 6.7 million Americans aged 65 and older are currently living with Alzheimer's disease, the most common cause of dementia (Alzheimer's Association, 2023). The number is projected to grow to 13.8 million by 2060. Worldwide, approximately 55 million people are living with dementia, with nearly 10 million new cases diagnosed annually. These numbers do not capture the estimated 16 million Americans who provide unpaid care to people with Alzheimer's and other dementias — a caregiver workforce that is itself profoundly vulnerable to depression, anxiety, and burnout.</p>

<p>Race and ethnicity significantly shape dementia risk and access to care. Older Black Americans are approximately twice as likely to develop Alzheimer's disease as older non-Hispanic White Americans, driven by higher rates of cardiovascular risk factors including hypertension, diabetes, and obesity that reflect lifetimes of structural inequity. Older Hispanic/Latino Americans are approximately 1.5 times as likely to develop Alzheimer's as non-Hispanic White Americans. Despite this elevated risk, Black and Latino older adults are less likely to receive timely diagnosis and appropriate care — a disparity with profound implications for both individual wellbeing and family systems.</p>

<h2>Types of Dementia: Distinct Presentations, Distinct Clinical Implications</h2>
<p><strong>Alzheimer's Disease (AD)</strong> accounts for 60 to 80 percent of dementia cases and is the type most familiar to clinicians and the public. AD is characterized by the gradual accumulation of beta-amyloid plaques and tau tangles in the brain, beginning in the hippocampus and spreading to other cortical regions. The clinical hallmark is an amnestic presentation — memory loss that disproportionately affects recent episodic memory while leaving older autobiographical memories relatively preserved in early stages. A person with early AD may not remember what they had for breakfast but can vividly recount their wedding day forty years ago. Language difficulties (word-finding, naming), visuospatial deficits, and executive dysfunction emerge as the disease progresses. Later stages involve profound functional dependence, loss of speech, and eventually loss of basic autonomic functions.</p>

<p>For the clinician, the preserved long-term autobiographical memory of early AD creates both an opportunity and a clinical tool. Life review, reminiscence-based approaches, music therapy targeting emotionally encoded memories, and the strategic use of familiar photographs and objects can facilitate meaningful connection and therapeutic work even when recent memory is severely compromised. The person who cannot tell you what year it is may still sing every word of a hymn from childhood, recognize a grandchild's laugh, or respond with evident emotion to a piece of music from their courtship years. The lights in those rooms are still on.</p>

<p><strong>Vascular Dementia (VaD)</strong> is the second most common type, resulting from cerebrovascular disease — strokes, transient ischemic attacks, or diffuse white matter damage — that reduces blood supply to the brain. Unlike the gradual progression of AD, VaD often follows a stepwise deterioration pattern, with abrupt periods of functional decline following vascular events interspersed with periods of relative stability. Clinically, VaD frequently presents with prominent executive dysfunction, slowed processing speed, mood changes, and depression — sometimes before significant memory impairment is apparent. The involvement of frontal circuits gives VaD a distinctive clinical profile that can be confusing for clinicians expecting the amnestic pattern of Alzheimer's disease.</p>

<p><strong>Lewy Body Dementia (LBD)</strong> includes both Dementia with Lewy Bodies and Parkinson's Disease Dementia, caused by abnormal aggregates of alpha-synuclein protein (Lewy bodies) in the brain. LBD's clinical presentation is distinctive and diagnostically important: fluctuating cognition (dramatic variations in alertness and attention across hours and days), visual hallucinations (often vivid, detailed, and non-threatening — small animals, figures in the room), and Parkinsonian motor features. REM sleep behavior disorder, in which individuals physically act out dreams, is a common early feature. The fluctuating course can be confusing for families who misinterpret periods of relative clarity as evidence that the diagnosis was wrong, only to face the next wave of decline. LBD is particularly sensitive to antipsychotic medications — some can produce life-threatening neuroleptic malignant syndrome — making careful coordination with prescribers essential.</p>

<p><strong>Frontotemporal Dementia (FTD)</strong> is caused by atrophy of frontal and temporal lobes and presents in a clinically distinct way that challenges both families and clinicians. The behavioral variant (bvFTD) is characterized by personality change, disinhibition, loss of empathy, compulsive behaviors, and dietary changes — often without prominent memory impairment in early stages. A person with bvFTD may make sexually inappropriate comments, steal, lose interest in hygiene, fixate on specific foods, or abandon long-standing relationships and responsibilities — while being able to hold a conversation and recall recent events relatively intact. This presentation is profoundly disorienting for families, who may initially attribute the behavior to a psychological crisis, a moral failing, or a relationship problem rather than a neurological disease. FTD tends to affect younger adults — diagnosis between ages 45 and 65 is not uncommon — adding additional layers of disruption to family systems that are not yet organized around aging.</p>

<h2>Assessment of Neurocognitive Disorders: The Clinical Role of the Counselor</h2>
<p>While formal neuropsychological evaluation and neurological workup are beyond the scope of mental health counseling practice, counselors have an important clinical role in the recognition, monitoring, and referral process for neurocognitive disorders. The first clinical task is distinguishing cognitive changes that warrant further evaluation from those attributable to other causes — most importantly, from reversible conditions that mimic dementia.</p>

<p>Reversible causes of cognitive impairment — sometimes called "pseudodementias" — include depression, delirium, medication side effects, metabolic disturbances (hypothyroidism, vitamin B12 deficiency, electrolyte abnormalities), sleep apnea, hearing and vision loss, and normal pressure hydrocephalus. These conditions can produce cognitive symptoms indistinguishable from early dementia in clinical presentation and must be identified and addressed before a diagnosis of primary neurocognitive disorder is made. A comprehensive medical workup is essential whenever a client presents with new or worsening cognitive complaints.</p>

<p>Brief cognitive screening tools available for clinical use include the Mini-Mental State Examination (MMSE), the Montreal Cognitive Assessment (MoCA), and the Saint Louis University Mental Status (SLUMS) exam. Of these, the MoCA is generally preferred for its superior sensitivity to mild cognitive impairment and its broader coverage of executive function. However, important caveats apply: education level significantly affects performance on all screening tests, with lower educational attainment producing lower scores independent of pathology; cultural and linguistic factors affect performance; and scores should always be interpreted in the context of a comprehensive clinical interview and collateral history, not as standalone diagnostic indicators.</p>

<p>Collateral information from family members and close contacts is essential in dementia assessment. Functional changes — difficulty managing finances, getting lost in familiar environments, repeating the same questions or stories within a single conversation, mishandling medications — often emerge in collateral history before the person with cognitive decline has insight into their own changes. The Informant Questionnaire on Cognitive Decline in the Elderly (IQCODE) provides a structured format for gathering this information systematically.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 1",
          showExplanations: true,
          questions: [
            {
              question: "A client's family reports that she can vividly describe her wedding fifty years ago but cannot recall what she had for lunch today. This pattern of memory preservation is MOST consistent with:",
              type: "multipleChoice",
              options: [
                "Frontotemporal dementia with behavioral variant presentation",
                "Early Alzheimer's disease, in which recent episodic memory is impaired while older autobiographical memories are relatively preserved",
                "Lewy body dementia with fluctuating cognitive presentation",
                "Vascular dementia following a discrete stroke event"
              ],
              correctAnswer: 1,
              explanation: "Alzheimer's disease classically presents with an amnestic pattern that disproportionately affects recent episodic memory while leaving older autobiographical memories relatively intact in early stages. The hippocampus — where recent memories are encoded — is among the first regions affected. This is clinically important as it preserves access to life history, emotion-laden memories, and identity-relevant content that can be therapeutically utilized."
            },
            {
              question: "A 58-year-old client is brought for evaluation because of dramatic personality changes — disinhibition, loss of empathy, and compulsive behaviors — while his memory appears relatively intact. This presentation is MOST suggestive of:",
              type: "multipleChoice",
              options: [
                "Early Alzheimer's disease with atypical presentation",
                "Major Depressive Disorder with psychomotor features",
                "Frontotemporal dementia, behavioral variant",
                "Lewy body dementia with prominent psychiatric features"
              ],
              correctAnswer: 2,
              explanation: "The behavioral variant of frontotemporal dementia (bvFTD) presents with personality change, disinhibition, loss of empathy, and compulsive behaviors — often with relatively preserved memory in early stages. It frequently affects adults between 45 and 65. This presentation challenges families who may attribute changes to psychological or moral causes before the neurological diagnosis is made."
            },
            {
              question: "Which of the following reversible conditions can produce cognitive symptoms that mimic dementia and MUST be ruled out before diagnosing a primary neurocognitive disorder?",
              type: "multipleChoice",
              options: [
                "Osteoporosis and age-related hearing loss",
                "Depression, medication side effects, metabolic disturbances, and sleep apnea",
                "Social isolation and retirement adjustment",
                "Personality disorders and anxiety"
              ],
              correctAnswer: 1,
              explanation: "Reversible causes of cognitive impairment — including depression (depressive pseudodementia), medication side effects, metabolic disturbances (hypothyroidism, B12 deficiency), delirium, and sleep apnea — can produce cognitive symptoms indistinguishable from dementia in clinical presentation. Comprehensive medical evaluation to rule out these reversible causes is essential before diagnosing primary neurocognitive disorder."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Communication in the Dimming House: Therapeutic Approaches Across Stages</h2>
<p>One of the most clinically essential skills in working with dementia is the ability to communicate therapeutically across the stages of cognitive decline — adapting approach, language, goals, and expectations as the condition progresses while maintaining the fundamental clinical commitment to the person's dignity and wellbeing.</p>

<p><strong>Early-stage dementia</strong> is often the most clinically complex from an emotional standpoint, because insight is relatively intact. The person knows something is wrong. They have received the diagnosis, or suspect it, and they are frightened. They are watching themselves lose capabilities they relied upon. They are grieving their own cognitive future. This is the stage when counseling the person with dementia directly — in individual or family sessions — is most productive, and when advance care planning conversations are both feasible and ethically imperative.</p>

<p>Therapeutic goals in early-stage dementia counseling appropriately include: processing the emotional meaning of the diagnosis, supporting adjustment and coping, facilitating advance care planning conversations while capacity is intact, strengthening meaningful engagement and activity, supporting identity maintenance, facilitating communication within the family system, and addressing the existential dimensions of anticipated loss. Cognitive Behavioral Therapy, adapted for the cognitive profile of early dementia, and supportive therapy are both appropriate and beneficial at this stage.</p>

<p><strong>Validation Therapy</strong>, developed by Naomi Feil, offers a person-centered communication approach designed for individuals with moderate to late-stage dementia who are no longer amenable to reality orientation. Rather than correcting misperceptions or reorienting to present reality, Validation Therapy involves entering the subjective world of the person with dementia — acknowledging the emotional truth of their experience even when the cognitive content is factually inaccurate. When a client with advanced Alzheimer's disease calls out for her long-deceased mother, Validation Therapy would not correct the temporal misperception ("Your mother passed away forty years ago") but would explore the emotional need beneath the call ("It sounds like you're missing someone important. Tell me about your mother.").</p>

<p>The evidence base for Validation Therapy, while methodologically limited, suggests benefits for emotional wellbeing, reduction of agitated behavior, and quality of life. More practically, it provides a humane and therapeutically coherent framework for communication that family members can learn and implement — reducing the interpersonal friction that arises when families reflexively correct their loved one's misperceptions and encounter distress, anger, or withdrawal in response.</p>

<p><strong>Reminiscence and life history work</strong> have demonstrated particular value across the middle stages of dementia. Long-term autobiographical memory, encoded with strong emotional associations, is more durable than recent declarative memory in Alzheimer's disease. A person who cannot consistently recognize their adult children may still respond with evident emotion to their wedding photograph, to the music of their courtship, or to objects from their working life. Structured reminiscence approaches — using photograph albums, music, sensory objects, and life story books — facilitate meaningful engagement and preserve identity-relevant connection even as cognitive capacity diminishes.</p>`
        }
      ]
    },
    {
      title: "Module 2: The Grief That Has No End — Ambiguous Loss and Caregiver Wellbeing",
      order: 2,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "The Grief That Has No End", subtitle: "Ambiguous Loss and Caregiver Wellbeing" },
        {
          type: "text",
          content: `<h2>Pauline Boss and the Concept of Ambiguous Loss</h2>
<p>In 1999, family therapist Pauline Boss introduced the concept of ambiguous loss to describe a particular type of loss that is uniquely difficult because it defies the usual social rituals and psychological processes through which grief is recognized and resolved. Boss identified two types of ambiguous loss: the physically absent but psychologically present (a soldier listed as missing in action, a child placed for adoption) and the physically present but psychologically absent. Dementia is the paradigmatic example of the second type.</p>

<p>The family member of a person with dementia experiences a deeply disorienting grief: the person they love is physically present — breathing, eating, sometimes smiling — but the person they knew is increasingly absent. The conversations they used to have, the memories they shared, the mutual recognition that sustained the relationship — these are disappearing while the body remains. There is no funeral, no socially sanctioned period of mourning, no casserole brought to the door, no condolences offered. Instead, there is ambiguity — the persistent question of who, exactly, this person is now, whether the relationship still exists in meaningful form, and whether the love one feels for them is appropriately directed at the person who is present or at the person who has been lost.</p>

<p>For clinicians, Boss's framework is invaluable because it names and validates an experience that family caregivers frequently describe but struggle to articulate. The adult child who says "I already feel like I've lost my mother, but she's right there in the living room" is not being dramatic or anticipatory — they are accurately describing the phenomenology of ambiguous loss. The spouse who says "I don't know who this person is anymore — it's like living with a stranger" is articulating the profoundly disorienting identity disruption that progressive dementia introduces into an intimate relationship of decades.</p>

<p>The clinical implication is significant: family members of people with dementia need grief support even — and sometimes especially — while their loved one is still alive. This "anticipatory grief" or "pre-mortem grief" is a legitimate and appropriate therapeutic focus that requires specific clinical attention, not minimization or redirection toward the present.</p>

<h2>Caregiver Burden: The Statistics Behind the Stories</h2>
<p>The epidemiology of caregiver burden in dementia is staggering. Approximately 16 million Americans provide unpaid care to persons with Alzheimer's and other dementias — care that is disproportionately provided by women (60 to 70 percent of caregivers are female), by spouses, and by adult children who are often simultaneously managing their own careers, children, and marriages. The median duration of caregiving is four to eight years, and approximately one-third of dementia caregivers provide care for more than five years.</p>

<p>The mental health consequences for caregivers are severe and well-documented. Depression affects 30 to 50 percent of dementia caregivers — significantly higher rates than in the general population or in caregivers of non-dementia conditions. Anxiety, social isolation, chronic fatigue, and burnout are pervasive. Physical health consequences include elevated rates of hypertension, suppressed immune function, and elevated cortisol — leading to the grim finding that dementia caregivers have higher rates of morbidity and mortality than age-matched non-caregivers.</p>

<p>Caregiver burden is not merely a function of the severity of the care recipient's impairment — it is shaped by the quality of the relationship between caregiver and care recipient before the illness, the social support available to the caregiver, the cultural context shaping expectations about caregiving responsibility, the caregiver's own mental and physical health status, and the presence or absence of competing demands including employment, childcare, and financial stress. Understanding the individual caregiver's burden within this multidimensional framework is essential to effective clinical intervention.</p>

<h2>The Marital Relationship in the Presence of Dementia</h2>
<p>When the person with dementia is a spouse, the clinical terrain becomes particularly complex. The marriage itself — the mutual recognition, the reciprocal support, the shared history and future — is profoundly disrupted by dementia in ways that are qualitatively different from any other relational experience. The well spouse may find themselves simultaneously a partner and a caregiver, simultaneously grieving and providing, simultaneously maintaining a marital relationship with someone who may no longer recognize them as their spouse.</p>

<p>Sexual and intimate dimensions of the marital relationship are profoundly affected by dementia but are among the least likely to be discussed in clinical settings, both because of clinician discomfort and because of the complex ethical questions involved. Consent to sexual activity requires decision-making capacity, and whether a person with dementia retains this capacity in a particular moment is a nuanced question that cannot be answered categorically. Clinicians must be prepared to have explicit conversations about intimacy, consent, and the changing dimensions of spousal relationship in the context of cognitive decline — both to support the well spouse's own experience of loss and to ensure ethical practice.</p>

<p>Role reversal is another profound dimension of spousal caregiving for dementia. The spouse who has always been cared for by their partner, or who organized their identity around the competence and leadership of their partner, may face not only grief but a fundamental renegotiation of self that the disease does not allow time or space to process. The wife who says "He was always the one who handled everything — finances, the car, decisions — and now I have to be him and also take care of him" is experiencing a role transition of enormous magnitude for which neither partner prepared.</p>

<h2>Adult Children as Caregivers: The Sandwich Generation</h2>
<p>Adult children who are primary caregivers for a parent with dementia — often while also raising their own children and managing careers — are frequently in a state of sustained depletion that they cannot fully name or acknowledge because the social narrative of caregiving is coded as noble, self-sacrificing, and unconditionally loving. The adult child who feels resentment, relief at the prospect of their parent's death, anger at siblings who have delegated all caregiving responsibility, or ambivalence about the relationship preceding the illness — these are clinically common but socially forbidden experiences that require a non-judgmental clinical space to process.</p>

<p>Sibling dynamics frequently become particularly charged when a parent has dementia. The unequal distribution of caregiving responsibility is among the most common sources of conflict, particularly when one sibling lives geographically close and provides the bulk of care while other siblings contribute financially or emotionally at a distance. The inheritance implications of caregiving decisions — including decisions about residential care placement and financial management of the care recipient's assets — introduce financial dynamics into family systems that may already be struggling with the emotional weight of loss.</p>

<p>Clinical work with adult children of people with dementia appropriately includes: processing complicated feelings including ambivalence, resentment, and anticipatory grief; examining and renegotiating family caregiving roles; supporting effective communication between siblings and with the person with dementia; facilitating realistic appraisal of the care situation and available resources; and addressing the unique grief of watching a parent lose the capacities that defined them — and of being unable to return to a parent the emotional sustenance the parent once provided to them.</p>

<h2>Evidence-Based Interventions for Dementia Caregivers</h2>
<p>The good news for clinicians working with dementia caregivers is that multiple evidence-based interventions exist that demonstrably reduce caregiver depression, burden, and social isolation. The REACH (Resources for Enhancing Alzheimer's Caregiver Health) program — a multisite randomized controlled trial — demonstrated significant reductions in caregiver burden and depression through a multicomponent intervention combining psychoeducation, skill training, and social support. The New York University Caregiver Intervention (NYUCI) demonstrated benefits extending over several years through individual and family counseling, support group engagement, and access to a trained counselor for ongoing support.</p>

<p>Common therapeutic elements across effective caregiver interventions include: psychoeducation about dementia and its progression, coping skills training, behavioral management techniques for difficult dementia-related behaviors, problem-solving training, stress management, promotion of self-care and caregiver health, support group participation, and social network enhancement. Cognitive Behavioral Therapy adapted for caregivers addresses the distorted cognitions — "I'm a terrible caregiver," "If I were a better daughter she wouldn't be getting worse," "I should never feel angry or resentful" — that increase depression and guilt beyond what the situation itself requires.</p>

<p>Respite care — temporary relief from caregiving through adult day programs, in-home respite services, or short-term residential placement — is among the most impactful interventions for caregiver wellbeing, yet is dramatically underutilized due to caregiver guilt, financial barriers, and limited availability in many communities. Clinicians play an important role in normalizing the use of respite care and actively supporting caregivers in accessing it, reframing it not as abandonment of the care recipient but as maintenance of the caregiver's capacity to continue providing care.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 2",
          showExplanations: true,
          questions: [
            {
              question: "Pauline Boss's concept of 'ambiguous loss' in the context of dementia refers to:",
              type: "multipleChoice",
              options: [
                "Uncertainty about the dementia diagnosis due to incomplete neurological evaluation",
                "The family's uncertainty about how to distribute caregiving responsibilities",
                "The experience of grieving a person who is physically present but psychologically increasingly absent",
                "The ambiguity of prognosis and illness trajectory in neurocognitive disorders"
              ],
              correctAnswer: 2,
              explanation: "Boss's ambiguous loss framework describes the experience of grief for someone who is physically present but psychologically absent — the paradigmatic experience of family members of people with dementia. There is no social ritual, no acknowledged mourning period, and no resolution — the person is still there, but the relationship as it existed is progressively lost. Naming this experience is itself therapeutically valuable for caregivers."
            },
            {
              question: "Approximately what percentage of dementia caregivers experience clinically significant depression?",
              type: "multipleChoice",
              options: ["5 to 10 percent", "15 to 20 percent", "30 to 50 percent", "70 to 80 percent"],
              correctAnswer: 2,
              explanation: "Research consistently documents that 30–50% of dementia caregivers experience clinically significant depression — significantly higher than in the general population or in caregivers of non-dementia conditions. The sustained, escalating demands of dementia caregiving, combined with grief and role disruption, produce profound mental health consequences that require active clinical assessment and intervention."
            },
            {
              question: "Which of the following is the MOST appropriate clinical response when an adult child caregiver discloses feeling relief at the thought of her parent's death?",
              type: "multipleChoice",
              options: [
                "Express concern and explore whether the client might harm her parent",
                "Normalize this as a clinically common experience in prolonged caregiving situations and invite further exploration without judgment",
                "Redirect the session to concrete caregiving skills to address the underlying burnout",
                "Assess for major depression, as relief about death indicates suicidal ideation"
              ],
              correctAnswer: 1,
              explanation: "Relief about the prospect of a care recipient's death — sometimes called 'death wishes for others' in the caregiving literature — is a clinically common, understandable, and not inherently pathological experience in prolonged caregiving situations involving enormous suffering and loss. The appropriate clinical response is to normalize this as a forbidden but common experience, explore it without judgment, and address the underlying grief and caregiver burden — not to pathologize or redirect."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Cultural Considerations in Dementia Caregiving</h2>
<p>The experience of dementia caregiving is profoundly shaped by cultural frameworks that determine how cognitive decline is understood, who is responsible for providing care, what resources are considered appropriate to seek, and what constitutes an acceptable outcome. Clinicians who are unaware of or inattentive to these cultural dimensions risk delivering care that is both ineffective and alienating.</p>

<p>Research across cultural groups finds significant variation in caregiver strain, service utilization, and coping strategies. Black and Latino caregivers of people with dementia report higher rates of religious coping, greater reliance on family and community networks, and higher levels of caregiver gain (positive aspects of the caregiving role) compared to non-Hispanic White caregivers — despite also reporting higher objective caregiving burden. These differences are not deficits but reflect genuine cultural resources that clinicians should acknowledge and work with rather than inadvertently undermine by applying exclusively Western, individual-oriented treatment frameworks.</p>

<p>Cultural attitudes toward residential care placement are particularly relevant. Many cultural communities maintain strong norms against placing family members in nursing homes or memory care facilities — viewing such placement as abandonment or as evidence of familial failure. Clinicians must engage these beliefs with cultural humility, neither dismissing them as irrational nor endorsing caregiving beyond the physical and psychological capacity of the caregiver. The goal is collaborative exploration of what the client's values require and what is actually sustainable for all members of the system — including the caregiver whose own health and wellbeing are clinically significant.</p>`
        }
      ]
    },
    {
      title: "Module 3: The Light That Remains — Ethics, End-of-Life, and Clinical Integration",
      order: 3,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 3, title: "The Light That Remains", subtitle: "Ethics, End-of-Life, and Clinical Integration" },
        {
          type: "text",
          content: `<h2>Ethical Navigation in Dementia Clinical Practice</h2>
<p>Work with clients who have neurocognitive disorders confronts clinicians with an unusually dense cluster of ethical challenges — around capacity and consent, confidentiality and information-sharing, autonomy and protection, and the intersection of the client's rights with the family's legitimate needs and concerns. Navigating this territory competently requires both solid grounding in ethical principles and the practical wisdom to apply them in the specific contexts dementia generates.</p>

<p><strong>Consent and capacity in early dementia</strong> deserve early and explicit clinical attention, precisely because the window of opportunity — when the person has both the insight to understand their situation and the capacity to make meaningful decisions about their future — is limited and unpredictable. A diagnosis of mild cognitive impairment or early dementia does not in itself eliminate decision-making capacity, which remains situation-specific and fluctuating. The clinician's role includes facilitating advance care planning conversations while capacity exists, supporting the completion of legal documents including healthcare directives and durable powers of attorney, and ensuring that the client's expressed values and preferences are documented and accessible to those who will make future decisions on their behalf.</p>

<p>Advance directives are among the most important clinical products of early-stage dementia work. Conversations about preferences for end-of-life care — including preferences regarding artificial nutrition, resuscitation, hospitalization, and the relative weight given to comfort vs. life extension — are far better undertaken when the person can engage meaningfully than when they are in late-stage dementia and these decisions must be made by proxy. Clinicians can facilitate these conversations, model respectful and specific inquiry into the client's values and preferences, and ensure that expressed preferences are communicated to family members and recorded in the appropriate legal formats.</p>

<p><strong>Confidentiality in the context of cognitive impairment</strong> presents genuinely difficult ethical situations. Family members frequently ask clinicians for clinical information about their loved one — medication changes, current cognitive status, behaviors observed in session — motivated by genuine concern and by the real challenges of coordinating complex care. HIPAA protections apply to persons with dementia as fully as to any other patient, and clinicians must protect confidentiality unless the client has provided explicit consent to information sharing or a specific exception applies.</p>

<p>The practical reality is that effective care coordination for a person with moderate to severe dementia typically requires engagement with family caregivers — which requires consent that was ideally obtained while the client still had capacity to provide it. Clinicians who establish information-sharing agreements in the early stages of working with clients who have dementia are better positioned to maintain effective communication with family members as cognitive decline progresses, without violating confidentiality principles.</p>

<h2>Elder Abuse and the Dementia Vulnerability</h2>
<p>Persons with dementia are disproportionately vulnerable to elder abuse in all its forms — physical, emotional, sexual, financial, and neglect — and the perpetrator is more likely to be a family member caregiver than a stranger or institutional actor. The clinical context of dementia caregiving creates conditions that significantly elevate abuse risk: caregiver burnout, social isolation of the dyad, the care recipient's behavioral symptoms that may escalate caregiver frustration, the care recipient's inability to report abuse or have reports believed, and financial dynamics involving the care recipient's assets.</p>

<p>Clinicians working with dementia caregivers must be alert to indicators of potential abuse, including: significant caregiver distress or hostility, evidence that caregiving demands exceed the caregiver's capacity, the care recipient's unexplained injuries or changes in financial status, the caregiver's isolation of the care recipient from other family members, and direct disclosure by either party of abusive incidents. Mandatory reporting obligations for elder abuse vary by state but generally apply to all licensed mental health professionals — clinicians must know their jurisdiction's specific requirements.</p>

<p>Intervention in identified or suspected elder abuse situations requires careful clinical planning. The safety of the person with dementia is the primary clinical obligation. However, abrupt reporting without clinical planning can fracture therapeutic alliances, result in the care recipient being left without any care, and sometimes make the situation more dangerous rather than safer. Consultation with supervisors, ethics committees, or elder law attorneys is appropriate when abuse is suspected but the clinical path forward is unclear.</p>

<h2>Supporting a Good Goodbye: End-of-Life Dimensions of Dementia Care</h2>
<p>Dementia is a terminal illness. The recognition that dementia is not simply "memory loss" but a progressive neurological disease that ultimately ends in death remains insufficiently integrated into both clinical practice and public understanding. The clinical implication is that end-of-life care — including the hospice philosophy of comfort-oriented care when curative treatment is no longer appropriate — is highly relevant for persons with advanced dementia, and that family members benefit from clinical support in making peace with this reality.</p>

<p>Hospice care is dramatically underutilized for dementia, in part because of the prognostic uncertainty inherent in predicting the course of the illness and in part because dementia has not been culturally constructed as a terminal illness requiring palliative care in the same way that cancer has. Clinicians can play an important role in normalizing and facilitating conversations about hospice for clients with advanced dementia, educating families about what hospice provides (comfort-focused care, expert pain management, family support, spiritual care), and supporting families in the shift from curative to palliative treatment orientation when that shift is clinically appropriate.</p>

<p>Bereavement support for family members after the death of a person with dementia is a distinct clinical need. The grief following the death of a loved one with dementia is shaped by the years of anticipatory mourning that preceded the death — by the experience of having already grieved the person's cognitive presence while their physical presence continued. Some family members experience a "second grief" at death that is complicated by feelings of relief, guilt about that relief, uncertainty about what exactly they are grieving, and the exhaustion of years of caregiving.</p>

<h2>Toward Integration: The Rooms That Remain</h2>
<p>We return, at the end, to the dimming house. By late-stage dementia, many of the rooms are dark. The person who once filled the house with complex presence — conversation, opinion, plans, laughter, conflict, love — now inhabits a smaller space. But in that smaller space, something remains: the response to a warm touch, the brightening at a familiar voice, the expression on the face when a beloved piece of music plays. The light in those rooms is not gone. It is concentrated.</p>

<p>The clinician's role in this work is not to restore the lights that have gone out — that is beyond the reach of any intervention. It is to help both the person with dementia and the people who love them inhabit, with as much dignity and connection as possible, the rooms that are still lit. It is to name what is being lost with honesty and compassion. It is to support the caregiver whose grief is real, whose burden is enormous, and whose love is expressed in ways that the care recipient may no longer be able to recognize or return in kind. It is to sit with the long goodbye — not to rush it, not to avert one's eyes, but to be genuinely, skillfully present for the fullness of what it contains.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 3",
          showExplanations: true,
          questions: [
            {
              question: "When should advance care planning conversations occur with a client who has received an early dementia diagnosis?",
              type: "multipleChoice",
              options: [
                "When the disease has progressed to moderate severity, so the family can be fully involved",
                "Only after legal guardianship has been established to ensure decisions are properly authorized",
                "As early as possible while decision-making capacity is intact, so the client can express their own values and preferences",
                "At the point of hospice enrollment, when end-of-life decisions become immediately relevant"
              ],
              correctAnswer: 2,
              explanation: "Advance care planning should occur as early as possible while the person with dementia retains decision-making capacity. The window during which a person has sufficient insight and capacity to meaningfully participate in decisions about their future care is limited and unpredictable. Waiting until moderate or late stages means important decisions must be made by proxy, without the benefit of the person's own expressed values."
            },
            {
              question: "Under what circumstances may a clinician appropriately share clinical information about a client with dementia with family members?",
              type: "multipleChoice",
              options: [
                "Any time a family member expresses genuine concern about the client's welfare",
                "Whenever the clinician judges that information-sharing would improve care coordination",
                "Only with the client's explicit consent (obtained while capacity existed), or when a specific legal exception applies such as mandatory reporting",
                "When the client's cognitive impairment makes their confidentiality rights legally moot"
              ],
              correctAnswer: 2,
              explanation: "HIPAA confidentiality protections apply fully to persons with dementia. Information may be shared with family members only with the client's explicit informed consent (ideally obtained while capacity was intact), or when a specific legal exception applies — such as mandatory reporting of abuse or neglect. The person's cognitive impairment does not eliminate their privacy rights."
            },
            {
              question: "The grief that family members experience following the death of a loved one with dementia is BEST characterized as:",
              type: "multipleChoice",
              options: [
                "Uncomplicated bereavement that resolves quickly because grief work was done during the illness",
                "A distinct clinical experience shaped by years of anticipatory mourning, potential relief, and exhaustion from caregiving — sometimes involving 'second grief' requiring specific therapeutic support",
                "A straightforward grief response identical to other bereavement experiences",
                "Primarily focused on guilt and should be treated with CBT-based cognitive restructuring"
              ],
              correctAnswer: 1,
              explanation: "Post-dementia bereavement is clinically distinct. Years of anticipatory grief, caregiving exhaustion, feelings of relief (and guilt about that relief), and uncertainty about what exactly is being mourned create a complex bereavement experience that often requires specific therapeutic attention rather than the assumption that grief work has already been fully accomplished during the illness."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Preparing for the Final Assessment</h2><p>The final assessment covers all three modules. Review your understanding of the major dementia types and their clinical presentations, communication approaches across stages, the concept of ambiguous loss and caregiver burden, ethical navigation of capacity and confidentiality, and end-of-life clinical practice. A score of 80% or higher is required for CE credit. Three attempts are available.</p>`
        },
        {
          type: "quiz",
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          shuffleQuestions: true,
          showExplanations: false,
          title: "Final Assessment — CR-611: The Long Goodbye",
          questions: [
            { question: "Alzheimer's disease accounts for approximately what percentage of all dementia cases?", type: "multipleChoice", options: ["20 to 30 percent", "40 to 50 percent", "60 to 80 percent", "90 to 95 percent"], correctAnswer: 2, explanation: "Alzheimer's disease is the most common cause of dementia, accounting for 60–80% of cases." },
            { question: "The stepwise deterioration pattern — with abrupt declines following vascular events interspersed with relative stability — is MOST characteristic of:", type: "multipleChoice", options: ["Alzheimer's disease", "Frontotemporal dementia", "Lewy body dementia", "Vascular dementia"], correctAnswer: 3, explanation: "Vascular dementia typically follows a stepwise pattern, with declines linked to discrete cerebrovascular events rather than the gradual progression of Alzheimer's disease." },
            { question: "A person with Lewy body dementia must be carefully monitored for adverse reactions to which category of medication?", type: "multipleChoice", options: ["NSAIDs and blood thinners", "Antipsychotic medications, which can cause life-threatening neuroleptic malignant syndrome", "Antidepressants, which can worsen hallucinations", "Antihistamines and over-the-counter sleep aids"], correctAnswer: 1, explanation: "Lewy body dementia is characterized by severe sensitivity to antipsychotic medications, which can cause potentially fatal neuroleptic malignant syndrome. This makes careful coordination with prescribers essential." },
            { question: "The Montreal Cognitive Assessment (MoCA) is preferred over the MMSE for screening because:", type: "multipleChoice", options: ["It is shorter and takes less time to administer", "It has superior sensitivity to mild cognitive impairment and broader coverage of executive function", "It does not require verbal responses, making it accessible to clients with aphasia", "It has been validated specifically for use in African American older adults"], correctAnswer: 1, explanation: "The MoCA demonstrates superior sensitivity to mild cognitive impairment and includes broader assessment of executive function compared to the MMSE, making it more clinically useful for detecting early-stage neurocognitive disorders." },
            { question: "Validation Therapy differs from reality orientation in that it:", type: "multipleChoice", options: ["Corrects misperceptions to maintain cognitive orientation to the present", "Enters and validates the subjective emotional reality of the person with dementia rather than correcting factual inaccuracies", "Uses pharmacological intervention to manage agitation and confusion", "Provides structured reality testing to improve cognitive functioning"], correctAnswer: 1, explanation: "Validation Therapy, developed by Naomi Feil, involves entering the subjective world of the person with dementia and acknowledging the emotional truth of their experience, rather than correcting temporal or factual misperceptions. This approach reduces distress and conflict, particularly in moderate to late-stage dementia." },
            { question: "According to Boss's ambiguous loss framework, the grief of family members of people with dementia is particularly difficult because:", type: "multipleChoice", options: ["The care recipient's suffering is objectively greater than the caregiver's", "There is no social ritual, acknowledged mourning period, or resolution — the person is physically present but psychologically increasingly absent", "Families are not entitled to grieve until the care recipient has died", "The grief is primarily anticipatory and does not reflect actual loss"], correctAnswer: 1, explanation: "Ambiguous loss in dementia lacks the social recognition, ritual, and resolution of conventional bereavement. The care recipient is physically present while psychologically increasingly absent — creating grief that has no clear beginning, no clear end, and no social scripts for mourning." },
            { question: "The REACH (Resources for Enhancing Alzheimer's Caregiver Health) intervention demonstrated effectiveness through:", type: "multipleChoice", options: ["Pharmacological management of caregiver anxiety and depression", "Institutionalization of care recipients to relieve caregiver burden", "Multicomponent interventions combining psychoeducation, skill training, and social support to reduce caregiver depression and burden", "Intensive individual psychoanalytic therapy for caregivers"], correctAnswer: 2, explanation: "REACH demonstrated significant reductions in caregiver burden and depression through a multicomponent approach combining psychoeducation about dementia, skill training for behavior management, and social support enhancement." },
            { question: "Which of the following is the MOST evidence-based framing of respite care for dementia caregivers?", type: "multipleChoice", options: ["Respite care should be avoided as it disrupts routines important for care recipients with dementia", "Respite care represents temporary abandonment of the care recipient and increases caregiver guilt", "Respite care is among the most impactful interventions for caregiver wellbeing and should be normalized as maintenance of caregiving capacity", "Respite care is only indicated when the caregiver has been formally diagnosed with depression"], correctAnswer: 2, explanation: "Despite its documented benefits for caregiver wellbeing, respite care is dramatically underutilized due to caregiver guilt and financial and access barriers. Clinicians play an important role in normalizing respite as essential maintenance of the caregiver's capacity to continue providing care." },
            { question: "When a sibling conflict arises over caregiving responsibilities for a parent with dementia, the clinician's MOST appropriate role is:", type: "multipleChoice", options: ["Advocate for the caregiving sibling's perspective, as they have greater clinical insight into the care situation", "Facilitate family communication and collaborative problem-solving while maintaining neutrality regarding family dynamics", "Remain uninvolved in family dynamics, limiting the clinical focus to the identified client", "Provide a formal clinical opinion about the appropriate distribution of caregiving responsibilities"], correctAnswer: 1, explanation: "Sibling conflict over caregiving is extremely common and clinically significant. The clinician's appropriate role is to facilitate communication, validate the experiences of all parties, and support collaborative problem-solving — maintaining therapeutic neutrality rather than aligning with any particular sibling's perspective." },
            { question: "Hospice care is underutilized for persons with advanced dementia primarily because:", type: "multipleChoice", options: ["Hospice is not legally permitted for non-cancer diagnoses", "Dementia has not been widely constructed as a terminal illness, and prognostic uncertainty makes eligibility determination complex", "Research has shown hospice is ineffective for dementia populations", "Hospice services require the care recipient to be fully aware of their prognosis"], correctAnswer: 1, explanation: "Dementia is underrepresented in hospice enrollment despite being a terminal illness. Contributing factors include cultural construction of dementia as 'memory loss' rather than a terminal condition, prognostic uncertainty, and provider unfamiliarity with hospice eligibility criteria for dementia." },
            { question: "Frontotemporal dementia (behavioral variant) is MOST likely to be initially misattributed to:", type: "multipleChoice", options: ["Stroke", "Schizophrenia spectrum disorder", "A psychological or moral problem rather than a neurological disease, due to personality and behavior changes without prominent memory impairment", "Normal pressure hydrocephalus"], correctAnswer: 2, explanation: "bvFTD's presentation of personality change, disinhibition, and loss of empathy — without prominent early memory impairment — leads families and clinicians to initially attribute changes to psychological crisis, relationship problems, or moral failure rather than neurological disease. Recognition requires familiarity with the FTD clinical profile." },
            { question: "Elder financial exploitation in the context of dementia is MOST commonly perpetrated by:", type: "multipleChoice", options: ["Professional financial advisors and attorneys", "Strangers through telephone and online scams exclusively", "Family member caregivers, rather than strangers or institutional actors", "Institutional care staff"], correctAnswer: 2, explanation: "While financial scams targeting elders do occur through external actors, the majority of elder financial exploitation — particularly in dementia — is perpetrated by family member caregivers who have access to financial accounts and assets and may face financial pressures of their own." },
            { question: "The 'informant questionnaire' approach to dementia assessment is preferred in early screening because:", type: "multipleChoice", options: ["It eliminates the need for formal neuropsychological evaluation", "It captures functional changes that emerge in collateral history before or alongside self-reported memory complaints", "Persons with dementia are legally prohibited from providing their own medical history", "It is more culturally sensitive than direct cognitive assessment"], correctAnswer: 1, explanation: "Collateral history from family members and close contacts often reveals functionally significant changes — getting lost, repeating conversations, mishandling finances — that precede or accompany self-reported cognitive complaints. The IQCODE and similar instruments provide structured formats for gathering this essential information." },
            { question: "A client with early Alzheimer's disease and their spouse are both distressed about progressive memory loss. Which intervention is MOST appropriate at this stage?", type: "multipleChoice", options: ["Defer all clinical intervention until cognitive decline is more advanced and the care situation is clearer", "Focus exclusively on caregiver support for the spouse, as the person with dementia cannot benefit from psychotherapy", "Individual and/or couples counseling addressing emotional processing of the diagnosis, advance care planning, identity maintenance, and communication — while the client still has sufficient capacity to meaningfully engage", "Pharmacological referral only, as psychotherapy cannot benefit persons with Alzheimer's disease"], correctAnswer: 2, explanation: "Early-stage dementia is the optimal time for direct therapeutic engagement with the person with cognitive decline — while insight is relatively intact and capacity for meaningful participation in counseling, advance care planning, and identity-affirming work is preserved. Both individual and couples/family sessions are appropriate and beneficial." },
            { question: "What does 'second grief' refer to in the context of post-dementia bereavement?", type: "multipleChoice", options: ["A second bereavement following the death of another family member", "A grief response that occurs only in caregivers who did not adequately mourn during the illness", "A distinct grief experience at the time of death, shaped by relief, exhaustion, and years of anticipatory mourning that preceded it", "A recurrence of grief symptoms months or years after the initial bereavement period"], correctAnswer: 2, explanation: "After years of anticipatory grief and caregiving, family members may experience a complex, often contradictory grief at the care recipient's death — including relief, guilt about that relief, and uncertainty about the nature of their loss. This 'second grief' is shaped by the years of ambiguous loss that preceded it and may require specific therapeutic support." }
          ]
        }
      ]
    }
  ]
};

const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('\n' + '═'.repeat(60));
  console.log('  SEEDING CR-611: The Long Goodbye');
  console.log('═'.repeat(60));
  const existing = await Course.findOne({ slug: COURSE.slug });
  if (existing) { await Course.findOneAndReplace({ slug: COURSE.slug }, COURSE, { new: true }); console.log('✅ Updated'); }
  else { await Course.create(COURSE); console.log('✅ Created'); }
  console.log(`   ${COURSE.courseCode} | ${COURSE.ceHours} CE Hours | ${COURSE.modules.length} Modules`);
  await mongoose.disconnect();
}
seed().catch(err => { console.error('❌', err); process.exit(1); });
