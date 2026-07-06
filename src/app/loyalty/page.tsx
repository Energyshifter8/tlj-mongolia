'use client'

import { useRef } from 'react'
import LoyaltyCard from '@/components/loyalty/LoyaltyCard'
import TierProgress from '@/components/loyalty/TierProgress'
import WalletButtons from '@/components/loyalty/WalletButtons'
import { useScrollTriggerFade } from '@/hooks/useScrollTriggerFade'
import { MOCK_TRANSACTIONS, MOCK_USER } from '@/lib/mock-data'

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  useScrollTriggerFade(ref)
  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  )
}

export default function LoyaltyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12 px-4 py-16 animate-[fadeIn_300ms_ease-out]">
      {/* heading */}
      <FadeSection className="w-full text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent-gold sm:text-4xl">
          Loyalty Program
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          Earn points. Unlock rewards.
        </p>
      </FadeSection>

      {/* card */}
      <FadeSection className="w-full flex justify-center">
        <LoyaltyCard user={MOCK_USER} />
      </FadeSection>

      {/* tier progress */}
      <FadeSection className="w-full flex justify-center">
        <TierProgress points={MOCK_USER.points} tier={MOCK_USER.tier} />
      </FadeSection>

      {/* wallet buttons */}
      <FadeSection className="w-full flex justify-center">
        <WalletButtons />
      </FadeSection>

      {/* recent transactions */}
      <FadeSection className="w-full max-w-md">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-text-secondary">
          Recent Activity
        </h2>
        <ul className="flex flex-col gap-2">
          {MOCK_TRANSACTIONS.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3"
            >
              <div>
                <p className="text-sm text-text-primary">{tx.description}</p>
                <p className="font-mono text-[10px] text-text-tertiary">{tx.date}</p>
              </div>
              <span
                className={`font-mono text-sm font-semibold ${
                  tx.type === 'earn' ? 'text-accent-gold' : 'text-text-tertiary'
                }`}
              >
                {tx.type === 'earn' ? '+' : ''}
                {tx.points}
              </span>
            </li>
          ))}
        </ul>
      </FadeSection>
    </div>
  )
}
