import React, { useMemo, useState } from 'react';
import { X, Zap, BadgeCheck, Send } from 'lucide-react';
import { CreativeBrief, User } from '../types';
import { matchCreators } from '../lib/matchmaking';

interface Props {
  brief: CreativeBrief;
  creators: User[];
  invitedIds: string[];
  onInvite: (creator: User, brief: CreativeBrief) => void;
  onClose: () => void;
}

export const MatchmakingPanel: React.FC<Props> = ({ brief, creators, invitedIds, onInvite, onClose }) => {
  const [count, setCount] = useState<5 | 10>(5);
  const matches = useMemo(() => matchCreators(brief, creators, count), [brief, creators, count]);
  const pending = matches.filter((m) => !invitedIds.includes(m.creator.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-2">
          <Zap className="h-3.5 w-3.5" /> INTELLIGENT MATCHMAKING
        </div>
        <h2 className="text-xl font-bold text-white">Top creators for "{brief.title}"</h2>
        <p className="text-xs text-zinc-400 mt-1">Ranked by tool overlap, skills, style fit, certification, budget fit and track record.</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 text-xs">
            {[5, 10].map((n) => (
              <button key={n} onClick={() => setCount(n as 5 | 10)} className={`px-3 py-1 rounded border ${count === n ? 'border-amber-400 text-amber-300' : 'border-zinc-700 text-zinc-400'}`}>
                Top {n}
              </button>
            ))}
          </div>
          <button
            disabled={!pending.length}
            onClick={() => pending.forEach((m) => onInvite(m.creator, brief))}
            className="px-3 py-1.5 rounded bg-amber-400 text-zinc-950 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" /> Invite all {pending.length}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {matches.map((m) => {
            const invited = invitedIds.includes(m.creator.id);
            return (
              <div key={m.creator.id} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/60">
                <img src={m.creator.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {m.creator.name}
                    {m.certified && <BadgeCheck className="h-4 w-4 text-emerald-400" />}
                    <span className="text-[10px] font-mono text-amber-400">{m.pct}% match</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">{m.reasons.join(' · ') || 'General fit'}</div>
                </div>
                <button
                  disabled={invited}
                  onClick={() => onInvite(m.creator, brief)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${invited ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'}`}
                >
                  {invited ? 'Invited' : 'Invite'}
                </button>
              </div>
            );
          })}
          {!matches.length && <p className="text-sm text-zinc-400">No creators in the pool yet.</p>}
        </div>
      </div>
    </div>
  );
};
