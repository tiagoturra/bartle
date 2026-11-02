import { useEffect, useRef, useState } from 'react'
import styles from './Traveler.module.scss'

export type TravelerDirection = 'left' | 'right'

interface TravelerProps {
  direction?: TravelerDirection
  path?: string
}

interface Position {
  x: number
  y: number
}

const startPosition: Position = { x: 320, y: 90 }
const travelDuration = 700
const entrancePosition: Position = { x: 320, y: 0 }

export function Traveler({ direction, path }: TravelerProps) {
  const [position, setPosition] = useState(entrancePosition)
  const [opacity, setOpacity] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const routeRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setPosition(startPosition)
      setOpacity(1)
      setHasEntered(true)
      return
    }

    let startTime: number | undefined
    let animationFrame = 0

    function enter(timestamp: number) {
      startTime ??= timestamp
      const progress = Math.min((timestamp - startTime) / travelDuration, 1)
      const easedProgress = progress * progress * (3 - 2 * progress)
      setOpacity(easedProgress)
      setPosition({
        x: startPosition.x,
        y:
          entrancePosition.y +
          (startPosition.y - entrancePosition.y) * easedProgress,
      })

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(enter)
      } else {
        setOpacity(1)
        setHasEntered(true)
      }
    }

    animationFrame = window.requestAnimationFrame(enter)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!hasEntered) return

    if (!direction || !path) {
      return
    }

    const route = routeRef.current
    if (!route) return

    const routeLength = route.getTotalLength()
    if (prefersReducedMotion) {
      const endpoint = route.getPointAtLength(routeLength)
      setPosition({ x: endpoint.x, y: endpoint.y })
      return
    }

    let startTime: number | undefined
    let animationFrame = 0

    function walk(timestamp: number) {
      startTime ??= timestamp
      const progress = Math.min((timestamp - startTime) / travelDuration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const point = routeRef.current?.getPointAtLength(routeLength * easedProgress)
      if (!point) return
      setPosition({ x: point.x, y: point.y })

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(walk)
      }
    }

    animationFrame = window.requestAnimationFrame(walk)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [direction, hasEntered, path, prefersReducedMotion])

  return (
    <svg
      className={styles.motionLayer}
      viewBox="0 0 640 280"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {path && (
        <path
          ref={routeRef}
          className={styles.motionPath}
          d={path}
          aria-hidden="true"
        />
      )}
      <g
        className={styles.traveler}
        opacity={opacity}
        transform={`translate(${position.x} ${position.y}) translate(-32 -82)`}
        aria-hidden="true"
      >
        <ellipse cx="32" cy="82" rx="17" ry="4" fill="rgba(8, 15, 10, 0.38)" />
        <path d="M20 37 12 70l8 9h25l8-9-9-33z" fill="#739276" stroke="#c5d5ad" strokeWidth="1.5" />
        <path d="m23 47-8 12 5 4 9-10m12-6 8 12-5 4-9-10" fill="#b9825c" stroke="#d7bb91" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m25 69-2 12m16-12 2 12" stroke="#d1ad83" strokeWidth="5" strokeLinecap="round" />
        <path d="M25 19c0-8 14-8 14 0v9H25z" fill="#c99570" />
        <path d="M20 20c0-17 24-19 25-2l-5 6-4-8-10 3-5 6z" fill="#26372b" stroke="#c5d5ad" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M24 37c1-8 15-8 16 0l-2 9H26z" fill="#d5aa80" />
        <path d="m22 37 10-5 10 5 7 28-17 10-17-10z" fill="#91b793" stroke="#d2d7b8" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m28 44 4 24 4-24" fill="none" stroke="#607e63" strokeWidth="2" />
        <path d="m42 45 8 3-3 15-8-4z" fill="#bf9568" stroke="#e0c49d" strokeWidth="1.5" />
      </g>
    </svg>
  )
}
