import React, { useEffect, useState } from 'react';
import { questionService } from '../services/api';

export default function QuizzesSelector({ selectedQuizzes, setSelectedQuizzes }) {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    setLoading(true);
    questionService.getAllQuizzes()
      .then(res => setQuizzes(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleQuiz = (id) => {
    setSelectedQuizzes(prev =>
      prev.includes(id)
        ? prev.filter(qid => qid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="my-4">
      <div
        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border rounded p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        onClick={() => setShowPanel(true)}
      >
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Quizzes seleccionados: {selectedQuizzes.length}
        </span>
        <button type="button" className="text-blue-600 dark:text-blue-300 text-xs underline ml-2">Ver/Editar</button>
      </div>
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Selecciona los quizzes para la competencia
              </span>
              <button type="button" className="px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded text-xs" onClick={() => setShowPanel(false)}>Volver</button>
            </div>
            <input
              type="text"
              className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Buscar por título..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {loading ? (
                <div className="text-center text-gray-500">Cargando...</div>
              ) : filtered.length === 0 ? (
                <div className="text-xs text-gray-500">No hay quizzes que coincidan.</div>
              ) : filtered.map(q => (
                <label key={q.id} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQuizzes.includes(q.id)}
                    onChange={() => toggleQuiz(q.id)}
                  />
                  <span className="text-gray-900 dark:text-white">{q.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
