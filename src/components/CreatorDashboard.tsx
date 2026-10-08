import React, { useState } from 'react';
import { getDemoVideoThumbnail } from '../lib/media';
import { User, EngagementRequest, PortfolioItem } from '../types';
import { 
  Video, 
  Layers, 
  Sparkles, 
  Edit3, 
  Plus, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Save, 
  Check, 
  Cpu, 
  Film,
  Send,
  Eye
} from 'lucide-react';

interface CreatorDashboardProps {
  currentUser: User;
  engagements: EngagementRequest[];
  onOpenDeliveryModal: (engagement: EngagementRequest) => void;
  onAcceptEngagement: (engagementId: string) => void;
  onDeclineEngagement: (engagementId: string) => void;
  onUpdateCreatorProfile: (updatedUser: User) => void;
  onViewPortfolioModal: (creator: User) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  currentUser,
  engagements,
  onOpenDeliveryModal,
  onAcceptEngagement,
  onDeclineEngagement,
  onUpdateCreatorProfile,
  onViewPortfolioModal
}) => {
  const profile = currentUser.creatorProfile!;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [hourlyRate, setHourlyRate] = useState(profile.hourlyRate);
  const [projectRateMin, setProjectRateMin] = useState(profile.projectRateMin);
  const [turnaroundDays, setTurnaroundDays] = useState(profile.turnaroundDays);

  // New portfolio item modal state
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newBeforeUrl, setNewBeforeUrl] = useState('');
  const [newPoseUrls, setNewPoseUrls] = useState('');
  const [newStyleName, setNewStyleName] = useState('');
  const [newMediaType, setNewMediaType] = useState<'video' | 'image'>('video');
  const [newPrimaryModel, setNewPrimaryModel] = useState('Runway Gen-3 Alpha');
  const [newPositivePrompt, setNewPositivePrompt] = useState('');
  const [newSeed, setNewSeed] = useState(8829103);
  const [newAspectRatio, setNewAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '2.39:1'>('16:9');

  const creatorEngagements = engagements.filter(e => e.creatorId === currentUser.id);
  const pendingRequests = creatorEngagements.filter(e => e.status === 'pending');
  const activeJobs = creatorEngagements.filter(e => e.status === 'in_progress' || e.status === 'delivered');

  const handleSaveProfile = () => {
    const updatedUser: User = {
      ...currentUser,
      creatorProfile: {
        ...profile,
        headline,
        bio,
        hourlyRate: Number(hourlyRate),
        projectRateMin: Number(projectRateMin),
        turnaroundDays: Number(turnaroundDays)
      }
    };
    onUpdateCreatorProfile(updatedUser);
    setIsEditingProfile(false);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      title: newTitle,
      description: 'Generative commercial production showcasing custom latent node consistency and camera pathing.',
      mediaType: newMediaType,
      thumbnailUrl: newMediaUrl,
      mediaUrl: newMediaUrl,
      aspectRatio: newAspectRatio,
      contentType: 'Cinematic 16:9 Video',
      toolsUsed: [newPrimaryModel, 'ComfyUI', 'Flux.1 Pro'],
      primaryModel: newPrimaryModel,
      promptRecipe: {
        positivePrompt: newPositivePrompt || 'Cinematic lighting, 35mm anamorphic, realistic specular reflections, photoreal 8k',
        negativePrompt: 'blur, noise, extra fingers, cartoon',
        seedNumber: Number(newSeed) || 492019,
        cfgScale: 7.0,
        sampler: 'Euler a',
        cameraMovement: 'Locked smooth pedestal'
      },
      workflowPipeline: {
        stage1: 'Concept generation & Styleframing',
        stage2: 'Latent seed locking & ControlNet pass',
        stage3: 'Motion synthesis via ' + newPrimaryModel,
        stage4: '4K Topaz upscaling & DaVinci grade',
        graphJsonAvailable: true
      },
      commercialLicensing: {
        rightsTier: 'Full Enterprise Buyout',
        indemnityProtected: true,
        copyrightCleanModels: true,
        allowSublicensing: true
      },
      clientOrContext: 'Self-directed project',
      likesCount: 0,
      viewsCount: 0,
      completionYear: '2026',
      beforeImageUrl: newBeforeUrl || undefined,
      poseGallery: newPoseUrls.split(',').map((s) => s.trim()).filter(Boolean),
      customStyleName: newStyleName || undefined
    };

    const updatedUser: User = {
      ...currentUser,
      creatorProfile: {
        ...profile,
        portfolio: [newItem, ...(profile.portfolio || [])]
      }
    };

    onUpdateCreatorProfile(updatedUser);
    setIsAddingPortfolio(false);
    setNewTitle('');
    setNewPositivePrompt('');
  };

  return (
    <div className="space-y-6">
      
      {/* Creator Profile Hero & Quick Edit */}
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
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {profile.verificationSignals.length > 0 ? 'VERIFIED AI CREATOR' : 'CREATOR PROFILE'}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {profile.specialization}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {currentUser.name}
              </h1>
              <p className="text-xs text-amber-400 font-medium">
                {profile.headline}
              </p>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed pt-1">
                {profile.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={() => onViewPortfolioModal(currentUser)}
              className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview Public Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Inline Editor */}
        {isEditingProfile && (
          <div className="mt-5 p-4 rounded-xl border border-zinc-700 bg-zinc-900/90 space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-mono uppercase text-amber-400 font-bold">
              Update Creator Rates & Bio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Min Sprint Rate ($)</label>
                <input
                  type="number"
                  value={projectRateMin}
                  onChange={(e) => setProjectRateMin(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Avg Turnaround (Days)</label>
                <input
                  type="number"
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-md bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Incoming Requests from Brands */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Incoming Brand Commission Requests</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Direct proposals received from brands and agencies.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {pendingRequests.length} Pending Actions
          </span>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-xl border border-amber-400/30 bg-zinc-900/60 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={req.brandAvatar} alt="" className="h-8 w-8 rounded-lg object-cover border border-zinc-700" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{req.brandName}</h4>
                      <p className="text-[11px] text-zinc-400">Requested on {req.createdAt}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    ${req.proposedBudget.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-zinc-200 font-semibold">
                  {req.briefTitle}
                </p>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {req.notes}
                </p>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-between font-mono">
                  <span>Due: {req.deadline}</span>
                  <span>Mode: {req.deliveryMode}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onDeclineEngagement(req.id)}
                    className="flex-1 py-1.5 rounded-md bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => onAcceptEngagement(req.id)}
                    className="flex-1 py-1.5 rounded-md bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 shadow-sm"
                  >
                    Accept & Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 text-center text-xs text-zinc-400">
            No pending brand requests at the moment. Active projects will show below.
          </div>
        )}
      </div>

      {/* Active Work In Progress & Delivery Portal */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <span>Active Engagements & Work Delivery</span>
        </h2>

        {activeJobs.length > 0 ? (
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-amber-400">{job.brandName}</span>
                    <span className="text-zinc-500 text-xs">·</span>
                    <span className="text-xs text-zinc-400">{job.aspectRatio}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{job.briefTitle}</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Contract: ${job.proposedBudget.toLocaleString()} · Due: {job.deadline}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenDeliveryModal(job)}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>{job.status === 'delivered' ? 'Update Submission' : 'Submit Work & Link'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 text-center text-xs text-zinc-400">
            No active engagements in production.
          </div>
        )}
      </div>

      {/* AI Portfolio Manager (Add New Project) */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-amber-400" />
              <span>AI Portfolio Items & Recipes ({profile.portfolio.length})</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Manage your generative case studies, prompt recipes, and ComfyUI workflow records.
            </p>
          </div>

          <button
            onClick={() => setIsAddingPortfolio(!isAddingPortfolio)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New AI Generation</span>
          </button>
        </div>

        {/* Add Portfolio Form Modal / Inline */}
        {isAddingPortfolio && (
          <form onSubmit={handleAddPortfolio} className="p-5 rounded-xl border border-zinc-700 bg-zinc-900/90 space-y-4">
            <h3 className="text-xs font-mono uppercase text-amber-400 font-bold">
              Publish New Generative Case Study
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HYPER-CHRONOS Titanium Spec"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Primary AI Model *</label>
                <select
                  value={newPrimaryModel}
                  onChange={(e) => setNewPrimaryModel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
                >
                  <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</option>
                  <option value="Flux.1 Pro">Flux.1 Pro</option>
                  <option value="Midjourney v6.1">Midjourney v6.1</option>
                  <option value="Kling 1.5 Pro">Kling 1.5 Pro</option>
                  <option value="Sora Preview">Sora Preview</option>
                  <option value="ComfyUI Custom LoRA">ComfyUI Custom LoRA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Media URL (MP4 / WebM / Image) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Raw "before" image URL (for the comparison slider)</label>
                <input type="url" value={newBeforeUrl} onChange={(e) => setNewBeforeUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Consistency set: pose image URLs (comma separated)</label>
                <input value={newPoseUrls} onChange={(e) => setNewPoseUrls(e.target.value)} placeholder="https://a.jpg, https://b.jpg" className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Custom-trained style name (LoRA / checkpoint)</label>
                <input value={newStyleName} onChange={(e) => setNewStyleName(e.target.value)} placeholder="e.g. NeonNoir-v2 LoRA" className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Seed Number</label>
                <input
                  type="number"
                  value={newSeed}
                  onChange={(e) => setNewSeed(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1">Positive Prompt Recipe</label>
              <textarea
                rows={2}
                value={newPositivePrompt}
                onChange={(e) => setNewPositivePrompt(e.target.value)}
                placeholder="Include lens tokens, lighting parameters, and style cues..."
                className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingPortfolio(false)}
                className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300"
              >
                Publish to Portfolio
              </button>
            </div>
          </form>
        )}

        {/* Existing Portfolio Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.portfolio.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden space-y-2 p-3"
            >
              <div className="relative aspect-video rounded overflow-hidden bg-black">
                <img src={item.mediaType === 'video' ? getDemoVideoThumbnail(item.mediaUrl, item.thumbnailUrl) : item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-amber-400">
                  {item.primaryModel}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              <p className="text-[11px] text-zinc-400 truncate font-mono">
                Seed: {item.promptRecipe.seedNumber} · {item.aspectRatio}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
