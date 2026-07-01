/**
 * ACA Code of Ethics (2014) — Reference Taxonomy
 *
 * Maps the InteractiveCourse.acaCodeSections[] schema's subsection codes
 * to their section-level rollup and topic descriptions.
 *
 * Schema stores compact subsection codes like 'A.1', 'B.6', 'F.4'.
 * Use these helpers when computing section-level rollups, related-section
 * detection for overlap prevention, or rendering audit reports.
 */

export const ACA_SECTIONS = [
  { letter: 'A', name: 'The Counseling Relationship' },
  { letter: 'B', name: 'Confidentiality and Privacy' },
  { letter: 'C', name: 'Professional Responsibility' },
  { letter: 'D', name: 'Relationships With Other Professionals' },
  { letter: 'E', name: 'Evaluation, Assessment, and Interpretation' },
  { letter: 'F', name: 'Supervision, Training, and Teaching' },
  { letter: 'G', name: 'Research and Publication' },
  { letter: 'H', name: 'Distance Counseling, Technology, and Social Media' },
  { letter: 'I', name: 'Resolving Ethical Issues' }
];

/**
 * Common subsections within each section. Not exhaustive — schema accepts
 * any A.N through I.N format, this object documents the typical ones.
 */
export const ACA_SUBSECTIONS = {
  'A': ['A.1', 'A.2', 'A.3', 'A.4', 'A.5', 'A.6', 'A.7', 'A.8', 'A.9', 'A.10', 'A.11', 'A.12'],
  'B': ['B.1', 'B.2', 'B.3', 'B.4', 'B.5', 'B.6', 'B.7'],
  'C': ['C.1', 'C.2', 'C.3', 'C.4', 'C.5', 'C.6', 'C.7'],
  'D': ['D.1', 'D.2'],
  'E': ['E.1', 'E.2', 'E.3', 'E.4', 'E.5', 'E.6', 'E.7', 'E.8', 'E.9', 'E.10', 'E.11', 'E.12', 'E.13'],
  'F': ['F.1', 'F.2', 'F.3', 'F.4', 'F.5', 'F.6', 'F.7', 'F.8', 'F.9', 'F.10', 'F.11'],
  'G': ['G.1', 'G.2', 'G.3', 'G.4', 'G.5'],
  'H': ['H.1', 'H.2', 'H.3', 'H.4', 'H.5', 'H.6'],
  'I': ['I.1', 'I.2']
};

/**
 * Get the section-level rollup for a subsection code.
 * @param {string} subsection - e.g. 'A.1', 'B.6'
 * @returns {string} Section letter (e.g. 'A', 'B')
 */
export const sectionLetter = (subsection) => {
  if (typeof subsection !== 'string') return '';
  return subsection.split('.')[0];
};

/**
 * Get the section topic name for a subsection code.
 * @param {string} subsection - e.g. 'A.1'
 * @returns {string|null}
 */
export const sectionName = (subsection) => {
  const letter = sectionLetter(subsection);
  const section = ACA_SECTIONS.find(s => s.letter === letter);
  return section ? section.name : null;
};

/**
 * Roll up an array of subsection codes to their unique section letters.
 * @param {string[]} subsections
 * @returns {string[]} Unique section letters, sorted
 */
export const rollupToSections = (subsections) => {
  if (!Array.isArray(subsections)) return [];
  const letters = new Set(subsections.map(sectionLetter).filter(Boolean));
  return Array.from(letters).sort();
};
