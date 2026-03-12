# SEFTEC Hub Marketplace

## Overview
A Next.js marketplace application for services and events. Users can find trusted service providers (plumbers, electricians, cleaners, mechanics) and discover local events.

## Tech Stack
- **Framework**: Next.js 16 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React icons
- **Animations**: Framer Motion
- **Payments**: Stripe integration
- **AI**: OpenAI integration

## Project Structure
```
src/
  app/           # Next.js App Router pages
  components/    # React components
  lib/           # Utility functions and libraries
```

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`
- **Format**: `npm run format`

## Configuration
- Frontend binds to `0.0.0.0:5000` for Replit compatibility
- All dev origins allowed for proxy support

## Key Features

### Hub Landing (`/`)
- Lagos-voice copy ("Yo, Lagos — where's your next vibe?")
- Leo auto-opens after 2 seconds with routing intent detection (vibe → /vibefind, fix → /handyman)
- Two product cards with Lagos-themed CTAs

### Vibe Find (`/vibefind`)
- Lagos-voice hero copy with 3 working CTAs (See what's hot, Create your own rave, Invite squad)
- Heat map strip showing venue cards color-coded by crowd level (red/yellow/green)
- RSVP "I'm Going!" persists via localStorage across refreshes
- Post-RSVP "Drag 5 friends" share mechanic with Web Share API and progress tracking
- Create Event modal stores to localStorage and appears in grid immediately
- Leo cross-sell trigger after first RSVP (once per session via sessionStorage)

### Handyman Hub (`/handyman`)
- Lagos-voice copy with pricing anchors ("₦15k flat — no surprises")
- "Find a Guy Now" → focuses search bar, "Post Your Job" → modal form, "See Ratings" → scrolls to grid
- Post Your Job modal with job type, description, Lagos area, budget → stores in localStorage
- WhatsApp button on each handyman card (wa.me links with phone numbers)
- Lagos-themed mock handyman data with Nigerian names and Naira pricing

### Leo Chat (EnhancedFloatingChat)
- Supports auto-open via CustomEvent 'leo-auto-open' with routing callback
- Supports message injection via CustomEvent 'leo-inject-message'
- Keyword-based navigation (party/vibe → /vibefind, fix/AC → /handyman)
- Cross-sell handyman prompt after first RSVP on VibeFind

### Persistence
- RSVP state: localStorage key 'seftec-rsvp-state'
- Share counts: localStorage key 'seftec-share-counts'
- Custom events: localStorage key 'seftec-custom-events'
- Posted jobs: localStorage key 'seftec-posted-jobs'
- Leo auto-open: sessionStorage key 'seftec-leo-auto-opened'
- Leo cross-sell: sessionStorage key 'seftec-leo-crosssell-fired'

## Recent Changes
- 2026-03-12: Ship real Lagos app features
  - Rewrote all three pages (/, /vibefind, /handyman) with Lagos voice and real working features
  - Added heat map strip, RSVP persistence, event creation, friend-drag mechanic
  - Added handyman job posting modal, WhatsApp CTAs, Lagos-themed mock data
  - Enhanced Leo chat with auto-open, message injection, and keyword routing
  - All features use localStorage/sessionStorage for persistence (no backend needed)

- 2026-01-31: Enhanced floating chatbox functionality
  - Integrated OpenAI via Replit AI Integrations (no API key needed)
  - Repositioned chat to bottom-right corner (standard UX)
  - Added clear conversation button
  - Added message persistence with localStorage
  - Improved mobile responsiveness with better sizing
  - Added polished typing indicator animation with bouncing dots
  - Simplified and cleaned up component code

- 2026-01-30: Initial Replit environment setup
  - Configured Next.js to use port 5000
  - Allowed all dev origins for Replit proxy compatibility
  - Set up development workflow and deployment configuration
