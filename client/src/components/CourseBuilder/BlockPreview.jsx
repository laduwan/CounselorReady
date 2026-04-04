// DROP INTO: client/src/components/CourseBuilder/BlockPreview.jsx
// Renders blocks as students see them, including inline callout pills.

import { useState, useMemo } from "react";
import { parseAuthoringSyntax, SlimCalloutBlock, SlimAccordion, SlimSectionDivider } from "../CourseViewerPatch";

// ── Preview color tokens (match CourseViewerPatch T) ──
const P = {
  burgundy: "#6B1D34", burgundyLt: "#F9F0F3", burgundyMd: "#EDD5DC",
  forest: "#4A7C59", forestLt: "#EDF4EF",
  navy: "#284157", honey: "#8B5E2E", honeyLt: "#FDF3E7",
  cream: "#FAF5EC", pewter: "#DDD9D3",
  red: "#991B1B", redLt: "#FEF2F2",
  blue: "#1E3A5F", blueLt: "#EFF6FF",
  purple: "#4C1D95", purpleLt: "#F5F3FF",
};

function safeHTML(html) {
  if (!html) return "";
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

function readTime(html) {
  if (!html) return 1;
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}


// ═══════════════════════════════════════════════════════════
// BLOCK PREVIEW — renders one block as student sees it
// ═══════════════════════════════════════════════════════════
export default function BlockPreview({ block }) {
  if (!block) return null;

  switch (block.type) {

    case "sectionDivider":
      return <SlimSectionDivider sectionNumber={block.sectionNumber} title={block.title} subtitle={block.subtitle} />;

    case "text": {
      const parsed = parseAuthoringSyntax(block.content || block.textContent || "", block.callouts || {});
      return (
        <div>
          <div style={{ fontSize: "0.72rem", color: "#999", marginBottom: 6 }}>⏱ ~{readTime(parsed)} min read</div>
          <div style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#333" }} dangerouslySetInnerHTML={{ __html: safeHTML(parsed) }} />
        </div>
      );
    }

    case "imageText": {
      const parsed = parseAuthoringSyntax(block.content || "", block.callouts || {});
      return (
        <div style={{ display: "flex", gap: 16, flexDirection: block.imagePosition === "right" ? "row-reverse" : "row" }}>
          <div style={{ width: 140, height: 100, background: P.cream, borderRadius: 8, border: `1px solid ${P.pewter}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
            {block.image ? <img src={block.image} alt={block.imageAlt || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#ccc", fontSize: "1.5rem" }}>🖼</span>}
          </div>
          <div style={{ flex: 1 }}>
            {block.title && <h4 style={{ margin: "0 0 6px", fontSize: "0.9rem", fontWeight: 700, color: P.navy }}>{block.title}</h4>}
            <div style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "#444" }} dangerouslySetInnerHTML={{ __html: safeHTML(parsed) }} />
          </div>
        </div>
      );
    }

    case "image":
      return (
        <div style={{ textAlign: block.imageAlignment || "center" }}>
          {block.imageUrl ? (
            <img src={block.imageUrl} alt={block.imageAltText || ""} style={{ maxWidth: block.imageSize === "small" ? "40%" : block.imageSize === "medium" ? "65%" : "100%", borderRadius: 8 }} />
          ) : (
            <div style={{ width: "100%", height: 120, background: P.cream, borderRadius: 8, border: `1px dashed ${P.pewter}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>📷 Image placeholder</div>
          )}
          {block.imageCaption && <p style={{ fontSize: "0.75rem", color: "#888", marginTop: 6, fontStyle: "italic" }}>{block.imageCaption}</p>}
        </div>
      );

    case "accordion":
      return <SlimAccordion items={block.accordionItems || block.items || []} />;

    case "multipleChoice":
      return <MCPreview block={block} multi={false} />;

    case "multiSelect":
      return <MCPreview block={block} multi={true} />;

    case "matching":
      return <MatchingPreview block={block} />;

    case "reflection":
      return (
        <div style={{ background: P.forestLt, border: `1px solid ${P.forest}`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span>💭</span>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: P.forest }}>Reflection</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "#333", lineHeight: 1.6, fontStyle: "italic", margin: "0 0 10px" }}>{block.question}</p>
          <div style={{ background: "#fff", border: `1px solid ${P.pewter}`, borderRadius: 8, padding: 12, minHeight: 60, color: "#bbb", fontSize: "0.82rem" }}>
            Type your reflection here... (min {block.minLength || 50} characters)
          </div>
        </div>
      );

    case "resources":
      return (
        <div style={{ borderRadius: 10, border: `1px solid ${P.pewter}`, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", background: P.cream, fontWeight: 700, fontSize: "0.82rem", color: P.navy }}>📎 Resources</div>
          {(block.resources || []).map((r, i) => (
            <div key={i} style={{ padding: "8px 14px", borderTop: `1px solid ${P.pewter}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.8rem" }}>{r.type === "pdf" ? "📄" : r.type === "video" ? "🎬" : "🔗"}</span>
              <span style={{ fontSize: "0.83rem", color: P.blue, fontWeight: 500 }}>{r.title || r.url || "Untitled"}</span>
            </div>
          ))}
        </div>
      );

    case "videoEmbed":
      return (
        <div>
          <div style={{ width: "100%", height: 160, background: "#1a1a1a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {block.thumbnailUrl ? <img src={block.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} /> : <span style={{ fontSize: "2rem" }}>▶️</span>}
            <span style={{ position: "absolute", bottom: 8, left: 12, color: "#fff", fontSize: "0.75rem", background: "rgba(0,0,0,0.6)", padding: "2px 8px", borderRadius: 4 }}>{block.videoTitle || "Video"} · {block.videoDuration || "0:00"}</span>
          </div>
          {(block.markers || []).length > 0 && (
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {block.markers.map((m, i) => <span key={i} style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 12, background: P.cream, border: `1px solid ${P.pewter}`, color: P.navy }}>{m.time} — {m.label}</span>)}
            </div>
          )}
        </div>
      );

    case "cardSort":
      return <CardSortPreview block={block} />;

    case "sequencing":
      return <SequencingPreview block={block} />;

    case "timeline":
      return <TimelinePreview block={block} />;

    case "hotspot":
      return (
        <div style={{ background: P.purpleLt, border: `1px solid #7C3AED`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span>🎯</span>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: P.purple }}>Interactive Diagram</span>
          </div>
          {block.instructions && <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 10px" }}>{block.instructions}</p>}
          <div style={{ width: "100%", height: 120, background: "#fff", borderRadius: 8, border: `1px dashed ${P.pewter}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", position: "relative" }}>
            {block.hotspotImage ? <img src={block.hotspotImage} alt={block.imageDescription || ""} style={{ maxWidth: "100%", maxHeight: "100%" }} /> : "Image + clickable hotspots"}
            {(block.hotspots || []).map((h, i) => (
              <span key={i} style={{ position: "absolute", left: `${h.x || 20 + i * 15}%`, top: `${h.y || 30}%`, width: 18, height: 18, borderRadius: "50%", background: "#7C3AED", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.6rem", fontWeight: 700, cursor: "pointer" }}>{i + 1}</span>
            ))}
          </div>
        </div>
      );

    case "scenarioTree":
      return <ScenarioPreview block={block} />;

    case "flashcardDeck":
      return <FlashcardPreview block={block} />;

    // ── NEW BLOCK TYPES (from CourseViewerPatch) ──

    case "callout":
      return <SlimCalloutBlock type={block.calloutType || block.variant || "info"} title={block.title} items={block.items || []} content={block.content} />;

    case "keyTakeaway":
      return (
        <div style={{ background: `linear-gradient(135deg, ${P.honeyLt}, #FFF8E7)`, border: `1.5px solid #D4A855`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span>🔑</span>
            <span style={{ fontWeight: 800, fontSize: "0.88rem", color: P.honey }}>Key Takeaway</span>
          </div>
          {block.title && <p style={{ fontWeight: 700, fontSize: "0.9rem", color: P.navy, margin: "0 0 6px" }}>{block.title}</p>}
          <p style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.65, margin: 0 }}>{block.content}</p>
          {(block.points || []).length > 0 && (
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {block.points.map((pt, i) => <li key={i} style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6, marginBottom: 2 }}>{pt}</li>)}
            </ul>
          )}
        </div>
      );

    case "fillInBlank":
      return <FillInBlankPreview block={block} />;

    default:
      return (
        <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 8, color: "#888", fontSize: "0.82rem", textAlign: "center" }}>
          Preview not available for block type: <strong>{block.type}</strong>
        </div>
      );
  }
}


// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function MCPreview({ block, multi }) {
  const [selected, setSelected] = useState(multi ? [] : null);
  const [submitted, setSubmitted] = useState(false);

  const options = block.options || [];
  const getCorrect = () => {
    if (options.length && typeof options[0] === "object") {
      return options.map((o, i) => o.isCorrect ? i : -1).filter(i => i >= 0);
    }
    if (block.correctAnswer !== undefined) return [block.correctAnswer];
    if (block.correctAnswers) return block.correctAnswers;
    return [];
  };

  const optionText = (opt) => typeof opt === "object" ? opt.text : opt;
  const correctIdxs = getCorrect();

  const handleSelect = (i) => {
    if (submitted) return;
    if (multi) {
      setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    } else {
      setSelected(i);
    }
  };

  const isSelected = (i) => multi ? (selected || []).includes(i) : selected === i;
  const isCorrect = (i) => correctIdxs.includes(i);

  return (
    <div style={{ background: P.burgundyLt, border: `1px solid ${P.burgundyMd}`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span>{multi ? "☑" : "◉"}</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: P.burgundy }}>{multi ? "Select All That Apply" : "Knowledge Check"}</span>
      </div>
      <p style={{ fontWeight: 600, fontSize: "0.88rem", color: P.navy, margin: "0 0 12px", lineHeight: 1.5 }}>{block.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} style={{
            padding: "8px 12px", borderRadius: 8, textAlign: "left",
            background: submitted ? (isCorrect(i) ? P.forestLt : isSelected(i) ? P.redLt : "#fff") : (isSelected(i) ? P.burgundyMd : "#fff"),
            border: `1.5px solid ${submitted ? (isCorrect(i) ? P.forest : isSelected(i) ? "#DC2626" : P.pewter) : (isSelected(i) ? P.burgundy : P.pewter)}`,
            color: P.navy, fontSize: "0.83rem", cursor: submitted ? "default" : "pointer", transition: "all 0.15s",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: multi ? 4 : "50%", marginRight: 8, background: isSelected(i) ? P.burgundy : P.cream, color: isSelected(i) ? "#fff" : P.navy, fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>
              {submitted && isCorrect(i) ? "✓" : String.fromCharCode(65 + i)}
            </span>
            {optionText(opt)}
          </button>
        ))}
      </div>
      <button onClick={() => setSubmitted(true)} disabled={submitted || (multi ? !(selected || []).length : selected === null)} style={{
        marginTop: 12, padding: "6px 16px", borderRadius: 8, border: "none",
        background: submitted ? P.pewter : P.burgundy, color: "#fff", fontSize: "0.82rem", fontWeight: 700,
        cursor: submitted ? "default" : "pointer", opacity: (multi ? !(selected || []).length : selected === null) ? 0.5 : 1,
      }}>
        {submitted ? "Submitted ✓" : "Check Answer"}
      </button>
      {submitted && block.explanation && (
        <div style={{ marginTop: 10, padding: "8px 12px", background: "#fff", borderRadius: 8, border: `1px solid ${P.pewter}`, fontSize: "0.82rem", color: "#555", lineHeight: 1.6 }}>
          💡 {block.explanation}
        </div>
      )}
    </div>
  );
}

function MatchingPreview({ block }) {
  const pairs = block.matchingPairs || [];
  return (
    <div style={{ background: P.blueLt, border: `1px solid #3B82F6`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span>↔</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: P.blue }}>Matching</span>
      </div>
      {block.matchingInstructions && <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 10px" }}>{block.matchingInstructions}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: P.blue, marginBottom: 6, textTransform: "uppercase" }}>Terms</div>
          {pairs.map((p, i) => <div key={i} style={{ padding: "6px 10px", background: "#fff", borderRadius: 6, border: `1px solid ${P.pewter}`, marginBottom: 4, fontSize: "0.82rem", fontWeight: 600, color: P.navy }}>{p.term}</div>)}
        </div>
        <div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: P.blue, marginBottom: 6, textTransform: "uppercase" }}>Definitions</div>
          {pairs.map((p, i) => <div key={i} style={{ padding: "6px 10px", background: "#fff", borderRadius: 6, border: `1px dashed ${P.pewter}`, marginBottom: 4, fontSize: "0.82rem", color: "#555" }}>{p.definition}</div>)}
        </div>
      </div>
    </div>
  );
}

function CardSortPreview({ block }) {
  return (
    <div style={{ background: P.blueLt, border: `1px solid #0284C7`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span>🗂</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#0369A1" }}>Card Sort</span>
      </div>
      {block.instructions && <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 10px" }}>{block.instructions}</p>}
      <div style={{ display: "flex", gap: 12 }}>
        {(block.categories || []).map((cat, ci) => (
          <div key={ci} style={{ flex: 1, background: "#fff", borderRadius: 8, border: `1px dashed ${P.pewter}`, padding: 10, minHeight: 80, textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: P.navy, marginBottom: 8, borderBottom: `1px solid ${P.pewter}`, paddingBottom: 4 }}>{cat}</div>
            <div style={{ color: "#ccc", fontSize: "0.72rem" }}>Drop cards here</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(block.cards || []).map((c, i) => <span key={i} style={{ padding: "4px 10px", background: P.cream, borderRadius: 6, border: `1px solid ${P.pewter}`, fontSize: "0.78rem", color: P.navy, cursor: "grab" }}>{c.text}</span>)}
      </div>
    </div>
  );
}

function SequencingPreview({ block }) {
  return (
    <div style={{ background: P.blueLt, border: `1px solid #3B82F6`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span>📋</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: P.blue }}>Put in Order</span>
      </div>
      {block.instructions && <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 10px" }}>{block.instructions}</p>}
      {(block.steps || []).map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#fff", borderRadius: 6, border: `1px solid ${P.pewter}`, marginBottom: 4, cursor: "grab" }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: P.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: P.navy, flexShrink: 0 }}>⠿</span>
          <span style={{ fontSize: "0.82rem", color: P.navy }}>{s.text}</span>
        </div>
      ))}
    </div>
  );
}

function TimelinePreview({ block }) {
  return (
    <div style={{ background: P.blueLt, border: `1px solid #0F766E`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span>📅</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#0F766E" }}>Timeline</span>
      </div>
      {block.instructions && <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 10px" }}>{block.instructions}</p>}
      {(block.events || []).map((ev, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, position: "relative", paddingLeft: 20 }}>
          <div style={{ position: "absolute", left: 4, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#0F766E", border: "2px solid #fff" }} />
          {i < (block.events || []).length - 1 && <div style={{ position: "absolute", left: 8, top: 16, width: 2, height: "calc(100% + 4px)", background: P.pewter }} />}
          <div>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0F766E" }}>{ev.year}</span>
            <p style={{ fontSize: "0.82rem", color: P.navy, margin: "2px 0 0", lineHeight: 1.5 }}>{ev.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScenarioPreview({ block }) {
  const [currentNode, setCurrentNode] = useState(block.startNode || "start");
  const nodes = block.nodes || {};
  const node = nodes[currentNode];
  if (!node) return <div style={{ color: "#888", fontSize: "0.82rem" }}>Scenario tree not configured.</div>;

  return (
    <div style={{ background: P.burgundyLt, border: `1px solid ${P.burgundyMd}`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span>🔀</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: P.burgundy }}>Clinical Scenario</span>
        {block.scenarioTitle && <span style={{ fontSize: "0.78rem", color: "#888" }}>— {block.scenarioTitle}</span>}
      </div>
      <p style={{ fontSize: "0.88rem", color: "#333", lineHeight: 1.6, margin: "0 0 12px" }}>{node.text}</p>
      {node.feedback && <div style={{ padding: "6px 10px", background: P.forestLt, borderRadius: 6, fontSize: "0.82rem", color: P.forest, marginBottom: 10 }}>💡 {node.feedback}</div>}
      {(node.choices || []).map((ch, i) => (
        <button key={i} onClick={() => ch.next && nodes[ch.next] && setCurrentNode(ch.next)} style={{
          display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: 4,
          borderRadius: 8, border: `1px solid ${P.burgundyMd}`, background: "#fff",
          color: P.navy, fontSize: "0.83rem", cursor: ch.next ? "pointer" : "default",
        }}>
          {String.fromCharCode(65 + i)}. {ch.text}
        </button>
      ))}
      {currentNode !== (block.startNode || "start") && (
        <button onClick={() => setCurrentNode(block.startNode || "start")} style={{ marginTop: 8, fontSize: "0.75rem", color: P.burgundy, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>↩ Restart scenario</button>
      )}
    </div>
  );
}

function FlashcardPreview({ block }) {
  const cards = block.flashcards || [];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return <div style={{ color: "#888", fontSize: "0.82rem" }}>No flashcards.</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span>🃏</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#B45309" }}>Flashcards</span>
        <span style={{ fontSize: "0.72rem", color: "#999", marginLeft: "auto" }}>{idx + 1} / {cards.length}</span>
      </div>
      <div onClick={() => setFlipped(f => !f)} style={{
        minHeight: 100, padding: 20, borderRadius: 10, cursor: "pointer", textAlign: "center",
        background: flipped ? P.forestLt : "#fff", border: `1.5px solid ${flipped ? P.forest : P.pewter}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", transition: "all 0.2s",
      }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#bbb", textTransform: "uppercase", marginBottom: 8 }}>{flipped ? "ANSWER" : "QUESTION"}</div>
        <div style={{ fontSize: "0.9rem", color: flipped ? P.forest : P.navy, fontWeight: 600, lineHeight: 1.5 }}>{flipped ? cards[idx].back : cards[idx].front}</div>
        <div style={{ fontSize: "0.65rem", color: "#ccc", marginTop: 10 }}>tap to flip</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
        <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0} style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${P.pewter}`, background: "#fff", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.4 : 1, fontSize: "0.78rem" }}>← Prev</button>
        <button onClick={() => { setIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); }} disabled={idx === cards.length - 1} style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${P.pewter}`, background: "#fff", cursor: idx === cards.length - 1 ? "default" : "pointer", opacity: idx === cards.length - 1 ? 0.4 : 1, fontSize: "0.78rem" }}>Next →</button>
      </div>
    </div>
  );
}

function FillInBlankPreview({ block }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const blanks = block.blanks || [];

  let sentence = block.sentence || block.content || "";
  const rendered = sentence.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
    const i = parseInt(idx);
    const blank = blanks[i];
    if (!blank) return "___";
    const val = answers[i] || "";
    const correct = submitted && val.toLowerCase().trim() === (blank.answer || "").toLowerCase().trim();
    const wrong = submitted && val && !correct;
    return `<span style="display:inline-block;min-width:80px;border-bottom:2px solid ${submitted ? (correct ? P.forest : wrong ? "#DC2626" : P.pewter) : P.burgundy};padding:2px 4px;text-align:center;color:${submitted ? (correct ? P.forest : "#DC2626") : P.navy};font-weight:600;">${val || "___"}</span>`;
  });

  return (
    <div style={{ background: P.honeyLt, border: `1px solid #D4A855`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span>✏️</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: P.honey }}>Fill in the Blank</span>
      </div>
      {block.instructions && <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 8px" }}>{block.instructions}</p>}
      <div style={{ fontSize: "0.88rem", color: "#333", lineHeight: 1.8, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: rendered }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {blanks.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: P.honey }}>#{i + 1}:</span>
            <input type="text" placeholder={b.hint || "..."} value={answers[i] || ""} onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))} disabled={submitted} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${P.pewter}`, fontSize: "0.82rem", width: 120 }} />
          </div>
        ))}
      </div>
      <button onClick={() => setSubmitted(true)} disabled={submitted} style={{
        padding: "5px 14px", borderRadius: 8, border: "none", background: submitted ? P.pewter : P.burgundy,
        color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: submitted ? "default" : "pointer",
      }}>{submitted ? "Submitted ✓" : "Check"}</button>
    </div>
  );
}
