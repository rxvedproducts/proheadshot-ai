#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# setup-production-stripe.sh
# Switches ProHeadshot AI from Stripe test → live mode.
# Run this once from the project root:   bash setup-production-stripe.sh
#
# • Values are entered silently (no echo to screen or shell history)
# • Updates: Supabase secrets, .env.local, then rebuilds + redeploys Firebase Hosting
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

# ── 3. Rebuild and redeploy Firebase Hosting ─────────────────────────────
echo "→ Rebuilding with live publishable key and redeploying to Firebase Hosting..."
if command -v firebase &>/dev/null; then
  (cd "$PROJECT_ROOT" && npm run build && firebase deploy --only hosting)
  echo "✓ Firebase Hosting redeployed with the live key baked in."
else
  echo "⚠  Firebase CLI not found. Run this manually:"
  echo "   npm run build && firebase deploy --only hosting"
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
echo "║   1. Do a real $2.99 purchase to verify end-to-end   ║"
echo "║   2. Check Stripe Dashboard → Webhooks → delivery    ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
