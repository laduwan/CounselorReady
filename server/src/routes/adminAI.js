/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// adminAI.js — Admin AI generation (quiz, course, module)
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Initialize Anthropic client
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
}) : null;

// Async AI Generation Job Store
const aiJobs = new Map();
const AI_JOB_TTL = 10 * 60 * 1000; // 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of aiJobs) {
    if (now - job.createdAt > AI_JOB_TTL) aiJobs.delete(id);
  }
}, 60000);

router.post('/quiz/generate', protect, adminOnly, async (req, res) => {
  req.setTimeout(120000); res.setTimeout(120000);
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured. Set ANTHROPIC_API_KEY in environment.' });
    }
    
    const { mode, pdfData, fileName, outline, content, moduleTitle, questionCount = 5 } = req.body;
    
    let prompt = '';
    let messages = [];
    
    if (mode === 'pdf') {
      if (!pdfData) {
        return res.status(400).json({ error: 'No PDF data provided' });
      }
      
      prompt = `You are an expert at extracting quiz questions from educational documents for continuing education courses for mental health counselors.

Analyze the provided PDF document and extract all quiz questions you can find. If the document contains a quiz or test, extract the questions, options, correct answers, and any explanations provided.

If the document doesn't contain explicit quiz questions but contains educational content, generate appropriate quiz questions based on the key concepts.

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer",
      "points": 1
    }
  ]
}

For question types:
- "multiple_choice" - single correct answer, correctAnswer is the index (0-based)
- "multiple_select" - multiple correct answers, correctAnswer is an array of indices
- "true_false" - correctAnswer is true or false

Important:
- Generate clinically relevant questions appropriate for licensed professional counselors
- Include explanations that reinforce learning
- Ensure questions test understanding, not just memorization
- Cover key ethical considerations where relevant

Return ONLY valid JSON, no other text.`;

      messages = [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfData
            }
          },
          { type: 'text', text: prompt }
        ]
      }];
      
    } else if (mode === 'outline') {
      if (!outline) {
        return res.status(400).json({ error: 'No outline provided' });
      }
      
      prompt = `You are an expert quiz creator for continuing education courses for mental health counselors.

Based on the following outline or notes, generate comprehensive quiz questions:

${outline}

Create questions that:
1. Test understanding of key concepts
2. Are appropriate for licensed professional counselors
3. Include ethical considerations where relevant
4. Have clear, unambiguous correct answers
5. Include helpful explanations

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer",
      "points": 1
    }
  ]
}

For question types:
- "multiple_choice" - single correct answer, correctAnswer is the index (0-based)
- "multiple_select" - multiple correct answers, correctAnswer is an array of indices
- "true_false" - correctAnswer is true or false

Return ONLY valid JSON, no other text.`;

      messages = [{ role: 'user', content: prompt }];
      
    } else if (mode === 'content') {
      if (!content) {
        return res.status(400).json({ error: 'No content provided' });
      }
      
      const contextInfo = moduleTitle ? `Module: ${moduleTitle}\n\n` : '';
      
      prompt = `You are an expert quiz creator for continuing education courses for mental health counselors.

Based on the following course content, generate exactly ${questionCount} quiz questions:

${contextInfo}${content}

Create questions that:
1. Test understanding of the key learning points
2. Are appropriate for licensed professional counselors  
3. Include ethical considerations where relevant
4. Cover the most important concepts from the content
5. Have clear, unambiguous correct answers
6. Include helpful explanations that reinforce learning

Vary the question types (multiple choice, true/false, multiple select) for engagement.

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer",
      "points": 1
    }
  ]
}

For question types:
- "multiple_choice" - single correct answer, correctAnswer is the index (0-based)
- "multiple_select" - multiple correct answers, correctAnswer is an array of indices  
- "true_false" - correctAnswer is true or false

Return ONLY valid JSON, no other text.`;

      messages = [{ role: 'user', content: prompt }];
    } else {
      return res.status(400).json({ error: 'Invalid mode. Use: pdf, outline, or content' });
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: messages
    });
    
    const responseText = response.content[0].text;
    
    let result;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }
    
    if (!result.questions || !Array.isArray(result.questions)) {
      return res.status(500).json({ error: 'Invalid response structure from AI' });
    }
    
    // Validate questions
    const validatedQuestions = result.questions.map((q, idx) => {
      if (!q.question) q.question = `Question ${idx + 1}`;
      if (!['multiple_choice', 'multiple_select', 'true_false'].includes(q.type)) q.type = 'multiple_choice';
      
      if (q.type !== 'true_false' && (!q.options || q.options.length < 2)) {
        q.options = ['Option A', 'Option B', 'Option C', 'Option D'];
        q.correctAnswer = 0;
      }
      
      if (q.type === 'true_false') {
        q.correctAnswer = q.correctAnswer === true || q.correctAnswer === 'true';
        q.options = null;
      } else if (q.type === 'multiple_select') {
        if (!Array.isArray(q.correctAnswer)) q.correctAnswer = [0];
      } else {
        if (typeof q.correctAnswer !== 'number') q.correctAnswer = 0;
      }
      
      q.points = q.points || 1;
      
      return {
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        points: q.points
      };
    });
    
    res.json({
      success: true,
      questions: validatedQuestions,
      count: validatedQuestions.length,
      mode: mode
    });
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz: ' + error.message });
  }
});

// @route   POST /api/admin/course/generate
// @desc    Generate a complete course using AI
// @access  Admin only
router.post('/course/generate', protect, adminOnly, async (req, res) => {
  req.setTimeout(120000); res.setTimeout(120000);
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const { fileData, fileName, fileType, content, category, ceHours, generateQuizzes, generateObjectives, keyPoints } = req.body;
    
    if (!fileData && !content) {
      return res.status(400).json({ error: 'Provide file or content' });
    }
    
    const catNames = { core: 'Core/General', ethics: 'Ethics', supervision: 'Supervision', telehealth: 'Telehealth', cultural: 'Cultural Diversity', trauma: 'Trauma', substance: 'Substance Abuse', crisis: 'Crisis/Suicide' };
    const catName = catNames[category] || 'Core/General';
    
    // NBCC requirement: 1 CE hour = 6,000 words for text-based home study
    const totalWordsRequired = ceHours * 6000;
    const wordsPerLesson = Math.ceil(totalWordsRequired / (ceHours * 2)); // Assuming ~2 lessons per CE hour
    
    let prompt = `You are an expert instructional designer creating comprehensive CE courses for licensed professional counselors.

Create a COMPLETE, DETAILED CE course based on the provided content.
- Category: ${catName}
- CE Hours: ${ceHours}
${keyPoints ? `- Emphasize: ${keyPoints}` : ''}

NBCC COMPLIANCE REQUIREMENTS:
- NBCC requires 6,000 words per CE credit hour for text-based courses
- This ${ceHours} CE hour course MUST contain at least ${totalWordsRequired.toLocaleString()} words total
- Each lesson should contain approximately ${wordsPerLesson.toLocaleString()} words minimum
- This is a STRICT requirement - courses with insufficient content do not qualify for CE credit

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations
2. Each lesson MUST meet the word count requirement with substantive educational content
3. Content must be educational - include detailed explanations, research, case studies, clinical applications
4. Format lesson content with proper HTML: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>

Required JSON structure:
{
  "title": "Course title",
  "subtitle": "Brief subtitle",
  "description": "2-3 paragraph course description explaining what learners will gain",
  "ceuHours": ${ceHours},
  "ceuCategories": [{"category": "${category}", "hours": ${ceHours}}],
  "instructor": "GA Integrated Therapeutic Perspectives LLC",
  "accessTier": "professional",
  "status": "draft",
  ${generateObjectives ? '"objectives": ["Specific learning objective 1", "Specific learning objective 2", "Specific learning objective 3", "Specific learning objective 4"],' : ''}
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson Title",
          "type": "text",
          "content": "<h2>Introduction</h2><p>Comprehensive opening that introduces the topic, its relevance to clinical practice, and learning objectives for this lesson. This section should thoroughly orient the reader to what they will learn...</p><h3>Theoretical Foundation</h3><p>Detailed explanation of the theoretical underpinnings, including historical context, key theorists and their contributions, and how these concepts evolved over time...</p><h3>Key Concepts and Definitions</h3><p>In-depth exploration of each key concept with clear definitions, examples, and clinical relevance. Each concept should be explained thoroughly with multiple examples...</p><h3>Clinical Applications</h3><p>Extensive discussion of how to apply these concepts in clinical practice, including specific techniques, interventions, and considerations for different client populations...</p><h3>Case Study</h3><p>Detailed case presentation that illustrates the concepts in action, including client background, presenting concerns, assessment, treatment planning, interventions used, and outcomes...</p><h3>Ethical Considerations</h3><p>Discussion of relevant ethical issues, ACA Code of Ethics references, and guidance for navigating ethical dilemmas related to this topic...</p><h3>Research and Evidence Base</h3><p>Summary of current research findings, evidence-based practices, and areas where more research is needed...</p><h3>Summary and Key Takeaways</h3><p>Comprehensive recap of all main points covered, with emphasis on practical applications and continued learning...</p>",
          "duration": 30,
          "order": 1
        }${generateQuizzes ? `,
        {
          "title": "Module Quiz",
          "type": "quiz",
          "duration": 15,
          "order": 2,
          "questions": [
            {"question": "Detailed scenario-based question that tests understanding of the material?", "type": "multiple_choice", "options": ["Option A with clinical detail", "Option B with clinical detail", "Option C with clinical detail", "Option D with clinical detail"], "correctAnswer": 0, "explanation": "Comprehensive explanation of why this answer is correct, referencing specific content from the lesson and explaining why other options are incorrect", "points": 1}
          ],
          "shuffleQuestions": true,
          "showExplanations": true
        }` : ''}
      ]
    }
  ],
  "settings": {"linearProgression": true, "enforceMinTime": true, "minTimePercent": 80, "passingScore": 70, "requireEvaluation": true, "requireAttestation": true, "certificateEnabled": true},
  "approvingBody": "NBCC",
  "approvalNumber": "7760"
}

CONTENT STRUCTURE REQUIREMENTS:
- Create ${Math.max(Math.ceil(ceHours), 2)} modules minimum (approximately 1 module per CE hour)
- Each module should have 2-3 substantive text lessons plus a quiz (if requested)
- EVERY text lesson must contain ${wordsPerLesson.toLocaleString()}+ words of educational content
- Total course content must exceed ${totalWordsRequired.toLocaleString()} words to meet NBCC requirements

CONTENT QUALITY REQUIREMENTS:
- Write as if creating a professional textbook chapter
- Include: theoretical foundations, research citations, clinical examples, case studies, ethical considerations
- Each lesson should cover the topic thoroughly - not summarize it
- Use professional counseling terminology appropriately
- Reference the ACA Code of Ethics where relevant
- Include practical, actionable clinical guidance

${generateQuizzes ? `QUIZ REQUIREMENTS:
- 5-8 questions per module quiz
- Mix of knowledge-based and scenario-based questions
- Questions should assess comprehension and application, not just recall
- Provide detailed explanations for all answers` : ''}

Generate the complete course now. The content MUST meet NBCC word count requirements. Output ONLY the JSON object.`;

    let messages = [];
    if (fileData) {
      let mediaType = fileType || 'application/pdf';
      messages = [{ role: 'user', content: [{ type: 'document', source: { type: 'base64', media_type: mediaType, data: fileData } }, { type: 'text', text: prompt }] }];
    } else {
      messages = [{ role: 'user', content: `Content:\n${content}\n\n${prompt}` }];
    }
    
    // Set up SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    // Send progress update helper
    const sendProgress = (message, percent) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', message, percent })}\n\n`);
    };
    
    sendProgress('Starting AI generation...', 5);
    
    // Use streaming API
    let responseText = '';
    
    try {
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 64000,
        messages
      });
      
      sendProgress('Claude is analyzing your content...', 10);
      
      let lastProgressUpdate = Date.now();
      let charCount = 0;
      
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta?.text) {
          responseText += event.delta.text;
          charCount += event.delta.text.length;
          
          // Send progress updates every 500ms or 500 chars
          if (Date.now() - lastProgressUpdate > 500 || charCount > 500) {
            const estimatedPercent = Math.min(10 + Math.floor(responseText.length / 200), 85);
            
            // Detect what's being generated based on content
            let status = 'Generating course structure...';
            if (responseText.includes('"modules"')) status = 'Building modules...';
            if (responseText.includes('"lessons"')) status = 'Creating lessons...';
            if (responseText.includes('"content"')) status = 'Writing lesson content...';
            if (responseText.includes('"questions"')) status = 'Generating quiz questions...';
            if (responseText.includes('"objectives"')) status = 'Defining learning objectives...';
            
            sendProgress(status, estimatedPercent);
            lastProgressUpdate = Date.now();
            charCount = 0;
          }
        }
      }
      
      sendProgress('Parsing generated content...', 90);
      
    } catch (streamError) {
      console.error('Stream error:', streamError);
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'AI generation failed: ' + streamError.message })}\n\n`);
      res.end();
      return;
    }
    
    console.log('AI Response length:', responseText.length);
    
    let course;
    try {
      // Try multiple parsing strategies
      let jsonText = responseText;
      
      // Strategy 1: Remove markdown code blocks
      jsonText = jsonText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
      
      // Strategy 2: Find JSON object boundaries
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        console.error('No JSON object found in response');
        console.error('Response preview:', responseText.substring(0, 500));
        throw new Error('No JSON object found in AI response');
      }
      
      jsonText = jsonText.substring(startIdx, endIdx + 1);
      
      // Strategy 3: Fix common JSON issues
      // Remove trailing commas before } or ]
      jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      // Parse the JSON
      course = JSON.parse(jsonText);
      
      sendProgress('Validating course structure...', 95);
      
    } catch (e) {
      console.error('Parse error:', e.message);
      console.error('Response length:', responseText.length);
      
      // SALVAGE: Extract whatever content we can from the broken JSON
      sendProgress('JSON parse failed — salvaging content...', 92);
      
      try {
        // Extract title
        const titleMatch = responseText.match(/"title"\s*:\s*"([^"]+)"/);
        const descMatch = responseText.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        const objectivesMatches = [...responseText.matchAll(/"objectives"\s*:\s*\[([\s\S]*?)\]/g)];
        
        // Extract all HTML content blocks from the response
        const contentBlocks = [];
        const contentRegex = /"content"\s*:\s*"((?:[^"\\]|\\["\\\/bfnrt]|\\u[0-9a-fA-F]{4})*)"/g;
        let match;
        while ((match = contentRegex.exec(responseText)) !== null) {
          let content = match[1];
          // Unescape JSON string
          content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          if (content.length > 100) {
            contentBlocks.push(content);
          }
        }
        
        // Extract module titles
        const moduleTitles = [];
        const titleRegex = /"title"\s*:\s*"([^"]+)"/g;
        let titleMatch2;
        while ((titleMatch2 = titleRegex.exec(responseText)) !== null) {
          const t = titleMatch2[1];
          if (t.length > 5 && t.length < 200 && !moduleTitles.includes(t)) {
            moduleTitles.push(t);
          }
        }
        
        // Extract any quiz questions we can find
        const questionMatches = [...responseText.matchAll(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
        
        if (contentBlocks.length > 0) {
          // Build a salvaged course from extracted content
          const salvaged = {
            title: titleMatch ? titleMatch[1] : 'Salvaged Course',
            description: descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : 'Course content was partially generated. Some content may be incomplete.',
            modules: contentBlocks.map((content, i) => ({
              title: moduleTitles[i + 1] || `Module ${i + 1}`,
              description: '',
              order: i + 1,
              lessons: [{
                title: moduleTitles[i + 1] || `Module ${i + 1} Content`,
                type: 'text',
                content: content,
                duration: 30,
                order: 1
              }]
            }))
          };
          
          // Parse objectives if found
          if (objectivesMatches.length > 0) {
            const objText = objectivesMatches[0][1];
            const objs = [...objText.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => m[1].replace(/\\"/g, '"'));
            if (objs.length > 0) salvaged.objectives = objs;
          }
          
          const totalWords = contentBlocks.reduce((sum, c) => sum + c.replace(/<[^>]*>/g, '').split(/\s+/).length, 0);
          console.log(`SALVAGED: ${contentBlocks.length} content blocks, ~${totalWords} words from failed JSON parse`);
          
          sendProgress(`Salvaged ${contentBlocks.length} modules (~${totalWords.toLocaleString()} words) from partial response`, 100);
          res.write(`data: ${JSON.stringify({ type: 'complete', success: true, course: salvaged, partial: true })}\n\n`);
          res.end();
          return;
        }
        
        // Last resort: extract raw HTML tags
        const rawHtml = responseText.match(/<h[23]>[\s\S]+/);
        if (rawHtml && rawHtml[0].length > 500) {
          const salvaged = {
            title: titleMatch ? titleMatch[1] : 'Salvaged Course',
            description: 'Content was partially generated from raw output.',
            modules: [{
              title: 'Generated Content',
              order: 1,
              lessons: [{ title: 'Content', type: 'text', content: rawHtml[0].substring(0, 50000), duration: 30, order: 1 }]
            }]
          };
          
          sendProgress('Salvaged raw content from partial response', 100);
          res.write(`data: ${JSON.stringify({ type: 'complete', success: true, course: salvaged, partial: true })}\n\n`);
          res.end();
          return;
        }
      } catch (salvageError) {
        console.error('Salvage also failed:', salvageError.message);
      }
      
      // Only show total failure if salvage also failed
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to parse AI response and could not salvage content.', responseLength: responseText.length })}\n\n`);
      res.end();
      return;
    }
    
    // Validate structure
    if (!course.title) course.title = 'Untitled Course';
    if (!course.modules) course.modules = [];
    course.modules = course.modules.map((m, mi) => {
      m.order = mi + 1;
      m.lessons = (m.lessons || []).map((l, li) => {
        l.order = li + 1;
        if (!l.type) l.type = 'text';
        if (!l.duration) l.duration = 10;
        if (l.type === 'quiz' && l.questions) {
          l.questions = l.questions.map(q => {
            if (!q.type) q.type = 'multiple_choice';
            if (!q.points) q.points = 1;
            return q;
          });
        }
        return l;
      });
      return m;
    });
    
    sendProgress('Course generated successfully!', 100);
    
    // Send the final course data
    res.write(`data: ${JSON.stringify({ type: 'complete', success: true, course })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('Course generation error:', error);
    // Check if headers already sent (streaming started)
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to generate course: ' + error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Failed to generate course: ' + error.message });
    }
  }
});

// @route   POST /api/admin/courses/:courseId/lesson/regenerate
// @desc    Regenerate content for a single lesson using AI
// @access  Admin only
router.post('/courses/:courseId/lesson/regenerate', protect, adminOnly, async (req, res) => {
  req.setTimeout(120000); res.setTimeout(120000);
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const { courseId } = req.params;
    const { moduleIndex, lessonIndex, lessonTitle, moduleTitle, courseTitle, courseCategory, ceHours } = req.body;
    
    // Get the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Validate indices
    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(400).json({ error: 'Invalid module or lesson index' });
    }
    
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    
    // Calculate target word count based on NBCC requirements
    // 6,000 words per CE hour, distributed across lessons
    const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.filter(l => l.type === 'text').length || 0), 0);
    const targetWords = Math.ceil((ceHours * 6000) / Math.max(totalLessons, 1));
    
    const catNames = { core: 'Core/General', ethics: 'Ethics', supervision: 'Supervision', telehealth: 'Telehealth', cultural: 'Cultural Diversity', trauma: 'Trauma', substance: 'Substance Abuse', crisis: 'Crisis/Suicide' };
    const catName = catNames[courseCategory] || 'Core/General';
    
    const prompt = `You are an expert instructional designer creating CE content for licensed professional counselors.

Generate COMPREHENSIVE lesson content for the following:
- Course: ${courseTitle}
- Module: ${moduleTitle}
- Lesson: ${lessonTitle}
- Category: ${catName}
- Course CE Hours: ${ceHours}

NBCC COMPLIANCE REQUIREMENT:
This lesson MUST contain at least ${targetWords.toLocaleString()} words of substantive educational content.
NBCC requires 6,000 words per CE credit hour for text-based courses.

Generate the lesson content in HTML format with the following structure:

<h2>${lessonTitle}</h2>

<h3>Introduction</h3>
<p>Comprehensive introduction explaining the importance of this topic in clinical practice, what learners will gain, and how it connects to the broader course content. (150-200 words)</p>

<h3>Theoretical Foundation</h3>
<p>Detailed explanation of the theoretical underpinnings, including historical context, key theorists and their contributions, and how these concepts have evolved. Include specific theories and models relevant to this topic. (300-400 words)</p>

<h3>Key Concepts and Definitions</h3>
<p>In-depth exploration of each key concept with clear definitions, clinical examples, and practical applications. Each concept should be thoroughly explained. (400-500 words)</p>

<h3>Clinical Applications</h3>
<p>Extensive discussion of how to apply these concepts in clinical practice. Include specific techniques, interventions, session examples, and considerations for different client populations and settings. (400-500 words)</p>

<h3>Case Study</h3>
<p>Present a detailed, realistic clinical case that illustrates the concepts. Include: client background and presenting concerns, assessment process, treatment planning, specific interventions used, therapeutic dialogue examples, and outcomes. (400-500 words)</p>

<h3>Ethical Considerations</h3>
<p>Discussion of relevant ethical issues related to this topic. Reference specific sections of the ACA Code of Ethics. Provide guidance for navigating common ethical dilemmas. (200-300 words)</p>

<h3>Evidence Base and Research</h3>
<p>Summary of current research findings supporting these practices. Mention key studies, outcomes data, and areas where more research is needed. (200-300 words)</p>

<h3>Practical Guidelines</h3>
<ul>
<li><strong>Guideline 1:</strong> Detailed explanation of first practical guideline with examples</li>
<li><strong>Guideline 2:</strong> Detailed explanation of second practical guideline with examples</li>
<li><strong>Guideline 3:</strong> Detailed explanation of third practical guideline with examples</li>
<li><strong>Guideline 4:</strong> Detailed explanation of fourth practical guideline with examples</li>
<li><strong>Guideline 5:</strong> Detailed explanation of fifth practical guideline with examples</li>
</ul>

<h3>Summary and Key Takeaways</h3>
<p>Comprehensive recap of all main points covered, emphasizing practical applications and encouraging continued professional development in this area. (150-200 words)</p>

IMPORTANT: 
- Write ${targetWords.toLocaleString()}+ words of actual educational content
- Do NOT write brief summaries - write full, detailed content as if for a professional textbook
- Use professional counseling terminology
- Include specific, actionable clinical guidance
- Return ONLY the HTML content, no markdown code blocks`;

    console.log(`Regenerating lesson: ${lessonTitle} (target: ${targetWords} words)`);
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    let content = response.content[0].text;
    
    // Clean up any markdown code blocks
    content = content.replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Update the lesson content in the database
    course.modules[moduleIndex].lessons[lessonIndex].content = content;
    await course.save();
    
    // Calculate actual word count
    const actualWords = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    console.log(`Generated ${actualWords} words for lesson: ${lessonTitle}`);
    
    res.json({ 
      success: true, 
      content,
      wordCount: actualWords,
      targetWords
    });
    
  } catch (error) {
    console.error('Lesson regeneration error:', error);
    res.status(500).json({ error: 'Failed to regenerate lesson: ' + error.message });
  }
});

// @route   POST /api/admin/module/generate
// @desc    Start async generation for a SINGLE module (returns jobId immediately)
// @access  Admin only
router.post('/module/generate', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured. Set ANTHROPIC_API_KEY in environment.' });
    }

    const { 
      courseTitle, 
      moduleTitle, 
      moduleNumber, 
      totalModules, 
      ceHours, 
      category, 
      sourceContent, 
      additionalNotes,
      generateQuiz 
    } = req.body;

    if (!moduleTitle) {
      return res.status(400).json({ error: 'moduleTitle is required' });
    }

    // Create async job and return immediately (avoids Render 30s proxy timeout)
    const jobId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    aiJobs.set(jobId, { status: 'processing', createdAt: Date.now(), moduleTitle });

    // Return jobId immediately — frontend will poll for results
    res.json({ success: true, jobId, message: 'Generation started' });

    // ── Run generation in background ──
    (async () => {
      try {
        const catNames = { core: 'Core/General', ethics: 'Ethics', supervision: 'Supervision', telehealth: 'Telehealth', cultural: 'Cultural Diversity', trauma: 'Trauma', substance: 'Substance Abuse', crisis: 'Crisis/Suicide' };
        const catName = catNames[category] || 'Core/General';
        const totalWords = (ceHours || 3) * 6000;
        const wordsForModule = Math.ceil(totalWords / (totalModules || 6));

        const prompt = `You are an expert instructional designer creating continuing education content for licensed professional counselors.

Generate COMPLETE, DETAILED content for ONE MODULE of a CE course.

COURSE: ${courseTitle || 'Mental Health Counseling CE Course'}
MODULE ${moduleNumber || 1} of ${totalModules || 6}: ${moduleTitle}
CATEGORY: ${catName}
TOTAL COURSE CE HOURS: ${ceHours || 3}

${sourceContent ? `SOURCE CONTENT TO EXPAND:\n${sourceContent.substring(0, 5000)}\n` : ''}
${additionalNotes ? `ADDITIONAL NOTES: ${additionalNotes}\n` : ''}

CRITICAL WORD COUNT REQUIREMENT:
This module MUST contain at least ${wordsForModule.toLocaleString()} words of educational content.
NBCC requires 6,000 words per CE credit hour. Do NOT write brief summaries - write FULL textbook-quality content.

${sourceContent ? `KNOWLEDGE CHECK PLACEMENT FROM SOURCE:
If the source content contains questions, quizzes, knowledge checks, or assessment items, you MUST:
- Preserve their approximate position relative to surrounding content topics
- Place each knowledge check AFTER the content section it tests (same as the original)
- Do NOT move all questions to the end — keep them distributed where the original author placed them
` : ''}
CRITICAL LAYOUT RULE: Distribute quiz questions THROUGHOUT the content. Do NOT place all questions at the end.
Each question should appear in the "questions" array with a "afterSection" field indicating which <h3> section it should follow.

Return ONLY valid JSON in this exact structure:
{
  "title": "${moduleTitle}",
  "description": "2-3 sentence module description",
  "content": "<h2>${moduleTitle}</h2><h3>Introduction</h3><p>Comprehensive opening (200+ words)...</p><h3>Theoretical Foundation</h3><p>Detailed theory section (400+ words)...</p><h3>Key Concepts</h3><p>In-depth concepts with definitions (500+ words)...</p><h3>Clinical Applications</h3><p>Practical techniques and interventions (500+ words)...</p><h3>Case Study</h3><p>Detailed clinical case illustration (400+ words)...</p><h3>Ethical Considerations</h3><p>ACA Code references and guidance (300+ words)...</p><h3>Evidence Base</h3><p>Research findings and citations (300+ words)...</p><h3>Summary</h3><p>Key takeaways (150+ words)...</p>"${generateQuiz !== false ? `,
  "questions": [
    {
      "question": "Detailed scenario-based question?",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct with content reference",
      "afterSection": "Key Concepts",
      "points": 1
    }
  ]` : ''}
}

CONTENT REQUIREMENTS:
- Write ${wordsForModule.toLocaleString()}+ words of actual educational content in the "content" field
- Use HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>
- Write as if for a professional textbook chapter
- Include specific clinical examples, techniques, and interventions
- Reference the ACA Code of Ethics where relevant
- Include research citations in the text (author, year format)
${generateQuiz !== false ? `- Generate 3-5 quiz questions that test comprehension and application
- Distribute questions throughout — each should test the content section it follows
- Mix question types: multiple_choice, multiple_select, true_false
- Include detailed explanations for all answers
- Set "afterSection" to the <h3> heading the question relates to` : ''}

Return ONLY the JSON object, no markdown code blocks.`;

        console.log(`[Job ${jobId}] Generating module ${moduleNumber}/${totalModules}: ${moduleTitle} (target: ${wordsForModule} words)`);

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16000,
          messages: [{ role: 'user', content: prompt }]
        });

        const responseText = response.content[0].text;
        let moduleData;

        try {
          let jsonText = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
          const startIdx = jsonText.indexOf('{');
          const endIdx = jsonText.lastIndexOf('}');
          if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) throw new Error('No JSON found');
          jsonText = jsonText.substring(startIdx, endIdx + 1);
          jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          moduleData = JSON.parse(jsonText);
        } catch (parseError) {
          console.error(`[Job ${jobId}] Parse error:`, parseError.message);
          // Salvage content from broken JSON
          const contentFieldMatch = responseText.match(/"content"\s*:\s*"((?:[^"\\]|\\["\\\/bfnrt]|\\u[0-9a-fA-F]{4})*)/);
          if (contentFieldMatch && contentFieldMatch[1].length > 200) {
            let salvaged = contentFieldMatch[1];
            salvaged = salvaged.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\t/g, '\t');
            salvaged = salvaged.replace(/",?\s*"(questions|title|description)"[\s\S]*$/, '');
            const questions = [];
            const qMatches = [...responseText.matchAll(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
            const oMatches = [...responseText.matchAll(/"options"\s*:\s*\[((?:[^\]]*?))\]/g)];
            const cMatches = [...responseText.matchAll(/"correctAnswer"\s*:\s*(\d+)/g)];
            const eMatches = [...responseText.matchAll(/"explanation"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
            for (let qi = 0; qi < qMatches.length; qi++) {
              const opts = oMatches[qi] ? [...oMatches[qi][1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => m[1].replace(/\\"/g, '"')) : [];
              if (opts.length >= 2) {
                questions.push({
                  question: qMatches[qi][1].replace(/\\"/g, '"'),
                  type: 'multiple_choice', options: opts,
                  correctAnswer: cMatches[qi] ? parseInt(cMatches[qi][1]) : 0,
                  explanation: eMatches[qi] ? eMatches[qi][1].replace(/\\"/g, '"') : '', points: 1
                });
              }
            }
            moduleData = { title: moduleTitle, description: 'Content salvaged from partial AI response', content: salvaged, questions };
          } else {
            const contentMatch = responseText.match(/<h[23]>[\s\S]+/);
            if (contentMatch) {
              moduleData = { title: moduleTitle, description: '', content: contentMatch[0].replace(/```\s*$/g, ''), questions: [] };
            } else {
              aiJobs.set(jobId, { status: 'error', error: 'Failed to parse AI response', createdAt: Date.now() });
              return;
            }
          }
        }

        const actualWords = (moduleData.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
        console.log(`[Job ${jobId}] Module ${moduleNumber} generated: ${actualWords} words, ${(moduleData.questions || []).length} questions`);

        aiJobs.set(jobId, {
          status: 'complete',
          createdAt: Date.now(),
          result: {
            success: true,
            module: {
              title: moduleData.title || moduleTitle,
              description: moduleData.description || '',
              content: moduleData.content || '',
              questions: moduleData.questions || [],
              wordCount: actualWords,
              targetWords: wordsForModule
            }
          }
        });
      } catch (error) {
        console.error(`[Job ${jobId}] Generation error:`, error.message);
        aiJobs.set(jobId, { status: 'error', error: error.message, createdAt: Date.now() });
      }
    })();

  } catch (error) {
    console.error('Module generation start error:', error);
    res.status(500).json({ error: 'Failed to start generation: ' + error.message });
  }
});

// @route   GET /api/admin/module/generate/status/:jobId
// @desc    Poll async generation job status
// @access  Admin only
router.get('/module/generate/status/:jobId', protect, adminOnly, async (req, res) => {
  const job = aiJobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ status: 'not_found', error: 'Job not found or expired' });
  }
  if (job.status === 'complete') {
    // Return result and clean up
    const result = job.result;
    aiJobs.delete(req.params.jobId);
    return res.json({ status: 'complete', ...result });
  }
  if (job.status === 'error') {
    const error = job.error;
    aiJobs.delete(req.params.jobId);
    return res.json({ status: 'error', error });
  }
  // Still processing
  res.json({ status: 'processing', moduleTitle: job.moduleTitle });
});

export default router;
