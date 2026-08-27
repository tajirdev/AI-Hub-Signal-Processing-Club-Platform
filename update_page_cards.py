import os

filepath = 'frontend/src/features/research/ResearchPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace(
    '<ResearchCard research={research} />',
    '<ResearchCard research={research} className="w-full sm:w-full md:w-full" />'
)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

filepath = 'frontend/src/features/resources/ResourcesPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace(
    '<ResourceCard resource={resource} />',
    '<ResourceCard resource={resource} className="w-full sm:w-full md:w-full" />'
)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

