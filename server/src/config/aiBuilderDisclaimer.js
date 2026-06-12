/**
 * AI Course Builder — usage & failure disclaimer.
 *
 * Surface this BEFORE a partner runs their first generation (an explicit acknowledgement) and keep
 * the short version visible in the builder UI. Returned by the partner AI endpoints so the client
 * always renders the current text.
 */
export const AI_BUILDER_DISCLAIMER_VERSION = '1.0';

export const AI_BUILDER_DISCLAIMER = {
  version: AI_BUILDER_DISCLAIMER_VERSION,
  title: 'AI Course Builder — Usage & Limitations',
  short:
    'The AI Course Builder creates an editable draft, not a finished or compliance-verified course. ' +
    'It can be wrong — verify all content, citations, and answers, and have it reviewed before publishing. ' +
    'Generations draw from your monthly allowance based on actual processing cost.',
  sections: [
    {
      heading: 'Drafts, not finished courses',
      body:
        'The AI Course Builder produces a draft for you to review and edit. It is a starting point, ' +
        'not a publication-ready course.'
    },
    {
      heading: 'No compliance guarantee',
      body:
        'Generated content is not guaranteed to meet NBCC/ACEP requirements (including the ' +
        '6,000-words-per-CE-hour standard, knowledge-check distribution, or assessment rules). Any ' +
        "course that awards CE under CounselorReady's ACEP Provider #7760 must pass CounselorReady's " +
        'compliance review before it is published or listed.'
    },
    {
      heading: 'Verify everything',
      body:
        'AI can produce mistakes, outdated information, and fabricated or incorrect citations and ' +
        'assessment answers. All clinical content, references, and exam keys must be independently ' +
        'verified by a qualified professional before use.'
    },
    {
      heading: 'How your allowance is used',
      body:
        'Each generation draws from your monthly generation allowance based on the actual processing ' +
        'cost of that request — larger or more complex courses consume more. Your free monthly ' +
        'allowance resets at the start of each billing period and does not roll over; purchased ' +
        'credit packs do not expire. When your allowance is exhausted, generation is paused until the ' +
        'next reset or until you purchase additional credits.'
    },
    {
      heading: 'Failures and availability',
      body:
        'Generations can fail, time out, or be interrupted (for example, due to model errors, rate ' +
        'limits, or content filters). We do not charge your allowance for a generation that fails to ' +
        'produce a usable result. Per-request limits apply (large courses may need to be split), and ' +
        'the feature is provided "as is," with no guarantee of availability, output quality, or ' +
        'fitness for any particular purpose.'
    },
    {
      heading: 'Your responsibility',
      body:
        'You are solely responsible for the courses you create, publish, and sell using this tool, ' +
        'including their accuracy, legality, originality, and CE eligibility.'
    }
  ]
};

/** Plain-text rendering for emails, logs, or non-HTML surfaces. */
export function aiDisclaimerText() {
  const lines = [AI_BUILDER_DISCLAIMER.title, ''];
  for (const s of AI_BUILDER_DISCLAIMER.sections) {
    lines.push(`${s.heading}: ${s.body}`, '');
  }
  return lines.join('\n').trim();
}
