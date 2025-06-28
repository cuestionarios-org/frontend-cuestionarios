// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Toast from './components/Toaster'
import Navbar from './components/Navbar'
import LandingPublic from './pages/LandingPublic'
import AuthForm from './pages/AuthForm'
import ProtectedRoute from './components/ProtectedRoute'
import QuizzesManager from './pages/QuizzesManager'
import CompetitionsPage from './pages/CompetitionsPage'
import AdminPage from './pages/AdminPage'
import UserDashboard from './pages/UserDashboard'
import CompetitionPlay from './pages/CompetitionPlay'
import QuizPlayPage from './pages/QuizPlayPage'

export default function App() {
  const { user, pending } = useAuth()

  // Simple spinner mientras autenticamos
  if (pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toast />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <AuthForm mode="login" />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <AuthForm mode="register" />}
          />

          <Route
            path="/competitions"
            element={
              <ProtectedRoute>
                <CompetitionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/competition/:id/play"
            element={
              <ProtectedRoute>
                <CompetitionPlay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/competition/:id/quiz/:quizId/play"
            element={
              <ProtectedRoute>
                <QuizPlayPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              user ? (
                user.role === 'admin' ? (
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                )
              ) : (
                <LandingPublic />
              )
            }
          />
        </Routes>
      </main>
    </div>
  )
}
