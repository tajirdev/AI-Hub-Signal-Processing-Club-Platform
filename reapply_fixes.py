import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add try-catch to file upload
old_upload = """      const fileField = config.fields.find(f => f.type === 'file');
      if (fileField && formData[fileField.name] instanceof File && itemId) {
        await uploadContentMedia(config.endpoint, itemId, formData[fileField.name]);
      }"""
new_upload = """      const fileField = config.fields.find(f => f.type === 'file');
      if (fileField && formData[fileField.name] instanceof File && itemId) {
        try {
          await uploadContentMedia(config.endpoint, itemId, formData[fileField.name]);
        } catch (uploadErr) {
          console.error("Upload failed", uploadErr);
          alert(`Success! However, the file upload failed. \\n\\nWarning: You likely uploaded an unsupported file format (e.g., a PDF instead of an image). \\n\\nThe content was saved, but the image was not attached.`);
        }
      }"""
text = text.replace(old_upload, new_upload)

# Add accept to input
old_input = r'<input\s+type="file"\s+name=\{field\.name\}\s+onChange=\{handleChange\}\s+required=\{field\.required\}\s+className="([^"]+)"\s+/>'
new_input = r'<input type="file" name={field.name} onChange={handleChange} required={field.required} accept={field.accept || "image/*,application/pdf"} className="\1" />'
text = re.sub(old_input, new_input, text)

# Add author_ids injection
old_payload = """        payload[f.name] = val;
      });"""
new_payload = """        payload[f.name] = val;
      });
      
      // Inject author_ids for research if missing
      if (categoryId === 'research' && memberId) {
        payload.author_ids = [memberId];
      }
      """
text = text.replace(old_payload, new_payload)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
