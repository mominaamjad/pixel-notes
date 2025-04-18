import { React, createContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data) => {
    try {
      setError(null);
      setLoading(true);
      const { token } = await authService.login(data);
      localStorage.setItem("token", token);
      return true;
    } catch (err) {
      setError(err.message || "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      setError(null);
      setLoading(true);
      const { token } = await authService.signup(data);
      localStorage.setItem("token", token);
      return true;
    } catch (err) {
      setError(err.message || "Signup failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  const value = {
    loading,
    error,
    login,
    signup,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
