import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { KAMPUS_STUDIO_THESIS } from '../data/mockData';

export const VentureThesisModal: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    {
      badge: 'SLIDE 1 · VENTURE STUDIO THESIS',
      title: 'The Generative AI Creative Labor Stack',
      subtitle: 'Why Kampus.VC is incubating the categorical AI content creator marketplace.',
      content: (
        <div className="space-y-6 text-sm">
          <p className="text-zinc-300 leading-relaxed text-base">
            Generative AI has spawned a new echelon of creative professionals: <strong>AI filmmakers, neural animators, and ComfyUI workflow architects</strong>. However, enterprise brands and creative agencies cannot hire them through legacy freelancing platforms because existing marketplaces cannot verify AI capabilities or manage multi-generation revisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase">$42B Market Shift</span>
              <h4 className="font-bold text-white text-sm">Generative Commercial Spend</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enterprises are shifting 35% of commercial VFX and advertising budgets from physical soundstages to generative models.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase">The Trust Gap</span>
              <h4 className="font-bold text-white text-sm">Unverified AI Hallucinations</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Brands struggle to audit whether creators understand latent seed consistency, camera pathing, and copyright indemnity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase">Kampus Advantage</span>
              <h4 className="font-bold text-white text-sm">University Founder Engine</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct talent pipelines into top university AI media labs (CMU, MIT, Stanford) incubated via Kampus.VC Studio.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      badge: 'SLIDE 2 · THE LEGACY FAILURE',
      title: 'Why Upwork and Fiverr Fail at Generative AI',
      subtitle: 'Legacy platforms treat creative talent as commodity labor without workflow intelligence.',
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Marketplace Dimension</th>
                  <th className="py-3 px-4 text-red-400">Legacy Platforms (Upwork / Fiverr)</th>
                  <th className="py-3 px-4 text-emerald-400">Kampus AI Creator Marketplace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Tool & Model Indexing</td>
                  <td className="py-3 px-4 text-zinc-400">Generic tags ("Video Editor", "Graphic Design"). Zero model awareness.</td>
                  <td className="py-3 px-4 text-emerald-300 font-mono">Runway Gen-3, Kling 1.5, Flux.1 Pro, ComfyUI LoRA checkpoints.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Verification Signals</td>
                  <td className="py-3 px-4 text-zinc-400">Unverifiable text claims and star ratings from unrelated gigs.</td>
                  <td className="py-3 px-4 text-emerald-300">Audited API power-user status, node reproducibility, and brand proofs.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Brief Formulation</td>
                  <td className="py-3 px-4 text-zinc-400">Vague text boxes leading to misaligned aspect ratios and wasted compute.</td>
                  <td className="py-3 px-4 text-emerald-300">Gemini-assisted structured brief with camera paths, seeds, and token rules.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Deliverable Handover</td>
                  <td className="py-3 px-4 text-zinc-400">Flat MP4 file with zero provenance or prompt records.</td>
                  <td className="py-3 px-4 text-emerald-300">Seed manifest JSON + ComfyUI graph + Commercial IP Buyout Certificate.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      badge: 'SLIDE 3 · THE 4 CORE FLYWHEELS',
      title: 'Kampus AI Studio Flywheels',
      subtitle: 'Four self-reinforcing mechanisms that compound creator and enterprise lock-in.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KAMPUS_STUDIO_THESIS.pillars.map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>{pillar.title}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {pillar.metric}
                </span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong className="text-zinc-300">Solution: </strong>{pillar.kampusSolution}
              </p>
            </div>
          ))}
        </div>
      )
    },
    {
      badge: 'SLIDE 4 · DATA MODEL INTEGRITY',
      title: 'Architectural Data Model Design',
      subtitle: 'Addressing Challenge Deliverable #2 with enterprise-grade data structures.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <h4 className="font-bold text-amber-400 uppercase font-mono text-xs">Creator Profile & Portfolio Model</h4>
            <ul className="space-y-1.5 text-zinc-300">
              <li>• <strong>AI Toolchain Array:</strong> Runway, Kling, Flux.1, ComfyUI, ElevenLabs, Topaz.</li>
              <li>• <strong>Seed Manifest Recipe:</strong> Positive prompt, negative prompt, seed number, CFG, sampler.</li>
              <li>• <strong>Multi-Stage Workflow Pipeline:</strong> Styleframe → Latent Pass → Motion → 4K Master.</li>
              <li>• <strong>Verifiable Trust Signals:</strong> Cryptographic audit hash and enterprise client proofs.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <h4 className="font-bold text-emerald-400 uppercase font-mono text-xs">Campaign Brief & Commercial Model</h4>
            <ul className="space-y-1.5 text-zinc-300">
              <li>• <strong>Multi-Aspect Ratios:</strong> 16:9 Cinema 4K, 9:16 Vertical Reels, 1:1 Square, Anamorphic.</li>
              <li>• <strong>Prompt Constraint Rules:</strong> Negative token boundaries & camera vector requirements.</li>
              <li>• <strong>Milestone Escrow Gates:</strong> Automated tranche releases upon deliverable review.</li>
              <li>• <strong>Commercial IP Buyout:</strong> Model copyright indemnity certificate & ComfyUI graph handover.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      badge: 'SLIDE 5 · MARKETPLACE ECONOMICS',
      title: 'Unit Economics & Take-Rate Engine',
      subtitle: 'High average order value with recurring enterprise subscription tiers.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">Take-Rate Model</span>
            <h4 className="font-bold text-white text-base">15% Brand + 5% Creator</h4>
            <p className="text-zinc-400 leading-relaxed">
              Standard 20% aggregate marketplace take-rate protected by milestone escrow and legal IP indemnity issuance.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">Average Deal Size</span>
            <h4 className="font-bold text-white text-base">$12,500 / Sprint</h4>
            <p className="text-zinc-400 leading-relaxed">
              Significantly higher than $150 Upwork video edits due to commercial-tier enterprise broadcast specifications.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">SaaS Upsell</span>
            <h4 className="font-bold text-white text-base">$2,500/mo Studio Pro</h4>
            <p className="text-zinc-400 leading-relaxed">
              Enterprise brand accounts get private encrypted delivery vaults, unlimited Gemini brief generations, and dedicated LoRA training GPU clusters.
            </p>
          </div>
        </div>
      )
    },
    {
      badge: 'SLIDE 6 · KAMPUS.VC STUDIO ROADMAP',
      title: 'Venture Studio Spinout Roadmap',
      subtitle: 'From prototype to category-defining generative marketplace.',
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-amber-400/30 bg-amber-400/5 space-y-1">
              <span className="text-amber-400 font-mono font-bold">PHASE 1 (Now)</span>
              <h5 className="font-bold text-white">Challenge Prototype</h5>
              <p className="text-zinc-400 text-[11px]">Working marketplace, Gemini brief builder, creator directory & verified signals.</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 space-y-1">
              <span className="text-zinc-400 font-mono font-bold">PHASE 2 (Q4 2026)</span>
              <h5 className="font-bold text-white">University Pilot</h5>
              <p className="text-zinc-400 text-[11px]">Onboard 100 elite AI fellows from CMU, Stanford & MIT media labs.</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 space-y-1">
              <span className="text-zinc-400 font-mono font-bold">PHASE 3 (Q1 2027)</span>
              <h5 className="font-bold text-white">Agency Network</h5>
              <p className="text-zinc-400 text-[11px]">Integrate with top 20 creative advertising agencies for ongoing retainer contracts.</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 space-y-1">
              <span className="text-zinc-400 font-mono font-bold">PHASE 4 (Q2 2027)</span>
              <h5 className="font-bold text-white">Series Seed Spinout</h5>
              <p className="text-zinc-400 text-[11px]">Spin out independent venture with Kampus.VC seed syndicate backing.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const slide = SLIDES[currentSlide];

  return (
    <div className="space-y-6">
      
      {/* Deck Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-2">
            <Presentation className="h-3.5 w-3.5" />
            <span>CHALLENGE DELIVERABLE #3 · KAMPUS.VC PITCH & APPROACH</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kampus.VC Venture Thesis & Interactive Demo
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            A comprehensive 6-slide executive overview showing market dynamics, data architecture, and venture studio spinout thesis.
          </p>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 mr-2">
            {currentSlide + 1} of {SLIDES.length}
          </span>
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => Math.min(SLIDES.length - 1, prev + 1))}
            disabled={currentSlide === SLIDES.length - 1}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 space-y-6 min-h-[420px] flex flex-col justify-between shadow-xl">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              {slide.badge}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {slide.title}
            </h2>
            <p className="text-xs text-zinc-400">
              {slide.subtitle}
            </p>
          </div>

          <div className="pt-2">
            {slide.content}
          </div>
        </div>

        {/* Slide Footer Navigation */}
        <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentSlide < SLIDES.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(prev => prev + 1)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                <span>Next Slide</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentSlide(0)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Back to Start ↺
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
