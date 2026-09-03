import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { initTelegramWebApp } from '../lib/telegram'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      },
      {
        name: 'theme-color',
        content: '#0f0f1a',
      },
      {
        title: 'Zufaan Game',
      },
      {
        name: 'description',
        content:
          'Zufaan Game — a fast-paced number tapping game built as a Telegram Mini App.',
      },
    ],
    scripts: [
      {
        src: 'https://telegram.org/js/telegram-web-app.js',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTelegramWebApp()
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#0f0f1a]">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
