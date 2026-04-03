// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — courseBuilderReducer.js
// Pure reducer. No side effects. Every mutation goes through here.
// ─────────────────────────────────────────────────────────────────────────────

import { uid, slugify } from "./utils.js";
import { BLOCK_DEFAULTS, ACEP_PROVIDER } from "./constants.js";

// ─── Initial state ───────────────────────────────────────────────────────────

export const INITIAL_STATE = {
  _id: null,
  title: "",
  slug: "",
  description: "",
  courseCode: "",
  ceHours: 3,
  ceCategory: "General",
  level: "Intermediate",
  category: "Clinical Practice",
  accessType: "subscription",
  price: 0,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  deliveryMethod: "online",
  objectives: [],
  targetAudience: [],

  // ACEP — hardcoded per platform spec
  instructor:     ACEP_PROVIDER.name,
  approvingBody:  ACEP_PROVIDER.approvalBody,
  approvalNumber: `#${ACEP_PROVIDER.acepNumber}`,
  ceuHours: 3,
  ceuEligible: true,

  sections: [],

  assessment: {
    questions: [],
    passingScore: 80,
    passThreshold: 0.80,
    maxAttempts: 3,
  },

  references: [],

  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true,
  },
};

// ─── Action types ────────────────────────────────────────────────────────────

export const A = {
  // Metadata
  SET_METADATA:         "SET_METADATA",
  SET_OBJECTIVES:       "SET_OBJECTIVES",
  ADD_OBJECTIVE:        "ADD_OBJECTIVE",
  REMOVE_OBJECTIVE:     "REMOVE_OBJECTIVE",
  ADD_AUDIENCE:         "ADD_AUDIENCE",
  REMOVE_AUDIENCE:      "REMOVE_AUDIENCE",

  // Sections
  SET_SECTION_TITLE:    "SET_SECTION_TITLE",
  ADD_SECTION:          "ADD_SECTION",
  REMOVE_SECTION:       "REMOVE_SECTION",
  MOVE_SECTION:         "MOVE_SECTION",

  // Blocks
  ADD_BLOCK:            "ADD_BLOCK",
  UPDATE_BLOCK:         "UPDATE_BLOCK",
  REMOVE_BLOCK:         "REMOVE_BLOCK",
  MOVE_BLOCK:           "MOVE_BLOCK",
  DUPLICATE_BLOCK:      "DUPLICATE_BLOCK",

  // Assessment
  ADD_ASSESSMENT_Q:     "ADD_ASSESSMENT_Q",
  UPDATE_ASSESSMENT_Q:  "UPDATE_ASSESSMENT_Q",
  REMOVE_ASSESSMENT_Q:  "REMOVE_ASSESSMENT_Q",
  MOVE_ASSESSMENT_Q:    "MOVE_ASSESSMENT_Q",
  SET_ASSESSMENT_META:  "SET_ASSESSMENT_META",

  // References
  ADD_REFERENCE:        "ADD_REFERENCE",
  UPDATE_REFERENCE:     "UPDATE_REFERENCE",
  REMOVE_REFERENCE:     "REMOVE_REFERENCE",
  MOVE_REFERENCE:       "MOVE_REFERENCE",

  // Field-level (used by Phase 3 tabs)
  SET_FIELD:            "SET_FIELD",
  UPDATE_OBJECTIVE:     "UPDATE_OBJECTIVE",

  // Lifecycle
  LOAD_COURSE:          "LOAD_COURSE",
  BATCH:                "BATCH",
  RESET:                "RESET",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clampIndex(arr, i) {
  return Math.max(0, Math.min(arr.length - 1, i));
}

function arrayMove(arr, from, to) {
  const out = [...arr];
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
  return out;
}

function newBlock(type) {
  const defaults = BLOCK_DEFAULTS[type];
  if (!defaults) throw new Error(`Unknown block type: ${type}`);
  return { ...defaults, _tempId: uid() };
}

function newSection(title = "New Section") {
  return {
    _tempId: uid(),
    title,
    order: 1,
    contentBlocks: [],
  };
}

function newAssessmentQuestion() {
  return {
    _tempId: uid(),
    question: "",
    type: "multiple_choice",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  };
}

// ─── Normalise a loaded course (ensure _tempIds exist) ───────────────────────

function normaliseLoaded(course) {
  return {
    ...INITIAL_STATE,
    ...course,
    sections: (course.sections || []).map(s => ({
      ...s,
      _tempId: s._tempId || uid(),
      contentBlocks: (s.contentBlocks || []).map(b => ({
        ...b,
        _tempId: b._tempId || uid(),
      })),
    })),
    assessment: {
      ...INITIAL_STATE.assessment,
      ...(course.assessment || {}),
      questions: ((course.assessment || {}).questions || []).map(q => ({
        ...q,
        _tempId: q._tempId || uid(),
      })),
    },
    references: (course.references || []).map(r => ({
      ...r,
      _tempId: r._tempId || uid(),
    })),
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function courseBuilderReducer(state, action) {
  switch (action.type) {

    // ── Metadata ──────────────────────────────────────────────────────────────

    case A.SET_METADATA: {
      const updates = { [action.field]: action.value };
      // Auto-update slug when title changes (unless user has manually set slug)
      if (action.field === "title" && !state._slugEdited) {
        updates.slug = slugify(action.value);
      }
      if (action.field === "slug") {
        updates._slugEdited = true;
      }
      // Mirror ceHours → ceuHours
      if (action.field === "ceHours") {
        updates.ceuHours = action.value;
      }
      return { ...state, ...updates };
    }

    case A.ADD_OBJECTIVE: {
      const text = (action.text || "").trim();
      if (!text) return state;
      return { ...state, objectives: [...state.objectives, text] };
    }

    case A.REMOVE_OBJECTIVE: {
      return {
        ...state,
        objectives: state.objectives.filter((_, i) => i !== action.index),
      };
    }

    case A.ADD_AUDIENCE: {
      const text = (action.text || "").trim();
      if (!text) return state;
      return { ...state, targetAudience: [...state.targetAudience, text] };
    }

    case A.REMOVE_AUDIENCE: {
      return {
        ...state,
        targetAudience: state.targetAudience.filter((_, i) => i !== action.index),
      };
    }

    // ── Sections ──────────────────────────────────────────────────────────────

    case A.SET_SECTION_TITLE: {
      const sections = state.sections.map((s, i) =>
        i === action.sectionIndex ? { ...s, title: action.title } : s
      );
      return { ...state, sections };
    }

    case A.ADD_SECTION: {
      const section = newSection(action.title);
      const sections = [...state.sections];
      const after = action.afterIndex ?? sections.length - 1;
      sections.splice(after + 1, 0, section);
      return { ...state, sections };
    }

    case A.REMOVE_SECTION: {
      if (state.sections.length <= 1) return state; // always keep at least 1
      return {
        ...state,
        sections: state.sections.filter((_, i) => i !== action.sectionIndex),
      };
    }

    case A.MOVE_SECTION: {
      const { from, to } = action;
      if (from === to) return state;
      const clamped = clampIndex(state.sections, to);
      return { ...state, sections: arrayMove(state.sections, from, clamped) };
    }

    // ── Blocks ────────────────────────────────────────────────────────────────

    case A.ADD_BLOCK: {
      const { sectionIndex, afterBlockIndex, blockType } = action;
      const block = newBlock(blockType);
      const sections = state.sections.map((s, si) => {
        if (si !== sectionIndex) return s;
        const blocks = [...s.contentBlocks];
        const after = afterBlockIndex ?? blocks.length - 1;
        blocks.splice(after + 1, 0, block);
        return { ...s, contentBlocks: blocks };
      });
      return { ...state, sections };
    }

    case A.UPDATE_BLOCK: {
      const { sectionIndex, blockIndex, updates } = action;
      const sections = state.sections.map((s, si) => {
        if (si !== sectionIndex) return s;
        return {
          ...s,
          contentBlocks: s.contentBlocks.map((b, bi) =>
            bi === blockIndex ? { ...b, ...updates } : b
          ),
        };
      });
      return { ...state, sections };
    }

    case A.REMOVE_BLOCK: {
      const { sectionIndex, blockIndex } = action;
      const sections = state.sections.map((s, si) => {
        if (si !== sectionIndex) return s;
        return {
          ...s,
          contentBlocks: s.contentBlocks.filter((_, bi) => bi !== blockIndex),
        };
      });
      return { ...state, sections };
    }

    case A.MOVE_BLOCK: {
      const { fromSection, fromIndex, toSection, toIndex } = action;
      if (fromSection === toSection && fromIndex === toIndex) return state;

      const sections = state.sections.map((s, si) => {
        // Same-section reorder
        if (fromSection === toSection && si === fromSection) {
          return { ...s, contentBlocks: arrayMove(s.contentBlocks, fromIndex, toIndex) };
        }
        // Cross-section: remove from source
        if (si === fromSection) {
          return {
            ...s,
            contentBlocks: s.contentBlocks.filter((_, bi) => bi !== fromIndex),
          };
        }
        // Cross-section: insert into destination
        if (si === toSection) {
          const block = state.sections[fromSection].contentBlocks[fromIndex];
          const blocks = [...s.contentBlocks];
          blocks.splice(toIndex, 0, block);
          return { ...s, contentBlocks: blocks };
        }
        return s;
      });
      return { ...state, sections };
    }

    case A.DUPLICATE_BLOCK: {
      const { sectionIndex, blockIndex } = action;
      const sections = state.sections.map((s, si) => {
        if (si !== sectionIndex) return s;
        const original = s.contentBlocks[blockIndex];
        const copy = { ...original, _tempId: uid() };
        const blocks = [...s.contentBlocks];
        blocks.splice(blockIndex + 1, 0, copy);
        return { ...s, contentBlocks: blocks };
      });
      return { ...state, sections };
    }

    // ── Assessment ────────────────────────────────────────────────────────────

    case A.ADD_ASSESSMENT_Q: {
      const id = uid();
      const q = action.question
        ? { ...action.question, _tempId: id, id }
        : { ...newAssessmentQuestion(), id };
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: [...state.assessment.questions, q],
        },
      };
    }

    case A.UPDATE_ASSESSMENT_Q: {
      const updates = action.updates || action.changes;
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: state.assessment.questions.map((q, i) =>
            (action.id ? (q._tempId === action.id || q.id === action.id) : i === action.qIndex)
              ? { ...q, ...updates } : q
          ),
        },
      };
    }

    case A.REMOVE_ASSESSMENT_Q: {
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: state.assessment.questions.filter((q, i) =>
            action.id ? (q._tempId !== action.id && q.id !== action.id) : i !== action.qIndex
          ),
        },
      };
    }

    case A.MOVE_ASSESSMENT_Q: {
      const { from, to } = action;
      if (from === to) return state;
      return {
        ...state,
        assessment: {
          ...state.assessment,
          questions: arrayMove(state.assessment.questions, from, clampIndex(state.assessment.questions, to)),
        },
      };
    }

    case A.SET_ASSESSMENT_META: {
      return {
        ...state,
        assessment: { ...state.assessment, ...(action.updates || action.changes) },
      };
    }

    // ── References ────────────────────────────────────────────────────────────

    case A.ADD_REFERENCE: {
      const id = uid();
      const ref = {
        _tempId: id,
        id,
        title: "",
        author: "",
        year: String(new Date().getFullYear()),
        source: "",
        ...(action.reference || {}),
      };
      return { ...state, references: [...state.references, ref] };
    }

    case A.UPDATE_REFERENCE: {
      const updates = action.updates || action.changes;
      return {
        ...state,
        references: state.references.map((r, i) =>
          (action.id ? (r._tempId === action.id || r.id === action.id) : i === action.refIndex)
            ? { ...r, ...updates } : r
        ),
      };
    }

    case A.REMOVE_REFERENCE: {
      return {
        ...state,
        references: state.references.filter((r, i) =>
          action.id ? (r._tempId !== action.id && r.id !== action.id) : i !== action.refIndex
        ),
      };
    }

    case A.MOVE_REFERENCE: {
      const { from, to } = action;
      if (from === to) return state;
      const refs = [...state.references];
      const [moved] = refs.splice(from, 1);
      refs.splice(to, 0, moved);
      return { ...state, references: refs };
    }

    // ── Field-level (Phase 3 tab compat) ─────────────────────────────────────

    case A.SET_FIELD:
      return { ...state, [action.field]: action.value };

    case A.UPDATE_OBJECTIVE: {
      const objs = [...state.objectives];
      objs[action.index] = action.text;
      return { ...state, objectives: objs };
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    case A.LOAD_COURSE: {
      return normaliseLoaded(action.courseData);
    }

    case A.BATCH: {
      return (action.actions || []).reduce(courseBuilderReducer, state);
    }

    case A.RESET: {
      return { ...INITIAL_STATE };
    }

    default:
      console.warn("courseBuilderReducer: unknown action", action.type);
      return state;
  }
}
