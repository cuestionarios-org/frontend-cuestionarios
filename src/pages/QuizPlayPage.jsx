import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import QuizTimer from '../components/QuizTimer';
import QuestionCard from '../components/QuestionCard';
import quizParticipationService from '../services/quizParticipationService';

export default function QuizPlayPage() {
  const { id: competitionId, quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const hasStartedRef = useRef(false); // <-- bandera para evitar doble petición

  useEffect(() => {
    if (!user) return;
    if (hasStartedRef.current) return; // <-- protección
    hasStartedRef.current = true;
    setLoading(true);
    quizParticipationService.startQuiz(quizId, user.id)
      .then(res => {
        const data = res.data;
        setQuiz(data.quiz || data);
        setQuestions(data.quiz?.questions || data.questions || []);
        setTimeLeft(data.quiz?.time_limit || data.time_limit || 300);
        setQuizStarted(true);
      })
      .catch((err) => {
        let msg = 'No se pudo iniciar el quiz.';
        if (err?.response?.data?.error) {
          msg = err.response.data.error;
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [competitionId, quizId, user]);

  // Cronómetro: descuenta el tiempo cada segundo
  useEffect(() => {
    if (!quizStarted || finished) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, finished, timeLeft]);

  const handleAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setFinished(true);
    try {
      await quizParticipationService.finishQuiz(quizId, user.id, { answers });
    } catch (e) {}
    setSubmitting(false);
  };

  if (loading) return <Loader className="h-64" size={12} />;
  if (error) return <ErrorMessage message={error} />;
  if (!quiz) return <ErrorMessage message="Quiz no encontrado" />;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md min-h-[60vh]">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 dark:text-blue-300 text-sm underline">← Volver</button>
      <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{quiz.title}</h1>
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
      </div>
      {finished && <div className="mt-4 text-green-600 dark:text-green-400 font-semibold">¡Respuestas enviadas!</div>}
    </div>
  );
}
