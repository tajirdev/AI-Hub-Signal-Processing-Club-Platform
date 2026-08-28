import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

new_endpoint = """export const submitContact = async (data) => {
  const res = await api.post('/contact/', data);
  return res.data;
};

export const subscribeNewsletter = async (email) => {
  const res = await api.post('/newsletter/subscribe', { email });
  return res.data;
};"""

text = text.replace("""export const submitContact = async (data) => {
  const res = await api.post('/contact/', data);
  return res.data;
};""", new_endpoint)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

