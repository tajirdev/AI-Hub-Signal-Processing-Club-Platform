import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border animate-in slide-in-from-bottom-5 duration-200 ${
        isSuccess
          ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700/60 backdrop-blur-sm'
          : isError
          ? 'bg-red-900/90 text-red-100 border-red-700/60 backdrop-blur-sm'
          : 'bg-gray-900/90 text-gray-100 border-gray-700/60 backdrop-blur-sm'
      }`}
    >
      <FontAwesomeIcon
        icon={isSuccess ? faCheckCircle : isError ? faExclamationCircle : faInfoCircle}
        className={`text-base ${isSuccess ? 'text-emerald-400' : isError ? 'text-red-400' : 'text-blue-400'}`}
      />
      <span className="text-xs font-medium max-w-sm">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>
      )}
    </div>
  );
}
