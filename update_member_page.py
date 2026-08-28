import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add Import
text = text.replace("import { ManageContentTab } from './components/ManageContentTab';", "import { ManageContentTab } from './components/ManageContentTab';\nimport { NewsletterAdminTab } from './components/NewsletterAdminTab';")

# Add button
old_button = """              {canManageContent && (
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === "manage" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Manage Content
                </button>
              )}"""

new_button = """              {canManageContent && (
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === "manage" ? "border-amber text-amber" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
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
              )}"""

text = text.replace(old_button, new_button)

# Add tab content
old_tab = """          {activeTab === "manage" && canManageContent && (
            <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
              <ManageContentTab profile={profile} />
            </div>
          )}"""

new_tab = """          {activeTab === "manage" && canManageContent && (
            <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Content Management</h2>
              <ManageContentTab profile={profile} />
            </div>
          )}

          {activeTab === "newsletter" && isAdmin && (
            <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Newsletter Subscribers</h2>
              <NewsletterAdminTab />
            </div>
          )}"""

text = text.replace(old_tab, new_tab)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

