import api from "./axios";

export const getAdminQuizzesApi = () => {
  return api.get("/admin/quizzes");
};

export const getAdminQuizByIdApi = (quizId) => {
  return api.get(`/admin/quizzes/${quizId}`);
};

export const createQuizApi = (payload) => {
  return api.post("/admin/quizzes", payload);
};

export const updateQuizApi = (quizId, payload) => {
  return api.patch(`/admin/quizzes/${quizId}`, payload);
};

export const deleteQuizApi = (quizId) => {
  return api.delete(`/admin/quizzes/${quizId}`);
};

export const updateQuizStatusApi = (quizId, status) => {
  return api.patch(`/admin/quizzes/${quizId}/status`, { status });
};

export const importQuizApi = (formData) => {
  return api.post("/import/quiz", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAdminAttemptsApi = () => {
  return api.get("/attempts/admin");
};

export const getAdminAttemptDetailApi = (attemptId) => {
  return api.get(`/attempts/admin/${attemptId}`);
};