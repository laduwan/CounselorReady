// convertTMH602Callouts.js
// One-time conversion: CR-TMH602 has 12 HTML <div class="callout-box"> blocks
// embedded in text-block content. This script extracts them and converts the
// real callouts to structured `type: 'callout'` blocks; flags any that look
// like misused table-row data for manual review.
//
// Run: node src/scripts/convertTMH602Callouts.js          (dry-run, default)
//      node src/scripts/convertTMH602Callouts.js --write  (apply changes)
//
// Behavior:
//   - Loads "TeleMental Health Supervision" course from interactivecourses
//   - Walks every text-block content field
//   - For each <div class="callout-box">...</div> found:
//       * Extracts title (first <strong> tag, if at start) and body
//       * Classifies into a calloutType heuristic
//       * Decides: real callout (convert) | table-row (skip, flag)
//   - Splits parent text blocks at callout boundaries
//   - Inserts structured `type: 'callout'` blocks adjacent to surviving text
//   - Recomputes `order` on every block in each section
//   - Prints a full preview before writing anything

import mongoose from 'mongoose';

const WRITE = process.argv.includes('--write');
const COURSE_TITLE_REGEX = /TeleMental Health Supervision/;

// Heuristic: title keyword -> calloutType
const TYPE_KEYWORDS = [
  [/^compliance|^protocol/i,                  'protocol'],
  [/clinical vignette|case |scenario/i,       'clinical'],
  [/practice tool|^tip|best practice/i,       'tip'],
  [/^warning|^caution|^risk/i,                'warning'],
  [/key takeaway|^remember|^takeaway/i,       'key'],
  [/^do not|^never|prohibited/i,              'donot'],
  [/ethics|aca code|nbcc|boundary/i,          'ethics'],
];

function classifyCalloutType(title) {
  if (!title) return 'info';
  for (const [re, t] of TYPE_KEYWORDS) {
    if (re.test(title)) return t;
  }
  return 'info';
}

// Parse a text block's content for callout-boxes.
// Returns: { fragments: [{kind:'text'|'callout', payload}], hasCallouts: bool }
function parseTextContent(content) {
  if (!content || typeof content !== 'string') return { fragments: [{kind:'text', payload: content}], hasCallouts: false };
  if (!content.includes('callout-box')) return { fragments: [{kind:'text', payload: content}], hasCallouts: false };

  const fragments = [];
  // Match <div class="callout-box">...</div>, non-greedy
  const re = /<div\s+class\s*=\s*"callout-box"\s*>([\s\S]*?)<\/div>/gi;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(content)) !== null) {
    if (match.index > lastIndex) {
      fragments.push({ kind: 'text', payload: content.slice(lastIndex, match.index) });
    }
    fragments.push({ kind: 'callout', payload: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    fragments.push({ kind: 'text', payload: content.slice(lastIndex) });
  }
  return { fragments, hasCallouts: true };
}

// Convert one callout-box's INNER HTML to a structured-block proposal.
// Returns: { kind:'callout'|'tableRow', title, content, calloutType, raw }
function proposeCalloutBlock(innerHtml) {
  // Strip surrounding <p>...</p> if present
  let inner = innerHtml.replace(/^\s*<p>\s*/i, '').replace(/\s*<\/p>\s*$/i, '').trim();

  // Detect title: starts with <strong>...</strong> at the very start.
  // Apostrophe escapes (<strong>'</strong>) are punctuation, not titles — ignore.
  let title = '';
  let body = inner;

  const strongStart = /^<strong>([^<]+)<\/strong>\s*(.*)$/is;
  const m = strongStart.exec(inner);
  if (m && m[1].length > 1 && !/^['"]+$/.test(m[1].trim())) {
    title = m[1].trim();
    body = m[2].trim();
  }

  // Heuristic for table-row pattern:
  //   - No real title (pure body) OR
  //   - Short body (< 200 chars) AND starts with capitalized noun phrase pattern
  //     (e.g. "Technology proficiency Can operate platform features...")
  const isLikelyTableRow =
    (!title && body.length < 200) ||
    (!title && /^[A-Z][a-z]+(?:\s+[a-z]+){1,3}\s+[A-Z]/.test(body));

  // Special case: the dual-strong "header" row (first competency matrix row)
  //   <strong>Competency Domain</strong> <strong>Assessment Indicators...</strong>
  const dualStrong = /^<strong>([^<]+)<\/strong>\s*<strong>([^<]+)<\/strong>\s*$/i.test(inner);

  if (isLikelyTableRow || dualStrong) {
    return { kind: 'tableRow', title, content: body, raw: innerHtml };
  }

  return {
    kind: 'callout',
    title,
    content: body,
    calloutType: classifyCalloutType(title),
    raw: innerHtml
  };
}

// Build the new contentBlocks array for a section.
// For each block: if it's a text block with callouts, split at callout boundaries.
function rebuildSectionBlocks(blocks) {
  const out = [];
  let conversions = 0;
  let tableRows = 0;
  for (const b of blocks) {
    if (b.type !== 'text') {
      out.push({ ...b });
      continue;
    }
    const contentField = b.content !== undefined ? 'content' : 'textContent';
    const content = b[contentField];
    const parsed = parseTextContent(content);
    if (!parsed.hasCallouts) {
      out.push({ ...b });
      continue;
    }

    // Split into multiple blocks
    let textBuf = '';
    for (const frag of parsed.fragments) {
      if (frag.kind === 'text') {
        textBuf += frag.payload;
      } else {
        // Flush accumulated text
        if (textBuf.trim()) {
          out.push({ ...b, [contentField]: textBuf });
          textBuf = '';
        }
        const proposal = proposeCalloutBlock(frag.payload);
        if (proposal.kind === 'tableRow') {
          tableRows++;
          // Preserve as inline HTML inside a text block (manual review later)
          out.push({
            type: 'text',
            [contentField]: '<div class="callout-box">' + frag.payload + '</div>'
          });
        } else {
          conversions++;
          const callout = {
            type: 'callout',
            calloutType: proposal.calloutType,
          };
          if (proposal.title)   callout.title = proposal.title;
          if (proposal.content) callout.content = proposal.content;
          out.push(callout);
        }
      }
    }
    if (textBuf.trim()) {
      out.push({ ...b, [contentField]: textBuf });
    }
  }
  // Recompute order
  out.forEach((b, i) => { b.order = i + 1; });
  return { blocks: out, conversions, tableRows };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  const course = await C.findOne({ title: COURSE_TITLE_REGEX });
  if (!course) {
    console.error('Course not found matching:', COURSE_TITLE_REGEX);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('CR-TMH602 Callout Conversion ' + (WRITE ? '(WRITE MODE)' : '(DRY RUN)'));
  console.log('Course: ' + course.title);
  console.log('Sections: ' + (course.sections || []).length);
  console.log('═══════════════════════════════════════════════════════════\n');

  let totalConversions = 0;
  let totalTableRows = 0;
  let totalCalloutsFound = 0;
  const newSections = [];

  for (let si = 0; si < (course.sections || []).length; si++) {
    const section = course.sections[si];
    const before = (section.contentBlocks || []).length;

    // Count callouts in section before processing
    const calloutCount = (section.contentBlocks || []).reduce((sum, b) => {
      const c = (b.content || b.textContent || '');
      return sum + ((c.match(/callout-box/g) || []).length);
    }, 0);

    if (calloutCount === 0) {
      newSections.push({ ...section });
      continue;
    }

    totalCalloutsFound += calloutCount;
    console.log('--- Section ' + (si + 1) + ': ' + (section.title || '(no title)') + ' ---');
    console.log('  callouts found: ' + calloutCount);

    const { blocks, conversions, tableRows } = rebuildSectionBlocks(section.contentBlocks || []);
    totalConversions += conversions;
    totalTableRows += tableRows;

    console.log('  blocks: ' + before + ' -> ' + blocks.length);
    console.log('  -> ' + conversions + ' converted to type:callout');
    console.log('  -> ' + tableRows + ' kept inline (table-row pattern, manual review)');

    // Show each conversion
    blocks.filter(b => b.type === 'callout').forEach((c, i) => {
      console.log('     [' + (i+1) + '] type:callout calloutType:' + c.calloutType + ' title:"' + (c.title || '(none)').slice(0, 60) + '"');
    });

    console.log('');
    newSections.push({ ...section, contentBlocks: blocks });
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('  Callouts found in source: ' + totalCalloutsFound);
  console.log('  Will convert to type:callout: ' + totalConversions);
  console.log('  Will leave inline (table rows): ' + totalTableRows);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (WRITE) {
    await C.updateOne(
      { _id: course._id },
      { $set: { sections: newSections } }
    );
    console.log('✅ Written to DB. Verify in viewer before celebrating.');
  } else {
    console.log('(DRY RUN — no changes written. Re-run with --write to apply.)');
  }

  await mongoose.disconnect();
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
