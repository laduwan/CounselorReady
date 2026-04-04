// ─── AIAssistantTab.jsx ───────────────────────────────────────────────────
// DROP INTO: /client/src/components/course-builder/tabs/AIAssistantTab.jsx
//
// Two-step flow:
//   Step 1 — Generate outline (fast, cheap)
//   Step 2 — Review/edit outline, then generate full course (slow, expensive)
//
// On completion, dispatches LOAD_COURSE and switches to Course Info tab (0).

import { useState, useRef } from "react";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C, ACEP_RULES } from "../constants.js";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

function getToken() { return localStorage.getItem("token"); }

const S = {
  card: { background: "#fff", borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 16, overflow: "hidden" },
  cardHeader: { padding: "14px 18px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.stone },
  cardBody: { padding: 20 },
  label: { fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "10px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 90, boxSizing: "border-box", background: "#fff" },
  btn: (bg, color, disabled) => ({ background: disabled ? C.borderLight : bg, color: disabled ? C.textLight : color, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.15s" }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 },
  badge: (color) => ({ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: color + "18", color }),
  progressBar: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 6, transition: "width 0.4s ease" }),
};

const CATEGORIES = [
  "Clinical Practice", "Ethics", "Crisis Intervention", "Assessment",
  "Multicultural", "Supervision", "Telehealth", "Geriatric", "Wellness",
];

const CE_HOURS_OPTIONS = [1, 2, 3, 4, 5, 6];

const AUDIENCE_OPTIONS = ["LPCs", "LMHCs", "LCSWs", "LMFTs", "NCCs", "School Counselors"];

// ─── Step indicator ────────────────────────────────────────────────────────

function StepIndicator({ step }) {
  const steps = ["Parameters", "Review Outline", "Generating Course", "Done"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
      {steps.map((label, i) => {
        const active = step === i;
        const done = step > i;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: done ? C.hunterGreen : active ? C.burgundy : C.borderLight,
                color: done || active ? "#fff" : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? C.burgundy : C.textMuted, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? C.hunterGreen : C.borderLight, margin: "0 6px", marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress display ─────────────────────────────────────────────────────

function GeneratingProgress({ progress, currentTask }) {
  return (
    <div style={{ ...S.card }}>
      <div style={{ padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
        <div style={{ fontWeight: 700, fontSize: 18, color: C.navy, marginBottom: 6 }}>
          Generating Course Content
        </div>
        <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 24, minHeight: 20 }}>
          {currentTask || "Working..."}
        </div>
        <div style={{ maxWidth: 480, margin: "0 auto 12px", background: C.borderLight, borderRadius: 8, height: 12, overflow: "hidden" }}>
          <div style={S.progressBar(progress, C.burgundy)} />
        </div>
        <div style={{ fontSize: 13, color: C.textMuted }}>{Math.round(progress)}%</div>
        <div style={{ marginTop: 20, fontSize: 12, color: C.textLight, maxWidth: 380, margin: "20px auto 0" }}>
          Claude is writing section content, knowledge checks, the final exam, and references.
          This takes 1–3 minutes depending on CE hours.
        </div>
      </div>
    </div>
  );
}

// ─── Outline editor ───────────────────────────────────────────────────────

function OutlineEditor({ outline, onOutlineChange, onGenerate, onBack, generating }) {
  const updateSection = (i, changes) => {
    const sections = [...outline.sections];
    sections[i] = { ...sections[i], ...changes };
    onOutlineChange({ ...outline, sections });
  };

  const addSection = () => {
    const n = outline.sections.length;
    const sections = [...outline.sections];
    // Insert before conclusion
    sections.splice(n - 1, 0, {
      title: `Section ${n}: New Section`,
      order: n,
      topics: ["Topic 1", "Topic 2"],
      estimatedWords: 3000,
      kcCount: 2,
    });
    // Re-number
    sections.forEach((s, i) => { s.order = i + 1; });
    onOutlineChange({ ...outline, sections });
  };

  const removeSection = (i) => {
    if (outline.sections.length <= 2) return; // keep at least 1 content + conclusion
    const sections = outline.sections.filter((_, j) => j !== i);
    sections.forEach((s, idx) => { s.order = idx + 1; });
    onOutlineChange({ ...outline, sections });
  };

  const totalEstWords = outline.sections.reduce((s, sec) => s + (sec.estimatedWords || 0), 0);
  const targetWords = (outline.ceHours || 3) * ACEP_RULES.WORDS_PER_CE_HOUR;
  const wordPct = Math.min(100, Math.round((totalEstWords / targetWords) * 100));

  return (
    <div>
      {/* Course meta */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Course Overview</span>
          <span style={S.badge(wordPct >= 90 ? C.hunterGreen : C.honey)}>
            Est. {totalEstWords.toLocaleString()} / {targetWords.toLocaleString()} words ({wordPct}%)
          </span>
        </div>
        <div style={S.cardBody}>
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Title</label>
            <input
              style={S.input}
              value={outline.title || ""}
              onChange={e => onOutlineChange({ ...outline, title: e.target.value })}
            />
          </div>
          <div>
            <label style={S.label}>Description</label>
            <textarea
              style={{ ...S.textarea, minHeight: 70 }}
              value={outline.description || ""}
              onChange={e => onOutlineChange({ ...outline, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Learning Objectives</span>
          <span style={S.badge(C.navy)}>{(outline.objectives || []).length}</span>
        </div>
        <div style={S.cardBody}>
          {(outline.objectives || []).map((obj, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <span style={{ ...S.badge(C.navy), minWidth: 22, justifyContent: "center", fontSize: 11 }}>{i + 1}</span>
              <input
                style={{ ...S.input, flex: 1 }}
                value={obj}
                onChange={e => {
                  const objs = [...outline.objectives];
                  objs[i] = e.target.value;
                  onOutlineChange({ ...outline, objectives: objs });
                }}
              />
              <button
                onClick={() => onOutlineChange({ ...outline, objectives: outline.objectives.filter((_, j) => j !== i) })}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 16, padding: "4px" }}
              >✕</button>
            </div>
          ))}
          <button
            style={{ ...S.btn(C.borderLight, C.navy, false), fontSize: 13, padding: "6px 12px", marginTop: 4 }}
            onClick={() => onOutlineChange({ ...outline, objectives: [...(outline.objectives || []), "Participants will be able to ..."] })}
          >+ Add Objective</button>
        </div>
      </div>

      {/* Sections */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>
            Sections ({outline.sections?.length || 0})
          </span>
          <button
            style={{ ...S.btn(C.hunterGreen, "#fff", false), fontSize: 12, padding: "5px 12px" }}
            onClick={addSection}
          >+ Add Section</button>
        </div>
        <div style={{ padding: "12px 16px" }}>
          {(outline.sections || []).map((sec, i) => {
            const isConclusion = i === outline.sections.length - 1;
            return (
              <div key={i} style={{
                border: `1px solid ${isConclusion ? C.honey + "66" : C.border}`,
                borderRadius: 9, padding: 14, marginBottom: 10,
                background: isConclusion ? C.honey + "08" : "#fff",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ ...S.badge(isConclusion ? C.honey : C.navy), fontSize: 11, minWidth: 20 }}>
                    {isConclusion ? "C" : i + 1}
                  </span>
                  <input
                    style={{ ...S.input, flex: 1, fontWeight: 600 }}
                    value={sec.title}
                    onChange={e => updateSection(i, { title: e.target.value })}
                  />
                  {!isConclusion && outline.sections.length > 2 && (
                    <button
                      onClick={() => removeSection(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 16 }}
                    >✕</button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ ...S.label, fontSize: 11 }}>Topics (comma-separated)</label>
                    <input
                      style={{ ...S.input, fontSize: 13 }}
                      value={(sec.topics || []).join(", ")}
                      onChange={e => updateSection(i, { topics: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    />
                  </div>
                  <div>
                    <label style={{ ...S.label, fontSize: 11 }}>Est. Words</label>
                    <input
                      type="number" min={200}
                      style={S.input}
                      value={sec.estimatedWords || 3000}
                      onChange={e => updateSection(i, { estimatedWords: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label style={{ ...S.label, fontSize: 11 }}>KCs</label>
                    <input
                      type="number" min={0} max={5}
                      style={S.input}
                      value={isConclusion ? 0 : (sec.kcCount || 2)}
                      disabled={isConclusion}
                      onChange={e => updateSection(i, { kcCount: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <button style={S.btn(C.borderLight, C.navy, false)} onClick={onBack}>
          ← Back
        </button>
        <button
          style={S.btn(C.burgundy, "#fff", generating)}
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Generating..." : "✨ Generate Full Course"}
        </button>
      </div>
    </div>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────

export default function AIAssistantTab() {
  const { dispatch, setActiveTab } = useCourseBuilder();

  const [step, setStep] = useState(0); // 0=params, 1=outline, 2=generating, 3=done
  const [error, setError] = useState(null);

  // Params
  const [topic, setTopic]               = useState("");
  const [title, setTitle]               = useState("");
  const [ceHours, setCeHours]           = useState(3);
  const [category, setCategory]         = useState("Clinical Practice");
  const [level, setLevel]               = useState("Intermediate");
  const [audience, setAudience]         = useState(["LPCs", "LMHCs", "LCSWs", "LMFTs"]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [generatingOutline, setGeneratingOutline] = useState(false);

  // Outline step
  const [outline, setOutline]       = useState(null);
  const [generatingCourse, setGeneratingCourse] = useState(false);

  // Progress
  const [progress, setProgress]     = useState(0);
  const [currentTask, setCurrentTask] = useState("");

  const toggleAudience = (opt) => {
    setAudience(prev =>
      prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]
    );
  };

  // ── Step 1: Generate outline ─────────────────────────────────────────────

  const handleGenerateOutline = async () => {
    if (!topic.trim()) return;
    setError(null);
    setGeneratingOutline(true);
    try {
      const res = await fetch(`${API_BASE}/course-builder/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          title: title.trim() || topic.trim(),
          topic: topic.trim(),
          ceHours,
          category,
          level,
          targetAudience: audience,
          specialInstructions: specialNotes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setOutline(data);
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingOutline(false);
    }
  };

  // ── Step 2: Generate full course ─────────────────────────────────────────

  const handleGenerateCourse = async () => {
    setError(null);
    setGeneratingCourse(true);
    setStep(2);
    setProgress(0);

    // Fake progress ticker (real progress is section-by-section server calls)
    const totalSections = outline.sections?.length || 4;
    const msPerSection = 18000 / totalSections; // ~18s total estimate
    let fake = 0;
    const ticker = setInterval(() => {
      fake = Math.min(fake + (100 / totalSections / 8), 92);
      setProgress(fake);
      const secIdx = Math.floor((fake / 100) * totalSections);
      const sec = outline.sections?.[Math.min(secIdx, totalSections - 1)];
      setCurrentTask(sec ? `Writing: ${sec.title}` : "Finishing up...");
    }, msPerSection / 8);

    try {
      const res = await fetch(`${API_BASE}/course-builder/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          title:          outline.title,
          ceHours:        outline.ceHours || ceHours,
          category:       outline.category || category,
          level:          outline.level || level,
          targetAudience: outline.targetAudience || audience,
          outline,
          specialInstructions: specialNotes.trim() || undefined,
        }),
      });

      clearInterval(ticker);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const courseData = await res.json();
      setProgress(100);
      setCurrentTask("Done!");

      // Load into builder state
      dispatch({ type: "LOAD_COURSE", courseData });

      setStep(3);

    } catch (err) {
      clearInterval(ticker);
      setError(err.message);
      setStep(1); // back to outline on error
      setGeneratingCourse(false);
    }
  };

  // ── Done ─────────────────────────────────────────────────────────────────

  const handleGoToEditor = () => {
    setActiveTab(0); // Course Info
  };

  const handleReset = () => {
    setStep(0);
    setOutline(null);
    setProgress(0);
    setCurrentTask("");
    setError(null);
    setGeneratingCourse(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <StepIndicator step={step} />

      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F2", border: `1px solid #FCA5A5`, borderRadius: 8, color: "#DC2626", fontSize: 13, marginBottom: 16 }}>
          ⚠ {error}
          <button onClick={() => setError(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#DC2626", fontSize: 16 }}>✕</button>
        </div>
      )}

      {/* ── Step 0: Parameters ── */}
      {step === 0 && (
        <div>
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>AI Course Generator</span>
              </div>
              <span style={S.badge(C.hunterGreen)}>NBCC ACEP #7760</span>
            </div>
            <div style={S.cardBody}>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Course Topic *</label>
                <textarea
                  style={{ ...S.textarea, minHeight: 70 }}
                  placeholder="e.g., Trauma-informed care for adult survivors of childhood abuse, including assessment frameworks, evidence-based interventions, and ethical considerations"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Course Title (optional — AI will generate if blank)</label>
                <input
                  style={S.input}
                  placeholder="Leave blank to auto-generate from topic"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div style={{ ...S.grid3, marginBottom: 14 }}>
                <div>
                  <label style={S.label}>CE Hours</label>
                  <select style={S.input} value={ceHours} onChange={e => setCeHours(Number(e.target.value))}>
                    {CE_HOURS_OPTIONS.map(h => <option key={h} value={h}>{h} CE Hour{h > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Category</label>
                  <select style={S.input} value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Level</label>
                  <select style={S.input} value={level} onChange={e => setLevel(e.target.value)}>
                    {["Introductory", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Target Audience</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {AUDIENCE_OPTIONS.map(opt => {
                    const sel = audience.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleAudience(opt)}
                        style={{
                          padding: "5px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                          border: `1.5px solid ${sel ? C.hunterGreen : C.border}`,
                          background: sel ? C.hunterGreen + "18" : "#fff",
                          color: sel ? C.hunterGreen : C.textMuted, fontWeight: sel ? 700 : 400,
                        }}
                      >
                        {sel ? "✓ " : ""}{opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Special Instructions (optional)</label>
                <textarea
                  style={{ ...S.textarea, minHeight: 60 }}
                  placeholder="e.g., Include DBT framework, focus on BIPOC clients, include a movie-based case study..."
                  value={specialNotes}
                  onChange={e => setSpecialNotes(e.target.value)}
                />
              </div>

              {/* ACEP requirements preview */}
              <div style={{ background: C.honey + "12", border: `1px solid ${C.honey}44`, borderRadius: 9, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>ACEP Requirements for {ceHours} CE Hours</div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[
                    { label: "Min Words", value: (ceHours * 6000).toLocaleString() },
                    { label: "Sections", value: `${ceHours * 2 + 1}` },
                    { label: "Knowledge Checks", value: `${ceHours * 2 * 2}–${ceHours * 2 * 5}` },
                    { label: "Final Exam", value: "15+ questions" },
                    { label: "Pass Rate", value: "80%" },
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{r.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                style={S.btn(C.burgundy, "#fff", !topic.trim() || generatingOutline)}
                onClick={handleGenerateOutline}
                disabled={!topic.trim() || generatingOutline}
              >
                {generatingOutline
                  ? <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> Generating Outline...</>
                  : "Generate Outline →"}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Review outline ── */}
      {step === 1 && outline && (
        <OutlineEditor
          outline={outline}
          onOutlineChange={setOutline}
          onGenerate={handleGenerateCourse}
          onBack={() => setStep(0)}
          generating={generatingCourse}
        />
      )}

      {/* ── Step 2: Generating ── */}
      {step === 2 && (
        <GeneratingProgress progress={progress} currentTask={currentTask} />
      )}

      {/* ── Step 3: Done ── */}
      {step === 3 && (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ padding: "48px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: C.hunterGreen, marginBottom: 8 }}>
              Course Generated!
            </div>
            <div style={{ color: C.textMuted, fontSize: 14, maxWidth: 440, margin: "0 auto 28px" }}>
              Your course has been loaded into the builder. Review and edit the content,
              then run the ACEP Compliance check before publishing.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={S.btn(C.burgundy, "#fff", false)} onClick={handleGoToEditor}>
                Open Course Info →
              </button>
              <button style={S.btn(C.borderLight, C.navy, false)} onClick={handleReset}>
                Generate Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
