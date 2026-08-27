import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_event_fields = """    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "event_date", label: "Event Date", type: "date", required: true },
      { name: "registration_link", label: "Registration Link", type: "url" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" }
    ]"""

new_event_fields = """    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "event_date", label: "Event Date", type: "date", required: true },
      { name: "registration_link", label: "Registration Link", type: "url" },
      { name: "category_id", label: "Category ID (Optional)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published", "completed", "cancelled"], default: "draft" }
    ]"""

text = text.replace(old_event_fields, new_event_fields)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

