# SEFTEC Hub Marketplace

An AI-augmented marketplace UI featuring a floating chat assistant, product/service discovery helpers, and optional payment demos. This repo is the branded variant of “Floating Chat Magic” and contains the same core components packaged with SEFTEC naming and examples.

## Purpose
- Showcase an on-site AI assistant that guides users to services or vendors
- Provide a themed, plug-and-play chat widget with voice input and dark mode
- Demonstrate simple cart/checkout flows with Stripe for demos

## Core Features
- Floating chat (`src/components/FloatingChat.tsx`) and enhanced mode (`EnhancedFloatingChat.tsx`)
- Marketplace helpers and example search (`src/lib/vibefind-service.ts`)
- AI integration helpers (`src/lib/seftec-ai.ts`) and voice service (`src/lib/voice-service.ts`)
- Payment modal (`src/components/PaymentModal.tsx`) for demo flows
- Theme system and switcher (`src/lib/themes.ts`, `src/components/ThemeSwitcher.tsx`)
- Type-safe utils and models (`src/lib/types.ts`, `src/lib/utils.ts`)
- Example API routes (extend as needed): `/api/chat`, `/api/search/handymen`

## Environment & Config
Copy `.env.example` to `.env.local` and set:
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

`next.config.js` disables ESLint during builds for faster CI and whitelists image domains (Unsplash, Same assets). Tailwind + shadcn/ui is configured via `tailwind.config.ts` and `components.json`.

## Run & Build
- Install: `bun install` (or `npm install`)
- Dev: `bun run dev` (or `npm run dev`) → http://localhost:3000
- Build/Start: `bun run build` then `bun run start`
- Lint/Format: `bun run lint` and `bun run format`

## Directory Overview
```
src/
  app/                # App Router entrypoints and pages
  components/         # Chat, theme, payment, dashboard components
  lib/                # AI, voice, themes, types, utilities, services
```

## Roadmap Ideas
- Persist chat sessions and context
- Add vendor onboarding and listing management
- Expand payment options and receipts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
