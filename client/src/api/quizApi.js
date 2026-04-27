import api from "./axios";

export const getQuizzesApi = () => {
  return api.get("/quizzes");
};

export const getQuizByIdApi = (quizId) => {
  return api.get(`/quizzes/${quizId}`);
};

export const startQuizApi = (quizId) => {
  return api.post(`/quizzes/${quizId}/start`);
};