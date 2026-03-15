/**
 * Research Ready CE Routes
 * Search, currency check, CE build, admin queue, completion.
 */

import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import { searchArticles } from '../services/openAlex.js';
import { checkCurrency } from '../services/currencyCheck.js';
import { buildCE } from '../services/ceBuild.js';
import { generateSyllabus } from '../services/syllabusGenerator.js';
import { calculateCEHours, calculateResearchHours } from '../services/openAlex.js';
import ResearchReadyCourse from '../models/ResearchReadyCourse.js';
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';

const router = express.Router();

// Extend timeout for AI routes
router.use((req, res, next) => {
  req.setTimeout(120000);
  res.setTimeout(120000);
  next();
});

// ─── CONTENT AREA ABBREVIATIONS ────────────────────────────────
const CONTENT_AREA_ABBREVS = {
  'Supervision': 'SUP',
  'Ethics': 'ETH',
  'Trauma': 'TRM',
  'Clinical Application': 'CLN',
  'Research Methods': 'RSM',
  'Research Literacy': 'RSL',
  'Cultural Diversity': 'DIV',
  'Telehealth': 'TEL',
  'Substance Abuse': 'SAB',
  'Professional Development': 'PRD',
  'Assessment': 'ASM',
  'Treatment': 'TRT',
  'General': 'GEN'
};

function getContentAreaAbbrev(contentAreas) {
  if (!contentAreas || contentAreas.length === 0) return 'GEN';
  const first = contentAreas[0];
  for (const [key, abbrev] of Object.entries(CONTENT_AREA_ABBREVS)) {
    if (first.toLowerCase().includes(key.toLowerCase())) return abbrev;
  }
  return 'GEN';
}

function generateCertificateId(contentAreas) {
  const abbrev = getContentAreaAbbrev(contentAreas);
  const year = new Date().getFullYear();
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `CR-${abbrev}-${year}-${rand}`;
}

// ═══════════════════════════════════════════════════════════════
// GET /api/research-ready/search
// ═══════════════════════════════════════════════════════════════
router.get('/search', protect, async (req, res) => {
  try {
    const {
      q, year_from = 2020, sort = 'publication_date:desc',
      page = 1, per_page = 8, desired_hours
    } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const results = await searchArticles({
      q,
      year_from: parseInt(year_from),
      sort,
      page: parseInt(page),
      per_page: parseInt(per_page),
      desired_hours: desired_hours || null
    });

    res.json(results);
  } catch (error) {
    console.error('Research Ready search error:', error.message);
    if (error.message.includes('OpenAlex')) {
      return res.status(502).json({ error: 'OpenAlex API is currently unreachable. Please try again later.' });
    }
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/research-ready/currency-check
// ═══════════════════════════════════════════════════════════════
router.post('/currency-check', protect, requireAdmin, async (req, res) => {
  try {
    const { title, authors, journal, year, abstract, topic } = req.body;

    if (!title || !year) {
      return res.status(400).json({ error: 'Title and year are required' });
    }

    const result = await checkCurrency({ title, authors, journal, year, abstract, topic });
    res.json(result);
  } catch (error) {
    console.error('Currency check error:', error.message);
    res.status(500).json({
      error: 'Currency check failed: ' + error.message,
      retryable: true
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/research-ready/build-ce
// ═══════════════════════════════════════════════════════════════
router.post('/build-ce', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title, authors, journal, year, abstract, topic,
      wordCount, ceHours, researchHours, format = 'standalone',
      oaUrl, doi, currencyVerdict, pairedArticle
    } = req.body;

    if (!title || !wordCount) {
      return res.status(400).json({ error: 'Title and wordCount are required' });
    }

    const ceContent = await buildCE({
      title, authors, journal, year, abstract, topic,
      wordCount, ceHours, researchHours, format
    });

    // Save to database
    const course = new ResearchReadyCourse({
      title, authors, journal, year, abstract, doi: doi || '', oaUrl: oaUrl || '',
      wordCount, ceHours, researchHours,
      contentAreas: ceContent.content_areas,
      objectives: ceContent.objectives,
      questions: ceContent.questions,
      format,
      pairedArticle: pairedArticle || null,
      status: 'pending_review',
      currencyVerdict: currencyVerdict || null,
      certificateIdPrefix: `CR-${getContentAreaAbbrev(ceContent.content_areas)}-${new Date().getFullYear()}`
    });

    await course.save();

    res.json({
      courseId: course._id,
      contentAreas: ceContent.content_areas,
      objectives: ceContent.objectives,
      questionCount: ceContent.questions.length,
      status: 'pending_review'
    });
  } catch (error) {
    console.error('CE build error:', error.message);
    res.status(500).json({
      error: 'CE build failed: ' + error.message,
      retryable: true
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/research-ready/queue
// ═══════════════════════════════════════════════════════════════
router.get('/queue', protect, requireAdmin, async (req, res) => {
  try {
    const courses = await ResearchReadyCourse.find({
      status: { $in: ['pending_review', 'approved', 'live'] }
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ courses });
  } catch (error) {
    console.error('Queue fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/research-ready/course/:id  (for learner posttest)
// ═══════════════════════════════════════════════════════════════
router.get('/course/:id', protect, async (req, res) => {
  try {
    const course = await ResearchReadyCourse.findOne({
      _id: req.params.id,
      status: 'live'
    }).lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found or not yet available' });
    }

    // Strip correct answers and rationales for learner view
    const safeQuestions = course.questions.map(q => ({
      tag: q.tag,
      question: q.question,
      options: q.options
    }));

    res.json({
      ...course,
      questions: safeQuestions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// ═══════════════════════════════════════════════════════════════
// PATCH /api/research-ready/queue/:id/approve
// ═══════════════════════════════════════════════════════════════
router.patch('/queue/:id/approve', protect, requireAdmin, async (req, res) => {
  try {
    const course = await ResearchReadyCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.status = 'live';
    course.approvedAt = new Date();
    course.approvedBy = req.user.id;
    await course.save();

    res.json({ message: 'Course approved and now live', courseId: course._id });
  } catch (error) {
    console.error('Approve error:', error.message);
    res.status(500).json({ error: 'Failed to approve course' });
  }
});

// ═══════════════════════════════════════════════════════════════
// PATCH /api/research-ready/queue/:id/reject
// ═══════════════════════════════════════════════════════════════
router.patch('/queue/:id/reject', protect, requireAdmin, async (req, res) => {
  try {
    const course = await ResearchReadyCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.status = 'rejected';
    course.rejectionNote = req.body.rejectionNote || '';
    await course.save();

    res.json({ message: 'Course rejected', courseId: course._id });
  } catch (error) {
    console.error('Reject error:', error.message);
    res.status(500).json({ error: 'Failed to reject course' });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/research-ready/complete
// ═══════════════════════════════════════════════════════════════
router.post('/complete', protect, async (req, res) => {
  try {
    const { courseId, answers, timeSpent } = req.body;
    const userId = req.user.id;

    if (!courseId || !answers) {
      return res.status(400).json({ error: 'courseId and answers are required' });
    }

    const course = await ResearchReadyCourse.findOne({ _id: courseId, status: 'live' });
    if (!course) {
      return res.status(404).json({ error: 'Course not found or not available' });
    }

    // Score the assessment
    let correctCount = 0;
    for (let i = 0; i < course.questions.length; i++) {
      if (answers[i] === course.questions[i].correct) {
        correctCount++;
      }
    }
    const score = Math.round((correctCount / course.questions.length) * 100);
    const passed = score >= 75;

    if (!passed) {
      return res.json({
        passed: false,
        score,
        correctCount,
        totalQuestions: course.questions.length,
        message: 'A score of 75% or higher is required to pass. Please review the article and try again.'
      });
    }

    // Generate certificate ID
    const certificateId = generateCertificateId(course.contentAreas);
    const completionDate = new Date();

    // Generate syllabus DOCX
    let syllabusUrl = '';
    try {
      syllabusUrl = await generateSyllabus({
        course, answers, score, certificateId, completionDate
      });
    } catch (syllabusErr) {
      console.error('Syllabus generation error:', syllabusErr.message);
      // Continue even if syllabus fails — cert still valid
    }

    // Write to Certificate collection
    const certificate = new Certificate({
      userId,
      courseId: course._id,
      title: course.title,
      provider: 'CounselorReady',
      completionDate,
      ceHours: course.ceHours,
      category: course.contentAreas[0] || 'General',
      nbccApproved: true,
      acepNumber: '7760',
      approvingBody: 'NBCC',
      approvalNumber: '7760',
      applicability: 'national',
      certificateNumber: certificateId,
      source: 'platform',
      fileUrl: syllabusUrl,
      notes: JSON.stringify({
        type: 'research_ready',
        articleTitle: course.title,
        authors: course.authors,
        journal: course.journal,
        year: course.year,
        doi: course.doi,
        wordCount: course.wordCount,
        ceCalcFormula: `${course.wordCount} words / 6,000 words/hr = ${(course.wordCount / 6000).toFixed(2)} -> ${course.ceHours} CE hr(s)`,
        researchHours: course.researchHours,
        objectivesMet: course.objectives,
        assessmentScore: score,
        nbccAcepStamp: 'NBCC ACEP #7760',
        passingScore: '75%',
        syllabusUrl
      })
    });

    await certificate.save();

    // Award CE hours to user's credentials (CE Planner integration)
    try {
      const credentials = await UserCredential.find({ userId, status: { $in: ['active', 'expiring_soon'] } });
      for (const cred of credentials) {
        const matchingReq = cred.requirements.find(r =>
          course.contentAreas.some(ca =>
            ca.toLowerCase().includes(r.category.toLowerCase()) ||
            r.category.toLowerCase().includes(ca.toLowerCase())
          )
        );

        if (matchingReq || cred.requirements.length > 0) {
          cred.ceuLogs.push({
            date: completionDate,
            hours: course.ceHours,
            category: course.contentAreas[0] || 'General',
            source: 'internal',
            courseId: course._id,
            certificateId: certificate._id,
            description: `Research Ready CE: ${course.title}`,
            provider: 'CounselorReady'
          });
          cred.totalCEUsCompleted = (cred.totalCEUsCompleted || 0) + course.ceHours;
          await cred.save();
        }
      }
    } catch (credErr) {
      console.error('CE Planner update error:', credErr.message);
      // Non-fatal — certificate is still valid
    }

    res.json({
      passed: true,
      score,
      certificateId,
      syllabusUrl,
      completionDate,
      ceHours: course.ceHours
    });
  } catch (error) {
    console.error('Completion error:', error.message);
    res.status(500).json({ error: 'Completion processing failed: ' + error.message });
  }
});

export default router;
