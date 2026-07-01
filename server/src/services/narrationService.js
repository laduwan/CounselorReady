/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// services/narrationService.js
// Provider-agnostic Text-to-Speech service for CounselorReady
// ============================================================
// Supports: ElevenLabs (default), OpenAI TTS, Amazon Polly
// Swap providers by changing NARRATION_PROVIDER in .env
//
// Required env vars per provider:
//   ElevenLabs:  ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID (optional)
//   OpenAI:      OPENAI_API_KEY, OPENAI_TTS_VOICE (optional)
//   Polly:       AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
//
// Audio files are uploaded to Cloudinary and the URL is returned.
// ============================================================

import cloudinary from 'cloudinary';
import { Readable } from 'stream';

const cloudinaryV2 = cloudinary.v2;

// Configure Cloudinary (should already be configured, but safe to re-init)
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── PROVIDER CONFIG ───────────────────────────────────────────
const PROVIDER = (process.env.NARRATION_PROVIDER || 'openai').toLowerCase();

// Default voice selections per provider
const VOICE_DEFAULTS = {
  elevenlabs: {
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL', // "Sarah" - warm, professional female
    modelId: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.0,
  },
  openai: {
    voice: process.env.OPENAI_TTS_VOICE || 'nova', // warm, natural female
    model: process.env.OPENAI_TTS_MODEL || 'tts-1', // 'tts-1' standard, 'tts-1-hd' premium
    speed: 1.0,
    responseFormat: 'mp3',
  },
  polly: {
    voiceId: process.env.AWS_POLLY_VOICE || 'Joanna', // neural female voice
    engine: 'neural',
    outputFormat: 'mp3',
    sampleRate: '24000',
  },
};

// CounselorReady voice presets (map friendly names → provider voice IDs)
const CR_VOICE_PRESETS = {
  // ElevenLabs voice IDs
  elevenlabs: {
    'instructor':    { voiceId: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah (Instructor)' },
    'narrator':      { voiceId: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (Narrator)' },
    'clinical':      { voiceId: 'pNInz6obpgDQGcFmaJgB', label: 'Adam (Clinical)' },
    'warm':          { voiceId: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy (Warm)' },
  },
  // OpenAI voice options
  openai: {
    'instructor':    { voice: 'nova', label: 'Nova (Instructor)' },
    'narrator':      { voice: 'alloy', label: 'Alloy (Narrator)' },
    'clinical':      { voice: 'onyx', label: 'Onyx (Clinical)' },
    'warm':          { voice: 'shimmer', label: 'Shimmer (Warm)' },
  },
  // Amazon Polly voice options
  polly: {
    'instructor':    { voiceId: 'Joanna', label: 'Joanna (Instructor)' },
    'narrator':      { voiceId: 'Matthew', label: 'Matthew (Narrator)' },
    'clinical':      { voiceId: 'Stephen', label: 'Stephen (Clinical)' },
    'warm':          { voiceId: 'Ruth', label: 'Ruth (Warm)' },
  },
};

// ─── TEXT PREPROCESSING ────────────────────────────────────────
// Strips HTML, normalizes for natural speech output

function preprocessText(htmlText) {
  if (!htmlText) return '';

  let text = htmlText
    // Remove HTML tags
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&amp;/g, 'and')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  // Clinical abbreviation expansions for natural speech
  const abbreviations = {
    'LPC': 'Licensed Professional Counselor',
    'LMHC': 'Licensed Mental Health Counselor',
    'LCSW': 'Licensed Clinical Social Worker',
    'LMFT': 'Licensed Marriage and Family Therapist',
    'NCC': 'National Certified Counselor',
    'NBCC': 'National Board for Certified Counselors',
    'ACEP': 'Approved Continuing Education Provider',
    'CE': 'continuing education',
    'CEU': 'continuing education unit',
    'CEUs': 'continuing education units',
    'DSM': 'D.S.M.',
    'DSM-5': 'D.S.M. 5',
    'CBT': 'C.B.T.',
    'DBT': 'D.B.T.',
    'EMDR': 'E.M.D.R.',
    'APA': 'A.P.A.',
    'HIPAA': 'HIPAA',
    'PHQ-9': 'P.H.Q. 9',
    'GAD-7': 'G.A.D. 7',
    'PTSD': 'P.T.S.D.',
    'e.g.': 'for example',
    'i.e.': 'that is',
    'etc.': 'and so on',
    'vs.': 'versus',
  };

  // Only expand standalone abbreviations (not inside words)
  for (const [abbr, expansion] of Object.entries(abbreviations)) {
    const escaped = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(new RegExp(`\\b${escaped}\\b`, 'g'), expansion);
  }

  return text;
}

// ─── BLOCK NARRATION EXTRACTION ────────────────────────────────
// Extracts narratable text from a content block based on its type.
// Non-narratable blocks (quizzes, matching, images) return empty string.

function extractNarrableText(block) {
  if (!block || !block.type) return '';

  switch (block.type) {
    case 'text':
      return preprocessText(block.content || '');

    case 'sectionDivider':
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.subtitle) parts.push(block.subtitle);
      return parts.join('. ');

    case 'imageText':
      const imgParts = [];
      if (block.title) imgParts.push(block.title);
      if (block.content) imgParts.push(preprocessText(block.content));
      return imgParts.join('. ');

    case 'accordion':
      if (!block.accordionItems?.length) return '';
      return block.accordionItems
        .map(item => `${item.title}. ${preprocessText(item.content || '')}`)
        .join('\n\n');

    case 'reflection':
      return block.question ? `Reflection prompt: ${block.question}` : '';

    case 'resources':
      if (!block.resources?.length) return '';
      return 'Recommended resources: ' + block.resources.map(r => r.title).join(', ') + '.';

    // Assessment blocks — narrate the question only, not answer options
    case 'multipleChoice':
    case 'multiSelect':
      return block.question ? `Knowledge check: ${preprocessText(block.question)}` : '';

    case 'matching':
      return block.matchingInstructions
        ? `Matching activity: ${block.matchingInstructions}`
        : '';

    case 'flashcardDeck':
      return block.instructions
        ? `Flashcard activity: ${block.instructions}`
        : '';

    case 'scenarioTree':
      const scenParts = [];
      if (block.scenarioTitle) scenParts.push(block.scenarioTitle);
      if (block.instructions) scenParts.push(block.instructions);
      if (block.nodes?.start?.text) scenParts.push(preprocessText(block.nodes.start.text));
      return scenParts.join('. ');

    // Skip these — no meaningful narration
    case 'image':
    case 'videoEmbed':
    case 'hotspot':
    case 'cardSort':
    case 'sequencing':
    case 'timeline':
      return '';

    default:
      return '';
  }
}

// ─── TTS PROVIDERS ─────────────────────────────────────────────

/**
 * ElevenLabs TTS — Premium voice quality
 * Uses direct HTTP API (no SDK dependency needed)
 */
async function generateElevenLabs(text, options = {}) {
  const config = { ...VOICE_DEFAULTS.elevenlabs, ...options };
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set in environment');

  const voiceId = config.voiceId;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: config.modelId,
      voice_settings: {
        stability: config.stability,
        similarity_boost: config.similarityBoost,
        style: config.style,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errBody}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * OpenAI TTS — Best value at scale
 */
async function generateOpenAI(text, options = {}) {
  const config = { ...VOICE_DEFAULTS.openai, ...options };
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) throw new Error('OPENAI_API_KEY not set in environment');

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      input: text,
      voice: config.voice,
      speed: config.speed,
      response_format: config.responseFormat,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI TTS error (${response.status}): ${errBody}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Amazon Polly — AWS-native, SSML support
 * Requires: @aws-sdk/client-polly (install if using this provider)
 */
async function generatePolly(text, options = {}) {
  const config = { ...VOICE_DEFAULTS.polly, ...options };

  // Dynamic import to avoid requiring AWS SDK unless needed
  const { PollyClient, SynthesizeSpeechCommand } = await import('@aws-sdk/client-polly');

  const client = new PollyClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new SynthesizeSpeechCommand({
    Text: text,
    VoiceId: config.voiceId,
    Engine: config.engine,
    OutputFormat: config.outputFormat,
    SampleRate: config.sampleRate,
  });

  const result = await client.send(command);

  // Convert stream to buffer
  const chunks = [];
  for await (const chunk of result.AudioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Provider dispatch map
const PROVIDERS = {
  elevenlabs: generateElevenLabs,
  openai: generateOpenAI,
  polly: generatePolly,
};

// ─── CLOUDINARY UPLOAD ─────────────────────────────────────────

async function uploadToCloudinary(audioBuffer, { courseId, moduleIndex, blockIndex, blockType }) {
  const folder = `counselorready/narration/${courseId}`;
  const publicId = `${folder}/m${moduleIndex}_b${blockIndex}_${blockType}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary uses 'video' type for audio files
        public_id: publicId,
        format: 'mp3',
        overwrite: true,
        folder: undefined, // folder is in public_id
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          duration: result.duration, // seconds
          bytes: result.bytes,
        });
      }
    );

    const readable = new Readable();
    readable.push(audioBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

// ─── PUBLIC API ────────────────────────────────────────────────

/**
 * Generate narration for a single text string.
 * Returns audio buffer.
 */
export async function generateSpeech(text, options = {}) {
  const provider = options.provider || PROVIDER;
  const generate = PROVIDERS[provider];

  if (!generate) {
    throw new Error(`Unknown narration provider: ${provider}. Supported: ${Object.keys(PROVIDERS).join(', ')}`);
  }

  // ElevenLabs has a ~5000 char limit per request. Chunk if needed.
  const MAX_CHUNK = provider === 'elevenlabs' ? 4500 : 4096;

  if (text.length <= MAX_CHUNK) {
    return generate(text, options);
  }

  // Split long text at sentence boundaries
  const chunks = splitIntoChunks(text, MAX_CHUNK);
  const audioBuffers = [];

  for (const chunk of chunks) {
    const buffer = await generate(chunk, options);
    audioBuffers.push(buffer);
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return Buffer.concat(audioBuffers);
}

/**
 * Generate narration for a single content block.
 * Uploads to Cloudinary, returns { url, duration, charCount }.
 */
export async function narrateBlock(block, { courseId, moduleIndex, blockIndex, voicePreset, provider } = {}) {
  const text = extractNarrableText(block);

  if (!text || text.trim().length < 10) {
    return { skipped: true, reason: 'No narratable content', blockType: block.type };
  }

  const activeProvider = provider || PROVIDER;
  const voiceOptions = {};

  // Apply voice preset if specified
  if (voicePreset && CR_VOICE_PRESETS[activeProvider]?.[voicePreset]) {
    Object.assign(voiceOptions, CR_VOICE_PRESETS[activeProvider][voicePreset]);
  }

  voiceOptions.provider = activeProvider;

  const audioBuffer = await generateSpeech(text, voiceOptions);

  const uploadResult = await uploadToCloudinary(audioBuffer, {
    courseId: courseId || 'draft',
    moduleIndex: moduleIndex ?? 0,
    blockIndex: blockIndex ?? 0,
    blockType: block.type,
  });

  return {
    skipped: false,
    url: uploadResult.url,
    publicId: uploadResult.publicId,
    duration: uploadResult.duration,
    bytes: uploadResult.bytes,
    charCount: text.length,
    blockType: block.type,
    provider: activeProvider,
  };
}

/**
 * Generate narration for an entire module (array of blocks).
 * Returns array of results per block.
 */
export async function narrateModule(blocks, { courseId, moduleIndex, voicePreset, provider } = {}) {
  const results = [];

  for (let i = 0; i < blocks.length; i++) {
    try {
      const result = await narrateBlock(blocks[i], {
        courseId,
        moduleIndex,
        blockIndex: i,
        voicePreset,
        provider,
      });
      results.push({ blockIndex: i, ...result });
    } catch (error) {
      results.push({
        blockIndex: i,
        skipped: false,
        error: error.message,
        blockType: blocks[i]?.type,
      });
    }
  }

  return results;
}

/**
 * Generate narration for an entire course (all modules).
 * Returns { modules: [...], summary: { totalDuration, totalChars, narrated, skipped } }
 */
export async function narrateCourse(course, { voicePreset, provider } = {}) {
  const courseId = course._id || course.courseCode || 'draft';
  const modules = course.sections || course.modules || [];
  const moduleResults = [];
  let totalDuration = 0;
  let totalChars = 0;
  let totalNarrated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (let m = 0; m < modules.length; m++) {
    const blocks = modules[m].contentBlocks || modules[m].blocks || [];
    const results = await narrateModule(blocks, {
      courseId,
      moduleIndex: m,
      voicePreset,
      provider,
    });

    for (const r of results) {
      if (r.skipped) totalSkipped++;
      else if (r.error) totalErrors++;
      else {
        totalNarrated++;
        totalDuration += r.duration || 0;
        totalChars += r.charCount || 0;
      }
    }

    moduleResults.push({
      moduleIndex: m,
      moduleTitle: modules[m].title || `Module ${m + 1}`,
      blocks: results,
    });
  }

  return {
    courseId,
    provider: provider || PROVIDER,
    voicePreset: voicePreset || 'instructor',
    modules: moduleResults,
    summary: {
      totalModules: modules.length,
      totalDuration: Math.round(totalDuration),
      totalDurationFormatted: formatDuration(totalDuration),
      totalCharacters: totalChars,
      estimatedCost: estimateCost(totalChars, provider || PROVIDER),
      narrated: totalNarrated,
      skipped: totalSkipped,
      errors: totalErrors,
    },
  };
}

/**
 * Estimate narration cost before generating.
 * Pass in the full course object to get character counts.
 */
export function estimateNarrationCost(course, provider) {
  const activeProvider = provider || PROVIDER;
  const modules = course.sections || course.modules || [];
  let totalChars = 0;
  let blockBreakdown = { narrated: 0, skipped: 0 };

  for (const mod of modules) {
    const blocks = mod.contentBlocks || mod.blocks || [];
    for (const block of blocks) {
      const text = extractNarrableText(block);
      if (text && text.trim().length >= 10) {
        totalChars += text.length;
        blockBreakdown.narrated++;
      } else {
        blockBreakdown.skipped++;
      }
    }
  }

  return {
    totalCharacters: totalChars,
    estimatedCost: estimateCost(totalChars, activeProvider),
    estimatedDuration: formatDuration(totalChars / 15), // ~15 chars/second average speech
    blocks: blockBreakdown,
    provider: activeProvider,
  };
}

/**
 * Get available voice presets for current provider.
 */
export function getVoicePresets(provider) {
  const activeProvider = provider || PROVIDER;
  return CR_VOICE_PRESETS[activeProvider] || {};
}

/**
 * Get current provider info.
 */
export function getProviderInfo() {
  return {
    provider: PROVIDER,
    configured: isProviderConfigured(PROVIDER),
    voicePresets: Object.entries(CR_VOICE_PRESETS[PROVIDER] || {}).map(([key, val]) => ({
      id: key,
      label: val.label,
    })),
  };
}

// ─── UTILITIES ─────────────────────────────────────────────────

function splitIntoChunks(text, maxLength) {
  const chunks = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    // Find last sentence boundary within limit
    let splitAt = remaining.lastIndexOf('. ', maxLength);
    if (splitAt === -1 || splitAt < maxLength * 0.5) {
      splitAt = remaining.lastIndexOf(' ', maxLength);
    }
    if (splitAt === -1) splitAt = maxLength;

    chunks.push(remaining.substring(0, splitAt + 1).trim());
    remaining = remaining.substring(splitAt + 1).trim();
  }

  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}

function estimateCost(charCount, provider) {
  // Cost per 1M characters (approximate, 2026 pricing)
  const rates = {
    elevenlabs: 300,  // ~$0.30/1K chars on Creator plan overage
    openai: 15,       // $15/1M chars standard
    polly: 16,        // $16/1M chars neural
  };

  const rate = rates[provider] || rates.openai;
  const cost = (charCount / 1_000_000) * rate;
  return `$${cost.toFixed(2)}`;
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function isProviderConfigured(provider) {
  switch (provider) {
    case 'elevenlabs': return !!process.env.ELEVENLABS_API_KEY;
    case 'openai': return !!process.env.OPENAI_API_KEY;
    case 'polly': return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    default: return false;
  }
}

export default {
  generateSpeech,
  narrateBlock,
  narrateModule,
  narrateCourse,
  estimateNarrationCost,
  getVoicePresets,
  getProviderInfo,
  extractNarrableText,
  preprocessText,
};
