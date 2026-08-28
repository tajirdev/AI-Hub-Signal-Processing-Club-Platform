filepath = 'frontend/src/features/subgroups/SubgroupDetailsPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

original = 'text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-4 leading-tight'
new_h1 = 'text-2xl sm:text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-4 leading-tight break-words'

text = text.replace(original, new_h1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated SubgroupDetailsPage")
