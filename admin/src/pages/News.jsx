import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { newsAPI } from '../api/news';
import { categoriesAPI } from '../api/categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faBullhorn, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    news_type: 'Announcement',
    status: 'published',
    category_id: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, catRes] = await Promise.all([
        newsAPI.getAll({
          page,
          limit: 10,
          search: search || undefined,
        }),
        categoriesAPI.getAll(),
      ]);

      if (newsRes && newsRes.news) {
        setNewsList(newsRes.news);
        setTotalPages(newsRes.total_pages || 1);
        setTotalItems(newsRes.total || 0);
      } else if (Array.isArray(newsRes)) {
        setNewsList(newsRes);
        setTotalPages(1);
        setTotalItems(newsRes.length);
      } else {
        setNewsList([]);
      }

      setCategories(Array.isArray(catRes) ? catRes : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch news' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleOpenCreate = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      news_type: 'Announcement',
      status: 'published',
      category_id: categories[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title || '',
      summary: item.summary || '',
      content: item.content || '',
      news_type: item.news_type || 'Announcement',
      status: item.status || 'published',
      category_id: item.category_id || categories[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        news_type: formData.news_type,
        status: formData.status,
        category_id: parseInt(formData.category_id, 10),
      };

      if (editingNews) {
        await newsAPI.update(editingNews.id, payload);
        setToast({ type: 'success', message: 'News article updated successfully' });
      } else {
        await newsAPI.create(payload);
        setToast({ type: 'success', message: 'News announcement published successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Failed to save news'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      await newsAPI.delete(id);
      setToast({ type: 'success', message: 'News deleted successfully' });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete news' });
    }
  };

  const columns = [
    {
      header: 'Announcement',
      render: (n) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
            <FontAwesomeIcon icon={faBullhorn} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs line-clamp-1">{n.title}</p>
            <p className="text-[11px] text-gray-500 line-clamp-1">{n.summary}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (n) => (
        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {n.category?.name || categories.find((c) => c.id === n.category_id)?.name || 'General'}
        </span>
      ),
    },
    {
      header: 'Type',
      render: (n) => (
        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
          {n.news_type}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (n) => (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
            n.status === 'published'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          <FontAwesomeIcon icon={n.status === 'published' ? faCheck : faClock} className="text-[10px]" />
          <span>{n.status}</span>
        </span>
      ),
    },
    {
      header: 'Published At',
      render: (n) => (
        <span className="text-[11px] text-gray-500 font-medium">
          {n.published_at ? new Date(n.published_at).toLocaleDateString() : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="News & Official Announcements"
        subtitle="Publish institutional news, competition results, and press updates."
        searchPlaceholder="Search news..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Post Announcement"
        columns={columns}
        data={newsList}
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
              title="Edit News"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete News"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* News Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNews ? 'Edit News Announcement' : 'Post Official Announcement'}
        subtitle="Provide news headline, summary, and article text."
        onSubmit={handleSubmit}
        submitText={editingNews ? 'Save Changes' : 'Broadcast News'}
        submitting={submitting}
        maxWidth="max-w-2xl"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Headline Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. MUST SigniAI Launches Regional Machine Learning Hackathon"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Type *</label>
            <input
              type="text"
              required
              value={formData.news_type}
              onChange={(e) => setFormData({ ...formData, news_type: e.target.value })}
              placeholder="Announcement, Press, Event"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status *</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Summary *</label>
          <textarea
            rows="2"
            required
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Brief preview of the news headline..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Content *</label>
          <textarea
            rows="6"
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Full announcement body..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
