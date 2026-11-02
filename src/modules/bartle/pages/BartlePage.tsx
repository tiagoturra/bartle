import {
  ChevronDown,
  Compass,
  Feather,
  Menu,
  RotateCcw,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n'
import {
  readSessionStorage,
  removeSessionStorage,
  writeSessionStorage,
} from '../../../core/browser/sessionStorage'
import { QuestionCard } from '../components/QuestionCard'
import { ResultsPanel } from '../components/ResultsPanel'
import testConfigJson from '../data/test.config.json'
import { calculateScores } from '../scoring'
import type { BartleTestConfig, PlayerTypeScore } from '../types'
import styles from './BartlePage.module.scss'

type TestPhase = 'intro' | 'test' | 'results'

const testConfig = testConfigJson as BartleTestConfig
const progressStorageKey = 'guildhall-bartle-progress'
const progressVersion = 1
const iconByType = {
  socialiser: Users,
  explorer: Compass,
  achiever: Trophy,
  killer: Swords,
}

interface SavedProgress {
  version: typeof progressVersion
  phase: 'test' | 'results'
  currentIndex: number
  answers: Record<string, string>
  advanceOnSelection: boolean
}

interface RestoredProgress {
  phase: TestPhase
  currentIndex: number
  answers: Record<string, string>
  advanceOnSelection: boolean
  scores: PlayerTypeScore[] | null
  storageError: boolean
}

function isValidSavedProgress(value: unknown): value is SavedProgress {
  if (!value || typeof value !== 'object') return false

  const progress = value as Partial<SavedProgress>
  if (
    progress.version !== progressVersion ||
    (progress.phase !== 'test' && progress.phase !== 'results') ||
    !Number.isInteger(progress.currentIndex) ||
    (progress.currentIndex ?? -1) < 0 ||
    (progress.currentIndex ?? testConfig.questions.length) >= testConfig.questions.length ||
    typeof progress.advanceOnSelection !== 'boolean' ||
    !progress.answers ||
    typeof progress.answers !== 'object' ||
    Array.isArray(progress.answers)
  ) {
    return false
  }

  const answers = progress.answers as Record<string, unknown>
  for (const [questionId, answerId] of Object.entries(answers)) {
    const question = testConfig.questions.find(({ id }) => id === questionId)
    if (
      !question ||
      typeof answerId !== 'string' ||
      !question.answers.some((answer) => answer.id === answerId)
    ) {
      return false
    }
  }

  const currentQuestion = testConfig.questions[progress.currentIndex!]
  if (
    progress.advanceOnSelection &&
    !currentQuestion.answers.some(
      ({ id }) => id === answers[currentQuestion.id],
    )
  ) {
    return false
  }

  if (progress.phase === 'results') {
    return (
      testConfig.questions.every((question) => answers[question.id]) &&
      !progress.advanceOnSelection
    )
  }

  return true
}

function restoreProgress(): RestoredProgress {
  const emptyProgress: RestoredProgress = {
    phase: 'intro',
    currentIndex: 0,
    answers: {},
    advanceOnSelection: false,
    scores: null,
    storageError: false,
  }
  const stored = readSessionStorage(progressStorageKey)

  if (!stored.ok) {
    console.error(stored.error)
    return { ...emptyProgress, storageError: true }
  }

  if (!stored.value) return emptyProgress

  try {
    const saved: unknown = JSON.parse(stored.value)
    if (!isValidSavedProgress(saved)) {
      return { ...emptyProgress, storageError: true }
    }

    return {
      phase: saved.phase,
      currentIndex: saved.currentIndex,
      answers: saved.answers,
      advanceOnSelection: saved.advanceOnSelection,
      scores:
        saved.phase === 'results'
          ? calculateScores(saved.answers, testConfig)
          : null,
      storageError: false,
    }
  } catch (error) {
    console.error('Unable to restore the saved Bartle test progress.', error)
    return { ...emptyProgress, storageError: true }
  }
}

export function BartlePage() {
  const { t } = useTranslation()
  const [restoredProgress] = useState(restoreProgress)
  const [phase, setPhase] = useState<TestPhase>(restoredProgress.phase)
  const [currentIndex, setCurrentIndex] = useState(restoredProgress.currentIndex)
  const [answers, setAnswers] = useState<Record<string, string>>(restoredProgress.answers)
  const [scores, setScores] = useState<PlayerTypeScore[] | null>(restoredProgress.scores)
  const [advanceOnSelection, setAdvanceOnSelection] = useState(
    restoredProgress.advanceOnSelection,
  )
  const [storageError, setStorageError] = useState(restoredProgress.storageError)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const currentQuestion = testConfig.questions[currentIndex]

  function beginTest() {
    setAnswers({})
    setCurrentIndex(0)
    setScores(null)
    setAdvanceOnSelection(false)
    setPhase('test')
  }

  function startTest() {
    if (scores) {
      setPhase('results')
      return
    }

    beginTest()
  }

  function resetTest() {
    beginTest()
  }

  useEffect(() => {
    if (phase === 'intro') {
      if (scores) return

      const result = removeSessionStorage(progressStorageKey)
      if (!result.ok) {
        console.error(result.error)
        setStorageError(true)
      }
      return
    }

    const progress: SavedProgress = {
      version: progressVersion,
      phase,
      currentIndex,
      answers,
      advanceOnSelection,
    }
    const result = writeSessionStorage(
      progressStorageKey,
      JSON.stringify(progress),
    )

    if (!result.ok) {
      console.error(result.error)
      setStorageError(true)
    } else {
      setStorageError(false)
    }
  }, [advanceOnSelection, answers, currentIndex, phase, scores])

  useEffect(() => {
    if (phase !== 'test' || !advanceOnSelection) return

    const timeout = window.setTimeout(() => {
      if (currentIndex === testConfig.questions.length - 1) {
        setScores(calculateScores(answers, testConfig))
        setPhase('results')
      } else {
        setCurrentIndex((index) => index + 1)
      }

      setAdvanceOnSelection(false)
    }, 800)

    return () => window.clearTimeout(timeout)
  }, [advanceOnSelection, answers, currentIndex, phase])

  return (
    <main className={`relative flex min-h-dvh flex-col overflow-hidden bg-forest text-cream ${styles.pageBackdrop}`}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <span className={`absolute right-[-14%] top-[10%] aspect-square w-[min(60vw,780px)] rounded-full ${styles.ambientOrb}`} />
        <span className={styles.constellation} />
      </div>

      <header className="relative z-20 mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 border-b border-cream/10 px-4 md:min-h-20 md:gap-5 md:px-8">
        <a
          className="inline-flex cursor-pointer items-center gap-2.5 font-sans font-semibold text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
        <span className="ml-auto hidden font-mono tracking-[0.1em] text-muted md:inline text-xs">{t('nav.edition')}</span>
        <span className="hidden h-3.5 w-px bg-cream/20 md:block" />
        <span className="hidden font-mono text-xs tracking-[0.1em] text-accent sm:inline">{t('nav.fieldGuide')}</span>
        {phase === 'test' && (
          <button
            className="ml-auto inline-flex size-10 shrink-0 cursor-pointer items-center justify-center gap-2 border border-cream/20 bg-transparent text-muted transition hover:border-accent hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto sm:px-3"
            type="button"
            onClick={resetTest}
            aria-label={t('test.reset')}
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{t('test.reset')}</span>
          </button>
        )}
        <label className="relative hidden w-36 shrink-0 md:block">
          <span className="sr-only">{t('nav.language')}</span>
          <select
            className="h-10 w-36 cursor-pointer appearance-none border border-cream/20 bg-panel px-3 pr-9 font-sans text-sm text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={i18n.resolvedLanguage ?? i18n.language}
            onChange={(event) => {
              void i18n.changeLanguage(event.target.value)
            }}
          >
            <option value="en-US">English</option>
            <option value="pt-BR">Português</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            size={16}
            aria-hidden="true"
          />
        </label>
        <button
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center border border-cream/20 bg-transparent text-muted transition hover:border-accent hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          type="button"
          aria-label={t('nav.language')}
          aria-expanded={languageMenuOpen}
          aria-controls="mobile-language-menu"
          onClick={() => setLanguageMenuOpen((isOpen) => !isOpen)}
        >
          {languageMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
        {languageMenuOpen && (
          <div
            className="absolute right-4 top-full z-30 border border-cream/15 bg-panel p-3 shadow-xl md:hidden"
            id="mobile-language-menu"
          >
            <label className="relative block w-40">
              <span className="sr-only">{t('nav.language')}</span>
              <select
                className="h-10 w-full cursor-pointer appearance-none border border-cream/20 bg-forest px-3 pr-9 font-sans text-sm text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                value={i18n.resolvedLanguage ?? i18n.language}
                onChange={(event) => {
                  void i18n.changeLanguage(event.target.value)
                  setLanguageMenuOpen(false)
                }}
              >
                <option value="en-US">English</option>
                <option value="pt-BR">Português</option>
                <option value="fr-FR">Français</option>
                <option value="de-DE">Deutsch</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                size={16}
                aria-hidden="true"
              />
            </label>
          </div>
        )}
      </header>

      {storageError && (
        <p className="relative z-10 mx-auto my-3 w-[calc(100%-2rem)] max-w-7xl border border-[#e3a18d]/40 bg-[#e3a18d]/10 px-4 py-3 text-sm text-[#e3a18d]" role="alert">
          {t('test.storageError')}
        </p>
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 md:px-8">
        {phase === 'intro' && (
          <section className="grid min-h-[calc(100dvh-5rem)] grid-cols-1 items-center gap-4 py-14 md:grid-cols-[1.04fr_0.96fr] md:gap-0 md:py-12">
            <div className={`relative z-10 pb-0 md:pb-10 md:pl-[5.5%] ${styles.heroCopy}`}>
              <p className="mb-0 flex items-center gap-2.5 font-mono tracking-[0.09em] text-muted">
                <span className="h-px w-[22px] bg-accent" />
                {t('intro.eyebrow')}
              </p>
              <h1 className="mb-5 mt-5 max-w-2xl font-sans text-5xl font-medium leading-[0.98] sm:text-6xl lg:mb-5 lg:mt-6 lg:text-7xl xl:text-8xl">
                {t('intro.titleStart')}
                <br />
                <span className="mx-4 font-serif font-normal italic text-accent">{t('intro.titleAccent')}</span>
                {t('intro.titleEnd')}
              </h1>
              <p className="m-0 max-w-[410px] leading-[1.85] text-muted">{t('intro.description')}</p>
              <button className="mt-7 inline-flex min-h-14 cursor-pointer items-center gap-6 border border-accent bg-accent px-5 text-sm font-bold text-forest transition duration-200 hover:-translate-y-0.5 hover:bg-[#a5c5a5] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream" type="button" onClick={startTest}>
                {t('intro.begin')}
                <span aria-hidden="true"><Sparkles size={16} /></span>
              </button>
              <p className="mb-0 mt-3.5 text-s text-cream/60">{t('intro.footnote')}</p>
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
              <span className="absolute bottom-[3%] font-mono text-xs tracking-[0.12em] text-muted md:bottom-[4%]">{t('intro.artCaption')}</span>
            </div>

            <div className="col-span-full mx-0 mt-2 grid grid-cols-1 items-end gap-6 border-t border-cream/10 pt-5 md:mx-[5.5%] md:grid-cols-[1fr_auto] md:gap-5">
              <div className="flex items-center justify-between gap-4 md:justify-start md:gap-8">
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-baseline md:gap-2"><strong className="font-sans text-xl font-medium text-cream">30</strong><span className="text-sm text-muted">{t('intro.stats.choices')}</span></div>
                <span className="h-[18px] w-px bg-cream/15" />
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-baseline md:gap-2"><strong className="font-sans text-xl font-medium text-cream">~5</strong><span className="text-sm text-muted">{t('intro.stats.time')}</span></div>
                <span className="h-[18px] w-px bg-cream/15" />
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-baseline md:gap-2"><strong className="font-sans text-xl font-medium text-cream">04</strong><span className="text-sm text-muted">{t('intro.stats.types')}</span></div>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 md:max-w-[330px] md:justify-end">
                <span className="w-full font-mono tracking-[0.1em] text-muted md:text-right">{t('intro.typesLabel')}</span>
                {testConfig.categories.map(({ id }) => {
                  const Icon = iconByType[id]

                  return (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted" key={id}>
                      <Icon className="text-accent" size={14} aria-hidden="true" />
                      {t(`types.${id}.name`)}
                    </span>
                  )
                })}
              </div>
              <a className="hidden cursor-pointer items-center gap-3 font-mono tracking-[0.1em] text-muted no-underline max-md:inline-flex" href="#about">
                {t('intro.scroll')}
                <span className="h-px w-[34px] bg-accent" />
              </a>
            </div>
          </section>
        )}

        {phase === 'test' && currentQuestion && (
          <div className="flex flex-1 items-center justify-center py-9 md:py-[70px]">
            <QuestionCard
              key={currentQuestion.id}
              question={{
                ...currentQuestion,
                prompt: t(`questions:${currentQuestion.id}.prompt`),
                answers: currentQuestion.answers.map((answer) => ({
                  ...answer,
                  text: t(`questions:${currentQuestion.id}.answers.${answer.id}`),
                })),
              }}
              questionIndex={currentIndex}
              questionCount={testConfig.questions.length}
              selectedAnswer={answers[currentQuestion.id]}
              isFirst={currentIndex === 0}
              onSelect={(answerId) => {
                setAnswers((previous) => ({
                  ...previous,
                  [currentQuestion.id]: answerId,
                }))
                setAdvanceOnSelection(true)
              }}
              onPrevious={() => {
                setAdvanceOnSelection(false)
                setCurrentIndex((index) => Math.max(0, index - 1))
              }}
            />
          </div>
        )}

        {phase === 'results' && scores && (
          <div className="flex flex-1 items-center justify-center py-9 md:py-[70px]">
            <ResultsPanel scores={scores} onRestart={beginTest} />
          </div>
        )}
      </div>

      {phase === 'intro' && (
        <section className="mx-auto my-12 grid w-[calc(100%-2rem)] max-w-4xl grid-cols-1 gap-4 border-t border-cream/15 pt-7 md:my-24 md:grid-cols-[minmax(100px,0.32fr)_1fr] md:gap-x-12 md:gap-y-5" id="about">
          <span className="font-mono tracking-[0.08em] text-muted">{t('about.index')}</span>
          <p className="m-0 max-w-2xl font-sans text-xl leading-relaxed text-cream md:text-2xl">{t('about.description')}</p>
          <span className="font-mono text-muted md:col-start-2">
            {t('about.source')}{' '}
            <a className="cursor-pointer text-accent underline-offset-4 hover:text-cream" href="http://mud.co.uk/richard/hcds.htm" target="_blank" rel="noreferrer">
              {t('about.sourceLink')}
            </a>
          </span>
        </section>
      )}

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl justify-between border-t border-cream/10 px-4 py-5 font-mono tracking-[0.1em] text-cream/55 md:px-8">
        <span>{t('footer.brand')}</span>
        <span>{t('footer.tagline')}</span>
      </footer>
    </main>
  )
}
