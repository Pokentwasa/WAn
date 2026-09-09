# WhatsApp Referral Commerce - Prototype

"Word of mouth. Now measurable." A referral-programme prototype for small
South African businesses that sell over WhatsApp: bakers, hair and beauty
sellers, boutiques, photographers, and more.

This is a working prototype with **mock data and a mock Yoco integration** -
no real Supabase or Yoco account is required to run it. Everything is built
so those two pieces can be swapped in later without reshaping the UI.

## Running it

This project has no local dev environment set up by default - it's built to
push straight to GitHub and deploy on Vercel:

1. Push this folder to a new GitHub repository.
2. Import the repo on [vercel.com](https://vercel.com/new) - Vercel detects
   Next.js automatically, no configuration needed.
3. Deploy. No environment variables are required for the prototype to work.

If you do want to run it locally: `npm install` then `npm run dev`.

## Demo script

1. Open `/dashboard` - referral sales, referrers, recent activity.
2. Click **Add referrer**, create one, copy or share their link.
3. Open that referral link (`/r/[code]`) in a new tab - see the "opening
   WhatsApp" moment and the referral get tracked.
4. Back on the dashboard, click **Request payment**, fill in a sale tied to
   that referrer, and open the generated checkout link (`/pay/[id]`).
5. Pay with any method - watch the reward and platform fee get calculated
   automatically, and the dashboard update.

Settings has a **Reset demo data** button to put everything back to the
seeded example data (Sweet by Kay) at any point.

## Architecture

- `lib/types.ts` - every data model (Merchant, Referrer, Customer, Campaign,
  PaymentRequest, Payment, ReferralSale, Reward).
- `lib/mock-data.ts` - static seed data for the demo merchant. Deliberately
  has no `Math.random()`/`Date.now()` at load time, so the server-rendered
  and client-rendered HTML always match.
- `lib/services/*` - the business logic, written as if each function were
  already hitting a real backend (`async`, returns the shape a Supabase
  query would). This is the layer to change when plugging in a real backend:
  - `merchantService` - onboarding + settings.
  - `referralService` - referrer creation, link/message building, stats.
  - `campaignService` - campaigns and their computed stats.
  - `paymentService` - payment request creation.
  - `rewardService` - the reward/fee math and payout tracking.
  - `yocoService` - **the mock payment integration**. `startCheckout` mimics
    creating a Yoco charge; `handleYocoWebhookEvent` mimics the handler a
    real `/api/yoco/webhook` route would run. See the comments in that file
    for exactly what to change to go live.
- `lib/store.tsx` - a React Context standing in for Supabase. Holds every
  table as a plain array, persisted to `localStorage` so a demo survives a
  refresh. All mutations go through the service layer above first.

## Going live later

**Supabase:** each array in `lib/store.tsx` maps to one table matching the
interfaces in `lib/types.ts`. Swap the `useState`/`localStorage` plumbing for
`supabase.from(...)` calls inside the same action functions (`addReferrer`,
`completePayment`, etc.) - the components that call `useAppData()` don't
need to change.

**Yoco:** replace `startCheckout` in `lib/services/yocoService.ts` with a
real call to Yoco's Checkout API and redirect to the returned URL. Point
Yoco's webhook at a new `/api/yoco/webhook` route that forwards the payload
into `handleYocoWebhookEvent` - its shape already matches `YocoEvent`.

## Notes

- No emoji or special punctuation characters are used directly in source
  files (string literals use `\u{...}` escapes instead) to avoid encoding
  issues when pasting code into GitHub's web editor.
- All UI primitives in `components/ui/` are hand-written in the shadcn/ui
  style on top of Radix - there's no dependency on the shadcn CLI/registry.
