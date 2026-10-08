import React, { useState } from 'react';
import { CreditCard, X, Lock, Loader2 } from 'lucide-react';
import { EngagementRequest, EscrowInfo } from '../types';
import { PLATFORM_FEE_PCT, luhn, splitAmount, tokenize } from '../lib/payments';

interface Props {
  engagement: EngagementRequest;
  onPaid: (engagementId: string, escrow: EscrowInfo) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<Props> = ({ engagement, onPaid, onClose }) => {
  const [gateway, setGateway] = useState<'Razorpay' | 'Stripe'>('Razorpay');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { fee, net } = splitAmount(engagement.proposedBudget);

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!luhn(card)) return setErr('Card number is not valid. Test card: 4242 4242 4242 4242');
    if (!/^\d{2}\/\d{2}$/.test(exp)) return setErr('Expiry must be MM/YY');
    if (!/^\d{3,4}$/.test(cvc)) return setErr('CVC must be 3-4 digits');
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulated processor round-trip
    const { token, last4 } = tokenize(gateway, card);
    setCard(''); setCvc(''); // raw card data is dropped immediately
    onPaid(engagement.id, { funded: true, gateway, paymentToken: token, cardLast4: last4, platformFeePct: PLATFORM_FEE_PCT, fundedAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <form onSubmit={pay} className="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono"><Lock className="h-4 w-4" /> SECURE ESCROW FUNDING · TEST MODE</div>
        <h3 className="text-lg font-bold text-white">Fund escrow for "{engagement.briefTitle}"</h3>

        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-zinc-400">Project total (held in escrow)</span><span className="text-white font-mono">${engagement.proposedBudget.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-zinc-400">Platform fee ({PLATFORM_FEE_PCT}%)</span><span className="text-zinc-300 font-mono">${fee.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-zinc-400">Creator receives on approval</span><span className="text-emerald-400 font-mono">${net.toLocaleString()}</span></div>
        </div>

        <select value={gateway} onChange={(e) => setGateway(e.target.value as 'Razorpay' | 'Stripe')} className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white">
          <option>Razorpay</option>
          <option>Stripe</option>
        </select>
        <input value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" placeholder="Card number" className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white" />
        <div className="grid grid-cols-2 gap-2">
          <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM/YY" className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white" />
          <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" type="password" className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white" />
        </div>
        {err && <p className="text-xs text-red-400">{err}</p>}
        <button disabled={busy} className="w-full py-2.5 rounded bg-amber-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} {busy ? 'Processing...' : `Pay $${engagement.proposedBudget.toLocaleString()} into escrow`}
        </button>
        <p className="text-[10px] text-zinc-500">
          Demo checkout: no real charge. We keep only a processor token and the last 4 digits, never the card number. In production the card form is the gateway's hosted field.
        </p>
      </form>
    </div>
  );
};
