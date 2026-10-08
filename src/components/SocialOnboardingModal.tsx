import React, { useState } from 'react';
import { Building2, Palette, X } from 'lucide-react';
import type { OAuthIdentity, OAuthProfileInput } from '../services/auth';
import { OptionPicker } from './BriefOptions';

interface Props {
  identity: OAuthIdentity;
  onComplete: (profile: OAuthProfileInput) => Promise<void>;
  onClose: () => void;
}

const CONTENT_TYPES = [
  'Cinematic 16:9 Video',
  'Vertical Reels / TikTok 9:16',
  '3D Product Visuals',
  'Fashion Commercials',
  'Automotive & Action',
  'Character Animation & IP',
  'Music Videos',
  'Surreal VFX Sequences',
];

const AI_TOOLS = [
  'Runway Gen-3 Alpha',
  'Midjourney v6.1',
  'Flux.1 Pro',
  'ComfyUI Custom Workflows',
  'Kling 1.5 Pro',
  'ElevenLabs Voice Synthesis',
  'Sora Preview',
  'Luma Dream Machine',
  'Topaz Video AI',
];

const INDUSTRIES = [
  'Consumer Tech & Hardware',
  'Luxury Fashion & Cosmetics',
  'Automotive & Mobility',
  'Beverage & FMCG',
  'Creative Advertising Agency',
  'Gaming & Entertainment',
];

const SPECIALIZATIONS = [
  'AI Cinema & Commercials',
  'Hyper-real Product Visualization',
  'Social UGC & Viral Vertical 9:16',
  'Automotive & High-Action Commercials',
  'Luxury Fashion & Runway',
];

const FEATURES = [
  '4K Cinematic Commercials',
  'ComfyUI Workflow JSON Handover',
  'LoRA Character / Asset Seed Lock',
  'Full Commercial IP Buyout',
  '48-Hour Turnaround Sprints',
  'Multi-Aspect Ratios (16:9, 9:16, 1:1)',
  'Synthetic Voiceover & Lip Sync',
  'Private Encrypted Deliverables',
];

export const SocialOnboardingModal: React.FC<Props> = ({ identity, onComplete, onClose }) => {
  const [role, setRole] = useState<OAuthProfileInput['role'] | ''>('');
  const [name, setName] = useState(identity.name);
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [purpose, setPurpose] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [specialization, setSpecialization] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [projectRateMin, setProjectRateMin] = useState('');
  const [turnaroundDays, setTurnaroundDays] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!role) {
      setError('Select an account type to continue.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onComplete({
        role,
        name: name.trim(),
        ...(role === 'brand' ? {
          companyName,
          brandName,
          industry,
          purpose,
          expectedFeatures: features,
        } : {
          headline,
          bio,
          location,
          experienceYears,
          specialization,
          contentTypes,
          tools,
          hourlyRate: Number(hourlyRate),
          projectRateMin: Number(projectRateMin) || 0,
          turnaroundDays: Number(turnaroundDays) || 0,
        }),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not complete your account.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <div>
          <h3 className="text-lg font-bold text-white">Complete your Kampus profile</h3>
          <p className="mt-1 text-xs text-zinc-400">
            Signed in with {identity.authProvider}. Verified email: <span className="text-zinc-200">{identity.email}</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">Your provider password is never shared with or stored by Kampus.</p>
        </div>

        {error && <div role="alert" className="p-2.5 rounded border border-red-800 bg-red-950/40 text-xs text-red-300">{error}</div>}

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Name</label>
          <input className={inputClass} required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-200 mb-2">Account type *</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" aria-pressed={role === 'creator'} onClick={() => setRole('creator')} className={`p-3 rounded-lg border text-xs ${role === 'creator' ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-zinc-800 text-zinc-300'}`}>
              <Palette className="h-5 w-5 mx-auto mb-1 text-amber-400" />Creator
            </button>
            <button type="button" aria-pressed={role === 'brand'} onClick={() => setRole('brand')} className={`p-3 rounded-lg border text-xs ${role === 'brand' ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-zinc-800 text-zinc-300'}`}>
              <Building2 className="h-5 w-5 mx-auto mb-1 text-amber-400" />Brand / Agency
            </button>
          </div>
        </div>

        {role === 'brand' && (
          <div className="space-y-3">
            <input className={inputClass} required maxLength={120} value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Company name" />
            <input className={inputClass} required maxLength={120} value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Brand or product name" />
            <input className={inputClass} required list="oauth-industry-options" value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="Choose or type an industry" />
            <datalist id="oauth-industry-options">{INDUSTRIES.map((item) => <option key={item} value={item} />)}</datalist>
            <textarea className={inputClass} required maxLength={2000} rows={2} value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="What are you building?" />
            <OptionPicker label="Features and deliverables" options={FEATURES} selected={features} onChange={setFeatures} />
          </div>
        )}

        {role === 'creator' && (
          <div className="space-y-3">
            <input className={inputClass} required maxLength={160} value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Professional headline" />
            <textarea className={inputClass} required maxLength={2000} rows={3} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio and production experience" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputClass} required maxLength={120} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" />
              <input className={inputClass} type="number" min="0" max="80" value={experienceYears} onChange={(event) => setExperienceYears(Number(event.target.value))} placeholder="Years of experience" />
            </div>
            <input className={inputClass} required list="oauth-specialization-options" value={specialization} onChange={(event) => setSpecialization(event.target.value)} placeholder="Choose or type a specialization" />
            <datalist id="oauth-specialization-options">{SPECIALIZATIONS.map((item) => <option key={item} value={item} />)}</datalist>
            <OptionPicker label="Content types" options={CONTENT_TYPES} selected={contentTypes} onChange={setContentTypes} accent="emerald" />
            <OptionPicker label="AI tools and models" options={AI_TOOLS} selected={tools} onChange={setTools} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input className={inputClass} required type="number" min="0" value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} placeholder="Hourly rate ($)" />
              <input className={inputClass} type="number" min="0" value={projectRateMin} onChange={(event) => setProjectRateMin(event.target.value)} placeholder="Minimum project ($)" />
              <input className={inputClass} type="number" min="0" value={turnaroundDays} onChange={(event) => setTurnaroundDays(event.target.value)} placeholder="Turnaround (days)" />
            </div>
          </div>
        )}

        <button type="submit" disabled={!role || isSubmitting} className="w-full py-2.5 rounded bg-amber-400 text-zinc-950 font-bold text-sm disabled:opacity-50">
          {isSubmitting ? 'Saving profile…' : 'Finish account setup'}
        </button>
      </form>
    </div>
  );
};
