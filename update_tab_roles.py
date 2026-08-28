import re

filepath = 'frontend/src/features/members/components/ManageContentTab.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add useAuth import
if 'useAuth' not in text:
    text = text.replace(
        "import { deleteContent } from '../../../services/endpoints';",
        "import { deleteContent } from '../../../services/endpoints';\nimport { useAuth } from '../../../contexts/AuthContext';"
    )

# Use useAuth in component
if 'const { user } = useAuth();' not in text:
    text = text.replace(
        "const [deletingId, setDeletingId] = useState(null);",
        "const [deletingId, setDeletingId] = useState(null);\n  const { user } = useAuth();\n  const isSuperAdmin = user?.roles?.includes('super_admin');"
    )

# Filter categories
old_categories = """  const categories = [
    { id: "events", label: "Events", icon: Calendar, data: profile.events || [], endpoint: 'events' },
    { id: "news", label: "News", icon: Rss, data: profile.news || [], endpoint: 'News' },
    { id: "projects", label: "Projects", icon: Code, data: profile.projects || [], endpoint: 'projects' },
    { id: "research", label: "Research", icon: BookOpen, data: profile.research || [], endpoint: 'research' },
    { id: "blogs", label: "Blogs", icon: FileText, data: profile.blogs || [], endpoint: 'blog-posts' },
  ];"""

new_categories = """  const categories = [
    { id: "events", label: "Events", icon: Calendar, data: profile.events || [], endpoint: 'events' },
    { id: "news", label: "News", icon: Rss, data: profile.news || [], endpoint: 'News' },
    { id: "projects", label: "Projects", icon: Code, data: profile.projects || [], endpoint: 'projects' },
    ...(isSuperAdmin ? [{ id: "research", label: "Research", icon: BookOpen, data: profile.research || [], endpoint: 'research' }] : []),
    { id: "blogs", label: "Blogs", icon: FileText, data: profile.blogs || [], endpoint: 'blog-posts' },
  ];"""

text = text.replace(old_categories, new_categories)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

