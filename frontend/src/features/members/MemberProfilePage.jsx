import { ensureExternalUrl } from '../../utils/url';
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, Phone, Code, Globe, Briefcase, ArrowLeft, Calendar, CheckCircle } from "lucide-react";
import { fetchMemberById } from "../../services/endpoints";
import { getImageUrl } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingState, ErrorState } from "../../components/ui/States";
import { ManageContentTab } from './components/ManageContentTab';
import { EditProfileForm } from "./components/EditProfileForm";

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

function WaveThumb({ uid, type }) {
  const bgId = `wave-${uid}`;
  const isResearch = type === "Research";
  const primary = isResearch ? "#7c3aed" : BRAND.navy;
  const secondary = isResearch ? "#5b21b6" : BRAND.navyDark;
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${bgId})`} />
      <g fill="none" stroke={isResearch ? "#d8b4fe" : BRAND.amber}>
        <path d="M-5,60 C15,35 30,80 50,55 C70,30 85,75 105,55" strokeWidth="2" opacity="0.6" />
        <path d="M-5,72 C15,50 30,92 50,72 C70,50 85,92 105,72" strokeWidth="1.5" opacity="0.35" />
      </g>
    </svg>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  if (!value) return null;
  const external = href?.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      style={{ border: "1px solid rgba(10,36,114,0.08)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(10,36,114,0.06)" }}
      >
        <Icon className="w-4 h-4 text-navy dark:text-gray-300" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm font-medium truncate text-navy dark:text-white">
          {value}
        </p>
      </div>
    </a>
  );
}

// Generate a stable accent color based on member ID or name
const getAccentColor = (str) => {
  if (!str) return BRAND.amber;
  const colors = [BRAND.amber, "#7c3aed", "#e11d48", "#059669", "#0284c7"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function MemberProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuth(); // Authenticated user
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile, settings, manage

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMemberById(id);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err.response?.data?.detail || "Profile not found or you don't have access.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} />;
  if (!profile) return <ErrorState message="Profile not found." />;

  const user = profile.user || {};
  const roles = user.roles || [];
  const isAdmin = roles.includes('super_admin') || roles.includes('admin');
  const isEditor = roles.includes('editor');
  const isOwner = profile.is_owner;
  const isMentorOrAbove = user.roles?.some(r => ['mentor', 'editor', 'super_admin'].includes(r));
  const canManageContent = isOwner && isMentorOrAbove;
  
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.user_name || 'Anonymous';
  const initial = name.charAt(0).toUpperCase();
  const accent = getAccentColor(name);
  const avatarUrl = user.avatar_url ? getImageUrl(user.avatar_url) : null;
  
  const joinedDate = profile.joined_at ? new Date(profile.joined_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Unknown';

  // Aggregate items
  const items = [
    ...(profile.projects || []),
    ...(profile.research || []),
    ...(profile.news || []),
    ...(profile.events || []),
    ...(profile.blogs || [])
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#071225] py-10 px-6 sm:px-10 mt-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/members" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </Link>
      
        {isOwner && (
          <div className="mb-6 flex space-x-2 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "profile" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Public View
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "settings" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Edit Profile
            </button>
            {canManageContent && (
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === "manage" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Manage Content
              </button>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="md:col-span-1">
              <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 text-center sticky top-24 border border-gray-100 dark:border-gray-800">
                <div
                  className="w-28 h-28 rounded-full mx-auto flex items-center justify-center shadow-lg relative bg-gray-100 dark:bg-gray-800"
                  style={{
                    background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : `linear-gradient(135deg, ${BRAND.navy}, ${accent})`,
                    border: "4px solid #ffffff",
                  }}
                >
                  {!avatarUrl && (
                    <span className="text-4xl font-bold text-white" style={{ opacity: 0.9 }}>
                      {initial}
                    </span>
                  )}
                </div>

                <h1 className="text-xl font-bold mt-4 text-navy dark:text-white flex items-center justify-center gap-1.5">
                  {name}
                  {isAdmin && <CheckCircle className="w-5 h-5 text-[#ffba08]" />}
                  {isEditor && !isAdmin && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </h1>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  @{user.user_name}
                </p>

                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-4 text-xs font-semibold"
                  style={{ backgroundColor: BRAND.amber, color: BRAND.navy }}
                >
                  {profile.sub_group} &middot; {profile.position || 'Member'}
                </div>

                <p className="text-sm leading-relaxed mt-4 text-gray-600 dark:text-gray-400 text-left">
                  {user.bio || "No bio provided."}
                </p>

                <div className="flex flex-col gap-2.5 mt-6 text-left">
                  <ContactItem icon={Mail} label="Email" value={user.email} href={`mailto:${user.email}`} />
                  <ContactItem icon={Phone} label="Phone" value={user.phone} href={user.phone ? `tel:${user.phone}` : null} />
                  <ContactItem icon={Code} label="GitHub" value={profile.github ? "GitHub Profile" : null} href={ensureExternalUrl(profile.github)} />
                  <ContactItem icon={Globe} label="Portfolio" value={profile.portfolio ? "Website" : null} href={ensureExternalUrl(profile.portfolio)} />
                  <ContactItem icon={Briefcase} label="LinkedIn" value={profile.linkedin ? "LinkedIn" : null} href={ensureExternalUrl(profile.linkedin)} />
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {joinedDate}
                </div>
              </div>
            </div>

            {/* Right Column: Projects & Research */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-navy dark:text-white">Contributions & Work</h2>
              
              {items.length === 0 ? (
                <div className="rounded-2xl bg-white dark:bg-[#0a1628] p-8 text-center border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500">No public contributions available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.type}-${item.id}-${idx}`}
                      className="flex gap-4 rounded-2xl bg-white dark:bg-[#0a1628] p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <WaveThumb uid={`${item.type}-${item.id}`} type={item.type} />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: item.type === "Research" ? "rgba(124,58,237,0.12)" : "rgba(10,36,114,0.08)",
                            color: item.type === "Research" ? "#7c3aed" : BRAND.navy,
                          }}
                        >
                          {item.type}
                        </span>
                        {item.status && item.status !== "active" && (
                          <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-500">
                            {item.status}
                          </span>
                        )}
                        {item.is_published === false && (
                          <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-500">
                            Draft
                          </span>
                        )}
                        <h3 className="text-sm font-bold mt-1 text-navy dark:text-white truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs leading-relaxed mt-0.5 line-clamp-2 text-gray-500 dark:text-gray-400">
                          {item.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        {activeTab === "settings" && (
          <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Edit Profile</h2>
            <EditProfileForm 
              profile={profile} 
              onUpdate={() => window.location.reload()} 
            />
          </div>
        )}

        {activeTab === "manage" && canManageContent && (
          <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
            <ManageContentTab profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
