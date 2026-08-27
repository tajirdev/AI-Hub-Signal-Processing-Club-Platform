import re

files = [
    'frontend/src/features/projects/ProjectDetailsPage.jsx',
    'frontend/src/features/research/ResearchDetailsPage.jsx',
    'frontend/src/features/subgroups/SubgroupDetailsPage.jsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    text = re.sub(r'<MemberCard', '<CompactMemberCard', text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

