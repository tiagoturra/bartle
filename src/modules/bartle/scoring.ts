import type {
  BartleTestConfig,
  PlayerTypeId,
  PlayerTypeScore,
} from './types'

export function calculateScores(
  answers: Record<string, string>,
  config: BartleTestConfig,
): PlayerTypeScore[] {
  const points = Object.fromEntries(
    config.categories.map(({ id }) => [id, 0]),
  ) as Record<PlayerTypeId, number>

  for (const question of config.questions) {
    const answerId = answers[question.id]
    const answer = question.answers.find(({ id }) => id === answerId)

    if (!answer) {
      throw new Error(`A valid answer is required for question "${question.id}".`)
    }

    for (const [category, score] of Object.entries(answer.scores)) {
      if (!(category in points) || typeof score !== 'number' || score < 0) {
        throw new Error(`Invalid scoring rule on question "${question.id}".`)
      }

      points[category as PlayerTypeId] += score
    }
  }

  const totalPoints = Object.values(points).reduce((sum, score) => sum + score, 0)

  if (totalPoints === 0) {
    throw new Error('The test configuration must award at least one point.')
  }

  return config.categories
    .map(({ id }) => ({
      id,
      points: points[id],
      percentage: (points[id] / totalPoints) * 100,
    }))
    .sort((first, second) => second.points - first.points)
}
