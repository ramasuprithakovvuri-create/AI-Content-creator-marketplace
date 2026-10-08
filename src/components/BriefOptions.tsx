import React, { useState } from 'react';
import { EyeOff } from 'lucide-react';

export const MODEL_OPTIONS = ['Midjourney', 'Stable Diffusion', 'Runway Gen-3', 'Flux.1', 'Kling', 'Sora', 'Pika', 'Luma Dream Machine', 'ComfyUI', 'ElevenLabs'];
export const STYLE_OPTIONS = ['Cyberpunk', 'Cinematic', 'Anime', 'Minimal', 'Retro', 'Surreal', 'Photorealistic', '3D Render', 'Luxury', 'Pastel'];
export const DELIVERABLE_OPTIONS = ['Hero video (16:9)', 'Vertical reels (9:16)', 'Square social (1:1)', 'Still key visuals', 'Logo animation', 'Character pack', 'Prompt & seed manifest', 'ComfyUI workflow JSON'];

export const TIERS = [
  { id: 'micro', name: 'Micro / Test', range: '$500 - $2,500', budget: 1500, outcome: 'Proof of concept or social test', scope: ['1 hero visual or 15s clip', '2 revision rounds', 'Social license'] },
  { id: 'growth', name: 'Growth', range: '$2,500 - $10,000', budget: 6000, outcome: 'Campaign-ready asset set', scope: ['3-5 assets, 2 formats', '3 revision rounds', 'Digital license'] },
  { id: 'premium', name: 'Premium', range: '$10,000 - $30,000', budget: 18500, outcome: 'Full launch campaign', scope: ['Hero film + cutdowns', 'Seed & workflow handover', 'Broadcast license'] },
  { id: 'enterprise', name: 'Enterprise', range: '$30,000+', budget: 40000, outcome: 'Multi-market brand program', scope: ['Dedicated creator pod', 'Custom LoRA / brand model', 'Full buyout + indemnity'] },
];

export const OptionPicker: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  accent?: 'amber' | 'emerald';
}> = ({ label, options, selected, onChange, accent = 'amber' }) => {
  const [customOption, setCustomOption] = useState('');
  const selectedClass = accent === 'emerald'
    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
    : 'bg-amber-400/15 border-amber-400/40 text-amber-300';
  const addOption = () => {
    const value = customOption.trim();
    if (value && !selected.some((item) => item.toLowerCase() === value.toLowerCase())) {
      onChange([...selected, value]);
    }
    setCustomOption('');
  };

  return (
  <div>
    <label className="block text-xs font-medium text-zinc-300 mb-1.5">{label}</label>
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected ? selected.filter((item) => item !== option) : [...selected, option])}
            className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
              isSelected ? `${selectedClass} font-medium` : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
    <div className="flex gap-2 mt-2">
      <input
        value={customOption}
        onChange={(event) => setCustomOption(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            addOption();
          }
        }}
        placeholder="Type another option"
        aria-label={`Add custom ${label.toLowerCase()}`}
        className="min-w-0 flex-1 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
      />
      <button
        type="button"
        onClick={addOption}
        disabled={!customOption.trim()}
        className="px-3 py-1.5 rounded-md border border-zinc-700 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
      >
        Add
      </button>
    </div>
    {selected.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-2">
        {selected.filter((item) => !options.includes(item)).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(selected.filter((value) => value !== item))}
            aria-label={`Remove ${item}`}
            className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] border border-zinc-700 hover:border-zinc-500"
          >
            {item} ×
          </button>
        ))}
      </div>
    )}
  </div>
  );
};

export const BudgetTierSelector: React.FC<{ value: string; onChange: (tier: (typeof TIERS)[number]) => void }> = ({ value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-zinc-300 mb-1.5">Budget tier (optional)</label>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {TIERS.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => onChange(t)}
          className={`text-left p-2.5 rounded-lg border text-[11px] transition-colors ${
            value === t.id ? 'border-amber-400 bg-amber-400/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
          }`}
        >
          <div className="font-bold text-white text-xs">{t.name}</div>
          <div className="font-mono text-amber-400">{t.range}</div>
          <div className="text-zinc-400 mt-1">{t.outcome}</div>
          <ul className="mt-1 text-zinc-500 space-y-0.5">{t.scope.map((s) => <li key={s}>- {s}</li>)}</ul>
        </button>
      ))}
    </div>
  </div>
);

export const PrivacyToggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${checked ? 'border-amber-400 bg-amber-400/5' : 'border-zinc-800 bg-zinc-900'}`}>
    <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="text-xs">
      <div className="flex items-center gap-1.5 font-bold text-white">
        <EyeOff className="h-4 w-4 text-amber-400" /> Stealth Mode <span className="text-[10px] font-mono text-amber-400">PREMIUM</span>
      </div>
      <p className="text-zinc-400 mt-1">
        Hides this brief from the public board, requires matched creators to sign a built-in NDA before accepting, and tells search engines not to index it.
      </p>
    </div>
  </label>
);
