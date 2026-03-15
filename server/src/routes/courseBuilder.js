/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
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
import { protect } from '../middleware/auth.js';
import { searchScholarlyDatabases, fetchArticlesForSynthesis } from '../services/scholarlySearch.js';
import { synthesizeMetaAnalysis, synthesizeComparativeAnalysis, generateCourseFromSynthesis } from '../services/researchSynthesis.js';

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

    const moduleCount = Math.max(4, ceHours * 2);

    const prompt = `You are an expert instructional designer for mental health continuing education courses. Generate a detailed course outline for NBCC ACEP-compliant CE training.

COURSE PARAMETERS:
- Title: ${title}
- CE Hours: ${ceHours} (requires ${ceHours * WORDS_PER_CE_HOUR}+ words total)
- Category: ${category}
- Level: ${level}
- Target Audience: ${targetAudience?.join(', ') || 'Licensed mental health professionals'}
- Topic Description: ${topic}
${specialInstructions ? `- Special Instructions: ${specialInstructions}` : ''}

Generate a JSON object with this EXACT structure:
{
  "title": "Course title",
  "description": "Comprehensive 2-3 paragraph course description",
  "objectives": ["Learning objective 1", "Learning objective 2", ...],
  "modules": [
    { "title": "Module 1: Title Here", "topics": ["Topic 1", "Topic 2", "Topic 3"], "estimatedWords": 3000 },
    ...
  ]
}

Return ONLY valid JSON, no markdown.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    let outline;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      outline = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse outline', raw: content });
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

    if (!outline || !outline.modules) {
      return res.status(400).json({ error: 'Outline with modules is required' });
    }

    const wordsPerModule = Math.round((ceHours * WORDS_PER_CE_HOUR) / outline.modules.length);
    const course = {
      title: outline.title || title,
      slug: slugify(outline.title || title),
      description: outline.description,
      ceHours: ceHours,
      credits: ceHours,
      category: category,
      level: level,
      contentArea: category,
      targetAudience: targetAudience || [],
      objectives: outline.objectives || [],
      deliveryMethod: 'online',
      modules: [],
      assessment: { questions: [], passThreshold: PASS_THRESHOLD },
      references: [],
      isPublished: false,
      status: 'draft',
      acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' },
      presenter: {
        name: 'CounselorReady',
        credentials: 'NBCC ACEP #7760',
        qualificationStatement: 'Content developed by licensed mental health professionals.'
      }
    };

    for (let i = 0; i < outline.modules.length; i++) {
      const mod = outline.modules[i];
      const moduleContent = await generateModule({
        moduleNumber: i + 1,
        moduleTitle: mod.title,
        topics: mod.topics,
        wordsTarget: wordsPerModule,
        courseTitle: course.title,
        level: level,
        targetAudience: targetAudience
      });
      course.modules.push(moduleContent);
    }

    course.assessment = await generateAssessment({
      courseTitle: course.title,
      modules: course.modules,
      questionCount: Math.max(MIN_ASSESSMENT_QUESTIONS, ceHours * 7)
    });

    course.references = await generateReferences({
      courseTitle: course.title,
      category: category,
      topics: outline.modules.map(m => m.title)
    });

    course._wordCount = countCourseWords(course);
    course._requiredWords = ceHours * WORDS_PER_CE_HOUR;

    res.json(course);

  } catch (error) {
    console.error('Course generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function generateModule({ moduleNumber, moduleTitle, topics, wordsTarget, courseTitle, level, targetAudience }) {
  const prompt = `Create content for Module ${moduleNumber}: ${moduleTitle}

Course: ${courseTitle}
Topics: ${topics?.join(', ') || 'Based on module title'}
Target words: ${wordsTarget}
Level: ${level}

Generate JSON:
{
  "title": "${moduleTitle}",
  "order": ${moduleNumber},
  "lessons": [
    { "title": "Lesson title", "order": 1, "type": "text", "content": "<h3>Header</h3><p>Content...</p>", "textContent": "Plain text" }
  ],
  "quiz": {
    "title": "Module ${moduleNumber} Knowledge Check",
    "questions": [
      { "question": "Question?", "options": [{ "text": "A", "isCorrect": false }, { "text": "B", "isCorrect": true }], "explanation": "Why B is correct" }
    ],
    "passingScore": 0.80
  }
}

Write ${wordsTarget}+ words. Include clinical examples. Return ONLY JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.content[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

async function generateAssessment({ courseTitle, modules, questionCount }) {
  const moduleTopics = modules.map(m => m.title).join(', ');
  
  const prompt = `Generate ${questionCount} assessment questions for "${courseTitle}".
Modules: ${moduleTopics}

Return JSON:
{ "questions": [{ "question": "?", "options": [{ "text": "A", "isCorrect": false }], "explanation": "..." }], "passThreshold": 0.80 }

Return ONLY JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.content[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

async function generateReferences({ courseTitle, category, topics }) {
  const prompt = `Generate 10-15 APA references for "${courseTitle}" (${category}).
Topics: ${topics.join(', ')}
Return JSON array: ["Reference 1", "Reference 2", ...]
Return ONLY JSON array.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.content[0].text;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

function countCourseWords(course) {
  let total = 0;
  const countWords = (text) => {
    if (!text) return 0;
    return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  };
  total += countWords(course.description);
  course.objectives?.forEach(obj => { total += countWords(obj); });
  course.modules?.forEach(mod => {
    total += countWords(mod.title);
    mod.lessons?.forEach(lesson => {
      total += countWords(lesson.textContent || lesson.content);
    });
  });
  return total;
}

function slugify(title) {
  return title.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100);
}

router.post('/save', protect, adminOnly, async (req, res) => {
  try {
    const courseData = req.body;
    const Course = (await import('../models/Course.js')).default;

    delete courseData._wordCount;
    delete courseData._requiredWords;

    // Handle ACEP override — allow publishing without ACEP provider
    if (courseData.acepOverride) {
      delete courseData.acepProvider;
      courseData.ceProvider = courseData.ceProvider || null;
      courseData.acepNumber = courseData.acepNumber || null;
    }
    delete courseData.acepOverride;

    let existing = await Course.findOne({ slug: courseData.slug });
    
    if (existing) {
      Object.assign(existing, courseData);
      existing.updatedAt = new Date();
      await existing.save();
      res.json({ success: true, action: 'updated', course: existing });
    } else {
      courseData.createdAt = new Date();
      courseData.updatedAt = new Date();
      const course = new Course(courseData);
      await course.save();
      res.json({ success: true, action: 'created', course });
    }

  } catch (error) {
    console.error('Save course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ANALYTICS ENDPOINT — Course engagement data
// ═══════════════════════════════════════════════════════════════════
router.get('/analytics/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Try to import progress models
    let CourseProgress;
    try {
      const mod = await import('../models/InteractiveCourse.js');
      CourseProgress = mod.CourseProgress;
    } catch (e) {
      // Fallback to UserCourseProgress
      try {
        CourseProgress = (await import('../models/UserCourseProgress.js')).default;
      } catch (e2) {
        return res.json({ enrollments: 0, completions: 0, avgScore: null, avgTimeSpent: null });
      }
    }

    if (!CourseProgress) {
      return res.json({ enrollments: 0, completions: 0, avgScore: null, avgTimeSpent: null });
    }

    const allProgress = await CourseProgress.find({ courseId }).lean();
    const enrollments = allProgress.length;
    const completions = allProgress.filter(p => p.status === 'completed' || p.overallProgress >= 100).length;

    let totalScore = 0;
    let scoreCount = 0;
    let totalTime = 0;
    let timeCount = 0;

    allProgress.forEach(p => {
      if (p.bestAssessmentScore != null) {
        totalScore += p.bestAssessmentScore;
        scoreCount++;
      }
      if (p.totalTimeSpent) {
        totalTime += p.totalTimeSpent;
        timeCount++;
      }
    });

    res.json({
      enrollments,
      completions,
      avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : null,
      avgTimeSpent: timeCount > 0 ? Math.round(totalTime / timeCount) : null,
      completionRate: enrollments > 0 ? Math.round(completions / enrollments * 100) : 0,
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// CLONE ENDPOINT — Duplicate a course
// ═══════════════════════════════════════════════════════════════════
router.post('/clone/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const Course = (await import('../models/Course.js')).default;

    const original = await Course.findById(courseId).lean();
    if (!original) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Remove MongoDB metadata
    delete original._id;
    delete original.__v;
    delete original.createdAt;
    delete original.updatedAt;

    // Set new metadata
    original.title = title || `${original.title} (Copy)`;
    original.slug = slugify(original.title) + '-' + Date.now().toString(36);
    original.status = 'draft';
    original.isPublished = false;
    original.views = 0;
    original.uniqueViews = 0;
    original.enrollments = 0;
    original.completions = 0;

    const cloned = new Course(original);
    cloned.createdAt = new Date();
    cloned.updatedAt = new Date();
    await cloned.save();

    res.json({ success: true, course: cloned });

  } catch (error) {
    console.error('Clone course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// BACKUP/EXPORT ENDPOINT — Full course export with metadata
// ═══════════════════════════════════════════════════════════════════
router.get('/export/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const { courseId } = req.params;
    const Course = (await import('../models/Course.js')).default;

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add export metadata
    const exportData = {
      _exportVersion: 1,
      _exportDate: new Date().toISOString(),
      _platform: 'CounselorReady',
      ...course
    };

    // Remove server-specific fields
    delete exportData._id;
    delete exportData.__v;

    res.json(exportData);

  } catch (error) {
    console.error('Export course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// RESEARCH-TO-COURSE PIPELINE — Scholarly database search + synthesis
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/course-builder/research/search
 * Search scholarly databases (CrossRef + OpenAlex) for articles on a topic.
 */
router.post('/research/search', protect, adminOnly, async (req, res) => {
  try {
    const { query, yearFrom = 2015, limit = 15, sources = 'both' } = req.body;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({ error: 'Search query must be at least 3 characters' });
    }

    const articles = await searchScholarlyDatabases(query, {
      yearFrom: parseInt(yearFrom),
      limit: parseInt(limit),
      sources
    });

    res.json({
      query,
      totalResults: articles.length,
      articles
    });
  } catch (error) {
    console.error('Research search error:', error);
    res.status(500).json({ error: 'Scholarly database search failed: ' + error.message });
  }
});

/**
 * POST /api/course-builder/research/synthesize
 * Run meta-analysis or comparative analysis on selected articles.
 * Body: { topic, articles: [...], analysisType: 'meta-analysis' | 'comparative' }
 */
router.post('/research/synthesize', protect, adminOnly, async (req, res) => {
  try {
    const { topic, articles, analysisType = 'meta-analysis' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    if (!articles || articles.length < 3) {
      return res.status(400).json({ error: 'At least 3 articles are required for synthesis' });
    }
    if (articles.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 articles for synthesis' });
    }

    let synthesis;
    if (analysisType === 'comparative') {
      synthesis = await synthesizeComparativeAnalysis(articles, topic);
    } else {
      synthesis = await synthesizeMetaAnalysis(articles, topic);
    }

    res.json({
      topic,
      analysisType,
      articleCount: articles.length,
      synthesis
    });
  } catch (error) {
    console.error('Research synthesis error:', error);
    res.status(500).json({ error: 'Research synthesis failed: ' + error.message });
  }
});

/**
 * POST /api/course-builder/research/generate-course
 * Generate a full CEU course from a completed synthesis.
 * Body: { synthesis, articles, ceHours, level }
 */
router.post('/research/generate-course', protect, adminOnly, async (req, res) => {
  try {
    const { synthesis, articles, ceHours = 2, level = 'Intermediate' } = req.body;

    if (!synthesis) {
      return res.status(400).json({ error: 'Synthesis data is required' });
    }
    if (!articles || articles.length === 0) {
      return res.status(400).json({ error: 'Source articles are required' });
    }

    const course = await generateCourseFromSynthesis(synthesis, articles, {
      ceHours: parseFloat(ceHours),
      level
    });

    // Add platform metadata
    course.slug = slugify(course.title);
    course.ceHours = parseFloat(ceHours);
    course.level = level;
    course.category = course.contentAreas?.[0] || 'Research & Program Evaluation';
    course.deliveryMethod = 'online';
    course.isPublished = false;
    course.status = 'draft';
    course.generatedFrom = 'research-synthesis';
    course.acepProvider = { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' };
    course.presenter = {
      name: 'CounselorReady',
      credentials: 'NBCC ACEP #7760',
      qualificationStatement: 'Content synthesized from peer-reviewed research by licensed mental health professionals.'
    };
    course._wordCount = countCourseWords(course);
    course._requiredWords = ceHours * WORDS_PER_CE_HOUR;

    res.json(course);
  } catch (error) {
    console.error('Research course generation error:', error);
    res.status(500).json({ error: 'Course generation failed: ' + error.message });
  }
});

/**
 * POST /api/course-builder/research/auto-build
 * One-click: search → synthesize → generate course.
 * Body: { topic, analysisType, ceHours, level, yearFrom }
 */
router.post('/research/auto-build', protect, adminOnly, async (req, res) => {
  try {
    const {
      topic,
      analysisType = 'meta-analysis',
      ceHours = 2,
      level = 'Intermediate',
      yearFrom = 2015
    } = req.body;

    if (!topic || topic.trim().length < 3) {
      return res.status(400).json({ error: 'Topic must be at least 3 characters' });
    }

    // Step 1: Fetch articles
    const articles = await fetchArticlesForSynthesis(topic, {
      yearFrom: parseInt(yearFrom),
      minArticles: 5,
      maxArticles: 12
    });

    if (articles.length < 3) {
      return res.status(404).json({
        error: `Only found ${articles.length} articles. At least 3 are needed for synthesis.`,
        articles
      });
    }

    // Step 2: Synthesize
    let synthesis;
    if (analysisType === 'comparative') {
      synthesis = await synthesizeComparativeAnalysis(articles, topic);
    } else {
      synthesis = await synthesizeMetaAnalysis(articles, topic);
    }

    // Step 3: Generate course
    const course = await generateCourseFromSynthesis(synthesis, articles, {
      ceHours: parseFloat(ceHours),
      level
    });

    // Add platform metadata
    course.slug = slugify(course.title);
    course.ceHours = parseFloat(ceHours);
    course.level = level;
    course.category = course.contentAreas?.[0] || 'Research & Program Evaluation';
    course.deliveryMethod = 'online';
    course.isPublished = false;
    course.status = 'draft';
    course.generatedFrom = 'research-synthesis';
    course.acepProvider = { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' };

    res.json({
      articles: articles.map(a => ({ title: a.title, authors: a.authors, year: a.year, journal: a.journal, doi: a.doi })),
      synthesis,
      course
    });
  } catch (error) {
    console.error('Auto-build error:', error);
    res.status(500).json({ error: 'Auto-build failed: ' + error.message });
  }
});

export default router;
