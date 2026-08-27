import re

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'MemberProfilePage' not in text:
    text = text.replace(
        "import { MembersPage } from './features/members/MembersPage';",
        "import { MembersPage } from './features/members/MembersPage';\nimport { MemberProfilePage } from './features/members/MemberProfilePage';"
    )

# Add route
if '<Route path="/members/:id" element={<MemberProfilePage />} />' not in text:
    text = text.replace(
        '<Route path="/members" element={<MembersPage />} />',
        '<Route path="/members" element={<MembersPage />} />\n          <Route path="/members/:id" element={<MemberProfilePage />} />'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

