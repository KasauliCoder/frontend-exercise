import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { GameResult } from '../utils/constants'
import { formatTime } from '../utils/constants'

interface EndPageProps {
  result: GameResult
  onRestart: () => void
}

export const EndPage: React.FC<EndPageProps> = ({ result, onRestart }) => {
  // ✅ Prevent double saving
  const savedRef = useRef(false)

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true

    // Save scores per board size
    const key = `scores_${result.boardSize.rows}x${result.boardSize.cols}`
    const scores = JSON.parse(localStorage.getItem(key) || '[]') as GameResult[]

    // Prevent duplicate entries
    const isDuplicate = scores.some((s) => s.playerName === result.playerName && s.timeElapsed === result.timeElapsed && s.moves === result.moves)
    if (isDuplicate) return

    scores.push(result)

    // Sort: fastest time first, then fewest moves
    scores.sort((a, b) => (a.timeElapsed !== b.timeElapsed ? a.timeElapsed - b.timeElapsed : a.moves - b.moves))

    // Keep top 10 scores
    localStorage.setItem(key, JSON.stringify(scores.slice(0, 10)))
  }, [result])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='page-container w-full max-w-[500px] rounded-[14px] p-[32px] text-center shadow-[16px]'>
      <h2 className='mb-[16px] text-[28px] font-extrabold text-[#04a08e]'>🎉 Game Over!</h2>
      <p className='mb-[16px] text-xl text-[#fff]'>
        Nice job, <b>{result.playerName}</b>!
      </p>

      <div className='space-y-[16px] rounded-xl bg-gray-700 p-[16px] text-left text-[#fff]'>
        <div className='flex items-center justify-between text-lg'>
          <span>Board Size:</span>
          <b className='text-[22px] text-[#00ffe1]'>
            {result.boardSize.rows}x{result.boardSize.cols}
          </b>
        </div>
        <div className='flex items-center justify-between text-lg'>
          <span>Total Moves:</span>
          <b className='text-[22px] text-[#00ffe1]'>{result.moves}</b>
        </div>
        <div className='flex items-center justify-between text-lg'>
          <span>Time Taken:</span>
          <b className='text-[22px] text-[#00ffe1]'>{formatTime(result.timeElapsed)}</b>
        </div>
      </div>

      <button
        onClick={onRestart}
        className='mt-[32px] w-full rounded-[10px] bg-[#04a08e] py-[12px] font-bold text-gray-900 shadow-[10px] transition hover:bg-[#00ffe1]'>
        Play Again
      </button>
    </motion.div>
  )
}
