// retrofitTMH602.js — single-file callout retrofit for CR-TMH602.
// Combines inline pill retrofit (Pass B) + callout-box → structured block (Pass A).
//
// Run:  node retrofitTMH602.js          (dry run)
//       node retrofitTMH602.js --write  (apply)
//
// Idempotent. Safe to run multiple times. Skips text already containing pills.

import mongoose from 'mongoose';

const WRITE = process.argv.includes('--write');

// ── Inline pills (Pass B) ─────────────────────────────────────────────
// First occurrence per section becomes a pill. Specific patterns first.
const PILLS = [
  ['aca-code',         /\bACA Code of Ethics\b/i],
  ['aca-code',         /\bACA Code\b/i],
  ['telehealth-rule',  /\bRule 135-11(?:-\.\d+)?\b/i],
  ['telehealth-rule',  /\bRule 135\b/i],
  ['mandatory-report', /\bmandatory report(?:ing)?\b/i],
  ['informed-consent', /\binformed consent\b/i],
  ['duty-to-warn',     /\bduty to warn\b/i],
  ['nbcc-standard',    /\bNBCC standard\b/i],
  ['lpc-a-note',       /\bLPC-?A\b/],
  ['hipaa',            /\bHIPAA\b/],
  ['phi',              /\bPHI\b/],
  ['gcscw',            /\bGCSCW\b/],
  ['bc-tmh',           /\bBC-TMH\b/],
  ['tarasoff',         /\bTarasoff\b/],
];

function insertPills(text, used) {
  if (!text || /\{\{(callout|alert):/.test(text)) return { text, hits: [] };
  const parts = text.split(/(<[^>]+>)/);
  const hits = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('<') || !parts[i]) continue;
    for (const [id, re] of PILLS) {
      if (used.has(id)) continue;
      const m = re.exec(parts[i]);
      if (!m) continue;
      parts[i] = parts[i].slice(0, m.index) + '{{callout:' + id + '}}' + parts[i].slice(m.index + m[0].length);
      used.add(id);
      hits.push(id);
    }
  }
  return { text: parts.join(''), hits };
}

// ── Callout-box → structured block (Pass A) ──────────────────────────
const TYPE_MAP = [
  [/^compliance|^protocol/i,            'protocol'],
  [/clinical vignette|^case|scenario/i, 'clinical'],
  [/practice tool|^tip|best practice/i, 'tip'],
  [/^warning|^caution|^risk/i,          'warning'],
  [/key takeaway|^remember/i,           'key'],
  [/^do not|^never|prohibited/i,        'donot'],
  [/ethics|aca code|boundary/i,         'ethics'],
];
function pickType(t) { for (const [re, v] of TYPE_MAP) if (re.test(t)) return v; return 'info'; }

function splitCallouts(content) {
  if (!content || !content.includes('callout-box')) return [{ kind: 'text', payload: content }];
  const out = [];
  let last = 0;
  const re = /<div\s+class\s*=\s*"callout-box"\s*>([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) out.push({ kind: 'text', payload: content.slice(last, m.index) });
    out.push({ kind: 'callout', payload: m[1] });
    last = m.index + m[0].length;
  }
  if (last < content.length) out.push({ kind: 'text', payload: content.slice(last) });
  return out;
}

function buildCallout(inner) {
  let body = inner.replace(/^\s*<p>\s*/i, '').replace(/\s*<\/p>\s*$/i, '').trim();
  let title = '';
  const m = /^<strong>([^<]+)<\/strong>\s*(.*)$/is.exec(body);
  if (m && m[1].trim().length > 1 && !/^['"]+$/.test(m[1].trim())) {
    title = m[1].trim();
    body = m[2].trim();
  }
  // Skip table-row pattern: dual-strong header OR no-title-short-body
  const dualStrong = /^<strong>[^<]+<\/strong>\s*<strong>[^<]+<\/strong>\s*$/i.test(inner);
  const tableRow = (!title && body.length < 200) || dualStrong;
  if (tableRow) return null;
  const block = { type: 'callout', calloutType: pickType(title) };
  if (title) block.title = title;
  if (body)  block.content = body;
  return block;
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const C = mongoose.connection.collection('interactivecourses');
  const course = await C.findOne({ title: /TeleMental Health Supervision/ });
  if (!course) { console.error('Course not found'); process.exit(1); }

  console.log('Course: ' + course.title + '  (' + (WRITE ? 'WRITE' : 'DRY') + ')\n');

  let pillTotal = 0, calloutTotal = 0, tableRowsKept = 0;
  const newSections = (course.sections || []).map((s, si) => {
    const used = new Set();
    const out = [];
    let pillsHere = 0, calloutsHere = 0;

    for (const b of (s.contentBlocks || [])) {
      // Pass B: inline pills on text/imageText
      let block = b;
      if (b.type === 'text' || b.type === 'imageText') {
        const field = b.content !== undefined ? 'content' : (b.textContent !== undefined ? 'textContent' : null);
        if (field) {
          const { text, hits } = insertPills(b[field], used);
          if (hits.length) { block = { ...b, [field]: text }; pillsHere += hits.length; }
        }
      }

      // Pass A: split callout-box divs out of text blocks into structured blocks
      if (block.type !== 'text') { out.push(block); continue; }
      const field = block.content !== undefined ? 'content' : 'textContent';
      const parts = splitCallouts(block[field]);
      if (parts.length === 1 && parts[0].kind === 'text') { out.push(block); continue; }

      let buf = '';
      for (const p of parts) {
        if (p.kind === 'text') { buf += p.payload; continue; }
        if (buf.trim()) { out.push({ ...block, [field]: buf }); buf = ''; }
        const callout = buildCallout(p.payload);
        if (callout) { out.push(callout); calloutsHere++; }
        else { out.push({ type: 'text', [field]: '<div class="callout-box">' + p.payload + '</div>' }); tableRowsKept++; }
      }
      if (buf.trim()) out.push({ ...block, [field]: buf });
    }

    out.forEach((b, i) => { b.order = i + 1; });
    if (pillsHere || calloutsHere) {
      console.log('§' + (si + 1) + ' ' + (s.title || '').slice(0, 50) + ' — pills: ' + pillsHere + ', callouts: ' + calloutsHere);
    }
    pillTotal += pillsHere;
    calloutTotal += calloutsHere;
    return { ...s, contentBlocks: out };
  });

  console.log('\n──────────────────────────');
  console.log('Pills inserted:      ' + pillTotal);
  console.log('Callouts converted:  ' + calloutTotal);
  console.log('Table-rows kept:     ' + tableRowsKept);
  console.log('──────────────────────────');

  if (WRITE) {
    await C.updateOne({ _id: course._id }, { $set: { sections: newSections } });
    console.log('\n✅ Written. Refresh the course in the viewer.');
  } else {
    console.log('\n(dry run — re-run with --write to apply)');
  }
  await mongoose.disconnect();
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
