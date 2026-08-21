import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { membersAPI } from '../api/members';
import { subgroupsAPI } from '../api/subgroups';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
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
    name: '',
    email: '',
    role: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    github_url: '',
    sub_group_id: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, subgroupsRes] = await Promise.all([
        membersAPI.getAll({
          page,
          limit: 10,
          search: search || undefined,
          subgroup_id: selectedSubgroup || undefined,
        }),
        subgroupsAPI.getAll(),
      ]);

      if (membersRes && membersRes.member) {
        setMembers(membersRes.member);
        setTotalPages(membersRes.total_pages || 1);
        setTotalItems(membersRes.total || 0);
      } else if (Array.isArray(membersRes)) {
        setMembers(membersRes);
        setTotalPages(1);
        setTotalItems(membersRes.length);
      } else {
        setMembers([]);
      }

      setSubgroups(Array.isArray(subgroupsRes) ? subgroupsRes : []);
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
      name: '',
      email: '',
      role: 'Member',
      bio: '',
      image_url: '',
      linkedin_url: '',
      github_url: '',
      sub_group_id: subgroups[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      role: member.role || '',
      bio: member.bio || '',
      image_url: member.image_url || '',
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      sub_group_id: member.sub_group_id || subgroups[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMember) {
        await membersAPI.update(editingMember.id, formData.sub_group_id, formData);
        setToast({ type: 'success', message: 'Member updated successfully' });
      } else {
        await membersAPI.create(formData.sub_group_id, formData);
        setToast({ type: 'success', message: 'Member created successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : 'Failed to save member',
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
            {m.image_url ? (
              <img src={m.image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{m.name?.charAt(0) || 'M'}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">{m.name}</p>
            <p className="text-[11px] text-gray-500">{m.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Position / Role',
      accessor: 'role',
      render: (m) => (
        <span className="font-medium text-gray-800 text-xs">{m.role || 'Member'}</span>
      ),
    },
    {
      header: 'Subgroup',
      render: (m) => {
        const sg = subgroups.find((s) => s.id === m.sub_group_id);
        return (
          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            {sg ? sg.title : `Group #${m.sub_group_id}`}
          </span>
        );
      },
    },
    {
      header: 'Socials',
      render: (m) => (
        <div className="flex items-center space-x-2 text-[11px]">
          {m.github_url && (
            <a
              href={m.github_url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center space-x-0.5"
            >
              <span>GitHub</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
            </a>
          )}
          {m.linkedin_url && (
            <a
              href={m.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-0.5"
            >
              <span>LinkedIn</span>
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
                {sg.title}
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
        subtitle="Enter the member information and assign their subgroup."
        onSubmit={handleSubmit}
        submitText={editingMember ? 'Save Changes' : 'Create Member'}
        submitting={submitting}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Position *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Lead Researcher, Software Engineer"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Subgroup *</label>
            <select
              required
              value={formData.sub_group_id}
              onChange={(e) => setFormData({ ...formData, sub_group_id: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {subgroups.map((sg) => (
                <option key={sg.id} value={sg.id}>
                  {sg.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Avatar Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Member Bio</label>
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
