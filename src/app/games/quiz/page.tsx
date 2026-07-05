'use client'

import { useReducer, useCallback } from 'react'
import { QUIZ_QUESTIONS } from '@/lib/mock-data'
import { useGamesScore } from '@/contexts/GamesScoreContext'

// ─── State ──────────────────────────────────────────────────────

interface QuizState {
  currentQ: number
  answers: (number | null)[]
  score: number
  finished: boolean
}

type Action =
  | { type: 'ANSWER'; index: number }
  | { type: 'NEXT' }
  | { type: 'RESTART' }

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'ANSWER': {
      if (state.answers[state.currentQ] !== null) return state
      const q = QUIZ_QUESTIONS[state.currentQ]
      const correct = action.index === q.correctIndex
      const newAnswers = [...state.answers]
      newAnswers[state.currentQ] = action.index
      return {
        ...state,
        answers: newAnswers,
        score: correct ? state.score + 20 : state.score,
      }
    }
    case 'NEXT': {
      if (state.currentQ >= QUIZ_QUESTIONS.length - 1) {
        return { ...state, finished: true }
      }
      return { ...state, currentQ: state.currentQ + 1 }
    }
    case 'RESTART': {
      return createInitial()
    }
    default:
      return state
  }
}

function createInitial(): QuizState {
  return {
    currentQ: 0,
    answers: Array.from({ length: QUIZ_QUESTIONS.length }, () => null),
    score: 0,
    finished: false,
  }
}

// ─── Component ──────────────────────────────────────────────────

export default function QuizPage() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitial)
  const { addScore, totalScore } = useGamesScore()
  const q = QUIZ_QUESTIONS[state.currentQ]
  const answered = state.answers[state.currentQ] !== null
  const selectedIdx = state.answers[state.currentQ]
  const isCorrect = selectedIdx === q?.correctIndex

  const handleAnswer = useCallback(
    (idx: number) => {
      if (answered) return
      dispatch({ type: 'ANSWER', index: idx })
    },
    [answered],
  )

  const handleNext = useCallback(() => {
    if (state.finished) {
      addScore('quiz', state.score)
    }
    dispatch({ type: 'NEXT' })
  }, [state.finished, state.score, addScore])

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESTART' })
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-12">
      {/* heading */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent">
          TLJ Quiz
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          Test your TLJ knowledge
        </p>
      </div>

      {/* progress */}
      <div className="flex items-center gap-2">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < state.currentQ
                ? 'w-6 bg-accent'
                : i === state.currentQ
                  ? 'w-8 bg-accent'
                  : 'w-3 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* question */}
      {!state.finished && q && (
        <div className="w-full">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-foreground/30">
            Асуулт {state.currentQ + 1} / {QUIZ_QUESTIONS.length}
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            {q.question}
          </h2>

          {/* options */}
          <div className="mt-6 flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedIdx === i
              const showResult = answered

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`w-full rounded-xl border px-5 py-3.5 text-left font-mono text-sm transition-all ${
                    showResult && i === q.correctIndex
                      ? 'border-correct/60 bg-correct/10 text-correct'
                      : showResult && isSelected && !isCorrect
                        ? 'border-red-500/60 bg-red-500/10 text-red-400'
                        : answered
                          ? 'border-muted/30 bg-surface/30 text-foreground/40'
                          : 'border-muted/50 bg-surface/40 text-foreground/80 hover:border-accent/50 hover:bg-surface-light/40'
                  }`}
                >
                  <span className="mr-3 font-mono text-[10px] text-foreground/30">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* feedback */}
          {answered && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl border border-accent/50 bg-accent/10 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-accent transition-all hover:bg-accent/20"
              >
                {state.currentQ >= QUIZ_QUESTIONS.length - 1 ? 'Дуусгах' : 'Дараагийн'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* results */}
      {state.finished && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              Таны оноо
            </p>
            <p className="font-display text-5xl font-bold text-accent">{state.score}</p>
            <p className="font-mono text-xs text-foreground/40">
              / {QUIZ_QUESTIONS.length * 20}
            </p>
          </div>

          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">
              Нийт оноо (бүх тоглоом)
            </p>
            <p className="font-display text-xl font-bold text-foreground/70">{totalScore}</p>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="rounded-xl border border-muted px-6 py-2 font-mono text-xs uppercase tracking-widest text-foreground/50 transition-all hover:border-accent hover:text-accent"
          >
            Дахин тоглох
          </button>
        </div>
      )}
    </div>
  )
}
