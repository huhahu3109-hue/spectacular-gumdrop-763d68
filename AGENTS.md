# AGENTS.md

This document describes the project structure and conventions for AI agents and developers working on this codebase.

## Project Overview

Zufaan Game is a mobile-friendly number-tapping game built to run as a Telegram Mini App. Players tap numbers 1 through 25 in ascending order on a shuffled grid before a countdown timer runs out. Built with TanStack Start and deployed on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | Netlify |
| Platform integration | Telegram Mini Apps JS SDK (`telegram-web-app.js`) |

## Directory Structure

```
├── public/
│   ├── favicon.ico
│   └── tanstack-circle-logo.png
├── src/
│   ├── components/
│   │   └── ZufaanGame.tsx   # Main game component: grid, timer, score, start/restart flow.
│   ├── lib/
│   │   └── telegram.ts      # Telegram WebApp SDK helpers (init, haptics, theme).
│   ├── routes/
│   │   ├── __root.tsx       # HTML shell, meta tags, loads the Telegram WebApp script, initializes it.
│   │   └── index.tsx        # Home route: renders ZufaanGame.
│   ├── router.tsx           # TanStack Router setup.
│   └── styles.css           # Tailwind import + mobile-app-like base styles (no overscroll, no tap highlight).
├── netlify.toml              # Build command, publish directory, dev server settings.
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Game Logic (`src/components/ZufaanGame.tsx`)

- A 5x5 grid (25 tiles) is shuffled at the start of each round.
- The player must tap tiles in ascending numeric order (1, 2, 3, ...). A correct tap increments score and reveals the next target; an incorrect tap flashes red and gives brief haptic/error feedback.
- Completing a full grid (all 25 tiles) starts a new round with a fresh shuffle and a small time bonus.
- A countdown timer (starts at 30s) drives the game; when it reaches 0 the game ends and the final score is shown.
- Best score is persisted to `localStorage` (`zufaan-best-score`) so it survives reloads.
- `Start Game` and `Restart` both call the same `startGame` routine, which resets state and (re)starts the interval timer.

## Telegram Mini App integration (`src/lib/telegram.ts`)

- The Telegram Mini Apps SDK script (`https://telegram.org/js/telegram-web-app.js`) is loaded via the root route's `head().scripts`.
- `initTelegramWebApp()` is called once on mount in `__root.tsx` and calls `WebApp.ready()` / `WebApp.expand()`, plus sets header/background colors to match the app's dark theme. All calls are wrapped defensively since the app also needs to run standalone in a normal browser (outside Telegram) during development.
- `hapticImpact()` / `hapticNotify()` wrap `WebApp.HapticFeedback` and no-op safely when not running inside Telegram.

## Conventions

### Naming
- Components: PascalCase
- Utilities/hooks: camelCase
- Routes: kebab-case files

### Styling
- Tailwind CSS utility classes only, no separate CSS modules.
- Dark theme (`#0f0f1a` background) to match typical Telegram Mini App chrome; `theme-color` meta tag matches.
- Layout uses `env(safe-area-inset-*)` padding so content isn't clipped by notches/system bars on Android/iOS.
- Tap targets are large (grid tiles are square, minimum ~56px) and `touch-action: manipulation` / disabled text selection are set globally for a native-app feel.

### TypeScript
- Strict mode enabled.
- No special path aliases beyond relative imports (`../lib/telegram`, `../components/ZufaanGame`).

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Testing inside Telegram

The app works standalone in any browser for development. To test it as an actual Telegram Mini App, register a bot with @BotFather, set its Mini App URL to the deployed Netlify site URL, and open it via the bot's menu button or an inline button — Telegram will inject `window.Telegram.WebApp` at that point, which `initTelegramWebApp()` detects automatically.
