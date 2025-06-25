import React, { useState, useEffect } from 'react'
import QuizForm from '../components/QuizForm'
import { usePublishedQuestions } from '../hooks/usePublishedQuestions'
import { useCategories } from '../hooks/useCategories'
import { questionService } from '../services/api'

export default function QuizzesManager() {
  const [quizzes, setQuizzes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [quizLoading, setQuizLoading] = useState(false)
  const categories = useCategories()
  const { questions, loading: loadingQuestions } = usePublishedQuestions()

  useEffect(() => {
    setLoading(true)
    questionService.getAllQuizzes?.()
      .then(res => setQuizzes(res.data || []))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = () => {
    setEditingQuiz(null)
    setShowForm(true)
  }

  const handleEdit = (quiz) => {
    setEditingQuiz({
      ...quiz,
      question_ids: quiz.questions?.map(q => q.id) || []
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingQuiz(null)
  }

  const handleSubmit = async (data) => {
    setQuizLoading(true)
    try {
      const quizPayload = {
        title: data.title,
        description: data.description,
        state: data.state,
        time_limit: data.time_limit,
        category_id: data.category_id
      }
      if (editingQuiz) {
        await questionService.updateQuiz(editingQuiz.id, {
          quiz: quizPayload,
          question_ids: data.question_ids
        })
      } else {
        await questionService.createQuiz({
          quiz: quizPayload,
          question_ids: data.question_ids
        })
      }
      // Refrescar listado
      const res = await questionService.getAllQuizzes?.()
      setQuizzes(res.data || [])
      setShowForm(false)
      setEditingQuiz(null)
    } finally {
      setQuizLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cuestionarios</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          + Agregar cuestionario
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-900">
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">ID</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Título</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Descripción</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Categoría</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Preguntas</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Estado</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Tiempo límite</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length === 0 && (
                <tr><td colSpan={8} className="text-center text-gray-500 dark:text-gray-300 py-4">No hay cuestionarios.</td></tr>
              )}
              {quizzes.map(quiz => (
                <tr key={quiz.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-2 py-2 text-gray-900 dark:text-white">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">{quiz.id}</span>
                  </td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{quiz.title}</td>
                  <td className="px-2 py-2 max-w-[180px] truncate text-gray-900 dark:text-white" title={quiz.description}>{quiz.description || '-'}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{quiz.category?.name || '-'}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{quiz.questions?.length || 0}</td>
                  <td className="px-2 py-2 capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${quiz.state === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        quiz.state === 'finalizado' ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' :
                        quiz.state === 'inactivo' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
                    `}>{quiz.state}</span>
                  </td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{quiz.time_limit ? quiz.time_limit + 's' : '-'}</td>
                  <td className="px-2 py-2 flex gap-2">
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleEdit(quiz)}
                    >Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <QuizForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        categories={categories}
        questions={questions}
        initialData={editingQuiz}
        loading={quizLoading}
      />
    </div>
  )
}