import React from 'react'
import { soundSettings, updateVolumes } from '../utils/sounds'
import '../styles/SettingsPanel.css'
import { Howler } from 'howler'

interface SettingsPanelProps {
  onClose: () => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = React.useState({ ...soundSettings })
  const [isMuted, setIsMuted] = React.useState(settings.mute)

  const handleChange = (key: keyof typeof soundSettings, value: number | boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    updateVolumes(newSettings)
  }

  const toggleMute = () => {
    const newMute = !isMuted
    setIsMuted(newMute)
    Howler.mute(newMute)
    handleChange('mute', newMute)
  }

  return (
    <div className='settings-overlay'>
      <div className='settings-panel'>
        {/* 🔝 Top Bar */}
        <div className='settings-topbar'>
          <h2 className='settings-title'>🎵 Sound Settings</h2>
          <div className='settings-icons'>
            <button className='icon-btn' onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button className='icon-btn' onClick={onClose} title='Close'>
              ✖
            </button>
          </div>
        </div>

        {/* 🎚️ Sliders */}
        <div className='settings-content'>
          <div className='settings-group'>
            <label>Background Music: {Math.round(settings.bgVolume * 100)}%</label>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={settings.bgVolume}
              onChange={(e) => handleChange('bgVolume', parseFloat(e.target.value))}
              className='slider'
            />
          </div>

          <div className='settings-group'>
            <label>Flip Sound: {Math.round(settings.flipVolume * 100)}%</label>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={settings.flipVolume}
              onChange={(e) => handleChange('flipVolume', parseFloat(e.target.value))}
              className='slider'
            />
          </div>

          <div className='settings-group'>
            <label>Match Sound: {Math.round(settings.matchVolume * 100)}%</label>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={settings.matchVolume}
              onChange={(e) => handleChange('matchVolume', parseFloat(e.target.value))}
              className='slider'
            />
          </div>

          <div className='settings-group'>
            <label>Miss Sound: {Math.round(settings.missVolume * 100)}%</label>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={settings.missVolume}
              onChange={(e) => handleChange('missVolume', parseFloat(e.target.value))}
              className='slider'
            />
          </div>

          <div className='settings-group'>
            <label>Winning/Game Over: {Math.round(settings.winVolume * 100)}%</label>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={settings.winVolume}
              onChange={(e) => handleChange('winVolume', parseFloat(e.target.value))}
              className='slider'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
