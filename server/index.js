/**
 * Researched-N-Ready CE Routes
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * Learner-driven flow:
 *   1. Learner picks content area + hours → AI searches OpenAlex
 *   2. Learner selects 2-3 articles → submits request
 *   3. Admin gets notified → approves
 *   4. AI generates 6,200+ word clinical article + posttest
 *   5. Learner reads generated content, takes test → certificate + syllabus
 */

import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import { searchArticles } from '../services/openAlex.js';
import { checkCurrency } from '../services/currencyCheck.js';
import { buildCE } from '../services/ceBuild.js';
import { generateArticleContent } from '../services/articleContentGenerator.js';
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
  req.setTimeout(180000); // 3 min for content generation
  res.setTimeout(180000);
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

    // NOTE: Pre-approval word counts are abstract-only estimates.
    // Real CE hours are calculated after AI generates the full article content.
    const totalWords = articles.reduce((sum, a) => sum + (a.wordCount || 0), 0);

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
      totalCeHours: 1, // Will be recalculated after content generation
      totalResearchHours: 0.5,
      status: 'pending'
    });

    await request.save();

    // Notify admin
    logActivity(ACTIVITY_TYPES.USER_ENROLLED, {
      courseName: `RNR CE Request: ${contentArea} (${desiredHours} hrs requested)`,
      details: `${userName} selected ${articles.length} articles: ${articles.map(a => a.title).join('; ')}`
    }, { userId, userName, userEmail: user?.email }).catch(() => {});

    res.status(201).json({
      success: true,
      requestId: request._id,
      desiredHours: parseFloat(desiredHours),
      articleCount: articles.length,
      status: 'pending',
      message: 'Your RNR CE request has been submitted for review. Once approved, a clinical practice article and posttest will be generated for you.'
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
// LEARNER: GET GENERATED ARTICLE CONTENT
// GET /api/research-ready/request/:id/content
// ═══════════════════════════════════════════════════════════════
router.get('/request/:id/content', protect, async (req, res) => {
  try {
    const request = await RNRRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: { $in: ['test_ready', 'in_progress', 'completed'] }
    }).lean();

    if (!request) {
      return res.status(404).json({ error: 'Request not found or content not yet available' });
    }

    if (!request.generatedContent) {
      return res.status(404).json({ error: 'Article content has not been generated yet' });
    }

    res.json({
      courseTitle: request.courseTitle,
      content: request.generatedContent,
      wordCount: request.generatedWordCount,
      ceHours: request.totalCeHours,
      researchHours: request.totalResearchHours,
      contentArea: request.contentArea,
      objectives: request.objectives,
      articles: request.selectedArticles.map(a => ({
        title: a.title,
        authors: a.authors,
        journal: a.journal,
        year: a.year,
        doi: a.doi,
        oaUrl: a.oaUrl
      }))
    });
  } catch (error) {
    console.error('Content fetch error:', error.message);
    res.status(500).json({ error: 'Failed to load article content' });
  }
});


// ═══════════════════════════════════════════════════════════════
// STEP 3: ADMIN VIEWS QUEUE
// GET /api/research-ready/queue
// ═══════════════════════════════════════════════════════════════
router.get('/queue', protect, requireAdmin, async (req, res) => {
  try {
    const requests = await RNRRequest.find({
      status: { $in: ['pending', 'approved', 'generating', 'test_ready', 'in_progress'] }
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
// STEP 4: ADMIN APPROVES → triggers AI article + test generation
// PATCH /api/research-ready/request/:id/approve
// ═══════════════════════════════════════════════════════════════
router.patch('/request/:id/approve', protect, requireAdmin, async (req, res) => {
  try {
    const request = await RNRRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ error: `Cannot approve — status is ${request.status}` });
    }

    request.status = 'generating';
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    await request.save();

    // Respond immediately — generation happens async
    res.json({
      success: true,
      message: 'Approved. Generating 6,200+ word article and posttest (may take 60-90 seconds)...',
      requestId: request._id
    });

    // ── ASYNC: Generate article content + posttest ──
    try {
      const format = request.selectedArticles.length > 1 ? 'comparative' : 'standalone';

      // STEP A: Generate 6,200+ word clinical practice article
      console.log(`[RNR] Starting content generation for request ${request._id}`);
      const articleResult = await generateArticleContent({
        articles: request.selectedArticles.map(a => ({
          title: a.title,
          authors: a.authors,
          journal: a.journal,
          year: a.year,
          abstract: a.abstract,
          topic: a.topic
        })),
        contentArea: request.contentArea,
        format,
        courseTitle: request.courseTitle || ''
      });

      request.generatedContent = articleResult.content;
      request.generatedWordCount = articleResult.wordCount;
      request.contentSections = articleResult.sections;
      request.contentGeneratedAt = new Date();

      // CE hours now based on generated content (pre-save hook handles recalc)
      console.log(`[RNR] Content generated: ${articleResult.wordCount} words → ${calculateCE(articleResult.wordCount)} CE hrs`);

      // STEP B: Generate posttest from the GENERATED content (not just the abstract)
      const contentSummary = articleResult.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 6000); // Feed first ~6000 chars of generated content to posttest builder

      const combinedTitle = request.selectedArticles.map(a => a.title).join(' | ');
      const combinedAuthors = request.selectedArticles.map(a => a.authors).filter(Boolean).join('; ');

      const ceContent = await buildCE({
        title: combinedTitle,
        authors: combinedAuthors,
        journal: request.selectedArticles[0]?.journal || '',
        year: request.selectedArticles[0]?.year || new Date().getFullYear(),
        abstract: contentSummary, // Use generated content instead of abstract
        topic: request.contentArea,
        wordCount: articleResult.wordCount,
        ceHours: calculateCE(articleResult.wordCount),
        researchHours: Math.max(0.5, Math.floor((calculateCE(articleResult.wordCount) * 0.5) * 2) / 2),
        format
      });

      request.courseTitle = ceContent.course_title || '';
      request.objectives = ceContent.objectives || [];
      request.questions = ceContent.questions || [];
      request.status = 'test_ready';
      request.testGeneratedAt = new Date();
      await request.save();

      // Notify learner that content + test is ready
      logActivity(ACTIVITY_TYPES.COURSE_STARTED, {
        courseName: `RNR CE: ${request.contentArea} — content & test ready`,
        details: `${articleResult.wordCount} words, ${request.questions.length} questions generated for ${request.userName}`
      }, {
        userId: request.user,
        userName: request.userName,
        userEmail: request.userEmail
      }).catch(() => {});

      console.log(`[RNR] Build complete for request ${request._id} — ${articleResult.wordCount} words, ${request.questions.length} questions, ${calculateCE(articleResult.wordCount)} CE hrs`);
    } catch (buildErr) {
      console.error(`[RNR] Build failed for ${request._id}:`, buildErr.message);
      // Revert to approved so admin can retry
      request.status = 'approved';
      request.adminNote = `Build failed: ${buildErr.message}`;
      await request.save();
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
// ADMIN: RETRY BUILD (if AI generation failed)
// POST /api/research-ready/request/:id/rebuild
// ═══════════════════════════════════════════════════════════════
router.post('/request/:id/rebuild', protect, requireAdmin, async (req, res) => {
  try {
    const request = await RNRRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (!['approved', 'generating'].includes(request.status)) {
      return res.status(400).json({ error: `Can only rebuild for approved/generating requests — current: ${request.status}` });
    }

    request.status = 'generating';
    await request.save();

    res.json({ success: true, message: 'Regenerating content + test...' });

    // Async rebuild
    try {
      const format = request.selectedArticles.length > 1 ? 'comparative' : 'standalone';

      // Regenerate article content
      const articleResult = await generateArticleContent({
        articles: request.selectedArticles.map(a => ({
          title: a.title,
          authors: a.authors,
          journal: a.journal,
          year: a.year,
          abstract: a.abstract,
          topic: a.topic
        })),
        contentArea: request.contentArea,
        format,
        courseTitle: request.courseTitle || ''
      });

      request.generatedContent = articleResult.content;
      request.generatedWordCount = articleResult.wordCount;
      request.contentSections = articleResult.sections;
      request.contentGeneratedAt = new Date();

      // Regenerate posttest from generated content
      const contentSummary = articleResult.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 6000);

      const ceContent = await buildCE({
        title: request.selectedArticles.map(a => a.title).join(' | '),
        authors: request.selectedArticles.map(a => a.authors).filter(Boolean).join('; '),
        journal: request.selectedArticles[0]?.journal || '',
        year: request.selectedArticles[0]?.year || new Date().getFullYear(),
        abstract: contentSummary,
        topic: request.contentArea,
        wordCount: articleResult.wordCount,
        ceHours: calculateCE(articleResult.wordCount),
        researchHours: Math.max(0.5, Math.floor((calculateCE(articleResult.wordCount) * 0.5) * 2) / 2),
        format
      });

      request.courseTitle = ceContent.course_title || '';
      request.objectives = ceContent.objectives || [];
      request.questions = ceContent.questions || [];
      request.status = 'test_ready';
      request.testGeneratedAt = new Date();
      request.adminNote = '';
      await request.save();

      console.log(`[RNR] Rebuild complete for ${request._id} — ${articleResult.wordCount} words, ${request.questions.length} questions`);
    } catch (buildErr) {
      console.error(`[RNR] Rebuild failed for ${request._id}:`, buildErr.message);
      request.status = 'approved';
      request.adminNote = `Rebuild failed: ${buildErr.message}`;
      await request.save();
    }
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
        message: '75% required. Review the article and try again.'
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
          wordCount: request.generatedWordCount || request.totalWordCount,
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
        wordCount: request.generatedWordCount || request.totalWordCount,
        ceCalcFormula: `${request.generatedWordCount || request.totalWordCount} words / 6,000 words/hr = ${((request.generatedWordCount || request.totalWordCount) / 6000).toFixed(2)} → ${request.totalCeHours} CE hr(s)`,
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
// ADMIN: GET BUILD STATUS (poll during generation)
// GET /api/research-ready/request/:id/status
// ═══════════════════════════════════════════════════════════════
router.get('/request/:id/status', protect, requireAdmin, async (req, res) => {
  try {
    const request = await RNRRequest.findById(req.params.id)
      .select('status generatedWordCount contentSections testGeneratedAt adminNote questions')
      .lean();

    if (!request) return res.status(404).json({ error: 'Request not found' });

    res.json({
      status: request.status,
      generatedWordCount: request.generatedWordCount || 0,
      contentSections: request.contentSections || 0,
      testGenerated: !!request.testGeneratedAt,
      questionCount: request.questions?.length || 0,
      error: request.adminNote || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
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

import aiCourseGeneratorRoutes from './routes/aiCourseGenerator.js';
import courseBuilderRoutes from './routes/courseBuilder.js';
import narrationRoutes from './routes/narration.js';
import uploadsRoutes from './routes/uploads.js';
import imageUploadRoutes from './routes/imageUpload.js';
// ── New feature routes (2026-03-06) ──
import organizationsRoutes from './routes/organizations.js';
import cePlannerRoutes from './routes/cePlanner.js';
import insuranceCredentialsRoutes from './routes/insuranceCredentials.js';
import auditKitRoutes from './routes/auditKit.js';
import boardAlertsRoutes from './routes/boardAlerts.js';
// ── New feature routes (2026-03-06 batch 2) ──
import groupLicensesRoutes from './routes/groupLicenses.js';
import recommendationsRoutes from './routes/recommendations.js';
import supervisionRoutes from './routes/supervision.js';
import referralsRoutes from './routes/referrals.js';
import gamificationRoutes from './routes/gamification.js';
import notificationsRoutes from './routes/notifications.js';
import legacyVaultRoutes from './routes/legacyVault.js';
import adminStatsRoutes from './routes/adminStats.js';
// ── Whitelabel partner routes ──
import partnersRoutes from './routes/partners.js';
import rawMarkdownRoutes from './routes/rawMarkdownRoute.js';
import dashboardRoutes from './routes/dashboard.js';
// Import services
import { initializeScheduler } from './services/notificationScheduler.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production') {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    } else {
      // Allow all origins in development
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin for API
  contentSecurityPolicy: false // Disable CSP since this is an API server
}));

// ===========================================
// RATE LIMITING
// ===========================================

// Global rate limit: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', globalLimiter);

// Strict auth limiter: 7 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Password reset limiter: 3 per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Please try again in an hour.' }
});
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api/auth/reset-password', passwordResetLimiter);

// AI endpoint limiter: 15 per hour (protect against cost abuse)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI generation rate limit reached. Please try again later.' }
});
app.use('/api/ai/', aiLimiter);
app.use('/api/ai-course-generator/', aiLimiter);
app.use('/api/admin/quiz/generate', aiLimiter);
app.use('/api/admin/course/generate', aiLimiter);
app.use('/api/admin/module/generate', aiLimiter);

// Body parsing middleware
// Stripe webhook needs raw body, so we handle it before json parsing
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ===========================================
// DATABASE CONNECTION
// ===========================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+, but kept for compatibility
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ===========================================
// ROUTES
// ===========================================

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: dbStatus[dbState] || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interactive-courses', interactiveCourseRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/scorm', scormRoutes);
app.use('/api/lti', ltiRoutes);
app.use('/api/xapi', xapiRoutes);
app.use('/api/cebroker', cebrokerRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/admin/courses', bulkUploadRoutes);
// ── Previously unregistered routes (wiring audit fix 2026-03-04) ──
app.use('/api/ai', aiRoutes);
app.use('/api/ai-course-generator', aiCourseGeneratorRoutes);
app.use('/api/course-builder', courseBuilderRoutes);
app.use('/api/narration', narrationRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/images', imageUploadRoutes);
// ── New feature routes (2026-03-06) ──
app.use('/api/organizations', organizationsRoutes);
app.use('/api/ce-planner', cePlannerRoutes);
app.use('/api/insurance-credentials', insuranceCredentialsRoutes);
app.use('/api/audit-kit', auditKitRoutes);
app.use('/api/board-alerts', boardAlertsRoutes);
// ── New feature routes (2026-03-06 batch 2) ──
app.use('/api/group-licenses', groupLicensesRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/supervision', supervisionRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/legacy-vault', legacyVaultRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/rawmd', rawMarkdownRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Static templates directory intentionally NOT served publicly
// Certificate assets (signature.png, certificate_template.pdf) are loaded
// via filesystem path in certificate generation routes only

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      '/health',
      '/api/auth/*',
      '/api/courses/*',
      '/api/interactive-courses/*',
      '/api/admin/*',
      '/api/users/*',
      '/api/certificates/*',
      '/api/credentials/*',
      '/api/payments/*',
      '/api/analytics/*',
      '/api/migration/*',
      '/api/ai-course-generator/*' // ← NEW
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation Error', details: messages });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `Duplicate value for ${field}` });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  // Initialize notification scheduler
  initializeScheduler();
  
  // Start listening
  const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🎓 CounselorReady API Server                   ║
║                                                  ║
║   Port: ${PORT}                                     ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║   MongoDB: Connected                             ║
║   Scheduler: Active                              ║
║   AI Generation: Ready                           ║
║                                                  ║
║   Health: http://localhost:${PORT}/health            ║
║                                                  ║
╚══════════════════════════════════════════════════╝
    `);
  });

  // Increase server timeout for AI generation endpoints (Anthropic calls take 30-90s)
  server.timeout = 120000; // 2 minutes
  server.keepAliveTimeout = 120000;
  server.headersTimeout = 125000;
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
