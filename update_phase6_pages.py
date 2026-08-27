import os
import re

def process_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    for old, new in replacements:
        text = text.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

# BlogPage.jsx
blog_page = [
    ('ResearchPage', 'BlogPage'),
    ('fetchResearch', 'fetchBlogPosts'),
    ('ResearchCard', 'BlogCard'),
    ('research', 'post'),
    ('Research Hub', 'Blog & News'),
    ('Explore our latest papers, publications, and academic investigations.', 'Read our latest articles, tutorials, and club announcements.'),
    ('Search publications...', 'Search articles...'),
    ('featured_post', 'featured'),
]
process_file('frontend/src/features/blog/BlogPage.jsx', blog_page)

# BlogDetailsPage.jsx
blog_details = [
    ('ResearchDetailsPage', 'BlogDetailsPage'),
    ('fetchResearchById', 'fetchBlogPostById'),
    ('research', 'post'),
    ('Research not found', 'Post not found'),
    ('Back to Research', 'Back to Blog'),
    ('/research', '/blog'),
    ('abstract', 'excerpt'), # maybe blog has excerpt instead of abstract
    ('Publication', 'Article'),
    ('Download PDF', 'Read Full'),
]
process_file('frontend/src/features/blog/BlogDetailsPage.jsx', blog_details)

# EventsPage.jsx
events_page = [
    ('ResearchPage', 'EventsPage'),
    ('fetchResearch', 'fetchEvents'),
    ('ResearchCard', 'EventCard'),
    ('research', 'event'),
    ('Research Hub', 'Events Calendar'),
    ('Explore our latest papers, publications, and academic investigations.', 'Join our upcoming workshops, hackathons, and guest speaker sessions.'),
    ('Search publications...', 'Search events...'),
]
process_file('frontend/src/features/events/EventsPage.jsx', events_page)

# EventDetailsPage.jsx
event_details = [
    ('ResearchDetailsPage', 'EventDetailsPage'),
    ('fetchResearchById', 'fetchEventById'),
    ('research', 'event'),
    ('Research not found', 'Event not found'),
    ('Back to Research', 'Back to Events'),
    ('/research', '/events'),
    ('Publication', 'Event'),
]
process_file('frontend/src/features/events/EventDetailsPage.jsx', event_details)

