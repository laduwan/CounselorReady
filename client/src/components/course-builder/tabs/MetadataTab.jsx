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
  approvalCard: {
    border: `1px solid ${C.border}`, borderRadius: 8, padding: 16,
    marginBottom: 12, background: C.stone,
  },
  smallBtn: {
    padding: "6px 12px", borderRadius: 6, border: "none",
    background: C.hunterGreen, color: "#fff", fontSize: 12,
    fontWeight: 600, cursor: "pointer",
  },
  ghostBtn: {
    padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`,
    background: "#fff", color: C.burgundy, fontSize: 12,
    fontWeight: 600, cursor: "pointer",
  },
  hourRow: {
    display: "grid", gridTemplateColumns: "1fr 110px 32px", gap: 8,
    alignItems: "center", marginBottom: 8,
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

// Approving-body enum (mirrors InteractiveCourse.approvals[].body)
const APPROVAL_BODIES = [
  "NBCC", "ACEP", "LPCAGA", "GSCSW", "ACA",
  "NASW", "APA", "ASWB", "AAMFT", "State Board", "Other",
];

// Delivery format enum (mirrors InteractiveCourse.approvals[].deliveryFormat)
const DELIVERY_FORMATS = [
  { value: "asynchronous",        label: "Asynchronous" },
  { value: "live-webinar",        label: "Live Webinar" },
  { value: "multi-live-workshop", label: "Multi-Session Live Workshop" },
  { value: "in-person-single",    label: "In-Person" },
  { value: "in-person-conference",label: "In-Person Conference" },
];

// Approval status enum (mirrors InteractiveCourse.approvals[].status)
const APPROVAL_STATUSES = ["approved", "pending", "expired", "not-applied"];

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

  // ── Approvals authoring (round-trips to InteractiveCourse.approvals[]) ──
  const approvals = state.approvals || [];

  function setApprovals(next) {
    setMeta("approvals", next);
  }
  function addApproval() {
    setApprovals([
      ...approvals,
      { body: "Other", providerNumber: "", providerName: "", status: "approved", deliveryFormat: "asynchronous", hourBreakdown: [] },
    ]);
  }
  function removeApproval(i) {
    setApprovals(approvals.filter((_, idx) => idx !== i));
  }
  function updateApproval(i, patch) {
    setApprovals(approvals.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }
  function addHourRow(i) {
    const hb = approvals[i].hourBreakdown || [];
    updateApproval(i, { hourBreakdown: [...hb, { label: "", hours: 0 }] });
  }
  function updateHourRow(i, hi, patch) {
    const hb = (approvals[i].hourBreakdown || []).map((h, idx) => (idx === hi ? { ...h, ...patch } : h));
    updateApproval(i, { hourBreakdown: hb });
  }
  function removeHourRow(i, hi) {
    const hb = (approvals[i].hourBreakdown || []).filter((_, idx) => idx !== hi);
    updateApproval(i, { hourBreakdown: hb });
  }

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

      {/* ── Approvals (per-body approval letters) ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Approvals</div>
        <p style={{ ...S.hint, marginTop: 0, marginBottom: 16 }}>
          Add one row per approving body. Partner-owned courses issue certificates
          under these approvals (their own provider numbers) — not the platform&apos;s NBCC #7760.
        </p>

        {approvals.length === 0 && (
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>No approvals added yet.</p>
        )}

        {approvals.map((appr, i) => (
          <div key={i} style={S.approvalCard}>
            <div style={S.row3}>
              <div>
                <label style={S.label}>Approving Body</label>
                <select
                  style={S.select}
                  value={appr.body || "Other"}
                  onChange={e => updateApproval(i, { body: e.target.value })}
                >
                  {APPROVAL_BODIES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Status</label>
                <select
                  style={S.select}
                  value={appr.status || "approved"}
                  onChange={e => updateApproval(i, { status: e.target.value })}
                >
                  {APPROVAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Delivery Format</label>
                <select
                  style={S.select}
                  value={appr.deliveryFormat || "asynchronous"}
                  onChange={e => updateApproval(i, { deliveryFormat: e.target.value })}
                >
                  {DELIVERY_FORMATS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>

            <div style={S.row2}>
              <div>
                <label style={S.label}>Provider Number</label>
                <input
                  style={S.input}
                  value={appr.providerNumber || ""}
                  onChange={e => updateApproval(i, { providerNumber: e.target.value })}
                  placeholder="e.g. 1234 or A-0426-564"
                />
              </div>
              <div>
                <label style={S.label}>Provider Name</label>
                <input
                  style={S.input}
                  value={appr.providerName || ""}
                  onChange={e => updateApproval(i, { providerName: e.target.value })}
                  placeholder="e.g. American Psychological Association"
                />
              </div>
            </div>

            <label style={S.label}>Hour Breakdown</label>
            {(appr.hourBreakdown || []).map((h, hi) => (
              <div key={hi} style={S.hourRow}>
                <input
                  style={S.input}
                  value={h.label || ""}
                  onChange={e => updateHourRow(i, hi, { label: e.target.value })}
                  placeholder="e.g. ethics"
                />
                <input
                  type="number" min="0" step="0.5"
                  style={S.input}
                  value={h.hours ?? 0}
                  onChange={e => updateHourRow(i, hi, { hours: Number(e.target.value) })}
                  placeholder="Hours"
                />
                <button
                  style={S.tagRemove}
                  onClick={() => removeHourRow(i, hi)}
                  aria-label="Remove hour row"
                >×</button>
              </div>
            ))}
            <div style={S.addRow}>
              <button style={S.smallBtn} onClick={() => addHourRow(i)}>+ Hour Type</button>
              <button style={S.ghostBtn} onClick={() => removeApproval(i)}>Remove Approval</button>
            </div>
          </div>
        ))}

        <button style={S.addBtn} onClick={addApproval}>+ Add Approval</button>
      </div>

    </div>
  );
}
