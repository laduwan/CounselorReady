// DROP INTO: client/src/components/CourseBuilder/ACEPChecker.jsx
import { CheckCircle, AlertTriangle } from "lucide-react";
import { C, ACEP_RULES, KNOWLEDGE_CHECK_TYPES } from "./constants";
import { S } from "./styles";
import { countBlockWords } from "./utils";

function ACEPChecker({ courseData }) {
  if (!courseData?.modules?.length) {
    return (
      <div style={S.card}>
        <div style={{ ...S.cardBody, textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 40 }}>ðŸ“‹</div>
          <h3 style={{ color: C.navy, marginTop: 16 }}>No Course Data to Check</h3>
          <p style={{ color: C.textMuted, fontSize: 14 }}>Generate or import a course first.</p>
        </div>
      </div>
    );
  }

  const ceHours = courseData.ceHours || 3;
  const requiredWords = ceHours * ACEP_RULES.wordsPerCEHour;

  let totalWords = 0;
  const moduleStats = courseData.modules.map(mod => {
    let modWords = 0;
    let knowledgeChecks = 0;
    let engagementBlocks = 0;

    (mod.blocks || []).forEach(b => {
      modWords += countBlockWords(b);
      if (KNOWLEDGE_CHECK_TYPES.includes(b.type)) knowledgeChecks++;
      if (ENGAGEMENT_TYPES.includes(b.type)) engagementBlocks++;
    });
    totalWords += modWords;
    return { title: mod.title, words: modWords, knowledgeChecks, engagementBlocks, blockCount: (mod.blocks || []).length };
  });

  const totalKC = moduleStats.reduce((s, m) => s + m.knowledgeChecks, 0);
  const hasObjectives = (courseData.objectives || []).length > 0;
  const hasTargetAudience = (courseData.targetAudience || []).length > 0;

  const checks = [
    { label: `Word Count (${requiredWords.toLocaleString()}+ req)`, value: `${totalWords.toLocaleString()}`, pass: totalWords >= requiredWords, detail: `${(totalWords / ceHours).toLocaleString()} words/CE hour` },
    { label: "Knowledge Checks per Module (2-5)", value: `${totalKC} total`, pass: moduleStats.every(m => m.knowledgeChecks >= 2), detail: moduleStats.map(m => `${m.title?.split(":")[0]}: ${m.knowledgeChecks}`).join(", ") },
    { label: "Learning Objectives", value: hasObjectives ? `${courseData.objectives.length}` : "Missing", pass: hasObjectives },
    { label: "Target Audience", value: hasTargetAudience ? "Yes" : "Missing", pass: hasTargetAudience },
    { label: "Pass Threshold â‰¥ 80%", value: `${((courseData.assessment?.passThreshold || 0.8) * 100).toFixed(0)}%`, pass: (courseData.assessment?.passThreshold || 0.8) >= 0.8 },
    { label: "Final Exam (15+ questions)", value: `${(courseData.assessment?.questions || []).length}`, pass: (courseData.assessment?.questions || []).length >= 15 },
  ];

  const passCount = checks.filter(c => c.pass).length;
  const score = Math.round((passCount / checks.length) * 100);

  return (
    <div>
      <div style={S.card}>
        <div style={{ ...S.cardBody, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke={C.borderLight} strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={score === 100 ? C.green : score >= 60 ? C.gold : C.danger} strokeWidth="8" strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: C.navy }}>{score}%</div>
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>
              {score === 100 ? "ACEP Compliant âœ“" : score >= 60 ? "Needs Attention" : "Not Compliant"}
            </h3>
            <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>{passCount}/{checks.length} requirements Â· {ceHours} CE Â· {courseData.modules.length} modules Â· 17 block types available</p>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Requirements</span>
          <span style={S.badge(C.burgundy)}>NBCC ACEP #7760</span>
        </div>
        {checks.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < checks.length - 1 ? `1px solid ${C.borderLight}` : "none", background: c.pass ? C.greenFaded : C.dangerFaded }}>
            <span style={{ fontSize: 16 }}>{c.pass ? "âœ“" : "âš "}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{c.label}</div>
              {c.detail && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{c.detail}</div>}
            </div>
            <span style={S.badge(c.pass ? C.green : C.danger)}>{c.value}</span>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}><span style={{ fontWeight: 700, fontSize: 15 }}>Module Breakdown</span></div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.greenFaded }}>
                {["Module", "Words", "Knowledge Checks", "Engagement", "Blocks"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: C.navy, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {moduleStats.map((stat, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{stat.title?.replace(/^Module \d+:\s*/, "") || `Module ${i + 1}`}</td>
                  <td style={{ padding: "10px 14px", color: stat.words < 500 ? C.danger : C.green, fontWeight: 600 }}>{stat.words.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: stat.knowledgeChecks >= 2 ? C.green : C.danger, fontWeight: 600 }}>{stat.knowledgeChecks}</span>
                    <span style={{ color: C.textLight }}> / 2-5</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>{stat.engagementBlocks}</td>
                  <td style={{ padding: "10px 14px" }}>{stat.blockCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default ACEPChecker;
