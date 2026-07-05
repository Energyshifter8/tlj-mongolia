# TOUS les JOURS Mongolia — Digital Experience

Premium Franco-Asian pâtisserie web app built with Next.js 16, Tailwind CSS v4, Three.js, and TypeScript.

## Features

- **3D Showcase** — Low-poly pastry models via React Three Fiber (dynamic import, SSR disabled)
- **Loyalty Program** — QR code card, tier progress (Bronze/Silver/Gold), Apple/Google Wallet UI
- **Games** — Wordle (Mongolian words), Block Blast (8x8 grid), TLJ Quiz, Spin & Win wheel
- **Leaderboard** — Aggregated scores from all games via GamesScoreContext
- **PWA** — Service worker with offline caching, installable on home screen
- **Dark premium aesthetic** — Gold accent (#c9a24b), Playfair Display headings, JetBrains Mono labels

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| 3D | Three.js + React Three Fiber + Drei |
| Language | TypeScript (strict) |
| Fonts | Playfair Display, Inter, JetBrains Mono |

## Getting Started

```bash
# install dependencies
npm install

# development
npm run dev

# production build
npm run build && npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run format` | Biome formatter |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, Navbar, Footer, SW)
│   ├── page.tsx                # Home page with 3D showcase
│   ├── manifest.ts             # PWA manifest (Next.js 16 route)
│   ├── loyalty/page.tsx        # Loyalty card + progress
│   ├── leaderboard/page.tsx    # Global leaderboard
│   └── games/
│       ├── wordle/page.tsx     # Wordle clone
│       ├── block-blast/page.tsx # Block Blast clone
│       ├── quiz/page.tsx       # TLJ brand quiz
│       └── spin-wheel/page.tsx # Spin & Win wheel
├── components/
│   ├── layout/                 # Navbar, Footer, SW register
│   ├── three/                  # PastryShowcase (R3F)
│   ├── loyalty/                # Card, TierProgress, WalletButtons
│   └── games/                  # Grid, Keyboard, Board, SpinWheel, Modal
├── contexts/
│   └── GamesScoreContext.tsx    # Cross-game score aggregation
├── hooks/
│   └── useWordleGame.ts        # Wordle game logic hook
└── lib/
    ├── mock-data.ts            # Mock data (Firebase-ready types)
    ├── word-list.ts            # Mongolian 5-letter words
    └── block-blast-engine.ts   # Pure game logic functions
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js — no config needed
4. Deploy

### Manual

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Currently no API keys required — all data is mock. Firebase integration ready via `src/lib/mock-data.ts` types.

## License

Private — TOUS les JOURS Mongolia
