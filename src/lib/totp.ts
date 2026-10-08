// Real RFC 6238 TOTP (works with Google Authenticator / Microsoft Authenticator).
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateSecret(len = 20) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let bits = '';
  bytes.forEach((b) => (bits += b.toString(2).padStart(8, '0')));
  let out = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) out += ALPHA[parseInt(bits.slice(i, i + 5), 2)];
  return out;
}

function base32ToBytes(s: string) {
  let bits = '';
  for (const c of s.toUpperCase().replace(/=+$/, '')) {
    const v = ALPHA.indexOf(c);
    if (v >= 0) bits += v.toString(2).padStart(5, '0');
  }
  const out = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < out.length; i++) out[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  return out;
}

export async function totp(secret: string, at = Date.now(), step = 30) {
  const counter = Math.floor(at / 1000 / step);
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);
  const key = await crypto.subtle.importKey('raw', base32ToBytes(secret) as BufferSource, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const h = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf));
  const o = h[h.length - 1] & 15;
  const code = (((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1_000_000;
  return String(code).padStart(6, '0');
}

export async function verifyTotp(secret: string, code: string) {
  for (const drift of [-1, 0, 1]) {
    if ((await totp(secret, Date.now() + drift * 30000)) === code.trim()) return true;
  }
  return false;
}

export const otpauthUri = (secret: string, account: string) =>
  `otpauth://totp/Kampus%20AI%20Market:${encodeURIComponent(account)}?secret=${secret}&issuer=Kampus%20AI%20Market`;
