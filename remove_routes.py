import os

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove imports
text = text.replace("import { BlogDetailsPage } from './features/blog/BlogDetailsPage';\n", "")
text = text.replace("import { NewsDetailsPage } from './features/news/NewsDetailsPage';\n", "")

# Remove routes
text = text.replace('<Route path="/blog/:id" element={<BlogDetailsPage />} />\n', "")
text = text.replace('<Route path="/news/:id" element={<NewsDetailsPage />} />\n', "")

# Clean up any leftover spaces if needed, but simple replace should work.
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

