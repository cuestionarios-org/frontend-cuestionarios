import { useState } from 'react'

const tabs = [
  { key: 'questions', label: 'Preguntas y Respuestas' },
  { key: 'quizzes', label: 'Cuestionarios' },
  { key: 'competitions', label: 'Competencias' }
]

export default function AdminPage() {
  const [tab, setTab] = useState('questions')

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
        {tab === 'questions' && <div>Aquí irán las preguntas y respuestas.</div>}
        {tab === 'quizzes' && <div>Aquí irán los cuestionarios.</div>}
        {tab === 'competitions' && <div>Aquí irán las competencias.</div>}
      </div>
    </div>
  )
}