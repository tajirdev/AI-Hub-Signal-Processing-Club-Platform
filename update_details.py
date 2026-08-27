import os

def process_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    for old, new in replacements:
        text = text.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

# Fix Blog Details
blog_details_fixes = [
    ('setResearch', 'setPost'),
    ('post.abstract', 'post.excerpt'),
    ('post.file?.path', 'post.featured_image?.path'),
    ('post.publication_date', 'post.published_at'),
    ('Authors', 'Author'),
    ('post.authors.map', '[post.author].filter(Boolean).map'), # fallback mapping if author exists
    ('Research paper', 'Blog post')
]
process_file('frontend/src/features/blog/BlogDetailsPage.jsx', blog_details_fixes)

# Fix Event Details
event_details_fixes = [
    ('setResearch', 'setEvent'),
    ('event.abstract', 'event.description'),
    ('event.file?.path', 'event.cover?.path'),
    ('event.publication_date', 'event.event_date'),
    ('Authors', 'Details'),
    ('Research paper', 'Event'),
    ('event.authors && event.authors.length > 0', 'event.location'), # remove author mapping loop for events, we'll manually fix the jsx below
]
process_file('frontend/src/features/events/EventDetailsPage.jsx', event_details_fixes)

