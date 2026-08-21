import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { membersAPI } from '../api/members';
import { subgroupsAPI } from '../api/subgroups';
import { usersAPI } from '../api/users';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faExternalLinkAlt, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    position: '',
    subgroup_id: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, subgroupsRes, usersRes] = await Promise.all([
        membersAPI.getAll({
          skip: (page - 1) * 10,
          limit: 10,
          search: search || undefined,
        }),
        subgroupsAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => []),
      ]);

      const subList = Array.isArray(subgroupsRes) ? subgroupsRes : [];
      setSubgroups(subList);

      const userList = Array.isArray(usersRes) ? usersRes : [];
      setUsers(userList);

      if (membersRes && Array.isArray(membersRes.results)) {
        setMembers(membersRes.results);
        setTotalPages(Math.ceil((membersRes.total || 0) / 10) || 1);
        setTotalItems(membersRes.total || 0);
      } else if (Array.isArray(membersRes)) {
        setMembers(membersRes);
        setTotalPages(1);
        setTotalItems(membersRes.length);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch members' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, selectedSubgroup]);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      user_id: '',
      position: 'Member',
      subgroup_id: subgroups.length > 0 ? subgroups[0].id : '',
      github: '',
      linkedin: '',
      portfolio: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    const sgObj = subgroups.find((s) => s.name === member.sub_group);
    setFormData({
      user_id: member.user_id || '',
      position: member.position || '',
      subgroup_id: sgObj ? sgObj.id : (subgroups[0]?.id || ''),
      github: member.github || '',
      linkedin: member.linkedin || '',
      portfolio: member.portfolio || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subgroup_id) {
      setToast({ type: 'error', message: 'Please select a subgroup' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        position: formData.position || 'Member',
        github: formData.github || null,
        linkedin: formData.linkedin || null,
        portfolio: formData.portfolio || null,
        user_id: formData.user_id ? parseInt(formData.user_id, 10) : undefined,
      };

      if (editingMember) {
        await membersAPI.update(editingMember.id, formData.subgroup_id, payload);
        setToast({ type: 'success', message: 'Member updated successfully' });
      } else {
        await membersAPI.create(formData.subgroup_id, payload);
        setToast({ type: 'success', message: 'Member created successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Failed to save member'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await membersAPI.delete(memberId);
      setToast({ type: 'success', message: 'Member removed successfully' });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete member' });
    }
  };

  const columns = [
    {
      header: 'Member',
      render: (m) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs overflow-hidden border border-amber-200">
            {m.avatar_url ? (
              <img src={getImageUrl(m.avatar_url)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{m.name?.charAt(0) || 'M'}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">{m.name}</p>
            <p className="text-[11px] text-gray-500">Joined: {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : 'Active'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Position',
      accessor: 'position',
      render: (m) => (
        <span className="font-medium text-gray-800 text-xs">{m.position || 'Member'}</span>
      ),
    },
    {
      header: 'Subgroup',
      render: (m) => (
        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          {m.sub_group || 'General'}
        </span>
      ),
    },
    {
      header: 'Socials & Portfolio',
      render: (m) => (
        <div className="flex items-center space-x-2 text-[11px]">
          {m.github && (
            <a
              href={m.github}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center space-x-0.5"
            >
              <span>GitHub</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
            </a>
          )}
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-0.5"
            >
              <span>LinkedIn</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
            </a>
          )}
          {m.portfolio && (
            <a
              href={m.portfolio}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:text-emerald-800 inline-flex items-center space-x-0.5"
            >
              <span>Portfolio</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Club Members Directory"
        subtitle="Manage active club members and assign them to specialized AI subgroups."
        searchPlaceholder="Search members..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Add Member"
        columns={columns}
        data={members}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        filterComponent={
          <select
            value={selectedSubgroup}
            onChange={(e) => setSelectedSubgroup(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subgroups</option>
            {subgroups.map((sg) => (
              <option key={sg.id} value={sg.id}>
                {sg.name}
              </option>
            ))}
          </select>
        }
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Member"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Member"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Member Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Member Profile' : 'Add New Club Member'}
        subtitle="Assign member position, subgroup, and professional portfolio links."
        onSubmit={handleSubmit}
        submitText={editingMember ? 'Save Changes' : 'Create Member'}
        submitting={submitting}
      >
        {!editingMember && users.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select User (Optional - default is current admin)</label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Current Logged-in User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Position / Role *</label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="e.g. Lead Researcher, ML Engineer"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Subgroup *</label>
            <select
              required
              value={formData.subgroup_id}
              onChange={(e) => setFormData({ ...formData, subgroup_id: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Subgroup --</option>
              {subgroups.map((sg) => (
                <option key={sg.id} value={sg.id}>
                  {sg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Personal Portfolio / Website</label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
            placeholder="https://myportfolio.dev"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
