'use client'

import { QRCodeSVG } from 'qrcode.react'
import { TIERS, type LoyaltyUser, type TierConfig } from '@/lib/mock-data'

interface LoyaltyCardProps {
  user: LoyaltyUser
}

function TierBadge({ tier }: { tier: TierConfig }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest"
      style={{ backgroundColor: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}40` }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tier.color }} />
      {tier.nameMn}
    </span>
  )
}

export default function LoyaltyCard({ user }: LoyaltyCardProps) {
  const tier = TIERS.find((t) => t.level === user.tier)!

  return (
    <div className="loyalty-card relative w-full max-w-md overflow-hidden rounded-2xl border border-accent/30 bg-surface/80 backdrop-blur-md">
      {/* scanline overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,162,75,0.15) 2px, rgba(201,162,75,0.15) 4px)',
      }} />

      {/* noise texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 p-6">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-accent">TLJ</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
              Loyalty Card
            </p>
          </div>
          <TierBadge tier={tier} />
        </div>

        {/* user info */}
        <div className="mt-6">
          <p className="font-display text-xl font-semibold text-foreground">{user.name}</p>
          <p className="font-mono text-xs text-foreground/50">{user.memberId}</p>
        </div>

        {/* points */}
        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold text-accent">{user.points.toLocaleString()}</span>
          <span className="font-mono text-xs uppercase tracking-widest text-foreground/40">points</span>
        </div>

        {/* QR code */}
        <div className="mt-6 flex justify-center rounded-lg bg-background/60 p-4">
          <QRCodeSVG
            value={`tlj://loyalty/${user.memberId}`}
            size={140}
            bgColor="transparent"
            fgColor="#c9a24b"
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-foreground/30">
          Scan at checkout
        </p>
      </div>

      {/* gold accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
    </div>
  )
}
