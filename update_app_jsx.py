import re

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'MembersPage' not in text:
    text = text.replace(
        "import { AboutPage } from './features/about/AboutPage';",
        "import { AboutPage } from './features/about/AboutPage';\nimport { MembersPage } from './features/members/MembersPage';"
    )

# Add route
if '<Route path="/members" element={<MembersPage />} />' not in text:
    text = text.replace(
        '<Route path="/about" element={<AboutPage />} />',
        '<Route path="/about" element={<AboutPage />} />\n          <Route path="/members" element={<MembersPage />} />'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

