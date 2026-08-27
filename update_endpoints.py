import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

if 'export const fetchMemberById' not in text:
    text += """
export const fetchMemberById = async (id) => {
  const res = await api.get(`/member/${id}`);
  return res.data;
};
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
