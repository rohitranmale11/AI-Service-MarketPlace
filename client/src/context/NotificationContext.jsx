import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { notificationApi } from '../services/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    setLoading(true);

    try {
      const { data } = await notificationApi.getAll();
      setNotifications(data.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, token]);

  const markAsRead = useCallback(async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((items) => items.map((item) => (
      item._id === id ? { ...item, isRead: true } : item
    )));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
  }, []);

  const value = useMemo(() => ({
    notifications,
    loading,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }), [fetchNotifications, loading, markAllAsRead, markAsRead, notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
