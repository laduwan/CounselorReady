/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Database Backup Service
 *
 * Shared core for:
 *   - server/src/scripts/backupCourse.js       (pre-write snapshot of one or more courses)
 *   - server/src/jobs/dbBackup.js              (nightly full-collection dump)
 *   - server/src/jobs/dbBackupWeeklyDigest.js  (weekly zip of the nightly per-course files)
 *   - server/src/scripts/restoreCourse.js      (restore a course from a snapshot)
 *
 * Every backup is written as MongoDB Extended JSON (relaxed mode) so ObjectIds
 * and Dates round-trip exactly on restore. Files are human-readable and
 * mongoimport-compatible.
 *
 * WHERE BACKUPS GO
 *   S3 (durable):  s3://<DB_BACKUP_S3_BUCKET>/<DB_BACKUP_S3_PREFIX>/
 *                    courses/<COURSE_CODE>/<timestamp>__<slug>.json   ← manual snapshots
 *                    nightly/<YYYY-MM-DD>/<collection>.ndjson.gz      ← nightly full dump
 *                    nightly/<YYYY-MM-DD>/courses/<CODE>__<slug>.json ← nightly per-course
 *                    nightly/<YYYY-MM-DD>/manifest.json
 *                    weekly/<YYYY-MM-DD>/courses-<sourceDate>.zip     ← weekly hard copy, never pruned
 *   Local:         <server>/backups/courses/<COURSE_CODE>/<timestamp>__<slug>.json
 *                  (manual snapshots only; on Render this path is ephemeral and
 *                   disappears on redeploy — the S3 copy is the durable one)
 *
 * Environment variables:
 *   DB_BACKUP_S3_BUCKET       optional — defaults to AWS_S3_RECORDINGS_BUCKET
 *   DB_BACKUP_S3_PREFIX       optional — default "db-backups"
 *   DB_BACKUP_LOCAL_DIR       optional — default <cwd>/backups
 *   DB_BACKUP_COLLECTIONS     optional — comma list for nightly job, default "interactivecourses"
 *   DB_BACKUP_RETENTION_DAYS  optional — nightly prune window, default 30
 *   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION — existing S3 creds
 *
 * IAM: the service user needs s3:PutObject, s3:GetObject, s3:ListBucket and
 * s3:DeleteObject on arn:aws:s3:::<bucket>/<prefix>/*  (DeleteObject only for
 * nightly retention pruning).
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import mongoose from 'mongoose';
import AdmZip from 'adm-zip';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// adminNotificationService instantiates Resend at import time and throws without
// RESEND_API_KEY, so it is loaded lazily — local/CC runs without the key still work.
async function sendAdminAlert(eventType, data) {
  const mod = await import('./adminNotificationService.js');
  return mod.sendAdminAlert(eventType, data);
}

const { EJSON } = mongoose.mongo.BSON;

const LOG = '[DbBackup]';
const REGION = process.env.AWS_REGION || 'us-east-1';

export const BACKUP_BUCKET = process.env.DB_BACKUP_S3_BUCKET || process.env.AWS_S3_RECORDINGS_BUCKET || '';
export const BACKUP_PREFIX = (process.env.DB_BACKUP_S3_PREFIX || 'db-backups').replace(/^\/+|\/+$/g, '');
export const LOCAL_BACKUP_DIR = process.env.DB_BACKUP_LOCAL_DIR || path.resolve(process.cwd(), 'backups');
export const RETENTION_DAYS = Number(process.env.DB_BACKUP_RETENTION_DAYS || 30);
export const IS_RENDER = !!process.env.RENDER;

const COURSES_COLLECTION = 'interactivecourses';

// ── Helpers ──────────────────────────────────────────────────────────────────

export function s3Enabled() {
  return !!(BACKUP_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

function s3() {
  return new S3Client({ region: REGION });
}

export function timestampSlug(d = new Date()) {
  // 2026-08-31T14-05-22Z — filesystem/S3 safe, sorts chronologically
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/:/g, '-');
}

export function dateFolder(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function safeName(s) {
  return String(s || 'unknown').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
}

/** Serialize a document to pretty Extended JSON (relaxed). */
export function serializeDoc(doc) {
  return EJSON.stringify(doc, null, 2, { relaxed: true });
}

/** Parse Extended JSON back into a BSON-typed document. */
export function parseDoc(text) {
  return EJSON.parse(text, { relaxed: true });
}

export function courseSummary(course) {
  const sections = Array.isArray(course.sections) ? course.sections : [];
  const blocks = sections.reduce((n, s) => n + (Array.isArray(s.contentBlocks) ? s.contentBlocks.length : 0), 0);
  return {
    _id: String(course._id),
    courseCode: course.courseCode || '',
    slug: course.slug || '',
    title: course.title || '',
    ceHours: course.ceHours ?? '',
    wordCount: course.wordCount ?? '',
    sections: sections.length,
    contentBlocks: blocks,
    assessmentQuestions: Array.isArray(course.assessment?.questions) ? course.assessment.questions.length : 0,
    updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : '',
  };
}

// ── S3 primitives ────────────────────────────────────────────────────────────

export async function putObject(key, body, contentType = 'application/json') {
  const client = s3();
  await client.send(new PutObjectCommand({
    Bucket: BACKUP_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
  return { bucket: BACKUP_BUCKET, key, uri: `s3://${BACKUP_BUCKET}/${key}`, bytes: Buffer.byteLength(body) };
}

export async function getObjectText(key) {
  const client = s3();
  const res = await client.send(new GetObjectCommand({ Bucket: BACKUP_BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of res.Body) chunks.push(chunk);
  let buf = Buffer.concat(chunks);
  if (key.endsWith('.gz')) buf = zlib.gunzipSync(buf);
  return buf.toString('utf8');
}

async function listKeys(prefix) {
  const client = s3();
  const keys = [];
  let ContinuationToken;
  do {
    const res = await client.send(new ListObjectsV2Command({ Bucket: BACKUP_BUCKET, Prefix: prefix, ContinuationToken }));
    for (const o of res.Contents || []) keys.push(o.Key);
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

async function listDateFolders(prefix) {
  const client = s3();
  const folders = [];
  let ContinuationToken;
  do {
    const res = await client.send(new ListObjectsV2Command({
      Bucket: BACKUP_BUCKET, Prefix: prefix, Delimiter: '/', ContinuationToken,
    }));
    for (const cp of res.CommonPrefixes || []) {
      const name = cp.Prefix.slice(prefix.length).replace(/\/$/, '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(name)) folders.push(name);
    }
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return folders.sort();
}

async function deleteKeys(keys) {
  const client = s3();
  let deleted = 0;
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    await client.send(new DeleteObjectsCommand({
      Bucket: BACKUP_BUCKET,
      Delete: { Objects: batch.map(Key => ({ Key })), Quiet: true },
    }));
    deleted += batch.length;
  }
  return deleted;
}

// ── Course lookup ────────────────────────────────────────────────────────────

/**
 * Find courses in `interactivecourses` by courseCode (case-insensitive) or slug.
 * @param {object} opts  { codes: string[], slugs: string[], all: boolean }
 * @returns {Promise<{ found: object[], missing: string[] }>}
 */
export async function findCourses({ codes = [], slugs = [], all = false } = {}) {
  const col = mongoose.connection.db.collection(COURSES_COLLECTION);
  if (all) {
    const found = await col.find({}).sort({ courseCode: 1 }).toArray();
    return { found, missing: [] };
  }
  const found = [];
  const missing = [];
  for (const code of codes) {
    const doc = await col.findOne({ courseCode: { $regex: `^${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
    if (doc) found.push(doc); else missing.push(code);
  }
  for (const slug of slugs) {
    const doc = await col.findOne({ slug });
    if (doc) found.push(doc); else missing.push(slug);
  }
  return { found, missing };
}

// ── Manual (pre-write) snapshot ──────────────────────────────────────────────

/**
 * Snapshot one course to local disk and (if configured) S3.
 * Returns a record describing exactly where the copies went.
 */
export async function snapshotCourse(course, { local = true, remote = true, reason = '' } = {}) {
  const ts = timestampSlug();
  const code = safeName(course.courseCode || 'NOCODE');
  const slug = safeName(course.slug || String(course._id));
  const fileName = `${ts}__${slug}.json`;
  const body = serializeDoc(course);
  const bytes = Buffer.byteLength(body);

  const rec = {
    ...courseSummary(course),
    bytes,
    reason,
    localPath: null,
    s3Uri: null,
    s3Key: null,
    localEphemeral: IS_RENDER,
  };

  if (local) {
    const dir = path.join(LOCAL_BACKUP_DIR, 'courses', code);
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, fileName);
    fs.writeFileSync(p, body);
    rec.localPath = p;
  }

  if (remote) {
    if (!s3Enabled()) {
      rec.s3Error = 'S3 not configured (need DB_BACKUP_S3_BUCKET or AWS_S3_RECORDINGS_BUCKET + AWS creds)';
    } else {
      try {
        const key = `${BACKUP_PREFIX}/courses/${code}/${fileName}`;
        const r = await putObject(key, body);
        rec.s3Uri = r.uri;
        rec.s3Key = r.key;
      } catch (err) {
        rec.s3Error = err.message;
      }
    }
  }

  return rec;
}

// ── Nightly full dump ────────────────────────────────────────────────────────

/**
 * Dump one collection to nightly/<date>/<collection>.ndjson.gz on S3.
 * Streams with a cursor; one Extended-JSON document per line.
 */
export async function dumpCollectionToS3(collectionName, folder) {
  const col = mongoose.connection.db.collection(collectionName);
  const cursor = col.find({});
  const lines = [];
  let count = 0;
  for await (const doc of cursor) {
    lines.push(EJSON.stringify(doc, { relaxed: true }));
    count += 1;
  }
  const raw = lines.join('\n') + (lines.length ? '\n' : '');
  const gz = zlib.gzipSync(Buffer.from(raw, 'utf8'));
  const key = `${BACKUP_PREFIX}/nightly/${folder}/${collectionName}.ndjson.gz`;
  const r = await putObject(key, gz, 'application/gzip');
  return { collection: collectionName, docs: count, rawBytes: Buffer.byteLength(raw), bytes: gz.length, s3Uri: r.uri, s3Key: key };
}

/**
 * Write every course as its own JSON under nightly/<date>/courses/ so a single
 * course can be restored without unpacking the full dump.
 */
export async function dumpCoursesIndividuallyToS3(folder) {
  const { found } = await findCourses({ all: true });
  const files = [];
  let bytes = 0;
  for (const course of found) {
    const code = safeName(course.courseCode || 'NOCODE');
    const slug = safeName(course.slug || String(course._id));
    const key = `${BACKUP_PREFIX}/nightly/${folder}/courses/${code}__${slug}.json`;
    const body = serializeDoc(course);
    const r = await putObject(key, body);
    bytes += r.bytes;
    files.push({ courseCode: course.courseCode || '', slug: course.slug || '', title: course.title || '', bytes: r.bytes, s3Key: key });
  }
  return { count: files.length, bytes, files };
}

/** Delete nightly/<date>/ folders older than RETENTION_DAYS. */
export async function pruneNightly(retentionDays = RETENTION_DAYS) {
  const base = `${BACKUP_PREFIX}/nightly/`;
  const folders = await listDateFolders(base);
  const cutoff = new Date(Date.now() - retentionDays * 86400000).toISOString().slice(0, 10);
  const stale = folders.filter(f => f < cutoff);
  let deletedObjects = 0;
  for (const f of stale) {
    const keys = await listKeys(`${base}${f}/`);
    deletedObjects += await deleteKeys(keys);
  }
  return { retentionDays, cutoff, kept: folders.filter(f => f >= cutoff), prunedFolders: stale, deletedObjects };
}

// ── Weekly digest (zip of latest nightly per-course files) ──────────────────

/** Find the most recent nightly/<date>/ folder, or null if none exist yet. */
export async function latestNightlyFolder() {
  const folders = await listDateFolders(`${BACKUP_PREFIX}/nightly/`);
  return folders.length ? folders[folders.length - 1] : null;
}

/**
 * Zip every per-course JSON under nightly/<sourceFolder>/courses/ and upload
 * it to weekly/<weeklyFolder>/, plus a 7-day signed download link. Weekly
 * zips are never pruned by this service — see pruneNightly for the nightly
 * retention window, which does not apply here.
 */
export async function buildWeeklyDigest(weeklyFolder, sourceFolder) {
  const coursesPrefix = `${BACKUP_PREFIX}/nightly/${sourceFolder}/courses/`;
  const keys = await listKeys(coursesPrefix);
  if (!keys.length) {
    throw new Error(`No per-course files found under ${coursesPrefix}`);
  }

  const zip = new AdmZip();
  for (const key of keys) {
    const text = await getObjectText(key);
    zip.addFile(key.slice(coursesPrefix.length), Buffer.from(text, 'utf8'));
  }
  const buf = zip.toBuffer();

  const zipKey = `${BACKUP_PREFIX}/weekly/${weeklyFolder}/courses-${sourceFolder}.zip`;
  const r = await putObject(zipKey, buf, 'application/zip');
  const downloadUrl = await getSignedUrl(s3(), new GetObjectCommand({ Bucket: BACKUP_BUCKET, Key: zipKey }), { expiresIn: 604800 });

  return { count: keys.length, bytes: r.bytes, s3Key: zipKey, s3Uri: r.uri, downloadUrl, sourceFolder, weeklyFolder };
}

// ── Notices ──────────────────────────────────────────────────────────────────

/** Console notice for manual snapshots — says exactly where each copy went. */
export function printSnapshotNotice(records, missing = []) {
  const line = '═'.repeat(70);
  console.log(`\n${line}\n${LOG} BACKUP NOTICE — where your copies went\n${line}`);
  for (const r of records) {
    console.log(`\n  ${r.courseCode || '(no code)'} — ${r.title}`);
    console.log(`    slug: ${r.slug}`);
    console.log(`    sections: ${r.sections} · blocks: ${r.contentBlocks} · exam Qs: ${r.assessmentQuestions} · size: ${fmtBytes(r.bytes)}`);
    if (r.localPath) console.log(`    LOCAL: ${r.localPath}${r.localEphemeral ? '   (Render disk — ephemeral, gone on next deploy)' : ''}`);
    if (r.s3Uri) console.log(`    S3:    ${r.s3Uri}   (durable)`);
    if (r.s3Error) console.log(`    S3:    ✗ NOT UPLOADED — ${r.s3Error}`);
    if (r.reason) console.log(`    reason: ${r.reason}`);
  }
  if (missing.length) console.log(`\n  ✗ NOT FOUND in ${COURSES_COLLECTION}: ${missing.join(', ')}`);
  const durable = records.filter(r => r.s3Uri).length;
  console.log(`\n  ${records.length} snapshot(s) written · ${durable} durable on S3 · ${records.length - durable} local-only`);
  if (records.some(r => r.localEphemeral && !r.s3Uri)) {
    console.log(`  ⚠ Local-only copies on Render will NOT survive a redeploy. Fix S3 config and re-run.`);
  }
  console.log(`\n  Restore: node src/scripts/restoreCourse.js --key=<S3 key> [--apply]`);
  console.log(`${line}\n`);
}

/** Email notice for manual snapshots (one email per run, all courses listed). */
export async function emailSnapshotNotice(records, missing = [], { reason = '', invokedBy = 'script' } = {}) {
  if (!process.env.RESEND_API_KEY) return false;
  const data = {
    'Courses': records.map(r => r.courseCode || r.slug).join(', ') || '—',
    'Count': `${records.length} snapshot(s)`,
    'Reason': reason || '—',
    'Invoked by': invokedBy,
    'Host': IS_RENDER ? `Render (${process.env.RENDER_SERVICE_NAME || 'service'})` : 'local',
  };
  records.forEach((r, i) => {
    const where = [r.s3Uri ? `S3: ${r.s3Uri}` : null, r.localPath ? `Local: ${r.localPath}${r.localEphemeral ? ' (ephemeral)' : ''}` : null, r.s3Error ? `S3 error: ${r.s3Error}` : null]
      .filter(Boolean).join('<br>');
    data[`${i + 1}. ${r.courseCode || r.slug}`] = `${r.title} · ${r.sections} sec / ${r.contentBlocks} blocks · ${fmtBytes(r.bytes)}<br>${where}`;
  });
  if (missing.length) data['Not found'] = missing.join(', ');
  await sendAdminAlert('db_backup', data);
  return true;
}

/** Email notice for the nightly job. */
export async function emailNightlyNotice(report) {
  if (!process.env.RESEND_API_KEY) return false;
  if (!report.ok) {
    await sendAdminAlert('db_backup_failed', {
      'Job': 'Nightly DB backup',
      'Date': report.folder,
      'Error': report.error || 'unknown',
      'Bucket': BACKUP_BUCKET || '(not configured)',
      'Prefix': `${BACKUP_PREFIX}/nightly/${report.folder}/`,
    });
    return true;
  }
  const data = {
    'Job': 'Nightly DB backup',
    'Date': report.folder,
    'Bucket': BACKUP_BUCKET,
    'Location': `s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/nightly/${report.folder}/`,
  };
  for (const d of report.dumps) {
    data[`Dump: ${d.collection}`] = `${d.docs} docs · ${fmtBytes(d.bytes)} gz (${fmtBytes(d.rawBytes)} raw)<br>${d.s3Uri}`;
  }
  if (report.perCourse) {
    data['Per-course files'] = `${report.perCourse.count} courses · ${fmtBytes(report.perCourse.bytes)} · …/courses/&lt;CODE&gt;__&lt;slug&gt;.json`;
  }
  if (report.prune) {
    data['Retention'] = `${report.prune.retentionDays} days · kept ${report.prune.kept.length} nightly folder(s)` +
      (report.prune.prunedFolders.length ? ` · pruned ${report.prune.prunedFolders.join(', ')} (${report.prune.deletedObjects} objects)` : ' · nothing pruned');
  }
  data['Duration'] = `${(report.ms / 1000).toFixed(1)} s`;
  data['Restore one course'] = 'node src/scripts/restoreCourse.js --key=&lt;per-course S3 key&gt; --apply';
  await sendAdminAlert('db_backup', data);
  return true;
}

/** Email notice for the weekly digest job. */
export async function emailWeeklyDigestNotice(report) {
  if (!process.env.RESEND_API_KEY) return false;
  if (!report.ok) {
    await sendAdminAlert('db_backup_failed', {
      'Job': 'Weekly DB backup digest',
      'Date': report.weeklyFolder,
      'Error': report.error || 'unknown',
      'Bucket': BACKUP_BUCKET || '(not configured)',
      'Prefix': `${BACKUP_PREFIX}/weekly/${report.weeklyFolder}/`,
    });
    return true;
  }
  await sendAdminAlert('db_backup', {
    'Job': 'Weekly DB backup digest',
    'Date': report.weeklyFolder,
    'Source nightly folder': report.sourceFolder,
    'Courses zipped': report.count,
    'Bucket': BACKUP_BUCKET,
    'Location': report.s3Uri,
    'Download link (7 days)': report.downloadUrl,
    'Duration': `${(report.ms / 1000).toFixed(1)} s`,
  });
  return true;
}
