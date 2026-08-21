import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export function StatCard({ title, value, icon, color = 'blue', subtext, link }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      iconBg: 'bg-blue-600 text-white',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      iconBg: 'bg-purple-600 text-white',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      iconBg: 'bg-rose-600 text-white',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-600 text-white',
    },
  };

  const current = colorMap[color] || colorMap.blue;

  const content = (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        {subtext && <p className="text-[11px] text-gray-500 font-medium">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm ${current.iconBg}`}>
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  );

  if (link) {
    return <Link to={link} className="block group">{content}</Link>;
  }

  return content;
}

export function QuickActionCard({ title, description, icon, link, actionText = 'Manage' }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center text-base">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <Link
        to={link}
        className="w-full text-center py-2 px-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 font-semibold text-xs rounded-lg transition-colors border border-gray-200/80"
      >
        {actionText}
      </Link>
    </div>
  );
}
