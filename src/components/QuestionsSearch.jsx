import { useState, useEffect } from 'react'

export default function QuestionsSearch({ value, onChange, delay = 400 }) {
  const [input, setInput] = useState(value)

  useEffect(() => {
    setInput(value)
  }, [value])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(input)
    }, delay)
    return () => clearTimeout(handler)
  }, [input, onChange, delay])

  return (
    <input
      type="text"
      placeholder="Buscar por texto de pregunta..."
      className="mb-4 w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      value={input}
      onChange={e => setInput(e.target.value)}
    />
  )
}