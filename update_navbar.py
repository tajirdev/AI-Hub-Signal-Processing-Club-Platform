import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Original classes
original_classes = """        <nav className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          mobileMenuOpen 
            ? 'bg-transparent py-3' 
            : isScrolled 
              ? 'bg-white/90 dark:bg-[#071225]/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3' 
              : 'bg-transparent py-5'
        )}>"""

# New classes (always solid)
new_classes = """        <nav className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white dark:bg-[#071225] border-b border-gray-100 dark:border-gray-800',
          mobileMenuOpen ? 'py-3' : isScrolled ? 'py-3 shadow-sm' : 'py-5 shadow-sm'
        )}>"""

if original_classes in text:
    text = text.replace(original_classes, new_classes)
else:
    print("Could not find the exact original_classes block.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

