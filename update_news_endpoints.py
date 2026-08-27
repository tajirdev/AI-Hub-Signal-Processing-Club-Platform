import os

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text += """
export const fetchNews = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/News', { params });
  return res.data;
};

export const fetchNewsById = async (id) => {
  const res = await api.get(`/News/${id}`);
  return res.data;
};
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

