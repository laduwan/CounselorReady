// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — CourseBuilderContext.jsx
// Provider wrapping the reducer. Handles autosave, dirty state, and keyboard
// shortcuts. Consumed by all child tabs via useCourseBuilder().
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, useRef, useCallback, useEffect, useState } from "react";
import { courseBuilderReducer, INITIAL_STATE, A } from "./courseBuilderReducer.js";
import { saveCourse, loadCourseById } from "./courseBuilderApi.js";

// ─── Context ──────────────────────────────────────────────────────────────────

const CourseBuilderContext = createContext(null);

export function useCourseBuilder() {
  const ctx = useContext(CourseBuilderContext);
  if (!ctx) throw new Error("useCourseBuilder must be used inside <CourseBuilderProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CourseBuilderProvider({ children, initialCourseId = null }) {
  const [state, dispatch] = useReducer(courseBuilderReducer, INITIAL_STATE);

  // Save state
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [saveError, setSaveError]   = useState(null);
  const [lastSaved, setLastSaved]   = useState(null);
  const [isDirty, setIsDirty]       = useState(false);

  // Loading state (for initial course load)
  const [isLoading, setIsLoading]   = useState(!!initialCourseId);
  const [loadError, setLoadError]   = useState(null);

  // Tab navigation
  const [activeTab, setActiveTab]   = useState(0);

  // Track dirty state (reset on save)
  const prevStateRef = useRef(state);
  useEffect(() => {
    if (prevStateRef.current !== state) {
      setIsDirty(true);
    }
    prevStateRef.current = state;
  }, [state]);

  // ── Load existing course on mount ───────────────────────────────────────────

  useEffect(() => {
    if (!initialCourseId) return;
    (async () => {
      try {
        setIsLoading(true);
        const course = await loadCourseById(initialCourseId);
        dispatch({ type: A.LOAD_COURSE, courseData: course });
        setIsDirty(false);
      } catch (err) {
        setLoadError(err.message);
        console.error("CourseBuilderProvider: failed to load course", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [initialCourseId]);

  // ── Autosave (debounced, 3 seconds after last change) ───────────────────────

  const autosaveTimerRef = useRef(null);

  useEffect(() => {
    if (!isDirty || !state._id) return; // only autosave if course already exists in DB
    clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      doSave(false, true); // silent autosave
    }, 3000);
    return () => clearTimeout(autosaveTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isDirty]);

  // ── Save ─────────────────────────────────────────────────────────────────────

  const doSave = useCallback(
    async (showFeedback = true, silent = false) => {
      if (!silent) setSaveStatus("saving");
      setSaveError(null);
      try {
        const result = await saveCourse(state);
        // If this was a new course, store the _id and push it into the URL
        if (!state._id && result.course?._id) {
          dispatch({ type: A.SET_METADATA, field: "_id", value: result.course._id });
          window.history.replaceState({}, "", `/admin/course-builder?id=${result.course._id}`);
        }
        setLastSaved(new Date());
        setIsDirty(false);
        if (!silent) setSaveStatus("saved");
        return result;
      } catch (err) {
        setSaveError(err.message);
        if (!silent) setSaveStatus("error");
        throw err;
      }
    },
    [state]
  );

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        doSave(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [doSave]);

  // ── Dirty-state beforeunload warning ─────────────────────────────────────────

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Leave anyway?";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ── Convenience dispatchers ───────────────────────────────────────────────────

  const setMeta      = (field, value) => dispatch({ type: A.SET_METADATA,     field, value });
  const addObjective = (text)         => dispatch({ type: A.ADD_OBJECTIVE,    text });
  const removeObjective = (index)     => dispatch({ type: A.REMOVE_OBJECTIVE, index });
  const addAudience  = (text)         => dispatch({ type: A.ADD_AUDIENCE,     text });
  const removeAudience = (index)      => dispatch({ type: A.REMOVE_AUDIENCE,  index });

  const addSection    = (title, afterIndex) => dispatch({ type: A.ADD_SECTION,       title, afterIndex });
  const removeSection = (sectionIndex)      => dispatch({ type: A.REMOVE_SECTION,    sectionIndex });
  const setSectionTitle = (sectionIndex, title) => dispatch({ type: A.SET_SECTION_TITLE, sectionIndex, title });
  const moveSection   = (from, to)          => dispatch({ type: A.MOVE_SECTION,      from, to });

  const addBlock    = (sectionIndex, blockType, afterBlockIndex) =>
    dispatch({ type: A.ADD_BLOCK, sectionIndex, blockType, afterBlockIndex });
  const updateBlock = (sectionIndex, blockIndex, updates) =>
    dispatch({ type: A.UPDATE_BLOCK, sectionIndex, blockIndex, updates });
  const removeBlock = (sectionIndex, blockIndex) =>
    dispatch({ type: A.REMOVE_BLOCK, sectionIndex, blockIndex });
  const moveBlock   = (fromSection, fromIndex, toSection, toIndex) =>
    dispatch({ type: A.MOVE_BLOCK, fromSection, fromIndex, toSection, toIndex });
  const duplicateBlock = (sectionIndex, blockIndex) =>
    dispatch({ type: A.DUPLICATE_BLOCK, sectionIndex, blockIndex });

  const addAssessmentQ    = (question)        => dispatch({ type: A.ADD_ASSESSMENT_Q,    question });
  const updateAssessmentQ = (qIndex, updates) => dispatch({ type: A.UPDATE_ASSESSMENT_Q, qIndex, updates });
  const removeAssessmentQ = (qIndex)          => dispatch({ type: A.REMOVE_ASSESSMENT_Q, qIndex });
  const setAssessmentMeta = (updates)         => dispatch({ type: A.SET_ASSESSMENT_META, updates });

  const addReference    = (reference)         => dispatch({ type: A.ADD_REFERENCE,    reference });
  const updateReference = (refIndex, updates) => dispatch({ type: A.UPDATE_REFERENCE, refIndex, updates });
  const removeReference = (refIndex)          => dispatch({ type: A.REMOVE_REFERENCE, refIndex });

  const loadCourse = (courseData) => {
    dispatch({ type: A.LOAD_COURSE, courseData });
    setIsDirty(false);
    setLastSaved(null);
  };

  const resetCourse = () => {
    dispatch({ type: A.RESET });
    setIsDirty(false);
    setLastSaved(null);
  };

  // ── Context value ─────────────────────────────────────────────────────────────

  const value = {
    // State
    state,
    dispatch,

    // Save state
    saveStatus,
    saveError,
    lastSaved,
    isDirty,

    // Load state
    isLoading,
    loadError,

    // Tab
    activeTab,
    setActiveTab,

    // Actions
    doSave,
    loadCourse,
    resetCourse,

    // Metadata
    setMeta,
    addObjective,
    removeObjective,
    addAudience,
    removeAudience,

    // Sections
    addSection,
    removeSection,
    setSectionTitle,
    moveSection,

    // Blocks
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    duplicateBlock,

    // Assessment
    addAssessmentQ,
    updateAssessmentQ,
    removeAssessmentQ,
    setAssessmentMeta,

    // References
    addReference,
    updateReference,
    removeReference,
  };

  return (
    <CourseBuilderContext.Provider value={value}>
      {children}
    </CourseBuilderContext.Provider>
  );
}
