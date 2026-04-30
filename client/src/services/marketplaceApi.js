import api from './api';

export const requestApi = {
  create: (payload) => api.post('/api/requests', payload),
  getAll: (params = {}) => api.get('/api/requests', { params }),
  getMine: () => api.get('/api/requests/user'),
  remove: (id) => api.delete(`/api/requests/${id}`),
};

export const applicationApi = {
  apply: (requestId) => api.post(`/api/apply/${requestId}`),
  getProviderApplications: () => api.get('/api/applications/provider'),
  getRequestApplications: (requestId) => api.get(`/api/applications/request/${requestId}`),
  updateStatus: (applicationId, status) => api.patch(`/api/applications/${applicationId}/status`, { status }),
};
