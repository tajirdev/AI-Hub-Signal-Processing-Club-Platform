import os

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Imports
if "import { BlogPage }" not in text:
    text = text.replace(
        "import { ContactPage } from './features/contact/ContactPage';",
        "import { ContactPage } from './features/contact/ContactPage';\nimport { BlogPage } from './features/blog/BlogPage';\nimport { BlogDetailsPage } from './features/blog/BlogDetailsPage';\nimport { EventsPage } from './features/events/EventsPage';\nimport { EventDetailsPage } from './features/events/EventDetailsPage';"
    )

# Replace Routes
text = text.replace(
    '<Route path="/blog" element={<PlaceholderPage title="Blog & News" />} />',
    '<Route path="/blog" element={<BlogPage />} />'
)
text = text.replace(
    '<Route path="/blog/:id" element={<PlaceholderPage title="Blog Post" />} />',
    '<Route path="/blog/:id" element={<BlogDetailsPage />} />'
)
text = text.replace(
    '<Route path="/events" element={<PlaceholderPage title="Events Calendar" />} />',
    '<Route path="/events" element={<EventsPage />} />'
)
text = text.replace(
    '<Route path="/events/:id" element={<PlaceholderPage title="Event Details" />} />',
    '<Route path="/events/:id" element={<EventDetailsPage />} />'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

