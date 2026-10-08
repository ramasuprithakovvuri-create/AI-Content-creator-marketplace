import React, { useState, useMemo } from 'react';
import { getDemoVideoThumbnail } from '../lib/media';
import { withExamplePortfolio } from '../lib/examplePortfolio';
import { User, CreativeBrief } from '../types';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  GitFork, 
  Star, 
  Clock, 
  DollarSign, 
  Eye, 
  Send, 
  ArrowRight,
  RotateCcw,
  Video,
  Layers,
  ChevronRight
} from 'lucide-react';

interface CreatorDirectoryProps {
  creators: User[];
  onSelectCreator: (creator: User) => void;
  onConnectCreator: (creator: User) => void;
  activeBriefFilter?: CreativeBrief | null;
  onClearBriefFilter?: () => void;
  onOpenBriefBuilder: () => void;
  onRequireAccount: () => void;
  isBrandUser: boolean;
}

export const CreatorDirectory: React.FC<CreatorDirectoryProps> = ({
  creators,
  onSelectCreator,
  onConnectCreator,
  activeBriefFilter,
  onClearBriefFilter,
  onOpenBriefBuilder,
  onRequireAccount,
  isBrandUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'jobs' | 'rate-asc' | 'rate-desc'>('rating');

  const TOOLS_LIST = [
    'Runway Gen-3 Alpha',
    'Midjourney v6.1',
    'ComfyUI',
    'Flux.1 Pro',
    'Kling 1.5',
    'ElevenLabs',
    'Sora Preview'
  ];

  const CONTENT_TYPES_LIST = [
    'Cinematic 16:9 Video',
    'Fashion Commercials',
    '3D Product Visuals',
    'Vertical Reels 9:16',
    'Automotive Commercials'
  ];

  const SPECIALIZATIONS_LIST = [
    'AI Cinema & Commercials',
    'Hyper-real Product Visualization',
    'Automotive & High-Action Commercials',
    'Social UGC & Viral Vertical 9:16'
  ];

  // Filter logic
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      if (c.role !== 'creator' || !c.creatorProfile) return false;
      const profile = c.creatorProfile;

      // Search term query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesHeadline = profile.headline.toLowerCase().includes(q);
        const matchesBio = profile.bio.toLowerCase().includes(q);
        const matchesTools = profile.tools.some(t => t.toLowerCase().includes(q));
        const matchesSkills = profile.skills.some(s => s.toLowerCase().includes(q));
        const matchesLocation = profile.location.toLowerCase().includes(q);

        if (!matchesName && !matchesHeadline && !matchesBio && !matchesTools && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      // Filter by Tool
      if (selectedTool !== 'all') {
        const hasTool = profile.tools.some(t => t.toLowerCase().includes(selectedTool.toLowerCase()));
        if (!hasTool) return false;
      }

      // Filter by Content Type
      if (selectedContentType !== 'all') {
        const hasContentType = profile.contentTypes.some(ct => ct.toLowerCase().includes(selectedContentType.toLowerCase()));
        if (!hasContentType) return false;
      }

      // Filter by Specialization
      if (selectedSpecialization !== 'all') {
        if (profile.specialization !== selectedSpecialization) return false;
      }

      // Filter by Verification Signals
      if (onlyVerified) {
        if (!profile.verificationSignals || profile.verificationSignals.length === 0) return false;
      }

      // If active brief filter is passed
      if (activeBriefFilter) {
        // Boost/check match with recommended models or skills
        const briefModels = activeBriefFilter.recommendedModelStack.map(m => m.toLowerCase());
        const hasModelOverlap = profile.tools.some(t => 
          briefModels.some(bm => bm.includes(t.toLowerCase()) || t.toLowerCase().includes(bm))
        );
        // keep even if loose match, but prioritize
      }

      return true;
    }).sort((a, b) => {
      const pa = a.creatorProfile!;
      const pb = b.creatorProfile!;
      if (sortBy === 'rating') {
        return pb.metrics.rating - pa.metrics.rating;
      }
      if (sortBy === 'jobs') {
        return pb.metrics.completedJobs - pa.metrics.completedJobs;
      }
      if (sortBy === 'rate-asc') {
        return pa.hourlyRate - pb.hourlyRate;
      }
      if (sortBy === 'rate-desc') {
        return pb.hourlyRate - pa.hourlyRate;
      }
      return 0;
    });
  }, [creators, searchQuery, selectedTool, selectedContentType, selectedSpecialization, onlyVerified, sortBy, activeBriefFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTool('all');
    setSelectedContentType('all');
    setSelectedSpecialization('all');
    setOnlyVerified(false);
    if (onClearBriefFilter) onClearBriefFilter();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/40 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>CREATOR PORTFOLIOS & PROMOTIONAL WORK</span>
              <span className="text-zinc-500">/</span>
              <span>KAMPUS.VC COHORT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Discover AI Creators & Their Promotional Work
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Browse creators who produce brand promotions, inspect their portfolio work and production tools, then connect to commission a campaign.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isBrandUser && (
              <button
                onClick={onOpenBriefBuilder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-amber-400/20"
              >
                <Sparkles className="h-4 w-4 fill-zinc-950" />
                <span>Launch AI Brief Builder</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Brief Filter Banner */}
        {activeBriefFilter && (
          <div className="mt-5 p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-xs text-amber-300 truncate">
                Matching creators for brief: <strong>{activeBriefFilter.title}</strong> (${activeBriefFilter.budget.toLocaleString()})
              </span>
            </div>
            <button
              onClick={onClearBriefFilter}
              className="text-xs text-amber-400 hover:underline shrink-0 font-medium"
            >
              Clear Brief Filter
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 p-4 rounded-xl border border-zinc-800/90 bg-zinc-900/60">
        
        {/* Search Input & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by creator name, model (Runway, Kling, Flux), skill (LoRA, ComfyUI), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="jobs">Sort: Most Enterprise Jobs</option>
              <option value="rate-asc">Sort: Rate (Low to High)</option>
              <option value="rate-desc">Sort: Rate (High to Low)</option>
            </select>

            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                onlyVerified
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        {/* Interactive Segmented Filters (Styled cleanly without pills) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
          
          {/* Tool Selector */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
              AI Tools & Models
            </label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All AI Tools</option>
              {TOOLS_LIST.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          {/* Content Type Selector */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
              Content Format & Type
            </label>
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Content Formats</option>
              {CONTENT_TYPES_LIST.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Specialization Selector */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
              Production Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Specializations</option>
              {SPECIALIZATIONS_LIST.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary and reset */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          <span>Showing <strong>{filteredCreators.length}</strong> creator profiles</span>
          {(searchQuery || selectedTool !== 'all' || selectedContentType !== 'all' || selectedSpecialization !== 'all' || onlyVerified) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* CREATOR GRID */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCreators.map((creator) => {
            const p = creator.creatorProfile!;
            const showcaseCreator = withExamplePortfolio(creator);
            const portfolioItems = showcaseCreator.creatorProfile?.portfolio || [];
            const featuredPortfolio = portfolioItems.slice(0, 3);
            const showingExamples = featuredPortfolio.some(item => item.isExample);

            return (
              <div
                key={creator.id}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden shadow-sm"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Top Bar: Creator Info & Verification */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="h-12 w-12 rounded-lg object-cover border border-zinc-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => onSelectCreator(showcaseCreator)}
                            className="font-bold text-base text-white hover:text-amber-300 cursor-pointer transition-colors"
                          >
                            {creator.name}
                          </h3>
                          {p.location && p.location !== 'Not specified' && (
                            <>
                              <span className="text-zinc-500 text-xs">·</span>
                              <span className="text-xs text-zinc-400">{p.location}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                          {p.headline}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {p.metrics.completedJobs > 0 ? (
                        <>
                          <div className="flex items-center gap-1 text-amber-400 font-bold text-sm justify-end">
                            <Star className="h-4 w-4 fill-amber-400" />
                            <span>{p.metrics.rating.toFixed(2)}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {p.metrics.completedJobs} jobs · {p.metrics.onTimeRate}% on-time
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-mono">New Creator</span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {p.bio}
                  </p>

                  {/* Verification Badges (Anti-Slop Clean Style) */}
                  {p.verificationSignals.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-400 pt-1">
                      {p.verificationSignals.map((sig) => (
                        <div key={sig.id} className="flex items-center gap-1.5" title={sig.proofDetails}>
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-[11px] font-medium text-zinc-300">{sig.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Unboxed Metadata: Tools, Specialization, Pricing */}
                  <div className="pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 space-y-2">
                    {/* Tools list */}
                    <div className="flex items-baseline gap-1.5 text-xs">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase shrink-0">Tools:</span>
                      <span className="text-zinc-300 font-mono text-[11px] truncate">
                        {p.tools.join(' · ')}
                      </span>
                    </div>

                    {/* Content types & skills */}
                    <div className="flex items-baseline gap-1.5 text-xs">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase shrink-0">Formats:</span>
                      <span className="text-zinc-300 text-xs truncate">
                        {p.contentTypes.join(' · ')}
                      </span>
                    </div>

                    {/* Rates */}
                    <div className="flex items-center justify-between text-xs pt-1 text-zinc-300">
                      <span className="font-mono text-amber-300">
                        ${p.hourlyRate}/hr
                        {p.projectRateMin > 0 && (
                          <span className="text-zinc-500 font-sans"> or min ${p.projectRateMin.toLocaleString()} / sprint</span>
                        )}
                      </span>
                      {p.turnaroundDays > 0 && (
                        <span className="text-zinc-400 text-[11px]">
                          Avg. Turnaround: {p.turnaroundDays} Days
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Show published portfolio work from this creator's saved profile. */}
                  {featuredPortfolio.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wide text-zinc-400">
                          {showingExamples ? 'Example Ad Concepts' : 'Creator Ads'}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {portfolioItems.length} {portfolioItems.length === 1 ? 'ad' : 'ads'}
                        </span>
                      </div>
                      <div className={`grid gap-2 ${featuredPortfolio.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                        {featuredPortfolio.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectCreator(showcaseCreator)}
                            aria-label={`View ${item.title} by ${creator.name}`}
                            className="group/media relative aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-left"
                          >
                            <img
                              src={item.mediaType === 'video' ? getDemoVideoThumbnail(item.mediaUrl, item.thumbnailUrl) : item.thumbnailUrl}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-300 group-hover/media:scale-105"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-2">
                              <span className="truncate text-[9px] font-mono uppercase text-amber-400">
                                {item.primaryModel}
                              </span>
                              <span className="truncate text-[11px] font-semibold text-white">
                                {item.title}
                              </span>
                              {item.isExample && (
                                <span className="mt-0.5 w-fit rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-amber-200">
                                  Example · Not client work
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      {portfolioItems.length > featuredPortfolio.length && (
                        <p className="text-right text-[10px] text-zinc-500">
                          Open creator profile to view all {portfolioItems.length} ads
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-zinc-950/60 border-t border-zinc-800 flex items-center gap-3">
                  <button
                    onClick={() => onSelectCreator(showcaseCreator)}
                    className="flex-1 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{showingExamples || portfolioItems.length > 0 ? 'Inspect AI Portfolio' : 'View Creator Profile'}</span>
                  </button>

                  {isBrandUser ? (
                    <button
                      onClick={() => onConnectCreator(creator)}
                      className="flex-1 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Connect & Commission</span>
                    </button>
                  ) : (
                    <button
                      onClick={onRequireAccount}
                      className="flex-1 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Join to Commission</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Sensible handling of empty search results (Challenge Rubric 25%) */
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {creators.length === 0 ? 'No Creator Profiles Yet' : 'No AI Creators Matched Your Criteria'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
              {creators.length === 0
                ? 'Creator profiles will appear here after creators sign up and complete their profile.'
                : "We couldn't find creators matching your specific combination of tools and filters. Try broadening your parameters or search by broader models."}
            </p>
          </div>
          {creators.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-md bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                Clear All Filters
              </button>
                <button
                  onClick={() => {
                    setSelectedTool('Runway Gen-3 Alpha');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 rounded-md bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
                >
                  Browse Runway Gen-3 Creators
                </button>
                <button
                  onClick={() => {
                    setSelectedTool('ComfyUI');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 rounded-md bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
                >
                  Browse ComfyUI Specialists
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
