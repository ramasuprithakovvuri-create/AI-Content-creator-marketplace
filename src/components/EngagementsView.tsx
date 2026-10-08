import { EngagementExtras } from './EngagementExtras';
import { VideoPlayer } from './VideoPlayer';
import React, { useState } from 'react';
import { User, EngagementRequest, WorkSubmission } from '../types';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Lock, 
  UploadCloud, 
  DollarSign, 
  FileText, 
  Download, 
  Sparkles, 
  ExternalLink,
  Key,
  Check,
  Send,
  AlertCircle
} from 'lucide-react';

interface EngagementsViewProps {
  engagements: EngagementRequest[];
  currentUser: User | null;
  onOpenDeliveryModal: (engagement: EngagementRequest) => void;
  onApproveSubmission: (engagementId: string) => void;
  onAcceptEngagement: (engagementId: string) => void;
  onDeclineEngagement: (engagementId: string) => void;
  onApproveMilestone: (engagementId: string, milestoneId: string) => void;
  onOpenWorkspace: (engagement: EngagementRequest) => void;
  onFund: (engagement: EngagementRequest) => void;
  onReview: (engagementId: string, rating: number, text: string) => void;
}

export const EngagementsView: React.FC<EngagementsViewProps> = ({
  engagements,
  currentUser,
  onOpenDeliveryModal,
  onApproveSubmission,
  onAcceptEngagement,
  onDeclineEngagement,
  onApproveMilestone,
  onOpenWorkspace,
  onFund,
  onReview
}) => {
  const [selectedEngId, setSelectedEngId] = useState<string>(engagements[0]?.id || '');
  const [viewCertificateModal, setViewCertificateModal] = useState<WorkSubmission | null>(null);

  // Filter engagements relevant to user or all if admin/demo
  const userEngagements = engagements.filter(e => {
    if (!currentUser) return true;
    if (currentUser.role === 'brand') return e.brandId === currentUser.id;
    if (currentUser.role === 'creator') return e.creatorId === currentUser.id;
    return true;
  });

  const activeEng = userEngagements.find(e => e.id === selectedEngId) || userEngagements[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span>COMMERCIAL ENGAGEMENTS & ESCROW</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Production Management & Deliverables
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage briefs from discovery through multi-generation iteration, milestone escrow sign-offs, and commercial IP certification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-400 uppercase block">Active Contracts</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{userEngagements.length} Projects</span>
          </div>
        </div>
      </div>

      {userEngagements.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Engagements List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
              Select Project ({userEngagements.length})
            </h2>

            <div className="space-y-2.5">
              {userEngagements.map((eng) => {
                const isSelected = activeEng?.id === eng.id;
                return (
                  <div
                    key={eng.id}
                    onClick={() => setSelectedEngId(eng.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-zinc-900 shadow-md'
                        : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={currentUser?.role === 'brand' ? eng.creatorAvatar : eng.brandAvatar}
                          alt=""
                          className="h-8 w-8 rounded-lg object-cover border border-zinc-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {eng.briefTitle}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {currentUser?.role === 'brand' ? `Creator: ${eng.creatorName}` : `Brand: ${eng.brandName}`}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        eng.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : eng.status === 'delivered'
                          ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                          : eng.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {eng.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80 font-mono">
                      <span className="text-amber-300 font-bold">${eng.proposedBudget.toLocaleString()}</span>
                      <span>Due {eng.deadline}</span>
                      <span className="capitalize">{eng.deliveryMode} mode</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Project Deep Dive */}
          {activeEng && (
            <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              
              {/* Engagement Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-amber-400">
                      Contract #{activeEng.id.slice(-6)}
                    </span>
                    <span className="text-zinc-500 text-xs">·</span>
                    <span className="text-xs text-zinc-400">{activeEng.aspectRatio}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{activeEng.briefTitle}</h2>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {activeEng.notes}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Escrow Total</span>
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    ${activeEng.proposedBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Creator Pending Request Action (If Creator and Pending) */}
              {activeEng.status === 'pending' && currentUser?.role === 'creator' && (
                <div className="p-4 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-4">
                  <div className="text-xs text-amber-300">
                    <strong>New Commission Request!</strong> {activeEng.brandName} wants to hire you for ${activeEng.proposedBudget.toLocaleString()}.
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDeclineEngagement(activeEng.id)}
                      className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onAcceptEngagement(activeEng.id)}
                      className="px-3.5 py-1.5 rounded-md bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 shadow-sm"
                    >
                      Accept Project
                    </button>
                  </div>
                </div>
              )}

              {/* Deliverable Review Section (If Delivered or Completed) */}
              {activeEng.submission && (
                <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">Delivered Master Work</h3>
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      activeEng.submission.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                    }`}>
                      {activeEng.submission.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Delivery Mode Banner */}
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {activeEng.submission.deliveryMethod === 'platform_upload' ? (
                        <>
                          <UploadCloud className="h-4 w-4 text-amber-400" />
                          <span className="text-zinc-200">Delivered through Platform Media Stream</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-amber-400" />
                          <span className="text-zinc-200">Delivered via Private Encrypted Vault</span>
                        </>
                      )}
                    </div>

                    {activeEng.submission.privateAccessCode && (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                        <Key className="h-3 w-3 text-amber-400" />
                        <span>Passcode: {activeEng.submission.privateAccessCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Media Preview Player */}
                  <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
                    <VideoPlayer
                      src={activeEng.submission.mediaUrl}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Seed Manifest & Model Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>SEED MANIFEST & CHECKPOINT AUDIT</span>
                      {activeEng.submission.comfyUiGraphAvailable && (
                        <span className="text-emerald-400">✓ ComfyUI Node Graph Included</span>
                      )}
                    </div>
                    <pre className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-36">
                      {activeEng.submission.seedManifestJson}
                    </pre>
                  </div>

                  {/* Creator Delivery Notes */}
                  <p className="text-xs text-zinc-300 italic bg-zinc-900/40 p-2.5 rounded border border-zinc-800/80">
                    "{activeEng.submission.notes}"
                  </p>

                  {/* Commercial IP Certificate Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => setViewCertificateModal(activeEng.submission!)}
                      className="w-full sm:w-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>View Commercial License Certificate (#{activeEng.submission.licenseCertificateId})</span>
                    </button>

                    {/* Brand Sign-Off Button */}
                    {currentUser?.role === 'brand' && activeEng.submission.status !== 'approved' && (
                      <button
                        onClick={() => onApproveSubmission(activeEng.id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        <span>Sign-off Deliverable & Release Escrow</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <EngagementExtras
                engagement={activeEng}
                currentUser={currentUser}
                onOpenWorkspace={onOpenWorkspace}
                onFund={onFund}
                onReview={onReview}
              />

              {/* Creator Deliver Action (If In Progress and Creator) */}
              {activeEng.status === 'in_progress' && currentUser?.role === 'creator' && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">Work in Progress</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Ready to submit your master renders, seed manifest, or private delivery link?
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenDeliveryModal(activeEng)}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Submit Work & Deliverables</span>
                  </button>
                </div>
              )}

              {/* Milestone Escrow Schedule */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Milestone Escrow Schedule ({activeEng.milestones.length})
                  </h3>
                  <span className="text-[11px] text-zinc-400">Automated Smart Releases</span>
                </div>

                <div className="space-y-2">
                  {activeEng.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full ${
                          m.status === 'approved' ? 'bg-emerald-400' : m.status === 'in_review' ? 'bg-amber-400' : 'bg-zinc-600'
                        }`} />
                        <div>
                          <p className="font-semibold text-zinc-200">{m.title}</p>
                          <p className="text-[10px] text-zinc-400">Due: {m.dueDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-300 font-bold">
                          ${m.amount.toLocaleString()}
                        </span>
                        
                        {m.status === 'approved' ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Released
                          </span>
                        ) : currentUser?.role === 'brand' ? (
                          <button
                            onClick={() => onApproveMilestone(activeEng.id, m.id)}
                            className="text-[11px] px-2.5 py-1 rounded bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors"
                          >
                            Release Funds
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">
                            {m.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
          <Layers className="h-10 w-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Engagements Yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Discover verified creators in the directory and send your first commission request or brief.
          </p>
        </div>
      )}

      {/* Commercial License Certificate Modal */}
      {viewCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-xl border border-emerald-500/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-left space-y-5">
            <button
              onClick={() => setViewCertificateModal(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>KAMPUS.VC LEGAL COMPLIANCE & PROVENANCE</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">AI Commercial License Certificate</h3>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Certificate ID: {viewCertificateModal.licenseCertificateId}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">License Classification:</span>
                <span className="font-semibold text-emerald-300">{viewCertificateModal.licenseTier}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Legal Indemnity Protection:</span>
                <span className="text-emerald-400 font-bold">100% Guaranteed</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">ComfyUI Pipeline Hash:</span>
                <span className="font-mono text-zinc-300">0x7d4a8f9a2e31</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Execution Date:</span>
                <span className="text-zinc-300">{new Date(viewCertificateModal.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              This certificate certifies that the delivered generative content has been produced using copyright-clean model checkpoints and validated seed parameters. The client retains unrestricted worldwide commercial exploitation rights.
            </p>

            <button
              onClick={() => {
                alert('Commercial IP Certificate downloaded as PDF with cryptographic signature.');
                setViewCertificateModal(null);
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Signed Legal PDF Certificate</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
