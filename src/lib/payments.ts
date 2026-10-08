import { Milestone } from '../types';

export const PLATFORM_FEE_PCT = 20; // matches the take-rate in the venture thesis slide

export function splitAmount(amount: number) {
  const fee = Math.round((amount * PLATFORM_FEE_PCT) / 100);
  return { fee, net: amount - fee };
}

export function luhn(num: string) {
  const d = num.replace(/\D/g, '');
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// Simulates what Stripe / Razorpay do server-side: raw card number goes to the
// processor, our app only ever keeps a token + last 4 digits (PCI-DSS scope reduction).
export function tokenize(gateway: string, cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '');
  return {
    token: `tok_${gateway.toLowerCase()}_${Math.random().toString(36).slice(2, 12)}`,
    last4: digits.slice(-4),
  };
}

export function buildMilestones(total: number): Milestone[] {
  const shares = [0.25, 0.35, 0.25, 0.15];
  const titles = ['Styleframes & seed exploration', 'Motion generation', 'Upscaling & sound', 'Master delivery & IP handover'];
  const base = Date.now();
  return shares.map((s, i) => ({
    id: `ms-${base}-${i}`,
    title: titles[i],
    dueDate: new Date(base + (i + 1) * 3 * 86400000).toISOString().split('T')[0],
    amount: Math.round(total * s),
    status: 'pending' as const,
  }));
}
