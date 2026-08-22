import client from './client';

export const researchAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/research/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/research/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/research/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/research/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/research/${id}`);
    return response.data;
  },

  uploadFile: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post(`/research/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteFile: async (id) => {
    const response = await client.delete(`/research/${id}/file`);
    return response.data;
  },
};
