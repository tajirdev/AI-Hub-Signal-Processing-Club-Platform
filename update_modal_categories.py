import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import for getCategories
if 'getCategories' not in text:
    text = text.replace(
        "import { createContent, updateContent } from '../../../services/endpoints';",
        "import { createContent, updateContent, getCategories } from '../../../services/endpoints';"
    )

# Update config for Events to use dynamic_select
old_event_fields = """    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "event_date", label: "Event Date", type: "date", required: true },
      { name: "registration_link", label: "Registration Link", type: "url" },
      { name: "category_id", label: "Category ID (Optional)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" }
    ]"""

new_event_fields = """    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "event_date", label: "Event Date", type: "date", required: true },
      { name: "registration_link", label: "Registration Link", type: "url" },
      { name: "category_id", label: "Category", type: "dynamic_select" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" }
    ]"""

text = text.replace(old_event_fields, new_event_fields)

# Update State and hook for fetching categories
old_state = """  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {"""

new_state = """  const [formData, setFormData] = useState({});
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

  useEffect(() => {"""

text = text.replace(old_state, new_state)


# Update the form renderer
old_renderer = """                ) : field.type === 'select' ? (
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
                ) : field.type === 'checkbox' ? ("""

new_renderer = """                ) : field.type === 'select' ? (
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
                ) : field.type === 'checkbox' ? ("""

text = text.replace(old_renderer, new_renderer)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

