import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { usersAPI } from '../api/users';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUserCheck, faUserTimes, faUserCog, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

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
      // Update selectedUser local state to reflect change immediately in modal
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

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      (u.first_name || '').toLowerCase().includes(term) ||
      (u.last_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.user_name || '').toLowerCase().includes(term)
    );
  });

  const availableRoles = ['member', 'editor', 'super_admin'];

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
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => handleToggleActive(u)}
        title={u.is_active ? 'Deactivate User' : 'Activate User'}
        className={`p-1.5 rounded transition-colors ${
          u.is_active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
        }`}
      >
        <FontAwesomeIcon icon={u.is_active ? faToggleOn : faToggleOff} className="text-base" />
      </button>
      <button
        onClick={() => openRoleModal(u)}
        title="Manage Roles"
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
      >
        <FontAwesomeIcon icon={faUserCog} />
      </button>
      <button
        onClick={() => openDeleteModal(u)}
        title="Delete User"
        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        title="Users Directory"
        subtitle="Manage registered user accounts and inspect system role privileges."
        searchPlaceholder="Search by name, email, or username..."
        searchValue={search}
        onSearchChange={setSearch}
        columns={columns}
        data={filteredUsers}
        loading={loading}
        actions={actions}
      />

      {/* Manage Roles Modal */}
      {isRoleModalOpen && selectedUser && (
        <Modal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          title={`Manage Roles: ${selectedUser.first_name} ${selectedUser.last_name}`}
          subtitle="Add or remove roles for this user."
          hideFooter
        >
          <div className="space-y-4">
            {availableRoles.map(role => {
              const hasRole = selectedUser.roles?.includes(role);
              return (
                <div key={role} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="font-semibold text-sm uppercase text-gray-700">{role}</span>
                  <button
                    onClick={() => hasRole ? handleDemote(role) : handlePromote(role)}
                    disabled={updatingRole}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      hasRole 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {hasRole ? 'Remove' : 'Add'}
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
          title="Delete User"
          subtitle="This action is permanent and cannot be undone."
          onSubmit={handleDelete}
          submitText="Delete User"
          submitColor="bg-red-600 hover:bg-red-700 shadow-red-500/20"
          submitting={deleting}
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-semibold mb-1">Warning!</p>
            <p className="text-xs text-red-700">
              You are about to permanently delete <strong>{userToDelete.first_name} {userToDelete.last_name}</strong> (@{userToDelete.user_name}).
              This will remove all associated user data, including roles.
            </p>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
