import re

filepath = 'frontend/src/components/cards/MemberCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the role definitions
text = text.replace(
    "const isSuperAdmin = roles.includes('super_admin');\n  const isMentor = roles.includes('mentor'); // Assuming 'mentor' is a role",
    "const isAdmin = roles.includes('super_admin') || roles.includes('admin');\n  const isEditor = roles.includes('editor');"
)

# Dark mode checkmarks
dark_checkmarks = """{isAdmin && <CheckCircle className="w-4 h-4 text-[#ffba08]" />}
              {isEditor && !isAdmin && <CheckCircle className="w-4 h-4 text-blue-400" />}"""
text = re.sub(
    r'\{isSuperAdmin && <CheckCircle className="w-4 h-4 text-\[#ffba08\]" />\}\s*\{isMentor && !isSuperAdmin && <CheckCircle className="w-4 h-4 text-white" />\}',
    dark_checkmarks,
    text,
    count=1
)

# Light mode checkmarks
light_checkmarks = """{isAdmin && <CheckCircle className="w-4 h-4 text-[#ffba08]" />}
            {isEditor && !isAdmin && <CheckCircle className="w-4 h-4 text-blue-500" />}"""
text = re.sub(
    r'\{isSuperAdmin && <CheckCircle className="w-4 h-4 text-\[#ffba08\]" />\}\s*\{isMentor && !isSuperAdmin && <CheckCircle className="w-4 h-4 text-\[#0a2472\]" />\}',
    light_checkmarks,
    text,
    count=1
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

