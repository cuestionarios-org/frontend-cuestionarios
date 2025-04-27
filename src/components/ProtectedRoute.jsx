// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, pending } = useAuth()
  const location = useLocation()

  // Mientras comprobamos token...
  if (pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12
                        border-t-4 border-b-4 border-blue-500 dark:border-blue-400" />
      </div>
    )
  }

  // Si no hay usuario, guardamos la ruta en `state.from`
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
