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
    const sid = parseInt(subgroupId, 10);
    const response = await client.post(`/member/${sid}`, data);
    return response.data;
  },

  update: async (memberId, subgroupId, data) => {
    const mid = parseInt(memberId, 10);
    const sid = parseInt(subgroupId, 10);
    const response = await client.put(`/member/${mid}?sub_group_id=${sid}`, data);
    return response.data;
  },

  delete: async (memberId) => {
    const mid = parseInt(memberId, 10);
    const response = await client.delete(`/member/${mid}`);
    return response.data;
  },
};
