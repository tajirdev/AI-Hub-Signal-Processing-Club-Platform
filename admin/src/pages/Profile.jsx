import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/users';
import { authAPI } from '../api/auth';
import Toast from '../components/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    user_name: user?.user_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.updateMe(formData);
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-4xl shadow-inner border border-blue-100">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user?.roles?.map((role) => (
              <span key={role} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Bio</label>
            <textarea
              rows="4"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Security (Password Reset)</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Need to change your password? Click below to receive a One-Time Password (OTP) via email to reset it securely.
          </p>
          <button
            onClick={async () => {
              try {
                await authAPI.requestPasswordReset(user?.email);
                const otp = window.prompt("OTP sent to your email. Enter the OTP code here:");
                if (!otp) return;
                const newPass = window.prompt("Enter your new password:");
                if (!newPass) return;
                await authAPI.confirmPasswordReset({ email: user?.email, otp_code: otp, new_password: newPass });
                setToast({ type: 'success', message: 'Password updated successfully!' });
              } catch (err) {
                setToast({ type: 'error', message: err.response?.data?.detail || 'Failed to reset password' });
              }
            }}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors shadow-sm"
          >
            Reset Password
          </button>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
