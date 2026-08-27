import os

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Imports
if "import { ResearchPage }" not in text:
    text = text.replace(
        "import { ContactPage } from './features/contact/ContactPage';",
        "import { ContactPage } from './features/contact/ContactPage';\nimport { ResearchPage } from './features/research/ResearchPage';\nimport { ResearchDetailsPage } from './features/research/ResearchDetailsPage';\nimport { ResourcesPage } from './features/resources/ResourcesPage';\nimport { ResourceDetailsPage } from './features/resources/ResourceDetailsPage';"
    )

# Replace Routes
text = text.replace(
    '<Route path="/research" element={<PlaceholderPage title="Research Publications" />} />',
    '<Route path="/research" element={<ResearchPage />} />'
)
text = text.replace(
    '<Route path="/research/:id" element={<PlaceholderPage title="Research Details" />} />',
    '<Route path="/research/:id" element={<ResearchDetailsPage />} />'
)
text = text.replace(
    '<Route path="/resources" element={<PlaceholderPage title="Resources" />} />',
    '<Route path="/resources" element={<ResourcesPage />} />\n            <Route path="/resources/:id" element={<ResourceDetailsPage />} />'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

