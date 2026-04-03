// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/ContentEditorTab.jsx
// Phase 1: sections sidebar + block canvas with textarea editors.
// Phase 2 will swap textareas for Tiptap and add dnd-kit.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C, BLOCK_TYPE_CONFIG, BLOCK_TYPE_GROUPS, KC_BLOCK_TYPES } from "../constants.js";
import { countSectionWords, countKCsInSection, countBlockWords } from "../utils.js";

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  layout:    { display: "grid", gridTemplateColumns: "240px 1fr", gap: 0, height: "100%", minHeight: 600 },
  sidebar:   { background: C.stone, borderRight: `1px solid ${C.border}`, padding: 12, overflowY: "auto" },
  canvas:    { padding: 24, overflowY: "auto", background: "#fff" },
  sectionBtn: (active) => ({
    width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8,
    border: "none", cursor: "pointer", marginBottom: 4,
    background: active ? C.burgundy : "transparent",
    color: active ? "#fff" : C.navy,
    fontWeight: active ? 700 : 500,
    fontSize: 13,
  }),
  sectionMeta: { fontSize: 11, opacity: 0.75, marginTop: 2 },
  addSectionBtn: {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: `2px dashed ${C.border}`, background: "transparent",
    color: C.textMuted, fontSize: 13, cursor: "pointer", marginTop: 8,
  },
  blockCard: (editing) => ({
    border: `1px solid ${editing ? C.burgundy : C.border}`,
    borderLeft: `4px solid ${editing ? C.burgundy : C.border}`,
    borderRadius: 10, marginBottom: 8, background: "#fff",
    boxShadow: editing ? `0 0 0 2px ${C.burgundyFaded}` : "none",
  }),
  blockHeader: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 14px", cursor: "pointer",
  },
  blockIcon: (color) => ({
    width: 28, height: 28, borderRadius: 6,
    background: color + "20", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 14,
    flexShrink: 0,
  }),
  blockTitle: { fontWeight: 600, fontSize: 13, flex: 1, color: C.navy },
  blockMeta: { fontSize: 11, color: C.textMuted },
  blockBody: { padding: "0 14px 14px" },
  kcBadge: {
    fontSize: 9, fontWeight: 700, color: C.burgundy,
    background: C.burgundyFaded, padding: "2px 6px", borderRadius: 4,
  },
  actionBtn: (danger) => ({
    background: "none", border: "none", cursor: "pointer",
    color: danger ? C.danger : C.textMuted, fontSize: 13, padding: "2px 6px",
    borderRadius: 4,
  }),
  label: { display: "block", fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 5, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.stone, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.stone, resize: "vertical", boxSizing: "border-box" },
  insertBar: {
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "4px 0", opacity: 0, transition: "opacity 0.15s",
  },
  insertBtn: {
    background: C.hunterGreen, color: "#fff", border: "none",
    borderRadius: 12, padding: "2px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
  },
};

// ─── Block picker ─────────────────────────────────────────────────────────────

function BlockPicker({ onPick, onClose }) {
  return (
    <div style={{
      border: `1px solid ${C.border}`, borderRadius: 10, background: "#fff",
      padding: 12, marginBottom: 8, boxShadow: "0 4px 16px #0001",
    }}>
      {BLOCK_TYPE_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            {group.label}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {group.types.map(type => {
              const cfg = BLOCK_TYPE_CONFIG[type];
              return (
                <button
                  key={type}
                  onClick={() => { onPick(type); onClose(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`,
                    background: C.stone, cursor: "pointer", fontSize: 12, color: C.navy,
                    fontWeight: 500,
                  }}
                >
                  <span>{cfg.icon}</span>{cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <button onClick={onClose} style={{ ...S.actionBtn(false), fontSize: 12 }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Block editor (Phase 1: textarea-based) ───────────────────────────────────

function BlockEditor({ block, onChange }) {
  switch (block.type) {

    case "sectionDivider":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 10 }}>
          <div>
            <label style={S.label}>Section Title</label>
            <input style={S.input} value={block.title || ""} onChange={e => onChange({ title: e.target.value })} />
          </div>
          <div>
            <label style={S.label}>Section #</label>
            <input type="number" style={S.input} value={block.sectionNumber || 1} onChange={e => onChange({ sectionNumber: Number(e.target.value) })} />
          </div>
          <div>
            <label style={S.label}>Subtitle</label>
            <input style={S.input} value={block.subtitle || ""} onChange={e => onChange({ subtitle: e.target.value })} />
          </div>
        </div>
      );

    case "text":
      return (
        <>
          <label style={S.label}>Heading (optional)</label>
          <input style={S.input} value={block.heading || ""} onChange={e => onChange({ heading: e.target.value })} placeholder="Section heading..." />
          <label style={S.label}>Content (HTML)</label>
          <textarea style={{ ...S.textarea, minHeight: 180 }} value={block.content || ""} onChange={e => onChange({ content: e.target.value })} placeholder="<p>Enter content...</p>" />
        </>
      );

    case "accordion":
      return (
        <>
          <label style={S.label}>Accordion Title</label>
          <input style={S.input} value={block.title || ""} onChange={e => onChange({ title: e.target.value })} />
          {(block.items || []).map((item, i) => (
            <div key={i} style={{ marginTop: 10, padding: 10, background: C.stone, borderRadius: 6, border: `1px solid ${C.borderLight}` }}>
              <label style={S.label}>Item {i + 1} Title</label>
              <input style={S.input} value={item.title || ""} onChange={e => {
                const items = [...block.items];
                items[i] = { ...items[i], title: e.target.value };
                onChange({ items });
              }} />
              <label style={S.label}>Item {i + 1} Content (HTML)</label>
              <textarea style={{ ...S.textarea, minHeight: 80 }} value={item.content || ""} onChange={e => {
                const items = [...block.items];
                items[i] = { ...items[i], content: e.target.value };
                onChange({ items });
              }} />
              <button style={{ ...S.actionBtn(true), marginTop: 6, fontSize: 12 }} onClick={() => {
                onChange({ items: block.items.filter((_, j) => j !== i) });
              }}>Remove item</button>
            </div>
          ))}
          <button style={{ marginTop: 10, padding: "6px 14px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", color: C.hunterGreen, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            onClick={() => onChange({ items: [...(block.items || []), { title: `Item ${(block.items || []).length + 1}`, content: "" }] })}>
            + Add Item
          </button>
        </>
      );

    case "multipleChoice":
    case "multiSelect": {
      const isMulti = block.type === "multiSelect";
      return (
        <>
          <label style={S.label}>Question</label>
          <textarea style={{ ...S.textarea, minHeight: 60 }} value={block.question || ""} onChange={e => onChange({ question: e.target.value })} />
          <label style={S.label}>Options</label>
          {(block.options || ["", "", "", ""]).map((opt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input
                type={isMulti ? "checkbox" : "radio"}
                checked={isMulti
                  ? (block.correctAnswers || []).includes(i)
                  : block.correctAnswer === i}
                onChange={() => {
                  if (isMulti) {
                    const prev = block.correctAnswers || [];
                    onChange({ correctAnswers: prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i] });
                  } else {
                    onChange({ correctAnswer: i });
                  }
                }}
                style={{ accentColor: C.burgundy, width: 16, height: 16, flexShrink: 0 }}
              />
              <input style={{ ...S.input, flex: 1 }} value={opt} placeholder={`Option ${i + 1}`}
                onChange={e => {
                  const options = [...(block.options || ["", "", "", ""])];
                  options[i] = e.target.value;
                  onChange({ options });
                }}
              />
            </div>
          ))}
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
            {isMulti ? "Check all correct answers." : "Select the correct answer (radio button)."}
          </p>
          <label style={S.label}>Explanation / Rationale</label>
          <textarea style={{ ...S.textarea, minHeight: 60 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} placeholder="Explain why this answer is correct..." />
        </>
      );
    }

    case "reflection":
      return (
        <>
          <label style={S.label}>Reflection Prompt</label>
          <textarea style={{ ...S.textarea, minHeight: 80 }} value={block.prompt || ""} onChange={e => onChange({ prompt: e.target.value })} />
          <label style={S.label}>Minimum Words Required</label>
          <input type="number" style={{ ...S.input, width: 100 }} value={block.minWords || 50} onChange={e => onChange({ minWords: Number(e.target.value) })} />
        </>
      );

    case "matching":
      return (
        <>
          <label style={S.label}>Instructions</label>
          <input style={S.input} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />
          {(block.pairs || []).map((pair, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input style={S.input} value={pair.term || ""} placeholder="Term" onChange={e => {
                const pairs = [...block.pairs];
                pairs[i] = { ...pairs[i], term: e.target.value };
                onChange({ pairs });
              }} />
              <input style={S.input} value={pair.definition || ""} placeholder="Definition" onChange={e => {
                const pairs = [...block.pairs];
                pairs[i] = { ...pairs[i], definition: e.target.value };
                onChange({ pairs });
              }} />
              <button style={S.actionBtn(true)} onClick={() => onChange({ pairs: block.pairs.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={{ marginTop: 10, padding: "6px 14px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", color: C.hunterGreen, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            onClick={() => onChange({ pairs: [...(block.pairs || []), { term: "", definition: "" }] })}>
            + Add Pair
          </button>
        </>
      );

    case "image":
      return (
        <>
          <label style={S.label}>Image URL (Cloudinary)</label>
          <input style={S.input} value={block.url || ""} onChange={e => onChange({ url: e.target.value })} placeholder="https://res.cloudinary.com/dzfscjhdx/..." />
          <label style={S.label}>Alt Text</label>
          <input style={S.input} value={block.alt || ""} onChange={e => onChange({ alt: e.target.value })} />
          <label style={S.label}>Caption</label>
          <input style={S.input} value={block.caption || ""} onChange={e => onChange({ caption: e.target.value })} />
        </>
      );

    case "resources":
      return (
        <>
          <label style={S.label}>Section Title</label>
          <input style={S.input} value={block.title || ""} onChange={e => onChange({ title: e.target.value })} />
          {(block.links || []).map((link, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input style={S.input} value={link.label || ""} placeholder="Label" onChange={e => {
                const links = [...block.links];
                links[i] = { ...links[i], label: e.target.value };
                onChange({ links });
              }} />
              <input style={S.input} value={link.url || ""} placeholder="https://..." onChange={e => {
                const links = [...block.links];
                links[i] = { ...links[i], url: e.target.value };
                onChange({ links });
              }} />
              <button style={S.actionBtn(true)} onClick={() => onChange({ links: block.links.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={{ marginTop: 10, padding: "6px 14px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", color: C.hunterGreen, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            onClick={() => onChange({ links: [...(block.links || []), { label: "", url: "" }] })}>
            + Add Link
          </button>
        </>
      );

    default:
      return (
        <p style={{ color: C.textMuted, fontSize: 13, fontStyle: "italic" }}>
          Editor for <strong>{block.type}</strong> will be added in Phase 2.{" "}
          Block data is preserved — only the visual editor is pending.
        </p>
      );
  }
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export default function ContentEditorTab() {
  const {
    state,
    addSection, removeSection, setSectionTitle,
    addBlock, updateBlock, removeBlock, duplicateBlock,
  } = useCourseBuilder();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [editingBlockIndex, setEditingBlockIndex]   = useState(null);
  const [showBlockMenu, setShowBlockMenu]           = useState(null); // afterBlockIndex | "top"

  const sections       = state.sections || [];
  const activeSection  = sections[activeSectionIndex];

  // If no sections, prompt to create one
  if (sections.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 80, color: C.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No sections yet</p>
        <p style={{ fontSize: 14, marginBottom: 24 }}>Add your first section to start building content.</p>
        <button
          onClick={() => addSection("Section 1")}
          style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: C.hunterGreen, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >
          + Add First Section
        </button>
      </div>
    );
  }

  return (
    <div style={S.layout}>

      {/* ── Sidebar ── */}
      <div style={S.sidebar}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Sections
        </div>
        {sections.map((section, si) => {
          const wc  = countSectionWords(section);
          const kcs = countKCsInSection(section);
          return (
            <button
              key={section._tempId || si}
              style={S.sectionBtn(si === activeSectionIndex)}
              onClick={() => { setActiveSectionIndex(si); setEditingBlockIndex(null); }}
            >
              <div>{section.title || `Section ${si + 1}`}</div>
              <div style={S.sectionMeta}>{wc.toLocaleString()}w · {kcs} KC{kcs !== 1 ? "s" : ""} · {section.contentBlocks?.length || 0} blocks</div>
            </button>
          );
        })}
        <button style={S.addSectionBtn} onClick={() => {
          addSection(`Section ${sections.length + 1}`);
          setActiveSectionIndex(sections.length);
        }}>
          + Add Section
        </button>
      </div>

      {/* ── Canvas ── */}
      <div style={S.canvas}>
        {activeSection && (
          <>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <input
                style={{ ...S.input, flex: 1, fontSize: 18, fontWeight: 700, color: C.navy, background: "transparent", border: "none", borderBottom: `2px solid ${C.border}`, borderRadius: 0, padding: "6px 0" }}
                value={activeSection.title || ""}
                onChange={e => setSectionTitle(activeSectionIndex, e.target.value)}
                placeholder="Section title..."
              />
              <span style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" }}>
                {countSectionWords(activeSection).toLocaleString()} words
              </span>
              {sections.length > 1 && (
                <button style={S.actionBtn(true)} title="Delete section"
                  onClick={() => {
                    if (!confirm("Delete this section and all its blocks?")) return;
                    removeSection(activeSectionIndex);
                    setActiveSectionIndex(Math.max(0, activeSectionIndex - 1));
                  }}>
                  🗑
                </button>
              )}
            </div>

            {/* Top insert bar */}
            <div
              style={{ ...S.insertBar, opacity: 1, marginBottom: 8 }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
            >
              <button
                style={S.insertBtn}
                onClick={() => setShowBlockMenu(showBlockMenu === "top" ? null : "top")}
              >
                + Add Block
              </button>
            </div>
            {showBlockMenu === "top" && (
              <BlockPicker
                onPick={type => { addBlock(activeSectionIndex, type, -1); setShowBlockMenu(null); }}
                onClose={() => setShowBlockMenu(null)}
              />
            )}

            {/* Block list */}
            {(activeSection.contentBlocks || []).map((block, bi) => {
              const cfg      = BLOCK_TYPE_CONFIG[block.type] || { label: block.type, icon: "📦", color: C.textMuted };
              const isEditing = editingBlockIndex === bi;
              const isKC     = KC_BLOCK_TYPES.has(block.type);

              return (
                <div key={block._tempId || bi}>
                  <div style={S.blockCard(isEditing)}>
                    {/* Header */}
                    <div style={S.blockHeader} onClick={() => setEditingBlockIndex(isEditing ? null : bi)}>
                      <span style={S.blockIcon(cfg.color)}>{cfg.icon}</span>
                      <span style={S.blockTitle}>{cfg.label}</span>
                      {isKC && <span style={S.kcBadge}>KC</span>}
                      <span style={S.blockMeta}>{countBlockWords(block)}w</span>
                      <button style={S.actionBtn(false)} title="Duplicate" onClick={e => { e.stopPropagation(); duplicateBlock(activeSectionIndex, bi); }}>⧉</button>
                      <button style={S.actionBtn(true)} title="Delete" onClick={e => { e.stopPropagation(); removeBlock(activeSectionIndex, bi); }}>✕</button>
                    </div>
                    {/* Body */}
                    {isEditing && (
                      <div style={S.blockBody}>
                        <BlockEditor
                          block={block}
                          onChange={updates => updateBlock(activeSectionIndex, bi, updates)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Insert bar between blocks */}
                  <div style={{ ...S.insertBar, marginBottom: 4 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <button style={S.insertBtn} onClick={() => setShowBlockMenu(showBlockMenu === bi ? null : bi)}>+ Insert</button>
                  </div>
                  {showBlockMenu === bi && (
                    <BlockPicker
                      onPick={type => { addBlock(activeSectionIndex, type, bi); setShowBlockMenu(null); }}
                      onClose={() => setShowBlockMenu(null)}
                    />
                  )}
                </div>
              );
            })}

            {/* Empty state */}
            {(activeSection.contentBlocks || []).length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: C.textMuted, border: `2px dashed ${C.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No content blocks yet</p>
                <p style={{ fontSize: 12 }}>Use "+ Add Block" above to start building this section.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
