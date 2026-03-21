// ============================================================================
// DROP-IN: Add this route to server/src/routes/notifications.js
// 
// Import sendTestSMS from your existing Twilio service at the top:
//   import { sendTestSMS } from '../services/reminderService.js';
// ============================================================================

// POST /api/notifications/test-sms - Send verification text
router.post('/test-sms', protect, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const result = await sendTestSMS(phone);

    if (result.success) {
      const user = await User.findById(req.user.id);
      user.phone = phone;
      user.smsVerified = true;
      user.smsRemindersEnabled = true;
      await user.save();

      res.json({ message: 'Verification text sent', sid: result.sid });
    } else {
      res.status(400).json({ message: result.error || 'Failed to send SMS' });
    }
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({ message: 'Failed to send verification text' });
  }
});
