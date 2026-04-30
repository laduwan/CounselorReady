import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';

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

export function verifyBackupCode(storedCodes, submitted) {
  if (!Array.isArray(storedCodes) || !submitted) return -1;
  const normalized = String(submitted).trim().toUpperCase();
  return storedCodes.findIndex(c => c === normalized);
}
