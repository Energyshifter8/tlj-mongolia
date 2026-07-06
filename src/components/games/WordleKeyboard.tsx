'use client'

import type { LetterStatus } from '@/hooks/useWordleGame'

interface WordleKeyboardProps {
  onKey: (letter: string) => void
  onDelete: () => void
  onSubmit: () => void
  keyStatuses: Map<string, LetterStatus>
  disabled?: boolean
}

const ROWS = [
  ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё'],
  ['Ж', 'З', 'И', 'Й', 'К', 'Л', 'М'],
  ['Н', 'О', 'Ө', 'П', 'Р', 'С', 'Т'],
  ['У', 'Ү', 'Ф', 'Х', 'Ц', 'Ч', 'Ш'],
  ['Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'],
]

const STATUS_COLORS: Record<LetterStatus, string> = {
  correct: 'bg-correct text-bg-deep border-correct',
  present: 'bg-present text-bg-deep border-present',
  absent: 'bg-absent text-text-primary border-absent',
  empty: 'bg-bg-surface text-text-primary border-border-subtle hover:bg-bg-elevated',
  tbd: 'bg-bg-surface text-text-primary border-border-subtle',
}

export default function WordleKeyboard({
  onKey,
  onDelete,
  onSubmit,
  keyStatuses,
  disabled,
}: WordleKeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((letter) => {
            const status = keyStatuses.get(letter) ?? 'empty'
            return (
              <button
                key={letter}
                type="button"
                onClick={() => onKey(letter)}
                disabled={disabled}
                className={`flex h-10 w-8 items-center justify-center rounded-md border font-mono text-xs font-semibold transition-all sm:h-11 sm:w-9 ${
                  STATUS_COLORS[status]
                } disabled:opacity-40`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}

      {/* action row */}
      <div className="flex gap-1.5 mt-1">
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="flex h-11 w-16 items-center justify-center rounded-md border border-border-subtle bg-bg-surface font-mono text-[10px] font-semibold uppercase tracking-widest text-text-secondary transition-all hover:bg-bg-elevated disabled:opacity-40"
        >
          Del
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="flex h-11 w-20 items-center justify-center rounded-md border border-accent-gold/50 bg-accent-gold/10 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-gold transition-all hover:bg-accent-gold/20 disabled:opacity-40"
        >
          Enter
        </button>
      </div>
    </div>
  )
}
