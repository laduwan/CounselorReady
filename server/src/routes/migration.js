/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/json', 'text/csv', 'application/zip'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.json') || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JSON, CSV, or ZIP allowed.'), false);
    }
  }
});

// Middleware to check admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============================================
// EXPORT COURSES
// ============================================

// @route   GET /api/migration/export
// @desc    Export all courses as JSON
// @access  Private (Admin)
router.get('/export', protect, adminOnly, async (req, res) => {
  try {
    const courses = await Course.find({}).lean();
    
    // Clean up for export (remove internal IDs if needed)
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'CounselorReady',
      courseCount: courses.length,
      courses: courses.map(course => ({
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        description: course.description,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        instructorBio: course.instructorBio,
        ceuHours: course.ceuHours,
        ceuCategories: course.ceuCategories,
        ceuEligible: course.ceuEligible,
        ceuApprovalNumber: course.ceuApprovalNumber,
        accessTier: course.accessTier,
        status: course.status,
        objectives: course.objectives,
        targetAudience: course.targetAudience,
        settings: course.settings,
        modules: course.modules?.map(mod => ({
          title: mod.title,
          description: mod.description,
          order: mod.order,
          objectives: mod.objectives,
          lessons: mod.lessons?.map(lesson => ({
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
            isFree: lesson.isFree,
            resources: lesson.resources,
            transcript: lesson.transcript,
            questions: lesson.questions
          }))
        }))
      }))
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="courses_export_${Date.now()}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Export courses error:', error);
    res.status(500).json({ error: 'Failed to export courses' });
  }
});

// @route   GET /api/migration/export/:id
// @desc    Export single course as JSON
// @access  Private (Admin)
router.get('/export/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'CounselorReady',
      course: {
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        description: course.description,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        instructorBio: course.instructorBio,
        ceuHours: course.ceuHours,
        ceuCategories: course.ceuCategories,
        ceuEligible: course.ceuEligible,
        ceuApprovalNumber: course.ceuApprovalNumber,
        accessTier: course.accessTier,
        objectives: course.objectives,
        targetAudience: course.targetAudience,
        settings: course.settings,
        modules: course.modules
      }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${course.slug}_export.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Export course error:', error);
    res.status(500).json({ error: 'Failed to export course' });
  }
});

// @route   GET /api/migration/template
// @desc    Get import template (CSV format)
// @access  Private (Admin)
router.get('/template', protect, adminOnly, (req, res) => {
  const csvTemplate = `title,subtitle,description,instructor,ceuHours,category,accessTier,objectives,module1_title,module1_lessons
"Introduction to Telehealth","Best Practices for Online Counseling","This course covers essential telehealth practices...","Dr. Jane Smith",3,Telehealth,professional,"Objective 1|Objective 2|Objective 3","Module 1: Getting Started","Lesson 1: Overview|Lesson 2: Setup"
"Ethics in Counseling","Core Ethical Principles","A comprehensive review of ethical guidelines...","Dr. John Doe",2,Ethics,starter,"Objective 1|Objective 2","Module 1: Foundations","Lesson 1: Introduction|Lesson 2: Case Studies"`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="course_import_template.csv"');
  res.send(csvTemplate);
});

// ============================================
// IMPORT COURSES
// ============================================

// @route   POST /api/migration/import/json
// @desc    Import courses from JSON file
// @access  Private (Admin)
router.post('/import/json', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const jsonData = JSON.parse(req.file.buffer.toString());
    const courses = jsonData.courses || (jsonData.course ? [jsonData.course] : []);
    
    if (courses.length === 0) {
      return res.status(400).json({ error: 'No courses found in file' });
    }
    
    const results = {
      success: [],
      failed: [],
      skipped: []
    };
    
    for (const courseData of courses) {
      try {
        // Check if course with same slug exists
        const existingCourse = await Course.findOne({ slug: courseData.slug });
        
        if (existingCourse) {
          if (req.body.skipExisting === 'true') {
            results.skipped.push({ title: courseData.title, reason: 'Already exists' });
            continue;
          } else if (req.body.updateExisting === 'true') {
            // Update existing course
            Object.assign(existingCourse, courseData);
            await existingCourse.save();
            results.success.push({ title: courseData.title, action: 'updated', id: existingCourse._id });
            continue;
          }
          // Generate new slug
          courseData.slug = `${courseData.slug}-${Date.now()}`;
        }
        
        // Create new course
        const newCourse = await Course.create({
          ...courseData,
          status: 'draft', // Always import as draft for review
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        results.success.push({ title: courseData.title, action: 'created', id: newCourse._id });
      } catch (courseError) {
        results.failed.push({ 
          title: courseData.title || 'Unknown', 
          error: courseError.message 
        });
      }
    }
    
    res.json({
      message: `Import complete: ${results.success.length} success, ${results.failed.length} failed, ${results.skipped.length} skipped`,
      results
    });
  } catch (error) {
    console.error('Import JSON error:', error);
    res.status(500).json({ error: 'Failed to import: ' + error.message });
  }
});

// @route   POST /api/migration/import/csv
// @desc    Import courses from CSV file
// @access  Private (Admin)
router.post('/import/csv', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const csvContent = req.file.buffer.toString();
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must have header and at least one data row' });
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    const results = {
      success: [],
      failed: []
    };
    
    // Parse each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const rowData = {};
        
        headers.forEach((header, idx) => {
          rowData[header.trim()] = values[idx]?.trim() || '';
        });
        
        // Map CSV columns to course schema
        const courseData = {
          title: rowData.title,
          slug: rowData.slug || rowData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          subtitle: rowData.subtitle || '',
          description: rowData.description || '',
          instructor: rowData.instructor || 'CounselorReady',
          ceuHours: parseFloat(rowData.ceuHours) || 0,
          ceuCategories: rowData.category ? [{ category: rowData.category, hours: parseFloat(rowData.ceuHours) || 0 }] : [],
          ceuEligible: true,
          accessTier: rowData.accessTier || 'starter',
          objectives: rowData.objectives ? rowData.objectives.split('|').map(o => o.trim()) : [],
          status: 'draft',
          modules: []
        };
        
        // Parse modules from CSV (module1_title, module1_lessons, module2_title, etc.)
        for (let m = 1; m <= 10; m++) {
          const modTitle = rowData[`module${m}_title`];
          const modLessons = rowData[`module${m}_lessons`];
          
          if (modTitle) {
            const lessons = modLessons ? modLessons.split('|').map((lessonTitle, idx) => ({
              title: lessonTitle.trim(),
              type: 'text',
              content: '<p>Lesson content to be added.</p>',
              order: idx + 1
            })) : [];
            
            courseData.modules.push({
              title: modTitle,
              order: m,
              lessons
            });
          }
        }
        
        // Check for existing
        const existing = await Course.findOne({ slug: courseData.slug });
        if (existing) {
          courseData.slug = `${courseData.slug}-${Date.now()}`;
        }
        
        const newCourse = await Course.create(courseData);
        results.success.push({ title: courseData.title, id: newCourse._id });
        
      } catch (rowError) {
        results.failed.push({ row: i + 1, error: rowError.message });
      }
    }
    
    res.json({
      message: `CSV Import complete: ${results.success.length} success, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    console.error('Import CSV error:', error);
    res.status(500).json({ error: 'Failed to import CSV: ' + error.message });
  }
});

// Helper: Parse CSV line (handles quoted values)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(v => v.replace(/^"|"$/g, '').trim());
}

// ============================================
// TALENTLMS IMPORT
// ============================================

// @route   POST /api/migration/import/talentlms
// @desc    Import courses from TalentLMS API
// @access  Private (Admin)
router.post('/import/talentlms', protect, adminOnly, async (req, res) => {
  try {
    const { apiKey, domain, courseIds } = req.body;
    
    if (!apiKey || !domain) {
      return res.status(400).json({ error: 'TalentLMS API key and domain required' });
    }
    
    const baseUrl = `https://${domain}.talentlms.com/api/v1`;
    const authHeader = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
    
    // Fetch courses from TalentLMS
    const coursesResponse = await fetch(`${baseUrl}/courses`, {
      headers: { 'Authorization': authHeader }
    });
    
    if (!coursesResponse.ok) {
      const err = await coursesResponse.text();
      return res.status(400).json({ error: 'TalentLMS API error: ' + err });
    }
    
    let tlmsCourses = await coursesResponse.json();
    
    // Filter to specific course IDs if provided
    if (courseIds && courseIds.length > 0) {
      tlmsCourses = tlmsCourses.filter(c => courseIds.includes(c.id.toString()));
    }
    
    const results = {
      success: [],
      failed: []
    };
    
    for (const tlmsCourse of tlmsCourses) {
      try {
        // Fetch course details including content
        const detailsResponse = await fetch(`${baseUrl}/courses/id:${tlmsCourse.id}`, {
          headers: { 'Authorization': authHeader }
        });
        
        if (!detailsResponse.ok) continue;
        
        const courseDetails = await detailsResponse.json();
        
        // Map TalentLMS course to CounselorReady format
        const courseData = {
          title: courseDetails.name,
          slug: courseDetails.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
          description: courseDetails.description || '',
          instructor: courseDetails.creator_name || 'CounselorReady',
          ceuHours: parseFloat(courseDetails.custom_field_1) || 0, // Assuming CE hours in custom field
          ceuCategories: [{ 
            category: courseDetails.category_name || 'General', 
            hours: parseFloat(courseDetails.custom_field_1) || 0 
          }],
          ceuEligible: true,
          accessTier: 'starter',
          status: 'draft',
          modules: [],
          metadata: {
            importedFrom: 'TalentLMS',
            originalId: tlmsCourse.id,
            importedAt: new Date()
          }
        };
        
        // Fetch course content/units
        try {
          const unitsResponse = await fetch(`${baseUrl}/getcoursedata/id:${tlmsCourse.id}`, {
            headers: { 'Authorization': authHeader }
          });
          
          if (unitsResponse.ok) {
            const unitsData = await unitsResponse.json();
            
            // Map units to modules/lessons
            if (unitsData.units && unitsData.units.length > 0) {
              let moduleOrder = 1;
              
              for (const unit of unitsData.units) {
                const module = {
                  title: unit.name || `Module ${moduleOrder}`,
                  order: moduleOrder,
                  lessons: []
                };
                
                // Map unit content to lessons
                if (unit.units) {
                  let lessonOrder = 1;
                  for (const subunit of unit.units) {
                    module.lessons.push({
                      title: subunit.name || `Lesson ${lessonOrder}`,
                      type: mapTalentLMSType(subunit.type),
                      content: subunit.data || '<p>Content imported from TalentLMS</p>',
                      videoUrl: subunit.type === 'Video' ? subunit.data : null,
                      duration: parseInt(subunit.duration) || 10,
                      order: lessonOrder
                    });
                    lessonOrder++;
                  }
                }
                
                courseData.modules.push(module);
                moduleOrder++;
              }
            }
          }
        } catch (unitsError) {
          console.log('Could not fetch units for course:', tlmsCourse.id);
        }
        
        // If no modules, create a placeholder
        if (courseData.modules.length === 0) {
          courseData.modules.push({
            title: 'Module 1',
            order: 1,
            lessons: [{
              title: 'Introduction',
              type: 'text',
              content: '<p>Content to be migrated manually.</p>',
              order: 1
            }]
          });
        }
        
        const newCourse = await Course.create(courseData);
        results.success.push({ 
          title: courseData.title, 
          id: newCourse._id,
          originalId: tlmsCourse.id
        });
        
      } catch (courseError) {
        results.failed.push({ 
          title: tlmsCourse.name, 
          originalId: tlmsCourse.id,
          error: courseError.message 
        });
      }
    }
    
    res.json({
      message: `TalentLMS import complete: ${results.success.length} success, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    console.error('TalentLMS import error:', error);
    res.status(500).json({ error: 'Failed to import from TalentLMS: ' + error.message });
  }
});

// Helper: Map TalentLMS content type to CounselorReady lesson type
function mapTalentLMSType(tlmsType) {
  const typeMap = {
    'Video': 'video',
    'HTML': 'text',
    'Document': 'text',
    'Test': 'quiz',
    'Survey': 'text',
    'Assignment': 'text',
    'SCORM': 'text',
    'Web content': 'text'
  };
  return typeMap[tlmsType] || 'text';
}

// @route   GET /api/migration/talentlms/courses
// @desc    Fetch available courses from TalentLMS (preview)
// @access  Private (Admin)
router.post('/talentlms/preview', protect, adminOnly, async (req, res) => {
  try {
    const { apiKey, domain } = req.body;
    
    if (!apiKey || !domain) {
      return res.status(400).json({ error: 'TalentLMS API key and domain required' });
    }
    
    const baseUrl = `https://${domain}.talentlms.com/api/v1`;
    const authHeader = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
    
    const response = await fetch(`${baseUrl}/courses`, {
      headers: { 'Authorization': authHeader }
    });
    
    if (!response.ok) {
      const err = await response.text();
      return res.status(400).json({ error: 'TalentLMS API error: ' + err });
    }
    
    const courses = await response.json();
    
    res.json({
      connected: true,
      courseCount: courses.length,
      courses: courses.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        category: c.category_name,
        status: c.status
      }))
    });
  } catch (error) {
    console.error('TalentLMS preview error:', error);
    res.status(500).json({ error: 'Failed to connect to TalentLMS: ' + error.message });
  }
});

// ============================================
// COURSE DUPLICATION
// ============================================

// @route   POST /api/migration/duplicate/:id
// @desc    Duplicate a course
// @access  Private (Admin)
router.post('/duplicate/:id', protect, adminOnly, async (req, res) => {
  try {
    const original = await Course.findById(req.params.id).lean();
    
    if (!original) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Remove _id fields recursively
    const removeIds = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(removeIds);
      } else if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const key of Object.keys(obj)) {
          if (key !== '_id' && key !== '__v') {
            newObj[key] = removeIds(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };
    
    const duplicateData = removeIds(original);
    duplicateData.title = `${original.title} (Copy)`;
    duplicateData.slug = `${original.slug}-copy-${Date.now()}`;
    duplicateData.status = 'draft';
    duplicateData.enrollmentCount = 0;
    duplicateData.analytics = {
      views: 0,
      uniqueViews: 0,
      enrollments: 0,
      completions: 0,
      completionRate: 0,
      avgRating: 0,
      totalRatings: 0
    };
    duplicateData.ratings = [];
    duplicateData.createdAt = new Date();
    duplicateData.updatedAt = new Date();
    
    const newCourse = await Course.create(duplicateData);
    
    res.json({
      message: 'Course duplicated successfully',
      course: {
        id: newCourse._id,
        title: newCourse.title,
        slug: newCourse.slug
      }
    });
  } catch (error) {
    console.error('Duplicate course error:', error);
    res.status(500).json({ error: 'Failed to duplicate course' });
  }
});

export default router;
