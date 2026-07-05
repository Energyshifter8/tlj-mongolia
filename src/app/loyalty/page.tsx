import { MOCK_USER, MOCK_TRANSACTIONS } from '@/lib/mock-data'
import LoyaltyCard from '@/components/loyalty/LoyaltyCard'
import TierProgress from '@/components/loyalty/TierProgress'
import WalletButtons from '@/components/loyalty/WalletButtons'

export default function LoyaltyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12 px-4 py-16">
      {/* heading */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent sm:text-4xl">
          Loyalty Program
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          Earn points. Unlock rewards.
        </p>
      </div>

      {/* card */}
      <LoyaltyCard user={MOCK_USER} />

      {/* tier progress */}
      <TierProgress points={MOCK_USER.points} tier={MOCK_USER.tier} />

      {/* wallet buttons */}
      <WalletButtons />

      {/* recent transactions */}
      <div className="w-full max-w-md">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-foreground/50">
          Recent Activity
        </h2>
        <ul className="flex flex-col gap-2">
          {MOCK_TRANSACTIONS.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between rounded-lg border border-muted/50 bg-surface/40 px-4 py-3"
            >
              <div>
                <p className="text-sm text-foreground/80">{tx.description}</p>
                <p className="font-mono text-[10px] text-foreground/30">{tx.date}</p>
              </div>
              <span
                className={`font-mono text-sm font-semibold ${
                  tx.type === 'earn' ? 'text-accent' : 'text-foreground/40'
                }`}
              >
                {tx.type === 'earn' ? '+' : ''}{tx.points}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
