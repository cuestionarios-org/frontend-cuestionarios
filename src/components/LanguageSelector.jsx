import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Flag from 'react-world-flags'

const languages = {
  es: { label: 'Español', flag: 'es' },
  en: { label: 'English', flag: 'us' },
  pt: { label: 'Português', flag: 'br' }
}

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const currentLang = i18n.language || 'es'

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-800 dark:text-gray-200 flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
      >
        <span>
        {languages[currentLang]?.flag 
          ? <Flag code={languages[currentLang].flag} style={{ width: 20, height: 14 }} />

          : '🌐'
        }
        </span>

        <span className='text-gray-800 dark:text-gray-200'>{languages[currentLang]?.label || currentLang.toUpperCase()}</span>
        <svg
          className={`w-6 h-6 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-md z-10">
          {Object.entries(languages).map(([lng, { label, flag }]) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{<Flag code={flag} style={{ width: 20, height: 14 }} />}</span>
              <span className='text-gray-800 dark:text-gray-200'>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
