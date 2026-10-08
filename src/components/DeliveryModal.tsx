import React, { useState } from 'react';
import { DEMO_VIDEO_URL } from '../lib/media';
import { EngagementRequest, WorkSubmission } from '../types';
import { 
  X, 
  UploadCloud, 
  Lock, 
  ShieldCheck, 
  FileCode, 
  CheckCircle2, 
  Sparkles, 
  Key, 
  ExternalLink,
  Layers,
  Send
} from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  engagement: EngagementRequest | null;
  onSubmitDelivery: (submission: WorkSubmission) => void;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isOpen,
  onClose,
  engagement,
  onSubmitDelivery
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'platform_upload' | 'private_encrypted_link'>(
    engagement?.deliveryMode === 'private' ? 'private_encrypted_link' : 'platform_upload'
  );
  const [mediaUrl, setMediaUrl] = useState<string>(DEMO_VIDEO_URL);
  const [privateLinkUrl, setPrivateLinkUrl] = useState('https://vault.kampus.vc/deliveries/enc-99210-solis');
  const [privateAccessCode, setPrivateAccessCode] = useState('KAMPUS-PASS-9982');
  const [notes, setNotes] = useState(
    'Final master rendered at 3840x2160 60fps. Camera trajectories stabilized with zero temporal jitter. Model seeds and LoRA weights included.'
  );
  const [comfyUiGraphAvailable, setComfyUiGraphAvailable] = useState(true);
  const [seedManifest, setSeedManifest] = useState(
    JSON.stringify({
      masterSeed: 84920412,
      modelStack: ['Runway Gen-3 Alpha', 'Flux.1 Pro', 'ComfyUI 0.2.4', 'Topaz Video AI 5.2'],
      loraCheckpoints: ['custom_vehicle_v4_chassis.safetensors (hash: 7d4a8f9)'],
      aspectRatio: '3840x2160 (16:9 Anamorphic)',
      fps: 60,
      colorSpace: 'ACEScg / Rec.709'
    }, null, 2)
  );

  if (!isOpen || !engagement) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const certificateId = `KAMPUS-LIC-2026-${Math.floor(1000 + Math.random() * 9000)}-${engagement.brandName.slice(0, 5).toUpperCase()}`;

    const submission: WorkSubmission = {
      id: `sub-${Date.now()}`,
      engagementId: engagement.id,
      submittedAt: new Date().toISOString(),
      deliveryMethod,
      mediaUrl: deliveryMethod === 'platform_upload' ? mediaUrl : (privateLinkUrl || mediaUrl),
      privateLinkUrl: deliveryMethod === 'private_encrypted_link' ? privateLinkUrl : undefined,
      privateAccessCode: deliveryMethod === 'private_encrypted_link' ? privateAccessCode : undefined,
      seedManifestJson: seedManifest,
      comfyUiGraphAvailable,
      notes,
      licenseCertificateId: certificateId,
      licenseTier: 'Full Enterprise Buyout (Worldwide / Perpetual)',
      clientSigned: false,
      status: 'pending_review'
    };

    onSubmitDelivery(submission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-zinc-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-2">
            <UploadCloud className="h-3.5 w-3.5" />
            <span>AI WORK DELIVERY PORTAL</span>
          </div>
          <h2 className="text-xl font-bold text-white">Deliver Work for {engagement.briefTitle}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Client: <strong>{engagement.brandName}</strong> · Contract: ${engagement.proposedBudget.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* User Requested: "after the work done they will send their through this website or in private" */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
              Select Delivery Channel *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('platform_upload')}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors ${
                  deliveryMethod === 'platform_upload'
                    ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <UploadCloud className="h-4 w-4 text-amber-400" />
                  <span>Send Through Website</span>
                </div>
                <span className="text-[11px] text-zinc-400 leading-snug">
                  Direct player streaming, cloud media link, and inline review.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('private_encrypted_link')}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors ${
                  deliveryMethod === 'private_encrypted_link'
                    ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>Send in Private</span>
                </div>
                <span className="text-[11px] text-zinc-400 leading-snug">
                  Encrypted private vault with security passcode & NDA protection.
                </span>
              </button>
            </div>
          </div>

          {/* Platform Upload Link OR Private Vault Form */}
          {deliveryMethod === 'platform_upload' ? (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Deliverable Master Render URL (ProRes 4K / MP4) *
              </label>
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://storage.googleapis.com/... or cloud deliverable URL"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          ) : (
            <div className="space-y-3 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Encrypted Vault / Private Transfer URL *
                </label>
                <input
                  type="url"
                  required
                  value={privateLinkUrl}
                  onChange={(e) => setPrivateLinkUrl(e.target.value)}
                  placeholder="https://vault.kampus.vc/deliveries/... or Dropbox / WeTransfer Pro link"
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-amber-400" />
                  Client Decryption Access Passcode *
                </label>
                <input
                  type="text"
                  required
                  value={privateAccessCode}
                  onChange={(e) => setPrivateAccessCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Seed Manifest & Model Metadata */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
                <FileCode className="h-3.5 w-3.5 text-amber-400" />
                <span>Seed Manifest & Checkpoint Metadata (JSON)</span>
              </label>
              <span className="text-[10px] text-zinc-400">Verifies model provenance</span>
            </div>
            <textarea
              rows={4}
              value={seedManifest}
              onChange={(e) => setSeedManifest(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* ComfyUI Graph Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="comfyGraph"
              checked={comfyUiGraphAvailable}
              onChange={(e) => setComfyUiGraphAvailable(e.target.checked)}
              className="rounded border-zinc-700 text-amber-400 focus:ring-amber-400"
            />
            <label htmlFor="comfyGraph" className="text-xs text-zinc-300">
              Bundle raw ComfyUI Node Graph JSON for enterprise reproducibility
            </label>
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Notes for the Brand & Revision Guidelines
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Legal Indemnity & Certificate Generation Notice */}
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Upon submission, a unique <strong>Kampus Commercial License Certificate</strong> will be issued granting the brand full commercial buyout rights with verified model legal indemnity.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wide transition-colors shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Deliverables & Request Milestone Release</span>
          </button>
        </form>
      </div>
    </div>
  );
};
