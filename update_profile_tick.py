import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add CheckCircle to imports
text = text.replace(
    'import { Mail, Phone, Code, Globe, Briefcase, ArrowLeft, Calendar } from "lucide-react";',
    'import { Mail, Phone, Code, Globe, Briefcase, ArrowLeft, Calendar, CheckCircle } from "lucide-react";'
)

# Add roles booleans
roles_logic = """  const user = profile.user || {};
  const roles = user.roles || [];
  const isAdmin = roles.includes('super_admin') || roles.includes('admin');
  const isEditor = roles.includes('editor');"""
text = text.replace('  const user = profile.user || {};', roles_logic)

# Add ticks to heading
old_heading = """                <h1 className="text-xl font-bold mt-4 text-navy dark:text-white">
                  {name}
                </h1>"""
new_heading = """                <h1 className="text-xl font-bold mt-4 text-navy dark:text-white flex items-center justify-center gap-1.5">
                  {name}
                  {isAdmin && <CheckCircle className="w-5 h-5 text-[#ffba08]" />}
                  {isEditor && !isAdmin && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </h1>"""
text = text.replace(old_heading, new_heading)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

