import React, { useState } from 'react';
import { User, CreativeBrief } from '../types';
import { generateAIBrief } from '../services/api';
import { BudgetTierSelector, OptionPicker, PrivacyToggle, MODEL_OPTIONS, STYLE_OPTIONS, DELIVERABLE_OPTIONS } from './BriefOptions';
import { 
  Sparkles, 
  X, 
  Layers, 
  Film, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';

interface BriefBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onBriefCreated: (brief: CreativeBrief) => void;
  onExploreCreatorsForBrief?: (brief: CreativeBrief) => void;
  initialPrompt?: string;
}

export const BriefBuilderModal: React.FC<BriefBuilderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onBriefCreated,
  onExploreCreatorsForBrief,
  initialPrompt = ''
}) => {
  const [rawPrompt, setRawPrompt] = useState(initialPrompt);
  const [targetFormat, setTargetFormat] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState('');
  const [isStealth, setIsStealth] = useState(false);
  const [preferredModels, setPreferredModels] = useState<string[]>([]);
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [generatedBrief, setGeneratedBrief] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateAIBrief({
        rawPrompt: rawPrompt + (preferredModels.length ? `\nPreferred AI models: ${preferredModels.join(', ')}` : '') + (styleTags.length ? `\nVisual styles: ${styleTags.join(', ')}` : '') + (deliverables.length ? `\nDeliverables: ${deliverables.join(', ')}` : ''),
        companyName: currentUser?.brandProfile?.companyName || currentUser?.name || 'Brand Partner',
        industry: currentUser?.brandProfile?.industry || 'Consumer Innovation',
        objective: currentUser?.brandProfile?.purpose || 'Global Campaign Reveal',
        budget,
        targetFormat
      });
      setGeneratedBrief(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBrief = () => {
    if (!generatedBrief) return;

    const newBrief: CreativeBrief = {
      id: `brief-${Date.now()}`,
      brandId: currentUser?.id || 'brand-1',
      brandName: currentUser?.brandProfile?.brandName || currentUser?.name || 'Brand Partner',
      brandLogo: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
      title: generatedBrief.title || 'Generative Visual Campaign',
      conceptSummary: generatedBrief.conceptSummary || '',
      industry: currentUser?.brandProfile?.industry || 'Modern Tech',
      objective: currentUser?.brandProfile?.purpose || 'Commercial Production',
      contentType: targetFormat,
      visualStyle: generatedBrief.visualStyle || 'Cinematic Photorealism',
      aspectRatios: generatedBrief.aspectRatios || [targetFormat],
      targetAudience: generatedBrief.targetAudience || 'Digital-first creative audience',
      recommendedModelStack: preferredModels,
      promptGuidelines: generatedBrief.promptEngineeringGuidelines || '',
      commercialLicensing: generatedBrief.commercialLicensingRequirements || 'Full Enterprise Buyout & Legal Indemnity',
      budget: Number(budget),
      timeline,
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0],
      suggestedSkills: [],
      isStealth,
      ndaRequired: isStealth,
      noIndex: isStealth,
      budgetTier: tier,
      preferredModels,
      visualStyleTags: styleTags,
      deliverables
    };

    onBriefCreated(newBrief);
    if (onExploreCreatorsForBrief) {
      onExploreCreatorsForBrief(newBrief);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-ASSISTED BRIEF BUILDER</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Turn Rough Ideas into Production-Grade AI Briefs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose from the available options or enter your own values.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
              Rough Concept / Vision Prompt *
            </label>
            <textarea
              rows={3}
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              placeholder="Describe the campaign or creative work you need"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Target Format / Aspect Ratio
              </label>
              <input
                type="text"
                list="brief-format-options"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                required
                placeholder="Choose an option or type a format"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <datalist id="brief-format-options">
                <option value="16:9 Cinematic & 9:16 Vertical" />
                <option value="16:9 Master 4K Cinema" />
                <option value="9:16 Vertical Reels / TikTok" />
                <option value="1:1 Square & 4:5 Social" />
                <option value="3D Generative Asset Pack" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Target Budget ($ USD)
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Target Timeline
              </label>
              <input
                type="text"
                list="brief-timeline-options"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                required
                placeholder="Choose an option or type a timeline"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <datalist id="brief-timeline-options">
                <option value="48-Hour Rapid Sprint" />
                <option value="7 Days Turnaround (3 Milestones)" />
                <option value="10 Days Turnaround (4 Milestones)" />
                <option value="14 Days Turnaround (Full Commercial)" />
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionPicker label="AI models" options={MODEL_OPTIONS} selected={preferredModels} onChange={setPreferredModels} />
            <OptionPicker label="Visual styles" options={STYLE_OPTIONS} selected={styleTags} onChange={setStyleTags} />
            <OptionPicker label="Target deliverables" options={DELIVERABLE_OPTIONS} selected={deliverables} onChange={setDeliverables} />
          </div>

          <BudgetTierSelector value={tier} onChange={(t) => setTier(t.id)} />

          <PrivacyToggle checked={isStealth} onChange={setIsStealth} />

          <button
            type="button"
            disabled={isLoading || !rawPrompt.trim() || !targetFormat.trim() || !budget.trim() || !timeline.trim()}
            onClick={handleGenerate}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing Technical Brief with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-zinc-950" />
                <span>Generate Structured AI Brief</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Structured Brief Preview */}
        {generatedBrief && (
          <div className="space-y-4 pt-4 border-t border-zinc-800 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Structured Brief Architecture
              </span>
              <span className="text-[11px] text-zinc-400">Gemini 3.8 Verified</span>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">{generatedBrief.title}</h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {generatedBrief.conceptSummary}
                </p>
              </div>

              {/* Visual Style & Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-zinc-800/80">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 block uppercase">Visual Direction & Lighting</span>
                  <p className="text-zinc-200 mt-0.5">{generatedBrief.visualStyle}</p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 block uppercase">Target Audience</span>
                  <p className="text-zinc-200 mt-0.5">{generatedBrief.targetAudience}</p>
                </div>
              </div>

              {/* Prompt Guidelines */}
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 block uppercase mb-1 flex items-center gap-1">
                  <Film className="h-3.5 w-3.5 text-amber-400" />
                  Prompt Engineering & Seed Guidelines
                </span>
                <p className="text-xs font-mono bg-zinc-950 p-2.5 rounded border border-zinc-800/80 text-zinc-300 leading-relaxed">
                  {generatedBrief.promptEngineeringGuidelines}
                </p>
              </div>

              {/* Commercial Rights */}
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 block uppercase mb-1 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Commercial Licensing & Model Indemnity
                </span>
                <p className="text-xs text-zinc-300">
                  {generatedBrief.commercialLicensingRequirements}
                </p>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveBrief}
                className="w-full sm:w-1/2 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Save to Campaign Briefs</span>
              </button>

              <button
                type="button"
                onClick={handleSaveBrief}
                className="w-full sm:w-1/2 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>Publish Brief & Match Creators</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
