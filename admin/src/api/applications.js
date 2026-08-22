import client from './client';

export const applicationsAPI = {
  getAll: async () => {
    const response = await client.get('/application/');
    return response.data;
  },
  getById: async (id) => {
    const response = await client.get('/application/' + id);
    return response.data;
  },
  review: async (id, status) => {
    const response = await client.put('/application/' + id, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await client.delete('/application/' + id);
    return response.data;
  },
};
