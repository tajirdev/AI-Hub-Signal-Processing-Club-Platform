import client from './client';

export const blogAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/blog-posts', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/blog-posts/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/blog-posts', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/blog-posts/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/blog-posts/${id}`);
    return response.data;
  },

  uploadCover: async (postId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post(`/blog-posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
