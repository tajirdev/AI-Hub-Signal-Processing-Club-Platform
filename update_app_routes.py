import os

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

# Add imports
imports = '''
import { ProjectsPage } from './features/projects/ProjectsPage';
import { ProjectDetailsPage } from './features/projects/ProjectDetailsPage';
import { SubgroupsPage } from './features/subgroups/SubgroupsPage';
import { SubgroupDetailsPage } from './features/subgroups/SubgroupDetailsPage';
'''
# We will inject the imports before export default function App()
if 'import { ProjectsPage }' not in content:
    content = content.replace('export default function App()', imports + 'export default function App()')

# Replace Placeholder routes
content = content.replace('<Route path="/projects" element={<PlaceholderPage title="Projects Archive" />} />', '<Route path="/projects" element={<ProjectsPage />} />')
content = content.replace('<Route path="/projects/:id" element={<PlaceholderPage title="Project Details" />} />', '<Route path="/projects/:id" element={<ProjectDetailsPage />} />')
content = content.replace('<Route path="/sub-groups" element={<PlaceholderPage title="Sub-Groups" />} />', '<Route path="/sub-groups" element={<SubgroupsPage />} />')
content = content.replace('<Route path="/sub-groups/:id" element={<PlaceholderPage title="Sub-Group Details" />} />', '<Route path="/sub-groups/:slug" element={<SubgroupDetailsPage />} />')

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
