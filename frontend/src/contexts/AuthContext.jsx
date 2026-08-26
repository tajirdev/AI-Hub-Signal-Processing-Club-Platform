import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, fetchCurrentUser } from '../services/endpoints';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // If we have a token but no user, try to fetch the user
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const userData = await fetchCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to load user session:", error);
      // If 401, token is invalid/expired
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      const { access_token } = data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      // loadUser will be triggered by the useEffect on token change
      return { success: true };
    } catch (error) {
      let message = "An error occurred during login.";
      if (error.response?.data?.detail) {
        message = error.response.data.detail;
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Setup a global response interceptor to handle 401s across the app
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          if (token) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
