import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { createContent, updateContent, getCategories, uploadContentMedia } from '../../../services/endpoints';

// Configuration for fields
const FORM_CONFIG = {
  events: {
    endpoint: "events",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "event_date", label: "Event Date", type: "date", required: true },
      { name: "registration_link", label: "Registration Link", type: "url" },
      { name: "category_id", label: "Category", type: "dynamic_select" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" },
      { name: "cover_image", label: "Cover Image", type: "file", accept: "image/*" }
    ]
  },
  projects: {
    endpoint: "projects",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "repository_url", label: "Repository URL", type: "url" },
      { name: "demo_url", label: "Demo URL", type: "url" },
      { name: "technology_stack", label: "Tech Stack (comma separated)", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["active", "completed", "archived"], default: "active" },
      { name: "cover_image", label: "Cover Image", type: "file", accept: "image/*" }
    ]
  },
  research: {
    endpoint: "research",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "abstract", label: "Abstract", type: "textarea", required: true },
      { name: "content", label: "Content (Markdown)", type: "textarea" },
      { name: "is_published", label: "Published?", type: "checkbox", default: false },
      { name: "cover_image", label: "Cover Image / Document", type: "file", accept: "image/*,application/pdf" }
    ]
  },
  news: {
    endpoint: "News",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "news_type", label: "News Type", type: "text", required: true },
      { name: "category_id", label: "Category", type: "dynamic_select" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" }
    ]
  },
  blogs: {
    endpoint: "blog-posts",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "is_published", label: "Published?", type: "checkbox", default: false },
      { name: "cover_image", label: "Cover Image / Document", type: "file", accept: "image/*,application/pdf" }
    ]
  }
};

export function ContentFormModal({ isOpen, onClose, categoryId, editingItem, onSuccess, memberId }) {
  if (!isOpen) return null;

  const config = FORM_CONFIG[categoryId];
  if (!config) return null;

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories if the form requires them
    const hasCategoryField = config.fields.some(f => f.type === 'dynamic_select');
    if (hasCategoryField) {
      getCategories().then(setCategories).catch(console.error);
    }
  }, [categoryId]);

  useEffect(() => {
    if (editingItem) {
      // Pre-fill form
      const initialData = {};
      config.fields.forEach(f => {
        initialData[f.name] = editingItem[f.name] ?? (f.default !== undefined ? f.default : "");
      });
      // Handle edge cases like dates
      if (initialData.event_date && initialData.event_date.includes('T')) {
        initialData.event_date = initialData.event_date.split('T')[0];
      }
      setFormData(initialData);
    } else {
      // Empty form
      const initialData = {};
      config.fields.forEach(f => {
        initialData[f.name] = f.default !== undefined ? f.default : (f.type === 'checkbox' ? false : "");
      });
      setFormData(initialData);
    }
    setError(null);
  }, [editingItem, categoryId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Only include fields defined in the config
      const payload = {};
      config.fields.forEach(f => {
        if (f.type === 'file') return; // Don't include files in JSON payload
        let val = formData[f.name];
        if (val === "") {
          val = null;
        } else if (f.name.endsWith("_id") && val !== null && val !== undefined) {
          val = parseInt(val, 10);
        }
        payload[f.name] = val;
      });
      
      // Inject author_ids for research if missing
      if (categoryId === 'research' && memberId) {
        payload.author_ids = [memberId];
      }
      
      

      let itemId = editingItem ? editingItem.id : null;
      if (editingItem) {
        await updateContent(config.endpoint, editingItem.id, payload);
      } else {
        const created = await createContent(config.endpoint, payload);
        itemId = created.id;
      }
      
      const fileField = config.fields.find(f => f.type === 'file');
      if (fileField && formData[fileField.name] instanceof File && itemId) {
        try {
          await uploadContentMedia(config.endpoint, itemId, formData[fileField.name]);
        } catch (uploadErr) {
          console.error("Upload failed", uploadErr);
          alert(`Success! However, the file upload failed. \n\nWarning: You likely uploaded an unsupported file format (e.g., a PDF instead of an image). \n\nThe content was saved, but the image was not attached.`);
        }
      }
      
      onSuccess();
    } catch (err) {
      console.error(err);
      let errorMsg = "An error occurred while saving.";
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map(e => `${e.loc ? e.loc.join('.') : 'field'}: ${e.msg}`).join(', ');
        } else if (typeof detail === 'string') {
          errorMsg = detail;
        } else {
          errorMsg = JSON.stringify(detail);
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#0a1628] rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-xl font-bold text-navy dark:text-white">
            {editingItem ? 'Edit' : 'Create'} {categoryId.slice(0, -1)}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form id="content-form" onSubmit={handleSubmit} className="space-y-5">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows="4"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all resize-y"
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
                  >
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                ) : field.type === 'dynamic_select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
                  >
                    <option value="">-- Select Category (Optional) --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber bg-gray-100 border-gray-300 rounded focus:ring-amber"
                  />
                ) : field.type === 'file' ? (
                  <input type="file" name={field.name} onChange={handleChange} required={field.required} accept={field.accept || "image/*,application/pdf"} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber/10 file:text-amber hover:file:bg-amber/20" />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
                  />
                )}
              </div>
            ))}
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-800/30 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            form="content-form"
            type="submit"
            disabled={loading}
            className="bg-navy dark:bg-amber hover:bg-navy-light dark:hover:bg-amber/90 text-white dark:text-navy px-6 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save {categoryId.slice(0, -1)}
          </button>
        </div>
      </div>
    </div>
  );
}
