/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
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
  // Try multiple section header formats
  let contentSection = content;
  const sectionPatterns = [
    /##\s*NARRATIVE SCRIPT\s*\n([\s\S]*?)(?=\n##\s*POST-TEST|\n##\s*VIDEO RESOURCES SUMMARY|\n##\s*BIBLIOGRAPHY|$)/,
    /##\s*COURSE CONTENT(?:\s+SUMMARY)?\s*\n([\s\S]*?)(?=\n##\s*POST-TEST|\n##\s*BIBLIOGRAPHY|$)/,
    /##\s*CONTENT\s*\n([\s\S]*?)(?=\n##\s*POST-TEST|\n##\s*BIBLIOGRAPHY|$)/,
    /##\s*COURSE MATERIAL\s*\n([\s\S]*?)(?=\n##\s*POST-TEST|\n##\s*BIBLIOGRAPHY|$)/
  ];
  
  for (const pattern of sectionPatterns) {
    const sectionMatch = content.match(pattern);
    if (sectionMatch) {
      contentSection = sectionMatch[1];
      break;
    }
  }

  // Parse modules with flexible heading detection
  // Matches: ### MODULE X: Title, ### Module X: Title, ## Module X: Title,
  //          ### Section X: Title, ### Part X: Title, ### X. Title, ### X: Title
  const moduleRegex = /^(?:#{2,3})\s*(?:MODULE|Module|SECTION|Section|PART|Part)?\s*(\d+)[.:]\s*([^\n(]+)(?:\s*\((\d+)\s*minutes?\))?/gim;
  const moduleMatches = [...contentSection.matchAll(moduleRegex)];
  
  if (moduleMatches.length > 0) {
    // Check for content BEFORE the first module (intro/overview)
    const preModuleContent = contentSection.substring(0, moduleMatches[0].index).trim();
    if (preModuleContent.length > 200) {
      // Significant intro content — add as Module 0 / Introduction
      const introHtml = markdownToHtml(preModuleContent);
      course.modules.push({
        title: 'Introduction',
        description: extractFirstParagraph(preModuleContent),
        order: 0,
        objectives: [],
        lessons: [{
          title: 'Course Introduction',
          type: 'text',
          content: introHtml,
          duration: 10,
          order: 1,
          isFree: true
        }]
      });
    }

    for (let i = 0; i < moduleMatches.length; i++) {
      const match = moduleMatches[i];
      const moduleNum = parseInt(match[1]);
      const moduleTitle = match[2].trim();
      const duration = match[3] ? parseInt(match[3]) : 30;
      
      // Get ALL content between this module heading and the next (or end)
      const startIdx = match.index + match[0].length;
      const endIdx = i < moduleMatches.length - 1 
        ? moduleMatches[i + 1].index 
        : contentSection.length;
      const moduleContent = contentSection.substring(startIdx, endIdx).trim();

      if (!moduleContent) {
        console.warn(`Parser: Module ${moduleNum} "${moduleTitle}" has no content between headings`);
      }

      // Create module
      const module = {
        title: `Module ${moduleNum}: ${moduleTitle}`,
        description: extractFirstParagraph(moduleContent),
        order: moduleNum,
        objectives: [],
        lessons: []
      };

      // Add text lesson with full module content
      const htmlContent = markdownToHtml(moduleContent);
      module.lessons.push({
        title: moduleTitle,
        type: 'text',
        content: htmlContent,
        duration: Math.max(10, duration - (videoMap.has(moduleNum) ? 15 : 0)),
        order: 1,
        isFree: moduleNum === 1 && course.modules.length === 0
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
  }

  // Fallback: if no modules found with numbered headings, try to find ANY ### headings as sections
  if (course.modules.length === 0) {
    const anyHeadingRegex = /^###\s+(.+)$/gm;
    const headingMatches = [...contentSection.matchAll(anyHeadingRegex)];
    
    if (headingMatches.length > 0) {
      for (let i = 0; i < headingMatches.length; i++) {
        const match = headingMatches[i];
        const sectionTitle = match[1].trim();
        
        // Get content between this heading and the next
        const startIdx = match.index + match[0].length;
        const endIdx = i < headingMatches.length - 1 
          ? headingMatches[i + 1].index 
          : contentSection.length;
        const sectionContent = contentSection.substring(startIdx, endIdx).trim();
        
        const htmlContent = markdownToHtml(sectionContent);
        course.modules.push({
          title: sectionTitle,
          description: extractFirstParagraph(sectionContent),
          order: i + 1,
          objectives: [],
          lessons: [{
            title: sectionTitle,
            type: 'text',
            content: htmlContent || `<p>${sectionTitle}</p>`,
            duration: 20,
            order: 1,
            isFree: i === 0
          }]
        });
      }
    }
  }

  // Last resort: if still no modules, treat the entire content section as one module
  if (course.modules.length === 0 && contentSection.trim().length > 100) {
    console.warn('Parser: No module headings found. Creating single module from all content.');
    const htmlContent = markdownToHtml(contentSection);
    course.modules.push({
      title: course.title || 'Course Content',
      description: extractFirstParagraph(contentSection),
      order: 1,
      objectives: [],
      lessons: [{
        title: course.title || 'Course Content',
        type: 'text',
        content: htmlContent,
        duration: 30,
        order: 1,
        isFree: true
      }]
    });
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

  // === PARSE BIBLIOGRAPHY / REFERENCES ===
  // Try multiple header formats: BIBLIOGRAPHY, REFERENCES, WORKS CITED
  const bibPatterns = [
    /##\s*BIBLIOGRAPHY\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/,
    /##\s*REFERENCES\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/,
    /##\s*WORKS?\s*CITED\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/i
  ];

  for (const bibPattern of bibPatterns) {
    const bibMatch = content.match(bibPattern);
    if (bibMatch) {
      const bibSection = bibMatch[1].trim();
      // Split by double newlines or by lines that start with a new APA entry
      // APA entries start with Author last name (capital letter) or indented continuation
      const rawEntries = bibSection.split(/\n\n+/).filter(c => c.trim().length > 10);

      // Preserve full APA citations — do NOT collapse internal whitespace within entries
      // Only normalize line breaks within a single entry (continuation lines)
      course.bibliography = rawEntries.map(entry => {
        // Join continuation lines (lines within one entry) with a single space
        // but preserve the full citation text including italics markers
        return entry.trim().replace(/\n\s*/g, ' ').replace(/\s{2,}/g, ' ');
      });
      break;
    }
  }

  return course;
}

/**
 * Extract first paragraph from markdown text for module description
 * Only removes single-line emoji prefixes, never multi-line greedy matches
 */
function extractFirstParagraph(text) {
  if (!text) return '';
  
  const cleaned = text
    // Remove horizontal rules (single-line only)
    .replace(/^---+$/gm, '')
    // Remove single-line video references (NOT greedy multi-line)
    .replace(/^📺[^\n]*$/gm, '')
    .replace(/^\*\*WATCH NOW[^\n]*$/gm, '')
    .trim();
  
  // Get first meaningful paragraph (skip empty lines)
  const paragraphs = cleaned.split(/\n\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length === 0) return '';
  
  const firstPara = paragraphs[0];
  return firstPara
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Strip bold markers
    .replace(/\*([^*]+)\*/g, '$1')       // Strip italic markers
    .replace(/^#+\s*/gm, '')             // Strip heading markers
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, 500);  // Increased from 300 to 500 for better descriptions
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
 * CRITICAL: This function must PRESERVE all content. Never strip or remove content.
 * Video/media references are converted to styled callout boxes, not deleted.
 */
function markdownToHtml(md) {
  if (!md || typeof md !== 'string') return '';

  // Step 1: Convert video/media references to styled callout boxes (NEVER strip them)
  let html = md
    .replace(/📺\s*\*\*WATCH NOW[^\n]*\*\*[^\n]*/g, (match) => {
      // Convert to a visible callout instead of deleting
      const cleaned = match.replace(/📺/g, '').replace(/\*\*/g, '').trim();
      return `<div class="video-callout" style="background:#f0f7ff;border-left:4px solid #4A7C59;padding:12px;margin:12px 0;border-radius:4px;"><strong>📺 ${cleaned}</strong></div>`;
    });

  // Step 2: Handle blockquotes (before paragraph wrapping)
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

  // Step 3: Handle tables — convert markdown tables to HTML tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (match, headerRow, sepRow, bodyRows) => {
    const headers = headerRow.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = bodyRows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table style="width:100%;border-collapse:collapse;margin:12px 0;"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Step 4: Inline formatting
  html = html
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic (but not inside URLs or already-processed tags)
    .replace(/(?<![a-zA-Z:\/])\*([^*\n]+)\*(?![a-zA-Z])/g, '<em>$1</em>')
    // Headers (process largest first to avoid conflicts)
    .replace(/^####\s*(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s*(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s*(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s*(.+)$/gm, '<h1>$1</h1>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr/>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Step 5: Handle lists properly — collect consecutive list items into list blocks
  // Supports both bullet and numbered lists, including nested/indented items
  const lines = html.split('\n');
  const processedLines = [];
  let inBulletList = false;
  let inNumberedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    // Detect indented sub-items (nested lists)
    const indentedBulletMatch = line.match(/^\s{2,}[-*]\s+(.+)$/);
    const indentedNumberedMatch = line.match(/^\s{2,}\d+\.\s+(.+)$/);

    if (indentedBulletMatch && (inBulletList || inNumberedList)) {
      // Nested bullet inside a list — keep as sub-item
      processedLines.push(`<li style="margin-left:1.5em">${indentedBulletMatch[1]}</li>`);
    } else if (indentedNumberedMatch && (inBulletList || inNumberedList)) {
      processedLines.push(`<li style="margin-left:1.5em">${indentedNumberedMatch[1]}</li>`);
    } else if (bulletMatch) {
      if (!inBulletList) {
        if (inNumberedList) { processedLines.push('</ol>'); inNumberedList = false; }
        processedLines.push('<ul>');
        inBulletList = true;
      }
      processedLines.push(`<li>${bulletMatch[1]}</li>`);
    } else if (numberedMatch) {
      if (!inNumberedList) {
        if (inBulletList) { processedLines.push('</ul>'); inBulletList = false; }
        processedLines.push('<ol>');
        inNumberedList = true;
      }
      processedLines.push(`<li>${numberedMatch[1]}</li>`);
    } else {
      if (inBulletList) { processedLines.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { processedLines.push('</ol>'); inNumberedList = false; }
      processedLines.push(line);
    }
  }
  // Close any open lists
  if (inBulletList) processedLines.push('</ul>');
  if (inNumberedList) processedLines.push('</ol>');

  html = processedLines.join('\n');

  // Step 6: Wrap remaining text blocks in paragraphs
  // CRITICAL: Never discard content. Every non-empty block must produce output.
  html = html
    .split(/\n\n+/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      // Don't wrap blocks that are already HTML elements
      if (/^<(?:h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|div|blockquote|hr|p|pre|code)/i.test(block)) return block;
      // Don't wrap blocks that contain block-level elements
      if (/<(?:ul|ol|table|div|blockquote|h[1-6])/i.test(block)) return block;
      // Preserve APA-style references (lines starting with author names / hanging indent patterns)
      // These are typically single-spaced entries that should each be their own <p>
      if (/^[A-Z][a-z]+,\s+[A-Z]/.test(block) && /\(\d{4}\)/.test(block)) {
        // APA reference entry — wrap in cr-reference class for proper hanging indent
        const entries = block.split(/\n/).filter(l => l.trim());
        return entries.map(entry => `<p class="cr-reference">${entry.trim()}</p>`).join('\n');
      }
      return `<p>${block.replace(/\n/g, ' ')}</p>`;
    })
    .filter(block => block !== '')
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
