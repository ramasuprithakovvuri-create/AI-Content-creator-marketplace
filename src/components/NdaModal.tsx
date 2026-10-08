import React, { useState } from 'react';
import { EngagementRequest } from '../types';
import { Lock, X } from 'lucide-react';

interface Props {
  engagement: EngagementRequest;
  creatorName: string;
  onSign: (engagementId: string) => void;
  onClose: () => void;
}

export const NdaModal: React.FC<Props> = ({ engagement, creatorName, onSign, onClose }) => {
  const [agree, setAgree] = useState(false);
  const [typed, setTyped] = useState('');
  const ok = agree && typed.trim().toLowerCase() === creatorName.trim().toLowerCase();
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2"><Lock className="h-4 w-4" /> STEALTH PROJECT NDA</div>
        <h3 className="text-lg font-bold text-white">Mutual Non-Disclosure Agreement</h3>
        <p className="text-xs text-zinc-400 mt-1">Project: {engagement.briefTitle} · Brand: {engagement.brandName}</p>
        <div className="mt-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-1.5 max-h-48 overflow-y-auto">
          <p>1. You will keep all brief details, unreleased logos, products and assets strictly confidential.</p>
          <p>2. You will not publish, post, or use the work in your portfolio before the brand's public release.</p>
          <p>3. You will not use the project materials to train or fine-tune any model other than for this project.</p>
          <p>4. These duties survive for 24 months after project completion.</p>
          <p className="text-zinc-500">Template text. Have counsel review before real use.</p>
        </div>
        <label className="flex items-center gap-2 mt-3 text-xs text-zinc-200"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I have read and agree to the terms above</label>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={`Type your full name to sign: ${creatorName}`}
          className="w-full mt-2 px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white"
        />
        <button disabled={!ok} onClick={() => onSign(engagement.id)} className="w-full mt-3 py-2 rounded bg-amber-400 text-zinc-950 font-bold text-sm disabled:opacity-40">
          Sign NDA & Accept Project
        </button>
      </div>
    </div>
  );
};
