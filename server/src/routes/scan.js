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

// POST /api/scan - Scan certificate and extract data
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
  "learnerName": "name of the person who completed the training",
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
      learnerName: extractedData.learnerName || '',
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

    // Call Claude API to extract license/credential data
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
              text: `Extract the following information from this professional license, certification, or credential document. Return ONLY a JSON object with these fields, no other text:

{
  "name": "credential type (e.g., LPC, LCSW, NCC, LMFT)",
  "state": "two-letter state code if applicable (e.g., GA, FL, TX)",
  "licenseNumber": "license or certificate number",
  "issuingBody": "issuing organization or board name",
  "issueDate": "YYYY-MM-DD format or null",
  "expirationDate": "YYYY-MM-DD format or null",
  "holderName": "name of the license holder",
  "credentialType": "one of: state_license, national_cert, specialty_cert, training",
  "totalHours": "CE hours required for renewal if mentioned, otherwise null"
}

If you cannot find a field, use null. Look for state board seals, license numbers, expiration dates, and credential types like LPC, LCSW, LMFT, NCC, CCMHC, ACS, etc.`
            }
          ]
        }
      ]
    });

    // Parse the response
    let extractedData = null;
    const responseText = message.content[0].text;
    
    try {
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
      name: extractedData.name || '',
      state: extractedData.state || '',
      licenseNumber: extractedData.licenseNumber || '',
      issuingBody: extractedData.issuingBody || '',
      issueDate: extractedData.issueDate || '',
      expirationDate: extractedData.expirationDate || '',
      holderName: extractedData.holderName || '',
      credentialType: extractedData.credentialType || 'state_license',
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
