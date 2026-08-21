import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faIdCard,
  faLayerGroup,
  faBlog,
  faBullhorn,
  faCalendarAlt,
  faLaptopCode,
  faFlask,
  faFolderOpen,
  faPlus,
  faArrowRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { StatCard, QuickActionCard } from '../components/Widgets';
import { Routes } from '../routes';
import { usersAPI } from '../api/users';
import { membersAPI } from '../api/members';
import { subgroupsAPI } from '../api/subgroups';
import { blogAPI } from '../api/blog';
import { newsAPI } from '../api/news';
import { eventsAPI } from '../api/events';
import { projectsAPI } from '../api/projects';
import { researchAPI } from '../api/research';
import { resourcesAPI } from '../api/resources';
import { useAuth } from '../context/AuthContext';

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
            <span>MUST Signal Processing & AI Hub</span>
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
            to={Routes.BlogPosts.path}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/30 transition-all"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>New Blog Post</span>
          </Link>
          <Link
            to={Routes.Members.path}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-sm transition-all border border-white/10"
          >
            <FontAwesomeIcon icon={faIdCard} className="text-xs" />
            <span>Add Member</span>
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
            title="News & Updates"
            value={stats.news}
            icon={faBullhorn}
            color="rose"
            subtext="Official announcements"
            link={Routes.News.path}
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

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Quick Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="User Directory"
            description="Manage user account activation status and inspect role privileges."
            icon={faUsers}
            link={Routes.Users.path}
          />
          <QuickActionCard
            title="AI Subgroups"
            description="Create specialized club groups, assign leaders and upload branding."
            icon={faLayerGroup}
            link={Routes.Subgroups.path}
          />
          <QuickActionCard
            title="Event Schedules"
            description="Publish upcoming hackathons, AI workshops and registration links."
            icon={faCalendarAlt}
            link={Routes.Events.path}
          />
          <QuickActionCard
            title="Research Papers"
            description="Publish club scientific papers, associate member authors and PDF links."
            icon={faFlask}
            link={Routes.Research.path}
          />
        </div>
      </div>
    </div>
  );
}
