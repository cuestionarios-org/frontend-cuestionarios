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
              {form.answers.map((a, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                    name={`answer-${idx}-text`}
                    value={a.text}
                    onChange={handleFormChange}
                    placeholder={`Respuesta ${idx + 1}`}
                    required
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      name={`answer-${idx}-is_correct`}
                      checked={a.is_correct}
                      onChange={handleFormChange}
                      className="accent-blue-600"
                    />
                    Correcta
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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