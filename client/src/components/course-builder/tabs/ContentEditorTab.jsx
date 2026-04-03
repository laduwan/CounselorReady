// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/ContentEditorTab.jsx  (Phase 2)
// Section sidebar + block canvas.
// Drag-and-drop via @dnd-kit/sortable. Tiptap for text/accordion/reflection.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C, BLOCK_TYPE_CONFIG, BLOCK_TYPE_GROUPS, KC_BLOCK_TYPES } from "../constants.js";
import { countSectionWords, countKCsInSection, countBlockWords } from "../utils.js";
import TiptapEditor from "../shared/TiptapEditor.jsx";

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  layout:  { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: 600 },
  sidebar: { background: C.stone, borderRight: `1px solid ${C.border}`, padding: 12, overflowY: "auto" },
  canvas:  { padding: 24, overflowY: "auto", background: "#fff" },
  sectionBtn: (active) => ({
    width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8,
    border: "none", cursor: "pointer", marginBottom: 4,
    background: active ? C.burgundy : "transparent",
    color: active ? "#fff" : C.navy,
    fontWeight: active ? 700 : 500, fontSize: 13,
  }),
  sectionMeta:  { fontSize: 11, opacity: 0.75, marginTop: 2 },
  addSectionBtn: { width: "100%", padding: "8px 12px", borderRadius: 8, border: `2px dashed ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 13, cursor: "pointer", marginTop: 8 },
  blockCard: (editing, dragging) => ({
    border: `1px solid ${editing ? C.burgundy : C.border}`,
    borderLeft: `4px solid ${editing ? C.burgundy : C.border}`,
    borderRadius: 10, marginBottom: 8, background: "#fff",
    boxShadow: dragging ? "0 8px 24px #0002" : editing ? `0 0 0 2px ${C.burgundyFaded}` : "none",
    opacity: dragging ? 0.85 : 1,
  }),
  blockHeader: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", cursor: "pointer", userSelect: "none" },
  blockIcon:   (color) => ({ width: 28, height: 28, borderRadius: 6, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }),
  blockTitle:  { fontWeight: 600, fontSize: 13, flex: 1, color: C.navy },
  blockMeta:   { fontSize: 11, color: C.textMuted },
  blockBody:   { padding: "0 14px 14px" },
  kcBadge:     { fontSize: 9, fontWeight: 700, color: C.burgundy, background: C.burgundyFaded, padding: "2px 6px", borderRadius: 4 },
  dragHandle:  { cursor: "grab", color: C.textLight, fontSize: 16, padding: "0 2px", flexShrink: 0, lineHeight: 1 },
  btn:  (danger) => ({ background: "none", border: "none", cursor: "pointer", color: danger ? C.danger : C.textMuted, fontSize: 13, padding: "2px 6px", borderRadius: 4 }),
  label:    { display: "block", fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 5, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.04em" },
  input:    { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.stone, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.stone, resize: "vertical", boxSizing: "border-box" },
  addBlockBtn: { width: "100%", padding: "7px", borderRadius: 8, border: `2px dashed ${C.border}`, background: "transparent", color: C.hunterGreen, fontWeight: 600, fontSize: 12, cursor: "pointer" },
};

// ─── Block picker ─────────────────────────────────────────────────────────────

function BlockPicker({ onPick, onClose }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: "#fff", padding: 12, marginTop: 6, marginBottom: 8, boxShadow: "0 4px 16px #0001" }}>
      {BLOCK_TYPE_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{group.label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {group.types.map(type => {
              const cfg = BLOCK_TYPE_CONFIG[type];
              return (
                <button key={type} onClick={() => { onPick(type); onClose(); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.stone, cursor: "pointer", fontSize: 12, color: C.navy, fontWeight: 500 }}>
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <button onClick={onClose} style={S.btn(false)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Block editor ─────────────────────────────────────────────────────────────

function BlockEditor({ block, onChange }) {
  switch (block.type) {

    case "sectionDivider":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 10 }}>
          <div><label style={S.label}>Section Title</label><input style={S.input} value={block.title || ""} onChange={e => onChange({ title: e.target.value })} /></div>
          <div><label style={S.label}>Section #</label><input type="number" style={S.input} value={block.sectionNumber || 1} onChange={e => onChange({ sectionNumber: Number(e.target.value) })} /></div>
          <div><label style={S.label}>Subtitle</label><input style={S.input} value={block.subtitle || ""} onChange={e => onChange({ subtitle: e.target.value })} /></div>
        </div>
      );

    case "text":
      return (
        <>
          <label style={S.label}>Heading (optional)</label>
          <input style={S.input} value={block.heading || ""} onChange={e => onChange({ heading: e.target.value })} placeholder="Section heading..." />
          <label style={{ ...S.label, marginTop: 10 }}>Content</label>
          <TiptapEditor value={block.content || ""} onChange={html => onChange({ content: html })} placeholder="Enter course content..." minHeight={200} />
        </>
      );

    case "accordion":
      return (
        <>
          <label style={S.label}>Accordion Title</label>
          <input style={S.input} value={block.title || ""} onChange={e => onChange({ title: e.target.value })} />
          {(block.items || []).map((item, i) => (
            <div key={i} style={{ marginTop: 10, padding: 10, background: C.stone, borderRadius: 6, border: `1px solid ${C.borderLight}` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ ...S.label, marginTop: 0 }}>Item {i + 1} Title</label>
                <button style={S.btn(true)} onClick={() => onChange({ items: block.items.filter((_, j) => j !== i) })}>Remove</button>
              </div>
              <input style={S.input} value={item.title || ""} onChange={e => { const items = [...block.items]; items[i] = { ...items[i], title: e.target.value }; onChange({ items }); }} />
              <label style={{ ...S.label, marginTop: 8 }}>Content</label>
              <TiptapEditor value={item.content || ""} onChange={html => { const items = [...block.items]; items[i] = { ...items[i], content: html }; onChange({ items }); }} minHeight={80} />
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
          <label style={S.label}>Options — {isMulti ? "check all correct" : "radio = correct answer"}</label>
          {(block.options || ["", "", "", ""]).map((opt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input type={isMulti ? "checkbox" : "radio"}
                checked={isMulti ? (block.correctAnswers || []).includes(i) : block.correctAnswer === i}
                onChange={() => isMulti
                  ? onChange({ correctAnswers: (block.correctAnswers || []).includes(i) ? (block.correctAnswers || []).filter(x => x !== i) : [...(block.correctAnswers || []), i] })
                  : onChange({ correctAnswer: i })
                }
                style={{ accentColor: C.burgundy, width: 16, height: 16, flexShrink: 0 }}
              />
              <input style={{ ...S.input, flex: 1 }} value={opt} placeholder={`Option ${i + 1}`}
                onChange={e => { const options = [...(block.options || ["","","",""])]; options[i] = e.target.value; onChange({ options }); }}
              />
            </div>
          ))}
          <label style={S.label}>Explanation</label>
          <textarea style={{ ...S.textarea, minHeight: 60 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} placeholder="Why is this the correct answer?" />
        </>
      );
    }

    case "reflection":
      return (
        <>
          <label style={S.label}>Reflection Prompt</label>
          <TiptapEditor value={block.prompt || ""} onChange={html => onChange({ prompt: html })} minHeight={80} placeholder="Invite the learner to reflect..." />
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ ...S.label, marginTop: 0 }}>Min Words</label>
            <input type="number" style={{ ...S.input, width: 80 }} value={block.minWords || 50} onChange={e => onChange({ minWords: Number(e.target.value) })} />
          </div>
        </>
      );

    case "matching":
      return (
        <>
          <label style={S.label}>Instructions</label>
          <input style={S.input} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />
          {(block.pairs || []).map((pair, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input style={S.input} value={pair.term || ""} placeholder="Term" onChange={e => { const pairs = [...block.pairs]; pairs[i] = { ...pairs[i], term: e.target.value }; onChange({ pairs }); }} />
              <input style={S.input} value={pair.definition || ""} placeholder="Definition" onChange={e => { const pairs = [...block.pairs]; pairs[i] = { ...pairs[i], definition: e.target.value }; onChange({ pairs }); }} />
              <button style={S.btn(true)} onClick={() => onChange({ pairs: block.pairs.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={{ marginTop: 10, padding: "6px 14px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", color: C.hunterGreen, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            onClick={() => onChange({ pairs: [...(block.pairs || []), { term: "", definition: "" }] })}>+ Add Pair</button>
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
              <input style={S.input} value={link.label || ""} placeholder="Label" onChange={e => { const links = [...block.links]; links[i] = { ...links[i], label: e.target.value }; onChange({ links }); }} />
              <input style={S.input} value={link.url || ""} placeholder="https://..." onChange={e => { const links = [...block.links]; links[i] = { ...links[i], url: e.target.value }; onChange({ links }); }} />
              <button style={S.btn(true)} onClick={() => onChange({ links: block.links.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button style={{ marginTop: 10, padding: "6px 14px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", color: C.hunterGreen, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            onClick={() => onChange({ links: [...(block.links || []), { label: "", url: "" }] })}>+ Add Link</button>
        </>
      );

    default:
      return <p style={{ color: C.textMuted, fontSize: 13, fontStyle: "italic" }}>Full editor for <strong>{block.type}</strong> coming in Phase 3. Data preserved.</p>;
  }
}

// ─── Sortable block card ──────────────────────────────────────────────────────

function SortableBlockCard({ id, block, blockIndex, sectionIndex, editingBlockIndex, setEditingBlockIndex, onUpdate, onRemove, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const cfg     = BLOCK_TYPE_CONFIG[block.type] || { label: block.type, icon: "📦", color: C.textMuted };
  const isKC    = KC_BLOCK_TYPES.includes(block.type);
  const editing = editingBlockIndex === blockIndex;

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      <div style={S.blockCard(editing, isDragging)}>
        <div style={S.blockHeader} onClick={() => setEditingBlockIndex(editing ? null : blockIndex)}>
          <span style={S.dragHandle} {...attributes} {...listeners} onClick={e => e.stopPropagation()}>⠿</span>
          <span style={S.blockIcon(cfg.color)}>{cfg.icon}</span>
          <span style={S.blockTitle}>{cfg.label}</span>
          {isKC && <span style={S.kcBadge}>KC</span>}
          <span style={S.blockMeta}>{countBlockWords(block)}w</span>
          <button style={S.btn(false)} title="Duplicate" onClick={e => { e.stopPropagation(); onDuplicate(); }}>⧉</button>
          <button style={S.btn(true)} title="Delete" onClick={e => {
            e.stopPropagation();
            if (confirm(`Delete this ${cfg.label} block?`)) onRemove();
          }}>✕</button>
        </div>
        {editing && <div style={S.blockBody}><BlockEditor block={block} onChange={onUpdate} /></div>}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContentEditorTab() {
  const {
    state,
    addSection, removeSection, setSectionTitle, moveSection,
    addBlock, updateBlock, removeBlock, duplicateBlock, moveBlock,
    canUndo, canRedo, undo, redo,
  } = useCourseBuilder();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [editingBlockIndex, setEditingBlockIndex]   = useState(null);
  const [showBlockMenu, setShowBlockMenu]           = useState(null); // "top" | "bottom" | null

  const sensors      = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const sections     = state.sections || [];
  const activeSection = sections[activeSectionIndex];

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const blocks = activeSection?.contentBlocks || [];
    const ids    = blocks.map((b, i) => b._tempId || String(i));
    const from   = ids.indexOf(String(active.id));
    const to     = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) {
      moveBlock(activeSectionIndex, from, activeSectionIndex, to);
      if (editingBlockIndex === from) setEditingBlockIndex(to);
    }
  }

  if (sections.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 80, color: C.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No sections yet</p>
        <button onClick={() => { addSection("Section 1"); setActiveSectionIndex(0); }}
          style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: C.hunterGreen, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          + Add First Section
        </button>
      </div>
    );
  }

  return (
    <div style={S.layout}>

      {/* ── Sidebar ── */}
      <div style={S.sidebar}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sections</span>
          <div style={{ display: "flex", gap: 2 }}>
            <button title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}
              style={{ ...S.btn(false), opacity: canUndo ? 1 : 0.3, fontSize: 15, padding: "2px 5px" }}>↩</button>
            <button title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}
              style={{ ...S.btn(false), opacity: canRedo ? 1 : 0.3, fontSize: 15, padding: "2px 5px" }}>↪</button>
          </div>
        </div>

        {sections.map((section, si) => (
          <div key={section._tempId || si}>
            <button style={S.sectionBtn(si === activeSectionIndex)}
              onClick={() => { setActiveSectionIndex(si); setEditingBlockIndex(null); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4 }}>
                <span style={{ flex: 1 }}>{section.title || `Section ${si + 1}`}</span>
                <span style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {si > 0 && <span title="Move up" style={{ cursor: "pointer", opacity: 0.8 }}
                    onClick={e => { e.stopPropagation(); moveSection(si, si - 1); setActiveSectionIndex(si - 1); }}>▲</span>}
                  {si < sections.length - 1 && <span title="Move down" style={{ cursor: "pointer", opacity: 0.8 }}
                    onClick={e => { e.stopPropagation(); moveSection(si, si + 1); setActiveSectionIndex(si + 1); }}>▼</span>}
                </span>
              </div>
              <div style={S.sectionMeta}>
                {countSectionWords(section).toLocaleString()}w · {countKCsInSection(section)} KCs · {section.contentBlocks?.length || 0} blocks
              </div>
            </button>
          </div>
        ))}

        <button style={S.addSectionBtn} onClick={() => {
          addSection(`Section ${sections.length + 1}`);
          setActiveSectionIndex(sections.length);
        }}>+ Add Section</button>
      </div>

      {/* ── Canvas ── */}
      <div style={S.canvas}>
        {activeSection && (
          <>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <input
                style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.navy, background: "transparent", border: "none", borderBottom: `2px solid ${C.border}`, borderRadius: 0, padding: "6px 0", outline: "none" }}
                value={activeSection.title || ""}
                onChange={e => setSectionTitle(activeSectionIndex, e.target.value)}
                placeholder="Section title..."
              />
              <span style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" }}>
                {countSectionWords(activeSection).toLocaleString()} words
              </span>
              {sections.length > 1 && (
                <button style={S.btn(true)} title="Delete section" onClick={() => {
                  if (!confirm(`Delete "${activeSection.title || "this section"}" and all its blocks?`)) return;
                  removeSection(activeSectionIndex);
                  setActiveSectionIndex(Math.max(0, activeSectionIndex - 1));
                }}>🗑</button>
              )}
            </div>

            {/* Add at top */}
            <div style={{ marginBottom: 10 }}>
              <button style={S.addBlockBtn} onClick={() => setShowBlockMenu(showBlockMenu === "top" ? null : "top")}>+ Add Block at Top</button>
              {showBlockMenu === "top" && <BlockPicker onPick={type => { addBlock(activeSectionIndex, type, -1); setShowBlockMenu(null); }} onClose={() => setShowBlockMenu(null)} />}
            </div>

            {/* Sortable blocks */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={(activeSection.contentBlocks || []).map((b, i) => b._tempId || String(i))}
                strategy={verticalListSortingStrategy}
              >
                {(activeSection.contentBlocks || []).map((block, bi) => (
                  <SortableBlockCard
                    key={block._tempId || bi}
                    id={block._tempId || String(bi)}
                    block={block}
                    blockIndex={bi}
                    sectionIndex={activeSectionIndex}
                    editingBlockIndex={editingBlockIndex}
                    setEditingBlockIndex={setEditingBlockIndex}
                    onUpdate={updates => updateBlock(activeSectionIndex, bi, updates)}
                    onRemove={() => { removeBlock(activeSectionIndex, bi); if (editingBlockIndex === bi) setEditingBlockIndex(null); }}
                    onDuplicate={() => duplicateBlock(activeSectionIndex, bi)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Empty state */}
            {(activeSection.contentBlocks || []).length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: C.textMuted, border: `2px dashed ${C.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No content blocks yet</p>
                <p style={{ fontSize: 12 }}>Use "+ Add Block at Top" to start building this section.</p>
              </div>
            )}

            {/* Add at bottom */}
            {(activeSection.contentBlocks || []).length > 0 && (
              <div style={{ marginTop: 10 }}>
                <button style={S.addBlockBtn} onClick={() => setShowBlockMenu(showBlockMenu === "bottom" ? null : "bottom")}>+ Add Block at Bottom</button>
                {showBlockMenu === "bottom" && <BlockPicker
                  onPick={type => { addBlock(activeSectionIndex, type, (activeSection.contentBlocks?.length ?? 0) - 1); setShowBlockMenu(null); }}
                  onClose={() => setShowBlockMenu(null)}
                />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
