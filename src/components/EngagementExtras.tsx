import React, { useState } from 'react';
import { EngagementRequest, User } from '../types';
import { Lock, MessageSquare, FileText, Star, ShieldCheck, Wallet } from 'lucide-react';
import { buildLicenseAgreement } from '../lib/license';
import { splitAmount } from '../lib/payments';

interface Props {
  engagement: EngagementRequest;
  currentUser: User | null;
  onOpenWorkspace: (e: EngagementRequest) => void;
  onFund: (e: EngagementRequest) => void;
  onReview: (id: string, rating: number, text: string) => void;
}

export const EngagementExtras: React.FC<Props> = ({ engagement: e, currentUser, onOpenWorkspace, onFund, onReview }) => {
  const [showAgreement, setShowAgreement] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const isBrand = currentUser?.role === 'brand';
  const funded = e.escrow ? e.escrow.funded : e.status !== 'pending' && e.status !== 'declined'; // seeded demo rows count as funded
  const { fee, net } = splitAmount(e.proposedBudget);
  const agreement = buildLicenseAgreement(e);

  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([agreement], { type: 'text/plain' }));
    a.download = `license-${e.id}.txt`;
    a.click();
  };

  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-200">
          <Wallet className="h-4 w-4 text-amber-400" />
          {funded ? (
            <span>Escrow funded{e.escrow?.cardLast4 ? ` (${e.escrow.gateway} ····${e.escrow.cardLast4})` : ''} · creator nets ${net.toLocaleString()} after ${fee.toLocaleString()} fee</span>
          ) : (
            <span className="text-amber-300">Escrow not funded yet. Work cannot start.</span>
          )}
        </div>
        {!funded && isBrand && e.status !== 'declined' && (
          <button onClick={() => onFund(e)} className="px-3 py-1.5 rounded bg-amber-400 text-zinc-950 font-bold">Fund escrow</button>
        )}
      </div>

      {e.ndaRequired && (
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <Lock className="h-4 w-4 text-amber-400" />
          {e.ndaSignedAt ? <span>NDA signed {new Date(e.ndaSignedAt).toLocaleDateString()}</span> : <span>Stealth project: creator must sign NDA when accepting</span>}
        </div>
      )}

      {e.vault && (
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          {e.vaultUnlocked ? 'Smart Delivery Box unlocked: prompts, seeds and workflow released.' : 'Smart Delivery Box locked (AES-256-GCM): opens after final payment clears.'}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => onOpenWorkspace(e)} className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" /> Private workspace
        </button>
        {e.status === 'completed' && (
          <button onClick={() => setShowAgreement(true)} className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Copyright transfer agreement
          </button>
        )}
      </div>

      {e.status === 'completed' && isBrand && !e.review && (
        <div className="pt-2 border-t border-zinc-800 space-y-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}><Star className={`h-4 w-4 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} /></button>
            ))}
          </div>
          <input value={text} onChange={(ev) => setText(ev.target.value)} placeholder="Review this creator..." className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-white" />
          <button onClick={() => onReview(e.id, rating, text)} className="px-3 py-1.5 rounded bg-amber-400 text-zinc-950 text-xs font-bold">Submit review</button>
        </div>
      )}
      {e.review && <p className="text-xs text-zinc-300">Review: {'★'.repeat(e.review.rating)} "{e.review.text}"</p>}

      {showAgreement && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <pre className="whitespace-pre-wrap text-[11px] text-zinc-200 font-mono">{agreement}</pre>
            <div className="flex gap-2 mt-4">
              <button onClick={download} className="px-3 py-1.5 rounded bg-amber-400 text-zinc-950 text-xs font-bold">Download .txt</button>
              <button onClick={() => window.print()} className="px-3 py-1.5 rounded bg-zinc-800 text-white text-xs">Print / Save PDF</button>
              <button onClick={() => setShowAgreement(false)} className="px-3 py-1.5 rounded bg-zinc-800 text-white text-xs ml-auto">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
