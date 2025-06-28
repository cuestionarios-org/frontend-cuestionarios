import apiClient from './api';

const quizParticipationService = {
  startQuiz: (competitionQuizId, participantId) =>
    apiClient.post(`/quiz-participation/${competitionQuizId}/participant/${participantId}/start`),
  finishQuiz: (competitionQuizId, participantId, data) =>
    apiClient.post(`/quiz-participation/${competitionQuizId}/participant/${participantId}/finish`, data),
  getUserAnswers: (competitionQuizId, participantId) =>
    apiClient.get(`/quiz-participation/${competitionQuizId}/participant/${participantId}/answers`),
  getQuizDetailByUser: (competitionQuizId, participantId) =>
    apiClient.get(`/quiz-participation/${competitionQuizId}/participant/${participantId}`),
};

export default quizParticipationService;
