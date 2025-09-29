import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { BoardSize } from '../utils/constants'
import { BOARD_SIZES } from '../utils/constants'
import { bgMusic } from '../utils/sounds'
import '../styles/common.css' // ✅ unified styles
import { SettingsPanel } from './SettingsPanel'

interface StartPageProps {
  onStart: (name: string, size: BoardSize) => void
  onLeaderboard: () => void
}

export const StartPage: React.FC<StartPageProps> = ({ onStart, onLeaderboard }) => {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<BoardSize>(BOARD_SIZES['Easy (4x4)'])
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const toggleMute = () => {
    const newMute = !isMuted
    setIsMuted(newMute)
    Howler.mute(newMute)
  }
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className='start-container relative'>
      <div className='absolute top-[14px] right-[14px] flex gap-[8px]'>
        <button
          onClick={toggleMute}
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-xl text-[18px] text-[#121212] transition-all`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}>
          {isMuted ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='lucide lucide-volume-off-icon lucide-volume-off'>
              <path d='M16 9a5 5 0 0 1 .95 2.293' />
              <path d='M19.364 5.636a9 9 0 0 1 1.889 9.96' />
              <path d='m2 2 20 20' />
              <path d='m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11' />
              <path d='M9.828 4.172A.686.686 0 0 1 11 4.657v.686' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='lucide lucide-volume2-icon lucide-volume-2'>
              <path d='M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z' />
              <path d='M16 9a5 5 0 0 1 0 6' />
              <path d='M19.364 18.364a9 9 0 0 0 0-12.728' />
            </svg>
          )}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className='flex h-[30px] w-[30px] items-center justify-center rounded-xl bg-teal-500/20 text-2xl text-teal-400 transition-all hover:bg-teal-500/30 text-[#121212]'
          title='Settings'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-settings-icon lucide-settings'>
            <path d='M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915' />
            <circle cx='12' cy='12' r='3' />
          </svg>
        </button>
      </div>
      <h1 className='heading'>🌱 Plant Memory Challenge</h1>
  <input className='common-input' placeholder='Enter your name...' value={name} onChange={(e) => setName(e.target.value)} required />

      <div className='board-options'>
        {Object.entries(BOARD_SIZES).map(([label, size]) => (
          <button key={label} onClick={() => setSelected(size)} className={`same-btn ${selected.totalTiles === size.totalTiles ? 'btn-active' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      <button
        disabled={!name.trim()}
        onClick={() => {
          bgMusic.play()
          onStart(name.trim(), selected)
        }}
        className='same-btn main-btn'>
        🚀 Start Game
      </button>

      <button onClick={onLeaderboard} className='same-btn secondary-btn'>
        🏆 View Top Scores
      </button>
      {/* ⚙️ Settings Panel */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </motion.div>
  )
}
