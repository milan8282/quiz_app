import api from "./axios";

export const registerApi = (payload) => {
  return api.post("/auth/register", payload);
};

export const loginApi = (payload) => {
  return api.post("/auth/login", payload);
};

export const logoutApi = () => {
  return api.post("/auth/logout");
};

export const getMeApi = () => {
  return api.get("/auth/me");
};