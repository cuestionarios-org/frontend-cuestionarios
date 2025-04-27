import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function LandingPublic() {
  const { t } = useTranslation()

  const loading = false // Reemplazar con el estado real de carga
  const categories = ['cultura', 'tecnología', 'historia', 'ciencia'] // Reemplazar con categorías reales

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('app.loading')}</p>
      </div>
    )
  }

  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        {t('app.title')}
      </h1>

      <div className="mb-12 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
          {t('app.poweredBy')}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {t('landing.intro')}
        </p>
        <ul className="grid md:grid-cols-2 gap-4 text-left mb-6">
          {[0, 1, 2, 3].map(i => (
            <li key={i} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 dark:text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t(`landing.features.${i}`)}
            </li>
          ))}
        </ul>

      </div>

      {/* <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('app.chooseCategories')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        {t('landing.description')}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {categories.map(category => (
          <div
            key={category}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm cursor-not-allowed opacity-75 hover:opacity-100 transition-opacity"
          >
            <div className="font-medium mb-2 capitalize text-gray-800 dark:text-gray-100">
              {category}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              {t('landing.subscriptionAccess')}
            </div>
          </div>
        ))}
      </div> */}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('buttons.startNow')}
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:border-blue-300 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {t('buttons.access')}
        </Link>
      </div>
    </div>
  )
}
