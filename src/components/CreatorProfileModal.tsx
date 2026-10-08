import { PortfolioLab } from './PortfolioLab';
import React, { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { getDemoVideoCredit, getDemoVideoThumbnail } from '../lib/media';
import { User, PortfolioItem } from '../types';
import { 
  X, 
  Play, 
  Pause, 
  ShieldCheck, 
  Award, 
  GitFork, 
  CheckCircle2, 
  Cpu, 
  Film, 
  Lock, 
  Eye, 
  Send, 
  Star, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CreatorProfileModalProps {
  creator: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (creator: User) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  isOpen,
  onClose,
  onConnect
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !creator || !creator.creatorProfile) return null;

  const profile = creator.creatorProfile;
  const portfolio = profile.portfolio || [];
  const currentItem: PortfolioItem | undefined = portfolio[selectedItemIndex];

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Creator Header Profile Hero */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-zinc-800">
          <div className="flex items-start gap-4">
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="h-20 w-20 rounded-xl object-cover border-2 border-zinc-700 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{creator.name}</h2>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {profile.location}
                </span>
                <span className="text-xs text-zinc-500 font-mono">· {profile.experienceYears}y in Generative AI</span>
              </div>
              <p className="text-sm font-medium text-amber-400">
                {profile.headline}
              </p>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed pt-1">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
            <div className="text-left md:text-right">
              <div className="flex items-center gap-1.5 md:justify-end text-amber-400 font-bold text-base">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{profile.metrics.rating.toFixed(2)}</span>
                <span className="text-zinc-500 text-xs font-normal">({profile.metrics.completedJobs} Enterprise Campaigns)</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                ${profile.hourlyRate}/hr · Sprints from ${profile.projectRateMin.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                onConnect(creator);
              }}
              className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Connect & Commission Creator</span>
            </button>
          </div>
        </div>

        {/* Verification Trust Signals Strip (Bonus Evaluation Criteria) */}
        {profile.verificationSignals.length > 0 && (
          <div className="py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Audited Creator Verification Signals & Proofs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {profile.verificationSignals.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{sig.title}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono flex justify-between">
                    <span>Audited by: {sig.issuer}</span>
                    <span>{sig.verifiedDate}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug line-clamp-2 pt-0.5">
                    {sig.proofDetails}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mastered AI Tools & Skills Section */}
        <div className="py-4 border-b border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-mono text-[11px] text-zinc-400 uppercase block mb-1.5 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              AI Tools & Model Architecture Mastered
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.tools.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono text-[11px] text-zinc-400 uppercase block mb-1.5 flex items-center gap-1">
              <Film className="h-3.5 w-3.5 text-amber-400" />
              Production Specialization & Core Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI-Specific Portfolio Showcase Section */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              <span>{portfolio.some(item => item.isExample) ? 'Example Ads & Workflow Ideas' : 'AI-Specific Portfolio & Workflow Breakdown'}</span>
            </h3>
            <span className="text-xs text-zinc-400">
              {portfolio.some(item => item.isExample) ? `${portfolio.length} example concepts` : `${portfolio.length} Commercial Case Studies`}
            </span>
          </div>
          {portfolio.some(item => item.isExample) && (
            <p className="text-xs text-amber-200/80">
              These are illustrative concepts, not completed work by this creator.
            </p>
          )}

          {/* Portfolio Thumbnail Switcher */}
          {portfolio.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {portfolio.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItemIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium shrink-0 transition-colors ${
                    selectedItemIndex === idx
                      ? 'border-amber-400 bg-amber-400/10 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <img src={item.mediaType === 'video' ? getDemoVideoThumbnail(item.mediaUrl, item.thumbnailUrl) : item.thumbnailUrl} alt="" className="h-4 w-4 rounded object-cover" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          )}

          {currentItem ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-5">
              
              {/* Media Player Container */}
              <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
                {currentItem.mediaType === 'video' ? (
                  <VideoPlayer
                    src={currentItem.mediaUrl}
                    poster={getDemoVideoThumbnail(currentItem.mediaUrl, currentItem.thumbnailUrl)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={currentItem.mediaUrl}
                    alt={currentItem.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              {currentItem.isExample && (
                <p className="text-[11px] text-amber-200/80">
                  Example concept — not completed client work.
                  {currentItem.mediaType === 'video' && getDemoVideoCredit(currentItem.mediaUrl) && (
                    <>
                      {' '}Footage: <a
                        href={getDemoVideoCredit(currentItem.mediaUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-amber-100"
                      >Pexels</a>.
                    </>
                  )}
                </p>
              )}

              <PortfolioLab item={currentItem} siblings={portfolio} />

              {/* Work Details & Commercial Context */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                      {currentItem.primaryModel}
                    </span>
                    <span className="text-zinc-500 text-xs">·</span>
                    <span className="text-xs text-zinc-400">{currentItem.aspectRatio} Aspect Ratio</span>
                    <span className="text-zinc-500 text-xs">·</span>
                    <span className="text-xs text-zinc-400">{currentItem.completionYear}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{currentItem.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                    {currentItem.description}
                  </p>
                </div>

                <div className="shrink-0 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Commercial Rights Tier</div>
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{currentItem.commercialLicensing.rightsTier}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-0.5">
                    Model Indemnity: {currentItem.commercialLicensing.indemnityProtected ? 'Protected' : 'Standard'}
                  </div>
                </div>
              </div>

              {/* Exact Prompt Engineering & Seed Recipe */}
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Generation Prompt Recipe & Seed Manifest
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(currentItem.promptRecipe.positivePrompt)}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedPrompt ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Positive Prompt</span>
                    <p className="text-xs font-mono text-zinc-200 bg-zinc-900/80 p-2.5 rounded border border-zinc-800 leading-relaxed">
                      {currentItem.promptRecipe.positivePrompt}
                    </p>
                  </div>

                  {currentItem.promptRecipe.negativePrompt && (
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Negative Prompt</span>
                      <p className="text-xs font-mono text-zinc-400 bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
                        {currentItem.promptRecipe.negativePrompt}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono text-zinc-400">
                    <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">SEED</span>
                      <span className="text-zinc-200">{currentItem.promptRecipe.seedNumber}</span>
                    </div>
                    <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">CFG SCALE</span>
                      <span className="text-zinc-200">{currentItem.promptRecipe.cfgScale}</span>
                    </div>
                    <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">SAMPLER</span>
                      <span className="text-zinc-200">{currentItem.promptRecipe.sampler}</span>
                    </div>
                    <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">CAMERA MOTION</span>
                      <span className="text-zinc-200 truncate">{currentItem.promptRecipe.cameraMovement || 'Locked Pedestal'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Generation Workflow Pipeline Graph */}
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                    <GitFork className="h-3.5 w-3.5" />
                    Multi-Stage Neural Production Pipeline
                  </span>
                  {currentItem.workflowPipeline.graphJsonAvailable && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ComfyUI Node JSON Verified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 block mb-1">STAGE 1: IDEATION</span>
                    <p className="text-[11px] text-zinc-300">{currentItem.workflowPipeline.stage1}</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 block mb-1">STAGE 2: LATENT PASS</span>
                    <p className="text-[11px] text-zinc-300">{currentItem.workflowPipeline.stage2}</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 block mb-1">STAGE 3: MOTION DYNAMICS</span>
                    <p className="text-[11px] text-zinc-300">{currentItem.workflowPipeline.stage3}</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 block mb-1">STAGE 4: 4K MASTERING</span>
                    <p className="text-[11px] text-zinc-300">{currentItem.workflowPipeline.stage4}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">No portfolio items loaded.</p>
          )}
        </div>

      </div>
    </div>
  );
};
