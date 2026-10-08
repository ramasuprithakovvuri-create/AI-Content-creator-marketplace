import React, { useMemo, useState } from 'react';
import { Wallet, Clock, CheckCircle2, ArrowDownToLine } from 'lucide-react';
import { EngagementRequest, User } from '../types';
import { PLATFORM_FEE_PCT } from '../lib/payments';

interface Props {
  currentUser: User;
  engagements: EngagementRequest[];
  onUpdateUser: (u: User) => void;
}

const money = (n: number) => '$' + Math.round(n).toLocaleString();

export const WalletView: React.FC<Props> = ({ currentUser, engagements, onUpdateUser }) => {
  const [method, setMethod] = useState(currentUser.payout?.method || 'UPI');
  const [handle, setHandle] = useState('');
  const [withdrawn, setWithdrawn] = useState(0);
  const [history, setHistory] = useState<{ at: string; amount: number }[]>([]);
  const mine = engagements.filter((e) => e.creatorId === currentUser.id && e.status !== 'declined');

  const { pending, cleared, rows } = useMemo(() => {
    let pending = 0, cleared = 0;
    const rows = mine.map((e) => {
      const funded = e.escrow ? e.escrow.funded : e.status !== 'pending';
      const net = 1 - PLATFORM_FEE_PCT / 100;
      const approved = e.milestones.filter((m) => m.status === 'approved').reduce((s, m) => s + m.amount, 0) * net;
      const held = funded ? e.milestones.filter((m) => m.status !== 'approved').reduce((s, m) => s + m.amount, 0) * net : 0;
      pending += held; cleared += approved;
      return { e, approved, held, funded };
    });
    return { pending, cleared, rows };
  }, [mine]);

  const available = Math.max(0, cleared - withdrawn);
  const masked = currentUser.payout ? `${currentUser.payout.method} ····${currentUser.payout.handle.slice(-4)}` : 'Not set';

  const savePayout = () => {
    if (handle.trim().length < 4) return alert('Enter a valid UPI ID / account / email');
    onUpdateUser({ ...currentUser, payout: { method, handle: handle.trim() } });
    setHandle('');
  };
  const withdraw = () => {
    if (!currentUser.payout) return alert('Set up a payout method first.');
    setHistory((h) => [{ at: new Date().toLocaleString(), amount: available }, ...h]);
    setWithdrawn((w) => w + available);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1"><Wallet className="h-4 w-4" /> EARNINGS WALLET (PRIVATE)</div>
        <h2 className="text-2xl font-bold text-white">Your earnings</h2>
        <p className="text-xs text-zinc-400">Net of the {PLATFORM_FEE_PCT}% platform fee. Funds are released from escrow as the brand approves milestones.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60"><div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400"><Clock className="h-3.5 w-3.5" /> PENDING IN ESCROW</div><div className="text-2xl font-bold text-white mt-1">{money(pending)}</div></div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60"><div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400"><CheckCircle2 className="h-3.5 w-3.5" /> CLEARED EARNINGS</div><div className="text-2xl font-bold text-emerald-400 mt-1">{money(cleared)}</div></div>
        <div className="p-4 rounded-xl border border-amber-400/30 bg-amber-400/5">
          <div className="text-[11px] font-mono text-amber-400">AVAILABLE TO WITHDRAW</div>
          <div className="text-2xl font-bold text-white mt-1">{money(available)}</div>
          <button disabled={!available} onClick={withdraw} className="mt-2 px-3 py-1.5 rounded bg-amber-400 text-zinc-950 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"><ArrowDownToLine className="h-3.5 w-3.5" /> Withdraw</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <h3 className="text-sm font-bold text-white">Payout settings</h3>
          <p className="text-xs text-zinc-400">Current: {masked}</p>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-white">
            <option>UPI</option><option>Bank transfer</option><option>PayPal</option>
          </select>
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="UPI ID / account number / email" className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-white" />
          <button onClick={savePayout} className="px-3 py-1.5 rounded bg-zinc-800 text-xs text-white">Save payout method</button>
          <p className="text-[10px] text-zinc-500">Only the last 4 characters are shown after saving. Production payouts go through the gateway (RazorpayX Route / Stripe Connect).</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
          <h3 className="text-sm font-bold text-white mb-2">Payout history</h3>
          {!history.length && <p className="text-xs text-zinc-500">No withdrawals yet.</p>}
          {history.map((h, i) => <div key={i} className="flex justify-between text-xs text-zinc-300 py-1 border-b border-zinc-800"><span>{h.at}</span><span className="font-mono">{money(h.amount)}</span></div>)}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <h3 className="text-sm font-bold text-white mb-2">By project</h3>
        {!rows.length && <p className="text-xs text-zinc-500">No active projects.</p>}
        {rows.map(({ e, approved, held, funded }) => (
          <div key={e.id} className="flex flex-wrap justify-between gap-2 text-xs py-1.5 border-b border-zinc-800 text-zinc-300">
            <span>{e.briefTitle} <span className="text-zinc-500">({e.brandName})</span></span>
            <span className="font-mono">{funded ? '' : 'awaiting funding · '}escrow {money(held)} · cleared {money(approved)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
