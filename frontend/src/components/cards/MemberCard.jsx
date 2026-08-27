import React from 'react';
import { getImageUrl } from '../../services/api';
import { Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MemberCard({ member }) {
  if (!member || !member.show_profile) return null;
  
  const user = member.user || {};
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.user_name || 'Anonymous';
  const avatarUrl = user.avatar_url ? getImageUrl(user.avatar_url) : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0a2472&color=fff`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-50"
        />
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{name}</h3>
          <p className="text-sm font-medium text-[#0a2472]">{member.position || 'Member'}</p>
        </div>
      </div>
      
      {user.bio && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
      )}

      <div className="flex items-center gap-3">
        {member.github && (
          <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
            <span className="text-xs font-bold">GitHub</span>
          </a>
        )}
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors">
            <span className="text-xs font-bold">LinkedIn</span>
          </a>
        )}
        {member.portfolio && (
          <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-600 transition-colors">
            <Globe className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
