import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { researchAPI } from '../api/research';
import { membersAPI } from '../api/members';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFlask, faFilePdf, faStar, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

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
    pdf_url: '',
    publication_date: '',
    is_featured: false,
    authors: [],
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
        membersAPI.getAll(),
      ]);

      if (resRes && resRes.research) {
        setResearchList(resRes.research);
        setTotalPages(resRes.total_pages || 1);
        setTotalItems(resRes.total || 0);
      } else if (Array.isArray(resRes)) {
        setResearchList(resRes);
        setTotalPages(1);
        setTotalItems(resRes.length);
      } else {
        setResearchList([]);
      }

      setMembers(memRes && memRes.member ? memRes.member : Array.isArray(memRes) ? memRes : []);
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
      pdf_url: '',
      publication_date: new Date().toISOString().slice(0, 10),
      is_featured: false,
      authors: members[0]?.id ? [{ member_id: members[0].id, order: 1 }] : [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (paper) => {
    setEditingResearch(paper);
    setFormData({
      title: paper.title || '',
      abstract: paper.abstract || '',
      content: paper.content || '',
      pdf_url: paper.pdf_url || '',
      publication_date: paper.publication_date ? new Date(paper.publication_date).toISOString().slice(0, 10) : '',
      is_featured: paper.is_featured ?? false,
      authors: Array.isArray(paper.authors) && paper.authors.length > 0
        ? paper.authors.map((a, i) => ({
            member_id: a.member_id || a.id,
            order: a.order || i + 1,
          }))
        : [],
    });
    setIsModalOpen(true);
  };

  const handleAddAuthor = () => {
    if (members.length === 0) return;
    setFormData({
      ...formData,
      authors: [
        ...formData.authors,
        { member_id: members[0].id, order: formData.authors.length + 1 },
      ],
    });
  };

  const handleRemoveAuthor = (index) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, idx) => idx !== index),
    });
  };

  const handleAuthorChange = (index, field, value) => {
    const updated = [...formData.authors];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, authors: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        publication_date: formData.publication_date
          ? new Date(formData.publication_date).toISOString()
          : null,
      };

      if (editingResearch) {
        await researchAPI.update(editingResearch.id, payload);
        setToast({ type: 'success', message: 'Research paper updated' });
      } else {
        await researchAPI.create(payload);
        setToast({ type: 'success', message: 'Research paper published' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : 'Failed to save research paper',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this research publication?')) return;
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
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-bold text-gray-900 text-xs line-clamp-1">{r.title}</p>
              {r.is_featured && (
                <span className="text-amber-500 text-xs" title="Featured Publication">
                  <FontAwesomeIcon icon={faStar} />
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 line-clamp-1">{r.abstract}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Authors',
      render: (r) => (
        <div className="text-[11px] text-gray-600 font-medium">
          {Array.isArray(r.authors) && r.authors.length > 0 ? (
            <span>{r.authors.map((a) => a.name || `Member #${a.member_id}`).join(', ')}</span>
          ) : (
            <span className="text-gray-400">Club Research Team</span>
          )}
        </div>
      ),
    },
    {
      header: 'Document',
      render: (r) =>
        r.pdf_url ? (
          <a
            href={r.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="text-red-600 hover:text-red-800 text-[11px] font-semibold inline-flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faFilePdf} />
            <span>Read PDF</span>
          </a>
        ) : (
          <span className="text-[11px] text-gray-400">No PDF</span>
        ),
    },
    {
      header: 'Publication Date',
      render: (r) => (
        <span className="text-[11px] text-gray-500 font-medium">
          {r.publication_date ? new Date(r.publication_date).toLocaleDateString() : 'Unpublished'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Research Papers & Publications"
        subtitle="Manage peer-reviewed articles, preprint drafts, and laboratory findings."
        searchPlaceholder="Search research..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Publish Paper"
        columns={columns}
        data={researchList}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Paper"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Paper"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Research Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResearch ? 'Edit Research Paper' : 'Publish Academic Paper'}
        subtitle="Enter abstract, publication details, and assign member authors."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Date</label>
            <input
              type="date"
              value={formData.publication_date}
              onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">PDF File URL</label>
            <input
              type="url"
              value={formData.pdf_url}
              onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
              placeholder="https://arxiv.org/pdf/... or cloud link"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Feature this paper on platform spotlight</span>
          </label>
        </div>

        {/* Dynamic Authors Section */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-800">Co-Authors & Order</label>
            <button
              type="button"
              onClick={handleAddAuthor}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              <span>Add Author</span>
            </button>
          </div>

          {formData.authors.map((auth, idx) => (
            <div key={idx} className="flex items-center space-x-3 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="flex-1">
                <select
                  value={auth.member_id}
                  onChange={(e) => handleAuthorChange(idx, 'member_id', parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  value={auth.order}
                  onChange={(e) => handleAuthorChange(idx, 'order', parseInt(e.target.value, 10))}
                  placeholder="Order"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-center"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAuthor(idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Abstract *</label>
          <textarea
            rows="3"
            required
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            placeholder="Executive summary of the methodology and results..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Text Content</label>
          <textarea
            rows="6"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Introduction, literature review, equations, conclusions..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
