'use client'

import { useWordleGame } from '@/hooks/useWordleGame'
import WordleGrid from '@/components/games/WordleGrid'
import WordleKeyboard from '@/components/games/WordleKeyboard'
import { MAX_ATTEMPTS } from '@/lib/word-list'
import { useCallback, useRef, useState, useEffect } from 'react'
import { useGamesScore } from '@/contexts/GamesScoreContext'

function ShareButton({ attempts, status, target }: {
  attempts: { letter: string; status: string }[][]
  status: string
  target: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shared, setShared] = useState(false)

  const generateShareImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const w = 600
    const h = 800
    canvas.width = w
    canvas.height = h

    // background
    ctx.fillStyle = '#0a0908'
    ctx.fillRect(0, 0, w, h)

    // title
    ctx.fillStyle = '#c9a24b'
    ctx.font = 'bold 36px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('TLJ Wordle', w / 2, 60)

    ctx.fillStyle = '#f2ead9'
    ctx.font = '14px monospace'
    ctx.fillText(`${status === 'won' ? 'Won' : 'Lost'} in ${attempts.filter((r) => r.some((t) => t.letter)).length}/${MAX_ATTEMPTS}`, w / 2, 90)

    // grid
    const tileSize = 52
    const gap = 6
    const gridW = 5 * tileSize + 4 * gap
    const startX = (w - gridW) / 2
    const startY = 130

    const colorMap: Record<string, string> = {
      correct: '#2d6a4f',
      present: '#c9a24b',
      absent: '#3a2e26',
      empty: '#141210',
      tbd: '#141210',
    }

    for (let r = 0; r < attempts.length; r++) {
      const row = attempts[r]
      if (!row.some((t) => t.letter)) break
      for (let c = 0; c < row.length; c++) {
        const x = startX + c * (tileSize + gap)
        const y = startY + r * (tileSize + gap)
        ctx.fillStyle = colorMap[row[c].status] ?? '#141210'
        ctx.fillRect(x, y, tileSize, tileSize)
        ctx.strokeStyle = '#3a2e26'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, tileSize, tileSize)
        ctx.fillStyle = '#f2ead9'
        ctx.font = 'bold 24px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(row[c].letter, x + tileSize / 2, y + tileSize / 2)
      }
    }

    // footer
    ctx.fillStyle = '#3a2e26'
    ctx.font = '11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('TLJ Mongolia — Pâtisserie', w / 2, h - 30)

    return canvas.toDataURL('image/png')
  }, [attempts, status, target])

  const handleShare = useCallback(() => {
    const dataUrl = generateShareImage()
    if (!dataUrl) return

    // Try Web Share API first (mobile)
    if (navigator.share) {
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'tlj-wordle.png', { type: 'image/png' })
          navigator.share({ files: [file], title: 'TLJ Wordle' }).catch(() => {
            downloadImage(dataUrl)
          })
        })
    } else {
      downloadImage(dataUrl)
    }
    setShared(true)
  }, [generateShareImage])

  function downloadImage(dataUrl: string) {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'tlj-wordle.png'
    a.click()
  }

  if (status === 'playing') return null

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 rounded-xl border border-accent/30 bg-surface/60 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-accent transition-all hover:border-accent/60 hover:bg-surface-light/60"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
        </svg>
        {shared ? 'Downloaded!' : 'Share to Instagram Story'}
      </button>
    </div>
  )
}

export default function WordlePage() {
  const game = useWordleGame()
  const { addScore } = useGamesScore()
  const [scoreReported, setScoreReported] = useState(false)

  // report score once on game end
  useEffect(() => {
    if (game.status !== 'playing' && !scoreReported) {
      const wordleScore = game.status === 'won'
        ? (MAX_ATTEMPTS - game.currentRow + 1) * 100
        : 0
      if (wordleScore > 0) {
        addScore('wordle', wordleScore)
      }
      setScoreReported(true)
    }
  }, [game.status, scoreReported, addScore, game.currentRow])

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-12">
      {/* heading */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent">
          TLJ Wordle
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          5 letters &middot; {MAX_ATTEMPTS} attempts
        </p>
      </div>

      {/* status */}
      {game.status === 'won' && (
        <div className="rounded-lg border border-correct/30 bg-correct/10 px-4 py-2 font-mono text-sm text-correct">
          Маш сайн! Баяр хүргэе!
        </div>
      )}
      {game.status === 'lost' && (
        <div className="rounded-lg border border-present/30 bg-present/10 px-4 py-2 font-mono text-sm text-present">
          Зөв үг: <span className="font-bold">{game.target}</span>
        </div>
      )}

      {/* grid */}
      <WordleGrid
        attempts={game.attempts}
        currentRow={game.currentRow}
        shakeRow={game.shakeRow}
        revealedRows={game.revealedRows}
      />

      {/* keyboard */}
      <WordleKeyboard
        onKey={game.inputLetter}
        onDelete={game.deleteLetter}
        onSubmit={game.submitGuess}
        keyStatuses={game.keyStatuses}
        disabled={game.status !== 'playing'}
      />

      {/* share */}
      <ShareButton
        attempts={game.attempts}
        status={game.status}
        target={game.target}
      />

      {/* reset */}
      {game.status !== 'playing' && (
        <button
          type="button"
          onClick={game.resetGame}
          className="rounded-lg border border-muted px-6 py-2 font-mono text-xs uppercase tracking-widest text-foreground/50 transition-all hover:border-accent hover:text-accent"
        >
          Play Again
        </button>
      )}
    </div>
  )
}
