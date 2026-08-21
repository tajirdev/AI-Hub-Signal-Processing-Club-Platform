import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Routes } from '../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export default function ProtectedRoute({ children, requireSuperAdmin = true }) {
  const { user, loading, isAuthenticated, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-extrabold text-xl animate-pulse">
          AI
        </div>
        <div className="flex items-center space-x-2 text-blue-400 text-sm font-medium">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={Routes.Login.path} state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
            <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your account (<span className="font-semibold text-gray-800">{user?.email}</span>) does not have <span className="font-bold text-red-600">super_admin</span> privileges required to access this portal.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = Routes.Login.path;
            }}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  return children;
}
