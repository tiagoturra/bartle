import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Question } from '../types'
import styles from './QuestionCard.module.scss'

interface QuestionCardProps {
  question: Question
  questionIndex: number
  questionCount: number
  selectedAnswer?: string
  isFirst: boolean
  onSelect: (answerId: string) => void
  onPrevious: () => void
  onReset: () => void
}

export function QuestionCard({
  question,
  questionIndex,
  questionCount,
  selectedAnswer,
  isFirst,
  onSelect,
  onPrevious,
  onReset,
}: QuestionCardProps) {
  const { t } = useTranslation()
  const progress = ((questionIndex + 1) / questionCount) * 100

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

      <div className="grid gap-3">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.id

          return (
            <button
              className={`group grid min-h-[76px] w-full cursor-pointer grid-cols-[2.125rem_1fr_1.25rem] items-center gap-3 border px-3.5 py-3.5 text-left leading-relaxed text-cream transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-h-[84px] sm:grid-cols-[2.375rem_1fr_1.25rem] sm:gap-4 sm:px-5 sm:py-[18px] ${isSelected ? `border-accent bg-accent/10 shadow-[inset_3px_0_0_var(--color-accent)] ${styles.twinkle}` : 'border-cream/15 bg-cream/[0.025]'}`}
              type="button"
              key={answer.id}
              onClick={() => onSelect(answer.id)}
              aria-pressed={isSelected}
            >
              <span className={`grid size-[34px] place-items-center border font-mono text-xs ${isSelected ? 'border-accent text-accent' : 'border-cream/20 text-muted'}`}>
                {isSelected ? <Check size={17} aria-hidden="true" /> : `0${index + 1}`}
              </span>
              <span>{answer.text}</span>
              <span className={`text-muted transition duration-200 ${isSelected ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </button>
          )
        })}
      </div>

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
        <button
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-transparent text-sm font-semibold text-muted transition hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          type="button"
          onClick={onReset}
        >
          <RotateCcw size={15} aria-hidden="true" />
          {t('test.reset')}
        </button>
      </div>
      <p className="mb-0 mt-5 text-center font-mono text-xs text-muted">{t('test.saveNote')}</p>
    </section>
  )
}
