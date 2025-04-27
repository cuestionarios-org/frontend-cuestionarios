// src/components/AuthForm.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { handleError } from '../lib/errorHandler'

export default function AuthForm({ mode = 'login' }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailInputRef = useRef(null)

  // La ruta a la que volveremos tras login (o raíz si no hay)
  const from = location.state?.from || '/'

  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('authForm.errors.invalidEmail') || 'Correo inválido')
      return false
    }
    if (password.length < 4) {
      setError(t('authForm.errors.shortPassword') || 'La contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (mode === 'register' && username.trim().length < 3) {
      setError(t('authForm.errors.shortUsername') || 'El nombre de usuario debe tener al menos 3 caracteres')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!validateInputs()) return

    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, username, password)
      }
      // Redirige a la ruta original
      navigate(from, { replace: true })
    } catch (err) {
      const { message, isValidationError } = handleError(err, { silent: true })
      if (isValidationError) {
        setError(message)
      } else {
        handleError(err, { silent: false })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {mode === 'login'
          ? t('authForm.titleLogin')
          : t('authForm.titleRegister')}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900
                        text-red-700 dark:text-red-300 rounded-md
                        border border-red-200 dark:border-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email-input"
                 className="block text-sm font-medium mb-1
                            text-gray-700 dark:text-gray-300">
            {t('authForm.emailLabel') || 'Correo electrónico'}
          </label>
          <input
            id="email-input"
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="username-input"
                   className="block text-sm font-medium mb-1
                              text-gray-700 dark:text-gray-300">
              {t('authForm.usernameLabel') || 'Nombre de usuario'}
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="nombre_usuario"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="password-input"
                 className="block text-sm font-medium mb-1
                            text-gray-700 dark:text-gray-300">
            {t('authForm.passwordLabel') || 'Contraseña'}
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting
            ? t('authForm.processing')
            : mode === 'login'
              ? t('authForm.loginButton')
              : t('authForm.registerButton')}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        {mode === 'login' ? (
          <>
            {t('authForm.noAccount') || '¿No tenés cuenta?'}{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('authForm.registerLink') || 'Registrarse'}
            </Link>
          </>
        ) : (
          <>
            {t('authForm.haveAccount') || '¿Ya tenés cuenta?'}{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('authForm.loginLink') || 'Iniciar sesión'}
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
