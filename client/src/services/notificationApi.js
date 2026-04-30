import api from './api';

export const notificationApi = {
  create: (payload) => api.post('/api/notifications', payload),
  getAll: () => api.get('/api/notifications'),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/api/notifications/read-all'),
};
