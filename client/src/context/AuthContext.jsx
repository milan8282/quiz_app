import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMeApi, loginApi, logoutApi, registerApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchMe = async () => {
    try {
      const { data } = await getMeApi();
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      setBootLoading(true);
      await fetchMe();
      setBootLoading(false);
    };

    init();
  }, []);

  const login = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await loginApi(payload);
      setUser(data.user);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await registerApi(payload);
      setUser(data.user);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await logoutApi();
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      bootLoading,
      authLoading,
      login,
      register,
      logout,
      fetchMe,
    }),
    [user, bootLoading, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};