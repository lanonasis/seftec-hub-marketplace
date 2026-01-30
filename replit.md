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

## Recent Changes
- 2026-01-30: Initial Replit environment setup
  - Configured Next.js to use port 5000
  - Allowed all dev origins for Replit proxy compatibility
  - Set up development workflow and deployment configuration
