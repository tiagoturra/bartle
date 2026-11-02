export type PlayerTypeId = 'socialiser' | 'explorer' | 'achiever' | 'killer'

export interface PlayerType {
  id: PlayerTypeId
  icon: 'users' | 'compass' | 'trophy' | 'swords'
  color: string
}

export interface Answer {
  id: string
  text: string
  scores: Partial<Record<PlayerTypeId, number>>
}

export interface Question {
  id: string
  prompt: string
  answers: Answer[]
}

export interface BartleTestConfig {
  scoring: {
    method: 'percentage-of-earned-points'
    answerRule: string
    normalizationRule: string
  }
  categories: PlayerType[]
  questions: Question[]
}

export interface PlayerTypeScore {
  id: PlayerTypeId
  points: number
  percentage: number
}
