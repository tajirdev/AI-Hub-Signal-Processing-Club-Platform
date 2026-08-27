import os

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

imports = '''
import { ProjectsPage } from './features/projects/ProjectsPage';
import { ProjectDetailsPage } from './features/projects/ProjectDetailsPage';
import { SubgroupsPage } from './features/subgroups/SubgroupsPage';
import { SubgroupDetailsPage } from './features/subgroups/SubgroupDetailsPage';
'''

text = imports + text

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
