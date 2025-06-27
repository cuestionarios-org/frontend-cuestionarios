// src/pages/CompetitionsPage.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { competitionService } from '../services/api'
import { notification } from '../lib/notificationHandler'
import { useTranslation } from 'react-i18next'
import CompetitionCard from '../components/CompetitionCard'
import Loader from '../components/Loader'
import { handleError } from '../lib/errorHandler'
import ErrorMessage from '../components/ErrorMessage'

export default function CompetitionsPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [comps, setComps] = useState({ pending: [], active: [], finished: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('pending')

  const loadComps = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await competitionService.getUserCompetitions()
      setComps(data)
    } catch (err) {
      const handled = handleError(err, { silent: false })
      setError(handled.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComps()
  }, [])

  useEffect(() => {
    // Si no hay pendientes pero sí activas, mostrar 'active' por defecto
    if (!loading && comps.pending.length === 0 && comps.active.length > 0) {
      setTab('active')
    }
    // Si tampoco hay activas pero sí finalizadas, mostrar 'finished'
    else if (!loading && comps.pending.length === 0 && comps.active.length === 0 && comps.finished.length > 0) {
      setTab('finished')
    }
  }, [loading, comps])

  const handleSubscribe = async (competitionId) => {
    try {
      await competitionService.inscribeUser(competitionId)
      notification(t('competitions.success_subscribe'), {
        icon: '✅',
        duration: 2500,
        position: 'top-center'
      })
      await loadComps()
      setTab('active')
    } catch (err) {
      handleError(err)
    }
  }

  const tabs = [
    { key: 'pending',  label: t('competitions.tab_pending') },
    { key: 'active',   label: t('competitions.tab_active') },
    { key: 'finished', label: t('competitions.tab_finished') },
  ]

  if (loading) {
    return <Loader className="h-64" size={12} />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const userId = user?.id

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('competitions.my_competitions')}
      </h1>

      <nav className="flex space-x-6 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tItem => (
          <button
            key={tItem.key}
            onClick={() => setTab(tItem.key)}
            className={`pb-2 focus:outline-none ${
              tab === tItem.key
                ? 'border-b-2 border-blue-600 font-semibold text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </nav>

      <div className="space-y-4">
        {comps[tab].length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            {t('competitions.no_competitions')}
          </p>
        ) : (
          comps[tab].map(c => (
            <CompetitionCard
              key={c.id}
              competition={c}
              tab={tab}
              userId={userId}
              onSubscribe={handleSubscribe}
            />
          ))
        )}
      </div>
    </div>
  )
}