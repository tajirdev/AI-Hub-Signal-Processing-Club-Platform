import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'ManageContentTab' not in text:
    text = text.replace(
        "import { EditProfileForm } from \"./components/EditProfileForm\";",
        "import { EditProfileForm } from \"./components/EditProfileForm\";\nimport { ManageContentTab } from \"./components/ManageContentTab\";"
    )

old_manage = r'\{activeTab === "manage" && canManageContent && \([\s\S]*?\}'
new_manage = """{activeTab === "manage" && canManageContent && (
          <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
            <ManageContentTab profile={profile} />
          </div>
        )}"""

# We have to be careful with regex replacement of the manage tab
# Actually let's just find where it starts and ends
import textwrap

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
in_manage = False
bracket_count = 0

for line in lines:
    if '{activeTab === "manage" && canManageContent && (' in line:
        in_manage = True
        bracket_count = 1
        out_lines.append("""        {activeTab === "manage" && canManageContent && (
          <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
            <ManageContentTab profile={profile} />
          </div>
        )}\n""")
        continue
        
    if in_manage:
        # naive bracket counting for the JSX block
        bracket_count += line.count('(') - line.count(')')
        if bracket_count <= 0:
            in_manage = False
        continue
        
    out_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(''.join(out_lines))

