// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — CourseBuilderContext.jsx
// Provider wrapping the reducer. Handles autosave, dirty state, keyboard
// shortcuts, and undo/redo via snapshot stack.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, useRef, useCallback, useEffect, useState } from "react";
import { courseBuilderReducer, INITIAL_STATE, A } from "./courseBuilderReducer.js";
import { saveCourse, loadCourseById } from "./courseBuilderApi.js";

const UNDO_LIMIT = 50;

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
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveError, setSaveError]   = useState(null);
  const [lastSaved, setLastSaved]   = useState(null);
  const [isDirty, setIsDirty]       = useState(false);

  // Loading state
  const [isLoading, setIsLoading]   = useState(!!initialCourseId);
  const [loadError, setLoadError]   = useState(null);

  // Tab navigation
  const [activeTab, setActiveTab]   = useState(0);

  // ── Undo / Redo snapshot stack ────────────────────────────────────────────
  const historyRef      = useRef([INITIAL_STATE]);
  const historyIndexRef = useRef(0);
  const skipHistoryRef  = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const prevStateRef = useRef(state);
  useEffect(() => {
    if (prevStateRef.current === state) return;
    prevStateRef.current = state;
    setIsDirty(true);

    if (skipHistoryRef.current) return;

    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(state);
    if (history.length > UNDO_LIMIT) history.shift();
    historyRef.current      = history;
    historyIndexRef.current = history.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [state]);

  // ── Load existing course on mount ─────────────────────────────────────────

  useEffect(() => {
    if (!initialCourseId) return;
    (async () => {
      try {
        setIsLoading(true);
        const course = await loadCourseById(initialCourseId);
        skipHistoryRef.current = true;
        dispatch({ type: A.LOAD_COURSE, courseData: course });
        skipHistoryRef.current = false;
        historyRef.current      = [course];
        historyIndexRef.current = 0;
        setCanUndo(false);
        setCanRedo(false);
        setIsDirty(false);
      } catch (err) {
        setLoadError(err.message);
        console.error("CourseBuilderProvider: failed to load course", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [initialCourseId]);

  // ── Autosave ──────────────────────────────────────────────────────────────

  const autosaveTimerRef = useRef(null);
  useEffect(() => {
    if (!isDirty || !state._id) return;
    clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => { doSave(false, true); }, 3000);
    return () => clearTimeout(autosaveTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isDirty]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const doSave = useCallback(
    async (showFeedback = true, silent = false) => {
      if (!silent) setSaveStatus("saving");
      setSaveError(null);
      try {
        const result = await saveCourse(state);
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

  // ── Undo / Redo ───────────────────────────────────────────────────────────

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const snapshot = historyRef.current[historyIndexRef.current];
    skipHistoryRef.current = true;
    dispatch({ type: A.LOAD_COURSE, courseData: snapshot });
    skipHistoryRef.current = false;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
    setIsDirty(true);
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const snapshot = historyRef.current[historyIndexRef.current];
    skipHistoryRef.current = true;
    dispatch({ type: A.LOAD_COURSE, courseData: snapshot });
    skipHistoryRef.current = false;
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    setIsDirty(true);
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    function handleKeyDown(e) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "s") { e.preventDefault(); doSave(true); return; }
      if (mod && e.shiftKey && (e.key === "z" || e.key === "Z")) { e.preventDefault(); redo(); return; }
      if (mod && (e.key === "z" || e.key === "Z")) { e.preventDefault(); undo(); return; }
      if (mod && (e.key === "y" || e.key === "Y")) { e.preventDefault(); redo(); return; }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [doSave, undo, redo]);

  // ── beforeunload ──────────────────────────────────────────────────────────

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Leave anyway?";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ── Convenience dispatchers ───────────────────────────────────────────────

  const setMeta         = (field, value) => dispatch({ type: A.SET_METADATA,     field, value });
  const addObjective    = (text)          => dispatch({ type: A.ADD_OBJECTIVE,    text });
  const removeObjective = (index)         => dispatch({ type: A.REMOVE_OBJECTIVE, index });
  const addAudience     = (text)          => dispatch({ type: A.ADD_AUDIENCE,     text });
  const removeAudience  = (index)         => dispatch({ type: A.REMOVE_AUDIENCE,  index });

  const addSection      = (title, afterIndex) => dispatch({ type: A.ADD_SECTION,         title, afterIndex });
  const removeSection   = (sectionIndex)      => dispatch({ type: A.REMOVE_SECTION,      sectionIndex });
  const setSectionTitle = (sectionIndex, title) => dispatch({ type: A.SET_SECTION_TITLE, sectionIndex, title });
  const moveSection     = (from, to)            => dispatch({ type: A.MOVE_SECTION,       from, to });

  const addBlock       = (sectionIndex, blockType, afterBlockIndex) =>
    dispatch({ type: A.ADD_BLOCK,       sectionIndex, blockType, afterBlockIndex });
  const updateBlock    = (sectionIndex, blockIndex, updates) =>
    dispatch({ type: A.UPDATE_BLOCK,    sectionIndex, blockIndex, updates });
  const removeBlock    = (sectionIndex, blockIndex) =>
    dispatch({ type: A.REMOVE_BLOCK,    sectionIndex, blockIndex });
  const moveBlock      = (fromSection, fromIndex, toSection, toIndex) =>
    dispatch({ type: A.MOVE_BLOCK,      fromSection, fromIndex, toSection, toIndex });
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
    skipHistoryRef.current = true;
    dispatch({ type: A.LOAD_COURSE, courseData });
    skipHistoryRef.current = false;
    historyRef.current      = [courseData];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
    setIsDirty(false);
    setLastSaved(null);
  };

  const resetCourse = () => {
    skipHistoryRef.current = true;
    dispatch({ type: A.RESET });
    skipHistoryRef.current = false;
    historyRef.current      = [INITIAL_STATE];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
    setIsDirty(false);
    setLastSaved(null);
  };

  // ── Context value ─────────────────────────────────────────────────────────

  const value = {
    state, dispatch,
    saveStatus, saveError, lastSaved, isDirty,
    isLoading, loadError,
    activeTab, setActiveTab,
    canUndo, canRedo, undo, redo,
    doSave, loadCourse, resetCourse,
    setMeta, addObjective, removeObjective, addAudience, removeAudience,
    addSection, removeSection, setSectionTitle, moveSection,
    addBlock, updateBlock, removeBlock, moveBlock, duplicateBlock,
    addAssessmentQ, updateAssessmentQ, removeAssessmentQ, setAssessmentMeta,
    addReference, updateReference, removeReference,
  };

  return (
    <CourseBuilderContext.Provider value={value}>
      {children}
    </CourseBuilderContext.Provider>
  );
}
