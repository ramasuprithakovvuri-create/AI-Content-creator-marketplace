import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { verifyTotp } from '../lib/totp';

export const TwoFactorModal: React.FC<{ user: User; onVerified: (u: User) => void; onCancel: () => void }> = ({ user, onVerified, onCancel }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const check = async () => {
    if (await verifyTotp(user.twoFactorSecret || '', code)) onVerified(user);
    else setErr('Wrong or expired code. Check your authenticator app.');
  };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono"><ShieldCheck className="h-4 w-4" /> TWO-FACTOR AUTHENTICATION</div>
        <p className="text-sm text-white">Enter the 6-digit code from your authenticator app for {user.email}.</p>
        <input autoFocus value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} onKeyDown={(e) => e.key === 'Enter' && check()} placeholder="000000" className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-center tracking-[0.5em] text-lg text-white" />
        {err && <p className="text-xs text-red-400">{err}</p>}
        <div className="flex gap-2">
          <button onClick={check} disabled={code.length !== 6} className="flex-1 py-2 rounded bg-amber-400 text-zinc-950 font-bold text-sm disabled:opacity-40">Verify</button>
          <button onClick={onCancel} className="px-4 py-2 rounded bg-zinc-800 text-sm text-white">Cancel</button>
        </div>
      </div>
    </div>
  );
};
