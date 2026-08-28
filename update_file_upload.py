import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add `accept` to config fields
text = text.replace(
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" },\n      { name: "cover_image", label: "Cover Image", type: "file" }',
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" },\n      { name: "cover_image", label: "Cover Image", type: "file", accept: "image/*" }'
)
text = text.replace(
    '{ name: "status", label: "Status", type: "select", options: ["active", "completed", "archived"], default: "active" },\n      { name: "cover_image", label: "Cover Image", type: "file" }',
    '{ name: "status", label: "Status", type: "select", options: ["active", "completed", "archived"], default: "active" },\n      { name: "cover_image", label: "Cover Image", type: "file", accept: "image/*" }'
)
text = text.replace(
    '{ name: "is_published", label: "Published?", type: "checkbox", default: false },\n      { name: "cover_image", label: "Cover Image / Document", type: "file" }',
    '{ name: "is_published", label: "Published?", type: "checkbox", default: false },\n      { name: "cover_image", label: "Cover Image / Document", type: "file", accept: "image/*,application/pdf" }'
)
text = text.replace(
    '{ name: "is_published", label: "Published?", type: "checkbox", default: false },\n      { name: "cover_image", label: "Cover Image", type: "file" }',
    '{ name: "is_published", label: "Published?", type: "checkbox", default: false },\n      { name: "cover_image", label: "Cover Image", type: "file", accept: "image/*" }'
)

# 2. Update file input to use `accept`
old_input = """                    <input
                      type="file"
                      name={field.name}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber/10 file:text-amber hover:file:bg-amber/20"
                    />"""

new_input = """                    <input
                      type="file"
                      name={field.name}
                      onChange={handleChange}
                      required={field.required}
                      accept={field.accept}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-amber focus:border-amber outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber/10 file:text-amber hover:file:bg-amber/20"
                    />"""

text = text.replace(old_input, new_input)

# 3. Wrap uploadContentMedia in try-catch
old_upload = """      const fileField = config.fields.find(f => f.type === 'file');
      if (fileField && formData[fileField.name] instanceof File && itemId) {
        await uploadContentMedia(config.endpoint, itemId, formData[fileField.name]);
      }
      
      onSuccess();"""

new_upload = """      const fileField = config.fields.find(f => f.type === 'file');
      if (fileField && formData[fileField.name] instanceof File && itemId) {
        try {
          await uploadContentMedia(config.endpoint, itemId, formData[fileField.name]);
        } catch (uploadErr) {
          console.error("Upload failed", uploadErr);
          alert(`Success! However, the file upload failed. \\n\\nWarning: You likely uploaded an unsupported file format (e.g., a PDF instead of an image). \\n\\nThe content was saved, but the image was not attached.`);
        }
      }
      
      onSuccess();"""

text = text.replace(old_upload, new_upload)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

