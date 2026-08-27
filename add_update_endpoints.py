import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write("\nexport const updateUserMe = async (data) => {\n  const res = await api.put('/users/me', data);\n  return res.data;\n};\n")
    f.write("\nexport const updateMemberMe = async (data) => {\n  const res = await api.patch('/member/me', data);\n  return res.data;\n};\n")
    f.write("\nexport const uploadAvatar = async (file) => {\n  const formData = new FormData();\n  formData.append('file', file);\n  const res = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });\n  return res.data;\n};\n")

