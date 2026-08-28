import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"<nav className=\{cn\([^>]*\)\}>"
replacement = """<nav className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white dark:bg-[#071225] border-b border-gray-100 dark:border-gray-800',
        isScrolled ? 'py-3 shadow-md' : 'py-5 shadow-sm'
      )}>"""

text = re.sub(pattern, replacement, text, flags=re.MULTILINE | re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
