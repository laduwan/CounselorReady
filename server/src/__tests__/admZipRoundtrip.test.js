/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
/**
 * Regression net for the adm-zip 0.5 -> 0.6 upgrade (high-sev: crafted ZIP -> 4GB
 * allocation). It exercises the exact adm-zip surface that routes/scorm.js,
 * utils/scorm.js, and services/auditBinderService.js depend on — WITHOUT editing
 * those files — so a future breaking bump that changes this contract is caught here.
 *
 * Contract used by those three files:
 *   new AdmZip()            (utils/scorm.js:333, auditBinderService.js:101)
 *   zip.addFile(name, buf)  (utils/scorm.js:337, auditBinderService.js:132…)
 *   zip.toBuffer()          (utils/scorm.js:352, auditBinderService.js:173)
 *   new AdmZip(buffer)      (routes/scorm.js:31)
 *   zip.getEntries()        (routes/scorm.js:32)
 *   entry.entryName         (routes/scorm.js:35-37)
 *   entry.getData()         (routes/scorm.js:45)
 */
import { describe, it, expect } from 'vitest';
import AdmZip from 'adm-zip';

describe('adm-zip roundtrip (scorm / auditBinder contract)', () => {
  const files = [
    { name: 'imsmanifest.xml', content: '<manifest>hello</manifest>' },
    { name: 'lessons/lesson_1.html', content: '<html><body>Lesson 1 — CE content ✓</body></html>' },
    { name: 'training-record.csv', content: 'name,date\nJane Doe,2026-07-26' },
  ];

  it('builds a zip in memory and reads the same names + content back', () => {
    // Build (mirrors utils/scorm.js + auditBinderService.js)
    const zipOut = new AdmZip();
    for (const f of files) {
      zipOut.addFile(f.name, Buffer.from(f.content, 'utf8'));
    }
    const buffer = zipOut.toBuffer();
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);

    // Read back (mirrors routes/scorm.js)
    const zipIn = new AdmZip(buffer);
    const entries = zipIn.getEntries();

    expect(entries.map(e => e.entryName).sort()).toEqual(files.map(f => f.name).sort());

    for (const f of files) {
      const entry = entries.find(e => e.entryName === f.name);
      expect(entry, `entry ${f.name} present`).toBeTruthy();
      expect(entry.getData().toString('utf8')).toBe(f.content);
    }
  });

  it('locates a manifest entry the way routes/scorm.js does', () => {
    const zip = new AdmZip();
    zip.addFile('sub/imsmanifest.xml', Buffer.from('<manifest/>', 'utf8'));
    const reread = new AdmZip(zip.toBuffer());
    const manifestEntry = reread.getEntries().find(e =>
      e.entryName.toLowerCase() === 'imsmanifest.xml' ||
      e.entryName.toLowerCase().endsWith('/imsmanifest.xml')
    );
    expect(manifestEntry).toBeTruthy();
    expect(manifestEntry.getData().toString('utf8')).toBe('<manifest/>');
  });
});
