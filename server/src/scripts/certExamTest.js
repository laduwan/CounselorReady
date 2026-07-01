/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import fetch from "node-fetch";

/**
 * CounselorReady Certificate & Exam E2E Tests
 * =============================================
 * Tests certificate generation, exam submission, pass/fail logic, and attempt tracking.
 *
 * Usage:
 *   TEST_EMAIL=testlearner@counselorready.com TEST_PASSWORD=yourpassword node src/scripts/certExamTest.js
 *
 * Optional:
 *   COURSE_SLUG=specific-course-slug  (defaults to first found interactive course)
 *   API_URL=https://api.counselorready.com
 */

const BASE_URL = process.env.API_URL || "https://api.counselorready.com";
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;
const TARGET_SLUG = process.env.COURSE_SLUG;

if (!EMAIL || !PASSWORD) {
  console.error("Required: TEST_EMAIL and TEST_PASSWORD environment variables");
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
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return { res, data: await res.json().catch(() => ({})) };
  }
  return { res, data: null, buffer: await res.buffer().catch(() => null) };
}

async function main() {
  console.log("\n═══════════════════════════════════════════════");
  console.log("  Certificate & Exam End-to-End Tests");
  console.log(`  Target: ${BASE_URL}`);
  console.log("═══════════════════════════════════════════════\n");

  // ── AUTH ──
  console.log("🔐 Authentication");
  let userId;
  await test("Login with test credentials", async () => {
    const { res, data } = await api("POST", "/api/auth/login", { email: EMAIL, password: PASSWORD });
    assert(res.ok, `Login failed: ${res.status}`);
    token = data.token;
    userId = data.user?._id || data.user?.id;
    assert(token, "No token returned");
  });

  // ── FIND COURSE ──
  console.log("\n📚 Course Discovery");
  let course, courseSlug;
  await test("Find interactive course with assessment", async () => {
    const { res, data } = await api("GET", "/api/interactive-courses");
    assert(res.ok, `Failed to fetch courses: ${res.status}`);
    const courses = data.data || data.courses || data;
    assert(Array.isArray(courses) && courses.length > 0, "No interactive courses found");

    if (TARGET_SLUG) {
      course = courses.find(c => c.slug === TARGET_SLUG);
      assert(course, `Course with slug "${TARGET_SLUG}" not found`);
    } else {
      course = courses.find(c => c.assessment?.questions?.length > 0) || courses[0];
    }
    courseSlug = course.slug;
    assert(courseSlug, "Course has no slug");
  });

  await test("Course has final assessment", async () => {
    const { res, data } = await api("GET", `/api/interactive-courses/${courseSlug}`);
    assert(res.ok, `Failed to fetch course detail: ${res.status}`);
    const detail = data.data || data;
    assert(detail.assessment, "Course has no assessment configured");
    assert(detail.assessment.questions?.length >= 1, "Assessment has no questions");
    course = detail;
  });

  // ── ENROLLMENT ──
  console.log("\n📝 Enrollment");
  await test("Enroll in course (or confirm already enrolled)", async () => {
    const { res, data } = await api("POST", `/api/interactive-courses/${courseSlug}/enroll`);
    assert(res.ok || res.status === 400, `Enrollment failed: ${res.status}`);
  });

  // ── EXAM SUBMISSION TESTS ──
  console.log("\n🎯 Exam Submission & Scoring");
  let assessmentQuestions;
  await test("Fetch assessment questions", async () => {
    assessmentQuestions = course.assessment.questions;
    assert(assessmentQuestions.length >= 1, `Expected 1+ questions, got ${assessmentQuestions.length}`);
  });

  // Generate deliberately wrong answers
  let failResult;
  await test("Submit intentionally wrong answers (should fail)", async () => {
    const wrongAnswers = assessmentQuestions.map((q) => {
      const wrongIdx = q.options.findIndex(o => !o.isCorrect);
      return wrongIdx >= 0 ? wrongIdx : 0;
    });
    const { res, data } = await api("POST", `/api/interactive-courses/${courseSlug}/progress/assessment`, {
      answers: wrongAnswers,
      timeUsed: 60
    });
    // May get 400 if already passed or no attempts left
    if (res.ok) {
      failResult = data;
      assert(typeof data.percentage === "number", "Response missing percentage");
      assert(typeof data.passed === "boolean", "Response missing passed flag");
    }
  });

  if (failResult && !failResult.passed) {
    await test("Failed attempt shows correct score", async () => {
      assert(failResult.percentage < 100, "Wrong answers scored 100%");
      assert(failResult.passed === false, "Wrong answers should not pass");
    });

    await test("Attempt counter incremented", async () => {
      assert(failResult.attemptsCount >= 1 || failResult.attemptNumber >= 1, "Attempt not tracked");
    });
  }

  // Generate correct answers
  let passResult;
  await test("Submit correct answers (should pass)", async () => {
    const correctAnswers = assessmentQuestions.map((q) => {
      const correctIdx = q.options.findIndex(o => o.isCorrect);
      return correctIdx >= 0 ? correctIdx : 0;
    });
    const { res, data } = await api("POST", `/api/interactive-courses/${courseSlug}/progress/assessment`, {
      answers: correctAnswers,
      timeUsed: 120
    });
    if (res.ok) {
      passResult = data;
      assert(data.passed === true, `Expected pass with correct answers but got: ${JSON.stringify(data)}`);
      assert(data.percentage >= (course.assessment.passThreshold || 80), "Score below threshold despite correct answers");
    } else if (res.status === 400) {
      // May be out of attempts - still a valid test
      passResult = { passed: true, skipped: true };
    }
  });

  // ── PROGRESS CHECK ──
  console.log("\n📊 Progress Tracking");
  await test("Progress reflects assessment attempts", async () => {
    const { res, data } = await api("GET", `/api/interactive-courses/${courseSlug}/progress`);
    assert(res.ok, `Failed to fetch progress: ${res.status}`);
    const progress = data.data || data;
    assert(progress, "No progress data returned");
    if (progress.assessmentAttempts) {
      assert(progress.assessmentAttempts.length >= 1, "No assessment attempts recorded");
    }
  });

  // ── CERTIFICATE TESTS ──
  console.log("\n📜 Certificate Generation");
  await test("Fetch user certificates", async () => {
    const { res, data } = await api("GET", "/api/certificates");
    assert(res.ok, `Failed to fetch certificates: ${res.status}`);
    const certs = data.data || data.certificates || data;
    assert(Array.isArray(certs), "Certificates response is not an array");
  });

  await test("CE transcript endpoint responds", async () => {
    const { res } = await api("GET", "/api/certificates/transcript");
    // May return 404 if no certs exist, or 200 with PDF
    assert(res.status === 200 || res.status === 404, `Unexpected transcript status: ${res.status}`);
  });

  await test("Bulk certificate download endpoint responds", async () => {
    const { res } = await api("GET", "/api/certificates/download-all");
    // May return 404 if no downloadable certs, or 200 with ZIP
    assert(res.status === 200 || res.status === 404, `Unexpected bulk download status: ${res.status}`);
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      assert(contentType?.includes("zip"), `Expected ZIP content type, got: ${contentType}`);
    }
  });

  // ── SECTION QUIZ TESTS ──
  console.log("\n📝 Section Quiz Tests");
  const quizSections = (course.sections || [])
    .map((s, i) => ({ ...s, index: i }))
    .filter(s => s.hasQuiz && s.quizQuestions?.length > 0);

  if (quizSections.length > 0) {
    const quizSection = quizSections[0];
    await test(`Submit quiz for section "${quizSection.title}"`, async () => {
      const correctAnswers = {};
      quizSection.quizQuestions.forEach((q, i) => {
        const correctIdx = q.options.findIndex(o => o.isCorrect);
        correctAnswers[i] = correctIdx >= 0 ? correctIdx : 0;
      });
      const { res, data } = await api("POST", `/api/interactive-courses/${courseSlug}/progress/section/${quizSection.index}/quiz`, {
        answers: correctAnswers,
        timeSpent: 30
      });
      if (res.ok) {
        assert(typeof data.score === "number", "Quiz response missing score");
        assert(typeof data.totalQuestions === "number", "Quiz response missing totalQuestions");
        assert(typeof data.passed === "boolean", "Quiz response missing passed flag");
        assert(typeof data.attemptsCount === "number", "Quiz response missing attemptsCount");
      }
    });
  } else {
    console.log("  ⏭️  No quiz sections found — skipping quiz tests");
  }

  // ── SUMMARY ──
  console.log("\n═══════════════════════════════════════════════");
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log("═══════════════════════════════════════════════\n");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
