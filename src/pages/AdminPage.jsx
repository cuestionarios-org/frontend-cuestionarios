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
  const formRef = useRef(null)

  useEffect(() => {
    if (tab === 'questions') {
      setLoading(true)
      setError(null)
      questionService.getAll()
        .then(res => setQuestions(res.data))
        .catch(err => setError('Error al cargar preguntas'))
        .finally(() => setLoading(false))
    }
  }, [tab])

  // Cargar categorías
  useEffect(() => {
    questionService.getCategories().then(res => setCategories(res.data))
  }, [])

  // Cuando se muestra el formulario, hacer scroll y foco
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const firstInput = formRef.current.querySelector('input,select,textarea')
      if (firstInput) firstInput.focus()
    }
  }, [showForm])

  // Handlers para el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('answer')) {
      const [_, idx, field] = name.split('-')
      setForm(f => ({
        ...f,
        answers: f.answers.map((a, i) =>
          i === Number(idx) ? { ...a, [field]: field === 'is_correct' ? e.target.checked : value } : a
        )
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
      answers: q.answers.map(a => ({ text: a.text, is_correct: a.is_correct }))
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
    } else {
      await questionService.create(form)
    }
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
    // Recarga preguntas
    const res = await questionService.getAll()
    setQuestions(res.data)
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
              onClick={() => { setShowForm(true); setEditingId(null); setForm(initialForm) }}
            >
              + Agregar pregunta
            </button>
            {showForm && (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6 border border-gray-200 dark:border-gray-700"
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
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {editingId ? 'Guardar cambios' : 'Agregar'}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                    onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm) }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
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
                      {/* Badge con el ID en la esquina superior derecha */}
                      <span className="absolute top-2 right-3 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-0.5 rounded">
                        ID: {q.question.id}
                      </span>
                      <div className="font-medium text-gray-800 dark:text-gray-100">{q.question.text}</div>
                      {q.answers && (
                        <ul className="mt-2 ml-4 list-disc text-gray-700 dark:text-gray-200">
                          {q.answers.map(a => (
                            <li key={a.id}>
                              {a.text} {a.is_correct && <span className="text-green-600 font-bold">(Correcta)</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Botones debajo del contenido, alineados a la derecha */}
                      <div className="flex gap-2 justify-end mt-4">
                        <button
                          className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                          onClick={() => handleEdit(q)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                          onClick={() => handleDelete(q.question.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}
        {tab === 'quizzes' && <div>Aquí irán los cuestionarios.</div>}
        {tab === 'competitions' && <div>Aquí irán las competencias.</div>}
      </div>
    </div>
  )
}