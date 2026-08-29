import client from './client';

export const resourcesAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/resources/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/resources/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/resources/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/resources/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/resources/${id}`);
    return response.data;
  },

  uploadFile: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post(`/resources/${id}/file`, formData);
    return response.data;
  },

  deleteFile: async (id) => {
    const response = await client.delete(`/resources/${id}/file`);
    return response.data;
  },
};
