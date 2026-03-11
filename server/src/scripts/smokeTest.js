/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import fetch from "node-fetch";

/**
 * CounselorReady API Smoke Tests
 * ================================
 * Tests actual API endpoints to verify the learner experience works end-to-end.
 *
 * Usage:
 *   TEST_EMAIL=testlearner@counselorready.com TEST_PASSWORD=yourpassword node src/scripts/smokeTest.js
 *
 * Or test a specific course:
 *   COURSE_SLUG=28-days-later-understanding-addiction-and-recovery node src/scripts/smokeTest.js
 *
 * Requirements:
 *   npm install node-fetch (if not already installed)
 */

const BASE_URL = process.env.API_URL || "https://api.counselorready.com";
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;
const TARGET_SLUG = process.env.COURSE_SLUG;

if (!EMAIL || !PASSWORD) {
  console.error("Required: TEST_EMAIL and TEST_PASSWORD environment variables");
  console.error("Example: TEST_EMAIL=test@example.com TEST_PASSWORD=pass123 node src/scripts/smokeTest.js");
  process.exit(1);
}

let token = null;
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function api(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  return { res, data: await res.json().catch(() => ({})) };
}

async function main() {
  console.log("\n═══════════════════════════════════════════════");
  console.log("  CounselorReady API Smoke Tests");
  console.log(`  Target: ${BASE_URL}`);
  console.log("═══════════════════════════════════════════════\n");

  // ── AUTH ──────────────────────────────────────────────
  console.log("AUTH");
  let userId;
  
  await test("Login with test credentials", async () => {
    const { res, data } = await api("POST", "/api/auth/login", { email: EMAIL, password: PASSWORD });
    assert(res.status === 200, `Login failed: ${res.status} ${JSON.stringify(data)}`);
    assert(data.token, "No token in response");
    token = data.token;
    userId = data.user?._id || data.user?.id;
  });

  await test("Get current user", async () => {
    const { res, data } = await api("GET", "/api/auth/me");
    assert(res.status === 200, `Got ${res.status}`);
    assert(data.email === EMAIL, `Wrong user: ${data.email}`);
  });

  // ── COURSE CATALOG ────────────────────────────────────
  console.log("\nCOURSE CATALOG");
  let courses = [];
  let targetCourse = null;

  await test("Fetch published courses", async () => {
    const { res, data } = await api("GET", "/api/courses");
    assert(res.status === 200, `Got ${res.status}`);
    courses = data.courses || data || [];
    assert(courses.length > 0, "No courses returned");
    console.log(`     Found ${courses.length} courses`);
  });

  if (TARGET_SLUG) {
    await test(`Find target course: ${TARGET_SLUG}`, async () => {
      targetCourse = courses.find(c => c.slug === TARGET_SLUG);
      assert(targetCourse, `Course with slug "${TARGET_SLUG}" not found in catalog`);
      console.log(`     Found: ${targetCourse.title}`);
    });
  } else {
    // Use most recently updated published course
    targetCourse = courses[0];
    console.log(`  ℹ️  Testing most recent course: ${targetCourse?.title}`);
  }

  if (!targetCourse) {
    console.log("\n❌ No target course found — stopping tests");
    process.exit(1);
  }

  const courseId = targetCourse._id;

  // ── COURSE DETAIL ─────────────────────────────────────
  console.log("\nCOURSE DETAIL");

  await test("Fetch course detail", async () => {
    const { res, data } = await api("GET", `/api/courses/${courseId}`);
    assert(res.status === 200, `Got ${res.status}`);
    assert(data.title, "No title in response");
    assert(data.modules?.length > 0, "No modules in course");
    console.log(`     ${data.modules.length} modules, ${data.ceHours || data.ceuHours} CE hours`);
  });

  await test("Course has final exam in last module", async () => {
    const { data } = await api("GET", `/api/courses/${courseId}`);
    const modules = data.modules || [];
    const lastModule = modules[modules.length - 1];
    const exam = (lastModule?.lessons || []).find(l => l.isExam);
    assert(exam, `No final exam lesson found in last module "${lastModule?.title}"`);
    assert(exam.questions?.length >= 15, `Exam has ${exam.questions?.length} questions, need 15+`);
    console.log(`     Exam: ${exam.questions?.length} questions`);
  });

  // ── ENROLLMENT ────────────────────────────────────────
  console.log("\nENROLLMENT");

  await test("Enroll in course", async () => {
    const { res, data } = await api("POST", `/api/courses/${courseId}/enroll`);
    assert(res.status === 200 || res.status === 201 || res.status === 400, `Got ${res.status}: ${JSON.stringify(data)}`);
    // 400 is OK if already enrolled
    if (res.status === 400) console.log("     (already enrolled — OK)");
  });

  await test("Course appears in enrolled list", async () => {
    const { res, data } = await api("GET", "/api/users/enrolled-courses");
    assert(res.status === 200, `Got ${res.status}`);
    const enrolled = data.courses || data || [];
    const found = enrolled.find(c => c._id === courseId || c.courseId === courseId);
    assert(found, "Course not in enrolled list after enrollment");
  });

  // ── PROGRESS TRACKING ─────────────────────────────────
  console.log("\nPROGRESS TRACKING");

  await test("Fetch course progress", async () => {
    const { res, data } = await api("GET", `/api/courses/${courseId}/progress`);
    assert(res.status === 200, `Got ${res.status}`);
    console.log(`     Progress: ${data.percentComplete || 0}%`);
  });

  // Get first lesson for tracking test
  let firstLesson = null;
  await test("Fetch first lesson", async () => {
    const { data: course } = await api("GET", `/api/courses/${courseId}`);
    firstLesson = course.modules?.[0]?.lessons?.[0];
    assert(firstLesson, "No lessons found in first module");
    console.log(`     First lesson: ${firstLesson.title}`);
  });

  if (firstLesson) {
    await test("Track time on lesson", async () => {
      const { res } = await api("POST", `/api/courses/${courseId}/lessons/${firstLesson._id}/track-time`, { seconds: 30 });
      assert(res.status === 200 || res.status === 201, `Got ${res.status}`);
    });
  }

  // ── QUIZ SUBMISSION ───────────────────────────────────
  console.log("\nQUIZ / EXAM");

  await test("Fetch exam questions", async () => {
    const { data: course } = await api("GET", `/api/courses/${courseId}`);
    const modules = course.modules || [];
    const lastModule = modules[modules.length - 1];
    const exam = (lastModule?.lessons || []).find(l => l.isExam);
    assert(exam?.questions?.length >= 15, `Exam needs 15+ questions, has ${exam?.questions?.length}`);
    console.log(`     ${exam.questions.length} exam questions ready`);
  });

  // ── SUMMARY ───────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════");
  const total = passed + failed;
  if (failed === 0) {
    console.log(`✅ All ${total} tests passed — ${targetCourse.title} is ready to publish`);
  } else {
    console.log(`❌ ${failed}/${total} tests failed — do not publish until fixed`);
  }
  console.log("═══════════════════════════════════════════════\n");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
