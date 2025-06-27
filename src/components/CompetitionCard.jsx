// src/components/CompetitionCard.jsx
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CompetitionCard({ competition, tab, userId, onSubscribe }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const now = new Date()

  const isRegistered = competition.participants.some(p => p.participant_id === userId)
  const startDate = new Date(competition.start_date)
  const endDate = new Date(competition.end_date)

  // Cálculo de tiempo restante
  const diffMs = startDate - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return (
    <div
      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700"
    >
      <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">
        {competition.title}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
      </p>
      <div className="mt-3">
        {tab === 'pending' && (
          isRegistered ? (
            <button
              className="px-4 py-1 bg-red-600 dark:bg-red-500 text-white rounded cursor-not-allowed opacity-70"
              disabled
            >
              {t('competitions.already_registered_short', 'Ya inscrito')}
            </button>
          ) : (
            <button
              className="px-4 py-1 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              onClick={() => onSubscribe(competition.id)}
            >
              {t('competitions.subscribe')}
            </button>
          )
        )}

        {tab === 'active' && (
          <button
            className="px-4 py-1 bg-blue-600 dark:bg-blue-500
                       text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600
                       transition-colors"
            onClick={() => navigate(`/competitions/${competition.id}`)}
          >
            {t('competitions.go_to_competition')}
          </button>
        )}

        {tab === 'finished' && (
          <button
            className="px-4 py-1 bg-gray-600 dark:bg-gray-500
                       text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600
                       transition-colors"
            onClick={() => navigate(`/competitions/${competition.id}/ranking`)}
          >
            {t('competitions.view_ranking')}
          </button>
        )}
      </div>
    </div>
  )
}
