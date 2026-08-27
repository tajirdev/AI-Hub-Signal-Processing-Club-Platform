import re
import glob

files = [
    'frontend/src/features/projects/ProjectDetailsPage.jsx',
    'frontend/src/features/research/ResearchDetailsPage.jsx',
    'frontend/src/features/subgroups/SubgroupDetailsPage.jsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Replace import
    text = text.replace("import { MemberCard } from '../../components/cards/MemberCard';", "import { CompactMemberCard } from '../../components/cards/CompactMemberCard';")
    
    # Replace JSX component
    text = text.replace("<MemberCard member={member} />", "<CompactMemberCard member={member} />")
    text = text.replace("<MemberCard member={author.member} />", "<CompactMemberCard member={author.member} />")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

