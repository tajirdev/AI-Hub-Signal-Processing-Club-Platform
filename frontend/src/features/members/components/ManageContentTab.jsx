import React, { useState } from 'react';
import { FileText, Calendar, Rss, Code, BookOpen, Edit, Trash2, Plus, Loader2, FileArchive } from 'lucide-react';
import { ContentFormModal } from './ContentFormModal';
import { deleteContent } from '../../../services/endpoints';
import { useAuth } from '../../../contexts/AuthContext';

export function ManageContentTab({ profile }) {
  const [activeCategory, setActiveCategory] = useState("events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes('super_admin');

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    
    setDeletingId(id);
    try {
      await deleteContent(endpoint, id);
      window.location.reload(); // Quick refresh to show updated data
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  // The profile already has these nested arrays from GetSingle:
  const categories = [
    { id: "events", label: "Events", icon: Calendar, data: profile.events || [], endpoint: 'events' },
    { id: "news", label: "News", icon: Rss, data: profile.news || [], endpoint: 'News' },
    { id: "projects", label: "Projects", icon: Code, data: profile.projects || [], endpoint: 'projects' },
    ...(isSuperAdmin ? [{ id: "research", label: "Research", icon: BookOpen, data: profile.research || [], endpoint: 'research' }] : []),
    { id: "blogs", label: "Blogs", icon: FileText, data: profile.blogs || [], endpoint: 'blog-posts' },
    { id: "resources", label: "Resources", icon: FileArchive, data: profile.resources || [], endpoint: 'resources' },
  ];

  const currentCategory = categories.find(c => c.id === activeCategory);
  const items = currentCategory?.data || [];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar for Categories */}
      <div className="w-full md:w-48 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat.id 
                ? "bg-amber/10 text-amber dark:bg-amber/20" 
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
            <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs py-0.5 px-2 rounded-full">
              {cat.data.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
            Manage {currentCategory?.label}
          </h3>
          <button onClick={handleAdd} className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add {currentCategory?.label.slice(0, -1)}
          </button>
        </div>

        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {items.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <currentCategory.icon className="w-8 h-8 mb-3 opacity-20" />
              <p>You haven't posted any {currentCategory?.label.toLowerCase()} yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item, idx) => (
                <li key={`${item.type}-${item.id}-${idx}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-navy dark:text-white truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {item.status && item.status !== "active" && (
                        <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                          {item.status}
                        </span>
                      )}
                      {item.is_published === false && (
                        <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(item)} className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(currentCategory.endpoint, item.id)} disabled={deletingId === item.id} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                      {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ContentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryId={activeCategory}
        editingItem={editingItem}
        memberId={profile?.id}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
