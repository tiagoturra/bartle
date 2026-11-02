import { Compass, Feather, Sparkles, Swords, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QuestionCard } from '../components/QuestionCard'
import { ResultsPanel } from '../components/ResultsPanel'
import testConfigJson from '../data/test.config.json'
import { calculateScores } from '../scoring'
import type { BartleTestConfig, PlayerTypeScore } from '../types'
import styles from './BartlePage.module.scss'

type TestPhase = 'intro' | 'test' | 'results'

const testConfig = testConfigJson as BartleTestConfig
const iconByType = {
  socialiser: Users,
  explorer: Compass,
  achiever: Trophy,
  killer: Swords,
}

export function BartlePage() {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<TestPhase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [scores, setScores] = useState<PlayerTypeScore[] | null>(null)
  const currentQuestion = testConfig.questions[currentIndex]

  function startTest() {
    setAnswers({})
    setCurrentIndex(0)
    setScores(null)
    setPhase('test')
  }

  function finishTest() {
    setScores(calculateScores(answers, testConfig))
    setPhase('results')
  }

  function continueTest() {
    if (!answers[currentQuestion.id]) return

    if (currentIndex === testConfig.questions.length - 1) {
      finishTest()
      return
    }

    setCurrentIndex((index) => index + 1)
  }

  return (
    <main className={`relative min-h-dvh overflow-hidden bg-forest text-cream ${styles.pageBackdrop}`}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <span className={`absolute right-[-14%] top-[10%] aspect-square w-[min(60vw,780px)] rounded-full ${styles.ambientOrb}`} />
        <span className={styles.constellation} />
      </div>

      <header className="relative z-10 mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 border-b border-cream/10 px-4 md:min-h-20 md:gap-5 md:px-8">
        <a
          className="inline-flex cursor-pointer items-center gap-2.5 font-sans text-sm font-semibold text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            setPhase('intro')
          }}
          aria-label={t('brand')}
        >
          <span className="grid size-8 place-items-center border border-accent/40 text-accent"><Feather size={17} /></span>
          <span>{t('brand')}</span>
        </a>
        <span className="ml-auto hidden font-mono text-[0.58rem] tracking-[0.1em] text-muted md:inline">{t('nav.edition')}</span>
        <span className="hidden h-3.5 w-px bg-cream/20 md:block" />
        <span className="ml-auto font-mono text-[0.53rem] tracking-[0.1em] text-accent md:ml-0 md:text-[0.58rem]">{t('nav.fieldGuide')}</span>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
        {phase === 'intro' && (
          <section className="grid min-h-[calc(100dvh-5rem)] grid-cols-1 items-center gap-4 py-14 md:grid-cols-[1.04fr_0.96fr] md:gap-0 md:py-12">
            <div className={`relative z-10 pb-0 md:pb-10 md:pl-[5.5%] ${styles.heroCopy}`}>
              <p className="mb-0 flex items-center gap-2.5 font-mono text-[0.66rem] tracking-[0.09em] text-muted">
                <span className="h-px w-[22px] bg-accent" />
                {t('intro.eyebrow')}
              </p>
              <h1 className="mb-5 mt-5 max-w-2xl font-sans text-5xl font-medium leading-[0.98] sm:text-6xl lg:mb-5 lg:mt-6 lg:text-7xl xl:text-8xl">
                {t('intro.titleStart')}
                <br />
                <span className="mx-4 font-serif font-normal italic text-accent">{t('intro.titleAccent')}</span>
                {t('intro.titleEnd')}
              </h1>
              <p className="m-0 max-w-[410px] text-[0.95rem] leading-[1.85] text-muted">{t('intro.description')}</p>
              <button className="mt-7 inline-flex min-h-14 cursor-pointer items-center gap-6 border border-accent bg-accent px-5 text-sm font-bold text-forest transition duration-200 hover:-translate-y-0.5 hover:bg-[#a5c5a5] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream" type="button" onClick={startTest}>
                {t('intro.begin')}
                <span aria-hidden="true"><Sparkles size={16} /></span>
              </button>
              <p className="mb-0 mt-3.5 text-xs text-cream/60">{t('intro.footnote')}</p>
            </div>

            <div className={`relative mx-auto grid aspect-square w-[min(82vw,420px)] place-items-center justify-self-center md:w-full md:max-w-[570px] ${styles.heroArt}`} aria-hidden="true">
              <div className={`${styles.orbit} ${styles.orbitOuter}`} />
              <div className={`${styles.orbit} ${styles.orbitInner}`} />
              <div className={styles.artHalo} />
              <div className={styles.artCore}>
                <div className={styles.compassRose}>
                  <span className={styles.roseNorth} />
                  <span className={styles.roseSouth} />
                  <span className={styles.roseEast} />
                  <span className={styles.roseWest} />
                  <Compass size={78} strokeWidth={0.75} />
                </div>
              </div>
              <span className={`${styles.typeMark} ${styles.markSocial}`}><Users size={18} /></span>
              <span className={`${styles.typeMark} ${styles.markExplore}`}><Compass size={18} /></span>
              <span className={`${styles.typeMark} ${styles.markAchieve}`}><Trophy size={18} /></span>
              <span className={`${styles.typeMark} ${styles.markKiller}`}><Swords size={18} /></span>
              <span className="absolute bottom-[3%] font-mono text-[0.5rem] tracking-[0.12em] text-muted md:bottom-[4%] md:text-[0.56rem]">{t('intro.artCaption')}</span>
            </div>

            <div className="col-span-full mx-0 mt-2 grid grid-cols-1 items-end gap-6 border-t border-cream/10 pt-5 md:mx-[5.5%] md:grid-cols-[1fr_auto] md:gap-5">
              <div className="flex items-center justify-between gap-4 md:justify-start md:gap-8">
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-baseline md:gap-2"><strong className="font-sans text-xl font-medium text-cream">30</strong><span className="text-[0.68rem] text-muted">{t('intro.stats.choices')}</span></div>
                <span className="h-[18px] w-px bg-cream/15" />
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-baseline md:gap-2"><strong className="font-sans text-xl font-medium text-cream">~5</strong><span className="text-[0.68rem] text-muted">{t('intro.stats.time')}</span></div>
                <span className="h-[18px] w-px bg-cream/15" />
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-baseline md:gap-2"><strong className="font-sans text-xl font-medium text-cream">04</strong><span className="text-[0.68rem] text-muted">{t('intro.stats.types')}</span></div>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 md:max-w-[330px] md:justify-end">
                <span className="w-full font-mono text-[0.56rem] tracking-[0.1em] text-muted md:text-right">{t('intro.typesLabel')}</span>
                {testConfig.categories.map(({ id }) => {
                  const Icon = iconByType[id]

                  return (
                    <span className="inline-flex items-center gap-1.5 text-[0.65rem] text-muted" key={id}>
                      <Icon className="text-accent" size={14} aria-hidden="true" />
                      {t(`types.${id}.name`)}
                    </span>
                  )
                })}
              </div>
              <a className="hidden cursor-pointer items-center gap-3 font-mono text-[0.55rem] tracking-[0.1em] text-muted no-underline max-md:inline-flex" href="#about">
                {t('intro.scroll')}
                <span className="h-px w-[34px] bg-accent" />
              </a>
            </div>
          </section>
        )}

        {phase === 'test' && currentQuestion && (
          <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center py-9 md:py-[70px]">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionIndex={currentIndex}
              questionCount={testConfig.questions.length}
              selectedAnswer={answers[currentQuestion.id]}
              isFirst={currentIndex === 0}
              isLast={currentIndex === testConfig.questions.length - 1}
              onSelect={(answerId) =>
                setAnswers((previous) => ({
                  ...previous,
                  [currentQuestion.id]: answerId,
                }))
              }
              onPrevious={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              onContinue={continueTest}
            />
          </div>
        )}

        {phase === 'results' && scores && (
          <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center py-9 md:py-[70px]">
            <ResultsPanel scores={scores} onRestart={startTest} />
          </div>
        )}
      </div>

      {phase === 'intro' && (
        <section className="mx-auto my-12 grid w-[calc(100%-2rem)] max-w-4xl grid-cols-1 gap-4 border-t border-cream/15 pt-7 md:my-24 md:grid-cols-[minmax(100px,0.32fr)_1fr] md:gap-x-12 md:gap-y-5" id="about">
          <span className="font-mono text-[0.6rem] tracking-[0.08em] text-muted">{t('about.index')}</span>
          <p className="m-0 max-w-2xl font-sans text-xl leading-relaxed text-cream md:text-2xl">{t('about.description')}</p>
          <span className="font-mono text-[0.6rem] text-muted md:col-start-2">
            {t('about.source')}{' '}
            <a className="cursor-pointer text-accent underline-offset-4 hover:text-cream" href="http://mud.co.uk/richard/hcds.htm" target="_blank" rel="noreferrer">
              {t('about.sourceLink')}
            </a>
          </span>
        </section>
      )}

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl justify-between border-t border-cream/10 px-4 py-5 font-mono text-[0.55rem] tracking-[0.1em] text-cream/55 md:px-8">
        <span>{t('footer.brand')}</span>
        <span>{t('footer.tagline')}</span>
      </footer>
    </main>
  )
}
