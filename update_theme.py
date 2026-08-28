import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

original_theme_effect = """  useEffect(() => {
    // Check local storage or system preference on mount
    if (localStorage.getItem('theme-mode') === 'dark' || 
       (!localStorage.getItem('theme-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      const t = setTimeout(() => setIsDarkTheme(true), 0);
      document.documentElement.classList.add('dark');
      return () => clearTimeout(t);
    }
  }, []);"""

new_theme_effect = """  useEffect(() => {
    // Check local storage on mount (Default to light mode)
    if (localStorage.getItem('theme-mode') === 'dark') {
      const t = setTimeout(() => setIsDarkTheme(true), 0);
      document.documentElement.classList.add('dark');
      return () => clearTimeout(t);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkTheme(false);
    }
  }, []);"""

if original_theme_effect in text:
    text = text.replace(original_theme_effect, new_theme_effect)
else:
    print("Could not find the exact theme effect string.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

