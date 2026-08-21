import client from './client';

export const membersAPI = {
  getAll: async (params = {}) => {
    const response = await client.get('/member', { params });
    return response.data;
  },

  getById: async (memberId) => {
    const response = await client.get(`/member/${memberId}`);
    return response.data;
  },

  create: async (subgroupId, data) => {
    const response = await client.post(`/member/${subgroupId}`, data);
    return response.data;
  },

  update: async (memberId, subgroupId, data) => {
    const response = await client.put(`/member/${memberId}?sub_group_id=${subgroupId}`, data);
    return response.data;
  },

  delete: async (memberId) => {
    const response = await client.delete(`/member/${memberId}`);
    return response.data;
  },
};
