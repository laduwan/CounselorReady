/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  burgundy: "#6B1D34",
  green: "#4A7C59",
  gold: "#D4A855",
  navy: "#284157",
  eggshell: "#F5F5DC",
  stone: "#F8F7F4",
};

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://api.counselorready.com";

const CURATED = {
  "therapy-general": [
    { id: "ZHvM3XIOHoE", label: "Calm workspace" },
    { id: "bGdiuIyN3Rs", label: "Journal & pen" },
    { id: "505eectW54k", label: "Peaceful nature" },
    { id: "eICUFSeirc0", label: "Mountain vista" },
    { id: "ln5drpv_ImI", label: "Sunrise calm" },
    { id: "5aiRb5f464A", label: "Serene water" },
  ],
  ethics: [
    { id: "OQMZwNd3ThU", label: "Scales of justice" },
    { id: "5Q07sS54D0Q", label: "Library books" },
    { id: "YLSwjSy7stw", label: "Compass" },
    { id: "sfL_QOnmy00", label: "Handshake" },
    { id: "9pw4TKvT3po", label: "Gavel" },
  ],
  telehealth: [
    { id: "FPt10LXK0cg", label: "Video call" },
    { id: "gUIJ0YszPig", label: "Laptop workspace" },
    { id: "Im7lZjxeLhg", label: "Digital connection" },
    { id: "hGV2TfOh0ns", label: "Screen meeting" },
    { id: "C5SUkYZT7nU", label: "Home office" },
  ],
  trauma: [
    { id: "HQqIOc8oYro", label: "Healing light" },
    { id: "K9QHL52rE2k", label: "Resilience" },
    { id: "Do6yoytec5E", label: "Path forward" },
    { id: "bJhT_8nbUA0", label: "Calm reflection" },
    { id: "aIYFR0vbADk", label: "Strength" },
  ],
  cultural: [
    { id: "nN5L5GXKFz8", label: "Diverse hands" },
    { id: "Cecb0_8Hx-o", label: "Community" },
    { id: "papajwzDJHU", label: "Together" },
    { id: "Zyx1bK9mqmA", label: "Global connection" },
    { id: "1-aA2Fadydc", label: "Unity" },
  ],
  counseling: [
    { id: "TkEPQPWr2sY", label: "Conversation" },
    { id: "7OxV_qDiGRI", label: "Listening" },
    { id: "x-ghf9LjrVg", label: "Support" },
    { id: "JBwcenOuRCg", label: "Connection" },
    { id: "cFplR9ZGnAk", label: "Guidance" },
  ],
  neuroscience: [
    { id: "rmWtVQN5RzU", label: "Brain abstract" },
    { id: "iar-afB0QQw", label: "Neural patterns" },
    { id: "OgvqXGL7XO4", label: "Mind & science" },
    { id: "w7ZyuGYNpRQ", label: "Abstract thought" },
    { id: "f77Bh3inUpE", label: "Light patterns" },
  ],
  addiction: [
    { id: "k0E6E0a0R3A", label: "Recovery path" },
    { id: "Pv5WeEyxMWU", label: "Fresh start" },
    { id: "BuNWp1bL0nc", label: "New dawn" },
    { id: "9wg5jCEPBsw", label: "Breakthrough" },
    { id: "KMn4VEeEPR8", label: "Hope" },
  ],
};

function unsplashUrl(id, w = 800, h = 400) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

export default function ThumbnailManager() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [customUrl, setCustomUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("therapy-general");
  const [filter, setFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const all = [];
      let page = 1;
      while (true) {
        const r = await fetch(`${API_URL}/api/interactive-courses?page=${page}&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) throw new Error("Failed to fetch courses");
        const d = await r.json();
        const batch = d.data || [];
        all.push(...batch);
        if (page >= (d.pagination?.pages || 1) || batch.length === 0) break;
        page++;
      }
      setCourses(all.sort((a, b) => (a.title || "").localeCompare(b.title || "")));
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const saveThumbnail = async (courseId, url) => {
    setSaving(true);
    try {
      const r = await fetch(`${API_URL}/api/interactive-courses/${courseId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: url }),
      });
      if (!r.ok) throw new Error("Failed to save thumbnail");
      setCourses((prev) => prev.map((c) => (c._id === courseId ? { ...c, thumbnail: url } : c)));
      showToast("Thumbnail saved");
      setSelectedCourse(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const searchUnsplash = () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    const results = [];
    for (let i = 0; i < 8; i++) {
      const sig = `${searchTerm}-${i}-${Date.now()}`;
      results.push({
        id: `search-${i}`,
        label: `${searchTerm} ${i + 1}`,
        directUrl: `https://source.unsplash.com/800x400/?${encodeURIComponent(searchTerm)}&sig=${sig}`,
      });
    }
    setSearchResults(results);
    setSearching(false);
  };

  const filtered = courses.filter((c) => {
    if (filter === "missing") return !c.thumbnail;
    if (filter === "has") return !!c.thumbnail;
    return true;
  });

  const withThumb = courses.filter((c) => c.thumbnail).length;
  const withoutThumb = courses.length - withThumb;

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.burgundy}20`, borderTop: `3px solid ${COLORS.burgundy}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: COLORS.navy, fontSize: 14 }}>Loading courses...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.stone, fontFamily: "'Lato', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, padding: "12px 20px", borderRadius: 10, background: toast.type === "error" ? "#dc2626" : COLORS.green, color: "white", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "slideIn 0.3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.burgundy} 0%, ${COLORS.navy} 100%)`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16 }}>CR</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "white" }}>Thumbnail Manager</h1>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{courses.length} courses &middot; {withThumb} with thumbnails &middot; {withoutThumb} missing</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "missing", "has"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: filter === f ? "rgba(255,255,255,0.2)" : "transparent", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
              {f === "all" ? `All (${courses.length})` : f === "missing" ? `Missing (${withoutThumb})` : `Has (${withThumb})`}
            </button>
          ))}
          <button onClick={() => window.history.back()} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map((course) => (
            <div key={course._id} onClick={() => { setSelectedCourse(course); setCustomUrl(course.thumbnail || ""); setSearchResults([]); setSearchTerm(course.title?.split(":")[0]?.split("\u2014")[0]?.trim() || "therapy"); }}
              style={{ background: "white", borderRadius: 12, overflow: "hidden", border: `1px solid ${course.thumbnail ? "#e5e7eb" : COLORS.gold + "60"}`, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
              <div style={{ height: 160, background: course.thumbnail ? `url(${course.thumbnail}) center/cover` : `linear-gradient(135deg, ${COLORS.burgundy}15, ${COLORS.navy}15)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {!course.thumbnail && <div style={{ textAlign: "center" }}><div style={{ fontSize: 32, opacity: 0.3 }}>🖼</div><p style={{ fontSize: 11, color: COLORS.navy, opacity: 0.5, marginTop: 4 }}>No thumbnail</p></div>}
                {course.thumbnail && <div style={{ position: "absolute", top: 8, right: 8, background: COLORS.green, color: "white", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>HAS IMAGE</div>}
              </div>
              <div style={{ padding: "12px 16px" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.burgundy, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.title}</h3>
                <div style={{ marginTop: 6, display: "flex", gap: 8, fontSize: 11, color: "#888" }}><span>{course.ceHours || 0} CE</span><span>&middot;</span><span>{course.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && setSelectedCourse(null)}>
          <div style={{ background: "white", borderRadius: 16, width: 720, maxWidth: "95vw", maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "start", position: "sticky", top: 0, background: "white", zIndex: 10, borderRadius: "16px 16px 0 0" }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.burgundy }}>Set Thumbnail</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>{selectedCourse.title}</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: 24 }}>
              {(customUrl || selectedCourse.thumbnail) && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: COLORS.navy, letterSpacing: 0.5 }}>Current / Preview</label>
                  <div style={{ marginTop: 8, height: 180, borderRadius: 10, overflow: "hidden", border: "1px solid #eee" }}>
                    <img src={customUrl || selectedCourse.thumbnail} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: COLORS.navy, letterSpacing: 0.5 }}>Image URL</label>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="Paste an image URL or select below" style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none" }} />
                  <button onClick={() => saveThumbnail(selectedCourse._id, customUrl)} disabled={!customUrl || saving} style={{ padding: "10px 20px", background: !customUrl || saving ? "#ccc" : COLORS.green, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: !customUrl || saving ? "default" : "pointer", whiteSpace: "nowrap" }}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: COLORS.navy, letterSpacing: 0.5 }}>Search Stock Images</label>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="e.g. therapy, counseling, brain..." style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none" }} onKeyDown={(e) => e.key === "Enter" && searchUnsplash()} />
                  <button onClick={searchUnsplash} disabled={searching} style={{ padding: "10px 20px", background: searching ? "#ccc" : COLORS.burgundy, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: searching ? "wait" : "pointer" }}>
                    {searching ? "..." : "Search"}
                  </button>
                  <a href={`https://unsplash.com/s/photos/${encodeURIComponent(searchTerm || "therapy counseling")}`} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 14px", background: COLORS.navy, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                    Unsplash ↗
                  </a>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: COLORS.navy, letterSpacing: 0.5, marginBottom: 8, display: "block" }}>Search Results</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {searchResults.map((img, i) => {
                      const url = img.directUrl || unsplashUrl(img.id);
                      return (
                        <div key={i} onClick={() => setCustomUrl(url)} style={{ height: 100, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: customUrl === url ? `3px solid ${COLORS.green}` : "2px solid transparent", transition: "all 0.2s", position: "relative" }}>
                          <img src={url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.parentElement.style.display = "none"; }} />
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "16px 6px 4px", color: "white", fontSize: 10 }}>{img.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: COLORS.navy, letterSpacing: 0.5, marginBottom: 8, display: "block" }}>Curated Stock Photos</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                  {Object.keys(CURATED).map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: activeCategory === cat ? COLORS.burgundy : "#f0f0f0", color: activeCategory === cat ? "white" : "#666", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                      {cat.replace("-", " ")}
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {(CURATED[activeCategory] || []).map((img) => {
                    const url = unsplashUrl(img.id);
                    return (
                      <div key={img.id} onClick={() => setCustomUrl(url)} style={{ height: 110, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: customUrl === url ? `3px solid ${COLORS.green}` : "2px solid transparent", transition: "all 0.2s", position: "relative" }}>
                        <img src={url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = `https://placehold.co/400x200/${COLORS.burgundy.slice(1)}/${COLORS.gold.slice(1)}?text=${encodeURIComponent(img.label)}`; }} />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "20px 8px 6px", color: "white", fontSize: 11, fontWeight: 600 }}>{img.label}</div>
                        {customUrl === url && <div style={{ position: "absolute", top: 6, right: 6, background: COLORS.green, color: "white", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedCourse.thumbnail && (
                <button onClick={() => saveThumbnail(selectedCourse._id, "")} style={{ marginTop: 20, padding: "8px 16px", background: "none", border: "1px solid #dc2626", color: "#dc2626", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove Thumbnail</button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
