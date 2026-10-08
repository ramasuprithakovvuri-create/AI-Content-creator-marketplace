import React, { useState } from 'react';
import { Database, FileCode, Check, Copy, ShieldCheck, Cpu, Layers } from 'lucide-react';

export const DataModelSpec: React.FC = () => {
  const [activeSchemaTab, setActiveSchemaTab] = useState<'profile' | 'brief' | 'verification' | 'commercial'>('profile');
  const [copied, setCopied] = useState(false);

  const SCHEMAS = {
    profile: {
      title: 'Creator Profile & AI-Native Portfolio Schema',
      description: 'Captures generative tooling stacks, latent seed recipes, multi-stage workflow graphs, and performance metrics.',
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "KampusAICreatorProfile",
  "type": "object",
  "required": ["id", "name", "tools", "skills", "specialization", "portfolio"],
  "properties": {
    "id": { "type": "string", "description": "Unique creator UUID" },
    "name": { "type": "string" },
    "headline": { "type": "string", "example": "AI Film Director & Runway Gen-3 Specialist" },
    "tools": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Mastered AI models and generation frameworks",
      "example": ["Runway Gen-3 Alpha", "Midjourney v6.1", "ComfyUI", "Flux.1 Pro", "Kling 1.5", "ElevenLabs"]
    },
    "skills": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Production capabilities and consistency controls",
      "example": ["LoRA Character Locking", "Camera Path Control", "Photoreal Lighting", "4K Temporal Denoising"]
    },
    "specialization": {
      "type": "string",
      "enum": ["AI Cinema & Commercials", "Hyper-real Product Visualization", "Automotive & Action", "Social UGC & Viral 9:16"]
    },
    "rates": {
      "type": "object",
      "properties": {
        "hourlyRateUSD": { "type": "number" },
        "projectSprintMinUSD": { "type": "number", "minimum": 500 },
        "averageTurnaroundDays": { "type": "integer", "minimum": 1 }
      }
    },
    "portfolio": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "primaryModel": { "type": "string", "example": "Runway Gen-3 Alpha" },
          "aspectRatio": { "type": "string", "enum": ["16:9", "9:16", "1:1", "2.39:1", "4:5"] },
          "promptRecipe": {
            "type": "object",
            "properties": {
              "positivePrompt": { "type": "string" },
              "negativePrompt": { "type": "string" },
              "seedNumber": { "type": "integer" },
              "cfgScale": { "type": "number" },
              "sampler": { "type": "string" },
              "cameraMovement": { "type": "string" }
            }
          },
          "workflowPipeline": {
            "type": "object",
            "properties": {
              "stage1": { "type": "string", "description": "Styleframing & prompt tokens" },
              "stage2": { "type": "string", "description": "Latent control & LoRA training" },
              "stage3": { "type": "string", "description": "Motion synthesis & seed locks" },
              "stage4": { "type": "string", "description": "Upscaling, lip sync & color grade" },
              "graphJsonAvailable": { "type": "boolean" }
            }
          }
        }
      }
    }
  }
}`
    },
    brief: {
      title: 'Campaign Creative Brief Schema',
      description: 'Captures campaign objectives, required aspect ratios, model stack boundaries, prompt guidance, and milestone escrow gates.',
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "KampusCreativeBrief",
  "type": "object",
  "required": ["id", "brandId", "title", "contentType", "aspectRatios", "recommendedModelStack", "commercialLicensing", "budget"],
  "properties": {
    "id": { "type": "string" },
    "brandId": { "type": "string" },
    "brandName": { "type": "string" },
    "title": { "type": "string", "example": "The Solis Apex: Midnight Desert Horizon Campaign" },
    "conceptSummary": { "type": "string" },
    "industry": { "type": "string" },
    "contentType": {
      "type": "string",
      "example": "Cinematic 16:9 Video + 9:16 Vertical Cutdowns"
    },
    "visualStyle": { "type": "string" },
    "aspectRatios": {
      "type": "array",
      "items": { "type": "string" },
      "example": ["16:9 Cinematic 4K", "9:16 Vertical Mobile", "1:1 Billboard"]
    },
    "recommendedModelStack": {
      "type": "array",
      "items": { "type": "string" },
      "example": ["Runway Gen-3 Alpha", "Kling 1.5", "Midjourney v6.1", "Flux.1 Pro"]
    },
    "promptGuidelines": {
      "type": "string",
      "description": "Technical prompt constraints (negative tokens, camera angles, color gamut)"
    },
    "commercialLicensing": {
      "type": "string",
      "example": "Full Enterprise Buyout, 36-Month Global Exclusive, AI Model Legal Indemnity Included"
    },
    "budgetUSD": { "type": "number", "minimum": 1000 },
    "timeline": { "type": "string", "example": "10 Days Turnaround (4 Milestones)" },
    "milestoneGates": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "phase": { "type": "string" },
          "targetDays": { "type": "string" },
          "escrowPercentage": { "type": "number" }
        }
      }
    }
  }
}`
    },
    verification: {
      title: 'Creator Verification Signals & Trust Signals Schema',
      description: 'Audit logs verifying model API power-user status, ComfyUI node reproducibility, past enterprise deliverables, and Kampus Studio fellowship.',
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "KampusVerificationSignal",
  "type": "object",
  "required": ["id", "type", "title", "issuer", "verifiedDate", "proofDetails"],
  "properties": {
    "id": { "type": "string" },
    "type": {
      "type": "string",
      "enum": [
        "kampus_certified",
        "tool_verified",
        "workflow_verified",
        "enterprise_proven"
      ]
    },
    "title": { "type": "string", "example": "Runway Certified Creative Partner" },
    "issuer": { "type": "string", "example": "RunwayML Ecosystem / Civitai Pro" },
    "verifiedDate": { "type": "string" },
    "proofDetails": {
      "type": "string",
      "example": "Verified API power-user status with over 500+ commercial video renders generated with zero temporal flicker defects."
    },
    "cryptographicAuditHash": { "type": "string", "example": "sha256:8f4c2810e..." }
  }
}`
    },
    commercial: {
      title: 'Commercial Licensing, Seed Manifest & IP Indemnity Schema',
      description: 'Cryptographic binding between final master renders, model checkpoints, seed manifests, and enterprise indemnity guarantees.',
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "KampusCommercialLicensingCertificate",
  "type": "object",
  "required": ["certificateId", "engagementId", "licenseTier", "seedManifest", "modelCheckpoints", "indemnityProtected"],
  "properties": {
    "certificateId": { "type": "string", "example": "KAMPUS-LIC-2026-8849-SOLIS" },
    "engagementId": { "type": "string" },
    "licenseTier": {
      "type": "string",
      "enum": [
        "Full Enterprise Buyout (Worldwide / Perpetual)",
        "Broadcast & Global Media Rights",
        "Digital Commercial & Streaming",
        "Social Channels & Organic"
      ]
    },
    "deliveryMode": {
      "type": "string",
      "enum": ["platform_upload", "private_encrypted_vault"]
    },
    "seedManifest": {
      "type": "object",
      "properties": {
        "masterSeed": { "type": "integer" },
        "sampler": { "type": "string" },
        "cfgScale": { "type": "number" },
        "aspectRatio": { "type": "string" },
        "resolution": { "type": "string", "example": "3840x2160" },
        "fps": { "type": "integer", "example": 60 }
      }
    },
    "modelCheckpoints": {
      "type": "array",
      "items": { "type": "string" },
      "example": ["Runway Gen-3 Alpha", "Flux.1 Pro (Commercial Clean)", "ComfyUI 0.2.4"]
    },
    "comfyUiGraphJsonHandover": { "type": "boolean" },
    "indemnityProtected": { "type": "boolean", "default": true }
  }
}`
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = SCHEMAS[activeSchemaTab];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-2">
          <Database className="h-3.5 w-3.5" />
          <span>CHALLENGE DELIVERABLE #2: ARCHITECTURAL DATA MODEL NOTE</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AI Marketplace Data Model & Field Specification
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Standardized representation of AI creator competencies, generative toolchains, multi-aspect campaign briefs, verification audit trails, and commercial indemnity certificates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSchemaTab('profile')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeSchemaTab === 'profile'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Creator Profile & Portfolio</span>
        </button>

        <button
          onClick={() => setActiveSchemaTab('brief')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeSchemaTab === 'brief'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Campaign Brief Model</span>
        </button>

        <button
          onClick={() => setActiveSchemaTab('verification')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeSchemaTab === 'verification'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Verification Signals (Bonus)</span>
        </button>

        <button
          onClick={() => setActiveSchemaTab('commercial')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeSchemaTab === 'commercial'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Licensing & Seed Manifest</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">{current.title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{current.description}</p>
          </div>

          <button
            onClick={() => handleCopy(current.json)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON Schema'}</span>
          </button>
        </div>

        {/* JSON Schema Code Box */}
        <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[500px]">
          {current.json}
        </pre>
      </div>

    </div>
  );
};
