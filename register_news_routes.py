import os

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add imports if missing
if 'NewsPage' not in text:
    text = text.replace(
        "import { BlogDetailsPage } from './features/blog/BlogDetailsPage';",
        "import { BlogDetailsPage } from './features/blog/BlogDetailsPage';\nimport { NewsPage } from './features/news/NewsPage';\nimport { NewsDetailsPage } from './features/news/NewsDetailsPage';"
    )

# Add routes
if 'path="/news"' not in text:
    text = text.replace(
        '<Route path="/blog" element={<BlogPage />} />',
        '<Route path="/blog" element={<BlogPage />} />\n              <Route path="/news" element={<NewsPage />} />'
    )
    text = text.replace(
        '<Route path="/blog/:id" element={<BlogDetailsPage />} />',
        '<Route path="/blog/:id" element={<BlogDetailsPage />} />\n              <Route path="/news/:id" element={<NewsDetailsPage />} />'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

