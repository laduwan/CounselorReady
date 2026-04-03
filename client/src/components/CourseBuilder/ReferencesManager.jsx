// DROP INTO: client/src/components/CourseBuilder/ReferencesManager.jsx
import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Check, Loader2 } from "lucide-react";
import { C } from "./constants";
import { S } from "./styles";
import { uid } from "./utils";

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

export default ReferencesManager;
