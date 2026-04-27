// ═══════════════════════════════════════════════════════════════
// BOARD ALERTS API — GET /api/credentials/board-alerts
// Add to server/src/routes/credentialRoutes.js (or create new file)
// ═══════════════════════════════════════════════════════════════
//
// Returns the user's credentials joined against current CredentialTemplate
// data, with diff highlighting for any changes since enrollment.
//
// Response shape per alert:
// {
//   credentialId, templateId, code, state, name, issuingBody,
//   renewalCycle, totalCEUsRequired, notes, renewalUrl,
//   currentRules: [{ category, hoursRequired }],
//   savedRules:   [{ category, hoursRequired }],
//   changes: [{ field, label, oldValue, newValue, severity }],
//   severity: 'info' | 'important' | 'urgent',
//   postedAt  (template.lastVerifiedAt or updatedAt)
// }
// ═══════════════════════════════════════════════════════════════

router.get('/board-alerts', protectAndScope, async (req, res) => {
  try {
    const userCredentials = await UserCredential.find({ userId: req.user._id })
      .populate('templateId');

    const alerts = [];

    for (const cred of userCredentials) {
      // Get the current template (fresh from DB, not the user's stale copy)
      let template = cred.templateId;
      if (!template && cred.credentialCode && cred.state) {
        template = await CredentialTemplate.findOne({
          code: cred.credentialCode,
          state: cred.state
        });
      }
      if (!template) continue;

      // The user's saved snapshot (what they enrolled with)
      const savedRules = (cred.requirements || []).map(r => ({
        category: r.category,
        hoursRequired: r.hoursRequired
      }));
      const savedTotal = cred.totalCEUsRequired || savedRules.reduce((s, r) => s + r.hoursRequired, 0);
      const savedNotes = cred.notes || '';
      const savedCycle = cred.renewalCycle;

      // Current template rules
      const currentRules = (template.requirements || []).map(r => ({
        category: r.category,
        hoursRequired: r.hoursRequired
      }));
      const currentTotal = template.totalCEUsRequired || currentRules.reduce((s, r) => s + r.hoursRequired, 0);
      const currentNotes = template.notes || '';
      const currentCycle = template.renewalCycle;

      // Compute diffs
      const changes = [];

      // Total hours change
      if (savedTotal && currentTotal !== savedTotal) {
        changes.push({
          field: 'totalCEUsRequired',
          label: 'Total CE Hours',
          oldValue: savedTotal + ' hours',
          newValue: currentTotal + ' hours',
          severity: Math.abs(currentTotal - savedTotal) >= 5 ? 'important' : 'info'
        });
      }

      // Renewal cycle change
      if (savedCycle && currentCycle !== savedCycle) {
        changes.push({
          field: 'renewalCycle',
          label: 'Renewal Cycle',
          oldValue: savedCycle + ' months',
          newValue: currentCycle + ' months',
          severity: 'important'
        });
      }

      // Category-level diffs
      const allCategories = new Set([
        ...savedRules.map(r => r.category),
        ...currentRules.map(r => r.category)
      ]);

      for (const cat of allCategories) {
        const saved = savedRules.find(r => r.category === cat);
        const current = currentRules.find(r => r.category === cat);

        if (!saved && current) {
          changes.push({
            field: `category:${cat}`,
            label: `${cat} (NEW)`,
            oldValue: 'Not required',
            newValue: current.hoursRequired + ' hours',
            severity: 'important'
          });
        } else if (saved && !current) {
          changes.push({
            field: `category:${cat}`,
            label: `${cat} (REMOVED)`,
            oldValue: saved.hoursRequired + ' hours',
            newValue: 'No longer required',
            severity: 'info'
          });
        } else if (saved && current && saved.hoursRequired !== current.hoursRequired) {
          changes.push({
            field: `category:${cat}`,
            label: cat,
            oldValue: saved.hoursRequired + ' hours',
            newValue: current.hoursRequired + ' hours',
            severity: current.hoursRequired > saved.hoursRequired ? 'important' : 'info'
          });
        }
      }

      // Notes change
      if (savedNotes && currentNotes !== savedNotes) {
        changes.push({
          field: 'notes',
          label: 'Board Notes',
          oldValue: savedNotes || '(none)',
          newValue: currentNotes || '(none)',
          severity: 'info'
        });
      }

      // Determine overall severity
      let severity = 'info';
      if (changes.some(c => c.severity === 'urgent')) severity = 'urgent';
      else if (changes.some(c => c.severity === 'important')) severity = 'important';

      alerts.push({
        credentialId: cred._id,
        templateId: template._id,
        code: template.code || cred.credentialCode,
        state: template.state || cred.state,
        name: template.name || cred.name,
        issuingBody: template.issuingBody || cred.issuingBody,
        renewalCycle: currentCycle,
        totalCEUsRequired: currentTotal,
        notes: currentNotes,
        renewalUrl: template.renewalUrl || null,
        currentRules,
        savedRules,
        changes,
        severity: changes.length > 0 ? severity : 'info',
        hasChanges: changes.length > 0,
        postedAt: template.lastVerifiedAt || template.updatedAt || template.createdAt
      });
    }

    // Sort: changes first, then by severity, then by date
    const severityOrder = { urgent: 0, important: 1, info: 2 };
    alerts.sort((a, b) => {
      if (a.hasChanges !== b.hasChanges) return a.hasChanges ? -1 : 1;
      if (a.severity !== b.severity) return severityOrder[a.severity] - severityOrder[b.severity];
      return new Date(b.postedAt) - new Date(a.postedAt);
    });

    res.json({
      success: true,
      alerts,
      summary: {
        total: alerts.length,
        withChanges: alerts.filter(a => a.hasChanges).length,
        urgent: alerts.filter(a => a.severity === 'urgent').length,
        important: alerts.filter(a => a.severity === 'important').length
      }
    });

  } catch (err) {
    console.error('Board alerts error:', err);
    res.status(500).json({ success: false, message: 'Failed to load board alerts', error: err.message });
  }
});
