import type { User } from '../types';

export interface OAuthIdentity {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  authProvider: string;
}

export type OAuthSession =
  | { authenticated: false }
  | { authenticated: true; needsProfile: true; identity: OAuthIdentity }
  | { authenticated: true; needsProfile: false; user: User };

export interface OAuthProfileInput {
  role: 'brand' | 'creator';
  name: string;
  companyName?: string;
  brandName?: string;
  industry?: string;
  purpose?: string;
  expectedFeatures?: string[];
  headline?: string;
  bio?: string;
  location?: string;
  experienceYears?: number;
  specialization?: string;
  contentTypes?: string[];
  tools?: string[];
  hourlyRate?: number;
  projectRateMin?: number;
  turnaroundDays?: number;
}

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `Authentication request failed (${response.status}).`);
  }
  return data;
}

export async function getOAuthSession(): Promise<OAuthSession> {
  const response = await fetch('/api/auth/session', { credentials: 'same-origin' });
  return readResponse<OAuthSession>(response);
}

export async function completeOAuthProfile(profile: OAuthProfileInput): Promise<User> {
  const response = await fetch('/api/auth/complete-profile', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  const data = await readResponse<{ user: User }>(response);
  return data.user;
}

export async function logoutOAuthSession(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });
  await readResponse<{ success: boolean }>(response);
}
