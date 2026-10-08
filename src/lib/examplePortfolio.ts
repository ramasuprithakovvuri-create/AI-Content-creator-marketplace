import { PortfolioItem, User } from '../types';
import { DEMO_STOCK_VIDEOS } from './media';

export function withExamplePortfolio(creator: User): User {
  const profile = creator.creatorProfile;
  if (!profile || profile.portfolio.length > 0) return creator;

  const primaryModel = profile.tools[0] || 'Midjourney v6.1';
  const toolsUsed = profile.tools.slice(0, 3);
  const commercialLicensing: PortfolioItem['commercialLicensing'] = {
    rightsTier: 'Digital Commercial',
    indemnityProtected: false,
    copyrightCleanModels: true,
    allowSublicensing: false,
  };
  const workflowPipeline: PortfolioItem['workflowPipeline'] = {
    stage1: 'Create concept and product moodboard',
    stage2: 'Generate and refine product imagery',
    stage3: 'Build the campaign visual sequence',
    stage4: 'Color grade and export social formats',
    graphJsonAvailable: false,
  };
  const examplePortfolio: PortfolioItem[] = [
    {
      id: `${creator.id}-example-skincare`,
      isExample: true,
      creatorId: creator.id,
      creatorName: creator.name,
      title: 'Botanical Glow — Skincare Product Ad',
      description: 'Example concept: a clean beauty hero image featuring a frosted serum bottle, botanical textures, and soft studio lighting for a social campaign.',
      mediaType: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
      aspectRatio: '1:1',
      contentType: '3D Product Visuals',
      toolsUsed,
      primaryModel,
      promptRecipe: {
        positivePrompt: 'Luxury skincare serum bottle on natural stone, fresh botanical leaves, dewy water droplets, soft daylight, premium clean-beauty product photography, balanced composition with space for campaign copy.',
        negativePrompt: 'distorted label, clutter, harsh reflections, blurry details, extra objects, unreadable text',
        seedNumber: 7129034,
        cfgScale: 5,
        sampler: 'Euler',
      },
      workflowPipeline,
      commercialLicensing,
      clientOrContext: 'Example concept — not client work',
      likesCount: 0,
      viewsCount: 0,
      completionYear: 'Example',
    },
    {
      id: `${creator.id}-example-hydration`,
      isExample: true,
      creatorId: creator.id,
      creatorName: creator.name,
      title: 'Hydration in Motion — Beverage Video Ad',
      description: 'Example concept: an energetic hydration spot pairing a product close-up with an athlete taking a refreshing break. Suitable as a short social campaign preview.',
      mediaType: 'video',
      thumbnailUrl: DEMO_STOCK_VIDEOS.beverage.thumbnailUrl,
      mediaUrl: DEMO_STOCK_VIDEOS.beverage.url,
      aspectRatio: '16:9',
      contentType: 'Cinematic 16:9 Video',
      toolsUsed,
      primaryModel,
      promptRecipe: {
        positivePrompt: 'Cinematic beverage campaign, refreshing drink after a workout, crisp product close-up, natural sunlight, smooth camera push-in, energetic but authentic mood, clean background, premium commercial color grade.',
        negativePrompt: 'unreadable label, warped packaging, flicker, unnatural motion, oversaturated colors',
        seedNumber: 492019,
        cfgScale: 6,
        sampler: 'DPM++ 2M Karras',
        cameraMovement: 'Slow push-in to product close-up',
      },
      workflowPipeline,
      commercialLicensing,
      clientOrContext: 'Example concept — not client work',
      likesCount: 0,
      viewsCount: 0,
      completionYear: 'Example',
    },
  ];

  return {
    ...creator,
    creatorProfile: {
      ...profile,
      portfolio: examplePortfolio,
    },
  };
}
