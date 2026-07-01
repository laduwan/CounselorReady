// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — index.jsx
// Main export. Wraps provider, renders tab bar and active tab.
// App.jsx imports from this file — NOT from the old CourseBuilder.jsx.
//
// Usage in App.jsx:
//   import CourseBuilder from "./components/course-builder/index.jsx";
//
// Route: /admin/course-builder?id=<mongoId>  (edit existing)
//        /admin/course-builder               (new course)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo } from "react";
import { CourseBuilderProvider, useCourseBuilder } from "./CourseBuilderContext.jsx";
import MetadataTab      from "./tabs/MetadataTab.jsx";
import ContentEditorTab from "./tabs/ContentEditorTab.jsx";
import AssessmentTab    from "./tabs/AssessmentTab.jsx";
import ReferencesTab    from "./tabs/ReferencesTab.jsx";
import ACEPCheckerTab   from "./tabs/ACEPCheckerTab.jsx";
import PreviewTab       from "./tabs/PreviewTab.jsx";
import AIAssistantTab  from "./tabs/AIAssistantTab.jsx";
import SupplementsTab from "./tabs/SupplementsTab.jsx";
import { C, ACEP_RULES } from "./constants.js";
import { countCourseWords, countKCsInSection } from "./utils.js";
import { publishCourse } from "./courseBuilderApi.js";
import { validateCourse } from "./courseBuilderValidator.js";

// Re-export so tabs that import from "../index.jsx" still work
export { useCourseBuilder } from "./CourseBuilderContext.jsx";

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { label: "Course Info",     icon: "ℹ️" },
  { label: "Content Editor",  icon: "📝" },
  { label: "Assessment",      icon: "✅" },
  { label: "References",      icon: "📚" },
  { label: "ACEP Compliance", icon: "⚖️" },
  { label: "Preview",         icon: "👁" },
  { label: "AI Assistant",    icon: "🤖" },
  { label: "Supplements",    icon: "📎" },
];

// ─── Save status badge ────────────────────────────────────────────────────────

function SaveBadge() {
  const { saveStatus, saveError, lastSaved, isDirty, doSave } = useCourseBuilder();

  const label = saveStatus === "saving"  ? "Saving..."
              : saveStatus === "saved"   ? `Saved ${lastSaved ? formatTime(lastSaved) : ""}`
              : saveStatus === "error"   ? `Error: ${saveError}`
              : isDirty                  ? "Unsaved changes"
              : lastSaved                ? `Saved ${formatTime(lastSaved)}`
              : "New course";

  const color = saveStatus === "error"   ? C.danger
              : saveStatus === "saved"   ? C.hunterGreen
              : isDirty                  ? C.honey
              : C.textMuted;

  return (
    <span style={{ fontSize: 12, color, fontWeight: 500 }}>{label}</span>
  );
}

function formatTime(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5)   return "just now";
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600)return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Word count bar ───────────────────────────────────────────────────────────

function WordCountBar() {
  const { state } = useCourseBuilder();
  const total   = countCourseWords(state.sections);
  const target  = (state.ceHours || 0) * ACEP_RULES.WORDS_PER_CE_HOUR;
  const pct     = target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0;
  const color   = pct >= 100 ? C.hunterGreen : pct >= 80 ? C.honey : C.danger;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" }}>
        {total.toLocaleString()} / {target.toLocaleString()} words ({pct}%)
      </span>
      <div style={{ width: 80, height: 6, background: C.borderLight, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────

function CourseBuilderShell() {
  const {
    state, activeTab, setActiveTab,
    isDirty, doSave, saveStatus,
    isLoading, loadError,
    canUndo, canRedo, undo, redo,
  } = useCourseBuilder();

  // Ensure we start on Section 1 for new courses
  useEffect(() => {
    if (!state._id && state.sections.length === 0) {
      // New course: start on metadata tab
      setActiveTab(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validation for publish gate
  const validation = useMemo(() => validateCourse(state), [state]);
  const errorCount = validation.errors.length;

  async function handlePublish() {
    if (errorCount > 0) {
      // Jump to ACEP Compliance tab to show errors
      setActiveTab(4);
      return;
    }
    if (!confirm("Publish this course? It will become visible to enrolled learners.")) return;
    try {
      await doSave(false); // save first
      const result = await publishCourse(state);
      if (result?.course?._id) {
        alert("✓ Course published successfully.");
        window.location.href = "/admin-courses.html";
      }
    } catch (err) {
      alert(`Publish failed: ${err.message}`);
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300, color: C.textMuted }}>
        Loading course...
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ padding: 40, color: C.danger, textAlign: "center" }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Failed to load course</p>
        <p style={{ fontSize: 14 }}>{loadError}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.stone, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{
        background: C.burgundy, padding: "0 24px",
        display: "flex", alignItems: "center", gap: 16,
        height: 56, flexShrink: 0,
      }}>
        {/* Logo / back */}
        <a href="/admin-courses.html" style={{ color: "#ffffff80", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          ← Courses
        </a>
        <div style={{ width: 1, height: 20, background: "#ffffff30" }} />

        {/* Course title */}
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, flex: 1 }}>
          {state.title || "Untitled Course"}
          {state.status === "published" && (
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, background: C.hunterGreen, color: "#fff", padding: "2px 8px", borderRadius: 10 }}>LIVE</span>
          )}
          {state.status === "draft" && (
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, background: "#ffffff30", color: "#fff", padding: "2px 8px", borderRadius: 10 }}>DRAFT</span>
          )}
        </span>

        {/* Word count */}
        <WordCountBar />

        {/* Undo / Redo */}
        <button title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}
          style={{ background: "none", border: "none", color: canUndo ? "#fff" : "#ffffff30", cursor: canUndo ? "pointer" : "default", fontSize: 18, padding: "4px 6px" }}>↩</button>
        <button title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}
          style={{ background: "none", border: "none", color: canRedo ? "#fff" : "#ffffff30", cursor: canRedo ? "pointer" : "default", fontSize: 18, padding: "4px 6px" }}>↪</button>

        {/* Save status */}
        <SaveBadge />

        {/* Save button */}
        <button
          onClick={() => doSave(true)}
          disabled={!isDirty || saveStatus === "saving"}
          style={{
            padding: "7px 18px", borderRadius: 7, border: "none",
            background: isDirty ? "#ffffff20" : "transparent",
            color: isDirty ? "#fff" : "#ffffff50",
            fontWeight: 600, fontSize: 13, cursor: isDirty ? "pointer" : "default",
          }}
        >
          {saveStatus === "saving" ? "Saving..." : "Save"}
        </button>

        {/* Publish button — shows error count when course isn't ready */}
        <button
          onClick={handlePublish}
          style={{
            padding: "7px 18px", borderRadius: 7, border: "none",
            background: errorCount > 0 ? C.danger : C.hunterGreen, color: "#fff",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}
        >
          {errorCount > 0 ? `${errorCount} Error${errorCount !== 1 ? "s" : ""}` : "Publish"}
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: "flex", gap: 0, background: "#fff",
        borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        paddingLeft: 24, overflowX: "auto",
      }}>
        {TABS.map((tab, i) => {
          const active = activeTab === i;
          return (
            <button
              key={tab.label}
              onClick={() => !tab.comingSoon && setActiveTab(i)}
              title={tab.comingSoon ? "Coming in Phase 2–3" : undefined}
              style={{
                padding: "13px 18px", border: "none", background: "transparent",
                borderBottom: active ? `3px solid ${C.burgundy}` : "3px solid transparent",
                color: active ? C.burgundy : tab.comingSoon ? C.textLight : C.navy,
                fontWeight: active ? 700 : 500, fontSize: 13, cursor: tab.comingSoon ? "default" : "pointer",
                whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.comingSoon && <span style={{ fontSize: 9, fontWeight: 700, color: C.textLight, background: C.borderLight, padding: "1px 5px", borderRadius: 8 }}>SOON</span>}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        {activeTab === 0 && <MetadataTab />}
        {activeTab === 1 && <ContentEditorTab />}
        {activeTab === 2 && <AssessmentTab />}
        {activeTab === 3 && <ReferencesTab />}
        {activeTab === 4 && <ACEPCheckerTab />}
        {activeTab === 5 && <PreviewTab />}
        {activeTab === 6 && <AIAssistantTab />}
        {activeTab === 7 && <SupplementsTab />}
      </div>

    </div>
  );
}

// ─── Root export (with provider) ─────────────────────────────────────────────

export default function CourseBuilder() {
  // Read course ID from URL param: /admin/course-builder?id=<mongoId>
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id") || null;

  return (
    <CourseBuilderProvider initialCourseId={courseId}>
      <CourseBuilderShell />
    </CourseBuilderProvider>
  );
}
