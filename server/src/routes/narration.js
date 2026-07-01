/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/narration.js
// Narration API routes for CounselorReady
// ========================================
// Provides endpoints for TTS generation, cost estimation,
// and provider management. Requires admin authentication.
//
// Mount in index.js:
//   import narrationRoutes from './routes/narration.js';
//   app.use('/api/narration', narrationRoutes);
//
// Required env vars:
//   NARRATION_PROVIDER=elevenlabs (or openai, polly)
//   ELEVENLABS_API_KEY=your-key
//   + Cloudinary vars (already configured)
// ========================================

import express from 'express';
import mongoose from 'mongoose';
import narrationService from '../services/narrationService.js';

const router = express.Router();

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────────
// Reuse your existing auth middleware. Adjust import path as needed.
// Narration should be admin-only to control costs.

import { protect, requireAdmin } from '../middleware/auth.js';
import { Course } from '../models/InteractiveCourse.js';

// ─── GET /api/narration/provider ────────────────────────────────
// Returns current provider info and available voice presets

router.get('/provider', protect, requireAdmin, (req, res) => {
  try {
    const info = narrationService.getProviderInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/narration/voices ──────────────────────────────────
// Returns available voice presets for the active provider

router.get('/voices', protect, requireAdmin, (req, res) => {
  try {
    const provider = req.query.provider || undefined;
    const presets = narrationService.getVoicePresets(provider);
    res.json({
      provider: provider || process.env.NARRATION_PROVIDER || 'openai',
      presets: Object.entries(presets).map(([id, config]) => ({
        id,
        label: config.label,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/narration/estimate ───────────────────────────────
// Estimate cost/duration for narrating a course without generating audio
// Body: { course: { sections: [...] }, provider?, voicePreset? }

router.post('/estimate', protect, requireAdmin, (req, res) => {
  try {
    const { course, provider } = req.body;

    if (!course) {
      return res.status(400).json({ error: 'Course data required' });
    }

    const estimate = narrationService.estimateNarrationCost(course, provider);
    res.json(estimate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/narration/block ──────────────────────────────────
// Generate narration for a single block
// Body: { block: {...}, courseId?, moduleIndex?, blockIndex?, voicePreset?, provider? }

router.post('/block', protect, requireAdmin, async (req, res) => {
  try {
    const { block, courseId, moduleIndex, blockIndex, voicePreset, provider } = req.body;

    if (!block || !block.type) {
      return res.status(400).json({ error: 'Block with type required' });
    }

    // Check narratability first
    const text = narrationService.extractNarrableText(block);
    if (!text || text.trim().length < 10) {
      return res.json({
        skipped: true,
        reason: 'Block has no narratable content',
        blockType: block.type,
      });
    }

    console.log(`🎙️ Narrating ${block.type} block (${text.length} chars)...`);

    const result = await narrationService.narrateBlock(block, {
      courseId,
      moduleIndex,
      blockIndex,
      voicePreset,
      provider,
    });

    // Save narration URL back to the database
    if (!result.skipped && result.url && courseId && moduleIndex != null && blockIndex != null) {
      try {
        // Try interactivecourses collection first (modules.contentBlocks)
        const moduleUpdate = await Course.collection.updateOne(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { $set: {
            [`modules.${moduleIndex}.contentBlocks.${blockIndex}.narrationUrl`]: result.url,
            [`modules.${moduleIndex}.contentBlocks.${blockIndex}.narrationDuration`]: result.duration,
            [`modules.${moduleIndex}.contentBlocks.${blockIndex}.narrationPublicId`]: result.publicId,
          }}
        );
        // If no match, try sections.contentBlocks
        if (moduleUpdate.matchedCount === 0) {
          await Course.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(courseId) },
            { $set: {
              [`sections.${moduleIndex}.contentBlocks.${blockIndex}.narrationUrl`]: result.url,
              [`sections.${moduleIndex}.contentBlocks.${blockIndex}.narrationDuration`]: result.duration,
              [`sections.${moduleIndex}.contentBlocks.${blockIndex}.narrationPublicId`]: result.publicId,
            }}
          );
        }
        console.log(`💾 Saved narration URL to DB for block ${moduleIndex}.${blockIndex}`);
      } catch (dbErr) {
        console.warn(`⚠️ Audio generated but DB save failed: ${dbErr.message}`);
        // Don't fail the request — audio was generated successfully
      }
    }

    console.log(`✅ Narration complete: ${result.url || 'skipped'}`);
    res.json(result);
  } catch (error) {
    console.error('❌ Narration error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/narration/module ─────────────────────────────────
// Generate narration for all blocks in a module
// Body: { blocks: [...], courseId?, moduleIndex?, voicePreset?, provider? }

router.post('/module', protect, requireAdmin, async (req, res) => {
  try {
    const { blocks, courseId, moduleIndex, voicePreset, provider } = req.body;

    if (!blocks || !Array.isArray(blocks)) {
      return res.status(400).json({ error: 'Blocks array required' });
    }

    console.log(`🎙️ Narrating module (${blocks.length} blocks)...`);

    const results = await narrationService.narrateModule(blocks, {
      courseId,
      moduleIndex,
      voicePreset,
      provider,
    });

    const narrated = results.filter(r => !r.skipped && !r.error).length;
    const skipped = results.filter(r => r.skipped).length;
    const errors = results.filter(r => r.error).length;

    console.log(`✅ Module narration: ${narrated} narrated, ${skipped} skipped, ${errors} errors`);

    res.json({
      results,
      summary: { narrated, skipped, errors },
    });
  } catch (error) {
    console.error('❌ Module narration error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/narration/course ─────────────────────────────────
// Generate narration for an entire course (all modules)
// Body: { course: { _id, sections: [...] }, voicePreset?, provider? }
// ⚠️ This can take several minutes for large courses!

router.post('/course', protect, requireAdmin, async (req, res) => {
  try {
    const { course, voicePreset, provider } = req.body;

    if (!course || (!course.sections && !course.modules)) {
      return res.status(400).json({ error: 'Course with sections/modules required' });
    }

    const courseTitle = course.title || course.courseCode || 'Unknown';
    console.log(`🎙️ Starting full course narration: "${courseTitle}"...`);

    const result = await narrationService.narrateCourse(course, {
      voicePreset,
      provider,
    });

    console.log(`✅ Course narration complete: ${result.summary.narrated} blocks, ${result.summary.totalDurationFormatted}`);

    res.json(result);
  } catch (error) {
    console.error('❌ Course narration error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/narration/preview ────────────────────────────────
// Generate a short audio preview (first 200 chars of provided text)
// Useful for voice selection before committing to full narration
// Body: { text?: string, voicePreset?, provider? }

router.post('/preview', protect, requireAdmin, async (req, res) => {
  try {
    const { text, voicePreset, provider } = req.body;
    const previewText = (text || 'Welcome to CounselorReady. This course will help you meet your continuing education requirements while building practical clinical skills.').substring(0, 250);

    const activeProvider = provider || process.env.NARRATION_PROVIDER || 'openai';
    const voiceOptions = { provider: activeProvider };

    // Apply voice preset
    const presets = narrationService.getVoicePresets(activeProvider);
    if (voicePreset && presets[voicePreset]) {
      Object.assign(voiceOptions, presets[voicePreset]);
    }

    console.log(`🎙️ Generating voice preview (${activeProvider}/${voicePreset || 'default'})...`);

    const audioBuffer = await narrationService.generateSpeech(previewText, voiceOptions);

    // Return audio directly as base64 for quick preview (no Cloudinary upload)
    const base64Audio = audioBuffer.toString('base64');

    res.json({
      audio: base64Audio,
      format: 'mp3',
      text: previewText,
      provider: activeProvider,
      voicePreset: voicePreset || 'default',
      charCount: previewText.length,
    });
  } catch (error) {
    console.error('❌ Preview error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/narration/text ───────────────────────────────────
// Low-level: generate speech from raw text, upload to Cloudinary
// Body: { text, courseId?, label?, voicePreset?, provider? }

router.post('/text', protect, requireAdmin, async (req, res) => {
  try {
    const { text, courseId, label, voicePreset, provider } = req.body;

    if (!text || text.length < 5) {
      return res.status(400).json({ error: 'Text must be at least 5 characters' });
    }

    if (text.length > 50000) {
      return res.status(400).json({ error: 'Text exceeds maximum length (50,000 chars)' });
    }

    const activeProvider = provider || process.env.NARRATION_PROVIDER || 'openai';
    const voiceOptions = { provider: activeProvider };

    const presets = narrationService.getVoicePresets(activeProvider);
    if (voicePreset && presets[voicePreset]) {
      Object.assign(voiceOptions, presets[voicePreset]);
    }

    // Preprocess text
    const processed = narrationService.preprocessText(text);
    const audioBuffer = await narrationService.generateSpeech(processed, voiceOptions);

    // Upload to Cloudinary
    const folder = `counselorready/narration/${courseId || 'custom'}`;
    const publicId = `${folder}/${label || `custom_${Date.now()}`}`;

    const uploadResult = await new Promise((resolve, reject) => {
      const { Readable } = require('stream');
      const { v2: cloudinary } = require('cloudinary');

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', public_id: publicId, format: 'mp3', overwrite: true },
        (error, result) => error ? reject(error) : resolve(result)
      );

      const readable = new Readable();
      readable.push(audioBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    res.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      duration: uploadResult.duration,
      bytes: uploadResult.bytes,
      charCount: processed.length,
      provider: activeProvider,
    });
  } catch (error) {
    console.error('❌ Text narration error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
