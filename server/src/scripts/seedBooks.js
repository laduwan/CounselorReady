/**
 * seedBooks.js — seed / upsert the Books store catalog.
 * GAITP LLC · NBCC ACEP #7760
 *
 * Conventions (match the repo's standard DB scripts):
 *   - ESM, MONGODB_URI from env
 *   - DRY RUN BY DEFAULT. Writes only with --write or APPLY=1
 *   - Writes a timestamped JSON backup of the books collection before any write
 *   - updateOne with $set + upsert, keyed on slug — never .save(), never bulk-delete
 *   - Prints a summary table of what would change
 *
 * assetKey and coverUrl are intentionally left empty here — those are set
 * through the admin upload UI (private asset + public cover), not the seed.
 *
 * Run from ~/project/src/server :
 *     node src/scripts/seedBooks.js            # dry run — reports only
 *     node src/scripts/seedBooks.js --write    # apply upserts
 *     APPLY=1 node src/scripts/seedBooks.js    # apply upserts
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Book from '../models/Book.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const args = process.argv.slice(2);
const APPLY = args.includes('--write') || process.env.APPLY === '1';

// ── Placeholder catalog — Ke replaces these entries. ──────────────────────
// Leave assetKey and coverUrl empty; set them via the admin upload UI.
const BOOKS = [
  { title: '', subtitle: '', slug: '', blurb: '', description: '', price: 0,
    format: 'ebook', pageCount: 0, category: '', status: 'draft', order: 1 },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Backup the current books collection before any write.
  if (APPLY) {
    const existing = await Book.find({}).lean();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, `books-backup-${stamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2));
    console.log(`🗄️  Backed up ${existing.length} book(s) to ${backupPath}`);
  }

  const summary = [];
  for (const book of BOOKS) {
    if (!book.slug) {
      summary.push({ slug: '(missing slug)', action: 'SKIP', title: book.title || '' });
      continue;
    }
    const found = await Book.findOne({ slug: book.slug }).lean();
    const action = found ? 'UPDATE' : 'INSERT';

    if (APPLY) {
      await Book.updateOne(
        { slug: book.slug },
        { $set: book },
        { upsert: true }
      );
    }
    summary.push({ slug: book.slug, action: APPLY ? action : `${action} (dry)`, title: book.title || '' });
  }

  // Print summary table.
  console.log('\n── Summary ─────────────────────────────────');
  console.log('ACTION            SLUG                      TITLE');
  for (const r of summary) {
    console.log(`${r.action.padEnd(17)} ${String(r.slug).padEnd(25)} ${r.title}`);
  }
  console.log('────────────────────────────────────────────');
  console.log(APPLY ? '✔ Writes applied.' : '👀 Dry run — no changes written. Re-run with --write or APPLY=1 to apply.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('❌ seedBooks failed:', err);
  try { await mongoose.disconnect(); } catch (e) {}
  process.exit(1);
});
