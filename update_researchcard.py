import re

filepath = 'frontend/src/components/cards/ResearchCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Title
text = text.replace(
    '<h3 className="text-xl font-heading font-black text-navy dark:text-white mb-3 group-hover:text-amber transition-colors line-clamp-2">',
    '<h3 className="text-xl font-heading font-black text-navy dark:text-white mb-3 group-hover:text-amber transition-colors line-clamp-2 break-words">'
)

# Fix Abstract
text = text.replace(
    '<div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">',
    '<div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed break-words">'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

