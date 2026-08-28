import api from './client';

export const newsletterApi = {
  // Get all subscribers (Admin only)
  getAll: async () => {
    const response = await api.get('/newsletter/');
    return response.data;
  }
};
