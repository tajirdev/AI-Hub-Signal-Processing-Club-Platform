import os

filepath = 'frontend/src/features/subgroups/SubgroupDetailsPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

target = """              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-4">
                <Link to="/join" className="inline-flex items-center px-6 py-3 bg-amber text-navy font-bold rounded-full hover:bg-amber-hover transition-colors shadow-lg shadow-amber/20">
                  Apply to Join this Subgroup
                </Link>
              </div>"""

replacement = """              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-6">
                <Link to="/join" className="inline-flex items-center px-6 py-3 bg-amber text-navy font-bold rounded-full hover:bg-amber-hover transition-colors shadow-lg shadow-amber/20 shrink-0">
                  Apply to Join this Subgroup
                </Link>

                {subgroup.leader && (
                  <div className="flex items-center gap-3 md:pl-4 md:border-l border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                      {subgroup.leader.avatar_url ? (
                        <img src={getImageUrl(subgroup.leader.avatar_url)} alt={subgroup.leader.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {subgroup.leader.first_name ? subgroup.leader.first_name[0] : <Users className="w-5 h-5" />}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Subgroup Leader</p>
                      <p className="text-sm font-bold text-navy dark:text-white">
                        {subgroup.leader.first_name} {subgroup.leader.last_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>"""

if target in text:
    text = text.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully replaced.")
else:
    print("Target not found.")

