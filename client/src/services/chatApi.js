import api from './api';

export const chatApi = {
  getChats: () => api.get('/chats'),
  getById: (chatId) => api.get(`/chats/${chatId}`),
  getByRequest: (requestId, providerId) => api.get(`/chats/request/${requestId}`, {
    params: providerId ? { providerId } : {},
  }),
};
