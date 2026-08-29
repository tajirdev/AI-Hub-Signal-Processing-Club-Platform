import client from './client';

export const getContacts = async (skip = 0, limit = 100) => {
  const response = await client.get('/contact/', { params: { skip, limit } });
  return response.data;
};

export const getContactById = async (id) => {
  const response = await client.get(`/contact/${id}`);
  return response.data;
};

export const updateContactStatus = async (id, status) => {
  const response = await client.put(`/contact/${id}/status`, { status });
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await client.delete(`/contact/${id}`);
  return response.data;
};
