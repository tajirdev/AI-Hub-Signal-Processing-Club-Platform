import re

with open('frontend/src/components/layout/Navbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the About group with a single link
content = re.sub(
    r"\{\s*label:\s*'About',\s*items:\s*\[[\s\S]*?\]\s*,?\s*\},",
    "{ label: 'About Us', href: '/about' },",
    content
)

with open('frontend/src/components/layout/Navbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
