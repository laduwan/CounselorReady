import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const ISSUER = 'CounselorReady';

export async function generate2FASetup(userEmail) {
  const secretObj = speakeasy.generateSecret({
    length: 20,
    name: `${ISSUER}:${userEmail}`,
    issuer: ISSUER,
  });

  const qrCodeDataUrl = await qrcode.toDataURL(secretObj.otpauth_url);

  return {
    secret:        secretObj.base32,
    otpAuthUrl:    secretObj.otpauth_url,
    qrCodeDataUrl,
  };
}

export function verify2FACode(secret, code) {
  if (!secret || !/^\d{6}$/.test(String(code))) return false;
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: String(code),
    window: 1,
  });
}

export function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const buf = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${buf.slice(0, 4)}-${buf.slice(4, 8)}`);
  }
  return codes;
}

// Hash a list of plaintext codes with bcrypt cost 12
export async function hashBackupCodes(plaintextCodes) {
  const salt = await bcrypt.genSalt(12);
  return Promise.all(plaintextCodes.map(c => bcrypt.hash(c.toUpperCase(), salt)));
}

// Verify a submitted backup code against bcrypt-hashed stored codes.
// Returns the index of the matched code (for one-time consumption), or -1.
export async function verifyBackupCode(storedHashes, submitted) {
  if (!Array.isArray(storedHashes) || !submitted) return -1;
  const normalized = String(submitted).trim().toUpperCase();
  for (let i = 0; i < storedHashes.length; i++) {
    const match = await bcrypt.compare(normalized, storedHashes[i]);
    if (match) return i;
  }
  return -1;
}
