/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import { Resend } from 'resend';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Announcement from '../models/Announcement.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 
                     'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// =====================
// ANNOUNCEMENTS
// =====================

// @route   GET /api/announcements
// @desc    Get announcements for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.getForUser(req.user);
    
    // Mark which ones are read by this user
    const announcementsWithReadStatus = announcements.map(ann => ({
      ...ann.toObject(),
      isRead: ann.readBy.some(r => r.userId.toString() === req.user._id.toString())
    }));
    
    res.json({ announcements: announcementsWithReadStatus });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to get announcements' });
  }
});

// @route   POST /api/announcements
// @desc    Create announcement (admin only)
// @access  Private/Admin
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { 
      title, 
      message, 
      type, 
      audience, 
      specificUsers,
      targetStates,
      targetCredentials,
      startDate, 
      endDate, 
      isPinned,
      sendEmail 
    } = req.body;
    
    const announcement = await Announcement.create({
      title,
      message,
      type: type || 'info',
      audience: audience || 'all',
      specificUsers: specificUsers || [],
      targetStates: targetStates || [],
      targetCredentials: targetCredentials || [],
      startDate: startDate || new Date(),
      endDate,
      isPinned: isPinned || false,
      sendEmail: sendEmail || false,
      createdBy: req.user._id
    });
    
    // Send emails if requested
    if (sendEmail) {
      await sendAnnouncementEmails(announcement);
    }
    
    res.status(201).json({ 
      message: 'Announcement created',
      announcement 
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// @route   PUT /api/announcements/:id/read
// @desc    Mark announcement as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    // Check if already read
    const alreadyRead = announcement.readBy.some(
      r => r.userId.toString() === req.user._id.toString()
    );
    
    if (!alreadyRead) {
      announcement.readBy.push({ userId: req.user._id });
      await announcement.save();
    }
    
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// @route   PUT /api/announcements/:id/dismiss
// @desc    Dismiss announcement for current user
// @access  Private
router.put('/:id/dismiss', protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    await announcement.dismissForUser(req.user._id);
    res.json({ message: 'Announcement dismissed' });
  } catch (error) {
    console.error('Dismiss announcement error:', error);
    res.status(500).json({ error: 'Failed to dismiss announcement' });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement (admin only)
// @access  Private/Admin
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// @route   GET /api/announcements/admin/all
// @desc    Get all announcements for admin
// @access  Private/Admin
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json({ announcements });
  } catch (error) {
    console.error('Get all announcements error:', error);
    res.status(500).json({ error: 'Failed to get announcements' });
  }
});

// =====================
// DIRECT MESSAGES
// =====================

// @route   GET /api/announcements/messages
// @desc    Get messages for current user
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    const { archived = 'false' } = req.query;
    
    const messages = await Message.find({ 
      toUser: req.user._id,
      archived: archived === 'true'
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    const unreadCount = await Message.getUnreadCount(req.user._id);
    
    res.json({ messages, unreadCount });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// @route   GET /api/announcements/messages/my-conversations
// @desc    Get user's conversations
// @access  Private
router.get('/messages/my-conversations', protect, async (req, res) => {
  try {
    // Get unique conversations for this user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { fromUser: req.user._id },
            { toUser: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$toUser', req.user._id] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $limit: 50
      }
    ]);
    
    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// @route   GET /api/announcements/messages/:id
// @desc    Get single message and mark as read
// @access  Private
router.get('/messages/:id', protect, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      toUser: req.user._id
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await message.markAsRead();
    
    res.json({ message });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Failed to get message' });
  }
});

// @route   POST /api/announcements/messages/send
// @desc    Send message to user(s) (admin only)
// @access  Private/Admin
router.post('/messages/send', protect, requireAdmin, async (req, res) => {
  try {
    const { 
      userIds, 
      subject, 
      body, 
      type,
      priority,
      sendEmail,
      // Filters for bulk sending
      filterByState,
      filterByPlan,
      filterByCredential
    } = req.body;
    
    let targetUsers = [];
    
    if (userIds && userIds.length > 0) {
      // Send to specific users
      targetUsers = await User.find({ _id: { $in: userIds } });
    } else {
      // Build filter query
      let query = {};
      
      if (filterByPlan) {
        query['subscription.plan'] = filterByPlan;
      }
      
      if (filterByState) {
        // Find users with credentials in this state
        const credentialsInState = await UserCredential.find({ state: filterByState }).distinct('userId');
        query._id = { $in: credentialsInState };
      }
      
      if (filterByCredential) {
        const usersWithCred = await UserCredential.find({ 
          name: { $regex: filterByCredential, $options: 'i' }
        }).distinct('userId');
        
        if (query._id) {
          // Intersect with existing filter
          query._id.$in = query._id.$in.filter(id => 
            usersWithCred.some(uid => uid.toString() === id.toString())
          );
        } else {
          query._id = { $in: usersWithCred };
        }
      }
      
      targetUsers = await User.find(query);
    }
    
    if (targetUsers.length === 0) {
      return res.status(400).json({ error: 'No users match the criteria' });
    }
    
    // Create messages for each user
    const messages = [];
    for (const user of targetUsers) {
      const message = await Message.create({
        fromAdmin: true,
        toUser: user._id,
        subject,
        body,
        type: type || 'general',
        priority: priority || 'normal',
        emailSent: false
      });
      messages.push(message);
      
      // Send email if requested
      if (sendEmail) {
        await sendDirectMessageEmail(user, subject, body);
        message.emailSent = true;
        await message.save();
      }
    }
    
    res.status(201).json({ 
      message: `Message sent to ${messages.length} user(s)`,
      count: messages.length
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// @route   PUT /api/announcements/messages/:id/archive
// @desc    Archive a message
// @access  Private
router.put('/messages/:id/archive', protect, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, toUser: req.user._id },
      { archived: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Message archived' });
  } catch (error) {
    console.error('Archive message error:', error);
    res.status(500).json({ error: 'Failed to archive message' });
  }
});

// @route   GET /api/announcements/admin/users
// @desc    Get users list for messaging (admin only)
// @access  Private/Admin
router.get('/admin/users', protect, requireAdmin, async (req, res) => {
  try {
    const { search, state, plan, limit = 50 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (plan) {
      query['subscription.plan'] = plan;
    }
    
    let users = await User.find(query)
      .select('name email subscription.plan primaryState createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // If filtering by state, get their credentials
    if (state) {
      const userIdsInState = await UserCredential.find({ state: state.toUpperCase() }).distinct('userId');
      users = users.filter(u => userIdsInState.some(id => id.toString() === u._id.toString()));
    }
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// =====================
// USER-TO-ADMIN MESSAGING
// =====================

// @route   POST /api/announcements/messages/contact
// @desc    User sends message to admin/support
// @access  Private
router.post('/messages/contact', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { subject, body, type, relatedCredentialId, relatedCourseId } = req.body;
    
    // Upload attachments to Cloudinary
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'counselorready/messages',
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        
        attachments.push({
          filename: result.public_id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          cloudinaryId: result.public_id
        });
      }
    }
    
    const conversationId = Message.generateConversationId(req.user._id);
    
    const message = await Message.create({
      conversationId,
      fromAdmin: false,
      fromUser: req.user._id,
      toAdmin: true,
      subject,
      body,
      type: type || 'support',
      attachments,
      relatedCredential: relatedCredentialId,
      relatedCourse: relatedCourseId,
      status: 'open'
    });
    
    // Send email notification to admin
    await sendAdminNotificationEmail(req.user, message);
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      messageId: message._id,
      conversationId
    });
  } catch (error) {
    console.error('Contact admin error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// @route   GET /api/announcements/messages/conversation/:conversationId
// @desc    Get all messages in a conversation
// @access  Private
router.get('/messages/conversation/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ 
      conversationId: req.params.conversationId,
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id },
        { toAdmin: true, fromUser: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('fromUser', 'name email');
    
    // Mark all as read
    await Message.updateMany(
      { conversationId: req.params.conversationId, toUser: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.json({ messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// @route   POST /api/announcements/messages/reply/:conversationId
// @desc    Reply to a conversation
// @access  Private
router.post('/messages/reply/:conversationId', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { body } = req.body;
    const { conversationId } = req.params;
    
    // Find original message to get context
    const originalMessage = await Message.findOne({ conversationId }).sort({ createdAt: 1 });
    if (!originalMessage) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Upload attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'counselorready/messages', resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        
        attachments.push({
          filename: result.public_id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          cloudinaryId: result.public_id
        });
      }
    }
    
    const message = await Message.create({
      conversationId,
      fromAdmin: false,
      fromUser: req.user._id,
      toAdmin: true,
      subject: `Re: ${originalMessage.subject}`,
      body,
      attachments,
      parentMessage: originalMessage._id
    });
    
    // Update conversation status
    await Message.updateMany(
      { conversationId },
      { status: 'open' }
    );
    
    res.status(201).json({ message });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// =====================
// ADMIN INBOX
// =====================

// @route   GET /api/announcements/admin/inbox
// @desc    Get all messages sent to admin
// @access  Private/Admin
router.get('/admin/inbox', protect, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = { toAdmin: true };
    if (status) {
      query.status = status;
    }
    
    // Get unique conversations
    const conversations = await Message.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          messageCount: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
          }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    // Populate user info
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const user = await User.findById(conv.lastMessage.fromUser).select('name email');
        return { ...conv, user };
      })
    );
    
    const totalUnread = await Message.getAdminUnreadCount();
    
    res.json({ 
      conversations: populatedConversations,
      totalUnread
    });
  } catch (error) {
    console.error('Get admin inbox error:', error);
    res.status(500).json({ error: 'Failed to get inbox' });
  }
});

// @route   GET /api/announcements/admin/conversation/:conversationId
// @desc    Get conversation for admin
// @access  Private/Admin
router.get('/admin/conversation/:conversationId', protect, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');
    
    // Mark all admin-bound messages as read
    await Message.updateMany(
      { conversationId: req.params.conversationId, toAdmin: true, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.json({ messages });
  } catch (error) {
    console.error('Get admin conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// @route   POST /api/announcements/admin/reply/:conversationId
// @desc    Admin replies to a conversation
// @access  Private/Admin
router.post('/admin/reply/:conversationId', protect, requireAdmin, upload.array('attachments', 5), async (req, res) => {
  try {
    const { body, sendEmail } = req.body;
    const { conversationId } = req.params;
    
    // Find original message to get user
    const originalMessage = await Message.findOne({ conversationId }).sort({ createdAt: 1 });
    if (!originalMessage) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const targetUserId = originalMessage.fromUser;
    const user = await User.findById(targetUserId);
    
    // Upload attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'counselorready/messages', resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        
        attachments.push({
          filename: result.public_id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          cloudinaryId: result.public_id
        });
      }
    }
    
    const message = await Message.create({
      conversationId,
      fromAdmin: true,
      toUser: targetUserId,
      subject: `Re: ${originalMessage.subject}`,
      body,
      attachments,
      parentMessage: originalMessage._id,
      status: 'replied'
    });
    
    // Update all messages in conversation to 'replied'
    await Message.updateMany(
      { conversationId },
      { status: 'replied' }
    );
    
    // Send email if requested
    if (sendEmail && user) {
      await sendDirectMessageEmail(user, `Re: ${originalMessage.subject}`, body, attachments);
      message.emailSent = true;
      await message.save();
    }
    
    res.status(201).json({ message });
  } catch (error) {
    console.error('Admin reply error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// @route   PUT /api/announcements/admin/conversation/:conversationId/status
// @desc    Update conversation status
// @access  Private/Admin
router.put('/admin/conversation/:conversationId/status', protect, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    await Message.updateMany(
      { conversationId: req.params.conversationId },
      { status }
    );
    
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// =====================
// EMAIL HELPERS
// =====================

async function sendAnnouncementEmails(announcement) {
  try {
    let users;
    
    if (announcement.audience === 'all') {
      users = await User.find({});
    } else if (announcement.audience === 'specific') {
      users = await User.find({ _id: { $in: announcement.specificUsers } });
    } else {
      // Filter by plan
      const planMap = {
        'free': ['free'],
        'professional': ['professional', 'monthly'],
        'vip': ['vip', 'annual_vip', 'lifetime']
      };
      users = await User.find({ 'subscription.plan': { $in: planMap[announcement.audience] || [] } });
    }
    
    for (const user of users) {
      await resend.emails.send({
        from: 'CounselorReady <announcements@counselorready.com>',
        to: user.email,
        subject: `📢 ${announcement.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6b1d34, #34503d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 10px 10px; }
              .type-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
              .type-info { background: #e3f2fd; color: #1565c0; }
              .type-update { background: #e8f5e9; color: #2e7d32; }
              .type-maintenance { background: #fff3e0; color: #ef6c00; }
              .type-promotion { background: #fce4ec; color: #c2185b; }
              .type-urgent { background: #ffebee; color: #c62828; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>CounselorReady</h1>
              </div>
              <div class="content">
                <span class="type-badge type-${announcement.type}">${announcement.type.toUpperCase()}</span>
                <h2>${announcement.title}</h2>
                <div>${announcement.message}</div>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} CounselorReady</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    }
    
    announcement.emailSent = true;
    await announcement.save();
    
    console.log(`Sent announcement emails to ${users.length} users`);
  } catch (error) {
    console.error('Error sending announcement emails:', error);
  }
}

async function sendDirectMessageEmail(user, subject, body, attachments = []) {
  try {
    const attachmentLinks = attachments.length > 0 
      ? `<div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">📎 Attachments:</p>
          ${attachments.map(a => `<a href="${a.url}" style="display: block; color: #6b1d34; margin: 5px 0;">${a.originalName}</a>`).join('')}
        </div>`
      : '';
    
    await resend.emails.send({
      from: 'CounselorReady <messages@counselorready.com>',
      to: user.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6b1d34, #34503d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .cta-button { display: inline-block; background: #6b1d34; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>You have a new message</p>
            </div>
            <div class="content">
              <p>Hi ${user.name || 'there'},</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${body}
              </div>
              ${attachmentLinks}
              <center>
                <a href="https://counselorready.com/dashboard.html" class="cta-button">View in Dashboard</a>
              </center>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} CounselorReady</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error('Error sending direct message email:', error);
  }
}

async function sendAdminNotificationEmail(user, message) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@counselorready.com';
    
    const attachmentInfo = message.attachments && message.attachments.length > 0
      ? `<p><strong>📎 ${message.attachments.length} attachment(s)</strong></p>`
      : '';
    
    await resend.emails.send({
      from: 'CounselorReady <notifications@counselorready.com>',
      to: adminEmail,
      subject: `📬 New Message from ${user.name || user.email}: ${message.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #34503d, #6b1d34); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .user-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .message-box { background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; }
            .cta-button { display: inline-block; background: #34503d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Support Message</h1>
            </div>
            <div class="content">
              <div class="user-info">
                <p style="margin: 0;"><strong>From:</strong> ${user.name || 'Unknown'}</p>
                <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 5px 0 0 0;"><strong>Type:</strong> ${message.type || 'General'}</p>
              </div>
              
              <h3>${message.subject}</h3>
              
              <div class="message-box">
                ${message.body}
              </div>
              
              ${attachmentInfo}
              
              <center>
                <a href="https://counselorready.com/admin-messages.html" class="cta-button">View & Reply</a>
              </center>
            </div>
            <div class="footer">
              <p>CounselorReady Admin Notification</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
}

export default router;
