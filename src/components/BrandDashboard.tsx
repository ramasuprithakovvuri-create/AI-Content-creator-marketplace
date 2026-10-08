import React from 'react';
import { User, CreativeBrief, EngagementRequest } from '../types';
import { 
  Building2, 
  Sparkles, 
  FileText, 
  Users, 
  Layers, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  DollarSign
} from 'lucide-react';

interface BrandDashboardProps {
  currentUser: User;
  briefs: CreativeBrief[];
  engagements: EngagementRequest[];
  onOpenBriefBuilder: () => void;
  onExploreCreatorsForBrief: (brief: CreativeBrief) => void;
  onViewAllCreators: () => void;
  onViewEngagements: () => void;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({
  currentUser,
  briefs,
  engagements,
  onOpenBriefBuilder,
  onExploreCreatorsForBrief,
  onViewAllCreators,
  onViewEngagements
}) => {
  const brandProfile = currentUser.brandProfile;
  const brandBriefs = briefs.filter(b => b.brandId === currentUser.id);
  const brandEngagements = engagements.filter(e => e.brandId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Brand Hero Welcome Banner */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatarUrl}
              alt=""
              className="h-16 w-16 rounded-xl object-cover border border-zinc-700 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                  ENTERPRISE BRAND
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {brandProfile?.industry || 'Consumer Innovation'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {brandProfile?.brandName || currentUser.name}
              </h1>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                {brandProfile?.purpose || 'Commissioning breakthrough generative campaigns with verified AI creators.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenBriefBuilder}
              className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-amber-400/20 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 fill-zinc-950" />
              <span>Launch AI Brief Builder</span>
            </button>
          </div>
        </div>

        {/* Expected Creator Features (Saved during sign-in) */}
        {brandProfile?.expectedFeatures && brandProfile.expectedFeatures.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-800/80">
            <span className="text-[11px] font-mono text-zinc-400 uppercase block mb-1.5">
              Production Standards & Required Deliverable Features:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {brandProfile.expectedFeatures.map((feat, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3 w-3 text-amber-400" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase">Published Briefs</span>
          <p className="text-2xl font-bold font-mono text-white">{brandBriefs.length}</p>
          <span className="text-[10px] text-zinc-500">Live for creator submissions</span>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase">Active Engagements</span>
          <p className="text-2xl font-bold font-mono text-amber-400">{brandEngagements.length}</p>
          <span className="text-[10px] text-zinc-500">Production sprints in escrow</span>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase">Escrow Total Committed</span>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            ${brandEngagements.reduce((acc, curr) => acc + curr.proposedBudget, 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-zinc-500">Protected milestone releases</span>
        </div>
      </div>

      {/* Active Creative Briefs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Your Creative Campaign Briefs</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Briefs built with Gemini AI or structured manually.
            </p>
          </div>

          <button
            onClick={onOpenBriefBuilder}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Brief</span>
          </button>
        </div>

        {brandBriefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandBriefs.map((brief) => (
              <div
                key={brief.id}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded">
                      {brief.contentType}
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      ${brief.budget.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{brief.title}</h3>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {brief.conceptSummary}
                  </p>

                  <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                    <div className="truncate">
                      <span className="text-zinc-500 font-mono">Models: </span>
                      {brief.recommendedModelStack.join(' · ')}
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono">Timeline: </span>
                      {brief.timeline}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                  <button
                    onClick={() => onExploreCreatorsForBrief(brief)}
                    className="flex-1 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Match Verified Creators</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <FileText className="h-8 w-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No creative briefs published yet.</p>
            <button
              onClick={onOpenBriefBuilder}
              className="px-4 py-2 rounded-md bg-amber-400 text-zinc-950 font-bold text-xs"
            >
              Build Your First Brief with Gemini
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
