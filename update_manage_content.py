import re

filepath = 'frontend/src/features/members/components/ManageContentTab.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add imports
if 'ContentFormModal' not in text:
    text = text.replace(
        "import { FileText, Calendar, Rss, Code, BookOpen, Edit, Trash2, Plus } from 'lucide-react';",
        "import { FileText, Calendar, Rss, Code, BookOpen, Edit, Trash2, Plus, Loader2 } from 'lucide-react';\nimport { ContentFormModal } from './ContentFormModal';\nimport { deleteContent } from '../../../services/endpoints';"
    )

# Add state and handlers
state_code = """export function ManageContentTab({ profile }) {
  const [activeCategory, setActiveCategory] = useState("events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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
  };"""

text = re.sub(r'export function ManageContentTab\(\{ profile \}\) \{\s*const \[activeCategory, setActiveCategory\] = useState\("events"\);', state_code, text)

# Map endpoint into categories array
text = text.replace(
    "data: profile.events || [] }",
    "data: profile.events || [], endpoint: 'events' }"
).replace(
    "data: profile.news || [] }",
    "data: profile.news || [], endpoint: 'News' }"
).replace(
    "data: profile.projects || [] }",
    "data: profile.projects || [], endpoint: 'projects' }"
).replace(
    "data: profile.research || [] }",
    "data: profile.research || [], endpoint: 'research' }"
).replace(
    "data: profile.blogs || [] }",
    "data: profile.blogs || [], endpoint: 'blog-posts' }"
)


# Update Add Button
text = text.replace(
    """          <button className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add {currentCategory?.label.slice(0, -1)}
          </button>""",
    """          <button onClick={handleAdd} className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add {currentCategory?.label.slice(0, -1)}
          </button>"""
)

# Update Edit/Delete Buttons
text = text.replace(
    """                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>""",
    """                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(item)} className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(currentCategory.endpoint, item.id)} disabled={deletingId === item.id} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                      {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>"""
)

# Add ContentFormModal at the end
text = text.replace(
    """      </div>
    </div>
  );
}""",
    """      </div>

      <ContentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryId={activeCategory}
        editingItem={editingItem}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}"""
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
