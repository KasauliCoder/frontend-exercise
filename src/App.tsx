// App.tsx
import React, { useState } from 'react'
import type { BoardSize, GameResult, GameView } from './utils/constants'
import { BOARD_SIZES } from './utils/constants'
import { GamePage } from './components/GamePage'
import { StartPage } from './components/StartPage'
import { EndPage } from './components/EndPage'
import { Leaderboard } from './components/Leaderboard'

export default function App() {
  const [view, setView] = useState<GameView>('start')
  const [name, setName] = useState('')
  const [size, setSize] = useState<BoardSize>(BOARD_SIZES['Easy (4x4)'])
  const [result, setResult] = useState<GameResult | null>(null)

  return (
    <div className='relative flex min-h-screen items-center justify-center bg-[#0b1717] p-4 text-white'>
      {/* Views */}
      {view === 'start' && (
        <StartPage
          onStart={(n, s) => {
            setName(n)
            setSize(s)
            setView('game')
          }}
          onLeaderboard={() => setView('leaderboard')}
        />
      )}
      {view === 'game' && (
        <GamePage
          playerName={name}
          boardSize={size}
          onEnd={(res) => {
            setResult(res)
            setView('end')
          }}
        />
      )}
      {view === 'end' && result && <EndPage result={result} onRestart={() => setView('start')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('start')} />}
    </div>
  )
}
