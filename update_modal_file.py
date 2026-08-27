import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
if 'uploadContentMedia' not in text:
    text = text.replace(
        "import { createContent, updateContent, getCategories } from '../../../services/endpoints';",
        "import { createContent, updateContent, getCategories, uploadContentMedia } from '../../../services/endpoints';"
    )

# 2. Add file field to config
text = text.replace(
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" }',
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" },\n      { name: "cover_image", label: "Cover Image", type: "file" }'
)
text = text.replace(
    '{ name: "status", label: "Status", type: "select", options: ["active", "completed", "archived"], default: "active" }',
    '{ name: "status", label: "Status", type: "select", options: ["active", "completed", "archived"], default: "active" },\n      { name: "cover_image", label: "Cover Image", type: "file" }'
)
text = text.replace(
    '{ name: "is_published", label: "Published?", type: "checkbox", default: false }',
    '{ name: "is_published", label: "Published?", type: "checkbox", default: false },\n      { name: "cover_image", label: "Cover Image / Document", type: "file" }'
)
text = text.replace(
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" }',
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" },\n      { name: "cover_image", label: "Cover Image", type: "file" }'
)

# 3. Handle file input change
old_handle = """  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };"""

new_handle = """  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };"""

text = text.replace(old_handle, new_handle)

# 4. Handle file submit payload filtering
old_submit_payload = """      config.fields.forEach(f => {
        let val = formData[f.name];
        if (val === "") {
          val = null;
        } else if (f.name.endsWith("_id") && val !== null) {
          val = parseInt(val, 10);
        }
        payload[f.name] = val;
      });"""

new_submit_payload = """      config.fields.forEach(f => {
        if (f.type === 'file') return; // Don't include files in JSON payload
        let val = formData[f.name];
        if (val === "") {
          val = null;
        } else if (f.name.endsWith("_id") && val !== null && val !== undefined) {
          val = parseInt(val, 10);
        }
        payload[f.name] = val;
      });"""

text = text.replace(old_submit_payload, new_submit_payload)

# 5. Handle file submit
old_submit_action = """      if (editingItem) {
        await updateContent(config.endpoint, editingItem.id, payload);
      } else {
        await createContent(config.endpoint, payload);
      }
      
      onSuccess();"""

new_submit_action = """      let itemId = editingItem ? editingItem.id : null;
      if (editingItem) {
        await updateContent(config.endpoint, editingItem.id, payload);
      } else {
        const created = await createContent(config.endpoint, payload);
        itemId = created.id;
      }
      
      const fileField = config.fields.find(f => f.type === 'file');
      if (fileField && formData[fileField.name] instanceof File && itemId) {
        await uploadContentMedia(config.endpoint, itemId, formData[fileField.name]);
      }
      
      onSuccess();"""

text = text.replace(old_submit_action, new_submit_action)

# 6. Render file input
old_render_fallback = """                ) : (
                  <input
                    type={field.type}"""

new_render_fallback = """                ) : field.type === 'file' ? (
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber/10 file:text-amber hover:file:bg-amber/20"
                  />
                ) : (
                  <input
                    type={field.type}"""

text = text.replace(old_render_fallback, new_render_fallback)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

