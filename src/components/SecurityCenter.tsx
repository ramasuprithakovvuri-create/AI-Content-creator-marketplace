import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Building2, Link2, CheckCircle2 } from 'lucide-react';
import { User, VerificationSignal } from '../types';
import { generateSecret, otpauthUri, verifyTotp } from '../lib/totp';

interface Props {
  currentUser: User;
  onUpdateUser: (u: User) => void;
}

const FREE_MAIL = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me', 'protonmail.com'];
const HUBS: { key: string; label: string; host: string; type: VerificationSignal['type'] }[] = [
  { key: 'behance', label: 'Behance', host: 'behance.net', type: 'workflow_verified' },
  { key: 'artstation', label: 'ArtStation', host: 'artstation.com', type: 'workflow_verified' },
  { key: 'github', label: 'GitHub', host: 'github.com', type: 'tool_verified' },
  { key: 'huggingface', label: 'Hugging Face', host: 'huggingface.co', type: 'tool_verified' },
  { key: 'civitai', label: 'Civitai', host: 'civitai.com', type: 'tool_verified' },
];

export const SecurityCenter: React.FC<Props> = ({ currentUser: u, onUpdateUser }) => {
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [hubs, setHubs] = useState<Record<string, string>>(u.hubs || {});
  const [domain, setDomain] = useState(u.ssoDomain || '');
  const emailDomain = u.email.split('@')[1]?.toLowerCase() || '';
  const corporate = emailDomain && !FREE_MAIL.includes(emailDomain);

  const confirm2fa = async () => {
    if (await verifyTotp(secret, code)) {
      onUpdateUser({ ...u, twoFactorEnabled: true, twoFactorSecret: secret });
      setSecret(''); setCode(''); setMsg('Two-factor authentication is on.');
    } else setMsg('Code did not match. Try the current code in your app.');
  };

  const verifyHub = (h: (typeof HUBS)[number]) => {
    const url = (hubs[h.key] || '').trim();
    let ok = false;
    try { ok = new URL(url).hostname.replace('www.', '').endsWith(h.host); } catch { ok = false; }
    if (!ok) return setMsg(`Enter a valid ${h.label} profile URL (https://${h.host}/...)`);
    const signal: VerificationSignal = {
      id: `hub-${h.key}`, type: h.type, title: `${h.label} profile linked`, issuer: h.label,
      verifiedDate: new Date().toISOString().split('T')[0],
      proofDetails: `Profile URL linked: ${url}. Ownership check (OAuth / bio code) runs in production.`, iconName: 'link',
    };
    const profile = u.creatorProfile;
    onUpdateUser({
      ...u, hubs: { ...hubs },
      creatorProfile: profile ? { ...profile, verificationSignals: [...profile.verificationSignals.filter((s) => s.id !== signal.id), signal] } : profile,
    });
    setMsg(`${h.label} linked. A verification badge was added to your profile.`);
  };

  const posture = [
    ['Delivery box encryption (AES-256-GCM)', 'Live in demo', true],
    ['Two-factor authentication (TOTP)', 'Live in demo', true],
    ['Card tokenization (raw card never stored)', 'Live in demo', true],
    ['Workspace access limited to the two parties', 'Live in demo', true],
    ['Row-level security in the database', 'Production: Postgres RLS / Mongo access rules', false],
    ['Verified-email OAuth (Google, Discord, GitHub)', 'Requires OAuth credentials and MongoDB', false],
    ['Encryption at rest for all stored data', 'Production: managed DB encryption (AES-256)', false],
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1"><ShieldCheck className="h-4 w-4" /> SECURITY & INTEGRATIONS</div>
        <h2 className="text-2xl font-bold text-white">Account security</h2>
      </div>
      {msg && <div className="p-2.5 rounded border border-amber-400/30 bg-amber-400/5 text-xs text-amber-200">{msg}</div>}

      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><KeyRound className="h-4 w-4 text-amber-400" /> Two-factor authentication</h3>
        {u.twoFactorEnabled ? (
          <div className="flex items-center gap-3 text-xs text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Enabled. You will be asked for a code at login.
            <button onClick={() => onUpdateUser({ ...u, twoFactorEnabled: false, twoFactorSecret: undefined })} className="ml-auto px-3 py-1 rounded bg-zinc-800 text-white">Disable</button>
          </div>
        ) : !secret ? (
          <button onClick={() => setSecret(generateSecret())} className="px-3 py-1.5 rounded bg-amber-400 text-zinc-950 text-xs font-bold">Set up authenticator</button>
        ) : (
          <div className="space-y-2 text-xs text-zinc-300">
            <p>Add this key in Google Authenticator or Microsoft Authenticator (Enter a setup key), then type the 6-digit code.</p>
            <code className="block p-2 rounded bg-zinc-950 border border-zinc-800 text-amber-300 break-all">{secret}</code>
            <p className="text-[10px] text-zinc-500 break-all">{otpauthUri(secret, u.email)}</p>
            <div className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" className="px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-white w-32" />
              <button onClick={confirm2fa} disabled={code.length !== 6} className="px-3 py-1.5 rounded bg-amber-400 text-zinc-950 font-bold disabled:opacity-40">Confirm</button>
            </div>
          </div>
        )}
      </div>

      {u.role === 'brand' && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2 text-xs text-zinc-300">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Building2 className="h-4 w-4 text-amber-400" /> Corporate identity & SSO</h3>
          <p>Account email <b className="text-white">{u.email}</b>: {corporate ? <span className="text-emerald-400">business domain</span> : <span className="text-red-400">free-mail domain. Use name@company.com for enterprise features</span>}</p>
          <div className="flex gap-2">
            <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Company domain, e.g. acme.com" className="flex-1 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-white" />
            <button onClick={() => { onUpdateUser({ ...u, ssoDomain: domain.trim() }); setMsg('SSO domain saved.'); }} className="px-3 py-1.5 rounded bg-zinc-800 text-white">Save</button>
          </div>
          <p className="text-zinc-500">Microsoft Entra ID sign-in is not configured.</p>
        </div>
      )}

      {u.role === 'creator' && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Link2 className="h-4 w-4 text-amber-400" /> Creative hub integrations</h3>
          {HUBS.map((h) => (
            <div key={h.key} className="flex items-center gap-2">
              <span className="w-24 text-zinc-300">{h.label}</span>
              <input value={hubs[h.key] || ''} onChange={(e) => setHubs({ ...hubs, [h.key]: e.target.value })} placeholder={`https://${h.host}/yourname`} className="flex-1 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-white" />
              <button onClick={() => verifyHub(h)} className="px-3 py-1.5 rounded bg-zinc-800 text-white">{u.creatorProfile?.verificationSignals.some((s) => s.id === `hub-${h.key}`) ? 'Linked' : 'Verify'}</button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <h3 className="text-sm font-bold text-white mb-2">Security posture</h3>
        {posture.map(([name, status, live]) => (
          <div key={name} className="flex justify-between gap-3 text-xs py-1.5 border-b border-zinc-800 last:border-0">
            <span className="text-zinc-200">{name}</span>
            <span className={live ? 'text-emerald-400' : 'text-zinc-500'}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
