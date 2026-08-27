import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write("\n")
    f.write("// Dynamic CRUD Endpoints\n")
    f.write("export const createContent = async (type, data) => {\n")
    f.write("  const res = await api.post(`/${type}`, data);\n")
    f.write("  return res.data;\n")
    f.write("};\n\n")
    f.write("export const updateContent = async (type, id, data) => {\n")
    f.write("  const res = await api.put(`/${type}/my/${id}`, data).catch(async () => {\n")
    f.write("    // Fallback if the endpoint uses a different naming convention\n")
    f.write("    return (await api.put(`/${type}/${id}`, data)).data;\n")
    f.write("  });\n")
    f.write("  return res.data || res;\n")
    f.write("};\n\n")
    f.write("export const deleteContent = async (type, id) => {\n")
    f.write("  const res = await api.delete(`/${type}/my/${id}`).catch(async () => {\n")
    f.write("    return (await api.delete(`/${type}/${id}`)).data;\n")
    f.write("  });\n")
    f.write("  return res.data || res;\n")
    f.write("};\n\n")

