import api from './api';

export const chatApi = {
  getChats: () => api.get('/api/chats'),
  getById: (chatId) => api.get(`/api/chats/${chatId}`),
  getByRequest: (requestId, providerId) => api.get(`/api/chats/request/${requestId}`, {
    params: providerId ? { providerId } : {},
  }),
};
