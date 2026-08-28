import re

filepath = 'frontend/src/features/home/components/HeroSection.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '<br className="hidden md:block"/>',
    '<br className="block"/>'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

