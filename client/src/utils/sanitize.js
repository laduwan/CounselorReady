/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// client/src/utils/sanitize.js
// Centralized HTML sanitization for all dangerouslySetInnerHTML usage
import DOMPurify from 'dompurify';

// Allow standard educational content HTML tags
// Strips <script>, <iframe>, event handlers (onclick, onerror, etc.)
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    // Structure
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'br', 'hr',
    // Text formatting
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small',
    // Lists
    'ul', 'ol', 'li',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // Links & media
    'a', 'img', 'figure', 'figcaption', 'video', 'source', 'audio',
    // Semantic
    'blockquote', 'cite', 'code', 'pre', 'abbr', 'details', 'summary',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
    'class', 'id', 'style', 'colspan', 'rowspan', 'scope',
    'controls', 'autoplay', 'muted', 'loop', 'type',
  ],
  // Force all links to open in new tab safely
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
};

// Hook: force rel="noopener noreferrer" on all links
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Sanitize HTML string for safe rendering via dangerouslySetInnerHTML
 * @param {string} html - Raw HTML string
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHTML(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}

/**
 * Shorthand for use in JSX: dangerouslySetInnerHTML={{ __html: safeHTML(content) }}
 */
export const safeHTML = sanitizeHTML;

export default sanitizeHTML;
