import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/users';
import { authAPI } from '../api/auth';
import { getImageUrl } from '../api/client';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faUserCircle,
  faCamera,
  faKey,
  faLock,
  faPaperPlane,
  faSpinner,
  faCheckCircle,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    user_name: user?.user_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [avatar, setAvatar] = useState(user?.avatar_url || null);

  // Password Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    fetchAvatar();
  }, []);

  const fetchAvatar = async () => {
    try {
      const av = await usersAPI.getAvatar();
      if (av && av.path) {
        setAvatar(av.path);
        setUser({ ...user, avatar_url: av.path });
        localStorage.setItem('user', JSON.stringify({ ...user, avatar_url: av.path }));
      }
    } catch (err) {
      // Ignored
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      await usersAPI.uploadAvatar(file);
      await fetchAvatar();
      setToast({ type: 'success', message: 'Avatar updated successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to upload avatar' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.updateMe(formData);
      setUser({ ...user, ...formData });
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const openResetModal = () => {
    setResetStep(1);
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setIsResetModalOpen(true);
  };

  const handleSendResetOTP = async () => {
    setResetError('');
    setResetLoading(true);
    try {
      await authAPI.requestPasswordReset(user?.email);
      setResetStep(2);
      setToast({ type: 'success', message: `OTP code sent to ${user?.email}` });
    } catch (err) {
      setResetError(err.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (e) => {
    e.preventDefault();
    setResetError('');

    if (!resetOtp.trim()) {
      setResetError('Please enter the OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetLoading(true);
    try {
      await authAPI.confirmPasswordReset({
        email: user?.email,
        otp_code: resetOtp.trim(),
        new_password: newPassword,
      });
      setIsResetModalOpen(false);
      setToast({ type: 'success', message: 'Password successfully updated!' });
    } catch (err) {
      setResetError(err.response?.data?.detail || 'Invalid or expired OTP code.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-4xl shadow-inner border border-blue-100 overflow-hidden">
            {avatar ? (
              <img src={getImageUrl(avatar)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} />
            )}
          </div>
          <label className="cursor-pointer flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
            <FontAwesomeIcon icon={faCamera} />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>
        <div className="text-center sm:text-left flex-1 mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
            {user?.roles?.map((role) => (
              <span key={role} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
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

      {/* Security & Password Reset Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faKey} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Security (Password Reset)</h2>
              <p className="text-xs text-gray-500">Manage account authentication & credentials</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Change your account password securely using a One-Time Password (OTP) sent to your registered email address.
          </p>
          <button
            onClick={openResetModal}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors shadow-sm inline-flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faKey} className="text-blue-600" />
            <span>Change Password via OTP</span>
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Account Password"
      >
        {resetError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {resetError}
          </div>
        )}

        {resetStep === 1 ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              We will send a 6-digit One-Time Password (OTP) to your registered email address:
              <br />
              <strong className="text-gray-900">{user?.email}</strong>
            </p>
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetLoading}
                onClick={handleSendResetOTP}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
              >
                {resetLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    <span>Send OTP via Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
            <p className="text-xs text-gray-600">
              Enter the 6-digit OTP code sent to <strong>{user?.email}</strong> and specify your new password.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                autoFocus
                maxLength={8}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full px-3 py-2 text-sm text-center font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs focus:outline-none"
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs focus:outline-none"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={handleSendResetOTP}
                disabled={resetLoading}
                className="text-xs text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {resetLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
