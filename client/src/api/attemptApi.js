import api from "./axios";

export const getAttemptApi = (attemptId) => {
  return api.get(`/attempts/${attemptId}`);
};

export const saveAnswerApi = (attemptId, payload) => {
  return api.patch(`/attempts/${attemptId}/answer`, payload);
};

export const submitAttemptApi = (attemptId) => {
  return api.post(`/attempts/${attemptId}/submit`);
};

export const getAttemptResultApi = (attemptId) => {
  return api.get(`/attempts/${attemptId}/result`);
};

export const getUserDashboardApi = () => {
  return api.get("/attempts/user/dashboard");
};

export const getUserAttemptsApi = () => {
  return api.get("/attempts/user");
};