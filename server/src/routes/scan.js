import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import CredentialTemplate from '../models/CredentialTemplate.js';

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

// Helper to convert state code to full name for search suggestions
const stateNames = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};
const getStateName = (code) => stateNames[code?.toUpperCase()] || code;

// GET /api/scan/test - Test AI scan configuration
router.get('/test', protect, async (req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    apiKeyConfigured: false,
    apiKeyPrefix: null,
    anthropicConnection: false,
    anthropicError: null
  };
  
  // Check if API key exists
  if (process.env.ANTHROPIC_API_KEY) {
    results.apiKeyConfigured = true;
    // Show first 8 chars for verification (safe to expose)
    results.apiKeyPrefix = process.env.ANTHROPIC_API_KEY.substring(0, 8) + '...';
  }
  
  // Try a minimal API call
  if (results.apiKeyConfigured) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "ok"' }]
      });
      
      if (response?.content?.[0]?.text) {
        results.anthropicConnection = true;
        results.testResponse = response.content[0].text;
      }
    } catch (error) {
      results.anthropicError = {
        message: error.message,
        status: error.status,
        type: error.error?.type
      };
    }
  }
  
  res.json(results);
});

// POST /api/scan - Scan CE certificate and extract data
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    // Check if AI service is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(503).json({ error: 'AI scanning service not configured. Please contact support.' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file uploaded' });
    }
    
    console.log(`Scanning certificate: ${req.file.originalname} (${req.file.mimetype}, ${(req.file.buffer.length / 1024).toFixed(1)}KB)`);

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
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
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
  "category": "one of: Ethics, Supervision, Telehealth, Cultural Diversity, Trauma, Core, General, Other",
  "approvingBody": "The organization that approved/accredited this CE (see list below)",
  "approvalNumber": "Any approval/provider number visible (ACEP#, provider#, etc.)",
  "applicability": "national or state-specific (see rules below)",
  "applicableStates": ["array of state codes if state-specific, empty array if national"],
  "learnerName": "Full name of the person who completed the training (the certificate recipient)"
}

APPROVING BODY - Look for these and extract exactly:
- "NBCC" - National Board for Certified Counselors
- "ACEP" - Approved Continuing Education Provider (NBCC program)
- "ACA" - American Counseling Association
- "NASW" - National Association of Social Workers
- "APA" - American Psychological Association
- "ASWB" - Association of Social Work Boards
- "AAMFT" - American Association for Marriage and Family Therapy
- State boards: "LPCAGA" (Georgia), "Florida Board", "Texas Board", etc.
- If multiple approvals, list the primary/first one

APPLICABILITY RULES:
- If approved by NBCC, ACEP, ACA, NASW, APA, ASWB, AAMFT → "national" (applies to all states)
- If approved by a state board, analyze the content:
  - If the content discusses STATE-SPECIFIC laws, rules, regulations, or statutes → "state-specific"
  - If the content is general clinical practice, theory, or skills → "national" (even if state-approved)
- Look for keywords: "Georgia law", "Florida statutes", "[State] rules" = state-specific
- General topics like "trauma treatment", "CBT techniques", "ethics principles" = national

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
      category: extractedData.category || 'Core',
      approvingBody: extractedData.approvingBody || null,
      approvalNumber: extractedData.approvalNumber || '',
      applicability: extractedData.applicability || 'national',
      applicableStates: extractedData.applicableStates || [],
      learnerName: extractedData.learnerName || null
    };

    res.json({ 
      success: true,
      extracted: cleanedData
    });

  } catch (error) {
    console.error('Certificate scan error:', error);
    console.error('Error details:', error.message, error.status, error.error);
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to scan certificate';
    if (error.status === 401 || error.message?.includes('API key')) {
      errorMessage = 'AI service authentication error. Please contact support.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid file format. Please upload a PDF, JPG, or PNG.';
    } else if (error.status === 413 || error.message?.includes('too large')) {
      errorMessage = 'File too large for scanning. Max 10MB.';
    } else if (error.message?.includes('network') || error.code === 'ECONNREFUSED') {
      errorMessage = 'Network error connecting to AI service.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
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
      model: 'claude-3-5-sonnet-20241022',
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
  "name": "credential/license type abbreviation (e.g., LPC, LMFT, NCC, LCSW, MBTC)",
  "state": "two-letter state code of the ISSUING state (e.g., GA, FL, TX, ID) - IMPORTANT: This is the state that ISSUED the license, NOT the licensee's home address state",
  "licenseNumber": "license or certificate number",
  "issuingBody": "issuing organization (e.g., Georgia Composite Board, NBCC, Idaho Division of Occupational and Professional Licenses)",
  "issueDate": "YYYY-MM-DD format",
  "expirationDate": "YYYY-MM-DD format",
  "totalHours": "CE hours required for renewal if shown (number only)"
}

CRITICAL INSTRUCTIONS:
1. holderName is the individual person's name who holds this license - look for phrases like "is hereby granted to", "issued to", "certifies that", or the name printed prominently on the license/certificate.

2. For STATE: Look at the header/letterhead, the issuing board name, or URL if visible. The state is determined by WHO ISSUED the license, not where the licensee lives. For example:
   - "Idaho Division of Occupational and Professional Licenses" → state: "ID"
   - "Georgia Composite Board" → state: "GA"  
   - URL containing "idaho.gov" → state: "ID"
   - URL containing "georgia.gov" → state: "GA"

3. For TELEHEALTH licenses: Look for terms like "Telehealth", "Telemental Health", "Mental or Behavioral Telehealth". These are special licenses allowing out-of-state practice INTO a specific state.

If you cannot find a field, use null. For state, only use 2-letter abbreviation.
For dates, convert to YYYY-MM-DD format.
For license type, use the standard abbreviation (LPC, LMFT, LCSW, NCC, MBTC, etc).`
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

    // Lookup template to auto-fill CE requirements
    if (cleanedData.name && cleanedData.state) {
      try {
        const template = await CredentialTemplate.findOne({
          name: { $regex: new RegExp(`^${cleanedData.name}$`, 'i') },
          state: cleanedData.state.toUpperCase(),
          isActive: true
        });
        
        if (template) {
          cleanedData.totalCEUsRequired = template.totalCEUsRequired;
          cleanedData.renewalCycle = template.renewalCycle;
          cleanedData.issuingBody = cleanedData.issuingBody || template.issuingBody;
          cleanedData.requirements = template.requirements;
          cleanedData.templateId = template._id;
          console.log(`Found template for ${cleanedData.name} (${cleanedData.state}): ${template.totalCEUsRequired} CE hours`);
        }
      } catch (templateError) {
        console.error('Template lookup error:', templateError);
      }
    }
    
    // Also try national cert lookup if no state template found
    if (cleanedData.name && !cleanedData.totalCEUsRequired) {
      try {
        const template = await CredentialTemplate.findOne({
          name: { $regex: new RegExp(`^${cleanedData.name}$`, 'i') },
          type: { $in: ['national_cert', 'specialty_cert'] },
          isActive: true
        });
        
        if (template) {
          cleanedData.totalCEUsRequired = template.totalCEUsRequired;
          cleanedData.renewalCycle = template.renewalCycle;
          cleanedData.issuingBody = cleanedData.issuingBody || template.issuingBody;
          cleanedData.requirements = template.requirements;
          cleanedData.templateId = template._id;
          console.log(`Found national template for ${cleanedData.name}: ${template.totalCEUsRequired} CE hours`);
        }
      } catch (templateError) {
        console.error('National template lookup error:', templateError);
      }
    }

    // If no template found, flag for user verification and provide search suggestion
    if (!cleanedData.templateId) {
      cleanedData.requiresVerification = true;
      
      // Build search suggestion based on what we know
      const stateName = cleanedData.state ? getStateName(cleanedData.state) : null;
      if (cleanedData.name && stateName) {
        cleanedData.searchSuggestion = `${stateName} ${cleanedData.name} CE requirements ${new Date().getFullYear()}`;
        cleanedData.verificationMessage = `We don't have ${cleanedData.name} (${cleanedData.state}) in our database yet. Please verify the CE requirements and enter them manually.`;
      } else if (cleanedData.name) {
        cleanedData.searchSuggestion = `${cleanedData.name} continuing education requirements ${new Date().getFullYear()}`;
        cleanedData.verificationMessage = `We don't have ${cleanedData.name} in our database yet. Please verify the CE requirements and enter them manually.`;
      }
      
      console.log(`No template found for ${cleanedData.name} (${cleanedData.state || 'national'}). User verification required.`);
    }

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
