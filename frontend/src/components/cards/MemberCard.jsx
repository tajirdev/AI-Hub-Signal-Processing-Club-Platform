import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

const BRAND = {
  navy: "#0a2472",
  amber: "#ffba08",
};

// Generate a stable accent color based on member ID or name
const getAccentColor = (str) => {
  if (!str) return BRAND.amber;
  const colors = [
    BRAND.amber,
    "#7c3aed", // purple
    "#e11d48", // rose
    "#059669", // emerald
    "#0284c7", // sky
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function MemberCard({ member }) {
  if (!member || member.show_profile === false) return null;
  
  const user = member.user || {};
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.user_name || 'Anonymous';
  const avatarUrl = user.avatar_url ? getImageUrl(user.avatar_url) : null;
  const initial = name.charAt(0).toUpperCase();
  const accent = getAccentColor(name);
  const roles = user.roles || [];
  
  const isSuperAdmin = roles.includes('super_admin');
  const isMentor = roles.includes('mentor'); // Assuming 'mentor' is a role

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 bg-white dark:bg-transparent">
      {/* Avatar / Cover at the back */}
      <div
        className="relative w-full h-56 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        style={{ 
          background: avatarUrl 
            ? `url(${avatarUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${BRAND.navy}, ${accent})`
        }}
      >
        {!avatarUrl && (
          <span className="text-6xl font-bold text-white opacity-85">
            {initial}
          </span>
        )}

        {/* Dark Mode Gradient overlay (only visible in dark mode) */}
        <div
          className="hidden dark:block absolute inset-x-0 bottom-0 h-28"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}
        />

        {/* Dark variant content panel (hidden in light mode) */}
        <div className="hidden dark:flex absolute inset-x-0 bottom-0 items-end justify-between px-5 py-4">
          <div>
            <h3 className="text-white font-bold text-base flex items-center gap-1.5">
              {name}
              {isSuperAdmin && <CheckCircle className="w-4 h-4 text-[#ffba08]" />}
              {isMentor && !isSuperAdmin && <CheckCircle className="w-4 h-4 text-white" />}
            </h3>
            <p className="text-xs mt-0.5 text-white/75">
              {member.sub_group || member.position || 'Member'}
            </p>
          </div>
          <Link
          to={`/members/${member.id}`}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-white flex-shrink-0 backdrop-blur-sm transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
            View More <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Light variant content panel (hidden in dark mode) */}
      <div className="flex dark:hidden bg-white px-5 py-4 items-end justify-between">
        <div>
          <h3 className="font-bold text-base flex items-center gap-1.5" style={{ color: BRAND.navy }}>
            {name}
            {isSuperAdmin && <CheckCircle className="w-4 h-4 text-[#ffba08]" />}
            {isMentor && !isSuperAdmin && <CheckCircle className="w-4 h-4 text-[#0a2472]" />}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(10,36,114,0.55)" }}>
            {member.sub_group || member.position || 'Member'}
          </p>
        </div>
        <Link
          to={`/members/${member.id}`}
          className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-white flex-shrink-0 transition-transform duration-200 hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${accent})` }}
          >
          View More <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
