/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import HelpArticle from '../models/HelpArticle.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES (User-facing)
// ============================================

// Get all published articles for users (with optional category filter)
router.get('/articles', async (req, res) => {
  try {
    const { category, audience = 'user' } = req.query;
    const articles = await HelpArticle.getForAudience(audience, category);
    
    res.json({
      success: true,
      articles
    });
  } catch (error) {
    console.error('Error fetching help articles:', error);
    res.status(500).json({ error: 'Failed to fetch help articles' });
  }
});

// Get featured articles
router.get('/featured', async (req, res) => {
  try {
    const { audience = 'user' } = req.query;
    const articles = await HelpArticle.getFeatured(audience);
    
    res.json({
      success: true,
      articles
    });
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

// Get category list with counts
router.get('/categories', async (req, res) => {
  try {
    const { audience = 'user' } = req.query;
    const categories = await HelpArticle.getCategoryCounts(audience);
    
    // Add category metadata
    const categoryMeta = {
      'getting-started': { label: 'Getting Started', icon: 'fa-rocket', color: 'green' },
      'courses': { label: 'Courses & Learning', icon: 'fa-graduation-cap', color: 'blue' },
      'certificates': { label: 'Certificates', icon: 'fa-certificate', color: 'yellow' },
      'credentials': { label: 'Credentials', icon: 'fa-id-card', color: 'purple' },
      'subscriptions': { label: 'Subscriptions & Billing', icon: 'fa-credit-card', color: 'orange' },
      'account': { label: 'Account Settings', icon: 'fa-user-cog', color: 'gray' },
      'technical': { label: 'Technical Help', icon: 'fa-wrench', color: 'red' },
      'integrations': { label: 'Integrations', icon: 'fa-plug', color: 'indigo' },
      'admin': { label: 'Administration', icon: 'fa-shield-alt', color: 'burgundy' },
      'troubleshooting': { label: 'Troubleshooting', icon: 'fa-bug', color: 'pink' }
    };
    
    const enrichedCategories = categories.map(cat => ({
      id: cat._id,
      count: cat.count,
      ...categoryMeta[cat._id]
    }));
    
    res.json({
      success: true,
      categories: enrichedCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Search articles
router.get('/search', async (req, res) => {
  try {
    const { q, audience = 'user' } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, articles: [] });
    }
    
    const articles = await HelpArticle.search(q, audience);
    
    res.json({
      success: true,
      articles
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

// Get single article by slug (public)
router.get('/article/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { visitorId } = req.query;
    
    const article = await HelpArticle.findOne({ 
      slug, 
      status: 'published' 
    }).populate('relatedArticles', 'title slug category icon');
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Record view if visitorId provided
    if (visitorId) {
      await article.recordView(visitorId);
    }
    
    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Submit feedback for an article
router.post('/article/:slug/feedback', async (req, res) => {
  try {
    const { slug } = req.params;
    const { visitorId, helpful, comment } = req.body;
    
    if (!visitorId || helpful === undefined) {
      return res.status(400).json({ error: 'visitorId and helpful are required' });
    }
    
    const article = await HelpArticle.findOne({ slug, status: 'published' });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    await article.recordFeedback(visitorId, helpful, comment);
    
    res.json({
      success: true,
      message: 'Feedback recorded'
    });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// Get all articles (admin - includes drafts)
router.get('/admin/articles', protect, requireAdmin, async (req, res) => {
  try {
    const { status, category, audience } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (audience) query.audience = audience;
    
    const articles = await HelpArticle.find(query)
      .select('-viewedBy -feedback')
      .sort({ category: 1, order: 1, createdAt: -1 })
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    res.json({
      success: true,
      articles
    });
  } catch (error) {
    console.error('Error fetching admin articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article for editing (admin)
router.get('/admin/article/:id', protect, requireAdmin, async (req, res) => {
  try {
    const article = await HelpArticle.findById(req.params.id)
      .populate('relatedArticles', 'title slug category')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create new article (admin)
router.post('/admin/article', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title, slug, summary, content, category, audience,
      searchTags, icon, order, featured, status
    } = req.body;
    
    // Check for duplicate slug
    if (slug) {
      const existing = await HelpArticle.findOne({ slug });
      if (existing) {
        return res.status(400).json({ error: 'An article with this slug already exists' });
      }
    }
    
    const article = new HelpArticle({
      title,
      slug,
      summary,
      content,
      category,
      audience: audience || 'user',
      searchTags: searchTags || [],
      icon: icon || 'fa-circle-question',
      order: order || 0,
      featured: featured || false,
      status: status || 'draft',
      createdBy: req.user._id,
      updatedBy: req.user._id
    });
    
    await article.save();
    
    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article (admin)
router.put('/admin/article/:id', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title, slug, summary, content, category, audience,
      searchTags, relatedArticles, icon, order, featured, status
    } = req.body;
    
    const article = await HelpArticle.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Check for duplicate slug if changing
    if (slug && slug !== article.slug) {
      const existing = await HelpArticle.findOne({ slug, _id: { $ne: article._id } });
      if (existing) {
        return res.status(400).json({ error: 'An article with this slug already exists' });
      }
    }
    
    // Update fields
    if (title !== undefined) article.title = title;
    if (slug !== undefined) article.slug = slug;
    if (summary !== undefined) article.summary = summary;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;
    if (audience !== undefined) article.audience = audience;
    if (searchTags !== undefined) article.searchTags = searchTags;
    if (relatedArticles !== undefined) article.relatedArticles = relatedArticles;
    if (icon !== undefined) article.icon = icon;
    if (order !== undefined) article.order = order;
    if (featured !== undefined) article.featured = featured;
    if (status !== undefined) article.status = status;
    
    article.updatedBy = req.user._id;
    
    await article.save();
    
    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article (admin)
router.delete('/admin/article/:id', protect, requireAdmin, async (req, res) => {
  try {
    const article = await HelpArticle.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({
      success: true,
      message: 'Article deleted'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Bulk update article order (admin)
router.post('/admin/articles/reorder', protect, requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, order }
    
    for (const update of updates) {
      await HelpArticle.findByIdAndUpdate(update.id, { order: update.order });
    }
    
    res.json({
      success: true,
      message: 'Articles reordered'
    });
  } catch (error) {
    console.error('Error reordering articles:', error);
    res.status(500).json({ error: 'Failed to reorder articles' });
  }
});

// Get article analytics (admin)
router.get('/admin/analytics', protect, requireAdmin, async (req, res) => {
  try {
    // Most viewed articles
    const topViewed = await HelpArticle.find({ status: 'published' })
      .select('title slug category views helpfulYes helpfulNo')
      .sort({ views: -1 })
      .limit(10);
    
    // Articles with low helpfulness
    const needsImprovement = await HelpArticle.find({ 
      status: 'published',
      $expr: { $gt: ['$helpfulNo', '$helpfulYes'] }
    })
    .select('title slug category views helpfulYes helpfulNo')
    .sort({ helpfulNo: -1 })
    .limit(10);
    
    // Category stats
    const categoryStats = await HelpArticle.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          articles: { $sum: 1 },
          totalViews: { $sum: '$views' },
          avgViews: { $avg: '$views' }
        }
      },
      { $sort: { totalViews: -1 } }
    ]);
    
    // Recent feedback
    const recentFeedback = await HelpArticle.aggregate([
      { $unwind: '$feedback' },
      { $sort: { 'feedback.createdAt': -1 } },
      { $limit: 20 },
      {
        $project: {
          title: 1,
          slug: 1,
          feedback: 1
        }
      }
    ]);
    
    res.json({
      success: true,
      analytics: {
        topViewed,
        needsImprovement,
        categoryStats,
        recentFeedback
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Seed initial help articles (admin - one time use)
router.post('/admin/seed', protect, requireAdmin, async (req, res) => {
  try {
    const existingCount = await HelpArticle.countDocuments();
    
    if (existingCount > 0) {
      return res.status(400).json({ 
        error: 'Help articles already exist. Delete them first to re-seed.' 
      });
    }
    
    const seedArticles = getSeedArticles(req.user._id);
    await HelpArticle.insertMany(seedArticles);
    
    res.json({
      success: true,
      message: `Seeded ${seedArticles.length} help articles`
    });
  } catch (error) {
    console.error('Error seeding articles:', error);
    res.status(500).json({ error: 'Failed to seed articles' });
  }
});

// Helper: Get seed articles
function getSeedArticles(userId) {
  return [
    // Getting Started
    {
      title: 'Welcome to CounselorReady',
      slug: 'welcome-to-counselorready',
      summary: 'Get started with your continuing education journey on CounselorReady.',
      content: `# Welcome to CounselorReady

CounselorReady is your comprehensive platform for earning continuing education credits as a mental health professional.

## What You Can Do

- **Browse Courses**: Access our library of NBCC-approved CE courses
- **Track Progress**: Monitor your learning journey and completed credits
- **Manage Credentials**: Store and track your professional licenses
- **Earn Certificates**: Receive instant certificates upon course completion

## Getting Started

1. Complete your profile with your professional information
2. Add your credentials to track renewal deadlines
3. Browse courses by category (Clinical or Ethics)
4. Enroll and start learning!

## Need Help?

If you have questions, browse our help center or contact support@counselorready.com.`,
      category: 'getting-started',
      audience: 'user',
      searchTags: ['welcome', 'start', 'introduction', 'begin', 'new user'],
      icon: 'fa-rocket',
      order: 1,
      featured: true,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'How to Enroll in a Course',
      slug: 'how-to-enroll-course',
      summary: 'Step-by-step guide to enrolling in CE courses.',
      content: `# How to Enroll in a Course

Enrolling in courses is quick and easy.

## Steps to Enroll

1. **Browse Courses**: Go to the Courses page from your dashboard
2. **Find Your Course**: Use filters to find courses by category, CE hours, or topic
3. **Check Requirements**: Review the course description, objectives, and CE hours
4. **Click Enroll**: Hit the "Enroll" button on the course card
5. **Start Learning**: Access the course from your dashboard

## Course Access

Your access to courses depends on your subscription tier:
- **Free**: Limited course selection
- **Professional**: Full course library access
- **VIP**: All courses plus priority support

## Can't Find a Course?

Use the search bar or filter by category. If you're looking for something specific, contact us and we may be able to add it!`,
      category: 'courses',
      audience: 'user',
      searchTags: ['enroll', 'sign up', 'register', 'course', 'start course'],
      icon: 'fa-graduation-cap',
      order: 1,
      featured: true,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'Understanding Your Certificate',
      slug: 'understanding-your-certificate',
      summary: 'Learn about CE certificates and how to use them for license renewal.',
      content: `# Understanding Your Certificate

When you complete a course, you receive an official CE certificate.

## Certificate Contents

Your certificate includes:
- Your full name
- Course title and description
- CE hours earned
- Completion date
- NBCC provider number (P207376)
- Unique certificate ID

## Downloading Certificates

1. Go to your **Dashboard**
2. Click **Certificates** in the sidebar
3. Find your certificate and click **Download**

## Using for License Renewal

Most state boards accept our certificates for renewal. Keep certificates for your records - boards may audit up to 5 years back.

## CE Broker Reporting

If you're in Florida or Georgia, we can automatically report your completions to CE Broker. Enable this in your settings.

## Lost a Certificate?

All your certificates are stored permanently in your account. Log in anytime to download them again.`,
      category: 'certificates',
      audience: 'user',
      searchTags: ['certificate', 'download', 'CE', 'proof', 'completion', 'renewal'],
      icon: 'fa-certificate',
      order: 1,
      featured: true,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'Managing Your Credentials',
      slug: 'managing-your-credentials',
      summary: 'Track your professional licenses and renewal deadlines.',
      content: `# Managing Your Credentials

Keep all your professional credentials organized in one place.

## Adding a Credential

1. Go to **Credentials** from your dashboard
2. Click **Add Credential**
3. Select your credential type (LPC, LMHC, etc.)
4. Enter your license number and state
5. Set your expiration date
6. Upload a photo of your license (optional)

## AI License Scanning

Save time with our AI scanner:
1. Upload a photo of your license
2. Our AI extracts the details automatically
3. Review and confirm the information

## Renewal Reminders

We'll send you reminders before your credentials expire:
- 90 days before
- 30 days before
- 7 days before

## Tracking CE Requirements

Each credential shows:
- Total CE hours required
- Hours completed this cycle
- Ethics hours needed
- Days until renewal`,
      category: 'credentials',
      audience: 'user',
      searchTags: ['credential', 'license', 'LPC', 'renewal', 'expiration', 'track'],
      icon: 'fa-id-card',
      order: 1,
      featured: true,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'Subscription Plans Explained',
      slug: 'subscription-plans-explained',
      summary: 'Compare our subscription tiers and find the right plan for you.',
      content: `# Subscription Plans Explained

Choose the plan that fits your CE needs.

## Plan Comparison

### Free Plan - $0/month
- Access to select free courses
- Basic certificate generation
- Credential tracking

### Professional Plan - $29.99/month
- Full course library access
- All certificate features
- Priority support
- CE Broker integration

### VIP Plan - $49.99/month
- Everything in Professional
- SMS renewal reminders
- Hardship pause option
- Early access to new courses
- Dedicated support

## Changing Plans

You can upgrade or downgrade anytime:
1. Go to **Settings** → **Subscription**
2. Click **Change Plan**
3. Select your new plan
4. Confirm the change

## Billing

- Monthly plans bill on the same day each month
- Upgrades are prorated
- Downgrades take effect at next billing cycle

## Cancellation

Cancel anytime from your settings. You'll keep access until the end of your billing period.`,
      category: 'subscriptions',
      audience: 'user',
      searchTags: ['subscription', 'plan', 'pricing', 'upgrade', 'billing', 'cancel'],
      icon: 'fa-credit-card',
      order: 1,
      featured: false,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'Requesting a Hardship Pause',
      slug: 'requesting-hardship-pause',
      summary: 'VIP members can pause their subscription during difficult times.',
      content: `# Requesting a Hardship Pause

Life happens. VIP members can pause their subscription during hardships.

## Eligibility

- Must be on the VIP plan
- Must have an active subscription

## How to Request

1. Go to **Settings** → **Subscription**
2. Click **Request Hardship Pause**
3. Briefly describe your situation
4. Submit your request

## Pause Durations

Our compassion-based system:
- **1st request**: Up to 30 days
- **2nd request**: Up to 14 days
- **3rd+ request**: Up to 7 days

## What Happens During a Pause

- Your subscription is frozen (no charges)
- You keep access to completed courses/certificates
- You cannot access new courses
- Your billing resumes after the pause ends

## Review Process

Our team reviews requests within 24 hours. We approach every request with compassion and understanding.`,
      category: 'subscriptions',
      audience: 'user',
      searchTags: ['hardship', 'pause', 'freeze', 'billing', 'compassion', 'difficult'],
      icon: 'fa-hand-holding-heart',
      order: 2,
      featured: false,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'Troubleshooting Course Playback',
      slug: 'troubleshooting-course-playback',
      summary: 'Solutions for common course loading and playback issues.',
      content: `# Troubleshooting Course Playback

Having trouble with a course? Try these solutions.

## Course Won't Load

1. **Refresh the page** - Simple but often works
2. **Clear browser cache** - Settings → Clear browsing data
3. **Try a different browser** - Chrome usually works best
4. **Disable ad blockers** - They can interfere with course content

## Video Not Playing

- Check your internet connection
- Try lowering video quality if available
- Disable VPN if using one
- Update your browser to the latest version

## Progress Not Saving

- Stay on each lesson for at least 30 seconds
- Don't use multiple tabs with the same course
- Make sure you're logged in
- Check for a stable internet connection

## Quiz Issues

- Read each question carefully before answering
- You can review incorrect answers after submission
- Contact support if a question seems incorrect

## Still Having Problems?

Contact support@counselorready.com with:
- The course name
- What you were trying to do
- Any error messages you saw
- Your browser and device type`,
      category: 'troubleshooting',
      audience: 'user',
      searchTags: ['problem', 'issue', 'not working', 'error', 'help', 'video', 'loading'],
      icon: 'fa-wrench',
      order: 1,
      featured: false,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    },
    {
      title: 'Resetting Your Password',
      slug: 'resetting-your-password',
      summary: 'How to reset your password if you\'ve forgotten it.',
      content: `# Resetting Your Password

Forgot your password? No problem - here's how to reset it.

## From the Login Page

1. Go to the **Login** page
2. Click **Forgot Password?**
3. Enter your email address
4. Click **Send Reset Link**
5. Check your email (including spam folder)
6. Click the link in the email
7. Enter your new password
8. Log in with your new password

## Password Requirements

Your new password must:
- Be at least 8 characters long
- Include at least one number
- Include at least one letter

## Link Not Working?

- Links expire after 1 hour
- Request a new link if yours expired
- Make sure you're using the most recent email

## Still Can't Access Your Account?

Contact support@counselorready.com and we'll help you get back in.`,
      category: 'account',
      audience: 'user',
      searchTags: ['password', 'forgot', 'reset', 'login', 'access', 'locked out'],
      icon: 'fa-key',
      order: 1,
      featured: false,
      status: 'published',
      createdBy: userId,
      updatedBy: userId
    }
  ];
}

export default router;
