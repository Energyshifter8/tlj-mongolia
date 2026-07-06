'use client'

import { useCallback, useEffect, useReducer } from 'react'
import { getRandomWord, MAX_ATTEMPTS, WORD_LENGTH } from '@/lib/word-list'

// ─── Types ──────────────────────────────────────────────────────

export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

export interface Tile {
  letter: string
  status: LetterStatus
}

export type GameStatus = 'playing' | 'won' | 'lost'

export interface GameState {
  target: string
  attempts: Tile[][]
  currentRow: number
  currentCol: number
  status: GameStatus
  shakeRow: boolean
  revealedRows: number[]
}

type Action =
  | { type: 'INPUT_LETTER'; letter: string }
  | { type: 'DELETE' }
  | { type: 'SUBMIT' }
  | { type: 'RESET' }
  | { type: 'END_SHAKE' }

// ─── Letter evaluation (handles duplicates correctly) ───────────

export function evaluateGuess(guess: string, target: string): Tile[] {
  const result: Tile[] = Array.from({ length: WORD_LENGTH }, () => ({
    letter: '',
    status: 'empty' as LetterStatus,
  }))

  const targetChars = target.split('')
  const guessChars = guess.toUpperCase().split('')

  // Count available letters in target
  const available = new Map<string, number>()
  for (const ch of targetChars) {
    available.set(ch, (available.get(ch) ?? 0) + 1)
  }

  // First pass: mark correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    result[i].letter = guessChars[i]
    if (guessChars[i] === targetChars[i]) {
      result[i].status = 'correct'
      available.set(guessChars[i], available.get(guessChars[i])! - 1)
    }
  }

  // Second pass: mark present or absent
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].status === 'correct') continue

    const count = available.get(guessChars[i]) ?? 0
    if (count > 0) {
      result[i].status = 'present'
      available.set(guessChars[i], count - 1)
    } else {
      result[i].status = 'absent'
    }
  }

  return result
}

// ─── Reducer ────────────────────────────────────────────────────

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'INPUT_LETTER': {
      if (state.status !== 'playing') return state
      if (state.currentCol >= WORD_LENGTH) return state

      const letter = action.letter.toUpperCase()
      const newAttempts = state.attempts.map((row) => [...row])
      newAttempts[state.currentRow] = [
        ...newAttempts[state.currentRow].slice(0, state.currentCol),
        { letter, status: 'tbd' },
        ...newAttempts[state.currentRow].slice(state.currentCol + 1),
      ]

      return {
        ...state,
        attempts: newAttempts,
        currentCol: state.currentCol + 1,
      }
    }

    case 'DELETE': {
      if (state.status !== 'playing') return state
      if (state.currentCol === 0) return state

      const newCol = state.currentCol - 1
      const newAttempts = state.attempts.map((row) => [...row])
      newAttempts[state.currentRow] = [
        ...newAttempts[state.currentRow].slice(0, newCol),
        { letter: '', status: 'empty' },
        ...newAttempts[state.currentRow].slice(newCol + 1),
      ]

      return {
        ...state,
        attempts: newAttempts,
        currentCol: newCol,
      }
    }

    case 'SUBMIT': {
      if (state.status !== 'playing') return state
      if (state.currentCol < WORD_LENGTH) return state

      const guess = state.attempts[state.currentRow]
        .map((t) => t.letter)
        .join('')
        .toUpperCase()

      const evaluated = evaluateGuess(guess, state.target)
      const won = guess === state.target
      const lost = state.currentRow >= MAX_ATTEMPTS - 1

      const newAttempts = state.attempts.map((row, i) => (i === state.currentRow ? evaluated : row))

      return {
        ...state,
        attempts: newAttempts,
        currentRow: state.currentRow + 1,
        currentCol: 0,
        status: won ? 'won' : lost ? 'lost' : 'playing',
        shakeRow: true,
        revealedRows: [...state.revealedRows, state.currentRow],
      }
    }

    case 'END_SHAKE': {
      return { ...state, shakeRow: false }
    }

    case 'RESET': {
      return createInitialState()
    }

    default:
      return state
  }
}

// ─── Initial state ──────────────────────────────────────────────

function createInitialState(): GameState {
  return {
    target: getRandomWord(),
    attempts: Array.from({ length: MAX_ATTEMPTS }, () =>
      Array.from({ length: WORD_LENGTH }, () => ({ letter: '', status: 'empty' as LetterStatus })),
    ),
    currentRow: 0,
    currentCol: 0,
    status: 'playing',
    shakeRow: false,
    revealedRows: [],
  }
}

// ─── Hook ───────────────────────────────────────────────────────

export function useWordleGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const inputLetter = useCallback((letter: string) => {
    dispatch({ type: 'INPUT_LETTER', letter })
  }, [])

  const deleteLetter = useCallback(() => {
    dispatch({ type: 'DELETE' })
  }, [])

  const submitGuess = useCallback(() => {
    dispatch({ type: 'SUBMIT' })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const endShake = useCallback(() => {
    dispatch({ type: 'END_SHAKE' })
  }, [])

  // Physical keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (state.status !== 'playing') return

      if (e.key === 'Enter') {
        e.preventDefault()
        submitGuess()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        deleteLetter()
      } else if (/^[A-Za-zА-Яа-яЁё]$/.test(e.key)) {
        e.preventDefault()
        inputLetter(e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status, inputLetter, deleteLetter, submitGuess])

  // Build keyboard status map
  const keyStatuses = new Map<string, LetterStatus>()
  for (const row of state.attempts) {
    for (const tile of row) {
      if (tile.status === 'empty' || tile.status === 'tbd') continue
      const existing = keyStatuses.get(tile.letter)
      // correct > present > absent
      if (
        !existing ||
        tile.status === 'correct' ||
        (tile.status === 'present' && existing === 'absent')
      ) {
        keyStatuses.set(tile.letter, tile.status)
      }
    }
  }

  return {
    ...state,
    inputLetter,
    deleteLetter,
    submitGuess,
    resetGame,
    endShake,
    keyStatuses,
  }
}
