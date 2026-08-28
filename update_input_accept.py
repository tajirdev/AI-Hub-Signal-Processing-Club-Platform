import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace input with accept attribute
old_input = r'<input\s+type="file"\s+name=\{field\.name\}\s+onChange=\{handleChange\}\s+required=\{field\.required\}\s+className="([^"]+)"\s+/>'
new_input = r'<input type="file" name={field.name} onChange={handleChange} required={field.required} accept={field.accept || "image/*,application/pdf"} className="\1" />'

text = re.sub(old_input, new_input, text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

