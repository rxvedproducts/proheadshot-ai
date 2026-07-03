#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# setup-production-stripe.sh
# Switches ProHeadshot AI from Stripe test → live mode.
# Run this once from the project root:   bash setup-production-stripe.sh
#
# • Values are entered silently (no echo to screen or shell history)
# • Updates: Supabase secrets, .env.local, Vercel production env var
# • Redeploys both Supabase edge functions so they pick up new secrets
# ---------------------------------------------------------------------------
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_LOCAL="$PROJECT_ROOT/.env.local"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   ProHeadshot AI — Stripe Live Mode Setup            ║"
echo "║   Values are silent — they won't appear on screen    ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

read -r -s -p "1/5  Stripe LIVE Publishable Key  (pk_live_...): " PK;   echo ""
read -r -s -p "2/5  Stripe LIVE Secret Key        (sk_live_...): " SK;   echo ""
read -r -s -p "3/5  Webhook Signing Secret         (whsec_...):  " WHK;  echo ""
read -r -s -p "4/5  Price ID — Individual plan     (price_...):  " IND;  echo ""
read -r -s -p "5/5  Price ID — Team plan           (price_...):  " TEAM; echo ""
echo ""

# ── 1. Supabase secrets ──────────────────────────────────────────────────
echo "→ Setting Supabase edge function secrets..."
supabase secrets set \
  STRIPE_SECRET_KEY="$SK" \
  STRIPE_WEBHOOK_SIGNING_SECRET="$WHK" \
  STRIPE_PRICE_INDIVIDUAL="$IND" \
  STRIPE_PRICE_TEAM="$TEAM"
echo "✓ Supabase secrets updated."
echo ""

# ── 2. .env.local (local dev) ────────────────────────────────────────────
echo "→ Updating .env.local with live publishable key..."
# perl handles in-place replace reliably on macOS (sed -i behaves differently)
perl -i -pe "s|^VITE_STRIPE_PUBLISHABLE_KEY=.*|VITE_STRIPE_PUBLISHABLE_KEY=$PK|" "$ENV_LOCAL"
echo "✓ .env.local updated."
echo ""

# ── 3. Vercel production environment variable ────────────────────────────
echo "→ Setting Vercel VITE_STRIPE_PUBLISHABLE_KEY (production)..."
if command -v vercel &>/dev/null; then
  # Remove old value if it exists, then add the live one
  vercel env rm VITE_STRIPE_PUBLISHABLE_KEY production --yes 2>/dev/null || true
  printf '%s\n' "$PK" | vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
  echo "✓ Vercel env var set. Trigger a redeploy (push to main) to apply it."
else
  echo "⚠  Vercel CLI not found. Set this manually in Vercel Dashboard:"
  echo "   Project → Settings → Environment Variables"
  echo "   Name:  VITE_STRIPE_PUBLISHABLE_KEY"
  echo "   Value: (your pk_live_... key)"
  echo "   Env:   Production"
fi
echo ""

# ── 4. Redeploy Supabase edge functions ──────────────────────────────────
echo "→ Redeploying Supabase edge functions..."
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook --no-verify-jwt
echo "✓ Edge functions redeployed with new secrets."
echo ""

# ── Cleanup: wipe sensitive vars from shell memory ───────────────────────
unset PK SK WHK IND TEAM

echo "╔══════════════════════════════════════════════════════╗"
echo "║   ✓  All done! Next steps:                           ║"
echo "║   1. git push origin main  (triggers Vercel deploy)  ║"
echo "║   2. Do a real $2.99 purchase to verify end-to-end   ║"
echo "║   3. Check Stripe Dashboard → Webhooks → delivery    ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
