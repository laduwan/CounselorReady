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
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import { parseDocumentToInteractiveCourse, buildValidationReport } from '../utils/bulkImportParser.js';

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
 * Default course metadata from the admin settings panel. accessType is
 * validated against InteractiveCourse's real enum (free/subscription/purchase)
 * — the legacy 'paid'/'accessTier' fields don't exist on this schema.
 */
function buildDefaultsFromBody(body) {
  return {
    accessType: body.accessType,
    price: body.price ? parseFloat(body.price) : null,
    pricingTier: body.pricingTier || 'standard',
    category: body.category || 'Clinical Practice',
    ceHours: body.ceHours ? parseFloat(body.ceHours) : 3,
    approvalBody: body.approvingBody || body.approvalBody || 'NBCC',
    acepNumber: body.approvalNumber || body.acepNumber || '7760',
    instructor: body.instructor || 'GA Integrated Therapeutic Perspectives LLC'
  };
}

/**
 * @route   POST /api/admin/courses/bulk-upload
 * @desc    Upload and import multiple course documents as InteractiveCourse drafts
 * @access  Admin only
 */
router.post('/bulk-upload', protect, adminOnly, upload.array('files', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const defaults = buildDefaultsFromBody(req.body);
    const autoSave = req.body.autoSave === 'true' || req.body.autoSave === true;

    console.log(`Processing ${req.files.length} uploaded file(s)...`);

    // Extract text from all files (unchanged extraction pipeline)
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

    console.log(`Importing ${validDocuments.length} valid document(s) into InteractiveCourse drafts...`);

    const parsed = [];
    const parseErrors = [];
    for (const doc of validDocuments) {
      try {
        const course = await parseDocumentToInteractiveCourse(doc.text, defaults);
        parsed.push({ filename: doc.filename, course });
      } catch (error) {
        console.error(`Failed to parse ${doc.filename}:`, error);
        parseErrors.push({ filename: doc.filename, error: error.message });
      }
    }

    // autoSave still only means "save immediately vs. preview first" — content
    // status is ALWAYS 'draft'/isPublished:false regardless, set inside the parser.
    const savedCourses = [];
    const saveErrors = [];

    if (autoSave && parsed.length > 0) {
      for (const { filename, course } of parsed) {
        try {
          course.createdBy = req.user._id;

          // Duplicate-slug suffixing, now checked against interactivecourses.
          const existing = await InteractiveCourse.findOne({ slug: course.slug });
          if (existing) course.slug = course.slug + '-' + Date.now().toString(36);

          const saved = await InteractiveCourse.create(course);
          savedCourses.push({
            filename,
            courseId: saved._id,
            title: saved.title,
            slug: saved.slug,
            ceHours: saved.ceHours,
            sectionCount: saved.sections.length,
            status: saved.status,
            validation: buildValidationReport(saved.toObject())
          });
        } catch (error) {
          console.error(`Failed to save course from ${filename}:`, error);
          saveErrors.push({ filename, error: error.message });
        }
      }
    }

    res.json({
      message: `Processed ${req.files.length} file(s)`,
      summary: {
        filesUploaded: req.files.length,
        documentsExtracted: documents.length,
        successfullyParsed: parsed.length,
        failedToParse: parseErrors.length,
        saved: savedCourses.length,
        saveErrors: saveErrors.length
      },
      // Return parsed courses (for preview or manual save) — unsaved courses
      // include a validation report too, computed against the in-memory object.
      courses: autoSave
        ? savedCourses
        : parsed.map(p => ({
            filename: p.filename,
            course: p.course,
            validation: buildValidationReport(p.course)
          })),
      errors: {
        extraction: failedExtractions.map(d => ({ filename: d.filename, error: d.error })),
        parsing: parseErrors,
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
 * @desc    Save previewed InteractiveCourse drafts to the database
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
        courseData.createdBy = req.user._id;
        // Always draft on save, regardless of what the preview payload carried.
        courseData.status = 'draft';
        courseData.isPublished = false;

        // Duplicate-slug suffixing, checked against interactivecourses.
        let slug = courseData.slug;
        const existing = await InteractiveCourse.findOne({ slug });
        if (existing) {
          slug = slug + '-' + Date.now().toString(36);
          courseData.slug = slug;
        }

        const saved = await InteractiveCourse.create(courseData);
        savedCourses.push({
          courseId: saved._id,
          title: saved.title,
          slug: saved.slug,
          ceHours: saved.ceHours,
          validation: buildValidationReport(saved.toObject())
        });
      } catch (error) {
        console.error(`Failed to save course "${courseData.title}":`, error);
        errors.push({ title: courseData.title, error: error.message });
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
 * @desc    Parse a single file and return an InteractiveCourse-shaped preview without saving
 * @access  Admin only
 */
router.post('/parse-preview', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const defaults = buildDefaultsFromBody(req.body);
    const text = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
    const course = await parseDocumentToInteractiveCourse(text, defaults);

    res.json({
      message: 'Course parsed successfully',
      filename: req.file.originalname,
      course,
      validation: buildValidationReport(course)
    });

  } catch (error) {
    console.error('Parse preview error:', error);
    res.status(500).json({ error: 'Failed to parse file: ' + error.message });
  }
});

export default router;
