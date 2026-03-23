/**
 * Researched-N-Ready CE Routes
 * Learner-driven flow:
 *   1. Learner picks content area + hours → AI searches OpenAlex
 *   2. Learner selects 2-3 articles → submits request
 *   3. Admin gets notified → approves
 *   4. AI generates posttest from those articles
 *   5. Learner reads articles, takes test → certificate + syllabus
 */

import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import { searchArticles } from '../services/openAlex.js';
import { checkCurrency } from '../services/currencyCheck.js';
import { buildCE } from '../services/ceBuild.js';
import { generateSyllabus } from '../services/syllabusGenerator.js';
import RNRRequest from '../models/RNRRequest.js';
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';
import User from '../models/User.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import { sendCourseCompletionEmail } from '../services/courseEmailService.js';
import { sendCompletionSMS } from '../services/smsService.js';

const router = express.Router();

router.use((req, res, next) => {
  req.setTimeout(120000);
  res.setTimeout(120000);
  next();
});

// ── Content area abbreviations for certificate IDs ──
const CONTENT_AREA_ABBREVS = {
  'Supervision': 'SUP', 'Ethics': 'ETH', 'Trauma': 'TRM',
  'Clinical Application': 'CLN', 'Clinical': 'CLN',
  'Research Methods': 'RSM', 'Research Literacy': 'RSL', 'Research': 'RSH',
  'Cultural Diversity': 'DIV', 'Telehealth': 'TEL',
  'Substance Abuse': 'SAB', 'Professional Development': 'PRD',
  'Assessment': 'ASM', 'Treatment': 'TRT', 'General': 'GEN'
};

function getAbbrev(area) {
  if (!area) return 'GEN';
  for (const [key, val] of Object.entries(CONTENT_AREA_ABBREVS)) {
    if (area.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 'GEN';
}

function generateCertId(area) {
  const abbrev = getAbbrev(area);
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `CR-${abbrev}-${new Date().getFullYear()}-${rand}`;
}

function calculateCE(totalWords) {
  const raw = totalWords / 6000;
  return Math.floor(raw * 2) / 2; // round down to nearest 0.5
}


// ═══════════════════════════════════════════════════════════════
// STEP 1: LEARNER SEARCHES — AI finds articles from OpenAlex
// GET /api/research-ready/search
// ═══════════════════════════════════════════════════════════════
router.get('/search', protect, async (req, res) => {
  try {
    const {
      q, contentArea, desiredHours,
      year_from = 2020, page = 1, per_page = 10
    } = req.query;

    if (!q && !contentArea) {
      return res.status(400).json({ error: 'Provide a search query (q) or content area' });
    }

    const searchTerm = q || contentArea;

    const results = await searchArticles({
      q: searchTerm,
      year_from: parseInt(year_from),
      sort: 'publication_date:desc',
      page: parseInt(page),
      per_page: parseInt(per_page),
      desired_hours: desiredHours || null
    });

    res.json(results);
  } catch (error) {
    console.error('RNR search error:', error.message);
    if (error.message.includes('OpenAlex')) {
      return res.status(502).json({ error: 'OpenAlex API is currently unreachable. Try again later.' });
    }
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
});


// ═══════════════════════════════════════════════════════════════
// STEP 2: LEARNER SUBMITS SELECTION — picks 2-3 articles
// POST /api/research-ready/request
// ═══════════════════════════════════════════════════════════════
router.post('/request', protect, async (req, res) => {
  try {
    const { contentArea, desiredHours, articles } = req.body;
    const userId = req.user._id;

    if (!contentArea || !desiredHours) {
      return res.status(400).json({ error: 'contentArea and desiredHours are required' });
    }
    if (!articles || !Array.isArray(articles) || articles.length < 1 || articles.length > 4) {
      return res.status(400).json({ error: 'Select 1-4 articles' });
    }

    // Calculate totals
    const totalWords = articles.reduce((sum, a) => sum + (a.wordCount || 0), 0);
    const ceHours = calculateCE(totalWords);
    const researchHours = Math.round(ceHours * 0.5 * 10) / 10;

    if (ceHours < 0.5) {
      return res.status(400).json({
        error: `Combined word count (${totalWords.toLocaleString()}) yields less than 0.5 CE hours. Select longer articles or add more.`
      });
    }

    const user = await User.findById(userId).select('email profile.firstName profile.lastName');
    const userName = `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim();

    const request = new RNRRequest({
      user: userId,
      userName,
      userEmail: user?.email,
      contentArea,
      desiredHours: parseFloat(desiredHours),
      selectedArticles: articles.map(a => ({
        openAlexId: a.openAlexId || a.id || '',
        title: a.title,
        authors: a.authors || '',
        journal: a.journal || '',
        year: a.year,
        abstract: a.abstract || '',
        doi: a.doi || '',
        oaUrl: a.oaUrl || '',
        topic: a.topic || '',
        wordCount: a.wordCount || 0,
        ceHours: a.ceHours || 0,
        researchHours: a.researchHours || 0,
        citedByCount: a.citedByCount || 0,
        wcStatus: a.wcStatus || 'sufficient'
      })),
      totalWordCount: totalWords,
      totalCeHours: ceHours,
      totalResearchHours: researchHours,
      status: 'pending'
    });

    await request.save();

    // Notify admin
    logActivity(ACTIVITY_TYPES.USER_ENROLLED, {
      courseName: `RNR CE Request: ${contentArea} (${ceHours} hrs)`,
      details: `${userName} selected ${articles.length} articles: ${articles.map(a => a.title).join('; ')}`
    }, { userId, userName, userEmail: user?.email }).catch(() => {});

    res.status(201).json({
      success: true,
      requestId: request._id,
      ceHours,
      researchHours,
      totalWordCount: totalWords,
      articleCount: articles.length,
      status: 'pending',
      message: 'Your RNR CE request has been submitted for review. You\'ll be notified when your posttest is ready.'
    });
  } catch (error) {
    console.error('RNR request error:', error.message);
    res.status(500).json({ error: 'Failed to submit request: ' + error.message });
  }
});


// ═══════════════════════════════════════════════════════════════
// LEARNER: VIEW MY REQUESTS
// GET /api/research-ready/my-requests
// ═══════════════════════════════════════════════════════════════
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await RNRRequest.find({ user: req.user._id })
      .select('-questions.correct -questions.rationale')
      .sort({ createdAt: -1 })
      .lean();

    // For test_ready / in_progress, include questions without answers
    const safe = requests.map(r => {
      if (r.status === 'test_ready' || r.status === 'in_progress') {
        r.questions = (r.questions || []).map(q => ({
          tag: q.tag,
          question: q.question,
          options: q.options
        }));
      }
      return r;
    });

    res.json({ requests: safe });
  } catch (error) {
    console.error('My requests error:', error.message);
    res.status(500).json({ error: 'Failed to load requests' });
  }
});


// ═══════════════════════════════════════════════════════════════
// STEP 3: ADMIN VIEWS QUEUE
// GET /api/research-ready/queue
// ═══════════════════════════════════════════════════════════════
router.get('/queue', protect, requireAdmin, async (req, res) => {
  try {
    const requests = await RNRRequest.find({
      status: { $in: ['pending', 'approved', 'test_ready', 'in_progress'] }
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ requests });
  } catch (error) {
    console.error('Queue error:', error.message);
    res.status(500).json({ error: 'Failed to load queue' });
  }
});


// ═══════════════════════════════════════════════════════════════
// STEP 4: ADMIN APPROVES → triggers AI test generation
// PATCH /api/research-ready/request/:id/approve
// ═══════════════════════════════════════════════════════════════
router.patch('/request/:id/approve', protect, requireAdmin, async (req, res) => {
  try {
    const request = await RNRRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ error: `Cannot approve — status is ${request.status}` });
    }

    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    await request.save();

    // Build the test in background
    res.json({ success: true, message: 'Approved. Generating posttest...', requestId: request._id });

    // AI generates test (async — don't block response)
    try {
      const combinedTitle = request.selectedArticles.map(a => a.title).join(' | ');
      const combinedAbstract = request.selectedArticles.map(a => a.abstract || '').filter(Boolean).join('\n\n');
      const combinedAuthors = request.selectedArticles.map(a => a.authors).filter(Boolean).join('; ');

      const ceContent = await buildCE({
        title: combinedTitle,
        authors: combinedAuthors,
        journal: request.selectedArticles[0]?.journal || '',
        year: request.selectedArticles[0]?.year || new Date().getFullYear(),
        abstract: combinedAbstract,
        topic: request.contentArea,
        wordCount: request.totalWordCount,
        ceHours: request.totalCeHours,
        researchHours: request.totalResearchHours,
        format: request.selectedArticles.length > 1 ? 'comparative' : 'standalone'
      });

      request.courseTitle = ceContent.course_title || '';
      request.objectives = ceContent.objectives || [];
      request.questions = ceContent.questions || [];
      request.status = 'test_ready';
      request.testGeneratedAt = new Date();
      await request.save();

      // Notify learner that test is ready
      logActivity(ACTIVITY_TYPES.COURSE_STARTED, {
        courseName: `RNR CE: ${request.contentArea} — test ready`,
        details: `${request.questions.length} questions generated for ${request.userName}`
      }, {
        userId: request.user,
        userName: request.userName,
        userEmail: request.userEmail
      }).catch(() => {});

      console.log(`[RNR] Test generated for request ${request._id} — ${request.questions.length} questions`);
    } catch (buildErr) {
      console.error(`[RNR] Test build failed for ${request._id}:`, buildErr.message);
      // Don't revert approval — admin can retry
    }
  } catch (error) {
    console.error('Approve error:', error.message);
    res.status(500).json({ error: 'Failed to approve: ' + error.message });
  }
});


// ═══════════════════════════════════════════════════════════════
// ADMIN: REJECT REQUEST
// PATCH /api/research-ready/request/:id/reject
// ═══════════════════════════════════════════════════════════════
router.patch('/request/:id/reject', protect, requireAdmin, async (req, res) => {
  try {
    const request = await RNRRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = 'rejected';
    request.rejectionNote = req.body.rejectionNote || '';
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    await request.save();

    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    console.error('Reject error:', error.message);
    res.status(500).json({ error: 'Failed to reject' });
  }
});


// ═══════════════════════════════════════════════════════════════
// ADMIN: RETRY TEST GENERATION (if AI build failed)
// POST /api/research-ready/request/:id/rebuild
// ═══════════════════════════════════════════════════════════════
router.post('/request/:id/rebuild', protect, requireAdmin, async (req, res) => {
  try {
    const request = await RNRRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.status !== 'approved') {
      return res.status(400).json({ error: 'Can only rebuild for approved requests without a test' });
    }

    const combinedTitle = request.selectedArticles.map(a => a.title).join(' | ');
    const combinedAbstract = request.selectedArticles.map(a => a.abstract || '').filter(Boolean).join('\n\n');

    const ceContent = await buildCE({
      title: combinedTitle,
      authors: request.selectedArticles.map(a => a.authors).filter(Boolean).join('; '),
      journal: request.selectedArticles[0]?.journal || '',
      year: request.selectedArticles[0]?.year || new Date().getFullYear(),
      abstract: combinedAbstract,
      topic: request.contentArea,
      wordCount: request.totalWordCount,
      ceHours: request.totalCeHours,
      researchHours: request.totalResearchHours,
      format: request.selectedArticles.length > 1 ? 'comparative' : 'standalone'
    });

    request.courseTitle = ceContent.course_title || '';
    request.objectives = ceContent.objectives || [];
    request.questions = ceContent.questions || [];
    request.status = 'test_ready';
    request.testGeneratedAt = new Date();
    await request.save();

    res.json({ success: true, message: 'Test regenerated', questionCount: request.questions.length });
  } catch (error) {
    console.error('Rebuild error:', error.message);
    res.status(500).json({ error: 'Rebuild failed: ' + error.message });
  }
});


// ═══════════════════════════════════════════════════════════════
// STEP 5: LEARNER TAKES POSTTEST
// POST /api/research-ready/request/:id/complete
// ═══════════════════════════════════════════════════════════════
router.post('/request/:id/complete', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user._id;

    const request = await RNRRequest.findOne({
      _id: req.params.id,
      user: userId,
      status: { $in: ['test_ready', 'in_progress'] }
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found or test not ready' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers are required' });
    }

    // Score
    let correctCount = 0;
    for (let i = 0; i < request.questions.length; i++) {
      if (parseInt(answers[i]) === request.questions[i].correct) {
        correctCount++;
      }
    }
    const score = Math.round((correctCount / request.questions.length) * 100);
    const passed = score >= 75;

    // Record attempt
    const attemptNumber = (request.posttestAttempts?.length || 0) + 1;
    request.posttestAttempts.push({ attemptNumber, answers, score, passed, attemptedAt: new Date() });
    if (score > request.bestScore) request.bestScore = score;

    if (!passed) {
      request.status = 'in_progress';
      await request.save();
      return res.json({
        passed: false,
        score,
        correctCount,
        totalQuestions: request.questions.length,
        attemptsUsed: request.posttestAttempts.length,
        message: '75% required. Review the articles and try again.'
      });
    }

    // ── PASSED ──
    request.passed = true;
    request.status = 'completed';
    request.completedAt = new Date();

    // Generate certificate ID
    const certificateNumber = generateCertId(request.contentArea);
    request.certificateNumber = certificateNumber;

    // Generate syllabus
    let syllabusUrl = '';
    try {
      syllabusUrl = await generateSyllabus({
        course: {
          courseTitle: request.courseTitle || '',
          title: request.selectedArticles.map(a => a.title).join(' & '),
          authors: request.selectedArticles.map(a => a.authors).join('; '),
          journal: request.selectedArticles.map(a => a.journal).join('; '),
          year: request.selectedArticles[0]?.year,
          doi: request.selectedArticles.map(a => a.doi).filter(Boolean).join('; '),
          wordCount: request.totalWordCount,
          ceHours: request.totalCeHours,
          researchHours: request.totalResearchHours,
          contentAreas: [request.contentArea],
          objectives: request.objectives,
          questions: request.questions
        },
        answers,
        score,
        certificateId: certificateNumber,
        completionDate: request.completedAt
      });
      request.syllabusUrl = syllabusUrl;
    } catch (syllErr) {
      console.error('Syllabus generation error:', syllErr.message);
    }

    // Create certificate
    const courseTitle = request.courseTitle || request.selectedArticles.map(a => a.title).join(' & ');

    const certificate = new Certificate({
      userId,
      title: `RNR CE: ${courseTitle}`,
      provider: 'CounselorReady',
      completionDate: request.completedAt,
      ceHours: request.totalCeHours,
      category: request.contentArea,
      nbccApproved: true,
      acepNumber: '7760',
      approvingBody: 'NBCC',
      approvalNumber: '#7760',
      applicability: 'national',
      certificateNumber,
      source: 'platform',
      fileUrl: syllabusUrl,
      notes: JSON.stringify({
        type: 'research_ready',
        courseTitle,
        articleTitles: request.selectedArticles.map(a => a.title),
        authors: request.selectedArticles.map(a => a.authors).join('; '),
        journals: request.selectedArticles.map(a => `${a.journal} (${a.year})`).join('; '),
        dois: request.selectedArticles.map(a => a.doi).filter(Boolean),
        wordCount: request.totalWordCount,
        ceCalcFormula: `${request.totalWordCount} words / 6,000 words/hr = ${(request.totalWordCount / 6000).toFixed(2)} → ${request.totalCeHours} CE hr(s)`,
        researchHours: request.totalResearchHours,
        objectivesMet: request.objectives,
        assessmentScore: score,
        correctCount,
        totalQuestions: request.questions.length,
        nbccAcepStamp: 'NBCC ACEP #7760',
        passingScore: '75%',
        syllabusUrl
      })
    });
    await certificate.save();

    request.certificate = certificate._id;
    await request.save();

    // Allocate CE to credentials
    try {
      const credentials = await UserCredential.find({
        userId,
        status: { $in: ['active', 'expiring_soon'] }
      });
      for (const cred of credentials) {
        const alreadyLogged = cred.ceuLogs.some(log =>
          log.certificateId && log.certificateId.toString() === certificate._id.toString()
        );
        if (alreadyLogged) continue;

        cred.ceuLogs.push({
          date: request.completedAt,
          hours: request.totalCeHours,
          category: request.contentArea,
          source: 'internal',
          certificateId: certificate._id,
          description: `RNR CE: ${request.selectedArticles.map(a => a.title).join(' & ')}`,
          provider: 'CounselorReady'
        });
        cred.totalCEUsCompleted = (cred.totalCEUsCompleted || 0) + request.totalCeHours;
        await cred.save();
      }
    } catch (credErr) {
      console.error('CE allocation error (non-fatal):', credErr.message);
    }

    // Notifications
    try {
      const rnrUser = await User.findById(userId).select('email profile.firstName profile.lastName phone smsOptIn');
      const uName = `${rnrUser?.profile?.firstName || ''} ${rnrUser?.profile?.lastName || ''}`.trim();
      logActivity(ACTIVITY_TYPES.COURSE_COMPLETED, {
        courseName: `RNR CE: ${request.contentArea}`,
        ceHours: request.totalCeHours,
        details: `Score: ${score}%, Certificate: ${certificateNumber}`
      }, { userId, userName: uName, userEmail: rnrUser?.email }).catch(() => {});
      logActivity(ACTIVITY_TYPES.CERTIFICATE_GENERATED, {
        courseName: `RNR CE: ${request.contentArea}`
      }, { userId, userName: uName, userEmail: rnrUser?.email }).catch(() => {});
      sendCourseCompletionEmail(userId, null, certificate._id).catch(() => {});
      sendCompletionSMS(
        { phone: rnrUser?.phone, firstName: rnrUser?.profile?.firstName, smsOptIn: rnrUser?.smsOptIn },
        { title: `RNR CE: ${request.contentArea}`, ceHours: request.totalCeHours },
        certificate
      ).catch(() => {});
    } catch (notifErr) {
      console.error('RNR notification error:', notifErr.message);
    }

    res.json({
      passed: true,
      score,
      certificateNumber,
      ceHours: request.totalCeHours,
      researchHours: request.totalResearchHours,
      syllabusUrl,
      completionDate: request.completedAt,
      message: 'Congratulations! Your CE certificate has been generated.'
    });
  } catch (error) {
    console.error('Completion error:', error.message);
    res.status(500).json({ error: 'Completion failed: ' + error.message });
  }
});


// ═══════════════════════════════════════════════════════════════
// LEARNER: GET SPECIFIC REQUEST (for taking test)
// GET /api/research-ready/request/:id
// ═══════════════════════════════════════════════════════════════
router.get('/request/:id', protect, async (req, res) => {
  try {
    const request = await RNRRequest.findOne({
      _id: req.params.id,
      user: req.user._id
    }).lean();

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Strip correct answers if test not completed
    if (request.status !== 'completed') {
      request.questions = (request.questions || []).map(q => ({
        tag: q.tag,
        question: q.question,
        options: q.options
      }));
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load request' });
  }
});


// ═══════════════════════════════════════════════════════════════
// CE PLANNER INTEGRATION
// GET /api/research-ready/recommendations
// ═══════════════════════════════════════════════════════════════
router.get('/recommendations', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const credentials = await UserCredential.find({ userId, status: { $ne: 'renewed' } });
    if (!credentials.length) {
      return res.json({ recommendations: [], message: 'Add credentials to get recommendations.' });
    }

    const gaps = [];
    for (const cred of credentials) {
      const remaining = cred.getRemainingHours ? cred.getRemainingHours() : [];
      for (const r of remaining) {
        if (r.remaining > 0) {
          gaps.push({ category: r.category, hoursNeeded: r.remaining, credentialName: cred.name });
        }
      }
    }

    if (!gaps.length) {
      return res.json({ recommendations: [], message: 'All CE requirements are met.' });
    }

    res.json({
      recommendations: gaps.map(g => ({
        category: g.category,
        hoursNeeded: g.hoursNeeded,
        credentialName: g.credentialName,
        suggestedSearch: g.category,
        suggestedHours: Math.min(g.hoursNeeded, 2.0)
      })),
      totalGaps: gaps.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});


export default router;
