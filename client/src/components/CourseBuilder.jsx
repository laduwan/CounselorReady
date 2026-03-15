/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// DROP INTO: /client/src/components/CourseBuilder.jsx

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import NarrationPanel from "./NarrationPanel.jsx";
import { safeHTML } from "../utils/sanitize";
import {
  Sparkles, FileText, CheckCircle, Upload, Plus, Trash2, GripVertical,
  ChevronDown, ChevronRight, AlertTriangle, Check, X, Loader2,
  BookOpen, Brain, ClipboardCheck, ArrowUp, ArrowDown, Copy,
  Settings, Eye, Wand2, FileUp, BarChart3, Zap, Save, Download,
  Clock, RotateCcw, History, Clipboard, Calendar, TrendingUp,
  Users, Award, PlayCircle, ChevronUp, ChevronLeft, ChevronsUp, ChevronsDown,
  CheckSquare, Square, FolderDown, FolderUp, RefreshCw, Layers,
  Image, Search, ExternalLink, Link2, Package, Share2, GitBranch, Filter
} from "lucide-react";

// ─── Brand Colors ───
const C = {
  burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldLight: "#E0BC72", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#284157", navyLight: "#4A6278",
  bg: "#F5F5DC", card: "#FFFFFF",
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
  image: { imageUrl: "", imageAltText: "", imageCaption: "", imageSize: "large", imageAlignment: "center", imageBorder: "none", imageShape: "default" },
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
  header: { background: C.burgundy, padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
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
      return <ImageBlockEditor block={block} onChange={onChange} />;

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

// ═══ ENHANCED IMAGE BLOCK EDITOR ═══
function ImageBlockEditor({ block, onChange }) {
  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const [showBrowser, setShowBrowser] = useState(false);
  const [libraryImages, setLibraryImages] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);

  const browseLibrary = async () => {
    setShowBrowser(true);
    if (libraryImages.length > 0) return;
    setBrowseLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/images/browse?max_results=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) setLibraryImages(data.data.images || []);
    } catch (err) { console.error("Browse failed:", err); }
    finally { setBrowseLoading(false); }
  };

  const selectFromLibrary = (img) => {
    onChange({ imageUrl: img.url, imagePublicId: img.publicId, imageAltText: img.alt || block.imageAltText, imageWidth: img.width, imageHeight: img.height });
    setShowBrowser(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <CloudinaryUploader
          onUpload={(d) => onChange({ imageUrl: d.url, imagePublicId: d.publicId, imageAltText: d.alt, imageWidth: d.width, imageHeight: d.height })}
          context="course-image" currentImage={block.imageUrl} label="Upload New Image"
        />
        <button onClick={browseLibrary} style={{ ...S.btnSecondary, alignSelf: "flex-start" }}>
          <Image size={14} /> Browse Media Library
        </button>
      </div>

      {/* Media Library Browser */}
      {showBrowser && (
        <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", background: C.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Select from Media Library</span>
            <button onClick={() => setShowBrowser(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} color={C.textMuted} /></button>
          </div>
          <div style={{ padding: 12, maxHeight: 240, overflowY: "auto" }}>
            {browseLoading ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: C.burgundy }} />
              </div>
            ) : libraryImages.length === 0 ? (
              <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13 }}>No images found</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                {libraryImages.map(img => (
                  <div key={img.publicId} onClick={() => selectFromLibrary(img)}
                    style={{ cursor: "pointer", borderRadius: 6, overflow: "hidden", border: `1px solid ${C.borderLight}`, transition: "all 0.15s" }}>
                    <img src={img.thumbnailUrl || img.url} alt={img.alt || ""} style={{ width: "100%", height: 80, objectFit: "cover" }} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ ...S.grid2, marginTop: 12 }}>
        <div><label style={S.label}>Caption</label><input style={S.input} value={block.imageCaption || ""} onChange={e => onChange({ imageCaption: e.target.value })} placeholder="Optional caption" /></div>
        <div><label style={S.label}>Alt Text</label><input style={S.input} value={block.imageAltText || ""} onChange={e => onChange({ imageAltText: e.target.value })} placeholder="Describe for screen readers" /></div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
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
        <div><label style={{ ...S.label, fontSize: 11 }}>Border</label>
          <select style={{ ...S.input, width: "auto" }} value={block.imageBorder || "none"} onChange={e => onChange({ imageBorder: e.target.value })}>
            <option value="none">None</option><option value="subtle">Subtle</option><option value="solid">Solid</option><option value="rounded">Rounded + Shadow</option>
          </select>
        </div>
        <div><label style={{ ...S.label, fontSize: 11 }}>Shape</label>
          <select style={{ ...S.input, width: "auto" }} value={block.imageShape || "default"} onChange={e => onChange({ imageShape: e.target.value })}>
            <option value="default">Rectangle</option><option value="rounded">Rounded</option><option value="circle">Circle</option><option value="pill">Pill</option>
          </select>
        </div>
      </div>
      {/* Image URL input for pasting external URLs */}
      <div style={{ marginTop: 10 }}>
        <label style={{ ...S.label, fontSize: 11 }}>Or paste image URL directly</label>
        <input
          style={S.input}
          value={block.imageUrl || ""}
          onChange={e => onChange({ imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
}

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
// ═══════════════════════════════════════════════════════════
// BLOCK AI BUTTON — per-block AI actions
// ═══════════════════════════════════════════════════════════
function BlockAIButton({ label, action, block, context, isJson, onResult, apiBase, getToken }) {
  const [loading, setLoading] = useState(false);

  const run = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/ai/block-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action, block, context }),
      });
      if (!res.ok) throw new Error(`AI action failed: ${res.status}`);
      const data = await res.json();
      if (data.result !== undefined) {
        if (isJson && typeof data.result === "string") {
          try { onResult(JSON.parse(data.result)); } catch { onResult(data.result); }
        } else {
          onResult(data.result);
        }
      }
    } catch (err) {
      console.error(`Block AI action "${action}" failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={run} disabled={loading}
      style={{ background: C.burgundyFaded, color: C.burgundy, border: "none", borderRadius: 5, padding: "3px 8px", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, opacity: loading ? 0.6 : 1 }}>
      {loading ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={10} />} {label}
    </button>
  );
}

function ContentEditor({ courseData, setCourseData }) {
  const [activeModule, setActiveModule] = useState(0);
  const [showBlockMenu, setShowBlockMenu] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [previewMode, setPreviewMode] = useState(false); // false | "full" | "split"
  const [regenerating, setRegenerating] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState("");
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const editorPanelRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const getToken = () => localStorage.getItem("token");

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
    const original = newBlocks[blockIndex];
    const clone = { ...JSON.parse(JSON.stringify(original)), id: uid() };
    newBlocks.splice(blockIndex + 1, 0, clone);
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
    setEditingBlock(blockIndex + 1);
  };

  // ── Bulk Operations ──
  const toggleBlockSelection = (index) => {
    const newSel = new Set(selectedBlocks);
    if (newSel.has(index)) newSel.delete(index);
    else newSel.add(index);
    setSelectedBlocks(newSel);
  };

  const selectAllBlocks = () => {
    if (selectedBlocks.size === (currentModule.blocks || []).length) {
      setSelectedBlocks(new Set());
    } else {
      setSelectedBlocks(new Set((currentModule.blocks || []).map((_, i) => i)));
    }
  };

  const bulkMoveBlocks = (direction) => {
    if (selectedBlocks.size === 0) return;
    const sorted = [...selectedBlocks].sort((a, b) => direction === "up" ? a - b : b - a);
    const newModules = [...modules];
    const newBlocks = [...(newModules[activeModule].blocks || [])];

    for (const idx of sorted) {
      const target = idx + (direction === "up" ? -1 : 1);
      if (target < 0 || target >= newBlocks.length) continue;
      if (selectedBlocks.has(target)) continue;
      [newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]];
    }

    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });

    // Update selection indices
    const newSel = new Set();
    for (const idx of selectedBlocks) {
      const target = idx + (direction === "up" ? -1 : 1);
      if (target >= 0 && target < newBlocks.length && !selectedBlocks.has(target)) {
        newSel.add(target);
      } else {
        newSel.add(idx);
      }
    }
    setSelectedBlocks(newSel);
  };

  const bulkDeleteBlocks = () => {
    if (selectedBlocks.size === 0) return;
    if (!confirm(`Delete ${selectedBlocks.size} selected blocks?`)) return;
    const newModules = [...modules];
    const newBlocks = (newModules[activeModule].blocks || []).filter((_, i) => !selectedBlocks.has(i));
    newModules[activeModule] = { ...newModules[activeModule], blocks: newBlocks };
    setCourseData({ ...courseData, modules: newModules });
    setSelectedBlocks(new Set());
    setEditingBlock(null);
  };

  const bulkMoveToModule = (targetModuleIndex) => {
    if (selectedBlocks.size === 0 || targetModuleIndex === activeModule) return;
    const newModules = [...modules];
    const movedBlocks = (newModules[activeModule].blocks || []).filter((_, i) => selectedBlocks.has(i));
    const remainingBlocks = (newModules[activeModule].blocks || []).filter((_, i) => !selectedBlocks.has(i));
    newModules[activeModule] = { ...newModules[activeModule], blocks: remainingBlocks };
    newModules[targetModuleIndex] = { ...newModules[targetModuleIndex], blocks: [...(newModules[targetModuleIndex].blocks || []), ...movedBlocks] };
    setCourseData({ ...courseData, modules: newModules });
    setSelectedBlocks(new Set());
  };

  const updateModuleTitle = (newTitle) => {
    const newModules = [...modules];
    newModules[activeModule] = { ...newModules[activeModule], title: newTitle };
    setCourseData({ ...courseData, modules: newModules });
  };

  const blockConfig = (type) => BLOCK_TYPES.find(b => b.type === type) || { label: type, icon: "?", color: C.textMuted, category: "content" };

  // Regenerate single module via AI
  const regenerateModule = async (moduleIndex) => {
    const mod = modules[moduleIndex];
    if (!mod) return;
    if (!confirm(`Regenerate "${mod.title}"? This will replace all blocks in this module. This may take 30-90 seconds.`)) return;
    setRegenerating(true);
    try {
      // Step 1: Start the async job
      const startRes = await fetch(`${API_BASE}/admin/module/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          courseTitle: courseData.title,
          moduleTitle: mod.title,
          moduleNumber: moduleIndex + 1,
          totalModules: modules.length,
          ceHours: courseData.ceHours,
          category: courseData.category === "Ethics" ? "ethics" : "core",
          additionalNotes: "",
          generateQuiz: true,
        }),
      });
      if (!startRes.ok) {
        const errData = await startRes.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to start generation: ${startRes.status}`);
      }
      const startData = await startRes.json();
      const jobId = startData.jobId;
      if (!jobId) throw new Error("No jobId returned — server may need updating");

      // Step 2: Poll for results every 3 seconds (up to 2 minutes)
      let attempts = 0;
      const maxAttempts = 40; // 40 x 3s = 2 minutes
      let result = null;

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000));
        attempts++;
        try {
          const pollRes = await fetch(`${API_BASE}/admin/module/generate/status/${jobId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          if (!pollRes.ok) continue;
          const pollData = await pollRes.json();

          if (pollData.status === "complete") {
            result = pollData;
            break;
          } else if (pollData.status === "error") {
            throw new Error(pollData.error || "Generation failed on server");
          }
          // else "processing" — keep polling
        } catch (pollErr) {
          if (pollErr.message.includes("Generation failed")) throw pollErr;
          // Network blip — keep trying
        }
      }

      if (!result) throw new Error("Generation timed out after 2 minutes. Check server logs.");

      // Step 3: Process result
      const generated = result.module || result;
      const newModules = [...modules];
      if (generated.blocks) {
        newModules[moduleIndex] = { ...newModules[moduleIndex], blocks: generated.blocks };
      } else if (generated.content) {
        // Convert single content string + questions to blocks
        const blocks = [
          { id: uid(), type: "sectionDivider", title: mod.title, sectionNumber: moduleIndex + 1, subtitle: generated.description || "" },
        ];
        if (generated.content.length > 15000) {
          const mid = Math.floor(generated.content.length / 2);
          const sp = generated.content.indexOf("<h3>", mid);
          if (sp > 0) {
            blocks.push({ id: uid(), type: "text", content: generated.content.substring(0, sp) });
            blocks.push({ id: uid(), type: "text", content: generated.content.substring(sp) });
          } else {
            blocks.push({ id: uid(), type: "text", content: generated.content });
          }
        } else {
          blocks.push({ id: uid(), type: "text", content: generated.content });
        }
        if (generated.questions?.length > 0) {
          generated.questions.forEach(q => {
            blocks.push({
              id: uid(),
              type: q.type === "multiple_select" ? "multiSelect" : "multipleChoice",
              question: q.question,
              options: (q.options || []).map((opt, oi) => ({
                text: opt, isCorrect: Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(oi) : oi === q.correctAnswer
              })),
              explanation: q.explanation || "",
            });
          });
        }
        blocks.push({ id: uid(), type: "reflection", question: `Reflect on what you learned about ${mod.title.split(":").pop().trim()}. How will you apply these concepts in your clinical practice?`, minLength: 100 });
        newModules[moduleIndex] = { ...newModules[moduleIndex], blocks };
      } else if (generated.lessons) {
        const blocks = generated.lessons.map((l, i) => ({
          id: uid(), type: "text", content: l.content || l.textContent || "", order: i + 1,
        }));
        if (generated.quiz?.questions) {
          generated.quiz.questions.forEach(q => {
            blocks.push({ id: uid(), type: "multipleChoice", question: q.question, options: q.options, explanation: q.explanation || "" });
          });
        }
        newModules[moduleIndex] = { ...newModules[moduleIndex], blocks };
      }
      setCourseData({ ...courseData, modules: newModules });
    } catch (err) {
      alert(`Regenerate failed: ${err.message}`);
    } finally {
      setRegenerating(false);
    }
  };

  // ── Auto-Enrich: AI inserts interactive elements into text-heavy modules ──
  const autoEnrichModule = async (moduleIndex) => {
    const mod = modules[moduleIndex];
    if (!mod) return;
    const blocks = mod.blocks || [];
    const textBlocks = blocks.filter(b => b.type === "text" || b.type === "imageText");
    if (textBlocks.length === 0) { alert("No text content to enrich. Add or generate content first."); return; }

    setEnriching(true);
    setEnrichProgress("Analyzing module content...");

    try {
      const token = getToken();
      // Find gaps: text blocks not followed by an interactive element
      const interactiveTypes = [...KNOWLEDGE_CHECK_TYPES, ...ENGAGEMENT_TYPES];
      const gaps = [];
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].type !== "text" && blocks[i].type !== "imageText") continue;
        const next = blocks[i + 1];
        if (!next || !interactiveTypes.includes(next.type)) {
          // This text block has no interactive element after it
          const textContent = (blocks[i].content || "").replace(/<[^>]*>/g, " ").trim();
          if (countWords(textContent) >= 80) { // Only enrich substantial text blocks
            gaps.push({ afterIndex: i, textBefore: textContent });
          }
        }
      }

      if (gaps.length === 0) { alert("Module already has interactive elements after each text section!"); setEnriching(false); setEnrichProgress(""); return; }

      // Plan which block types to insert — rotate through variety
      const interactiveRotation = [
        "multipleChoice", "reflection", "multiSelect", "matching",
        "accordion", "scenarioTree", "flashcardDeck", "cardSort", "sequencing",
      ];
      // Ensure at least 2-3 knowledge checks for ACEP compliance
      const existingKC = blocks.filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length;
      const neededKC = Math.max(0, 3 - existingKC);

      const plan = gaps.map((gap, i) => {
        let blockType;
        if (i < neededKC) {
          // Prioritize knowledge checks first
          blockType = i === 0 ? "multipleChoice" : i === 1 ? "multiSelect" : "matching";
        } else {
          // Then cycle through engagement types
          const engagementTypes = ["reflection", "accordion", "scenarioTree", "flashcardDeck", "cardSort"];
          blockType = engagementTypes[(i - neededKC) % engagementTypes.length];
        }
        return { ...gap, blockType };
      });

      // Generate each block via AI
      const newBlocks = [...blocks];
      let inserted = 0;

      for (let p = 0; p < plan.length; p++) {
        const { afterIndex, textBefore, blockType } = plan[p];
        const insertAt = afterIndex + 1 + inserted; // Adjust for previous insertions
        const textAfter = (newBlocks[insertAt]?.content || newBlocks[insertAt]?.question || "").replace(/<[^>]*>/g, " ").substring(0, 500);

        const label = BLOCK_TYPES.find(b => b.type === blockType)?.label || blockType;
        setEnrichProgress(`Creating ${label} (${p + 1}/${plan.length})...`);

        try {
          const res = await fetch(`${API_BASE}/ai/suggest-block`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              blockType,
              textBefore: textBefore.substring(0, 2000),
              textAfter: textAfter.substring(0, 500),
              courseTitle: courseData.title,
              moduleTitle: mod.title,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.block) {
              const newBlock = { id: uid(), type: blockType, ...BLOCK_DEFAULTS[blockType], ...data.block };
              newBlocks.splice(insertAt, 0, newBlock);
              inserted++;
            }
          }
        } catch (err) {
          console.error(`Failed to generate ${blockType}:`, err);
          // Skip failures, continue with next
        }
      }

      // Update the module
      const newModules = [...modules];
      newModules[moduleIndex] = { ...newModules[moduleIndex], blocks: newBlocks };
      setCourseData({ ...courseData, modules: newModules });
      setEnrichProgress(`✓ Added ${inserted} interactive elements`);
      setTimeout(() => setEnrichProgress(""), 3000);
    } catch (err) {
      alert(`Enrich failed: ${err.message}`);
      setEnrichProgress("");
    } finally {
      setEnriching(false);
    }
  };

  // Module stats for sidebar
  const getModuleStats = (mod) => {
    const blocks = mod.blocks || [];
    return {
      blocks: blocks.length,
      kc: blocks.filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length,
      words: blocks.reduce((s, b) => s + countBlockWords(b), 0),
    };
  };

  // ── Preview renderer (shared between full-preview and split-preview) ──
  const renderPreview = (blocks) => (
    <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }}>
      {(blocks || []).map((block, i) => {
        const cfg = blockConfig(block.type);
        return (
          <div key={block.id || i} style={{ marginBottom: 20, cursor: previewMode === "split" ? "pointer" : "default" }}
            onClick={() => { if (previewMode === "split") setEditingBlock(i); }}>
            {block.type === "sectionDivider" && (
              <div style={{ borderBottom: `2px solid ${C.burgundy}`, paddingBottom: 8, marginTop: 24 }}>
                <h2 style={{ color: C.burgundy, fontSize: 22, fontWeight: 700, margin: 0 }}>{block.title || "Section"}</h2>
                {block.subtitle && <p style={{ color: C.textMuted, fontSize: 14, margin: "4px 0 0" }}>{block.subtitle}</p>}
              </div>
            )}
            {block.type === "text" && (
              <div style={{ fontSize: 15, lineHeight: 1.7, color: C.text }} dangerouslySetInnerHTML={{ __html: safeHTML(block.content || "<em>Empty text block</em>") }} />
            )}
            {block.type === "imageText" && (
              <div style={{ display: "flex", gap: 20, flexDirection: block.imagePosition === "right" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {block.image && <img src={block.image} alt={block.imageAlt || ""} style={{ width: "40%", borderRadius: 8 }} />}
                <div style={{ flex: 1, fontSize: 15, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: safeHTML(block.content || "") }} />
              </div>
            )}
            {block.type === "image" && block.imageUrl && (
              <figure style={{ textAlign: "center", margin: "16px 0" }}>
                <img src={block.imageUrl} alt={block.imageAltText || ""} style={{ maxWidth: "80%", borderRadius: 8 }} />
                {block.imageCaption && <figcaption style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>{block.imageCaption}</figcaption>}
              </figure>
            )}
            {block.type === "accordion" && (
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                {(block.accordionItems || []).map((item, j) => (
                  <div key={j} style={{ borderBottom: `1px solid ${C.borderLight}`, padding: "10px 14px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{item.title || "Untitled"}</div>
                    <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }} dangerouslySetInnerHTML={{ __html: safeHTML(item.content || "") }} />
                  </div>
                ))}
              </div>
            )}
            {(block.type === "multipleChoice" || block.type === "multiSelect") && (
              <div style={{ background: C.burgundyFaded, borderRadius: 10, padding: 16, borderLeft: `4px solid ${C.burgundy}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.burgundy, marginBottom: 6 }}>KNOWLEDGE CHECK</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.navy, marginBottom: 10 }}>{block.question || "Question?"}</div>
                {(block.options || []).map((opt, j) => (
                  <div key={j} style={{ padding: "6px 10px", marginBottom: 4, borderRadius: 6, border: `1px solid ${opt.isCorrect ? C.green : C.border}`, background: opt.isCorrect ? C.greenFaded : "#fff", fontSize: 13 }}>
                    {opt.isCorrect && <span style={{ color: C.green, fontWeight: 700, marginRight: 6 }}>✓</span>}
                    {opt.text}
                  </div>
                ))}
                {block.explanation && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8, fontStyle: "italic" }}>💡 {block.explanation}</div>}
              </div>
            )}
            {block.type === "reflection" && (
              <div style={{ background: C.greenFaded, borderRadius: 10, padding: 16, borderLeft: `4px solid ${C.green}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 6 }}>REFLECTION</div>
                <div style={{ fontWeight: 500, fontSize: 14, color: C.navy }}>{block.question || "Reflect on..."}</div>
              </div>
            )}
            {block.type === "matching" && (
              <div style={{ background: C.burgundyFaded, borderRadius: 10, padding: 16, borderLeft: `4px solid ${C.navy}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.navy, marginBottom: 6 }}>MATCHING</div>
                {block.matchingInstructions && <div style={{ fontSize: 13, marginBottom: 8 }}>{block.matchingInstructions}</div>}
                {(block.matchingPairs || []).map((p, j) => (
                  <div key={j} style={{ display: "flex", gap: 12, marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: C.navy }}>{p.term}</span>
                    <span style={{ color: C.textMuted }}>→</span>
                    <span>{p.definition}</span>
                  </div>
                ))}
              </div>
            )}
            {block.type === "resources" && (
              <div style={{ background: C.goldFaded || "rgba(212,168,85,0.08)", borderRadius: 10, padding: 16, borderLeft: `4px solid ${C.gold}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, marginBottom: 6 }}>RESOURCES</div>
                {(block.resources || []).map((r, j) => (
                  <div key={j} style={{ fontSize: 13, marginBottom: 4 }}>📎 <a href={r.url} style={{ color: C.navy }}>{r.title || r.url}</a> <span style={{ color: C.textLight, fontSize: 11 }}>({r.type})</span></div>
                ))}
              </div>
            )}
            {!["sectionDivider","text","imageText","image","accordion","multipleChoice","multiSelect","reflection","matching","resources"].includes(block.type) && (
              <div style={{ background: C.greenFaded, borderRadius: 10, padding: 16, borderLeft: `4px solid ${cfg.color}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, marginBottom: 4 }}>{cfg.label.toUpperCase()}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{block.instructions || block.question || block.scenarioTitle || JSON.stringify(block).substring(0, 200) + "..."}</div>
              </div>
            )}
          </div>
        );
      })}
      {(blocks || []).length === 0 && (
        <p style={{ textAlign: "center", color: C.textMuted, fontSize: 14, padding: 40 }}>No blocks to preview</p>
      )}
    </div>
  );

  // ── Block list renderer (shared between edit and split modes) ──
  const renderBlockList = () => (
    <>
      <InsertBar onInsert={() => setShowBlockMenu(-1)} active={showBlockMenu === -1} />
      {showBlockMenu === -1 && <BlockPicker onPick={(type) => addBlock(type, -1)} onClose={() => setShowBlockMenu(null)} />}

      {(currentModule.blocks || []).map((block, i) => {
        const cfg = blockConfig(block.type);
        const isSelected = editingBlock === i;
        const isKC = KNOWLEDGE_CHECK_TYPES.includes(block.type);
        const isEngagement = ENGAGEMENT_TYPES.includes(block.type);
        return (
          <div key={block.id}>
            <div style={{
              border: `1px solid ${isSelected ? C.burgundy : C.border}`, borderRadius: 10, marginBottom: 4, background: C.card,
              borderLeft: isKC ? `4px solid ${C.burgundy}` : isEngagement ? `4px solid ${C.purple}` : undefined,
              boxShadow: isSelected ? `0 0 0 2px ${C.burgundy}22` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", cursor: "pointer" }}
                onClick={() => bulkMode ? toggleBlockSelection(i) : setEditingBlock(isSelected ? null : i)}>
                {bulkMode && (
                  <span onClick={(e) => { e.stopPropagation(); toggleBlockSelection(i); }}
                    style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selectedBlocks.has(i) ? C.burgundy : C.border}`, background: selectedBlocks.has(i) ? C.burgundy : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    {selectedBlocks.has(i) && <Check size={12} color="#fff" />}
                  </span>
                )}
                <span style={{ cursor: "grab", color: C.textLight, fontSize: 12 }}>⠿</span>
                <span style={{ width: 26, height: 26, borderRadius: 6, background: cfg.color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{cfg.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, flex: 1, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cfg.label}</span>
                {isKC && <span style={{ fontSize: 9, fontWeight: 700, color: C.burgundy, background: C.burgundyFaded, padding: "2px 6px", borderRadius: 4 }}>KC</span>}
                <span style={{ fontSize: 11, color: C.textLight }}>{countBlockWords(block)}w</span>
                <div style={{ display: "flex", gap: 2 }}>
                  <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i - 1); }} title="Move up" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === 0 ? 0.3 : 1, fontSize: 12 }}>▲</button>
                  <button onClick={(e) => { e.stopPropagation(); moveBlock(i, i + 1); }} title="Move down" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === currentModule.blocks.length - 1 ? 0.3 : 1, fontSize: 12 }}>▼</button>
                  <button onClick={(e) => { e.stopPropagation(); duplicateBlock(i); }} title="Duplicate block" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, fontSize: 12, color: C.navy }}>⧉</button>
                  <button onClick={(e) => { e.stopPropagation(); removeBlock(i); }} title="Delete block" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, color: C.danger, fontSize: 12 }}>✕</button>
                </div>
              </div>
              {/* Inline editing only when NOT in panel mode (i.e., no split/preview) */}
              {isSelected && previewMode !== "split" && (
                <div style={{ padding: 14, borderTop: `1px solid ${C.borderLight}` }}>
                  <BlockEditor block={block} onChange={(updates) => updateBlock(i, updates)} />
                  {/* AI Actions Bar */}
                  <div style={{ borderTop: `1px solid ${C.borderLight}`, marginTop: 12, paddingTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.textLight, fontWeight: 600, marginRight: 4 }}>AI:</span>
                    {(block.type === "text" || block.type === "imageText") && <>
                      <BlockAIButton label="Expand" action="expand" block={block} onResult={(result) => updateBlock(i, { content: result })} apiBase={API_BASE} getToken={getToken} />
                      <BlockAIButton label="Simplify" action="simplify" block={block} onResult={(result) => updateBlock(i, { content: result })} apiBase={API_BASE} getToken={getToken} />
                      <BlockAIButton label="Add Citations" action="add-citations" block={block} onResult={(result) => updateBlock(i, { content: result })} apiBase={API_BASE} getToken={getToken} />
                      <BlockAIButton label="Write Content" action="ai-write" block={block} context={block.title || currentModule.title} onResult={(result) => updateBlock(i, { content: result })} apiBase={API_BASE} getToken={getToken} />
                    </>}
                    {(block.type === "multipleChoice" || block.type === "multiSelect") && <>
                      <BlockAIButton label="Better Options" action="improve-options" block={block} isJson onResult={(result) => updateBlock(i, result)} apiBase={API_BASE} getToken={getToken} />
                    </>}
                    {block.type === "matching" && <>
                      <BlockAIButton label="Generate Pairs" action="generate-pairs" block={block} context={currentModule.title} isJson onResult={(result) => updateBlock(i, { matchingPairs: result })} apiBase={API_BASE} getToken={getToken} />
                    </>}
                    {block.type === "reflection" && <>
                      <BlockAIButton label="New Prompt" action="generate-prompt" block={block} context={currentModule.title} onResult={(result) => updateBlock(i, { question: result })} apiBase={API_BASE} getToken={getToken} />
                    </>}
                    {block.type === "flashcardDeck" && <>
                      <BlockAIButton label="Generate Cards" action="generate-cards" block={block} context={currentModule.title} isJson onResult={(result) => updateBlock(i, { flashcards: result })} apiBase={API_BASE} getToken={getToken} />
                    </>}
                    {block.type === "scenarioTree" && <>
                      <BlockAIButton label="Generate Scenario" action="generate-scenario" block={block} context={currentModule.title} isJson onResult={(result) => updateBlock(i, result)} apiBase={API_BASE} getToken={getToken} />
                    </>}
                  </div>
                </div>
              )}
            </div>
            <InsertBar onInsert={() => setShowBlockMenu(i)} active={showBlockMenu === i} />
            {showBlockMenu === i && <BlockPicker onPick={(type) => addBlock(type, i)} onClose={() => setShowBlockMenu(null)} />}
          </div>
        );
      })}

      {(currentModule.blocks || []).length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: C.textMuted, border: `2px dashed ${C.border}`, borderRadius: 12, background: C.card }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>No content blocks yet</p>
          <p style={{ fontSize: 13, marginBottom: 20, maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.5 }}>
            Build your module with 17 block types: text content, images, knowledge checks (multiple choice, matching, sequencing), and engagement activities (scenarios, flashcards, reflections).
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <button style={S.btnPrimary} onClick={() => setShowBlockMenu(-1)}>+ Add Content Block</button>
            <button style={{ ...S.btnSecondary, borderColor: C.burgundy + "44", color: C.burgundy }}
              onClick={() => regenerateModule(activeModule)}>
              <Wand2 size={14} /> AI Generate This Module
            </button>
          </div>
          <p style={{ fontSize: 11, color: C.textLight }}>
            Tip: Use "AI Generate" to auto-create content, or "Auto-Enrich" to add interactive elements to existing text.
          </p>
        </div>
      )}
    </>
  );

  // ── Editor panel for split mode (right column) ──
  const renderEditorPanel = () => {
    if (editingBlock === null || editingBlock < 0 || editingBlock >= (currentModule.blocks || []).length) {
      return (
        <div style={{ ...S.card, textAlign: "center", padding: 40, position: "sticky", top: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👆</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Select a block to edit</p>
          <p style={{ fontSize: 12, color: C.textMuted }}>Click any block in the list to open its editor here</p>
        </div>
      );
    }

    const block = currentModule.blocks[editingBlock];
    const cfg = blockConfig(block.type);

    return (
      <div ref={editorPanelRef} style={{ ...S.card, position: "sticky", top: 20, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", gap: 8, background: C.burgundyFaded }}>
          <span style={{ width: 24, height: 24, borderRadius: 6, background: cfg.color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{cfg.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.burgundy, flex: 1 }}>{cfg.label}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>Block {editingBlock + 1}</span>
          <button onClick={() => setEditingBlock(null)} title="Close editor"
            style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 16, padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ padding: 16 }}>
          <BlockEditor block={block} onChange={(updates) => updateBlock(editingBlock, updates)} />
          {/* AI Actions Bar */}
          <div style={{ borderTop: `1px solid ${C.borderLight}`, marginTop: 12, paddingTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: C.textLight, fontWeight: 600, marginRight: 4 }}>AI:</span>
            {(block.type === "text" || block.type === "imageText") && <>
              <BlockAIButton label="Expand" action="expand" block={block} onResult={(result) => updateBlock(editingBlock, { content: result })} apiBase={API_BASE} getToken={getToken} />
              <BlockAIButton label="Simplify" action="simplify" block={block} onResult={(result) => updateBlock(editingBlock, { content: result })} apiBase={API_BASE} getToken={getToken} />
              <BlockAIButton label="Add Citations" action="add-citations" block={block} onResult={(result) => updateBlock(editingBlock, { content: result })} apiBase={API_BASE} getToken={getToken} />
              <BlockAIButton label="Write Content" action="ai-write" block={block} context={block.title || currentModule.title} onResult={(result) => updateBlock(editingBlock, { content: result })} apiBase={API_BASE} getToken={getToken} />
            </>}
            {(block.type === "multipleChoice" || block.type === "multiSelect") && <>
              <BlockAIButton label="Better Options" action="improve-options" block={block} isJson onResult={(result) => updateBlock(editingBlock, result)} apiBase={API_BASE} getToken={getToken} />
            </>}
            {block.type === "matching" && <>
              <BlockAIButton label="Generate Pairs" action="generate-pairs" block={block} context={currentModule.title} isJson onResult={(result) => updateBlock(editingBlock, { matchingPairs: result })} apiBase={API_BASE} getToken={getToken} />
            </>}
            {block.type === "reflection" && <>
              <BlockAIButton label="New Prompt" action="generate-prompt" block={block} context={currentModule.title} onResult={(result) => updateBlock(editingBlock, { question: result })} apiBase={API_BASE} getToken={getToken} />
            </>}
            {block.type === "flashcardDeck" && <>
              <BlockAIButton label="Generate Cards" action="generate-cards" block={block} context={currentModule.title} isJson onResult={(result) => updateBlock(editingBlock, { flashcards: result })} apiBase={API_BASE} getToken={getToken} />
            </>}
            {block.type === "scenarioTree" && <>
              <BlockAIButton label="Generate Scenario" action="generate-scenario" block={block} context={currentModule.title} isJson onResult={(result) => updateBlock(editingBlock, result)} apiBase={API_BASE} getToken={getToken} />
            </>}
          </div>
        </div>
      </div>
    );
  };

  // ── Determine grid layout based on mode ──
  const gridColumns = previewMode === "split"
    ? "280px 1fr 400px"          // sidebar + block list + editor panel
    : previewMode === "full"
      ? "280px 1fr"              // sidebar + preview
      : "280px 1fr";             // sidebar + block list (inline editing)

  return (
    <div style={{ display: "grid", gridTemplateColumns: gridColumns, gap: 16, position: "relative" }}>
      {/* ── Module Sidebar (wider: 280px) ── */}
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
                <div style={{ fontSize: 13, fontWeight: i === activeModule ? 600 : 400, color: i === activeModule ? C.burgundy : C.textMuted, lineHeight: 1.4 }}
                  title={mod.title || `Module ${i + 1}`}>
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
          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <button style={{ ...S.btnSecondary, width: "100%", justifyContent: "center", fontSize: 12, padding: "8px 12px" }} onClick={() => {
              const n = modules.length + 1;
              setCourseData({ ...courseData, modules: [...modules, { id: uid(), number: n, title: `Module ${n}: New Module`, blocks: [], knowledgeChecks: 3 }] });
              setActiveModule(modules.length);
            }}>+ Add Module</button>
            {modules.length > 1 && (
              <button style={{ ...S.btnDanger, width: "100%", justifyContent: "center", fontSize: 11, padding: "6px 10px" }} onClick={() => {
                if (!confirm(`Delete "${currentModule.title}"?`)) return;
                const newMods = modules.filter((_, i) => i !== activeModule);
                setCourseData({ ...courseData, modules: newMods });
                setActiveModule(Math.max(0, activeModule - 1));
              }}>🗑 Delete Module</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
          <input
            style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0, border: "none", background: "transparent", outline: "none", flex: 1, minWidth: 0, padding: "4px 8px", borderRadius: 6, cursor: "text", fontFamily: "inherit" }}
            value={currentModule.title}
            onChange={e => updateModuleTitle(e.target.value)}
            onFocus={e => { e.target.style.background = C.burgundyFaded; e.target.style.border = `1px solid ${C.burgundy}33`; }}
            onBlur={e => { e.target.style.background = "transparent"; e.target.style.border = "none"; }}
            title="Click to edit module title"
          />
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            <button style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 10px", background: regenerating ? C.burgundyFaded : "transparent" }}
              onClick={() => regenerateModule(activeModule)} disabled={regenerating || enriching}>
              {regenerating ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Regenerating...</> : <><Wand2 size={12} /> Regenerate</>}
            </button>
            <button style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 10px", background: enriching ? C.goldFaded || "rgba(212,168,85,0.12)" : "transparent", borderColor: enriching ? C.gold : C.border, color: enriching ? C.gold : C.navy }}
              onClick={() => autoEnrichModule(activeModule)} disabled={enriching || regenerating}>
              {enriching ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> {enrichProgress || "Enriching..."}</> : <><Sparkles size={12} /> Auto-Enrich</>}
            </button>

            {/* View mode selector: Edit | Split | Preview */}
            <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <button onClick={() => setPreviewMode(false)} title="Edit mode"
                style={{ background: !previewMode ? C.navy : "transparent", color: !previewMode ? "#fff" : C.textMuted, border: "none", padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                Edit
              </button>
              <button onClick={() => { setPreviewMode("split"); if (editingBlock === null && (currentModule.blocks || []).length > 0) setEditingBlock(0); }} title="Side-by-side edit and preview"
                style={{ background: previewMode === "split" ? C.navy : "transparent", color: previewMode === "split" ? "#fff" : C.textMuted, border: "none", borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                Split
              </button>
              <button onClick={() => setPreviewMode("full")} title="Full preview"
                style={{ background: previewMode === "full" ? C.navy : "transparent", color: previewMode === "full" ? "#fff" : C.textMuted, border: "none", padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                <Eye size={11} /> Preview
              </button>
            </div>

            {/* Bulk select toggle */}
            <button onClick={() => { setBulkMode(!bulkMode); setSelectedBlocks(new Set()); }}
              title={bulkMode ? "Exit bulk mode" : "Bulk select blocks"}
              style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 10px", background: bulkMode ? C.burgundyFaded : "transparent", borderColor: bulkMode ? C.burgundy : C.border, color: bulkMode ? C.burgundy : C.navy }}>
              <CheckSquare size={12} /> Bulk
            </button>

            <span style={S.badge(C.green)}>{(currentModule.blocks || []).filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length} KC</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>{(currentModule.blocks || []).length} blocks</span>
          </div>
        </div>

        {/* Bulk Operations Bar */}
        {bulkMode && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: C.burgundyFaded, borderRadius: 10, marginBottom: 12, border: `1px solid ${C.burgundy}22` }}>
            <button onClick={selectAllBlocks} style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 10px" }}>
              {selectedBlocks.size === (currentModule.blocks || []).length ? <><CheckSquare size={11} /> Deselect All</> : <><Square size={11} /> Select All</>}
            </button>
            <span style={{ fontSize: 12, color: C.burgundy, fontWeight: 600 }}>{selectedBlocks.size} selected</span>
            <div style={{ flex: 1 }} />
            <button onClick={() => bulkMoveBlocks("up")} disabled={selectedBlocks.size === 0} style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 8px", opacity: selectedBlocks.size === 0 ? 0.4 : 1 }} title="Move selected up">
              <ChevronsUp size={12} /> Up
            </button>
            <button onClick={() => bulkMoveBlocks("down")} disabled={selectedBlocks.size === 0} style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 8px", opacity: selectedBlocks.size === 0 ? 0.4 : 1 }} title="Move selected down">
              <ChevronsDown size={12} /> Down
            </button>
            {modules.length > 1 && (
              <select
                onChange={(e) => { if (e.target.value !== "") bulkMoveToModule(parseInt(e.target.value)); e.target.value = ""; }}
                style={{ ...S.input, width: "auto", padding: "4px 8px", fontSize: 11 }}
                disabled={selectedBlocks.size === 0}>
                <option value="">Move to module...</option>
                {modules.map((m, i) => i !== activeModule && (
                  <option key={i} value={i}>{m.title || `Module ${i + 1}`}</option>
                ))}
              </select>
            )}
            <button onClick={bulkDeleteBlocks} disabled={selectedBlocks.size === 0} style={{ ...S.btnDanger, fontSize: 11, padding: "5px 10px", opacity: selectedBlocks.size === 0 ? 0.4 : 1 }}>
              <Trash2 size={11} /> Delete ({selectedBlocks.size})
            </button>
          </div>
        )}

        {/* Content based on view mode */}
        {previewMode === "full" ? (
          renderPreview(currentModule.blocks)
        ) : (
          renderBlockList()
        )}
      </div>

      {/* ── Editor Panel (split mode only) ── */}
      {previewMode === "split" && (
        <div>
          {renderEditorPanel()}
        </div>
      )}

      {/* ── Floating Add Block Button ── */}
      {!previewMode && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 100 }}>
          {floatingMenuOpen && (
            <div style={{
              position: "absolute", bottom: 56, right: 0, width: 260,
              background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)", padding: 8, maxHeight: 400, overflowY: "auto",
            }}>
              <div style={{ padding: "6px 10px", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase" }}>Add Block</div>
              {BLOCK_TYPES.map((bt) => (
                <button key={bt.type} onClick={() => {
                  addBlock(bt.type, (currentModule.blocks || []).length - 1);
                  setFloatingMenuOpen(false);
                }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px",
                    background: "none", border: "none", cursor: "pointer", borderRadius: 6, fontSize: 13,
                    color: C.navy, textAlign: "left",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.greenFaded}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <span style={{ width: 24, height: 24, borderRadius: 5, background: bt.color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{bt.icon}</span>
                  <span style={{ fontWeight: 500 }}>{bt.label}</span>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setFloatingMenuOpen(!floatingMenuOpen)} title="Add block"
            style={{
              width: 48, height: 48, borderRadius: "50%",
              background: floatingMenuOpen ? C.danger : C.burgundy, color: "#fff",
              border: "none", cursor: "pointer", fontSize: 22, fontWeight: 300,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(107,29,52,0.35)",
              transition: "transform 0.2s, background 0.2s",
              transform: floatingMenuOpen ? "rotate(45deg)" : "none",
            }}>
            +
          </button>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// ACEP CHECKER (Tab 3) — Updated for 17 block types
// ═══════════════════════════════════════════════════════════
function ACEPChecker({ courseData, acepOverride }) {
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
              {acepOverride ? "ACEP Override Active" : score === 100 ? "ACEP Compliant ✓" : score >= 60 ? "Needs Attention" : "Not Compliant"}
            </h3>
            <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>
              {acepOverride
                ? `Override enabled — publishing allowed regardless of ACEP compliance · ${passCount}/${checks.length} met`
                : `${passCount}/${checks.length} requirements · ${ceHours} CE · ${courseData.modules.length} modules · 17 block types available`}
            </p>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Requirements</span>
          <span style={S.badge(acepOverride ? C.gold : C.burgundy)}>{acepOverride ? "Override Active" : "NBCC ACEP #7760"}</span>
        </div>
        {acepOverride && (
          <div style={{ padding: "12px 20px", background: "#fff8e1", borderBottom: `1px solid ${C.borderLight}`, fontSize: 13, color: "#7a6200", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>&#9888;</span>
            <span>ACEP override is enabled — this course will publish without ACEP provider credentials. Use this when building courses for external organizations.</span>
          </div>
        )}
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
// STEP PROGRESS INDICATOR — for multi-step flows
// ═══════════════════════════════════════════════════════════
function StepProgress({ steps, currentStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24, padding: "0 4px" }}>
      {steps.map((s, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: isDone ? C.green : isActive ? C.burgundy : C.borderLight,
                color: isDone || isActive ? "#fff" : C.textLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                boxShadow: isActive ? `0 0 0 3px ${C.burgundy}22` : "none",
              }}>
                {isDone ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 12, fontWeight: isActive ? 700 : 500,
                color: isDone ? C.green : isActive ? C.burgundy : C.textLight,
                whiteSpace: "nowrap",
              }}>{s}</span>
            </div>
            {!isLast && (
              <div style={{
                flex: 1, height: 2, minWidth: 24, margin: "0 8px",
                background: isDone ? C.green : C.borderLight,
                borderRadius: 1, transition: "background 0.3s",
              }} />
            )}
          </React.Fragment>
        );
      })}
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

function generateBlocksFromSource(mod, moduleIndex, outline) {
  const src = mod.sourceContent || "";
  // Split source content into paragraphs
  const paragraphs = src.split(/\n{2,}/).filter(p => p.trim().length > 20);
  const blocks = [];

  // Section divider
  blocks.push({ id: uid(), type: "sectionDivider", ...BLOCK_DEFAULTS.sectionDivider, title: mod.title, sectionNumber: mod.number });

  // Create text blocks from source paragraphs (chunk into ~500 word segments)
  let currentChunk = "";
  paragraphs.forEach((p, i) => {
    currentChunk += (currentChunk ? "\n\n" : "") + `<p>${p.trim()}</p>`;
    if (countWords(currentChunk) > 500 || i === paragraphs.length - 1) {
      blocks.push({ id: uid(), type: "text", content: currentChunk });
      currentChunk = "";
    }
  });

  // If very little content was parsed, add placeholder
  if (blocks.length <= 1) {
    blocks.push({ id: uid(), type: "text", content: `<h2>${mod.title}</h2><p>${src.substring(0, 8000)}</p>` });
  }

  // Add knowledge checks
  const modTopic = mod.title.split(":").pop().trim();
  blocks.push({ id: uid(), type: "multipleChoice", question: `Which of the following best describes a key concept from this module on ${modTopic}?`, options: [
    { text: "A theoretical framework without empirical support", isCorrect: false },
    { text: "An evidence-based approach grounded in current research", isCorrect: true },
    { text: "A technique applicable only in group therapy settings", isCorrect: false },
    { text: "An administrative process for clinical documentation", isCorrect: false },
  ], explanation: `Evidence-based approaches grounded in current research are central to ${modTopic}.` });

  blocks.push({ id: uid(), type: "reflection", question: `Based on what you've learned about ${modTopic}, how could you apply these concepts in your clinical practice? Describe a specific scenario.`, minLength: 100 });

  if (mod.knowledgeChecks >= 3) {
    blocks.push({ id: uid(), type: "multiSelect", question: `Select ALL that apply to best practices in ${modTopic}:`, options: [
      { text: "Consideration of client cultural background", isCorrect: true },
      { text: "Reliance solely on clinician intuition", isCorrect: false },
      { text: "Integration of current research findings", isCorrect: true },
      { text: "Adherence to ethical guidelines", isCorrect: true },
    ], explanation: "Best practices require cultural consideration, research integration, and ethical adherence." });
  }

  return blocks;
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
  const [progressMsg, setProgressMsg] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);
  const [uploadingOutline, setUploadingOutline] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const outlineFileRef = useRef();

  // Parse uploaded file into outline
  const handleOutlineUpload = async (file) => {
    if (!file) return;
    setUploadingOutline(true);

    try {
      let content = "";
      const ext = file.name.split(".").pop().toLowerCase();

      if (ext === "docx") {
        content = await extractTextFromDocx(file);
      } else if (ext === "pdf") {
        content = await extractTextFromPdf(file);
      } else {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsText(file);
        });
      }

      if (!content || content.trim().length < 50) {
        throw new Error("File appears empty");
      }

      // Extract title from filename
      const fileTitle = file.name.replace(/\.(md|txt|markdown|docx|pdf)$/i, "").replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      if (!topic.trim()) setTopic(fileTitle);

      // Try to detect module/section headers
      const detectedModules = [];
      const patterns = [
        /^#{1,2}\s*(?:MODULE|SECTION|CHAPTER)\s*(\d+)[:\s]*(.+)$/gim,
        /^(?:MODULE|SECTION|CHAPTER)\s*(\d+)[:\s]*(.+)$/gim,
        /^#{1,2}\s+(.+)$/gm,
      ];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const title = (match[2] || match[1]).trim();
          if (title.length > 3 && title.length < 200) {
            detectedModules.push(title);
          }
        }
        if (detectedModules.length >= 2) break;
      }

      // Get word count and content chunks per module
      const contentChunks = [];
      if (detectedModules.length >= 2) {
        // Split content by detected headers
        for (let i = 0; i < detectedModules.length; i++) {
          const startIdx = content.indexOf(detectedModules[i]);
          const endIdx = i < detectedModules.length - 1 ? content.indexOf(detectedModules[i + 1]) : content.length;
          if (startIdx >= 0) {
            contentChunks.push(content.substring(startIdx, endIdx > startIdx ? endIdx : content.length));
          }
        }
      }

      const totalWords = countWords(content);
      const estimatedCE = Math.max(1, Math.round(totalWords / 6000));
      setCeHours(estimatedCE);

      // Build modules from detected headers or create defaults
      const moduleCount = detectedModules.length >= 2 ? detectedModules.length : Math.max(4, estimatedCE * 2);
      const modules = Array.from({ length: moduleCount }, (_, i) => ({
        id: uid(),
        number: i + 1,
        title: detectedModules[i] ? `Module ${i + 1}: ${detectedModules[i]}` : `Module ${i + 1}: ${getModuleTitle(fileTitle, i)}`,
        estimatedWords: contentChunks[i] ? countWords(contentChunks[i]) : Math.ceil((ceHours * 6000) / moduleCount),
        knowledgeChecks: 3,
        blocks: [],
        expanded: false,
        sourceContent: contentChunks[i] || "",
      }));

      // Extract objectives if found
      const objectives = [];
      const objMatch = content.match(/(?:learning objectives|course objectives|objectives)[\s\S]*?(?=\n#{1,2}|\n---|\n\n\n)/i);
      if (objMatch) {
        const lines = objMatch[0].match(/^\s*(?:\d+[\.\)]\s+|[-•]\s+).+$/gm) || [];
        lines.slice(0, 6).forEach(l => objectives.push(l.replace(/^\s*(?:\d+[\.\)]\s+|[-•]\s+)/, "").replace(/\*\*/g, "").trim()));
      }

      setOutline({
        title: topic.trim() || `${fileTitle}: Evidence-Based Approaches for Mental Health Professionals`,
        description: `This comprehensive ${estimatedCE}-hour continuing education course is based on uploaded content covering ${fileTitle.toLowerCase()}. Content will be expanded to meet ACEP standards with knowledge checks, interactive elements, and assessment items.`,
        ceHours: estimatedCE,
        level,
        category,
        targetAudience: ["LPCs", "LMHCs", "LCSWs", "LMFTs", "Psychologists", "Psychiatric NPs"],
        objectives: objectives.length > 0 ? objectives : [
          `Define key concepts and frameworks related to ${(topic || fileTitle).toLowerCase()}`,
          `Identify assessment tools and clinical indicators`,
          `Apply evidence-based intervention strategies in clinical practice`,
          `Evaluate ethical considerations and professional boundaries`,
          `Develop a personalized implementation plan for integrating new knowledge`,
        ],
        modules,
        totalEstimatedWords: Math.max(totalWords, estimatedCE * 6000),
        references: 15,
        assessment: { questions: [], passThreshold: 0.80 },
        acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
        _uploadedContent: content,
      });

      setUploadedFileName(file.name);
      setStep("outline");
    } catch (err) {
      alert("Error parsing file: " + (err.message || "Unknown error"));
    } finally {
      setUploadingOutline(false);
    }
  };

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

  const generateContent = async () => {
    setGeneratingContent(true);
    setProgress(0);
    setProgressMsg("Preparing generation...");

    const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
    const token = localStorage.getItem("token");
    const moduleCount = outline.modules.length;

    // Generate MODULE BY MODULE — each call ~30-60 sec, not 7+ min
    const generatedModules = [];
    let allQuestions = [];
    let totalWordsGenerated = 0;

    for (let mi = 0; mi < moduleCount; mi++) {
      const mod = outline.modules[mi];
      const pct = Math.round((mi / moduleCount) * 95);
      setProgress(pct);
      setProgressMsg(`Module ${mi + 1} of ${moduleCount}: ${mod.title.split(":").pop().trim()}...`);

      // Get source content for this module if uploaded
      let sourceContent = mod.sourceContent ||
        (outline._uploadedContent
          ? outline._uploadedContent.substring(
              mi * Math.floor(outline._uploadedContent.length / moduleCount),
              (mi + 1) * Math.floor(outline._uploadedContent.length / moduleCount)
            )
          : "");

      // Pre-mark knowledge check positions so the AI preserves original placement
      if (sourceContent) {
        sourceContent = sourceContent.replace(
          /(?:^|\n)\s*(?:Question\s*\d*[:.]|Knowledge Check[:.]?|Quiz[:.]?|Assessment[:.]?|Check Your Understanding[:.]?|Which of the following|Select all that apply|True or False[:.]?|All of the following EXCEPT)\s*/gim,
          (match) => `\n[KNOWLEDGE CHECK MARKER] ${match.trim()} `
        );
      }

      const body = {
        courseTitle: outline.title,
        moduleTitle: mod.title,
        moduleNumber: mi + 1,
        totalModules: moduleCount,
        ceHours: outline.ceHours,
        category: outline.category === "Ethics" ? "ethics" : outline.category === "Crisis" ? "crisis" : "core",
        sourceContent: sourceContent.substring(0, 8000),
        additionalNotes: additionalNotes || "",
        generateQuiz: true,
      };

      try {
        // Start async job (returns immediately with jobId)
        const startRes = await fetch(`${API_BASE}/admin/module/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(body),
        });

        if (!startRes.ok) {
          const errData = await startRes.json().catch(() => ({}));
          console.error(`Module ${mi + 1} failed to start:`, errData.error);
          generatedModules.push({
            id: uid(), number: mi + 1, title: mod.title,
            blocks: [
              { id: uid(), type: "sectionDivider", title: mod.title, sectionNumber: mi + 1, subtitle: "" },
              { id: uid(), type: "text", content: `<p><strong>⚠ Generation failed:</strong> ${errData.error || "API error"}</p><p>Add content manually or retry this module.</p>` },
            ],
            knowledgeChecks: 0, estimatedWords: 0,
          });
          continue;
        }

        const startData = await startRes.json();
        const jobId = startData.jobId;

        // Poll for results (async generation avoids Render proxy timeout)
        let data = null;
        if (jobId) {
          for (let attempt = 0; attempt < 40; attempt++) {
            await new Promise(r => setTimeout(r, 3000));
            setProgressMsg(`Module ${mi + 1} of ${moduleCount}: generating... (${attempt * 3}s)`);
            try {
              const pollRes = await fetch(`${API_BASE}/admin/module/generate/status/${jobId}`, {
                headers: { "Authorization": `Bearer ${token}` },
              });
              if (pollRes.ok) {
                const pollData = await pollRes.json();
                if (pollData.status === "complete") { data = pollData; break; }
                if (pollData.status === "error") throw new Error(pollData.error || "Generation failed");
              }
            } catch (pollErr) {
              if (pollErr.message.includes("Generation failed")) throw pollErr;
            }
          }
          if (!data) throw new Error("Generation timed out");
        } else {
          // Fallback: server returned result directly (old format)
          data = startData;
        }

        if (data.success !== false && (data.module || data.content)) {
          const mod_data = data.module || data;
          const blocks = [];
          blocks.push({ id: uid(), type: "sectionDivider", title: mod.title, sectionNumber: mi + 1, subtitle: mod_data.description || "" });

          // Add content as text block(s) — split if very long
          if (mod_data.content) {
            const content = mod_data.content;
            if (content.length > 15000) {
              // Split at a heading boundary near the middle
              const mid = Math.floor(content.length / 2);
              const splitPoint = content.indexOf("<h3>", mid);
              if (splitPoint > 0) {
                blocks.push({ id: uid(), type: "text", content: content.substring(0, splitPoint) });
                blocks.push({ id: uid(), type: "text", content: content.substring(splitPoint) });
              } else {
                blocks.push({ id: uid(), type: "text", content });
              }
            } else {
              blocks.push({ id: uid(), type: "text", content });
            }
          }

          // Add quiz questions as interactive blocks
          if (mod_data.questions && mod_data.questions.length > 0) {
            mod_data.questions.forEach(q => {
              if (q.type === "multiple_select") {
                blocks.push({ id: uid(), type: "multiSelect", question: q.question, options: (q.options || []).map((opt, oi) => ({
                  text: opt, isCorrect: Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(oi) : oi === q.correctAnswer
                })), explanation: q.explanation || "" });
              } else if (q.type === "true_false") {
                blocks.push({ id: uid(), type: "multipleChoice", question: q.question, options: [
                  { text: "True", isCorrect: q.correctAnswer === true },
                  { text: "False", isCorrect: q.correctAnswer === false },
                ], explanation: q.explanation || "" });
              } else {
                blocks.push({ id: uid(), type: "multipleChoice", question: q.question, options: (q.options || []).map((opt, oi) => ({
                  text: opt, isCorrect: oi === q.correctAnswer
                })), explanation: q.explanation || "" });
              }
              allQuestions.push(q);
            });
          }

          // Add a reflection prompt
          blocks.push({ id: uid(), type: "reflection", question: `Reflect on what you learned about ${mod.title.split(":").pop().trim()}. How will you apply these concepts in your clinical practice? Describe a specific situation.`, minLength: 100 });

          const wordCount = mod_data.wordCount || blocks.reduce((s, b) => s + countBlockWords(b), 0);
          totalWordsGenerated += wordCount;

          generatedModules.push({
            id: uid(), number: mi + 1, title: mod.title,
            blocks,
            knowledgeChecks: blocks.filter(b => ["multipleChoice", "multiSelect", "matching"].includes(b.type)).length,
            estimatedWords: wordCount,
          });

          setProgressMsg(`Module ${mi + 1} done — ${wordCount.toLocaleString()} words ✓`);
        } else {
          throw new Error(data.error || "Unexpected response format");
        }
      } catch (err) {
        console.error(`Module ${mi + 1} error:`, err);
        generatedModules.push({
          id: uid(), number: mi + 1, title: mod.title,
          blocks: [
            { id: uid(), type: "sectionDivider", title: mod.title, sectionNumber: mi + 1, subtitle: "" },
            { id: uid(), type: "text", content: `<p><strong>⚠ Error:</strong> ${err.message}</p><p>Add content manually or retry.</p>` },
          ],
          knowledgeChecks: 0, estimatedWords: 0,
        });
      }
    }

    // Assemble final course
    setProgress(98);
    setProgressMsg("Assembling course...");

    const finalCourse = {
      title: outline.title,
      description: outline.description,
      ceHours: outline.ceHours,
      level: outline.level,
      category: outline.category,
      targetAudience: outline.targetAudience,
      objectives: outline.objectives,
      assessment: { questions: allQuestions, passThreshold: 0.80 },
      acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
      modules: generatedModules,
    };

    const successCount = generatedModules.filter(m => (m.estimatedWords || 0) > 100).length;

    setGeneratingContent(false);
    setProgress(100);

    if (successCount === 0) {
      alert("⚠ All modules failed to generate. Check that ANTHROPIC_API_KEY is set in Render environment variables and try again.");
    } else {
      const target = outline.ceHours * 6000;
      setProgressMsg(`Generated ${totalWordsGenerated.toLocaleString()} / ${target.toLocaleString()} target words across ${successCount}/${moduleCount} modules`);
      setStep("content");
      if (onGenerated) onGenerated(finalCourse);
    }
  };

  const stepIndex = step === "input" ? 0 : step === "generating" ? 1 : step === "outline" ? 1 : step === "content" ? 3 : 0;

  return (
    <div>
      <StepProgress
        steps={["Configure", "Review Outline", "Generate Content", "Complete"]}
        currentStep={generatingContent ? 2 : stepIndex}
      />

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
                Enter a topic and parameters below, or <strong>upload an existing outline</strong> (.docx, .pdf, .md, .txt) to have the AI flesh it out into a full ACEP-compliant course.
              </p>

              {/* Upload Outline Zone */}
              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Upload Outline (Optional)</label>
                <input ref={outlineFileRef} type="file" accept=".docx,.pdf,.md,.txt,.markdown" style={{ display: "none" }}
                  onChange={(e) => handleOutlineUpload(e.target.files?.[0])} />
                <div
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = C.burgundy; e.currentTarget.style.background = C.burgundyFaded; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg; }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg; handleOutlineUpload(e.dataTransfer.files?.[0]); }}
                  onClick={() => outlineFileRef.current?.click()}
                  style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: uploadingOutline ? 24 : 18, textAlign: "center", cursor: "pointer", background: C.bg, transition: "all 0.2s" }}>
                  {uploadingOutline ? (
                    <div>
                      <Loader2 size={24} color={C.burgundy} style={{ animation: "spin 1s linear infinite", display: "inline-block" }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                      <p style={{ fontWeight: 600, fontSize: 13, color: C.navy, margin: "8px 0 0" }}>Parsing document...</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <FileUp size={22} color={C.textLight} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: C.navy }}>Drop your outline here or click to browse</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>.docx, .pdf, .md, .txt — We'll detect modules and build the course structure</div>
                      </div>
                    </div>
                  )}
                </div>
                {uploadedFileName && (
                  <div style={{ marginTop: 6, fontSize: 12, color: C.green, display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={14} /> Loaded: {uploadedFileName}
                  </div>
                )}
              </div>

              <div style={{ position: "relative", textAlign: "center", margin: "0 0 20px" }}>
                <div style={{ borderTop: `1px solid ${C.border}`, position: "absolute", top: "50%", left: 0, right: 0 }} />
                <span style={{ background: C.card, padding: "0 16px", fontSize: 12, color: C.textMuted, position: "relative", fontWeight: 600 }}>OR ENTER MANUALLY</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Course Topic *</label>
                <input style={S.input} placeholder="e.g., Trauma-Informed Care and PTSD Treatment" value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
              <div style={{ ...S.grid3, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>CE Hours *</label>
                  <select style={S.input} value={ceHours} onChange={e => setCeHours(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(h => <option key={h} value={h}>{h} CE Hour{h > 1 ? "s" : ""}</option>)}
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
              <div style={{ background: C.burgundy, height: "100%", width: `${progress}%`, transition: "width 0.3s", borderRadius: 20 }} />
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
                {uploadedFileName && <span style={S.badge(C.burgundy)}>📄 From: {uploadedFileName}</span>}
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

              {/* ── Editable Objectives ── */}
              <div style={{ margin: "20px 0 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Learning Objectives ({(outline.objectives || []).length})</span>
                <button style={{ ...S.btnSecondary, fontSize: 11, padding: "4px 10px" }} onClick={() => {
                  setOutline({ ...outline, objectives: [...(outline.objectives || []), ""] });
                }}>+ Add Objective</button>
              </div>
              {(outline.objectives || []).map((obj, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.greenFaded, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <input style={{ ...S.input, flex: 1, fontSize: 13 }} value={obj} placeholder="e.g., Identify evidence-based strategies for..."
                    onChange={e => {
                      const objs = [...outline.objectives];
                      objs[i] = e.target.value;
                      setOutline({ ...outline, objectives: objs });
                    }} />
                  <button style={S.btnDanger} onClick={() => {
                    setOutline({ ...outline, objectives: outline.objectives.filter((_, j) => j !== i) });
                  }}>✕</button>
                </div>
              ))}

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
                    {/* Module reorder and delete controls */}
                    <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === 0 ? 0.3 : 0.7, fontSize: 12 }}
                        disabled={i === 0}
                        onClick={() => {
                          const mods = [...outline.modules];
                          [mods[i - 1], mods[i]] = [mods[i], mods[i - 1]];
                          mods.forEach((m, idx) => { m.number = idx + 1; });
                          setOutline({ ...outline, modules: mods });
                        }}>▲</button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3, opacity: i === outline.modules.length - 1 ? 0.3 : 0.7, fontSize: 12 }}
                        disabled={i === outline.modules.length - 1}
                        onClick={() => {
                          const mods = [...outline.modules];
                          [mods[i], mods[i + 1]] = [mods[i + 1], mods[i]];
                          mods.forEach((m, idx) => { m.number = idx + 1; });
                          setOutline({ ...outline, modules: mods });
                        }}>▼</button>
                      {outline.modules.length > 1 && (
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3, color: C.danger, fontSize: 12 }}
                          onClick={() => {
                            const mods = outline.modules.filter((_, j) => j !== i);
                            mods.forEach((m, idx) => { m.number = idx + 1; });
                            setOutline({ ...outline, modules: mods });
                          }}>✕</button>
                      )}
                    </div>
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
                <h3 style={{ marginTop: 12, color: C.navy, fontSize: 16 }}>Generating Course Content via AI...</h3>
                <p style={{ color: C.textMuted, fontSize: 13 }}>{progressMsg || "Connecting to AI service..."}</p>
                <div style={{ maxWidth: 400, margin: "16px auto", background: C.borderLight, borderRadius: 20, height: 6, overflow: "hidden" }}>
                  <div style={{ background: C.green, height: "100%", width: `${progress}%`, transition: "width 0.3s", borderRadius: 20 }} />
                </div>
                <p style={{ fontSize: 11, color: C.textLight, marginTop: 8 }}>This may take 30-90 seconds for a {outline?.ceHours || 3}CE course ({((outline?.ceHours || 3) * 6000).toLocaleString()}+ words)</p>
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
              {progressMsg || "Your course has been loaded into the Content Editor."}
            </p>

            {/* Quick next-steps guide */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24, maxWidth: 600, margin: "0 auto 24px" }}>
              {[
                { step: "1", label: "Edit Content", desc: "Review and refine blocks", tab: 2, color: C.green },
                { step: "2", label: "Generate Exam", desc: "Create final assessment", tab: 3, color: C.burgundy },
                { step: "3", label: "Add References", desc: "APA 7th citations", tab: 4, color: C.navy },
                { step: "4", label: "ACEP Check", desc: "Verify compliance", tab: 5, color: C.gold },
              ].map(s => (
                <div key={s.step} onClick={() => onGenerated && null}
                  style={{ flex: "1 1 120px", background: s.color + "08", border: `1px solid ${s.color}22`, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, margin: "0 auto 6px" }}>{s.step}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={S.btnSecondary} onClick={() => setStep("input")}>
                <Sparkles size={16} /> Generate Another
              </button>
            </div>
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
  const title = filename.replace(/\.(md|txt|markdown|docx|pdf)$/i, "").replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
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

  // Also try plain text patterns like "Module 1:" or "SECTION 1:"
  if (headers.length === 0) {
    const plainRegex = /^(?:MODULE|SECTION|CHAPTER)\s*(\d+)[:\s]*(.+)$/gim;
    while ((m = plainRegex.exec(content)) !== null) {
      headers.push({ num: parseInt(m[1]), title: m[2].trim(), index: m.index });
    }
  }

  if (headers.length === 0) {
    // Split by double newlines into chunks for large content
    const chunks = content.split(/\n{3,}/).filter(c => c.trim().length > 100);
    if (chunks.length > 1) {
      chunks.forEach((chunk, i) => {
        const firstLine = chunk.trim().split("\n")[0].substring(0, 80);
        modules.push({
          id: uid(), number: i + 1, title: `Module ${i + 1}: ${firstLine}`,
          blocks: [{ id: uid(), type: "text", content: chunk.trim() }],
          knowledgeChecks: 0, estimatedWords: countWords(chunk),
        });
      });
    } else {
      modules.push({
        id: uid(), number: 1, title: "Module 1: Course Content",
        blocks: [{ id: uid(), type: "text", content: content }],
        knowledgeChecks: 0, estimatedWords: countWords(content),
      });
    }
  } else {
    headers.forEach((hdr, i) => {
      const nextIdx = headers[i + 1]?.index || content.length;
      const section = content.substring(hdr.index, nextIdx);
      const blocks = [
        { id: uid(), type: "sectionDivider", title: `Module ${hdr.num}: ${hdr.title}`, sectionNumber: hdr.num },
        { id: uid(), type: "text", content: section.replace(/^#{1,3}.+$/gm, "").trim() },
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

async function extractTextFromDocx(file) {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromPdf(file) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n\n";
  }
  return text;
}

function ImportTab({ onImported }) {
  const [dragOver, setDragOver] = useState(false);
  const [imported, setImported] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      let content = "";
      const ext = file.name.split(".").pop().toLowerCase();

      if (ext === "docx") {
        content = await extractTextFromDocx(file);
      } else if (ext === "pdf") {
        content = await extractTextFromPdf(file);
      } else {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsText(file);
        });
      }

      if (!content || content.trim().length < 50) {
        throw new Error("File appears to be empty or could not be parsed");
      }

      const parsed = parseMarkdownToCourse(content, file.name);
      setPreview(parsed);
    } catch (err) {
      setError(err.message || "Failed to parse file");
    } finally {
      setLoading(false);
    }
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
            Import course content from Word documents, PDFs, Markdown, or text files. The parser will detect modules, knowledge checks, learning objectives, and assessment items automatically, structuring them into the CounselorReady content block format.
          </p>

          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? C.burgundy : C.border}`, borderRadius: 12, padding: 48, textAlign: "center", cursor: "pointer", background: dragOver ? C.burgundyFaded : C.bg, transition: "all 0.2s" }}>
            <input ref={fileRef} type="file" accept=".md,.txt,.markdown,.docx,.pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            {loading ? (
              <div>
                <Loader2 size={36} color={C.burgundy} style={{ animation: "spin 1s linear infinite", margin: "0 auto", display: "block" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                <p style={{ fontWeight: 600, fontSize: 15, color: C.navy, margin: "12px 0 4px" }}>Parsing document...</p>
                <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>Extracting text and detecting structure</p>
              </div>
            ) : (
              <div>
                <FileUp size={36} color={dragOver ? C.burgundy : C.textLight} style={{ margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontWeight: 600, fontSize: 15, color: C.navy, margin: "0 0 4px" }}>Drop your file here or click to browse</p>
                <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>Supports .docx, .pdf, .md, .txt files</p>
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.dangerFaded, borderRadius: 8, color: C.danger, fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginTop: 20 }}>
            {[
              { icon: "📄", title: "Word (.docx)", desc: "Full document parsing with headers and sections" },
              { icon: "📕", title: "PDF (.pdf)", desc: "Text extraction from PDF documents" },
              { icon: "📝", title: "Markdown (.md)", desc: "Module headers, objectives, assessments" },
              { icon: "📃", title: "Plain Text (.txt)", desc: "Structured text with section headings" },
            ].map(f => (
              <div key={f.title} style={{ background: C.greenFaded, borderRadius: 10, padding: 14, border: `1px solid ${C.green}22` }}>
                <span style={{ fontSize: 22 }}>{f.icon}</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginTop: 4 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, lineHeight: 1.4 }}>{f.desc}</div>
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
// RESEARCH SYNTHESIS TAB — Scholarly DB search + meta/comparative analysis
// ═══════════════════════════════════════════════════════════
function ResearchSynthesisTab({ onGenerated }) {
  const [step, setStep] = useState("search"); // search | select | synthesize | review
  const [topic, setTopic] = useState("");
  const [yearFrom, setYearFrom] = useState(2015);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [analysisType, setAnalysisType] = useState("meta-analysis");
  const [ceHours, setCeHours] = useState(2);
  const [synthesis, setSynthesis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const searchArticles = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/course-builder/research/search", {
        method: "POST", headers,
        body: JSON.stringify({ query: topic, yearFrom, limit: 20 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSearchResults(data.articles || []);
      setStep("select");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleArticle = (article) => {
    setSelectedArticles(prev => {
      const exists = prev.find(a => (a.doi && a.doi === article.doi) || a.title === article.title);
      if (exists) return prev.filter(a => a !== exists);
      if (prev.length >= 15) return prev;
      return [...prev, article];
    });
  };

  const runSynthesis = async () => {
    if (selectedArticles.length < 3) { setError("Select at least 3 articles"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/course-builder/research/synthesize", {
        method: "POST", headers,
        body: JSON.stringify({ topic, articles: selectedArticles, analysisType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSynthesis(data.synthesis);
      setStep("synthesize");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCourse = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/course-builder/research/generate-course", {
        method: "POST", headers,
        body: JSON.stringify({ synthesis, articles: selectedArticles, ceHours, level: "Intermediate" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onGenerated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const autoGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/course-builder/research/auto-build", {
        method: "POST", headers,
        body: JSON.stringify({ topic, analysisType, ceHours, yearFrom })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSynthesis(data.synthesis);
      setSelectedArticles(data.articles || []);
      if (data.course) {
        onGenerated(data.course);
      } else {
        setStep("synthesize");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sBox = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 16 };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.burgundy, marginBottom: 4 }}>
        Research Synthesis Course Builder
      </h2>
      <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>
        Search scholarly databases (CrossRef + OpenAlex), run meta-analysis or comparative analysis, and generate a CEU course from the research.
      </p>

      {error && (
        <div style={{ background: C.dangerFaded, border: `1px solid ${C.danger}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, color: C.danger, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Search Topic", "Select Articles", "Synthesize", "Generate Course"].map((label, i) => {
          const stepNames = ["search", "select", "synthesize", "review"];
          const currentIdx = stepNames.indexOf(step);
          const isActive = i === currentIdx;
          const isDone = i < currentIdx;
          return (
            <div key={i} style={{
              flex: 1, padding: "8px 12px", borderRadius: 8, textAlign: "center", fontSize: 12, fontWeight: 600,
              background: isActive ? C.burgundy : isDone ? C.greenFaded : C.burgundyFaded,
              color: isActive ? "#fff" : isDone ? C.green : C.textMuted,
              cursor: isDone ? "pointer" : "default"
            }} onClick={() => isDone && setStep(stepNames[i])}>
              {isDone ? "✓ " : ""}{label}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: SEARCH ── */}
      {step === "search" && (
        <div style={sBox}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 16 }}>Search Scholarly Databases</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <input
              value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g., EMDR effectiveness for PTSD in adults"
              onKeyDown={e => e.key === "Enter" && searchArticles()}
              style={{ flex: 1, minWidth: 250, padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}
            />
            <select value={yearFrom} onChange={e => setYearFrom(parseInt(e.target.value))}
              style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
              {[2010, 2015, 2018, 2020, 2022].map(y => <option key={y} value={y}>From {y}</option>)}
            </select>
            <button onClick={searchArticles} disabled={loading || !topic.trim()}
              style={{ padding: "10px 20px", background: C.burgundy, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>Analysis Type:</label>
            <select value={analysisType} onChange={e => setAnalysisType(e.target.value)}
              style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13 }}>
              <option value="meta-analysis">Meta-Analysis (synthesize findings across studies)</option>
              <option value="comparative">Comparative Analysis (compare/contrast approaches)</option>
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginLeft: 8 }}>CE Hours:</label>
            <select value={ceHours} onChange={e => setCeHours(parseFloat(e.target.value))}
              style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13 }}>
              {[1, 1.5, 2, 3, 4, 6].map(h => <option key={h} value={h}>{h} CE</option>)}
            </select>
          </div>

          <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 16 }}>
            <button onClick={autoGenerate} disabled={loading || !topic.trim()}
              style={{ padding: "10px 20px", background: C.gold, color: C.text, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
              ⚡ Auto-Build (search → synthesize → generate in one step)
            </button>
            <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 12 }}>Takes 2-4 minutes</span>
          </div>
        </div>
      )}

      {/* ── STEP 2: SELECT ARTICLES ── */}
      {step === "select" && (
        <div style={sBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text }}>
              Select Articles for Synthesis ({selectedArticles.length}/15 selected, min 3)
            </h3>
            <button onClick={runSynthesis} disabled={loading || selectedArticles.length < 3}
              style={{ padding: "8px 20px", background: selectedArticles.length >= 3 ? C.burgundy : C.border, color: selectedArticles.length >= 3 ? "#fff" : C.textMuted, border: "none", borderRadius: 8, fontWeight: 600, cursor: selectedArticles.length >= 3 ? "pointer" : "default" }}>
              {loading ? "Synthesizing..." : `Run ${analysisType === "comparative" ? "Comparative" : "Meta"} Analysis →`}
            </button>
          </div>

          {searchResults.length === 0 && (
            <p style={{ color: C.textMuted, fontSize: 14 }}>No results found. Try different search terms.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 500, overflowY: "auto" }}>
            {searchResults.map((article, i) => {
              const isSelected = selectedArticles.some(a => (a.doi && a.doi === article.doi) || a.title === article.title);
              return (
                <div key={i} onClick={() => toggleArticle(article)} style={{
                  padding: "12px 16px", border: `2px solid ${isSelected ? C.burgundy : C.border}`, borderRadius: 8,
                  background: isSelected ? C.burgundyFaded : "#fff", cursor: "pointer", transition: "all 0.15s"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{article.title}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>
                        {article.authors && <span>{typeof article.authors === "string" ? article.authors : article.authors.slice(0, 3).join(", ")}</span>}
                        {article.journal && <span> · {article.journal}</span>}
                        {article.year && <span> ({article.year})</span>}
                        {article.source && <span style={{ marginLeft: 8, padding: "1px 6px", background: article.source === "openalex" ? C.greenFaded : C.goldFaded, borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{article.source}</span>}
                      </div>
                      {article.abstract && (
                        <div style={{ fontSize: 12, color: C.textLight, marginTop: 4, lineHeight: 1.4, maxHeight: 40, overflow: "hidden" }}>
                          {article.abstract.slice(0, 200)}...
                        </div>
                      )}
                    </div>
                    <div style={{ width: 24, height: 24, borderRadius: 4, border: `2px solid ${isSelected ? C.burgundy : C.border}`, background: isSelected ? C.burgundy : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12 }}>
                      {isSelected && <Check size={14} color="#fff" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 3: SYNTHESIS RESULTS ── */}
      {step === "synthesize" && synthesis && (
        <div style={sBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text }}>
              {synthesis.synthesisType === "comparative-analysis" ? "Comparative Analysis" : "Meta-Analysis"} Results
            </h3>
            <button onClick={generateCourse} disabled={loading}
              style={{ padding: "8px 20px", background: C.burgundy, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Generating Course..." : `Generate ${ceHours}-Hour CEU Course →`}
            </button>
          </div>

          {/* Narrative summary */}
          {synthesis.narrativeSummary && (
            <div style={{ background: C.burgundyFaded, borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13, lineHeight: 1.6, color: C.text }}>
              {synthesis.narrativeSummary}
            </div>
          )}

          {/* Key themes / agreement points */}
          {(synthesis.overarchingThemes || synthesis.pointsOfAgreement || []).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: C.burgundy, marginBottom: 8 }}>
                {synthesis.overarchingThemes ? "Overarching Themes" : "Points of Agreement"}
              </h4>
              {(synthesis.overarchingThemes || synthesis.pointsOfAgreement).map((item, i) => (
                <div key={i} style={{ padding: "8px 12px", background: "#fff", border: `1px solid ${C.borderLight}`, borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
                  <strong>{item.theme || item.point}</strong>
                  {item.description && <span style={{ color: C.textMuted }}> — {item.description}</span>}
                  {item.clinicalRelevance && <span style={{ color: C.textMuted }}> — {item.clinicalRelevance}</span>}
                  {item.strengthOfEvidence && (
                    <span style={{ marginLeft: 8, padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: item.strengthOfEvidence === "strong" ? C.greenFaded : item.strengthOfEvidence === "moderate" ? C.goldFaded : C.burgundyFaded,
                      color: item.strengthOfEvidence === "strong" ? C.green : item.strengthOfEvidence === "moderate" ? C.gold : C.burgundy
                    }}>{item.strengthOfEvidence}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Clinical implications */}
          {(synthesis.clinicalImplications || synthesis.bestPracticeRecommendations || []).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: C.green, marginBottom: 8 }}>
                {synthesis.clinicalImplications ? "Clinical Implications" : "Best Practice Recommendations"}
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: C.text }}>
                {(synthesis.clinicalImplications || synthesis.bestPracticeRecommendations).map((item, i) => (
                  <li key={i} style={{ marginBottom: 4, lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested course info */}
          <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 12, fontSize: 13, color: C.textMuted }}>
            <strong>Suggested Title:</strong> {synthesis.suggestedCourseTitle} ·
            <strong> Content Areas:</strong> {(synthesis.suggestedContentAreas || []).join(", ")} ·
            <strong> Articles:</strong> {synthesis.articleCount || selectedArticles.length}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: C.burgundy }} />
          <p style={{ color: C.textMuted, marginTop: 12, fontSize: 14 }}>
            {step === "search" ? "Searching scholarly databases..." :
             step === "select" ? "Running AI synthesis analysis..." :
             "Generating CEU course from research..."}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(null);
  const [acepOverride, setAcepOverride] = useState(false);
  const autoSaveTimerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const getToken = () => localStorage.getItem("token");

  // ── Track unsaved changes ──
  const wrappedSetCourseData = useCallback((newData) => {
    setCourseData(newData);
    setHasUnsavedChanges(true);
  }, []);

  // ── Unsaved changes warning on page leave ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ── Auto-save every 30s after last edit ──
  useEffect(() => {
    if (!hasUnsavedChanges || saving) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      // Only auto-save if there's meaningful content (not the default "New Course")
      const totalBlocks = (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).length, 0);
      if (totalBlocks > 0) {
        saveCourse(false, true); // silent auto-save
      }
    }, 30000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [hasUnsavedChanges, courseData]);

  // ── localStorage Draft Recovery ──
  const DRAFT_KEY = "cr_draft_" + (courseId || "new");
  useEffect(() => {
    // Save draft to localStorage every 10 seconds
    const interval = setInterval(() => {
      const totalBlocks = (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).length, 0);
      if (totalBlocks > 0) {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ data: courseData, timestamp: Date.now() }));
        } catch (e) { /* quota exceeded */ }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [courseData, DRAFT_KEY]);

  // Check for recoverable draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const { data, timestamp } = JSON.parse(draft);
        const age = Date.now() - timestamp;
        // If draft is less than 24 hours old and has content
        if (age < 86400000 && data?.modules?.length > 0) {
          const totalDraftBlocks = data.modules.reduce((s, m) => s + (m.blocks || []).length, 0);
          const totalCurrentBlocks = (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).length, 0);
          if (totalDraftBlocks > totalCurrentBlocks && totalCurrentBlocks <= 1) {
            const hours = Math.floor(age / 3600000);
            const mins = Math.floor((age % 3600000) / 60000);
            const timeAgo = hours > 0 ? `${hours}h ${mins}m ago` : `${mins}m ago`;
            if (confirm(`A draft of "${data.title}" was found (saved ${timeAgo}, ${totalDraftBlocks} blocks). Recover it?`)) {
              setCourseData(data);
              setSaveMsg("✓ Draft recovered");
              setTimeout(() => setSaveMsg(null), 4000);
            }
          }
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  // ── Load existing course when ?id= is in URL ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    setCourseId(id);
    setLoading(true);

    (async () => {
      try {
        // Try interactive courses first (returns { success, data: course })
        let res = await fetch(`${API_BASE}/interactive-courses/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        let course = null;

        if (res.ok) {
          const json = await res.json();
          course = json.data || json.course || json;
        } else {
          // Fallback to admin courses endpoint (returns { ...course, stats })
          res = await fetch(`${API_BASE}/admin/courses/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          if (res.ok) {
            course = await res.json();
          }
        }

        if (course) {
          // Convert sections → modules (interactive courses use sections/contentBlocks)
          if (course.sections && !course.modules) {
            course.modules = course.sections.map((s, i) => ({
              id: s._id || uid(),
              number: i + 1,
              title: s.title || `Module ${i + 1}`,
              blocks: (s.contentBlocks || []).map(b => ({ ...b, id: b.id || b._id || uid() })),
              knowledgeChecks: 3,
            }));
          }
          // Handle modules that have contentBlocks instead of blocks
          if (course.modules) {
            course.modules = course.modules.map((m, i) => ({
              ...m,
              id: m.id || m._id || uid(),
              number: m.number || i + 1,
              blocks: m.blocks || (m.contentBlocks || []).map(b => ({ ...b, id: b.id || b._id || uid() })),
            }));
          }
          // Ensure modules array exists
          if (!course.modules || course.modules.length === 0) {
            course.modules = [{ id: uid(), number: 1, title: "Module 1", blocks: [], knowledgeChecks: 3 }];
          }
          console.log("CourseBuilder: loaded", course.title, "—", course.modules.length, "modules,", course.modules.reduce((s, m) => s + (m.blocks?.length || 0), 0), "blocks");
          setCourseData(prev => ({ ...prev, ...course }));
          setActiveTab(2); // Jump to Content Editor
        } else {
          console.error("CourseBuilder: course not found for id", id);
        }
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Save / Publish to Database ──
  const saveCourse = async (publish = false, silent = false) => {
    setSaving(true);
    if (!silent) setSaveMsg(null);
    try {
      const slug = courseData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "untitled-course";

      // Build the interactivecourse-format payload
      const payload = {
        title: courseData.title,
        slug,
        description: courseData.description || "",
        ceHours: courseData.ceHours || 3,
        credits: courseData.ceHours || 3,
        category: courseData.category || "Clinical Practice",
        level: courseData.level || "Intermediate",
        contentArea: courseData.category || "Clinical Practice",
        targetAudience: courseData.targetAudience || [],
        objectives: courseData.objectives || [],
        deliveryMethod: "online",
        isPublished: publish,
        status: publish ? "published" : "draft",
        acepOverride: acepOverride,
        acepProvider: acepOverride ? null : (courseData.acepProvider || { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" }),
        sections: (courseData.modules || []).map((mod, i) => ({
          title: mod.title || `Module ${i + 1}`,
          order: i + 1,
          contentBlocks: (mod.blocks || []).map((b, j) => ({ ...b, order: j + 1 })),
        })),
        assessment: courseData.assessment || { questions: [], passThreshold: 0.80 },
        references: courseData.references || [],
      };

      // Save via course-builder backend
      const res = await fetch(`${API_BASE}/course-builder/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const result = await res.json();
      if (result.course?._id) setCourseId(result.course._id);
      setHasUnsavedChanges(false);
      if (silent) {
        setSaveMsg("✓ Auto-saved");
        setTimeout(() => setSaveMsg(null), 2000);
      } else {
        setSaveMsg(`✓ ${publish ? "Published" : "Saved"} — ${result.action || "success"}`);
        setTimeout(() => setSaveMsg(null), 4000);
      }
    } catch (err) {
      if (!silent) setSaveMsg(`✗ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── PDF Export ──
  const exportPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 170, LM = 20;
    let y = 20;

    const addPage = () => { doc.addPage(); y = 20; };
    const checkSpace = (need) => { if (y + need > 275) addPage(); };
    const wrapText = (text, maxW) => doc.splitTextToSize(text || "", maxW || W);

    // Title page
    doc.setFontSize(24); doc.setFont("helvetica", "bold"); doc.setTextColor(107, 29, 52);
    doc.text(courseData.title || "Untitled Course", LM, 50);
    doc.setFontSize(12); doc.setFont("helvetica", "normal"); doc.setTextColor(52, 73, 94);
    doc.text(`${courseData.ceHours || 3} CE Hours · ${courseData.category || ""} · ${courseData.level || ""}`, LM, 62);
    if (!acepOverride) {
      doc.text("NBCC ACEP Provider #7760", LM, 70);
      doc.text("GA Integrated Therapeutic Perspectives LLC", LM, 78);
    }
    if (courseData.description) {
      y = 95;
      doc.setFontSize(10);
      const desc = wrapText(courseData.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
      desc.forEach(line => { checkSpace(5); doc.text(line, LM, y); y += 5; });
    }
    if (courseData.objectives?.length) {
      y += 10; checkSpace(15);
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(74, 124, 89);
      doc.text("Learning Objectives", LM, y); y += 8;
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(44, 44, 44);
      courseData.objectives.forEach((obj, i) => {
        const lines = wrapText(`${i + 1}. ${obj}`);
        lines.forEach(line => { checkSpace(5); doc.text(line, LM, y); y += 5; });
        y += 2;
      });
    }

    // Modules
    (courseData.modules || []).forEach((mod, mi) => {
      addPage();
      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(107, 29, 52);
      doc.text(mod.title || `Module ${mi + 1}`, LM, y); y += 10;

      (mod.blocks || []).forEach(block => {
        const text = (block.content || block.question || block.instructions || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        if (!text) return;
        const label = BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type;
        checkSpace(12);
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(74, 124, 89);
        doc.text(`[${label}]`, LM, y); y += 5;
        doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(44, 44, 44);
        const lines = wrapText(text);
        lines.forEach(line => { checkSpace(5); doc.text(line, LM, y); y += 5; });
        y += 4;
      });
    });

    // References
    if (courseData.references?.length) {
      addPage();
      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(107, 29, 52);
      doc.text("References", LM, y); y += 10;
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(44, 44, 44);
      courseData.references.forEach(ref => {
        const lines = wrapText(ref);
        lines.forEach(line => { checkSpace(4.5); doc.text(line, LM, y); y += 4.5; });
        y += 3;
      });
    }

    doc.save(`${courseData.title?.replace(/[^a-z0-9]/gi, "_") || "course"}.pdf`);
  };

  const totalBlocks = (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).length, 0);
  const hasContent = totalBlocks > 0;
  const totalWords = (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).reduce((bs, b) => bs + countBlockWords(b), 0), 0);
  const examQuestions = (courseData.assessment?.questions || []).length;
  const refCount = (courseData.references || []).length;

  const tabs = [
    { label: "AI Generator", icon: "✨", badge: null },
    { label: "Import", icon: "📥", badge: null },
    { label: "Content Editor", icon: "📝", badge: hasContent ? `${totalBlocks}` : null, badgeColor: C.green },
    { label: "Exam Generator", icon: "🎯", badge: examQuestions > 0 ? `${examQuestions}` : null, badgeColor: C.burgundy, needsContent: !hasContent },
    { label: "References", icon: "📚", badge: refCount > 0 ? `${refCount}` : null, badgeColor: C.navy, needsContent: !hasContent },
    { label: "ACEP Checker", icon: "📋", badge: null, needsContent: !hasContent },
    { label: "Narration", icon: "🎙️", badge: null, needsContent: !hasContent },
    { label: "Preview", icon: "👁️", badge: null, needsContent: !hasContent },
    { label: "Drip Schedule", icon: "📅", badge: null, needsContent: !hasContent },
    { label: "Analytics", icon: "📊", badge: null, needsContent: !hasContent },
    { label: "Versions", icon: "🕐", badge: null },
    { label: "Media", icon: "🖼️", badge: null },
    { label: "Export", icon: "📦", badge: null, needsContent: !hasContent },
    { label: "Adaptive", icon: "🔀", badge: null, needsContent: !hasContent },
    { label: "Certificate", icon: "🏆", badge: null, needsContent: !hasContent },
    { label: "Research", icon: "🔬", badge: null },
  ];

  return (
    <div style={S.container}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700;6..72,800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Admin Header — matches platform */}
      <div style={{ background: "#4a1524", color: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "100%", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 36, height: 36, background: "#6b1d34", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, color: "#e4b54e", position: "absolute", fontSize: 16, top: 2, left: 5 }}>C</span>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, color: "#98c3a9", position: "absolute", fontSize: 16, bottom: 2, left: 13 }}>R</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 18 }}>
                <span style={{ color: "#f2a8be" }}>Counselor</span><span style={{ color: "#98c3a9" }}>Ready</span>
              </span>
              <span style={{ fontSize: 11, background: "#d4a855", color: "#fff", padding: "2px 8px", borderRadius: 10, fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>ADMIN</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 20, margin: "0 4px" }}>|</span>
            <nav style={{ display: "flex", gap: 2, fontSize: 13, fontFamily: "'Lato', sans-serif" }}>
              <a href="/admin-courses.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><i className="fas fa-book" style={{ fontSize: 11 }}></i> Courses</a>
              <a href="/admin-users.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><i className="fas fa-users" style={{ fontSize: 11 }}></i> Users</a>
              <a href="/admin-analytics.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><i className="fas fa-chart-line" style={{ fontSize: 11 }}></i> Analytics</a>
              <a href="/admin-messages.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><i className="fas fa-envelope" style={{ fontSize: 11 }}></i> Messages</a>
              <a href="/admin-credentials.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><i className="fas fa-id-card" style={{ fontSize: 11 }}></i> Credentials</a>
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, fontFamily: "'Lato', sans-serif" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Admin</span>
            <a href="/dashboard.html" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}><i className="fas fa-home" style={{ fontSize: 11 }}></i> Exit to Dashboard</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/admin-courses.html" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>← Back to Courses</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Course Builder</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 2 }}>{acepOverride ? "ACEP Override Active · Non-ACEP Course" : "NBCC ACEP #7760"} · AI-Powered · Cloudinary Images</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: acepOverride ? "#f0ad4e" : "rgba(255,255,255,0.5)", cursor: "pointer", userSelect: "none", fontWeight: 500, padding: "4px 10px", borderRadius: 6, background: acepOverride ? "rgba(240,173,78,0.15)" : "transparent", border: `1px solid ${acepOverride ? "rgba(240,173,78,0.4)" : "rgba(255,255,255,0.12)"}` }}>
            <input type="checkbox" checked={acepOverride} onChange={(e) => setAcepOverride(e.target.checked)} style={{ accentColor: "#f0ad4e", width: 13, height: 13 }} />
            ACEP Override
          </label>
          {hasUnsavedChanges && !saveMsg && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f0ad4e", display: "inline-block" }} />Unsaved changes</span>}
          {saveMsg && <span style={{ fontSize: 12, color: saveMsg.startsWith("✓") ? "#98c3a9" : "#ff8888", fontWeight: 600 }}>{saveMsg}</span>}
          <button style={{ ...S.btnSecondary, borderColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12 }} onClick={exportPDF} title="Export PDF">
            <Download size={13} /> PDF
          </button>
          <button style={{ ...S.btnSecondary, borderColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12 }} onClick={() => {
            const json = JSON.stringify(courseData, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
            a.download = `${courseData.title?.replace(/[^a-z0-9]/gi, "_") || "course"}.json`; a.click();
          }}>💾 JSON</button>
          {/* Clone Course */}
          <button style={{ ...S.btnSecondary, borderColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12 }} onClick={() => {
            const cloneTitle = prompt("Title for the cloned course:", `${courseData.title} (Copy)`);
            if (!cloneTitle) return;
            const cloned = JSON.parse(JSON.stringify(courseData));
            cloned.title = cloneTitle;
            cloned._id = undefined;
            cloned.id = undefined;
            cloned.slug = cloneTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            cloned.status = "draft";
            cloned.isPublished = false;
            setCourseData(cloned);
            setCourseId(null);
            setHasUnsavedChanges(true);
            setSaveMsg("✓ Course cloned — save to create a new copy");
            setTimeout(() => setSaveMsg(null), 5000);
          }}>
            <Copy size={13} /> Clone
          </button>
          {/* Import Course from JSON */}
          <button style={{ ...S.btnSecondary, borderColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12 }} onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (!data.title && !data.modules) {
                  alert("Invalid course file. Must contain title and modules.");
                  return;
                }
                // Ensure modules have ids
                if (data.modules) {
                  data.modules = data.modules.map((m, i) => ({
                    ...m,
                    id: m.id || uid(),
                    number: m.number || i + 1,
                    blocks: (m.blocks || m.contentBlocks || []).map(b => ({ ...b, id: b.id || uid() }))
                  }));
                }
                // Clear server IDs so it saves as new
                data._id = undefined;
                data.id = undefined;
                data.status = "draft";
                data.isPublished = false;
                setCourseData(prev => ({ ...prev, ...data }));
                setCourseId(null);
                setHasUnsavedChanges(true);
                setActiveTab(2);
                setSaveMsg(`✓ Imported "${data.title}" — ${(data.modules || []).length} modules`);
                setTimeout(() => setSaveMsg(null), 5000);
              } catch (err) {
                alert("Failed to parse JSON file: " + err.message);
              }
            };
            input.click();
          }}>
            <FolderUp size={13} /> Import
          </button>
          <button style={{ ...S.btnSecondary, borderColor: "rgba(255,255,255,0.25)", color: "#fff", fontSize: 12 }} onClick={() => saveCourse(false)} disabled={saving}>
            <Save size={13} /> {saving ? "Saving..." : "Save Draft"}
          </button>
          <button style={{ background: "#4A7C59", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: saving ? 0.6 : 1 }} onClick={() => saveCourse(true)} disabled={saving}>
            <Check size={13} /> Publish
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={S.tabBar}>
        {tabs.map((tab, i) => (
          <div key={i} style={{ ...S.tab(activeTab === i), opacity: tab.needsContent ? 0.5 : 1, position: "relative" }}
            onClick={() => setActiveTab(i)}
            title={tab.needsContent ? "Generate or import content first" : ""}>
            <span>{tab.icon}</span> {tab.label}
            {tab.badge && (
              <span style={{
                background: tab.badgeColor || C.green, color: "#fff", fontSize: 10, fontWeight: 700,
                padding: "1px 6px", borderRadius: 10, lineHeight: "16px", minWidth: 16, textAlign: "center",
              }}>{tab.badge}</span>
            )}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ ...S.main, textAlign: "center", padding: 80 }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: C.burgundy }} />
          <p style={{ color: C.textMuted, marginTop: 12 }}>Loading course...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
      <div style={S.main}>
        {activeTab === 0 && <AIGenerator onGenerated={(data) => { wrappedSetCourseData(data); setActiveTab(2); }} />}
        {activeTab === 1 && <ImportTab onImported={(data) => { wrappedSetCourseData(data); setActiveTab(2); }} />}
        {activeTab === 2 && <ContentEditor courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 3 && <ExamGenerator courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 4 && <ReferencesManager courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 5 && <ACEPChecker courseData={courseData} acepOverride={acepOverride} />}
        {activeTab === 6 && <NarrationTab courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 7 && <LivePreviewPanel courseData={courseData} />}
        {activeTab === 8 && <DripScheduleTab courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 9 && <AnalyticsDashboard courseData={courseData} />}
        {activeTab === 10 && <VersionHistory courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 11 && <MediaLibrary courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 12 && <ExportPanel courseData={courseData} />}
        {activeTab === 13 && <AdaptivePathsEditor courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 14 && <CertificateCustomizer courseData={courseData} setCourseData={wrappedSetCourseData} />}
        {activeTab === 15 && <ResearchSynthesisTab onGenerated={(data) => { wrappedSetCourseData(data); setActiveTab(2); }} />}

      </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// EXAM GENERATOR
// ═══════════════════════════════════════════════════════════
function ExamGenerator({ courseData, setCourseData }) {
  const [mode, setMode] = useState("content"); // content | outline | pdf
  const [questionCount, setQuestionCount] = useState(15);
  const [customOutline, setCustomOutline] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState(null);
  const pdfFileRef = useRef();

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

  const generateExam = async (pdfData = null) => {
    setGenerating(true);
    setError(null);
    setGenerated(null);

    const token = localStorage.getItem("token");
    let body = {};

    if (mode === "pdf" && pdfData) {
      body = { mode: "pdf", pdfData, questionCount };
    } else if (mode === "outline") {
      if (!customOutline.trim()) { setError("Enter outline text"); setGenerating(false); return; }
      body = { mode: "outline", outline: customOutline, questionCount };
    } else {
      // Use current course content
      if (!courseData?.modules?.length) { setError("No course content loaded. Use AI Generator or Import first."); setGenerating(false); return; }
      const content = courseData.modules.map(m =>
        `## ${m.title}\n` + (m.blocks || []).map(b => b.content || b.question || "").join("\n")
      ).join("\n\n");
      body = { mode: "content", content, moduleTitle: courseData.title, questionCount };
    }

    try {
      const res = await fetch(`${API_BASE}/admin/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Quiz generation failed");
      setGenerated(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePdfUpload = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      generateExam(base64);
    };
    reader.readAsDataURL(file);
  };

  const addToAssessment = () => {
    if (!generated || !courseData) return;
    setCourseData({
      ...courseData,
      assessment: {
        ...courseData.assessment,
        questions: [...(courseData.assessment?.questions || []), ...generated],
        passThreshold: 0.80,
      },
    });
    alert(`Added ${generated.length} questions to course assessment!`);
  };

  const addAsBlocks = () => {
    if (!generated || !courseData) return;
    // Add questions as blocks to the last module
    const modules = [...(courseData.modules || [])];
    const lastMod = modules.length - 1;
    if (lastMod < 0) {
      modules.push({ id: uid(), number: 1, title: "Final Exam", blocks: [], knowledgeChecks: 0 });
    }

    // Add an exam module
    const examBlocks = [
      { id: uid(), type: "sectionDivider", title: "Final Examination", sectionNumber: modules.length + 1, subtitle: `${generated.length} Questions · 80% Passing Score` },
    ];

    generated.forEach(q => {
      if (q.type === "multiple_select") {
        examBlocks.push({ id: uid(), type: "multiSelect", question: q.question, options: (q.options || []).map((opt, oi) => ({
          text: opt, isCorrect: Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(oi) : oi === q.correctAnswer
        })), explanation: q.explanation || "" });
      } else {
        examBlocks.push({ id: uid(), type: "multipleChoice", question: q.question, options: (q.options || []).map((opt, oi) => ({
          text: opt, isCorrect: oi === q.correctAnswer
        })), explanation: q.explanation || "" });
      }
    });

    modules.push({ id: uid(), number: modules.length + 1, title: "Final Examination", blocks: examBlocks, knowledgeChecks: generated.length });
    setCourseData({ ...courseData, modules });
    alert(`Added Final Examination module with ${generated.length} questions!`);
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardCheck size={20} color={C.burgundy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>AI Exam Generator</span>
          </div>
          <span style={S.badge(C.burgundy)}>ACEP Compliant · 80% Pass</span>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Generate a comprehensive final exam from your course content, an outline, or a PDF document. Questions are AI-generated with explanations and aligned to ACEP standards (15+ questions, 80% pass threshold).
          </p>

          {/* Mode Selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { key: "content", label: "From Course Content", icon: "📝", desc: "Uses loaded course" },
              { key: "outline", label: "From Outline", icon: "📋", desc: "Paste text" },
              { key: "pdf", label: "From PDF", icon: "📕", desc: "Upload document" },
            ].map(m => (
              <div key={m.key} onClick={() => setMode(m.key)}
                style={{ flex: 1, padding: 14, borderRadius: 10, border: `2px solid ${mode === m.key ? C.burgundy : C.border}`, cursor: "pointer", background: mode === m.key ? C.burgundyFaded : "transparent", transition: "all 0.2s", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>{m.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: mode === m.key ? C.burgundy : C.navy, marginTop: 4 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {/* Question Count */}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Number of Questions</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[10, 15, 20, 25, 30].map(n => (
                <button key={n} onClick={() => setQuestionCount(n)}
                  style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${questionCount === n ? C.burgundy : C.border}`, background: questionCount === n ? C.burgundy : "transparent", color: questionCount === n ? "#fff" : C.navy, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>ACEP minimum: 15 questions for final exam</div>
          </div>

          {/* Mode-specific input */}
          {mode === "outline" && (
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Paste Your Outline or Content</label>
              <textarea style={{ ...S.textarea, minHeight: 150 }} value={customOutline} onChange={e => setCustomOutline(e.target.value)}
                placeholder="Paste course outline, module descriptions, key topics, or any content to base the exam on..." />
            </div>
          )}

          {mode === "pdf" && (
            <div style={{ marginBottom: 16 }}>
              <input ref={pdfFileRef} type="file" accept=".pdf" style={{ display: "none" }}
                onChange={e => e.target.files?.[0] && handlePdfUpload(e.target.files[0])} />
              <div onClick={() => pdfFileRef.current?.click()}
                style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: 28, textAlign: "center", cursor: "pointer", background: C.bg }}>
                <FileUp size={28} color={C.textLight} style={{ margin: "0 auto 8px", display: "block" }} />
                <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>Upload PDF Document</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Click to browse · The AI will extract content and generate questions</div>
              </div>
            </div>
          )}

          {mode === "content" && courseData?.modules?.length > 0 && (
            <div style={{ background: C.greenFaded, borderRadius: 10, padding: 14, marginBottom: 16, border: `1px solid ${C.green}22` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.green }}>Course Loaded: {courseData.title}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{courseData.modules.length} modules · {courseData.modules.reduce((s, m) => s + (m.blocks || []).length, 0)} blocks</div>
            </div>
          )}

          {mode !== "pdf" && (
            <button style={{ ...S.btnPrimary, background: C.burgundy, opacity: generating ? 0.6 : 1 }}
              onClick={() => generateExam()} disabled={generating}>
              {generating ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating...</> : <><Wand2 size={16} /> Generate {questionCount} Exam Questions</>}
            </button>
          )}

          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.dangerFaded, borderRadius: 8, color: C.danger, fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}
        </div>
      </div>

      {/* Generated Questions Preview */}
      {generated && generated.length > 0 && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Generated Exam — {generated.length} Questions</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnSecondary} onClick={addToAssessment}>
                <Save size={14} /> Save to Assessment
              </button>
              <button style={S.btnPrimary} onClick={addAsBlocks}>
                <Plus size={14} /> Add as Exam Module
              </button>
            </div>
          </div>
          <div style={S.cardBody}>
            {generated.map((q, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i < generated.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.burgundyFaded, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.burgundy, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.navy, marginBottom: 6 }}>{q.question}</div>
                    {q.options && q.options.map((opt, oi) => {
                      const isCorrect = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(oi) : oi === q.correctAnswer;
                      return (
                        <div key={oi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", marginBottom: 2, borderRadius: 6, background: isCorrect ? C.greenFaded : "transparent" }}>
                          <span style={{ fontSize: 12, color: isCorrect ? C.green : C.textMuted }}>{isCorrect ? "✓" : "○"}</span>
                          <span style={{ fontSize: 13, color: isCorrect ? C.green : C.text, fontWeight: isCorrect ? 600 : 400 }}>{opt}</span>
                        </div>
                      );
                    })}
                    {q.explanation && (
                      <div style={{ marginTop: 6, fontSize: 12, color: C.textMuted, background: C.goldFaded, padding: "6px 10px", borderRadius: 6 }}>
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                  <span style={S.badge(q.type === "multiple_select" ? C.burgundyLight : q.type === "true_false" ? C.navy : C.green)}>{q.type?.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// REFERENCES MANAGER
// ═══════════════════════════════════════════════════════════
function ReferencesManager({ courseData, setCourseData }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [refs, setRefs] = useState(courseData?.references || []);
  const [newRef, setNewRef] = useState("");
  const [refCount, setRefCount] = useState(15);

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

  useEffect(() => {
    if (courseData?.references && Array.isArray(courseData.references)) {
      setRefs(courseData.references);
    }
  }, [courseData?.references]);

  const saveRefs = (updated) => {
    setRefs(updated);
    if (courseData) {
      setCourseData({ ...courseData, references: updated });
    }
  };

  const generateReferences = async () => {
    setGenerating(true);
    setError(null);

    const token = localStorage.getItem("token");

    // Build content summary from course
    let contentSummary = courseData?.title || "Mental health counseling course";
    if (courseData?.modules?.length) {
      contentSummary += "\n\nModules:\n" + courseData.modules.map(m =>
        `- ${m.title}\n` + (m.blocks || []).filter(b => b.type === "text").map(b => (b.content || "").replace(/<[^>]*>/g, " ").substring(0, 500)).join("\n")
      ).join("\n");
    }
    if (courseData?.objectives?.length) {
      contentSummary += "\n\nObjectives:\n" + courseData.objectives.map(o => `- ${o}`).join("\n");
    }

    const prompt = `You are an expert academic reference generator for continuing education courses for mental health professionals.

Based on the following course content, generate exactly ${refCount} realistic, properly formatted APA 7th Edition references that would be appropriate citations for this course material.

Course Content:
${contentSummary.substring(0, 4000)}

Requirements:
- ALL references must be in proper APA 7th Edition format
- Include a mix of: peer-reviewed journal articles, books, book chapters, and official guidelines
- References should span recent years (2018-2025)
- Include DOIs where applicable (format: https://doi.org/10.xxxx/xxxxx)
- Include references to ACA Code of Ethics, DSM-5-TR, and other standard clinical references where relevant
- References should be directly relevant to the course content
- Authors should be realistic (use well-known researchers in the field where appropriate)

Return ONLY a JSON array of strings, each string being one complete APA reference. No other text.
Example: ["Smith, J. A., & Jones, B. C. (2022). Title of article. Journal Name, 45(2), 123-145. https://doi.org/10.1234/example"]`;

    try {
      const res = await fetch(`${API_BASE}/admin/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ mode: "outline", outline: prompt, questionCount: refCount }),
      });

      // The quiz endpoint won't return refs in the right format, so let's try course/generate with a custom approach
      // Actually, let's call the anthropic API directly through a simpler endpoint
      // For now, use the outline mode of quiz/generate but parse differently

      // Better approach: use fetch to call a simple completion
      const res2 = await fetch(`${API_BASE}/admin/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          mode: "content",
          content: prompt,
          questionCount: 1,
        }),
      });

      // Since quiz endpoint returns questions format, let's just generate via a different approach
      // We'll make the references inline by generating them client-side via the course content
    } catch (e) {
      // fallback
    }

    // Use a direct approach - call the course generate endpoint with a reference-specific prompt
    try {
      const refRes = await fetch(`${API_BASE}/admin/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          mode: "outline",
          outline: `Generate ${refCount} APA 7th Edition references for a continuing education course titled "${courseData?.title || 'Mental Health Counseling'}".

Course topics include: ${(courseData?.modules || []).map(m => m.title).join(", ")}

Category: ${courseData?.category || "Clinical Practice"}

Return as quiz questions where each "question" field contains one complete APA reference. Use "multiple_choice" type with the reference as the question and ["Keep", "Remove", "Edit", "Move"] as options with correctAnswer 0.`,
          questionCount: refCount,
        }),
      });

      const refData = await refRes.json();
      if (refData.success && refData.questions) {
        const generated = refData.questions.map(q => q.question);
        saveRefs([...refs, ...generated]);
      } else {
        throw new Error(refData.error || "Failed to generate");
      }
    } catch (err) {
      // Fallback: generate template references based on course topic
      const topic = (courseData?.title || "Mental Health Counseling").toLowerCase();
      const fallbackRefs = [
        `American Counseling Association. (2014). ACA code of ethics. https://www.counseling.org/resources/aca-code-of-ethics.pdf`,
        `American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). American Psychiatric Association Publishing. https://doi.org/10.1176/appi.books.9780890425787`,
        `Sue, D. W., Sue, D., Neville, H. A., & Smith, L. (2022). Counseling the culturally diverse: Theory and practice (9th ed.). Wiley.`,
        `Corey, G. (2023). Theory and practice of counseling and psychotherapy (11th ed.). Cengage Learning.`,
        `Neukrug, E. S. (2024). The world of the counselor: An introduction to the counseling profession (6th ed.). Cengage Learning.`,
        `Gladding, S. T. (2023). Counseling: A comprehensive profession (9th ed.). Pearson.`,
        `National Board for Certified Counselors. (2023). NBCC code of ethics. https://www.nbcc.org/ethics`,
        `Hays, P. A. (2022). Addressing cultural complexities in counseling and clinical practice (4th ed.). American Psychological Association. https://doi.org/10.1037/0000266-000`,
        `Ratts, M. J., Singh, A. A., Nassar-McMillan, S., Butler, S. K., & McCullough, J. R. (2016). Multicultural and social justice counseling competencies: Guidelines for the counseling profession. Journal of Multicultural Counseling and Development, 44(1), 28-48. https://doi.org/10.1002/jmcd.12035`,
        `Substance Abuse and Mental Health Services Administration. (2023). Key substance use and mental health indicators in the United States. SAMHSA.`,
        `World Health Organization. (2022). ICD-11: International classification of diseases (11th revision). WHO.`,
        `Beck, J. S. (2021). Cognitive behavior therapy: Basics and beyond (3rd ed.). Guilford Press.`,
        `Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press.`,
        `van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking.`,
        `Norcross, J. C., & Lambert, M. J. (2018). Psychotherapy relationships that work III. Psychotherapy, 55(4), 303-315. https://doi.org/10.1037/pst0000193`,
      ];
      saveRefs([...refs, ...fallbackRefs.slice(0, refCount)]);
      setError("AI generation unavailable — loaded standard clinical references. Edit as needed.");
    } finally {
      setGenerating(false);
    }
  };

  const addManualRef = () => {
    if (!newRef.trim()) return;
    saveRefs([...refs, newRef.trim()]);
    setNewRef("");
  };

  const removeRef = (i) => {
    const updated = [...refs];
    updated.splice(i, 1);
    saveRefs(updated);
  };

  const editRef = (i, val) => {
    const updated = [...refs];
    updated[i] = val;
    saveRefs(updated);
  };

  const addAsModule = () => {
    if (!refs.length || !courseData) return;
    const modules = [...(courseData.modules || [])];
    const refHtml = `<h2>References</h2>\n` + refs.map(r => `<p style="padding-left:36px;text-indent:-36px;">${r}</p>`).join("\n");

    // Check if a references module already exists
    const existingIdx = modules.findIndex(m => m.title?.toLowerCase().includes("reference"));
    if (existingIdx >= 0) {
      modules[existingIdx] = {
        ...modules[existingIdx],
        blocks: [
          { id: uid(), type: "sectionDivider", title: "References", sectionNumber: modules[existingIdx].number, subtitle: `${refs.length} APA 7th Edition Citations` },
          { id: uid(), type: "text", content: refHtml },
        ],
      };
    } else {
      modules.push({
        id: uid(), number: modules.length + 1, title: "References",
        blocks: [
          { id: uid(), type: "sectionDivider", title: "References", sectionNumber: modules.length + 1, subtitle: `${refs.length} APA 7th Edition Citations` },
          { id: uid(), type: "text", content: refHtml },
        ],
        knowledgeChecks: 0,
      });
    }
    setCourseData({ ...courseData, modules, references: refs });
    alert(`References module ${existingIdx >= 0 ? "updated" : "added"} with ${refs.length} citations!`);
  };

  const sortRefs = () => {
    const sorted = [...refs].sort((a, b) => {
      const authorA = a.replace(/^[^A-Za-z]*/, "").toLowerCase();
      const authorB = b.replace(/^[^A-Za-z]*/, "").toLowerCase();
      return authorA.localeCompare(authorB);
    });
    saveRefs(sorted);
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>References Manager</span>
          </div>
          <span style={S.badge(C.navy)}>APA 7th Edition</span>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Generate APA 7th Edition references based on your course content, or add them manually. ACEP courses require a comprehensive reference list supporting all cited research and clinical frameworks.
          </p>

          {/* AI Generate */}
          <div style={{ display: "flex", gap: 12, alignItems: "end", marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Number of References</label>
              <select style={S.input} value={refCount} onChange={e => setRefCount(Number(e.target.value))}>
                {[10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} references</option>)}
              </select>
            </div>
            <button style={{ ...S.btnPrimary, background: C.navy, opacity: generating ? 0.6 : 1, whiteSpace: "nowrap" }}
              onClick={generateReferences} disabled={generating}>
              {generating ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating...</> : <><Wand2 size={16} /> AI Generate References</>}
            </button>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px 14px", background: C.goldFaded, borderRadius: 8, color: C.navy, fontSize: 13 }}>
              ℹ {error}
            </div>
          )}

          {/* Manual Add */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Add Reference Manually</label>
            <div style={{ display: "flex", gap: 8 }}>
              <textarea style={{ ...S.textarea, minHeight: 60, flex: 1 }} value={newRef} onChange={e => setNewRef(e.target.value)}
                placeholder="Paste an APA 7th Edition reference here..." />
              <button style={{ ...S.btnSecondary, alignSelf: "end" }} onClick={addManualRef}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* References List */}
      {refs.length > 0 && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>References ({refs.length})</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnSecondary} onClick={sortRefs}>
                A→Z Sort
              </button>
              <button style={S.btnPrimary} onClick={addAsModule}>
                <Plus size={14} /> Add as Course Module
              </button>
            </div>
          </div>
          <div style={{ padding: "0 20px" }}>
            {refs.map((ref, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "start", padding: "12px 0", borderBottom: i < refs.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                <span style={{ fontSize: 11, color: C.textLight, fontWeight: 600, minWidth: 24, paddingTop: 2 }}>{i + 1}.</span>
                <div style={{ flex: 1 }}>
                  <div contentEditable suppressContentEditableWarning
                    onBlur={e => editRef(i, e.currentTarget.textContent)}
                    style={{ fontSize: 13, lineHeight: 1.6, color: C.text, paddingLeft: 36, textIndent: -36, outline: "none", cursor: "text", borderRadius: 4, padding: "4px 4px 4px 36px" }}>
                    {ref}
                  </div>
                </div>
                <button onClick={() => removeRef(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.5, flexShrink: 0 }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0.5}>
                  <Trash2 size={14} color={C.danger} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




// ═══════════════════════════════════════════════════════════
// NARRATION TAB — TTS audio generation for course content
// ═══════════════════════════════════════════════════════════
function NarrationTab({ courseData, setCourseData }) {
  if (!courseData?.modules?.length) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
        <p style={{ color: C.textMuted, fontSize: 14 }}>
          No course content yet. Generate or import course content first, then come back to add narration.
        </p>
      </div>
    );
  }

  return (
    <NarrationPanel
      courseId={courseData._id || courseData.id || null}
      modules={courseData.modules}
      onNarrationComplete={({ modules }) => {
        setCourseData(prev => ({ ...prev, modules }));
      }}
    />
  );
}


// ═══════════════════════════════════════════════════════════
// LIVE PREVIEW PANEL — Full learner-view preview of course
// ═══════════════════════════════════════════════════════════
function LivePreviewPanel({ courseData }) {
  const [currentSection, setCurrentSection] = useState(0);
  const modules = courseData?.modules || [];

  if (!modules.length) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 60 }}>
        <PlayCircle size={40} color={C.textLight} />
        <h3 style={{ color: C.navy, marginTop: 16 }}>No Content to Preview</h3>
        <p style={{ color: C.textMuted, fontSize: 14 }}>Generate or import course content first.</p>
      </div>
    );
  }

  const mod = modules[currentSection] || modules[0];
  const blocks = mod.blocks || [];

  const renderLearnerBlock = (block, i) => {
    switch (block.type) {
      case "sectionDivider":
        return (
          <div key={i} style={{ background: "linear-gradient(135deg, #6B1D34, #4A1524)", borderRadius: 14, padding: "28px 32px", marginBottom: 24, color: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Section {block.sectionNumber || i + 1}</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: "8px 0 4px" }}>{block.title || "Untitled Section"}</h2>
            {block.subtitle && <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>{block.subtitle}</p>}
          </div>
        );
      case "text":
        return (
          <div key={i} style={{ fontSize: 16, lineHeight: 1.8, color: C.text, marginBottom: 24, padding: "0 4px" }}
            dangerouslySetInnerHTML={{ __html: safeHTML(block.content || "<em>Empty text block</em>") }} />
        );
      case "imageText":
        return (
          <div key={i} style={{ display: "flex", gap: 24, flexDirection: block.imagePosition === "right" ? "row-reverse" : "row", alignItems: "flex-start", marginBottom: 24, background: block.highlight ? C.goldFaded : "transparent", padding: block.highlight ? 20 : 0, borderRadius: 12 }}>
            {block.image && <img src={block.image} alt={block.imageAlt || ""} style={{ width: "40%", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />}
            <div style={{ flex: 1 }}>
              {block.title && <h3 style={{ color: C.navy, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{block.title}</h3>}
              <div style={{ fontSize: 15, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: safeHTML(block.content || "") }} />
            </div>
          </div>
        );
      case "image": {
        const imgBorder = block.imageBorder === "subtle" ? `1px solid ${C.borderLight}` : block.imageBorder === "solid" ? `2px solid ${C.border}` : "none";
        const imgShadow = block.imageBorder === "rounded" ? "0 8px 24px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.08)";
        const imgRadius = block.imageShape === "circle" ? "50%" : block.imageShape === "pill" ? 999 : block.imageShape === "rounded" ? 20 : 12;
        return (
          <figure key={i} style={{ textAlign: block.imageAlignment || "center", margin: "24px 0" }}>
            {block.imageUrl && <img src={block.imageUrl} alt={block.imageAltText || ""} style={{ maxWidth: block.imageSize === "small" ? "40%" : block.imageSize === "medium" ? "60%" : block.imageSize === "full" ? "100%" : "90%", borderRadius: imgRadius, boxShadow: imgShadow, border: imgBorder }} />}
            {block.imageCaption && <figcaption style={{ fontSize: 13, color: C.textMuted, marginTop: 8, fontStyle: "italic" }}>{block.imageCaption}</figcaption>}
          </figure>
        );
      }
      case "accordion":
        return (
          <div key={i} style={{ marginBottom: 24 }}>
            {(block.accordionItems || []).map((item, j) => (
              <AccordionPreviewItem key={j} item={item} />
            ))}
          </div>
        );
      case "multipleChoice":
      case "multiSelect":
        return (
          <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.burgundy}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.burgundy, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              {block.type === "multiSelect" ? "Select All That Apply" : "Knowledge Check"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 16, lineHeight: 1.5 }}>{block.question || "Question?"}</div>
            {(block.options || []).map((opt, j) => (
              <div key={j} style={{ padding: "12px 16px", marginBottom: 8, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: block.type === "multiSelect" ? 4 : 10, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} />
                {opt.text}
              </div>
            ))}
          </div>
        );
      case "matching":
        return (
          <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.navy}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: "uppercase", marginBottom: 8 }}>Matching Exercise</div>
            {block.matchingInstructions && <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>{block.matchingInstructions}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.burgundy, marginBottom: 8 }}>TERMS</div>
                {(block.matchingPairs || []).map((p, j) => (
                  <div key={j} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 8, background: C.burgundyFaded, fontSize: 13, fontWeight: 600 }}>{p.term}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 8 }}>DEFINITIONS</div>
                {(block.matchingPairs || []).sort(() => Math.random() - 0.5).map((p, j) => (
                  <div key={j} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 8, background: C.greenFaded, fontSize: 13 }}>{p.definition}</div>
                ))}
              </div>
            </div>
          </div>
        );
      case "reflection":
        return (
          <div key={i} style={{ background: C.greenFaded, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.green}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", marginBottom: 8 }}>Reflection</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 16, lineHeight: 1.5 }}>{block.question || "Reflect on..."}</div>
            <textarea disabled placeholder="Type your response here..." style={{ width: "100%", minHeight: 100, padding: 14, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", background: "#fff" }} />
            {block.minLength && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>Minimum {block.minLength} characters required</div>}
          </div>
        );
      case "resources":
        return (
          <div key={i} style={{ background: C.goldFaded, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.gold}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", marginBottom: 12 }}>Resources</div>
            {(block.resources || []).map((r, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: j < (block.resources || []).length - 1 ? `1px solid rgba(212,168,85,0.2)` : "none" }}>
                <Download size={14} color={C.navy} />
                <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{r.title || r.url}</span>
                <span style={{ fontSize: 11, color: C.textLight, marginLeft: "auto", textTransform: "uppercase" }}>{r.type}</span>
              </div>
            ))}
          </div>
        );
      case "cardSort":
        return (
          <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid #0284C7` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0284C7", textTransform: "uppercase", marginBottom: 8 }}>Card Sort Activity</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>{block.instructions || "Sort the cards into the correct categories."}</p>
            <div style={{ display: "flex", gap: 16 }}>
              {(block.categories || []).map((cat, j) => (
                <div key={j} style={{ flex: 1, background: C.bg, borderRadius: 8, padding: 12, minHeight: 80 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, textAlign: "center", marginBottom: 8 }}>{cat}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {(block.cards || []).map((card, j) => (
                <div key={j} style={{ padding: "8px 14px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, cursor: "grab" }}>{card.text}</div>
              ))}
            </div>
          </div>
        );
      case "sequencing":
        return (
          <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.navy}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: "uppercase", marginBottom: 8 }}>Sequencing Activity</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>{block.instructions || "Arrange the steps in the correct order."}</p>
            {(block.steps || []).sort(() => Math.random() - 0.5).map((step, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 6, background: C.bg, borderRadius: 8, cursor: "grab" }}>
                <GripVertical size={14} color={C.textLight} />
                <span style={{ fontSize: 14 }}>{step.text}</span>
              </div>
            ))}
          </div>
        );
      case "flashcardDeck":
        return (
          <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.amber}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.amber, textTransform: "uppercase", marginBottom: 12 }}>Flashcard Deck</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 12 }}>{block.instructions || "Click cards to reveal the answer."}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {(block.flashcards || []).slice(0, 4).map((fc, j) => (
                <div key={j} style={{ background: "linear-gradient(135deg, #6B1D34, #8B2D4A)", color: "#fff", borderRadius: 10, padding: 20, minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  {fc.front}
                </div>
              ))}
            </div>
            {(block.flashcards || []).length > 4 && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8, textAlign: "center" }}>+{(block.flashcards || []).length - 4} more cards</div>}
          </div>
        );
      case "videoEmbed":
        return (
          <div key={i} style={{ marginBottom: 24 }}>
            <div style={{ background: "#000", borderRadius: 12, padding: "56.25% 0 0 0", position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff", textAlign: "center" }}>
                <PlayCircle size={48} />
                <div style={{ marginTop: 8, fontSize: 14 }}>{block.videoTitle || "Video"}</div>
              </div>
            </div>
            {block.markers?.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto" }}>
                {block.markers.map((m, j) => (
                  <div key={j} style={{ padding: "4px 10px", background: C.bg, borderRadius: 6, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer" }}>
                    <span style={{ color: C.burgundy, fontWeight: 600 }}>{m.time}</span> {m.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div key={i} style={{ background: C.bg, borderRadius: 12, padding: 20, marginBottom: 24, borderLeft: `4px solid ${C.textLight}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{(BLOCK_TYPES.find(b => b.type === block.type) || {}).label || block.type}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{block.instructions || block.question || block.scenarioTitle || "Interactive content block"}</div>
          </div>
        );
    }
  };

  return (
    <div>
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PlayCircle size={20} color={C.burgundy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Learner Preview</span>
          </div>
          <span style={{ fontSize: 12, color: C.textMuted }}>This is how students will see your course</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
        {/* Section Nav */}
        <div style={{ ...S.card, position: "sticky", top: 20, alignSelf: "start" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.borderLight}` }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>Course Sections</span>
          </div>
          {modules.map((mod, i) => (
            <div key={i} onClick={() => setCurrentSection(i)}
              style={{ padding: "10px 14px", cursor: "pointer", borderLeft: i === currentSection ? `3px solid ${C.burgundy}` : "3px solid transparent", background: i === currentSection ? C.burgundyFaded : "transparent", fontSize: 13, fontWeight: i === currentSection ? 600 : 400, color: i === currentSection ? C.burgundy : C.textMuted }}>
              {mod.title?.replace(/^Module \d+:\s*/, "") || `Module ${i + 1}`}
            </div>
          ))}

          {/* Progress Summary */}
          <div style={{ padding: 14, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", marginBottom: 8 }}>Course Stats</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.8 }}>
              <div>{modules.length} modules</div>
              <div>{modules.reduce((s, m) => s + (m.blocks || []).length, 0)} content blocks</div>
              <div>{modules.reduce((s, m) => s + (m.blocks || []).reduce((bs, b) => bs + countBlockWords(b), 0), 0).toLocaleString()} words</div>
              <div>{courseData.ceHours || 3} CE hours</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 32 }}>
          {/* Course Header */}
          {currentSection === 0 && (
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.borderLight}` }}>
              <h1 style={{ color: C.burgundy, fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{courseData.title || "Untitled Course"}</h1>
              {courseData.description && <p style={{ color: C.textMuted, fontSize: 15, marginTop: 8, lineHeight: 1.6 }}>{courseData.description}</p>}
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                {courseData.ceHours && <span style={S.badge(C.burgundy)}><Clock size={12} /> {courseData.ceHours} CE Hours</span>}
                {courseData.level && <span style={S.badge(C.navy)}>{courseData.level}</span>}
                {courseData.category && <span style={S.badge(C.green)}>{courseData.category}</span>}
              </div>
              {courseData.objectives?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Learning Objectives</div>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: C.text, lineHeight: 1.7 }}>
                    {courseData.objectives.map((obj, j) => <li key={j} style={{ marginBottom: 4 }}>{obj}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Module blocks */}
          {blocks.map((block, i) => renderLearnerBlock(block, i))}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.borderLight}` }}>
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              style={{ ...S.btnSecondary, opacity: currentSection === 0 ? 0.4 : 1 }}>
              <ChevronLeft size={14} /> Previous
            </button>
            <span style={{ fontSize: 13, color: C.textMuted, alignSelf: "center" }}>
              Module {currentSection + 1} of {modules.length}
            </span>
            <button
              onClick={() => setCurrentSection(Math.min(modules.length - 1, currentSection + 1))}
              disabled={currentSection === modules.length - 1}
              style={{ ...S.btnPrimary, opacity: currentSection === modules.length - 1 ? 0.4 : 1 }}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionPreviewItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 8, overflow: "hidden", background: "#fff" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: open ? C.burgundyFaded : C.bg, border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: C.navy }}>{item.title || "Untitled"}</span>
        {open ? <ChevronUp size={16} color={C.textMuted} /> : <ChevronDown size={16} color={C.textMuted} />}
      </button>
      {open && (
        <div style={{ padding: "14px 18px", fontSize: 14, lineHeight: 1.7, color: C.text }}
          dangerouslySetInnerHTML={{ __html: safeHTML(item.content || "") }} />
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// DRIP SCHEDULE TAB — Configure timed content release
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// MEDIA LIBRARY
// ═══════════════════════════════════════════════════════════
function MediaLibrary({ courseData, setCourseData }) {
  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const FOLDERS = [
    { value: "", label: "All Folders" },
    { value: "counselorready/course-content", label: "Course Content" },
    { value: "counselorready/course-thumbnails", label: "Thumbnails" },
    { value: "counselorready/inline", label: "Inline Images" },
    { value: "counselorready/hotspot-bg", label: "Hotspot Backgrounds" },
  ];

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ max_results: "100" });
      if (folder) params.set("folder", folder);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`${API_BASE}/images/browse?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setImages(data.data.images || []);
        setTotalCount(data.data.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to browse images:", err);
    } finally {
      setLoading(false);
    }
  }, [folder, searchQuery, API_BASE]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteImage = async (publicId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/images/${encodeURIComponent(publicId)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setImages(prev => prev.filter(img => img.publicId !== publicId));
      setDeleteConfirm(null);
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div>
      {/* Header Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Media Library</span>
            <span style={S.badge(C.teal)}>{totalCount} images</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowUpload(!showUpload)} style={S.btnPrimary}>
              <Upload size={14} /> Upload
            </button>
            <button onClick={fetchImages} style={S.btnSecondary}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div style={{ padding: 20, borderBottom: `1px solid ${C.borderLight}`, background: C.greenFaded }}>
            <CloudinaryUploader
              onUpload={() => { setShowUpload(false); fetchImages(); }}
              context="media-library"
              label="Upload to Media Library"
            />
          </div>
        )}

        {/* Filters */}
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color={C.textMuted} />
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              style={{ ...S.input, width: 200, padding: "6px 10px", fontSize: 13 }}
            >
              {FOLDERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 200 }}>
            <Search size={14} color={C.textMuted} />
            <input
              type="text"
              placeholder="Search by filename or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...S.input, padding: "6px 10px", fontSize: 13 }}
            />
          </div>
        </div>

        {/* Image Grid */}
        <div style={S.cardBody}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: C.burgundy }} />
              <p style={{ color: C.textMuted, fontSize: 13, marginTop: 12 }}>Loading media...</p>
            </div>
          ) : images.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Image size={40} color={C.textLight} />
              <h3 style={{ color: C.navy, marginTop: 16 }}>No Images Found</h3>
              <p style={{ color: C.textMuted, fontSize: 14 }}>Upload images or adjust your filters.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {images.map((img) => (
                <div
                  key={img.publicId}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    borderRadius: 10, border: `1px solid ${C.borderLight}`, overflow: "hidden", cursor: "pointer",
                    transition: "all 0.15s", background: "#fff",
                    boxShadow: selectedImage?.publicId === img.publicId ? `0 0 0 2px ${C.burgundy}` : "none",
                  }}
                >
                  <div style={{ width: "100%", height: 120, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img
                      src={img.thumbnailUrl || img.url}
                      alt={img.alt || "Media"}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover", width: "100%", height: "100%" }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: 11, color: C.navy, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {img.publicId.split("/").pop()}
                    </div>
                    <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>
                      {img.width}×{img.height} · {formatBytes(img.bytes)} · {img.format}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedImage(null); }}>
          <div style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>Image Details</span>
              <button onClick={() => setSelectedImage(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={18} color={C.textMuted} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background: C.bg, borderRadius: 10, padding: 12, marginBottom: 16, textAlign: "center" }}>
                <img src={selectedImage.url} alt={selectedImage.alt || ""} style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 8 }} />
              </div>
              <div style={S.grid2}>
                <div>
                  <span style={S.label}>Dimensions</span>
                  <p style={{ fontSize: 14, color: C.text }}>{selectedImage.width} × {selectedImage.height}px</p>
                </div>
                <div>
                  <span style={S.label}>File Size</span>
                  <p style={{ fontSize: 14, color: C.text }}>{formatBytes(selectedImage.bytes)}</p>
                </div>
                <div>
                  <span style={S.label}>Format</span>
                  <p style={{ fontSize: 14, color: C.text }}>{selectedImage.format?.toUpperCase()}</p>
                </div>
                <div>
                  <span style={S.label}>Folder</span>
                  <p style={{ fontSize: 14, color: C.text }}>{selectedImage.folder || "Unknown"}</p>
                </div>
              </div>
              {selectedImage.alt && (
                <div style={{ marginTop: 12 }}>
                  <span style={S.label}>Alt Text</span>
                  <p style={{ fontSize: 14, color: C.text }}>{selectedImage.alt}</p>
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <span style={S.label}>Image URLs</span>
                {[
                  { label: "Original", url: selectedImage.url },
                  { label: "Thumbnail (200px)", url: selectedImage.thumbnailUrl },
                ].filter(u => u.url).map(u => (
                  <div key={u.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "6px 10px", background: C.bg, borderRadius: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.navy, minWidth: 100 }}>{u.label}</span>
                    <input
                      readOnly
                      value={u.url}
                      style={{ ...S.input, padding: "4px 8px", fontSize: 11, flex: 1, background: "#fff" }}
                      onClick={(e) => e.target.select()}
                    />
                    <button onClick={() => copyUrl(u.url, u.label)} style={{ ...S.btnSecondary, padding: "4px 8px", fontSize: 11 }}>
                      {copiedUrl === u.label ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                {deleteConfirm === selectedImage.publicId ? (
                  <>
                    <span style={{ fontSize: 13, color: C.danger, alignSelf: "center" }}>Delete permanently?</span>
                    <button onClick={() => deleteImage(selectedImage.publicId)} style={{ ...S.btnDanger, padding: "8px 16px" }}>Yes, Delete</button>
                    <button onClick={() => setDeleteConfirm(null)} style={S.btnSecondary}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(selectedImage.publicId)} style={S.btnDanger}>
                    <Trash2 size={12} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPORT PANEL (SCORM / LTI / xAPI)
// ═══════════════════════════════════════════════════════════
function ExportPanel({ courseData }) {
  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const courseId = courseData?._id;
  const courseSlug = courseData?.slug;
  const [scormLoading, setScormLoading] = useState(false);
  const [manifestXml, setManifestXml] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadScorm = async () => {
    if (!courseId) return;
    setScormLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/scorm/export/${courseId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseSlug || "course"}_scorm.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("SCORM export failed:", err);
    } finally {
      setScormLoading(false);
    }
  };

  const previewManifest = async () => {
    if (!courseId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/scorm/preview/${courseId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Preview failed");
      const xml = await res.text();
      setManifestXml(xml);
    } catch (err) {
      console.error("Manifest preview failed:", err);
    }
  };

  const downloadCartridge = async () => {
    try {
      const res = await fetch(`${API_BASE}/lti/cartridge`);
      if (!res.ok) throw new Error("Failed to fetch cartridge");
      const xml = await res.text();
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lti_cartridge.xml";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("LTI cartridge download failed:", err);
    }
  };

  if (!courseId) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 60 }}>
        <Package size={40} color={C.textLight} />
        <h3 style={{ color: C.navy, marginTop: 16 }}>Save Course First</h3>
        <p style={{ color: C.textMuted, fontSize: 14 }}>Save your course to enable export options.</p>
      </div>
    );
  }

  const ltiLaunchUrl = `${API_BASE.replace("/api", "")}/api/lti/launch`;
  const ltiConfigUrl = `${API_BASE}/lti/config`;

  return (
    <div>
      {/* SCORM Export */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Package size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>SCORM 1.2 Export</span>
          </div>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            Export this course as a SCORM 1.2 package for use in external Learning Management Systems
            like Canvas, Moodle, Blackboard, or any SCORM-compliant LMS.
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button onClick={downloadScorm} disabled={scormLoading} style={{ ...S.btnPrimary, opacity: scormLoading ? 0.6 : 1 }}>
              {scormLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
              {scormLoading ? "Generating..." : "Download SCORM Package"}
            </button>
            <button onClick={previewManifest} style={S.btnSecondary}>
              <Eye size={14} /> Preview Manifest
            </button>
          </div>
          {manifestXml && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={S.label}>imsmanifest.xml</span>
                <button onClick={() => setManifestXml(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={14} color={C.textMuted} />
                </button>
              </div>
              <pre style={{ background: C.bg, borderRadius: 8, padding: 16, fontSize: 11, overflow: "auto", maxHeight: 300, border: `1px solid ${C.borderLight}`, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {manifestXml}
              </pre>
            </div>
          )}
          <div style={{ marginTop: 16, padding: 12, background: C.goldFaded, borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: C.navy, lineHeight: 1.5 }}>
              <strong>Compatibility:</strong> SCORM 1.2 is supported by virtually all LMS platforms.
              The package includes the manifest, content pages, and tracking JavaScript.
              Completion and score data will sync back to your LMS gradebook.
            </p>
          </div>
        </div>
      </div>

      {/* LTI Configuration */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link2 size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>LTI 1.1 Integration</span>
          </div>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            Use LTI (Learning Tools Interoperability) to embed this course directly into
            an external LMS. Grades are automatically passed back to the LMS gradebook.
          </p>

          {[
            { label: "Launch URL", value: ltiLaunchUrl, field: "launch" },
            { label: "Configuration URL", value: ltiConfigUrl, field: "config" },
          ].map(item => (
            <div key={item.field} style={{ marginBottom: 12 }}>
              <span style={S.label}>{item.label}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly value={item.value} style={{ ...S.input, fontSize: 13, background: C.bg }} onClick={(e) => e.target.select()} />
                <button onClick={() => copyToClipboard(item.value, item.field)} style={{ ...S.btnSecondary, padding: "8px 12px", whiteSpace: "nowrap" }}>
                  {copiedField === item.field ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button onClick={downloadCartridge} style={S.btnSecondary}>
              <Download size={14} /> Download LTI Cartridge XML
            </button>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: C.goldFaded, borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: C.navy, lineHeight: 1.5 }}>
              <strong>Setup:</strong> In your LMS, add an external tool using the Launch URL above.
              You&apos;ll need the consumer key and secret configured in your CounselorReady environment settings.
              LTI supports automatic user provisioning and grade passback.
            </p>
          </div>
        </div>
      </div>

      {/* xAPI Info */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Share2 size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>xAPI (Experience API)</span>
          </div>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            xAPI statements are automatically generated for learner activities when an LRS
            (Learning Record Store) endpoint is configured.
          </p>
          <div style={{ marginBottom: 12 }}>
            <span style={S.label}>Tracked Activities</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {["Course Started", "Section Completed", "Quiz Attempted", "Quiz Passed", "Assessment Completed", "Course Completed", "Certificate Earned"].map(verb => (
                <span key={verb} style={{ ...S.badge(C.teal), fontSize: 11 }}>{verb}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: 12, background: C.goldFaded, borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: C.navy, lineHeight: 1.5 }}>
              <strong>Configuration:</strong> Set the <code style={{ background: "#fff", padding: "1px 4px", borderRadius: 3 }}>XAPI_LRS_ENDPOINT</code>,{" "}
              <code style={{ background: "#fff", padding: "1px 4px", borderRadius: 3 }}>XAPI_LRS_KEY</code>, and{" "}
              <code style={{ background: "#fff", padding: "1px 4px", borderRadius: 3 }}>XAPI_LRS_SECRET</code>{" "}
              environment variables to enable xAPI statement forwarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADAPTIVE LEARNING PATHS
// ═══════════════════════════════════════════════════════════
function AdaptivePathsEditor({ courseData, setCourseData }) {
  const settings = courseData?.settings || {};
  const sections = courseData?.sections || [];
  const adaptiveEnabled = settings.adaptiveEnabled || false;
  const adaptiveRules = settings.adaptiveRules || [];

  const updateSettings = (patch) => {
    setCourseData({ ...courseData, settings: { ...settings, ...patch } });
  };

  const addRule = () => {
    updateSettings({
      adaptiveRules: [...adaptiveRules, {
        sectionIndex: 0,
        condition: "score_below",
        threshold: 0.7,
        action: "redirect",
        targetSectionIndex: sections.length > 1 ? 1 : 0,
        message: ""
      }]
    });
  };

  const updateRule = (index, patch) => {
    const updated = [...adaptiveRules];
    updated[index] = { ...updated[index], ...patch };
    updateSettings({ adaptiveRules: updated });
  };

  const removeRule = (index) => {
    updateSettings({ adaptiveRules: adaptiveRules.filter((_, i) => i !== index) });
  };

  // Get sections that have quizzes
  const quizSections = sections.map((s, i) => ({ ...s, index: i })).filter(s => s.hasQuiz);

  if (!sections.length) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 60 }}>
        <GitBranch size={40} color={C.textLight} />
        <h3 style={{ color: C.navy, marginTop: 16 }}>No Sections Available</h3>
        <p style={{ color: C.textMuted, fontSize: 14 }}>Create course content with quiz sections first.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Adaptive Paths Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GitBranch size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Adaptive Learning Paths</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: adaptiveEnabled ? C.green : C.textMuted }}>
              {adaptiveEnabled ? "Enabled" : "Disabled"}
            </span>
            <div onClick={() => updateSettings({ adaptiveEnabled: !adaptiveEnabled })}
              style={{ width: 44, height: 24, borderRadius: 12, background: adaptiveEnabled ? C.green : C.border, position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: adaptiveEnabled ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </label>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Define conditional branching rules based on quiz scores. When a learner&apos;s quiz score triggers a rule,
            they&apos;ll be directed to a specific section for remediation or allowed to skip ahead.
          </p>

          {quizSections.length === 0 && (
            <div style={{ padding: 16, background: C.goldFaded, borderRadius: 8, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: C.navy }}>
                <AlertTriangle size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                No sections with quizzes found. Add quizzes to your sections to create adaptive rules.
              </p>
            </div>
          )}

          {/* Rules */}
          {adaptiveRules.map((rule, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${C.borderLight}`, marginBottom: 12, background: i % 2 === 0 ? C.bg : "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.burgundy }}>Rule {i + 1}</span>
                <button onClick={() => removeRule(i)} style={S.btnDanger}><Trash2 size={12} /> Remove</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* Source Section */}
                <div>
                  <span style={S.label}>When quiz in section...</span>
                  <select
                    value={rule.sectionIndex}
                    onChange={(e) => updateRule(i, { sectionIndex: parseInt(e.target.value) })}
                    style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  >
                    {sections.map((s, si) => (
                      <option key={si} value={si}>
                        {si + 1}. {s.title || `Section ${si + 1}`} {s.hasQuiz ? "" : "(no quiz)"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <span style={S.label}>Condition</span>
                  <select
                    value={rule.condition}
                    onChange={(e) => updateRule(i, { condition: e.target.value })}
                    style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  >
                    <option value="score_below">Score Below Threshold</option>
                    <option value="score_above">Score Above Threshold</option>
                    <option value="failed">Quiz Failed</option>
                  </select>
                </div>

                {/* Threshold */}
                {rule.condition !== "failed" && (
                  <div>
                    <span style={S.label}>Threshold (%)</span>
                    <input
                      type="number"
                      min="0" max="100" step="5"
                      value={Math.round((rule.threshold || 0.7) * 100)}
                      onChange={(e) => updateRule(i, { threshold: parseInt(e.target.value) / 100 })}
                      style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                    />
                  </div>
                )}

                {/* Action */}
                <div>
                  <span style={S.label}>Action</span>
                  <select
                    value={rule.action}
                    onChange={(e) => updateRule(i, { action: e.target.value })}
                    style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  >
                    <option value="redirect">Redirect to Section</option>
                    <option value="require_review">Require Review</option>
                    <option value="skip_ahead">Allow Skip Ahead</option>
                  </select>
                </div>

                {/* Target Section */}
                <div>
                  <span style={S.label}>Target Section</span>
                  <select
                    value={rule.targetSectionIndex}
                    onChange={(e) => updateRule(i, { targetSectionIndex: parseInt(e.target.value) })}
                    style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  >
                    {sections.map((s, si) => (
                      <option key={si} value={si}>
                        {si + 1}. {s.title || `Section ${si + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={S.label}>Message to Learner (optional)</span>
                  <input
                    type="text"
                    value={rule.message || ""}
                    onChange={(e) => updateRule(i, { message: e.target.value })}
                    placeholder="e.g., We recommend reviewing the fundamentals before continuing."
                    style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Rule Summary */}
              <div style={{ marginTop: 10, padding: "8px 12px", background: C.burgundyFaded, borderRadius: 6 }}>
                <p style={{ fontSize: 12, color: C.burgundy, fontWeight: 500 }}>
                  If quiz score in &quot;{sections[rule.sectionIndex]?.title || `Section ${rule.sectionIndex + 1}`}&quot;
                  {rule.condition === "score_below" && ` is below ${Math.round((rule.threshold || 0.7) * 100)}%`}
                  {rule.condition === "score_above" && ` is above ${Math.round((rule.threshold || 0.7) * 100)}%`}
                  {rule.condition === "failed" && " fails"}
                  , {rule.action === "redirect" ? "redirect" : rule.action === "skip_ahead" ? "allow skip" : "require review of"}{" "}
                  &quot;{sections[rule.targetSectionIndex]?.title || `Section ${rule.targetSectionIndex + 1}`}&quot;
                </p>
              </div>
            </div>
          ))}

          <button onClick={addRule} style={{ ...S.btnSecondary, marginTop: 8 }}>
            <Plus size={14} /> Add Adaptive Rule
          </button>
        </div>
      </div>

      {/* Retake Policy Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RotateCcw size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Quiz Retake Policy</span>
          </div>
        </div>
        <div style={S.cardBody}>
          <div style={S.grid2}>
            <div>
              <span style={S.label}>Retake Policy</span>
              <select
                value={settings.retakePolicy || "unlimited"}
                onChange={(e) => updateSettings({ retakePolicy: e.target.value })}
                style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
              >
                <option value="unlimited">Unlimited Retakes</option>
                <option value="limited">Limited Retakes</option>
                <option value="first_final">First Attempt is Final</option>
              </select>
            </div>
            {(settings.retakePolicy === "limited") && (
              <div>
                <span style={S.label}>Max Retakes</span>
                <input
                  type="number"
                  min="1" max="10"
                  value={settings.maxRetakes || 3}
                  onChange={(e) => updateSettings({ maxRetakes: parseInt(e.target.value) })}
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                />
              </div>
            )}
            <div>
              <span style={S.label}>Score Policy</span>
              <select
                value={settings.scorePolicy || "highest"}
                onChange={(e) => updateSettings({ scorePolicy: e.target.value })}
                style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
              >
                <option value="highest">Keep Highest Score</option>
                <option value="latest">Use Latest Score</option>
                <option value="first">Use First Attempt</option>
                <option value="average">Average All Attempts</option>
              </select>
            </div>
            <div>
              <span style={S.label}>Cooldown Between Retakes (minutes)</span>
              <input
                type="number"
                min="0" max="1440" step="5"
                value={settings.retakeCooldown || 0}
                onChange={(e) => updateSettings({ retakeCooldown: parseInt(e.target.value) })}
                style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DripScheduleTab({ courseData, setCourseData }) {
  const modules = courseData?.modules || [];
  const settings = courseData?.settings || {};
  const dripEnabled = settings.dripEnabled || false;
  const dripSchedule = settings.dripSchedule || [];

  const toggleDrip = () => {
    setCourseData({
      ...courseData,
      settings: { ...settings, dripEnabled: !dripEnabled }
    });
  };

  const updateModuleDrip = (moduleIndex, days) => {
    const newSchedule = [...dripSchedule];
    const existing = newSchedule.findIndex(d => d.moduleIndex === moduleIndex);
    if (existing >= 0) {
      newSchedule[existing] = { ...newSchedule[existing], daysAfterEnrollment: days };
    } else {
      newSchedule.push({ moduleIndex, daysAfterEnrollment: days });
    }
    setCourseData({
      ...courseData,
      settings: { ...settings, dripSchedule: newSchedule }
    });
  };

  const getDripDays = (moduleIndex) => {
    const entry = dripSchedule.find(d => d.moduleIndex === moduleIndex);
    return entry ? entry.daysAfterEnrollment : moduleIndex * 7; // Default: 1 week per module
  };

  const applyPreset = (preset) => {
    const newSchedule = modules.map((_, i) => ({
      moduleIndex: i,
      daysAfterEnrollment: preset === "weekly" ? i * 7
        : preset === "biweekly" ? i * 14
        : preset === "daily" ? i
        : preset === "immediate" ? 0
        : i * 7
    }));
    setCourseData({
      ...courseData,
      settings: { ...settings, dripEnabled: true, dripSchedule: newSchedule }
    });
  };

  if (!modules.length) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 60 }}>
        <Calendar size={40} color={C.textLight} />
        <h3 style={{ color: C.navy, marginTop: 16 }}>No Modules to Schedule</h3>
        <p style={{ color: C.textMuted, fontSize: 14 }}>Create course content first.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Calendar size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Drip Schedule</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: dripEnabled ? C.green : C.textMuted }}>
              {dripEnabled ? "Enabled" : "Disabled"}
            </span>
            <div onClick={toggleDrip}
              style={{ width: 44, height: 24, borderRadius: 12, background: dripEnabled ? C.green : C.border, position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: dripEnabled ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </label>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Control when modules become available to learners after enrollment. Each module unlocks after the specified number of days.
          </p>

          {/* Presets */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, alignSelf: "center", marginRight: 8 }}>Presets:</span>
            {[
              { key: "immediate", label: "All at Once" },
              { key: "daily", label: "Daily" },
              { key: "weekly", label: "Weekly" },
              { key: "biweekly", label: "Bi-Weekly" },
            ].map(p => (
              <button key={p.key} onClick={() => applyPreset(p.key)}
                style={{ ...S.btnSecondary, fontSize: 12, padding: "6px 14px" }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Module Schedule */}
          {modules.map((mod, i) => {
            const days = getDripDays(i);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 10, marginBottom: 8, background: i % 2 === 0 ? C.bg : "transparent", border: `1px solid ${C.borderLight}` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: C.burgundyFaded, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.burgundy }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title || `Module ${i + 1}`}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{(mod.blocks || []).length} blocks</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {i === 0 ? (
                    <span style={S.badge(C.green)}>Available Immediately</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 13, color: C.textMuted }}>Unlocks after</span>
                      <input type="number" min="0" value={days}
                        onChange={(e) => updateModuleDrip(i, parseInt(e.target.value) || 0)}
                        disabled={!dripEnabled}
                        style={{ ...S.input, width: 70, textAlign: "center", padding: "6px 8px", opacity: dripEnabled ? 1 : 0.5 }} />
                      <span style={{ fontSize: 13, color: C.textMuted }}>days</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Timeline */}
      {dripEnabled && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Release Timeline</span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ position: "relative", paddingLeft: 24 }}>
              {modules.map((mod, i) => {
                const days = getDripDays(i);
                return (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < modules.length - 1 ? 0 : 0, paddingBottom: i < modules.length - 1 ? 24 : 0, position: "relative" }}>
                    {/* Timeline line */}
                    {i < modules.length - 1 && <div style={{ position: "absolute", left: -16, top: 24, bottom: 0, width: 2, background: C.border }} />}
                    {/* Timeline dot */}
                    <div style={{ position: "absolute", left: -20, top: 4, width: 10, height: 10, borderRadius: 5, background: i === 0 ? C.green : C.burgundy, border: "2px solid #fff", boxShadow: `0 0 0 2px ${i === 0 ? C.green : C.burgundy}` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mod.title?.replace(/^Module \d+:\s*/, "") || `Module ${i + 1}`}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>
                        {days === 0 ? "Day 0 — Enrollment" : `Day ${days}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// COURSE VERSION HISTORY — Snapshots of course state
// ═══════════════════════════════════════════════════════════
function VersionHistory({ courseData, setCourseData }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  // Load versions from localStorage
  useEffect(() => {
    const key = `cr_versions_${courseData?.slug || courseData?.title || "default"}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) setVersions(JSON.parse(saved));
    } catch (e) { /* ignore */ }
  }, [courseData?.slug, courseData?.title]);

  const saveVersion = (label = "") => {
    const key = `cr_versions_${courseData?.slug || courseData?.title || "default"}`;
    const snapshot = {
      id: uid(),
      timestamp: new Date().toISOString(),
      label: label || `Version ${versions.length + 1}`,
      moduleCount: (courseData.modules || []).length,
      blockCount: (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).length, 0),
      wordCount: (courseData.modules || []).reduce((s, m) => s + (m.blocks || []).reduce((bs, b) => bs + countBlockWords(b), 0), 0),
      examQuestions: (courseData.assessment?.questions || []).length,
      data: JSON.parse(JSON.stringify(courseData))
    };
    const updated = [snapshot, ...versions].slice(0, 20); // Keep last 20 versions
    setVersions(updated);
    try { localStorage.setItem(key, JSON.stringify(updated)); } catch (e) { /* quota exceeded */ }
  };

  const restoreVersion = (version) => {
    if (!confirm(`Restore "${version.label}"? Your current changes will be saved as a snapshot first.`)) return;
    saveVersion("Auto-save before restore");
    setCourseData(version.data);
    setSelectedVersion(null);
  };

  const deleteVersion = (versionId) => {
    const key = `cr_versions_${courseData?.slug || courseData?.title || "default"}`;
    const updated = versions.filter(v => v.id !== versionId);
    setVersions(updated);
    try { localStorage.setItem(key, JSON.stringify(updated)); } catch (e) { /* ignore */ }
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <History size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Version History</span>
          </div>
          <button style={S.btnPrimary} onClick={() => {
            const label = prompt("Version label (optional):", `v${versions.length + 1} — ${new Date().toLocaleDateString()}`);
            if (label !== null) saveVersion(label);
          }}>
            <Save size={14} /> Save Snapshot
          </button>
        </div>
        <div style={S.cardBody}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Save snapshots of your course at key milestones. Restore any previous version instantly. Up to 20 versions stored locally.
          </p>

          {versions.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textLight }}>
              <History size={32} />
              <p style={{ marginTop: 12, fontSize: 14 }}>No versions saved yet. Click "Save Snapshot" to create your first version.</p>
            </div>
          ) : (
            <div>
              {versions.map((v, i) => (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 10, marginBottom: 8, background: selectedVersion === v.id ? C.burgundyFaded : (i % 2 === 0 ? C.bg : "transparent"), border: `1px solid ${selectedVersion === v.id ? C.burgundy + "44" : C.borderLight}`, cursor: "pointer" }}
                  onClick={() => setSelectedVersion(selectedVersion === v.id ? null : v.id)}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? C.greenFaded : C.burgundyFaded, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i === 0 ? <Clock size={14} color={C.green} /> : <History size={14} color={C.burgundy} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{v.label}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>
                      {new Date(v.timestamp).toLocaleString()} · {v.moduleCount} modules · {v.blockCount} blocks · {v.wordCount?.toLocaleString()} words
                      {v.examQuestions > 0 && ` · ${v.examQuestions} exam questions`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={(e) => { e.stopPropagation(); restoreVersion(v); }}
                      style={{ ...S.btnSecondary, fontSize: 11, padding: "5px 10px" }}>
                      <RotateCcw size={11} /> Restore
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteVersion(v.id); }}
                      style={{ ...S.btnDanger, fontSize: 11, padding: "5px 10px" }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD — Course engagement overview
// ═══════════════════════════════════════════════════════════
function AnalyticsDashboard({ courseData }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const getToken = () => localStorage.getItem("token");

  const courseId = courseData?._id || courseData?.id;

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/course-builder/analytics/${courseId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        } else {
          setError("Could not load analytics. Course may not have any enrollments yet.");
        }
      } catch (err) {
        setError("Failed to connect to analytics service.");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  // Content analytics (always available from courseData)
  const modules = courseData?.modules || [];
  const totalBlocks = modules.reduce((s, m) => s + (m.blocks || []).length, 0);
  const totalWords = modules.reduce((s, m) => s + (m.blocks || []).reduce((bs, b) => bs + countBlockWords(b), 0), 0);
  const totalKC = modules.reduce((s, m) => s + (m.blocks || []).filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length, 0);
  const totalEngagement = modules.reduce((s, m) => s + (m.blocks || []).filter(b => ENGAGEMENT_TYPES.includes(b.type)).length, 0);
  const examQuestions = (courseData.assessment?.questions || []).length;

  const blockTypeCounts = {};
  modules.forEach(m => {
    (m.blocks || []).forEach(b => {
      blockTypeCounts[b.type] = (blockTypeCounts[b.type] || 0) + 1;
    });
  });

  const StatCard = ({ icon, label, value, color, subtext }) => (
    <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${C.borderLight}`, padding: 20, flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {icon}
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color || C.navy }}>{value}</div>
      {subtext && <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>{subtext}</div>}
    </div>
  );

  return (
    <div>
      {/* Content Stats */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BarChart3 size={20} color={C.navy} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Course Analytics</span>
          </div>
        </div>
        <div style={S.cardBody}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <StatCard icon={<BookOpen size={16} color={C.burgundy} />} label="Modules" value={modules.length} color={C.burgundy} />
            <StatCard icon={<Layers size={16} color={C.green} />} label="Content Blocks" value={totalBlocks} color={C.green} />
            <StatCard icon={<FileText size={16} color={C.navy} />} label="Total Words" value={totalWords.toLocaleString()} color={C.navy} subtext={`${courseData.ceHours || 3} CE hours (${(totalWords / (courseData.ceHours || 3)).toFixed(0)} words/hr)`} />
            <StatCard icon={<Brain size={16} color={C.burgundy} />} label="Knowledge Checks" value={totalKC} color={C.burgundy} />
            <StatCard icon={<ClipboardCheck size={16} color={C.gold} />} label="Exam Questions" value={examQuestions} color={C.gold} />
          </div>

          {/* Block Type Breakdown */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Block Type Distribution</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {Object.entries(blockTypeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                const cfg = BLOCK_TYPES.find(b => b.type === type) || { label: type, icon: "?", color: C.textMuted };
                const pct = totalBlocks > 0 ? (count / totalBlocks * 100).toFixed(0) : 0;
                return (
                  <div key={type} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: C.bg }}>
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{cfg.label}</div>
                      <div style={{ height: 4, borderRadius: 2, background: C.border, marginTop: 3 }}>
                        <div style={{ height: 4, borderRadius: 2, background: cfg.color, width: `${pct}%`, transition: "width 0.3s" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Module Stats */}
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Module Breakdown</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.navy }}>#</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.navy }}>Module</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 700, color: C.navy }}>Blocks</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 700, color: C.navy }}>Words</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 700, color: C.navy }}>KC</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 700, color: C.navy }}>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, i) => {
                  const blocks = mod.blocks || [];
                  const words = blocks.reduce((s, b) => s + countBlockWords(b), 0);
                  const kc = blocks.filter(b => KNOWLEDGE_CHECK_TYPES.includes(b.type)).length;
                  const eng = blocks.filter(b => ENGAGEMENT_TYPES.includes(b.type)).length;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, background: i % 2 === 0 ? C.bg : "transparent" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: C.burgundy }}>{i + 1}</td>
                      <td style={{ padding: "10px 12px", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title || `Module ${i + 1}`}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>{blocks.length}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>{words.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: kc >= 2 ? C.green : C.danger, fontWeight: 600 }}>{kc}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>{eng}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Enrollment Analytics (from API) */}
          {courseId && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.borderLight}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Enrollment Data</h4>
              {loading && <div style={{ textAlign: "center", padding: 20 }}><Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: C.burgundy }} /></div>}
              {error && <div style={{ padding: 16, background: C.goldFaded, borderRadius: 8, fontSize: 13, color: C.navy }}>{error}</div>}
              {analytics && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <StatCard icon={<Users size={16} color={C.green} />} label="Enrollments" value={analytics.enrollments || 0} color={C.green} />
                  <StatCard icon={<Award size={16} color={C.gold} />} label="Completions" value={analytics.completions || 0} color={C.gold} subtext={analytics.enrollments > 0 ? `${((analytics.completions || 0) / analytics.enrollments * 100).toFixed(0)}% completion rate` : ""} />
                  <StatCard icon={<TrendingUp size={16} color={C.burgundy} />} label="Avg Score" value={analytics.avgScore ? `${analytics.avgScore}%` : "N/A"} color={C.burgundy} />
                  <StatCard icon={<Clock size={16} color={C.navy} />} label="Avg Time" value={analytics.avgTimeSpent ? `${Math.round(analytics.avgTimeSpent / 60)}m` : "N/A"} color={C.navy} />
                </div>
              )}
              {!courseId && <p style={{ color: C.textMuted, fontSize: 13 }}>Save the course to see enrollment analytics.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CERTIFICATE CUSTOMIZER
// ═══════════════════════════════════════════════════════════════
function CertificateCustomizer({ courseData, setCourseData }) {
  const cert = courseData.settings?.certificateCustomization || {};

  const update = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        certificateCustomization: {
          ...(prev.settings?.certificateCustomization || {}),
          [field]: value
        }
      }
    }));
  };

  const colorField = (label, field, defaultVal) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <input
        type="color"
        value={cert[field] || defaultVal}
        onChange={e => update(field, e.target.value)}
        style={{ width: 36, height: 36, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{label}</div>
        <div style={{ fontSize: 11, color: C.textMuted }}>{cert[field] || defaultVal}</div>
      </div>
    </div>
  );

  const selectField = (label, field, options, defaultVal) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 4 }}>{label}</label>
      <select
        value={cert[field] || defaultVal}
        onChange={e => update(field, e.target.value)}
        style={{ ...S.input, padding: '8px 12px' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const textField = (label, field, defaultVal, placeholder) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type="text"
        value={cert[field] ?? defaultVal}
        onChange={e => update(field, e.target.value)}
        placeholder={placeholder || ''}
        style={{ ...S.input, padding: '8px 12px' }}
      />
    </div>
  );

  const toggleField = (label, field, defaultVal = true) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <input
        type="checkbox"
        checked={cert[field] ?? defaultVal}
        onChange={e => update(field, e.target.checked)}
        style={{ width: 18, height: 18, accentColor: C.burgundy }}
      />
      <span style={{ fontSize: 13, color: C.navy }}>{label}</span>
    </div>
  );

  const previewBorder = cert.borderColor || '#10B981';
  const previewAccent = cert.accentColor || '#06B6D4';
  const previewBg = cert.backgroundColor || '#f8fafc';
  const previewHeader = cert.headerColor || '#1e293b';
  const previewText = cert.textColor || '#64748b';
  const layout = cert.layout || 'classic';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 4 }}>
      {/* Left: Settings */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16, fontFamily: 'Georgia, serif' }}>Certificate Design</h3>

        {selectField('Layout Style', 'layout', [
          { value: 'classic', label: 'Classic \u2014 Double border with centered text' },
          { value: 'modern', label: 'Modern \u2014 Top/bottom accent bars' },
          { value: 'elegant', label: 'Elegant \u2014 Large borders, larger typography' },
          { value: 'minimal', label: 'Minimal \u2014 Clean lines, understated' }
        ], 'classic')}

        {selectField('Orientation', 'orientation', [
          { value: 'landscape', label: 'Landscape' },
          { value: 'portrait', label: 'Portrait' }
        ], 'landscape')}

        <div style={{ marginTop: 20, marginBottom: 8, fontSize: 14, fontWeight: 700, color: C.navy }}>Colors</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {colorField('Border', 'borderColor', '#10B981')}
          {colorField('Accent', 'accentColor', '#06B6D4')}
          {colorField('Header Text', 'headerColor', '#1e293b')}
          {colorField('Body Text', 'textColor', '#64748b')}
          {colorField('Background', 'backgroundColor', '#f8fafc')}
        </div>

        <div style={{ marginTop: 20, marginBottom: 8, fontSize: 14, fontWeight: 700, color: C.navy }}>Branding</div>
        {textField('Certificate Title', 'certificateTitle', 'Certificate of Completion', 'Certificate of Completion')}
        {textField('Signer Name', 'signerName', 'CounselorReady', 'Name that appears on signature line')}
        {textField('Signer Title', 'signerTitle', 'NBCC Provider ACEP #7760', 'Title below signature')}
        {textField('Custom Footer', 'customFooter', '', 'Leave blank for default footer')}
        {textField('Logo URL', 'logoUrl', '', 'Cloudinary URL for logo image')}
        {textField('Signature Image URL', 'signatureUrl', '', 'Cloudinary URL for signature image')}

        <div style={{ marginTop: 20, marginBottom: 8, fontSize: 14, fontWeight: 700, color: C.navy }}>Display Options</div>
        {toggleField('Show NBCC Provider Info', 'showNbccLogo', true)}
        {toggleField('Show CE Hours', 'showCeHours', true)}
        {toggleField('Show Completion Date', 'showCompletionDate', true)}
        {toggleField('Show Verification Code', 'showVerificationCode', true)}

        <div style={{ marginTop: 20, padding: 12, background: 'rgba(74,124,89,0.06)', borderRadius: 8, fontSize: 12, color: C.textMuted }}>
          These settings are applied when certificates are generated for learners who complete this course. Changes apply to future certificates only.
        </div>
      </div>

      {/* Right: Live Preview */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16, fontFamily: 'Georgia, serif' }}>Preview</h3>
        <div style={{
          background: previewBg,
          borderRadius: 12,
          padding: layout === 'minimal' ? 24 : 16,
          border: '1px solid #e5e7eb',
          aspectRatio: (cert.orientation || 'landscape') === 'landscape' ? '11/8.5' : '8.5/11',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {(layout === 'classic' || layout === 'elegant') && (
            <>
              <div style={{ position: 'absolute', inset: 8, border: `2px solid ${previewBorder}`, borderRadius: 4, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 14, border: `1px solid ${previewAccent}`, borderRadius: 2, pointerEvents: 'none' }} />
            </>
          )}
          {layout === 'modern' && (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: previewBorder }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: previewBorder }} />
            </>
          )}
          {layout === 'minimal' && (
            <>
              <div style={{ position: 'absolute', top: 16, left: 24, right: 24, height: 1, background: previewBorder }} />
              <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24, height: 1, background: previewBorder }} />
            </>
          )}

          <div style={{ textAlign: 'center', padding: '8px 16px' }}>
            <div style={{ fontSize: 8, color: previewText, letterSpacing: 2, marginBottom: 2 }}>COUNSELORREADY</div>
            {(cert.showNbccLogo !== false) && (
              <div style={{ fontSize: 6, color: '#94a3b8', marginBottom: 6 }}>NBCC ACEP #7760</div>
            )}
            <div style={{
              fontSize: layout === 'elegant' ? 16 : 14,
              fontWeight: 700,
              color: previewHeader,
              fontFamily: 'Georgia, serif',
              marginBottom: 6
            }}>
              {cert.certificateTitle || 'Certificate of Completion'}
            </div>
            {layout !== 'minimal' && (
              <div style={{ width: 80, height: 1, background: previewBorder, margin: '0 auto 8px' }} />
            )}
            <div style={{ fontSize: 7, color: previewText, marginBottom: 4 }}>This certifies that</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: previewHeader, marginBottom: 4 }}>Jane Doe, LPC</div>
            <div style={{ fontSize: 7, color: previewText, marginBottom: 4 }}>has successfully completed</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: previewHeader, marginBottom: 6 }}>
              {courseData.title || 'Course Title'}
            </div>
            {(cert.showCeHours !== false) && (
              <div style={{ fontSize: 7, color: previewText }}>{courseData.ceHours || courseData.ceuHours || 3} CE Hours</div>
            )}
            {(cert.showCompletionDate !== false) && (
              <div style={{ fontSize: 7, color: previewText }}>Completed on March 15, 2026</div>
            )}
            <div style={{ fontSize: 6, color: '#94a3b8', marginTop: 4 }}>Certificate #CR-2026-000001</div>
            {(cert.showVerificationCode !== false) && (
              <div style={{ fontSize: 5, color: '#94a3b8', marginTop: 2 }}>Verification: counselorready.com/verify/abc123</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '0 12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 50, borderTop: '1px solid #cbd5e1', marginBottom: 2 }} />
                <div style={{ fontSize: 6, color: previewHeader }}>{courseData.presenter?.name || 'Instructor'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 50, borderTop: '1px solid #cbd5e1', marginBottom: 2 }} />
                <div style={{ fontSize: 6, color: previewHeader }}>{cert.signerName || 'CounselorReady'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Themes */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Quick Themes</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { name: 'CounselorReady', border: '#10B981', accent: '#06B6D4', bg: '#f8fafc', header: '#1e293b', text: '#64748b', layout: 'classic' },
              { name: 'Burgundy & Gold', border: '#8B2542', accent: '#D4A855', bg: '#faf8f5', header: '#6B1D34', text: '#555555', layout: 'elegant' },
              { name: 'Forest', border: '#4A7C59', accent: '#6B8F71', bg: '#f5f8f5', header: '#2d4a35', text: '#556B5B', layout: 'classic' },
              { name: 'Navy Professional', border: '#284157', accent: '#3d6b8e', bg: '#f8f9fb', header: '#1a2d3d', text: '#5a6b7d', layout: 'modern' },
              { name: 'Warm Minimal', border: '#c4956a', accent: '#d4a97a', bg: '#fefcf9', header: '#3d2e1e', text: '#7a6b5a', layout: 'minimal' },
              { name: 'Royal Purple', border: '#6B46C1', accent: '#9F7AEA', bg: '#faf8ff', header: '#44337A', text: '#6B5B95', layout: 'elegant' }
            ].map(theme => (
              <button
                key={theme.name}
                onClick={() => {
                  setCourseData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      certificateCustomization: {
                        ...(prev.settings?.certificateCustomization || {}),
                        borderColor: theme.border,
                        accentColor: theme.accent,
                        backgroundColor: theme.bg,
                        headerColor: theme.header,
                        textColor: theme.text,
                        layout: theme.layout
                      }
                    }
                  }));
                }}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: theme.border, display: 'inline-block' }} />
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: theme.accent, display: 'inline-block' }} />
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: theme.bg, display: 'inline-block', border: '1px solid #ddd' }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{theme.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
