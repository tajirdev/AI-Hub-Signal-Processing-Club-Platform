import re

files = [
    'frontend/src/features/projects/ProjectDetailsPage.jsx',
    'frontend/src/features/events/EventDetailsPage.jsx',
    'frontend/src/features/resources/ResourceDetailsPage.jsx',
    'frontend/src/features/research/ResearchDetailsPage.jsx'
]

original = 'text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6'
new_h1 = 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6 break-words'

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    if original in text:
        text = text.replace(original, new_h1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Updated {filepath}")
    else:
        print(f"Could not find exact match in {filepath}")

