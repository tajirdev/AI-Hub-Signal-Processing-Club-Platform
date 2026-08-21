import client from './client';

export const projectsAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/projects', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/projects', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/projects/${id}`);
    return response.data;
  },
};
