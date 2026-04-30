import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'ai-service-marketplace-auth';

const getInitialAuth = () => {
  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return savedAuth ? JSON.parse(savedAuth) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const getAvatar = (name = '') => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || 'AM';
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persistAuth = (nextAuth) => {
    setAuth(nextAuth);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const clearAuth = useCallback(() => {
    setAuth({ user: null, token: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const normalizeUser = (user) => ({
    ...user,
    avatar: user.avatar || getAvatar(user.name),
  });

  const getErrorMessage = (requestError) => (
    requestError.response?.data?.message || requestError.message || 'Something went wrong'
  );

  const value = useMemo(() => ({
    user: auth.user,
    token: auth.token,
    loading,
    error,
    isAuthenticated: Boolean(auth.user && auth.token),
    login: async (credentials) => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.post('/api/auth/login', credentials);
        const nextUser = normalizeUser(data.user);

        persistAuth({
          user: nextUser,
          token: data.token,
        });

        return nextUser;
      } catch (requestError) {
        const message = getErrorMessage(requestError);
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    register: async (payload) => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.post('/api/auth/signup', payload);
        return data;
      } catch (requestError) {
        const message = getErrorMessage(requestError);
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    logout: clearAuth,
    refreshUser: async () => {
      if (!auth.token) return null;

      setLoading(true);

      try {
        const { data } = await api.get('/api/auth/me');
        const nextUser = normalizeUser(data.user);
        persistAuth({ ...auth, user: nextUser });
        return nextUser;
      } catch {
        clearAuth();
        return null;
      } finally {
        setLoading(false);
      }
    },
    updateProfile: (profile) => {
      const nextAuth = {
        ...auth,
        user: {
          ...auth.user,
          ...profile,
          avatar: profile.name ? getAvatar(profile.name) : auth.user?.avatar,
          profileImage: profile.profileImage ?? auth.user?.profileImage,
        },
      };

      persistAuth(nextAuth);
    },
    clearError: () => setError(''),
  }), [auth, clearAuth, error, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
