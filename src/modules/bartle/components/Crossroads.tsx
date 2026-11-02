import type { ReactNode } from 'react'
import crossSign from '../../../assets/cross-sign.svg'
import type { TravelerDirection } from './Traveler'
import { Traveler } from './Traveler'
import styles from './Crossroads.module.scss'

const routes: Record<TravelerDirection, string> = {
  left: 'M320 90 C300 122 251 154 208 182 C181 201 160 231 145 280',
  right: 'M320 90 C340 122 389 154 432 182 C459 201 480 231 495 280',
}

interface CrossroadsProps {
  selectedPath?: TravelerDirection
  label: string
  choicesClassName: string
  children: ReactNode
}

const directions: TravelerDirection[] = ['left', 'right']
const trunkPath = 'M320 -12 L320 90'

export function Crossroads({
  selectedPath,
  label,
  choicesClassName,
  children,
}: CrossroadsProps) {
  return (
    <div
      className={styles.crossroads}
      role="group"
      aria-label={label}
    >
      <svg
        className={styles.roadMap}
        viewBox="0 0 640 280"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className={styles.roadCasing}>
          <path d={trunkPath} />
          {directions.map((direction) => (
            <path d={routes[direction]} key={direction} />
          ))}
        </g>
        <g className={styles.roadSurface}>
          <path d={trunkPath} />
          {directions.map((direction) => (
            <path d={routes[direction]} key={direction} />
          ))}
        </g>
        <g className={styles.roadMark}>
          <path d={trunkPath} />
          {directions.map((direction) => (
            <path d={routes[direction]} key={direction} />
          ))}
        </g>
      </svg>
      <img className={styles.sign} src={crossSign} alt="" aria-hidden="true" />
      <Traveler
        direction={selectedPath}
        path={selectedPath ? routes[selectedPath] : undefined}
      />
      <div className={choicesClassName} data-path-choices>
        {children}
      </div>
    </div>
  )
}
