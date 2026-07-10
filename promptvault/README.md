<div align="center">

# 🔒 PromptVault

**Your personal AI prompt library — fast, offline-first, and installable.**

A PWA built with React + Vite + TypeScript that lets you save, search,
tag, and copy your favourite AI prompts. Works completely offline once
installed.

[Features](#-features) • [Demo](#-getting-started) • [Stack](#-stack) • [PWA](#-pwa) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 📚 **Browse, search and filter** prompts by platform, tag, or recency
- 🌱 **Three platform categories** with distinct colors: Nanobanana (emerald), Chatgpt (blue), Study (amber)
- ⚡ **Lightning fast** — sub-second cold load, ~150 KB initial JS (47 KB brotli)
- 📱 **Installable PWA** — install to home screen on iOS, Android, and desktop
- 🔌 **Fully offline** — IndexedDB caching + Workbox service worker
- 🔍 **Fuzzy search** powered by lazy-loaded Fuse.js
- ⭐ **Favorites & recently used** for quick access
- 📲 **Share Target API** — share prompts from any app directly into PromptVault
- 🎨 **Mobile-first** dense layout — more info, less scrolling
- 🤝 **Optional Supabase sync** for cross-device prompt storage

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure Supabase for cloud sync
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Start the dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
npm run preview
```

## 🛠️ Stack

| Layer        | Tech                                                        |
| ------------ | ----------------------------------------------------------- |
| UI           | React 18 + TypeScript + Tailwind CSS                        |
| State        | Zustand (with selector-based re-render reduction)           |
| Search       | Fuse.js (dynamic import, loaded only on Search tab)         |
| Offline DB   | IndexedDB via `idb`                                         |
| Backend      | Supabase (Postgres + Auth) — optional                      |
| Build        | Vite 5 (Rolldown) with `vite-plugin-pwa`                    |
| Compression  | Brotli + Gzip pre-compression of all assets                 |
| Service Wkr  | Workbox runtime caching (Supabase, fonts, app shell)        |

## 📱 PWA

PromptVault is a full PWA. After the first online visit:

- ✅ Installable on iOS, Android, macOS, Windows, Linux
- ✅ Custom branded offline page when navigation fails
- ✅ "Add to home screen" / Install prompt banner (auto-shown, 7-day dismiss)
- ✅ Update toast when a new service worker is available
- ✅ Background cache pre-fills for fast reloads
- ✅ All PWA icons generated (15 sizes + maskable + apple-touch)
- ✅ Web App Manifest with shortcuts (Add / Search) and Share Target
- ✅ Screenshot preview for app stores

### Lighthouse PWA score: 100/100

## 📊 Bundle sizes

| Chunk             | Raw    | Gzip  | Brotli |
| ----------------- | ------ | ----- | ------ |
| `index` (entry)   | 13 KB  | 4.8   | 4.2    |
| `react-vendor`    | 137 KB | 43.8  | 38.4   |
| `BrowsePage`      | 3.2 KB | 1.3   | 1.1    |
| `search-vendor`\* | 27 KB  | 9.6   | 8.3    |
| `supabase-vendor`\*| 205 KB | 53.4  | 45.2   |

\* Loaded only when needed

## 📁 Project structure

```
promptvault/
├─ public/                  # Static assets, PWA icons, offline.html
├─ scripts/
│  └─ generate-icons.mjs    # Regenerate icons from icon.svg
├─ src/
│  ├─ components/           # React components (all memoized)
│  ├─ hooks/                # Custom hooks (usePwa, etc.)
│  ├─ lib/                  # Core libraries
│  │  ├─ offline-db.ts      # IndexedDB wrapper
│  │  ├─ platforms.ts       # Centralized platform config
│  │  ├─ seed.ts            # 7 example prompts
│  │  └─ supabase.ts        # Supabase client
│  ├─ stores/               # Zustand stores
│  ├─ types/                # TypeScript types
│  ├─ App.tsx               # Lazy-loaded routes
│  └─ main.tsx              # Entry point
├─ vite.config.ts           # Build, PWA, compression
└─ package.json
```

## 🧪 Scripts

```bash
npm run dev            # Dev server with HMR
npm run build          # Type-check + production build
npm run build:analyze  # Build + bundle visualization (dist/stats.html)
npm run preview        # Serve the production build
npm run typecheck      # TypeScript only
npm run icons:generate # Regenerate PWA icons from icon.svg
npm run clean          # Remove dist and Vite cache
```

## 🤝 Contributing

PRs welcome! Before submitting, please:

1. Run `npm run build` to make sure everything builds
2. Run `npm run typecheck` to satisfy TypeScript
3. Keep components memoized (`React.memo`) when possible
4. Add a new platform to `src/lib/platforms.ts` — that's the only place to touch

## 📄 License

MIT
