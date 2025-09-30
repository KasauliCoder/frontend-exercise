import { Howl, Howler } from 'howler'

// 🔊 Default sound settings
export const soundSettings = {
  bgVolume: 0.3,
  flipVolume: 0.7,
  matchVolume: 0.8,
  missVolume: 0.8,
  winVolume: 0.9,
  mute: false
}

// 🎶 Create sound instances
export const bgMusic = new Howl({
  src: ['/sounds/background.mp3'],
  loop: true,
  volume: soundSettings.bgVolume,
  html5: true
})

export const flipSound = new Howl({
  src: ['/sounds/flipcard-91468.mp3'],
  volume: soundSettings.flipVolume,
  html5: true
})

export const matchSound = new Howl({
  src: ['/sounds/match.mp3'],
  volume: soundSettings.matchVolume,
  html5: true
})

export const missSound = new Howl({
  src: ['/sounds/miss.mp3'],
  volume: soundSettings.missVolume,
  html5: true
})

export const gameOverSound = new Howl({
  src: ['/sounds/game-over.mp3'],
  volume: soundSettings.winVolume,
  html5: true
})

export const winningSound = new Howl({
  src: ['/sounds/winning.mp3'],
  volume: soundSettings.winVolume,
  html5: true
})

// 🧠 Update all sound volumes dynamically
export function updateVolumes(newSettings: typeof soundSettings) {
  // ⚡ Update global settings
  soundSettings.bgVolume = newSettings.bgVolume
  soundSettings.flipVolume = newSettings.flipVolume
  soundSettings.matchVolume = newSettings.matchVolume
  soundSettings.missVolume = newSettings.missVolume
  soundSettings.winVolume = newSettings.winVolume
  soundSettings.mute = newSettings.mute

  // 🎚️ Apply to all sounds
  bgMusic.volume(newSettings.bgVolume)
  flipSound.volume(newSettings.flipVolume)
  matchSound.volume(newSettings.matchVolume)
  missSound.volume(newSettings.missVolume)
  gameOverSound.volume(newSettings.winVolume)
  winningSound.volume(newSettings.winVolume)

  // 🔇 Mute/unmute all sounds
  Howler.mute(newSettings.mute)

  // 💾 Optional: Save settings to localStorage
  localStorage.setItem('soundSettings', JSON.stringify(soundSettings))
}

// 🚀 Restore settings on page load (call once in App.tsx or GamePage.tsx)
export function restoreSoundSettings() {
  const saved = localStorage.getItem('soundSettings')
  if (saved) {
    const parsed = JSON.parse(saved)
    updateVolumes(parsed)
  }
}
