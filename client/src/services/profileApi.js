import api from './api';

export const profileApi = {
  getMe: () => api.get('/users/me'),
  update: (payload) => api.put('/users/update', payload),
  getUser: (id) => api.get(`/users/${id}`),
};

export const reviewApi = {
  create: (payload) => api.post('/reviews', payload),
  getProviderReviews: (providerId) => api.get(`/reviews/${providerId}`),
};
