// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = e => {
      if (!e.target.closest('.user-menu')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-gray-200"
        >
          📰 {t('app.title')}
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />

          {user && (
            <>
              <Link
                to="/competitions"
                className="text-gray-800 dark:text-gray-200 hover:underline"
              >
                Mis Competencias
              </Link>

              <div className="user-menu relative">
                <button
                  onClick={() => setIsMenuOpen(o => !o)}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
                >
                  <span>{user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isMenuOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black dark:ring-gray-600 ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                      {t('app.connectedAs')}: <span className="font-medium">{user.username}</span>
                      {user.role === 'admin' && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">admin</span>
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full block text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Administrar
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('app.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
