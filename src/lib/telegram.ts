export interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
  themeParams?: Record<string, string>
  colorScheme?: 'light' | 'dark'
  platform?: string
  initDataUnsafe?: {
    user?: {
      id: number
      first_name?: string
      username?: string
    }
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

export function initTelegramWebApp(): TelegramWebApp | null {
  const webApp = getTelegramWebApp()
  if (!webApp) return null
  try {
    webApp.ready()
    webApp.expand()
    webApp.setHeaderColor?.('#0f0f1a')
    webApp.setBackgroundColor?.('#0f0f1a')
  } catch {
    // Running outside Telegram, or an older client without these methods.
  }
  return webApp
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style)
}

export function hapticNotify(type: 'error' | 'success' | 'warning') {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred(type)
}
