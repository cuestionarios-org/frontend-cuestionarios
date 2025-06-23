import { useState, useEffect } from 'react'
import { questionService } from '../services/api'

export function useCategories() {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    questionService.getCategories().then(res => setCategories(res.data))
  }, [])
  return categories
}