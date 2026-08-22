import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { membersAPI } from '../api/members';
import { subgroupsAPI } from '../api/subgroups';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    position: '',
    subgroup_id: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersData, subgroupsData] = await Promise.all([
        membersAPI.getAll({
          skip: (page - 1) * 10,
          limit: 10,
          search: search || undefined
        }),
        subgroupsAPI.getAll(),
      ]);
      const limit = 10;
      setMembers(membersData.results || []);
      setTotalPages(membersData.total ? Math.ceil(membersData.total / limit) : 1);
      setTotalItems(membersData.total || 0);
      setSubgroups(Array.isArray(subgroupsData) ? subgroupsData : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch members data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, selectedSubgroup]);

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    const sgObj = subgroups.find((s) => s.name === member.sub_group);
    setFormData({
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
      };

      if (editingMember) {
        await membersAPI.update(editingMember.id, formData.subgroup_id, payload);
        setToast({ type: 'success', message: 'Member updated successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.detail || 'Action failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this member? This action cannot be undone.')) return;
    try {
      await membersAPI.delete(id);
      setToast({ type: 'success', message: 'Member deleted successfully' });
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
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs overflow-hidden border border-blue-200">
            {m.user?.avatar_url ? (
              <img src={getImageUrl(m.user.avatar_url)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{m.user?.first_name?.charAt(0) || 'M'}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">
              {m.user?.first_name} {m.user?.last_name}
            </p>
            <p className="text-[11px] text-gray-500 font-mono">@{m.user?.user_name}</p>
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

      {/* Edit Member Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Member Profile"
        subtitle="Assign member position, subgroup, and professional portfolio links."
        onSubmit={handleSubmit}
        submitText="Save Changes"
        submitting={submitting}
      >
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
