import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
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
  faSignOutAlt,
  faTimes,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Routes } from '../routes';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/client';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { pathname } = location;
  const { user, logout } = useAuth();

  const navItems = [
    { title: 'Overview', path: Routes.Overview.path, icon: faChartPie },
    { title: 'Users & Roles', path: Routes.Users.path, icon: faUsers, badge: 'Admin' },
    { title: 'Club Members', path: Routes.Members.path, icon: faIdCard },
    { title: 'Subgroups', path: Routes.Subgroups.path, icon: faLayerGroup },
    { title: 'Blog Posts', path: Routes.BlogPosts.path, icon: faBlog },
    { title: 'Categories', path: Routes.Categories.path, icon: faTags },
    { title: 'News & Updates', path: Routes.News.path, icon: faBullhorn },
    { title: 'Events', path: Routes.Events.path, icon: faCalendarAlt },
    { title: 'Projects', path: Routes.Projects.path, icon: faLaptopCode },
    { title: 'Research Papers', path: Routes.Research.path, icon: faFlask },
    { title: 'Resources', path: Routes.Resources.path, icon: faFolderOpen },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-gray-950 border-b border-gray-800">
          <Link to={Routes.Overview.path} className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 font-extrabold text-lg">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm tracking-wide">AI Hub Admin</span>
              <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Super Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-800/80 bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-700/40 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold overflow-hidden">
              {user?.avatar_url ? (
                <img
                  src={getImageUrl(user.avatar_url)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.first_name?.charAt(0) || 'A'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                <FontAwesomeIcon icon={faShieldAlt} className="text-[10px] text-amber-400" />
                <span className="text-[11px] text-gray-400 capitalize">
                  {user?.roles?.[0] || 'Super Admin'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links List */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Management
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-sm w-4 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-gray-800 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer / Sign Out */}
        <div className="p-3 border-t border-gray-800 bg-gray-950/60">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-red-500/20"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
