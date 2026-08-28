import re

filepath = 'frontend/src/components/cards/NewsCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Title
text = text.replace(
    '<h3 className="text-xl md:text-2xl font-black font-heading leading-snug text-navy dark:text-white mb-2">',
    '<h3 className="text-xl md:text-2xl font-black font-heading leading-snug text-navy dark:text-white mb-2 break-words line-clamp-2">'
)

# Fix Slug
text = text.replace(
    '<span className="inline-block rounded-full px-3 py-1 text-xs font-mono bg-[#0a2472]/5 dark:bg-white/5 text-navy dark:text-amber">',
    '<span className="inline-block rounded-full px-3 py-1 text-xs font-mono bg-[#0a2472]/5 dark:bg-white/5 text-navy dark:text-amber break-all line-clamp-1">'
)

# Fix Summary
text = text.replace(
    '<p className="text-base italic font-semibold text-navy/70 dark:text-gray-300 mb-2">',
    '<p className="text-base italic font-semibold text-navy/70 dark:text-gray-300 mb-2 break-words line-clamp-2">'
)

# Fix Content
text = text.replace(
    '<p className="text-sm leading-relaxed text-navy/60 dark:text-gray-400  mb-6 flex-grow">',
    '<p className="text-sm leading-relaxed text-navy/60 dark:text-gray-400 mb-6 flex-grow break-words line-clamp-3">'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

