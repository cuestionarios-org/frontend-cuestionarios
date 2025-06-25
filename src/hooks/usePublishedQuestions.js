import { useState, useEffect } from 'react'
import { questionService } from '../services/api'

export function usePublishedQuestions(searchText = '', categoryId = '') {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    questionService.getAll({ state: 'published', text: searchText, category_id: categoryId })
      .then(res => setQuestions(res.data))
      .catch(() => setError('Error al cargar preguntas publicadas'))
      .finally(() => setLoading(false))
  }, [searchText, categoryId])

  return { questions, loading, error }
}
