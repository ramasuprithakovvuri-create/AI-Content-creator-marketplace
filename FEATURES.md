# What was added on top of the AI Studio app

Run in PowerShell: `npm.cmd install`, copy `.env.example` to `.env`, then `npm.cmd run dev` (open http://localhost:3000). Using `npm.cmd` avoids PowerShell's script-execution restriction on `npm.ps1`. Set `GEMINI_API_KEY` in `.env` for the AI brief builder; it works without a key using the local fallback. MongoDB is not required by this version.
Demo data is saved in your browser (localStorage). To reset: DevTools > Application > Local Storage > clear keys starting with `kampus.v2`.

## Brand side
- Brief form: dropdowns for AI models, visual styles, target deliverables (BriefOptions.tsx)
- Budget tier selector linked to outcomes and scope (Micro / Growth / Premium / Enterprise)
- Stealth mode: hides the brief from everyone except the owner and invited creators, forces NDA signing before a creator can accept, sets meta robots noindex while shown
- Business-email check on brand sign-up, 2FA (real TOTP, works with Google/Microsoft Authenticator), SSO button (demo)
- Private workspace per project: chat, image sharing, click-to-pin visual feedback (only the two parties can open it)

## Creator side
- Portfolio lab: before/after slider, consistency (pose) gallery, custom-trained style card; creators add the data in their dashboard form
- Social sign-in (Google, Discord, GitHub) with role selection tagging the user as Talent or Brand (demo OAuth)
- Hub integrations (Behance, ArtStation, GitHub, Hugging Face, Civitai) add verification badges
- Earnings wallet: pending escrow, cleared earnings, payout settings (masked), withdraw

## Core engine
- Matchmaking: after saving a brief, top 5 or 10 creators are ranked and can be invited in one click
- Escrow: brand pays through a Razorpay/Stripe test-mode checkout; only a token + last 4 digits are kept; creator cannot accept until funded; milestone approval releases money into the wallet; 20% platform fee split shown
- Smart Delivery Box: seed/prompt manifest encrypted with AES-256-GCM (WebCrypto) at delivery, unlocked only after brand sign-off
- Licensing: copyright transfer agreement generated on completion (download / print). Template only, not legal advice
- Reviews and ratings after completion

## Demo vs production
Live in demo: AES-256-GCM delivery box, TOTP 2FA, card tokenization flow, workspace access check, license generator, persistence in browser.
Needs a real backend for production: database with row-level security, real OAuth/Entra SSO, real Stripe/Razorpay server-side keys and webhooks, server-held vault keys, server-side robots headers.
