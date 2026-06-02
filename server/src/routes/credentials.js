/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import UserCredential from '../models/UserCredential.js';
import CredentialTemplate from '../models/CredentialTemplate.js';
import Certificate from '../models/Certificate.js';
import { protect, requireSubscription } from '../middleware/auth.js';
import { syncCredentialToCalendar, removeEventFromCalendar } from '../services/googleCalendarService.js';
import User from '../models/User.js';

const router = express.Router();

// ============================================
// CREDENTIAL TYPE MAPPING
// Maps AI scan results to valid enum values
// ============================================
const knownCredentials = {
  // State Licenses
  'LPC': 'state_license', 'LPCC': 'state_license', 'LMHC': 'state_license',
  'LMFT': 'state_license', 'LCSW': 'state_license', 'LCPC': 'state_license',
  'LPC-MHSP': 'state_license', 'LPCMH': 'state_license', 'LCMHC': 'state_license',
  
  // National Certifications (NBCC)
  'NCC': 'national_cert', 'CCMHC': 'national_cert', 'NCSC': 'national_cert', 'MAC': 'national_cert',
  
  // Supervisor Credentials
  'CPCS': 'specialty_cert', 'ACS': 'specialty_cert',
  
  // Addictions & Substance Abuse
  'CAC': 'specialty_cert', 'CCDP': 'specialty_cert', 'CASAC': 'specialty_cert',
  
  // Specialty Certifications (Evergreen & Others)
  'CCATP': 'specialty_cert', 'C-CATP': 'specialty_cert', 'ASDCS': 'specialty_cert',
  'ADHD-CCSP': 'specialty_cert', 'C-DBT': 'specialty_cert', 'DBT-C': 'specialty_cert',
  
  // Trauma & Specialized
  'EMDR': 'specialty_cert', 'EMDRIA': 'specialty_cert', 'CGT': 'specialty_cert', 'CGC': 'specialty_cert',
  
  // Forensic & Telehealth
  'CFMHE': 'specialty_cert', 'BC-TMH': 'specialty_cert', 'BCTMH': 'specialty_cert', 'CEAP': 'specialty_cert',
  
  // Other Common
  'CCALP': 'specialty_cert', 'RPT': 'specialty_cert', 'RPT-S': 'specialty_cert', 'CBIS': 'specialty_cert'
};

const credentialTypeMap = {
  'training': 'specialty_cert',
  'certification': 'national_cert',
  'certificate': 'specialty_cert',
  'license': 'state_license',
  'national_certification': 'national_cert'
};

function determineCredentialType(credentialType, code) {
  const normalizedCode = code ? code.toUpperCase().trim().replace(/\s+/g, '-') : '';
  
  // Check known credentials first
  if (normalizedCode && knownCredentials[normalizedCode]) {
    return knownCredentials[normalizedCode];
  }
  // Check without dashes
  const codeNoDash = normalizedCode.replace(/-/g, '');
  if (knownCredentials[codeNoDash]) {
    return knownCredentials[codeNoDash];
  }
  
  // Map generic types from AI scan
  if (credentialType && credentialTypeMap[credentialType.toLowerCase()]) {
    return credentialTypeMap[credentialType.toLowerCase()];
  }
  
  // Default
  return credentialType || 'custom';
}

// @route   GET /api/credentials
// @desc    Get user's credentials
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const credentials = await UserCredential.find({ userId: req.user._id })
      .sort({ expirationDate: 1 });
    
    // Update status for each credential
    const credentialsWithMeta = credentials.map(cred => {
      cred.updateStatus();
      return cred.toJSON();
    });
    
    // Get consultation status
    const consultStatus = req.user.canBookConsultation();
    
    res.json({ 
      credentials: credentialsWithMeta,
      meta: {
        primaryState: req.user.primaryState,
        maxStates: req.user.getMaxStates(),
        canAddMoreStates: req.user.getMaxStates() > 1,
        consultation: {
          canBook: consultStatus.allowed,
          reason: consultStatus.reason,
          nextQuarter: consultStatus.nextQuarter,
          currentQuarter: req.user.getCurrentQuarter(),
          usedThisQuarter: req.user.hasUsedQuarterlyConsult()
        }
      }
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({ error: 'Failed to get credentials' });
  }
});

// @route   POST /api/credentials
// @desc    Add a credential
// @access  Private (Pro required for more than 1)
router.post('/', protect, async (req, res) => {
  try {
    const {
      templateId,
      credentialType,
      name,
      code,
      issuingBody,
      licenseNumber,
      state,
      issueDate,
      expirationDate,
      renewalCycle,
      totalCEUsRequired,
      requirements
    } = req.body;
    
    // Check state tracking limits based on subscription
    if (state) {
      const canTrack = req.user.canTrackState(state);
      if (!canTrack) {
        return res.status(403).json({
          error: `Your plan only allows tracking credentials in ${req.user.primaryState}. Upgrade to VIP for unlimited states.`,
          code: 'STATE_LIMIT',
          currentState: req.user.primaryState,
          maxStates: req.user.getMaxStates()
        });
      }
      
      // Set primary state if not set yet (for Free/Professional users)
      if (!req.user.primaryState && !['vip', 'annual_vip', 'lifetime'].includes(req.user.subscription.plan)) {
        req.user.primaryState = state.toUpperCase();
        await req.user.save();
      }
    }
    
    let credentialData = {
      userId: req.user._id,
      credentialType: determineCredentialType(credentialType, code),
      name,
      code,
      issuingBody,
      licenseNumber,
      state,
      issueDate,
      expirationDate,
      renewalCycle,
      totalCEUsRequired,
      requirements: requirements || []
    };
    
    // If using a template, merge template data
    if (templateId) {
      const template = await CredentialTemplate.findById(templateId);
      if (template) {
        credentialData = {
          ...credentialData,
          templateId,
          credentialType: template.type,
          name: name || `${template.state || ''} ${template.code}`.trim(),
          code: code || template.code,
          issuingBody: issuingBody || template.issuingBody,
          state: state || template.state,
          renewalCycle: renewalCycle || template.renewalCycle,
          totalCEUsRequired: totalCEUsRequired || template.totalCEUsRequired,
          requirements: requirements || template.requirements.map(r => ({
            category: r.category,
            hoursRequired: r.hoursRequired,
            hoursCompleted: 0
          }))
        };
      }
    }
    
    const credential = await UserCredential.create(credentialData);
    credential.updateStatus();

    // Auto-sync to Google Calendar if connected and enabled
    if (credential.expirationDate) {
      try {
        const fullUser = await User.findById(req.user._id);
        if (fullUser.googleCalendar?.connected && fullUser.googleCalendar?.syncEnabled) {
          await syncCredentialToCalendar(fullUser, credential);
        }
      } catch (syncErr) {
        console.error('Google Calendar auto-sync error (non-blocking):', syncErr.message);
      }
    }

    res.status(201).json({
      message: 'Credential added',
      credential
    });
  } catch (error) {
    console.error('Add credential error:', error);
    res.status(500).json({ error: 'Failed to add credential' });
  }
});

// @route   GET /api/credentials/consult-status
// @desc    Get consultation status for current user
// @access  Private
router.get('/consult-status', protect, async (req, res) => {
  try {
    const canBook = req.user.canBookConsultation();
    const history = req.user.consultations || [];
    
    res.json({
      canBook: canBook.allowed,
      reason: canBook.reason,
      currentQuarter: req.user.getCurrentQuarter(),
      nextQuarter: req.user.getNextQuarter(),
      usedThisQuarter: req.user.hasUsedQuarterlyConsult(),
      history: history.map(c => ({
        quarter: c.quarter,
        requestedAt: c.requestedAt,
        completedAt: c.completedAt,
        topic: c.topic
      }))
    });
  } catch (error) {
    console.error('Consult status error:', error);
    res.status(500).json({ error: 'Failed to get consultation status' });
  }
});

// @route   POST /api/credentials/sync
// @desc    Recalculate CE hours from linked certificates AND platform certificates
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all user credentials
    const credentials = await UserCredential.find({ userId });
    
    // Get all user certificates (both uploaded and platform-generated)
    const certificates = await Certificate.find({ 
      userId,
      isRevoked: { $ne: true }
    });
    
    console.log(`Syncing ${credentials.length} credentials with ${certificates.length} certificates`);
    
    if (credentials.length === 0) {
      return res.json({
        message: 'No credentials to sync. Add your licenses and certifications first.',
        updated: 0,
        total: 0
      });
    }
    
    if (certificates.length === 0) {
      return res.json({
        message: 'No certificates found to sync',
        updated: 0,
        total: credentials.length
      });
    }
    
    let updated = 0;
    const syncResults = [];
    
    for (const credential of credentials) {
      let credentialUpdated = false;
      
      // Get certificates that should apply to this credential:
      // 1. Explicitly linked via credentials array
      // 2. Platform-generated certificates (source: 'platform')
      // 3. All certificates if we want to auto-apply
      for (const cert of certificates) {
        const isExplicitlyLinked = cert.credentials && cert.credentials.some(credId =>
          credId.toString() === credential._id.toString()
        );
        const isPlatformCert = cert.source === 'platform' || cert.source === 'import';

        // Match uploaded certs by category to credential requirements
        const certCategory = (cert.category || 'General').toLowerCase().replace(/[-_]/g, ' ');
        const hasRequirements = credential.requirements && credential.requirements.length > 0;
        const matchesCategory = !hasRequirements || credential.requirements.some(req =>
          req.category.toLowerCase().replace(/[-_]/g, ' ') === certCategory
        ) || certCategory === 'general';

        // Apply explicitly linked, platform-generated, or category-matched certs
        if (!isExplicitlyLinked && !isPlatformCert && !matchesCategory) {
          continue;
        }
        
        // Check if this certificate is already in ceuLogs
        const alreadyLogged = credential.ceuLogs.some(log => 
          log.certificateId && log.certificateId.toString() === cert._id.toString()
        );
        
        if (alreadyLogged) {
          continue;
        }
        
        // Add to ceuLogs
        credential.ceuLogs.push({
          date: cert.completionDate,
          hours: cert.ceHours || 0,
          category: cert.category || 'General',
          source: isPlatformCert ? 'internal' : 'external',
          certificateId: cert._id,
          courseId: cert.courseId || null,
          description: cert.title,
          provider: cert.provider || 'CounselorReady'
        });
        
        console.log(`  Added ${cert.ceHours} hrs from "${cert.title}" to ${credential.name}`);
        syncResults.push({
          certificate: cert.title,
          credential: credential.name,
          hours: cert.ceHours
        });
        credentialUpdated = true;
      }
      
      if (credentialUpdated) {
        // Recalculate totalCEUsCompleted
        credential.totalCEUsCompleted = credential.ceuLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
        
        // Update requirement progress - CASE INSENSITIVE
        for (const reqItem of credential.requirements) {
          const categoryLogs = credential.ceuLogs.filter(log => 
            log.category?.toLowerCase() === reqItem.category?.toLowerCase()
          );
          reqItem.hoursCompleted = Math.min(
            reqItem.hoursRequired,
            categoryLogs.reduce((sum, log) => sum + (log.hours || 0), 0)
          );
        }
        
        // Handle overflow to General category
        const generalReq = credential.requirements.find(r => r.category?.toLowerCase() === 'general');
        if (generalReq) {
          // Sum up all hours not in specific categories
          const specificCategories = credential.requirements
            .filter(r => r.category?.toLowerCase() !== 'general')
            .map(r => r.category?.toLowerCase());
          
          const generalLogs = credential.ceuLogs.filter(log => 
            !specificCategories.includes(log.category?.toLowerCase())
          );
          
          // Also add overflow from specific categories that are maxed out
          let overflowHours = 0;
          for (const req of credential.requirements) {
            if (req.category?.toLowerCase() !== 'general') {
              const catLogs = credential.ceuLogs.filter(log => 
                log.category?.toLowerCase() === req.category?.toLowerCase()
              );
              const catTotal = catLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
              if (catTotal > req.hoursRequired) {
                overflowHours += catTotal - req.hoursRequired;
              }
            }
          }
          
          generalReq.hoursCompleted = Math.min(
            generalReq.hoursRequired,
            generalLogs.reduce((sum, log) => sum + (log.hours || 0), 0) + overflowHours
          );
        }
        
        await credential.save();
        updated++;
      }
    }
    
    res.json({ 
      message: updated > 0 
        ? `Synced ${syncResults.length} certificate(s) to ${updated} credential(s)`
        : 'All credentials are up to date',
      updated,
      total: credentials.length,
      details: syncResults,
      credentials: credentials.map(c => ({
        name: c.name,
        totalRequired: c.totalCEUsRequired,
        totalCompleted: c.totalCEUsCompleted,
        requirements: c.requirements
      }))
    });
  } catch (error) {
    console.error('Sync credentials error:', error);
    res.status(500).json({ error: 'Failed to sync credentials' });
  }
});

// @route   POST /api/credentials/recalculate
// @desc    Force recalculate all credential progress from ceuLogs (data repair)
// @access  Private
router.post('/recalculate', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all user credentials
    const credentials = await UserCredential.find({ userId });
    
    console.log(`Recalculating progress for ${credentials.length} credentials`);
    
    const results = [];
    
    for (const credential of credentials) {
      const before = {
        totalCompleted: credential.totalCEUsCompleted,
        requirements: credential.requirements.map(r => ({ ...r.toObject() }))
      };
      
      // Recalculate from ceuLogs
      credential.recalculateProgress();
      await credential.save();
      
      results.push({
        name: credential.name,
        before: before.totalCompleted,
        after: credential.totalCEUsCompleted,
        ceuLogCount: credential.ceuLogs?.length || 0,
        requirements: credential.requirements.map(r => ({
          category: r.category,
          required: r.hoursRequired,
          completed: r.hoursCompleted
        }))
      });
      
      console.log(`Recalculated ${credential.name}: ${before.totalCompleted} -> ${credential.totalCEUsCompleted}`);
    }
    
    res.json({
      message: `Recalculated ${credentials.length} credential(s)`,
      results
    });
  } catch (error) {
    console.error('Recalculate error:', error);
    res.status(500).json({ error: 'Failed to recalculate credentials' });
  }
});

// @route   GET /api/credentials/board-alerts
// @desc    Board rules for user's credentials with change highlighting
// @access  Private
router.get('/board-alerts', protect, async (req, res) => {
  try {
    // Real state licensing board URLs for counseling professions
    const boardUrls = {
      AL: 'https://abec.alabama.gov/', AK: 'https://www.commerce.alaska.gov/web/cbpl/ProfessionalLicensing/BoardofProfessionalCounselors.aspx',
      AZ: 'https://www.azbbhe.us/', AR: 'https://www.arbcec.arkansas.gov/',
      CA: 'https://www.bbs.ca.gov/', CO: 'https://dpo.colorado.gov/MentalHealth',
      CT: 'https://portal.ct.gov/DPH/Practitioner-Licensing--Investigations/Professional-Counselor/Professional-Counselor',
      DE: 'https://dpr.delaware.gov/boards/profcounselors/', DC: 'https://dchealth.dc.gov/service/professional-counseling-licensing',
      FL: 'https://floridasmentalhealthprofessions.gov/', GA: 'https://sos.ga.gov/georgia-board-professional-counselors-social-workers-and-marriage-and-family-therapists',
      HI: 'https://cca.hawaii.gov/pvl/boards/mental_health/', ID: 'https://ibol.idaho.gov/IBOL/BoardPage.aspx?Bureau=COU',
      IL: 'https://idfpr.illinois.gov/profs/profcoun.asp', IN: 'https://www.in.gov/pla/professions/behavioral-health-and-human-services-licensing-board/',
      IA: 'https://idph.iowa.gov/Licensure/Iowa-Board-of-Behavioral-Science', KS: 'https://ksbsrb.ks.gov/',
      KY: 'https://lpc.ky.gov/', LA: 'https://www.lpcboard.org/',
      ME: 'https://www.maine.gov/pfr/professionallicensing/professions/counseling/', MD: 'https://health.maryland.gov/bopc/',
      MA: 'https://www.mass.gov/orgs/board-of-registration-of-allied-mental-health-and-human-services-professions',
      MI: 'https://www.michigan.gov/lara/bureau-list/bpl/occ/prof/counseling', MN: 'https://mn.gov/boards/behavioral-health-therapy/',
      MS: 'https://www.lpc.ms.gov/', MO: 'https://pr.mo.gov/counselors.asp',
      MT: 'https://boards.bsd.dli.mt.gov/license-education/behavioral-health', NE: 'https://dhhs.ne.gov/licensure/Pages/Mental-Health-Practice.aspx',
      NV: 'https://marriage.nv.gov/', NH: 'https://www.oplc.nh.gov/mental-health-practice',
      NJ: 'https://www.njconsumeraffairs.gov/pc/', NM: 'https://www.rld.nm.gov/boards-and-commissions/counseling-and-therapy-practice-board/',
      NY: 'http://www.op.nysed.gov/prof/mhp/', NC: 'https://www.ncblpc.org/',
      ND: 'https://www.ndblpc.org/', OH: 'https://cswmft.ohio.gov/',
      OK: 'https://www.ok.gov/behavioralhealth/', OR: 'https://www.oregon.gov/oblpct/',
      PA: 'https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/SocialWorkersMarriageanFamilyTherapistsandProfessionalCounselors/',
      RI: 'https://health.ri.gov/licenses/detail.php?id=234', SC: 'https://llr.sc.gov/cou/',
      SD: 'https://dss.sd.gov/licensingboards/counselor/', TN: 'https://www.tn.gov/health/health-program-areas/health-professional-boards/pc-board.html',
      TX: 'https://www.bhec.texas.gov/', UT: 'https://dopl.utah.gov/mental-health/',
      VT: 'https://sos.vermont.gov/allied-mental-health/', VA: 'https://www.dhp.virginia.gov/counseling/',
      WA: 'https://doh.wa.gov/licenses-permits-and-certificates/professions-new-renew-702/counselor-credential-702',
      WV: 'https://wvbec.org/', WI: 'https://dsps.wi.gov/pages/Professions/LPC/',
      WY: 'https://mentalhealth.wyo.gov/'
    };

    // Only state licenses — not national certs or specialty certs
    const userCredentials = await UserCredential.find({
      userId: req.user._id,
      credentialType: 'state_license'
    }).populate('templateId');

    const alerts = [];

    for (const cred of userCredentials) {
      let template = cred.templateId;
      if (!template && cred.code && cred.state) {
        template = await CredentialTemplate.findOne({ code: cred.code, state: cred.state, type: 'state_license' });
      }
      if (!template && cred.name && cred.state) {
        template = await CredentialTemplate.findOne({
          type: 'state_license', state: cred.state,
          $or: [
            { code: (cred.code || cred.name.split(' ')[0]).toUpperCase() },
            { name: { $regex: cred.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
          ]
        });
      }
      if (!template) continue;

      const state = (template.state || cred.state || '').toUpperCase();

      const savedRules = (cred.requirements || []).map(r => ({ category: r.category, hoursRequired: r.hoursRequired }));
      const savedTotal = cred.totalCEUsRequired || savedRules.reduce((s, r) => s + r.hoursRequired, 0);
      const savedNotes = cred.notes || '';
      const savedCycle = cred.renewalCycle;

      const currentRules = (template.requirements || []).map(r => ({ category: r.category, hoursRequired: r.hoursRequired }));
      const currentTotal = template.totalCEUsRequired || currentRules.reduce((s, r) => s + r.hoursRequired, 0);
      const currentNotes = template.notes || '';
      const currentCycle = template.renewalCycle;

      const changes = [];

      if (savedTotal && currentTotal !== savedTotal) {
        changes.push({ field: 'totalCEUsRequired', label: 'Total CE Hours', oldValue: savedTotal + ' hours', newValue: currentTotal + ' hours', severity: Math.abs(currentTotal - savedTotal) >= 5 ? 'important' : 'info' });
      }
      if (savedCycle && currentCycle && currentCycle !== savedCycle) {
        changes.push({ field: 'renewalCycle', label: 'Renewal Cycle', oldValue: savedCycle + ' months', newValue: currentCycle + ' months', severity: 'important' });
      }

      const allCats = new Set([...savedRules.map(r => r.category), ...currentRules.map(r => r.category)]);
      for (const cat of allCats) {
        const saved = savedRules.find(r => r.category === cat);
        const current = currentRules.find(r => r.category === cat);
        if (!saved && current) {
          changes.push({ field: `category:${cat}`, label: `${cat} (NEW)`, oldValue: 'Not required', newValue: current.hoursRequired + ' hours', severity: 'important' });
        } else if (saved && !current) {
          changes.push({ field: `category:${cat}`, label: `${cat} (REMOVED)`, oldValue: saved.hoursRequired + ' hours', newValue: 'No longer required', severity: 'info' });
        } else if (saved && current && saved.hoursRequired !== current.hoursRequired) {
          changes.push({ field: `category:${cat}`, label: cat, oldValue: saved.hoursRequired + ' hours', newValue: current.hoursRequired + ' hours', severity: current.hoursRequired > saved.hoursRequired ? 'important' : 'info' });
        }
      }

      if (savedNotes && currentNotes && currentNotes !== savedNotes) {
        changes.push({ field: 'notes', label: 'Board Notes', oldValue: (savedNotes || '(none)').substring(0, 80), newValue: (currentNotes || '(none)').substring(0, 80), severity: 'info' });
      }

      let severity = 'info';
      if (changes.some(c => c.severity === 'urgent')) severity = 'urgent';
      else if (changes.some(c => c.severity === 'important')) severity = 'important';

      // Resolve board URL: template.renewalUrl > hardcoded lookup > null
      const boardUrl = template.renewalUrl || boardUrls[state] || null;

      alerts.push({
        credentialId: cred._id, templateId: template._id,
        code: template.code || cred.code, state,
        name: template.name || cred.name, issuingBody: template.issuingBody || cred.issuingBody,
        renewalCycle: currentCycle, totalCEUsRequired: currentTotal,
        notes: currentNotes, boardUrl,
        currentRules, savedRules, changes,
        severity: changes.length > 0 ? severity : 'info',
        hasChanges: changes.length > 0,
        postedAt: template.lastVerifiedAt || template.updatedAt || template.createdAt
      });
    }

    const sevOrder = { urgent: 0, important: 1, info: 2 };
    alerts.sort((a, b) => {
      if (a.hasChanges !== b.hasChanges) return a.hasChanges ? -1 : 1;
      return (sevOrder[a.severity] || 2) - (sevOrder[b.severity] || 2);
    });

    res.json({
      success: true, alerts,
      summary: { total: alerts.length, withChanges: alerts.filter(a => a.hasChanges).length, urgent: alerts.filter(a => a.severity === 'urgent').length }
    });
  } catch (err) {
    console.error('Board alerts error:', err);
    res.status(500).json({ success: false, error: 'Failed to load board alerts' });
  }
});

// @route   GET /api/credentials/templates
// @desc    Get all credential templates
// @access  Public
router.get('/templates/all', async (req, res) => {
  try {
    const templates = await CredentialTemplate.find({ isActive: true })
      .sort({ type: 1, state: 1, code: 1 });
    
    // Group by type
    const grouped = {
      state_license: templates.filter(t => t.type === 'state_license'),
      national_cert: templates.filter(t => t.type === 'national_cert'),
      specialty_cert: templates.filter(t => t.type === 'specialty_cert')
    };
    
    res.json({ templates: grouped });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});


// @route   GET /api/credentials/templates/:state
// @desc    Get templates for a specific state
// @access  Public
router.get('/templates/state/:state', async (req, res) => {
  try {
    const templates = await CredentialTemplate.find({
      isActive: true,
      state: req.params.state.toUpperCase()
    }).sort({ code: 1 });
    
    res.json({ templates });
  } catch (error) {
    console.error('Get state templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});


// @route   GET /api/credentials/dashboard
// @desc    Get credential dashboard summary
// @access  Private
router.get('/user/dashboard', protect, async (req, res) => {
  try {
    const credentials = await UserCredential.find({ userId: req.user._id })
      .sort({ expirationDate: 1 });
    
    // Calculate summary
    const summary = {
      totalCredentials: credentials.length,
      expiringSoon: 0,
      expired: 0,
      upcomingDeadlines: [],
      overallProgress: {
        totalRequired: 0,
        totalCompleted: 0,
        percentComplete: 0
      }
    };
    
    credentials.forEach(cred => {
      cred.updateStatus();
      
      if (cred.status === 'expired') {
        summary.expired++;
      } else if (cred.status === 'expiring_soon') {
        summary.expiringSoon++;
      }
      
      // Add to upcoming deadlines
      if (cred.daysUntilExpiration > 0 && cred.daysUntilExpiration <= 180) {
        summary.upcomingDeadlines.push({
          credentialId: cred._id,
          name: cred.name,
          expirationDate: cred.expirationDate,
          daysRemaining: cred.daysUntilExpiration,
          ceusRemaining: cred.totalCEUsRequired - cred.totalCEUsCompleted
        });
      }
      
      // Overall progress
      summary.overallProgress.totalRequired += cred.totalCEUsRequired;
      summary.overallProgress.totalCompleted += cred.totalCEUsCompleted;
    });
    
    if (summary.overallProgress.totalRequired > 0) {
      summary.overallProgress.percentComplete = Math.round(
        (summary.overallProgress.totalCompleted / summary.overallProgress.totalRequired) * 100
      );
    }
    
    res.json({
      summary,
      credentials
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});


// @route   POST /api/credentials/book-consult
// @desc    Book a VIP consultation (1 per quarter)
// @access  Private (VIP only)
router.post('/book-consult', protect, async (req, res) => {
  try {
    const { topic } = req.body;
    
    // Check if can book
    const canBook = req.user.canBookConsultation();
    if (!canBook.allowed) {
      return res.status(403).json({
        error: canBook.reason,
        nextQuarter: canBook.nextQuarter,
        code: 'CONSULT_LIMIT'
      });
    }
    
    // Book the consultation
    await req.user.bookConsultation(topic || 'General consultation');
    
    res.json({
      message: 'Consultation requested successfully',
      quarter: req.user.getCurrentQuarter(),
      // You'll receive an email to schedule your session
      nextSteps: 'Check your email for scheduling instructions'
    });
  } catch (error) {
    console.error('Book consult error:', error);
    res.status(500).json({ error: error.message || 'Failed to book consultation' });
  }
});



// @route   GET /api/credentials/:id
// @desc    Get single credential
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    credential.updateStatus();

    res.json({ credential });
  } catch (error) {
    console.error('Get credential error:', error);
    res.status(500).json({ error: 'Failed to get credential' });
  }
});

// @route   PUT /api/credentials/:id
// @desc    Update credential
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const allowedUpdates = [
      'name', 'licenseNumber', 'issueDate', 'expirationDate',
      'remindersEnabled', 'customReminders'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        credential[field] = req.body[field];
      }
    });
    
    credential.updateStatus();
    await credential.save();

    // Auto-sync to Google Calendar if connected and enabled
    if (credential.expirationDate) {
      try {
        const fullUser = await User.findById(req.user._id);
        if (fullUser.googleCalendar?.connected && fullUser.googleCalendar?.syncEnabled) {
          await syncCredentialToCalendar(fullUser, credential);
        }
      } catch (syncErr) {
        console.error('Google Calendar auto-sync error (non-blocking):', syncErr.message);
      }
    }

    res.json({
      message: 'Credential updated',
      credential
    });
  } catch (error) {
    console.error('Update credential error:', error);
    res.status(500).json({ error: 'Failed to update credential' });
  }
});

// @route   DELETE /api/credentials/:id
// @desc    Delete credential
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const credential = await UserCredential.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    // Remove from Google Calendar if connected
    try {
      const fullUser = await User.findById(req.user._id);
      if (fullUser.googleCalendar?.connected) {
        await removeEventFromCalendar(fullUser, req.params.id);
      }
    } catch (syncErr) {
      console.error('Google Calendar event remove error (non-blocking):', syncErr.message);
    }

    res.json({ message: 'Credential deleted' });
  } catch (error) {
    console.error('Delete credential error:', error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
});

// @route   POST /api/credentials/:id/log-ceu
// @desc    Log CEU hours to a credential
// @access  Private
router.post('/:id/log-ceu', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { hours, category, description, provider, date, certificateId, courseId } = req.body;

    if (!hours || !category || !description) {
      return res.status(400).json({ error: 'Hours, category, and description are required' });
    }

    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    await credential.addCEU({
      hours,
      category,
      description,
      provider,
      date,
      certificateId,
      courseId,
      source: courseId ? 'internal' : 'external'
    });
    
    res.json({
      message: 'CEU logged',
      credential
    });
  } catch (error) {
    console.error('Log CEU error:', error);
    res.status(500).json({ error: 'Failed to log CEU' });
  }
});

// Configure multer for credential document uploads
const uploadDir = './uploads/credentials';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `cred-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files allowed'));
    }
  }
});

// @route   POST /api/credentials/:id/upload
// @desc    Upload document for a credential
// @access  Private
router.post('/:id/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update credential with document info
    credential.documentUrl = `/uploads/credentials/${req.file.filename}`;
    credential.documentName = req.file.originalname;
    await credential.save();

    res.json({
      message: 'Document uploaded successfully',
      documentUrl: credential.documentUrl,
      documentName: credential.documentName
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// @route   DELETE /api/credentials/:id/document
// @desc    Delete document from credential
// @access  Private
router.delete('/:id/document', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    // Delete file if exists
    if (credential.documentUrl) {
      const filePath = '.' + credential.documentUrl;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    credential.documentUrl = null;
    credential.documentName = null;
    await credential.save();

    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
