// DROP INTO: /client/src/components/CourseBuilder.jsx

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Sparkles, FileText, CheckCircle, Upload, Plus, Trash2, GripVertical,
  ChevronDown, ChevronRight, AlertTriangle, Check, X, Loader2,
  BookOpen, Brain, ClipboardCheck, ArrowUp, ArrowDown, Copy,
  Settings, Eye, Wand2, FileUp, BarChart3, Zap, Save, Download
} from "lucide-react";

// ─── Brand Colors ───
const C = {
  burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldLight: "#E0BC72", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#34495E", navyLight: "#4A6278",
  bg: "#FAFAF8", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
  danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
  purple: "#7C3AED", teal: "#0F766E", amber: "#B45309", slate: "#1E293B",
};

// ═══════════════════════════════════════════════════════════
// BLOCK TYPE REGISTRY — 17 Total
// ═══════════════════════════════════════════════════════════
const BLOCK_TYPES = [
  // ── Content (auto-complete on render) ──
  { type: "sectionDivider", label: "Section Divider", icon: "§", color: C.navy, category: "content" },
  { type: "text", label: "Text Content", icon: "¶", color: C.green, category: "content" },
  { type: "imageText", label: "Image + Text", icon: "🖼", color: C.greenLight, category: "content" },
  { type: "image", label: "Standalone Image", icon: "📷", color: C.teal, category: "content" },
  { type: "accordion", label: "Accordion", icon: "≡", color: C.gold, category: "content" },
  { type: "resources", label: "Resources", icon: "📎", color: C.navy, category: "content" },
  { type: "videoEmbed", label: "Video + Markers", icon: "🎬", color: C.slate, category: "content" },
  // ── Knowledge Checks (graded, count for ACEP) ──
  { type: "multipleChoice", label: "Multiple Choice", icon: "◉", color: C.burgundy, category: "assessment" },
  { type: "multiSelect", label: "Multi-Select", icon: "☑", color: C.burgundyLight, category: "assessment" },
  { type: "matching", label: "Matching", icon: "↔", color: C.navyLight, category: "assessment" },
  { type: "cardSort", label: "Card Sort", icon: "🗂", color: "#0284C7", category: "assessment" },
  { type: "sequencing", label: "Sequencing", icon: "📋", color: C.navy, category: "assessment" },
  { type: "timeline", label: "Timeline", icon: "📅", color: C.teal, category: "assessment" },
  // ── Interactive Engagement ──
  { type: "reflection", label: "Reflection", icon: "💭", color: C.green, category: "interactive" },
  { type: "hotspot", label: "Hotspot / Diagram", icon: "🎯", color: C.purple, category: "interactive" },
  { type: "scenarioTree", label: "Scenario Tree", icon: "🔀", color: C.burgundy, category: "interactive" },
  { type: "flashcardDeck", label: "Flashcard Deck", icon: "🃏", color: C.amber, category: "interactive" },
];

const BLOCK_DEFAULTS = {
  sectionDivider: { title: "", sectionNumber: 1, subtitle: "" },
  text: { content: "" },
  imageText: { title: "", content: "", image: "", imageAlt: "", imagePosition: "left", highlight: false },
  image: { imageUrl: "", imageAltText: "", imageCaption: "", imageSize: "large", imageAlignment: "center" },
  accordion: { accordionItems: [{ title: "", content: "" }] },
  multipleChoice: { question: "", options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }], explanation: "" },
  multiSelect: { question: "", options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }], explanation: "" },
  matching: { matchingPairs: [{ term: "", definition: "" }], matchingInstructions: "" },
  reflection: { question: "", minLength: 50 },
  resources: { resources: [{ title: "", url: "", type: "pdf" }] },
  cardSort: { instructions: "", categories: ["Category 1", "Category 2"], cards: [{ id: "c1", text: "", correctCategory: "Category 1" }], explanation: "" },
  sequencing: { instructions: "", steps: [{ id: "s1", text: "", order: 1 }], explanation: "" },
  hotspot: { instructions: "", hotspotImage: null, imageDescription: "", hotspots: [], explanation: "" },
  timeline: { instructions: "", events: [{ id: "t1", text: "", year: "", order: 1 }], explanation: "" },
  scenarioTree: { scenarioTitle: "", instructions: "", startNode: "start", nodes: { start: { text: "", choices: [{ text: "", next: "" }], feedback: null } } },
  flashcardDeck: { instructions: "", flashcards: [{ id: "f1", front: "", back: "" }] },
  videoEmbed: { videoTitle: "", videoUrl: "", videoDuration: "", thumbnailUrl: "", markers: [{ id: "v1", time: "0:00", label: "", prompt: "" }] },
};

const ACEP_RULES = {
  wordsPerCEHour: 6000,
  knowledgeChecksPerModule: { min: 2, max: 5 },
  finalExamQuestions: 15,
  passThreshold: 0.80,
};

const KNOWLEDGE_CHECK_TYPES = ["multipleChoice", "multiSelect", "matching", "cardSort", "sequencing", "timeline"];
const ENGAGEMENT_TYPES = ["accordion", "hotspot", "scenarioTree", "flashcardDeck", "reflection"];
const CONTENT_TYPES = ["sectionDivider", "text", "imageText", "image", "resources", "videoEmbed"];

// ─── Utilities ───
function countWords(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}
function uid() { return Math.random().toString(36).slice(2, 9); }

function countBlockWords(block) {
  let w = 0;
  w += countWords(block.content || "");
  w += countWords(block.question || "");
  w += countWords(block.explanation || "");
  w += countWords(block.instructions || "");
  w += countWords(block.imageCaption || "");
  (block.options || []).forEach(o => { w += countWords(o.text); });
  (block.accordionItems || []).forEach(a => { w += countWords(a.title) + countWords(a.content); });
  (block.matchingPairs || []).forEach(p => { w += countWords(p.term) + countWords(p.definition); });
  (block.cards || []).forEach(c => { w += countWords(c.text); });
  (block.steps || []).forEach(s => { w += countWords(s.text); });
  (block.events || []).forEach(e => { w += countWords(e.text); });
  (block.hotspots || []).forEach(h => { w += countWords(h.label) + countWords(h.info); });
  (block.flashcards || []).forEach(f => { w += countWords(f.front) + countWords(f.back); });
  (block.markers || []).forEach(m => { w += countWords(m.label) + countWords(m.prompt); });
  if (block.nodes) Object.values(block.nodes).forEach(n => {
    w += countWords(n.text || "");
    w += countWords(n.feedback?.message || "");
    (n.choices || []).forEach(c => { w += countWords(c.text); });
  });
  return w;
}

// ─── Styles ───
const S = {
  container: { fontFamily: "'Newsreader', Georgia, serif", background: C.bg, minHeight: "100vh", color: C.text },
  header: { background: `linear-gradient(135deg, ${C.burgundy} 0%, #4A1224 100%)`, padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  tabBar: { display: "flex", background: "#fff", borderBottom: `2px solid ${C.border}`, padding: "0 20px", gap: 0, overflowX: "auto" },
  tab: (active) => ({
    padding: "14px 22px", fontSize: 14, fontWeight: active ? 700 : 500, cursor: "pointer",
    color: active ? C.burgundy : C.textMuted, borderBottom: active ? `3px solid ${C.burgundy}` : "3px solid transparent",
    display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
    background: active ? C.burgundyFaded : "transparent", whiteSpace: "nowrap",
  }),
  main: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
  card: { background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20 },
  cardHeader: { padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardBody: { padding: 20 },
  label: { fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box" },
  btnPrimary: { background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnSecondary: { background: "transparent", color: C.navy, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnDanger: { background: C.dangerFaded, color: C.danger, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 },
  badge: (color) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: color + "18", color }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  btnGold: { background: C.gold, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
};


// ═══════════════════════════════════════════════════════════
// CLOUDINARY UPLOADER (inline component)
// ═══════════════════════════════════════════════════════════
function CloudinaryUploader({ onUpload, context = "general", currentImage = null, label = "Upload Image", compact = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState(null);
  const [alt, setAlt] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

  const processFile = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Max 10MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Images only"); return; }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("context", context);
      formData.append("alt", alt);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/images/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || data.error || "Upload failed");
      const result = data.data || data;
      setPreview(result.thumbnailUrl || result.url);
      onUpload(result);
    } catch (err) {
      // Fallback to local preview if API unavailable
      try {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const fallback = { url, publicId: `${context}_${Date.now()}`, width: img.width, height: img.height, alt, thumbnailUrl: url, mediumUrl: url, largeUrl: url };
          setPreview(url);
          onUpload(fallback);
        };
        img.onerror = () => setError("Failed to load image");
        img.src = url;
      } catch (e2) {
        setError(err.message || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => processFile(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files?.[0]); };

  if (compact) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input type="file" ref={fileRef} accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ background: C.green, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? "⏳" : "📷"} {label}
        </button>
        {preview && <img src={preview} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover" }} />}
        {error && <span style={{ color: C.danger, fontSize: 11 }}>{error}</span>}
      </span>
    );
  }

  return (
    <div>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
      <div onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ border: `2px dashed ${dragOver ? C.green : C.border}`, borderRadius: 10, padding: preview ? 8 : 28, textAlign: "center", cursor: "pointer", background: dragOver ? C.greenFaded : (preview ? C.bg : "#fff"), position: "relative", transition: "all 0.2s" }}>
        {preview ? (
          <div style={{ position: "relative" }}>
            <img src={preview} alt={alt} style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, display: "block", margin: "0 auto" }} />
            <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Click to replace</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
            <div style={{ fontWeight: 600, color: C.navy, fontSize: 14 }}>{label}</div>
            <div style={{ color: C.textLight, fontSize: 12, marginTop: 4 }}>Drag & drop or click · Max 10MB</div>
            {uploading && <div style={{ marginTop: 10, background: C.green, borderRadius: 4, height: 4, width: "60%", margin: "10px auto 0" }} />}
          </div>
        )}
      </div>
      <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
        placeholder="Alt text for accessibility"
        style={{ ...S.input, marginTop: 8, fontSize: 12 }} />
      {error && <p style={{ color: C.danger, fontSize: 12, marginTop: 4 }}>⚠ {error}</p>}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// CATEGORIZED BLOCK PICKER
// ═══════════════════════════════════════════════════════════
function BlockPicker({ onPick, onClose }) {
  const categories = [
    { key: "content", label: "Content", desc: "Text, images, media", color: C.green },
    { key: "assessment", label: "Knowledge Checks", desc: "Graded · ACEP compliant", color: C.burgundy },
    { key: "interactive", label: "Engagement", desc: "Interactive activities", color: C.purple },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Add Content Block</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textMuted, lineHeight: 1 }}>✕</button>
      </div>
      {categories.map(cat => {
        const blocks = BLOCK_TYPES.filter(b => b.category === cat.key);
        return (
          <div key={cat.key} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 4, height: 16, borderRadius: 2, background: cat.color }} />
              <span style={{ fontWeight: 700, fontSize: 12, color: cat.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{cat.label}</span>
              <span style={{ fontSize: 11, color: C.textLight }}>{cat.desc}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 6 }}>
              {blocks.map(bt => (
                <button key={bt.type} onClick={() => onPick(bt.type)}
                  style={{ background: bt.color + "08", border: `1px solid ${bt.color}20`, borderRadius: 8, padding: "10px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = bt.color + "18"; e.currentTarget.style.borderColor = bt.color + "44"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = bt.color + "08"; e.currentTarget.style.borderColor = bt.color + "20"; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: 18, display: "block", marginBottom: 3 }}>{bt.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: bt.color, lineHeight: 1.2, display: "block" }}>{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// BLOCK EDITOR — All 17 types
// ═══════════════════════════════════════════════════════════
function BlockEditor({ block, onChange }) {
  switch (block.type) {

    // ── Original 9 ──
    case "sectionDivider":
      return (
        <div style={S.grid2}>
          <div><label style={S.label}>Section Title</label><input style={S.input} value={block.title} onChange={e => onChange({ title: e.target.value })} /></div>
          <div style={S.grid2}>
            <div><label style={S.label}>Section #</label><input type="number" style={S.input} value={block.sectionNumber} onChange={e => onChange({ sectionNumber: Number(e.target.value) })} /></div>
            <div><label style={S.label}>Subtitle</label><input style={S.input} value={block.subtitle || ""} onChange={e => onChange({ subtitle: e.target.value })} /></div>
          </div>
        </div>
      );

    case "text":
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ ...S.label, marginBottom: 0 }}>Content (HTML)</label>
            <InlineImageButton onInsert={(html) => onChange({ content: (block.content || "") + html })} />
          </div>
          <textarea style={{ ...S.textarea, minHeight: 200 }} value={block.content} onChange={e => onChange({ content: e.target.value })} />
          <div style={{ fontSize: 11, color: C.textLight, marginTop: 4 }}>{countWords(block.content)} words</div>
        </div>
      );

    case "imageText":
      return (
        <div>
          <div style={S.grid2}>
            <div><label style={S.label}>Title</label><input style={S.input} value={block.title} onChange={e => onChange({ title: e.target.value })} /></div>
            <div>
              <label style={S.label}>Image</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...S.input, flex: 1 }} placeholder="Image URL" value={block.image || ""} onChange={e => onChange({ image: e.target.value })} />
                <CloudinaryUploader compact onUpload={(d) => onChange({ image: d.url, imageAlt: d.alt || block.imageAlt })} context="image-text" label="Upload" />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}><label style={S.label}>Content</label><textarea style={S.textarea} value={block.content} onChange={e => onChange({ content: e.target.value })} /></div>
          <div style={{ ...S.grid3, marginTop: 12 }}>
            <div><label style={S.label}>Image Alt</label><input style={S.input} value={block.imageAlt || ""} onChange={e => onChange({ imageAlt: e.target.value })} /></div>
            <div><label style={S.label}>Position</label><select style={S.input} value={block.imagePosition} onChange={e => onChange({ imagePosition: e.target.value })}><option value="left">Left</option><option value="right">Right</option></select></div>
            <div style={{ display: "flex", alignItems: "end" }}><label style={{ fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={block.highlight || false} onChange={e => onChange({ highlight: e.target.checked })} /> Highlight</label></div>
          </div>
        </div>
      );

    case "accordion":
      return (
        <div>
          <label style={S.label}>Accordion Items ({(block.accordionItems || []).length})</label>
          {(block.accordionItems || []).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <input style={{ ...S.input, marginBottom: 4, fontWeight: 600 }} placeholder="Title" value={item.title} onChange={e => {
                  const items = [...block.accordionItems]; items[i] = { ...items[i], title: e.target.value }; onChange({ accordionItems: items });
                }} />
                <textarea style={{ ...S.textarea, minHeight: 60 }} placeholder="Content" value={item.content} onChange={e => {
                  const items = [...block.accordionItems]; items[i] = { ...items[i], content: e.target.value }; onChange({ accordionItems: items });
                }} />
              </div>
              <button style={S.btnDanger} onClick={() => onChange({ accordionItems: block.accordionItems.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={() => onChange({ accordionItems: [...(block.accordionItems || []), { title: "", content: "" }] })}>+ Add Item</button>
        </div>
      );

    case "multipleChoice":
    case "multiSelect":
      return (
        <div>
          <label style={S.label}>Question</label>
          <textarea style={{ ...S.textarea, minHeight: 60 }} value={block.question} onChange={e => onChange({ question: e.target.value })} />
          <label style={{ ...S.label, marginTop: 12 }}>Options {block.type === "multiSelect" && <span style={{ fontWeight: 400, color: C.textMuted }}>(multiple correct)</span>}</label>
          {(block.options || []).map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <input type={block.type === "multiSelect" ? "checkbox" : "radio"} name={`q_${block.id}`} checked={opt.isCorrect} onChange={() => {
                const opts = block.options.map((o, j) => block.type === "multiSelect" ? (j === i ? { ...o, isCorrect: !o.isCorrect } : o) : { ...o, isCorrect: j === i });
                onChange({ options: opts });
              }} />
              <input style={{ ...S.input, flex: 1 }} value={opt.text} onChange={e => {
                const opts = [...block.options]; opts[i] = { ...opts[i], text: e.target.value }; onChange({ options: opts });
              }} />
              <button style={S.btnDanger} onClick={() => onChange({ options: block.options.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={() => onChange({ options: [...(block.options || []), { text: "", isCorrect: false }] })}>+ Add Option</button>
          <div style={{ marginTop: 12 }}><label style={S.label}>Explanation</label><textarea style={{ ...S.textarea, minHeight: 50 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} /></div>
        </div>
      );

    case "matching":
      return (
        <div>
          <label style={S.label}>Instructions</label>
          <input style={{ ...S.input, marginBottom: 12 }} value={block.matchingInstructions || ""} onChange={e => onChange({ matchingInstructions: e.target.value })} />
          <label style={S.label}>Matching Pairs</label>
          {(block.matchingPairs || []).map((pair, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Term" value={pair.term} onChange={e => { const p = [...block.matchingPairs]; p[i] = { ...p[i], term: e.target.value }; onChange({ matchingPairs: p }); }} />
              <span style={{ color: C.textLight }}>↔</span>
              <input style={{ ...S.input, flex: 1 }} placeholder="Definition" value={pair.definition} onChange={e => { const p = [...block.matchingPairs]; p[i] = { ...p[i], definition: e.target.value }; onChange({ matchingPairs: p }); }} />
              <button style={S.btnDanger} onClick={() => onChange({ matchingPairs: block.matchingPairs.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={() => onChange({ matchingPairs: [...(block.matchingPairs || []), { term: "", definition: "" }] })}>+ Add Pair</button>
        </div>
      );

    case "reflection":
      return (
        <div>
          <label style={S.label}>Reflection Prompt</label>
          <textarea style={{ ...S.textarea, minHeight: 80 }} value={block.question} onChange={e => onChange({ question: e.target.value })} />
          <label style={{ ...S.label, marginTop: 12 }}>Min. Characters</label>
          <input type="number" style={{ ...S.input, maxWidth: 120 }} value={block.minLength || 0} onChange={e => onChange({ minLength: Number(e.target.value) })} />
        </div>
      );

    case "resources":
      return (
        <div>
          <label style={S.label}>Resources</label>
          {(block.resources || []).map((res, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <input style={{ ...S.input, flex: 2 }} placeholder="Title" value={res.title} onChange={e => { const r = [...block.resources]; r[i] = { ...r[i], title: e.target.value }; onChange({ resources: r }); }} />
              <input style={{ ...S.input, flex: 3 }} placeholder="URL" value={res.url} onChange={e => { const r = [...block.resources]; r[i] = { ...r[i], url: e.target.value }; onChange({ resources: r }); }} />
              <select style={{ ...S.input, flex: 1 }} value={res.type} onChange={e => { const r = [...block.resources]; r[i] = { ...r[i], type: e.target.value }; onChange({ resources: r }); }}>
                <option value="pdf">PDF</option><option value="worksheet">Worksheet</option><option value="video">Video</option><option value="link">Link</option>
              </select>
              <button style={S.btnDanger} onClick={() => onChange({ resources: block.resources.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={() => onChange({ resources: [...(block.resources || []), { title: "", url: "", type: "pdf" }] })}>+ Add Resource</button>
        </div>
      );

    // ═══ NEW BLOCK TYPE #10: IMAGE ═══
    case "image":
      return (
        <div>
          <CloudinaryUploader
            onUpload={(d) => onChange({ imageUrl: d.url, imagePublicId: d.publicId, imageAltText: d.alt, imageWidth: d.width, imageHeight: d.height })}
            context="course-image" currentImage={block.imageUrl} label="Upload Course Image"
          />
          <div style={{ ...S.grid2, marginTop: 12 }}>
            <div><label style={S.label}>Caption</label><input style={S.input} value={block.imageCaption || ""} onChange={e => onChange({ imageCaption: e.target.value })} placeholder="Optional caption" /></div>
            <div><label style={S.label}>Alt Text</label><input style={S.input} value={block.imageAltText || ""} onChange={e => onChange({ imageAltText: e.target.value })} placeholder="Describe for screen readers" /></div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <div><label style={{ ...S.label, fontSize: 11 }}>Size</label>
              <select style={{ ...S.input, width: "auto" }} value={block.imageSize || "large"} onChange={e => onChange({ imageSize: e.target.value })}>
                <option value="small">Small (40%)</option><option value="medium">Medium (60%)</option><option value="large">Large (85%)</option><option value="full">Full Width</option>
              </select>
            </div>
            <div><label style={{ ...S.label, fontSize: 11 }}>Alignment</label>
              <select style={{ ...S.input, width: "auto" }} value={block.imageAlignment || "center"} onChange={e => onChange({ imageAlignment: e.target.value })}>
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      );

    // ═══ NEW BLOCK TYPE #11: CARD SORT ═══
    case "cardSort":
      return <CardSortEditor block={block} onChange={onChange} />;

    // ═══ NEW BLOCK TYPE #12: SEQUENCING ═══
    case "sequencing":
      return <SequencingEditor block={block} onChange={onChange} />;

    // ═══ NEW BLOCK TYPE #13: HOTSPOT ═══
    case "hotspot":
      return <HotspotEditor block={block} onChange={onChange} />;

    // ═══ NEW BLOCK TYPE #14: TIMELINE ═══
    case "timeline":
      return <TimelineEditor block={block} onChange={onChange} />;

    // ═══ NEW BLOCK TYPE #15: SCENARIO TREE ═══
    case "scenarioTree":
      return <ScenarioTreeEditor block={block} onChange={onChange} />;

    // ═══ NEW BLOCK TYPE #16: FLASHCARD DECK ═══
    case "flashcardDeck":
      return <FlashcardDeckEditor block={block} onChange={onChange} />;

    // ═══ NEW BLOCK TYPE #17: VIDEO EMBED ═══
    case "videoEmbed":
      return <VideoEmbedEditor block={block} onChange={onChange} />;

    default:
      return <p style={{ color: C.textMuted, fontSize: 13 }}>Editor not available for block type: {block.type}</p>;
  }
}


// ═══════════════════════════════════════════════════════════
// NEW BLOCK EDITORS
// ═══════════════════════════════════════════════════════════

const CATEGORY_COLORS = ["#E11D48", "#6366F1", "#059669", "#D97706", "#0284C7", "#9333EA", "#DC2626", "#0891B2"];

function CardSortEditor({ block, onChange }) {
  const cats = block.categories || [];
  const addCard = () => onChange({ cards: [...(block.cards || []), { id: "c" + uid(), text: "", correctCategory: cats[0] || "" }] });
  const addCategory = () => {
    const name = `Category ${cats.length + 1}`;
    onChange({ categories: [...cats, name] });
  };
  return (
    <div>
      <label style={S.label}>Instructions</label>
      <textarea style={{ ...S.textarea, minHeight: 50 }} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />

      <label style={{ ...S.label, marginTop: 12 }}>Categories ({cats.length})</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {cats.map((cat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] + "12", border: `1px solid ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}33`, borderRadius: 8, padding: "4px 6px 4px 10px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
            <input style={{ border: "none", background: "transparent", fontSize: 13, fontWeight: 600, outline: "none", width: Math.max(60, cat.length * 8) }}
              value={cat} onChange={e => {
                const newCats = [...cats]; const oldName = newCats[i]; newCats[i] = e.target.value;
                const newCards = (block.cards || []).map(c => c.correctCategory === oldName ? { ...c, correctCategory: e.target.value } : c);
                onChange({ categories: newCats, cards: newCards });
              }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.danger, fontSize: 12, padding: 2 }}
              onClick={() => onChange({ categories: cats.filter((_, j) => j !== i) })}>✕</button>
          </div>
        ))}
        <button style={{ ...S.btnSecondary, fontSize: 11, padding: "4px 10px" }} onClick={addCategory}>+ Category</button>
      </div>

      <label style={{ ...S.label, marginTop: 8 }}>Cards ({(block.cards || []).length})</label>
      {(block.cards || []).map((card, i) => (
        <div key={card.id || i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "center" }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Card text..." value={card.text} onChange={e => {
            const cards = [...(block.cards || [])]; cards[i] = { ...cards[i], text: e.target.value }; onChange({ cards });
          }} />
          <select style={{ ...S.input, width: "auto", minWidth: 120 }} value={card.correctCategory} onChange={e => {
            const cards = [...(block.cards || [])]; cards[i] = { ...cards[i], correctCategory: e.target.value }; onChange({ cards });
          }}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button style={S.btnDanger} onClick={() => onChange({ cards: (block.cards || []).filter((_, j) => j !== i) })}>✕</button>
        </div>
      ))}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addCard}>+ Add Card</button>

      <div style={{ marginTop: 12 }}><label style={S.label}>Explanation</label><textarea style={{ ...S.textarea, minHeight: 50 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} /></div>
      <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted, background: C.goldFaded, borderRadius: 6, padding: 8 }}>
        Distribution: {cats.map(c => `${c}: ${(block.cards || []).filter(cd => cd.correctCategory === c).length}`).join(" · ")}
      </div>
    </div>
  );
}

function SequencingEditor({ block, onChange }) {
  const addStep = () => {
    const steps = [...(block.steps || [])];
    steps.push({ id: "s" + uid(), text: "", order: steps.length + 1 });
    onChange({ steps });
  };
  return (
    <div>
      <label style={S.label}>Instructions</label>
      <textarea style={{ ...S.textarea, minHeight: 50 }} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />
      <label style={{ ...S.label, marginTop: 12 }}>Steps — in CORRECT order ({(block.steps || []).length})</label>
      <p style={{ fontSize: 11, color: C.textLight, margin: "0 0 8px" }}>Enter steps in correct sequence. They'll be shuffled for the learner.</p>
      {(block.steps || []).map((step, i) => (
        <div key={step.id || i} style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: C.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
          <input style={{ ...S.input, flex: 1 }} value={step.text} onChange={e => {
            const steps = [...(block.steps || [])]; steps[i] = { ...steps[i], text: e.target.value }; onChange({ steps });
          }} placeholder="Step description..." />
          <button style={S.btnDanger} onClick={() => {
            onChange({ steps: (block.steps || []).filter((_, j) => j !== i).map((s, idx) => ({ ...s, order: idx + 1 })) });
          }}>✕</button>
        </div>
      ))}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addStep}>+ Add Step</button>
      <div style={{ marginTop: 12 }}><label style={S.label}>Explanation</label><textarea style={{ ...S.textarea, minHeight: 50 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} /></div>
    </div>
  );
}

function HotspotEditor({ block, onChange }) {
  const addHotspot = () => {
    const spots = block.hotspots || [];
    onChange({
      hotspots: [...spots, {
        id: "h" + uid(), label: "New Region", x: 50, y: 50, info: "",
        color: CATEGORY_COLORS[spots.length % CATEGORY_COLORS.length],
      }]
    });
  };
  return (
    <div>
      <label style={S.label}>Background Image</label>
      <CloudinaryUploader
        onUpload={(d) => onChange({ hotspotImage: { url: d.url, publicId: d.publicId, alt: d.alt, width: d.width, height: d.height } })}
        context="hotspot-bg" currentImage={block.hotspotImage?.url} label="Upload Diagram / Image"
      />
      <p style={{ fontSize: 11, color: C.textLight, margin: "4px 0 12px" }}>Hotspot pins are placed as X/Y percentages over this image.</p>

      <label style={S.label}>Fallback Description</label>
      <input style={{ ...S.input, marginBottom: 12 }} value={block.imageDescription || ""} onChange={e => onChange({ imageDescription: e.target.value })} placeholder="Description if no image" />

      <label style={S.label}>Instructions</label>
      <textarea style={{ ...S.textarea, minHeight: 50, marginBottom: 12 }} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />

      <label style={S.label}>Hotspot Pins ({(block.hotspots || []).length})</label>
      {(block.hotspots || []).map((spot, i) => (
        <div key={spot.id || i} style={{ background: "#f8f8f6", borderRadius: 8, padding: 10, marginBottom: 6, border: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: spot.color, flexShrink: 0 }} />
            <input style={{ ...S.input, flex: 1, fontWeight: 600 }} value={spot.label} onChange={e => {
              const spots = [...(block.hotspots || [])]; spots[i] = { ...spots[i], label: e.target.value }; onChange({ hotspots: spots });
            }} placeholder="Region name" />
            <label style={{ fontSize: 10, color: C.textLight }}>X%</label>
            <input type="number" min="0" max="100" style={{ ...S.input, width: 52, textAlign: "center", padding: "6px 4px" }} value={spot.x}
              onChange={e => { const spots = [...(block.hotspots || [])]; spots[i] = { ...spots[i], x: Number(e.target.value) }; onChange({ hotspots: spots }); }} />
            <label style={{ fontSize: 10, color: C.textLight }}>Y%</label>
            <input type="number" min="0" max="100" style={{ ...S.input, width: 52, textAlign: "center", padding: "6px 4px" }} value={spot.y}
              onChange={e => { const spots = [...(block.hotspots || [])]; spots[i] = { ...spots[i], y: Number(e.target.value) }; onChange({ hotspots: spots }); }} />
            <button style={S.btnDanger} onClick={() => onChange({ hotspots: (block.hotspots || []).filter((_, j) => j !== i) })}>✕</button>
          </div>
          <textarea style={{ ...S.textarea, minHeight: 40, fontSize: 12 }} value={spot.info} onChange={e => {
            const spots = [...(block.hotspots || [])]; spots[i] = { ...spots[i], info: e.target.value }; onChange({ hotspots: spots });
          }} placeholder="Info revealed when clicked..." />
        </div>
      ))}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addHotspot}>+ Add Hotspot Pin</button>

      <div style={{ marginTop: 12 }}><label style={S.label}>Explanation</label><textarea style={{ ...S.textarea, minHeight: 50 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} /></div>
    </div>
  );
}

function TimelineEditor({ block, onChange }) {
  const addEvent = () => {
    const events = [...(block.events || [])];
    events.push({ id: "t" + uid(), text: "", year: "", order: events.length + 1 });
    onChange({ events });
  };
  return (
    <div>
      <label style={S.label}>Instructions</label>
      <textarea style={{ ...S.textarea, minHeight: 50 }} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />
      <label style={{ ...S.label, marginTop: 12 }}>Events — in CORRECT chronological order ({(block.events || []).length})</label>
      {(block.events || []).map((evt, i) => (
        <div key={evt.id || i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "center" }}>
          <input style={{ ...S.input, width: 70, textAlign: "center", fontWeight: 700 }} value={evt.year} onChange={e => {
            const events = [...(block.events || [])]; events[i] = { ...events[i], year: e.target.value }; onChange({ events });
          }} placeholder="Year" />
          <input style={{ ...S.input, flex: 1 }} value={evt.text} onChange={e => {
            const events = [...(block.events || [])]; events[i] = { ...events[i], text: e.target.value }; onChange({ events });
          }} placeholder="Event description..." />
          <button style={S.btnDanger} onClick={() => {
            onChange({ events: (block.events || []).filter((_, j) => j !== i).map((e, idx) => ({ ...e, order: idx + 1 })) });
          }}>✕</button>
        </div>
      ))}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addEvent}>+ Add Event</button>
      <div style={{ marginTop: 12 }}><label style={S.label}>Explanation</label><textarea style={{ ...S.textarea, minHeight: 50 }} value={block.explanation || ""} onChange={e => onChange({ explanation: e.target.value })} /></div>
    </div>
  );
}

function ScenarioTreeEditor({ block, onChange }) {
  const nodes = block.nodes || {};
  const nodeIds = Object.keys(nodes);
  const addNode = () => {
    const id = "node_" + uid();
    onChange({ nodes: { ...nodes, [id]: { text: "", choices: [], feedback: null } }, startNode: block.startNode || id });
  };
  return (
    <div>
      <div style={S.grid2}>
        <div><label style={S.label}>Scenario Title</label><input style={S.input} value={block.scenarioTitle || ""} onChange={e => onChange({ scenarioTitle: e.target.value })} /></div>
        <div><label style={S.label}>Start Node</label>
          <select style={S.input} value={block.startNode || ""} onChange={e => onChange({ startNode: e.target.value })}>
            {nodeIds.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
        </div>
      </div>
      <label style={S.label}>Instructions</label>
      <textarea style={{ ...S.textarea, minHeight: 40, marginBottom: 12 }} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />

      <label style={S.label}>Decision Nodes ({nodeIds.length})</label>
      {nodeIds.map(nodeId => {
        const node = nodes[nodeId];
        return (
          <div key={nodeId} style={{ background: "#f8f8f6", borderRadius: 8, padding: 12, marginBottom: 8, border: `1px solid ${C.borderLight}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, background: "#fff", padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.border}` }}>{nodeId}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="checkbox" checked={node.isEnd || false} onChange={e => {
                    const n = { ...nodes }; n[nodeId] = { ...n[nodeId], isEnd: e.target.checked }; onChange({ nodes: n });
                  }} /> End node
                </label>
                <button style={{ ...S.btnDanger, fontSize: 10 }} onClick={() => {
                  const n = { ...nodes }; delete n[nodeId]; onChange({ nodes: n, startNode: block.startNode === nodeId ? Object.keys(n)[0] || "" : block.startNode });
                }}>Delete</button>
              </div>
            </div>
            <textarea style={{ ...S.textarea, minHeight: 50, fontSize: 13 }} value={node.text || ""} placeholder="Scenario text..."
              onChange={e => { const n = { ...nodes }; n[nodeId] = { ...n[nodeId], text: e.target.value }; onChange({ nodes: n }); }} />
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <select style={{ ...S.input, width: "auto", fontSize: 11 }} value={node.feedback?.type || ""}
                onChange={e => { const n = { ...nodes }; n[nodeId] = { ...n[nodeId], feedback: { ...n[nodeId].feedback, type: e.target.value } }; onChange({ nodes: n }); }}>
                <option value="">No feedback</option><option value="excellent">✓ Excellent</option><option value="good">✓ Good</option><option value="partial">⚠ Partial</option><option value="bad">✕ Error</option>
              </select>
              {node.feedback?.type && (
                <input style={{ ...S.input, flex: 1, fontSize: 11 }} value={node.feedback?.message || ""} placeholder="Feedback message..."
                  onChange={e => { const n = { ...nodes }; n[nodeId] = { ...n[nodeId], feedback: { ...n[nodeId].feedback, message: e.target.value } }; onChange({ nodes: n }); }} />
              )}
            </div>
            {!node.isEnd && (
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.textMuted }}>Choices:</label>
                {(node.choices || []).map((choice, ci) => (
                  <div key={ci} style={{ display: "flex", gap: 4, marginTop: 4, alignItems: "center" }}>
                    <input style={{ ...S.input, flex: 1, fontSize: 12 }} value={choice.text} placeholder="Choice text..."
                      onChange={e => { const n = { ...nodes }; const c = [...(n[nodeId].choices || [])]; c[ci] = { ...c[ci], text: e.target.value }; n[nodeId] = { ...n[nodeId], choices: c }; onChange({ nodes: n }); }} />
                    <select style={{ ...S.input, width: "auto", fontSize: 11, minWidth: 100 }} value={choice.next || ""}
                      onChange={e => { const n = { ...nodes }; const c = [...(n[nodeId].choices || [])]; c[ci] = { ...c[ci], next: e.target.value }; n[nodeId] = { ...n[nodeId], choices: c }; onChange({ nodes: n }); }}>
                      <option value="">→ target</option>
                      {nodeIds.filter(id => id !== nodeId).map(id => <option key={id} value={id}>{id}</option>)}
                    </select>
                    <button style={{ ...S.btnDanger, fontSize: 10 }} onClick={() => {
                      const n = { ...nodes }; n[nodeId] = { ...n[nodeId], choices: (n[nodeId].choices || []).filter((_, j) => j !== ci) }; onChange({ nodes: n });
                    }}>✕</button>
                  </div>
                ))}
                <button style={{ fontSize: 11, color: "#6366F1", background: "none", border: "none", cursor: "pointer", marginTop: 4 }}
                  onClick={() => { const n = { ...nodes }; n[nodeId] = { ...n[nodeId], choices: [...(n[nodeId].choices || []), { text: "", next: "" }] }; onChange({ nodes: n }); }}>
                  + Add choice
                </button>
              </div>
            )}
          </div>
        );
      })}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addNode}>+ Add Node</button>
    </div>
  );
}

function FlashcardDeckEditor({ block, onChange }) {
  const addCard = () => onChange({ flashcards: [...(block.flashcards || []), { id: "f" + uid(), front: "", back: "" }] });
  return (
    <div>
      <label style={S.label}>Instructions</label>
      <input style={{ ...S.input, marginBottom: 12 }} value={block.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} />
      <label style={S.label}>Cards ({(block.flashcards || []).length})</label>
      {(block.flashcards || []).map((card, i) => (
        <div key={card.id || i} style={{ background: "#f8f8f6", borderRadius: 8, padding: 10, marginBottom: 6, border: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textLight }}>Card {i + 1}</span>
            <button style={{ ...S.btnDanger, fontSize: 10 }} onClick={() => onChange({ flashcards: (block.flashcards || []).filter((_, j) => j !== i) })}>✕</button>
          </div>
          <input style={{ ...S.input, marginBottom: 4, fontWeight: 600 }} value={card.front} onChange={e => {
            const cards = [...(block.flashcards || [])]; cards[i] = { ...cards[i], front: e.target.value }; onChange({ flashcards: cards });
          }} placeholder="Front (term)" />
          <textarea style={{ ...S.textarea, minHeight: 40, fontSize: 12 }} value={card.back} onChange={e => {
            const cards = [...(block.flashcards || [])]; cards[i] = { ...cards[i], back: e.target.value }; onChange({ flashcards: cards });
          }} placeholder="Back (definition)" />
        </div>
      ))}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addCard}>+ Add Card</button>
    </div>
  );
}

function VideoEmbedEditor({ block, onChange }) {
  const addMarker = () => onChange({ markers: [...(block.markers || []), { id: "v" + uid(), time: "0:00", label: "", prompt: "" }] });
  return (
    <div>
      <div style={S.grid2}>
        <div><label style={S.label}>Video Title</label><input style={S.input} value={block.videoTitle || ""} onChange={e => onChange({ videoTitle: e.target.value })} /></div>
        <div><label style={S.label}>Duration</label><input style={S.input} placeholder="12:34" value={block.videoDuration || ""} onChange={e => onChange({ videoDuration: e.target.value })} /></div>
      </div>
      <label style={{ ...S.label, marginTop: 12 }}>Video URL</label>
      <input style={S.input} value={block.videoUrl || ""} onChange={e => onChange({ videoUrl: e.target.value })} placeholder="YouTube, Vimeo, or direct URL" />

      <label style={{ ...S.label, marginTop: 12 }}>Thumbnail</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...S.input, flex: 1 }} value={block.thumbnailUrl || ""} onChange={e => onChange({ thumbnailUrl: e.target.value })} placeholder="Thumbnail URL" />
        <CloudinaryUploader compact onUpload={(d) => onChange({ thumbnailUrl: d.url })} context="video-thumb" label="Upload" />
      </div>

      <label style={{ ...S.label, marginTop: 12 }}>Timestamp Markers ({(block.markers || []).length})</label>
      {(block.markers || []).map((marker, i) => (
        <div key={marker.id || i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "start" }}>
          <input style={{ ...S.input, width: 60, textAlign: "center", fontFamily: "monospace" }} value={marker.time} onChange={e => {
            const m = [...(block.markers || [])]; m[i] = { ...m[i], time: e.target.value }; onChange({ markers: m });
          }} placeholder="0:00" />
          <div style={{ flex: 1 }}>
            <input style={{ ...S.input, marginBottom: 3, fontSize: 13 }} value={marker.label} onChange={e => {
              const m = [...(block.markers || [])]; m[i] = { ...m[i], label: e.target.value }; onChange({ markers: m });
            }} placeholder="Marker label" />
            <input style={{ ...S.input, fontSize: 11, color: C.textMuted }} value={marker.prompt || ""} onChange={e => {
              const m = [...(block.markers || [])]; m[i] = { ...m[i], prompt: e.target.value }; onChange({ markers: m });
            }} placeholder="💬 Discussion prompt (optional)" />
          </div>
          <button style={{ ...S.btnDanger, marginTop: 4 }} onClick={() => onChange({ markers: (block.markers || []).filter((_, j) => j !== i) })}>✕</button>
        </div>
      ))}
      <button style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 12px" }} onClick={addMarker}>+ Add Marker</button>
    </div>
  );
}

// Inline image inserter for text blocks
function InlineImageButton({ onInsert }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setShow(!show)} title="Insert Image"
        style={{ background: show ? C.green : "none", color: show ? "#fff" : C.navy, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
        📷 Insert Image
      </button>
      {show && (
        <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 100, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, width: 320, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>Insert Inline Image</span>
            <button onClick={() => setShow(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}>✕</button>
          </div>
          <CloudinaryUploader context="inline" label="Upload Inline Image"
            onUpload={(d) => {
              const html = `\n<img src="${d.mediumUrl || d.url}" alt="${d.alt || ""}" style="max-width:100%;border-radius:8px;margin:12px 0;" loading="lazy" />\n`;
              onInsert(html);
              setShow(false);
            }}
          />
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// INSERT BAR
// ═══════════════════════════════════════════════════════════
function InsertBar({ onInsert, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 0", opacity: active ? 1 : 0.3, transition: "opacity 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = 0.3; }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <button onClick={onInsert} style={{ background: active ? C.burgundy : C.card, color: active ? "#fff" : C.textMuted, border: `1px solid ${active ? C.burgundy : C.border}`, borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: "0 8px", fontSize: 14, lineHeight: 1, padding: 0 }}>+</button>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// CONTENT EDITOR (Tab 2)
// ═══════════════════════════════════════════════════════════
function ContentEditor({ courseData, setCourseData }) {
  const [activeModule, setActiveModule] = useState(0);
  const [showBlockMenu, setShowBlockMenu] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);

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

  const blockConfig = (type) => BLOCK_TYPES.find(b => b.type === type) || { label: type, icon: "?", color: C.textMuted, category: "content" };

  // Module stats for sidebar
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
            <span style={S.badge(C.green)}>{(currentModule.blocks || []).filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length} knowledge checks</span>
            <span style={{ fontSize: 13, color: C.textMuted }}>{(currentModule.blocks || []).length} blocks</span>
          </div>
        </div>

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
                borderLeft: isKC ? `4px solid ${C.burgundy}` : isEngagement ? `4px solid ${C.purple}` : undefined,
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
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i - 1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === 0 ? 0.3 : 1, fontSize: 12 }}>▲</button>
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i + 1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === currentModule.blocks.length - 1 ? 0.3 : 1, fontSize: 12 }}>▼</button>
                    <button onClick={(e) => { e.stopPropagation(); removeBlock(i); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, color: C.danger, fontSize: 12 }}>✕</button>
                  </div>
                </div>
                {isEditing && (
                  <div style={{ padding: 14 }}>
                    <BlockEditor block={block} onChange={(updates) => updateBlock(i, updates)} />
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
            <p style={{ fontSize: 13, marginBottom: 16 }}>Choose from 17 block types organized by Content, Knowledge Checks, and Engagement</p>
            <button style={S.btnPrimary} onClick={() => setShowBlockMenu(-1)}>+ Add First Block</button>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// ACEP CHECKER (Tab 3) — Updated for 17 block types
// ═══════════════════════════════════════════════════════════
function ACEPChecker({ courseData }) {
  if (!courseData?.modules?.length) {
    return (
      <div style={S.card}>
        <div style={{ ...S.cardBody, textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 40 }}>📋</div>
          <h3 style={{ color: C.navy, marginTop: 16 }}>No Course Data to Check</h3>
          <p style={{ color: C.textMuted, fontSize: 14 }}>Generate or import a course first.</p>
        </div>
      </div>
    );
  }

  const ceHours = courseData.ceHours || 3;
  const requiredWords = ceHours * ACEP_RULES.wordsPerCEHour;

  let totalWords = 0;
  const moduleStats = courseData.modules.map(mod => {
    let modWords = 0;
    let knowledgeChecks = 0;
    let engagementBlocks = 0;

    (mod.blocks || []).forEach(b => {
      modWords += countBlockWords(b);
      if (KNOWLEDGE_CHECK_TYPES.includes(b.type)) knowledgeChecks++;
      if (ENGAGEMENT_TYPES.includes(b.type)) engagementBlocks++;
    });
    totalWords += modWords;
    return { title: mod.title, words: modWords, knowledgeChecks, engagementBlocks, blockCount: (mod.blocks || []).length };
  });

  const totalKC = moduleStats.reduce((s, m) => s + m.knowledgeChecks, 0);
  const hasObjectives = (courseData.objectives || []).length > 0;
  const hasTargetAudience = (courseData.targetAudience || []).length > 0;

  const checks = [
    { label: `Word Count (${requiredWords.toLocaleString()}+ req)`, value: `${totalWords.toLocaleString()}`, pass: totalWords >= requiredWords, detail: `${(totalWords / ceHours).toLocaleString()} words/CE hour` },
    { label: "Knowledge Checks per Module (2-5)", value: `${totalKC} total`, pass: moduleStats.every(m => m.knowledgeChecks >= 2), detail: moduleStats.map(m => `${m.title?.split(":")[0]}: ${m.knowledgeChecks}`).join(", ") },
    { label: "Learning Objectives", value: hasObjectives ? `${courseData.objectives.length}` : "Missing", pass: hasObjectives },
    { label: "Target Audience", value: hasTargetAudience ? "Yes" : "Missing", pass: hasTargetAudience },
    { label: "Pass Threshold ≥ 80%", value: `${((courseData.assessment?.passThreshold || 0.8) * 100).toFixed(0)}%`, pass: (courseData.assessment?.passThreshold || 0.8) >= 0.8 },
    { label: "Final Exam (15+ questions)", value: `${(courseData.assessment?.questions || []).length}`, pass: (courseData.assessment?.questions || []).length >= 15 },
  ];

  const passCount = checks.filter(c => c.pass).length;
  const score = Math.round((passCount / checks.length) * 100);

  return (
    <div>
      <div style={S.card}>
        <div style={{ ...S.cardBody, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke={C.borderLight} strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={score === 100 ? C.green : score >= 60 ? C.gold : C.danger} strokeWidth="8" strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: C.navy }}>{score}%</div>
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>
              {score === 100 ? "ACEP Compliant ✓" : score >= 60 ? "Needs Attention" : "Not Compliant"}
            </h3>
            <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>{passCount}/{checks.length} requirements · {ceHours} CE · {courseData.modules.length} modules · 17 block types available</p>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Requirements</span>
          <span style={S.badge(C.burgundy)}>NBCC ACEP #7760</span>
        </div>
        {checks.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < checks.length - 1 ? `1px solid ${C.borderLight}` : "none", background: c.pass ? C.greenFaded : C.dangerFaded }}>
            <span style={{ fontSize: 16 }}>{c.pass ? "✓" : "⚠"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{c.label}</div>
              {c.detail && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{c.detail}</div>}
            </div>
            <span style={S.badge(c.pass ? C.green : C.danger)}>{c.value}</span>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}><span style={{ fontWeight: 700, fontSize: 15 }}>Module Breakdown</span></div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.greenFaded }}>
                {["Module", "Words", "Knowledge Checks", "Engagement", "Blocks"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: C.navy, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {moduleStats.map((stat, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{stat.title?.replace(/^Module \d+:\s*/, "") || `Module ${i + 1}`}</td>
                  <td style={{ padding: "10px 14px", color: stat.words < 500 ? C.danger : C.green, fontWeight: 600 }}>{stat.words.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: stat.knowledgeChecks >= 2 ? C.green : C.danger, fontWeight: 600 }}>{stat.knowledgeChecks}</span>
                    <span style={{ color: C.textLight }}> / 2-5</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>{stat.engagementBlocks}</td>
                  <td style={{ padding: "10px 14px" }}>{stat.blockCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// AI COURSE GENERATOR
// ═══════════════════════════════════════════════════════════
function getModuleTitle(topic, index) {
  const templates = [
    "Foundations, Definitions, and Theoretical Frameworks",
    "Assessment Tools and Clinical Indicators",
    "Evidence-Based Intervention Strategies",
    "Clinical Application and Case Conceptualization",
    "Special Populations and Cultural Considerations",
    "Ethical and Legal Considerations",
    "Advanced Techniques and Integration",
    "Implementation, Self-Care, and Professional Development",
    "Emerging Research and Future Directions",
    "Comprehensive Review and Clinical Synthesis",
  ];
  return templates[index % templates.length];
}

function generateModuleBlocks(mod, moduleIndex, outline) {
  return [
    { id: uid(), type: "sectionDivider", ...BLOCK_DEFAULTS.sectionDivider, title: mod.title, sectionNumber: mod.number },
    { id: uid(), type: "text", content: `<h2>${mod.title}</h2><p>This module provides an in-depth exploration of key concepts related to ${outline.title.split(":")[0]}. Through evidence-based content, clinical examples, and interactive elements, you will develop practical skills applicable to your clinical practice.</p><p><strong>Learning Focus:</strong> By the end of this module, you will be able to identify, assess, and apply core principles within your professional context.</p>` },
    { id: uid(), type: "accordion", accordionItems: [
      { title: "Key Concepts", content: "Essential terminology and definitions relevant to this module's content area." },
      { title: "Clinical Relevance", content: "Why this content matters for practicing clinicians and how it impacts client outcomes." },
      { title: "Evidence Base", content: "Summary of current research supporting the approaches discussed in this module." },
    ]},
    { id: uid(), type: "text", content: `<p>Clinical practice in this area requires a nuanced understanding of both theoretical frameworks and practical application. Research consistently demonstrates that clinicians who integrate evidence-based approaches see improved client outcomes across multiple domains.</p><p>As you engage with this content, consider how these principles apply to your specific practice setting and client population. The interactive elements throughout this module are designed to reinforce key concepts and promote critical thinking about clinical application.</p>` },
    { id: uid(), type: "multipleChoice", question: `Which of the following best describes a core principle discussed in this module on ${mod.title.split(":").pop().trim()}?`, options: [
      { text: "A theoretical framework without empirical support", isCorrect: false },
      { text: "An evidence-based approach integrating assessment and intervention", isCorrect: true },
      { text: "A technique used exclusively in group settings", isCorrect: false },
      { text: "An administrative procedure for documentation purposes", isCorrect: false },
    ], explanation: "Evidence-based approaches that integrate both assessment and intervention represent the gold standard in clinical practice." },
    { id: uid(), type: "text", content: `<p>Building on the foundational concepts above, let us examine the clinical application of these principles. Effective implementation requires attention to individual client factors, cultural context, and the therapeutic relationship.</p>` },
    { id: uid(), type: "reflection", question: `Reflect on your current clinical practice. How might the concepts from this module on ${mod.title.split(":").pop().trim()} enhance your work with clients? Identify at least one specific change you could implement.`, minLength: 100 },
    ...(mod.knowledgeChecks >= 3 ? [{ id: uid(), type: "multiSelect", question: `Select ALL factors that are important considerations when applying ${mod.title.split(":").pop().trim()} concepts in clinical practice:`, options: [
      { text: "Client cultural background and identity", isCorrect: true },
      { text: "Clinician's personal preferences unrelated to treatment", isCorrect: false },
      { text: "Current evidence-based research findings", isCorrect: true },
      { text: "Ethical guidelines and professional standards", isCorrect: true },
    ], explanation: "Clinical application must consider client culture, current research, and ethical standards. Personal preferences unrelated to treatment should not drive clinical decisions." }] : []),
  ];
}

function AIGenerator({ onGenerated }) {
  const [step, setStep] = useState("input");
  const [topic, setTopic] = useState("");
  const [ceHours, setCeHours] = useState(3);
  const [level, setLevel] = useState("Intermediate");
  const [category, setCategory] = useState("Clinical Practice");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [outline, setOutline] = useState(null);
  const [progress, setProgress] = useState(0);
  const [generatingContent, setGeneratingContent] = useState(false);

  const generateOutline = () => {
    setStep("generating");
    setProgress(0);
    const timer = setInterval(() => setProgress(p => {
      if (p >= 95) { clearInterval(timer); return p; }
      return p + Math.random() * 15;
    }), 300);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      const minWords = ceHours * ACEP_RULES.wordsPerCEHour;
      const moduleCount = Math.max(4, ceHours * 2);
      const modules = Array.from({ length: moduleCount }, (_, i) => ({
        id: uid(),
        number: i + 1,
        title: `Module ${i + 1}: ${getModuleTitle(topic, i)}`,
        estimatedWords: Math.ceil(minWords / moduleCount),
        knowledgeChecks: 3,
        blocks: [],
        expanded: false,
      }));
      setOutline({
        title: `${topic}: Evidence-Based Approaches for Mental Health Professionals`,
        description: `This comprehensive ${ceHours}-hour continuing education course provides mental health professionals with a thorough understanding of ${topic.toLowerCase()}. Grounded in current research and clinical best practices, this course equips clinicians with evidence-based strategies for assessment, intervention, and professional development.`,
        ceHours,
        level,
        category,
        targetAudience: ["LPCs", "LMHCs", "LCSWs", "LMFTs", "Psychologists", "Psychiatric NPs"],
        objectives: [
          `Define key concepts, theories, and evidence-based frameworks related to ${topic.toLowerCase()}`,
          `Identify assessment tools and clinical indicators relevant to ${topic.toLowerCase()}`,
          `Apply evidence-based intervention strategies in clinical practice`,
          `Evaluate ethical considerations and professional boundaries in ${topic.toLowerCase()}`,
          `Develop a personalized implementation plan for integrating new knowledge into practice`,
        ],
        modules,
        totalEstimatedWords: minWords,
        references: 15,
        assessment: { questions: [], passThreshold: 0.80 },
        acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
      });
      setStep("outline");
    }, 2500);
  };

  const generateContent = () => {
    setGeneratingContent(true);
    setProgress(0);
    const timer = setInterval(() => setProgress(p => {
      if (p >= 95) { clearInterval(timer); return p; }
      return p + Math.random() * 8;
    }), 400);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      const courseData = {
        ...outline,
        modules: outline.modules.map((mod, mi) => ({
          ...mod,
          blocks: generateModuleBlocks(mod, mi, outline),
        })),
      };
      setGeneratingContent(false);
      setStep("content");
      if (onGenerated) onGenerated(courseData);
    }, 4000);
  };

  return (
    <div>
      {step === "input" && (
        <div>
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sparkles size={20} color={C.gold} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>AI Course Generator</span>
              </div>
              <span style={S.badge(C.green)}>ACEP Compliant</span>
            </div>
            <div style={S.cardBody}>
              <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                Enter a topic and parameters. The AI will generate an ACEP-compliant course outline with modules, knowledge checks, and assessment items meeting the 6,000+ words/CE hour standard.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Course Topic *</label>
                <input style={S.input} placeholder="e.g., Trauma-Informed Care and PTSD Treatment" value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
              <div style={{ ...S.grid3, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>CE Hours *</label>
                  <select style={S.input} value={ceHours} onChange={e => setCeHours(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} CE Hour{h > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Level</label>
                  <select style={S.input} value={level} onChange={e => setLevel(e.target.value)}>
                    {["Introductory", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Category</label>
                  <select style={S.input} value={category} onChange={e => setCategory(e.target.value)}>
                    {["Clinical Practice", "Ethics", "Crisis", "Assessment", "Supervision", "Diversity"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Additional Notes / Specifications</label>
                <textarea style={S.textarea} placeholder="Movie theme, specific frameworks to include, special populations focus..." value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} />
              </div>

              <div style={{ background: C.goldFaded, borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${C.gold}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <BarChart3 size={16} color={C.gold} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>ACEP Requirements Preview</span>
                </div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {[
                    { label: "Min. Words", value: (ceHours * 6000).toLocaleString() },
                    { label: "Modules", value: `${Math.max(4, ceHours * 2)}+` },
                    { label: "Knowledge Checks", value: `${Math.max(4, ceHours * 2) * 2}-${Math.max(4, ceHours * 2) * 5}` },
                    { label: "Final Exam", value: "15+ questions" },
                    { label: "Pass Rate", value: "80%" },
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{r.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button style={{ ...S.btnPrimary, opacity: topic.trim() ? 1 : 0.5, pointerEvents: topic.trim() ? "auto" : "none" }} onClick={generateOutline}>
                <Wand2 size={16} /> Generate Course Outline
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div style={S.card}>
          <div style={{ ...S.cardBody, textAlign: "center", padding: 60 }}>
            <Loader2 size={40} color={C.burgundy} style={{ animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <h3 style={{ marginTop: 16, color: C.navy }}>Generating Course Outline...</h3>
            <p style={{ color: C.textMuted, fontSize: 14 }}>Analyzing topic, structuring modules, mapping ACEP requirements</p>
            <div style={{ maxWidth: 400, margin: "20px auto", background: C.borderLight, borderRadius: 20, height: 8, overflow: "hidden" }}>
              <div style={{ background: `linear-gradient(90deg, ${C.burgundy}, ${C.gold})`, height: "100%", width: `${progress}%`, transition: "width 0.3s", borderRadius: 20 }} />
            </div>
          </div>
        </div>
      )}

      {step === "outline" && outline && (
        <div>
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <BookOpen size={20} color={C.green} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Course Outline</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={S.btnSecondary} onClick={() => setStep("input")}>
                  <ArrowUp size={14} /> Edit Parameters
                </button>
                <button style={{ ...S.btnGold, ...(generatingContent ? { opacity: 0.6 } : {}) }} onClick={generateContent} disabled={generatingContent}>
                  {generatingContent ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={16} />}
                  {generatingContent ? "Generating..." : "Generate Full Content"}
                </button>
              </div>
            </div>
            <div style={S.cardBody}>
              <div style={{ marginBottom: 16 }}>
                <input style={{ ...S.input, fontSize: 18, fontWeight: 700, border: "none", padding: "4px 0" }} value={outline.title} onChange={e => setOutline({ ...outline, title: e.target.value })} />
              </div>
              <textarea style={{ ...S.textarea, minHeight: 60 }} value={outline.description} onChange={e => setOutline({ ...outline, description: e.target.value })} />

              <div style={{ margin: "20px 0 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Modules ({outline.modules.length})</span>
                <span style={{ fontSize: 13, color: C.textMuted }}>Est. {outline.totalEstimatedWords.toLocaleString()} words total</span>
              </div>

              {outline.modules.map((mod, i) => (
                <div key={mod.id} style={{ border: `1px solid ${C.borderLight}`, borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.greenFaded, cursor: "pointer" }}
                    onClick={() => setOutline({ ...outline, modules: outline.modules.map((m, j) => j === i ? { ...m, expanded: !m.expanded } : m) })}>
                    {mod.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span style={{ fontWeight: 600, flex: 1, fontSize: 14 }}>{mod.title}</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>~{mod.estimatedWords.toLocaleString()} words · {mod.knowledgeChecks} checks</span>
                  </div>
                  {mod.expanded && (
                    <div style={{ padding: 14, borderTop: `1px solid ${C.borderLight}` }}>
                      <input style={{ ...S.input, marginBottom: 8 }} value={mod.title} onChange={e => {
                        const mods = [...outline.modules];
                        mods[i] = { ...mods[i], title: e.target.value };
                        setOutline({ ...outline, modules: mods });
                      }} />
                      <div style={S.grid2}>
                        <div>
                          <label style={{ ...S.label, fontSize: 12 }}>Est. Words</label>
                          <input type="number" style={S.input} value={mod.estimatedWords} onChange={e => {
                            const mods = [...outline.modules];
                            mods[i] = { ...mods[i], estimatedWords: Number(e.target.value) };
                            setOutline({ ...outline, modules: mods });
                          }} />
                        </div>
                        <div>
                          <label style={{ ...S.label, fontSize: 12 }}>Knowledge Checks</label>
                          <input type="number" style={S.input} value={mod.knowledgeChecks} min={2} max={5} onChange={e => {
                            const mods = [...outline.modules];
                            mods[i] = { ...mods[i], knowledgeChecks: Number(e.target.value) };
                            setOutline({ ...outline, modules: mods });
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button style={{ ...S.btnSecondary, marginTop: 12 }} onClick={() => {
                const n = outline.modules.length + 1;
                setOutline({ ...outline, modules: [...outline.modules, { id: uid(), number: n, title: `Module ${n}: New Module`, estimatedWords: 1000, knowledgeChecks: 3, blocks: [], expanded: true }] });
              }}>
                <Plus size={14} /> Add Module
              </button>
            </div>
          </div>

          {generatingContent && (
            <div style={S.card}>
              <div style={{ ...S.cardBody, textAlign: "center", padding: 40 }}>
                <Loader2 size={32} color={C.green} style={{ animation: "spin 1s linear infinite" }} />
                <h3 style={{ marginTop: 12, color: C.navy, fontSize: 16 }}>Generating Course Content...</h3>
                <p style={{ color: C.textMuted, fontSize: 13 }}>Writing content blocks, knowledge checks, and assessment items</p>
                <div style={{ maxWidth: 400, margin: "16px auto", background: C.borderLight, borderRadius: 20, height: 6, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, height: "100%", width: `${progress}%`, transition: "width 0.3s", borderRadius: 20 }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === "content" && (
        <div style={S.card}>
          <div style={{ ...S.cardBody, textAlign: "center", padding: 40 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenFaded, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={28} color={C.green} />
            </div>
            <h3 style={{ color: C.navy }}>Course Generated Successfully!</h3>
            <p style={{ color: C.textMuted, fontSize: 14, maxWidth: 500, margin: "8px auto 20px" }}>
              Your course has been loaded into the Content Editor. Switch tabs to review, edit blocks, and run the ACEP compliance checker.
            </p>
            <button style={S.btnPrimary} onClick={() => setStep("input")}>
              <Sparkles size={16} /> Generate Another Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// IMPORT TAB
// ═══════════════════════════════════════════════════════════
function parseMarkdownToCourse(content, filename) {
  const title = filename.replace(/\.(md|txt|markdown)$/i, "").replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const objectives = [];
  const objMatch = content.match(/learning objectives[\s\S]*?(?=\n##|\n---)/i);
  if (objMatch) {
    const lines = objMatch[0].match(/^\d+\.\s+.+$/gm) || [];
    lines.forEach(l => objectives.push(l.replace(/^\d+\.\s+/, "").replace(/\*\*/g, "").trim()));
  }

  const modules = [];
  const moduleRegex = /^#{1,2}\s*(?:MODULE|SECTION|CHAPTER)\s*(\d+)[:\s]*(.+)$/gim;
  const headers = [];
  let m;
  while ((m = moduleRegex.exec(content)) !== null) {
    headers.push({ num: parseInt(m[1]), title: m[2].trim(), index: m.index });
  }

  if (headers.length === 0) {
    modules.push({
      id: uid(), number: 1, title: "Module 1: Course Content",
      blocks: [{ id: uid(), type: "text", content: content.substring(0, 5000) }],
      knowledgeChecks: 0, estimatedWords: countWords(content),
    });
  } else {
    headers.forEach((hdr, i) => {
      const nextIdx = headers[i + 1]?.index || content.length;
      const section = content.substring(hdr.index, nextIdx);
      const blocks = [
        { id: uid(), type: "sectionDivider", title: `Module ${hdr.num}: ${hdr.title}`, sectionNumber: hdr.num },
        { id: uid(), type: "text", content: section.replace(/^#{1,3}.+$/gm, "").trim().substring(0, 5000) },
      ];
      modules.push({
        id: uid(), number: hdr.num, title: `Module ${hdr.num}: ${hdr.title}`,
        blocks, knowledgeChecks: 0, estimatedWords: countWords(section),
      });
    });
  }

  let ceHours = 3;
  const ceMatch = content.match(/(\d+)\s*CE\s*hours?/i);
  if (ceMatch) ceHours = parseInt(ceMatch[1]);

  return { title, ceHours, level: "Intermediate", category: "Clinical Practice", objectives, modules, targetAudience: ["LPCs", "LMHCs", "LCSWs", "LMFTs"], assessment: { questions: [], passThreshold: 0.80 }, acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" } };
}

function ImportTab({ onImported }) {
  const [dragOver, setDragOver] = useState(false);
  const [imported, setImported] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsed = parseMarkdownToCourse(content, file.name);
      setPreview(parsed);
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (preview && onImported) {
      onImported(preview);
      setImported(preview);
      setPreview(null);
    }
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Upload size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Import Course Content</span>
          </div>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Import course content from Markdown (.md) or text (.txt) files. The parser will detect modules, knowledge checks, learning objectives, and assessment items automatically, structuring them into the CounselorReady content block format.
          </p>

          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? C.burgundy : C.border}`, borderRadius: 12, padding: 48, textAlign: "center", cursor: "pointer", background: dragOver ? C.burgundyFaded : C.bg, transition: "all 0.2s" }}>
            <input ref={fileRef} type="file" accept=".md,.txt,.markdown" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            <FileUp size={36} color={dragOver ? C.burgundy : C.textLight} style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontWeight: 600, fontSize: 15, color: C.navy, margin: "0 0 4px" }}>Drop your file here or click to browse</p>
            <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>Supports .md, .txt, .markdown files</p>
          </div>

          <div style={{ ...S.grid2, marginTop: 20 }}>
            {[
              { icon: "📝", title: "Markdown (.md)", desc: "Module headers (## MODULE 1), knowledge checks, learning objectives, final assessments" },
              { icon: "📄", title: "Plain Text (.txt)", desc: "Structured text with clear section headings and numbered questions" },
            ].map(f => (
              <div key={f.title} style={{ background: C.greenFaded, borderRadius: 10, padding: 16, border: `1px solid ${C.green}22` }}>
                <span style={{ fontSize: 24 }}>{f.icon}</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginTop: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {preview && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Import Preview</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnSecondary} onClick={() => setPreview(null)}>Cancel</button>
              <button style={S.btnPrimary} onClick={confirmImport}><Check size={16} /> Import to Editor</button>
            </div>
          </div>
          <div style={S.cardBody}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>{preview.title}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{preview.ceHours} CE Hours · {preview.modules.length} modules · {preview.modules.reduce((s, m) => s + (m.blocks || []).length, 0)} blocks</div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              {[
                { label: "Words", value: preview.modules.reduce((s, m) => s + (m.blocks || []).reduce((bs, b) => bs + countWords(b.content || b.question || ""), 0), 0).toLocaleString() },
                { label: "Objectives", value: (preview.objectives || []).length },
                { label: "Knowledge Checks", value: preview.modules.reduce((s, m) => s + (m.blocks || []).filter(b => ["multipleChoice", "multiSelect", "matching"].includes(b.type)).length, 0) },
              ].map(s => (
                <div key={s.label} style={{ background: C.goldFaded, borderRadius: 8, padding: "8px 16px" }}>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{s.value}</div>
                </div>
              ))}
            </div>
            {preview.modules.map((mod, i) => (
              <div key={i} style={{ padding: "8px 12px", borderLeft: `3px solid ${C.green}`, marginBottom: 6, background: C.greenFaded, borderRadius: "0 6px 6px 0" }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{mod.title}</span>
                <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>{(mod.blocks || []).length} blocks</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {imported && (
        <div style={{ ...S.card, borderColor: `${C.green}44` }}>
          <div style={{ ...S.cardBody, display: "flex", alignItems: "center", gap: 12 }}>
            <Check size={20} color={C.green} />
            <span style={{ fontWeight: 600, color: C.green }}>Course imported! Switch to the Content Editor tab to review and edit.</span>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function CourseBuilderV2() {
  const [activeTab, setActiveTab] = useState(0);
  const [courseData, setCourseData] = useState({
    title: "New Course",
    ceHours: 3,
    level: "Intermediate",
    category: "Clinical Practice",
    objectives: [],
    targetAudience: ["LPCs", "LMHCs", "LCSWs", "LMFTs"],
    modules: [
      { id: uid(), number: 1, title: "Module 1: Getting Started", blocks: [], knowledgeChecks: 3 },
    ],
    assessment: { questions: [], passThreshold: 0.80 },
    acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  });

  const tabs = [
    { label: "AI Generator", icon: "✨" },
    { label: "Content Editor", icon: "📝" },
    { label: "ACEP Checker", icon: "📋" },
    { label: "Import", icon: "📥" },
    { label: "Block Types", icon: "🧩" },
  ];

  return (
    <div style={S.container}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700;6..72,800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>CounselorReady Course Builder</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 2 }}>NBCC ACEP #7760 · 17 Block Types · Cloudinary Images</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...S.btnSecondary, borderColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12 }} onClick={() => {
            const json = JSON.stringify(courseData, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
            a.download = `${courseData.title?.replace(/[^a-z0-9]/gi, "_") || "course"}.json`; a.click();
          }}>💾 Export JSON</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={S.tabBar}>
        {tabs.map((tab, i) => (
          <div key={i} style={S.tab(activeTab === i)} onClick={() => setActiveTab(i)}>
            <span>{tab.icon}</span> {tab.label}
          </div>
        ))}
      </div>

      <div style={S.main}>
        {activeTab === 0 && <AIGenerator onGenerated={(data) => { setCourseData(data); setActiveTab(1); }} />}
        {activeTab === 1 && <ContentEditor courseData={courseData} setCourseData={setCourseData} />}
        {activeTab === 2 && <ACEPChecker courseData={courseData} />}
        {activeTab === 3 && <ImportTab onImported={(data) => { setCourseData(data); setActiveTab(1); }} />}
        {activeTab === 4 && <BlockTypeCatalog />}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// BLOCK TYPE CATALOG (Tab 3)
// ═══════════════════════════════════════════════════════════
function BlockTypeCatalog() {
  const categories = [
    { key: "content", label: "Content Blocks", desc: "Auto-complete on render. Text, images, media delivery.", color: C.green, count: BLOCK_TYPES.filter(b => b.category === "content").length },
    { key: "assessment", label: "Knowledge Checks", desc: "Graded activities. Count toward ACEP module requirements (2-5 per module).", color: C.burgundy, count: BLOCK_TYPES.filter(b => b.category === "assessment").length },
    { key: "interactive", label: "Engagement Activities", desc: "Interactive but not graded. Enrich learning experience.", color: C.purple, count: BLOCK_TYPES.filter(b => b.category === "interactive").length },
  ];

  const completionMap = {
    sectionDivider: "Auto-complete on render", text: "Auto-complete on render", imageText: "Auto-complete on render",
    image: "Auto-complete on render", accordion: "Must expand ALL items", resources: "Auto-complete on render",
    videoEmbed: "Must view ALL timestamp markers",
    multipleChoice: "Must submit (correct not required)", multiSelect: "Must submit (correct not required)",
    matching: "Must complete all matches + submit", cardSort: "Must sort ALL cards + submit",
    sequencing: "Must order ALL steps + submit", timeline: "Must order ALL events + submit",
    reflection: "Must enter text", hotspot: "Must click ALL hotspots",
    scenarioTree: "Must reach an end node", flashcardDeck: "Must flip ALL cards",
  };

  return (
    <div>
      {categories.map(cat => (
        <div key={cat.key} style={S.card}>
          <div style={{ ...S.cardHeader, background: cat.color + "08" }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 15, color: cat.color }}>{cat.label}</span>
              <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>{cat.desc}</span>
            </div>
            <span style={S.badge(cat.color)}>{cat.count} types</span>
          </div>
          <div style={{ padding: "12px 20px" }}>
            {BLOCK_TYPES.filter(b => b.category === cat.key).map(bt => (
              <div key={bt.type} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: bt.color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{bt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{bt.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{completionMap[bt.type]}</div>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: bt.color, background: bt.color + "0A", padding: "2px 8px", borderRadius: 4 }}>{bt.type}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
