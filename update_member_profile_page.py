import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'EditProfileForm' not in text:
    text = text.replace(
        "import { LoadingState, ErrorState } from \"../../components/ui/States\";",
        "import { LoadingState, ErrorState } from \"../../components/ui/States\";\nimport { EditProfileForm } from \"./components/EditProfileForm\";"
    )

# Calculate canManageContent
if 'const canManageContent =' not in text:
    text = text.replace(
        "const isOwner = profile.is_owner;",
        "const isOwner = profile.is_owner;\n  const isMentorOrAbove = user.roles?.some(r => ['mentor', 'editor', 'super_admin'].includes(r));\n  const canManageContent = isOwner && isMentorOrAbove;"
    )

# Hide Manage Content tab button if not canManageContent
text = text.replace(
    """            <button
              onClick={() => setActiveTab("manage")}""",
    """            {canManageContent && (
              <button
                onClick={() => setActiveTab("manage")}"""
)
text = text.replace(
    """              >
                Manage Content
              </button>
          </div>
        )}""",
    """              >
                Manage Content
              </button>
            )}
          </div>
        )}"""
)

# Replace the Mock settings UI with EditProfileForm
settings_regex = r'\{activeTab === "settings" && \([\s\S]*?Edit Profile \(Mock\)[\s\S]*?</div>\s*\)\}'
new_settings = """{activeTab === "settings" && (
          <div className="rounded-3xl bg-white dark:bg-[#0a1628] shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Edit Profile</h2>
            <EditProfileForm 
              profile={profile} 
              onUpdate={() => window.location.reload()} 
            />
          </div>
        )}"""

text = re.sub(settings_regex, new_settings, text)

# Just to make sure we don't accidentally hide the content div
if '{activeTab === "manage" && canManageContent &&' not in text:
  text = text.replace(
      '{activeTab === "manage" && (',
      '{activeTab === "manage" && canManageContent && ('
  )


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

