import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

new_endpoint = """export const subscribeNewsletter = async (email) => {
  const res = await api.post('/newsletter/subscribe', { email });
  return res.data;
};

export const getNewsletterSubscribers = async () => {
  const res = await api.get('/newsletter/');
  return res.data;
};"""

text = text.replace("""export const subscribeNewsletter = async (email) => {
  const res = await api.post('/newsletter/subscribe', { email });
  return res.data;
};""", new_endpoint)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

