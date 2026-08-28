import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Import getSubgroups
if 'getSubgroups' not in text:
    text = text.replace(
        'uploadContentMedia } from',
        'uploadContentMedia, getSubgroups } from'
    )

# Add resources config
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

# Update useEffect for fetching options
old_effect = """              if (field.type === 'dynamic_select') {
                const data = await getCategories(categoryId === 'events' || categoryId === 'news' ? categoryId : '');
                setDynamicOptions(prev => ({ ...prev, [field.name]: data }));
              }"""
new_effect = """              if (field.type === 'dynamic_select') {
                const data = await getCategories(categoryId === 'events' || categoryId === 'news' ? categoryId : '');
                setDynamicOptions(prev => ({ ...prev, [field.name]: data }));
              }
              if (field.type === 'dynamic_select_subgroup') {
                const data = await getSubgroups();
                setDynamicOptions(prev => ({ ...prev, [field.name]: data }));
              }"""
text = text.replace(old_effect, new_effect)

# Update render to handle dynamic_select_subgroup
old_render = """                ) : field.type === 'dynamic_select' ? ("""
new_render = """                ) : field.type === 'dynamic_select' || field.type === 'dynamic_select_subgroup' ? ("""
text = text.replace(old_render, new_render)

# Update upload wrapper in ContentFormModal to hit resources endpoint
# For resources, what is the file upload endpoint?
# Let's check `backend/app/routes/resources.py`

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
