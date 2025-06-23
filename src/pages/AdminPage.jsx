import { useState, useEffect, useRef } from 'react'
import { questionService } from '../services/api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

const tabs = [
  { key: 'questions', label: 'Preguntas y Respuestas' },
  { key: 'quizzes', label: 'Cuestionarios' },
  { key: 'competitions', label: 'Competencias' }
]

const initialForm = {
  question: { text: '', category_id: '' },
  answers: [
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false }
  ]
}

export default function AdminPage() {
  const [tab, setTab] = useState('questions')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterState, setFilterState] = useState('')
  const formRef = useRef(null)

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
        .catch(err => setError('Error al cargar preguntas'))
        .finally(() => setLoading(false))
    }
  }, [tab, filterCategory, filterState])

  // Cargar categorías
  useEffect(() => {
    questionService.getCategories().then(res => setCategories(res.data))
  }, [])

  // Cuando se muestra el formulario, hacer scroll y foco en el modal
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.focus()
      const firstInput = formRef.current.querySelector('input,select,textarea')
      if (firstInput) firstInput.focus()
    }
  }, [showForm])

  // Handlers para el formulario
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('answer')) {
      const [_, idx, field] = name.split('-')
      setForm(f => ({
        ...f,
        answers: f.answers.map((a, i) => {
          if (i === Number(idx)) {
            // Si es el campo is_correct, solo uno puede ser true
            if (field === 'is_correct' && checked) {
              return { ...a, is_correct: true }
            }
            return { ...a, [field]: field === 'is_correct' ? checked : value }
          }
          // Si es is_correct y se está marcando, desmarcar los demás
          if (field === 'is_correct' && checked) {
            return { ...a, is_correct: false }
          }
          return a
        })
      }))
    } else {
      setForm(f => ({
        ...f,
        question: { ...f.question, [name]: value }
      }))
    }
  }

  const handleEdit = (q) => {
    setEditingId(q.question.id)
    setForm({
      question: { ...q.question },
      // Mantén el id de cada respuesta
      answers: q.answers.map(a => ({
        id: a.id, // <-- importante
        text: a.text,
        is_correct: a.is_correct
      }))
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta pregunta?')) {
      await questionService.delete(id)
      setQuestions(qs => qs.filter(q => q.question.id !== id))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await questionService.update(editingId, form)
      setQuestions(qs =>
        qs.map(q =>
          q.question.id === editingId
            ? { ...q, question: { ...q.question, ...form.question }, answers: form.answers }
            : q
        )
      )
    } else {
      const res = await questionService.create(form)
      setQuestions(qs => {
        const updated = [...qs, res.data]
        // Ordena por id ascendente
        return updated.sort((a, b) => a.question.id - b.question.id)
      })
    }
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleOpenForm = () => {
    setShowForm(true)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleChangeStatus = async (q) => {
    let newStatus = q.question.state
    if (q.question.state === 'published') newStatus = 'deleted'
    else if (q.question.state === 'draft') newStatus = 'published'
    else return

    await questionService.update(q.question.id, {
      question: {
        text: q.question.text,
        category_id: q.question.category_id,
        state: newStatus
      },
      answers: q.answers.map(a => ({
        text: a.text,
        is_correct: a.is_correct
      }))
    })
    setQuestions(qs =>
      qs.map(qq =>
        qq.question.id === q.question.id
          ? { ...qq, question: { ...qq.question, state: newStatus } }
          : qq
      )
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Administración
      </h1>
      <nav className="flex space-x-6 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2 focus:outline-none ${
              tab === t.key
                ? 'border-b-2 border-blue-600 font-semibold text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div>
        {tab === 'questions' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Preguntas</h2>
            <button
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleOpenForm}
            >
              + Agregar pregunta
            </button>
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Filtrar por categoría
                </label>
                <select
                  className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                >
                  <option value="">Todas</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Filtrar por estado
                </label>
                <select
                  className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="deleted">Eliminado</option>
                </select>
              </div>
            </div>
            {/* Modal para agregar/editar pregunta */}
            {showForm && (
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
            )}
            {loading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && (
              <ul className="space-y-4">
                {questions.length === 0 ? (
                  <li className="text-gray-500">No hay preguntas registradas.</li>
                ) : (
                  questions.map(q => (
                    <li key={q.question.id} className="relative p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
                      {/* Badges en la esquina superior izquierda */}
                      <div className="absolute top-2 left-3 flex gap-2">
                        <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 text-xs px-2 py-0.5 rounded">
                          {categories.find(cat => cat.id === q.question.category_id)?.name || 'Sin categoría'}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded
            ${q.question.state === 'published' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
              : q.question.state === 'draft' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {q.question.state}
                        </span>
                      </div>
                      {/* Badge con el ID en la esquina superior derecha */}
                      <span className="absolute top-2 right-3 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-0.5 rounded">
                        ID: {q.question.id}
                      </span>
                      {/* Espacio extra para los badges */}
                      <div className="font-medium text-gray-800 dark:text-gray-100 mt-10">{q.question.text}</div>
                      {/* Listado de respuestas */}
                      {q.answers && (
                        <ul className="mt-2 ml-4 list-disc text-gray-700 dark:text-gray-200">
                          {q.answers.map(a => (
                            <li key={a.id}>
                              {a.text} {a.is_correct && <span className="text-green-600 font-bold">(Correcta)</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Botones de acción */}
                      <div className="flex gap-2 justify-end mt-4">
                        <button
                          className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                          onClick={() => handleEdit(q)}
                        >
                          Editar
                        </button>
                        <button
                          className={`text-xs px-2 py-1 rounded transition ${
                            q.question.state === 'published'
                              ? 'bg-red-200 text-red-800 hover:bg-red-300'
                              : 'bg-green-200 text-green-800 hover:bg-green-300'
                          }`}
                          onClick={() => handleChangeStatus(q)}
                        >
                          {q.question.state === 'published'
                            ? 'Marcar como eliminada'
                            : q.question.state === 'draft'
                            ? 'Publicar'
                            : 'Eliminada'}
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
            {tab === 'quizzes' && <div>Aquí irán los cuestionarios.</div>}
          </div>
        )}
        {tab === 'competitions' && <div>Aquí irán las competencias.</div>}
      </div>
    </div>
  )
}