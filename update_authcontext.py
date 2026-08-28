import re

filepath = 'frontend/src/contexts/AuthContext.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('logout();\n            }', "logout();\n              window.location.href = '/';\n            }")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

