import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faIdCard,
  faLayerGroup,
  faBlog,
  faTags,
  faBullhorn,
  faCalendarAlt,
  faLaptopCode,
  faFlask,
  faFolderOpen,
  faSpinner,
  faPlus,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { Routes } from '../routes';

// API Clients
import { usersAPI } from '../api/users';
import { membersAPI } from '../api/members';
import { subgroupsAPI } from '../api/subgroups';
import { blogAPI } from '../api/blog';
import { newsAPI } from '../api/news';
import { eventsAPI } from '../api/events';
import { projectsAPI } from '../api/projects';
import { researchAPI } from '../api/research';
import { resourcesAPI } from '../api/resources';
import { applicationsAPI } from '../api/applications';

const StatCard = ({ title, value, icon, color, subtext, link }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</h3>
        <p className={`text-3xl font-black text-${color}-600`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
    </div>
    {link ? (
      <Link to={link} className="text-xs font-semibold text-gray-600 hover:text-blue-600 inline-flex items-center space-x-1 mt-2">
        <span>View Details</span>
      </Link>
    ) : (
      <p className="text-[11px] text-gray-400 font-medium">{subtext}</p>
    )}
  </div>
);

const QuickActionCard = ({ title, description, icon, link }) => (
  <Link
    to={link}
    className="block p-5 bg-white border border-gray-100 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors mb-4">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
    <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
  </Link>
);

export default function Overview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    members: 0,
    subgroups: 0,
    posts: 0,
    news: 0,
    events: 0,
    projects: 0,
    research: 0,
    resources: 0,
    applications: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const [
          usersRes,
          membersRes,
          subgroupsRes,
          blogRes,
          newsRes,
          eventsRes,
          projectsRes,
          researchRes,
          resourcesRes,
          appsRes
        ] = await Promise.allSettled([
          usersAPI.getAll(),
          membersAPI.getAll(),
          subgroupsAPI.getAll(),
          blogAPI.getAll(),
          newsAPI.getAll(),
          eventsAPI.getAll(),
          projectsAPI.getAll(),
          researchAPI.getAll(),
          resourcesAPI.getAll(),
          applicationsAPI.getAll(),
        ]);

        setStats({
          users: usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value) ? usersRes.value.length : usersRes.value?.total || 0) : 0,
          members: membersRes.status === 'fulfilled' ? (Array.isArray(membersRes.value) ? membersRes.value.length : membersRes.value?.total || 0) : 0,
          subgroups: subgroupsRes.status === 'fulfilled' ? (Array.isArray(subgroupsRes.value) ? subgroupsRes.value.length : 0) : 0,
          posts: blogRes.status === 'fulfilled' ? (blogRes.value?.total || (Array.isArray(blogRes.value?.posts) ? blogRes.value.posts.length : 0)) : 0,
          news: newsRes.status === 'fulfilled' ? (newsRes.value?.total || (Array.isArray(newsRes.value?.news) ? newsRes.value.news.length : 0)) : 0,
          events: eventsRes.status === 'fulfilled' ? (eventsRes.value?.total || (Array.isArray(eventsRes.value?.events) ? eventsRes.value.events.length : 0)) : 0,
          projects: projectsRes.status === 'fulfilled' ? (projectsRes.value?.total || (Array.isArray(projectsRes.value?.projects) ? projectsRes.value.projects.length : 0)) : 0,
          research: researchRes.status === 'fulfilled' ? (researchRes.value?.total || (Array.isArray(researchRes.value?.research) ? researchRes.value.research.length : 0)) : 0,
          resources: resourcesRes.status === 'fulfilled' ? (resourcesRes.value?.total || (Array.isArray(resourcesRes.value?.resources) ? resourcesRes.value.resources.length : 0)) : 0,
          applications: appsRes.status === 'fulfilled' ? (Array.isArray(appsRes.value) ? appsRes.value.filter(a => a.status === 'pending').length : 0) : 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs font-semibold">
            <span>Signal Processing & AI Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.first_name || 'Super Admin'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Manage members, editorial publications, specialized AI subgroups, research papers, and platform resources in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to={Routes.Applications.path}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/30 transition-all"
          >
            <FontAwesomeIcon icon={faClipboardList} className="text-xs" />
            <span>Applications ({stats.applications})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Platform Analytics</h2>
          {loading && (
            <div className="flex items-center space-x-1.5 text-xs text-blue-600">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Pending Apps"
            value={stats.applications}
            icon={faClipboardList}
            color="emerald"
            subtext="Awaiting review"
            link={Routes.Applications.path}
          />
          <StatCard
            title="Registered Users"
            value={stats.users}
            icon={faUsers}
            color="blue"
            subtext="Platform accounts"
            link={Routes.Users.path}
          />
          <StatCard
            title="Club Members"
            value={stats.members}
            icon={faIdCard}
            color="amber"
            subtext="Active members directory"
            link={Routes.Members.path}
          />
          <StatCard
            title="AI Subgroups"
            value={stats.subgroups}
            icon={faLayerGroup}
            color="purple"
            subtext="Specialized study groups"
            link={Routes.Subgroups.path}
          />
          <StatCard
            title="Editorial Blog Posts"
            value={stats.posts}
            icon={faBlog}
            color="emerald"
            subtext="Articles & tutorials"
            link={Routes.BlogPosts.path}
          />
          <StatCard
            title="Club Events"
            value={stats.events}
            icon={faCalendarAlt}
            color="indigo"
            subtext="Workshops & meetups"
            link={Routes.Events.path}
          />
          <StatCard
            title="Projects Showcase"
            value={stats.projects}
            icon={faLaptopCode}
            color="blue"
            subtext="Student & faculty projects"
            link={Routes.Projects.path}
          />
          <StatCard
            title="Research Papers"
            value={stats.research}
            icon={faFlask}
            color="purple"
            subtext="Academic publications"
            link={Routes.Research.path}
          />
          <StatCard
            title="Learning Resources"
            value={stats.resources}
            icon={faFolderOpen}
            color="amber"
            subtext="Datasets, PDFs & code"
            link={Routes.Resources.path}
          />
        </div>
      </div>
    </div>
  );
}
