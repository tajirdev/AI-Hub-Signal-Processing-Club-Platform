import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write("\n")
    f.write("export const uploadContentMedia = async (type, id, file) => {\n")
    f.write("  const formData = new FormData();\n")
    f.write("  formData.append('file', file);\n")
    f.write("  \n")
    f.write("  let endpoint = `/${type}/${id}/cover`;\n")
    f.write("  if (type === 'research') endpoint = `/${type}/${id}/file`;\n")
    f.write("  if (type === 'blog-posts') endpoint = `/${type}/${id}`; // Backend specific\n")
    f.write("  \n")
    f.write("  const res = await api.post(endpoint, formData, {\n")
    f.write("    headers: {\n")
    f.write("      'Content-Type': 'multipart/form-data',\n")
    f.write("    },\n")
    f.write("  });\n")
    f.write("  return res.data;\n")
    f.write("};\n")

