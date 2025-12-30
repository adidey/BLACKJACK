import { useState, useCallback } from 'react'

// Generate simple beep sounds using Web Audio API
function generateBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    // Ignore errors (e.g., Web Audio API not supported)
  }
}

const soundConfig: Record<string, { frequency: number; duration: number; type?: OscillatorType }> = {
  deal: { frequency: 200, duration: 0.1, type: 'sine' },
  bet: { frequency: 300, duration: 0.15, type: 'square' },
  win: { frequency: 523, duration: 0.2, type: 'sine' }, // C note
  lose: { frequency: 200, duration: 0.3, type: 'sawtooth' },
  push: { frequency: 400, duration: 0.15, type: 'sine' },
}

export function useSound() {
  const [muted, setMuted] = useState(false)

  const playSound = useCallback((soundName: keyof typeof soundConfig) => {
    if (muted) return

    const config = soundConfig[soundName]
    if (config) {
      generateBeep(config.frequency, config.duration, config.type)
    }
  }, [muted])

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev)
  }, [])

  return { playSound, muted, toggleMute }
}

