import os

# Fix NewsCard
filepath = 'frontend/src/components/cards/NewsCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('BlogCard', 'NewsCard')
text = text.replace('post', 'news')
text = text.replace('news.excerpt', 'news.summary')
text = text.replace('Blog Post', 'News Article')
text = text.replace('/blog/', '/news/')
text = text.replace('news.featured_image', 'news.cover_image') # Assuming news has some image or we just use null

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

# Fix NewsPage
filepath = 'frontend/src/features/news/NewsPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('BlogPage', 'NewsPage')
text = text.replace('fetchBlogPosts', 'fetchNews')
text = text.replace('BlogCard', 'NewsCard')
text = text.replace('setBlogList', 'setNewsList')
text = text.replace('loadBlogPosts', 'loadNews')
text = text.replace('blogList', 'newsList')
text = text.replace('post', 'newsItem')
text = text.replace('data.posts', 'data.news')
text = text.replace('Blog & News', 'News Hub')
text = text.replace('AI & Signal Processing Hub | Blog', 'AI & Signal Processing Hub | News')
text = text.replace('Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-blue-600 dark:from-amber dark:to-orange-500">Blog</span>', 'Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-blue-600 dark:from-amber dark:to-orange-500">News</span>')
text = text.replace('Read our latest articles, tutorials, and club announcements.', 'Stay updated with our recent press releases, achievements, and club updates.')
text = text.replace('Search articles...', 'Search news...')
text = text.replace('Loading articles...', 'Loading news...')
text = text.replace('No articles found', 'No news found')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

# Fix NewsDetailsPage
filepath = 'frontend/src/features/news/NewsDetailsPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('BlogDetailsPage', 'NewsDetailsPage')
text = text.replace('fetchBlogPostById', 'fetchNewsById')
text = text.replace('setPost', 'setNews')
text = text.replace('post.', 'newsItem.')
text = text.replace('!post', '!newsItem')
text = text.replace('post =', 'newsItem =')
text = text.replace('[post,', '[newsItem,')
text = text.replace('Blog post not found', 'News article not found')
text = text.replace('Loading article...', 'Loading news...')
text = text.replace('The requested article', 'The requested news article')
text = text.replace('Post Not Found', 'News Not Found')
text = text.replace('/blog', '/news')
text = text.replace('Back to Blog', 'Back to News')
text = text.replace('Article', 'News')
text = text.replace('newsItem.excerpt', 'newsItem.summary')
text = text.replace('newsItem.featured_image', 'newsItem.cover_image') # if news doesn't have an image, it will just not render it.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

