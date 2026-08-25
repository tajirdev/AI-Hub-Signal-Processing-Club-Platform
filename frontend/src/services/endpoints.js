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
