/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * localAIClient.js — a drop-in replacement for the Anthropic SDK client that runs
 * a LOCAL model (via Ollama) and grounds it in YOUR OWN sources instead of the
 * model's training. Purpose-built to slot behind courseDraftGenerator.js with zero
 * changes to how that file calls the model.
 *
 * It exposes the exact same surface the generator uses:
 *     client.messages.create({ model, max_tokens, messages }) ->
 *         { content: [{ type: 'text', text }], usage: { input_tokens, output_tokens } }
 *
 * Config via env (all optional, sensible defaults):
 *   OLLAMA_URL    default http://localhost:11434   (the Mac running Ollama)
 *   OLLAMA_MODEL  default qwen3.6:27b              (confirm your exact tag)
 *   CORPUS_DIR    default '' (off)                 (folder of .md/.txt authoritative sources)
 *   CORPUS_TOPK   default 4                        (how many source chunks to inject)
 */
import fs from 'node:fs';
import path from 'node:path';

const OLLAMA_URL   = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3.6:27b';
const CORPUS_DIR   = process.env.CORPUS_DIR || '';
const CORPUS_TOPK  = parseInt(process.env.CORPUS_TOPK || '4', 10);

const STOPWORDS = new Set(('a an and are as at be by for from has have in is it its of on or that the to '
  + 'with this these those into your you their our will can may these it\'s course create include using')
  .split(/\s+/));

// ---------------------------------------------------------------------------
// Grounding: a dependency-free retriever over a folder of your own documents.
// Loads + chunks once, then scores chunks against each prompt by weighted term
// overlap (a light TF-IDF). No vector DB, no extra services — upgrade later if
// you want embeddings, but this already makes the model answer from YOUR corpus.
// ---------------------------------------------------------------------------
let _corpus = null; // [{ source, text }]
let _idf = null;    // Map<term, weight>

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9]+/g) || [])
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(md|markdown|txt)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function chunkText(text) {
  // Split on blank lines, then pack into ~1200-char chunks so a source's ideas
  // stay together without any single chunk dominating the context window.
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let buf = '';
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > 1200 && buf) { chunks.push(buf); buf = p; }
    else buf = buf ? buf + '\n\n' + p : p;
  }
  if (buf) chunks.push(buf);
  return chunks;
}

function loadCorpus() {
  if (_corpus) return;
  _corpus = [];
  if (!CORPUS_DIR || !fs.existsSync(CORPUS_DIR)) { _idf = new Map(); return; }
  for (const file of walk(CORPUS_DIR)) {
    const src = path.relative(CORPUS_DIR, file);
    for (const text of chunkText(fs.readFileSync(file, 'utf8'))) {
      _corpus.push({ source: src, text });
    }
  }
  // IDF: rarer terms across chunks weigh more.
  const df = new Map();
  for (const c of _corpus) {
    for (const t of new Set(tokenize(c.text))) df.set(t, (df.get(t) || 0) + 1);
  }
  const N = Math.max(1, _corpus.length);
  _idf = new Map([...df].map(([t, n]) => [t, Math.log(1 + N / n)]));
}

function retrieve(query, k = CORPUS_TOPK) {
  loadCorpus();
  if (!_corpus.length) return [];
  const qTerms = tokenize(query);
  const scored = _corpus.map(c => {
    const present = new Set(tokenize(c.text));
    let score = 0;
    for (const t of qTerms) if (present.has(t)) score += (_idf.get(t) || 0.1);
    return { ...c, score };
  }).filter(c => c.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

// ---------------------------------------------------------------------------
// The drop-in client.
// ---------------------------------------------------------------------------
async function ollamaChat({ messages, max_tokens, wantJson }) {
  const body = {
    model: OLLAMA_MODEL,
    messages,
    stream: false,
    options: { num_predict: max_tokens || 4000, temperature: 0.4 },
  };
  if (wantJson) body.format = 'json'; // local models keep their word better with this on

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Ollama request failed (${res.status}) at ${OLLAMA_URL}. ${detail}`);
  }
  return res.json();
}

export function createLocalClient() {
  return {
    messages: {
      /**
       * Mirrors anthropic.messages.create(). Reads the user prompt from `messages`,
       * optionally injects grounded sources, calls Ollama, and returns the response
       * in the exact shape the generator already consumes.
       */
      async create({ messages = [], max_tokens }) {
        const userMsg = [...messages].reverse().find(m => m.role === 'user');
        const prompt = typeof userMsg?.content === 'string'
          ? userMsg.content
          : (userMsg?.content?.map(b => b.text || '').join('\n') || '');

        // Detect the assessment step, which demands a raw JSON array back.
        const wantJson = /return only a json array/i.test(prompt);

        const outMessages = [];
        const sources = CORPUS_DIR ? retrieve(prompt) : [];
        if (sources.length) {
          const context = sources
            .map((s, i) => `[Source ${i + 1} — ${s.source}]\n${s.text}`)
            .join('\n\n');
          outMessages.push({
            role: 'system',
            content:
              'You are a continuing-education content author for licensed mental health '
              + 'professionals. Ground your answer in the AUTHORITATIVE SOURCES below — prefer '
              + 'their facts, terminology, citations, and standards over your own training. If '
              + 'the sources do not cover something the task requires, write from established '
              + 'clinical best practice and do not invent citations, statutes, or figures.\n\n'
              + '=== AUTHORITATIVE SOURCES ===\n' + context,
          });
        }
        outMessages.push({ role: 'user', content: prompt });

        const data = await ollamaChat({ messages: outMessages, max_tokens, wantJson });

        return {
          content: [{ type: 'text', text: data?.message?.content ?? '' }],
          usage: {
            input_tokens: data?.prompt_eval_count ?? 0,
            output_tokens: data?.eval_count ?? 0,
          },
          // surfaced for logging/debugging; harmless to callers that ignore it
          _grounding: sources.map(s => s.source),
        };
      },
    },
  };
}

export default createLocalClient;
