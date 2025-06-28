import React from 'react';
import QuizCardPlay from './QuizCardPlay';

export default function QuizList({ quizzes }) {
  // Separar quizzes listos y no listos
  const ready = quizzes.filter(q => q.state === 'lista' || q.state === 'listo');
  const notReady = quizzes.filter(q => q.state !== 'lista' && q.state !== 'listo');

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Cuestionarios disponibles</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {ready.map(q => <QuizCardPlay key={q.id || q.quiz_id} quiz={q} ready />)}
        {notReady.map(q => <QuizCardPlay key={q.id || q.quiz_id} quiz={q} ready={false} />)}
      </div>
    </div>
  );
}
