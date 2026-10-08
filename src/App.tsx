import React, { useState, useEffect } from 'react';
import { User, CreativeBrief, EngagementRequest, WorkSubmission } from './types';
import { INITIAL_CREATORS, INITIAL_BRANDS, INITIAL_ENGAGEMENTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CreatorDirectory } from './components/CreatorDirectory';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { BriefBuilderModal } from './components/BriefBuilderModal';
import { ConnectModal } from './components/ConnectModal';
import { DeliveryModal } from './components/DeliveryModal';
import { EngagementsView } from './components/EngagementsView';
import { BrandDashboard } from './components/BrandDashboard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { DataModelSpec } from './components/DataModelSpec';
import { VentureThesisModal } from './components/VentureThesisModal';
import { BriefsListView } from './components/BriefsListView';
import { MatchmakingPanel } from './components/MatchmakingPanel';
import { NdaModal } from './components/NdaModal';
import { PaymentModal } from './components/PaymentModal';
import { WorkspacePanel } from './components/WorkspacePanel';
import { WalletView } from './components/WalletView';
import { SecurityCenter } from './components/SecurityCenter';
import { TwoFactorModal } from './components/TwoFactorModal';
import { usePersistentState } from './lib/persist';
import { encryptText, decryptText, randomSecret } from './lib/crypto';
import { buildMilestones } from './lib/payments';
import { EscrowInfo } from './types';

const SAMPLE_USER_IDS = new Set([...INITIAL_CREATORS, ...INITIAL_BRANDS].map(user => user.id));
const SAMPLE_ENGAGEMENT_IDS = new Set(INITIAL_ENGAGEMENTS.map(engagement => engagement.id));
const SAMPLE_BRIEF_IDS = new Set(['brief-1', 'brief-2']);

export default function App() {
  // App state
  const [users, setUsers] = usePersistentState<User[]>('kampus.v2.users', []);
  const [currentUser, setCurrentUser] = usePersistentState<User | null>('kampus.v2.user', null);
  const [activeTab, setActiveTab] = useState<'directory' | 'briefs' | 'engagements' | 'data-model' | 'thesis' | 'dashboard' | 'wallet' | 'security'>('directory');

  useEffect(() => {
    setUsers(existingUsers => existingUsers
      .filter(user => !SAMPLE_USER_IDS.has(user.id))
      .map(user => {
        const profile = user.creatorProfile;
        const metrics = profile?.metrics;
        const hasLegacyRegistrationDefaults = profile?.location === 'San Francisco, CA'
          && profile.experienceYears === 3
          && profile.projectRateMin === 3000
          && profile.turnaroundDays === 3;
        const hasLegacyPlaceholderStats = metrics?.completedJobs === 12
          && metrics.onTimeRate === 100
          && metrics.repeatHireRate === 90
          && metrics.rating === 4.95
          && metrics.totalEarnings === '$45,000';
        if (!profile || (!hasLegacyRegistrationDefaults && !hasLegacyPlaceholderStats)) return user;

        return {
          ...user,
          creatorProfile: {
            ...profile,
            ...(hasLegacyRegistrationDefaults ? {
              location: 'Not specified',
              experienceYears: 0,
              projectRateMin: 0,
              turnaroundDays: 0,
            } : {}),
            metrics: {
              completedJobs: hasLegacyPlaceholderStats ? 0 : metrics.completedJobs,
              onTimeRate: hasLegacyPlaceholderStats ? 0 : metrics.onTimeRate,
              repeatHireRate: hasLegacyPlaceholderStats ? 0 : metrics.repeatHireRate,
              rating: hasLegacyPlaceholderStats ? 0 : metrics.rating,
              totalEarnings: hasLegacyPlaceholderStats ? '$0' : metrics.totalEarnings,
            },
            verificationSignals: hasLegacyPlaceholderStats
              ? profile.verificationSignals.filter(signal => signal.title !== 'Kampus.VC Verified Creator')
              : profile.verificationSignals,
          },
        };
      }));
    if (currentUser && SAMPLE_USER_IDS.has(currentUser.id)) {
      setCurrentUser(null);
    }
  }, [currentUser, setCurrentUser, setUsers]);

  // Briefs and Engagements state
  const [briefs, setBriefs] = usePersistentState<CreativeBrief[]>('kampus.v2.briefs', []);
  const [engagements, setEngagements] = usePersistentState<EngagementRequest[]>('kampus.v2.engagements', []);

  useEffect(() => {
    setBriefs(existingBriefs => existingBriefs.filter(brief => !SAMPLE_BRIEF_IDS.has(brief.id)));
    setEngagements(existingEngagements => existingEngagements.filter(engagement => !SAMPLE_ENGAGEMENT_IDS.has(engagement.id)));
  }, [setBriefs, setEngagements]);

  // New feature state
  const [matchBrief, setMatchBrief] = useState<CreativeBrief | null>(null);
  const [paymentEngId, setPaymentEngId] = useState<string | null>(null);
  const [ndaEngId, setNdaEngId] = useState<string | null>(null);
  const [workspaceEngId, setWorkspaceEngId] = useState<string | null>(null);
  const [pending2FA, setPending2FA] = useState<User | null>(null);

  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState<User | null>(null);
  const [selectedCreatorForConnect, setSelectedCreatorForConnect] = useState<User | null>(null);
  const [isBriefBuilderOpen, setIsBriefBuilderOpen] = useState(false);
  const [briefInitialPrompt, setBriefInitialPrompt] = useState('');
  const [activeBriefFilter, setActiveBriefFilter] = useState<CreativeBrief | null>(null);
  const [deliveryModalEngagement, setDeliveryModalEngagement] = useState<EngagementRequest | null>(null);

  // Filter creators from user pool
  const creators = users.filter(user => (
    user.role === 'creator' &&
    !SAMPLE_USER_IDS.has(user.id) &&
    Boolean(user.creatorProfile)
  ));

  // Handle Login
  const handleLogin = (user: User) => {
    const latest = users.find((u) => u.id === user.id) || user;
    setActiveTab('directory');
    setIsAuthOpen(false);
    if (latest.twoFactorEnabled && latest.twoFactorSecret) {
      setPending2FA(latest); // must pass the authenticator code first
      return;
    }
    setCurrentUser(latest);
  };

  // Handle Register
  const handleRegister = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveTab('directory');
    setIsAuthOpen(false);

    // If Brand registered, automatically offer AI suggestions as requested in workflow
    if (newUser.role === 'brand') {
      const p = newUser.brandProfile?.purpose || 'Cinematic generative commercial';
      setBriefInitialPrompt(p);
      setIsBriefBuilderOpen(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthOpen(true);
    setAuthMode('login');
  };

  // Brief creation handler
  const handleBriefCreated = (newBrief: CreativeBrief) => {
    setBriefs(prev => [newBrief, ...prev]);
    setMatchBrief(newBrief); // smart matchmaking: show top creators right away
  };

  // When a brief triggers creator exploration
  const handleExploreCreatorsForBrief = (brief: CreativeBrief) => {
    setActiveBriefFilter(brief);
    setActiveTab('directory');
  };

  // Commission engagement submission handler
  const handleSubmitEngagement = (incoming: EngagementRequest) => {
    const brief = briefs.find(b => b.id === incoming.briefId);
    const newEngagement: EngagementRequest = { ...incoming, ndaRequired: !!brief?.ndaRequired, escrow: { funded: false } };
    setEngagements(prev => [newEngagement, ...prev]);
    setPaymentEngId(newEngagement.id); // brand funds escrow before work can start
    setActiveTab('engagements');
  };

  const updateEngagement = (id: string, patch: Partial<EngagementRequest>) =>
    setEngagements(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));

  const handleFundEscrow = (id: string, escrow: EscrowInfo) => {
    updateEngagement(id, { escrow });
    setPaymentEngId(null);
  };

  const inviteCreator = (creator: User, brief: CreativeBrief) => {
    if (engagements.some(e => e.briefId === brief.id && e.creatorId === creator.id)) return;
    const eng: EngagementRequest = {
      id: `eng-${Date.now()}-${creator.id}`,
      briefId: brief.id,
      briefTitle: brief.title,
      brandId: brief.brandId,
      brandName: brief.brandName,
      brandAvatar: brief.brandLogo,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorAvatar: creator.avatarUrl,
      status: 'pending',
      proposedBudget: brief.budget,
      deadline: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      aspectRatio: brief.aspectRatios[0] || '16:9',
      contentType: brief.contentType,
      notes: 'Invited by smart matchmaking.',
      deliveryMode: 'platform',
      milestones: buildMilestones(brief.budget),
      createdAt: new Date().toISOString().split('T')[0],
      ndaRequired: !!brief.ndaRequired,
      escrow: { funded: false },
    };
    setEngagements(prev => [eng, ...prev]);
  };

  const handleReview = (id: string, rating: number, text: string) =>
    updateEngagement(id, { review: { rating, text, at: new Date().toISOString() } });

  const handleSignNda = (id: string) => {
    updateEngagement(id, { ndaSignedAt: new Date().toISOString(), status: 'in_progress' });
    setNdaEngId(null);
  };

  // Delivery submission handler
  const handleSubmitDelivery = async (submission: WorkSubmission) => {
    // Smart Delivery Box: seeds/prompts are AES-256-GCM encrypted and stay locked until final payment clears
    const secret = randomSecret();
    const vault = await encryptText(submission.seedManifestJson, secret);
    setEngagements(prev => prev.map(e => {
      if (e.id === submission.engagementId) {
        return {
          ...e,
          status: 'delivered',
          vault,
          vaultKey: secret,
          submission: {
            ...submission,
            seedManifestJson: 'LOCKED (AES-256-GCM). Prompts, seed numbers and workflow files unlock after the brand signs off and final payment clears.'
          }
        };
      }
      return e;
    }));
  };

  // Approve submission
  const handleApproveSubmission = async (engagementId: string) => {
    const target = engagements.find(e => e.id === engagementId);
    if (target?.escrow && !target.escrow.funded) {
      alert('Fund the escrow first.');
      return;
    }
    let unlocked: string | undefined;
    if (target?.vault && target.vaultKey) {
      try { unlocked = await decryptText(target.vault, target.vaultKey); } catch { unlocked = undefined; }
    }
    setEngagements(prev => prev.map(e => {
      if (e.id === engagementId) {
        return {
          ...e,
          status: 'completed',
          vaultUnlocked: unlocked ? true : e.vaultUnlocked,
          submission: e.submission ? {
            ...e.submission,
            status: 'approved',
            clientSigned: true,
            seedManifestJson: unlocked ?? e.submission.seedManifestJson
          } : undefined,
          milestones: e.milestones.map(m => ({ ...m, status: 'approved' }))
        };
      }
      return e;
    }));
  };

  // Accept engagement (by creator)
  const handleAcceptEngagement = (engagementId: string) => {
    const eng = engagements.find(e => e.id === engagementId);
    if (!eng) return;
    if (eng.escrow && !eng.escrow.funded) {
      alert('The brand has not funded escrow yet. You can accept once the payment is locked.');
      return;
    }
    if (eng.ndaRequired && !eng.ndaSignedAt) {
      setNdaEngId(engagementId); // stealth project: NDA first
      return;
    }
    updateEngagement(engagementId, { status: 'in_progress' });
  };

  // Decline engagement (by creator)
  const handleDeclineEngagement = (engagementId: string) => {
    setEngagements(prev => prev.map(e => {
      if (e.id === engagementId) {
        return { ...e, status: 'declined' };
      }
      return e;
    }));
  };

  // Approve single milestone
  const handleApproveMilestone = (engagementId: string, milestoneId: string) => {
    setEngagements(prev => prev.map(e => {
      if (e.id === engagementId) {
        return {
          ...e,
          milestones: e.milestones.map(m => m.id === milestoneId ? { ...m, status: 'approved' } : m)
        };
      }
      return e;
    }));
  };

  // Update creator profile
  const handleUpdateCreatorProfile = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  // Stealth briefs are hidden from everyone except the owner brand and invited creators
  const visibleBriefs = briefs.filter(brief => {
    if (SAMPLE_BRIEF_IDS.has(brief.id)) return false;
    if (currentUser?.role === 'brand') return brief.brandId === currentUser.id;
    if (brief.isStealth) {
      return brief.brandId === currentUser?.id || engagements.some(
        engagement => engagement.briefId === brief.id && engagement.creatorId === currentUser?.id
      );
    }
    return brief.status === 'published';
  });
  const userEngagements = currentUser
    ? engagements.filter(engagement => currentUser.role === 'brand'
      ? engagement.brandId === currentUser.id
      : engagement.creatorId === currentUser.id)
    : [];

  // Ask search engines not to index while stealth briefs are on screen.
  // (In production also send an X-Robots-Tag: noindex header from the server for those routes.)
  useEffect(() => {
    let m = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
    const showingBriefs = activeTab === 'briefs' || (activeTab === 'directory' && currentUser?.role === 'creator');
    m.content = showingBriefs && visibleBriefs.some(b => b.noIndex) ? 'noindex, nofollow' : 'index, follow';
  }, [activeTab, currentUser?.role, visibleBriefs]);

  const paymentEng = engagements.find(e => e.id === paymentEngId) || null;
  const ndaEng = engagements.find(e => e.id === ndaEngId) || null;
  const workspaceEng = engagements.find(e => e.id === workspaceEngId) || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      
      {/* Primary Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: CREATOR DIRECTORY */}
        {activeTab === 'directory' && (
          currentUser?.role === 'creator' ? (
            <BriefsListView
              briefs={visibleBriefs.filter(brief => brief.status === 'published')}
              currentUser={currentUser}
              onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)}
              onExploreCreatorsForBrief={handleExploreCreatorsForBrief}
            />
          ) : currentUser?.role === 'brand' ? (
            <CreatorDirectory
              creators={creators}
              onSelectCreator={(creator) => setSelectedCreatorForProfile(creator)}
              onConnectCreator={(creator) => setSelectedCreatorForConnect(creator)}
              activeBriefFilter={activeBriefFilter}
              onClearBriefFilter={() => setActiveBriefFilter(null)}
              onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)}
              onRequireAccount={() => {
                setAuthMode('register');
                setIsAuthOpen(true);
              }}
              isBrandUser
            />
          ) : (
            <div className="space-y-12">
              <CreatorDirectory
                creators={creators}
                onSelectCreator={(creator) => setSelectedCreatorForProfile(creator)}
                onConnectCreator={(creator) => setSelectedCreatorForConnect(creator)}
                activeBriefFilter={activeBriefFilter}
                onClearBriefFilter={() => setActiveBriefFilter(null)}
                onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)}
                onRequireAccount={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                }}
                isBrandUser={false}
              />
              <BriefsListView
                briefs={visibleBriefs.filter(brief => brief.status === 'published')}
                currentUser={null}
                onOpenBriefBuilder={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                }}
                onExploreCreatorsForBrief={handleExploreCreatorsForBrief}
              />
            </div>
          )
        )}

        {/* VIEW 2: BRIEFS DIRECTORY */}
        {activeTab === 'briefs' && (
          <BriefsListView
            briefs={visibleBriefs}
            currentUser={currentUser}
            onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)}
            onExploreCreatorsForBrief={handleExploreCreatorsForBrief}
          />
        )}

        {/* VIEW 3: ENGAGEMENTS & WORK DELIVERY */}
        {activeTab === 'engagements' && (
          <EngagementsView
            engagements={userEngagements}
            currentUser={currentUser}
            onOpenDeliveryModal={(eng) => setDeliveryModalEngagement(eng)}
            onApproveSubmission={handleApproveSubmission}
            onAcceptEngagement={handleAcceptEngagement}
            onDeclineEngagement={handleDeclineEngagement}
            onApproveMilestone={handleApproveMilestone}
            onOpenWorkspace={(eng) => setWorkspaceEngId(eng.id)}
            onFund={(eng) => setPaymentEngId(eng.id)}
            onReview={handleReview}
          />
        )}

        {activeTab === 'wallet' && currentUser?.role === 'creator' && (
          <WalletView currentUser={currentUser} engagements={userEngagements} onUpdateUser={handleUpdateCreatorProfile} />
        )}

        {activeTab === 'security' && currentUser && (
          <SecurityCenter currentUser={currentUser} onUpdateUser={handleUpdateCreatorProfile} />
        )}

        {/* VIEW 4: DATA MODEL ARCHITECTURE (DELIVERABLE #2) */}
        {activeTab === 'data-model' && (
          <DataModelSpec />
        )}

        {/* VIEW 5: KAMPUS.VC VENTURE THESIS & SLIDES (DELIVERABLE #3) */}
        {activeTab === 'thesis' && (
          <VentureThesisModal />
        )}

        {/* VIEW 6: USER ROLE-SPECIFIC DASHBOARD */}
        {activeTab === 'dashboard' && currentUser && (
          currentUser.role === 'brand' ? (
            <BrandDashboard
              currentUser={currentUser}
              briefs={visibleBriefs}
              engagements={userEngagements}
              onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)}
              onExploreCreatorsForBrief={handleExploreCreatorsForBrief}
              onViewAllCreators={() => setActiveTab('directory')}
              onViewEngagements={() => setActiveTab('engagements')}
            />
          ) : (
            <CreatorDashboard
              currentUser={currentUser}
              engagements={userEngagements}
              onOpenDeliveryModal={(eng) => setDeliveryModalEngagement(eng)}
              onAcceptEngagement={handleAcceptEngagement}
              onDeclineEngagement={handleDeclineEngagement}
              onUpdateCreatorProfile={handleUpdateCreatorProfile}
              onViewPortfolioModal={(c) => setSelectedCreatorForProfile(c)}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">KAMPUS.VC</span>
            <span>·</span>
            <span>Applied AI Venture Studio</span>
            <span>·</span>
            <span className="text-amber-400 font-mono">AI Content Creator Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button onClick={() => setActiveTab('data-model')} className="hover:text-zinc-200">
              Data Model Spec
            </button>
            <button onClick={() => setActiveTab('thesis')} className="hover:text-zinc-200">
              Venture Thesis Deck
            </button>
            <span>© 2026 Kampus.VC Studio</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Auth Modal (Login / Sign In Flow) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        initialMode={authMode}
        availableUsers={users.filter(user => !SAMPLE_USER_IDS.has(user.id))}
        onBrandRegisteredAndSuggest={(brandUser) => {
          setBriefInitialPrompt(brandUser.brandProfile?.purpose || '');
          setIsBriefBuilderOpen(true);
        }}
      />

      {/* 2. Creator Deep-Dive AI Portfolio Modal */}
      <CreatorProfileModal
        creator={selectedCreatorForProfile}
        isOpen={Boolean(selectedCreatorForProfile)}
        onClose={() => setSelectedCreatorForProfile(null)}
        onConnect={(creator) => {
          setSelectedCreatorForProfile(null);
          setSelectedCreatorForConnect(creator);
        }}
      />

      {/* 3. AI-Assisted Brief Builder Modal */}
      <BriefBuilderModal
        isOpen={isBriefBuilderOpen}
        onClose={() => setIsBriefBuilderOpen(false)}
        currentUser={currentUser}
        onBriefCreated={handleBriefCreated}
        onExploreCreatorsForBrief={handleExploreCreatorsForBrief}
        initialPrompt={briefInitialPrompt}
      />

      {/* 4. Connect & Commission Modal */}
      <ConnectModal
        isOpen={Boolean(selectedCreatorForConnect)}
        onClose={() => setSelectedCreatorForConnect(null)}
        creator={selectedCreatorForConnect}
        currentUser={currentUser}
        activeBriefs={briefs}
        onSubmitEngagement={handleSubmitEngagement}
      />

      {matchBrief && (
        <MatchmakingPanel
          brief={matchBrief}
          creators={creators}
          invitedIds={engagements.filter(e => e.briefId === matchBrief.id).map(e => e.creatorId)}
          onInvite={inviteCreator}
          onClose={() => setMatchBrief(null)}
        />
      )}
      {paymentEng && <PaymentModal engagement={paymentEng} onPaid={handleFundEscrow} onClose={() => setPaymentEngId(null)} />}
      {ndaEng && <NdaModal engagement={ndaEng} creatorName={ndaEng.creatorName} onSign={handleSignNda} onClose={() => setNdaEngId(null)} />}
      {workspaceEng && <WorkspacePanel engagement={workspaceEng} currentUser={currentUser} onUpdate={updateEngagement} onClose={() => setWorkspaceEngId(null)} />}
      {pending2FA && (
        <TwoFactorModal
          user={pending2FA}
          onVerified={(u) => { setCurrentUser(u); setPending2FA(null); }}
          onCancel={() => { setPending2FA(null); setIsAuthOpen(true); }}
        />
      )}
      {/* 5. Work Delivery Modal (Website Upload or Private Link) */}
      <DeliveryModal
        isOpen={Boolean(deliveryModalEngagement)}
        onClose={() => setDeliveryModalEngagement(null)}
        engagement={deliveryModalEngagement}
        onSubmitDelivery={handleSubmitDelivery}
      />

    </div>
  );
}
