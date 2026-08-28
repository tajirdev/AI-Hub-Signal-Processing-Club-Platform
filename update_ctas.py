import re

files = [
    'frontend/src/features/home/components/JoinCTASection.jsx',
    'frontend/src/features/home/components/StatsSection.jsx',
    'frontend/src/features/join/components/JoinCTA.jsx',
    'frontend/src/features/about/components/AboutCTA.jsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Simple regex to replace text-4xl
    text = re.sub(r'text-4xl (md:text-5xl|md:text-6xl)', r'text-3xl sm:text-4xl \1 break-words hyphens-auto', text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Updated {filepath}")

