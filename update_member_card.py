import re

filepath = 'frontend/src/components/cards/MemberCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace <a href="#" ... onClick={(e) => e.preventDefault()}
if 'import { Link }' not in text:
    text = text.replace("import { ArrowRight, CheckCircle } from 'lucide-react';", "import { ArrowRight, CheckCircle } from 'lucide-react';\nimport { Link } from 'react-router-dom';")

text = re.sub(
    r'<a\s+href="#"([\s\S]*?)onClick=\{\(e\) => e\.preventDefault\(\)\}\s*>',
    r'<Link\n          to={`/members/${member.id}`}\1>',
    text
)
text = text.replace('</a>', '</Link>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

