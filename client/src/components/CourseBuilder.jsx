// DROP INTO: /client/src/components/CourseBuilder.jsx

import { useState, useCallback, useRef, useEffect } from "react";

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
};


// ═══════════════════════════════════════════════════════════
// CLOUDINARY UPLOADER (inline component)
// ═══════════════════════════════════════════════════════════
function CloudinaryUploader({ onUpload, context = "general", currentImage = null, label = "Upload Image", compact = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState(null);
  const [alt, setAlt] = useState("");
  const fileRef = useRef(null);

  // Simulated upload (replace with real API call in production)
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Max 10MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Images only"); return; }

    setUploading(true);
    setError(null);

    // In production, this calls POST /api/images/upload
    // For the admin panel demo, we create a local object URL
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const data = {
          url, publicId: `${context}_${Date.now()}`,
          width: img.width, height: img.height, alt,
          thumbnailUrl: url, mediumUrl: url, largeUrl: url,
        };
        setPreview(url);
        onUpload(data);
        setUploading(false);
      };
      img.onerror = () => { setError("Failed to load image"); setUploading(false); };
      img.src = url;

      /* PRODUCTION CODE — uncomment when wired to backend:
      const formData = new FormData();
      formData.append('image', file);
      formData.append('context', context);
      formData.append('alt', alt);
      const res = await fetch(`${API_BASE}/api/images/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message);
      setPreview(data.data.thumbnailUrl || data.data.url);
      onUpload(data.data);
      */
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  if (compact) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} style={{ display: "none" }} />
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
      <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <div onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = C.green; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = C.border;
          const file = e.dataTransfer.files[0];
          if (file) { const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files; handleFile({ target: { files: dt.files } }); }
        }}
        style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: preview ? 8 : 28, textAlign: "center", cursor: "pointer", background: preview ? C.bg : "#fff", position: "relative" }}>
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
    { label: "Content Editor", icon: "📝" },
    { label: "ACEP Checker", icon: "📋" },
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
        {activeTab === 0 && <ContentEditor courseData={courseData} setCourseData={setCourseData} />}
        {activeTab === 1 && <ACEPChecker courseData={courseData} />}
        {activeTab === 2 && <BlockTypeCatalog />}
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
