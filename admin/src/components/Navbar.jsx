import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSignOutAlt,
  faUserCircle,
  faShieldAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/client';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>

        <div className="hidden sm:flex items-center relative">
          <span className="absolute left-3 text-gray-400 text-xs">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            placeholder="Search platform resources..."
            className="pl-8 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full">
          <FontAwesomeIcon icon={faShieldAlt} className="text-amber-600 text-xs" />
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
            Super Admin Portal
          </span>
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-200 text-white font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden">
              {user?.avatar_url ? (
                <img
                  src={getImageUrl(user.avatar_url)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.first_name?.charAt(0) || 'A'}</span>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-800">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-[11px] text-gray-500 truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                <div className="mt-1 flex gap-1 flex-wrap">
                  {user?.roles?.map((r) => (
                    <span
                      key={r}
                      className="inline-block text-[10px] uppercase font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
