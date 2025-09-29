import { useRef, useEffect } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const ref = useRef(callback)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => ref.current(), delay)
      return () => clearInterval(id)
    }
    return undefined
  }, [delay])
}
