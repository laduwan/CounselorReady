/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeHTML, safeHTML } from '../utils/sanitize';

describe('sanitizeHTML', () => {
  it('returns empty string for falsy input', () => {
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
    expect(sanitizeHTML('')).toBe('');
  });

  it('preserves safe HTML tags', () => {
    const input = '<h1>Title</h1><p>Hello <strong>world</strong></p>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<h1>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<p>');
  });

  it('strips script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('<p>Hello</p>');
  });

  it('strips iframe tags', () => {
    const input = '<iframe src="https://evil.com"></iframe><p>Safe</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<iframe');
    expect(result).toContain('<p>Safe</p>');
  });

  it('strips event handlers', () => {
    const input = '<img src="x" onerror="alert(1)" />';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('onerror');
  });

  it('strips form elements', () => {
    const input = '<form><input type="text" /><button>Submit</button></form>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<form');
    expect(result).not.toContain('<input');
    expect(result).not.toContain('<button');
  });

  it('preserves list elements', () => {
    const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('preserves table elements', () => {
    const input = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<table>');
    expect(result).toContain('<th>');
    expect(result).toContain('<td>');
  });

  it('adds rel="noopener noreferrer" to links', () => {
    const input = '<a href="https://example.com">Link</a>';
    const result = sanitizeHTML(input);
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('target="_blank"');
  });

  it('safeHTML is an alias for sanitizeHTML', () => {
    const input = '<p>Hello</p><script>bad</script>';
    expect(safeHTML(input)).toBe(sanitizeHTML(input));
  });
});
