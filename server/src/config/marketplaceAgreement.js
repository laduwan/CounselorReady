/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Single source of truth for the current Partner Marketplace Agreement version. The server stamps
 * THIS version on acceptance (never trusts the client's value beyond confirming it matches), so the
 * acceptance record always reflects the terms actually in force.
 *
 * When the agreement text changes materially, bump `version` and `effectiveDate` (and optionally set
 * `documentSha256` to the hash of the published agreement for proof-of-content). Partners with an
 * older accepted version will be prompted to re-accept before changing their marketplace settings.
 */
export const MARKETPLACE_AGREEMENT = {
  version: '1.0',
  effectiveDate: '2026-06-11',
  // Public URL where the current agreement text is published for partners to read.
  url: process.env.MARKETPLACE_AGREEMENT_URL || 'https://counselorready.com/legal/partner-marketplace-agreement',
  // Optional: SHA-256 of the published agreement text, for tamper-evident proof of what was accepted.
  documentSha256: process.env.MARKETPLACE_AGREEMENT_SHA256 || null
};
