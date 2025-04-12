import { React, createContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data) => {
    try {
      setError(null);
      setLoading(true);
      const { user, token } = await authService.login(data);
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (err) {
      setError(err.message || "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
