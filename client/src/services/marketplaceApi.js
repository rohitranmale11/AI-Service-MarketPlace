import api from './api';

export const requestApi = {
  create: (payload) => api.post('/requests', payload),
  getAll: (params = {}) => api.get('/requests', { params }),
  getMine: () => api.get('/requests/user'),
  remove: (id) => api.delete(`/requests/${id}`),
};

export const applicationApi = {
  apply: (requestId) => api.post(`/apply/${requestId}`),
  getProviderApplications: () => api.get('/applications/provider'),
  getRequestApplications: (requestId) => api.get(`/applications/request/${requestId}`),
  updateStatus: (applicationId, status) => api.patch(`/applications/${applicationId}/status`, { status }),
};
