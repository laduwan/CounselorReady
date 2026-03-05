// ═══════════════════════════════════════════════════════════════════
// PATCH: interactive-course.html
// Applies 4 edits:
//   1. marked.js CDN in <head>
//   2. Table CSS + blockquote + eggshell background
//   3. Smart text rendering (HTML vs markdown detection)
//   4. Overview card on Section 1
//
// Usage (from CounselorReady root):
//   node patchPlayer.js
//
// Creates a backup at interactive-course.html.bak before patching.
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'client', 'public', 'interactive-course.html');

if (!fs.existsSync(FILE)) {
  console.error('❌ File not found:', FILE);
  console.error('   Run this from the CounselorReady root directory.');
  process.exit(1);
}

let html = fs.readFileSync(FILE, 'utf-8');
const originalLength = html.length;

// Backup
fs.writeFileSync(FILE + '.bak', html, 'utf-8');
console.log('📦 Backup saved to interactive-course.html.bak');

let editsApplied = 0;

// ═══════════════════════════════════════════════════════════════════
// EDIT 1: Add marked.js CDN after Tailwind
// ═══════════════════════════════════════════════════════════════════
if (!html.includes('marked.min.js') && !html.includes('marked/marked.min')) {
  const tailwindTag = `<script src="https://cdn.tailwindcss.com"></script>`;
  if (html.includes(tailwindTag)) {
    html = html.replace(
      tailwindTag,
      tailwindTag + '\n  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>'
    );
    editsApplied++;
    console.log('✅ Edit 1: marked.js CDN added');
  } else {
    console.log('⚠️  Edit 1: Could not find Tailwind CDN tag — skipped');
  }
} else {
  console.log('⏭️  Edit 1: marked.js already present — skipped');
}

// ═══════════════════════════════════════════════════════════════════
// EDIT 2: Table CSS + Blockquote + Eggshell background
// ═══════════════════════════════════════════════════════════════════
const TABLE_CSS = `
    /* ═══ Table Styling (patch) ═══ */
    .prose table, .cr-content table {
      width: 100%; border-collapse: collapse; margin: 1.5rem 0;
      font-size: 0.925rem; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden;
    }
    .prose th, .cr-content th {
      background: #f0f4f1; color: #284157; font-weight: 700; text-align: left;
      padding: 12px 16px; border-bottom: 2px solid #4A7C59;
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.03em;
    }
    .prose td, .cr-content td {
      padding: 10px 16px; border-bottom: 1px solid #e5e7eb;
      color: #475569; line-height: 1.6; vertical-align: top;
    }
    .prose tr:nth-child(even), .cr-content tr:nth-child(even) { background: #fafaf8; }
    .prose tr:hover, .cr-content tr:hover { background: rgba(74, 124, 89, 0.04); }

    /* ═══ Blockquote / Clinical Vignette (patch) ═══ */
    .prose blockquote, .cr-content blockquote {
      border-left: 4px solid #D4A855; background: rgba(212, 168, 85, 0.06);
      padding: 16px 20px; margin: 1.5rem 0; border-radius: 0 8px 8px 0;
      font-style: italic; color: #475569;
    }
    .prose blockquote p:last-child, .cr-content blockquote p:last-child { margin-bottom: 0; }

    /* ═══ Eggshell content area (patch) ═══ */
    #content-area { background: #F5F5DC; min-height: calc(100vh - 200px); border-radius: 0; }

    /* ═══ APA heading hierarchy (patch) ═══ */
    .prose h2, .cr-content h2 {
      font-family: 'Cormorant Garamond', serif; font-weight: 600;
      font-size: 1.75rem; color: #284157; margin: 2rem 0 1rem 0;
    }
    .prose h3, .cr-content h3 {
      font-weight: 700; font-size: 1.25rem; color: #4A7C59;
      margin: 1.5rem 0 0.75rem 0;
    }
    .prose h4, .cr-content h4 {
      font-weight: 600; font-size: 1.1rem; color: #284157;
      margin: 1.25rem 0 0.5rem 0;
    }

    /* ═══ Reference list APA hanging indent (patch) ═══ */
    .cr-references { margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #d1d5db; }
    .cr-reference { padding-left: 2em; text-indent: -2em; margin-bottom: 0.75rem; font-size: 0.925rem; line-height: 1.6; }
`;

if (!html.includes('Table Styling (patch)')) {
  // Find the last </style> in <head>
  const styleCloseIdx = html.indexOf('</style>');
  if (styleCloseIdx > -1) {
    html = html.slice(0, styleCloseIdx) + TABLE_CSS + '\n  ' + html.slice(styleCloseIdx);
    editsApplied++;
    console.log('✅ Edit 2: Table CSS + blockquote + eggshell + APA headings added');
  } else {
    console.log('⚠️  Edit 2: Could not find </style> tag — skipped');
  }
} else {
  console.log('⏭️  Edit 2: Table CSS already present — skipped');
}

// ═══════════════════════════════════════════════════════════════════
// EDIT 3: Smart text rendering (markdown fallback)
// ═══════════════════════════════════════════════════════════════════

// Pattern: the text case in renderContentBlock
const TEXT_BLOCK_PATTERN = /case 'text':\s*\n\s*div\.innerHTML\s*=\s*`\s*\n\s*<div class="prose max-w-none">\s*\n\s*\$\{block\.content \|\| block\.textContent \|\| ''\}\s*\n\s*<\/div>\s*\n\s*`;\s*\n\s*break;/;

const TEXT_BLOCK_REPLACEMENT = `case 'text':
          const rawText = block.content || block.textContent || '';
          const isHtmlContent = /<[a-z][\\s\\S]*>/i.test(rawText);
          const renderedText = isHtmlContent ? rawText : (typeof marked !== 'undefined' ? marked.parse(rawText) : rawText);
          div.innerHTML = \`
            <div class="cr-content prose max-w-none">
              \${renderedText}
            </div>
          \`;
          break;`;

if (TEXT_BLOCK_PATTERN.test(html)) {
  html = html.replace(TEXT_BLOCK_PATTERN, TEXT_BLOCK_REPLACEMENT);
  editsApplied++;
  console.log('✅ Edit 3: Smart text rendering applied');
} else {
  // Try a more flexible match
  const flexPattern = /case\s+'text':\s*\n[^]*?block\.content\s*\|\|\s*block\.textContent[^]*?break;/;
  const match = html.match(flexPattern);
  if (match && !html.includes('isHtmlContent')) {
    html = html.replace(match[0], TEXT_BLOCK_REPLACEMENT);
    editsApplied++;
    console.log('✅ Edit 3: Smart text rendering applied (flex match)');
  } else if (html.includes('isHtmlContent')) {
    console.log('⏭️  Edit 3: Smart text rendering already present — skipped');
  } else {
    console.log('⚠️  Edit 3: Could not find text block pattern — MANUAL EDIT NEEDED');
    console.log('   Find: case \'text\': ... block.content || block.textContent ... break;');
    console.log('   In the renderContentBlock function');
  }
}

// ═══════════════════════════════════════════════════════════════════
// EDIT 4: Overview Card on Section 1
// ═══════════════════════════════════════════════════════════════════
const OVERVIEW_CARD_CODE = `
      // ═══ Overview Card (Section 1 only) — patch ═══
      if (currentSectionIndex === 0 && course) {
        const overviewCard = document.createElement('div');
        overviewCard.style.cssText = 'background:linear-gradient(135deg,#6B1D34,#4A1224);border-radius:16px;padding:32px;margin-bottom:32px;color:#fff';
        let cardHtml = '<h2 style="font-family:\\'Cormorant Garamond\\',serif;font-size:28px;font-weight:700;margin:0 0 8px 0;color:#fff">What You\\'ll Learn</h2>';

        // Badges
        const badges = [];
        if (course.ceHours) badges.push('<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(212,168,85,0.2);color:#D4A855;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">' + course.ceHours + ' CE Hours</span>');
        if (course.courseLevel) badges.push('<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.9);padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">' + course.courseLevel + '</span>');
        badges.push('<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(74,124,89,0.3);color:rgba(255,255,255,0.9);padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">NBCC ACEP #' + (course.acepNumber || course.providerNumber || '7760') + '</span>');
        cardHtml += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">' + badges.join('') + '</div>';

        // Learning Objectives
        const objectives = course.objectives || course.learningObjectives || [];
        if (objectives.length) {
          cardHtml += '<div style="margin-bottom:20px">';
          cardHtml += '<h3 style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.05em">Learning Objectives</h3>';
          cardHtml += '<ul style="list-style:none;padding:0;margin:0">';
          objectives.forEach(function(obj) {
            var text = typeof obj === 'string' ? obj : (obj.text || obj.objective || '');
            if (text) cardHtml += '<li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.9)"><span style="color:#D4A855;font-size:16px;flex-shrink:0;margin-top:2px">✓</span>' + text + '</li>';
          });
          cardHtml += '</ul></div>';
        }

        // Course Outline
        if (course.sections && course.sections.length > 1) {
          cardHtml += '<div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:16px;margin-top:8px">';
          cardHtml += '<h3 style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.05em">Course Outline</h3>';
          cardHtml += '<div style="display:grid;gap:6px">';
          course.sections.forEach(function(s, i) {
            cardHtml += '<div style="display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(255,255,255,0.85)"><span style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.12);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">' + (i + 1) + '</span>' + (s.title || 'Section ' + (i + 1)) + '</div>';
          });
          cardHtml += '</div></div>';
        }

        // Divider
        cardHtml += '<div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.15);text-align:center"><span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em">Course Content Begins Below</span></div>';

        overviewCard.innerHTML = cardHtml;
        container.appendChild(overviewCard);
      }
`;

if (!html.includes('Overview Card (Section 1 only)')) {
  // Find the forEach that renders content blocks in renderSection
  const forEachPattern = /section\.contentBlocks\?\.forEach\(\(block,\s*blockIndex\)\s*=>\s*\{/;
  const forEachMatch = html.match(forEachPattern);
  if (forEachMatch) {
    const insertPos = html.indexOf(forEachMatch[0]);
    html = html.slice(0, insertPos) + OVERVIEW_CARD_CODE + '\n      ' + html.slice(insertPos);
    editsApplied++;
    console.log('✅ Edit 4: Overview card added');
  } else {
    console.log('⚠️  Edit 4: Could not find contentBlocks forEach — MANUAL EDIT NEEDED');
  }
} else {
  console.log('⏭️  Edit 4: Overview card already present — skipped');
}

// ═══════════════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════════════
fs.writeFileSync(FILE, html, 'utf-8');
const newLength = html.length;

console.log(`\n═══ DONE ═══`);
console.log(`Edits applied: ${editsApplied}/4`);
console.log(`File size: ${originalLength.toLocaleString()} → ${newLength.toLocaleString()} chars (+${(newLength - originalLength).toLocaleString()})`);
console.log(`\nNext steps:`);
console.log(`  1. Review the file in your editor`);
console.log(`  2. Push to GitHub → Render auto-deploys`);
console.log(`  3. Hard refresh (Ctrl+Shift+R) any course to verify`);
console.log(`  4. Check: overview card on Section 1, styled tables, eggshell background`);
