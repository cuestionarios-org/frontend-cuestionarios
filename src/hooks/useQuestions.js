import { useState, useEffect } from 'react'
import { questionService } from '../services/api'

export function useQuestions(tab, filterCategory, filterState) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (tab === 'questions') {
      setLoading(true)
      setError(null)
      const params = {}
      if (filterCategory) params.category_id = filterCategory
      if (filterState) params.state = filterState
      questionService.getAll(params)
        .then(res => {
          const sorted = [...res.data].sort((a, b) => a.question.id - b.question.id)
          setQuestions(sorted)
        })
        .catch(() => setError('Error al cargar preguntas'))
        .finally(() => setLoading(false))
    }
  }, [tab, filterCategory, filterState])

  return { questions, setQuestions, loading, error }
}