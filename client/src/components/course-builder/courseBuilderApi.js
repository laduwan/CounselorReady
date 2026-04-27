// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — courseBuilderApi.js
// All HTTP calls for the course builder. No React, no side effects.
// ─────────────────────────────────────────────────────────────────────────────

import { buildSavePayload } from "./utils.js";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.error || body.message || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }
  return res.json();
}

// ─── Save (create or update draft) ──────────────────────────────────────────

/**
 * Upsert a course draft.
 * @param {object} state — current reducer state
 * @returns {object} { course: savedDocument }
 */
export async function saveCourse(state) {
  const payload = buildSavePayload(state, false);
  const res = await fetch(`${API_BASE}/course-builder/save`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ─── Publish ─────────────────────────────────────────────────────────────────

/**
 * Publish a course (runs server-side validation first).
 * @param {object} state — current reducer state
 * @returns {object} { course: publishedDocument }
 */
export async function publishCourse(state) {
  const payload = buildSavePayload(state, true);
  const res = await fetch(`${API_BASE}/course-builder/publish`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ─── Load by ID ──────────────────────────────────────────────────────────────

/**
 * Load a course for editing by MongoDB _id.
 * @param {string} id
 * @returns {object} course document
 */
export async function loadCourseById(id) {
  const res = await fetch(`${API_BASE}/course-builder/${id}`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data.course || data;
}

// ─── Load by slug ─────────────────────────────────────────────────────────────

/**
 * Load a course for editing by slug.
 * @param {string} slug
 * @returns {object} course document
 */
export async function loadCourseBySlug(slug) {
  const res = await fetch(`${API_BASE}/course-builder/slug/${slug}`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data.course || data;
}

// ─── Server-side validation ───────────────────────────────────────────────────

/**
 * Run ACEP validation on the server.
 * @param {object} state
 * @returns {object} { valid: boolean, errors: ValidationResult[] }
 */
export async function validateCourse(state) {
  const payload = buildSavePayload(state, false);
  const res = await fetch(`${API_BASE}/course-builder/validate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
