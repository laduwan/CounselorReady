// =============================================================================
// seed-references.js — Populates real APA references for 10 courses
// Run: node server/src/scripts/seed-references.js
// Or from server dir: node src/scripts/seed-references.js
// =============================================================================
import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seed-references.js
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const courseReferences = {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Good Will Hunting — Trauma & Attachment (16 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'good-will-hunting-trauma-attachment': [
    { formatted: "Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of attachment: A psychological study of the Strange Situation. Erlbaum." },
    { formatted: "Bowlby, J. (1969). Attachment and loss: Vol. 1. Attachment. Basic Books." },
    { formatted: "Bowlby, J. (1988). A secure base: Parent-child attachment and healthy human development. Basic Books." },
    { formatted: "Briere, J., & Scott, C. (2015). Principles of trauma therapy: A guide to symptoms, evaluation, and treatment (2nd ed.). Sage Publications." },
    { formatted: "Cloitre, M., Stovall-McClough, K. C., Nooner, K., Zorbas, P., Cherry, S., Jackson, C. L., Gan, W., & Petkova, E. (2010). Treatment for PTSD related to childhood abuse: A randomized controlled trial. American Journal of Psychiatry, 167(8), 915–924." },
    { formatted: "Courtois, C. A., & Ford, J. D. (Eds.). (2009). Treating complex traumatic stress disorders: An evidence-based guide. Guilford Press." },
    { formatted: "Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P., & Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245–258." },
    { formatted: "Herman, J. L. (2015). Trauma and recovery: The aftermath of violence—from domestic abuse to political terror (Rev. ed.). Basic Books." },
    { formatted: "Main, M., & Hesse, E. (1990). Parents' unresolved traumatic experiences are related to infant disorganized attachment status. In M. T. Greenberg, D. Cicchetti, & E. M. Cummings (Eds.), Attachment in the preschool years (pp. 161–182). University of Chicago Press." },
    { formatted: "Mikulincer, M., & Shaver, P. R. (2007). Attachment in adulthood: Structure, dynamics, and change. Guilford Press." },
    { formatted: "Schore, A. N. (2001). The effects of early relational trauma on right brain development, affect regulation, and infant mental health. Infant Mental Health Journal, 22(1-2), 201–269." },
    { formatted: "Siegel, D. J. (2012). The developing mind: How relationships and the brain interact to shape who we are (2nd ed.). Guilford Press." },
    { formatted: "van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking." },
    { formatted: "van der Kolk, B. A. (2005). Developmental trauma disorder: Toward a rational diagnosis for children with complex trauma histories. Psychiatric Annals, 35(5), 401–408." },
    { formatted: "Wallin, D. J. (2007). Attachment in psychotherapy. Guilford Press." },
    { formatted: "Yehuda, R., & LeDoux, J. (2007). Response variation following trauma: A translational neuroscience approach to understanding PTSD. Neuron, 56(1), 19–32." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Telemental Health — Georgia Compliance (12 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo': [
    { formatted: "American Counseling Association. (2014). ACA code of ethics. Author." },
    { formatted: "American Psychological Association. (2013). Guidelines for the practice of telepsychology. American Psychologist, 68(9), 791–800." },
    { formatted: "Appleton, R., Williams, J., Vera San Juan, N., Needle, J. J., Schlief, M., Jordan, H., Sheridan Rains, L., Goulding, L., Badhan, M., Roxburgh, E., Barnett, P., & Johnson, S. (2021). Implementation, adoption, and perceptions of telemental health during the COVID-19 pandemic: Systematic review. Journal of Medical Internet Research, 23(12), e31746." },
    { formatted: "Georgia Composite Board of Professional Counselors, Social Workers, and Marriage and Family Therapists. (2015). Rule 135-11: Telemental health. State of Georgia." },
    { formatted: "Hilty, D. M., Ferrer, D. C., Parish, M. B., Johnston, B., Callahan, E. J., & Yellowlees, P. M. (2013). The effectiveness of telemental health: A 2013 review. Telemedicine and e-Health, 19(6), 444–454." },
    { formatted: "Maheu, M. M., Drude, K. P., & Wright, S. D. (Eds.). (2017). Career paths in telemental health. Springer." },
    { formatted: "Maheu, M. M., Pulier, M. L., McMenamin, J. P., & Posen, L. (2012). Future of telepsychology, telehealth, and various technologies in psychological research and practice. Professional Psychology: Research and Practice, 43(6), 613–621." },
    { formatted: "National Board for Certified Counselors. (2016). NBCC policy regarding the provision of distance professional services. Author." },
    { formatted: "Scott, A. M., Bakhit, M., Greenwood, H., Cardona, M., Clark, J., Krzyzaniak, N., Peiris, R., & Glasziou, P. (2022). Real-time telehealth versus face-to-face management for patients with PTSD in primary care: A systematic review and meta-analysis. The Journal of Clinical Psychiatry, 83(4), 21r14143." },
    { formatted: "Shore, J. H., Yellowlees, P., Caudill, R., Johnston, B., Turvey, C., Mishkind, M., Krupinski, E., Myers, K., Shore, P., Kaftarian, E., & Hilty, D. (2018). Best practices in videoconferencing-based telemental health. Telemedicine and e-Health, 24(11), 827–832." },
    { formatted: "U.S. Department of Health and Human Services. (2023). Telehealth policy changes after the COVID-19 public health emergency. Author." },
    { formatted: "Whaibeh, E., Mahmoud, H., & Naal, H. (2020). Telemental health in the context of a pandemic: The COVID-19 experience. Current Treatment Options in Psychiatry, 7, 198–202." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Therapeutic Rapport (8 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'therapeutic-rapport': [
    { formatted: "Bordin, E. S. (1979). The generalizability of the psychoanalytic concept of the working alliance. Psychotherapy: Theory, Research & Practice, 16(3), 252–260." },
    { formatted: "Flückiger, C., Del Re, A. C., Wampold, B. E., & Horvath, A. O. (2018). The alliance in adult psychotherapy: A meta-analytic synthesis. Psychotherapy, 55(4), 316–340." },
    { formatted: "Horvath, A. O., & Luborsky, L. (1993). The role of the therapeutic alliance in psychotherapy. Journal of Consulting and Clinical Psychology, 61(4), 561–573." },
    { formatted: "Lambert, M. J., & Barley, D. E. (2001). Research summary on the therapeutic relationship and psychotherapy outcome. Psychotherapy: Theory, Research, Practice, Training, 38(4), 357–361." },
    { formatted: "Norcross, J. C., & Lambert, M. J. (2018). Psychotherapy relationships that work III. Psychotherapy, 55(4), 303–315." },
    { formatted: "Norcross, J. C., & Wampold, B. E. (2011). Evidence-based therapy relationships: Research conclusions and clinical practices. Psychotherapy, 48(1), 98–102." },
    { formatted: "Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2), 95–103." },
    { formatted: "Wampold, B. E. (2015). How important are the common factors in psychotherapy? An update. World Psychiatry, 14(3), 270–277." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Lost in Translation — Cultural Divides (20 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'lost-in-translation-bridging-cultural-divides': [
    { formatted: "American Counseling Association. (2014). ACA code of ethics. Author." },
    { formatted: "American Psychological Association. (2017). Multicultural guidelines: An ecological approach to context, identity, and intersectionality. Author." },
    { formatted: "Arredondo, P., Toporek, R., Brown, S. P., Jones, J., Locke, D. C., Sanchez, J., & Stadler, H. (1996). Operationalization of the multicultural counseling competencies. Journal of Multicultural Counseling and Development, 24(1), 42–78." },
    { formatted: "Comas-Díaz, L., Hall, G. N., & Neville, H. A. (2019). Racial trauma: Theory, research, and healing. American Psychologist, 74(1), 1–5." },
    { formatted: "Hays, P. A. (2016). Addressing cultural complexities in practice: Assessment, diagnosis, and therapy (3rd ed.). American Psychological Association." },
    { formatted: "Helms, J. E. (1995). An update of Helms' White and people of color racial identity models. In J. G. Ponterotto, J. M. Casas, L. A. Suzuki, & C. M. Alexander (Eds.), Handbook of multicultural counseling (pp. 181–198). Sage Publications." },
    { formatted: "Hook, J. N., Davis, D. E., Owen, J., Worthington, E. L., & Utsey, S. O. (2013). Cultural humility: Measuring openness to culturally diverse clients. Journal of Counseling Psychology, 60(3), 353–366." },
    { formatted: "Hwang, W.-C. (2006). The psychotherapy adaptation and modification framework: Application to Asian Americans. American Psychologist, 61(7), 702–715." },
    { formatted: "Ibaraki, A. Y., & Hall, G. C. N. (2014). The components of cultural match in psychotherapy. Journal of Social and Clinical Psychology, 33(10), 936–953." },
    { formatted: "Kirmayer, L. J. (2012). Rethinking cultural competence. Transcultural Psychiatry, 49(2), 149–164." },
    { formatted: "Meyer, O. L., & Zane, N. (2013). The influence of race and ethnicity in clients' experiences of mental health treatment. Journal of Community Psychology, 41(7), 884–901." },
    { formatted: "Owen, J., Tao, K. W., Imel, Z. E., Wampold, B. E., & Rodolfa, E. (2014). Addressing racial and ethnic microaggressions in therapy. Professional Psychology: Research and Practice, 45(4), 283–290." },
    { formatted: "Ratts, M. J., Singh, A. A., Nassar-McMillan, S., Butler, S. K., & McCullough, J. R. (2016). Multicultural and social justice counseling competencies: Guidelines for the counseling profession. Journal of Multicultural Counseling and Development, 44(1), 28–48." },
    { formatted: "Smith, T. B., & Trimble, J. E. (2016). Foundations of multicultural psychology: Research to inform effective practice. American Psychological Association." },
    { formatted: "Sue, D. W., Capodilupo, C. M., Torino, G. C., Bucceri, J. M., Holder, A. M. B., Nadal, K. L., & Esquilin, M. (2007). Racial microaggressions in everyday life: Implications for clinical practice. American Psychologist, 62(4), 271–286." },
    { formatted: "Sue, D. W., & Sue, D. (2019). Counseling the culturally diverse: Theory and practice (8th ed.). Wiley." },
    { formatted: "Sue, S., Zane, N., Nagayama Hall, G. C., & Berger, L. K. (2009). The case for cultural competency in psychotherapeutic interventions. Annual Review of Psychology, 60, 525–548." },
    { formatted: "Tervalon, M., & Murray-García, J. (1998). Cultural humility versus cultural competence: A critical distinction in defining physician training outcomes in multicultural education. Journal of Health Care for the Poor and Underserved, 9(2), 117–125." },
    { formatted: "Whaley, A. L., & Davis, K. E. (2007). Cultural competence and evidence-based practice in mental health services: A complementary perspective. American Psychologist, 62(6), 563–574." },
    { formatted: "Worthington, R. L., Soth-McNett, A. M., & Moreno, M. V. (2007). Multicultural counseling competencies research: A 20-year content analysis. Journal of Counseling Psychology, 54(4), 351–361." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Pursuit of Happyness — Anxiety & Depression (16 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'the-pursuit-of-happyness-treating-anxiety-and-depression': [
    { formatted: "American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). Author." },
    { formatted: "Barlow, D. H. (2002). Anxiety and its disorders: The nature and treatment of anxiety and panic (2nd ed.). Guilford Press." },
    { formatted: "Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G. (1979). Cognitive therapy of depression. Guilford Press." },
    { formatted: "Beck, J. S. (2020). Cognitive behavior therapy: Basics and beyond (3rd ed.). Guilford Press." },
    { formatted: "Butler, A. C., Chapman, J. E., Forman, E. M., & Beck, A. T. (2006). The empirical status of cognitive-behavioral therapy: A review of meta-analyses. Clinical Psychology Review, 26(1), 17–31." },
    { formatted: "Cuijpers, P., Berking, M., Andersson, G., Quigley, L., Kleiboer, A., & Dobson, K. S. (2013). A meta-analysis of cognitive-behavioural therapy for adult depression, alone and in comparison with other treatments. The Canadian Journal of Psychiatry, 58(7), 376–385." },
    { formatted: "Greenberg, L. S. (2015). Emotion-focused therapy: Coaching clients to work through their feelings (2nd ed.). American Psychological Association." },
    { formatted: "Hofmann, S. G., Asnaani, A., Vonk, I. J., Sawyer, A. T., & Fang, A. (2012). The efficacy of cognitive behavioral therapy: A review of meta-analyses. Cognitive Therapy and Research, 36(5), 427–440." },
    { formatted: "Kessler, R. C., Berglund, P., Demler, O., Jin, R., Merikangas, K. R., & Walters, E. E. (2005). Lifetime prevalence and age-of-onset distributions of DSM-IV disorders in the National Comorbidity Survey Replication. Archives of General Psychiatry, 62(6), 593–602." },
    { formatted: "Lewinsohn, P. M., & Graf, M. (1973). Pleasant activities and depression. Journal of Consulting and Clinical Psychology, 41(2), 261–268." },
    { formatted: "Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press." },
    { formatted: "Martell, C. R., Dimidjian, S., & Herman-Dunn, R. (2010). Behavioral activation for depression: A clinician's guide. Guilford Press." },
    { formatted: "National Institute of Mental Health. (2023). Major depression. U.S. Department of Health and Human Services. https://www.nimh.nih.gov/health/statistics/major-depression" },
    { formatted: "Seligman, M. E. P. (2006). Learned optimism: How to change your mind and your life (Vintage Books ed.). Vintage Books." },
    { formatted: "World Health Organization. (2023). Depressive disorder (depression): Key facts. Author." },
    { formatted: "Yalom, I. D., & Leszcz, M. (2020). The theory and practice of group psychotherapy (6th ed.). Basic Books." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 6. It Takes a Village — Collaborative Care (14 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'it-takes-a-village-collaborative-care': [
    { formatted: "Archer, J., Bower, P., Gilbody, S., Lovell, K., Richards, D., Gask, L., Dickens, C., & Coventry, P. (2012). Collaborative care for depression and anxiety problems. Cochrane Database of Systematic Reviews, (10), CD006525." },
    { formatted: "Collins, C., Hewson, D. L., Munger, R., & Wade, T. (2010). Evolving models of behavioral health integration in primary care. Milbank Memorial Fund." },
    { formatted: "Doherty, W. J., McDaniel, S. H., & Baird, M. A. (1996). Five levels of primary care/behavioral healthcare collaboration. Behavioral Healthcare Tomorrow, 5(5), 25–27." },
    { formatted: "Heath, B., Wise Romero, P., & Reynolds, K. (2013). A standard framework for levels of integrated healthcare. SAMHSA-HRSA Center for Integrated Health Solutions." },
    { formatted: "Katon, W. J., Lin, E. H. B., Von Korff, M., Ciechanowski, P., Ludman, E. J., Young, B., Peterson, D., Rutter, C. M., McGregor, M., & McCulloch, D. (2010). Collaborative care for patients with depression and chronic illnesses. New England Journal of Medicine, 363(27), 2611–2620." },
    { formatted: "Kolko, D. J., Campo, J., Kilbourne, A. M., Hart, J., Sakolsky, D., & Wisniewski, S. (2014). Collaborative care outcomes for pediatric behavioral health problems: A cluster randomized trial. Pediatrics, 133(4), e981–e992." },
    { formatted: "Miller, B. F., Ross, K. M., Davis, M. M., Melek, S. P., Kathol, R., & Gordon, P. (2017). Payment reform in the patient-centered medical home: Enabling and sustaining integrated behavioral health care. American Psychologist, 72(1), 55–68." },
    { formatted: "Peek, C. J., & the National Integration Academy Council. (2013). Lexicon for behavioral health and primary care integration. Agency for Healthcare Research and Quality." },
    { formatted: "Reiter, J. T., Dobmeyer, A. C., & Hunter, C. L. (2018). The primary care behavioral health (PCBH) model: An overview and operational definition. Journal of Clinical Psychology in Medical Settings, 25(2), 109–126." },
    { formatted: "Robinson, P. J., & Reiter, J. T. (2016). Behavioral consultation and primary care: A guide to integrating services (2nd ed.). Springer." },
    { formatted: "Substance Abuse and Mental Health Services Administration. (2020). National guidelines for behavioral health crisis care best practice toolkit. Author." },
    { formatted: "Unützer, J., Katon, W., Callahan, C. M., Williams, J. W., Hunkeler, E., Harpole, L., Hoffing, M., Della Penna, R. D., Noel, P. H., Lin, E. H. B., Arean, P. A., Hegel, M. T., Tang, L., Belin, T. R., Oishi, S., & Langston, C. (2002). Collaborative care management of late-life depression in the primary care setting: A randomized controlled trial. JAMA, 288(22), 2836–2845." },
    { formatted: "Woltmann, E., Grogan-Kaylor, A., Perron, B., Georges, H., Kilbourne, A. M., & Bauer, M. S. (2012). Comparative effectiveness of collaborative chronic care models for mental health conditions across primary, specialty, and behavioral health care settings: Systematic review and meta-analysis. American Journal of Psychiatry, 169(8), 790–804." },
    { formatted: "World Health Organization. (2008). Integrating mental health into primary care: A global perspective. Author." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Walking on Eggshells — High-Conflict Clients (15 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'walking-on-eggshells-high-conflict-clients': [
    { formatted: "American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). Author." },
    { formatted: "Bateman, A., & Fonagy, P. (2016). Mentalization-based treatment for personality disorders: A practical guide. Oxford University Press." },
    { formatted: "Beck, A. T., Davis, D. D., & Freeman, A. (Eds.). (2015). Cognitive therapy of personality disorders (3rd ed.). Guilford Press." },
    { formatted: "Clarkin, J. F., Yeomans, F. E., & Kernberg, O. F. (2006). Psychotherapy for borderline personality: Focusing on object relations. American Psychiatric Publishing." },
    { formatted: "Gabbard, G. O. (2014). Psychodynamic psychiatry in clinical practice (5th ed.). American Psychiatric Publishing." },
    { formatted: "Gunderson, J. G., Herpertz, S. C., Skodol, A. E., Torgersen, S., & Zanarini, M. C. (2018). Borderline personality disorder. Nature Reviews Disease Primers, 4, 18029." },
    { formatted: "Kernberg, O. F. (1984). Severe personality disorders: Psychotherapeutic strategies. Yale University Press." },
    { formatted: "Kreisman, J. J., & Straus, H. (2010). I hate you—don't leave me: Understanding the borderline personality (Rev. ed.). TarcherPerigee." },
    { formatted: "Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press." },
    { formatted: "Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press." },
    { formatted: "Mason, P. T., & Kreger, R. (2020). Stop walking on eggshells: Taking your life back when someone you care about has borderline personality disorder (3rd ed.). New Harbinger Publications." },
    { formatted: "Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press." },
    { formatted: "Paris, J. (2020). Treatment of borderline personality disorder: A guide to evidence-based practice (2nd ed.). Guilford Press." },
    { formatted: "Safran, J. D., & Muran, J. C. (2000). Negotiating the therapeutic alliance: A relational treatment guide. Guilford Press." },
    { formatted: "Young, J. E., Klosko, J. S., & Weishaar, M. E. (2003). Schema therapy: A practitioner's guide. Guilford Press." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 8. When It Rains It Pours — Multiple Stressors & Comorbidities (21 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities': [
    { formatted: "American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). Author." },
    { formatted: "Barlow, D. H., Farchione, T. J., Fairholme, C. P., Ellard, K. K., Boisseau, C. L., Allen, L. B., & Ehrenreich-May, J. (2011). Unified protocol for transdiagnostic treatment of emotional disorders: Therapist guide. Oxford University Press." },
    { formatted: "Brown, T. A., & Barlow, D. H. (2009). A proposal for a dimensional classification system based on the shared features of the DSM-IV anxiety and mood disorders. Psychological Assessment, 21(3), 256–271." },
    { formatted: "Caspi, A., Houts, R. M., Belsky, D. W., Goldman-Mellor, S. J., Harrington, H., Israel, S., Meier, M. H., Ramrakha, S., Shalev, I., Poulton, R., & Moffitt, T. E. (2014). The p factor: One general psychopathology factor in the structure of psychiatric disorders? Clinical Psychological Science, 2(2), 119–137." },
    { formatted: "Clark, L. A., Cuthbert, B., Lewis-Fernández, R., Narrow, W. E., & Reed, G. M. (2017). Three approaches to understanding and classifying mental disorder: ICD-11, DSM-5, and the National Institute of Mental Health's Research Domain Criteria (RDoC). Psychological Science in the Public Interest, 18(2), 72–145." },
    { formatted: "Cuijpers, P., van Straten, A., & Warmerdam, L. (2007). Behavioral activation treatments of depression: A meta-analysis. Clinical Psychology Review, 27(3), 318–326." },
    { formatted: "Goldberg, D. (2010). The classification of mental disorder: A simpler system for DSM-V and ICD-11. Advances in Psychiatric Treatment, 16(1), 14–19." },
    { formatted: "Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2012). Acceptance and commitment therapy: The process and practice of mindful change (2nd ed.). Guilford Press." },
    { formatted: "Hobfoll, S. E. (1989). Conservation of resources: A new attempt at conceptualizing stress. American Psychologist, 44(3), 513–524." },
    { formatted: "Hobfoll, S. E. (2001). The influence of culture, community, and the nested-self in the stress process: Advancing conservation of resources theory. Applied Psychology, 50(3), 337–421." },
    { formatted: "Kessler, R. C., Chiu, W. T., Demler, O., & Walters, E. E. (2005). Prevalence, severity, and comorbidity of 12-month DSM-IV disorders in the National Comorbidity Survey Replication. Archives of General Psychiatry, 62(6), 617–627." },
    { formatted: "Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer." },
    { formatted: "Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press." },
    { formatted: "Merikangas, K. R., Jin, R., He, J.-P., Kessler, R. C., Lee, S., Sampson, N. A., Viana, M. C., Andrade, L. H., Hu, C., Karam, E. G., Ladea, M., Medina-Mora, M. E., Ono, Y., Posada-Villa, J., Sagar, R., Wells, J. E., & Zarkov, Z. (2011). Prevalence and correlates of bipolar spectrum disorder in the World Mental Health Survey Initiative. Archives of General Psychiatry, 68(3), 241–251." },
    { formatted: "Nolen-Hoeksema, S., & Watkins, E. R. (2011). A heuristic for developing transdiagnostic models of psychopathology: Explaining multifinality and divergent trajectories. Perspectives on Psychological Science, 6(6), 589–609." },
    { formatted: "Plana-Ripoll, O., Pedersen, C. B., Holtz, Y., Benros, M. E., Dalsgaard, S., De Jonge, P., Fan, C. C., Degenhardt, L., Ganna, A., Greve, A. N., Gunn, J., Iburg, K. M., Kessing, L. V., Lee, B. K., Lim, C. C. W., Mors, O., Nordentoft, M., Prior, A., Roest, A. M., … McGrath, J. J. (2019). Exploring comorbidity within mental disorders among a Danish national population. JAMA Psychiatry, 76(3), 259–270." },
    { formatted: "Prochaska, J. O., & DiClemente, C. C. (1983). Stages and processes of self-change of smoking: Toward an integrative model of change. Journal of Consulting and Clinical Psychology, 51(3), 390–395." },
    { formatted: "Seligman, M. E. P. (2011). Flourish: A visionary new understanding of happiness and well-being. Free Press." },
    { formatted: "Smith, J. P., & Book, S. W. (2010). Comorbidity of generalized anxiety disorder and alcohol use disorders among individuals seeking outpatient substance abuse treatment. Addictive Behaviors, 35(1), 42–45." },
    { formatted: "Substance Abuse and Mental Health Services Administration. (2020). Key substance use and mental health indicators in the United States: Results from the 2019 National Survey on Drug Use and Health (HHS Publication No. PEP20-07-01-001). Author." },
    { formatted: "Wampold, B. E., & Imel, Z. E. (2015). The great psychotherapy debate: The evidence for what makes psychotherapy work (2nd ed.). Routledge." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Suicide Risk Assessment Interactive (10 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'suicide-risk-assessment-interactive': [
    { formatted: "American Psychiatric Association. (2003). Practice guideline for the assessment and treatment of patients with suicidal behaviors. American Journal of Psychiatry, 160(Suppl. 11), 1–60." },
    { formatted: "Jobes, D. A. (2016). Managing suicidal risk: A collaborative approach (2nd ed.). Guilford Press." },
    { formatted: "Joiner, T. E. (2005). Why people die by suicide. Harvard University Press." },
    { formatted: "Klonsky, E. D., & May, A. M. (2015). The three-step theory (3ST): A new theory of suicide rooted in the ideation-to-action framework. International Journal of Cognitive Therapy, 8(2), 114–129." },
    { formatted: "Posner, K., Brown, G. K., Stanley, B., Brent, D. A., Yershova, K. V., Oquendo, M. A., Currier, G. W., Melvin, G. A., Greenhill, L., Shen, S., & Mann, J. J. (2011). The Columbia-Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults. American Journal of Psychiatry, 168(12), 1266–1277." },
    { formatted: "Rudd, M. D., Berman, A. L., Joiner, T. E., Nock, M. K., Silverman, M. M., Mandrusiak, M., Van Orden, K., & Witte, T. (2006). Warning signs for suicide: Theory, research, and clinical applications. Suicide and Life-Threatening Behavior, 36(3), 255–262." },
    { formatted: "Stanley, B., & Brown, G. K. (2012). Safety planning intervention: A brief intervention to mitigate suicide risk. Cognitive and Behavioral Practice, 19(2), 256–264." },
    { formatted: "Stanley, B., Brown, G. K., Brenner, L. A., Galfalvy, H. C., Currier, G. W., Knox, K. L., Chaudhury, S. R., Bush, A. L., & Green, K. L. (2018). Comparison of the safety planning intervention with follow-up vs usual care of suicidal patients treated in the emergency department. JAMA Psychiatry, 75(9), 894–900." },
    { formatted: "Van Orden, K. A., Witte, T. K., Cukrowicz, K. C., Braithwaite, S. R., Selby, E. A., & Joiner, T. E. (2010). The interpersonal theory of suicide. Psychological Review, 117(2), 575–600." },
    { formatted: "Wenzel, A., Brown, G. K., & Beck, A. T. (2009). Cognitive therapy for suicidal patients: Scientific and clinical applications. American Psychological Association." }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 10. Beautiful Mind — Schizophrenia & Severe Mental Illness (7 refs)
  // ─────────────────────────────────────────────────────────────────────────
  'beautiful-mind': [
    { formatted: "American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). Author." },
    { formatted: "Correll, C. U., Rubio, J. M., & Kane, J. M. (2018). What is the risk-benefit ratio of long-term antipsychotic treatment in people with schizophrenia? World Psychiatry, 17(2), 149–160." },
    { formatted: "Dixon, L. B., Dickerson, F., Bellack, A. S., Bennett, M., Dickinson, D., Goldberg, R. W., Lehman, A., Tenhula, W. N., Calmes, C., Pasillas, R. M., Peer, J., & Kreyenbuhl, J. (2010). The 2009 Schizophrenia PORT psychosocial treatment recommendations and summary statements. Schizophrenia Bulletin, 36(1), 48–70." },
    { formatted: "Insel, T. R. (2010). Rethinking schizophrenia. Nature, 468(7321), 187–193." },
    { formatted: "Leucht, S., Cipriani, A., Spineli, L., Mavridis, D., Örey, D., Richter, F., Samara, M., Barbui, C., Engel, R. R., Geddes, J. R., Kissling, W., Stapf, M. P., Lässig, B., Salanti, G., & Davis, J. M. (2013). Comparative efficacy and tolerability of 15 antipsychotic drugs in schizophrenia: A multiple-treatments meta-analysis. The Lancet, 382(9896), 951–962." },
    { formatted: "National Institute of Mental Health. (2023). Schizophrenia. U.S. Department of Health and Human Services. https://www.nimh.nih.gov/health/topics/schizophrenia" },
    { formatted: "Tandon, R., Gaebel, W., Barch, D. M., Bustillo, J., Gur, R. E., Heckers, S., Malaspina, D., Owen, M. J., Schultz, S., Tsuang, M., Van Os, J., & Carpenter, W. (2013). Definition and description of schizophrenia in the DSM-5. Schizophrenia Research, 150(1), 3–10." }
  ]
};

async function seedReferences() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  let totalUpdated = 0;

  for (const [slug, refs] of Object.entries(courseReferences)) {
    const result = await collection.updateOne(
      { slug },
      { $set: { references: refs } }
    );

    if (result.matchedCount > 0) {
      console.log(`✅ ${slug}: ${refs.length} references added`);
      totalUpdated += refs.length;
    } else {
      console.log(`⚠️  ${slug}: course not found — skipped`);
    }
  }

  console.log(`\nDone. ${totalUpdated} total references seeded across ${Object.keys(courseReferences).length} courses.`);
  await mongoose.disconnect();
}

seedReferences().catch(err => {
  console.error(err);
  process.exit(1);
});
