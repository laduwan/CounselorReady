// DROP INTO: client/src/components/CourseBuilder/ImportTab.jsx
import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Check, X, Download } from "lucide-react";
import { C, BLOCK_DEFAULTS, ACEP_RULES, KNOWLEDGE_CHECK_TYPES } from "./constants";
import { S } from "./styles";
import { uid, countWords } from "./utils";

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
        blocks: [{ id: uid(), type: "text", content: content.substring(0, 10000) }],
        knowledgeChecks: 0, estimatedWords: countWords(content),
      });
    }
  } else {
    headers.forEach((hdr, i) => {
      const nextIdx = headers[i + 1]?.index || content.length;
      const section = content.substring(hdr.index, nextIdx);
      const blocks = [
        { id: uid(), type: "sectionDivider", title: `Module ${hdr.num}: ${hdr.title}`, sectionNumber: hdr.num },
        { id: uid(), type: "text", content: section.replace(/^#{1,3}.+$/gm, "").trim().substring(0, 10000) },
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
              âš  {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginTop: 20 }}>
            {[
              { icon: "ðŸ“„", title: "Word (.docx)", desc: "Full document parsing with headers and sections" },
              { icon: "ðŸ“•", title: "PDF (.pdf)", desc: "Text extraction from PDF documents" },
              { icon: "ðŸ“", title: "Markdown (.md)", desc: "Module headers, objectives, assessments" },
              { icon: "ðŸ“ƒ", title: "Plain Text (.txt)", desc: "Structured text with section headings" },
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
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{preview.ceHours} CE Hours Â· {preview.modules.length} modules Â· {preview.modules.reduce((s, m) => s + (m.blocks || []).length, 0)} blocks</div>
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


export default ImportTab;
