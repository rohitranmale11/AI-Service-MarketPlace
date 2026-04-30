import api from './api';

export const notificationApi = {
  create: (payload) => api.post('/notifications', payload),
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};
