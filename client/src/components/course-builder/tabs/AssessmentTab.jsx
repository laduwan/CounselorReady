// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/AssessmentTab.jsx
// Exam CRUD, answer distribution chart, pass threshold controls.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C, ACEP_RULES } from "../constants.js";
import { A } from "../courseBuilderReducer.js";

const LABELS = ["A", "B", "C", "D"];

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
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 },
  label: {
    display: "block", fontSize: 12, fontWeight: 600, color: C.navy,
    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em",
  },
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", boxSizing: "border-box",
  },
  textarea: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", resize: "vertical",
    boxSizing: "border-box", minHeight: 60,
  },
  select: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", cursor: "pointer", boxSizing: "border-box",
  },
  qCard: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 20,
    marginBottom: 14,
  },
  qHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 14,
  },
  qNumber: {
    fontSize: 13, fontWeight: 700, color: C.burgundy,
    background: `${C.burgundy}12`, padding: "3px 10px", borderRadius: 6,
  },
  optionRow: {
    display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
  },
  radioLabel: {
    width: 24, height: 24, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 11,
    fontWeight: 700, cursor: "pointer", flexShrink: 0,
  },
  btnSmall: {
    padding: "5px 12px", borderRadius: 6, border: "none",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  addBtn: {
    padding: "10px 20px", borderRadius: 8, border: `2px dashed ${C.border}`,
    background: "transparent", color: C.navy, fontWeight: 600,
    fontSize: 14, cursor: "pointer", width: "100%",
  },
  bar: {
    height: 22, borderRadius: 4, transition: "width 0.3s",
    display: "flex", alignItems: "center", paddingLeft: 8,
    fontSize: 11, fontWeight: 600, color: "#fff", minWidth: 30,
  },
};

// ─── Answer distribution chart ────────────────────────────────────────────────

function AnswerDistChart({ questions }) {
  const dist = [0, 0, 0, 0];
  questions.forEach((q) => {
    const idx = q.correctAnswer ?? -1;
    if (idx >= 0 && idx < 4) dist[idx]++;
  });
  const total = questions.length || 1;
  const maxPct = ACEP_RULES.MAX_ANSWER_OPTION_FREQUENCY * 100;
  const colors = [C.burgundy, C.navy, C.hunterGreen, C.honey];

  return (
    <div style={S.section}>
      <div style={S.sectionTitle}>Answer Distribution</div>
      {LABELS.map((label, i) => {
        const pct = Math.round((dist[i] / total) * 100);
        const over = pct > maxPct;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 18, fontWeight: 700, fontSize: 13, color: C.navy }}>{label}</span>
            <div style={{ flex: 1, background: C.borderLight, borderRadius: 4, height: 22, position: "relative" }}>
              <div style={{
                ...S.bar,
                width: `${Math.max(pct, 4)}%`,
                background: over ? C.danger : colors[i],
              }}>
                {dist[i]}
              </div>
            </div>
            <span style={{ width: 42, fontSize: 12, fontWeight: 600, color: over ? C.danger : C.textMuted, textAlign: "right" }}>
              {pct}%
            </span>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>
        ACEP recommends no single answer exceeds {maxPct}% of total questions.
      </div>
    </div>
  );
}

// ─── Single question card ─────────────────────────────────────────────────────

function QuestionCard({ q, index, total, onUpdate, onRemove, onMove }) {
  const [showExplanation, setShowExplanation] = useState(!!q.explanation);

  return (
    <div style={S.qCard}>
      <div style={S.qHeader}>
        <span style={S.qNumber}>Q{index + 1}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={{ ...S.btnSmall, background: C.stone, color: C.navy }}
            onClick={() => onMove(index, index - 1)} disabled={index === 0}
            title="Move up">↑</button>
          <button style={{ ...S.btnSmall, background: C.stone, color: C.navy }}
            onClick={() => onMove(index, index + 1)} disabled={index === total - 1}
            title="Move down">↓</button>
          <button style={{ ...S.btnSmall, background: `${C.danger}15`, color: C.danger }}
            onClick={() => onRemove(index)} title="Delete question">Delete</button>
        </div>
      </div>

      {/* Question text */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Question</label>
        <textarea style={S.textarea}
          value={q.question || ""}
          onChange={(e) => onUpdate(index, { question: e.target.value })}
          placeholder="Enter your question..."
          rows={2}
        />
      </div>

      {/* Options with radio for correct answer */}
      <label style={{ ...S.label, marginBottom: 10 }}>Options (select the correct answer)</label>
      {(q.options || ["", "", "", ""]).map((opt, oi) => {
        const isCorrect = q.correctAnswer === oi;
        return (
          <div key={oi} style={S.optionRow}>
            <div
              onClick={() => onUpdate(index, { correctAnswer: oi })}
              style={{
                ...S.radioLabel,
                background: isCorrect ? C.hunterGreen : C.stone,
                color: isCorrect ? "#fff" : C.textMuted,
                border: `2px solid ${isCorrect ? C.hunterGreen : C.border}`,
              }}
              title={isCorrect ? "Correct answer" : "Mark as correct"}
            >
              {LABELS[oi]}
            </div>
            <input
              style={{ ...S.input, flex: 1 }}
              value={opt}
              onChange={(e) => {
                const newOpts = [...(q.options || ["", "", "", ""])];
                newOpts[oi] = e.target.value;
                onUpdate(index, { options: newOpts });
              }}
              placeholder={`Option ${LABELS[oi]}`}
            />
          </div>
        );
      })}

      {/* Explanation toggle */}
      <div style={{ marginTop: 12 }}>
        {!showExplanation ? (
          <button
            style={{ ...S.btnSmall, background: C.stone, color: C.navy }}
            onClick={() => setShowExplanation(true)}
          >
            + Add Explanation
          </button>
        ) : (
          <div>
            <label style={S.label}>Explanation (shown after answering)</label>
            <textarea style={S.textarea}
              value={q.explanation || ""}
              onChange={(e) => onUpdate(index, { explanation: e.target.value })}
              placeholder="Explain the correct answer..."
              rows={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export default function AssessmentTab() {
  const {
    state, dispatch,
    addAssessmentQ,
    updateAssessmentQ,
    removeAssessmentQ,
    setAssessmentMeta,
  } = useCourseBuilder();

  const questions = state.assessment?.questions || [];
  const passingScore = state.assessment?.passingScore ?? 80;
  const maxAttempts = state.assessment?.maxAttempts ?? 3;
  const minQ = ACEP_RULES.MIN_ASSESSMENT_QUESTIONS;
  const maxQ = ACEP_RULES.MAX_ASSESSMENT_QUESTIONS;

  function handleMove(from, to) {
    if (to < 0 || to >= questions.length) return;
    dispatch({ type: A.MOVE_ASSESSMENT_Q, from, to });
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* ── Settings bar ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Assessment Settings</div>
        <div style={S.row3}>
          <div>
            <label style={S.label}>Questions</label>
            <div style={{ fontSize: 22, fontWeight: 700, color: questions.length >= minQ ? C.hunterGreen : C.danger }}>
              {questions.length}
              <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}> / {minQ}–{maxQ}</span>
            </div>
          </div>
          <div>
            <label style={S.label}>Passing Score</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="range"
                min={50} max={100} step={5}
                value={passingScore}
                onChange={(e) => setAssessmentMeta({ passingScore: Number(e.target.value), passThreshold: Number(e.target.value) / 100 })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.navy, width: 42, textAlign: "right" }}>{passingScore}%</span>
            </div>
          </div>
          <div>
            <label style={S.label}>Max Attempts</label>
            <select style={S.select}
              value={maxAttempts}
              onChange={(e) => setAssessmentMeta({ maxAttempts: Number(e.target.value) })}
            >
              <option value={1}>1 attempt</option>
              <option value={2}>2 attempts</option>
              <option value={3}>3 attempts</option>
              <option value={5}>5 attempts</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Answer distribution chart ── */}
      {questions.length > 0 && <AnswerDistChart questions={questions} />}

      {/* ── Question list ── */}
      {questions.map((q, i) => (
        <QuestionCard
          key={q._tempId || i}
          q={q}
          index={i}
          total={questions.length}
          onUpdate={updateAssessmentQ}
          onRemove={removeAssessmentQ}
          onMove={handleMove}
        />
      ))}

      {/* ── Add question ── */}
      <button style={S.addBtn} onClick={() => addAssessmentQ()}>
        + Add Question
      </button>
    </div>
  );
}
