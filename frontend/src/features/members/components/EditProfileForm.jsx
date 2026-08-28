import React, { useState } from 'react';
import { updateUserMe, updateMemberMe, uploadAvatar } from '../../../services/endpoints';
import { getImageUrl } from '../../../services/api';
import { Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';

export function EditProfileForm({ profile, onUpdate }) {
  const user = profile.user || {};
  
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    bio: user.bio || '',
    github: profile.github || '',
    linkedin: profile.linkedin || '',
    portfolio: profile.portfolio || '',
    position: profile.position || '',
    show_profile: profile.show_profile ?? true
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url ? getImageUrl(user.avatar_url) : null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      await updateUserMe({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        user_name: user.user_name // Required by schema if omitted
      });

      await updateMemberMe({
        position: formData.position,
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
        show_profile: formData.show_profile
      });

      setSuccess(true);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="relative group cursor-pointer">
          <div 
            className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center"
            style={avatarPreview ? { background: `url(${avatarPreview}) center/cover no-repeat` } : {}}
          >
            {!avatarPreview && <Camera className="w-8 h-8 text-gray-400" />}
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB. Click to upload.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Position / Title</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Portfolio URL</label>
          <input
            type="url"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <input 
          type="checkbox" 
          id="show_profile" 
          name="show_profile"
          checked={formData.show_profile}
          onChange={handleChange}
          className="w-4 h-4 text-amber bg-gray-100 border-gray-300 rounded focus:ring-amber" 
        />
        <label htmlFor="show_profile" className="text-sm font-medium text-gray-900 dark:text-gray-300">
          Make my profile visible to the public
        </label>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-navy dark:bg-amber hover:bg-navy-light dark:hover:bg-amber/90 text-white dark:text-navy px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
