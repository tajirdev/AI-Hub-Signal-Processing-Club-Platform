import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add button
text = re.sub(
    r'(Manage Content\s+</button>\s+)}\s+</div>)',
    r'\1\n              {isAdmin && (\n                <button\n                  onClick={() => setActiveTab("newsletter")}\n                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${\n                    activeTab === "newsletter" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"\n                  }`}\n                >\n                  Subscribers\n                </button>\n              )}',
    text
)

# Add tab content
text = re.sub(
    r'(<ManageContentTab profile={profile} />\s+</div>\s+)}',
    r'\1\n\n          {activeTab === "newsletter" && isAdmin && (\n            <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">\n              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Newsletter Subscribers</h2>\n              <NewsletterAdminTab />\n            </div>\n          )}',
    text
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
