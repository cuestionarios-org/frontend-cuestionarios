import React, { useState, useEffect } from 'react'
import QuestionsFilters from './QuestionsFilters'
import QuestionsSearch from './QuestionsSearch'
import ErrorMessage from './ErrorMessage'

const QUIZ_STATES = [
  { value: 'preparacion', label: 'Preparación' },
  { value: 'listo', label: 'Listo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'activo', label: 'Activo' },
  { value: 'finalizado', label: 'Finalizado' },
]

export default function QuizForm({
  open, onClose, onSubmit, categories, questions, initialData, loading, error
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [selectedQuestions, setSelectedQuestions] = useState(initialData?.question_ids || [])
  const [state, setState] = useState(initialData?.state || 'preparacion')
  const [timeLimit, setTimeLimit] = useState(initialData?.time_limit || '')
  const [showQuestionsFull, setShowQuestionsFull] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')
  const [searchText, setSearchText] = useState('')

  // Filtrado de preguntas
  const filteredQuestions = questions.filter(q => {
    const matchesCategory = filterCategory ? String(q.question.category_id) === String(filterCategory) : true
    const matchesText = searchText
      ? q.question.text.toLowerCase().includes(searchText.toLowerCase())
      : true
    return matchesCategory && matchesText
  })

  useEffect(() => {
    setTitle(initialData?.title || '')
    setDescription(initialData?.description || '')
    setCategoryId(initialData?.category_id || '')
    setSelectedQuestions(initialData?.question_ids || [])
    setState(initialData?.state || 'preparacion')
    setTimeLimit(initialData?.time_limit || '')
    setShowQuestionsFull(false)
    setFilterCategory('')
    setSearchText('')
  }, [open, initialData])

  useEffect(() => {
    if (error && initialData?.state) {
      setState(initialData.state)
    }
  }, [error, initialData])

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
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-4 border border-gray-200 dark:border-gray-700 relative ${showQuestionsFull ? 'max-w-4xl max-h-[98vh] h-[98vh] flex flex-col' : 'max-h-[90vh]'} overflow-y-auto`}>
        {/* Badge de ID en edición */}
        {initialData?.id && !showQuestionsFull && (
          <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
            ID: {initialData.id}
          </span>
        )}
        <form onSubmit={handleSubmit} className={`space-y-4 ${showQuestionsFull ? 'hidden' : ''}`}>
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{initialData ? 'Editar' : 'Nuevo'} Cuestionario</h2>
          {error && <ErrorMessage message={error} />}
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
          {/* Fila combinada para estado y tiempo límite */}
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Estado</label>
              <select
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={state}
                onChange={e => setState(e.target.value)}
                required
              >
                {QUIZ_STATES.map(opt => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={
                      initialData?.state === 'listo' && opt.value === 'preparacion'
                    }
                    style={
                      initialData?.state === 'listo' && opt.value === 'preparacion'
                        ? { color: '#aaa', backgroundColor: '#f3f4f6' }
                        : {}
                    }
                  >
                    {opt.label}
                    {initialData?.state === 'listo' && opt.value === 'preparacion' ? ' (no permitido)' : ''}
                  </option>
                ))}
              </select>
              {initialData?.state === 'listo' && (
                <div className="text-xs text-gray-500 mt-1">
                  No puedes volver a <span className="font-semibold">Preparación</span> desde <span className="font-semibold">Listo</span>.
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
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
          {/* Separador visual */}
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          {/* Acordeón de preguntas */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border rounded p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" onClick={() => setShowQuestionsFull(true)}>
            <span className="font-medium text-gray-700 dark:text-gray-200">Preguntas seleccionadas: {selectedQuestions.length}</span>
            <button type="button" className="text-blue-600 dark:text-blue-300 text-xs underline ml-2">Ver/Editar</button>
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
        {/* Vista expandida de preguntas: ocupa todo el modal y oculta el resto */}
        {showQuestionsFull && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Preguntas para <span className="font-semibold text-blue-700 dark:text-blue-300">{title || 'nuevo cuestionario'}</span>
              </span>
              <button type="button" className="px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded text-xs" onClick={() => setShowQuestionsFull(false)}>Volver</button>
            </div>
            {/* Filtro solo por categoría, sin estado */}
            <div className="mb-2">
              <QuestionsFilters
                categories={categories}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                showCategory={true}
                showState={false}
              />
            </div>
            <QuestionsSearch value={searchText} onChange={setSearchText} />
            <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {filteredQuestions.length === 0 && <div className="text-xs text-gray-500">No hay preguntas que coincidan.</div>}
              {filteredQuestions.map(q => (
                <label key={q.question.id} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q.question.id)}
                    onChange={() => handleToggleQuestion(q.question.id)}
                  />
                  <span className="text-gray-900 dark:text-white">{q.question.text}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
