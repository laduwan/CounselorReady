import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG allowed.'), false);
    }
  }
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// POST /api/scan - Scan CE certificate and extract data
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert file to base64
    const base64Data = req.file.buffer.toString('base64');
    
    // Determine media type
    let mediaType = 'image/jpeg';
    if (req.file.mimetype === 'application/pdf') {
      mediaType = 'application/pdf';
    } else if (req.file.mimetype === 'image/png') {
      mediaType = 'image/png';
    }

    // Call Claude API to extract certificate data
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: mediaType === 'application/pdf' ? 'document' : 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: `Extract the following information from this CE certificate. Return ONLY a JSON object with these fields, no other text:

{
  "title": "course/training title",
  "provider": "organization/provider name",
  "completionDate": "YYYY-MM-DD format",
  "ceHours": number,
  "nbccApproved": true/false (look for NBCC, ACEP, or Approved Provider mentions),
  "acepNumber": "ACEP number if visible, otherwise null",
  "category": "one of: Ethics, Supervision, Telehealth, Cultural Diversity, Trauma, Core, Other"
}

If you cannot find a field, use null. For ceHours, extract the number only.`
            }
          ]
        }
      ]
    });

    // Parse the response
    let extractedData = null;
    const responseText = message.content[0].text;
    
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    if (!extractedData) {
      return res.status(422).json({ 
        error: 'Could not extract certificate data',
        raw: responseText 
      });
    }

    // Clean up the data
    const cleanedData = {
      title: extractedData.title || '',
      provider: extractedData.provider || '',
      completionDate: extractedData.completionDate || '',
      ceHours: parseFloat(extractedData.ceHours) || 0,
      nbccApproved: Boolean(extractedData.nbccApproved),
      acepNumber: extractedData.acepNumber || '',
      category: extractedData.category || 'Core'
    };

    res.json({ 
      success: true,
      extracted: cleanedData
    });

  } catch (error) {
    console.error('Certificate scan error:', error);
    res.status(500).json({ error: 'Failed to scan certificate' });
  }
});

// POST /api/scan/credential - Scan license/credential and extract data
router.post('/credential', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert file to base64
    const base64Data = req.file.buffer.toString('base64');
    
    // Determine media type
    let mediaType = 'image/jpeg';
    if (req.file.mimetype === 'application/pdf') {
      mediaType = 'application/pdf';
    } else if (req.file.mimetype === 'image/png') {
      mediaType = 'image/png';
    }

    // Call Claude API to extract credential/license data
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: mediaType === 'application/pdf' ? 'document' : 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: `Extract the following information from this professional license or credential document. Return ONLY a JSON object with these fields, no other text:

{
  "holderName": "IMPORTANT: The full name of the person this license was issued TO (the licensee/practitioner name, NOT the board or organization name)",
  "name": "credential/license type abbreviation (e.g., LPC, LMFT, NCC, LCSW)",
  "state": "two-letter state code if applicable (e.g., GA, FL, TX)",
  "licenseNumber": "license or certificate number",
  "issuingBody": "issuing organization (e.g., Georgia Composite Board, NBCC)",
  "issueDate": "YYYY-MM-DD format",
  "expirationDate": "YYYY-MM-DD format",
  "totalHours": "CE hours required for renewal if shown (number only)"
}

CRITICAL: holderName is the individual person's name who holds this license - look for phrases like "is hereby granted to", "issued to", "certifies that", or the name printed prominently on the license/certificate.

If you cannot find a field, use null. For state, only use 2-letter abbreviation.
For dates, convert to YYYY-MM-DD format.
For license type, use the standard abbreviation (LPC, LMFT, LCSW, NCC, etc).`
            }
          ]
        }
      ]
    });

    // Parse the response
    let extractedData = null;
    const responseText = message.content[0].text;
    
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    if (!extractedData) {
      return res.status(422).json({ 
        error: 'Could not extract credential data',
        raw: responseText 
      });
    }

    // Clean up the data
    const cleanedData = {
      holderName: extractedData.holderName || null,
      name: extractedData.name || '',
      state: extractedData.state || null,
      licenseNumber: extractedData.licenseNumber || '',
      issuingBody: extractedData.issuingBody || '',
      issueDate: extractedData.issueDate || null,
      expirationDate: extractedData.expirationDate || null,
      totalHours: extractedData.totalHours ? parseInt(extractedData.totalHours) : null
    };

    res.json({ 
      success: true,
      extracted: cleanedData
    });

  } catch (error) {
    console.error('Credential scan error:', error);
    res.status(500).json({ error: 'Failed to scan credential' });
  }
});

export default router;
