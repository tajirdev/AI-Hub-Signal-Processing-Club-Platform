import os

filepath = 'frontend/src/features/events/EventsPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace(
    'Explore the latest papers, studies, and academic contributions published by our technical subgroups.',
    'Join our upcoming workshops, hackathons, and guest speaker sessions.'
)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

filepath_blog = 'frontend/src/features/blog/BlogPage.jsx'
with open(filepath_blog, 'r', encoding='utf-8') as f:
    text_blog = f.read()
text_blog = text_blog.replace(
    'Explore the latest papers, studies, and academic contributions published by our technical subgroups.',
    'Read our latest articles, tutorials, and club announcements.'
)
with open(filepath_blog, 'w', encoding='utf-8') as f:
    f.write(text_blog)

