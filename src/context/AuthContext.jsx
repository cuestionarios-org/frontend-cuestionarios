// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [pending, setPending] = useState(true)    // <— estado de carga

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      authService.getMe(token)
        .then(response => {
          setUser({ token, ...response.data })
        })
        .catch(error => {
          console.error('Error al obtener el usuario:', error)
          logout()
        })
        .finally(() => {
          setPending(false)   // <— ya terminó de cargar
        })
    } else {
      setPending(false)
    }
  }, [])

  const register = async (email, username, password) => {
    const response = await authService.register(email, username, password)
    const { access_token, user } = response.data
    localStorage.setItem('jwtToken', access_token)
    setUser({ token: access_token, ...user })
  }

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    const { access_token, user } = response.data
    localStorage.setItem('jwtToken', access_token)
    setUser({ token: access_token, ...user })
  }

  const logout = () => {
    localStorage.removeItem('jwtToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, pending, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
