// NarrationPanel.jsx — Admin narration controls for CourseBuilder
// Generates TTS audio per block/module/course via /api/narration endpoints
// =====================================================================

import { useState, useRef, useEffect } from "react";

const C = {
  burgundy: "#6B1D34", green: "#4A7C59", gold: "#D4A855",
  navy: "#34495E", text: "#2C2C2C", textMuted: "#6B7280",
  border: "#E8E4DF", card: "#FFFFFF", bg: "#FAFAF8",
  danger: "#DC2626",
};

const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

function NarrationPanel({ courseId, modules, onNarrationComplete }) {
  const [provider, setProvider] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("instructor");
  const [estimate, setEstimate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, module: "" });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const previewRef = useRef(null);
  const abortRef = useRef(false);

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // Load provider info and voices on mount
  useEffect(() => {
    fetchProvider();
  }, []);

  async function fetchProvider() {
    try {
      const [provRes, voiceRes] = await Promise.all([
        fetch(`${API_BASE}/narration/provider`, { headers }),
        fetch(`${API_BASE}/narration/voices`, { headers }),
      ]);
      if (provRes.ok) {
        const p = await provRes.json();
        setProvider(p);
      }
      if (voiceRes.ok) {
        const v = await voiceRes.json();
        setVoices(v.presets || []);
      }
    } catch (err) {
      setError("Could not connect to narration service. Check that NARRATION_PROVIDER and API keys are set.");
    }
  }

  async function fetchEstimate() {
    if (!modules?.length) return;
    try {
      const res = await fetch(`${API_BASE}/narration/estimate`, {
        method: "POST", headers,
        body: JSON.stringify({ course: { sections: modules } }),
      });
      if (res.ok) {
        const est = await res.json();
        setEstimate(est);
      }
    } catch (err) {
      console.error("Estimate error:", err);
    }
  }

  // Preview: generate a short sample with selected voice
  async function previewVoice() {
    setPreviewUrl(null);
    try {
      const res = await fetch(`${API_BASE}/narration/preview`, {
        method: "POST", headers,
        body: JSON.stringify({
          text: "Welcome to CounselorReady. This continuing education course will help you develop practical skills for your clinical practice.",
          voicePreset: selectedVoice,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewUrl(data.url);
        if (previewRef.current) {
          previewRef.current.src = data.url;
          previewRef.current.play();
        }
      }
    } catch (err) {
      setError("Preview failed: " + err.message);
    }
  }

  // Generate narration for entire course, module by module
  async function generateAll() {
    if (!modules?.length || !courseId) return;
    setGenerating(true);
    setError(null);
    setResults([]);
    abortRef.current = false;

    const totalBlocks = modules.reduce((sum, m) => sum + ((m.blocks || m.contentBlocks || []).length), 0);
    let completed = 0;
    const allResults = [];

    for (let mi = 0; mi < modules.length; mi++) {
      if (abortRef.current) break;
      const mod = modules[mi];
      setProgress({ current: completed, total: totalBlocks, module: mod.title || `Module ${mi + 1}` });

      const blocks = mod.blocks || mod.contentBlocks || [];
      for (let bi = 0; bi < blocks.length; bi++) {
        if (abortRef.current) break;
        try {
          const res = await fetch(`${API_BASE}/narration/block`, {
            method: "POST", headers,
            body: JSON.stringify({
              block: blocks[bi],
              courseId,
              moduleIndex: mi,
              blockIndex: bi,
              voicePreset: selectedVoice,
            }),
          });
          const data = await res.json();
          allResults.push({ module: mi, block: bi, ...data });
          if (data.url) {
            blocks[bi].narrationUrl = data.url;
            blocks[bi].narrationDuration = data.duration;
          }
        } catch (err) {
          allResults.push({ module: mi, block: bi, error: err.message });
        }
        completed++;
        setProgress({ current: completed, total: totalBlocks, module: mod.title || `Module ${mi + 1}` });
      }
    }

    setResults(allResults);
    setGenerating(false);

    const narrated = allResults.filter(r => !r.skipped && !r.error && r.url).length;
    const skipped = allResults.filter(r => r.skipped).length;
    const errors = allResults.filter(r => r.error).length;

    if (onNarrationComplete) {
      onNarrationComplete({ narrated, skipped, errors, modules });
    }
  }

  // Generate for single module
  async function generateModule(moduleIndex) {
    if (!courseId) return;
    setGenerating(true);
    setError(null);

    const mod = modules[moduleIndex];
    const blocks = mod.blocks || mod.contentBlocks || [];
    const moduleResults = [];

    for (let bi = 0; bi < blocks.length; bi++) {
      setProgress({ current: bi, total: blocks.length, module: mod.title || `Module ${moduleIndex + 1}` });
      try {
        const res = await fetch(`${API_BASE}/narration/block`, {
          method: "POST", headers,
          body: JSON.stringify({
            block: blocks[bi],
            courseId,
            moduleIndex,
            blockIndex: bi,
            voicePreset: selectedVoice,
          }),
        });
        const data = await res.json();
        moduleResults.push(data);
        if (data.url) {
          blocks[bi].narrationUrl = data.url;
          blocks[bi].narrationDuration = data.duration;
        }
      } catch (err) {
        moduleResults.push({ error: err.message });
      }
    }

    setResults(moduleResults);
    setGenerating(false);
  }

  function stopGeneration() {
    abortRef.current = true;
  }

  // Count narrated blocks
  const narratedCount = modules?.reduce((sum, m) =>
    sum + ((m.blocks || m.contentBlocks || []).filter(b => b.narrationUrl).length), 0) || 0;
  const totalBlocks = modules?.reduce((sum, m) => sum + ((m.blocks || m.contentBlocks || []).length), 0) || 0;

  return (
    <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🎙️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.burgundy }}>Course Narration</h3>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
              Generate audio narration for course content
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: narratedCount > 0 ? "#4A7C5918" : "#6B128018",
            color: narratedCount > 0 ? C.green : C.textMuted,
          }}>
            {narratedCount}/{totalBlocks} blocks narrated
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {error && (
          <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, color: C.danger, fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Provider & Voice Selection */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, display: "block" }}>
              Provider
            </label>
            <div style={{ padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
              {provider?.provider ? (
                <span>
                  <strong>{provider.provider.charAt(0).toUpperCase() + provider.provider.slice(1)}</strong>
                  {provider.configured ? " ✓" : " ✗ (not configured)"}
                </span>
              ) : "Loading..."}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, display: "block" }}>
              Voice Preset
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, cursor: "pointer" }}
              >
                {voices.length > 0 ? voices.map(v => (
                  <option key={v.key} value={v.key}>{v.label}</option>
                )) : (
                  <>
                    <option value="instructor">Instructor (Default)</option>
                    <option value="narrator">Narrator</option>
                    <option value="clinical">Clinical</option>
                    <option value="warm">Warm</option>
                  </>
                )}
              </select>
              <button
                onClick={previewVoice}
                style={{ padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.navy }}
              >
                ▶ Preview
              </button>
            </div>
            {previewUrl && <audio ref={previewRef} src={previewUrl} style={{ display: "none" }} />}
          </div>
        </div>

        {/* Cost Estimate */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={fetchEstimate}
            style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.textMuted }}
          >
            📊 Estimate Cost
          </button>
          {estimate && (
            <div style={{ marginTop: 10, padding: "10px 14px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 13 }}>
              <strong>{estimate.totalCharacters?.toLocaleString()}</strong> characters across <strong>{estimate.narratableBlocks}</strong> blocks
              {estimate.estimatedCost && <span> — est. <strong>${estimate.estimatedCost?.toFixed(2)}</strong></span>}
              {estimate.estimatedDuration && <span> — ~<strong>{estimate.estimatedDuration}</strong> audio</span>}
            </div>
          )}
        </div>

        {/* Module-by-module status */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Modules</h4>
          {modules?.map((mod, mi) => {
            const blocks = mod.blocks || mod.contentBlocks || [];
            const narrated = blocks.filter(b => b.narrationUrl).length;
            const pct = blocks.length > 0 ? Math.round(narrated / blocks.length * 100) : 0;
            return (
              <div key={mi} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: mi % 2 === 0 ? C.bg : "#fff", borderRadius: 8, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: pct === 100 ? "#4A7C5918" : "#6B128018", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: pct === 100 ? C.green : C.textMuted, flexShrink: 0 }}>
                  {mi + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {mod.title || `Module ${mi + 1}`}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <div style={{ flex: 1, height: 4, background: "#E8E4DF", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? C.green : C.gold, borderRadius: 4, transition: "width 0.3s" }} />
                    </div>
                    <span style={{ fontSize: 11, color: C.textMuted, minWidth: 60, textAlign: "right" }}>
                      {narrated}/{blocks.length} blocks
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => generateModule(mi)}
                  disabled={generating}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "none", cursor: generating ? "not-allowed" : "pointer",
                    fontSize: 12, fontWeight: 600, flexShrink: 0,
                    background: pct === 100 ? "#E8E4DF" : C.burgundy,
                    color: pct === 100 ? C.textMuted : "#fff",
                    opacity: generating ? 0.5 : 1,
                  }}
                >
                  {pct === 100 ? "↺ Redo" : "🎙️ Generate"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Progress bar during generation */}
        {generating && (
          <div style={{ padding: "14px 18px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>🎙️ Generating: {progress.module}</span>
              <span style={{ color: C.textMuted }}>{progress.current}/{progress.total} blocks</span>
            </div>
            <div style={{ height: 6, background: "#D1FAE5", borderRadius: 6, overflow: "hidden" }}>
              <div style={{
                width: `${progress.total > 0 ? (progress.current / progress.total * 100) : 0}%`,
                height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.gold})`,
                borderRadius: 6, transition: "width 0.3s"
              }} />
            </div>
            <button
              onClick={stopGeneration}
              style={{ marginTop: 8, padding: "6px 14px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, color: C.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              ⏹ Stop
            </button>
          </div>
        )}

        {/* Results summary */}
        {results.length > 0 && !generating && (
          <div style={{ padding: "14px 18px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 600, color: C.navy }}>Results</h4>
            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
              <span style={{ color: C.green }}>✓ {results.filter(r => r.url).length} narrated</span>
              <span style={{ color: C.textMuted }}>⊘ {results.filter(r => r.skipped).length} skipped</span>
              {results.filter(r => r.error).length > 0 && (
                <span style={{ color: C.danger }}>✗ {results.filter(r => r.error).length} errors</span>
              )}
            </div>
          </div>
        )}

        {/* Generate All Button */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={generateAll}
            disabled={generating || !provider?.configured}
            style={{
              padding: "12px 24px", borderRadius: 10, border: "none", cursor: generating ? "not-allowed" : "pointer",
              fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${C.burgundy}, #4A1224)`, color: "#fff",
              boxShadow: "0 2px 8px rgba(107,29,52,0.2)",
              opacity: (generating || !provider?.configured) ? 0.5 : 1,
            }}
          >
            🎙️ Generate All Narration
          </button>
        </div>
      </div>
    </div>
  );
}

export default NarrationPanel;
