import os

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'a', encoding='utf-8') as file:
    file.write('''
export const fetchProjectById = async (id) => {
  const res = await api.get(/projects/);
  return res.data;
};

export const fetchSubgroupBySlug = async (slug) => {
  const res = await api.get(/sub_groups/slug/);
  return res.data;
};

export const fetchMembers = async (params = {}) => {
  const res = await api.get('/member', { params });
  return res.data;
};
''')
