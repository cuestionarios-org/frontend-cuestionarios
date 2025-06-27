import { useState, useRef } from 'react'
import { useQuestions } from '../hooks/useQuestions'
import { useCategories } from '../hooks/useCategories'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import QuestionsFilters from '../components/QuestionsFilters'
import QuestionCard from '../components/QuestionCard'
import QuestionForm from '../components/QuestionForm'
import QuestionsSearch from '../components/QuestionsSearch'
import { questionService } from '../services/api'
import QuizzesManager from './QuizzesManager'
import CompetitionsManager from './CompetitionsManager'

const tabs = [
  { key: 'questions', label: 'Preguntas y Respuestas' },
  { key: 'quizzes', label: 'Cuestionarios' },
  { key: 'competitions', label: 'Competencias' }
]

const initialForm = {
  question: { text: '', category_id: '' },
  answers: Array(5).fill().map((_, i) => ({ text: '', is_correct: i === 0 }))
}

export default function AdminPage() {
  const [tab, setTab] = useState('questions')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterState, setFilterState] = useState('')
  const [searchText, setSearchText] = useState('')
  const formRef = useRef(null)

  const categories = useCategories()
  const { questions, setQuestions, loading, error } = useQuestions(tab, filterCategory, filterState, searchText)

  // Handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'answers') {
      // Manejo especial para mover/eliminar respuestas
      let newAnswers = value
      // Asegura que la primera con texto sea la correcta
      const firstFilled = newAnswers.findIndex(a => a.text && a.text.trim() !== '')
      newAnswers = newAnswers.map((a, i) => ({
        ...a,
        is_correct: i === firstFilled
      }))
      setForm(f => ({
        ...f,
        answers: newAnswers
      }))
      return
    }
    if (name.startsWith('answer')) {
      const [_, idx, field] = name.split('-')
      setForm(f => {
        const answers = [...f.answers]
        while (answers.length <= Number(idx)) {
          answers.push({ text: '', is_correct: false })
        }
        if (field === 'text') {
          answers[idx].text = value
        }
        // Solo reasigna la correcta si ninguna está marcada como correcta
        if (!answers.some(a => a.is_correct && a.text && a.text.trim() !== '')) {
          const firstFilled = answers.findIndex(a => a.text && a.text.trim() !== '')
          answers.forEach((a, i) => { a.is_correct = i === firstFilled })
        }
        return { ...f, answers }
      })
    } else {
      setForm(f => ({
        ...f,
        question: { ...f.question, [name]: value }
      }))
    }
  }

  const handleEdit = (q) => {
    setEditingId(q.question.id)
    setForm({
      question: { ...q.question },
      answers: q.answers.map(a => ({
        id: a.id,
        text: a.text,
        is_correct: a.is_correct
      }))
    })
    setShowForm(true)
  }

  const handleOpenForm = () => {
    setShowForm(true)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Filtra respuestas vacías
    const filteredAnswers = form.answers
      .filter(a => a.text && a.text.trim() !== '')

    // Crea el objeto form limpio
    const cleanForm = {
      ...form,
      answers: filteredAnswers
    }

    if (editingId) {
      await questionService.update(editingId, cleanForm)
      setQuestions(qs =>
        qs.map(q =>
          q.question.id === editingId
            ? {
                ...q,
                question: {
                  ...q.question,
                  ...cleanForm.question,
                  category_id: Number(cleanForm.question.category_id)
                },
                answers: cleanForm.answers
              }
            : q
        )
      )
    } else {
      await questionService.create(cleanForm)
      setFilterCategory('')
      setFilterState('')
      // Peticiona el listado actualizado al backend
      const res = await questionService.getAll({})
      setQuestions(res.data.sort((a, b) => b.question.id - a.question.id))
    }
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
  }

  const handleChangeStatus = async (q) => {
    let newStatus = q.question.state
    if (q.question.state === 'published') newStatus = 'deleted'
    else if (q.question.state === 'draft') newStatus = 'published'
    else return

    await questionService.update(q.question.id, {
      question: {
        text: q.question.text,
        category_id: q.question.category_id,
        state: newStatus
      },
      answers: q.answers.map(a => ({
        text: a.text,
        is_correct: a.is_correct
      }))
    })
    // Volver a pedir el listado actualizado al backend
    const res = await questionService.getAll({
      category_id: filterCategory || undefined,
      state: filterState || undefined,
      text: searchText || undefined
    })
    setQuestions(res.data.sort((a, b) => b.question.id - a.question.id))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Administración
      </h1>
      <nav className="flex space-x-6 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2 focus:outline-none ${
              tab === t.key
                ? 'border-b-2 border-blue-600 font-semibold text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div>
        {tab === 'questions' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Preguntas</h2>
            <button
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleOpenForm}
            >
              + Agregar pregunta
            </button>
            <QuestionsFilters
              categories={categories}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterState={filterState}
              setFilterState={setFilterState}
            />
            <QuestionsSearch value={searchText} onChange={setSearchText} />
            {showForm && (
              <QuestionForm
                form={form}
                categories={categories}
                formRef={formRef}
                handleFormChange={handleFormChange}
                handleSubmit={handleSubmit}
                handleCloseForm={handleCloseForm}
                editingId={editingId}
              />
            )}
            {loading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && (
              <ul className="space-y-4">
                {questions
                  .filter(q =>
                    q.question.text
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ).length === 0 ? (
                  <li className="text-gray-500">No hay preguntas registradas.</li>
                ) : (
                  questions
                    .filter(q =>
                      q.question.text
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    )
                    .map(q => (
                      <QuestionCard
                        key={q.question.id}
                        q={q}
                        categories={categories}
                        onEdit={handleEdit}
                        onChangeStatus={handleChangeStatus}
                      />
                    ))
                )}
              </ul>
            )}
          </div>
        )}
        {tab === 'quizzes' && (
          <QuizzesManager />
        )}
        {tab === 'competitions' &&(
          <CompetitionsManager />
        )}
      </div>
    </div>
  )
}