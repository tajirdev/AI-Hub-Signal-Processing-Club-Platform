import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

resources_config = """    },
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

text = text.replace('    }\n  };', resources_config)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

