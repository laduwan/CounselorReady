// DROP INTO: client/src/components/CourseBuilder/BlockTypeCatalog.jsx
import { C, BLOCK_TYPES } from "./constants";
import { S } from "./styles";

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

export default BlockTypeCatalog;
