// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/PreviewTab.jsx
//
// Live preview of the current draft, rendered by the real CReady Viewer
// (interactive-course.html) in an iframe. No save required — the draft is
// pushed to the iframe via postMessage whenever state changes.
//
// Why this matters:
//   • The builder never invents its own rendering. What you see here is
//     exactly what learners will see post-publish.
//   • Catches missing section dividers, broken MC options, word-count
//     shortfalls, and block-ordering bugs BEFORE publish.
//   • No backend round-trip — instant feedback.
//
// Contract with interactive-course.html (already live in production):
//   • Iframe loads `/interactive-course.html?preview=true`
//   • Parent posts  { type: 'LOAD_COURSE', course: <payload> }
//   • Viewer posts  { type: 'COURSE_LOADED', title, sections } when rendered
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from "react";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C } from "../constants.js";
import { buildSavePayload, countCourseWords } from "../utils.js";

const REFRESH_DEBOUNCE_MS = 800;

const S = {
  wrap:    { display: "flex", flexDirection: "column", height: "calc(100vh - 160px)", background: C.stone, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" },
  toolbar: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", borderBottom: `1px solid ${C.border}`, flexShrink: 0 },
  title:   { fontSize: 13, fontWeight: 700, color: C.navy },
  spacer:  { flex: 1 },
  meta:    { fontSize: 11, color: C.textMuted },
  btn:     (primary, disabled) => ({
    padding: "6px 12px", borderRadius: 6,
    border: primary ? "none" : `1px solid ${C.border}`,
    background: disabled ? C.borderLight : primary ? C.hunterGreen : "#fff",
    color: disabled ? C.textLight : primary ? "#fff" : C.navy,
    fontSize: 12, fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
  }),
  device:  (active) => ({
    padding: "5px 10px", fontSize: 11, fontWeight: 600,
    border: "none", background: active ? C.burgundy : "transparent",
    color: active ? "#fff" : C.textMuted, cursor: "pointer",
    borderRadius: 4,
  }),
  deviceGroup: { display: "flex", gap: 2, background: C.stone, padding: 2, borderRadius: 6 },
  iframeWrap:  { flex: 1, display: "flex", justifyContent: "center", alignItems: "stretch", background: C.borderLight, overflow: "auto", padding: 16 },
  iframe:      (width) => ({ width, height: "100%", minHeight: 600, border: "none", background: "#fff", borderRadius: 6, boxShadow: "0 4px 16px #0001", transition: "width 0.2s ease" }),
  empty:       { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.textMuted, textAlign: "center", padding: 40, gap: 8 },
  emptyIcon:   { fontSize: 36, opacity: 0.5 },
  badge:       (color) => ({ fontSize: 10, fontWeight: 700, color: "#fff", background: color, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.03em" }),
};

const DEVICES = {
  desktop: { label: "Desktop", width: "100%" },
  tablet:  { label: "Tablet",  width: 820 },
  mobile:  { label: "Mobile",  width: 400 },
};

// Preview iframe src — same host as the app so postMessage isn't cross-origin blocked.
// Works in dev (localhost Vite) because Vite proxies /interactive-course.html from public/.
const PREVIEW_SRC = "/interactive-course.html?preview=true";

export default function PreviewTab() {
  const { state } = useCourseBuilder();
  const iframeRef = useRef(null);

  const [device, setDevice]       = useState("desktop");
  const [viewerReady, setViewerReady] = useState(false);
  const [lastPushed, setLastPushed]   = useState(null);
  const [renderStatus, setRenderStatus] = useState(null); // { title, sections }
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Derive the payload the viewer expects. buildSavePayload normalizes
  // sections/contentBlocks/options the same way the save endpoint does.
  const payload = useMemo(() => {
    try { return buildSavePayload(state, false); }
    catch { return null; }
  }, [state]);

  const hasContent = !!payload && (payload.sections?.length > 0);
  const totalWords = countCourseWords(state.sections);

  // ── Push current draft to iframe ──
  function pushToIframe() {
    if (!iframeRef.current?.contentWindow || !payload) return;
    iframeRef.current.contentWindow.postMessage(
      { type: "LOAD_COURSE", course: payload },
      "*"
    );
    setLastPushed(new Date());
  }

  // ── Listen for viewer ready / loaded messages ──
  useEffect(() => {
    function onMessage(e) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "COURSE_LOADED") {
        setRenderStatus({ title: e.data.title, sections: e.data.sections });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // ── When iframe finishes loading its HTML, push the course ──
  function handleIframeLoad() {
    setViewerReady(true);
    // Small delay to let the viewer's internal listener attach
    setTimeout(pushToIframe, 100);
  }

  // ── Auto-refresh on state change (debounced) ──
  useEffect(() => {
    if (!viewerReady || !autoRefresh || !hasContent) return;
    const t = setTimeout(pushToIframe, REFRESH_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, viewerReady, autoRefresh]);

  // ── Hard-refresh (reload iframe entirely) ──
  function hardRefresh() {
    if (!iframeRef.current) return;
    setViewerReady(false);
    setRenderStatus(null);
    iframeRef.current.src = PREVIEW_SRC;
  }

  // ── Open in new tab (saved-only, won't show unsaved changes) ──
  function openInNewTab() {
    if (state._id) {
      window.open(`/interactive-course.html?id=${state._id}&preview=true`, "_blank");
    } else {
      alert("Save the course first to open it in a new tab.");
    }
  }

  // ── Empty state ──
  if (!hasContent) {
    return (
      <div style={S.wrap}>
        <div style={S.empty}>
          <div style={S.emptyIcon}>👁</div>
          <p style={{ fontWeight: 700, color: C.navy, fontSize: 15 }}>
            Nothing to preview yet
          </p>
          <p style={{ fontSize: 13, maxWidth: 420 }}>
            Add at least one section with content in the <strong>Content Editor</strong> tab,
            then return here to see exactly how learners will experience the course.
          </p>
        </div>
      </div>
    );
  }

  // ── Main preview ──
  const deviceWidth = DEVICES[device].width;

  return (
    <div style={S.wrap}>
      {/* Toolbar */}
      <div style={S.toolbar}>
        <span style={S.title}>Live Preview</span>

        {state.status === "published"
          ? <span style={S.badge(C.hunterGreen)}>LIVE</span>
          : <span style={S.badge(C.honey)}>DRAFT</span>}

        <span style={S.meta}>
          {state.sections?.length || 0} section{state.sections?.length === 1 ? "" : "s"}
          {" · "}
          {totalWords.toLocaleString()} words
          {renderStatus && ` · rendered ${renderStatus.sections} section${renderStatus.sections === 1 ? "" : "s"}`}
        </span>

        <span style={S.spacer} />

        {/* Device width toggle */}
        <div style={S.deviceGroup}>
          {Object.entries(DEVICES).map(([key, cfg]) => (
            <button key={key} style={S.device(device === key)} onClick={() => setDevice(key)}>
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Auto-refresh toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMuted, cursor: "pointer", userSelect: "none" }}>
          <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
          Auto-refresh
        </label>

        {/* Manual refresh */}
        <button
          style={S.btn(false, !viewerReady)}
          onClick={pushToIframe}
          disabled={!viewerReady}
          title="Re-push current draft to preview"
        >
          ↻ Refresh
        </button>

        {/* Hard reload */}
        <button
          style={S.btn(false, false)}
          onClick={hardRefresh}
          title="Reload iframe entirely"
        >
          ⟲ Reload
        </button>

        {/* Open in new tab (saved version only) */}
        <button
          style={S.btn(true, !state._id)}
          onClick={openInNewTab}
          disabled={!state._id}
          title={state._id ? "Open saved version in new tab" : "Save first to open in new tab"}
        >
          ↗ New Tab
        </button>
      </div>

      {/* Iframe */}
      <div style={S.iframeWrap}>
        <iframe
          ref={iframeRef}
          title="Course preview"
          src={PREVIEW_SRC}
          style={S.iframe(deviceWidth)}
          onLoad={handleIframeLoad}
          // Sandbox: allow scripts so the viewer runs, same-origin so postMessage & fetch work
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Bottom status strip */}
      <div style={{ ...S.toolbar, borderTop: `1px solid ${C.border}`, borderBottom: "none", fontSize: 11 }}>
        <span style={S.meta}>
          {lastPushed
            ? `Last pushed ${lastPushed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : "Waiting for preview…"}
        </span>
        <span style={S.spacer} />
        <span style={S.meta}>
          Preview uses the real CReady Viewer — what you see is what learners get.
        </span>
      </div>
    </div>
  );
}
