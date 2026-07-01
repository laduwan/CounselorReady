// ─── ReferencesTab ────────────────────────────────────────────────────────
// DROP INTO: /client/src/components/CourseBuilder/tabs/ReferencesTab.jsx
// Uses useCourseBuilder() hook — no props.

import { useCourseBuilder } from "../CourseBuilderContext.jsx";

const C = {
  burgundy: "#6B1D34", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#284157",
  bg: "#F8F7F4", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
  danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
};

const S = {
  card: { background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 12 },
  cardHeader: { padding: "12px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg },
  cardBody: { padding: 16 },
  label: { fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 5, display: "block" },
  input: { width: "100%", padding: "8px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff" },
  btn: (bg, color) => ({ background: bg, color, border: "none", borderRadius: 7, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }),
  btnIcon: { background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer", color: C.textMuted },
  badge: (color) => ({ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: color + "18", color }),
};

/** Build APA-7 formatted string from a reference object */
function formatAPA(ref) {
  const author = ref.author?.trim() || "";
  const year   = ref.year?.trim()   || "";
  const title  = ref.title?.trim()  || "";
  const source = ref.source?.trim() || "";

  if (!author && !year && !title && !source) return null;

  const parts = [];
  if (author) parts.push(author);
  if (year)   parts.push(`(${year})`);
  const afterAuthorYear = parts.join(" ");

  return { authorYear: afterAuthorYear, title, source };
}

function APAPreview({ reference: r }) {
  const parts = formatAPA(r);
  if (!parts) return null;
  const { authorYear, title, source } = parts;

  return (
    <div style={{
      marginTop: 10, padding: "9px 13px",
      background: C.goldFaded, borderRadius: 8,
      border: `1px solid ${C.gold}33`,
      fontSize: 13, lineHeight: 1.6, color: C.navy,
      fontFamily: "Georgia, serif",
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, display: "block", marginBottom: 3, letterSpacing: "0.05em" }}>
        APA-7 PREVIEW
      </span>
      {authorYear && <span>{authorYear}. </span>}
      {title && <><em>{title}</em>. </>}
      {source && <span>{source}.</span>}
    </div>
  );
}

function ReferenceCard({ ref: r, index, total, onUpdate, onRemove, onMove }) {
  const isEmpty = !r.author && !r.year && !r.title && !r.source;

  return (
    <div style={{
      ...S.card,
      borderColor: isEmpty ? C.danger + "55" : C.border,
    }}>
      <div style={{ ...S.cardHeader }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...S.badge(C.navy), minWidth: 24 }}>{index + 1}</span>
          {isEmpty && (
            <span style={{ fontSize: 12, color: C.danger }}>⚠ Empty reference</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={S.btnIcon} onClick={() => onMove(-1)} disabled={index === 0} title="Move up">↑</button>
          <button style={S.btnIcon} onClick={() => onMove(1)} disabled={index === total - 1} title="Move down">↓</button>
          <button
            onClick={onRemove}
            style={{ ...S.btnIcon, color: C.danger, borderColor: C.danger + "44" }}
            title="Delete reference"
          >✕</button>
        </div>
      </div>

      <div style={S.cardBody}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={S.label}>Author(s)</label>
            <input
              style={S.input}
              placeholder="e.g., Smith, J. A., & Jones, B."
              value={r.author || ""}
              onChange={e => onUpdate({ author: e.target.value })}
            />
          </div>
          <div>
            <label style={S.label}>Year</label>
            <input
              style={S.input}
              placeholder="2024"
              value={r.year || ""}
              onChange={e => onUpdate({ year: e.target.value })}
              maxLength={4}
            />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={S.label}>Title</label>
          <input
            style={S.input}
            placeholder="Article or book title"
            value={r.title || ""}
            onChange={e => onUpdate({ title: e.target.value })}
          />
        </div>

        <div>
          <label style={S.label}>Source / Journal / Publisher</label>
          <input
            style={S.input}
            placeholder="e.g., Journal of Counseling Psychology, 45(2), 123–134. https://doi.org/..."
            value={r.source || ""}
            onChange={e => onUpdate({ source: e.target.value })}
          />
        </div>

        <APAPreview reference={r} />
      </div>
    </div>
  );
}

export default function ReferencesTab() {
  const { state, dispatch } = useCourseBuilder();
  const references = state.references || [];

  const addRef = () =>
    dispatch({ type: "ADD_REFERENCE" });

  const updateRef = (id, changes) =>
    dispatch({ type: "UPDATE_REFERENCE", id, changes });

  const removeRef = (id) =>
    dispatch({ type: "REMOVE_REFERENCE", id });

  const moveRef = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= references.length) return;
    dispatch({ type: "MOVE_REFERENCE", from: idx, to: newIdx });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>References</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>
            APA-7 format · {references.length} reference{references.length !== 1 ? "s" : ""} added
            {references.length === 0 && (
              <span style={{ color: C.danger, marginLeft: 8 }}>⚠ At least one required</span>
            )}
          </div>
        </div>
        <div style={{ ...S.badge(references.length > 0 ? C.green : C.danger) }}>
          {references.length} / 1 min
        </div>
      </div>

      {/* APA format hint */}
      <div style={{
        padding: "10px 14px", marginBottom: 16,
        background: C.burgundyFaded, borderRadius: 8,
        border: `1px solid ${C.burgundy}22`, fontSize: 12, color: C.navy,
        lineHeight: 1.6,
      }}>
        <strong>APA-7 format:</strong> Author(s). (Year). <em>Title</em>. Journal/Publisher, volume(issue), pages. https://doi.org/...
      </div>

      {/* Reference list */}
      {references.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", marginBottom: 16 }}>
          <div style={{ padding: "36px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📚</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 6 }}>
              No references yet
            </div>
            <div style={{ color: C.textMuted, fontSize: 13 }}>
              References appear in the course conclusion and are required for ACEP compliance.
            </div>
          </div>
        </div>
      ) : (
        references.map((ref, i) => (
          <ReferenceCard
            key={ref.id}
            reference={ref}
            index={i}
            total={references.length}
            onUpdate={changes => updateRef(ref.id, changes)}
            onRemove={() => removeRef(ref.id)}
            onMove={dir => moveRef(i, dir)}
          />
        ))
      )}

      {/* Add button */}
      <button
        style={{ ...S.btn(C.green, "#fff"), width: "100%", justifyContent: "center", padding: "11px" }}
        onClick={addRef}
      >
        + Add Reference
      </button>
    </div>
  );
}
