import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure getSubgroups is imported
if 'getSubgroups' not in text:
    text = text.replace(
        'uploadContentMedia } from',
        'uploadContentMedia, getSubgroups } from'
    )

# Try replacing blogs completely
old_blogs = """    blogs: {
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

new_blogs = """    blogs: {
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

text = text.replace(old_blogs, new_blogs)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
