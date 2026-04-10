import { useState, useEffect, useCallback, useRef } from 'react'

interface UseCountdownReturn {
  seconds: number | null
  isActive: boolean
  formattedTime: string
  start: (initialSeconds: number) => void
  stop: () => void
}

/**
 * Hook para manejar una cuenta regresiva de segundos.
 * Útil para bloqueos de cuenta, timers de OTP, etc.
 */
export function useCountdown(): UseCountdownReturn {
  const [seconds, setSeconds] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setSeconds(null)
  }, [])

  const start = useCallback((initialSeconds: number) => {
    stop()
    if (initialSeconds <= 0) return
    setSeconds(initialSeconds)
  }, [stop])

  useEffect(() => {
    if (seconds === null) return

    if (seconds <= 0) {
      stop()
      return
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : null))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [seconds, stop])

  const formattedTime = seconds !== null 
    ? `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
    : '00:00'

  return {
    seconds,
    isActive: seconds !== null && seconds > 0,
    formattedTime,
    start,
    stop,
  }
}
