# MelalAI

**Temukan tempat sesuai moodmu** — A smart local place discovery app that uses AI to recommend cafes, restaurants, parks, and other spots based on your mood or natural language preferences.

## Features

- **AI-Powered Search** — Describe your mood in natural language (e.g., _"I want a cozy cafe in Bali for working"_) and get personalized place recommendations powered by Groq (LLaMA).
- **Interactive Map** — Browse recommendations on a real-time Leaflet map with geolocation support.
- **Rich Place Cards** — View category, address, opening hours, estimated budget, and AI-generated reasoning for each recommendation.
- **Location-Based** — Uses browser geolocation to find places near you.
- **Fallback Mode** — Gracefully falls back to curated mock data when the AI API is unavailable.
- **Favorites** — Save and manage your favorite places via localStorage.
- **Fully Responsive** — Optimized for both desktop and mobile with a dedicated map modal on small screens.

## Tech Stack

| Tech                        | Purpose            |
| --------------------------- | ------------------ |
| **Next.js 16** (App Router) | Framework          |
| **React 19**                | UI Library         |
| **TypeScript**              | Type Safety        |
| **Tailwind CSS 4**          | Styling            |
| **Leaflet + react-leaflet** | Interactive Maps   |
| **Groq SDK**                | AI Recommendations |
| **Overpass API**            | OpenStreetMap Data |

## Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/melalai.git
cd melalai

# Install dependencies
npm install
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com).

## How to Run

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── places/          # Nearby places from Overpass API
│   │   └── recommend/       # AI-powered place recommendations
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Main page (search, results, map)
├── components/
│   ├── MapController.tsx     # Fly-to animation on place select
│   ├── MapView.tsx           # Interactive Leaflet map
│   ├── MoodInput.tsx         # Natural language search input
│   ├── PlaceCard.tsx         # Place result card
│   └── SkeletonCard.tsx      # Loading skeleton
├── hooks/
│   ├── useFavorites.tsx      # Favorites management (localStorage)
│   └── useGeolocation.tsx    # Browser geolocation
├── types/
│   └── index.ts              # Place type definition
└── utils/
    └── distance.tsx           # Haversine distance calculation
```

## Deployment

Deploy easily on [Vercel](https://vercel.com):

```bash
npx vercel
```

Remember to set the `GROQ_API_KEY` environment variable in your deployment dashboard.

## Author

Built with ❤️ by Astunxara.
