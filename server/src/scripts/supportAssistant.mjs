/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 *
 * supportAssistant.mjs — an OFFLINE tech-support assistant for CounselorReady.
 * Ask it how your own system works; it answers from YOUR repo's documentation
 * (not the model's training, not the internet), and tells you which docs it used.
 *
 * Runs on the Mac with Ollama. From the repo root:
 *
 *   node server/src/scripts/supportAssistant.mjs "how does the marketplace revenue split work?"
 *   node server/src/scripts/supportAssistant.mjs "what job self-heals certificates and when does it run?"
 *
 * Options:
 *   --model <tag>   default qwen3.6:27b
 *   --docs  <dir>   default the current folder (run from repo root)
 *   --topk  <n>     default 5 doc chunks
 *
 * Grounds on SYSTEM docs only — the big clinical course files under courseMarkdown/
 * and docs/supplemental/ are excluded so answers stay about the software.
 */
import fs from 'node:fs';
import path from 'node:path';

const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');

function opt(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
// the question = all args that aren't options
const question = process.argv.slice(2).filter((a, i, arr) =>
  !a.startsWith('--') && !(i > 0 && arr[i - 1].startsWith('--'))).join(' ').trim();

const MODEL   = opt('model', 'qwen3.6:27b');
const DOCS    = path.resolve(opt('docs', process.cwd()));
const TOPK    = parseInt(opt('topk', '5'), 10);

// Folders that are content, not system docs — kept OUT of the support corpus.
const EXCLUDE = [/node_modules/, /[/\\]\.git[/\\]/, /courseMarkdown/, /[/\\]supplemental[/\\]/];

const STOP = new Set('a an and are as at be by for from has have in is it its of on or that the to with this these those into your you our will can may how does do what when where which why'.split(' '));
const tokenize = s => (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter(t => t.length > 2 && !STOP.has(t));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (EXCLUDE.some(rx => rx.test(full))) continue;
    if (e.isDirectory()) walk(full, out);
    else if (/\.(md|markdown|txt)$/i.test(e.name)) out.push(full);
  }
  return out;
}

function chunk(text) {
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const out = []; let buf = '';
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > 1200 && buf) { out.push(buf); buf = p; }
    else buf = buf ? buf + '\n\n' + p : p;
  }
  if (buf) out.push(buf);
  return out;
}

function buildCorpus() {
  const files = walk(DOCS);
  const chunks = [];
  for (const f of files) {
    const src = path.relative(DOCS, f);
    for (const text of chunk(fs.readFileSync(f, 'utf8'))) chunks.push({ src, text });
  }
  const df = new Map();
  for (const c of chunks) for (const t of new Set(tokenize(c.text))) df.set(t, (df.get(t) || 0) + 1);
  const N = Math.max(1, chunks.length);
  const idf = new Map([...df].map(([t, n]) => [t, Math.log(1 + N / n)]));
  return { chunks, idf, fileCount: files.length };
}

function retrieve(corpus, query, k) {
  const q = tokenize(query);
  return corpus.chunks
    .map(c => {
      const present = new Set(tokenize(c.text));
      let score = 0;
      for (const t of q) if (present.has(t)) score += corpus.idf.get(t) || 0.1;
      return { ...c, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

async function ask() {
  if (!question) {
    console.error('Ask a question, e.g.:\n  node server/src/scripts/supportAssistant.mjs "how does SCORM export work?"');
    process.exit(1);
  }
  const corpus = buildCorpus();
  if (!corpus.chunks.length) {
    console.error(`No documentation found under ${DOCS}. Run this from your CounselorReady repo root.`);
    process.exit(1);
  }
  const hits = retrieve(corpus, question, TOPK);
  if (!hits.length) {
    console.log("Nothing in the docs matched that. Try rephrasing with terms your docs would use.");
    return;
  }

  const context = hits.map((h, i) => `[Doc ${i + 1} — ${h.src}]\n${h.text}`).join('\n\n');
  const messages = [
    {
      role: 'system',
      content:
        'You are the CounselorReady engineering support assistant. Answer the question using ONLY '
        + 'the documentation excerpts below. Cite the file name(s) you used. If the docs do not '
        + 'contain the answer, say so plainly — do NOT guess about the codebase or invent behavior.\n\n'
        + '=== DOCUMENTATION ===\n' + context,
    },
    { role: 'user', content: question },
  ];

  process.stdout.write(`\nSearched ${corpus.fileCount} system docs. Asking ${MODEL}...\n\n`);

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, stream: false, options: { temperature: 0.2 } }),
  }).catch(e => { throw new Error(`Cannot reach Ollama at ${OLLAMA_URL} — is it running? (${e.message})`); });

  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text().catch(() => '')}`);
  const data = await res.json();

  console.log(data?.message?.content ?? '(no answer)');
  console.log('\n— grounded in: ' + hits.map(h => h.src).join(', '));
}

ask().catch(e => { console.error('\n' + e.message); process.exit(1); });
