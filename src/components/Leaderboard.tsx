import React from 'react'
import { motion } from 'framer-motion'
import type { GameResult } from '../utils/constants'
import { formatTime } from '../utils/constants'

interface LeaderboardProps {
  onBack: () => void
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const scores = JSON.parse(localStorage.getItem('scores') || '[]') as GameResult[]
  const sorted = [...scores].sort((a, b) => (a.timeElapsed !== b.timeElapsed ? a.timeElapsed - b.timeElapsed : a.moves - b.moves)).slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='page-container w-[500px] max-w-lg rounded-3xl border border-[#cccccc5f] p-[32px] text-[#fff] sm:p-12'>
      <div className='mb-[40px] text-center'>
        <h2 className='mb-[24px] text-3xl font-bold text-[#fff] text-teal-400'>🏆 Top Scorers</h2>
      </div>

      {sorted.length === 0 && <p className='mb-[10px] text-center text-[20px] text-[#00b1a2]'>Be the first to finish a game!</p>}
      {sorted.length > 0 && (
        <div className='mb-[16px] flex items-center justify-between border-b border-gray-700 pb-[8px] text-sm font-semibold text-[#00b1a2]'>
          <span className='w-1/12 text-center text-[#00b1a2]'>#</span>
          <span className='w-6/12'>Player</span>
          <span className='w-5/12 text-right'>Time</span>
        </div>
      )}

      {sorted.map((s, i) => (
        <div
          className={`flex items-center justify-between rounded-[8px] p-[12px] text-lg font-bold shadow-lg ${i == 0 ? 'border-l-[8px] border-[#00ffc466] bg-[#00b1a27c]' : ''}`}
          key={i}>
          <span className='w-1/12 text-center text-lg font-semibold'>{i + 1}.</span>
          <span className='w-6/12 truncate text-left text-lg'>{s.playerName}</span>
          <span className='w-5/12 text-right text-xl font-extrabold text-teal-300'>{formatTime(s.timeElapsed)}</span>
        </div>
      ))}
      <button
        onClick={onBack}
        className='mt-[32px] w-full rounded-[8px] bg-teal-400 py-[12px] font-bold text-gray-900 shadow-lg transition hover:bg-teal-300'>
        Back to Start
      </button>
    </motion.div>
  )
}
