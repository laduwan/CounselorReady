/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import Course from '../models/Course.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { parseScormManifest, scormToCourse, createScormPackage } from '../utils/scorm.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// @route   POST /api/scorm/import
// @desc    Import a SCORM package
// @access  Private
router.post('/import', protect, requireAdmin, upload.single('scormPackage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract zip file
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    // Find manifest
    const manifestEntry = zipEntries.find(e => 
      e.entryName.toLowerCase() === 'imsmanifest.xml' ||
      e.entryName.toLowerCase().endsWith('/imsmanifest.xml')
    );

    if (!manifestEntry) {
      return res.status(400).json({ error: 'Invalid SCORM package: No imsmanifest.xml found' });
    }

    // Parse manifest
    const manifestXml = manifestEntry.getData().toString('utf8');
    const scormData = parseScormManifest(manifestXml);

    // Convert to course format
    const courseData = scormToCourse(scormData);
    
    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug: courseData.slug });
    if (existingCourse) {
      courseData.slug = `${courseData.slug}-${Date.now()}`;
    }

    // Create course
    const course = await Course.create(courseData);

    res.status(201).json({ 
      message: 'SCORM package imported successfully',
      course 
    });

  } catch (error) {
    console.error('SCORM import error:', error);
    res.status(500).json({ error: 'Failed to import SCORM package: ' + error.message });
  }
});

// @route   GET /api/scorm/export/:id
// @desc    Export a course as SCORM 1.2 package
// @access  Private
router.get('/export/:id', protect, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Generate SCORM package
    const zipBuffer = await createScormPackage(course);

    // Set headers for download
    const filename = `${course.slug || 'course'}_scorm.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', zipBuffer.length);

    res.send(zipBuffer);

  } catch (error) {
    console.error('SCORM export error:', error);
    res.status(500).json({ error: 'Failed to export SCORM package: ' + error.message });
  }
});

// @route   GET /api/scorm/preview/:id
// @desc    Preview SCORM manifest for a course
// @access  Private
router.get('/preview/:id', protect, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { generateScormManifest } = await import('../utils/scorm.js');
    const manifest = generateScormManifest(course);

    res.setHeader('Content-Type', 'application/xml');
    res.send(manifest);

  } catch (error) {
    console.error('SCORM preview error:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

export default router;
