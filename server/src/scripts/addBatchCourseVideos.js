/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Adds verified public-use / official-source videoEmbed blocks to batch courses
 * (all status:'draft'). All URLs are YouTube — the viewer handles YouTube natively;
 * no direct MP4s to avoid cross-site streaming issues.
 *
 * Sources & licensing:
 * - VA National Center for PTSD (YouTube) — U.S. federal works, public domain.
 * - EMDRIA — published for practitioner use, Open Access (emdria.org).
 * - IFS Institute — official owner channel (ifs-institute.com).
 * - Psychotherapy.net — official channel, publisher's own promo excerpts.
 * - UMass Boston / ZERO TO THREE — official university upload, © ZERO TO THREE.
 * - TED — official channel, CC BY-NC-ND; embedded unmodified with attribution.
 * - NIDA/NIH — U.S. federal work, public domain.
 * videoTitle carries the full attribution line on every embed.
 *
 * Distribution: video N appended to end of Section N (video 1 → Section 1,
 * video 2 → Section 2, video 3 → Section 3). Reposition in CourseBuilder before publish.
 *
 * Idempotent: skips any videoUrl already present anywhere in the course.
 * Non-destructive: $push only, drafts stay drafts, no deletes, no status changes.
 *
 * Usage (Render shell, from ~/project/src/server):
 *   node src/scripts/addBatchCourseVideos.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const VA = 'VA National Center for PTSD (whiteboard series, public domain)';

const COURSE_VIDEOS = [
  {
    courseCode: 'CR-TRM-501',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=YMC2jt_QVEE',
        videoTitle: `What is PTSD? — ${VA}` },
      { videoUrl: 'https://www.youtube.com/watch?v=7ywmre5ohKU',
        videoTitle: `PTSD Treatment: Know Your Options — ${VA}` },
      { videoUrl: 'https://www.youtube.com/watch?v=7dzkS0ioqqw',
        videoTitle: `"Evidence-Based" Treatment: What Does It Mean? — ${VA}` }
    ]
  },
  {
    courseCode: 'CR-TRM-503',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=95ovIJ3dsNk',
        videoTitle: 'How Childhood Trauma Affects Health Across a Lifetime (Nadine Burke Harris) — TED' },
      { videoUrl: 'https://www.youtube.com/watch?v=YMC2jt_QVEE',
        videoTitle: `What is PTSD? — ${VA}` },
      { videoUrl: 'https://www.youtube.com/watch?v=7dzkS0ioqqw',
        videoTitle: `"Evidence-Based" Treatment: What Does It Mean? — ${VA}` }
    ]
  },
  {
    courseCode: 'CR-TRM-504',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=Pkfln-ZtWeY',
        videoTitle: 'Introduction to EMDR Therapy — EMDR International Association (EMDRIA)' },
      { videoUrl: 'https://www.youtube.com/watch?v=yh1OoOG2WEg',
        videoTitle: `EMDR for PTSD — ${VA}` },
      { videoUrl: 'https://www.youtube.com/watch?v=7ywmre5ohKU',
        videoTitle: `PTSD Treatment: Know Your Options — ${VA}` }
    ]
  },
  {
    courseCode: 'CR-CLI-601',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=YTTSXc6sARg',
        videoTitle: 'The Still Face Experiment (Dr. Edward Tronick) — © ZERO TO THREE' },
      { videoUrl: 'https://www.youtube.com/watch?v=vmE3NfB_HhE',
        videoTitle: 'Dr. Edward Tronick on Early Experience and Development — UMass Boston' }
    ]
  },
  {
    courseCode: 'CR-CLI-602',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=I2Zv4Wn6qec',
        videoTitle: 'Psychological Flexibility (Steven C. Hayes) — Psychotherapy.net official excerpt' }
    ]
  },
  {
    courseCode: 'CR-CLI-603',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=DdZZ7sTX840',
        videoTitle: 'Dr. Richard Schwartz Explains Internal Family Systems — IFS Institute' }
    ]
  },
  {
    courseCode: 'CR-CLI-605',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=Jqj5zDbkPxY',
        videoTitle: `Cognitive Processing Therapy for PTSD — ${VA}` },
      { videoUrl: 'https://www.youtube.com/watch?v=rHg_SlEqJGc',
        videoTitle: `Prolonged Exposure for PTSD — ${VA}` },
      { videoUrl: 'https://www.youtube.com/watch?v=c1O8l1vfT_M',
        videoTitle: `Written Exposure Therapy for PTSD — ${VA}` }
    ]
  },
  {
    courseCode: 'CR-CLI-606',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=7ywmre5ohKU',
        videoTitle: `PTSD Treatment: Know Your Options (includes medication overview) — ${VA}` }
    ]
  },
  {
    courseCode: 'CR-CLI-607',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=PwnfWMNbg48',
        videoTitle: 'Irvin Yalom: Outpatient Group Psychotherapy — Psychotherapy.net official excerpt' },
      { videoUrl: 'https://www.youtube.com/watch?v=05Elmr65RDg',
        videoTitle: 'Irvin Yalom: Inpatient Group Psychotherapy — Psychotherapy.net official excerpt' },
      { videoUrl: 'https://www.youtube.com/watch?v=crgvtIZqs0k',
        videoTitle: 'Understanding Group Therapy: Interview with Irvin Yalom — Psychotherapy.net official excerpt' }
    ]
  },
  {
    courseCode: 'CR-ADD-701',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=7ywmre5ohKU',
        videoTitle: `PTSD Treatment: Know Your Options (co-occurring SUD context) — ${VA}` }
    ]
  },
  {
    courseCode: 'CR-ADD-702',
    videos: [
      { videoUrl: 'https://www.youtube.com/watch?v=ikmKxgCTXFA',
        videoTitle: 'What is Harm Reduction? — National Institute on Drug Abuse (NIDA/NIH)' }
    ]
  }
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const col = mongoose.connection.collection('interactivecourses');

  for (const entry of COURSE_VIDEOS) {
    const course = await col.findOne(
      { courseCode: entry.courseCode },
      { projection: { slug: 1, status: 1, 'sections.title': 1, 'sections.contentBlocks.videoUrl': 1 } }
    );
    if (!course) { console.log(`✗ NOT FOUND: ${entry.courseCode}`); continue; }
    const sectionCount = (course.sections || []).length;

    for (let i = 0; i < entry.videos.length; i++) {
      const v = entry.videos[i];
      const targetSection = Math.min(i, Math.max(sectionCount - 1, 0));

      const alreadyHas = (course.sections || []).some(s =>
        (s.contentBlocks || []).some(b => b.videoUrl === v.videoUrl));
      if (alreadyHas) {
        console.log(`– already present: ${entry.courseCode} :: ${v.videoUrl.slice(32)}`);
        continue;
      }

      const block = { type: 'videoEmbed', videoUrl: v.videoUrl, videoTitle: v.videoTitle };
      const res = await col.updateOne(
        { courseCode: entry.courseCode, [`sections.${targetSection}`]: { $exists: true } },
        { $push: { [`sections.${targetSection}.contentBlocks`]: block } }
      );
      const secTitle = course.sections?.[targetSection]?.title || '?';
      console.log(`${res.modifiedCount ? '✓ ADDED' : '✗ PUSH FAILED'}: ${entry.courseCode} video ${i + 1} → Section ${targetSection + 1} ("${secTitle.slice(0, 40)}") [${course.status}]`);
    }
  }

  // Verification
  console.log('\n── Verification ──');
  const codes = COURSE_VIDEOS.map(x => x.courseCode);
  const docs = await col.find(
    { courseCode: { $in: codes } },
    { projection: { courseCode: 1, 'sections.contentBlocks.type': 1 } }
  ).toArray();
  const expected = Object.fromEntries(COURSE_VIDEOS.map(x => [x.courseCode, x.videos.length]));
  for (const d of docs.sort((a, b) => a.courseCode.localeCompare(b.courseCode))) {
    const n = (d.sections || []).flatMap(s => (s.contentBlocks || []).filter(b => b.type === 'videoEmbed')).length;
    const exp = expected[d.courseCode];
    console.log(`${n === exp ? '✓' : '✗'} ${d.courseCode}: ${n}/${exp} videoEmbed block(s)`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
