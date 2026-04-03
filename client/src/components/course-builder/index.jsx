// ─── CourseBuilder index.jsx ─────────────────────────────────────────────
// DROP INTO: /client/src/components/CourseBuilder/index.jsx
//
// Phase 3 — Wires AssessmentTab, ReferencesTab, ACEPCheckerTab.
// Exports CourseBuilderContext + useCourseBuilder for all child tabs.
//
// Tab map:
//  0  Course Info       — MetadataTab (inline below)
//  1  Content           — Stub pending Phase 1 ContentEditorTab extraction
//  2  Assessment        — AssessmentTab (was comingSoon)
//  3  References        — ReferencesTab (was comingSoon)
//  4  ACEP Compliance   — ACEPCheckerTab (was comingSoon)
//  5  Preview           — comingSoon
//  6  AI Assistant      — comingSoon

import { createContext, useContext, useReducer, useState } from "react";
import AssessmentTab from "./tabs/AssessmentTab.jsx";
import ReferencesTab from "./tabs/ReferencesTab.jsx";
import ACEPCheckerTab from "./tabs/ACEPCheckerTab.jsx";

// ══════════════════════════════════════════════════════════════════════════
// CONTEXT + HOOK
// ══════════════════════════════════════════════════════════════════════════

const CourseBuilderContext = createContext(null);

/** Access builder state, dispatch, and tab navigation from any child tab. */
export function useCourseBuilder() {
  const ctx = useContext(CourseBuilderContext);
  if (!ctx) throw new Error("useCourseBuilder must be inside <CourseBuilder>");
  return ctx;
}

// ══════════════════════════════════════════════════════════════════════════
// BRAND COLORS (canonical per Color_Spec_v1)
// ══════════════════════════════════════════════════════════════════════════

const C = {
  burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#284157", navyLight: "#3A5A78",   // ← correct per Color_Spec_v1 (#284157 not #34495E)
  bg: "#FAFAF8", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
  danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
};

// ══════════════════════════════════════════════════════════════════════════
// INITIAL STATE — canonical schema (sections[], options: [String], _tempId)
// ══════════════════════════════════════════════════════════════════════════

function tempId() { return `_${Math.random().toString(36).slice(2, 9)}`; }

const INITIAL_STATE = {
  _id: null,
  title: "",
  slug: "",
  description: "",
  courseCode: "",
  ceHours: 3,
  ceuHours: 3,
  ceCategory: "General",
  level: "Intermediate",
  category: "Clinical Practice",
  accessType: "subscription",
  price: 0,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  deliveryMethod: "online",
  objectives: [],
  targetAudience: ["LPCs", "LMHCs", "LCSWs", "LMFTs"],

  // ACEP provider — hardcoded defaults, never changes
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  ceuEligible: true,

  // Content
  sections: [],

  // Final exam
  assessment: {
    questions: [],
    passingScore: 80,
    passThreshold: 0.80,
    maxAttempts: 3,
  },

  // References
  references: [],

  // Settings
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true,
  },
};

// ══════════════════════════════════════════════════════════════════════════
// REDUCER
// ══════════════════════════════════════════════════════════════════════════

function reducer(state, action) {
  switch (action.type) {

    // ── Metadata ─────────────────────────────────────────────────────────
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_FIELDS":
      return { ...state, ...action.fields };

    case "ADD_OBJECTIVE":
      return { ...state, objectives: [...state.objectives, action.text || ""] };

    case "UPDATE_OBJECTIVE": {
      const objs = [...state.objectives];
      objs[action.index] = action.text;
      return { ...state, objectives: objs };
    }

    case "REMOVE_OBJECTIVE":
      return { ...state, objectives: state.objectives.filter((_, i) => i !== action.index) };

    case "ADD_AUDIENCE":
      return { ...state, targetAudience: [...state.targetAudience, action.text || ""] };

    case "REMOVE_AUDIENCE":
      return { ...state, targetAudience: state.targetAudience.filter((_, i) => i !== action.index) };

    // ── Assessment ────────────────────────────────────────────────────────
    case "ADD_ASSESSMENT_Q":
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: [
            ...state.assessment.questions,
            {
              _tempId: tempId(),
              id: tempId(),
              question: "",
              type: "multiple_choice",
              options: ["", "", "", ""],
              correctAnswer: -1,
              explanation: "",
              ...action.question,
            },
          ],
        },
      };

    case "UPDATE_ASSESSMENT_Q":
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: state.assessment.questions.map(q =>
            (q._tempId === action.id || q.id === action.id)
              ? { ...q, ...action.changes }
              : q
          ),
        },
      };

    case "REMOVE_ASSESSMENT_Q":
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: state.assessment.questions.filter(
            q => q._tempId !== action.id && q.id !== action.id
          ),
        },
      };

    case "MOVE_ASSESSMENT_Q": {
      const qs = [...state.assessment.questions];
      const [moved] = qs.splice(action.from, 1);
      qs.splice(action.to, 0, moved);
      return { ...state, assessment: { ...state.assessment, questions: qs } };
    }

    case "SET_ASSESSMENT_META":
      return {
        ...state,
        assessment: { ...state.assessment, ...action.changes },
      };

    // ── References ────────────────────────────────────────────────────────
    case "ADD_REFERENCE":
      return {
        ...state,
        references: [
          ...state.references,
          {
            _tempId: tempId(),
            id: tempId(),
            author: "",
            year: "",
            title: "",
            source: "",
            ...action.reference,
          },
        ],
      };

    case "UPDATE_REFERENCE":
      return {
        ...state,
        references: state.references.map(r =>
          (r._tempId === action.id || r.id === action.id)
            ? { ...r, ...action.changes }
            : r
        ),
      };

    case "REMOVE_REFERENCE":
      return {
        ...state,
        references: state.references.filter(
          r => r._tempId !== action.id && r.id !== action.id
        ),
      };

    case "MOVE_REFERENCE": {
      const refs = [...state.references];
      const [moved] = refs.splice(action.from, 1);
      refs.splice(action.to, 0, moved);
      return { ...state, references: refs };
    }

    // ── Bulk load (import / AI / load from DB) ────────────────────────────
    case "LOAD_COURSE":
      return { ...INITIAL_STATE, ...action.courseData };

    case "REPLACE_STATE":
      return { ...action.state };

    default:
      return state;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// SHARED STYLES
// ══════════════════════════════════════════════════════════════════════════

const S = {
  container: {
    fontFamily: "'Newsreader', Georgia, serif",
    background: C.bg, minHeight: "100vh", color: C.text,
  },
  header: {
    background: `linear-gradient(135deg, ${C.burgundy} 0%, #4A1224 100%)`,
    padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  tabBar: {
    display: "flex", background: "#fff",
    borderBottom: `2px solid ${C.border}`,
    padding: "0 20px", gap: 0, overflowX: "auto",
  },
  tab: (active, comingSoon) => ({
    padding: "13px 20px", fontSize: 14,
    fontWeight: active ? 700 : 500, cursor: comingSoon ? "default" : "pointer",
    color: active ? C.burgundy : (comingSoon ? C.textLight : C.textMuted),
    borderBottom: active ? `3px solid ${C.burgundy}` : "3px solid transparent",
    display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s",
    background: active ? C.burgundyFaded : "transparent", whiteSpace: "nowrap",
    opacity: comingSoon ? 0.5 : 1,
  }),
  main: { maxWidth: 1100, margin: "0 auto", padding: "24px 20px" },
  card: { background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 18, overflow: "hidden" },
  cardHeader: { padding: "14px 18px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardBody: { padding: 18 },
  label: { fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "10px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 90, boxSizing: "border-box", background: "#fff" },
  btn: (bg, color) => ({ background: bg, color, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }),
  btnSm: (bg, color) => ({ background: bg, color, border: `1px solid ${color}33`, borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  badge: (color) => ({ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: color + "18", color }),
};

// ══════════════════════════════════════════════════════════════════════════
// METADATA TAB (Tab 0 — Course Info)
// ══════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  "Clinical Practice", "Ethics", "Crisis Intervention", "Assessment",
  "Multicultural", "Supervision", "Diversity & Inclusion", "Wellness",
  "Group Counseling", "Career Development", "Telehealth", "Geriatric",
];

const CE_CATEGORIES = ["Ethics", "Clinical", "Cultural Competency", "General"];
const AUDIENCE_OPTIONS = [
  "LPCs", "LMHCs", "LCSWs", "LMFTs", "NCCs", "Counselors", "Social Workers",
  "Marriage & Family Therapists", "School Counselors",
];

function MetadataTab() {
  const { state, dispatch } = useCourseBuilder();
  const [newObjective, setNewObjective] = useState("");
  const [newAudience, setNewAudience] = useState("");

  const set = (field, value) => dispatch({ type: "SET_FIELD", field, value });

  const autoSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

  return (
    <div>
      {/* Basic Info */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Course Information</span>
          <span style={S.badge(C.burgundy)}>Required</span>
        </div>
        <div style={S.cardBody}>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Course Title *</label>
            <input
              style={S.input}
              placeholder="e.g., Trauma-Informed Care and PTSD Treatment"
              value={state.title}
              onChange={e => {
                set("title", e.target.value);
                if (!state._id) set("slug", autoSlug(e.target.value));
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Slug</label>
            <input
              style={{ ...S.input, fontFamily: "monospace", fontSize: 13 }}
              value={state.slug}
              onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Description</label>
            <textarea
              style={{ ...S.textarea, minHeight: 80 }}
              placeholder="Brief course summary shown in the catalog..."
              value={state.description}
              onChange={e => set("description", e.target.value)}
            />
          </div>

          <div style={{ ...S.grid3, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Course Code</label>
              <input
                style={S.input}
                placeholder="e.g., CR-301"
                value={state.courseCode}
                onChange={e => set("courseCode", e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label style={S.label}>CE Hours *</label>
              <select
                style={S.input}
                value={state.ceHours}
                onChange={e => { const h = Number(e.target.value); set("ceHours", h); set("ceuHours", h); }}
              >
                {[1, 2, 3, 4, 5, 6].map(h => (
                  <option key={h} value={h}>{h} CE Hour{h > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>CE Category</label>
              <select style={S.input} value={state.ceCategory} onChange={e => set("ceCategory", e.target.value)}>
                {CE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={S.grid3}>
            <div>
              <label style={S.label}>Level</label>
              <select style={S.input} value={state.level} onChange={e => set("level", e.target.value)}>
                {["Beginner", "Introductory", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Category</label>
              <select style={S.input} value={state.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Status</label>
              <select style={S.input} value={state.status} onChange={e => set("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Access & Pricing</span>
        </div>
        <div style={S.cardBody}>
          <div style={S.grid3}>
            <div>
              <label style={S.label}>Access Type</label>
              <select style={S.input} value={state.accessType} onChange={e => set("accessType", e.target.value)}>
                <option value="free">Free</option>
                <option value="subscription">Subscription</option>
                <option value="paid">Individual Purchase</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Price (USD)</label>
              <input
                type="number" min={0} step={0.01}
                style={S.input}
                value={state.price}
                onChange={e => set("price", Number(e.target.value))}
                disabled={state.accessType === "free" || state.accessType === "subscription"}
              />
            </div>
            <div>
              <label style={S.label}>Pricing Tier</label>
              <select style={S.input} value={state.pricingTier} onChange={e => set("pricingTier", e.target.value)}>
                <option value="free">Free</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Learning Objectives *</span>
          <span style={S.badge(state.objectives.length > 0 ? C.green : C.danger)}>
            {state.objectives.length} added
          </span>
        </div>
        <div style={S.cardBody}>
          {state.objectives.map((obj, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <span style={{ ...S.badge(C.navy), minWidth: 22, justifyContent: "center" }}>{i + 1}</span>
              <input
                style={{ ...S.input, flex: 1 }}
                value={obj}
                onChange={e => dispatch({ type: "UPDATE_OBJECTIVE", index: i, text: e.target.value })}
                placeholder="Learner will be able to..."
              />
              <button
                onClick={() => dispatch({ type: "REMOVE_OBJECTIVE", index: i })}
                style={{ ...S.btnSm(C.dangerFaded, C.danger), border: "none" }}
              >✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder="Add a learning objective..."
              value={newObjective}
              onChange={e => setNewObjective(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newObjective.trim()) {
                  dispatch({ type: "ADD_OBJECTIVE", text: newObjective.trim() });
                  setNewObjective("");
                }
              }}
            />
            <button
              style={S.btn(C.green, "#fff")}
              onClick={() => {
                if (!newObjective.trim()) return;
                dispatch({ type: "ADD_OBJECTIVE", text: newObjective.trim() });
                setNewObjective("");
              }}
            >+ Add</button>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Press Enter or click Add. Format: "Learner will be able to..."</p>
        </div>
      </div>

      {/* Target Audience */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Target Audience *</span>
          <span style={S.badge(state.targetAudience.length > 0 ? C.green : C.danger)}>
            {state.targetAudience.length} selected
          </span>
        </div>
        <div style={S.cardBody}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {AUDIENCE_OPTIONS.map(opt => {
              const selected = state.targetAudience.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (selected) {
                      dispatch({ type: "REMOVE_AUDIENCE", index: state.targetAudience.indexOf(opt) });
                    } else {
                      dispatch({ type: "ADD_AUDIENCE", text: opt });
                    }
                  }}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: selected ? 700 : 400,
                    cursor: "pointer", border: `1.5px solid ${selected ? C.green : C.border}`,
                    background: selected ? C.greenFaded : "#fff",
                    color: selected ? C.green : C.textMuted, transition: "all 0.15s",
                  }}
                >
                  {selected ? "✓ " : ""}{opt}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder="Add custom audience type..."
              value={newAudience}
              onChange={e => setNewAudience(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newAudience.trim()) {
                  dispatch({ type: "ADD_AUDIENCE", text: newAudience.trim() });
                  setNewAudience("");
                }
              }}
            />
            <button
              style={S.btn(C.green, "#fff")}
              onClick={() => {
                if (!newAudience.trim()) return;
                dispatch({ type: "ADD_AUDIENCE", text: newAudience.trim() });
                setNewAudience("");
              }}
            >+ Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// COMING SOON PLACEHOLDER
// ══════════════════════════════════════════════════════════════════════════

function ComingSoonTab({ label, note }) {
  return (
    <div style={{ ...S.card, textAlign: "center" }}>
      <div style={{ padding: "56px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
        <div style={{ fontWeight: 700, fontSize: 18, color: C.navy, marginBottom: 8 }}>
          {label} — Coming Soon
        </div>
        {note && (
          <div style={{ color: C.textMuted, fontSize: 14, maxWidth: 460, margin: "0 auto" }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════

const TABS = [
  { label: "Course Info",     icon: "ℹ",  comingSoon: false },
  { label: "Content",         icon: "📝", comingSoon: false },
  { label: "Assessment",      icon: "📋", comingSoon: false },   // ← Phase 3: was comingSoon
  { label: "References",      icon: "📚", comingSoon: false },   // ← Phase 3: was comingSoon
  { label: "ACEP Compliance", icon: "✅", comingSoon: false },   // ← Phase 3: was comingSoon
  { label: "Preview",         icon: "👁", comingSoon: true  },
  { label: "AI Assistant",    icon: "✨", comingSoon: true  },
];

export default function CourseBuilder() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [activeTab, setActiveTab] = useState(0);

  const contextValue = { state, dispatch, setActiveTab };

  const exportJSON = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${state.slug || state.title?.replace(/[^a-z0-9]/gi, "_") || "course"}.json`;
    a.click();
  };

  return (
    <CourseBuilderContext.Provider value={contextValue}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700;6..72,800&display=swap" rel="stylesheet" />
      <div style={S.container}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
              CounselorReady Course Builder
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>
              NBCC ACEP #7760 · 17 Block Types · sections[] canonical schema
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {state.title && (
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, alignSelf: "center" }}>
                {state.title}
                {state.ceHours ? ` · ${state.ceHours} CE` : ""}
              </span>
            )}
            <button
              onClick={exportJSON}
              style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 7, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              💾 Export JSON
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={S.tabBar}>
          {TABS.map((tab, i) => (
            <div
              key={i}
              style={S.tab(activeTab === i, tab.comingSoon)}
              onClick={() => !tab.comingSoon && setActiveTab(i)}
              title={tab.comingSoon ? "Coming soon" : tab.label}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.comingSoon && (
                <span style={{ fontSize: 9, background: C.gold + "30", color: C.gold, borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>
                  SOON
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Tab content */}
        <div style={S.main}>
          {activeTab === 0 && <MetadataTab />}

          {activeTab === 1 && (
            <ComingSoonTab
              label="Content Editor"
              note="Phase 1 migration in progress. Extract ContentEditorTab.jsx from CourseBuilder.jsx and wire it here. The reducer already handles sections[].contentBlocks[] via LOAD_COURSE."
            />
          )}

          {/* ── Phase 3: newly active tabs ── */}
          {activeTab === 2 && <AssessmentTab />}
          {activeTab === 3 && <ReferencesTab />}
          {activeTab === 4 && <ACEPCheckerTab />}

          {activeTab === 5 && (
            <ComingSoonTab
              label="Preview"
              note="Will embed CReady Viewer with the current course state. Phase 5."
            />
          )}

          {activeTab === 6 && (
            <ComingSoonTab
              label="AI Assistant"
              note="Real Claude API integration for outline, content expansion, and assessment generation. Phase 4."
            />
          )}
        </div>
      </div>
    </CourseBuilderContext.Provider>
  );
}
