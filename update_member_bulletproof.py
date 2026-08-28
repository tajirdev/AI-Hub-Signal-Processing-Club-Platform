filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    
    # 1. Add button after Manage Content button
    if "Manage Content" in line and "</button>" in lines[i+1]:
        # Skip down to where the closing tags for this block are
        pass
        
    if "Manage Content" in lines[i-1] and "</button>" in line:
        # We are at </button>
        # Next line is )}
        pass
        
    if "Manage Content" in lines[i-2] and "</button>" in lines[i-1] and ")}" in line:
        new_lines.append('              {isAdmin && (\n')
        new_lines.append('                <button\n')
        new_lines.append('                  onClick={() => setActiveTab("newsletter")}\n')
        new_lines.append('                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${\n')
        new_lines.append('                    activeTab === "newsletter" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"\n')
        new_lines.append('                  }`}\n')
        new_lines.append('                >\n')
        new_lines.append('                  Subscribers\n')
        new_lines.append('                </button>\n')
        new_lines.append('              )}\n')

    # 2. Add Tab content after ManageContentTab block
    if "<ManageContentTab profile={profile} />" in lines[i-1] and "</div>" in line:
        pass
        
    if "<ManageContentTab profile={profile} />" in lines[i-2] and "</div>" in lines[i-1] and ")}" in line:
        new_lines.append('\n')
        new_lines.append('          {activeTab === "newsletter" && isAdmin && (\n')
        new_lines.append('            <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">\n')
        new_lines.append('              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Newsletter Subscribers</h2>\n')
        new_lines.append('              <NewsletterAdminTab />\n')
        new_lines.append('            </div>\n')
        new_lines.append('          )}\n')

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
