import { CreativeBrief } from '../types';

export interface BriefGenerationInput {
  rawPrompt: string;
  companyName: string;
  industry: string;
  objective: string;
  budget: string | number;
  targetFormat: string;
}

export async function generateAIBrief(input: BriefGenerationInput): Promise<any> {
  try {
    const res = await fetch('/api/brief-builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    if (data.brief) {
      return data.brief;
    }
    throw new Error('No brief returned');
  } catch (err) {
    console.warn('API error, using client-side intelligent brief generator:', err);
    return getClientFallbackBrief(input);
  }
}

function getClientFallbackBrief(input: BriefGenerationInput) {
  const company = input.companyName || 'Next-Gen Brand';
  const raw = input.rawPrompt || 'Futuristic luxury commercial with dynamic kinetic camera shifts';
  const format = input.targetFormat || '16:9 Cinematic & 9:16 Vertical';
  const budget = input.budget ? `$${input.budget}` : '$15,000';

  return {
    title: `${company}: ${raw.slice(0, 36)}...`,
    conceptSummary: `A high-impact cinematic generative campaign for ${company} in the ${input.industry || 'Modern Tech'} space. Merging hyper-real physical rendering with fluid camera paths and controlled specular highlights to captivate discerning audiences.`,
    targetAudience: 'Early-adopter tech and luxury consumers, creative agency directors, and aesthetic tastemakers aged 20-40.',
    visualStyle: 'Sleek Obsidian Minimalism with warm tungsten rim-light, anamorphic optical flares, and tactile material physics.',
    recommendedModelStack: [
      'Runway Gen-3 Alpha (Camera dynamics & macro realism)',
      'Midjourney v6.1 (Concept styleframing & lighting)',
      'Flux.1 Pro (Photoreal typography & hand anatomical consistency)',
      'ComfyUI LoRA (Brand identity & actor seed lock)',
      'ElevenLabs Spatial Audio (Synthetic voiceover & ambient foley)'
    ],
    aspectRatios: [format, '1:1 Square Billboard', '4:5 Social Feed'],
    promptEngineeringGuidelines: 'Specify `--style raw --v 6.1 --stop 95` for Midjourney keyframes. In Runway Gen-3, utilize coordinate-locked prompts: `Slow tracking push-in, 35mm f/2.0 anamorphic, volumetric mist, no frame morphing`. Negative prompts: `jitter, plastic skin, distorted hands, morphing artifacts`.',
    commercialLicensingRequirements: 'Full Enterprise Buyout, Perpetual Worldwide Clearances, Digital & Broadcast Rights, complete handover of ComfyUI Graph JSON and LoRA weight files.',
    recommendedMilestones: [
      { phase: 'Milestone 1: Visual Styleframes & Seed Exploration', days: 'Day 1-2', payoutShare: '25%' },
      { phase: 'Milestone 2: Motion Animatics & Seed Locking', days: 'Day 3-5', payoutShare: '35%' },
      { phase: 'Milestone 3: 4K Neural Upscaling & Sound Design', days: 'Day 6-8', payoutShare: '25%' },
      { phase: 'Milestone 4: Master Delivery & Commercial IP Handover', days: 'Day 9-10', payoutShare: '15%' }
    ],
    estimatedBudgetRange: `${budget} - $${(Number(input.budget || 15000) * 1.3).toFixed(0)}`,
    suggestedCreatorSkills: [
      'ComfyUI Custom Workflows',
      'Camera Path Control',
      'Consistent Character LoRA',
      'Neural Upscaling & Color Grading'
    ]
  };
}
