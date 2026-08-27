import re

filepath = 'frontend/src/components/cards/NewsCard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "{news.author?.first_name || 'Admin'}",
    "{news.user?.first_name || news.author?.first_name || 'Admin'}"
)

# And how to show the time it was posted?
# The schema has `created_at` or `published_at`.
# Let's add a date string.

old_date_html = """          {/* Category + author */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#0a2472]/10 dark:border-white/10">"""

new_date_html = """          {/* Category + author */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#0a2472]/10 dark:border-white/10">
            <div className="flex flex-col gap-1">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold tracking-wide w-fit"
                style={{ backgroundColor: colorTheme.bg, color: colorTheme.text }}
              >
                {categoryName}
              </span>
              <span className="text-[10px] font-semibold text-navy/50 dark:text-gray-500 uppercase tracking-wider ml-1">
                {news.created_at ? new Date(news.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
              </span>
            </div>"""

# Remove the old category span because we nested it
old_category_span = """            <span
              className="rounded-full px-3 py-1 text-xs font-bold tracking-wide"
              style={{ backgroundColor: colorTheme.bg, color: colorTheme.text }}
            >
              {categoryName}
            </span>"""

new_category_span = ""

# Since we nested the span in new_date_html, we must remove the old span cleanly.
# Wait, replacing them in steps is safer.

text = text.replace(old_date_html, new_date_html)
text = text.replace(old_category_span, new_category_span)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

