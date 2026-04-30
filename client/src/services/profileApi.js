import api from './api';

export const profileApi = {
  getMe: () => api.get('/api/users/me'),
  update: (payload) => api.put('/api/users/update', payload),
  getUser: (id) => api.get(`/api/users/${id}`),
};

export const reviewApi = {
  create: (payload) => api.post('/api/reviews', payload),
  getProviderReviews: (providerId) => api.get(`/api/reviews/${providerId}`),
};
