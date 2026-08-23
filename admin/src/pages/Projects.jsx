import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { projectsAPI } from '../api/projects';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faLaptopCode, faExternalLinkAlt, faCodeBranch, faImage } from '@fortawesome/free-solid-svg-icons';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadProject, setUploadProject] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repository_url: '',
    demo_url: '',
    technology_stack: '',
    status: 'active',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsAPI.getAll({
        page,
        limit: 10,
        search: search || undefined,
      });

      if (data && data.projects) {
        setProjects(data.projects);
        setTotalPages(data.total_pages || 1);
        setTotalItems(data.total || 0);
      } else if (Array.isArray(data)) {
        setProjects(data);
        setTotalPages(1);
        setTotalItems(data.length);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch projects' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search]);

  const handleOpenUpload = (proj) => {
    setUploadProject(proj);
    setCoverFile(null);
    setIsUploadOpen(true);
  };
  
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile) return;
    setUploading(true);
    try {
      await projectsAPI.uploadCover(uploadProject.id, coverFile);
      setToast({ type: 'success', message: 'Project cover image uploaded' });
      setIsUploadOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to upload cover image' });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      repository_url: '',
      demo_url: '',
      technology_stack: 'Python, PyTorch, React',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      description: proj.description || '',
      repository_url: proj.repository_url || '',
      demo_url: proj.demo_url || '',
      technology_stack: proj.technology_stack || '',
      status: proj.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description && formData.description.length < 30) {
      setToast({ type: 'error', message: 'Description must be at least 30 characters.' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        repository_url: formData.repository_url || null,
        demo_url: formData.demo_url || null,
        technology_stack: formData.technology_stack || null,
        status: formData.status || 'active',
      };

      if (editingProject) {
        await projectsAPI.update(editingProject.id, payload);
        setToast({ type: 'success', message: 'Project updated successfully' });
      } else {
        await projectsAPI.create(payload);
        setToast({ type: 'success', message: 'Project added to showcase' });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Failed to save project'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setToast({ type: 'success', message: 'Project deleted successfully' });
      fetchProjects();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete project' });
    }
  };

  const columns = [
    {
      header: 'Project',
      render: (p) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400">
            {p.thumbnail ? (
              <img src={getImageUrl(p.thumbnail.path)} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={faImage} />
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-xs line-clamp-1">{p.title}</div>
            <div className="text-[11px] text-gray-500 line-clamp-1">{p.technology_stack || p.description}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Repositories & Links',
      render: (p) => (
        <div className="flex items-center space-x-3 text-[11px]">
          {p.repository_url ? (
            <a
              href={p.repository_url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-gray-900 inline-flex items-center space-x-1 font-mono font-medium"
            >
              <FontAwesomeIcon icon={faCodeBranch} className="text-gray-500" />
              <span>Source</span>
            </a>
          ) : (
            <span className="text-gray-400">No Repo</span>
          )}

          {p.demo_url && (
            <a
              href={p.demo_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1 font-medium"
            >
              <span>Live Demo</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (p) => (
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {p.status || 'Active'}
        </span>
      ),
    }];

  return (
    <div className="space-y-6">
      <DataTable
        title="Student & Research Projects"
        subtitle="Manage open-source solutions, hardware prototypes, and AI applications."
        searchPlaceholder="Search projects..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Add Project"
        columns={columns}
        data={projects}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={() => handleOpenUpload(row)}
              className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Upload Cover Image"
            >
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Project"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Project"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Project Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add Project to Showcase'}
        subtitle="Provide project repository, demo link, and description."
        onSubmit={handleSubmit}
        submitText={editingProject ? 'Save Changes' : 'Publish Project'}
        submitting={submitting}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Project Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Real-Time ECG Arrhythmia Detection System"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub / Code Repository URL</label>
            <input
              type="url"
              value={formData.repository_url}
              onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Live Demo URL</label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Technology Stack</label>
            <input
              type="text"
              value={formData.technology_stack}
              onChange={(e) => setFormData({ ...formData, technology_stack: e.target.value })}
              placeholder="e.g. PyTorch, FastAPI, React, Docker"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="active">Active (Showcased)</option>
              <option value="archived">Archived (Hidden)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description (at least 30 characters) *</label>
          <textarea
            rows="4"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tech stack, engineering approach, system architecture (min 30 characters)..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </Modal>


      {/* Upload Cover Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Project Cover Image"
        subtitle={uploadProject ? `Select a cover image for "${uploadProject.title}".` : "Select a cover image."}
        onSubmit={handleUploadSubmit}
        submitText="Upload Cover"
        submitting={uploading}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Select Image File</label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

    </div>
  );
}
