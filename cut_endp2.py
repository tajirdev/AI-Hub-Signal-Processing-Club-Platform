import os

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('export const fetchProjectById')
if idx != -1:
    text = text[:idx]

text += '''export const fetchProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const fetchSubgroupBySlug = async (slug) => {
  const res = await api.get(`/sub_groups/slug/${slug}`);
  return res.data;
};

export const fetchMembers = async (params = {}) => {
  const res = await api.get('/member', { params });
  return res.data;
};
'''
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
