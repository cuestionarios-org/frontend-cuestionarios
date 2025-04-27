// src/components/CompetitionsPage.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { competitionService } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function CompetitionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [comps, setComps] = useState({ pending: [], active: [], finished: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('pending')

  useEffect(() => {
    competitionService.getUserCompetitions()
      .then(({ data }) => setComps(data))
      .catch(err => setError(err.message || 'Error al cargar competencias'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-red-600 dark:text-red-400 mt-8">
        {error}
      </p>
    )
  }

  const tabs = [
    { key: 'pending',  label: 'Disponibles' },
    { key: 'active',   label: 'En curso'   },
    { key: 'finished', label: 'Completadas' },
  ]

  const now = new Date()
  const userId = user?.id

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Mis Competencias
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

      <div className="space-y-4">
        {comps[tab].length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No hay competencias en esta sección.
          </p>
        ) : (
          comps[tab].map(c => {
            const isRegistered = c.participants.some(p => p.participant_id === userId)
            const startDate = new Date(c.start_date)
            const diffMs = startDate - now
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

            return (
              <div
                key={c.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700"
              >
                <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                  {c.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {startDate.toLocaleDateString()} – {new Date(c.end_date).toLocaleDateString()}
                </p>
                <div className="mt-3">
                  {tab === 'pending' && (
                    isRegistered ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Ya estás inscrito. Comienza en {diffDays} días{diffHours > 0 ? ` y ${diffHours} horas` : ''}.
                      </p>
                    ) : (
                      <button
                        className="px-4 py-1 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                        onClick={() => {
                          competitionService.getUserCompetitions()
                            .then(() => {/* mostrar toast de éxito si quieres */})
                            .catch(console.error)
                        }}
                      >
                        Inscribirme
                      </button>
                    )
                  )}
                  {tab === 'active' && (
                    <button
                      className="px-4 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      onClick={() => navigate(`/competitions/${c.id}`)}
                    >
                      Ir a la Competencia
                    </button>
                  )}
                  {tab === 'finished' && (
                    <button
                      className="px-4 py-1 bg-gray-600 dark:bg-gray-500 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => navigate(`/competitions/${c.id}/ranking`)}
                    >
                      Ver Ranking
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
