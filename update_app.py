import re

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'AboutPage' not in content:
    content = content.replace("import { HomePage } from './features/home/HomePage';", "import { HomePage } from './features/home/HomePage';\nimport { AboutPage } from './features/about/AboutPage';")

# Replace the Route
content = re.sub(
    r'<Route path="/about" element=\{<PlaceholderPage title="About Us" />\} />',
    '<Route path="/about" element={<AboutPage />} />',
    content
)

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
