/**
 * courseBuilder.js - AI Course Builder API Routes
 * 
 * Generates ACEP-compliant CE courses using Anthropic Claude API
 * Templates are embedded - no external config file needed
 * 
 * Place in: server/src/routes/courseBuilder.js
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import mammoth from 'mammoth';
import { protect } from '../middleware/auth.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';

// Admin-only middleware (inline)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════
// EMBEDDED COURSE TEMPLATES
// ═══════════════════════════════════════════════════════════════════

const COURSE_TEMPLATES = {
  
  'family-systems': {
    id: 'family-systems',
    name: 'Family Systems Therapy',
    category: 'Couples & Family',
    icon: '👨‍👩‍👧‍👦',
    description: 'Comprehensive training in family systems theory and interventions',
    suggestedCEHours: [2, 3, 4, 6],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Marriage and Family Therapists (LMFTs)', 'Licensed Clinical Social Workers (LCSWs)', 'Psychologists'],
    coreTopics: ['Bowen Family Systems Theory', 'Structural Family Therapy (Minuchin)', 'Strategic Family Therapy', 'Multigenerational transmission', 'Differentiation of self', 'Triangulation patterns', 'Family life cycle stages', 'Genogram construction and analysis', 'Circular questioning techniques', 'Reframing and positive connotation', 'Boundary setting interventions', 'Enactments in session'],
    moduleTemplates: {
      3: [
        { title: 'Understanding Family Systems Theory', topics: ['Bowen theory', 'Structural theory', 'Strategic approaches'] },
        { title: 'Family Assessment Techniques', topics: ['Genograms', 'Family mapping', 'Circular questioning'] },
        { title: 'Clinical Interventions', topics: ['Reframing', 'Enactments', 'Boundary interventions', 'Homework assignments'] }
      ]
    },
    suggestedObjectives: [
      'Describe the core principles of systems thinking and their application to family therapy',
      'Differentiate between Bowen, structural, and strategic family therapy approaches',
      'Construct and interpret a three-generation genogram to identify family patterns',
      'Apply circular questioning techniques to gather systemic information',
      'Identify triangulation patterns and develop interventions to address them',
      'Design and facilitate therapeutic enactments in family sessions',
      'Assess family boundaries, hierarchy, and subsystems using structural mapping',
      'Implement reframing techniques to shift family perceptions of problems'
    ],
    references: [
      'Bowen, M. (1978). Family therapy in clinical practice. Jason Aronson.',
      'Minuchin, S. (1974). Families and family therapy. Harvard University Press.',
      'Nichols, M. P., & Davis, S. D. (2020). Family therapy: Concepts and methods (12th ed.). Pearson.',
      'McGoldrick, M., Gerson, R., & Petry, S. (2020). Genograms: Assessment and treatment (4th ed.). W.W. Norton.'
    ]
  },

  'testing-assessment': {
    id: 'testing-assessment',
    name: 'Psychological Testing & Assessment',
    category: 'Assessment',
    icon: '📋',
    description: 'Comprehensive training in psychological assessment, testing interpretation, and report writing',
    suggestedCEHours: [2, 3, 4, 6],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Mental Health Counselors (LMHCs)', 'Psychologists', 'Licensed Clinical Social Workers (LCSWs)'],
    coreTopics: ['Psychometric principles (reliability, validity)', 'Test selection and battery construction', 'Cognitive assessment (WAIS, WISC)', 'Personality assessment (MMPI-3, PAI, MCMI)', 'Projective techniques (Rorschach, TAT)', 'Symptom inventories (BDI-II, BAI, PHQ-9)', 'Behavioral assessment', 'Cultural considerations in testing', 'Integrative report writing', 'Feedback sessions', 'Ethical and legal considerations', 'Scope of practice issues'],
    moduleTemplates: {
      3: [
        { title: 'Psychometric Foundations', topics: ['Reliability', 'Validity', 'Norms', 'Standard error'] },
        { title: 'Assessment Instruments and Interpretation', topics: ['Cognitive tests', 'Personality inventories', 'Symptom measures'] },
        { title: 'Integration, Reporting, and Feedback', topics: ['Report writing', 'Feedback sessions', 'Recommendations'] }
      ]
    },
    suggestedObjectives: [
      'Explain core psychometric concepts including reliability, validity, and standard error of measurement',
      'Select appropriate assessment instruments based on referral questions and client characteristics',
      'Interpret standard scores, percentiles, and confidence intervals accurately',
      'Identify cultural factors that may impact test performance and interpretation',
      'Integrate data from multiple assessment sources into coherent case conceptualization',
      'Write clear, clinically useful psychological reports for various audiences',
      'Conduct effective feedback sessions that promote client understanding and engagement',
      'Apply ethical guidelines and scope of practice considerations to assessment activities'
    ],
    references: [
      'American Educational Research Association. (2014). Standards for educational and psychological testing. AERA.',
      'Groth-Marnat, G., & Wright, A. J. (2016). Handbook of psychological assessment (6th ed.). Wiley.',
      'Meyer, G. J., et al. (2001). Psychological testing and psychological assessment. American Psychologist, 56(2), 128-165.',
      'Wright, A. J. (2020). Conducting psychological assessment: A guide for practitioners (2nd ed.). Wiley.'
    ]
  },

  'ethics': {
    id: 'ethics',
    name: 'Ethical Decision-Making',
    category: 'Ethics',
    icon: '⚖️',
    description: 'Comprehensive ethics training covering codes, decision-making models, and complex dilemmas',
    suggestedCEHours: [2, 3, 4, 6],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Mental Health Counselors (LMHCs)', 'Licensed Clinical Social Workers (LCSWs)', 'Marriage and Family Therapists (LMFTs)', 'Psychologists'],
    coreTopics: ['ACA Code of Ethics overview', 'Ethical decision-making models', 'Informed consent requirements', 'Confidentiality and its limits', 'Dual relationships and boundaries', 'Competence and scope of practice', 'Documentation standards', 'Supervision ethics', 'Technology and social media ethics', 'Multicultural ethical considerations', 'End-of-life and vulnerable populations', 'Reporting requirements'],
    moduleTemplates: {
      3: [
        { title: 'Ethical Foundations and Principles', topics: ['ACA Code', 'Core principles', 'Legal vs. ethical'] },
        { title: 'Ethical Decision-Making Models', topics: ['Step-by-step models', 'Consultation', 'Documentation'] },
        { title: 'Contemporary Ethical Challenges', topics: ['Technology', 'Social media', 'Telehealth', 'Boundaries'] }
      ]
    },
    suggestedObjectives: [
      'Identify the core ethical principles underlying professional codes of ethics',
      'Apply a systematic ethical decision-making model to complex clinical dilemmas',
      'Distinguish between legal requirements and ethical obligations in clinical practice',
      'Evaluate boundary situations for potential ethical risks and develop appropriate responses',
      'Implement informed consent processes that meet legal and ethical standards',
      'Navigate confidentiality limits including duty to warn, mandated reporting, and court involvement',
      'Address ethical considerations unique to technology-assisted services and social media',
      'Develop strategies for ongoing ethical self-monitoring and professional consultation'
    ],
    references: [
      'American Counseling Association. (2014). ACA Code of Ethics. Alexandria, VA: Author.',
      'Barnett, J. E., & Johnson, W. B. (2015). Ethics desk reference for counselors (2nd ed.). ACA.',
      'Corey, G., Corey, M. S., & Corey, C. (2019). Issues and ethics in the helping professions (10th ed.). Cengage.',
      'Pope, K. S., & Vasquez, M. J. T. (2016). Ethics in psychotherapy and counseling (5th ed.). Wiley.'
    ]
  },

  'trauma': {
    id: 'trauma',
    name: 'Trauma-Informed Care',
    category: 'Trauma',
    icon: '🌱',
    description: 'Evidence-based approaches to trauma assessment and treatment',
    suggestedCEHours: [2, 3, 4, 6],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Mental Health Counselors (LMHCs)', 'Licensed Clinical Social Workers (LCSWs)', 'Psychologists', 'Marriage and Family Therapists (LMFTs)'],
    coreTopics: ['Trauma definitions and types', 'Neurobiology of trauma', 'Window of tolerance', 'Polyvagal theory', 'Trauma assessment', 'Phase-based treatment', 'EMDR overview', 'Cognitive Processing Therapy', 'Prolonged Exposure', 'Somatic approaches', 'Complex trauma and dissociation', 'Vicarious trauma and self-care'],
    moduleTemplates: {
      3: [
        { title: 'Understanding Trauma', topics: ['Definitions', 'Neurobiology', 'Assessment'] },
        { title: 'Trauma Treatment Approaches', topics: ['Phase-based model', 'Evidence-based treatments', 'Stabilization'] },
        { title: 'Special Considerations', topics: ['Complex trauma', 'Dissociation', 'Clinician self-care'] }
      ]
    },
    suggestedObjectives: [
      'Define trauma and differentiate between acute, chronic, and complex trauma presentations',
      'Explain the neurobiological impact of trauma on brain structure and function',
      'Apply the window of tolerance model to guide clinical interventions',
      'Conduct trauma-informed assessments that minimize retraumatization',
      'Implement phase-based treatment planning for trauma recovery',
      'Compare evidence-based trauma treatments including EMDR, CPT, and PE',
      'Identify signs of dissociation and apply appropriate clinical responses',
      'Develop personal strategies to prevent and address vicarious traumatization'
    ],
    references: [
      'Herman, J. L. (2015). Trauma and recovery: The aftermath of violence. Basic Books.',
      'van der Kolk, B. A. (2014). The body keeps the score. Viking.',
      'Porges, S. W. (2011). The polyvagal theory. W.W. Norton.',
      'Shapiro, F. (2018). Eye movement desensitization and reprocessing (3rd ed.). Guilford.'
    ]
  },

  'supervision': {
    id: 'supervision',
    name: 'Clinical Supervision',
    category: 'Supervision',
    icon: '👥',
    description: 'Training for clinical supervisors on models, methods, and ethical considerations',
    suggestedCEHours: [2, 3, 4],
    defaultCEHours: 3,
    level: 'Advanced',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Approved Clinical Supervisors (ACS)', 'Licensed Clinical Social Workers (LCSWs)', 'Psychologists'],
    coreTopics: ['Supervision models (Discrimination, IDM, SAS)', 'Supervisory working alliance', 'Developmental stages of supervisees', 'Evaluation and feedback', 'Gatekeeping responsibilities', 'Multicultural supervision', 'Ethical and legal issues', 'Documentation requirements', 'Managing difficult supervisory situations', 'Supervision of supervision'],
    moduleTemplates: {
      3: [
        { title: 'Foundations of Clinical Supervision', topics: ['Models', 'Roles', 'Working alliance'] },
        { title: 'Supervision Methods and Techniques', topics: ['Feedback', 'Evaluation', 'Developmental considerations'] },
        { title: 'Ethical and Legal Responsibilities', topics: ['Gatekeeping', 'Documentation', 'Liability'] }
      ]
    },
    suggestedObjectives: [
      'Compare major supervision models and their application to clinical practice',
      'Develop and maintain an effective supervisory working alliance',
      'Assess supervisee developmental level and adjust supervision accordingly',
      'Provide constructive feedback that promotes supervisee growth',
      'Navigate gatekeeping responsibilities with ethical integrity',
      'Address multicultural considerations in supervision relationships',
      'Document supervision activities in accordance with legal and ethical standards',
      'Manage challenging supervisory situations including impairment and boundary issues'
    ],
    references: [
      'Bernard, J. M., & Goodyear, R. K. (2019). Fundamentals of clinical supervision (6th ed.). Pearson.',
      'Falender, C. A., & Shafranske, E. P. (2004). Clinical supervision: A competency-based approach. APA.',
      'Borders, L. D., & Brown, L. L. (2005). The new handbook of counseling supervision. Routledge.'
    ]
  },

  'addiction': {
    id: 'addiction',
    name: 'Addiction Counseling',
    category: 'Addiction',
    icon: '🔄',
    description: 'Evidence-based approaches to substance use and behavioral addictions',
    suggestedCEHours: [2, 3, 4, 6],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Alcohol and Drug Counselors (LADCs)', 'Licensed Clinical Social Workers (LCSWs)', 'Psychologists'],
    coreTopics: ['Neurobiology of addiction', 'Stages of change model', 'Motivational interviewing', 'Assessment instruments (AUDIT, DAST)', 'DSM-5 substance use disorders', 'Medication-assisted treatment', 'Relapse prevention', 'Co-occurring disorders', 'Family involvement in treatment', 'Behavioral addictions', '12-step facilitation', 'Harm reduction approaches'],
    moduleTemplates: {
      3: [
        { title: 'Understanding Addiction', topics: ['Neurobiology', 'DSM-5 criteria', 'Assessment'] },
        { title: 'Evidence-Based Treatments', topics: ['MI', 'CBT', 'Relapse prevention', 'MAT'] },
        { title: 'Special Populations and Considerations', topics: ['Co-occurring disorders', 'Families', 'Recovery support'] }
      ]
    },
    suggestedObjectives: [
      'Explain the neurobiological mechanisms underlying addiction',
      'Apply DSM-5 criteria to diagnose substance use disorders accurately',
      'Utilize validated screening instruments to assess substance use severity',
      'Implement motivational interviewing techniques to enhance treatment engagement',
      'Develop comprehensive relapse prevention plans with clients',
      'Integrate medication-assisted treatment considerations into clinical practice',
      'Address co-occurring mental health and substance use disorders',
      'Apply harm reduction principles when abstinence is not the immediate goal'
    ],
    references: [
      'Miller, W. R., & Rollnick, S. (2013). Motivational interviewing (3rd ed.). Guilford.',
      'SAMHSA. (2023). TIP 63: Medications for opioid use disorder. HHS.',
      'Marlatt, G. A., & Donovan, D. M. (2005). Relapse prevention (2nd ed.). Guilford.'
    ]
  },

  'crisis': {
    id: 'crisis',
    name: 'Crisis Intervention',
    category: 'Crisis Intervention',
    icon: '🆘',
    description: 'Skills for managing psychiatric emergencies and crisis situations',
    suggestedCEHours: [2, 3, 4],
    defaultCEHours: 2,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Mental Health Counselors (LMHCs)', 'Licensed Clinical Social Workers (LCSWs)', 'Psychologists', 'Crisis Counselors'],
    coreTopics: ['Crisis theory and models', 'Suicide risk assessment', 'Safety planning', 'Homicide risk assessment', 'Duty to warn/protect', 'De-escalation techniques', 'Trauma-informed crisis response', 'Crisis documentation', 'Involuntary hospitalization', 'Postvention', 'Vicarious trauma in crisis work'],
    moduleTemplates: {
      2: [
        { title: 'Crisis Assessment', topics: ['Suicide assessment', 'Risk factors', 'Protective factors'] },
        { title: 'Crisis Intervention', topics: ['Safety planning', 'De-escalation', 'Documentation', 'Follow-up'] }
      ]
    },
    suggestedObjectives: [
      'Apply crisis theory to understand client responses to overwhelming events',
      'Conduct comprehensive suicide risk assessments using evidence-based frameworks',
      'Develop collaborative safety plans with clients at risk',
      'Assess homicide risk and apply duty to warn/protect appropriately',
      'Implement de-escalation techniques for agitated clients',
      'Document crisis assessments and interventions to meet legal standards',
      'Navigate involuntary hospitalization procedures ethically',
      'Develop self-care strategies to prevent vicarious traumatization'
    ],
    references: [
      'Jobes, D. A. (2016). Managing suicidal risk: A collaborative approach (2nd ed.). Guilford.',
      'James, R. K., & Gilliland, B. E. (2017). Crisis intervention strategies (8th ed.). Cengage.',
      'Stanley, B., & Brown, G. K. (2012). Safety planning intervention. Cognitive and Behavioral Practice, 19(2), 256-264.'
    ]
  },

  'cultural-competence': {
    id: 'cultural-competence',
    name: 'Multicultural Competence',
    category: 'Cultural Competence',
    icon: '🌍',
    description: 'Developing cultural humility and competence in clinical practice',
    suggestedCEHours: [2, 3, 4],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Mental Health Counselors (LMHCs)', 'Licensed Clinical Social Workers (LCSWs)', 'Psychologists', 'Marriage and Family Therapists (LMFTs)'],
    coreTopics: ['Cultural identity development', 'Cultural humility vs. competence', 'Implicit bias', 'Microaggressions', 'Intersectionality', 'Working with interpreters', 'Immigration and acculturation', 'LGBTQ+ affirming practice', 'Religious/spiritual diversity', 'Socioeconomic considerations', 'Disability and neurodiversity', 'Advocacy and social justice'],
    moduleTemplates: {
      3: [
        { title: 'Foundations of Cultural Competence', topics: ['Identity development', 'Humility', 'Self-awareness'] },
        { title: 'Clinical Skills for Diverse Populations', topics: ['Assessment adaptations', 'Microaggressions', 'Interpreters'] },
        { title: 'Advocacy and Ongoing Development', topics: ['Social justice', 'Organizational change', 'Lifelong learning'] }
      ]
    },
    suggestedObjectives: [
      'Examine personal cultural identity and its impact on clinical practice',
      'Differentiate between cultural competence and cultural humility',
      'Identify implicit biases and their potential impact on treatment',
      'Recognize and respond therapeutically to microaggressions',
      'Apply intersectional frameworks to case conceptualization',
      'Adapt assessment and treatment approaches for culturally diverse clients',
      'Develop skills for effective collaboration with interpreters',
      'Integrate advocacy and social justice into clinical practice'
    ],
    references: [
      'Sue, D. W., & Sue, D. (2016). Counseling the culturally diverse (7th ed.). Wiley.',
      'Hook, J. N., et al. (2013). Cultural humility: Measuring openness. Journal of Counseling Psychology, 60(3), 353-366.',
      'Hays, P. A. (2016). Addressing cultural complexities in practice (3rd ed.). APA.'
    ]
  },

  'child-adolescent': {
    id: 'child-adolescent',
    name: 'Child & Adolescent Counseling',
    category: 'Child & Adolescent',
    icon: '🧒',
    description: 'Developmentally appropriate assessment and treatment for young clients',
    suggestedCEHours: [2, 3, 4, 6],
    defaultCEHours: 3,
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors (LPCs)', 'Licensed Mental Health Counselors (LMHCs)', 'Licensed Clinical Social Workers (LCSWs)', 'School Counselors', 'Psychologists'],
    coreTopics: ['Developmental considerations', 'Play therapy techniques', 'Art and expressive therapies', 'Parent involvement in treatment', 'School consultation', 'Childhood anxiety and depression', 'ADHD assessment and treatment', 'Autism spectrum considerations', 'Trauma in children', 'Behavioral interventions', 'Confidentiality with minors', 'Mandated reporting'],
    moduleTemplates: {
      3: [
        { title: 'Developmental Foundations', topics: ['Stages', 'Assessment adaptations', 'Engaging young clients'] },
        { title: 'Treatment Approaches', topics: ['Play therapy', 'CBT adaptations', 'Family involvement'] },
        { title: 'Special Issues', topics: ['Trauma', 'School collaboration', 'Ethical/legal considerations'] }
      ]
    },
    suggestedObjectives: [
      'Apply developmental theory to assessment and treatment planning',
      'Utilize play therapy techniques appropriate to client age and presenting issues',
      'Adapt cognitive-behavioral interventions for children and adolescents',
      'Engage parents/caregivers effectively in the treatment process',
      'Collaborate with schools and other systems serving young clients',
      'Assess and treat common childhood disorders including anxiety and ADHD',
      'Apply trauma-informed approaches adapted for developmental level',
      'Navigate confidentiality and consent issues unique to minor clients'
    ],
    references: [
      'Landreth, G. L. (2012). Play therapy: The art of the relationship (3rd ed.). Routledge.',
      'Friedberg, R. D., & McClure, J. M. (2015). Clinical practice of cognitive therapy with children (2nd ed.). Guilford.',
      'Weisz, J. R., & Kazdin, A. E. (2017). Evidence-based psychotherapies for children and adolescents (3rd ed.). Guilford.'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function getAllTemplates() {
  return Object.values(COURSE_TEMPLATES).map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    icon: t.icon,
    description: t.description,
    suggestedCEHours: t.suggestedCEHours,
    defaultCEHours: t.defaultCEHours
  }));
}

function getTemplateById(id) {
  return COURSE_TEMPLATES[id] || null;
}

function getModuleStructure(templateId, ceHours) {
  const template = COURSE_TEMPLATES[templateId];
  if (!template) return null;
  const availableHours = Object.keys(template.moduleTemplates).map(Number);
  const closestHours = availableHours.reduce((prev, curr) => 
    Math.abs(curr - ceHours) < Math.abs(prev - ceHours) ? curr : prev
  );
  return template.moduleTemplates[closestHours] || template.moduleTemplates[availableHours[0]];
}

// ═══════════════════════════════════════════════════════════════════
// Initialize Anthropic client
// ═══════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const WORDS_PER_CE_HOUR = 6000;
const MIN_ASSESSMENT_QUESTIONS = 15;
const PASS_THRESHOLD = 0.80;

// ═══════════════════════════════════════════════════════════════════
// TEMPLATE ROUTES
// ═══════════════════════════════════════════════════════════════════

router.get('/templates', protect, adminOnly, (req, res) => {
  try {
    const templates = getAllTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/templates/:id', protect, adminOnly, (req, res) => {
  try {
    const template = getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/templates/:id/apply', protect, adminOnly, (req, res) => {
  try {
    const { ceHours, customTitle } = req.body;
    const template = getTemplateById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const hours = ceHours || template.defaultCEHours;
    const modules = getModuleStructure(req.params.id, hours);

    res.json({
      title: customTitle || template.name,
      description: template.description,
      ceHours: hours,
      category: template.category,
      level: template.level,
      targetAudience: template.targetAudience,
      objectives: template.suggestedObjectives.slice(0, 8),
      modules: modules,
      coreTopics: template.coreTopics,
      references: template.references
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// GENERATION ROUTES
// ═══════════════════════════════════════════════════════════════════

router.post('/outline', protect, adminOnly, async (req, res) => {
  try {
    const { title, ceHours, category, level, topic, targetAudience, specialInstructions } = req.body;

    if (!title || !topic || !ceHours) {
      return res.status(400).json({ error: 'Title, topic, and CE hours are required' });
    }

    // 1 CE = 2 content sections + 1 conclusion
    const contentSections = ceHours * 2;
    const totalSections = contentSections + 1;
    const wordsPerSection = Math.round((ceHours * 6000) / contentSections);

    const prompt = `You are an expert instructional designer for NBCC ACEP-compliant mental health CE courses.

COURSE PARAMETERS:
- Title: ${title}
- CE Hours: ${ceHours} (requires ${ceHours * 6000}+ learner-visible words total)
- Category: ${category}
- Level: ${level}
- Target Audience: ${(targetAudience || ['Licensed mental health professionals']).join(', ')}
- Topic: ${topic}
${specialInstructions ? `- Special Instructions: ${specialInstructions}` : ''}

Generate a JSON course outline with EXACTLY this structure:
{
  "title": "Full course title",
  "description": "2-3 paragraph course description for catalog",
  "objectives": ["Participants will be able to ...", ...],
  "sections": [
    {
      "title": "Section 1: Title Here",
      "order": 1,
      "topics": ["Topic A", "Topic B", "Topic C"],
      "estimatedWords": ${wordsPerSection},
      "kcCount": 3
    },
    ...
    {
      "title": "Conclusion: Key Takeaways and Practice Integration",
      "order": ${totalSections},
      "topics": ["Summary", "Practice application", "Resources"],
      "estimatedWords": 800,
      "kcCount": 0
    }
  ]
}

Rules:
- Exactly ${totalSections} sections (${contentSections} content + 1 conclusion)
- Each content section: ${wordsPerSection} estimated words, 2-3 KCs
- Conclusion: no KCs
- Objectives must start with action verbs (Identify, Apply, Analyze, Describe, Demonstrate)
- Minimum 5 objectives for ${ceHours} CE hours
- Return ONLY valid JSON, no markdown`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      thinking: { type: 'disabled' },
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content[0].text;
    let outline;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      outline = JSON.parse(match ? match[0] : raw);
    } catch {
      return res.status(500).json({ error: 'Failed to parse outline response', raw });
    }

    outline.ceHours = ceHours;
    outline.category = category;
    outline.level = level;
    outline.targetAudience = targetAudience;

    res.json(outline);

  } catch (error) {
    console.error('Outline generation error:', error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/generate', protect, adminOnly, async (req, res) => {
  try {
    const { title, ceHours, category, level, targetAudience, outline, specialInstructions } = req.body;

    if (!outline || !Array.isArray(outline.sections) || outline.sections.length === 0) {
      return res.status(400).json({ error: 'Outline with sections[] array is required' });
    }

    const course = {
      title:          outline.title || title,
      slug:           slugify(outline.title || title),
      description:    outline.description || '',
      ceHours,
      ceuHours:       ceHours,
      category,
      level,
      ceCategory:     category,
      contentArea:    category,
      targetAudience: targetAudience || [],
      objectives:     outline.objectives || [],
      deliveryMethod: 'online',
      accessType:     'subscription',
      status:         'draft',
      isPublished:    false,
      sections:       [],
      assessment:     { questions: [], passThreshold: 0.80, passingScore: 80, maxAttempts: 3 },
      references:     [],
    };

    // Generate each section
    for (let i = 0; i < outline.sections.length; i++) {
      const sec = outline.sections[i];
      const isConclusion = i === outline.sections.length - 1;
      const contentBlocks = await generateSectionBlocks({
        sectionNumber:  i + 1,
        sectionTitle:   sec.title,
        topics:         sec.topics || [],
        wordsTarget:    sec.estimatedWords || 3000,
        kcCount:        isConclusion ? 0 : (sec.kcCount || 2),
        courseTitle:    course.title,
        level,
        targetAudience,
        isConclusion,
      });

      course.sections.push({
        title:         sec.title,
        order:         i + 1,
        contentBlocks,
      });
    }

    // Generate final assessment
    course.assessment = await generateAssessment({
      courseTitle:   course.title,
      sections:      course.sections,
      questionCount: Math.max(15, ceHours * 7),
    });

    // Generate references
    course.references = await generateReferences({
      courseTitle: course.title,
      category,
      topics:      outline.sections.map(s => s.title),
    });

    res.json(course);

  } catch (error) {
    console.error('Course generation error:', error);
    res.status(500).json({ error: error.message });
  }
});


// ─── Generate contentBlocks[] for one section ────────────────────────────────
// Gold Standard rhythm:
//   sectionDivider → text (intro) → accordion → text (deep dive) →
//   [clinical vignette blockquote if content section] →
//   multipleChoice × kcCount → reflection
//   Conclusion: sectionDivider → text → accordion → reflection → resources

async function generateSectionBlocks({
  sectionNumber, sectionTitle, topics, wordsTarget,
  kcCount, courseTitle, level, targetAudience, isConclusion,
}) {
  const audience = (targetAudience || []).join(', ') || 'licensed mental health professionals';

  const prompt = isConclusion
    ? `You are writing the conclusion section for a CE course titled "${courseTitle}".

Section: "${sectionTitle}"

Generate a JSON array of content blocks for this conclusion section.
Use EXACTLY this structure — no other block types:

[
  {
    "type": "sectionDivider",
    "title": "${sectionTitle}",
    "subtitle": "Key Takeaways and Practice Integration",
    "sectionNumber": ${sectionNumber}
  },
  {
    "type": "text",
    "heading": "Course Summary",
    "content": "<p>400-600 word summary paragraph...</p><p>Continue...</p>"
  },
  {
    "type": "accordion",
    "title": "Module Highlights",
    "items": [
      { "title": "Key concept 1", "content": "150-200 word explanation..." },
      { "title": "Key concept 2", "content": "150-200 word explanation..." },
      { "title": "Key concept 3", "content": "150-200 word explanation..." }
    ]
  },
  {
    "type": "reflection",
    "question": "Ethical Practice Plan: Describe how you will integrate one key learning from this course into your practice within the next 30 days. What specific steps will you take?",
    "minLength": 100
  },
  {
    "type": "resources",
    "title": "Additional Resources",
    "resources": [
      { "title": "Resource title", "url": "https://example.org", "type": "link" },
      { "title": "Resource 2", "url": "https://example.org", "type": "link" }
    ]
  }
]

Return ONLY a valid JSON array. No markdown.`

    : `You are writing Section ${sectionNumber} of a CE course titled "${courseTitle}".

Section: "${sectionTitle}"
Topics to cover: ${topics.join(', ')}
Target words: ${wordsTarget} (count all text across all blocks)
Audience: ${audience}
Level: ${level}

Generate a JSON array of content blocks using EXACTLY this structure and rhythm:

[
  {
    "type": "sectionDivider",
    "title": "${sectionTitle}",
    "subtitle": "Brief engaging subtitle",
    "sectionNumber": ${sectionNumber}
  },
  {
    "type": "text",
    "heading": "Introduction heading",
    "content": "<p>300-500 word introduction paragraph(s). Use <strong> for emphasis. Use <p> tags for each paragraph.</p>"
  },
  {
    "type": "accordion",
    "title": "Accordion title related to core concept",
    "items": [
      { "title": "Subtopic 1", "content": "200-300 word explanation with clinical context..." },
      { "title": "Subtopic 2", "content": "200-300 word explanation..." },
      { "title": "Subtopic 3", "content": "200-300 word explanation..." },
      { "title": "Subtopic 4", "content": "200-300 word explanation..." }
    ]
  },
  {
    "type": "text",
    "heading": "Deep Dive heading",
    "content": "<p>800-1200 word detailed content. Multiple paragraphs with <p> tags. Clinical examples, research citations (Author, Year), and practical application.</p><p>Continue the explanation...</p>"
  },
  {
    "type": "text",
    "heading": "Clinical Application heading",
    "content": "<blockquote><p><strong>Clinical Vignette:</strong> [200-word realistic case example with a licensed counselor and a client]</p></blockquote>"
  },
  ${Array.from({ length: kcCount }, (_, i) => `{
    "type": "multipleChoice",
    "question": "Clinical question ${i + 1} testing understanding of ${topics[i % topics.length] || 'course content'}?",
    "options": ["Option A — plausible distractor", "Option B — plausible distractor", "Option C — correct answer", "Option D — plausible distractor"],
    "correctAnswer": 2,
    "explanation": "Option C is correct because... [50-80 word explanation with clinical rationale]"
  }`).join(',\n  ')}${kcCount > 0 ? ',' : ''}
  {
    "type": "reflection",
    "question": "Reflective practice question: How does this section's content connect to a recent clinical situation you've encountered? What would you do differently now?",
    "minLength": 75
  }
]

CRITICAL RULES:
- options[] MUST be plain strings (no objects)
- correctAnswer MUST be a number (0-based index)
- Vary which index (0,1,2,3) is correctAnswer across KCs — never all the same
- No option should appear correct >40% of time across all KCs in this section
- content fields use HTML: <p>, <strong>, <em>, <ul><li>, <blockquote> only
- No inline styles, no class attributes
- Return ONLY a valid JSON array. No markdown.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    thinking: { type: 'disabled' },
    max_tokens: 12000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].text;
  let blocks;
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    blocks = JSON.parse(match ? match[0] : raw);
  } catch {
    // Fallback: return minimal valid section
    blocks = [
      { type: 'sectionDivider', title: sectionTitle, sectionNumber, subtitle: '' },
      { type: 'text', heading: sectionTitle, content: `<p>Content for ${sectionTitle}.</p>` },
    ];
  }

  // Enforce schema: options must be [String], correctAnswer must be Number
  blocks = blocks.map(block => {
    if (block.type === 'multipleChoice' || block.type === 'multiSelect') {
      // Normalize options to [String]
      if (Array.isArray(block.options)) {
        block.options = block.options.map(o =>
          typeof o === 'string' ? o : (o?.text || o?.label || String(o) || '')
        );
      } else {
        block.options = ['', '', '', ''];
      }
      // Normalize correctAnswer to Number
      if (typeof block.correctAnswer !== 'number') {
        // Try to find isCorrect: true in original options
        const orig = Array.isArray(block.options) ? block.options : [];
        const idx = orig.findIndex(o => o?.isCorrect === true);
        block.correctAnswer = idx >= 0 ? idx : 0;
      }
    }
    return block;
  });

  return blocks;
}


// ─── Generate final assessment ────────────────────────────────────────────────

async function generateAssessment({ courseTitle, sections, questionCount }) {
  const sectionTitles = sections.map(s => s.title).join(', ');

  const prompt = `Generate ${questionCount} final exam questions for the CE course "${courseTitle}".
Sections covered: ${sectionTitles}

Requirements:
- Mix of difficulty: 30% recall, 50% application, 20% analysis
- Each question must have exactly 4 options
- Distribute correct answers evenly across positions A(0), B(1), C(2), D(3) — no single position >40%
- Clinical scenarios preferred over pure recall
- Minimum 15 questions, maximum 25

Return ONLY a JSON object:
{
  "questions": [
    {
      "question": "Question text?",
      "type": "multiple_choice",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": 1,
      "explanation": "Why this answer is correct (50-80 words)."
    }
  ],
  "passThreshold": 0.80,
  "passingScore": 80,
  "maxAttempts": 3
}

Return ONLY valid JSON. No markdown.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    thinking: { type: 'disabled' },
    max_tokens: 12000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].text;
  let result;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    result = JSON.parse(match ? match[0] : raw);
  } catch {
    result = { questions: [], passThreshold: 0.80, passingScore: 80, maxAttempts: 3 };
  }

  // Enforce canonical schema
  if (Array.isArray(result.questions)) {
    result.questions = result.questions.map(q => ({
      question:      q.question || '',
      type:          'multiple_choice',
      options:       Array.isArray(q.options)
        ? q.options.map(o => typeof o === 'string' ? o : (o?.text || String(o) || ''))
        : ['', '', '', ''],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation:   q.explanation || '',
    }));
  }

  return result;
}


// ─── Generate references ──────────────────────────────────────────────────────

async function generateReferences({ courseTitle, category, topics }) {
  const prompt = `Generate 10-15 APA-7 formatted references for the CE course "${courseTitle}" (${category}).
Topics: ${topics.join(', ')}

Return ONLY a JSON array of reference objects:
[
  {
    "author": "Last, F. M., & Last, F. M.",
    "year": "2023",
    "title": "Article or book title here",
    "source": "Journal Name, 45(2), 123–134. https://doi.org/10.xxxx/xxxxx"
  }
]

Use realistic but generalized citations — real journal names, plausible DOIs.
Return ONLY valid JSON array. No markdown.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    thinking: { type: 'disabled' },
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].text;
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return JSON.parse(match ? match[0] : raw);
  } catch {
    return [];
  }
}


function slugify(title) {
  return (title || '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

router.post('/save', protect, adminOnly, async (req, res) => {
  try {
    const courseData = req.body;
    const { Course: InteractiveCourse } = await import('../models/InteractiveCourse.js');

    // Clean transient fields
    delete courseData._wordCount;
    delete courseData._requiredWords;

    if (!courseData.description) courseData.description = courseData.title || 'No description';

    // Hardcoded presenter defaults (ACEP required)
    courseData.presenter = {
      name: 'Kejuiana Johnson',
      credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
      licenseNumber: 'LPC009587',
      licenseState: 'Georgia',
      category: 'category1'
    };

    // Hardcoded provider defaults (ACEP required)
    courseData.ceProvider = 'GA Integrated Therapeutic Perspectives LLC';
    courseData.acepNumber = '7760';

    // Map frontend acepProvider shape to schema fields
    if (courseData.acepProvider) {
      delete courseData.acepProvider;
    }

    // Compute wordCount via canonical counter (single source of truth).
    // Matches the DB pre-save hook exactly so the saved value never drifts.
    courseData.wordCount = countCourseWords(courseData);

    // Extract _id for upsert logic
    const courseId = courseData._id;
    delete courseData._id;

    let course;

    if (courseId) {
      // Case 1: Explicit _id → update existing document
      course = await InteractiveCourse.findByIdAndUpdate(
        courseId,
        { $set: courseData },
        { new: true, runValidators: false }
      );
      if (!course) {
        return res.status(404).json({ success: false, error: 'Course not found' });
      }
    } else if (courseData.slug) {
      // Case 2: No _id but slug matches existing → update to prevent duplicates
      course = await InteractiveCourse.findOneAndUpdate(
        { slug: courseData.slug },
        { $set: courseData },
        { new: true, runValidators: false }
      );
      if (!course) {
        // Case 3: No match → create new document
        course = new InteractiveCourse(courseData);
        await course.save();
      }
    } else {
      // No _id and no slug → create new
      course = new InteractiveCourse(courseData);
      await course.save();
    }

    res.json({
      success: true,
      course: {
        _id: course._id,
        slug: course.slug,
        title: course.title,
        status: course.status,
        isPublished: course.isPublished
      }
    });

  } catch (error) {
    console.error('Save course error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// PUBLISH — save + set published status
// ═══════════════════════════════════════════════════════════════════

router.post('/publish', protect, adminOnly, async (req, res) => {
  try {
    const { Course: InteractiveCourse } = await import('../models/InteractiveCourse.js');
    const courseData = req.body;
    const courseId = courseData._id;

    if (!courseId) {
      return res.status(400).json({ success: false, error: 'Course must be saved before publishing (no _id)' });
    }

    // Basic validation before publishing
    const errors = [];
    if (!courseData.title || courseData.title.trim().length < 3) errors.push('Title is required (min 3 chars)');
    if (!courseData.ceHours || courseData.ceHours < 1) errors.push('CE hours must be at least 1');
    if (!courseData.sections || courseData.sections.length === 0) errors.push('At least one section is required');
    if (!courseData.objectives || courseData.objectives.length === 0) errors.push('At least one learning objective is required');

    // Word count check via canonical counter (single source of truth)
    const wordCount = countCourseWords(courseData);
    const targetWords = requiredWordsFor(courseData.ceHours);
    if (wordCount < targetWords * 0.8) {
      errors.push(`Word count ${wordCount} is below 80% of target ${targetWords} (NBCC ACEP requirement)`);
    }

    // Assessment check
    const assessmentQs = courseData.assessment?.questions || [];
    if (assessmentQs.length < 15) {
      errors.push(`Assessment has ${assessmentQs.length} questions (minimum 15 required)`);
    }

    if (errors.length > 0) {
      return res.status(422).json({ success: false, errors, error: errors.join('; ') });
    }

    // Set publish fields
    delete courseData._id;
    courseData.status = 'published';
    courseData.isPublished = true;
    courseData.wordCount = wordCount;
    courseData.publishedAt = new Date();

    // Hardcoded presenter/provider (same as save)
    courseData.presenter = {
      name: 'Kejuiana Johnson',
      credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
      licenseNumber: 'LPC009587',
      licenseState: 'Georgia',
      category: 'category1'
    };
    courseData.ceProvider = 'GA Integrated Therapeutic Perspectives LLC';
    courseData.acepNumber = '7760';
    if (courseData.acepProvider) delete courseData.acepProvider;

    const course = await InteractiveCourse.findByIdAndUpdate(
      courseId,
      { $set: courseData },
      { new: true, runValidators: false }
    );

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({
      success: true,
      course: {
        _id: course._id,
        slug: course.slug,
        title: course.title,
        status: course.status,
        isPublished: course.isPublished
      }
    });

  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// VALIDATE — server-side ACEP compliance check (no save)
// ═══════════════════════════════════════════════════════════════════

router.post('/validate', protect, adminOnly, async (req, res) => {
  try {
    const courseData = req.body;
    const errors = [];
    const warnings = [];

    // Title
    if (!courseData.title || courseData.title.trim().length < 3) errors.push({ field: 'title', message: 'Title is required (min 3 chars)' });

    // CE Hours
    if (!courseData.ceHours || courseData.ceHours < 1) errors.push({ field: 'ceHours', message: 'CE hours must be at least 1' });

    // Objectives
    const objectives = courseData.objectives || [];
    if (objectives.length === 0) errors.push({ field: 'objectives', message: 'At least one learning objective is required' });

    // Sections
    const sections = courseData.sections || [];
    if (sections.length === 0) errors.push({ field: 'sections', message: 'At least one content section is required' });

    // Word count via canonical counter (single source of truth)
    const wordCount = countCourseWords(courseData);
    const targetWords = requiredWordsFor(courseData.ceHours);
    if (wordCount < targetWords) {
      errors.push({ field: 'wordCount', message: `${wordCount} words — need ${targetWords} (${courseData.ceHours} CE × 6,000 words)` });
    } else if (wordCount < targetWords * 1.1) {
      warnings.push({ field: 'wordCount', message: `Word count ${wordCount} is close to minimum ${targetWords}` });
    }

    // Assessment
    const assessmentQs = courseData.assessment?.questions || [];
    if (assessmentQs.length < 15) {
      errors.push({ field: 'assessment', message: `${assessmentQs.length} questions — minimum 15 required` });
    }

    // Answer distribution check
    if (assessmentQs.length >= 15) {
      const answerCounts = [0, 0, 0, 0];
      assessmentQs.forEach(q => {
        const idx = typeof q.correctAnswer === 'number' ? q.correctAnswer : -1;
        if (idx >= 0 && idx < 4) answerCounts[idx]++;
      });
      const maxPct = Math.max(...answerCounts) / assessmentQs.length;
      if (maxPct > 0.4) {
        warnings.push({ field: 'assessment', message: `Answer distribution skewed — one option is correct ${Math.round(maxPct * 100)}% of the time (max 40%)` });
      }
    }

    // References
    const refs = courseData.references || [];
    if (refs.length < 3) {
      warnings.push({ field: 'references', message: `${refs.length} references — recommend at least 3` });
    }

    // Description
    if (!courseData.description || courseData.description.length < 20) {
      warnings.push({ field: 'description', message: 'Course description is missing or very short' });
    }

    res.json({
      valid: errors.length === 0,
      errors,
      warnings,
      wordCount,
      targetWords,
      assessmentCount: assessmentQs.length
    });

  } catch (error) {
    console.error('Validate course error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// LOAD BY SLUG — fetch a course for editing by slug
// ═══════════════════════════════════════════════════════════════════

router.get('/slug/:slug', protect, adminOnly, async (req, res) => {
  try {
    const { Course: InteractiveCourse } = await import('../models/InteractiveCourse.js');
    const course = await InteractiveCourse.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    console.error('Load course by slug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// LOAD BY ID — fetch a course for editing
// IMPORTANT: This route MUST be last — `:id` is a catch-all param
// ═══════════════════════════════════════════════════════════════════

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { Course: InteractiveCourse } = await import('../models/InteractiveCourse.js');
    const course = await InteractiveCourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    console.error('Load course error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// OUTLINE IMPORT — /parse-outline + /import-docx
// ═══════════════════════════════════════════════════════════════════

// ── Helper: convert author text → outline JSON via Anthropic ─────────────────
// Preserves the author's section titles, ordering, and topics verbatim.
async function parseOutlineText(text, { ceHours = 3, category = 'Clinical Practice', level = 'Intermediate' } = {}) {
  const contentSections = ceHours * 2;
  const wordsPerSection = Math.round((ceHours * 6000) / contentSections);

  const prompt = `Convert this author's course outline into the EXACT outline JSON structure below.
Preserve their section titles, ordering, and topics EXACTLY as written.
Do NOT invent content — only structure what they wrote.
If objectives are present, keep them; if not, leave objectives:[].

Author's outline:
"""
${text}
"""

Return ONLY valid JSON with EXACTLY this structure:
{
  "title": "Course title from the outline",
  "description": "Course description if present, else empty string",
  "objectives": ["objective 1", "objective 2"],
  "sections": [
    {
      "title": "Section title verbatim",
      "order": 1,
      "topics": ["topic1", "topic2"],
      "estimatedWords": ${wordsPerSection},
      "kcCount": 2
    }
  ]
}

Rules:
- Use the author's section titles verbatim
- If no explicit conclusion section exists, add one as the last section with kcCount:0
- Content sections: kcCount 2, conclusion: kcCount 0
- Return ONLY valid JSON, no markdown`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    thinking: { type: 'disabled' },
    max_tokens: 6000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].text;
  const match = raw.match(/\{[\s\S]*\}/);
  const outline = JSON.parse(match ? match[0] : raw);
  outline.ceHours = ceHours;
  outline.category = category;
  outline.level = level;
  return outline;
}

// ── Helper: build section shells from outline (mode 2) ────────────────────────
// Returns a course object with empty contentBlocks — author fills content.
function buildShellsFromOutline(outline) {
  return {
    title:          outline.title || 'Imported Course',
    slug:           slugify(outline.title || 'imported-course'),
    description:    outline.description || '',
    ceHours:        outline.ceHours || 3,
    ceuHours:       outline.ceHours || 3,
    category:       outline.category || 'Clinical Practice',
    level:          outline.level || 'Intermediate',
    objectives:     outline.objectives || [],
    deliveryMethod: 'online',
    accessType:     'subscription',
    status:         'draft',
    isPublished:    false,
    sections: (outline.sections || []).map((sec, i) => ({
      title:         sec.title,
      order:         i + 1,
      contentBlocks: [],
    })),
    assessment: { questions: [], passThreshold: 0.80, passingScore: 80, maxAttempts: 3 },
    references: [],
  };
}

// ── Helper: map docx prose → sections + text blocks (mode 3 — verbatim) ─────
// Never rewrites author prose. Maps headings → section titles, body → text.content.
// BLOCK_FIELD_REFERENCE.md: text block prose field = 'content' (not textContent).
function buildCourseFromDocxProse(extractedText, { ceHours = 3, category = 'Clinical Practice', level = 'Intermediate', title: courseTitle } = {}) {
  const lines = extractedText.split('\n').map(l => l.trim()).filter(Boolean);

  const sections = [];
  let current = null;

  for (const line of lines) {
    // Detect headings: ALL CAPS, or short (<80 chars) non-sentence lines, or section/chapter/module prefix
    const isHeading = (
      line.length < 80 &&
      !line.endsWith('.') &&
      !line.endsWith(',') &&
      (line === line.toUpperCase() || /^(section|chapter|module|part|\d+\.)\s/i.test(line))
    );

    if (isHeading) {
      if (current) sections.push(current);
      current = { title: line, paragraphs: [] };
    } else if (!current) {
      current = { title: courseTitle || 'Section 1', paragraphs: [line] };
    } else {
      current.paragraphs.push(line);
    }
  }
  if (current) sections.push(current);

  // Fallback: no heading structure found — treat all as one section
  if (sections.length === 0 || (sections.length === 1 && sections[0].paragraphs.length === 0 && lines.length > 0)) {
    sections.length = 0;
    sections.push({ title: courseTitle || 'Course Content', paragraphs: lines });
  }

  return {
    title:          courseTitle || sections[0]?.title || 'Imported Course',
    slug:           slugify(courseTitle || sections[0]?.title || 'imported-course'),
    description:    '',
    ceHours,
    ceuHours:       ceHours,
    category,
    level,
    objectives:     [],
    deliveryMethod: 'online',
    accessType:     'subscription',
    status:         'draft',
    isPublished:    false,
    sections: sections.map((sec, i) => ({
      title: sec.title,
      order: i + 1,
      contentBlocks: sec.paragraphs.length > 0
        ? [{
            type:    'text',
            // text block canonical field from BLOCK_FIELD_REFERENCE.md
            content: sec.paragraphs.map(p => `<p>${p}</p>`).join('\n'),
          }]
        : [],
    })),
    assessment: { questions: [], passThreshold: 0.80, passingScore: 80, maxAttempts: 3 },
    references: [],
  };
}

// ── Multer instance for docx uploads ─────────────────────────────────────────
const docxUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname?.endsWith('.docx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are accepted'));
    }
  },
});

// ── POST /parse-outline — paste path, modes 1 & 2 ────────────────────────────
router.post('/parse-outline', protect, adminOnly, async (req, res) => {
  try {
    const { text, ceHours = 3, category = 'Clinical Practice', level = 'Intermediate' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
    const outline = await parseOutlineText(text.trim(), {
      ceHours: Number(ceHours) || 3,
      category,
      level,
    });
    res.json(outline);
  } catch (error) {
    console.error('parse-outline error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── POST /import-docx — file path, all modes ─────────────────────────────────
router.post('/import-docx', protect, adminOnly, docxUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No .docx file uploaded (field name: file)' });
    }
    const { mode = 'outline', ceHours = 3, category = 'Clinical Practice', level = 'Intermediate', title } = req.body;
    const ceH = Number(ceHours) || 3;

    const { value: extractedText } = await mammoth.extractRawText({ buffer: req.file.buffer });

    if (mode === 'convert') {
      // Mode 3: preserve author prose verbatim — map to sections + text blocks
      const course = buildCourseFromDocxProse(extractedText, { ceHours: ceH, category, level, title });
      return res.json({ mode: 'convert', course });
    }

    // Modes 'outline' / 'shells': parse extracted text → outline JSON for OutlineEditor
    const outline = await parseOutlineText(extractedText, { ceHours: ceH, category, level });
    res.json({ mode, outline });

  } catch (error) {
    console.error('import-docx error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
