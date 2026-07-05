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
  {
    level: 'bronze',
    name: 'Bronze',
    nameMn: 'Hurel',
    threshold: 0,
    color: '#cd7f32',
    multiplier: 1,
  },
  {
    level: 'silver',
    name: 'Silver',
    nameMn: 'Mungu',
    threshold: 500,
    color: '#c0c0c0',
    multiplier: 1.5,
  },
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
  {
    id: 'tx_003',
    date: '2025-06-20',
    description: 'Free cake redeem',
    points: -500,
    type: 'redeem',
  },
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

// ─── Quiz Questions ─────────────────────────────────────────────

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'TOUS les JOURS нь ямар улсад үүсгэн байгуулагдсан бэ?',
    options: ['Франц', 'Солонгос', 'Япон', 'Монгол'],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'TLJ-ийн нэрний утга юу вэ?',
    options: ['Бүх өдөр', 'Өдөр бүр', 'Нэг өдөр', 'Мөнх өдөр'],
    correctIndex: 1,
  },
  {
    id: 3,
    question: 'TLJ-ийн хамгийн алдартай бүтээгдэхүүний нэг бол?',
    options: ['Пицца', 'Талх (Бялуу)', 'Рамен', 'Суши'],
    correctIndex: 1,
  },
  {
    id: 4,
    question: 'TLJ Mongolia-ий loyalty program-ы нэр юу вэ?',
    options: ['TLJ Rewards', 'Golden Points', 'TLJ Loyalty', 'Sweet Club'],
    correctIndex: 2,
  },
  {
    id: 5,
    question: 'TLJ дэлгүүрүүд ихэвчлэн хаана байрладаг вэ?',
    options: ['Зочид буудалд', 'Оффисын барилгад', 'Худалдааны төвүүдэд', 'Нисэх онгоцны буудалд'],
    correctIndex: 2,
  },
]

// ─── Leaderboard ────────────────────────────────────────────────

export interface LeaderboardUser {
  rank: number
  name: string
  avatar: string
  totalScore: number
  gamesPlayed: number
}

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Anar', avatar: '🥇', totalScore: 12450, gamesPlayed: 87 },
  { rank: 2, name: 'Saraa', avatar: '🥈', totalScore: 11200, gamesPlayed: 79 },
  { rank: 3, name: 'Bold', avatar: '🥉', totalScore: 10850, gamesPlayed: 92 },
  { rank: 4, name: 'Nomin', avatar: '👤', totalScore: 9800, gamesPlayed: 71 },
  { rank: 5, name: 'Tugs', avatar: '👤', totalScore: 8950, gamesPlayed: 65 },
  { rank: 6, name: 'Erdene', avatar: '👤', totalScore: 8200, gamesPlayed: 58 },
  { rank: 7, name: 'Zaya', avatar: '👤', totalScore: 7650, gamesPlayed: 52 },
  { rank: 8, name: 'Munkh', avatar: '👤', totalScore: 7100, gamesPlayed: 49 },
  { rank: 9, name: 'Azzaya', avatar: '👤', totalScore: 6500, gamesPlayed: 44 },
  { rank: 10, name: 'Bilguun', avatar: '👤', totalScore: 5900, gamesPlayed: 41 },
  { rank: 11, name: 'Oyun', avatar: '👤', totalScore: 5300, gamesPlayed: 38 },
  { rank: 12, name: 'Chuluun', avatar: '👤', totalScore: 4700, gamesPlayed: 35 },
  { rank: 13, name: 'Tsetseg', avatar: '👤', totalScore: 4100, gamesPlayed: 30 },
  { rank: 14, name: 'Bat-Erdene', avatar: '👤', totalScore: 3500, gamesPlayed: 27 },
  { rank: 15, name: 'Solongo', avatar: '👤', totalScore: 2900, gamesPlayed: 22 },
]

// ─── Spin Wheel ─────────────────────────────────────────────────

export interface SpinSector {
  id: string
  label: string
  color: string
  probability: number
}

export const SPIN_SECTORS: SpinSector[] = [
  { id: 'free-coffee', label: 'Free Coffee', color: '#c9a24b', probability: 15 },
  { id: '10-off', label: '10% Off', color: '#2d6a4f', probability: 20 },
  { id: '2x-points', label: '2x Points', color: '#9b2226', probability: 10 },
  { id: 'free-cookie', label: 'Free Cookie', color: '#d4b06a', probability: 20 },
  { id: '5-off', label: '5% Off', color: '#40916c', probability: 25 },
  { id: 'birthday-bonus', label: 'Birthday Bonus', color: '#ae2012', probability: 5 },
  { id: 'try-again', label: 'Try Again', color: '#3a2e26', probability: 35 },
  { id: 'grand-prize', label: 'Grand Prize', color: '#bb3e03', probability: 2 },
]
