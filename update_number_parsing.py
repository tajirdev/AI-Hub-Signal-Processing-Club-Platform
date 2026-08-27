import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_cleanup = """      // Clean up empty strings for optional URL fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === "") {
          payload[key] = null;
        }
      });"""

new_cleanup = """      // Clean up empty strings for optional URL fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === "") {
          payload[key] = null;
        } else if (key.endsWith("_id") && payload[key] !== null) {
          payload[key] = parseInt(payload[key], 10);
        }
      });"""

text = text.replace(old_cleanup, new_cleanup)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

