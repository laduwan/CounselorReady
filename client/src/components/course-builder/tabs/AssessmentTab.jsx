// ─── AssessmentTab ────────────────────────────────────────────────────────
// DROP INTO: /client/src/components/CourseBuilder/tabs/AssessmentTab.jsx
// Uses useCourseBuilder() hook — no props.

import { useState } from "react";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { ACEP_RULES } from "../constants.js";

const C = {
  burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#284157", navyLight: "#4A6278",
  bg: "#F8F7F4", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
  danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
  warn: "#B45309", warnFaded: "rgba(180,83,9,0.08)",
};

const S = {
  card: { background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 16 },
  cardHeader: { padding: "14px 18px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardBody: { padding: 18 },
  label: { fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "9px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "9px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", background: "#fff" },
  btn: (bg, color) => ({ background: bg, color, border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }),
  btnIcon: { background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 13, cursor: "pointer", color: C.textMuted },
  badge: (color) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: color + "18", color }),
};

const OPTION_LABELS = ["A", "B", "C", "D"];

function QuestionCard({ q, index, total, onUpdate, onRemove, onMove }) {
  const [explOpen, setExplOpen] = useState(false);

  const updateOption = (i, val) => {
    const opts = [...q.options];
    opts[i] = val;
    onUpdate({ options: opts });
  };

  const isValid = q.correctAnswer >= 0 && q.correctAnswer < q.options.length &&
    q.options[q.correctAnswer]?.trim();

  return (
    <div style={{
      ...S.card,
      borderColor: !isValid ? C.danger + "66" : C.border,
      marginBottom: 12,
    }}>
      {/* Question header */}
      <div style={{
        ...S.cardHeader,
        background: !isValid ? C.dangerFaded : C.bg,
        gap: 10,
      }}>
        <span style={{ ...S.badge(isValid ? C.green : C.danger), minWidth: 28 }}>
          {index + 1}
        </span>
        <span style={{ flex: 1, fontSize: 13, color: isValid ? C.textMuted : C.danger, fontWeight: 500 }}>
          {isValid ? "✓ Answer set" : "⚠ No correct answer"}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={S.btnIcon} onClick={() => onMove(-1)} disabled={index === 0} title="Move up">↑</button>
          <button style={S.btnIcon} onClick={() => onMove(1)} disabled={index === total - 1} title="Move down">↓</button>
          <button
            onClick={onRemove}
            style={{ ...S.btnIcon, color: C.danger, borderColor: C.danger + "44" }}
            title="Delete question"
          >✕</button>
        </div>
      </div>

      <div style={S.cardBody}>
        {/* Question text */}
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Question {index + 1}</label>
          <textarea
            style={{ ...S.textarea, minHeight: 64 }}
            placeholder="Enter question text..."
            value={q.question}
            onChange={e => onUpdate({ question: e.target.value })}
          />
        </div>

        {/* Options */}
        <label style={S.label}>Options — click radio to mark correct answer</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {q.options.map((opt, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 8,
              background: q.correctAnswer === i ? C.greenFaded : "#fff",
              border: `1.5px solid ${q.correctAnswer === i ? C.green : C.border}`,
              transition: "all 0.15s",
            }}>
              <input
                type="radio"
                name={`q_correct_${q.id}`}
                checked={q.correctAnswer === i}
                onChange={() => onUpdate({ correctAnswer: i })}
                style={{ accentColor: C.green, width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                background: q.correctAnswer === i ? C.green : C.border,
                color: q.correctAnswer === i ? "#fff" : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {OPTION_LABELS[i]}
              </span>
              <input
                style={{ ...S.input, border: "none", padding: "4px 0", background: "transparent", flex: 1 }}
                placeholder={`Option ${OPTION_LABELS[i]}...`}
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Explanation (collapsible) */}
        <div>
          <button
            onClick={() => setExplOpen(x => !x)}
            style={{ ...S.btn("transparent", C.textMuted), border: `1px solid ${C.border}`, fontSize: 12, marginBottom: explOpen ? 8 : 0 }}
          >
            {explOpen ? "▾" : "▸"} Explanation {q.explanation ? "(filled)" : "(optional)"}
          </button>
          {explOpen && (
            <textarea
              style={{ ...S.textarea, minHeight: 60 }}
              placeholder="Why is this the correct answer? Shown to learner after submission."
              value={q.explanation || ""}
              onChange={e => onUpdate({ explanation: e.target.value })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AnswerDistChart({ questions }) {
  if (questions.length === 0) return null;
  const dist = [0, 0, 0, 0];
  questions.forEach(q => {
    const ca = Number(q.correctAnswer);
    if (ca >= 0 && ca < 4) dist[ca]++;
  });
  const max = Math.max(...dist, 1);
  const MAX_PCT = ACEP_RULES.MAX_ANSWER_DIST_PCT;

  return (
    <div style={{ ...S.card }}>
      <div style={S.cardHeader}>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Answer Distribution</span>
        <span style={S.badge(C.gold)}>Max {MAX_PCT * 100}% per option</span>
      </div>
      <div style={{ padding: "16px 18px" }}>
        {dist.map((count, i) => {
          const pct = questions.length > 0 ? count / questions.length : 0;
          const skewed = pct > MAX_PCT;
          const barW = `${Math.round((count / max) * 100)}%`;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: skewed ? C.danger : C.green,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
              }}>
                {OPTION_LABELS[i]}
              </span>
              <div style={{ flex: 1, background: C.borderLight, borderRadius: 6, height: 20, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: barW, borderRadius: 6,
                  background: skewed ? C.danger : C.green,
                  transition: "width 0.3s",
                }} />
              </div>
              <span style={{
                fontSize: 13, fontWeight: 700, minWidth: 68, textAlign: "right",
                color: skewed ? C.danger : C.navy,
              }}>
                {count} ({Math.round(pct * 100)}%)
                {skewed && " ⚠"}
              </span>
            </div>
          );
        })}
        {dist.some((c, i) => questions.length > 0 && c / questions.length > MAX_PCT) && (
          <div style={{ marginTop: 8, padding: "8px 12px", background: C.dangerFaded, borderRadius: 8, fontSize: 13, color: C.danger }}>
            ⚠ One or more answer options exceeds {MAX_PCT * 100}% frequency. Redistribute correct answers for ACEP compliance.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentTab() {
  const { state, dispatch } = useCourseBuilder();
  const { questions, passingScore, passThreshold, maxAttempts } = state.assessment;
  const MIN_Q = ACEP_RULES.MIN_ASSESSMENT_QUESTIONS;

  const addQ = () =>
    dispatch({ type: "ADD_ASSESSMENT_Q" });

  const updateQ = (id, changes) =>
    dispatch({ type: "UPDATE_ASSESSMENT_Q", id, changes });

  const removeQ = (id) =>
    dispatch({ type: "REMOVE_ASSESSMENT_Q", id });

  const setMeta = (changes) =>
    dispatch({ type: "SET_ASSESSMENT_META", changes });

  const moveQ = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= questions.length) return;
    dispatch({ type: "MOVE_ASSESSMENT_Q", from: idx, to: newIdx });
  };

  const filled = questions.length;
  const countBadge = filled >= MIN_Q ? C.green : C.danger;

  return (
    <div>
      {/* Top bar */}
      <div style={{
        ...S.card, marginBottom: 20,
        borderColor: filled >= MIN_Q ? C.green + "44" : C.danger + "44",
      }}>
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {/* Count badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>Questions</span>
            <span style={{
              padding: "4px 14px", borderRadius: 20, fontSize: 14, fontWeight: 700,
              background: countBadge + "18", color: countBadge,
            }}>
              {filled} / {MIN_Q} min
            </span>
          </div>

          <div style={{ width: 1, height: 32, background: C.border }} />

          {/* Pass threshold slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, whiteSpace: "nowrap" }}>
              Pass Threshold
            </span>
            <input
              type="range" min={50} max={100} step={5}
              value={Math.round((passThreshold || 0.80) * 100)}
              onChange={e => setMeta({ passThreshold: Number(e.target.value) / 100, passingScore: Number(e.target.value) })}
              style={{ width: 120, accentColor: C.burgundy }}
            />
            <span style={{ fontWeight: 700, color: C.burgundy, minWidth: 36 }}>
              {Math.round((passThreshold || 0.80) * 100)}%
            </span>
          </div>

          <div style={{ width: 1, height: 32, background: C.border }} />

          {/* Max attempts */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, whiteSpace: "nowrap" }}>
              Max Attempts
            </span>
            <select
              value={maxAttempts || 3}
              onChange={e => setMeta({ maxAttempts: Number(e.target.value) })}
              style={{ ...S.input, width: "auto", padding: "6px 10px" }}
            >
              {[1, 2, 3, 5, 10].map(n => (
                <option key={n} value={n}>{n === 10 ? "Unlimited" : n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Answer distribution chart */}
      <AnswerDistChart questions={questions} />

      {/* Question list */}
      {questions.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ padding: "40px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.navy, marginBottom: 6 }}>
              No questions yet
            </div>
            <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 18 }}>
              Add at least {MIN_Q} questions for ACEP compliance.
            </div>
          </div>
        </div>
      ) : (
        questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={i}
            total={questions.length}
            onUpdate={changes => updateQ(q.id, changes)}
            onRemove={() => removeQ(q.id)}
            onMove={dir => moveQ(i, dir)}
          />
        ))
      )}

      {/* Add question */}
      <button
        style={{ ...S.btn(C.green, "#fff"), width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}
        onClick={addQ}
      >
        + Add Question
        {filled < MIN_Q && (
          <span style={{ opacity: 0.75, fontSize: 12 }}>
            ({MIN_Q - filled} more needed)
          </span>
        )}
      </button>
    </div>
  );
}
