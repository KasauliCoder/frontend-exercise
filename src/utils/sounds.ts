import { Howl, Howler } from 'howler'

// Default volumes
export const soundSettings = {
  bgVolume: 0.3,
  flipVolume: 0.7,
  matchVolume: 0.8,
  missVolume: 0.8,
  winVolume: 0.9,
  mute: false
}

// Create Howl instances
export const bgMusic = new Howl({ src: ['/sounds/background.mp3'], loop: true, volume: soundSettings.bgVolume, html5: true })
export const flipSound = new Howl({ src: ['/sounds/flipcard-91468.mp3'], volume: soundSettings.flipVolume, html5: true })
export const matchSound = new Howl({ src: ['/sounds/match.mp3'], volume: soundSettings.matchVolume, html5: true })
export const missSound = new Howl({ src: ['/sounds/miss.mp3'], volume: soundSettings.missVolume, html5: true })
export const gameOverSound = new Howl({ src: ['/sounds/game-over.mp3'], volume: soundSettings.winVolume, html5: true })
export const winningSound = new Howl({ src: ['/sounds/winning.mp3'], volume: soundSettings.winVolume, html5: true })

// Function to update volumes dynamically
export function updateVolumes(settings: typeof soundSettings) {
  bgMusic.volume(settings.bgVolume)
  flipSound.volume(settings.flipVolume)
  matchSound.volume(settings.matchVolume)
  missSound.volume(settings.missVolume)
  gameOverSound.volume(settings.winVolume)
  winningSound.volume(settings.winVolume)

  if (settings.mute) {
    Howler.mute(true)
  } else {
    Howler.mute(false)
  }
}
