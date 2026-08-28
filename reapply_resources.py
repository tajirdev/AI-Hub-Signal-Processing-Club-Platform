import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add getSubgroups import
text = text.replace(
    'uploadContentMedia } from',
    'uploadContentMedia, getSubgroups } from'
)

# 2. Add resources config
old_config = """    blogs: {
      endpoint: "blog-posts",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "content", label: "Content", type: "textarea", required: true },
        { name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" },
        { name: "cover_image", label: "Cover Image / Document", type: "file", accept: "image/*,application/pdf" }
      ]
    }
  };"""

new_config = """    blogs: {
      endpoint: "blog-posts",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "content", label: "Content", type: "textarea", required: true },
        { name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" },
        { name: "cover_image", label: "Cover Image / Document", type: "file", accept: "image/*,application/pdf" }
      ]
    },
    resources: {
      endpoint: "resources",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "type", label: "Type", type: "select", options: ["PDF", "PRESENTATION", "DATASET", "VIDEO", "EXTERNAL_LINK"], default: "PDF" },
        { name: "external_url", label: "External URL (if link)", type: "url" },
        { name: "subgroup_id", label: "Subgroup", type: "dynamic_select_subgroup", required: true },
        { name: "cover_image", label: "Upload File", type: "file", accept: "*/*" }
      ]
    }
  };"""

text = text.replace(old_config, new_config)

# 3. Add subgroups state
text = text.replace(
    'const [categories, setCategories] = useState([]);',
    'const [categories, setCategories] = useState([]);\n  const [subgroups, setSubgroups] = useState([]);'
)

# 4. Update useEffect for fetching options
old_effect = """  useEffect(() => {
    // Fetch categories if the form requires them
    const hasCategoryField = config.fields.some(f => f.type === 'dynamic_select');
    if (hasCategoryField) {
      getCategories().then(setCategories).catch(console.error);
    }
  }, [categoryId]);"""

new_effect = """  useEffect(() => {
    // Fetch options if the form requires them
    const hasCategoryField = config.fields.some(f => f.type === 'dynamic_select');
    if (hasCategoryField) {
      getCategories().then(setCategories).catch(console.error);
    }
    const hasSubgroupField = config.fields.some(f => f.type === 'dynamic_select_subgroup');
    if (hasSubgroupField) {
      getSubgroups().then(setSubgroups).catch(console.error);
    }
  }, [categoryId]);"""

text = text.replace(old_effect, new_effect)

# 5. Update render to handle dynamic_select_subgroup
old_render = """                ) : field.type === 'dynamic_select' ? (
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
                  </select>"""

new_render = """                ) : field.type === 'dynamic_select' || field.type === 'dynamic_select_subgroup' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all"
                  >
                    <option value="">{field.type === 'dynamic_select' ? '-- Select Category (Optional) --' : '-- Select Subgroup --'}</option>
                    {(field.type === 'dynamic_select' ? categories : subgroups).map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>"""

text = text.replace(old_render, new_render)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
