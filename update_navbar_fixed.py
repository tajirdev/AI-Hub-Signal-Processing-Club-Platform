import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add getImageUrl import if needed
if 'import { getImageUrl }' not in text:
    text = text.replace(
        "import { Link, useLocation } from 'react-router-dom';",
        "import { Link, useLocation } from 'react-router-dom';\nimport { getImageUrl } from '../../services/api';"
    )

# Replace Desktop Navbar logic
old_desktop = """            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
                  <User className="w-4 h-4 text-navy dark:text-amber" />
                  <span className="text-sm font-bold text-navy dark:text-white truncate max-w-[100px]">
                    {user?.user_name || 'Member'}
                  </span>
                </div>
                <button 
                  onClick={logout}"""

new_desktop = """            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/members/me"
                  className="flex items-center gap-2 px-1.5 py-1.5 pr-4 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {user?.avatar_url ? (
                    <img 
                      src={getImageUrl(user.avatar_url)} 
                      alt={user.user_name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-navy/10 dark:bg-amber/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-navy dark:text-amber" />
                    </div>
                  )}
                  <span className="text-sm font-bold text-navy dark:text-white truncate max-w-[100px]">
                    {user?.user_name || 'Member'}
                  </span>
                </Link>
                <button 
                  onClick={logout}"""

# Replace Mobile Navbar logic
old_mobile = """            {isAuthenticated ? (
                <div className="flex flex-col gap-3 px-2 mt-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
                    <User className="w-5 h-5 text-navy dark:text-amber" />
                    <span className="font-bold text-navy dark:text-white">
                      {user?.user_name || 'Member'}
                    </span>
                  </div>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}"""

new_mobile = """            {isAuthenticated ? (
                <div className="flex flex-col gap-3 px-2 mt-2">
                  <Link 
                    to="/members/me"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user?.avatar_url ? (
                      <img 
                        src={getImageUrl(user.avatar_url)} 
                        alt={user.user_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-navy/10 dark:bg-amber/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-navy dark:text-amber" />
                      </div>
                    )}
                    <span className="font-bold text-navy dark:text-white">
                      {user?.user_name || 'Member'}
                    </span>
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}"""

text = text.replace(old_desktop, new_desktop)
text = text.replace(old_mobile, new_mobile)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

