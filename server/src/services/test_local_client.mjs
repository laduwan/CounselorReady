import assert from 'node:assert';

// Point the client at our temp corpus BEFORE importing it
process.env.CORPUS_DIR = '/tmp/corpus';
process.env.OLLAMA_MODEL = 'qwen3.6:27b';

// --- Mock Ollama: intercept fetch, capture the request, return a canned reply ---
let captured = null;
globalThis.fetch = async (url, opts) => {
  captured = { url, body: JSON.parse(opts.body) };
  return {
    ok: true,
    json: async () => ({
      message: { role: 'assistant', content: '<h3>Informed Consent</h3><p>Grounded reply.</p>' },
      prompt_eval_count: 812,
      eval_count: 1440,
      done: true,
    }),
  };
};

const { createLocalClient } = await import('./localAIClient.js');
const client = createLocalClient();

// 1) Response shape must match what courseDraftGenerator.js reads
const resp = await client.messages.create({
  model: 'claude-sonnet-4-20250514',   // ignored by local client, proves call-compat
  max_tokens: 8000,
  messages: [{ role: 'user', content: 'Write CE content about Georgia telehealth informed consent for LPCs.' }],
});
assert.strictEqual(typeof resp.content[0].text, 'string', 'content[0].text must be a string');
assert.ok(resp.content[0].text.includes('Grounded reply'), 'text passthrough');
assert.strictEqual(resp.usage.input_tokens, 812, 'input_tokens mapped from prompt_eval_count');
assert.strictEqual(resp.usage.output_tokens, 1440, 'output_tokens mapped from eval_count');
console.log('PASS 1: response shape matches Anthropic { content[0].text, usage.{input,output}_tokens }');

// 2) Grounding: the RIGHT source chunk (telehealth) should be retrieved & injected
const sys = captured.body.messages.find(m => m.role === 'system');
assert.ok(sys, 'a grounded system message was injected');
assert.ok(sys.content.includes('telehealth-ga.md'), 'retrieved the telehealth source for a telehealth prompt');
assert.deepStrictEqual(resp._grounding.includes('telehealth-ga.md'), true, 'grounding sources surfaced');
console.log('PASS 2: grounding retrieved the correct source from YOUR corpus ->', resp._grounding);

// 3) num_predict must carry max_tokens through, model must be the local one
assert.strictEqual(captured.body.options.num_predict, 8000, 'max_tokens -> num_predict');
assert.strictEqual(captured.body.model, 'qwen3.6:27b', 'uses local model, not the Anthropic model string');
console.log('PASS 3: max_tokens forwarded, local model selected');

// 4) JSON step detection: assessment prompt must flip Ollama into json mode
await client.messages.create({
  max_tokens: 8000,
  messages: [{ role: 'user', content: 'Create 15 questions. Return ONLY a JSON array of 15 questions.' }],
});
assert.strictEqual(captured.body.format, 'json', 'assessment step sets format:json for reliable parsing');
console.log('PASS 4: assessment step auto-enables JSON mode');

console.log('\nALL TESTS PASSED');
