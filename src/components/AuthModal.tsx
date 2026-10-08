import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { OptionPicker } from './BriefOptions';
import { 
  X, 
  Sparkles, 
  Building2, 
  Video, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  initialMode?: 'login' | 'register';
  availableUsers: User[];
  onBrandRegisteredAndSuggest?: (brandUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  initialMode = 'login',
  availableUsers,
  onBrandRegisteredAndSuggest
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state (Matches exact prompt requirements)
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');

  // Brand-specific fields
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Creator-specific fields
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number | ''>('');

  if (!isOpen) return null;

  const EXPECTED_FEATURES_OPTIONS = [
    '4K Cinematic Commercials',
    'ComfyUI Workflow JSON Handover',
    'LoRA Character / Asset Seed Lock',
    'Full Commercial IP Buyout',
    '48-Hour Turnaround Sprints',
    'Multi-Aspect Ratios (16:9, 9:16, 1:1)',
    'Synthetic Voiceover & Lip Sync',
    'Private Encrypted Deliverables'
  ];

  const CONTENT_TYPES_OPTIONS = [
    'Cinematic 16:9 Video',
    'Vertical Reels / TikTok 9:16',
    '3D Product Visuals',
    'Fashion Commercials',
    'Automotive & Action',
    'Character Animation & IP',
    'Music Videos',
    'Surreal VFX Sequences'
  ];

  const AI_TOOLS_OPTIONS = [
    'Runway Gen-3 Alpha',
    'Midjourney v6.1',
    'Flux.1 Pro',
    'ComfyUI Custom Workflows',
    'Kling 1.5 Pro',
    'ElevenLabs Voice Synthesis',
    'Sora Preview',
    'Luma Dream Machine',
    'Topaz Video AI'
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = availableUsers.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );

    if (found) {
      onLogin(found);
      onClose();
    } else {
      setLoginError('No account found with this email. Register to create an account.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill out all required fields.');
      return;
    }
    if (!role) {
      alert('Please select a role.');
      return;
    }
    if (role === 'brand') {
      const free = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me', 'protonmail.com'];
      if (free.includes((email.split('@')[1] || '').toLowerCase())) {
        alert('Brand accounts need a business email, e.g. name@company.com');
        return;
      }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      age: Number(age),
      gender,
      mobileNumber: mobileNumber || '+1 415-000-0000',
      email,
      role,
      avatarUrl: role === 'brand' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      ...(role === 'brand' ? {
        brandProfile: {
          companyName: companyName || `${name}'s Company`,
          brandName: brandName || name,
          industry,
          purpose,
          expectedFeatures: selectedFeatures,
          website: 'https://kampus-client.example.com',
        }
      } : {
        creatorProfile: {
          headline,
          bio,
          location: 'Not specified',
          experienceYears: 0,
          specialization,
          contentTypes,
          tools,
          skills: [],
          hourlyRate: Number(hourlyRate),
          projectRateMin: 0,
          turnaroundDays: 0,
          metrics: {
            completedJobs: 0,
            onTimeRate: 0,
            repeatHireRate: 0,
            rating: 0,
            totalEarnings: '$0'
          },
          verificationSignals: [],
          portfolio: []
        }
      })
    };

    onRegister(newUser);
    onClose();

    if (role === 'brand' && onBrandRegisteredAndSuggest) {
      onBrandRegisteredAndSuggest(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KAMPUS.VC APPLIED AI VENTURE STUDIO</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? 'Welcome Back to Kampus AI' : 'Join the AI Creator Marketplace'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
            {mode === 'login'
              ? 'Log in to discover verified creators, manage active engagements, or deliver AI productions.'
              : 'Sign in to register as a Brand / Agency or an AI Creator with verified tools and workflows.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Log In (Existing Account)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In / Register (New Account)
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm transition-colors shadow-md shadow-amber-400/10 flex items-center justify-center gap-2"
            >
              <span>Log In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-zinc-400">Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Sign In / Register here
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM (Matches exact brief workflow) */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* Step A: Basic Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="maya@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Gender *
                </label>
                <input
                  type="text"
                  list="gender-options"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  placeholder="Choose an option or type your own"
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
                <datalist id="gender-options">
                  <option value="Female" />
                  <option value="Male" />
                  <option value="Non-binary" />
                  <option value="Prefer not to say" />
                </datalist>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Step B: Role Selection (Brand vs Creator) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-2">
                Select Your Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    role === 'brand'
                      ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Building2 className={`h-5 w-5 mb-1 ${role === 'brand' ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span className="text-xs font-bold">Brand / Agency</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Publish briefs & commission AI work</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    role === 'creator'
                      ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Video className={`h-5 w-5 mb-1 ${role === 'creator' ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span className="text-xs font-bold">AI Creator / Filmmaker</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Showcase models, portfolio & get hired</span>
                </button>
              </div>
            </div>

            {/* CONDITIONAL SECTION: IF BRAND */}
            {role === 'brand' && (
              <div className="space-y-3 p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Company & Campaign Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Brand / Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter brand or product name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Industry *
                  </label>
                  <input
                    type="text"
                    list="brand-industry-options"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Choose an option or type your industry"
                    className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                  <datalist id="brand-industry-options">
                    <option value="Consumer Tech & Hardware" />
                    <option value="Luxury Fashion & Cosmetics" />
                    <option value="Automotive & Mobility" />
                    <option value="Beverage & FMCG" />
                    <option value="Creative Advertising Agency" />
                    <option value="Gaming & Entertainment" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Purpose / What are you building? *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe the campaign or assets you need"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    What features & deliverables do you expect from creators?
                  </label>
                  <OptionPicker label="Features and deliverables" options={EXPECTED_FEATURES_OPTIONS} selected={selectedFeatures} onChange={setSelectedFeatures} />
                </div>
              </div>
            )}

            {/* CONDITIONAL SECTION: IF CREATOR */}
            {role === 'creator' && (
              <div className="space-y-3 p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                  <Video className="h-3.5 w-3.5" />
                  <span>Creator Work Details & Models</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Professional Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your professional headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Bio & AI Production Experience *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter your bio and production experience"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    What type of content do you create?
                  </label>
                  <OptionPicker label="Content types" options={CONTENT_TYPES_OPTIONS} selected={contentTypes} onChange={setContentTypes} accent="emerald" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    AI Tools & Models
                  </label>
                  <OptionPicker label="AI tools and models" options={AI_TOOLS_OPTIONS} selected={tools} onChange={setTools} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Primary Specialization
                    </label>
                    <input
                      type="text"
                      list="creator-specialization-options"
                      required
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Choose an option or type your specialization"
                      className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                    <datalist id="creator-specialization-options">
                      <option value="AI Cinema & Commercials" />
                      <option value="Hyper-real Product Visualization" />
                      <option value="Social UGC & Viral Vertical 9:16" />
                      <option value="Automotive & High-Action Commercials" />
                      <option value="Luxury Fashion & Runway" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Hourly Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      required
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Set Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Set Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm transition-colors shadow-md shadow-amber-400/10 flex items-center justify-center gap-2"
            >
              <span>Complete Registration & Launch</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-zinc-400">Already registered? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Log In here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
