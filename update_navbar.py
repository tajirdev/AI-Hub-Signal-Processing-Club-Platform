import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

if 'import { getImageUrl }' not in text:
    text = text.replace(
        "import { Link, useLocation } from 'react-router-dom';",
        "import { Link, useLocation } from 'react-router-dom';\nimport { getImageUrl } from '../../services/api';"
    )

old_desktop_auth = """              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 py-1.5 px-4 rounded-full border border-gray-100 dark:border-gray-700">
                    <User className="w-4 h-4 text-navy dark:text-amber" />
                    <span className="text-sm font-bold text-navy dark:text-white truncate max-w-[100px]">
                      {user?.user_name || 'Member'}
                    </span>
                  </div>
                  <button 
                    onClick={logout}"""

new_desktop_auth = """              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/members/me"
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 py-1.5 pl-1.5 pr-4 rounded-full border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {user?.avatar_url ? (
                      <img 
                        src={getImageUrl(user.avatar_url)} 
                        alt={user.user_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-navy/10 dark:bg-amber/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-navy dark:text-amber" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-navy dark:text-white truncate max-w-[100px]">
                      {user?.user_name || 'Member'}
                    </span>
                  </Link>
                  <button 
                    onClick={logout}"""

old_mobile_auth = """                {isAuthenticated ? (
                  <div className="flex flex-col gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 justify-center mb-2">
                      <User className="w-5 h-5 text-navy dark:text-amber" />
                      <span className="font-bold text-navy dark:text-white">
                        {user?.user_name || 'Member'}
                      </span>
                    </div>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}"""

new_mobile_auth = """                {isAuthenticated ? (
                  <div className="flex flex-col gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Link 
                      to="/members/me"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 justify-center mb-2 hover:opacity-80 transition-opacity"
                    >
                      {user?.avatar_url ? (
                        <img 
                          src={getImageUrl(user.avatar_url)} 
                          alt={user.user_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-navy/10 dark:bg-amber/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-navy dark:text-amber" />
                        </div>
                      )}
                      <span className="font-bold text-navy dark:text-white">
                        {user?.user_name || 'Member'}
                      </span>
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}"""

text = text.replace(old_desktop_auth, new_desktop_auth)
text = text.replace(old_mobile_auth, new_mobile_auth)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
