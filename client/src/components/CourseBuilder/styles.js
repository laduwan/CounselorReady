// DROP INTO: client/src/components/CourseBuilder/styles.js

import { C } from './constants';

export const S = {
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
