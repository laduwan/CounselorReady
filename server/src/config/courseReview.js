// Base + per-CE-hour. Hours come from the canonical ceuHours (fallback credits).
export const COURSE_REVIEW_BASE_CENTS     = Number(process.env.COURSE_REVIEW_BASE_CENTS     || 9900); // $99 base
export const COURSE_REVIEW_PER_HOUR_CENTS = Number(process.env.COURSE_REVIEW_PER_HOUR_CENTS || 1500); // $15/CE hr
export const COURSE_REVIEW_REFUNDABLE_ON_REJECT = false; // §6.3 = non-refundable; admin may override per-case

export function reviewFeeForCourse(course) {
  const hours = Number(course.ceuHours || course.credits || 0);
  return COURSE_REVIEW_BASE_CENTS + Math.round(COURSE_REVIEW_PER_HOUR_CENTS * hours);
}
// e.g. 1 CE = $114 · 3 CE = $144 · 6 CE = $189
