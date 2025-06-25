import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    if ([401, 403, 422].includes(status)) {
      localStorage.removeItem('jwtToken')
      window.dispatchEvent(new Event('storage'))
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (email,username, password) => apiClient.post('/auth/register', { email: email, password, username }),
  getMe: () => apiClient.get('/auth/me')
}


export const competitionService = {
  /**
   * Trae las competencias del usuario: pending, active, finished
   */
  getUserCompetitions: () => apiClient.get('/competitions/users'),
  inscribeUser(competitionId) {
    return apiClient.post(`/competitions/${competitionId}/participants`)
  }
}

export const questionService = {
  getAll: (params = {}) => apiClient.get('/questions', { params }),
  getById: (id) => apiClient.get(`/questions/${id}`),
  create: (data) => apiClient.post('/questions', data),
  update: (id, data) => apiClient.put(`/questions/${id}`, data),
  getCategories: () => apiClient.get('/questions/categories'),
  createCategory: (data) => apiClient.post('/questions/categories', data),
  getByCategory: (id) => apiClient.get(`/questions/category/${id}`),
  // --- Quizzes ---
  createQuiz: (data) => {
    return apiClient.post('/quizzes', data)
  },
  updateQuiz: (id, data) => {
    return apiClient.put(`/quizzes/${id}`, data)
  },
  getAllQuizzes: () => {
    return apiClient.get('/quizzes')
  }
}

export default apiClient
