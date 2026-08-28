import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add Tab Button
old_btn = """                >
                  Manage Content
                </button>
              )}
            </div>
          )}"""

new_btn = """                >
                  Manage Content
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("newsletter")}
                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === "newsletter" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Subscribers
                </button>
              )}
            </div>
          )}"""

text = text.replace(old_btn, new_btn)

# 2. Add Tab Content
old_content = """              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
              <ManageContentTab profile={profile} />
            </div>
          )}"""

new_content = """              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
              <ManageContentTab profile={profile} />
            </div>
          )}

          {activeTab === "newsletter" && isAdmin && (
            <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800 mt-6">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Newsletter Subscribers</h2>
              <NewsletterAdminTab />
            </div>
          )}"""

text = text.replace(old_content, new_content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

