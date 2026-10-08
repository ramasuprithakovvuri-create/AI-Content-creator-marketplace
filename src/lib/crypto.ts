// Real AES-256-GCM using the browser WebCrypto API (works on localhost / https).
const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
};
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(secret: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export const randomSecret = () => toB64(crypto.getRandomValues(new Uint8Array(24)));

export async function encryptText(plain: string, secret: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret, salt);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, enc.encode(plain));
  return { cipher: toB64(cipher), iv: toB64(iv), salt: toB64(salt) };
}

export async function decryptText(v: { cipher: string; iv: string; salt: string }, secret: string) {
  const key = await deriveKey(secret, fromB64(v.salt));
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(v.iv) as BufferSource },
    key,
    fromB64(v.cipher) as BufferSource
  );
  return dec.decode(plain);
}
