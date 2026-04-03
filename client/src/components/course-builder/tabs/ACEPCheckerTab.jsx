// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/ACEPCheckerTab.jsx
// ACEP compliance scorecard, error/warning list, jump-to-fix buttons.
// ─────────────────────────────────────────────────────────────────────────────

import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C, ACEP_RULES } from "../constants.js";
import { countSectionWords, countKCsInSection } from "../utils.js";
import { validateCourse } from "../courseBuilderValidator.js";

const S = {
  section: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.navy,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: `1px solid ${C.borderLight}`,
  },
  summaryBar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 24px",
    borderRadius: 10,
    marginBottom: 20,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
  },
  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 14,
  },
  scoreCard: {
    padding: 16,
    borderRadius: 8,
    border: `1px solid ${C.border}`,
    background: C.stone,
  },
  scoreLabel: {
    fontSize: 11, fontWeight: 600, color: C.textMuted,
    textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6,
  },
  scoreValue: {
    fontSize: 18, fontWeight: 700,
  },
  issueCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 18px",
    borderRadius: 8,
    marginBottom: 10,
  },
  issueIcon: {
    width: 24, height: 24, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  fixBtn: {
    padding: "4px 12px", borderRadius: 6, border: "none",
    fontSize: 11, fontWeight: 700, cursor: "pointer",
    whiteSpace: "nowrap", flexShrink: 0,
  },
};

// ─── Section scorecard ────────────────────────────────────────────────────────

function SectionScorecard({ sections }) {
  if (!sections || sections.length === 0) {
    return (
      <div style={{ ...S.section, textAlign: "center", color: C.textMuted, fontSize: 14 }}>
        No sections yet. Add content in the Content Editor tab.
      </div>
    );
  }

  return (
    <div style={S.section}>
      <div style={S.sectionTitle}>Section Scorecard</div>
      <div style={S.scoreGrid}>
        {sections.map((sec, i) => {
          const words = countSectionWords(sec);
          const kcs = countKCsInSection(sec);
          const kcOk = kcs >= ACEP_RULES.MIN_KC_PER_SECTION && kcs <= ACEP_RULES.MAX_KC_PER_SECTION;
          return (
            <div key={sec._tempId || i} style={S.scoreCard}>
              <div style={S.scoreLabel}>Section {i + 1}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8, lineHeight: 1.3 }}>
                {sec.title || "Untitled"}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Words</div>
                  <div style={{ ...S.scoreValue, color: C.navy, fontSize: 15 }}>{words.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>KCs</div>
                  <div style={{ ...S.scoreValue, color: kcOk ? C.hunterGreen : C.danger, fontSize: 15 }}>
                    {kcs}
                    <span style={{ fontSize: 10, fontWeight: 500, color: C.textMuted }}> / {ACEP_RULES.MIN_KC_PER_SECTION}–{ACEP_RULES.MAX_KC_PER_SECTION}</span>
                  </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>{kcOk ? "✓" : "!"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Issue list ───────────────────────────────────────────────────────────────

function IssueList({ items, severity, onFix }) {
  if (items.length === 0) return null;
  const isError = severity === "error";
  const bg = isError ? `${C.danger}08` : `${C.honey}10`;
  const iconBg = isError ? C.danger : C.honey;
  const iconLabel = isError ? "!" : "?";

  return (
    <div style={S.section}>
      <div style={S.sectionTitle}>{isError ? "Errors" : "Warnings"} ({items.length})</div>
      {items.map((item, i) => (
        <div key={`${item.code}-${i}`} style={{ ...S.issueCard, background: bg }}>
          <div style={{ ...S.issueIcon, background: iconBg, color: "#fff" }}>{iconLabel}</div>
          <div style={{ flex: 1, fontSize: 13, color: C.navy, lineHeight: 1.5 }}>
            {item.message}
          </div>
          {item.fix && (
            <button
              style={{ ...S.fixBtn, background: isError ? C.danger : C.honey, color: "#fff" }}
              onClick={() => onFix(item.fix)}
            >
              Fix
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export default function ACEPCheckerTab() {
  const { state, setActiveTab } = useCourseBuilder();
  const { errors, warnings } = validateCourse(state);

  const allClear = errors.length === 0 && warnings.length === 0;
  const summaryBg = errors.length > 0 ? `${C.danger}10` : warnings.length > 0 ? `${C.honey}10` : `${C.hunterGreen}10`;
  const summaryColor = errors.length > 0 ? C.danger : warnings.length > 0 ? C.honey : C.hunterGreen;

  function handleFix(fix) {
    setActiveTab(fix.tab);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* ── Summary banner ── */}
      <div style={{ ...S.summaryBar, background: summaryBg, border: `1px solid ${summaryColor}20` }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: summaryColor }}>
          {allClear ? "Ready to Publish" : "Not Ready"}
        </span>
        <div style={{ flex: 1 }} />
        {errors.length > 0 && (
          <span style={{ ...S.badge, background: C.danger, color: "#fff" }}>
            {errors.length} error{errors.length !== 1 ? "s" : ""}
          </span>
        )}
        {warnings.length > 0 && (
          <span style={{ ...S.badge, background: C.honey, color: "#fff" }}>
            {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
          </span>
        )}
        {allClear && (
          <span style={{ ...S.badge, background: C.hunterGreen, color: "#fff" }}>
            All checks passed
          </span>
        )}
      </div>

      {/* ── Publish gate ── */}
      {errors.length > 0 && (
        <div style={{ fontSize: 13, color: C.danger, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
          Resolve all errors before publishing.
        </div>
      )}

      {/* ── Section scorecard ── */}
      <SectionScorecard sections={state.sections} />

      {/* ── Errors ── */}
      <IssueList items={errors} severity="error" onFix={handleFix} />

      {/* ── Warnings ── */}
      <IssueList items={warnings} severity="warning" onFix={handleFix} />

      {/* ── All clear message ── */}
      {allClear && (
        <div style={{ ...S.section, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.hunterGreen }}>
            This course meets all ACEP compliance requirements.
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>
            You can publish using the button in the top bar.
          </div>
        </div>
      )}
    </div>
  );
}
