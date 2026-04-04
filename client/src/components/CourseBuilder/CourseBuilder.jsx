// CourseBuilder.jsx — Main component (modular)
// Sub-components in same folder: AIGenerator, ContentEditor, ExamGenerator,
// ReferencesManager, ACEPChecker, NarrationTab, ImportTab

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Save, Download, Loader2, Check, BookOpen, Users, BarChart3, Mail, BadgeCheck, Home } from "lucide-react";
import { C, BLOCK_TYPES } from "./constants";
import { S } from "./styles";
import { uid, countBlockWords } from "./utils";
import AIGenerator from "./AIGenerator";
import ContentEditor from "./ContentEditor";
import ExamGenerator from "./ExamGenerator";
import ReferencesManager from "./ReferencesManager";
import ACEPChecker from "./ACEPChecker";
import NarrationTab from "./NarrationTab";
import ImportTab from "./ImportTab";

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

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";
  const getToken = () => localStorage.getItem("token");

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
  const saveCourse = async (publish = false) => {
    setSaving(true);
    setSaveMsg(null);
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
        acepProvider: courseData.acepProvider || { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
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
      setSaveMsg(`✓ ${publish ? "Published" : "Saved"} — ${result.action || "success"}`);
      setTimeout(() => setSaveMsg(null), 4000);
    } catch (err) {
      setSaveMsg(`✗ Error: ${err.message}`);
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
    doc.text("NBCC ACEP Provider #7760", LM, 70);
    doc.text("GA Integrated Therapeutic Perspectives LLC", LM, 78);
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

  const tabs = [
    { label: "AI Generator", icon: "✨" },
    { label: "Import", icon: "📥" },
    { label: "Content Editor", icon: "📝" },
    { label: "Exam Generator", icon: "🎯" },
    { label: "References", icon: "📚" },
    { label: "ACEP Checker", icon: "📋" },
    { label: "Narration", icon: "🎙️" },
  ];

  return (
    <div style={S.container}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700;6..72,800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

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
              <a href="/admin-courses.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><BookOpen size={11} /> Courses</a>
              <a href="/admin-users.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><Users size={11} /> Users</a>
              <a href="/admin-analytics.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><BarChart3 size={11} /> Analytics</a>
              <a href="/admin-messages.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><Mail size={11} /> Messages</a>
              <a href="/admin-credentials.html" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><BadgeCheck size={11} /> Credentials</a>
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, fontFamily: "'Lato', sans-serif" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Admin</span>
            <a href="/dashboard.html" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}><Home size={11} /> Exit to Dashboard</a>
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
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 2 }}>NBCC ACEP #7760 · AI-Powered · Cloudinary Images</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
          <div key={i} style={S.tab(activeTab === i)} onClick={() => setActiveTab(i)}>
            <span>{tab.icon}</span> {tab.label}
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
        {activeTab === 0 && <AIGenerator onGenerated={(data) => { setCourseData(data); setActiveTab(2); }} />}
        {activeTab === 1 && <ImportTab onImported={(data) => { setCourseData(data); setActiveTab(2); }} />}
        {activeTab === 2 && <ContentEditor courseData={courseData} setCourseData={setCourseData} />}
        {activeTab === 3 && <ExamGenerator courseData={courseData} setCourseData={setCourseData} />}
        {activeTab === 4 && <ReferencesManager courseData={courseData} setCourseData={setCourseData} />}
        {activeTab === 5 && <ACEPChecker courseData={courseData} />}
        {activeTab === 6 && <NarrationTab courseData={courseData} setCourseData={setCourseData} />}

      </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// EXAM GENERATOR
// ═══════════════════════════════════════════════════════════
