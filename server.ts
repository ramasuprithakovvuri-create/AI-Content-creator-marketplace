import express, { type ErrorRequestHandler } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { configureOAuth } from './server/oauth';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Fallback intelligent brief generator
function generateLocalBrief(body: any) {
  const { rawPrompt, companyName, industry, objective, budget, targetFormat } = body;
  const comp = companyName || 'Forward Brand';
  const ind = industry || 'Next-Gen Consumer';
  const obj = objective || 'Product Launch Campaign';
  const fmt = targetFormat || '16:9 Cinematic 4K + 9:16 Vertical';
  const budg = budget ? `$${budget}` : '$15,000';

  return {
    title: `${comp}: ${rawPrompt?.slice(0, 40) || 'Generative Visual Campaign'}`,
    conceptSummary: `A high-impact, AI-native narrative campaign for ${comp} in the ${ind} space. Blending cinematic photorealism with controlled camera moves and surreal kinetic lighting to elevate ${obj}.`,
    targetAudience: 'Digital-first early adopters, creative directors, and discerning tech-savvy luxury consumers (ages 18-38).',
    visualStyle: 'Cyber-Minimalism with naturalistic global illumination, 35mm anamorphic grain, and architectural symmetry.',
    recommendedModelStack: [
      'Runway Gen-3 Alpha (Camera dynamics & macro realism)',
      'Midjourney v6.1 (Concept styleframing & lighting)',
      'Flux.1 Pro / Dev (Exact text rendering & fine anatomy)',
      'ComfyUI LoRA (Brand identity & actor seed lock)',
      'ElevenLabs Voice Architecture (Synthetic sonic spatialization)'
    ],
    aspectRatios: ['16:9 Cinematic (2160p 60fps)', '9:16 Vertical Mobile (1080x1920)', '1:1 Square Billboard'],
    promptEngineeringGuidelines: 'Avoid plastic skin textures; specify `--style raw --v 6.1 --stop 95` for Midjourney. In Runway Gen-3, utilize precise camera coordinate prompts (e.g., `Slow dolly-in, f/1.8 optical bokeh, 3200K tungsten key light, no motion flicker`). Enforce negative prompting against uncanny hands and warping artifacts.',
    commercialLicensingRequirements: 'Full Worldwide Commercial Buyout, 24-Month Exclusive Right of Use, Digital & Broadcast Clearances, Full Handover of ComfyUI Pipeline Graph JSON & LoRA Checkpoints with AI Model Indemnity.',
    recommendedMilestones: [
      { phase: 'Milestone 1: Creative Direction & 12 Styleframes', days: 'Day 1-2', payoutShare: '20%' },
      { phase: 'Milestone 2: Character/Asset Seed Consistency Locking', days: 'Day 3-5', payoutShare: '30%' },
      { phase: 'Milestone 3: Motion Generation & Temporal Coherence Cut', days: 'Day 6-8', payoutShare: '30%' },
      { phase: 'Milestone 4: 4K Neural Upscaling, Color Grade & Audio Handover', days: 'Day 9-10', payoutShare: '20%' }
    ],
    estimatedBudgetRange: budg ? `${budg} - ${(Number(budget || 15000) * 1.25).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}` : '$12,000 - $18,000',
    suggestedCreatorSkills: [
      'ComfyUI Node Architecture',
      'LoRA Character Consistency',
      'Runway Gen-3 Camera Control',
      'Photoreal Color Grading & Neural Upscaling',
      'Commercial Brand Deliverables'
    ]
  };
}

// API endpoint: AI-Assisted Brief Builder
app.post('/api/brief-builder', async (req, res) => {
  try {
    const { rawPrompt, companyName, industry, objective, budget, targetFormat } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ success: true, brief: generateLocalBrief(req.body) });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // 4-second timeout race for instant responsiveness
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI generation timeout')), 4000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an elite Creative Technologist and Venture Partner at Kampus.VC.
Transform this brand request into a rigorous, production-ready AI Creative Brief.
Company Name: ${companyName || 'Emerging Brand'}
Industry: ${industry || 'Technology'}
Objective: ${objective || 'Campaign Reveal'}
Raw Concept / Rough Idea: "${rawPrompt || 'Futuristic luxury product reveal with seamless kinetic AI camera shifts'}"
Target Aspect Ratio: ${targetFormat || '16:9 Cinematic & 9:16 Vertical'}
Target Budget: $${budget || '15,000'}

Return a single JSON object with these EXACT keys:
{
  "title": "Concise Campaign Title",
  "conceptSummary": "2-3 sentences describing the high-concept visual story",
  "targetAudience": "Audience demographic and cultural psychographics",
  "visualStyle": "Aesthetic tone, lighting, lens choice, color palette",
  "recommendedModelStack": ["Runway Gen-3 Alpha", "Midjourney v6.1", "Flux.1 Dev", "ComfyUI LoRA", "ElevenLabs"],
  "aspectRatios": ["16:9 4K Cinema", "9:16 Vertical Social"],
  "promptEngineeringGuidelines": "Detailed technical prompt notes, tokens, negative prompts, camera motion directions",
  "commercialLicensingRequirements": "Commercial usage parameters, IP buyout, seed manifest delivery",
  "recommendedMilestones": [
    {"phase": "Phase 1: Visual Styleframes & Seed Exploration", "days": "Day 1-2", "payoutShare": "25%"},
    {"phase": "Phase 2: Motion Generation & Temporal Coherence", "days": "Day 3-5", "payoutShare": "35%"},
    {"phase": "Phase 3: Sound Design, Lip Sync & Upscaling", "days": "Day 6-8", "payoutShare": "25%"},
    {"phase": "Phase 4: Master 4K Delivery & Commercial IP Handover", "days": "Day 9-10", "payoutShare": "15%"}
  ],
  "estimatedBudgetRange": "$12,000 - $18,000",
  "suggestedCreatorSkills": ["ComfyUI Custom Workflows", "Camera Path Control", "Consistent Character LoRA", "Neural Upscaling"]
}
Output valid JSON only. Do not wrap in markdown or backticks.`
    });

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    let text = response.text || '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    return res.json({ success: true, brief: parsed });
  } catch (error: any) {
    console.error('Gemini brief generator fallback triggered:', error?.message || error);
    return res.json({ success: true, brief: generateLocalBrief(req.body) });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  await configureOAuth(app);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
    console.error('Unhandled server request error:', error);
    if (res.headersSent) return next(error);
    return res.status(500).json({ error: 'The server could not complete the request.' });
  };
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Kampus AI Marketplace running at http://localhost:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Kampus AI Marketplace failed to start:', error);
  process.exitCode = 1;
});
