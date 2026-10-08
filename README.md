# Kampus AI Creator Marketplace

## Run locally

**Prerequisite:** Node.js

Open PowerShell in this folder and run each command separately. Type only the
command text inside the code blocks; do not type PowerShell prompts such as
`PS>` or `>>`.

```powershell
npm.cmd install
```

Create `.env` only if it does not already exist (this preserves any API key you
have configured):

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Then start the app:

```powershell
npm.cmd run dev
```

Open <http://localhost:3000>.

Marketplace demo data is stored in browser local storage. MongoDB is not needed
for the marketplace demo.

Brand-created campaign briefs are saved in the current browser and remain after
refreshing the page. They are not synced to other browsers or devices.
Demo profiles, campaigns, and engagement records are excluded from the
marketplace. Brands see their own briefs and engagements; creators see published
campaigns and their own engagements. Public creator listings use saved creator
profiles; portfolio work appears when a creator adds it.

The brief builder works without an API key using its local fallback. To enable
Gemini-generated briefs, add your key to `.env`:

```dotenv
GEMINI_API_KEY=your-gemini-api-key
```

## Social sign-in

Google, Discord, and GitHub sign-in are not currently available in the
marketplace UI. Use the app's email/password demo flow instead.

## MongoDB error from the older ZIP

The older ZIP's server connects to `mongodb://127.0.0.1:27017/aimarket`. An
`ECONNREFUSED` error means no MongoDB service is accepting connections there.
This folder's marketplace demo does not attempt that connection unless OAuth
credentials are configured. If enabling OAuth, set `MONGO_URI` here to a
reachable MongoDB deployment.

## Demo data

Demo data persists in browser local storage. To reset it, open browser DevTools
> Application > Local Storage and clear keys starting with `kampus.v2`.
