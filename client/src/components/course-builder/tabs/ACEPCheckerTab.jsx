// ─── ACEPCheckerTab ───────────────────────────────────────────────────────
// DROP INTO: /client/src/components/CourseBuilder/tabs/ACEPCheckerTab.jsx
// Runs validateCourse(state) on every render (pure function, fast).

import { validateCourse } from "../courseBuilderValidator.js";
import { countSectionWords, countKCsInSection } from "../utils.js";
import { ACEP_RULES } from "../constants.js";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";

const C = {
  burgundy: "#6B1D34", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#284157",
  bg: "#F8F7F4", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280",
  danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
  warn: "#B45309", warnFaded: "rgba(180,83,9,0.08)",
};

const S = {
  card: { background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 14, overflow: "hidden" },
  cardHeader: { padding: "13px 17px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardBody: { padding: 17 },
  badge: (color) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: color + "18", color }),
  btnFix: { background: C.navy + "14", color: C.navy, border: `1px solid ${C.navy}33`, borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
};

function StatusIcon({ pass }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
      background: pass ? C.green : C.danger,
      color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700,
    }}>
      {pass ? "✓" : "✕"}
    </span>
  );
}

function KCIndicator({ count }) {
  const MIN = ACEP_RULES.KC_PER_SECTION.MIN;
  const MAX = ACEP_RULES.KC_PER_SECTION.MAX;
  const ok = count >= MIN && count <= MAX;
  const color = ok ? C.green : (count < MIN ? C.danger : C.warn);
  return (
    <span style={{ ...S.badge(color), fontSize: 11 }}>
      {count} KC{count !== 1 ? "s" : ""} {ok ? "✓" : count < MIN ? "↑" : "↓"}
    </span>
  );
}

function SectionScorecard({ sections }) {
  if (sections.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: C.textMuted, fontSize: 14 }}>
        No sections found. Add content in the Content tab.
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
      {sections.map((sec, i) => {
        const wc = countSectionWords(sec);
        const kcCount = countKCsInSection(sec);
        const hasDivider = (sec.blocks || sec.contentBlocks || []).some(b => b.type === "sectionDivider");
        const pass = hasDivider && kcCount >= ACEP_RULES.KC_PER_SECTION.MIN;
        return (
          <div key={sec.id || i} style={{
            border: `1.5px solid ${pass ? C.green + "44" : C.danger + "44"}`,
            borderRadius: 10, padding: "12px 14px",
            background: pass ? C.greenFaded : C.dangerFaded,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
              <StatusIcon pass={pass} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, lineHeight: 1.3, flex: 1 }}>
                {sec.title || `Section ${i + 1}`}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span style={{ ...S.badge(C.navy), fontSize: 11 }}>
                {wc.toLocaleString()} words
              </span>
              <KCIndicator count={kcCount} />
              {!hasDivider && (
                <span style={{ ...S.badge(C.danger), fontSize: 11 }}>No divider</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IssueItem({ item, onFix }) {
  const isError = item.severity === "error";
  const bg = isError ? C.dangerFaded : C.warnFaded;
  const border = isError ? C.danger + "33" : C.warn + "33";
  const color = isError ? C.danger : C.warn;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "11px 14px", background: bg,
      border: `1px solid ${border}`, borderRadius: 9,
      marginBottom: 8,
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
        background: color, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700,
      }}>
        {isError ? "!" : "~"}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2, letterSpacing: "0.04em" }}>
          {item.code}
        </div>
        <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.5 }}>
          {item.message}
        </div>
      </div>
      {item.fix && (
        <button style={S.btnFix} onClick={() => onFix(item.fix)}>
          Fix →
        </button>
      )}
    </div>
  );
}

export default function ACEPCheckerTab() {
  const { state, setActiveTab } = useCourseBuilder();
  const { errors, warnings } = validateCourse(state);

  const sections = state.modules || state.sections || [];
  const totalWords = sections.reduce(
    (sum, s) => sum + countSectionWords(s), 0
  );
  const targetWords = (state.ceHours || 0) * ACEP_RULES.MIN_WORDS_PER_CE_HOUR;
  const wordPct = targetWords > 0 ? Math.min(100, Math.round((totalWords / targetWords) * 100)) : 0;
  const allClear = errors.length === 0;

  const handleFix = (fix) => {
    if (fix?.tab !== undefined) setActiveTab(fix.tab);
  };

  return (
    <div>
      {/* Summary banner */}
      <div style={{
        ...S.card,
        borderColor: allClear ? C.green + "66" : C.danger + "66",
        background: allClear ? C.greenFaded : C.dangerFaded,
        marginBottom: 20,
      }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: allClear ? C.green : C.danger,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>
            {allClear ? "✓" : "✕"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: allClear ? C.green : C.danger }}>
              {allClear ? "Ready to Publish" : "Not Ready to Publish"}
            </div>
            <div style={{ fontSize: 13, color: C.navy, marginTop: 2 }}>
              {errors.length > 0 && (
                <span style={{ color: C.danger, fontWeight: 600 }}>{errors.length} error{errors.length !== 1 ? "s" : ""}</span>
              )}
              {errors.length > 0 && warnings.length > 0 && " · "}
              {warnings.length > 0 && (
                <span style={{ color: C.warn, fontWeight: 600 }}>{warnings.length} warning{warnings.length !== 1 ? "s" : ""}</span>
              )}
              {allClear && warnings.length === 0 && "All ACEP checks pass. Course is publish-ready."}
              {allClear && warnings.length > 0 && `All errors resolved. ${warnings.length} advisory warning${warnings.length !== 1 ? "s" : ""}.`}
            </div>
          </div>

          {/* Word count progress */}
          <div style={{ minWidth: 180 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>Word Count</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: wordPct >= 90 ? C.green : C.danger }}>
                {totalWords.toLocaleString()} / {targetWords.toLocaleString()}
              </span>
            </div>
            <div style={{ background: C.border, borderRadius: 6, height: 8, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${wordPct}%`,
                background: wordPct >= 90 ? C.green : (wordPct >= 70 ? C.gold : C.danger),
                borderRadius: 6, transition: "width 0.3s",
              }} />
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
              {wordPct}% of {state.ceHours || 0} CE hr target
            </div>
          </div>
        </div>
      </div>

      {/* Section scorecard */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Section Scorecard</span>
          <span style={S.badge(C.navy)}>{sections.length} section{sections.length !== 1 ? "s" : ""}</span>
        </div>
        <div style={S.cardBody}>
          <SectionScorecard sections={sections} />
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div style={S.card}>
          <div style={{ ...S.cardHeader, background: C.dangerFaded }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.danger }}>
              ✕ {errors.length} Error{errors.length !== 1 ? "s" : ""} — Block Publish
            </span>
            <span style={S.badge(C.danger)}>Must resolve</span>
          </div>
          <div style={S.cardBody}>
            {errors.map((item, i) => (
              <IssueItem key={i} item={item} onFix={handleFix} />
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div style={S.card}>
          <div style={{ ...S.cardHeader, background: C.warnFaded }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.warn }}>
              ⚠ {warnings.length} Warning{warnings.length !== 1 ? "s" : ""} — Advisory
            </span>
            <span style={S.badge(C.warn)}>Won't block</span>
          </div>
          <div style={S.cardBody}>
            {warnings.map((item, i) => (
              <IssueItem key={i} item={item} onFix={handleFix} />
            ))}
          </div>
        </div>
      )}

      {/* All clear */}
      {errors.length === 0 && warnings.length === 0 && (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ padding: "32px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.green, marginBottom: 6 }}>
              All checks pass!
            </div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>
              This course meets all NBCC ACEP #7760 requirements and is ready to publish.
            </div>
          </div>
        </div>
      )}

      {/* ACEP requirement summary */}
      <div style={{ ...S.card, marginTop: 20 }}>
        <div style={S.cardHeader}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>ACEP Requirements Reference</span>
        </div>
        <div style={{ padding: "12px 16px" }}>
          {[
            { label: "Min. Words per CE Hour", value: `${ACEP_RULES.MIN_WORDS_PER_CE_HOUR.toLocaleString()}` },
            { label: "Final Exam Questions", value: `${ACEP_RULES.MIN_ASSESSMENT_QUESTIONS} minimum` },
            { label: "Pass Threshold", value: `${ACEP_RULES.PASS_THRESHOLD * 100}%` },
            { label: "Knowledge Checks per Section", value: `${ACEP_RULES.KC_PER_SECTION.MIN}–${ACEP_RULES.KC_PER_SECTION.MAX}` },
            { label: "Max Text Block Length", value: `${ACEP_RULES.MAX_TEXT_BLOCK_WORDS.toLocaleString()} words` },
            { label: "Max Answer Option Frequency", value: `${ACEP_RULES.MAX_ANSWER_DIST_PCT * 100}%` },
          ].map(r => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0", borderBottom: `1px solid ${C.borderLight}`, fontSize: 13,
            }}>
              <span style={{ color: C.textMuted }}>{r.label}</span>
              <span style={{ fontWeight: 600, color: C.navy }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
