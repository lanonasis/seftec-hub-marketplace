# 🚀 SEFTEC Hub - AI-Powered Marketplace & Social Discovery

> **A fully functional, Gen Z-friendly marketplace featuring AI chat assistant, social event discovery, and seamless payments.**

An impressive AI-augmented marketplace with a floating chat assistant, VibeFind social discovery, handyman services, and integrated authentication & payments. Built with Next.js 15, TypeScript, Tailwind CSS, and powered by OpenAI, DeepSeek, and Perplexity AI.

## ✨ What's New - Fully Functional!

This project is now **fully functional** with these major additions:

- ✅ **VibeFind Social Discovery** - Complete event discovery platform with RSVP, filtering, and social sharing
- ✅ **User Authentication** - Sign in/sign up with email or social providers (Google, GitHub)
- ✅ **Enhanced Navigation** - Seamless navigation between Marketplace, VibeFind Events, and user dashboard
- ✅ **Stripe Integration** - Server-side payment intent creation with demo mode fallback
- ✅ **User Profiles** - Persistent user sessions with profile dropdown and settings
- ✅ **Enhanced AI Chat** - Voice input/output, theme switching, and gamification features

## 🎯 Purpose

- Showcase an on-site AI assistant that guides users to services, vendors, and events
- Provide a complete social discovery platform for Gen Z users
- Demonstrate modern web app architecture with authentication and payments
- Create an Instagram-worthy, aesthetic marketplace experience

## 🌟 Core Features

### 🤖 AI-Powered Chat Assistant
- **Two chat modes**: Basic (`FloatingChat.tsx`) and Enhanced (`EnhancedFloatingChat.tsx`)
- **Voice I/O**: Speech recognition and text-to-speech
- **AI Provider Toggle**: Switch between DeepSeek 🧠 and Perplexity 🔍
- **6 Theme System**: Sunset, Cyberpunk, Ocean, Forest, Monochrome, Galaxy
- **Gamification**: Levels, badges, achievements, and point rewards
- **Draggable & Persistent**: Position saved across sessions

### 🎉 VibeFind Social Discovery
- **Event Discovery**: Browse parties, food tours, concerts, and more
- **Smart Filtering**: Filter by category, price, vibe score
- **RSVP System**: "I'm Going" and "Interested" status tracking
- **Social Integration**: Instagram, TikTok, Discord, Snapchat links
- **Trending Events**: Real-time trending indicators and vibe scores
- **Rich Event Cards**: Beautiful UI with images, attendee counts, and details

### 🛍️ Marketplace
- **Service Discovery**: Restaurants, spas, bars, coffee shops, and more
- **Handyman Services**: Verified pros with ratings, reviews, and instant booking
- **Dark Mode**: Full theme support with smooth transitions
- **Quick Actions**: One-tap access to popular searches

### 🔐 Authentication
- **Email/Password**: Traditional auth with validation
- **Social Login**: Google and GitHub OAuth (demo mode)
- **User Profiles**: Persistent sessions with localStorage
- **User Dashboard**: Profile dropdown with settings and logout

### 💳 Payments
- **Stripe Integration**: Server-side payment intent creation
- **Demo Mode**: Works without API keys for testing
- **Multiple Methods**: Card, Apple Pay, Google Pay support
- **Secure Processing**: SSL encryption and security badges

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd seftec-hub-marketplace
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Set up environment variables**
```bash
cp .env.local .env.local
```

Edit `.env.local` and add your API keys:
```env
# AI Chat (choose at least one)
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
PERPLEXITY_API_KEY=pplx-...

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Demo Mode (optional)
NEXT_PUBLIC_DEMO_MODE=true
```

4. **Run development server**
```bash
bun run dev
# or
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
seftec-hub-marketplace/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Marketplace homepage
│   │   ├── vibefind/page.tsx         # VibeFind events page (NEW!)
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── ClientBody.tsx            # Auth provider wrapper (UPDATED!)
│   │   └── api/                      # API Routes
│   │       ├── chat/route.ts         # AI chat endpoint
│   │       ├── search/handymen/route.ts
│   │       └── create-payment-intent/route.ts (NEW!)
│   ├── components/                   # React Components
│   │   ├── FloatingChat.tsx          # Basic chat widget
│   │   ├── EnhancedFloatingChat.tsx  # Advanced chat with voice
│   │   ├── AuthModal.tsx             # Login/signup modal (NEW!)
│   │   ├── UserButton.tsx            # User profile dropdown (NEW!)
│   │   ├── PaymentModal.tsx          # Stripe payment UI
│   │   ├── UserDashboard.tsx         # User stats & achievements
│   │   ├── ThemeSwitcher.tsx         # Theme selection UI
│   │   └── ui/                       # shadcn/ui components
│   └── lib/                          # Core Logic & Services
│       ├── seftec-ai.ts              # AI service integration
│       ├── vibefind-service.ts       # Social events service
│       ├── voice-service.ts          # Speech recognition
│       ├── gamification.ts           # Achievements engine
│       ├── themes.ts                 # Theme configurations
│       ├── auth-context.tsx          # Auth context provider (NEW!)
│       ├── stripe-client.ts          # Stripe helpers (NEW!)
│       └── types.ts                  # TypeScript interfaces
├── .env.local                        # Environment variables (NEW!)
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind + animations
└── package.json                      # Dependencies & scripts
```

## 🎨 Key Pages & Features

### 🏠 Marketplace (`/`)
- Browse local experiences (restaurants, bars, spas, etc.)
- Search for verified handymen with instant booking
- AI chat assistant for personalized recommendations
- Dark mode toggle and quick action buttons

### 🎉 VibeFind Events (`/vibefind`)
- Discover social events with beautiful cards
- Filter by category (parties, food, music, sports, art, wellness)
- RSVP to events (Going/Interested)
- View trending events and vibe scores
- Social links to Instagram, TikTok, Discord

### 🔐 Authentication
- Sign in/sign up modal with email or social providers
- Persistent user sessions
- Profile dropdown with user info
- Demo mode for testing without real accounts

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.2 (App Router)
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui
- **Animations**: Framer Motion 12.23.7
- **AI**: OpenAI 5.10.2, DeepSeek, Perplexity
- **Payments**: Stripe 18.3.0
- **Icons**: Lucide React
- **Runtime**: Bun (preferred) or npm

## 🎯 Usage Examples

### Testing the App

1. **Try the AI Chat**
   - Click the SEFTEC bubble in bottom-right
   - Drag it anywhere on screen
   - Ask: "Find me a handyman" or "Show me parties tonight"
   - Toggle between DeepSeek and Perplexity AI
   - Enable voice input to speak your requests

2. **Explore VibeFind**
   - Click "VibeFind" in header navigation
   - Browse upcoming social events
   - Filter by category (Parties, Food, Music, etc.)
   - Click "I'm Going!" to RSVP to an event
   - Heart events you're interested in

3. **Authentication**
   - Click "Sign In" in the header
   - Use any email/password in demo mode
   - Or try social login with Google/GitHub
   - Access your profile dropdown after login

4. **Marketplace Features**
   - Browse handyman services
   - View ratings, availability, and pricing
   - Click "Book Now" to initiate payment flow
   - Toggle dark mode with the moon/sun icon

## 🔧 Scripts

```bash
# Development
bun run dev          # Start dev server with Turbopack

# Production
bun run build        # Build for production
bun run start        # Start production server

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format with Biome
```

## 🌐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional* | OpenAI API key for GPT models |
| `DEEPSEEK_API_KEY` | Optional* | DeepSeek API key |
| `PERPLEXITY_API_KEY` | Optional* | Perplexity API key |
| `STRIPE_SECRET_KEY` | Optional** | Stripe secret key (server-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional** | Stripe publishable key |
| `NEXT_PUBLIC_DEMO_MODE` | Optional | Enable demo mode (default: true) |

*At least one AI provider key recommended for full chat functionality
**Stripe keys optional; demo mode works without them

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Configure in `netlify.toml` (already included)
2. Connect your repo
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t seftec-hub .
docker run -p 3000:3000 seftec-hub
```

## 🎨 Customization

### Adding New Themes

Edit `src/lib/themes.ts`:
```typescript
export const themes = {
  myTheme: {
    name: 'My Theme',
    gradient: 'from-blue-500 to-purple-500',
    // ... other properties
  }
}
```

### Adding New Event Categories

Edit `src/app/vibefind/page.tsx`:
```typescript
const categories = [
  { id: 'mycat', name: 'My Category', emoji: '🎯' },
  // ...
]
```

## 📝 Roadmap

Future enhancements:

- [ ] Real-time chat between users
- [ ] Email notifications for RSVPs
- [ ] Calendar integration
- [ ] Location-based filtering with maps
- [ ] User-generated event creation
- [ ] Review and rating system
- [ ] Vendor dashboard
- [ ] Analytics and tracking
- [ ] Mobile app with React Native

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- AI powered by OpenAI, DeepSeek, and Perplexity

---

**Made with ❤️ for Gen Z by SEFTEC Hub**

For questions or support, please open an issue on GitHub.
