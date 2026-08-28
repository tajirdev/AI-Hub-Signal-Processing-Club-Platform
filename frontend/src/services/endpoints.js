import { api } from './api';

export const fetchStats = async () => {
  try {
    const [membersRes, subgroupsRes, researchRes, projectsRes] = await Promise.all([
      api.get('/member/', { params: { limit: 1 } }).catch(() => ({ data: { total: 0 } })),
      api.get('/sub_groups/').catch(() => ({ data: [] })),
      api.get('/research/', { params: { limit: 100 } }).catch(() => ({ data: [] })),
      api.get('/projects/', { params: { limit: 1 } }).catch(() => ({ data: { total_projects: 0 } }))
    ]);

    return {
      members: membersRes.data?.total || 0,
      subgroups: Array.isArray(subgroupsRes.data) ? subgroupsRes.data.length : 0,
      research: Array.isArray(researchRes.data) ? researchRes.data.length : 0,
      projects: projectsRes.data?.total_projects || 0,
    };
  } catch (error) {
    console.error("Failed to fetch stats from API:", error);
    return { members: 0, subgroups: 0, research: 0, projects: 0 };
  }
};

export const fetchSubgroups = async () => {
  const res = await api.get('/sub_groups');
  return res.data;
};

export const fetchProjects = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/projects', { params });
  return res.data;
};

export const fetchEvents = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/events', { params });
  return res.data;
};

export const fetchBlogPosts = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/blog-posts', { params });
  return res.data;
};

export const fetchResearch = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/research', { params });
  return res.data;
};

// Auth Endpoints
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const res = await api.post('/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const submitApplication = async (data) => {
  const res = await api.post('/application/', data);
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await api.post('/password-reset/request', { email });
  return res.data;
};

export const confirmPasswordReset = async (email, otp_code, new_password) => {
  const res = await api.post('/password-reset/confirm', { email, otp_code, new_password });
  return res.data;
};

export const submitOnboarding = async (data) => {
  const res = await api.post('/application/onboarding', data);
  return res.data;
};

export const submitContact = async (data) => {
  const res = await api.post('/contact/', data);
  return res.data;
};

export const subscribeNewsletter = async (email) => {
  const res = await api.post('/newsletter/subscribe', { email });
  return res.data;
};

export const getNewsletterSubscribers = async () => {
  const res = await api.get('/newsletter/');
  return res.data;
};

export const fetchProjectById = async (id) => {
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
export const fetchResearchById = async (id) => {
  const res = await api.get(`/research/${id}`);
  return res.data;
};

export const fetchResources = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/resources', { params });
  return res.data;
};

export const fetchResourceById = async (id) => {
  const res = await api.get(`/resources/${id}`);
  return res.data;
};

export const fetchEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const fetchBlogPostById = async (id) => {
  const res = await api.get(`/blog-posts/${id}`);
  return res.data;
};

export const fetchNews = async (params = { limit: 10, page: 1 }) => {
  const res = await api.get('/News', { params });
  return res.data;
};

export const fetchNewsById = async (id) => {
  const res = await api.get(`/News/${id}`);
  return res.data;
};

export const fetchMemberById = async (id) => {
  const res = await api.get(`/member/${id}`);
  return res.data;
};

export const updateUserMe = async (data) => {
  const res = await api.put('/users/me', data);
  return res.data;
};

export const updateMemberMe = async (data) => {
  const res = await api.patch('/member/me', data);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

// Dynamic CRUD Endpoints
export const createContent = async (type, data) => {
  const res = await api.post(`/${type}`, data);
  return res.data;
};

export const updateContent = async (type, id, data) => {
  try {
    const res = await api.put(`/${type}/me/${id}`, data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const resFallback = await api.put(`/${type}/${id}`, data);
      return resFallback.data;
    }
    throw err;
  }
};

export const deleteContent = async (type, id) => {
  try {
    const res = await api.delete(`/${type}/me/${id}`);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const resFallback = await api.delete(`/${type}/${id}`);
      return resFallback.data;
    }
    throw err;
  }
};


export const getCategories = async () => {
  const res = await api.get('/category');
  return res.data;
};

export const uploadContentMedia = async (type, id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  let endpoint = `/${type}/${id}/cover`;
  if (type === 'research') endpoint = `/${type}/${id}/file`;
  if (type === 'resources') endpoint = `/${type}/${id}/file`;
  if (type === 'blog-posts') endpoint = `/${type}/${id}`; // Backend specific
  
  const res = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getSubgroups = async () => {
  const res = await api.get('/sub_groups');
  return res.data;
};
