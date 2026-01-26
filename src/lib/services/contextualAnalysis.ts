export interface ContextualAnalysisParams {
  fieldId: string
  criterionType: string
  content: string
  label: string
}

export interface ContextualAnalysisResult {
  relevanceScore: number // 0-100
  feedback: string
  suggestions: string[]
  isRelevant: boolean
}

const SPECIFICITY_KEYWORDS = [
  'specific',
  'percent',
  '%',
  'number',
  'quantified',
  'measured',
  'documented',
  'recognized',
  'awarded',
  'citation',
  'published',
  'peer-reviewed',
  'industry',
  'leading',
  'first',
  'novel',
  'unique',
  'innovative',
  'significant',
  'major',
  'top',
  'prestigious',
  'renowned',
  'internationally',
  'nationally',
]

function calculateScore(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // Base score from word count (max 50 points)
  let score = Math.min(wordCount * 2, 50)

  // Bonus for specificity keywords (max 30 points)
  const lowerContent = content.toLowerCase()
  const keywordMatches = SPECIFICITY_KEYWORDS.filter((kw) =>
    lowerContent.includes(kw)
  ).length
  score += Math.min(keywordMatches * 5, 30)

  // Bonus for numbers/statistics (max 20 points)
  const numberMatches = content.match(/\d+/g)?.length || 0
  score += Math.min(numberMatches * 5, 20)

  return Math.min(score, 100)
}

function generateFeedback(score: number, label: string): string {
  if (score >= 80) {
    return `Excellent ${label.toLowerCase()} with strong specificity and detail.`
  } else if (score >= 60) {
    return `Good ${label.toLowerCase()}, but could benefit from more specific details.`
  } else if (score >= 40) {
    return `Your ${label.toLowerCase()} needs more concrete examples and quantifiable data.`
  } else {
    return `Consider expanding your ${label.toLowerCase()} with specific achievements and measurable outcomes.`
  }
}

function generateSuggestions(score: number, content: string): string[] {
  const suggestions: string[] = []

  if (score < 80) {
    const hasNumbers = /\d+/.test(content)
    if (!hasNumbers) {
      suggestions.push('Add specific numbers, percentages, or statistics')
    }

    const hasTimeframe = /\d{4}|year|month|week|day/i.test(content)
    if (!hasTimeframe) {
      suggestions.push('Include relevant timeframes or dates')
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 50) {
      suggestions.push('Provide more detail about your experience')
    }

    if (!content.toLowerCase().includes('result') && !content.toLowerCase().includes('outcome')) {
      suggestions.push('Describe the outcomes or results of your work')
    }
  }

  return suggestions
}

export async function analyzeContextualRelevance(
  params: ContextualAnalysisParams
): Promise<ContextualAnalysisResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { content, label } = params
  const relevanceScore = calculateScore(content)
  const isRelevant = relevanceScore >= 40

  const result: ContextualAnalysisResult = {
    relevanceScore,
    feedback: generateFeedback(relevanceScore, label),
    suggestions: generateSuggestions(relevanceScore, content),
    isRelevant,
  }

  // Log to console for verification
  console.log('[Contextual Analysis]', {
    fieldId: params.fieldId,
    criterionType: params.criterionType,
    relevanceScore,
    isRelevant,
    feedback: result.feedback,
    suggestions: result.suggestions,
  })

  return result
}
