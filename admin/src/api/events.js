import client from './client';

export const eventsAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/events', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/events/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/events', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/events/${id}`);
    return response.data;
  },

  uploadCover: async (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post(`/events/${eventId}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
