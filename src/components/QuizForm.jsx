import React, { useState, useEffect } from 'react'

const QUIZ_STATES = [
  { value: 'preparacion', label: 'Preparación' },
  { value: 'listo', label: 'Listo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'activo', label: 'Activo' },
  { value: 'finalizado', label: 'Finalizado' },
]

export default function QuizForm({
  open, onClose, onSubmit, categories, questions, initialData, loading
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [selectedQuestions, setSelectedQuestions] = useState(initialData?.question_ids || [])
  const [state, setState] = useState(initialData?.state || 'preparacion')
  const [timeLimit, setTimeLimit] = useState(initialData?.time_limit || '')

  useEffect(() => {
    setTitle(initialData?.title || '')
    setDescription(initialData?.description || '')
    setCategoryId(initialData?.category_id || '')
    setSelectedQuestions(initialData?.question_ids || [])
    setState(initialData?.state || 'preparacion')
    setTimeLimit(initialData?.time_limit || '')
  }, [initialData])

  const handleToggleQuestion = (id) => {
    setSelectedQuestions(prev =>
      prev.includes(id)
        ? prev.filter(qid => qid !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      category_id: categoryId,
      question_ids: selectedQuestions,
      state,
      time_limit: timeLimit ? Number(timeLimit) : null
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-4 border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{initialData ? 'Editar' : 'Nuevo'} Cuestionario</h2>
          <input
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Título del cuestionario"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
          <select
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Tiempo límite (segundos)</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Ej: 600 (10 minutos)"
                value={timeLimit}
                onChange={e => setTimeLimit(e.target.value)}
              />
            </div>
          </div>
          <select
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={state}
            onChange={e => setState(e.target.value)}
            required
          >
            {QUIZ_STATES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div>
            <div className="mb-1 font-medium text-gray-700 dark:text-gray-200">Preguntas (solo publicadas)</div>
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {questions.length === 0 && <div className="text-xs text-gray-500">No hay preguntas publicadas.</div>}
              {questions.map(q => (
                <label key={q.question.id} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q.question.id)}
                    onChange={() => handleToggleQuestion(q.question.id)}
                  />
                  <span>{q.question.text}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {initialData ? 'Guardar cambios' : 'Crear'}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
