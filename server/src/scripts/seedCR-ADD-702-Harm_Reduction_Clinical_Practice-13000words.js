/**
 * seedCR-ADD-702-Harm_Reduction_Clinical_Practice-13000words.js
 * CR-ADD-702 | Harm Reduction in Clinical Practice: Evidence and Application | 2.0 CE Hours
 *
 * Run from repo root:
 *   node server/src/scripts/seedCR-ADD-702-Harm_Reduction_Clinical_Practice-13000words.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = 'cr-add-702-harm-reduction';

// ─── WORD COUNT UTILITY ──────────────────────────────────────────────────────
function countWords(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}

function countCourseWords(course) {
  let total = 0;
  const proseFields = ['content', 'title', 'subtitle', 'question', 'explanation'];
  function walk(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { obj.forEach(walk); return; }
    for (const [k, v] of Object.entries(obj)) {
      if (proseFields.includes(k) && typeof v === 'string') total += countWords(v);
      else walk(v);
    }
  }
  walk(course.sections);
  walk(course.assessment);
  return total;
}

// ─── COURSE DOCUMENT ─────────────────────────────────────────────────────────
const COURSE = {
  title: 'Harm Reduction in Clinical Practice: Evidence and Application',
  slug: SLUG,
  courseCode: 'CR-ADD-702',
  subtitle: 'From syringe service programs to fentanyl test strips — applying the evidence in everyday clinical work',
  description: 'This 2-hour continuing education course provides licensed mental health professionals with a rigorous, evidence-based foundation in harm reduction philosophy and clinical application. Participants will explore the historical roots of the harm reduction movement, the empirical literature supporting major harm reduction interventions, and practical strategies for integrating non-abstinence and client-defined goals into counseling practice. The course addresses counselor values conflicts, stigma, motivational interviewing as a harm reduction tool, safer use counseling, naloxone prescribing and third-party prescriptions, fentanyl test strip use, cannabis substitution, documentation and liability, and the ethical navigation of abstinence-based program requirements.',
  ceHours: 2,
  ceuHours: 2,
  ceuEligible: true,
  credits: 2,
  ceCategory: 'Addictions',
  category: 'clinical',
  contentArea: 'Addictions Counseling; Professional Practice and Ethics',
  level: 'Intermediate',
  difficulty: 'intermediate',
  deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC',
  approvalNumber: '7760',
  acepNumber: '7760',
  accessType: 'subscription',
  status: 'draft',
  isPublished: false,
  maxAttempts: 3,
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC'
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC'
  },
  approvals: [
    {
      body: 'NBCC',
      number: '#7760',
      hourBreakdown: [{ label: 'core', hours: 2 }]
    }
  ],
  objectives: [
    'Describe the historical development of harm reduction as a public health and clinical framework, including the foundational contributions of syringe service programs, the Netherlands drug policy model, and the AIDS crisis response.',
    'Identify the core principles of harm reduction — pragmatism, humanism, non-abstinence goals, client-defined outcomes, and reduction of drug-related harm — and explain how each principle applies in direct counseling practice.',
    'Summarize the empirical evidence supporting at least four evidence-based harm reduction interventions, including syringe service programs, naloxone distribution, supervised consumption sites, and drug-checking services.',
    'Apply motivational interviewing techniques and explicit harm reduction goal-setting to help clients reduce the quantity, frequency, and contextual risk of substance use, even in the absence of abstinence motivation.',
    'Demonstrate knowledge of safer use counseling, fentanyl test strip use, naloxone training and third-party prescription requirements, and cannabis substitution as clinically relevant harm reduction strategies.',
    'Navigate the ethical tensions between abstinence-based program requirements and harm reduction values, with particular attention to documentation, liability, and client autonomy.'
  ],
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',

  // ── SECTIONS ──────────────────────────────────────────────────────────────
  sections: [

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 0 — INTRO
    // ══════════════════════════════════════════════════════════════════════
    {
      title: 'Introduction: What Harm Reduction Is — and What It Is Not',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction',
          subtitle: 'What harm reduction is — and what it is not',
          sectionNumber: '0',
          order: 1
        },
        {
          type: 'text',
          order: 2,
          content: `<h2>Setting the Stage</h2>
<p>Harm reduction is among the most evidence-supported — and most misunderstood — frameworks in contemporary addictions counseling. For many clinicians trained in abstinence-based models, harm reduction can feel like a philosophical threat, a lowering of standards, or even an ethical violation. For clients struggling with substance use who have failed at or been failed by abstinence-based treatment, harm reduction can feel like the first time a professional has taken them seriously.</p>
<p>This course does not ask you to abandon your values or your clinical judgment. It asks you to examine the evidence, to hold complexity, and to develop a skill set that the research strongly supports. The literature on harm reduction is now extensive — spanning economics, public health, neuroscience, clinical psychology, and social work — and the findings are consistent: interventions that reduce the harms associated with substance use save lives, reduce disease transmission, reduce crime, and often — but not always, and not as the primary goal — create pathways toward reduced use or abstinence.</p>
<p>By the end of this two-hour course, you will have a working knowledge of harm reduction history, the empirical evidence base, and the practical clinical skills to integrate harm reduction principles into your practice with clients who use substances. You will also have language and frameworks for navigating the real tensions that arise when harm reduction values meet abstinence-based program structures, liability concerns, or your own deeply held beliefs about recovery.</p>
<p>A word on scope: this course focuses on harm reduction as applied to substance use disorders and related behaviors. Many of the same principles — meeting clients where they are, prioritizing immediate safety over ideal outcomes, recognizing the validity of client-defined goals — apply across clinical populations, from suicidality to eating disorders to sexual risk behavior. But the course draws its examples, research citations, and clinical illustrations primarily from the addictions field, where harm reduction has its deepest roots and its most robust evidence base.</p>`
        }
      ]
    },

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 1 — Principles and Evidence Base
    // ══════════════════════════════════════════════════════════════════════
    {
      title: 'Harm Reduction: Principles, History, and the Evidence Base',
      order: 1,
      contentBlocks: [

        // 1.1 DIVIDER
        {
          type: 'sectionDivider',
          title: 'Harm Reduction: Principles, History, and the Evidence Base',
          subtitle: 'From needle exchanges to supervised consumption — what the research actually says',
          sectionNumber: '1',
          order: 1
        },

        // 1.2 TEXT — History
        {
          type: 'text',
          order: 2,
          content: `<h2>Historical Roots of the Harm Reduction Movement</h2>
<p>Harm reduction did not emerge from a single theory or a single crisis. It developed, in parallel, from several public health emergencies and policy experiments across multiple continents beginning in the late 1970s and accelerating dramatically through the 1980s AIDS crisis. Understanding these origins is not merely historical housekeeping — the founding controversies of harm reduction continue to shape political resistance, funding battles, and clinical debates to this day.</p>
<p>The Netherlands is widely credited as the first country to implement formal harm reduction policy at a national scale. In the early 1980s, Dutch public health officials, confronted with rising hepatitis B transmission among people who injected drugs (PWID), worked with a group called the Junkiebond — an advocacy organization run by and for drug users — to establish the first formal syringe exchange program in Amsterdam in 1984. The program operated on a simple principle: people who use drugs will continue to use drugs; if they can do so with clean equipment, transmission of blood-borne disease will decrease. The intervention worked. Hepatitis B and, later, HIV transmission rates among Amsterdam PWID were significantly lower than in comparable cities without exchanges (Des Jarlais et al., 1995).</p>
<p>In the United Kingdom, the Mersey Harm Reduction Model developed contemporaneously in Liverpool, where public health consultant John Marks and colleagues created a system of prescribing pharmaceutical heroin and cocaine to registered drug users beginning in 1982. The Merseyside approach explicitly prioritized disease prevention, crime reduction, and social stabilization over abstinence. Crime rates among program participants dropped dramatically, HIV transmission was contained, and the regional HIV prevalence among PWID in Merseyside remained among the lowest in Europe throughout the 1980s (Parssinen, 2002). The program was eventually closed under political pressure, a decision widely regarded in public health circles as a policy mistake driven by ideology rather than evidence.</p>
<p>In the United States, the AIDS crisis of the 1980s created both the impetus and the political obstacles that have characterized American harm reduction ever since. As HIV ravaged communities of gay men, people who injected drugs, and communities of color, public health advocates argued urgently for needle exchanges and other harm reduction measures. They were met with intense political and moral opposition rooted in the belief that providing clean equipment to people who use drugs would send an unacceptable message of approval — that the government was condoning drug use. This debate, which reached into the Reagan and then the Bush and Clinton administrations, resulted in a federal ban on funding for syringe service programs that was not fully lifted until 2016, and even then with restrictions that have varied by Congressional appropriations cycle.</p>
<p>Despite federal resistance, community-based syringe service programs proliferated in U.S. cities through the late 1980s and 1990s, many operating in legal gray zones or under explicit civil disobedience. ACT UP — the AIDS Coalition to Unleash Power — was among the organizations that distributed needles illegally on city streets in New York and other cities, treating the legal prohibition as morally unjustifiable in the context of mass death. The politics of this period produced an activist tradition within harm reduction that continues to shape its culture, including the emphasis on the leadership of people with lived experience and the skepticism of professional and governmental authority that remains part of many harm reduction organizations today (Friedman et al., 1993).</p>
<p>Internationally, the harm reduction movement formalized during this period through the founding of the International Harm Reduction Association in 1996 (now Harm Reduction International), and through the adoption of harm reduction language in a series of United Nations documents and international drug policy frameworks. The term itself gained its canonical definition through the work of scholars including G. Alan Marlatt, whose research on relapse prevention and controlled drinking challenged the dominant abstinence paradigm in the United States (Marlatt & Witkiewitz, 2002). Andrew Tatarsky's integrative harm reduction psychotherapy model, developed through clinical work in New York City, provided one of the first systematic frameworks for delivering psychotherapy under a harm reduction philosophy rather than an abstinence mandate (Tatarsky, 2002).</p>
<h2>Core Principles of Harm Reduction</h2>
<p>The Harm Reduction Coalition, founded in 1993, articulated a set of core principles that have become foundational across the field. These principles are worth examining carefully, both because they define the philosophy and because each one has specific clinical implications.</p>
<p><strong>Pragmatism.</strong> Harm reduction accepts that illicit drug use is and will continue to be part of human experience. Rather than endorsing or condemning drug use, pragmatism focuses on minimizing its harmful effects. Clinically, this means working with clients as they actually present — including clients who are actively using and have no current desire to stop — rather than requiring behavioral change as a precondition for engagement.</p>
<p><strong>Humanism.</strong> Harm reduction prioritizes the dignity, health, and well-being of people who use drugs. This principle is a direct response to the stigma, criminalization, and dehumanization that people who use drugs routinely experience in healthcare, legal, and social service settings. It means treating every client with unconditional positive regard regardless of their substance use status or treatment adherence, and refusing to withhold care or empathy based on choices the clinician might not approve of.</p>
<p><strong>Non-abstinence goals.</strong> Harm reduction recognizes that abstinence, while a valid and often important goal for many people, is not the only valid outcome of treatment. Reduction in use frequency, reduction in use quantity, switching to a less harmful substance, or eliminating a particular high-risk behavior (such as sharing needles or driving while impaired) are all legitimate clinical goals that improve health and quality of life. This principle directly challenges the framing of any substance use as treatment failure.</p>
<p><strong>Client-defined goals.</strong> The client, not the clinician, determines what change looks like. This principle is closely related to but distinct from motivational interviewing: it places the ultimate determination of goals in the hands of the person seeking services, even when those goals are not what the clinician would choose. Harm reduction does not mean that clinicians cannot share information about risks or discuss concerns; it means they do not make the therapeutic relationship contingent on the client adopting the clinician's goals.</p>
<p><strong>Reduction of drug-related harm.</strong> This is the most self-evident principle: the primary measure of success is whether harm has been reduced. Harm includes overdose death, blood-borne disease transmission, mental health deterioration, social isolation, legal consequences, housing instability, family disruption, and economic damage. Harm reduction interventions are evaluated against these harm endpoints — not against abstinence rates.</p>`
        },

        // 1.3 CALLOUT — Naloxone and Third-Party Prescriptions
        {
          type: 'callout',
          order: 3,
          calloutType: 'protocol',
          title: 'Naloxone Prescribing and the Counselor\'s Role: What the Evidence Says About Third-Party Prescriptions',
          content: `<p>Naloxone (Narcan) is an opioid antagonist that rapidly reverses opioid overdose. It is safe, effective, and — depending on state law — available without a prescription at many pharmacies. Yet counselors frequently underutilize their capacity to facilitate naloxone access for clients and their families. Understanding the third-party prescription mechanism is essential clinical knowledge for any professional working with opioid-using populations.</p>
<p><strong>What is a third-party prescription?</strong> In most U.S. states, standing orders and third-party prescription laws allow pharmacists or prescribers to provide naloxone to individuals who are not themselves opioid users but who live with, or may witness an overdose of, someone who is. This means the partner, parent, sibling, or friend of a client who uses opioids can obtain naloxone — often at low or no cost — without the client ever entering a pharmacy or disclosing their use status.</p>
<p><strong>What does the evidence say?</strong> A 2019 Cochrane systematic review of naloxone distribution programs found strong evidence that community-based naloxone distribution reduces opioid overdose mortality (Giglio et al., 2015). Community-based naloxone programs in Massachusetts, New York, and Maryland demonstrated significant reductions in overdose fatality rates in communities with active distribution programs. The CDC estimated that naloxone distributed through community programs reversed over 26,000 overdoses between 1996 and 2014.</p>
<p><strong>Counselor action steps:</strong> (1) Know your state's standing order and third-party prescription laws — NEXT Distro and the National Alliance of State Pharmacy Associations maintain updated state-by-state references. (2) Provide naloxone information and referral as routine practice for any client using opioids or whose family members may be present at an overdose. (3) Offer to conduct a brief overdose recognition and naloxone administration training — resources are available free from SAMHSA, the Harm Reduction Coalition, and many state health departments. (4) Document the education provided; this is best practice and supports liability protection. (5) Do not require a client to commit to reduced use before providing naloxone education — naloxone saves lives regardless of the client's use intentions.</p>`
        },

        // 1.4 TEXT — Empirical Evidence
        {
          type: 'text',
          order: 4,
          content: `<h2>Empirical Evidence for Harm Reduction Interventions</h2>
<p>The evidence base for harm reduction interventions has accumulated over four decades and now includes systematic reviews, meta-analyses, longitudinal cohort studies, and natural experiments generated by policy variation across jurisdictions. The following summary covers the interventions with the strongest and most consistent evidence.</p>
<p><strong>Syringe Service Programs (SSPs).</strong> Formerly called needle exchanges or syringe exchange programs, SSPs are community-based programs that provide sterile injection equipment to people who inject drugs, along with a range of ancillary services including HIV and hepatitis C testing, wound care, overdose prevention supplies, and referral to treatment and social services. The evidence for SSPs is among the strongest in public health: a 2004 CDC report concluded that SSPs are effective in reducing HIV transmission without increasing drug use in the community (CDC, 2004). A 2010 Cochrane review of 19 studies found that SSPs were associated with significant reductions in HIV incidence and syringe sharing behavior (Wodak & Cooney, 2010). Importantly, multiple studies have found that SSPs increase rather than decrease treatment entry — people who access SSPs are significantly more likely to enter substance use treatment than those who do not, likely because SSP staff develop trusting relationships that serve as bridges to treatment (Hagan et al., 2000).</p>
<p>Despite this evidence, legal access to SSPs varies dramatically by state. As of 2024, several states maintain restrictions on SSP operation, and federal funding restrictions have historically limited program capacity. The consequence of this restriction is measurable: Scott County, Indiana's 2015 HIV outbreak — which saw 135 HIV cases among PWID in a county of 24,000 people in five months — was directly attributable to the state's ban on SSPs (Peters et al., 2016). Following an emergency authorization of a temporary SSP, the outbreak was contained.</p>
<p><strong>Naloxone Distribution.</strong> Community-based naloxone distribution programs, often operated through SSPs, pharmacies, or community health organizations, provide naloxone and overdose response training to people who use drugs and their social networks. The evidence for naloxone distribution is unambiguous: the intervention saves lives, has no identified adverse effects, and does not increase drug use in recipient communities (Coffin & Sullivan, 2013). The framing of naloxone as a "get out of jail free card" that discourages abstinence is not supported by data.</p>
<p><strong>Supervised Consumption Sites (SCS).</strong> Also called safe injection facilities or drug consumption rooms, SCS are legally sanctioned facilities where people who use drugs can use pre-obtained substances under medical supervision without fear of arrest. The clinical evidence from facilities in Canada (Insite in Vancouver, opening in 2003) and Europe (over 100 facilities in the Netherlands, Switzerland, Germany, and elsewhere) is extensive. Insite alone has been associated with a 35% reduction in overdose deaths in its immediate vicinity, a 67% reduction in emergency room overdose presentations from the surrounding neighborhood, and increased uptake of detox and treatment services among its clients (Kerr et al., 2006; Wood et al., 2006). No overdose death has ever occurred inside an SCS worldwide. The first officially sanctioned SCS in the United States opened in New York City in November 2021 and served over 1,800 clients in its first year of operation while reversing hundreds of overdoses.</p>
<p><strong>Drug-Checking Services.</strong> The emergence of fentanyl and fentanyl analogs in the illicit drug supply has fundamentally changed the overdose landscape: people who use stimulants, benzodiazepines, or other non-opioid drugs are increasingly dying of opioid overdose because their drugs contain fentanyl they did not intend to use. Drug-checking services — ranging from fentanyl test strips (FTS) to mass spectrometry services at harm reduction organizations — allow people to test their drugs for fentanyl and other adulterants before use. Studies have consistently found that when people learn their drugs contain fentanyl, significant proportions reduce their use, discard the drugs, use with others present, or take other precautionary measures (Sherman et al., 2018). Fentanyl test strips cost approximately $1 each, are accurate, and are now legal for distribution in most U.S. states following a 2021 SAMHSA guidance clarifying that they are not drug paraphernalia under federal law.</p>
<p><strong>Safer Sex Supplies and Integrated Harm Reduction Services.</strong> Many harm reduction programs distribute condoms, pre-exposure prophylaxis (PrEP) referrals, and sexual health services alongside drug-related harm reduction supplies. People who use drugs are at elevated risk for sexually transmitted infections due to the relationship between substance intoxication and sexual risk behavior, and many harm reduction programs serve populations that are particularly vulnerable to HIV through both injection and sexual transmission. Integrated programs that address both drug-related and sexual health risks have demonstrated effectiveness in reducing HIV incidence across multiple populations (Logan & Cole, 2007).</p>
<h2>Addressing Counselor Values Conflicts and Stigma</h2>
<p>The evidence for harm reduction is compelling. Yet clinicians — including experienced, well-trained, ethically committed clinicians — frequently experience genuine values conflicts when asked to implement harm reduction approaches. These conflicts deserve serious, non-dismissive engagement; the goal of this section is not to lecture clinicians about their values, but to provide a framework for examining them clinically and ethically.</p>
<p>The most common values conflict involves the tension between the counselor's belief that abstinence is the appropriate or only real solution to addiction and the harm reduction principle that non-abstinence goals are legitimate. This tension often has roots in personal or family experience with addiction, in professional training in the 12-step or disease model tradition, or in religious and moral frameworks that understand substance use in terms of sin, weakness, or moral failure. These are not unreasonable positions given the genuine harms of addiction and the power of recovery narratives. But they create a clinical risk when they lead counselors to withhold engagement from clients who are not ready for abstinence, to communicate — verbally or nonverbally — that the client is inadequate or failing if they do not pursue abstinence, or to set abstinence as an implicit precondition for clinical care.</p>
<p>The ACA Code of Ethics (2014) addresses this tension explicitly in section A.11.b, which prohibits counselors from imposing their values on clients, and in the broader principle of client autonomy. Harm reduction advocates would argue that a counselor who refuses to discuss non-abstinence goals with an ambivalent client is not "protecting" that client from inadequate care — they are potentially driving the client out of treatment entirely. The research on premature dropout from abstinence-required treatment supports this concern (Miller et al., 2003).</p>
<p>Stigma operates alongside values conflicts and is, if anything, more insidious because it often operates below conscious awareness. Research by Kelly and colleagues (2010) found that even addiction treatment professionals endorsed significantly more negative implicit attitudes toward people with substance use disorders compared to people with other mental health diagnoses. Language matters: the move from "addict" to "person who uses drugs" or "person with a substance use disorder" is not political correctness — it reflects a substantial body of research showing that person-first language reduces stigma, improves provider attitudes, and correlates with better treatment recommendations (Kelly & Westerhoff, 2010). Clinicians who feel genuine commitment to evidence-based, ethical practice have reason to examine their language, their assumptions about motivation, and their expectations of clients — and to approach that examination with the same openness they would bring to any other clinical skill development.</p>`
        },

        // 1.5 ACCORDION
        {
          type: 'accordion',
          order: 5,
          accordionItems: [
            {
              title: 'What distinguishes harm reduction from enabling?',
              content: `<p>This is the question counselors most frequently ask, and it deserves a precise answer. Enabling, in the clinical sense, refers to behaviors by others that protect a person who uses substances from experiencing the natural consequences of their use in ways that perpetuate the use behavior. A parent who repeatedly lies to an employer to cover for an adult child who is drunk is enabling in this sense — they are absorbing consequences in a way that removes feedback that might otherwise motivate change.</p>
<p>Harm reduction is fundamentally different: it does not protect people from the consequences of use so much as it reduces the likelihood that those consequences include death, disease, incarceration, or permanent health impairment. A counselor who provides a client with fentanyl test strips is not enabling the client's drug use — the client was going to use regardless. The counselor is giving the client information that may prevent them from dying of an accidental fentanyl overdose. The key distinction is this: harm reduction services are offered to people who are going to use drugs regardless, not as an alternative to helping them stop, but as a way to keep them alive and healthy enough to have that conversation when they are ready.</p>`
            },
            {
              title: 'What does the research say about abstinence outcomes in treatment programs that require abstinence as an entry criterion?',
              content: `<p>Research on abstinence-required programs shows mixed results. Studies of therapeutic communities and 12-step facilitation programs find that participants who remain engaged show substantial improvements, but dropout rates are high — often 60–80% before completion — and are disproportionately concentrated among clients who are ambivalent about abstinence, who are experiencing trauma or psychiatric comorbidity, or who have fewer social resources (Moos & Moos, 2006). People who drop out of abstinence-required treatment frequently discontinue all treatment engagement, not just that program. Harm reduction advocates argue that reducing the barriers to engagement — including the abstinence requirement itself — allows a broader population to maintain treatment contact, which creates more opportunities for change over time. This is sometimes called the "low-threshold" approach: meeting clients at whatever threshold they are at, rather than requiring them to reach a particular threshold before offering help.</p>`
            },
            {
              title: 'How do supervised consumption sites navigate legal challenges in the United States?',
              content: `<p>The two New York City SCS that opened in November 2021 (operated by OnPoint NYC) operate under a legal interpretation that existing New York State public health law, which permits operating a needle exchange without a prescription, can also cover supervised consumption. The federal government could theoretically prosecute under the Controlled Substances Act's "crack house" statute (21 USC § 856), which prohibits maintaining premises for the purpose of illegal drug use. However, as of mid-2024, the Department of Justice has not moved to close the New York sites, and a federal appeals court ruling in 2022 related to a proposed Philadelphia SCS created legal ambiguity about the applicability of the crack house statute to harm reduction programs. Several other cities — including San Francisco, Seattle, Philadelphia, and Denver — have implemented or are developing sanctioned SCS programs under various legal frameworks, and state legislation explicitly authorizing SCS has been introduced in multiple states.</p>`
            },
            {
              title: 'What are the harm reduction implications of the fentanyl test strip legal landscape?',
              content: `<p>Fentanyl test strips were originally designed as urine drug test strips and have been adapted for use in testing drug supply. Until 2021, many states classified them as drug paraphernalia under state law, making their distribution illegal. A wave of state law changes beginning in 2019, combined with the 2021 SAMHSA guidance clarifying federal paraphernalia law, has resulted in the majority of states now permitting FTS distribution — but the legal landscape remains uneven. As of 2024, a small number of states still classify FTS as paraphernalia. Clinicians distributing FTS must verify the law in their state. The North Carolina Harm Reduction Coalition and the North Carolina Drug Policy Alliance maintain frequently updated state law trackers. Clinicians who recommend that clients obtain FTS from pharmacies or online vendors in states where they are legal are on solid legal ground.</p>`
            },
            {
              title: 'What is cannabis substitution and what does the evidence say?',
              content: `<p>Cannabis substitution refers to the intentional use of cannabis as a less harmful alternative to other substances — most notably alcohol and opioids — either as a transitional step toward abstinence or as a long-term maintenance strategy. The evidence base is growing but remains preliminary. Studies in states with legal cannabis have found reductions in alcohol sales, opioid prescribing, and opioid overdose deaths following cannabis legalization, suggesting a substitution effect at the population level (Lucas et al., 2016). Individual-level studies have found that some patients report intentionally using cannabis to reduce opioid use, with self-reported reductions in pain and improved quality of life. Cannabis substitution is controversial within the treatment field because cannabis itself has a potential for problematic use and because many abstinence-based programs define cannabis use as a relapse regardless of the substance the client is primarily seeking to reduce. From a harm reduction perspective, the relevant question is whether cannabis use, in a given client's specific context, reduces harm compared to the substance it is substituting for — a clinical judgment that requires individualized assessment rather than categorical prohibition.</p>`
            }
          ]
        },

        // 1.6 IMAGE TEXT
        {
          type: 'imageText',
          order: 6,
          title: 'The Harm Reduction Hierarchy of Outcomes',
          content: `<p>Harm reduction does not treat all outcomes as equivalent — it recognizes a hierarchy from most beneficial (prevention of harm before it occurs) to still beneficial (reduction of harm once it has begun) to acceptable intermediate goal (stabilization) to aspirational longer-term goal (reduced use or abstinence, where the client defines and desires this). This hierarchy is not a ranking of client worth or clinical ambition — it is a practical framework for determining what intervention is appropriate at what moment. A client presenting for the first time after a near-fatal overdose needs overdose prevention supplies and basic stabilization before they are a candidate for a discussion of long-term recovery goals. A client with ten years of sobriety who begins using again during a relapse does not need to be removed from treatment — they need the same compassionate, skilled clinical response as any person navigating a difficult transition. The harm reduction hierarchy reminds clinicians that every stage of a client's journey is an opportunity for intervention, and that "not yet ready for abstinence" is a clinical status, not a moral verdict.</p>
<p>Practically, the hierarchy looks like this: at the base, keeping clients alive and physically safe (overdose reversal, wound care, disease prevention); above that, reducing the most dangerous behaviors (syringe sharing, injection of unknown substances, use while alone); above that, reducing use frequency or quantity; above that, reducing the contextual risks of use (avoiding driving, childcare responsibilities while intoxicated); and at the apex, reducing use toward abstinence when the client identifies that as their goal. Progress up the hierarchy is celebrated; movement back down the hierarchy is responded to with curiosity and clinical support rather than punishment or termination of services.</p>`,
          image: '',
          imageAlt: 'A stepped pyramid showing the harm reduction hierarchy of outcomes from overdose prevention at the base to abstinence at the apex',
          imagePosition: 'right'
        },

        // 1.7 KC BLOCK A — multipleChoice
        {
          type: 'multipleChoice',
          order: 7,
          question: 'Which of the following best describes the founding political context that delayed harm reduction implementation in the United States during the 1980s?',
          options: [
            { text: 'Lack of scientific evidence that syringe programs reduced HIV transmission', isCorrect: false },
            { text: 'The belief that providing clean equipment to people who use drugs would send an unacceptable message of government approval for drug use', isCorrect: true },
            { text: 'Opposition from the medical community based on concerns about clinical liability', isCorrect: false },
            { text: 'The absence of community organizations willing to operate needle exchanges', isCorrect: false }
          ],
          explanation: 'The primary political obstacle to harm reduction in the United States was the moral and ideological argument that providing sterile equipment would be read as government endorsement of drug use — despite evidence from Europe demonstrating effectiveness. Medical, legal, and community infrastructure existed; what was missing was political will.'
        },

        // 1.8 TEXT — deeper dive
        {
          type: 'text',
          order: 8,
          content: `<h2>Beyond the Binary: Challenging Abstinence-or-Failure Framing</h2>
<p>One of the most consequential conceptual shifts in harm reduction is the decoupling of treatment success from abstinence status. This shift is not merely philosophical — it has measurable effects on treatment engagement, outcomes measurement, and program design. When abstinence is the only metric of success, programs inadvertently create systems in which the majority of clients "fail" — not because they haven't reduced their use, improved their health, or stabilized their lives, but because they haven't achieved the binary endpoint that the program defined as success.</p>
<p>The abstinence-or-failure binary creates particularly severe problems for people with severe substance use disorders, people with co-occurring mental health conditions, and people with histories of trauma, poverty, housing instability, or involvement in the criminal legal system. For these individuals, abstinence may be a distant goal that requires years of incremental change, multiple treatment episodes, and significant social and environmental change to achieve. A treatment framework that defines every episode that does not end in abstinence as a failure does not serve these individuals well — it removes them from the treatment-seeking population at precisely the moments when they most need support.</p>
<p>Harm reduction's alternative framework asks: compared to the client's baseline, has harm been reduced? Is the client safer? Healthier? More socially connected? More financially stable? More engaged with healthcare? These are legitimate clinical outcomes regardless of the client's current use status. They are also outcomes that predict future movement toward recovery: research consistently shows that social stability, healthcare engagement, and trusting clinical relationships are significant predictors of successful sustained recovery, whether or not the client defines recovery as abstinence (White, 2008).</p>
<p>This framework has practical implications for how we document treatment, how we communicate with insurance companies and managed care organizations, how we write treatment plans, and how we supervise other clinicians. The ACA's shift toward outcome-based practice guidelines and the SAMHSA GPRA (Government Performance and Results Act) measures both allow for non-abstinence outcomes including reduced use frequency, improved quality of life, and increased treatment engagement. Clinicians who understand this can write more accurate and legally defensible documentation than those who feel they must frame every treatment contact as moving toward abstinence regardless of what is clinically occurring.</p>
<p>The National Institute on Drug Abuse (NIDA) framing of addiction as a chronic, relapsing brain disease — while itself controversial in some circles — has provided useful clinical language for this discussion. If addiction is a chronic condition like diabetes or hypertension, then periods of non-adherence to the treatment goal (return to use) are expected, predictable, and not inherently signs of treatment failure or inadequate motivation. A diabetic patient who exceeds their A1C target in a given quarter is not removed from diabetes management; they receive adjusted treatment. The same logic applies to addictions treatment and is, in fact, increasingly reflected in the accreditation standards of the Commission on Accreditation of Rehabilitation Facilities (CARF) and the Joint Commission.</p>`
        },

        // 1.9 FLASHCARD DECK
        {
          type: 'flashcardDeck',
          order: 9,
          title: 'Harm Reduction: Key Concepts and Historical Figures',
          instructions: 'Review these key terms and figures. Click each card to flip it and see the definition or explanation.',
          flashcards: [
            {
              front: 'G. Alan Marlatt',
              back: 'University of Washington researcher who developed relapse prevention therapy and was among the first U.S. researchers to formally conceptualize harm reduction as a clinical framework. His 1998 edited volume Harm Reduction: Pragmatic Strategies for Managing High-Risk Behaviors is considered foundational.'
            },
            {
              front: 'Insite (Vancouver, BC)',
              back: 'North America\'s first legally sanctioned supervised consumption site, opened in 2003. Research has associated it with a 35% reduction in overdose deaths in its vicinity, increased treatment uptake, and no identified increase in drug use or crime in the surrounding neighborhood.'
            },
            {
              front: 'Junkiebond',
              back: 'Dutch advocacy organization run by and for drug users that partnered with Amsterdam public health officials to create the first formal syringe exchange program in 1984. Their involvement established the harm reduction principle that people with lived experience should have leadership roles in designing services that affect them.'
            },
            {
              front: 'Andrew Tatarsky',
              back: 'New York City clinical psychologist who developed Integrative Harm Reduction Psychotherapy (IHRP), one of the first systematic frameworks for individual psychotherapy conducted under harm reduction principles. His 2002 book Harm Reduction Psychotherapy provided a clinical bridge between public health harm reduction and individual counseling.'
            },
            {
              front: 'Low-threshold services',
              back: 'Services designed to minimize the number of requirements or behavioral changes a person must demonstrate before accessing care. The opposite of high-threshold services (which might require abstinence, a fixed address, insurance, etc. before engagement). SSPs, many harm reduction organizations, and some housing-first programs exemplify low-threshold service models.'
            },
            {
              front: 'Fentanyl test strips (FTS)',
              back: 'Inexpensive lateral flow immunoassay strips originally designed for urine testing that can detect the presence of fentanyl in drug supply. Legal for distribution in most U.S. states as of 2024. Studies show that when people test positive for fentanyl in their supply, significant proportions take protective action including using less, using with others, or not using the supply at all.'
            },
            {
              front: 'Scott County HIV Outbreak (2015)',
              back: 'An outbreak of 135 HIV cases among people who inject drugs in Scott County, Indiana — a county of 24,000 — within five months. Directly attributed to the state\'s then-ban on syringe service programs. Contained following emergency authorization of a temporary SSP. Cited frequently as evidence of the public health cost of restricting harm reduction services.'
            },
            {
              front: 'Drug checking services',
              back: 'Services that analyze drug supply for fentanyl, adulterants, and composition. Range from FTS to mass spectrometry at harm reduction organizations. Used to provide consumers with information about what they are actually taking, enabling informed decision-making about whether and how to use.'
            }
          ]
        },

        // 1.10 KC BLOCK B — matching
        {
          type: 'matching',
          order: 10,
          matchingInstructions: 'Match each harm reduction intervention with the primary mechanism by which it reduces harm.',
          matchingPairs: [
            { term: 'Syringe Service Programs', definition: 'Reduce blood-borne disease transmission by providing sterile injection equipment and increasing treatment entry' },
            { term: 'Naloxone distribution', definition: 'Reverse opioid overdose in the community before emergency services arrive, preventing death' },
            { term: 'Supervised Consumption Sites', definition: 'Provide medical oversight during use so that overdose and other emergencies can be immediately addressed' },
            { term: 'Fentanyl test strips', definition: 'Allow people to detect unexpected fentanyl in drug supply and take precautionary action before use' },
            { term: 'Drug checking services (mass spectrometry)', definition: 'Provide detailed compositional information about drug supply, enabling more fully informed consumer decisions' },
            { term: 'Cannabis substitution', definition: 'Replace a higher-risk substance with one perceived to carry lower acute harm risk, particularly overdose risk' }
          ]
        },

        // 1.11 REFLECTION
        {
          type: 'reflection',
          order: 11,
          question: 'Think about a client you have worked with (or a hypothetical client) who was actively using substances and not motivated for abstinence. How did the treatment framework you were operating within shape what you offered that client? What might harm reduction principles have offered that was different? Where do you notice resistance or genuine tension with those principles, and what do you think underlies that resistance?',
          minLength: 50
        },

        // 1.12 KEY TAKEAWAY
        {
          type: 'keyTakeaway',
          order: 12,
          title: 'Key Takeaways: Section 1',
          takeaways: [
            'Harm reduction emerged from public health crises in the 1980s, particularly the AIDS epidemic, and was initially resisted in the United States on ideological rather than evidentiary grounds.',
            'The five core principles — pragmatism, humanism, non-abstinence goals, client-defined goals, and reduction of drug-related harm — have specific, concrete clinical implications for how we engage with clients.',
            'Syringe service programs, naloxone distribution, supervised consumption sites, and drug-checking services all have robust evidence of effectiveness in reducing harm without increasing drug use in the community.',
            'Counselor stigma and values conflicts are real clinical phenomena that can impair treatment effectiveness and require the same reflective examination as any countertransference.',
            'Fentanyl test strips are legal in most U.S. states, inexpensive, and evidence-supported; their distribution and education belongs in the routine clinical toolkit for any professional working with opioid-using clients.',
            'The abstinence-or-failure binary is not supported by the evidence on addiction as a chronic condition and actively harms treatment engagement for the clients most in need of sustained clinical support.'
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 2 — Clinical Application
    // ══════════════════════════════════════════════════════════════════════
    {
      title: 'Harm Reduction in Clinical Practice: Skills, Strategies, and Ethical Navigation',
      order: 2,
      contentBlocks: [

        // 2.1 DIVIDER
        {
          type: 'sectionDivider',
          title: 'Harm Reduction in Clinical Practice',
          subtitle: 'Skills, strategies, and ethical navigation',
          sectionNumber: '2',
          order: 1
        },

        // 2.2 TEXT — MI as harm reduction tool
        {
          type: 'text',
          order: 2,
          content: `<h2>Motivational Interviewing as a Harm Reduction Tool</h2>
<p>Motivational interviewing (MI) and harm reduction are natural clinical allies, though they emerged from different intellectual traditions. MI was developed by William Miller and Stephen Rollnick as a way of working with client ambivalence — the simultaneous desire to change and to not change that is characteristic of most human behavior change, including substance use. Harm reduction was developed as a public health and advocacy framework for reducing the adverse consequences of drug use. In practice, the two approaches converge in a powerful way: both reject the counselor as the authority on what the client should do; both locate motivation and goal-setting in the client; and both treat ambivalence as information to be explored rather than resistance to be overcome (Miller & Rollnick, 2013).</p>
<p>The MI principle of following the client's agenda rather than the counselor's agenda is perhaps the clearest point of overlap. In abstinence-required settings, MI is sometimes practiced in a way that steers clients toward abstinence — the counselor uses MI techniques to develop discrepancy and elicit change talk in the direction of stopping use entirely. This is a valid application of MI when abstinence is the client's identified goal. But MI can equally be used to help a client explore their ambivalence about reducing — rather than eliminating — their use, or to articulate goals like "I want to stop using meth but keep drinking," or "I want to use heroin but not share needles." These are harm reduction goals, and MI provides the clinical technology for helping clients articulate, commit to, and develop action plans around them.</p>
<p>Rollnick's concept of "change talk" is equally applicable in harm reduction contexts. When a client says, "I know that using by myself is dangerous — I've had three friends die alone," that is harm reduction change talk. The counselor who responds with MI skills — reflection, affirmation, evocation of next steps — can help the client move from that recognition toward a behavior change (always using with a buddy, calling someone before and after use, keeping naloxone accessible) without the interaction requiring either a commitment to abstinence or a judgment of the client for not yet being ready to stop.</p>
<p>Specific MI techniques with particular relevance to harm reduction include: <em>double-sided reflection</em>, which captures both sides of the ambivalence ("On one hand, you're not ready to stop using entirely; on the other hand, you're scared about the fentanyl in the supply"); <em>exploring values</em>, which can reveal that the client's use is in conflict with their own identified values even when abstinence is not the stated goal ("It sounds like being present for your kids is really important to you — how does using on weekday mornings sit with that?"); and <em>agenda mapping</em>, which makes explicit the range of possible change goals and asks the client which one they want to focus on today ("We could talk about reducing your daily amount, talk about what makes you feel safe when you're using, talk about your goals for the next month, or something else entirely — what feels most important to you right now?").</p>
<p>The evidence for MI in harm reduction contexts is strong. A 2016 Cochrane review of MI for illicit drug use found significant improvements in drug use, retention in treatment, and motivation for change compared to no-treatment controls, and comparable or superior results to other active treatments at shorter dosages (Smedslund et al., 2011). Critically, MI does not require abstinence as an outcome in order to demonstrate effectiveness — the review tracked outcomes including reduced use frequency, reduced quantity, and reduced harms from use, all of which showed improvement with MI intervention.</p>
<h2>Explicit Harm Reduction Goal-Setting in Counseling</h2>
<p>Harm reduction goal-setting is not a passive acceptance of whatever the client wants to do — it is an active, structured clinical process in which the counselor helps the client identify specific, meaningful, realistic change goals that will reduce harm, even if they do not eliminate use. This requires skill, because many clients have internalized the abstinence framework so completely that they feel they "might as well use as much as I want" if they can't stop entirely, or they feel shame about articulating goals that feel like "giving up." The counselor's task is to create a framework in which any reduction in harm is genuinely valued and celebrated, and in which the client can imagine incremental progress.</p>
<p>Practical harm reduction goals in counseling might include: reducing the frequency of use from daily to three to four times per week; reducing the quantity consumed per use episode; eliminating high-risk co-ingestion behaviors (e.g., mixing opioids and benzodiazepines); shifting from injection to smoking or intranasal routes when a client is not ready to stop injecting; implementing specific safety practices around use (never using alone, always testing supply, carrying naloxone); eliminating use during specific high-risk periods (while caring for children, while driving, during work hours); or maintaining a specific period of abstinence between episodes to reduce tolerance and avoid escalation.</p>
<p>Each of these goals represents a genuine harm reduction even if the client continues to use. Each can be tracked, assessed, and celebrated in the clinical relationship. Each can be a building block toward larger change when the client is ready. And each protects the client from harms — including death — that they might otherwise incur.</p>
<p>Behavioral tracking tools can support explicit harm reduction goal-setting. Drink and drug use diaries, smartphone apps, and simple paper logs can help clients see patterns in their use, identify high-risk triggers and contexts, and document progress toward goals. The TAPS (Tobacco, Alcohol, Prescription Medication, and Other Substance Use) screening tool, developed with NIDA funding, can be used at baseline and over time to track change in use across substance categories without requiring abstinence as the change metric. The Alcohol Use Disorders Identification Test (AUDIT) and the Drug Abuse Screening Test (DAST) similarly provide quantitative metrics that can show clinically meaningful improvement in the absence of abstinence.</p>`
        },

        // 2.3 CALLOUT — ethics
        {
          type: 'callout',
          order: 3,
          calloutType: 'ethics',
          title: 'Meeting People Where They Are Is Not Value-Neutral: The Ethics of Non-Abstinence Goals',
          content: `<p>A common misunderstanding of harm reduction is that it requires the counselor to be "value-neutral" — to have no position on drug use, to endorse whatever the client chooses to do, and to refrain from sharing clinical concerns. This misunderstanding is not what harm reduction requires, and it is important to address it directly because it leads to either ineffective practice (passive acceptance without clinical engagement) or unnecessary resistance to harm reduction (counselors correctly intuiting that their clinical judgment should still operate).</p>
<p>Harm reduction does not require value neutrality. It requires that the counselor's values not override the client's autonomy in setting goals. This distinction matters enormously in practice. A harm reduction-oriented counselor can and should:</p>
<ul>
<li>Share concerns about a client's use clearly and directly, using MI-consistent language that is non-judgmental but honest: "I want to share something that concerns me. When you told me you're mixing Xanax and heroin, I became worried about your safety because that combination significantly increases overdose risk."</li>
<li>Ask permission before sharing information, respecting the client's choice to hear or not hear it: "Would it be okay if I shared some information about what I know about mixing opioids and benzodiazepines?"</li>
<li>Maintain clinical documentation of assessed risk and the counselor's clinical recommendations, even when the client chooses a different course of action.</li>
<li>Decline to facilitate specific behaviors that cross professional ethical lines — for example, a counselor is not required to accompany a client to purchase drugs, to provide a client with paraphernalia not connected to their clinical services, or to participate in activities that violate the law.</li>
<li>Continue to assess for co-occurring disorders, trauma, suicidality, and other clinical concerns that are not addressed by harm reduction alone.</li>
</ul>
<p>What harm reduction ethics prohibit is the termination of clinical services because a client continues to use, the conditioning of care on behavioral compliance, or the communication — explicit or implicit — that a client who does not achieve abstinence is failing, inadequate, or undeserving of continued care. The ACA Code of Ethics section A.1.a establishes client welfare as the primary counseling obligation. For a client who is using and not yet ready to stop, harm reduction is frequently the clinical approach most consistent with client welfare — even when it is uncomfortable for the clinician.</p>`
        },

        // 2.4 TEXT — safer use counseling, documentation, etc.
        {
          type: 'text',
          order: 4,
          content: `<h2>Safer Use Counseling: Specific Practices and Skills</h2>
<p>Safer use counseling refers to providing clients who are actively using with specific, practical information about how to reduce the risks associated with that use. This is clinical skills-based education, not permission-giving. It is analogous to a nurse providing a patient who smokes with information about filter cigarettes and nicotine patches pending the patient's readiness to quit — the nurse is not endorsing smoking; they are reducing harm until the patient achieves cessation.</p>
<p><strong>Safer injection counseling</strong> for clients who inject drugs covers: always using a new, sterile syringe for every injection; never sharing syringes, cookers, cotton, or water; using clean water to prepare injections; rotating injection sites to reduce vein damage; recognizing and responding to vein infections; and where to obtain sterile supplies. This information is provided routinely by SSP staff and by harm reduction organizations. Mental health clinicians who work with people who inject drugs benefit from familiarity with this information both to be able to provide education and to accurately assess the risk level of a client's injection practices.</p>
<p><strong>Fentanyl awareness counseling</strong> for all clients who use illicit drugs — regardless of which drug they intend to use — covers: the near-universal presence of fentanyl in the illicit supply; the fact that fentanyl is odorless, tasteless, and invisible at lethal concentrations; how to obtain and use fentanyl test strips; and the importance of using a small "test dose" of any unfamiliar supply, waiting to assess effects before using the full amount, and not using alone. The CDC's "Only One Way to Know" public awareness campaign provides excellent client-facing materials. The Harm Reduction Coalition's "Getting Off Right" guide, available as a free download, provides comprehensive safer injection guidance.</p>
<p><strong>Stimulant use safer use counseling</strong> covers: the particular risk of cardiac events with high-dose or chronic stimulant use; the risk of stimulant-induced psychosis and how to recognize it; hydration when using in hot environments or while dancing; sleep and nutrition maintenance; and the risk of fentanyl contamination in methamphetamine and cocaine supply, which has become a major contributor to stimulant-related overdose deaths. Clients who use stimulants should be made aware that naloxone training and access is still relevant for them because fentanyl contamination of stimulant supply is now routine in most U.S. drug markets.</p>
<p><strong>Alcohol safer use counseling</strong> covers: the risks of mixing alcohol with other CNS depressants including opioids, benzodiazepines, and some antihistamines; alcohol content variation across beverages; hydration; pacing; the risks of driving or operating heavy machinery while impaired; and the specific danger of rapid reduction in alcohol intake for people with severe alcohol use disorder, who are at risk for alcohol withdrawal seizures. Clinicians should know the signs of alcohol withdrawal and the clinical indication for medical detox — a client who presents for counseling with severe daily alcohol use and history of seizures or delirium tremens should be referred for medically supervised detox rather than coached through self-managed cessation.</p>
<h2>Managing Abstinence-Based Program Requirements Ethically</h2>
<p>Many licensed mental health counselors work in settings with abstinence requirements — drug courts, therapeutic communities, residential programs, correctional settings, military and law enforcement employee assistance programs, and some third-party funded community mental health programs. These requirements may be legal, contractual, or policy-based, and the counselor operating within them does not have unilateral authority to waive them. This creates genuine ethical tension when a counselor working in such a setting is also trained in and committed to harm reduction principles.</p>
<p>Several principles can guide ethical navigation of this tension. First, transparency with clients is essential. A counselor in an abstinence-required program should make clear to clients at the outset what the program's requirements are, what the consequences of non-compliance are, and what reporting obligations the counselor has. A client who relapses has a right to know whether their counselor is required to report this to a drug court, an employer, or a child protective services agency. This is informed consent, and it allows the client to make genuinely autonomous decisions about what they disclose and to whom.</p>
<p>Second, the counselor can operate from harm reduction principles within the constraints of the setting's requirements. A drug court counselor cannot ignore positive drug screens, but they can use MI to explore the relapse non-judgmentally, can provide harm reduction information during the session (naloxone access, fentanyl test strips, safer use practices), and can document the session in a way that reflects the counselor's clinical assessment of the client's wellbeing and needs rather than simply the compliance status. The drug court has requirements; the counselor has obligations to both the court and the client, and harm reduction principles help the counselor protect the client's wellbeing within those constraints.</p>
<p>Third, counselors in abstinence-required settings should be aware of the clinical research on the effectiveness of contingency management — which has a strong evidence base — compared to punitive approaches — which do not. Drug courts that rely primarily on punishment for non-compliance show worse outcomes than those that use contingency management and therapeutic responses to relapse (Marlowe, 2011). Advocating within one's organization for more evidence-based responses to relapse is a legitimate professional activity and is supported by both the ACA Code of Ethics and SAMHSA's national guidelines.</p>
<h2>Harm Reduction with Co-Occurring Disorders</h2>
<p>The majority of people with substance use disorders have co-occurring psychiatric conditions — mood disorders, anxiety disorders, PTSD, personality disorders, and psychotic disorders — and the majority of people with serious psychiatric conditions have co-occurring substance use disorders. The clinical management of these co-occurring conditions under a harm reduction framework requires specific attention because the interactions between the conditions and the medications used to treat them create additional harm vectors.</p>
<p>People with PTSD and co-occurring opioid use disorder present a particularly common and challenging clinical picture. Opioids are highly effective at dampening hyperarousal symptoms in the short term, which means that opioid use can serve a genuine psychological function even as it creates escalating harms. Harm reduction with this population often means addressing the trauma directly (through evidence-based trauma therapies such as EMDR or CPT) while simultaneously working to reduce opioid-related harm through medication-assisted treatment, naloxone education, and safer use counseling. Treating the PTSD without addressing the opioid use, or treating the opioid use without addressing the PTSD, produces inferior outcomes to integrated treatment (Najavits, 2002).</p>
<p>People with schizophrenia and co-occurring cannabis use disorder benefit from harm reduction approaches that acknowledge the complex relationship between cannabis and psychosis — cannabis use can precipitate psychotic episodes in vulnerable individuals and can worsen positive symptoms in people with established schizophrenia, but cannabis use may also be functioning as self-medication for negative symptoms or medication side effects. Harm reduction with this population involves frank discussion of the psychosis-cannabis relationship, reduction of high-THC products in favor of lower-potency or higher-CBD products when the client is not ready to stop, monitoring of symptom changes associated with cannabis use, and coordination with the prescribing provider.</p>
<h2>Documentation and Liability</h2>
<p>Appropriate documentation of harm reduction clinical work protects both the client and the clinician. The key documentation principles in harm reduction practice are: (1) document informed consent for harm reduction approaches, including the client's understanding of the goals and their voluntary agreement to pursue non-abstinence outcomes; (2) document clinical assessment of risk at each contact, including identified substance use behaviors and any high-risk practices (injection drug use, polysubstance use, use while pregnant, use with children present); (3) document the counselor's clinical recommendations even when the client chooses a different course; (4) document harm reduction education provided (naloxone access, fentanyl test strips, safer use information) as a routine intervention that occurred; and (5) document the clinical rationale for harm reduction goal-setting rather than abstinence-focused treatment, which demonstrates that the approach reflects a considered clinical judgment rather than acquiescence or neglect of standard of care.</p>
<p>The standard of care question in harm reduction is important for clinicians to understand. While abstinence-based approaches remain dominant in many treatment systems, harm reduction is increasingly recognized as a legitimate clinical approach by major professional and accreditation bodies. The SAMHSA Treatment Improvement Protocol (TIP) series includes TIP 35 (Enhancing Motivation for Change in Substance Use Disorder Treatment) and other documents that explicitly support harm reduction-consistent approaches. CARF accreditation standards emphasize person-centered, outcomes-based care rather than requiring abstinence-focused models. A clinician who documents harm reduction work clearly, evidences clinical reasoning, and follows professional ethical standards is on solid legal ground, even in jurisdictions where abstinence-based approaches are the cultural norm.</p>`
        },

        // 2.5 ACCORDION
        {
          type: 'accordion',
          order: 5,
          accordionItems: [
            {
              title: 'How do I discuss safer use practices without feeling like I\'m condoning drug use?',
              content: `<p>This concern is one of the most common that clinicians raise about harm reduction, and it reflects a genuine discomfort that deserves direct address. The clinical reality is that providing safer use information does not condone use any more than a physician providing safer sex education condones unprotected sex, or a driving instructor teaching defensive driving condones traffic violations. The standard of care when a client is engaging in high-risk behavior is to provide information that reduces the risk of that behavior, not to withhold information as a form of disapproval.</p>
<p>Practically, many clinicians find that framing safer use information as harm assessment — "I need to understand what your use looks like right now so I can assess any immediate safety concerns" — feels clinically accurate and shifts the interaction from feeling like instruction to feeling like assessment. From there, providing information naturally follows: "When you mentioned you've been using alone — that concerns me. I want to share some information about what can happen and about some precautions that significantly reduce the risk of a fatal overdose when someone uses alone." The goal is not to approve or disapprove; it is to keep the client alive and in a position to make changes when they are ready.</p>`
            },
            {
              title: 'What are the clinical indicators that a client might benefit from cannabis substitution discussion?',
              content: `<p>Cannabis substitution is not a universal harm reduction recommendation — it is a clinical conversation that may be relevant for specific clients in specific contexts. Indicators that the conversation might be useful include: a client who is using opioids, methamphetamine, or alcohol and who has expressed interest in reducing those substances but is not engaged with or motivated for abstinence; a client who uses cannabis already and reports that it reduces their craving or use of higher-risk substances; a client with chronic pain who is using opioids primarily for pain management and who might benefit from exploring cannabis as an adjunctive or alternative pain management strategy; and a client who lives in a legal cannabis state and has relatively low risk of negative legal or employment consequences from cannabis use.</p>
<p>The conversation should be genuinely informed: cannabis is not risk-free, and the counselor should be familiar with the evidence on cannabis use disorder, the psychosis-cannabis relationship, the variability in potency and composition of commercial cannabis products, and the specific evidence on cannabis substitution. The goal is to help the client make an informed decision, not to prescribe cannabis — counselors do not prescribe medications. The conversation is about providing information and exploring the client's own assessment of risk and benefit.</p>`
            },
            {
              title: 'How do I handle a situation where a client discloses using in a context that triggers my mandatory reporting obligations?',
              content: `<p>Mandatory reporting obligations create one of the most challenging intersections between harm reduction values and legal/ethical obligations. The clearest examples: a client who uses substances while caring for minor children (may trigger a child welfare report); a client who is using and driving (may trigger duty-to-warn obligations in some states); a client who is using in a correctional setting or on drug court supervision (may trigger reporting to the court or probation officer).</p>
<p>The harm reduction principle of transparency is essential here: clients should be informed at the outset of counseling about the counselor's mandatory reporting obligations and the specific circumstances that trigger them. This is not a punitive disclosure — it is informed consent that allows the client to make genuinely autonomous decisions about what they disclose and to whom, and that maintains the integrity of the clinical relationship by ensuring the client is not surprised by reporting that occurs without their knowledge.</p>
<p>When reporting is mandatory, harm reduction still guides the clinical response: report what is required, then continue to engage clinically with the client about the harm reduction goals that exist alongside and beyond the mandatory reporting context. The report is not the end of the clinical relationship; it is a legal obligation that the counselor fulfills while continuing to provide clinical care.</p>`
            },
            {
              title: 'What is the "not using alone" intervention, and how do I introduce it clinically?',
              content: `<p>"Never Use Alone" (NUA) is a hotline service (1-800-484-3731) operated by harm reduction organizations that allows people who are using drugs alone — the highest-risk context for overdose death, since there is no one to reverse the overdose — to call in, speak to a staff member, and have that staff member stay on the phone during their use episode. If the caller stops responding, the staff member dispatches emergency services to the caller's location. NUA has reversed hundreds of overdoses since its founding.</p>
<p>Clinically, introducing NUA is straightforward: "One of the things I want to make sure you know about is a service specifically for people who use alone. I don't know your situation, but using alone is the highest-risk context for a fatal overdose, and this service has literally saved hundreds of lives. Would it be okay if I shared the number with you?" This framing is non-coercive, informational, and respects the client's autonomy to accept or decline the information. Document that the information was provided.</p>`
            },
            {
              title: 'How should I approach harm reduction conversations with a client whose substance use is related to trauma?',
              content: `<p>The intersection of trauma and substance use is one of the most clinically rich and important areas for harm reduction integration. Research consistently shows that trauma — particularly childhood trauma, sexual violence, and intimate partner violence — is a major driver of substance use disorders, and that substance use often functions as an adaptive coping mechanism for trauma symptoms even when it creates significant harm. Approaching harm reduction with trauma-affected clients requires integrating trauma-informed care principles: establishing safety before exploring trauma material, maintaining transparency and predictability in the clinical relationship, emphasizing the client's choice and control at every point, and recognizing that behavior that looks like "non-compliance" or "resistance" may be a trauma response.</p>
<p>Seeking Safety (Najavits, 2002) is one of the most extensively studied integrated trauma-substance use interventions and is explicitly compatible with harm reduction — it does not require abstinence and focuses on coping skill building and safety-seeking across both the trauma and substance use domains. Clinicians who work with this population benefit from Seeking Safety training and from the broader literature on trauma-informed harm reduction, which increasingly emphasizes peer support, group-based services, and services designed specifically for survivors of gender-based violence.</p>`
            }
          ]
        },

        // 2.6 IMAGE TEXT
        {
          type: 'imageText',
          order: 6,
          title: 'Harm Reduction Documentation: What Good Notes Look Like',
          content: `<p>Clinical documentation of harm reduction work often makes new practitioners anxious: "If I write that I provided fentanyl test strip education, does that implicate me legally?" The answer is no — in fact, the opposite is true. A counselor who documented a clinical assessment of opioid overdose risk, provided harm reduction education, and noted the client's response to that education is in a far stronger legal and ethical position than one whose notes reflect awareness of high-risk use with no corresponding intervention.</p>
<p>Strong harm reduction documentation includes: a clear statement of the clinical rationale for harm reduction goal-setting (e.g., "Client reports active daily opioid use with no current motivation for abstinence. Harm reduction approach selected to maintain treatment engagement and reduce immediate mortality risk"); a description of specific harm reduction education provided with the client's response; documentation of any safety planning around use (naloxone access, use with others, fentanyl testing); and the client's stated goals and any behavioral commitments made. Progress notes should reflect both the harm reduction goals and progress toward them, not just use status. Notes should also reflect the counselor's ongoing assessment of risk and any concerns discussed with the client, including the clinician's recommendation even when the client chose a different course.</p>
<p>Many counselors in abstinence-required settings feel they cannot document harm reduction work without violating program policy. The clinical reality is that harm reduction education — naloxone access, fentanyl awareness, safer use information — can and should be documented as health education in any setting where opioid-using clients are seen, regardless of the program's abstinence requirements. Health education is not in conflict with abstinence-based treatment; it is additive to it.</p>`,
          image: '',
          imageAlt: 'A sample clinical note format illustrating harm reduction documentation elements including risk assessment, education provided, and client-defined goals',
          imagePosition: 'left'
        },

        // 2.7 KC BLOCK A — multiSelect
        {
          type: 'multiSelect',
          order: 7,
          question: 'Which of the following are appropriate harm reduction goals that a counselor might help a client articulate and pursue, even in the absence of abstinence motivation? Select all that apply.',
          options: [
            { text: 'Eliminating use of benzodiazepines when combining them with opioids', isCorrect: true },
            { text: 'Committing to abstinence from all substances within 30 days', isCorrect: false },
            { text: 'Carrying naloxone and knowing how to administer it', isCorrect: true },
            { text: 'Testing drug supply with fentanyl test strips before each use episode', isCorrect: true },
            { text: 'Switching from intravenous to intranasal routes of drug administration', isCorrect: true },
            { text: 'Completing a 28-day residential treatment program before any other intervention', isCorrect: false },
            { text: 'Never using substances alone, or calling the Never Use Alone hotline when using solo', isCorrect: true },
            { text: 'Reducing use frequency from daily to 3-4 times per week', isCorrect: true }
          ],
          explanation: 'Harm reduction goals are client-defined and focus on reducing harm, not on achieving abstinence. All of the selected options represent genuine harm reductions that improve client safety and health, even if the client continues to use substances. Abstinence goals and residential treatment completion are valid interventions but are not harm reduction goals in the sense defined here — they are abstinence-based goals and may be appropriate for some clients but are not part of a harm reduction framework when the client is not motivated for them.'
        },

        // 2.8 TEXT
        {
          type: 'text',
          order: 8,
          content: `<h2>Harm Reduction Does Not Mean Condoning Use: The Therapeutic Stance That Sustains the Alliance</h2>
<p>Perhaps the most important clinical skill in harm reduction practice is maintaining what Tatarsky calls the "harm reduction therapeutic stance" — a genuine, sustained posture of unconditional positive regard, clinical honesty, and non-coercion that allows clients who use substances to experience a professional relationship that does not require them to perform motivation they don't have in order to receive care. This stance is harder to maintain than it sounds, and it requires ongoing attention to the countertransference processes that harm reduction work activates in most clinicians.</p>
<p>The therapeutic stance includes several specific elements. First, it requires what Rogers called genuineness — authentic positive regard for the person, not a performance of positivity that collapses under the weight of a difficult session or a difficult client. Clients who use drugs have usually extensive experience of professionals who express acceptance verbally but communicate frustration, disappointment, or contempt nonverbally. The person-first posture of harm reduction — seeing the client as a full human being whose substance use is one aspect of a complex life, not their defining feature — must be genuinely held to be effective.</p>
<p>Second, the therapeutic stance requires clinical confidence — the ability to hold the complexity of working with a client who is in danger without becoming paralyzed by anxiety or reactive with control. Clinicians who become highly activated by the danger a client is in tend to respond by increasing pressure for abstinence, which typically damages the alliance and reduces treatment engagement. The evidence-based response to a client who is in danger from their use is to engage with the danger clinically — assess it, address it with information and support, and maintain the relationship — rather than to pressure the client toward a change they are not ready to make.</p>
<p>Third, the therapeutic stance requires tolerance of uncertainty and complexity. Many clients who use substances are making genuine, complex trade-offs between the harms of using and the harms of not using — including withdrawal, loss of the social and emotional functions that use serves, economic costs of purchasing treatment rather than drugs, and the psychological cost of identifying oneself as someone with an addiction problem in a context where that identity carries stigma. The harm reduction clinician's task is not to resolve this complexity for the client but to help the client navigate it with more information, more self-awareness, and more clinical support than they would have alone.</p>
<p>This stance is sustained not by clinical detachment — the pretense that we don't care about outcomes — but by genuine therapeutic optimism: the belief, supported by the evidence on long-term recovery trajectories, that people who use drugs are capable of change, that change happens in its own time and on its own terms, and that maintaining a trusting, skilled clinical relationship through the times when change is not happening is itself a meaningful intervention that may make change possible in the future. William White's research on long-term recovery shows that the majority of people with severe substance use disorders ultimately achieve sustained recovery — through treatment, mutual aid, natural recovery, or some combination — and that clinical contact during periods of active use, even contact that does not produce immediate behavior change, is associated with better long-term outcomes (White, 2012).</p>`
        },

        // 2.9 SCENARIO TREE
        {
          type: 'scenarioTree',
          order: 9,
          scenarioTitle: 'Navigating a Clinical Harm Reduction Conversation with Marcus',
          instructions: 'Read each scenario node and choose the response that best reflects harm reduction principles. There may be more than one defensible response — the feedback explains the clinical reasoning.',
          startNode: 'start',
          nodes: {
            start: {
              text: 'Marcus, 34, has been seeing you for four months for depression. He disclosed three weeks ago that he uses methamphetamine about three times a week, primarily on weekends. Today he comes in and tells you: "I know you probably want me to stop, and I\'m just not there yet. I\'m using less than I was, but I can\'t stop right now." How do you respond?',
              choices: [
                { text: 'Reflect his ambivalence and affirm the reduction in use as meaningful progress', nextId: 'affirm' },
                { text: 'Express concern about the methamphetamine use and set a clear goal of abstinence for the next month', nextId: 'pressure' },
                { text: 'Tell Marcus you understand and ask if he would be willing to talk about what\'s making it hard to stop right now', nextId: 'explore' }
              ]
            },
            affirm: {
              text: 'You reflect: "You\'ve reduced how often you\'re using — that\'s a real change, and I don\'t want to gloss over that. I also want you to know that I\'m not focused on getting you to a particular place faster than you\'re ready to go. What would feel most useful to talk about today?" Marcus relaxes visibly. He says: "I guess I\'m worried about the fentanyl stuff I\'ve been hearing about. I didn\'t think that was in meth." What do you do?',
              choices: [
                { text: 'Provide accurate information about fentanyl contamination in the stimulant supply and discuss fentanyl test strips and naloxone', nextId: 'fts' },
                { text: 'Redirect to his depression symptoms since that is the primary presenting concern', nextId: 'redirect' }
              ]
            },
            pressure: {
              text: 'You set a goal of abstinence and Marcus shifts in his seat. "I knew you were going to say that. I was actually using less this week and feeling kind of good about it, but now I feel like I failed before I even started." What does this response tell you clinically?',
              choices: [
                { text: 'Recognize that the abstinence goal created shame and damaged the alliance; repair by affirming the reduction and exploring what goal Marcus would choose', nextId: 'repair' },
                { text: 'Continue with the abstinence goal, explaining the clinical reasons why full abstinence is important', nextId: 'insist' }
              ]
            },
            explore: {
              text: 'You ask about what makes stopping hard right now. Marcus shares that he\'s been using meth to manage energy and focus at work, that he has a demanding job with long hours, and that he\'s scared of what will happen if he can\'t keep up. He also shares that his use has been going up, not down, from what he told you three weeks ago. He was embarrassed to be honest. Now he\'s concerned about fentanyl contamination he\'s been reading about. What is the clinical priority?',
              choices: [
                { text: 'Acknowledge his honesty, address the fentanyl risk directly with harm reduction information, and explore the work-related use context together', nextId: 'fts' },
                { text: 'Focus primarily on the dishonesty in prior sessions and the need for accurate information to treat him', nextId: 'honesty' }
              ]
            },
            fts: {
              text: 'You provide information about fentanyl contamination in the stimulant supply — that fentanyl is increasingly found in meth and cocaine and has been responsible for a dramatic increase in stimulant-involved overdose deaths. You discuss fentanyl test strips and how to obtain them locally, and ask if Marcus would be willing to carry naloxone. He says: "I didn\'t know you could talk to me about this stuff. I thought I had to either stop or you couldn\'t help me." This is a clinical breakthrough moment. How do you respond?',
              choices: [
                { text: 'Acknowledge that you can talk about all of this, that his safety is the priority, and that your relationship doesn\'t require him to stop using in order for you to be fully present as his counselor', nextId: 'alliance' }
              ]
            },
            alliance: {
              text: 'Marcus becomes more open about his use, his triggers, and his ambivalence. Over the next several sessions, he develops a harm reduction plan that includes using with a friend rather than alone, testing his supply, carrying naloxone, and reducing use to two days a week. Six months later, he initiates a conversation about stopping entirely. The harm reduction relationship has maintained engagement and created the conditions for deeper change. This is a successful harm reduction trajectory.',
              isEnd: true
            },
            repair: {
              text: 'You recognize the clinical feedback and shift: "I hear what you\'re saying — and I\'m sorry if my goal landed like a verdict before you could tell me what you were feeling good about. Tell me about the week where you were using less. What was different?" Marcus re-engages. This is good clinical recovery — recognizing alliance rupture and repairing it.',
              isEnd: true
            },
            insist: {
              text: 'You continue with the abstinence goal. Marcus becomes quiet and agrees to try. He cancels the next two sessions and then disengages from treatment entirely. He later tells a friend that the counselor "just made him feel like a failure." This outcome — treatment dropout — is one of the primary harms that harm reduction approaches seek to prevent.',
              isEnd: true
            },
            redirect: {
              text: 'You return to depression symptoms. Marcus nods but seems less engaged. He is quietly carrying concern about fentanyl contamination that you have declined to address. This is a missed harm reduction opportunity — the client\'s stated concern was about safety, and redirecting away from it signals that safety-related questions about drug use are not within the scope of your clinical relationship.',
              isEnd: true
            },
            honesty: {
              text: 'You focus on the prior underreporting. Marcus becomes defensive and the session ends with more distance than before. The clinical priority was actually the safety concern about fentanyl contamination — addressing it first would have demonstrated that honesty leads to useful help rather than judgment, creating better conditions for future accuracy.',
              isEnd: true
            }
          }
        },

        // 2.10 KC BLOCK B — fillInBlank
        {
          type: 'fillInBlank',
          order: 10,
          title: 'Fill in the Blank: Harm Reduction in Clinical Practice',
          blanks: [
            {
              text: 'The _____ technique in motivational interviewing captures both sides of the client\'s ambivalence about change, making it particularly useful in harm reduction goal-setting conversations.',
              answer: 'double-sided reflection',
              options: ['double-sided reflection', 'confrontation', 'directive advice-giving', 'empathic confrontation']
            },
            {
              text: 'When a client with opioid use disorder also presents with PTSD, the evidence-supported clinical approach is _____ treatment that addresses both conditions simultaneously, rather than treating one before the other.',
              answer: 'integrated',
              options: ['integrated', 'sequential', 'abstinence-first', 'medication-only']
            },
            {
              text: 'The _____ hotline (1-800-484-3731) allows people using drugs alone to stay connected to a staff member who will dispatch emergency services if the caller stops responding.',
              answer: 'Never Use Alone',
              options: ['Never Use Alone', 'SAMHSA National Helpline', 'Crisis Text Line', 'Harm Reduction International']
            },
            {
              text: 'Under ACA Code of Ethics section A.11.b, counselors are prohibited from _____ their values on clients, which has direct implications for harm reduction practice.',
              answer: 'imposing',
              options: ['imposing', 'sharing', 'discussing', 'documenting']
            },
            {
              text: 'Fentanyl test strips were originally designed as _____ and have been adapted for testing drug supply to detect unexpected fentanyl contamination.',
              answer: 'urine drug test strips',
              options: ['urine drug test strips', 'blood pressure monitoring devices', 'saliva-based diagnostic tools', 'immunotherapy components']
            }
          ]
        },

        // 2.11 REFLECTION
        {
          type: 'reflection',
          order: 11,
          question: 'Consider the scenario with Marcus. At what point in that conversation did you feel the most discomfort — or where do you anticipate you might feel the most discomfort in your own practice? What does that discomfort tell you about the values and assumptions you bring to this work? How might you address those in supervision or consultation?',
          minLength: 50
        },

        // 2.12 KEY TAKEAWAY
        {
          type: 'keyTakeaway',
          order: 12,
          title: 'Key Takeaways: Section 2',
          takeaways: [
            'Motivational interviewing and harm reduction share core principles — client autonomy, ambivalence exploration, client-defined goals — and MI skills can be directly applied to non-abstinence harm reduction goal-setting.',
            'Safer use counseling is clinical education, not endorsement — providing specific information about fentanyl contamination, safer injection, naloxone access, and never using alone is evidence-based clinical practice.',
            'The harm reduction therapeutic stance requires genuine unconditional positive regard, clinical confidence, and tolerance of complexity — it is not passive acceptance but active, skilled engagement.',
            'In abstinence-required settings, harm reduction principles guide the therapeutic posture and the clinical education provided, even when the setting\'s structural requirements cannot be changed unilaterally.',
            'Documentation of harm reduction work — including clinical rationale, education provided, and client response — is best practice that protects both the client and the clinician.',
            'Cannabis substitution, integrated trauma-substance use treatment, and harm reduction with co-occurring disorders each require specific knowledge and skills that go beyond the general harm reduction framework.',
            'The evidence on long-term recovery trajectories supports clinical optimism: most people with substance use disorders achieve sustained recovery, and maintaining clinical contact during active use periods improves long-term outcomes.'
          ]
        },

        // 2.13 INLINE RESOURCES
        {
          type: 'resources',
          order: 13,
          title: 'Resources and Further Reading',
          resources: [
            {
              title: 'Harm Reduction Coalition — Guiding Principles of Harm Reduction',
              url: 'https://harmreduction.org/about-us/principles-of-harm-reduction/',
              type: 'website',
              description: 'The canonical statement of harm reduction principles from one of the leading U.S. harm reduction organizations. Includes historical context and clinical implications.'
            },
            {
              title: 'SAMHSA — Harm Reduction Framework',
              url: 'https://www.samhsa.gov/find-help/harm-reduction',
              type: 'website',
              description: 'Federal guidance from the Substance Abuse and Mental Health Services Administration on harm reduction as a component of the continuum of care. Includes links to state and community resources.'
            },
            {
              title: 'Never Use Alone — Hotline for People Using Drugs Alone',
              url: 'https://neverusealone.com/',
              type: 'website',
              description: 'The national hotline (1-800-484-3731) that stays on the phone with people using alone and dispatches emergency services if the caller stops responding. Clinical referral resource.'
            },
            {
              title: 'NEXT Distro — Naloxone Access by State',
              url: 'https://nextdistro.org/',
              type: 'website',
              description: 'State-by-state naloxone access and distribution information, including standing order status, pharmacy access, and mail-order naloxone options. Essential reference for counselors providing naloxone education.'
            },
            {
              title: 'The Harm Reduction Coalition — Getting Off Right: A Safety Manual for Injection Drug Users',
              url: 'https://harmreduction.org/issues/safer-drug-use/getting-off-right/',
              type: 'website',
              description: 'A free, comprehensive guide to safer injection practices available for client distribution. Covers sterile equipment use, vein care, overdose prevention, and treatment resources.'
            },
            {
              title: 'North Carolina Harm Reduction Coalition — Fentanyl Test Strip State Law Tracker',
              url: 'https://www.nchrc.org/fts/',
              type: 'website',
              description: 'Regularly updated tracker of state-by-state legal status of fentanyl test strips, including paraphernalia law status and pharmacy access.'
            },
            {
              title: 'Tatarsky, A. (2002). Harm Reduction Psychotherapy: A New Treatment for Drug and Alcohol Problems. Jason Aronson.',
              url: 'https://www.amazon.com/Harm-Reduction-Psychotherapy-Treatment-Problems/dp/0765702800',
              type: 'book',
              description: 'The foundational clinical text on integrative harm reduction psychotherapy, providing a systematic framework for individual counseling under harm reduction principles.'
            },
            {
              title: 'OnPoint NYC — North America\'s First Sanctioned Overdose Prevention Centers',
              url: 'https://onpointnyc.org/',
              type: 'website',
              description: 'Information about the New York City overdose prevention centers, including program data, policy context, and community impact reports.'
            }
          ]
        }
      ]
    }
  ],

  // ─── ASSESSMENT ──────────────────────────────────────────────────────────
  assessment: {
    passingScore: 75,
    questions: [
      {
        type: 'multipleChoice',
        question: 'The first formal syringe exchange program in Amsterdam (1984) was established through collaboration between Dutch public health officials and:',
        options: [
          { text: 'The Netherlands Ministry of Health acting alone', isCorrect: false },
          { text: 'The Junkiebond, an advocacy organization run by and for drug users', isCorrect: true },
          { text: 'UNICEF and the World Health Organization', isCorrect: false },
          { text: 'A consortium of Dutch medical schools', isCorrect: false }
        ],
        explanation: 'The Amsterdam SSP emerged from collaboration between public health officials and the Junkiebond, establishing the harm reduction principle of meaningful participation by people with lived experience in designing services that affect them.'
      },
      {
        type: 'multipleChoice',
        question: 'The Scott County, Indiana HIV outbreak of 2015 — 135 HIV cases in a county of 24,000 in five months — was directly attributable to:',
        options: [
          { text: 'A contaminated blood supply at the local hospital', isCorrect: false },
          { text: 'The state\'s ban on syringe service programs', isCorrect: true },
          { text: 'A failure of local law enforcement to interdict drug trafficking', isCorrect: false },
          { text: 'The lack of HIV testing services in the county', isCorrect: false }
        ],
        explanation: 'Indiana\'s ban on SSPs was identified as the direct policy failure that allowed HIV to spread rapidly among PWID in Scott County. Following emergency authorization of a temporary SSP, the outbreak was contained.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes the "low-threshold" approach in harm reduction services?',
        options: [
          { text: 'Services that accept only clients with the lowest severity substance use disorders', isCorrect: false },
          { text: 'Services that minimize entry requirements so that people can access care at whatever behavioral stage they are currently in', isCorrect: true },
          { text: 'Services that focus on gradually lowering the client\'s use over time', isCorrect: false },
          { text: 'Services that accept only clients who do not have co-occurring mental health diagnoses', isCorrect: false }
        ],
        explanation: 'Low-threshold services are designed to reduce barriers to engagement, meaning fewer requirements that clients must meet before accessing care. This contrasts with high-threshold services that may require abstinence, a fixed address, or other conditions before providing help.'
      },
      {
        type: 'multipleChoice',
        question: 'Insite, the supervised consumption site in Vancouver, BC, has been associated with which of the following outcomes?',
        options: [
          { text: 'Increased drug use in the surrounding neighborhood and reduced treatment uptake', isCorrect: false },
          { text: 'A 35% reduction in overdose deaths in its vicinity and increased uptake of detox and treatment services', isCorrect: true },
          { text: 'No measurable effect on overdose mortality but significant reduction in drug trafficking', isCorrect: false },
          { text: 'Increased HIV transmission rates due to the concentration of drug users in one location', isCorrect: false }
        ],
        explanation: 'Research on Insite has consistently found reductions in overdose mortality, emergency room presentations, and increased treatment entry, with no evidence of increased drug use or crime in the surrounding area.'
      },
      {
        type: 'multipleChoice',
        question: 'The ACA Code of Ethics provision most directly relevant to harm reduction practice is:',
        options: [
          { text: 'Section B.1.c — Privacy and Confidentiality', isCorrect: false },
          { text: 'Section A.11.b — which prohibits counselors from imposing their values on clients', isCorrect: true },
          { text: 'Section C.2.a — Boundaries of Competence', isCorrect: false },
          { text: 'Section D.1.b — Relationships with Other Professionals', isCorrect: false }
        ],
        explanation: 'Section A.11.b of the ACA Code of Ethics explicitly prohibits value imposition, which directly supports harm reduction practice — counselors cannot require clients to adopt the counselor\'s values about abstinence as a condition of receiving clinical services.'
      },
      {
        type: 'multipleChoice',
        question: 'A client who uses opioids daily and who has no current motivation for abstinence presents for counseling. From a harm reduction perspective, which of the following is the most appropriate initial clinical response?',
        options: [
          { text: 'Decline to provide counseling services until the client is ready to commit to abstinence', isCorrect: false },
          { text: 'Refer the client to a residential treatment program before beginning outpatient counseling', isCorrect: false },
          { text: 'Engage the client, assess harm reduction needs, provide naloxone and fentanyl education, and explore non-abstinence goals the client is willing to work toward', isCorrect: true },
          { text: 'Provide counseling focused only on mental health symptoms unrelated to substance use', isCorrect: false }
        ],
        explanation: 'Harm reduction requires engagement with clients at whatever stage they are at, including active use with no current abstinence motivation. Immediate safety needs (naloxone access, fentanyl awareness) are addressed alongside client-defined goals.'
      },
      {
        type: 'multipleChoice',
        question: 'Research on the relationship between syringe service programs and treatment entry has found that:',
        options: [
          { text: 'People who access SSPs are less likely to enter treatment because the programs enable continued use', isCorrect: false },
          { text: 'People who access SSPs are significantly more likely to enter substance use treatment than those who do not', isCorrect: true },
          { text: 'SSPs have no measurable effect on treatment entry rates', isCorrect: false },
          { text: 'SSPs increase treatment entry among women but decrease it among men', isCorrect: false }
        ],
        explanation: 'Multiple studies have found that SSP clients are more likely to enter treatment, likely because the trusting relationships developed with SSP staff serve as bridges to treatment. This directly contradicts the argument that SSPs keep people out of treatment.'
      },
      {
        type: 'multipleChoice',
        question: 'The "never use alone" intervention most specifically addresses which harm associated with opioid use?',
        options: [
          { text: 'Blood-borne disease transmission from shared equipment', isCorrect: false },
          { text: 'The risk of fatal overdose when there is no one present to administer naloxone or call for help', isCorrect: true },
          { text: 'The financial costs of purchasing drugs', isCorrect: false },
          { text: 'The legal consequences of drug possession', isCorrect: false }
        ],
        explanation: 'Using alone is the highest-risk context for fatal overdose because there is no one present to reverse the overdose. The Never Use Alone hotline specifically addresses this risk by maintaining connection to emergency services during solo use episodes.'
      },
      {
        type: 'multipleChoice',
        question: 'In harm reduction clinical practice, documenting harm reduction education and the counselor\'s clinical recommendation even when a client declines to follow it primarily serves to:',
        options: [
          { text: 'Create a record that can be used to discontinue services if the client continues to use', isCorrect: false },
          { text: 'Protect both the client and the clinician by demonstrating that risk was assessed and standard-of-care education was provided', isCorrect: true },
          { text: 'Fulfill insurance billing requirements that mandate documentation of behavior change goals', isCorrect: false },
          { text: 'Provide evidence for mandatory reporting if the client\'s use escalates', isCorrect: false }
        ],
        explanation: 'Documentation of harm reduction education and clinical recommendations creates a legal and ethical record showing that the counselor identified risk and intervened appropriately, regardless of whether the client chose to follow the recommendation.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes the relationship between motivational interviewing and harm reduction?',
        options: [
          { text: 'MI is incompatible with harm reduction because MI always steers clients toward abstinence', isCorrect: false },
          { text: 'MI and harm reduction share core principles including client autonomy and client-defined goals, and MI skills can be applied to non-abstinence harm reduction goal-setting', isCorrect: true },
          { text: 'MI should be used first to achieve abstinence, followed by harm reduction if MI fails', isCorrect: false },
          { text: 'Harm reduction replaces MI entirely in work with substance-using clients', isCorrect: false }
        ],
        explanation: 'MI and harm reduction share a philosophical foundation that locates authority over goals in the client rather than the counselor. MI techniques — including double-sided reflection, agenda mapping, and values exploration — can be directly applied to harm reduction goal-setting.'
      },
      {
        type: 'multipleChoice',
        question: 'G. Alan Marlatt\'s contribution to harm reduction is most accurately described as:',
        options: [
          { text: 'Developing the first syringe exchange program in the United States', isCorrect: false },
          { text: 'Founding the International Harm Reduction Association', isCorrect: false },
          { text: 'Developing relapse prevention therapy and formalizing harm reduction as a clinical framework in the United States', isCorrect: true },
          { text: 'Creating the Mersey Model of prescribing pharmaceutical heroin to registered drug users', isCorrect: false }
        ],
        explanation: 'Marlatt was among the first U.S. researchers to conceptualize harm reduction as a clinical framework, through his work on relapse prevention and his 1998 edited volume on harm reduction strategies.'
      },
      {
        type: 'multipleChoice',
        question: 'A counselor working in a drug court setting whose client tests positive for opioids should, from a harm reduction perspective:',
        options: [
          { text: 'Report the positive test to the court and terminate the therapeutic relationship to maintain program integrity', isCorrect: false },
          { text: 'Decline to report the positive test to protect the therapeutic alliance', isCorrect: false },
          { text: 'Fulfill mandatory reporting requirements, then continue to engage clinically — including providing harm reduction education — within the context of the therapeutic relationship', isCorrect: true },
          { text: 'Tell the client to detox independently before the next session to avoid further positive tests', isCorrect: false }
        ],
        explanation: 'In abstinence-required settings, harm reduction guides the therapeutic posture and education provided even when structural requirements cannot be changed. Reporting that is legally required should be done transparently with the client informed in advance; clinical engagement continues after reporting.'
      },
      {
        type: 'multipleChoice',
        question: 'The primary clinical rationale for integrating trauma-focused treatment with harm reduction in clients with co-occurring PTSD and opioid use disorder is:',
        options: [
          { text: 'Treating PTSD first will automatically resolve opioid use disorder', isCorrect: false },
          { text: 'Opioid use disorder must be treated first before trauma work can safely begin', isCorrect: false },
          { text: 'Opioids often serve a psychological function in managing trauma symptoms, and addressing both conditions simultaneously produces superior outcomes to sequential treatment', isCorrect: true },
          { text: 'PTSD and opioid use disorder are unrelated conditions that require separate treatment pathways', isCorrect: false }
        ],
        explanation: 'Research on co-occurring PTSD and substance use disorders consistently finds that integrated treatment — addressing both conditions simultaneously — produces superior outcomes. Seeking Safety is one evidence-based integrated approach compatible with harm reduction.'
      },
      {
        type: 'multipleChoice',
        question: 'Fentanyl test strips are relevant for clients who use which of the following substances?',
        options: [
          { text: 'Opioids only, since fentanyl is an opioid and is found only in opioid supply', isCorrect: false },
          { text: 'All illicit substances, since fentanyl is increasingly found in stimulant supply (methamphetamine, cocaine) as well as opioids', isCorrect: true },
          { text: 'Stimulants only, since opioid users already know they are exposed to fentanyl', isCorrect: false },
          { text: 'Cannabis only, since fentanyl contamination is most common in cannabis products', isCorrect: false }
        ],
        explanation: 'Fentanyl contamination of the illicit drug supply is now widespread across substance categories, including methamphetamine and cocaine. People who use stimulants and have no opioid tolerance are at high overdose risk from fentanyl contamination and should receive FTS education regardless of their primary substance.'
      },
      {
        type: 'multipleChoice',
        question: 'Which harm reduction intervention directly addresses the challenge of obtaining medications for opioid use disorder (buprenorphine, methadone) in rural and underserved communities?',
        options: [
          { text: 'Supervised consumption sites', isCorrect: false },
          { text: 'Cannabis substitution', isCorrect: false },
          { text: 'Telehealth-delivered medication-assisted treatment (MAT)', isCorrect: true },
          { text: 'Fentanyl test strip distribution', isCorrect: false }
        ],
        explanation: 'Telehealth-delivered MAT, including evaluation and buprenorphine prescribing via video consultation, has shown significant promise in expanding access to medication-assisted treatment in areas where in-person prescribers are unavailable, particularly following COVID-19 regulatory changes.'
      },
      {
        type: 'multipleChoice',
        question: 'William White\'s research on long-term recovery trajectories most strongly supports which harm reduction principle?',
        options: [
          { text: 'Abstinence must be achieved rapidly for recovery to be sustained', isCorrect: false },
          { text: 'Clinical contact during periods of active use is associated with better long-term outcomes, supporting the value of maintaining therapeutic relationships with clients who are not yet ready to stop using', isCorrect: true },
          { text: 'Natural recovery without clinical intervention is the most common pathway to sustained remission', isCorrect: false },
          { text: 'Harm reduction approaches are only effective for people with mild substance use disorders', isCorrect: false }
        ],
        explanation: 'White\'s longitudinal research on recovery shows that maintaining clinical contact during active use — even when immediate behavior change does not result — is associated with better long-term recovery outcomes, providing empirical support for harm reduction engagement.'
      },
      {
        type: 'multipleChoice',
        question: 'The term "harm reduction therapeutic stance" as used by Tatarsky refers to:',
        options: [
          { text: 'A therapeutic posture of value neutrality in which the counselor has no clinical opinions about client drug use', isCorrect: false },
          { text: 'A genuine posture of unconditional positive regard, clinical honesty, and non-coercion that does not require clients to perform motivation they don\'t have in order to receive care', isCorrect: true },
          { text: 'A clinical technique for reducing client defensiveness by matching the client\'s use behavior', isCorrect: false },
          { text: 'A structured behavioral protocol for gradually reducing substance use quantity over time', isCorrect: false }
        ],
        explanation: 'The harm reduction therapeutic stance is not value neutrality — it is active, skilled engagement from a posture of genuine unconditional positive regard that does not make clinical care contingent on client compliance with the counselor\'s goals.'
      }
    ]
  },

  // ─── REFERENCES ──────────────────────────────────────────────────────────
  references: [
    'Coffin, P. O., & Sullivan, S. D. (2013). Cost-effectiveness of distributing naloxone to heroin users for lay overdose reversal. <em>Annals of Internal Medicine, 158</em>(1), 1–9. https://doi.org/10.7326/0003-4819-158-1-201301010-00003',
    'Centers for Disease Control and Prevention. (2004). <em>Syringe exchange programs — United States, 2002</em>. MMWR Morbidity and Mortality Weekly Report, 53(37), 865–868.',
    'Des Jarlais, D. C., Friedman, S. R., Choopanya, K., Vanichseni, S., & Ward, T. P. (1992). International epidemiology of HIV and AIDS among injecting drug users. <em>AIDS, 6</em>(10), 1053–1068. https://doi.org/10.1097/00002030-199210000-00001',
    'Des Jarlais, D. C., Hagan, H., Friedman, S. R., Friedmann, P., Goldberg, D., Frischer, M., Green, S., Tunving, K., Ljungberg, B., Wodak, A., Ross, M., Purchase, D., Millson, M. E., & Myers, T. (1995). Maintaining low HIV seroprevalence in populations of injecting drug users. <em>JAMA, 274</em>(15), 1226–1231. https://doi.org/10.1001/jama.1995.03530150060029',
    'Friedman, S. R., de Jong, W., & Wodak, A. (1993). Community development as a response to HIV among drug injectors. <em>AIDS, 7</em>(Suppl 1), S263–S269. https://doi.org/10.1097/00002030-199301001-00034',
    'Giglio, R. E., Li, G., & DiMaggio, C. J. (2015). Effectiveness of bystander naloxone administration and overdose education programs: A meta-analysis. <em>Injury Epidemiology, 2</em>(1), 10. https://doi.org/10.1186/s40621-015-0040-7',
    'Hagan, H., McGough, J. P., Thiede, H., Hopkins, S., Weiss, N. S., & Alexander, E. R. (2000). Reduced injection frequency and increased entry and retention in drug treatment associated with needle-exchange participation in Seattle drug injectors. <em>Journal of Substance Abuse Treatment, 19</em>(3), 247–252. https://doi.org/10.1016/S0740-5472(00)00104-5',
    'Kelly, J. F., & Westerhoff, C. M. (2010). Does it matter how we refer to individuals with substance-related conditions? A randomized study of two commonly used terms. <em>International Journal of Drug Policy, 21</em>(3), 202–207. https://doi.org/10.1016/j.drugpo.2009.10.010',
    'Kerr, T., Stoltz, J., Tyndall, M., Li, K., Zhang, R., Montaner, J., & Wood, E. (2006). Impact of a medically supervised safer injection facility on community drug use patterns: A before and after study. <em>BMJ, 332</em>(7535), 220–222. https://doi.org/10.1136/bmj.38684.657801.7C',
    'Logan, T. K., & Cole, J. (2007). The intersection of domestic violence and substance use: Research and issues. <em>Journal of Addictive Diseases, 26</em>(Suppl 1), 55–70. https://doi.org/10.1300/J069v26S01_06',
    'Lucas, P., Walsh, Z., Crosby, K., Callaway, R., Belle-Isle, L., Kay, R., & Holtzman, S. (2016). Substituting cannabis for prescription drugs, alcohol and other substances among medical cannabis patients: The impact of contextual factors. <em>Drug and Alcohol Review, 35</em>(3), 326–333. https://doi.org/10.1111/dar.12323',
    'Marlatt, G. A., & Witkiewitz, K. (2002). Harm reduction approaches to alcohol use: Health promotion, prevention, and treatment. <em>Addictive Behaviors, 27</em>(6), 867–886. https://doi.org/10.1016/S0306-4603(02)00294-0',
    'Marlowe, D. B. (2011). Evidence-based sentencing for drug offenders: An analysis of prognostic risks and criminogenic needs. <em>Chapman Journal of Criminal Justice, 1</em>(1), 167–201.',
    'Miller, W. R., & Rollnick, S. (2013). <em>Motivational interviewing: Helping people change</em> (3rd ed.). Guilford Press.',
    'Miller, W. R., Wilbourne, P. L., & Hettema, J. E. (2003). What works? A summary of alcohol treatment outcome research. In R. K. Hester & W. R. Miller (Eds.), <em>Handbook of alcoholism treatment approaches: Effective alternatives</em> (3rd ed., pp. 13–63). Allyn & Bacon.',
    'Moos, R. H., & Moos, B. S. (2006). Rates and predictors of relapse after natural and treated remission from alcohol use disorders. <em>Addiction, 101</em>(2), 212–222. https://doi.org/10.1111/j.1360-0443.2006.01310.x',
    'Najavits, L. M. (2002). <em>Seeking safety: A treatment manual for PTSD and substance abuse</em>. Guilford Press.',
    'Peters, P. J., Pontones, P., Hoover, K. W., Patel, M. R., Galang, R. R., Shields, J., Blosser, S. J., Spiller, M. W., Combs, B., Switzer, W. M., Conrad, C., Gentry, J., Khudyakov, Y., Waterhouse, D., Owen, S. M., Heneine, W., Whalen, C. C., Whitfield, Y., Weidle, P. J., & Broz, D. (2016). HIV infection linked to injection use of oxymorphone in Indiana, 2014–2015. <em>New England Journal of Medicine, 375</em>(3), 229–239. https://doi.org/10.1056/NEJMoa1515195',
    'Sherman, S. G., Park, J. N., Glick, J., McKenzie, M., Morales, K., Christensen, T., & Green, T. C. (2018). FORECAST study summary: Fentanyl overdose reduction checking analysis study in Baltimore. Johns Hopkins Bloomberg School of Public Health.',
    'Smedslund, G., Berg, R. C., Hammerstrøm, K. T., Steiro, A., Leiknes, K. A., Dahl, H. M., & Karlsen, K. (2011). Motivational interviewing for substance abuse. <em>Cochrane Database of Systematic Reviews, 2011</em>(5), CD008063. https://doi.org/10.1002/14651858.CD008063.pub2',
    'Tatarsky, A. (2002). <em>Harm reduction psychotherapy: A new treatment for drug and alcohol problems</em>. Jason Aronson.',
    'White, W. (2008). <em>Slaying the dragon: The history of addiction treatment and recovery in America</em> (2nd ed.). Chestnut Health Systems.',
    'White, W. L. (2012). <em>Recovery/remission from substance use disorders: An analysis of reported outcomes in 415 scientific reports, 1868–2011</em>. Philadelphia Department of Behavioral Health and Intellectual disAbility Services.',
    'Wodak, A., & Cooney, A. (2010). Do needle syringe programs reduce HIV infection among injecting drug users: A comprehensive review of the international evidence. <em>Substance Use & Misuse, 41</em>(6–7), 777–813. https://doi.org/10.1080/10826080600669579',
    'Wood, E., Tyndall, M. W., Montaner, J. S., & Kerr, T. (2006). Summary of findings from the evaluation of a pilot medically supervised safer injecting facility. <em>CMAJ, 175</em>(11), 1399–1404. https://doi.org/10.1503/cmaj.060863'
  ]
};

// ─── VALIDATE ────────────────────────────────────────────────────────────────
function validate(course) {
  const errors = [];

  // Word count
  const wc = countCourseWords(course);
  console.log(`  Word count: ${wc}`);
  if (wc < 12000) errors.push(`Word count ${wc} is below 12,000 minimum`);

  // References
  if (!course.references || course.references.length < 15) {
    errors.push(`References: ${course.references?.length ?? 0} (minimum 15)`);
  }

  // Resources
  let resourceCount = 0;
  for (const section of course.sections) {
    for (const block of section.contentBlocks) {
      if (block.type === 'resources' && block.resources) {
        resourceCount += block.resources.length;
      }
    }
  }
  if (resourceCount < 6) errors.push(`Inline resources: ${resourceCount} (minimum 6)`);

  // Assessment
  if (!course.assessment?.questions || course.assessment.questions.length < 15) {
    errors.push(`Assessment questions: ${course.assessment?.questions?.length ?? 0} (minimum 15)`);
  }

  // Required sections
  if (!course.sections || course.sections.length < 3) {
    errors.push(`Sections: ${course.sections?.length ?? 0} (minimum 3)`);
  }

  return errors;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  const errors = validate(COURSE);
  if (errors.length > 0) {
    console.error('\nValidation FAILED:');
    errors.forEach(e => console.error('  ✗', e));
    process.exit(1);
  }
  console.log('Validation PASSED');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Dynamic import after connection
  const { default: InteractiveCourse } = await import('../models/InteractiveCourse.js');

  const existing = await InteractiveCourse.findOne({ slug: SLUG });
  if (existing) {
    await InteractiveCourse.deleteOne({ _id: existing._id });
    console.log(`Deleted existing course: ${SLUG}`);
  }

  const doc = await InteractiveCourse.create(COURSE);
  console.log(`Created: ${doc.title} (${doc._id})`);
  console.log(`  Slug: ${doc.slug}`);
  console.log(`  Sections: ${doc.sections.length}`);
  console.log(`  Assessment questions: ${doc.assessment.questions.length}`);
  console.log(`  References: ${doc.references.length}`);
  console.log(`  CE Hours: ${doc.ceHours}`);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
