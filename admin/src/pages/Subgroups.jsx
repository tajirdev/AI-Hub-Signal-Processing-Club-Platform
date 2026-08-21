import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { subgroupsAPI } from '../api/subgroups';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faImage, faUpload } from '@fortawesome/free-solid-svg-icons';

export default function Subgroups() {
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Subgroup Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubgroup, setEditingSubgroup] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Media Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSubgroup, setUploadSubgroup] = useState(null);
  const [uploadType, setUploadType] = useState('cover'); // 'cover' or 'icon'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchSubgroups = async () => {
    setLoading(true);
    try {
      const data = await subgroupsAPI.getAll();
      setSubgroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch subgroups' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubgroups();
  }, []);

  const handleOpenCreate = () => {
    setEditingSubgroup(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sg) => {
    setEditingSubgroup(sg);
    setFormData({
      name: sg.name || '',
      description: sg.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description && formData.description.length < 30) {
      setToast({ type: 'error', message: 'Description must be at least 30 characters' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      if (editingSubgroup) {
        await subgroupsAPI.update(editingSubgroup.id, payload);
        setToast({ type: 'success', message: 'Subgroup updated successfully' });
      } else {
        await subgroupsAPI.create(payload);
        setToast({ type: 'success', message: 'Subgroup created successfully' });
      }
      setIsModalOpen(false);
      fetchSubgroups();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Failed to save subgroup'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subgroup?')) return;
    try {
      await subgroupsAPI.delete(id);
      setToast({ type: 'success', message: 'Subgroup deleted successfully' });
      fetchSubgroups();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete subgroup' });
    }
  };

  const handleOpenUpload = (sg, type) => {
    setUploadSubgroup(sg);
    setUploadType(type);
    setSelectedFile(null);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadSubgroup) return;
    setUploading(true);
    try {
      if (uploadType === 'cover') {
        await subgroupsAPI.uploadCover(uploadSubgroup.id, selectedFile);
        setToast({ type: 'success', message: 'Cover image uploaded successfully' });
      } else {
        await subgroupsAPI.uploadIcon(uploadSubgroup.id, selectedFile);
        setToast({ type: 'success', message: 'Icon uploaded successfully' });
      }
      setIsUploadOpen(false);
      fetchSubgroups();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to upload media' });
    } finally {
      setUploading(false);
    }
  };

  const filteredSubgroups = subgroups.filter((sg) => {
    const term = search.toLowerCase();
    return (
      (sg.name || '').toLowerCase().includes(term) ||
      (sg.description || '').toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      header: 'Subgroup',
      render: (sg) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm overflow-hidden border border-purple-200">
            {sg.icon_url ? (
              <img src={getImageUrl(sg.icon_url)} alt="Icon" className="w-full h-full object-cover" />
            ) : (
              <span>{sg.name?.charAt(0) || 'S'}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">{sg.name}</p>
            <p className="text-[11px] text-gray-500 font-mono">slug: {sg.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      render: (sg) => (
        <p className="text-xs text-gray-600 line-clamp-2 max-w-md">
          {sg.description || 'No description provided.'}
        </p>
      ),
    },
    {
      header: 'Media Assets',
      render: (sg) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenUpload(sg, 'cover')}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors flex items-center space-x-1 border ${
              sg.cover_image_url
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faImage} />
            <span>Cover</span>
          </button>
          <button
            onClick={() => handleOpenUpload(sg, 'icon')}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors flex items-center space-x-1 border ${
              sg.icon_url
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faUpload} />
            <span>Icon</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Specialized AI Subgroups"
        subtitle="Manage focus areas (Computer Vision, NLP, Robotics, Bio-signals, etc.)."
        searchPlaceholder="Search subgroups..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Create Subgroup"
        columns={columns}
        data={filteredSubgroups}
        loading={loading}
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Subgroup"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Subgroup"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Subgroup Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubgroup ? 'Edit Subgroup' : 'Create Specialized Subgroup'}
        subtitle="Specify subgroup name and domain description."
        onSubmit={handleSubmit}
        submitText={editingSubgroup ? 'Save Changes' : 'Create Group'}
        submitting={submitting}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Subgroup Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Signal & Audio Processing"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description (at least 30 characters) *</label>
          <textarea
            rows="4"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Objectives, scope, and target research domains (min 30 characters)..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </Modal>

      {/* Upload Media Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title={`Upload Subgroup ${uploadType === 'cover' ? 'Cover Image' : 'Icon'}`}
        subtitle={`Select an image file for "${uploadSubgroup?.name}".`}
        onSubmit={handleUploadSubmit}
        submitText="Upload Image"
        submitting={uploading}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Select Image File</label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <p className="text-[11px] text-gray-400 mt-2">Recommended formats: PNG, JPG, WEBP.</p>
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
