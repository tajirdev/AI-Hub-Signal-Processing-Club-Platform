import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write("\nexport const getSubgroups = async () => {\n")
    f.write("  const res = await api.get('/sub-groups');\n")
    f.write("  return res.data;\n")
    f.write("};\n")
