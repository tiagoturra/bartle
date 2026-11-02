import { Compass, Copy, RotateCcw, Swords, Trophy, Users } from 'lucide-react'
import { toBlob } from 'html-to-image'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlayerTypeScore } from '../types'
import styles from './ResultsPanel.module.scss'

const iconByType = {
  socialiser: Users,
  explorer: Compass,
  achiever: Trophy,
  killer: Swords,
}

interface ResultsPanelProps {
  scores: PlayerTypeScore[]
  onRestart: () => void
}

export function ResultsPanel({ scores, onRestart }: ResultsPanelProps) {
  const { t } = useTranslation()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const shareImageRef = useRef<HTMLDivElement>(null)
  const leadingType = scores[0]
  const LeadingIcon = iconByType[leadingType.id]

  async function copyResult() {
    try {
      const captureTarget = shareImageRef.current
      if (!captureTarget) {
        throw new Error('The results image is not available.')
      }

      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
        throw new Error('Image clipboard access is not supported by this browser.')
      }

      const image = await toBlob(captureTarget, {
        backgroundColor: '#17251d',
        pixelRatio: 2,
        skipFonts: true,
      })
      if (!image) {
        throw new Error('Unable to generate an image from the results.')
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': image }),
      ])
      setCopyState('copied')
    } catch (error) {
      console.error('Unable to copy the results image to the clipboard.', error)
      setCopyState('error')
    }
  }

  return (
    <section className={`mx-auto w-full max-w-5xl ${styles.results}`} aria-labelledby="result-title">
      <div className="mb-8 text-center">
        <span className="font-mono text-xs tracking-[0.13em] text-accent">{t('results.eyebrow')}</span>
        <h1 className="mb-3 mt-3 font-sans text-5xl font-medium leading-none text-cream sm:text-6xl" id="result-title">{t('results.title')}</h1>
        <p className="mx-auto my-0 max-w-lg leading-relaxed text-muted">{t('results.description')}</p>
      </div>

      <div className={styles.shareImage} ref={shareImageRef}>
        <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 border border-accent/25 bg-panel p-6 sm:grid-cols-[3.75rem_minmax(0,1fr)_auto] sm:gap-6 sm:p-9">
          <div className="grid size-12 place-items-center border border-accent/35 text-accent sm:size-[60px]">
            <LeadingIcon size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <span className="font-mono text-xs tracking-[0.13em] text-accent">{t('results.strongest')}</span>
            <h2 className="mb-0 mt-2 font-sans text-3xl font-semibold text-cream">{t(`types.${leadingType.id}.name`)}</h2>
            <p className="mb-3 mt-0 text-sm text-accent">{t(`types.${leadingType.id}.short`)}</p>
            <p className="m-0 max-w-lg text-sm leading-relaxed text-muted">
              {t(`types.${leadingType.id}.description`)}
            </p>
          </div>
          <div className="col-start-2 flex flex-col items-start pt-0 sm:col-start-auto sm:items-end sm:pt-1.5">
            <strong className="font-sans text-4xl font-medium text-cream">{Math.round(leadingType.percentage)}%</strong>
            <span className="font-mono text-xs text-muted">{t(`types.${leadingType.id}.name`)}</span>
          </div>
        </div>

        <div className="border border-cream/10 bg-panel p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="m-0 font-sans text-lg font-medium text-cream">{t('results.scoreBreakdown')}</h2>
            <span className="font-mono text-xs text-muted">01 — 04</span>
          </div>
          <div className="grid gap-5">
            {scores.map(({ id, points, percentage }, index) => {
              const Icon = iconByType[id]

              return (
                <div className="grid grid-cols-[minmax(90px,1fr)_minmax(50px,1.5fr)_42px] items-center gap-2.5 sm:grid-cols-[140px_minmax(50px,1fr)_48px_45px] sm:gap-3.5" key={id}>
                  <div className="flex items-center gap-2.5 text-sm text-cream">
                    <span className="text-accent">
                      <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span>{t(`types.${id}.name`)}</span>
                  </div>
                  <div
                    className="h-[5px] overflow-hidden bg-cream/10"
                    role="img"
                    aria-label={t('accessibility.score', {
                      name: t(`types.${id}.name`),
                      score: Math.round(percentage),
                    })}
                  >
                    <span
                      className={`block h-full origin-left bg-linear-to-r from-accent to-[#c1c89b] ${styles.scoreFill}`}
                      style={{
                        width: `${percentage}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                  <strong className="text-right font-mono text-xs font-medium text-cream">{Math.round(percentage)}%</strong>
                  <span className="hidden text-right font-mono text-xs text-muted sm:inline">{t('results.points', { count: points })}</span>
                </div>
              )
            })}
          </div>
          <p className="mb-0 mt-6 text-xs leading-relaxed text-muted">{t('results.scoreNote')}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3 max-[390px]:flex-col">
        <button className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 border border-cream/20 bg-transparent px-5 text-sm font-semibold text-cream transition hover:-translate-y-px hover:border-accent hover:bg-accent/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" type="button" onClick={onRestart}>
          <RotateCcw size={16} aria-hidden="true" />
          {t('results.retake')}
        </button>
        <button className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 border border-accent bg-accent px-5 text-sm font-semibold text-forest transition hover:-translate-y-px hover:bg-[#a4c6a5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" type="button" onClick={copyResult}>
          <Copy size={16} aria-hidden="true" />
          {t(copyState === 'copied' ? 'results.copied' : 'results.share')}
        </button>
      </div>
      {copyState === 'error' && (
        <p className="text-center text-sm text-[#e3a18d]" role="alert">{t('results.copyError')}</p>
      )}
      <p className="mx-auto mb-0 mt-7 max-w-xl text-center text-xs leading-relaxed text-muted">{t('results.acknowledgement')}</p>
    </section>
  )
}
