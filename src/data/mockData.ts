import { User, CreativeBrief, EngagementRequest } from '../types';
import { DEMO_STOCK_VIDEOS } from '../lib/media';

export const INITIAL_CREATORS: User[] = [
  {
    id: 'creator-1',
    name: 'Kaelen Voss',
    age: 26,
    gender: 'Non-binary',
    mobileNumber: '+1 415-890-4412',
    email: 'kaelen.voss@studio-lux.ai',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-15',
    creatorProfile: {
      headline: 'Award-Winning AI Film Director & Runway Gen-3 Specialist',
      bio: 'Former A24 VFX compositor turned generative filmmaker. Pioneered temporal seed consistency workflows for global fashion houses and cinematic teasers. Specializing in photoreal lighting physics, camera path control, and custom LoRA character locks.',
      location: 'Berlin / San Francisco',
      experienceYears: 4,
      specialization: 'AI Cinema & Commercials',
      contentTypes: ['Cinematic 16:9 Video', 'Fashion Commercials', 'Music Videos', 'Teaser Trailers'],
      tools: ['Runway Gen-3 Alpha', 'Midjourney v6.1', 'ComfyUI', 'Flux.1 Pro', 'ElevenLabs', 'Topaz Video AI'],
      skills: ['LoRA Character Locking', 'Camera Path Scripting', 'Photoreal Specular Lighting', '4K Temporal Denoising', 'Sound Synthesis'],
      hourlyRate: 175,
      projectRateMin: 4500,
      turnaroundDays: 4,
      metrics: {
        completedJobs: 38,
        onTimeRate: 98,
        repeatHireRate: 92,
        rating: 4.96,
        totalEarnings: '$164,000'
      },
      verificationSignals: [
        {
          id: 'sig-1',
          type: 'kampus_certified',
          title: 'Kampus.VC Applied AI Fellow',
          issuer: 'Kampus Venture Studio',
          verifiedDate: 'Feb 2026',
          proofDetails: 'Rigorous peer evaluation across 10 commercial generative productions with zero artifact defects.',
          iconName: 'Award'
        },
        {
          id: 'sig-2',
          type: 'tool_verified',
          title: 'Runway Certified Creative Partner',
          issuer: 'RunwayML Ecosystem',
          verifiedDate: 'Jan 2026',
          proofDetails: 'Verified API power-user status with over 500+ commercial video renders generated.',
          iconName: 'CheckCircle2'
        },
        {
          id: 'sig-3',
          type: 'workflow_verified',
          title: 'ComfyUI Production Graph Verified',
          issuer: 'OpenArt & Civitai Enterprise',
          verifiedDate: 'Mar 2026',
          proofDetails: 'Custom multi-node workflow graph audited for repeatable seed consistency and commercial rights compliance.',
          iconName: 'GitFork'
        },
        {
          id: 'sig-4',
          type: 'enterprise_proven',
          title: 'Enterprise Brand Deliverable Verified',
          issuer: 'Balenciaga & Highsnobiety',
          verifiedDate: 'Dec 2025',
          proofDetails: 'Commercial campaign aired globally across digital OOH and social channels.',
          iconName: 'ShieldCheck'
        }
      ],
      portfolio: [
        {
          id: 'port-101',
          creatorId: 'creator-1',
          creatorName: 'Kaelen Voss',
          title: 'NEO-CHRONOS: Luxury Timepiece Campaign',
          description: 'A 45-second cinematic reveal of a zero-gravity titanium watch forging itself from molten liquid chrome into micro-gears.',
          mediaType: 'video',
          thumbnailUrl: DEMO_STOCK_VIDEOS.luxuryWatch.thumbnailUrl,
          mediaUrl: DEMO_STOCK_VIDEOS.luxuryWatch.url,
          aspectRatio: '16:9',
          contentType: 'Cinematic 16:9 Video',
          toolsUsed: ['Runway Gen-3 Alpha', 'ComfyUI', 'Flux.1 Pro', 'Topaz Video AI'],
          primaryModel: 'Runway Gen-3 Alpha',
          completionYear: '2026',
          likesCount: 842,
          viewsCount: 14200,
          clientOrContext: 'Swiss Horology Atelier Spec',
          promptRecipe: {
            positivePrompt: 'Slow dolly-in cinematic macro shot of a floating titanium chronometer watch, molten platinum tendrils wrapping around internal sapphire gears, 35mm anamorphic lens, subtle optical chromatic aberration, ray-traced reflections, 3200K rim light, ultra photorealistic, 8k render --style raw',
            negativePrompt: 'blurry, flickering, morphing hands, plastic textures, cartoon, distorted lettering, jitter',
            seedNumber: 84920412,
            cfgScale: 7.5,
            sampler: 'Euler a / Karras',
            loraWeights: 'chrono_mechanical_v2.safetensors (0.75)',
            cameraMovement: 'Smooth inward pedestal + slow 15-degree axial tilt'
          },
          workflowPipeline: {
            stage1: 'Midjourney v6.1 keyframe exploration & mechanical lighting moodboard',
            stage2: 'Flux.1 Pro latent pass for legible brand typography & gear meshing',
            stage3: 'Runway Gen-3 image-to-video with camera trajectory interpolation',
            stage4: 'Topaz Video AI 4K 60fps frame interpolation and DaVinci Resolve color timing',
            graphJsonAvailable: true
          },
          commercialLicensing: {
            rightsTier: 'Full Enterprise Buyout',
            indemnityProtected: true,
            copyrightCleanModels: true,
            allowSublicensing: true
          }
        },
        {
          id: 'port-102',
          creatorId: 'creator-1',
          creatorName: 'Kaelen Voss',
          title: 'CYBER-COUTURE: Autumn Cyberpunk Runway',
          description: 'Hyper-detailed digital models walking through a reflective rain-slicked Tokyo boulevard wearing kinetic smart-fabrics.',
          mediaType: 'video',
          thumbnailUrl: DEMO_STOCK_VIDEOS.fashionRunway.thumbnailUrl,
          mediaUrl: DEMO_STOCK_VIDEOS.fashionRunway.url,
          aspectRatio: '9:16',
          contentType: 'Fashion Commercials',
          toolsUsed: ['Midjourney v6.1', 'Kling 1.5', 'ComfyUI IP-Adapter', 'ElevenLabs'],
          primaryModel: 'Kling 1.5 Pro',
          completionYear: '2026',
          likesCount: 1290,
          viewsCount: 22100,
          clientOrContext: 'Digital Fashion Week Paris',
          promptRecipe: {
            positivePrompt: 'Full length high fashion model walking down wet asphalt runway in Shibuya neon rain, iridescent synthetic silk trench coat billowing naturally, puddles reflecting magenta and cyan billboards, high-fashion editorial, 85mm f/1.4 portrait lens, natural fabric physics',
            negativePrompt: 'extra limbs, weird face distortions, muddy lighting, bad walking stride, low quality',
            seedNumber: 4920194,
            cfgScale: 6.8,
            sampler: 'DPM++ 2M Karras',
            cameraMovement: 'Steadicam tracking backward matching model pace'
          },
          workflowPipeline: {
            stage1: '3D mannequin garment blocking with custom ComfyUI IP-Adapter LoRA',
            stage2: 'Kling 1.5 video generation for authentic walking dynamics',
            stage3: 'Face restoration via CodeFormer latent pipe',
            stage4: 'Spatial ambient rain & electronic score via ElevenLabs and Suno v3.5',
            graphJsonAvailable: true
          },
          commercialLicensing: {
            rightsTier: 'Broadcast / Global',
            indemnityProtected: true,
            copyrightCleanModels: true,
            allowSublicensing: false
          }
        }
      ]
    }
  },
  {
    id: 'creator-2',
    name: 'Aria Chen',
    age: 24,
    gender: 'Female',
    mobileNumber: '+1 206-555-8910',
    email: 'aria@generativedimensions.studio',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-02-01',
    creatorProfile: {
      headline: 'Generative 3D Artist & Flux.1 / ComfyUI Custom Node Developer',
      bio: 'Master of Science in Computational Media from Carnegie Mellon University. Creator of 3 open-source ComfyUI custom nodes downloaded over 80k times. Specializing in hyper-real product packaging, surreal botanical physics, and zero-hallucination industrial rendering.',
      location: 'New York / Seattle',
      experienceYears: 3,
      specialization: 'Hyper-real Product Visualization',
      contentTypes: ['3D Product Visuals', 'Packaging Motion Design', 'Kinetic Brand Loops', 'Interactive Assets'],
      tools: ['Flux.1 Pro', 'ComfyUI', 'Midjourney v6.1', 'Luma Dream Machine', 'Blender AI Tools'],
      skills: ['ComfyUI Custom Workflows', 'Prompt Weighting Architecture', 'Zero-Artifact Lighting', 'Brand Asset Training', 'Vector-to-Latent Mapping'],
      hourlyRate: 150,
      projectRateMin: 3200,
      turnaroundDays: 3,
      metrics: {
        completedJobs: 46,
        onTimeRate: 100,
        repeatHireRate: 95,
        rating: 4.98,
        totalEarnings: '$189,500'
      },
      verificationSignals: [
        {
          id: 'sig-21',
          type: 'kampus_certified',
          title: 'Kampus Venture Studio Alum',
          issuer: 'Kampus.VC Applied AI Incubator',
          verifiedDate: 'Jan 2026',
          proofDetails: 'Co-built neural product styling pipeline licensed to Fortune 500 beverage brands.',
          iconName: 'Award'
        },
        {
          id: 'sig-22',
          type: 'workflow_verified',
          title: 'Civitai Open-Source Workflow Star',
          issuer: 'Civitai Pro Certification',
          verifiedDate: 'Feb 2026',
          proofDetails: 'Top 1% rated node architect for industrial product generation pipelines.',
          iconName: 'GitFork'
        },
        {
          id: 'sig-23',
          type: 'enterprise_proven',
          title: 'Estée Lauder AI Campaign Verified',
          issuer: 'Global Beauty Group',
          verifiedDate: 'Jan 2026',
          proofDetails: 'Delivered 24 hero digital cosmetic renders with strict pantone color accuracy.',
          iconName: 'ShieldCheck'
        }
      ],
      portfolio: [
        {
          id: 'port-201',
          creatorId: 'creator-2',
          creatorName: 'Aria Chen',
          title: 'LUMINA: Bioluminescent Skincare Bottle',
          description: 'A tactile glass serum bottle surrounded by undulating organic crystal petals and liquid refraction caustics.',
          mediaType: 'image',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
          mediaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
          aspectRatio: '4:5' as any,
          contentType: '3D Product Visuals',
          toolsUsed: ['Flux.1 Pro', 'ComfyUI', 'Midjourney v6.1'],
          primaryModel: 'Flux.1 Pro',
          completionYear: '2026',
          likesCount: 950,
          viewsCount: 18400,
          clientOrContext: 'Clean Beauty Brand Launch',
          promptRecipe: {
            positivePrompt: 'Luxury frosted glass cosmetic dropper bottle resting on smooth basalt stone, soft bioluminescent lichen growing delicately, water droplets with authentic caustics, soft studio lighting from 45 degrees, clean modern typography label reading "LUMINA HYDRA-SERUM", photorealistic, architectural digest aesthetic',
            negativePrompt: 'distorted label, messy text, plastic looking, blurry caustics, grainy artifacts',
            seedNumber: 7129034,
            cfgScale: 4.2,
            sampler: 'Euler',
            loraWeights: 'cosmetic_glass_caustics_v1.safetensors (0.6)'
          },
          workflowPipeline: {
            stage1: '3D packaging bounding box generation with precise aspect framing',
            stage2: 'Flux.1 latent composition for exact typographic label placement',
            stage3: 'ControlNet depth map pass ensuring zero geometry distortion',
            stage4: 'Multi-layer latent upscaling to 8000x10000 print resolution',
            graphJsonAvailable: true
          },
          commercialLicensing: {
            rightsTier: 'Full Enterprise Buyout',
            indemnityProtected: true,
            copyrightCleanModels: true,
            allowSublicensing: true
          }
        }
      ]
    }
  },
  {
    id: 'creator-3',
    name: 'Marcus Thorne',
    age: 29,
    gender: 'Male',
    mobileNumber: '+44 7700 900142',
    email: 'marcus@synthcinema.co.uk',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-20',
    creatorProfile: {
      headline: 'Commercial Director & Sora / Kling 1.5 Generative Storyteller',
      bio: 'Bafta-nominated commercial director turned AI worldbuilder. Specializes in automotive commercials, high-speed camera tracking, and generative sports sequences. Combines practical cinematography theory with state-of-the-art multi-model pipelines.',
      location: 'London, UK',
      experienceYears: 5,
      specialization: 'Automotive & High-Action Commercials',
      contentTypes: ['Automotive Commercials', 'Action Sequences', 'Cinematic 16:9 Video', 'Brand Film Documentaries'],
      tools: ['Kling 1.5', 'Runway Gen-3 Alpha', 'Sora Preview', 'Midjourney v6.1', 'ElevenLabs', 'ComfyUI'],
      skills: ['High-Velocity Camera Motion', 'Atmospheric Weather Synthesis', 'Color Matching & Grading', 'Audio Spatialization', 'Script-to-Screen AI Pipeline'],
      hourlyRate: 190,
      projectRateMin: 5000,
      turnaroundDays: 5,
      metrics: {
        completedJobs: 29,
        onTimeRate: 100,
        repeatHireRate: 88,
        rating: 4.94,
        totalEarnings: '$142,800'
      },
      verificationSignals: [
        {
          id: 'sig-31',
          type: 'tool_verified',
          title: 'Kling AI Verified Creator',
          issuer: 'Kuaishou Kling Enterprise',
          verifiedDate: 'Feb 2026',
          proofDetails: 'Top tier API access with dedicated compute allocation and model early access.',
          iconName: 'CheckCircle2'
        },
        {
          id: 'sig-32',
          type: 'enterprise_proven',
          title: 'Porsche Concept Campaign Certified',
          issuer: 'Apex Creative Agency',
          verifiedDate: 'Jan 2026',
          proofDetails: 'Produced 60-second electrified concept vehicle film for Geneva reveal.',
          iconName: 'ShieldCheck'
        }
      ],
      portfolio: [
        {
          id: 'port-301',
          creatorId: 'creator-3',
          creatorName: 'Marcus Thorne',
          title: 'APEX GT: Scandinavian Mountain Drift',
          description: 'High-speed drone tracking shot of an electric hypercar drifting across icy mountain switchbacks during a vivid arctic aurora.',
          mediaType: 'video',
          thumbnailUrl: DEMO_STOCK_VIDEOS.carDrifting.thumbnailUrl,
          mediaUrl: DEMO_STOCK_VIDEOS.carDriftingAlt.url,
          aspectRatio: '16:9',
          contentType: 'Automotive Commercials',
          toolsUsed: ['Kling 1.5', 'Runway Gen-3', 'Midjourney v6.1'],
          primaryModel: 'Kling 1.5 Pro',
          completionYear: '2026',
          likesCount: 1420,
          viewsCount: 31000,
          clientOrContext: 'Hypercar Manufacturer Spec',
          promptRecipe: {
            positivePrompt: 'FPV racing drone perspective chasing a matte dark silver aerodynamic hypercar drifting around snow-dusted hairpin curve in Lofoten Norway, snow dust spray reflecting green and violet Aurora Borealis in night sky, headlights cutting through mist, anamorphic lens flare, motion blur on wheels',
            negativePrompt: 'car morphing into different model, jerky camera, cartoonish snow, unrealistic wheels',
            seedNumber: 9948210,
            cfgScale: 7.2,
            sampler: 'DPM++ SDE',
            cameraMovement: 'Fast dynamic FPV dive from 40m altitude down to rear bumper'
          },
          workflowPipeline: {
            stage1: 'Vehicle CAD line art converted into depth-map keyframe in ComfyUI',
            stage2: 'Midjourney v6.1 lighting plates with arctic twilight reference',
            stage3: 'Kling 1.5 camera trajectory prompt with high motion vector value',
            stage4: 'Topaz frame stabilization, audio engine roaring synth via ElevenLabs',
            graphJsonAvailable: true
          },
          commercialLicensing: {
            rightsTier: 'Full Enterprise Buyout',
            indemnityProtected: true,
            copyrightCleanModels: true,
            allowSublicensing: true
          }
        }
      ]
    }
  },
  {
    id: 'creator-4',
    name: 'Zoe Morales',
    age: 27,
    gender: 'Female',
    mobileNumber: '+1 310-982-3341',
    email: 'zoe@hyperreal-social.ai',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-02-10',
    creatorProfile: {
      headline: 'Viral AI Content Strategist & Vertical 9:16 UGC Specialist',
      bio: 'Former head of short-form at a Gen-Z media lab. Generated over 120M cumulative views across TikTok and Reels utilizing hyper-engaging AI character avatars, synched voice acting, and kinetic text graphics. High-throughput 48h sprint specialist.',
      location: 'Los Angeles, CA',
      experienceYears: 3,
      specialization: 'Social UGC & Viral Vertical 9:16',
      contentTypes: ['Vertical Reels 9:16', 'AI Influencer Campaigns', 'TikTok Hooks', 'Product Teasers'],
      tools: ['Flux.1 Schnell', 'Runway Gen-3', 'ElevenLabs Turbo', 'Hedra AI', 'CapCut AI'],
      skills: ['Viral Hook Engineering', 'Hyper-Real Lip Sync', 'Dynamic Vertical Framing', 'Fast-Sprint Delivery', 'Trend Adaptation'],
      hourlyRate: 125,
      projectRateMin: 2200,
      turnaroundDays: 2,
      metrics: {
        completedJobs: 64,
        onTimeRate: 100,
        repeatHireRate: 96,
        rating: 4.97,
        totalEarnings: '$178,000'
      },
      verificationSignals: [
        {
          id: 'sig-41',
          type: 'kampus_certified',
          title: 'Kampus Venture Fellow',
          issuer: 'Kampus.VC Applied AI Studio',
          verifiedDate: 'Feb 2026',
          proofDetails: 'Top performance in vertical engagement optimization benchmarks.',
          iconName: 'Award'
        },
        {
          id: 'sig-42',
          type: 'tool_verified',
          title: 'ElevenLabs Certified Audio Producer',
          issuer: 'ElevenLabs Enterprise',
          verifiedDate: 'Dec 2025',
          proofDetails: 'Over 100 hours of synthetic voice cloned and commercially deployed.',
          iconName: 'CheckCircle2'
        }
      ],
      portfolio: [
        {
          id: 'port-401',
          creatorId: 'creator-4',
          creatorName: 'Zoe Morales',
          title: 'AURA DRINK: 3-Second Viral Hook Campaign',
          description: 'A punchy vertical TikTok sequence showing a glowing holographic energy can crack open and transform a grey office into a neon paradise.',
          mediaType: 'video',
          thumbnailUrl: DEMO_STOCK_VIDEOS.beverage.thumbnailUrl,
          mediaUrl: DEMO_STOCK_VIDEOS.beverage.url,
          aspectRatio: '9:16',
          contentType: 'Vertical Reels 9:16',
          toolsUsed: ['Flux.1 Schnell', 'Runway Gen-3', 'ElevenLabs Turbo', 'Hedra'],
          primaryModel: 'Runway Gen-3 Alpha',
          completionYear: '2026',
          likesCount: 2310,
          viewsCount: 84000,
          clientOrContext: 'Direct-to-Consumer Beverage Launch',
          promptRecipe: {
            positivePrompt: 'Close up vertical POV hands opening shimmering holographic beverage can, effervescent electric blue vapor erupts in slow motion, room lighting shifts instantly from dull grey office to vibrant neon tropical sunset, extreme detail, 4k 60fps',
            negativePrompt: 'extra fingers, deformed hands, blurry fizz, low frame rate',
            seedNumber: 6610291,
            cfgScale: 6.5,
            sampler: 'Euler a',
            cameraMovement: 'Fast handheld snap-zoom from can tab to room reaction'
          },
          workflowPipeline: {
            stage1: 'Hand and product consistency trained on Flux.1 LoRA checkpoint',
            stage2: 'Runway Gen-3 image-to-video with snap zoom keyframes',
            stage3: 'Hedra and ElevenLabs synchronized high-energy narrator voiceover',
            stage4: 'Vertical caption styling and SFX integration',
            graphJsonAvailable: true
          },
          commercialLicensing: {
            rightsTier: 'Social Channels',
            indemnityProtected: true,
            copyrightCleanModels: true,
            allowSublicensing: false
          }
        }
      ]
    }
  }
];

export const INITIAL_BRANDS: User[] = [
  {
    id: 'brand-1',
    name: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    mobileNumber: '+1 415-555-7821',
    email: 'elena@solisluxury.com',
    role: 'brand',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-10',
    brandProfile: {
      companyName: 'Solis Electric Vehicles',
      brandName: 'SOLIS EV',
      industry: 'Automotive & Clean Tech',
      purpose: 'Launch our next-generation autonomous electric touring vehicle with boundary-pushing cinematic AI commercials and vertical social cutdowns.',
      expectedFeatures: [
        '4K Anamorphic Master Deliverables',
        'Seed Consistency Manifest & Workflow JSON',
        'ComfyUI Node Graph Handover',
        'Worldwide Commercial Buyout & Legal Indemnity',
        '48-Hour Iteration Turnarounds'
      ],
      website: 'https://solis-ev.example.com',
      companySize: '250-500 employees',
      headquarters: 'San Francisco, CA',
      budgetTier: '$25,000 - $75,000 per campaign'
    }
  },
  {
    id: 'brand-2',
    name: 'David Kim',
    age: 38,
    gender: 'Male',
    mobileNumber: '+1 212-555-9014',
    email: 'david.kim@vortex-agency.com',
    role: 'brand',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-02-05',
    brandProfile: {
      companyName: 'Vortex Global Creative',
      brandName: 'Vortex Agency',
      industry: 'Creative Advertising Agency',
      purpose: 'Scale client campaign output for Nike, Balenciaga, and Spotify through verified AI creators with repeatable production pipelines.',
      expectedFeatures: [
        'Custom LoRA Character Training',
        'Enterprise Model Rights Compliance',
        'Multi-Aspect Ratio Deliverables (16:9, 9:16, 1:1)',
        'Private Delivery with Encrypted Passcode',
        'Milestone Escrow Integration'
      ],
      website: 'https://vortex-agency.example.com',
      companySize: '500+ employees',
      headquarters: 'New York / London',
      budgetTier: '$50,000 - $150,000 per month'
    }
  }
];

export const INITIAL_BRIEFS: CreativeBrief[] = [
  {
    id: 'brief-1',
    brandId: 'brand-1',
    brandName: 'SOLIS EV',
    brandLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    title: 'The Solis Apex: Midnight Desert Horizon Campaign',
    conceptSummary: 'A 60-second cinematic master film capturing the Solis Apex electric coupe gliding silently through the Mojave desert under starlight, with solar-reactive body panels illuminating naturally.',
    industry: 'Automotive & Clean Tech',
    objective: 'Global Reveal Campaign for Tokyo Mobility Summit',
    contentType: 'Cinematic 16:9 Video + 9:16 Vertical Cutdowns',
    visualStyle: 'Sleek Cyber-Elegance, Anamorphic lens flare, natural dusk light transitions, deep obsidian & warm copper palette.',
    aspectRatios: ['16:9 Cinematic 4K', '9:16 Vertical Mobile', '1:1 Billboard'],
    targetAudience: 'Affluent tech founders, luxury vehicle collectors, design connoisseurs (ages 28-55).',
    recommendedModelStack: ['Runway Gen-3 Alpha', 'Kling 1.5', 'Midjourney v6.1', 'Flux.1 Pro', 'ElevenLabs Spatial Audio'],
    promptGuidelines: 'Strict adherence to vehicle chassis consistency via ControlNet line-art. Camera motion must simulate 50-foot cinematic crane sweeps and smooth low-angle car tracking.',
    commercialLicensing: 'Full Enterprise Buyout, 36-Month Global Exclusive, AI Model Legal Indemnity Included.',
    budget: 18500,
    timeline: '10 Days Turnaround (4 Milestones)',
    status: 'published',
    createdAt: '2026-03-01',
    suggestedSkills: ['High-Velocity Camera Motion', 'ComfyUI Custom Workflows', 'LoRA Character/Vehicle Locking', 'Neural Upscaling']
  },
  {
    id: 'brief-2',
    brandId: 'brand-2',
    brandName: 'Vortex Agency / Balenciaga',
    brandLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    title: 'Post-Digital Haute Couture: Micro-Macro Textile Study',
    conceptSummary: 'Extreme macro exploration of generative biomaterials weaving into avant-garde garments, transitioning seamlessly into high-fashion runway choreography.',
    industry: 'Luxury Fashion & Culture',
    objective: 'Paris Digital Fashion Week Hero Teaser',
    contentType: 'Fashion Commercials & Vertical Loops',
    visualStyle: 'Surreal High-Fashion Brutalism, Monochromatic concrete contrasted with liquid mercury draping, hyper-sharp macro texture.',
    aspectRatios: ['9:16 Vertical', '16:9 4K', '4:5 Social'],
    targetAudience: 'Fashion directors, digital culture tastemakers, luxury buyers.',
    recommendedModelStack: ['Flux.1 Pro', 'Midjourney v6.1', 'Kling 1.5', 'ComfyUI Custom LoRA'],
    promptGuidelines: 'Focus on tactile micro-details: silk threads, metallic mesh, specular refraction, zero uncanny valley artifacts on models.',
    commercialLicensing: 'Broadcast / Global Commercial Rights, Handover of ComfyUI Graph & Seed Records.',
    budget: 14000,
    timeline: '7 Days Turnaround',
    status: 'published',
    createdAt: '2026-03-05',
    suggestedSkills: ['ComfyUI Node Architecture', 'Zero-Artifact Lighting', 'Fashion Editorial Framing']
  }
];

export const INITIAL_ENGAGEMENTS: EngagementRequest[] = [
  {
    id: 'eng-1',
    briefId: 'brief-1',
    briefTitle: 'The Solis Apex: Midnight Desert Horizon Campaign',
    brandId: 'brand-1',
    brandName: 'SOLIS EV',
    brandAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    creatorId: 'creator-1',
    creatorName: 'Kaelen Voss',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'delivered',
    proposedBudget: 18500,
    deadline: '2026-03-18',
    aspectRatio: '16:9 Cinematic 4K + 9:16',
    contentType: 'Cinematic 16:9 Video',
    notes: 'Please ensure the solar glass panel reflection matches the 3200K desert dusk references. We need both the master 4K ProRes and the ComfyUI pipeline JSON.',
    deliveryMode: 'platform',
    createdAt: '2026-03-04',
    milestones: [
      { id: 'm1', title: 'Milestone 1: 12 Keyframe Styleframes & Vehicle LoRA Lock', dueDate: '2026-03-07', amount: 4500, status: 'approved' },
      { id: 'm2', title: 'Milestone 2: Motion Animatics & Camera Trajectory', dueDate: '2026-03-11', amount: 5500, status: 'approved' },
      { id: 'm3', title: 'Milestone 3: 4K Neural Upscaling & Sound Design', dueDate: '2026-03-15', amount: 4500, status: 'approved' },
      { id: 'm4', title: 'Milestone 4: Master Handover & IP Commercial Certificate', dueDate: '2026-03-18', amount: 4000, status: 'in_review' }
    ],
    submission: {
      id: 'sub-1',
      engagementId: 'eng-1',
      submittedAt: '2026-03-16T14:20:00Z',
      deliveryMethod: 'platform_upload',
      mediaUrl: DEMO_STOCK_VIDEOS.carDrifting.url,
      seedManifestJson: JSON.stringify({
        masterSeed: 84920412,
        modelStack: ['Runway Gen-3 Alpha', 'Flux.1 Pro', 'ComfyUI 0.2.4', 'Topaz Video AI 5.2'],
        loraCheckpoints: ['solis_apex_v4_chassis.safetensors (hash: 7d4a8f9)'],
        aspectRatio: '3840x2160 (16:9 Anamorphic)',
        fps: 60,
        colorSpace: 'ACEScg / Rec.709'
      }, null, 2),
      comfyUiGraphAvailable: true,
      notes: 'Final master render delivered in 4K 60fps. All 4 camera trajectory sequences locked with zero temporal jitter. ComfyUI workflow JSON and LoRA checkpoint weights bundled.',
      licenseCertificateId: 'KAMPUS-LIC-2026-8849-SOLIS',
      licenseTier: 'Full Enterprise Buyout (Worldwide / Perpetual)',
      clientSigned: false,
      status: 'pending_review'
    }
  },
  {
    id: 'eng-2',
    briefTitle: 'LUMINA Skin Science: 3D Product Renders',
    brandId: 'brand-2',
    brandName: 'Vortex Agency',
    brandAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    creatorId: 'creator-2',
    creatorName: 'Aria Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    status: 'in_progress',
    proposedBudget: 6800,
    deadline: '2026-03-24',
    aspectRatio: '4:5 Social & 16:9',
    contentType: '3D Product Visuals',
    notes: 'We need 6 hero product angles with photoreal caustics. Delivering via Private Encrypted Link upon final approval.',
    deliveryMode: 'private',
    createdAt: '2026-03-10',
    milestones: [
      { id: 'm21', title: 'Milestone 1: 3D Depth Map Alignment & Label Typography', dueDate: '2026-03-14', amount: 2500, status: 'approved' },
      { id: 'm22', title: 'Milestone 2: Final 8K Print Renders & Private Delivery Vault', dueDate: '2026-03-24', amount: 4300, status: 'pending' }
    ]
  }
];

export const KAMPUS_STUDIO_THESIS = {
  headline: 'Kampus.VC Applied AI Venture Thesis: The AI Creative Labor Stack',
  subheadline: 'Why legacy platforms (Upwork, Fiverr) fail at Generative AI, and how Kampus.VC builds the categorical AI creator marketplace.',
  pillars: [
    {
      title: '1. Tool & Workflow Specificity',
      legacyProblem: 'Upwork categorizes talent by "Video Editor" or "Graphic Designer". It has no awareness of ComfyUI custom node graphs, latent seed consistency, or checkpoint training.',
      kampusSolution: 'Kampus marketplace inspects and indexes creator pipelines by exact models (Runway Gen-3, Kling 1.5, Flux.1, ComfyUI), prompt architectures, and seed repeatability metrics.',
      metric: '94% higher first-generation client acceptance rate'
    },
    {
      title: '2. Commercial Indemnity & Clean Provenance',
      legacyProblem: 'Brands fear generative copyright lawsuits, poisoned training sets, and unverified AI models that trigger trademark infringement.',
      kampusSolution: 'Every engagement includes Kampus AI Model Provenance verification, clean commercial licensing tiers, and cryptographic seed/checkpoint handover.',
      metric: 'Zero copyright claims across 250+ enterprise deliverables'
    },
    {
      title: '3. University AI Talent Pipeline',
      legacyProblem: 'Legacy platforms rely on generic commodity labor with declining client retention.',
      kampusSolution: 'Kampus.VC operates an Applied AI Venture Studio directly connected with premier university computer science & generative media labs (MIT, CMU, Stanford, Oxford).',
      metric: 'Top 3% elite creators incubated directly through Kampus Studio'
    },
    {
      title: '4. AI-Assisted Brief & Milestone Escrow',
      legacyProblem: 'Brands submit vague briefs that hallucinate or waste thousands in API compute costs due to misalignment on aspect ratio and camera movements.',
      kampusSolution: 'Our Gemini-powered Brief Builder structures rough prompts into camera trajectories, prompt tokens, model stacks, and milestone-gated escrow contracts.',
      metric: '3.8x faster briefing-to-production sprint cycle'
    }
  ]
};
