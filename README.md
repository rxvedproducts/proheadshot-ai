# PhotoVed

A full-stack SaaS web application that transforms any selfie into a studio-quality professional headshot in under 60 seconds, powered by Google Gemini AI. Users pay once, get their headshots instantly — no subscription, no appointment.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Available Styles](#available-styles)
- [Pricing & Credits](#pricing--credits)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Stripe Integration](#stripe-integration)
- [Deployment](#deployment)
- [Security Model](#security-model)
- [API Cost Reference](#api-cost-reference)

---

## Overview

PhotoVed is a single-page React application backed by Supabase Edge Functions. Users upload a selfie, select a professional style, pay a one-time fee via Stripe, and receive AI-generated headshots delivered directly to their dashboard.

The application has deep support for **Indian cultural styles** — covering professional headshots, traditional art styles, regional costumes from all major states, and festive/cinematic looks.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS v4 (JIT) |
| Icons | Lucide React |
| Auth | Supabase Auth (Google OAuth + Magic Link) |
| Database | Supabase (PostgreSQL) |
| Backend Logic | Supabase Edge Functions (Deno) |
| AI Model | Google Gemini 2.5 Flash Image (`gemini-2.5-flash-image`) |
| Payments | Stripe Checkout (one-time payments) |
| Hosting | Firebase Hosting (Google Cloud) |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│         React SPA (Vite + Tailwind)         │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │ Gallery  │  │Generator │  │
│  │  Modal   │  │Dashboard │  │ Upload   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────┘
        │             │             │
        ▼             ▼             ▼
┌───────────────────────────────────────────────┐
│              Supabase                         │
│                                               │
│  ┌─────────────┐  ┌──────────────────────┐    │
│  │ Auth (JWT)  │  │ PostgreSQL            │    │
│  └─────────────┘  │  - profiles          │    │
│                   │  - purchases         │    │
│  ┌─────────────┐  │  - plans             │    │
│  │ Edge Funcs  │  └──────────────────────┘    │
│  │ (Deno)      │                              │
│  │             │                              │
│  │ create-     │◄── Stripe Checkout           │
│  │ checkout    │                              │
│  │             │                              │
│  │ stripe-     │◄── Stripe Webhook            │
│  │ webhook     │    (payment confirmed)       │
│  │             │                              │
│  │ generate-   │◄── Gemini 2.5 Flash Image   │
│  │ headshot    │    (AI generation)           │
│  └─────────────┘                              │
└───────────────────────────────────────────────┘
```

### Request Flow

1. **Purchase:** User selects plan → `create-checkout` Edge Function creates a Stripe Checkout Session → User pays → Stripe fires `checkout.session.completed` webhook → `stripe-webhook` Edge Function adds credits to `profiles` table and logs to `purchases`.

2. **Generation:** User uploads selfie + selects style → `generate-headshot` Edge Function (a) atomically deducts 1 credit with an optimistic lock, (b) calls Gemini API with the image and style prompt, (c) returns the base64 PNG to the browser → browser renders the result instantly.

---

## Features

### Core
- **One-time payment model** — $2.99 for 20 headshots, $5.99 for 50 headshots. No subscriptions.
- **60-second turnaround** — AI generation completes in near real-time.
- **4K resolution output** — High-resolution PNG downloads.
- **Credit wallet** — Credits persist in Supabase; users can generate across multiple sessions.
- **Before/after carousel** — Animated clip-path wipe reveal on the landing page.
- **Selfie pill fade** — UX label fades as the AI result is revealed.
- **Scroll-triggered animations** — IntersectionObserver staggered entrance in the Samples section.

### Authentication
- Google OAuth one-click sign-in
- Magic Link (passwordless email)
- JWT-secured API calls via Supabase Auth

### Style Library
- **6 core professional styles** (Corporate Studio, Modern Workspace, Startup Founder, Outdoor Natural, Executive Luxury, Creative Professional)
- **14+ creative/artistic styles** (Ghibli Sky, 3D Caricature, Watercolor, Oil Painting, Pencil Sketch, Clay 3D, Marble, Glass Art, and more)
- **15+ traditional Indian art styles** (Madhubani, Warli, Pattachitra, Kalamkari, Tanjore, Miniature, and more)
- **30+ Indian regional costumes** covering all major regions — North, South, East, West, Northeast
- **Festive and cinematic styles** (Diwali, Rangoli, Studio Cinematic, Monsoon Mood, Vintage Indian Film)

### Legal Pages
- Terms of Service
- Privacy Policy
- Refund Policy

All styled to match the site's stone/amber design system.

---

## Project Structure

```
proheadshot-ai/
│
├── index.html                    # Vite entry point
├── index.tsx                     # React root mount
├── index.css                     # Global styles + Tailwind
├── App.tsx                       # Root component — routing state machine
├── constants.ts                  # Style definitions, Stripe key, support email
├── types.ts                      # Shared TypeScript interfaces
├── vite.config.ts                # Vite + Tailwind plugin config
├── tsconfig.json
├── firebase.json                 # Firebase Hosting config — SPA rewrites, security headers
├── .firebaserc                   # Firebase project alias
├── setup-production-stripe.sh   # One-time script to migrate test → live Stripe keys
│
├── components/
│   ├── Header.tsx                # Top nav with auth state and purchase CTA
│   ├── Hero.tsx                  # Landing hero with 3-pair before/after carousel
│   ├── HowItWorks.tsx            # 3-step explainer section
│   ├── Samples.tsx               # Scroll-triggered before/after sample grid
│   ├── IndianShowcase.tsx        # Indian styles dual-carousel section
│   ├── Pricing.tsx               # Two-plan pricing cards ($2.99 / $5.99)
│   ├── AuthModal.tsx             # Google + Magic Link auth modal
│   ├── Generator.tsx             # Upload → style select → generate flow
│   ├── UploadSection.tsx         # Drag-and-drop image upload
│   ├── StyleSelector.tsx         # Tabbed style picker (Professional / Creative / Indian)
│   ├── Gallery.tsx               # User dashboard — generated headshots + download
│   ├── Dashboard.tsx             # Post-login landing with credits and quick actions
│   ├── CookieBanner.tsx          # GDPR cookie consent banner
│   ├── RedirectHandler.tsx       # Stripe success/cancel redirect handler
│   ├── EnterpriseSalesModal.tsx  # Enterprise inquiry form
│   ├── TermsOfService.tsx        # Legal page
│   ├── PrivacyPolicy.tsx         # Legal page
│   └── RefundPolicy.tsx          # Legal page
│
├── services/
│   ├── supabaseService.ts        # Supabase client init + auth helpers
│   └── geminiService.ts          # Gemini API client (client-side stub)
│
├── supabase/
│   └── functions/
│       ├── create-checkout/      # Deno: creates Stripe Checkout Session
│       │   └── index.ts
│       ├── stripe-webhook/       # Deno: handles checkout.session.completed
│       │   └── index.ts
│       └── generate-headshot/    # Deno: credit deduction + Gemini API call
│           └── index.ts
│
└── public/
    ├── headshots/                # Before/after sample images (professional styles)
    └── indian-costume/           # After images for Indian costume carousel
```

---

## Available Styles

### Professional Headshots

| Style | Description |
|---|---|
| Corporate Studio | Classic grey background, soft box lighting, formal attire |
| Modern Workspace | Blurred open-plan office, smart casual |
| Startup Founder | Brick wall loft, t-shirt + blazer |
| Outdoor Natural | Golden hour park bokeh, business casual |
| Executive Luxury | Boardroom, dramatic cinematic lighting |
| Creative Professional | Vibrant solid background, expressive framing |

### Creative & Artistic

3D Caricature, Studio Ghibli Sky, Watercolor, Oil Painting, Pencil Sketch, Charcoal Drawing, Ink Wash, Stylized Stickers, Clay 3D, Realistic 3D, Marble Sculpture, Paper Cutout, Glass Art

### Traditional Indian Art

Madhubani, Warli, Pattachitra, Kalamkari, Miniature, Tanjore, Terracotta, Handloom Textile, Block Print, Diwali Festive, Rangoli, Spiritual/Temple, Studio Cinematic, Indian Street, Vintage Indian Film, Monsoon Mood

### Indian Regional Costumes

| Region | Styles |
|---|---|
| North India | Punjabi, Kashmiri, Himachali, Rajasthani, Haryanvi |
| West India | Gujarati, Maharashtrian, Goan |
| East India | Bengali, Odia, Bihari, Assamese |
| South India | Tamil, Kerala, Kannadiga, Andhra/Telangana |
| Northeast India | Naga, Mizo, Manipuri, Arunachali |
| Pan-Indian / Special | North Indian Bridal, South Indian Bridal, Classical Dance, Royal Maharaja |

---

## Pricing & Credits

| Plan | Price | Credits | Notes |
|---|---|---|---|
| Individual | $2.99 | 20 headshots | All core professional styles |
| Team | $5.99 | 50 headshots | All styles including Indian costumes |

Credits are stored server-side in `profiles.credits`. Each generation atomically deducts 1 credit using an optimistic lock to prevent double-spend under concurrent requests.

---

## Local Development

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project (free tier works)
- A Stripe account (test mode keys)
- A Google AI Studio API key (Gemini)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/rxvedproducts/proheadshot-ai.git
cd proheadshot-ai

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.local.example .env.local
# Edit .env.local — see Environment Variables section below

# 4. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note:** AI generation and payments require the Supabase Edge Functions to be running. For local Edge Function development, use `supabase functions serve` in a separate terminal after authenticating with the Supabase CLI.

---

## Environment Variables

Create a `.env.local` file in the project root. **This file must never be committed to git.**

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe — publishable key only; secret key lives in Supabase Edge Function secrets
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Contact email shown on the Refund Policy page
VITE_SUPPORT_EMAIL=support@yourdomain.com

# Firebase Analytics — public client config from Firebase Console > Project Settings > Your apps
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Supabase Edge Function Secrets

These are set via the Supabase CLI and **never appear in the client bundle**:

```bash
supabase secrets set \
  API_KEY=your-gemini-api-key \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SIGNING_SECRET=whsec_... \
  STRIPE_PRICE_INDIVIDUAL=price_xxx \
  STRIPE_PRICE_TEAM=price_xxx
```

---

## Supabase Setup

### 1. Create the Database Schema

Run `db_setup.sql` in the Supabase SQL Editor. This creates:

| Table | Purpose |
|---|---|
| `profiles` | User wallet — `id`, `credits`, `stripe_customer_id`, `email`, `full_name` |
| `plans` | Plan lookup — `id`, `name`, `slug`, `credits` |
| `purchases` | Audit log — `user_id`, `plan_id`, `stripe_session_id`, `amount_paid`, `credits_added` |

Row-Level Security (RLS) is enabled — users can only read their own rows.

### 2. Deploy Edge Functions

```bash
# JWT-verified functions
supabase functions deploy create-checkout
supabase functions deploy generate-headshot

# Webhook must bypass JWT — Stripe calls it without a user token
supabase functions deploy stripe-webhook --no-verify-jwt
```

### 3. Configure Auth Providers

In Supabase Dashboard → Authentication → Providers:
- Enable **Google** (requires OAuth Client ID + Secret from Google Cloud Console)
- Enable **Email** (Magic Link — no password required)

---

## Stripe Integration

### Webhook Endpoint

In Stripe Dashboard → Developers → Webhooks, add an endpoint pointing to your deployed Edge Function:

```
https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook
```

Select the event: `checkout.session.completed`

Copy the **Signing Secret** and set it as `STRIPE_WEBHOOK_SIGNING_SECRET` in Supabase.

### Migrating from Test to Production (Live Mode)

A helper script handles the full rotation safely:

```bash
bash setup-production-stripe.sh
```

The script:
1. Prompts for all 5 values silently (no echo — nothing appears on screen or in shell history)
2. Updates Supabase Edge Function secrets
3. Updates `.env.local` with the live publishable key
4. Rebuilds the app and redeploys it to Firebase Hosting
5. Redeploys both Edge Functions
6. Wipes all sensitive values from shell memory with `unset`

---

## Deployment

The app is a static SPA (all backend logic lives in Supabase Edge Functions) deployed to **Firebase Hosting** on Google Cloud project `proheadshotai-rxvedproducts`.

### Firebase Configuration (`firebase.json` / `.firebaserc`)

- **SPA rewrite** — all routes serve `index.html` (required for client-side routing)
- **Security headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`

### Manual Deploy

```bash
npm run build
firebase deploy --only hosting
```

### Required Build-Time Environment Variables

Baked into the client bundle at build time from `.env.local` (see [Environment Variables](#environment-variables)):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY
VITE_SUPPORT_EMAIL
```

---

## Security Model

| Concern | Implementation |
|---|---|
| API key exposure | `GEMINI_API_KEY` and `STRIPE_SECRET_KEY` are Supabase Edge Function secrets — never bundled into client JS |
| Price tampering | Price IDs are resolved server-side from `STRIPE_PRICE_INDIVIDUAL` / `STRIPE_PRICE_TEAM` — clients cannot inject a different price |
| Credit double-spend | Optimistic lock on deduction: `UPDATE profiles SET credits = credits - 1 WHERE id = $1 AND credits = $2` — fails silently if credits changed between read and write |
| Webhook spoofing | Every webhook verifies the `Stripe-Signature` header using `stripe.webhooks.constructEventAsync` and the signing secret |
| Unauthorized generation | `generate-headshot` requires a valid Supabase JWT and rejects requests with `credits < 1` before calling Gemini |
| Client-side credit manipulation | RLS prevents clients from updating `profiles` directly — all deductions happen server-side only |
| Clickjacking | `X-Frame-Options: DENY` prevents the page from being embedded in iframes |
| Secret leakage | `.env.local` is in `.gitignore` and the migration script uses `unset` to clear variables from shell memory |

---

## API Cost Reference

Approximate cost per plan purchase at current Gemini pricing ($0.039/image):

| Plan | Headshots | Gemini Cost | Stripe Fee | Net Revenue | Gross Margin |
|---|---|---|---|---|---|
| Individual ($2.99) | 20 | ~$0.78 | ~$0.39 | ~$2.60 | ~$1.82 (~70%) |
| Team ($5.99) | 50 | ~$1.95 | ~$0.47 | ~$5.52 | ~$3.57 (~65%) |

Supabase Edge Function invocations and Firebase Hosting are within free tier limits at typical usage volumes.

> Verify current Gemini pricing at [ai.google.dev/pricing](https://ai.google.dev/pricing) before scaling.

---

## Scripts

```bash
npm run dev       # Start Vite dev server at localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
npm run lint      # TypeScript type check (tsc --noEmit)
```

---

## License

Private — all rights reserved.
