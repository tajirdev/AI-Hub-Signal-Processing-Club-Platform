import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { ArrowRight } from 'lucide-react';

const BRAND = {
  navy: "#0a2472",
  amber: "#ffba08",
};

const getAccentColor = (str) => {
  if (!str) return BRAND.amber;
  const colors = [BRAND.amber, "#7c3aed", "#e11d48", "#059669", "#0284c7"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function CompactMemberCard({ member }) {
  if (!member || member.show_profile === false) return null;

  // Sometimes 'member' is just the author object which has member and user separated
  // ResearchAuthor has member.member and member.user maybe? Or just member.user.
  // Let's normalize it:
  const actualMember = member.member ? member.member : member;
  const user = actualMember.user || member.user || {};
  
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.user_name || 'Anonymous';
  const initial = name.charAt(0).toUpperCase();
  const avatarUrl = user.avatar_url ? getImageUrl(user.avatar_url) : null;
  const accent = getAccentColor(name);

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#0a1628] border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800"
          style={{
            background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : `linear-gradient(135deg, ${BRAND.navy}, ${accent})`,
          }}
        >
          {!avatarUrl && <span className="text-sm font-bold text-white">{initial}</span>}
        </div>
        <div>
          <h4 className="text-sm font-bold text-navy dark:text-white line-clamp-1">{name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{actualMember.sub_group || actualMember.position || 'Member'}</p>
        </div>
      </div>
      <Link 
        to={`/members/${actualMember.id}`}
        className="flex items-center gap-1 text-xs font-semibold text-amber hover:text-navy dark:hover:text-white transition-colors"
      >
        View Profile <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
