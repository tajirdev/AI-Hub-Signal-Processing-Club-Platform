import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

if 'ensureExternalUrl' not in text:
    text = "import { ensureExternalUrl } from '../../utils/url';\n" + text

text = text.replace('href={profile.github}', 'href={ensureExternalUrl(profile.github)}')
text = text.replace('href={profile.portfolio}', 'href={ensureExternalUrl(profile.portfolio)}')
text = text.replace('href={profile.linkedin}', 'href={ensureExternalUrl(profile.linkedin)}')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
