import React from 'react'

export default function QuestionForm({
  form,
  categories,
  formRef,
  handleFormChange,
  handleSubmit,
  handleCloseForm,
  editingId
}) {
  // Calcula cuántos inputs mostrar (siempre uno más que el último con texto, hasta 5)
  const visibleAnswers = (() => {
    const filled = form.answers.filter(a => a.text.trim() !== '')
    return Math.min(Math.max(filled.length + 1, 2), 5)
  })()

  // Verifica si hay exactamente una respuesta correcta
  const correctCount = form.answers.filter(a => a.is_correct).length
  const isValid = correctCount === 1 && form.answers.filter(a => a.text.trim() !== '').length >= 2

  // Handler para cambiar texto o marcar correcta
  const onAnswerChange = (idx, field, value) => {
    handleFormChange({
      target: {
        name: `answer-${idx}-${field}`,
        value: field === 'is_correct' ? value : value,
        type: field === 'is_correct' ? 'checkbox' : 'text',
        checked: value
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl"
          onClick={handleCloseForm}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Texto de la pregunta
            </label>
            <input
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="text"
              value={form.question.text}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Categoría
            </label>
            <select
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="category_id"
              value={form.question.category_id}
              onChange={handleFormChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Respuestas
            </label>
            <div className="space-y-2">
              {Array.from({ length: visibleAnswers }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                    name={`answer-${idx}-text`}
                    value={form.answers[idx]?.text || ''}
                    onChange={e => onAnswerChange(idx, 'text', e.target.value)}
                    placeholder={`Respuesta ${idx + 1}`}
                    // required={idx < 2}
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-200">
                    <input
                      type="radio"
                      name="is_correct"
                      checked={!!form.answers[idx]?.is_correct}
                      onChange={() => onAnswerChange(idx, 'is_correct', true)}
                      disabled={!form.answers[idx]?.text}
                      className="accent-blue-600"
                    />
                    Correcta
                  </label>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Debe haber <b>una y solo una</b> respuesta correcta. Mínimo 2 respuestas.
            </div>
            {!isValid && (
              <div className="text-xs text-red-500 mt-1">
                {correctCount === 0
                  ? 'Selecciona una respuesta correcta.'
                  : correctCount > 1
                  ? 'Solo puede haber una respuesta correcta.'
                  : form.answers.filter(a => a.text.trim() !== '').length < 2
                  ? 'Debes ingresar al menos dos respuestas.'
                  : ''}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={!isValid}
            >
              {editingId ? 'Guardar cambios' : 'Agregar'}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={handleCloseForm}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}