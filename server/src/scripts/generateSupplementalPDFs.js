// generateSupplementalPDFs.js
// Converts all supplemental HTML handouts to PDF using Puppeteer.
// Run from server/ directory: node src/scripts/generateSupplementalPDFs.js
// Requires: npm install puppeteer (in server/)

import puppeteer from 'puppeteer';
import { readdir, access } from 'fs/promises';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SUPPLEMENTAL_DIR = resolve(__dirname, '../../../client/public/supplemental');

async function generatePDFs() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const slugDirs = await readdir(SUPPLEMENTAL_DIR, { withFileTypes: true });
    const courses = slugDirs.filter(d => d.isDirectory()).map(d => d.name);

    console.log(`Found ${courses.length} courses in supplemental directory.\n`);

    const results = [];

    for (const slug of courses) {
      const htmlPath = join(SUPPLEMENTAL_DIR, slug, 'handout.html');
      const pdfPath = join(SUPPLEMENTAL_DIR, slug, 'handout.pdf');

      try {
        await access(htmlPath);
      } catch {
        console.warn(`⚠️  No handout.html found for ${slug} — skipping`);
        continue;
      }

      const fileUrl = `file://${htmlPath}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });

      await page.pdf({
        path: pdfPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
      });

      console.log(`✅  ${slug} → handout.pdf`);
      results.push({ slug, pdfPath });
    }

    console.log(`\nDone. ${results.length} PDFs generated in client/public/supplemental/`);
  } finally {
    if (browser) await browser.close();
  }
}

generatePDFs().catch(e => { console.error(e); process.exit(1); });
