import React, { useState, useEffect } from 'react'
import { competitionService } from '../services/competitionService'
import CompetitionForm from '../components/CompetitionForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function CompetitionsManager() {
  const [competitions, setCompetitions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [detail, setDetail] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editQuizRowId, setEditQuizRowId] = useState(null);
  const [editQuizData, setEditQuizData] = useState({});
  const [savingQuiz, setSavingQuiz] = useState(false);

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

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setLoadingDetail(true);
    setTimeout(async () => {
      try {
        const res = await competitionService.getById(id);
        setDetail(prev => ({ ...prev, [id]: res.data }));
      } finally {
        setLoadingDetail(false);
      }
    }, 150); // Pequeño delay para animación
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return '-';
    }
  }

  const handleEditQuizRow = (quiz) => {
    setEditQuizRowId(quiz.id || quiz.quiz_id);
    setEditQuizData({
      time_limit: quiz.time_limit || '',
      start_time: quiz.start_time ? quiz.start_time.slice(0,16) : '',
      end_time: quiz.end_time ? quiz.end_time.slice(0,16) : '',
    });
  };

  const handleQuizInputChange = (field, value) => {
    setEditQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveQuizRow = async (quiz, compId) => {
    setSavingQuiz(true);
    try {
      await competitionService.updateCompetitionQuiz(quiz.id || quiz.quiz_id, {
        time_limit: Number(editQuizData.time_limit),
        start_time: editQuizData.start_time,
        end_time: editQuizData.end_time,
      });
      // Recarga el detalle de la competencia
      const res = await competitionService.getById(compId);
      setDetail(prev => ({ ...prev, [compId]: res.data }));
      setEditQuizRowId(null);
    } finally {
      setSavingQuiz(false);
    }
  };

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
                {/* <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Descripción</th> */}
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Estado</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Datos</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Fechas</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Costos</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {competitions.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-500 dark:text-gray-300 py-4">No hay competencias.</td></tr>
              )}
              {competitions.map(comp => (
                <React.Fragment key={comp.id}>
                  <tr
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group ${expandedId === comp.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    onClick={() => handleExpand(comp.id)}
                  >
                    <td className="px-2 py-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">{comp.id}</span>
                      <span className={`transition-transform duration-200 ${expandedId === comp.id ? 'rotate-180' : ''}`}>
                        {expandedId === comp.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-gray-900 dark:text-white font-semibold">{comp.title}</td>
                    {/* <td className="px-2 py-2 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={comp.description}>{comp.description || <span className='italic text-gray-400'>Sin descripción</span>}</td> */}
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
                      <span className="inline-block text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-1 mr-1">
                        {Array.isArray(comp.quizzes) ? comp.quizzes.length : 0} quizzes
                      </span>
                      {/* Participantes con barra de progreso si hay límite */}
                      {comp.participant_limit > 0 ? (
                        <span className="inline-block text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded px-2 py-1 relative min-w-[70px]">
                          <span className="relative z-10">
                            {Array.isArray(comp.participants) ? comp.participants.length : 0} / {comp.participant_limit} inscriptos
                          </span>
                          <span className="absolute left-0 top-0 h-full rounded bg-green-400/30 dark:bg-green-600/30 z-0 transition-all duration-300" style={{ width: `${Math.min(100, Math.round((Array.isArray(comp.participants) ? comp.participants.length : 0) / comp.participant_limit * 100))}%` }}></span>
                        </span>
                      ) : (
                        <span className="inline-block text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded px-2 py-1">
                          {Array.isArray(comp.participants) ? comp.participants.length : 0} inscriptos
                        </span>
                      )}
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
                        onClick={e => { e.stopPropagation(); handleEdit(comp) }}
                      >Editar</button>
                    </td>
                  </tr>
                  {expandedId === comp.id && (
                    <tr>
                      <td colSpan={7} className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 animate-fade-in">
                        <div className="p-4 transition-all duration-300 ease-in-out">
                          {loadingDetail ? (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500 mb-2"></div>
                              <span className="text-gray-500">Cargando detalle...</span>
                            </div>
                          ) : (
                            <React.Fragment>
                              {/* Countdown visual */}
                              <CountdownBlock start={detail[comp.id]?.start_date} end={detail[comp.id]?.end_date} />
                              {/* Descripción */}
                              <div className="mb-4">
                                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Descripción</div>
                                <div className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{detail[comp.id]?.description || <span className='italic text-gray-400 dark:text-gray-400'>Sin descripción</span>}</div>
                              </div>
                              {/* Quizzes tabla mejorada */}
                              <div className="mb-2">
                                <div className="overflow-x-auto mt-2">
                                  <table className="min-w-[400px] text-xs border border-gray-200 dark:border-gray-700 rounded">
                                    <thead>
                                      <tr>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Título</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Categoría</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Estado</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Status</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Preguntas</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Tiempo</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Inicio</th>
                                        <th className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-left font-semibold">Fin</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.isArray(detail[comp.id]?.quizzes) && detail[comp.id].quizzes.length > 0 ? (
                                        detail[comp.id].quizzes.map((qz, idx) => (
                                          <tr key={qz.id || qz.quiz_id || idx} className="border-t border-gray-100 dark:border-gray-800">
                                            <td className="px-2 py-1 text-gray-900 dark:text-gray-100 font-semibold">{qz.title}</td>
                                            <td className="px-2 py-1 text-gray-700 dark:text-gray-200">{qz.category_name || '-'}</td>
                                            <td className="px-2 py-1">
                                              <span className={`px-2 py-0.5 rounded text-xs font-bold border 
                                                ${qz.state === 'preparacion' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700' : ''}
                                                ${qz.state === 'lista' || qz.state === 'listo' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' : ''}
                                                ${qz.state === 'en curso' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' : ''}
                                                ${qz.state === 'cerrada' ? 'bg-gray-200 text-gray-700 border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500' : ''}
                                                ${qz.state === 'finalizada' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700' : ''}
                                              `}>{qz.state}</span>
                                            </td>
                                            <td className="px-2 py-1">
                                              <span className={`px-2 py-0.5 rounded text-xs font-bold border
                                                ${qz.status === 'ACTIVO' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' : ''}
                                                ${qz.status === 'COMPUTABLE' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' : ''}
                                                ${qz.status === 'NO_COMPUTABLE' ? 'bg-gray-200 text-gray-700 border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500' : ''}
                                              `}>{qz.status}</span>
                                            </td>
                                            <td className="px-2 py-1 text-center text-gray-900 dark:text-white">{qz.questions_count ?? (Array.isArray(qz.questions) ? qz.questions.length : 0)}</td>
                                            <td className="px-2 py-1 text-center text-gray-900 dark:text-white">
                                              {editQuizRowId === (qz.id || qz.quiz_id) ? (
                                                <input
                                                  type="number"
                                                  min="0"
                                                  value={editQuizData.time_limit}
                                                  onChange={e => handleQuizInputChange('time_limit', e.target.value)}
                                                  className="w-16 px-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                />
                                              ) : (
                                                qz.time_limit ? `${Math.floor(qz.time_limit/60)}m ${qz.time_limit%60}s` : '-'
                                              )}
                                            </td>
                                            <td className="px-2 py-1 text-gray-500 dark:text-gray-200">
                                              {editQuizRowId === (qz.id || qz.quiz_id) ? (
                                                <input
                                                  type="datetime-local"
                                                  value={editQuizData.start_time}
                                                  onChange={e => handleQuizInputChange('start_time', e.target.value)}
                                                  className="w-40 px-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                />
                                              ) : (
                                                qz.start_time ? formatDate(qz.start_time) : '-'
                                              )}
                                            </td>
                                            <td className="px-2 py-1 text-gray-500 dark:text-gray-200">
                                              {editQuizRowId === (qz.id || qz.quiz_id) ? (
                                                <input
                                                  type="datetime-local"
                                                  value={editQuizData.end_time}
                                                  onChange={e => handleQuizInputChange('end_time', e.target.value)}
                                                  className="w-40 px-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                />
                                              ) : (
                                                qz.end_time ? formatDate(qz.end_time) : '-'
                                              )}
                                            </td>
                                            <td className="px-2 py-1">
                                              {editQuizRowId === (qz.id || qz.quiz_id) ? (
                                                <>
                                                  <button
                                                    onClick={() => handleSaveQuizRow(qz, comp.id)}
                                                    className="px-2 py-1 bg-green-600 text-white rounded mr-2"
                                                    disabled={savingQuiz}
                                                  >Guardar</button>
                                                  <button
                                                    onClick={() => setEditQuizRowId(null)}
                                                    className="px-2 py-1 bg-gray-400 text-white rounded"
                                                    disabled={savingQuiz}
                                                  >Cancelar</button>
                                                </>
                                              ) : (
                                                <button
                                                  onClick={() => handleEditQuizRow(qz)}
                                                  className="px-2 py-1 bg-blue-600 text-white rounded"
                                                >Editar</button>
                                              )}
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr><td colSpan={8} className="italic text-gray-400 dark:text-gray-400 ml-4">Sin quizzes</td></tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              {/* Inscriptos tabla */}
                              <div className="mb-2">
                                <div className="overflow-x-auto mt-2">
                                  <table className="min-w-[220px] text-xs border border-gray-200 dark:border-gray-700 rounded">
                                    <thead>
                                      <tr>
                                        <th colSpan={2} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 text-left font-semibold">Inscriptos</th>
                                      </tr>
                                      <tr className="bg-gray-100 dark:bg-gray-800">
                                        <th className="px-2 py-1 text-left text-gray-700 dark:text-white">Usuario</th>
                                        <th className="px-2 py-1 text-left text-gray-700 dark:text-white">Score</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.isArray(detail[comp.id]?.participants) && detail[comp.id].participants.length > 0 ? (
                                        detail[comp.id].participants.map((p, idx) => (
                                          <tr key={p.participant_id || p.id || idx} className="border-t border-gray-100 dark:border-gray-800">
                                            <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{p.username || p.email || p.participant_id}</td>
                                            <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{typeof p.score === 'number' ? p.score : '-'}</td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr><td colSpan={2} className="italic text-gray-400 dark:text-gray-400 ml-4">Sin inscriptos</td></tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              {/* Creada/modificada por (un solo recuadro, modif arriba si existe) */}
                              <div className="mt-4">
                                <div className="bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded px-3 py-2 text-xs text-blue-900 dark:text-blue-200 flex flex-col gap-1">
                                  {detail[comp.id]?.modified_by && (
                                    <div className="flex flex-row items-center gap-2">
                                      <span className="font-semibold">Modificada por:</span>
                                      <span>{detail[comp.id].modified_by.username}</span>
                                      {detail[comp.id].modified_by.date && (
                                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">{formatDate(detail[comp.id].modified_by.date)}</span>
                                      )}
                                    </div>
                                  )}
                                  {detail[comp.id]?.created_by && (
                                    <div className="flex flex-row items-center gap-2">
                                      <span className="font-semibold">Creada por:</span>
                                      <span>{detail[comp.id].created_by.username}</span>
                                      {detail[comp.id].created_by.date && (
                                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">{formatDate(detail[comp.id].created_by.date)}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

// Animación fade-in
// Agrega en tu CSS global o tailwind.config.js:
// .animate-fade-in { animation: fadeIn 0.3s; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1, transform: none;} }

// Renderiza countdown para fechas
function renderCountdown(date, type, startDate) {
  if (!date) return null;
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  if (type === 'start' && diff > 0) {
    // Falta para que inicie
    return <span className="ml-2 text-xs text-blue-600 dark:text-blue-300">Faltan {formatDiff(diff)}</span>;
  }
  if (type === 'end') {
    if (now < target) {
      // En curso, falta para que termine
      const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
      if (months < 2) {
        return <span className="ml-2 text-xs text-red-600 dark:text-red-400">Termina en {formatDiff(target - now)}</span>;
      } else {
        return <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Falta bastante</span>;
      }
    } else {
      return <span className="ml-2 text-xs text-gray-400">Finalizada</span>;
    }
  }
  return null;
}

function formatDiff(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// CountdownBlock: componente auxiliar para countdown visual
function CountdownBlock({ start, end }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!start && !end) return null;
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  const diffToStart = startDate ? startDate - now : null;
  const diffToEnd = endDate ? endDate - now : null;
  const twoMonthsMs = 1000 * 60 * 60 * 24 * 60;
  function fmt(ms) {
    if (ms <= 0) return '0s';
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const m = Math.floor((ms / (1000 * 60)) % 60);
    const s = Math.floor((ms / 1000) % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }
  if (diffToStart && diffToStart > 0) {
    return <div className="mb-4"><span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-semibold">Faltan {fmt(diffToStart)} para comenzar</span></div>;
  }
  if (diffToEnd && diffToEnd > 0) {
    if (diffToEnd < twoMonthsMs) {
      return <div className="mb-4"><span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">Termina en {fmt(diffToEnd)}</span></div>;
    } else {
      return <div className="mb-4"><span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs font-semibold">Finaliza el {format(endDate, "dd/MM/yyyy HH:mm")}</span></div>;
    }
  }
  return <div className="mb-4"><span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs font-semibold">Finalizada</span></div>;
}
