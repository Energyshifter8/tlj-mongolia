'use client'

import { useGamesScore } from '@/contexts/GamesScoreContext'
import { type LeaderboardUser, MOCK_LEADERBOARD } from '@/lib/mock-data'

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a24b]/20 text-sm font-bold text-[#c9a24b]">
        🥇
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#c0c0c0]/20 text-sm font-bold text-[#c0c0c0]">
        🥈
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#cd7f32]/20 text-sm font-bold text-[#cd7f32]">
        🥉
      </span>
    )
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs font-mono text-foreground/40">
      {rank}
    </span>
  )
}

function UserRow({ user, highlight }: { user: LeaderboardUser; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
        highlight
          ? 'border border-accent/30 bg-accent/5'
          : 'border border-transparent hover:bg-surface-light/40'
      }`}
    >
      <RankBadge rank={user.rank} />

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-sm">
        {user.avatar}
      </div>

      <div className="flex-1">
        <p
          className={`font-display text-sm font-semibold ${highlight ? 'text-accent' : 'text-foreground/80'}`}
        >
          {user.name}
        </p>
        <p className="font-mono text-[10px] text-foreground/30">{user.gamesPlayed} games</p>
      </div>

      <div className="text-right">
        <p
          className={`font-mono text-sm font-bold ${user.rank <= 3 ? 'text-accent' : 'text-foreground/60'}`}
        >
          {user.totalScore.toLocaleString()}
        </p>
        <p className="font-mono text-[10px] text-foreground/30">pts</p>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const { totalScore } = useGamesScore()

  // merge user's score into leaderboard
  const merged = [...MOCK_LEADERBOARD]

  if (totalScore > 0) {
    // find where user fits
    const userEntry: LeaderboardUser = {
      rank: 0,
      name: 'You',
      avatar: '⭐',
      totalScore,
      gamesPlayed: 0,
    }

    let inserted = false
    for (let i = 0; i < merged.length; i++) {
      if (totalScore > merged[i].totalScore) {
        merged.splice(i, 0, userEntry)
        inserted = true
        break
      }
    }
    if (!inserted) merged.push(userEntry)

    // re-rank
    merged.forEach((u, i) => {
      u.rank = i + 1
    })
  }

  const display = merged.slice(0, 20)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-12">
      {/* heading */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent">Leaderboard</h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          Top players this month
        </p>
      </div>

      {/* user total */}
      {totalScore > 0 && (
        <div className="w-full rounded-xl border border-accent/30 bg-surface/60 p-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            Your total score
          </p>
          <p className="font-display text-2xl font-bold text-accent">
            {totalScore.toLocaleString()}
          </p>
        </div>
      )}

      {/* list */}
      <div className="flex w-full flex-col gap-1.5">
        {display.map((user) => (
          <UserRow key={`${user.name}-${user.rank}`} user={user} highlight={user.name === 'You'} />
        ))}
      </div>
    </div>
  )
}
