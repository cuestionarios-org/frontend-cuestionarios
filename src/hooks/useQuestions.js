import { useState, useEffect } from 'react'
import { questionService } from '../services/api'

export function useQuestions(tab, filterCategory, filterState, searchText) {
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
      if (searchText) params.text = searchText
      questionService.getAll(params)
        .then(res => {
          const sorted = [...res.data].sort((a, b) => b.question.id - a.question.id)
          setQuestions(sorted)
        })
        .catch(() => setError('Error al cargar preguntas'))
        .finally(() => setLoading(false))
    }
  }, [tab, filterCategory, filterState, searchText])

  return { questions, setQuestions, loading, error }
}