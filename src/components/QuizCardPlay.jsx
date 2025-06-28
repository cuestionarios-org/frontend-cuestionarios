import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuizCardPlay({ quiz, ready, alreadyPlayed }) {
  const navigate = useNavigate();
  const { id: competitionId } = useParams();
  const validCompetitionId = competitionId;
  const validQuizId = quiz.id || quiz.quiz_id;

  // Si ya jugó, mostrar resumen/estadística (placeholder)
  if (alreadyPlayed) {
    return (
      <div className="rounded-lg shadow p-4 border transition bg-white dark:bg-gray-900 flex flex-col gap-2 opacity-80">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 dark:text-white text-base">{quiz.title}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 ml-2">{quiz.category_name || '-'}</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">{quiz.description || <span className="italic text-gray-400">Sin descripción</span>}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Preguntas: <b>{quiz.questions_count ?? (quiz.questions?.length || 0)}</b></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Tiempo: <b>{quiz.time_limit ? `${Math.floor(quiz.time_limit/60)}m ${quiz.time_limit%60}s` : '-'}</b></span>
        </div>
        <span className="mt-3 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded w-fit self-end cursor-default font-semibold">Ya jugado</span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow p-4 border transition bg-white dark:bg-gray-900 ${!ready ? 'opacity-50 grayscale pointer-events-none' : 'hover:shadow-lg'} flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-800 dark:text-white text-base">{quiz.title}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 ml-2">{quiz.category_name || '-'}</span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-300">{quiz.description || <span className="italic text-gray-400">Sin descripción</span>}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Preguntas: <b>{quiz.questions_count ?? (quiz.questions?.length || 0)}</b></span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Tiempo: <b>{quiz.time_limit ? `${Math.floor(quiz.time_limit/60)}m ${quiz.time_limit%60}s` : '-'}</b></span>
      </div>
      {ready && validCompetitionId && validQuizId && (
        <button
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit self-end"
          onClick={() => navigate(`/competition/${validCompetitionId}/quiz/${validQuizId}/play`)}
        >
          Jugar
        </button>
      )}
      {(!ready || !validCompetitionId || !validQuizId) && (
        <span className="mt-3 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded w-fit self-end cursor-not-allowed">No disponible {validQuizId}, {validCompetitionId}, {ready ? 'listo' : 'no listo'}</span>
      )}
    </div>
  );
}
