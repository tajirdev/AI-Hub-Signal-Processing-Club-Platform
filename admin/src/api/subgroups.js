import client from './client';

export const subgroupsAPI = {
  getAll: async () => {
    const response = await client.get('/sub_groups');
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/sub_groups/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await client.post('/sub_groups', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await client.put(`/sub_groups/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/sub_groups/${id}`);
    return response.data;
  },

  uploadCover: async (subgroupId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post(`/sub_groups/${subgroupId}/cover_page`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadIcon: async (subgroupId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post(`/sub_groups/${subgroupId}/icon_page`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
