import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
          <FontAwesomeIcon icon={faExclamationCircle} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">404</h1>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">
          The requested admin page does not exist or has been relocated.
        </p>
        <Link
          to={Routes.Overview.path}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
