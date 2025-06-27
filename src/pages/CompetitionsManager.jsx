import React, { useState, useEffect } from 'react'
import { competitionService } from '../services/competitionService'
import CompetitionForm from '../components/CompetitionForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CompetitionsManager() {
  const [competitions, setCompetitions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const fetchCompetitions = async () => {
    setLoading(true)
    try {
      const res = await competitionService.getAll()
      setCompetitions(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompetitions()
  }, [])

  const handleAdd = () => {
    setEditingCompetition(null)
    setShowForm(false)
    setTimeout(() => setShowForm(true), 0)
  }

  const handleEdit = (competition) => {
    setEditingCompetition(competition)
    setShowForm(false)
    setTimeout(() => setShowForm(true), 0)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCompetition(null)
  }

  const handleSubmit = async (data) => {
    setFormLoading(true)
    try {
      if (editingCompetition) {
        await competitionService.update(editingCompetition.id, data)
      } else {
        await competitionService.create(data)
      }
      await fetchCompetitions()
      setShowForm(false)
      setEditingCompetition(null)
    } finally {
      setFormLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return '-';
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Competencias</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          + Agregar competencia
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-900">
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">ID</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Título</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Descripción</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Estado</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Quizzes</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Fechas</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Costos</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {competitions.length === 0 && (
                <tr><td colSpan={8} className="text-center text-gray-500 dark:text-gray-300 py-4">No hay competencias.</td></tr>
              )}
              {competitions.map(comp => (
                <tr key={comp.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-2 py-2 text-gray-900 dark:text-white">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">{comp.id}</span>
                  </td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white font-semibold">{comp.title}</td>
                  <td className="px-2 py-2 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={comp.description}>{comp.description || <span className='italic text-gray-400'>Sin descripción</span>}</td>
                  <td className="px-2 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold border 
                      ${comp.state === 'preparacion' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700' : ''}
                      ${comp.state === 'lista' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' : ''}
                      ${comp.state === 'en curso' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' : ''}
                      ${comp.state === 'cerrada' ? 'bg-gray-200 text-gray-700 border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500' : ''}
                      ${comp.state === 'finalizada' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700' : ''}
                    `}>
                      {comp.state}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="inline-block text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-1">
                      {Array.isArray(comp.quizzes) ? comp.quizzes.length : 0}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span><b>Inicio:</b> {formatDate(comp.start_date)}</span>
                      <span><b>Fin:</b> {formatDate(comp.end_date)}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs">Moneda: <b>{comp.currency_cost ?? 0}</b></span>
                      <span className="text-xs">Tickets: <b>{comp.ticket_cost ?? 0}</b></span>
                      <span className="text-xs">Créditos: <b>{comp.credit_cost ?? 0}</b></span>
                    </div>
                  </td>
                  <td className="px-2 py-2 flex gap-2">
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleEdit(comp)}
                    >Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <CompetitionForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingCompetition}
        loading={formLoading}
      />
    </div>
  )
}
