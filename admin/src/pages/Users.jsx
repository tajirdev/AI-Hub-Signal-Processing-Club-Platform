import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { usersAPI } from '../api/users';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faUserCheck, 
  faUserTimes, 
  faUserCog, 
  faTrash, 
  faToggleOn, 
  faToggleOff,
  faEye,
  faImage,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [avatarFilter, setAvatarFilter] = useState('all'); // 'all', 'with_avatar', 'no_avatar'
  const [toast, setToast] = useState(null);

  // Avatar / Profile Preview Modal State
  const [previewUser, setPreviewUser] = useState(null);

  // Manage Roles Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Delete User Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleToggleActive = async (user) => {
    try {
      const res = await usersAPI.toggleActive(user.id);
      setToast({
        type: 'success',
        message: `User ${user.first_name} is now ${res.is_active ? 'Active' : 'Inactive'}`,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setToast({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to update user status',
      });
    }
  };

  const handlePromote = async (roleName) => {
    if (!selectedUser) return;
    setUpdatingRole(true);
    try {
      await usersAPI.promote(selectedUser.id, roleName);
      setToast({ type: 'success', message: `Role ${roleName} added successfully!` });
      await fetchUsers();
      setSelectedUser(prev => ({ ...prev, roles: [...(prev.roles || []), roleName] }));
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.detail || 'Failed to add role' });
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDemote = async (roleName) => {
    if (!selectedUser) return;
    setUpdatingRole(true);
    try {
      await usersAPI.demote(selectedUser.id, roleName);
      setToast({ type: 'success', message: `Role ${roleName} removed successfully!` });
      await fetchUsers();
      setSelectedUser(prev => ({ ...prev, roles: prev.roles.filter(r => r !== roleName) }));
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.detail || 'Failed to remove role' });
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await usersAPI.delete(userToDelete.id);
      setToast({ type: 'success', message: 'User deleted successfully!' });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.detail || 'Failed to delete user' });
    } finally {
      setDeleting(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const openPreviewModal = (user) => {
    setPreviewUser(user);
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch = (
      (u.first_name || '').toLowerCase().includes(term) ||
      (u.last_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.user_name || '').toLowerCase().includes(term)
    );

    if (!matchesSearch) return false;

    if (avatarFilter === 'with_avatar') {
      return Boolean(u.avatar_url);
    }
    if (avatarFilter === 'no_avatar') {
      return !u.avatar_url;
    }
    return true;
  });

  const availableRoles = ['member', 'editor', 'super_admin'];

  const columns = [
    {
      header: 'User & Avatar',
      render: (u) => {
        const initial = (u.first_name?.charAt(0) || u.user_name?.charAt(0) || 'U').toUpperCase();
        return (
          <div className="flex items-center space-x-3.5">
            <button
              type="button"
              onClick={() => openPreviewModal(u)}
              title={u.avatar_url ? 'Click to view full avatar photo' : 'User profile'}
              className="relative group focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all shadow-sm">
                {u.avatar_url ? (
                  <img 
                    src={getImageUrl(u.avatar_url)} 
                    alt={`${u.first_name} avatar`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              {u.avatar_url && (
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] transition-opacity">
                  <FontAwesomeIcon icon={faEye} />
                </div>
              )}
            </button>
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="font-bold text-gray-900 text-xs">
                  {u.first_name} {u.last_name}
                </p>
                {u.avatar_url ? (
                  <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200" title="Has profile photo">
                    Avatar
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded" title="No custom profile photo">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 font-mono">@{u.user_name}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Email & Contact',
      render: (u) => (
        <div>
          <p className="text-xs text-gray-800 font-medium">{u.email}</p>
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
        <button
          onClick={() => handleToggleActive(u)}
          title={`Click to ${u.is_active ? 'deactivate' : 'activate'} user`}
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all hover:scale-105 ${
            u.is_active
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FontAwesomeIcon icon={u.is_active ? faUserCheck : faUserTimes} className="text-[10px]" />
          <span>{u.is_active ? 'Active' : 'Inactive'}</span>
        </button>
      ),
    },
    {
      header: 'Joined Date',
      render: (u) => (
        <span className="text-[11px] text-gray-500 font-medium">
          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
    }
  ];

  const actions = (u) => (
    <div className="flex items-center justify-end space-x-1.5">
      <button
        onClick={() => openPreviewModal(u)}
        title="View Profile & Avatar"
        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        <FontAwesomeIcon icon={faEye} />
      </button>
      <button
        onClick={() => handleToggleActive(u)}
        title={u.is_active ? 'Deactivate User' : 'Activate User'}
        className={`p-1.5 rounded-lg transition-colors ${
          u.is_active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
        }`}
      >
        <FontAwesomeIcon icon={u.is_active ? faToggleOn : faToggleOff} className="text-base" />
      </button>
      <button
        onClick={() => openRoleModal(u)}
        title="Manage Roles"
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <FontAwesomeIcon icon={faUserCog} />
      </button>
      <button
        onClick={() => openDeleteModal(u)}
        title="Delete User"
        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        title="Users Directory"
        subtitle="Manage registered user accounts, view profile avatars, and configure role privileges."
        searchPlaceholder="Search by name, email, or username..."
        searchValue={search}
        onSearchChange={setSearch}
        columns={columns}
        data={filteredUsers}
        loading={loading}
        actions={actions}
        filterComponent={
          <div className="flex items-center space-x-2">
            <select
              value={avatarFilter}
              onChange={(e) => setAvatarFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Users ({users.length})</option>
              <option value="with_avatar">With Avatar ({users.filter(u => Boolean(u.avatar_url)).length})</option>
              <option value="no_avatar">No Avatar ({users.filter(u => !u.avatar_url).length})</option>
            </select>
            {avatarFilter !== 'all' && (
              <button
                onClick={() => setAvatarFilter('all')}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md flex items-center space-x-1"
                title="Reset Avatar Filter"
              >
                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                <span>Reset</span>
              </button>
            )}
          </div>
        }
      />

      {/* User Profile & Full Avatar Preview Modal */}
      {previewUser && (
        <Modal
          isOpen={Boolean(previewUser)}
          onClose={() => setPreviewUser(null)}
          title="User Profile & Avatar"
          subtitle={`Details for @${previewUser.user_name}`}
          hideFooter
        >
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-2xl overflow-hidden ring-4 ring-blue-500/20 shadow-md mb-4">
              {previewUser.avatar_url ? (
                <img 
                  src={getImageUrl(previewUser.avatar_url)} 
                  alt={previewUser.first_name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{(previewUser.first_name?.charAt(0) || previewUser.user_name?.charAt(0) || 'U').toUpperCase()}</span>
              )}
            </div>

            <h3 className="text-base font-bold text-gray-900">
              {previewUser.first_name} {previewUser.last_name}
            </h3>
            <p className="text-xs text-gray-500 font-mono mb-2">@{previewUser.user_name}</p>

            <div className="flex flex-wrap gap-1 justify-center mb-4">
              {previewUser.roles && previewUser.roles.length > 0 ? (
                previewUser.roles.map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800"
                  >
                    {r}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No special roles</span>
              )}
            </div>

            <div className="w-full bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="font-semibold text-gray-900">{previewUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Phone</span>
                <span className="font-semibold text-gray-900">{previewUser.phone || 'None provided'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`font-semibold ${previewUser.is_active ? 'text-emerald-700' : 'text-red-700'}`}>
                  {previewUser.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Joined Date</span>
                <span className="font-semibold text-gray-900">
                  {previewUser.created_at ? new Date(previewUser.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {previewUser.bio && (
                <div className="pt-1">
                  <span className="text-gray-500 font-medium block mb-0.5">Bio</span>
                  <p className="text-gray-700 italic">{previewUser.bio}</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end w-full">
              <button
                type="button"
                onClick={() => setPreviewUser(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manage Roles Modal */}
      {isRoleModalOpen && selectedUser && (
        <Modal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          title="Manage User Roles"
          subtitle={`Configure access permissions for @${selectedUser.user_name}`}
          hideFooter
        >
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
              {selectedUser.avatar_url ? (
                <img src={getImageUrl(selectedUser.avatar_url)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{(selectedUser.first_name?.charAt(0) || 'U').toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs">{selectedUser.first_name} {selectedUser.last_name}</p>
              <p className="text-[11px] text-gray-600">{selectedUser.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            {availableRoles.map(role => {
              const hasRole = selectedUser.roles?.includes(role);
              return (
                <div key={role} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="font-semibold text-xs uppercase text-gray-700">{role}</span>
                  <button
                    onClick={() => hasRole ? handleDemote(role) : handlePromote(role)}
                    disabled={updatingRole}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      hasRole 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {hasRole ? 'Remove Role' : 'Grant Role'}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && userToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete User Account"
          subtitle="This action is permanent and cannot be undone."
          onSubmit={handleDelete}
          submitText="Delete User"
          submitColor="bg-red-600 hover:bg-red-700 shadow-red-500/20"
          submitting={deleting}
        >
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-200 text-red-800 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 mt-0.5">
              {userToDelete.avatar_url ? (
                <img src={getImageUrl(userToDelete.avatar_url)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{(userToDelete.first_name?.charAt(0) || 'U').toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-red-800 font-bold mb-1">Warning: Irreversible Action!</p>
              <p className="text-xs text-red-700">
                You are about to permanently delete <strong>{userToDelete.first_name} {userToDelete.last_name}</strong> (@{userToDelete.user_name} - {userToDelete.email}).
                This will remove all associated user data, including roles.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
