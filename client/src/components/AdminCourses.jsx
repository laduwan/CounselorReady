// DROP INTO: /client/src/components/AdminCourses.jsx
// =================================================
// Full React replacement for admin-courses.html
// Categorized, filterable, with health status indicators.
//
// In App.jsx replace the courses iframe route with:
//   import AdminCourses from './components/AdminCourses';
//   <Route path="/admin/courses" element={
//     <AdminRoute><AdminLayout title="Courses"><AdminCourses /></AdminLayout></AdminRoute>
//   } />

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Search, Plus, Trash2, Eye, Check, X, Loader2,
  AlertTriangle, CheckCircle, Clock, Archive, Grid3X3, List,
  ChevronDown, ChevronRight, Globe, Lock, Database,
  Edit3,
} from "lucide-react";

// ─── Brand ────────────────────────────────────────────────────
const C = {
  burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.06)",
  green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.06)",
  gold: "#D4A855", goldFaded: "rgba(212,168,85,0.10)",
  navy: "#34495E",
  bg: "#F7F5F2", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
  danger: "#DC2626",
  purple: "#7C3AED", teal: "#0F766E", sky: "#0284C7", amber: "#B45309",
};

const API = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "https://api.counselorready.com/api";

// ─── Category registry ────────────────────────────────────────
const CAT = {
  "Crisis":            { color: "#DC2626", icon: "🚨", code: "1xx" },
  "Ethics":            { color: C.navy,    icon: "⚖️",  code: "2xx" },
  "Clinical Practice": { color: C.green,   icon: "🧠", code: "3xx" },
  "Clinical Skills":   { color: C.green,   icon: "🧠", code: "3xx" },
  "Movie-Themed":      { color: C.purple,  icon: "🎬", code: "4xx" },
  "Evidence-Based Tx": { color: C.teal,    icon: "📊", code: "5xx" },
  "Cultural":          { color: C.amber,   icon: "🌍", code: "6xx" },
  "Telehealth":        { color: C.sky,     icon: "💻", code: "7xx" },
  "Career":            { color: C.gold,    icon: "🎯", code: "8xx" },
  "Supervision":       { color: C.burgundy,icon: "👥", code: "9xx" },
  "Trauma":            { color: "#9333EA", icon: "💜", code: "11x" },
};

function catInfo(raw) {
  if (!raw) return { color: C.textLight, icon: "📦", code: "" };
  const k = Object.keys(CAT).find(k => raw.toLowerCase().includes(k.toLowerCase()));
  return CAT[k] || { color: C.textLight, icon: "📦", code: "" };
}
function getCat(c) { return c.category || c.contentArea || c.ceuCategories?.[0]?.category || "Uncategorized"; }
function getCE(c) { return c.ceuHours || c.ceHours || c.credits || 0; }
function isPub(c) { return c.isPublished || c.status === "published"; }

// ─── Health ───────────────────────────────────────────────────
function healthOf(c) {
  const mods = c.modules || c.sections || [];
  const ce = getCE(c);
  const pub = isPub(c);
  let words = 0;
  mods.forEach(m => (m.lessons || m.contentBlocks || []).forEach(l => {
    words += (l.content || l.textContent || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  }));
  const need = ce * 6000;
  if (pub && ce > 0 && words >= need * 0.8)
    return { key: "complete", label: "Complete", color: C.green, Icon: CheckCircle, pri: 1 };
  if (ce > 0 && mods.length > 0 && words > 500) {
    if (words < need * 0.5)
      return { key: "expand", label: "Needs Expansion", color: C.gold, Icon: AlertTriangle, pri: 2 };
    return { key: "review", label: "Needs Review", color: C.sky, Icon: Clock, pri: 3 };
  }
  if (mods.length > 0 || words > 100)
    return { key: "wip", label: "In Progress", color: C.navy, Icon: Edit3, pri: 4 };
  return { key: "empty", label: "Empty Shell", color: C.textLight, Icon: Archive, pri: 5 };
}

// ─── Shared styles ────────────────────────────────────────────
const bdg = (color, filled) => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, lineHeight: "16px",
  background: filled ? color : color + "12", color: filled ? "#fff" : color, whiteSpace: "nowrap",
});
const btnS = (bg, fg) => ({
  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
  borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
  color: fg, background: bg, transition: "opacity 0.15s",
});
const outl = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px",
  borderRadius: 8, fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`,
  cursor: "pointer", color: C.text, background: C.card, transition: "all 0.15s",
};
const crd = {
  background: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden",
};

// ═══════════════════════════════════════════════════════════════
export default function AdminCourses() {
  const nav = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [hFilter, setHFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("health");
  const [view, setView] = useState("list");
  const [expandedCats, setExpandedCats] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const t = localStorage.getItem("token");
      const r = await fetch(`${API}/admin/courses`, { headers: { Authorization: `Bearer ${t}` } });
      if (!r.ok) throw new Error("Failed to load");
      const d = await r.json();
      setCourses((Array.isArray(d) ? d : d.courses || []).map(c => ({ ...c, _health: healthOf(c) })));
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Stats
  const st = {
    total: courses.length,
    published: courses.filter(isPub).length,
    totalCE: courses.reduce((s, c) => s + getCE(c), 0),
    complete: courses.filter(c => c._health.key === "complete").length,
    expand: courses.filter(c => c._health.key === "expand").length,
    review: courses.filter(c => c._health.key === "review").length,
    wip: courses.filter(c => c._health.key === "wip").length,
    empty: courses.filter(c => c._health.key === "empty").length,
  };

  const cats = [...new Set(courses.map(getCat))].sort();

  // Filter + sort
  let list = courses;
  if (search) { const q = search.toLowerCase(); list = list.filter(c => (c.title||"").toLowerCase().includes(q) || (c.courseCode||"").toLowerCase().includes(q)); }
  if (hFilter !== "all") list = list.filter(c => c._health.key === hFilter);
  if (catFilter !== "all") list = list.filter(c => getCat(c) === catFilter);
  list = [...list].sort((a, b) => {
    if (sortBy === "health") return a._health.pri - b._health.pri;
    if (sortBy === "title") return (a.title||"").localeCompare(b.title||"");
    if (sortBy === "ce") return getCE(b) - getCE(a);
    if (sortBy === "newest") return new Date(b.createdAt||0) - new Date(a.createdAt||0);
    return 0;
  });

  // Group by category
  const grouped = {};
  list.forEach(c => { const cat = getCat(c); if (!grouped[cat]) grouped[cat] = []; grouped[cat].push(c); });
  const catKeys = Object.keys(grouped).sort((a, b) => a === "Uncategorized" ? 1 : a.localeCompare(b));

  // Actions
  const togglePub = async (c) => {
    try {
      const t = localStorage.getItem("token");
      await fetch(`${API}/admin/courses/${c._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ isPublished: !isPub(c), status: isPub(c) ? "draft" : "published" }),
      });
      load();
    } catch (e) { alert(e.message); }
  };

  const del = async (c) => {
    if (!confirm(`Delete "${c.title}"?\nThis cannot be undone.`)) return;
    try {
      const t = localStorage.getItem("token");
      await fetch(`${API}/admin/courses/${c._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${t}` } });
      load();
    } catch (e) { alert(e.message); }
  };

  // Loading / error
  if (loading) return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <Loader2 size={28} color={C.burgundy} style={{ animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: C.textMuted, marginTop: 12, fontSize: 14 }}>Loading courses...</p>
    </div>
  );

  if (err) return (
    <div style={{ ...crd, padding: 40, textAlign: "center" }}>
      <AlertTriangle size={28} color={C.danger} />
      <p style={{ color: C.danger, fontWeight: 600, margin: "12px 0" }}>{err}</p>
      <button style={btnS(C.burgundy, "#fff")} onClick={load}>Retry</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', 'Lato', system-ui, sans-serif" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Course Catalog</h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: "4px 0 0" }}>
            {st.total} courses · {st.totalCE} CE hours · {st.published} published
          </p>
        </div>
        <button style={btnS(C.green, "#fff")} onClick={() => nav("/admin/course-builder")}>
          <Plus size={15} /> New Course
        </button>
      </div>

      {/* Health filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { k: "all",      label: "All",            n: st.total,    color: C.navy,      icon: "📚" },
          { k: "complete", label: "Complete",        n: st.complete, color: C.green,     icon: "✅" },
          { k: "expand",   label: "Needs Expansion", n: st.expand,  color: C.gold,      icon: "⚠️" },
          { k: "review",   label: "Needs Review",    n: st.review,  color: C.sky,       icon: "🔍" },
          { k: "wip",      label: "In Progress",     n: st.wip,     color: C.navy,      icon: "🔨" },
          { k: "empty",    label: "Empty Shells",    n: st.empty,   color: C.textLight,  icon: "📦" },
        ].map(p => (
          <button key={p.k} onClick={() => setHFilter(hFilter === p.k ? "all" : p.k)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: hFilter === p.k ? `2px solid ${p.color}` : `1px solid ${C.border}`,
            background: hFilter === p.k ? p.color + "10" : C.card, color: hFilter === p.k ? p.color : C.textMuted,
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <span>{p.icon}</span> {p.label}
            <span style={{
              fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 10,
              background: hFilter === p.k ? p.color : C.textLight + "22", color: hFilter === p.k ? "#fff" : C.textMuted,
            }}>{p.n}</span>
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ ...crd, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <Search size={15} color={C.textLight} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or code..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 8, outline: "none", background: C.card, color: C.text }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...outl, padding: "8px 10px", fontSize: 12 }}>
          <option value="all">All Categories</option>
          {cats.map(c => <option key={c} value={c}>{catInfo(c).icon} {c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...outl, padding: "8px 10px", fontSize: 12 }}>
          <option value="health">Sort: Health</option>
          <option value="title">Sort: A→Z</option>
          <option value="ce">Sort: CE Hours</option>
          <option value="newest">Sort: Newest</option>
        </select>
        <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          {[["list", List], ["grid", Grid3X3]].map(([m, I]) => (
            <button key={m} onClick={() => setView(m)} style={{
              padding: "6px 9px", background: view === m ? C.burgundyFaded : C.card,
              border: "none", cursor: "pointer", display: "flex",
              borderLeft: m === "grid" ? `1px solid ${C.border}` : "none",
            }}><I size={15} color={view === m ? C.burgundy : C.textLight} /></button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>Showing {list.length} of {courses.length}</span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 11, color: C.textMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Globe size={11} color={C.green} /> User-facing (live)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Lock size={11} color={C.gold} /> Admin-only (draft)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Database size={11} color={C.textLight} /> Mongo ID</span>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div style={{ ...crd, padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <p style={{ color: C.textMuted }}>No courses match your filters.</p>
          <button style={{ ...outl, marginTop: 12 }} onClick={() => { setSearch(""); setHFilter("all"); setCatFilter("all"); }}>Clear Filters</button>
        </div>
      ) : view === "grid" ? (
        /* ── Grid ── */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {list.map(c => <GridCard key={c._id} c={c} nav={nav} onPub={() => togglePub(c)} onDel={() => del(c)} />)}
        </div>
      ) : (
        /* ── Grouped list ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {catKeys.map(catKey => {
            const ci = catInfo(catKey);
            const items = grouped[catKey];
            const exp = expandedCats[catKey] !== false;
            const catCE = items.reduce((s, c) => s + getCE(c), 0);
            const pubN = items.filter(isPub).length;

            return (
              <div key={catKey} style={crd}>
                <button onClick={() => setExpandedCats(p => ({ ...p, [catKey]: !exp }))} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 18px", background: ci.color + "06",
                  border: "none", borderBottom: exp ? `1px solid ${C.borderLight}` : "none",
                  cursor: "pointer", textAlign: "left",
                }}>
                  {exp ? <ChevronDown size={16} color={ci.color} /> : <ChevronRight size={16} color={ci.color} />}
                  <span style={{ fontSize: 17 }}>{ci.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ci.color, flex: 1 }}>{catKey}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>
                    {items.length} course{items.length !== 1 ? "s" : ""} · {catCE} CE hrs · {pubN} live
                  </span>
                </button>

                {exp && (
                  <>
                    {/* Column headers */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 70px 68px 130px 130px",
                      gap: 10, padding: "6px 18px", background: C.bg,
                      borderBottom: `1px solid ${C.borderLight}`,
                      fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      <span>Course</span><span style={{ textAlign: "center" }}>CE</span>
                      <span>Status</span><span>Health</span><span style={{ textAlign: "right" }}>Actions</span>
                    </div>
                    {items.map((c, i) => (
                      <Row key={c._id} c={c} last={i === items.length - 1} nav={nav} onPub={() => togglePub(c)} onDel={() => del(c)} />
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── Row ──────────────────────────────────────────────────────
function Row({ c, last, nav, onPub, onDel }) {
  const ce = getCE(c); const pub = isPub(c); const h = c._health; const HI = h.Icon;
  const mods = (c.modules || c.sections || []).length;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 70px 68px 130px 130px",
      gap: 10, padding: "11px 18px", alignItems: "center",
      borderBottom: last ? "none" : `1px solid ${C.borderLight}`, transition: "background 0.1s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = C.bg}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>
          {pub ? <Globe size={11} color={C.green} style={{ marginRight: 5, verticalAlign: -1 }} /> : <Lock size={11} color={C.gold} style={{ marginRight: 5, verticalAlign: -1 }} />}
          {c.title || "Untitled"}
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, display: "flex", gap: 6, alignItems: "center" }}>
          {c.courseCode && <span style={{ fontFamily: "monospace", fontWeight: 600, color: C.navy }}>{c.courseCode}</span>}
          <span>{mods} mod{mods !== 1 ? "s" : ""}</span>
          <Database size={9} color={C.textLight} />
          <span style={{ fontSize: 9, color: C.textLight, fontFamily: "monospace" }}>{c._id?.slice(-6)}</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: ce > 0 ? C.green : C.textLight }}>{ce || "—"}</span>
      </div>
      <div><span style={bdg(pub ? C.green : C.gold)}>{pub ? "Live" : "Draft"}</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <HI size={12} color={h.color} />
        <span style={{ fontSize: 11, fontWeight: 500, color: h.color }}>{h.label}</span>
      </div>
      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
        <button onClick={() => nav(`/admin/course-preview?id=${c._id}`)} title="Preview" style={{ ...outl, padding: "4px 7px" }}><Eye size={13} /></button>
        <button onClick={onPub} title={pub ? "Unpublish" : "Publish"} style={{ ...outl, padding: "4px 7px", color: pub ? C.gold : C.green, borderColor: (pub ? C.gold : C.green) + "44" }}>{pub ? <X size={13} /> : <Check size={13} />}</button>
        <button onClick={onDel} title="Delete" style={{ ...outl, padding: "4px 7px", color: C.danger, borderColor: C.danger + "44" }}><Trash2 size={13} /></button>
      </div>
    </div>
  );
}


// ─── Grid card ────────────────────────────────────────────────
function GridCard({ c, nav, onPub, onDel }) {
  const ci = catInfo(getCat(c)); const ce = getCE(c); const pub = isPub(c);
  const h = c._health; const HI = h.Icon; const mods = (c.modules || c.sections || []).length;
  return (
    <div style={{ ...crd, display: "flex", flexDirection: "column", transition: "box-shadow 0.15s, transform 0.15s", cursor: "pointer" }}
      onClick={() => nav(`/admin/course-preview?id=${c._id}`)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${ci.color}, ${h.color})` }} />
      <div style={{ padding: "16px 18px", flex: 1 }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={bdg(ci.color)}>{ci.icon} {getCat(c)}</span>
          <span style={bdg(h.color)}><HI size={10} /> {h.label}</span>
          {pub && <span style={bdg(C.green, true)}><Globe size={10} /> Live</span>}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 8px", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {c.title || "Untitled"}
        </h3>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.textMuted }}>
          <span><strong style={{ color: ce > 0 ? C.green : C.textLight, fontSize: 15 }}>{ce || "—"}</strong> CE</span>
          <span><strong style={{ color: C.navy }}>{mods}</strong> mod{mods !== 1 ? "s" : ""}</span>
          {c.courseCode && <span style={{ fontFamily: "monospace", fontSize: 11, color: ci.color }}>{c.courseCode}</span>}
        </div>
        <div style={{ fontSize: 9, color: C.textLight, marginTop: 8, display: "flex", alignItems: "center", gap: 3 }}>
          <Database size={9} /> {c._id?.slice(-8)}
        </div>
      </div>
      <div style={{ display: "flex", borderTop: `1px solid ${C.borderLight}`, padding: "8px 14px", gap: 6 }} onClick={e => e.stopPropagation()}>
        <button style={{ ...outl, flex: 1, padding: "5px 0", justifyContent: "center", fontSize: 11 }} onClick={() => nav(`/admin/course-preview?id=${c._id}`)}><Eye size={12} /> Preview</button>
        <button style={{ ...outl, flex: 1, padding: "5px 0", justifyContent: "center", fontSize: 11, color: pub ? C.gold : C.green, borderColor: (pub ? C.gold : C.green) + "44" }} onClick={onPub}>{pub ? <><X size={12} /> Unpub</> : <><Check size={12} /> Pub</>}</button>
        <button style={{ ...outl, padding: "5px 8px", color: C.danger, borderColor: C.danger + "44" }} onClick={onDel}><Trash2 size={12} /></button>
      </div>
    </div>
  );
}
