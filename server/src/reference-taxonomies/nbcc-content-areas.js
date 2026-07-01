/**
 * NBCC Content Areas — Reference Taxonomy
 *
 * Maps the InteractiveCourse.nbccContentAreas[] schema's abbreviated
 * names to NBCC's official Section G content area names from the
 * NBCC Provider Policy.
 *
 * The schema stores the abbreviated `code` for compact UI display.
 * Use `officialName(code)` when generating certificates, audit reports,
 * or any artifact that needs NBCC's exact official wording.
 *
 * Related-area logic powers the platform's content-overlap-prevention
 * feature (preventing users from taking courses that repeat content
 * they've already covered).
 */

export const NBCC_CONTENT_AREAS = [
  {
    code: 'Counseling Theory/Practice',
    officialName: 'Counseling Theory/Practice and the Counseling Relationship',
    description: 'Theoretical foundations of counseling and the therapeutic relationship. Covers counseling theories, counselor-client dynamics, helping skills, and evidence-based practice.',
    relatedAreas: ['Group Dynamics', 'Professional Identity']
  },
  {
    code: 'Human Growth and Development',
    officialName: 'Human Growth and Development',
    description: 'Lifespan development, learning theories, personality development, biopsychosocial factors influencing client behavior.',
    relatedAreas: ['Wellness and Prevention']
  },
  {
    code: 'Social and Cultural Foundations',
    officialName: 'Social and Cultural Foundations',
    description: 'Multicultural counseling, social and cultural diversity, intersectionality, equity, and social justice in counseling practice.',
    relatedAreas: ['Professional Identity', 'Wellness and Prevention']
  },
  {
    code: 'Group Dynamics',
    officialName: 'Group Dynamics and Counseling',
    description: 'Group counseling theory and practice, group facilitation, group process, group ethics.',
    relatedAreas: ['Counseling Theory/Practice']
  },
  {
    code: 'Career Development',
    officialName: 'Career Development and Counseling',
    description: 'Career theories, career assessment, career counseling techniques, employment trends.',
    relatedAreas: ['Assessment', 'Human Growth and Development']
  },
  {
    code: 'Assessment',
    officialName: 'Assessment',
    description: 'Psychological and behavioral assessment, testing principles, diagnostic skills, assessment ethics.',
    relatedAreas: ['Career Development', 'Research/Program Evaluation']
  },
  {
    code: 'Research/Program Evaluation',
    officialName: 'Research and Program Evaluation',
    description: 'Research methodology, program evaluation, evidence-based practice, statistical literacy.',
    relatedAreas: ['Assessment']
  },
  {
    code: 'Professional Identity',
    officialName: 'Counselor Professional Identity and Practice Issues',
    description: 'Professional ethics, legal issues, scope of practice, professional development, supervision, advocacy.',
    relatedAreas: ['Counseling Theory/Practice', 'Social and Cultural Foundations']
  },
  {
    code: 'Wellness and Prevention',
    officialName: 'Wellness and Prevention',
    description: 'Wellness models, prevention programming, mental health promotion, self-care, vicarious trauma.',
    relatedAreas: ['Human Growth and Development', 'Social and Cultural Foundations']
  }
];

/**
 * Get the official long-form NBCC name for an abbreviated code.
 * @param {string} code - The abbreviated name as stored in InteractiveCourse.nbccContentAreas
 * @returns {string} Official NBCC Provider Policy name, or the code itself if unmatched
 */
export const officialName = (code) => {
  const area = NBCC_CONTENT_AREAS.find(a => a.code === code);
  return area ? area.officialName : code;
};

/**
 * Get the description for an area code.
 * @param {string} code
 * @returns {string|null}
 */
export const description = (code) => {
  const area = NBCC_CONTENT_AREAS.find(a => a.code === code);
  return area ? area.description : null;
};

/**
 * Get codes for areas related to the given code (for overlap detection
 * and recommendation logic).
 * @param {string} code
 * @returns {string[]}
 */
export const relatedAreas = (code) => {
  const area = NBCC_CONTENT_AREAS.find(a => a.code === code);
  return area ? area.relatedAreas : [];
};

/**
 * All valid codes (matches the InteractiveCourse.nbccContentAreas enum).
 * @returns {string[]}
 */
export const allCodes = () => NBCC_CONTENT_AREAS.map(a => a.code);
