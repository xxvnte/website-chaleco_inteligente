import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config.json";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const token = localStorage.getItem("token");
    return savedAuth === "true" && token !== null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });
  const navigate = useNavigate();

  const login = (id, userToken = null) => {
    setIsAuthenticated(true);
    setUserId(id);
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("userId", id);

    if (userToken) {
      setToken(userToken);
      localStorage.setItem("token", userToken);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${config.api.url}/logout`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setIsAuthenticated(false);
      setUserId(null);
      setToken(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error en la solicitud de cierre de sesión:", error);
      setIsAuthenticated(false);
      setUserId(null);
      setToken(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        token,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
