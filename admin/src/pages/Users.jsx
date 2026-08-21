import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { usersAPI } from '../api/users';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUserCheck, faUserTimes } from '@fortawesome/free-solid-svg-icons';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    password_hash: '',
    phone: '',
    bio: '',
    github_link: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await usersAPI.register(formData);
      setToast({ type: 'success', message: 'User registered successfully!' });
      setIsModalOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        password_hash: '',
        phone: '',
        bio: '',
        github_link: '',
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : 'Registration failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      (u.first_name || '').toLowerCase().includes(term) ||
      (u.last_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.user_name || '').toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      header: 'User',
      render: (u) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs overflow-hidden border border-blue-200">
            {u.avatar_url ? (
              <img src={getImageUrl(u.avatar_url)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{u.first_name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">
              {u.first_name} {u.last_name}
            </p>
            <p className="text-[11px] text-gray-500 font-mono">@{u.user_name}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Email & Contact',
      render: (u) => (
        <div>
          <p className="text-xs text-gray-800">{u.email}</p>
          <p className="text-[11px] text-gray-500">{u.phone || 'No phone'}</p>
        </div>
      ),
    },
    {
      header: 'Roles',
      render: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roles && u.roles.length > 0 ? (
            u.roles.map((r) => (
              <span
                key={r}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  r === 'super_admin'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300/50'
                    : r === 'editor'
                    ? 'bg-purple-100 text-purple-800 border border-purple-300/50'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {r === 'super_admin' && <FontAwesomeIcon icon={faShieldAlt} className="text-[9px]" />}
                <span>{r}</span>
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-400 font-medium">None</span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (u) => (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            u.is_active
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FontAwesomeIcon icon={u.is_active ? faUserCheck : faUserTimes} className="text-[10px]" />
          <span>{u.is_active ? 'Active' : 'Inactive'}</span>
        </span>
      ),
    },
    {
      header: 'Joined Date',
      render: (u) => (
        <span className="text-[11px] text-gray-500 font-medium">
          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Users Directory"
        subtitle="Manage registered user accounts and inspect system role privileges."
        searchPlaceholder="Search by name, email, or username..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={() => setIsModalOpen(true)}
        createButtonText="Register User"
        columns={columns}
        data={filteredUsers}
        loading={loading}
      />

      {/* Register User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New User"
        subtitle="Create a new account on the AI Hub platform."
        onSubmit={handleRegister}
        submitText="Create Account"
        submitting={submitting}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username *</label>
            <input
              type="text"
              required
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={formData.password_hash}
              onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Profile Link</label>
          <input
            type="url"
            value={formData.github_link}
            onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Role Description</label>
          <textarea
            rows="3"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
