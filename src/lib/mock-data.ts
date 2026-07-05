// ─── Loyalty Tiers ───────────────────────────────────────────────

export type TierLevel = 'bronze' | 'silver' | 'gold'

export interface TierConfig {
  level: TierLevel
  name: string
  nameMn: string
  threshold: number
  color: string
  multiplier: number
}

export const TIERS: TierConfig[] = [
  { level: 'bronze', name: 'Bronze', nameMn: 'Hurel', threshold: 0, color: '#cd7f32', multiplier: 1 },
  { level: 'silver', name: 'Silver', nameMn: 'Mungu', threshold: 500, color: '#c0c0c0', multiplier: 1.5 },
  { level: 'gold', name: 'Gold', nameMn: 'Alt', threshold: 1500, color: '#c9a24b', multiplier: 2 },
]

// ─── User ────────────────────────────────────────────────────────

export interface LoyaltyUser {
  id: string
  name: string
  email: string
  memberId: string
  points: number
  tier: TierLevel
  joinedAt: string
}

export const MOCK_USER: LoyaltyUser = {
  id: 'usr_01H8X9...',
  name: 'Bat-Erdene',
  email: 'bat@example.mn',
  memberId: 'TLJ-MN-00427',
  points: 820,
  tier: 'silver',
  joinedAt: '2024-03-15',
}

// ─── Transactions ────────────────────────────────────────────────

export interface Transaction {
  id: string
  date: string
  description: string
  points: number
  type: 'earn' | 'redeem'
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_001', date: '2025-06-28', description: 'Croissant purchase', points: 24, type: 'earn' },
  { id: 'tx_002', date: '2025-06-25', description: 'Birthday bonus', points: 100, type: 'earn' },
  { id: 'tx_003', date: '2025-06-20', description: 'Free cake redeem', points: -500, type: 'redeem' },
  { id: 'tx_004', date: '2025-06-18', description: 'Set menu purchase', points: 65, type: 'earn' },
  { id: 'tx_005', date: '2025-06-12', description: 'Latte & pastry', points: 18, type: 'earn' },
]

// ─── Helpers ─────────────────────────────────────────────────────

export function getNextTier(tier: TierLevel): TierConfig | null {
  const idx = TIERS.findIndex((t) => t.level === tier)
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

export function getPointsToNextTier(points: number, currentTier: TierLevel): number {
  const next = getNextTier(currentTier)
  if (!next) return 0
  return Math.max(0, next.threshold - points)
}

export function getTierProgress(points: number, currentTier: TierLevel): number {
  const current = TIERS.find((t) => t.level === currentTier)!
  const next = getNextTier(currentTier)
  if (!next) return 100
  const range = next.threshold - current.threshold
  const progress = points - current.threshold
  return Math.min(100, Math.round((progress / range) * 100))
}
