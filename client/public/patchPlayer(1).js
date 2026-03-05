// ═══════════════════════════════════════════════════════════════════
// PATCH: interactive-course.html (CommonJS)
// Run from CounselorReady root: node patchPlayer.js
// ═══════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'client', 'public', 'interactive-course.html');

if (!fs.existsSync(FILE)) {
  console.error('File not found:', FILE);
  console.error('Run this from the CounselorReady root directory.');
  process.exit(1);
}

let html = fs.readFileSync(FILE, 'utf-8');
const originalLength = html.length;

fs.writeFileSync(FILE + '.bak', html, 'utf-8');
console.log('Backup saved to interactive-course.html.bak');

let editsApplied = 0;

// ═══ EDIT 1: marked.js CDN ═══
if (!html.includes('marked.min.js')) {
  const tag = '<script src="https://cdn.tailwindcss.com"></script>';
  if (html.includes(tag)) {
    html = html.replace(tag, tag + '\n  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>');
    editsApplied++;
    console.log('Edit 1: marked.js CDN added');
  } else {
    console.log('Edit 1: SKIP - Tailwind tag not found');
  }
} else {
  console.log('Edit 1: SKIP - already present');
}

// ═══ EDIT 2: Table CSS + Blockquote + Eggshell + APA headings ═══
const TABLE_CSS = '\n' +
'    /* === Table Styling (patch) === */\n' +
'    .prose table, .cr-content table {\n' +
'      width: 100%; border-collapse: collapse; margin: 1.5rem 0;\n' +
'      font-size: 0.925rem; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden;\n' +
'    }\n' +
'    .prose th, .cr-content th {\n' +
'      background: #f0f4f1; color: #284157; font-weight: 700; text-align: left;\n' +
'      padding: 12px 16px; border-bottom: 2px solid #4A7C59;\n' +
'      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.03em;\n' +
'    }\n' +
'    .prose td, .cr-content td {\n' +
'      padding: 10px 16px; border-bottom: 1px solid #e5e7eb;\n' +
'      color: #475569; line-height: 1.6; vertical-align: top;\n' +
'    }\n' +
'    .prose tr:nth-child(even), .cr-content tr:nth-child(even) { background: #fafaf8; }\n' +
'    .prose tr:hover, .cr-content tr:hover { background: rgba(74, 124, 89, 0.04); }\n' +
'\n' +
'    /* === Blockquote / Clinical Vignette (patch) === */\n' +
'    .prose blockquote, .cr-content blockquote {\n' +
'      border-left: 4px solid #D4A855; background: rgba(212, 168, 85, 0.06);\n' +
'      padding: 16px 20px; margin: 1.5rem 0; border-radius: 0 8px 8px 0;\n' +
'      font-style: italic; color: #475569;\n' +
'    }\n' +
'    .prose blockquote p:last-child, .cr-content blockquote p:last-child { margin-bottom: 0; }\n' +
'\n' +
'    /* === Eggshell content area (patch) === */\n' +
'    #content-area { background: #F5F5DC; min-height: calc(100vh - 200px); }\n' +
'\n' +
'    /* === APA heading hierarchy (patch) === */\n' +
'    .prose h2, .cr-content h2 {\n' +
'      font-family: "Cormorant Garamond", serif; font-weight: 600;\n' +
'      font-size: 1.75rem; color: #284157; margin: 2rem 0 1rem 0;\n' +
'    }\n' +
'    .prose h3, .cr-content h3 {\n' +
'      font-weight: 700; font-size: 1.25rem; color: #4A7C59;\n' +
'      margin: 1.5rem 0 0.75rem 0;\n' +
'    }\n' +
'    .prose h4, .cr-content h4 {\n' +
'      font-weight: 600; font-size: 1.1rem; color: #284157;\n' +
'      margin: 1.25rem 0 0.5rem 0;\n' +
'    }\n' +
'\n' +
'    /* === Reference list APA hanging indent (patch) === */\n' +
'    .cr-references { margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #d1d5db; }\n' +
'    .cr-reference { padding-left: 2em; text-indent: -2em; margin-bottom: 0.75rem; font-size: 0.925rem; line-height: 1.6; }\n';

if (!html.includes('Table Styling (patch)')) {
  const styleIdx = html.indexOf('</style>');
  if (styleIdx > -1) {
    html = html.slice(0, styleIdx) + TABLE_CSS + '  ' + html.slice(styleIdx);
    editsApplied++;
    console.log('Edit 2: Table CSS + blockquote + eggshell + APA headings added');
  } else {
    console.log('Edit 2: SKIP - no </style> found');
  }
} else {
  console.log('Edit 2: SKIP - already present');
}

// ═══ EDIT 3: Smart text rendering ═══
const OLD_TEXT = "case 'text':\n" +
"          div.innerHTML = `\n" +
"            <div class=\"prose max-w-none\">\n" +
"              ${block.content || block.textContent || ''}\n" +
"            </div>\n" +
"          `;\n" +
"          break;";

const NEW_TEXT = "case 'text':\n" +
"          var rawText = block.content || block.textContent || '';\n" +
"          var isHtmlContent = /<[a-z][\\s\\S]*>/i.test(rawText);\n" +
"          var renderedText = isHtmlContent ? rawText : (typeof marked !== 'undefined' ? marked.parse(rawText) : rawText);\n" +
"          div.innerHTML = `\n" +
"            <div class=\"cr-content prose max-w-none\">\n" +
"              ${renderedText}\n" +
"            </div>\n" +
"          `;\n" +
"          break;";

if (html.includes('isHtmlContent') || html.includes('renderedText')) {
  console.log('Edit 3: SKIP - already present');
} else if (html.includes(OLD_TEXT)) {
  html = html.replace(OLD_TEXT, NEW_TEXT);
  editsApplied++;
  console.log('Edit 3: Smart text rendering applied');
} else {
  // Flexible regex match
  const flexRe = /case\s+'text':\s*\n\s*div\.innerHTML\s*=\s*`[^`]*block\.content\s*\|\|\s*block\.textContent[^`]*`;\s*\n\s*break;/;
  if (flexRe.test(html)) {
    html = html.replace(flexRe, NEW_TEXT);
    editsApplied++;
    console.log('Edit 3: Smart text rendering applied (flex match)');
  } else {
    console.log('Edit 3: WARNING - could not find text block pattern. Manual edit needed.');
  }
}

// ═══ EDIT 4: Overview Card on Section 1 ═══
const OVERVIEW_CODE = '\n' +
'      // === Overview Card (Section 1 only) === patch ===\n' +
'      if (currentSectionIndex === 0 && course) {\n' +
'        var overviewCard = document.createElement("div");\n' +
'        overviewCard.style.cssText = "background:linear-gradient(135deg,#6B1D34,#4A1224);border-radius:16px;padding:32px;margin-bottom:32px;color:#fff";\n' +
'        var cardHtml = \'<h2 style="font-family:Cormorant Garamond,serif;font-size:28px;font-weight:700;margin:0 0 8px 0;color:#fff">What You\\\'ll Learn</h2>\';\n' +
'        var badges = [];\n' +
'        if (course.ceHours) badges.push(\'<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(212,168,85,0.2);color:#D4A855;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">\' + course.ceHours + \' CE Hours</span>\');\n' +
'        if (course.courseLevel) badges.push(\'<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.9);padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">\' + course.courseLevel + \'</span>\');\n' +
'        badges.push(\'<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(74,124,89,0.3);color:rgba(255,255,255,0.9);padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">NBCC ACEP #\' + (course.acepNumber || course.providerNumber || "7760") + \'</span>\');\n' +
'        cardHtml += \'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">\' + badges.join("") + \'</div>\';\n' +
'        var objectives = course.objectives || course.learningObjectives || [];\n' +
'        if (objectives.length) {\n' +
'          cardHtml += \'<div style="margin-bottom:20px">\';\n' +
'          cardHtml += \'<h3 style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.05em">Learning Objectives</h3>\';\n' +
'          cardHtml += \'<ul style="list-style:none;padding:0;margin:0">\';\n' +
'          objectives.forEach(function(obj) {\n' +
'            var text = typeof obj === "string" ? obj : (obj.text || obj.objective || "");\n' +
'            if (text) cardHtml += \'<li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.9)"><span style="color:#D4A855;font-size:16px;flex-shrink:0;margin-top:2px">&#10003;</span>\' + text + \'</li>\';\n' +
'          });\n' +
'          cardHtml += \'</ul></div>\';\n' +
'        }\n' +
'        if (course.sections && course.sections.length > 1) {\n' +
'          cardHtml += \'<div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:16px;margin-top:8px">\';\n' +
'          cardHtml += \'<h3 style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.05em">Course Outline</h3>\';\n' +
'          cardHtml += \'<div style="display:grid;gap:6px">\';\n' +
'          course.sections.forEach(function(s, i) {\n' +
'            cardHtml += \'<div style="display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(255,255,255,0.85)"><span style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.12);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">\' + (i + 1) + \'</span>\' + (s.title || "Section " + (i + 1)) + \'</div>\';\n' +
'          });\n' +
'          cardHtml += \'</div></div>\';\n' +
'        }\n' +
'        cardHtml += \'<div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.15);text-align:center"><span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em">Course Content Begins Below</span></div>\';\n' +
'        overviewCard.innerHTML = cardHtml;\n' +
'        container.appendChild(overviewCard);\n' +
'      }\n';

if (html.includes('Overview Card (Section 1 only)')) {
  console.log('Edit 4: SKIP - already present');
} else {
  const marker = 'section.contentBlocks?.forEach((block, blockIndex) => {';
  let pos = html.indexOf(marker);
  if (pos > -1) {
    html = html.slice(0, pos) + OVERVIEW_CODE + '\n      ' + html.slice(pos);
    editsApplied++;
    console.log('Edit 4: Overview card added');
  } else {
    const alt = 'section.contentBlocks?.forEach(';
    pos = html.indexOf(alt);
    if (pos > -1) {
      html = html.slice(0, pos) + OVERVIEW_CODE + '\n      ' + html.slice(pos);
      editsApplied++;
      console.log('Edit 4: Overview card added (alt match)');
    } else {
      console.log('Edit 4: WARNING - could not find contentBlocks forEach. Manual edit needed.');
    }
  }
}

// ═══ SAVE ═══
fs.writeFileSync(FILE, html, 'utf-8');
console.log('\n=== DONE ===');
console.log('Edits applied: ' + editsApplied + '/4');
console.log('File size: ' + originalLength.toLocaleString() + ' -> ' + html.length.toLocaleString() + ' chars');
console.log('\nNext: push to GitHub, then hard refresh (Ctrl+Shift+R) any course.');
