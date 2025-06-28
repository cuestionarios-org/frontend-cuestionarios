import React, { useState, useEffect } from 'react';
import QuizTimer from './QuizTimer';
import QuestionCard from './QuestionCard';

export default function QuizPlayModal({ quiz, participantId, onClose, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit || 300); // segundos
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Suponiendo que quiz.questions ya viene con las preguntas
    setQuestions(quiz.questions || []);
    setTimeLeft(quiz.time_limit || 300);
  }, [quiz]);

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const handleAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setFinished(true);
    // Aquí deberías llamar a la API para enviar las respuestas
    // await api.finishQuiz(...)
    if (onFinish) onFinish(answers);
    setSubmitting(false);
  };

  if (!quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <QuizTimer seconds={timeLeft} />
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Pregunta {current + 1} de {questions.length}</div>
        {questions.length > 0 && (
          <QuestionCard
            question={questions[current]}
            value={answers[questions[current].id]}
            onChange={val => handleAnswer(questions[current].id, val)}
          />
        )}
        <div className="flex gap-2 justify-end mt-4">
          {current < questions.length - 1 && (
            <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Siguiente</button>
          )}
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={submitting}
          >
            Enviar
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600">Cancelar</button>
        </div>
        {finished && <div className="mt-4 text-green-600 dark:text-green-400 font-semibold">¡Respuestas enviadas!</div>}
      </div>
    </div>
  );
}
