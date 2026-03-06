/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// In-memory store for SSE connections (WebSocket alternative that works without extra deps)
const clients = new Map(); // userId -> Set of response objects

// ── SSE endpoint for real-time notifications ──
router.get('/stream', protect, (req, res) => {
  const userId = req.user._id.toString();

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no' // Disable Nginx buffering
  });

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`);

  // Register client
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  // Heartbeat every 30s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.delete(res);
      if (userClients.size === 0) clients.delete(userId);
    }
  });
});

// ── Send a real-time notification to a user (internal helper) ──
export function sendRealtimeNotification(userId, notification) {
  const userClients = clients.get(userId.toString());
  if (!userClients) return;

  const data = JSON.stringify(notification);
  for (const client of userClients) {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      userClients.delete(client);
    }
  }
}

// ── Get notification history ──
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const query = { userId: req.user._id };
    if (unreadOnly === 'true') query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Mark notification as read ──
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Mark all as read ──
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Create and send a notification (used by services) ──
router.post('/', protect, async (req, res) => {
  try {
    const { title, message, type, link, targetUserId } = req.body;
    const userId = targetUserId || req.user._id;

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'info',
      link
    });

    // Push via SSE
    sendRealtimeNotification(userId, {
      type: 'notification',
      notification: notification.toObject()
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Delete a notification ──
router.delete('/:id', protect, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export clients map for use in other services
export { clients };
export default router;
