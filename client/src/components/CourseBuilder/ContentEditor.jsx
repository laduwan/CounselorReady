// DROP INTO: client/src/components/CourseBuilder/ContentEditor.jsx
import { useState, useCallback } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
  ArrowUp, ArrowDown, Copy, Eye, EyeOff
} from "lucide-react";
import { C, BLOCK_TYPES, BLOCK_DEFAULTS, KNOWLEDGE_CHECK_TYPES, ENGAGEMENT_TYPES, CONTENT_TYPES } from "./constants";
import { S } from "./styles";
import { uid, countBlockWords } from "./utils";
import BlockEditor from "./BlockEditor";
import BlockPicker from "./BlockPicker";
import BlockPreview from "./BlockPreview";
import InsertBar from "./InsertBar";

function ContentEditor({ courseData, setCourseData }) {
  const [activeModule, setActiveModule] = useState(0);
  const [showBlockMenu, setShowBlockMenu] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  const modules = courseData?.modules || [];
  const currentModule = modules[activeModule] || { blocks: [], title: "No modules" };

  const updateBlock = (blockIndex, updates) => {
    const newModules = [...modules];
    const newBlocks = [...(newModules[activeModule].blocks || [])];
    newBlocks[blockIndex] = { ...newBlocks[blockIndex], ...updates };
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
  };

  const addBlock = (type, afterIndex) => {
    const newModules = [...modules];
    const newBlocks = [...(newModules[activeModule].blocks || [])];
    const newBlock = { id: uid(), type, ...(BLOCK_DEFAULTS[type] || {}) };
    if (afterIndex === -1) newBlocks.unshift(newBlock);
    else newBlocks.splice(afterIndex + 1, 0, newBlock);
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
    setShowBlockMenu(null);
    setEditingBlock(newBlocks.indexOf(newBlock));
  };

  const removeBlock = (blockIndex) => {
    const newModules = [...modules];
    const newBlocks = [...(newModules[activeModule].blocks || [])];
    newBlocks.splice(blockIndex, 1);
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
    if (editingBlock === blockIndex) setEditingBlock(null);
  };

  const moveBlock = (from, to) => {
    if (to < 0 || to >= currentModule.blocks.length) return;
    const newModules = [...modules];
    const newBlocks = [...(newModules[activeModule].blocks || [])];
    const [moved] = newBlocks.splice(from, 1);
    newBlocks.splice(to, 0, moved);
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
    if (editingBlock === from) setEditingBlock(to);
  };

  const duplicateBlock = (blockIndex) => {
    const newModules = [...modules];
    const newBlocks = [...(newModules[activeModule].blocks || [])];
    const clone = { ...JSON.parse(JSON.stringify(newBlocks[blockIndex])), id: uid() };
    newBlocks.splice(blockIndex + 1, 0, clone);
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
    setEditingBlock(blockIndex + 1);
  };

  const blockConfig = (type) => BLOCK_TYPES.find(b => b.type === type) || { label: type, icon: "?", color: C.textMuted, category: "content" };

  const getModuleStats = (mod) => {
    const blocks = mod.blocks || [];
    return {
      blocks: blocks.length,
      kc: blocks.filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length,
      words: blocks.reduce((s, b) => s + countBlockWords(b), 0),
    };
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
      {/* Module Sidebar */}
      <div>
        <div style={{ ...S.card, position: "sticky", top: 20 }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>MODULES</span>
            <span style={{ fontSize: 11, color: C.textLight }}>{modules.length}</span>
          </div>
          {modules.map((mod, i) => {
            const stats = getModuleStats(mod);
            return (
              <div key={mod.id || i} onClick={() => { setActiveModule(i); setEditingBlock(null); }}
                style={{ padding: "10px 14px", cursor: "pointer", borderLeft: i === activeModule ? `3px solid ${C.burgundy}` : "3px solid transparent", background: i === activeModule ? C.burgundyFaded : "transparent", transition: "all 0.2s" }}>
                <div style={{ fontSize: 13, fontWeight: i === activeModule ? 600 : 400, color: i === activeModule ? C.burgundy : C.textMuted }}>
                  {mod.title?.replace(/^Module \d+:\s*/, "") || `Module ${i + 1}`}
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 10, color: C.textLight, marginTop: 3 }}>
                  <span>{stats.blocks} blocks</span>
                  <span style={{ color: stats.kc >= 2 ? C.green : C.danger }}>{stats.kc} KC</span>
                  <span>{stats.words.toLocaleString()}w</span>
                </div>
              </div>
            );
          })}
          <div style={{ padding: 10 }}>
            <button style={{ ...S.btnSecondary, width: "100%", justifyContent: "center", fontSize: 12, padding: "8px 12px" }} onClick={() => {
              const n = modules.length + 1;
              setCourseData({ ...courseData, modules: [...modules, { id: uid(), number: n, title: `Module ${n}: New Module`, blocks: [], knowledgeChecks: 3 }] });
              setActiveModule(modules.length);
            }}>+ Add Module</button>
          </div>
        </div>
      </div>

      {/* Block Canvas */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>{currentModule.title}</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(p => !p)}
              style={{
                ...S.btnSecondary,
                fontSize: 12, padding: "6px 12px",
                background: showPreview ? C.greenFaded : "transparent",
                borderColor: showPreview ? C.green : C.border,
                color: showPreview ? C.green : C.textMuted,
              }}
              title={showPreview ? "Hide student preview" : "Show student preview"}
            >
              {showPreview ? <Eye size={13} /> : <EyeOff size={13} />}
              {showPreview ? "Preview On" : "Preview Off"}
            </button>
            <span style={S.badge(C.green)}>{(currentModule.blocks || []).filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length} knowledge checks</span>
            <span style={{ fontSize: 13, color: C.textMuted }}>{(currentModule.blocks || []).length} blocks</span>
          </div>
        </div>

        {/* Callout syntax hint */}
        {showPreview && (
          <div style={{ marginBottom: 12, padding: "6px 12px", background: C.goldFaded, borderRadius: 8, border: `1px solid ${C.gold}`, fontSize: 11, color: "#92600A", display: "flex", alignItems: "center", gap: 6 }}>
            💡 <strong>Tip:</strong> Use <code style={{ background: "rgba(0,0,0,0.06)", padding: "0 4px", borderRadius: 3 }}>{"{{callout:hipaa}}"}</code> or <code style={{ background: "rgba(0,0,0,0.06)", padding: "0 4px", borderRadius: 3 }}>{"{{alert:ethics}}"}</code> in text blocks to add inline pills. Preview shows how students see them.
          </div>
        )}

        <InsertBar onInsert={() => setShowBlockMenu(-1)} active={showBlockMenu === -1} />
        {showBlockMenu === -1 && <BlockPicker onPick={(type) => addBlock(type, -1)} onClose={() => setShowBlockMenu(null)} />}

        {(currentModule.blocks || []).map((block, i) => {
          const cfg = blockConfig(block.type);
          const isEditing = editingBlock === i;
          const isKC = KNOWLEDGE_CHECK_TYPES.includes(block.type);
          const isEngagement = ENGAGEMENT_TYPES.includes(block.type);
          return (
            <div key={block.id}>
              <div style={{
                border: `1px solid ${isEditing ? C.burgundy : C.border}`, borderRadius: 10, marginBottom: 4, background: C.card,
                borderLeft: isKC ? `4px solid ${C.burgundy}` : isEngagement ? `4px solid #7C3AED` : undefined,
                boxShadow: isEditing ? `0 0 0 2px ${C.burgundy}22` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: isEditing ? `1px solid ${C.borderLight}` : "none", cursor: "pointer" }}
                  onClick={() => setEditingBlock(isEditing ? null : i)}>
                  <span style={{ cursor: "grab", color: C.textLight, fontSize: 12 }}>⠿</span>
                  <span style={{ width: 26, height: 26, borderRadius: 6, background: cfg.color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{cfg.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, flex: 1, color: C.navy }}>{cfg.label}</span>
                  {isKC && <span style={{ fontSize: 9, fontWeight: 700, color: C.burgundy, background: C.burgundyFaded, padding: "2px 6px", borderRadius: 4 }}>KC</span>}
                  <span style={{ fontSize: 11, color: C.textLight }}>{countBlockWords(block)}w</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i - 1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === 0 ? 0.3 : 1, fontSize: 12 }} title="Move up">▲</button>
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i + 1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === currentModule.blocks.length - 1 ? 0.3 : 1, fontSize: 12 }} title="Move down">▼</button>
                    <button onClick={(e) => { e.stopPropagation(); duplicateBlock(i); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, fontSize: 12, color: C.textMuted }} title="Duplicate">⧉</button>
                    <button onClick={(e) => { e.stopPropagation(); removeBlock(i); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, color: C.danger, fontSize: 12 }} title="Delete">✕</button>
                  </div>
                </div>
                {isEditing && (
                  <div style={{ display: showPreview ? "grid" : "block", gridTemplateColumns: showPreview ? "1fr 1fr" : "1fr", gap: 16, padding: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>✏️ Edit</div>
                      <BlockEditor block={block} onChange={(updates) => updateBlock(i, updates)} />
                    </div>
                    {showPreview && (
                      <div style={{ borderLeft: `1px solid ${C.borderLight}`, paddingLeft: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>👁 Student View</div>
                        <div style={{ background: "#FDFCFA", border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: 16 }}>
                          <BlockPreview block={block} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <InsertBar onInsert={() => setShowBlockMenu(i)} active={showBlockMenu === i} />
              {showBlockMenu === i && <BlockPicker onPick={(type) => addBlock(type, i)} onClose={() => setShowBlockMenu(null)} />}
            </div>
          );
        })}

        {(currentModule.blocks || []).length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted, border: `2px dashed ${C.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>No content blocks yet</p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>Choose from {BLOCK_TYPES.length} block types organized by Content, Knowledge Checks, and Engagement</p>
            <button style={S.btnPrimary} onClick={() => setShowBlockMenu(-1)}>+ Add First Block</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentEditor;
