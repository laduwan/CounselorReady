// components/NarrationPanel.jsx
// ==============================
// Drop-in narration panel for CourseBuilder.
// Provides: voice preview, per-block narration, full module/course narration,
// cost estimation, audio playback, and provider management.
//
// Usage in CourseBuilder:
//   import NarrationPanel from './NarrationPanel';
//   <NarrationPanel course={courseData} onNarrationComplete={handleUpdate} />
//
// API base URL should match your backend (uses same auth token from localStorage)
// ==============================

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, MicOff, Play, Pause, Square, Volume2, VolumeX,
  Loader2, Check, X, AlertTriangle, DollarSign,
  ChevronDown, ChevronRight, RefreshCw, Download, Trash2, Headphones
} from 'lucide-react';

// ─── Brand Colors ──────────────────────────────────────────────
const C = {
  burgundy: '#6B1D34', burgundyLight: '#8B2D4A', burgundyFaded: 'rgba(107,29,52,0.08)',
  green: '#4A7C59', greenLight: '#5A9469', greenFaded: 'rgba(74,124,89,0.08)',
  gold: '#D4A855', goldFaded: 'rgba(212,168,85,0.12)',
  navy: '#34495E',
  bg: '#FAFAF8', card: '#FFFFFF',
  border: '#E8E4DF', borderLight: '#F0EDE8',
  text: '#2C2C2C', textMuted: '#6B7280', textLight: '#9CA3AF',
  danger: '#DC2626', dangerFaded: 'rgba(220,38,38,0.08)',
};

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.counselorready.com/api';

// ─── API Helper ────────────────────────────────────────────────
async function narrationAPI(endpoint, body = null) {
  const token = localStorage.getItem('token');
  const opts = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  if (body) {
    opts.method = 'POST';
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}/narration${endpoint}`, opts);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data;
}

// ─── Mini Audio Player ─────────────────────────────────────────
function AudioPlayer({ src, label, compact = false, onRemove }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onLoad = () => setDuration(audio.duration);
    const onEnd = () => { setPlaying(false); setProgress(0); };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoad);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoad);
      audio.removeEventListener('ended', onEnd);
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setProgress(0);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: compact ? 6 : 8,
      padding: compact ? '4px 8px' : '8px 12px',
      background: C.burgundyFaded, borderRadius: 8,
      border: `1px solid ${C.borderLight}`,
      fontSize: compact ? 11 : 13,
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause */}
      <button onClick={toggle} style={{
        background: C.burgundy, color: '#fff', border: 'none', borderRadius: '50%',
        width: compact ? 24 : 30, height: compact ? 24 : 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        flexShrink: 0,
      }}>
        {playing
          ? <Pause size={compact ? 10 : 13} />
          : <Play size={compact ? 10 : 13} style={{ marginLeft: 1 }} />}
      </button>

      {/* Progress bar */}
      <div onClick={seek} style={{
        flex: 1, height: compact ? 4 : 6, background: C.border,
        borderRadius: 3, cursor: 'pointer', position: 'relative', minWidth: 60,
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pct}%`, background: C.burgundy, borderRadius: 3,
          transition: 'width 0.1s',
        }} />
      </div>

      {/* Time */}
      <span style={{ color: C.textMuted, fontSize: compact ? 10 : 11, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {fmt(progress)}/{fmt(duration)}
      </span>

      {/* Label */}
      {label && !compact && (
        <span style={{ color: C.textMuted, fontSize: 11, whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
      )}

      {/* Remove button */}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
          color: C.textLight, display: 'flex',
        }}>
          <Trash2 size={compact ? 12 : 14} />
        </button>
      )}
    </div>
  );
}

// ─── Voice Preview Card ────────────────────────────────────────
function VoicePreviewCard({ preset, isActive, onSelect, onPreview, isLoading, previewAudio }) {
  return (
    <div onClick={() => onSelect(preset.id)} style={{
      padding: '12px 14px', borderRadius: 10,
      border: `2px solid ${isActive ? C.burgundy : C.border}`,
      background: isActive ? C.burgundyFaded : C.card,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{preset.label}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{preset.id}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isActive && <Check size={16} style={{ color: C.burgundy }} />}
          <button onClick={(e) => { e.stopPropagation(); onPreview(preset.id); }} style={{
            background: C.green, color: '#fff', border: 'none', borderRadius: 6,
            padding: '4px 10px', fontSize: 11, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500,
          }}>
            {isLoading ? <Loader2 size={12} className="spin" /> : <Headphones size={12} />}
            Preview
          </button>
        </div>
      </div>
      {previewAudio && isActive && (
        <div style={{ marginTop: 8 }}>
          <AudioPlayer src={`data:audio/mp3;base64,${previewAudio}`} compact />
        </div>
      )}
    </div>
  );
}

// ─── Narration Status Badge ────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    narrated: { bg: C.greenFaded, color: C.green, icon: <Volume2 size={11} />, text: 'Narrated' },
    skipped: { bg: C.goldFaded, color: C.gold, icon: <VolumeX size={11} />, text: 'Skipped' },
    error: { bg: C.dangerFaded, color: C.danger, icon: <AlertTriangle size={11} />, text: 'Error' },
    pending: { bg: '#f3f4f6', color: C.textMuted, icon: <Mic size={11} />, text: 'Pending' },
    generating: { bg: C.burgundyFaded, color: C.burgundy, icon: <Loader2 size={11} className="spin" />, text: 'Generating...' },
  };
  const c = config[status] || config.pending;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: c.bg, color: c.color,
    }}>
      {c.icon} {c.text}
    </span>
  );
}

// ─── BLOCK TYPE LABELS ─────────────────────────────────────────
const BLOCK_LABELS = {
  text: '¶ Text', sectionDivider: '§ Section', imageText: '🖼 Image+Text',
  accordion: '≡ Accordion', reflection: '💭 Reflection', resources: '📎 Resources',
  multipleChoice: '◉ MC Quiz', multiSelect: '☑ Multi-Select', matching: '↔ Matching',
  flashcardDeck: '🃏 Flashcards', scenarioTree: '🔀 Scenario',
  image: '📷 Image', videoEmbed: '🎬 Video', hotspot: '🎯 Hotspot',
  cardSort: '🗂 Card Sort', sequencing: '📋 Sequence', timeline: '📅 Timeline',
};

const NARRATABLE_TYPES = [
  'text', 'sectionDivider', 'imageText', 'accordion', 'reflection',
  'resources', 'multipleChoice', 'multiSelect', 'matching', 'flashcardDeck', 'scenarioTree'
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function NarrationPanel({ course, onNarrationComplete }) {
  // ─── State ───────────────────────────────────────────────────
  const [activeVoice, setActiveVoice] = useState('instructor');
  const [voicePresets, setVoicePresets] = useState([]);
  const [providerInfo, setProviderInfo] = useState(null);
  const [previewAudios, setPreviewAudios] = useState({});
  const [previewLoading, setPreviewLoading] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [estimating, setEstimating] = useState(false);

  // Narration progress
  const [narrating, setNarrating] = useState(false);
  const [narrationScope, setNarrationScope] = useState(null); // 'block', 'module', 'course'
  const [narrationResults, setNarrationResults] = useState(null);
  const [blockAudios, setBlockAudios] = useState({}); // { 'm0_b3': { url, duration } }

  // UI
  const [expandedModules, setExpandedModules] = useState({});
  const [activeTab, setActiveTab] = useState('voices'); // 'voices', 'narrate', 'results'
  const [error, setError] = useState(null);

  // ─── Load provider info on mount ─────────────────────────────
  useEffect(() => {
    loadProvider();
  }, []);

  // ─── Load existing narration from course data ────────────────
  useEffect(() => {
    if (!course) return;
    const existing = {};
    const modules = course.sections || course.modules || [];
    modules.forEach((mod, mi) => {
      const blocks = mod.contentBlocks || mod.blocks || [];
      blocks.forEach((block, bi) => {
        if (block.narrationUrl) {
          existing[`m${mi}_b${bi}`] = {
            url: block.narrationUrl,
            duration: block.narrationDuration,
          };
        }
      });
    });
    setBlockAudios(existing);
  }, [course]);

  async function loadProvider() {
    try {
      const info = await narrationAPI('/provider');
      setProviderInfo(info);
      setVoicePresets(info.voicePresets || []);
    } catch (err) {
      console.warn('Could not load narration provider:', err.message);
      // Fallback presets
      setVoicePresets([
        { id: 'instructor', label: 'Instructor' },
        { id: 'narrator', label: 'Narrator' },
        { id: 'clinical', label: 'Clinical' },
        { id: 'warm', label: 'Warm' },
      ]);
    }
  }

  // ─── Voice Preview ───────────────────────────────────────────
  async function previewVoice(presetId) {
    setPreviewLoading(presetId);
    setError(null);
    try {
      const result = await narrationAPI('/preview', { voicePreset: presetId });
      setPreviewAudios(prev => ({ ...prev, [presetId]: result.audio }));
    } catch (err) {
      setError(`Preview failed: ${err.message}`);
    } finally {
      setPreviewLoading(null);
    }
  }

  // ─── Cost Estimation ─────────────────────────────────────────
  async function getEstimate() {
    setEstimating(true);
    setError(null);
    try {
      const result = await narrationAPI('/estimate', { course });
      setEstimate(result);
    } catch (err) {
      setError(`Estimate failed: ${err.message}`);
    } finally {
      setEstimating(false);
    }
  }

  // ─── Narrate Single Block ────────────────────────────────────
  async function narrateSingleBlock(block, moduleIndex, blockIndex) {
    const key = `m${moduleIndex}_b${blockIndex}`;
    setBlockAudios(prev => ({ ...prev, [key]: { generating: true } }));
    setError(null);

    try {
      const result = await narrationAPI('/block', {
        block,
        courseId: course?._id || course?.courseCode,
        moduleIndex,
        blockIndex,
        voicePreset: activeVoice,
      });

      if (result.skipped) {
        setBlockAudios(prev => ({ ...prev, [key]: { skipped: true, reason: result.reason } }));
      } else {
        setBlockAudios(prev => ({
          ...prev,
          [key]: { url: result.url, duration: result.duration, charCount: result.charCount },
        }));
      }
    } catch (err) {
      setBlockAudios(prev => ({ ...prev, [key]: { error: err.message } }));
      setError(`Block narration failed: ${err.message}`);
    }
  }

  // ─── Narrate Full Module ─────────────────────────────────────
  async function narrateFullModule(moduleIndex) {
    const modules = course.sections || course.modules || [];
    const blocks = modules[moduleIndex]?.contentBlocks || modules[moduleIndex]?.blocks || [];
    setNarrating(true);
    setNarrationScope('module');
    setError(null);

    // Mark all blocks as generating
    const updates = {};
    blocks.forEach((_, bi) => {
      updates[`m${moduleIndex}_b${bi}`] = { generating: true };
    });
    setBlockAudios(prev => ({ ...prev, ...updates }));

    try {
      const result = await narrationAPI('/module', {
        blocks,
        courseId: course?._id || course?.courseCode,
        moduleIndex,
        voicePreset: activeVoice,
      });

      const audioUpdates = {};
      result.results.forEach(r => {
        const key = `m${moduleIndex}_b${r.blockIndex}`;
        if (r.skipped) {
          audioUpdates[key] = { skipped: true, reason: r.reason };
        } else if (r.error) {
          audioUpdates[key] = { error: r.error };
        } else {
          audioUpdates[key] = { url: r.url, duration: r.duration, charCount: r.charCount };
        }
      });

      setBlockAudios(prev => ({ ...prev, ...audioUpdates }));
    } catch (err) {
      setError(`Module narration failed: ${err.message}`);
    } finally {
      setNarrating(false);
      setNarrationScope(null);
    }
  }

  // ─── Narrate Full Course ─────────────────────────────────────
  async function narrateFullCourse() {
    setNarrating(true);
    setNarrationScope('course');
    setError(null);

    try {
      const result = await narrationAPI('/course', {
        course,
        voicePreset: activeVoice,
      });

      setNarrationResults(result);

      // Update block audios
      const audioUpdates = {};
      result.modules.forEach(mod => {
        mod.blocks.forEach(r => {
          const key = `m${mod.moduleIndex}_b${r.blockIndex}`;
          if (r.skipped) {
            audioUpdates[key] = { skipped: true };
          } else if (r.error) {
            audioUpdates[key] = { error: r.error };
          } else {
            audioUpdates[key] = { url: r.url, duration: r.duration, charCount: r.charCount };
          }
        });
      });

      setBlockAudios(prev => ({ ...prev, ...audioUpdates }));
      setActiveTab('results');

      // Callback to parent with narration URLs
      if (onNarrationComplete) {
        onNarrationComplete(audioUpdates);
      }
    } catch (err) {
      setError(`Course narration failed: ${err.message}`);
    } finally {
      setNarrating(false);
      setNarrationScope(null);
    }
  }

  // ─── Remove narration from block ─────────────────────────────
  function removeBlockNarration(moduleIndex, blockIndex) {
    const key = `m${moduleIndex}_b${blockIndex}`;
    setBlockAudios(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }

  // ─── Toggle module expansion ─────────────────────────────────
  function toggleModule(idx) {
    setExpandedModules(prev => ({ ...prev, [idx]: !prev[idx] }));
  }

  // ─── Get block status ────────────────────────────────────────
  function getBlockStatus(moduleIndex, blockIndex) {
    const key = `m${moduleIndex}_b${blockIndex}`;
    const audio = blockAudios[key];
    if (!audio) return 'pending';
    if (audio.generating) return 'generating';
    if (audio.error) return 'error';
    if (audio.skipped) return 'skipped';
    if (audio.url) return 'narrated';
    return 'pending';
  }

  // ─── Computed stats ──────────────────────────────────────────
  const modules = course?.sections || course?.modules || [];
  const totalBlocks = modules.reduce((sum, m) => sum + (m.contentBlocks || m.blocks || []).length, 0);
  const narratedCount = Object.values(blockAudios).filter(a => a?.url).length;
  const totalDuration = Object.values(blockAudios).reduce((sum, a) => sum + (a?.duration || 0), 0);

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{ background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>

      {/* ─── Header ─── */}
      <div style={{
        padding: '16px 20px',
        background: `linear-gradient(135deg, ${C.burgundy}, ${C.navy})`,
        color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mic size={20} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Course Narration</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>
              {providerInfo?.provider ? `Provider: ${providerInfo.provider}` : 'AI-powered text-to-speech'}
              {narratedCount > 0 && ` • ${narratedCount} blocks narrated`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {totalDuration > 0 && (
            <span style={{
              background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20,
              fontSize: 11, fontWeight: 600,
            }}>
              🎧 {Math.floor(totalDuration / 60)}m {Math.round(totalDuration % 60)}s total
            </span>
          )}
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, background: C.card }}>
        {[
          { key: 'voices', label: '🎙️ Voice Select', },
          { key: 'narrate', label: '📝 Narrate', },
          { key: 'results', label: '📊 Results', count: narratedCount || null },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: '10px 12px', border: 'none', cursor: 'pointer',
            background: activeTab === tab.key ? C.burgundyFaded : 'transparent',
            borderBottom: activeTab === tab.key ? `2px solid ${C.burgundy}` : '2px solid transparent',
            color: activeTab === tab.key ? C.burgundy : C.textMuted,
            fontWeight: activeTab === tab.key ? 600 : 400,
            fontSize: 12, transition: 'all 0.15s',
          }}>
            {tab.label}
            {tab.count && (
              <span style={{
                marginLeft: 6, background: C.green, color: '#fff', borderRadius: 10,
                padding: '1px 6px', fontSize: 10, fontWeight: 700,
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Error Banner ─── */}
      {error && (
        <div style={{
          margin: '12px 16px 0', padding: '10px 14px', background: C.dangerFaded,
          borderRadius: 8, color: C.danger, fontSize: 12,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={14} />
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.danger,
          }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ─── Tab Content ─── */}
      <div style={{ padding: 16 }}>

        {/* ═══ VOICES TAB ═══ */}
        {activeTab === 'voices' && (
          <div>
            <p style={{ fontSize: 13, color: C.textMuted, margin: '0 0 12px' }}>
              Choose a voice for your course narration. Preview each to hear the tone before generating.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {voicePresets.map(preset => (
                <VoicePreviewCard
                  key={preset.id}
                  preset={preset}
                  isActive={activeVoice === preset.id}
                  onSelect={setActiveVoice}
                  onPreview={previewVoice}
                  isLoading={previewLoading === preset.id}
                  previewAudio={activeVoice === preset.id ? previewAudios[preset.id] : null}
                />
              ))}
            </div>

            <div style={{ marginTop: 16, padding: '10px 14px', background: C.goldFaded, borderRadius: 8, fontSize: 12, color: C.navy }}>
              <strong>💡 Tip:</strong> "Instructor" works best for clinical content. "Warm" is great for ethics and self-care courses. You can change voices and re-narrate individual blocks later.
            </div>
          </div>
        )}

        {/* ═══ NARRATE TAB ═══ */}
        {activeTab === 'narrate' && (
          <div>
            {/* Cost Estimate */}
            <div style={{
              padding: 14, background: C.card, borderRadius: 10,
              border: `1px solid ${C.border}`, marginBottom: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  <DollarSign size={14} style={{ display: 'inline', verticalAlign: -2 }} /> Cost Estimate
                </div>
                <button onClick={getEstimate} disabled={estimating} style={{
                  background: C.navy, color: '#fff', border: 'none', borderRadius: 6,
                  padding: '5px 12px', fontSize: 11, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                  opacity: estimating ? 0.6 : 1,
                }}>
                  {estimating ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />}
                  {estimate ? 'Refresh' : 'Calculate'}
                </button>
              </div>

              {estimate && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Characters', value: estimate.totalCharacters?.toLocaleString() },
                    { label: 'Est. Duration', value: estimate.estimatedDuration },
                    { label: 'Est. Cost', value: estimate.estimatedCost },
                    { label: 'Blocks', value: `${estimate.blocks?.narrated} / ${(estimate.blocks?.narrated || 0) + (estimate.blocks?.skipped || 0)}` },
                  ].map(stat => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.burgundy }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Full Course Narration Button */}
            <button onClick={narrateFullCourse} disabled={narrating} style={{
              width: '100%', padding: '14px 20px',
              background: narrating
                ? C.textMuted
                : `linear-gradient(135deg, ${C.burgundy}, ${C.burgundyLight})`,
              color: '#fff', border: 'none', borderRadius: 10, cursor: narrating ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {narrating && narrationScope === 'course'
                ? <><Loader2 size={16} className="spin" /> Narrating Entire Course...</>
                : <><Mic size={16} /> Narrate Entire Course</>}
            </button>

            {/* Module-by-Module Breakdown */}
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Or narrate by module:
            </div>

            {modules.map((mod, mi) => {
              const blocks = mod.contentBlocks || mod.blocks || [];
              const isExpanded = expandedModules[mi];
              const moduleNarrated = blocks.filter((_, bi) => blockAudios[`m${mi}_b${bi}`]?.url).length;
              const moduleNarrable = blocks.filter(b => NARRATABLE_TYPES.includes(b.type)).length;

              return (
                <div key={mi} style={{
                  marginBottom: 8, border: `1px solid ${C.border}`, borderRadius: 8,
                  background: C.card, overflow: 'hidden',
                }}>
                  {/* Module Header */}
                  <div onClick={() => toggleModule(mi)} style={{
                    padding: '10px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: isExpanded ? C.burgundyFaded : 'transparent',
                  }}>
                    {isExpanded ? <ChevronDown size={14} color={C.burgundy} /> : <ChevronRight size={14} color={C.textMuted} />}
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>
                      {mod.title || `Module ${mi + 1}`}
                    </span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>
                      {moduleNarrated}/{moduleNarrable} narrated
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); narrateFullModule(mi); }} disabled={narrating} style={{
                      background: C.green, color: '#fff', border: 'none', borderRadius: 6,
                      padding: '4px 10px', fontSize: 11, cursor: narrating ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500,
                      opacity: narrating ? 0.5 : 1,
                    }}>
                      <Mic size={10} /> Narrate
                    </button>
                  </div>

                  {/* Block List */}
                  {isExpanded && (
                    <div style={{ padding: '4px 14px 12px' }}>
                      {blocks.map((block, bi) => {
                        const key = `m${mi}_b${bi}`;
                        const audio = blockAudios[key];
                        const status = getBlockStatus(mi, bi);
                        const isNarrable = NARRATABLE_TYPES.includes(block.type);

                        return (
                          <div key={bi} style={{
                            padding: '8px 0', borderBottom: bi < blocks.length - 1 ? `1px solid ${C.borderLight}` : 'none',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, color: C.textMuted, width: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {BLOCK_LABELS[block.type] || block.type}
                              </span>
                              <StatusBadge status={isNarrable ? status : 'skipped'} />
                              <div style={{ flex: 1 }} />
                              {isNarrable && status !== 'generating' && (
                                <button onClick={() => narrateSingleBlock(block, mi, bi)} disabled={narrating} style={{
                                  background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                                  padding: '3px 8px', fontSize: 10, cursor: narrating ? 'not-allowed' : 'pointer',
                                  color: C.textMuted, display: 'flex', alignItems: 'center', gap: 3,
                                }}>
                                  {audio?.url ? <RefreshCw size={10} /> : <Mic size={10} />}
                                  {audio?.url ? 'Redo' : 'Narrate'}
                                </button>
                              )}
                            </div>

                            {/* Audio Player */}
                            {audio?.url && (
                              <div style={{ marginTop: 6 }}>
                                <AudioPlayer
                                  src={audio.url}
                                  compact
                                  label={`${Math.round(audio.duration || 0)}s`}
                                  onRemove={() => removeBlockNarration(mi, bi)}
                                />
                              </div>
                            )}

                            {audio?.error && (
                              <div style={{ marginTop: 4, fontSize: 11, color: C.danger }}>
                                ❌ {audio.error}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ RESULTS TAB ═══ */}
        {activeTab === 'results' && (
          <div>
            {narrationResults ? (
              <>
                {/* Summary */}
                <div style={{
                  padding: 16, background: C.card, borderRadius: 10,
                  border: `1px solid ${C.border}`, marginBottom: 14,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                    Narration Summary
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Total Duration', value: narrationResults.summary.totalDurationFormatted, color: C.burgundy },
                      { label: 'Blocks Narrated', value: narrationResults.summary.narrated, color: C.green },
                      { label: 'Est. Cost', value: narrationResults.summary.estimatedCost, color: C.gold },
                    ].map(stat => (
                      <div key={stat.label} style={{ textAlign: 'center', padding: 10, background: C.bg, borderRadius: 8 }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
                    <div style={{ textAlign: 'center', fontSize: 11, color: C.textMuted }}>
                      <strong>{narrationResults.summary.totalCharacters?.toLocaleString()}</strong> characters
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 11, color: C.textMuted }}>
                      <strong>{narrationResults.summary.skipped}</strong> blocks skipped
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 11, color: narrationResults.summary.errors > 0 ? C.danger : C.textMuted }}>
                      <strong>{narrationResults.summary.errors}</strong> errors
                    </div>
                  </div>
                </div>

                {/* Per-module results */}
                {narrationResults.modules.map(mod => (
                  <div key={mod.moduleIndex} style={{
                    marginBottom: 8, padding: 12, background: C.card, borderRadius: 8,
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      {mod.moduleTitle}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {mod.blocks.map(b => (
                        <StatusBadge
                          key={b.blockIndex}
                          status={b.skipped ? 'skipped' : b.error ? 'error' : 'narrated'}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>
                <Headphones size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div style={{ fontSize: 13 }}>No narration results yet.</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Go to the <strong>Narrate</strong> tab to generate audio for your course.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Spinner animation ─── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
