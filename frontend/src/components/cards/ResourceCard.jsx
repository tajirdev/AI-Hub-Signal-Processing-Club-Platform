import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Calendar, Database, File, Video, Code, Box } from 'lucide-react';

import { Badge } from '../ui/Badge';

export function ResourceCard({ resource }) {
  const getTypeIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('dataset')) return <Database className="w-5 h-5" />;
    if (t.includes('video') || t.includes('lecture')) return <Video className="w-5 h-5" />;
    if (t.includes('code') || t.includes('github')) return <Code className="w-5 h-5" />;
    if (t.includes('model') || t.includes('weights')) return <Box className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="bg-white dark:bg-[#0a1628] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="primary" className="bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-gray-200 border-none capitalize">
            {resource.type || 'Resource'}
          </Badge>
        </div>

        <h3 className="text-xl font-heading font-black text-navy dark:text-white mb-3 group-hover:text-amber transition-colors line-clamp-2">
          {resource.title}
        </h3>

        <div className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {resource.description || 'No description provided.'}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <span className="inline-flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {resource.created_at ? new Date(resource.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Recent'}
          </span>
          <Link
            to={`/resources/${resource.id}`}
            className="inline-flex items-center text-sm font-semibold transition-colors duration-200 group-hover:underline"
            style={{ color: '#ffba08' }}
          >
            Access Resource &rarr;
          </Link>
        </div>
      </div>
      
      {/* Decorative background icon */}
      <div className="absolute -bottom-4 -right-4 text-gray-50 dark:text-white/5 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
        {getTypeIcon(resource.type)}
      </div>
    </div>
  );
}
