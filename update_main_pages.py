import glob
import os

files = glob.glob('frontend/src/features/**/*Page.jsx', recursive=True)

original = 'text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-6'
new_h1 = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-6 break-words hyphens-auto'

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    if original in text:
        text = text.replace(original, new_h1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Updated {filepath}")

