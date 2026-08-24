import client from './client';

export const usersAPI = {
  getAll: async () => {
    const response = await client.get('/users/all');
    return response.data;
  },

  register: async (userData) => {
    const response = await client.post('/users/registration', userData);
    return response.data;
  },

  updateMe: async (userData) => {
    const response = await client.put('/users/me', userData);
    return response.data;
  },

  getAvatar: async () => {
    const response = await client.get('/users/avatar');
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAvatar: async (avatarId) => {
    const response = await client.delete(`/users/avatar/${avatarId}`);
    return response.data;
  },

  promote: async (userId, roleName) => {
    const response = await client.post('/users/promote', { user_id: userId, role_name: roleName });
    return response.data;
  },

  demote: async (userId, roleName) => {
    const response = await client.post('/users/demote', { user_id: userId, role_name: roleName });
    return response.data;
  },

  toggleActive: async (userId) => {
    const response = await client.post(`/users/${userId}/toggle-active`);
    return response.data;
  },

  delete: async (userId) => {
    const response = await client.delete(`/users/${userId}`);
    return response.data;
  },
};
