import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { researchAPI } from '../api/research';
import { membersAPI } from '../api/members';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faFlask,
  faFilePdf,
  faStar,
  faPlus,
  faMinus,
  faCheckCircle,
  faClock,
  faExternalLinkAlt,
  faGlobe,
  faLock,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function Research() {
  const [researchList, setResearchList] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '',
    file: null,
    is_published: true,
    publication_date: '',
    featured: false,
    author_ids: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, memRes] = await Promise.all([
        researchAPI.getAll({
          page,
          limit: 10,
          search: search || undefined,
        }),
        membersAPI.getAll().catch(() => ({ results: [] })),
      ]);

      if (resRes && (resRes.items || resRes.research)) {
        setResearchList(resRes.items || resRes.research);
        
        setTotalPages(resRes.total_pages || 1);
        setTotalItems(resRes.total || 0);
      } else if (Array.isArray(resRes)) {
        setResearchList(resRes);
        setTotalPages(1);
        setTotalItems(resRes.length);
      } else {
        setResearchList([]);
      }

      const memList = memRes && Array.isArray(memRes.results)
        ? memRes.results
        : (Array.isArray(memRes) ? memRes : []);
      setMembers(memList);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch research papers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleOpenCreate = () => {
    setEditingResearch(null);
    setFormData({
      title: '',
      abstract: '',
      content: '',
      file: null,
      is_published: true,
      publication_date: new Date().toISOString().slice(0, 10),
      featured: false,
      author_ids: members.length > 0 ? [members[0].id] : [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (paper) => {
    setEditingResearch(paper);
    const existingAuthorIds = paper.authors && paper.authors.length > 0
      ? paper.authors.sort((a, b) => a.author_order - b.author_order).map((a) => a.member_id)
      : (members.length > 0 ? [members[0].id] : []);

    let pubDateFormatted = '';
    if (paper.publication_date) {
      try {
        pubDateFormatted = new Date(paper.publication_date).toISOString().slice(0, 10);
      } catch {
        pubDateFormatted = '';
      }
    }

    setFormData({
      title: paper.title || '',
      abstract: paper.abstract || '',
      content: paper.content || '',
      file: null,
      is_published: Boolean(paper.is_published),
      publication_date: pubDateFormatted,
      featured: paper.featured === 'True' || paper.featured === true,
      author_ids: existingAuthorIds,
    });
    setIsModalOpen(true);
  };

  const handleAddAuthor = () => {
    if (members.length === 0) return;
    setFormData({
      ...formData,
      author_ids: [...formData.author_ids, members[0].id],
    });
  };

  const handleRemoveAuthor = (index) => {
    setFormData({
      ...formData,
      author_ids: formData.author_ids.filter((_, idx) => idx !== index),
    });
  };

  const handleAuthorChange = (index, memberId) => {
    const updated = [...formData.author_ids];
    updated[index] = memberId;
    setFormData({ ...formData, author_ids: updated });
  };

  const handleTogglePublish = async (paper) => {
    try {
      const willPublish = !paper.is_published;
      await researchAPI.togglePublish(paper.id, paper.is_published);
      setToast({
        type: 'success',
        message: willPublish ? 'Research paper published successfully!' : 'Research paper reverted to draft.',
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to update publication status' });
    }
  };

  const handleDeleteFile = async (paperId) => {
    if (!window.confirm('Are you sure you want to remove the PDF document from this research?')) return;
    try {
      await researchAPI.deleteFile(paperId);
      setToast({ type: 'success', message: 'PDF document removed' });
      if (editingResearch) {
        setEditingResearch({ ...editingResearch, file: null, file_id: null });
      }
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete PDF file' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.title.trim().length < 3) {
      setToast({ type: 'error', message: 'Title must be at least 3 characters long.' });
      return;
    }
    if (formData.abstract && formData.abstract.trim().length < 10) {
      setToast({ type: 'error', message: 'Abstract must be at least 10 characters long.' });
      return;
    }
    if (!formData.author_ids || formData.author_ids.length === 0) {
      setToast({ type: 'error', message: 'Please select at least one member author.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        abstract: formData.abstract.trim(),
        content: formData.content.trim() || 'Full research methodology, analysis, and results.',
        featured: Boolean(formData.featured),
        is_published: Boolean(formData.is_published),
        publication_date: formData.publication_date
          ? new Date(formData.publication_date).toISOString()
          : (formData.is_published ? new Date().toISOString() : null),
        author_ids: formData.author_ids.map((id) => parseInt(id, 10)),
      };

      let targetId;
      if (editingResearch) {
        targetId = editingResearch.id;
        await researchAPI.update(targetId, payload);
        setToast({ type: 'success', message: 'Research paper updated successfully' });
      } else {
        const res = await researchAPI.create(payload);
        targetId = res.id;
        setToast({ type: 'success', message: 'Research paper published successfully' });
      }

      if (formData.file && targetId) {
        await researchAPI.uploadFile(targetId, formData.file);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string'
          ? detail
          : (Array.isArray(detail) ? detail.map((d) => d.msg).join(', ') : 'Failed to save research paper'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this research publication?')) return;
    try {
      await researchAPI.delete(id);
      setToast({ type: 'success', message: 'Research paper deleted' });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete research paper' });
    }
  };

  const columns = [
    {
      header: 'Research Publication',
      render: (r) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
            <FontAwesomeIcon icon={faFlask} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-bold text-gray-900 text-xs truncate max-w-md" title={r.title}>
                {r.title}
              </p>
              {(r.featured === 'True' || r.featured === true) && (
                <span className="text-amber-500 text-xs" title="Featured Spotlight">
                  <FontAwesomeIcon icon={faStar} />
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 line-clamp-1 max-w-md">{r.abstract}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Authors',
      render: (r) => (
        <div className="text-[11px] text-gray-600 font-medium max-w-xs truncate">
          {Array.isArray(r.authors) && r.authors.length > 0 ? (
            <span>
              {r.authors
                .map((a) => {
                  const m = members.find((mem) => mem.id === (a.member_id || a.id));
                  return m ? m.name : `Member #${a.member_id || a.id}`;
                })
                .join(', ')}
            </span>
          ) : (
            <span className="text-gray-400 italic">Club Research Team</span>
          )}
        </div>
      ),
    },
    {
      header: 'PDF Document',
      render: (r) => {
        if (r.file && r.file.path) {
          const fileUrl = getImageUrl(r.file.path);
          return (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900 rounded-lg text-[11px] font-semibold transition-colors border border-red-200/60 shadow-sm"
              title={r.file.original_filename || 'View PDF Document'}
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />
              <span className="truncate max-w-[110px]">{r.file.original_filename || 'PDF Ready'}</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px] opacity-60" />
            </a>
          );
        }
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] text-gray-400 font-medium">
            <span>No PDF</span>
          </span>
        );
      },
    },
    {
      header: 'Status',
      render: (r) => (
        <span
          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            r.is_published
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          <FontAwesomeIcon icon={r.is_published ? faGlobe : faLock} className="text-[10px]" />
          <span>{r.is_published ? 'Published' : 'Draft'}</span>
        </span>
      ),
    },
    {
      header: 'Publication Date',
      render: (r) => (
        <span className="text-[11px] text-gray-600 font-medium">
          {r.publication_date
            ? new Date(r.publication_date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : <span className="text-gray-400 italic">Not set</span>}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Research Papers & Publications"
        subtitle="Manage peer-reviewed articles, laboratory findings, preprint manuscripts, and PDF documents."
        searchPlaceholder="Search research by title or abstract..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Publish New Paper"
        columns={columns}
        data={researchList}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1.5">
            <button
              onClick={() => handleTogglePublish(row)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center space-x-1 ${
                row.is_published
                  ? 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-700 border border-gray-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              }`}
              title={row.is_published ? 'Unpublish Paper (Revert to Draft)' : 'Publish Paper (Make Live)'}
            >
              <FontAwesomeIcon icon={row.is_published ? faClock : faCheckCircle} />
              <span>{row.is_published ? 'Unpublish' : 'Publish'}</span>
            </button>

            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Publication"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>

            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Publication"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Research Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResearch ? 'Edit Research Publication' : 'Publish Academic Paper'}
        subtitle="Manage abstract, member authors, publication date, and upload PDF to object storage."
        onSubmit={handleSubmit}
        submitText={editingResearch ? 'Save Changes' : 'Publish Paper'}
        submitting={submitting}
        maxWidth="max-w-2xl"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Paper Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Robust Feature Extraction for Speech Signal Denoising"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Publication Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Date</label>
            <input
              type="date"
              value={formData.publication_date}
              onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
            <span className="text-[10px] text-gray-400">Date visible to public readers</span>
          </div>

          <div className="flex flex-col justify-center space-y-2 pt-1">
            <label className="flex items-center space-x-2 text-xs font-semibold text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Live & Published for All Readers</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Feature on platform spotlight</span>
            </label>
          </div>
        </div>

        {/* Object Storage PDF Upload / Status */}
        <div className="border border-gray-200 rounded-xl p-3.5 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-800 flex items-center space-x-1.5">
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
              <span>Research PDF Manuscript (Object Storage)</span>
            </label>
            {editingResearch?.file && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                PDF Attached
              </span>
            )}
          </div>

          {editingResearch?.file && (
            <div className="flex items-center justify-between p-2.5 bg-red-50/60 border border-red-100 rounded-lg text-xs">
              <div className="flex items-center space-x-2 truncate">
                <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-base" />
                <div className="truncate">
                  <p className="font-semibold text-gray-900 truncate text-[11px]">
                    {editingResearch.file.original_filename || 'research_manuscript.pdf'}
                  </p>
                  <a
                    href={getImageUrl(editingResearch.file.path)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>View currently uploaded PDF</span>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[8px]" />
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteFile(editingResearch.id)}
                className="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded text-[11px] font-bold flex items-center space-x-1 transition-colors"
                title="Remove attached PDF"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <span>Remove</span>
              </button>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">
              {editingResearch?.file ? 'Upload Replacement PDF File' : 'Upload PDF File'}
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Dynamic Authors Section */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-800">Member Authors *</label>
            <button
              type="button"
              onClick={handleAddAuthor}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              <span>Add Author</span>
            </button>
          </div>

          {formData.author_ids.map((authId, idx) => (
            <div key={idx} className="flex items-center space-x-3 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="flex-1">
                <select
                  value={authId}
                  onChange={(e) => handleAuthorChange(idx, parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.position || m.role})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAuthor(idx)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Author"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-700">Abstract *</label>
            <span className="text-[10px] text-gray-400">{formData.abstract.length}/1000 characters</span>
          </div>
          <textarea
            rows="3"
            required
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            placeholder="Executive summary of the research methodology, problem statement, and findings..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Text Content</label>
          <textarea
            rows="5"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Introduction, methodology, equations, benchmarks, discussions, conclusions..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
