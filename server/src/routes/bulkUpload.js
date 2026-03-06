/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Bulk Course Upload Routes
 * Handles uploading and parsing multiple course documents (DOCX, PDF, MD, TXT)
 */

import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import { parseCourseMarkdown, transformToCourseModel, parseMultipleCourses } from '../utils/courseParser.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for bulk uploads
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/zip',
      'application/x-zip-compressed'
    ];
    const allowedExtensions = ['.docx', '.pdf', '.txt', '.md', '.zip'];
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype} (${ext}). Allowed: DOCX, PDF, TXT, MD, ZIP`), false);
    }
  }
});

// Admin middleware
const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * Extract text from various document formats
 */
async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'txt':
    case 'md':
      return buffer.toString('utf-8');
      
    case 'docx':
      return await extractDocxText(buffer);
      
    case 'pdf':
      return await extractPdfText(buffer);
      
    default:
      throw new Error(`Unsupported file format: .${ext}`);
  }
}

/**
 * Extract text from DOCX using basic XML parsing
 * Uses fast-xml-parser which is already in dependencies
 */
async function extractDocxText(buffer) {
  try {
    const zip = new AdmZip(buffer);
    const documentXml = zip.readAsText('word/document.xml');
    
    if (!documentXml) {
      throw new Error('Invalid DOCX file: missing document.xml');
    }
    
    // Extract text content from XML
    // Simple regex-based extraction that works for most documents
    const textContent = documentXml
      // Remove XML tags but keep text content
      .replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, '$1')
      // Handle paragraph breaks
      .replace(/<\/w:p>/g, '\n')
      // Handle tab characters
      .replace(/<w:tab[^/]*\/>/g, '\t')
      // Remove all remaining XML tags
      .replace(/<[^>]+>/g, '')
      // Decode XML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      // Clean up whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    return textContent;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

/**
 * Extract text from PDF
 * Note: This is a basic extraction - for complex PDFs, consider adding pdf-parse dependency
 */
async function extractPdfText(buffer) {
  try {
    // Basic PDF text extraction using regex
    // This works for simple text-based PDFs
    const pdfString = buffer.toString('binary');
    
    // Look for text streams in the PDF
    const textMatches = [];
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;
    
    while ((match = streamRegex.exec(pdfString)) !== null) {
      const streamContent = match[1];
      // Extract text from Tj and TJ operators
      const tjRegex = /\(([^)]*)\)\s*Tj/g;
      const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
      
      let textMatch;
      while ((textMatch = tjRegex.exec(streamContent)) !== null) {
        textMatches.push(textMatch[1]);
      }
      while ((textMatch = tjArrayRegex.exec(streamContent)) !== null) {
        const arrayContent = textMatch[1];
        const stringRegex = /\(([^)]*)\)/g;
        let strMatch;
        while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
          textMatches.push(strMatch[1]);
        }
      }
    }
    
    if (textMatches.length === 0) {
      // If basic extraction fails, try to read as text (some PDFs are text-based)
      const textContent = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      if (textContent.length > 100) {
        return textContent;
      }
      throw new Error('Could not extract text from PDF. The PDF may be image-based or encrypted.');
    }
    
    // Decode and join text
    const text = textMatches
      .map(t => t
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
      )
      .join(' ');
    
    return text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Process uploaded files and extract documents
 */
async function processUploadedFiles(files) {
  const documents = [];
  
  for (const file of files) {
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    if (ext === 'zip') {
      // Extract files from ZIP
      const zip = new AdmZip(file.buffer);
      const entries = zip.getEntries();
      
      for (const entry of entries) {
        if (entry.isDirectory) continue;
        
        const entryName = entry.entryName;
        const entryExt = entryName.split('.').pop().toLowerCase();
        
        // Skip hidden files and non-document files
        if (entryName.startsWith('__MACOSX') || entryName.startsWith('.')) continue;
        if (!['txt', 'md', 'docx', 'pdf'].includes(entryExt)) continue;
        
        try {
          const entryBuffer = entry.getData();
          const text = await extractTextFromBuffer(entryBuffer, entryName);
          documents.push({
            filename: entryName.split('/').pop(),
            text,
            originalFile: file.originalname
          });
        } catch (error) {
          console.error(`Failed to extract ${entryName}:`, error);
          documents.push({
            filename: entryName.split('/').pop(),
            error: error.message,
            originalFile: file.originalname
          });
        }
      }
    } else {
      // Single file
      try {
        const text = await extractTextFromBuffer(file.buffer, file.originalname);
        documents.push({
          filename: file.originalname,
          text
        });
      } catch (error) {
        console.error(`Failed to extract ${file.originalname}:`, error);
        documents.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }
  }
  
  return documents;
}

// ===========================================
// ROUTES
// ===========================================

/**
 * @route   POST /api/admin/courses/bulk-upload
 * @desc    Upload and parse multiple course documents
 * @access  Admin only
 */
router.post('/bulk-upload', protect, adminOnly, upload.array('files', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Parse default options from request body
    const defaults = {
      accessType: req.body.accessType || 'paid',
      accessTier: req.body.accessTier || 'professional',
      price: req.body.price ? parseFloat(req.body.price) : null,
      pricingTier: req.body.pricingTier || 'standard',
      approvingBody: req.body.approvingBody || 'NBCC',
      approvalNumber: req.body.approvalNumber || '7760',
      ceuApprovalNumber: req.body.ceuApprovalNumber || '7760',
      instructor: req.body.instructor || 'GA Integrated Therapeutic Perspectives LLC'
    };
    
    const autoSave = req.body.autoSave === 'true' || req.body.autoSave === true;
    
    console.log(`Processing ${req.files.length} uploaded file(s)...`);
    
    // Extract text from all files
    const documents = await processUploadedFiles(req.files);
    
    // Filter out failed extractions
    const validDocuments = documents.filter(d => !d.error && d.text);
    const failedExtractions = documents.filter(d => d.error);
    
    if (validDocuments.length === 0) {
      return res.status(400).json({
        error: 'No valid documents found',
        details: failedExtractions.map(d => ({ filename: d.filename, error: d.error }))
      });
    }
    
    console.log(`Parsing ${validDocuments.length} valid document(s)...`);
    
    // Parse courses using AI
    const parseResults = await parseMultipleCourses(validDocuments, defaults);
    
    // Separate successes and failures
    const successfulParses = parseResults.filter(r => r.success);
    const failedParses = parseResults.filter(r => !r.success);
    
    // If autoSave is enabled, save courses to database
    const savedCourses = [];
    const saveErrors = [];
    
    if (autoSave && successfulParses.length > 0) {
      for (const result of successfulParses) {
        try {
          // Add createdBy
          result.course.createdBy = req.user._id;
          
          // Check for duplicate slug
          let slug = result.course.slug;
          const existingCourse = await Course.findOne({ slug });
          if (existingCourse) {
            slug = slug + '-' + Date.now().toString(36);
            result.course.slug = slug;
          }
          
          const course = await Course.create(result.course);
          savedCourses.push({
            filename: result.filename,
            courseId: course._id,
            title: course.title,
            slug: course.slug,
            ceuHours: course.ceuHours,
            moduleCount: course.modules.length
          });
        } catch (error) {
          console.error(`Failed to save course from ${result.filename}:`, error);
          saveErrors.push({
            filename: result.filename,
            error: error.message
          });
        }
      }
    }
    
    res.json({
      message: `Processed ${req.files.length} file(s)`,
      summary: {
        filesUploaded: req.files.length,
        documentsExtracted: documents.length,
        successfullyParsed: successfulParses.length,
        failedToParse: failedParses.length,
        saved: savedCourses.length,
        saveErrors: saveErrors.length
      },
      // Return parsed courses (for preview or manual save)
      courses: autoSave 
        ? savedCourses 
        : successfulParses.map(r => ({
            filename: r.filename,
            course: r.course
          })),
      // Include errors for debugging
      errors: {
        extraction: failedExtractions.map(d => ({ filename: d.filename, error: d.error })),
        parsing: failedParses.map(r => ({ filename: r.filename, error: r.error })),
        saving: saveErrors
      }
    });
    
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Bulk upload failed: ' + error.message });
  }
});

/**
 * @route   POST /api/admin/courses/bulk-save
 * @desc    Save previewed courses to database
 * @access  Admin only
 */
router.post('/bulk-save', protect, adminOnly, async (req, res) => {
  try {
    const { courses } = req.body;
    
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: 'No courses provided' });
    }
    
    const savedCourses = [];
    const errors = [];
    
    for (const courseData of courses) {
      try {
        // Add createdBy
        courseData.createdBy = req.user._id;
        
        // Check for duplicate slug
        let slug = courseData.slug;
        const existingCourse = await Course.findOne({ slug });
        if (existingCourse) {
          slug = slug + '-' + Date.now().toString(36);
          courseData.slug = slug;
        }
        
        const course = await Course.create(courseData);
        savedCourses.push({
          courseId: course._id,
          title: course.title,
          slug: course.slug,
          ceuHours: course.ceuHours
        });
      } catch (error) {
        console.error(`Failed to save course "${courseData.title}":`, error);
        errors.push({
          title: courseData.title,
          error: error.message
        });
      }
    }
    
    res.json({
      message: `Saved ${savedCourses.length} of ${courses.length} courses`,
      saved: savedCourses,
      errors
    });
    
  } catch (error) {
    console.error('Bulk save error:', error);
    res.status(500).json({ error: 'Bulk save failed: ' + error.message });
  }
});

/**
 * @route   POST /api/admin/courses/parse-preview
 * @desc    Parse a single file and return preview without saving
 * @access  Admin only
 */
router.post('/parse-preview', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const defaults = {
      accessType: req.body.accessType || 'paid',
      accessTier: req.body.accessTier || 'professional',
      price: req.body.price ? parseFloat(req.body.price) : null,
      pricingTier: req.body.pricingTier || 'standard',
      approvingBody: req.body.approvingBody || 'NBCC',
      approvalNumber: req.body.approvalNumber || '7760',
      ceuApprovalNumber: req.body.ceuApprovalNumber || '7760',
      instructor: req.body.instructor || 'GA Integrated Therapeutic Perspectives LLC'
    };
    
    // Extract text
    const text = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
    
    // Parse with deterministic parser
    const parsed = parseCourseMarkdown(text);
    const course = transformToCourseModel(parsed, defaults);
    
    res.json({
      message: 'Course parsed successfully',
      filename: req.file.originalname,
      course
    });
    
  } catch (error) {
    console.error('Parse preview error:', error);
    res.status(500).json({ error: 'Failed to parse file: ' + error.message });
  }
});

export default router;
