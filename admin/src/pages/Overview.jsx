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
  faClipboardList,
  faEnvelope,
  faEnvelopeOpenText
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
import { getContacts } from '../api/contacts';
import { newsletterApi } from '../api/newsletter';

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
    applications: 0,
    contacts: 0,
    newsletter: 0
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
          appsRes,
          contactsRes,
          newsletterRes
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
          getContacts(),
          newsletterApi.getAll(),
        ]);

        setStats({
          users: usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value) ? usersRes.value.length : usersRes.value?.total || 0) : 0,
          members: membersRes.status === 'fulfilled' ? (Array.isArray(membersRes.value) ? membersRes.value.length : membersRes.value?.total || 0) : 0,
          subgroups: subgroupsRes.status === 'fulfilled' ? (Array.isArray(subgroupsRes.value) ? subgroupsRes.value.length : 0) : 0,
          posts: blogRes.status === 'fulfilled' ? (blogRes.value?.total || (Array.isArray(blogRes.value?.posts) ? blogRes.value.posts.length : 0)) : 0,
          news: newsRes.status === 'fulfilled' ? (newsRes.value?.total || (Array.isArray(newsRes.value?.news) ? newsRes.value.news.length : 0)) : 0,
          events: eventsRes.status === 'fulfilled' ? (Array.isArray(eventsRes.value) ? eventsRes.value.length : eventsRes.value?.total || 0) : 0,
          projects: projectsRes.status === 'fulfilled' ? (projectsRes.value?.total || (Array.isArray(projectsRes.value?.projects) ? projectsRes.value.projects.length : 0)) : 0,
          research: researchRes.status === 'fulfilled' ? (Array.isArray(researchRes.value) ? researchRes.value.length : researchRes.value?.total || 0) : 0,
          resources: resourcesRes.status === 'fulfilled' ? (resourcesRes.value?.total || (Array.isArray(resourcesRes.value?.resources) ? resourcesRes.value.resources.length : 0)) : 0,
          applications: appsRes.status === 'fulfilled' ? (Array.isArray(appsRes.value) ? appsRes.value.filter(a => a.status === 'pending').length : 0) : 0,
          contacts: contactsRes.status === 'fulfilled' ? (Array.isArray(contactsRes.value) ? contactsRes.value.length : contactsRes.value?.total || 0) : 0,
          newsletter: newsletterRes.status === 'fulfilled' ? (Array.isArray(newsletterRes.value) ? newsletterRes.value.length : newsletterRes.value?.total || 0) : 0,
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
            <span>Signal Processing & SigniAI Club</span>
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-blue-600 mb-4" />
          <p className="text-sm font-semibold text-gray-600">Syncing ecosystem metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Users"
              value={stats.users}
              icon={faUsers}
              color="blue"
              link={Routes.Users.path}
            />
            <StatCard
              title="Club Members"
              value={stats.members}
              icon={faIdCard}
              color="indigo"
              link={Routes.Members.path}
            />
            <StatCard
              title="Active Subgroups"
              value={stats.subgroups}
              icon={faLayerGroup}
              color="violet"
              link={Routes.Subgroups.path}
            />
            <StatCard
              title="Blog Posts"
              value={stats.posts}
              icon={faBlog}
              color="pink"
              link={Routes.BlogPosts.path}
            />
            <StatCard
              title="News Updates"
              value={stats.news}
              icon={faBullhorn}
              color="amber"
              link={Routes.News.path}
            />
            <StatCard
              title="Events"
              value={stats.events}
              icon={faCalendarAlt}
              color="orange"
              link={Routes.Events.path}
            />
            <StatCard
              title="Projects"
              value={stats.projects}
              icon={faLaptopCode}
              color="emerald"
              link={Routes.Projects.path}
            />
            <StatCard
              title="Research Papers"
              value={stats.research}
              icon={faFlask}
              color="cyan"
              link={Routes.Research.path}
            />
            <StatCard
              title="Resources"
              value={stats.resources}
              icon={faFolderOpen}
              color="sky"
              link={Routes.Resources.path}
            />
            <StatCard
              title="Contact Messages"
              value={stats.contacts}
              icon={faEnvelope}
              color="rose"
              link={Routes.Contacts.path}
            />
            <StatCard
              title="Subscribers"
              value={stats.newsletter}
              icon={faEnvelopeOpenText}
              color="teal"
              link={Routes.Newsletter.path}
            />
          </div>

          {/* Quick Actions */}
          <div className="pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                title="Review Applications"
                description="Process pending club join requests."
                icon={faClipboardList}
                link={Routes.Applications.path}
              />
              <QuickActionCard
                title="Publish Blog Post"
                description="Draft and publish a new technical article."
                icon={faBlog}
                link={Routes.BlogPosts.path}
              />
              <QuickActionCard
                title="Add Research Paper"
                description="Upload new academic publications."
                icon={faFlask}
                link={Routes.Research.path}
              />
              <QuickActionCard
                title="Create Subgroup"
                description="Initialize a new specialized AI focus group."
                icon={faLayerGroup}
                link={Routes.Subgroups.path}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
