import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { competitionService } from '../services/competitionService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import QuizList from '../components/QuizList';
import CompetitionRanking from '../components/CompetitionRanking';

export default function CompetitionPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    competitionService.getById(id)
      .then(res => setCompetition(res.data))
      .catch(err => setError('No se pudo cargar la competencia.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader className="h-64" size={12} />;
  if (error) return <ErrorMessage message={error} />;
  if (!competition) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[80vh]">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 dark:text-blue-300 text-sm underline">← Volver</button>
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{competition.title}</h1>
      <div className="mb-4 text-gray-700 dark:text-gray-200 whitespace-pre-line">{competition.description || <span className="italic text-gray-400">Sin descripción</span>}</div>
      <QuizList quizzes={competition.quizzes || []} />
      <div className="mt-8">
        <CompetitionRanking participants={competition.participants || []} />
      </div>
    </div>
  );
}
