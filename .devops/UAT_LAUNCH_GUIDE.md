# SEFTEC Hub UAT Launch Guide

## Goal
Run a stable UAT environment with all currently implemented user-facing features enabled and easy to validate.

## UAT Feature Coverage
- Home marketplace landing page
- Handyman discovery page and API-backed search
- VibeFind social discovery (RSVP, share, create event, local persistence)
- Floating AI chat assistant
- Payment intent backend route for ticketing/payment flow readiness
- Dark/light mode + responsive layout

## Required Configuration
1. Copy `.env.uat.example` values into deployment environment variables.
2. Set at least one AI key (`OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, or `PERPLEXITY_API_KEY`) for full chat responses.
3. Keep `NEXT_PUBLIC_DEMO_MODE=true` for UAT-friendly fallback behavior.
4. Add Stripe keys if payment processing should be live-tested.

## UAT Happy Path Checks
1. Open `/` and verify both product cards navigate correctly.
2. Open `/handyman` and perform at least one search.
3. Open `/vibefind` and validate:
   - category filtering
   - RSVP (Going/Interested)
   - share action
   - create event modal flow
4. Trigger floating chat and confirm response behavior.
5. If Stripe keys are present, validate payment-intent request path.

## Known UAT Constraints
- Identity/auth-backed attendee profiles are not fully wired for multi-user persistence.
- Realtime attendee sync is simulated/local (no shared realtime backend).
- End-to-end ticket checkout UX from event cards is pending final wiring.

## UAT Go/No-Go Rule
Proceed with UAT when core route navigation, API routes, RSVP/share/create-event flows, and chat interaction all work without blocking errors.
