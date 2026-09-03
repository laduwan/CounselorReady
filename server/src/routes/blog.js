import express from 'express';
import multer from 'multer';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';
import { protect, requireAdmin } from '../middleware/auth.js';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// ============================================================
// PUBLIC ROUTES (no auth required)
// ============================================================

// GET /api/blog — list published posts (public blog index)
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 12 } = req.query;
    const query = { status: 'published' };

    if (category) query.category = category;
    if (tag) query.tags = tag.toLowerCase();

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .select('title slug excerpt author category tags publishedAt featuredImage readingTime wordCount')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Blog list error:', err);
    res.status(500).json({ error: 'Failed to load blog posts' });
  }
});

// GET /api/blog/sitemap — sitemap data for all published posts
router.get('/sitemap', async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' })
      .select('slug updatedAt publishedAt')
      .sort({ publishedAt: -1 });

    res.json({ posts });
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).json({ error: 'Failed to generate sitemap data' });
  }
});

// NOTE: GET /:slug is defined LAST in this file so it cannot shadow
// /admin/* routes. See bottom of file.


// ============================================================
// ADMIN ROUTES (auth required)
// ============================================================

const authenticateToken = protect;
const isAdmin = requireAdmin;

// GET /api/blog/admin/all — list ALL posts including drafts
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Admin blog list error:', err);
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

// GET /api/blog/admin/:id — single post by ID (admin, includes drafts)
router.get('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) {
    console.error('Admin get post error:', err);
    res.status(500).json({ error: 'Failed to load post' });
  }
});

// POST /api/blog/admin — create new post
router.post('/admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      title, content, excerpt, author, category,
      tags, metaTitle, metaDescription, targetKeywords,
      status, featuredImage
    } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({ error: 'Title, content, and excerpt are required' });
    }

    const post = new BlogPost({
      title,
      content,
      excerpt,
      author: author || undefined,
      category: category || undefined,
      tags: tags || [],
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      targetKeywords: targetKeywords || [],
      status: status || 'draft',
      featuredImage: featuredImage || undefined
    });

    await post.save();
    res.status(201).json({ post, message: 'Post created' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A post with this slug already exists. Change the title slightly.' });
    }
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// POST /api/blog/admin/upload — upload .md file with frontmatter
router.post('/admin/upload', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const raw = req.file.buffer.toString('utf8');
    const clean = raw.replace(/^\uFEFF/, '');
    let { data, content } = matter(clean);

    // Auto-generate frontmatter when missing
    if (!data.title) {
      const body = content.trim() || clean.trim();
      const h1Match = body.match(/^#\s+(.+)$/m);
      const title = h1Match ? h1Match[1].trim() : 'Untitled Post';

      const firstPara = body.split('\n\n').find(p => !p.startsWith('#') && p.trim().length > 20);
      const excerpt = firstPara ? firstPara.trim().substring(0, 200) : '';

      data = {
        ...data,
        title,
        author: 'Kejuiana Johnson, LPC, NCC, CPCS, BC-TMH',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
        tags: [],
        excerpt
      };

      // Use full file as content when no frontmatter was present
      if (!content.trim()) content = clean.trim();
    }

    const toArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        return val.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    };

    const post = new BlogPost({
      title: data.title,
      content,
      excerpt: data.excerpt || undefined,
      author: data.author || undefined,
      category: data.category || undefined,
      tags: toArray(data.tags),
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      targetKeywords: toArray(data.targetKeywords),
      status: data.status || 'draft',
      featuredImage: data.featuredImage || undefined
    });

    await post.save();
    res.status(201).json({ post, message: 'Post uploaded' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A post with this slug already exists. Change the title slightly.' });
    }
    console.error('Upload post error:', err);
    res.status(500).json({ error: 'Failed to upload post' });
  }
});

// PUT /api/blog/admin/:id — update post
router.put('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const fields = [
      'title', 'content', 'excerpt', 'author', 'category',
      'tags', 'metaTitle', 'metaDescription', 'targetKeywords',
      'status', 'featuredImage'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    // If publishing for first time, set publishedAt
    if (req.body.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();
    res.json({ post, message: 'Post updated' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug conflict. Change the title slightly.' });
    }
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/blog/admin/:id — delete post
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/blog/admin/:id/toggle — toggle publish/draft
router.post('/admin/:id/toggle', authenticateToken, isAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.status === 'published') {
      post.status = 'draft';
    } else {
      post.status = 'published';
      if (!post.publishedAt) post.publishedAt = new Date();
    }

    await post.save();
    res.json({ post, message: `Post ${post.status === 'published' ? 'published' : 'unpublished'}` });
  } catch (err) {
    console.error('Toggle post error:', err);
    res.status(500).json({ error: 'Failed to toggle post status' });
  }
});

// GET /api/blog/quick-review/:token — one-click approve/reject from digest
// email. No login required (token is the auth). Public by design — do not
// add authenticateToken/isAdmin here.
router.get('/quick-review/:token', async (req, res) => {
  const brandStyle = `font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 80px auto; text-align: center; color: #6B1D34;`;

  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'blog-review') {
      return res.status(400).send(`<div style="${brandStyle}"><h2>Invalid link</h2></div>`);
    }

    const post = await BlogPost.findById(decoded.postId);
    if (!post) {
      return res.status(404).send(`<div style="${brandStyle}"><h2>Draft not found</h2><p>It may have already been reviewed.</p></div>`);
    }

    if (decoded.action === 'approve') {
      if (post.status !== 'published') {
        post.status = 'published';
        post.publishedAt = post.publishedAt || new Date();
        await post.save();
      }
      return res.send(`<div style="${brandStyle}"><h2>✓ Published</h2><p>"${post.title}" is now live.</p></div>`);
    }

    if (decoded.action === 'reject') {
      await BlogPost.findByIdAndDelete(decoded.postId);
      return res.send(`<div style="${brandStyle}"><h2>Discarded</h2><p>"${post.title}" has been removed.</p></div>`);
    }

    return res.status(400).send(`<div style="${brandStyle}"><h2>Unknown action</h2></div>`);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).send(`<div style="${brandStyle}"><h2>Link expired</h2><p>Review links are valid for 14 days. Approve or reject this draft directly in /admin-blog.html.</p></div>`);
    }
    console.error('Quick-review error:', err.message);
    return res.status(400).send(`<div style="${brandStyle}"><h2>Invalid link</h2></div>`);
  }
});

// ============================================================
// PUBLIC SLUG ROUTE (defined LAST so specific paths win)
// ============================================================

// GET /api/blog/:slug — single published post by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: 'published'
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (err) {
    console.error('Blog post error:', err);
    res.status(500).json({ error: 'Failed to load post' });
  }
});

export default router;
