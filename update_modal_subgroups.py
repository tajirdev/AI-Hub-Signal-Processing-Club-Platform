import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add subgroups state
if 'const [subgroups, setSubgroups]' not in text:
    text = text.replace(
        'const [categories, setCategories] = useState([]);',
        'const [categories, setCategories] = useState([]);\n  const [subgroups, setSubgroups] = useState([]);'
    )

# Fetch subgroups
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

# Update render
old_render = """                ) : field.type === 'dynamic_select' || field.type === 'dynamic_select_subgroup' ? (
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
