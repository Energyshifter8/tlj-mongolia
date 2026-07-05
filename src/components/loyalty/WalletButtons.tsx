'use client'

import { useState, useCallback } from 'react'

interface Toast {
  id: number
  message: string
}

export default function WalletButtons() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <>
      <div className="flex flex-col gap-3 w-full max-w-md sm:flex-row">
        {/* Apple Wallet */}
        <button
          type="button"
          onClick={() => showToast('Wallet integration coming soon')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-muted bg-surface/60 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-all hover:border-accent/50 hover:text-accent hover:bg-surface-light/60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Apple Wallet
        </button>

        {/* Google Wallet */}
        <button
          type="button"
          onClick={() => showToast('Wallet integration coming soon')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-muted bg-surface/60 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-all hover:border-accent/50 hover:text-accent hover:bg-surface-light/60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Google Wallet
        </button>
      </div>

      {/* toast notifications */}
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-in slide-in-from-bottom-4 rounded-lg border border-accent/30 bg-surface px-5 py-3 font-mono text-xs text-foreground shadow-lg backdrop-blur-md"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  )
}
