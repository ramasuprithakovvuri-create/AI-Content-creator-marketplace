import express, { type Request, type Response } from 'express';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose, { Schema } from 'mongoose';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';

type Provider = 'google' | 'discord' | 'github';

interface Identity {
  provider: Provider;
  providerId: string;
}

interface OAuthAccount {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  avatarUrl: string;
  identities: Identity[];
  role?: 'brand' | 'creator';
  brandProfile?: Record<string, unknown>;
  creatorProfile?: Record<string, unknown>;
  createdAt: Date;
}

type OAuthAccountDocument = mongoose.HydratedDocument<OAuthAccount>;

interface ProviderProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  avatarUrl: string;
}

interface ProviderConfig {
  authorizationURL: string;
  tokenURL: string;
  profileURL: string;
  scopes: string[];
  clientId?: string;
  clientSecret?: string;
}

class InputError extends Error {}

declare global {
  namespace Express {
    interface User {
      accountId: string;
    }
  }
}

const accountSchema = new Schema<OAuthAccount>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  identities: [{
    provider: { type: String, required: true, enum: ['google', 'discord', 'github'] },
    providerId: { type: String, required: true },
  }],
  role: { type: String, enum: ['brand', 'creator'] },
  brandProfile: { type: Schema.Types.Mixed },
  creatorProfile: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
}, { minimize: false });

accountSchema.index({ 'identities.provider': 1, 'identities.providerId': 1 }, { unique: true });
const Account = mongoose.models.OAuthAccount || mongoose.model<OAuthAccount>('OAuthAccount', accountSchema);

const providerConfigs: Record<Provider, ProviderConfig> = {
  google: {
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    profileURL: 'https://openidconnect.googleapis.com/v1/userinfo',
    scopes: ['openid', 'email', 'profile'],
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  discord: {
    authorizationURL: 'https://discord.com/oauth2/authorize',
    tokenURL: 'https://discord.com/api/oauth2/token',
    profileURL: 'https://discord.com/api/users/@me',
    scopes: ['identify', 'email'],
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
  },
  github: {
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token',
    profileURL: 'https://api.github.com/user',
    scopes: ['read:user', 'user:email'],
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
};

const providerNames: Record<Provider, string> = {
  google: 'Google',
  discord: 'Discord',
  github: 'GitHub',
};

function getString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

async function fetchJson(url: string, accessToken: string, provider: Provider): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };
  if (provider === 'github') {
    headers.Accept = 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2022-11-28';
    headers['User-Agent'] = 'Kampus-Creator-Marketplace';
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`${providerNames[provider]} profile request failed (${response.status}).`);
  }
  return await response.json() as Record<string, unknown>;
}

export async function loadProviderProfile(provider: Provider, accessToken: string): Promise<ProviderProfile> {
  const config = providerConfigs[provider];
  const profile = await fetchJson(config.profileURL, accessToken, provider);
  const rawId = provider === 'google' ? profile.sub : profile.id;
  const id = typeof rawId === 'string' || typeof rawId === 'number' ? String(rawId) : '';
  let email = '';
  let emailVerified = false;

  if (provider === 'google') {
    email = getString(profile.email);
    emailVerified = profile.email_verified === true;
  } else if (provider === 'discord') {
    email = getString(profile.email);
    emailVerified = profile.verified === true;
  } else {
    const emails = await fetchJson('https://api.github.com/user/emails', accessToken, provider);
    if (!Array.isArray(emails)) {
      throw new Error('GitHub did not return an email list.');
    }
    const emailEntries = emails.filter((entry): entry is Record<string, unknown> => (
      typeof entry === 'object' && entry !== null
    ));
    const selectedEmail = emailEntries.find(entry => entry.primary === true && entry.verified === true)
      || emailEntries.find(entry => entry.verified === true);
    email = getString(selectedEmail?.email);
    emailVerified = selectedEmail?.verified === true;
  }

  if (!id || !email || !emailVerified) {
    throw new Error(`${providerNames[provider]} did not provide a verified email address. Verify an email with the provider and try again.`);
  }

  let avatarUrl = getString(profile.picture) || getString(profile.avatar_url);
  if (provider === 'discord' && profile.avatar) {
    avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${getString(profile.avatar)}.png`;
  }

  const name = provider === 'discord'
    ? getString(profile.global_name) || getString(profile.username)
    : getString(profile.name) || getString(profile.login);

  return { id, email: email.toLowerCase(), emailVerified, name: name || email, avatarUrl };
}

async function findOrCreateAccount(provider: Provider, profile: ProviderProfile): Promise<OAuthAccountDocument> {
  const identity: Identity = { provider, providerId: profile.id };
  let account = await Account.findOne({ identities: { $elemMatch: identity } });

  if (!account) {
    account = await Account.findOne({ email: profile.email });
  }

  if (!account) {
    account = new Account({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      identities: [identity],
    });
  } else if (!(account.identities as Identity[]).some((item) => item.provider === provider && item.providerId === profile.id)) {
    account.identities.push(identity);
  }

  account.name = profile.name || account.name;
  account.avatarUrl = profile.avatarUrl || account.avatarUrl;
  await account.save();
  return account;
}

function parseProvider(value: string): Provider | undefined {
  return value === 'google' || value === 'discord' || value === 'github' ? value : undefined;
}

function getSafeString(value: unknown, field: string, maxLength = 300): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new InputError(`Enter a valid ${field}.`);
  }
  return value.trim();
}

function toAppUser(account: OAuthAccount) {
  return {
    id: account._id.toString(),
    name: account.name,
    age: 0,
    gender: '',
    mobileNumber: '',
    email: account.email,
    role: account.role!,
    avatarUrl: account.avatarUrl,
    createdAt: account.createdAt.toISOString().slice(0, 10),
    authProvider: account.identities[0]?.provider,
    ...(account.brandProfile ? { brandProfile: account.brandProfile } : {}),
    ...(account.creatorProfile ? { creatorProfile: account.creatorProfile } : {}),
  };
}

export async function configureOAuth(app: express.Express): Promise<void> {
  const mongoUri = process.env.MONGO_URI;
  const sessionSecret = process.env.SESSION_SECRET;
  const anyOAuthCredentials = Object.values(providerConfigs).some(config => config.clientId || config.clientSecret);

  if (!anyOAuthCredentials) {
    app.get('/auth/:provider', (req, res) => {
      if (!parseProvider(req.params.provider)) return res.sendStatus(404);
      return res.redirect('/?oauthError=provider-not-configured');
    });
    app.get('/auth/:provider/callback', (req, res) => {
      if (!parseProvider(req.params.provider)) return res.sendStatus(404);
      return res.redirect('/?oauthError=provider-not-configured');
    });
    app.get('/api/auth/session', (_req, res) => res.json({ authenticated: false }));
    app.post('/api/auth/logout', (_req, res) => res.json({ success: true }));
    return;
  }

  if (!mongoUri || !sessionSecret || sessionSecret.length < 32) {
    throw new Error('OAuth is configured but MONGO_URI or a SESSION_SECRET of at least 32 characters is missing.');
  }

  for (const [name, config] of Object.entries(providerConfigs)) {
    if (Boolean(config.clientId) !== Boolean(config.clientSecret)) {
      throw new Error(`${providerNames[name as Provider]} OAuth requires both client ID and client secret.`);
    }
  }

  await mongoose.connect(mongoUri);

  if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
  app.use(session({
    name: 'kampus.sid',
    secret: sessionSecret,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => done(null, user.accountId));
  passport.deserializeUser((accountId: string, done) => {
    Account.findById(accountId).select('_id').then((account) => {
      if (!account) return done(null, false);
      return done(null, { accountId: account.id });
    }).catch(done);
  });

  for (const [providerName, config] of Object.entries(providerConfigs)) {
    const provider = providerName as Provider;
    if (!config.clientId || !config.clientSecret) continue;

    const appOrigin = (process.env.APP_ORIGIN || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, '');
    const callbackURL = `${appOrigin}/auth/${provider}/callback`;
    const strategy = new OAuth2Strategy({
      authorizationURL: config.authorizationURL,
      tokenURL: config.tokenURL,
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL,
      scope: config.scopes,
      state: true,
    }, (
      _accessToken: string,
      _refreshToken: string,
      profile: ProviderProfile,
      done: (error?: unknown, user?: Express.User | false) => void,
    ) => {
      findOrCreateAccount(provider, profile)
        .then(account => done(null, { accountId: account._id.toString() }))
        .catch(error => done(error));
    });

    strategy.name = provider;
    strategy.userProfile = (accessToken, done) => {
      loadProviderProfile(provider, accessToken)
        .then(profile => done(null, profile))
        .catch(error => done(error));
    };
    passport.use(provider, strategy);
  }

  app.get('/auth/:provider', (req, res, next) => {
    const provider = parseProvider(req.params.provider);
    if (!provider) return res.sendStatus(404);
    if (!providerConfigs[provider].clientId) return res.redirect('/?oauthError=provider-not-configured');
    return passport.authenticate(provider, { session: true })(req, res, next);
  });

  app.get('/auth/:provider/callback', (req, res, next) => {
    const provider = parseProvider(req.params.provider);
    if (!provider) return res.sendStatus(404);
    if (!providerConfigs[provider].clientId) return res.redirect('/?oauthError=provider-not-configured');
    return passport.authenticate(provider, {
      session: true,
    }, (error: Error | null, user: Express.User | false) => {
      if (error) {
        console.error(`${providerNames[provider]} OAuth callback failed:`, error.message);
        return res.redirect('/?oauthError=provider-auth-failed');
      }
      if (!user) return res.redirect('/?oauthError=provider-auth-failed');
      req.logIn(user, (loginError) => {
        if (loginError) return next(loginError);
        return res.redirect('/?oauth=complete');
      });
    })(req, res, next);
  });

  app.get('/api/auth/session', async (req: Request, res: Response, next) => {
    try {
      if (!req.user?.accountId) return res.json({ authenticated: false });
      const account = await Account.findById(req.user.accountId);
      if (!account) return res.json({ authenticated: false });
      if (!account.role) {
        return res.json({
          authenticated: true,
          needsProfile: true,
          identity: {
            id: account.id,
            name: account.name,
            email: account.email,
            avatarUrl: account.avatarUrl,
            authProvider: account.identities[0]?.provider,
          },
        });
      }
      return res.json({ authenticated: true, needsProfile: false, user: toAppUser(account) });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/auth/complete-profile', async (req: Request, res: Response, next) => {
    if (!req.user?.accountId) return res.status(401).json({ error: 'Sign in with a provider first.' });
    try {
      const account = await Account.findById(req.user.accountId);
      if (!account) return res.status(401).json({ error: 'OAuth account not found. Please sign in again.' });
      const { role } = req.body as { role?: unknown };
      if (role !== 'brand' && role !== 'creator') return res.status(400).json({ error: 'Choose a valid account type.' });

      account.name = getSafeString(req.body.name || account.name, 'name');
      account.role = role;
      if (role === 'creator') {
        account.creatorProfile = {
          headline: getSafeString(req.body.headline, 'creator headline'),
          bio: getSafeString(req.body.bio, 'creator bio', 2000),
          location: getSafeString(req.body.location, 'location'),
          experienceYears: Number(req.body.experienceYears) || 0,
          specialization: getSafeString(req.body.specialization, 'specialization'),
          contentTypes: Array.isArray(req.body.contentTypes) ? req.body.contentTypes.filter((value: unknown): value is string => typeof value === 'string').slice(0, 30) : [],
          tools: Array.isArray(req.body.tools) ? req.body.tools.filter((value: unknown): value is string => typeof value === 'string').slice(0, 30) : [],
          skills: [],
          hourlyRate: Number(req.body.hourlyRate),
          projectRateMin: Number(req.body.projectRateMin) || 0,
          turnaroundDays: Number(req.body.turnaroundDays) || 0,
          portfolio: [],
          verificationSignals: [],
          metrics: { completedJobs: 0, onTimeRate: 0, repeatHireRate: 0, rating: 0, totalEarnings: '$0' },
        };
        if (!Number.isFinite(account.creatorProfile.hourlyRate) || account.creatorProfile.hourlyRate < 0) {
          return res.status(400).json({ error: 'Enter a valid hourly rate.' });
        }
        account.brandProfile = undefined;
      } else {
        const companyName = getSafeString(req.body.companyName, 'company name');
        account.brandProfile = {
          companyName,
          brandName: getSafeString(req.body.brandName || companyName, 'brand or product name'),
          industry: getSafeString(req.body.industry, 'industry'),
          purpose: getSafeString(req.body.purpose, 'campaign purpose', 2000),
          expectedFeatures: Array.isArray(req.body.expectedFeatures) ? req.body.expectedFeatures.filter((value: unknown): value is string => typeof value === 'string').slice(0, 30) : [],
        };
        account.creatorProfile = undefined;
      }

      await account.save();
      return res.json({ success: true, user: toAppUser(account) });
    } catch (error) {
      if (error instanceof InputError) return res.status(400).json({ error: error.message });
      return next(error);
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response, next) => {
    req.logout((error) => {
      if (error) return next(error);
      req.session.destroy((sessionError) => {
        if (sessionError) return next(sessionError);
        res.clearCookie('kampus.sid', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        return res.json({ success: true });
      });
    });
  });
}
