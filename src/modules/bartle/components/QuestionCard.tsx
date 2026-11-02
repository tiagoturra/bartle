import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Question } from '../types'
import { Crossroads } from './Crossroads'
import type { TravelerDirection } from './Traveler'
import styles from './QuestionCard.module.scss'

interface QuestionCardProps {
  question: Question
  questionIndex: number
  questionCount: number
  selectedAnswer?: string
  isFirst: boolean
  onSelect: (answerId: string) => void
  onPrevious: () => void
}

export function QuestionCard({
  question,
  questionIndex,
  questionCount,
  selectedAnswer,
  isFirst,
  onSelect,
  onPrevious,
}: QuestionCardProps) {
  const { t } = useTranslation()
  const progress = ((questionIndex + 1) / questionCount) * 100
  const selectedAnswerIndex = question.answers.findIndex(
    ({ id }) => id === selectedAnswer,
  )
  const selectedPath: TravelerDirection | undefined =
    selectedAnswerIndex === 0
      ? 'left'
      : selectedAnswerIndex === 1
        ? 'right'
        : undefined

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return
      }

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="textbox"]'))
      ) {
        return
      }

      if (!/^[1-9]$/.test(event.key)) return

      const answerIndex = Number(event.key) - 1
      const answer = question.answers[answerIndex]
      if (!answer) return

      event.preventDefault()
      onSelect(answer.id)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelect, question.answers])

  return (
    <section className={`mx-auto w-full max-w-3xl border border-cream/10 bg-panel p-5 shadow-2xl sm:p-8 lg:p-12 ${styles.card}`} aria-labelledby="question-prompt">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-[0.11em] text-accent">{t('test.chapter')}</span>
        <span className="inline-flex items-baseline gap-2 font-mono text-xs tracking-[0.11em] text-muted">
          {t('test.choice')} <strong className="font-medium text-cream">{String(questionIndex + 1).padStart(2, '0')}</strong>
          <span>{t('test.of')}</span>
          {String(questionCount).padStart(2, '0')}
        </span>
      </div>

      <div
        className="mt-5 h-0.5 overflow-hidden bg-cream/10"
        role="progressbar"
        aria-label={t('accessibility.progress')}
        aria-valuenow={questionIndex + 1}
        aria-valuemin={1}
        aria-valuemax={questionCount}
      >
        <span className="block h-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <p className="mb-3 mt-11 font-mono text-xs tracking-[0.04em] text-muted max-sm:mt-8">{t('test.prompt')}</p>
      <h1 className={`mb-7 mt-0 min-h-[2.2em] max-w-[610px] font-sans text-3xl font-medium leading-tight text-cream sm:text-4xl ${styles.prompt}`} id="question-prompt" key={question.id}>
        {question.prompt}
      </h1>

      <Crossroads
        selectedPath={selectedPath}
        label={t('test.crossroadsDescription')}
        choicesClassName={styles.pathChoices}
      >
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.id

          return (
            <button
              className={`group grid min-h-[110px] w-full cursor-pointer grid-cols-[1.875rem_1fr_1.25rem] items-center gap-2.5 border px-3 py-3 text-left leading-relaxed text-cream transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-sm:grid-cols-[1fr_auto] max-sm:grid-rows-[auto_1fr] max-sm:items-start sm:min-h-[96px] sm:grid-cols-[2.125rem_1fr_1.25rem] sm:gap-3 sm:px-4 ${styles.pathChoice} ${isSelected ? `border-accent bg-accent/10 shadow-[inset_3px_0_0_var(--color-accent)] ${styles.twinkle}` : 'border-cream/15 bg-cream/[0.025]'}`}
              type="button"
              key={answer.id}
              onClick={() => onSelect(answer.id)}
              aria-pressed={isSelected}
              aria-keyshortcuts={String(index + 1)}
            >
              <span className={`grid size-[30px] place-items-center border font-mono text-sm max-sm:row-start-1 ${isSelected ? 'border-accent text-accent' : 'border-cream/20 text-muted'}`}>
                {isSelected ? <Check size={17} aria-hidden="true" /> : `0${index + 1}`}
              </span>
              <span className="max-sm:col-span-2 max-sm:row-start-2">{answer.text}</span>
              <span className={`text-muted transition duration-200 max-sm:col-start-2 max-sm:row-start-1 ${isSelected ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </button>
          )
        })}
      </Crossroads>

      <p className="mb-0 mt-3 text-center font-mono text-xs text-accent">{t('test.keyboardHint')}</p>

      <div className="mt-8 flex min-h-12 flex-wrap items-center justify-between gap-3">
        <button
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 bg-transparent p-0 text-sm font-semibold text-muted transition hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-35"
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t('test.back')}
        </button>
      </div>
      <p className="mb-0 mt-5 text-center font-mono text-xs text-muted">{t('test.saveNote')}</p>
    </section>
  )
}
