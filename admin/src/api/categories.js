import client from './client';

export const categoriesAPI = {
  getAll: async () => {
    const response = await client.get('/category');
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/category/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/category/create', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/category/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/category/${id}`);
    return response.data;
  },
};
