import { useCallback, useEffect, useRef, useState } from 'react'
import { hapticImpact, hapticNotify } from '../lib/telegram'

const GRID_SIZE = 5
const TILE_COUNT = GRID_SIZE * GRID_SIZE
const ROUND_SECONDS = 30
const BONUS_SECONDS_PER_ROUND = 8

type GameStatus = 'idle' | 'playing' | 'over'

function shuffledNumbers(): Array<number> {
  const numbers = Array.from({ length: TILE_COUNT }, (_, i) => i + 1)
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }
  return numbers
}

export default function ZufaanGame() {
  const [status, setStatus] = useState<GameStatus>('idle')
  const [tiles, setTiles] = useState<Array<number>>(() => shuffledNumbers())
  const [next, setNext] = useState(1)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [bestScore, setBestScore] = useState(0)
  const [wrongTile, setWrongTile] = useState<number | null>(null)

  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const stored = window.localStorage?.getItem('zufaan-best-score')
    if (stored) setBestScore(Number(stored) || 0)
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const endGame = useCallback(
    (finalScore: number) => {
      stopTimer()
      setStatus('over')
      hapticNotify('warning')
      setBestScore((prevBest) => {
        if (finalScore > prevBest) {
          window.localStorage?.setItem('zufaan-best-score', String(finalScore))
          return finalScore
        }
        return prevBest
      })
    },
    [stopTimer],
  )

  useEffect(() => {
    return () => stopTimer()
  }, [stopTimer])

  const startGame = () => {
    setTiles(shuffledNumbers())
    setNext(1)
    setScore(0)
    setRound(1)
    setTimeLeft(ROUND_SECONDS)
    setStatus('playing')
    hapticImpact('medium')

    stopTimer()
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame(scoreRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const scoreRef = useRef(0)
  useEffect(() => {
    scoreRef.current = score
  }, [score])

  const handleTap = (value: number) => {
    if (status !== 'playing') return

    if (value === next) {
      hapticImpact('light')
      const newScore = score + 1
      setScore(newScore)

      if (next === TILE_COUNT) {
        setRound((r) => r + 1)
        setTiles(shuffledNumbers())
        setNext(1)
        setTimeLeft((t) => t + BONUS_SECONDS_PER_ROUND)
      } else {
        setNext(next + 1)
      }
    } else {
      hapticNotify('error')
      setWrongTile(value)
      window.setTimeout(() => setWrongTile(null), 250)
    }
  }

  const restartGame = () => startGame()

  const timePct = Math.max(0, Math.min(100, (timeLeft / ROUND_SECONDS) * 100))
  const isLowTime = status === 'playing' && timeLeft <= 10

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="text-center pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Zufaan Game
        </h1>
        <p className="text-sm text-white/50 mt-1">Tap the numbers in order</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Score" value={score} />
        <StatCard label="Best" value={bestScore} />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-white/50 mb-2">
          <span>Round {round}</span>
          <span className={isLowTime ? 'text-red-400 font-semibold' : ''}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isLowTime ? 'bg-red-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>

      <div className="relative rounded-3xl bg-white/5 border border-white/10 p-3">
        <div className="grid grid-cols-5 gap-2">
          {tiles.map((value) => {
            const done = status === 'playing' && value < next
            const isWrong = wrongTile === value
            return (
              <button
                key={value}
                disabled={status !== 'playing' || done}
                onClick={() => handleTap(value)}
                className={`aspect-square rounded-xl text-base sm:text-lg font-semibold flex items-center justify-center select-none transition-all duration-150 active:scale-90 ${
                  done
                    ? 'bg-emerald-500/20 text-emerald-300/50'
                    : isWrong
                      ? 'bg-red-500/30 text-white'
                      : 'bg-white/10 text-white hover:bg-white/15'
                } ${status !== 'playing' ? 'opacity-30' : ''}`}
              >
                {value}
              </button>
            )
          })}
        </div>

        {status !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[#0f0f1a]/85 backdrop-blur-sm">
            {status === 'idle' ? (
              <div className="text-center px-6">
                <p className="text-white/70 text-sm mb-4">
                  Race the clock. Tap 1 to {TILE_COUNT} in order before time
                  runs out.
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-full bg-emerald-400 text-[#0f0f1a] font-bold text-base active:scale-95 transition-transform"
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div className="text-center px-6">
                <p className="text-white text-lg font-bold mb-1">
                  Time's up!
                </p>
                <p className="text-white/60 text-sm mb-4">
                  Final score: {score}
                </p>
                <button
                  onClick={restartGame}
                  className="px-8 py-3 rounded-full bg-emerald-400 text-[#0f0f1a] font-bold text-base active:scale-95 transition-transform"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {status === 'playing' && (
        <button
          onClick={restartGame}
          className="mx-auto text-sm text-white/40 underline-offset-4 underline py-2"
        >
          Restart
        </button>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="text-xs text-white/50">{label}</div>
      <div className="text-2xl font-bold text-white tabular-nums">
        {value}
      </div>
    </div>
  )
}
