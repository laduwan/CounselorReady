// DROP INTO: client/src/components/CourseBuilder/AIGenerator.jsx
import { useState, useCallback, useRef } from "react";
import {
  Sparkles, FileText, Loader2, BookOpen, Brain,
  ClipboardCheck, Wand2, FileUp, BarChart3, Zap, Eye, ArrowUp
} from "lucide-react";
import { C, BLOCK_TYPES, BLOCK_DEFAULTS, ACEP_RULES, KNOWLEDGE_CHECK_TYPES } from "./constants";
import { S } from "./styles";
import { uid, countWords } from "./utils";

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
    blocks.push({ id: uid(), type: "text", content: `<h2>${mod.title}</h2><p>${src.substring(0, 3000)}</p>` });
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
      setCeHours(Math.min(6, estimatedCE));

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
        const lines = objMatch[0].match(/^\s*(?:\d+[\.\)]\s+|[-â€¢]\s+).+$/gm) || [];
        lines.slice(0, 6).forEach(l => objectives.push(l.replace(/^\s*(?:\d+[\.\)]\s+|[-â€¢]\s+)/, "").replace(/\*\*/g, "").trim()));
      }

      setOutline({
        title: topic.trim() || `${fileTitle}: Evidence-Based Approaches for Mental Health Professionals`,
        description: `This comprehensive ${estimatedCE}-hour continuing education course is based on uploaded content covering ${fileTitle.toLowerCase()}. Content will be expanded to meet ACEP standards with knowledge checks, interactive elements, and assessment items.`,
        ceHours: Math.min(6, estimatedCE),
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

  const generateContent = () => {
    setGeneratingContent(true);
    setProgress(0);
    const timer = setInterval(() => setProgress(p => {
      if (p >= 95) { clearInterval(timer); return p; }
      return p + Math.random() * 8;
    }), 400);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      const courseData = {
        ...outline,
        _uploadedContent: undefined,
        modules: outline.modules.map((mod, mi) => ({
          ...mod,
          sourceContent: undefined,
          blocks: mod.sourceContent
            ? generateBlocksFromSource(mod, mi, outline)
            : generateModuleBlocks(mod, mi, outline),
        })),
      };
      setGeneratingContent(false);
      setStep("content");
      if (onGenerated) onGenerated(courseData);
    }, 4000);
  };

  return (
    <div>
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
                        <div style={{ fontSize: 11, color: C.textMuted }}>.docx, .pdf, .md, .txt â€” We'll detect modules and build the course structure</div>
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
                    {[1, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} CE Hour{h > 1 ? "s" : ""}</option>)}
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
              <div style={{ background: `linear-gradient(90deg, ${C.burgundy}, ${C.gold})`, height: "100%", width: `${progress}%`, transition: "width 0.3s", borderRadius: 20 }} />
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
                {uploadedFileName && <span style={S.badge(C.burgundy)}>ðŸ“„ From: {uploadedFileName}</span>}
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
                    <span style={{ fontSize: 12, color: C.textMuted }}>~{mod.estimatedWords.toLocaleString()} words Â· {mod.knowledgeChecks} checks</span>
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
                <h3 style={{ marginTop: 12, color: C.navy, fontSize: 16 }}>Generating Course Content...</h3>
                <p style={{ color: C.textMuted, fontSize: 13 }}>Writing content blocks, knowledge checks, and assessment items</p>
                <div style={{ maxWidth: 400, margin: "16px auto", background: C.borderLight, borderRadius: 20, height: 6, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, height: "100%", width: `${progress}%`, transition: "width 0.3s", borderRadius: 20 }} />
                </div>
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
              Your course has been loaded into the Content Editor. Switch tabs to review, edit blocks, and run the ACEP compliance checker.
            </p>
            <button style={S.btnPrimary} onClick={() => setStep("input")}>
              <Sparkles size={16} /> Generate Another Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default AIGenerator;
