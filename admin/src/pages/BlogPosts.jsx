import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { blogAPI } from '../api/blog';
import { categoriesAPI } from '../api/categories';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faImage, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';

export default function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category_id: '',
    status: 'draft',
  });

  // Cover Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPost, setUploadPost] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [blogRes, catRes] = await Promise.all([
        blogAPI.getAll({
          page,
          limit: 10,
          search: search || undefined,
          category_id: selectedCategory || undefined,
          status: selectedStatus || undefined,
        }),
        categoriesAPI.getAll(),
      ]);

      if (blogRes && blogRes.posts) {
        setPosts(blogRes.posts);
        setTotalPages(blogRes.total_pages || 1);
        setTotalItems(blogRes.total || 0);
      } else if (Array.isArray(blogRes)) {
        setPosts(blogRes);
        setTotalPages(1);
        setTotalItems(blogRes.length);
      } else {
        setPosts([]);
      }

      setCategories(Array.isArray(catRes) ? catRes : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch blog posts' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, selectedCategory, selectedStatus]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      category_id: categories[0]?.id || '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    const catId = post.categories && post.categories.length > 0 ? post.categories[0].id : (post.category_id || categories[0]?.id || '');
    setFormData({
      title: post.title || '',
      summary: post.excerpt || post.summary || '',
      content: post.content || '',
      category_id: catId,
      status: post.status || 'draft',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.content && formData.content.length < 100) {
      setToast({ type: 'error', message: 'Article content must be at least 100 characters.' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        excerpt: formData.summary || null,
        content: formData.content,
        category_ids: formData.category_id ? [parseInt(formData.category_id, 10)] : [],
        status: formData.status || 'draft',
      };

      if (editingPost) {
        await blogAPI.update(editingPost.id, payload);
        setToast({ type: 'success', message: 'Blog post updated successfully' });
      } else {
        await blogAPI.create(payload);
        setToast({ type: 'success', message: 'Blog post created successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Failed to save blog post'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogAPI.delete(id);
      setToast({ type: 'success', message: 'Blog post deleted successfully' });
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete blog post' });
    }
  };

  const handleOpenUpload = (post) => {
    setUploadPost(post);
    setCoverFile(null);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile || !uploadPost) return;
    setUploading(true);
    try {
      await blogAPI.uploadCover(uploadPost.id, coverFile);
      setToast({ type: 'success', message: 'Featured cover image uploaded' });
      setIsUploadOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to upload cover image' });
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      header: 'Article',
      render: (p) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400">
            {p.cover_image_url ? (
              <img
                src={getImageUrl(p.cover_image_url)}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faImage} />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs line-clamp-1">{p.title}</p>
            <p className="text-[11px] text-gray-500 line-clamp-1">{p.excerpt || p.summary}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (p) => {
        const catNames = p.categories && p.categories.length > 0
          ? p.categories.map((c) => c.name).join(', ')
          : categories.find((c) => c.id === p.category_id)?.name;
        return (
          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {catNames || 'General'}
          </span>
        );
      },
    },
    {
      header: 'Status',
      render: (p) => (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
            p.status === 'published'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          <FontAwesomeIcon icon={p.status === 'published' ? faCheck : faClock} className="text-[10px]" />
          <span>{p.status}</span>
        </span>
      ),
    },
    {
      header: 'Published',
      render: (p) => (
        <span className="text-[11px] text-gray-500 font-medium">
          {p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Editorial & Blog Posts"
        subtitle="Manage technical articles, tutorial writeups, and publish club insights."
        searchPlaceholder="Search posts..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Write Article"
        columns={columns}
        data={posts}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        filterComponent={
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        }
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
              title="Edit Post"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Post"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? 'Edit Blog Post' : 'Compose New Blog Post'}
        subtitle="Provide article details, category, and markdown content."
        onSubmit={handleSubmit}
        submitText={editingPost ? 'Update Post' : 'Publish Article'}
        submitting={submitting}
        maxWidth="max-w-2xl"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Article Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Deep Residual Learning in Audio Signal Enhancement"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Publishing Status *</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="published">Published (Public)</option>
              <option value="draft">Draft (Private)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Article Summary / Excerpt *</label>
          <textarea
            rows="2"
            required
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="A concise synopsis of the post displayed on listings..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Article Body Content (at least 100 characters) *</label>
          <textarea
            rows="8"
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Detailed writeup, code snippets, formulas, and findings (min 100 characters)..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />
        </div>
      </Modal>

      {/* Upload Cover Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Featured Cover Image"
        subtitle={`Select a cover image for "${uploadPost?.title}".`}
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
