import React, { useState } from 'react';
import { CreativeBrief, User } from '../types';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Clock, 
  DollarSign, 
  Cpu, 
  Layers, 
  Search, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface BriefsListViewProps {
  briefs: CreativeBrief[];
  currentUser: User | null;
  onOpenBriefBuilder: () => void;
  onExploreCreatorsForBrief: (brief: CreativeBrief) => void;
}

export const BriefsListView: React.FC<BriefsListViewProps> = ({
  briefs,
  currentUser,
  onOpenBriefBuilder,
  onExploreCreatorsForBrief
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedBrief, setSelectedBrief] = useState<CreativeBrief | null>(null);

  const filteredBriefs = briefs.filter(b => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.conceptSummary.toLowerCase().includes(q) ||
      b.brandName.toLowerCase().includes(q) ||
      b.recommendedModelStack.some(m => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1">
            <FileText className="h-3.5 w-3.5" />
            <span>{currentUser?.role === 'creator' ? 'BRAND CAMPAIGNS' : 'ENTERPRISE CREATIVE BRIEFS'}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {currentUser?.role === 'creator' ? 'Brands Looking for AI Creators' : 'Active Campaign Briefs & RFP Directory'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            {currentUser?.role === 'creator'
              ? 'Explore published brand requests for promotional videos and creative campaigns, including budgets, formats, and production requirements.'
              : 'Structured creative briefs defining campaign objectives, camera movements, recommended model stacks, and commercial buyout terms.'}
          </p>
        </div>

        {currentUser?.role === 'brand' && (
          <button
            onClick={onOpenBriefBuilder}
            className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-amber-400/20 flex items-center gap-2 shrink-0"
          >
            <Sparkles className="h-4 w-4 fill-zinc-950" />
            <span>Create Brief with Gemini</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter briefs by title, model (Runway, Kling), or keyword..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Briefs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBriefs.map((brief) => (
          <div
            key={brief.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={brief.brandLogo}
                    alt=""
                    className="h-8 w-8 rounded-lg object-cover border border-zinc-700"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 block">
                      {brief.brandName}
                    </span>
                    <h3 className="font-bold text-base text-white">{brief.title}</h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-base font-bold text-emerald-400">
                    ${brief.budget.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">{brief.timeline}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                {brief.conceptSummary}
              </p>

              {/* Recommended Models */}
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                  Recommended Model Pipeline
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brief.recommendedModelStack.map((m, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formats and Licensing */}
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 pt-1">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Aspect Ratios</span>
                  <span className="text-zinc-300 text-[11px] truncate block">{brief.aspectRatios.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Licensing</span>
                  <span className="text-emerald-400 text-[11px] truncate block flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Commercial Buyout</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
              <button
                onClick={() => setSelectedBrief(brief)}
                className={`${currentUser?.role === 'brand' ? 'flex-1' : 'w-full'} py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors`}
              >
                {currentUser?.role === 'creator' ? 'View Campaign Details' : 'Inspect Brief Specs'}
              </button>

              {currentUser?.role === 'brand' && (
                <button
                  onClick={() => onExploreCreatorsForBrief(brief)}
                  className="flex-1 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Match Creators</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBriefs.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
          <h2 className="text-base font-bold text-white">
            {currentUser?.role === 'creator' || !currentUser
              ? 'No published brand campaigns yet'
              : 'No campaigns match your search'}
          </h2>
          <p className="mt-2 text-xs text-zinc-400">
            {currentUser?.role === 'creator'
              ? 'Published brand requests will appear here when they are looking for creators.'
              : currentUser?.role === 'brand'
                ? 'Try another search or create a campaign brief.'
                : 'Published campaigns will appear here when brands share them with creators.'}
          </p>
        </div>
      )}

      {/* Brief Detail Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-4 shadow-2xl">
            <button
              onClick={() => setSelectedBrief(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-mono uppercase text-amber-400">
                {selectedBrief.brandName} · Creative Brief
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{selectedBrief.title}</h2>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {selectedBrief.conceptSummary}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Visual Style & Direction</span>
                <p className="text-zinc-200 mt-0.5">{selectedBrief.visualStyle}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Prompt Engineering Directives</span>
                <p className="text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded border border-zinc-800 mt-0.5 leading-relaxed">
                  {selectedBrief.promptGuidelines}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Budget</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">
                    ${selectedBrief.budget.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Timeline</span>
                  <span className="text-zinc-300 text-xs">{selectedBrief.timeline}</span>
                </div>
              </div>
            </div>

            {currentUser?.role === 'brand' && (
              <button
                onClick={() => {
                  const b = selectedBrief;
                  setSelectedBrief(null);
                  onExploreCreatorsForBrief(b);
                }}
                className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <span>Match Creators For This Brief</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
