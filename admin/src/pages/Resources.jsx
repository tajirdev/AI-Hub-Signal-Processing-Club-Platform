import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { resourcesAPI } from '../api/resources';
import { subgroupsAPI } from '../api/subgroups';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faFolderOpen,
  faFilePdf,
  faVideo,
  faDatabase,
  faCode,
  faLink,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'PDF',
    sub_group_id: '',
    url: '',
    file_url: '',
    is_public: true,
  });

  const resourceTypes = [
    { value: 'PDF', label: 'PDF Document', icon: faFilePdf, color: 'text-red-600 bg-red-50' },
    { value: 'VIDEO', label: 'Video Lecture', icon: faVideo, color: 'text-blue-600 bg-blue-50' },
    { value: 'DATASET', label: 'Dataset', icon: faDatabase, color: 'text-amber-600 bg-amber-50' },
    { value: 'CODE', label: 'Source Code / Notebook', icon: faCode, color: 'text-purple-600 bg-purple-50' },
    { value: 'EXTERNAL_LINK', label: 'External Resource', icon: faLink, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, sgRes] = await Promise.all([
        resourcesAPI.getAll({
          page,
          limit: 10,
          search: search || undefined,
          resource_type: selectedType || undefined,
        }),
        subgroupsAPI.getAll(),
      ]);

      if (resRes && resRes.resources) {
        setResources(resRes.resources);
        setTotalPages(resRes.total_pages || 1);
        setTotalItems(resRes.total || 0);
      } else if (Array.isArray(resRes)) {
        setResources(resRes);
        setTotalPages(1);
        setTotalItems(resRes.length);
      } else {
        setResources([]);
      }

      setSubgroups(Array.isArray(sgRes) ? sgRes : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch resources' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, selectedType]);

  const handleOpenCreate = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      resource_type: 'PDF',
      sub_group_id: subgroups[0]?.id || '',
      url: '',
      file_url: '',
      is_public: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditingResource(res);
    setFormData({
      title: res.title || '',
      description: res.description || '',
      resource_type: res.resource_type || 'PDF',
      sub_group_id: res.sub_group_id || subgroups[0]?.id || '',
      url: res.url || '',
      file_url: res.file_url || '',
      is_public: res.is_public ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingResource) {
        await resourcesAPI.update(editingResource.id, formData);
        setToast({ type: 'success', message: 'Resource updated successfully' });
      } else {
        await resourcesAPI.create(formData);
        setToast({ type: 'success', message: 'Resource added to library' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : 'Failed to save resource',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await resourcesAPI.delete(id);
      setToast({ type: 'success', message: 'Resource removed' });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete resource' });
    }
  };

  const columns = [
    {
      header: 'Resource',
      render: (r) => {
        const typeConfig = resourceTypes.find((t) => t.value === r.resource_type) || resourceTypes[0];
        return (
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${typeConfig.color}`}>
              <FontAwesomeIcon icon={typeConfig.icon} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs line-clamp-1">{r.title}</p>
              <p className="text-[11px] text-gray-500 line-clamp-1">{r.description}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Type',
      render: (r) => (
        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
          {r.resource_type}
        </span>
      ),
    },
    {
      header: 'Subgroup',
      render: (r) => {
        const sg = subgroups.find((s) => s.id === r.sub_group_id);
        return (
          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700">
            {sg ? sg.title : `Group #${r.sub_group_id}`}
          </span>
        );
      },
    },
    {
      header: 'Link',
      render: (r) => {
        const targetUrl = r.url || r.file_url;
        return targetUrl ? (
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold inline-flex items-center space-x-1"
          >
            <span>Open Link</span>
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
          </a>
        ) : (
          <span className="text-[11px] text-gray-400">None</span>
        );
      },
    },
    {
      header: 'Access',
      render: (r) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            r.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {r.is_public ? 'Public' : 'Members Only'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Learning Resources & Datasets Hub"
        subtitle="Manage study materials, lab code notebooks, datasets, and video lectures."
        searchPlaceholder="Search resources..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Add Resource"
        columns={columns}
        data={resources}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        filterComponent={
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {resourceTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        }
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Resource"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Resource"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Resource Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource ? 'Edit Resource' : 'Add Educational Resource'}
        subtitle="Enter resource URL, type, and associated subgroup."
        onSubmit={handleSubmit}
        submitText={editingResource ? 'Save Changes' : 'Add to Library'}
        submitting={submitting}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Resource Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Fourier Transform in Digital Signal Processing Lab Notebook"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Resource Type *</label>
            <select
              required
              value={formData.resource_type}
              onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {resourceTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subgroup *</label>
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
          <label className="block text-xs font-semibold text-gray-700 mb-1">Resource / File URL *</label>
          <input
            type="url"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://drive.google.com/... or https://github.com/..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Make this resource publicly downloadable</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
          <textarea
            rows="3"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description of contents, software tools required, and prerequisites..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
