import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import quizParticipationService from '../services/quizParticipationService';

export default function useQuizPlayedStatus(quizzes, competitionId) {
  const { user } = useAuth();
  const [playedMap, setPlayedMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !quizzes?.length || !competitionId) {
      setPlayedMap({});
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      quizzes.map(q =>
        quizParticipationService.getQuizDetailByUser(q.id || q.quiz_id, user.id)
          .then(res => ({ id: q.id || q.quiz_id, played: !!res.data?.finished_at }))
          .catch(() => ({ id: q.id || q.quiz_id, played: false }))
      )
    ).then(results => {
      if (!cancelled) {
        const map = {};
        results.forEach(r => { map[r.id] = r.played; });
        setPlayedMap(map);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user, quizzes, competitionId]);

  return { playedMap, loading };
}
