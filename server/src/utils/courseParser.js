/**
 * Course Parser Utility - CounselorReady Format
 * Parses course content from the specific markdown format used by CounselorReady
 * This is a deterministic parser (no AI) that matches the exact structure
 */

/**
 * Parse course content from markdown text
 * @param {string} text - Raw markdown content
 * @returns {object} - Structured course data
 */
export function parseCourseMarkdown(text) {
  const course = {
    title: '',
    subtitle: '',
    description: '',
    ceuHours: 3,
    ceuCategories: [],
    level: 'Intermediate',
    objectives: [],
    modules: [],
    quiz: {
      title: 'Post-Test Assessment',
      questions: []
    },
    bibliography: []
  };

  // Normalize line endings
  const content = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // === PARSE TITLE ===
  // Format: # Course: Title Here
  const titleMatch = content.match(/^#\s*Course:\s*(.+)$/m);
  if (titleMatch) {
    course.title = titleMatch[1].trim();
  }

  // === PARSE CE HOURS AND CATEGORY ===
  // Format: ## 3.0 CE Hours | Clinical Practice
  const ceMatch = content.match(/^##\s*([\d.]+)\s*CE\s*Hours?\s*\|\s*(.+)$/m);
  if (ceMatch) {
    course.ceuHours = parseFloat(ceMatch[1]);
    const category = ceMatch[2].trim();
    course.ceuCategories = [{ category, hours: course.ceuHours }];
  }

  // === PARSE COURSE INFORMATION SECTION ===
  const courseInfoMatch = content.match(/##\s*COURSE INFORMATION\s*\n([\s\S]*?)(?=\n---|\n##\s)/);
  if (courseInfoMatch) {
    const infoSection = courseInfoMatch[1];
    
    // Get description
    const descMatch = infoSection.match(/\*\*Course Description:\*\*\s*(.+?)(?=\n\n|\n\*\*)/s);
    if (descMatch) {
      course.description = descMatch[1].trim();
    }

    // Get level
    const levelMatch = infoSection.match(/\*\*Course Level:\*\*\s*(\w+)/);
    if (levelMatch) {
      course.level = levelMatch[1].trim();
    }
  }

  // === PARSE LEARNING OBJECTIVES ===
  const objectivesMatch = content.match(/##\s*LEARNING OBJECTIVES\s*\n([\s\S]*?)(?=\n---|\n##\s)/);
  if (objectivesMatch) {
    const objSection = objectivesMatch[1];
    // Match numbered objectives like: 1. **Explain** the cognitive model...
    const objRegex = /^\d+\.\s*\*\*([^*]+)\*\*\s*(.+?)(?=\n\d+\.|\n\n|$)/gm;
    let objMatch;
    while ((objMatch = objRegex.exec(objSection)) !== null) {
      const verb = objMatch[1].trim();
      const rest = objMatch[2].trim().replace(/\s+/g, ' ');
      course.objectives.push(`${verb} ${rest}`);
    }
  }

  // === PARSE VIDEO RESOURCES ===
  // Build a map of videos by module number
  const videoMap = new Map();
  
  // Format 1: ### Module X Videos: followed by bullet points
  const videoSectionMatch = content.match(/##\s*INTEGRATED VIDEO RESOURCES\s*\n([\s\S]*?)(?=\n---|\n##\s)/);
  if (videoSectionMatch) {
    const videoSection = videoSectionMatch[1];
    
    // Find each module's videos
    const moduleVideoRegex = /###\s*Module\s*(\d+)\s*Videos?:?\s*\n([\s\S]*?)(?=\n###|\n\n\n|$)/gi;
    let mvMatch;
    while ((mvMatch = moduleVideoRegex.exec(videoSection)) !== null) {
      const moduleNum = parseInt(mvMatch[1]);
      const videosText = mvMatch[2];
      
      // Parse individual videos
      // Format: - **Video X.X:** "Title" by Author (Duration)
      //           - YouTube: URL
      const videoRegex = /-\s*\*\*Video\s*[\d.]+:\*\*\s*"([^"]+)"\s*(?:by\s*)?([^(]+)?\s*\(([^)]+)\)\s*\n\s*-?\s*YouTube:\s*(https?:\/\/[^\s\n]+)/gi;
      let vidMatch;
      const videos = [];
      while ((vidMatch = videoRegex.exec(videosText)) !== null) {
        videos.push({
          title: vidMatch[1].trim(),
          author: vidMatch[2] ? vidMatch[2].trim() : '',
          duration: vidMatch[3].trim(),
          url: vidMatch[4].trim()
        });
      }
      if (videos.length > 0) {
        videoMap.set(moduleNum, videos);
      }
    }
  }

  // Also check VIDEO RESOURCES SUMMARY table
  const videoTableMatch = content.match(/##\s*VIDEO RESOURCES SUMMARY\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/);
  if (videoTableMatch && videoMap.size === 0) {
    const tableSection = videoTableMatch[1];
    // Parse table rows: | 1.1 | Title | Duration | URL |
    const rowRegex = /\|\s*([\d.]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|\n]+)/g;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableSection)) !== null) {
      const videoNum = rowMatch[1].trim();
      const moduleNum = parseInt(videoNum.split('.')[0]);
      const title = rowMatch[2].trim();
      const duration = rowMatch[3].trim();
      const url = rowMatch[4].trim();
      
      if (!videoMap.has(moduleNum)) {
        videoMap.set(moduleNum, []);
      }
      videoMap.get(moduleNum).push({
        title,
        duration,
        url: url.startsWith('http') ? url : `https://www.${url}`
      });
    }
  }

  // === PARSE MODULES FROM NARRATIVE SCRIPT ===
  // Find the narrative script or course content section
  let contentSection = content;
  const narrativeMatch = content.match(/##\s*NARRATIVE SCRIPT\s*\n([\s\S]*?)(?=\n##\s*POST-TEST|\n##\s*VIDEO RESOURCES SUMMARY|$)/);
  if (narrativeMatch) {
    contentSection = narrativeMatch[1];
  } else {
    // Try COURSE CONTENT SUMMARY
    const summaryMatch = content.match(/##\s*COURSE CONTENT SUMMARY\s*\n([\s\S]*?)(?=\n##\s*POST-TEST|$)/);
    if (summaryMatch) {
      contentSection = summaryMatch[1];
    }
  }

  // Parse modules: ### MODULE X: Title (XX minutes) or ### Module X: Title
  const moduleRegex = /###\s*(?:MODULE\s*)?(\d+):\s*([^\n(]+)(?:\s*\((\d+)\s*minutes?\))?/gi;
  const moduleMatches = [...contentSection.matchAll(moduleRegex)];
  
  for (let i = 0; i < moduleMatches.length; i++) {
    const match = moduleMatches[i];
    const moduleNum = parseInt(match[1]);
    const moduleTitle = match[2].trim();
    const duration = match[3] ? parseInt(match[3]) : 30;
    
    // Get content between this module and the next (or end)
    const startIdx = match.index + match[0].length;
    const endIdx = i < moduleMatches.length - 1 
      ? moduleMatches[i + 1].index 
      : contentSection.length;
    const moduleContent = contentSection.substring(startIdx, endIdx).trim();

    // Create module
    const module = {
      title: `Module ${moduleNum}: ${moduleTitle}`,
      description: extractFirstParagraph(moduleContent),
      order: moduleNum,
      objectives: [],
      lessons: []
    };

    // Add text lesson with module content
    const htmlContent = markdownToHtml(moduleContent);
    module.lessons.push({
      title: moduleTitle,
      type: 'text',
      content: htmlContent,
      duration: Math.max(10, duration - (videoMap.has(moduleNum) ? 15 : 0)),
      order: 1,
      isFree: moduleNum === 1 && module.lessons.length === 0
    });

    // Add video lessons for this module
    if (videoMap.has(moduleNum)) {
      const videos = videoMap.get(moduleNum);
      videos.forEach((video, idx) => {
        module.lessons.push({
          title: `Video: ${video.title}`,
          type: 'video',
          content: `Watch: "${video.title}"${video.author ? ` by ${video.author}` : ''}`,
          videoUrl: video.url,
          duration: parseDuration(video.duration),
          order: module.lessons.length + 1,
          isFree: false
        });
      });
    }

    course.modules.push(module);
  }

  // If no modules found, try simpler format (### Module N: Title)
  if (course.modules.length === 0) {
    const simpleModuleRegex = /###\s*Module\s*(\d+):\s*([^\n]+)/gi;
    const simpleMatches = [...content.matchAll(simpleModuleRegex)];
    
    for (const match of simpleMatches) {
      const moduleNum = parseInt(match[1]);
      const moduleTitle = match[2].trim();
      
      course.modules.push({
        title: `Module ${moduleNum}: ${moduleTitle}`,
        description: '',
        order: moduleNum,
        objectives: [],
        lessons: [{
          title: moduleTitle,
          type: 'text',
          content: `<h2>${moduleTitle}</h2><p>Module content.</p>`,
          duration: 20,
          order: 1,
          isFree: moduleNum === 1
        }]
      });
    }
  }

  // === PARSE QUIZ QUESTIONS ===
  const quizMatch = content.match(/##\s*POST-TEST QUESTIONS\s*\n([\s\S]*?)(?=\n##\s*POST-TEST ANSWER KEY|\n##\s*VIDEO|\n---\s*\n##|$)/);
  const answerKeyMatch = content.match(/##\s*POST-TEST ANSWER KEY\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/);
  
  if (quizMatch) {
    const quizSection = quizMatch[1];
    
    // Build answer key map
    const answerMap = new Map();
    if (answerKeyMatch) {
      const keySection = answerKeyMatch[1];
      // Format: 1. **B** - Description
      const keyRegex = /^(\d+)\.\s*\*\*([A-D])\*\*/gm;
      let keyMatch;
      while ((keyMatch = keyRegex.exec(keySection)) !== null) {
        const qNum = parseInt(keyMatch[1]);
        const answer = keyMatch[2].toUpperCase();
        // Convert A=0, B=1, C=2, D=3
        answerMap.set(qNum, answer.charCodeAt(0) - 65);
      }
    }

    // Parse questions
    // Format: **1. Question text:**
    //         a) Option A
    //         b) Option B
    const questionRegex = /\*\*(\d+)\.\s*([^*]+)\*\*\s*\n([\s\S]*?)(?=\n\*\*\d+\.|\n\n---|\n##|$)/g;
    let qMatch;
    while ((qMatch = questionRegex.exec(quizSection)) !== null) {
      const qNum = parseInt(qMatch[1]);
      const questionText = qMatch[2].trim().replace(/:$/, '');
      const optionsText = qMatch[3].trim();
      
      // Parse options (a, b, c, d format)
      const options = [];
      const optionRegex = /^([a-d])\)\s*(.+)$/gm;
      let optMatch;
      while ((optMatch = optionRegex.exec(optionsText)) !== null) {
        options.push(optMatch[2].trim());
      }

      if (options.length >= 2) {
        course.quiz.questions.push({
          question: questionText,
          type: 'multiple_choice',
          options: options,
          correctAnswer: answerMap.get(qNum) ?? 0,
          explanation: '',
          points: 1
        });
      }
    }
  }

  // === PARSE BIBLIOGRAPHY ===
  const bibMatch = content.match(/##\s*BIBLIOGRAPHY\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/);
  if (bibMatch) {
    const bibSection = bibMatch[1].trim();
    // Split by double newlines or by lines starting with author
    const citations = bibSection.split(/\n\n+/).filter(c => c.trim().length > 10);
    course.bibliography = citations.map(c => c.trim().replace(/\s+/g, ' '));
  }

  return course;
}

/**
 * Extract first paragraph from markdown text
 */
function extractFirstParagraph(text) {
  const cleaned = text
    .replace(/^---+$/gm, '')
    .replace(/📺[^]*?\n/g, '')
    .replace(/\*\*WATCH NOW[^]*?\n/g, '')
    .trim();
  
  const firstPara = cleaned.split(/\n\n/)[0];
  return firstPara
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, 300);
}

/**
 * Parse duration string like "10:19" or "10 minutes" to minutes
 */
function parseDuration(durationStr) {
  if (!durationStr) return 10;
  
  // Format: "10:19" (mm:ss)
  const timeMatch = durationStr.match(/(\d+):(\d+)/);
  if (timeMatch) {
    return parseInt(timeMatch[1]) + Math.ceil(parseInt(timeMatch[2]) / 60);
  }
  
  // Format: "10 minutes"
  const minMatch = durationStr.match(/(\d+)\s*min/i);
  if (minMatch) {
    return parseInt(minMatch[1]);
  }
  
  return 10;
}

/**
 * Convert markdown to basic HTML
 */
function markdownToHtml(md) {
  let html = md
    // Remove watch now sections
    .replace(/📺\s*\*\*WATCH NOW[^]*?(?=\n---|\n\n\*\*|$)/g, '')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^####\s*(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s*(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s*(.+)$/gm, '<h2>$1</h2>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr/>')
    // Bullet lists
    .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Paragraphs - wrap remaining text blocks
    .split(/\n\n+/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<')) return block;
      return `<p>${block.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  return html;
}

/**
 * Transform parsed course data into database-ready format
 * @param {object} parsed - Parsed course data
 * @param {object} defaults - Default values to apply
 * @returns {object} - Database-ready course object
 */
export function transformToCourseModel(parsed, defaults = {}) {
  // Generate slug from title
  const slug = (parsed.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36));

  // Process modules
  const modules = (parsed.modules || []).map((mod, moduleIndex) => {
    const lessons = (mod.lessons || []).map((lesson, lessonIndex) => ({
      title: lesson.title || `Lesson ${lessonIndex + 1}`,
      type: lesson.type || 'text',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || 10,
      order: lesson.order || lessonIndex + 1,
      isFree: lesson.isFree || (moduleIndex === 0 && lessonIndex === 0),
      resources: lesson.resources || [],
      transcript: lesson.transcript || '',
      questions: [],
      shuffleQuestions: false,
      shuffleOptions: false,
      showExplanations: true,
      timeLimit: null
    }));

    return {
      title: mod.title || `Module ${moduleIndex + 1}`,
      description: mod.description || '',
      order: mod.order || moduleIndex + 1,
      objectives: mod.objectives || [],
      lessons
    };
  });

  // Add quiz as final lesson in last module if quiz exists
  if (parsed.quiz && parsed.quiz.questions && parsed.quiz.questions.length > 0) {
    const lastModuleIndex = modules.length - 1;
    
    // If no modules exist, create one for the quiz
    if (lastModuleIndex < 0) {
      modules.push({
        title: 'Assessment',
        description: 'Course assessment',
        order: 1,
        objectives: [],
        lessons: []
      });
    }
    
    const targetModule = modules[modules.length - 1];
    
    const quizLesson = {
      title: parsed.quiz.title || 'Post-Test Assessment',
      type: 'quiz',
      content: `Assessment covering all course material. ${parsed.quiz.questions.length} questions. 70% required to pass.`,
      duration: Math.max(20, Math.round(parsed.quiz.questions.length * 1.5)),
      order: targetModule.lessons.length + 1,
      isFree: false,
      resources: [],
      transcript: '',
      questions: parsed.quiz.questions.map(q => ({
        question: q.question,
        type: q.type || 'multiple_choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        points: q.points || 1
      })),
      shuffleQuestions: true,
      shuffleOptions: true,
      showExplanations: true,
      timeLimit: null
    };
    targetModule.lessons.push(quizLesson);
  }

  // Build course object
  const course = {
    title: parsed.title,
    slug,
    subtitle: parsed.subtitle || '',
    description: parsed.description || '',
    thumbnail: null,
    
    // CE Info
    ceuEligible: true,
    ceuHours: parsed.ceuHours || 3,
    ceuCategories: parsed.ceuCategories || [{ category: 'Clinical Practice', hours: parsed.ceuHours || 3 }],
    ceuApprovalNumber: defaults.ceuApprovalNumber || '7760',
    
    // Approving body
    approvingBody: defaults.approvingBody || 'NBCC',
    approvalNumber: defaults.approvalNumber || '7760',
    applicability: 'national',
    applicableStates: [],
    stateCompliance: [],
    
    // Content
    objectives: parsed.objectives || [],
    modules,
    
    // Pricing & Access
    accessType: defaults.accessType || 'paid',
    price: defaults.price || null,
    pricingTier: defaults.pricingTier || 'standard',
    accessTier: defaults.accessTier || 'professional',
    
    // Settings
    settings: {
      linearProgression: true,
      dripEnabled: false,
      certificateEnabled: true,
      passingScore: 70,
      allowRetakes: true,
      retakePolicy: 'unlimited',
      maxRetakes: 3,
      retakeCooldown: 0,
      scorePolicy: 'highest',
      enforceMinTime: false,
      minTimePercent: 80,
      requireEvaluation: true,
      requireAttestation: true,
      attestationText: 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance.',
      narrationEnabled: false,
      narrationVoice: 'nova',
      narrationSpeed: 1.0,
      autoPlayNarration: false
    },
    
    // Default evaluation questions
    evaluationQuestions: [
      { question: 'The learning objectives were clearly stated.', type: 'rating', required: true },
      { question: 'The course content was relevant to my practice.', type: 'rating', required: true },
      { question: 'The video demonstrations enhanced my learning.', type: 'rating', required: true },
      { question: 'I will be able to apply what I learned to my practice.', type: 'rating', required: true },
      { question: 'Overall, I was satisfied with this course.', type: 'rating', required: true },
      { question: 'How could this course be improved?', type: 'text', required: false }
    ],
    
    // Metadata
    instructor: defaults.instructor || 'GA Integrated Therapeutic Perspectives LLC',
    status: 'draft',
    importType: 'native',
    source: 'native',
    isExternal: false
  };

  return course;
}

/**
 * Parse multiple course documents
 * @param {Array<{text: string, filename: string}>} documents
 * @param {object} defaults
 * @returns {Array<object>}
 */
export function parseMultipleCourses(documents, defaults = {}) {
  const results = [];
  
  for (const doc of documents) {
    try {
      console.log(`Parsing course from: ${doc.filename}`);
      const parsed = parseCourseMarkdown(doc.text);
      
      if (!parsed.title) {
        throw new Error('Could not extract course title');
      }
      
      const course = transformToCourseModel(parsed, defaults);
      results.push({
        success: true,
        filename: doc.filename,
        course,
        summary: {
          title: course.title,
          ceuHours: course.ceuHours,
          modules: course.modules.length,
          lessons: course.modules.reduce((sum, m) => sum + m.lessons.length, 0),
          objectives: course.objectives.length,
          quizQuestions: parsed.quiz?.questions?.length || 0
        }
      });
    } catch (error) {
      console.error(`Failed to parse ${doc.filename}:`, error);
      results.push({
        success: false,
        filename: doc.filename,
        error: error.message
      });
    }
  }
  
  return results;
}

export default {
  parseCourseMarkdown,
  transformToCourseModel,
  parseMultipleCourses
};
