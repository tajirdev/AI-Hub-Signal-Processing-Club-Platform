import client from './client';

export const newsAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/News/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/News/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/News', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/News/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/News/${id}`);
    return response.data;
  },
};
