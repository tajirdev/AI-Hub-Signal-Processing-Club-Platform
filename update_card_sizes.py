import os

filepath = 'frontend/src/components/cards/BlogCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"snap-start shrink-0 w-[280px] sm:w-[320px] md:w-auto",',
    '"w-[85vw] sm:w-[320px] md:w-[350px] shrink-0 snap-start",'
)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

filepath = 'frontend/src/components/cards/EventCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"relative w-[320px] shrink-0 snap-start',
    '"relative w-[85vw] sm:w-[320px] md:w-[350px] shrink-0 snap-start'
)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

