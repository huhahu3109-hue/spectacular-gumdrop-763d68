# Zufaan Game

Zufaan Game is a mobile-friendly number-tapping game designed to run as a Telegram Mini App. Players tap the numbers 1 through 25 in ascending order on a shuffled 5x5 grid before a countdown timer runs out — completing a grid starts a new, re-shuffled round with a small time bonus. It tracks score, round, and a persisted best score, and includes Start Game and Restart controls.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router)
- Vite 7
- Tailwind CSS 4
- TypeScript (strict mode)
- [Telegram Mini Apps JS SDK](https://core.telegram.org/bots/webapps) for Telegram integration (ready/expand, theming, haptic feedback)
- Deployed on Netlify

## Running locally

```bash
npm install
npm run dev
```

This starts a Vite dev server (see `package.json` for the port). The game runs fully in a regular browser — Telegram-specific APIs are optional and no-op safely when `window.Telegram` isn't present.

To build for production:

```bash
npm run build
```

## Running as a Telegram Mini App

1. Deploy the app (e.g. to Netlify) so it's reachable over HTTPS.
2. Create a bot with [@BotFather](https://t.me/BotFather) if you don't have one, and use `/newapp` (or the bot's Mini App settings) to point it at the deployed URL.
3. Open the Mini App from the bot's menu button or an inline keyboard button in Telegram. Telegram injects `window.Telegram.WebApp` in that context, which the app detects on load to expand to full height, apply theme colors, and enable haptic feedback on taps.

See `AGENTS.md` for more details on the code structure and game logic.
