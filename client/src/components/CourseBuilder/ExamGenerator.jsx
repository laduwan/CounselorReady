// DROP INTO: client/src/components/CourseBuilder/ExamGenerator.jsx
import { useState, useRef } from "react";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import { C, ACEP_RULES } from "./constants";
import { S } from "./styles";
import { uid, countWords } from "./utils";

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

export default ExamGenerator;
