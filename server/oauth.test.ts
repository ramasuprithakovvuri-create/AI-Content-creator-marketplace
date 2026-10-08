import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { loadProviderProfile } from './oauth';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('Google sign-in rejects an unverified provider email', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    sub: 'google-user-1',
    email: 'user@example.com',
    email_verified: false,
    name: 'Example User',
  }), { status: 200 });

  await assert.rejects(
    loadProviderProfile('google', 'access-token'),
    /did not provide a verified email address/,
  );
});

test('Discord sign-in accepts a verified email from the provider', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    id: 'discord-user-1',
    email: 'user@example.com',
    verified: true,
    username: 'example',
    avatar: null,
  }), { status: 200 });

  const profile = await loadProviderProfile('discord', 'access-token');
  assert.equal(profile.email, 'user@example.com');
  assert.equal(profile.emailVerified, true);
});

test('GitHub sign-in selects a verified email and supports numeric user IDs', async () => {
  globalThis.fetch = async (input) => {
    if (String(input).endsWith('/user/emails')) {
      return new Response(JSON.stringify([
        { email: 'unverified@example.com', primary: true, verified: false },
        { email: 'verified@example.com', primary: false, verified: true },
      ]), { status: 200 });
    }
    return new Response(JSON.stringify({
      id: 12345,
      login: 'example',
      avatar_url: 'https://example.com/avatar.png',
    }), { status: 200 });
  };

  const profile = await loadProviderProfile('github', 'access-token');
  assert.equal(profile.id, '12345');
  assert.equal(profile.email, 'verified@example.com');
  assert.equal(profile.emailVerified, true);
});
