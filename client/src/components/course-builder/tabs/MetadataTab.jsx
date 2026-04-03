// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — tabs/MetadataTab.jsx
// Course Info tab: metadata, objectives, target audience, pricing.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useCourseBuilder } from "../CourseBuilderContext.jsx";
import { C } from "../constants.js";
import { slugify } from "../utils.js";

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
  row: { display: "grid", gap: 16, marginBottom: 16 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" },
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", boxSizing: "border-box",
  },
  textarea: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", resize: "vertical", boxSizing: "border-box",
  },
  select: {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none", cursor: "pointer", boxSizing: "border-box",
  },
  tag: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: C.burgundyFaded, color: C.burgundy,
    borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 500,
  },
  tagRemove: {
    background: "none", border: "none", cursor: "pointer",
    color: C.burgundy, fontSize: 14, lineHeight: 1, padding: 0,
  },
  addRow: { display: "flex", gap: 8, marginTop: 8 },
  addInput: {
    flex: 1, padding: "8px 12px", borderRadius: 7,
    border: `1px solid ${C.border}`, fontSize: 14, color: C.navy,
    background: C.stone, outline: "none",
  },
  addBtn: {
    padding: "8px 16px", borderRadius: 7, border: "none",
    background: C.hunterGreen, color: "#fff", fontSize: 13,
    fontWeight: 600, cursor: "pointer",
  },
  hint: { fontSize: 11, color: C.textMuted, marginTop: 4 },
};

function TagList({ items, onRemove }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 30 }}>
      {items.map((item, i) => (
        <span key={i} style={S.tag}>
          {item}
          <button style={S.tagRemove} onClick={() => onRemove(i)} aria-label={`Remove ${item}`}>×</button>
        </span>
      ))}
      {items.length === 0 && <span style={{ fontSize: 13, color: C.textMuted }}>None added yet.</span>}
    </div>
  );
}

function AddItemRow({ placeholder, onAdd }) {
  const [value, setValue] = useState("");
  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }
  return (
    <div style={S.addRow}>
      <input
        style={S.addInput}
        value={value}
        placeholder={placeholder}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submit(); }}}
      />
      <button style={S.addBtn} onClick={submit}>+ Add</button>
    </div>
  );
}

export default function MetadataTab() {
  const {
    state,
    setMeta,
    addObjective, removeObjective,
    addAudience,  removeAudience,
  } = useCourseBuilder();

  function field(name) {
    return {
      value: state[name] ?? "",
      onChange: e => setMeta(name, e.target.value),
    };
  }

  function numField(name) {
    return {
      value: state[name] ?? "",
      onChange: e => setMeta(name, Number(e.target.value)),
    };
  }

  const targetWordCount = (state.ceHours || 0) * 6000;

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>

      {/* ── Basic Info ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Course Information</div>

        <div style={S.row}>
          <div>
            <label style={S.label}>Course Title *</label>
            <input style={S.input} {...field("title")} placeholder="e.g. Cultural Competence in Clinical Practice" />
          </div>
        </div>

        <div style={S.row2}>
          <div>
            <label style={S.label}>Course Code</label>
            <input style={S.input} {...field("courseCode")} placeholder="e.g. CR-301" />
          </div>
          <div>
            <label style={S.label}>URL Slug</label>
            <input
              style={S.input}
              value={state.slug || slugify(state.title)}
              onChange={e => setMeta("slug", e.target.value)}
              placeholder="auto-generated"
            />
            <p style={S.hint}>counselorready.com/learn/{state.slug || slugify(state.title)}</p>
          </div>
        </div>

        <div style={S.row}>
          <div>
            <label style={S.label}>Description *</label>
            <textarea
              style={{ ...S.textarea, minHeight: 100 }}
              {...field("description")}
              placeholder="Describe what learners will gain from this course..."
            />
          </div>
        </div>

        <div style={S.row3}>
          <div>
            <label style={S.label}>CE Hours *</label>
            <input type="number" step="0.5" min="1" max="12" style={S.input} {...numField("ceHours")} />
            <p style={S.hint}>Target: {targetWordCount.toLocaleString()} words</p>
          </div>
          <div>
            <label style={S.label}>CE Category</label>
            <select style={S.select} {...field("ceCategory")}>
              <option value="General">General</option>
              <option value="Ethics">Ethics</option>
              <option value="Cultural">Cultural Competency</option>
              <option value="Clinical">Clinical Practice</option>
              <option value="Supervision">Supervision</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Level</label>
            <select style={S.select} {...field("level")}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div style={S.row2}>
          <div>
            <label style={S.label}>Category</label>
            <select style={S.select} {...field("category")}>
              <option>Clinical Practice</option>
              <option>Ethics</option>
              <option>Cultural Competency</option>
              <option>Assessment</option>
              <option>Career Development</option>
              <option>Group Counseling</option>
              <option>Telehealth</option>
              <option>Trauma</option>
              <option>Addictions</option>
              <option>Crisis Intervention</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Delivery Method</label>
            <input style={{ ...S.input, background: "#f0ede8", cursor: "default" }} value="Online Self-Study" readOnly />
          </div>
        </div>
      </div>

      {/* ── Objectives ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Learning Objectives</div>
        <TagList items={state.objectives || []} onRemove={removeObjective} />
        <AddItemRow
          placeholder="Upon completion, participants will be able to..."
          onAdd={addObjective}
        />
        <p style={S.hint}>Add 3–5 measurable objectives. Press Enter or click + Add.</p>
      </div>

      {/* ── Target Audience ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Target Audience</div>
        <TagList items={state.targetAudience || []} onRemove={removeAudience} />
        <AddItemRow
          placeholder="e.g. Licensed Professional Counselors (LPCs)"
          onAdd={addAudience}
        />
        <p style={S.hint}>List each license type or credential that this course applies to.</p>
      </div>

      {/* ── Pricing ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Pricing & Access</div>
        <div style={S.row3}>
          <div>
            <label style={S.label}>Access Type</label>
            <select style={S.select} {...field("accessType")}>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Price ($)</label>
            <input
              type="number" min="0" step="0.01" style={S.input}
              {...numField("price")}
              disabled={state.accessType === "free"}
            />
          </div>
          <div>
            <label style={S.label}>Pricing Tier</label>
            <select style={S.select} {...field("pricingTier")}>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── ACEP Provider (read-only) ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>ACEP Provider Info</div>
        <div style={S.row2}>
          <div>
            <label style={S.label}>Provider</label>
            <input style={{ ...S.input, background: "#f0ede8", cursor: "default" }}
              value={state.instructor || "GA Integrated Therapeutic Perspectives LLC"} readOnly />
          </div>
          <div>
            <label style={S.label}>ACEP Number</label>
            <input style={{ ...S.input, background: "#f0ede8", cursor: "default" }}
              value="NBCC ACEP Provider #7760" readOnly />
          </div>
        </div>
        <p style={S.hint}>Provider info is set at the platform level and cannot be changed per course.</p>
      </div>

    </div>
  );
}
