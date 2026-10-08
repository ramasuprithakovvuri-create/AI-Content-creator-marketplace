import React, { useState } from 'react';
import { User, CreativeBrief, EngagementRequest } from '../types';
import { 
  X, 
  Send, 
  DollarSign, 
  Calendar, 
  FileText, 
  Layers, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Film
} from 'lucide-react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: User | null;
  currentUser: User | null;
  activeBriefs: CreativeBrief[];
  onSubmitEngagement: (request: EngagementRequest) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  creator,
  currentUser,
  activeBriefs,
  onSubmitEngagement
}) => {
  const [selectedBriefId, setSelectedBriefId] = useState<string>(activeBriefs[0]?.id || 'custom');
  const [customTitle, setCustomTitle] = useState('');
  const [proposedBudget, setProposedBudget] = useState<number | ''>(
    creator?.creatorProfile ? creator.creatorProfile.projectRateMin : 5000
  );
  const [deadline, setDeadline] = useState('2026-04-15');
  const [aspectRatio, setAspectRatio] = useState('16:9 Cinematic & 9:16 Vertical');
  const [contentType, setContentType] = useState(
    creator?.creatorProfile?.contentTypes[0] || 'Cinematic 16:9 Video'
  );
  const [notes, setNotes] = useState(
    'We require full seed manifest records, ComfyUI workflow JSON, and commercial buyout copyright indemnity.'
  );
  const [deliveryMode, setDeliveryMode] = useState<'platform' | 'private'>('platform');

  if (!isOpen || !creator) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBrief = activeBriefs.find(b => b.id === selectedBriefId);
    const title = selectedBrief ? selectedBrief.title : (customTitle || 'Direct Generative Commission');

    const newEngagement: EngagementRequest = {
      id: `eng-${Date.now()}`,
      briefId: selectedBrief ? selectedBrief.id : undefined,
      briefTitle: title,
      brandId: currentUser?.id || 'brand-1',
      brandName: currentUser?.brandProfile?.brandName || currentUser?.name || 'Partner Brand',
      brandAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      creatorId: creator.id,
      creatorName: creator.name,
      creatorAvatar: creator.avatarUrl,
      status: 'pending',
      proposedBudget: Number(proposedBudget) || 5000,
      deadline,
      aspectRatio,
      contentType,
      notes,
      deliveryMode,
      createdAt: new Date().toISOString().split('T')[0],
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: 'Milestone 1: Visual Styleframes & Seed Exploration',
          dueDate: deadline,
          amount: Math.round((Number(proposedBudget) || 5000) * 0.3),
          status: 'pending'
        },
        {
          id: `m-${Date.now()}-2`,
          title: 'Milestone 2: Motion Generation & Temporal Coherence',
          dueDate: deadline,
          amount: Math.round((Number(proposedBudget) || 5000) * 0.4),
          status: 'pending'
        },
        {
          id: `m-${Date.now()}-3`,
          title: 'Milestone 3: 4K Master Renders & IP Licensing Certificate',
          dueDate: deadline,
          amount: Math.round((Number(proposedBudget) || 5000) * 0.3),
          status: 'pending'
        }
      ]
    };

    onSubmitEngagement(newEngagement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800">
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            className="h-12 w-12 rounded-lg object-cover border border-zinc-700"
          />
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
              Commission Proposal
            </span>
            <h2 className="text-xl font-bold text-white">Connect with {creator.name}</h2>
            <p className="text-xs text-zinc-400">
              {creator.creatorProfile?.headline}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* Link to Brief or Custom Scope */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1">
              Select Creative Brief
            </label>
            <select
              value={selectedBriefId}
              onChange={(e) => setSelectedBriefId(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
            >
              {activeBriefs.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} (${b.budget.toLocaleString()})
                </option>
              ))}
              <option value="custom">+ Create Custom Direct Scope</option>
            </select>
          </div>

          {selectedBriefId === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Campaign / Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Neo-Tokyo Commercial Teaser"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Proposed Project Budget ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="number"
                  step="250"
                  required
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                Creator min: ${creator.creatorProfile?.projectRateMin.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Target Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Aspect Ratio & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Deliverable Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              >
                <option value="16:9 Cinematic & 9:16 Vertical">16:9 Cinematic & 9:16 Vertical</option>
                <option value="16:9 Master 4K">16:9 Master 4K</option>
                <option value="9:16 Vertical Reels / TikTok">9:16 Vertical Reels / TikTok</option>
                <option value="1:1 Square Billboard">1:1 Square Billboard</option>
                <option value="2.39:1 Anamorphic Widescreen">2.39:1 Anamorphic Widescreen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Delivery Preference
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('platform')}
                  className={`flex-1 py-2 px-2 rounded-md border text-[11px] font-medium transition-colors ${
                    deliveryMode === 'platform'
                      ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Platform Upload
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('private')}
                  className={`flex-1 py-2 px-2 rounded-md border text-[11px] font-medium transition-colors ${
                    deliveryMode === 'private'
                      ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Private Encrypted
                </button>
              </div>
            </div>
          </div>

          {/* Project Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1">
              Instructions & Generation Parameters
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify requirements regarding character seed consistency, camera motion, prompt engineering guidelines..."
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Escrow & Commercial Protection Info */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Kampus Escrow Protection locks project funds into 3 automated milestones. Payouts trigger upon verified deliverable approval and copyright license certificate generation.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-colors shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Send Commission Request & Fund Escrow</span>
          </button>
        </form>
      </div>
    </div>
  );
};
