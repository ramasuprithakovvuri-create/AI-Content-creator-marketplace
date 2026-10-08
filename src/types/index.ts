export type UserRole = 'brand' | 'creator';

export interface VerificationSignal {
  id: string;
  type: 'tool_verified' | 'workflow_verified' | 'enterprise_proven' | 'kampus_certified';
  title: string;
  issuer: string;
  verifiedDate: string;
  proofDetails: string;
  iconName: string;
}

export interface PromptRecipe {
  positivePrompt: string;
  negativePrompt: string;
  seedNumber: number;
  cfgScale: number;
  sampler: string;
  loraWeights?: string;
  cameraMovement?: string;
}

export interface WorkflowPipeline {
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  graphJsonAvailable: boolean;
}

export interface CommercialLicensing {
  rightsTier: 'Full Enterprise Buyout' | 'Digital Commercial' | 'Broadcast / Global' | 'Social Channels';
  indemnityProtected: boolean;
  copyrightCleanModels: boolean;
  allowSublicensing: boolean;
}

export interface PortfolioItem {
  id: string;
  isExample?: boolean;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  mediaType: 'video' | 'image';
  thumbnailUrl: string;
  mediaUrl: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '2.39:1';
  contentType: string;
  toolsUsed: string[];
  primaryModel: string;
  promptRecipe: PromptRecipe;
  workflowPipeline: WorkflowPipeline;
  commercialLicensing: CommercialLicensing;
  clientOrContext: string;
  likesCount: number;
  viewsCount: number;
  completionYear: string;
  // portfolio lab (added, all optional)
  beforeImageUrl?: string;
  poseGallery?: string[];
  customStyleName?: string;
}

export interface CreatorProfile {
  headline: string;
  bio: string;
  location: string;
  experienceYears: number;
  specialization: string;
  contentTypes: string[];
  tools: string[];
  skills: string[];
  hourlyRate: number;
  projectRateMin: number;
  turnaroundDays: number;
  portfolio: PortfolioItem[];
  verificationSignals: VerificationSignal[];
  metrics: {
    completedJobs: number;
    onTimeRate: number;
    repeatHireRate: number;
    rating: number;
    totalEarnings: string;
  };
  sampleWorkDetails?: string;
}

export interface BrandProfile {
  companyName: string;
  brandName: string;
  industry: string;
  purpose: string;
  expectedFeatures: string[];
  website?: string;
  companySize?: string;
  headquarters?: string;
  budgetTier?: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  mobileNumber: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  creatorProfile?: CreatorProfile;
  brandProfile?: BrandProfile;
  // security & integrations (added)
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string; // DEMO ONLY: store server-side in production
  ssoDomain?: string;
  authProvider?: string;
  hubs?: Record<string, string>;
  payout?: { method: string; handle: string };
}

export interface CreativeBrief {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  conceptSummary: string;
  industry: string;
  objective: string;
  contentType: string;
  visualStyle: string;
  aspectRatios: string[];
  targetAudience: string;
  recommendedModelStack: string[];
  promptGuidelines: string;
  commercialLicensing: string;
  budget: number;
  timeline: string;
  status: 'published' | 'in_review' | 'contracted' | 'completed';
  createdAt: string;
  suggestedSkills: string[];
  // privacy & targeting (added)
  isStealth?: boolean;
  ndaRequired?: boolean;
  noIndex?: boolean;
  budgetTier?: string;
  preferredModels?: string[];
  visualStyleTags?: string[];
  deliverables?: string[];
}

export interface WorkSubmission {
  id: string;
  engagementId: string;
  submittedAt: string;
  deliveryMethod: 'platform_upload' | 'private_encrypted_link';
  mediaUrl: string;
  privateAccessCode?: string;
  privateLinkUrl?: string;
  seedManifestJson: string;
  comfyUiGraphAvailable: boolean;
  notes: string;
  licenseCertificateId: string;
  licenseTier: string;
  clientSigned: boolean;
  status: 'pending_review' | 'approved' | 'revision_requested';
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'in_review' | 'approved';
}

export interface EngagementRequest {
  id: string;
  briefId?: string;
  briefTitle: string;
  brandId: string;
  brandName: string;
  brandAvatar: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'declined';
  proposedBudget: number;
  deadline: string;
  aspectRatio: string;
  contentType: string;
  notes: string;
  deliveryMode: 'platform' | 'private';
  milestones: Milestone[];
  createdAt: string;
  submission?: WorkSubmission;
  // transaction & collaboration (added)
  escrow?: EscrowInfo;
  ndaRequired?: boolean;
  ndaSignedAt?: string;
  messages?: WorkspaceMessage[];
  pins?: FeedbackPin[];
  vault?: EncryptedVault;
  vaultKey?: string; // DEMO ONLY: in production this key lives server-side and is released after payment clears
  vaultUnlocked?: boolean;
  review?: { rating: number; text: string; at: string };
}

export interface WorkspaceMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  at: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface FeedbackPin {
  id: string;
  attachmentUrl: string;
  x: number; // percent
  y: number; // percent
  comment: string;
  authorName: string;
  at: string;
}

export interface EncryptedVault {
  cipher: string;
  iv: string;
  salt: string;
}

export interface EscrowInfo {
  funded: boolean;
  gateway?: 'Razorpay' | 'Stripe';
  paymentToken?: string;
  cardLast4?: string;
  platformFeePct?: number;
  fundedAt?: string;
}
