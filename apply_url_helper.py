import os
import re

def update_file(filepath, patterns):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    modified = False
    if 'ensureExternalUrl' not in text:
        # Find where to insert import
        import_stmt = "import { ensureExternalUrl } from '../../utils/url';\n"
        if '../../utils/url' not in text and '../utils/url' not in text:
            import_stmt = "import { ensureExternalUrl } from '../../utils/url';\n"
            text = import_stmt + text
    
    for pattern, replacement in patterns:
        if pattern in text:
            text = text.replace(pattern, replacement)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)

# Events
update_file('frontend/src/features/events/EventDetailsPage.jsx', [
    ('href={event.registration_link}', 'href={ensureExternalUrl(event.registration_link)}')
])

# Projects
update_file('frontend/src/features/projects/ProjectDetailsPage.jsx', [
    ('href={project.repository_url}', 'href={ensureExternalUrl(project.repository_url)}'),
    ('href={project.demo_url}', 'href={ensureExternalUrl(project.demo_url)}')
])
update_file('frontend/src/components/cards/ProjectCard.jsx', [
    ('href={project.repository_url}', 'href={ensureExternalUrl(project.repository_url)}'),
    ('href={project.demo_url}', 'href={ensureExternalUrl(project.demo_url)}')
])

# Resources
update_file('frontend/src/features/resources/ResourceDetailsPage.jsx', [
    ('href={resource.external_url}', 'href={ensureExternalUrl(resource.external_url)}')
])

# Research
update_file('frontend/src/features/research/ResearchDetailsPage.jsx', [
    ('href={research.external_url}', 'href={ensureExternalUrl(research.external_url)}')
])
