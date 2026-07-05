'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────

export type GameType = 'wordle' | 'block-blast' | 'quiz' | 'spin-wheel'

export interface GameScoreEntry {
  game: GameType
  score: number
  timestamp: number
}

export interface GamesScoreState {
  scores: Record<GameType, number>
  totalScore: number
  history: GameScoreEntry[]
}

type Action = { type: 'ADD_SCORE'; game: GameType; score: number } | { type: 'RESET' }

// ─── Context ────────────────────────────────────────────────────

interface GamesScoreContextValue extends GamesScoreState {
  addScore: (game: GameType, score: number) => void
  resetScores: () => void
}

const GamesScoreContext = createContext<GamesScoreContextValue | null>(null)

// ─── Reducer ────────────────────────────────────────────────────

function reducer(state: GamesScoreState, action: Action): GamesScoreState {
  switch (action.type) {
    case 'ADD_SCORE': {
      const newScores = { ...state.scores }
      newScores[action.game] = (newScores[action.game] ?? 0) + action.score
      const totalScore = Object.values(newScores).reduce((s, v) => s + v, 0)
      return {
        ...state,
        scores: newScores,
        totalScore,
        history: [
          ...state.history,
          { game: action.game, score: action.score, timestamp: Date.now() },
        ],
      }
    }
    case 'RESET': {
      return {
        scores: {} as Record<GameType, number>,
        totalScore: 0,
        history: [],
      }
    }
    default:
      return state
  }
}

// ─── Provider ───────────────────────────────────────────────────

export function GamesScoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    scores: {} as Record<GameType, number>,
    totalScore: 0,
    history: [],
  })

  const addScore = useCallback((game: GameType, score: number) => {
    dispatch({ type: 'ADD_SCORE', game, score })
  }, [])

  const resetScores = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return (
    <GamesScoreContext.Provider value={{ ...state, addScore, resetScores }}>
      {children}
    </GamesScoreContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────

export function useGamesScore() {
  const ctx = useContext(GamesScoreContext)
  if (!ctx) throw new Error('useGamesScore must be used within GamesScoreProvider')
  return ctx
}
