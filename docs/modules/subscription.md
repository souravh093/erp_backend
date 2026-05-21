# Subscription Module (Stripe)

## Overview

This module handles Stripe subscriptions for the ERP system. It creates Stripe Checkout sessions for monthly/yearly plans, stores Stripe IDs in the database, and syncs status via webhooks.

## Plans

- Monthly: 5000 BDT
- Yearly: 50000 BDT

These are configured as Stripe recurring prices and mapped through env vars.

## Required Environment Variables

Set these in your `.env` file:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
STRIPE_SUCCESS_URL=https://your-frontend.com/billing/success
STRIPE_CANCEL_URL=https://your-frontend.com/billing/cancel
```

## Stripe Dashboard Setup

1. Create or sign in to your Stripe account.
2. Switch to Test mode for local development.
3. Get API key:
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy the Secret key and set `STRIPE_SECRET_KEY`.
4. Create product and prices (BDT):
   - Option A (Products page):
     - Go to https://dashboard.stripe.com/test/products
     - Create a product (for example "ERP Subscription").
     - Add two recurring prices in BDT:
       - 5000 BDT, billed monthly
       - 50000 BDT, billed yearly
   - Option B (Plus button -> Subscription):
     - Click the plus (+) button in the top-right corner.
     - Choose "Subscription" (you will see: Invoice, Subscription, Payment link, Payment).
     - In the "Create a test subscription" screen, click "Add product" and create the product.
     - Set currency to BDT, billing to recurring, and create monthly and yearly prices.
   - Open the product and copy the Price IDs from the Pricing section.
   - Set `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_YEARLY_PRICE_ID`.
5. Create a webhook endpoint:
   - Go to https://dashboard.stripe.com/test/webhooks
   - Add endpoint: `https://your-domain.com/api/v1/subscription/webhook`
   - If you see Workbench -> Webhooks and "Add destination":
     - Choose "Your account" scope.
     - Keep the default API version.
     - Select the events below, then click Continue.
     - Destination type: "Webhook endpoint", then paste your URL and save.
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
6. Set redirect URLs:
   - `STRIPE_SUCCESS_URL` should point to your success page.
   - `STRIPE_CANCEL_URL` should point to your cancel page.

## Localhost Development

Stripe cannot call `localhost` directly. Use Stripe CLI (recommended) or a tunnel.

### Option A: Stripe CLI (recommended)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:

```
stripe listen --forward-to http://localhost:5000/api/v1/subscription/webhook
```

4. Copy the `whsec_...` from the CLI output into `STRIPE_WEBHOOK_SECRET`.

Local redirect URLs (example):

```
STRIPE_SUCCESS_URL=http://localhost:3000/billing/success
STRIPE_CANCEL_URL=http://localhost:3000/billing/cancel
```

### Option B: Tunnel (ngrok, cloudflared)

1. Start a tunnel to your backend port (5000).
2. Use the tunnel URL as the webhook endpoint in Stripe.
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Move From Localhost To Domain

When you deploy to a domain:

1. Update `.env`:

- `STRIPE_SUCCESS_URL=https://your-domain.com/billing/success`
- `STRIPE_CANCEL_URL=https://your-domain.com/billing/cancel`

2. Create a new webhook destination in Stripe using:

- `https://your-domain.com/api/v1/subscription/webhook`

3. Copy the new signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Keep the same Price IDs (monthly/yearly) unless you change products or move to a different Stripe account.

## API Endpoints

### Create Checkout Session

`POST /api/v1/subscription/checkout`

Body:

```json
{
  "userId": "uuid",
  "plan": "MONTHLY"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
```

### Get Subscription Status

`POST /api/v1/subscription/status`

Body:

```json
{
  "userId": "uuid"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "ACTIVE",
    "plan": "MONTHLY",
    "expiresAt": "2026-05-20T10:00:00.000Z"
  }
}
```

### Stripe Webhook

`POST /api/v1/subscription/webhook`

- Stripe sends events here.
- This route uses raw body parsing for signature verification.

## Frontend Flow (Recommended)

1. User logs in.
2. If login response has `redirect = /subscribe`, call the checkout endpoint.
3. Redirect the user to `checkoutUrl` from Stripe.
4. Stripe sends webhook events, backend updates subscription status.
5. If login response has `redirect = /company-setup`, show company setup form.

## Testing Tips

- Use Stripe test cards (for example `4242 4242 4242 4242`) in Test mode.
- Make sure the webhook endpoint is reachable from Stripe (use your hosted URL or a tunneling tool).
