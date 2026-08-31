/**
 * seedCR106-Suicide-Risk-Assessment.js
 * CR-106 — Suicide Risk Assessment and Crisis Intervention (4CE)
 *
 * Run from ~/project/src/server:
 *   node src/scripts/seedCR106-Suicide-Risk-Assessment.js
 *
 * Dry-run by default. Add --apply to write.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../../.env') });

const APPLY = process.argv.includes('--apply');

const course = {
  courseCode: 'CR-106',
  slug: 'cr-106-suicide-risk-assessment-crisis-intervention',
  title: 'Suicide Risk Assessment and Crisis Intervention',
  ceHours: 4,
  category: 'clinical',
  difficulty: 'intermediate',
  isPublished: false,
  status: 'draft',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  description: 'Suicide represents the 11th leading cause of death in the United States, and every licensed mental health professional will encounter suicidal clients across their career. This 4-hour continuing education course prepares counselors to assess, intervene, and document suicide risk with confidence. Participants will examine current epidemiological data, learn evidence-based risk stratification, master the Stanley-Brown Safety Planning Intervention, implement lethal means counseling, apply ethical and legal standards, and develop sustainable self-care practices for this demanding clinical domain.',
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC',
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC',
  },
  approvals: [{ body: 'NBCC', number: '#7760', hourBreakdown: [{ label: 'core', hours: 4 }] }],
  wordCount: 0,
  assessment: {
    title: 'Final Assessment',
    description: 'You must score 80% or higher to receive CE credit.',
    timeLimit: 45,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        text: 'Approximately what percentage of suicide deaths in the United States involve firearms?',
        question: 'Approximately what percentage of suicide deaths in the United States involve firearms?',
        type: 'multipleChoice',
        options: [
          { text: '25%', isCorrect: false },
          { text: '35%', isCorrect: false },
          { text: 'Over 50%', isCorrect: true },
          { text: '75%', isCorrect: false },
        ],
        explanation: 'Firearms account for over 50% of suicide deaths in the United States. Because firearm attempts result in death approximately 85% of the time, lethal means counseling focused on temporary firearms restriction is a high-leverage suicide prevention intervention.',
      },
      {
        text: "According to Joiner's Interpersonal Theory of Suicide, which three elements must simultaneously be present for a suicide attempt to occur?",
        question: "According to Joiner's Interpersonal Theory of Suicide, which three elements must simultaneously be present for a suicide attempt to occur?",
        type: 'multipleChoice',
        options: [
          { text: 'Depression, hopelessness, and impulsivity', isCorrect: false },
          { text: 'Thwarted belongingness, perceived burdensomeness, and acquired capability', isCorrect: true },
          { text: 'Mental illness, substance abuse, and access to means', isCorrect: false },
          { text: 'Social isolation, family history, and recent loss', isCorrect: false },
        ],
        explanation: "Joiner's Interpersonal Theory identifies three necessary conditions: thwarted belongingness (unmet need for social connection), perceived burdensomeness (belief one is a burden to others), and acquired capability (habituation to pain and reduced fear of death). This explains why not all individuals with suicidal ideation make attempts.",
      },
      {
        text: 'The strongest individual predictor of future suicidal behavior is:',
        question: 'The strongest individual predictor of future suicidal behavior is:',
        type: 'multipleChoice',
        options: [
          { text: 'Current depression diagnosis', isCorrect: false },
          { text: 'Family history of suicide', isCorrect: false },
          { text: 'A previous suicide attempt', isCorrect: true },
          { text: 'Access to lethal means', isCorrect: false },
        ],
        explanation: 'A previous suicide attempt is the strongest individual predictor of future suicidal behavior. While depression, family history, and means access are all important risk factors, history of prior attempt has the most robust empirical support as a predictor.',
      },
      {
        text: 'Research on asking about suicide indicates that:',
        question: 'Research on asking about suicide indicates that:',
        type: 'multipleChoice',
        options: [
          { text: 'It plants the idea and significantly increases risk', isCorrect: false },
          { text: 'It does not increase risk and may actually decrease distress', isCorrect: true },
          { text: 'It should be deferred until a strong therapeutic alliance is established', isCorrect: false },
          { text: 'Only licensed psychologists should ask about suicide directly', isCorrect: false },
        ],
        explanation: 'Research by Dazzi et al. (2014) and others consistently demonstrates that asking directly about suicide does not increase suicide risk and may actually reduce distress. Clinicians should not avoid asking out of concern that they will introduce the idea.',
      },
      {
        text: 'The Columbia-Suicide Severity Rating Scale (C-SSRS) is designed to assess which of the following?',
        question: 'The Columbia-Suicide Severity Rating Scale (C-SSRS) is designed to assess which of the following?',
        type: 'multipleChoice',
        options: [
          { text: 'Trauma history and adverse childhood experiences', isCorrect: false },
          { text: 'Suicidal ideation intensity and attempt lethality across a graduated scale', isCorrect: true },
          { text: 'Depression severity and diagnostic criteria', isCorrect: false },
          { text: 'Family history of suicide and genetic risk', isCorrect: false },
        ],
        explanation: 'The C-SSRS distinguishes between five categories of suicidal ideation (from wish to be dead through active ideation with specific plan and intent) and assesses lethality of any prior attempts. It is the gold-standard assessment instrument for suicide risk.',
      },
      {
        text: 'A client presents with suicidal ideation, a specific plan involving overdose, stated intent to act within 48 hours, and has secured medications for this purpose. This represents which level of risk?',
        question: 'A client presents with suicidal ideation, a specific plan involving overdose, stated intent to act within 48 hours, and has secured medications for this purpose. This represents which level of risk?',
        type: 'multipleChoice',
        options: [
          { text: 'Low risk', isCorrect: false },
          { text: 'Moderate risk', isCorrect: false },
          { text: 'High risk', isCorrect: false },
          { text: 'Imminent risk', isCorrect: true },
        ],
        explanation: 'This presentation — specific method, secured means, clear timeline, and stated intent — meets criteria for imminent risk. The appropriate response is to activate emergency hospitalization procedures and not leave the client unsupervised.',
      },
      {
        text: 'Step 6 of the Stanley-Brown Safety Planning Intervention addresses:',
        question: 'Step 6 of the Stanley-Brown Safety Planning Intervention addresses:',
        type: 'multipleChoice',
        options: [
          { text: 'Identifying warning signs of a suicidal crisis', isCorrect: false },
          { text: 'Internal coping strategies the client can use alone', isCorrect: false },
          { text: 'Professional and crisis contacts', isCorrect: false },
          { text: 'Means restriction — creating distance from lethal methods', isCorrect: true },
        ],
        explanation: 'The six steps of the Stanley-Brown Safety Planning Intervention are: (1) recognizing warning signs, (2) internal coping strategies, (3) social contacts for distraction, (4) supportive contacts, (5) professional and crisis contacts, and (6) means restriction.',
      },
      {
        text: 'Lethal means counseling for firearms is best framed as:',
        question: 'Lethal means counseling for firearms is best framed as:',
        type: 'multipleChoice',
        options: [
          { text: 'A politically necessary conversation about gun control', isCorrect: false },
          { text: 'A mandatory legal requirement with no clinical flexibility', isCorrect: false },
          { text: 'A temporary safety measure during an acute crisis period, approached non-judgmentally', isCorrect: true },
          { text: 'Permanent removal of all firearms from the household', isCorrect: false },
        ],
        explanation: 'Lethal means counseling should be framed non-judgmentally, focusing on temporary storage during the crisis period rather than permanent removal or political framing. Research supports means restriction as an effective suicide prevention strategy.',
      },
      {
        text: 'Caring contacts are characterized by which of the following?',
        question: 'Caring contacts are characterized by which of the following?',
        type: 'multipleChoice',
        options: [
          { text: 'They require the client to check in with their clinician daily', isCorrect: false },
          { text: 'They are brief, personalized, non-demanding communications expressing genuine concern', isCorrect: true },
          { text: 'They replace the safety planning intervention for low-risk clients', isCorrect: false },
          { text: 'They should include detailed clinical assessment questions', isCorrect: false },
        ],
        explanation: 'Caring contacts (brief follow-up communications — letters, texts, calls) are effective when brief, personalized, and non-demanding. They express genuine concern without requiring anything from the client and have demonstrated effectiveness in reducing subsequent suicide attempts.',
      },
      {
        text: 'Which demographic group currently demonstrates the highest suicide rate in the United States?',
        question: 'Which demographic group currently demonstrates the highest suicide rate in the United States?',
        type: 'multipleChoice',
        options: [
          { text: 'Adolescents ages 15–24', isCorrect: false },
          { text: 'Adults ages 25–34', isCorrect: false },
          { text: 'Middle-aged adults (45–64) and older adults (75+), with American Indian/Alaska Native rates highest overall', isCorrect: true },
          { text: 'Adults ages 35–44', isCorrect: false },
        ],
        explanation: 'Suicide rates are highest among middle-aged adults (45–64) and older adults (75+), with White males over 85 having particularly elevated rates. American Indian/Alaska Native populations have the highest rates across age groups.',
      },
      {
        text: 'LGBTQ+ youth are at elevated suicide risk primarily due to which of the following?',
        question: 'LGBTQ+ youth are at elevated suicide risk primarily due to which of the following?',
        type: 'multipleChoice',
        options: [
          { text: 'Genetic factors specific to sexual minority populations', isCorrect: false },
          { text: 'Minority stress, discrimination, family rejection, and victimization', isCorrect: true },
          { text: 'Inherent psychopathology associated with LGBTQ+ identity', isCorrect: false },
          { text: 'Higher rates of substance use disorder in this population', isCorrect: false },
        ],
        explanation: 'LGBTQ+ youth suicide risk is explained by minority stress theory — the cumulative psychological burden of discrimination, victimization, family rejection, and identity concealment. Family acceptance is a particularly powerful protective factor.',
      },
      {
        text: 'Under which circumstances may counselors breach client confidentiality in suicide risk situations?',
        question: 'Under which circumstances may counselors breach client confidentiality in suicide risk situations?',
        type: 'multipleChoice',
        options: [
          { text: 'Any time a client expresses any suicidal ideation, regardless of risk level', isCorrect: false },
          { text: 'When the client signs a release of information form only', isCorrect: false },
          { text: 'When the client presents clear and imminent danger to themselves, disclosing only necessary information', isCorrect: true },
          { text: 'Never — confidentiality is absolute even in life-threatening situations', isCorrect: false },
        ],
        explanation: 'The ACA Code of Ethics (2014) permits confidentiality breaches when clients pose clear and imminent danger to themselves. Disclosure should involve only information necessary for safety, and the rationale should be documented.',
      },
      {
        text: 'Comprehensive documentation of a suicide risk assessment encounter should include all of the following EXCEPT:',
        question: 'Comprehensive documentation of a suicide risk assessment encounter should include all of the following EXCEPT:',
        type: 'multipleChoice',
        options: [
          { text: 'Risk level determination and clinical rationale', isCorrect: false },
          { text: 'Interventions implemented and client response', isCorrect: false },
          { text: 'Verbatim session transcripts', isCorrect: true },
          { text: 'Consultation obtained and safety plan documentation', isCorrect: false },
        ],
        explanation: 'Documentation should include risk assessment findings, risk level and rationale, interventions, client response, safety plan, means counseling discussion, consultation, and follow-up plan. Verbatim transcripts are not a standard documentation requirement.',
      },
      {
        text: 'Research indicates that approximately what percentage of psychiatrists experience client suicide during their careers?',
        question: 'Research indicates that approximately what percentage of psychiatrists experience client suicide during their careers?',
        type: 'multipleChoice',
        options: [
          { text: '10%', isCorrect: false },
          { text: '25%', isCorrect: false },
          { text: '50%', isCorrect: true },
          { text: '75%', isCorrect: false },
        ],
        explanation: 'Research by Chemtob et al. (1988) found that approximately 50% of psychiatrists and 25% of psychologists experience client suicide during their careers. Preparation for this potential outcome is essential for all mental health professionals.',
      },
      {
        text: 'Client suicide can produce which of the following in clinicians?',
        question: 'Client suicide can produce which of the following in clinicians?',
        type: 'multipleChoice',
        options: [
          { text: 'Temporary sadness that resolves within days without intervention', isCorrect: false },
          { text: 'Grief, guilt, fear of litigation, professional isolation, and PTSD-like symptoms', isCorrect: true },
          { text: 'Increased therapeutic effectiveness due to heightened vigilance', isCorrect: false },
          { text: 'Legal immunity from malpractice claims if proper documentation was maintained', isCorrect: false },
        ],
        explanation: 'Client suicide is a significant adverse event for clinicians. Documented responses include grief, guilt, self-doubt, anger, fear of litigation, hypervigilance, professional isolation, and PTSD-like symptoms. Institutional support and personal therapy are often indicated.',
      },
    ],
  },
  references: [
    { author: 'American Association of Suicidology.', year: 2021, title: 'Warning signs of suicide', source: 'https://suicidology.org/resources/warning-signs/', formatted: 'American Association of Suicidology. (2021). <em>Warning signs of suicide</em>. https://suicidology.org/resources/warning-signs/' },
    { author: 'Barber, C. W., & Miller, M. J.', year: 2014, title: "Reducing a suicidal person's access to lethal means of suicide: A research agenda", source: 'American Journal of Preventive Medicine, 47(3), S264–S272.', formatted: "Barber, C. W., & Miller, M. J. (2014). Reducing a suicidal person's access to lethal means of suicide: A research agenda. <em>American Journal of Preventive Medicine, 47</em>(3), S264–S272. https://doi.org/10.1016/j.amepre.2014.05.028" },
    { author: 'Centers for Disease Control and Prevention.', year: 2023, title: 'Suicide data and statistics', source: 'https://www.cdc.gov/suicide/suicide-data-statistics.html', formatted: 'Centers for Disease Control and Prevention. (2023). <em>Suicide data and statistics</em>. https://www.cdc.gov/suicide/suicide-data-statistics.html' },
    { author: 'Chemtob, C. M., Hamada, R. S., Bauer, G., Torigoe, R. Y., & Kinney, B.', year: 1988, title: 'Patient suicide: Frequency and impact on psychiatrists', source: 'American Journal of Psychiatry, 145(2), 224–228.', formatted: 'Chemtob, C. M., Hamada, R. S., Bauer, G., Torigoe, R. Y., & Kinney, B. (1988). Patient suicide: Frequency and impact on psychiatrists. <em>American Journal of Psychiatry, 145</em>(2), 224–228. https://doi.org/10.1176/ajp.145.2.224' },
    { author: 'Dazzi, T., Gribble, R., Wessely, S., & Fear, N. T.', year: 2014, title: 'Does asking about suicide and related behaviours induce suicidal ideation? What is the evidence?', source: 'Psychological Medicine, 44(16), 3361–3363.', formatted: 'Dazzi, T., Gribble, R., Wessely, S., & Fear, N. T. (2014). Does asking about suicide and related behaviours induce suicidal ideation? What is the evidence? <em>Psychological Medicine, 44</em>(16), 3361–3363. https://doi.org/10.1017/S0033291714001299' },
    { author: 'Department of Veterans Affairs.', year: 2023, title: '2023 National Veteran Suicide Prevention Annual Report', source: 'Office of Mental Health and Suicide Prevention.', formatted: 'Department of Veterans Affairs. (2023). <em>2023 National Veteran Suicide Prevention Annual Report</em>. Office of Mental Health and Suicide Prevention.' },
    { author: 'Hendin, H., Lipschitz, A., Maltsberger, J. T., Haas, A. P., & Wynecoop, S.', year: 2006, title: "Therapists' reactions to patients' suicides", source: 'American Journal of Psychiatry, 163(12), 2022–2027.', formatted: "Hendin, H., Lipschitz, A., Maltsberger, J. T., Haas, A. P., & Wynecoop, S. (2006). Therapists' reactions to patients' suicides. <em>American Journal of Psychiatry, 163</em>(12), 2022–2027. https://doi.org/10.1176/ajp.2006.163.12.2022" },
    { author: 'Joiner, T. E.', year: 2005, title: 'Why people die by suicide', source: 'Harvard University Press.', formatted: 'Joiner, T. E. (2005). <em>Why people die by suicide</em>. Harvard University Press.' },
    { author: 'Luxton, D. D., June, J. D., & Comtois, K. A.', year: 2013, title: 'Can postdischarge follow-up contacts prevent suicide and suicidal behavior? A review of the evidence', source: 'Crisis, 34(1), 32–41.', formatted: 'Luxton, D. D., June, J. D., & Comtois, K. A. (2013). Can postdischarge follow-up contacts prevent suicide and suicidal behavior? A review of the evidence. <em>Crisis, 34</em>(1), 32–41. https://doi.org/10.1027/0227-5910/a000158' },
    { author: 'Owens, D., Horrocks, J., & House, A.', year: 2002, title: 'Fatal and non-fatal repetition of self-harm: Systematic review', source: 'British Journal of Psychiatry, 181(3), 193–199.', formatted: 'Owens, D., Horrocks, J., & House, A. (2002). Fatal and non-fatal repetition of self-harm: Systematic review. <em>British Journal of Psychiatry, 181</em>(3), 193–199. https://doi.org/10.1192/bjp.181.3.193' },
    { author: 'Posner, K., Brown, G. K., Stanley, B., Brent, D. A., Yershova, K. V., Oquendo, M. A., Currier, G. W., Melvin, G. A., Greenhill, L., Shen, S., & Mann, J. J.', year: 2011, title: 'The Columbia–Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults', source: 'American Journal of Psychiatry, 168(12), 1266–1277.', formatted: 'Posner, K., Brown, G. K., Stanley, B., Brent, D. A., Yershova, K. V., Oquendo, M. A., Currier, G. W., Melvin, G. A., Greenhill, L., Shen, S., & Mann, J. J. (2011). The Columbia–Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults. <em>American Journal of Psychiatry, 168</em>(12), 1266–1277. https://doi.org/10.1176/appi.ajp.2011.10111704' },
    { author: 'Rudd, M. D., Mandrusiak, M., & Joiner, T. E., Jr.', year: 2006, title: 'The case against no-suicide contracts: The commitment to treatment statement as a practice alternative', source: 'Journal of Clinical Psychology, 62(2), 243–251.', formatted: 'Rudd, M. D., Mandrusiak, M., & Joiner, T. E., Jr. (2006). The case against no-suicide contracts: The commitment to treatment statement as a practice alternative. <em>Journal of Clinical Psychology, 62</em>(2), 243–251. https://doi.org/10.1002/jclp.20227' },
    { author: 'Stanley, B., & Brown, G. K.', year: 2012, title: 'Safety planning intervention: A brief intervention to mitigate suicide risk', source: 'Cognitive and Behavioral Practice, 19(2), 256–264.', formatted: 'Stanley, B., & Brown, G. K. (2012). Safety planning intervention: A brief intervention to mitigate suicide risk. <em>Cognitive and Behavioral Practice, 19</em>(2), 256–264. https://doi.org/10.1016/j.cbpra.2011.01.001' },
    { author: 'Tarasoff v. Regents of the University of California,', year: 1976, title: '17 Cal. 3d 425, 551 P.2d 334', source: '', formatted: '<em>Tarasoff v. Regents of the University of California</em>, 17 Cal. 3d 425, 551 P.2d 334 (1976).' },
    { author: 'The Trevor Project.', year: 2023, title: '2023 U.S. National Survey on the Mental Health of LGBTQ Young People', source: 'https://www.thetrevorproject.org/survey-2023/', formatted: 'The Trevor Project. (2023). <em>2023 U.S. National Survey on the Mental Health of LGBTQ Young People</em>. https://www.thetrevorproject.org/survey-2023/' },
  ],
  resources: [
    { title: '988 Suicide & Crisis Lifeline', type: 'website', url: 'https://988lifeline.org', description: 'National crisis line providing 24/7 phone and chat support. Counselors should include the number in all safety plans.' },
    { title: 'Columbia Suicide Severity Rating Scale (C-SSRS)', type: 'document', url: 'https://cssrs.columbia.edu', description: 'Gold-standard suicide risk assessment instrument. Free training and validated versions for clinical, research, and community settings.' },
    { title: 'Safety Planning Intervention — Stanley & Brown', type: 'website', url: 'https://suicidesafetyplan.com', description: 'Official site for the Stanley-Brown Safety Planning Intervention including the app, training resources, and supporting research.' },
    { title: 'Suicide Prevention Resource Center', type: 'website', url: 'https://sprc.org', description: 'Comprehensive clinical training, population-specific resources, and evidence-based practice guides including Means Matter for lethal means counseling.' },
    { title: 'American Association of Suicidology — Clinician Resources', type: 'website', url: 'https://suicidology.org', description: 'Professional organization resources including IS PATH WARM warning signs, CE, and support for clinicians following client suicide.' },
    { title: 'The Trevor Project — Crisis Resources', type: 'website', url: 'https://www.thetrevorproject.org', description: 'LGBTQ+ specific crisis support and research. Essential resource for safety plans with LGBTQ+ clients.' },
    { title: 'VA/DOD Suicide Risk Management Consultation Program', type: 'website', url: 'https://www.mentalhealth.va.gov/suicide_prevention/', description: 'Evidence-based resources for clinicians working with veterans and military personnel.' },
  ],
  sections: [
    { order: 1, title: 'Course Introduction: Why Every Counselor Must Be Prepared', estimatedTime: 15, contentBlocks: [] },
    { order: 2, title: 'Epidemiology: The Public Health Landscape of Suicide', estimatedTime: 30, contentBlocks: [] },
    { order: 3, title: 'Risk Factors, Protective Factors, and Theoretical Frameworks', estimatedTime: 45, contentBlocks: [] },
    { order: 4, title: 'Comprehensive Suicide Risk Assessment', estimatedTime: 60, contentBlocks: [] },
    { order: 5, title: 'Intervention Strategies: Safety Planning, Means Counseling, and Caring Contacts', estimatedTime: 60, contentBlocks: [] },
    { order: 6, title: 'Special Populations: Adolescents, Older Adults, Veterans, and LGBTQ+ Clients', estimatedTime: 45, contentBlocks: [] },
    { order: 7, title: 'Ethical and Legal Considerations in Suicide Risk Management', estimatedTime: 45, contentBlocks: [] },
    { order: 8, title: 'Clinician Self-Care, Postvention, and Sustainable Practice', estimatedTime: 30, contentBlocks: [] },
  ],
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  // Check for existing
  const exists = await col.findOne({ courseCode: 'CR-106' });
  if (exists) {
    console.log(`CR-106 already exists: ${exists._id} — aborting.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Course: ${course.title}`);
  console.log(`Sections: ${course.sections.length}`);
  console.log(`Assessment Qs: ${course.assessment.questions.length}`);
  console.log(`References: ${course.references.length}`);
  console.log(`Resources: ${course.resources.length}`);

  if (!APPLY) {
    console.log('\n[DRY RUN] Re-run with --apply to insert.');
    await mongoose.disconnect();
    return;
  }

  const result = await col.insertOne(course);
  console.log(`\n✅ Inserted CR-106: ${result.insertedId}`);
  console.log('NOTE: sections are empty shells — section content must be pushed separately via MCP or update scripts.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
