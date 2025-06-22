import { useState, useEffect } from 'react'
import { questionService } from '../services/api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

const tabs = [
  { key: 'questions', label: 'Preguntas y Respuestas' },
  { key: 'quizzes', label: 'Cuestionarios' },
  { key: 'competitions', label: 'Competencias' }
]

export default function AdminPage() {
  const [tab, setTab] = useState('questions')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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