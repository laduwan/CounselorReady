// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/ReferencesTab.jsx
// APA-7 reference manager with live preview.
// ─────────────────────────────────────────────────────────────────────────────

import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C } from "../constants.js";

const S = {
  section: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.navy,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: `1px solid ${C.borderLight}`,
  },
  label: {
    display: "block", fontSize: 12, fontWeight: 600, color: C.navy,
    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em",
  },
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", boxSizing: "border-box",
  },
  refCard: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 20,
    marginBottom: 14,
  },
  refHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 14,
  },
  refNumber: {
    fontSize: 13, fontWeight: 700, color: C.navy,
    background: `${C.navy}10`, padding: "3px 10px", borderRadius: 6,
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 },
  row1: { display: "grid", gap: 16, marginBottom: 12 },
  apaPreview: {
    padding: "12px 16px",
    background: C.stone,
    borderRadius: 8,
    fontSize: 13,
    color: C.navy,
    lineHeight: 1.6,
    borderLeft: `3px solid ${C.honey}`,
  },
  btnSmall: {
    padding: "5px 12px", borderRadius: 6, border: "none",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  addBtn: {
    padding: "10px 20px", borderRadius: 8, border: `2px dashed ${C.border}`,
    background: "transparent", color: C.navy, fontWeight: 600,
    fontSize: 14, cursor: "pointer", width: "100%",
  },
};

// ─── APA-7 formatter ──────────────────────────────────────────────────────────

function formatAPA(r) {
  const author = r.author?.trim() || "Author";
  const year = r.year || "n.d.";
  const title = r.title?.trim() || "Title";
  const source = r.source?.trim() || "";
  return { author, year, title, source };
}

function APAPreview({ reference }) {
  const { author, year, title, source } = formatAPA(reference);
  return (
    <div style={S.apaPreview}>
      {author} ({year}). <em>{title}</em>.{source ? ` ${source}.` : ""}
    </div>
  );
}

// ─── Single reference card ────────────────────────────────────────────────────

function ReferenceCard({ reference, index, onUpdate, onRemove }) {
  return (
    <div style={S.refCard}>
      <div style={S.refHeader}>
        <span style={S.refNumber}>Ref {index + 1}</span>
        <button
          style={{ ...S.btnSmall, background: `${C.danger}15`, color: C.danger }}
          onClick={() => onRemove(index)}
          title="Delete reference"
        >
          Delete
        </button>
      </div>

      <div style={S.row2}>
        <div>
          <label style={S.label}>Author(s)</label>
          <input style={S.input}
            value={reference.author || ""}
            onChange={(e) => onUpdate(index, { author: e.target.value })}
            placeholder="Last, F. M."
          />
        </div>
        <div>
          <label style={S.label}>Year</label>
          <input style={S.input}
            type="number"
            value={reference.year || ""}
            onChange={(e) => onUpdate(index, { year: e.target.value ? Number(e.target.value) : "" })}
            placeholder="2024"
          />
        </div>
      </div>

      <div style={S.row1}>
        <div>
          <label style={S.label}>Title</label>
          <input style={S.input}
            value={reference.title || ""}
            onChange={(e) => onUpdate(index, { title: e.target.value })}
            placeholder="Article or book title"
          />
        </div>
      </div>

      <div style={S.row1}>
        <div>
          <label style={S.label}>Source (journal, publisher, URL)</label>
          <input style={S.input}
            value={reference.source || ""}
            onChange={(e) => onUpdate(index, { source: e.target.value })}
            placeholder="Journal of Counseling & Development, 100(2), 45–58"
          />
        </div>
      </div>

      {/* APA live preview */}
      <div style={{ marginTop: 12 }}>
        <label style={{ ...S.label, marginBottom: 8 }}>APA-7 Preview</label>
        <APAPreview reference={reference} />
      </div>
    </div>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export default function ReferencesTab() {
  const {
    state,
    addReference,
    updateReference,
    removeReference,
  } = useCourseBuilder();

  const refs = state.references || [];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>References</div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
          ACEP requires at least one reference. Enter references in APA-7 format.
          A live preview is shown below each entry.
        </div>
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: refs.length > 0 ? C.hunterGreen : C.danger }}>
          {refs.length} reference{refs.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Reference list ── */}
      {refs.map((r, i) => (
        <ReferenceCard
          key={r._tempId || i}
          reference={r}
          index={i}
          onUpdate={updateReference}
          onRemove={removeReference}
        />
      ))}

      {/* ── Add reference ── */}
      <button style={S.addBtn} onClick={() => addReference()}>
        + Add Reference
      </button>
    </div>
  );
}
