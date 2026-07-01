/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import { ScholarlyArticle, ArticleProgress } from '../models/ScholarlyArticle.js';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// Extend timeout for AI quiz generation
router.use((req, res, next) => {
  if (req.path.includes('generate-quiz')) {
    req.setTimeout(120000);
    res.setTimeout(120000);
  }
  next();
});

// ─── Anthropic config (reuse pattern from ai.js) ──
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

// ─── Content area mapping helpers ──
const CONTENT_AREA_KEYWORDS = {
  'counseling-theory-practice': ['therapy', 'therapeutic', 'counseling technique', 'psychotherapy', 'cbt', 'dbt', 'emdr', 'motivational interviewing', 'person-centered', 'solution-focused'],
  'human-growth-development': ['development', 'lifespan', 'adolescent', 'child development', 'aging', 'developmental psychology', 'attachment'],
  'social-cultural-foundations': ['multicultural', 'cultural competence', 'diversity', 'social justice', 'race', 'ethnicity', 'lgbtq', 'intersectionality'],
  'group-dynamics-counseling': ['group therapy', 'group counseling', 'group dynamics', 'group work', 'psychoeducational group'],
  'career-development-counseling': ['career', 'vocational', 'career counseling', 'occupational', 'career development', 'job satisfaction'],
  'assessment': ['assessment', 'diagnosis', 'dsm', 'screening', 'psychological testing', 'measurement', 'psychometrics'],
  'research-program-evaluation': ['research', 'evidence-based', 'outcome', 'meta-analysis', 'systematic review', 'program evaluation', 'efficacy', 'effectiveness'],
  'professional-identity-practice': ['ethics', 'supervision', 'professional identity', 'licensure', 'burnout', 'self-care', 'counselor education', 'competency'],
  'wellness-prevention': ['wellness', 'prevention', 'resilience', 'mindfulness', 'well-being', 'health promotion', 'positive psychology', 'self-care']
};

const CONTENT_AREA_LABELS = {
  'counseling-theory-practice': 'Counseling Theory & Practice',
  'human-growth-development': 'Human Growth & Development',
  'social-cultural-foundations': 'Social & Cultural Foundations',
  'group-dynamics-counseling': 'Group Dynamics & Counseling',
  'career-development-counseling': 'Career Development & Counseling',
  'assessment': 'Assessment',
  'research-program-evaluation': 'Research & Program Evaluation',
  'professional-identity-practice': 'Professional Identity & Practice',
  'wellness-prevention': 'Wellness & Prevention'
};

function detectContentArea(title, abstract, subjects) {
  const text = `${title} ${abstract || ''} ${(subjects || []).join(' ')}`.toLowerCase();
  let bestArea = 'research-program-evaluation';
  let bestScore = 0;

  for (const [area, keywords] of Object.entries(CONTENT_AREA_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestArea = area;
    }
  }

  // Always also counts toward research since it's scholarly reading
  return bestArea;
}

// ─── CrossRef API helpers ──
const CROSSREF_BASE = 'https://api.crossref.org/works';
const CROSSREF_MAILTO = process.env.CROSSREF_MAILTO || 'support@counselorready.com';

async function searchCrossRef(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    'query.bibliographic': query,
    'filter': 'type:journal-article',
    'rows': String(limit),
    'offset': String(offset),
    'mailto': CROSSREF_MAILTO,
    'select': 'DOI,title,author,abstract,container-title,published-print,published-online,volume,issue,page,URL,subject,link'
  });

  const response = await fetch(`${CROSSREF_BASE}?${params}`);
  if (!response.ok) {
    throw new Error(`CrossRef API error: ${response.status}`);
  }

  const data = await response.json();
  const items = data.message.items || [];
  const totalResults = data.message['total-results'] || 0;

  return {
    results: items.map(formatCrossRefItem),
    totalResults,
    page,
    limit
  };
}

async function fetchCrossRefByDoi(doi) {
  const response = await fetch(`${CROSSREF_BASE}/${encodeURIComponent(doi)}?mailto=${CROSSREF_MAILTO}`);
  if (!response.ok) {
    throw new Error(`CrossRef DOI lookup failed: ${response.status}`);
  }
  const data = await response.json();
  return formatCrossRefItem(data.message);
}

function formatCrossRefItem(item) {
  const published = item['published-print'] || item['published-online'];
  const dateParts = published?.['date-parts']?.[0];
  let publishedDate = null;
  if (dateParts) {
    publishedDate = new Date(dateParts[0], (dateParts[1] || 1) - 1, dateParts[2] || 1);
  }

  return {
    doi: item.DOI,
    title: Array.isArray(item.title) ? item.title[0] : item.title || 'Untitled',
    authors: (item.author || []).map(a => ({
      given: a.given || '',
      family: a.family || '',
      affiliation: a.affiliation?.[0]?.name || ''
    })),
    abstract: item.abstract ? item.abstract.replace(/<[^>]*>/g, '') : null,
    publishedDate,
    journal: Array.isArray(item['container-title']) ? item['container-title'][0] : item['container-title'] || '',
    volume: item.volume || '',
    issue: item.issue || '',
    pages: item.page || '',
    url: item.URL || `https://doi.org/${item.DOI}`,
    subjects: item.subject || []
  };
}

// ═══════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════

// ─── GET /search — Search CrossRef for articles ──
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query (q) is required and must be at least 2 characters' });
    }

    // Append counseling/psychology context to improve relevance
    const enrichedQuery = `${q} counseling psychology`;
    const results = await searchCrossRef(enrichedQuery, parseInt(page), parseInt(limit));

    // Check which articles user has already saved
    const dois = results.results.map(r => r.doi);
    const savedProgress = await ArticleProgress.find({
      userId: req.user._id,
      doi: { $in: dois }
    }).select('doi status quizPassed');

    const savedMap = {};
    savedProgress.forEach(p => { savedMap[p.doi] = p; });

    results.results = results.results.map(r => ({
      ...r,
      userStatus: savedMap[r.doi]?.status || null,
      quizPassed: savedMap[r.doi]?.quizPassed || false
    }));

    res.json(results);
  } catch (error) {
    console.error('Scholarly search error:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

// ─── GET /article/:doi — Get article by DOI (cache in DB) ──
router.get('/article/:doi(*)', async (req, res) => {
  try {
    const doi = req.params.doi;

    // Check cache first
    let article = await ScholarlyArticle.findOne({ doi });
    if (!article) {
      // Fetch from CrossRef and cache
      const data = await fetchCrossRefByDoi(doi);
      const contentArea = detectContentArea(data.title, data.abstract, data.subjects);
      article = await ScholarlyArticle.create({ ...data, nbccContentArea: contentArea });
    }

    // Get user's progress for this article
    const progress = await ArticleProgress.findOne({
      userId: req.user._id,
      articleId: article._id
    });

    res.json({ article, progress });
  } catch (error) {
    console.error('Article fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// ─── POST /article/:doi/save — Save article to user's library ──
router.post('/article/:doi(*)/save', async (req, res) => {
  try {
    const doi = req.params.doi;

    // Ensure article is cached
    let article = await ScholarlyArticle.findOne({ doi });
    if (!article) {
      const data = await fetchCrossRefByDoi(doi);
      const contentArea = detectContentArea(data.title, data.abstract, data.subjects);
      article = await ScholarlyArticle.create({ ...data, nbccContentArea: contentArea });
    }

    // Create or update progress
    let progress = await ArticleProgress.findOne({ userId: req.user._id, articleId: article._id });
    if (progress) {
      return res.json({ message: 'Article already saved', progress });
    }

    progress = await ArticleProgress.create({
      userId: req.user._id,
      articleId: article._id,
      doi: article.doi,
      status: 'saved',
      nbccContentArea: article.nbccContentArea
    });

    res.status(201).json({ message: 'Article saved', progress });
  } catch (error) {
    console.error('Article save error:', error);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

// ─── DELETE /article/:doi/save — Remove article from library ──
router.delete('/article/:doi(*)/save', async (req, res) => {
  try {
    const article = await ScholarlyArticle.findOne({ doi: req.params.doi });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    await ArticleProgress.findOneAndDelete({ userId: req.user._id, articleId: article._id });
    res.json({ message: 'Article removed from library' });
  } catch (error) {
    console.error('Article unsave error:', error);
    res.status(500).json({ error: 'Failed to remove article' });
  }
});

// ─── PATCH /article/:doi/read — Mark article as read ──
router.patch('/article/:doi(*)/read', async (req, res) => {
  try {
    const article = await ScholarlyArticle.findOne({ doi: req.params.doi });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    let progress = await ArticleProgress.findOne({ userId: req.user._id, articleId: article._id });
    if (!progress) {
      // Auto-save if not already saved
      progress = await ArticleProgress.create({
        userId: req.user._id,
        articleId: article._id,
        doi: article.doi,
        status: 'read',
        readAt: new Date(),
        nbccContentArea: article.nbccContentArea
      });
    } else {
      progress.status = progress.quizPassed ? 'quiz_passed' : 'read';
      progress.readAt = new Date();
      await progress.save();
    }

    res.json({ message: 'Article marked as read', progress });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark article as read' });
  }
});

// ─── PATCH /article/:doi/notes — Update reading notes ──
router.patch('/article/:doi(*)/notes', async (req, res) => {
  try {
    const { notes } = req.body;
    const article = await ScholarlyArticle.findOne({ doi: req.params.doi });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const progress = await ArticleProgress.findOneAndUpdate(
      { userId: req.user._id, articleId: article._id },
      { notes },
      { new: true }
    );
    if (!progress) return res.status(404).json({ error: 'Article not in your library' });

    res.json({ progress });
  } catch (error) {
    console.error('Notes update error:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// ─── GET /my-articles — Get user's saved/read articles ──
router.get('/my-articles', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const total = await ArticleProgress.countDocuments(filter);
    const progress = await ArticleProgress.find(filter)
      .populate('articleId')
      .sort({ updatedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      articles: progress.map(p => ({
        ...p.toObject(),
        article: p.articleId
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('My articles error:', error);
    res.status(500).json({ error: 'Failed to fetch your articles' });
  }
});

// ─── POST /article/:doi/generate-quiz — AI generates quiz from article metadata ──
router.post('/article/:doi(*)/generate-quiz', async (req, res) => {
  try {
    const article = await ScholarlyArticle.findOne({ doi: req.params.doi });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    // Return cached quiz if already generated
    if (article.quizGenerated && article.quizQuestions.length > 0) {
      return res.json({
        message: 'Quiz already generated',
        questions: article.quizQuestions.map(q => ({
          _id: q._id,
          question: q.question,
          type: q.type,
          options: q.options.map(o => ({ text: o.text })), // hide correct answers
          explanation: null
        }))
      });
    }

    if (!article.abstract && !article.title) {
      return res.status(400).json({ error: 'Insufficient article metadata to generate quiz' });
    }

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const authorsStr = article.authors.map(a => `${a.given} ${a.family}`).join(', ');
    const prompt = `Generate exactly 5 quiz questions based on this scholarly article in counseling psychology.

ARTICLE DETAILS:
- Title: ${article.title}
- Authors: ${authorsStr}
- Journal: ${article.journal}
- Year: ${article.publishedDate ? article.publishedDate.getFullYear() : 'Unknown'}
- Abstract: ${article.abstract || 'Not available — generate questions based on the title, journal, and likely content.'}
- Subjects: ${(article.subjects || []).join(', ')}

REQUIREMENTS:
- Create 5 questions that test comprehension of the article's key concepts, methodology, findings, and clinical implications
- Include 4 questions of type "multipleChoice" (4 options each, exactly 1 correct) and 1 of type "trueFalse" (2 options: True/False)
- Include a brief explanation for each answer
- Questions should be at a graduate/professional level appropriate for licensed counselors
- Focus on practical application and clinical relevance

Return ONLY valid JSON in this exact format (no markdown, no code fences):
[
  {
    "question": "Question text here?",
    "type": "multipleChoice",
    "options": [
      { "text": "Option A", "isCorrect": false },
      { "text": "Option B", "isCorrect": true },
      { "text": "Option C", "isCorrect": false },
      { "text": "Option D", "isCorrect": false }
    ],
    "explanation": "Brief explanation of correct answer."
  }
]`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        system: 'You are an expert in counseling psychology continuing education. Generate quiz questions that assess understanding of scholarly research articles. Return only valid JSON arrays.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Claude API error (${response.status}):`, errBody);
      throw new Error(`AI quiz generation failed: ${response.status}`);
    }

    const aiData = await response.json();
    const text = aiData.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';

    // Parse JSON from response (handle possible markdown fences)
    let questions;
    try {
      const jsonStr = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      questions = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI quiz response:', text);
      return res.status(500).json({ error: 'Failed to parse AI-generated quiz' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ error: 'AI returned invalid quiz format' });
    }

    // Store on article
    article.quizQuestions = questions;
    article.quizGenerated = true;
    article.quizGeneratedAt = new Date();
    await article.save();

    res.json({
      message: 'Quiz generated successfully',
      questions: questions.map(q => ({
        _id: article.quizQuestions.find(aq => aq.question === q.question)?._id,
        question: q.question,
        type: q.type,
        options: q.options.map(o => ({ text: o.text })), // hide correct answers
        explanation: null
      }))
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// ─── GET /article/:doi/quiz — Get quiz questions (without answers) ──
router.get('/article/:doi(*)/quiz', async (req, res) => {
  try {
    const article = await ScholarlyArticle.findOne({ doi: req.params.doi });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (!article.quizGenerated || article.quizQuestions.length === 0) {
      return res.status(404).json({ error: 'No quiz available. Generate one first.' });
    }

    res.json({
      questions: article.quizQuestions.map(q => ({
        _id: q._id,
        question: q.question,
        type: q.type,
        options: q.options.map(o => ({ text: o.text })) // hide correct answers
      })),
      totalQuestions: article.quizQuestions.length
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Failed to get quiz' });
  }
});

// ─── POST /article/:doi/quiz/submit — Submit quiz answers ──
router.post('/article/:doi(*)/quiz/submit', async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    // answers: { [questionId]: selectedOptionIndex }

    const article = await ScholarlyArticle.findOne({ doi: req.params.doi });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    if (!article.quizGenerated) return res.status(400).json({ error: 'No quiz available' });

    // Score the quiz
    let correct = 0;
    const totalQuestions = article.quizQuestions.length;
    const questionResults = [];

    for (const q of article.quizQuestions) {
      const userAnswer = answers[q._id.toString()];
      const correctIndex = q.options.findIndex(o => o.isCorrect);
      const isCorrect = userAnswer === correctIndex;
      if (isCorrect) correct++;

      questionResults.push({
        questionId: q._id,
        question: q.question,
        userAnswer,
        correctAnswer: correctIndex,
        isCorrect,
        explanation: q.explanation
      });
    }

    const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const passed = score >= 80;

    // Update progress
    let progress = await ArticleProgress.findOne({ userId: req.user._id, articleId: article._id });
    if (!progress) {
      progress = new ArticleProgress({
        userId: req.user._id,
        articleId: article._id,
        doi: article.doi,
        nbccContentArea: article.nbccContentArea
      });
    }

    progress.quizAttempts.push({
      attemptedAt: new Date(),
      score,
      totalQuestions,
      passed,
      timeSpent: timeSpent || 0
    });

    if (score > progress.bestQuizScore) {
      progress.bestQuizScore = score;
    }

    // Award CE hours on first pass
    let certificate = null;
    if (passed && !progress.quizPassed) {
      progress.quizPassed = true;
      progress.status = 'quiz_passed';
      progress.ceHoursEarned = article.ceHoursValue;
      progress.readAt = progress.readAt || new Date();

      // Create certificate
      const certNumber = `CR-SA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      certificate = await Certificate.create({
        userId: req.user._id,
        title: `Scholarly Reading: ${article.title}`,
        provider: 'CounselorReady',
        completionDate: new Date(),
        ceHours: article.ceHoursValue,
        category: 'General',
        nbccApproved: true,
        acepNumber: '7760',
        approvingBody: 'NBCC',
        applicability: 'national',
        certificateNumber: certNumber,
        source: 'platform',
        notes: `Scholarly article quiz — DOI: ${article.doi} | Content area: ${CONTENT_AREA_LABELS[article.nbccContentArea] || article.nbccContentArea} + Research`
      });

      progress.certificateId = certificate._id;
      progress.certificateIssuedAt = new Date();
    }

    await progress.save();

    res.json({
      score,
      totalQuestions,
      correct,
      passed,
      bestScore: progress.bestQuizScore,
      ceHoursEarned: passed ? article.ceHoursValue : 0,
      certificateId: certificate?._id || null,
      questionResults
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// ─── GET /stats — User's scholarly reading stats ──
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalSaved, totalRead, totalPassed, ceHoursAgg] = await Promise.all([
      ArticleProgress.countDocuments({ userId }),
      ArticleProgress.countDocuments({ userId, status: { $in: ['read', 'quiz_passed'] } }),
      ArticleProgress.countDocuments({ userId, quizPassed: true }),
      ArticleProgress.aggregate([
        { $match: { userId, ceHoursEarned: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$ceHoursEarned' } } }
      ])
    ]);

    res.json({
      totalSaved,
      totalRead,
      totalQuizzesPassed: totalPassed,
      totalCEHours: ceHoursAgg[0]?.total || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
