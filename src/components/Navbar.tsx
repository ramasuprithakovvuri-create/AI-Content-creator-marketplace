import React from 'react';
import { User } from '../types';
import { 
  Sparkles, 
  Search, 
  FileText, 
  Layers, 
  Presentation, 
  Database, 
  LogOut, 
  SlidersHorizontal,
  Wallet as WalletNavIcon,
  ShieldCheck as ShieldNavIcon
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'directory' | 'briefs' | 'engagements' | 'data-model' | 'thesis' | 'dashboard' | 'wallet' | 'security';
  setActiveTab: (tab: 'directory' | 'briefs' | 'engagements' | 'data-model' | 'thesis' | 'dashboard' | 'wallet' | 'security') => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenBriefBuilder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenBriefBuilder
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('directory')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform font-black text-lg">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">KAMPUS.VC</span>
              </div>
              <p className="text-[11px] text-zinc-400 tracking-tight hidden sm:block">
                AI Content Creator Marketplace
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'directory'
                  ? 'text-white bg-zinc-800/90 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>{currentUser?.role === 'creator' ? 'Find Brand Campaigns' : 'Discover Creators'}</span>
            </button>

            {currentUser?.role !== 'creator' && (
              <button
                onClick={() => setActiveTab('briefs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'briefs'
                    ? 'text-white bg-zinc-800/90 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Creative Briefs</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('engagements')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'engagements'
                  ? 'text-white bg-zinc-800/90 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Engagements</span>
            </button>

            {currentUser?.role === 'creator' && (
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'wallet' ? 'text-white bg-zinc-800/90 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <WalletNavIcon className="h-4 w-4" />
                <span>Wallet</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'security' ? 'text-white bg-zinc-800/90 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <ShieldNavIcon className="h-4 w-4" />
                <span>Security</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('data-model')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'data-model'
                  ? 'text-amber-300 bg-amber-950/40 border border-amber-800/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
              title="Deliverable #2: Data Model Architecture"
            >
              <Database className="h-4 w-4" />
              <span>Data Model</span>
            </button>

            <button
              onClick={() => setActiveTab('thesis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'thesis'
                  ? 'text-amber-300 bg-amber-950/40 border border-amber-800/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
              title="Deliverable #3: Kampus.VC Venture Thesis & Presentation"
            >
              <Presentation className="h-4 w-4" />
              <span>Venture Deck</span>
            </button>
          </nav>
        </div>

        {/* Right CTA / User State */}
        <div className="flex items-center gap-3">
          {currentUser?.role === 'brand' && (
            <button
              onClick={onOpenBriefBuilder}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 fill-zinc-950" />
              <span>AI Brief Builder</span>
            </button>
          )}

          {currentUser ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-lg border transition-colors ${
                    activeTab === 'dashboard'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-900'
                  }`}
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-md object-cover border border-zinc-700"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-zinc-200 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 capitalize">
                      {currentUser.role === 'brand' ? (currentUser.brandProfile?.brandName || 'Brand') : 'Creator'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-md hover:bg-zinc-900 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-sm"
              >
                Sign In / Join
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
